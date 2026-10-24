import {publicLandingSideMeaning} from './landingSideMeaningIntent.js';
import {LANDING_BLOCK_POLICY_FIELDS} from './catalogLandingAuditData.js';
// Review only. Storage validation is not evidence of a trusted exercise profile.
// Runtime requires the actual guarded policy+resolver supplied by integration.
import {LANDING_RECORDING_SPECS as SPECS} from './landingRecordingSpecs.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k),plain=x=>!!x&&typeof x==='object'&&!Array.isArray(x),clone=x=>structuredClone(x);
const equal=(a,b)=>{if(a===b)return true;if(!plain(a)||!plain(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equal(v,b[i]));const ak=Object.keys(a),bk=Object.keys(b);return ak.length===bk.length&&ak.every(k=>own(b,k)&&equal(a[k],b[k]));};
const baseSpec=b=>plain(b)&&own(SPECS,b.exId)&&SPECS[b.exId].measurementType===b.measurementType&&(b.variant==null||b.variant===''||Array.isArray(b.variant)&&!b.variant.length)?SPECS[b.exId]:null;
export function validRecordingConvention(block){const spec=baseSpec(block);return spec&&own(block,'recordingConvention')&&equal(block.recordingConvention,spec.convention)?clone(spec.convention):null;}
export function validExecutionChoice(block,value){const spec=baseSpec(block);if(!spec||!validRecordingConvention(block))return null;const fields=[...Object.keys(spec.axes),...Object.keys(spec.numbers)];if(!fields.length)return null;if(!plain(value)||value.v!==1||value.id!==spec.convention.id||Object.keys(value).length!==fields.length+2||fields.some(k=>!own(value,k)))return null;for(const[k,values]of Object.entries(spec.axes))if(!values.includes(value[k]))return null;for(const[k,r]of Object.entries(spec.numbers)){const v=value[k];if(typeof v!=='number'||!Number.isFinite(v)||r.integer&&!Number.isSafeInteger(v)||own(r,'min')&&v<r.min||own(r,'max')&&v>r.max||own(r,'exclusiveMin')&&v<=r.exclusiveMin)return null;}return clone(value);}
// An invalid explicit declaration must never normalize into legacy absence.
// The fixed marker carries no original payload, private note, or profile trust.
const invalid=()=>({v:0,invalid:true});
const hasIntent=block=>own(block,'recordingConvention')||Array.isArray(block?.sets)&&block.sets.some(s=>own(s,'executionChoice'));
// Native makeBlock drops these fields. Without an actual profile at this layer,
// conservatively invalidate the new declaration instead of losing its override.
const droppedOverrides=LANDING_BLOCK_POLICY_FIELDS;
const transportConvention=block=>droppedOverrides.some(k=>own(block,k))?null:validRecordingConvention(block);
export function preserveLandingSetChoice(input,output){
 if(!own(input,'executionChoice'))return output;
 const value=input.executionChoice,spec=plain(value)?Object.values(SPECS).find(s=>s.convention.id===value.id):null;
 const choice=spec&&validExecutionChoice({exId:spec.id,measurementType:spec.measurementType,recordingConvention:spec.convention},value);
 return {...output,executionChoice:choice||invalid()};
}
export function preserveLandingRecordingBlock(input,output){
 if(!hasIntent(input))return output;
 const c=transportConvention(input);
 return {...output,recordingConvention:c||invalid(),sets:output.sets.map((set,i)=>{
  const source=input.sets?.[i];if(!own(source,'executionChoice'))return set;
  const choice=c&&validExecutionChoice(input,source.executionChoice);
  return {...set,executionChoice:choice||invalid()};
 })};
}
// Delivery preserves declared public task parameters only. Reading them still
// requires a current guarded profile. PrivateNote/free-form note never copied here.
export function publicLandingRecording(block){return {...(hasIntent(block)?{recordingConvention:transportConvention(block)||invalid()}:{}),...publicLandingSideMeaning(block)};}
export function publicLandingExecution(block,set){if(!own(set,'executionChoice'))return {};const c=transportConvention(block)&&validExecutionChoice(block,set.executionChoice);return {executionChoice:c||invalid()};}
const unfinished=s=>!s?.completed&&!s?.completedAt&&(!s?.actual||Object.values(s.actual).every(v=>v==null));
const withBlock=(doc,id,fn)=>({...doc,blocks:doc.blocks.map(b=>b.id===id?fn(b):b)});
export function createLandingRecordingRuntime({policyFor,resolve,blockCompatible}){
 if(typeof policyFor!=='function'||typeof resolve!=='function'||typeof blockCompatible!=='function')throw Error('Trusted policyFor, actual resolve and explicit blockCompatible required');
 const specFor=(row,ctx,block)=>{const q=policyFor(row,ctx),rec=resolve(row,ctx),s=baseSpec(block);return q&&rec&&s&&blockCompatible(row,ctx,block)===true&&s.roles.includes(ctx?.role)&&q.id===row?.id&&block.exId===row.id&&rec.id===row.id&&q.measurementType===s.measurementType&&rec.measurementType===s.measurementType&&q.sideMode===s.sideMode&&rec.sideMode===s.sideMode?s:null;};
 function status(row,ctx,block,set){const s=specFor(row,ctx,block);if(!s)return {kind:'unreviewed',ready:false};if(!validRecordingConvention(block))return {kind:hasIntent(block)?'invalid-declaration':'legacy-or-unconfirmed',ready:false};const fields=[...Object.keys(s.axes),...Object.keys(s.numbers)],choice=validExecutionChoice(block,set?.executionChoice),missing=[...(fields.length&&!choice||!fields.length&&own(set,'executionChoice')?['executionChoice']:[]),...(s.sideMode==='perSide'&&!['L','R'].includes(set?.side)||s.sideMode==='none'&&set?.side!=null?['side']:[])];return {kind:missing.length?'needs-choice':'declared',ready:!missing.length,missing,convention:clone(s.convention),choice,sideMeaning:s.convention.sideMeaning,side:set?.side??null};}
 // Call only from an explicit new-block UI action, never hydration/migration.
 // Refuses real previous results, but caller must also keep saved old blocks out.
 function confirmNewBlock(row,ctx,block,{confirmed=false,newBlock=false,choices={}}={}){const s=specFor(row,ctx,block);if(!s||confirmed!==true||newBlock!==true||!Array.isArray(block.sets)||!block.sets.length||block.sets.some(x=>!unfinished(x))||own(block,'recordingConvention'))return null;const out={...block,recordingConvention:clone(s.convention),sets:block.sets.map(set=>{const draft={...block,recordingConvention:s.convention},choice=validExecutionChoice(draft,choices[set.id]);return choice?{...set,executionChoice:choice}:set;})};return out.sets.every(set=>status(row,ctx,out,set).ready)?out:null;}
 function setChoice(row,ctx,doc,bid,sid,choice){const b=doc.blocks?.find(x=>x.id===bid),s=b?.sets.find(x=>x.id===sid),spec=specFor(row,ctx,b);if(!spec||!s||!unfinished(s)||!validRecordingConvention(b))return doc;const valid=validExecutionChoice(b,choice);if(!valid)return doc;return withBlock(doc,bid,b=>({...b,sets:b.sets.map(s=>s.id===sid?{...s,executionChoice:valid}:s)}));}
 function sideLabel(row,ctx,block,set,en=false){const result=status(row,ctx,block,set),spec=specFor(row,ctx,block);if(result.kind==='legacy-or-unconfirmed'||!spec||!validRecordingConvention(block))return null;const labels=spec.sideLabels;return labels?(labels[set?.side]||labels.unknown)?.[en?1:0]||null:null;}
 function canCopy(row,ctx,current,previous){const s=specFor(row,ctx,current);if(!s)return false;if(previous?.exId!==current.exId||previous.measurementType!==current.measurementType||!equal(validRecordingConvention(previous),s.convention)||!equal(validRecordingConvention(current),s.convention)||previous.sets?.length!==current.sets?.length)return false;return current.sets.every((set,i)=>{const from=previous.sets[i];return status(row,ctx,current,set).ready&&status(row,ctx,previous,from).ready&&set.side===from.side&&equal(validExecutionChoice(current,set.executionChoice),validExecutionChoice(previous,from.executionChoice));});}
 function copyPrevious(row,ctx,doc,bid,previous,target,native){const b=doc.blocks?.find(x=>x.id===bid);return b&&canCopy(row,ctx,b,previous)?native(doc,bid,previous,target):doc;}
 function addSet(row,ctx,doc,bid,opts,native){const b=doc.blocks?.find(x=>x.id===bid),s=specFor(row,ctx,b);if(!s||!validRecordingConvention(b))return native(doc,bid,opts);const prior=new Set(b.sets.map(x=>x.id)),next=native(doc,bid,opts),choice=validExecutionChoice(b,opts?.executionChoice);return withBlock(next,bid,b=>({...b,sets:b.sets.map(set=>prior.has(set.id)?set:{...set,side:own(opts,'side')?opts.side:null,...(choice?{executionChoice:choice}:{})})}));}
 function jumpComponents(row,ctx,block,set){const state=status(row,ctx,block,set),s=specFor(row,ctx,block);if(!s||!state.ready)return null;const jumps=s.jumpCountFormula?state.choice[s.jumpCountFormula.field]+s.jumpCountFormula.offset:s.convention.jumpsPerRepetition;return Number.isSafeInteger(jumps)&&jumps>=0?{activeJumpsPerDeclaredRepetition:jumps,dropLandingsPerDeclaredRepetition:s.convention.dropLandingsPerRepetition||0}:null;}
 function canRecord(row,ctx,block,set){return !hasIntent(block)||status(row,ctx,block,set).ready;}
 function setActual(row,ctx,doc,bid,sid,patch,native){const b=doc.blocks?.find(x=>x.id===bid),set=b?.sets.find(x=>x.id===sid);return b&&set&&canRecord(row,ctx,b,set)?native(doc,bid,sid,patch):doc;}
 function completeSet(row,ctx,doc,bid,sid,now,native){const b=doc.blocks?.find(x=>x.id===bid),set=b?.sets.find(x=>x.id===sid);return b&&set&&canRecord(row,ctx,b,set)?native(doc,bid,sid,now):doc;}
 return {status,confirmNewBlock,setChoice,sideLabel,canCopy,copyPrevious,addSet,jumpComponents,canRecord,setActual,completeSet};
}
export const landingRecordingSpecs=()=>clone(SPECS);
