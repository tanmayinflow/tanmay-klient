// Bibliography metadata is supplied by each app; private reading content stays
// in that app and is never copied into the shared-core bundle.
export function trainingSourceMetadata(documents){
  return documents.map(doc=>({id:doc.id,title:[doc.cz,doc.en],author:doc.author,sources:doc.sources||[],assets:(doc.chapters||[]).flatMap(chapter=>(chapter.blocks||[]).filter(block=>block.t==='img'&&block.attribution).map(block=>({url:block.src,title:block.attribution}))),notes:(doc.chapters||[]).flatMap(chapter=>{
    let question=[chapter.cz,chapter.en];
    return (chapter.blocks||[]).flatMap(block=>{
      if(block.t==='sub')question=[block.cz,block.en];
      return block.t==='src'?[{title:question,text:[block.cz,block.en]}]:[];
    });
  })}));
}
