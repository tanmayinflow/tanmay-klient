// ----------------------------------------------------------------------
// SEZNAMY MÍSTNOSTÍ · jedna generace pro oba domy
// ----------------------------------------------------------------------
// Přepínač zobrazení, hledání v hlavičce, filtrační pilulky, pruh „vrátit"
// a dlouhý stisk pro výběr a přeuspořádání. Osobní aplikace je měla, klientská
// ne — a bez nich vypadala její Praxe, Prameny i Zápisník o generaci starší.
//
// Nic z toho není role-specifické. Rozdíl role se řeší v místnosti, ne tady.
//
// Písmo se bere z CSS proměnných (--tm-font-*).
import React, { useState } from "react";

export function createListUI(deps) {
  const { useT, L, hexA, TmIcLupa } = deps;

  // ————————————————————————————————————————————————————————————
  // ZOBRAZENÍ MÍSTNOSTI · jedno tlačítko, čtyři hustoty
  // Od obsahu knihy (Seznam) po obrazy (Galerie). Přepíná se stejně jako
  // světlo a tma — jedním klepnutím; ikona se otočí a ukáže, kde jsi.
  // Volba se pamatuje zvlášť pro každou místnost: Zápisník má jiný rytmus
  // než Prameny a nutit je do jednoho by byla úspora na špatném místě.
  // ————————————————————————————————————————————————————————————
  const vwSvg = (kids) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{kids}</svg>;
  const TM_VW_IC = {
    seznam: vwSvg(<path d="M4 7h16M4 12h16M4 17h16" />),
    rows: vwSvg(<><rect x="3.5" y="5" width="4.5" height="4.5" rx="1.2" /><path d="M11 6h9.5M11 8.6h6" opacity=".9" /><rect x="3.5" y="14.5" width="4.5" height="4.5" rx="1.2" /><path d="M11 15.5h9.5M11 18.1h6" opacity=".9" /></>),
    cards: vwSvg(<><rect x="4" y="4.5" width="7" height="7" rx="1.4" /><rect x="13" y="4.5" width="7" height="7" rx="1.4" /><rect x="4" y="13" width="7" height="7" rx="1.4" /><rect x="13" y="13" width="7" height="7" rx="1.4" /></>),
    gal: vwSvg(<><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.4" /><path d="m5.5 16.5 4-4.2 3.2 3.2 2.4-2.2 3.4 3.7" opacity=".8" /></>),
  };
  const TmIcFiltr = ({ size = 17 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6.5h16M7 12h10M10 17.5h4" /></svg>;
  const TM_VIEWS = [{ k: "seznam", cz: "Seznam", en: "List" }, { k: "rows", cz: "Řádky", en: "Rows" }, { k: "cards", cz: "Karty", en: "Cards" }, { k: "gal", cz: "Galerie", en: "Gallery" }];
  const tmViewOk = (k) => TM_VIEWS.some((v) => v.k === k) ? k : "rows";
  const tmViewLabel = (k) => { const v = TM_VIEWS.find((x) => x.k === tmViewOk(k)); return L(v.cz, v.en); };
  const tmNextView = (k) => TM_VIEWS[(TM_VIEWS.findIndex((x) => x.k === tmViewOk(k)) + 1) % TM_VIEWS.length].k;

  function ViewCycle({ value, onChange }) {
    const { t } = useT();
    const cur = tmViewOk(value), nx = tmNextView(cur);
    return (
      <button type="button" onClick={() => onChange(nx)} aria-label={L("Zobrazení: ", "View: ") + tmViewLabel(cur)}
        title={L("Zobrazení · ", "View · ") + tmViewLabel(cur) + " → " + tmViewLabel(nx)}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, flexShrink: 0, background: "transparent", border: "none", borderRadius: 9, cursor: "pointer", color: t.textMuted }}>
        <span key={cur} className="tm-turn" style={{ display: "inline-flex" }}>{TM_VW_IC[cur]}</span>
      </button>
    );
  }


  // zaškrtnutí ve výběru · v každém zobrazení sedí jinde, proto vlastní kousek
  function VwMark({ on, corner }) {
    const { t } = useT();
    const base = { touchAction: "none", width: 18, height: 18, borderRadius: 6, flexShrink: 0, border: `1.5px solid ${on ? t.accent : t.border}`, background: on ? t.accent : hexA(t.bg, 0.7), color: t.bg, fontSize: 12, lineHeight: "16px", textAlign: "center" };
    if (corner) return <span className="tm-selmark" style={{ ...base, position: "absolute", top: 8, right: 8, zIndex: 2 }}>{on ? "✓" : ""}</span>;
    return <span className="tm-selmark" style={base}>{on ? "✓" : ""}</span>;
  }

  // Seznam / Karty / Galerie nad normalizovanou položkou. „Řádky" si obě
  // místnosti kreslí po svém — mají tam ruční pořadí a úpravy na místě.
  function RoomView({ view, items, selecting, selIds, onToggleSel, onOpen, current }) {
    const { t } = useT();
    const on = (id) => (selIds || []).includes(id);
    const cur = (id) => current && id === current;
    const hit = (id) => (ev) => { if (selecting) onToggleSel(id, ev && ev.shiftKey); else onOpen(id); };
    const cardBase = (id) => ({ position: "relative", background: on(id) ? hexA(t.accent, 0.07) : cur(id) ? hexA(t.sage, 0.09) : t.card, border: `1px solid ${on(id) ? t.accent : cur(id) ? t.sage : t.borderSoft}`, borderRadius: 12, cursor: "pointer", textAlign: "left", color: "inherit", fontFamily: "var(--tm-font-body)", padding: 0, overflow: "hidden" });

    if (view === "seznam") return (
      <div style={{ borderTop: `1px solid ${t.borderSoft}` }}>
        {items.map((it) => (
          <button key={it.id} data-pick={it.id} onClick={hit(it.id)}
            className="tm-nav-item tm-row" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", minHeight: 46, background: on(it.id) ? hexA(t.accent, 0.07) : cur(it.id) ? hexA(t.sage, 0.09) : "transparent", border: "none", borderRadius: 8, padding: "7px 8px", cursor: "pointer", textAlign: "left", color: "inherit", fontFamily: "var(--tm-font-body)" }}>
            {selecting && <VwMark on={on(it.id)} />}
            {it.star && <span style={{ color: t.accent, fontSize: 12, flexShrink: 0 }}>★</span>}
            <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--tm-font-display)", fontSize: 15, color: t.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.title}</span>
            {it.date && <span style={{ flexShrink: 0, fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>{it.date}</span>}
          </button>
        ))}
      </div>
    );

    if (view === "cards") return (
      <div className="tm-vgrid">
        {items.map((it) => (
          <button key={it.id} data-pick={it.id} onClick={hit(it.id)} className="tm-lift" style={{ ...cardBase(it.id), display: "flex", flexDirection: "column", minHeight: 130, padding: "13px 13px 11px" }}>
            {selecting && <VwMark on={on(it.id)} corner />}
            <span style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
              {it.star && <span style={{ color: t.accent, fontSize: 12, marginTop: 3 }}>★</span>}
              <span className="tm-clamp2" style={{ fontFamily: "var(--tm-font-display)", fontSize: 15, color: t.heading, lineHeight: 1.25, paddingRight: selecting ? 20 : 0 }}>{it.title}</span>
            </span>
            {it.preview && <span className="tm-clamp3" style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, lineHeight: 1.55, marginTop: 6, flex: 1 }}>{it.preview}</span>}
            {(it.meta || it.date) && <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{it.meta}{it.date && <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>{it.date}</span>}</span>}
          </button>
        ))}
      </div>
    );

    if (view === "gal") return (
      <div className="tm-vgrid">
        {items.map((it) => {
          const f = it.face || {};
          return (
            <button key={it.id} data-pick={it.id} onClick={hit(it.id)} className="tm-lift" style={cardBase(it.id)}>
              {selecting && <VwMark on={on(it.id)} corner />}
              {/* tvář · obrázek, jinak útržek stránky, jinak iniciála. Nikdy
                  dvakrát tentýž glyf — z toho se nedá nic vyčíst. */}
              <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 108, borderBottom: `1px solid ${t.borderSoft}`, background: t.callout, overflow: "hidden" }}>
                {f.img
                  ? <img src={f.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : f.text
                    ? <><span className="tm-clamp5" style={{ alignSelf: "stretch", width: "100%", padding: "10px 11px 0", fontFamily: "var(--tm-font-body)", fontSize: 12, lineHeight: 1.62, color: t.textMuted, textAlign: "left" }}>{f.text}</span>
                      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: `linear-gradient(${hexA(t.callout, 0)}, ${t.callout})` }} /></>
                    : <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 36, color: t.sand, opacity: 0.5, lineHeight: 1 }}>{f.ini || "·"}</span>}
                {f.glyph && <span style={{ position: "absolute", left: 8, bottom: 7, color: t.sand, opacity: 0.5, display: "inline-flex" }}>{React.createElement(f.glyph, { size: 15 })}</span>}
                {f.badge && <span style={{ position: "absolute", right: 9, bottom: 5, fontFamily: "var(--tm-font-display)", fontSize: 15, color: t.sand }}>{f.badge}</span>}
              </span>
              <span style={{ display: "block", padding: "9px 11px 11px" }}>
                <span style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                  {it.star && <span style={{ color: t.accent, fontSize: 12, marginTop: 2 }}>★</span>}
                  <span className="tm-clamp2" style={{ fontFamily: "var(--tm-font-display)", fontSize: 15, color: t.heading, lineHeight: 1.25 }}>{it.title}</span>
                </span>
                {(it.metaGal || it.meta) && <span style={{ display: "flex", alignItems: "center", gap: 5, overflow: "hidden", marginTop: 5, height: 20 }}>{it.metaGal || it.meta}</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
    return null;
  }

  function HdrIcon({ on, title, onClick, children }) {
    const { t } = useT();
    return (
      <button type="button" title={title} aria-label={title} onClick={onClick}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 36, height: 38, flexShrink: 0, background: on ? hexA(t.accent, 0.12) : "transparent", border: "none", borderRadius: 9, cursor: "pointer", color: on ? t.accent : t.textMuted }}>{children}</button>
    );
  }
  // řádek hledání pod nadpisem · v prototypu je to karta na celou šířku
  function HdrSearch({ value, onChange, onClose, placeholder }) {
    const { t } = useT();
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.card, border: `1px solid ${value ? t.accent : t.border}`, borderRadius: 12, padding: "10px 14px", margin: "0 0 12px" }}>
        <span style={{ color: t.sand, display: "inline-flex", flexShrink: 0 }}><TmIcLupa size={15} /></span>
        <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") { if (value) onChange(""); else onClose(); } }} placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 15, outline: "none" }} />
        <button onClick={() => { onChange(""); onClose(); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, flexShrink: 0, minHeight: 30 }}>{L("Zavřít", "Close")}</button>
      </div>
    );
  }
  function HdrLbl({ children }) {
    const { t } = useT();
    return <span style={{ width: "100%", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12, lineHeight: 1.5, color: t.sage, margin: "2px 0 -2px" }}>{children}</span>;
  }

  function FiltrPill({ on, onClick, children }) {
    const { t } = useT();
    return (
      <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", minHeight: 34, background: on ? hexA(t.accent, 0.12) : "transparent", border: `1px solid ${on ? t.accent : t.borderSoft}`, borderRadius: 999, padding: "5px 13px", cursor: "pointer", color: on ? t.accent : t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{children}</button>
    );
  }

  function UndoBar({ bar, onClose }) {
    const { t } = useT();
    React.useEffect(() => {
      if (!bar) return;
      const id = setTimeout(onClose, 8000);
      return () => clearTimeout(id);
    }, [bar]);
    if (!bar) return null;
    return (
      <div className="tm-selbar" style={{ position: "sticky", bottom: 16, display: "flex", alignItems: "center", gap: 10, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", zIndex: 50, marginTop: 10, animation: "tmsettle .3s ease-out" }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bar.text}</span>
        <button onClick={() => { bar.fn(); onClose(); }} style={{ background: "transparent", border: `1px solid ${t.accent}`, borderRadius: 999, minHeight: 32, padding: "5px 15px", cursor: "pointer", color: t.accent, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, flexShrink: 0 }}>{L("Vrátit", "Undo")}</button>
        <button onClick={onClose} title={L("Zavřít", "Close")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 15, width: 28, height: 32, flexShrink: 0 }}>×</button>
      </div>
    );
  }

  function useHoldSelect({ rootRef, attr, tabAttr, stateRef, actionsRef, mouseAny }) {
    const [dragging, setDragging] = useState(null);
    React.useEffect(() => {
      const root = rootRef.current; if (!root) return;
      let s = null, ghost = null, paint = null, eat = 0, eatKlik = 0;
      const at = (x, y, sel) => { const h = document.elementFromPoint(x, y); return (h && h.closest) ? h.closest(sel) : null; };
      const clearTabs = () => { Array.prototype.forEach.call(document.querySelectorAll(".tm-drop"), (e) => e.classList.remove("tm-drop")); };
      let edgeT = null, edgeDir = 0, winBound = 0;
      // myš opouští seznam · pohyb i puštění musí slyšet celé okno
      const winOn = () => { if (winBound) return; winBound = 1; window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onEnd); };
      const winOff = () => { if (!winBound) return; winBound = 0; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onEnd); };
      const stopEdge = () => { if (edgeT) { clearInterval(edgeT); edgeT = null; } edgeDir = 0; };
      const edgeScroll = (x, y) => {
        const strip = root.ownerDocument.querySelector(".tm-typerow");
        if (!strip) return stopEdge();
        const r = strip.getBoundingClientRect();
        let dir = 0;
        if (y >= r.top - 30 && y <= r.bottom + 30) {
          if (x > r.right - 52) dir = 1;
          else if (x < r.left + 52) dir = -1;
        }
        if (dir === edgeDir) return;
        stopEdge();
        edgeDir = dir;
        if (dir) edgeT = setInterval(() => { strip.scrollLeft += dir * 9; }, 16);
      };
      const stop = () => { if (ghost) { ghost.remove(); ghost = null; } clearTabs(); stopEdge(); setDragging(null); };

      const onStart = (e) => {
        const mouse = !e.touches;
        if (mouse && (e.button !== 0 || e.ctrlKey || e.metaKey)) return;
        const p = e.touches ? e.touches[0] : e; if (!p) return;
        const row = e.target && e.target.closest && e.target.closest("[" + attr + "]");
        if (!row) return;
        // hvězdička, sponka a spol. si drží svůj stisk · gesto patří jen položce.
        // (V Kartách a Galerii je položka sama tlačítkem — tam se to netýká.)
        const ctl = e.target.closest("button, a, input, textarea, select");
        if (ctl && ctl !== row && ctl.getAttribute("data-pickmain") == null && row.contains(ctl)) return;
        const id = row.getAttribute(attr);
        const cur = stateRef.current || {};
        const selNow = cur.sel || [];
        if (cur.selecting) {
          // od kolečka se maluje úsek · tah po nevybrané kartě roluje
          if (e.target.closest && e.target.closest(".tm-selmark")) {
            paint = { add: !selNow.includes(id), last: id };
            actionsRef.current.paint(id, paint.add);
            if (mouse) { winOn(); document.body.classList.add("tm-nosel"); }
            return;
          }
          // dlouhý stisk na VYBRANÉ kartě vezme celou hromadu · to je jediný
          // způsob, jak přesunout víc poznámek najednou tažením
          if (!selNow.includes(id)) return;
        }
        s = { id, x: p.clientX, y: p.clientY, armed: false, moving: false, timer: null, overTab: null, mouse };
        if (mouse) { winOn(); }
        s.timer = setTimeout(() => arm(), 400);
      };
      // Zvednutí hromady · dotyk k němu dozraje stiskem, myš pohybem.
      const arm = () => {
        if (!s || s.armed) return;
        s.armed = true;
        TM_GESTURE = 1;
        const st0 = stateRef.current || {};
        s.ids = (st0.selecting && (st0.sel || []).includes(s.id)) ? [...(st0.sel || [])] : [s.id];
        try { if (!s.mouse && TM_HAPTICS) navigator.vibrate && navigator.vibrate(14); } catch (err) {}
        ghost = tmMkGhost(actionsRef.current.label(s.id), s.ids.length, s.x, s.y);
        if (s.mouse) document.body.classList.add("tm-nosel");
        setDragging(s.id);
      };
      // myš smí zvednout položku hned · vybranou hromadu, ruční pořadí, správce složek
      const mouseMayDrag = (id) => {
        const c = stateRef.current || {};
        if (mouseAny) return true;
        if (c.selecting) return (c.sel || []).includes(id);
        return !!c.sortManual;
      };
      const onMove = (e) => {
        const p = e.touches ? e.touches[0] : e; if (!p) return;
        if (paint) {
          e.preventDefault();
          const row = at(p.clientX, p.clientY, "[" + attr + "]");
          const id = row && row.getAttribute(attr);
          if (id && id !== paint.last) { paint.last = id; actionsRef.current.paint(id, paint.add); }
          return;
        }
        if (!s) return;
        const dx = Math.abs(p.clientX - s.x), dy = Math.abs(p.clientY - s.y);
        // vodorovný pohyb dřív, než stisk dozraje → švih, ne tažení
        if (!s.armed) {
          if (dx > 12 || dy > 12) {
            clearTimeout(s.timer);
            // myš nečeká na dlouhý stisk · tažení pozná z pohybu samotného
            if (s.mouse && mouseMayDrag(s.id)) { arm(); s.moving = true; }
            else { if (s.mouse) winOff(); s = null; return; }
          } else return;
        }
        if (e.cancelable) e.preventDefault();
        if (!s.moving && (dx > 8 || dy > 8)) s.moving = true;
        if (!s.moving) return;
        if (ghost) { ghost.style.left = p.clientX + "px"; ghost.style.top = p.clientY + "px"; }
        clearTabs();
        // Pás dlaždic se sám odroluje, když s prstem dojedeš k jeho okraji.
        // Musí to jet plynule, ne po krocích na každý pohyb — prst u kraje se
        // často nehýbe a čeká, až mu pod něj přijede ta správná dlaždice.
        if (tabAttr) edgeScroll(p.clientX, p.clientY);
        const tb = tabAttr ? at(p.clientX, p.clientY, "[" + tabAttr + "]") : null;
        if (tb && tb.getAttribute(tabAttr) !== "Vše") { tb.classList.add("tm-drop"); s.overTab = tb.getAttribute(tabAttr); return; }
        s.overTab = null;
        // pořadí jde měnit jen ve vlastním pořadí · jinak by ho řazení hned přepsalo
        if (!(stateRef.current || {}).sortManual) return;
        const row = at(p.clientX, p.clientY, "[" + attr + "]");
        const over = row && row.getAttribute(attr);
        if (over && over !== s.id && (s.ids || []).length < 2) actionsRef.current.reorder(s.id, over);
      };
      const onEnd = () => {
        // Malování zaškrtávátek si výběr vyřídilo samo. Klepnutí, které po
        // stisku ještě dorazí, by ho odškrtlo zpátky — přesně tohle byla ta
        // chyba, kvůli které výběr „reagoval, ale nedržel".
        if (paint) { paint = null; eatKlik = Date.now() + 900; }
        winOff();
        document.body.classList.remove("tm-nosel");
        if (TM_GESTURE) setTimeout(() => { TM_GESTURE = 0; }, 0);
        if (!s) { stop(); return; }
        clearTimeout(s.timer);
        const done = s; s = null;
        stop();
        if (!done.armed) return;
        eat = Date.now() + 500;   // po gestu nesmí projít klepnutí, které by otevřelo poznámku
        if (done.moving) { if (done.overTab) actionsRef.current.dropTab(done.ids || [done.id], done.overTab); }
        else actionsRef.current.enter(done.id);
      };
      const onClick = (e) => {
        // právě jedno · jinak by po zaškrtnutí půl vteřiny nešlo klepnout jinam
        if (eatKlik) { const zive = Date.now() < eatKlik; eatKlik = 0; if (zive) { e.preventDefault(); e.stopPropagation(); return; } }
        if (Date.now() < eat) { e.preventDefault(); e.stopPropagation(); }
      };
      const onDragStart = (e) => { if (s || dragging) e.preventDefault(); };  // nativní tažení textu do toho nemá co mluvit
      root.addEventListener("touchstart", onStart, { passive: true });
      root.addEventListener("touchmove", onMove, { passive: false });
      root.addEventListener("touchend", onEnd);
      root.addEventListener("touchcancel", onEnd);
      root.addEventListener("mousedown", onStart);
      root.addEventListener("dragstart", onDragStart);
      root.addEventListener("click", onClick, true);
      return () => {
        root.removeEventListener("touchstart", onStart);
        root.removeEventListener("touchmove", onMove);
        root.removeEventListener("touchend", onEnd);
        root.removeEventListener("touchcancel", onEnd);
        root.removeEventListener("mousedown", onStart);
        root.removeEventListener("dragstart", onDragStart);
        root.removeEventListener("click", onClick, true);
        winOff();
        document.body.classList.remove("tm-nosel");
        stopEdge();
        if (ghost) ghost.remove();
      };
    }, []);
    return dragging;
  }

  return {
    TM_VIEWS, tmViewOk, tmViewLabel, tmNextView, TM_VW_IC, TmIcFiltr,
    ViewCycle, VwMark, RoomView, HdrIcon, HdrSearch, HdrLbl, FiltrPill, UndoBar, useHoldSelect,
  };
}
