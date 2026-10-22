// A read-only browsing projection. Never changes legacy pat, identity, catalogue
// records or generator rules. Editorial priority is not a health/efficacy score.
import { familyOf, searchAliasesOf, legacyNamesOf } from './catalog.js';
import { resolveMuscleMap } from './muscleMap.js';

const vocabulary = rows => Object.freeze(rows.map(([id, cz, en, group]) => Object.freeze({ id, cz, en, ...(group ? { group } : {}) })));
export const EXERCISE_REGIONS = vocabulary([
  ['neck','Krk','Neck'], ['shoulders','Ramena a lopatky','Shoulders and shoulder blades'],
  ['chest','Hrudník','Chest'], ['back','Záda','Back'], ['trunk','Břicho a trup','Abdomen and trunk'],
  ['arms','Paže','Upper arms'], ['forearms_hands','Předloktí a ruce','Forearms and hands'],
  ['hips','Kyčle a hýždě','Hips and buttocks'], ['thighs','Stehna','Thighs'],
  ['knees','Kolena','Knees'], ['lower_legs','Bérce a kotníky','Lower legs and ankles'],
  ['feet','Chodidla','Feet'], ['whole_body','Celé tělo','Whole body'], ['unknown','Zatím nezařazeno','Not yet classified'],
]);
// Editorial navigation order for everyday coaching, not an efficacy ranking.
export const EXERCISE_MOVEMENT_GROUPS = vocabulary([
  ['legs','Nohy a přesuny','Legs and locomotion'], ['push_pull','Tlaky a tahy','Pushes and pulls'],
  ['control','Rovnováha a trup','Balance and trunk'], ['targeted','Cílené pohyby a polohy','Targeted movements and positions'],
  ['dynamic','Odrazy, dopady a hody','Jumps, landings and throws'], ['unclassified','K doplnění','To be classified'],
]);
export const EXERCISE_MOVEMENTS = vocabulary([
  ['squat','Dřepy a vstávání','Squats and sit-to-stand','legs'],
  ['hinge','Předklon v kyčlích','Hip hinge','legs'],
  ['lunge','Výpady a dělený postoj','Lunges and split stance','legs'],
  ['step','Výstupy a sestupy','Step-ups and step-downs','legs'],
  ['locomotion','Chůze, běh a přesuny','Walking, running and locomotion','legs'],
  ['carry','Nošení zátěže','Loaded carries','legs'],
  ['push_horizontal','Tlaky před sebe a kliky','Horizontal presses and push-ups','push_pull'],
  ['pull_horizontal','Přítahy k tělu','Rows and horizontal pulls','push_pull'],
  ['push_vertical','Tlaky nad hlavu a dipy','Overhead presses and dips','push_pull'],
  ['pull_vertical','Shyby a stahování','Pull-ups and pulldowns','push_pull'],
  ['balance','Rovnovážné úkoly','Balance tasks','control'],
  ['trunk_stability','Stabilizace trupu','Trunk stabilization','control'],
  ['trunk_movement','Pohyby a rotace trupu','Trunk movements and rotation','control'],
  ['hip_extension','Mosty a zvedání pánve','Bridges and hip thrusts','targeted'],
  ['joint','Cílené pohyby kloubů','Targeted joint movements','targeted'],
  ['position','Polohy a výdrže','Positions and holds','targeted'],
  ['breath','Dechová cvičení','Breathing exercises','targeted'],
  ['landing','Dopady a brzdění','Landings and deceleration','dynamic'],
  ['jump','Skoky a odrazy','Jumps and hops','dynamic'], ['throw','Hody','Throws','dynamic'],
  ['other','Další / zatím nezařazeno','Other / not yet classified','unclassified'],
]);
export const EXERCISE_FOCUS = vocabulary([
  ['strength','Síla','Strength'], ['mobility','Rozsah pohybu','Range of motion'], ['balance','Rovnováha','Balance'],
  ['coordination','Koordinace a dovednosti','Coordination and skills'], ['power','Výbušnost','Power'],
  ['conditioning','Kondice','Conditioning'], ['breath','Dech','Breathing'], ['recovery','Uvolnění','Relaxation'],
  ['other','Zatím neurčeno','Not yet specified'],
]);
export const EXERCISE_POSITIONS = vocabulary([
  ['standing','Ve stoji','Standing'], ['seated','Vsedě','Seated'], ['supine','Vleže na zádech','Supine'],
  ['prone','Vleže na břiše','Prone'], ['side_lying','Vleže na boku','Side lying'], ['kneeling','Vkleče','Kneeling'],
  ['quadruped','Na čtyřech','On all fours'], ['hanging','Ve visu','Hanging'], ['inverted','Hlavou dolů','Inverted'],
  ['other','Další poloha','Other position'],
]);
export const EXERCISE_SUPPORTS = vocabulary([
  ['wall','Opora o zeď','Wall support'], ['chair_bench','Židle, lavice nebo schod','Chair, bench or step support'],
  ['hand_support','Opora rukou','Hand support'], ['assisted','S dopomocí','Assisted'], ['unsupported','Bez přídavné opory','No additional support'],
]);

