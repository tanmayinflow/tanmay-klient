import React, { useState } from 'react';
export function ExerciseAtlasImage({ entry, alt = '', size = 120, fluid = false, dark = false }) {
  const [failed, setFailed] = useState(false);
  if (!entry || failed) return null;
  const art = entry.primary;
  return <img src={fluid || size > 128 ? art.detail : art.thumb} alt={alt} loading="lazy" decoding="async"
    width={art.width} height={art.height} onError={() => setFailed(true)}
    style={{ display:'block', width:fluid?'100%':size, height:fluid?'auto':size, maxWidth:'100%', objectFit:'contain',
      mixBlendMode:dark?'screen':'multiply',filter:dark?'invert(1) sepia(.3)':'brightness(1.1) contrast(1.08)' }} />;
}
