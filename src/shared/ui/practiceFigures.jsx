import React, { useState } from "react";
import { FIGURE_NOTES, figureHasCounter, savePracticeFigure } from "../product/practiceFigures.js";
import { createOverlay } from "./overlay.jsx";
import { TmIcon } from "./icons.jsx";
import { fieldStyle, tmButton } from "./components.js";
import { FONT_DISPLAY_EN as FONT_DISPLAY } from "./type.js";

const questions = {
  symbolism: ["Symbolika", "Symbolism", "Který obraz, předmět nebo příběh k postavě patří? Co pro mě znamená?", "Which image, object or story belongs to this figure? What does it mean to me?"],
  feltQuality: ["Energie a prožitek", "Energy and felt sense", "Jakou náladu nebo tělesný pocit ve mně postava probouzí?", "What mood or bodily sensation does this figure bring to mind?"],
  principles: ["Zásady", "Principles", "Podle čeho tato postava jedná? Kdy se o to můžu opřít?", "What guides this figure’s actions? When could I draw on that?"],
  gift: ["Co mi přináší", "What it brings me", "Jakou vlastnost si chci vzít do konkrétní situace?", "Which quality could I bring to a particular situation?"],
};

function FigureForm({ figure, t, L, onSave, onCancel }) {
  const [initial] = useState(() => ({ ...figure }));
  const [values, setValues] = useState(initial);
  const change = (field, value) => setValues(previous => ({ ...previous, [field]: value }));
  const labelStyle = { display: "grid", gap: 5, color: t.text, fontSize: 14 };
  const field = { ...fieldStyle(t), boxSizing: "border-box", fontSize: 16 };
  const submit = event => {
    event.preventDefault();
    if (!values.name?.trim()) return;
    const changes = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== initial[key]));
    onSave(changes);
  };
  return <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
    <label style={labelStyle}>{L("Jméno postavy", "Figure name")}
      <input required value={values.name || ""} onChange={e => change("name", e.target.value)} style={field} />
    </label>
    {FIGURE_NOTES.map(key => {
      const [cz, en, promptCz, promptEn] = questions[key];
      return <label key={key} style={labelStyle}>{L(cz, en)}
        <textarea value={values[key] || ""} rows={2} placeholder={L(promptCz, promptEn)} onChange={e => change(key, e.target.value)} style={{ ...field, lineHeight: 1.55, resize: "vertical" }} />
      </label>;
    })}
    {figure && <label style={{ ...labelStyle, display: "flex", alignItems: "center", minHeight: 44, gap: 10 }}>
      <input type="checkbox" checked={figureHasCounter(values)} onChange={e => change("counterEnabled", e.target.checked)} />
      {L("Zobrazovat počítadlo mál", "Show mala counter")}
    </label>}
    <div style={{ display: "flex", gap: 8 }}>
      <button type="submit" className="tm-cta" disabled={!values.name?.trim()} style={tmButton(t, "primary", { disabled: !values.name?.trim() })}>{L("Uložit", "Save")}</button>
      <button type="button" onClick={onCancel} style={tmButton(t, "quiet")}>{L("Zrušit", "Cancel")}</button>
    </div>
  </form>;
}

function FigureCounter({ figure, t, L, add, enable }) {
  if (!figureHasCounter(figure)) return <button type="button" onClick={enable} style={tmButton(t, "quiet")}>
    <TmIcon id="add" size={16} />{L("Přidat počítadlo mál", "Add a mala counter")}
  </button>;
  const count = figure.count || 0;
  return <section style={{ padding: "14px 0", borderTop: `1px solid ${t.borderSoft}` }}>
    <h3 style={{ margin: "0 0 6px", fontFamily: FONT_DISPLAY, fontSize: 22 }}>{L("Počítadlo mál", "Mala counter")}</h3>
    <p style={{ margin: "0 0 10px", color: t.textMuted, fontSize: 13 }}>{L("Po dokončení 108 recitací přidej jednu málu.", "Add one mala after completing 108 recitations.")}</p>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button type="button" aria-label={L("Odečíst jednu málu", "Subtract one mala")} disabled={count === 0} onClick={() => add(-1)} style={tmButton(t, "quiet", { disabled: count === 0 })}>−</button>
      <output aria-live="polite" style={{ minWidth: 76, textAlign: "center" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 29 }}>{count}</span>
        <span style={{ display: "block", fontSize: 12, color: t.textMuted }}>{count * 108} {L("recitací", "recitations")}</span>
      </output>
      <button type="button" aria-label={L("Přidat jednu málu", "Add one mala")} onClick={() => add(1)} style={tmButton(t, "quiet")}><TmIcon id="add" size={17} /></button>
    </div>
  </section>;
}

