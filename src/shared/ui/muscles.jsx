import React, { useId, useState } from "react";
import { MUSCLE_GROUPS, resolveMuscleMap } from "../../training/muscleMap.js";
import { MUSCLE_REGIONS } from "./muscleRegions.js";

// One reviewed character pair. Original figures and component are archived.
// Separate alpha layers keep the body and linework aligned in every theme.
export const TM_SVALY_SRC = {
  original: "/svaly/unified-muscles-original-80e09146b69d.webp",
  ink: "/svaly/unified-muscles-ink-17b54c79d29b.webp",
  fill: "/svaly/unified-muscles-fill-b1993cd8158e.webp",
};
const groups = Object.fromEntries(MUSCLE_GROUPS.map(group => [group.k, group]));

export function createMuscleFig({ useT, L }) {
  function TmSvalyFigura({ ex, mp = [], ms = [], size = 150, fluid = false, illustration }) {
    const { t } = useT();
    const uid = useId();
    const [selected, setSelected] = useState(null);
    const [layers, setLayers] = useState({});
    const [failed, setFailed] = useState(false);
    const map = resolveMuscleMap(ex || { mp, ms });
    const all = [...map.primary, ...map.secondary];
    const active = all.includes(selected) ? selected : null;
    const skin = t.mode === "dark" ? "#d9cfbb" : t.bg;
    const ink = "#292622";
    // Earth ink remains distinct from the pale body even in sand-accent themes.
    const areaInk = "#743627";
    const markerInk = t.mode === "dark" ? "#BC9281" : areaInk;
    const label = group => L(group.cz, group.en);
    const targeted = map.mode === "mobility";
    const activeGroup = active && groups[active];
    const ready = layers.ink && layers.fill;
    const figure = <div style={{ minWidth: 0 }}>
      {failed ? <div role="status" style={{ padding: "20px 8px", color: t.textMuted, fontSize: 12 }}>{L("Obrázek svalové mapy se nepodařilo načíst. Zapojené svaly jsou uvedené níže.", "The muscle map image could not be loaded. The involved muscles are listed below.")}</div> : <svg viewBox="0 80 1024 1280" aria-hidden="true" focusable="false" data-muscle-figure="unified"
        style={{ display: "block", width: "100%", height: "auto", overflow: "hidden" }}>
        <defs>
          {["fill", "ink"].map(layer => <mask key={layer} id={uid + layer} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{ maskType: "alpha" }}>
            <image href={TM_SVALY_SRC[layer]} width="1024" height="1536" onLoad={() => setLayers(prev => ({ ...prev, [layer]: true }))} />
          </mask>)}
        </defs>
        <image href={TM_SVALY_SRC.original} width="1024" height="1536" opacity={ready ? 0 : 1} onError={() => setFailed(true)} />
        {ready && <g><rect width="1024" height="1536" fill={skin} mask={"url(#" + uid + "fill)"} /><rect width="1024" height="1536" fill={ink} mask={"url(#" + uid + "ink)"} /></g>}
        {[...map.secondary, ...map.primary].map(key => <g key={key} data-muscle={key} data-role={map.primary.includes(key) ? "primary" : "secondary"} opacity={active && active !== key ? 0.2 : 1}>
          {(MUSCLE_REGIONS[key] || []).map((region, index) => <g key={index}>
            <path d={region.d} fill={skin} opacity="0.85" />
            <path d={region.d} fill={areaInk} fillOpacity={map.primary.includes(key) ? 0.65 : 0.23} stroke={areaInk} strokeWidth={active === key ? 4 : 2.5} strokeLinejoin="round" strokeDasharray={map.primary.includes(key) ? undefined : "7 5"} />
          </g>)}
        </g>)}
      </svg>}
      {!failed && <div aria-hidden="true" style={{ display: "flex", justifyContent: "space-around", fontFamily: "var(--tm-font-body)", fontSize: 11, color: t.textMuted, marginTop: 3 }}><span>{L("Zepředu", "Front")}</span><span>{L("Zezadu", "Back")}</span></div>}
    </div>;
    const section = (keys, secondary) => keys.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "74px minmax(0,1fr)", columnGap: 8, alignItems: "baseline", marginTop: 6 }}>
      <span style={{ fontSize: 12, color: t.textMuted }}>{secondary ? L("Vedlejší", "Secondary") : targeted ? L("Zaměření", "Target areas") : L("Hlavní", "Primary")}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 12px" }}>{keys.map(key => <button type="button" key={key} aria-pressed={active === key} onClick={() => setSelected(active === key ? null : key)}
        title={L("Zvýraznit: ", "Highlight: ") + label(groups[key])}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: 0, padding: "4px 0", textAlign: "left", cursor: "pointer", font: "inherit", color: t.text, textDecoration: active === key ? "underline" : "none", textUnderlineOffset: "3px" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0 }}><circle cx="5" cy="5" r="3.5" fill={secondary ? "none" : markerInk} stroke={markerInk} strokeWidth="1.5" /></svg>{label(groups[key])}
      </button>)}</div>
    </div>;
    return <div style={{ width: fluid || illustration ? "100%" : size * 1.32, maxWidth: "100%", fontFamily: "var(--tm-font-body)", fontSize: 13, lineHeight: 1.5 }} data-muscle-map-mode={map.mode}>
      {illustration ? <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.12fr)", gap: 14, alignItems: "start", margin: "10px 0 6px" }}>
        <div style={{ minWidth: 0, background: t.card, border: "1px solid " + t.borderSoft, borderRadius: 12, padding: "8px 8px 4px" }}>{illustration}</div>{figure}
      </div> : figure}
      <div style={{ margin: "10px 0 16px" }}>
        {all.length > 0 && <><div style={{ color: t.heading, fontWeight: 500 }}>{targeted ? L("Zaměření pohybu", "Movement focus") : L("Zapojené svaly", "Muscles involved")}</div>{section(map.primary, false)}{section(map.secondary, true)}</>}
        {activeGroup && <div aria-live="polite" style={{ marginTop: 7, color: t.textMuted, fontSize: 12 }}>
          {activeGroup.anatomy}{activeGroup.region && " · " + L(activeGroup.region.cz, activeGroup.region.en)}
          {activeGroup.note && <div>{L(activeGroup.note.cz, activeGroup.note.en)}</div>}
        </div>}
        {!all.length && <div style={{ color: t.textMuted }}>{map.mode === "none" ? L("Tento cvik nemá samostatnou svalovou mapu.", "This exercise has no separate muscle map.") : L("Svalové zapojení u tohoto cviku zatím není upřesněné.", "Muscle involvement has not yet been specified for this exercise.")}</div>}
        {map.unknown.length > 0 && <div style={{ color: t.textMuted, marginTop: 5 }}>{L("Část svalových údajů nemá přiřazenou oblast v mapě.", "Some muscle data has no corresponding region on this map.")}</div>}
        {map.note && <div style={{ color: t.textMuted, fontSize: 12, marginTop: 7 }}>{L(map.note.cz, map.note.en)}</div>}
        {targeted && all.length > 0 && <div style={{ color: t.textMuted, fontSize: 12, marginTop: 7 }}>{L("Označené oblasti, na které pohyb míří. Nejde o pořadí síly svalového zapojení.", "The marked areas are the focus of the movement, not a ranking of muscle activation.")}</div>}
      </div>
    </div>;
  }
  return { TmSvalyFigura };
}
