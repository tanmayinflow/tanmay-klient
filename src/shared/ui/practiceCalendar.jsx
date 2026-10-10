import React from "react";
import { TmIcon } from "./icons.jsx";
import { practiceCalendarEvents, practiceCalendarIcs } from "../product/practiceCalendar.js";

export function PracticeCalendarExport({ date, schedule, allDay, t, L }) {
  const events = practiceCalendarEvents(date, schedule, allDay);
  if (!events.length) return null;
  const download = () => {
    const url = URL.createObjectURL(new Blob([practiceCalendarIcs(events)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "praxe-" + date + ".ics";
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  return <button type="button" onClick={download} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "10px auto 0", minHeight: 44, padding: "8px 12px", border: "none", background: "transparent", color: t.accentInk || t.accent, fontFamily: "var(--tm-font-body)", fontSize: 13, cursor: "pointer" }}><TmIcon id="calendar" size={17}/>{L("Přidat den do kalendáře", "Add day to calendar")}</button>;
}
