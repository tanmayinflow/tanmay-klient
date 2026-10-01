import React,{useMemo,useState} from 'react';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,cycleHormoneSchematic} from '../product/togetherCycleDepth.js';
import {TogetherArtwork} from './togetherArtwork.jsx';
import {UterusPlate,CycleAnatomyDetail,cycleAnatomyStyles} from './togetherCycleAnatomy.jsx';

const phasePoints=[[82,69],[298,69],[298,247],[82,247]];
const radial=(count)=>Array.from({length:count},(_,i)=>{const a=(-90+i*360/count)*Math.PI/180;return [190+Math.cos(a)*139,177+Math.sin(a)*139];});
const bodyPoints=[[72,53],[308,53],[190,310]];
const spiral=Array.from({length:181},(_,i)=>{const f=i/180,a=f*Math.PI*4.6-1.6,r=5+f*77;return `${i?'L':'M'}${(Math.cos(a)*r).toFixed(2)},${(Math.sin(a)*r*.74).toFixed(2)}`;}).join(' ');

export function CycleGlyph({kind}){
  const paths={
    menstrual:'M0-10C-4-4-8 1-8 5a8 8 0 0 0 16 0c0-4-4-9-8-15ZM-4 4c-1 3 1 5 3 6',
    follicular:'M0 12V0m0 4C-10 3-12-3-11-8 0-8 1-2 0 4Zm0-2C9 1 12-6 10-11 1-10-1-4 0 2Z',
    ovulatory:'M0-14v4m0 20v4M-14 0h4m20 0h4M-10-10l3 3m14 14 3 3M-10 10l3-3M7-7l3-3',
    luteal:'M-10 10C-12-4 0-12 11-10 12 4 1 13-10 10ZM-10 10 6-6M-3 3h7M0 0v-6',
    move:'M-12 9Q0-11 12 5M-11 13Q0-7 12 9M-5-8l5-4 5 4',
    food:'M-12 0Q-9 13 0 13T12 0ZM-5-12q-4 3 0 6m6-6q-4 3 0 6',
    mind:'M-10 4q-3-16 9-16 12 0 9 13l-5 2v10H-5V6M-3-4q4-5 7 0',
    pattern:'M-10 4q-3-16 9-16 12 0 9 13l-5 2v10H-5V6M-3-4q4-5 7 0',
    plan:'M-10-9H10V12H-10ZM-6-13v8M6-13v8M-10-2H10M-5 4h3m4 0h3',
    bond:'M0 10C-22-3-6-18 0-7 6-18 22-3 0 10Z',
    shared:'M-13 0h10v7q-5 7-10 0ZM3 0h10v7q-5 7-10 0ZM-9-10q-3 3 0 6m17-6q-3 3 0 6',
    hormones:'M-13 9Q-7 9-4-9T2 9M-12 8Q1 10 6-5T12 8',
    uterus:'M-13-5Q-10-13-4-6Q0-2 4-6Q10-13 13-5M-6-4Q-6 3-2 7V12H2V7Q6 3 6-4',
    archetype:'M0-13C-17 3-12 13 0 8 12 13 17 3 0-13ZM0-7V13',
    shadow:'M-11 12V-2a11 11 0 0 1 22 0v14ZM0-13v25',
    story:'M0-8Q-5-13-13-10V10Q-5 7 0 12 5 7 13 10V-10Q5-13 0-8ZM0-8v20',
    ritual:'M0-13C-10-4-6 5 0 7 7 4 10-4 0-13ZM-13 9q13 13 26 0',
    spiral:'M-1 1c-5-4 2-8 6-3s-2 14-9 10-9-15 0-19 18 3 16 13'
  };
  return <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]||paths.follicular}/>{kind==='ovulatory'&&<circle r="6"/>}</g>;
}

// Botanical plates share the fine, engraved ink of the room illustrations.
// Their seasons are symbolic; the image does not describe phase duration.
function SeasonPlate({phase}){
  return <g className="tg-cycle-botanical"><TogetherArtwork kind={`botanical-${phase}`}/></g>;
}

function DetailPlate({kind,phase,selected}){
  if(kind==='uterus')return <UterusPlate selected={selected}/>;
  if(kind==='archetype'||kind==='overview')return <SeasonPlate phase={phase}/>;
  return <TogetherArtwork kind={kind}/>;
}

