import { TmIcon as FamilyIcon } from "./icons.jsx";
import { TmIcon } from "./icons.jsx";
// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/appearance.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Eight complete themes, one shared Landscape construction.
import React, { useEffect, useRef, useState } from "react";
import { themeMaterialVars } from "./themeMaterials.js";
import { DEFAULT_SURFACE_STYLE, readSurfaceStyle, writeSurfaceStyle, watchSurfaceStyle } from "./appearance.js";
import {
  APPEARANCE_PRESETS, DEFAULT_PRESET, previewTokens,
} from "./themeRegistry.js";

const SURFACE_OPTIONS = [
  { id: "original", cs: "Původní", en: "Original", descCs: "Původní podklady a oddělení bloků.", descEn: "Original surfaces and separation between blocks." },
  { id: "veil", cs: "Lehký závoj", en: "Light veil", descCs: "Jemné průsvitné podklady s lehkým stínem.", descEn: "Soft translucent surfaces with a light shadow." },
  { id: "shadow", cs: "Měkký stín", en: "Soft shadow", descCs: "Téměř průhledné podklady s měkkým stínem.", descEn: "Nearly transparent surfaces with a soft shadow." },
  { id: "clear", cs: "Téměř průhledné", en: "Nearly transparent", descCs: "Průhledné podklady, oddělené jemnou linkou.", descEn: "Transparent surfaces separated by a fine line." },
];

