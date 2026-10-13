import React,{useId,useRef,useState} from 'react';

const choices=[
  {id:'daily',name:['Otázka dne','Today’s question'],title:['Otázka pro dnešek','One question for today']},
  {id:'questions',name:['Otázky naživo','Face to face'],title:['Otázky naživo','Questions face to face']},
  {id:'moments',name:['Chvíle podle vás','A moment for you'],title:['Chvíle podle vás','A moment for you']},
  {id:'weekly',name:['Týdenní ohlédnutí','Our weekly reflection'],title:['Týdenní ohlédnutí','Our weekly reflection']}
];

function ConversationMark({kind}){
  if(kind==='daily')return <><path d="M10 13C15 8 22 9 24 15C27 9 34 10 37 15C41 23 32 31 24 36C16 31 8 23 10 17"/><path d="M17 17C14 18 14 21 17 23M24 5v3M39 8l-3 3"/></>;
  if(kind==='questions')return <><path d="M22 11C14 8 8 13 8 20C8 25 12 29 17 30L13 36L23 32M27 15C34 12 40 17 40 24C40 30 36 33 30 34L34 40L24 35"/><path d="M16 18h7M15 23h6M28 23h5M27 28h6"/></>;
  if(kind==='moments')return <><path d="M23 41C22 29 23 18 24 8M23 29C12 28 8 21 9 14C19 14 25 21 23 29ZM24 24C33 22 39 16 38 8C28 9 22 16 24 24Z"/><path d="M12 18l10 10M34 12l-9 10M12 38c6-2 13-2 21-1"/></>;
  return <><path d="M36 13A17 17 0 1 0 40 26M36 13l-7 1m7-1-1-7M24 12v12l8 5"/><circle cx="24" cy="24" r="2"/><path d="M13 13l2 2M8 24h3M13 35l2-2M24 37v3"/></>;
}

/**
 * One scene, four working spaces. Slots stay mounted even while hidden.
 * `panel` + `onPanelChange` may control selection; otherwise it is local.
 * Supply plain content, without the old outer disclosure, in each named slot.
 */
export function TogetherConversationMap({lang='cs',slots,children,initialPanel='daily',panel,onPanelChange,onOverview}){
  const L=v=>v[lang==='en'?1:0],id=useId(),buttons=useRef({});
  const artMask=`tg-conversation-art-${id.replace(/:/g,'')}`;
  const content=slots||children||{};
  const available=choices.filter(choice=>content[choice.id]!==undefined&&content[choice.id]!==null);
  const [localPanel,setLocalPanel]=useState(initialPanel);
  const selected=available.some(choice=>choice.id===(panel??localPanel))?(panel??localPanel):available[0]?.id;
  const select=next=>{setLocalPanel(next);onPanelChange?.(next);};
  const move=(event,current)=>{
    const index=choices.findIndex(choice=>choice.id===current);
    let next;
    if(['ArrowRight','ArrowLeft'].includes(event.key))next=choices[index%2===0?index+1:index-1];
    if(['ArrowDown','ArrowUp'].includes(event.key))next=choices[(index+2)%choices.length];
    if(event.key==='Home')next=available[0];
    if(event.key==='End')next=available.at(-1);
    if(next){event.preventDefault();if(available.some(choice=>choice.id===next.id)){select(next.id);buttons.current[next.id]?.focus();}}
  };
  if(!available.length)return null;
  return <section className="tg-conversation-map" aria-label={L(['Náš prostor pro rozhovor','Our space for conversation'])}>
    <style>{conversationMapStyles}</style>
    <div className="tg-conversation-scene">
      <svg className="tg-conversation-drawing" viewBox="0 0 240 280" aria-hidden="true" data-conversation-art={selected}>
        <defs>{choices.map(choice=><mask key={choice.id} id={`${artMask}-${choice.id}`} x="0" y="0" width="240" height="280" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href={`/media/spolu/conversation-${choice.id}-v1.webp`} x="0" y="0" width="240" height="280" preserveAspectRatio="xMidYMid meet"/></mask>)}</defs>
        <g className="tg-conversation-meeting" key={`meeting-${selected}`}>
          <rect width="240" height="280" fill="currentColor" mask={`url(#${artMask}-${selected})`}/>
        </g>
      </svg>
      <div className="tg-conversation-nodes" role="group" aria-label={L(['Vyberte, na co máte prostor','Choose what you have room for'])}>
        {choices.map(choice=><button key={choice.id} type="button" aria-label={L(choice.name)} title={L(choice.name)} aria-controls={`${id}-${choice.id}-panel`} aria-pressed={selected===choice.id} disabled={!available.some(item=>item.id===choice.id)} ref={element=>{buttons.current[choice.id]=element;}} className="tg-conversation-node" onClick={()=>select(choice.id)} onKeyDown={event=>move(event,choice.id)}>
          <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"><ConversationMark kind={choice.id}/></svg>
        </button>)}
      </div>
    </div>
    <div className="tg-conversation-workspaces">
      {choices.map(choice=><div key={choice.id} id={`${id}-${choice.id}-panel`} role="region" aria-labelledby={`${id}-${choice.id}-heading`} tabIndex={0} hidden={selected!==choice.id} className="tg-conversation-panel">
        <div className="tg-conversation-panel-heading"><h3 id={`${id}-${choice.id}-heading`}>{L(choice.title)}</h3><svg viewBox="0 0 40 20" aria-hidden="true"><path d="M1 10C8 2 13 2 20 10S32 18 39 10M1 10C8 18 13 18 20 10S32 2 39 10" fill="none" stroke="currentColor" strokeWidth=".8"/></svg></div>
        {content[choice.id]}
      </div>)}
    </div>
    {onOverview&&<button type="button" className="tg-overview-trigger" onClick={onOverview}>{L(['Naše ohlédnutí v čase','Our reflections over time'])}</button>}
  </section>;
}