function HormonePlate({shown,visible,explained,lang}){
  const data=useMemo(()=>cycleHormoneSchematic(),[]),L=v=>v[lang==='en'?1:0];
  const [from,to]=({menstrual:[0,.18],follicular:[.18,.45],ovulatory:[.45,.54],luteal:[.54,1]})[shown];
  return <g transform="translate(-114 -60)">
    <rect x={from*228} y="0" width={(to-from)*228} height="118" fill="currentColor" opacity=".06"/>
    <path d="M0 0V118H228M0 60H228" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".3"/>
    {CYCLE_HORMONES.filter(h=>visible.includes(h.id)).map(h=><path key={h.id} d={data.map((r,i)=>`${i?'L':'M'}${r.x*228},${113-r[h.id]*104}`).join(' ')} fill="none" stroke="currentColor" strokeWidth={h.id===explained?2:1.1} strokeDasharray={h.dash} opacity={h.id===explained?1:.7}/>) }
    <g className="tg-cycle-chart-words" fill="currentColor"><text y="138">{L(['Začátek','Start'])}</text><text x="228" y="138" textAnchor="end">{L(['Další cyklus','Next cycle'])}</text></g>
  </g>;
}

export function CycleMap({shown,current,focused,layer,topic,topics,lang,onPhase,onTopic,onFocus,onBack,visibleHormones,explainedHormone}){
  const [anatomyRegion,setAnatomyRegion]=useState('lining'),L=v=>v[lang==='en'?1:0];
  const branches=topics.filter(item=>item.id!=='overview'),points=layer==='body'?bodyPoints:radial(branches.length);
  const origin=points[branches.findIndex(item=>item.id===topic)]||[190,178];
  const isChart=focused&&layer==='body'&&topic==='hormones';
  const mainKind=layer==='body'?(topic==='overview'?'uterus':topic):topic;
  const isAnatomy=focused&&layer==='body'&&mainKind==='uterus';
  const showBotanical=focused&&layer!=='body'&&(topic==='overview'||topic==='archetype');
  return <><div className={`tg-cycle-atlas${focused?' is-focused':''}`} data-layer={layer} data-topic={topic}>
    <svg className="tg-cycle-atlas-art" viewBox="0 0 380 356" role="img" aria-label={isAnatomy?L(['Obecná anatomická kresba dělohy, vejcovodů, vaječníků a hrdla.','General anatomical drawing of the uterus, fallopian tubes, ovaries and cervix.']):focused?L(['Prostorová mapa vybrané fáze. Témata otevřeš tlačítky kolem obrazu.','A spatial map of the selected phase. Open topics with the buttons around the image.']):L(['Čtyři krajiny cyklu spojené jednou spirálou. Velikost nevyjadřuje délku fází.','Four cycle landscapes joined by one spiral. Size does not represent phase duration.'])}>
      {CYCLE_ORDER.map((id,i)=>{const [x,y]=phasePoints[i],selected=shown===id;return <g key={id} className="tg-cycle-phase-landscape" style={{transform:focused&&selected?'translate(190px,180px) scale(.91)':`translate(${x}px,${y-8}px) scale(.60)`,opacity:focused?(selected&&showBotanical?1:0):selected?1:.82}}><SeasonPlate phase={id}/></g>;})}
      <g className="tg-cycle-center-spiral" style={{opacity:focused?0:.8,transform:focused?'translate(190px,180px) scale(.2)':'translate(190px,176px) scale(.47)'}}><path d={spiral} fill="none" stroke="currentColor" strokeWidth="1.2"/><circle r="4" fill="currentColor"/></g>
      {focused&&!showBotanical&&shown&&<g key={`${shown}-${layer}-${topic}`} className="tg-cycle-detail-arrival" style={{transformOrigin:'190px 180px','--cycle-origin-x':`${(origin[0]-190)*.4}px`,'--cycle-origin-y':`${(origin[1]-178)*.4}px`}}><g transform="translate(190 178)" className="tg-cycle-detail-plate">{isChart?<HormonePlate shown={shown} visible={visibleHormones} explained={explainedHormone} lang={lang}/>:<DetailPlate kind={mainKind} phase={shown} selected={isAnatomy&&topic==='uterus'?anatomyRegion:null}/>}</g></g>}
    </svg>
    {!focused?CYCLE_ORDER.map((id,i)=><button key={id} type="button" className={`tg-cycle-world-button phase-choice${shown===id?' is-selected':''}`} style={{left:`${phasePoints[i][0]/3.8}%`,top:`${(phasePoints[i][1]+66)/3.56}%`}} aria-pressed={shown===id} onClick={()=>onPhase(id)}><span className="tg-cycle-world-label">{L(CYCLE_DEPTH[id].short)}</span>{id===current&&<span className="tg-cycle-current-dot" aria-label={L(['Fáze vybraného dne','Selected day’s phase'])}/>}</button>):branches.map((item,i)=><button key={item.id} type="button" className={`tg-cycle-world-button topic-choice${topic===item.id?' is-selected':''}`} style={{left:`${points[i][0]/3.8}%`,top:`${points[i][1]/3.56}%`}} aria-pressed={topic===item.id} onClick={()=>onTopic(item.id)}><svg viewBox="-18 -18 36 36" aria-hidden="true"><CycleGlyph kind={item.id}/></svg><span className="tg-cycle-world-label">{L(item.label)}</span></button>)}
    {focused&&topic!=='overview'&&<button type="button" className="tg-cycle-map-center-back" onClick={()=>onTopic('overview')} aria-label={L(['Zpět k souvislostem fáze','Back to the phase overview'])}>‹</button>}
    {!focused&&shown&&<button type="button" className="tg-cycle-map-enter" onClick={onFocus}>{L(['Otevřít fázi','Open phase'])}<span aria-hidden="true"> →</span></button>}
    {focused&&<button type="button" className="tg-cycle-map-return" onClick={onBack}>{L(['Celý cyklus','Whole cycle'])}</button>}
  </div>{isAnatomy&&topic==='uterus'&&<CycleAnatomyDetail phase={shown} selected={anatomyRegion} onSelect={setAnatomyRegion} lang={lang}/>}</>;
}

