// ----------------------------------------------------------------------
// IKONOVÝ SYSTÉM TANMAY PRACTICE · jeden jazyk, jedna mřížka, jeden zdroj
// ----------------------------------------------------------------------
// Do 2026-08 žily ikony na čtyřech mřížkách (12/16/24/48), v sedmi tazích
// (0,8 až 1,7), dvakrát v každém domě, a mezi nimi emoji a textové znaky,
// které se na každém systému kreslí jinak. Tohle je kanonická náprava:
//
//   · mřížka 24 × 24, tah 1.7 / 2.05, kulaté konce i spoje, currentColor
//   · <TmIcon id="…" /> — jediné primitivum; význam nese sémantické id
//   · TM_ICONS — registr kreseb; TM_USER_ICONS — kurátorovaná řada,
//     ze které si klient vybírá ikonu pro vlastní návyky, krajiny a cíle
//   · neznámé id nikdy nespadne — kreslí se bindu (kroužek s tečkou)
//   · žádná pevná barva, žádný gradient, žádný stín; barvu dává okolí
//
// Vizuální řeč zůstává řečí domu: klidná linka, druhotný tah přes
// opacity, tu a tam plná tečka (bindu). Optická velikost má přednost
// před matematickou — kruh, šipka i postava mají působit stejně silně.
//
// Aktivní stav nekreslí jinou ikonu: stejná geometrie, silnější popředí
// nebo zvolené pozadí od komponenty okolo. Dekorativní ikona je pro
// čtečku neviditelná (aria-hidden); samostatné ikonové tlačítko musí
// dostat jméno od svého <button aria-label|title>, ne od ikony.
import React, { useState } from "react";
import { ICON_DRAWINGS, ICON_OPTICS } from "./iconDrawings.jsx";

/** Kanonický kontrakt. Render: 16 mikro · 20 kompakt · 24 výchozí · 32 výběr. */
export const TM_ICON_CONTRACT = Object.freeze({
  viewBox: 24, stroke: 1.7, smallStroke: 2.05, smallMax: 20,
  sizes: Object.freeze({ micro: 16, compact: 20, default: 24, prominent: 32 }),
});

// ----------------------------------------------------------------------
// REGISTR KRESEB · sémantické id → geometrie na mřížce 24
// ----------------------------------------------------------------------
// Reviewed geometry and original bitmap masks share the same semantic registry.
// Drobné plné tečky (bindu) jsou fill="currentColor" stroke="none".
export const TM_ICONS = Object.fromEntries(Object.entries(ICON_DRAWINGS).map(([id, art]) => [id, art.regular]));

// ----------------------------------------------------------------------
// PRIMITIVUM
// ----------------------------------------------------------------------
/**
 * <TmIcon id size strokeWidth label className style />
 * · `id`     sémantické id z TM_ICONS; neznámé id kreslí bindu, nikdy nespadne
 * · `size`   16 · 20 · 24 · 32 (výchozí 24); glyf nemusí plnit dotykový cíl
 * · `label`  jen pro samostatnou významovou ikonu; jinak je dekorativní
 *            (aria-hidden) a jméno nese okolní ovládací prvek
 * Small controls use the reviewed optical variant up to 20px.
 */
export function TmIcon({ id, size = 24, strokeWidth, label, className, style, ...rest }) {
  const key = Object.hasOwn(ICON_DRAWINGS, id) ? id : "bindu";
  const small = Number(size) <= ICON_OPTICS.smallMax;
  const body = ICON_DRAWINGS[key][small ? "small" : "regular"];
  const a11y = { role: label ? "img" : undefined, "aria-label": label || undefined, "aria-hidden": label ? undefined : true };
  const base = { display: "block", flexShrink: 0, width: size, height: size, ...style };
  if (typeof body === "string") return <span {...rest} {...a11y} className={className} data-tm-icon={key} data-icon-variant={small ? "small" : "regular"}
    style={{ ...base, backgroundColor: "currentColor", mask: `url("${body}") center/contain no-repeat`, WebkitMask: `url("${body}") center/contain no-repeat` }} />;
  return <svg {...rest} {...a11y} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth ?? (small ? ICON_OPTICS.smallStroke : ICON_OPTICS.regularStroke)} strokeLinecap="round" strokeLinejoin="round"
    focusable="false" className={className} style={base} data-tm-icon={key} data-icon-variant={small ? "small" : "regular"}>{body}</svg>;
}

/** Platné id, nebo null. Pro čtení uložených dat. */
export const tmIconId = (id) => (id && Object.hasOwn(TM_ICONS, id) ? id : null);

