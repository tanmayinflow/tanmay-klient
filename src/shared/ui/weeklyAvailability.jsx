import React, { useEffect, useRef, useState } from "react";
import { TmIcon } from "./icons.jsx";
import { calendarTime, parseCalendarTime } from "../../booking/calendar.js";
import { WEEKDAYS, weeklyDraft, weeklyPayload, weekSignature, validWeek, replaceWeeklyWindow,
  copyWeeklyDay, snapMinute, shiftWeeklyWindow, nextWeeklyGap } from "../../booking/weeklyAvailability.js";

const DAYS = { 1: ["Pondělí", "Monday"], 2: ["Úterý", "Tuesday"], 3: ["Středa", "Wednesday"],
  4: ["Čtvrtek", "Thursday"], 5: ["Pátek", "Friday"], 6: ["Sobota", "Saturday"], 0: ["Neděle", "Sunday"] };
const BODY = 'var(--tm-font-body, var(--ff-body, "DM Sans", sans-serif))';
const DISPLAY = 'var(--tm-font-display, var(--ff-display, "EB Garamond", Georgia, serif))';
const newKey = () => `weekly-${globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)}`;

// Mounted only by the coach shell. The existing owner-only availability route
// remains the authority; this component never stores bookings or client details.
export function createWeeklyAvailabilityUI({ useT, L, fetchBooking, errorCopy, CenterSheet }) {
  return function WeeklyAvailability() {
    const { t } = useT();
    const [original, setOriginal] = useState(null), [windows, setWindows] = useState([]);
    const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false);
    const [error, setError] = useState(null), [message, setMessage] = useState("");
    const [selectedDay, setSelectedDay] = useState(1), [compact, setCompact] = useState(false);
    const [editor, setEditor] = useState(null), [editError, setEditError] = useState("");
    const [preview, setPreview] = useState(null), [history, setHistory] = useState([]);
    const [wholeDay, setWholeDay] = useState(false);
    const root = useRef(null), tracks = useRef({}), gesture = useRef(null), actions = useRef(null);
    const request = useRef(0), mounted = useRef(true), suppressClick = useRef(0);
    const dirty = original !== null && weekSignature(windows) !== weekSignature(weeklyDraft(original));
    const dayName = day => L(...DAYS[day]);
    const invalidCopy = L("Časy se nesmí překrývat. Konec musí být po začátku, v krocích po 5 minutách. Na den lze přidat nejvýš 16 bloků.",
      "Times cannot overlap. End must follow start, in 5-minute steps. A day can contain up to 16 blocks.");
    const describeError = e => e?.code === "AVAILABILITY_CHANGED"
      ? L("Týden mezitím změnilo jiné okno. Tvoje rozpracované změny zůstávají tady. Načti aktuální týden a potom je uprav znovu.",
        "The week changed in another window. Your draft is still here. Load the current week before editing again.")
      : errorCopy(e);
    const button = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: BODY, fontSize: 13, minHeight: 44, padding: "8px 14px", borderRadius: 12,
      color: t.text, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer" };
    const primary = { ...button, color: t.onAccent, background: t.accent, borderColor: t.accent };
    const input = { width: "100%", minHeight: 44, boxSizing: "border-box", padding: "8px 10px", fontFamily: BODY,
      fontSize: 16, color: t.text, background: t.input, border: `1px solid ${t.border}`, borderRadius: 10 };
    const label = { display: "grid", gap: 6, fontFamily: BODY, fontSize: 13, color: t.textSec };
    const row = { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 };
    const min = wholeDay ? 0 : Math.min(360, ...windows.map(w => Math.floor(w.start_minute / 60) * 60));
    const max = wholeDay ? 1440 : Math.max(1320, ...windows.map(w => Math.ceil(w.end_minute / 60) * 60));
    const span = max - min;
    const hours = Array.from({ length: span / 60 + 1 }, (_, i) => min + i * 60);
    const displayWindows = preview ? [...windows.filter(w => w.key !== preview.window.key), preview.window] : windows;
    const dayWindows = windows.filter(w => w.weekday === selectedDay).sort((a, b) => a.start_minute - b.start_minute);
    const load = async () => {
      const id = ++request.current;
      setLoading(true); setError(null);
      try {
        const data = await fetchBooking("/availability");
        if (!mounted.current || id !== request.current) return;
        setOriginal(data.rules || []); setWindows(weeklyDraft(data.rules)); setHistory([]); setMessage("");
      } catch (e) { if (mounted.current && id === request.current) setError(e); }
      finally { if (mounted.current && id === request.current) setLoading(false); }
    };
    useEffect(() => { mounted.current = true; load(); return () => { mounted.current = false; request.current++; }; }, []);
    useEffect(() => {
      const observer = new ResizeObserver(entries => setCompact(entries[0].contentRect.width < 680));
      if (root.current) observer.observe(root.current);
      return () => observer.disconnect();
    }, []);
    useEffect(() => {
      if (!dirty) return;
      const warn = e => { e.preventDefault(); e.returnValue = ""; };
      window.addEventListener("beforeunload", warn);
      return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);
    const apply = next => {
      if (!next || !validWeek(next)) { setMessage(invalidCopy); return false; }
      setHistory(past => [...past.slice(-19), windows]); setWindows(next); setMessage(""); setError(null);
      return true;
    };
    const openWindow = w => { setEditError(""); setEditor({ type: "window", ...w, start: calendarTime(w.start_minute), end: calendarTime(w.end_minute) }); };
    const add = (day = selectedDay, minute = 540) => {
      const gap = nextWeeklyGap(windows, day, minute);
      if (!gap) { setMessage(L("V tomhle dni už není volné místo pro další blok.", "This day has no room for another block.")); return; }
      openWindow({ ...gap, key: newKey() });
    };
    actions.current = { apply, openWindow, add, windows, invalidCopy };
    const save = async () => {
      if (saving || !dirty) return;
      setSaving(true); setError(null); setMessage("");
      try {
        const data = await fetchBooking("/availability", { method: "PUT", body: weeklyPayload(original, windows) });
        if (!mounted.current) return;
        setOriginal(data.rules); setWindows(weeklyDraft(data.rules)); setHistory([]);
        setMessage(L("Týden je uložený. Klienti už vidí novou dostupnost.", "Week saved. Clients can now see the updated availability."));
      } catch (e) { if (mounted.current) setError(e); }
      finally { if (mounted.current) setSaving(false); }
    };
    const begin = (e, day, window, mode = "move") => {
      if (saving || loading || e.button !== 0 || gesture.current) return;
      e.stopPropagation();
      if (!window && e.pointerType !== "mouse") return;
      const track = tracks.current[day];
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const start = snapMinute(min + (e.clientX - rect.left) / rect.width * span);
      const g = { pointerId: e.pointerId, pointerType: e.pointerType, x: e.clientX, y: e.clientY,
        rect, min, span, day, window, mode: window ? mode : "create", start, ready: e.pointerType === "mouse",
        moved: false, snapshot: windows, target: e.currentTarget };
      gesture.current = g;
      if (e.pointerType === "mouse") e.preventDefault();
      else g.timer = setTimeout(() => {
        if (gesture.current !== g) return;
        g.ready = true; g.target.setPointerCapture?.(g.pointerId);
        setPreview({ window, valid: true });
        suppressClick.current = Date.now() + 600;
      }, 380);
    };
    useEffect(() => {
      const cancel = () => { const g = gesture.current; clearTimeout(g?.timer); gesture.current = null; setPreview(null); };
      const move = e => {
        const g = gesture.current;
        if (!g || e.pointerId !== g.pointerId) return;
        const dx = e.clientX - g.x, dy = e.clientY - g.y;
        if (!g.ready) { if (Math.hypot(dx, dy) > 8) cancel(); return; }
        if (Math.hypot(dx, dy) < 4 && !g.moved) return;
        e.preventDefault(); g.moved = true;
        let window;
        if (g.mode === "create") {
          const end = snapMinute(g.min + (e.clientX - g.rect.left) / g.rect.width * g.span);
          const start_minute = Math.min(g.start, end, 1435);
          window = { key: "drawing", weekday: g.day, start_minute, end_minute: Math.max(start_minute + 5, g.start, end) };
        } else {
          let day = g.day;
          if (g.pointerType === "mouse" && g.mode === "move") for (const [wd, node] of Object.entries(tracks.current)) {
            const r = node?.getBoundingClientRect();
            if (r && e.clientY >= r.top && e.clientY <= r.bottom) { day = Number(wd); break; }
          }
          window = shiftWeeklyWindow(g.window, Math.round(dx / g.rect.width * g.span / 15) * 15, g.mode, day);
        }
        g.next = window;
        g.valid = !!replaceWeeklyWindow(g.snapshot, window);
        setPreview({ window, valid: g.valid });
      };
      const up = e => {
        const g = gesture.current;
        if (!g || e.pointerId !== g.pointerId) return;
        clearTimeout(g.timer); gesture.current = null; setPreview(null);
        if (!g.moved) {
          if (g.mode === "create") { suppressClick.current = Date.now() + 300; actions.current.add(g.day, Math.min(1435, g.start)); }
          return;
        }
        suppressClick.current = Date.now() + 600;
        if (!g.valid) { setMessage(actions.current.invalidCopy); return; }
        if (g.mode === "create") actions.current.openWindow({ ...g.next, key: newKey() });
        else { actions.current.apply(replaceWeeklyWindow(g.snapshot, g.next)); setSelectedDay(g.next.weekday); }
      };
      const key = e => { if (e.key === "Escape" && gesture.current) { suppressClick.current = Date.now() + 600; cancel(); } };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up); window.addEventListener("pointercancel", cancel);
      window.addEventListener("blur", cancel); window.addEventListener("keydown", key);
      return () => {
        clearTimeout(gesture.current?.timer); gesture.current = null;
        window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", cancel); window.removeEventListener("blur", cancel); window.removeEventListener("keydown", key);
      };
    }, []);
    const keyboard = (e, w, mode = "move") => {
      if (saving || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      apply(replaceWeeklyWindow(windows, shiftWeeklyWindow(w, (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 60 : 15), mode)));
    };
    const commitEditor = e => {
      e.preventDefault();
      const w = { key: editor.key, weekday: Number(editor.weekday), start_minute: parseCalendarTime(editor.start), end_minute: parseCalendarTime(editor.end) };
      const next = replaceWeeklyWindow(windows, w);
      if (!next) { setEditError(invalidCopy); return; }
      apply(next); setSelectedDay(w.weekday); setEditor(null);
    };
    return <section ref={root} className="tm-weekly-availability" data-tm-weekly-availability data-tm-no-swipe style={{ color: t.text, fontFamily: BODY, minWidth: 0, "--wa-accent": t.accent }}>
      <style>{`.tm-weekly-availability button:disabled{opacity:.5;cursor:default}.tm-weekly-availability button:focus-visible{outline:2px solid var(--wa-accent);outline-offset:3px}.tm-weekly-track{touch-action:pan-x pan-y}.tm-weekly-block{touch-action:pan-y;user-select:none;-webkit-user-select:none}.tm-weekly-grip{touch-action:pan-y}.tm-weekly-block:hover{filter:brightness(.97)}`}</style>
      <div style={{ ...row, justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 28, margin: 0 }}>{L("Pravidelný týden", "Repeating week")}</h3>
        <button type="button" disabled={loading || saving || original === null} onClick={() => add()} style={button}><TmIcon id="add" size={15} /> {L("Přidat blok", "Add a block")}</button>
      </div>
      <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.65, margin: "0 0 14px" }}>{L("Tahle pracovní doba se opakuje každý týden. Jednotlivé termíny a výjimky upravíš v Pracovním kalendáři. Časy jsou v pásmu Praha.",
        "These working hours repeat every week. Edit individual dates and exceptions in the Working calendar. Times use the Prague time zone.")}</p>
      {loading && original === null && <p role="status">{L("Načítám pracovní dobu…", "Loading working hours…")}</p>}
      {error && <div role="alert" style={{ margin: "12px 0", lineHeight: 1.6 }}><p>{describeError(error)}</p>
        <button type="button" disabled={saving || loading} style={button} onClick={() => dirty ? setEditor({ type: "reload" }) : load()}>{L("Načíst aktuální týden", "Load current week")}</button>
      </div>}
      {original !== null && <>
        {compact && <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: 3, marginBottom: 12 }} aria-label={L("Den v týdnu", "Weekday")}>
          {WEEKDAYS.map(day => <button type="button" key={day} aria-label={dayName(day)} aria-pressed={selectedDay === day}
            disabled={saving} onClick={() => setSelectedDay(day)} style={{ ...button, padding: "8px 2px", borderRadius: 20,
              color: selectedDay === day ? t.onAccent : t.text, background: selectedDay === day ? t.accent : "transparent" }}>{dayName(day).slice(0, 2)}</button>)}
        </div>}
        <div style={{ ...row, justifyContent: "space-between", marginBottom: 10, fontSize: 12, color: t.textSec }}>
          <span>{L("Blok = čas pro rezervace", "Block = bookable hours")}</span>
          <button type="button" aria-pressed={wholeDay} onClick={() => setWholeDay(!wholeDay)} style={{ ...button, border: 0, padding: "4px 0", minHeight: 36, color: t.accentInk || t.accent }}>{wholeDay ? L("Pracovní rozsah", "Working range") : L("Celých 24 hodin", "Full 24 hours")}</button>
        </div>
        <div data-tm-weekly-scroll style={{ overflowX: "auto", overscrollBehaviorX: "contain", border: `1px solid ${t.borderSoft}`, borderRadius: 14, "--wa-accent": t.accent }}>
          <div style={{ minWidth: (compact ? 0 : 112) + Math.max(720, span / 60 * 48) }}>
            <div style={{ display: "flex", height: 36, paddingLeft: compact ? 0 : 112, borderBottom: `1px solid ${t.borderSoft}` }}>
              <div style={{ position: "relative", flex: 1, margin: "0 14px", fontSize: 11, color: t.textSec }}>
                {hours.map((hour, i) => (!compact || i === 0 || i === hours.length - 1 || (i % 2 === 0 && i < hours.length - 2)) && <span key={hour} style={{ position: "absolute", top: 10, left: `${(hour - min) / span * 100}%`, transform: `translateX(${i === 0 ? 0 : i === hours.length - 1 ? -100 : -50}%)`, fontVariantNumeric: "tabular-nums" }}>{calendarTime(hour)}</span>)}
              </div>
            </div>
            {(compact ? [selectedDay] : WEEKDAYS).map(day => <div key={day} style={{ display: "flex", borderBottom: day === 0 || compact ? 0 : `1px solid ${t.borderSoft}` }}>
              {!compact && <button type="button" onClick={() => setSelectedDay(day)} aria-pressed={selectedDay === day} style={{ ...button, width: 112, flexShrink: 0, border: 0, borderRadius: 0, textAlign: "left", position: "sticky", left: 0, zIndex: 2, background: t.card, color: selectedDay === day ? t.accentInk || t.accent : t.text, boxShadow: `1px 0 0 ${t.borderSoft}` }}>{dayName(day)}</button>}
              <div ref={node => { tracks.current[day] = node; }} data-weekday={day} className="tm-weekly-track" onPointerDown={e => begin(e, day)}
                onClick={e => { if (e.target !== e.currentTarget || Date.now() < suppressClick.current || saving) return; const r = e.currentTarget.getBoundingClientRect(); add(day, Math.min(1435, snapMinute(min + (e.clientX - r.left) / r.width * span))); }}
                style={{ flex: 1, position: "relative", minWidth: 0, height: compact ? 100 : 78, margin: "0 14px", cursor: "crosshair", backgroundImage: `linear-gradient(to right, ${t.borderSoft} 1px, transparent 1px)`, backgroundSize: `${60 / span * 100}% 100%` }}>
                {displayWindows.filter(w => w.weekday === day).map(w => {
                  const currentPreview = preview?.window.key === w.key;
                  const invalid = currentPreview && !preview.valid;
                  return <div key={w.key} className="tm-weekly-block" data-weekly-block={w.key} style={{ position: "absolute", left: `${(w.start_minute - min) / span * 100}%`, top: compact ? 20 : 12,
                    width: `${(w.end_minute - w.start_minute) / span * 100}%`, minWidth: 6, height: 54, border: `1px ${invalid ? "dashed" : "solid"} ${invalid ? t.danger || t.accent : t.accent}`, borderRadius: 9,
                    background: `color-mix(in srgb, ${t.accent} ${currentPreview ? 22 : 12}%, ${t.card})`, boxSizing: "border-box", zIndex: currentPreview ? 3 : 1, boxShadow: `0 2px 6px color-mix(in srgb, ${t.text} 9%, transparent)` }}>
                    <button type="button" disabled={saving || w.key === "drawing"} onPointerDown={e => begin(e, day, w)}
                      onClick={() => { if (Date.now() >= suppressClick.current) openWindow(w); }} onKeyDown={e => keyboard(e, w)}
                      aria-label={`${dayName(day)} ${calendarTime(w.start_minute)}–${calendarTime(w.end_minute)}, ${L("upravit blok", "edit block")}`}
                      title={`${calendarTime(w.start_minute)}–${calendarTime(w.end_minute)}`}
                      style={{ width: "100%", height: "100%", overflow: "hidden", padding: "0 17px", border: 0, borderRadius: 8, background: "transparent", color: t.text, fontFamily: BODY, fontSize: 12, whiteSpace: "nowrap", cursor: currentPreview ? "grabbing" : "grab", touchAction: "pan-y" }}>
                      {calendarTime(w.start_minute)}–{calendarTime(w.end_minute)}
                    </button>
                    {w.end_minute - w.start_minute >= 60 && ["start", "end"].map(mode => <button key={mode} type="button" className="tm-weekly-grip" disabled={saving || w.key === "drawing"}
                      aria-label={`${L(mode === "start" ? "Posunout začátek" : "Posunout konec", mode === "start" ? "Move start" : "Move end")} ${dayName(day)} ${calendarTime(w.start_minute)}–${calendarTime(w.end_minute)}`}
                      onPointerDown={e => begin(e, day, w, mode)} onKeyDown={e => keyboard(e, w, mode)} onClick={() => { if (Date.now() >= suppressClick.current) openWindow(w); }}
                      style={{ position: "absolute", [mode === "start" ? "left" : "right"]: 0, top: 0, bottom: 0, width: 16, padding: 0, color: t.accentInk || t.accent, border: 0, background: "transparent", borderRadius: 8, cursor: "ew-resize" }} aria-description={L("Šipky doleva a doprava mění čas o 15 minut.", "Left and right arrows change time by 15 minutes.")}>│</button>)}
                  </div>;
                })}
                {!displayWindows.some(w => w.weekday === day) && <span style={{ pointerEvents: "none", position: "absolute", left: 18, top: compact ? 38 : 27, color: t.textSec, fontSize: 13 }}>{L("Volno · klepni pro nový blok", "Off · tap to add a block")}</span>}
              </div>
            </div>)}
          </div>
        </div>
        <p style={{ fontSize: 12, color: t.textSec, lineHeight: 1.6, margin: "10px 0 18px" }}>{compact
          ? L("Časovou osu posuneš do stran. Blok podrž a posuň, okrajem změníš délku. Klepnutím zadáš přesný čas.", "Scroll the timeline sideways. Hold a block to move it, or its edge to resize. Tap to enter an exact time.")
          : L("Táhni v prázdném místě pro nový blok. Blok přesuneš, okrajem změníš délku. Klepnutím zadáš přesný čas; šipky posouvají po 15 minutách.", "Drag empty space to draw a block. Move blocks or resize their edges. Click for exact times; arrow keys move by 15 minutes.")}</p>
        {preview && <p role="status" style={{ color: preview.valid ? t.text : t.danger || t.accent }}>{dayName(preview.window.weekday)} · {calendarTime(preview.window.start_minute)}–{calendarTime(preview.window.end_minute)}{!preview.valid && ` · ${L("překryv nebo limit bloků", "overlap or block limit")}`}</p>}
        <div style={{ ...row, justifyContent: "space-between", borderTop: `1px solid ${t.borderSoft}`, paddingTop: 14 }}>
          <h4 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 23, margin: 0 }}>{dayName(selectedDay)}</h4>
          <button type="button" disabled={saving || loading} onClick={() => { setEditError(""); setEditor({ type: "copy", day: selectedDay, targets: [1, 2, 3, 4, 5].filter(d => d !== selectedDay) }); }} style={button}>{L("Kopírovat do dnů…", "Copy to days…")}</button>
        </div>
        <div style={{ ...row, marginTop: 8 }}>
          {dayWindows.map(w => <button type="button" key={w.key} onClick={() => openWindow(w)} disabled={saving || loading} style={button}>{calendarTime(w.start_minute)}–{calendarTime(w.end_minute)} <TmIcon id="edit" size={13} /></button>)}
          {!dayWindows.length && <span style={{ color: t.textSec, fontSize: 14 }}>{L("Bez pracovní doby", "No working hours")}</span>}
        </div>
        <div style={{ ...row, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${t.borderSoft}` }}>
          <button type="button" onClick={save} disabled={!dirty || saving || loading || !validWeek(windows)} style={primary}>{saving ? L("Ukládám…", "Saving…") : L("Uložit týden", "Save the week")}</button>
          <button type="button" disabled={!history.length || saving || loading} style={button} onClick={() => { setWindows(history[history.length - 1]); setHistory(history.slice(0, -1)); setMessage(""); }}>{L("Zpět", "Undo")}</button>
          {dirty && <span style={{ fontSize: 13, color: t.textSec }}>{L("Změny zatím nejsou uložené", "Changes are not saved yet")}</span>}
        </div>
        {message && <p role="status" style={{ fontSize: 14, lineHeight: 1.6 }}>{message}</p>}
      </>}
      {editor && <CenterSheet title={editor.type === "window" ? L("Pracovní blok", "Working hours") : editor.type === "copy" ? L("Kopírovat pracovní dobu", "Copy working hours") : L("Načíst aktuální týden", "Load current week")} onClose={() => setEditor(null)}>
        {editor.type === "window" && <form onSubmit={commitEditor}>
          <label style={{ ...label, marginBottom: 14 }}>{L("Den", "Day")}<select value={editor.weekday} onChange={e => setEditor({ ...editor, weekday: Number(e.target.value) })} style={input}>{WEEKDAYS.map(d => <option key={d} value={d}>{dayName(d)}</option>)}</select></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={label}>{L("Od", "From")}<input required aria-label={L("Začátek bloku", "Block start")} placeholder="09:00" inputMode="text" autoComplete="off" value={editor.start} onChange={e => setEditor({ ...editor, start: e.target.value })} style={input} /></label>
            <label style={label}>{L("Do", "To")}<input required aria-label={L("Konec bloku", "Block end")} placeholder="17:00" inputMode="text" autoComplete="off" value={editor.end} onChange={e => setEditor({ ...editor, end: e.target.value })} style={input} /></label>
          </div>
          <p style={{ fontFamily: BODY, fontSize: 12, color: t.textSec, lineHeight: 1.6 }}>{L("Čas zadej jako 09:00, po 5 minutách. Půlnoc na konci dne je 24:00.", "Enter time as 09:00, in 5-minute steps. Midnight at the end of a day is 24:00.")}</p>
          {editError && <p role="alert" style={{ color: t.danger || t.accent, lineHeight: 1.6 }}>{editError}</p>}
          <div style={{ ...row, marginTop: 20 }}><button type="submit" style={primary}>{L("Použít blok", "Apply block")}</button>
            {windows.some(w => w.key === editor.key) && <button type="button" style={{ ...button, color: t.accentInk || t.accent }} onClick={() => { apply(windows.filter(w => w.key !== editor.key)); setEditor(null); }}>{L("Smazat blok", "Delete block")}</button>}
            <button type="button" style={button} onClick={() => setEditor(null)}>{L("Zrušit", "Cancel")}</button>
          </div>
        </form>}
        {editor.type === "copy" && <>
          <p style={{ fontFamily: BODY, lineHeight: 1.6 }}>{dayName(editor.day)}: {windows.filter(w => w.weekday === editor.day).map(w => `${calendarTime(w.start_minute)}–${calendarTime(w.end_minute)}`).join(", ") || L("volno", "off")}</p>
          <p style={{ fontFamily: BODY, fontSize: 13, color: t.textSec, lineHeight: 1.6 }}>{L("Ve vybraných dnech se dosavadní pracovní bloky nahradí. Změny potvrdíš tlačítkem Uložit týden.", "Existing working blocks on selected days will be replaced. Confirm the changes with Save the week.")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{WEEKDAYS.filter(d => d !== editor.day).map(d => <label key={d} style={{ ...row, minHeight: 44, fontFamily: BODY }}><input type="checkbox" checked={editor.targets.includes(d)} onChange={e => setEditor({ ...editor, targets: e.target.checked ? [...editor.targets, d] : editor.targets.filter(x => x !== d) })} />{dayName(d)}</label>)}</div>
          <div style={{ ...row, marginTop: 20 }}><button type="button" disabled={!editor.targets.length} style={primary} onClick={() => { if (apply(copyWeeklyDay(windows, editor.day, editor.targets, newKey))) setEditor(null); }}>{L("Použít ve vybraných dnech", "Apply to selected days")}</button><button type="button" style={button} onClick={() => setEditor(null)}>{L("Zrušit", "Cancel")}</button></div>
        </>}
        {editor.type === "reload" && <><p style={{ fontFamily: BODY, lineHeight: 1.6 }}>{L("Načtení nahradí tvoje neuložené změny aktuální pracovní dobou.", "Loading replaces your unsaved changes with the current working hours.")}</p><div style={row}><button type="button" style={primary} onClick={() => { setEditor(null); load(); }}>{L("Načíst a nahradit návrh", "Load and replace draft")}</button><button type="button" style={button} onClick={() => setEditor(null)}>{L("Ponechat návrh", "Keep draft")}</button></div></>}
      </CenterSheet>}
    </section>;
  };
}