export const cycleMapStyles=cycleAnatomyStyles+`
.tm-together .tg-cycle-atlas{position:relative;isolation:isolate;width:100%;max-width:460px;aspect-ratio:380/356;margin:4px auto 12px;color:var(--tg-accent)}
.tm-together .tg-cycle-atlas-art{display:block;width:100%;height:100%;overflow:visible}
.tg-cycle-phase-landscape,.tg-cycle-center-spiral{transition:transform 650ms cubic-bezier(.16,1,.3,1),opacity 240ms ease}
.tg-cycle-leaf{transition:transform 600ms cubic-bezier(.16,1,.3,1),opacity 350ms ease}
.tg-cycle-detail-arrival{animation:cycle-branch-open 480ms cubic-bezier(.16,1,.3,1) both}
@keyframes cycle-branch-open{from{opacity:.2;transform:translate(var(--cycle-origin-x,0px),var(--cycle-origin-y,0px)) scale(.55)}to{opacity:1;transform:translate(0,0) scale(1)}}
.tm-together .tg-cycle-world-button{position:absolute;translate:-50% -50%;border:0;border-radius:0;background:none;padding:6px 2px;min-height:48px;width:88px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--tg-text);font:13px/1.25 var(--tm-font-body);cursor:pointer}
.tm-together .tg-cycle-world-button.phase-choice{width:126px;min-height:60px;font:18px/1.1 var(--tm-font-display);padding:12px 6px}
.tm-together .tg-cycle-world-button .tg-cycle-world-label{background:transparent;padding:1px 3px}
.tm-together .tg-cycle-world-button.phase-choice .tg-cycle-world-label{max-width:117px}
.tm-together .tg-cycle-world-button>svg{width:32px;height:32px;background:transparent;border:1px solid var(--tg-soft);border-radius:50%;padding:5px;box-sizing:content-box;transition:border-color 120ms ease}
.tm-together .tg-cycle-world-button.is-selected{color:var(--tg-accent)}
.tm-together .tg-cycle-world-button.is-selected>svg{border-color:var(--tg-accent);outline:1px solid var(--tg-accent);outline-offset:3px}
.tm-together .tg-cycle-world-button:hover .tg-cycle-world-label{text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-world-button:focus-visible{outline:2px solid var(--tg-accent);outline-offset:3px;border-radius:6px}
.tg-cycle-current-dot{height:4px;width:4px;background:currentColor;border-radius:50%;margin-top:5px}
.tm-together .tg-cycle-map-enter,.tm-together .tg-cycle-map-return,.tm-together .tg-cycle-map-center-back{position:absolute;border:0;background:transparent;border-radius:0;font:12px/1.2 var(--tm-font-tag);letter-spacing:.04em;padding:9px;min-height:36px;color:var(--tg-accent)}
.tm-together .tg-cycle-map-enter{left:50%;top:57%;translate:-50% 0;white-space:nowrap}
.tm-together .tg-cycle-map-return{left:0;bottom:-5px;padding-left:0;text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-map-center-back{right:0;bottom:-5px;font-size:24px;min-width:44px}
.tg-cycle-chart-words{font:11px var(--tm-font-tag)}
@media(prefers-reduced-motion:reduce){.tg-cycle-phase-landscape,.tg-cycle-center-spiral,.tg-cycle-leaf{transition:opacity 120ms ease}.tg-cycle-detail-arrival{animation:none}}
`;
