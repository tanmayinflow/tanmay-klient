import {seedExerciseExpansion} from './catalogExpansion.js';
import {LIBRARY_PARITY_ADDITIONS,LIBRARY_PARITY_CORRECTIONS,LIBRARY_PARITY_META} from './catalogParityData.js';
export {LIBRARY_PARITY_ADDITIONS,LIBRARY_PARITY_META};
const flag='libraryParity20261104';
const clone=x=>JSON.parse(JSON.stringify(x));
const withoutSeed=x=>Object.fromEntries(Object.entries(x).filter(([key])=>key!=='seed'));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

/** One-time public catalogue completion. Never copy or replace personal collections. */
export function applyLibraryParity(collection,role){
  if(!collection||collection[flag])return collection;
  if(!Object.hasOwn(LIBRARY_PARITY_ADDITIONS,role))throw new Error('Unknown catalogue role');
  const previous=Array.isArray(collection.tEx)?collection.tEx:[];
  const have=new Set(previous.map(x=>x?.id));
  const additions=LIBRARY_PARITY_ADDITIONS[role].filter(x=>!have.has(x.id)).map(clone);
  let changed=false;
  const rows=previous.map(row=>{
    const patch=LIBRARY_PARITY_CORRECTIONS[role].find(x=>x.id===row?.id);
    if(!patch||!equal(withoutSeed(row),patch.before))return row;
    changed=true;return {...clone(patch.after),...(row.seed!==undefined?{seed:row.seed}:{})};
  });
  return {...collection,[flag]:true,tEx:additions.length?[...rows,...additions]:changed?rows:previous};
}

export function seedCompleteExerciseLibrary(role,collection,seedRows,options={}){
  const audited=seedExerciseExpansion(collection,seedRows,{...options,auditMetadata:{...LIBRARY_PARITY_META,...options.auditMetadata}});
  return applyLibraryParity(audited,role);
}
