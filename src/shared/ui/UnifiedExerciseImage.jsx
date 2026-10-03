import React, { useState } from 'react';

export function UnverifiedExerciseImage({ message, size = 120, fluid = false, color }) {
  return <span role="img" aria-label={message} title={message} style={{display:'grid',placeItems:'center',width:fluid?'100%':size,maxWidth:'100%',aspectRatio:'1 / 1',fontSize:12,lineHeight:1.5,textAlign:'center',color,padding:fluid?12:2,boxSizing:'border-box'}}>
    {fluid || size > 80 ? message : '—'}
  </span>;
}

// Reviewed character plates: dark ink and an independent body silhouette.
// Originals remain a usable fallback while masks load or when masking is unavailable.
export function UnifiedExerciseImage({ entry, alt = '', size = 120, fluid = false, dark = false, background, children }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const [layers, setLayers] = useState({});
  const art = entry.primary;
  const detail = fluid || size > 128;
  const src = detail ? art.detail : art.thumb;
  const loaded = loadedSrc === src;
  const failed = failedSrc === src;
  const supportsMask = typeof CSS !== 'undefined' && (CSS.supports('mask-image','url("")') || CSS.supports('-webkit-mask-image','url("")'));
  const inkSrc = detail ? art.inkDetail : art.inkThumb;
  const fillSrc = detail ? art.fillDetail : art.fillThumb;
  const masked = loaded && supportsMask && layers.ink === inkSrc && layers.fill === fillSrc;
  const mask = (url) => ({ position:'absolute', inset:0, maskImage:`url("${url}")`, WebkitMaskImage:`url("${url}")`, maskSize:'contain', WebkitMaskSize:'contain', maskRepeat:'no-repeat', WebkitMaskRepeat:'no-repeat', maskPosition:'center', WebkitMaskPosition:'center' });
  return <span style={{ position:'relative', display:'block', width:fluid?'100%':size, maxWidth:'100%', aspectRatio:'1 / 1' }}>
    {(!loaded || failed) && children}
    <img src={src} alt={alt} width={960} height={960} loading="lazy" decoding="async" onLoad={()=>setLoadedSrc(src)} onError={()=>setFailedSrc(src)}
      style={{ position:'absolute', inset:0, display:failed?'none':'block', opacity:masked?0:1, width:'100%', height:'100%', objectFit:'contain' }}/>
    {loaded && supportsMask && <>
      <img src={inkSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,ink:inkSrc}))}/>
      <img src={fillSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,fill:fillSrc}))}/>
    </>}
    {masked && !failed && <span aria-hidden="true" style={{ position:'absolute', inset:0 }}>
      <span style={{ ...mask(fillSrc), background:dark?'#d9cfbb':background || '#e4dac8' }}/>
      <span style={{ ...mask(inkSrc), background:'#292622' }}/>
    </span>}
  </span>;
}
