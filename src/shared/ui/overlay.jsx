// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/overlay.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// PŘEKRYVY · list, zásuvka, dvířka
// ----------------------------------------------------------------------
// Jedna implementace pro oba domy. Klientská aplikace měla o generaci starší:
// zásuvka mizela bez odchodu, list neuměl Escape zásobník, stránka pod ním
// se rolovala a focus po zavření skončil na začátku dokumentu.
//
// Chování, které je tu společné a dřív nebylo nikde úplné:
//   · Escape patří jen nejvýš položené vrstvě
//   · stránka pod překryvem se zamkne a po zavření se vrátí na svou polohu
//   · focus je uvnitř vrstvy a po zavření se vrací tam, odkud vyšel
//   · tlačítko a gesto zpět zavřou vrstvu, ne aplikaci
//
// Motiv si továrna bere z useT() té aplikace, ve které běží.
import React from "react";
import { createPortal } from "react-dom";
import {
  tmEscVrstva, tmZamkniStranku, tmOdemkniStranku, tmChytFocus, tmHistorieVrstva,
} from "./overlay.js";

/**
 * Jedna vrstva se vším, co k ní patří.
 * @param {object} o
 * @param {function} o.close        co se má stát při Escape, gestu zpět a klepnutí na závoj
 * @param {object}   o.ref          ref na kořen vrstvy (kvůli focusu)
 * @param {boolean}  o.zamek        zamknout stránku pod ní (výchozí true)
 * @param {boolean}  o.historie     spotřebovat tlačítko zpět (výchozí true)
 * @param {function} o.escKdyz      vrátí false, když Escape teď nepatří téhle vrstvě
 */
export function useVrstva({ close, ref, zamek = true, historie = true, escKdyz }) {
  React.useEffect(() => tmEscVrstva(() => {
    if (escKdyz && !escKdyz()) return;
    close();
  }), [close, escKdyz]);
  // Zámek stránky patří k životu vrstvy, ne k jejímu překreslování. Volající
  // posílají `close` obvykle inline, takže je po každém zápisu do úložiště
  // nová — kdyby zámek visel na ní, pouštěl by se a znovu zavíral a stránka
  // pod listem by poskakovala. Prázdné závislosti jsou tu záměr.
  React.useEffect(() => {
    if (!zamek) return undefined;
    tmZamkniStranku();
    return () => tmOdemkniStranku();
  }, []);
  React.useEffect(() => {
    if (!ref || !ref.current) return undefined;
    return tmChytFocus(ref.current);
  }, []);
  const closeRef = React.useRef(close);
  closeRef.current = close;
  React.useEffect(() => {
    if (!historie) return undefined;
    return tmHistorieVrstva(() => closeRef.current());
  }, []);
}

