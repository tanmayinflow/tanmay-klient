// Display-only anatomy resolver. Never writes to the person's exercise record,
// changes training prescriptions or guesses muscle groups from an exercise name.
// Corrections require an exact match with an inspected legacy seed signature.
// Evidence and limits: Reviews/muscle-map-2026-10-02/MAPPING-AUDIT.md.

export const MUSCLE_GROUPS = [
  { k: "qua", cz: "přední stehna", en: "quadriceps", anatomy: "Quadriceps femoris", region: { cz: "Přední strana stehen", en: "Front of the thighs" } },
  { k: "ham", cz: "zadní stehna", en: "hamstrings", anatomy: "Biceps femoris, semitendinosus, semimembranosus", region: { cz: "Zadní strana stehen", en: "Back of the thighs" } },
  { k: "glu", cz: "hýžďové svaly", en: "gluteal muscles", anatomy: "Gluteus maximus, medius and minimus", region: { cz: "Hýždě a zevní oblast kyčle", en: "Buttocks and outer hip" }, note: { cz: "Skupina svalů. Podíl jednotlivých svalů závisí na pohybu.", en: "A muscle group. Each muscle's contribution depends on the movement." } },
  { k: "cal", cz: "lýtkové svaly", en: "calf muscles", anatomy: "Gastrocnemius and soleus", region: { cz: "Zadní strana bérců", en: "Back of the lower legs" } },
  { k: "tib", cz: "přední holenní sval", en: "tibialis anterior", anatomy: "Tibialis anterior", region: { cz: "Přední strana bérců", en: "Front of the lower legs" } },
  { k: "abs", cz: "břišní svaly", en: "abdominal muscles", anatomy: "Rectus abdominis and deep abdominal wall", region: { cz: "Přední břišní stěna", en: "Front abdominal wall" }, note: { cz: "Oblast zahrnuje také hlubokou břišní stěnu, která na povrchu není vidět.", en: "The region includes the deep abdominal wall, which is not visible on the surface." } },
  { k: "obl", cz: "šikmé břišní svaly", en: "obliques", anatomy: "Obliquus externus and internus abdominis", region: { cz: "Boční břišní stěna", en: "Side abdominal wall" } },
  { k: "low", cz: "bederní vzpřimovače", en: "lower-back extensors", anatomy: "Lumbar erector spinae and multifidus", region: { cz: "Podél bederní páteře", en: "Along the lumbar spine" }, note: { cz: "Zobrazení oblasti, včetně hlubších svalů pod povrchem.", en: "A regional view, including deeper muscles below the surface." } },
  { k: "upb", cz: "horní záda", en: "upper back", anatomy: "Broad legacy back group: scapular muscles and, in some records, latissimus dorsi", region: { cz: "Horní a boční oblast zad", en: "Upper and side back region" }, note: { cz: "Širší oblast ze staršího přiřazení. Podle cviku může zahrnovat mezilopatkové svaly i široký sval zádový; nejde o jeden izolovaný sval.", en: "A broad region from the existing assignment. Depending on the exercise, it can include scapular muscles and latissimus dorsi; it is not one isolated muscle." } },
  { k: "lat", cz: "široký sval zádový", en: "latissimus dorsi", anatomy: "Latissimus dorsi", region: { cz: "Boční a dolní část zad směrem k podpaží", en: "Side and lower back towards the armpit" } },
  { k: "tra", cz: "trapézový sval", en: "trapezius", anatomy: "Trapezius", region: { cz: "Od šíje přes ramena mezi lopatky", en: "From the neck over the shoulders and between the shoulder blades" }, note: { cz: "Horní, střední a dolní část mají různé úlohy; mapa ukazuje společnou oblast.", en: "Upper, middle and lower portions have different roles; the map shows their shared region." } },
  { k: "che", cz: "prsní svaly", en: "pectoral muscles", anatomy: "Pectoralis major and minor region", region: { cz: "Přední část hrudníku", en: "Front of the chest" } },
  { k: "sho", cz: "deltové svaly", en: "deltoids", anatomy: "Deltoideus", region: { cz: "Přední, boční a zadní oblast ramen", en: "Front, side and back of the shoulders" }, note: { cz: "Skupina přední, střední a zadní části deltového svalu.", en: "The anterior, middle and posterior portions of the deltoid." } },
  { k: "bic", cz: "biceps a ohybače lokte", en: "biceps and elbow flexors", anatomy: "Biceps brachii and brachialis", region: { cz: "Přední strana nadloktí", en: "Front of the upper arms" } },
  { k: "tri", cz: "triceps", en: "triceps", anatomy: "Triceps brachii", region: { cz: "Zadní strana nadloktí", en: "Back of the upper arms" } },
  { k: "fore", cz: "svaly předloktí", en: "forearm muscles", anatomy: "Forearm flexor, extensor and rotator groups", region: { cz: "Přední a zadní strana předloktí", en: "Front and back of the forearms" }, note: { cz: "Společná oblast úchopu a pohybů zápěstí a předloktí.", en: "A shared region for grip, wrist and forearm movements." } },
  { k: "add", cz: "přitahovače stehen", en: "hip adductors", anatomy: "Hip adductor group", region: { cz: "Vnitřní strana stehen", en: "Inner thighs" } },
  { k: "hipflex", cz: "ohybače kyčle", en: "hip flexors", anatomy: "Iliopsoas and hip-flexor group", region: { cz: "Přední a hluboká oblast kyčle", en: "Front and deep hip region" }, note: { cz: "Hluboké svaly jsou zakreslené orientačně v projekci na povrch.", en: "Deep muscles are shown as an approximate surface projection." } },
  { k: "rcuff", cz: "rotátorová manžeta", en: "rotator cuff", anatomy: "Supraspinatus, infraspinatus, teres minor, subscapularis", region: { cz: "Hluboká oblast kolem ramenního kloubu", en: "Deep region around the shoulder joint" }, note: { cz: "Čtyři hlubší svaly. Přední a zadní projekce neukazují jejich skutečnou hloubku.", en: "Four deeper muscles. Front and back projections do not show their actual depth." } },
  { k: "serr", cz: "přední pilovitý sval", en: "serratus anterior", anatomy: "Serratus anterior", region: { cz: "Boční žebra pod podpažím", en: "Side ribs below the armpit" } },
  { k: "neck", cz: "krční svaly", en: "neck muscles", anatomy: "Cervical flexor, extensor and rotator groups", region: { cz: "Přední a zadní oblast krku", en: "Front and back of the neck" }, note: { cz: "Skupina krčních svalů, nikoli jeden izolovaný sval.", en: "A neck muscle group, rather than one isolated muscle." } },
];

