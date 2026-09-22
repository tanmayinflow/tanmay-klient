// External metadata is separate from personal score and notes. No silent overwrite.
export function safeSourceUrl(raw) {
  try { const u = new URL(String(raw || '').trim()); return ['https:','http:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function sourceSearchLink(entry) {
  const movie = entry.type === 'Movie';
  return {label:movie?'IMDb':'Goodreads',url:movie?'https://www.imdb.com/find/?q='+encodeURIComponent(entry.title||''):'https://www.goodreads.com/search?q='+encodeURIComponent([entry.title,entry.author].filter(Boolean).join(' '))};
}
export function metadataPatch(entry, result) {
  const patch={externalMeta:result};
  for(const key of ['author','year','isbn']) if(!entry[key] && result[key])patch[key]=result[key];
  if(!entry.icon && safeSourceUrl(result.cover))patch.icon=result.cover;
  return patch;
}
export async function lookupSource(entry, {fetcher=fetch, omdbKey='', online=true, signal}={}) {
  if(!online || !String(entry.title||'').trim())return [];
  const clean = v => v && v !== 'N/A' ? String(v) : '';
  try {
    if(entry.type==='Movie') {
      if(!omdbKey)return [];
      const id=String(entry.url||'').match(/imdb\.com\/title\/(tt\d+)/)?.[1];
      const params=new URLSearchParams({apikey:omdbKey,...(id?{i:id}:{t:entry.title}),plot:'short'});
      const r=await fetcher('https://www.omdbapi.com/?'+params,{signal}); if(!r.ok)return [];
      const x=await r.json(); if(x.Response!=='True')return [];
      return [{title:clean(x.Title),author:clean(x.Director),year:clean(x.Year),description:clean(x.Plot),genre:clean(x.Genre),duration:clean(x.Runtime),cover:safeSourceUrl(x.Poster),rating:clean(x.imdbRating),scale:10,provider:'IMDb · OMDb',url:/^tt\d+$/.test(x.imdbID)?'https://www.imdb.com/title/'+x.imdbID+'/':'',fetchedAt:new Date().toISOString()}];
    }
    if(entry.type!=='Book')return [];
    const params=new URLSearchParams({title:entry.title,limit:'5',fields:'key,title,author_name,first_publish_year,isbn,cover_i,ratings_average,ratings_count'});
    if(entry.author)params.set('author',entry.author);
    const r=await fetcher('https://openlibrary.org/search.json?'+params,{signal});if(!r.ok)return [];
    const data=await r.json();return (data.docs||[]).filter(x=>x.title && /^\/works\/OL\d+W$/.test(x.key)).map(x=>({title:x.title,author:(x.author_name||[]).join(', '),year:String(x.first_publish_year||''),isbn:x.isbn?.[0]||'',cover:Number.isSafeInteger(x.cover_i)&&x.cover_i>0?'https://covers.openlibrary.org/b/id/'+x.cover_i+'-M.jpg':'',rating:Number.isFinite(x.ratings_average)?Number(x.ratings_average.toFixed(2)):null,ratingCount:x.ratings_count||0,scale:5,provider:'Open Library',url:'https://openlibrary.org'+x.key,fetchedAt:new Date().toISOString()}));
  }catch{return [];}
}
