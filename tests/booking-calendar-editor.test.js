import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { makeD1 } from "./helpers/env.js";
import { seedBooking, givePackage, at } from "./helpers/seed.js";
import { handleCoach, handleClient } from "../worker/booking/api.js";
import { replaceDayAvailability } from "../worker/booking/dayAvailability.js";
import { dayWindows, slotsForDay } from "../src/booking/slots.js";
import { hhmm, localDayLengthMin, startOfLocalDay, endOfLocalDay } from "../src/booking/time.js";
import { calendarEventLanes, calendarDayItems, validCalendarWindows, strictCalendarInstant, calendarWallInstants, calendarSelectionInstant, calendarServiceLocations } from "../src/booking/calendar.js";
import { createBooking } from "../worker/booking/engine.js";

const TZ = "Europe/Prague", DATE = "2026-09-07";
beforeEach(t => t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-01T08:00:00Z") }));
async function setup() { const db = makeD1(); await seedBooking(db); return db; }
async function coach(db, path, body, method = "PUT") {
  const url = new URL(`https://example.test/api/booking${path}`);
  return handleCoach(new Request(url, { method, ...(body !== undefined ? { headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}) }), { KLIENT_DB: db }, url, {});
}
async function clientSlots(db, date = DATE) {
  const url = new URL(`https://example.test/api/client/booking/slots?serviceId=svc_pt&locationId=loc_studio&from=${date}&days=1`);
  return (await (await handleClient(new Request(url), { DB: db }, url, "a-example-test", {})).json()).days;
}
const body = (windows, expectedIds = []) => ({ date: DATE, windows, expectedIds });
const read = db => db.prepare("SELECT * FROM booking_availability_overrides ORDER BY id").all().then(x => x.results);

test("location-free service keeps no default place and returns real availability; linked service only selects active permitted places", async () => {
  const db = await setup();
  await db.prepare("DELETE FROM booking_service_locations WHERE service_id='svc_pt'").run();
  const services = (await (await coach(db, "/services", undefined, "GET")).json()).services;
  const locations = (await (await coach(db, "/locations", undefined, "GET")).json()).locations;
  const choices = calendarServiceLocations(services.find(s => s.id === "svc_pt"), locations);
  assert.deepEqual(choices, []);
  const locationId = choices[0]?.id || "";
  const response = await coach(db, `/slots?from=${DATE}&days=1&serviceId=svc_pt${locationId ? `&locationId=${locationId}` : ""}`, undefined, "GET");
  assert.equal(response.status, 200);
  assert.ok((await response.json()).days[0].slots.length > 0);
  const retiredFirst = [{ id: "retired", active: 0 }, { id: "unrelated", active: 1 }, { id: "allowed", active: 1 }];
  assert.deepEqual(calendarServiceLocations({ locationIds: ["retired", "allowed"] }, retiredFirst).map(l => l.id), ["allowed"]);
  assert.deepEqual(calendarServiceLocations(undefined, locations), []);
});

test("day edit replaces only that day's generic windows and client gets exactly those starts", async () => {
  const db = await setup();
  const res = await coach(db, "/day-availability", body([{ start_minute: 600, end_minute: 780 }, { start_minute: 840, end_minute: 960 }]));
  assert.equal(res.status, 200);
  const days = await clientSlots(db);
  assert.deepEqual(days[0].slots.map(s => hhmm(s.startsAt, TZ)), ["10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00"]);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM booking_availability_rules").first()).n, 5);
});
test("two simultaneous editors compare inside transaction: one succeeds, one conflicts without lost updates", async () => {
  const db = await setup();
  const responses = await Promise.all([
    coach(db, "/day-availability", body([{ start_minute: 600, end_minute: 720 }])),
    coach(db, "/day-availability", body([{ start_minute: 840, end_minute: 960 }])),
  ]);
  assert.deepEqual(responses.map(x => x.status).sort(), [200, 409]);
  const winner = await responses.find(x => x.status === 200).json();
  assert.deepEqual((await read(db)).map(x => x.id), winner.overrides.map(x => x.id).sort());
  assert.equal((await responses.find(x => x.status === 409).json()).error, "AVAILABILITY_CHANGED");
});
test("stale ids reject deletion and restoration too", async () => {
  const db = await setup();
  await coach(db, "/day-availability", body([]));
  const before = await read(db);
  assert.equal((await coach(db, "/day-availability", { ...body([]), inherit: true })).status, 409);
  assert.deepEqual(await read(db), before);
});
test("whole-week optional revision prevents two editors from overwriting each other", async () => {
  const db = await setup();
  const rules = (await (await coach(db, "/availability", undefined, "GET")).json()).rules;
  const expectedRuleIds = rules.map(r => r.id);
  const responses = await Promise.all([
    coach(db, "/availability", { rules: rules.map(r => ({ ...r, start_minute: 600 })), expectedRuleIds }),
    coach(db, "/availability", { rules: rules.map(r => ({ ...r, start_minute: 660 })), expectedRuleIds }),
  ]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]);
  const kept = (await (await coach(db, "/availability", undefined, "GET")).json()).rules;
  assert.ok(kept.every(r => r.start_minute === kept[0].start_minute));
  assert.equal((await coach(db, "/availability", { rules: [], expectedRuleIds: kept.map(r => r.id) })).status, 200);
  assert.deepEqual((await (await coach(db, "/availability", undefined, "GET")).json()).rules, []);
});
test("duration revision rejects racing edit even when both requests share a millisecond", async () => {
  const db = await setup();
  const current = await db.prepare("SELECT updated_at FROM booking_services WHERE id='svc_pt'").first();
  const results = await Promise.all([
    coach(db, "/services/svc_pt", { expectedUpdatedAt: current.updated_at, duration_min: 45 }, "PATCH"),
    coach(db, "/services/svc_pt", { expectedUpdatedAt: current.updated_at, duration_min: 90 }, "PATCH"),
  ]);
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]);
  const first = await db.prepare("SELECT * FROM booking_services WHERE id='svc_pt'").first();
  assert.equal((await coach(db, "/services/svc_pt", { expectedUpdatedAt: first.updated_at, duration_min: 60 }, "PATCH")).status, 200);
  const second = await db.prepare("SELECT * FROM booking_services WHERE id='svc_pt'").first();
  assert.ok(second.updated_at > first.updated_at);
});
test("weekly CAS uses the same normalized numeric and active values as legacy saves", async () => {
  const db = await setup();
  const rules = (await (await coach(db, "/availability", undefined, "GET")).json()).rules;
  const result = await coach(db, "/availability", { expectedRuleIds: rules.map(r => r.id), rules: [
    { weekday: "1", start_minute: 600.4, end_minute: "720", active: "1" },
    { weekday: "2", start_minute: 600.4, end_minute: "720", active: "0" },
  ] });
  assert.equal(result.status, 200);
  const stored = (await db.prepare("SELECT weekday,start_minute,end_minute,active FROM booking_availability_rules ORDER BY weekday").all()).results;
  assert.deepEqual(stored.map(r => ({ ...r })), [{ weekday: 1, start_minute: 600, end_minute: 720, active: 1 }, { weekday: 2, start_minute: 600, end_minute: 720, active: 0 }]);
});
test("calendar distinguishes Google failure from known empty and recent cached busy windows", async t => {
  const db = await setup();
  const url = new URL(`https://example.test/api/booking/calendar?from=${DATE}&days=1`);
  const env = { KLIENT_DB: db, GOOGLE_CLIENT_ID: "synthetic", GOOGLE_CLIENT_SECRET: "synthetic", GOOGLE_REDIRECT_URI: "https://example.test/callback", GOOGLE_TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64") };
  t.mock.method(globalThis, "fetch", async () => { throw new Error("Synthetic outage; no network"); });
  const readCalendar = async () => (await (await handleCoach(new Request(url), env, url, {})).json());
  assert.equal((await readCalendar()).googleConnected, false);
  await db.prepare("INSERT INTO google_connections (id,owner_id,status,busy_calendar_ids_json,created_at,updated_at) VALUES ('synthetic','primary','CONNECTED','[]',0,0)").run();
  assert.equal((await readCalendar()).googleBusyKnown, true);
  await db.prepare("UPDATE google_connections SET busy_calendar_ids_json='[\"primary\"]'").run();
  const failed = await readCalendar();
  assert.equal(failed.googleConnected, true); assert.equal(failed.googleBusyKnown, false);
  await db.prepare("INSERT INTO booking_blocks (id,starts_at_utc,ends_at_utc,source,fetched_at,created_at,updated_at) VALUES ('cache',?,?,'GOOGLE',?,?,?)").bind(at(DATE, "10:00"), at(DATE, "11:00"), Date.now(), Date.now(), Date.now()).run();
  const cached = await readCalendar();
  assert.equal(cached.googleBusyKnown, true); assert.equal(cached.googleBusy.length, 1);
});
test("clearing day removes client slots; restoring weekly hours removes only generic overrides", async () => {
  const db = await setup();
  await db.prepare("INSERT INTO booking_availability_overrides (id,date_local,start_minute,end_minute,kind,service_id,active,created_at) VALUES ('specific',?,600,660,'CLOSED','svc_req',1,0)").bind(DATE).run();
  const close = await (await coach(db, "/day-availability", body([]))).json();
  assert.deepEqual(await clientSlots(db), []);
  const ids = close.overrides.filter(x => !x.service_id).map(x => x.id);
  assert.equal((await coach(db, "/day-availability", { ...body([], ids), inherit: true })).status, 200);
  assert.equal((await read(db)).length, 1);
  assert.equal((await read(db))[0].id, "specific");
  assert.ok((await clientSlots(db))[0].slots.length > 0);
});
test("invalid overlap, overnight, non-grid and invalid dates never change stored schedule", async () => {
  const db = await setup();
  for (const b of [
    body([{ start_minute: 600, end_minute: 720 }, { start_minute: 660, end_minute: 780 }]),
    body([{ start_minute: 1380, end_minute: 60 }]), body([{ start_minute: 601, end_minute: 720 }]),
    body([{ start_minute: 0, end_minute: 1445 }]), { ...body([]), date: "2026-02-31" },
    { ...body([]), expectedIds: ["same", "same"] }, { ...body([]), expectedIds: ["' OR 1=1"] },
  ]) assert.equal((await coach(db, "/day-availability", b)).status, 400);
  assert.deepEqual(await read(db), []);
  assert.equal(validCalendarWindows([{ start_minute: 540, end_minute: 600 }, { start_minute: 600, end_minute: 660 }]), true);
});
test("a failed statement rolls back the whole replacement", async () => {
  const db = await setup();
  const old = await (await coach(db, "/day-availability", body([]))).json();
  const before = await read(db), batch = db.batch.bind(db);
  db.batch = statements => batch([...statements.slice(0, 1), db.prepare("INSERT INTO missing_table VALUES (1)"), ...statements.slice(1)]);
  await assert.rejects(replaceDayAvailability(db, body([{ start_minute: 540, end_minute: 1020 }], old.overrides.map(x => x.id)), Date.now()));
  assert.deepEqual(await read(db), before);
});
test("manual time off removes client availability, remains private, and preserves an existing booking", async () => {
  const db = await setup(); await givePackage(db, "cl_a", 5);
  const booking = await createBooking(db, { clientId: "cl_a", serviceId: "svc_pt", locationId: "loc_studio", startsAt: at(DATE, "10:00"), now: Date.now(), actor: "COACH", actorId: "owner" });
  const result = await coach(db, "/blocks", { startsAt: at(DATE, "09:00"), endsAt: at(DATE, "12:00"), note: "private synthetic time-off note" }, "POST");
  assert.equal(result.status, 200);
  const resultDays = await clientSlots(db);
  assert.ok(resultDays[0].slots.every(s => s.startsAt >= at(DATE, "12:15")), "service buffer also respects time off");
  assert.ok(!JSON.stringify(resultDays).includes("private synthetic"));
  assert.equal((await db.prepare("SELECT status FROM bookings WHERE id=?").bind(booking.id).first()).status, "CONFIRMED");
});
test("half-open time-off boundary permits adjacent appointment without a service buffer", async () => {
  const db = await setup();
  await db.prepare("UPDATE booking_services SET buffer_before_min=0,buffer_after_min=0 WHERE id='svc_pt'").run();
  await coach(db, "/blocks", { startsAt: at(DATE, "10:00"), endsAt: at(DATE, "11:00") }, "POST");
  const starts = (await clientSlots(db))[0].slots.map(s => hhmm(s.startsAt, TZ));
  assert.ok(starts.includes("09:00") && starts.includes("11:00"));
  assert.ok(!starts.includes("09:30") && !starts.includes("10:00") && !starts.includes("10:30"));
});
test("spring-forward late windows stay at wall-clock 23:30, full days retain true duration", () => {
  for (const [date, minutes] of [["2026-03-29", 1380], ["2026-10-25", 1500]]) {
    assert.equal(localDayLengthMin(date, TZ), minutes);
    const rules = [{ weekday: 0, start_minute: 1380, end_minute: 1410, active: 1 }];
    const windows = dayWindows(date, TZ, rules, [], {});
    assert.deepEqual(windows.map(w => [hhmm(w.s, TZ), hhmm(w.e, TZ)]), [["23:00", "23:30"]]);
    const all = dayWindows(date, TZ, [{ ...rules[0], start_minute: 0, end_minute: 1440 }], [], {});
    assert.equal((all[0].e - all[0].s) / 60000, minutes);
    assert.equal(all[0].e, endOfLocalDay(date, TZ));
  }
});
test("DST nonexistent manual and day-window endpoints refuse instead of silently shifting", async () => {
  assert.equal(strictCalendarInstant("2026-03-29", 150), null);
  assert.ok(strictCalendarInstant("2026-10-25", 150) > 0);
  const db = await setup();
  assert.equal((await coach(db, "/day-availability", { date: "2026-03-29", expectedIds: [], windows: [{ start_minute: 150, end_minute: 240 }] })).status, 400);
});
test("slot duration stays distinct from display/start density through DST", () => {
  const date = "2026-03-29";
  const slots = slotsForDay(date, { tz: TZ, now: startOfLocalDay(date, TZ), rules: [{ weekday: 0, start_minute: 540, end_minute: 720 }], overrides: [], busy: [], service: { id: "s", duration_min: 60, slot_interval_min: 30, min_notice_min: 0 } });
  assert.equal(slots.length, 5);
  assert.ok(slots.every(s => s.end - s.start === 3600000));
});
test("clicked DST repeated-hour instants stay exact; manual ambiguous input requires a choice", () => {
  const first = Date.parse("2026-10-25T00:30:00Z"), second = Date.parse("2026-10-25T01:30:00Z");
  assert.deepEqual(calendarWallInstants("2026-10-25", 150), [first, second]);
  assert.equal(calendarSelectionInstant("2026-10-25", 150, first), first);
  assert.equal(calendarSelectionInstant("2026-10-25", 150, second), second);
  assert.equal(calendarSelectionInstant("2026-10-25", 150), null);
  assert.equal(calendarSelectionInstant("2026-10-25", 150, first + 60000), null);
  const end = Date.parse("2026-10-25T01:15:00Z");
  assert.equal(calendarSelectionInstant("2026-10-25", 135, end) - calendarSelectionInstant("2026-10-25", 150, first), 45 * 60000, "end before start on the wall clock can be a valid forward UTC interval");
  assert.equal(calendarSelectionInstant("2026-03-29", 150), null);
  assert.equal(calendarSelectionInstant(DATE, 600), at(DATE, "10:00"));
});
test("overlapping bookings/blocks remain visible, adjacent events share a lane; cancelled bookings are not busy", () => {
  const result = calendarEventLanes([{ id: "a", startsAt: 10, endsAt: 20 }, { id: "b", startsAt: 15, endsAt: 25 }, { id: "c", startsAt: 25, endsAt: 30 }]);
  assert.deepEqual(result.map(x => [x.lane, x.lanes]), [[0, 2], [1, 2], [0, 1]]);
  const items = calendarDayItems(DATE, { bookings: [{ id: "cancelled", status: "CANCELLED", startsAt: at(DATE, "10:00"), endsAt: at(DATE, "11:00") }], blocks: [{ id: "overnight", startsAt: at("2026-09-06", "23:00"), endsAt: at(DATE, "01:00") }] });
  assert.equal(items.length, 1); assert.equal(items[0].id, "overnight");
});
