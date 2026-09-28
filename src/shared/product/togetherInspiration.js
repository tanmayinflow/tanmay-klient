// A fresh batch excludes the current suggestions whenever the filtered pool permits it.
export function inspirationBatch(items,currentIds=[],random=Math.random,count=3,seenIds=[]){
  const fresh=items.filter(item=>!currentIds.includes(item.id)&&!seenIds.includes(item.id));
  const available=items.filter(item=>!currentIds.includes(item.id)&&seenIds.includes(item.id));
  const shuffle=pool=>{
    const shuffled=[...pool];
    for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
    return shuffled;
  };
  return [...shuffle(fresh),...shuffle(available),...shuffle(items.filter(item=>currentIds.includes(item.id)))].slice(0,count);
}
export function filterInspirations(items,{context='all',contexts,minutes=120,energy=3,themes=[]}={}){
  // New multi-place selection takes precedence; older callers can keep one context.
  const places=Array.isArray(contexts)?contexts:context==='all'?[]:[context];
  return items.filter(item=>(!places.length||places.includes(item.context)||item.context==='anywhere')&&item.minutes<=minutes&&item.energy<=energy&&(!themes.length||themes.some(theme=>item.themes?.includes(theme))));
}

// Longer time windows should reveal their new possibilities, while preserving
// all filters and avoiding the currently visible cards whenever alternatives exist.
export function filteredInspirationBatch(items,filters={},currentIds=[],random=Math.random,count=3,seenIds=[]){
  const pool=filterInspirations(items,filters),batch=inspirationBatch(pool,currentIds,random,count,seenIds);
  const lowerBound=filters.minutes>=480?240:filters.minutes>=240?120:null;
  if(lowerBound===null||!batch.length||batch.some(item=>item.minutes>lowerBound))return batch;
  const longer=pool.filter(item=>item.minutes>lowerBound&&!currentIds.includes(item.id));
  const choice=inspirationBatch(longer,[],random,1,seenIds)[0];
  if(!choice)return batch;
  // Vary the position too; the long invitation is not a fixed promoted card.
  const index=Math.floor(random()*batch.length);
  return batch.map((item,i)=>i===index?choice:item);
}
