import React,{useId,useMemo} from 'react';
import {CYCLE_ORDER,CYCLE_DEPTH,CYCLE_HORMONES,cycleHormoneSchematic} from '../product/togetherCycleDepth.js';

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

// An authored botanical plate: the same roots and stem remain present through
// the four seasons. It is a metaphor, never a diagram of phase duration.
function SeasonPlate({phase,hatch}){
  const phaseIndex=CYCLE_ORDER.indexOf(phase),leafCount=[1,9,14,6][phaseIndex];
  return <g className="tg-cycle-botanical" fill="none" stroke="currentColor" strokeWidth=".85" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cy="54" rx="75" ry="21" opacity=".24"/><ellipse cy="56" rx="61" ry="14" opacity=".2"/>
    <path d="M-59 54Q-31 46 0 54T60 54M-44 61Q0 69 44 61" opacity=".4"/>
    <path d="M0 55C-8 27 10-4 0-52M0 43C-19 31-21 9-41 4M2 23C21 18 23-6 43-12M1-3C-14-11-17-27-29-30M1-23C14-32 15-43 25-49"/>
    <g opacity=".53"><path d="M0 55C-1 73-20 63-27 80M0 55C7 67 30 66 40 78M1 60C-8 75 9 76 11 90M-10 67l-13 1m-5 9-13 2M17 68l5 11m9-4 14-4M2 76l-8 7"/></g>
    {Array.from({length:14},(_,i)=>{const side=i%2?-1:1,y=42-i*6.1,x=side*(8+(i%3)*9),r=side*(i%2?28:45);return <g key={i} className="tg-cycle-leaf" style={{opacity:i<leafCount?1:.08,transform:`translate(${x}px,${y}px) rotate(${r}deg)`}}><path d="M0 0C-5-12 1-20 6-23 12-15 10-6 0 0Z" fill={`url(#${hatch})`}/><path d="M0 0 6-23M2-7l6-4M4-13l-4-4"/></g>;})}
    {phase==='menstrual'&&<><path d="M0-56C-14-72-16-85 0-96 16-85 14-72 0-56Z" fill={`url(#${hatch})`}/><path d="M0-58V-88M-7-80l7 9 7-9"/><path d="M-58-66a18 18 0 0 0 22-26 20 20 0 1 1-22 26Z" opacity=".65"/></>}
    {phase==='follicular'&&<><path d="M0-51C-19-58-13-80 0-76 13-80 19-58 0-51Z"/><path d="M0-55v-17M-4-71l4 7 4-7"/><path d="M38-72q12-9 23-3M49-84v-6" opacity=".55"/></>}
    {phase==='ovulatory'&&<g transform="translate(0 -65)">{Array.from({length:10},(_,i)=><path key={i} d="M0-4C-13-14-8-29 0-29 8-29 13-14 0-4Z" transform={`rotate(${i*36})`} fill={`url(#${hatch})`}/>)}<circle r="9"/><circle r="5" strokeDasharray="1 2"/></g>}
    {phase==='luteal'&&<><path d="M-6-56C-14-72-6-87 1-88 8-75 11-65-6-56Z" fill={`url(#${hatch})`}/><path d="M-6-56 1-85"/>{[-1,1].map((s)=><g key={s} transform={`translate(${s*57} ${s===1?9:-35}) rotate(${s*35})`}><path d="M0 0C-10-14-5-23 3-26 11-15 10-3 0 0Z"/><path d="M0 0 3-23"/></g>)}<path d="M-53-82Q-8-101 53-81" opacity=".5"/></>}
    <g opacity=".35"><path d="M-74 26l8-2m5-18 5 2M59 36l8 1M-32-69l4-2M59-41l5-3"/><circle cx="-57" cy="-23" r="1.7"/><circle cx="42" cy="-54" r="1.2"/></g>
  </g>;
}

