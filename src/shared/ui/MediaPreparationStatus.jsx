import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function MediaPreparationStatus({ t, lang = 'cs', namespace }) {
  const [tasks, setTasks] = useState({});
  useEffect(() => {
    setTasks({});
    const update = event => {
      const value = event.detail;
      if (!value?.id || value.namespace !== namespace) return;
      setTasks(previous => { const next = {...previous}; if (value.action === 'end') delete next[value.id]; else next[value.id] = {...previous[value.id], ...value}; return next; });
    };
    window.addEventListener('tm-media-preparing', update);
    return () => window.removeEventListener('tm-media-preparing', update);
  }, [namespace]);
  const rows = Object.values(tasks).filter(task => task.namespace === namespace), task = rows[0];
  if (!task) return null;
  const L = (cs, en) => lang === 'en' ? en : cs;
  const progress = Number.isFinite(task.progress) ? Math.max(0, Math.min(1, task.progress)) : null;
  return createPortal(<div data-testid="media-preparation-status" role="status" aria-live="polite" style={{ position: 'fixed', zIndex: 2147483000, bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))', left: '50%', transform: 'translateX(-50%)', width: 'min(420px, calc(100vw - 32px))', padding: '12px 16px', boxSizing: 'border-box', border: `1px solid ${t.border}`, borderRadius: 10, background: t.card || t.bg, color: t.text, boxShadow: `0 4px 16px ${t.border}`, fontFamily: 'var(--tm-font-body)', fontSize: 14, lineHeight: 1.5, pointerEvents: 'none' }}>
    <div>{task.kind === 'audio' ? L('Připravuji zvuk do 15 MB…', 'Preparing audio to fit 15 MB…') : L('Připravuji obrázek do 2 MB…', 'Preparing image to fit 2 MB…')}</div>
    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: t.textSec }}>{task.name}</div>
    {task.phase === 'encoding' && progress != null ? <progress aria-label={L('Průběh převodu', 'Conversion progress')} max={1} value={progress} style={{ width: '100%', accentColor: t.accent }}/> : <span style={{ color: t.textSec, fontSize: 12 }}>{L('Převod probíhá v tomto zařízení.', 'Conversion runs on this device.')}</span>}
    {rows.length > 1 && <div>{L(`Zpracovávají se ${rows.length} soubory.`, `${rows.length} files are being prepared.`)}</div>}
  </div>, document.body);
}
