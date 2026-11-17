import React, { useEffect, useRef, useState } from 'react';
import { defaultExerciseRequest, unscopedExerciseAccess, requireExerciseScope, exerciseResponse } from '../product/exerciseClientRequest.js';

export function useCustomExercisePermission(client = false, { request = defaultExerciseRequest, captureScope = unscopedExerciseAccess } = {}) {
  const [state, setState] = useState({ enabled: !client, loading: client });
  const scope = useRef(captureScope()).current;
  useEffect(() => {
    if (!client) return;
    let alive = true;
    const read = async () => {
      try {
        const { response, body: value } = await exerciseResponse(request, scope, '/api/exercise-policy', { cache: 'no-store' });
        if (!response.ok || typeof value.enabled !== 'boolean') throw new Error('policy');
        if (alive) setState({ enabled: value.enabled, loading: false });
      } catch { if (alive) setState({ enabled: false, loading: false, error: true }); }
    };
    const visible = () => { if (!document.hidden) read(); };
    read();
    window.addEventListener('focus', read);
    document.addEventListener('visibilitychange', visible);
    return () => { alive = false; window.removeEventListener('focus', read); document.removeEventListener('visibilitychange', visible); };
  }, [client, request, scope]);
  return state;
}

export function createCustomExerciseUI({ useT, useStore, L, CenterSheet, FONT_BODY, FONT_DISPLAY, filesToAtts, PhotoPreview, MultiSelect, muscles = [], equipment = [], prepareAttachments = async att => att, request = defaultExerciseRequest, captureScope = unscopedExerciseAccess }) {
  function useClientCustomExercises() {
    const st = useStore();
    const store = useRef(st); store.current = st;
    useEffect(() => {
      let alive = true, generation = 0;
      const scope = captureScope();
      const read = async () => {
        if (!store.current.contentLibraryReady) return;
        const current = ++generation;
        try {
          const { response: r, body: data } = await exerciseResponse(request, scope, '/api/custom-exercises', { cache: 'no-store' });
          if (!r.ok || !Array.isArray(data.exercises) || !alive || current !== generation || !scope.current() || !store.current.contentLibraryReady) return;
          store.current.persistColl(c => {
            if (!scope.current()) return c;
            const accepted = data.exercises.filter(x => x?.id?.startsWith('custom_ex_'));
            const known = new Set([...accepted.map(x => x.id), ...(data.archivedIds || [])]);
            const pending = [...new Map([...(c.customExerciseImports || []), ...(c.tEx || []).filter(x => x.id?.startsWith('custom_ex_'))].filter(x => !known.has(x.id)).map(x => [x.id, x])).values()];
            const next = [...(c.tEx || []).filter(x => !x.id?.startsWith('custom_ex_')), ...accepted];
            return JSON.stringify(next) === JSON.stringify(c.tEx) && JSON.stringify(pending) === JSON.stringify(c.customExerciseImports || []) ? c : { ...c, tEx: next, customExerciseImports: pending };
          });
        } catch { /* Existing records remain readable offline. */ }
      };
      const visible = () => { if (!document.hidden) read(); };
      read(); window.addEventListener('online', read); window.addEventListener('tm-custom-exercises', read); document.addEventListener('visibilitychange', visible);
      return () => { alive = false; window.removeEventListener('online', read); window.removeEventListener('tm-custom-exercises', read); document.removeEventListener('visibilitychange', visible); };
    }, [st.contentLibraryReady]);
  }
  function CustomExerciseEditor({ onClose, onCreated, client = false, exercise = null }) {
    const { t } = useT();
    const st = useStore();
    const permission = useCustomExercisePermission(client, { request, captureScope });
    const scope = useRef(captureScope()).current;
    const [name, setName] = useState(exercise?.cz || '');
    const [measurement, setMeasurement] = useState(exercise?.measurementType || 'REPS_ONLY');
    const [note, setNote] = useState(exercise?.exe?.[0] || '');
    const [primary, setPrimary] = useState(exercise?.mp || []);
    const [secondary, setSecondary] = useState(exercise?.ms || []);
    const [gear, setGear] = useState(exercise?.eq || ['telo']);
    const [file, setFile] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [preview, setPreview] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const input = useRef(null);
    useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
    const field = { width: '100%', boxSizing: 'border-box', minHeight: 44, background: 'transparent', border: `1px solid ${t.borderSoft}`, borderRadius: 12, padding: '10px 12px', color: t.text, fontFamily: FONT_BODY, fontSize: 16 };
    const quiet = { background: 'transparent', color: t.accentInk || t.accent, border: 0, padding: '10px 0', cursor: 'pointer', minHeight: 44, fontFamily: FONT_BODY };
    const save = async (event) => {
      event.preventDefault();
      if (!name.trim() || busy || !permission.enabled) return;
      setBusy(true); setError('');
      try {
        requireExerciseScope(scope);
        if (client) { const { response: r, body: p } = await exerciseResponse(request, scope, '/api/exercise-policy', { cache: 'no-store' }); if (!r.ok || p.enabled !== true) throw new Error('permission'); }
        const oldAtt = exercise?.att || [];
        const att = file ? [...oldAtt.filter(a => !(a.type || a.mime || '').startsWith('image/')), ...await filesToAtts([file], st.ask)] : removePhoto ? oldAtt.filter(a => !(a.type || a.mime || '').startsWith('image/')) : oldAtt;
        requireExerciseScope(scope);
        if (file && !att.length || client && att.some(a => !a.r2)) throw new Error('photo');
        const id = exercise?.id || 'custom_ex_' + crypto.randomUUID();
        const timed = ['DURATION', 'WEIGHT_DURATION', 'DISTANCE_DURATION'].includes(measurement);
        const value = { ...exercise, id, custom: true, cz: name.trim(), en: name.trim(), measurementType: measurement,
          pat: exercise?.pat || 'custom', S: exercise?.S || 1, C: exercise?.C || 1, eq: gear, mode: timed ? 'sec' : 'reps', load: measurement.startsWith('WEIGHT_') ? 'ext' : measurement === 'ADDED_WEIGHT_REPS' ? 'add' : 'none',
          mp: primary, ms: secondary.filter(x => !primary.includes(x)), foc: exercise?.foc || ['', ''], pos: exercise?.pos || ['', ''], exe: [note.trim(), note.trim()], wat: exercise?.wat || ['', ''], pro: exercise?.pro || ['', ''], att, createdAt: exercise?.createdAt || Date.now() };
        if (client) { const { response: r } = await exerciseResponse(request, scope, '/api/custom-exercises', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exercise: value }) }); if (!r.ok) throw new Error(r.status === 403 ? 'permission' : 'save'); }
        requireExerciseScope(scope);
        if (exercise) st.updateEntry('tEx', id, value); else st.addEntry('tEx', value);
        if (client) window.dispatchEvent(new Event('tm-custom-exercises'));
        onCreated(id); onClose();
      } catch (e) { setError(e.message === 'permission' ? L('Přidávání vlastních cviků je vypnuté.', 'Creating custom exercises is disabled.') : L('Cvik se nepodařilo uložit. Zkus to znovu.', 'Could not save the exercise. Try again.')); }
      finally { setBusy(false); }
    };
    return <CenterSheet title={L('Vlastní cvik', 'Custom exercise')} onClose={onClose} vrstva={210}>
      <form onSubmit={save} style={{ display: 'grid', gap: 18, fontFamily: FONT_BODY, color: t.text }}>
        <label>{L('Název cviku', 'Exercise name')}<input required autoFocus maxLength={180} value={name} onChange={e => setName(e.target.value)} style={{ ...field, fontFamily: FONT_DISPLAY, fontSize: 25, marginTop: 6 }}/></label>
        <label>{L('Co zaznamenávat', 'What to record')}<select aria-label={L('Co zaznamenávat', 'What to record')} value={measurement} onChange={e => setMeasurement(e.target.value)} style={{ ...field, marginTop: 6 }}>
          {[['REPS_ONLY','Opakování','Repetitions'],['WEIGHT_REPS','Váha a opakování','Weight and reps'],['ADDED_WEIGHT_REPS','Opakování s přidanou váhou','Reps with extra weight'],['DURATION','Čas','Duration'],['WEIGHT_DURATION','Váha a čas','Weight and time'],['DISTANCE_DURATION','Vzdálenost a čas','Distance and time']].map(([v,cz,en]) => <option key={v} value={v}>{L(cz,en)}</option>)}
        </select></label>
        {MultiSelect && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <MultiSelect label={L('Hlavní svaly', 'Primary muscles')} values={primary} onChange={setPrimary} options={muscles.map(m => ({v:m.k,label:L(m.cz,m.en)}))}/>
          <MultiSelect label={L('Vedlejší svaly', 'Secondary muscles')} values={secondary} onChange={setSecondary} options={muscles.filter(m => !primary.includes(m.k)).map(m => ({v:m.k,label:L(m.cz,m.en)}))}/>
          <MultiSelect label={L('Vybavení', 'Equipment')} values={gear} onChange={setGear} options={equipment.map(m => ({v:m.k,label:L(m.cz,m.en)}))}/>
        </div>}
        <label>{L('Provedení · volitelné', 'Instructions · optional')}<textarea rows={3} value={note} onChange={e => setNote(e.target.value)} style={{ ...field, marginTop: 6 }}/></label>
        <div><input ref={input} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f?.type.startsWith('image/')) { setFile(f); setRemovePhoto(false); } }}/>
          {preview && <img src={preview} alt={L('Fotka cviku', 'Exercise photo')} style={{ display: 'block', maxWidth: '100%', maxHeight: 260, borderRadius: 12, objectFit: 'contain', margin: '0 auto 8px' }}/>}
          {!preview && !removePhoto && exercise && PhotoPreview && <PhotoPreview ex={exercise} size={220}/>}
          <button type="button" onClick={() => input.current?.click()} style={quiet}>{L(file ? 'Změnit fotku' : 'Přidat fotku', file ? 'Change photo' : 'Add photo')}</button>
          {(file || !removePhoto && exercise?.att?.some(a => (a.type || a.mime || '').startsWith('image/'))) && <button type="button" onClick={() => { setFile(null); setRemovePhoto(true); }} style={{ ...quiet, marginLeft: 20 }}>{L('Odebrat fotku', 'Remove photo')}</button>}
        </div>
        {error && <p role="alert" style={{ color: t.accentInk || t.accent }}>{error}</p>}
        <button type="submit" disabled={busy || !name.trim() || !permission.enabled} style={{ ...quiet, borderRadius: 12, background: t.accent + '20', opacity: busy || !permission.enabled ? .5 : 1 }}>{L(busy ? 'Ukládám…' : 'Uložit cvik', busy ? 'Saving…' : 'Save exercise')}</button>
        {client && exercise && <button type="button" disabled={busy || !permission.enabled} style={{ ...quiet, color: t.textMuted }} onClick={() => st.ask(L('Přesunout cvik do koše?', 'Move the exercise to trash?'), async () => {
          setBusy(true); setError('');
          try { const { response: r } = await exerciseResponse(request, scope, '/api/custom-exercises/' + encodeURIComponent(exercise.id), { method: 'DELETE' }); if (!r.ok) throw new Error(); requireExerciseScope(scope); st.removeEntry('tEx', exercise.id); window.dispatchEvent(new Event('tm-custom-exercises')); onClose(); }
          catch { setError(L('Cvik se nepodařilo přesunout. Zkus to znovu.', 'Could not move the exercise. Try again.')); }
          finally { setBusy(false); }
        })}>{L('Do koše', 'To trash')}</button>}
      </form>
    </CenterSheet>;
  }
  function CustomExerciseImports() {
    const { t } = useT(), st = useStore(), permission = useCustomExercisePermission(true, { request, captureScope });
    const scope = useRef(captureScope()).current;
    const [busy, setBusy] = useState(''), [error, setError] = useState('');
    const rows = st.coll.customExerciseImports || [];
    if (!rows.length) return null;
    const restore = async exercise => {
      setBusy(exercise.id); setError('');
      try {
        requireExerciseScope(scope);
        const att = await prepareAttachments(exercise.att || []);
        requireExerciseScope(scope);
        const value = { ...exercise, custom: true, att };
        const { response: r } = await exerciseResponse(request, scope, '/api/custom-exercises', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exercise: value }) });
        if (!r.ok) throw new Error();
        st.persistColl(c => scope.current() ? ({ ...c, customExerciseImports: (c.customExerciseImports || []).filter(x => x.id !== exercise.id), tEx: [...(c.tEx || []).filter(x => x.id !== exercise.id), value] }) : c);
        window.dispatchEvent(new Event('tm-custom-exercises'));
      } catch { setError(L('Obnova se nepodařila. Zkontroluj připojení a přístup.', 'Could not restore. Check your connection and access.')); }
      finally { setBusy(''); }
    };
    return <section style={{ fontFamily: FONT_BODY, color: t.text, marginBottom: 18 }}>
      <p>{L('Vlastní cviky ze zálohy', 'Custom exercises from backup')}</p>
      {rows.map(ex => <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><span style={{ flex: 1 }}>{ex.cz || ex.en}</span><button disabled={!permission.enabled || !!busy} onClick={() => restore(ex)} style={{ color: t.accentInk || t.accent, background: 'transparent', border: 0, minHeight: 44, cursor: 'pointer' }}>{L(busy === ex.id ? 'Obnovuji…' : 'Obnovit', busy === ex.id ? 'Restoring…' : 'Restore')}</button></div>)}
      {error && <p role="alert">{error}</p>}
    </section>;
  }
  function CustomExerciseAccess({ accountId, apiUrl }) {
    const { t } = useT();
    const [enabled, setEnabled] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const url = apiUrl;
    useEffect(() => { let alive = true; fetch(url, { cache: 'no-store' }).then(async r => { const p = await r.json(); if (!r.ok || typeof p.enabled !== 'boolean') throw new Error(); if (alive) setEnabled(p.enabled); }).catch(() => { if (alive) setError(L('Nastavení se nepodařilo načíst.', 'Could not load access.')); }); return () => { alive = false; }; }, [url]);
    const change = async () => { setBusy(true); setError(''); try { const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: !enabled }) }); const p = await r.json(); if (!r.ok || typeof p.enabled !== 'boolean') throw new Error(); setEnabled(p.enabled); } catch { setError(L('Změna se neuložila. Zkus to znovu.', 'Change was not saved. Try again.')); } finally { setBusy(false); } };
    return <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: t.text }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44 }}><input type="checkbox" checked={enabled === true} disabled={enabled === null || busy} onChange={change} style={{ accentColor: t.accent }}/>{L('Přidávání a úprava vlastních cviků', 'Create and edit custom exercises')}</label>
      <p style={{ fontSize: 12, lineHeight: 1.6, color: t.textMuted, margin: '4px 0' }}>{L('Vypnutí zachová dřívější cviky i tréninkové záznamy.', 'Disabling keeps existing exercises and workout records.')}</p>
      {error && <p role="alert">{error}</p>}
    </div>;
  }
  return { CustomExerciseEditor, CustomExerciseAccess, CustomExerciseImports, useClientCustomExercises };
}