const KNOWN = new Set(MUSCLE_GROUPS.map(({ k }) => k));
const arr = value => Array.isArray(value) ? value : [];
const same = (value, expected) => Array.isArray(value) && value.length === expected.length && value.every((k, i) => k === expected[i]);
const pair = (mp, ms, primary, secondary, mode) => ({ mp, ms, primary, secondary, mode });
const gm = (primary, secondary = []) => pair(["sho", "low"], [], primary, secondary, "mobility");
const lat = (mp, ms) => pair(mp, ms, mp.map(k => k === "upb" ? "lat" : k), ms, "strength");
const row = (mp, ms) => pair(mp, ms, mp.flatMap(k => k === "upb" ? ["upb", "lat"] : [k]), ms, "strength");
const REST_NOTE = {
  cz: "Odpočinková, dechová nebo meditační poloha. Záznam neurčuje cílené posilování konkrétní svalové skupiny.",
  en: "A resting, breathing or meditation posture. The record does not identify targeted strengthening of a specific muscle group.",
};
const rest = (mp, ms = []) => ({ ...pair(mp, ms, [], [], "none"), note: REST_NOTE, rest: true });

// Exact IDs and exact previous signatures. No name, prefix or movement-pattern
// heuristic assigns muscles. Ordering is deliberately part of the signature.
const CORRECTIONS = {
  tibraise: pair(["cal"], [], ["tib"], [], "strength"),
  gm_w_spine: gm(["low"], ["abs"]),
  gm_w_side: gm(["obl"], ["low"]),
  gm_w_trunk_circle: gm(["obl", "low"], ["abs"]),
  gm_w_twist: gm(["obl"], ["low"]),
  gm_w_horizontal: gm(["sho", "che"], ["upb"]),
  gm_w_vertical: gm(["sho", "lat"], ["che"]),
  gm_w_circles_bends: gm(["sho", "ham", "low"], ["glu"]),
  gm_w_circles_side: gm(["sho", "obl"], ["lat"]),
  gm_w_round_flat: gm(["ham", "low"], ["glu"]),
  gm_w_bend_twist: gm(["ham", "obl", "low"], ["sho"]),
  gm_w_hip_circle: gm(["hipflex", "glu"], ["obl"]),
  gm_w_half_cossack: gm(["qua", "glu", "add"], ["ham"]),
  gm_w_squat_bends: gm(["qua", "glu", "ham"], ["low"]),
  gm_w_forearm_circle: gm(["bic", "tri", "fore"], ["sho"]),
  gm_w_wrist_open: gm(["fore"]),
  gm_w_wrist_circle: gm(["fore"]),
  pullup: lat(["upb", "bic"], ["fore", "abs"]),
  chinup: lat(["bic", "upb"], ["fore", "abs"]),
  negpull: lat(["upb", "bic"], ["fore", "abs"]),
  archpull: lat(["upb", "bic"], ["fore", "abs"]),
  typewriter: lat(["upb", "bic"], ["fore", "abs"]),
  commando: lat(["bic", "upb"], ["fore", "obl"]),
  oap: lat(["bic", "upb"], ["fore", "abs", "obl"]),
  lsitpullup: lat(["upb", "abs"], ["bic", "fore", "qua"]),
  exppull: lat(["upb", "bic"], ["fore", "abs"]),
  wpullup: lat(["upb", "bic"], ["fore", "abs"]),
  deadpull: lat(["upb", "bic"], ["fore", "abs"]),
  bandpull: lat(["upb", "bic"], ["tra", "fore", "abs"]),
  assistpullup: lat(["upb", "bic"], ["fore", "abs"]),
  latpull: lat(["upb", "bic"], ["fore"]),
  latiso: lat(["upb"], ["fore"]),
  straightarmpd: lat(["upb"], ["abs", "tri"]),
  faq_foot_chin: lat(["upb", "bic"], []),
  faq_chin_negative: lat(["upb", "bic"], []),
  // The native instructions establish a straight-arm lever/pull. This narrows
  // the legacy primary back label, without claiming a complete EMG ranking.
  tucklever: lat(["upb", "abs"], ["fore", "sho"]),
  frontlever: lat(["upb", "abs"], ["fore", "glu", "low"]),
  icecream: lat(["upb", "abs"], ["fore", "bic"]),
  flraise: lat(["upb", "abs"], ["fore", "low"]),
  flrow: lat(["upb", "abs"], ["bic", "fore"]),
  straddlefl: lat(["upb", "abs"], ["fore", "glu", "low"]),
  advtucklever: lat(["upb", "abs"], ["fore", "sho"]),
  onelegfl: lat(["upb", "abs"], ["fore", "glu"]),
  halflayfl: lat(["upb", "abs"], ["fore", "glu", "low"]),
  flneg: lat(["upb", "abs"], ["fore", "low"]),
  fltouch: lat(["upb", "abs"], ["bic", "fore"]),
  flpullup: lat(["upb", "bic"], ["fore", "abs"]),
  oafl: lat(["upb", "abs"], ["fore", "obl", "low"]),
  muscleup: lat(["upb", "che", "tri"], ["bic", "fore", "abs"]),
  ropeclimb: lat(["upb", "bic", "fore"], ["abs", "tra"]),
  an_dbpullover: lat(["upb", "che"], ["tri", "abs"]),
  // Rows also retract the scapulae, so their broad back region is retained.
  bodyrow: row(["upb", "bic"], ["fore", "abs"]),
  dbrow: row(["upb", "bic"], ["low", "fore"]),
  renegade: row(["upb", "abs"], ["obl", "sho", "fore"]),
  bbrow: row(["upb", "bic"], ["low", "ham", "fore"]),
  cablerow: row(["upb", "bic"], ["low", "fore"]),
  inclrow: row(["upb", "bic"], ["fore", "tra"]),
  archrow: row(["upb", "bic"], ["fore", "tra"]),
  ringrow: row(["upb", "bic"], ["fore", "tra"]),
  an_benchdbrow: row(["upb", "bic"], ["tra", "low"]),
  tbarrow: row(["upb", "bic"], ["low", "ham", "fore"]),
  landminerow: row(["upb", "bic"], ["low", "fore", "obl"]),
  chestsupprow: row(["upb", "bic"], ["fore"]),
  oacablerow: row(["upb", "bic"], ["obl", "fore"]),
  faq_onearm_row: row(["upb", "bic"], []),
  // Hip flexion is distinct from abdominal bracing or knee extension.
  hollow: pair(["abs"], ["obl", "qua"], ["abs"], ["obl", "qua", "hipflex"], "strength"),
  situp: pair(["abs"], ["obl"], ["abs"], ["obl", "hipflex"], "strength"),
  bicycle: pair(["abs", "obl"], [], ["abs", "obl"], ["hipflex"], "strength"),
  vup: pair(["abs"], ["obl", "qua"], ["abs", "hipflex"], ["obl", "qua"], "strength"),
  flutter: pair(["abs"], ["qua"], ["abs", "hipflex"], ["qua"], "strength"),
  tuckl: pair(["abs"], ["fore", "sho"], ["abs", "hipflex"], ["fore", "sho"], "strength"),
  straddlesit: pair(["abs"], ["sho", "fore"], ["abs", "hipflex"], ["sho", "fore"], "strength"),
  an_scissors: pair(["abs"], ["obl", "qua"], ["abs", "hipflex"], ["obl", "qua"], "strength"),
  mtclimb: pair(["abs"], ["sho", "qua"], ["abs"], ["sho", "qua", "hipflex"], "strength"),
  highknees: pair(["qua", "cal"], ["abs"], ["qua", "cal", "hipflex"], ["abs"], "strength"),
  jg_paripurna_navasana: pair(["abs"], ["qua", "low"], ["abs", "hipflex"], ["qua", "low"], "strength"),
  jg_uttana_padasana: pair(["abs", "low"], ["che", "qua"], ["abs", "low", "hipflex"], ["che", "qua"], "strength"),
  couch: pair(["qua"], ["glu"], ["qua", "hipflex"], ["glu"], "mobility"),
  frontsplit: pair(["ham", "qua"], ["glu"], ["ham", "qua", "hipflex"], ["glu"], "mobility"),
  lizard: pair(["glu"], ["qua", "ham"], ["glu", "hipflex"], ["qua", "ham"], "mobility"),
  jg_anjaneyasana: pair(["qua", "glu"], ["low", "sho"], ["hipflex", "qua"], ["glu", "low", "sho"], "mobility"),
  jg_asva_sancalanasana: pair(["qua", "glu"], ["low"], ["hipflex", "qua"], ["glu", "low"], "mobility"),
  jg_dragon: pair(["glu", "qua"], ["ham"], ["glu", "qua", "hipflex"], ["ham"], "mobility"),
  // The native straddle/bound-angle variants abduct the hips; the adductors
  // are a stretch target, not an omitted gluteal-strength exercise.
  pancake: pair(["ham", "glu"], ["low"], ["ham", "add"], ["glu", "low"], "mobility"),
  jg_upavistha_konasana: pair(["ham", "glu"], ["low"], ["ham", "add"], ["glu", "low"], "mobility"),
  jg_baddha_konasana: pair(["glu"], ["low"], ["add"], ["low"], "mobility"),
  jg_supta_baddha_konasana: pair(["glu"], ["che"], ["add"], ["che"], "mobility"),
  gm_scap_retract_quad: pair(["upb"], [], ["upb", "serr"], [], "mobility"),
  jg_pranamasana: rest(["sho"]),
  jg_sukhasana: rest(["low"]),
  jg_padmasana: rest(["low"]),
  jg_siddhasana: rest(["low"]),
  jg_viparita_karani: rest(["low"]),
  jg_makarasana: rest(["low"]),
  jg_simhasana: rest(["neck"], ["che"]),
  diaphragm: {
    ...pair([], ["abs"], [], [], "none"),
    note: { cz: "Dechový nácvik. Bránice nemá v této povrchové mapě samostatnou oblast.", en: "Breathing practice. The diaphragm has no separate region in this surface map." },
  },
  zone2: {
    ...pair([], ["qua", "cal", "ham"], [], [], "unspecified"),
    note: { cz: "Vytrvalostní aktivita může být chůze, běh, kolo nebo plavání. Svaly určuje až zvolená aktivita.", en: "Endurance may mean walking, running, cycling or swimming. The chosen activity determines the muscles." },
  },
  // Passive rotation concerns the cuff as a group, not just the deltoid cap.
  // The global mobility wording avoids claiming that every cuff muscle is
  // contracting or being stretched equally during these different directions.
  kr_mob_016: pair(["sho"], [], ["rcuff"], ["sho"], "mobility"),
  kr_mob_017: pair(["sho"], [], ["rcuff"], ["sho"], "mobility"),
  kr_mob_018: pair(["sho"], [], ["rcuff"], ["sho"], "mobility"),
  kr_mob_019: pair(["sho"], [], ["rcuff"], ["sho"], "mobility"),
  kr_mob_063: pair(["upb"], [], ["lat"], [], "mobility"),
  kr_mob_064: pair(["upb"], [], ["lat"], [], "mobility"),
  kr_mob_065: pair(["upb"], [], ["lat"], [], "mobility"),
  kr_mob_066: pair(["upb"], [], ["lat"], [], "mobility"),
  kr_mob_067: pair(["upb"], [], ["lat", "upb"], [], "mobility"),
  kr_mob_068: pair(["upb"], [], ["tra"], [], "mobility"),
  kr_mob_071: pair(["upb"], [], ["tra"], [], "mobility"),
};