function UterusPlate({phase,hatch}){
  const lining={menstrual:6,follicular:4,ovulatory:7,luteal:10}[phase]||4;
  return <g className="tg-cycle-anatomy" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-16-39C-39-64-64-68-86-49Q-99-34-87-17M16-39C39-64 64-68 86-49Q99-34 87-17" strokeWidth="2"/>
    <path d="M-18-31C-44-51-64-59-77-46M18-31C44-51 64-59 77-46" opacity=".5"/>
    <path d="M-27-42C-37-18-33 6-16 27Q-9 39-9 70M27-42C37-18 33 6 16 27Q9 39 9 70M-27-42Q0-26 27-42" strokeWidth="1.5"/>
    <path d="M-17-29Q0-14 17-29C20-2 11 12 2 28L0 60-2 28C-11 12-20-2-17-29Z" strokeWidth={lining} opacity=".17"/>
    <path d="M-17-29Q0-14 17-29C20-2 11 12 2 28L0 60-2 28C-11 12-20-2-17-29Z" strokeWidth=".9"/>
    {[-1,1].map(s=><g key={s} transform={`translate(${s*77} -20)`}><ellipse rx="14" ry="10" fill={`url(#${hatch})`}/>{[[-5,-2],[3,3],[5,-3]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={phase==='follicular'&&i===1?4:1.7}/>)}<path d={`M${s*8},-11 l${s*5},-5 M${s*11},-7 l${s*6},-6 M${s*13},-2 l${s*7},-3`} opacity=".6"/></g>)}
    {phase==='menstrual'&&<g className="tg-cycle-flow" opacity=".75"><path d="M-4 32l-3 9m10 1 4 10m-5 12-2 9" strokeDasharray="2 3"/><path d="M0 82c-8 10-3 14 0 14s8-4 0-14Z"/></g>}
    {phase==='ovulatory'&&<><circle cx="58" cy="-19" r="4"/><path d="M66-32q-8-7-17-9" strokeDasharray="2 3"/></>}
    {phase==='luteal'&&<circle cx="80" cy="-19" r="6" fill={`url(#${hatch})`}/>}
    <path d="M-105 8Q-69 40-29 56M105 8Q69 40 29 56" opacity=".19"/>
  </g>;
}

