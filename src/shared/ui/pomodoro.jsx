import React, { useState } from "react";
import { createPortal } from "react-dom";
import { TmIcon as FamilyIcon } from "./icons.jsx";
import { useVrstva } from "./overlay.jsx";
import { FONT_BODY, FONT_TAG, FONT_DISPLAY_EN as FONT_DISPLAY } from "./type.js";
import { hexA } from "./color.js";
import { TM_SOUNDS, tmPlaySound } from "./pomodoroSound.js";
import { pomodoroPalette, pomodoroPickerPalette } from "./pomodoroPalette.js";
import { createPomoStorage } from "../product/pomodoro.js";

// Shared Main/Client timer. Only dependencies and account storage scope differ.
export function createPomodoroUI({ useT, useStore, L, uid, todayISO, fmtSize,
  readFileAsAtt, attUrl, iconBtn, CenterSheet, Drawer, Prazdno, Eyebrow,
  ArrowOutIcon, TmIcNastaveni, tmNotify = notify, tmNotifLoad = () => ({}),
  storageScope = () => "", readPersistedBlocks = () => [], allowWake = () => true, onStorageFailure = () => {},
}) {
  const runtime = createPomoStorage({
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: key => localStorage.removeItem(key),
  }, storageScope);
  const saveRuntime = (name, value) => {
    try { return runtime.write(name, value); } catch { onStorageFailure("pomodoro"); return false; }
  };

  function PomodoroFullscreen({ children, onClose, photo, background }) {
    const ref = React.useRef(null);
    useVrstva({ close: onClose, ref });
    return createPortal(<div ref={ref} className="tm-pomo-full" data-photo={photo ? "true" : "false"}
      role="dialog" aria-modal="true" aria-label={L("Soustředění", "Focus")} tabIndex={-1}
      style={{ position: "fixed", inset: 0, zIndex: 120, overflowY: "auto", background }}>{children}</div>, document.body);
  }
const POMO_CATS = [
  { k: "prace", cz: "Práce", en: "Work" },
  { k: "studium", cz: "Studium", en: "Study" },
  { k: "tvorba", cz: "Tvorba", en: "Creation" },
  { k: "meditace", cz: "Meditace", en: "Meditation" },
  { k: "ostatni", cz: "Ostatní", en: "Other" },
];
const pomoCatLabel = (k) => { const c = POMO_CATS.find((x) => x.k === k); return c ? L(c.cz, c.en) : k; };
const pomoCatColor = (t, tags, k) => ({ prace: t.accent, studium: (tags.slate || tags.blue).fg, tvorba: (tags.plum || tags.purple).fg, meditace: (tags.moss || tags.green).fg, ostatni: (tags.stone || tags.gray).fg }[k] || t.sand);

function FocusPicker({ note, setNote, cat, pickCat, onClose, photo = false }) {
  const { t, tags } = useT();
  const palette = pomodoroPickerPalette(t, photo);
  const headingRef = React.useRef(null);
  const inputId = React.useId();
  React.useEffect(() => {
    const trigger = document.activeElement;
    // Focus the heading without opening the phone keyboard before it is wanted.
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      requestAnimationFrame(() => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }); });
    };
  }, []);
  return <div className="tm-pomo-picker" role="group" aria-labelledby={inputId + "-label"}
    onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); } }}
    style={{ width: "100%", maxWidth: 420, boxSizing: "border-box", margin: "0 auto", textAlign: "center", padding: "18px 16px 10px", border: `1px solid ${palette.border}`, borderRadius: 18, background: palette.background, color: palette.ink, "--pomo-placeholder": palette.placeholder, "--pomo-focus": palette.focus }}>
    <style>{`.tm-pomo-picker input::placeholder{color:var(--pomo-placeholder)!important;opacity:1!important}.tm-pomo-picker :is(input,button):focus-visible{outline:2px solid var(--pomo-focus)!important;outline-offset:3px}.tm-pomo-picker input:focus{border-color:var(--pomo-focus)!important}`}</style>
    <label ref={headingRef} tabIndex={-1} id={inputId + "-label"} htmlFor={inputId} style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: 21, lineHeight: 1.3, color: palette.ink, marginBottom: 12, outline: "none" }}>{L("Na co se soustředíš?", "What are you focusing on?")}</label>
    <input id={inputId} value={note} onChange={event => setNote(event.target.value)} placeholder={L("Konkrétně… (nepovinné)", "Specifically… (optional)")}
      style={{ width: "100%", minHeight: 44, boxSizing: "border-box", background: palette.input, border: `1px solid ${palette.border}`, borderRadius: 10, padding: "10px 12px", color: palette.ink, caretColor: palette.focus, fontFamily: FONT_BODY, fontSize: 16, outline: "none", textAlign: "left", marginBottom: 12 }} />
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      {POMO_CATS.map(category => <button key={category.k} onClick={() => pickCat(category.k)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, background: "transparent", border: `1px solid ${cat === category.k ? palette.focus : palette.border}`, borderRadius: 999, padding: "9px 14px", cursor: "pointer", color: palette.ink, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12 }}>
        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: pomoCatColor(t, tags, category.k) }} />{L(category.cz, category.en)}
      </button>)}
    </div>
    <button onClick={onClose} style={{ marginTop: 6, minHeight: 44, padding: "8px 18px", background: "transparent", border: "none", cursor: "pointer", color: palette.secondary, fontFamily: FONT_BODY, fontSize: 13 }}>{L("Zpět", "Back")}</button>
  </div>;
}

