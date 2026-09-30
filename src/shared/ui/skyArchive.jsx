import React,{useId,useState} from "react";
import {SKY_PRACTICES} from "../product/skyContent.js";
import {validTimeZone} from "../product/skyJournal.js";

const styles=`
.sky-archive .sky-archive-group{margin:12px 0}
.sky-archive .sky-archive-group>summary{display:flex;align-items:baseline;gap:10px}
.sky-archive .sky-archive-group>summary small{font:12px var(--tm-font-body);color:var(--astro-muted)}
.sky-archive .sky-archive-fields{margin:12px 0}
.sky-archive .sky-archive-fields dt{font-size:12px;line-height:1.5;color:var(--astro-muted);margin:14px 0 4px}
.sky-archive .sky-archive-fields dd{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.sky-archive .sky-archive-fields ol{margin:0;padding-left:22px}
.sky-archive .sky-archive-fields li+li{margin-top:6px}
.sky-archive .sky-archive-stamp{margin:4px 0 12px;font-variant-numeric:tabular-nums}
.sky-archive .sky-record h4{margin:8px 0}
.sky-archive .sky-review-edit textarea{display:block;width:100%;box-sizing:border-box;background:transparent;color:inherit;resize:vertical;margin:6px 0 16px}
.sky-archive .sky-review-edit label{display:block;margin-top:12px}
`;

