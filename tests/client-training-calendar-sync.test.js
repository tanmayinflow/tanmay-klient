import { test } from "node:test";
import assert from "node:assert/strict";
import { clientTrainingCalendarSnapshot, applyClientTrainingCalendarSnapshot, clientTrainingEventId, syncClientTrainingCalendar } from "../src/shared/product/trainingCalendarSync.js";

const key = JSON.stringify(["plan", "session"]), path = "/calendars/own/events";
const stamp = { tmApp: "1", tmKind: "clientTraining", tmKey: key };
function fixture() {
  let coll = { tv2: { delivered: { plans: [{ id: "plan", name: "My plan", sessions: [{ id: "session", templateId: "template", date: "2026-10-27" }] }], templates: [{ id: "template", name: "Mobility" }] }, sched: {}, sessions: [] }, cal: { clientId: "own-id" }, journal: [{ id: "private" }] };
  const events = new Map(), calls = [];
  let before = null, count = 0;
  const request = async (url, options) => {
    calls.push({ url, options: structuredClone(options) });
    if (before) await before(url, options);
    if (url.includes("?")) return { items: [...events.values()].map(event => structuredClone(event)) };
    const id = url.startsWith(path + "/") ? decodeURIComponent(url.slice(path.length + 1)) : null;
    if (!options) {
      if (!events.has(id)) throw Object.assign(new Error("not-found"), { status: 404 });
      return structuredClone(events.get(id));
    }
    if (options.method === "POST") {
      if (events.has(options.body.id)) throw Object.assign(new Error("already-exists"), { status: 409 });
      const event = { ...structuredClone(options.body), etag: "v" + ++count };
      events.set(event.id, event); return structuredClone(event);
    }
    const current = events.get(id);
    if (options.headers?.["If-Match"] !== current?.etag) throw Object.assign(new Error("precondition"), { status: 412 });
    const event = { ...current, ...structuredClone(options.body), etag: "v" + ++count };
    events.set(id, event); return structuredClone(event);
  };
  const st = {
    getClientTrainingCalendar: () => clientTrainingCalendarSnapshot(coll),
    updateClientTrainingCalendar: async change => {
      const current = clientTrainingCalendarSnapshot(coll), next = change(current);
      if (next === current) return false;
      coll = applyClientTrainingCalendarSnapshot(coll, next); return true;
    },
  };
  const run = options => syncClientTrainingCalendar({ st, cfg: { trenink: true }, calId: "own", request, from: "2026-10-01", to: "2026-12-01", ...options });
  return { run, st, events, calls, request, data: () => coll, change: fn => { coll = fn(coll); }, before: fn => { before = fn; } };
}
const moveLocal = (f, date) => f.change(coll => ({ ...coll, tv2: { ...coll.tv2, sched: { plan: { session: date } } } }));
const moveRemote = (f, date) => { const [id, event] = [...f.events][0]; f.events.set(id, { ...event, start: { date }, end: { date: new Date(Date.parse(date + "T12:00:00Z") + 86400000).toISOString().slice(0, 10) }, etag: "remote-edit" }); };

test("scheduled workouts create one stable owned all-day event and repeated sync is idempotent", async () => {
  const f = fixture(), original = f.data();
  const first = await f.run(), second = await f.run();
  assert.equal(first.exported, 1);
  assert.equal(second.changes, 0);
  assert.equal(f.events.size, 1);
  const [event] = f.events.values();
  assert.equal(event.id, await clientTrainingEventId("plan", "session"));
  assert.deepEqual(event.extendedProperties.private, stamp);
  assert.deepEqual(event.start, { date: "2026-10-27" });
  assert.deepEqual(event.end, { date: "2026-10-28" });
  assert.strictEqual(f.data().tv2.delivered, original.tv2.delivered);
  assert.strictEqual(f.data().tv2.sessions, original.tv2.sessions);
  assert.strictEqual(f.data().journal, original.journal);
});

