import React,{useState,useEffect} from 'react';
import {financeDays,marketSymbol,financeSignedValue} from '../product/financeViewsModel.js';
export function createFinanceViews({useT,useStore,L,money,uid,todayISO}) {
  const flowAmount=(value,flow,compact=false)=>{const n=financeSignedValue(value,flow);return(n<0?'−':'+')+(compact?new Intl.NumberFormat(L('cs','en'),{notation:Math.abs(n)>=10000?'compact':'standard',maximumFractionDigits:0}).format(Math.abs(n)):money(Math.abs(n)));};
  function BufferedInput({value,onCommit,type='text',...props}) {
    const [draft,setDraft]=useState(String(value??''));
    useEffect(()=>setDraft(String(value??'')),[value]);
    return <input {...props} type={type} step={type==='number'?'any':undefined} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={()=>{if(draft!==String(value??''))onCommit(draft)}} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur()}}/>;
  }
  const button=t=>({background:'transparent',border:'1px solid '+t.border,borderRadius:8,color:t.text,padding:'9px 12px',minHeight:42,cursor:'pointer',fontFamily:'var(--tm-font-body)',fontSize:13});
  function FinanceCalendar({month,income,expenses}) {
    const {t}=useT();const [day,setDay]=useState('');
    useEffect(()=>setDay(''),[month]);
    const cells=financeDays(month,income,expenses),selected=cells.find(d=>d?.date===day);
    return <section aria-label={L('Denní přehled peněz','Daily money overview')} style={{margin:'16px 0 24px',fontFamily:'var(--tm-font-body)',fontVariantNumeric:'tabular-nums'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:3}}>
        {L(['Po','Út','St','Čt','Pá','So','Ne'],['Mo','Tu','We','Th','Fr','Sa','Su']).map(x=><span key={x} style={{textAlign:'center',fontSize:12,padding:5,color:t.textSec}}>{x}</span>)}
        {cells.map((d,i)=>d?<button key={d.date} onClick={()=>setDay(d.date)} aria-pressed={day===d.date} aria-label={`${d.date}, ${L('příjmy','income')} ${money(d.income)}, ${L('výdaje','expenses')} ${money(d.expenses)}`} style={{...button(t),padding:'7px 1px',minHeight:64,borderColor:day===d.date?t.accent:t.borderSoft,background:day===d.date?t.card:'transparent',fontSize:13}}>{d.day}<span style={{display:'block',fontSize:9,marginTop:4,color:t.textSec,whiteSpace:'nowrap'}}>{d.income?flowAmount(d.income,'income',true):' '}</span><span style={{display:'block',fontSize:9,color:t.accentInk||t.accent,whiteSpace:'nowrap'}}>{d.expenses?flowAmount(d.expenses,'expense',true):' '}</span></button>:<span key={'blank'+i}/>)}
      </div>
      <p style={{fontSize:11,color:t.textSec}}>{L('Částky v Kč. Vyber den pro jednotlivé položky.','Amounts in CZK. Choose a day for individual entries.')}</p>
      {selected&&<div style={{marginTop:16}}><h3 style={{fontFamily:'var(--tm-font-display)',fontSize:23,fontWeight:400}}>{selected.day}. {+month.slice(5)}.</h3>{!selected.rows.length?<p style={{fontSize:13,color:t.textSec}}>{L('Tento den bez záznamu.','No entries on this day.')}</p>:selected.rows.map((r,i)=><div key={r.id||i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid '+t.borderSoft,fontSize:13}}><span style={{flex:1}}>{r.item||r.source||L('Bez názvu','Untitled')}</span><span>{flowAmount(r.amount,r.flow)}</span></div>)}</div>}
    </section>;
  }
  function InvestmentPortfolio() {
    const {t}=useT(),st=useStore();const rows=st.coll.investments||[];
    const [opened,setOpened]=useState(null),[online,setOnline]=useState(typeof navigator==='undefined'||navigator.onLine);
    useEffect(()=>{const update=()=>setOnline(navigator.onLine);window.addEventListener('online',update);window.addEventListener('offline',update);return()=>{window.removeEventListener('online',update);window.removeEventListener('offline',update)}},[]);
    const chart=(symbol='NASDAQ:AAPL')=>'/market-chart.html?symbol='+encodeURIComponent(symbol)+'&theme='+t.mode+'&lang='+L('cs','en')+'&watchlist='+encodeURIComponent(rows.map(r=>marketSymbol(r.symbol)).filter(Boolean).slice(0,30).join(','));
    const edit=(r,p)=>st.updateEntry('investments',r.id,p);
    return <section aria-label={L('Investice','Investments')} style={{fontFamily:'var(--tm-font-body)'}}>
      <a href={chart()} style={{...button(t),display:"flex",justifyContent:"space-between",textDecoration:"none",marginBottom:12,minHeight:44,alignItems:"center"}}>{L("Trhy · hledat aktivum","Markets · find an asset")} <span aria-hidden="true">↗</span></a><p style={{fontSize:12,color:t.textSec,lineHeight:1.6,margin:'0 0 12px'}}>{L('Vyhledej název nebo symbol v přehledu Trhy. Cena, graf a údaje o trhu se načtou společně. Své pozice najdeš níže.','Search a name or symbol in Markets. Price, chart and market details load together. Your positions are below.')}</p>
      {rows.map(r=>{const active=opened===r.id,symbol=marketSymbol(r.symbol);return <div key={r.id} data-tm-surface="row" data-tm-surface-active={active} data-tm-surface-editor={active} style={{borderBottom:'1px solid '+t.borderSoft,padding:'6px 0'}}>
        <button aria-expanded={active} onClick={()=>setOpened(active?null:r.id)} style={{...button(t),border:0,width:'100%',display:'flex',alignItems:'center',gap:10,textAlign:'left',padding:'10px 0'}}><span style={{flex:1,minWidth:0}}><strong style={{fontWeight:500}}>{r.asset||L('Pojmenovat aktivum','Name this asset')}</strong><small style={{display:'block',marginTop:4,color:t.textSec}}>{symbol||r.date||L('Ruční evidence','Manual record')}</small></span><span style={{textAlign:'right'}}>{money(r.amount)}<small style={{display:'block',fontSize:10,color:t.textSec}}>{L('uložená hodnota','saved value')}</small></span><span aria-hidden="true">{active?'−':'+'}</span></button>
        {active&&<div style={{padding:'4px 0 18px'}}>
          <details><summary style={{cursor:"pointer",padding:"12px 0"}}>{L("Moje pozice · upravit údaje","My position · edit details")}</summary><div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12}}>
            {[['asset',L('Aktivum','Asset'),'text'],['symbol',L('Symbol na trhu','Market symbol'),'text'],['quantity',L('Počet jednotek','Units'),'number'],['buyPrice',L('Nákupní cena / jednotka','Purchase price / unit'),'number'],['currency',L('Měna nákupu','Purchase currency'),'text'],['amount',L('Uložená hodnota v Kč','Saved value in CZK'),'number']].map(([key,label,type])=><label key={key} style={{fontSize:12,color:t.textSec,minWidth:0}}>{label}<BufferedInput type={type} value={r[key]??''} onCommit={v=>edit(r,{[key]:key==='symbol'?v.trim().toUpperCase():v})} placeholder={key==='symbol'?'NASDAQ:AAPL':key==='currency'?'CZK':''} style={{...button(t),width:'100%',minWidth:0,boxSizing:'border-box',marginTop:4,cursor:'text'}}/></label>)}
          </div>
          <p style={{fontSize:11,color:t.textSec,lineHeight:1.6}}>{L('Symbol včetně burzy, například NASDAQ:AAPL nebo COINBASE:BTCUSD. Graf ukazuje tržní cenu v měně aktiva; nepřepisuje tvou uloženou hodnotu v Kč.','Use exchange:symbol, for example NASDAQ:AAPL or COINBASE:BTCUSD. The chart shows the asset market price in its currency; it does not overwrite your saved CZK value.')}</p>
          </details>{symbol&&online?<><a href={chart(symbol)} style={{...button(t),display:'inline-flex',alignItems:'center',textDecoration:'none',marginBottom:10}}>{L('Otevřít přehled aktiva ↗','Open asset overview ↗')}</a><details><summary style={{cursor:'pointer',fontSize:12,marginBottom:10,color:t.textSec}}>{L('Zobrazit graf přímo tady','Show chart here')}</summary><iframe key={symbol+t.mode} title={L('Cena a graf ','Price and chart ')+(r.asset||symbol)} src={'/market-chart.html?symbol='+encodeURIComponent(symbol)+'&theme='+t.mode+'&lang='+L('cs','en')} style={{width:'100%',height:430,border:'1px solid '+t.borderSoft,borderRadius:8,background:t.card}} sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"/></details><a href={'https://www.tradingview.com/chart/?symbol='+encodeURIComponent(symbol)} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',fontSize:12,color:t.textSec,marginTop:8}}>{L('Otevřít graf na TradingView','Open chart on TradingView')}</a><p style={{fontSize:11,color:t.textSec}}>{L('Data: TradingView. Podle trhu mohou být zpožděná.','Data: TradingView. Quotes may be delayed depending on the market.')}</p></>:<p style={{fontSize:13,color:t.textSec}}>{!online?L('Offline. Uložená pozice je k dispozici.','Offline. Your saved position is available.'):L('Doplň symbol pro aktuální cenu a graf.','Add a symbol to see its price and chart.')}</p>}
          <label style={{fontSize:12,color:t.textSec}}>{L('Poznámka','Note')}<BufferedInput value={r.note||''} onCommit={v=>edit(r,{note:v})} style={{...button(t),width:'100%',boxSizing:'border-box',marginTop:4}}/></label>
          <button onClick={()=>st.ask(L('Přesunout investici do koše?','Move this investment to trash?'),()=>{st.removeEntry('investments',r.id);setOpened(null)},{soft:true})} style={{...button(t),marginTop:12}}>{L('Do koše','Move to trash')}</button>
        </div>}
      </div>})}
      <button onClick={()=>{const id=uid();st.addEntry('investments',{id,date:todayISO(),asset:'',amount:'',symbol:'',quantity:'',buyPrice:'',currency:'CZK'});setOpened(id)}} style={{...button(t),marginTop:12}}>{L('Přidat investici','Add investment')}</button>
    </section>;
  }
  return {FinanceCalendar,InvestmentPortfolio};
}
