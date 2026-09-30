import React,{useId} from "react";
import {ASTRO_PLANETS,ASTRO_SIGNS} from "../product/togetherAstrologyEditorial.js";
import {ZODIAC} from "../product/togetherMoon.js";
const point=(angle,radius)=>({x:190-Math.cos(angle*Math.PI/180)*radius,y:190+Math.sin(angle*Math.PI/180)*radius});
const textSymbol=symbol=>`${symbol}\uFE0E`;
const positionLabel=(planet,L)=>`${Math.floor(planet.degree)}° ${String(Math.floor((planet.degree%1)*60)).padStart(2,"0")}′ ${L(...ZODIAC[planet.sign])}`;
function chartPoints(planets){
  const placed=[];
  for(const planet of [...planets].sort((a,b)=>a.longitude-b.longitude)){
    const choices=[0,14,-14,28,-28,42,-42].flatMap(offset=>[121,80,41].map(radius=>({...point(planet.longitude+offset,radius),radius})));
    const next=choices.find(p=>placed.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=37))||choices.reduce((a,b)=>{
      const clearance=p=>Math.min(...placed.map(q=>Math.hypot(p.x-q.x,p.y-q.y)));
      return clearance(a)>clearance(b)?a:b;
    });
    placed.push({...planet,...next});
  }
  return placed;
}
export function SkyChart({planets,aspects,selected,onSelect,nakshatra=false,L}){
  const uid=useId(),places=chartPoints(planets),byId=Object.fromEntries(places.map(p=>[p.id,p]));
  return <svg className="tg-astro-wheel" viewBox="0 0 380 380" role="group" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-desc`}>
    <title id={`${uid}-title`}>{L("Interaktivní kruh planet","Interactive planetary wheel")}</title>
    <desc id={`${uid}-desc`}>{L("Znamení začínají Beranem vlevo. Kliknutím na symbol vybereš planetu. Přesné polohy i všechny ovladače jsou také v seznamu pod grafem.","Signs begin with Aries on the left. Select a planet by its symbol. Exact positions and all controls are also listed below the chart.")}</desc>
    <g fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="190" cy="190" r="178" opacity=".6"/><circle cx="190" cy="190" r="149" opacity=".4"/>
      <circle cx="190" cy="190" r="144" strokeDasharray="1 5" opacity=".25"/>
      {Array.from({length:72},(_,i)=>{const a=point(i*5,178),b=point(i*5,i%6===0?149:174);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity={i%6===0?.6:.3}/>;})}
      {nakshatra&&Array.from({length:27},(_,i)=>{const a=point(i*360/27,141),b=point(i*360/27,135);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} opacity=".5"/>;})}
      {aspects.map(aspect=>{const a=byId[aspect.a],b=byId[aspect.b];if(!a||!b)return null;return <line className="tg-astro-aspect" key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={a.id===selected||b.id===selected?1.2:.6} opacity={a.id===selected||b.id===selected?.65:.14} strokeDasharray={aspect.id==="square"||aspect.id==="opposition"?"3 4":undefined}/>;})}
      <circle cx="190" cy="190" r="3" opacity=".5"/>
    </g>
    {ASTRO_SIGNS.map((sign,i)=>{const p=point(i*30+15,163);return <text className="astro-symbol" key={i} x={p.x} y={p.y+6} textAnchor="middle" fontSize="21" fill="currentColor" aria-hidden="true">{textSymbol(sign.symbol)}</text>;})}
    {places.map(planet=>{const edge=point(planet.longitude,148),isSelected=planet.id===selected,name=L(...(ASTRO_PLANETS[planet.id]||{name:[planet.id,planet.id]}).name);return <g key={planet.id}>
      <line x1={edge.x} y1={edge.y} x2={planet.x} y2={planet.y} stroke="currentColor" opacity=".24" aria-hidden="true"/>
      <circle cx={edge.x} cy={edge.y} r="2" fill="currentColor" aria-hidden="true"/>
      <g className="tg-astro-planet" style={{transform:`translate(${planet.x}px,${planet.y}px)`}} role="button" tabIndex={0} aria-pressed={isSelected} aria-label={`${name}, ${positionLabel(planet,L)}${planet.retrograde?L(", retrográdní",", retrograde"):""}`} onClick={()=>onSelect(planet.id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(planet.id);}}}>
        <circle r="20" className={isSelected?"selected":""}/><text className="astro-symbol" textAnchor="middle" y="8" fontSize="27" aria-hidden="true">{textSymbol((ASTRO_PLANETS[planet.id]||{symbol:planet.id==="Rahu"?"☊":"☋"}).symbol)}</text>
      </g>
    </g>;})}
  </svg>;
}
