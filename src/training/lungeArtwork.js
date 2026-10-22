import {LUNGE_ART} from './lungeArt.js';
import {LUNGE_GUARDS} from './catalogLungeAuditData.js';

// Use the unloaded drawing only for the reviewed unloaded identity. A custom
// loaded variation retains the historical drawing through the normal fallback.
export function lungeArtworkFor(row) {
  const art=LUNGE_ART[row?.id],guard=LUNGE_GUARDS[row?.id];
  return art&&guard&&Object.entries(guard).every(([key,value])=>JSON.stringify(row[key])===JSON.stringify(value))?art:null;
}