// ----------------------------------------------------------------------
// KURÁTOROVANÁ ŘADA · ikony, ze kterých si člověk vybírá
// ----------------------------------------------------------------------
// Pro vlastní návyky, krajiny a cíle. Kreslí se stejnou řečí jako celý
// dům — žádný klipart, žádné barvy, žádná ikona za každou cenu.
// Popisky jsou lidské (CZ/EN); id je stabilní a ukládá se do dat.
export const TM_USER_ICON_GROUPS = [
  { key: "pohyb", cz: "Pohyb", en: "Movement", ids: [
    "strength", "mobility", "balance", "endurance", "body", "movement", "recovery", "stretch", "posture",
  ] },
  { key: "praxe", cz: "Praxe", en: "Practice", ids: [
    "practice", "cycle", "repetition", "consistency", "clock", "calendar", "morning", "evening",
  ] },
  { key: "pozornost", cz: "Pozornost", en: "Attention", ids: [
    "breath", "focus", "meditation", "reflection", "journal", "calm",
  ] },
  { key: "priroda", cz: "Příroda", en: "Nature", ids: [
    "tree", "leaf", "mountain", "path", "sun", "moon", "water", "fire", "drop",
  ] },
  { key: "zivot", cz: "Život", en: "Life", ids: [
    "work", "learning", "home", "people", "creativity", "travel", "food", "sleep", "energy",
  ] },
  { key: "obecne", cz: "Obecné", en: "General", ids: [
    "target", "flag", "compass", "star", "step", "check", "bindu",
  ] },
];

export const TM_USER_ICON_LABELS = {
  strength: ["Síla", "Strength"], mobility: ["Pohyblivost", "Mobility"], balance: ["Rovnováha", "Balance"],
  endurance: ["Výdrž", "Endurance"], body: ["Tělo", "Body"], movement: ["Pohyb", "Movement"],
  recovery: ["Zotavení", "Recovery"], stretch: ["Protažení", "Stretch"], posture: ["Držení těla", "Posture"],
  practice: ["Praxe", "Practice"], cycle: ["Rytmus", "Rhythm"], repetition: ["Opakování", "Repetition"],
  consistency: ["Stálost", "Consistency"], clock: ["Čas", "Time"], calendar: ["Kalendář", "Calendar"],
  morning: ["Ráno", "Morning"], evening: ["Večer", "Evening"],
  breath: ["Dech", "Breath"], focus: ["Soustředění", "Focus"], meditation: ["Meditace", "Meditation"],
  reflection: ["Reflexe", "Reflection"], journal: ["Zápis", "Journal"], calm: ["Klid", "Calm"],
  tree: ["Strom", "Tree"], leaf: ["List", "Leaf"], mountain: ["Hora", "Mountain"], path: ["Cesta", "Path"],
  sun: ["Slunce", "Sun"], moon: ["Měsíc", "Moon"], water: ["Voda", "Water"], fire: ["Oheň", "Fire"],
  drop: ["Kapka", "Drop"],
  work: ["Práce", "Work"], learning: ["Učení", "Learning"], home: ["Domov", "Home"], people: ["Lidé", "People"],
  creativity: ["Tvořivost", "Creativity"], travel: ["Cesty", "Travel"], food: ["Jídlo", "Food"],
  sleep: ["Spánek", "Sleep"], energy: ["Energie", "Energy"],
  target: ["Cíl", "Target"], flag: ["Vlajka", "Flag"], compass: ["Kompas", "Compass"], star: ["Hvězda", "Star"],
  step: ["Krok", "Step"], check: ["Hotovo", "Done"], bindu: ["Bindu", "Bindu"],
};

/** Výchozí ikona typu objektu, když si člověk žádnou nevybral. */
export const TM_ICON_DEFAULTS = Object.freeze({ goal: "target", habit: "cycle", area: "compass" });

// Známé staré znaky a emoji → sémantické id. Jen jistoty; co nezná,
// nechá být — starý znak se dál vykreslí, nikdy se tiše nepřepíše.
export const TM_LEGACY_ICON = {
  "🔥": "fire", "🌊": "water", "▲": "mountain", "✎": "journal", "📓": "notebook",
  "▤": "sources", "🤝": "clients", "🫙": "stewardship", "🗑": "basket", "🎲": "compass",
  "📣": "voice", "▦": "areas", "◎": "target", "○": "bindu", "●": "bindu",
  "☀": "sun", "☾": "moon", "🌙": "moon", "⭐": "star", "★": "star", "🌿": "leaf", "🍃": "leaf",
  "🌳": "tree", "🌲": "tree", "⛰": "mountain", "🏔": "mountain", "💧": "drop", "🕯": "calm",
  "🧘": "meditation", "💪": "strength", "🏃": "endurance", "📖": "book", "📚": "learning",
  "🏠": "home", "🍎": "food", "🥗": "food", "😴": "sleep", "⚡": "energy", "✨": "creativity",
  "🎯": "target", "🚩": "flag", "🧭": "compass", "⏰": "clock", "🕐": "clock", "📅": "calendar",
};
export const tmIconFromLegacy = (ch) => TM_LEGACY_ICON[String(ch || "").trim()] || null;

