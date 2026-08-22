// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/states.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// STAVY · prázdno
// ----------------------------------------------------------------------
// Klientská aplikace tenhle tvar neměla vůbec a psala si prázdné stavy
// pokaždé znovu. Teď je jeden.
import React from "react";

export function createStates(useT, L) {
  // ————————————————————————————————————————————————————————————
  // PRÁZDNO · když v místnosti nic není
  // ————————————————————————————————————————————————————————————
  // Tvar, který už appka měla v Tréninku, jen nepojmenovaný:
  //     fakt → pozvání → uvolnění
  //     „Dnes nic nemáš. Naplánuj si něco — nebo prostě jdi. I bez zápisu to platí."
  // Třetí věta je to, co v žádném cizím návodu není. Všechny design systémy
  // končí u pozvání k akci, protože předpokládají, že prázdno je chyba. Tady
  // je prázdno půlku času přesně to, oč jde — a věta o tom, že se nic dít
  // nemusí, je jediné místo, kde to appka může říct nahlas.
  //
  // Dva rejstříky. V místnostech praxe se mluví takhle. V provozu (klienti,
  // hospodaření, koš, výsledky hledání) se mluví holým faktem — literární
  // útěcha nad nulovým příjmem by zněla jako výsměch.
  //
  // Tři druhy, protože každý potřebuje něco jiného:
  //   "prvni"  — ještě nikdy nic; patří sem jedno tlačítko a slib, co tu bude
  //   "hotovo" — uklizeno, splněno; tlačítko sem NEpatří, jen uvolnění
  //   "nic"    — hledání nic nenašlo; žádné tlačítko, žádná poezie, jen dotaz
  //              zpátky a cesta ven. Oznamuje se i odečítačům obrazovky.
  function Prazdno({ kind = "prvni", fakt, pozvani, uvolneni, action, actionLabel, mark, plain, compact }) {
    const { t } = useT();
    const utility = plain || kind === "nic";
    return (
      <div
        role={kind === "nic" ? "status" : undefined}
        style={{
          textAlign: utility ? "left" : "center",
          padding: compact ? "18px 12px" : utility ? "16px 2px" : "34px 18px 30px",
          animation: "tmsettle .4s ease-out",
          maxWidth: utility ? "none" : 460,
          margin: utility ? 0 : "0 auto",
        }}
      >
        {mark && !utility && <div aria-hidden="true" style={{ marginBottom: 14, opacity: 0.9 }}>{mark}</div>}
        <p style={{
          fontFamily: utility ? "var(--tm-font-body)" : "var(--tm-font-display)",
          fontSize: utility ? 13 : 22,
          lineHeight: utility ? 1.6 : 1.3,
          letterSpacing: utility ? 0 : "-0.005em",
          color: utility ? t.textSec : t.heading,
          margin: 0,
        }}>{fakt}</p>
        {pozvani && (
          <p style={{ fontFamily: "var(--tm-font-body)", fontSize: utility ? 13 : 15, lineHeight: 1.6, color: t.textSec, margin: utility ? "4px 0 0" : "10px 0 0" }}>{pozvani}</p>
        )}
        {uvolneni && !utility && (
          <p style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: t.textMuted, margin: "8px 0 0" }}>{uvolneni}</p>
        )}
        {/* Hotovo nedostane tlačítko · uklizeno je cíl, ne rozdělaná práce */}
        {action && actionLabel && kind === "prvni" && (
          <button onClick={action} className="tm-dash" style={{ marginTop: 18, background: "transparent", border: `1px dashed ${t.border}`, borderRadius: 999, padding: "9px 20px", minHeight: 44, cursor: "pointer", color: t.inkSand, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{actionLabel}</button>
        )}
      </div>
    );
  }

  // ————————————————————————————————————————————————————————————
  // KAPKA · obrázek prázdné místnosti
  // ————————————————————————————————————————————————————————————
  // Jedna kapka nad třemi kruhy na hladině. Nic to nevysvětluje, jen to drží
  // prázdnou stránku, aby nevypadala jako porucha.
  function TmArtKapka({ size = 130, color }) {
    return (
      <svg width={size} height={size * 110 / 120} viewBox="0 0 120 110" fill="none" stroke={color || "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>
        <path d="M60 14c8.5 11 14.5 19 14.5 27a14.5 14.5 0 1 1-29 0c0-8 6-16 14.5-27Z" />
        <path d="M54 44a7 7 0 0 0 5 6" opacity=".4" />
        <ellipse cx="60" cy="88" rx="15" ry="3.6" opacity=".7" />
        <ellipse cx="60" cy="88" rx="27" ry="6.4" opacity=".4" />
        <ellipse cx="60" cy="88" rx="40" ry="9.5" opacity=".2" />
      </svg>
    );
  }

  return { Prazdno, TmArtKapka };
}
