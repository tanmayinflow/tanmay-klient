import React from "react";
import { CENTER_STUDY } from "./mandalaCenterStudy.js";
import { NORTH_EAST_STUDY } from "./mandalaNorthEast.js";
import { SOUTH_WEST_STUDY } from "./mandalaSouthWest.js";

const studies = { ...NORTH_EAST_STUDY, ...SOUTH_WEST_STUDY, center: CENTER_STUDY };

export function MandalaPracticeGuide({ aspect, L }) {
  const study = studies[aspect];
  return (
    <div className="tm-aspect-practices">
      <p>{L(study.reading.cz, study.reading.en)}</p>
      {study.practices.map(practice => {
        const copy = L(practice.cz, practice.en);
        const source = study.sources.find(item => item.id === practice.source);
        return (
          <details key={practice.id} className="tm-aspect-practice">
            <summary>{copy.title}</summary>
            <div className="tm-aspect-practice-body">
              <p>{copy.when}</p>
              <ol>{copy.steps.map(step => <li key={step}>{step}</li>)}</ol>
              <p><em>{copy.reflect}</em></p>
              <p className="tm-aspect-practice-source">
                {practice.kind === "method"
                  ? L("Metoda z pramene, ve zkráceném podání pro tuto aplikaci.", "A short version of a method described in the source.")
                  : L("Cvičení vytvořené pro aplikaci podle uvedeného pramene.", "An exercise written for this app drawing on the source below.")}
                {" "}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
              </p>
            </div>
          </details>
        );
      })}
      <details className="tm-aspect-practice tm-aspect-reading">
        <summary>{L("Prameny k dalšímu čtení", "Further reading")}</summary>
        <ul>{study.sources.map(source => (
          <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>
        ))}</ul>
      </details>
    </div>
  );
}