const arr = value => Array.isArray(value) ? value : [];
const unique = values => [...new Set(values.filter(value => typeof value === 'string' && value))];
const clean = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const regionByMuscle = {
  neck:'neck', sho:'shoulders', rcuff:'shoulders', serr:'shoulders', che:'chest',
  upb:'back', lat:'back', tra:'back', low:'back', abs:'trunk', obl:'trunk', bic:'arms', tri:'arms',
  fore:'forearms_hands', glu:'hips', hipflex:'hips', qua:'thighs', ham:'thighs', add:'thighs', cal:'lower_legs', tib:'lower_legs',
};

// These are inspected identities whose legacy families are too broad or wrong.
const movementById = {};
const register = (ids, movements) => ids.split(' ').forEach(id => { movementById[id] = movements; });
register('lunge revlunge reverselunge bulgsplit an_splitsquat sidelunge latlunge atgsplit an_revlunge an_walklunge cossack archersq', ['lunge']);
register('stepup', ['step']);
register('jumpsquat boxjump broadjump tuckjump', ['jump','landing']);
register('calfraise tibraise ecccalf seatedcalf nordic revnordic sissy sissysquat legcurl legext', ['joint']);
register('deadbug birddog plank sideplank hollow pallof', ['trunk_stability']);
register('jefferson cat superman', ['trunk_movement']);
register('legraise kneeraise t2b', ['joint','trunk_stability']);
register('slbalance', ['balance']);
register('hang activehang towelhang', ['position']);
register('scap scapush', ['joint']);
register('wallhs handstand onearmhs crow', ['balance','position']);
register('bearcrawl highknees zone2', ['locomotion']);
register('burpee', ['push_horizontal','jump','landing']);
register('jacks', ['jump','landing']);
register('donkeykick clamshell extrot pullapart revfly faq_scap_row', ['joint']);
register('crunch situp bicycle russtwist woodchop wipers', ['trunk_movement']);
register('mtclimb flutter hlr vup', ['joint','trunk_stability']);
register('abwheel faq_plank_walkout vi_hss3m vi_hss6m', ['trunk_stability']);
register('ringsupport lsit vsit hold90 support tuckl archhold straddlesit', ['position']);
register('pullthrough', ['hinge']);
register('latiso pullover faq_chin_negative', ['pull_vertical']);
register('faq_dip_negative', ['push_vertical']);
register('faq_deficit_push', ['push_horizontal']);
register('faq_onearm_row', ['pull_horizontal']);
// Inspected setup/execution: legacy squat_unilateral also contains bounds,
// split stretches and a step-down. Preserve the source family, correct browsing.
register('skater', ['jump','landing']);
register('jumplunge', ['lunge','jump','landing']);
register('vi_lunge', ['lunge']);
register('ex26_stepdown', ['step']);
register('frontsplit middlesplit', ['position']);
register('lizard', ['lunge','position']);
register('ex26_squat_row', ['squat','pull_horizontal']);
register('faq_hinge_squat', ['hinge','squat']);

