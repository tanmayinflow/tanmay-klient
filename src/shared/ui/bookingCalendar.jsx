import { NumberField } from "./NumberField.jsx";
import { ChoiceField } from "./ChoiceField.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TmIcon } from "./icons.jsx";
import * as B from "../../booking/index.js";
import { COACH_CALENDAR_ZONE as ZONE, calendarTime, parseCalendarTime, validCalendarWindows,
  genericDayOverrides, calendarDayWindows, editableDayWindows, calendarDayItems,
  calendarEventLanes, calendarWallInstants, calendarSelectionInstant, calendarServiceLocations } from "../../booking/calendar.js";

const PX = 1.5;
const BODY_FONT = 'var(--tm-font-body, var(--ff-body, "DM Sans", sans-serif))';
const DISPLAY_FONT = 'var(--tm-font-display, var(--ff-display, "EB Garamond", Georgia, serif))';
const genericWeekly = (r, wd) => Number(r.weekday) === wd && !r.service_id && !r.location_id && !r.valid_from && !r.valid_until;

// Coach only. Authentication stays in the existing owner Worker routes.
// Inject the existing fetch/error/theme functions, never account or seed data.
export function createBookingCalendarUI({ useT, L, getLang, fetchBooking, errorCopy, CenterSheet, renderNewBooking }) {
  return function BookingAvailabilityCalendar({ onOpen, onNew, onOpenClient, onServices, refreshToken = 0 }) {
    const { t } = useT();
    const language = getLang();
    const [date, setDate] = useState(() => B.localDateISO(Date.now(), ZONE));
    const [view, setView] = useState("day"), [serviceId, setServiceId] = useState(""), [locationId, setLocationId] = useState("");
    const [catalog, setCatalog] = useState(null), [data, setData] = useState(null), [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true), [error, setError] = useState(null), [reload, setReload] = useState(0);
    const [editor, setEditor] = useState(null), [saving, setSaving] = useState(false), [editError, setEditError] = useState("");
    const [message, setMessage] = useState("");
    const request = useRef(0), editorRef = useRef(null);
    const from = view === "week" ? B.startOfISOWeek(date) : date;
    const days = useMemo(() => Array.from({ length: view === "week" ? 7 : 1 }, (_, i) => B.shiftDateISO(from, i)), [from, view]);
    const service = catalog?.services.find(s => s.id === serviceId);
    const locations = calendarServiceLocations(service, catalog?.locations);
    const effectiveLocationId = locations.find(l => l.id === locationId)?.id || locations[0]?.id || "";
    const name = x => x ? (language === "cs" ? x.name_cs || x.nameCs : x.name_en || x.nameEn) || x.name_cs || x.nameCs || "" : "";
    const dayLabel = d => new Date(`${d}T12:00:00Z`).toLocaleDateString(language === "cs" ? "cs-CZ" : "en-GB", { weekday: "short", day: "numeric", month: "numeric", timeZone: "UTC" });
    const refresh = () => setReload(x => x + 1);
    const describeError = err => err?.code === "AVAILABILITY_CHANGED"
      ? L("Dostupnost mezitím změnilo jiné okno. Obnov kalendář a zkontroluj nový stav.", "Availability changed in another window. Reload the calendar and review the new schedule.")
      : errorCopy(err);
    useEffect(() => {
      let current = true;
      Promise.all([fetchBooking("/services"), fetchBooking("/locations")]).then(([a, b]) => {
        if (!current) return;
        setCatalog({ services: a.services || [], locations: b.locations || [] });
        setServiceId(id => a.services?.some(s => s.active && s.id === id) ? id : a.services?.find(s => s.active)?.id || "");
        setLocationId(id => b.locations?.some(l => l.active && l.id === id) ? id : "");
      }).catch(e => { if (current) { setError(e); setLoading(false); } });
      return () => { current = false; };
    }, [reload, refreshToken]);
    useEffect(() => {
      setLocationId(id => locations.some(l => l.id === id) ? id : "");
    }, [catalog, serviceId]);
    useEffect(() => {
      if (!catalog) return;
      const seq = ++request.current;
      setLoading(true); setError(null); setData(null); setSlots([]);
      const range = `from=${from}&days=${days.length}&tz=${encodeURIComponent(ZONE)}`;
      Promise.all([fetchBooking(`/calendar?${range}`), serviceId
        ? fetchBooking(`/slots?${range}&serviceId=${encodeURIComponent(serviceId)}${effectiveLocationId ? `&locationId=${encodeURIComponent(effectiveLocationId)}` : ""}`)
        : Promise.resolve({ days: [] })]).then(([calendar, available]) => {
        if (seq !== request.current) return;
        setData(calendar); setSlots(available.days || []); setLoading(false);
      }).catch(e => { if (seq === request.current) { setError(e); setLoading(false); } });
      return () => { request.current++; };
    }, [from, days.length, serviceId, effectiveLocationId, catalog, reload, refreshToken]);
    useEffect(() => {
      if (editor) editorRef.current?.focus({ preventScroll: true });
    }, [editor?.type, editor?.date]);

    const btn = { minHeight: 44, border: `1px solid ${t.borderSoft}`, borderRadius: 12, background: "transparent", padding: "8px 12px", color: t.text, font: "inherit", cursor: "pointer" };
    const input = { ...btn, width: "100%", minWidth: 0, boxSizing: "border-box", background: t.input || t.card, fontSize: 16, colorScheme: t.mode === "dark" ? "dark" : "light" };
    const primary = { ...btn, background: t.accent, borderColor: t.accent, color: t.onAccent };
    const row = { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" };
    const label = { display: "grid", gap: 5, minWidth: 0, fontSize: 12, color: t.textSec };
    const notice = { fontSize: 12, lineHeight: 1.55, color: t.textSec, margin: "9px 0" };
    const openEditor = value => { setEditError(""); setMessage(""); setEditor(value); };
    const editWork = (d, weekly = false) => {
      const wd = B.weekdayOfDateISO(d);
      const windows = weekly ? (data.rules || []).filter(r => genericWeekly(r, wd) && r.active !== 0).map(r => ({ start_minute: r.start_minute, end_minute: r.end_minute })) : editableDayWindows(d, data);
      openEditor({ type: "work", date: d, weekly, windows, baseline: JSON.stringify(data.rules || []), expectedIds: genericDayOverrides(data.overrides, d).map(o => o.id) });
    };
    const selectTime = (d, start, end, startsAt, endsAt) => openEditor({ type: "time", date: d, start, end, startsAt, endsAt, note: "" });
    const timeOptions = useMemo(() => {
      const step = service?.slot_interval_min || 60;
      return Array.from({ length: Math.floor(1440 / step) + 1 }, (_, i) => calendarTime(i * step));
    }, [service?.slot_interval_min]);
    const selectedStart = editor?.type === "time" ? calendarSelectionInstant(editor.date, editor.start, editor.startsAt) : null;
    const selectedEnd = editor?.type === "time" ? calendarSelectionInstant(editor.date, editor.end, editor.endsAt) : null;
    const offsetLabel = instant => new Intl.DateTimeFormat(language === "cs" ? "cs-CZ" : "en-GB", { timeZone: ZONE, timeZoneName: "shortOffset", hour: "2-digit", minute: "2-digit" }).format(instant);
    const perform = async action => {
      if (saving) return;
      setSaving(true); setEditError("");
      try { await action(); setEditor(null); setMessage(L("Uloženo. Dostupnost klientů je aktualizovaná.", "Saved. Client availability is updated.")); refresh(); }
      catch (e) { setEditError(e.messageText || describeError(e)); }
      finally { setSaving(false); }
    };
    const invalid = text => { const e = new Error(text); e.messageText = text; throw e; };
    const saveWork = (inherit = false) => perform(async () => {
      if (!inherit && !validCalendarWindows(editor.windows)) invalid(L("Okna se nesmějí překrývat. Konec musí být po začátku, časy po pěti minutách. Přes půlnoc použij dva dny.", "Windows must not overlap. End after start, in five-minute steps. Split overnight hours into two days."));
      if (editor.weekly) {
        const latest = await fetchBooking("/availability");
        if (JSON.stringify(latest.rules || []) !== editor.baseline) invalid(L("Týden se mezitím změnil. Obnov kalendář a zkontroluj nový stav.", "The week changed. Reload the calendar and review the new schedule."));
        const wd = B.weekdayOfDateISO(editor.date);
        const rules = latest.rules.filter(r => !genericWeekly(r, wd));
        rules.push(...editor.windows.map(w => ({ ...w, weekday: wd, active: 1 })));
        await fetchBooking("/availability", { method: "PUT", body: { rules, expectedRuleIds: latest.rules.map(r => r.id) } });
      } else await fetchBooking("/day-availability", { method: "PUT", body: { date: editor.date, windows: editor.windows, expectedIds: editor.expectedIds, inherit } });
    });
    const saveTimeOff = () => perform(async () => {
      const start = selectedStart, end = selectedEnd;
      if (start == null || end == null || end <= start) invalid(L("Zkontroluj časy. Konec musí být později ve stejném dni. Při změně času vyber konkrétní výskyt opakované hodiny; neexistující čas nelze uložit.", "Check the times. End must be later on the same day. When clocks change, select the occurrence of the repeated hour; nonexistent times cannot be saved."));
      await fetchBooking("/blocks", { method: "POST", body: { startsAt: start, endsAt: end, note: editor.note } });
    });
    const editService = () => openEditor({ type: "service", duration: service.duration_min, interval: service.slot_interval_min, baseline: service.updated_at, serviceId: service.id });
    const saveService = () => perform(async () => {
      if (![editor.duration, editor.interval].every(x => Number.isInteger(x) && x >= 5 && x <= 480 && x % 5 === 0)) invalid(L("Zadej 5 až 480 minut v násobcích pěti.", "Enter 5 to 480 minutes in multiples of five."));
      const latest = await fetchBooking("/services");
      if (latest.services.find(s => s.id === editor.serviceId)?.updated_at !== editor.baseline) invalid(L("Služba se mezitím změnila. Obnov kalendář.", "The service changed. Reload the calendar."));
      await fetchBooking(`/services/${encodeURIComponent(editor.serviceId)}`, { method: "PATCH", body: { duration_min: editor.duration, slot_interval_min: editor.interval, expectedUpdatedAt: editor.baseline } });
    });

    return <section aria-label={L("Pracovní kalendář", "Working calendar")} style={{ fontFamily: BODY_FONT, color: t.text, minWidth: 0 }}>
      <div style={{ ...row, justifyContent: "space-between", gap: 4, marginBottom: 14 }}>
        <div style={{ ...row, flexWrap: "nowrap", gap: 0 }}>
          <button type="button" style={{ ...btn, border: 0, padding: "8px" }} aria-label={L("Předchozí období", "Previous period")} onClick={() => setDate(B.shiftDateISO(date, view === "week" ? -7 : -1))}><TmIcon id="back" size={14}/></button>
          <label style={{ position: "relative", minHeight: 44, display: "inline-flex", alignItems: "center", padding: "6px 5px", fontFamily: DISPLAY_FONT, fontSize: 21, cursor: "pointer" }}>
            {date === B.localDateISO(Date.now(), ZONE) ? L("Dnes", "Today") : dayLabel(date)}
            <input aria-label={L("Vybraný den", "Selected date")} type="date" onClick={e => e.currentTarget.showPicker?.()} value={date} onChange={e => { if (B.isDateISO(e.target.value)) setDate(e.target.value); }} style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}/>
          </label>
          <button type="button" style={{ ...btn, border: 0, padding: "8px" }} aria-label={L("Další období", "Next period")} onClick={() => setDate(B.shiftDateISO(date, view === "week" ? 7 : 1))}><TmIcon id="forward" size={14}/></button>
          {date !== B.localDateISO(Date.now(), ZONE) && <button type="button" style={{ ...btn, border: 0, padding: "8px", fontSize: 12 }} onClick={() => setDate(B.localDateISO(Date.now(), ZONE))}>{L("Dnes", "Today")}</button>}
        </div>
        <div role="group" aria-label={L("Zobrazení kalendáře", "Calendar view")} style={{ ...row, gap: 2 }}>{[["day", L("Den", "Day")], ["week", L("Týden", "Week")]].map(([key, text]) => <button type="button" key={key} aria-pressed={view === key} style={{ ...btn, border: 0, borderBottom: view === key ? `1px solid ${t.accent}` : "1px solid transparent", borderRadius: 0, padding: "8px", fontSize: 13 }} onClick={() => setView(key)}>{text}</button>)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,160px),1fr))", gap: 10 }}>
        <label style={label}>{L("Volné začátky pro službu", "Available starts for service")}<ChoiceField theme={t} L={L} label={L("Volné začátky pro službu", "Available starts for service")} value={serviceId} onChange={value => { setServiceId(value); setLocationId(""); }} style={input} options={(catalog?.services || []).filter(s => s.active).map(s => ({ v: s.id, label: name(s) }))} placeholder={L("Žádná aktivní služba", "No active service")}/></label>
        {locations.length > 0 && <label style={label}>{L("Místo", "Location")}<ChoiceField theme={t} L={L} label={L("Místo", "Location")} value={locationId} onChange={setLocationId} style={input} options={[{ v: "", label: L("Výchozí místo služby", "Service default location") }, ...locations.map(l => ({ v: l.id, label: name(l) }))]}/></label>}
      </div>
      {service && <div style={{ ...row, margin: "10px 0 16px", fontSize: 12, color: t.textSec }}><span>{L("Sezení", "Session")} {service.duration_min} min · {L("začátky po", "starts every")} {service.slot_interval_min} min</span><button type="button" style={btn} onClick={editService} data-tm-surface="control">{L("Upravit délku", "Edit duration")}</button></div>}
      <p style={notice}>{L("Klepni na čas pro termín nebo volno. Pracovní dobu upravíš v záhlaví dne.", "Tap a time for a session or time off. Edit working hours in the day header.")} {ZONE}</p>
      <div style={{ ...row, fontSize: 12, marginBottom: 12 }}><span>{L("Volno = lze rezervovat", "Available = bookable")}</span><span>· {L("Obsazeno = blokovaný čas", "Busy = unavailable")}</span></div>
      <div role="status" aria-live="polite" style={notice}>{message}</div>
      {error && <div role="alert" style={notice}>{describeError(error)} <button type="button" style={btn} onClick={refresh}>{L("Zkusit znovu", "Retry")}</button></div>}
      {loading && <p role="status" style={notice}>{L("Načítám pracovní dobu a termíny…", "Loading working hours and appointments…")}</p>}
      {!loading && data && <>
        <div className="tm-scroll" tabIndex={view === "week" ? 0 : undefined} aria-label={view === "week" ? L("Týden, posun vodorovně", "Week, scroll horizontally") : undefined} style={{ overflowX: view === "week" ? "auto" : "visible", maxWidth: "100%", overscrollBehaviorX: "contain", paddingBottom: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: view === "week" ? "repeat(7,minmax(190px,1fr))" : "minmax(0,1fr)", gap: view === "week" ? 8 : 0, minWidth: view === "week" ? 1380 : 0 }}>
            {days.map(d => {
              const windows = calendarDayWindows(d, data, serviceId, effectiveLocationId || null);
              const items = calendarEventLanes(calendarDayItems(d, data));
              const daySlots = slots.find(x => x.date === d)?.slots || [];
              const all = [...windows.map(w => ({ startsAt: w.s, endsAt: w.e })), ...items];
              const midnight = B.startOfLocalDay(d, ZONE), nextMidnight = B.endOfLocalDay(d, ZONE);
              const startMinute = Math.min(7 * 60, ...all.map(x => x.startsAt <= midnight ? 0 : Math.floor(B.localMinuteOfDay(x.startsAt, ZONE) / 60) * 60));
              const endMinute = Math.max(21 * 60, ...all.map(x => x.endsAt >= nextMidnight ? 1440 : Math.ceil(B.localMinuteOfDay(x.endsAt, ZONE) / 60) * 60));
              const begin = B.zonedToUtc(d, startMinute, ZONE), end = endMinute === 1440 ? nextMidnight : B.zonedToUtc(d, endMinute, ZONE);
              const height = (end - begin) / 60000 * PX;
              const top = at => (Math.max(begin, at) - begin) / 60000 * PX;
              const size = (s, e) => Math.max(3, (Math.min(end, e) - Math.max(begin, s)) / 60000 * PX);
              const displaySlots = daySlots.filter((slot, i) => i === 0 || Math.floor((slot.startsAt - begin) / 1800000) !== Math.floor((daySlots[i - 1].startsAt - begin) / 1800000));
              const marks = Array.from({ length: Math.ceil((end - begin) / 1800000) }, (_, i) => begin + i * 1800000);
              return <section key={d} aria-label={dayLabel(d)} style={{ minWidth: 0 }}>
                <div style={{ borderBottom: `1px solid ${t.border}`, padding: "10px 4px", minHeight: 86 }}>
                  <div style={{ fontFamily: DISPLAY_FONT, fontSize: 20 }}>{dayLabel(d)}</div>
                  <button type="button" style={{ ...btn, padding: "7px 9px", marginTop: 4, fontSize: 12 }} data-tm-surface="control" onClick={() => editWork(d)}>{L("Pracovní doba", "Working hours")}</button>
                </div>
                <div style={{ position: "relative", height, borderBottom: `1px solid ${t.borderSoft}` }}>
                  {windows.map((w, i) => <div key={`work-${i}`} aria-hidden="true" style={{ position: "absolute", top: top(w.s), height: size(w.s, w.e), left: 39, right: 0, background: `color-mix(in srgb, ${t.sage} 9%, transparent)`, borderLeft: `1px solid ${t.sage}` }}/>) }
                  {marks.map(at => <React.Fragment key={at}><span aria-hidden="true" style={{ position: "absolute", top: top(at) + 4, left: 0, fontSize: 10, fontVariantNumeric: "tabular-nums", color: t.textSec }}>{B.hhmm(at, ZONE)}</span><button type="button" aria-label={`${dayLabel(d)} ${B.hhmm(at, ZONE)} ${L("přidat termín nebo volno", "add session or time off")}`} style={{ position: "absolute", top: top(at), height: 45, left: 39, right: 0, width: "calc(100% - 39px)", background: "transparent", border: 0, borderTop: `1px solid ${t.borderSoft}`, cursor: "pointer" }} onClick={() => selectTime(d, B.localMinuteOfDay(at, ZONE), at + 3600000 >= nextMidnight ? 1440 : B.localMinuteOfDay(at + 3600000, ZONE), at, Math.min(at + 3600000, nextMidnight))}/></React.Fragment>)}
                  {displaySlots.map(slot => <button type="button" key={slot.startsAt} onClick={() => selectTime(d, B.localMinuteOfDay(slot.startsAt, ZONE), slot.endsAt === nextMidnight ? 1440 : B.localMinuteOfDay(slot.endsAt, ZONE), slot.startsAt, slot.endsAt)} aria-label={`${B.hhmm(slot.startsAt, ZONE)}–${B.hhmm(slot.endsAt, ZONE)} ${L("volno", "available")}`} style={{ position: "absolute", top: top(slot.startsAt) + 3, left: 45, right: 4, width: "calc(100% - 49px)", minHeight: 44, height: 44, textAlign: "left", background: "transparent", border: 0, borderRadius: 5, padding: "3px 7px", font: "inherit", fontSize: 11, color: t.textSec, cursor: "pointer" }}>{B.hhmm(slot.startsAt, ZONE)} · {L("volno", "available")}</button>)}
                  {items.map(item => <button type="button" key={`${item.kind}-${item.id}`} onClick={() => item.kind === "booking" ? onOpen?.(item) : openEditor({ type: "busy", item, date: d })} title={`${B.hhmm(item.startsAt, ZONE)}–${B.hhmm(item.endsAt, ZONE)} ${item.clientName || item.note || L("Obsazeno", "Busy")}`} style={{ position: "absolute", top: top(item.startsAt) + 1, height: Math.max(30, size(item.startsAt, item.endsAt) - 2), left: `calc(43px + (100% - 47px) * ${item.lane / item.lanes})`, width: `calc((100% - 47px) / ${item.lanes} - 3px)`, overflow: "hidden", textAlign: "left", background: item.kind === "booking" ? t.card : t.callout || t.card, color: t.text, border: `1px ${item.kind === "booking" ? "solid" : "dashed"} ${item.kind === "booking" ? t.sage : t.border}`, borderRadius: 8, padding: "5px 7px", cursor: "pointer", font: "inherit", fontSize: 11, lineHeight: 1.3 }} data-tm-surface="card"><span style={{ display: "block", fontVariantNumeric: "tabular-nums" }}>{B.hhmm(item.startsAt, ZONE)}–{B.hhmm(item.endsAt, ZONE)}</span><strong style={{ display: "block" }}>{item.kind === "booking" ? item.clientName || name(item.service) : L("Obsazeno", "Busy")}</strong>{item.kind === "booking" ? <span>{B.statusCopy(item.status, language)}</span> : <span>{item.kind === "google" ? "Google" : item.note || L("Volno", "Time off")}</span>}</button>)}
                </div>
                {daySlots.length > 0 && <details style={{ margin: "12px 0" }}><summary style={{ minHeight: 44, padding: "10px 0", cursor: "pointer", fontSize: 13 }}>{L("Všechny volné začátky", "All available start times")} · {daySlots.length}</summary><div style={row}>{daySlots.map(slot => <button type="button" key={slot.startsAt} style={btn} data-tm-surface="control" onClick={() => selectTime(d, B.localMinuteOfDay(slot.startsAt, ZONE), slot.endsAt === nextMidnight ? 1440 : B.localMinuteOfDay(slot.endsAt, ZONE), slot.startsAt, slot.endsAt)}>{B.hhmm(slot.startsAt, ZONE)}</button>)}</div></details>}
                {!windows.length && <p style={notice}>{L("Pro tento den není pracovní doba.", "No working hours for this day.")}</p>}
                {!daySlots.length && service && <p style={notice}>{L("Pro tuto službu teď nejsou volné začátky. Platí i předstih, délka a limity služby.", "No available starts for this service. Notice, duration and service limits apply.")}</p>}
                {items.filter(x => x.kind === "booking").map(b => <div key={`client-${b.id}`} style={{ ...row, justifyContent: "space-between", borderBottom: `1px solid ${t.borderSoft}`, padding: "8px 0", fontSize: 12 }}><span>{B.hhmm(b.startsAt, ZONE)} · {b.clientName || name(b.service)}</span>{onOpenClient && b.clientId && <button type="button" data-tm-surface="control" style={btn} onClick={() => onOpenClient(b.clientId)}>{L("Karta klienta", "Client card")}</button>}</div>)}
              </section>;
            })}
          </div>
        </div>
        {data.googleConnected === false && <p style={notice}>{L("Google kalendář není připojený. Obsazený čas odjinud se sem nepřenáší.", "Google Calendar is not connected. Busy time from elsewhere is not included.")}</p>}
        {data.googleConnected && data.googleBusyKnown === false && <p role="alert" style={{ ...notice, color: t.accentInk || t.accent }}>{L("Obsazenost z Google kalendáře se nepodařilo ověřit. Zobrazená volná místa mohou být obsazená; před uložením rezervace se dostupnost ověří znovu.", "Google Calendar availability could not be verified. Displayed free times may be busy; availability is checked again before saving a booking.")}</p>}
      </>}
      {!service && catalog && onServices && <button type="button" style={btn} onClick={onServices}>{L("Nastavit službu", "Set up a service")}</button>}
      {editor && <CenterSheet title={editor.type === "new" ? L("Nový termín", "New session") : L("Úprava kalendáře", "Calendar editor")} onClose={() => setEditor(null)}><fieldset ref={editorRef} tabIndex={-1} disabled={saving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, fontFamily: BODY_FONT }}>
        {editor.type !== "new" && <div style={{ ...row, justifyContent: "space-between", marginBottom: 12 }}><h3 style={{ fontFamily: DISPLAY_FONT, fontWeight: 400, fontSize: 23, margin: 0 }}>{editor.type === "work" ? L("Pracovní doba", "Working hours") : editor.type === "service" ? L("Délka sezení a začátky", "Duration and start times") : L("Čas v kalendáři", "Calendar time")}{editor.date ? ` · ${dayLabel(editor.date)}` : ""}</h3><button type="button" aria-label={L("Zavřít úpravy", "Close editor")} style={btn} disabled={saving} onClick={() => setEditor(null)}><TmIcon id="close" size={16}/></button></div>}
        {editor.type === "new" && renderNewBooking?.(editor.seed, { onClose: () => setEditor(null), onDone: () => { setMessage(L("Termín uložen.", "Appointment saved.")); refresh(); } })}
        {editor.type === "work" && <>
          <div style={{ ...row, marginBottom: 12 }}><button type="button" style={btn} disabled={saving} aria-pressed={!editor.weekly} onClick={() => editWork(editor.date, false)}>{L("Jen tento den", "Only this date")}</button><button type="button" style={btn} disabled={saving} aria-pressed={editor.weekly} onClick={() => editWork(editor.date, true)}>{L("Každý tento den v týdnu", "Every same weekday")}</button></div>
          {editor.windows.map((w, i) => <div key={i} style={{ ...row, flexWrap: "nowrap", marginBottom: 10 }}><label style={{ ...label, flex: 1 }}>{L("Od", "From")}<input type="time" step="300" aria-label={`${L("Začátek okna", "Window start")} ${i + 1}`} style={input} data-tm-surface="control" value={w.startText ?? calendarTime(w.start_minute)} onChange={e => setEditor(x => ({ ...x, windows: x.windows.map((v, j) => j === i ? { ...v, start_minute: parseCalendarTime(e.target.value), startText: e.target.value } : v) }))}/></label><label style={{ ...label, flex: 1 }}>{L("Do", "To")}<input type="text" inputMode="numeric" placeholder="17:00" aria-label={`${L("Konec okna", "Window end")} ${i + 1}`} style={input} data-tm-surface="control" value={w.endText ?? calendarTime(w.end_minute)} key={`${editor.date}-${editor.weekly}-${i}`} onChange={e => setEditor(x => ({ ...x, windows: x.windows.map((v, j) => j === i ? { ...v, end_minute: parseCalendarTime(e.target.value), endText: e.target.value } : v) }))}/></label><button type="button" style={{ ...btn, marginTop: 21 }} disabled={saving} aria-label={`${L("Odebrat okno", "Remove window")} ${i + 1}`} onClick={() => setEditor(x => ({ ...x, windows: x.windows.filter((_, j) => j !== i) }))}><TmIcon id="close" size={16}/></button></div>)}
          {!editor.windows.length && <p style={notice}>{L("Celý den bude bez nabízených termínů.", "No appointments will be offered on this day.")}</p>}
          <button type="button" style={btn} disabled={saving || editor.windows.length >= 16} onClick={() => setEditor(x => ({ ...x, windows: [...x.windows, { start_minute: 540, end_minute: 1020 }] }))}>{L("Přidat pracovní okno", "Add working window")}</button>
          <p style={notice}>{L("Existující rezervace zůstávají zachované. Zvláštní pravidla služeb a míst platí dál. Konec dne můžeš zapsat jako 24:00.", "Existing bookings remain. Service and location exceptions still apply. Use 24:00 for the end of the day.")}</p>
          <div style={row}><button type="button" style={primary} disabled={saving} onClick={() => saveWork()}>{L("Uložit pracovní dobu", "Save working hours")}</button>{!editor.weekly && editor.expectedIds.length > 0 && <button type="button" style={btn} disabled={saving} onClick={() => saveWork(true)}>{L("Vrátit pravidelný týden", "Use regular week")}</button>}</div>
        </>}
        {editor.type === "time" && <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><label style={label}>{L("Od", "From")}<ChoiceField theme={t} L={L} editable label={L("Od", "From")} inputMode="text" options={timeOptions.filter(v => v !== "24:00")} style={input} value={editor.startText ?? calendarTime(editor.start)} onChange={value => setEditor(x => ({ ...x, start: parseCalendarTime(value), startText: value, startsAt: undefined }))}/></label><label style={label}>{L("Do", "To")}<ChoiceField theme={t} L={L} editable label={L("Do", "To")} inputMode="text" options={timeOptions} style={input} value={editor.endText ?? calendarTime(editor.end)} onChange={value => setEditor(x => ({ ...x, end: parseCalendarTime(value), endText: value, endsAt: undefined }))}/></label></div>
          {[["start", "startsAt", selectedStart, L("Začátek při změně času", "Start when clocks change")], ["end", "endsAt", selectedEnd, L("Konec při změně času", "End when clocks change")]].map(([field, raw, selected, caption]) => {
            const choices = calendarWallInstants(editor.date, editor[field]);
            return choices.length > 1 ? <div key={field} role="group" aria-label={caption} style={{ marginTop: 10 }}><p style={notice}>{caption}</p><div style={row}>{choices.map(instant => <button type="button" key={instant} style={{ ...btn, borderColor: selected === instant ? t.accent : t.borderSoft }} aria-pressed={selected === instant} onClick={() => setEditor(x => ({ ...x, [raw]: instant }))}>{offsetLabel(instant)}</button>)}</div></div> : null;
          })}
          <label style={{ ...label, marginTop: 10 }}>{L("Poznámka k volnu, jen pro tebe", "Time-off note, only for you")}<input style={input} data-tm-surface="control" maxLength={200} value={editor.note} onChange={e => setEditor(x => ({ ...x, note: e.target.value }))}/></label>
          <p style={notice}>{L("Volno zablokuje tento čas pro všechny služby. Existující rezervace neruší a poznámka se klientům neukáže.", "Time off blocks all services. Existing bookings are not cancelled and clients cannot see the note.")}</p>
          {data && calendarDayItems(editor.date, data).some(b => b.kind === "booking" && b.startsAt < selectedEnd && b.endsAt > selectedStart) && <p role="status" style={{ ...notice, color: t.accentInk || t.accent }}>{L("V tomto čase už je rezervace. Pokud potřebuješ volno i místo ní, otevři a přesuň termín zvlášť.", "A booking already occupies this time. Open and move that booking separately if needed.")}</p>}
          <div style={row}><button type="button" style={primary} disabled={saving} onClick={saveTimeOff}>{L("Uložit volno", "Save time off")}</button>{(renderNewBooking || onNew) && <button type="button" style={btn} disabled={saving || selectedStart == null} onClick={() => { const seed = { dateISO: editor.date, startsAt: selectedStart, serviceId, locationId: effectiveLocationId || null, timeZone: ZONE }; if (renderNewBooking) openEditor({ type: "new", seed }); else onNew(seed); }}>{L("Nový termín", "New appointment")}</button>}</div>
        </>}
        {editor.type === "busy" && <><p style={notice}>{B.hhmm(editor.item.startsAt, ZONE)}–{B.hhmm(editor.item.endsAt, ZONE)} · {editor.item.kind === "google" ? L("Obsazeno v Google kalendáři. Změnu proveď tam.", "Busy in Google Calendar. Change it there.") : editor.item.note || L("Volno", "Time off")}</p>{editor.item.kind === "block" && <button type="button" style={btn} disabled={saving} onClick={() => perform(() => fetchBooking(`/blocks/${encodeURIComponent(editor.item.id)}`, { method: "DELETE" }))}>{L("Znovu nabídnout tento čas", "Make this time available again")}</button>}</>}
        {editor.type === "service" && <><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><label style={label}>{L("Délka sezení v minutách", "Session duration in minutes")}<NumberField theme={t} L={L} min="5" max="480" step="5" style={input} data-tm-surface="control" value={editor.duration} onChange={e => setEditor(x => ({ ...x, duration: Number(e.target.value) }))}/></label><label style={label}>{L("Nabízet začátek každých minut", "Offer a start every minutes")}<NumberField theme={t} L={L} min="5" max="480" step="5" style={input} data-tm-surface="control" value={editor.interval} onChange={e => setEditor(x => ({ ...x, interval: Number(e.target.value) }))}/></label></div><p style={notice}>{L("Například sezení trvá 60 minut, začátky můžeš nabízet po 30 minutách. Změna platí pro budoucí nové rezervace této služby. Existující termíny se nezkrátí.", "For example, a 60-minute session can start every 30 minutes. This applies to new bookings of this service. Existing sessions keep their duration.")}</p><button type="button" disabled={saving} style={primary} onClick={saveService}>{L("Uložit délku", "Save duration")}</button></>}
        {saving && <p role="status" style={notice}>{L("Ukládám…", "Saving…")}</p>}
        {editError && <div role="alert" style={{ ...notice, color: t.danger }}>{editError}<div style={{ ...row, marginTop: 8 }}><button type="button" style={btn} disabled={saving} onClick={() => { setEditor(null); refresh(); }}>{L("Obnovit kalendář", "Reload calendar")}</button></div></div>}
      </fieldset></CenterSheet>}
    </section>;
  };
}
