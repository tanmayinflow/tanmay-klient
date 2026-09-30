import React,{useId,useRef,useState} from 'react';

const choices=[
  {id:'daily',name:['Otázka dne','Today’s question'],title:['Otázka pro dnešek','One question for today'],x:21,y:11.3},
  {id:'questions',name:['Otázky naživo','Face to face'],title:['Otázky naživo','Questions face to face'],x:79,y:11.3},
  {id:'moments',name:['Chvíle podle vás','A moment for you'],title:['Chvíle podle vás','A moment for you'],x:21,y:60.6},
  {id:'weekly',name:['Týdenní ohlédnutí','Our weekly reflection'],title:['Týdenní ohlédnutí','Our weekly reflection'],x:79,y:60.6}
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
    const index=available.findIndex(choice=>choice.id===current);
    let next;
    if(['ArrowRight','ArrowDown'].includes(event.key))next=available[(index+1)%available.length];
    if(['ArrowLeft','ArrowUp'].includes(event.key))next=available[(index+available.length-1)%available.length];
    if(event.key==='Home')next=available[0];
    if(event.key==='End')next=available.at(-1);
    if(next){event.preventDefault();select(next.id);buttons.current[next.id]?.focus();}
  };
  if(!available.length)return null;
  return <section className="tg-conversation-map" aria-label={L(['Náš prostor pro rozhovor','Our space for conversation'])}>
    <style>{conversationMapStyles}</style>
    <div className="tg-conversation-scene">
      <svg className="tg-conversation-drawing" viewBox="0 0 360 292" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <defs><mask id={artMask} x="104" y="74" width="152" height="198" maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href="/media/spolu/conversation-engraving.png" x="104" y="74" width="152" height="198" preserveAspectRatio="xMidYMid meet"/></mask></defs>
        <g className="tg-conversation-meeting" key={`meeting-${selected}`}>
          <rect x="104" y="74" width="152" height="198" fill="currentColor" stroke="none" mask={`url(#${artMask})`}/>
        </g>
      </svg>
      <div className="tg-conversation-nodes" role="tablist" aria-label={L(['Vyberte, na co máte prostor','Choose what you have room for'])}>
        {choices.map(choice=><button key={choice.id} type="button" role="tab" id={`${id}-${choice.id}-tab`} aria-controls={`${id}-${choice.id}-panel`} aria-selected={selected===choice.id} disabled={!available.some(item=>item.id===choice.id)} tabIndex={selected===choice.id?0:-1} ref={element=>{buttons.current[choice.id]=element;}} className="tg-conversation-node" style={{left:`${choice.x}%`,top:`${choice.y}%`}} onClick={()=>select(choice.id)} onKeyDown={event=>move(event,choice.id)}>
          <svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"><ConversationMark kind={choice.id}/></svg>
          <span>{L(choice.name)}</span>
        </button>)}
      </div>
    </div>
    <div className="tg-conversation-workspaces">
      {choices.map(choice=><div key={choice.id} id={`${id}-${choice.id}-panel`} role="tabpanel" aria-labelledby={`${id}-${choice.id}-tab`} tabIndex={0} hidden={selected!==choice.id} className="tg-conversation-panel">
        <div className="tg-conversation-panel-heading"><h3>{L(choice.title)}</h3><svg viewBox="0 0 40 20" aria-hidden="true"><path d="M1 10C8 2 13 2 20 10S32 18 39 10M1 10C8 18 13 18 20 10S32 2 39 10" fill="none" stroke="currentColor" strokeWidth=".8"/></svg></div>
        {content[choice.id]}
      </div>)}
    </div>
    {onOverview&&<button type="button" className="tg-overview-trigger" onClick={onOverview}>{L(['Naše ohlédnutí v čase','Our reflections over time'])}</button>}
  </section>;
}

