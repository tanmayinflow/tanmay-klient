import {CARRY_FOUNDATIONS} from './catalogCarryAuditView.js';
import {AUDIT_BATCH_FOUNDATIONS} from './catalogAuditBatch.js';
import { exerciseTaxonomy } from './exerciseTaxonomy.js';
import { exerciseEquipment, matchesAvailableEquipment } from './exerciseEquipment.js';
import { HINGE_FOUNDATIONS } from './catalogHingeAuditData.js';

const array = value => Array.isArray(value) ? value : [];
export const normalizeExerciseSearch = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_–—-]+/g, ' ').replace(/\s+/g, ' ').trim();

export function createExerciseFilters() {
  return { q: '', regions: [], movements: [], focus: [], positions: [], supports: [], equipment: [], equipmentMode: 'uses', levels: [], muscles: [], includeSecondary: false, includeArchived: false };
}

// Index derived presentation data without rewriting saved exercises or their IDs.
export function buildExerciseIndex(rows, options = {}) {
  return array(rows).filter(Boolean).map((row, order) => {
    const meta = options.metaOf?.(row) || {};
    const muscles = options.musclesOf?.(row, meta) || { primary: array(row.mp), secondary: array(row.ms) };
    const tax = options.taxonomyOf ? options.taxonomyOf(row,meta) : exerciseTaxonomy({ ...row, mp: muscles.primary, ms: muscles.secondary }, meta);
    const equipment = exerciseEquipment(row, meta);
    const name = options.nameOf?.(row) || row.cz || row.en || row.id || '';
    const names = [name, row.cz, row.en, meta.dcz, meta.den, ...array(tax.aliases)].filter(Boolean).map(normalizeExerciseSearch);
    const search = normalizeExerciseSearch([options.searchTextOf?.(row), row.id, ...names, ...array(row.aliases), ...array(row.taxonomy?.aliases)].filter(Boolean).join(' '));
    const status = options.statusOf?.(row) || row.status || meta.s || 'active';
    const tier = options.tierOf?.(row) || row.tier || meta.t || 'extended';
    return { row, order, landingOrders:options.landingOrderOf?.(row,meta) ?? null, complexTaskOrders:options.complexTaskOrderOf?.(row,meta) ?? null, throwOrder:options.throwOrderOf?.(row,meta) ?? null, breathingOrder:options.breathingOrderOf?.(row,meta) ?? null, positionHoldOrder:options.positionHoldOrderOf?.(row,meta) ?? null, elbowHandOrder:options.elbowHandOrderOf?.(row,meta) ?? null, shoulderOrder:options.shoulderOrderOf?.(row,meta) ?? null, tax, equipment, name, names, search, muscles, level: options.levelOf?.(row) ?? Math.max(Number(row.S) || 1, (Number(row.C) || 1) - 1), archived: ['archived', 'blocked', 'alias', 'merged', 'deprecated'].includes(status) || tier === 'archived' || !!(row.aliasOf || meta.al) };
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
      if(filters.movements.length===1){
        const movement=filters.movements[0],aRank=a.complexTaskOrders?.[movement],bRank=b.complexTaskOrders?.[movement];
        if(['weightlifting','rope_waves'].includes(movement)){const difference=(Number.isInteger(aRank)?aRank:Infinity)-(Number.isInteger(bRank)?bRank:Infinity);if(difference&&!Number.isNaN(difference))return difference;}
      }
      if(filters.movements.length===1&&filters.movements[0]==='throw'){
        const rank=e=>Number.isInteger(e.throwOrder)?e.throwOrder:Infinity;
        const difference=rank(a)-rank(b);if(difference&&!Number.isNaN(difference))return difference;
      }
      if(filters.movements.length===1&&filters.movements[0]==='breath'){
        const rank=e=>Number.isInteger(e.breathingOrder)?e.breathingOrder:Infinity;
        const difference=rank(a)-rank(b);if(difference&&!Number.isNaN(difference))return difference;
      }
      if(filters.movements.length===1&&filters.movements[0]==='position'){
        const rank=e=>Number.isInteger(e.positionHoldOrder)?e.positionHoldOrder:Infinity;
        const difference=rank(a)-rank(b);if(difference&&!Number.isNaN(difference))return difference;
      }
      if(filters.regions.length===1&&['arms','forearms_hands'].includes(filters.regions[0])&&(!filters.movements.length||filters.movements.length===1&&filters.movements[0]==='joint')){
        const rank=e=>Number.isInteger(e.elbowHandOrder)?e.elbowHandOrder:Infinity;
        const difference=rank(a)-rank(b);if(difference&&!Number.isNaN(difference))return difference;
      }
      if(filters.regions.length===1&&['shoulders','chest','neck'].includes(filters.regions[0])&&(!filters.movements.length||filters.movements.length===1&&filters.movements[0]==='joint')){
        const rank=e=>Number.isInteger(e.shoulderOrder)?e.shoulderOrder:Infinity;
        const difference=rank(a)-rank(b);if(difference&&!Number.isNaN(difference))return difference;
      }
      if (filters.movements.length === 1 && filters.movements[0] === 'push_vertical') {
        const foundations=["dbpress","vp26_seated_db_press","an_seateddbpress","machineshoulderpress","ohp","kbpress","pike","vp26_foot_assisted_dip","faq_foot_dip","banddip","dips"];
        const rank=id=>foundations.includes(id)?foundations.indexOf(id):foundations.length;
        const difference=rank(a.row.id)-rank(b.row.id);if(difference)return difference;
      }
      if (filters.movements.length === 1 && filters.movements[0] === 'pull_vertical') {
        const foundations=["latpull","vpul26_foot_assisted_chin","faq_foot_chin","assistpullup","bandpull","pullup","chinup","vpul26_neutral_pullup","ex26_band_pulldown","ex26_onearm_pulldown","ex26_machine_pulldown","negpull","faq_chin_negative"];
        const rank=id=>foundations.includes(id)?foundations.indexOf(id):foundations.length;
        const difference=rank(a.row.id)-rank(b.row.id);if(difference)return difference;
      }
      if(filters.movements.length===1&&filters.movements[0]==='carry'){
        const rank=id=>CARRY_FOUNDATIONS.includes(id)?CARRY_FOUNDATIONS.indexOf(id):CARRY_FOUNDATIONS.length;
        const delta=rank(a.row.id)-rank(b.row.id);if(delta)return delta;
      }
      if (filters.movements.length === 1 && AUDIT_BATCH_FOUNDATIONS[filters.movements[0]]) {
        const foundations=AUDIT_BATCH_FOUNDATIONS[filters.movements[0]];
        const rank=id=>foundations.includes(id)?foundations.indexOf(id):foundations.length;
        const difference=rank(a.row.id)-rank(b.row.id);if(difference)return difference;
      }
      if (filters.movements.length === 1 && filters.movements[0] === 'hinge') {
        const rank = id => HINGE_FOUNDATIONS.includes(id) ? HINGE_FOUNDATIONS.indexOf(id) : HINGE_FOUNDATIONS.length;
        const difference = rank(a.row.id) - rank(b.row.id);
        if (difference) return difference;
      }
      if (filters.movements.length === 1 && filters.movements[0] === 'squat') {
        const foundations = ['sq26_sit_to_stand','sq26_supported','drep','goblet','kb26_goblet_box','legpress'];
        const rank = id => foundations.includes(id) ? foundations.indexOf(id) : foundations.length;
        const difference = rank(a.row.id) - rank(b.row.id);
        if (difference) return difference;
      }
        if (filters.movements.length === 1 && filters.movements[0] === 'lunge') {
          const foundations = ['an_splitsquat','an_revlunge','lunge','latlunge','kb26_goblet_split','ig27_split_squat_hold','bulgsplit'];
          const rank = id => foundations.includes(id) ? foundations.indexOf(id) : foundations.length;
          const difference = rank(a.row.id) - rank(b.row.id);
          if (difference) return difference;
        }
    }
    if (sort !== 'name' && filters.movements.length === 1 && filters.movements[0] === 'step') {
      const foundations = ['stepup','ex26_stepdown','ex26_lateral_stepup','st26_stair_walk','st26_db_supported','st26_db_pair','kb26_rack_stepup','st26_barbell','act_stairs'];
      const rank = id => foundations.includes(id) ? foundations.indexOf(id) : foundations.length;
      const difference = rank(a.row.id) - rank(b.row.id);
      if (difference) return difference;
    }
    return a.name.localeCompare(b.name, options.locale || 'cs', { sensitivity: 'base', numeric: true }) || a.order - b.order;
  });
  // Reorder only the two audited windmill slots after the total ordering.
  // Pair-only comparisons inside sort can create a cycle with a custom name.
  if (sort === 'recommended' && filters.movements.length === 1 && filters.movements[0] === 'hinge') {
    const groups = new Map();
    visible.forEach((entry, slot) => {
      if (!Number.isInteger(entry.complexTaskOrders?.hinge)) return;
      const key = entry.tax.priority + ':' + searchRank(entry, query);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(slot);
    });
    for (const slots of groups.values()) {
      const ordered = slots.map(slot => visible[slot]).sort((a, b) => a.complexTaskOrders.hinge - b.complexTaskOrders.hinge || a.order - b.order);
      slots.forEach((slot, i) => { visible[slot] = ordered[i]; });
    }
  }
  // Only audited slots change; unrelated entries keep the total native order.
  if(sort==='recommended'&&filters.movements.length===1){
    const movement=filters.movements[0],groups=new Map();
    visible.forEach((entry,slot)=>{const rank=entry.landingOrders?.[movement];if(!rank||!Number.isInteger(rank.rank))return;const key=JSON.stringify([rank.group,entry.tax.priority,searchRank(entry,query)]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(slot);});
    for(const slots of groups.values()){const ordered=slots.map(slot=>visible[slot]).sort((a,b)=>a.landingOrders[movement].rank-b.landingOrders[movement].rank||a.order-b.order);slots.forEach((slot,i)=>{visible[slot]=ordered[i];});}
  }
  return { rows: visible.map(entry => entry.row), hiddenCount };
}
