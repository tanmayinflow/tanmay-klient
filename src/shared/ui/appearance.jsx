// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// VZHLED · oddíl v Nastavení
// ----------------------------------------------------------------------
// Dvě volby, ne čtrnáct: RODINA a REŽIM. Karta rodiny neukazuje dva barevné
// čtverce — ukazuje malý kus skutečného rozhraní ve dne i v noci: pole,
// kartu, řádek textu a ovládací bod v akcentu. Kdo si vybírá motiv, vybírá
// si místnost, ne vzorník.
//
// Obojí je jeden `radiogroup`: šipky se pohybují po volbách, mezerník nebo
// Enter vybírá, čtečka čte název rodiny a to, jestli je zvolená. Signature
// je první a jediná nese štítek „Doporučené".
//
// Komponenta nezná ani jednu rodinu jménem. Všechno, co kreslí, si bere
// z rejstříku — přidání osmé rodiny (kdyby kdy bylo schválené) se jí netýká.
import React, { useRef } from "react";
import { THEME_FAMILIES, THEME_MODES, DEFAULT_FAMILY, previewTokens } from "./themeRegistry.js";

export function createAppearanceUI(useT, L) {
  function Half({ tok, label }) {
    /* Kus skutečného rozhraní, ne dva barevné čtverce (V1.1 §9). Ukazuje
       pole stránky, kartu, RODINNÝ NADPIS, dva řádky NEUTRÁLNÍHO běžného
       textu, dokumentovou plochu — na které se dlouho píše a která má být
       nejklidnější — a interakční akcent s popiskem na něm. Přesně to jsou
       věci, podle kterých se motiv dá posoudit dřív, než se zapne. */
    return (
      <div aria-hidden="true" style={{ flex: 1, minWidth: 0, background: tok.background, padding: 5, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }} title={label}>
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
          <span style={{ width: 7, height: 7, borderRadius: 999, background: tok.accent, display: "inline-block" }} />
        </div>
      </div>
    );
  }

  function FamilyCard({ fam, selected, tabIndex, onSelect, refFn }) {
    const { t } = useT();
    const light = previewTokens(fam.id, "light");
    const dark = previewTokens(fam.id, "dark");
    const name = L(fam.labelCs, fam.labelEn);
    return (
      <button
        ref={refFn}
        type="button"
        role="radio"
        aria-checked={selected}
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
        <span style={{ display: "flex", height: 74, borderRadius: 6, overflow: "hidden", border: `1px solid ${t.borderSoft}` }}>
          <Half tok={light} label={L("Světlo", "Light")} />
          <Half tok={dark} label={L("Noc", "Night")} />
        </span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
          <span aria-hidden="true" style={{ width: 12, flexShrink: 0, color: t.interactiveAccent || t.accent, fontFamily: "var(--tm-font-tag)", fontSize: 12 }}>{selected ? "✓" : ""}</span>
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--tm-font-body)", fontSize: 13.5, color: t.text }}>{name}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: -4 }}>
          {fam.recommended && (
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

  function Radios({ label, items, value, onPick, columns }) {
    const { t } = useT();
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
        style={columns
          ? { display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(132px, 1fr))`, gap: 10 }
          : { display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((it, i) => (it.card
          ? <FamilyCard key={it.id} fam={it.fam} selected={it.id === value} tabIndex={i === idx ? 0 : -1}
              onSelect={() => onPick(it.id)} refFn={(el) => { refs.current[i] = el; }} />
          : (
            <button key={it.id} ref={(el) => { refs.current[i] = el; }} type="button" role="radio"
              aria-checked={it.id === value} tabIndex={i === idx ? 0 : -1} onClick={() => onPick(it.id)}
              className="tm-cta"
              style={{
                flex: "1 1 auto", minWidth: 92, minHeight: 38, padding: "8px 14px", cursor: "pointer",
                background: it.id === value ? t.activeNav : "transparent",
                border: `1px solid ${it.id === value ? t.interactiveAccent || t.accent : t.border}`,
                color: it.id === value ? t.interactiveAccent || t.accent : t.text,
                fontFamily: "var(--tm-font-body)", fontSize: 13.5,
              }}>
              {it.label}
            </button>
          )))}
      </div>
    );
  }

  /**
   * @param {object} p
   * @param {string} p.family   zvolená rodina
   * @param {string} p.mode     zvolený režim: system | light | dark
   * @param {function} p.onFamily
   * @param {function} p.onMode
   * @param {function} p.onReset
   */
  function VzhledSekce({ family, mode, onFamily, onMode, onReset }) {
    const { t } = useT();
    const label = (s) => ({
      fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.2em",
      fontSize: 10.5, color: t.sage, marginBottom: 8, marginTop: s ? 18 : 0,
    });
    const modes = [
      { id: "system", label: L("Automaticky", "System") },
      { id: "light", label: L("Světlo", "Light") },
      { id: "dark", label: L("Noc", "Night") },
    ].filter((m) => THEME_MODES.indexOf(m.id) !== -1);
    const families = THEME_FAMILIES.map((f) => ({ id: f.id, fam: f, card: true }));
    const isDefault = family === DEFAULT_FAMILY;
    return (
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
        <div style={label(false)}>{L("Vzhled", "Appearance")}</div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.55, marginBottom: 12 }}>
          {L("Motiv je jen vzhled téhle aplikace na tomhle zařízení. Nemění, co je vidět, co se sdílí ani co znamenají stavy.",
             "A theme is only how this app looks on this device. It changes nothing about what is visible, what is shared, or what a status means.")}
        </div>

        <div style={label(true)}>{L("Barevný motiv", "Colour theme")}</div>
        <Radios label={L("Barevný motiv", "Colour theme")} items={families} value={family} onPick={onFamily} columns />

        <div style={label(true)}>{L("Režim", "Mode")}</div>
        <Radios label={L("Režim", "Mode")} items={modes} value={mode} onPick={onMode} />

        <button type="button" onClick={onReset} disabled={isDefault && mode === "light"}
          className="tm-cta"
          style={{
            marginTop: 14, minHeight: 38, padding: "8px 16px",
            background: "transparent", border: `1px solid ${t.border}`,
            color: isDefault && mode === "light" ? t.textDisabled || t.textMuted : t.textSec,
            cursor: isDefault && mode === "light" ? "default" : "pointer",
            fontFamily: "var(--tm-font-body)", fontSize: 13,
          }}>
          {L("Vrátit na Signature", "Reset to Signature")}
        </button>
      </div>
    );
  }

  return { VzhledSekce };
}
