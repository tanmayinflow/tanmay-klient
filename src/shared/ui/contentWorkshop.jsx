import React, {useState} from 'react';
import {TmIcon as FamilyIcon} from './icons.jsx';
import {FONT_BODY,FONT_TAG,FONT_DISPLAY_CS as FONT_DISPLAY} from './type.js';
import {useGuideAction} from './guideNavigation.jsx';
import {SOC_STAVY,SOC_PLATFORMY,SOC_FORMATY,socStav} from '../product/contentWorkshopData.js';
import {CONTENT_WORKSHOP_CSS} from './contentWorkshopStyles.js';
import {newContentItem,exportContentSnapshot} from '../product/contentWorkshop.js';
export function createContentWorkshopUI({useT,useStore,L,PageTitle,PageNotebook,Toggle,Tag,Select,CenterSheet,BufferedInput,RostouciText,ExportBtn,uid,todayISO,hexA,pProse,fieldStyle,iconBtn,gdEmbed,contentTopics=[]}) {
function GdriveVlozka({url,onChange,vyska}) { const {t}=useT(); const g=gdEmbed(url); return <div><BufferedInput value={url||''} onCommit={v=>onChange(v.trim())} placeholder={L('Odkaz na soubor nebo složku v Google Drive…','Google Drive file or folder link…')} style={{width:'100%',background:'transparent',color:t.text,border:0,borderBottom:'1px solid '+t.borderSoft,padding:'8px 0',fontFamily:FONT_BODY}}/>{url&&!g&&<p role="status" style={{color:t.textSec}}>{L('Zkontroluj odkaz na Google Drive.','Check the Google Drive link.')}</p>}{g&&<div style={{position:'relative',marginTop:10}}><iframe src={g.src} loading="lazy" allow="autoplay; fullscreen" allowFullScreen title="Google Drive" style={{width:'100%',height:vyska||300,borderRadius:8,border:'1px solid '+t.borderSoft}}/><a href={url} target="_blank" rel="noreferrer" style={{...iconBtn(t),position:'absolute',top:6,right:6,background:t.bg}} aria-label={L('Otevřít v Drive','Open in Drive')}><FamilyIcon id="arrow-out" size={16}/></a></div>}</div>;}
const socLbl = (t) => ({ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: t.sage });

function SocChip({ color = "default", on = true, onClick, title, children, small }) {
  const { tags } = useT();
  const c = tags[color] || tags.default;
  const st = { display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: small ? "1px 8px" : "3px 10px", fontFamily: FONT_BODY, fontSize: small ? 10.5 : 12, lineHeight: 1.5, background: on ? c.bg : "transparent", color: on ? c.fg : undefined, border: `1px solid ${on ? "transparent" : "currentColor"}`, opacity: on ? 1 : 0.45, whiteSpace: "nowrap" };
  if (!onClick) return <span style={st} title={title}>{children}</span>;
  return <button onClick={onClick} title={title} style={{ ...st, cursor: "pointer" }}>{children}</button>;
}

// výchozí tvar položky · vše ostatní doplní detail
const socNovy = title => newContentItem(title, uid());

// rychlé zachycení · napsat a Enter zachytí — ＋ rovnou otevře nový kus
function SocRychly({ onNew }) {
  const { t } = useT();
  const st = useStore();
  const [v, setV] = useState("");
  const pridej = () => { const n = v.trim(); if (!n) return; st.addEntry("socItems", socNovy(n)); setV(""); };
  const rovnou = () => { const n = socNovy(v.trim()); st.addEntry("socItems", n); setV(""); if (onNew) onNew(n.id); };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid transparent`, borderRadius: 10, padding: "5px 10px 5px 5px", margin: "4px 0 6px" }}>
      <button onClick={rovnou} title={L("Nový kus obsahu — rovnou otevřít", "New piece of content — open right away")}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "transparent", border: "none", borderRight: `1px solid transparent`, cursor: "pointer", color: t.sand, fontSize: 17, flexShrink: 0 }}><FamilyIcon id="add" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) pridej(); }}
        aria-label={L("Nový nápad", "New idea")} placeholder={L("Zachyť nový nápad…", "Capture a new idea…")}
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: t.text, fontFamily: FONT_BODY, fontSize: 15 }} />
      {v.trim() && <button onClick={pridej} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.textSec, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "7px 11px", minHeight: 32 }}>{L("zachytit", "capture")}</button>}
    </div>
  );
}

function SocRadek({ i, onOpen }) {
  const { t, tags } = useT();
  const st = useStore();
  const pil = (st.coll.socPillars || []).find((p) => p.id === i.pillar);
  const stavIdx = SOC_STAVY.findIndex((s) => s.k === i.status);
  const dalsi = SOC_STAVY[stavIdx + 1];
  const datum = i.postDate || i.doDate;
  return (
    <div className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 4px", borderBottom: `1px solid ${t.borderSoft}`, minHeight: 42 }}>
      {pil && <span title={L(pil.cz, pil.en)} style={{ width: 8, height: 8, borderRadius: 4, background: (tags[pil.color] || tags.default).fg, flexShrink: 0 }} />}
      <button onClick={() => onOpen(i.id)} style={{ flex: 1, minWidth: 0, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", flexWrap:"wrap", alignItems: "center", gap: "2px 8px" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.text, overflowWrap:"anywhere" }}>{i.title || L("(bez názvu)", "(untitled)")}</span>
        <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.06em", color: t.textMuted, flexShrink: 0 }}>{L((SOC_FORMATY[i.format] || SOC_FORMATY.jine).cz, (SOC_FORMATY[i.format] || SOC_FORMATY.jine).en)}{(i.platforms || []).length ? " · " + i.platforms.map((p) => p[0]).join("") : ""}</span>
      </button>
      {datum && <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, flexShrink: 0 }}>{datum.slice(8, 10)}. {+datum.slice(5, 7)}.</span>}
      {dalsi && !i.arch && (
        <button onClick={() => st.updateEntry("socItems", i.id, { status: dalsi.k })} aria-label={L("Posunout: ","Move: ")+(i.title||L("bez názvu","untitled"))+" · "+L(dalsi.cz,dalsi.en)} title={L("Posunout · ", "Move on · ") + L(dalsi.cz, dalsi.en)}
          style={{ background: "transparent", border: "none", color: t.sand, cursor: "pointer", fontSize: 15, width: 44, height: 44, flexShrink: 0, borderRadius: 8 }}><FamilyIcon id="forward" size={12} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      )}
    </div>
  );
}

// pilíře · rovnováha témat + osobní mapa, ze které rostou
function SocPilire({ items }) {
  const { t, tags } = useT();
  const st = useStore();
  const pilire = st.coll.socPillars || [];
  const [novy, setNovy] = useState("");
  const max = Math.max(1, ...pilire.map((p) => items.filter((i) => i.pillar === p.id).length));
  return (
    <div>
      <p style={{ ...pProse(t), fontSize: 13 }}>{L("Jméno pilíře nese i jeho účel. Rovnováha není povinnost — ale když jeden pilíř dlouho mlčí, ptej se proč.", "A pillar's name carries its purpose. Balance isn't a duty — but when one pillar stays silent for long, ask why.")}</p>
      {pilire.map((p) => {
        const n = items.filter((i) => i.pillar === p.id).length;
        const c = tags[p.color] || tags.default;
        return (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${t.borderSoft}` }}>
            <span style={{ width: 9, height: 9, borderRadius: 5, background: c.fg, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flexShrink: 0 }}>{L(p.cz, p.en)}</span>
            <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, flexShrink: 0 }}>{L(p.ucz || "", p.uen || "")}</span>
            <span style={{ flex: 1, height: 4, borderRadius: 2, background: hexA(c.fg, 0.13), overflow: "hidden" }}>
              <span style={{ display: "block", width: `${Math.round((n / max) * 100)}%`, height: "100%", background: hexA(c.fg, 0.7), transition: "width .4s ease" }} />
            </span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: n ? t.text : t.textMuted, width: 18, textAlign: "right" }}>{n}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input value={novy} onChange={(e) => setNovy(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && novy.trim()) { st.addEntry("socPillars", { id: uid(), cz: novy.trim(), en: novy.trim(), ucz: "", uen: "", color: "stone" }); setNovy(""); } }}
          placeholder={L("Nový pilíř…", "New pillar…")} style={{ flex: 1, background: "transparent", border: `1px solid transparent`, borderRadius: 8, outline: "none", color: t.text, fontFamily: FONT_BODY, fontSize: 13, padding: "6px 10px" }} />
      </div>
      <Toggle summary={L("Moje témata · mapa, ze které pilíře rostou", "My topics · the map pillars grow from")} color="green">
        {(st.coll.socTopics||contentTopics).map((tm, ix) => (
          <div key={ix} style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 15, color: t.heading, margin: "6px 0 4px" }}>{L(tm.cz, tm.en)}</div>
            {tm.body.map(([cz, en], k) => (
              <div key={k} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
                <span style={{ color: t.sage, flexShrink: 0 }}>·</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.6, color: t.textSec }}>{L(cz, en)}</span>
              </div>
            ))}
          </div>
        ))}
      </Toggle>
    </div>
  );
}

