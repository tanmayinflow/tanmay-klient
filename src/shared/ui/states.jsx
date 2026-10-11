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

// Naturalistic ink drawings, kept as transparent masks so every theme owns the ink.
const EMPTY_ROOM_ART = new Set(['kompas','trenink','denik','zapisnik','terminy']);
export function EmptyRoomArt({ room, size = 150, color = "var(--tm-text-muted)" }) {
  if (!EMPTY_ROOM_ART.has(room)) return null;
  const landscape = room === 'kompas';
  const art = "url('/media/icons/empty-" + room + (landscape ? "-wide-v3.webp" : "-v2.webp") + "') center/contain no-repeat";
  return <span aria-hidden="true" data-empty-art={room} style={{display:"block",width:landscape?"100%":size,maxWidth:landscape?560:"100%",aspectRatio:landscape?"2 / 1":"1",margin:"0 auto",pointerEvents:"none",backgroundColor:color,opacity:landscape ? 0.48 : 1,mask:art,WebkitMask:art}} />;
}

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
          <button onClick={action} className="tm-dash" style={{ marginTop: 18, background: "transparent", border: `1px solid transparent`, borderRadius: 999, padding: "9px 20px", minHeight: 44, cursor: "pointer", color: t.inkSand, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{actionLabel}</button>
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
    const art = "url('/media/icons/empty-prameny-v3.webp') center/contain no-repeat";
    return <span aria-hidden="true" data-empty-art="prameny" style={{display:"block",width:size,maxWidth:"100%",aspectRatio:"1",margin:"0 auto",pointerEvents:"none",backgroundColor:color||"currentColor",opacity:.52,mask:art,WebkitMask:art}} />;
  }

  return { Prazdno, TmArtKapka };
}