test("Google whole-day move changes only own date override with the same event ID", async () => {
  const f = fixture(); await f.run(); const original = f.data(), [id] = f.events.keys();
  moveRemote(f, "2026-11-03");
  const result = await f.run();
  assert.equal(result.imported, 1);
  assert.equal(f.data().tv2.sched.plan.session, "2026-11-03");
  assert.equal(f.data().tv2.delivered.plans[0].sessions[0].date, "2026-10-27");
  assert.strictEqual(f.data().tv2.delivered, original.tv2.delivered);
  assert.equal([...f.events.keys()][0], id);
  assert.equal((await f.run()).changes, 0);
});

test("Google cancellation overrides a default prescribed date with an explicit empty own date", async () => {
  const f = fixture(); await f.run(); const [id, event] = [...f.events][0];
  f.events.set(id, { ...event, status: "cancelled", etag: "deleted" });
  assert.equal((await f.run()).imported, 1);
  assert.equal(f.data().tv2.sched.plan.session, "");
  assert.equal(f.data().tv2.delivered.plans[0].sessions[0].date, "2026-10-27");
  assert.equal((await f.run()).changes, 0);
  assert.equal(f.events.size, 1);
});

test("app date moves use etag and preserve Google-only title and notes", async () => {
  const f = fixture(); await f.run(); const [id, event] = [...f.events][0];
  f.events.set(id, { ...event, summary: "My calendar label", description: "Keep this note", etag: "latest" });
  moveLocal(f, "2026-11-04");
  assert.equal((await f.run()).exported, 1);
  assert.equal(f.events.get(id).start.date, "2026-11-04");
  assert.equal(f.events.get(id).summary, "My calendar label");
  assert.equal(f.events.get(id).description, "Keep this note");
  assert.equal(f.calls.filter(call => call.options?.method === "PATCH").at(-1).options.headers["If-Match"], "latest");
});

test("simultaneous app and Google moves stay untouched and report conflict", async () => {
  const f = fixture(); await f.run(); moveLocal(f, "2026-11-03"); moveRemote(f, "2026-11-05");
  const result = await f.run();
  assert.deepEqual(result.conflicts, [key]);
  assert.equal(f.data().tv2.sched.plan.session, "2026-11-03");
  assert.equal([...f.events.values()][0].start.date, "2026-11-05");
});

test("a local edit arriving during Google fetch cannot be overwritten", async () => {
  const f = fixture(); await f.run(); moveRemote(f, "2026-11-05");
  f.before(url => { if (url.includes("?")) moveLocal(f, "2026-11-07"); });
  const result = await f.run();
  assert.deepEqual(result.conflicts, [key]);
  assert.equal(f.data().tv2.sched.plan.session, "2026-11-07");
});

test("a workout started during the atomic import keeps its actual snapshot and date", async () => {
  const f = fixture(); await f.run(); moveRemote(f, "2026-11-05");
  const update = f.st.updateClientTrainingCalendar;
  f.st.updateClientTrainingCalendar = async change => {
    f.change(coll => ({ ...coll, tv2: { ...coll.tv2, sessions: [{ id: "record", planId: "plan", planSessionId: "session", date: "2026-10-27", state: "running", exercises: [{ id: "work" }] }] } }));
    return update(change);
  };
  const result = await f.run();
  assert.deepEqual(result.conflicts, [key]);
  assert.equal(f.data().tv2.sched.plan, undefined);
  assert.equal(f.data().tv2.sessions[0].date, "2026-10-27");
});

test("already running and completed sessions are never moved or exported as fresh scheduled workouts", async () => {
  for (const state of ["running", "done"]) {
    const f = fixture(); await f.run(); moveRemote(f, "2026-11-05");
    f.change(coll => ({ ...coll, tv2: { ...coll.tv2, sessions: [{ id: "actual", planId: "plan", planSessionId: "session", date: "2026-10-28", state, endedAt: 42 }] } }));
    const before = structuredClone(f.data().tv2);
    const result = await f.run();
    assert.equal(result.changes, 0);
    assert.deepEqual(f.data().tv2, before);
  }
});

