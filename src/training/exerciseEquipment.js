// Browsing-only refinement. Source eq, identity, generator rules and animations
// are never rewritten. A recorded generic load is not proof of a dumbbell.
const vocabulary = rows => Object.freeze(rows.map(([id, cz, en, group]) => Object.freeze({ id, cz, en, ...(group ? { group } : {}) })));
export const EXERCISE_EQUIPMENT_GROUPS = vocabulary([
  ['body','Tělo a prostor','Body and space'], ['free_weights','Volná zátěž','Free weights'],
  ['resistance','Odpor a stroje','Resistance and machines'], ['supports','Opory a závěsy','Supports and suspension'],
  ['accessories','Další pomůcky','Other equipment'], ['unspecified','K upřesnění','Needs clarification'],
]);
export const EXERCISE_EQUIPMENT = vocabulary([
["light_dowel","Lehká dlouhá tyč pro pohyb paží","Light long dowel for arm mobility","accessories"],
["long_light_band","Dlouhá lehká guma pro pohyb paží","Long light band for arm mobility","resistance"],
["stable_table","Stabilní stůl pro oporu a posun rukou","Stable table for hand support and sliding","supports"],
["long_foam_roller","Dlouhý pěnový válec pod hlavu i pánev","Long foam roller supporting head and pelvis","supports"],
["broad_upper_arm_band","Široká guma se smyčkou kolem nadloktí","Broad band loop for upper-arm resistance","resistance"],
["lateral_raise_machine","Stroj na upažování s oporami nad lokty","Lateral-raise machine with pads above the elbows","resistance"],
["rear_delt_machine","Stroj na zadní rozpažování s oporou hrudníku","Chest-supported reverse fly machine","resistance"],
["chest_fly_machine","Stroj na rozpažování před hrudníkem","Chest-fly machine","resistance"],
["long_prone_bench","Dlouhá pevná lavice pro leh celým tělem","Long stable bench for whole-body prone support","supports"],
["door_frame","Pevná zárubeň pro oporu paže","Stable doorframe for arm support","supports"],
["upright_grip_support","Pevná svislá opora pro úchop ve dvou výškách","Fixed upright for gripping at two heights","supports"],
["low_fixed_handhold","Pevně zajištěné nízké madlo pro tah v sedu","Secured low handhold for seated pulling","supports"],
["low_cable","Spodní kladka","Low cable pulley","resistance"],
["cable_ankle_cuff","Kotníková manžeta ke kladce","Cable ankle cuff","accessories"],
["kneeling_glute_press_machine","Stroj na zanožování vkleče","Kneeling glute press machine","resistance"],
["hip_abduction_machine","Stroj na unožování vsedě","Seated hip abduction machine","resistance"],
["hip_adduction_machine","Stroj na přinožování vsedě","Seated hip adduction machine","resistance"],
["soft_pickup_objects","Malé měkké předměty pro úchop prsty nohy","Small soft objects for toe pickup","accessories"],
["small_bowl","Malá stabilní miska","Small stable bowl","accessories"],
["seated_calf_raise_machine","Stroj na výpony vsedě s opěrou stehen","Seated calf-raise machine with thigh pads","resistance"],
["standing_calf_raise_machine","Stroj na výpony ve stoji s ramenními opěrami","Standing calf-raise machine with shoulder pads","resistance"],
["calf_compatible_leg_press","Leg press vhodný pro výpony s jištěním","Leg press suitable for calf raises with safeguards","resistance"],
["seated_leg_curl_machine","Stroj na zakopávání vsedě","Seated leg-curl machine","resistance"],
["lying_leg_curl_machine","Stroj na zakopávání vleže","Lying leg-curl machine","resistance"],
["standing_leg_curl_machine","Stroj na zakopávání ve stoji","Standing leg-curl machine","resistance"],
["nordic_ankle_anchor","Pevné zajištění kotníků pro Nordic","Purpose-made Nordic ankle restraint","supports"],
["glute_ham_developer","GHD lavice pro glute-ham raise","Glute-ham developer bench","supports"],
["ankle_cuff","Kotníková manžeta pro odporovou gumu","Ankle cuff for resistance-band attachment","accessories"],
["knee_extension_machine","Stroj na předkopávání","Knee-extension machine","resistance"],
["upright_support_pair","Dvě pevné svislé opory pro úchop","Two fixed upright handholds","supports"],
["bicycle","Jízdní kolo","Bicycle","accessories"],
["cycling_route","Trasa vhodná pro jízdu na kole","Suitable cycling route","body"],
["air_bike","Air bike s pohyblivými madly","Air bike with moving handles","resistance"],
["swimming_venue","Prostor určený k plavání","Swimming venue","body"],
["climbing_venue","Lezecké pracoviště nebo vhodný terén","Climbing venue or suitable terrain","body"],
["elliptical_trainer","Eliptický trenažér","Elliptical trainer","resistance"],
["training_sled_push","Sáně s pevnými tlačnými madly","Sled with fixed push handles","resistance"],
["training_sled_pull","Sáně s tažným úchytem","Sled with tow attachment","resistance"],
["sled_hand_tow_set","Tažný popruh s madly a spojkami","Tow strap with hand grips and connectors","accessories"],
["sled_body_tow_set","Tažný pás či úvaz s popruhem a spojkami","Towing belt or harness with line and connectors","accessories"],
["sled_lane","Volná dráha s povrchem vhodným pro sáně","Clear lane with a suitable sled surface","body"],
["low_soft_cones","Sada nízkých měkkých kuželů","Set of low yielding cones","accessories"],
["four_training_cones","Čtyři kužely pro vyznačení trasy","Four cones for marking a course","accessories"],
["agility_ladder","Plochý koordinační žebřík","Flat agility ladder","accessories"],
["low_yielding_hurdles","Sada nízkých povolujících překážek","Set of low yielding hurdles","accessories"],
["exercise_mat","Neklouzavá cvičební podložka","Non-slip exercise mat","accessories"],
["bosu_balance_trainer","Balanční polokoule BOSU","BOSU balance trainer","supports"],
["abdominal_crunch_machine","Stroj na zkracovačky vsedě","Seated abdominal crunch machine","resistance"],
["yoga_block","Jógová kostka","Yoga block","supports"],
["support_cushion","Pevný opěrný polštář","Firm support cushion","supports"],
["thoracic_extension_chair","Židle s vhodným opěradlem pod lopatky","Chair with suitable backrest below shoulder blades","supports"],
["round_plate_pair","Dva stejně velké kulaté kotouče","Two equal-sized round plates","free_weights"],
["barbell_collars","Pár objímek na osu","Pair of barbell collars","accessories"],
["suspension_anchor","Nosné kotvení závěsného systému","Load-bearing suspension anchor","supports"],
["sliding_towel_pair","Dva malé ručníky pro klouzání","Two small sliding towels","accessories"],
["short_loop_band","Krátká odporová smyčka","Short resistance loop","resistance"],
["captains_chair","Věž s oporami předloktí a zad","Captain’s chair with forearm and back support","supports"],
["hand_support_blocks_pair","Dvě pevné kostky pro oporu rukou","Pair of solid hand-support blocks","supports"],
  ["climbing_rope_station","Šplhací lano s vhodným zavěšením","Climbing rope with suitable anchoring","supports"],
  ["protective_landing_mat","Ochranná žíněnka pro doskokovou plochu","Protective landing mat","accessories"],
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
  ["flat_bench","Rovná tréninková lavice","Flat workout bench","supports"],
  ["incline_bench","Šikmá lavice","Incline bench","supports"],
  ["decline_bench_leg_support","Negativní lavice se zajištěním nohou","Decline bench with leg support","supports"],
  ["backed_bench","Pevné sedadlo s opěradlem","Stable seat with back support","supports"],
  ["floor_press_rack","Stojan s dorazy pro tlak z podlahy","Rack with floor-press safeties","supports"],
  ["chest_press_machine","Stroj na tlak před hrudník","Chest press machine","resistance"],
  ["adjustable_cable","Výškově nastavitelná kladka","Height-adjustable cable pulley","resistance"],
  ["adjustable_cable_pair","Dvě nastavitelné kladky","Two adjustable cable pulleys","resistance"],
  ["cable_handle","Jednoruční madlo kladky","Single cable handle","accessories"],
  ["cable_handle_pair","Pár jednoručních madel kladky","Pair of cable handles","accessories"],
  ["lifting_chain_pair","Pár zátěžových řetězů s uchycením","Pair of lifting chains with attachments","free_weights"],
  ["low_parallettes","Pár nízkých madel","Pair of low parallettes","supports"],
  ["landmine_pivot","Landmine kloub pro osu","Landmine barbell pivot","supports"],
  ["landmine_row_handle","Obouruční držadlo pro landmine přítah","Two-hand landmine row handle","accessories"],
  ["cable_row_handle","Obouruční přítahové madlo kladky","Two-hand cable row handle","accessories"],
  ["seated_cable_row_station","Stanoviště spodní kladky vsedě","Seated low cable row station","resistance"],
  ["chest_supported_row_machine","Přítahový stroj s oporou hrudníku","Chest-supported row machine","resistance"],
  ["rowing_ergometer","Veslařský trenažér","Rowing ergometer","resistance"],
  ["shoulder_press_machine","Stroj na tlaky nad hlavu","Shoulder press machine","resistance"],
  ["dip_belt","Opasek pro zavěšení zátěže","Dip belt","accessories"],
  ["long_parallel_bars","Dlouhá bradla pro oporu předloktí","Long parallel bars for forearm support","supports"],
  ["box_support","Pevná bedna pro oporu chodidel","Stable box for foot support","supports"],
  ["pullup_band","Dlouhá smyčka pro dopomoc shybů","Long loop band for pull-up assistance","resistance"],
  ["assisted_pullup_machine","Stroj s dopomocí pro shyby","Assisted pull-up machine","resistance"],
  ["lat_pulldown_station","Stanoviště horní kladky se sedem a stehenní opěrou","Lat pulldown station with seat and thigh pad","resistance"],
  ["lat_pulldown_bar","Dlouhá hrazdička horní kladky","Lat pulldown bar","accessories"],
  ["lever_lat_pulldown_machine","Pákový stroj na stahování shora","Lever lat pulldown machine","resistance"],
  ["high_cable","Horní kladka s volným prostorem","High pulley with clear space","resistance"],
  ["cable_bar","Obouruční tyč kladky","Two-hand cable bar","accessories"],
  ["towel_pair","Dva pevné ručníky pro úchop","Two sturdy grip towels","accessories"],
  ["low_pullup_bar","Nízká hrazda pro oporu chodidel","Low bar for foot support","supports"],
  ["parallel_pullup_handles","Pevná paralelní madla pro shyby","Fixed parallel pull-up handles","supports"],
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
  // Navigation may group machines; ownership must never imply a different machine.
  const machineTypes=["lateral_raise_machine","rear_delt_machine","chest_fly_machine","kneeling_glute_press_machine","hip_abduction_machine","hip_adduction_machine","seated_calf_raise_machine","standing_calf_raise_machine","calf_compatible_leg_press","seated_leg_curl_machine","lying_leg_curl_machine","standing_leg_curl_machine","knee_extension_machine",'air_bike','elliptical_trainer','stair_machine','smith_machine','chest_press_machine','chest_supported_row_machine','rowing_ergometer','seated_cable_row_station'];
  const reviewedNavigationGroups={"light_dowel":["tyc"],"long_light_band":["guma"],"broad_upper_arm_band":["guma"],"long_foam_roller":["valec"],"long_prone_bench":["flat_bench","lavice"],"stable_table":["fixed_support"],"door_frame":["zed"],"upright_grip_support":["fixed_support"],"low_fixed_handhold":["fixed_support"],"low_cable":["kladka"],"abdominal_crunch_machine":["stroj"],"thoracic_extension_chair":["chair"],"captains_chair":["stroj"],"shoulder_press_machine":["stroj"],"assisted_pullup_machine":["stroj"],"lat_pulldown_station":["kladka","stroj"],"lever_lat_pulldown_machine":["stroj"],"high_cable":["kladka"],"low_pullup_bar":["hrazda"],"parallel_pullup_handles":["hrazda"]};
  const items = unique(equipmentCapabilities(requirements.flat()).flatMap(id=>[id,...(machineTypes.includes(id)?['stroj']:[]),...(reviewedNavigationGroups[id]||[])]));
  return { items, requirements, unresolved:items.filter(unresolvedId), evidence, legacy };
}

export function matchesAvailableEquipment(profile, availableIds = []) {
  const available = new Set(equipmentCapabilities(availableIds));
  if (!profile || !Array.isArray(profile.requirements)) return false;
  return profile.requirements.every(group => array(group).some(id => !unresolvedId(id) && (id === 'telo' || available.has(id))));
}

// Owning a pair also covers one implement; owning one never implies a pair.
const reviewedCapabilities = {"adjustable_cable":["kladka"],"adjustable_cable_pair":["adjustable_cable","kladka"],"cable_handle_pair":["cable_handle"],"landmine_pivot":[],"landmine_row_handle":[],"cable_row_handle":[]};
const verticalAuditCapabilities={"long_parallel_bars":["bradla"],"pullup_band":["guma"],"lat_pulldown_bar":["cable_bar"],"towel_pair":["towel"]};
function equipmentCapabilities(ids) {
  ids=array(ids).flatMap(id=>[id,...({"long_foam_roller":["valec"],"long_prone_bench":["flat_bench"]}[id]||[])]);
  ids=array(ids).flatMap(id=>[id,...({"thoracic_extension_chair":["chair"]}[id]||[])]);
  ids=array(ids).flatMap(id=>[id,...({"round_plate_pair":["plate"],"sliding_towel_pair":["towel"],"short_loop_band":["guma"]}[id]||[])]);
  ids=array(ids).flatMap(id=>[id,...(verticalAuditCapabilities[id]||[])]);
  ids = array(ids).flatMap(id=>[id,...(reviewedCapabilities[id]||[])]);
  return unique(array(ids).flatMap(id=>id==='kettlebell_pair'?[id,'kettlebell']:id==='dumbbell_pair'?[id,'dumbbell']:[id]));
}