// These programme slots explicitly name a common target, but their variants do
// not support one precise secondary list. Existing empty arrays are an explicit
// choice; only fields absent from the inspected seed are filled.
const MISSING_PROGRAMME = {
  vi_press: ["che"], vi_biceps: ["bic"], vi_triceps: ["tri"], vi_calf: ["cal"],
};
const PROGRAMME_NOTE = {
  cz: "Programová položka: zobrazena je společná hlavní oblast. Další zapojení závisí na zvolené variantě.",
  en: "Programme slot: the common main region is shown. Further involvement depends on the chosen variation.",
};
const ANKLE_NOTE = {
  cz: "Mobilita kotníku a nártu. Z tohoto záznamu nelze určit jeden přesný cílový sval.",
  en: "Ankle and instep mobility. This record does not identify one precise target muscle.",
};
const ANKLE_IDS = new Set(["kr_mob_098", "kr_mob_099", "kr_mob_100"]);
const REST_IDS = new Set([
  "diaphragm", "boxbreath", "co2", "jg_savasana", "jg_advasana", "jg_matsya_kridasana", "jg_shanmukhi_mudra",
  "jg_pranamasana", "jg_sukhasana", "jg_padmasana", "jg_siddhasana", "jg_viparita_karani", "jg_makarasana", "jg_simhasana",
]);
// Existing native instructions identify these specific drills as mobility.
// Neither a neck pattern nor yoga provenance establishes the exercise's role:
// resisted neck work, planks and arm balances remain active strength/skill work.
const MOBILITY_IDS = new Set([
  "anklemob", "deepsquat", "couch", "disloc", "wrists", "hip9090", "cat",
  "downdog", "cobra", "childpose", "wgs", "pigeon", "pancake", "pikefold",
  "elephantwalk", "frontsplit", "middlesplit", "shouldercars", "wallext",
  "openbook", "hipcars", "frog", "butterfly", "toetouch", "kneewall",
  "thoracicext", "squatpry", "wristcars", "sidebend", "threadneedle",
  "scorpion", "shinbox", "lizard", "elbowcars", "kneecars", "neckcars", "an_armswing",
  "jg_uttanasana", "jg_ardha_uttanasana", "jg_padangusthasana", "jg_pada_hastasana",
  "jg_prasarita_padottanasana", "jg_parsvottanasana", "jg_anjaneyasana",
  "jg_asva_sancalanasana", "jg_parvatasana", "jg_adho_mukha_svanasana",
  "jg_gomukhasana", "jg_baddha_konasana", "jg_upavistha_konasana", "jg_malasana",
  "jg_pascimottanasana", "jg_janu_sirsasana", "jg_balasana", "jg_kurmasana",
  "jg_ardha_matsyendrasana", "jg_marichyasana_c", "jg_jathara_parivartanasana",
  "jg_bitilasana_marjari", "jg_supta_baddha_konasana", "jg_pawanmuktasana",
  "jg_anahatasana", "jg_ardha_baddha_padmottanasana", "jg_triang_mukhaikapada",
  "jg_marichyasana_a", "jg_supta_kurmasana", "jg_supta_padangusthasana",
  "jg_yoga_mudra", "jg_supta_vajrasana", "jg_ardha_kurmasana", "jg_sasangasana",
  "jg_dandayamana_bibhaktapada_pascimottanasana", "jg_supta_matsyendrasana",
  "jg_shoelace", "jg_saddle", "jg_dragon",
  "jg_vajrasana", "jg_virasana", "jg_sphinx", "jg_halasana", "jg_karnapidasana", "germanhang",
]);
const ROLE_MODES = {
  strength: "strength", hypertrophy: "strength", power: "strength",
  strength_skill: "strength", coordination_skill: "strength", accessory: "strength",
  conditioning: "strength", mobility: "mobility", prep: "mobility", breath: "none",
};

