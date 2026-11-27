import React from "react";
import { TmIcon } from "./icons.jsx";
import "./aspectStudy.css";

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
  return (
    <>
      {back}
      <header className="tm-study-cover">
        <span>{L(aspect.cz, aspect.en)}</span>
        <h1>{L(aspect.subCz, aspect.subEn)}</h1>
        <p>{L(aspect.glyphCz, aspect.glyphEn)}</p>
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