export function createOverlay(useT, L) {
  /* JEDNA DVÍŘKA PRO CELÝ DŮM.
     Toggle si stav drží sám, ale v Tréninku patří stav skupině („jedno
     otevřené z osmi"), takže se tam Toggle použít nedal a vznikly vlastní
     řádky s ▸/▾. Vypadaly jako z jiné aplikace. Tyhle dva díly dávají tentýž
     vzhled i tam, kde se stav drží zvenčí — šipka, která se otáčí, a řádek
     s dotykovým cílem jako všude jinde. */
  const TmSipka = ({ open, t, barva }) => (
    <span aria-hidden="true" style={{ transition: "transform 0.18s ease", transform: open ? "rotate(90deg)" : "rotate(0deg)", color: barva || t.sage, fontSize: 12, display: "inline-block", flexShrink: 0, lineHeight: 1 }}>▶</span>
  );

  const tmDvirka = (t, barva) => ({ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "12px 0", minHeight: 44, display: "flex", alignItems: "center", gap: 10, color: barva || t.text, fontFamily: "var(--tm-font-body)", fontSize: 15, fontWeight: 500 });

  function CenterSheet({ title, onClose, children, center, naradi, vrstva = 80 }) {
    const { t } = useT();
    const korenRef = React.useRef(null);
    // zavření si vybere svých dvě stě milisekund · list odplouvá, neuteče
    const [out, setOut] = React.useState(false);
    const outRef = React.useRef(false);
    const close = React.useCallback(() => {
      if (outRef.current) return;
      outRef.current = true; setOut(true);
      setTimeout(() => { try { onClose(); } catch (e) {} }, 195);
    }, [onClose]);
    // Klidné psaní má vlastní vrstvu · dokud se píše, Escape patří jemu
    useVrstva({
      close,
      ref: korenRef,
      escKdyz: React.useCallback(() => !document.querySelector(".tm-zen"), []),
    });
    /* Závoj nese `tm-cs-veil` VŽDY. Na širokém okně to nic neznamená (pravidlo
       žije jen v mobilním dotazu), na telefonu se tím list stane celou
       stránkou — u vystředěného i u nevystředěného. Dřív se plná plocha
       týkala jen nevystředěných listů, a tak měl zápisek v deníku pruh
       ztmaveného pozadí pod sebou a poznámka v zápisníku ne. */
    return createPortal(
      <div onClick={close} className={"tm-cs-veil tm-dim" + (out ? " tm-out" : "")} style={{ position: "fixed", inset: 0, zIndex: vrstva, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", padding: "calc(4 * var(--tm-vh)) 16px", animation: "tmDim .25s ease both" }}>
        <div
          ref={korenRef}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : undefined}
          onClick={(e) => e.stopPropagation()}
          className={"tm-scroll tm-cs " + (center ? "" : "tm-centersheet") + (out ? " tm-out" : "")}
          style={{ width: "min(920px, calc(96 * var(--tm-vw)))", maxHeight: "min(calc(88 * var(--tm-vh)), 980px)", overflowY: "auto", overscrollBehavior: "contain", background: t.bg, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-sheet)", boxShadow: t.shadowSheet, padding: "24px clamp(18px, calc(3 * var(--tm-vw)), 34px) 34px", animation: "tmSheetIn .38s cubic-bezier(.23,.62,.22,.99) both" }}
        >
          <div className="tm-cs-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, position: "sticky", top: -24, zIndex: 2, background: t.bg, padding: "6px 0" }}>
            {/* Název místnosti je cesta zpátky. Vypadá dál jako popisek —
                verzálky, prostrkání, měď —, ale je to skutečné tlačítko:
                klávesnice ho najde, focus-visible ho ukáže a dělá přesně totéž
                co křížek. Zpátky se dosud dalo jen křížkem vpravo nahoře, což
                je na telefonu ten nejvzdálenější roh od palce. */}
            <button
              onClick={close}
              title={L("Zpět", "Back")}
              aria-label={typeof title === "string" ? L("Zpět na " + title, "Back to " + title) : L("Zpět", "Back")}
              className="tm-cs-back"
              style={{ flex: 1, minWidth: 0, textAlign: "left", background: "transparent", border: "none", padding: 0, margin: 0, minHeight: 30, cursor: "pointer", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 12, lineHeight: 1.5, color: t.accentInk || t.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >{title}</button>
            {naradi}
            <button onClick={close} title="Esc" aria-label={L("Zavřít", "Close")} style={{ flexShrink: 0, background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 999, width: 34, height: 34, cursor: "pointer", color: t.textMuted, fontSize: 15, lineHeight: 1 }}>×</button>
          </div>
          <div className="tm-cs-body">{children}</div>
        </div>
      </div>,
      document.body
    );
  }

  // ---- Zásuvka · boční panel, na telefonu spodní list ----
  // Portál do <body>: žádný animovaný nebo transformovaný předek nesmí
  // uvěznit její `position: fixed`. Na počítači přijíždí zprava, na telefonu
  // (≤820 px, přes CSS) je z ní spodní list s držadlem — stáhnout přes ~90 px
  // a zavře se, jinak se vrátí.
  function Drawer({ open, onClose, children, titulek }) {
    const { t } = useT();
    const korenRef = React.useRef(null);
    const [dragY, setDragY] = React.useState(0);
    const [snapping, setSnapping] = React.useState(false);
    const [touched, setTouched] = React.useState(false); // jakmile je true, vstupní animace ustoupí prstu
    const startRef = React.useRef(null);
    // Zásuvka odchází stejně vědomě, jako přišla · bez toho to jen zmizí
    const [live, setLive] = React.useState(open);
    const [out, setOut] = React.useState(false);
    React.useEffect(() => { if (!open) { setDragY(0); setSnapping(false); setTouched(false); } }, [open]);
    React.useEffect(() => {
      if (open) { setLive(true); setOut(false); return undefined; }
      if (!live) return undefined;
      setOut(true);
      const h = setTimeout(() => { setLive(false); setOut(false); }, 230);
      return () => clearTimeout(h);
    }, [open]);
    if (!live) return null;
    return (
      <DrawerTelo
        t={t} korenRef={korenRef} out={out} onClose={onClose} titulek={titulek}
        dragY={dragY} setDragY={setDragY} snapping={snapping} setSnapping={setSnapping}
        touched={touched} setTouched={setTouched} startRef={startRef}
      >{children}</DrawerTelo>
    );
  }

  /* Tělo je vlastní komponenta, aby hooky vrstvy (Escape, zámek, focus,
     historie) běžely jen po dobu, kdy zásuvka opravdu stojí. Kdyby seděly
     v `Drawer`, běžely by i zavřené a Escape by patřil neexistující vrstvě. */
  function DrawerTelo({ t, korenRef, out, onClose, titulek, children, dragY, setDragY, snapping, setSnapping, touched, setTouched, startRef }) {
    useVrstva({ close: onClose, ref: korenRef });
    const onGripStart = (e) => { startRef.current = e.touches[0].clientY; setTouched(true); setSnapping(false); };
    const onGripMove = (e) => {
      if (startRef.current == null) return;
      const dy = e.touches[0].clientY - startRef.current;
      setDragY(dy > 0 ? dy : 0);
    };
    const onGripEnd = () => {
      if (startRef.current == null) return;
      startRef.current = null;
      if (dragY > 90) { setDragY(0); onClose(); }
      else { setSnapping(true); setDragY(0); }
    };
    return createPortal(
      <>
        <div onClick={onClose} className={"tm-dim" + (out ? " tm-out" : "")} style={{ position: "fixed", inset: 0, background: t.overlay, backdropFilter: "blur(2.5px)", WebkitBackdropFilter: "blur(2.5px)", zIndex: 180, animation: "tmDim .28s ease both" }} />
        <div
          ref={korenRef}
          role="dialog"
          aria-modal="true"
          aria-label={titulek || undefined}
          className={"tm-drawer" + (out ? " tm-out" : "")}
          style={{
            position: "fixed", zIndex: 190, background: t.bg, overflowY: "auto", WebkitOverflowScrolling: "touch",
            animation: touched ? "none" : undefined,
            transform: dragY ? `translateY(${dragY}px)` : undefined,
            transition: snapping ? "transform .26s cubic-bezier(.23,.62,.22,.99)" : undefined,
          }}
        >
          <div className="tm-drawer-grip" onTouchStart={onGripStart} onTouchMove={onGripMove} onTouchEnd={onGripEnd} onTouchCancel={onGripEnd}>
            <span />
          </div>
          <div style={{ padding: "22px 26px calc(40px + env(safe-area-inset-bottom))" }}>
            <button onClick={onClose} title={L("Zavřít", "Close")} aria-label={L("Zavřít", "Close")} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 15, width: 34, height: 34, padding: 0, float: "right" }}>✕</button>
            <div style={{ clear: "none" }}>{children}</div>
          </div>
        </div>
      </>,
      document.body
    );
  }

  return { CenterSheet, Drawer, TmSipka, tmDvirka };
}
