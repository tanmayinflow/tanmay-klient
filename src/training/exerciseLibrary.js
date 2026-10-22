import { exerciseTaxonomy } from './exerciseTaxonomy.js';
import { exerciseEquipment, matchesAvailableEquipment } from './exerciseEquipment.js';

const array = value => Array.isArray(value) ? value : [];
export const normalizeExerciseSearch = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_–—-]+/g, ' ').replace(/\s+/g, ' ').trim();

export function createExerciseFilters() {
  return { q: '', regions: [], movements: [], focus: [], positions: [], supports: [], equipment: [], equipmentMode: 'uses', levels: [], muscles: [], includeSecondary: false, includeArchived: false };
}

// Index derived presentation data without rewriting saved exercises or their IDs.
export function buildExerciseIndex(rows, options = {}) {
  return array(rows).filter(Boolean).map((row, order) => {
    const meta = options.metaOf?.(row) || {};
    const muscles = options.musclesOf?.(row) || { primary: array(row.mp), secondary: array(row.ms) };
    const tax = exerciseTaxonomy({ ...row, mp: muscles.primary, ms: muscles.secondary }, meta);
    const equipment = exerciseEquipment(row, meta);
    const name = options.nameOf?.(row) || row.cz || row.en || row.id || '';
    const names = [name, row.cz, row.en, meta.dcz, meta.den, ...array(tax.aliases)].filter(Boolean).map(normalizeExerciseSearch);
    const search = normalizeExerciseSearch([options.searchTextOf?.(row), row.id, ...names, ...array(row.aliases), ...array(row.taxonomy?.aliases)].filter(Boolean).join(' '));
    const status = options.statusOf?.(row) || row.status || meta.s || 'active';
    const tier = options.tierOf?.(row) || row.tier || meta.t || 'extended';
    return { row, order, tax, equipment, name, names, search, muscles, level: options.levelOf?.(row) ?? Math.max(Number(row.S) || 1, (Number(row.C) || 1) - 1), archived: ['archived', 'blocked', 'alias', 'merged', 'deprecated'].includes(status) || tier === 'archived' || !!(row.aliasOf || meta.al) };
  });
}

const overlaps = (wanted, values) => !array(wanted).length || wanted.some(value => array(values).includes(value));
function matches(entry, filters) {
  const { tax, muscles } = entry;
  const regions = filters.includeSecondary ? [...tax.regions, ...tax.secondaryRegions] : tax.regions;
  if (!overlaps(filters.regions, regions) || !overlaps(filters.movements, tax.movements) || !overlaps(filters.focus, tax.focus) || !overlaps(filters.positions, tax.positions) || !overlaps(filters.supports, tax.supports) || !overlaps(filters.levels, [entry.level])) return false;
  if (!overlaps(filters.muscles, filters.includeSecondary ? [...array(muscles.primary), ...array(muscles.secondary)] : muscles.primary)) return false;
  if (filters.equipmentMode === 'available') {
    if (!matchesAvailableEquipment(entry.equipment, filters.equipment)) return false;
  } else if (!overlaps(filters.equipment, entry.equipment.items)) return false;
  const words = normalizeExerciseSearch(filters.q).split(' ').filter(Boolean);
  return words.every(word => entry.search.includes(word));
}

function searchRank(entry, query) {
  if (!query) return 0;
  if (entry.names.includes(query) || normalizeExerciseSearch(entry.row.id) === query) return 0;
  if (entry.names.some(name => name.startsWith(query))) return 1;
  if (entry.names.some(name => name.includes(query))) return 2;
  return 3;
}

export function selectExerciseLibrary(index, value = {}, options = {}) {
  const filters = { ...createExerciseFilters(), ...value };
  const candidates = index.filter(entry => matches(entry, filters));
  const hiddenCount = filters.includeArchived ? 0 : candidates.filter(entry => entry.archived).length;
  const visible = candidates.filter(entry => filters.includeArchived || !entry.archived);
  const recent = new Map(array(options.recentIds).map((id, i) => [id, i]));
  const query = normalizeExerciseSearch(filters.q);
  const sort = options.sort || 'recommended';
  visible.sort((a, b) => {
    if (sort === 'custom' || sort === 'vlastni') return a.order - b.order;
    const relevance = searchRank(a, query) - searchRank(b, query);
    if (relevance) return relevance;
    if (sort === 'recent') {
      const delta = (recent.get(a.row.id) ?? Infinity) - (recent.get(b.row.id) ?? Infinity);
      if (delta && !Number.isNaN(delta)) return delta;
    }
    if (sort !== 'name') {
      const priority = a.tax.priority - b.tax.priority;
      if (priority) return priority;
      if (filters.movements.length === 1 && filters.movements[0] === 'squat') {
        const foundations = ['sq26_sit_to_stand','sq26_supported','drep','goblet','kb26_goblet_box','legpress'];
        const rank = id => foundations.includes(id) ? foundations.indexOf(id) : foundations.length;
        const difference = rank(a.row.id) - rank(b.row.id);
        if (difference) return difference;
      }
    }
    return a.name.localeCompare(b.name, options.locale || 'cs', { sensitivity: 'base', numeric: true }) || a.order - b.order;
  });
  return { rows: visible.map(entry => entry.row), hiddenCount };
}