export function resolveMuscleMap(ex) {
  const row = ex && typeof ex === "object" ? ex : {};
  let primary = arr(row.mp);
  let secondary = arr(row.ms);
  let corrected = false;
  let mode;
  let note;
  const correction = CORRECTIONS[row.id];
  if (correction && same(row.mp, correction.mp) && same(row.ms, correction.ms)
    && (!correction.rest || !row.sessionRole || ROLE_MODES[row.sessionRole] === "none")) {
    primary = correction.primary;
    secondary = correction.secondary;
    mode = correction.mode;
    note = correction.note;
    corrected = true;
  } else if (Object.hasOwn(MISSING_PROGRAMME, row.id) && row.mp == null && row.ms == null) {
    primary = MISSING_PROGRAMME[row.id];
    secondary = [];
    mode = "strength";
    note = PROGRAMME_NOTE;
    corrected = true;
  } else if (["vi_squat", "vi_lunge"].includes(row.id) && same(row.mp, ["glu"]) && row.ms == null) {
    primary = ["qua", "glu"];
    secondary = [];
    mode = "strength";
    note = PROGRAMME_NOTE;
    corrected = true;
  } else if (ANKLE_IDS.has(row.id) && same(row.mp, ["cal"]) && same(row.ms, [])) {
    // A posterior-calf highlight would claim specificity that the entry lacks.
    primary = [];
    secondary = [];
    mode = "mobility";
    note = ANKLE_NOTE;
    corrected = true;
  }
  const unknown = [...new Set([...primary, ...secondary].filter(k => typeof k === "string" && !KNOWN.has(k)))];
  primary = [...new Set(primary.filter(k => KNOWN.has(k)))];
  secondary = [...new Set(secondary.filter(k => KNOWN.has(k) && !primary.includes(k)))];
  // The explicit role of an edited exercise outranks a legacy display default.
  if (Object.hasOwn(ROLE_MODES, row.sessionRole) && (primary.length || secondary.length)) {
    mode = ROLE_MODES[row.sessionRole];
  }
  if (!mode) {
    if (!primary.length && !secondary.length) {
      mode = !unknown.length && (row.pat === "dech" || REST_IDS.has(row.id)) ? "none" : "unspecified";
    } else if (MOBILITY_IDS.has(row.id)) {
      mode = "mobility";
    } else if (row.pat === "dech" || row.id === "zone2") {
      mode = "unspecified";
    } else {
      mode = "strength";
    }
  }
  if (row.id === "vi_row" && !primary.length && !secondary.length) note = {
    cz: "Programová položka obsahuje různé tahy. Svaly určuje až zvolená varianta cviku.",
    en: "This programme slot contains different pulls. The selected exercise variation determines the muscles.",
  };
  return { primary, secondary, unknown, mode, corrected, ...(note ? { note } : {}) };
}

// A user-triggered selection edit accepts the displayed pair together. Otherwise
// editing one raw field could invalidate a legacy signature and make the other
// visible field jump back to its old value. Unknown keys in the untouched field
// survive because this editor cannot display or deliberately remove them.
export function muscleMapEdit(ex, field, values) {
  if (field !== "primary" && field !== "secondary") throw new TypeError("Unknown muscle-map field");
  const row = ex && typeof ex === "object" ? ex : {};
  const map = resolveMuscleMap(row);
  const uniqueStrings = items => [...new Set(items.filter(k => typeof k === "string"))];
  const selected = uniqueStrings(arr(values));
  const unknownIn = value => arr(value).filter(k => typeof k === "string" && !KNOWN.has(k));
  return field === "primary"
    ? { mp: selected, ms: uniqueStrings([...map.secondary, ...unknownIn(row.ms)]) }
    : { mp: uniqueStrings([...map.primary, ...unknownIn(row.mp)]), ms: selected };
}