// ═══════ ZÁBĚRY · předvolby podle praxe režisérů a tvůrců krátkých videí ═══════
// Beat = místo v příběhu · Účel = co má záběr udělat s divákem · Záběr = řeč
// kamery (rámování a pohyb, jak je používají profesionální shot listy).
const SOC_BEATY = [
  ["hook", "Hook", "Hook"], ["kontext", "Kontext", "Context"], ["napeti", "Napětí", "Tension"],
  ["zlom", "Zlom", "Pivot"], ["rozuzleni", "Rozuzlení", "Payoff"], ["rehook", "Re-hook", "Re-hook"],
  ["cta", "Výzva (CTA)", "CTA"], ["prechod", "Přechod", "Transition"],
];
const SOC_UCELY = [
  ["zastavit", "Zastavit palec", "Stop the scroll"], ["orientovat", "Uvést do situace", "Orient"],
  ["napeti", "Vybudovat napětí", "Build tension"], ["odhalit", "Odhalit", "Reveal"],
  ["zduraznit", "Zdůraznit", "Emphasize"], ["dukaz", "Důkaz", "Proof"],
  ["emoce", "Emoce", "Emotion"], ["nadech", "Nádech · pauza", "Breather"],
  ["prechod", "Přechod", "Transition"], ["uzavrit", "Uzavřít smyčku", "Close the loop"],
];
const SOC_ZABERY = [
  ["mluvici", "Mluvící hlava", "Talking head"], ["selfie", "Selfie z ruky", "Handheld selfie"],
  ["ecu", "Velký detail (ECU)", "Extreme close-up"], ["cu", "Detail (CU)", "Close-up"],
  ["mcu", "Polodetail (MCU)", "Medium close-up"], ["ms", "Polocelek (MS)", "Medium shot"],
  ["ws", "Celek (WS)", "Wide shot"], ["ews", "Velký celek (EWS)", "Extreme wide"],
  ["ots", "Přes rameno (OTS)", "Over-the-shoulder"], ["pov", "POV", "POV"],
  ["top", "Shora (top-down)", "Top-down"], ["low", "Podhled", "Low angle"],
  ["high", "Nadhled", "High angle"], ["dutch", "Šikmý horizont", "Dutch angle"],
  ["makro", "Makro", "Macro"], ["insert", "Insert · detail předmětu", "Insert detail"],
  ["broll", "B-roll akce", "B-roll action"], ["track", "Jízda (tracking)", "Tracking"],
  ["push", "Nájezd (push-in)", "Push-in"], ["pan", "Švenk (pan)", "Pan"],
  ["whip", "Whip pan", "Whip pan"], ["crash", "Crash zoom", "Crash zoom"],
  ["staticky", "Statický (stativ)", "Static tripod"], ["freeze", "Freeze frame", "Freeze frame"],
  ["match", "Match cut", "Match cut"], ["time", "Timelapse", "Timelapse"],
  ["slowmo", "Zpomalený záběr", "Slow motion"], ["dron", "Dron", "Drone"],
];
const SOC_POHYBY = [
  ["staticky", "Statický (stativ)", "Static tripod"], ["ruka", "Z ruky", "Handheld"],
  ["gimbal", "Gimbal", "Gimbal"], ["svenk", "Švenk (pan)", "Pan"], ["tilt", "Tilt", "Tilt"],
  ["najezd", "Nájezd (push-in)", "Push-in"], ["odjezd", "Odjezd (pull-out)", "Pull-out"],
  ["jizda", "Jízda (tracking)", "Tracking"], ["orbit", "Orbit", "Orbit"],
  ["whip", "Whip pan", "Whip pan"], ["crash", "Crash zoom", "Crash zoom"],
  ["zoom", "Zoom", "Zoom"], ["boom", "Zdvih (boom)", "Boom"], ["dron", "Dron", "Drone"],
];

