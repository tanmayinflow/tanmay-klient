import React, { useState } from 'react';
import { L } from '../lang/lang.js';
import { FONT_BODY, FONT_TAG } from './type.js';
import { TmIcon } from './icons.jsx';
import { createExerciseFilters } from '../../training/exerciseLibrary.js';
import { exerciseTaxonomy, EXERCISE_REGIONS, EXERCISE_MOVEMENTS, EXERCISE_FOCUS, EXERCISE_POSITIONS, EXERCISE_SUPPORTS } from '../../training/exerciseTaxonomy.js';

const labels = definitions => definitions.map(item => ({ v: item.id, label: L(item.cz, item.en) }));
const fields = () => [
  { key: 'regions', label: L('Oblast těla', 'Body area'), options: labels(EXERCISE_REGIONS) },
  { key: 'movements', label: L('Pohyb', 'Movement'), options: labels(EXERCISE_MOVEMENTS) },
  { key: 'focus', label: L('Zaměření', 'Focus'), options: labels(EXERCISE_FOCUS) },
  { key: 'positions', label: L('Výchozí poloha', 'Starting position'), options: labels(EXERCISE_POSITIONS) },
  { key: 'supports', label: L('Opora', 'Support'), options: labels(EXERCISE_SUPPORTS) },
];
const control = t => ({ fontFamily: FONT_BODY, fontSize: 14, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, background: 'transparent', minHeight: 44, padding: '8px 12px', cursor: 'pointer', maxWidth: '100%' });

