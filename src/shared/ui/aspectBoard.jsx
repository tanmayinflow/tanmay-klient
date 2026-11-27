import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TmIcon } from "./icons.jsx";
import { useVrstva } from "./overlay.jsx";

// Only the active gallery reads its index. Personal uploads remain in their
// original account storage; hiding a curated image changes just this account.
export function useAspectBoard(key) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!key || key === "center") return;
    const controller = new AbortController();
    const base = "/api/aspect-boards/" + key;
    async function load() {
      try {
        const response = await fetch(base + "/index.json", { signal: controller.signal });
        if (response.status === 404) {
          if (!controller.signal.aborted) setResult({ key, entries: [] });
          return;
        }
        if (!response.ok) throw new Error("index unavailable");
        const { images } = await response.json();
        if (!Array.isArray(images) || !images.every(id => typeof id === "string" && /^[0-9]{3}$/.test(id))) {
          throw new Error("invalid board index");
        }
        const entries = images.map(id => ({
          id: "board-" + key + "-" + id,
          thumb: base + "/thumb/" + id + ".webp",
          full: base + "/full/" + id + ".webp",
        }));
        if (!controller.signal.aborted) setResult({ key, entries });
      } catch {
        if (!controller.signal.aborted) setResult({ key, entries: [], error: true });
      }
    }
    load();
    return () => controller.abort();
  }, [key, attempt]);
  const current = result?.key === key ? result : null;
  return { entries: current?.entries || [], error: current?.error, retry: () => setAttempt(n => n + 1) };
}

export function BoardThumbnail({ src, label, onOpen, selected }) {
  return (
    <button type="button" data-pickmain="" aria-label={label} aria-pressed={selected}
      onClick={e => { e.stopPropagation(); onOpen(); }}
      style={{ display: "block", width: "100%", border: 0, padding: 0, background: "transparent", cursor: "zoom-in" }}>
      <img src={src} alt="" draggable={false} loading="lazy" decoding="async" style={{ display: "block", width: "100%", aspectRatio: "3 / 4", objectFit: "cover" }} />
    </button>
  );
}

export function BoardLightbox({ src, label, closeLabel, onClose }) {
  const ref = useRef(null);
  useVrstva({ close: onClose, ref });
  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={label}
      onClick={e => { e.stopPropagation(); onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 400, background: "#171716", display: "grid", placeItems: "center", padding: "min(3vw, 20px)", cursor: "zoom-out" }}>
      <img src={src} alt={label} decoding="async" style={{ width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }} />
      <button type="button" aria-label={closeLabel}
        style={{ position: "absolute", right: "max(12px, env(safe-area-inset-right))", top: "max(12px, env(safe-area-inset-top))", display: "grid", placeItems: "center", width: 44, height: 44, background: "#171716dd", borderRadius: "50%", border: 0, color: "#F4F0EB", cursor: "pointer" }}>
        <TmIcon id="close" size={20} />
      </button>
    </div>, document.body
  );
}