function DetailPlate({kind,phase,hatch}){
  const common={fill:'none',stroke:'currentColor',strokeWidth:1,strokeLinecap:'round',strokeLinejoin:'round'};
  if(kind==='uterus')return <UterusPlate phase={phase} hatch={hatch}/>;
  if(kind==='archetype'||kind==='overview')return <SeasonPlate phase={phase} hatch={hatch}/>;
  if(kind==='spiral')return <g {...common}><ellipse cy="33" rx="86" ry="25" opacity=".17"/><path d={spiral} strokeWidth="1.8"/><path d={spiral} transform="translate(0 17)" opacity=".23"/>{[0,1,2,3].map(i=><path key={i} d={`M${-56+i*37} ${-35+i*16}v17`} opacity=".3"/>)}<circle r="3" fill="currentColor"/></g>;
  if(kind==='move')return <g {...common}><path d="M-90 36Q-51-18-5 18T90 16M-85 57Q-36 24 1 38T87 38" opacity=".35"/><path d="M-58 79C66 41-54 17 13-7S68-58 24-87M-43 82C79 48-39 20 24 0S77-63 33-85"/><path d="M-72 5v-33m0 9-9-6m9 1 10-8M72 0v-40m0 15-11-8m11 0 11-10"/><ellipse cx="-8" cy="28" rx="3" ry="6" transform="rotate(-33 -8 28)"/><ellipse cx="5" cy="24" rx="3" ry="6" transform="rotate(-33 5 24)"/></g>;
  if(kind==='food'||kind==='shared')return <g {...common}>{kind==='food'?<><ellipse cy="6" rx="67" ry="16"/><path d="M-67 6Q-60 61 0 64T67 6M-23 63l-5 8h56l-5-8"/><ellipse cy="8" rx="55" ry="10" fill={`url(#${hatch})`}/><path d="M-27-15q-17-19 0-33t0-34M0-18q-16-17 0-29t0-26M28-14q-15-17 0-30" opacity=".65"/></>:<>{[-1,1].map(s=><g key={s} transform={`translate(${s*42} ${s*7})`}><ellipse rx="27" ry="8"/><path d="M-27 0v30q27 27 54 0V0M27 6q25-4 17 19-5 11-17 6M-37 48q36 11 74 0"/><path d="M-8-16q-14-14 0-29M7-13q-11-13 2-31" opacity=".6"/></g>)}</>}<path d="M-91 87Q-20 73 92 82" opacity=".25"/></g>;
  if(kind==='mind'||kind==='pattern')return <g {...common}><path d="M-37 48V27C-69-18-46-77-1-77 30-78 49-57 48-23l15 20-15 6v30H20v39M-24 29q15 14 31 5"/><path d="M-22-22q-19-19-3-34 13-14 30-6 16 7 8 26-7 14-21 8-11-7-3-15 8-5 11 1"/><path d="M-48 77Q1 50 46 77M-42 86Q4 64 53 86" opacity=".55"/><circle cx="31" cy="-21" r="2"/></g>;
  if(kind==='plan')return <g {...common}><path d="M-64-60H56V64H-64ZM-64-29H56M-42-73v25M31-73v25"/><path d="M-40-4h17M-9-4H8M23-4H40M-40 18h17M-9 18H8M23 18H40M-40 40h17M-9 40H8" opacity=".5"/><circle cx="0" cy="17" r="16"/><path d="m-8 17 5 6 12-13M64 63l17-57 6 2-14 58-8 8Z"/><path d="M-79 78Q-17 87 65 80" opacity=".25"/></g>;
  if(kind==='bond')return <g {...common}><path d="M-93 47-56 14q10-11 22-10l22 4q9 2 7 9-2 6-10 5l-18-1M93 47 56 14q-10-11-22-10l-22 4q-9 2-7 9 2 6 10 5l18-1M-87 65l33-18q8-4 16-2l29 10q9 3 7 10-1 7-13 5l-29-8M87 65 54 47q-8-4-16-2L9 55q-9 3-7 10 1 7 13 5l29-8"/><path d="M0-15C-65-48-27-92 0-61 27-92 65-48 0-15Z" fill={`url(#${hatch})`}/><path d="M0-40v8M-6-39l6 6 6-6" opacity=".5"/></g>;
  if(kind==='shadow')return <g {...common}><path d="M-56 82V-21a56 56 0 0 1 112 0V82ZM-40 82V-20a40 40 0 0 1 80 0v102Z"/><path d="M0-60a40 40 0 0 1 40 40V82H0Z" fill={`url(#${hatch})`}/><path d="M-68 82H68M-81 90H81M-93 100H93"/><path d="M-15 11q14-15 29 0-14 13-29 0Z"/><circle cy="10" r="3"/></g>;
  if(kind==='story')return <g {...common}><path d="M0-33Q-37-58-82-39V68Q-34 48 0 75 34 48 82 68V-39Q37-58 0-33ZM0-33V75M-90-35v111Q-37 56 0 83 37 56 90 76V-35"/><path d="M-67 38l18-37 18 37M-49 1v49M21 13q30-18 46 3M22 29q24-11 44 2M22 46q23-7 44 2" opacity=".65"/><path d="M-6-61a16 16 0 0 0 17-23 17 17 0 1 1-17 23Z"/></g>;
  return <g {...common}><path d="M0-83C-49-32-26 7 0 14 28 4 49-31 0-83ZM0-51C-16-26-12-3 0 3 13-6 14-29 0-51Z" fill={`url(#${hatch})`}/><path d="M-87 35l28 17q14 8 29 5l25-7q10-3 13 4 1 7-8 11l-30 10q-20 7-35-2l-22-13M87 35 59 52q-14 8-29 5L5 50M-66 17q67 37 132 0"/><ellipse cy="96" rx="51" ry="9" opacity=".2"/></g>;
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

export function CycleMap({shown,current,focused,layer,topic,topics,lang,onPhase,onTopic,onFocus,onBack,motion,visibleHormones,explainedHormone}){
  const hatch=`cycle-hatch-${useId().replace(/:/g,'')}`,L=v=>v[lang==='en'?1:0];
  const branches=topics.filter(item=>item.id!=='overview'),points=layer==='body'?bodyPoints:radial(branches.length);
  const origin=points[branches.findIndex(item=>item.id===topic)]||[190,178];
  const isChart=focused&&layer==='body'&&topic==='hormones';
  const mainKind=layer==='body'?(topic==='overview'?'uterus':topic):topic;
  const showBotanical=focused&&layer!=='body'&&(topic==='overview'||topic==='archetype');
  return <div className={`tg-cycle-atlas${focused?' is-focused':''}${motion?'':' is-still'}`} data-layer={layer} data-topic={topic}>
    <svg className="tg-cycle-atlas-art" viewBox="0 0 380 356" role="img" aria-label={focused?L(['Prostorová mapa vybrané fáze. Témata otevřeš tlačítky kolem obrazu.','A spatial map of the selected phase. Open topics with the buttons around the image.']):L(['Čtyři krajiny cyklu spojené jednou spirálou. Velikost nevyjadřuje délku fází.','Four cycle landscapes joined by one spiral. Size does not represent phase duration.'])}>
      <defs><pattern id={hatch} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)"><path d="M0 0V5" stroke="currentColor" opacity=".2" strokeWidth=".7"/></pattern></defs>
      <g className="tg-cycle-world" fill="none" stroke="currentColor" strokeWidth=".65">
        <ellipse cx="190" cy="181" rx="154" ry="139" opacity=".2"/><ellipse cx="190" cy="189" rx="144" ry="125" opacity=".12"/>
        <path d="M27 186C70 168 55 65 131 43S258 45 308 98 356 217 291 280 102 337 62 261 127 125 205 147 265 232 199 248 123 185 181 182" opacity={focused?.1:.35}/>
        <path d="M45 282Q191 344 335 282M66 296Q192 348 314 296M95 312Q190 346 285 312" opacity=".12"/>
        {focused&&branches.map((item,i)=><path key={item.id} d={`M190 177 Q${190+(points[i][0]-190)*.28} ${177+(points[i][1]-177)*.7} ${points[i][0]} ${points[i][1]}`} strokeDasharray={topic===item.id?undefined:'2 5'} strokeWidth={topic===item.id?1.15:.65} opacity={topic===item.id?.6:.23}/>) }
      </g>
      {CYCLE_ORDER.map((id,i)=>{const [x,y]=phasePoints[i],selected=shown===id;return <g key={id} className="tg-cycle-phase-landscape" style={{transform:focused&&selected?'translate(190px,180px) scale(.91)':`translate(${x}px,${y}px) scale(.47)`,opacity:focused?(selected&&showBotanical?1:0):selected||!shown?.88:.46}}><SeasonPlate phase={id} hatch={hatch}/></g>;})}
      <g className="tg-cycle-center-spiral" style={{opacity:focused?0:.8,transform:focused?'translate(190px,180px) scale(.2)':'translate(190px,176px) scale(.47)'}}><path d={spiral} fill="none" stroke="currentColor" strokeWidth="1.2"/><circle r="4" fill="currentColor"/></g>
      {focused&&!showBotanical&&shown&&<g key={`${shown}-${layer}-${topic}`} className="tg-cycle-detail-arrival" style={{transformOrigin:'190px 180px','--cycle-origin-x':`${(origin[0]-190)*.4}px`,'--cycle-origin-y':`${(origin[1]-178)*.4}px`}}><g transform="translate(190 178)" className="tg-cycle-detail-plate">{isChart?<HormonePlate shown={shown} visible={visibleHormones} explained={explainedHormone} lang={lang}/>:<DetailPlate kind={mainKind} phase={shown} hatch={hatch}/>}</g></g>}
    </svg>
    {!focused?CYCLE_ORDER.map((id,i)=><button key={id} type="button" className={`tg-cycle-world-button phase-choice${shown===id?' is-selected':''}`} style={{left:`${phasePoints[i][0]/3.8}%`,top:`${(phasePoints[i][1]+66)/3.56}%`}} aria-pressed={shown===id} onClick={()=>onPhase(id)}><span className="tg-cycle-world-label">{L(CYCLE_DEPTH[id].short)}</span>{id===current&&<span className="tg-cycle-current-dot" aria-label={L(['Fáze vybraného dne','Selected day’s phase'])}/>}</button>):branches.map((item,i)=><button key={item.id} type="button" className={`tg-cycle-world-button topic-choice${topic===item.id?' is-selected':''}`} style={{left:`${points[i][0]/3.8}%`,top:`${points[i][1]/3.56}%`}} aria-pressed={topic===item.id} onClick={()=>onTopic(item.id)}><svg viewBox="-18 -18 36 36" aria-hidden="true"><CycleGlyph kind={item.id}/></svg><span className="tg-cycle-world-label">{L(item.label)}</span></button>)}
    {focused&&topic!=='overview'&&<button type="button" className="tg-cycle-map-center-back" onClick={()=>onTopic('overview')} aria-label={L(['Zpět k souvislostem fáze','Back to the phase overview'])}>‹</button>}
    {!focused&&shown&&<button type="button" className="tg-cycle-map-enter" onClick={onFocus}>{L(['Otevřít fázi','Open phase'])}<span aria-hidden="true"> →</span></button>}
    {focused&&<button type="button" className="tg-cycle-map-return" onClick={onBack}>{L(['Celý cyklus','Whole cycle'])}</button>}
  </div>;
}

