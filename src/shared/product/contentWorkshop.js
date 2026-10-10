
export const CONTENT_ROOT = 'Sociální sítě';
export const isContentNote = note => note?.folder === CONTENT_ROOT || String(note?.folder || '').startsWith(CONTENT_ROOT + '/');
export const newContentItem = (title,id) => ({id,title,status:'napad',format:'reel',platforms:[],pillar:'',doDate:'',postDate:'',url:'',hook:'',script:'',shots:'',caption:'',note:'',kroky:{},vysl:{},pouceni:'',arch:false,createdAt:Date.now()});

const EXPORT_FIELDS = Object.freeze({
  socItems:['id','title','status','format','platforms','pillar','doDate','postDate','url','gdrive','hook','script','shots','caption','note','pouceni','arch','createdAt'],
  socHooks:['id','text','typ','status','retention','vysledek','link'],
  socPillars:['id','cz','en','ucz','uen','color'],
  notebook:['id','date','title','tag','tags','text','folder','star','arch','createdAt'],
});
const METRIC_FIELDS=['views','likes','comments','shares','saves','retention'];
const SHOT_FIELDS=['b','u','p','z','m','d','t'];

// Scoped export is deliberately independent of the full-account backup. It
// cannot reach any collection except this exact room, or fetch stored files.
export function exportContentSnapshot(coll,{version='content-'+new Date().toISOString().replace(/[^\w.-]/g,'-'),source='Tvorba obsahu · explicit account export'}={}) {
  const report={attachments:0,privateReferences:0};
  const cleanString=value=>String(value).replace(/!img\([^)]*\)/g,()=>{report.privateReferences++;return '[Obrázek z původní aplikace]';}).replace(/(?:https?:)?\/\/[^\s<>"'\])]+|\/api\/files\/[^\s<>"'\])]+|(?:data|blob):[^\s<>"'\])]+/gi,url=>{
    let privateUrl=/\/api\/(?:files|state|backup)(?:\/|\?|$)|^(?:data|blob):/i.test(url);
    try {const parsed=new URL(url,'https://export.invalid');privateUrl=privateUrl||!!parsed.username||!!parsed.password||[...parsed.searchParams.keys()].some(key=>/^(?:access_token|refresh_token|token|auth|authorization|signature|sig|x-amz-signature|cf_authorization)$/i.test(key));}catch{}
    if(privateUrl){report.privateReferences++;return '[Soukromý odkaz vynechán]';}return url;
  });
  const scalar=value=>typeof value==='string'?cleanString(value):typeof value==='boolean'||typeof value==='number'?value:undefined;
  const pickRow=(row,keys)=>Object.fromEntries(keys.filter(key=>Object.prototype.hasOwnProperty.call(row,key)).map(key=>[key,Array.isArray(row[key])?row[key].map(scalar).filter(v=>v!==undefined):scalar(row[key])]).filter(([,value])=>value!==undefined));
  const snapshot={version,source,socItems:[],socHooks:[],socPillars:[],notebook:[],socTopics:[]};
  for(const kind of ['socItems','socHooks','socPillars','notebook']) {
    const rows=Array.isArray(coll?.[kind])?coll[kind]:[];
    snapshot[kind]=rows.filter(row=>row&&typeof row==='object'&&(kind!=='notebook'||isContentNote(row))).map((row,index)=>{
      report.attachments+=(Array.isArray(row.att)?row.att.length:0)+(row.cover?1:0)+(row.icon&&typeof row.icon==='object'?1:0);
      const result=pickRow(row,EXPORT_FIELDS[kind]);
      if(!result.id)result.id=`export-${kind}-${index}`;
      if(kind==='socItems'){
        result.kroky=Object.fromEntries(Object.entries(row.kroky||{}).filter(([key,value])=>/^\d+$/.test(key)&&typeof value==='boolean'));
        result.vysl=pickRow(row.vysl||{},METRIC_FIELDS);
        result.zabery=(Array.isArray(row.zabery)?row.zabery:[]).filter(shot=>shot&&typeof shot==='object').map(shot=>pickRow(shot,SHOT_FIELDS));
      }
      return result;
    });
  }
  snapshot.socTopics=(Array.isArray(coll?.socTopics)?coll.socTopics:[]).filter(row=>row&&typeof row==='object').map(row=>({cz:cleanString(row.cz||''),en:cleanString(row.en||''),body:(Array.isArray(row.body)?row.body:[]).filter(pair=>Array.isArray(pair)).map(pair=>pair.slice(0,2).map(value=>cleanString(value||'')))}));
  validateContentSnapshot(snapshot);
  return {snapshot,report};
}

