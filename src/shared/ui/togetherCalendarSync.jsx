import React,{useEffect,useMemo,useRef,useState} from 'react';
import {usePersonalProfile,isPersonalProfileVerified,refreshPersonalProfile} from './personalProfile.jsx';
import {emptyTogetherCalendar,TOGETHER_CALENDAR_SCOPE,googleCalendarRequest} from '../product/togetherCalendarSync.js';
import {syncTogetherCalendar} from '../product/togetherCalendarRun.js';
import {calendarSession,setCalendarSession,clearOtherCalendarSession,beginCalendarSync,endCalendarSync} from '../product/togetherCalendarSession.js';

let googleScript;
function loadGoogle(){
  if(window.google?.accounts?.oauth2)return Promise.resolve();
  if(!googleScript)googleScript=new Promise((resolve,reject)=>{
    let script=document.querySelector('script[data-tmgis="1"]');
    if(!script){script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.defer=true;script.dataset.tmgis='1';document.head.append(script);}
    const started=Date.now();
    const check=()=>{
      if(window.google?.accounts?.oauth2)return resolve();
      if(Date.now()-started>12000){googleScript=null;reject(new Error('google-unavailable'));return;}
      setTimeout(check,120);
    };check();
  });return googleScript;
}
async function api(path,method='GET',body,accountKey){const response=await fetch(`/api/together${path}`,{method,credentials:'same-origin',headers:{...(body?{'Content-Type':'application/json'}:{}),...(accountKey?{'X-Tanmay-Account-Key':accountKey}:{})},...(body?{body:JSON.stringify(body)}:{})});let data;try{data=await response.json();}catch{throw new Error('unavailable');}if(!response.ok||!data.ok)throw new Error(data.error||'unavailable');return data;}

// Recheck after every awaited boundary: a popup or another tab may change login.
async function verifiedAccount(accountKey){
  if(!isPersonalProfileVerified(accountKey))await refreshPersonalProfile();
  if(!isPersonalProfileVerified(accountKey))throw new Error('account-changed');
}
function accountRequests(accountKey){
  const guard=fn=>async(...args)=>{await verifiedAccount(accountKey);const value=await fn(...args);await verifiedAccount(accountKey);return value;};
  return {api:guard((path,method,body)=>api(path,method,body,accountKey)),request:guard(googleCalendarRequest),publicConfig:guard(async()=>{
    const response=await fetch('/api/calendar/config',{credentials:'same-origin',cache:'no-store'});
    if(!response.ok)throw new Error('calendar-config-unavailable');
    const data=await response.json();
    if(!data.ok)throw new Error('calendar-config-unavailable');
    return data.configured&&/^[a-zA-Z0-9._-]+\.apps\.googleusercontent\.com$/.test(data.clientId||'')?data.clientId:'';
  })};
}

export function TogetherCalendarBackground(){
  const {accountKey,status}=usePersonalProfile();
  useEffect(()=>{
    if(accountKey&&status==='ready')clearOtherCalendarSession(accountKey);
    if(!accountKey||status!=='ready')return;
    const scoped=accountRequests(accountKey);
    const run=async()=>{
      const session=calendarSession(accountKey);if(!isPersonalProfileVerified(accountKey)||!session||session.expires<=Date.now()||document.visibilityState!=='visible'||!beginCalendarSync())return;
      try{let saved=await scoped.api('/calendar');if(!saved.config.calendarId)return;
        await syncTogetherCalendar({token:session.value,config:saved.config,...scoped,checkpoint:async config=>{saved=await scoped.api('/calendar','PUT',{config,revision:saved.revision});}});
        window.dispatchEvent(new Event('tm-together-calendar-updated'));
      }catch(error){if(error.message==='google-sign-in-required')setCalendarSession(null);if(error.message!=='account-changed')window.dispatchEvent(new CustomEvent('tm-together-calendar-error',{detail:error.message}));}finally{endCalendarSync();}
    };
    const timer=setInterval(run,60000);window.addEventListener('focus',run);return()=>{clearInterval(timer);window.removeEventListener('focus',run);};
  },[accountKey,status]);
  return null;
}

