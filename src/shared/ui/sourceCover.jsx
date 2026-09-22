import React, { useState } from "react";
import { sourceCoverArt } from "../product/sourceCovers.js";

// Only presentation state lives here. A failed real cover never changes the record.
export function SourceCover({ src, category, ...props }) {
  return <CoverImage key={`${src || ""}:${category || ""}`} src={src} category={category} {...props} />;
}

function CoverImage({ src, category, theme, glyph: Glyph, score, variant = "gallery" }) {
  const [realFailed, setRealFailed] = useState(false);
  const [artFailed, setArtFailed] = useState(false);
  const art = sourceCoverArt(category);
  const real = !!src && !realFailed;
  const image = real ? src : (!artFailed && art);
  const gallery = variant === "gallery";
  const small = variant === "row";
  return (
    <span data-source-cover={real ? "real" : image ? "category" : "medium"}
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", overflow: "hidden", background: theme.callout }}>
      {image ? <img key={image} src={image} alt="" loading={variant === "detail" ? "eager" : "lazy"} decoding="async"
        onError={() => real ? setRealFailed(true) : setArtFailed(true)}
        style={{ display: "block", width: "100%", height: "100%", boxSizing: "border-box", objectFit: real ? "cover" : "contain",
          padding: real ? 0 : gallery ? "8px 12px" : small ? 1 : 5,
          opacity: real ? 1 : 0 }} />
        : Glyph && <span style={{ display: "inline-flex", color: theme.textMuted }}><Glyph size={small ? 19 : 32} /></span>}
      {image && !real && <span aria-hidden="true" style={{ position: "absolute", inset: gallery ? "8px 12px" : small ? 1 : 5,
        background: theme.text, opacity: .54, mask: `url("${image}") center / contain no-repeat`, WebkitMask: `url("${image}") center / contain no-repeat`, pointerEvents: "none" }} />}
    </span>
  );
}