const TM_POMO_HR = "tmPomoHranice";
function pomoHraniceHotova(bid) {
  return runtime.read(TM_POMO_HR) === bid;
}
function pomoHraniceZapis(bid) {
  try { runtime.write(TM_POMO_HR, bid); } catch (e) {}
}
const pomoSegLabel = (m) => (m === "short" ? L("Krátká pauza", "Short break") : m === "long" ? L("Dlouhá pauza", "Long break") : m === "custom" ? L("Vlastní blok", "Custom block") : L("Soustředění", "Focus"));
/* Jedno oznámení na hranici. Když jeden segment končí a druhý ve stejnou
   chvíli začíná, je to JEDNA věta — ne dvě skoro stejné ve stejné vteřině. */
async function pomoOznamHranici(konec, zacatek) {
  const nadpis = konec && zacatek
    ? L(`${pomoSegLabel(konec)} skončilo. Začíná ${pomoSegLabel(zacatek).toLowerCase()}.`, `${pomoSegLabel(konec)} finished. ${pomoSegLabel(zacatek)} begins.`)
    : konec
      ? L(`${pomoSegLabel(konec)} skončilo.`, `${pomoSegLabel(konec)} finished.`)
      : L(`${pomoSegLabel(zacatek)} začalo.`, `${pomoSegLabel(zacatek)} started.`);
  await tmNotify("tanmay", { body: nadpis, tag: "tm-pomo", renotify: true, requireInteraction: false, badge: "/icon-192.png", icon: "/icon-192.png", data: { kind: "pomo" } });
}

let POMO_WAKE = null;
async function pomoWake(on) {
  try {
    if (on) {
      if (POMO_WAKE || !navigator.wakeLock || document.hidden || !allowWake()) return;
      POMO_WAKE = await navigator.wakeLock.request("screen");
      POMO_WAKE.addEventListener("release", () => { POMO_WAKE = null; });
    } else if (POMO_WAKE) { const w = POMO_WAKE; POMO_WAKE = null; await w.release(); }
  } catch (e) { POMO_WAKE = null; }
}
/* TICHO NA POZADÍ.
   Tady stály dvě věci, které držely aplikaci vzhůru zvukem: nekonečná smyčka
   „téměř ticha" (střídavé vzorky ±1 při 8 kHz, což je čtyřkilohertzový
   obdélník o nepatrné amplitudě — na tichém telefonu s hlasitostí nahoře
   slyšitelný sykot) a oscilátor na 30 Hz s trvalým ziskem 0,001, který na
   levnějších převodnících a přes Bluetooth prosakoval jako hukot. Obojí
   navíc drželo `playbackState: "playing"`, tedy trvalé předstírané
   přehrávání jen proto, aby se něco ukazovalo na zamčené obrazovce.

   Časovač nemá být udržován při životě zvukem. Stojí na absolutním čase a
   po návratu se dopočítá; mezi hranicemi segmentů je ticho. Zůstává jen
   zámek displeje, který se bere v popředí a nic nepřehrává. */

const pomoRunLoad = () => runtime.read("tmPomoRun");
const pomoRunSave = (rt) => saveRuntime("tmPomoRun", rt);
const pomoQueueLoad = () => runtime.read("tmPomoQueue", []);
const pomoQueueSave = (q) => saveRuntime("tmPomoQueue", q);
const pomoIsoOf = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const POMO_LS = new Set();
/* FRONTA SE VYPRAZDŇUJE V DOMĚ, NE NA STRÁNCE ČASOVAČE.
   Běžec žije v modulu a dopočítá blok, i když je člověk jinde nebo aplikaci
   zavřel. Zápis do sbírek ale uměla jen stránka časovače, takže hotové bloky
   čekaly ve frontě v localStorage a přehled o nich nevěděl. Tahle součást
   sedí v kořeni, kouká na frontu při startu, při každém tiknutí běžce, při
   návratu z pozadí a jednou za dvě vteřiny — a co v ní najde, zapíše. */
function TmPomoFronta() {
  const st = useStore();
  const cekaRef = React.useRef(false);
  const stRef = React.useRef(st); stRef.current = st;
  React.useEffect(() => {
    // Potvrzení patří uloženému dokumentu i aktuálním záznamům. Samotný
    // React stav ještě neznamená úspěšný zápis: úložiště může být plné
    // nebo se zápis teprve chystá. Fronta pak musí přežít opětovné otevření.
    const vysyp = () => {
      let q = [];
      try { q = pomoQueueLoad(); } catch (e) { q = []; }
      if (!q.length) return;
      const st0 = stRef.current;
      const mam = new Set((((st0 && st0.coll) || {}).pomoLog || []).map((x) => x && x.id));
      const nove = q.filter((x) => x && x.id && !mam.has(x.id));
      if (!nove.length) {
        try {
          const saved = new Set(readPersistedBlocks().map(block => block?.id));
          if (q.every(block => saved.has(block?.id))) pomoQueueSave([]);
        } catch (e) { /* Keep the queue until a durable read succeeds. */ }
        return;
      }
      if (cekaRef.current) return;
      cekaRef.current = true;
      try { st0.addPomoBlocks(nove.slice().reverse()); } catch (e) {}
      window.setTimeout(() => { cekaRef.current = false; }, 700);
    };
    pomoAdvance();
    const saved = pomoRunLoad();
    if (saved?.running) pomoEnsureTicker();
    vysyp();
    POMO_LS.add(vysyp);
    const iv = window.setInterval(vysyp, 2000);
    const vis = () => { try { if (!document.hidden) { pomoAdvance(); if (pomoRunLoad()?.running) { pomoWake(true); pomoEnsureTicker(); } } } catch (e) {} vysyp(); };
    document.addEventListener("visibilitychange", vis);
    return () => { POMO_LS.delete(vysyp); window.clearInterval(iv); clearInterval(POMO_IV); POMO_IV = null; pomoWake(false); document.removeEventListener("visibilitychange", vis); };
  }, []);
  return null;
}
/* POSUN SEGMENTŮ · autoritou je čas, ne tikot.
   Interval jen překresluje; kde jsme, plyne z `endAt`. Když telefon spal a
   mezitím skončilo víc segmentů, dopočítají se všechny, ale zazvoní se
   nejvýš JEDNOU a jen za hranici, která je čerstvá — do dvaceti vteřin.
   Hranice stará deset minut se po odemčení nesmí rozeznít; místo toho se
   zapíše, co se stalo, a aplikace to řekne jednou větou. */
