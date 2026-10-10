import React, {useState} from "react";
import {TmIcon} from "./icons.jsx";
import {FONT_BODY, FONT_TAG} from "./type.js";
import {useGuideAction} from "./guideNavigation.jsx";
import {CONTENT_CHANNELS, CONTENT_STAGES, creationResourcePatch, monthlyLedger, personalAmount, shiftPersonalMonth, validPersonalDate} from "../product/personalRooms.js";

// Opt-in private rooms composed with the existing shell and account store.
// Records use the same ledger/content schemas as Main; neither room seeds data.
export function createPersonalRoomsUI({useT, useStore, L, PageTitle, CenterSheet, RichArea, uid, todayISO}) {
  const button = t => ({minHeight:44, padding:"8px 12px", border:`1px solid ${t.border}`, borderRadius:8, background:"transparent", color:t.text, fontFamily:FONT_BODY, cursor:"pointer"});
  const field = t => ({boxSizing:"border-box", width:"100%", minWidth:0, minHeight:44, padding:"9px 10px", border:`1px solid ${t.border}`, borderRadius:8, background:"transparent", color:t.text, fontFamily:FONT_BODY, fontSize:16});
  const label = t => ({display:"grid", gap:6, marginBottom:16, fontFamily:FONT_BODY, fontSize:13, color:t.textSec});
  const saveAction = (t,save) => <button type="button" onClick={save} style={{...button(t),border:0,color:t.heroInk,padding:"8px 4px",flexShrink:0}}>{L("Uložit","Save")}</button>;
  const money = value => new Intl.NumberFormat(L("cs-CZ", "en-GB"), {style:"currency", currency:"CZK", maximumFractionDigits:2}).format(value);
  const dateLabel = value => new Date(value+"T12:00:00").toLocaleDateString(L("cs-CZ", "en-GB"));
  function Empty({children}) {const {t}=useT(); return <p style={{fontFamily:FONT_BODY, fontSize:14, color:t.textSec, padding:"24px 0", lineHeight:1.65}}>{children}</p>;}
  function LedgerEditor({kind, entry, month, onClose}) {
    const {t}=useT(), st=useStore(), incoming=kind==="income", nameKey=incoming?"source":"item";
    const [name,setName]=useState(entry?.[nameKey]||""), [amount,setAmount]=useState(entry?.amount==null?"":String(entry.amount)), [date,setDate]=useState(entry?.date||(todayISO().startsWith(month)?todayISO():month+"-01")), [error,setError]=useState("");
    const save=event=>{event.preventDefault();const value=personalAmount(amount);if(!name.trim()||value===null||!validPersonalDate(date)){setError(L("Doplň název, platné datum a kladnou částku nejvýše na dvě desetinná místa.","Enter a name, a valid date and a positive amount with at most two decimal places."));return;}const patch={[nameKey]:name.trim(),amount:value,date};if(entry)st.updateEntry(kind,entry.id,patch);else st.addEntry(kind,{id:uid(),...patch});onClose();};
    return <CenterSheet title={entry?L("Upravit záznam","Edit entry"):incoming?L("Přidat příjem","Add income"):L("Přidat výdaj","Add expense")} onClose={onClose}>
      <form onSubmit={save} noValidate>
        <label style={label(t)}>{L("Název","Name")}<input autoFocus value={name} onChange={e=>setName(e.target.value)} style={field(t)}/></label>
        <label style={label(t)}>{L("Částka v Kč","Amount in CZK")}<input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} style={field(t)}/></label>
        <label style={label(t)}>{L("Datum","Date")}<input type="date" value={date} onChange={e=>setDate(e.target.value)} style={field(t)}/></label>
        {error&&<p role="alert" style={{color:t.accentInk||t.accent,fontFamily:FONT_BODY,fontSize:13}}>{error}</p>}
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}><button type="submit" style={button(t)}>{L("Uložit","Save")}</button><button type="button" onClick={onClose} style={button(t)}>{L("Zpět","Back")}</button>{entry&&<button type="button" onClick={()=>{st.removeEntry(kind,entry.id);onClose();}} style={{...button(t),marginLeft:"auto"}}>{L("Přesunout do koše","Move to trash")}</button>}</div>
      </form>
    </CenterSheet>;
  }
  function PagePersonalFinances() {
    const {t}=useT(), st=useStore(), [month,setMonth]=useState(todayISO().slice(0,7)), [edit,setEdit]=useState(null);
    useGuideAction("hospodareni",()=>setEdit(null));
    React.useEffect(()=>{const target=st.openTarget;if(!target||!["income","expenses"].includes(target.kind))return;const entry=(st.coll[target.kind]||[]).find(row=>row.id===target.id);if(entry){setMonth(entry.date.slice(0,7));setEdit({kind:target.kind,entry});}st.setOpenTarget(null);},[st.openTarget]);
    const ledger=monthlyLedger(st.coll,month), title=new Date(month+"-01T12:00:00").toLocaleDateString(L("cs-CZ","en-GB"),{month:"long",year:"numeric"});
    return <>
      <PageTitle pageKey="hospodareni" icon={<TmIcon id="stewardship" size={38}/>} kicker={L("Co přichází, kam odchází, co zůstává.","What comes in, where it goes, what stays.")}>{L("Hospodaření","Stewardship")}</PageTitle>
      <div data-guide="hospodareni.overview" style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0"}}>{[-1,0,1].map(dir=>dir?<button key={dir} type="button" aria-label={dir<0?L("Předchozí měsíc","Previous month"):L("Další měsíc","Next month")} onClick={()=>setMonth(shiftPersonalMonth(month,dir))} style={{...button(t),border:0,padding:10}}><TmIcon id={dir<0?"back":"forward"} size={18}/></button>:<span key={dir} style={{fontFamily:"var(--tm-font-display)",fontSize:24,flex:1,textAlign:"center"}}>{title}</span>)}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10,borderBottom:`1px solid ${t.borderSoft}`,paddingBottom:22,marginBottom:22}}>{[[ledger.received,L("Příjmy","Income")],[ledger.spent,L("Výdaje","Expenses")],[ledger.balance,L("Zůstatek","Balance")]].map(([value,text])=><div key={text}><div style={{fontFamily:FONT_TAG,fontSize:12,color:t.textSec,marginBottom:5}}>{text}</div><div style={{fontFamily:"var(--tm-font-display)",fontSize:22,overflowWrap:"anywhere"}}>{money(value)}</div></div>)}</div>
      <div data-guide="hospodareni.entries">{[["expenses",L("Výdaje","Expenses"),L("Přidat výdaj","Add expense"),"item"],["income",L("Příjmy","Income"),L("Přidat příjem","Add income"),"source"]].map(([kind,heading,add,nameKey])=><section key={kind} style={{marginBottom:30}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}><h2 style={{fontFamily:"var(--tm-font-display)",fontSize:23,fontWeight:400,margin:"8px 0"}}>{heading}</h2><button type="button" onClick={()=>setEdit({kind})} style={button(t)}>{add}</button></div>
        {!ledger[kind].length?<Empty>{L("V tomto měsíci tu zatím není žádný záznam.","There are no entries for this month yet.")}</Empty>:ledger[kind].slice().sort((a,b)=>b.date.localeCompare(a.date)).map(entry=><button key={entry.id} type="button" onClick={()=>setEdit({kind,entry})} style={{...button(t),display:"flex",gap:12,width:"100%",textAlign:"left",border:0,borderBottom:`1px solid ${t.borderSoft}`,borderRadius:0,padding:"14px 0"}}><span style={{minWidth:0,flex:1,overflowWrap:"anywhere"}}>{entry[nameKey]||L("Záznam","Entry")}<small style={{display:"block",color:t.textSec,marginTop:5}}>{dateLabel(entry.date)}</small></span><span>{money(Number(entry.amount)||0)}</span></button>)}
      </section>)}</div>
      {edit&&<LedgerEditor {...edit} month={month} onClose={()=>setEdit(null)}/>}
    </>;
  }
  function ContentEditor({entry,onClose}) {
    const {t}=useT(),st=useStore();
    const [title,setTitle]=useState(entry?.title||""),[status,setStatus]=useState(entry?.status||"napad"),[postDate,setDate]=useState(entry?.postDate||""),[platforms,setPlatforms]=useState(entry?.platforms||[]),[text,setText]=useState(entry?.script||""),[error,setError]=useState("");
    const save=event=>{event.preventDefault();if(!title.trim()||(postDate&&!validPersonalDate(postDate))){setError(L("Doplň název a zkontroluj datum publikace.","Enter a title and check the publication date."));return;}const patch={title:title.trim(),status,postDate,platforms,script:text};if(entry)st.updateEntry("socItems",entry.id,patch);else st.addEntry("socItems",{id:uid(),createdAt:Date.now(),...patch});onClose();};
    return <CenterSheet title={entry?L("Upravit obsah","Edit content"):L("Nový nápad","New idea")} onClose={onClose} naradi={saveAction(t,save)}><form onSubmit={save} noValidate>
      <label style={label(t)}>{L("Název","Title")}<input autoFocus style={field(t)} value={title} onChange={e=>setTitle(e.target.value)}/></label>
      <label style={label(t)}>{L("Stav","Stage")}<select aria-label={L("Stav","Stage")} style={field(t)} value={status} onChange={e=>setStatus(e.target.value)}>{CONTENT_STAGES.map(([key,cs,en])=><option key={key} value={key}>{L(cs,en)}</option>)}</select></label>
      <label style={label(t)}>{L("Datum publikace","Publication date")}<input type="date" style={field(t)} value={postDate} onChange={e=>setDate(e.target.value)}/></label>
      <fieldset style={{border:0,padding:0,margin:"0 0 18px"}}><legend style={{fontFamily:FONT_BODY,fontSize:13,color:t.textSec,marginBottom:8}}>{L("Kanály","Channels")}</legend><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{CONTENT_CHANNELS.map(channel=><button key={channel} type="button" aria-pressed={platforms.includes(channel)} onClick={()=>setPlatforms(old=>old.includes(channel)?old.filter(x=>x!==channel):[...old,channel])} style={{...button(t),borderColor:platforms.includes(channel)?t.accent:t.border,color:platforms.includes(channel)?t.accentInk||t.accent:t.text}}>{channel}</button>)}</div></fieldset>
      <div style={{...label(t),marginBottom:24}}><span>{L("Text a podklady","Draft and resources")}</span><RichArea value={text} onChange={setText}/></div>
      {error&&<p role="alert">{error}</p>}<div style={{display:"flex",gap:8,flexWrap:"wrap",paddingBottom:86}}><button type="button" onClick={onClose} style={button(t)}>{L("Zpět","Back")}</button>{entry&&<button type="button" onClick={()=>{st.removeEntry("socItems",entry.id);onClose();}} style={{...button(t),marginLeft:"auto"}}>{L("Přesunout do koše","Move to trash")}</button>}</div>
    </form></CenterSheet>;
  }
  function ResourceEditor({entry,onClose}) {
    const {t}=useT(),st=useStore(),[title,setTitle]=useState(entry?.title||""),[text,setText]=useState(entry?.text||"");
    const save=event=>{event.preventDefault();if(!title.trim()&&!text.trim())return;const patch=creationResourcePatch(entry,title,text,L("Poznámka","Note"));if(entry)st.updateEntry("notebook",entry.id,patch);else st.addEntry("notebook",{id:uid(),date:todayISO(),...patch});onClose();};
    return <CenterSheet title={L("Poznámka tvorby","Creation note")} onClose={onClose} naradi={saveAction(t,save)}><form onSubmit={save}><label style={label(t)}>{L("Název","Title")}<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} style={field(t)}/></label><RichArea value={text} onChange={setText}/><div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap",paddingBottom:86}}>{entry&&<button type="button" onClick={()=>{st.removeEntry("notebook",entry.id);onClose();}} style={button(t)}>{L("Přesunout do koše","Move to trash")}</button>}</div></form></CenterSheet>;
  }
  function PagePersonalContent() {
    const {t}=useT(),st=useStore(),[edit,setEdit]=useState(null),[resource,setResource]=useState(null),[stage,setStage]=useState("all"),[query,setQuery]=useState("");
    useGuideAction("socsite",()=>{setEdit(null);setResource(null);});
    React.useEffect(()=>{const target=st.openTarget;if(!target||!["socItems","notebook"].includes(target.kind))return;const entry=(st.coll[target.kind]||[]).find(row=>row.id===target.id);if(entry){if(target.kind==="socItems")setEdit({entry});else setResource({entry});}st.setOpenTarget(null);},[st.openTarget]);
    const all=(st.coll.socItems||[]).filter(item=>!item.arch),items=all.filter(item=>(stage==="all"||item.status===stage)&&(!query||String(item.title||"").toLocaleLowerCase().includes(query.toLocaleLowerCase()))).sort((a,b)=>(a.postDate||"9999").localeCompare(b.postDate||"9999"));
    const notes=(st.coll.notebook||[]).filter(note=>note.folder==="Sociální sítě"||String(note.folder||"").startsWith("Sociální sítě/"));
    return <>
      <PageTitle pageKey="socsite" icon={<TmIcon id="voice" size={38}/>} kicker={L("Od nápadu k publikování.","From idea to publishing.")}>{L("Tvorba obsahu","Content")}</PageTitle>
      <p style={{fontFamily:FONT_BODY,fontSize:14,color:t.textSec,lineHeight:1.65}}>{L("Místo pro nápady, rozepsané texty a plán publikování.","A place for ideas, drafts and your publishing plan.")}</p>
      <section data-guide="socsite.overview"><button type="button" onClick={()=>setEdit({})} style={button(t)}>{L("Nový nápad","New idea")}</button><input aria-label={L("Hledat v tvorbě","Search content")} placeholder={L("Hledat…","Search…")} value={query} onChange={e=>setQuery(e.target.value)} style={{...field(t),margin:"16px 0 10px"}}/>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:10}}>{[["all","Vše","All"],...CONTENT_STAGES].map(([key,cs,en])=><button key={key} type="button" aria-pressed={stage===key} onClick={()=>setStage(key)} style={{...button(t),flexShrink:0,border:0,borderBottom:`1px solid ${stage===key?t.accent:"transparent"}`,borderRadius:0}}>{L(cs,en)} {key==="all"?all.length:all.filter(item=>item.status===key).length}</button>)}</div>
        {!items.length?<Empty>{all.length?L("Tomuto výběru neodpovídá žádný obsah.","No content matches this selection."):L("Začni jedním nápadem. Text, termín i kanál můžeš doplnit později.","Start with one idea. Add a draft, date and channel when you are ready.")}</Empty>:items.map(item=><button key={item.id} type="button" onClick={()=>setEdit({entry:item})} style={{...button(t),display:"block",width:"100%",textAlign:"left",border:0,borderBottom:`1px solid ${t.borderSoft}`,borderRadius:0,padding:"16px 0"}}><span style={{fontFamily:"var(--tm-font-display)",fontSize:22,overflowWrap:"anywhere"}}>{item.title}</span><span style={{display:"block",fontSize:12,color:t.textSec,marginTop:6}}>{(()=>{const found=CONTENT_STAGES.find(s=>s[0]===item.status)||CONTENT_STAGES[0];return L(found[1],found[2]);})()}{item.postDate?" · "+dateLabel(item.postDate):""}{item.platforms?.length?" · "+item.platforms.join(", "):""}</span></button>)}
      </section>
      <section data-guide="socsite.library" style={{marginTop:30,borderTop:`1px solid ${t.borderSoft}`,paddingTop:20}}><h2 style={{fontFamily:"var(--tm-font-display)",fontSize:25,fontWeight:400}}>{L("Poznámky tvorby","Creation notes")}</h2><button type="button" style={button(t)} onClick={()=>setResource({})}>{L("Přidat poznámku","Add a note")}</button>{notes.map(note=><button key={note.id} type="button" onClick={()=>setResource({entry:note})} style={{...button(t),display:"block",textAlign:"left",width:"100%",border:0,borderBottom:`1px solid ${t.borderSoft}`,borderRadius:0,padding:"16px 0"}}>{note.title}</button>)}</section>
      {edit&&<ContentEditor {...edit} onClose={()=>setEdit(null)}/>}{resource&&<ResourceEditor {...resource} onClose={()=>setResource(null)}/>}
    </>;
  }
  return {PagePersonalFinances,PagePersonalContent};
}
