import { TmIcon as FamilyIcon } from "./icons.jsx";
import { TmIcon } from "./icons.jsx";
// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · oddíl v Nastavení
// ----------------------------------------------------------------------
// Dvě části, jeden princip:
//
//   SIGNATURE — norma domu, přesně ta trojice, kterou dům nosí: automatika,
//   den, noc. Nic se na ní neměnilo a nemění.
//
//   VOLITELNÉ PALETY — sedm hotových vzhledů s přesnými kotvami z dodaných
//   referencí a s vlastní řečí rámů. Karta neukazuje ploché vzorky: kreslí
//   pole, navigační pruh, RÁMOVANÝ panel v gramatice té palety, dokumentovou
//   plochu, neutrální text, akcent a dva stavy. Volitelná paleta nemá režim
//   a nemá přepínač rámů — je to jeden dokončený vzhled.
//
// „Použít Signature" vrací PŘESNĚ tu Signature volbu, která tu byla před
// odbočkou k paletě — automatiku, den, nebo noc.
//
// Obě skupiny jsou radiogroup se šipkami a rovingem; čtečka slyší název,
// polaritu a stav. Komponenta nezná ani jednu paletu jménem — všechno si
// bere z rejstříku, včetně receptu rámu pro náhled.
import React, { useRef } from "react";
import {
  APPEARANCE_PRESETS, SIGNATURE_PRESET_IDS, OPTIONAL_PRESETS, DEFAULT_PRESET,
  appearancePreset, previewTokens, isSignaturePreset,
} from "./themeRegistry.js";

/* Miniaturní rám v gramatice palety — týž recept jako ve skutečném CSS,
   jen zmenšený na náhled. Náhled je jediné místo, kde se rám kreslí bez
   `data-frame-grammar`: ukazuje, co paleta udělá, ještě před zapnutím. */
function frameShadow(grammar, tok) {
  switch (grammar) {
    case "architectural-double":
      return `inset 0 0 0 1px ${tok.frameOuter}, inset 0 0 0 3px ${tok.background}, inset 0 0 0 4px ${tok.frameInner}`;
    case "monument-inset":
      return `inset 0 0 0 2px ${tok.frameOuter}, inset 7px 0 0 0 ${tok.frameRail}`;
    case "strata-rails":
      return `inset 0 2px 0 0 ${tok.frameOuter}, inset 3px 0 0 0 ${tok.frameRail}, inset 0 -2px 0 0 ${tok.frameInner}`;
    case "nested-fossil":
      return `inset 0 0 0 1px ${tok.frameOuter}, inset 0 0 0 5px ${tok.frameInner}`;
    case "basalt-steps":
      return `inset 0 0 0 2px ${tok.frameOuter}, 3px 3px 0 0 ${tok.frameInner}`;
    case "woven-rails":
      return `inset 0 0 0 4px ${tok.frameOuter}, inset 0 0 0 5px ${tok.frameInner}`;
    default:
      return "none";
  }
}