const textValue=value=>typeof value==="string"?value:"";
const recordTime=value=>{const date=new Date(value);return value!=null&&Number.isFinite(date.getTime())?date:null;};
function Field({label,children}){
  if(children==null||children==="")return null;
  return <><dt>{label}</dt><dd>{children}</dd></>;
}
function Stamp({value,timeZone,fallbackZone,lang}){
  const date=recordTime(value);
  if(!date)return null;
  const zone=validTimeZone(timeZone)?timeZone:fallbackZone;
  return <p className="sky-small sky-archive-stamp"><time dateTime={date.toISOString()}>{date.toLocaleString(lang==="en"?"en-GB":"cs-CZ",{timeZone:zone,year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",timeZoneName:"shortOffset"})}</time>{" · "}{zone}</p>;
}
function civilDate(value,lang){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||""))return textValue(value);
  const date=recordTime(`${value}T12:00:00Z`);
  return date?date.toLocaleDateString(lang==="en"?"en-GB":"cs-CZ",{timeZone:"UTC",year:"numeric",month:"long",day:"numeric"}):value;
}
function periodName(key,lang){
  const [range,...rest]=key.split(":"),start=rest.join(":"),en=lang==="en";
  const name=({week:en?"Week":"Týden",month:en?"Month":"Měsíc",year:en?"Year":"Rok",life:en?"Life period":"Životní období",tibetan:en?"Moon observation":"Pozorování Luny"})[range]||range;
  if(!start||start==="open")return name;
  return `${name} · ${civilDate(start.slice(0,10),lang)||start}`;
}

function ReviewEdit({record,update,ready,lang}){
  const L=(cs,en)=>lang==="en"?en:cs,id=useId();
  const [draft,setDraft]=useState(null),[message,setMessage]=useState("");
  const start=()=>({base:JSON.stringify(record),decision:textValue(record.decision),review:textValue(record.review)});
  const conflict=draft&&draft.base!==JSON.stringify(record),baseline=draft?JSON.parse(draft.base):record;
  const dirty=draft&&(draft.decision!==textValue(baseline.decision)||draft.review!==textValue(baseline.review));
  if(typeof update!=="function"||!record.id||(!ready&&!draft))return null;
  const save=()=>{
    if(!ready||!draft||!dirty||conflict)return;
    let saved;
    try{
      const ok=update(doc=>{
        const current=doc.decisions.find(value=>value.id===record.id);
        if(!current||JSON.stringify(current)!==draft.base)throw new Error("journal-conflict");
        const review=draft.review.trim();
        saved={...current,decision:draft.decision.trim(),review,reviewedAt:review?(review===textValue(current.review)?current.reviewedAt||null:Date.now()):null};
        return {...doc,decisions:doc.decisions.map(value=>value.id===record.id?saved:value)};
      });
      if(ok&&saved){setDraft({base:JSON.stringify(saved),decision:saved.decision,review:saved.review});setMessage(L("Krok a ohlédnutí jsou uložené.","Your step and reflection are saved."));}
      else setMessage(L("Uložení se nepodařilo. Rozepsaný text zůstává. Obnov uložené zápisy a zkontroluj případnou změnu.","Could not save. Your draft remains. Reload saved records and check for changes."));
    }catch{setMessage(L("Záznam se mezitím změnil. Rozepsaný text zůstává.","The record changed meanwhile. Your draft remains."));}
  };
  return <details className="sky-review-edit" onToggle={event=>{if(event.currentTarget.open&&!draft)setDraft(start());}}><summary>{L("Upravit můj krok a ohlédnutí","Edit my step and reflection")}</summary>
    {draft&&<><fieldset>
      <label htmlFor={`${id}-decision`}>{L("Moje rozhodnutí a další krok","My decision and next step")}</label><textarea id={`${id}-decision`} rows={3} maxLength={2000} value={draft.decision} readOnly={!ready} onChange={event=>{setDraft({...draft,decision:event.target.value});setMessage("");}}/>
      <label htmlFor={`${id}-review`}>{L("Moje ohlédnutí","My reflection")}</label><textarea id={`${id}-review`} rows={4} maxLength={4000} value={draft.review} readOnly={!ready} onChange={event=>{setDraft({...draft,review:event.target.value});setMessage("");}}/>
      {conflict&&<p role="alert" className="sky-small">{L("Tento záznam se mezitím změnil v jiné kartě. Rozepsaný text zůstává tady a uloženou verzi nepřepíše.","This record changed in another tab. Your draft stays here and will not overwrite the saved version.")}</p>}
      <div className="sky-actions"><button type="button" onClick={save} disabled={!ready||!dirty||Boolean(conflict)}>{L("Uložit ohlédnutí","Save reflection")}</button>{conflict&&<button type="button" className="sky-quiet" disabled={!ready} onClick={()=>{if(dirty&&!window.confirm(L("Nahradit rozepsaný text aktuální uloženou verzí?","Replace your draft with the current saved version?")))return;setDraft(start());setMessage("");}}>{L("Načíst aktuální záznam","Load current record")}</button>}</div>
    </fieldset>{message&&<p role="status" className="sky-small">{message}</p>}</>}
  </details>;
}

export function SkyArchive({journal,lang="cs",update,ready=false}){
  const L=(cs,en)=>lang==="en"?en:cs;
  const settingZone=journal?.settings?.location?.timeZone,zone=validTimeZone(settingZone)?settingZone:"UTC";
  const groups=[
    {id:"nostrils",title:L("Pozorování dechu","Breath observations"),rows:Array.isArray(journal?.nostrils)?journal.nostrils:[]},
    {id:"dreams",title:L("Sny","Dreams"),rows:Array.isArray(journal?.dreams)?journal.dreams:[]},
    {id:"decisions",title:L("Rozhodnutí","Decisions"),rows:Array.isArray(journal?.decisions)?journal.decisions:[]},
    {id:"practice",title:L("Zapsaná praxe","Recorded practice"),rows:Object.entries(journal?.practice||{}).map(([key,value])=>({...value,archiveKey:key}))},
    {id:"intentions",title:L("Záměry a pozorování","Intentions and observations"),rows:Object.entries(journal?.intentions||{}).map(([key,value])=>({...((typeof value==="string")?{text:value}:value),archiveKey:key}))},
  ];
  const first=groups.find(group=>group.rows.length)?.id;
  if(!first)return <p className="sky-small">{L("Zatím tu nejsou žádné uložené zápisy.","No saved records yet.")}</p>;
  const sideName=side=>({left:L("Levá","Left"),right:L("Pravá","Right"),both:L("Obě","Both"),unknown:L("Nevím","Unsure")})[side]||textValue(side);
  const comfortName=value=>value===true?L("Potvrzeno","Confirmed"):value===false?L("Nepotvrzeno","Not confirmed"):null;
  const withoutZone=groups.some(group=>group.rows.some(row=>recordTime(row.time)&&!validTimeZone(row.timeZone)));
  return <div className="sky-archive"><style>{styles}</style>
    {withoutZone&&<p className="sky-small">{L("Zápisy bez uloženého časového pásma se zobrazují v současném pásmu:","Records without a saved time zone use the current time zone:")} {zone}.</p>}
    {groups.map(group=><details className="sky-archive-group" key={group.id} open={group.id===first}><summary>{group.title}<small>{group.rows.length}</small></summary>
      {!group.rows.length?<p className="sky-small">{L("Bez zápisů.","No records.")}</p>:[...group.rows].sort((a,b)=>(recordTime(b.time)?.getTime()||0)-(recordTime(a.time)?.getTime()||0)).map((row,index)=>{
        const options=Array.isArray(row.options)?row.options:[],chosen=Number.isInteger(row.result)&&row.result>=0&&row.result<options.length?options[row.result]:row.result;
        const practiceId=row.archiveKey?.split(":").at(-1),practiceName=SKY_PRACTICES[practiceId]?.name;
        const slot=row.archiveKey?.split(":")[1],slotName=({morning:L("Ráno","Morning"),day:L("Přes den","Daytime"),evening:L("Večer","Evening")})[slot];
        return <article className="sky-record" key={row.id||row.archiveKey||`${row.time}:${index}`}>
          <Stamp value={row.time} timeZone={row.timeZone} fallbackZone={zone} lang={lang}/>
          {group.id==="nostrils"&&<><h4>{sideName(row.side)}</h4><dl className="sky-archive-fields"><Field label={L("Příjemný pocit v těle","Comfortable feeling in the body")}>{comfortName(row.comfort)}</Field><Field label={L("Poznámka","Note")}>{textValue(row.note)}</Field></dl></>}
          {group.id==="dreams"&&<><p>{row.text}</p><dl className="sky-archive-fields"><Field label={L("Prostředí snu","Dream setting")}>{Array.isArray(row.regions)?row.regions.map(region=>({upper:L("Hory a nebe","Mountains and sky"),middle:L("Lidská místa","Human places"),lower:L("Podzemí a voda","Underground and water")})[region]||region).join(" · "):null}</Field><Field label={L("Poznámka","Note")}>{textValue(row.note)}</Field></dl></>}
          {group.id==="decisions"&&<><h4>{row.question}</h4><dl className="sky-archive-fields">
            <Field label={L("Možnosti","Options")}>{options.length?<ol>{options.map((option,i)=><li key={i}>{i===row.result?<strong>{option}</strong>:option}</li>)}</ol>:null}</Field>
            <Field label={L("Uložený výsledek","Saved result")}>{chosen==null?L("Bez výsledku","No result"):String(chosen)}</Field>
            <Field label={L("Moje rozhodnutí a další krok","My decision and next step")}>{textValue(row.decision)}</Field>
            <Field label={L("Ohlédnutí","Reflection")}>{textValue(row.review)}</Field>
            <Field label={L("Datum ohlédnutí","Review date")}>{civilDate(row.reviewDate,lang)}</Field>
            <Field label={L("Ohlédnutí uložené","Reflection saved")}>{recordTime(row.reviewedAt)?<Stamp value={row.reviewedAt} timeZone={row.timeZone} fallbackZone={zone} lang={lang}/>:null}</Field>
            <Field label={L("Poznámka","Note")}>{textValue(row.note)}</Field>
            {row.observation&&<Field label={L("Související pozorování","Associated observation")}><span>{sideName(row.observation.side)}{typeof row.observation.comfort==="boolean"?` · ${L("příjemný pocit","comfortable feeling")}: ${comfortName(row.observation.comfort)}`:""}</span><Stamp value={row.observation.time} timeZone={row.observation.timeZone||row.timeZone} fallbackZone={zone} lang={lang}/>{textValue(row.observation.note)}</Field>}
          </dl><ReviewEdit record={row} update={update} ready={ready} lang={lang}/></>}
          {group.id==="practice"&&<><h4>{practiceName?L(...practiceName):practiceId}</h4><dl className="sky-archive-fields"><Field label={L("Den zápisu","Record day")}>{civilDate(row.day||row.archiveKey?.split(":")[0],lang)}</Field><Field label={L("Část dne","Time of day")}>{slotName}</Field><Field label={L("Uložený stav","Saved state")}>{row.done===true?L("Hotovo","Done"):row.done===false?L("Nezaškrtnuto","Unchecked"):null}</Field><Field label={L("Zápis","Record")}>{textValue(row.text)}</Field><Field label={L("Poznámka","Note")}>{textValue(row.note)}</Field></dl></>}
          {group.id==="intentions"&&<><h4>{periodName(row.archiveKey,lang)}</h4><p>{textValue(row.text)||L("Prázdný záměr","Empty intention")}</p>{row.note&&<dl className="sky-archive-fields"><Field label={L("Poznámka","Note")}>{textValue(row.note)}</Field></dl>}</>}
        </article>;
      })}
    </details>)}
  </div>;
}
