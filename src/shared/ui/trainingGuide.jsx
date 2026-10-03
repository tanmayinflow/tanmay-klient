import React, { useState } from 'react';
import { guideSteps, setSeconds, completeGuidedSet } from '../../training/guide.js';

// Shared visual/session flow; adapters supply the role-safe exercise catalog,
// existing clock engine and write only the current person's actual session.
export function createTrainingGuideUI(deps) {
  const { useT, useStore, L, TL, TV, FONT_BODY, FONT_TAG, FONT_DISPLAY,
    hexA, tvQuiet, FamilyIcon, TrainingSourceText, TExArt, TvField,
    tmCompile, useTmEngine, useWakeLock, tmAudio,
    exerciseRow, exerciseRecord, blockName, isCzech } = deps;
  const tvCz = isCzech;
  const tvFmtA = (mt, a) => TV.fmtActual(mt, a, tvCz());
  const tvFmtP = (mt, p) => TV.fmtPlanned(mt, p, tvCz());

// „3 × 8–10 · 60 kg" · jeden řádek, ze kterého je jasné, co dnes čeká.
function tvPlanText(block) {
  const sets = block.sets || [];
  const work = sets.filter((s) => TV.isWorkingSet(s));
  const warm = sets.filter((s) => s.type === "warmup");
  const texts = work.map((s) => tvPlanShort(block.measurementType, s.planned) || "—");
  const same = texts.length && texts.every((x) => x === texts[0]);
  const main = !texts.length ? L("bez plánu", "no plan") : same ? `${texts.length} × ${texts[0]}` : texts.join(" · ");
  return { main, warm: warm.length, work: work.length };
}

// Krátký zápis cíle bez úvodního „×": „10", „8–10 · 60 kg", „40 s", „+10 kg × 8".
// `fmtPlanned` píše „60 kg × 8" nebo „10×" — pro řádek „3 × …" to musí být holé.
function tvPlanShort(mt, p) {
  if (!p) return "";
  const cz = tvCz();
  const reps = p.targetRepsMin != null && p.targetRepsMax != null && p.targetRepsMin !== p.targetRepsMax
    ? p.targetRepsMin + "–" + p.targetRepsMax
    : p.targetReps != null ? String(p.targetReps) : p.targetRepsMin != null ? String(p.targetRepsMin) : "";
  const w = p.targetWeight != null && Number.isFinite(Number(p.targetWeight)) ? Number(p.targetWeight) : null;
  const dur = p.targetDurationSec != null ? TV.fmtDuration(p.targetDurationSec, cz) : "";
  const dist = p.targetDistanceM != null ? TV.fmtDistance(p.targetDistanceM, cz) : "";
  switch (mt) {
    case "WEIGHT_REPS": return [reps, w != null ? TV.fmtWeight(w, cz) : ""].filter(Boolean).join(" · ");
    case "ADDED_WEIGHT_REPS": return [reps, w != null ? "+" + TV.fmtWeight(w, cz) : ""].filter(Boolean).join(" · ");
    case "ASSISTED_REPS": return [reps, p.targetAssistance != null ? "−" + TV.fmtWeight(p.targetAssistance, cz) : ""].filter(Boolean).join(" · ");
    case "DURATION": return dur;
    case "WEIGHT_DURATION": return [dur || dist, w != null ? TV.fmtWeight(w, cz) : ""].filter(Boolean).join(" · ");
    case "DISTANCE_DURATION": return [dist, dur].filter(Boolean).join(" · ");
    case "DISTANCE": return dist;
    case "ROUNDS": return [p.targetRounds != null ? p.targetRounds + " " + (cz ? "kol" : "rounds") : "", dur].filter(Boolean).join(" · ");
    case "HEIGHT_REPS": return [reps, p.targetHeight != null ? p.targetHeight + " cm" : ""].filter(Boolean).join(" · ");
    default: return reps;
  }
}

// Je série „na čas"? Pak má průvodce spustit odpočet místo čekání na číslo.
// ---- přehled dne · co čeká, cvik po cviku ----------------------------------
function TvPlanOverview({ session, onStart, onList, onClose, onOpenEx }) {
  const { t } = useT();
  const st = useStore();
  const labels = TV.blockLabels(session);
  const blocks = session.blocks || [];
  const counts = TV.countSets(session);
  const totalRest = blocks.reduce((n, b) => n + (b.restSec || 0) * Math.max(0, (b.sets || []).length - 1), 0);
  const timed = blocks.some((b) => (b.sets || []).some((s) => setSeconds(b, s) > 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted }}>
            {L("Dnes na programu", "Today's session")}
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: t.heading, lineHeight: 1.2, marginTop: 4 }}>{L(session.cz, session.en) || L("Trénink", "Workout")}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: t.textMuted, marginTop: 4 }}>
            {blocks.length} {L(blocks.length === 1 ? "cvik" : blocks.length < 5 ? "cviky" : "cviků", blocks.length === 1 ? "exercise" : "exercises")} · {counts.working} {L("pracovních sérií", "working sets")}
            {totalRest ? " · " + L("pauzy ", "rest ") + TV.fmtDuration(totalRest, tvCz()) : ""}
          </div>
        </div>
        <button onClick={onClose} style={{ ...tvQuiet(t), flexShrink: 0 }}>{L("Zavřít", "Close")}</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {blocks.map((b) => {
          const row = exerciseRow(st, b.exId);
          const plan = tvPlanText(b);
          const done = (b.sets || []).filter((s) => s.completed).length;
          return (
            <div key={b.id} className="tm-tvplan" style={{ display: "grid", gridTemplateColumns: "64px minmax(0,1fr) auto", alignItems: "center", gap: 12, border: `1px solid ${t.border}`, borderRadius: 14, background: t.card, padding: "10px 12px 10px 10px", minHeight: 76 }}>
              <button onClick={() => onOpenEx && onOpenEx(b.exId)} aria-label={blockName(b, st)}
                style={{ background: "transparent", border: "none", padding: 0, cursor: onOpenEx ? "pointer" : "default", color: t.sand, width: 64, height: 64, display: "grid", placeItems: "center" }}>
                {row ? <TExArt ex={row} size={62} stroke="currentColor" showDot={false} /> : null}
              </button>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7, minWidth: 0 }}>
                  {labels[b.id] ? <span style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.1em", color: b.groupId ? t.accent : t.textMuted, flexShrink: 0 }}>{labels[b.id]}</span> : null}
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: t.heading, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{blockName(b, st)}</span>
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 15, color: t.heading, fontVariantNumeric: "tabular-nums", marginTop: 3 }}>
                  {plan.main}
                </div>
                <div style={{ fontFamily: FONT_TAG, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, marginTop: 3 }}>
                  {plan.warm ? `${plan.warm} ${L("rozehř.", "warm-up")} · ` : ""}{L("pauza ", "rest ")}{TV.fmtDuration(b.restSec || 0, tvCz())}
                  {done ? ` · ${done}/${(b.sets || []).length} ${L("hotovo", "done")}` : ""}
                </div>
              </div>
              <span aria-hidden="true" style={{ fontFamily: FONT_TAG, fontSize: 12, color: t.textMuted }}><FamilyIcon id="forward" size={12} label={L("Dále","Next")} style={{ display: "inline-block", verticalAlign: "middle" }} /></span>
            </div>
          );
        })}
      </div>

      <button onClick={onStart} className="tm-cta"
        style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 14, padding: "15px 20px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 16, minHeight: 56, marginTop: 4 }}>
        {counts.completed ? L("Pokračovat v průvodci", "Continue the guide") : L("Spustit trénink", "Start the workout")}
      </button>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <button onClick={onList} style={tvQuiet(t)}>{L("Zapisovat v seznamu", "Log in the list view")}</button>
        {timed ? <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: t.textMuted }}>{L("Série na čas mají v průvodci odpočet.", "Timed sets get a countdown in the guide.")}</span> : null}
      </div>
    </div>
  );
}

