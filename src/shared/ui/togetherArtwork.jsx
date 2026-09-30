import React,{useId} from 'react';

// The original plates are deliberately irregular, not an equal-cell atlas.
// Measured ink bounds isolate each complete motif before contain-scaling it.
const botanical='/media/spolu/botanical-engraving.png';
const care='/media/spolu/care-engraving.png';
const plates={
  'botanical-menstrual':[botanical,110,55,450,568],
  'botanical-follicular':[botanical,735,20,445,607],
  'botanical-ovulatory':[botanical,76,632,508,612],
  'botanical-luteal':[botanical,698,635,488,608],
  move:[care,22,20,394,422],food:[care,438,174,401,264],mind:[care,860,46,373,389],
  pattern:[care,860,46,373,389],plan:[care,20,491,423,325],bond:[care,443,510,394,292],
  shared:[care,859,456,383,375],shadow:[care,20,826,414,404],ritual:[care,439,870,401,332],spiral:[care,857,909,386,284],
  story:['/media/icons/sources-illustration-v1.png',0,0,1254,1254]
};

export function TogetherArtwork({kind,x=-100,y=-100,width=200,height=200}){
  const id=`spolu-art-${useId().replace(/:/g,'')}`;
  const plate=plates[kind];
  if(!plate)return null;
  const [src,left,top,w,h]=plate;
  return <svg x={x} y={y} width={width} height={height} viewBox={`${left} ${top} ${w} ${h}`} preserveAspectRatio="xMidYMid meet" overflow="hidden" aria-hidden="true" className="tg-engraved-art">
    <defs><mask id={id} x={left} y={top} width={w} height={h} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href={src} x="0" y="0" width="1254" height="1254" preserveAspectRatio="none"/></mask></defs>
    <rect x={left} y={top} width={w} height={h} fill="currentColor" stroke="none" mask={`url(#${id})`}/>
  </svg>;
}