const postureById = {
  drep:['standing'], goblet:['standing'], lunge:['standing'], bulgsplit:['standing'], stepup:['standing'], calfraise:['standing'],
  deadbug:['supine'], glutebridge:['supine'], slbridge:['supine'], hollow:['supine'], birddog:['quadruped'],
  wallpush:['standing'], wallsit:['standing'], slbalance:['standing'], hang:['hanging'], activehang:['hanging'], towelhang:['hanging'],
  wallhs:['inverted'], handstand:['inverted'], onearmhs:['inverted'], nordic:['kneeling'], revnordic:['kneeling'],
};

// Starting position only: pos is the setup field. Do not search later clauses,
// execution, cautions, names or context for positions reached during movement.
function positionFromStart(value) {
  let start = clean(value).trim();
  start = start.replace(/^(?:zacni|zacnete|zaciname)\s+/, '').replace(/^start\s+(?:in\s+|by\s+)?/, '');
  if (/^(?:(?:volny )?(?:stoj|stuj) na (?:rukou|hlave)|(?:a )?(?:free )?(?:handstand|headstand)|stand(?:ing)? on (?:your )?(?:hands|head))\b/.test(start)) return ['inverted'];
  if (/^(?:vzpor klecmo|podpor klecmo|klek na ctyrech|na ctyrech|all fours|on all fours|quadruped)\b/.test(start)) return ['quadruped'];
  if (/^(?:stoj nebo sed|standing or seated)\b/.test(start)) return ['standing','seated'];
  if (/^(?:sed nebo stoj|seated or standing)\b/.test(start)) return ['seated','standing'];
  if (/^(?:stoj nebo klek|standing or kneeling)\b/.test(start)) return ['standing','kneeling'];
  if (/^(?:(?:leh|lehni(?: si)?|v lehu|vleze) na (?:zadech|zada)|(?:lie|lying)(?: down)?(?: flat)? on (?:your |the )?back|on your back|(?:(?:lie|lying) )?supine)\b/.test(start)) return ['supine'];
  if (/^(?:(?:leh|lehni(?: si)?|v lehu|vleze) na (?:brise|bricho)|(?:lie|lying)(?: down)? on (?:your |the )?(?:stomach|front)|(?:lie |lying )?face[ -]down|(?:(?:lie|lying) )?prone)\b/.test(start)) return ['prone'];
  if (/^(?:(?:leh|lehni(?: si)?|v lehu|vleze) na (?:boku|bok)|(?:lie|lying)(?: down)? on (?:your |the )?side|side[ -]lying)\b/.test(start)) return ['side_lying'];
  if (/^(?:klek|klekni(?: si)?|poklekni|vklece|v kleku|half[ -]kneel(?:ing)?|tall[ -]kneel(?:ing)?|kneel(?:ing)?)\b/.test(start)) return ['kneeling'];
  if (/^(?:sed|sedni(?: si)?|vsede|v sedu|sit(?:ting)?(?![ -]ups?\b)|seated)\b/.test(start)) return ['seated'];
  if (/^(?:vis|ve visu|zaves se|dead hang|overhand hang|underhand hang|hanging|hang (?:from|on))\b/.test(start)) return ['hanging'];
  if (/^(?:stoj|stuj|ve stoji|siroky stoj|postav se|postavte se|stoupni(?: si)?|stand(?:ing)?|wide stance|hip[ -]width stance)\b/.test(start)) return ['standing'];
  return [];
}

function startingPositions(row) {
  const localized = (Array.isArray(row.pos) ? row.pos : [row.pos]).filter(value => typeof value === 'string');
  const parsed = localized.map(positionFromStart).filter(values => values.length);
  // Conflicting translations require review instead of an arbitrary choice.
  if (parsed.length > 1 && parsed.some(values => values.slice().sort().join() !== parsed[0].slice().sort().join())) return [];
  return parsed[0] || [...(postureById[row.id] || [])];
}
const supportById = {
  wallpush:['wall','hand_support'], wallsit:['wall'], wallhs:['wall','hand_support'],
  inclpush:['hand_support'], stepup:['chair_bench'], bulgsplit:['chair_bench'],
};
// A deliberately small editorial starting shelf. No inference from pop, the
// author's source, or the athlete's declared level; variants stay discoverable.
const basicIds = new Set('drep goblet lunge an_revlunge latlunge an_splitsquat stepup hinge dbrdl glutebridge legpress seatedlegcurl wallpush inclpush kneepush pushup machinechestpress dbpress machineshoulderpress dbrow bodyrow ringrow cablerow chestsupprow latpull assistpullup calfraise suitcase deadbug birddog plank sideplank pallof anklemob hip9090 couch cat thoracicext shouldercars hipcars wrists wristcars slbalance act_walk act_bike extrot kb26_deadlift'.split(' '));

