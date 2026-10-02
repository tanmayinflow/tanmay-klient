import React, { useState } from 'react';

// Reviewed character plates: dark ink and an independent body silhouette.
// Originals remain a usable fallback while masks load or when masking is unavailable.
export function UnifiedExerciseImage({ entry, alt = '', size = 120, fluid = false, dark = false, background, children }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const art = entry.primary;
  const detail = fluid || size > 128;
  const src = detail ? art.detail : art.thumb;
  const masked = loaded && typeof CSS !== 'undefined' && (CSS.supports('mask-image','url("")') || CSS.supports('-webkit-mask-image','url("")'));
  const mask = (url) => ({ position:'absolute', inset:0, maskImage:`url("${url}")`, WebkitMaskImage:`url("${url}")`, maskSize:'contain', WebkitMaskSize:'contain', maskRepeat:'no-repeat', WebkitMaskRepeat:'no-repeat', maskPosition:'center', WebkitMaskPosition:'center' });
  return <span style={{ position:'relative', display:'block', width:fluid?'100%':size, maxWidth:'100%', aspectRatio:'1 / 1' }}>
    {(!loaded || failed) && children}
    <img src={src} alt={alt} width={960} height={960} loading="lazy" decoding="async" onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)}
      style={{ position:'absolute', inset:0, display:failed?'none':'block', opacity:masked?0:1, width:'100%', height:'100%', objectFit:'contain' }}/>
    {masked && !failed && <span aria-hidden="true" style={{ position:'absolute', inset:0 }}>
      <span style={{ ...mask(detail?art.fillDetail:art.fillThumb), background:dark?'#d9cfbb':background || '#e4dac8' }}/>
      <span style={{ ...mask(detail?art.inkDetail:art.inkThumb), background:'#292622' }}/>
    </span>}
  </span>;
}
