import React,{useId,useState} from "react";
import {ASTRO_PLANETS,ASTRO_ASPECTS} from "../product/togetherAstrologyEditorial.js";
import {CLASSICAL_BODIES} from "../product/togetherAstrology.js";
import {tithiQuality} from "../product/togetherAstrologyOverviewEditorial.js";
import {MOON_NAMES} from "../product/togetherMoon.js";

export function skyLeadAspect(sky){
  return [...sky.aspects].filter(a=>sky.lens==="western"||(CLASSICAL_BODIES.includes(a.a)&&CLASSICAL_BODIES.includes(a.b))).filter(a=>["Sun","Moon","Mercury","Venus","Mars"].includes(a.a)||["Sun","Moon","Mercury","Venus","Mars"].includes(a.b)).sort((a,b)=>a.orb-b.orb)[0];
}
export function SkyExplore({lang="cs",panels,initial="now"}){
  const id=useId(),[view,setView]=useState(initial),active=panels.find(p=>p.id===view)||panels[0],index=panels.indexOf(active);
  const choose=(event,i)=>{
    let next;if(event.key==="ArrowRight")next=(i+1)%panels.length;else if(event.key==="ArrowLeft")next=(i+panels.length-1)%panels.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=panels.length-1;else return;
    event.preventDefault();setView(panels[next].id);document.getElementById(`${id}-tab-${panels[next].id}`)?.focus();
  };
  return <div className="sky-explore"><div className="sky-explore-tabs" role="tablist" aria-label={lang==="en"?"Explore the meaning":"Prozkoumat význam"} style={{"--sky-layer-index":index,"--sky-layer-count":panels.length}}>{panels.map((panel,i)=><button type="button" role="tab" key={panel.id} id={`${id}-tab-${panel.id}`} aria-selected={active.id===panel.id} aria-controls={`${id}-panel-${panel.id}`} tabIndex={active.id===panel.id?0:-1} onClick={()=>setView(panel.id)} onKeyDown={event=>choose(event,i)}>{panel.title}</button>)}</div>
    {panels.map(panel=><section key={panel.id} role="tabpanel" tabIndex={0} id={`${id}-panel-${panel.id}`} aria-labelledby={`${id}-tab-${panel.id}`} hidden={panel.id!==active.id} className="sky-explore-panel">{panel.content}</section>)}
  </div>;
}

