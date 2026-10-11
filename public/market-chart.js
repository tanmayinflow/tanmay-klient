// Official TradingView embed. Only the public symbol is passed, never holdings.
const query=new URLSearchParams(location.search),symbol=query.get('symbol')||'NASDAQ:AAPL';
const cs=query.get('lang')!=='en';
document.documentElement.lang=cs?'cs':'en';
document.documentElement.dataset.theme=query.get('theme')==='dark'?'dark':'light';
document.querySelector('#back').textContent=cs?'‹ Zpět do aplikace':'‹ Back to app';
document.querySelector('h1').textContent=cs?'Trhy':'Markets';
document.querySelector('#hint').textContent=cs?'Klepni na název aktiva nad grafem a vyhledej firmu, fond nebo kryptoměnu.':'Tap the asset name above the chart to search for a company, fund or cryptocurrency.';
document.querySelector('#back').addEventListener('click',event=>{if(document.referrer.startsWith(location.origin)&&history.length>1){event.preventDefault();history.back()}});
if(/^[A-Z0-9_]{2,20}:[A-Z0-9._!-]{1,32}$/.test(symbol)){
 const script=document.createElement('script');script.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';script.async=true;
 const watchlist=(query.get('watchlist')||'').split(',').filter(s=>/^[A-Z0-9_]{2,20}:[A-Z0-9._!-]{1,32}$/.test(s)).slice(0,30);
 const config={autosize:true,symbol,interval:'D',timezone:'Europe/Prague',theme:query.get('theme')==='dark'?'dark':'light',style:'1',locale:cs?'cs':'en',allow_symbol_change:true,details:true,watchlist,hide_top_toolbar:false,hide_side_toolbar:false,hide_legend:false,withdateranges:true,save_image:false,support_host:'https://www.tradingview.com'};
 script.textContent=JSON.stringify(config);
 const fullscreen=document.querySelector('#fullscreen');
 fullscreen.textContent=cs?'Otevřít graf na celé obrazovce ↗':'Open full-screen chart ↗';
 fullscreen.href='https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale='+(cs?'cs':'en')+'#'+encodeURIComponent(JSON.stringify({...config,width:'100%',height:'100%'}));
 document.querySelector('#chart').appendChild(script);document.querySelector('#source').href='https://www.tradingview.com/chart/?symbol='+encodeURIComponent(symbol);
}
