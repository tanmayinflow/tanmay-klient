import React from 'react';

// A small seven-circle flower leaves the botanical plates and their labels
// foremost. This ornament carries no cycle measurements or phase durations.
const radius=42;
const centers=[[0,0],...Array.from({length:6},(_,index)=>{
  const angle=(index*60-90)*Math.PI/180;
  return [Math.cos(angle)*radius,Math.sin(angle)*radius];
})];

export function CycleGeometry({focused}){
  return <g className="tg-cycle-geometry" transform="translate(190 174)" aria-hidden="true" style={{opacity:focused?0:.19}} fill="none" stroke="currentColor" strokeWidth=".65">
    {centers.map(([x,y],index)=><circle key={index} cx={x} cy={y} r={radius} opacity={index===0?.8:.65}/>)}
  </g>;
}
