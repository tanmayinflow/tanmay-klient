import React, { useState, useRef, useEffect, useId } from 'react';
import { L } from '../lang/lang.js';
import { FONT_BODY, FONT_TAG } from './type.js';
import { TmIcon } from './icons.jsx';
import { createExerciseFilters } from '../../training/exerciseLibrary.js';
import { exerciseTaxonomy, EXERCISE_REGIONS, EXERCISE_MOVEMENTS, EXERCISE_MOVEMENT_GROUPS, EXERCISE_FOCUS, EXERCISE_POSITIONS, EXERCISE_SUPPORTS } from '../../training/exerciseTaxonomy.js';
import { EXERCISE_EQUIPMENT, EXERCISE_EQUIPMENT_GROUPS } from '../../training/exerciseEquipment.js';
import { highlightedBodyMuscles, selectBodyRegions, selectBodyMuscles, toggleBodyMuscle } from '../../training/exerciseBodySelection.js';

const labels = definitions => definitions.map(item => ({ v: item.id, label: L(item.cz, item.en), group: item.group }));
const fields = () => [
  { key: 'regions', label: L('Oblast těla', 'Body area'), options: labels(EXERCISE_REGIONS) },
  { key: 'movements', label: L('Pohyb', 'Movement'), options: labels(EXERCISE_MOVEMENTS), groups: labels(EXERCISE_MOVEMENT_GROUPS) },
  { key: 'focus', label: L('Zaměření', 'Focus'), options: labels(EXERCISE_FOCUS) },
  { key: 'positions', label: L('Výchozí poloha', 'Starting position'), options: labels(EXERCISE_POSITIONS) },
  { key: 'supports', label: L('Opora', 'Support'), options: labels(EXERCISE_SUPPORTS) },
];
const control = t => ({ fontFamily: FONT_BODY, fontWeight: 400, fontSize: 14, lineHeight: 1.45, color: t.text, border: `1px solid ${t.border}`, borderRadius: 8, background: 'transparent', minHeight: 44, padding: '8px 12px', cursor: 'pointer', maxWidth: '100%' });

