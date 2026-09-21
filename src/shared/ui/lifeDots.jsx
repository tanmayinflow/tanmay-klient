import React, { useEffect, useRef } from "react";
import { lifeDotTone, lifeGrid } from "../product/lifeDots.js";

export function LifeDots({ total, lived, t, L }) {
  const wrap = useRef(null), canvas = useRef(null);
  useEffect(() => {
    const cv = canvas.current, container = wrap.current;
    if (!cv || !container) return;
    let disposed = false;
    const art = new Image();
    const draw = () => {
      if (disposed) return;
      const grid = lifeGrid(container.clientWidth, total);
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(grid.width * dpr); cv.height = Math.round(grid.height * dpr);
      cv.style.width = `${grid.width}px`; cv.style.height = `${grid.height}px`;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      let pixels;
      if (art.complete && art.naturalWidth) {
        // Sample one image pixel per calendar dot. No raster image is painted
        // over or behind the field: only the existing dots carry the drawing.
        const sample = document.createElement("canvas");
        sample.width = grid.cols; sample.height = grid.rows;
        const sc = sample.getContext("2d", { willReadFrequently: true });
        if (sc) {
          const scale = Math.min(grid.cols * .96 / art.naturalWidth, grid.rows * .98 / art.naturalHeight);
          const w = art.naturalWidth * scale, h = art.naturalHeight * scale;
          sc.drawImage(art, (grid.cols - w) / 2, (grid.rows - h) / 2, w, h);
          pixels = sc.getImageData(0, 0, grid.cols, grid.rows).data;
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, grid.width, grid.height);
      for (let i = 0; i < total; i++) {
        const p = i * 4;
        const ink = pixels ? (1 - (pixels[p] + pixels[p + 1] + pixels[p + 2]) / 765) * pixels[p + 3] / 255 : 0;
        const tone = lifeDotTone(i, lived, Math.pow(ink, .55));
        ctx.globalAlpha = tone.alpha;
        ctx.fillStyle = tone.today ? t.accent : t.text;
        ctx.beginPath();
        ctx.arc((i % grid.cols) * 4 + 2, Math.floor(i / grid.cols) * 4 + 2, tone.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    art.onload = draw;
    art.onerror = draw;
    art.src = "/media/landscape/memento-art-v1.png";
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    window.addEventListener("resize", draw);
    draw();
    return () => { disposed = true; art.onload = null; art.onerror = null; observer.disconnect(); window.removeEventListener("resize", draw); };
  }, [total, lived, t.text, t.accent]);
  return <div ref={wrap} className="tm-life-dots"><canvas ref={canvas} role="img" aria-label={L(
    `${lived} prožitých dní z přibližně ${total}. Každá tečka je jeden den. Tmavší tečky značí prožitý čas. V tečkách vystupuje meditující kostra, lebka a kruh plamenů.`,
    `${lived} days lived out of approximately ${total}. Each dot is one day. Darker dots mark lived time. The dots form a meditating skeleton, skull and ring of flames.`
  )} style={{ display: "block", margin: "0 auto" }} /></div>;
}
