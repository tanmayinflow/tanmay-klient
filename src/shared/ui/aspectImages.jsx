import React, { useEffect, useRef, useState } from "react";
import { TmIcon } from "./icons.jsx";
import { attachHoldSelection } from "./holdSelection.js";

export function useAspectImageReorder(images, move, L) {
  const grid = useRef(null);
  const [held, setHeld] = useState(null);
  const [arranging, setArranging] = useState(false);
  const [picked, setPicked] = useState(null);
  const [message, setMessage] = useState("");
  const state = useRef({ sortManual: true });
  const actions = useRef(null);
  const enabled = images.length > 1;

  const place = (source, target) => {
    const position = images.findIndex(image => image.id === target) + 1;
    if (!position || !move(source, target)) return;
    setPicked(null);
    setMessage(L(`Obrázek přesunut na místo ${position}.`, `Image moved to position ${position}.`));
  };
  actions.current = { dropRow: place, label: id => id };
  useEffect(() => {
    const root = grid.current;
    if (!enabled || !root) return;
    return attachHoldSelection({
      root, attr: "data-gallery-image", stateRef: state, actionsRef: actions, onDragging: setHeld,
      makeGhost(id) {
        const tile = Array.from(root.children).find(child => child.dataset.galleryImage === id);
        const img = tile?.querySelector("img");
        if (!img) return null;
        const ghost = img.cloneNode(false);
        ghost.className = "tm-aspect-drag-ghost";
        ghost.removeAttribute("style");
        ghost.setAttribute("aria-hidden", "true");
        ghost.style.width = Math.min(92, tile.getBoundingClientRect().width) + "px";
        root.ownerDocument.body.appendChild(ghost);
        return ghost;
      },
    });
  }, [enabled]);

  const choose = (id, open) => {
    if (!arranging || !enabled) return open();
    setMessage("");
    if (picked && picked !== id && images.some(image => image.id === picked)) place(picked, id);
    else setPicked(picked === id ? null : id);
  };
  const toggle = enabled && <button type="button" className="tm-aspect-arrange" aria-pressed={arranging}
    onClick={e => { e.stopPropagation(); setArranging(!arranging); setPicked(null); setMessage(""); }}>
    {arranging ? L("Hotovo", "Done") : L("Uspořádat", "Arrange")}
  </button>;
  const hint = picked
    ? L("Vyber místo, kam chceš obrázek přesunout.", "Choose where to place the image.")
    : L("Vyber obrázek a potom jeho nové místo.", "Choose an image, then its new position.");
  return {
    grid, toggle, choose, arranging, picked,
    tileProps: id => ({ "data-gallery-image": id, "data-gallery-picked": held === id || picked === id || undefined }),
    feedback: <div role="status" className={arranging && enabled ? "tm-aspect-arrange-hint" : "tm-aspect-sr-only"}>
      {arranging && enabled ? [message, hint].filter(Boolean).join(" ") : message}
    </div>,
  };
}

// Role-local storage is injected by each application; no shared gallery data.
export async function uploadAspectImages(files, { resize, put, uid }) {
  const added = [];
  let failed = 0;
  for (const file of Array.from(files || [])) {
    if (!(file.type || "").startsWith("image/")) { failed++; continue; }
    try {
      const id = uid() + "m";
      const blob = await resize(file, 900);
      await put(id, blob, file.name);
      added.push({ id, r2id: id });
    } catch { failed++; }
  }
  return { added, failed };
}

export function createAspectImageUI({ useStore, L, resizeImageToBlob, r2Put, uid }) {
  return function AspectImageAdd({ aspKey }) {
    const st = useStore();
    const latest = useRef(st);
    latest.current = st;
    const input = useRef(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const add = async (files) => {
      if (!files?.length || busy) return;
      setBusy(true); setError("");
      try {
        const { added, failed } = await uploadAspectImages(files, { resize: resizeImageToBlob, put: r2Put, uid });
        if (added.length) {
          const data = (latest.current.coll.mandala || {})[aspKey] || {};
          latest.current.setMandala({ [aspKey]: { ...data, imgs: [...(data.imgs || []), ...added] } });
        }
        if (failed) setError(L("Některé obrázky se nepodařilo nahrát. Zkus to znovu.", "Some images could not be uploaded. Please try again."));
      } finally { setBusy(false); }
    };
    return <div className="tm-aspect-add" onClick={e => e.stopPropagation()} style={{ textAlign: "center", color: "#F4F0EB" }}>
      <button type="button" aria-label={L("Přidat obrázky k aspektu", "Add images to this aspect")} disabled={busy} aria-busy={busy}
        onClick={() => input.current?.click()} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, border: "none", background: "transparent", color: "inherit", cursor: busy ? "wait" : "pointer", opacity: busy ? .5 : .8 }}>
        <TmIcon id="add" size={18} />
      </button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => { add(e.target.files); e.target.value = ""; }} />
      {busy && <div role="status">{L("Nahrávám…", "Uploading…")}</div>}
      {error && <p role="alert">{error}</p>}
    </div>;
  };
}
