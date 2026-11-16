import { DateField } from './DateField.jsx';
import { NumberField } from "./NumberField.jsx";
import { ChoiceField } from "./ChoiceField.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TmIcon } from "./icons.jsx";
import * as B from "../../booking/index.js";
import { COACH_CALENDAR_ZONE as ZONE, calendarTime, parseCalendarTime, validCalendarWindows,
  genericDayOverrides, calendarDayWindows, editableDayWindows, calendarDayItems,
  calendarEventLanes, calendarWallInstants, calendarSelectionInstant, calendarServiceLocations,
  calendarWallRange, calendarWeekRange, calendarWeekLanes, calendarSlotCells } from "../../booking/calendar.js";

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
    const [view, setView] = useState("week"), [serviceId, setServiceId] = useState(""), [locationId, setLocationId] = useState("");
    const [catalog, setCatalog] = useState(null), [data, setData] = useState(null), [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true), [error, setError] = useState(null), [reload, setReload] = useState(0);
    const [editor, setEditor] = useState(null), [saving, setSaving] = useState(false), [editError, setEditError] = useState("");
    const [message, setMessage] = useState("");
    const [compact, setCompact] = useState(false), [moving, setMoving] = useState(null);
    const request = useRef(0), editorRef = useRef(null);
    const rootRef = useRef(null), dayRefs = useRef({}), drag = useRef(null), actions = useRef(null), skipClick = useRef(0);
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
      : ["BOOKING_CHANGED", "BLOCK_CHANGED"].includes(err?.code)
      ? L("Termín mezitím změnilo jiné okno. Obnov kalendář a zkontroluj aktuální čas.", "This entry changed in another window. Reload the calendar and check its current time.")
      : errorCopy(err);
    useEffect(() => {
      let current = true;
      Promise.all([fetchBooking("/services"), fetchBooking("/locations"), fetchBooking("/clients")]).then(([a, b, c]) => {
        if (!current) return;
        setCatalog({ services: a.services || [], locations: b.locations || [], clients: c.clients || [] });
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
    useEffect(() => {
      const topbar = document.querySelector("main .tm-topbar");
      const observer = new ResizeObserver(() => {
        setCompact((rootRef.current?.clientWidth || 0) < 700);
        rootRef.current?.style.setProperty("--tm-calendar-top", `${topbar?.getBoundingClientRect().height || 0}px`);
      });
      if (rootRef.current) observer.observe(rootRef.current);
      if (topbar) observer.observe(topbar);
      return () => observer.disconnect();
    }, []);

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
    const selectedStart = ["time", "booking", "block"].includes(editor?.type) ? calendarSelectionInstant(editor.date, editor.start, editor.startsAt) : null;
    const selectedEnd = ["time", "block"].includes(editor?.type) ? calendarSelectionInstant(editor.endDate || editor.date, editor.end, editor.endsAt) : null;
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

    const range = useMemo(() => calendarWeekRange(days, data, serviceId, effectiveLocationId || null), [days, data, serviceId, effectiveLocationId]);
    const scale = view === "day" ? PX : compact ? 1 : 1.2;
    const axisWidth = compact && view === "week" ? 34 : 46;
    const axisMarks = useMemo(() => {
      if (view !== "day") return Array.from({ length: Math.ceil((range.to - range.from) / 60) }, (_, i) => ({ offset: i * 60, text: calendarTime(range.from + i * 60) }));
      const start = B.zonedToUtc(date, range.from, ZONE), end = range.to === 1440 ? B.endOfLocalDay(date, ZONE) : B.zonedToUtc(date, range.to, ZONE);
      return Array.from({ length: Math.ceil((end - start) / 3600000) }, (_, i) => ({ offset: i * 60, text: B.hhmm(start + i * 3600000, ZONE) }));
    }, [view, date, range.from, range.to]);
    const openNew = (d, slot) => {
      const seed = { dateISO: d, startsAt: slot.startsAt, serviceId, locationId: effectiveLocationId || null, timeZone: ZONE };
      if (renderNewBooking) openEditor({ type: "new", seed }); else onNew?.(seed);
    };
    const openItem = (item, proposed) => {
      if (item.kind === "google") { openEditor({ type: "busy", item, date: B.localDateISO(item.startsAt, ZONE) }); return; }
      const d = proposed?.date || B.localDateISO(item.startsAt, ZONE);
      const start = proposed?.minute ?? B.localMinuteOfDay(item.startsAt, ZONE);
      const startsAt = proposed ? calendarSelectionInstant(d, start, proposed.startsAt) : item.startsAt;
      const duration = (item.endsAt - item.startsAt) / 60000;
      const endsAt = startsAt == null ? undefined : startsAt + duration * 60000;
      const midnightEnd = endsAt === B.endOfLocalDay(d, ZONE);
      openEditor({ type: item.kind, item, date: d, start, startText: calendarTime(start), startsAt,
        duration, serviceId: item.service?.id,
        clientIds: item.participants?.filter(p => ["REQUESTED", "CONFIRMED"].includes(p.status)).map(p => p.clientId) || (item.clientId ? [item.clientId] : []),
        endDate: endsAt ? (midnightEnd ? d : B.localDateISO(endsAt, ZONE)) : d,
        end: endsAt ? (midnightEnd ? 1440 : B.localMinuteOfDay(endsAt, ZONE)) : Math.min(1440, start + duration),
        endsAt, note: item.note || "", proposed: !!proposed });
    };
    const saveMove = () => perform(async () => {
      if (selectedStart == null) invalid(L("Vyber platné datum a čas. U opakované hodiny zvol konkrétní výskyt.", "Choose a valid date and time. For a repeated hour select its occurrence."));
      const item = editor.item;
      if (editor.type === "booking") {
        const selectedService = catalog.services.find(s => s.id === editor.serviceId);
        if (!Number.isInteger(editor.duration) || editor.duration < 1 || editor.duration > 720 || !editor.clientIds.length || editor.clientIds.length > (selectedService?.capacity || 1)) invalid(L("Zkontroluj délku, službu a počet účastníků.", "Check the duration, service and number of participants."));
        await fetchBooking(`/bookings/${encodeURIComponent(item.id)}/reschedule`, { method: "POST", body: { startsAt: selectedStart, durationMin: editor.duration, serviceId: editor.serviceId, clientIds: editor.clientIds, adminOverride: true, overrideReason: L("Úprava rezervace trenérem", "Booking edited by coach"), expectedVersion: item.version, expectedStartsAt: item.startsAt, expectedUpdatedAt: item.updatedAt } });
      } else {
        if (selectedEnd == null || selectedEnd <= selectedStart) invalid(L("Konec volna musí být později než začátek.", "Time off must end after it starts."));
        await fetchBooking(`/blocks/${encodeURIComponent(item.id)}`, { method: "PATCH", body: { startsAt: selectedStart, endsAt: selectedEnd, note: editor.note, expectedStartsAt: item.startsAt, expectedUpdatedAt: item.updatedAt } });
      }
    });
    actions.current = { openItem };
    const beginMove = (e, item, d) => {
      if (item.kind === "google" || saving || editor || e.button !== 0 || drag.current) return;
      e.stopPropagation();
      const g = { pointerId: e.pointerId, pointerType: e.pointerType, x: e.clientX, y: e.clientY, item, date: d,
        minute: B.localMinuteOfDay(item.startsAt, ZONE), scale, step: Math.max(5, Number(item.service?.slotIntervalMin) || Number(service?.slot_interval_min) || 15),
        ready: e.pointerType === "mouse", moved: false, target: e.currentTarget };
      drag.current = g;
      if (e.pointerType === "mouse") e.preventDefault();
      else g.timer = setTimeout(() => { if (drag.current !== g) return; g.ready = true; g.target.setPointerCapture?.(g.pointerId); setMoving({ item, date: d, minute: g.minute }); skipClick.current = Date.now() + 700; }, 380);
    };
    useEffect(() => {
      const cancel = () => { clearTimeout(drag.current?.timer); drag.current = null; setMoving(null); };
      const move = e => {
        const g = drag.current;
        if (!g || g.pointerId !== e.pointerId) return;
        const dx = e.clientX - g.x, dy = e.clientY - g.y;
        if (!g.ready) { if (Math.hypot(dx, dy) > 8) cancel(); return; }
        if (Math.hypot(dx, dy) < 5 && !g.moved) return;
        if (e.cancelable) e.preventDefault();
        g.moved = true;
        let d = g.date;
        for (const [date, node] of Object.entries(dayRefs.current)) { const r = node?.getBoundingClientRect(); if (r && e.clientX >= r.left && e.clientX <= r.right) { d = date; break; } }
        const duration = (g.item.endsAt - g.item.startsAt) / 60000;
        const minute = Math.max(0, Math.min(Math.max(0, 1440 - duration), g.minute + Math.round(dy / g.scale / g.step) * g.step));
        g.next = { item: g.item, date: d, minute };
        setMoving(g.next);
      };
      const up = e => {
        const g = drag.current;
        if (!g || g.pointerId !== e.pointerId) return;
        clearTimeout(g.timer); drag.current = null; setMoving(null);
        if (g.moved && g.next) { skipClick.current = Date.now() + 700; actions.current.openItem(g.item, g.next); }
      };
      // Prevent native panning only after a deliberate hold. Before that, a
      // normal scroll cancels the gesture and cannot move the appointment.
      const touch = e => { if (drag.current?.ready && drag.current.pointerType === "touch" && e.touches.length === 1 && e.cancelable) e.preventDefault(); };
      const key = e => { if (e.key === "Escape" && drag.current) { skipClick.current = Date.now() + 700; cancel(); } };
      window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", cancel); window.addEventListener("blur", cancel); window.addEventListener("keydown", key);
      window.addEventListener("touchmove", touch, { passive: false });
      return () => { clearTimeout(drag.current?.timer); drag.current = null; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", cancel); window.removeEventListener("blur", cancel); window.removeEventListener("keydown", key); window.removeEventListener("touchmove", touch); };
    }, []);

    return <section ref={rootRef} data-tm-booking-calendar data-tm-no-swipe aria-label={L("Pracovní kalendář", "Working calendar")} style={{ fontFamily: BODY_FONT, color: t.text, minWidth: 0 }}>
      <style>{`.tm-booking-event{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.tm-booking-event:focus-visible,.tm-booking-slot:focus-visible{outline:2px solid currentColor;outline-offset:1px;z-index:4}`}</style>
      <div style={{ ...row, justifyContent: "space-between", gap: 4, marginBottom: 14 }}>
        <div style={{ ...row, flexWrap: "nowrap", gap: 0 }}>
          <button type="button" style={{ ...btn, border: 0, padding: "8px" }} aria-label={L("Předchozí období", "Previous period")} onClick={() => setDate(B.shiftDateISO(date, view === "week" ? -7 : -1))}><TmIcon id="back" size={14}/></button>
          <label style={{ position: "relative", minHeight: 44, display: "inline-flex", alignItems: "center", padding: "6px 5px", fontFamily: DISPLAY_FONT, fontSize: 21, cursor: "pointer" }}>
            {view === "week" ? `${Number(from.slice(-2))}. ${Number(from.slice(5, 7))}. – ${Number(days[6].slice(-2))}. ${Number(days[6].slice(5, 7))}.` : date === B.localDateISO(Date.now(), ZONE) ? L("Dnes", "Today") : dayLabel(date)}
            <DateField aria-label={L("Vybraný den", "Selected date")} type="date" value={date} onChange={e => { if (B.isDateISO(e.target.value)) setDate(e.target.value); }} style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}/>
          </label>
          <button type="button" style={{ ...btn, border: 0, padding: "8px" }} aria-label={L("Další období", "Next period")} onClick={() => setDate(B.shiftDateISO(date, view === "week" ? 7 : 1))}><TmIcon id="forward" size={14}/></button>
          {date !== B.localDateISO(Date.now(), ZONE) && <button type="button" style={{ ...btn, border: 0, padding: "8px", fontSize: 12 }} onClick={() => setDate(B.localDateISO(Date.now(), ZONE))}>{L("Dnes", "Today")}</button>}
        </div>
        <div role="group" aria-label={L("Zobrazení kalendáře", "Calendar view")} style={{ ...row, gap: 2 }}>{[["day", L("Den", "Day")], ["week", L("Týden", "Week")]].map(([key, text]) => <button type="button" key={key} aria-pressed={view === key} style={{ ...btn, border: 0, borderBottom: view === key ? `1px solid ${t.accent}` : "1px solid transparent", borderRadius: 0, padding: "8px", fontSize: 13 }} onClick={() => setView(key)}>{text}</button>)}</div>
      </div>
      <details open={!compact} style={{ marginBottom: compact ? 6 : 0 }}>
        <summary style={{ display: compact ? "list-item" : "none", minHeight: 44, padding: "10px 0", boxSizing: "border-box", cursor: "pointer", fontSize: 13 }}>{name(service) || L("Nastavení služby", "Service settings")}{service ? ` · ${service.duration_min} min` : ""}</summary>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,160px),1fr))", gap: 10 }}>
        <label style={label}>{L("Volné začátky pro službu", "Available starts for service")}<ChoiceField theme={t} L={L} label={L("Volné začátky pro službu", "Available starts for service")} value={serviceId} onChange={value => { setServiceId(value); setLocationId(""); }} style={input} options={(catalog?.services || []).filter(s => s.active).map(s => ({ v: s.id, label: name(s) }))} placeholder={L("Žádná aktivní služba", "No active service")}/></label>
        {locations.length > 0 && <label style={label}>{L("Místo", "Location")}<ChoiceField theme={t} L={L} label={L("Místo", "Location")} value={locationId} onChange={setLocationId} style={input} options={[{ v: "", label: L("Výchozí místo služby", "Service default location") }, ...locations.map(l => ({ v: l.id, label: name(l) }))]}/></label>}
      </div>
      {service && <div style={{ ...row, margin: "10px 0 16px", fontSize: 12, color: t.textSec }}><span>{L("Sezení", "Session")} {service.duration_min} min · {L("začátky po", "starts every")} {service.slot_interval_min} min</span><button type="button" style={btn} onClick={editService} data-tm-surface="control">{L("Upravit délku", "Edit duration")}</button></div>}
      </details>
      <div style={{ ...row, margin: "8px 0" }}><button type="button" style={btn} onClick={() => selectTime(date, 540, 600)}>{L("Přidat volno", "Add time off")}</button><button type="button" style={btn} onClick={() => editWork(date)}>{L("Pracovní doba", "Working hours")}</button></div>
      <p style={notice}>{compact ? L("Klepnutím rezervuj, podržením přesuň.", "Tap to book, hold to move.") : L("Klepni na volný začátek a přidej klienta. Pracovní dobu upravíš v záhlaví dne. Přesun potvrdíš po přetažení.", "Tap a free start to add a client. Edit working hours in the day header. Confirm moves after dragging.")}</p>
      <div style={{ ...row, fontSize: 11, marginBottom: 10, color: t.textSec }}><span><span aria-hidden="true" style={{ color: t.sage }}>● </span>{L("K rezervaci", "Bookable")}</span><span><span aria-hidden="true" style={{ color: t.accent }}>● </span>{L("Rezervace", "Booking")}</span><span>▧ {L("Volno · blokace", "Time off · blocked")}</span><span style={{ marginLeft: "auto" }}>{L("Praha", "Prague")}</span></div>
      {message && <div role="status" aria-live="polite" style={notice}>{message}</div>}
      {error && <div role="alert" style={notice}>{describeError(error)} <button type="button" style={btn} onClick={refresh}>{L("Zkusit znovu", "Retry")}</button></div>}
      {loading && <p role="status" style={notice}>{L("Načítám pracovní dobu a termíny…", "Loading working hours and appointments…")}</p>}
      {!loading && data && <>
        <div data-tm-calendar-grid style={{ border: `1px solid ${t.borderSoft}`, borderRadius: 12, overflow: "clip", maxWidth: "100%" }}>
          <div data-tm-calendar-head style={{ position: "sticky", top: "calc(var(--tm-calendar-top, 0px) + env(safe-area-inset-top, 0px))", zIndex: 6, display: "grid", gridTemplateColumns: `${axisWidth}px repeat(${days.length},minmax(0,1fr))`, background: t.card, borderBottom: `1px solid ${t.border}` }}>
            <span aria-hidden="true" style={{ fontSize: 10, color: t.textSec, alignSelf: "center", textAlign: "center" }}>{ZONE === "Europe/Prague" ? L("Čas", "Time") : ""}</span>
            {days.map(d => <div key={d} style={{ minWidth: 0, borderLeft: `1px solid ${t.borderSoft}`, textAlign: "center" }}>
              <button type="button" aria-label={`${dayLabel(d)} ${L("zvětšit den", "open day")}`} onClick={() => { setDate(d); setView("day"); }} style={{ ...btn, display: "grid", justifyContent: "center", gap: 1, border: 0, padding: compact && view === "week" ? "7px 0" : "7px", width: "100%", borderRadius: 0, color: d === B.localDateISO(Date.now(), ZONE) ? t.accentInk || t.accent : t.text }}>
                <span style={{ fontSize: compact && view === "week" ? 10 : 12 }}>{new Date(`${d}T12:00:00Z`).toLocaleDateString(language === "cs" ? "cs-CZ" : "en-GB", { weekday: "short", timeZone: "UTC" }).slice(0, 2)}</span>
                <span style={{ fontFamily: DISPLAY_FONT, fontSize: compact && view === "week" ? 20 : 24 }}>{Number(d.slice(-2))}</span>
              </button>
              <button type="button" aria-label={`${L("Pracovní doba", "Working hours")} ${dayLabel(d)}`} title={L("Upravit pracovní dobu", "Edit working hours")} style={{ ...btn, border: 0, padding: "5px 2px", minHeight: 36, fontSize: 11, width: "100%", borderRadius: 0 }} onClick={() => editWork(d)}>{compact && view === "week" ? <TmIcon id="edit" size={13}/> : L("Pracovní doba", "Working hours")}</button>
            </div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `${axisWidth}px repeat(${days.length},minmax(0,1fr))` }}>
            <div aria-hidden="true" style={{ position: "relative", minWidth: 0 }}>
              {axisMarks.map(mark => <span key={mark.offset} style={{ position: "absolute", top: mark.offset * scale + 4, left: 0, right: 5, textAlign: "right", color: t.textSec, fontSize: compact && view === "week" ? 9 : 11, fontVariantNumeric: "tabular-nums" }}>{mark.text}</span>)}
            </div>
            {days.map(d => {
              const windows = calendarDayWindows(d, data, serviceId, effectiveLocationId || null);
              const rawItems = calendarDayItems(d, data);
              const items = view === "week" ? calendarWeekLanes(d, rawItems) : calendarEventLanes(rawItems);
              const daySlots = slots.find(x => x.date === d)?.slots || [];
              const midnight = B.startOfLocalDay(d, ZONE), nextMidnight = B.endOfLocalDay(d, ZONE);
              const begin = B.zonedToUtc(d, range.from, ZONE), end = range.to === 1440 ? nextMidnight : B.zonedToUtc(d, range.to, ZONE);
              const height = view === "week" ? (range.to - range.from) * scale : (end - begin) / 60000 * scale;
              const top = at => view === "week" ? (calendarWallRange(d, at, at + 60000).from - range.from) * scale : (Math.max(begin, at) - begin) / 60000 * scale;
              const size = (s, e) => view === "week" ? Math.max(3, (calendarWallRange(d, s, e).to - calendarWallRange(d, s, e).from) * scale) : Math.max(3, (Math.min(end, e) - Math.max(begin, s)) / 60000 * scale);
              const cells = calendarSlotCells(d, daySlots, service?.slot_interval_min);
              const marks = Array.from({ length: Math.ceil((end - begin) / 1800000) }, (_, i) => begin + i * 1800000);
              const short = compact && view === "week";
              return <section key={d} ref={node => { dayRefs.current[d] = node; }} data-calendar-day={d} aria-label={dayLabel(d)} style={{ position: "relative", height, minWidth: 0, borderLeft: `1px solid ${t.borderSoft}`, background: `repeating-linear-gradient(to bottom, transparent 0, transparent ${30 * scale - 1}px, ${t.borderSoft} ${30 * scale - 1}px, ${t.borderSoft} ${30 * scale}px)` }}>
                <div role="button" tabIndex={0} aria-label={`${dayLabel(d)} ${L("přidat volno nebo termín", "add time off or a session")}`}
                  onClick={e => { if (e.target !== e.currentTarget || Date.now() < skipClick.current) return; const r = e.currentTarget.getBoundingClientRect(); const elapsed = Math.round((e.clientY - r.top) / scale / 5) * 5; if (view === "day") { const at = Math.min(end - 60000, Math.max(begin, begin + elapsed * 60000)), until = Math.min(nextMidnight, at + (service?.duration_min || 60) * 60000); selectTime(d, B.localMinuteOfDay(at, ZONE), until === nextMidnight ? 1440 : B.localMinuteOfDay(until, ZONE), at, until); } else { const minute = Math.max(0, Math.min(1435, range.from + elapsed)); selectTime(d, minute, Math.min(1440, minute + (service?.duration_min || 60))); } }}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectTime(d, 540, 600); } }} style={{ position: "absolute", inset: 0, cursor: "pointer" }}/>
                {windows.map((w, i) => <div key={`work-${i}`} aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", top: top(w.s), height: size(w.s, w.e), left: 0, right: 0, background: `color-mix(in srgb, ${t.sage} 8%, transparent)` }}/>) }
                {view === "day" && marks.map(at => <span key={at} aria-hidden="true" style={{ pointerEvents: "none", position: "absolute", top: top(at) + 4, right: 3, fontSize: 10, color: t.textSec }}>{B.hhmm(at, ZONE)}</span>)}
                {cells.map(cell => {
                  const slot = cell.choices[0];
                  const cellTop = view === "week" ? (cell.from - range.from) * scale : top(slot.startsAt);
                  const cellHeight = Math.max(8, (cell.to - cell.from) * scale - 2);
                  return <button type="button" className="tm-booking-slot" data-bookable-start={slot.startsAt} key={slot.startsAt} onClick={() => cell.choices.length > 1 ? selectTime(d, cell.from, B.localMinuteOfDay(slot.endsAt, ZONE), slot.startsAt, slot.endsAt) : openNew(d, slot)}
                    aria-label={`${dayLabel(d)} ${B.hhmm(slot.startsAt, ZONE)}–${B.hhmm(slot.endsAt, ZONE)} ${L("přidat klienta", "add a client")}`} title={`${B.hhmm(slot.startsAt, ZONE)}–${B.hhmm(slot.endsAt, ZONE)} · ${L("K rezervaci", "Bookable")}`}
                    style={{ position: "absolute", top: cellTop + 1, left: 1, width: "calc(100% - 2px)", height: cellHeight, minHeight: 0, border: `1px solid color-mix(in srgb, ${t.sage} 38%, transparent)`, borderRadius: short ? 3 : 6,
                      background: `color-mix(in srgb, ${t.sage} 13%, ${t.card})`, color: t.text, fontFamily: BODY_FONT, fontSize: short ? 9 : 11, padding: short ? "1px 0" : "3px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: short ? "center" : "left", cursor: "pointer" }}>
                    {B.hhmm(slot.startsAt, ZONE)}{!short && ` · ${L("K rezervaci", "Bookable")}`}{cell.choices.length > 1 ? " · 2×" : ""}
                  </button>;
                })}
                {items.map(item => {
                  const description = item.kind === "booking" ? item.clientName || name(item.service) : item.kind === "google" ? "Google" : L("Volno", "Time off");
                  return <button type="button" key={`${item.kind}-${item.id}`} className="tm-booking-event" data-calendar-event={item.id} data-event-kind={item.kind}
                    aria-label={`${dayLabel(d)} ${B.hhmm(item.startsAt, ZONE)}–${B.hhmm(item.endsAt, ZONE)} ${description}`} onPointerDown={e => beginMove(e, item, d)}
                    onClick={() => { if (Date.now() >= skipClick.current) openItem(item); }}
                    title={`${B.hhmm(item.startsAt, ZONE)}–${B.hhmm(item.endsAt, ZONE)} ${description}`}
                    style={{ position: "absolute", top: top(item.startsAt) + 1, height: Math.max(18, size(item.startsAt, item.endsAt) - 2), left: `calc(${item.lane / item.lanes * 100}% + 1px)`, width: `calc(${100 / item.lanes}% - 2px)`,
                      overflow: "hidden", textAlign: "left", background: item.kind === "booking" ? `color-mix(in srgb, ${t.accent} 15%, ${t.card})` : t.callout || t.card, color: t.text,
                      border: `1px ${item.kind === "booking" ? "solid" : "dashed"} ${item.kind === "booking" ? t.accent : t.border}`, borderRadius: short ? 4 : 8,
                      padding: short ? "3px 2px" : "5px 7px", cursor: item.kind === "google" ? "pointer" : "grab", fontFamily: BODY_FONT, fontSize: short ? 9 : 11, lineHeight: 1.3,
                      opacity: moving?.item.id === item.id ? .4 : 1, touchAction: "auto", zIndex: 2 }}>
                    <span style={{ display: "block", fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{B.hhmm(item.startsAt, ZONE)}{!short && `–${B.hhmm(item.endsAt, ZONE)}`}</span>
                    <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: short ? "normal" : "nowrap", overflowWrap: "anywhere" }}>{description}</strong>
                    {!short && <span>{item.kind === "booking" ? B.statusCopy(item.status, language) : item.note || L("Nedostupné klientům", "Unavailable to clients")}</span>}
                  </button>;
                })}
                {moving?.date === d && <div aria-hidden="true" style={{ position: "absolute", pointerEvents: "none", zIndex: 5, top: (moving.minute - range.from) * scale, height: (moving.item.endsAt - moving.item.startsAt) / 60000 * scale, left: 1, right: 1, border: `2px solid ${t.accent}`, borderRadius: 6, background: `color-mix(in srgb, ${t.accent} 20%, ${t.card})`, fontSize: short ? 9 : 12, padding: 2, boxSizing: "border-box" }}>{calendarTime(moving.minute)}</div>}
              </section>;
            })}
          </div>
        </div>
        {moving && <p role="status" style={notice}>{L("Přesun na", "Move to")} {dayLabel(moving.date)} · {calendarTime(moving.minute)}</p>}
        {view === "week" && compact && <p style={notice}>{L("Celý týden je na jedné ploše. Klepnutím na den ho zvětšíš. Rezervaci nebo volno podrž a přesuň; před uložením čas potvrdíš.", "The whole week fits here. Tap a day to enlarge it. Hold a booking or time off to move it; confirm the time before saving.")}</p>}
        {view === "day" && <>
          <button type="button" style={{ ...btn, marginTop: 12 }} onClick={() => setView("week")}>{L("Zpět na celý týden", "Back to full week")}</button>
          <details style={{ margin: "12px 0" }}><summary style={{ minHeight: 44, padding: "10px 0", cursor: "pointer", fontSize: 13 }}>{L("Volné začátky jako seznam", "Available starts as a list")}</summary>
            <div style={row}>{(slots[0]?.slots || []).map(slot => <button type="button" key={slot.startsAt} style={btn} onClick={() => openNew(date, slot)}>{B.hhmm(slot.startsAt, ZONE)}</button>)}</div>
          </details>
        </>}
        {data.googleConnected === false && <p style={notice}>{L("Google kalendář není připojený. Obsazený čas odjinud se sem nepřenáší.", "Google Calendar is not connected. Busy time from elsewhere is not included.")}</p>}
        {data.googleConnected && data.googleBusyKnown === false && <p role="alert" style={{ ...notice, color: t.accentInk || t.accent }}>{L("Obsazenost z Google kalendáře se nepodařilo ověřit. Zobrazená volná místa mohou být obsazená; před uložením rezervace se dostupnost ověří znovu.", "Google Calendar availability could not be verified. Displayed free times may be busy; availability is checked again before saving a booking.")}</p>}
      </>}
      {!service && catalog && onServices && <button type="button" style={btn} onClick={onServices}>{L("Nastavit službu", "Set up a service")}</button>}
      {editor && <CenterSheet title={editor.type === "new" ? L("Nový termín", "New session") : editor.type === "booking" ? L("Rezervace", "Booking") : editor.type === "block" ? L("Volno", "Time off") : L("Úprava kalendáře", "Calendar editor")} onClose={() => { if (!saving) setEditor(null); }}><fieldset ref={editorRef} tabIndex={-1} disabled={saving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, fontFamily: BODY_FONT }}>
        {editor.type !== "new" && <div style={{ ...row, justifyContent: "space-between", marginBottom: 12 }}><h3 style={{ fontFamily: DISPLAY_FONT, fontWeight: 400, fontSize: 23, margin: 0 }}>{editor.type === "work" ? L("Pracovní doba", "Working hours") : editor.type === "service" ? L("Délka sezení a začátky", "Duration and start times") : L("Čas v kalendáři", "Calendar time")}{editor.date ? ` · ${dayLabel(editor.date)}` : ""}</h3><button type="button" aria-label={L("Zavřít úpravy", "Close editor")} style={btn} disabled={saving} onClick={() => setEditor(null)}><TmIcon id="close" size={16}/></button></div>}
        {editor.type === "new" && renderNewBooking?.(editor.seed, { onClose: () => setEditor(null), onDone: () => { setMessage(L("Termín uložen.", "Appointment saved.")); refresh(); } })}
        {["booking", "block"].includes(editor.type) && <>
          {editor.type === "booking" && <>
            <p style={{ fontFamily: DISPLAY_FONT, fontSize: 25, margin: "0 0 8px" }}>{editor.item.clientName || name(editor.item.service)}</p>
            <p style={notice}>{name(editor.item.service)} · {B.statusCopy(editor.item.status, language)}</p>
            <div style={{ ...row, marginBottom: 20 }}>
              {onOpen && <button type="button" style={btn} onClick={() => { const item = editor.item; setEditor(null); onOpen(item); }}>{L("Podrobnosti rezervace", "Booking details")}</button>}
              {onOpenClient && editor.item.clientId && <button type="button" style={btn} onClick={() => { const id = editor.item.clientId; setEditor(null); onOpenClient(id); }}>{L("Karta klienta", "Client card")}</button>}
            </div>
            <label style={{ ...label, marginBottom: 14 }}>{L("Typ rezervace", "Booking type")}<ChoiceField theme={t} L={L} label={L("Typ rezervace", "Booking type")} style={input} value={editor.serviceId} options={(catalog?.services || []).filter(s => s.active || s.id === editor.item.service?.id).map(s => ({ v: s.id, label: name(s) + ` · ${s.duration_min} min` }))} onChange={value => setEditor(x => ({ ...x, serviceId: value, duration: catalog.services.find(s => s.id === value)?.duration_min || x.duration }))}/></label>
            <div style={{ marginBottom: 18 }}>
              <span style={label}>{L("Účastníci", "Participants")} · {editor.clientIds.length}/{catalog?.services.find(s => s.id === editor.serviceId)?.capacity || 1}</span>
              {editor.clientIds.map(id => { const c = catalog?.clients.find(c => c.id === id) || editor.item.participants?.find(c => c.clientId === id); return <div key={id} style={{ ...row, minHeight: 44, borderBottom: `1px solid ${t.borderSoft}`, flexWrap: "nowrap" }}><button type="button" style={{ ...btn, border: 0, padding: "6px 0", textAlign: "left", flex: 1, overflowWrap: "anywhere" }} disabled={!onOpenClient} onClick={() => { setEditor(null); onOpenClient?.(id); }}>{c?.name || c?.email || id}</button><button type="button" aria-label={`${L("Odebrat účastníka", "Remove participant")} ${c?.name || c?.email || id}`} style={{ ...btn, border: 0, padding: 8 }} onClick={() => setEditor(x => ({ ...x, clientIds: x.clientIds.filter(value => value !== id) }))}><TmIcon id="close" size={15}/></button></div>; })}
              {editor.clientIds.length < (catalog?.services.find(s => s.id === editor.serviceId)?.capacity || 1) && <ChoiceField searchable theme={t} L={L} label={L("Přidat účastníka", "Add participant")} style={{ ...input, marginTop: 8 }} value="" placeholder={L("Přidat účastníka…", "Add participant…")} options={(catalog?.clients || []).filter(c => !editor.clientIds.includes(c.id)).map(c => ({ v: c.id, label: c.name || c.email || c.id, search: `${c.name || ""} ${c.email || ""}` }))} onChange={value => { if (value) setEditor(x => ({ ...x, clientIds: [...new Set([...x.clientIds, value])] })); }}/>}
              <p style={notice}>{L("Každý účastník má vlastní kredit nebo platbu. Změna služby se přepočítá při uložení.", "Each participant has their own credit or payment. A service change is recalculated on save.")}</p>
            </div>
          </>}
          {editor.proposed && <p style={notice}>{L("Zkontroluj nový čas a potvrď přesun.", "Check the new time and confirm the move.")}</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={label}>{L("Datum", "Date")}<DateField aria-label={L("Datum přesunu", "Move date")} type="date" value={editor.date} style={input} onChange={e => setEditor(x => ({ ...x, date: e.target.value, startsAt: undefined }))}/></label>
            <label style={label}>{L("Začátek", "Start")}<ChoiceField theme={t} L={L} editable label={L("Čas přesunu", "Move time")} inputMode="text" options={timeOptions.filter(v => v !== "24:00")} style={input} value={editor.startText ?? calendarTime(editor.start)} onChange={value => setEditor(x => ({ ...x, start: parseCalendarTime(value), startText: value, startsAt: undefined }))}/></label>
          </div>
          {calendarWallInstants(editor.date, editor.start).length > 1 && <div style={{ ...row, marginTop: 10 }}>{calendarWallInstants(editor.date, editor.start).map(instant => <button type="button" key={instant} style={btn} aria-pressed={selectedStart === instant} onClick={() => setEditor(x => ({ ...x, startsAt: instant }))}>{offsetLabel(instant)}</button>)}</div>}
          {editor.type === "booking" ? <><label style={{ ...label, marginTop: 10 }}>{L("Délka v minutách", "Duration in minutes")}<NumberField theme={t} L={L} aria-label={L("Délka rezervace", "Booking duration")} min="1" max="720" step="1" style={input} value={editor.duration} onChange={e => setEditor(x => ({ ...x, duration: Number(e.target.value) }))}/></label><p style={notice}>{selectedStart != null && `${L("Nový konec", "New end")}: ${dayLabel(B.localDateISO(selectedStart + editor.duration * 60000, ZONE))} ${B.hhmm(selectedStart + editor.duration * 60000, ZONE)}`}</p></> : <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <label style={label}>{L("Datum konce", "End date")}<DateField aria-label={L("Datum konce volna", "Time-off end date")} type="date" value={editor.endDate} style={input} onChange={e => setEditor(x => ({ ...x, endDate: e.target.value, endsAt: undefined }))}/></label>
              <label style={label}>{L("Konec", "End")}<ChoiceField theme={t} L={L} editable label={L("Konec volna", "Time-off end")} inputMode="text" options={timeOptions} style={input} value={editor.endText ?? calendarTime(editor.end)} onChange={value => setEditor(x => ({ ...x, end: parseCalendarTime(value), endText: value, endsAt: undefined }))}/></label>
            </div>
            {calendarWallInstants(editor.endDate, editor.end).length > 1 && <div style={{ ...row, marginTop: 10 }}>{calendarWallInstants(editor.endDate, editor.end).map(instant => <button type="button" key={instant} style={btn} aria-pressed={selectedEnd === instant} onClick={() => setEditor(x => ({ ...x, endsAt: instant }))}>{offsetLabel(instant)}</button>)}</div>}
            <label style={{ ...label, marginTop: 10 }}>{L("Poznámka jen pro tebe", "Private note")}<input maxLength={200} style={input} value={editor.note} onChange={e => setEditor(x => ({ ...x, note: e.target.value }))}/></label>
            <p style={notice}>{L("Volno zablokuje nové rezervace klientů. Stávající rezervace zůstávají zachované.", "Time off blocks new client bookings. Existing bookings remain.")}</p>
          </>}
          <div style={{ ...row, marginTop: 18 }}><button type="button" style={primary} disabled={saving} onClick={saveMove}>{editor.type === "booking" ? L("Uložit rezervaci", "Save booking") : L("Uložit volno", "Save time off")}</button>
            {editor.type === "block" && <button type="button" style={btn} disabled={saving} onClick={() => perform(() => fetchBooking(`/blocks/${encodeURIComponent(editor.item.id)}`, { method: "DELETE" }))}>{L("Znovu nabídnout tento čas", "Make this time available again")}</button>}
          </div>
        </>}
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
