import React from "react";
import { CENTER_STUDY } from "./mandalaCenterStudy.js";
import { NORTH_EAST_STUDY } from "./mandalaNorthEast.js";
import { SOUTH_WEST_STUDY } from "./mandalaSouthWest.js";

const studies = { ...NORTH_EAST_STUDY, ...SOUTH_WEST_STUDY, center: CENTER_STUDY };

const groups = [
  ["facet", "Kultivace aspektu", "Cultivating the facet"],
  ["protector", "Setkání se subosobnostmi", "Meeting the subpersonalities"],
  ["method", "Čtyři společné metody", "Four methods for all directions"],
  ["application", "V běžném životě", "In everyday life"],
];

function PracticeCard({ practice, L }) {
  const copy = L(practice.cz, practice.en);
  return (
    <details className="tm-aspect-practice">
      <summary>{copy.title}</summary>
      <div className="tm-aspect-practice-body">
        <p>{copy.when}</p>
        <ol>{copy.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <p><em>{copy.reflect}</em></p>
        {practice.kind === "adaptation" && (
          <small>{L("Cvičení vytvořené pro aplikaci", "Exercise created for this app")}</small>
        )}
      </div>
    </details>
  );
}

export function MandalaPracticeGuide({ aspect, L }) {
  const study = studies[aspect];
  return (
    <div className="tm-aspect-practices">
      <p>{L(study.reading.cz, study.reading.en)}</p>
      {groups.map(([id, cz, en]) => {
        const practices = study.practices.filter(practice => practice.group === id);
        if (!practices.length) return null;
        return (
          <React.Fragment key={id}>
            <h3 className="tm-aspect-practice-group-title">{L(cz, en)}</h3>
            {practices.map(practice => (
              <PracticeCard key={practice.id} practice={practice} L={L} />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}
