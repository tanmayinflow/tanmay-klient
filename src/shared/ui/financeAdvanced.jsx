import React,{useState} from 'react';
import {TmIcon as FamilyIcon} from './icons.jsx';
import {FONT_BODY,FONT_TAG} from './type.js';
import {hexA} from './color.js';
import {FINANCE_JARS,financeNumber,financeTaxParameters,financeObligations,finParse,finAddDays,finDiffDays,finDayInMonth,financePaymentOccurrences} from '../product/financeAdvanced.js';
import {financeDate} from '../product/financeFlow.js';
const FONT_DISPLAY='var(--tm-font-display)';
export function createFinanceAdvanced({useT,useStore,L,LV,Select,ProgressBar,Callout,BufferedInput,fieldStyle,subLabel,metaLabel,useHoldReorder,uid,todayISO,money,InvestmentPortfolio,defaults={}}){
const JARS=FINANCE_JARS.map(code=>[code,code,defaults.jarPct?.[code]??0]);
const JAR_NAZEV=code=>({NEC:L('Běžné výdaje','Essentials'),FFA:L('Investice','Investing'),LTSS:L('Dlouhodobé cíle','Long-term goals'),EDU:L('Vzdělávání','Education'),PLAY:L('Radost','Joy'),GIVE:L('Dávání','Giving')}[code]||code);
const finSum=rows=>rows.reduce((sum,row)=>sum+financeNumber(row.amount),0);
const finMonthKey=value=>financeDate(value).slice(0,7);
const finShortDate=iso=>{const date=financeDate(iso);return date?Number(date.slice(8))+'. '+Number(date.slice(5,7))+'.':String(iso||'');};
const MONTHS_CZ=()=>L(['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec'],['January','February','March','April','May','June','July','August','September','October','November','December']);
const MONTHS_GEN=()=>L(['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'],MONTHS_CZ());
const finLongDate=iso=>{const d=finParse(iso),m=MONTHS_GEN()[d.getMonth()];return L(d.getDate()+'. '+m,d.getDate()+' '+m);};
const finPlural=(n,a,b,c)=>n===1?a:n>=2&&n<=4?b:c;
const numTab={fontVariantNumeric:'tabular-nums'};
const JarIcon=({size=19})=><FamilyIcon id="jar" size={size}/>;
const SproutIcon=({size=19})=><FamilyIcon id="sprout" size={size}/>;
const ArrowOutIcon=({size=19})=><FamilyIcon id="arrow-out" size={size}/>;
const TmIcHospodareni=({size=19})=><FamilyIcon id="stewardship" size={size}/>;
function useFinObligations(){const st=useStore();return financeObligations(st.coll,todayISO(),defaults.tax);}
const businessTemplates=pausal=>defaults.businessTemplates?defaults.businessTemplates(pausal):(pausal?[["paus",L("Paušální daň","Flat-rate tax"),"month"]]:[["zp",L("Zdravotní pojištění · záloha","Health insurance · advance"),"month"],["sp",L("Sociální pojištění · záloha","Social insurance · advance"),"month"]]).concat([["dp",L("Daňové přiznání","Tax return"),"year"],["preh",L("Roční přehledy","Annual statements"),"year"],["dopl",L("Doplatky pojistného","Insurance balancing payment"),"year"],["zal6",L("Záloha na daň · první","Tax advance · first"),"year"],["zal12",L("Záloha na daň · druhá","Tax advance · second"),"year"]]).map(([key,name,freq])=>({key,name,freq,amount:0,day:Number(todayISO().slice(8)),month:Number(todayISO().slice(5,7)),estimate:true,note:L("Doplň vlastní částku a splatnost.","Set your own amount and due date.")}));
function Jars({ month }) {
  const { t } = useT();
  const st = useStore();
  const [editing,setEditing]=useState(false);
  const em = st.editMode||editing;
  const pctCfg = (st.coll.finCfg || {}).jarPct || {};
  const pctOf = (code, dflt) => (pctCfg[code] != null ? pctCfg[code] : dflt);
  const inMonth = (r) => finMonthKey(r.date) === month;
  const income = finSum((st.coll.income || []).filter(inMonth));
  const expenses = (st.coll.expenses || []).filter(inMonth);
  const sumPct = JARS.reduce((s, [c, , d]) => s + (parseFloat(pctOf(c, d)) || 0), 0);
  const setPct = (code, v) => st.setFinCfg({ jarPct: { ...pctCfg, [code]: Math.max(0, Math.min(100, parseFloat(v) || 0)) } });
  return (
    <div>
      <button type="button" onClick={()=>setEditing(value=>!value)} style={finTag(t,em)}>{em?L("Hotovo","Done"):L("Upravit rozdělení","Edit allocation")}</button>
      {JARS.map(([code, _name, dfltPct]) => {
        const pct = pctOf(code, dfltPct);
        const alloc = (income * pct) / 100;
        const spent = finSum(expenses.filter((e) => e.jar === code));
        const frac = alloc > 0 ? Math.min(1, spent / alloc) : (spent > 0 ? 1 : 0);
        const over = alloc > 0 && spent > alloc;
        return (
          <div key={code} data-tm-surface="row" data-tm-surface-active={!!(em || over)} data-tm-surface-editor={!!em} style={{ padding: "10px 0", borderBottom: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "2px 10px", marginBottom: 5 }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text }}>
                <b style={{ color: t.accent, fontFamily: FONT_TAG, letterSpacing: "0.05em" }}>{code}</b> · {JAR_NAZEV(code)}{" "}
                {em
                  ? <span style={{ whiteSpace: "nowrap" }}><input type="number" value={pct} onChange={(e) => setPct(code, e.target.value)} style={{ ...fieldStyle(t), width: 52, padding: "6px 8px", minHeight: 30, fontSize: 12, textAlign: "right" }} /><span style={{ color: t.textMuted, fontSize: 12 }}> %</span></span>
                  : <span style={{ color: t.textMuted, fontSize: 12 }}>{pct}%</span>}
              </span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: over ? t.accent : t.textSec }}>{money(spent)} / {money(alloc)}{over && L(" · přes limit", " · over limit")}</span>
            </div>
            <ProgressBar value={frac} />
          </div>
        );
      })}
      {em && sumPct !== 100 && <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.accent, marginTop: 8 }}>{L("Součet sklenic je", "Jars add up to")} {sumPct} % — {L("má být 100 %.", "should be 100 %.")}</p>}
      {income === 0 && <p style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted, marginTop: 10 }}>{L("Přidej příjem za tento měsíc a sklenice se rozpočítají.", "Add this month's income and the jars will be allocated.")}</p>}
    </div>
  );
}

