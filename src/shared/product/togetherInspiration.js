// A fresh batch excludes the current suggestions whenever the filtered pool permits it.
export function inspirationBatch(items,currentIds=[],random=Math.random,count=3){
  const available=items.filter(item=>!currentIds.includes(item.id));
  const shuffle=pool=>{
    const shuffled=[...pool];
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    return shuffled;
  };
  return [...shuffle(available),...shuffle(items.filter(item=>currentIds.includes(item.id)))].slice(0,count);
}
export function filterInspirations(items,{context='all',minutes=120,energy=3}={}){
  return items.filter(item=>(context==='all'||item.context===context||item.context==='anywhere')&&item.minutes<=minutes&&item.energy<=energy);
}
