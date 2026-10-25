import React, { useId, useState } from "react";
import { MUSCLE_GROUPS, resolveMuscleMap } from "../../training/muscleMap.js";
import { MUSCLE_REGIONS } from "./muscleRegions.js";
import { FEMALE_MUSCLE_REGIONS, FEMALE_MUSCLE_REGION_META } from "./femaleMuscleRegions.js";
import { usePersonalProfile } from "./personalProfile.jsx";

// Registered front/back pairs. Original figures and component are preserved.
// Separate alpha layers keep the body and linework aligned in every theme.
export const TM_SVALY_SRC = {
  original: "/svaly/unified-muscles-original-80e09146b69d.webp",
  ink: "/svaly/unified-muscles-ink-17b54c79d29b.webp",
  fill: "/svaly/unified-muscles-fill-b1993cd8158e.webp",
};
export const TM_SVALY_FEMALE_SRC = {
  original: "/svaly/female-muscles-original-230f65557653.webp",
  ink: "/svaly/female-muscles-ink-acc7b3c27be0.webp",
  fill: "/svaly/female-muscles-fill-485dba73f238.webp",
};
const groups = Object.fromEntries(MUSCLE_GROUPS.map(group => [group.k, group]));
// Orientation markers registered against each existing figure. These identify
// body areas, not additional muscles or anatomical tissue boundaries.
export const BODY_AREA_LANDMARKS = {
  unified: {
    knees: [[181, 978, 34, 38], [359, 978, 34, 38], [654, 982, 33, 28], [850, 982, 33, 28]],
    feet: [[137, 1289, 57, 43], [403, 1289, 57, 43], [619, 1293, 53, 35], [885, 1293, 53, 35]],
  },
  female: {
    knees: [[185, 1007, 34, 38], [359, 1007, 34, 38], [658, 1020, 33, 28], [850, 1020, 33, 28]],
    feet: [[147, 1338, 56, 42], [397, 1338, 56, 42], [629, 1340, 51, 34], [879, 1340, 51, 34]],
  },
};