// ═══════ MÍSTNOST · dílna obsahu nahoře, Zápisník tvorby dole ═══════
function PageContentWorkshop() {
  const {t}=useT(),st=useStore();
  const [openId,setOpenId]=useState(null),[panel,setPanel]=useState('work'),[phase,setPhase]=useState('napad');
  const [exportMessage,setExportMessage]=useState('');
  const [delivery,setDelivery]=useState('idle'),deliveryMounted=React.useRef(false);
  const loadLibrary=async()=>{
    if(!st.loadContentLibrary)return;
    setDelivery('loading');
    try {await st.loadContentLibrary();if(deliveryMounted.current)setDelivery('ready');}
    catch {if(deliveryMounted.current)setDelivery('error');}
  };
  const exportRoom=()=>{
    try {
      const {snapshot,report}=exportContentSnapshot({...st.coll,socTopics:st.coll.socTopics||contentTopics});
      const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='tanmay-tvorba-'+todayISO()+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      setExportMessage(L('Exportováno: ','Exported: ')+snapshot.socItems.length+L(' příspěvků, ',' pieces, ')+snapshot.notebook.length+L(' poznámek.',' notes.')+(report.attachments||report.privateReferences?' '+L('Vynechané přílohy a soukromé odkazy: ','Omitted attachments and private links: ')+(report.attachments+report.privateReferences)+'.':''));
    } catch {setExportMessage(L('Export se nepodařil. Zkus to znovu.','Export failed. Please try again.'));}
  };
  React.useEffect(()=>{st.socSeed?.();st.socDocsSeed?.();},[]);
  React.useEffect(()=>{deliveryMounted.current=true;if(st.contentLibraryReady)loadLibrary();return()=>{deliveryMounted.current=false;};},[st.contentLibraryReady]);
  React.useEffect(()=>{if(st.coll.socDocsSeeded)st.socDocsSeed2?.();},[st.coll.socDocsSeeded]);
  React.useEffect(()=>{if(st.coll.socDocsSeeded2)st.socOborSeed?.();},[st.coll.socDocsSeeded2]);
  useGuideAction('socsite',action=>{setOpenId(null);setPanel(action==='socsite.library'?'notes':'work');setPhase('all');});
  React.useEffect(()=>{const target=st.openTarget;if(target?.kind==='socItems'){if((st.coll.socItems||[]).some(i=>i.id===target.id)){setOpenId(target.id);setPanel('work');}st.setOpenTarget(null);}else if(target?.kind==='notebook'){setPanel('notes');}},[st.openTarget]);
  const items=st.coll.socItems||[], active=items.filter(i=>!i.arch),openItem=items.find(i=>i.id===openId);
  const stages=[
    ['napad','sprout','Nápad','Idea','Zachyť myšlenku, dokud je živá.','Catch the thought while it is fresh.','empty-denik-v2.webp'],
    ['plan','compass','Plán','Plan','Vyber formát, komu píšeš a kdy se k tomu vrátíš.','Choose the format, your audience and when to return.','empty-zapisnik-v2.webp'],
    ['natocit','film','Tvorba','Create','Napiš scénář. Připrav záběry. Vytvoř první verzi.','Write the script. Prepare your shots. Make a first version.','content-illustration-v1.png'],
    ['strih','edit','Úpravy','Refine','Uprav rytmus a nech zaznít to podstatné.','Refine the rhythm and let the essential part come through.','empty-zapisnik-v2.webp'],
    ['publikovat','arrow-out','Publikace','Publish','Zkontroluj text, kanál a den zveřejnění.','Check the copy, channel and publication date.','empty-kompas-v2.webp'],
    ['vysledky','sprout','Ohlédnutí','Review','Zapiš, co se ukázalo a co zkusíš příště.','Record what you learned and what to try next.','empty-trenink-v2.webp'],
  ];
  const current=stages.find(s=>s[0]===phase)||stages[0];
  const notesCount=(st.coll.notebook||[]).filter(n=>n.folder==='Sociální sítě'||String(n.folder||'').startsWith('Sociální sítě/')).length;
  const button={minHeight:44,border:0,background:'transparent',color:t.accentInk||t.accent,fontFamily:FONT_BODY,fontSize:13,cursor:'pointer',padding:'8px 0'};
  return <div className="tm-content-workshop" style={{'--content-accent':t.accentInk||t.accent,'--content-ink':t.text,'--content-muted':t.textSec,'--content-line':t.borderSoft}}>
    <style>{CONTENT_WORKSHOP_CSS}</style>
    <PageTitle icon={<FamilyIcon id="voice" size={38}/>} pageKey="socsite" kicker={L('Od nápadu k publikování.','From idea to publishing.')}>{L('Tvorba obsahu','Content')}</PageTitle>
    {st.loadContentLibrary&&delivery!=='ready'&&<div role="status" style={{fontFamily:FONT_BODY,fontSize:13,lineHeight:1.6,color:t.textSec,marginBottom:12}}>{delivery==='loading'?L('Načítám sdílené podklady…','Loading shared resources…'):L('Sdílené podklady teď nejsou dostupné. Vlastní tvorba zůstává připravená.','Shared resources are unavailable right now. Your own work is ready.')} {delivery==='error'&&<button type="button" onClick={loadLibrary} style={{...button,marginLeft:8}}>{L('Zkusit znovu','Try again')}</button>}</div>}
    <nav className="tm-content-tabs" aria-label={L('Tvorba obsahu','Content')}>
      {[['work','Dílna','Workshop'],['calendar','Kalendář','Calendar'],['notes','Podklady','Resources']].map(([key,cs,en])=><button key={key} type="button" aria-pressed={panel===key} onClick={()=>setPanel(key)}>{L(cs,en)}{key==='notes'?' · '+notesCount:''}</button>)}
    </nav>
    {panel==='work'&&<section key="work" className="tm-content-panel" data-guide="socsite.overview">
      <div className="tm-content-path" role="group" aria-label={L('Fáze tvorby','Creation stages')}>{stages.map(([key,icon,cs,en])=><button type="button" key={key} aria-pressed={phase===key} aria-label={L(cs,en)+' · '+active.filter(i=>i.status===key).length} onClick={()=>setPhase(key)}><FamilyIcon id={icon} size={23}/><span className="phase-name">{L(cs,en)}</span><span className="phase-count">{active.filter(i=>i.status===key).length}</span></button>)}</div>
      <div className="tm-content-intro"><h2>{phase==='all'?L('Vše rozpracované','All work in progress'):L(current[2],current[3])}</h2><p style={{color:t.textSec}}>{phase==='all'?L('Každý příspěvek má svoje tempo. Vrať se k tomu, co je právě na řadě.','Every piece has its own pace. Return to what needs your attention now.'):L(current[4],current[5])}</p><span className="tm-content-art" aria-hidden="true" style={{'--content-art':'url("/media/icons/'+current[6]+'")'}}/></div>
      <SocRychly onNew={setOpenId} />
      <button type="button" style={button} aria-pressed={phase==='all'} onClick={()=>setPhase(phase==='all'?'napad':'all')}>{phase==='all'?L('Zpět k nápadům','Back to ideas'):L('Ukázat všechny fáze','Show every stage')} · {active.length}</button>
      <SocDilna items={items} onOpen={setOpenId} selectedPhase={phase}/>
      <Toggle summary={L('Pilíře obsahu a témata','Content pillars & topics')} color="green"><SocPilire items={active}/></Toggle>
      <Toggle summary={L('Laboratoř hooků','The hook lab')} color="orange"><SocHacky/></Toggle>
      {items.some(i=>i.arch)&&<Toggle summary={L('Archiv obsahu','Content archive')} color="gray">{items.filter(i=>i.arch).map(i=><SocRadek key={i.id} i={i} onOpen={setOpenId}/>)}</Toggle>}
    </section>}
    {panel==='calendar'&&<section key="calendar" className="tm-content-panel"><div className="tm-content-intro"><h2>{L('Místo v kalendáři','A place in the calendar')}</h2><p style={{color:t.textSec}}>{L('Natáčení a publikace mají svůj vlastní den. Klepni na datum a otevři příspěvek.','Filming and publication each have their own day. Select a date to open its pieces.')}</p><span className="tm-content-art" aria-hidden="true" style={{'--content-art':'url("/media/icons/empty-zapisnik-v2.webp")'}}/></div><SocKalendar items={active} onOpen={setOpenId}/></section>}
    {panel==='notes'&&<section key="notes" className="tm-content-panel" data-guide="socsite.library"><div className="tm-content-intro"><h2>{L('Poznámky tvorby','Creation notes')}</h2><p style={{color:t.textSec}}>{L('Příběhy, hooky, podklady a vlastní poznámky. Čti, hledej a upravuj je po svém.','Stories, hooks, resources and your own notes. Read, search and make them your own.')}</p><span className="tm-content-art" aria-hidden="true" style={{'--content-art':'url("/media/icons/empty-denik-v2.webp")'}}/></div><button type="button" onClick={exportRoom} style={{...button,display:'inline-flex',gap:8,alignItems:'center',marginBottom:12}}><FamilyIcon id="download" size={16}/>{L('Exportovat tvorbu','Export content')}</button>{exportMessage&&<p role="status" style={{fontFamily:FONT_BODY,fontSize:13,color:t.textSec,lineHeight:1.6}}>{exportMessage}</p>}<PageNotebook koren="Sociální sítě" korenNazev={L('Tvorba obsahu','Content')}/></section>}
    {openItem&&<SocDetail i={openItem} onClose={()=>setOpenId(null)}/>}
  </div>;
}

