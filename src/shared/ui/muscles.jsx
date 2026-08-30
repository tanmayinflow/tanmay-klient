// ----------------------------------------------------------------------
// SVALOVÁ MAPA · kreslené referenční figury místo siluety
// ----------------------------------------------------------------------
// Dvě figury ve stylu desek Movement Atlasu (předek a zadek, generované
// 2026-08-30, pozadí odstraněné programem, master v Assets aplikace,
// v produkci webp v `public/svaly/`). Partie, které cvik posiluje,
// nekreslí obrázek — rozsvěcí je aplikace: nad figurou leží měkké měděné
// elipsy zarovnané na kresbu, hlavní svaly plněji, vedlejší slabě.
// Díky tomu jeden pár obrázků unese všechny kombinace 19 partií,
// značení jde s motivem (t.accent) a při nenačtení obrázku se vrací
// stará procedurální silueta (`renderFallback`).
//
// Souřadnice jsou procenta čtverce obrázku (0–100). `mir: 1` zrcadlí
// elipsu přes svislou osu — kreslí se obě strany těla.
import React, { useState } from "react";

export const TM_SVALY_REGIONY = {
  front: {
    qua:  [{ e: [45.0, 61, 3.4, 10.0, 4], mir: 1 }],
    abs:  [{ e: [50, 37.5, 3.6, 6.5, 0] }],
    obl:  [{ e: [44.4, 37, 1.9, 5.0, 8], mir: 1 }],
    che:  [{ e: [45.6, 27.8, 4.2, 3.4, -8], mir: 1 }],
    sho:  [{ e: [39.5, 23.5, 2.6, 3.2, 20], mir: 1 }],
    bic:  [{ e: [36.8, 30.5, 2.2, 4.4, 14], mir: 1 }],
    fore: [{ e: [33.4, 44, 2.0, 5.2, 16], mir: 1 }],
    add:  [{ e: [47.6, 57.5, 1.8, 4.4, -6], mir: 1 }],
    hipflex: [{ e: [45.8, 48.5, 2.0, 2.8, 12], mir: 1 }],
    serr: [{ e: [43.0, 33.5, 1.4, 2.4, 14], mir: 1 }],
  },
  back: {
    ham:  [{ e: [45.4, 62, 3.0, 8.0, 3], mir: 1 }],
    glu:  [{ e: [46.4, 49.5, 3.4, 4.0, 0], mir: 1 }],
    cal:  [{ e: [45.2, 79, 2.2, 6.5, 3], mir: 1 }],
    low:  [{ e: [50, 40.5, 3.2, 4.4, 0] }],
    upb:  [{ e: [47.0, 29, 3.0, 5.4, -10], mir: 1 }],
    tra:  [{ e: [47.6, 21.5, 2.6, 4.2, -16], mir: 1 }],
    tri:  [{ e: [36.6, 31, 2.2, 4.6, 16], mir: 1 }],
    rcuff: [{ e: [43.2, 24.5, 2.0, 2.4, 0], mir: 1 }],
    neck: [{ e: [50, 16, 1.6, 3.0, 0] }],
  },
};

export const TM_SVALY_SRC = {
  front: "/svaly/figura-predek.webp",
  back: "/svaly/figura-zadek.webp",
};

export function createMuscleFig(deps) {
  const { useT, L } = deps;

  /**
   * <TmSvalyFigura mp ms size fluid renderFallback />
   * Rozhraní drží tvar staré svalové mapy: `mp` hlavní, `ms` vedlejší
   * partie, `fluid` roztáhne pár figur do šířky rodiče. Když se obrázek
   * nenačte, kreslí se `renderFallback()` — stará silueta, nikdy díra.
   */
  function TmSvalyFigura({ mp = [], ms = [], size = 150, fluid = false, renderFallback }) {
    const { t } = useT();
    const [selhalo, setSelhalo] = useState(false);
    const [blurId] = useState(() => "tmsv" + Math.random().toString(36).slice(2, 8));
    if (selhalo && renderFallback) return renderFallback();
    const lvl = (k) => (mp.includes(k) ? 0.55 : ms.includes(k) ? 0.26 : 0);
    const view = (side) => {
      const shapes = [];
      for (const [k, list] of Object.entries(TM_SVALY_REGIONY[side])) {
        const o = lvl(k);
        if (!o) continue;
        for (const s of list) {
          const [cx, cy, rx, ry, rot] = s.e;
          shapes.push(<ellipse key={k + cx} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} opacity={o} />);
          if (s.mir) {
            const mx = 100 - cx;
            shapes.push(<ellipse key={k + cx + "m"} cx={mx} cy={cy} rx={rx} ry={ry} transform={`rotate(${-rot} ${mx} ${cy})`} opacity={o} />);
          }
        }
      }
      return (
        <span style={{ position: "relative", display: "block" }}>
          <img src={TM_SVALY_SRC[side]} alt="" loading="lazy" decoding="async" draggable={false}
            onError={() => setSelhalo(true)}
            style={{ width: "100%", height: "auto", display: "block", userSelect: "none" }} />
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs><filter id={blurId} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.6" /></filter></defs>
            <g fill={t.accent} filter={`url(#${blurId})`}>{shapes}</g>
          </svg>
        </span>
      );
    };
    const lab = { fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12, color: t.sage, marginTop: 5, textAlign: "center" };
    return (
      <div>
        <div style={{ display: "flex", gap: fluid ? "6%" : 12, alignItems: "flex-start" }}>
          <div style={fluid ? { flex: 1, minWidth: 0 } : { width: size * 0.62 }}>{view("front")}<div style={lab}>{L("zepředu", "front")}</div></div>
          <div style={fluid ? { flex: 1, minWidth: 0 } : { width: size * 0.62 }}>{view("back")}<div style={lab}>{L("zezadu", "back")}</div></div>
        </div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, marginTop: 7 }}>
          <span style={{ color: t.accent }}>●</span> {L("hlavní", "primary")} &nbsp; <span style={{ color: t.accent, opacity: 0.4 }}>●</span> {L("vedlejší", "secondary")}
        </div>
      </div>
    );
  }

  return { TmSvalyFigura };
}