function movementOf(row, family, role) {
  if (movementById[row.id]) return movementById[row.id];
  const f = clean(family);
  if (/^(throw)(_|$)/.test(f)) return ['throw'];
  if (/^(jump|ankle_hop)(_|$)/.test(f)) return ['jump','landing'];
  if (/^(landing|deceleration)(_|$)/.test(f)) return ['landing'];
  if (/^(lunge|split_squat|cossack)(_|$)/.test(f)) return ['lunge'];
  if (/^(step_up|step_down|stairs)(_|$)/.test(f)) return ['step'];
  if (/^(hip_extension_isolation|calf|knee_|elbow_|hip_abduction|hip_adduction|hip_flexion|active_hip_|hip_internal_rotation|hip_rotation|ankle_|foot_|hand_|forearm_|neck|wrist|shoulder_|prone_shoulder_control|scapular_|stretch_|mobility_|active_hamstring)/.test(f)) return ['joint'];
  if (/^(curl_biceps|triceps_ext|chest_fly|lateral_raise|front_raise|rear_delt|shrug|scap_raise|sissy)(_|$)/.test(f)) return ['joint'];
  if (/^(hinge|kettlebell_swing)(_|$)/.test(f)) return ['hinge'];
  if (/^(hip_extension|bridge)(_|$)/.test(f)) return ['hip_extension'];
  if (/^(squat_press|squat_to_press)$/.test(f)) return ['squat','push_vertical'];
  if (/^(squat|leg_press)(_|$)/.test(f)) return ['squat'];
  if (/^(press_horizontal|push_horizontal|horizontal_push|push_incline)(_|$)/.test(f)) return ['push_horizontal'];
  if (/^(press_vertical|push_vertical|press_dip|dip|handstand_press)(_|$)/.test(f)) return ['push_vertical'];
  if (/^(pull_horizontal|row_wide_elbows|landmine_row|face_pull)(_|$)/.test(f)) return ['pull_horizontal'];
  if (/^(pull_vertical|kipping_pull|pull_straightarm|pullover)(_|$)/.test(f)) return ['pull_vertical'];
  if (/^(core_anti|core_plank|core_lateral_stability|core_posterior_hold|hanging_core_isometric|plank_)/.test(f)) return ['trunk_stability'];
  if (/^(core_flexion|core_rotation|core_lateral|core_seated_flexion|spinal_control)(_|$)/.test(f)) return ['trunk_movement'];
  if (/^(core_leg_|core_compression|core_pike)/.test(f)) return ['joint','trunk_stability'];
  if (/^(loaded_carry|grip_carry)(_|$)/.test(f)) return ['carry'];
  if (/^(walk|run|crawl|climb|cycle|swim|row_erg|elliptical|sled|seated_locomotion|change_direction|floor_transfer|get_up|kb_getup)(_|$)/.test(f)) return ['locomotion'];
  if (/^(balance|handstand_balance|inversion_balance)(_|$)/.test(f)) return ['balance','position'];
  if (/^(hang|inversion_head|straightarm_lever|straightarm_planche|posterior_support|seated_support)(_|$)/.test(f)) return ['position'];
  if (f === 'breathing' || role === 'breath' || row.pat === 'dech') return ['breath'];
  // Recognise explicit movement names only. Never scan prose containing a
  // regression, warning or alternative and treat it as the performed exercise.
  const name = clean([row.cz,row.en].filter(Boolean).join(' '));
  if (/\b(calf raise|heel raise|tibialis raise|leg curl|leg extension|hip abduction|hip adduction)\b|\b(vypon|predkopavani|zakopavani|unozovani|prinozovani)\b/.test(name)) return ['joint'];
  if (/\b(step.up|step.down)\b|\bvystup na\b|\bsestup ze\b/.test(name)) return ['step'];
  if (/\b(lunge|split squat|vypad)\b/.test(name)) return ['lunge'];
  if (/\b(jump|hop|skok|vyskok)\b/.test(name)) return ['jump','landing'];
  if (/\b(deadlift|romanian deadlift|mrtvy tah)\b/.test(name)) return ['hinge'];
  if (/\b(squat|drep)\b/.test(name)) return ['squat'];
  if (row.pat === 'mobilita' || row.pat === 'krk') return ['joint'];
  if (row.jg || row.pat === 'obrat') return ['position'];
  // pat=drep/ohyb/tlak/tah/stred/prenos are deliberately NOT enough: the
  // legacy buckets contain unrelated isolation work, holds and skills.
  return ['other'];
}

