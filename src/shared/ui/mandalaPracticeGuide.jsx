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

function PracticeCard({ practice, source, L }) {
  const copy = L(practice.cz, practice.en);
  return (
    <details className="tm-aspect-practice">
      <summary>{copy.title}</summary>
      <div className="tm-aspect-practice-body">
        <p>{copy.when}</p>
        <ol>{copy.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <p><em>{copy.reflect}</em></p>
        <p className="tm-aspect-practice-source">
          {practice.kind === "method"
            ? L("Stručné zpracování metody z pramene.", "A short adaptation of a method from the source.")
            : L("Vlastní cvičení aplikace inspirované pramenem.", "An exercise written for this app, inspired by the source.")}
          {" "}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
        </p>
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
              <PracticeCard key={practice.id} practice={practice}
                source={study.sources.find(source => source.id === practice.source)} L={L} />
            ))}
          </React.Fragment>
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
