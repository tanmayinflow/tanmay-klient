// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · oddíl v Nastavení
// ----------------------------------------------------------------------
// Do V1.1 tu byly dvě volby — RODINA a REŽIM — a jejich součin dával
// čtrnáct palet. Od V2 je volba JEDNA: devět hotových vzhledů. Přepínač
// den/noc zmizel, protože po zavedení pevných vzhledů lhal: kdo měl Kouř
// a koření, tomu „Den" nic smysluplného neudělal.
//
// Karta neukazuje dva barevné čtverce — ukazuje malý kus skutečného
// rozhraní: pole stránky, navigační pruh, kartu s nadpisem a dvěma řádky
// NEUTRÁLNÍHO běžného textu, dokumentovou plochu (na které se dlouho píše),
// akcentní tlačítko a dva stavy. Kdo si vybírá vzhled, vybírá si místnost,
// ne vzorník.
//
// Celý seznam je jeden `radiogroup`: šipky se pohybují po volbách, mezerník
// nebo Enter vybírá, čtečka čte název vzhledu, jeho polaritu a to, jestli je
// zvolený. Automaticky · Signature je první a má náhled rozdělený na den
// a noc, protože je to jediná položka, která se sama mění.
//
// Komponenta nezná ani jeden vzhled jménem. Všechno, co kreslí, si bere
// z rejstříku.
import React, { useRef } from "react";
import { APPEARANCE_PRESETS, DEFAULT_PRESET, previewTokens } from "./themeRegistry.js";

export function createAppearanceUI(useT, L) {
  /** Slunce a měsíc jako tvar, ne jako barva — polarita se pozná i v šedi. */
  function Polarity({ kind, color }) {
    if (kind === "dark") {
      return (
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M9.6 7.6A4.2 4.2 0 0 1 4.4 2.4 4.4 4.4 0 1 0 9.6 7.6Z" fill={color} />
        </svg>
      );
    }
    if (kind === "auto") {
      return (
        <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <circle cx="6" cy="6" r="4.1" fill="none" stroke={color} strokeWidth="1.2" />
          <path d="M6 1.9A4.1 4.1 0 0 1 6 10.1Z" fill={color} />
        </svg>
      );
    }
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        <circle cx="6" cy="6" r="2.5" fill="none" stroke={color} strokeWidth="1.2" />
        <path d="M6 0.6v1.6M6 9.8v1.6M0.6 6h1.6M9.8 6h1.6M2.2 2.2l1.1 1.1M8.7 8.7l1.1 1.1M9.8 2.2 8.7 3.3M3.3 8.7 2.2 9.8"
          stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    );
  }

  /* Kus skutečného rozhraní, ne dva barevné obdélníky (V2 §18): pole,
     NAVIGACE, karta s nadpisem a neutrálním běžným textem, DOKUMENTOVÁ
     plocha, akcent s popiskem na něm a dva stavy. Přesně to jsou věci,
     podle kterých se vzhled dá posoudit dřív, než se zapne. */
  function Snippet({ tok, label }) {
    return (
      <div aria-hidden="true" title={label}
        style={{ flex: 1, minWidth: 0, background: tok.background, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 7, background: tok.navigation, borderBottom: `1px solid ${tok.border}`, flexShrink: 0 }} />
        <div style={{ padding: 5, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", flex: 1 }}>
          <div style={{ background: tok.card, border: `1px solid ${tok.border}`, borderRadius: 4, padding: "4px 5px 5px", display: "flex", flexDirection: "column", gap: 3 }}>
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
            ? <><Snippet tok={tok.light} label={L("Den", "Day")} /><Snippet tok={tok.dark} label={L("Noc", "Night")} /></>
            : <Snippet tok={tok} label={name} />}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 12, flexShrink: 0, color: t.interactiveAccent || t.accent, fontFamily: "var(--tm-font-tag)", fontSize: 12, lineHeight: 1 }}>{selected ? "✓" : ""}</span>
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

  /**
   * @param {object} p
   * @param {string} p.preset   zvolený vzhled
   * @param {function} p.onPreset
   * @param {function} p.onReset
   */
  function VzhledSekce({ preset, onPreset, onReset }) {
    const { t } = useT();
    const refs = useRef([]);
    const items = APPEARANCE_PRESETS;
    const idx = Math.max(0, items.findIndex((i) => i.id === preset));
    const move = (e) => {
      const k = e.key;
      const fwd = k === "ArrowRight" || k === "ArrowDown";
      const back = k === "ArrowLeft" || k === "ArrowUp";
      if (!fwd && !back) return;
      e.preventDefault();
      const n = items.length;
      const next = (idx + (fwd ? 1 : n - 1)) % n;
      onPreset(items[next].id);
      const el = refs.current[next];
      if (el && el.focus) el.focus();
    };
    const label = {
      fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.2em",
      fontSize: 10.5, color: t.sage, marginBottom: 8,
    };
    const isDefault = preset === DEFAULT_PRESET;
    return (
      <div id="tm-vzhled" style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
        <div style={label}>{L("Vzhled", "Appearance")}</div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.55, marginBottom: 12 }}>
          {L("Vzhled je jen to, jak tahle aplikace vypadá na tomhle zařízení. Nemění, co je vidět, co se sdílí ani co znamenají stavy. Podle systému se řídí jediná volba — první.",
             "An appearance is only how this app looks on this device. It changes nothing about what is visible, what is shared, or what a status means. Only the first entry follows the system.")}
        </div>

        <div role="radiogroup" aria-label={L("Vzhled", "Appearance")} onKeyDown={move}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 10 }}>
          {items.map((p, i) => (
            <PresetCard key={p.id} preset={p} selected={p.id === preset} tabIndex={i === idx ? 0 : -1}
              onSelect={() => onPreset(p.id)} refFn={(el) => { refs.current[i] = el; }} />
          ))}
        </div>

        <button type="button" onClick={onReset} disabled={isDefault}
          className="tm-cta"
          style={{
            marginTop: 14, minHeight: 38, padding: "8px 16px",
            background: "transparent", border: `1px solid ${t.border}`,
            color: isDefault ? t.textDisabled || t.textMuted : t.textSec,
            cursor: isDefault ? "default" : "pointer",
            fontFamily: "var(--tm-font-body)", fontSize: 13,
          }}>
          {L("Vrátit na Signature", "Reset to Signature")}
        </button>
      </div>
    );
  }

  return { VzhledSekce };
}
