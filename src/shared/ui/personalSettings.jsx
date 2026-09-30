import React,{useEffect,useState} from 'react';
import {PersonalProfileSettings,PersonalProfileLifecycle} from './personalProfile.jsx';
import {AppSources} from './appSources.jsx';
import {TogetherCalendarSettings,TogetherCalendarBackground} from './togetherCalendarSync.jsx';

export function PersonalSettingsSections({t,lang='cs',section='',topic='obloha',trainingSources=[]}){
  const L=(cs,en)=>lang==='en'?en:cs;
  return <div className="tm-personal-settings" style={{'--personal-border':t.border,'--personal-accent':t.accent,'--personal-text':t.text,color:t.text}}>
    <style>{`.tm-personal-settings{font-family:var(--ff-body,"DM Sans",sans-serif);font-size:14px;line-height:1.65}.tm-personal-settings>details{margin:12px 0;padding:6px 0}.tm-personal-settings summary{cursor:pointer;min-height:44px;display:list-item;align-content:center}.tm-personal-settings p{max-width:68ch;font-size:13px}.tm-personal-settings a{color:var(--personal-accent);text-underline-offset:4px}.tm-personal-settings fieldset{border:0;padding:0;margin:18px 0}.tm-personal-form>label{display:grid;gap:7px;margin:14px 0}.tm-personal-settings input:not([type=checkbox]):not([type=radio]),.tm-personal-settings select{width:100%;box-sizing:border-box;background:transparent;color:inherit;border:1px solid var(--personal-border);border-radius:6px;padding:10px 12px;font:inherit}.tm-personal-settings input{accent-color:var(--personal-accent)}.tm-personal-settings button{font:inherit;color:inherit;background:transparent;border:1px solid var(--personal-border);border-radius:6px;min-height:40px;padding:8px 13px;cursor:pointer}.tm-personal-settings button:disabled{opacity:.5;cursor:default}.tm-personal-options{display:flex;gap:20px;flex-wrap:wrap}.tm-personal-options label,.tm-personal-form>label.tm-personal-check{display:flex;gap:9px;align-items:center}.tm-personal-settings :focus-visible{outline:2px solid var(--personal-accent);outline-offset:4px}.tm-app-sources ul{padding-left:20px}.tm-app-sources li{margin:10px 0;overflow-wrap:anywhere}.tm-app-sources details details{margin:8px 0 16px}.tm-personal-actions{display:flex;gap:10px;flex-wrap:wrap}`}</style>
    <details open={section==='profile'}><summary>{L('Osobní profil','Personal profile')}</summary><PersonalProfileSettings lang={lang}/></details>
    <details open={section==='calendar'}><summary>{L('Google kalendář pro Spolu','Google Calendar for Together')}</summary><TogetherCalendarSettings lang={lang}/></details>
    <details open={section==='sources'}><summary>{L('Zdroje','Sources')}</summary><AppSources lang={lang} topic={topic} trainingSources={trainingSources}/></details>
  </div>;
}
export function PersonalSettingsBridge({t,lang,Sheet,trainingSources=[]}){
  const [open,setOpen]=useState(null);
  useEffect(()=>{const listener=event=>setOpen(event.detail||{section:'profile'});window.addEventListener('tm-open-personal-settings',listener);return()=>window.removeEventListener('tm-open-personal-settings',listener);},[]);
  return <><PersonalProfileLifecycle/><TogetherCalendarBackground/>{open&&<Sheet title={lang==='en'?'Settings':'Nastavení'} onClose={()=>setOpen(null)}><PersonalSettingsSections t={t} lang={lang} {...open} trainingSources={trainingSources}/></Sheet>}</>;
}
