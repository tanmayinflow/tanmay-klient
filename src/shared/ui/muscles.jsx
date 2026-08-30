// ----------------------------------------------------------------------
// SVALOVÁ MAPA · kreslené referenční figury místo siluety
// ----------------------------------------------------------------------
// Dvě figury ve stylu desek Movement Atlasu (předek a zadek, generované
// 2026-08-30, dodané s vlastní průhledností — kresba se používá beze změny).
// Obě jsou usazené na SPOLEČNÉM plátně 777×1526: zadní figura je
// přeškálovaná na výšku přední a barevně sladěná s jejím odstínem kůže,
// obě stojí nohama i hlavou na stejné úrovni a zrcadlí se kolem x=50.
// Master v Assets aplikace, v produkci webp v `public/svaly/`.
//
// Partie, které cvik posiluje, nekreslí obrázek — rozsvěcí je aplikace:
// nad figurou leží měkké měděné elipsy zarovnané na kresbu, hlavní svaly
// plněji, vedlejší slabě. Celá skupina elips je ořezaná obrysem postavy
// (`TM_SVALY_OBRYS`, cesta získaná z alfa kanálu kresby), takže měď nikdy
// nepřesáhne siluetu. Jeden pár obrázků tak unese všechny kombinace
// 19 partií, značení jde s motivem (t.accent) a při nenačtení obrázku se
// vrací stará procedurální silueta (`renderFallback`).
//
// Souřadnice: x v procentech šířky, y v týchž jednotkách (viewBox
// `0 0 100 A`); `mir: 1` zrcadlí elipsu přes svislou osu.
import React, { useState } from "react";

export const TM_SVALY_REGIONY = {
  front: {
    sho: [{ e: [29.8, 41.9, 4.2, 5.2, 20], mir: 1 }],
    che: [{ e: [42.7, 47.6, 6.5, 5.2, -8], mir: 1 }],
    bic: [{ e: [25.6, 54.4, 4, 7.9, 12], mir: 1 }],
    fore: [{ e: [17.3, 83.5, 3.6, 9.9, 14], mir: 1 }],
    serr: [{ e: [38, 58.6, 2.3, 4.2, 12], mir: 1 }],
    abs: [{ e: [50, 63.8, 5.4, 10.4, 0] }],
    obl: [{ e: [40.6, 64.8, 3.3, 8.7, 6], mir: 1 }],
    hipflex: [{ e: [43.2, 91.8, 3.7, 5.2, 10], mir: 1 }],
    add: [{ e: [45.3, 111.5, 3.3, 8.3, -5], mir: 1 }],
    qua: [{ e: [41.1, 120.9, 6, 16.7, 4], mir: 1 }],
  },
  back: {
    neck: [{ e: [49.8, 22.2, 2.3, 4.4, 0] }],
    tra: [{ e: [45.6, 36.7, 4.3, 6.8, -14], mir: 1 }],
    rcuff: [{ e: [38.3, 44.4, 3.3, 4.1, 0], mir: 1 }],
    upb: [{ e: [44.5, 55, 4.9, 9.2, -8], mir: 1 }],
    tri: [{ e: [24.7, 58, 3.8, 8.3, 14], mir: 1 }],
    low: [{ e: [49.8, 78.2, 5.4, 8.2, 0] }],
    glu: [{ e: [43.6, 94.7, 6, 7.3, 0], mir: 1 }],
    ham: [{ e: [42.1, 122.8, 5.2, 14.5, 3], mir: 1 }],
    cal: [{ e: [41.6, 158.5, 4.1, 11.6, 3], mir: 1 }],
  },
};

/* Poměr stran společného plátna · obě figury ho sdílí, takže se v páru
   kreslí stejně velké a na stejné úrovni. */
export const TM_SVALY_POMER = { front: 196.4, back: 196.4 };

export const TM_SVALY_SRC = {
  front: "/svaly/figura-predek.webp",
  back: "/svaly/figura-zadek.webp",
};

/* Obrys postavy jako SVG cesta v jednotkách viewBoxu — ořez měděných elips,
   aby značení svalů nikdy nepřeteklo přes okraj kresby. */
