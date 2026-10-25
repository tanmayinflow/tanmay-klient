import React, { useState } from "react";
import { sourceCoverArt } from "../product/sourceCovers.js";

// A failed cover only changes presentation. User uploads and source records stay intact.
export function SourceCover({ src, category, type, ...props }) {
  return <CoverImage key={`${src || ""}:${category || ""}:${type || ""}`} src={src} category={category} type={type} {...props} />;
}

function CoverImage({ src, category, type, theme, glyph: Glyph, variant = "gallery" }) {
  const [realFailed, setRealFailed] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const art = sourceCoverArt(category, type);
  const real = !!src && !realFailed;
  const image = real ? src : (!artFailed && art);
  const small = variant === "row";
  const inset = variant === "gallery" ? "8px 12px" : small ? "1px" : "5px";
  const mask = image ? `url("${image}") center / contain no-repeat` : undefined;
  return (
    <span data-source-cover={real ? "real" : image ? "category" : "medium"} data-source-art={!real && image ? "theme-ink" : undefined}
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", overflow: "hidden", background: theme.callout }}>
      {image ? <>
        <img key={image} src={image} alt="" loading={variant === "detail" ? "eager" : "lazy"} decoding="async"
          onError={() => real ? setRealFailed(true) : setArtFailed(true)}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", opacity: real ? 1 : 0 }} />
        {!real && <span aria-hidden="true" style={{ position: "absolute", inset, pointerEvents: "none", background: `var(--land-art-ink, ${theme.textSec || theme.text || "currentColor"})`, mask, WebkitMask: mask }} />}
      </> : Glyph && <span style={{ display: "inline-flex", color: theme.textMuted }}><Glyph size={small ? 19 : 32} /></span>}
    </span>
  );
}
