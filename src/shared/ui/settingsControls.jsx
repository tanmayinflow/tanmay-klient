import React from "react";
import {TmIcon as FamilyIcon} from "./icons.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";
import {hexA} from "./color.js";
export function createSettingsUI({useT,L}){
function SetSection({ title, children, note, id, open, onOpen, always }) {
  const { t } = useT();
  const skladaci = !!id && !always;
  const otevreno = !skladaci || open;
  return (
    <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: skladaci ? 0 : 16, paddingTop: skladaci ? 0 : 14 }}>
      {skladaci ? (
        <button onClick={() => onOpen && onOpen(otevreno ? "" : id)} data-guide={({ucet:"nastaveni.account",stranky:"nastaveni.rooms",kal:"nastaveni.calendar",verze:"nastaveni.version",account:"nastaveni.account",rooms:"nastaveni.rooms",calendar:"nastaveni.calendar",version:"nastaveni.version"})[id]} className="tm-nav-item" aria-expanded={otevreno}
          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "13px 8px", minHeight: 50, cursor: "pointer" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", color: t.sage, transition: "transform .2s cubic-bezier(.23,.62,.22,.99)", transform: otevreno ? "rotate(90deg)" : "none" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: otevreno ? t.accentInk || t.accent : t.sage }}>{title}</span>
        </button>
      ) : (
        <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: t.sage, marginBottom: note ? 4 : 8 }}>{title}</div>
      )}
      {otevreno && (
        <div style={skladaci ? { animation: "tmUnfold .22s cubic-bezier(.23,.62,.22,.99) both", paddingBottom: 8 } : undefined}>
          {note && <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, margin: "0 0 10px", lineHeight: 1.55, maxWidth: 460 }}>{note}</p>}
          {children}
        </div>
      )}
    </div>
  );
}
function SetSwitch({ label, hint, on, onChange, disabled }) {
  const { t } = useT();
  return (
    <button onClick={() => !disabled && onChange(!on)} disabled={disabled} role="switch" aria-checked={on} className="tm-nav-item"
      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "10px 8px", minHeight: 48, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1 }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 13, color: t.text }}>{label}</span>
        {hint && <span style={{ display: "block", fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 1, lineHeight: 1.45 }}>{hint}</span>}
      </span>
      <span aria-hidden="true" style={{ flexShrink: 0, position: "relative", width: 42, height: 22, borderRadius: 14, background: on ? t.accent : "transparent", border: `1px solid ${on ? t.accent : t.border}`, transition: "background .18s ease, border-color .18s ease" }}>
        <span style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: on ? t.bg : t.textMuted, transition: "left .18s cubic-bezier(.23,.62,.22,.99)" }} />
      </span>
    </button>
  );
}
function SetChoice({ label, value, options, onChange }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 8px" }}>
      <span style={{ flex: "1 1 130px", minWidth: 0, fontFamily: FONT_BODY, fontSize: 13, color: t.text }}>{label}</span>
      <span style={{ display: "inline-flex", gap: 4, flexShrink: 0, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}
            style={{ background: value === o.v ? hexA(t.accent, 0.14) : "transparent", border: `1px solid ${value === o.v ? t.accent : t.borderSoft}`, borderRadius: 999, padding: "6px 13px", minHeight: 34, cursor: "pointer", color: value === o.v ? t.accent : t.textSec, fontFamily: FONT_BODY, fontSize: 12, transition: "border-color .18s ease, color .18s ease, background .18s ease" }}>{o.label}</button>
        ))}
      </span>
    </div>
  );
}
return {SetSection,SetSwitch,SetChoice};
}
