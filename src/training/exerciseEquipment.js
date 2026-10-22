// Browsing-only refinement. Source eq, identity, generator rules and animations
// are never rewritten. A recorded generic load is not proof of a dumbbell.
const vocabulary = rows => Object.freeze(rows.map(([id, cz, en, group]) => Object.freeze({ id, cz, en, ...(group ? { group } : {}) })));
export const EXERCISE_EQUIPMENT_GROUPS = vocabulary([
  ['body','Tělo a prostor','Body and space'], ['free_weights','Volná zátěž','Free weights'],
  ['resistance','Odpor a stroje','Resistance and machines'], ['supports','Opory a závěsy','Supports and suspension'],
  ['accessories','Další pomůcky','Other equipment'], ['unspecified','K upřesnění','Needs clarification'],
]);
export const EXERCISE_EQUIPMENT = vocabulary([
  ['telo','Vlastní tělo','Body weight','body'], ['prostor','Volný prostor','Clear space','body'],
  ['kettlebell','Kettlebell','Kettlebell','free_weights'], ['dumbbell','Jednoručky','Dumbbells','free_weights'],
  ['kettlebell_pair','Pár kettlebellů','Pair of kettlebells','free_weights'], ['dumbbell_pair','Pár jednoruček','Pair of dumbbells','free_weights'],
  ['cinka','Velká činka','Barbell','free_weights'], ['ez_bar','EZ osa','EZ bar','free_weights'],
  ['trap_bar','Trap osa','Trap bar','free_weights'], ['plate','Kotouč','Weight plate','free_weights'],
  ['weight_vest','Zátěžová vesta','Weight vest','free_weights'],
  ['sandbag','Zátěžový vak','Sandbag','free_weights'],
  ['guma','Odporová guma','Resistance band','resistance'], ['kladka','Kladka','Cable pulley','resistance'],
  ['stroj','Stroj','Machine','resistance'], ['stair_machine','Schodový trenažér','Stair machine','resistance'], ['zed','Zeď','Wall','supports'],
  ['smith_machine','Smithův stroj','Smith machine','resistance'], ['back_extension_bench','Extenční lavice','Back-extension bench','supports'],
  ['cable_rope','Lanový adaptér kladky','Cable rope attachment','accessories'],
  ['lifting_blocks','Bloky pod činku','Lifting blocks','supports'], ['lifting_platform','Platforma pro tah z deficitu','Deficit lifting platform','supports'],
  ['sliders','Kluzáky','Sliders','accessories'], ['towel','Ručník','Towel','accessories'], ['sliding_surface','Vhodný kluzný povrch','Suitable sliding surface','body'],
  ['chair','Pevná židle','Stable chair','supports'], ['lavice','Lavice nebo bedna','Bench or box','supports'], ['step_platform','Cvičební stupínek','Exercise step','supports'], ['bradla','Bradla','Parallel bars','supports'],
  ['fixed_support','Pevná opora rukou','Fixed hand support','supports'], ['squat_rack','Stojan s bezpečnostními dorazy','Rack with safety stops','supports'],
  ['fixed_anchor','Pevná kotva gumy','Fixed band anchor','supports'], ['heel_wedge','Pevný klín pod paty','Firm heel wedge','accessories'], ['knee_pad','Podložka pod koleno','Knee pad','accessories'],
  ['hrazda','Hrazda','Pull-up bar','supports'], ['kruhy','Kruhy','Rings','supports'],
  ['zaves','Závěsný systém','Suspension trainer','supports'], ['schody','Schody','Stairs','supports'],
  ['rebound_wall','Stěna určená pro odhody','Wall suitable for throws','supports'],
  ['partner','Připravený partner','Ready partner','supports'], ['rope_anchor','Kotva bojového lana','Battle-rope anchor','supports'],
  ['tyc','Tyč','Pole or stick','accessories'], ['valec','Válec','Roller','accessories'],
  ['fitball','Velký míč','Exercise ball','accessories'], ['medicinbal','Medicinbal','Medicine ball','accessories'],
  ['svihadlo','Švihadlo','Skipping rope','accessories'], ['lano','Lano','Rope','accessories'],
  ['prekazka','Překážka','Hurdle','accessories'], ['ab_wheel','Posilovací kolečko','Ab wheel','accessories'],
  ['zavazi','Zátěž bez určeného typu','Unspecified load','unspecified'],
  ['unknown_equipment','Vybavení neurčeno','Equipment unspecified','unspecified'],
]);

