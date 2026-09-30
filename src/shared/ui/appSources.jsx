import React from 'react';
import * as Cycle from '../product/togetherCycleDepth.js';
import * as Connection from '../product/togetherConnectionContent.js';
import {TOGETHER_RITUAL_SOURCES} from '../product/togetherRituals.js';
import {SKY_SOURCES} from '../product/skyContent.js';
import {SkyHelpIndex} from './skyHelpIndex.jsx';

export function AppSources({lang='cs',topic='obloha',trainingSources=[]}){
  const at=value=>Array.isArray(value)?value[lang==='en'?1:0]:typeof value==='object'?(value?.[lang]||value?.cs||''):value;
  const L=(cs,en)=>lang==='en'?en:cs;
  const links=items=><ul>{items.map(item=><li key={item.id||item.url}><a href={item.url} target="_blank" rel="noreferrer">{at(item.title)}</a></li>)}</ul>;
  return <div className="tm-app-sources">
    <details open={topic==='obloha'}><summary>{L('Obloha: výpočty a tradice','Sky: calculations and traditions')}</summary>{SKY_SOURCES.map(item=><details key={item.id}><summary>{at(item.title)}</summary><p>{at(item.text)}</p>{links((item.links||[]).map(([title,url])=>({title,url})))}</details>)}<SkyHelpIndex lang={lang}/></details>
    <details open={topic==='cycle'}><summary>{L('Cyklus, tělo a jídlo','Cycle, body and food')}</summary>{(Cycle.CYCLE_METHOD_NOTES||[]).map((item,index)=>item.text?<details key={index}><summary>{at(item.title)}</summary><p>{at(item.text)}</p></details>:<p key={index}>{at(item)}</p>)}{links(Cycle.CYCLE_DEPTH_SOURCES)}</details>
    <details open={topic==='together'}><summary>{L('Rozhovory a společné chvíle','Conversations and shared moments')}</summary>{(Connection.RELATIONSHIP_SOURCE_NOTES||[]).map((item,index)=><p key={index}>{at(item)}</p>)}{links([...TOGETHER_RITUAL_SOURCES,...(Connection.RELATIONSHIP_SOURCES||[])].filter((item,index,all)=>all.findIndex(other=>other.url===item.url)===index))}</details>
    {trainingSources.length>0&&<details open={topic==='training'}><summary>{L('Trénink a knihovna postupů','Training and the methods library')}</summary>{trainingSources.map(doc=><details key={doc.id}><summary>{at(doc.title)}</summary><p>{doc.author}</p>{doc.notes.map((note,index)=><details key={index}><summary>{at(note.title)}</summary><p>{at(note.text)}</p></details>)}<ul>{doc.sources.map((source,index)=><li key={index}>{at(source)}</li>)}</ul>{doc.assets?.length>0&&links(doc.assets)}</details>)}</details>}
    <details><summary>{L('Kalendář a synchronizace','Calendar and synchronization')}</summary><p>{L('Spolu používá oddělený kalendář vytvořený aplikací. Přenáší jen společné plány. Změny času nebo názvu z Googlu se vracejí jako návrh, který druhý člověk znovu potvrdí. Přístupový token zůstává pouze v paměti prohlížeče.','Together uses a separate app-created calendar and only transfers shared plans. Changes to time or title from Google return as a proposal for the other person to confirm. The access token stays only in browser memory.')}</p>{links([{title:'Google Calendar: incremental synchronization',url:'https://developers.google.com/workspace/calendar/api/guides/sync'},{title:'Google Identity: token model',url:'https://developers.google.com/identity/oauth2/web/guides/use-token-model'}])}</details>
  </div>;
}
