import React, {useEffect, useId, useRef, useState} from "react";
import {TmIcon} from "./icons.jsx";
import {addDays, dateKey, validDate} from "../product/together.js";
import {CYCLE_GUIDE} from "../product/togetherGuidance.js";

// Calendar presentation follows Praxe. It reads only the already-authorized
// cycle projection and shared plans; picking a day never writes a record.
export function TogetherCalendar({periods = [], summary, phase, plans = [], lang = "cs", t, onPlanSelect, showCycle = true, selectedDate, onDateChange, showDetails = true, recordDates = [], picker = false}) {
  const L = (cs, en) => lang === "en" ? en : cs;
  const locale = lang === "en" ? "en-GB" : "cs-CZ";
  const today = dateKey();
  const [localSelected, setLocalSelected] = useState(()=>validDate(selectedDate)?selectedDate:today);
  const selected=picker?localSelected:validDate(selectedDate)?selectedDate:localSelected;
  // A diary picker can browse without replacing the entry or closing its panel.
  // A cycle calendar commits each navigation so its phase detail follows along.
  const setSelected=(day,commit=true)=>{if(!validDate(day))return;if(picker||selectedDate===undefined)setLocalSelected(day);if(!picker||commit)onDateChange?.(day);};
  useEffect(()=>{if(picker&&validDate(selectedDate))setLocalSelected(selectedDate);},[picker,selectedDate]);
  const month = selected.slice(0, 7);
  const first = `${month}-01`;
  const firstDate = new Date(`${first}T12:00:00Z`);
  const startWeekday = (firstDate.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth() + 1, 0)).getUTCDate();
  const headingId = useId();
  const detailId = useId();
  const dayButtons = useRef({});
  const focusDay = useRef(false);
  const ink = t.accentInk || t.accent;
  const muted = t.textSec || t.textMuted;
  const dateLabel = (day, options = {weekday: "long", day: "numeric", month: "long", year: "numeric"}) =>
    new Date(`${day}T12:00:00Z`).toLocaleDateString(locale, {...options, timeZone: "UTC"});
  const actualOn = day => showCycle && periods.some(p => day >= p.start && day <= (p.end || p.start));
  const estimateOn = day => showCycle && Boolean(summary?.next && day >= summary.next.from && day <= summary.next.to);
  const visiblePlans = plans.filter(p => p.status !== "cancelled");
  const selectedPlans = visiblePlans.filter(p => p.date === selected).toSorted((a, b) => (a.time || "").localeCompare(b.time || ""));
  const actual = actualOn(selected);
  const estimate = !actual && estimateOn(selected);
  const shiftMonth = (date, offset) => {
    const d = new Date(`${date}T12:00:00Z`);
    const day = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + offset);
    const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(day, last));
    return d.toISOString().slice(0, 10);
  };
  useEffect(() => {
    if (focusDay.current) {
      dayButtons.current[selected]?.focus();
      focusDay.current = false;
    }
  }, [selected]);
  const moveWithKeyboard = (event, day) => {
    const shifts = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7};
    let next;
    if (event.key in shifts) next = addDays(day, shifts[event.key]);
    if (event.key === "Home") next = addDays(day, -((new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7));
    if (event.key === "End") next = addDays(day, 6 - ((new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7));
    if (event.key === "PageUp") next = shiftMonth(day, -1);
    if (event.key === "PageDown") next = shiftMonth(day, 1);
    if (!next) return;
    event.preventDefault();
    if (next !== selected) { focusDay.current = true; setSelected(next,false); }
  };
  const navStyle = {display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, minHeight: 44, padding: "4px 8px", border: `1px solid ${t.borderSoft}`, borderRadius: 8, background: "transparent", color: t.text};
  const markerStyle = {display: "inline-block", width: 11, height: 11, borderRadius: 3, flexShrink: 0, boxSizing: "border-box"};

  return <section className="tm-together-section tg-calendar tm-calcard" aria-labelledby={headingId} style={{minWidth: 0, border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: 16, background: t.card, boxShadow: t.shadow}}>
    <style>{`
      .tm-together .tg-calendar-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:16px}
      .tm-together .tg-calendar-nav{display:flex;align-items:center;gap:5px}
      .tm-together .tg-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
      .tm-together .tg-calendar-day{touch-action:manipulation;font-variant-numeric:tabular-nums;transition:background .16s ease,border-color .16s ease}
      .tm-together .tg-calendar-day:hover:not(:disabled){color:var(--calendar-day-text);box-shadow:inset 0 0 0 1px var(--tg-accent)}
      .tm-together .tg-calendar-day:focus-visible{outline:2px solid var(--tg-accent);outline-offset:2px}
      .tm-together .tg-calendar-key{display:flex;flex-wrap:wrap;gap:8px 14px;margin:16px 0 0;font-size:12px;line-height:1.5}
      .tm-together .tg-calendar-key>span{display:inline-flex;align-items:center;gap:6px}
      .tm-together .tg-calendar-detail{margin-top:18px;padding-top:16px;border-top:1px solid var(--tg-soft)}
      .tm-together .tg-calendar-plans{list-style:none;margin:12px 0 0;padding:0}
      .tm-together .tg-calendar-plans>li{margin:0;padding:12px 0;border-top:1px solid var(--tg-soft);overflow-wrap:anywhere}
      .tm-together .tg-calendar-plans>li:first-child{border-top:0;padding-top:0}
      @media(prefers-reduced-motion:reduce){.tm-together .tg-calendar-day{transition:none}}
    `}</style>
    <div className="tg-calendar-head">
      <h2 id={headingId} style={{fontFamily: "var(--tm-font-display)", fontSize: 24, lineHeight: 1.2, fontWeight: 400, color: t.heading, textTransform: "none", letterSpacing: "normal", margin: 0}}>
        {dateLabel(first, {month: "long", year: "numeric"})}
      </h2>
      <div className="tg-calendar-nav" aria-label={L("Procházet kalendář", "Browse calendar")}>
        <button type="button" aria-label={L("Předchozí měsíc", "Previous month")} style={navStyle} onClick={() => setSelected(shiftMonth(selected, -1),false)}><TmIcon id="back" size={14}/></button>
        <button type="button" aria-label={L("Další měsíc", "Next month")} style={navStyle} onClick={() => setSelected(shiftMonth(selected, 1),false)}><TmIcon id="forward" size={14}/></button>
        <button type="button" style={{...navStyle, fontFamily: "var(--tm-font-tag)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em"}} onClick={() => setSelected(dateKey())}>{L("Dnes", "Today")}</button>
      </div>
    </div>
    <div className="tg-calendar-grid" role="group" aria-label={L("Vybrat den", "Choose a day")}>
      {L(["Po", "Út", "St", "Čt", "Pá", "So", "Ne"], ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map(weekday => <span key={weekday} aria-hidden="true" style={{textAlign: "center", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 12, color: muted, paddingBottom: 6}}>{weekday}</span>)}
      {Array.from({length: startWeekday}, (_, index) => <span key={`blank-${index}`} aria-hidden="true"/>)}
      {Array.from({length: daysInMonth}, (_, index) => {
        const day = `${month}-${String(index + 1).padStart(2, "0")}`;
        const recorded = actualOn(day);
        const estimated = !recorded && estimateOn(day);
        const hasPlan = visiblePlans.some(p => p.date === day);
        const hasRecord = recordDates.includes(day);
        const focused = day === selected;
        const picked = day === (picker&&validDate(selectedDate)?selectedDate:selected);
        const current = day === today;
        const label = [dateLabel(day), current ? L("dnes", "today") : "", recorded ? L("zapsaná menstruace", "recorded period") : estimated ? L("odhad začátku menstruace", "estimated period start") : "", hasPlan ? L("společný plán", "shared plan") : "", hasRecord ? L("můj zápis", "my entry") : ""].filter(Boolean).join(", ");
        return <button key={day} ref={node => { if (node) dayButtons.current[day] = node; else delete dayButtons.current[day]; }} type="button" className="tg-calendar-day tm-cal-day" aria-label={label} aria-pressed={picked} aria-current={current ? "date" : undefined} aria-controls={showDetails ? detailId : undefined} title={label} tabIndex={focused ? 0 : -1} onClick={() => setSelected(day)} onKeyDown={event => moveWithKeyboard(event, day)} style={{"--calendar-day-text": recorded ? t.onAccent : t.text, minWidth: 0, minHeight: 44, padding: "6px 0", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "var(--tm-font-body)", fontSize: 13, lineHeight: 1, fontWeight: picked || current ? 600 : 400, color: recorded ? t.onAccent : t.text, background: recorded ? t.accent : picked ? t.activeNav : "transparent", border: `1px ${estimated ? "dashed" : "solid"} ${estimated || current ? ink : "transparent"}`, outline: picked ? `2px solid ${ink}` : undefined, outlineOffset: picked ? 1 : undefined}}>
          <span>{index + 1}</span>
          <span aria-hidden="true" style={{width: 5, height: 5, borderRadius: "50%", background: hasPlan||hasRecord ? recorded ? t.onAccent : ink : "transparent"}}/>
        </button>;
      })}
    </div>
    {(showCycle||plans.length>0||recordDates.length>0)&&<div className="tg-calendar-key" style={{color: muted}}>
      {showCycle && <span><i aria-hidden="true" style={{...markerStyle, background: t.accent}}/>{L("Zápis menstruace", "Recorded period")}</span>}
      {showCycle && <span><i aria-hidden="true" style={{...markerStyle, border: `1px dashed ${ink}`}}/>{L("Odhad začátku", "Estimated start")}</span>}
      {plans.length>0&&<span><i aria-hidden="true" style={{...markerStyle, width: 5, height: 5, borderRadius: "50%", background: ink}}/>{L("Společný plán", "Shared plan")}</span>}
      {recordDates.length>0&&<span><i aria-hidden="true" style={{...markerStyle, width: 5, height: 5, borderRadius: "50%", background: ink}}/>{L("Můj zápis", "My entry")}</span>}
    </div>}
    {showDetails&&<div id={detailId} className="tg-calendar-detail" aria-live="polite" aria-atomic="true">
      <h3 style={{fontFamily: "var(--tm-font-display)", fontSize: 22, lineHeight: 1.3, color: t.heading, fontWeight: 400, margin: "0 0 8px", textTransform: "none", letterSpacing: "normal"}}>{dateLabel(selected, {weekday: "long", day: "numeric", month: "long"})}</h3>
      {showCycle && <p style={{margin: "0 0 12px", fontSize: 13, color: muted}}>{phase?.id&&CYCLE_GUIDE[phase.id] ? `${L(...CYCLE_GUIDE[phase.id].name)} · ${phase.basis==="recorded"?L("záznam","recorded"):L("odhad","estimated")}` : actual ? L("Zapsaná menstruace.", "Recorded period.") : estimate ? L("Odhad začátku menstruace.", "Estimated period start.") : L("Fáze pro tento den není k dispozici.", "The phase for this day is unavailable.")}</p>}
      {selectedPlans.length ? <ul className="tg-calendar-plans">{selectedPlans.map(p => <li key={p.id}>
        <strong style={{fontFamily: "var(--tm-font-body)", fontSize: 14, fontWeight: 500, color: t.text}}>{p.title}</strong>
        <p style={{margin: "4px 0 0", fontSize: 12, color: muted}}>{[p.time, p.minutes ? `${p.minutes} min` : "", p.status === "done" ? L("Proběhlo", "Completed") : p.approved?.owner && p.approved?.partner ? L("Domluveno", "Agreed") : L("Zatím návrh", "Still a proposal")].filter(Boolean).join(" · ")}</p>
        {onPlanSelect && <button type="button" style={{marginTop: 8}} onClick={() => onPlanSelect(p)}>{L("Otevřít plán", "Open plan")}</button>}
      </li>)}</ul> : <p style={{margin: 0, fontSize: 13, color: muted}}>{L("Na tento den zatím nemáte společný plán.", "You have no shared plan for this day yet.")}</p>}
    </div>}
  </section>;
}
