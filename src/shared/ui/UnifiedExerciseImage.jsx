import React, { useState } from 'react';

export function UnverifiedExerciseImage({ message, size = 120, fluid = false, color }) {
  return <span role="img" aria-label={message} title={message} style={{display:'grid',placeItems:'center',width:fluid?'100%':size,maxWidth:'100%',aspectRatio:'1 / 1',fontSize:12,lineHeight:1.5,textAlign:'center',color,padding:fluid?12:2,boxSizing:'border-box'}}>
    {fluid || size > 80 ? message : '—'}
  </span>;
}

// Reviewed character plates: dark ink and an independent body silhouette.
// Standard plates retain their original fallback. Hollow contours use a textual fallback.
export function UnifiedExerciseImage({ entry, alt = '', size = 120, fluid = false, dark = false, background, children }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const [layers, setLayers] = useState({});
  const art = entry.primary;
  const detail = fluid || size > 128;
  const src = detail ? art.detail : art.thumb;
  const loaded = loadedSrc === src;
  const failed = failedSrc === src;
  // Hollow contour originals must not regain an opaque body through the fill mask.
  const supportsMask = !entry.transparentBody && typeof CSS !== 'undefined' && (CSS.supports('mask-image','url("")') || CSS.supports('-webkit-mask-image','url("")'));
  const inkSrc = detail ? art.inkDetail : art.inkThumb;
  const fillSrc = detail ? art.fillDetail : art.fillThumb;
  const contourOnly = !!entry.contourOnly;
  const masked = (contourOnly || loaded) && supportsMask && layers.ink === inkSrc && (contourOnly || layers.fill === fillSrc);
  const mask = (url) => ({ position:'absolute', inset:0, maskImage:`url("${url}")`, WebkitMaskImage:`url("${url}")`, maskSize:'contain', WebkitMaskSize:'contain', maskRepeat:'no-repeat', WebkitMaskRepeat:'no-repeat', maskPosition:'center', WebkitMaskPosition:'center' });
  return <span role={contourOnly?'img':undefined} aria-label={contourOnly?alt:undefined} style={{ position:'relative', display:'block', width:fluid?'100%':size, maxWidth:'100%', aspectRatio:'1 / 1' }}>
    {!contourOnly && (!loaded || failed) && children}
    <img src={src} alt={contourOnly?'':alt} aria-hidden={contourOnly||undefined} width={960} height={960} loading="lazy" decoding="async" onLoad={()=>setLoadedSrc(src)} onError={()=>setFailedSrc(src)}
      style={{ position:'absolute', inset:0, display:failed?'none':'block', opacity:masked || contourOnly?0:1, width:'100%', height:'100%', objectFit:'contain', filter:entry.transparentBody && dark?'invert(1)':undefined }}/>
    {contourOnly && (!masked || layers.failedInk === inkSrc) && <UnverifiedExerciseImage message={alt} size={size} fluid={fluid} color={dark?'#d9cfbb':'#292622'}/>}
    {(contourOnly || loaded) && supportsMask && <>
      <img src={inkSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,ink:inkSrc,failedInk:null}))} onError={()=>setLayers(prev=>({...prev,ink:null,failedInk:inkSrc}))}/>
      {!contourOnly && <img src={fillSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,fill:fillSrc}))}/>}
    </>}
    {masked && (contourOnly || !failed) && <span aria-hidden="true" style={{ position:'absolute', inset:0 }}>
      {!contourOnly && <span style={{ ...mask(fillSrc), background:dark?'#d9cfbb':background || '#e4dac8' }}/>}
      <span style={{ ...mask(inkSrc), background:contourOnly && dark?'#d9cfbb':'#292622' }}/>
    </span>}
  </span>;
}
