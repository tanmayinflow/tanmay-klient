import React, { useState } from 'react';
import { UnifiedExerciseImage, UnverifiedExerciseImage } from './UnifiedExerciseImage.jsx';
export function EmptyExerciseImage({ size = 120, fluid = false }) {
  return <span aria-hidden="true" style={{display:'block',width:fluid?'100%':size,maxWidth:'100%',aspectRatio:'1 / 1'}}/>;
}

export function ExerciseAtlasImage({ entry, alt = '', size = 120, fluid = false, dark = false, background, detailThreshold = 128 }) {
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  if (!entry) return <EmptyExerciseImage size={size} fluid={fluid}/>;
  if(entry.suppress)return <UnverifiedExerciseImage message={alt} size={size} fluid={fluid} color={dark?"#d9cfbb":"#292622"}/>;
  if (entry.unified) return <UnifiedExerciseImage key={entry.sourceSha256} entry={entry} alt={alt} size={size} fluid={fluid} dark={dark} background={background}/>;
  const art = entry.primary;
  const src = fluid || size >= detailThreshold ? art.detail : art.thumb;
  const visible = loadedSrc === src && failedSrc !== src;
  return <span style={{position:'relative',display:'block',width:fluid?'100%':size,maxWidth:'100%',aspectRatio:'1 / 1'}}>
    <img key={src} src={src} alt={alt} loading="lazy" decoding="async" draggable={false}
      width={art.width} height={art.height} onLoad={() => {setLoadedSrc(src);setFailedSrc(null);}} onError={() => setFailedSrc(src)}
      style={{ position:'absolute',inset:0,display:'block',visibility:visible?'visible':'hidden',width:'100%',height:'100%',objectFit:'contain',
        mixBlendMode:dark?'screen':'multiply',filter:dark?'invert(1) sepia(.3)':'brightness(1.1) contrast(1.08)' }}/>
  </span>;
}