test("arbitrary Google events cannot become workouts; a marker/ID collision is not overwritten", async () => {
  const f = fixture(), id = await clientTrainingEventId("plan", "session");
  f.events.set(id, { id, summary: "Someone else's event", start: { date: "2026-10-27" }, end: { date: "2026-10-28" }, etag: "foreign" });
  const result = await f.run();
  assert.deepEqual(result.conflicts, [key]);
  assert.equal(f.data().tv2.sessions.length, 0);
  assert.deepEqual(f.data().tv2.sched, {});
  assert.equal(f.calls.filter(call => call.options).length, 0);
});

test("timed or multi-day Google edits report conflict instead of inventing session times", async () => {
  for (const dates of [{ start: { dateTime: "2026-11-05T12:00:00Z" }, end: { dateTime: "2026-11-05T13:00:00Z" } }, { start: { date: "2026-11-05" }, end: { date: "2026-11-08" } }]) {
    const f = fixture(); await f.run(); const [id, event] = [...f.events][0];
    f.events.set(id, { ...event, ...dates, etag: "changed" });
    assert.deepEqual((await f.run()).conflicts, [key]);
    assert.deepEqual(f.data().tv2.sched, {});
  }
});

test("a 412 concurrent Google edit cannot overwrite either side", async () => {
  const f = fixture(); await f.run(); moveLocal(f, "2026-11-05");
  f.before((url, options) => { if (options?.method === "PATCH") { const [id, event] = [...f.events][0]; f.events.set(id, { ...event, etag: "raced" }); } });
  assert.deepEqual((await f.run()).conflicts, [key]);
  assert.equal([...f.events.values()][0].start.date, "2026-10-27");
  assert.equal(f.data().cal.clientTrainingSync.own[key].date, "2026-10-27");
});

test("failed calendar read is not deletion, and a retried successful insert is adopted without duplication", async () => {
  const f = fixture();
  assert.equal((await f.run({ request: async () => { throw new Error("offline"); } })).errors, 1);
  assert.deepEqual(f.data().tv2.sched, {});
  const id = await clientTrainingEventId("plan", "session");
  f.events.set(id, { id, start: { date: "2026-10-27" }, end: { date: "2026-10-28" }, extendedProperties: { private: stamp }, etag: "saved-before-crash" });
  assert.equal((await f.run()).changes, 0);
  assert.equal(f.data().cal.clientTrainingSync.own[key].eventId, id);
  assert.equal(f.events.size, 1);
});

test("the deleted-event lookup uses its prior receipt, while a failed lookup leaves the own date untouched", async () => {
  const f = fixture(); await f.run(); f.events.clear();
  const failed = await f.run({ request: async (url, options) => {
    if (url.includes("?")) return { items: [] };
    if (!options) throw new Error("offline lookup");
    return f.request(url, options);
  } });
  assert.equal(failed.errors, 1);
  assert.deepEqual(f.data().tv2.sched, {});
  assert.equal((await f.run()).imported, 1);
  assert.equal(f.data().tv2.sched.plan.session, "");
});

test("insert collision outside the list window recovers only the matching owned date", async () => {
  const f = fixture(), id = await clientTrainingEventId("plan", "session");
  f.events.set(id, { id, start: { date: "2026-10-27" }, end: { date: "2026-10-28" }, extendedProperties: { private: stamp }, etag: "saved" });
  const result = await f.run({ request: (url, options) => url.includes("?") ? Promise.resolve({ items: [] }) : f.request(url, options) });
  assert.equal(result.errors, 0);
  assert.equal(f.events.size, 1);
  assert.equal(f.data().cal.clientTrainingSync.own[key].etag, "saved");
  assert.equal(f.calls.filter(call => call.options?.method === "PATCH").length, 0);
});

test("delivered bilingual template names are used for the initial calendar label", async () => {
  const f = fixture();
  f.change(coll => ({ ...coll, tv2: { ...coll.tv2, delivered: { ...coll.tv2.delivered, templates: [{ id: "template", cz: "Ranní mobilita", en: "Morning mobility" }] } } }));
  await f.run({ L: (cs, en) => cs || en });
  assert.equal([...f.events.values()][0].summary, "Ranní mobilita");
});
