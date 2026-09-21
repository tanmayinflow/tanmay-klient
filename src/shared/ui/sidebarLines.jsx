import React, { useLayoutEffect, useRef, useState } from "react";

// Rotate the owner's original artwork without changing its pixels. The measured
// panel height takes it exactly to both edges, also on shorter phones.
export function SidebarLines() {
  const ref = useRef(null);
  const [geometry, setGeometry] = useState(null);
  useLayoutEffect(() => {
    const panel = ref.current?.parentElement;
    if (!panel) return;
    const measure = () => {
      const rect = panel.getBoundingClientRect();
      const scale = rect.width / panel.offsetWidth || 1;
      const holes = [".tm-gear", ".tm-redo"].map((selector) => panel.querySelector(selector)).filter(Boolean).map((button) => {
        const b = button.getBoundingClientRect();
        return { x: (b.left + b.width / 2 - rect.left) / scale, y: (b.top + b.height / 2 - rect.top) / scale + panel.scrollTop };
      });
      setGeometry({ height: panel.clientHeight, holes });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    for (const child of panel.children) if (child !== ref.current) observer.observe(child);
    measure();
    return () => observer.disconnect();
  }, []);
  const mask = geometry?.holes.map(({ x, y }) => `radial-gradient(circle at ${x}px ${y}px, transparent 17px, #000 20px)`).join(", ");
  return <span ref={ref} className="tm-sidebar-lines" aria-hidden="true" style={{ height: geometry?.height, maskImage: mask, WebkitMaskImage: mask, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>
    {geometry && <span style={{ width: geometry.height, height: geometry.height / 3 }} />}
  </span>;
}
