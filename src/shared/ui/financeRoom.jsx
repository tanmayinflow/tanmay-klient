import React,{useEffect,useId,useState} from "react";
import {TmIcon} from "./icons.jsx";
import {FONT_BODY,FONT_TAG} from "./type.js";
import {hexA} from "./color.js";
import {useGuideAction} from "./guideNavigation.jsx";
import {shiftPersonalMonth,validPersonalDate} from "../product/personalRooms.js";
import {financeAmount,financeCategories,financeDate,financeHistory,financeRows,financeSummary,filterFinanceRows} from "../product/financeFlow.js";

const CSS=`
.tm-finance-flow{max-width:760px;margin:0 auto;font-family:var(--tm-font-body);font-variant-numeric:tabular-nums}
.tm-finance-flow button,.tm-finance-flow input,.tm-finance-flow select{font:inherit}
.tm-finance-flow label:has(input[type=month]):focus-within{outline:2px solid currentColor;outline-offset:3px;border-radius:6px}
.tm-finance-flow .tm-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.tm-finance-tabs{display:flex;gap:6px;overflow-x:auto;margin:14px 0 24px;scrollbar-width:none}
.tm-finance-tabs::-webkit-scrollbar{display:none}
.tm-finance-tabs button{flex:0 0 auto;font-family:var(--tm-font-tag);text-transform:uppercase;letter-spacing:.1em;font-size:12px;padding:10px 12px}
.tm-finance-totals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0}
.tm-finance-totals button{text-align:left;padding:10px 4px;min-width:0;overflow-wrap:anywhere}
.tm-finance-totals strong{display:block;font-family:var(--tm-font-display);font-size:clamp(21px,5vw,28px);font-weight:400;line-height:1.25;margin-top:5px}
.tm-finance-actions{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0 26px}
.tm-finance-actions button{display:inline-flex;align-items:center;gap:8px}
.tm-finance-totals small{display:block;margin-top:3px;font-family:var(--tm-font-body);font-size:12px;line-height:1.5;white-space:nowrap}
.tm-finance-scene{position:relative;padding:12px 0 6px;min-height:102px;isolation:isolate}
.tm-finance-scene h2{font-family:var(--tm-font-display);font-size:25px;line-height:1.2;font-weight:400;margin:0 92px 10px 0}
.tm-finance-scene p{font-size:13px;line-height:1.65;margin:0 104px 0 0;max-width:46ch}
.tm-finance-art{position:absolute;right:0;top:2px;width:86px;height:105px;pointer-events:none;mask-size:contain;mask-repeat:no-repeat;mask-position:center;opacity:.6}
.tm-finance-list-row{width:100%;display:flex;align-items:center;gap:12px;text-align:left;padding:14px 0!important;border-width:0 0 1px!important;border-radius:0!important;min-width:0}
.tm-finance-entry-name{flex:1;min-width:0;overflow-wrap:anywhere}
.tm-finance-entry-amount{max-width:45%;overflow-wrap:anywhere;text-align:right;flex-shrink:0}
.tm-finance-view{animation:tm-finance-turn .24s cubic-bezier(.16,1,.3,1)}
.tm-finance-editor{overflow-x:hidden;scrollbar-gutter:stable}
.tm-finance-editor form{max-width:520px;margin:0 auto;min-width:0}
.tm-finance-editor input,.tm-finance-editor textarea,.tm-finance-editor select{font-size:16px;max-width:100%;scroll-margin-block:12px}
.tm-finance-editor details{margin:4px 0 20px}
.tm-finance-editor summary{min-height:44px;display:flex;align-items:center;gap:8px;cursor:pointer;font-family:var(--tm-font-body);font-size:14px}
.tm-finance-editor summary::before{content:'+';width:16px;text-align:center}
.tm-finance-editor details[open]>summary::before{content:'−'}
.tm-finance-editor summary::-webkit-details-marker{display:none}
.tm-finance-editor .tm-finance-editor-actions{display:flex;gap:10px;flex-wrap:wrap}
.tm-finance-editor .tm-finance-editor-actions button{flex:1;min-width:100px}
@media(max-width:820px){.tm-finance-editor{animation:none!important}.tm-finance-editor .tm-cs-head{flex-shrink:0}.tm-finance-editor .tm-cs-body{min-width:0}.tm-finance-editor form{padding-bottom:8px}}
@keyframes tm-finance-turn{from{opacity:.72;transform:translateY(5px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.tm-finance-view{animation:none}}
@media(max-width:360px){.tm-finance-tabs{gap:0}.tm-finance-tabs button{padding:10px}.tm-finance-totals{gap:3px}.tm-finance-scene p{margin-right:76px}.tm-finance-art{width:65px;height:90px}}
`;

