import React, { useLayoutEffect, useRef, useState } from "react";

// Keep the original uninterrupted. Controls follow its actual alpha contours.
export function SidebarLines() {
  const ref = useRef(null);
  const [geometry, setGeometry] = useState(null);
  useLayoutEffect(() => {
    const panel = ref.current?.parentElement;
    if (!panel) return;
    let pixels, sourceWidth, sourceHeight, disposed = false;
    const art = new Image();
    const measure = () => {
      if (disposed) return;
      const rect = panel.getBoundingClientRect();
      const scale = rect.width / panel.offsetWidth || 1;
      const height = panel.clientHeight, width = panel.clientWidth;
      const local = (el) => { const b = el.getBoundingClientRect(); return { x: (b.left - rect.left) / scale - panel.clientLeft, y: (b.top - rect.top) / scale + panel.scrollTop - panel.clientTop, width: b.width / scale, height: b.height / scale }; };
      const curves = (y) => {
        if (!pixels) return [width - 70, width - 24];
        const x = Math.max(0, Math.min(sourceWidth - 1, Math.round(y / height * (sourceWidth - 1))));
        const runs = []; let start = -1;
        for (let row = 0; row <= sourceHeight; row++) {
          const on = row < sourceHeight && pixels[(row * sourceWidth + x) * 4 + 3] > 64;
          if (on && start < 0) start = row;
          if (!on && start >= 0) { runs.push({ mid: (start + row - 1) / 2, length: row - start }); start = -1; }
        }
        return runs.sort((a, b) => b.length - a.length).slice(0, 2).map((r) => width - 45 + (sourceHeight / 2 - r.mid) * height / sourceWidth).sort((a, b) => a - b);
      };
      const set = (name, value) => { if (Number.isFinite(value)) panel.style.setProperty(name, `${Math.round(value * 100) / 100}px`); };
      const gear = panel.querySelector(".tm-gear");
      if (gear && gear.offsetWidth) {
        const b = local(gear), left = curves(b.y + b.height / 2)[0];
        const old = parseFloat(panel.style.getPropertyValue("--tm-gear-shift")) || 0;
        set("--tm-gear-shift", left - 22 - (b.x + b.width / 2 - old));
      }
      const search = panel.querySelector(".tm-sidebar-search");
      if (search) {
        const b = local(search);
        const edge = Math.min(...[b.y, b.y + b.height / 2, b.y + b.height].map((y) => curves(y)[0]));
        set("--tm-search-width", Math.max(160, edge - b.x - 12));
      }
      const redo = panel.querySelector(".tm-redo"), history = panel.querySelector(".tm-history");
      if (redo && history) {
        const b = local(history), line = curves(b.y + b.height / 2);
        const center = (line[0] + line[1]) / 2;
        set("--tm-redo-left", center - b.x - 18);
        set("--tm-undo-left", Math.min(center - 40, line[0] - 22) - b.x - 18);
      }
      setGeometry({ height });
    };
    art.onload = () => {
      if (disposed) return;
      const sample = document.createElement("canvas");
      sourceWidth = sample.width = art.naturalWidth;
      sourceHeight = sample.height = art.naturalHeight;
      const ctx = sample.getContext("2d", { willReadFrequently: true });
      if (ctx) { ctx.drawImage(art, 0, 0); pixels = ctx.getImageData(0, 0, sourceWidth, sourceHeight).data; }
      measure();
    };
    art.src = "/media/landscape/sidebar-line.png";
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    for (const child of panel.children) if (child !== ref.current) observer.observe(child);
    measure();
    return () => { disposed = true; observer.disconnect(); art.onload = null; };
  }, []);
  return <span ref={ref} className="tm-sidebar-lines" aria-hidden="true" style={{ height: geometry?.height }}>
    {geometry && <span style={{ width: geometry.height, height: geometry.height / 3 }} />}
  </span>;
}