export function createAppearanceUI(useT, L) {
  function Snippet({ preset }) {
    const tok = previewTokens(preset.id), vars = themeMaterialVars(preset.id, preset.palette);
    return <span aria-hidden="true" style={{display:"flex",flexDirection:"column",height:86,width:"100%",overflow:"hidden",borderRadius:6,background:tok.background,backgroundImage:vars['--land-field'],backgroundSize:'220px auto'}}>
      <span style={{display:'grid',gap:5,padding:7,flex:1}}>
        <span style={{display:'grid',gap:3,padding:'5px 6px',background:tok.card,border:`1px solid ${tok.border}`,borderRadius:4}}>
          <span style={{height:3,width:'64%',background:tok.heading,borderRadius:2}} />
          <span style={{height:2,width:'90%',background:tok.text,borderRadius:2}} />
          <span style={{height:2,width:'74%',background:tok.textMuted,borderRadius:2}} />
        </span>
        <span style={{display:'grid',gap:3,padding:'4px 6px',background:tok.documentSurface,border:`1px solid ${tok.border}`,borderRadius:3}}>
          <span style={{height:2,width:'88%',background:tok.text,borderRadius:2}} />
          <span style={{height:2,width:'56%',background:tok.text,borderRadius:2}} />
        </span>
      </span>
      <span style={{height:12,position:'relative',flexShrink:0,background:tok.navigation,backgroundImage:vars['--land-nav-material'],backgroundSize:'220px auto'}}>
        <span style={{position:'absolute',inset:'-6px 0 0',background:tok.navigation,backgroundImage:vars['--land-nav-material'],mask:"url('/media/landscape/edge-wide.png') center/100% 100% no-repeat",WebkitMask:"url('/media/landscape/edge-wide.png') center/100% 100% no-repeat",transform:'scaleY(-1)'}} />
      </span>
    </span>;
  }

  function Radios({ label, items, value, onPick }) {
    const { t } = useT(), refs = useRef([]);
    const current = Math.max(0,items.findIndex(p=>p.id===value));
    function move(e) {
      let next;
      if (['ArrowRight','ArrowDown'].includes(e.key)) next=(current+1)%items.length;
      else if (['ArrowLeft','ArrowUp'].includes(e.key)) next=(current+items.length-1)%items.length;
      else if (e.key==='Home') next=0;
      else if (e.key==='End') next=items.length-1;
      else return;
      e.preventDefault();onPick(items[next].id);refs.current[next]?.focus();
    }
    return <div role="radiogroup" aria-label={label} onKeyDown={move} style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(132px,1fr))',gap:10}}>
      {items.map((p,i)=>{
        const selected=p.id===value, name=L(p.labelCs,p.labelEn);
        return <button type="button" role="radio" aria-checked={selected} aria-label={`${name} · ${p.polarity==='dark'?L('noční','night'):L('denní','day')}`}
          key={p.id} tabIndex={i===current?0:-1} ref={el=>{refs.current[i]=el;}} onClick={()=>onPick(p.id)}
          style={{display:'flex',flexDirection:'column',gap:8,padding:8,minHeight:44,width:'100%',boxSizing:'border-box',cursor:'pointer',textAlign:'left',borderRadius:10,background:selected?t.activeNav:'transparent',border:`1px solid ${selected?t.interactiveAccent:t.borderSoft}`,color:t.text}}>
          <Snippet preset={p}/>
          <span style={{display:'flex',alignItems:'center',gap:5,minWidth:0,fontFamily:'var(--tm-font-body)',fontSize:13.5,lineHeight:1.3}}>
            <span aria-hidden="true" style={{width:14,flexShrink:0}}>{selected&&<FamilyIcon id="check" size={14}/>}</span>
            <TmIcon id={p.polarity==='dark'?'moon':'sun'} size={12}/><span>{name}</span>
          </span>
          {(p.id===DEFAULT_PRESET||selected)&&<span style={{display:'flex',gap:6,flexWrap:'wrap',fontFamily:'var(--tm-font-tag)',fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:t.textSec}}>
            {p.id===DEFAULT_PRESET&&<span>{L('Výchozí','Default')}</span>}{selected&&<span>{L('Zvoleno','Selected')}</span>}
          </span>}
        </button>;
      })}
    </div>;
  }

  function VzhledSekce({ preset, onPreset, open = false, onToggle }) {
    const { t } = useT();
    const [surface, setSurface] = useState(() => readSurfaceStyle());
    const surfaceRefs = useRef([]);
    useEffect(() => {
      const unwatch = watchSurfaceStyle(setSurface);
      setSurface(readSurfaceStyle());
      return unwatch;
    }, []);
    function pickSurface(value) { setSurface(writeSurfaceStyle(value)); }
    function moveSurface(event) {
      const current = Math.max(0, SURFACE_OPTIONS.findIndex(item => item.id === surface));
      let next;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (current + 1) % SURFACE_OPTIONS.length;
      else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (current + SURFACE_OPTIONS.length - 1) % SURFACE_OPTIONS.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = SURFACE_OPTIONS.length - 1;
      else return;
      event.preventDefault();
      pickSurface(SURFACE_OPTIONS[next].id);
      surfaceRefs.current[next]?.focus();
    }
    const isDefault = preset === DEFAULT_PRESET;
    const label = (extra) => ({
      fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.2em",
      fontSize: 10.5, color: t.sage, marginBottom: 8, marginTop: extra ? 18 : 0,
    });
    return (
      <div id="tm-vzhled" style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
        <button type="button" aria-expanded={open} aria-controls="tm-vzhled-content" onClick={onToggle}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 50, padding: "13px 8px", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", color: t.text }}>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}><path d="M4 2 8 6 4 10" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
          <span style={{ ...label(false), marginBottom: 0 }}>{L("Vzhled", "Appearance")}</span>
        </button>
        {open && <div id="tm-vzhled-content" style={{paddingBottom:24}}>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, lineHeight: 1.55, marginBottom: 12 }}>
          {L("Vzhled je jen to, jak tahle aplikace vypadá na tomhle zařízení. Nemění, co je vidět, co se sdílí ani co znamenají stavy.",
             "An appearance is only how this app looks on this device. It changes nothing about what is visible, what is shared, or what a status means.")}
        </div>

        <Radios label={L("Motiv aplikace", "App theme")} items={APPEARANCE_PRESETS}
          value={preset} onPick={onPreset} />

        <button type="button" onClick={() => onPreset(DEFAULT_PRESET)} disabled={isDefault}
          className="tm-cta"
          style={{
            marginTop: 14, minHeight: 44, padding: "8px 16px",
            background: "transparent", border: `1px solid ${t.border}`,
            color: isDefault ? t.textDisabled || t.textMuted : t.textSec,
            cursor: isDefault ? "default" : "pointer",
            fontFamily: "var(--tm-font-body)", fontSize: 13,
          }}>
          {L("Použít výchozí motiv", "Use default theme")}
        </button>

        <h3 id="tm-surface-label" style={{...label(true),marginBottom:10}}>{L("Podklady a hloubka", "Surfaces and depth")}</h3>
        <div role="radiogroup" aria-labelledby="tm-surface-label" onKeyDown={moveSurface}
          style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(132px,1fr))",gap:10}}>
          {SURFACE_OPTIONS.map((item, index) => {
            const selected = surface === item.id;
            return <button type="button" role="radio" key={item.id} aria-checked={selected}
              aria-labelledby={`tm-surface-${item.id}-name`} aria-describedby={`tm-surface-${item.id}-description`}
              tabIndex={selected ? 0 : -1} ref={el => { surfaceRefs.current[index] = el; }} onClick={() => pickSurface(item.id)}
              style={{display:"flex",flexDirection:"column",gap:6,minWidth:0,minHeight:44,padding:"12px 10px",boxSizing:"border-box",textAlign:"left",cursor:"pointer",borderRadius:10,border:`1px solid ${selected ? t.interactiveAccent : t.borderSoft}`,background:selected ? t.activeNav : "transparent",color:t.text,fontFamily:"var(--tm-font-body)"}}>
              <span style={{display:"flex",alignItems:"baseline",gap:6,fontSize:13.5,lineHeight:1.35}}>
                <span aria-hidden="true" style={{width:14,flexShrink:0}}>{selected && <FamilyIcon id="check" size={14}/>}</span>
                <span id={`tm-surface-${item.id}-name`}>{L(item.cs,item.en)}</span>
              </span>
              <span id={`tm-surface-${item.id}-description`} style={{fontSize:12,lineHeight:1.5,color:t.textSec}}>{L(item.descCs,item.descEn)}</span>
              {item.id === DEFAULT_SURFACE_STYLE && <span style={{fontFamily:"var(--tm-font-tag)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",color:t.textSec}}>{L("Výchozí", "Default")}</span>}
            </button>;
          })}
        </div>
        </div>}
      </div>
    );
  }

  return { VzhledSekce };
}
