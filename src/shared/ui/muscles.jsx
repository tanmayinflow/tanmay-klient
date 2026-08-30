// ----------------------------------------------------------------------
// SVALOVÁ MAPA · kreslené referenční figury místo siluety
// ----------------------------------------------------------------------
// Dvě figury ve stylu desek Movement Atlasu (předek a zadek, generované
// 2026-08-30, dodané s vlastní průhledností — kresba se používá beze změny,
// jen s těsným ořezem; master v Assets aplikace, v produkci webp
// v `public/svaly/`). Partie, které cvik posiluje,
// nekreslí obrázek — rozsvěcí je aplikace: nad figurou leží měkké měděné
// elipsy zarovnané na kresbu, hlavní svaly plněji, vedlejší slabě.
// Díky tomu jeden pár obrázků unese všechny kombinace 19 partií,
// značení jde s motivem (t.accent) a při nenačtení obrázku se vrací
// stará procedurální silueta (`renderFallback`).
//
// Figury jsou ořezané těsně na tělo (výška ≈ dvojnásobek šířky), takže
// se v detailu kreslí velké jako na deskách. Souřadnice: x v procentech
// šířky, y v týchž jednotkách (viewBox `0 0 100 A`); `mir: 1` zrcadlí
// elipsu přes svislou osu — kreslí se obě strany těla.
import React, { useState } from "react";

export const TM_SVALY_REGIONY = {
  front: {
    sho: [{ e: [29.7, 41.9, 4.2, 5.2, 20], mir: 1 }],
    che: [{ e: [42.7, 46.6, 6.5, 5.2, -8], mir: 1 }],
    bic: [{ e: [25.5, 54.4, 4.0, 7.9, 12], mir: 1 }],
    fore: [{ e: [17.2, 83.6, 3.6, 9.9, 14], mir: 1 }],
    serr: [{ e: [38.0, 58.6, 2.3, 4.2, 12], mir: 1 }],
    abs: [{ e: [50, 63.8, 5.4, 10.4, 0] }],
    obl: [{ e: [40.6, 64.8, 3.3, 8.7, 6], mir: 1 }],
    hipflex: [{ e: [43.2, 91.9, 3.7, 5.2, 10], mir: 1 }],
    add: [{ e: [45.3, 111.7, 3.3, 8.3, -5], mir: 1 }],
    qua: [{ e: [41.1, 121.1, 6.0, 16.7, 4], mir: 1 }],
  },
  back: {
    neck: [{ e: [50, 23.6, 2.5, 4.7, 0] }],
    tra: [{ e: [45.5, 39.2, 4.6, 7.3, -14], mir: 1 }],
    rcuff: [{ e: [37.7, 47.4, 3.5, 4.4, 0], mir: 1 }],
    upb: [{ e: [44.4, 58.8, 5.2, 9.9, -8], mir: 1 }],
    tri: [{ e: [23.2, 62.0, 4.1, 8.9, 14], mir: 1 }],
    low: [{ e: [50, 83.7, 5.8, 8.8, 0] }],
    glu: [{ e: [43.4, 101.3, 6.4, 7.8, 0], mir: 1 }],
    ham: [{ e: [41.8, 131.4, 5.6, 15.5, 3], mir: 1 }],
    cal: [{ e: [41.3, 169.7, 4.4, 12.4, 3], mir: 1 }],
  },
};

/* Poměr stran ořezaných figur · viewBox je "0 0 100 A", souřadnice y
   jsou v jednotkách šířky — elipsy tak drží tvar i rotaci. */
export const TM_SVALY_POMER = { front: 196.65, back: 210.15 };

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
          <svg viewBox={`0 0 100 ${TM_SVALY_POMER[side]}`} aria-hidden="true" focusable="false"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <defs><filter id={blurId} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.6" /></filter></defs>
            <g fill={t.accent} filter={`url(#${blurId})`}>{shapes}</g>
          </svg>
        </span>
      );
    };
    return (
      <div>
        <div style={{ display: "flex", gap: fluid ? "6%" : 12, alignItems: "flex-start" }}>
          <div style={fluid ? { flex: 1, minWidth: 0 } : { width: size * 0.62 }}>{view("front")}</div>
          <div style={fluid ? { flex: 1, minWidth: 0 } : { width: size * 0.62 }}>{view("back")}</div>
        </div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, marginTop: 7 }}>
          <span style={{ color: t.accent }}>●</span> {L("hlavní", "primary")} &nbsp; <span style={{ color: t.accent, opacity: 0.4 }}>●</span> {L("vedlejší", "secondary")}
        </div>
      </div>
    );
  }

  return { TmSvalyFigura };
}
