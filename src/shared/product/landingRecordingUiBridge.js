// Review-only UI adapter. getAccess is a role-safe actual profile/delivery boundary.
import {landingRecordingSpecs,validRecordingConvention,validExecutionChoice} from '../../training/landingRecordingContract.js';
import {sideMeaningState,declareNewSideMeaning,isDirectionalSidePolicy} from '../../training/landingSideMeaningIntent.js';
const specs=landingRecordingSpecs(),own=(o,k)=>Object.hasOwn(o||{},k),intent=b=>own(b,'recordingConvention')||(b?.sets||[]).some(s=>own(s,'executionChoice'));
const unfinished=s=>!s?.completed&&!s?.completedAt&&(!s?.actual||Object.values(s.actual).every(v=>v==null));
const find=(doc,bid,sid)=>{const block=doc?.blocks?.find(b=>b.id===bid);return {block,set:block?.sets?.find(s=>s.id===sid)};};
const withSet=(doc,bid,sid,fn)=>({...doc,blocks:doc.blocks.map(b=>b.id===bid?{...b,sets:b.sets.map(s=>s.id===sid?fn(s):s)}:b)});
export function projectParameters(spec,p){const fields=[...Object.keys(spec.axes),...Object.keys(spec.numbers)],choice=fields.length?{v:1,id:spec.convention.id,...Object.fromEntries(fields.map(k=>[k,p?.fields?.[k]]))}:null,valid=choice&&validExecutionChoice({exId:spec.id,measurementType:spec.measurementType,recordingConvention:spec.convention},choice);return {side:spec.sideMode==='perSide'&&['L','R'].includes(p?.side)?p.side:null,...(choice?{executionChoice:valid||{v:0,invalid:true}}:{})};}
export function createLandingRecordingUiBridge({getAccess}){
 if(typeof getAccess!=='function')throw Error('Actual role-safe access resolver required');
 function access(st,b){const a=getAccess(st,b);return a?.runtime&&a.row&&a.ctx?a:null;}
 function protectedActual(st,b,completion=false){const p=access(st,b)?.policy;return [...new Set([...(p?.readOnlyActualKeys||[]),...(completion&&p?.noAutomaticTargetHeight?['height']:[])])];}
 function protectedPlanned(st,b){return access(st,b)?.policy?.readOnlyPlannedKeys||[];}
 function fieldLabel(st,b,key,locale='cs'){const p=access(st,b)?.policy;return ['height','targetHeight'].includes(key)&&p?.heightLabel?p.heightLabel[locale==='cs'?0:1]:undefined;}
 function planned(st,b,before,patch,native){const keys=protectedPlanned(st,b),safe=Object.fromEntries(Object.entries(patch||{}).filter(([k])=>!keys.includes(k))),next={...native(before,safe)};for(const k of keys){delete next[k];if(own(before,k))next[k]=before[k];}return next;}
 function preserveActual(st,before,after,bid,sid,completion){const {block,set}=find(before,bid,sid),keys=protectedActual(st,block,completion);if(!set||!keys.length||after===before)return after;return withSet(after,bid,sid,s=>{const actual={...s.actual};for(const k of keys){delete actual[k];if(own(set.actual,k))actual[k]=set.actual[k];}return {...s,actual};});}
 function view(st,b,s){
  const a=access(st,b),state=a?a.runtime.status(a.row,a.ctx,b,s):null;
  if(sideMeaningState(b,a?.policy)==='invalid')return {kind:'invalid',ready:false,spec:null};
  if(!state||state.kind==='unreviewed')return {kind:intent(b)?'invalid':'none',ready:!intent(b),spec:null};
  const spec=specs[b.exId];if(!spec)return {kind:intent(b)?'invalid':'none',ready:!intent(b),spec:null};
  if(state.kind==='invalid-declaration')return {kind:'invalid',ready:false,spec:null};
  if(state.kind==='legacy-or-unconfirmed')return {kind:'legacy',ready:true,spec:null};
  return {kind:'declared',ready:state.ready,spec,mutable:unfinished(s),state};
 }
 function newSpec(st,b){const a=access(st,b);if(!a||intent(b))return null;return a.runtime.status(a.row,a.ctx,b,b.sets?.[0]).kind==='legacy-or-unconfirmed'?specs[b.exId]||null:null;}
 function parameters(spec,set){return {side:set?.side??null,fields:{...Object.fromEntries(Object.keys(spec.axes).map(k=>[k,set?.executionChoice?.[k]??''])),...Object.fromEntries(Object.keys(spec.numbers).map(k=>[k,set?.executionChoice?.[k]??null]))}};}
 function candidate(spec,p){const fields=[...Object.keys(spec.axes),...Object.keys(spec.numbers)];return fields.length?{v:1,id:spec.convention.id,...Object.fromEntries(fields.map(k=>[k,p?.fields?.[k]]))}:null;}
 function confirm(st,b,p){const a=access(st,b),spec=newSpec(st,b);if(!a||!spec)return null;const choice=candidate(spec,p),draft={...b,sets:b.sets.map(s=>({...s,side:spec.sideMode==='perSide'?p?.side??null:null}))};return a.runtime.confirmNewBlock(a.row,a.ctx,draft,{newBlock:true,confirmed:true,choices:choice?Object.fromEntries(draft.sets.map(s=>[s.id,choice])):{}});}
 function setParameters(st,doc,bid,sid,p){
  const {block,set}=find(doc,bid,sid),v=view(st,block,set);if(v.kind!=='declared'||!v.mutable||!validRecordingConvention(block))return doc;
  return withSet(doc,bid,sid,s=>({...s,...projectParameters(v.spec,p)}));
 }
 function canRecord(st,b,s){return view(st,b,s).ready;}
 function newDirection(st,b){return declareNewSideMeaning(b,access(st,b)?.policy,{newBlock:true});}
 function sidePolicy(st,b,p){
  const actual=access(st,b)?.policy,v=view(st,b,b?.sets?.[0]),directional=isDirectionalSidePolicy(p)||isDirectionalSidePolicy(actual);
  if(directional&&sideMeaningState(b,actual)==='declared')return actual;
  return p&&(v.kind==='legacy'||directional)?{...p,sideMeaning:['Uložené označení L/P','Stored L/R label'],sideLabels:undefined,...(!directional?{sideNote:undefined}:{})}:p;
 }
 function sideSummary(st,b,s,p,locale='cs'){
  if(view(st,b,s).kind==='declared'||!['L','R'].includes(s?.side))return '';
  const q=sidePolicy(st,b,p),ix=locale==='cs'?0:1;
  if(q?.sideLabels?.[s.side])return q.sideLabels[s.side][ix];
  if(q?.sideMeaning?.[0]==='Uložené označení L/P'||sideMeaningState(b,access(st,b)?.policy)==='invalid')return (ix?'Stored label ':'Uložené označení ')+(s.side==='L'?'L':ix?'R':'P');
  return s.side==='L'?(ix?'Left side':'Levá strana'):(ix?'Right side':'Pravá strana');
 }
 function setActual(st,doc,bid,sid,patch,native){const {block,set}=find(doc,bid,sid);if(!block||!set||!canRecord(st,block,set))return doc;const keys=protectedActual(st,block),safe=Object.fromEntries(Object.entries(patch||{}).filter(([k])=>!keys.includes(k)));return preserveActual(st,doc,native(doc,bid,sid,safe),bid,sid,false);}
 function completeSet(st,doc,bid,sid,now,native){const {block,set}=find(doc,bid,sid);return block&&set&&canRecord(st,block,set)?preserveActual(st,doc,native(doc,bid,sid,now),bid,sid,true):doc;}
 function canCopy(st,b,prev){
  const currentSide=sideMeaningState(b,access(st,b)?.policy),previousSide=sideMeaningState(prev,access(st,prev)?.policy);
  if(currentSide==='invalid'||previousSide==='invalid'||currentSide!==previousSide)return false;
  if(currentSide==='declared'&&(b.exId!==prev?.exId||b.sets?.length!==prev.sets?.length||b.sets.some((s,i)=>s.side!==prev.sets[i]?.side)))return false;
  if(!intent(b)&&!intent(prev))return true;const a=access(st,b);return !!a&&a.runtime.canCopy(a.row,a.ctx,b,prev);}
 function copyPrevious(st,doc,bid,prev,target,native){const b=find(doc,bid).block;if(!b||!canCopy(st,b,prev))return doc;let next=native(doc,bid,prev,target);if(target==='actual')for(const set of b.sets||[])next=preserveActual(st,doc,next,bid,set.id,true);return next;}
 function addSet(st,doc,bid,opts,native){const b=find(doc,bid).block,a=access(st,b);return a?a.runtime.addSet(a.row,a.ctx,doc,bid,opts,native):native(doc,bid,opts);}
 function setSide(st,doc,bid,sid,side,native){const {block,set}=find(doc,bid,sid),v=view(st,block,set);if(v.kind==='none'||v.kind==='legacy')return native(doc,bid,sid,side);if(v.kind!=='declared'||!v.mutable)return doc;return setParameters(st,doc,bid,sid,{...parameters(v.spec,set),side});}
 function previousSet(st,b,s,index,prev,native){if(!canCopy(st,b,prev))return null;return intent(b)?prev?.sets?.[index]||null:native();}
 function guideApply(st,doc,bid,sid,native){const {block,set}=find(doc,bid,sid);return block&&set&&canRecord(st,block,set)?preserveActual(st,doc,native(doc),bid,sid,true):doc;}
 return {view,newSpec,newDirection,sideSummary,parameters,confirm,setParameters,canRecord,sidePolicy,setActual,completeSet,canCopy,copyPrevious,addSet,setSide,previousSet,guideApply,protectedActual,protectedPlanned,planned,fieldLabel};
}

