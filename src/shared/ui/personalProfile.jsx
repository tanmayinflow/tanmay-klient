import React,{useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {createPersonalProfileClient} from '../product/personalProfileClient.js';

const client=createPersonalProfileClient();
export const refreshPersonalProfile=client.refresh;
export const verifyPersonalProfile=client.verify;
export const invalidatePersonalProfile=client.invalidate;
export const isPersonalProfileVerified=client.verified;
export function PersonalProfileLifecycle(){
  useEffect(()=>{
    const verify=()=>{if(document.visibilityState!=='hidden')client.verify();};
    const changed=()=>{client.invalidate();client.refresh();};
    const leave=()=>client.invalidate();
    window.addEventListener('focus',verify);window.addEventListener('pageshow',verify);window.addEventListener('tm-account-changed',changed);window.addEventListener('tm-sign-out',leave);document.addEventListener('visibilitychange',verify);
    return()=>{window.removeEventListener('focus',verify);window.removeEventListener('pageshow',verify);window.removeEventListener('tm-account-changed',changed);window.removeEventListener('tm-sign-out',leave);document.removeEventListener('visibilitychange',verify);};
  },[]);return null;
}
export function usePersonalProfile(){
  const value=useSyncExternalStore(client.subscribe,client.getSnapshot);
  useEffect(()=>{if(client.getSnapshot().status==='loading')client.refresh();},[]);
  return {...value,updateProfile:async(patch,options={})=>{const profile=await client.update(patch,{...options,accountKey:value.accountKey});window.dispatchEvent(new Event('tm-personal-profile-changed'));return profile;},refresh:client.refresh};
}
export const openAppSources=(section='obloha')=>window.dispatchEvent(new CustomEvent('tm-open-personal-settings',{detail:{section:'sources',topic:section}}));
export const openPersonalProfile=()=>window.dispatchEvent(new CustomEvent('tm-open-personal-settings',{detail:{section:'profile'}}));
export function PersonalProfileSettings({lang='cs'}){
  const {profile,accountKey,revision,status,error,updateProfile,refresh}=usePersonalProfile(),[draft,setDraft]=useState(profile),[message,setMessage]=useState(''),[saving,setSaving]=useState(false),dirty=useRef(false),draftOwner=useRef(null),draftRevision=useRef(revision);
  useEffect(()=>{if(status==='ready'&&(accountKey!==draftOwner.current||!dirty.current)){setDraft(profile);dirty.current=false;draftOwner.current=accountKey;draftRevision.current=revision;}},[profile,accountKey,status,revision]);
  const edit=patch=>{dirty.current=true;setDraft({...draft,...patch});};
  const L=(cs,en)=>lang==='en'?en:cs;
  if(status!=='ready')return <div><p role="status">{['loading','checking'].includes(status)?L('Ověřuji profil…','Verifying profile…'):L('Profil se zatím nepodařilo načíst.','Your profile is not available yet.')}</p>{!['loading','checking'].includes(status)&&<button type="button" onClick={refresh}>{L('Načíst profil','Load profile')}</button>}{error==='unauthorized'&&<p>{L('Přihlas se ke svému účtu.','Sign in to your account.')}</p>}</div>;
  return <form className="tm-personal-form" onSubmit={async event=>{event.preventDefault();setSaving(true);try{await updateProfile(draft,{revision:draftRevision.current});dirty.current=false;draftRevision.current++;setMessage(L('Profil uložen.','Profile saved.'));}catch(e){setMessage(e.message==='conflict'?L('Profil byl změněn jinde. Načti jej znovu a zkontroluj své změny.','The profile changed elsewhere. Reload it and review your changes.'):L('Uložení se nepodařilo. Zkus to znovu.','Saving failed. Try again.'));}finally{setSaving(false);}}}>
    <label>{L('Jméno v aplikaci','Name in the app')}<input value={draft.name} maxLength={80} autoComplete="given-name" onChange={e=>edit({name:e.target.value})}/></label>
    <fieldset><legend>{L('Jak tě aplikace oslovuje','How the app addresses you')}</legend><div className="tm-personal-options">{[['male','Muž','Man'],['female','Žena','Woman'],['neutral','Neutrálně','Neutral']].map(([value,cs,en])=><label key={value}><input type="radio" name="profile-wording" value={value} checked={draft.wording===value} onChange={()=>edit({wording:value})}/>{L(cs,en)}</label>)}</div></fieldset>
    <label className="tm-personal-check"><input type="checkbox" checked={draft.ownCycle} onChange={e=>edit({ownCycle:e.target.checked})}/>{L('Sledovat můj menstruační cyklus','Track my menstrual cycle')}</label>
    <p>{L('Vypnutí skryje vlastní cyklus a přestane poskytovat jeho přehled druhému člověku. Zápisy i dřívější volby sdílení zůstanou; po zapnutí se znovu použijí. Souhlasy můžeš změnit v Propojení a sdílení.','Switching off hides your cycle and stops supplying its overview to your partner. Records and earlier sharing choices remain and apply again when enabled. Change consent in Connection and sharing.')}</p>
    <button type="submit" disabled={saving}>{saving?L('Ukládám…','Saving…'):L('Uložit profil','Save profile')}</button><p role="status">{message}</p>
  </form>;
}
