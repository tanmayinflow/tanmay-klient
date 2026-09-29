import React,{useId} from 'react';

// Original transparent illustration plates; viewBoxes select a cell without
// cutting, tracing or recoloring the source. Ink follows the app's theme.
const botanical='/media/spolu/botanical-engraving.png';
const care='/media/spolu/care-engraving.png';
const plates={
  'botanical-menstrual':[botanical,2,0,0],
  'botanical-follicular':[botanical,2,1,0],
  'botanical-ovulatory':[botanical,2,0,1],
  'botanical-luteal':[botanical,2,1,1],
  move:[care,3,0,0],food:[care,3,1,0],mind:[care,3,2,0],
  pattern:[care,3,2,0],plan:[care,3,0,1],bond:[care,3,1,1],
  shared:[care,3,2,1],shadow:[care,3,0,2],ritual:[care,3,1,2],spiral:[care,3,2,2],
  story:['/media/icons/sources-illustration-v1.png',1,0,0]
};

export function TogetherArtwork({kind,x=-100,y=-100,width=200,height=200}){
  const id=`spolu-art-${useId().replace(/:/g,'')}`;
  const plate=plates[kind];
  if(!plate)return null;
  const [src,grid,col,row]=plate;
  // The doorway's loose ink reaches the adjacent cell's empty left margin.
  const inset=kind==='ritual'?.06:0;
  return <svg x={x} y={y} width={width} height={height} viewBox={`${col+inset} ${row} ${1-inset} 1`} preserveAspectRatio="xMidYMid meet" overflow="hidden" aria-hidden="true" className="tg-engraved-art">
    <defs><mask id={id} x="0" y="0" width={grid} height={grid} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{maskType:'alpha'}}><image href={src} x="0" y="0" width={grid} height={grid} preserveAspectRatio="none"/></mask></defs>
    <rect x="0" y="0" width={grid} height={grid} fill="currentColor" stroke="none" mask={`url(#${id})`}/>
  </svg>;
}