// dílna obsahu · pohledy, filtry a řazení nahoře// dílna obsahu · pohledy, filtry a řazení nahoře, tabule uprostřed,
// kalendář natáčení/publikace pod ní — stejný rytmus jako dílna cílů
const SOC_POHLEDY = [["list", "Seznam", "List"], ["faze", "Fáze", "Stage"], ["format", "Formát", "Format"], ["pilir", "Pilíř", "Pillar"], ["kanal", "Kanál", "Channel"]];
function SocDilna({ items, onOpen, selectedPhase="all" }) {
  const { t } = useT();
  const st = useStore();
  const [query,setQuery]=useState("");
  const meta = st.pageMetaOf("socsite");
  const pohled = meta.view || "list";
  const fKanal = meta.fKanal || "Vše";
  const fPilir = meta.fPilir || "Vše";
  const fFormat = meta.fFormat || "Vše";
  const sortBy = meta.sort || "postAsc";
  const setM = (patch) => st.setPageMeta("socsite", patch);
  const pilire = st.coll.socPillars || [];

  const zive = items.filter((i) => !i.arch);
  const filtrovane = zive.filter((i) => {
    if (selectedPhase !== "all" && i.status !== selectedPhase) return false;
    if (query.trim() && ![i.title,i.hook,i.script,i.caption,i.note].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) return false;
    if (fKanal !== "Vše" && !(i.platforms || []).includes(fKanal)) return false;
    if (fPilir !== "Vše" && i.pillar !== fPilir) return false;
    if (fFormat !== "Vše" && i.format !== fFormat) return false;
    return true;
  });
  const sorters = {
    postAsc: (a, b) => (a.postDate || "9999").localeCompare(b.postDate || "9999"),
    doAsc: (a, b) => (a.doDate || "9999").localeCompare(b.doDate || "9999"),
    name: (a, b) => (a.title || "").localeCompare(b.title || "", "cs"),
    nove: (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
  };
  const rows = [...filtrovane].sort(sorters[sortBy] || sorters.postAsc);

  let groups = [];
  if (pohled === "faze") groups = SOC_STAVY.map((s) => [L(s.cz, s.en), s.color, rows.filter((i) => i.status === s.k), { status: s.k }]);
  else if (pohled === "format") groups = Object.keys(SOC_FORMATY).map((k) => [L(SOC_FORMATY[k].cz, SOC_FORMATY[k].en), "taupe", rows.filter((i) => i.format === k), { format: k }]).filter(([, , its]) => its.length > 0 || true);
  else if (pohled === "pilir") groups = [...pilire.map((p) => [L(p.cz, p.en), p.color, rows.filter((i) => i.pillar === p.id), { pillar: p.id }]), [L("Bez pilíře", "No pillar"), "default", rows.filter((i) => !i.pillar), { pillar: "" }]];
  else groups = [...SOC_PLATFORMY.map((p) => [p, "slate", rows.filter((i) => (i.platforms || []).includes(p)), { platforms: [p] }]), [L("Bez kanálu", "No channel"), "default", rows.filter((i) => !(i.platforms || []).length), { platforms: [] }]];

  return (
    <>
      <input aria-label={L("Hledat v tvorbě","Search content")} placeholder={L("Najít příspěvek nebo myšlenku…","Find a piece or thought…")} value={query} onChange={e=>setQuery(e.target.value)} style={{...fieldStyle(t),background:"transparent",margin:"6px 0 16px",minWidth:0,width:"100%",boxSizing:"border-box"}}/>
      <div className="tm-tab-rail" style={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
        {SOC_POHLEDY.map(([k, cz, en]) => (
          <button key={k} aria-pressed={pohled===k} onClick={() => setM({ view: k })} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 11px 9px", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: pohled === k ? t.accent : t.textMuted, borderBottom: pohled === k ? `2px solid ${t.accent}` : "2px solid transparent", marginBottom: -1 }}>{L(cz, en)}</button>
        ))}
        <span style={{ flex: 1 }} />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0", flexWrap: "wrap" }}>
        <Select small value={fKanal} onChange={(v) => setM({ fKanal: v })} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 150 }} options={[{ v: "Vše", label: L("Kanál · vše", "Channel · all") }, ...SOC_PLATFORMY]} />
        <Select small value={fPilir} onChange={(v) => setM({ fPilir: v })} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 170 }} options={[{ v: "Vše", label: L("Pilíř · vše", "Pillar · all") }, ...pilire.map((p) => ({ v: p.id, label: L(p.cz, p.en) }))]} />
        <Select small value={fFormat} onChange={(v) => setM({ fFormat: v })} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 140 }} options={[{ v: "Vše", label: L("Formát · vše", "Format · all") }, ...Object.keys(SOC_FORMATY).map((k) => ({ v: k, label: L(SOC_FORMATY[k].cz, SOC_FORMATY[k].en) }))]} />
        <Select small value={sortBy} onChange={(v) => setM({ sort: v })} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 170 }} options={[{ v: "postAsc", label: L("publikace ↑", "publish ↑") }, { v: "doAsc", label: L("natáčení ↑", "filming ↑") }, { v: "name", label: "A–Z" }, { v: "nove", label: L("nejnovější", "newest") }]} />
      </div>
      {pohled === "list" ? <div>{rows.map(i=><SocRadek key={i.id} i={i} onOpen={onOpen}/>)}{!rows.length&&<p style={{...pProse(t),fontSize:14,padding:"20px 0"}}>{L("V tomhle výběru zatím žádný příspěvek není.","There are no pieces in this selection yet.")}</p>}</div> : <SocBoard groups={groups} onOpen={onOpen} onMove={(id, patch) => st.updateEntry("socItems", id, patch)} />}
    </>
  );
}

