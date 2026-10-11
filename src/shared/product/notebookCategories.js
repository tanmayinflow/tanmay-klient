// Rename only the exact former built-in category. Custom names, folders,
// record IDs and note text are never rewritten.
export function migrateNotebookArtCategory(state) {
  const previous='Poezie a písně',nextName='Umění';
  const rename=name=>name===previous?nextName:name;
  const note=entry=>{
    if(entry.tag!==previous&&!(entry.tags||[]).includes(previous))return entry;
    return {...entry,...(entry.tag===previous?{tag:nextName}:{}),...(Array.isArray(entry.tags)?{tags:[...new Set(entry.tags.map(rename))]}:{})};
  };
  const notebook=(state.notebook||[]).map(note);
  const trash=(state.trash||[]).map(entry=>entry.entryKind==='notebook'&&entry.data?{...entry,data:note(entry.data)}:entry);
  const changedNotes=notebook.some((entry,index)=>entry!==state.notebook[index]);
  const changedTrash=trash.some((entry,index)=>entry.data!==state.trash[index]?.data);
  const changedTags=state.nbTags?.some(([name])=>name===previous);
  const changedScope=Object.prototype.hasOwnProperty.call(state.nbTagObor||{},previous);
  if(!changedNotes&&!changedTrash&&!changedTags&&!changedScope)return state;
  const result={...state,...(changedNotes?{notebook}:{}),...(changedTrash?{trash}:{})};
  if(changedTags) {
    const names=new Set();
    const existing=state.nbTags.find(([name])=>name===nextName);
    result.nbTags=state.nbTags.map(([name,color])=>name===previous&&existing?existing:[rename(name),color]).filter(([name])=>!names.has(name)&&names.add(name));
  }
  if(changedScope) {
    result.nbTagObor={...state.nbTagObor};
    if(!Object.prototype.hasOwnProperty.call(result.nbTagObor,nextName))result.nbTagObor[nextName]=result.nbTagObor[previous];
    delete result.nbTagObor[previous];
  }
  return result;
}