function WishRow({ r, buy, letGo }) {
  const { t } = useT();
  const st = useStore();
  const rootRef = React.useRef(null);
  const [over, setOver] = useState(false);
  const onOverRef = React.useRef(null);
  onOverRef.current = (overId) => st.reorderEntry("wishlist", r.id, overId);
  const dragging = useHoldReorder(rootRef, r.id, "data-wish", onOverRef, null);
  const [noteVal, setNoteVal] = useState(r.note || "");
  React.useEffect(() => { setNoteVal(r.note || ""); }, [r.id]);
  const days = Math.max(0, Math.floor((Date.now() - new Date(r.date + "T00:00:00").getTime()) / 86400000));
  const ripe = days >= 30;
  // Motivuje vždycky ta menší plocha · do dozrání zbývá málo, tak se
  // ukazuje zbytek, ne kolik už uplynulo
  const zbyvaDni = Math.max(0, 30 - days);
  const need = r.need === "need";
  const saved = (r.note || "").trim();
  const isUrl = /^https?:\/\/\S+$/i.test(saved);
  return (
    <div
      ref={rootRef}
      data-wish={r.id}
      data-tm-surface="row"
      data-tm-surface-active={!!(dragging || over || ripe)}
      data-tm-surface-editor={noteVal !== (r.note || "")}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", "wish:" + r.id); e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const d = (e.dataTransfer.getData("text/plain") || "").split(":"); if (d[0] === "wish" && d[1] && d[1] !== r.id) st.reorderEntry("wishlist", d[1], r.id); }}
      style={{ padding: "10px 6px 10px 2px", borderBottom: `1px solid ${t.borderSoft}`, borderRadius: dragging || over ? 8 : 0, background: dragging ? hexA(t.accent, 0.08) : over ? t.card : "transparent", boxShadow: dragging ? "0 8px 22px rgba(0,0,0,0.26)" : "none", transition: "background .12s ease", userSelect: dragging ? "none" : "auto" }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap", marginBottom: 5 }}>
        <span title={L("Podrž a přetáhni pro pořadí", "Hold and drag to reorder")} style={{ color: t.textMuted, cursor: "grab", fontSize: 13, alignSelf: "center", flexShrink: 0, opacity: 0.6 }}><FamilyIcon id="drag" size={16} label={L("Přesunout","Move")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flex: 1, minWidth: 110 }}>
          {r.item}
          {r.cat && <span style={{ marginLeft: 7, fontFamily: FONT_TAG, letterSpacing: "0.06em", fontSize: 12, color: t.sage, border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: "1px 7px", textTransform: "uppercase", verticalAlign: "1px" }}>{r.cat}</span>}
        </span>
        <button onClick={() => st.updateEntry("wishlist", r.id, { need: need ? "want" : "need" })} title={need ? L("Potřeba — klikni pro Chci", "Need — click for Want") : L("Chci — klikni pro Potřeba", "Want — click for Need")} style={{ background: need ? hexA(t.accent, 0.14) : "transparent", border: `1px solid ${need ? t.accent : t.borderSoft}`, borderRadius: 12, padding: "2px 10px", cursor: "pointer", color: need ? t.accent : t.textMuted, fontFamily: FONT_TAG, letterSpacing: "0.07em", fontSize: 12, textTransform: "uppercase" }}>{need ? L("potřeba", "need") : L("chci", "want")}</button>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec }}>{money(r.amount)}</span>
        <span style={{ fontFamily: FONT_TAG, letterSpacing: "0.08em", fontSize: 12, color: ripe ? t.accent : t.textMuted, textTransform: "uppercase" }}>{ripe ? L("dozráno", "ripe") : L("zbývá " + zbyvaDni + " " + finPlural(zbyvaDni, "den", "dny", "dní"), zbyvaDni + (zbyvaDni === 1 ? " day" : " days") + " left")}</span>
        <button onClick={() => letGo(r)} title={L("Do koše", "To trash")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 13, padding: 0, lineHeight: 1, flexShrink: 0 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      </div>
      <ProgressBar value={Math.min(1, days / 30)} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
        <input value={noteVal} onChange={(e) => setNoteVal(e.target.value)} onBlur={() => { if (noteVal !== (r.note || "")) st.updateEntry("wishlist", r.id, { note: noteVal }); }} placeholder={L("odkaz nebo poznámka…", "link or note…")} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: `1px solid transparent`, color: t.textSec, fontFamily: FONT_BODY, fontSize: 12, outline: "none", padding: "2px 0" }} />
        {isUrl && <a href={saved} target="_blank" rel="noopener noreferrer" title={L("Otevřít odkaz", "Open link")} style={{ color: t.accent, textDecoration: "none", fontSize: 13, flexShrink: 0 }}><FamilyIcon id="arrow-out" size={16} label={L("Otevřít","Open")} style={{ display: "inline-block", verticalAlign: "middle" }} /></a>}
      </div>
      {ripe && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 13, color: t.sand }}>{L("Pořád to chceš?", "Still want it?")}</span>
          <button onClick={() => buy(r)} style={{ background: "transparent", border: `1px solid ${t.accent}`, borderRadius: 12, padding: "3px 13px", cursor: "pointer", color: t.accent, fontFamily: FONT_BODY, fontSize: 12 }}>Koupit</button>
          <button onClick={() => letGo(r)} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "3px 13px", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>Pustit</button>
        </div>
      )}
    </div>
  );
}

// ---- Wishlist · the 30-day rule against impulse buying ----
const WISH_CATS = ["Style", "Tech", "Gifts", "Domov", "Praxe"];
function Wishlist() {
  const { t } = useT();
  const st = useStore();
  const rows = st.coll.wishlist || [];
  const cfg = st.coll.finCfg || {};
  const cats = [...WISH_CATS, ...(cfg.wishCats || [])];
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState(cfg.lastWishCat && cats.includes(cfg.lastWishCat) ? cfg.lastWishCat : cats[0]);
  const [view, setView] = useState("Vše");
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState("");
  const add = () => {
    const v = item.trim();
    if (!v) return;
    st.addEntry("wishlist", { id: uid(), date: todayISO(), item: v, amount: parseFloat(amount) || 0, cat });
    st.setFinCfg({ lastWishCat: cat });
    setItem(""); setAmount("");
  };
  const saveCat = () => {
    const v = newCat.trim();
    if (!v || cats.some((c) => c.toLowerCase() === v.toLowerCase())) { setAddingCat(false); setNewCat(""); return; }
    st.setFinCfg({ wishCats: [...(cfg.wishCats || []), v] });
    setCat(v); setAddingCat(false); setNewCat("");
  };
  const buy = (r) => st.ask(L(`Koupit „${r.item}" za ${money(r.amount)}? Zapíše se jako dnešní výdaj (PLAY).`, `Buy "${r.item}" for ${money(r.amount)}? It will be logged as today's expense (PLAY).`), () => {
    st.addEntry("expenses", { id: uid(), date: todayISO(), item: r.item, jar: "PLAY", amount: r.amount });
    st.removeEntry("wishlist", r.id);
  });
  const letGo = (r) => st.ask(`Pustit „${r.item}"?`, () => st.removeEntry("wishlist", r.id));
  const counts = { "Vše": rows.length };
  cats.forEach((c) => { counts[c] = rows.filter((r) => r.cat === c).length; });
  const shown = [...rows].filter((r) => view === "Vše" || r.cat === view); // manual order (drag to reorder)
  const chip = (active) => ({ background: active ? hexA(t.accent, 0.14) : "transparent", border: `1px solid ${active ? t.accent : t.borderSoft}`, borderRadius: 12, padding: "7px 12px", minHeight: 32, cursor: "pointer", color: active ? (t.accentInk || t.accent) : t.textMuted, fontFamily: FONT_TAG, letterSpacing: "0.08em", fontSize: 12, textTransform: "uppercase" });
  return (
    <Callout icon={<span style={{ color: t.sand, display: "inline-flex" }}><SproutIcon size={20} /></span>} title={L("Zrání · pravidlo třiceti dnů", "Ripening · the thirty-day rule")}>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, margin: "0 0 10px", lineHeight: 1.6 }}>{L("Impuls sem, ne do košíku — přání zraje třicet dní.", "The impulse goes here, not in the cart — a wish ripens for thirty days.")}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <input value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder={L("Co tě láká…", "What tempts you…")} style={{ ...fieldStyle(t), flex: "1 1 150px", minWidth: 130 }} />
        <input type="number" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="Kč" style={{ ...fieldStyle(t), width: 96 }} />
        {item.trim() && <button onClick={add} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 13 }}>Zasadit</button>}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} style={chip(cat === c)}>{LV(c)}</button>)}
        {st.editMode && (addingCat
          ? <span style={{ display: "inline-flex", gap: 5 }}>
              <input autoFocus value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveCat(); if (e.key === "Escape") { setAddingCat(false); setNewCat(""); } }} placeholder={L("nová…", "new…")} style={{ ...fieldStyle(t), width: 92, padding: "2px 8px", fontSize: 12 }} />
              <button onClick={saveCat} style={chip(true)}>ok</button>
            </span>
          : <button title={L("Přidat kategorii", "Add category")} onClick={() => setAddingCat(true)} style={{ ...chip(false), borderStyle: "solid", borderColor: "transparent" }}><FamilyIcon id="add" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>)}
      </div>
      {rows.length > 0 && (
        <div className="tm-tab-rail" style={{ display: "flex", gap: 2, flexWrap: "wrap", borderBottom: `1px solid ${t.borderSoft}`, marginBottom: 6 }}>
          {["Vše", ...cats.filter((c) => counts[c] > 0)].map((c) => (
            <button key={c} onClick={() => setView(c)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px 9px 7px", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: view === c ? t.accent : t.textMuted, borderBottom: view === c ? `2px solid ${t.accent}` : "2px solid transparent", marginBottom: -1 }}>
              {LV(c)}<span style={{ marginLeft: 4, opacity: 0.6, fontSize: 12 }}>{counts[c] || 0}</span>
            </button>
          ))}
        </div>
      )}
      {shown.length === 0 && <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: t.textMuted }}>Nic tu nezraje.</div>}
      {shown.map((r) => <WishRow key={r.id} r={r} buy={buy} letGo={letGo} />)}
    </Callout>
  );
}