const vocabularies = { regions:EXERCISE_REGIONS, secondaryRegions:EXERCISE_REGIONS, movements:EXERCISE_MOVEMENTS,
  focus:EXERCISE_FOCUS, positions:EXERCISE_POSITIONS, supports:EXERCISE_SUPPORTS };

/** Pure projection. row.taxonomy > meta.taxonomy > reviewed mapping.
 * Empty explicit arrays mean intentionally unspecified. Unknown vocabulary IDs
 * are discarded. requiredEquipment ALWAYS reflects row.eq, including unknown
 * equipment keys and their order; taxonomy cannot silently remove a requirement.
 */
export function exerciseTaxonomy(input, inputMeta = {}) {
  const row = input || {}, meta = inputMeta || {};
  const role = row.goalRole || meta.goalRole || meta.r || '';
  const tier = row.tier || meta.tier || meta.t || '';
  const family = familyOf(row, { ...meta, f: meta.family || meta.f });
  const anatomy = resolveMuscleMap(row);
  const regions = unique(anatomy.primary.map(k => regionByMuscle[k]));
  const secondaryRegions = unique(anatomy.secondary.map(k => regionByMuscle[k])).filter(k => !regions.includes(k));
  // Joint-area navigation supplements the muscle map only when the family
  // explicitly identifies that joint. It does not claim a muscle acts there.
  if (/^knee_/.test(family)) regions.push('knees');
  if (/^(ankle_|stretch_calves)/.test(family)) regions.push('lower_legs');
  if (/^(foot_|ankle_foot)/.test(family)) regions.push('feet');
  const movements = movementOf(row, family, role);
  const focus = [];
  if (['strength','hypertrophy','strength_skill'].includes(role)) focus.push('strength');
  if (role === 'mobility' || row.pat === 'mobilita') focus.push('mobility');
  if (role === 'conditioning') focus.push('conditioning');
  if (role === 'power') focus.push('power');
  if (role === 'coordination_skill' || ['coordination','mixed'].includes(row.skillClass || meta.skillClass || meta.sk)) focus.push('coordination');
  if (movements.includes('balance')) focus.push('balance');
  if (movements.includes('breath')) focus.push('breath');
  const positions = startingPositions(row);
  const derived = { regions: unique(regions).length ? unique(regions) : ['unknown'], secondaryRegions,
    movements, focus:unique(focus).length ? unique(focus) : ['other'], positions, supports:[...(supportById[row.id] || [])] };
  const override = { ...(meta.taxonomy || {}), ...(row.taxonomy || {}) };
  for (const [key, vocabulary] of Object.entries(vocabularies)) {
    if (Array.isArray(override[key])) derived[key] = unique(override[key]).filter(id => vocabulary.some(x => x.id === id));
    else derived[key] = [...derived[key]];
  }
  derived.secondaryRegions = derived.secondaryRegions.filter(id => !derived.regions.includes(id));
  const status = row.status || meta.status || meta.s;
  const specialist = ['specialist','program_only','catalog','archived'].includes(tier) || ['blocked','alias'].includes(status);
  const priority = [0,1,2].includes(override.priority) ? override.priority : specialist ? 2 : basicIds.has(row.id) ? 0 : 1;
  return { ...derived, requiredEquipment:[...arr(row.eq)], priority,
    aliases:unique([...searchAliasesOf(row,meta), ...legacyNamesOf(row,meta), ...arr(meta.aka), ...arr(meta.aliases), ...arr(row.aliases), ...arr(override.aliases)]) };
}
