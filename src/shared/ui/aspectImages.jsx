import React, { useRef, useState } from "react";
import { TmIcon } from "./icons.jsx";

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
    return <div onClick={e => e.stopPropagation()} style={{ textAlign: "center", margin: "20px 0", color: "#F4F0EB" }}>
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
