export function financeSignedValue(value,flow='income'){const n=Number(String(value??'').replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n*(flow==='expense'?-1:1):0;}
export function marketSymbol(value){const s=String(value||'').trim().toUpperCase();return /^[A-Z0-9_]{2,20}:[A-Z0-9._!-]{1,32}$/.test(s)?s:'';}
export function marketChartUrl(value,theme='light',lang='cs'){
 const symbol=marketSymbol(value);if(!symbol)return '';
 return 'https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale='+ (lang==='cs'?'cs':'en')+'#'+encodeURIComponent(JSON.stringify({symbol,interval:'D',timezone:'Europe/Prague',theme:theme==='dark'?'dark':'light',style:'3',allow_symbol_change:false,withdateranges:true,width:'100%',height:'100%'}));
}
export function financeDays(month,income=[],expenses=[]){
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))return [];
 const [year,m]=month.split('-').map(Number),days=new Date(year,m,0).getDate(),offset=(new Date(year,m-1,1).getDay()+6)%7;
 const rows=[...income.map(r=>({...r,flow:'income'})),...expenses.map(r=>({...r,flow:'expense'}))];
 const sum=xs=>xs.reduce((a,r)=>{const n=Number(String(r.amount??'').replace(/\s/g,'').replace(',','.'));return a+(Number.isFinite(n)?n:0)},0);
 return [...Array(offset).fill(null),...Array.from({length:days},(_,i)=>{const date=month+'-'+String(i+1).padStart(2,'0'),daily=rows.filter(r=>String(r.date||'').slice(0,10)===date);return {date,day:i+1,income:sum(daily.filter(r=>r.flow==='income')),expenses:sum(daily.filter(r=>r.flow==='expense')),rows:daily}})];
}
