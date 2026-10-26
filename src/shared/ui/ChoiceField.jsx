import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TmIcon } from "./icons.jsx";

const fold = text => String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();

// One themed picker for short choices, searchable client lists and editable times.
// The portal avoids clipping by sheets and scrolling form sections.
export function ChoiceField({ theme: t, L, value, onChange, options, placeholder, style,
  small, ghost, searchable = false, editable = false, label, inputMode }) {
  const id = useId(), trigger = useRef(null), panel = useRef(null), search = useRef(null);
  const [open, setOpen] = useState(false), [query, setQuery] = useState("");
  const [active, setActive] = useState(0), [position, setPosition] = useState(null);
  const opts = options.map(o => typeof o === "string" ? { v: o, label: o } : o);
  const current = opts.find(o => o.v === value);
  const shown = searchable ? opts.filter(o => fold(`${o.label} ${o.search || ""}`).includes(fold(query))) : opts;
  const close = (restore = false) => { setOpen(false); setQuery(""); if (restore) trigger.current?.focus(); };
  const choose = o => { onChange(o.v); close(true); };
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = trigger.current.getBoundingClientRect();
      const vv = window.visualViewport, top = vv?.offsetTop || 0, left = vv?.offsetLeft || 0;
      const width = vv?.width || window.innerWidth, height = vv?.height || window.innerHeight;
      const below = top + height - r.bottom - 12, above = r.top - top - 12;
      const up = below < 180 && above > below;
      const maxHeight = Math.max(80, Math.min(320, up ? above : below));
      const w = Math.min(Math.max(r.width, 220), width - 24);
      setPosition({ position: "fixed", left: Math.max(left + 12, Math.min(r.left, left + width - w - 12)), width: w,
        maxHeight, ...(up ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }) });
    };
    place();
    window.addEventListener("resize", place);
    window.visualViewport?.addEventListener("resize", place);
    window.visualViewport?.addEventListener("scroll", place);
    const scroll = e => { if (!panel.current?.contains(e.target)) place(); };
    window.addEventListener("scroll", scroll, true);
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", scroll, true);
      window.visualViewport?.removeEventListener("resize", place); window.visualViewport?.removeEventListener("scroll", place); };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, opts.findIndex(o => o.v === value)));
    const outside = e => { if (!trigger.current?.contains(e.target) && !panel.current?.contains(e.target)) close(); };
    // Capture Escape before the parent sheet, but stop only while this picker is open.
    const escape = e => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(true); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape, true);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape, true); };
  }, [open]);
  useEffect(() => { if (open && searchable && position) search.current?.focus(); }, [open, searchable, !!position]);
  useEffect(() => { panel.current?.querySelector('[data-highlighted="true"]')?.scrollIntoView({ block: "nearest" }); }, [active]);
  function keys(e) {
    if (e.key === "Tab") { close(true); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key) && (!editable || open)) {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setActive(i => e.key === "Home" ? 0 : e.key === "End" ? shown.length - 1 : Math.max(0, Math.min(shown.length - 1, i + (e.key === "ArrowDown" ? 1 : -1))));
    } else if (e.key === "Enter" && open && shown[active]) { e.preventDefault(); choose(shown[active]); }
  }
  const fieldStyle = { display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    background: ghost ? "transparent" : t.card, border: ghost ? "none" : `1px solid ${t.border}`,
    borderRadius: "var(--tm-r-sm)", color: t.text, fontFamily: "var(--tm-font-body)", width: "100%", boxSizing: "border-box",
    cursor: editable ? "text" : "pointer", minHeight: 44, padding: ghost ? "6px" : small ? "6px 9px" : "9px 11px",
    fontSize: editable ? 16 : small ? 12.5 : 14, ...style };
  const aria = { role: "combobox", "aria-expanded": open, "aria-controls": open ? id : undefined,
    "aria-haspopup": "listbox", "aria-label": label, "aria-activedescendant": open && shown[active] ? `${id}-${active}` : undefined };
  return <div style={{ display: "inline-block", minWidth: 0, maxWidth: "100%", width: style?.width || "auto" }}>
    {editable ? <input {...aria} ref={trigger} type="text" inputMode={inputMode} autoComplete="off" value={value}
      placeholder={placeholder} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onKeyDown={keys}
      onChange={e => onChange(e.target.value)} data-tm-surface="control" style={fieldStyle}/>
      : <button {...aria} ref={trigger} type="button" className="tm-select-trigger" data-tm-surface={ghost ? undefined : "control"}
        onClick={() => setOpen(x => !x)} onKeyDown={keys} style={fieldStyle}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.label || value || placeholder || "—"}</span>
        <TmIcon id="expand" size={12} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none" }}/>
      </button>}
    {open && position && createPortal(<div ref={panel} className="tm-choice-panel" onKeyDown={keys}
      style={{ ...position, zIndex: 10000, display: "flex", flexDirection: "column", boxSizing: "border-box", padding: 6,
        background: t.bg, color: t.text, border: `1px solid ${t.borderSoft}`, borderRadius: 12,
        boxShadow: `0 6px 24px color-mix(in srgb, ${t.text} 15%, transparent)`, fontFamily: "var(--tm-font-body)" }}>
      {searchable && <input ref={search} type="search" value={query} aria-label={L("Hledat v možnostech", "Search choices")}
        placeholder={L("Hledat…", "Search…")} onChange={e => { setQuery(e.target.value); setActive(0); }}
        style={{ ...fieldStyle, flexShrink: 0, fontSize: 16, marginBottom: 5 }} data-tm-surface="control"/>}
      <div id={id} role="listbox" aria-label={label || placeholder || L("Možnosti", "Choices")}
        style={{ overflowY: "auto", overscrollBehavior: "contain", minHeight: 0 }}>
        {shown.map((o, i) => <div key={o.v} id={`${id}-${i}`} role="option" aria-selected={o.v === value}
          data-highlighted={i === active} onPointerDown={e => e.preventDefault()} onClick={() => choose(o)}
          style={{ cursor: "pointer", padding: "11px 10px", minHeight: 44, boxSizing: "border-box", fontSize: small ? 13 : 14,
            lineHeight: 1.45, borderRadius: 7, overflowWrap: "anywhere", borderBottom: `1px solid ${t.borderSoft}`,
            background: i === active || o.v === value ? t.card : "transparent", color: t.text }}>
          {o.label}{o.v === value && <span aria-hidden="true" style={{ float: "right", marginLeft: 8 }}>✓</span>}
        </div>)}
        {!shown.length && <p role="status" style={{ padding: 10, fontSize: 14 }}>{L("Nic nenalezeno.", "No matches.")}</p>}
      </div>
    </div>, document.body)}
  </div>;
}