/**
 * Jedna cesta k ikoně uloženého objektu:
 * 1. platné `iconId` → ta ikona; 2. známý starý znak → jeho ikona;
 * 3. neznámý znak → vrací { char } a volající ho vykreslí jako text;
 * 4. nic → výchozí ikona typu. Nikdy rozbité SVG, nikdy surové id.
 */
export function tmResolveIcon(obj, kind) {
  const id = tmIconId(obj && obj.iconId);
  if (id) return { id };
  const raw = obj && typeof obj.icon === "string" ? obj.icon.trim() : "";
  if (raw) {
    const legacy = tmIconFromLegacy(raw);
    if (legacy) return { id: legacy };
    return { char: raw };
  }
  return { id: TM_ICON_DEFAULTS[kind] || "bindu" };
}

// ----------------------------------------------------------------------
// VÝBĚR IKONY · jedna mřížka pro celý produkt
// ----------------------------------------------------------------------
// Mobil na prvním místě: velké cíle (44 px), žádný dropdown, žádné
// hledání pro čtyřicet ikon. Vybraná ikona je vidět dřív, než se výběr
// otevře; zvolený stav nese rámeček a pozadí, ne jen barva.
export function createIconUI(deps) {
  const { useT, L } = deps;

  /** Aktuální ikona objektu · pro řádky a karty. */
  function TmObjIcon({ obj, kind, size = 20, strokeWidth, style }) {
    const r = tmResolveIcon(obj, kind);
    if (r.char) return <span aria-hidden="true" style={{ fontSize: Math.max(12, size - 4), lineHeight: 1, display: "inline-flex", ...style }}>{r.char}</span>;
    return <TmIcon id={r.id} size={size} strokeWidth={strokeWidth} style={style} />;
  }

  /**
   * <TmIconPicker value onPick kind allowClear />
   * Vložený blok (ne overlay) — rodič rozhoduje, kdy je vidět.
   * `onPick(id)` dostane id, `onPick(null)` znamená „bez vlastní ikony".
   */
  function TmIconPicker({ value, onPick, kind, allowClear = true }) {
    const { t } = useT();
    const sel = tmIconId(value);
    const cell = (active) => ({
      width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: active ? t.selBg || t.cardHover : "transparent",
      border: `1px solid ${active ? t.accent : "transparent"}`,
      borderRadius: 10, cursor: "pointer", color: active ? t.text : t.textMuted, padding: 0,
    });
    return (
      <div>
        {TM_USER_ICON_GROUPS.map((g) => (
          <div key={g.key} style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12, color: t.textMuted, margin: "0 0 4px 2px" }}>{L(g.cz, g.en)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {g.ids.map((id) => {
                const lbl = TM_USER_ICON_LABELS[id] || [id, id];
                const active = sel === id;
                return (
                  <button key={id} type="button" onClick={() => onPick(active && allowClear ? null : id)}
                    aria-label={L(lbl[0], lbl[1])} aria-pressed={active} title={L(lbl[0], lbl[1])} style={cell(active)}>
                    <TmIcon id={id} size={22} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /** Spouštěč výběru · ukazuje aktuální ikonu, otevírá mřížku pod sebou.
   *  `preview` může dodat vlastní kresbu aktuálního stavu (rytiny osiva). */
  function TmIconPickerButton({ obj, kind, onPick, size = 20, preview }) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          aria-label={L("Vybrat ikonu", "Choose an icon")} title={L("Vybrat ikonu", "Choose an icon")}
          style={{ width: 38, height: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${open ? t.accent : t.border}`, borderRadius: 9, color: t.text, cursor: "pointer", padding: 0, flexShrink: 0 }}>
          {preview || <TmObjIcon obj={obj} kind={kind} size={size} />}
        </button>
        {open && (
          <div style={{ flexBasis: "100%", width: "100%", padding: "8px 2px 2px" }}>
            <TmIconPicker value={obj && obj.iconId} kind={kind} onPick={(id) => { onPick(id); setOpen(false); }} />
          </div>
        )}
      </>
    );
  }

  return { TmObjIcon, TmIconPicker, TmIconPickerButton };
}

// ----------------------------------------------------------------------
// IKONY MÍSTNOSTÍ · původní jemná kresba domu, mřížka 48, tah 1,6
// ----------------------------------------------------------------------
// Boční panel a dok volají tyhle komponenty jménem. Kresba je táž jako
// od začátku — registr nahoře slouží jen kurátorované řadě a výběru.
export function TmIcTerminy({ size = 17 }) { return <TmIcon id="clock" size={size} />; }

export function TmIcMemento({ size = 17 }) { return <TmIcon id="hourglass" size={size} />; }

export function TmIcNastaveniRoom({ size = 17 }) { return <TmIcon id="settings-room" size={size} />; }
