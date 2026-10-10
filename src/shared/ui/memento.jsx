import React, { useState } from "react";
import { LifeDots } from "./lifeDots.jsx";
import { TmIcon as FamilyIcon } from "./icons.jsx";
import { FONT_BODY, FONT_TAG, FONT_DISPLAY_EN as FONT_DISPLAY } from "./type.js";
import { fieldStyle, subLabel } from "./components.js";
import { todayISO } from "../product/practice.js";
import { MEMENTO_QUOTES } from "../product/mementoQuotes.js";

export function createMementoUI({ useT, useStore, L }) {
return function PageMemento({ go }) {
  const { t } = useT();
  const st = useStore();
  const mem = st.coll.memento || {};
  // Start from the visit rotation; browsing stays local to this open page.
  const [qi, setQi] = useState(() => (mem.opens || 0) % MEMENTO_QUOTES.length);
  const counted = React.useRef(false);
  React.useEffect(() => { if (counted.current) return; counted.current = true; st.setMemento({ opens: ((st.coll.memento || {}).opens || 0) + 1 }); }, []);
  const [editing, setEditing] = useState(!mem.birth);
  const [birthDraft, setBirthDraft] = useState(mem.birth || "");
  const [spanDraft, setSpanDraft] = useState(String(mem.span || 76));
  const birth = mem.birth || "";
  const span = Math.max(30, Math.min(120, +(mem.span || 76)));
  const total = Math.round(span * 365.25);
  const lived = birth ? Math.max(0, Math.min(total, Math.floor((new Date(todayISO() + "T12:00:00Z").getTime() - new Date(birth + "T12:00:00Z").getTime()) / 86400000) + 1)) : 0;
  const springs = birth ? Math.max(0, span - Math.floor((lived - 1) / 365.25)) : 0;
  const q = MEMENTO_QUOTES[qi];
  const saveCfg = () => {
    const b = (birthDraft || "").trim();
    if (!b) return;
    st.setMemento({ birth: b, span: Math.max(30, Math.min(120, +spanDraft || 76)) });
    setEditing(false);
  };
  return (
    <div className="tm-view" style={{ maxWidth: 680, margin: "0 auto" }}>
      <button onClick={() => go("praxe")} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 13, padding: "8px 0", minHeight: 34, display: "inline-flex", alignItems: "center", gap: 6 }}><FamilyIcon id="back" size={12} label={L("Zpět","Back")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Praxe", "Practice")}</button>
      <div style={{ textAlign: "center", margin: "26px 0 0" }}>
        <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.34em", fontSize: 12, color: t.sage }}>memento mori</div>
        <div data-guide="memento.view" aria-live="polite" aria-atomic="true">
        <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 22, lineHeight: 1.55, color: t.heading, maxWidth: 560, margin: "22px auto 0" }}>{L(q.cz, q.en)}</div>
        <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: t.textMuted, marginTop: 10 }}>{L(q.src, q.srcEn)}</div>
        </div>
        <nav data-guide="memento.reflection" className="tm-spell-controls" aria-label={L("Procházení citátů", "Browse quotes")}>
          <button type="button" onClick={() => setQi(index => (index - 1 + MEMENTO_QUOTES.length) % MEMENTO_QUOTES.length)} aria-label={L("Předchozí citát", "Previous quote")}><FamilyIcon id="back" size={18} /></button>
          <span style={{ color: t.textMuted }} aria-label={L(`Citát ${qi + 1} z ${MEMENTO_QUOTES.length}`, `Quote ${qi + 1} of ${MEMENTO_QUOTES.length}`)}>{qi + 1} / {MEMENTO_QUOTES.length}</span>
          <button type="button" onClick={() => setQi(index => (index + 1) % MEMENTO_QUOTES.length)} aria-label={L("Další citát", "Next quote")}><FamilyIcon id="forward" size={18} /></button>
        </nav>
        <div style={{ width: 44, height: 1, background: t.accent, opacity: 0.7, margin: "26px auto" }} />
      </div>
      {editing ? (
        <div style={{ maxWidth: 380, margin: "0 auto", background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, lineHeight: 1.65, marginBottom: 14 }}>{L("Aby místnost věděla, kolik dní neseš.", "So the room knows how many days you carry.")}</div>
          <div style={{ ...subLabel(t), marginBottom: 4 }}>{L("Datum narození", "Date of birth")}</div>
          <input type="date" value={birthDraft} onChange={(e) => setBirthDraft(e.target.value)} style={{ ...fieldStyle(t), width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box", WebkitAppearance: "none", appearance: "none", padding: "7px 10px", fontSize: 13, marginBottom: 12 }} />
          <div style={{ ...subLabel(t), marginBottom: 4 }}>{L("Délka života · roky", "Life span · years")}</div>
          <input type="number" min={30} max={120} value={spanDraft} onChange={(e) => setSpanDraft(e.target.value)} style={{ ...fieldStyle(t), width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box", padding: "7px 10px", fontSize: 13, marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            {birth && <button onClick={() => setEditing(false)} style={{ background: "transparent", color: t.textSec, border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>{L("Zrušit", "Cancel")}</button>}
            <button onClick={saveCfg} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500 }}>{L("Uložit", "Save")}</button>
          </div>
        </div>
      ) : (
        <div>
          <LifeDots total={total} lived={lived} t={t} L={L} />
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec }}>{L("Den", "Day")} {lived.toLocaleString(L("cs-CZ", "en-GB"))} {L("z asi", "of about")} {total.toLocaleString(L("cs-CZ", "en-GB"))}.</div>
            <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 3 }}>{L(`Před tebou je ještě asi ${springs} letních slunovratů.`, `About ${springs} summer solstices still ahead.`)}</div>
            {st.editMode && <button onClick={() => { setBirthDraft(birth); setSpanDraft(String(span)); setEditing(true); }} style={{ marginTop: 12, background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}>{L("Upravit", "Edit")}</button>}
          </div>
        </div>
      )}
    </div>
  );
}


}
