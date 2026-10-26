import { isDateISO } from "../../src/booking/time.js";
import { replacementDayOverrides, validCalendarWindows, strictCalendarInstant } from "../../src/booking/calendar.js";
import { newId, listOverrides, listRules } from "./repo.js";

// Compare and replace inside ONE D1 transaction, including the comparison.
// Override rows are immutable in the existing API, so the exact id set is a
// complete revision token. Service/location-specific exceptions remain intact.
export async function replaceDayAvailability(db, body, now) {
  const { date, windows, expectedIds, inherit } = body || {};
  if (!isDateISO(date) || !Array.isArray(expectedIds) || expectedIds.length > 200
    || expectedIds.some(id => typeof id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(id))
    || new Set(expectedIds).size !== expectedIds.length
    || (inherit !== true && (!validCalendarWindows(windows) || windows.some(w => strictCalendarInstant(date, w.start_minute) == null || strictCalendarInstant(date, w.end_minute) == null)))) return { invalid: true };
  const wanted = inherit === true
    ? [{ kind: "CLOSED", start_minute: null, end_minute: null, active: 0 }]
    : replacementDayOverrides(windows);
  const ids = wanted.map(() => newId("ov"));
  const scope = "date_local = ? AND service_id IS NULL AND location_id IS NULL AND active = 1";
  const matches = `(SELECT COUNT(*) FROM booking_availability_overrides WHERE ${scope}) = ?`
    + (expectedIds.length ? ` AND NOT EXISTS (SELECT 1 FROM booking_availability_overrides WHERE ${scope} AND id NOT IN (${expectedIds.map(() => "?").join(",")}))` : "");
  const matchArgs = [date, expectedIds.length, ...(expectedIds.length ? [date, ...expectedIds] : [])];
  const firstExists = "EXISTS (SELECT 1 FROM booking_availability_overrides WHERE id = ?)";
  const stmts = wanted.map((w, i) => db.prepare(`INSERT INTO booking_availability_overrides
    (id,date_local,start_minute,end_minute,kind,service_id,location_id,note,active,created_at)
    SELECT ?,?,?,?,?,NULL,NULL,'',?,? WHERE ${i === 0 ? matches : firstExists}`)
    .bind(ids[i], date, w.start_minute, w.end_minute, w.kind, w.active ?? 1, now, ...(i === 0 ? matchArgs : [ids[0]])));
  stmts.push(db.prepare(`DELETE FROM booking_availability_overrides WHERE ${scope}
    AND id NOT IN (${ids.map(() => "?").join(",")}) AND ${firstExists}`).bind(date, ...ids, ids[0]));
  const readIndex = stmts.length;
  stmts.push(db.prepare("SELECT id FROM booking_availability_overrides WHERE id = ?").bind(ids[0]));
  if (inherit === true) stmts.push(db.prepare("DELETE FROM booking_availability_overrides WHERE id = ?").bind(ids[0]));
  const results = await db.batch(stmts);
  if (!results[readIndex]?.results?.length) return { conflict: true };
  return { overrides: await listOverrides(db, date, date) };
}

// Optional revision for the existing whole-week editor. Older callers remain
// compatible; the calendar sends the exact active id set it displayed.
export async function replaceWeekAvailability(db, rules, expectedIds, now) {
  if (!Array.isArray(expectedIds) || expectedIds.length > 200 || expectedIds.some(id => typeof id !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) || new Set(expectedIds).size !== expectedIds.length) return { invalid: true };
  const wanted = rules.length ? rules : [{ weekday: 0, start_minute: 0, end_minute: 5, active: 0 }];
  const ids = wanted.map(() => newId("ar"));
  const condition = "(SELECT COUNT(*) FROM booking_availability_rules WHERE active=1)=?"
    + (expectedIds.length ? ` AND NOT EXISTS (SELECT 1 FROM booking_availability_rules WHERE active=1 AND id NOT IN (${expectedIds.map(() => "?").join(",")}))` : "");
  const marker = "EXISTS (SELECT 1 FROM booking_availability_rules WHERE id=?)";
  const statements = wanted.map((r, i) => db.prepare(`INSERT INTO booking_availability_rules
    (id,weekday,start_minute,end_minute,service_id,location_id,valid_from,valid_until,active,created_at,updated_at)
    SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE ${i === 0 ? condition : marker}`)
    .bind(ids[i], Number(r.weekday), Number(r.start_minute), Number(r.end_minute), r.service_id ? String(r.service_id).slice(0, 64) : null, r.location_id ? String(r.location_id).slice(0, 64) : null,
      isDateISO(r.valid_from) ? r.valid_from : null, isDateISO(r.valid_until) ? r.valid_until : null, r.active === 0 || r.active === false ? 0 : 1, now, now, ...(i === 0 ? [expectedIds.length, ...expectedIds] : [ids[0]])));
  statements.push(db.prepare(`DELETE FROM booking_availability_rules WHERE active=1 AND id NOT IN (${ids.map(() => "?").join(",")}) AND ${marker}`).bind(...ids, ids[0]));
  const check = statements.length;
  statements.push(db.prepare("SELECT id FROM booking_availability_rules WHERE id=?").bind(ids[0]));
  if (!rules.length) statements.push(db.prepare("DELETE FROM booking_availability_rules WHERE id=?").bind(ids[0]));
  const result = await db.batch(statements);
  if (!result[check]?.results?.length) return { conflict: true };
  return { rules: await listRules(db) };
}