function FinNum({ value, onCommit, width = 104, suffix = "Kč", placeholder }) {
  const { t } = useT();
  const [v, setV] = useState(value == null || value === "" ? "" : String(value));
  React.useEffect(() => { setV(value == null || value === "" ? "" : String(value)); }, [value]);
  const commit = () => { const n = parseFloat(String(v).replace(",", ".")); onCommit(isNaN(n) ? 0 : n); };
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap" }}>
      <input type="number" inputMode="decimal" value={v} placeholder={placeholder}
        onChange={(e) => setV(e.target.value)} onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
        style={{ ...fieldStyle(t), ...numTab, width, textAlign: "right", padding: "5px 8px", fontSize: 13 }} />
      {suffix ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{suffix}</span> : null}
    </span>
  );
}

// jemné, nekřiklavé návěstí · v této místnosti nesmí být poplach
const finTag = (t, on) => ({ background: "transparent", cursor: "pointer", fontFamily: FONT_TAG, letterSpacing: "0.08em", fontSize: 12, textTransform: "uppercase", color: on ? t.accent : t.textMuted, border: `1px solid ${on ? hexA(t.accent, 0.55) : t.borderSoft}`, borderRadius: 10, padding: "2px 9px", whiteSpace: "nowrap" });

/* ODDÍL. Hlavička nese souhrn, takže zavřený oddíl pořád něco říká —
   „4 dluhy · 20 500 Kč tento měsíc" je celá zpráva, kterou o dluzích
   potřebuju při běžném otevření místnosti. Otevírat je nutné jen tehdy,
   když s tím chci něco dělat. Co je otevřené, si aplikace pamatuje. */
function FinOddil({ id, ikona, titul, souhrn, vychozi, children }) {
  const { t } = useT();
  const st = useStore();
  const cfg = st.coll.finCfg || {};
  const ulozeno = (cfg.open || {})[id];
  const open = ulozeno == null ? !!vychozi : !!ulozeno;
  const flip = () => st.setFinCfg({ open: { ...(cfg.open || {}), [id]: !open } });
  return (
    <div style={{ borderRadius: 10, background: open ? t.card : "transparent", border: `1px solid ${t.borderSoft}`, margin: "10px 0", overflow: "hidden", boxShadow: open ? t.shadow : "none", transition: "background .2s ease, border-color .2s ease" }}>
      <button onClick={flip} className="tm-nav-item" style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "12px 15px", display: "flex", alignItems: "center", gap: 11, minHeight: 52 }}>
        <span style={{ color: t.sand, display: "inline-flex", flexShrink: 0 }}>{ikona}</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 19, color: t.heading, flexShrink: 0, lineHeight: 1.25 }}>{titul}</span>
        <span style={{ flex: 1, minWidth: 0, textAlign: "right", fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...numTab }}>{open ? "" : souhrn}</span>
        <span style={{ color: t.textMuted, fontSize: 13, flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s ease", display: "inline-block" }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
      </button>
      {open && <div style={{ padding: "0 15px 15px", animation: "tmUnfold .3s cubic-bezier(.23,.62,.22,.99) both" }}>{children}</div>}
    </div>
  );
}

function FinCoverage() {
  const { t } = useT();
  const st = useStore();
  const o = useFinObligations();
  const [otevreno, setOtevreno] = useState(false);
  // Než ví, kolik má po ruce, nemá co počítat — a nula dní by byla zbytečně
  // tvrdá věta o něčem, na co jsem se ještě nezeptal.
  const cekaNaUdaj = o.liquid <= 0 || o.zavazky <= 0;
  const kdy = !cekaNaUdaj ? finAddDays(todayISO(), o.dnu) : null;
  const dlouho = !cekaNaUdaj && o.dnu >= 400;
  const vMesicich = !cekaNaUdaj && o.dnu >= 62 && !dlouho;
  const hlavni = cekaNaUdaj ? "—" : dlouho ? "· · ·" : vMesicich ? (Math.round(o.dnu / 30.44 * 10) / 10).toLocaleString("cs-CZ") : String(o.dnu);
  const jednotka = cekaNaUdaj || dlouho ? "" : vMesicich ? L("měsíce", "months") : L("dní", "days");
  // Rámečková dieta · skupinu drží vlas a vzduch, ne karta se stínem.
  return (
    <div style={{ borderLeft: `2px solid ${hexA(t.accent, 0.5)}`, padding: "2px 0 2px 14px", margin: "16px 0 18px" }}>
      <div style={{ ...subLabel(t), marginBottom: 10 }}>{L("Krytí", "Coverage")}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 46, lineHeight: 1, color: t.heading, ...numTab }}>{hlavni}</span>
        {jednotka ? <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.sand }}>{jednotka}</span> : null}
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 17, color: t.sand, marginTop: 8 }}>
        {o.zavazky <= 0
          ? L("Zatím není z čeho počítat.", "Nothing to compute from yet.")
          : o.liquid <= 0
            ? L("Napiš, kolik máš po ruce.", "Enter how much you have on hand.")
            : dlouho
              ? L("Kryto na víc než rok dopředu.", "Covered more than a year ahead.")
              : L("Pokryto do ", "Covered until ") + finLongDate(kdy)}
      </div>
      <div style={{ display: "flex", gap: "8px 18px", flexWrap: "wrap", alignItems: "center", marginTop: 12 }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, display: "inline-flex", alignItems: "baseline", gap: 7 }}>
          <span style={metaLabel(t)}>{L("po ruce", "on hand")}</span>
          <FinNum value={o.cfg.liquid || ""} placeholder="0" onCommit={(n) => st.setFinCfg({ liquid: n, liquidAt: todayISO() })} width={112} />
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, ...numTab }}>
          <span style={{ ...metaLabel(t), marginRight: 7 }}>{L("měsíčně nutné", "monthly due")}</span>{money(o.zavazky)}
        </span>
      </div>
      <button onClick={() => setOtevreno(!otevreno)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "10px 0 0", color: t.textMuted, fontFamily: FONT_TAG, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12 }}>
        {otevreno ? "⌃ " : "⌄ "}{L("z čeho se to skládá", "what makes it up")}
      </button>
      {otevreno && (
        <div style={{ marginTop: 8, paddingTop: 10, borderTop: `1px solid ${t.borderSoft}`, display: "grid", gap: 5 }}>
          {[[L("pravidelné platby", "recurring payments"), o.mesicniPlatby], [L("splátky dluhů", "debt payments"), o.splatky], [L("rezerva na daně a pojistné", "tax and insurance reserve"), o.rezerva]].map((par) => (
            <div key={par[0]} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontFamily: FONT_BODY, fontSize: 12, color: t.textSec }}>
              <span>{par[0]}</span><span style={numTab}>{money(par[1])}</span>
            </div>
          ))}
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, lineHeight: 1.6, margin: "8px 0 0" }}>
            {L("Krytí vychází ze zadané dostupné částky a měsíčních závazků. Mění se spolu s těmito údaji.","Coverage is based on the available amount and monthly obligations you entered. It changes with those inputs.")}
          </p>
        </div>
      )}
    </div>
  );
}

