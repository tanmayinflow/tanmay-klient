// ----------------------------------------------------------------------
// KOMPAS · jedna orientace pro oba domy
// ----------------------------------------------------------------------
// Krajina, cíle, dílna, detail cíle i detail krajiny. Dosud to byly dvě
// implementace a klientská byla o generaci pozadu: emoji místo rytin,
// natvrdo anglické popisky („Achievability", „Target Date", „Comments"),
// žádní čekající, žádný spouštěč, žádný výběr krajiny v detailu.
//
// Rozdíl role se řeší tím, co se do továrny předá:
//   · `sideSlot`    druhý sloupec dnešního kroku · Pomodoro má jen osobní dům
//   · `AreaVlqSlot` dvě otázky ke krajině · komponenta, ne kopie
//   · `hasCoachGoals` má tenhle dům cíle od trenéra? · rozhoduje o štítku
//
// Dvě třídy cíle se v rozhraní jmenují Moje a Od Tanmaye. Nikde „locked",
// nikde „admin goal", nikde „system-owned". Co smí kdo měnit, neříká
// tahle vrstva — ptá se `mayEditGoalField` v product/compass.js.
//
// Písmo se bere z CSS proměnných (--tm-font-*).
import React, { useState } from "react";
import { GOAL_OWNER, TM_UTEK, tmOtocFor, mayEditGoalField, goalOwnerLabel, G_VIEWS } from "../product/compass.js";

