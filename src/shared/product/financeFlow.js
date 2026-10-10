import {shiftPersonalMonth, validPersonalDate} from "./personalRooms.js";

// Accept both current ISO records and the original imported Czech ledger dates.
export function financeDate(value) {
  const raw = String(value || "").trim();
  if (validPersonalDate(raw)) return raw;
  const match = raw.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (!match) return "";
  const iso = `${match[3]}-${match[2].padStart(2,"0")}-${match[1].padStart(2,"0")}`;
  return validPersonalDate(iso) ? iso : "";
}
const cents = value => {const number=Number(value);return Number.isFinite(number)&&Number.isSafeInteger(Math.round(number*100))?Math.round(number*100):0;};
export function financeAmount(value) {
  const text=String(value??"").trim().replace(/\s/g,"").replace(",",".");
  if(!/^-?\d+(?:\.\d{1,2})?$/.test(text))return null;
  const amount=Number(text),integer=Math.round(amount*100);
  return Number.isSafeInteger(integer)&&integer!==0?integer/100:null;
}
export function financeRows(coll, month, historicExpenses = []) {
  return ["income","expenses"].flatMap(kind => [
    ...(Array.isArray(coll?.[kind])?coll[kind]:[]).map(entry=>({entry,kind,archived:false})),
    ...(kind==="expenses"?historicExpenses.map(entry=>({entry,kind,archived:true})):[]),
  ]).map(row=>({...row,date:financeDate(row.entry.date),cents:cents(row.entry.amount)}))
    .filter(row=>row.date && (!month || row.date.slice(0,7)===month))
    .sort((a,b)=>b.date.localeCompare(a.date)||String(a.entry.id||"").localeCompare(String(b.entry.id||"")));
}
export function financeSummary(rows) {
  const received = rows.filter(row=>row.kind==="income").reduce((sum,row)=>sum+row.cents,0);
  const spent = rows.filter(row=>row.kind==="expenses").reduce((sum,row)=>sum+row.cents,0);
  return {received:received/100,spent:spent/100,balance:(received-spent)/100,count:rows.length};
}
export function financeHistory(coll, endingMonth, historicExpenses = []) {
  return Array.from({length:6},(_,index)=>{
    const month=shiftPersonalMonth(endingMonth,index-5);
    return {month,...financeSummary(financeRows(coll,month,historicExpenses))};
  });
}
export function financeCategories(rows) {
  const categories = new Map();
  rows.filter(row=>row.kind==="expenses").forEach(row=>{
    const key=String(row.entry.jar||row.entry.category||"").trim();
    const previous=categories.get(key)||{key,cents:0,count:0};
    categories.set(key,{...previous,cents:previous.cents+row.cents,count:previous.count+1});
  });
  return [...categories.values()].sort((a,b)=>b.cents-a.cents||a.key.localeCompare(b.key)).map(row=>({...row,amount:row.cents/100}));
}
const normalize=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();
export function filterFinanceRows(rows,{kind="all",query="",category=null}={}) {
  const search=normalize(query).trim();
  return rows.filter(row=>(kind==="all"||row.kind===kind) && (category===null||String(row.entry.jar||row.entry.category||"").trim()===category) && (!search||normalize([row.entry.item,row.entry.source,row.entry.note,row.entry.jar,row.entry.category,row.date,row.entry.amount].join(" ")).includes(search)));
}