// ---- CO DLUŽÍM ---------------------------------------------------------
// Hlavička nese počet a „tento měsíc", ne velký součet. Pořadí je dané
// a viditelné. Soustředění na jeden dluh je to, co v datech skutečně
// funguje — ne volba metody splácení.
const finDebtOrder = (list) => {
  const arr = [...list].sort((a, b) => (Number(a.balance) || 0) - (Number(b.balance) || 0));
  if (arr.length < 2) return arr;
  const prvni = arr[0];
  const drahy = arr.find((d) => (Number(d.rate) || 0) >= (Number(prvni.rate) || 0) + 10);
  if (drahy && drahy !== prvni) return [drahy, ...arr.filter((d) => d !== drahy)];
  return arr;
};

function DebtRow({ r, focus, duvod, onPay }) {
  const { t } = useT();
  const st = useStore();
  const [edit, setEdit] = useState(false);
  const [platba, setPlatba] = useState(false);
  const [castka, setCastka] = useState("");
  const principal = Number(r.principal) || 0;
  const balance = Math.max(0, Number(r.balance) || 0);
  const splaceno = Math.max(0, principal - balance);
  const frac = principal > 0 ? Math.min(1, splaceno / principal) : 0;
  const pct = Math.round(frac * 100);
  // Pod polovinou motivuje, co je za mnou; nad polovinou to, co zbývá.
  // Pozornost patří vždy té menší ploše.
  const veta = frac < 0.5
    ? L("splaceno ", "paid so far ") + money(splaceno)
    : L("zbývá ", "left to pay ") + money(balance);
  const potvrd = () => {
    const a = parseFloat(String(castka).replace(",", ".")) || Number(r.monthly) || 0;
    if (a > 0) onPay(r, a);
    setPlatba(false); setCastka("");
  };
  const ram = focus
    ? { background: hexA(t.accent, 0.05), borderRadius: 8, padding: "11px 10px 12px", margin: "0 -10px" }
    : { background: "transparent", borderRadius: 0, padding: "11px 2px 12px", margin: "0px" };
  return (
    <div data-tm-surface="row" data-tm-surface-active={!!(focus || edit || platba || r.settled)} data-tm-surface-editor={!!(edit || platba)} style={{ ...ram, borderBottom: `1px solid ${t.borderSoft}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.text, flex: 1, minWidth: 120 }}>{r.name || L("beze jména", "unnamed")}</span>
        {focus ? <span style={{ ...finTag(t, true), cursor: "default" }}>{L("soustředím se", "focus")}</span> : <span style={metaLabel(t)}>{L("jen minimum", "minimum only")}</span>}
        <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.heading, ...numTab }}>{money(balance)}</span>
      </div>
      <div style={{ margin: "7px 0 5px" }}><ProgressBar value={frac} /></div>
      <div style={{ display: "flex", gap: "3px 12px", flexWrap: "wrap", alignItems: "baseline", fontFamily: FONT_BODY, fontSize: 12, color: t.textSec }}>
        <span style={numTab}>{pct} %{L(" z původní částky", " of the original")}</span>
        <span style={numTab}>{veta}</span>
        {Number(r.monthly) > 0 ? <span style={numTab}>{money(r.monthly)}{L(" každý ", " every ")}{r.dueDay || 1}.</span> : null}
        {Number(r.rate) > 0 ? <span style={numTab}>{String(r.rate).replace(".", ",")} %</span> : null}
      </div>
      {focus && duvod ? <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 13, color: t.sand, marginTop: 6 }}>{duvod}</div> : null}
      <div style={{ display: "flex", gap: 7, marginTop: 9, flexWrap: "wrap", alignItems: "center" }}>
        {platba ? (
          <>
            <FinNum value={castka === "" ? (r.monthly || "") : castka} onCommit={(n) => setCastka(String(n))} width={104} />
            <button onClick={potvrd} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 12, padding: "4px 14px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12 }}>{L("Zapsat", "Record")}</button>
            <button onClick={() => { setPlatba(false); setCastka(""); }} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "4px 12px", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Zpět", "Back")}</button>
          </>
        ) : (
          <button onClick={() => setPlatba(true)} style={{ background: "transparent", border: `1px solid ${t.accent}`, borderRadius: 12, padding: "4px 13px", cursor: "pointer", color: t.accent, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Splátka", "Payment")}</button>
        )}
        <button onClick={() => setEdit(!edit)} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "4px 12px", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{edit ? L("Hotovo", "Done") : L("Upravit", "Edit")}</button>
      </div>
      {edit && (
        <div style={{ display: "grid", gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid transparent` }}>
          <input value={r.name || ""} onChange={(e) => st.updateEntry("debts", r.id, { name: e.target.value })} placeholder={L("Komu a za co", "To whom and for what")} style={{ ...fieldStyle(t), padding: "6px 9px" }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
            <span style={metaLabel(t)}>{L("původně", "original")}</span>
            <FinNum value={r.principal || ""} onCommit={(n) => st.updateEntry("debts", r.id, { principal: n })} />
            <span style={metaLabel(t)}>{L("zbývá", "balance")}</span>
            <FinNum value={r.balance || ""} onCommit={(n) => st.updateEntry("debts", r.id, { balance: n })} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
            <span style={metaLabel(t)}>{L("měsíčně", "monthly")}</span>
            <FinNum value={r.monthly || ""} onCommit={(n) => st.updateEntry("debts", r.id, { monthly: n })} width={92} />
            <span style={metaLabel(t)}>{L("splatnost", "due day")}</span>
            <FinNum value={r.dueDay || ""} suffix="." onCommit={(n) => st.updateEntry("debts", r.id, { dueDay: Math.min(31, Math.max(1, Math.round(n) || 1)) })} width={54} />
            <span style={metaLabel(t)}>{L("úrok", "rate")}</span>
            <FinNum value={r.rate || ""} suffix="%" onCommit={(n) => st.updateEntry("debts", r.id, { rate: n })} width={64} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
            <span style={metaLabel(t)}>{L("zaplaceno na úrocích", "interest paid so far")}</span>
            <FinNum value={r.interestPaid || ""} onCommit={(n) => st.updateEntry("debts", r.id, { interestPaid: n })} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => st.updateEntry("debts", r.id, { settled: !r.settled, settledDate: r.settled ? null : todayISO() })} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "4px 12px", cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 12 }}>{r.settled ? L("Vrátit mezi otevřené", "Reopen") : L("Označit jako splacené", "Mark settled")}</button>
            <button onClick={() => st.ask(L("Smazat „" + (r.name || "—") + "\"?", "Delete \"" + (r.name || "—") + "\"?"), () => st.removeEntry("debts", r.id))} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Smazat", "Delete")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FinDebts() {
  const { t } = useT();
  const st = useStore();
  const vse = st.coll.debts || [];
  const otevrene = vse.filter((d) => d.dir !== "owed" && !d.settled);
  const splacene = vse.filter((d) => d.dir !== "owed" && d.settled);
  const pujcene = vse.filter((d) => d.dir === "owed");
  const [openSettled, setOpenSettled] = useState(false);
  const [openLent, setOpenLent] = useState(false);
  const [zprava, setZprava] = useState("");
  const poradi = finDebtOrder(otevrene);
  const focus = poradi[0];
  const nejmensi = [...otevrene].sort((a, b) => (Number(a.balance) || 0) - (Number(b.balance) || 0))[0];
  const duvod = focus ? (focus === nejmensi ? L("první, protože je nejmenší", "first, because it's the smallest") : L("první, protože je nejdražší", "first, because it's the most expensive")) : "";
  const tentoMesic = otevrene.reduce((s, d) => s + (Number(d.monthly) || 0), 0);
  const celkem = otevrene.reduce((s, d) => s + (Number(d.balance) || 0), 0);
  const uroky = vse.reduce((s, d) => s + (Number(d.interestPaid) || 0), 0);
  const pridej = (dir) => st.addEntry("debts", { id: uid(), dir, name: "", principal: 0, balance: 0, monthly: 0, dueDay: 15, rate: 0, interestPaid: 0 });
  // Po splacení přichází útlum, ne vrchol — proto žádná oslava, jen tiché
  // přesunutí pozornosti na další v pořadí.
  const zaplat = (r, a) => {
    const zbytek = Math.max(0, (Number(r.balance) || 0) - a);
    st.updateEntry("debts", r.id, { balance: zbytek, settled: zbytek === 0 ? true : r.settled, settledDate: zbytek === 0 ? todayISO() : r.settledDate });
    st.addEntry("expenses", { id: uid(), date: todayISO(), item: r.name || L("splátka", "payment"), jar: "NEC", amount: a });
    if (zbytek === 0) {
      const dalsi = finDebtOrder(otevrene.filter((d) => d.id !== r.id))[0];
      setZprava(L("Splaceno. Další v pořadí: ", "Settled. Next in line: ") + (dalsi ? (dalsi.name || L("beze jména", "unnamed")) : L("nic dalšího.", "nothing else.")));
    } else setZprava("");
  };
  const pocet = otevrene.length;
  const souhrn = pocet === 0
    ? L("nic otevřeného", "nothing open")
    : pocet + " " + L(finPlural(pocet, "dluh", "dluhy", "dluhů"), pocet === 1 ? "debt" : "debts") + " · " + money(tentoMesic) + " " + L("tento měsíc", "this month");
  return (
    <FinOddil id="dluhy" ikona={<ArrowOutIcon size={19} />} titul={L("Co dlužím", "What I owe")} souhrn={souhrn}>
      <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.textSec, margin: "0 0 12px", ...numTab }}>
        {pocet === 0
          ? L("Nic otevřeného.", "Nothing open.")
          : <>{pocet}&nbsp;{L(finPlural(pocet, "dluh", "dluhy", "dluhů"), pocet === 1 ? "debt" : "debts")} · <b style={{ color: t.heading, fontWeight: 500 }}>{money(tentoMesic)}</b> {L("tento měsíc", "this month")}</>}
      </div>
      {poradi.map((r) => <DebtRow key={r.id} r={r} focus={r === focus} duvod={duvod} onPay={zaplat} />)}
      {zprava ? <div style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 15, color: t.sand, marginTop: 10 }}>{zprava}</div> : null}
      {pocet > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 12, paddingTop: 9, borderTop: `1px solid ${t.borderSoft}`, fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, ...numTab }}>
          <span>{L("celkem otevřeno ", "total outstanding ")}{money(celkem)}</span>
          {uroky > 0 ? <span>{L("na úrocích zaplaceno ", "interest paid to date ")}{money(uroky)}</span> : null}
        </div>
      )}
      <button onClick={() => pridej("owe")} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "8px 13px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 13, marginTop: 12 }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Přidat dluh", "Add a debt")}</button>

      {splacene.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <button onClick={() => setOpenSettled(!openSettled)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: t.sage, fontFamily: FONT_TAG, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}>
            {openSettled ? "⌃ " : "⌄ "}{splacene.length} {L("splaceno", "settled")}
          </button>
          {openSettled && splacene.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 2px", borderBottom: `1px solid ${t.borderSoft}`, fontFamily: FONT_BODY, fontSize: 13, color: t.textMuted }}>
              <span>{r.name || L("beze jména", "unnamed")}</span>
              <span style={{ display: "inline-flex", gap: 10, alignItems: "baseline" }}>
                <span style={numTab}>{r.settledDate ? finShortDate(r.settledDate) : ""}</span>
                <button onClick={() => st.updateEntry("debts", r.id, { settled: false })} title={L("Vrátit mezi otevřené", "Reopen")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 12, padding: 0 }}>↺</button>
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${t.borderSoft}` }}>
        <button onClick={() => setOpenLent(!openLent)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: t.sage, fontFamily: FONT_TAG, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}>
          {openLent ? "⌃ " : "⌄ "}{L("Půjčeno ode mě", "Owed to me")}{pujcene.length ? " · " + pujcene.length : ""}
        </button>
        {openLent && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, margin: "0 0 8px", lineHeight: 1.6 }}>{L("Drží se zvlášť a nikdy se neodečítá od toho, co dlužím — jinak by ty peníze vypadaly, že tu už jsou.", "Kept separate and never netted against what I owe — otherwise the money looks like it's already here.")}</p>
            {pujcene.map((r) => <DebtRow key={r.id} r={r} focus={false} duvod="" onPay={(x, a) => st.updateEntry("debts", x.id, { balance: Math.max(0, (Number(x.balance) || 0) - a) })} />)}
            <button onClick={() => pridej("owed")} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 12, marginTop: 8 }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Přidat půjčku", "Add a loan")}</button>
          </div>
        )}
      </div>
    </FinOddil>
  );
}

function BillEditor({ b, onClose }) {
  const { t } = useT();
  const st = useStore();
  const set = (patch) => st.updateEntry("bills", b.id, patch);
  const freqOpts = [L("měsíčně", "monthly"), L("ročně", "yearly"), L("jednou", "once")];
  const freqVal = b.freq === "year" ? freqOpts[1] : b.freq === "once" ? freqOpts[2] : freqOpts[0];
  return (
    <div style={{ display: "grid", gap: 8, padding: "10px 0 6px" }}>
      <input value={b.name || ""} onChange={(e) => set({ name: e.target.value })} placeholder={L("Pojmenuj to tak, jak to píše ten, komu platím", "Name it the way the institution names it")} style={{ ...fieldStyle(t), padding: "6px 9px" }} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
        <FinNum value={b.amount || ""} onCommit={(n) => set({ amount: n })} />
        <Select value={freqVal} onChange={(v) => set({ freq: v === freqOpts[1] ? "year" : v === freqOpts[2] ? "once" : "month", ...(v === freqOpts[2] && !b.date ? {date:todayISO()} : {}) })} options={freqOpts} style={{ width: 128 }} />
        {b.freq === "once"
          ? <input type="date" value={b.date || todayISO()} onChange={(e) => set({ date: e.target.value })} style={{ ...fieldStyle(t), width: 158, padding: "5px 8px", colorScheme: t.mode === "light" ? "light" : "dark" }} />
          : <>
              {b.freq === "year" ? <Select value={MONTHS_CZ()[(Number(b.month) || 1) - 1]} onChange={(v) => set({ month: MONTHS_CZ().indexOf(v) + 1 })} options={MONTHS_CZ()} style={{ width: 126 }} /> : null}
              <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                <span style={metaLabel(t)}>{L("den", "day")}</span>
                {b.day === "last"
                  ? <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec }}>{L("poslední", "last")}</span>
                  : <FinNum value={b.day || 1} suffix="." width={54} onCommit={(n) => set({ day: Math.min(31, Math.max(1, Math.round(n) || 1)) })} />}
                <button onClick={() => set({ day: b.day === "last" ? 1 : "last" })} style={finTag(t, b.day === "last")}>{b.day === "last" ? L("zvolit den", "pick a day") : L("poslední den", "last day")}</button>
              </span>
            </>}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => set({ estimate: !b.estimate })} style={finTag(t, !!b.estimate)}>{L("odhad", "estimate")}</button>
        <input value={b.note || ""} onChange={(e) => set({ note: e.target.value })} placeholder={L("poznámka…", "note…")} style={{ flex: "1 1 130px", minWidth: 100, background: "transparent", border: "none", borderBottom: `1px solid transparent`, color: t.textSec, fontFamily: FONT_BODY, fontSize: 12, outline: "none", padding: "2px 0" }} />
        <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "4px 12px", cursor: "pointer", color: t.textSec, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Hotovo", "Done")}</button>
        <button onClick={() => st.ask(L("Smazat „" + (b.name || "—") + "\"?", "Delete \"" + (b.name || "—") + "\"?"), () => { st.removeEntry("bills", b.id); onClose(); })} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Smazat", "Delete")}</button>
      </div>
    </div>
  );
}

function BillRow({ occ, po, onPaid, onMove, onUndo, onEdit, editing }) {
  const { t } = useT();
  const [rezim, setRezim] = useState("");   // "" · "pay" · "move"
  const [kdy, setKdy] = useState(occ.due);
  const [castka, setCastka] = useState("");
  const b = occ.bill;
  const isEditing = editing?.id === b.id && editing?.due === occ.due;
  const zaplaceno = !!occ.log;
  const jinak = zaplaceno && Math.abs((Number(occ.log.amount) || 0) - (Number(b.amount) || 0)) > 0.5 && Number(b.amount) > 0;
  return (
    <div data-tm-surface="row" data-tm-surface-active={!!(po || zaplaceno || isEditing || rezim)} data-tm-surface-editor={!!(isEditing || rezim)} style={{ padding: "9px 2px", borderBottom: `1px solid ${t.borderSoft}`, opacity: zaplaceno ? 0.6 : 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
        <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: po ? t.accent : t.textMuted, width: 46, flexShrink: 0, ...numTab }}>{finShortDate(occ.due)}</span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flex: 1, minWidth: 100, textDecorationLine: zaplaceno ? "line-through" : "none", textDecorationColor: hexA(t.textMuted, 0.55) }}>{b.name || L("beze jména", "unnamed")}</span>
        {b.estimate && !zaplaceno ? <span style={{ ...finTag(t, false), cursor: "default" }}>{L("odhad", "estimate")}</span> : null}
        <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.heading, ...numTab }}>{money(zaplaceno ? occ.log.amount : b.amount)}</span>
        {zaplaceno
          ? <button onClick={() => onUndo(occ)} title={L("Vzít zpět", "Undo")} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 13, padding: 0 }}>↺</button>
          : <span style={{ display: "inline-flex", gap: 6 }}>
              <button onClick={() => setRezim(rezim === "pay" ? "" : "pay")} style={{ background: "transparent", border: `1px solid ${t.accent}`, borderRadius: 12, padding: "7px 12px", minHeight: 32, cursor: "pointer", color: t.accent, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Zaplaceno", "Paid")}</button>
              <button onClick={() => setRezim(rezim === "move" ? "" : "move")} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 12, padding: "7px 12px", minHeight: 32, cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Přesunout", "Move")}</button>
            </span>}
      </div>
      <div style={{ display: "flex", gap: "2px 10px", flexWrap: "wrap", alignItems: "baseline", marginTop: 3, paddingLeft: 55 }}>
        {po && !zaplaceno ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.accent }}>{L("Bylo splatné ", "Was due ")}{finLongDate(occ.due)}</span> : null}
        {jinak ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("jinou částkou · čekáno ", "a different amount · expected ")}{money(b.amount)}</span> : null}
        {b.note ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{b.note}</span> : null}
        {occ.zbyva != null && !zaplaceno ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, ...numTab }}>{L("potom zbývá ", "after this ")}{money(occ.zbyva)}</span> : null}
        <button onClick={() => onEdit(isEditing ? null : {id:b.id,due:occ.due})} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: t.textMuted, fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>{isEditing ? L("zavřít", "close") : L("upravit", "edit")}</button>
      </div>
      {rezim === "pay" && !zaplaceno && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 8, paddingLeft: 55 }}>
          <FinNum value={castka === "" ? (b.amount || "") : castka} onCommit={(n) => setCastka(String(n))} width={104} />
          <button onClick={() => { onPaid(occ, castka === "" ? b.amount : castka); setRezim(""); }} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 12, padding: "4px 13px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12 }}>{L("Zapsat", "Record")}</button>
        </div>
      )}
      {rezim === "move" && !zaplaceno && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 8, paddingLeft: 55 }}>
          <input type="date" value={kdy} onChange={(e) => setKdy(e.target.value)} style={{ ...fieldStyle(t), width: 158, padding: "5px 8px", colorScheme: t.mode === "light" ? "light" : "dark" }} />
          <button onClick={() => { onMove(occ, kdy); setRezim(""); }} style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 12, padding: "4px 13px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 12 }}>{L("Na nové datum", "To the new date")}</button>
        </div>
      )}
      {isEditing ? <div style={{ paddingLeft: 55 }}><BillEditor b={b} onClose={() => onEdit(null)} /></div> : null}
    </div>
  );
}

function FinPayments() {
  const { t } = useT();
  const st = useStore();
  const o = useFinObligations();
  const [editing, setEditing] = useState(null);
  const [openHotovo, setOpenHotovo] = useState(false);
  const [manageBill,setManageBill]=useState(null);
  const dnes = todayISO();
  const odKdy = finAddDays(dnes, -45);
  const doKdy = finAddDays(dnes, 35);
  const log = st.coll.billLog || [];
  const occs = financePaymentOccurrences(o.bills,log,odKdy,doKdy);
  // Nezaplacené zůstává nahoře a nikam nemizí · jeden stav, žádné stupňování.
  const poSplatnosti = occs.filter((x) => x.due < dnes && !x.log);
  // Co je zaplacené, se schová, ale zůstane po ruce — aby šlo vzít zpět.
  const hotovo = occs.filter((x) => x.due < dnes && x.log);
  const nadchazi = occs.filter((x) => x.due >= dnes);
  // Bez zadaného zůstatku by „potom zbývá" jen odečítalo od nuly do minusu.
  let zbytek = o.liquid;
  if (o.liquid > 0) nadchazi.forEach((x) => { if (!x.log) { zbytek -= Number(x.bill.amount) || 0; x.zbyva = zbytek; } });

  const tydenLabel = (iso) => {
    const d = finDiffDays(dnes, iso);
    if (d < 7) return L("do sedmi dnů", "within seven days");
    if (d < 14) return L("do dvou týdnů", "within two weeks");
    if (d < 21) return L("do tří týdnů", "within three weeks");
    if (d < 28) return L("do čtyř týdnů", "within four weeks");
    return L("do pěti týdnů", "within five weeks");
  };
  const skupiny = [];
  nadchazi.forEach((x) => {
    const k = tydenLabel(x.due);
    const g = skupiny.find((s) => s.k === k);
    if (g) g.rows.push(x); else skupiny.push({ k, rows: [x] });
  });

  const oznacZaplaceno = (occ, castka) => {
    const a = parseFloat(String(castka).replace(",", ".")) || Number(occ.bill.amount) || 0;
    const expenseId=a>0?uid():null;
    st.addEntry("billLog", { id: uid(), billId: occ.bill.id, due: occ.due, paid: todayISO(), amount: a, state: "paid", title: occ.bill.name,expenseId });
    if (expenseId) st.addEntry("expenses", { id:expenseId, date: todayISO(), item: occ.bill.name || L("platba", "payment"), jar: "NEC", amount: a });
  };
  const presunOcc = (occ, kdy) => {
    if (!kdy || kdy === occ.due) return;
    st.addEntry("billLog", { id: uid(), billId: occ.bill.id, due: occ.movedFrom || occ.due, to: kdy, state: "moved", title: occ.bill.name });
  };
  const vratZpet = (occ) => { if(occ.log?.expenseId)st.removeEntry("expenses",occ.log.expenseId); if (occ.log) st.removeEntry("billLog", occ.log.id); };

  // roční termíny · stálý obzor, ne klouzavé okno
  const rok = +dnes.slice(0, 4);
  const pozdeji = [];
  o.bills.filter((b) => b.freq === "year").forEach((b) => {
    [rok, rok + 1].forEach((y) => {
      const iso = finDayInMonth(y, Number(b.month) || 1, b.day);
      if (iso > doKdy && iso <= finAddDays(dnes, 400)) pozdeji.push({ bill: b, due: iso });
    });
  });
  pozdeji.sort((a, b) => a.due.localeCompare(b.due));

  const maOsvc = o.bills.some((b) => b.sys === "osvc");
  const pausal = (o.cfg.taxMode || "zalohy") === "pausal";
  const doplnOsvc = () => businessTemplates(pausal).forEach((x) => st.addEntry("bills", { id: uid(), sys: "osvc", sysKey: x.key, name: x.name, amount: x.amount, freq: x.freq, day: x.day, month: x.month, estimate: !!x.estimate, note: x.note || "", since: dnes }));

  const mimo = editing && !occs.some(x=>x.bill.id===editing.id && x.due===editing.due) ? o.bills.find(b=>b.id===editing.id) : null;

  // hlavička · nejbližší týden je to, co se tady doopravdy dělá
  const tyden = nadchazi.filter((x) => !x.log && finDiffDays(dnes, x.due) < 7);
  const tydenSum = tyden.reduce((s, x) => s + (Number(x.bill.amount) || 0), 0);
  const souhrn = poSplatnosti.length
    ? poSplatnosti.length + " " + L(finPlural(poSplatnosti.length, "nezaplacená", "nezaplacené", "nezaplacených"), "unpaid")
    : tyden.length
      ? tyden.length + " " + L("do sedmi dnů", "within seven days") + " · " + money(tydenSum)
      : L("tento týden nic", "nothing this week");

  return (
    <FinOddil id="platby" ikona={<TmIcHospodareni size={19} />} titul={L("Co mám zaplatit", "What I have to pay")} souhrn={souhrn} vychozi={poSplatnosti.length > 0}>
      {poSplatnosti.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...subLabel(t), color: t.accent }}>{L("Zůstalo nezaplacené", "Still unpaid")}</div>
          {poSplatnosti.map((x) => <BillRow key={x.bill.id + x.due} occ={x} po onPaid={oznacZaplaceno} onMove={presunOcc} onUndo={vratZpet} onEdit={setEditing} editing={editing} />)}
        </div>
      )}
      {skupiny.length === 0 && poSplatnosti.length === 0 && (
        <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: t.textMuted, padding: "2px 0 8px" }}>{L("V nejbližších pěti týdnech nic nečeká.", "Nothing waiting in the next five weeks.")}</div>
      )}
      {skupiny.map((g) => (
        <div key={g.k} style={{ marginBottom: 12 }}>
          <div style={{ ...subLabel(t), marginBottom: 4 }}>{g.k}</div>
          {g.rows.map((x) => <BillRow key={x.bill.id + x.due} occ={x} po={false} onPaid={oznacZaplaceno} onMove={presunOcc} onUndo={vratZpet} onEdit={setEditing} editing={editing} />)}
        </div>
      ))}
      {hotovo.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => setOpenHotovo(!openHotovo)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: t.sage, fontFamily: FONT_TAG, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}>
            {openHotovo ? "⌃ " : "⌄ "}{hotovo.length} {L("zaplaceno", "paid")}
          </button>
          {openHotovo && hotovo.map((x) => <BillRow key={x.bill.id + x.due} occ={x} po={false} onPaid={oznacZaplaceno} onMove={presunOcc} onUndo={vratZpet} onEdit={setEditing} editing={editing} />)}
        </div>
      )}
      {mimo ? <BillEditor b={mimo} onClose={() => setEditing(null)} /> : null}
      <button onClick={() => { const id = uid(); st.addEntry("bills", { id, name: "", amount: 0, freq: "month", day: new Date().getDate(), estimate: false, note: "", since: dnes }); setEditing({id,due:null}); }} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "8px 13px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 13, marginTop: 4 }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Přidat platbu", "Add a payment")}</button>

      <details style={{marginTop:12}}><summary style={{cursor:"pointer",padding:"10px 0"}}>{L("Všechny pravidelné a jednorázové platby","All recurring and one-off payments")}</summary>{o.bills.map(b=><div key={b.id} style={{borderBottom:`1px solid ${t.borderSoft}`}}><button type="button" aria-expanded={manageBill===b.id} onClick={()=>setManageBill(manageBill===b.id?null:b.id)} style={{cursor:"pointer",background:"transparent",color:t.text,border:0,padding:"10px 0",fontFamily:FONT_BODY,fontSize:13}}>{b.name||L("beze jména","unnamed")} · {money(b.amount)}</button>{manageBill===b.id&&<BillEditor b={b} onClose={()=>setManageBill(null)}/>}</div>)}</details>
      <div style={{ marginTop: 16, paddingTop: 13, borderTop: `1px solid ${t.borderSoft}` }}>
        <div style={subLabel(t)}>{L("Roční termíny", "Annual dates")}</div>
        {pozdeji.length === 0 && <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13, color: t.textMuted }}>{L("Žádné roční termíny.", "No annual dates.")}</div>}
        {pozdeji.map((x) => (
          <div key={x.bill.id + x.due} style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap", padding: "7px 2px", borderBottom: `1px solid ${t.borderSoft}` }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, width: 96, flexShrink: 0 }}>{finLongDate(x.due)}{+x.due.slice(0, 4) !== rok ? " " + x.due.slice(0, 4) : ""}</span>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, flex: 1, minWidth: 110 }}>{x.bill.name}</span>
            {x.bill.estimate ? <span style={{ ...finTag(t, false), cursor: "default" }}>{L("odhad", "estimate")}</span> : null}
            {Number(x.bill.amount) > 0 ? <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, ...numTab }}>{money(x.bill.amount)}</span> : null}
          </div>
        ))}
        {!maOsvc
          ? <button onClick={doplnOsvc} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "8px 13px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 13, marginTop: 10 }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("Doplnit termíny OSVČ", "Add Czech self-employed dates")}</button>
          : <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, lineHeight: 1.6, margin: "9px 0 0" }}>{L("Každému termínu nastav vlastní splatnost a částku. Zálohy označené jako podnikání se v krytí počítají přes rezervu.","Set your own due date and amount for each entry. Business advances count toward coverage through the reserve.")}</p>}
      </div>
    </FinOddil>
  );
}

// ---- STRANOU · REZERVA -------------------------------------------------
// Ne procento ze sklenice. Roční povinnost mínus zaplacené, děleno
// zbývajícími měsíci.
function FinReserve() {
  const { t } = useT();
  const st = useStore();
  const o = useFinObligations();
  const cfg = o.cfg;
  const pausal = (cfg.taxMode || "zalohy") === "pausal";
  const parameters=financeTaxParameters(cfg,defaults.tax);
  const [detail, setDetail] = useState(false);
  const odlozeno = Number(cfg.taxSet) || 0;
  const cil = o.rezerva * o.zbyva;
  const frac = cil > 0 ? Math.min(1, odlozeno / cil) : 0;
  // popisek vlevo, pole vpravo · na úzkém plátně to jinak zubatí
  const radek = { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 8 };
  const radky = pausal
    ? [[L("paušální daň · dvanáct měsíců", "flat-rate tax · twelve months"), o.est.rok]]
    : [[L("daň z příjmů po slevě", "income tax after the credit"), o.est.dan], [L("zdravotní pojištění", "health insurance"), o.est.zp], [L("sociální pojištění", "social insurance"), o.est.sp]];
  const souhrn = money(o.rezerva) + " " + L("měsíčně", "a month") + (odlozeno > 0 ? " · " + money(odlozeno) + L(" stranou", " aside") : "");
  return (
    <FinOddil id="rezerva" ikona={<JarIcon size={19} />} titul={L("Stranou · daně", "Set aside · tax")} souhrn={souhrn}>
      <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, margin: "0 0 12px", lineHeight: 1.6 }}>{L("Zadané roční náklady, zaplacené částky a peníze odložené stranou v jednom přehledu.","Your entered annual costs, paid amounts and money set aside in one overview.")}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[["zalohy", L("zálohy a daň", "advances and tax")], ["pausal", L("paušální daň", "flat-rate tax")]].map((par) => (
          <button key={par[0]} onClick={() => st.setFinCfg({ taxMode: par[0] })} style={finTag(t, (cfg.taxMode || "zalohy") === par[0])}>{par[1]}</button>
        ))}
      </div>
      {pausal ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
          <span style={metaLabel(t)}>{L("pásmo", "band")}</span>
          {[1, 2, 3].map((b) => (
            <button key={b} onClick={() => st.setFinCfg({ taxPausalBand: b })} style={finTag(t, (Number(cfg.taxPausalBand) || 1) === b)}>{b} · {money(parameters.flatBands[b - 1])}</button>
          ))}
        </div>
      ) : (
        <div style={radek}>
          <span style={metaLabel(t)}>{L("odhad ročního zisku", "estimated annual profit")}</span>
          <FinNum value={cfg.taxProfit || ""} placeholder="0" onCommit={(n) => st.setFinCfg({ taxProfit: n })} width={128} />
        </div>
      )}
      <details style={{margin:'12px 0 18px'}}><summary style={{cursor:'pointer',padding:'10px 0'}}>{L('Vlastní parametry výpočtu','Your calculation inputs')}</summary>
        <p style={{fontFamily:FONT_BODY,fontSize:12,lineHeight:1.6,color:t.textSec}}>{L('Použij vlastní částky a sazby. Přehled počítá ze zadaných hodnot; sazby ani termíny sám neověřuje.','Use your own amounts and rates. This overview calculates from your inputs; it does not verify rates or deadlines.')}</p>
        {[["healthAdvance",L("Zdravotní · měsíční záloha","Health · monthly advance"),"Kč"],["socialAdvance",L("Sociální · měsíční záloha","Social · monthly advance"),"Kč"],["healthBase",L("Zdravotní · podíl zisku","Health · profit share"),"%"],["healthRate",L("Zdravotní · sazba","Health · rate"),"%"],["socialBase",L("Sociální · podíl zisku","Social · profit share"),"%"],["socialRate",L("Sociální · sazba","Social · rate"),"%"],["taxRate",L("Daň · základní sazba","Tax · base rate"),"%"],["higherRate",L("Daň · vyšší sazba","Tax · higher rate"),"%"],["threshold",L("Hranice vyšší sazby","Higher rate threshold"),"Kč"],["credit",L("Roční sleva","Annual credit"),"Kč"]].map(([key,title,suffix])=><label key={key} style={{...radek,flexWrap:'wrap',fontSize:12}}><span>{title}</span><FinNum value={parameters[key]} suffix={suffix} onCommit={value=>st.setFinCfg({...((key==='healthAdvance'||key==='socialAdvance')?{[key==='healthAdvance'?'zpZaloha':'spZaloha']:Math.max(0,value)}:{}),taxParameters:{...(cfg.taxParameters||{}),[key]:Math.max(0,value)}})}/></label>)}
        {[0,1,2].map(index=><label key={index} style={{...radek,flexWrap:'wrap',fontSize:12}}><span>{L('Paušál · pásmo ','Flat rate · band ')}{index+1}</span><FinNum value={parameters.flatBands[index]} onCommit={value=>st.setFinCfg({taxParameters:{...(cfg.taxParameters||{}),flatBands:parameters.flatBands.map((amount,i)=>i===index?Math.max(0,value):amount)}})}/></label>)}
      </details>
      <div style={radek}>
        <span style={metaLabel(t)}>{L("zaplaceno letos", "paid this year")}</span>
        <FinNum value={cfg.taxPaid || ""} placeholder="0" onCommit={(n) => st.setFinCfg({ taxPaid: n })} width={128} />
      </div>
      <div style={{ ...radek, marginBottom: 14 }}>
        <span style={metaLabel(t)}>{L("odloženo", "set aside")}</span>
        <FinNum value={cfg.taxSet || ""} placeholder="0" onCommit={(n) => st.setFinCfg({ taxSet: n })} width={128} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", padding: "12px 0 2px", borderTop: `1px solid ${t.borderSoft}` }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: t.heading, ...numTab }}>{money(o.rezerva)}</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", fontSize: 15, color: t.sand }}>{L("odkládat každý měsíc", "to set aside each month")}</span>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, ...numTab }}>
        {o.nastaveno
          ? <>{o.zbyva}&nbsp;{L(finPlural(o.zbyva, "měsíc", "měsíce", "měsíců"), o.zbyva === 1 ? "month" : "months")} {L("do konce roku · celkem ", "left this year · ")}{money(cil)}</>
          : L("Doplň vlastní parametry výpočtu, odhad zisku a zaplacené částky.","Enter your calculation inputs, estimated profit and paid amounts.")}
      </div>
      <div style={{ margin: "10px 0 2px" }}><ProgressBar value={frac} /></div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textSec, ...numTab }}>{odlozeno > 0 ? money(odlozeno) + L(" už stranou", " already aside") : L("zatím nic stranou", "nothing set aside yet")}</div>
      <button onClick={() => setDetail(!detail)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "10px 0 0", color: t.textMuted, fontFamily: FONT_TAG, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 12 }}>{detail ? "⌃ " : "⌄ "}{L("jak se to počítá", "how it's computed")}</button>
      {detail && (
        <div style={{ marginTop: 8, display: "grid", gap: 5 }}>
          {radky.map((par) => (
            <div key={par[0]} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontFamily: FONT_BODY, fontSize: 12, color: t.textSec }}><span>{par[0]}</span><span style={numTab}>{money(par[1])}</span></div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontFamily: FONT_BODY, fontSize: 13, color: t.heading, paddingTop: 6, borderTop: `1px solid ${t.borderSoft}` }}><span>{L("roční povinnost", "annual liability")}</span><span style={numTab}>{money(o.est.rok)}</span></div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, lineHeight: 1.6, margin: "6px 0 0" }}>
            {pausal
              ? L("Zvolená měsíční částka pásma se násobí dvanácti.","The selected monthly band amount is multiplied by twelve.")
              : L("Výpočet používá zadaný podíl zisku, sazby, hranici a slevu. U pojištění porovnává vypočtenou částku se zadanými měsíčními zálohami.","The calculation uses your entered profit shares, rates, threshold and credit. Insurance compares the computed amount with your entered monthly advances.")}
          </p>
        </div>
      )}
    </FinOddil>
  );
}


function FinancePlans({month}){
 const {t}=useT(),st=useStore();
 const sectionStyle={borderBottom:'1px solid '+t.borderSoft,padding:'10px 0',margin:'8px 0'},summaryStyle={cursor:'pointer',fontFamily:FONT_DISPLAY,fontSize:22,padding:'12px 0',color:t.heading};
 return <>
 <details style={sectionStyle}><summary style={summaryStyle}>{L('Šest sklenic','Six jars')}</summary><Jars month={month}/></details>
 <details style={sectionStyle}><summary style={summaryStyle}>{L('Přání','Wishes')}</summary><Wishlist/></details>
 <details style={sectionStyle}><summary style={summaryStyle}>{L('Závazky a krytí','Obligations and coverage')}</summary><FinCoverage/><FinPayments/><FinDebts/><FinReserve/></details>
 <details style={sectionStyle}><summary style={summaryStyle}>{L('Investice','Investments')}</summary><InvestmentPortfolio/></details>
 {st.editMode&&<details style={sectionStyle}><summary style={summaryStyle}>{L('Úvodní text','Introduction')}</summary><BufferedInput value={st.pageMetaOf('hospodareni').sub||''} onCommit={value=>st.setPageMeta('hospodareni',{sub:value})} placeholder={L('Vlastní poznámka k hospodaření…','Your own note on stewardship…')} style={{...fieldStyle(t),fontSize:14}}/></details>}
 {!st.editMode&&st.pageMetaOf('hospodareni').sub&&<p style={{fontFamily:FONT_BODY,fontSize:14,color:t.textSec,lineHeight:1.65,marginTop:24}}>{st.pageMetaOf('hospodareni').sub}</p>}
 </>;
}
return {FinancePlans,jarOptions:()=>JARS.map(([code])=>({value:code,label:JAR_NAZEV(code)}))};
}
