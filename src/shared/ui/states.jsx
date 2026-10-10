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

// Quiet companions to the existing Sources droplet. Each empty room has its
// own open line drawing; the object engraving belongs only to the page header.
const EMPTY_ROOM_DRAWINGS = {
  kompas: <>
    <path d="M60 13L63 23L73 26L63 29L60 39L57 29L47 26L57 23Z" />
    <path d="M24 60C37 55 44 49 54 52M67 52C77 49 86 53 98 58" opacity=".42" />
    <path d="M19 68C34 64 47 67 59 61C67 57 73 60 68 66C61 73 38 77 39 83C41 91 69 87 77 97" />
    <path d="M25 83C18 84 14 87 15 90M86 76C95 76 101 79 104 82" opacity=".24" />
  </>,
  trenink: <>
    <path d="M26 88C26 80 44 78 60 79C78 78 94 82 94 89C93 97 26 98 26 88Z" />
    <path d="M36 71C35 63 47 58 61 59C75 58 86 62 85 70C84 78 36 79 36 71Z" />
    <path d="M45 50C45 42 51 34 59 34C68 33 75 39 74 47C74 57 46 60 45 50Z" />
    <path d="M45 85C55 83 66 84 72 85M49 66C54 64 61 64 65 65M54 45C55 42 57 40 60 40" opacity=".3" />
    <path d="M17 99C35 102 87 103 104 98" opacity=".22" />
  </>,
  denik: <>
    <path d="M36 86C45 67 66 38 84 20C89 40 76 61 55 68C46 72 39 81 36 86Z" />
    <path d="M30 98C43 76 61 49 80 26" />
    <path d="M49 71L51 53M57 60L61 40M65 49L68 32M52 67L69 60M61 54L79 46" opacity=".38" />
    <path d="M18 99C40 102 73 102 100 98" opacity=".24" />
  </>,
  zapisnik: <>
    <path d="M31 22C48 20 63 21 78 23L90 36L89 87C73 85 52 89 30 86Z" />
    <path d="M78 23L77 38L90 36M25 31L22 92C45 95 71 92 82 94" opacity=".42" />
    <path d="M47 77L50 65L76 39L82 45L56 72Z" />
    <path d="M50 65L56 72M72 43L78 49M47 77L52 75" opacity=".55" />
    <path d="M22 100C44 102 77 103 99 98" opacity=".2" />
  </>,
  terminy: <>
    <path d="M22 62L24 33Q34 30 44 33L46 62M21 62Q34 65 48 62M24 64L21 90M44 64L47 90" />
    <path d="M74 62L76 33Q86 30 96 33L98 62M73 62Q86 65 100 62M76 64L73 90M96 64L99 90" />
    <path d="M29 40Q34 39 39 40M81 40Q86 39 91 40" opacity=".35" />
    <path d="M50 52Q60 49 70 52M53 57Q60 59 67 57M60 57V82M53 83H67" opacity=".58" />
    <path d="M15 97C35 99 86 100 106 95" opacity=".22" />
  </>,
};

export function EmptyRoomArt({ room, size = 150, color = "var(--tm-text-muted)" }) {
  const drawing = Object.hasOwn(EMPTY_ROOM_DRAWINGS, room) && EMPTY_ROOM_DRAWINGS[room];
  if (!drawing) return null;
  return <svg aria-hidden="true" focusable="false" data-empty-art={room} width={size} height={size * 110 / 120} viewBox="0 0 120 110" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{display:"block",maxWidth:"100%",height:"auto",margin:"0 auto",pointerEvents:"none"}}>{drawing}</svg>;
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