const ACTIONS={
  conjunction:[["Rozliš dvě potřeby","Name two needs"],["Napiš dvě věci, které se v jedné situaci potkávají. Dej každé vlastní větu.","Write down two things meeting in one situation. Give each its own sentence."],["Než začneš jednat, vyber jeden malý krok, který bere obě potřeby vážně.","Before acting, choose a small step that takes both needs seriously."]],
  sextile:[["Otevři jednu možnost","Open one possibility"],["Udělej první malý krok k možnosti, která už je dostupná: zprávu, otázku nebo deset minut práce.","Take one small step towards an available possibility: a message, a question or ten minutes of work."],["Připrav si konkrétní čas a člověka nebo pomůcku, které k tomu potřebuješ.","Choose a specific time and the person or tool you need."]],
  square:[["Dej napětí jasný tvar","Give tension a clear shape"],["Pojmenuj dvě protichůdné potřeby. Vyber vratný krok, který si můžeš nejdřív vyzkoušet.","Name two competing needs. Choose a reversible step that you can try first."],["Před náročným rozhovorem si napiš, co potřebuješ, a jednu otázku pro druhého.","Before a difficult conversation, write down what you need and one question for the other person."]],
  trine:[["Použij to, co už funguje","Use what already works"],["Věnuj deset minut něčemu, co ti jde přirozeně a má pro dnešek smysl.","Give ten minutes to something that comes naturally and matters today."],["Připrav si jeden konkrétní výsledek. Snadný začátek může také potřebovat konec.","Choose one concrete outcome. An easy beginning may still need an ending."]],
  opposition:[["Podívej se z obou stran","Look from both sides"],["Napiš svůj pohled a zkus poctivě popsat i opačný. Pak zvol jednu domluvu, kterou lze ověřit.","Write your view and honestly describe the opposite one. Then choose one agreement you can check."],["V rozhovoru nech místo pro odpověď. Rozdíl nemusí zmizet, aby šlo udělat další krok.","Leave room for an answer. A difference need not disappear before taking a next step."]],
  Sun:[["Vyber dnešní směr","Choose today's direction"],["Vyber jednu důležitou věc a dej jí deset nerušených minut.","Choose one important thing and give it ten uninterrupted minutes."],["Odlož jednu vedlejší činnost, aby měl hlavní krok místo.","Put aside one secondary task to make room for the main step."]],
  Moon:[["Všimni si potřeby","Notice a need"],["Zastav se a pojmenuj, co právě potřebuješ. Vyber jednu dostupnou podobu péče.","Pause and name what you need. Choose one available form of care."],["Než uděláš další plán, ověř si, kolik času a sil opravdu máš.","Before making another plan, check the time and capacity you actually have."]],
  Mercury:[["Ujasni jednu domluvu","Clarify one agreement"],["Vyber jednu nedořečenou domluvu. Polož přesnou otázku a ověř, že si rozumíte.","Choose one unfinished agreement. Ask a precise question and check that you understand each other."],["Před odesláním si zprávu jednou přečti očima příjemce.","Before sending, read the message once from the recipient's perspective."]],
  Venus:[["Dej hodnotě konkrétní podobu","Give value a concrete form"],["Věnuj jednu malou pozornost vztahu nebo věci, na které ti záleží.","Give one small act of attention to a relationship or something you value."],["Vyber gesto, které můžeš udělat svobodně, bez očekávané protislužby.","Choose a gesture you can make freely, without expecting a return."]],
  Mars:[["Udělej první krok","Take the first step"],["Zvol jeden jasný, přiměřený krok. Začni tím, co můžeš udělat bezpečně už dnes.","Choose one clear, proportionate step. Start with what you can safely do today."],["Urči si hranici: kdy je pro dnešek dost a co může počkat.","Set a boundary: what is enough for today, and what can wait."]],
  Jupiter:[["Rozšiř pohled","Widen the view"],["Přečti jednu dobrou stránku nebo se zeptej někoho s jinou zkušeností.","Read one worthwhile page or ask someone with a different experience."],["Připrav si otázku, na kterou zatím nemáš odpověď.","Prepare a question you cannot yet answer."]],
  Saturn:[["Podepři jeden závazek","Support one commitment"],["Vyber jeden malý závazek a udělej jeho dnešní část.","Choose one small commitment and do today's part."],["Dej mu realistický časový rámec a odlož zbytečný nárok na dokonalost.","Give it a realistic time frame and set aside unnecessary perfection."]],
};
const TITHI_ACTIONS=[ACTIONS.Venus,ACTIONS.Jupiter,ACTIONS.Mars,ACTIONS.Saturn,ACTIONS.trine];
export function skyOrientation(sky,details,lang="cs"){
  const L=(cs,en)=>lang==="en"?en:cs,name=id=>ASTRO_PLANETS[id]?L(...ASTRO_PLANETS[id].name):id,lead=skyLeadAspect(sky);
  if(sky.lens==="jyotish"&&details?.panchanga){const p=details.panchanga,q=tithiQuality(p.tithi);return {title:L(...q.title),fact:`${p.tithi}. tithi · ${p.tithiName}`,meaning:L(...q.text),action:TITHI_ACTIONS[(p.tithi-1)%5],help:"N04"};}
  if(sky.lens==="hellenistic"&&details?.planetaryHours?.dayPlanet){const ruler=details.planetaryHours.dayPlanet;return {title:L(...ASTRO_PLANETS[ruler].theme),fact:`${L("Planeta dne","Day ruler")} · ${name(ruler)}`,meaning:L(...ASTRO_PLANETS[ruler].text),action:ACTIONS[ruler],planet:ruler,help:"N06"};}
  if(lead)return {title:L(...ASTRO_ASPECTS[lead.id].name),fact:`${name(lead.a)} · ${name(lead.b)} · ${lead.angle}°`,meaning:L(...ASTRO_ASPECTS[lead.id].text),action:ACTIONS[lead.id],lead,help:"D03"};
  return {title:L(...MOON_NAMES[sky.moon.index]),fact:`${sky.moon.light} % ${L("světla Luny","Moon illumination")}`,meaning:L("Dnešní fáze je výchozí obraz pro pozorování proměny.","Today's phase is a starting image for observing change."),action:ACTIONS.Moon,help:"N03"};
}
export function SkyStep({orientation,lang="cs",onPlan,day,children}){
  const L=(cs,en)=>lang==="en"?en:cs,[prepare,setPrepare]=useState(false),action=orientation.action||ACTIONS.Moon;
  return <div className="sky-one-step"><p className="sky-small">{L("Podnět aplikace inspirovaný symbolickým čtením","An app prompt inspired by the symbolic reading")} · {orientation.fact}</p><h3>{L(...action[0])}</h3><p className="sky-step-text">{L(...action[1])}</p><button type="button" className="sky-quiet" aria-expanded={prepare} onClick={()=>setPrepare(value=>!value)}>{L("Jak se připravit","How to prepare")} <span aria-hidden="true">{prepare?"−":"+"}</span></button>{prepare&&<p className="sky-step-preparation">{L(...action[2])}</p>}
    {onPlan&&<div className="sky-actions"><button type="button" onClick={()=>onPlan({title:L(...action[0]),date:day,minutes:10,note:L(...action[1])})}>{L("Vzít do společného plánu","Bring into a shared plan")}</button></div>}{children}
  </div>;
}
export function SkyNote({storageKey,title,journal,update,ready,lang="cs",saveLabel,placeholder}){
  const L=(cs,en)=>lang==="en"?en:cs,id=useId(),stored=journal.intentions?.[storageKey],saved=typeof stored==="string"?stored:stored?.text||"";
  const [drafts,setDrafts]=useState({}),[messages,setMessages]=useState({}),draft=drafts[storageKey],value=draft?.text??saved,conflict=draft&&draft.base!==saved;
  const save=()=>{
    if(!ready||typeof update!=="function"||conflict)return;
    const text=value.trim(),base=draft?.base??saved;
    const ok=update(doc=>{const prior=doc.intentions?.[storageKey],priorText=typeof prior==="string"?prior:prior?.text||"";if(priorText!==base)throw new Error("journal-conflict");return {...doc,intentions:{...doc.intentions,[storageKey]:{text,time:Date.now(),timeZone:doc.settings.location.timeZone}}};});
    if(ok){setDrafts(all=>({...all,[storageKey]:{text,base:text}}));setMessages(all=>({...all,[storageKey]:L("Uloženo jen do tvých zápisů.","Saved to your private records.")}));}
    else setMessages(all=>({...all,[storageKey]:L("Uložení se nepodařilo. Rozepsaný text zůstává.","Could not save. Your draft remains.")}));
  };
  return <div className="sky-intention"><label htmlFor={id}>{title}</label><textarea id={id} rows={3} maxLength={2000} value={value} readOnly={!ready||typeof update!=="function"} onChange={event=>{setDrafts(all=>({...all,[storageKey]:{text:event.target.value,base:draft?.base??saved}}));setMessages(all=>({...all,[storageKey]:""}));}} placeholder={placeholder||L("Jeden vlastní krok…","One step of my own…")}/>{conflict&&<><p role="alert" className="sky-small">{L("Uložený zápis se změnil v jiné kartě. Tvůj rozepsaný text zůstává; nic se nepřepsalo.","The saved note changed in another tab. Your draft remains; nothing was overwritten.")}</p><details open><summary>{L("Porovnat uložený zápis","Compare the saved note")}</summary><p style={{whiteSpace:"pre-wrap"}}>{saved||L("Uložený zápis je prázdný.","The saved note is empty.")}</p><div className="sky-actions"><button type="button" disabled={!ready} onClick={()=>{setDrafts(all=>({...all,[storageKey]:{...all[storageKey],base:saved}}));setMessages(all=>({...all,[storageKey]:L("Rozepsaný text zůstává. Zapíše se až tlačítkem Uložit.","Your draft remains. Only Save will write it to your records.")}));}}>{L("Ponechat rozepsaný text","Keep my draft")}</button><button type="button" disabled={!ready} onClick={()=>{setDrafts(all=>({...all,[storageKey]:{text:saved,base:saved}}));setMessages(all=>({...all,[storageKey]:L("Načten aktuálně uložený text.","Loaded the currently saved text.")}));}}>{L("Použít uložený text","Use the saved text")}</button></div></details></>}<button type="button" onClick={save} disabled={!ready||typeof update!=="function"||value===saved||Boolean(conflict)}>{saveLabel||L("Uložit vlastní krok","Save my step")}</button>{messages[storageKey]&&<p role="status" className="sky-small">{messages[storageKey]}</p>}</div>;
}
