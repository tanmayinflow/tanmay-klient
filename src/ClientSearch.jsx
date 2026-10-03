import React, { useState } from "react";
import { searchClientRecords } from "./clientSearch.js";

export function ClientSearch({ t, lang, records, goals, sources, enabled, onPick, onClose, Sheet }) {
  const [query, setQuery] = useState("");
  const cs = lang !== "en";
  const names = cs ? { zapisnik: "Zápisník", denik: "Deník", prameny: "Prameny", kompas: "Kompas" } : { zapisnik: "Notebook", denik: "Journal", prameny: "Sources", kompas: "Compass" };
  const matches = searchClientRecords({ query, records, goals, sources, enabled });
  return <Sheet title={cs ? "Hledat v aplikaci" : "Search the app"} onClose={onClose}>
    <input autoFocus type="search" aria-label={cs ? "Hledat v aplikaci" : "Search the app"} value={query} onChange={event => setQuery(event.target.value)} placeholder={cs ? "Název nebo několik slov…" : "A title or a few words…"}
      style={{ boxSizing: "border-box", width: "100%", minHeight: 48, padding: "10px 12px", color: t.text, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 9, font: "inherit", marginBottom: 14 }} />
    <p role="status" aria-live="polite" style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.5, margin: "0 0 12px" }}>
      {!query.trim() ? (cs ? "Poznámky, zápisky, cíle a prameny v místnostech, které používáš." : "Notes, journal entries, goals and sources in the rooms you use.") : matches.length ? (cs ? `Nalezeno ${matches.length}${matches.length === 40 ? "+" : ""}` : `${matches.length}${matches.length === 40 ? "+" : ""} results`) : (cs ? "Nic nenalezeno. Zkus kratší výraz nebo jiná slova." : "No results. Try a shorter phrase or different words.")}
    </p>
    <div style={{ display: "grid", gap: 2 }}>
      {matches.map(hit => <button key={`${hit.kind}:${hit.id}`} onClick={() => onPick(hit)} style={{ width: "100%", textAlign: "left", padding: "13px 2px", minHeight: 56, cursor: "pointer", border: "none", borderBottom: `1px solid ${t.borderSoft}`, background: "transparent", color: t.text, font: "inherit" }}>
        <span style={{ display: "block", color: t.sage, fontSize: 12, marginBottom: 5 }}>{names[hit.room]}{hit.date ? ` · ${hit.date}` : ""}</span>
        <span style={{ display: "block", color: t.heading, fontFamily: "var(--tm-font-display)", fontSize: 23, lineHeight: 1.25, overflowWrap: "anywhere" }}>{hit.title || (cs ? "Bez názvu" : "Untitled")}</span>
        {hit.snippet && <span style={{ display: "block", color: t.textSec, fontSize: 13, lineHeight: 1.6, marginTop: 6, overflowWrap: "anywhere" }}>{hit.snippet}</span>}
      </button>)}
    </div>
  </Sheet>;
}
