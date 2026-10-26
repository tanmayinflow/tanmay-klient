import React, { useId } from "react";

// Original pen illustration, tinted by the theme. The geometric illumination is
// separate, so every phase still follows the selected day's astronomy.
export function moonLitOutline(phase, radius=46) {
  const value=Number.isFinite(phase)?((phase%1)+1)%1:.5;
  const c=Math.cos(value*Math.PI*2),sign=value<.5?1:-1,points=[];
  for(let y=-radius;y<=radius;y++){const x=Math.sqrt(Math.max(0,radius*radius-y*y));points.push(`${sign*x},${y}`);}
  for(let y=radius;y>=-radius;y--){const x=Math.sqrt(Math.max(0,radius*radius-y*y))*c;points.push(`${sign*x},${y}`);}
  return points.join(" ");
}


export function MoonArt({ phase = .5 }) {
  const uid = `moon-${useId().replace(/:/g, "")}`;
  return <svg viewBox="0 0 110 110" fill="none" aria-hidden="true" className="tm-moon-etching">
    <defs>
      <clipPath id={`${uid}-lit`}><polygon points={moonLitOutline(phase)}/></clipPath>
      <mask id={`${uid}-ink`} maskUnits="userSpaceOnUse" x="-49" y="-49" width="98" height="98" style={{ maskType: "alpha" }}>
        <image href="/media/icons/moon-handdrawn-v2.png" x="-49" y="-49" width="98" height="98"/>
      </mask>
      <g id={`${uid}-terrain`}><rect x="-49" y="-49" width="98" height="98" fill="currentColor" mask={`url(#${uid}-ink)`}/></g>
    </defs>
    <g transform="translate(55 55)">
      <circle r="46" fill="currentColor" fillOpacity=".08"/>
      <use href={`#${uid}-terrain`} opacity=".2"/>
      <g clipPath={`url(#${uid}-lit)`}>
        <circle r="46" fill="var(--tm-card)"/>
        <use href={`#${uid}-terrain`} opacity=".75"/>
      </g>
    </g>
  </svg>;
}