const POMO_ZVON_OKNO = 20000;
const TM_POMO_ZMESKANO = "tmPomoZmeskano";
function pomoAdvance() {
  let rt = pomoRunLoad();
  if (!rt || !rt.running || !rt.endAt) return;
  const c = rt.cfg || {};
  const durMin = (m) => ((m === "focus" ? c.focus : m === "custom" ? (c.custom || 45) : m === "short" ? c.short : c.long) || 25);
  let guard = 0, changed = false;
  let posledni = null;   // { bid, konec, zacatek, kdy }
  let hranic = 0;
  while (rt.running && rt.endAt && Date.now() >= rt.endAt && guard++ < 60) {
    changed = true;
    hranic += 1;
    const focusType = rt.mode === "focus" || rt.mode === "custom";
    const bid = rt.mode + "@" + rt.endAt;
    const kdy = rt.endAt;
    const konec = rt.mode;
    if (focusType) {
      const q = pomoQueueLoad();
      const id = "pomo:" + bid;
      if (!q.some(block => block.id === id)) q.unshift({ id, d: pomoIsoOf(rt.endAt), ts: rt.endAt, min: durMin(rt.mode), cat: rt.cat || "ostatni", note: rt.note || "" });
      if (!pomoQueueSave(q)) return;
      const cyc = (rt.cycle || 0) + 1;
      const nextMode = cyc % (c.every || 4) === 0 ? "long" : "short";
      rt = { ...rt, cycle: cyc, mode: nextMode, startAt: rt.endAt, endAt: rt.endAt + durMin(nextMode) * 60000, running: true };
      posledni = { bid, konec, zacatek: nextMode, kdy };
    } else {
      rt = { ...rt, mode: "focus", running: false, startAt: null, endAt: null, remaining: durMin("focus") * 60 };
      posledni = { bid, konec, zacatek: null, kdy };
    }
  }
  if (!changed) return;
  if (!pomoRunSave(rt)) return;
  if (posledni && !pomoHraniceHotova(posledni.bid)) {
    // ID se zapíše PŘED zvoněním · kdyby cokoli spadlo, radši mlčky než dvakrát
    pomoHraniceZapis(posledni.bid);
    const cerstve = Date.now() - posledni.kdy <= POMO_ZVON_OKNO;
    if (cerstve) {
      try { if (c.sound !== false) tmPlaySound(c.voice || "bowl", null, c.vol == null ? 1 : c.vol); } catch (e) {}
      try { if (tmNotifLoad().pomo !== false) pomoOznamHranici(posledni.konec, posledni.zacatek); } catch (e) {}
    } else {
      // proběhlo to na pozadí a dávno · aplikace to řekne jednou větou, až se otevře
      try { runtime.write(TM_POMO_ZMESKANO, { n: hranic, konec: posledni.konec, zacatek: posledni.zacatek, kdy: posledni.kdy }); } catch (e) {}
    }
  }
  POMO_LS.forEach((f) => { try { f(); } catch (e) {} });
}
let POMO_IV = null;
/* Tikot překresluje ciferník, nic víc. Nedrží aplikaci vzhůru, nepřehrává,
   nepřepisuje oznámení. Když prohlížeč stránku na pozadí přiškrtí, nevadí —
   po návratu se stav dopočítá z `endAt`. */
