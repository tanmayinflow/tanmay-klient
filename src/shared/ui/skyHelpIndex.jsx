import React from "react";
import {SKY_HELP} from "../product/skyHelp.js";
import {SKY_HELP_GROUPS,SKY_HELP_EN_TITLES} from "../product/skyHelpNavigation.js";

export function SkyHelpIndex({lang="cs"}){
  const en=lang==="en",language=en?"en":"cs";
  return <details className="sky-help-index"><summary>{en?"All Sky explanations · in depth":"Všechna vysvětlení Oblohy · podrobně"}</summary>
    {SKY_HELP_GROUPS.map(group=><details key={group.prefix}><summary>{group.name[en?1:0]}</summary>{Object.entries(SKY_HELP).filter(([id])=>id.startsWith(group.prefix)).map(([id,entry])=><details key={id}><summary>{en?SKY_HELP_EN_TITLES[id]||entry.title:entry.title}</summary>{entry[language].map((sentence,index)=><p key={index}>{sentence}</p>)}</details>)}</details>)}
  </details>;
}
