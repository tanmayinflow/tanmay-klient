// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/practice.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// PRAXE · jeden engine pro oba domy
// ----------------------------------------------------------------------
// Karta dne, návyky, tělo, tři znamení, motiv, prahy dne, kalendář, matice,
// přehled a večerní Ohlédnutí. Dosud to byly dvě implementace a klientská
// byla chudší o tři znamení, týdenní podněty, prahy dne i celý přehled.
//
// Rozdíl role se řeší tím, co se do továrny předá, ne druhou komponentou:
//   · `DenVPraxi`     řádek rezervací v kartě dne · osobní aplikace ano, klient má vlastní
//   · `journalArchive` archiv zápisů z Notionu · jen osobní aplikace
//   · `flow`          zmrazený archiv dnů · jen osobní aplikace
//   · `caps`          co role smí · rozhoduje o Deníku dne a o Krajinách
//
// Písmo se bere z CSS proměnných (--tm-font-*), aby přepnutí jazyka
// nemuselo procházet přes JS proměnnou, která by se v továrně zamrazila.
import React, { useState } from "react";

export function createPracticeUI(deps) {
  const {
    useT, useStore, L, hexA, uid,
    Bindu, Tag, Eyebrow, Callout, Check, DotMeter, Toggle, LinkPill, Prazdno,
    BufferedInput, RichArea, RichText, AttachmentStrip,
    BookIcon, PenIcon, TmWbMiska, TmWbDiamant, TmWbKruh,
    subLabel, metaLabel, calBtn, iconBtn, tmBuzz, tmPlain, jCanonTag,
    EMPTY_H, HABIT_DEFS, DAY_STATUS_DEFS, PLAN_QS, PLAN_QS_HLOUBKA, PLAN_QS_STARE,
    TM_PROMPT_OKRUH, tmPromptFor, TM_PRAHY, tmPrahKlic, tmPrahMa,
    WB_ZNAMENI, tmWbOf, tmWbDates, usePraxeStats,
    fmtCZ, todayISO, shiftISO, moonPhaseOf, moonName, sunsetOf,
    // role a data, která jsou v každém domě jiná
    DenVPraxi = null, journalArchive = null, flow = null, caps = null,
  } = deps;

  function StatusCycle({ date }) {
    const { t } = useT();
    const st = useStore();
    const day = st.getDay(date);
    const custom = st.dayStatusLabels();
    const statuses = DAY_STATUS_DEFS.map((s) => ({ ...s, label: (custom[s.key] || "").trim() || L(s.cz, s.en) }));
    const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    // Resolve a stored value to a status index. Backward compatible: matches the
    // stable key (new format), the default label, or a custom label (so renaming
    // never orphans past days).
    const resolve = (val) => {
      if (!val) return -1;
      const nv = norm(val);
      for (let i = 0; i < DAY_STATUS_DEFS.length; i++) {
        const d = DAY_STATUS_DEFS[i];
        if (val === d.key) return i;
        if (nv === norm(d.cz) || nv === norm(d.en)) return i;
        // dřívější popisky · den zapsaný před přejmenováním se musí číst dál
        if ((d.stare || []).some((x) => nv === norm(x))) return i;
        const cl = (custom[d.key] || "").trim();
        if (cl && nv === norm(cl)) return i;
      }
      return -1;
    };
    const idx = resolve(day.s);
    /* Žádná stupnice. Tři stavy nejsou horší a lepší, takže je nesmí rozlišit
       barva — vybraný se pozná mědí, prázdný mlčí. Tečky v přejmenování drží
       jednu pískovou, aby ani ony nic nenaznačovaly. */
    const colors = [t.sand, t.sand, t.sand];
    const c = idx >= 0 ? (t.accentInk || t.accent) : t.textMuted;
    const cycle = () => {
      // prázdné → mimo kontakt → v kontaktu → v souladu → prázdné. Ukládá se stabilní KEY, ať se dá popisek přejmenovat volně.
      const next = idx < 0 ? 0 : idx + 1;
      st.updateDay(date, { s: next >= DAY_STATUS_DEFS.length ? "" : DAY_STATUS_DEFS[next].key });
    };
    const legacy = day.s && idx < 0;
    return (
      <div style={{ textAlign: "right" }}>
        {/* žádný rámeček · jen text, který se sám mění klepnutím */}
        {/* Čistý překlikávací text · žádná pilulka, žádná karta, žádný rámeček.
            Rozdíl nese barva a kurzíva; kroužek zaostření se ukáže jen
            klávesnici, po klepnutí po sobě nic nenechá. */}
        <button onClick={cycle} title={L("Mimo kontakt → V kontaktu → V souladu → prázdné", "Out of contact → In contact → In accord → empty")} style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none", borderRadius: 0, padding: "2px 0", minHeight: 30, cursor: "pointer", fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 17, color: idx >= 0 ? c : t.textMuted, textAlign: "right", WebkitTapHighlightColor: "transparent" }}>
          {idx >= 0 ? statuses[idx].label : (day.s || L("Jak ses dnes nesl?", "How did today carry you?"))}
        </button>
        {legacy && <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, marginTop: 4 }}>{L("starší volný zápis — kliknutím přejdeš na tři stavy", "older free-form note — click to switch to the three states")}</div>}
        {st.editMode && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 10, textAlign: "left" }}>
            <div style={{ ...subLabel(t), marginBottom: 6 }}>{L("Přejmenuj stavy dne", "Rename day statuses")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {statuses.map((s, i) => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[i], flexShrink: 0 }} />
                  <BufferedInput value={s.label} onCommit={(v) => st.setDayStatusLabel(s.key, v)} placeholder={L(DAY_STATUS_DEFS[i].cz, DAY_STATUS_DEFS[i].en)} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: `1px dashed ${t.borderSoft}`, color: t.text, fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 15, padding: "2px 0", outline: "none" }} />
                  {(custom[s.key] || "").trim() && <button title={L("Vrátit výchozí", "Restore default")} onClick={() => st.setDayStatusLabel(s.key, "")} style={{ ...iconBtn(t), width: 22, height: 22, minWidth: 22, padding: 0, fontSize: 12, border: "none", color: t.textMuted }}>↺</button>}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, fontStyle: "italic", marginTop: 7 }}>{L("Historie zůstává — přejmenování nemění dřívější dny.", "History is kept — renaming doesn't change earlier days.")}</div>
          </div>
        )}
      </div>
    );
  }

  // ---- Daily tasks · shared between Habit Tracker (Daily planner) and Divine game of life ----
  function DayTasks({ date, onOpenGoal }) {
    const { t } = useT();
    const st = useStore();
    // název cíle je odkaz · Kompas ho otevře u sebe, jinde se do Cílů doskočí
    const openG = (name) => {
      if (onOpenGoal) { onOpenGoal(name); return; }
      if (st.setOpenTarget) st.setOpenTarget({ kind: "goal", id: name });
      st.go && st.go("cile");
    };
    /* Cíl dne je cíl. Dřív se na to ptalo: „tohle zatím není cíl v Kompasu,
       založit ho a otevřít?" — jenže odpověď byla vždycky ano, protože jinak
       se ten řádek nedal otevřít. Otázka, na kterou existuje jen jedna
       rozumná odpověď, není volba; je to překážka. Když se cíl dne rozklikne
       a v Kompasu ještě není, prostě tam vznikne a hned se otevře. */
    const goalNames = st.allGoals().map((g) => g.name);
    const openOrMake = (name) => {
      if (goalNames.indexOf(name) < 0) {
        st.addGoal({ name, status: "In progress", prio: "Normal" });
        st.updateDay(date, (d) => ({ tasks: (d.tasks || []).map((x) => (x.text === name ? { ...x, goal: true } : x)) }));
      }
      openG(name);
    };
    const day = st.getDay(date);
    const tasks = day.tasks;
    // `zmen` dostane seznam tak, jak je právě uložený · `save` zůstává pro místa,
    // která staví celý seznam znovu (přetahování)
    const zmen = (fn) => st.updateDay(date, (d) => ({ tasks: fn(d.tasks || []) }));
    const save = (next) => st.updateDay(date, { tasks: next });
    const [txt, setTxt] = useState("");
    const add = () => { const v = txt.trim(); if (!v) return; zmen((list) => [...list, { id: uid(), text: v, done: false }]); setTxt(""); };
    return (
      <div>
        {tasks.map((task) => (
          <div key={task.id} className="tm-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", margin: "0 -6px" }}>
            <button onClick={() => zmen((list) => list.map((x) => x.id === task.id ? { ...x, done: !x.done } : x))} aria-label={(task.done ? L("Odškrtnout ", "Uncheck ") : L("Zaškrtnout ", "Check ")) + task.text} aria-pressed={!!task.done} className="tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check done={!!task.done} /></button>
            {/* každý řádek je odkaz · cíl z Kompasu se otevře, ručně psaný se dá povýšit */}
            <button onClick={() => (task.goal || goalNames.indexOf(task.text) >= 0) ? openG(task.text) : openOrMake(task.text)}
              title={(task.goal || goalNames.indexOf(task.text) >= 0) ? L("Otevřít cíl", "Open the goal") : L("Založit z toho cíl v Kompasu", "Make this a goal in the Compass")}
              className="tm-goallink" style={{ flex: 1, minWidth: 0, minHeight: 34, display: "flex", alignItems: "center", textAlign: "left", background: "transparent", border: "none", padding: "4px 0", cursor: "pointer", fontFamily: "var(--tm-font-body)", fontSize: 13, color: task.done ? t.textMuted : t.text, textDecoration: task.done ? "line-through" : "none" }}>
              {(task.goal || goalNames.indexOf(task.text) >= 0) && <span style={{ color: t.accent, marginRight: 6 }}>◎</span>}<span className="tm-goallink-t">{task.text}</span>
            </button>
            <button title={L("Odebrat", "Remove")} aria-label={L("Odebrat ", "Remove ") + task.text} onClick={() => zmen((list) => list.filter((x) => x.id !== task.id))} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 13, width: 40, height: 40, margin: "-8px -10px -8px 0", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}>
          <span style={{ width: 18, textAlign: "center", color: t.sand, fontSize: 13 }}>＋</span>
          <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} onBlur={add} placeholder={L("Nový cíl dne… (Enter)", "New goal for today… (Enter)")} aria-label={L("Nový cíl dne", "New goal for today")} style={{ flex: 1, minHeight: "var(--tm-tap-compact)", background: "transparent", border: "none", color: t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none" }} />
        </div>
        {tasks.length === 0 && <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted }}>{L("Cíle dne se propisují i do Kompasu.", "Today's goals also flow into the Compass.")}</div>}
      </div>
    );
  }

  // ---- Daily planner · morning intent + evening review ----
  // cz/en pairs resolved at render via L() — a module const would freeze the language
  /* TŘI OTÁZKY, KTERÉ SE DAJÍ ODPOVĚDĚT KAŽDÝ DEN. Pět otázek najednou je
     večer moc — z ohlédnutí se stane výkaz a přeskočí se celé. Tři stačí:
     jedna se ohlédne, jedna si něco odnese, jedna otevře zítřek. Hloubka
     zůstává dostupná pod „Jít hlouběji", ale nikdo ji po nikom nechce.

     KLÍČE. `next` je tentýž klíč, který nesl „Zítřejší první krok" — otázka je
     táž, takže starší odpovědi dál sedí na svém místě. Ostatní tři jsou nové;
     dřívější čtyři otázky se nepřepisují, jen se přestěhovaly do PLAN_QS_STARE
     a čtou se pod „Dřívější otázky", pokud v tom dni něco mají. */

  // RÁNO · one visible line — the first word of the day is never folded away
  function RanniZamer({ date, go }) {
    const { t } = useT();
    const st = useStore();
    const day = st.getDay(date);
    const plan = day.plan;
    const setP = (k, v) => st.updateDay(date, (d) => ({ plan: { ...(d.plan || {}), [k]: v } }));
    const [hov, setHov] = useState(false);
    return (
      <div data-pv="zamer" style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "2px 0 4px" }}>
        {/* the quiet door · "Today I am" and its small ring open the Mandala —
            the room of selves you tune into before you name the day */}
        <button data-pv="mandala" onClick={() => go && go("mandala")} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title={L("Osobní mandala · aspekty self", "Personal mandala · aspects of self")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", padding: 0, whiteSpace: "nowrap" }}>
          <span aria-hidden="true" style={{ position: "relative", width: 15, height: 15, flexShrink: 0, display: "inline-flex" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid ${hov ? t.accent : t.sand}`, transition: "border-color .3s ease, transform .4s ease", transform: hov ? "rotate(45deg)" : "none" }} />
            <span style={{ position: "absolute", left: "50%", top: 1.5, bottom: 1.5, width: 1, background: hov ? t.accent : t.borderSoft, transform: "translateX(-50%)", transition: "background .3s ease" }} />
            <span style={{ position: "absolute", top: "50%", left: 1.5, right: 1.5, height: 1, background: hov ? t.accent : t.borderSoft, transform: "translateY(-50%)", transition: "background .3s ease" }} />
            <span style={{ position: "absolute", left: "50%", top: "50%", width: 3.4, height: 3.4, borderRadius: "50%", background: t.accent, transform: "translate(-50%,-50%)" }} />
          </span>
          <span style={{ fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 17, color: hov ? t.accent : t.sand, transition: "color .3s ease" }}>{L("Dnes jsem", "Today I am")}</span>
        </button>
        <input value={plan.iam || ""} onChange={(e) => setP("iam", e.target.value)} aria-label={L("Dnes jsem", "Today I am")} placeholder={L("charakter a příběhy, které držím…", "the character and stories I carry…")} className="tm-navod" style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", borderBottom: `1px solid ${t.border}`, color: t.heading, fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 17, padding: "2px 2px 4px", outline: "none", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }} />
      </div>
    );
  }

  // VEČER · four questions and tomorrow's first step
  /* Řádek, do kterého se píše, roste s tím, co do něj přijde. Pevný počet
     řádků znamenal, že se třetí věta schovala pod okraj a člověk o ní nevěděl —
     v deníku, kde jde právě o to napsat víc, než se čekalo, je to ta nejhorší
     možná mez. */

  function RostouciText({ value, style, poleRef, ...zbytek }) {   // id, className a zbytek jdou beze změny na <textarea>
    const ref = React.useRef(null);
    // dva držáky na jeden uzel · vnitřní pro měření, vnější pro zaostření
    const drz = (el) => { ref.current = el; if (poleRef) poleRef.current = el; };
    const dorovnej = () => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = (el.scrollHeight + 1) + "px"; };
    React.useEffect(dorovnej, [value]);
    React.useEffect(() => {
      const f = () => dorovnej();
      window.addEventListener("resize", f);
      /* Změřit se musí ještě jednou, až doběhnou písma a rozbalovací animace —
         první měření padne do okamžiku, kdy text ještě sází náhradní písmo. */
      const r1 = requestAnimationFrame(f);
      const r2 = window.setTimeout(f, 340);
      try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(f); } catch (e) {}
      return () => { window.removeEventListener("resize", f); cancelAnimationFrame(r1); window.clearTimeout(r2); };
    }, []);
    return <textarea ref={drz} value={value} {...zbytek} onInput={dorovnej} style={{ ...style, overflow: "hidden", resize: "none" }} />;
  }

  /* VEČERNÍ OHLÉDNUTÍ.
     Otázka a odpověď se dřív lišily jen barvou — obojí třináctka, obojí
     kurzíva, obojí u kraje. Oko mezi nimi nemělo o co zavadit a celý oddíl
     splýval v jeden šedý sloupec.

     Linka pod psaním zůstává, ta byla dobrá. Rozdíl nese písmo — a kurzíva
     z toho vypadla: nakloněný řez u otázek za sebou působí uječeně a hůř se
     čte. Stojaté serifové písmo udrží důstojnost i klid.
       PÍSMO    otázka důstojným řezem, stojatě · odpověď běžným textovým
       VELIKOST otázka 19, odpověď 15 — otázka je zřetelně nadpis toho, co jde po ní
       BARVA    otázka mědí, odpověď plným inkoustem

     ZAVŘENO JE VÝCHOZÍ. Pět otevřených polí naráz je večer výkaz; zavřené
     řádky jsou nabídka. Že je otázka zodpovězená, se pozná jediným tichým
     způsobem — pod ní leží první řádek odpovědi. Žádná fajfka, žádné 3/5,
     žádná barva výkonu. */
  /* OTÁZKA UŽ NENÍ DVEŘE.
     Každá otázka byla vlastní harmonika: šipka, vlastní stav, náhled odpovědi,
     vlastní skok zaostření. Večer se tím z ohlédnutí stalo pět rozkliknutí —
     a co je zavřené, to se nenapíše. Teď je otázka jen otázka a pod ní stojí
     pole. Otevírá se celá sekce, ne jednotlivé věty.

     Otázka je skutečný `label` toho pole. Naváděcí text v poli je jen
     naváděcí text; přístupnost na něm nikdy nestojí. */

  function ReflexeOtazka({ text, value, onChange, placeholder, id }) {
    const { t } = useT();
    const [fokus, setFokus] = useState(false);
    const poleRef = React.useRef(null);
    const idRef = React.useRef(id || ("refl-" + Math.random().toString(36).slice(2, 9)));
    return (
      <div style={{ padding: "2px 0 4px", marginBottom: 18 }}>
        <label htmlFor={idRef.current}
          style={{ display: "block", fontFamily: "var(--tm-font-display)", fontWeight: 400, fontSize: 19, lineHeight: 1.3, color: t.accentInk || t.accent, marginBottom: 4 }}>{text}</label>
        <RostouciText
          id={idRef.current}
          poleRef={poleRef}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFokus(true)}
          onBlur={() => setFokus(false)}
          placeholder={placeholder || ""}
          rows={1}
          className="tm-navod"
          style={{
            width: "100%", boxSizing: "border-box", display: "block",
            background: "transparent", color: t.text,
            border: "none", borderBottom: `1px solid ${fokus ? t.accent : t.borderSoft}`,
            padding: "3px 2px 8px",
            fontFamily: "var(--tm-font-body)", fontSize: 15, lineHeight: 1.62,
            outline: "none", transition: "border-color .16s ease",
          }}
        />
      </div>
    );
  }

  function VecerniOhlednuti({ date }) {
    const { t } = useT();
    const st = useStore();
    const day = st.getDay(date);
    const plan = day.plan;
    // ze `d`, ne z `plan` · dvě odpovědi napsané těsně po sobě se jinak přepíšou
    const setP = (k, v) => st.updateDay(date, (d) => ({ plan: { ...(d.plan || {}), [k]: v } }));
    const [hloubka, setHloubka] = useState(false);
    const dostal = (q) => ({ value: plan[q.key] || "", onChange: (v) => setP(q.key, v), placeholder: q.phCz ? L(q.phCz, q.phEn) : "" });
    // dřívější otázky se ukazují jen tam, kde na ně někdo skutečně odpověděl
    const maStare = PLAN_QS_STARE.filter((q) => String(plan[q.key] || "").trim() !== "");
    const dvirka = (otevreno, popis, klik, rizeny) => (
      <button onClick={klik} aria-expanded={otevreno} aria-controls={rizeny} className="tm-nav-item"
        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "13px 2px", minHeight: 44, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12, color: t.textMuted }}>
        <span style={{ flex: 1 }}>{popis}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 12, display: "inline-block", transform: otevreno ? "rotate(90deg)" : "none", transition: "transform .15s ease" }}>›</span>
      </button>
    );
    /* JEDNA ČTECÍ OSA. Na širokém monitoru se řádek reflexe neroztahuje přes
       celou šířku — dlouhá česká otázka se pak čte hůř než na telefonu. Na
       telefonu si bere celou dostupnou šířku. */
    return (
      <div className="tm-reflexe">
        {PLAN_QS.map((q) => <ReflexeOtazka key={q.key} id={"refl-" + q.key} text={L(q.cz, q.en)} {...dostal(q)} />)}

        {/* Jediné běžné druhé patro. Nic se za ně neschovává, jen se nabízí. */}
        <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: 4 }}>
          {dvirka(hloubka, L("Jít hlouběji", "Go deeper"), () => setHloubka((o) => !o), "tm-hloubeji")}
        </div>
        {hloubka && (
          <div id="tm-hloubeji" style={{ paddingTop: 6 }}>
            {PLAN_QS_HLOUBKA.map((q) => <ReflexeOtazka key={q.key} id={"refl-" + q.key} text={L(q.cz, q.en)} {...dostal(q)} />)}
          </div>
        )}

        {/* DŘÍVĚJŠÍ OTÁZKY · tichý blok, ne třetí patro.
            Ukáže se jen na dni, kde na starou otázku někdo skutečně odpověděl,
            a jen ty položky, které něco nesou. Nový den ho nikdy neuvidí.
            Odpovědi jsou ke čtení i k úpravě, nikdy se nepřepisují novou otázkou. */}
        {maStare.length > 0 && (
          <div style={{ borderTop: `1px solid ${t.borderSoft}`, marginTop: 10, paddingTop: 14 }}>
            <div style={{ ...subLabel(t), marginBottom: 10 }}>{L("Dřívější otázky", "Earlier questions")}</div>
            {maStare.map((q) => <ReflexeOtazka key={q.key} id={"refl-" + q.key} text={L(q.cz, q.en)} {...dostal(q)} />)}
          </div>
        )}
      </div>
    );
  }

  // ---- Journal of the day · read-through from Journal card ----
  function JournalOfDay({ date, go }) {
    const { t } = useT();
    const st = useStore();
    const [sel, setSel] = useState(null); // id otevřeného zápisku (akordeon)
    const jt = st.jTags();
    const TC = Object.fromEntries(jt.map(([n, c]) => [n, c]));
    const archive = st.coll.jImported ? [] : (journalArchive || []).filter((e) => e.d === date && (e.b || (e.n && e.n !== "Untitled")));
    const mine = (st.coll.journal || []).filter((e) => e.date === date);
    const empty = archive.length === 0 && mine.length === 0;
    const preview = (txt) => tmPlain(txt).split("\n").map((x) => x.trim()).filter(Boolean)[0] || "";
    const row = (key, title, tags, text, isOpen, onToggle, body) => (
      <div key={key} style={{ background: t.sheet, border: `1px solid ${t.borderSoft}`, borderRadius: 8, margin: "6px 0", boxShadow: isOpen ? t.shadow : "none" }}>
        <button onClick={onToggle} className="tm-nav-item" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
          <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 17, color: t.heading, flexShrink: 0 }}>{title}</span>
          {tags}
          {!isOpen && <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preview(text)}</span>}
          <span style={{ color: t.textMuted, fontSize: 12, flexShrink: 0, marginLeft: "auto", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s ease", display: "inline-block" }}>›</span>
        </button>
        {isOpen && <div style={{ padding: "2px 14px 14px" }}>{body}</div>}
      </div>
    );

    return (
      <div style={{ marginTop: 14, borderTop: `1px solid ${t.borderSoft}`, paddingTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          <LinkPill icon={<span style={{ color: t.sand, display: "inline-flex" }}><PenIcon size={12} /></span>} label={L("Otevřít deník", "Open journal")} onClick={() => go("denik")} />
        </div>
        {/* prázdný dnešek podává pero · založí TENTÝŽ zápis, který otevírá Deník — jedna entita dne */}
        {empty && date === todayISO() && (
          <button className="tm-dash" onClick={() => { const id = uid(); st.addEntry("journal", { id, date, title: "", tag: "Den", text: "" }); setSel(id); }} style={{ background: "transparent", border: `1px dashed ${t.border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: t.inkSand, fontFamily: "var(--tm-font-body)", fontSize: 13, width: "100%", textAlign: "left" }}>＋ {L("Zápis dne…", "Today's entry…")}</button>
        )}
        {empty && date !== todayISO() && <div style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 13, color: t.textMuted }}>{L("K tomuto dni není zápisek. Nechat to tak je taky odpověď.", "No entry for this day. Leaving it be is also an answer.")}</div>}
        {mine.map((e) => row(
          e.id, e.title || L("Zápis dne", "Day entry"),
          e.tag && <Tag label={e.tag} color={TC[e.tag] || "default"} />,
          e.text,
          sel === e.id,
          () => setSel(sel === e.id ? null : e.id),
          <>
            <RichArea value={e.text || ""} onChange={(v) => st.updateEntry("journal", e.id, { text: v })} />
            <AttachmentStrip att={e.att} onRemove={st.editMode ? ((id) => st.updateEntry("journal", e.id, { att: (e.att || []).filter((x) => x.id !== id) })) : undefined} />
          </>
        ))}
        {archive.map((e, i) => row(
          "a" + i, e.n,
          (e.t || []).slice(0, 1).map((tg) => <Tag key={tg} label={jCanonTag(tg)} color={TC[jCanonTag(tg)] || "default"} />),
          e.b,
          sel === "a" + i,
          () => setSel(sel === "a" + i ? null : "a" + i),
          <>
            <RichText text={e.b} />
            <div style={{ ...subLabel(t), marginTop: 8, marginBottom: 0 }}>z Notionu</div>
          </>
        ))}
      </div>
    );
  }

  // ---- Wellbeing · quick tracker (sleep + mood + potenciál dne + téma) ----
  function DotTap({ value, onChange, color, label }) {
    const { t } = useT();
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={metaLabel(t)}>{label}</span>
        <span style={{ display: "inline-flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className="tm-wb-dot tm-tap" onClick={() => onChange(value === n ? 0 : n)} title={String(n)} aria-label={(label ? label + " · " : "") + n} aria-pressed={n <= value} style={{ width: 17, height: 17, borderRadius: "50%", border: `1.5px solid ${n <= value ? color : t.border}`, background: n <= value ? color : "transparent", cursor: "pointer", padding: 0, transition: "background .12s ease" }} />
          ))}
        </span>
      </div>
    );
  }

  function WellbeingTracker() {
    const { t } = useT();
    const st = useStore();
    const date = st.selDate;
    const cur = tmWbOf(st, date) || { sleep: null, mood: 0, energy: 0, well: 0, theme: "", grat: false, bodhi: false, wild: false };
    const set = (patch) => st.updateDay(date, (d) => ({ wb: { ...(d.wb || {}), ...patch } }));
    const sleepStep = (dir) => { const v = cur.sleep == null ? 8 : cur.sleep; set({ sleep: Math.max(0, Math.min(16, v + dir * 0.5)) }); };
    const iconToggle = (on) => ({ background: "transparent", border: "none", cursor: "pointer", fontSize: 22, padding: "0 2px", opacity: on ? 1 : 0.25, transition: "opacity .12s ease" });
    // Ikona je malá schválně · plochu k trefě přidá `tm-tap`, ne větší znak.
    return (
      <div style={{ margin: "14px 0" }}>
        {/* Tělo · bez samostatného rámečku — hlavička jen text a ikona */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ color: t.sand, fontSize: 17, lineHeight: 1 }}>☾</span>
          <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 20, color: t.heading }}>{L("Tělo", "Body")}</span>
        </div>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "14px 26px", marginBottom: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={metaLabel(t)}>{L("Spánek", "Sleep")}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <button className="tm-iconbtn" onClick={() => sleepStep(-1)} aria-label={L("O půl hodiny míň", "Half an hour less")} style={iconBtn(t)}>−</button>
                <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 22, color: t.heading, minWidth: 52, textAlign: "center" }}>{cur.sleep == null ? "—" : cur.sleep + " h"}</span>
                <button className="tm-iconbtn" onClick={() => sleepStep(1)} aria-label={L("O půl hodiny víc", "Half an hour more")} style={iconBtn(t)}>＋</button>
              </span>
            </div>
            <DotTap label={L("Nálada", "Mood")} value={cur.mood} onChange={(v) => set({ mood: v })} color={t.sage} />
            <DotTap label={L("Energie", "Energy")} value={cur.energy} onChange={(v) => set({ energy: v })} color={t.sand} />
            <DotTap label={L("Potenciál dne", "Day potential")} value={cur.well} onChange={(v) => set({ well: v })} color={t.accent} />
            <ZnameniDne cur={cur} set={set} />
          </div>
          <input data-pv="motiv" value={cur.theme || ""} onChange={(e) => set({ theme: e.target.value })} placeholder={L("Motiv dne. Jméno, které dnešek dostal…", "The day's motif. The name this day earned…")} style={{ width: "100%", background: "transparent", border: "none", borderBottom: `1px solid ${t.border}`, color: t.sand, fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 17, padding: "3px 2px 6px", outline: "none" }} />
        </div>
      </div>
    );
  }

  /* ═══ TŘI ZNAMENÍ ══════════════════════════════════════════════════════
     Tři tiché značky, ne čtvrtý tracker návyků. Nejsou to úkoly, otázky ani
     skóre. Stalo se to, nestalo se to, nebo jsem to dnes nezaznamenal.

     Klíče `grat`, `bodhi` a `wild` jsou data a nemění se. Mění se jen to, co
     se o nich řekne. Samotný symbol na telefonu nestačí a tři trvalé popisky
     by z klidného řádku udělaly legendu — proto nese každý symbol přesný
     `aria-label`, `title` pro myš a klávesnici, `aria-pressed` pro stav, a na
     dotek, najetí nebo zaostření se pod skupinou na dvě vteřiny ukáže jedna
     věta. Ta věta je pohodlí navíc, nikdy jediná cesta k významu. */

  function ZnameniDne({ cur, set }) {
    const { t } = useT();
    const [napoveda, setNapoveda] = useState("");
    const hodiny = React.useRef(null);
    React.useEffect(() => () => { if (hodiny.current) clearTimeout(hodiny.current); }, []);
    /* Vždycky jen jedna zpráva a vždycky tichý odchod. Žádný stoh oznámení,
       žádné okno, žádná trvalá legenda. Místo pro řádek je vyhrazené pořád,
       takže se pod ním nic neposune. */
    const rekni = (z) => {
      setNapoveda(z);
      if (hodiny.current) clearTimeout(hodiny.current);
      hodiny.current = setTimeout(() => setNapoveda(""), 2200);
    };
    const iconToggle = (on) => ({ background: "transparent", border: "none", cursor: "pointer", fontSize: 22, padding: "0 2px", opacity: on ? 1 : 0.25, transition: "opacity .12s ease" });
    return (
      <div data-pv="znameni" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={metaLabel(t)}>{L("Znamení", "Marks")}</span>
        <span>
          {WB_ZNAMENI.map(({ k, Ic, cz, en, pCz, pEn }) => {
            const jmeno = L(cz, en);
            const veta = jmeno + " · " + L(pCz, pEn);
            return (
              <button key={k} className="tm-wb-mark tm-tap" type="button"
                title={veta}
                aria-label={jmeno + ". " + L(pCz, pEn)}
                aria-pressed={!!cur[k]}
                onMouseEnter={() => rekni(veta)}
                onFocus={() => rekni(veta)}
                onClick={() => { set({ [k]: !cur[k] }); rekni(veta); }}
                style={iconToggle(cur[k])}>
                <span style={{ display: "inline-flex", color: t.sand }}><Ic size={16} /></span>
              </button>
            );
          })}
        </span>
        {/* Řádek má vyhrazenou výšku i když mlčí · jinak by se pod ním
            rozvržení pohnulo pokaždé, když se ho někdo dotkne. */}
        <span aria-hidden="true" style={{ display: "block", minHeight: 16, marginTop: 2, maxWidth: 280, fontFamily: "var(--tm-font-body)", fontSize: 12, lineHeight: 1.35, color: t.textMuted, opacity: napoveda ? 0.9 : 0, transition: "opacity .18s ease" }}>{napoveda}</span>
      </div>
    );
  }

  // Tělo · the record, kept at the foot of the page with the other graphs
  function BodyHistory() {
    const { t } = useT();
    const st = useStore();
    const date = st.selDate;
    const wbOf = (d) => tmWbOf(st, d);
    const dates = tmWbDates(st);
    const recent = dates.slice(0, 10);
    const last30 = dates.slice(0, 30).reverse();
    const W = 600, H = 44;
    const mkPts = (vals) => vals.map((v, i) => `${vals.length > 1 ? (i / (vals.length - 1)) * W : 0},${H - (Math.max(0, Math.min(5, v)) / 5) * (H - 4) - 2}`).join(" ");
    const ptsWell = mkPts(last30.map((d) => { const w = wbOf(d); return w ? w.well : 0; }));
    /* Průměr se počítá tady a teď. Dřív se bral z DETAIL_STATS — čísla
       zamrzlá v importu, která po jeho vyprázdnění tvrdila „ø 3,6" nad
       prázdným grafem. */
    const prumer = (() => {
      const v = dates.map((d) => { const w = wbOf(d); return w ? w.well : 0; }).filter((x) => x > 0);
      return v.length ? (v.reduce((a, x) => a + x, 0) / v.length).toFixed(1) : null;
    })();
    const ptsEnergy = mkPts(last30.map((d) => { const w = wbOf(d); return w ? w.energy : 0; }));
    const fmtShort = (iso) => { const [, m, d] = iso.split("-"); return (+d) + "." + (+m) + "."; };
    return (
      <div>
        {/* potential + energy over time */}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: H, display: "block" }}>
          <polyline points={`0,${H} ${ptsWell} ${W},${H}`} fill={hexA(t.accent, 0.10)} stroke="none" />
          <polyline points={ptsEnergy} fill="none" stroke={t.sand} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3" opacity="0.85" />
          <polyline points={ptsWell} fill="none" stroke={t.accent} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 14px", marginTop: 4, marginBottom: 12 }}>
          <span style={{ ...subLabel(t), marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 2, background: t.accent, display: "inline-block" }} />{L("Potenciál", "Potential")}{prumer ? " · ø " + prumer : ""}</span>
          <span style={{ ...subLabel(t), marginBottom: 0, display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 0, borderTop: `2px dashed ${t.sand}`, display: "inline-block" }} />{L("Energie", "Energy")}</span>
          <span style={{ ...subLabel(t), marginBottom: 0 }}>{L("posledních", "last")} {last30.length} {L("zaznamenaných dní", "recorded days")}</span>
        </div>

        {/* recent days — horizontal scroll on narrow screens */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: 540 }}>
        {recent.map((d, i) => {
          const w = wbOf(d);
          return (
            <button key={d} onClick={() => st.setSelDate(d)} title={L("Otevřít den", "Open day")} style={{ width: "100%", textAlign: "left", background: d === date ? t.card : "transparent", border: "none", cursor: "pointer", display: "grid", gridTemplateColumns: "44px 44px auto auto auto auto 1fr", alignItems: "center", gap: 12, padding: "8px 6px", borderBottom: "none", borderRadius: 6 }}>
              <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted }}>{fmtShort(d)}</span>
              <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textSec }}>{w.sleep != null ? w.sleep + " h" : "—"}</span>
              <DotMeter value={w.mood} color={t.sage} />
              <DotMeter value={w.energy} color={t.sand} />
              <DotMeter value={w.well} color={t.accent} />
              <span style={{ fontSize: 13 }}>
                <span title="Gratitude" style={{ opacity: w.grat ? 1 : 0.2, display: "inline-flex", color: t.sand }}><TmWbMiska size={14} /></span>
                <span title="Bodhichitta" style={{ opacity: w.bodhi ? 1 : 0.2, display: "inline-flex", color: t.sand }}><TmWbDiamant size={14} /></span>
                <span title={L("Praxe ve světě", "Practice in the world")} style={{ opacity: w.wild ? 1 : 0.2, display: "inline-flex", color: t.sand }}><TmWbKruh size={14} /></span>
              </span>
              <span style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.theme}</span>
            </button>
          );
        })}
        </div>
        </div>
      </div>
    );
  }

  // ---- Habit Tracker rich components ----
  function Ring({ value, size = 64, label }) {
    const { t } = useT();
    const r = (size - 8) / 2, C0 = 2 * Math.PI * r, off = C0 * (1 - value);
    return (
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.border} strokeWidth="6" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.success} strokeWidth="6" strokeLinecap="round" strokeDasharray={C0} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.23,.62,.22,.99)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 17, color: t.heading }}>{label}</span>
        </div>
      </div>
    );
  }

  function StatCard({ value, label }) {
    const { t } = useT();
    return (
      <div className="tm-lift" style={{ flex: 1, minWidth: 110, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "14px 16px" , boxShadow: t.shadow }}>
        <div style={{ fontFamily: "var(--tm-font-display)", fontWeight: 400, fontSize: 28, color: t.heading, lineHeight: 1 }}>{value}</div>
        <div style={{ ...subLabel(t), marginBottom: 0, marginTop: 6 }}>{label}</div>
      </div>
    );
  }

  function HabitCalendar() {
    const { t } = useT();
    const st = useStore();
    // the calendar lives in the present: it opens on the current month and
    // browses freely into the future — a new day always has its page ready
    const curYM = todayISO().slice(0, 7);
    const firstYM = (flow && flow.length) ? flow[0].d.slice(0, 7) : curYM;
    const [ym, setYm] = useState(curYM);
    const shiftYM = (m, k) => { const [y, mo] = m.split("-").map(Number); const d = new Date(y, mo - 1 + k, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
    const HTOT = Math.max(1, st.activeHabits().length);
    const [Y, Mo] = ym.split("-").map(Number);
    const first = new Date(Y, Mo - 1, 1);
    const startW = (first.getDay() + 6) % 7;
    const ndays = new Date(Y, Mo, 0).getDate();
    const cells = [];
    for (let i = 0; i < startW; i++) cells.push(null);
    for (let d = 1; d <= ndays; d++) cells.push(d);
    const MN = L(["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    const pick = (iso) => { st.setSelDate(iso); if (typeof document !== "undefined") { const el = document.getElementById("dayview"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); } };
    return (
      <div className="tm-calwrap" style={{ margin: "0 0 16px", animation: "tmsettle .24s ease-out" }}>
      <div className="tm-calcard" style={{ border: `1px solid ${t.borderSoft}`, borderRadius: 10, padding: 16, background: t.card, boxShadow: t.shadow }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "var(--tm-font-display)", fontSize: 22, color: t.heading }}>{MN[Mo - 1]} {Y}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setYm((m) => shiftYM(m, -1))} disabled={ym <= firstYM} style={calBtn(t, ym <= firstYM)}>‹</button>
            <button onClick={() => setYm((m) => shiftYM(m, 1))} style={calBtn(t, false)}>›</button>
            {ym !== curYM && <button onClick={() => setYm(curYM)} style={{ ...calBtn(t, false), fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, padding: "4px 10px", marginLeft: 6 }}>{L("dnes", "today")}</button>}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {L(["Po", "Út", "St", "Čt", "Pá", "So", "Ne"], ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map((w) => (
            <div key={w} style={{ textAlign: "center", fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: t.textMuted, paddingBottom: 4 }}>{w}</div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = `${Y}-${String(Mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const day = st.getDay(iso);
            const tracked = st.has(iso);
            const frac = day.c / Math.max(1, day.n != null ? day.n : st.activeHabits().length);
            const sel = st.selDate === iso;
            return (
              <button key={i} onClick={() => pick(iso)} title={tracked ? `${d}. ${Mo}. — ${day.c}/${HTOT}` : `${d}.`} className="tm-cal-day" style={{ aspectRatio: "1", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "var(--tm-font-body)", fontSize: 12, cursor: "pointer", color: sel ? t.heading : tracked ? t.text : t.textMuted, background: sel ? t.activeNav : t.mode === "light" ? hexA(t.heading, 0.035) : "rgba(255,255,255,0.035)", border: sel ? `1.5px solid ${t.accent}` : iso === todayISO() ? `1px solid ${hexA(t.accent, 0.55)}` : "1px solid transparent", transition: "background .2s ease, border-color .2s ease" }}><span style={{ lineHeight: 1 }}>{d}</span><span style={{ width: 5, height: 5, borderRadius: "50%", background: tracked ? hexA(t.accent, 0.35 + frac * 0.65) : "transparent" }} /></button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <span style={{ ...subLabel(t), marginBottom: 0 }}>{L("méně", "less")}</span>
          {[0.35, 0.55, 0.8, 1].map((o, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: hexA(t.accent, o) }} />)}
          <span style={{ ...subLabel(t), marginBottom: 0 }}>{HTOT}/{HTOT}</span>
        </div>
      </div>
      </div>
    );
  }

  function HabitMatrix() {
    const { t } = useT();
    const st = useStore();
    const N = 14;
    const { dny, streaks, totals } = usePraxeStats();
    const recent = dny.slice(-N);
    return (
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 520 }}>
          {st.activeHabits().map(({ icon, name, slot: j }) => (
            <div key={name} style={{ display: "grid", gridTemplateColumns: `190px repeat(${N}, 1fr) 56px`, alignItems: "center", gap: 4, padding: "5px 0", borderBottom: `1px solid ${t.borderSoft}` }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text }}>
                <HabitGlyph slot={j} icon={icon} size={16} />{name}
              </span>
              {recent.map((e, i) => (
                // odloženo z rozhodnutí není díra · vlásek místo prázdna
                <span key={i} title={`${e.d} — ${e.h[j] === 1 ? "✓" : e.h[j] === 2 ? "—" : "·"}`} className="tm-cellpop" style={{ height: 16, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", background: e.h[j] === 1 ? t.success : (t.mode === "light" ? hexA(t.heading, 0.065) : hexA(t.text, 0.06)) }}>{e.h[j] === 2 ? <span style={{ width: 8, height: 1.5, borderRadius: 1, background: t.textMuted }} /> : null}</span>
              ))}
              <span style={{ textAlign: "right", fontFamily: "var(--tm-font-body)", fontSize: 12, color: t.textMuted }}>{(streaks[j] || 0) > 0 ? <span style={{ color: t.accent }}>{streaks[j]}</span> : (totals[j] || 0)}</span>
            </div>
          ))}
          <div style={{ ...subLabel(t), marginTop: 8 }}>{L("Posledních", "Last")} {Math.min(N, recent.length)} {L("zaznamenaných dní · měď = aktuální série", "recorded days · copper = current streak")}</div>
        </div>
      </div>
    );
  }

  function MiniChart() {
    const { t } = useT();
    const N = 30;
    const { dny } = usePraxeStats();
    const recent = dny.slice(-N);
    // podíl, ne devítka · jmenovatel nese sám den (odložené návyky se nepočítají)
    const podil = (e) => (e.n ? Math.max(0, Math.min(1, e.c / e.n)) : 0);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90, padding: "0 2px" }}>
          {recent.map((e, i) => (
            // plný den je jediné měděné gesto v grafu · ostatní dny nese šalvěj
            <div key={i} title={`${e.d} — ${e.c}/${e.n} (${e.p}%)`} style={{ flex: 1, height: `${podil(e) * 100}%`, minHeight: 2, borderRadius: 3, background: (e.n && e.c === e.n) ? t.accent : hexA(t.success, 0.4 + podil(e) * 0.5) }} />
          ))}
        </div>
        <div style={{ ...subLabel(t), marginTop: 8 }}>{L("Splněné návyky / den · posledních", "Habits done / day · last")} {Math.min(N, recent.length)} {L("zaznamenaných dní", "recorded days")}</div>
      </div>
    );
  }

  /* ROZVRH DNE · blok se dá chytit, přetáhnout na jinou hodinu a roztáhnout
     přes víc hodin.

     TVAR DAT. Řádek nese navíc `span` (kolik hodin blok zabírá). Hodiny pod
     ním jsou zakryté — nekreslí se a nedají se psát, protože patří tomu bloku
     nad nimi. Jedno zaškrtávátko na celý blok padá samo: zaškrtnutí drží
     PRVNÍ hodina a ostatní neexistují.

     PROČ PODRŽENÍ A NE ROVNOU TAŽENÍ. V řádku se hlavně píše. Kdyby se táhlo
     hned, nešlo by v něm položit kurzor a při rolování prstem po seznamu by
     se bloky náhodně přesouvaly. 380 ms je práh, který používá i Apple pro
     „chytit a přenést"; pod 300 ms se to spouští omylem, nad 500 ms to působí,
     že aplikace nereaguje. Během držení se ozve krátké cvrnknutí, takže je
     poznat, že blok drží — bez toho člověk neví, jestli už může táhnout.

     ROZTAŽENÍ za spodní hranu. Úchyt se ukáže až po chycení, jinak by v každém
     řádku pořád seděl další ovládací prvek.

     A všechno se propíše do kalendáře: tmCalDesired čte `span` a udělá z něj
     událost o správné délce místo hodinového bloku. */

  function EditableSchedule({ date }) {
    const { t } = useT();
    const st = useStore();
    const sched = st.getDay(date).sched || {};
    const nyni = date === todayISO() ? new Date().getHours() : null; // hodina teď · pro bindu u rozvrhu
    const HOD = [];
    for (let h = 6; h <= 23; h++) HOD.push(h + ":00");
    const set = (hour, patch) => st.updateDay(date, (d) => {
      const s = d.sched || {};
      return { sched: { ...s, [hour]: { ...(s[hour] || {}), ...patch } } };
    });
    const spanOf = (h) => Math.max(1, Math.min(24, Number((sched[h] || {}).span) || 1));
    const idxOf = (h) => HOD.indexOf(h);
    // hodina zakrytá blokem shora · nekreslí se
    const zakryto = {};
    HOD.forEach((h, i) => { const sp = spanOf(h); if (((sched[h] || {}).text || "").trim() && sp > 1) for (let k = 1; k < sp && i + k < HOD.length; k++) zakryto[HOD[i + k]] = h; });

    /* Dva různé stavy, ne jeden. `vybrany` je blok, který člověk chytil a drží
       ho vybraný, i když prst pustil — teprve tehdy je úchyt na roztažení
       dosažitelný. `drzi` je vlastní tažení, které trvá jen mezi stiskem
       a puštěním. Když byly obojí jedno, úchyt se objevil při držení a zmizel
       dřív, než na něj šlo sáhnout. */
    const [vybrany, setVybrany] = useState(null);
    const [drzi, setDrzi] = useState(null);     // { hour, mode: "move"|"resize" }
    const [cil, setCil] = useState(null);       // rozpracovaný cíl tažení (kreslí náhled)
    /* Tentýž cíl ještě jednou v refu. Vykreslení potřebuje stav, ale `konec`
       běží z posluchače, který vznikl při chycení — ze stavu by četl hodnotu
       starou jako to chycení a přesun by se pokaždé zahodil. */
    const cilRef = React.useRef(null);
    const nastavCil = (h) => { cilRef.current = h; setCil(h); };
    const hnutoRef = React.useRef(false);
    const drzRef = React.useRef(null);
    const rowsRef = React.useRef({});
    const cvrnk = () => { try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {} };

    const mapaRef = React.useRef([]);
    const zmerRadky = () => {
      mapaRef.current = HOD.map((h) => { const el = rowsRef.current[h]; if (!el) return null; const r = el.getBoundingClientRect(); return { h: h, s: r.top + r.height / 2 }; }).filter(Boolean);
    };
    const hodinaZBodu = (y) => {
      let nej = null, nejd = 1e9;
      const m = mapaRef.current;
      for (let i = 0; i < m.length; i++) { const d = Math.abs(y - m[i].s); if (d < nejd) { nejd = d; nej = m[i].h; } }
      return nej;
    };
    const konec = () => {
      const d = drzRef.current;
      const cil = cilRef.current;
      if (d && cil != null) {
        if (d.mode === "move" && cil !== d.hour) {
          const row = sched[d.hour] || {};
          const cilRow = sched[cil] || {};
          // přesun · původní hodina se uvolní, cílová dostane obsah i délku
          st.updateDay(date, (den) => {
            const next = { ...(den.sched || {}) };
            delete next[d.hour];
            next[cil] = { ...cilRow, text: row.text, done: row.done, span: row.span || 1, src: row.src, gid: row.gid };
            return { sched: next };
          });
        } else if (d.mode === "resize" && hnutoRef.current) {
          const sp = Math.max(1, idxOf(cil) - idxOf(d.hour) + 1);
          set(d.hour, { span: sp });
        } else if (d.mode === "resize") {
          // ťuknutí na spodní šipku · o hodinu dolů
          set(d.hour, { span: Math.max(1, Math.min(HOD.length - idxOf(d.hour), spanOf(d.hour) + 1)) });
        }
      }
      /* Když se nehnulo, blok zůstane vybraný — jinak by úchyt zmizel dřív,
         než na něj jde sáhnout. Po skutečném tažení se výběr pouští;
         po ťuknutí na šipku ne, aby šlo ťuknout znovu. */
      if (d && hnutoRef.current) setVybrany(null);
      else if (d) setVybrany(d.hour);
      drzRef.current = null; setDrzi(null); nastavCil(null); hnutoRef.current = false;
    };
    const posledniRef = React.useRef(null);
    React.useEffect(() => {
      if (!drzi) return;
      /* Dvě věci se tu opravily najednou.

         Za prvé: v závislostech byl `cil`. Každé překročení hodiny tedy celý
         efekt zbouralo a znovu postavilo — odpojit čtyři posluchače, připojit
         čtyři posluchače. Šedesátkrát za vteřinu. Závislost je teď jediná:
         drží se, nebo ne.

         Za druhé: setCil šel při každém pohnutí, i když hodina zůstala stejná.
         To znamenalo překreslit osmnáct řádků kvůli hodnotě, která se nezměnila.
         Poslední hodina se pamatuje v refu a překresluje se jen při změně. */
      posledniRef.current = null;
      let ramecek = 0;
      const move = (e) => {
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const h = hodinaZBodu(y);
        if (h && h !== posledniRef.current) {
          posledniRef.current = h;
          const d = drzRef.current;
          if (d && h !== d.hour) hnutoRef.current = true;
          nastavCil(h);
          /* Při roztahování blok roste a odsune řádky pod sebou — mapa změřená
             při chycení tím zastará. Přeměří se po překreslení, a jen když se
             hodina opravdu změnila. */
          if (d && d.mode === "resize") {
            if (ramecek) cancelAnimationFrame(ramecek);
            ramecek = requestAnimationFrame(() => { ramecek = 0; zmerRadky(); });
          }
        }
        if (e.cancelable) e.preventDefault();
      };
      const up = () => konec();
      document.addEventListener("touchmove", move, { passive: false });
      document.addEventListener("mousemove", move);
      document.addEventListener("touchend", up);
      document.addEventListener("mouseup", up);
      return () => {
        if (ramecek) cancelAnimationFrame(ramecek);
        document.removeEventListener("touchmove", move); document.removeEventListener("mousemove", move);
        document.removeEventListener("touchend", up); document.removeEventListener("mouseup", up);
      };
    }, [drzi]);

    // Dřív se chycení úchytu rovnou počítalo za pohyb, takže pouhé ťuknutí
    // nešlo odlišit od tažení. Teď se pohyb pozná až podle pohybu.
    const chyt = (h, mode) => { zmerRadky(); drzRef.current = { hour: h, mode: mode }; hnutoRef.current = false; setDrzi({ hour: h, mode: mode }); nastavCil(h); setVybrany(h); cvrnk(); };
    // ťuknutí místo tažení · ±hodina, nikdy pod jednu
    const oHodinu = (h, k) => { const sp = Math.max(1, Math.min(HOD.length - idxOf(h), spanOf(h) + k)); set(h, { span: sp }); setVybrany(h); cvrnk(); };
    const stiskRef = React.useRef(null);
    const stisk = (h) => (e) => {
      if (!((sched[h] || {}).text || "").trim()) return;
      const y0 = e.touches ? e.touches[0].clientY : e.clientY;
      stiskRef.current = setTimeout(() => { chyt(h, "move"); }, 380);
      const zrus = (ev) => {
        const y = ev.touches ? (ev.touches[0] || {}).clientY : ev.clientY;
        if (y != null && Math.abs(y - y0) > 9) { clearTimeout(stiskRef.current); odpoj(); }
      };
      const pust = () => { clearTimeout(stiskRef.current); odpoj(); };
      const odpoj = () => {
        document.removeEventListener("touchmove", zrus); document.removeEventListener("mousemove", zrus);
        document.removeEventListener("touchend", pust); document.removeEventListener("mouseup", pust);
      };
      document.addEventListener("touchmove", zrus, { passive: true });
      document.addEventListener("mousemove", zrus);
      document.addEventListener("touchend", pust);
      document.addEventListener("mouseup", pust);
    };

    const bloky = [["Ráno", "Morning", 6, 11], ["Odpoledne", "Afternoon", 12, 17], ["Večer", "Evening", 18, 23]];
    /* Dlouhý stisk je tu gesto, ne pokus označit text. Dokud se do řádku
       nepíše, je označování i systémová nabídka vypnutá — jinak naskočí lupa
       a tažení se rozpadne dřív, než začne. V poli, do kterého se právě píše,
       zůstává všechno normální. */
    const [pisu, setPisu] = useState(null);
    const bezVyberu = { userSelect: "none", WebkitUserSelect: "none", MozUserSelect: "none", WebkitTouchCallout: "none" };
    return (
      <div style={bezVyberu} onContextMenu={(e) => { if (pisu == null) e.preventDefault(); }} onCopy={(e) => { if (pisu == null) e.preventDefault(); }}>
        {(drzi || vybrany) && (
          <div style={{ position: "sticky", top: 0, zIndex: 3, display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.accentInk || t.accent, background: t.card, padding: "4px 0 6px" }}>
            <span style={{ flex: 1, minWidth: 0 }}>{drzi && drzi.mode === "resize" ? L("Táhni dolů a roztáhni…", "Drag down to stretch…") : drzi ? L("Táhni na jinou hodinu…", "Drag to another hour…") : L("Blok je chycený · táhni ho, nebo dole ťukni na šipku", "Block is held · drag it, or tap an arrow below")}</span>
            {!drzi && vybrany && (
              <>
                {spanOf(vybrany) > 1 && <button onClick={() => { set(vybrany, { span: 1 }); }} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 999, padding: "3px 10px", minHeight: 30, cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>{L("Na hodinu", "One hour")}</button>}
                <button onClick={() => setVybrany(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 15, minHeight: 30, width: 26 }}>×</button>
              </>
            )}
          </div>
        )}
        {bloky.map(([cz, en, od, doH]) => (
          <div key={cz} style={{ marginBottom: 14 }}>
            <div style={{ ...subLabel(t), marginBottom: 4 }}>{L(cz, en)}</div>
            {HOD.filter((h) => { const n = parseInt(h, 10); return n >= od && n <= doH; }).map((h) => {
              if (zakryto[h]) return null;
              const cur = sched[h] || {};
              const psano = String(cur.text || "").trim();
              const sp = psano ? spanOf(h) : 1;
              const jeDrzeny = (drzi && drzi.hour === h) || vybrany === h;
              const jeCil = drzi && drzi.mode === "move" && cil === h && cil !== drzi.hour;
              const nahled = drzi && drzi.mode === "resize" && drzi.hour === h && cil ? Math.max(1, idxOf(cil) - idxOf(h) + 1) : sp;
              const konecH = HOD[Math.min(HOD.length - 1, idxOf(h) + nahled)] || "24:00";
              const jeNyni = nyni != null && nyni >= parseInt(h, 10) && nyni < parseInt(h, 10) + nahled;
              return (
                <div key={h} ref={(el) => { rowsRef.current[h] = el; }}
                  onTouchStart={stisk(h)} onMouseDown={stisk(h)}
                  style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 10, padding: "5px 0",
                    borderBottom: `1px solid ${jeCil ? t.accent : t.borderSoft}`,
                    minHeight: nahled > 1 ? 30 + (nahled - 1) * 26 : undefined,
                    background: jeDrzeny ? hexA(t.accent, 0.10) : jeCil ? hexA(t.accent, 0.05) : "transparent",
                    borderRadius: jeDrzeny || jeCil ? 8 : 0,
                    boxShadow: jeDrzeny ? t.shadow : "none",
                    // výška se během tažení nesmí animovat · rozpohybovaná mřížka
                    // posouvá řádky pod prstem a cíl se pak trefuje mimo
                    transition: drzi ? "background .14s ease" : "background .14s ease, min-height .14s ease",
                    touchAction: drzi || vybrany === h ? "none" : "auto", ...bezVyberu }}>
                  <button onClick={() => set(h, { done: !cur.done })} title={L("Hotovo", "Done")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, marginTop: 1, flexShrink: 0 }}><Check done={!!cur.done} /></button>
                  {/* bindu i čas mají stejnou výšku řádku · jinak tečka plave nad linkou */}
                  <span style={{ width: 9, height: 18, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{jeNyni && <Bindu size={5} />}</span>
                  <span style={{ fontFamily: "var(--tm-font-tag)", fontSize: 13, lineHeight: "18px", letterSpacing: "0.05em", color: t.sage, width: nahled > 1 ? 84 : 46, flexShrink: 0, marginTop: 1, whiteSpace: "nowrap" }}>
                    {h}{nahled > 1 ? "–" + konecH : ""}
                  </span>
                  <input value={cur.text || ""} onChange={(e) => set(h, { text: e.target.value })} placeholder="…"
                    onFocus={() => { setVybrany(null); setPisu(h); }} onBlur={() => setPisu((x) => (x === h ? null : x))}
                    data-pise={pisu === h ? "1" : undefined}
                    readOnly={!!drzi}
                    style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", color: cur.done ? t.textMuted : t.text, fontFamily: "var(--tm-font-body)", fontSize: 13, outline: "none", textDecorationLine: cur.done ? "line-through" : "none", marginTop: 1,
                      userSelect: pisu === h ? "text" : "none", WebkitUserSelect: pisu === h ? "text" : "none", WebkitTouchCallout: "none" }} />
                  {psano && drzi && drzi.hour === h && drzi.mode === "move" && (
                    <span aria-hidden="true" style={{ flexShrink: 0, color: t.accent, fontSize: 12, letterSpacing: "0.1em" }}>⠿</span>
                  )}
                  {/* úchyt na délku · ukáže se až u drženého bloku.
                      Ťuknutí = o hodinu, tažení = kam se dotáhne. */}
                  {psano && jeDrzeny && (
                    <span style={{ position: "absolute", left: "50%", bottom: -11, transform: "translateX(-50%)", display: "inline-flex", zIndex: 2, borderRadius: 11, border: `1px solid ${t.accent}`, background: t.card, overflow: "hidden", boxShadow: t.shadow }}>
                      {sp > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); oHodinu(h, -1); }} onTouchStart={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}
                          title={L("O hodinu kratší", "One hour shorter")}
                          style={{ border: "none", borderRight: `1px solid ${hexA(t.accent, 0.4)}`, background: "transparent", cursor: "pointer", color: t.accent, fontSize: 12, lineHeight: 1, width: 32, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>⌃</button>
                      )}
                      <button onTouchStart={(e) => { e.stopPropagation(); chyt(h, "resize"); }} onMouseDown={(e) => { e.stopPropagation(); chyt(h, "resize"); }}
                        title={L("Ťukni pro hodinu navíc · táhni pro víc", "Tap for one more hour · drag for more")}
                        style={{ border: "none", background: "transparent", cursor: "ns-resize", color: t.accent, fontSize: 12, lineHeight: 1, width: 36, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>⌄</button>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        {st.editMode && (
          <p style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, margin: "2px 2px 0", lineHeight: 1.55 }}>
            {L("Podrž řádek a přetáhni ho na jinou hodinu. U drženého bloku se dole objeví šipky — ťuknutím se blok prodlouží nebo zkrátí o hodinu, tažením dolů se roztáhne rovnou kam chceš. Zaškrtnutí zůstává jedno.", "Hold a row and drag it to another hour. Arrows appear beneath the held block — tap to lengthen or shorten it by an hour, or drag down to stretch it straight to where you want. It keeps one checkbox.")}
          </p>
        )}
      </div>
    );
  }

  // inline habit management inside the day card · edit mode only
  function HabitInlineEditor() {
    const { t } = useT();
    const st = useStore();
    const defs = st.habitDefs();
    const act = defs.filter((x) => !x.archived);
    const [dragSlot, setDragSlot] = useState(null);
    const [overSlot, setOverSlot] = useState(null);
    const upd = (slot, patch) => st.setHabitDefs(defs.map((d) => (d.slot === slot ? { ...d, ...patch } : d)));
    const dropOn = (targetSlot) => {
      if (dragSlot == null || dragSlot === targetSlot) { setDragSlot(null); setOverSlot(null); return; }
      const order = [...act];
      const from = order.findIndex((d) => d.slot === dragSlot);
      const to0 = order.findIndex((d) => d.slot === targetSlot);
      const [item] = order.splice(from, 1);
      let to = order.findIndex((d) => d.slot === targetSlot);
      if (from < to0) to = to + 1; // tažení dopředu -> za cíl
      order.splice(to, 0, item);
      st.setHabitDefs([...order, ...defs.filter((x) => x.archived)]);
      setDragSlot(null); setOverSlot(null);
    };
    const addHabit = () => st.setHabitDefs([...defs, { slot: defs.reduce((m, d) => Math.max(m, d.slot), -1) + 1, icon: "○", name: L("Nový návyk", "New habit") }]);
    const archived = defs.filter((x) => x.archived);
    return (
      <div>
        <div style={{ ...subLabel(t), marginBottom: 6 }}>{L("Přepiš název přímo v dlaždici · ⠿ přetáhni pro změnu pořadí", "Rename directly in the tile · ⠿ drag to reorder")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 8 }}>
          {act.map((d) => (
            <div
              key={d.slot}
              onDragOver={(e) => { e.preventDefault(); setOverSlot(d.slot); }}
              onDragLeave={() => setOverSlot((x) => (x === d.slot ? null : x))}
              onDrop={(e) => { e.preventDefault(); dropOn(d.slot); }}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 8px", borderRadius: 8, background: t.card, border: `1px dashed ${overSlot === d.slot && dragSlot !== d.slot ? t.accent : t.border}`, opacity: dragSlot === d.slot ? 0.45 : 1, transition: "border-color .12s ease, opacity .12s ease" }}
            >
              <span
                draggable
                onDragStart={(e) => { setDragSlot(d.slot); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", "habit:" + d.slot); }}
                onDragEnd={() => { setDragSlot(null); setOverSlot(null); }}
                title={L("Přetáhni pro změnu pořadí", "Drag to reorder")}
                style={{ cursor: "grab", color: t.textMuted, fontSize: 13, padding: "2px 2px", userSelect: "none", touchAction: "none" }}
              >⠿</span>
              <input value={d.icon} onChange={(e) => upd(d.slot, { icon: e.target.value.slice(0, 4) })} style={{ width: 30, background: "transparent", border: "none", outline: "none", textAlign: "center", fontSize: 15 }} />
              <input value={d.name} onChange={(e) => upd(d.slot, { name: e.target.value })} placeholder={L("Název návyku…", "Habit name…")} style={{ flex: 1, minWidth: 60, background: "transparent", border: "none", outline: "none", borderBottom: `1px dashed ${t.borderSoft}`, fontFamily: "var(--tm-font-body)", fontSize: 13, color: t.text, padding: "1px 0" }} />
              <button title={L("Archivovat — historie zůstane", "Archive — history stays")} onClick={() => st.ask(L(`Archivovat návyk „${d.name}"?`, `Archive habit "${d.name}"?`), () => upd(d.slot, { archived: true }))} style={{ ...iconBtn(t), width: 22, height: 22, minWidth: 22, padding: 0, fontSize: 12, border: "none", color: t.textMuted }}>✕</button>
            </div>
          ))}
          <button onClick={addHabit} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 10px", borderRadius: 8, background: "transparent", border: `1px dashed ${t.border}`, cursor: "pointer", color: t.inkSand, fontFamily: "var(--tm-font-body)", fontSize: 13 }}>＋ {L("návyk", "habit")}</button>
        </div>
        {archived.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ ...subLabel(t), marginBottom: 0 }}>{L("Archivované:", "Archived:")}</span>
            {archived.map((d) => (
              <button key={d.slot} title={L("Obnovit", "Restore")} onClick={() => upd(d.slot, { archived: false })} style={{ background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 12, padding: "2px 10px", cursor: "pointer", color: t.textMuted, fontFamily: "var(--tm-font-body)", fontSize: 12 }}>{d.icon} {d.name} ↺</button>
            ))}
          </div>
        )}
      </div>
    );
  }

  function TmPasPrahu({ prah, onPrah, day }) {
    const { t } = useT();
    const polozky = [
      { k: "rano", cz: "Ráno", en: "Morning" },
      { k: "den", cz: "Den", en: "Day" },
      { k: "vecer", cz: "Večer", en: "Evening" },
    ];
    return (
      <div role="tablist" style={{ display: "flex", alignItems: "center", gap: 4, borderBottom: `1px solid ${t.borderSoft}`, margin: "18px 0 4px" }}>
        {polozky.map((x) => {
          const on = prah === x.k;
          return (
            <button key={x.k} role="tab" aria-selected={on} onClick={() => onPrah(x.k)}
              style={{ background: "transparent", border: "none", borderBottom: `2px solid ${on ? t.accent : "transparent"}`, cursor: "pointer",
                padding: "8px 14px 9px", marginBottom: -1, display: "flex", alignItems: "center", gap: 7,
                fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12,
                color: on ? (t.accentInk || t.accent) : t.textMuted, transition: "color .18s ease, border-color .18s ease" }}>
              {on && <Bindu size={5} />}
              {L(x.cz, x.en)}
              {/* TEČKA · tenhle práh v tomhle dni něco nese. Bez ní vypadá karta
                  otevřená v poledne, jako by ráno a večer nikdy nebyly. */}
              {!on && tmPrahMa(day, x.k) && <span title={L("něco tu je", "something here")} style={{ width: 4, height: 4, borderRadius: "50%", background: t.sand, opacity: 0.85, marginLeft: -2 }} />}
            </button>
          );
        })}
      </div>
    );
  }

  function DayView({ go, prah: prahIn, calOpen, onCal }) {
    const { t } = useT();
    const st = useStore();
    // POJISTKA · kdyby sem někdy přišlo jméno, které tahle karta nezná, vykreslí
    // se Den. Prázdná karta je horší než špatná sekce: vypadá jako ztracená data.
    const prah = TM_PRAHY.indexOf(prahIn) >= 0 ? prahIn : "den";
    const date = st.selDate;
    const day = st.getDay(date);
    const tracked = st.has(date);
    const HTOT = Math.max(1, st.activeHabits().length);
    const DEN = Math.max(0, HTOT - (day.r || 0));   // kolik jich dnes vůbec platí
    // dvě rychlá klepnutí po sobě četla týž snímek `day.h` a druhé přepsalo první
    const uloz = (j, v) => {
      let vysl = null;
      st.updateDay(date, (d) => {
        const h = (d.h || EMPTY_H).slice();
        while (h.length <= j) h.push(0);
        h[j] = v;
        vysl = h;
        return { h };
      });
      return vysl || [];
    };
    /* TŘETÍ STAV · dlouhé podržení řekne „dnes ne, schválně". Po podržení pošle
       prohlížeč ještě klepnutí — spolkne se právě jedno, ne časové okno, aby šlo
       hned nato klepnout jinam. (Tatáž past jako u malování výběru v dávce 37.) */
    const drz = React.useRef({ t: null, snez: false });
    const drzDat = React.useRef({ t: null, ok: false }); // podržení data → memento
    const dolu = (j) => {
      drz.current.snez = false;
      clearTimeout(drz.current.t);
      drz.current.t = setTimeout(() => {
        drz.current.snez = true;
        uloz(j, day.h[j] === 2 ? 0 : 2);
        tmBuzz([9, 40, 9], st.tmCfg().haptics);
      }, 520);
    };
    const pust = () => clearTimeout(drz.current.t);
    React.useEffect(() => () => clearTimeout(drz.current.t), []);
    const toggle = (j) => {
      if (drz.current.snez) { drz.current.snez = false; return; }
      const h = uloz(j, day.h[j] === 1 ? 0 : 1);
      // jemný hmat · doknutí odpoví, plný den odpoví o něco hlouběji (řídí Vibrace v nastavení časovače)
      if (h[j] === 1) {
        const done = st.activeHabits().reduce((a, x) => a + (h[x.slot] === 1 ? 1 : 0), 0);
        const zbyva = st.activeHabits().reduce((a, x) => a + (h[x.slot] === 2 ? 0 : 1), 0);
        tmBuzz(done >= zbyva ? [16, 70, 26] : [10], st.tmCfg().haptics);
      }
    };
    return (
      <div id="dayview" style={{ margin: "8px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", rowGap: 8, minWidth: 0 }}>
            <button onClick={() => st.setSelDate(shiftISO(date, -1))} style={calBtn(t, false)}>‹</button>
            <div>
              {/* klepnutí rozbalí kalendář · dlouhé podržení otevře memento mori */}
              <div role="button" title={L("kalendář · podržením memento mori", "calendar · hold for memento mori")}
                onPointerDown={() => { clearTimeout(drzDat.current.t); drzDat.current.t = setTimeout(() => { drzDat.current.ok = true; go && go("memento"); }, 550); }}
                onPointerUp={() => clearTimeout(drzDat.current.t)}
                onPointerLeave={() => clearTimeout(drzDat.current.t)}
                onContextMenu={(e) => e.preventDefault()}
                onClick={() => { if (drzDat.current.ok) { drzDat.current.ok = false; return; } onCal && onCal(); }}
                style={{ fontFamily: "var(--tm-font-display)", fontSize: 22, color: t.heading, cursor: "pointer", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", borderBottom: calOpen ? `2px solid ${t.accent}` : "2px solid transparent" }}>{fmtCZ(date)}</div>
            </div>
            <button onClick={() => st.setSelDate(shiftISO(date, 1))} style={calBtn(t, false)}>›</button>
          </div>
          <button onClick={() => st.setSelDate(todayISO())} style={{ ...calBtn(t, false), fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, padding: "5px 12px", marginLeft: 10 }}>{L("dnes", "today")}</button>
        </div>

        {calOpen && <HabitCalendar />}

        {/* RÁNO · jedno slovo, než se den rozjede */}
        {prah === "rano" && <RanniZamer date={date} go={go} />}
        {/* NÁVYKY · páteř dne — stojí ve všech třech prazích, protože odškrtnout
            se dá kdykoli. Nic jiného se neopakuje. */}

        {st.editMode ? (
          <HabitInlineEditor />
        ) : (
        <div className="tm-habitgrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px,1fr))", gap: 8, marginTop: prah === "rano" ? 4 : 0 }}>
          {st.activeHabits().map(({ icon, name, slot: j }) => (
            <button key={j} onClick={() => toggle(j)} onPointerDown={() => dolu(j)} onPointerUp={pust} onPointerLeave={pust} onPointerCancel={pust}
              onContextMenu={(e) => e.preventDefault()} className="tm-nav-item tm-hbtn"
              title={day.h[j] === 2 ? L("Dnes ne, schválně · podrž a vrátí se", "Not today, on purpose · hold to undo") : L("Klepni · drž a odlož na dnešek", "Tap · hold to set aside for today")}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", minHeight: 48, borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
              {/* prázdné · drženo · odloženo z rozhodnutí — tři podoby, ne dvě */}
              {day.h[j] === 2 ? (
                <span style={{ width: 13, height: 13, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${t.borderSoft}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: 7, height: 1.5, borderRadius: 1, background: t.textMuted }} />
                </span>
              ) : (
                <span className={"tmink" + (day.h[j] === 1 ? " on" : "")} style={{ width: 13, height: 13, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${day.h[j] === 1 ? "transparent" : t.border}`, background: day.h[j] === 1 ? (day.c >= DEN ? t.accent : t.sage) : "transparent", transition: "background .4s ease, border-color .4s ease" }} />
              )}
              <HabitGlyph slot={j} icon={icon} size={19} />
              <span style={{ fontFamily: "var(--tm-font-body)", fontSize: 13, color: day.h[j] === 1 ? t.text : t.textSec, opacity: day.h[j] === 2 ? 0.55 : 1, textDecoration: "none", transition: "color .3s ease, opacity .3s ease" }}>{name}</span>
            </button>
          ))}
        </div>
        )}

        {/* TICHÝ UKAZATEL · postup jako záznam dole, ne měřidlo u dveří. */}
        {/* JEDNA ČÁRA, NE DVĚ.
            Vlas nad ukazatelem a samotný ukazatel končily na témže pixelu
            vpravo. Dva krátké konce nad sebou u pravého okraje čte oko jako
            roh rámečku — a v tom rohu jako drobná tečka. Vlas proto zmizel:
            odděluje sám ukazatel, který je tu stejně. A vpravo mu zůstane
            kousek vzduchu, aby s ničím pod sebou nelícoval. */}
        {!st.editMode && day.c < DEN && (
          <div data-pv="prsten" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, paddingRight: 10 }}>
            <span style={{ fontFamily: "var(--tm-font-tag)", letterSpacing: "0.12em", fontSize: 12, color: t.textMuted, whiteSpace: "nowrap" }}>{day.c + L(" z ", " of ") + DEN}</span>
            <div style={{ flex: 1, height: 3, background: t.borderSoft, overflow: "hidden" }}>
              <div style={{ height: "100%", width: Math.round((day.c / Math.max(1, DEN)) * 100) + "%", background: t.sand, opacity: 0.7 }} />
            </div>
            {day.r > 0 && <span style={{ fontFamily: "var(--tm-font-body)", fontStyle: "italic", fontSize: 12, color: t.textMuted, whiteSpace: "nowrap" }}>{day.r + L(" odloženo", " set aside")}</span>}
          </div>
        )}

        {/* PEČEŤ · při plném dni jediný tichý řádek — vrchol a konec, žádné konfety */}
        {DEN > 0 && day.c >= DEN && !st.editMode && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, margin: "16px 0 0", animation: "tmsettle .6s ease-out" }}>
            <Bindu size={6} />
            <span style={{ fontFamily: "var(--tm-font-display)", fontStyle: "italic", fontSize: 17, color: t.inkSand || t.sand }}>{L("Den držen.", "The day held.")}</span>
          </div>
        )}

        {/* DEN · plán uprostřed, hned pod trackerem návyků; cíle dne pod ním. */}
        {prah === "den" && (
          <div data-pv="cile" style={{ marginTop: 6 }}>
            {DenVPraxi ? <DenVPraxi date={date} /> : null}
            <Toggle summary={L("Plán", "Plan")} color="orange" centered bezHrany><EditableSchedule date={date} /></Toggle>
            <div style={{ height: 20 }} />
            <div style={{ ...subLabel(t), marginBottom: 4 }}>{L("Dnešní cíle", "Today's goals")}</div>
            <DayTasks date={date} />
          </div>
        )}

        {/* VEČER · ohlédnutí a status dne sdílí jeden řádek, bez rámečků. */}
        {prah === "vecer" && (
          <div data-pv="vecer" style={{ marginTop: 6 }}>
            {/* stav dne nad dvířky · pod nimi by konkuroval odpovědím.
                Šest pixelů vzduchu nad ním bylo málo: ukazatel postupu se svým
                vlasem visel textu přímo na hlavě. */}
            {/* Věta si drží odstup od hrany displeje · dosud končila přesně
                na okraji sloupce a vypadala jako přilepená. */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16, paddingRight: 10 }}><StatusCycle date={date} /></div>
            <Toggle summary={L("Ohlédnutí", "Review")} color="orange" centered bezHrany><VecerniOhlednuti date={date} /></Toggle>
            <div style={{ height: 22 }} />
            <WellbeingTracker />
            {/* Deník dne · v klientském domě je Deník volitelný a soukromý.
                Když ho člověk nemá otevřený, tenhle pruh v kartě nevzniká —
                ne že by se schoval. */}
            {(() => { const c = (st && st.caps) || caps; return (!c || c.journal !== false) ? <JournalOfDay date={date} go={go} /> : null; })()}
          </div>
        )}
      </div>
    );
  }

  function PraxeOverview({ go }) {
    const { t } = useT();
    const st = useStore();
    const { dny, days, avg, perfect, streaks, sloty } = usePraxeStats();
    const pocetNavyku = sloty.length;
    const nejdelsi = sloty.length ? Math.max(...sloty.map((j) => streaks[j] || 0)) : 0;
    if (!days) {
      return (
        <Prazdno kind="prvni" plain
          fakt={L("Zatím tu není zaznamenaný žádný den.", "No day is recorded here yet.")}
          pozvani={L("Odškrtni dnes první návyk — přehled začne od něj.", "Tick your first habit today — the overview starts there.")} />
      );
    }
    return (
      <>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch", margin: "4px 0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "14px 18px" }}>
            <Ring value={avg / 100} label={avg + "%"} />
            <div><div style={subLabel(t)}>{L("Podíl splněných", "Share of habits")}<br/>{L("návyků", "kept")}</div></div>
          </div>
          <StatCard value={days} label={L("Dní se záznamem", "Days with a record")} />
          {/* Nejdelší řada z hlavní řady zmizela · výpočet zůstává uvnitř pro
              starší funkce, ale přehled není známka u dveří. Dny s celou praxí
              zůstávají jako popisný údaj, ne jako druhá pečeť. */}
          <StatCard value={perfect} label={pocetNavyku ? L(`Dní ${pocetNavyku}/${pocetNavyku}`, `${pocetNavyku}/${pocetNavyku} days`) : L("Plných dní", "Full days")} />
        </div>

        <div style={{ height: 22 }} />
        <Eyebrow>{L("Praxe podle dní", "Practice by day")}</Eyebrow>
        <HabitMatrix />

        <div style={{ height: 22 }} />
        <Eyebrow>{L("Vývoj v čase", "Over time")}</Eyebrow>
        <MiniChart />

        <div style={{ height: 22 }} />
        <Eyebrow>{L("Tělo v čase", "Body over time")}</Eyebrow>
        <BodyHistory />

        <div style={{ height: 18 }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "4px 0 4px" }}>
          <LinkPill icon={<span style={{ color: t.sand, display: "inline-flex" }}><BookIcon size={13} /></span>} label={L("Atomic Habits · výpisek", "Atomic Habits · notes")} onClick={() => go("atomic")} />
        </div>
      </>
    );
  }

  // ---- RYTINY NÁVYKŮ A OBLASTÍ · Vlna 2 (27. 7. 2026) --------------------------
  // Jedna tužka pro celý dům: tah 1,5, kulaté konce, plná jen bindu a drobný
  // akcent. Rytina se ukáže jen tam, kde položka stále nese výchozí emoji —
  // vlastní volby a nové položky zůstávají u emoji, data se nemigrují.
  // Kytara a nota vycházejí z geometrie Lucide (ISC), přepsané do tahu domu.
  // Trénink těla nese tutéž horu jako místnost Trénink; Tělo je střední kanál
  // se dvěma nádí; drak Podnikání je jen proud, který stoupá (zadání 27. 7.).
  function TmRyt({ size = 17, children }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>{children}</svg>
    );
  }

  const HABIT_RYT = {
    0: (s) => <TmRyt size={s}><path d="M2.5 13c2.2 0 2.6-2.4 5-2.4s2.6 2.4 5 2.4 2.6-2.4 5-2.4 2.4 2.4 4 2.4" /><path d="M4 17.5c1.8 0 2.2-1.8 4.2-1.8s2.2 1.8 4.2 1.8 2.2-1.8 4.2-1.8 2 1.8 3.4 1.8" opacity=".55" /></TmRyt>,
    1: (s) => <TmRyt size={s}><path d="M12 20.5V9" /><path d="M12 12c-3 .2-5-1.6-5.2-4.6C9.8 7.2 11.8 9 12 12Z" /><path d="M12 9c.2-3 2.2-4.8 5.2-4.6C17 7.4 15 9.2 12 9Z" /><path d="M8.5 20.5h7" opacity=".55" /></TmRyt>,
    2: (s) => <TmRyt size={s}><path d="m11.9 12.1 4.514-4.514" /><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z" /><path d="m6 16 2 2" /><path d="M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z" /></TmRyt>,
    3: (s) => <TmRyt size={s}><path d="M3.3 19.3 10.4 6.6l3.7 6.6 2.6-4.4 4.05 10.5" /><path d="M3.3 19.3h17.45" opacity=".6" /><path d="M5.1 18.6 10.75 8.6" opacity=".4" /></TmRyt>, // táž hora jako Trénink, překreslená do tahu 1,5 (jednotná tloušťka sady)
    4: (s) => <TmRyt size={s}><rect x="7.5" y="3.5" width="9" height="17" rx="2.2" /><path d="M14.6 10.8a2.9 2.9 0 1 1-3.4-3.9 3.3 3.3 0 0 0 3.4 3.9Z" opacity=".6" /></TmRyt>,
    5: (s) => <TmRyt size={s}><path d="M12 6.5c-1.8-1.6-4.4-2-7.5-1.4v12.4c3.1-.6 5.7-.2 7.5 1.4 1.8-1.6 4.4-2 7.5-1.4V5.1c-3.1-.6-5.7-.2-7.5 1.4Z" /><path d="M12 6.5v12.4" opacity=".55" /></TmRyt>,
    6: (s) => <TmRyt size={s}><path d="M12 4.5c1.8 2.2 1.8 4.8 0 7-1.8-2.2-1.8-4.8 0-7Z" /><path d="M6.5 8.5c2.6.6 4.2 2.6 4.4 5.2-2.7-.3-4.5-2.4-4.4-5.2Z" /><path d="M17.5 8.5c.1 2.8-1.7 4.9-4.4 5.2.2-2.6 1.8-4.6 4.4-5.2Z" /><path d="M5.5 16.5c4 2 9 2 13 0" opacity=".55" /></TmRyt>,
    7: (s) => <TmRyt size={s}><path d="M12 3.5c.6 2.8 3.4 4.2 4.4 6.8.9 2.4.3 5.2-1.7 7-2.6 2.3-6.8 2.1-9-.6-1.7-2.1-1.8-5.2-.2-7.4.5 1 1.3 1.7 2.4 2-.9-2.6.4-5.9 4.1-7.8Z" /></TmRyt>,
    8: (s) => <TmRyt size={s}><path d="M4.5 12.5h15c0 4.1-3.4 7-7.5 7s-7.5-2.9-7.5-7Z" /><path d="M9 8.7c-.8-1-.8-2 0-3M12.8 9.2c-.8-1-.8-2.2 0-3.4M15.8 8.7c-.6-.8-.6-1.7 0-2.6" opacity=".55" /></TmRyt>,
  };

  function HabitGlyph({ slot, icon, size = 17 }) {
    const { t } = useT();
    const def = HABIT_DEFS[slot];
    const R = HABIT_RYT[slot];
    if (R && def && icon === def[0]) return <span style={{ display: "inline-flex", color: t.sand, flexShrink: 0 }}>{R(size)}</span>;
    return <span style={{ fontSize: Math.max(13, size - 4) }}>{icon}</span>;
  }
  /* ZNAKY U CÍLE. Byly to znaky z písma — ◍ ◌ ▦ ▤ — které v každém systému
     vypadají jinak a nic neříkají. Tady jsou kreslené, na téže mřížce jako
     rytiny oblastí, a každý je stavěný z geometrie, která to slovo nese:

     · Dosažitelnost · trojúhelník v kruhu. Trojúhelník je nejmenší tuhý tvar
       — nemá jak se zbortit. Vepsaný do kruhu je to klasická konstrukce
       „pevného uvnitř celku": kolik z toho celku už stojí.
     · Stav · kruh se skrytým středem a vyplněnou výsečí. Ne ukazatel v
       procentech; jen tolik, kolik je hotové.
     · Termín · kruh s vodorovnou tětivou. Obzor. Datum je čára, za kterou
       se slunce buď dostane, nebo ne.
     · Archiv · čtverec v kruhu. Nejstarší znak pro „uzavřeno a uloženo" —
       země uvnitř nebe. Zavřená schránka, ne koš.
     · Nadpis karty · vesica piscis, dva protínající se kruhy. Průnik dvou
       kružnic, z něhož se v posvátné geometrii odvozuje všechno ostatní —
       místo, kde záměr potkává skutek. Odtud cíl vzniká.

     Priorita (⊙) a Cíle (⌖) zůstávají, ty se líbily. */

  return {
    TmRyt, HABIT_RYT, HabitGlyph, StatusCycle, DayTasks, RanniZamer, RostouciText,
    ReflexeOtazka, VecerniOhlednuti, JournalOfDay, DotTap, WellbeingTracker, ZnameniDne,
    BodyHistory, Ring, StatCard, HabitCalendar, HabitMatrix, MiniChart, EditableSchedule,
    HabitInlineEditor, TmPasPrahu, DayView, PraxeOverview,
  };
}