const conversationMapStyles=`
.tm-together .tg-conversation-map{margin:2px 0 8px;min-width:0}
.tm-together .tg-conversation-scene{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(108px,1fr);align-items:center;column-gap:clamp(12px,4vw,24px);width:100%;max-width:440px;margin:12px auto 4px;color:var(--tg-accent)}
.tm-together .tg-conversation-drawing{display:block;width:100%;height:auto;aspect-ratio:240/280;overflow:visible;pointer-events:none}
.tg-conversation-meeting{opacity:.88;transform-origin:120px 230px;animation:tg-conversation-unfold 620ms cubic-bezier(.16,1,.3,1)}
.tm-together .tg-conversation-nodes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 12px;align-items:center;justify-items:center}
.tm-together button.tg-conversation-node{width:100%;max-width:64px;min-width:44px;min-height:48px;aspect-ratio:1;padding:4px;border:1px solid transparent;border-radius:50%;display:flex;align-items:center;justify-content:center;background:none;color:var(--tg-accent);transition:background 150ms ease,border-color 150ms ease}
.tm-together .tg-conversation-node>svg{display:block;width:40px;height:40px;max-width:100%;box-sizing:border-box;background:transparent;overflow:visible;transition:transform 220ms cubic-bezier(.16,1,.3,1)}
.tm-together .tg-conversation-node[aria-pressed=true]{background:color-mix(in srgb,var(--tg-accent) 8%,transparent);border-color:var(--tg-accent)}
.tm-together .tg-conversation-node[aria-pressed=true]>svg{transform:scale(1.08)}
.tm-together .tg-conversation-node:disabled{opacity:.4;cursor:default}
.tm-together .tg-conversation-node:hover:not(:disabled)>svg{transform:scale(1.08)}
.tm-together .tg-conversation-node:focus-visible{outline:2px solid var(--tg-accent);outline-offset:5px}
.tm-together .tg-conversation-panel{border:0;padding:24px 0 0;scroll-margin-top:28px;animation:tg-conversation-arrive 260ms ease-out}
.tm-together .tg-conversation-panel:focus-visible{outline:1px solid var(--tg-accent);outline-offset:7px}
.tm-together .tg-conversation-panel[hidden]{display:none!important}
.tm-together .tg-conversation-panel-heading{display:flex;gap:16px;align-items:center;margin:0 0 16px}
.tm-together .tg-conversation-panel-heading h3{font-family:var(--tm-font-display);font-size:27px;line-height:1.15;letter-spacing:normal;text-transform:none;margin:0;color:var(--tg-heading)}
.tm-together .tg-conversation-panel-heading>svg{width:34px;height:18px;flex-shrink:0;margin-left:auto;color:var(--tg-accent)}
.tm-together .tg-conversation-panel .tg-embedded-content{padding:0;margin:0;border:0}
@keyframes tg-conversation-unfold{from{transform:rotate(-2deg) scale(.975);opacity:.55}to{transform:none;opacity:.88}}
@keyframes tg-conversation-arrive{from{opacity:.65}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.tg-conversation-meeting,.tm-together .tg-conversation-panel{animation:none}.tm-together .tg-conversation-node,.tm-together .tg-conversation-node>svg{transition:none;transform:none!important}}
@media(max-width:360px){.tm-together .tg-conversation-panel-heading h3{font-size:25px}}
`;