// Inline choices inherit the paper, typography and drawer scrolling. No native
// OS menu or floating layer; a roving radio group supports keyboard selection.
function LibraryChoice({ t, label, value, options, onChange, style, icon }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null), trigger = useRef(null), group = useRef(null);
  const id = useId();
  const selected = options.find(option => option.v === value) || options[0];
  useEffect(() => {
    if (!open) return;
    group.current?.querySelector('[aria-checked="true"]')?.focus();
    const outside = event => { if (!wrap.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <div ref={wrap} data-library-choice="" style={{ minWidth: 0, ...(icon ? { display: 'contents' } : {}), ...style }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} onKeyDown={event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <button type="button" ref={trigger} aria-label={label} aria-describedby={`${id}-value`} aria-expanded={open} aria-controls={`${id}-options`} onClick={() => setOpen(!open)} onKeyDown={event => { if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); setOpen(true); } }}
      title={icon ? `${label}: ${selected.label}` : undefined} style={{ ...control(t), width: icon ? 44 : '100%', display: 'flex', alignItems: 'center', justifyContent: icon ? 'center' : 'space-between', gap: 12, textAlign: 'left', borderColor: open ? t.accent : icon ? 'transparent' : t.border, padding: icon ? 0 : '8px 12px', flexShrink: 0 }}>
      <span id={`${id}-value`} style={icon ? { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' } : undefined}>{selected.label}</span><TmIcon id={icon || 'expand'} size={icon ? 20 : 12} style={{ flexShrink: 0, transform: !icon && open ? 'rotate(180deg)' : undefined }} />
    </button>
    {open && <div id={`${id}-options`} ref={group} role="radiogroup" aria-label={label} style={{ marginTop: 6, padding: '5px 0', borderTop: `1px solid ${t.borderSoft}`, borderBottom: `1px solid ${t.borderSoft}`, ...(icon ? { order: 3, flexBasis: '100%', minWidth: 0 } : {}) }} onKeyDown={event => {
      if (!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...group.current.querySelectorAll('[role="radio"]')];
      const current = buttons.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
      onChange(options[next].v); buttons[next].focus();
    }}>
      {options.map(option => <button type="button" key={option.v} role="radio" aria-checked={option.v === value} tabIndex={option.v === value ? 0 : -1} onClick={() => { onChange(option.v); close(); }}
        style={{ ...control(t), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left', borderColor: 'transparent', background: option.v === value ? t.activeNav : 'transparent', color: option.v === value ? t.heading : t.text }}>
        <span>{option.label}</span>{option.v === value && <TmIcon id="check" size={14} style={{ flexShrink: 0 }} />}
      </button>)}
    </div>}
  </div>;
}

// An inline disclosure, not a floating dropdown: remains usable inside drawers
// and cannot be clipped by their scroll containers.
function FacetPanel({ t, field, values, onChange }) {
  const groups = field.groups || [{ v: null, label: null }];
  return <div role="group" aria-label={field.label} style={{ padding: '12px 0', borderTop: `1px solid ${t.borderSoft}`, borderBottom: `1px solid ${t.borderSoft}`, maxHeight: 300, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${t.border} transparent` }}>
    {groups.map((group, index) => <div key={group.v || 'all'} style={{ marginTop: index ? 20 : 0 }}>
      {group.label && <div style={{ fontFamily: FONT_TAG, fontSize: 14, color: t.textSec, marginBottom: 7 }}>{group.label}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {field.options.filter(option => !group.v || option.group === group.v).map(option => {
        const selected = values.includes(option.v);
        return <button type="button" key={option.v} aria-pressed={selected} aria-label={`${field.label}: ${option.label}`} onClick={() => onChange(selected ? values.filter(value => value !== option.v) : [...values, option.v])}
          style={{ ...control(t), background: selected ? t.activeNav : 'transparent', borderColor: selected ? t.accent : t.borderSoft, color: selected ? t.heading : t.text, textAlign: 'left', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{selected && <TmIcon id="check" size={14} />}{option.label}</button>;
      })}
      </div>
    </div>)}
    {values.length > 0 && <button type="button" style={{ ...control(t), borderColor: 'transparent', textDecoration: 'underline' }} onClick={() => onChange([])}>{L('Zrušit výběr', 'Clear selection')}</button>}
  </div>;
}

export function ExerciseLibraryFilters({ t, filters, onChange, onClear, extraFilterCount = 0, sort = 'recommended', onSort, count, hiddenCount = 0, muscleOptions = [], levelOptions = [], allowCustomOrder = false, autoFocus = false, view = 'grid', onViewChange, renderBodyMap }) {
  const [expanded, setExpanded] = useState(null);
  const [more, setMore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(autoFocus || !!filters?.q);
  const searchRef = useRef(null), searchTrigger = useRef(null);
  const searchId = useId();
  useEffect(() => { if (searchOpen) searchRef.current?.focus({ preventScroll: true }); }, [searchOpen]);
  const value = { ...createExerciseFilters(), ...filters };
  const allFields = [...fields(), { key: 'equipment', label: L('Vybavení', 'Equipment'), options: labels(EXERCISE_EQUIPMENT), groups: labels(EXERCISE_EQUIPMENT_GROUPS) }, { key: 'levels', label: L('Nároky provedení', 'Execution demands'), options: levelOptions }, { key: 'muscles', label: L('Konkrétní svaly', 'Specific muscles'), options: muscleOptions }];
  const patch = next => onChange({ ...value, ...next });
  const field = allFields.find(item => item.key === expanded);
  const active = allFields.flatMap(item => (value[item.key] || []).map(id => ({ key: item.key, id, label: item.options.find(option => option.v === id)?.label || id })));
  const any = active.length || extraFilterCount || value.q || value.includeSecondary || value.includeArchived || value.equipmentMode !== 'uses';
  const facetButton = key => {
    const item = allFields.find(choice => choice.key === key);
    const n = (value[key]?.length || 0) + (key === 'regions' ? value.muscles.length : 0);
    return <button type="button" key={key} aria-expanded={expanded === key} onClick={() => setExpanded(expanded === key ? null : key)} style={{ ...control(t), borderColor: n ? t.accent : t.border, color: n ? t.heading : t.text }}>
      {item.label}{n ? ` · ${n}` : ''}<TmIcon id="expand" size={12} style={{ marginLeft: 8, display: 'inline-block', verticalAlign: 'middle', transform: expanded === key ? 'rotate(180deg)' : undefined }} />
    </button>;
  };
  return <section data-exercise-library-filters="" aria-label={L('Hledání v knihovně cviků', 'Find exercises')} style={{ fontFamily: FONT_BODY, marginBottom: 18, minWidth: 0 }}>
    <div data-library-toolbar="" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
      <button type="button" ref={searchTrigger} data-guide="trenink.library" aria-label={L('Hledat cvik', 'Search exercises')} title={L('Hledat cvik', 'Search exercises')} aria-expanded={searchOpen} aria-controls={searchId} onClick={() => setSearchOpen(!searchOpen)} style={{ ...control(t), width: 44, padding: 0, display: 'grid', placeItems: 'center', borderColor: searchOpen || value.q ? t.accent : 'transparent' }}><TmIcon id="search" size={20} /></button>
      {onSort && <LibraryChoice t={t} icon="sort" label={L('Řazení cviků', 'Exercise order')} value={sort} onChange={onSort} options={[
        { v: 'recommended', label: L('Základní cviky nejdřív', 'Foundational exercises first') },
        { v: 'name', label: L('Podle názvu', 'By name') },
        { v: 'recent', label: L('Nedávno vybírané', 'Recently selected') },
        ...(allowCustomOrder ? [{ v: 'custom', label: L('Vlastní pořadí', 'Your own order') }] : []),
      ]} />}
      {onViewChange && <div role="group" aria-label={L('Zobrazení cviků', 'Exercise view')} style={{ display: 'flex', marginLeft: 'auto', gap: 2 }}>
        {[['grid', 'view-cards', L('Karty cviků', 'Exercise cards')], ['list', 'view-rows', L('Cviky v řádcích', 'Exercise list')]].map(([mode, icon, label]) => <button key={mode} type="button" aria-label={label} title={label} aria-pressed={view === mode} onClick={() => onViewChange(mode)} style={{ ...control(t), width: 44, padding: 0, borderColor: 'transparent', color: view === mode ? t.heading : t.textMuted, background: view === mode ? t.activeNav : 'transparent', display: 'grid', placeItems: 'center' }}><TmIcon id={icon} size={20} /></button>)}
      </div>}
      {searchOpen && <div id={searchId} style={{ display: 'flex', flexBasis: '100%', minWidth: 0, order: 2, gap: 4, marginTop: 4 }}>
        <input ref={searchRef} type="search" aria-label={L('Hledat cvik nebo jiný název', 'Search exercises or alternate names')} placeholder={L('Hledat cvik…', 'Search exercises…')} value={value.q} onChange={event => patch({ q: event.target.value })} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setSearchOpen(false); searchTrigger.current?.focus(); } }} style={{ ...control(t), cursor: 'text', fontSize: 16, flex: 1, width: '100%', minWidth: 0, boxSizing: 'border-box' }} />
        <button type="button" aria-label={L('Zavřít a vyčistit hledání', 'Close and clear search')} onClick={() => { patch({ q: '' }); setSearchOpen(false); searchTrigger.current?.focus(); }} style={{ ...control(t), width: 44, padding: 0, borderColor: 'transparent', display: 'grid', placeItems: 'center' }}><TmIcon id="close" size={18} /></button>
      </div>}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
      {['regions', 'movements', 'equipment'].map(facetButton)}
      <button type="button" aria-expanded={more} onClick={() => { setMore(!more); if (more && !['regions', 'movements', 'equipment'].includes(expanded)) setExpanded(null); }} style={{ ...control(t), borderColor: 'transparent', textDecoration: 'underline' }}>{more ? L('Méně filtrů', 'Fewer filters') : L('Další filtry', 'More filters')}</button>
    </div>
    {more && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>{['focus', 'positions', 'supports', 'levels', 'muscles'].map(facetButton)}</div>}
    {field && <div style={{ marginTop: 10 }}>
      {expanded === 'regions' && renderBodyMap && <div data-body-filter="" style={{ paddingTop: 12, borderTop: `1px solid ${t.borderSoft}` }}>
        <div style={{ width: 'min(100%, 300px)', margin: '0 auto 12px' }}>{renderBodyMap({ fluid: true, selectedMuscles: value.muscles, highlightedMuscles: highlightedBodyMuscles(value), selectedRegions: value.regions, onToggleMuscle: key => onChange(toggleBodyMuscle(value, key)), onToggleRegion: key => onChange(selectBodyRegions(value, value.regions.includes(key) ? value.regions.filter(item => item !== key) : [...value.regions.filter(item => item !== 'whole_body'), key])) })}</div>
        <p style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.5 }}>{L('Vyber oblast podle názvu nebo klepnutím na postavu. Klepnutím na sval výběr zpřesníš; obrysy kolen a chodidel označují celé oblasti.', 'Choose a body area by name or on the figure. Tap a muscle to narrow the selection; knee and foot outlines mark whole areas.')}</p>
      </div>}
      <FacetPanel t={t} field={field} values={value[field.key] || []} onChange={next => onChange(field.key === 'regions' ? selectBodyRegions(value, next) : field.key === 'muscles' ? selectBodyMuscles(value, next) : { ...value, [field.key]: next })} />
      {expanded === 'regions' && <details style={{ marginTop: 8 }}><summary style={{ cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center', fontSize: 13 }}>{L('Svaly podle názvu', 'Muscles by name')}</summary><FacetPanel t={t} field={allFields.find(item => item.key === 'muscles')} values={value.muscles} onChange={next => onChange(selectBodyMuscles(value, next))} /></details>}
      {expanded === 'equipment' && <div style={{ padding: '10px 0', color: t.textSec, fontSize: 13, lineHeight: 1.6 }}>
        <LibraryChoice t={t} label={L('Jak filtrovat vybavení', 'Equipment matching')} value={value.equipmentMode} onChange={equipmentMode => patch({ equipmentMode })} options={[
          { v: 'uses', label: L('Cviky s vybranou pomůckou', 'Uses any selected equipment') },
          { v: 'available', label: L('Mám k dispozici jen vybrané', 'Only selected equipment available') },
        ]} />
        <div style={{ marginTop: 7 }}>{value.equipmentMode === 'available' ? L('Vybrané pomůcky musí stačit na celý cvik. U uvedených alternativ stačí jedna; neurčené vybavení se nezahrnuje. Bez výběru zůstanou cviky bez pomůcek. Ověř také popis a prostor.', 'Selected equipment must cover the whole exercise. One of the listed alternatives is enough; unspecified equipment is excluded. With nothing selected, only equipment-free exercises remain. Also check the description and space.') : L('Stačí shoda s jednou vybranou pomůckou; cvik může potřebovat i další. Zátěž bez určeného typu čeká na upřesnění.', 'Matches any selected item; the exercise may also require other equipment. Unspecified loads still need clarification.')}</div>
      </div>}
      {expanded === 'movements' && <p style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>{L('Od běžných pohybů k cíleným a dynamickým úkolům. Polohy a výdrže označují úkol; výchozí poloha označuje začátek cviku.', 'From everyday movements to targeted and dynamic tasks. Positions and holds describe the task; starting position describes where it begins.')}</p>}
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
      <span role="status" aria-live="polite">{count} {L(count === 1 ? 'cvik' : count >= 2 && count <= 4 ? 'cviky' : 'cviků', count === 1 ? 'exercise' : 'exercises')}</span>
      {hiddenCount > 0 && <button type="button" onClick={() => patch({ includeArchived: true })} style={{ ...control(t), fontSize: 12, borderColor: 'transparent', textDecoration: 'underline' }}>{L(`V archivu odpovídá dalších ${hiddenCount}`, `${hiddenCount} more matches in archive`)}</button>}
      {any ? <button type="button" onClick={() => { onChange(createExerciseFilters()); onClear?.(); setExpanded(null); }} style={{ ...control(t), marginLeft: 'auto', borderColor: 'transparent', textDecoration: 'underline' }}>{L('Vyčistit filtry', 'Clear filters')}</button> : null}
    </div>
    {count === 0 && <div style={{ padding: '14px 0', color: t.textSec, fontSize: 14, lineHeight: 1.6 }}>{L('Této kombinaci neodpovídá žádný cvik. Odeber některý filtr nebo zkus jiný název.', 'No exercise matches this combination. Remove a filter or try another name.')}</div>}
  </section>;
}

export function ExerciseLibraryRowContent({ t, title, focus, illustration }) {
  return <>
    <span data-exercise-round-image="" aria-hidden="true" style={{ display: 'grid', placeItems: 'center', flex: '0 0 64px', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: `1px solid ${t.border}`, background: 'transparent', padding: 6, boxSizing: 'border-box' }}>{illustration}</span>
    <span style={{ display: 'block', minWidth: 0, flex: 1 }}>
      <span title={title} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_BODY, fontSize: 16, lineHeight: 1.5, color: t.heading }}>{title}</span>
      <span title={typeof focus === 'string' ? focus : undefined} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.5, color: t.textMuted }}>{focus || L('Zaměření zatím neurčeno', 'Focus not yet specified')}</span>
    </span>
  </>;
}

export function ExerciseTaxonomySummary({ t, exercise, meta, compact = false, taxonomyOf = exerciseTaxonomy }) {
  const taxonomy = taxonomyOf(exercise, meta || {});
  const text = (definitions, ids) => ids.map(id => definitions.find(item => item.id === id)).filter(Boolean).map(item => L(item.cz, item.en)).join(' · ');
  return <span data-exercise-taxonomy="" style={{ display: 'block', fontFamily: compact ? FONT_TAG : FONT_BODY, fontSize: compact ? 12 : 13, lineHeight: 1.5, color: t.textMuted, overflowWrap: 'anywhere' }}>
    {text(EXERCISE_MOVEMENTS, taxonomy.movements)}{!compact && <><br />{text(EXERCISE_REGIONS, taxonomy.regions)}</>}
  </span>;
}

export function ExerciseTaxonomyEditor({ t, exercise, meta, onChange, taxonomyOf = exerciseTaxonomy }) {
  const [expanded, setExpanded] = useState(null);
  const taxonomy = taxonomyOf(exercise, meta || {});
  const allFields = fields();
  const field = allFields.find(item => item.key === expanded);
  const patch = next => onChange({ ...(exercise.taxonomy || {}), ...next });
  return <details style={{ margin: '14px 0', borderTop: `1px solid ${t.borderSoft}`, paddingTop: 10, color: t.text, fontFamily: FONT_BODY }}>
    <summary style={{ cursor: 'pointer', minHeight: 44, fontSize: 15 }}>{L('Zařazení a poznámky k auditu', 'Classification and audit notes')}</summary>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{allFields.map(item => <button type="button" key={item.key} aria-expanded={expanded === item.key} onClick={() => setExpanded(expanded === item.key ? null : item.key)} style={control(t)}>{item.label} · {taxonomy[item.key].length}</button>)}</div>
    {field && <FacetPanel t={t} field={field} values={taxonomy[field.key]} onChange={values => patch({ [field.key]: values })} />}
    <div style={{ marginTop: 12, fontSize: 13 }}>{L('Pořadí v knihovně', 'Library priority')}<LibraryChoice t={t} label={L('Pořadí v knihovně', 'Library priority')} value={taxonomy.priority} onChange={priority => patch({ priority })} style={{ marginTop: 5 }} options={[
      { v: 0, label: L('Základní cvik', 'Foundational exercise') }, { v: 1, label: L('Další varianta', 'Further variation') }, { v: 2, label: L('Specializovaný cvik', 'Specialist exercise') },
    ]} /></div>
    <label style={{ display: 'block', marginTop: 12, fontSize: 13 }}>{L('Další názvy pro hledání, oddělené čárkou', 'Alternate search names, comma separated')}<input key={`${exercise.id}:aliases`} defaultValue={(exercise.taxonomy?.aliases || []).join(', ')} onChange={event => patch({ aliases: event.target.value.split(',').map(item => item.trim()).filter(Boolean) })} style={{ ...control(t), display: 'block', boxSizing: 'border-box', width: '100%', fontSize: 16, cursor: 'text', marginTop: 5 }} /></label>
    <label style={{ display: 'block', marginTop: 12, fontSize: 13 }}>{L('Poznámka k auditu cviku', 'Exercise audit note')}<textarea key={`${exercise.id}:note`} defaultValue={exercise.taxonomy?.note || ''} onChange={event => patch({ note: event.target.value })} rows={3} style={{ ...control(t), display: 'block', width: '100%', boxSizing: 'border-box', fontSize: 16, cursor: 'text', marginTop: 5, resize: 'vertical' }} /></label>
    <button type="button" onClick={() => { const own = exercise.taxonomy || {}; onChange({ ...(own.note ? { note: own.note } : {}), ...(own.aliases ? { aliases: own.aliases } : {}) }); }} style={{ ...control(t), borderColor: 'transparent', fontSize: 12, textDecoration: 'underline' }}>{L('Obnovit odvozené zařazení', 'Restore derived classification')}</button>
  </details>;
}