const array = value => Array.isArray(value) ? value : [];
const unique = values => [...new Set(values)];
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const knownIds = new Set(EXERCISE_EQUIPMENT.map(item => item.id));
const unresolvedId = id => !knownIds.has(id) || ['zavazi','unknown_equipment'].includes(id);
const typePatterns = [
  ['kettlebell', /\bkettlebell[a-z]*\b/],
  ['dumbbell', /\bdumbbells?\b|\bjednoruck[a-z]*\b/],
  ['trap_bar', /\btrap[ -](?:bar|tyc|osa|osou)\b/],
  ['ez_bar', /\bez[ -](?:bar|osa|osou|osu)\b/],
  ['cinka', /\bbarbells?\b|\bvelk(?:a|ou|e|y) cink[a-z]*\b/],
  ['plate', /\b(?:weight )?plates?\b|\bkotouc[a-z]*\b/],
  ['weight_vest', /\b(?:weighted? )?vest\b|\b(?:zatezov[a-z]* )?vest[a-z]*\b/],
  ['ab_wheel', /\bab[ -]wheel\b|\b(?:posilovaci )?koleck[a-z]*\b/],
  ['medicinbal', /\bmedicine[ -]ball\b|\bmedicinbal[a-z]*\b/],
  ['sandbag', /\bsandbag\b|\b(?:treninkovy|zatezovy) vak\b/],
];
function typesIn(text) {
  const value = normalize(text);
  const ids = typePatterns.filter(([, pattern]) => pattern.test(value)).map(([id]) => id);
  // An EZ/trap bar is the explicit type, not an additional straight bar.
  return ids.filter(id => id !== 'cinka' || (!ids.includes('ez_bar') && !ids.includes('trap_bar')));
}
function directlyConnectedAlternatives(text, ids) {
  const value = normalize(text);
  const mentions = typePatterns.filter(([id]) => ids.includes(id)).flatMap(([id,pattern]) =>
    [...value.matchAll(new RegExp(pattern.source,'g'))].map(match => ({ id, start:match.index, end:match.index+match[0].length }))
  ).sort((a,b) => a.start-b.start);
  if (mentions.length < 2 || new Set(mentions.map(item => item.id)).size !== ids.length) return false;
  // "Standing or seated" cannot turn "dumbbell and kettlebell" into an OR.
  return mentions.slice(1).every((mention,index) =>
    /^\s*(?:or|nebo)\s+(?:(?:a|an|the)\s+)?$/.test(value.slice(mentions[index].end,mention.start)));
}
const conditional = /\b(if|optional|optionally|instead|without|avoid|not|never|don't|rather than|can use|may use|progression|regression|nearby|on the shelf|for reference|unlike|such as|pokud|pripadne|volitelne|muzes|muzete|bez|nepouzivej|nepouzivejte|nikoliv|namisto|misto|lehci|tezsi varianta|napriklad|na polici)\b/;

function explicitLoad(row) {
  // Names identify the performed variation; alternatives/warnings do not.
  const names = [row.cz,row.en].filter(value => typeof value === 'string');
  const namesTypes = unique(names.filter(text => !conditional.test(normalize(text))).flatMap(typesIn));
  if (namesTypes.length === 1) return { ids:namesTypes, source:'name', text:names.join(' / ') };
  if (namesTypes.length > 1) {
    const alternative = names.find(text => directlyConnectedAlternatives(text,namesTypes));
    return alternative ? { ids:namesTypes, source:'name-alternative', text:alternative } : null;
  }
  // Only positive setup/execution clauses. No cautions, progressions, aliases,
  // source captions or bare "bell", "weight" / "činka" can refine the type.
  for (const field of ['pos','exe']) {
    const texts = typeof row[field] === 'string' ? [row[field]] : array(row[field]);
    const candidates = [];
    for (const text of texts) {
      if (typeof text !== 'string') continue;
      for (const clause of text.split(/[.!?;]+/)) {
        if (conditional.test(normalize(clause))) continue;
        const ids = typesIn(clause);
        if (ids.length > 1 && !directlyConnectedAlternatives(clause,ids)) return null;
        if (ids.length) candidates.push({ ids, source:field, text:clause.trim() });
      }
    }
    if (candidates.length) {
      // Explicit alternatives encompass a localized generic/shorter version.
      const widest = [...candidates].sort((a,b) => b.ids.length-a.ids.length)[0];
      if (candidates.every(candidate => candidate.ids.every(id => widest.ids.includes(id)))) return widest;
      return null; // incompatible descriptions need an editorial correction
    }
  }
  return null;
}

// Reviewed source snapshots, not ID-only corrections. These two legacy eq
// arrays list a band, but every setup/execution field describes dumbbells.
// Any edited content below disables the correction; explicit taxonomy wins.
const reviewedDumbbellRows = {
  dbcurl: {
    cz:'Bicepsový zdvih', en:'Biceps Curl', pat:'tah', eq:['zavazi','guma'],
    pos:['Stoj, činky podél těla, dlaně vpřed.','Standing, dumbbells by the sides, palms forward.'],
    exe:['Zdvih k rameni bez pohybu lokte. Pomalu dolů do plného propnutí.','Curl to the shoulder without the elbow drifting. Lower slowly to full extension.'],
    wat:['Žádné houpání trupem. Dole vždy propnout.','No body swing. Always straighten at the bottom.'],
    pro:['Pomalejší negativní fáze, pak shyb podhmatem.','Slower negatives, then the chin-up.'],
    foc:['Loket je pant přišpendlený k boku. Nic jiného se nehýbe.','The elbow is a hinge pinned to the side. Nothing else moves.'],
  },
  lateralraise: {
    cz:'Upažování', en:'Lateral Raise', pat:'tlak', eq:['zavazi','guma'],
    pos:['Stoj, činky podél těla, mírně pokrčené lokty.','Standing, dumbbells by the sides, elbows softly bent.'],
    exe:['Upaž do výšky ramen, krátce, pomalu dolů.','Raise to shoulder height, pause, lower slowly.'],
    wat:['Žádný švih trupem. Lehčí váha a čistota vyhrává.','No body swing. Lighter and cleaner wins.'],
    pro:['Pomalejší negativní fáze, pauzy nahoře.','Slower negatives, pauses at the top.'],
    foc:['Vede loket, ne zápěstí. Ramena zůstávají dole.','The elbow leads, not the wrist. The shoulders stay down.'],
  },
};
function reviewedRequirements(row) {
  const snapshot = reviewedDumbbellRows[row.id];
  return snapshot && Object.entries(snapshot).every(([key,value]) => JSON.stringify(row[key]) === JSON.stringify(value)) ? [['dumbbell']] : null;
}

/** items: OR navigation facets. requirements: AND groups, OR alternatives in
 * each group. Unknown requirements stay blocking in available-equipment mode.
 * Explicit row.taxonomy.equipmentRequirements > meta.taxonomy equivalent.
 * Empty explicit requirements mean reviewed no equipment; malformed groups
 * remain unknown instead of silently making an exercise available.
 */
export function exerciseEquipment(input, inputMeta = {}) {
  const row = input || {}, meta = inputMeta || {};
  const legacy = [...array(row.eq)];
  const explicit = row.taxonomy?.equipmentRequirements ?? meta.taxonomy?.equipmentRequirements;
  const evidence = [];
  let requirements;
  if (Array.isArray(explicit)) {
    requirements = explicit.map(group => {
      const ids = unique(array(group).filter(id => typeof id === 'string' && id));
      return ids.length ? ids : ['unknown_equipment'];
    });
    evidence.push({ legacyId:null, ids:unique(requirements.flat()), source:'taxonomy', text:'equipmentRequirements' });
  } else if (reviewedRequirements(row)) {
    requirements = reviewedRequirements(row);
    evidence.push({ legacyId:null, ids:['dumbbell'], source:'reviewed-content-match',
      text:`${row.id}: exact cz/en, pat, eq, pos, exe, wat, pro and foc snapshot; setup/execution specifies dumbbells, not bands.` });
  } else {
    const load = explicitLoad(row);
    requirements = legacy.length ? legacy.map(id => {
      const mayRefine = id === 'zavazi' || (id === 'cinka' && load &&
        (load.source.startsWith('name') || load.ids.every(type => ['ez_bar','trap_bar'].includes(type))));
      if (mayRefine && load) {
        evidence.push({ legacyId:id, ...load });
        return [...load.ids];
      }
      return [typeof id === 'string' && id ? id : 'unknown_equipment'];
    }) : [['unknown_equipment']];
  }
  requirements = requirements.filter((group,index,all) => all.findIndex(other => [...other].sort().join('|') === [...group].sort().join('|')) === index);
  const items = equipmentCapabilities(requirements.flat());
  return { items, requirements, unresolved:items.filter(unresolvedId), evidence, legacy };
}

export function matchesAvailableEquipment(profile, availableIds = []) {
  const available = new Set(equipmentCapabilities(availableIds));
  if (!profile || !Array.isArray(profile.requirements)) return false;
  return profile.requirements.every(group => array(group).some(id => !unresolvedId(id) && (id === 'telo' || available.has(id))));
}

// Owning a pair also covers one implement; owning one never implies a pair.
function equipmentCapabilities(ids) {
  return unique(array(ids).flatMap(id=>id==='kettlebell_pair'?[id,'kettlebell']:id==='dumbbell_pair'?[id,'dumbbell']:['stair_machine','smith_machine'].includes(id)?[id,'stroj']:[id]));
}