export function createMuscleFig({ useT, L, resolveMap = resolveMuscleMap }) {
  function TmSvalyFigura({ ex, meta, mp = [], ms = [], size = 150, fluid = false, illustration, selectedMuscles = [], highlightedMuscles = selectedMuscles, selectedRegions = [], onToggleMuscle, onToggleRegion }) {
    const { t } = useT();
    const { profile, accountKey } = usePersonalProfile();
    // This follows the account's declared profile, including live changes and
    // invalidation on sign-out. The figure never changes exercise assignments.
    const female = !!accountKey && profile.wording === "female";
    const variant = female ? "female" : "unified";
    const sources = female ? TM_SVALY_FEMALE_SRC : TM_SVALY_SRC;
    const regions = female ? FEMALE_MUSCLE_REGIONS : MUSCLE_REGIONS;
    const uid = useId();
    const [selected, setSelected] = useState(null);
    const [layers, setLayers] = useState({});
    const [failures, setFailures] = useState({});
    const [focusedArea, setFocusedArea] = useState(null);
    const selectionMode = typeof onToggleMuscle === 'function';
    const map = selectionMode ? { primary: highlightedMuscles.filter(key => groups[key]), secondary: [], unknown: [], mode: 'selection' } : resolveMap(ex || { mp, ms }, meta);
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
    const ready = layers.variant === variant && layers.ink && layers.fill;
    const visible = ready || (layers.variant === variant && layers.original);
    const failed = !visible && failures.variant === variant && failures.original && (failures.ink || failures.fill);
    const imageFailed = layer => setFailures(prev => ({ ...(prev.variant === variant ? prev : {}), variant, [layer]: true }));
    const figure = <div style={{ minWidth: 0 }}>
      {failed ? <div role="status" style={{ padding: "20px 8px", color: t.textMuted, fontSize: 12 }}>{L("Obrázek svalové mapy se nepodařilo načíst. Svaly můžeš vybrat podle názvu.", "The muscle map image could not be loaded. Select muscles by name.")}</div> : <svg key={variant} viewBox={female ? FEMALE_MUSCLE_REGION_META.viewBox : "0 80 1024 1280"} aria-hidden={selectionMode ? undefined : true} aria-label={selectionMode ? L('Vybrat svaly na postavě', 'Select muscles on the figure') : undefined} focusable="false" data-muscle-figure={variant}
        style={{ display: "block", width: "100%", height: "auto", overflow: "hidden" }}>
        <defs>
          {["fill", "ink"].map(layer => <mask key={layer} id={uid + layer} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536" style={{ maskType: "alpha" }}>
            <image href={sources[layer]} width="1024" height="1536" onLoad={() => setLayers(prev => ({ ...(prev.variant === variant ? prev : {}), variant, [layer]: true }))} onError={() => imageFailed(layer)} />
          </mask>)}
        </defs>
        <image href={sources.original} width="1024" height="1536" opacity={ready ? 0 : 1} onLoad={() => setLayers(prev => ({ ...(prev.variant === variant ? prev : {}), variant, original: true }))} onError={() => imageFailed('original')} />
        {ready && <g><rect width="1024" height="1536" fill={skin} mask={"url(#" + uid + "fill)"} /><rect width="1024" height="1536" fill={ink} mask={"url(#" + uid + "ink)"} /></g>}
        {(!selectionMode || visible) && (selectionMode ? Object.keys(groups) : [...map.secondary, ...map.primary]).map(key => <g key={key} data-muscle={key} data-role={map.primary.includes(key) ? "primary" : "secondary"} opacity={active && active !== key ? 0.2 : 1}
          role={selectionMode ? 'checkbox' : undefined} tabIndex={selectionMode ? 0 : undefined} aria-label={selectionMode ? label(groups[key]) : undefined} aria-checked={selectionMode ? selectedMuscles.includes(key) : undefined}
          style={selectionMode ? { cursor: 'pointer', outlineOffset: 3 } : undefined}
          onClick={selectionMode ? () => onToggleMuscle(key) : undefined}
          onKeyDown={selectionMode ? event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); onToggleMuscle(key); } } : undefined}>
          {selectionMode && <title>{label(groups[key])}</title>}
          {(regions[key] || []).map((region, index) => <g key={index}>
            {(!selectionMode || map.primary.includes(key)) && <path d={region.d} fill={skin} opacity="0.85" />}
            <path d={region.d} fill={areaInk} fillOpacity={map.primary.includes(key) ? 0.65 : selectionMode ? 0.001 : 0.23} stroke={selectionMode && !map.primary.includes(key) ? 'transparent' : areaInk} strokeWidth={active === key ? 4 : 2.5} strokeLinejoin="round" strokeDasharray={map.primary.includes(key) ? undefined : "7 5"} />
          </g>)}
        </g>)}
        {selectionMode && visible && typeof onToggleRegion === 'function' && Object.entries(BODY_AREA_LANDMARKS[variant]).map(([key, markers]) => {
          const checked = selectedRegions.includes(key), highlighted = checked || selectedRegions.includes('whole_body'), focused = focusedArea === key;
          const areaLabel = key === 'knees' ? L('Kolena', 'Knees') : L('Chodidla', 'Feet');
          return <g key={key} data-body-area={key} role="checkbox" tabIndex={0} aria-label={areaLabel} aria-checked={checked}
            style={{ cursor: 'pointer', outline: 'none' }} onFocus={() => setFocusedArea(key)} onBlur={() => setFocusedArea(null)}
            onClick={() => onToggleRegion(key)} onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); onToggleRegion(key); } }}>
            <title>{areaLabel}</title>
            {markers.map(([cx, cy, rx, ry], index) => <ellipse key={index} cx={cx} cy={cy} rx={rx} ry={ry}
              fill={markerInk} fillOpacity={highlighted ? 0.12 : 0.001} stroke={highlighted || focused ? markerInk : 'transparent'} strokeWidth={focused ? 3 : 2}
              strokeDasharray={focused && !highlighted ? '4 3' : undefined} vectorEffect="non-scaling-stroke" />)}
          </g>;
        })}
      </svg>}
      {selectionMode && !failed && !visible && <div role="status" style={{ color: t.textMuted, fontSize: 12 }}>{L('Načítám postavu… Svaly lze vybrat i podle názvu.', 'Loading figure… You can also select muscles by name.')}</div>}
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
      {!selectionMode && <div style={{ margin: "10px 0 16px" }}>
        {all.length > 0 && <><div style={{ color: t.heading, fontWeight: 500 }}>{targeted ? L("Zaměření pohybu", "Movement focus") : L("Zapojené svaly", "Muscles involved")}</div>{section(map.primary, false)}{section(map.secondary, true)}</>}
        {activeGroup && <div aria-live="polite" style={{ marginTop: 7, color: t.textMuted, fontSize: 12 }}>
          {activeGroup.anatomy}{activeGroup.region && " · " + L(activeGroup.region.cz, activeGroup.region.en)}
          {activeGroup.note && <div>{L(activeGroup.note.cz, activeGroup.note.en)}</div>}
        </div>}
        {!all.length && <div style={{ color: t.textMuted }}>{map.mode === "none" ? L("Tento cvik nemá samostatnou svalovou mapu.", "This exercise has no separate muscle map.") : L("Svalové zapojení u tohoto cviku zatím není upřesněné.", "Muscle involvement has not yet been specified for this exercise.")}</div>}
        {map.unknown.length > 0 && <div style={{ color: t.textMuted, marginTop: 5 }}>{L("Část svalových údajů nemá přiřazenou oblast v mapě.", "Some muscle data has no corresponding region on this map.")}</div>}
        {map.note && <div style={{ color: t.textMuted, fontSize: 12, marginTop: 7 }}>{L(map.note.cz, map.note.en)}</div>}
        {targeted && all.length > 0 && <div style={{ color: t.textMuted, fontSize: 12, marginTop: 7 }}>{L("Označené oblasti, na které pohyb míří. Nejde o pořadí síly svalového zapojení.", "The marked areas are the focus of the movement, not a ranking of muscle activation.")}</div>}
      </div>}
    </div>;
  }
  return { TmSvalyFigura };
}