// ---- odpočet série · jeden segment práce, 3·2·1 a mísa na konci ------------
function TvSetClock({ sec, autoStart, onDone, onCancel }) {
  const { t } = useT();
  const st = useStore();
  const cfg = st.tmCfg();
  const compiled = React.useMemo(() => tmCompile([{ id: "tv_set", k: "work", dur: Math.max(1, sec) }], { countIn: 0, endCue: "go" }), [sec]);
  const fired = React.useRef(false);
  const eng = useTmEngine(compiled, cfg, () => { if (!fired.current) { fired.current = true; onDone?.(sec); } });
  React.useEffect(() => { if (autoStart) eng.start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useWakeLock(cfg.wake && eng.status === "running");
  const left = eng.status === "idle" ? sec : Math.max(0, Math.ceil(eng.left == null ? sec : eng.left));
  const pct = eng.status === "idle" ? 0 : Math.min(1, eng.progress);
  const R = 54, C = 2 * Math.PI * R;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 12px", border: `1px solid ${hexA(t.accent, 0.35)}`, borderRadius: 14, background: hexA(t.accent, 0.06) }}>
      <div style={{ position: "relative", width: 124, height: 124, flexShrink: 0 }}>
        <svg viewBox="0 0 124 124" width="124" height="124" aria-hidden="true">
          <circle cx="62" cy="62" r={R} fill="none" stroke={hexA(t.accent, 0.18)} strokeWidth="6" />
          <circle cx="62" cy="62" r={R} fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 62 62)" style={{ transition: "stroke-dashoffset 300ms linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontSize: 34, fontVariantNumeric: "tabular-nums", color: t.heading }}>
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted }}>
          {eng.status === "idle" ? L("Výdrž · odpočet", "Hold · countdown") : eng.status === "paused" ? L("Pozastaveno", "Paused") : L("Drž", "Hold")}
        </div>
        {eng.status === "idle" ? (
          <button onClick={() => { tmAudio.unlock(); eng.start(); }} className="tm-cta"
            style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 12, padding: "12px 16px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 15, minHeight: 46 }}>
            {L("Spustit čas", "Start the clock")}
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => { tmAudio.unlock(); eng.toggle(); }} style={tvQuiet(t)}>{eng.status === "paused" ? L("Pokračovat", "Resume") : L("Pozastavit", "Pause")}</button>
            <button onClick={() => { fired.current = true; onDone?.(Math.max(0, Math.min(sec, Math.round(eng.elapsed || 0)))); }} style={tvQuiet(t)}>{L("Hotovo dřív", "Done early")}</button>
            <button onClick={() => { eng.stop(); onCancel?.(); }} style={tvQuiet(t)}>{L("Zrušit", "Cancel")}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- pauza mezi sériemi · přes celou plochu průvodce ----------------------
function TvRestStage({ sec, reason, next, onDone, onSkip }) {
  const { t } = useT();
  const st = useStore();
  const cfg = st.tmCfg();
  const compiled = React.useMemo(() => tmCompile([{ id: "tv_rest", k: "rest", dur: Math.max(1, sec) }], { countIn: 0, endCue: "go" }), [sec]);
  const fired = React.useRef(false);
  const eng = useTmEngine(compiled, cfg, () => { if (!fired.current) { fired.current = true; onDone?.(); } });
  React.useEffect(() => { eng.start(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useWakeLock(cfg.wake && eng.status === "running");
  const left = Math.max(0, Math.ceil(eng.left == null ? sec : eng.left));
  const pct = Math.min(1, eng.progress);
  const R = 84, C = 2 * Math.PI * R;
  return (
    <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, padding: "24px 12px", flex: 1, justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ fontFamily: FONT_TAG, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: t.textMuted }}>
        {reason === "transition" ? L("Přechod na další cvik", "Moving to the next exercise")
          : reason === "warmup" ? L("Krátká pauza po rozehřátí", "A short rest after the warm-up")
          : L("Pauza běží", "Rest is running")}
      </div>
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" width="200" height="200" aria-hidden="true">
          <circle cx="100" cy="100" r={R} fill="none" stroke={hexA(t.accent, 0.16)} strokeWidth="7" />
          <circle cx="100" cy="100" r={R} fill="none" stroke={t.accent} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 100 100)" style={{ transition: "stroke-dashoffset 300ms linear" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontSize: 54, fontVariantNumeric: "tabular-nums", color: t.heading, lineHeight: 1 }}>
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
        </div>
      </div>
      {next ? (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted }}>{L("Další", "Next")}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: t.heading, marginTop: 4 }}>{next.name}</div>
          <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.sand, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{next.detail}</div>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { tmAudio.unlock(); eng.toggle(); }} style={tvQuiet(t)}>{eng.status === "paused" ? L("Pokračovat", "Resume") : L("Pozastavit", "Pause")}</button>
        <button onClick={() => { fired.current = true; onSkip?.(); }} className="tm-cta"
          style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 12, padding: "10px 18px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 14.5, minHeight: 44 }}>
          {L("Přeskočit pauzu", "Skip the rest")}
        </button>
      </div>
    </div>
  );
}