export function createPracticeFiguresUI({ useT, useStore, L, uid }) {
  const { CenterSheet } = createOverlay(useT, L);
  return function PracticeFigures() {
    const { t } = useT();
    const st = useStore();
    const figures = st.malaList();
    const [active, setActive] = useState(null);
    const [editing, setEditing] = useState(false);
    const figure = active && figures.find(item => item.id === active.id);
    const title = L("Postavy mé praxe", "Figures of my practice");
    const open = (id, create = false) => { setActive({ id, create }); setEditing(create); };
    const close = () => { setActive(null); setEditing(false); };
    const persist = changes => {
      const defaults = st.coll.mala == null ? figures : [];
      st.persistColl(coll => savePracticeFigure(coll, defaults, active.id, changes, active.create));
    };
    const save = changes => { persist(changes); open(active.id); };
    return <section style={{ marginTop: 28, maxWidth: 620, marginInline: "auto" }}>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 28, color: t.heading, margin: "0 0 6px" }}>{title}</h2>
      <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.55, margin: "0 0 14px" }}>{L("Vyber si božstvo, archetyp, světce nebo postavu z příběhu, která tě provází.", "Choose a deity, archetype, saint or character from a story that accompanies you.")}</p>
      {figures.map(item => <button key={item.id} type="button" aria-haspopup="dialog" onClick={() => open(item.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%", minHeight: 48, padding: "8px 2px", border: 0, borderBottom: `1px solid ${t.borderSoft}`, background: "transparent", color: t.heading, fontFamily: FONT_DISPLAY, fontSize: 22, textAlign: "start", cursor: "pointer", overflowWrap: "anywhere" }}>
        {item.name}<TmIcon id="forward" size={16} />
      </button>)}
      <button type="button" aria-haspopup="dialog" onClick={() => open(uid() + "d", true)} style={{ ...tmButton(t, "quiet"), marginTop: 14 }}>
        <TmIcon id="add" size={15} />{L("Přidat postavu", "Add a figure")}
      </button>
      {active && (active.create || figure) && <CenterSheet title={title} onClose={close}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 30, lineHeight: 1.15, overflowWrap: "anywhere", color: t.heading, margin: "0 0 18px" }}>{active.create ? L("Nová postava", "New figure") : figure.name}</h2>
        {editing ? <FigureForm key={active.id} figure={figure} t={t} L={L} onSave={save} onCancel={() => active.create ? close() : setEditing(false)} /> : <>
          <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
            {FIGURE_NOTES.map(key => {
              const [cz, en, promptCz, promptEn] = questions[key];
              return <div key={key}>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, margin: "0 0 3px", color: t.heading }}>{L(cz, en)}</h3>
                <p style={{ color: figure[key] ? t.text : t.textMuted, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{figure[key] || L(promptCz, promptEn)}</p>
              </div>;
            })}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <button type="button" onClick={() => setEditing(true)} style={tmButton(t, "quiet")}>{L("Upravit postavu", "Edit figure")}</button>
            {st.editMode && <button type="button" style={tmButton(t, "ghost")} onClick={() => st.ask(
              L(`Odebrat postavu „${figure.name}“ včetně poznámek a počtu recitací?`, `Remove “${figure.name}”, its notes and its count?`),
              () => { st.malaRemoveDeity(figure.id); close(); }
            )}>{L("Odebrat postavu", "Remove figure")}</button>}
          </div>
          <FigureCounter figure={figure} t={t} L={L} add={delta => st.malaAdd(figure.id, delta)} enable={() => persist({ counterEnabled: true })} />
        </>}
      </CenterSheet>}
    </section>;
  };
}
