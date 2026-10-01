import React,{useId} from 'react';
import {TogetherArtwork} from './togetherArtwork.jsx';

const pair=(cs,en)=>[cs,en];
export const CYCLE_ANATOMY_REGIONS=[
  {id:'lining',name:pair('Děložní sliznice','Uterine lining'),phases:{
    menstrual:pair('Povrchová vrstva se při menstruaci odlučuje.','The surface lining sheds during menstruation.'),
    follicular:pair('Po krvácení se sliznice pod vlivem estrogenu obnovuje.','After bleeding, estrogen supports the rebuilding of the lining.'),
    ovulatory:pair('Kolem ovulace je sliznice v období růstu.','Around ovulation, the lining is in its growth phase.'),
    luteal:pair('Progesteron podporuje sekreční změny. Sliznice začne uvolňovat výživné látky.','Progesterone supports secretory changes. The lining starts releasing nutrients.'),
  }},
  {id:'ovary',name:pair('Vaječník','Ovary'),phases:{
    menstrual:pair('Ve vaječníku už začíná růst další skupina folikulů, váčků s vajíčky.','Another group of follicles, sacs containing eggs, is beginning to grow.'),
    follicular:pair('Ve folikulu, váčku s vajíčkem, probíhá dozrávání.','Maturation takes place in a follicle, a sac containing an egg.'),
    ovulatory:pair('Ovulace znamená uvolnění vajíčka z folikulu.','Ovulation means the release of an egg from its follicle.'),
    luteal:pair('Z prasklého folikulu vzniká žluté tělísko, které tvoří progesteron.','The ruptured follicle becomes the corpus luteum, which makes progesterone.'),
  }},
  {id:'cervix',name:pair('Děložní hrdlo','Cervix'),phases:{
    menstrual:pair('Krvácení prochází kanálkem hrdla do pochvy.','Menstrual blood passes through the cervical canal into the vagina.'),
    follicular:pair('S rostoucím estrogenem může hlen postupně řídnout.','As estrogen rises, cervical mucus can gradually become thinner.'),
    ovulatory:pair('Hlen bývá řidší a tažný. Jeho vzhled sám ovulaci nepotvrzuje.','Mucus is often thinner and stretchy. Its appearance alone does not confirm ovulation.'),
    luteal:pair('Po ovulaci hlen obvykle houstne.','After ovulation, cervical mucus usually becomes thicker.'),
  }},
];

// One general anterior cutaway in every phase. Highlights locate structures;
// they never simulate a measured lining, an active ovary or a personal cycle.
export function UterusPlate({selected=null}){
  return <g className="tg-cycle-anatomy">
    <TogetherArtwork kind="uterus" x={-130} y={-95} width={260} height={190}/>
    {selected&&<svg x="-130" y="-95" width="260" height="190" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid meet" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      {selected==='lining'&&<path d="M563 235Q764 319 969 235Q850 350 800 525L777 613M563 235Q682 349 736 525L754 613" opacity=".75"/>}
      {selected==='ovary'&&<ellipse cx="1233" cy="377" rx="105" ry="73" transform="rotate(-16 1233 377)" opacity=".8"/>}
      {selected==='cervix'&&<ellipse cx="766" cy="601" rx="108" ry="89" opacity=".8"/>}
    </svg>}
  </g>;
}

export function CycleAnatomyDetail({phase,selected='lining',onSelect,lang='cs'}){
  const L=v=>v[lang==='en'?1:0],id=useId(),region=CYCLE_ANATOMY_REGIONS.find(item=>item.id===selected)||CYCLE_ANATOMY_REGIONS[0],text=region.phases[phase];
  return <section className="tg-cycle-anatomy-detail" aria-label={L(pair('Prohlédnout anatomii','Explore the anatomy'))}>
    <div className="tg-cycle-anatomy-choices" role="group" aria-label={L(pair('Vyber část anatomie','Choose an anatomical structure'))}>
      {CYCLE_ANATOMY_REGIONS.map(item=><button type="button" key={item.id} aria-pressed={item.id===region.id} aria-controls={id} onClick={()=>onSelect(item.id)}>{L(item.name)}</button>)}
    </div>
    <p id={id} className="tg-cycle-anatomy-explanation" aria-live="polite"><strong>{L(region.name)}.</strong>{' '}{text?L(text):L(pair('Vyber fázi a prohlédni si její obecné souvislosti.','Choose a phase to explore its general context.'))}</p>
    <p className="tg-cycle-anatomy-caption">{L(pair('Atlasová kresba obecné anatomie','Atlas illustration of general anatomy'))}</p>
  </section>;
}

export const cycleAnatomyStyles=`
.tm-together .tg-cycle-anatomy-detail{margin:8px 0 24px;color:var(--tg-text)}
.tm-together .tg-cycle-anatomy-choices{display:flex;flex-wrap:wrap;gap:4px 18px}
.tm-together .tg-cycle-anatomy-choices button{background:transparent;border:0;border-bottom:1px solid transparent;border-radius:0;padding:8px 0;min-height:44px;color:var(--tg-text);font:15px/1.35 var(--tm-font-body);cursor:pointer}
.tm-together .tg-cycle-anatomy-choices button[aria-pressed=true]{color:var(--tg-accent);border-bottom-color:currentColor}
.tm-together .tg-cycle-anatomy-choices button:focus-visible{outline:2px solid var(--tg-accent);outline-offset:4px}
.tm-together .tg-cycle-anatomy-explanation{font:15px/1.6 var(--tm-font-body);margin:14px 0 8px;max-width:50ch}
.tm-together .tg-cycle-anatomy-explanation strong{font-weight:500}
.tm-together .tg-cycle-anatomy-caption{font:12px/1.5 var(--tm-font-body);color:var(--tg-muted);margin:0}
`;