// tabule obsahu · stejná řeč jako tabule cílů: sloupce v barvě štítku,
// karty se dají přetáhnout do jiné fáze / formátu / pilíře / kanálu
function SocBoard({ groups, onOpen, onMove }) {
  const { t, tags } = useT();
  const [overCol, setOverCol] = useState(null);
  const getId = (e) => { const d = (e.dataTransfer.getData("text/plain") || "").split(":"); return d[0] === "soc" ? d.slice(1).join(":") : null; };
  return (
    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" }}>
      {groups.map(([title, color, items, patch]) => {
        const c = (tags[color] || tags.default).fg;
        const colOver = overCol === title;
        return (
          <div key={title}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setOverCol(title); }}
            onDragLeave={() => setOverCol((x) => (x === title ? null : x))}
            onDrop={(e) => { e.preventDefault(); setOverCol(null); const id = getId(e); if (id) onMove(id, patch); }}
            className="tm-bcol"
            style={{ minWidth: 230, maxWidth: 285, flex: "1 0 230px", display: "flex", flexDirection: "column", maxHeight: "min(560px, calc(64 * var(--tm-vh)))", background: hexA(c, colOver ? 0.12 : 0.055), border: `1px solid ${hexA(c, colOver ? 0.4 : 0.14)}`, borderRadius: 10, padding: "10px 6px 4px 10px", transition: "background .15s ease, border-color .15s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 2, flexShrink: 0 }}>
              <Tag label={title} color={color} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{items.length}</span>
            </div>
            <div className="tm-bcol-in" style={{ overflowY: "auto", flex: 1, minHeight: 0, paddingRight: 4 }}>
              {items.map((i) => (
                <div key={i.id} draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", "soc:" + i.id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setOverCol(title); }}
                  onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setOverCol(null); const id = getId(e); if (id && id !== i.id) onMove(id, patch); }}
                  style={{ cursor: "grab" }}>
                  <SocCard i={i} onOpen={onOpen} />
                </div>
              ))}
              {items.length === 0 && <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, padding: "2px 4px 8px" }}>—</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// karta kusu obsahu · stejná stavba jako karta cíle
function SocCard({ i, onOpen }) {
  const { t, tags } = useT();
  const st = useStore();
  const pil = (st.coll.socPillars || []).find((p) => p.id === i.pillar);
  const fmt = SOC_FORMATY[i.format] || SOC_FORMATY.jine;
  const dnes = todayISO();
  const poTermmu = i.postDate && i.postDate < dnes && !["vysledky"].includes(i.status);
  const fmtD = (iso) => { if (!iso) return null; const [, m, d] = iso.split("-"); return (+d) + ". " + (+m) + "."; };
  return (
    <button type="button" onClick={() => onOpen && onOpen(i.id)} className="tm-content-card tm-nav-item" style={{ background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "11px 13px", marginBottom: 10, cursor: "pointer", boxShadow: t.shadow }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
        <span style={{ color: t.textMuted, fontSize: 12, lineHeight: "20px" }}>◍</span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 15, fontWeight: 500, color: t.heading, lineHeight: 1.4 }}>{i.title || L("(bez názvu)", "(untitled)")}</span>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textSec, marginBottom: 7 }}>
        {L(fmt.cz, fmt.en)}{(i.platforms || []).length ? " · " + i.platforms.join(" · ") : ""}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        {pil && <Tag label={L(pil.cz, pil.en)} color={pil.color} />}
        <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
          {i.doDate && <span title={L("Natočit do", "Create by")} style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}><FamilyIcon id="film" size={13}/> {fmtD(i.doDate)}</span>}
          {i.postDate && <span title={L("Publikovat", "Publish on")} style={{ fontFamily: FONT_BODY, fontSize: 12, color: poTermmu ? tags.red.fg : t.textMuted }}><FamilyIcon id="arrow-out" size={16} label={L("Otevřít","Open")} style={{ display: "inline-block", verticalAlign: "middle" }} />{fmtD(i.postDate)}</span>}
        </span>
      </div>
    </button>
  );
}

