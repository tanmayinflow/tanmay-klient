import React,{useState} from 'react';
import {TogetherFold} from './togetherElements.jsx';
import {dateKey} from '../product/together.js';
import {PARTNER_ROOMS} from '../product/togetherPages.js';
import {togetherPracticeItems,togetherPracticePlan} from '../product/togetherPractice.js';

export function TogetherPractice({data,canTrack,getPages,lang='cs',onPlan,onSharing,onOpenPractice,open,onToggle}) {
  const L=(cs,en)=>lang==='en'?en:cs;
  const shared=data?.sharedPages||{rooms:[],pages:{}};
  const rooms=canTrack?shared.rooms:PARTNER_ROOMS.map(room=>room.id);
  const pages=canTrack?shared.pages:getPages?.(rooms)||{};
  const items=togetherPracticeItems(pages,rooms);
  const [selectedRoom,setSelectedRoom]=useState('praxe');
  const available=PARTNER_ROOMS.filter(room=>rooms.includes(room.id));
  const current=available.some(room=>room.id===selectedRoom)?selectedRoom:available[0]?.id;
  const visible=items.filter(item=>item.room===current);
  return <TogetherFold open={open} onToggle={onToggle} className="tg-practice" title={L('Z toho, co už žijeme','From what we already do')}>
    <p>{L('Nemusíte vymýšlet všechno znovu. Vyberte něco, co už v aplikaci máte, a udělejte si na to chvíli spolu.','You do not need to start from scratch. Choose something already in the app and make a little time for it together.')}</p>
    {canTrack&&<p className="hint">{L('Tady najdeš jen přehledy, které ti partner zpřístupnil. Názvy se přebírají z jeho stránek.','Here you see only the overviews your partner chose to share. Titles come from his existing pages.')}</p>}
    {!available.length?<><p>{L('Zatím tu nejsou žádné sdílené stránky. Můžete je zapnout v Propojení a sdílení.','No pages are shared yet. You can choose them in Connection and sharing.')}</p>{onSharing&&<button type="button" onClick={onSharing}>{L('Propojení a sdílení','Connection and sharing')}</button>}</>:<>
      <label htmlFor="tg-practice-room">{L('Odkud čerpat','Where to look')}</label>
      <select id="tg-practice-room" value={current} onChange={event=>setSelectedRoom(event.target.value)}>{available.map(room=><option value={room.id} key={room.id}>{L(...room.name)}</option>)}</select>
      {current==='praxe'&&<p className="hint">{canTrack?L('Splnění je převzaté z partnerovy Praxe. Zde ho znovu nevyplňujete.','Completion comes from your partner’s Practice. You do not enter it again here.'):L('Splnění dál zapisuješ v Praxi. Tady se stejný přehled jen zobrazí, bez dalšího vyplňování.','Keep recording completion in Practice. This is the same overview, with nothing to enter again.')}</p>}
      {visible.length?<details><summary>{L('Vybrat z přehledu','Choose from the overview')} · {visible.length}</summary>{visible.map(item=><article className="item" key={item.id}><h3>{item.title}</h3>{item.detail&&<p className="hint">{item.date?`${new Date(`${item.date}T12:00:00`).toLocaleDateString(lang==='en'?'en-GB':'cs-CZ',{day:'numeric',month:'long'})} · `:''}{item.detail}</p>}{onPlan&&<button type="button" onClick={()=>onPlan(togetherPracticePlan(item,dateKey(),lang))}>{L('Navrhnout společnou chvíli','Propose time together')}</button>}</article>)}</details>:<p className="hint">{L('V tomto přehledu zatím není nic k výběru. Můžete začít vlastním nápadem nebo inspirací výše.','Nothing to choose from here yet. Start with your own idea or one of the invitations above.')}</p>}
      <p className="hint">{L('Výběrem jen předvyplníš návrh. Před odesláním ho můžeš upravit a společná chvíle platí až po souhlasu vás obou.','Choosing an item only prepares a draft. You can edit it before sending, and the plan is agreed only after both of you confirm.')}</p>
    </>}
    <div className="row">{onOpenPractice&&<button type="button" onClick={onOpenPractice}>{L('Otevřít moji Praxi','Open my Practice')}</button>}{!canTrack&&onSharing&&<button type="button" onClick={onSharing}>{L('Vybrat sdílené stránky','Choose shared pages')}</button>}</div>
  </TogetherFold>;
}
