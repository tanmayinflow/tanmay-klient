import React, { useState } from "react";
import { FONT_BODY } from "./type.js";

function reveal(el) {
  if (!el || typeof window === "undefined") return;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const r = el.getBoundingClientRect();
    if (r.top >= 0 && r.top <= window.innerHeight * .34 && r.bottom > 60) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }));
}
// The original Main disclosure is the common Plan, Review and study surface.
export function createDisclosure({ useT, TmSipka }) {
return function Toggle({ summary, color = "green", children, open: openProp = false, centered = false, bezHrany = false }) {
  const { t, tags } = useT();
  const [open, setOpen] = useState(openProp);
  const boxRef = React.useRef(null);
  const tc = tags[color] || tags.green;
  // Čtečka musí vědět, že jde o dvířka a co za nimi je · jinak přečte jen
  // slovo a neřekne, že se dá otevřít.
  const idRef = React.useRef("tg-" + Math.random().toString(36).slice(2, 9));
  // co se rozbalí, má být vidět · jinak se obsah otevře pod spodní hranou
  const flip = () => setOpen((o) => { if (!o) reveal(boxRef.current); return !o; });
  return (
    /* HRANA MÍSTO KRABICE · skupinu drží vlásečnice nahoře a prázdno pod ní.
       Pravidlo, které to jistí: nikdy dvě skupiny bez vlásečnice mezi nimi. */
    <div ref={boxRef} style={{ borderTop: bezHrany ? "none" : `1px solid ${t.borderSoft}`, marginTop: bezHrany ? 10 : 28, paddingTop: 6 }}>
      <button onClick={flip} aria-expanded={open} aria-controls={idRef.current} className="tm-nav-item" style={{ width: "100%", textAlign: centered ? "center" : "left", justifyContent: centered ? "center" : "flex-start", background: "transparent", border: "none", cursor: "pointer", padding: "12px 0", minHeight: 44, display: "flex", alignItems: "center", gap: 10, color: tc.fg, fontFamily: FONT_BODY, fontSize: 15, fontWeight: 500 }}>
        {/* měď jako u Přehledu · Plán a Ohlédnutí jsou dvě dvířka téhož druhu */}
        <TmSipka open={open} t={t} barva={centered ? t.accent : t.sage} />
        {summary}
      </button>
      {open && <div id={idRef.current} style={{ padding: "0 0 14px 22px", color: t.textSec, fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.7, animation: "tmUnfold .3s cubic-bezier(.23,.62,.22,.99) both" }}>{children}</div>}
    </div>
  );
}

}