// kalendář dílny · jedna mřížka, dva rozvrhy — natáčení (Do Date) a
// publikace (Post Date), přepínatelné přesně jak stálo v zadání
function SocKalendar({ items, onOpen }) {
  const { t, tags } = useT();
  const dnes = todayISO();
  const [rezim, setRezim] = useState("post"); // post = publikace · do = natáčení
  const pole = rezim === "post" ? "postDate" : "doDate";
  const [ym, setYm] = useState(dnes.slice(0, 7));
  const [den, setDen] = useState("");
  const [y, m] = ym.split("-").map(Number);
  const prvni = new Date(y, m - 1, 1);
  const dnu = new Date(y, m, 0).getDate();
  const posun = (prvni.getDay() + 6) % 7;
  const mapou = {};
  items.forEach((i) => { const d = i[pole]; if (d && d.slice(0, 7) === ym) (mapou[d] = mapou[d] || []).push(i); });
  const posunMesic = (d) => { const nd = new Date(y, m - 1 + d, 1); setYm(nd.getFullYear() + "-" + String(nd.getMonth() + 1).padStart(2, "0")); setDen(""); };
  const nadchazi = items.filter((i) => i[pole] && i[pole] >= dnes).sort((a, b) => a[pole].localeCompare(b[pole])).slice(0, 5);
  const denni = den ? (mapou[den] || []) : [];
  const prepinac = (k, cz, en) => (
    <button onClick={() => { setRezim(k); setDen(""); }}
      style={{ background: rezim === k ? hexA(t.accent, 0.12) : "transparent", border: `1px solid ${rezim === k ? hexA(t.accent, 0.45) : t.borderSoft}`, borderRadius: 18, color: rezim === k ? (t.accentInk || t.accent) : t.textSec, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "4px 14px", transition: "background .2s ease, border-color .2s ease, color .2s ease" }}>{L(cz, en)}</button>
  );
  return (
    <div style={{ border: `1px solid ${t.borderSoft}`, borderRadius: 10, background: "transparent", padding: "14px 12px", boxShadow: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={socLbl(t)}>{L("Kalendář", "Calendar")}</span>
        {prepinac("do", "Natáčení", "Filming schedule")}
        {prepinac("post", "Publikace", "Posting schedule")}
        <span style={{ flex: 1 }} />
        <button onClick={() => posunMesic(-1)} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 15, minWidth:44, minHeight:44, padding: "2px 8px" }}><FamilyIcon id="back" size={12} label={L("Zpět","Back")} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: t.heading }}>{prvni.toLocaleDateString(L("cs", "en") === "cs" ? "cs-CZ" : "en-GB", { month: "long", year: "numeric" })}</span>
        <button onClick={() => posunMesic(1)} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 15, minWidth:44, minHeight:44, padding: "2px 8px" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {(L("cs", "en") === "cs" ? ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map((d) => <span key={d} style={{ textAlign: "center", fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.08em", color: t.textMuted, padding: "2px 0" }}>{d}</span>)}
        {Array.from({ length: posun }, (_, k) => <span key={"p" + k} />)}
        {Array.from({ length: dnu }, (_, k) => {
          const iso = ym + "-" + String(k + 1).padStart(2, "0");
          const zde = mapou[iso] || [];
          const jeDnes = iso === dnes;
          return (
            <button key={iso} aria-label={iso+(zde.length?" · "+zde.length+" "+L("příspěvků","pieces"):"")} aria-pressed={den===iso} onClick={() => setDen(den === iso ? "" : iso)}
              style={{ background: den === iso ? hexA(t.accent, 0.1) : "transparent", border: jeDnes ? `1px solid ${hexA(t.accent, 0.55)}` : "1px solid transparent", borderRadius: 8, cursor: "pointer", padding: "3px 0 4px", minHeight: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: zde.length ? t.text : t.textMuted }}>{k + 1}</span>
              <span style={{ display: "flex", gap: 2, minHeight: 4 }}>
                {zde.slice(0, 3).map((i, ix) => <span key={ix} style={{ width: 4, height: 4, borderRadius: 2, background: (tags[socStav(i.status).color] || tags.default).fg }} />)}
              </span>
            </button>
          );
        })}
      </div>
      {den && denni.length === 0 && <p role="status" style={{...pProse(t),fontSize:13,marginTop:12}}>{L("Na tento den zatím není nic naplánované.","Nothing is scheduled for this day yet.")}</p>}
      {denni.length > 0 && <div style={{ marginTop: 8 }}>{denni.map((i) => <SocRadek key={i.id} i={i} onOpen={onOpen} />)}</div>}
      {nadchazi.length > 0 && (
        <>
          <div style={{ ...socLbl(t), margin: "14px 0 4px" }}>{rezim === "post" ? L("K publikaci přede dveřmi", "Publishing up next") : L("Natáčení přede dveřmi", "Filming up next")}</div>
          {nadchazi.map((i) => <SocRadek key={i.id} i={i} onOpen={onOpen} />)}
        </>
      )}
    </div>
  );
}

// laboratoř háčků · živá databáze hypotéz — testuj, zapisuj retenci;
// knihovny vzorů bydlí doslovně v Knihovně řemesla (Zápisník)
function SocHacky() {
  const { t } = useT();
  const st = useStore();
  const hooks = st.coll.socHooks || [];
  const [novy, setNovy] = useState("");
  const STAVY = { test: { cz: "otestovat", en: "to test", color: "yellow", next: "posted" }, posted: { cz: "publikováno", en: "posted", color: "green", next: "logged" }, logged: { cz: "zapsáno", en: "logged", color: "blue", next: "test" } };
  return (
    <div>
      <p style={{ ...pProse(t), fontSize: 13 }}>{L("Hook je hypotéza. Publikuj, přečti retenci, zapiš — teprve pak víš. Šablony a vzory najdeš doslovně v Zápisníku tvorby.", "A hook is a hypothesis. Post it, read retention, log it — only then you know. The template libraries live verbatim in the creation notebook.")}</p>
      <div style={{ display: "flex", gap: 8, margin: "4px 0 10px" }}>
        <input value={novy} onChange={(e) => setNovy(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && novy.trim()) { st.addEntry("socHooks", { id: uid(), text: novy.trim(), typ: "", status: "test", retention: "", vysledek: "", link: "" }); setNovy(""); } }}
          placeholder={L("Vlastní hook k otestování…", "Your own hook to test…")} style={{ flex: 1, background: "transparent", border: `1px solid transparent`, borderRadius: 8, outline: "none", color: t.text, fontFamily: FONT_BODY, fontSize: 13, padding: "6px 10px" }} />
      </div>
      {hooks.map((h) => {
        const s = STAVY[h.status] || STAVY.test;
        return (
          <div key={h.id} style={{ padding: "7px 0", borderBottom: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.55, color: t.text }}>{h.text}</span>
              <SocChip color={s.color} onClick={() => st.updateEntry("socHooks", h.id, { status: s.next })} title={L("Ťukni pro posun", "Tap to advance")} small>{L(s.cz, s.en)}</SocChip>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
              {h.typ && <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted }}>{h.typ}</span>}
              {h.status === "logged" && (
                <>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("retence", "retention")}</span>
                  <BufferedInput value={h.retention || ""} onCommit={(v) => st.updateEntry("socHooks", h.id, { retention: v })} placeholder="%" style={{ width: 52, fontFamily: FONT_BODY, fontSize: 12, color: t.text, borderBottom: `1px solid ${t.borderSoft}` }} />
                  <BufferedInput value={h.vysledek || ""} onCommit={(v) => st.updateEntry("socHooks", h.id, { vysledek: v })} placeholder={L("co se ukázalo…", "what showed up…")} style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 12, color: t.textSec, borderBottom: `1px solid ${t.borderSoft}` }} />
                </>
              )}
              <span style={{ flex: 1 }} />
              <button onClick={() => st.removeEntry("socHooks", h.id)} title={L("Do koše", "To trash")} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 12, padding: "2px 4px", opacity: 0.6 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// kanály · roletka s více volbami — stejná řeč jako Select, jen se nezavírá
function SocKanaly({ value = [], onChange, style }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const prehod = (p) => onChange(value.includes(p) ? value.filter((x) => x !== p) : [...value, p]);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...(style || {}) }}>
      <button type="button" onClick={() => setOpen((x) => !x)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: value.length ? t.text : t.textMuted, fontFamily: FONT_BODY, cursor: "pointer", outline: "none", width: "100%", padding: "5px 9px", fontSize: 13 }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value.length ? value.join(" · ") : "—"}</span>
        <span style={{ color: t.textMuted, fontSize: 12, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}><FamilyIcon id="expand" size={12} label={L("Rozbalit","Expand")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
      </button>
      {open && (
        <div style={{ animation: "tmsettle .18s ease both", position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%", background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", zIndex: 60, padding: 4 }}>
          {SOC_PLATFORMY.map((p) => {
            const on = value.includes(p);
            return (
              <button key={p} type="button" onClick={() => prehod(p)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: on ? hexA(t.accent, 0.08) : "transparent", border: "none", borderRadius: 6, cursor: "pointer", padding: "8px 10px", color: t.text, fontFamily: FONT_BODY, fontSize: 13, minHeight: 36 }}>
                <span style={{ width: 15, height: 15, borderRadius: 4, border: `1.4px solid ${on ? t.accent : t.border}`, background: on ? hexA(t.accent, 0.16) : "transparent", color: t.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>{on ? <FamilyIcon id="check" size={16} label={L("Hotovo","Done")} style={{ display: "inline-block", verticalAlign: "middle" }} /> : ""}</span>
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// výběr háčku z databáze · proklik z karty obsahu
function SocVyberHacku({ onPick, onClose }) {
  const { t } = useT();
  const st = useStore();
  const hooks = st.coll.socHooks || [];
  const [q, setQ] = useState("");
  const shown = q.trim() ? hooks.filter((h) => (h.text + " " + (h.typ || "")).toLowerCase().includes(q.trim().toLowerCase())) : hooks;
  return (
    <CenterSheet title={L("Databáze hooků", "The hook database")} onClose={onClose}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={L("Hledat hook…", "Search hooks…")} autoFocus
        style={{ ...fieldStyle(t), marginBottom: 10 }} />
      {shown.map((h) => (
        <button key={h.id} onClick={() => { onPick(h.text); onClose(); }} className="tm-nav-item"
          style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "baseline", gap: 10, background: "transparent", border: "none", borderBottom: `1px solid ${t.borderSoft}`, cursor: "pointer", padding: "9px 2px", minHeight: 40 }}>
          <span style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.5, color: t.text }}>{h.text}</span>
          {h.typ && <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, flexShrink: 0 }}>{h.typ}</span>}
          {h.retention && <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.sage, flexShrink: 0 }}>{h.retention}</span>}
        </button>
      ))}
      {!shown.length && <p style={{ ...pProse(t), fontStyle: "italic" }}>{L("Nic nenalezeno.", "Nothing found.")}</p>}
    </CenterSheet>
  );
}

// tabulka záběrů · skrolovací shot list jako v Notionu — beat, účel, popis,
// typ záběru, pohyb kamery, délka a text scénáře; vše kromě popisu, délky
// a textu se vybírá z předvoleb podle praxe režisérů
function SocZabery({ i, up }) {
  const { t } = useT();
  const zabery = i.zabery || [];
  const upRow = (ix, patch) => up({ zabery: zabery.map((r, k) => (k === ix ? { ...r, ...patch } : r)) });
  const selSt = { background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 6, color: t.text, fontFamily: FONT_BODY, fontSize: 12, padding: "5px 6px", width: "100%", outline: "none", colorScheme: t.mode };
  const th = { fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, textAlign: "left", padding: "0 6px 6px 0", whiteSpace: "nowrap" };
  const volby = (arr) => [<option key="" value="">—</option>, ...arr.map(([k, cz, en]) => <option key={k} value={k}>{L(cz, en)}</option>)];
  const celkem = zabery.reduce((s, r) => s + (parseFloat(r.d) || 0), 0);
  return (
    <div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", margin: "0 -2px", paddingBottom: 4 }}>
        <table style={{ borderCollapse: "collapse", minWidth: 1010, width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 26 }}>#</th>
              <th style={{ ...th, width: 108 }}>{L("Beat", "Beat")}</th>
              <th style={{ ...th, width: 132 }}>{L("Účel", "Purpose")}</th>
              <th style={{ ...th, minWidth: 150 }}>{L("Popis záběru", "Shot description")}</th>
              <th style={{ ...th, width: 148 }}>{L("Typ záběru", "Shot type")}</th>
              <th style={{ ...th, width: 128 }}>{L("Pohyb kamery", "Camera movement")}</th>
              <th style={{ ...th, width: 54 }}>{L("Délka s", "Sec")}</th>
              <th style={{ ...th, minWidth: 170 }}>{L("Text scénáře", "Script text")}</th>
              <th style={{ ...th, width: 28 }}></th>
            </tr>
          </thead>
          <tbody>
            {zabery.map((r, ix) => (
              <tr key={ix} style={{ borderTop: `1px solid ${t.borderSoft}` }}>
                <td style={{ fontFamily: FONT_TAG, fontSize: 12, color: t.textMuted, padding: "7px 6px 7px 0", verticalAlign: "top" }}>{ix + 1}</td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <select value={r.b || ""} onChange={(e) => upRow(ix, { b: e.target.value })} style={selSt}>{volby(SOC_BEATY)}</select>
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <select value={r.u || ""} onChange={(e) => upRow(ix, { u: e.target.value })} style={selSt}>{volby(SOC_UCELY)}</select>
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <BufferedInput value={r.p || ""} onCommit={(v) => upRow(ix, { p: v })} placeholder={L("co je v záběru…", "what's in the shot…")}
                    style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, borderBottom: `1px solid ${t.borderSoft}`, padding: "5px 2px" }} />
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <select value={r.z || ""} onChange={(e) => upRow(ix, { z: e.target.value })} style={selSt}>{volby(SOC_ZABERY)}</select>
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <select value={r.m || ""} onChange={(e) => upRow(ix, { m: e.target.value })} style={selSt}>{volby(SOC_POHYBY)}</select>
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <BufferedInput value={r.d || ""} onCommit={(v) => upRow(ix, { d: v })} placeholder="—"
                    style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, borderBottom: `1px solid ${t.borderSoft}`, padding: "5px 2px", textAlign: "center" }} />
                </td>
                <td style={{ padding: "6px 6px 6px 0", verticalAlign: "top" }}>
                  <BufferedInput value={r.t || ""} onCommit={(v) => upRow(ix, { t: v })} placeholder={L("co v záběru zazní…", "what's said in the shot…")}
                    style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, borderBottom: `1px solid ${t.borderSoft}`, padding: "5px 2px" }} />
                </td>
                <td style={{ padding: "6px 0", verticalAlign: "top" }}>
                  <button onClick={() => up({ zabery: zabery.filter((_, k) => k !== ix) })} title={L("Smazat řádek", "Delete row")}
                    style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 13, padding: "4px 6px", opacity: 0.65 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
        <button onClick={() => up({ zabery: [...zabery, { b: "", u: "", p: "", z: "", m: "", d: "", t: "" }] })}
          style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, color: t.inkSand || t.sand, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "6px 14px" }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Přidat záběr", "Add a shot")}</button>
        {celkem > 0 && <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("celkem ", "total ")}{Math.round(celkem * 10) / 10} s</span>}
      </div>
    </div>
  );
}