export const cycleMapStyles=`
.tm-together .tg-cycle-atlas{position:relative;isolation:isolate;width:100%;max-width:460px;aspect-ratio:380/356;margin:4px auto 12px;color:var(--tg-accent)}
.tm-together .tg-cycle-atlas-art{display:block;width:100%;height:100%;overflow:visible}
.tg-cycle-phase-landscape,.tg-cycle-center-spiral{transition:transform 650ms cubic-bezier(.16,1,.3,1),opacity 240ms ease}
.tg-cycle-leaf{transition:transform 600ms cubic-bezier(.16,1,.3,1),opacity 350ms ease}
.tg-cycle-detail-arrival{animation:cycle-branch-open 480ms cubic-bezier(.16,1,.3,1) both}
@keyframes cycle-branch-open{from{opacity:.2;transform:translate(var(--cycle-origin-x,0px),var(--cycle-origin-y,0px)) scale(.55)}to{opacity:1;transform:translate(0,0) scale(1)}}
.tm-together .tg-cycle-world-button{position:absolute;translate:-50% -50%;border:0;border-radius:0;background:none;padding:6px 2px;min-height:48px;width:88px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:var(--tg-text);font:13px/1.25 var(--tm-font-body);cursor:pointer}
.tm-together .tg-cycle-world-button.phase-choice{width:126px;min-height:60px;font:18px/1.1 var(--tm-font-display);padding:12px 6px}
.tm-together .tg-cycle-world-button .tg-cycle-world-label{background:var(--tg-bg);box-shadow:0 0 0 3px var(--tg-bg);padding:1px 3px}
.tm-together .tg-cycle-world-button.phase-choice .tg-cycle-world-label{max-width:117px}
.tm-together .tg-cycle-world-button>svg{width:32px;height:32px;background:var(--tg-bg);border:1px solid var(--tg-soft);border-radius:50%;padding:5px;box-sizing:content-box;transition:border-color 120ms ease}
.tm-together .tg-cycle-world-button.is-selected{color:var(--tg-accent)}
.tm-together .tg-cycle-world-button.is-selected>svg{border-color:var(--tg-accent);box-shadow:0 0 0 2px var(--tg-bg),0 0 0 3px var(--tg-accent)}
.tm-together .tg-cycle-world-button:hover .tg-cycle-world-label{text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-world-button:focus-visible{outline:2px solid var(--tg-accent);outline-offset:3px;border-radius:6px}
.tg-cycle-current-dot{height:4px;width:4px;background:currentColor;border-radius:50%;margin-top:5px}
.tm-together .tg-cycle-map-enter,.tm-together .tg-cycle-map-return,.tm-together .tg-cycle-map-center-back{position:absolute;border:0;background:var(--tg-bg);border-radius:0;font:12px/1.2 var(--tm-font-tag);letter-spacing:.04em;padding:9px;min-height:36px;color:var(--tg-accent)}
.tm-together .tg-cycle-map-enter{left:50%;top:57%;translate:-50% 0;white-space:nowrap}
.tm-together .tg-cycle-map-return{left:0;bottom:-5px;padding-left:0;text-decoration:underline;text-underline-offset:4px}
.tm-together .tg-cycle-map-center-back{right:0;bottom:-5px;font-size:24px;min-width:44px}
.tg-cycle-chart-words{font:11px var(--tm-font-tag)}
.tg-cycle-atlas.is-still *{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){.tg-cycle-phase-landscape,.tg-cycle-center-spiral,.tg-cycle-leaf{transition:opacity 120ms ease}.tg-cycle-detail-arrival{animation:none}}
`;
