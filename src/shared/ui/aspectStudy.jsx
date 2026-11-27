import React from "react";
import { TmIcon } from "./icons.jsx";
import "./aspectStudy.css";

// The two uploaded Notion covers also occur in their boards. Their immutable
// source IDs keep the same cover even when someone rearranges their gallery.
const covers = {
  north: ["/api/aspect-boards/north/full/002.webp", "50%"],
  east: ["https://app.notion.com/images/page-cover/nasa_orion_nebula.jpg", "0%"],
  south: ["https://app.notion.com/images/page-cover/gradients_2.png", "20%"],
  west: ["/api/aspect-boards/west/full/005.webp", "50%"],
};

export function AspectStudyHeader({ aspect, onBack, L }) {
  const back = (
    <button type="button" className="tm-study-back" onClick={onBack}>
      <TmIcon id="back" size={14} /> Mandala
    </button>
  );
  if (!aspect) return (
    <header className="tm-study-center">
      {back}
      <h1>{L("Střed mandaly", "Center of the mandala")}</h1>
      <p>{L("Místo, odkud naslouchám a volím.", "Where I listen and choose.")}</p>
      <span className="tm-study-center-art" aria-hidden="true" />
      <span className="tm-study-glass" aria-hidden="true" />
    </header>
  );
  const [src, position] = covers[aspect.key];
  return (
    <>
      {back}
      <header className="tm-study-cover" data-aspect={aspect.key}>
        <img key={src} src={src} referrerPolicy="no-referrer" alt="" decoding="async"
          style={{ objectPosition: "center " + position }} onError={event => { event.currentTarget.hidden = true; }} />
        <div className="tm-study-cover-copy">
          <span>{L(aspect.cz, aspect.en)}</span>
          <h1>{L(aspect.subCz, aspect.subEn)}</h1>
          <p>{L(aspect.glyphCz, aspect.glyphEn)}</p>
        </div>
      </header>
    </>
  );
}

export function AspectDisclosure({ title, children }) {
  return (
    <details className="tm-study-disclosure">
      <summary>{title}</summary>
      <div className="tm-study-reading">{children}</div>
    </details>
  );
}