const conversationMapStyles=`
.tm-together .tg-conversation-map{margin:2px 0 8px;min-width:0}
.tm-together .tg-conversation-scene{position:relative;width:100%;max-width:440px;aspect-ratio:360/292;margin:0 auto;color:var(--tg-accent)}
.tm-together .tg-conversation-drawing{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible;pointer-events:none;stroke-width:.85}
.tg-conversation-terrain{opacity:.25;stroke-dasharray:1 4}.tg-conversation-threads{opacity:.1}
.tg-conversation-meeting{opacity:.88;transform-origin:180px 222px;animation:tg-conversation-unfold 620ms cubic-bezier(.16,1,.3,1)}
.tg-conversation-route{opacity:.42;stroke-width:.8;stroke-dasharray:1;stroke-dashoffset:0;animation:tg-conversation-connect 440ms cubic-bezier(.16,1,.3,1)}
.tg-conversation-seeds{opacity:.6;stroke-width:.65}.tg-conversation-seeds circle{fill:currentColor;stroke:none}
.tm-together .tg-conversation-nodes{position:absolute;inset:0}
.tm-together button.tg-conversation-node{position:absolute;translate:-50% 0;width:41%;min-width:0;min-height:78px;padding:0 2px 6px;border:0;border-radius:2px;display:flex;align-items:center;flex-direction:column;gap:3px;background:none;color:var(--tg-text);font-family:var(--tm-font-display);font-size:18px;line-height:1.13;transition:color 150ms ease}
.tm-together .tg-conversation-node>svg{display:block;width:44px;height:44px;padding:1px;box-sizing:border-box;color:var(--tg-accent);background:transparent;border-radius:50%;overflow:visible;transition:transform 220ms cubic-bezier(.16,1,.3,1)}
.tm-together .tg-conversation-node>span{display:block;max-width:100%;text-wrap:balance}
.tm-together .tg-conversation-node[aria-selected=true]{color:var(--tg-accent)}
.tm-together .tg-conversation-node[aria-selected=true]>span{font-style:italic;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:5px}
.tm-together .tg-conversation-node[aria-selected=true]>svg{transform:scale(1.08)}
.tm-together .tg-conversation-node:hover:not(:disabled)>svg{transform:scale(1.08)}
.tm-together .tg-conversation-node:focus-visible{outline:2px solid var(--tg-accent);outline-offset:5px}
.tm-together .tg-conversation-panel{border:0;padding:24px 0 0;scroll-margin-top:28px;animation:tg-conversation-arrive 260ms ease-out}
.tm-together .tg-conversation-panel:focus-visible{outline:1px solid var(--tg-accent);outline-offset:7px}
.tm-together .tg-conversation-panel[hidden]{display:none!important}
.tm-together .tg-conversation-panel-heading{display:flex;gap:16px;align-items:center;margin:0 0 16px}
.tm-together .tg-conversation-panel-heading h3{font-family:var(--tm-font-display);font-size:27px;line-height:1.15;letter-spacing:normal;text-transform:none;margin:0;color:var(--tg-heading)}
.tm-together .tg-conversation-panel-heading>svg{width:34px;height:18px;flex-shrink:0;margin-left:auto;color:var(--tg-accent)}
.tm-together .tg-conversation-panel .tg-embedded-content{padding:0;margin:0;border:0}
@keyframes tg-conversation-connect{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes tg-conversation-unfold{from{transform:rotate(-2deg) scale(.975);opacity:.55}to{transform:none;opacity:.88}}
@keyframes tg-conversation-arrive{from{opacity:.65}to{opacity:1}}
@media(prefers-reduced-motion:reduce){.tg-conversation-route,.tg-conversation-meeting,.tm-together .tg-conversation-panel{animation:none}.tm-together .tg-conversation-node>svg{transition:none;transform:none!important}}
@media(max-width:360px){.tm-together .tg-conversation-node{font-size:17px}.tm-together .tg-conversation-panel-heading h3{font-size:25px}}
`;