export function createCompassUI(deps) {
  const {
    useT, useStore, L, LV, GS, PL, hexA, uid, getLang,
    // atomy
    Tag, Select, ProgressBar, MetaSection, PropRow,
    // stavební prvky domu
    PageTitle, Divider, Eyebrow, Prazdno, LinkPill, Drawer, CenterSheet, DayTasks, DotTap,
    // ikony
    TmIcKompas, TmIcOblasti, TmIcCile, TmIcPraxe, TmRyt,
    // styly
    iconBtn, fieldStyle, metaLabel, pProse, twoCol,
    // konstanty domu
    PRIO_ORDER, PRIOS, PRIO_COLOR, GSTATUS_COLOR, GOAL_STATUSES,
    AREA_COLOR, AREA_ICON, AREAS, ACHIEVES, ACH_SHORT, ROM,
    areaClean, areaLabel,
    // čas
    todayISO, fmtCZ, tmToTop,
    // role
    sideSlot = null,
    role = "owner",
  } = deps;

  const lang = () => (getLang ? getLang() : "cs");

  // ---- rytiny krajin ------------------------------------------------------
  // Rytina má přednost před emoji vždycky, když pro krajinu existuje. Dřív se
  // brala jen při přesné shodě uložené ikony se zárodečnou — a u Business se
  // pak ukázala dračí hlava, která do tohohle domu nepatří.
  const AREA_RYT = {
    "Body": (s) => <TmRyt size={s}><path d="M12 3.5v17" /><path d="M9.2 6.3v11.4" opacity=".55" /><path d="M14.8 6.3v11.4" opacity=".55" /></TmRyt>,
    "General health": (s) => <TmRyt size={s}><path d="M5 19C5 10.2 11 4.5 19.5 4.5c0 8.5-6 14.5-14.5 14.5Z" /><path d="M5 19C8.5 15.5 12.5 11.5 16.2 8.2" opacity=".55" /></TmRyt>,
    "Mental Health": (s) => <TmRyt size={s}><path d="M12 19.5c-4.6-3.2-7.5-6-7.5-9.2 0-2.3 1.8-4 4-4 1.4 0 2.7.7 3.5 1.9.8-1.2 2.1-1.9 3.5-1.9 2.2 0 4 1.7 4 4 0 3.2-2.9 6-7.5 9.2Z" /><circle cx="12" cy="11.2" r="1.05" fill="currentColor" stroke="none" /></TmRyt>,
    "Partnership": (s) => <TmRyt size={s}><circle cx="9.4" cy="12" r="5.2" /><circle cx="14.6" cy="12" r="5.2" opacity=".65" /></TmRyt>,
    "Blood Family wellfear": (s) => <TmRyt size={s}><path d="M4.5 19c0-6.6 3.3-11.4 7.5-11.4s7.5 4.8 7.5 11.4" /><path d="M3.5 19h17" opacity=".4" /><circle cx="8.6" cy="16.9" r="1.15" fill="currentColor" stroke="none" opacity=".9" /><circle cx="15.4" cy="16.9" r="1.15" fill="currentColor" stroke="none" opacity=".9" /><circle cx="12" cy="15.1" r=".8" fill="currentColor" stroke="none" opacity=".9" /></TmRyt>,
    "Friendship": (s) => <TmRyt size={s}><path d="m5.5 20.5 13-4M5.5 16.5l13 4" opacity=".6" /><path d="M12 5.5c.4 1.9 2.3 2.9 3 4.7.6 1.7.2 3.6-1.2 4.8-1.8 1.6-4.7 1.5-6.2-.4-1.2-1.5-1.2-3.6-.2-5.1.4.7.9 1.2 1.7 1.4-.6-1.8.3-4 2.9-5.4Z" /></TmRyt>,
    "Finances": (s) => <TmRyt size={s}><circle cx="12" cy="12" r="7.6" /><rect x="9.7" y="9.7" width="4.6" height="4.6" rx=".9" opacity=".7" /></TmRyt>,
    "Business": (s) => <TmRyt size={s}><path d="M4 20c2.6-.3 3.9-1.7 4.2-3.5.3-1.8 1.5-3.1 3.2-3.4 1.7-.3 3-1.6 3.3-3.3.3-1.7 1.5-3 3.2-3.4 1-.2 1.8-.7 2.4-1.4" /></TmRyt>,
    "Adventure": (s) => <TmRyt size={s}><path d="M4.2 16.3v-4.9c0-.9.7-1.6 1.6-1.6h6.9c.5 0 1 .2 1.3.6l2.5 3h2c.9 0 1.6.7 1.6 1.6v1.3h-1.5" /><path d="M9.9 16.4h4.2" /><circle cx="7.6" cy="16.6" r="1.7" /><circle cx="16.4" cy="16.6" r="1.7" /><path d="M13 10.3l2 2.5H4.6" opacity=".55" /></TmRyt>,
    "Art": (s) => <TmRyt size={s}><circle cx="8" cy="18" r="4" /><path d="M12 18V2l7 4" /></TmRyt>,
    "Life mission": (s) => <TmRyt size={s}><circle cx="12" cy="12" r="7.7" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></TmRyt>,
  };

  const TmGeo = ({ size = 15, children }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>{children}</svg>
  );
  const TmGeoAch = (s) => <TmGeo size={s}><circle cx="12" cy="12" r="8.4" opacity=".5" /><path d="M12 5.1 18 15.6H6L12 5.1Z" /></TmGeo>;
  const TmGeoStav = (s) => <TmGeo size={s}><circle cx="12" cy="12" r="8.4" /><path d="M12 12V3.6A8.4 8.4 0 0 1 19.3 15.9Z" fill="currentColor" stroke="none" opacity=".55" /></TmGeo>;
  const TmGeoTerm = (s) => <TmGeo size={s}><circle cx="12" cy="12" r="8.4" /><path d="M4.4 14.6h15.2" /><circle cx="12" cy="9.1" r="2.5" opacity=".55" /></TmGeo>;
  const TmGeoArch = (s) => <TmGeo size={s}><circle cx="12" cy="12" r="8.4" opacity=".5" /><rect x="6.1" y="6.1" width="11.8" height="11.8" rx="1" /></TmGeo>;
  const TmGeoCil = (s) => <TmGeo size={s}><circle cx="9.2" cy="12" r="5.8" /><circle cx="14.8" cy="12" r="5.8" opacity=".62" /></TmGeo>;
  // Komentář · z jednoho bodu se šíří dva oblouky. Řeč jako kruhy na vodě.
  const TmGeoSlovo = (s) => <TmGeo size={s}><circle cx="7.4" cy="12" r="1.9" fill="currentColor" stroke="none" /><path d="M12.1 7.4a6.5 6.5 0 0 1 0 9.2" /><path d="M16.1 4.6a11 11 0 0 1 0 14.8" opacity=".5" /></TmGeo>;

  function AreaGlyph({ name, size = 15 }) {
    const { t } = useT();
    const st = useStore();
    const a = st.listAreas().find((x) => x.name === name);
    const icon = (a && a.icon) || AREA_ICON[name] || "▦";
    const R = AREA_RYT[areaClean(name)];
    if (R) return <span style={{ display: "inline-flex", color: t.sand, flexShrink: 0 }}>{R(size)}</span>;
    return <span style={{ fontSize: Math.max(12, size - 2) }}>{icon}</span>;
  }

  // ---- Moje / Od Tanmaye --------------------------------------------------
  // Klidný štítek, ne zámek. Ukáže se u cíle od trenéra vždy; u vlastního jen
  // v domě, kde obě třídy současně existují — jinak by „Moje" bylo šumem.
  function OwnerBadge({ g }) {
    const { t } = useT();
    const st = useStore();
    const coach = g && g.owner === GOAL_OWNER.COACH;
    const both = typeof st.hasCoachGoals === "function" ? st.hasCoachGoals() : false;
    if (!coach && !both) return null;
    return (
      <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, padding: "2px 8px", borderRadius: "var(--tm-r-tag)", whiteSpace: "nowrap", flexShrink: 0, color: coach ? (t.accentInk || t.accent) : t.sage, background: hexA(coach ? t.accent : t.sage, 0.1), border: `1px solid ${hexA(coach ? t.accent : t.sage, 0.28)}` }}>
        {goalOwnerLabel(g, lang())}
      </span>
    );
  }

  const smim = (g, field) => mayEditGoalField(role === "coach" ? "coach" : "client", g, field);

  // ---- karta cíle ---------------------------------------------------------
  function GoalCard({ g, onOpen }) {
    const { t, tags } = useT();
    const st = useStore();
    const today = todayISO();
    const overdue = g.target && g.target < today && g.status !== "Completed";
    const inToday = st.getDay(today).tasks.some((task) => task.text === g.name);
    const fmtT = (iso) => { if (!iso) return null; const [y, m, d] = iso.split("-"); return (+d) + ". " + (+m) + ". " + y; };
    return (
      <div onClick={() => onOpen && onOpen(g.name)} style={{ background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: "var(--tm-r-md)", padding: "12px 14px", marginBottom: 10, cursor: "pointer", boxShadow: t.shadow }} className="tm-nav-item tm-lift">
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{ color: t.textMuted, fontSize: 13, lineHeight: "20px" }}>◎</span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--tm-font-body)", fontSize: 15, fontWeight: 500, color: g.status === "Completed" ? t.textMuted : t.heading, textDecoration: g.status === "Completed" ? "line-through" : "none", lineHeight: 1.4 }}>{g.name}</span>
          <OwnerBadge g={g} />
        </div>
        {g.area && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <AreaGlyph name={g.area} size={14} />
            <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textSec, borderBottom: `1px solid ${t.border}` }}>{areaLabel(g.area)}</span>
          </div>
        )}
        {g.target && <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: overdue ? tags.red.fg : t.textMuted, marginBottom: 7 }}>{fmtT(g.target)}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {g.prio && <Tag label={PL(g.prio)} color={PRIO_COLOR[g.prio] || "default"} />}
          {g.status !== "Completed" && (
            inToday
              ? <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.sage, marginLeft: "auto" }}>{L("✓ dnes", "✓ today")}</span>
              : <button onClick={(e) => { e.stopPropagation(); st.pushGoalToDay(g.name); }} title={L("Přidat do dnešních cílů", "Add to today's goals")} style={{ marginLeft: "auto", background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-pill)", padding: "1px 9px", cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{L("→ dnes", "→ today")}</button>
          )}
        </div>
      </div>
    );
  }

  // ---- sloupcová deska ----------------------------------------------------
  function Board({ groups, onOpen, onMove }) {
    const { t, tags } = useT();
    const [overCol, setOverCol] = useState(null);
    const dnd = !!onMove;
    const getName = (e) => { const d = (e.dataTransfer.getData("text/plain") || "").split(":"); return d[0] === "goal" ? d.slice(1).join(":") : null; };
    return (
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, WebkitOverflowScrolling: "touch" }}>
        {groups.map(([title, color, items, dropVal]) => {
          const c = (tags[color] || tags.default).fg;
          const colOver = overCol === title;
          return (
            <div
              key={title}
              onDragOver={dnd ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setOverCol(title); } : undefined}
              onDragLeave={dnd ? () => setOverCol((x) => (x === title ? null : x)) : undefined}
              onDrop={dnd ? (e) => {
                e.preventDefault(); setOverCol(null);
                const n = getName(e); if (!n) return;
                onMove(n, dropVal, null); // tělo sloupce → na konec
              } : undefined}
              className="tm-bcol"
              style={{ minWidth: 240, maxWidth: 285, flex: "1 0 240px", display: "flex", flexDirection: "column", maxHeight: "min(560px, calc(64 * var(--tm-vh)))", background: hexA(c, colOver ? 0.12 : 0.055), border: `1px solid ${hexA(c, colOver ? 0.4 : 0.14)}`, borderRadius: "var(--tm-r-md)", padding: "10px 6px 4px 10px", transition: "background .15s ease, border-color .15s ease" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingLeft: 2, flexShrink: 0 }}>
                <Tag label={title} color={color} />
                <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted }}>{items.length}</span>
              </div>
              <div className="tm-bcol-in" style={{ overflowY: "auto", flex: 1, minHeight: 0, paddingRight: 4 }}>
                {items.map((g) => {
                  // Cíl od trenéra se nepřetahuje mezi krajinami ani prioritami —
                  // ty pole píše on. Stav a krok zůstávají klientovi.
                  const drag = dnd && smim(g, "status");
                  return (
                    <div
                      key={g.name}
                      draggable={drag}
                      onDragStart={drag ? (e) => { e.dataTransfer.setData("text/plain", "goal:" + g.name); e.dataTransfer.effectAllowed = "move"; } : undefined}
                      onDragOver={dnd ? (e) => { e.preventDefault(); e.stopPropagation(); setOverCol(title); } : undefined}
                      onDrop={dnd ? (e) => {
                        e.preventDefault(); e.stopPropagation(); setOverCol(null);
                        const n = getName(e); if (!n || n === g.name) return;
                        onMove(n, dropVal, g.name);
                      } : undefined}
                      style={drag ? { cursor: "grab" } : undefined}
                    >
                      <GoalCard g={g} onOpen={onOpen} />
                    </div>
                  );
                })}
                {items.length === 0 && <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, padding: "2px 4px 8px" }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---- nový cíl -----------------------------------------------------------
  function AddGoalForm() {
    const { t } = useT();
    const st = useStore();
    const areas = st.listAreas();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [area, setArea] = useState(areas[0] ? areas[0].name : "");
    const [prio, setPrio] = useState("Normal");
    const [target, setTarget] = useState("");
    const otoc = tmOtocFor(name);
    const otocLbl = otoc ? L(otoc.cz, otoc.en) : null;
    const ulozit = () => {
      if (!name.trim()) return;
      st.addGoal({ id: uid(), name: name.trim(), area, areas: [area], status: "Not started", prio, ach: "", target });
      setName(""); setTarget(""); setOpen(false);
    };
    if (!open) return <button onClick={() => setOpen(true)} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-sm)", padding: "10px 14px", cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 13, width: "100%", textAlign: "left", marginBottom: 12 }}>＋ {L("Nový cíl", "New goal")}</button>;
    return (
      <div style={{ background: t.callout, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-md)", padding: 12, marginBottom: 12, boxShadow: t.shadow }}>
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ulozit(); }} placeholder={L("Název cíle…", "Goal name…")} style={{ ...fieldStyle(t), marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {/* Skutečné krajiny uživatele, ne starý pevný seznam · a týmiž jmény,
              jakými se jmenují na Kompasu. */}
          <Select value={area} onChange={setArea} style={{ maxWidth: 220, width: 220 }} options={areas.map((a) => ({ v: a.name, label: areaLabel(a.name) }))} />
          <Select value={prio} onChange={setPrio} style={{ maxWidth: 130, width: 130 }} options={PRIOS.map((x) => ({ v: x, label: PL(x) }))} />
          <input type="date" value={target} onChange={(e) => setTarget(e.target.value)} style={{ ...fieldStyle(t), maxWidth: 170, colorScheme: t.mode === "light" ? "light" : "dark" }} />
        </div>
        {TM_UTEK.test(name) && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", margin: "-4px 0 12px" }}>
            <span style={{ flex: 1, minWidth: 200, fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 13, color: t.textMuted, lineHeight: 1.55 }}>{L("Napiš to jako to, k čemu jdeš, ne jako to, od čeho utíkáš.", "Write it as what you are moving toward, not what you are running from.")}</span>
            {otocLbl && (
              <button onClick={() => setName(otocLbl)} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: "var(--tm-r-pill)", padding: "5px 13px", cursor: "pointer", color: t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12, whiteSpace: "nowrap" }}>{otocLbl}</button>
            )}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={ulozit} style={{ background: t.accent, color: t.onAccent || t.bg, border: "none", borderRadius: "var(--tm-r-sm)", padding: "8px 16px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13, fontWeight: 500 }}>{L("Uložit", "Save")}</button>
          <button onClick={() => setOpen(false)} style={{ background: "transparent", color: t.textSec, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-sm)", padding: "8px 16px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Zrušit", "Cancel")}</button>
        </div>
      </div>
    );
  }

  // ---- nová krajina -------------------------------------------------------
  function AddAreaForm({ onDone }) {
    const { t } = useT();
    const st = useStore();
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("");
    const save = () => {
      const v = name.trim();
      if (!v) return;
      if (st.listAreas().some((a) => a.name.toLowerCase() === v.toLowerCase())) { st.ask(L("Krajina s tímto jménem už existuje.", "A landscape with this name already exists."), null); return; }
      st.addArea({ name: v, icon: icon.trim() || "▦" });
      onDone && onDone();
    };
    return (
      <div style={{ background: t.callout, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-md)", padding: 12, marginBottom: 14, boxShadow: t.shadow }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="◈" maxLength={4} aria-label={L("Ikona krajiny", "Landscape icon")} style={{ ...fieldStyle(t), width: 60, textAlign: "center", fontSize: 15 }} />
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") save(); }} placeholder={L("Název krajiny…", "Landscape name…")} style={{ ...fieldStyle(t), flex: 1, minWidth: 180 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} style={{ background: t.accent, color: t.onAccent || t.bg, border: "none", borderRadius: "var(--tm-r-sm)", padding: "7px 15px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13, fontWeight: 500 }}>{L("Vytvořit", "Create")}</button>
          <button onClick={onDone} style={{ background: "transparent", color: t.textSec, border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-sm)", padding: "7px 15px", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13 }}>{L("Zrušit", "Cancel")}</button>
        </div>
        <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, fontStyle: "italic", marginTop: 8 }}>{L("Ikona: emoji nebo znak. Krajina se objeví ve všech filtrech a odznacích.", "Icon: an emoji or a symbol. The landscape appears in all filters and chips.")}</div>
      </div>
    );
  }

  // ---- odznaky krajin -----------------------------------------------------
  function AreaChips({ onOpen, onAdd }) {
    const { t } = useT();
    const st = useStore();
    const all = st.allGoals();
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {st.listAreas().map((a) => {
          const gs = all.filter((g) => g.area === a.name || (g.areas || []).includes(a.name));
          const done = gs.filter((g) => g.status === "Completed").length;
          return (
            <button key={a.name} onClick={() => onOpen(a.name)} title={`${done} / ${gs.length} ${L("cílů", "goals")}`} className="tm-nav-item tm-lift" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: "var(--tm-r-pill)", padding: "6px 13px", minHeight: 38, cursor: "pointer" }}>
              <AreaGlyph name={a.name} size={15} />
              <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text }}>{areaLabel(a.name)}</span>
              <span style={{ width: 34, height: 3, borderRadius: 2, background: t.borderSoft, position: "relative", overflow: "hidden" }}>
                <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${gs.length ? Math.round((done / gs.length) * 100) : 0}%`, background: t.accent, transition: "width .55s cubic-bezier(.25,.8,.3,1)" }} />
              </span>
              {gs.length > 0 && <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, fontVariantNumeric: "tabular-nums" }}>{done}/{gs.length}</span>}
            </button>
          );
        })}
        {onAdd && <button onClick={onAdd} title={L("Nová krajina", "New landscape")} aria-label={L("Nová krajina", "New landscape")} className="tm-nav-item" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-pill)", minWidth: 38, minHeight: 38, padding: "0 13px", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>＋</button>}
      </div>
    );
  }

  // ---- tabulka krajin -----------------------------------------------------
  function AreaTable({ onOpen }) {
    const { t, tags } = useT();
    const st = useStore();
    const all = st.allGoals();
    const statFor = (name) => {
      const gs = all.filter((g) => g.area === name || (g.areas || []).includes(name));
      return { done: gs.filter((g) => g.status === "Completed").length, total: gs.length };
    };
    const lastRating = (a) => {
      const months = st.monthsOf(a);
      for (let i = ROM.length - 1; i >= 0; i--) if (months[ROM[i]] != null) return { v: months[ROM[i]], m: ROM[i] };
      return null;
    };
    const cols = "1fr 120px 90px";
    const th = { fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: t.sage, padding: "9px 12px", borderBottom: `1px solid ${t.border}` };
    return (
      <div style={{ border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-sm)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, background: t.tableHead }}>
          <div style={th}>{L("Krajina", "Landscape")}</div><div style={th}>{L("Poslední hodnocení", "Latest rating")}</div><div style={{ ...th, textAlign: "right" }}>{L("Cíle", "Goals")}</div>
        </div>
        {st.listAreas().map((a) => {
          const r = lastRating(a);
          const s2 = statFor(a.name);
          return (
            <button key={a.name} onClick={() => onOpen && onOpen(a.name)} className="tm-nav-item" style={{ display: "grid", width: "100%", gridTemplateColumns: cols, alignItems: "center", minHeight: 44, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "none" }}>
              <span style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
                <AreaGlyph name={a.name} size={15} />
                <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text }}>{areaLabel(a.name)}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: (tags[AREA_COLOR[a.name]] || tags.default).fg }} />
              </span>
              <span style={{ padding: "8px 12px", fontFamily: "var(--tm-font-body)", fontSize: 13, color: r ? t.sand : t.textMuted }}>{r ? `★ ${r.v} · ${r.m}` : "—"}</span>
              <span style={{ padding: "10px 12px", textAlign: "right", fontFamily: "var(--tm-font-body)", fontSize: 13, color: s2.done > 0 ? t.text : t.textMuted }}>{s2.total ? `${s2.done} / ${s2.total}` : "—"}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // ---- dvě otázky ke krajině ---------------------------------------------
  // Trojka může znamenat dvě zcela různé věci: buď mi na té oblasti nezáleží
  // a je to v pořádku, nebo mi na ní záleží hodně a týden jsem se jí nedotkl.
  // To první je klid. To druhé je to jediné, co má cenu vědět — a jedno číslo
  // to nikdy neřekne. Rozdíl se schválně nikde nebarví a nikde nesčítá.
  function AreaVlq({ name }) {
    const { t } = useT();
    const st = useStore();
    if (typeof st.areaVlqOf !== "function") return null;
    const v = st.areaVlqOf(name);
    const set = (patch) => st.setAreaVlq(name, patch);
    const dul = v.dulezitost || 0, zit = v.zit || 0;
    const obe = dul > 0 && zit > 0;
    const rozdil = obe ? dul - zit : null;
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 30px", alignItems: "flex-end" }}>
          <DotTap label={L("Důležité mi to je", "It matters to me")} value={dul} onChange={(x) => set({ dulezitost: x })} color={t.sand} />
          <DotTap label={L("Posledních 7 dní podle toho žiju", "Lived it these 7 days")} value={zit} onChange={(x) => set({ zit: x })} color={t.sage} />
        </div>
        {obe && (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.borderSoft}` }}>
            <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec }}>
              {L("Rozdíl ", "Gap ")}<span style={{ fontFamily: "var(--tm-font-display)", fontSize: 19, color: t.textSec }}>{Math.abs(rozdil)}</span>
            </span>
            <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 5, lineHeight: 1.55 }}>
              {rozdil > 0
                ? L("Záleží ti na tom víc, než kolik z toho poslední týden bylo. To je jediné, co má cenu vědět.", "It matters more than the past week showed. That is the only thing worth knowing here.")
                : rozdil < 0
                  ? L("Bylo toho víc, než kolik na tom podle tebe záleží. Někdy je to poctivá odpověď, někdy setrvačnost.", "There was more of it than you say it matters. Sometimes that is honest, sometimes momentum.")
                  : L("Sedí to. Nic k řešení.", "They match. Nothing to solve.")}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- detail cíle --------------------------------------------------------
  function GoalDetail({ name, openArea, onClose, onExpand, wide }) {
    const { t } = useT();
    const st = useStore();
    const g = st.allGoals().find((x) => x.name === name);
    const [note, setNote] = useState("");
    if (!g) return null;
    const cycle = (list, cur, apply) => apply(list[(list.indexOf(cur) + 1) % list.length]);
    const pill = (label, color, onClick, title) => (
      onClick
        ? <button onClick={onClick} title={title || L("Klikni a přepínej", "Click to cycle")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}><Tag label={label} color={color} /></button>
        : <Tag label={label} color={color} />
    );
    const notes = st.goalNotes(g.name);
    const addNote = () => { const v = note.trim(); if (!v) return; st.addGoalNote(g.name, v); setNote(""); };
    const today = todayISO();
    const inToday = st.getDay(today).tasks.some((task) => task.text === g.name);
    const odTanmaye = g.owner === GOAL_OWNER.COACH;
    const smiSmazat = smim(g, "id");
    return (
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <div style={{ color: t.sand, display: "inline-flex" }}>{TmGeoCil(30)}</div>
          {onExpand && <button title={L("Otevřít jako stránku", "Open as page")} aria-label={L("Otevřít jako stránku", "Open as page")} onClick={onExpand} style={{ ...iconBtn(t), border: "none", color: t.textMuted, fontSize: 13 }}>⤢</button>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}><OwnerBadge g={g} /></div>
        <h2 style={{ fontFamily: "var(--tm-font-display)", fontSize: wide ? 34 : 30, fontWeight: 500, color: t.heading, margin: "0 0 18px", lineHeight: 1.2, maxWidth: wide ? 720 : "none" }}>{g.name}</h2>
        {odTanmaye && (g.intent || g.target) && (
          <div style={{ borderLeft: `2px solid ${hexA(t.accent, 0.4)}`, paddingLeft: 12, margin: "0 0 16px" }}>
            {g.intent && <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 14, color: t.textSec, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{g.intent}</div>}
            <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 6 }}>{L("Zadání píše Tanmay. Postup, krok a poznámka jsou tvoje.", "Tanmay writes the assignment. The progress, the step and the note are yours.")}</div>
          </div>
        )}
        {!odTanmaye && (
          <PropRow icon={TmGeoAch(15)} label={L("Dosažitelnost", "Achievability")}>
            {pill(g.ach ? ACH_SHORT[g.ach] || g.ach : "—", "default", () => cycle(ACHIEVES, g.ach, (v) => st.editGoal(g.name, { ach: v })))}
          </PropRow>
        )}
        <PropRow icon={TmGeoStav(15)} label={L("Stav", "Status")}>
          {pill(GS(g.status), GSTATUS_COLOR[g.status] || "default", smim(g, "status") ? () => cycle(GOAL_STATUSES, g.status, (v) => st.editGoal(g.name, { status: v })) : null)}
        </PropRow>
        {!odTanmaye && (
          <PropRow icon={<span style={{ fontSize: 17, lineHeight: 1 }}>⊙</span>} label={L("Priorita", "Priority")}>
            {pill(g.prio || "—", PRIO_COLOR[g.prio] || "default", () => cycle(PRIOS, g.prio, (v) => st.editGoal(g.name, { prio: v })))}
          </PropRow>
        )}
        <PropRow icon={<span style={{ fontSize: 17, lineHeight: 1 }}>⌖</span>} label={L("Krajina", "Landscape")}>
          {/* Krajina byla jen ke čtení: cíl založený z dnešního úkolu žádnou
              neměl a nešlo mu ji dát. Teď se vybírá tady, ze skutečných krajin
              uživatele. Ukládá se `area` i `areas`, jak to dělá formulář nového
              cíle — schopnost více oblastí se tím neztrácí a nic se nemigruje. */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <AreaGlyph name={g.area} size={15} />
            {smim(g, "area") ? (
              <Select
                value={g.area || ""}
                onChange={(v) => st.editGoal(g.name, { area: v, areas: v ? [v] : [] })}
                ghost small
                style={{ maxWidth: 230 }}
                options={[{ v: "", label: L("Bez krajiny", "No landscape") }, ...st.listAreas().map((a) => ({ v: a.name, label: areaLabel(a.name) }))]}
              />
            ) : (
              <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: g.area ? t.text : t.textMuted }}>{g.area ? areaLabel(g.area) : L("Bez krajiny", "No landscape")}</span>
            )}
            {g.area && openArea && (
              <button onClick={() => openArea(g.area)} title={L("Otevřít krajinu", "Open the landscape")} aria-label={L("Otevřít krajinu", "Open the landscape")}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px 4px", color: t.textMuted, fontSize: 13, lineHeight: 1 }}>›</button>
            )}
          </div>
        </PropRow>
        <PropRow icon={TmGeoTerm(15)} label={L("Termín", "Target date")}>
          {smim(g, "target")
            ? <input type="date" value={g.target || ""} onChange={(e) => st.editGoal(g.name, { target: e.target.value })} aria-label={L("Termín", "Target date")} style={{ background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none", colorScheme: t.mode === "light" ? "light" : "dark" }} />
            : <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: g.target ? t.text : t.textMuted }}>{g.target ? fmtCZ(g.target) : "—"}</span>}
        </PropRow>
        {odTanmaye && (
          <div style={{ margin: "12px 0 4px" }}>
            <div style={{ ...metaLabel(t), marginBottom: 5 }}>{L("Můj krok", "My step")}</div>
            <input value={g.step || ""} onChange={(e) => st.editGoal(g.name, { step: e.target.value })}
              placeholder={L("Co je nejbližší krok…", "What is the nearest step…")}
              style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${t.borderSoft}`, color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 15, padding: "3px 2px 8px", outline: "none" }} />
          </div>
        )}
        {!odTanmaye && (
          <>
            {/* SPOUŠTĚČ · podmínkový tvar „až — pak" vyšel v přehledu 642 testů
                d = 0,43 proti d = 0,29 u rozvrhu (Sheeran a kol. 2025), a účinek se
                násobí s tím, jak moc je ten cíl vlastní (Koestner a kol. 2002).
                Kolonka na dobu tu schválně není: dopsat „a budu to dělat dvacet minut"
                srazí účinek skoro na půl (0,46 → 0,24). Tvar je součást účinku. */}
            <div style={{ margin: "12px 0 4px" }}>
              <div style={{ ...metaLabel(t), marginBottom: 5 }}>{L("Spouštěč", "Trigger")}</div>
              <input value={g.azpak || ""} onChange={(e) => st.editGoal(g.name, { azpak: e.target.value })}
                placeholder={L("Až ___, udělám ___", "When ___, I will ___")}
                aria-label={L("Spouštěč", "Trigger")}
                style={{ width: "100%", boxSizing: "border-box", background: "transparent", border: "none", borderBottom: `1px solid ${t.borderSoft}`, color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 15, padding: "3px 2px 8px", outline: "none" }} />
              <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, marginTop: 6, lineHeight: 1.5 }}>{L("Místo nebo chvíle, ne hodina. Bez údaje, jak dlouho — ten účinek srazí.", "A cue or a moment, not a clock hour. No duration — that halves the effect.")}</div>
            </div>
            <PropRow icon={TmGeoArch(15)} label={L("Archiv", "Archive")}>
              <button onClick={() => st.editGoal(g.name, { archive: !g.archive })} title={L("Archivovat / vrátit", "Archive / restore")} aria-label={L("Archivovat / vrátit", "Archive / restore")} style={{ width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: `1.5px solid ${g.archive ? t.accent : t.border}`, background: g.archive ? t.accent : "transparent", cursor: "pointer", color: t.bg, fontSize: 12, lineHeight: 1, padding: 0 }}>{g.archive ? "✓" : ""}</button>
            </PropRow>
          </>
        )}
        <div style={{ padding: "10px 0 4px" }}>
          {g.status !== "Completed" && !inToday && (
            <button onClick={() => st.pushGoalToDay(g.name)} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-pill)", padding: "6px 14px", minHeight: 38, cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{L("→ poslat do dnešních cílů", "→ send to today's goals")}</button>
          )}
          {inToday && <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.sage }}>✓ {L("v dnešním plánu", "in today's plan")}</span>}
          {odTanmaye && g.status !== "Completed" && (
            <button onClick={() => st.editGoal(g.name, { requestDone: !g.requestDone })} style={{ marginLeft: 12, background: g.requestDone ? hexA(t.sage, 0.14) : "transparent", border: `1px solid ${g.requestDone ? hexA(t.sage, 0.5) : t.border}`, borderRadius: "var(--tm-r-pill)", padding: "6px 14px", minHeight: 38, cursor: "pointer", color: g.requestDone ? t.sage : t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>
              {g.requestDone ? L("✓ označeno jako hotové · čeká na Tanmaye", "✓ marked done · waiting for Tanmay") : L("Označit jako hotové", "Mark as done")}
            </button>
          )}
          {st.editMode && smiSmazat && (
            <button
              onClick={() => st.ask(L(`Přesunout „${g.name}" do koše?`, `Move "${g.name}" to trash?`), () => { if (g.user) st.removeUserGoal(g.id); else st.trashBuiltinGoal(g.name); onClose && onClose(); })}
              style={{ marginLeft: 12, background: "transparent", border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-pill)", padding: "6px 14px", minHeight: 38, cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}
            >{L("Do koše", "To trash")}</button>
          )}
        </div>
        <MetaSection meta={st.goalMetaOf(g.name)} onPatch={(p) => st.setGoalMeta(g.name, p)} placeholder={L("Poznámky k tomuto cíli…", "Notes on this goal…")} />
        <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: 14, paddingTop: 14 }}>
          <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textMuted, marginBottom: 8 }}>{L("Komentáře", "Comments")}</div>
          {notes.map((n) => (
            <div key={n.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: t.card, border: `1px solid ${t.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}><span style={{ color: t.sand, display: "inline-flex" }}>{TmGeoSlovo(14)}</span></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted }}>{fmtCZ(n.date)}</div>
                <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{n.text}</div>
              </div>
              <button onClick={() => st.ask(L("Smazat komentář?", "Delete comment?"), () => st.removeGoalNote(g.name, n.id))} title={L("Smazat", "Delete")} aria-label={L("Smazat komentář", "Delete comment")} style={{ ...iconBtn(t), border: "none", color: t.textMuted, fontSize: 12 }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: t.card, border: `1px solid ${t.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}><span style={{ color: t.sand, display: "inline-flex" }}>{TmGeoSlovo(14)}</span></span>
            <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addNote(); }} placeholder={L("Napiš komentář…", "Add a comment…")} aria-label={L("Napiš komentář", "Add a comment")} style={{ flex: 1, background: "transparent", border: "none", borderBottom: `1px solid ${t.borderSoft}`, color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "4px 2px 7px", outline: "none" }} />
          </div>
        </div>
      </div>
    );
  }

  // ---- detail krajiny -----------------------------------------------------
  function AreaDetail({ name, openGoal, onClose, onExpand }) {
    const { t } = useT();
    const st = useStore();
    const a = st.listAreas().find((x) => x.name === name);
    if (!a) return null;
    const months = st.monthsOf(a);
    const gs = st.allGoals().filter((g) => g.area === name || (g.areas || []).includes(name));
    const done = gs.filter((g) => g.status === "Completed").length;
    const em = st.editMode;
    const eyebrow = { fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage };
    return (
      <div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          {/* Táž rytina a týž název jako na malé kartě. Dřív tu stálo syrové
              emoji a syrový uložený klíč, takže „Rodina ✨" na Kompasu se
              v detailu otevřela jako „Blood Family wellfear". */}
          <AreaGlyph name={a.name} size={34} />
          {onExpand && <button title={L("Otevřít jako stránku", "Open as page")} aria-label={L("Otevřít jako stránku", "Open as page")} onClick={onExpand} style={{ ...iconBtn(t), border: "none", color: t.textMuted, fontSize: 13 }}>⤢</button>}
        </div>
        <h2 style={{ fontFamily: "var(--tm-font-display)", fontSize: 28, fontWeight: 500, color: t.heading, margin: "0 0 16px", lineHeight: 1.2 }}>{areaLabel(a.name)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={eyebrow}>{L("Cíle · postup", "Goals progress")}</span>
          <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec }}>{done} / {gs.length}</span>
        </div>
        <ProgressBar value={gs.length ? done / gs.length : 0} />
        <div style={{ height: 18 }} />
        <div style={{ ...eyebrow, marginBottom: 10 }}>{L("Jak to teď stojí", "Where this stands")}</div>
        <AreaVlq name={a.name} />
        <div style={{ height: 18 }} />
        <div style={{ ...eyebrow, marginBottom: 8 }}>{L("Hodnocení po měsících", "Ratings by month")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 18 }}>
          {ROM.map((r) => (
            <div key={r} style={{ textAlign: "center", border: `1px solid ${months[r] != null ? t.border : t.borderSoft}`, borderRadius: "var(--tm-r-sm)", padding: "6px 2px", background: months[r] != null ? t.card : "transparent" }}>
              <div style={{ fontFamily: "var(--tm-font-tag)", fontSize: 12, letterSpacing: "0.08em", color: t.textMuted }}>{r}</div>
              {em ? (
                <input type="number" min="0" max="10" value={months[r] != null ? months[r] : ""} placeholder="—"
                  aria-label={`${areaLabel(a.name)} · ${r}`}
                  onChange={(e) => st.setAreaMonth(a.name, r, e.target.value === "" ? null : Math.max(0, Math.min(10, +e.target.value)))}
                  style={{ width: "100%", background: "transparent", border: "none", textAlign: "center", color: t.heading, fontFamily: "var(--tm-font-display)", fontSize: 15, outline: "none" }} />
              ) : (
                <div style={{ fontFamily: "var(--tm-font-display)", fontSize: 17, color: months[r] != null ? t.sand : t.borderSoft }}>{months[r] != null ? months[r] : "·"}</div>
              )}
            </div>
          ))}
        </div>
        <MetaSection meta={st.areaMetaOf(a.name)} onPatch={(p) => st.setAreaMeta(a.name, p)} placeholder={L("Piš k této krajině…", "Write about this landscape…")} />
        <div style={{ height: 14 }} />
        <div style={{ ...eyebrow, marginBottom: 6 }}>{L("Cíle", "Goals")} · {gs.length}</div>
        {gs.length === 0 && <Prazdno kind="prvni" plain compact fakt={L("V této krajině zatím žádný cíl není.", "No goal in this landscape yet.")} pozvani={L("Přidej ho v Cílech a vyber tuhle krajinu.", "Add one in Goals and pick this landscape.")} />}
        {gs.map((g) => (
          <button key={g.name} className="tm-row" onClick={() => openGoal && openGoal(g.name)} style={{ display: "flex", width: "100%", alignItems: "center", gap: 9, padding: "9px 6px", margin: "0 -6px", minHeight: 40, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ color: t.textMuted, fontSize: 12 }}>◎</span>
            <span style={{ flex: 1, fontFamily: "var(--tm-font-body)", fontSize: 13, color: g.status === "Completed" ? t.textMuted : t.text, textDecoration: g.status === "Completed" ? "line-through" : "none" }}>{g.name}</span>
            <OwnerBadge g={g} />
            <Tag label={GS(g.status)} color={GSTATUS_COLOR[g.status] || "default"} />
          </button>
        ))}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.borderSoft}` }}>
          {st.editMode && (
            <button
              onClick={() => { const msg = gs.length ? L(`Přesunout „${a.name}" do koše? ${gs.length} cílů v této krajině tam zůstane, jen ztratí přiřazení.`, `Move "${a.name}" to trash? ${gs.length} goals in this landscape will stay, they just lose the assignment.`) : L(`Přesunout „${a.name}" do koše?`, `Move "${a.name}" to trash?`); st.ask(msg, () => { st.removeArea(a.name); onClose && onClose(); }); }}
              style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: "var(--tm-r-pill)", padding: "6px 14px", minHeight: 38, cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}
            >{L("Přesunout krajinu do koše", "Move landscape to trash")}</button>
          )}
        </div>
      </div>
    );
  }

  // ---- dílna --------------------------------------------------------------
  function GoalWorkspace({ withAreas }) {
    const { t } = useT();
    const st = useStore();
    // pohled a filtry si Kompas pamatuje · po návratu stojí tam, kde se odešlo
    const gmeta = st.pageMetaOf("cile");
    const view = gmeta.view || "Status";
    const fArea = gmeta.fArea || "Vše";
    const fPrio = gmeta.fPrio || "Vše";
    const sortBy = gmeta.sort || "prio";
    const setView = (v) => st.setPageMeta("cile", { view: v });
    const setFArea = (v) => st.setPageMeta("cile", { fArea: v });
    const setFPrio = (v) => st.setPageMeta("cile", { fPrio: v });
    const setSortBy = (v) => st.setPageMeta("cile", { sort: v });
    const [sel, setSel] = useState(null); // {type:'goal'|'area', id}
    const [full, setFull] = useState(null); // {type, id} · celostránkový detail
    const [addingArea, setAddingArea] = useState(false);
    React.useEffect(() => { if (full) tmToTop(); }, [full && full.id]);

    const openGoal = (name) => setSel({ type: "goal", id: name });
    // přišlo se sem odjinud · otevři přesně ten cíl a nech ho nahoře
    React.useEffect(() => {
      const tgt = st.openTarget;
      if (!tgt) return;
      if (tgt.kind === "goal") { st.setPageMeta("cile", { view: "Status", fArea: "Vše", fPrio: "Vše" }); setSel({ type: "goal", id: tgt.id }); st.setOpenTarget(null); }
      else if (tgt.kind === "area") { setSel({ type: "area", id: tgt.id }); st.setOpenTarget(null); }
    }, [st.openTarget]);
    const applyMove = (patchOf) => (n, v, over) => { st.dragGoal(n, over, patchOf(v)); if (sortBy !== "manual") setSortBy("manual"); };
    const openArea = (name) => setSel({ type: "area", id: name });

    const all = st.allGoals();
    const areaNames = st.listAreas().map((a) => a.name);
    const sorters = {
      prio: (a, b) => (PRIO_ORDER[a.prio] ?? 9) - (PRIO_ORDER[b.prio] ?? 9) || (a.target || "9999").localeCompare(b.target || "9999"),
      dateAsc: (a, b) => (a.target || "9999").localeCompare(b.target || "9999"),
      dateDesc: (a, b) => (b.target || "0000").localeCompare(a.target || "0000"),
      name: (a, b) => a.name.localeCompare(b.name, "cs"),
    };
    let rows = st.orderGoals(all.filter((g) => {
      if (fArea !== "Vše" && g.area !== fArea && !(g.areas || []).includes(fArea)) return false;
      if (fPrio !== "Vše" && g.prio !== fPrio) return false;
      return true;
    }));
    if (sortBy !== "manual") rows = [...rows].sort(sorters[sortBy] || sorters.prio);
    const nonArch = rows.filter((g) => !g.archive);
    const archived = rows.filter((g) => g.archive);
    const completed = nonArch.filter((g) => g.status === "Completed");

    const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 };

    if (full) {
      return (
        <>
          <button onClick={() => setFull(null)} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "8px 0 16px", minHeight: 34, display: "inline-flex", alignItems: "center", gap: 6 }}>{L("‹ Zpět", "‹ Back")}</button>
          {full.type === "area"
            ? <AreaDetail name={full.id} openGoal={(n) => setFull({ type: "goal", id: n })} onClose={() => setFull(null)} />
            : <GoalDetail name={full.id} wide openArea={(n) => setFull({ type: "area", id: n })} onClose={() => setFull(null)} />}
        </>
      );
    }
    return (
      <>
        {withAreas && (
          <div style={{ marginBottom: 14 }}>
            {addingArea && <AddAreaForm onDone={() => setAddingArea(false)} />}
            <AreaChips onOpen={openArea} onAdd={() => setAddingArea(true)} />
          </div>
        )}
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
          {G_VIEWS.map((v) => (
            <button key={v} onClick={() => setView(v)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "10px 11px 11px", minHeight: 40, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: view === v ? t.accent : t.textMuted, borderBottom: view === v ? `2px solid ${t.accent}` : "2px solid transparent", marginBottom: -1 }}>{LV(v)}</button>
          ))}
          <span style={{ flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
          <Select small value={fArea} onChange={setFArea} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 180 }} options={[{ v: "Vše", label: L("Vše", "All") }, ...areaNames]} />
          <Select small value={fPrio} onChange={setFPrio} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 140 }} options={[{ v: "Vše", label: L("Vše", "All") }, ...PRIOS.map((x) => ({ v: x, label: PL(x) }))]} />
          <Select small value={sortBy} onChange={setSortBy} style={{ flex: "1 1 0", minWidth: 0, maxWidth: 150 }} options={[{ v: "manual", label: L("vlastní pořadí", "custom order") }, { v: "prio", label: L("priorita", "priority") }, { v: "dateAsc", label: L("datum ↑", "date ↑") }, { v: "dateDesc", label: L("datum ↓", "date ↓") }, { v: "name", label: "A–Z" }]} />
        </div>

        <AddGoalForm />

        {view === "Status" && (
          <Board onOpen={openGoal} onMove={applyMove((v) => ({ status: v }))} groups={GOAL_STATUSES.map((sx) => [GS(sx), GSTATUS_COLOR[sx], nonArch.filter((g) => g.status === sx), sx])} />
        )}
        {view === "Area" && (
          <Board onOpen={openGoal} onMove={applyMove((v) => ({ area: v, areas: v ? [v] : [] }))} groups={[...areaNames, ""].map((n) => [n ? areaLabel(n) : L("Bez krajiny", "No landscape"), n ? (AREA_COLOR[n] || "default") : "default", nonArch.filter((g) => (g.area || "") === n), n]).filter(([, , items]) => items.length > 0)} />
        )}
        {view === "Priority" && (
          <Board onOpen={openGoal} onMove={applyMove((v) => ({ prio: v }))} groups={PRIOS.map((p) => [PL(p), PRIO_COLOR[p], nonArch.filter((g) => g.prio === p), p])} />
        )}
        {view === "Completed" && (completed.length ? <div style={grid}>{completed.map((g) => <GoalCard key={g.name} g={g} onOpen={openGoal} />)}</div> : <Prazdno kind="hotovo" plain compact fakt={L("V tomhle výběru zatím nic dokončeného.", "Nothing completed in this selection yet.")} />)}
        {view === "Archiv" && (archived.length ? <div style={grid}>{archived.map((g) => <GoalCard key={g.name} g={g} onOpen={openGoal} />)}</div> : <Prazdno kind="hotovo" plain compact fakt={L("Archiv je prázdný.", "The archive is empty.")} />)}

        <Drawer open={!!sel} onClose={() => setSel(null)}>
          {sel && sel.type === "goal" && <GoalDetail name={sel.id} openArea={openArea} onClose={() => setSel(null)} onExpand={() => { setFull(sel); setSel(null); }} />}
          {sel && sel.type === "area" && <AreaDetail name={sel.id} openGoal={openGoal} onClose={() => setSel(null)} onExpand={() => { setFull(sel); setSel(null); }} />}
        </Drawer>
      </>
    );
  }

  // ---- Kompas -------------------------------------------------------------
  // Kompas se čte, dílna se navštěvuje. Nejdřív ten jeden pohyb na dnešek,
  // pak co je rozjeté, teprve pak krajina. Kompas, který se otevírá dvanácti
  // stejnými oblastmi, je mapa — a mapa neříká, kudy teď.
  function PageDivine({ go }) {
    const { t } = useT();
    const st = useStore();
    const [dilna, setDilna] = useState(false);
    const [sel, setSel] = useState(null); // {type:'goal'|'area', id}
    const [addingArea, setAddingArea] = useState(false);
    const live = st.allGoals().filter((g) => !g.archive);
    const moving = [...live.filter((g) => g.status === "In progress")].sort((a, b) => (PRIO_ORDER[a.prio] ?? 9) - (PRIO_ORDER[b.prio] ?? 9) || (a.target || "9999").localeCompare(b.target || "9999"));
    const shown = moving.slice(0, 6);
    // čekající cíle · když nic neběží, kompas nabídne tři nejbližší k zvednutí —
    // jeden dotek místo výpravy do dílny
    const waiting = [...live.filter((g) => g.status === "Not started" || g.status === "On Hold")].sort((a, b) => (PRIO_ORDER[a.prio] ?? 9) - (PRIO_ORDER[b.prio] ?? 9));
    const prioDot = (p) => (p === "High" ? t.accent : p === "Normal" ? t.sand : t.sage);
    const [waitN, setWaitN] = useState(3);
    const todayNames = (st.getDay(todayISO()).tasks || []).map((x) => x.text);
    return (
      <>
        <PageTitle icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcKompas size={40} /></span>} pageKey="kompas" kicker={L("Orientace", "Orientation")}>{L("Kompas", "Compass")}</PageTitle>
        <p className="tm-prose" style={pProse(t)}>{L("Dnešní krok. Širší směr. Celá krajina.", "Today's step. The wider direction. The whole landscape.")}</p>
        <Divider />
        <Eyebrow>{L("Dnešní krok", "Today's step")}</Eyebrow>
        <div style={twoCol}>
          <div>
            {/* „Dnešní cíle · datum" se sneslo · nadpis stránky ho už řekl */}
            <div style={{ borderTop: `1px solid ${t.borderSoft}`, paddingTop: 10 }}>
              <DayTasks date={todayISO()} onOpenGoal={(n) => setSel({ type: "goal", id: n })} />
            </div>
            <div style={{ height: 10 }} />
            <LinkPill icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcPraxe size={13} /></span>} label={L("Dnešní praxe", "Today's practice")} onClick={() => go("praxe")} />
          </div>
          {sideSlot ? <div>{sideSlot}</div> : null}
        </div>
        <span style={{ display: "block", height: 30 }} />
        <Eyebrow>{L("V pohybu", "In motion")}</Eyebrow>
        {shown.length === 0 && waiting.length === 0 ? (
          <Prazdno kind="prvni"
            fakt={L("Kompas zatím nikam neukazuje.", "The compass doesn't point anywhere yet.")}
            pozvani={L("Napiš jednu věc, ke které se chceš vracet.", "Write one thing you want to keep returning to.")}
            uvolneni={L("Nemusí to být velké. Musí to být tvoje.", "It doesn't have to be big. It has to be yours.")}
            action={() => setDilna(true)} actionLabel={L("Otevřít dílnu", "Open the workshop")} />
        ) : (
          <>
            {shown.length > 0 && (
              <div style={{ borderTop: `1px solid ${t.borderSoft}`, padding: "6px 0 0", animation: "tmsettle .24s ease-out" }}>
                {shown.map((g) => {
                  const inToday = todayNames.includes(g.name);
                  return (
                    <div key={g.name} className="tm-motionrow" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 6px", margin: "0 -6px", borderRadius: 8, borderBottom: "none" }}>
                      <span title={PL(g.prio)} style={{ width: 8, height: 8, borderRadius: "50%", background: prioDot(g.prio), flexShrink: 0 }} />
                      <button onClick={() => setSel({ type: "goal", id: g.name })} style={{ flex: 1, minWidth: 0, minHeight: 34, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", display: "flex", alignItems: "baseline", gap: 10 }}>
                        <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</span>
                        {g.area && <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, flexShrink: 0 }}>{areaLabel(g.area)}</span>}
                        {g.target && <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, flexShrink: 0 }}>{g.target}</span>}
                      </button>
                      <OwnerBadge g={g} />
                      {/* položit zpátky · zvednutí musí jít vzít zpět, jinak je to jednosměrka */}
                      <button title={L("Položit zpět mezi čekající", "Put back among the waiting")} aria-label={L("Položit zpět mezi čekající", "Put back among the waiting")} onClick={() => st.editGoal(g.name, { status: "Not started" })}
                        style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 15, minWidth: 40, minHeight: 40, margin: "-6px 0", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.75 }}>↓</button>
                      {/* přepínač · druhé klepnutí cíl z dneška zase sundá */}
                      <button title={inToday ? L("Je v dnešním plánu · klepnutím odebrat", "In today's plan · tap to remove") : L("→ do dneška · pošle cíl do dnešního plánu", "→ into today · sends the goal into today's plan")}
                        aria-label={inToday ? L("Odebrat z dnešního plánu", "Remove from today's plan") : L("Poslat do dnešního plánu", "Send into today's plan")}
                        onClick={() => inToday ? st.pullGoalFromDay(g.name) : st.pushGoalToDay(g.name)}
                        style={{ background: inToday ? hexA(t.sage, 0.16) : "transparent", border: `1px solid ${inToday ? hexA(t.sage, 0.5) : t.borderSoft}`, borderRadius: "var(--tm-r-pill)", color: inToday ? t.sage : t.sand, cursor: "pointer", fontSize: 13, minWidth: 44, minHeight: 40, margin: "-6px 0", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color .2s ease, color .2s ease, background .2s ease" }}>{inToday ? "✓" : "→"}</button>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Čekající zůstávají po ruce i tehdy, když už něco běží · zvednout se
                dá kdykoliv další, ne jen dokud je prázdno. */}
            {waiting.length > 0 && (
              <div style={{ marginTop: shown.length > 0 ? 18 : 0, borderTop: `1px solid ${t.borderSoft}`, padding: "6px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ flex: 1, fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted }}>
                    {shown.length > 0 ? L("Čekají · zvedni další, kdykoliv chceš", "Waiting · lift another whenever you want") : L("Nic není v pohybu. Tyhle čekají — zvedni jeden.", "Nothing is in motion. These are waiting — lift one.")}
                  </span>
                  {waiting.length > waitN && <button onClick={() => setWaitN(waiting.length)} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12, padding: "6px 0", minHeight: 30, flexShrink: 0 }}>{L("všech", "all")} {waiting.length} ›</button>}
                </div>
                {waiting.slice(0, waitN).map((g, i) => (
                  <div key={g.name} className="tm-motionrow" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", margin: "0 -6px", borderRadius: 8, borderBottom: i < Math.min(waiting.length, waitN) - 1 ? `1px solid ${t.borderSoft}` : "none" }}>
                    <span title={PL(g.prio)} style={{ width: 8, height: 8, borderRadius: "50%", background: prioDot(g.prio), flexShrink: 0, opacity: 0.7 }} />
                    <button onClick={() => setSel({ type: "goal", id: g.name })} style={{ flex: 1, minWidth: 0, minHeight: 34, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</button>
                    <OwnerBadge g={g} />
                    <button onClick={() => st.editGoal(g.name, { status: "In progress" })} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: "var(--tm-r-pill)", color: t.sand, cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 12, minHeight: 38, padding: "0 14px", flexShrink: 0, transition: "border-color .2s ease, color .2s ease" }}>{L("zvednout", "lift")}</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => go("cile")} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "6px 0", minHeight: 30 }}>{L("všech", "all")} {live.length} {L("cílů ›", "goals ›")}</button>
        </div>
        <span style={{ display: "block", height: 30 }} />
        <Eyebrow>{L("Krajina", "The landscape")}</Eyebrow>
        {addingArea && <AddAreaForm onDone={() => setAddingArea(false)} />}
        <AreaChips onOpen={(name) => setSel({ type: "area", id: name })} onAdd={() => setAddingArea(true)} />
        <Divider />
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 12, lineHeight: 1.5, color: t.accentInk || t.accent }}>{L("Dílna", "The workshop")}</span>
          <span style={{ flex: 1 }} />
          <LinkPill icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcCile size={13} /></span>} label={L("Otevřít dílnu", "Open the workshop")} onClick={() => setDilna(true)} />
        </div>
        {dilna && (
          <CenterSheet title={L("Dílna · cíle a krajiny", "Workshop · goals and landscapes")} onClose={() => setDilna(false)}>
            <GoalWorkspace withAreas />
          </CenterSheet>
        )}
        <Drawer open={!!sel} onClose={() => setSel(null)}>
          {sel && sel.type === "goal" && <GoalDetail name={sel.id} openArea={(n) => setSel({ type: "area", id: n })} onClose={() => setSel(null)} />}
          {sel && sel.type === "area" && <AreaDetail name={sel.id} openGoal={(n) => setSel({ type: "goal", id: n })} onClose={() => setSel(null)} />}
        </Drawer>
      </>
    );
  }

  // ---- Krajiny ------------------------------------------------------------
  function PageAreas({ go }) {
    const { t } = useT();
    const st = useStore();
    const [sel, setSel] = useState(null);
    const [full, setFull] = useState(null); // {type, id} · celostránkový detail
    const [adding, setAdding] = useState(false);
    React.useEffect(() => { if (full) tmToTop(); }, [full && full.id]);
    if (full) {
      return (
        <>
          <button onClick={() => setFull(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "0 0 16px", display: "inline-flex", alignItems: "center", gap: 6 }}>{L("‹ Zpět", "‹ Back")}</button>
          {full.type === "area"
            ? <AreaDetail name={full.id} openGoal={(n) => setFull({ type: "goal", id: n })} onClose={() => setFull(null)} />
            : <GoalDetail name={full.id} wide openArea={(n) => setFull({ type: "area", id: n })} onClose={() => setFull(null)} />}
        </>
      );
    }
    return (
      <>
        {go && <button onClick={() => go("kompas")} className="tm-nav-item" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "0 8px 14px 0", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8 }}>‹ {L("Kompas", "Compass")}</button>}
        <PageTitle icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcOblasti size={34} /></span>} pageKey="oblasti" kicker={L("Kompas", "Compass")}>{L("Krajiny", "Landscapes")}</PageTitle>
        <p className="tm-prose" style={pProse(t)}>{st.listAreas().length} {L("krajin života · poslední hodnocení · splněné cíle včetně archivovaných.", "life landscapes · latest ratings · completed goals including archived.")}{st.editMode && <span style={{ color: t.textMuted }}>{L(" Klikni na krajinu a otevři detail s měsíčním hodnocením.", " Click a landscape to open its detail with monthly ratings.")}</span>}</p>
        {adding ? <AddAreaForm onDone={() => setAdding(false)} /> : (
          <button onClick={() => setAdding(true)} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: "var(--tm-r-sm)", padding: "11px 13px", minHeight: 40, cursor: "pointer", color: t.inkSand || t.sand, fontFamily: "var(--tm-font-body)", fontSize: 13, marginBottom: 12 }}>＋ {L("Nová krajina", "New landscape")}</button>
        )}
        <AreaTable onOpen={(name) => setSel({ type: "area", id: name })} />
        <Drawer open={!!sel} onClose={() => setSel(null)}>
          {sel && sel.type === "area" && <AreaDetail name={sel.id} openGoal={(n) => setSel({ type: "goal", id: n })} onClose={() => setSel(null)} onExpand={() => { setFull(sel); setSel(null); }} />}
          {sel && sel.type === "goal" && <GoalDetail name={sel.id} openArea={(n) => setSel({ type: "area", id: n })} onClose={() => setSel(null)} onExpand={() => { setFull(sel); setSel(null); }} />}
        </Drawer>
      </>
    );
  }

  // ---- Cíle ---------------------------------------------------------------
  function PageGoals({ go }) {
    const { t } = useT();
    const st = useStore();
    const live = st.allGoals().filter((g) => !g.archive);
    const nProg = live.filter((g) => g.status === "In progress").length;
    const nDone = live.filter((g) => g.status === "Completed").length;
    return (
      <>
        {go && <button onClick={() => go("kompas")} className="tm-nav-item" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 13, padding: "0 8px 14px 0", display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8 }}>‹ {L("Kompas", "Compass")}</button>}
        <PageTitle icon={<span style={{ color: t.sand, display: "inline-flex" }}><TmIcCile size={34} /></span>} pageKey="cile" kicker={L("Kompas", "Compass")}>{L("Cíle", "Goals")}</PageTitle>
        <p className="tm-prose" style={pProse(t)}>{live.length} {L("cílů", "goals")} · {nProg} {L("rozpracovaných", "in progress")} · {nDone} {L("hotových.", "done.")}{st.editMode && <span style={{ color: t.textMuted }}>{L(" Klikni na kartu a otevři detail.", " Click a card to open its detail.")}</span>}</p>
        <GoalWorkspace />
      </>
    );
  }

  return {
    AreaGlyph, OwnerBadge, GoalCard, Board, AddGoalForm, AddAreaForm, AreaChips, AreaTable,
    AreaVlq, GoalDetail, AreaDetail, GoalWorkspace, PageDivine, PageAreas, PageGoals,
  };
}