// karta kusu obsahu · dílna jednoho příběhu// karta kusu obsahu · dílna jednoho příběhu — vlastnosti jako rozklikávací
// výběry, háček s prokliknem do databáze, záběry jako tabulka
function SocDetail({ i, onClose }) {
  const { t } = useT();
  const st = useStore();
  const up = (patch) => st.updateEntry("socItems", i.id, patch);
  const fmt = SOC_FORMATY[i.format] || SOC_FORMATY.jine;
  const pilire = st.coll.socPillars || [];
  const [vyberHacku, setVyberHacku] = useState(false);
  const [part,setPart]=useState("text");
  const detailTabs=[["text","Text","Draft"],["shots","Záběry","Shots"],["publish","Publikace","Publish"],["results","Výsledky","Results"]];
  const pole = { width: "100%", boxSizing: "border-box", background: "transparent", color: t.text, border: "none", borderBottom: `1px solid ${t.borderSoft}`, padding: "4px 2px 7px", fontFamily: FONT_BODY, fontSize: 15, lineHeight: 1.6, outline: "none" };
  const sekce = (cz, en) => <div style={{ ...socLbl(t), margin: "18px 0 7px" }}>{L(cz, en)}</div>;
  const vysl = i.vysl || {};
  const cisla = [["views", "Zhlédnutí", "Views"], ["likes", "Lajky", "Likes"], ["comments", "Komentáře", "Comments"], ["shares", "Sdílení", "Shares"], ["saves", "Uložení", "Saves"], ["retention", "Retence %", "Retention %"]];
  const radek = { display: "flex", flexWrap:"wrap", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${t.borderSoft}` };
  const popisek = { width: 84, flexShrink: 0, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12, color: t.sage };
  return (
    <CenterSheet title={L("Kus obsahu", "A piece of content")} onClose={onClose} naradi={<button type="button" onClick={onClose} style={{background:"transparent",border:0,color:t.heroInk,minHeight:44,fontFamily:FONT_BODY,cursor:"pointer"}}>{L("Hotovo","Done")}</button>}>
      <BufferedInput value={i.title || ""} onCommit={(v) => up({ title: v })} placeholder={L("Název…", "Title…")}
        style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 24, color: t.heading, borderBottom: `1px solid transparent`, paddingBottom: 6, marginBottom: 8 }} />

      <Toggle summary={L("Fáze, formát a termíny","Stage, format and dates")} color="stone">
      {/* VLASTNOSTI · řádky jako v poznámce — hodnota se rozklikne a vybere */}
      <div style={radek}>
        <span style={popisek}>{L("Fáze", "Stage")}</span>
        <Select small value={i.status} onChange={(v) => up({ status: v })} style={{ flex: 1, maxWidth: 260 }}
          options={SOC_STAVY.map((s) => ({ v: s.k, label: L(s.cz, s.en) }))} />
      </div>
      <div style={radek}>
        <span style={popisek}>{L("Formát", "Format")}</span>
        <Select small value={i.format} onChange={(v) => up({ format: v })} style={{ flex: 1, maxWidth: 260 }}
          options={Object.keys(SOC_FORMATY).map((k) => ({ v: k, label: L(SOC_FORMATY[k].cz, SOC_FORMATY[k].en) }))} />
      </div>
      <div style={radek}>
        <span style={popisek}>{L("Pilíř", "Pillar")}</span>
        <Select small value={i.pillar || ""} onChange={(v) => up({ pillar: v })} style={{ flex: 1, maxWidth: 260 }} placeholder="—"
          options={[{ v: "", label: "—" }, ...pilire.map((p) => ({ v: p.id, label: L(p.cz, p.en) }))]} />
      </div>
      <div style={radek}>
        <span style={popisek}>{L("Kanály", "Channels")}</span>
        <SocKanaly value={i.platforms || []} onChange={(v) => up({ platforms: v })} style={{ flex: 1, maxWidth: 260 }} />
      </div>
      <div style={{ ...radek, borderBottom: "none" }}>
        <span style={popisek}>{L("Data", "Dates")}</span>
        {[["doDate", "natáčení", "filming"], ["postDate", "publikace", "posting"]].map(([k, cz, en]) => (
          <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>
            {L(cz, en)}
            <input type="date" value={i[k] || ""} onChange={(e) => up({ [k]: e.target.value })}
              style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.text, fontFamily: FONT_BODY, fontSize: 13, padding: "4px 7px", colorScheme: t.mode }} />
          </label>
        ))}
      </div>

      </Toggle>
      <div role="group" aria-label={L("Část příspěvku","Piece section")} style={{display:"flex",gap:12,flexWrap:"wrap",margin:"18px 0 12px"}}>{detailTabs.map(([key,cs,en])=><button type="button" key={key} aria-pressed={part===key} onClick={()=>setPart(key)} style={{minHeight:44,padding:"8px 0",fontFamily:FONT_TAG,fontSize:13,letterSpacing:".12em",textTransform:"uppercase",border:0,borderBottom:"1px solid "+(part===key?t.accent:"transparent"),color:part===key?t.accentInk||t.accent:t.textSec,background:"transparent",cursor:"pointer"}}>{L(cs,en)}</button>)}</div>
      <div hidden={part!=="text"}>
      {sekce("Hook", "Hook")}
      <RostouciText value={i.hook || ""} onChange={(e) => up({ hook: e.target.value })} rows={1} placeholder={L("Vyber hook z databáze, nebo napiš vlastní…", "Pick from the database, or write your own…")} style={pole} />
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button onClick={() => setVyberHacku(true)} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.textSec, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "5px 12px" }}>{L("Vybrat z databáze hooků", "Pick from the hook database")}</button>
        {(i.hook || "").trim() && (
          <button onClick={() => { st.addEntry("socHooks", { id: uid(), text: i.hook.trim(), typ: "", status: "test", retention: "", vysledek: "", link: "" }); }}
            style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "5px 4px" }}>{L("+ uložit do databáze", "+ save to the database")}</button>
        )}
      </div>

      {sekce("Scénář", "Script")}
      <RostouciText value={i.script || ""} onChange={(e) => up({ script: e.target.value })} rows={2} placeholder={L("Háček → kontext → napětí → obrat → rozuzlení…", "Hook → context → tension → pivot → payoff…")} style={pole} />

      </div><div hidden={part!=="shots"}>
      {sekce("Záběry", "Shot list")}
      <SocZabery i={i} up={up} />

      {sekce("Materiál · Google Drive", "Footage · Google Drive")}
      <GdriveVlozka url={i.gdrive || ""} onChange={(v) => up({ gdrive: v })} />

      </div><div hidden={part!=="publish"}>
      {sekce("Titulek", "Caption")}
      <RostouciText value={i.caption || ""} onChange={(e) => up({ caption: e.target.value })} rows={1} placeholder="…" style={pole} />

      {sekce("Pracovní postup · " + fmt.cz, "Workflow · " + fmt.en)}
      {fmt.kroky.map(([cz, en], idx) => {
        const done = !!(i.kroky || {})[idx];
        return (
          <button key={idx} onClick={() => up({ kroky: { ...(i.kroky || {}), [idx]: !done } })}
            style={{ display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "5px 0", minHeight: 32 }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, marginTop: 2, border: `1.4px solid ${done ? t.accent : t.border}`, background: done ? hexA(t.accent, 0.16) : "transparent", color: t.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, transition: "background .2s ease, border-color .2s ease" }}>{done ? <FamilyIcon id="check" size={16} label={L("Hotovo","Done")} style={{ display: "inline-block", verticalAlign: "middle" }} /> : ""}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.55, color: done ? t.textMuted : t.textSec, textDecoration: done ? "line-through" : "none", transition: "color .2s ease" }}>{L(cz, en)}</span>
          </button>
        );
      })}

      {sekce("Poznámka", "Note")}
      <RostouciText value={i.note || ""} onChange={(e) => up({ note: e.target.value })} rows={1} placeholder="…" style={pole} />

      </div><div hidden={part!=="results"}>
      {sekce("Výsledky", "Results")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {cisla.map(([k, cz, en]) => (
          <label key={k} style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>
            {L(cz, en)}
            <BufferedInput value={vysl[k] || ""} onCommit={(v) => up({ vysl: { ...vysl, [k]: v } })} placeholder="—" style={{ ...pole, fontSize: 15, padding: "2px 2px 5px" }} />
          </label>
        ))}
      </div>
      <div style={{ ...socLbl(t), margin: "14px 0 5px" }}>{L("Co mě to naučilo", "What it taught me")}</div>
      <RostouciText value={i.pouceni || ""} onChange={(e) => up({ pouceni: e.target.value })} rows={1}
        placeholder={L("Kde odpadli · co fungovalo · co zkusím příště…", "Where they dropped off · what worked · what I'll try next…")} style={pole} />
      <div style={{ marginTop: 6 }}>
        <BufferedInput value={i.url || ""} onCommit={(v) => up({ url: v })} placeholder={L("Odkaz na publikovaný kus…", "Link to the published piece…")} style={{ ...pole, fontSize: 12, color: t.textMuted }} />
      </div>

      </div>
      <div style={{ display: "flex", flexWrap:"wrap", alignItems: "center", gap: 10, marginTop: 22, paddingTop: 12, borderTop: `1px solid ${t.borderSoft}` }}>
        <ExportBtn small doc={() => ({
          title: i.title || L("Kus obsahu", "A piece of content"),
          sub: [L(fmt.cz, fmt.en), (SOC_STAVY.find((s) => s.k === i.status) || {}).cz].filter(Boolean).join(" · "),
          date: i.postDate || i.doDate || "",
          room: L("Tvorba obsahu", "Content"),
          text: [i.hook ? "## " + L("Hook", "Hook") + "\n" + i.hook : "", i.script ? "## " + L("Scénář", "Script") + "\n" + i.script : "",
                 i.caption ? "## " + L("Titulek", "Caption") + "\n" + i.caption : "", i.note ? "## " + L("Poznámka", "Note") + "\n" + i.note : "",
                 i.url ? i.url : ""].filter(Boolean).join("\n\n"),
        })} />
        <button onClick={() => up({ arch: !i.arch })} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, color: t.textSec, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "6px 12px" }}>{i.arch ? L("Vrátit z archivu", "Unarchive") : L("Archivovat", "Archive")}</button>
        <button onClick={() => { st.removeEntry("socItems", i.id); onClose(); }} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12, padding: "6px 4px" }}>{L("Do koše", "To trash")}</button>
        <span style={{ flex: 1 }} />
        <button onClick={onClose} style={{ background: hexA(t.accent, 0.12), border: `1px solid ${hexA(t.accent, 0.4)}`, borderRadius: 8, color: t.accentInk || t.accent, cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13, padding: "6px 16px" }}>{L("Hotovo", "Done")}</button>
      </div>
      {vyberHacku && <SocVyberHacku onPick={(txt) => up({ hook: (i.hook ? i.hook + "\n" : "") + txt })} onClose={() => setVyberHacku(false)} />}
    </CenterSheet>
  );
}


return {PageContentWorkshop};
}
