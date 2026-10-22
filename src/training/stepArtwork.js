import {STEP_ART} from './stepArt.js';
import {STEP_GUARDS} from './catalogStepAuditData.js';
import {STEP_EXERCISES} from './catalogStepAudit.js';
// Preserve historical artwork for custom identities or altered instructions.
export function stepArtworkFor(row){
 const art=STEP_ART[row?.id];if(!art)return null;
 const seed=STEP_EXERCISES.find(r=>r.id===row.id);
 const guard=seed?Object.fromEntries(['cz','en','pos','exe','eq'].map(k=>[k,seed[k]])):STEP_GUARDS[row.id];
 return guard&&Object.entries(guard).every(([k,v])=>JSON.stringify(row[k])===JSON.stringify(v))?art:null;
}