export const AXIS_COPY={
 turnDirection:['Směr otočení','Turn direction'],travelDirection:['Směr přesunu','Travel direction'],circuitOrder:['Směr okruhu','Circuit direction'],landingOrder:['Pořadí dopadů','Landing order'],firstLandingLeg:['První dopadová noha','First landing leg'],firstElevatedLeg:['První noha na opěrce','First elevated leg'],firstBoxLeg:['První noha na bedně','First leg on the box'],followingJumps:['Počet navazujících odrazů','Number of following bounds'],accelerationDistanceM:['Délka zrychlení · m','Acceleration distance · m']
};
export const VALUE_COPY={left:['Doleva','Leftward'],right:['Doprava','Rightward'],'initial-left':['Doleva od počátečního natočení','Left of the starting orientation'],'initial-right':['Doprava od počátečního natočení','Right of the starting orientation'],clockwise:['Po směru hodinových ručiček','Clockwise'],counterclockwise:['Proti směru hodinových ručiček','Counterclockwise'],L:['Levá','Left'],R:['Pravá','Right'],RRLL:['Pravá, pravá, levá, levá','Right, right, left, left'],LLRR:['Levá, levá, pravá, pravá','Left, left, right, right'],'R-L-L-R-both':['Pravá, levá, levá, pravá, obě','Right, left, left, right, both'],'L-R-R-L-both':['Levá, pravá, pravá, levá, obě','Left, right, right, left, both']};
export const SIDE_COPY={
 'travel-direction':['Směr přesunu','Travel direction'],'turn-direction':['Směr otočení','Turn direction'],'working-leg':['Pracovní noha','Working leg'],'starting-leg':['Počáteční noha','Starting leg'],'rebound-and-final-leg':['Noha pro další odraz a poslední dopad','Rebound and final landing leg'],'elevated-leg':['Noha na opěrce','Elevated leg'],'landing-leg':['Dopadová noha','Landing leg'],'first-drop-landing-leg':['Noha prvního dopadu po seskoku','First drop landing leg'],'takeoff-leg':['Odrazová noha','Takeoff leg']
};
export function sideOptions(spec){return ['travel-direction','turn-direction'].includes(spec.convention.sideMeaning)?{L:VALUE_COPY.left,R:VALUE_COPY.right}:{L:VALUE_COPY.L,R:VALUE_COPY.R};}
export function countCopy(spec){
 const c=spec.convention,id=spec.id;
 if(id==='ex26_py_lateral_push')return ['1 opakování = jeden klik s bočním přesunem a zachycením. Návrat bez kliku se nepočítá.','1 repetition = one push-up with a sideways shift and landing. A return without a push-up does not count.'];
 if(id==='ex26_py_skip_lateral')return ['1 opakování = jeden celý odrazový přísun.','1 repetition = one complete sideways skipping step.'];
 if(c.unit==='foot-switch')return ['1 opakování = jedno přepnutí nohou.','1 repetition = one switch of the feet.'];
 if(id==='ex26_py_hurdle_bounds')return ['1 opakování = přeskok překážky a celé zvolené navazující spojení.','1 repetition = the hurdle jump and the entire chosen following sequence.'];
 if(id==='ex26_py_drop_bounds')return ['1 opakování = seskok a celé zvolené spojení navazujících odrazů.','1 repetition = the drop and the entire chosen sequence of following bounds.'];
 if(id==='ex26_py_hurdle_sprint')return ['1 opakování = přeskok překážky a zrychlení na zvolenou vzdálenost.','1 repetition = the hurdle jump and acceleration over the chosen distance.'];
 if(id==='ex26_py_drop_sprint')return ['1 opakování = seskok, dopad a zrychlení na zvolenou vzdálenost.','1 repetition = the drop, landing and acceleration over the chosen distance.'];
 if(c.dropLandingsPerRepetition)return ['1 opakování = celý seskok s navazujícím odrazem a dopadem.','1 repetition = the complete drop with the following jump and landing.'];
 if(c.unit==='sequence')return [`1 opakování = celé spojení ${c.jumpsPerRepetition} odrazů.`,`1 repetition = the entire ${c.jumpsPerRepetition}-jump sequence.`];
 return ['1 opakování = jeden odraz s dopadem. Počítej každý zvlášť.','1 repetition = one jump and landing. Count each one separately.'];
}
