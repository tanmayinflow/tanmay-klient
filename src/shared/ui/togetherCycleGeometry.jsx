import React from 'react';

// A quiet decorative underdrawing. Its circles and connecting lines encode no
// cycle measurements, phase lengths or biological relationships.
const radius=54;
const flowerCenters=[];
for(let q=-2;q<=2;q++)for(let r=-2;r<=2;r++){
  if(Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=2){
    flowerCenters.push([radius*(q+r/2),radius*Math.sqrt(3)*r/2]);
  }
}
const hexagon=distance=>Array.from({length:6},(_,index)=>{
  const angle=(index*60-90)*Math.PI/180;
  return [Math.cos(angle)*distance,Math.sin(angle)*distance];
});
const metatronCenters=[[0,0],...hexagon(radius),...hexagon(radius*2)];
const coordinate=value=>Number(value.toFixed(3));
// One path keeps collinear connections from accumulating darker ink where
// several node pairs share a segment.
const metatronLines=metatronCenters.flatMap(([x,y],index)=>metatronCenters.slice(index+1).map(([toX,toY])=>`M${coordinate(x)},${coordinate(y)}L${coordinate(toX)},${coordinate(toY)}`)).join(' ');

export function CycleGeometry({focused}){
  return <g className="tg-cycle-geometry" transform="translate(190 170)" aria-hidden="true" style={{opacity:focused?0:1}} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <g className="tg-cycle-flower-of-life" opacity=".32" strokeWidth=".68">
      {flowerCenters.map(([x,y],index)=><circle key={index} cx={x} cy={y} r={radius}/>)}
    </g>
    <g className="tg-cycle-metatron" opacity=".18" strokeWidth=".62">
      <path d={metatronLines}/>
      {metatronCenters.map(([x,y],index)=><circle key={index} cx={x} cy={y} r={radius/2}/>)}
    </g>
    <circle r={radius*3} opacity=".18" strokeWidth=".7"/>
  </g>;
}