export function createAppearanceUI(useT, L) {
  /** Slunce a měsíc jako tvar, ne jako barva — polarita se pozná i v šedi. */
  function Polarity({ kind, color }) { return <TmIcon id={kind === "dark" ? "moon" : kind === "auto" ? "appearance-auto" : "sun"} size={11} style={{ color }} />; }

  /* Kus skutečného rozhraní: pole, navigační pruh, RÁMOVANÝ panel (skutečná
     gramatika palety), dokumentová plocha, akcent s popiskem a dva stavy. */
  function Snippet({ tok, grammar, label }) {
    const framed = grammar && grammar !== "none";
    return (
      <div aria-hidden="true" title={label}
        style={{ flex: 1, minWidth: 0, background: tok.background, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 7, background: tok.navigation, flexShrink: 0 }} />
        <div style={{ padding: 5, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", flex: 1 }}>
          <div style={{ background: tok.card, border: framed ? "none" : `1px solid ${tok.border}`, boxShadow: framed ? frameShadow(grammar, tok) : "none", borderRadius: 4, padding: framed ? "6px 7px 7px" : "4px 5px 5px", display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ height: 3.5, borderRadius: 2, background: tok.heading, width: "62%" }} />
            <div style={{ height: 2.5, borderRadius: 2, background: tok.text, width: "88%" }} />
            <div style={{ height: 2.5, borderRadius: 2, background: tok.textMuted, width: "58%" }} />
          </div>
          <div style={{ background: tok.documentSurface, border: `1px solid ${tok.border}`, borderRadius: 3, padding: "4px 5px", display: "flex", flexDirection: "column", gap: 2.5 }}>
            <div style={{ height: 2.5, borderRadius: 2, background: tok.text, width: "92%" }} />
            <div style={{ height: 2.5, borderRadius: 2, background: tok.text, width: "70%" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 8, borderRadius: 999, background: tok.accent }}>
              <span style={{ width: 8, height: 2, borderRadius: 1, background: tok.onAccent, display: "inline-block" }} />
            </span>
            {/* stav není jen barva · tvar je druhý nosič i v náhledu */}
            <span style={{ width: 7, height: 7, borderRadius: 999, background: tok.success, display: "inline-block" }} />
            <span style={{ width: 7, height: 7, borderRadius: 2, background: tok.error, display: "inline-block" }} />
          </div>
        </div>
      </div>
    );
  }

  function PresetCard({ preset, selected, tabIndex, onSelect, refFn }) {
    const { t } = useT();
    const name = L(preset.labelCs, preset.labelEn);
    const tok = previewTokens(preset.id);
    const auto = preset.kind === "auto";
    const grammar = preset.chrome ? preset.chrome.frameGrammar : "none";
    const polarityWord = auto
      ? L("podle systému", "follows the system")
      : preset.polarity === "dark" ? L("noční", "night") : L("denní", "day");
    return (
      <button
        ref={refFn}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={`${name} · ${polarityWord}`}
        tabIndex={tabIndex}
        onClick={onSelect}
        className="tm-nav-item"
        style={{
          display: "flex", flexDirection: "column", gap: 7, padding: 8, cursor: "pointer",
          background: selected ? t.activeNav : "transparent",
          border: `1px solid ${selected ? t.interactiveAccent || t.accent : t.borderSoft}`,
          borderRadius: 10, textAlign: "left", minHeight: 44, width: "100%", boxSizing: "border-box",
        }}
      >
        <span style={{ display: "flex", height: 78, borderRadius: 6, overflow: "hidden", border: `1px solid ${t.borderSoft}` }}>
          {auto
            ? <><Snippet tok={tok.light} grammar="none" label={L("Den", "Day")} /><Snippet tok={tok.dark} grammar="none" label={L("Noc", "Night")} /></>
            : <Snippet tok={tok} grammar={grammar} label={name} />}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 12, flexShrink: 0, color: t.interactiveAccent || t.accent, fontFamily: "var(--tm-font-tag)", fontSize: 12, lineHeight: 1 }}>{selected ? <FamilyIcon id="check" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /> : ""}</span>
          <span aria-hidden="true" style={{ display: "inline-flex", flexShrink: 0, alignItems: "center" }}>
            <Polarity kind={auto ? "auto" : preset.polarity} color={t.textMuted} />
          </span>
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--tm-font-body)", fontSize: 13.5, color: t.text }}>{name}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: -4 }}>
          {preset.id === DEFAULT_PRESET && (
            <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11, color: t.textMuted }}>
              {L("Doporučené", "Recommended")}
            </span>
          )}
          {selected && (
            <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 11, color: t.interactiveAccent || t.accent }}>
              {L("Zvoleno", "Selected")}
            </span>
          )}
        </span>
      </button>
    );
  }

  function Radios({ label, items, value, onPick, refsOffset }) {
    const refs = useRef([]);
    const idx = Math.max(0, items.findIndex((i) => i.id === value));
    const move = (e) => {
      const k = e.key;
      const fwd = k === "ArrowRight" || k === "ArrowDown";
      const back = k === "ArrowLeft" || k === "ArrowUp";
      if (!fwd && !back) return;
      e.preventDefault();
      const n = items.length;
      const next = (idx + (fwd ? 1 : n - 1)) % n;
      onPick(items[next].id);
      const el = refs.current[next];
      if (el && el.focus) el.focus();
    };
    return (
      <div role="radiogroup" aria-label={label} onKeyDown={move}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 10 }}>
        {items.map((p, i) => (
          <PresetCard key={p.id} preset={p} selected={p.id === value} tabIndex={i === idx ? 0 : -1}
            onSelect={() => onPick(p.id)} refFn={(el) => { refs.current[i] = el; }} />
        ))}
      </div>
    );
  }

  /**
   * @param {object} p
   * @param {string} p.preset      zvolený vzhled
   * @param {string} p.signature   poslední Signature volba (auto/den/noc)
   * @param {function} p.onPreset  zvol vzhled (Signature i paletu)
   * @param {function} p.onSignature  „Použít Signature" — návrat k poslední volbě
   */
  function VzhledSekce({ preset, signature, onPreset, onSignature, open = false, onToggle }) {
    const { t } = useT();
    const sig = APPEARANCE_PRESETS.filter((p) => SIGNATURE_PRESET_IDS.indexOf(p.id) !== -1);
    const optional = OPTIONAL_PRESETS;
    const naPalete = !isSignaturePreset(preset);
    const label = (extra) => ({
      fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.2em",
      fontSize: 10.5, color: t.sage, marginBottom: 8, marginTop: extra ? 18 : 0,
    });
    return (
      <div id="tm-vzhled" style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
        <button type="button" aria-expanded={open} aria-controls="tm-vzhled-content" onClick={onToggle}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 50, padding: "13px 8px", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", color: t.text }}>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}><path d="M4 2 8 6 4 10" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
          <span style={{ ...label(false), marginBottom: 0 }}>{L("Vzhled", "Appearance")}</span>
        </button>
        {open && <div id="tm-vzhled-content">
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.55, marginBottom: 12 }}>
          {L("Vzhled je jen to, jak tahle aplikace vypadá na tomhle zařízení. Nemění, co je vidět, co se sdílí ani co znamenají stavy.",
             "An appearance is only how this app looks on this device. It changes nothing about what is visible, what is shared, or what a status means.")}
        </div>

        <div style={label(false)}>{L("Signature", "Signature")}</div>
        <Radios label={L("Signature", "Signature")} items={sig}
          value={isSignaturePreset(preset) ? preset : ""} onPick={onPreset} />

        <div style={label(true)}>{L("Volitelné palety", "Optional palettes")}</div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.55, marginBottom: 12 }}>
          {L("Šestnáct hotových palet s přesnými barvami — osm z předloh, čtyři z pigmentů thangky, Černý písek, Hluboká voda a dvě Krajiny — a vlastní řečí rámů. Paleta nemá režim: je to jeden dokončený vzhled a systém s ním nehýbe.",
             "Sixteen finished palettes with exact colours — eight from references, four from thangka pigments, Black Sand, Deep Water and two Landscapes — and their own frame language. A palette has no mode: it is one finished appearance, and the system never moves it.")}
        </div>
        <Radios label={L("Volitelné palety", "Optional palettes")} items={optional}
          value={naPalete ? preset : ""} onPick={onPreset} />

        <button type="button" onClick={onSignature} disabled={!naPalete}
          className="tm-cta"
          style={{
            marginTop: 14, minHeight: 38, padding: "8px 16px",
            background: "transparent", border: `1px solid ${t.border}`,
            color: !naPalete ? t.textDisabled || t.textMuted : t.textSec,
            cursor: !naPalete ? "default" : "pointer",
            fontFamily: "var(--tm-font-body)", fontSize: 13,
          }}>
          {L("Použít Signature", "Use Signature")}
        </button>
        </div>}
      </div>
    );
  }

  return { VzhledSekce };
}