export const TM_SVALY_OBRYS = {
  front: "M48.5 0.9L46.7 1.4L44.4 2.8L42.6 5.1L41.8 7.5L41.8 12.5L41.2 13.0L41.1 14.3L41.8 16.9L43.4 18.7L44.1 20.7L44.3 24.8L43.9 27.7L42.6 29.1L33.6 34.4L30.6 35.3L28.8 36.3L27.5 37.5L25.9 39.9L24.1 44.9L23.8 46.6L23.9 51.6L21.6 58.2L21.1 64.1L20.6 65.8L15.1 74.3L13.6 78.4L12.4 85.5L8.5 94.9L5.3 96.8L0.5 102.6L1.0 103.1L2.1 103.1L3.5 102.3L4.5 101.2L5.1 101.0L4.5 103.7L3.1 106.9L2.1 110.6L2.1 111.2L2.4 111.6L3.0 111.6L3.7 110.8L5.1 107.2L6.0 105.8L6.0 106.9L4.8 112.2L4.8 113.9L5.0 114.2L5.7 114.2L6.3 113.4L7.9 108.2L8.0 109.0L7.2 113.5L7.5 113.8L8.5 113.5L9.1 112.0L10.4 106.6L10.3 111.5L10.6 112.0L11.5 111.7L12.1 109.8L12.6 105.0L14.2 99.6L13.9 96.5L17.1 90.5L23.7 81.2L25.2 77.2L26.0 73.9L27.2 71.2L27.7 68.0L28.6 66.7L29.9 63.4L31.5 60.5L32.8 56.6L34.1 60.6L35.6 63.3L36.2 64.9L37.2 71.4L37.1 73.4L35.9 78.4L36.0 80.8L35.0 85.1L34.5 86.0L32.8 95.0L30.9 109.5L31.1 117.6L32.2 122.5L33.7 127.7L33.7 130.9L33.1 139.1L30.5 146.7L29.9 150.5L29.9 153.3L32.8 170.7L33.5 176.6L32.8 179.5L33.1 182.5L30.8 187.3L27.4 191.2L26.9 193.6L27.9 194.5L29.7 195.1L30.6 195.0L32.2 195.4L32.9 194.9L34.1 195.5L35.6 195.2L36.6 194.6L37.6 192.8L38.1 190.0L39.4 189.1L39.8 188.4L39.9 186.9L39.3 184.0L39.8 179.7L38.5 175.8L38.5 172.3L40.0 162.2L42.3 155.7L42.9 153.0L42.7 149.3L41.8 144.5L41.7 142.1L42.0 140.4L43.5 137.3L44.5 134.4L45.7 126.9L45.9 119.4L48.6 109.9L49.3 102.2L49.5 101.7L50.5 101.7L50.8 103.1L51.4 109.9L54.1 119.6L54.3 126.8L55.3 133.8L56.4 137.2L57.9 140.0L58.3 141.6L58.2 145.0L57.3 149.7L57.3 153.7L57.5 155.2L60.0 162.0L61.1 169.2L61.5 173.9L61.3 177.0L60.2 179.7L60.2 180.8L60.7 182.5L60.2 188.3L62.0 190.1L62.3 192.3L63.6 194.7L65.1 195.5L66.0 195.5L67.1 195.0L67.8 195.4L68.9 195.4L69.4 195.0L70.4 195.1L71.9 194.6L73.2 193.3L72.5 191.0L69.2 187.1L66.9 182.4L67.2 179.8L66.5 177.6L66.8 172.5L70.1 153.3L70.1 150.5L69.5 146.7L66.9 139.0L66.8 134.1L66.3 130.4L66.5 126.5L68.1 121.8L68.9 117.8L69.2 113.3L69.1 109.5L66.8 92.7L65.5 86.2L64.0 81.0L64.0 77.5L62.8 72.8L62.9 69.5L63.7 65.4L66.0 60.4L67.2 56.8L68.6 60.7L72.6 68.3L73.2 71.9L74.3 74.4L74.8 77.1L76.1 80.6L77.6 83.4L82.1 89.2L86.1 96.5L85.8 99.6L87.5 105.3L87.8 108.9L88.5 111.6L89.4 111.8L89.7 111.3L89.6 106.4L91.4 113.3L91.8 113.6L92.5 113.6L92.8 113.3L91.9 108.2L92.0 107.6L93.4 112.7L94.3 114.0L95.0 114.0L95.2 113.8L95.2 112.2L93.8 106.3L94.0 105.7L96.4 110.9L97.0 111.5L97.7 111.3L97.8 110.2L95.4 103.2L94.9 100.9L95.1 100.8L96.1 101.9L97.8 103.0L98.8 103.0L99.4 102.2L97.9 100.9L97.3 99.7L94.3 96.4L91.6 95.0L89.2 89.6L87.8 85.3L86.9 79.7L85.5 74.9L84.0 72.1L80.1 66.7L79.0 64.4L78.2 58.3L75.8 50.8L75.9 46.2L75.7 44.7L73.7 39.4L72.6 37.7L70.3 35.8L64.6 33.5L57.4 29.1L56.1 27.7L55.9 26.6L56.0 20.3L56.6 18.7L57.9 17.4L58.9 14.4L58.8 13.0L58.2 12.5L58.2 7.3L57.3 4.9L55.5 2.7L53.3 1.4L51.6 0.9Z",
  back: "M48.4 0.8L46.3 1.3L44.3 2.4L42.1 5.0L41.1 8.0L40.9 11.3L41.2 12.9L40.5 12.9L40.2 13.3L40.2 14.9L41.3 17.9L42.0 18.8L42.9 19.3L43.2 20.3L43.6 23.2L43.4 27.5L41.6 29.6L34.9 34.2L33.2 35.1L29.9 36.2L27.7 37.5L25.1 40.7L23.6 45.0L23.3 46.8L23.6 52.5L21.9 56.1L21.2 58.4L20.5 65.4L19.6 67.7L16.5 72.1L14.9 75.2L13.8 79.0L12.6 85.8L10.8 91.5L8.8 96.7L5.9 100.8L3.7 105.5L4.4 105.9L5.8 105.5L5.5 108.9L6.2 112.9L6.8 113.1L7.3 112.6L8.4 114.7L8.9 114.7L9.5 113.9L10.4 114.2L10.9 113.4L10.8 108.9L11.1 108.9L11.2 111.8L11.5 112.1L12.4 111.8L12.7 110.6L13.1 106.2L14.8 100.8L14.5 96.5L14.9 95.4L17.6 90.6L23.9 81.5L25.4 77.7L26.1 74.3L27.0 72.5L27.8 68.5L30.6 63.1L32.3 57.4L33.5 60.5L36.8 66.5L37.6 69.1L37.8 71.7L36.4 77.5L36.4 81.6L34.7 86.0L31.5 101.3L30.5 109.1L30.4 114.3L30.6 117.0L33.1 126.8L33.3 131.7L32.6 135.5L32.3 141.6L29.3 149.8L29.0 152.1L29.0 155.6L31.7 170.1L32.6 177.2L32.7 181.3L31.7 185.2L32.0 187.5L31.4 188.5L28.7 189.8L27.8 190.9L27.7 191.5L28.8 192.9L30.9 193.6L32.7 194.9L34.5 195.5L37.3 195.2L38.5 194.3L38.7 193.7L38.4 188.2L39.3 185.8L39.4 184.3L38.1 180.7L37.8 175.0L39.4 165.9L42.1 159.3L42.7 156.6L42.7 152.4L41.6 146.5L41.6 143.4L44.7 134.4L45.7 120.2L48.6 110.4L49.3 102.1L49.7 101.5L50.3 101.5L50.8 103.1L51.4 110.6L53.8 118.3L54.6 122.0L55.0 133.6L56.1 137.8L57.8 142.0L58.2 143.9L58.0 146.7L56.9 152.8L57.0 157.0L58.0 160.6L60.0 164.9L61.5 172.8L61.6 179.5L61.1 182.1L60.2 184.2L60.2 185.7L61.1 188.0L61.1 190.5L60.6 192.9L61.1 194.5L62.2 195.2L64.9 195.5L66.0 195.2L68.7 193.6L70.9 192.9L71.9 191.6L71.9 191.0L70.0 189.2L68.3 188.7L67.6 187.6L67.8 184.7L66.9 182.0L66.9 178.5L67.4 174.1L70.8 155.5L70.8 152.5L70.3 149.3L67.3 141.1L67.2 135.4L66.4 131.8L66.5 127.5L69.0 118.3L69.5 112.0L69.2 107.6L68.3 101.5L65.3 86.4L63.6 81.7L63.6 78.0L62.2 72.7L62.2 70.5L62.8 67.7L66.4 60.6L67.7 57.1L69.1 62.5L72.6 69.8L72.8 73.0L73.7 74.6L75.7 81.2L77.2 83.9L82.1 90.7L84.9 95.9L84.8 100.5L86.6 106.6L87.0 111.2L87.3 111.8L87.9 112.2L88.7 111.7L88.7 113.3L89.2 114.2L90.2 113.9L90.5 114.4L91.2 114.7L92.3 112.6L92.8 113.1L93.4 112.9L94.1 109.3L93.8 105.4L95.4 105.9L95.9 105.3L93.7 100.6L90.6 96.0L87.3 86.2L86.2 79.5L85.1 75.3L83.4 71.9L80.7 68.2L79.8 65.9L79.0 58.6L78.1 55.5L76.6 52.4L76.7 45.7L75.8 42.3L74.3 39.5L71.9 37.2L70.3 36.3L65.8 34.9L58.3 29.9L56.2 27.8L55.7 25.4L56.2 19.7L57.8 18.3L59.2 14.5L59.1 13.1L58.3 12.7L58.4 8.9L58.0 6.7L56.8 4.1L54.3 1.9L51.7 0.9Z",
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
      const fid = blurId + side;
      const cid = blurId + side + "c";
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
            <defs>
              <filter id={fid} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="0.6" /></filter>
              <clipPath id={cid} clipPathUnits="userSpaceOnUse"><path d={TM_SVALY_OBRYS[side]} clipRule="evenodd" /></clipPath>
            </defs>
            <g clipPath={`url(#${cid})`}>
              <g fill={t.accent} filter={`url(#${fid})`}>{shapes}</g>
            </g>
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