// Shared presentation and ledger editing; the caller supplies only its own store.
// Main's private obligations and investment tools remain a separate render slot.
export function createFinanceRoom({useT,useStore,L,PageTitle,CenterSheet,Select,uid,todayISO}) {
  const money=value=>new Intl.NumberFormat(L("cs-CZ","en-GB"),{style:"currency",currency:"CZK",maximumFractionDigits:2}).format(value);
  const monthName=value=>new Date(value+"-01T12:00:00").toLocaleDateString(L("cs-CZ","en-GB"),{month:"long",year:"numeric"});
  const button=t=>({background:"transparent",border:`1px solid ${t.border}`,borderRadius:8,color:t.text,minHeight:44,padding:"9px 13px",cursor:"pointer",fontFamily:FONT_BODY,fontSize:13});
  const quiet=t=>({...button(t),borderColor:"transparent"});
  const field=t=>({...button(t),width:"100%",boxSizing:"border-box",minWidth:0,fontSize:16,cursor:"text"});
  const label=t=>({display:"grid",gap:6,fontSize:13,color:t.textSec,marginBottom:16,fontFamily:FONT_BODY});
  const categoryName=(key,options)=>options.find(option=>option.value===key)?.label||key||L("Bez kategorie","Uncategorized");

  function LedgerEditor({kind,entry,month,categories,onClose,onSaved}) {
    const {t}=useT(),st=useStore(),incoming=kind==="income",nameKey=incoming?"source":"item";
    const id=useId(),[name,setName]=useState(entry?.[nameKey]||""),[amount,setAmount]=useState(entry?.amount==null?"":String(entry.amount)),[date,setDate]=useState(financeDate(entry?.date)||(todayISO().startsWith(month)?todayISO():month+"-01")),[category,setCategory]=useState(entry?.jar||entry?.category||""),[note,setNote]=useState(entry?.note||""),[error,setError]=useState(""),[detailsOpen,setDetailsOpen]=useState(!!(entry?.note||entry?.jar||entry?.category));
    const [categoryChanged,setCategoryChanged]=useState(false);
    const changeCategory=value=>{setCategory(value);setCategoryChanged(true);};
    const save=event=>{
      event.preventDefault();const parsed=financeAmount(amount);
      if(!name.trim()||parsed===null||!validPersonalDate(date)){setError(L("Doplň název, platné datum a nenulovou částku nejvýše na dvě desetinná místa.","Enter a name, a valid date and a nonzero amount with at most two decimal places."));return;}
      // Preserve untouched legacy fields. An explicit choice must also clear
      // the other historical alias, which otherwise wins the jar || category fallback.
      const categoryPatch=incoming||(entry&&!categoryChanged)?{}:categories.length
        ?{jar:category,...(entry&&Object.hasOwn(entry,"category")?{category:""}:{})}
        :{category,...(entry&&Object.hasOwn(entry,"jar")?{jar:""}:{})};
      const patch={[nameKey]:name.trim(),amount:parsed,date,note:note.trim(),...categoryPatch};
      if(entry)st.updateEntry(kind,entry.id,patch);else st.addEntry(kind,{id:uid(),...patch});
      onSaved(date.slice(0,7));onClose();
    };
    // CenterSheet owns delayed, non-scrolling focus after it locks the page.
    // Native autoFocus runs before that lock and can move the underlying page.
    return <CenterSheet className="tm-finance-editor" title={entry?L("Upravit záznam","Edit entry"):incoming?L("Přidat příjem","Add income"):L("Přidat výdaj","Add expense")} onClose={onClose} naradi={<button type="submit" form={id} style={{...quiet(t),color:t.heroInk}}>{L("Uložit","Save")}</button>}>
      <form id={id} onSubmit={save} noValidate>
        <label style={label(t)}>{L("Částka v Kč","Amount in CZK")}<input name="amount" inputMode="decimal" enterKeyHint="next" autoComplete="off" value={amount} onChange={event=>setAmount(event.target.value)} style={{...field(t),fontSize:24}}/></label>
        <label style={label(t)}>{L("Název","Name")}<input name="name" enterKeyHint="done" value={name} onChange={event=>setName(event.target.value)} style={field(t)}/></label>
        <label style={label(t)}>{L("Datum","Date")}<input type="date" value={date} onChange={event=>setDate(event.target.value)} style={field(t)}/></label>
        <details open={detailsOpen} onToggle={event=>setDetailsOpen(event.currentTarget.open)}>
        <summary>{incoming?L("Poznámka a podrobnosti","Note and details"):L("Kategorie a poznámka","Category and note")}</summary>
        {!incoming&&<label style={label(t)}>{categories.length?L("Sklenice","Jar"):L("Kategorie","Category")}{categories.length?<span role="group" aria-label={L("Sklenice","Jar")}><Select value={category} onChange={changeCategory} options={[{v:"",label:L("Bez kategorie","Uncategorized")},...categories.map(option=>({v:option.value,label:option.label}))]} style={{...field(t),cursor:"pointer"}}/></span>:<input name="category" value={category} onChange={event=>changeCategory(event.target.value)} placeholder={L("Například bydlení nebo jídlo","For example housing or food")} style={field(t)}/>}</label>}
        <label style={label(t)}>{L("Poznámka","Note")}<textarea rows={3} value={note} onChange={event=>setNote(event.target.value)} style={{...field(t),resize:"vertical"}}/></label>
        <p style={{fontFamily:FONT_BODY,fontSize:12,color:t.textSec,margin:"0 0 16px",lineHeight:1.6}}>{L("Vrácenou platbu zapiš jako zápornou částku.","Record a refunded payment as a negative amount.")}</p>
        </details>
        {error&&<p role="alert" style={{color:t.accentInk||t.accent,fontFamily:FONT_BODY,fontSize:13,lineHeight:1.6}}>{error}</p>}
        <div className="tm-finance-editor-actions"><button type="submit" style={{...button(t),background:t.accent,color:t.onAccent,borderColor:t.accent}}>{L("Uložit","Save")}</button><button type="button" onClick={onClose} style={quiet(t)}>{L("Zrušit","Cancel")}</button></div>
        {entry&&<button type="button" onClick={()=>st.ask(L("Přesunout záznam do koše?","Move this entry to trash?"),()=>{st.removeEntry(kind,entry.id);onClose();},{soft:true})} style={{...quiet(t),marginTop:20}}>{L("Do koše","Move to trash")}</button>}
      </form>
    </CenterSheet>;
  }

  function Scene({title,children,art}) {
    const {t}=useT();return <div className="tm-finance-scene"><span aria-hidden="true" className="tm-finance-art" style={{backgroundColor:t.textSec,maskImage:`url('/media/icons/${art}')`,WebkitMaskImage:`url('/media/icons/${art}')`}}/><h2>{title}</h2><p style={{color:t.textSec}}>{children}</p></div>;
  }
  function FinanceRoom({historicExpenses=[],categories=[],renderCalendar,renderPlans}) {
    const {t}=useT(),st=useStore();
    const [month,setMonth]=useState(todayISO().slice(0,7)),[view,setView]=useState("overview"),[kind,setKind]=useState("all"),[query,setQuery]=useState(""),[category,setCategory]=useState(null),[edit,setEdit]=useState(null),[calendarOpen,setCalendarOpen]=useState(false),[historyEnd,setHistoryEnd]=useState(todayISO().slice(0,7)),[showAll,setShowAll]=useState(false);
    const rows=financeRows(st.coll,month,historicExpenses),summary=financeSummary(rows),groups=financeCategories(rows),shown=filterFinanceRows(rows,{kind,query,category}),history=financeHistory(st.coll,historyEnd,historicExpenses);
    const prior=financeSummary(financeRows(st.coll,shiftPersonalMonth(month,-1),historicExpenses)),diff=Math.round((summary.spent-prior.spent)*100)/100;
    const tabs=[["overview",L("Přehled","Overview")],["entries",L("Záznamy","Entries")],["history",L("Vývoj","History")],...(renderPlans?[["plans",L("Plány a závazky","Plans and commitments")]]:[])];
    const changeMonth=value=>{setMonth(value);setShowAll(false);};
    const openEntries=(nextKind="all",nextCategory=null)=>{setKind(nextKind);setCategory(nextCategory);setQuery("");setShowAll(false);setView("entries");};
    useGuideAction("hospodareni",action=>{setEdit(null);setCalendarOpen(false);setView(action==="hospodareni.entries"?"entries":"overview");});
    useEffect(()=>{const target=st.openTarget;if(!target||!["income","expenses"].includes(target.kind))return;const entry=(st.coll[target.kind]||[]).find(row=>row.id===target.id);if(entry){const date=financeDate(entry.date);if(date)changeMonth(date.slice(0,7));setEdit({kind:target.kind,entry});setView("entries");}st.setOpenTarget(null);},[st.openTarget]);
    const ledgerRow=(row,index)=>{
      const content=<><span className="tm-finance-entry-name">{row.entry.item||row.entry.source||L("Záznam","Entry")}<small style={{display:"block",fontSize:12,color:t.textSec,marginTop:5}}>{new Date(row.date+"T12:00:00").toLocaleDateString(L("cs-CZ","en-GB"),{day:"numeric",month:"numeric"})}{row.entry.jar||row.entry.category?" · "+categoryName(row.entry.jar||row.entry.category,categories):""}{row.archived?L(" · z archivu"," · from archive"):""}</small></span><span className="tm-finance-entry-amount" style={{color:row.kind==="income"?t.inkSage||t.textSec:t.text}}>{(row.kind==="income"?row.cents:-row.cents)>=0?"+":"−"}{money(Math.abs(row.cents)/100)}</span>{!row.archived&&<TmIcon id="forward" size={13} style={{display:"inline-block",verticalAlign:"middle"}}/>}</>;
      return row.archived?<div key={"archive"+index} className="tm-finance-list-row" style={{...quiet(t),borderBottomColor:t.borderSoft}}>{content}</div>:<button key={row.kind+row.entry.id} type="button" className="tm-finance-list-row" onClick={()=>setEdit({kind:row.kind,entry:row.entry})} style={{...quiet(t),borderBottomColor:t.borderSoft}}>{content}</button>;
    };
    return <><PageTitle pageKey="hospodareni" icon={<TmIcon id="stewardship" size={38}/>} kicker={L("Co přichází, kam odchází, co zůstává.","What comes in, where it goes, what stays.")}>{L("Hospodaření","Stewardship")}</PageTitle><div className="tm-finance-flow" style={{color:t.text}}><style>{CSS}</style>
      <div data-guide="hospodareni.overview" style={{display:"flex",alignItems:"center",gap:4,margin:"16px 0 4px"}}><button type="button" aria-label={L("Předchozí měsíc","Previous month")} onClick={()=>changeMonth(shiftPersonalMonth(month,-1))} style={quiet(t)}><TmIcon id="back" size={17}/></button><label style={{position:"relative",flex:1,textAlign:"center",fontFamily:"var(--tm-font-display)",fontSize:24,minWidth:0,cursor:"pointer"}}>{monthName(month)}<input type="month" aria-label={L("Vybrat měsíc","Choose month")} value={month} onChange={event=>{if(validPersonalDate(event.target.value+"-01"))changeMonth(event.target.value);}} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}}/></label><button type="button" aria-label={L("Další měsíc","Next month")} onClick={()=>changeMonth(shiftPersonalMonth(month,1))} style={quiet(t)}><TmIcon id="forward" size={17}/></button></div>
      {month!==todayISO().slice(0,7)&&<button type="button" onClick={()=>changeMonth(todayISO().slice(0,7))} style={{...quiet(t),display:"block",margin:"0 auto",fontSize:12}}>{L("Tento měsíc","This month")}</button>}
      <nav aria-label={L("Pohled hospodaření","Stewardship view")} className="tm-finance-tabs">{tabs.map(([key,title])=><button key={key} type="button" aria-pressed={view===key} onClick={()=>{setView(key);if(key==="history")setHistoryEnd(month);}} style={{...quiet(t),borderRadius:0,borderBottom:view===key?`2px solid ${t.accent}`:"2px solid transparent",color:view===key?t.accentInk||t.accent:t.textSec}}>{title}</button>)}</nav>
      <div key={view} className="tm-finance-view">
      {view==="overview"&&<><Scene art="finance-bowl-v1.webp" title={summary.count?L("Měsíc v souvislostech","The month in context"):L("Začni jedním záznamem","Begin with one entry")}>{summary.count?L("Příjmy, výdaje a jejich rozdíl. Vyber částku a uvidíš, z čeho se skládá.","Income, expenses and the difference. Choose an amount to see its entries."):L("Zapiš, co přišlo nebo za co jsi zaplatil. Přehled se poskládá z tvých záznamů.","Record what came in or what you paid for. Your entries will shape this overview.")}</Scene>
        <div className="tm-finance-totals">{[[summary.received,"income",L("Příjmy","Income")],[summary.spent,"expenses",L("Výdaje","Expenses")],[summary.balance,"all",L("Rozdíl","Difference")]].map(([value,key,title])=><button key={key} type="button" onClick={()=>openEntries(key)} style={{...quiet(t),borderBottom:`1px solid ${t.borderSoft}`,borderRadius:0}}><span style={{fontFamily:FONT_TAG,fontSize:12,letterSpacing:".06em",color:t.textSec}}>{title}</span><strong>{new Intl.NumberFormat(L("cs-CZ","en-GB"),{maximumFractionDigits:2}).format(value)}<small>{L("Kč","CZK")}</small></strong></button>)}</div>
        <p style={{fontSize:12,color:t.textSec,lineHeight:1.6,margin:"0 0 12px"}}>{summary.received>0&&<>{L("Rozdíl vůči příjmům","Difference as a share of income")}: {Math.round(summary.balance/summary.received*100)} %. </>}{L("Rozdíl vychází ze zapsaných položek. Nejde o zůstatek na účtu.","The difference is calculated from recorded entries, not your bank balance.")}</p>
        <div className="tm-finance-actions"><button type="button" onClick={()=>setEdit({kind:"expenses"})} style={{...button(t),borderColor:t.accent,color:t.accentInk||t.accent}}><TmIcon id="add" size={14} style={{verticalAlign:"middle",marginRight:6}}/>{L("Přidat výdaj","Add expense")}</button><button type="button" onClick={()=>setEdit({kind:"income"})} style={quiet(t)}><TmIcon id="add" size={14} style={{verticalAlign:"middle",marginRight:6}}/>{L("Přidat příjem","Add income")}</button></div>
        {groups.length>0&&<section aria-label={L("Kam peníze odcházejí","Where money goes")} style={{margin:"30px 0"}}><h2 style={{fontFamily:"var(--tm-font-display)",fontSize:24,fontWeight:400,margin:"0 0 8px"}}>{L("Kam peníze odcházejí","Where money goes")}</h2>{groups.map(group=><button key={group.key} type="button" onClick={()=>openEntries("expenses",group.key)} style={{...quiet(t),width:"100%",textAlign:"left",padding:"12px 0",borderRadius:0}}><span style={{display:"flex",justifyContent:"space-between",gap:12}}><span>{categoryName(group.key,categories)}</span><span>{money(group.amount)}</span></span><span aria-hidden="true" style={{display:"block",height:3,marginTop:8,background:hexA(t.text,.1),borderRadius:3}}><span style={{display:"block",height:"100%",width:Math.min(100,Math.max(0,summary.spent>0?group.amount/summary.spent*100:0))+"%",background:t.sage||t.accent,borderRadius:3}}/></span></button>)}</section>}
        {rows.length>0&&<section><h2 style={{fontFamily:"var(--tm-font-display)",fontSize:24,fontWeight:400,margin:"30px 0 8px"}}>{L("Poslední záznamy","Recent entries")}</h2>{rows.slice(0,3).map(ledgerRow)}<button type="button" onClick={()=>openEntries()} style={{...quiet(t),paddingLeft:0,marginTop:6}}>{L("Všechny záznamy","All entries")} <TmIcon id="forward" size={13} style={{display:"inline-block",verticalAlign:"middle"}}/></button></section>}
        {renderCalendar&&<details open={calendarOpen} onToggle={event=>setCalendarOpen(event.currentTarget.open)} style={{marginTop:20}}><summary style={{cursor:"pointer",padding:"12px 0",fontSize:13}}>{L("Denní kalendář","Daily calendar")}</summary>{calendarOpen&&renderCalendar(month)}</details>}
        {prior.count>0&&summary.count>0&&<p style={{fontSize:13,lineHeight:1.65,color:t.textSec,margin:"26px 0"}}>{diff===0?L("Zapsané výdaje jsou stejné jako v předchozím měsíci.","Recorded expenses equal the previous month."):L(`Zapsané výdaje jsou o ${money(Math.abs(diff))} ${diff>0?"vyšší":"nižší"} než v předchozím měsíci.`,`Recorded expenses are ${money(Math.abs(diff))} ${diff>0?"higher":"lower"} than the previous month.`)}</p>}
      </>}
      {view==="entries"&&<section data-guide="hospodareni.entries"><Scene art="finance-ledger-v1.webp" title={L("Jednotlivé pohyby","Individual entries")}>{L("Doplň detail, najdi položku nebo oprav částku. Záznam otevřeš klepnutím.","Add a detail, find an entry or correct an amount. Tap an entry to open it.")}</Scene><div className="tm-finance-actions">{[["expenses",L("Přidat výdaj","Add expense")],["income",L("Přidat příjem","Add income")]].map(([key,title])=><button key={key} type="button" onClick={()=>setEdit({kind:key})} style={button(t)}>{title}</button>)}</div><input type="search" aria-label={L("Hledat v záznamech","Search entries")} placeholder={L("Název, kategorie nebo poznámka…","Name, category or note…")} value={query} onChange={event=>{setQuery(event.target.value);setShowAll(false);}} style={field(t)}/><div style={{display:"flex",gap:4,flexWrap:"wrap",margin:"10px 0"}}>{[["all",L("Vše","All")],["expenses",L("Výdaje","Expenses")],["income",L("Příjmy","Income")]].map(([key,title])=><button type="button" key={key} aria-pressed={kind===key} onClick={()=>{setKind(key);setCategory(null);setShowAll(false);}} style={{...quiet(t),color:kind===key?t.accentInk||t.accent:t.textSec,borderBottom:kind===key?`1px solid ${t.accent}`:"1px solid transparent",borderRadius:0}}>{title}</button>)}</div>{category!==null&&<button type="button" onClick={()=>setCategory(null)} style={{...button(t),marginBottom:12}}>{categoryName(category,categories)} <TmIcon id="close" size={12} style={{display:"inline-block",verticalAlign:"middle"}}/><span className="tm-sr-only">{L("Zrušit filtr","Clear filter")}</span></button>}<p role="status" style={{fontSize:12,color:t.textSec}}>{L("Záznamů","Entries")}: {shown.length}{shown.length>0&&<> · {L("Příjmy","Income")} {money(financeSummary(shown).received)} · {L("Výdaje","Expenses")} {money(financeSummary(shown).spent)}</>}</p>{(showAll?shown:shown.slice(0,40)).map(ledgerRow)}{!shown.length&&<p style={{fontSize:14,lineHeight:1.65,padding:"18px 0"}}>{query||category!==null?L("Tomuto hledání neodpovídá žádný záznam. Zkus jiné slovo nebo zruš filtr.","No entries match. Try another word or clear the filter."):L("V tomto pohledu zatím nejsou žádné záznamy.","There are no entries in this view yet.")}</p>}{!showAll&&shown.length>40&&<button type="button" onClick={()=>setShowAll(true)} style={button(t)}>{L("Zobrazit zbývající","Show remaining")} ({shown.length-40})</button>}</section>}
      {view==="history"&&<section><Scene art="finance-tree-rings-v1.webp" title={L("Měsíc vedle měsíce","Month by month")}>{L("Šest měsíců skutečných záznamů. Vyber měsíc a přejdi k jeho podrobnostem.","Six months of actual entries. Choose a month to see its details.")}</Scene><div style={{display:"flex",justifyContent:"space-between",margin:"14px 0"}}><button type="button" onClick={()=>setHistoryEnd(shiftPersonalMonth(historyEnd,-6))} style={quiet(t)}><TmIcon id="back" size={14} style={{display:"inline-block",verticalAlign:"middle"}}/> {L("Starší","Earlier")}</button><button type="button" onClick={()=>setHistoryEnd(shiftPersonalMonth(historyEnd,6))} style={quiet(t)}>{L("Novější","Later")} <TmIcon id="forward" size={14} style={{display:"inline-block",verticalAlign:"middle"}}/></button></div><p style={{fontSize:12,color:t.textSec}}>{L("Příjmy a výdaje. Délka čar odpovídá částce.","Income and expenses. Line lengths represent amounts.")}</p>{history.map(item=>{const max=Math.max(1,...history.flatMap(value=>[value.received,value.spent]));return <button type="button" key={item.month} onClick={()=>{changeMonth(item.month);setView("overview");}} aria-label={`${monthName(item.month)}, ${L("příjmy","income")} ${money(item.received)}, ${L("výdaje","expenses")} ${money(item.spent)}`} style={{...quiet(t),padding:"16px 0",width:"100%",textAlign:"left",borderBottom:`1px solid ${t.borderSoft}`,borderRadius:0}}><span style={{fontFamily:"var(--tm-font-display)",fontSize:21}}>{monthName(item.month)}</span>{[[item.received,t.sage||t.accent,"+"],[item.spent,t.accent,"−"]].map(([value,color,sign])=><span key={sign} style={{display:"flex",alignItems:"center",gap:12,marginTop:8}}><span aria-hidden="true" style={{flex:1,minWidth:0,height:4,background:hexA(t.text,.08),borderRadius:4}}><span style={{display:"block",width:Math.max(0,value/max*100)+"%",height:"100%",background:color,borderRadius:4}}/></span><span style={{fontSize:12,minWidth:100,textAlign:"right"}}>{(sign==="+"?value:-value)>=0?"+":"−"}{money(Math.abs(value))}</span></span>)}{!item.count&&<small style={{display:"block",marginTop:6,color:t.textSec}}>{L("Bez záznamů","No entries")}</small>}</button>;})}</section>}
      {view==="plans"&&renderPlans&&<><Scene art="finance-acorn-v1.webp" title={L("Co drží další měsíce","What supports the months ahead")}>{L("Rozdělení příjmů, přání, pravidelné platby a rezerva. Otevři jen to, co právě potřebuješ.","Income allocation, wishes, recurring payments and reserves. Open what you need.")}</Scene>{renderPlans(month)}</>}
      </div>{edit&&<LedgerEditor key={edit.kind+":"+(edit.entry?.id||"new")} {...edit} month={month} categories={categories} onClose={()=>setEdit(null)} onSaved={changeMonth}/>}</div></>;
  }
  return {FinanceRoom};
}