// ---- lišta cviků · kde jsem a kam můžu skočit ------------------------------
function TvExStrip({ session, currentBlockId, onJump }) {
  const { t } = useT();
  const st = useStore();
  const labels = TV.blockLabels(session);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector("[data-cur='1']");
    if (el && el.scrollIntoView) { try { el.scrollIntoView({ block: "nearest", inline: "center", behavior: typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); } catch {} }
  }, [currentBlockId]);
  return (
    <div ref={ref} style={{ display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "2px 2px 6px", scrollbarWidth: "none" }}>
      {(session.blocks || []).map((b) => {
        const sets = b.sets || [];
        const done = sets.filter((s) => s.completed).length;
        const cur = b.id === currentBlockId;
        const all = sets.length && done === sets.length;
        return (
          <button key={b.id} data-cur={cur ? "1" : "0"} onClick={() => onJump(b.id)} aria-current={cur ? "step" : undefined}
            style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, background: cur ? hexA(t.accent, 0.14) : "transparent", border: `1px solid ${cur ? t.accent : all ? hexA(t.accent, 0.4) : t.borderSoft}`, borderRadius: 999, padding: "6px 11px", cursor: "pointer", color: cur ? t.accent : all ? t.sand : t.textSec, fontFamily: FONT_BODY, fontSize: 12.5, minHeight: 34, maxWidth: 200 }}>
            {labels[b.id] ? <span style={{ fontFamily: FONT_TAG, fontSize: 10, letterSpacing: "0.08em" }}>{labels[b.id]}</span> : null}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blockName(b, st)}</span>
            <span style={{ fontFamily: FONT_TAG, fontSize: 10, color: cur ? t.accent : t.textMuted, fontVariantNumeric: "tabular-nums" }}>{done}/{sets.length}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---- průvodce ---------------------------------------------------------------
function TvGuide({ session, onSession, onOpenEx, onFinish, onList, onClose, prevFor }) {
  const { t } = useT();
  const st = useStore();
  const cfg = st.tmCfg();
  const steps = React.useMemo(() => guideSteps(session), [session]);
  const firstOpen = steps.findIndex((x) => !x.set.completed);
  const [pos, setPos] = useState(firstOpen < 0 ? 0 : firstOpen);
  const [rest, setRest] = useState(null);           // { sec, reason, nonce, next }
  const [clock, setClock] = useState(null);         // { nonce, auto } · běžící odpočet série
  const [auto, setAuto] = useState(!!cfg.guideAuto);
  const nonce = React.useRef(0);
  const labels = TV.blockLabels(session);
  const counts = TV.countSets(session);

  const step = steps[Math.min(pos, Math.max(0, steps.length - 1))] || null;
  const block = step ? step.block : null;
  const set = step ? step.set : null;
  const m = block ? TV.measurementOf(block.measurementType) : null;
  const fields = m ? m.fields.concat(m.secondary ? [m.secondary] : []) : [];
  const rec = block ? exerciseRecord(st, block.exId) : null;
  const row = block ? exerciseRow(st, block.exId) : null;
  const prev = block && prevFor ? prevFor(block.exId) : null;
  const prevSet = prev && prev.sets ? prev.sets[Math.min(step.setIndex, prev.sets.length - 1)] : null;
  const seconds = block ? setSeconds(block, set) : 0;
  const anyTimed = React.useMemo(() => steps.some((x) => setSeconds(x.block, x.set) > 0), [steps]);
  const setsInBlock = block ? (block.sets || []).length : 0;

  const stepName = (x) => blockName(x.block, st);
  const stepDetail = (x) => `${L("série", "set")} ${x.setIndex + 1}/${(x.block.sets || []).length} · ${tvFmtP(x.block.measurementType, x.set.planned) || "—"}`;

  const patchActual = (patch, rir) => onSession((s) => {
    let next = s;
    if (patch) next = TV.setActual(next, block.id, set.id, patch);
    if (rir !== undefined) next = TV.setRir(next, block.id, set.id, rir);
    return next;
  });

  // Hotovo: prázdná pole dostanou plán (potvrzení jedním klepnutím), série
  // se zavře, pauza se spočítá z toho, co přijde, a průvodce jde dál.
  const complete = (extra) => {
    tmAudio.unlock();
    const nextStep = steps[pos + 1] || null;
    // Stejný krok dvakrát: jednou hned, aby průvodce věděl, jaká pauza přijde,
    // a jednou jako aktualizace sbírky (ta může proběhnout až v dalším renderu).
    const applyComplete = (s) => completeGuidedSet(s, block.id, set.id, { previousActual: prevSet?.actual, extra, now: Date.now() });
    const restInfo = TV.restAfterSet(applyComplete(session), block.id, set.id);
    onSession(applyComplete);
    setClock(null);
    if (!nextStep) { onFinish(); return; }
    setPos(pos + 1);
    if (restInfo && restInfo.sec > 0) {
      nonce.current += 1;
      setRest({ sec: restInfo.sec, reason: restInfo.reason, nonce: nonce.current, next: { name: stepName(nextStep), detail: stepDetail(nextStep) } });
    } else if (auto && !nextStep.set.completed && setSeconds(nextStep.block, nextStep.set) > 0) {
      nonce.current += 1; setClock({ nonce: nonce.current, auto: true });
    }
  };
  const skip = () => { setClock(null); setRest(null); if (pos + 1 < steps.length) setPos(pos + 1); else onFinish(); };
  const back = () => { setClock(null); setRest(null); setPos(Math.max(0, pos - 1)); };
  const jump = (blockId) => {
    setClock(null); setRest(null);
    const i = steps.findIndex((x) => x.block.id === blockId && !x.set.completed);
    const j = i >= 0 ? i : steps.findIndex((x) => x.block.id === blockId);
    if (j >= 0) setPos(j);
  };
  const restDone = () => {
    setRest(null);
    const nx = steps[pos];
    if (auto && nx && setSeconds(nx.block, nx.set) > 0 && !nx.set.completed) { nonce.current += 1; setClock({ nonce: nonce.current, auto: true }); }
  };
  const toggleAuto = () => { const v = !auto; setAuto(v); st.setTmCfg({ guideAuto: v }); };

  if (!step) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.textSec }}>{L("Tenhle trénink nemá žádné série.", "This session has no sets.")}</div>
        <button onClick={onClose} style={tvQuiet(t)}>{L("Zavřít", "Close")}</button>
      </div>
    );
  }

  const doneSteps = steps.filter((x) => x.set.completed).length;
  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button onClick={onClose} aria-label={L("Zavřít průvodce", "Close the guide")} style={{ ...tvQuiet(t), padding: "6px 10px" }}><FamilyIcon id="close" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
      <div style={{ minWidth: 0, flex: 1, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {L(session.cz, session.en) || L("Trénink", "Workout")}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: t.textSec, fontVariantNumeric: "tabular-nums" }}>
          {doneSteps}/{steps.length} {L("sérií", "sets")}
        </div>
      </div>
      <button onClick={onList} style={{ ...tvQuiet(t), padding: "6px 10px" }} aria-label={L("Seznam", "List")}><FamilyIcon id="menu" size={16} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
    </div>
  );
  const bar = (
    <div aria-hidden="true" style={{ height: 3, borderRadius: 2, background: t.borderSoft, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.round((doneSteps / Math.max(1, steps.length)) * 100)}%`, background: t.accent, transition: "width 300ms" }} />
    </div>
  );

  if (rest) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: "100%" }}>
        {header}{bar}
        <TvRestStage key={rest.nonce} sec={rest.sec} reason={rest.reason} next={rest.next} onDone={restDone} onSkip={restDone} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {header}{bar}
      <TvExStrip session={session} currentBlockId={block.id} onJump={jump} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" }}>
        <button onClick={() => onOpenEx && onOpenEx(block.exId)} aria-label={blockName(block, st)}
          style={{ background: "transparent", border: "none", padding: 0, cursor: onOpenEx ? "pointer" : "default", color: t.sand, width: "min(46vw, 200px)" }}>
          {row ? <TExArt ex={row} fluid stroke="currentColor" showDot={false} /> : null}
        </button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {labels[block.id] ? <span style={{ fontFamily: FONT_TAG, fontSize: 11, letterSpacing: "0.12em", color: block.groupId ? t.accent : t.textMuted }}>{labels[block.id]}</span> : null}
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: t.heading, lineHeight: 1.15 }}>{blockName(block, st)}</span>
        </div>
        {rec && rec.focus ? <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontSize: 13.5, lineHeight: 1.5, color: t.sand, maxWidth: 480 }}>{TL(rec.focus)}</div> : null}
        {TL(block.coachNote) ? <div style={{ borderLeft: `2px solid ${t.accent}`, paddingLeft: 9, textAlign: "left", fontFamily: FONT_BODY, fontSize: 13.5, lineHeight: 1.5, color: t.textSec, maxWidth: 480 }}><TrainingSourceText text={TL(block.coachNote)} color={t.accentInk || t.accent}/></div> : null}
      </div>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: 16, background: t.card, padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT_TAG, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: t.accent }}>
            {L("Série", "Set")} {step.setIndex + 1} {L("z", "of")} {setsInBlock}{set.side === "L" ? L(" · Levá strana", " · Left side") : set.side === "R" ? L(" · Pravá strana", " · Right side") : ""}
          </span>
          {set.type !== "work" ? <span style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: set.type === "warmup" ? t.sage : t.accent }}>{TL(TV.SET_TYPE_LABEL[set.type] || ["", ""])}</span> : null}
          {set.completed ? <span style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: t.sage }}><FamilyIcon id="check" size={16} label={L("Hotovo","Done")} style={{ display: "inline-block", verticalAlign: "middle" }} />{L("hotová", "done")}</span> : null}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontFamily: FONT_TAG, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted }}>{L("Cíl", "Target")}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: t.heading, fontVariantNumeric: "tabular-nums", lineHeight: 1.15, marginTop: 2 }}>{tvFmtP(block.measurementType, set.planned) || "—"}</div>
          </div>
          <div>
            <div style={{ fontFamily: FONT_TAG, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: t.textMuted }}>{L("Minule", "Last time")}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 17, color: t.sand, fontVariantNumeric: "tabular-nums", marginTop: 6 }}>
              {prevSet ? tvFmtA(block.measurementType, prevSet.actual) : "—"}
            </div>
            {prev && prev.date ? <div style={{ fontFamily: FONT_TAG, fontSize: 10, color: t.textMuted }}>{prev.date}</div> : null}
          </div>
        </div>

        {seconds > 0 && !set.completed ? (
          clock ? (
            <TvSetClock key={clock.nonce} sec={seconds} autoStart={clock.auto}
              onDone={(actualSeconds) => complete({ durationSec: actualSeconds })}
              onCancel={() => setClock(null)} />
          ) : (
            <button onClick={() => { tmAudio.unlock(); nonce.current += 1; setClock({ nonce: nonce.current, auto: true }); }}
              style={{ ...tvQuiet(t), padding: "10px 14px", minHeight: 44, fontSize: 14, borderColor: hexA(t.accent, 0.45), color: t.accent }}>
              <FamilyIcon id="timer" size={16} /> {L("Spustit odpočet", "Start the countdown")} · {TV.fmtDuration(seconds, tvCz())}
            </button>
          )
        ) : null}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          {fields.map((f) => (
            <TvField key={f} field={f} value={set.actual[f] == null ? null : set.actual[f]} onChange={(v) => patchActual({ [f]: v })} />
          ))}
          {block.rirEnabled ? (
            <label style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: FONT_TAG, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted }}>RIR</span>
              <input inputMode="numeric" aria-label="RIR" value={set.rir == null ? "" : String(set.rir)}
                onChange={(e) => patchActual(null, e.target.value === "" ? null : Number(e.target.value))}
                style={{ width: 56, background: t.inputBg || "transparent", border: `1px solid ${t.borderSoft}`, borderRadius: 8, padding: 8, color: t.heading, fontFamily: FONT_BODY, fontSize: 16, textAlign: "center", minHeight: 40 }} />
            </label>
          ) : null}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: t.textMuted }}>
          {L("Prázdné pole = podle plánu, bez plánu jako minule. Přepiš jen to, co bylo jinak.", "Empty field = as planned, or as last time where there is no plan. Change only what was different.")}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 8, alignItems: "stretch" }}>
        <button onClick={back} disabled={pos === 0} aria-label={L("Předchozí série", "Previous set")}
          style={{ ...tvQuiet(t), minHeight: 56, fontSize: 18, opacity: pos === 0 ? 0.4 : 1 }}><FamilyIcon id="back" size={12} style={{ display: "inline-block", verticalAlign: "middle" }} /></button>
        {set.completed ? (
          <button onClick={() => { if (pos + 1 < steps.length) setPos(pos + 1); else onFinish(); }} className="tm-cta"
            style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 16, minHeight: 56 }}>
            {pos + 1 < steps.length ? L("Další série", "Next set") : L("Dokončit trénink", "Finish the workout")}
          </button>
        ) : (
          <button onClick={() => complete()} className="tm-cta" aria-label={L("Série hotová", "Set done")}
            style={{ background: t.accent, color: t.onAccent, border: "none", borderRadius: 14, padding: "14px 16px", cursor: "pointer", fontFamily: FONT_BODY, fontSize: 16, minHeight: 56 }}>
            {L("Hotovo", "Done")}{pos + 1 < steps.length ? " · " + L("další", "next") : ""}
          </button>
        )}
        <button onClick={skip} style={{ ...tvQuiet(t), minHeight: 56 }}>{L("Přeskočit", "Skip")}</button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT_TAG, fontSize: 10.5, letterSpacing: "0.1em", color: t.textMuted }}>
          {L("pauza po sérii ", "rest after the set ")}{TV.fmtDuration(set.restSec == null ? block.restSec : set.restSec, tvCz())}
        </span>
        {anyTimed ? (
          <button onClick={toggleAuto} role="switch" aria-checked={auto}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", border: `1px solid ${auto ? t.accent : t.borderSoft}`, borderRadius: 999, cursor: "pointer", padding: "6px 12px 6px 8px", minHeight: 40, color: auto ? t.accent : t.textSec, fontFamily: FONT_BODY, fontSize: 13 }}>
            <span aria-hidden="true" style={{ width: 30, height: 18, borderRadius: 10, background: auto ? hexA(t.accent, 0.28) : "transparent", border: `1px solid ${auto ? t.accent : t.border}`, position: "relative", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 2, left: auto ? 13 : 2, width: 12, height: 12, borderRadius: "50%", background: auto ? t.accent : t.textMuted, transition: "left .18s ease" }} />
            </span>
            {L("Automaticky · odpočty a pauzy jedou samy", "Automatic · countdowns and rests run by themselves")}
          </button>
        ) : null}
        {counts.completed > 0 ? <button onClick={onFinish} style={tvQuiet(t)}>{L("Ukončit dřív", "Finish early")}</button> : null}
      </div>
    </div>
  );
}


return { TvPlanOverview, TvGuide };
}
