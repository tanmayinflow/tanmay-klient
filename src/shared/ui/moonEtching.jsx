import React, {useId} from "react";

// An original, simplified near-side engraving, informed by NASA/JPL PIA00302.
// Maria, highlands and two ray systems are drawn in the current theme's ink.
// It is an illustration, not a geographical or libration map.
const maria = [
  "M-32-24C-26-35-15-39-8-32L-5-27-9-20-18-18-25-12-32-14-37-20Z",
  "M-34-14L-25-10-23-2-30 6-35 17-39 10-43 4-42-7Z",
  "M-6-26C0-34 13-32 17-25L18-19 13-12 5-11-1-16Z",
  "M12-12L21-17 29-12 30-4 25 1 20 0 19 6 12 5 6-1Z",
  "M32-21C38-24 43-18 41-12L36-8 31-12Z",
  "M24 4L32 1 38 5 35 13 28 17 23 12 19 13 18 8Z",
  "M-21 8L-12 5-7 8-4 16-9 23-17 21-22 17Z",
  "M-30 17L-24 14-19 20-21 27-28 31-32 26Z",
  "M-12-39L-4-42 12-40 21-35 14-33 5-35-3-34Z",
];
// Deterministic fine marks keep the small engraving textured without filters.
const marks=Array.from({length:155},(_,i)=>{
  const a=i*2.3999632297,r=45*Math.sqrt((i+.5)/155);
  return {x:Math.cos(a)*r,y:Math.sin(a)*r,size:.14+(i%5)*.08};
});
const craters=[[-10,-35,2.5],[-20,-5,3.5],[-33,-4,1.6],[-7,31,3.2],[-2,37,2.3],
  [5,25,2.3],[17,18,3.3],[22,23,2.5],[16,27,1.8],[2,14,2.1],[-6,18,1.5],
  [-26,26,2.8],[-24,33,1.6],[31,23,1.4],[35,-2,2.3],[6,-3,1.3],[-4,-10,1.6],
  [-35,-22,1.5],[25,-29,1.8],[28,31,.9],[-14,36,1.3],[10,34,1.7],[-35,18,1.2]];

export function moonLitOutline(phase, radius=46) {
  const value=Number.isFinite(phase)?((phase%1)+1)%1:.5;
  const c=Math.cos(value*Math.PI*2),sign=value<.5?1:-1,points=[];
  for(let y=-radius;y<=radius;y++){const x=Math.sqrt(Math.max(0,radius*radius-y*y));points.push(`${sign*x},${y}`);}
  for(let y=radius;y>=-radius;y--){const x=Math.sqrt(Math.max(0,radius*radius-y*y))*c;points.push(`${sign*x},${y}`);}
  return points.join(" ");
}

export function MoonArt({phase=.5}) {
  const uid=`moon-${useId().replace(/:/g,"")}`;
  return <svg viewBox="0 0 110 110" fill="none" aria-hidden="true" className="tm-moon-etching">
    <defs>
      <clipPath id={`${uid}-disc`}><circle r="46"/></clipPath>
      <clipPath id={`${uid}-lit`}><polygon points={moonLitOutline(phase)}/></clipPath>
      <radialGradient id={`${uid}-limb`} cx="45%" cy="40%" r="58%">
        <stop offset="65%" stopColor="currentColor" stopOpacity="0"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity=".2"/>
      </radialGradient>
      <g id={`${uid}-terrain`} stroke="currentColor" strokeWidth=".42" strokeLinecap="round" strokeLinejoin="round">
        {maria.map((d,i)=><g key={d}><path d={d} fill="currentColor" fillOpacity={.15+(i%3)*.035} strokeOpacity=".25"/>
          <path d={d} transform="translate(.6 .35) scale(.97)" strokeOpacity=".1"/></g>)}
        <g opacity=".6">{marks.map((p,i)=><g key={i}>
          <circle cx={p.x} cy={p.y} r={p.size} fill="currentColor" fillOpacity=".3" strokeOpacity=".3"/>
          {i%3===0&&<path d={`M${p.x-.3} ${p.y+.7}l1.1-.6`} strokeOpacity=".3"/>}
        </g>)}</g>
        <g strokeOpacity=".5">{craters.map(([x,y,r])=><g key={`${x}:${y}`} transform={`translate(${x} ${y})`}>
          <ellipse rx={r} ry={r*(1-Math.abs(y)/160)} fill="currentColor" fillOpacity=".025"/>
          <path d={`M${-r*.74} 0a${r*.75} ${r*.6} 0 0 1 ${r*1.44} -.25`} strokeWidth=".65"/>
          <path d={`M${-r*.45} ${r*.45}q${r*.55} ${r*.3} ${r*.95} -.15`} strokeOpacity=".3"/>
          <path d="M-.55 .45 .05-.55 .6.2" strokeWidth=".3"/>
        </g>)}</g>
        <g strokeOpacity=".16" strokeWidth=".6">
          <path d="M-7 31-26 3M-7 31 5-28M-7 31 35-13M-7 31 34 21M-7 31-24-28M-7 31-35 24M-7 31 14 39M-7 31-12 44"/>
          <path d="M-20-5-31-19M-20-5-5-20M-20-5 2 1M-20-5-3 19M-20-5-36 7M-20-5-39-8"/>
        </g>
      </g>
    </defs>
    <g transform="translate(55 55)">
      <circle r="46" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeOpacity=".3" strokeWidth=".6"/>
      <g clipPath={`url(#${uid}-disc)`}><use href={`#${uid}-terrain`} opacity=".22"/></g>
      <g clipPath={`url(#${uid}-lit)`}>
        <circle r="46" fill="var(--tm-card)"/>
        <use href={`#${uid}-terrain`}/>
        <circle r="46" fill={`url(#${uid}-limb)`}/>
        <circle r="45.7" stroke="currentColor" strokeWidth=".55" strokeOpacity=".4"/>
      </g>
    </g>
  </svg>;
}
