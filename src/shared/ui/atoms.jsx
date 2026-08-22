// ----------------------------------------------------------------------
// ATOMY · značka, výběr, pruh, zápisky, řádek vlastnosti, chrom stránky
// ----------------------------------------------------------------------
// Drobnosti, které se v obou domech kreslily zvlášť a pomalu se
// rozcházely: 12 proti 12.5 px, `t.inkSand` proti `t.sand`, `86vw` proti
// `calc(86 * var(--tm-vw))`. Nic z toho nebylo rozhodnutí — byl to jen
// dvojí život téhož kódu. Tady žijí jednou.
//
// Písmo se bere z CSS proměnných (--tm-font-*), takže přepnutí jazyka
// nemusí projít přes proměnnou zamrzlou v továrně.
import React, { useState } from "react";

export function createAtoms(deps) {
  const {
    useT, useStore, L,
    RichArea, AttachmentStrip, filesToAtts,
  } = deps;

  function Eyebrow({ children }) {
    const { t } = useT();
    return (
      <div style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 12, lineHeight: 1.5, color: t.accentInk || t.accent, marginBottom: 14 }}>
        {children}
      </div>
    );
  }

  function Divider() {
    const { t } = useT();
    // vlásečnice, ne plot · nižší krytí a víc vzduchu z obou stran
    // vlas, ne přechod · Brand V2 nepoužívá gradient ani na oddělovníku
    return <div style={{ height: 1, background: t.borderSoft, margin: "32px 0" }} />;
  }

  function LinkPill({ icon, label, onClick }) {
    const { t } = useT();
    const [h, setH] = useState(false);
    return (
      <button className="tm-pill" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", background: h ? t.cardHover : "transparent", border: `1px solid ${t.border}`, borderRadius: 20, padding: "6px 14px", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, transition: "background .15s ease" }}>
        <span>{icon}</span>{label}<span className="tm-arrow" style={{ color: t.accent }}>→</span>
      </button>
    );
  }

  function Callout({ icon, title, children }) {
    const { t } = useT();
    return (
      <div style={{ display: "flex", gap: 14, background: t.callout, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${t.accent}`, borderRadius: 8, padding: "16px 18px", margin: "14px 0" , boxShadow: t.shadow }}>
        {icon && <div style={{ fontSize: 22, lineHeight: "26px" }}>{icon}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={{ fontFamily: "var(--tm-font-display)", fontSize: 22, color: t.heading, marginBottom: children ? 8 : 0 }}>{title}</div>}
          {children}
        </div>
      </div>
    );
  }

  function Bindu({ size = 6, style = {} }) {
    const { t } = useT();
    return (
      <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: t.accent, ...style }} />
    );
  }

  function PageTitle({ icon, children, kicker, pageKey, right, onKicker }) {
    const { t } = useT();
    const st = useStore();
    const meta = pageKey ? st.pageMetaOf(pageKey) : {};
    const title = meta.title || children;
    const kick = meta.kicker || kicker;
    const editable = pageKey && st.editMode;
    const h1Style = { fontFamily: "var(--tm-font-display)", fontWeight: 300, fontSize: 46, lineHeight: 1.1, color: t.heading, margin: 0, display: "flex", alignItems: "center", gap: 14 };
    const titleStyle = right ? { ...h1Style, minWidth: 0 } : h1Style;
    const iconNode = icon && (typeof icon === "string" ? <span style={{ fontSize: 36 }}>{icon}</span> : icon);
    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          {editable
            ? <div style={{ marginBottom: 14 }}><BufferedInput value={kick || ""} onCommit={(v) => st.setPageMeta(pageKey, { kicker: v })} placeholder="kicker…" style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 12, lineHeight: 1.5, color: t.accentInk || t.accent, borderBottom: `1px dashed ${t.borderSoft}` }} /></div>
            : (kick && (onKicker
                ? <button onClick={onKicker} style={{ display: "block", background: "transparent", border: "none", padding: 0, margin: 0, cursor: "pointer", textAlign: "left" }}><Eyebrow>{kick}</Eyebrow></button>
                : <Eyebrow>{kick}</Eyebrow>))}
          <h1 style={titleStyle}>
            {iconNode}
            {editable
              ? <BufferedInput value={typeof title === "string" ? title : ""} onCommit={(v) => st.setPageMeta(pageKey, { title: v })} placeholder={L("Název stránky…", "Page title…")} style={{ ...h1Style, display: "block", borderBottom: `1px dashed ${t.borderSoft}` }} />
              : title}
            {right && <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 2, flexShrink: 0 }}>{right}</span>}
          </h1>
        </div>
      </div>
    );
  }

  function BufferedInput({ value, onCommit, style, placeholder }) {
    const [v, setV] = useState(value);
    React.useEffect(() => setV(value), [value]);
    const commit = () => { const nv = v.trim(); if (nv && nv !== value) onCommit(nv); else setV(value); };
    return <input value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { setV(value); e.currentTarget.blur(); } }} placeholder={placeholder} style={{ background: "transparent", border: "none", outline: "none", padding: 0, width: "100%", ...style }} />;
  }


  function Tag({ label, color = "default" }) {
    const { tags } = useT();
    const c = tags[color] || tags.default;
    return (
      <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: "var(--tm-r-tag)", background: c.bg, color: c.fg, marginRight: 6, whiteSpace: "nowrap" }}>
        {label}
      </span>
    );
  }

  function Select({ value, onChange, options, placeholder, style, small, ghost }) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    const wrapRef = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
      const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
      return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
    }, [open]);
    const opts = options.map((o) => typeof o === "string" ? { v: o, label: o } : o);
    const cur = opts.find((o) => o.v === value);
    const trigStyle = {
      display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 8,
      background: ghost ? "transparent" : t.card, border: ghost ? "none" : `1px solid ${t.border}`, borderRadius: "var(--tm-r-sm)", color: t.text,
      fontFamily: "var(--tm-font-body)", cursor: "pointer", outline: "none", width: "100%",
      padding: ghost ? "4px 6px" : small ? "5px 9px" : "9px 11px", fontSize: ghost ? 12 : small ? 12.5 : 14,
      ...(style || {}),
    };
    return (
      <div ref={wrapRef} style={{ position: "relative", display: "inline-block", ...(style && style.maxWidth ? { maxWidth: style.maxWidth } : {}), width: (style && style.width) || "auto" }}>
        <button type="button" onClick={() => setOpen((x) => !x)} style={trigStyle}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: ghost ? t.textMuted : (cur || value) ? t.text : t.textMuted }}>{cur ? cur.label : (value || placeholder || "—")}</span>
          <span style={{ color: t.textMuted, fontSize: 12, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▾</span>
        </button>
        {open && (
          <div style={{ animation: "tmsettle .18s ease both", position: "absolute", top: "calc(100% + 4px)", left: 0, minWidth: "100%", maxWidth: "min(320px, calc(86 * var(--tm-vw)))", maxHeight: 280, overflowY: "auto", background: t.bg, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-sm)", boxShadow: "0 10px 24px rgba(0,0,0,0.18)", zIndex: 60, padding: 4 }}>
            {opts.map((o) => (
              <button key={o.v} type="button" onClick={() => { onChange(o.v); setOpen(false); }} className="tm-nav-item" style={{ display: "block", width: "100%", textAlign: "left", background: o.v === value ? t.card : "transparent", border: "none", cursor: "pointer", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: small ? 12.5 : 14, padding: "7px 10px", borderRadius: 6, whiteSpace: "nowrap" }}>{o.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function ProgressBar({ value }) {
    const { t } = useT();
    return (
      <div style={{ height: 7, borderRadius: 4, background: t.border, overflow: "hidden", margin: "4px 0" }}>
        <div style={{ width: `${Math.round(value * 100)}%`, height: "100%", background: t.accent, transition: "width .55s cubic-bezier(.25,.8,.3,1)" }} />
      </div>
    );
  }

  function MetaSection({ meta, onPatch, placeholder }) {
    const { t } = useT();
    const st = useStore();
    const fileRef = React.useRef(null);
    const attach = async (fl) => {
      const added = await filesToAtts(fl, st.ask);
      if (added.length) onPatch({ att: [...(meta.att || []), ...added] });
      if (fileRef.current) fileRef.current.value = "";
    };
    return (
      <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: 16, paddingTop: 12 }}>
        <div style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, marginBottom: 6 }}>{L("Zápisky", "Notes")}</div>
        <RichArea value={meta.text || ""} onChange={(v) => onPatch({ text: v })} placeholder={placeholder || L("Piš…", "Write…")} />
        <div style={{ marginTop: 10 }}>
          <input ref={fileRef} type="file" multiple onChange={(e) => attach(e.target.files)} style={{ display: "none" }} />
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-sm)", padding: "6px 12px", cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>＋ {L("Přiložit soubor", "Attach file")}</button>
          <AttachmentStrip att={meta.att} onRemove={st.editMode ? ((id) => onPatch({ att: (meta.att || []).filter((x) => x.id !== id) })) : undefined} />
        </div>
      </div>
    );
  }

  function PropRow({ icon, label, children }) {
    const { t } = useT();
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", minHeight: 34 }}>
        <span style={{ width: 150, display: "flex", alignItems: "center", gap: 9, color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, flexShrink: 0 }}>
          <span style={{ fontSize: 13, width: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: t.sand }}>{icon}</span>{label}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      </div>
    );
  }

  function TChip({ label, active, onClick, onInfo }) {
    const { t } = useT();
    // Press and hold (~450 ms) opens the info — the one gesture, phone and desktop
    // alike, via pointer events. Two things kill a hold in the wild and both are
    // handled: a finger on glass always trembles (so movement under 9 px is not a
    // move), and the browser's own long-press menu (so it is suppressed here).
    const holdRef = React.useRef(null);
    const firedRef = React.useRef(false);
    const posRef = React.useRef(null);
    const clear = () => { if (holdRef.current) { clearTimeout(holdRef.current); holdRef.current = null; } };
    const down = onInfo ? (e) => {
      firedRef.current = false;
      posRef.current = { x: e.clientX, y: e.clientY };
      clear();
      holdRef.current = setTimeout(() => { holdRef.current = null; firedRef.current = true; onInfo(); }, 450);
    } : undefined;
    const move = onInfo ? (e) => {
      if (!holdRef.current || !posRef.current) return;
      if (Math.hypot(e.clientX - posRef.current.x, e.clientY - posRef.current.y) > 9) clear();
    } : undefined;
    return (
      <button
        onClick={onInfo ? (e) => { if (firedRef.current) { firedRef.current = false; e.preventDefault(); return; } onClick && onClick(e); } : onClick}
        onPointerDown={down} onPointerMove={move} onPointerUp={onInfo ? clear : undefined}
        onPointerLeave={onInfo ? clear : undefined} onPointerCancel={onInfo ? clear : undefined}
        onContextMenu={onInfo ? (e) => e.preventDefault() : undefined}
        className="tm-chip"
        style={{ background: active ? t.card : "transparent", border: `1px solid ${active ? t.border : "transparent"}`, borderRadius: "var(--tm-r-pill)", padding: "8px 14px", minHeight: "var(--tm-tap-compact)", display: "inline-flex", alignItems: "center", cursor: "pointer", color: active ? t.heading : t.textMuted, boxShadow: active ? t.shadow : "none", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, whiteSpace: "nowrap", WebkitTouchCallout: "none", WebkitUserSelect: "none", userSelect: "none", touchAction: "manipulation" }}>
        {label}
      </button>
    );
  }

  return {
    Tag, Select, ProgressBar, MetaSection, PropRow, TChip,
    Eyebrow, Divider, LinkPill, Callout, Bindu, PageTitle, BufferedInput,
  };
}