function pomoEnsureTicker() {
  if (POMO_IV || typeof window === "undefined") return;
  const scope = storageScope();
  POMO_IV = setInterval(() => {
    if (storageScope() !== scope || scope == null) { clearInterval(POMO_IV); POMO_IV = null; pomoWake(false); return; }
    pomoAdvance();
    POMO_LS.forEach((f) => { try { f(); } catch (e) {} });
    const rt = pomoRunLoad();
    if ((!rt || !rt.running) && pomoQueueLoad().length === 0) {
      clearInterval(POMO_IV); POMO_IV = null;
      try { pomoWake(false); } catch (e) {}
    }
  }, 500);
}
// Přehledy soustředění · kolik, kdy a v čem. Čte pomoLog (kategorie, minuty,
// časy) a skládá donut, čísla, měsíční kalendář a poslední bloky.
function PomoOverview() {
  const { t, tags } = useT();
  const st = useStore();
  const [per, setPer] = useState("tyden"); // den | tyden | mesic
  const log = st.coll.pomoLog || [];
  const today = todayISO();
  const startISO = (() => {
    if (per === "den") return today;
    const d = new Date(today + "T12:00:00");
    if (per === "tyden") { const w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); }
    else d.setDate(1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const inPer = log.filter((e) => (e.d || "") >= startISO);
  const total = inPer.reduce((a, e) => a + (e.min || 0), 0);
  const byCat = POMO_CATS.map((c) => ({ ...c, min: inPer.filter((e) => e.cat === c.k).reduce((a, e) => a + (e.min || 0), 0) })).filter((c) => c.min > 0);
  const byCatAll = POMO_CATS.map((c) => ({ ...c, min: log.filter((e) => e.cat === c.k).reduce((a, e) => a + (e.min || 0), 0) })).filter((c) => c.min > 0).sort((a, b) => b.min - a.min);
  const fmtH = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + " m" : ""}`.trim() : `${m} m`);
  const hhmm = (ts) => { const d = new Date(ts); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

  // donut
  const R = 46, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = byCat.map((c) => { const f = total ? c.min / total : 0; const seg = { c, off: acc, f }; acc += f; return seg; });

  // měsíční kalendář · minuty po dnech
  const [y, mo] = [Number(today.slice(0, 4)), Number(today.slice(5, 7))];
  const first = new Date(y, mo - 1, 1);
  const startW = (first.getDay() + 6) % 7;
  const ndays = new Date(y, mo, 0).getDate();
  const dayMin = {};
  log.forEach((e) => { if ((e.d || "").slice(0, 7) === today.slice(0, 7)) dayMin[e.d] = (dayMin[e.d] || 0) + (e.min || 0); });
  const cells = []; for (let i = 0; i < startW; i++) cells.push(null); for (let d = 1; d <= ndays; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[["den", L("Dnes", "Today")], ["tyden", L("Týden", "Week")], ["mesic", L("Měsíc", "Month")]].map(([k, lbl]) => (
          <button key={k} onClick={() => setPer(k)} style={{ background: per === k ? t.card : "transparent", border: `1px solid ${per === k ? t.border : "transparent"}`, borderRadius: 20, padding: "5px 14px", cursor: "pointer", color: per === k ? t.heading : t.textMuted, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, boxShadow: per === k ? t.shadow : "none" }}>{lbl}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0, transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r={R} fill="none" stroke={t.borderSoft} strokeWidth="11" />
          {segs.map((sg, i) => (
            <circle key={i} cx="60" cy="60" r={R} fill="none" stroke={pomoCatColor(t, tags, sg.c.k)} strokeWidth="11" strokeLinecap="butt"
              strokeDasharray={`${Math.max(0.001, sg.f) * C} ${C}`} strokeDashoffset={-sg.off * C} style={{ transition: "stroke-dasharray .5s ease" }} />
          ))}
        </svg>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, marginBottom: 8 }}>{fmtH(total)}<span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, marginLeft: 8 }}>{inPer.length} {L("bloků", "blocks")}</span></div>
          {byCat.length === 0 && <Prazdno kind="hotovo" plain compact fakt={L("V tomhle období zatím žádné soustředění.", "No focus in this period yet.")} />}
          {byCat.sort((a, b) => b.min - a.min).map((c) => (
            <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "3px 0" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: pomoCatColor(t, tags, c.k), flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flex: 1 }}>{L(c.cz, c.en)}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textSec }}>{fmtH(c.min)}</span>
              <span style={{ fontFamily: FONT_TAG, fontSize: 12, letterSpacing: "0.08em", color: t.textMuted, width: 38, textAlign: "right" }}>{total ? Math.round((c.min / total) * 100) : 0} %</span>
            </div>
          ))}
        </div>
      </div>

      <Eyebrow>{L("Tento měsíc", "This month")}</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, maxWidth: 380, marginBottom: 6 }}>
        {L(["Po", "Út", "St", "Čt", "Pá", "So", "Ne"], ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]).map((w) => (
          <div key={w} style={{ textAlign: "center", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: t.textMuted }}>{w}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const m = dayMin[iso] || 0;
          const o = m ? Math.min(1, 0.3 + m / 120) : 0;
          return (
            <div key={i} title={m ? `${iso} · ${fmtH(m)}` : iso} style={{ aspectRatio: "1", borderRadius: 7, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontFamily: FONT_BODY, fontSize: 12, color: iso === today ? t.heading : t.textMuted, border: iso === today ? `1px solid ${hexA(t.accent, 0.55)}` : `1px solid transparent`, background: t.mode === "light" ? hexA(t.heading, 0.03) : "rgba(255,255,255,0.03)" }}>
              <span>{d}</span>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: m ? hexA(t.accent, o) : "transparent" }} />
            </div>
          );
        })}
      </div>

      <div style={{ height: 14 }} />
      <Eyebrow>{per === "den" ? L("Dnešní bloky", "Today's blocks") : per === "tyden" ? L("Bloky tohoto týdne", "This week's blocks") : L("Bloky tohoto měsíce", "This month's blocks")}</Eyebrow>
      {inPer.length === 0 && <Prazdno kind="prvni" plain compact
        fakt={L("Zatím žádný blok.", "No block yet.")}
        pozvani={L("Pusť časovač a nech ho doběhnout — počítá se až zvon.", "Start the timer and let it run — only the bell counts.")} />}
      {(() => {
        const byTs = [...inPer].sort((a, b) => (b.ts || 0) - (a.ts || 0));
        const out = []; let lastD = null;
        byTs.forEach((e) => {
          if (e.d !== lastD) {
            lastD = e.d;
            const dm = byTs.filter((x) => x.d === e.d).reduce((a, x) => a + (x.min || 0), 0);
            out.push(
              <div key={"d" + e.d} style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0 4px" }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: t.textSec }}>{e.d === today ? L("Dnes", "Today") : (e.d || "").slice(8) + ". " + (e.d || "").slice(5, 7) + "."}</span>
                <span style={{ flex: 1, height: 1, background: t.borderSoft }} />
                <span style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: t.textMuted }}>{fmtH(dm)}</span>
              </div>
            );
          }
          out.push(
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 0" }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted, width: 42, flexShrink: 0 }}>{e.ts ? hhmm(e.ts) : ""}</span>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: pomoCatColor(t, tags, e.cat), flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flexShrink: 0 }}>{pomoCatLabel(e.cat)}</span>
              {e.note ? <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textSec, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>· {e.note}</span> : <span style={{ flex: 1 }} />}
              <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.sand, flexShrink: 0 }}>{e.min} m</span>
            </div>
          );
        });
        return out;
      })()}

      <div style={{ height: 18 }} />
      <Eyebrow>{L("Celkem · od začátku", "All time · in numbers")}</Eyebrow>
      {(() => {
        const allMin = log.reduce((a, e) => a + (e.min || 0), 0);
        const days = new Set(log.map((e) => e.d)).size;
        return (
          <div style={{ background: t.card, border: `1px solid ${t.borderSoft}`, borderRadius: 12, boxShadow: t.shadow, padding: "12px 14px" }}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: byCatAll.length ? 10 : 0 }}>
              <span><span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.heading }}>{fmtH(allMin)}</span> <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("soustředění", "of focus")}</span></span>
              <span><span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.heading }}>{log.length}</span> <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("bloků", "blocks")}</span></span>
              <span><span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.heading }}>{days}</span> <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>{L("dní", "days")}</span></span>
            </div>
            {byCatAll.map((c) => (
              <div key={c.k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "2px 0" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: pomoCatColor(t, tags, c.k), flexShrink: 0 }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.text, flex: 1 }}>{L(c.cz, c.en)}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textSec }}>{fmtH(c.min)}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

function PomodoroTimer() {
  const { t, tags } = useT();
  const st = useStore();
  const cfg = st.pomoSettings();
  const [rtv, setRtv] = useState(() => (typeof window !== "undefined" ? pomoRunLoad() : null));
  const [cfgOpen, setCfgOpen] = useState(false);
  const [pickOpen, setPickOpen] = useState(false); // výběr kategorie před startem
  const [ovOpen, setOvOpen] = useState(false);     // přehledy
  const [fs, setFs] = useState(false);             // celá obrazovka
  /* Když se hranice minula na pozadí a byla už stará, běžec mlčel a zapsal,
     co se stalo. Tady se to řekne — jednou, klidně, a dá se to zavřít. */
  const [zmeskano, setZmeskano] = useState(() => { try { return runtime.read(TM_POMO_ZMESKANO); } catch (e) { return null; } });
  const zavriZmeskano = () => { try { runtime.write(TM_POMO_ZMESKANO, null); } catch (e) {} setZmeskano(null); };

  const isFocusMode = (m) => m === "focus" || m === "custom";
  const durOf = (m) => (m === "focus" ? cfg.focus : m === "custom" ? (cfg.custom || 45) : m === "short" ? cfg.short : cfg.long) * 60;
  const snap = () => ({ focus: cfg.focus, short: cfg.short, long: cfg.long, custom: cfg.custom || 45, every: cfg.every, sound: cfg.sound, voice: cfg.voice || "bowl", vol: cfg.vol == null ? 1 : cfg.vol });
  const defRt = () => ({ mode: "focus", running: false, startAt: null, endAt: null, remaining: durOf("focus"), cycle: 0, cat: null, note: "", cfg: snap() });
  const rt = rtv || defRt();
  const mode = rt.mode || "focus";
  const running = !!rt.running;
  const cycle = rt.cycle || 0;
  const cat = rt.cat || null;
  const note = rt.note || "";
  const patchRt = (px) => { const nx = { ...(pomoRunLoad() || defRt()), ...px }; if (pomoRunSave(nx)) setRtv(nx); };
  const setNote = (v) => patchRt({ note: v });

  const secsLeft = running && rt.endAt ? Math.max(0, Math.round((rt.endAt - Date.now()) / 1000)) : (rt.remaining != null ? rt.remaining : durOf(mode));
  const total = durOf(mode);
  const p = 1 - secsLeft / Math.max(1, total);

  // Dům běží i bez této stránky — komponenta jen poslouchá modulového běžce.
  React.useEffect(() => {
    const f = () => {
      setRtv(pomoRunLoad());
      try { const z = runtime.read(TM_POMO_ZMESKANO); if (z) setZmeskano(z); } catch (e) {}
    };
    POMO_LS.add(f);
    pomoEnsureTicker();
    const vis = () => { pomoAdvance(); setRtv(pomoRunLoad()); };
    document.addEventListener("visibilitychange", vis);
    return () => { POMO_LS.delete(f); document.removeEventListener("visibilitychange", vis); };
  }, []);
  /* Fronta dokončených bloků se sem už nevyprazdňuje. Dělal to jen tenhle
     komponent, takže blok, který doběhl na jiné stránce nebo po zavření
     aplikace, ležel ve frontě, dokud někdo znovu neotevřel časovač — a do
     přehledu se do té doby nedostal vůbec. Vyprazdňování je teď v domě
     (TmPomoFronta v kořeni aplikace) a běží pořád. */

  /* Spuštění je uživatelská akce · teprve tady se smí zeptat na povolení
     oznámení, nikdy při načtení aplikace. Odmítnutí nic nerozbije: časovač
     měří dál, jen mlčí. */
  const beginRun = (extra) => {
    pomoWake(true);
    try { if ("Notification" in window && Notification.permission === "default") Notification.requestPermission().catch(() => {}); } catch (e) {}
    const ted = Date.now();
    const px = { ...(extra || {}), running: true, startAt: ted, endAt: ted + secsLeft * 1000, cfg: snap() };
    patchRt(px);
    // začátek segmentu je taky hranice · ohlásí se jednou, se stabilním ID
    const bid = "start:" + (px.mode || mode) + "@" + px.endAt;
    if (!pomoHraniceHotova(bid)) {
      pomoHraniceZapis(bid);
      try { if (tmNotifLoad().pomo !== false) pomoOznamHranici(null, px.mode || mode); } catch (e) {}
    }
    pomoEnsureTicker();
  };
  const start = () => { if (isFocusMode(mode) && !cat) { setPickOpen(true); return; } beginRun(); };
  const pickCat = (k) => { setPickOpen(false); beginRun({ cat: k }); };
  const pause = () => { patchRt({ running: false, remaining: secsLeft, endAt: null }); pomoWake(false); };
  const reset = (m) => { const mmx = m || mode; patchRt({ mode: mmx, running: false, startAt: null, endAt: null, remaining: durOf(mmx) }); pomoWake(false); };
  const giveUp = () => st.ask(L("Přerušit soustředění? Tento blok se nezapočítá.", "Interrupt focus? This block won't count."), () => reset("focus"));

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  // pozadí · žádná vestavěná fotografie (fotografická direktiva §6: žádná stock
  // estetika) — výchozí je plné pole Forest Night; vlastní fotku skutečného
  // místa lze nahrát v nastavení a má přednost.
  const bg = cfg.bg || null;
  const full = pomodoroPalette(t, !!bg);
  const POMO_DUSK = t.bg;
  const MODES = [["focus", L("Soustředění", "Focus")], ["short", L("Krátká", "Short")], ["long", L("Dlouhá", "Long")], ["custom", L("Vlastní", "Custom")]];

  const onPickPhoto = async (file) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) { st.ask(L(`Fotka je moc velká (${fmtSize(file.size)}). Limit 1,5 MB — localStorage.`, `The photo is too large (${fmtSize(file.size)}). Limit 1.5 MB — localStorage.`), null); return; }
    try { const att = await readFileAsAtt(file); st.setPomoSettings({ bg: attUrl(att) }); } catch (e) {}
  };
  const numField = (label, key, min, max) => { const val = cfg[key] != null ? cfg[key] : (key === "custom" ? 45 : 0); return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "7px 0" }}>
      <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec }}>{label}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => st.setPomoSettings({ [key]: Math.max(min, val - (key === "every" ? 1 : 5)) })} style={{ ...iconBtn(t), width: 24, height: 24 }}>−</button>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: t.heading, minWidth: 44, textAlign: "center" }}>{val}{key === "every" ? <FamilyIcon id="close" size={16} label={L("Zavřít","Close")} style={{ display: "inline-block", verticalAlign: "middle" }} /> : " m"}</span>
        <button onClick={() => st.setPomoSettings({ [key]: Math.min(max, val + (key === "every" ? 1 : 5)) })} style={{ ...iconBtn(t), width: 24, height: 24 }}><FamilyIcon id="add" size={16} label={L("Přidat","Add")} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      </span>
    </div>
  ); };

  // In-flow replacement on paper, so all controls still fit at 320 px. The
  // fullscreen version stays inside its existing document.body portal.
  const renderPicker = () => <FocusPicker note={note} setNote={setNote} cat={cat} pickCat={pickCat} onClose={() => setPickOpen(false)} photo={fs && !!bg} />;

  return (
    <div>
      {/* NA PAPÍŘE · časovač na stránce nemá pozadí ani rámeček. Tmavé pole
          s bílým písmem bylo ostrov uprostřed listu; teď je z něj sazba jako
          všechno ostatní. Tma zůstala tam, kam patří — na celou obrazovku. */}
      <div style={{ position: "relative" }}>
        {pickOpen && !fs && renderPicker()}
        <div hidden={pickOpen && !fs} style={{ position: "relative", padding: "6px 0 4px", textAlign: "center" }}>
          {/* Bez rámečku zmizelo i `overflow: hidden`, které řadu režimů dřív
              ořezávalo. Na telefonu je ta řada širší než displej, tak se roluje
              sama v sobě — jinak by roztáhla celou stránku. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
            <div className="tm-scroll" style={{ display: "flex", gap: 4, flex: 1, minWidth: 0, overflowX: "auto", scrollbarWidth: "none" }}>
              {MODES.map(([k, label]) => (
                <button key={k} onClick={() => reset(k)} aria-pressed={mode === k} style={{ background: "transparent", border: "none", borderBottom: `1px solid ${mode === k ? t.accent : "transparent"}`, borderRadius: 0, padding: "8px 8px", minHeight: 34, cursor: "pointer", color: mode === k ? (t.accentInk || t.accent) : t.textMuted, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{label}</button>
              ))}
            </div>
            <span style={{ display: "inline-flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              <button title={L("Na celou obrazovku", "Fullscreen")} aria-label={L("Na celou obrazovku", "Fullscreen")} onClick={() => setFs(true)} className="tm-iconbtn tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, width: 30, height: 30, alignItems: "center", justifyContent: "center", display: "inline-flex" }}><ArrowOutIcon size={15} /></button>
              <button title={L("Nastavení", "Settings")} aria-label={L("Nastavení", "Settings")} onClick={() => setCfgOpen(true)} className="tm-iconbtn tm-tap-c" style={{ background: "transparent", border: "none", cursor: "pointer", color: t.textMuted, width: 30, height: 30, alignItems: "center", justifyContent: "center", display: "inline-flex" }}><TmIcNastaveni size={16} /></button>
            </span>
          </div>
          <div style={{ padding: "10px 0 4px" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 58, fontWeight: 300, color: t.heading, lineHeight: 1, letterSpacing: "0.02em" }}>{mm}:{ss}</div>
            <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: t.textMuted, marginTop: 8 }}>
              {mode === "focus" || mode === "custom" ? L("Soustředění", "Focus") : mode === "short" ? L("Krátká pauza", "Short break") : L("Dlouhá pauza", "Long break")} · {cycle % cfg.every}/{cfg.every}
            </div>
          </div>
          {isFocusMode(mode) && cat && (
            <button onClick={() => setPickOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 999, padding: "7px 12px", minHeight: 32, cursor: "pointer", color: t.textSec, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, marginTop: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: pomoCatColor(t, tags, cat) }} />
              {pomoCatLabel(cat)}{note.trim() ? " · " + note.trim() : ""}
            </button>
          )}
          <div style={{ height: 3, background: t.borderSoft, borderRadius: 2, margin: "12px 0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round(p * 100)}%`, background: "var(--tm-accent, #B87333)", transition: "width .5s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {!running ? (
              <button onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: t.accentInk || t.accent, border: `1px solid ${t.accent}`, borderRadius: 20, padding: "8px 24px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}><FamilyIcon id="play" size={12} /> Start</button>
            ) : (
              <>
                <button onClick={pause} style={{ background: "transparent", color: t.text, border: `1px solid ${t.border}`, borderRadius: 20, padding: "8px 22px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}>‖ {L("Pauza", "Pause")}</button>
                {mode === "focus" && <button onClick={giveUp} style={{ background: "transparent", color: t.textMuted, border: `1px solid ${t.borderSoft}`, borderRadius: 20, padding: "8px 16px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.14em", fontSize: 12 }}>{L("Vzdát", "Give up")}</button>}
              </>
            )}
          </div>
        </div>
      </div>

      {zmeskano && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: t.callout, border: `1px solid ${t.borderSoft}`, borderLeft: `3px solid ${t.accent}`, borderRadius: 8, padding: "8px 12px", margin: "10px 0 0" }}>
          <span style={{ flex: 1, fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, lineHeight: 1.5 }}>
            {zmeskano.n > 1
              ? L(`Zatímco byl telefon zamčený, doběhly ${zmeskano.n} segmenty. Časovač je srovnaný.`, `${zmeskano.n} segments finished while the phone was locked. The timer is caught up.`)
              : L(`${pomoSegLabel(zmeskano.konec)} doběhlo, zatímco byl telefon zamčený.`, `${pomoSegLabel(zmeskano.konec)} finished while the phone was locked.`)}
          </span>
          <button onClick={zavriZmeskano} title={L("Zavřít", "Close")} style={{ background: "transparent", border: "none", color: t.textMuted, cursor: "pointer", fontSize: 14, padding: "2px 4px", flexShrink: 0 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
        </div>
      )}

      {/* Přehled · stejné slovo, stejné místo a stejná barva jako na Praxi */}
      <button onClick={() => setOvOpen(true)} className="tm-tap-c" style={{ display: "block", marginLeft: "auto", marginTop: 16, background: "transparent", border: "none", boxShadow: "none", padding: "8px 0", minHeight: 34, cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 12, color: t.accent }}>{L("Přehled", "Overview")}</button>

      {fs && <PomodoroFullscreen onClose={() => { setPickOpen(false); setFs(false); }} photo={!!bg} background={full.background}>
          {bg && <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
          <div className="tm-pomo-backdrop" style={{ position: "absolute", inset: 0, background: bg ? "linear-gradient(180deg, rgba(28,28,26,0.68) 0%, rgba(28,28,26,0.86) 100%)" : POMO_DUSK }} />
          {pickOpen && <div style={{ position: "relative", minHeight: "100%", display: "grid", alignItems: "center", boxSizing: "border-box", padding: "calc(20px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom))" }}>{renderPicker()}</div>}
          <div inert={pickOpen || undefined} style={{ position: "relative", minHeight: "100%", boxSizing: "border-box", display: pickOpen ? "none" : "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "calc(20px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom))", textAlign: "center" }}>
            <button onClick={() => setFs(false)} title={L("Zavřít celou obrazovku", "Close fullscreen")} aria-label={L("Zavřít celou obrazovku", "Close fullscreen")} style={{ position: "absolute", top: "calc(16px + env(safe-area-inset-top))", right: 18, background: full.wash, border: `1px solid ${full.line}`, borderRadius: 999, width: 44, height: 44, cursor: "pointer", color: full.ink, fontSize: 15, lineHeight: 1 }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "100%", gap: 6, margin: "44px 0 26px" }}>
              {MODES.map(([k, label]) => (
                <button key={k} onClick={() => reset(k)} aria-pressed={mode === k} style={{ background: mode === k ? full.wash : "transparent", border: "none", borderRadius: 12, padding: "8px 12px", minHeight: 34, cursor: "pointer", color: mode === k ? full.ink : full.secondary, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12 }}>{label}</button>
              ))}
            </div>
            <div data-pomo-time style={{ fontFamily: FONT_DISPLAY, fontWeight: 300, fontSize: "clamp(64px, calc(22 * var(--tm-vw)), 150px)", color: full.ink, lineHeight: 1, letterSpacing: "0.02em" }}>{mm}:{ss}</div>
            <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, color: full.secondary, marginTop: 14 }}>
              {mode === "focus" || mode === "custom" ? L("Soustředění", "Focus") : mode === "short" ? L("Krátká pauza", "Short break") : L("Dlouhá pauza", "Long break")} · {cycle % cfg.every}/{cfg.every}
            </div>
            {isFocusMode(mode) && cat && (
              <button onClick={() => setPickOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: full.wash, border: `1px solid ${full.line}`, borderRadius: 999, padding: "4px 13px", cursor: "pointer", color: full.ink, fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, marginTop: 12, maxWidth: "100%", overflowWrap: "anywhere", minHeight: 44 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: pomoCatColor(t, tags, cat) }} />
                {pomoCatLabel(cat)}{note.trim() ? " · " + note.trim() : ""}
              </button>
            )}
            <div style={{ width: "min(420px, calc(78 * var(--tm-vw)))", height: 3, background: full.wash, borderRadius: 2, margin: "26px 0", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round(p * 100)}%`, background: full.progress, transition: "width .5s linear" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              {!running ? (
                <button onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", color: full.ink, border: `1px solid ${full.line}`, borderRadius: 22, padding: "11px 32px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 13 }}><FamilyIcon id="play" size={13} /> Start</button>
              ) : (
                <>
                  <button onClick={pause} style={{ background: "transparent", color: full.ink, border: `1px solid ${full.line}`, borderRadius: 22, padding: "11px 28px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 13 }}>‖ {L("Pauza", "Pause")}</button>
                  {isFocusMode(mode) && <button onClick={giveUp} style={{ background: "transparent", color: full.secondary, border: `1px solid ${full.line}`, borderRadius: 22, padding: "11px 20px", cursor: "pointer", fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 13 }}>{L("Vzdát", "Give up")}</button>}
                </>
              )}
            </div>
          </div>
        </PomodoroFullscreen>}

      {ovOpen && (
        <CenterSheet center title={L("Soustředění · přehledy", "Focus · overview")} onClose={() => setOvOpen(false)}>
          <PomoOverview />
        </CenterSheet>
      )}

      <Drawer open={cfgOpen} onClose={() => setCfgOpen(false)}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 500, color: t.heading, margin: "0 0 14px" }}>{L("Pomodoro · nastavení", "Pomodoro · settings")}</h2>
        {numField(L("Soustředění", "Focus"), "focus", 5, 120)}
        {numField(L("Krátká pauza", "Short break"), "short", 5, 30)}
        {numField(L("Dlouhá pauza", "Long break"), "long", 10, 60)}
        {numField(L("Vlastní blok", "Custom block"), "custom", 15, 180)}
        {numField(L("Dlouhá pauza po", "Long break after"), "every", 2, 8)}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${t.borderSoft}`, marginTop: 8 }}>
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec }}>{L("Zvukové upozornění", "Sound alert")}</span>
          <button onClick={() => st.setPomoSettings({ sound: !cfg.sound })} style={{ background: cfg.sound ? t.accent : "transparent", border: `1px solid ${cfg.sound ? t.accent : t.border}`, borderRadius: 14, width: 42, height: 22, cursor: "pointer", position: "relative" }}>
            <span style={{ position: "absolute", top: 2, left: cfg.sound ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: cfg.sound ? t.bg : t.textMuted, transition: "left .15s" }} />
          </button>
        </div>
        {cfg.sound && (
          <div style={{ margin: "2px 0 14px" }}>
            <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, marginBottom: 7 }}>{L("Hlas zvonu · klepnutím uslyšíš", "The voice of the bell · tap to hear it")}</div>
            {TM_SOUNDS.map((v) => {
              const on = (cfg.voice || "bowl") === v.k;
              return (
                <button key={v.k} onClick={() => { st.setPomoSettings({ voice: v.k }); tmPlaySound(v.k, null, cfg.vol == null ? 1 : cfg.vol); }} className="tm-nav-item"
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: on ? hexA(t.accent, 0.1) : "transparent", border: `1px solid ${on ? t.accent : t.borderSoft}`, borderRadius: 10, padding: "9px 12px", marginBottom: 6, cursor: "pointer", minHeight: 46 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, background: on ? t.accent : "transparent", border: `1px solid ${on ? t.accent : t.border}` }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: FONT_BODY, fontSize: 13, color: on ? t.heading : t.text }}>{L(v.cz, v.en)}</span>
                    <span style={{ display: "block", fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 12, color: t.textMuted }}>{L(v.cz2, v.en2)}</span>
                  </span>
                  <span style={{ color: t.textMuted, fontSize: 13, flexShrink: 0 }}>♪</span>
                </button>
              );
            })}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px 0" }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textSec, flexShrink: 0 }}>{L("Hlasitost", "Volume")}</span>
              <input type="range" min="0.2" max="1.4" step="0.1" value={cfg.vol == null ? 1 : cfg.vol}
                onChange={(e) => st.setPomoSettings({ vol: +e.target.value })}
                onMouseUp={() => tmPlaySound(cfg.voice || "bowl", null, cfg.vol == null ? 1 : cfg.vol)}
                onTouchEnd={() => tmPlaySound(cfg.voice || "bowl", null, cfg.vol == null ? 1 : cfg.vol)}
                style={{ flex: 1, minWidth: 0, accentColor: t.accent }} />
            </div>
          </div>
        )}
        <div style={{ borderTop: `1px solid ${t.borderSoft}`, paddingTop: 14 }}>
          <div style={{ fontFamily: FONT_TAG, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: t.sage, marginBottom: 8 }}>{L("Pozadí", "Background")}</div>
          <div style={{ width: "100%", height: 90, borderRadius: 8, ...(bg ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: POMO_DUSK }), border: `1px solid ${t.border}`, marginBottom: 8 }} />
          <input type="file" accept="image/*" id="pomo-bg-file" onChange={(e) => onPickPhoto(e.target.files && e.target.files[0])} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { const el = document.getElementById("pomo-bg-file"); if (el) el.click(); }} style={{ background: "transparent", border: `1px solid transparent`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: t.inkSand, fontFamily: FONT_BODY, fontSize: 12 }}><FamilyIcon id="image" size={15} /> {L("Vlastní fotka", "Custom photo")}</button>
            {cfg.bg && <button onClick={() => st.setPomoSettings({ bg: null })} style={{ background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: t.textMuted, fontFamily: FONT_BODY, fontSize: 12 }}>{L("Odebrat fotku", "Remove photo")}</button>}
          </div>
        </div>
      </Drawer>
    </div>
  );
}


return { PomodoroTimer, TmPomoFronta, pomoRunLoad };
}

// Permission is requested only by an explicit timer start.
async function notify(title, options) {
  try {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return false;
    if (navigator.serviceWorker) {
      const registration = await Promise.race([navigator.serviceWorker.ready, new Promise(resolve => setTimeout(() => resolve(null), 900))]);
      if (registration?.showNotification) { await registration.showNotification(title, options); return true; }
    }
    new Notification(title, options);
    return true;
  } catch { return false; }
}