// An inline disclosure, not a floating dropdown: remains usable inside drawers
// and cannot be clipped by their scroll containers.
function FacetPanel({ t, field, values, onChange }) {
  return <div role="group" aria-label={field.label} style={{ padding: '10px 0', borderTop: `1px solid ${t.borderSoft}`, borderBottom: `1px solid ${t.borderSoft}`, maxHeight: 260, overflowY: 'auto' }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {field.options.map(option => {
        const selected = values.includes(option.v);
        return <button type="button" key={option.v} aria-pressed={selected} aria-label={`${field.label}: ${option.label}`} onClick={() => onChange(selected ? values.filter(value => value !== option.v) : [...values, option.v])}
          style={{ ...control(t), background: selected ? t.activeNav : 'transparent', borderColor: selected ? t.accent : t.borderSoft, color: selected ? t.heading : t.text, textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{selected && <TmIcon id="check" size={14} />}{option.label}</button>;
      })}
    </div>
    {values.length > 0 && <button type="button" style={{ ...control(t), borderColor: 'transparent', textDecoration: 'underline' }} onClick={() => onChange([])}>{L('Zrušit výběr', 'Clear selection')}</button>}
  </div>;
}

export function ExerciseLibraryFilters({ t, filters, onChange, onClear, extraFilterCount = 0, sort = 'recommended', onSort, count, hiddenCount = 0, equipmentOptions = [], muscleOptions = [], levelOptions = [], allowCustomOrder = false, autoFocus = false }) {
  const [expanded, setExpanded] = useState(null);
  const [more, setMore] = useState(false);
  const value = { ...createExerciseFilters(), ...filters };
  const allFields = [...fields(), { key: 'equipment', label: L('Vybavení', 'Equipment'), options: equipmentOptions }, { key: 'levels', label: L('Nároky provedení', 'Execution demands'), options: levelOptions }, { key: 'muscles', label: L('Konkrétní svaly', 'Specific muscles'), options: muscleOptions }];
  const patch = next => onChange({ ...value, ...next });
  const field = allFields.find(item => item.key === expanded);
  const active = allFields.flatMap(item => (value[item.key] || []).map(id => ({ key: item.key, id, label: item.options.find(option => option.v === id)?.label || id })));
  const any = active.length || extraFilterCount || value.q || value.includeSecondary || value.includeArchived || value.equipmentMode !== 'uses';
  const facetButton = key => {
    const item = allFields.find(choice => choice.key === key);
    const n = value[key]?.length || 0;
    return <button type="button" key={key} aria-expanded={expanded === key} onClick={() => setExpanded(expanded === key ? null : key)} style={{ ...control(t), borderColor: n ? t.accent : t.border, color: n ? t.heading : t.text }}>
      {item.label}{n ? ` · ${n}` : ''}<TmIcon id="expand" size={12} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle', transform: expanded === key ? 'rotate(180deg)' : undefined }} />
    </button>;
  };
  return <section data-exercise-library-filters="" aria-label={L('Hledání v knihovně cviků', 'Find exercises')} style={{ fontFamily: FONT_BODY, marginBottom: 18, minWidth: 0 }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
      <input type="search" data-guide="trenink.library" aria-label={L('Hledat cvik', 'Search exercises')} placeholder={L('Hledat cvik nebo jiný název…', 'Search exercises or alternate names…')} value={value.q} autoFocus={autoFocus} onChange={event => patch({ q: event.target.value })}
        style={{ ...control(t), cursor: 'text', fontSize: 16, flex: '1 1 220px', width: '100%', minWidth: 0 }} />
      {onSort && <select aria-label={L('Řazení cviků', 'Exercise order')} value={sort} onChange={event => onSort(event.target.value)} style={{ ...control(t), fontSize: 16, flex: '0 1 245px', background: t.sheet || t.bg }}>
        <option value="recommended">{L('Základní cviky nejdřív', 'Foundational exercises first')}</option>
        <option value="name">{L('Podle názvu', 'By name')}</option>
        <option value="recent">{L('Nedávno vybírané', 'Recently selected')}</option>
        {allowCustomOrder && <option value="custom">{L('Vlastní pořadí', 'Your own order')}</option>}
      </select>}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
      {['regions', 'movements', 'equipment'].map(facetButton)}
      <button type="button" aria-expanded={more} onClick={() => { setMore(!more); if (more && !['regions', 'movements', 'equipment'].includes(expanded)) setExpanded(null); }} style={{ ...control(t), borderColor: 'transparent', textDecoration: 'underline' }}>{more ? L('Méně filtrů', 'Fewer filters') : L('Další filtry', 'More filters')}</button>
    </div>
    {more && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>{['focus', 'positions', 'supports', 'levels', 'muscles'].map(facetButton)}</div>}
    {field && <div style={{ marginTop: 10 }}>
      <FacetPanel t={t} field={field} values={value[field.key] || []} onChange={next => patch({ [field.key]: next })} />
      {expanded === 'equipment' && <div style={{ padding: '10px 0', color: t.textSec, fontSize: 13, lineHeight: 1.6 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><select aria-label={L('Jak filtrovat vybavení', 'Equipment matching')} value={value.equipmentMode} onChange={event => patch({ equipmentMode: event.target.value })} style={{ ...control(t), background: t.sheet || t.bg }}>
          <option value="uses">{L('Cviky s vybranou pomůckou', 'Uses any selected equipment')}</option>
          <option value="available">{L('Mám k dispozici jen vybrané', 'Only selected equipment available')}</option>
        </select></label>
        <div>{value.equipmentMode === 'available' ? L('Zahrnuje jen cviky, jejichž uvedené pomůcky máš vybrané. Bez výběru zůstanou cviky bez pomůcek. Ověř potřebný prostor a vybavení v popisu.', 'Includes exercises whose listed equipment is selected. With nothing selected, only equipment-free exercises remain. Check the description for space and equipment needs.') : L('Stačí shoda s jednou vybranou pomůckou; cvik může potřebovat i další.', 'Matches any selected item; the exercise may also require other equipment.')}</div>
      </div>}
      {['positions', 'supports'].includes(expanded) && <p style={{ color: t.textMuted, fontSize: 13 }}>{L('Záznamy bez určené polohy nebo opory se do tohoto výběru nezahrnou. Výchozí poloha popisuje začátek; cvik může obsahovat další přechody.', 'Exercises without a classified position or support are excluded. Starting position describes the beginning; the exercise may include further transitions.')}</p>}
    </div>}
    {more && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px', marginTop: 8, color: t.textSec, fontSize: 13 }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, minHeight: 44 }}><input type="checkbox" checked={value.includeSecondary} onChange={event => patch({ includeSecondary: event.target.checked })} />{L('Zahrnout vedlejší zapojení', 'Include secondary involvement')}</label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 7, minHeight: 44 }}><input type="checkbox" checked={value.includeArchived} onChange={event => patch({ includeArchived: event.target.checked })} />{L('Zahrnout archiv a aliasy', 'Include archive and aliases')}</label>
    </div>}
    {active.length > 0 && <div aria-label={L('Použité filtry', 'Active filters')} style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
      {active.map(item => <button type="button" key={`${item.key}:${item.id}`} aria-label={`${L('Odebrat filtr', 'Remove filter')}: ${item.label}`} onClick={() => patch({ [item.key]: value[item.key].filter(id => id !== item.id) })} style={{ ...control(t), fontSize: 12, padding: '5px 9px', borderColor: t.borderSoft, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{item.label}<TmIcon id="close" size={12} /></button>)}
    </div>}
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 8, fontSize: 13, color: t.textMuted }}>
      <span role="status" aria-live="polite">{count} {L('cviků', 'exercises')}</span>
      {hiddenCount > 0 && <button type="button" onClick={() => patch({ includeArchived: true })} style={{ ...control(t), fontSize: 12, borderColor: 'transparent', textDecoration: 'underline' }}>{L(`V archivu odpovídá dalších ${hiddenCount}`, `${hiddenCount} more matches in archive`)}</button>}
      {any ? <button type="button" onClick={() => { onChange(createExerciseFilters()); onClear?.(); setExpanded(null); }} style={{ ...control(t), marginLeft: 'auto', borderColor: 'transparent', textDecoration: 'underline' }}>{L('Vyčistit filtry', 'Clear filters')}</button> : null}
    </div>
    {count === 0 && <div style={{ padding: '14px 0', color: t.textSec, fontSize: 14, lineHeight: 1.6 }}>{L('Této kombinaci neodpovídá žádný cvik. Odeber některý filtr nebo zkus jiný název.', 'No exercise matches this combination. Remove a filter or try another name.')}</div>}
  </section>;
}

export function ExerciseTaxonomySummary({ t, exercise, meta, compact = false }) {
  const taxonomy = exerciseTaxonomy(exercise, meta || {});
  const text = (definitions, ids) => ids.map(id => definitions.find(item => item.id === id)).filter(Boolean).map(item => L(item.cz, item.en)).join(' · ');
  return <span data-exercise-taxonomy="" style={{ display: 'block', fontFamily: compact ? FONT_TAG : FONT_BODY, fontSize: compact ? 12 : 13, lineHeight: 1.5, color: t.textMuted, overflowWrap: 'anywhere' }}>
    {text(EXERCISE_MOVEMENTS, taxonomy.movements)}{!compact && <><br />{text(EXERCISE_REGIONS, taxonomy.regions)}</>}
  </span>;
}

export function ExerciseTaxonomyEditor({ t, exercise, meta, onChange }) {
  const [expanded, setExpanded] = useState(null);
  const taxonomy = exerciseTaxonomy(exercise, meta || {});
  const allFields = fields();
  const field = allFields.find(item => item.key === expanded);
  const patch = next => onChange({ ...(exercise.taxonomy || {}), ...next });
  return <details style={{ margin: '14px 0', borderTop: `1px solid ${t.borderSoft}`, paddingTop: 10, color: t.text, fontFamily: FONT_BODY }}>
    <summary style={{ cursor: 'pointer', minHeight: 44, fontSize: 15 }}>{L('Zařazení a poznámky k auditu', 'Classification and audit notes')}</summary>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{allFields.map(item => <button type="button" key={item.key} aria-expanded={expanded === item.key} onClick={() => setExpanded(expanded === item.key ? null : item.key)} style={control(t)}>{item.label} · {taxonomy[item.key].length}</button>)}</div>
    {field && <FacetPanel t={t} field={field} values={taxonomy[field.key]} onChange={values => patch({ [field.key]: values })} />}
    <label style={{ display: 'block', marginTop: 12, fontSize: 13 }}>{L('Pořadí v knihovně', 'Library priority')}<select aria-label={L('Pořadí v knihovně', 'Library priority')} value={taxonomy.priority} onChange={event => patch({ priority: Number(event.target.value) })} style={{ ...control(t), display: 'block', marginTop: 5, background: t.sheet || t.bg }}>
      <option value={0}>{L('Základní cvik', 'Foundational exercise')}</option><option value={1}>{L('Další varianta', 'Further variation')}</option><option value={2}>{L('Specializovaný cvik', 'Specialist exercise')}</option>
    </select></label>
    <label style={{ display: 'block', marginTop: 12, fontSize: 13 }}>{L('Další názvy pro hledání, oddělené čárkou', 'Alternate search names, comma separated')}<input key={`${exercise.id}:aliases`} defaultValue={(exercise.taxonomy?.aliases || []).join(', ')} onChange={event => patch({ aliases: event.target.value.split(',').map(item => item.trim()).filter(Boolean) })} style={{ ...control(t), display: 'block', boxSizing: 'border-box', width: '100%', fontSize: 16, cursor: 'text', marginTop: 5 }} /></label>
    <label style={{ display: 'block', marginTop: 12, fontSize: 13 }}>{L('Poznámka k auditu cviku', 'Exercise audit note')}<textarea key={`${exercise.id}:note`} defaultValue={exercise.taxonomy?.note || ''} onChange={event => patch({ note: event.target.value })} rows={3} style={{ ...control(t), display: 'block', width: '100%', boxSizing: 'border-box', fontSize: 16, cursor: 'text', marginTop: 5, resize: 'vertical' }} /></label>
    <button type="button" onClick={() => { const own = exercise.taxonomy || {}; onChange({ ...(own.note ? { note: own.note } : {}), ...(own.aliases ? { aliases: own.aliases } : {}) }); }} style={{ ...control(t), borderColor: 'transparent', fontSize: 12, textDecoration: 'underline' }}>{L('Obnovit odvozené zařazení', 'Restore derived classification')}</button>
  </details>;
}
