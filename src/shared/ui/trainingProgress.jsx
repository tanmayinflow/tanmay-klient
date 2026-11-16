import React from 'react';
import './trainingRows.css';
import { historyChartPoints } from '../../training/historyChart.js';

// A runner is one Escape layer for its whole lifetime. Inline close callbacks
// change after saves; re-registering them would lift the runner above a newly
// opened exercise sheet and close the workout instead of that sheet.
export function useTrainingRunnerEscape(onClose, register) {
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => register(() => closeRef.current?.()), [register]);
}

export function createTrainingProgressUI({ useT, L, FONT_BODY, FONT_TAG, TV }) {
  function TrainingDetailTabs({ value, onChange, children }) {
    const { t } = useT();
    const start = React.useRef(null), id = React.useId();
    const tabs = [['overview', L('Přehled', 'Overview')], ['technique', L('Provedení', 'Technique')]];
    const change = next => onChange(next);
    return <div data-training-detail-tabs="" onTouchStart={e => {
      e.stopPropagation();
      start.current = e.touches.length === 1 && !e.target.closest('input,textarea,button,select,a,[contenteditable="true"]') && !window.getSelection()?.toString() ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }} onTouchEnd={e => {
      e.stopPropagation(); const p = start.current; start.current = null;
      if (!p || !e.changedTouches[0] || window.getSelection()?.toString()) return;
      const dx = e.changedTouches[0].clientX - p.x, dy = e.changedTouches[0].clientY - p.y;
      if (Math.abs(dx) >= 80 && Math.abs(dy) < 40) change(dx < 0 ? 'technique' : 'overview');
    }} onTouchCancel={() => { start.current = null; }}>
      <div role="tablist" aria-label={L('Detail cviku', 'Exercise details')} style={{ display: 'flex', borderBottom: `1px solid ${t.borderSoft}`, marginBottom: 18 }}>
        {tabs.map(([key, label], index) => <button key={key} type="button" role="tab" id={id + key} aria-controls={id + 'panel'} aria-selected={value === key} tabIndex={value === key ? 0 : -1}
          onClick={() => change(key)} onKeyDown={e => { if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : 1-index; change(tabs[next][0]); e.currentTarget.parentElement.children[next].focus(); } }}
          style={{ flex: 1, minHeight: 44, padding: '10px 14px', background: 'transparent', border: 0, borderBottom: `2px solid ${value === key ? t.accent : 'transparent'}`, color: value === key ? t.accentInk || t.accent : t.textSec, fontFamily: FONT_BODY, fontSize: 14, cursor: 'pointer' }}>{label}</button>)}
      </div>
      <div role="tabpanel" id={id + 'panel'} aria-labelledby={id + value} tabIndex={0}>{children}</div>
    </div>;
  }
  function TrainingHistoryChart({ series, type }) {
    const { t } = useT();
    const points = historyChartPoints(series), [selected, select] = React.useState(null);
    const point = points[selected] || points.at(-1);
    if (!points.length) return null;
    const spec = TV.FIELD[TV.measurementOf(type).lead], label = L(spec?.cz || '', spec?.en || ''), unit = L(spec?.unit?.[0] || '', spec?.unit?.[1] || '');
    return <div data-training-history-chart="" style={{ color: t.textSec, fontFamily: FONT_BODY }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 13 }}><span>{label}{unit ? ' · ' + unit : ''}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{point.date} · {point.raw}{unit ? ' ' + unit : ''}</span></div>
      <svg viewBox="0 0 320 112" width="100%" height="112" role="img" aria-label={L('Vývoj uložených hodnot v čase', 'Recorded values over time')}>
        <line x1="12" y1="100" x2="308" y2="100" stroke={t.borderSoft}/>
        {points.length > 1 && <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={t.accent} strokeWidth="1.8" strokeLinejoin="round"/>}
        {points.map((p,i) => <g key={p.time+'-'+i}><circle cx={p.x} cy={p.y} r="3.5" fill={t.accent}/><circle cx={p.x} cy={p.y} r="14" fill="transparent" role="button" tabIndex={0} aria-label={`${p.date}: ${p.raw} ${unit}`} onFocus={() => select(i)} onClick={() => select(i)} onKeyDown={e => { if(e.key==='Enter'||e.key===' ') {e.preventDefault(); select(i);} }}><title>{`${p.date}: ${p.raw} ${unit}`}</title></circle></g>)}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_TAG, fontSize: 12, color: t.textMuted }}><span>{points[0].date}</span>{points.length > 1 && <span>{points.at(-1).date}</span>}</div>
    </div>;
  }
  return { TrainingDetailTabs, TrainingHistoryChart };
}
