import React, { useState } from 'react';

export function UnverifiedExerciseImage({ message, size = 120, fluid = false, color }) {
  return <span role="img" aria-label={message} title={message} style={{display:'grid',placeItems:'center',width:fluid?'100%':size,maxWidth:'100%',aspectRatio:'1 / 1',fontSize:12,lineHeight:1.5,textAlign:'center',color,padding:fluid?12:2,boxSizing:'border-box'}}>
    {fluid || size > 80 ? message : '—'}
  </span>;
}

// Reviewed character plates: dark ink and an independent body silhouette.
// Loading and failed requests reserve the artwork area without a substitute drawing.
export function UnifiedExerciseImage({ entry, alt = '', size = 120, fluid = false, dark = false, background }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const [layers, setLayers] = useState({});
  const art = entry.primary;
  const detail = fluid || size > 128;
  const inkSrc = detail ? art.inkDetail : art.inkThumb;
  const contourOnly = !!entry.contourOnly;
  // The approved ink layer is also the mask-free rendering of a hollow plate.
  const src = contourOnly ? inkSrc : detail ? art.detail : art.thumb;
  const loaded = loadedSrc === src;
  const failed = failedSrc === src;
  // Hollow contour originals must not regain an opaque body through the fill mask.
  const supportsMask = !entry.transparentBody && typeof CSS !== 'undefined' && (CSS.supports('mask-image','url("")') || CSS.supports('-webkit-mask-image','url("")'));
  const fillSrc = detail ? art.fillDetail : art.fillThumb;
  const masked = loaded && supportsMask && (contourOnly || (layers.ink === inkSrc && layers.fill === fillSrc));
  const mask = (url) => ({ position:'absolute', inset:0, maskImage:`url("${url}")`, WebkitMaskImage:`url("${url}")`, maskSize:'contain', WebkitMaskSize:'contain', maskRepeat:'no-repeat', WebkitMaskRepeat:'no-repeat', maskPosition:'center', WebkitMaskPosition:'center' });
  return <span role={loaded&&!failed?'img':undefined} aria-label={loaded&&!failed?alt:undefined} style={{ position:'relative', display:'block', width:fluid?'100%':size, maxWidth:'100%', aspectRatio:'1 / 1' }}>
    <img key={src} src={src} alt="" aria-hidden="true" width={960} height={960} loading="lazy" decoding="async" onLoad={()=>{setLoadedSrc(src);setFailedSrc(null);}} onError={()=>setFailedSrc(src)}
      style={{ position:'absolute', inset:0, display:failed?'none':'block', opacity:loaded&&!masked?1:0, width:'100%', height:'100%', objectFit:'contain', filter:contourOnly?(dark?'brightness(0) invert(1)':'brightness(0)'):entry.transparentBody && dark?'invert(1)':undefined }}/>
    {loaded && supportsMask && !contourOnly && <>
      <img src={inkSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,ink:inkSrc,failedInk:null}))} onError={()=>setLayers(prev=>({...prev,ink:null,failedInk:inkSrc}))}/>
      {!contourOnly && <img src={fillSrc} alt="" aria-hidden="true" style={{display:'none'}} onLoad={()=>setLayers(prev=>({...prev,fill:fillSrc}))}/>}
    </>}
    {masked && !failed && <span aria-hidden="true" style={{ position:'absolute', inset:0, filter:entry.darkOutline && dark?'drop-shadow(0.5px 0 0 #d9cfbb) drop-shadow(-0.5px 0 0 #d9cfbb) drop-shadow(0 0.5px 0 #d9cfbb) drop-shadow(0 -0.5px 0 #d9cfbb)':undefined }}>
      {!contourOnly && <span style={{ ...mask(fillSrc), background:dark?'#d9cfbb':background || '#e4dac8' }}/>}
      <span style={{ ...mask(inkSrc), background:contourOnly && dark && !entry.darkOutline?'#d9cfbb':'#292622' }}/>
    </span>}
  </span>;
}