export function TogetherCalendarSettings({lang='cs',allowManualClientId=false}){
  const {accountKey,status:accountStatus}=usePersonalProfile(),[loadedAccount,setLoadedAccount]=useState(null),[config,setConfig]=useState(emptyTogetherCalendar),[revision,setRevision]=useState(0),[status,setStatus]=useState('loading'),[message,setMessage]=useState(''),[authorized,setAuthorized]=useState(false),[choices,setChoices]=useState({});
  const token=useRef(null),busy=useRef(false),latest=useRef({config,revision});latest.current={config,revision};
  const [publicClientId,setPublicClientId]=useState(''),[googleStatus,setGoogleStatus]=useState('idle'),[googleAttempt,setGoogleAttempt]=useState(0);
  const L=(cs,en)=>lang==='en'?en:cs,scoped=useMemo(()=>accountRequests(accountKey),[accountKey]);
  // Existing calendars keep the OAuth project that created them. A new one
  // uses the application's public configuration; no client types an ID.
  const clientId=config.calendarId&&config.clientId?config.clientId:publicClientId||config.clientId;
  useEffect(()=>{
    token.current=calendarSession(accountKey);setAuthorized(!!token.current&&token.current.expires>Date.now());setPublicClientId('');
    if(!accountKey)return;let active=true;
    const load=()=>Promise.all([scoped.api('/calendar'),scoped.publicConfig().catch(error=>{if(error.message==='account-changed')throw error;return '';})])
      .then(([data,publicId])=>{if(active){setLoadedAccount(accountKey);setPublicClientId(publicId);setConfig(data.config);setRevision(data.revision);setStatus('ready');}})
      .catch(()=>{if(active)setStatus('error');});
    load();window.addEventListener('tm-together-calendar-updated',load);
    return()=>{active=false;window.removeEventListener('tm-together-calendar-updated',load);};
  },[accountKey,scoped]);
  // Load GIS before the tap so Safari can open its authorization popup during
  // the user's gesture. Loading the library never requests calendar access.
  useEffect(()=>{
    if(loadedAccount!==accountKey||!clientId)return;
    let active=true;setGoogleStatus('loading');
    loadGoogle().then(()=>{if(active){setGoogleStatus('ready');setMessage('');}})
      .catch(()=>{if(active){setGoogleStatus('error');setMessage(L('Google se nepodařilo načíst. Zkontroluj připojení a zkus to znovu.','Google could not load. Check your connection and try again.'));}});
    return()=>{active=false;};
  },[loadedAccount,accountKey,clientId,googleAttempt,lang]);
  const save=async next=>{const data=await scoped.api('/calendar','PUT',{config:next,revision:latest.current.revision});latest.current={config:data.config,revision:data.revision};setConfig(data.config);setRevision(data.revision);return data.config;};
  const explain=error=>({
    'account-changed':L('Účet se změnil nebo čeká na ověření. Otevři nastavení znovu.','Your account changed or awaits verification. Reopen settings.'),
    'not-connected':L('Nejdřív potvrďte propojení ve Spolu.','First confirm your Together connection.'),
    'google-sign-in-required':L('Přihlášení ke Googlu vypršelo. Obnov jej tlačítkem níže.','Google authorization expired. Renew it below.'),
    'google-scope-required':L('Google nepovolil přístup ke kalendáři vytvořenému aplikací. Připojení potvrď znovu.','Google did not grant access to the app-created calendar. Connect again.'),
    'conflict':L('Nastavení se změnilo v jiném zařízení. Zavři nastavení, znovu je otevři a zkontroluj stav.','Settings changed on another device. Close and reopen settings to review them.'),
    'google-unavailable':L('Google se nepodařilo načíst. Zkontroluj připojení a zkus to znovu.','Google could not load. Check your connection and try again.'),
    'invalid-client-id':L('Propojení Google kalendáře ještě není pro tuto aplikaci nastavené.','Google Calendar connection has not been configured for this app yet.'),
  }[error.message]||L('Synchronizace se nedokončila. Uložené plány zůstávají. Zkus to znovu.','Sync did not complete. Saved plans remain. Try again.'));
  const synchronize=async(resolve={})=>{
    if(!isPersonalProfileVerified(accountKey)||busy.current)return;if(!token.current||token.current.expires<=Date.now()){setAuthorized(false);setMessage(explain(new Error('google-sign-in-required')));return;}if(!beginCalendarSync())return;
    busy.current=true;setStatus('busy');try{const result=await syncTogetherCalendar({token:token.current.value,config:latest.current.config,...scoped,checkpoint:save,resolve});setChoices({});setMessage(result.conflicts?L(`${result.conflicts} změn potřebuje tvoji volbu.`,`${result.conflicts} changes need your choice.`):L(`Hotovo. Z Googlu ${result.imported}, do Googlu ${result.exported}.`,`Done. From Google ${result.imported}, to Google ${result.exported}.`));window.dispatchEvent(new Event('tm-together-calendar-updated'));}catch(error){setMessage(explain(error));if(error.message==='google-sign-in-required'){token.current=null;setCalendarSession(null);setAuthorized(false);}}finally{busy.current=false;setStatus('ready');endCalendarSync();}
  };
  const connect=async()=>{
    if(!isPersonalProfileVerified(accountKey))return;
    if(!clientId){setMessage(explain(new Error('invalid-client-id')));return;}
    // A failed preload is retried separately. Never open a popup after an
    // awaited load or account request, which loses Safari's tap activation.
    if(googleStatus!=='ready'||!window.google?.accounts?.oauth2){setGoogleAttempt(value=>value+1);return;}
    setStatus('busy');try{const auth=await new Promise((resolve,reject)=>{window.google.accounts.oauth2.initTokenClient({client_id:clientId,scope:TOGETHER_CALENDAR_SCOPE,include_granted_scopes:false,callback:response=>response.error?reject(new Error('google-sign-in-required')):resolve(response),error_callback:()=>reject(new Error('google-sign-in-required'))}).requestAccessToken({prompt:'select_account'});});
      await verifiedAccount(accountKey);
      if(!window.google.accounts.oauth2.hasGrantedAllScopes(auth,TOGETHER_CALENDAR_SCOPE))throw new Error('google-scope-required');
      const state=await scoped.api('');if(state.link?.status!=='active')throw new Error('not-connected');
      let next={...config,clientId,linkId:state.link.id};
      if(next.calendarId&&config.linkId!==state.link.id)throw new Error('not-connected');
      if(!next.calendarId){const calendar=await scoped.request(auth.access_token,'/calendars',{method:'POST',body:{summary:next.calendarName,timeZone:next.timeZone}});next={...next,calendarId:calendar.id};}
      else await scoped.request(auth.access_token,`/calendars/${encodeURIComponent(next.calendarId)}`);
      // Token is never sent to our API, local storage, logs or exports.
      await save(next);await verifiedAccount(accountKey);token.current={accountKey,value:auth.access_token,expires:Date.now()+Math.max(0,Number(auth.expires_in)-60)*1000};setCalendarSession(token.current);setAuthorized(true);setMessage(L('Google je připojený. Synchronizuji společné plány…','Google is connected. Syncing your shared plans…'));await synchronize();
    }catch(error){setMessage(explain(error));}finally{setStatus('ready');}
  };
  const disconnect=async()=>{if(!isPersonalProfileVerified(accountKey))return;setStatus('busy');try{await save({...emptyTogetherCalendar(),clientId:config.clientId,timeZone:config.timeZone});if(token.current&&window.google?.accounts?.oauth2)window.google.accounts.oauth2.revoke(token.current.value,()=>{});token.current=null;setCalendarSession(null);setAuthorized(false);setMessage(L('Odpojeno. Události v Googlu zůstaly.','Disconnected. Google events remain.'));}catch(error){setMessage(explain(error));}finally{setStatus('ready');}};
  if(accountStatus==='checking')return <p role="status">{L('Ověřuji účet…','Verifying account…')}</p>;
  if(!accountKey||accountStatus!=='ready'||loadedAccount!==accountKey)return <p>{L('Kalendář je dostupný po načtení profilu účtu.','The calendar is available once your account profile loads.')}</p>;
  return <div className="tm-personal-form">
    <p>{config.calendarId?(authorized?L('Připojeno pro tuto návštěvu.','Connected for this visit.'):L('Kalendář je uložený. Obnov přihlášení ke Googlu.','Calendar saved. Renew Google authorization.')):L('Pro společné plány vznikne samostatný kalendář tanmay · Spolu.','A separate tanmay · Together calendar will hold your shared plans.')}</p>
    <p>{L('Dohodnuté plány putují do Googlu. Změny z Googlu a nově přidané události se vracejí jako návrhy k potvrzení. Zrušení plánu se přenáší oběma směry.','Agreed plans go to Google. Changes and new Google events return as proposals to confirm. Cancellations travel both ways.')}</p>
    <p>{L('Synchronizace běží při otevřené aplikaci a platném přihlášení ke Googlu. Celodenní a opakované události se nepřenášejí.','Sync runs while the app is open and Google authorization is valid. All-day and recurring events are not transferred.')}</p>
    {!clientId&&status!=='loading'&&<p role="status">{L('Propojení Google kalendáře ještě není pro tuto aplikaci nastavené. Technické nastavení doplní správce aplikace.','Google Calendar connection has not been configured for this app yet. The app administrator will complete the setup.')}</p>}
    {!config.calendarId&&<details><summary>{L('Pokročilé nastavení','Advanced settings')}</summary>{allowManualClientId&&!publicClientId&&<><label>{L('Google OAuth Client ID','Google OAuth Client ID')}<input aria-label="Google OAuth Client ID" value={config.clientId} onChange={event=>setConfig({...config,clientId:event.target.value.trim()})} placeholder="…apps.googleusercontent.com"/></label><p>{L('Nastavení správce aplikace. Tajný klíč sem nepatří.','App administrator setting. Do not enter a client secret here.')}</p></>}<label>{L('Časové pásmo kalendáře','Calendar time zone')}<input value={config.timeZone} onChange={event=>setConfig({...config,timeZone:event.target.value})}/></label></details>}
    <div className="tm-personal-actions"><button type="button" disabled={status==='busy'||status==='loading'||!clientId||(!authorized&&googleStatus==='loading')} onClick={authorized?()=>synchronize():connect}>{status==='busy'?L('Pracuji…','Working…'):authorized?L('Synchronizovat teď','Sync now'):googleStatus==='loading'?L('Načítám Google…','Loading Google…'):googleStatus==='error'?L('Zkusit načíst Google','Retry loading Google'):config.calendarId?L('Obnovit přihlášení','Renew authorization'):L('Připojit Google','Connect Google')}</button>{config.calendarId&&<button type="button" disabled={status==='busy'} onClick={disconnect}>{L('Odpojit','Disconnect')}</button>}</div>
    {!!config.lastSync&&<p>{L('Poslední synchronizace: ','Last sync: ')}{new Date(config.lastSync).toLocaleString(lang==='en'?'en-GB':'cs-CZ')}</p>}<p role="status">{message}</p>
    {!!config.conflicts.length&&<div><h4>{L('Změněno na obou místech','Changed in both places')}</h4>{config.conflicts.map((item,index)=><fieldset key={item.eventId}><legend>{item.title||`${L('Plán','Plan')} ${index+1}`}</legend><p>{L('V aplikaci: ','In the app: ')}{item.appWhen||L('Změna čeká na načtení.','Change awaits refresh.')}<br/>{L('V Googlu: ','In Google: ')}{item.googleCancelled?L('Zrušeno','Cancelled'):[item.googleTitle,item.googleWhen].filter(Boolean).join(' · ')||L('Změna čeká na načtení.','Change awaits refresh.')}</p><label><input type="radio" name={`calendar-${item.eventId}`} checked={choices[item.eventId]==='app'} onChange={()=>setChoices({...choices,[item.eventId]:'app'})}/>{L('Použít dohodu z aplikace','Use the app agreement')}</label><label><input type="radio" name={`calendar-${item.eventId}`} checked={choices[item.eventId]==='google'} onChange={()=>setChoices({...choices,[item.eventId]:'google'})}/>{item.googleCancelled?L('Potvrdit zrušení z Googlu','Accept the Google cancellation'):L('Převzít Google jako nový návrh','Use Google as a new proposal')}</label></fieldset>)}<button type="button" disabled={status==='busy'||!authorized||config.conflicts.some(item=>!choices[item.eventId])} onClick={()=>synchronize(choices)}>{L('Vyřešit změny','Resolve changes')}</button></div>}
  </div>;
}