// A single approved release snapshot. This never reads Main's live account or
// subscribes to future edits. Each client receives independent editable copies.
const TOP_LEVEL = new Set(['version','source','socItems','socHooks','socPillars','notebook','socTopics']);
export function validateContentSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || !/^[\w.-]+$/.test(snapshot.version || '')) throw new Error('Invalid content snapshot version');
  if(snapshot.source!==undefined&&typeof snapshot.source!=='string')throw new Error('Invalid content source');
  if (Object.keys(snapshot).some(key=>!TOP_LEVEL.has(key))) throw new Error('Content snapshot includes a collection outside the approved room');
  for (const key of ['socItems','socHooks','socPillars','notebook']) {
    if (!Array.isArray(snapshot[key])) throw new Error('Content snapshot collection must be an array');
    if (snapshot[key].some(row=>!row || typeof row!=='object' || Array.isArray(row))) throw new Error('Content snapshot contains an invalid record');
    const ids=snapshot[key].filter(row=>row.id).map(row=>String(row.id));
    if (new Set(ids).size!==ids.length) throw new Error('Content snapshot contains duplicate source identifiers');
    const allowed=new Set([...EXPORT_FIELDS[key],...(key==='socItems'?['kroky','vysl','zabery']:[])]);
    for(const row of snapshot[key]) {
      if(Object.keys(row).some(field=>!allowed.has(field)))throw new Error('Content snapshot contains an unsupported record field');
      for(const field of EXPORT_FIELDS[key]) if(row[field]!==undefined) {
        const value=row[field],scalar=value=>['string','boolean','number'].includes(typeof value)&&!(typeof value==='number'&&!Number.isFinite(value));
        if(Array.isArray(value)?!value.every(scalar):!scalar(value))throw new Error('Content snapshot contains an invalid field value');
      }
      if(row.kroky!==undefined&&(!row.kroky||typeof row.kroky!=='object'||Array.isArray(row.kroky)||Object.entries(row.kroky).some(([k,v])=>!/^\d+$/.test(k)||typeof v!=='boolean')))throw new Error('Invalid content checklist');
      if(row.vysl!==undefined&&(!row.vysl||typeof row.vysl!=='object'||Array.isArray(row.vysl)||Object.entries(row.vysl).some(([k,v])=>!METRIC_FIELDS.includes(k)||!['string','number','boolean'].includes(typeof v))))throw new Error('Invalid content metrics');
      if(row.zabery!==undefined&&(!Array.isArray(row.zabery)||row.zabery.some(shot=>!shot||typeof shot!=='object'||Array.isArray(shot)||Object.entries(shot).some(([k,v])=>!SHOT_FIELDS.includes(k)||!['string','number','boolean'].includes(typeof v)))))throw new Error('Invalid content shots');
    }
  }
  if (snapshot.notebook.some(note=>!isContentNote(note))) throw new Error('Content snapshot includes a note outside the approved folder');
  if(snapshot.socTopics!==undefined&&(!Array.isArray(snapshot.socTopics)||snapshot.socTopics.some(row=>!row||Object.keys(row).some(key=>!['cz','en','body'].includes(key))||typeof row.cz!=='string'||typeof row.en!=='string'||!Array.isArray(row.body)||row.body.some(pair=>!Array.isArray(pair)||pair.length!==2||pair.some(value=>typeof value!=='string')))))throw new Error('Invalid content topics');
  return true;
}

// Authenticated transport only: no bundled owner fallback and no success marker
// on an unavailable/malformed delivery. The caller binds persistence to its owner.
export async function fetchContentLibrary(request) {
  const response=await request('/api/content-library',{cache:'no-store',credentials:'same-origin'});
  if(!response.ok)throw new Error('Content library unavailable');
  const snapshot=await response.json();validateContentSnapshot(snapshot);return snapshot;
}
const copy = value => JSON.parse(JSON.stringify(value));
const sourceId = (kind,row,index) => String(row.id || `${row.folder||''}:${row.title||row.text||row.cz||''}:${index}`);
export function contentSnapshotCopies(snapshot) {
  validateContentSnapshot(snapshot);
  const prefix=`content-copy:${snapshot.version}:`;
  const idOf=(kind,row,index)=>prefix+kind+':'+encodeURIComponent(sourceId(kind,row,index));
  const pillars=new Map(snapshot.socPillars.map((row,index)=>[row.id,idOf('socPillars',row,index)]));
  const result={};
  for (const kind of ['socItems','socHooks','socPillars','notebook']) result[kind]=snapshot[kind].map((entry,index)=>{
    const row=copy(entry);
    row.id=idOf(kind,entry,index);
    row.contentSource={version:snapshot.version,id:sourceId(kind,entry,index)};
    if (kind==='socItems' && pillars.has(row.pillar)) row.pillar=pillars.get(row.pillar);
    return row;
  });
  return result;
}


export function mergeContentSnapshot(state,snapshot,defaultTags=[]) {
  validateContentSnapshot(snapshot);
  if ((state.contentImports || []).includes(snapshot.version)) return state;
  const imported=contentSnapshotCopies(snapshot), next={...state};
  for(const kind of ['socItems','socHooks','socPillars','notebook']) {
    const existing=state[kind] || [];
    const deleted=new Set((state.trash||[]).filter(item=>item.entryKind===kind).map(item=>item.data?.id));
    next[kind]=[...existing,...imported[kind].filter(row=>!existing.some(entry=>entry.id===row.id)&&!deleted.has(row.id))];
  }
  const folders=new Set(state.nbFolders || []);
  for(const note of imported.notebook) folders.add(note.folder);
  next.nbFolders=[...folders].sort((a,b)=>a.localeCompare(b,'cs'));
  const tags=[...(state.nbTags||defaultTags)],tagScope={...(state.nbTagObor||{})};
  const colors={'Tvorba obsahu':'slate','Příběh':'burgundy','Hooky':'orange','Prompty':'stone','Škola':'plum','Podklady':'sand'};
  const noteTags=note=>Array.isArray(note.tags)&&note.tags.length?note.tags:note.tag?[note.tag]:[];
  for(const note of next.notebook.filter(isContentNote)) for(const name of noteTags(note)) {
    if(typeof name!=='string'||!name.trim())continue;
    if(!tags.some(([value])=>value===name))tags.push([name,colors[name]||'stone']);
    if(!tagScope[name]&&!defaultTags.some(([value])=>value===name)&&!next.notebook.some(other=>!isContentNote(other)&&noteTags(other).includes(name)))tagScope[name]='soc';
  }
  next.nbTags=tags;next.nbTagObor=tagScope;
  if(!state.socTopics?.length&&snapshot.socTopics?.length)next.socTopics=copy(snapshot.socTopics);
  next.contentImports=[...(state.contentImports || []),snapshot.version];
  return next;
}
