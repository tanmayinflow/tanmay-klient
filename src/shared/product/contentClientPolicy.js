// Explicit owner refinement, 2026-10-11. Only this idea remains in the client
// starter copy. Private source text and fingerprints are never bundled here.
export const CONTENT_CLIENT_POLICY='content-editorial-2026-10-11';
export const CLIENT_CONTENT_TOPICS=[
  {cz:'Co právě zkouším',en:'What I am trying',body:[['Malý pokus a co mi ukázal.','A small experiment and what it taught me.'],['Dovednost, kterou se učím.','A skill I am learning.']]},
  {cz:'Co mohu předat',en:'What I can share',body:[['Jedna praktická rada z vlastní zkušenosti.','One practical tip from my own experience.'],['Otázka, která mi pomohla něco pochopit.','A question that helped me understand something.']]},
];
const clone=value=>JSON.parse(JSON.stringify(value));
const canonical=value=>JSON.stringify(value,(_key,item)=>item&&typeof item==='object'&&!Array.isArray(item)?Object.fromEntries(Object.keys(item).sort().map(key=>[key,item[key]])):item);
export const contentFingerprint=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(value)))),byte=>byte.toString(16).padStart(2,'0')).join('');

export function validateContentClientPolicy(policy) {
  if(!policy||Object.keys(policy).some(key=>!['version','retiredCopies','topicsSha256'].includes(key))||typeof policy.version!=='string'||!/^[\w.-]+$/.test(policy.version)||!Array.isArray(policy.retiredCopies)||!/^([a-f0-9]{64})$/.test(policy.topicsSha256))throw Error('Invalid content client policy');
  if(policy.retiredCopies.some(row=>!row||Object.keys(row).some(key=>!['id','sha256'].includes(key))||typeof row.id!=='string'||!row.id.startsWith('content-copy:')||!/^[a-f0-9]{64}$/.test(row.sha256)))throw Error('Invalid retired content copy');
  if(new Set(policy.retiredCopies.map(row=>row.id)).size!==policy.retiredCopies.length)throw Error('Duplicate retired content copy');
}

// The caller validates the scoped snapshot before projecting it. The original
// R2 publication is retained; only this authenticated response is narrowed.
export async function projectClientContentSnapshot(snapshot,copies) {
  const allowed=new Set(snapshot.socItems.filter(item=>item.title==='Greetings!').slice(0,1).map(item=>String(item.id)));
  const retiredCopies=await Promise.all(copies.socItems.filter(item=>!allowed.has(item.contentSource.id)).map(async item=>({id:item.id,sha256:await contentFingerprint(item)})));
  return {...snapshot,socItems:snapshot.socItems.filter(item=>allowed.has(String(item.id))),socTopics:clone(CLIENT_CONTENT_TOPICS),clientPolicy:{version:CONTENT_CLIENT_POLICY+'.'+snapshot.version,retiredCopies,topicsSha256:await contentFingerprint(snapshot.socTopics||[])}};
}

// Prepare hashes asynchronously, then apply synchronously to the latest store.
// Comparing the complete canonical record again protects edits made while the
// hashes were being computed. A policy marker prevents re-removing a restored
// copy, or recreating a deliberately discarded starter on the next visit.
export async function prepareContentClientMigration(state,snapshot,{now=Date.now()}={}) {
  const policy=snapshot.clientPolicy;
  if(!policy)return current=>current;
  validateContentClientPolicy(policy);
  if((state.contentPolicies||[]).includes(policy.version))return current=>current;
  const candidates=new Map(policy.retiredCopies.map(item=>[item.id,item.sha256]));
  const untouched=new Map();
  for(const item of state.socItems||[])if(candidates.has(item.id)&&item.contentSource&&await contentFingerprint(item)===candidates.get(item.id))untouched.set(item.id,canonical(item));
  const originalTopics=state.socTopics;
  const topicsMatch=Array.isArray(originalTopics)&&originalTopics.length>0&&await contentFingerprint(originalTopics)===policy.topicsSha256;
  const topicsBefore=topicsMatch?canonical(originalTopics):null;
  return current=>{
    if((current.contentPolicies||[]).includes(policy.version))return current;
    const trash=[...(current.trash||[])];
    const socItems=(current.socItems||[]).filter((item,index)=>{
      if(!untouched.has(item.id)||canonical(item)!==untouched.get(item.id))return true;
      if(!trash.some(entry=>entry.entryKind==='socItems'&&entry.data?.id===item.id))trash.unshift({tid:policy.version+':'+item.id,kind:'entry',entryKind:'socItems',index,data:item,label:item.title||'Tvorba obsahu',trashedAt:now});
      return false;
    });
    let socTopics=current.socTopics;
    if(topicsBefore&&canonical(current.socTopics)===topicsBefore) {
      const id='content-topics-archive:'+policy.version;
      if(!trash.some(entry=>entry.entryKind==='notebook'&&entry.data?.id===id))trash.unshift({tid:id,kind:'entry',entryKind:'notebook',index:0,label:'Předchozí témata tvorby',trashedAt:now,data:{id,title:'Předchozí témata tvorby',folder:'Sociální sítě',tags:['Podklady'],tag:'Podklady',text:current.socTopics.map(topic=>topic.cz+'\n'+topic.body.map(pair=>'• '+pair[0]).join('\n')).join('\n\n'),contentTopicsArchive:clone(current.socTopics)}});
      socTopics=clone(CLIENT_CONTENT_TOPICS);
    }
    return {...current,socItems,trash,...(socTopics!==undefined?{socTopics}:{}),contentPolicies:[...(current.contentPolicies||[]),policy.version]};
  };
}
