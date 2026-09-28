import React, {useEffect, useId, useRef, useState} from "react";
import {TmIcon} from "./icons.jsx";
import {addDays, dateKey, validDate} from "../product/together.js";
import {CYCLE_GUIDE} from "../product/togetherGuidance.js";

// Calendar presentation follows Praxe. It reads only the already-authorized
// cycle projection and shared plans; picking a day never writes a record.
export function TogetherCalendar({periods = [], summary, phase, plans = [], lang = "cs", t, onPlanSelect, onOpenDay, showCycle = true, selectedDate, onDateChange, showDetails = true, recordDates = [], picker = false}) {
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
  const navStyle = {display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, minHeight: 44, padding: "4px 8px", border: "1px solid transparent", borderRadius: 8, background: "transparent", color: muted};
  const markerStyle = {display: "inline-block", width: 11, height: 11, borderRadius: 3, flexShrink: 0, boxSizing: "border-box"};

  return <section className="tg-calendar" aria-labelledby={headingId} style={{"--calendar-ink":ink,"--calendar-text":t.text,"--calendar-muted":muted,"--calendar-line":t.borderSoft,"--calendar-fill":t.accent,"--calendar-on":t.onAccent,"--calendar-active":t.activeNav,minWidth:0,padding:"12px 0",background:"transparent",border:0,borderRadius:0,boxShadow:"none"}}>
    <style>{`
      .tg-calendar .tg-calendar-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
      .tg-calendar .tg-calendar-nav{display:flex;align-items:center;gap:6px}
      .tg-calendar .tg-calendar-nav button{white-space:nowrap;overflow-wrap:normal}
      .tg-calendar .tg-calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
      .tg-calendar button.tg-calendar-day{touch-action:manipulation;font-variant-numeric:tabular-nums;min-width:0;min-height:44px;padding:6px 0;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;font-family:var(--tm-font-body);font-size:12px;line-height:1;font-weight:400;color:var(--calendar-text);background:color-mix(in srgb,var(--calendar-ink) 3.5%,transparent);border:1px solid transparent;transition:background .15s ease,border-color .15s ease}
      .tg-calendar button.tg-calendar-day[data-recorded=true]{color:var(--calendar-on);background:var(--calendar-fill)}
      .tg-calendar button.tg-calendar-day[data-estimated=true]{border-style:dashed;border-color:var(--calendar-ink)}
      .tg-calendar button.tg-calendar-day[aria-current=date]{border-color:var(--calendar-ink)}
      .tg-calendar button.tg-calendar-day[aria-pressed=true]{border:1.5px solid var(--calendar-ink);font-weight:600;background:var(--calendar-active)}
      .tg-calendar button.tg-calendar-day[aria-pressed=true][data-estimated=true]{border-style:dashed}
      .tg-calendar button.tg-calendar-day[aria-pressed=true][data-recorded=true]{background:var(--calendar-fill);box-shadow:inset 0 0 0 2px var(--calendar-on)}
      .tg-calendar button.tg-calendar-day:hover:not(:disabled){color:var(--calendar-text);border-color:var(--calendar-ink);background:var(--calendar-active)}
      .tg-calendar button.tg-calendar-day[data-recorded=true]:hover:not(:disabled){color:var(--calendar-on);background:var(--calendar-fill)}
      .tg-calendar :is(button,a):focus-visible{outline:2px solid var(--calendar-ink);outline-offset:2px}
      .tg-calendar .tg-calendar-key{display:flex;flex-wrap:wrap;gap:8px 14px;margin:12px 0 0;font-size:12px;line-height:1.5}
      .tg-calendar .tg-calendar-key>span{display:inline-flex;align-items:center;gap:6px}
      .tg-calendar .tg-calendar-markers{display:flex;align-items:center;justify-content:center;gap:4px;height:6px}
      .tg-calendar .tg-calendar-marker{width:5px;height:5px;border-radius:50%;background:currentColor;color:var(--calendar-ink)}
      .tg-calendar .tg-calendar-marker[data-entry=true]{background:transparent;border:1px solid currentColor}
      .tg-calendar [data-recorded=true] .tg-calendar-marker{color:var(--calendar-on)}
      .tg-calendar .tg-calendar-detail{margin-top:18px;padding-top:16px;border-top:1px solid var(--calendar-line)}
      .tg-calendar .tg-calendar-detail-head{display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;margin-bottom:8px}
      .tg-calendar .tg-calendar-open-day{display:inline-flex;align-items:center;gap:6px;min-height:44px;max-width:100%;padding:8px 0;border:0;border-radius:0;background:transparent;color:var(--calendar-ink);font-family:var(--tm-font-tag);font-size:12px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;cursor:pointer}
      .tg-calendar .tg-calendar-plans{list-style:none;margin:12px 0 0;padding:0}
      .tg-calendar .tg-calendar-plans>li{margin:0;padding:12px 0;border-top:1px solid var(--calendar-line);overflow-wrap:anywhere}
      .tg-calendar .tg-calendar-plans>li:first-child{border-top:0;padding-top:0}
      @media(prefers-reduced-motion:reduce){.tg-calendar button.tg-calendar-day{transition:none}}
    `}</style>
    <div className="tg-calendar-head">
      <h2 id={headingId} style={{fontFamily: "var(--tm-font-display)", fontSize: 22, lineHeight: 1.2, fontWeight: 400, color: t.heading, textTransform: "none", letterSpacing: "normal", margin: 0}}>
        {dateLabel(first, {month: "long", year: "numeric"})}
      </h2>
      <div className="tg-calendar-nav" aria-label={L("Procházet kalendář", "Browse calendar")}>
        <button type="button" aria-label={L("Předchozí měsíc", "Previous month")} style={navStyle} onClick={() => setSelected(shiftMonth(selected, -1),false)}><TmIcon id="back" size={14}/></button>
        <button type="button" aria-label={L("Další měsíc", "Next month")} style={navStyle} onClick={() => setSelected(shiftMonth(selected, 1),false)}><TmIcon id="forward" size={14}/></button>
        <button type="button" style={{...navStyle, fontFamily: "var(--tm-font-tag)", fontSize: 12, textTransform: "uppercase", letterSpacing: ".1em"}} onClick={() => setSelected(dateKey())}>{L("Dnes", "Today")}</button>
      </div>
    </div>
    <div className="tg-calendar-grid" role="group" aria-label={L("Vybrat den", "Choose a day")}>
      {L(["Po", "Út", "St", "Čt", "Pá", "So", "Ne"], ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map(weekday => <span key={weekday} aria-hidden="true" style={{textAlign: "center", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: ".08em", fontSize: 12, color: muted, paddingBottom: 4}}>{weekday}</span>)}
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
        return <button key={day} ref={node => { if (node) dayButtons.current[day] = node; else delete dayButtons.current[day]; }} type="button" className="tg-calendar-day" data-recorded={recorded||undefined} data-estimated={estimated||undefined} aria-label={label} aria-pressed={picked} aria-current={current ? "date" : undefined} aria-controls={showDetails ? detailId : undefined} title={label} tabIndex={focused ? 0 : -1} onClick={() => setSelected(day)} onKeyDown={event => moveWithKeyboard(event, day)}>
          <span>{index + 1}</span>
          <span className="tg-calendar-markers" aria-hidden="true">{hasPlan&&<i className="tg-calendar-marker"/>}{hasRecord&&<i className="tg-calendar-marker" data-entry="true"/>}</span>
        </button>;
      })}
    </div>
    {(showCycle||plans.length>0||recordDates.length>0)&&<div className="tg-calendar-key" style={{color: muted}}>
      {showCycle && <span><i aria-hidden="true" style={{...markerStyle, background: t.accent}}/>{L("Zápis menstruace", "Recorded period")}</span>}
      {showCycle && <span><i aria-hidden="true" style={{...markerStyle, border: `1px dashed ${ink}`}}/>{L("Odhad začátku", "Estimated start")}</span>}
      {plans.length>0&&<span><i aria-hidden="true" style={{...markerStyle, width: 5, height: 5, borderRadius: "50%", background: ink}}/>{L("Společný plán", "Shared plan")}</span>}
      {recordDates.length>0&&<span><i aria-hidden="true" style={{...markerStyle, width: 5, height: 5, borderRadius: "50%", border:`1px solid ${ink}`}}/>{L("Můj zápis", "My entry")}</span>}
    </div>}
    {showDetails&&<div id={detailId} className="tg-calendar-detail" aria-live="polite" aria-atomic="true">
      <div className="tg-calendar-detail-head"><h3 style={{fontFamily: "var(--tm-font-display)", fontSize: 22, lineHeight: 1.3, color: t.heading, fontWeight: 400, margin:0, textTransform: "none", letterSpacing: "normal"}}>{dateLabel(selected, {weekday: "long", day: "numeric", month: "long"})}</h3>
      {onOpenDay&&<button type="button" className="tg-calendar-open-day" onClick={()=>onOpenDay(selected)}>{L("Zápis dne","Day entry")}<TmIcon id="forward" size={13}/></button>}</div>
      {showCycle && <p style={{margin: "0 0 12px", fontSize: 13, color: muted}}>{phase?.id&&CYCLE_GUIDE[phase.id] ? `${L(...CYCLE_GUIDE[phase.id].name)} · ${phase.basis==="recorded"?L("záznam","recorded"):L("odhad","estimated")}` : actual ? L("Zapsaná menstruace.", "Recorded period.") : estimate ? L("Odhad začátku menstruace.", "Estimated period start.") : L("Fáze pro tento den není k dispozici.", "The phase for this day is unavailable.")}</p>}
      {selectedPlans.length ? <ul className="tg-calendar-plans">{selectedPlans.map(p => <li key={p.id}>
        <strong style={{fontFamily: "var(--tm-font-body)", fontSize: 14, fontWeight: 500, color: t.text}}>{p.title}</strong>
        <p style={{margin: "4px 0 0", fontSize: 12, color: muted}}>{[p.time, p.minutes ? `${p.minutes} min` : "", p.status === "done" ? L("Proběhlo", "Completed") : p.approved?.owner && p.approved?.partner ? L("Domluveno", "Agreed") : L("Zatím návrh", "Still a proposal")].filter(Boolean).join(" · ")}</p>
        {onPlanSelect && <button type="button" style={{marginTop: 8}} onClick={() => onPlanSelect(p)}>{L("Otevřít plán", "Open plan")}</button>}
      </li>)}</ul> : <p style={{margin: 0, fontSize: 13, color: muted}}>{L("Na tento den zatím nemáte společný plán.", "You have no shared plan for this day yet.")}</p>}
    </div>}
  </section>;
}
