// Shared arithmetic has no person's balances, tax rates, allowances or dates.
// Main may inject its existing defaults; every client starts with neutral inputs.
import {financeDate} from './financeFlow.js';
export const FINANCE_JARS=['NEC','FFA','LTSS','EDU','PLAY','GIVE'];
export const financeNumber=value=>{const n=Number(String(value??'').replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:0;};
export const finISO=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
export const finParse=iso=>{const p=String(iso||'').split('-').map(Number);return new Date(p[0]||1970,(p[1]||1)-1,p[2]||1);};
export const finAddDays=(iso,n)=>{const d=finParse(iso);d.setDate(d.getDate()+n);return finISO(d);};
export const finDiffDays=(a,b)=>Math.round((finParse(b)-finParse(a))/86400000);
export function finDayInMonth(y,m,day){const last=new Date(y,m,0).getDate(),d=day==='last'?last:Math.min(last,Math.max(1,Number(day)||1));return y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0');}
export function finOccurrences(b,from0,to){
 const from=b.since&&b.since>from0?b.since:from0,out=[];if(from>to)return out;
 if(b.freq==='once')return financeDate(b.date)&&b.date>=from&&b.date<=to?[b.date]:[];
 if(b.freq==='year'){for(let y=+from.slice(0,4);y<=+to.slice(0,4);y++){const d=finDayInMonth(y,Number(b.month)||1,b.day);if(d>=from&&d<=to)out.push(d);}return out;}
 const d=finParse(from);d.setDate(1);const end=finParse(to);let guard=0;
 while(d<=end&&guard++<600){const date=finDayInMonth(d.getFullYear(),d.getMonth()+1,b.day);if(date>=from&&date<=to)out.push(date);d.setMonth(d.getMonth()+1);}return out;
}
export function financeTaxParameters(cfg={},defaults={}){
 const p={...defaults,...cfg.taxParameters},n=k=>Math.max(0,financeNumber(p[k]));
 return {healthAdvance:Math.max(0,financeNumber(cfg.zpZaloha??p.healthAdvance)),socialAdvance:Math.max(0,financeNumber(cfg.spZaloha??p.socialAdvance)),healthBase:n('healthBase'),healthRate:n('healthRate'),socialBase:n('socialBase'),socialRate:n('socialRate'),taxRate:n('taxRate'),higherRate:n('higherRate'),threshold:n('threshold'),credit:n('credit'),flatBands:[0,1,2].map(i=>Math.max(0,financeNumber(p.flatBands?.[i])))};
}
export function financeTaxEstimate(cfg={},defaults={}){
 const p=financeTaxParameters(cfg,defaults);
 if(cfg.taxMode==='pausal'){const m=p.flatBands[Math.min(3,Math.max(1,Number(cfg.taxPausalBand)||1))-1];return {rok:m*12,dan:0,zp:0,sp:0,pausal:m};}
 const profit=Math.max(0,financeNumber(cfg.taxProfit)),low=p.threshold>0?Math.min(profit,p.threshold):profit;
 const dan=Math.max(0,low*p.taxRate/100+Math.max(0,profit-low)*p.higherRate/100-p.credit);
 const zp=Math.max(p.healthAdvance*12,profit*p.healthBase/100*p.healthRate/100),sp=Math.max(p.socialAdvance*12,profit*p.socialBase/100*p.socialRate/100);
 return {rok:dan+zp+sp,dan,zp,sp,pausal:0};
}
export function financeObligations(coll={},today,defaults={}){
 const cfg=coll.finCfg||{},debts=(coll.debts||[]).filter(d=>d.dir!=='owed'&&!d.settled),bills=coll.bills||[],est=financeTaxEstimate(cfg,defaults),zbyva=Math.max(1,13-Number(today.slice(5,7)));
 const nastaveno=financeNumber(cfg.taxProfit)>0||financeNumber(cfg.taxPaid)>0||cfg.taxMode==='pausal';
 const rezerva=Math.max(0,Math.ceil(nastaveno?(est.rok-financeNumber(cfg.taxPaid))/zbyva:est.rok/12));
 const businessMonthly=bills.filter(b=>b.freq==='month'&&b.sys).reduce((s,b)=>s+financeNumber(b.amount),0);
 // Only the part already covered by the tax reserve is excluded from bills.
 // An account with no tax inputs must still count its own business payments.
 const mesicniPlatby=bills.filter(b=>b.freq==='month'&&!b.sys).reduce((s,b)=>s+financeNumber(b.amount),0)+Math.max(0,businessMonthly-rezerva),splatky=debts.reduce((s,d)=>s+financeNumber(d.monthly),0),zavazky=mesicniPlatby+splatky+rezerva,liquid=financeNumber(cfg.liquid);
 return {cfg,est,rezerva,zbyva,nastaveno,mesicniPlatby,splatky,zavazky,liquid,dnu:zavazky>0?Math.floor(liquid/(zavazky/30.44)):null,debts,bills};
}
export function financePaymentOccurrences(bills=[],log=[],from,to){
 const paid={},moved={};
 // Newest logs are stored first. First match wins, including paid records.
 for(const row of log){const key=row.billId+'|'+row.due;if(row.state==='moved'){if(!(key in moved))moved[key]=row.to;}else if(!(key in paid))paid[key]=row;}
 const out=[];
 for(const bill of bills){const original=new Set(finOccurrences(bill,from,to));for(const row of log)if(row.billId===bill.id&&row.state==='moved'&&row.to>=from&&row.to<=to)original.add(row.due);
  for(const due of original){const final=moved[bill.id+'|'+due]||due;if(!financeDate(final)||final<from||final>to)continue;out.push({bill,due:final,movedFrom:final!==due?due:null,log:paid[bill.id+'|'+final]||null});}
 }
 return out.sort((a,b)=>a.due.localeCompare(b.due));
}
