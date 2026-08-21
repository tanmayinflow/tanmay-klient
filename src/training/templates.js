// ======================================================================
// CURATED STARTER PATHS · a few good doors, not a catalogue
// ----------------------------------------------------------------------
// Not a shop of generated programmes. A small number of paths a coach
// would actually hand somebody, each with a stated audience, a stated
// boundary and an honest name. They are STARTING points: a coach edits
// them, and a client only ever sees the plan assigned to them.
//
// Nothing here is sold as a transformation. A path says who it is for,
// what it builds, how long it runs and where it stops.
// ======================================================================

import { makeTemplate, makeBlock, makeSet, makePlan, makePlanSession, nextId } from "./sessionModel.js";

// A block written the short way: [exerciseId, sets, planned, restSec, opts]
const B = (exId, sets, planned, restSec, o) => ({ exId, sets, planned, restSec, ...(o || {}) });

export const STARTER_PATHS = [
  {
    id: "path_navrat",
    cz: "Návrat k pravidelnosti", en: "Back to a rhythm",
    forWhom: ["Pro někoho, kdo se vrací po pauze a chce hlavně zase chodit pravidelně.", "For somebody coming back after a break who mainly wants to show up again."],
    builds: ["Pravidelnost, základní sílu celého těla a klid v kloubech.", "Regularity, basic whole-body strength, calm joints."],
    weeks: 6, daysPerWeek: 2, minutes: 35,
    equipment: ["telo", "guma"],
    progressionRule: "double",
    boundary: ["Není to rehabilitační program. Když něco bolí, nejdřív se zeptej člověka, který tě může vidět.", "This is not a rehabilitation programme. If something hurts, first ask somebody who can see you."],
    days: [
      { cz: "A · celé tělo", en: "A · full body", blocks: [
        B("catcow_or_thoracic", 1, { targetReps: 8 }, 20), // replaced at build time
        B("drep", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("kneepush", 3, { targetRepsMin: 6, targetRepsMax: 12 }, 90),
        B("bodyrow", 3, { targetRepsMin: 6, targetRepsMax: 10 }, 90),
        B("glutebridge", 2, { targetRepsMin: 10, targetRepsMax: 15 }, 60),
        B("plank", 2, { targetDurationSec: 30 }, 45),
      ] },
      { cz: "B · celé tělo", en: "B · full body", blocks: [
        B("birddog", 2, { targetReps: 8 }, 30),
        B("stepup", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("inclpush", 3, { targetRepsMin: 6, targetRepsMax: 12 }, 90),
        B("bandpull", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 60),
        B("deadbug", 2, { targetReps: 10 }, 45),
        B("act_walk", 1, { targetDurationSec: 900 }, 0),
      ] },
    ],
  },
  {
    id: "path_zaklad_sily",
    cz: "Základ síly", en: "A base of strength",
    forWhom: ["Pro někoho, kdo má čas dvakrát týdně a chce, aby ho to opravdu posílilo.", "For somebody with two sessions a week who wants them to actually make them stronger."],
    builds: ["Sílu v pěti základních vzorech a schopnost přidávat.", "Strength in five basic patterns, and the habit of adding."],
    weeks: 8, daysPerWeek: 2, minutes: 55,
    equipment: ["telo", "zavazi", "lavice", "hrazda"],
    progressionRule: "double",
    boundary: ["Dvakrát týdně stačí na základ. Na víc než základ ne.", "Twice a week is enough for a base. It is not enough for more than a base."],
    days: [
      { cz: "A · tlak a dřep", en: "A · push and squat", blocks: [
        B("goblet", 4, { targetRepsMin: 5, targetRepsMax: 8 }, 150, { rirEnabled: true }),
        B("dbpress", 3, { targetRepsMin: 6, targetRepsMax: 10 }, 120, { rirEnabled: true }),
        B("dbrow", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("dbrdl", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("plank", 3, { targetDurationSec: 40 }, 45),
      ] },
      { cz: "B · tah a ohyb", en: "B · pull and hinge", blocks: [
        B("dbrdl", 4, { targetRepsMin: 5, targetRepsMax: 8 }, 150, { rirEnabled: true }),
        B("assistpullup", 3, { targetRepsMin: 5, targetRepsMax: 8, targetAssistance: 20 }, 120, { rirEnabled: true }),
        B("pushup", 3, { targetRepsMin: 6, targetRepsMax: 12 }, 90),
        B("bulgsplit", 3, { targetRepsMin: 8, targetRepsMax: 10 }, 90),
        B("suitcase", 2, { targetWeight: 16, targetDurationSec: 40 }, 60),
      ] },
    ],
  },
  {
    id: "path_cele_telo_3",
    cz: "Celé tělo · 3× týdně", en: "Full body · three days",
    forWhom: ["Pro někoho, kdo trénuje třikrát týdně a nechce dělit tělo na části.", "For somebody training three times a week who does not want to split the body up."],
    builds: ["Sílu, objem a poctivou frekvenci každého vzoru.", "Strength, volume, and an honest frequency for every pattern."],
    weeks: 10, daysPerWeek: 3, minutes: 60,
    equipment: ["telo", "zavazi", "cinka", "lavice", "hrazda", "stroj"],
    progressionRule: "double",
    boundary: ["Tři dny je dost práce. Čtvrtý den přidávej až po dvou měsících poctivé docházky.", "Three days is a lot of work. Add a fourth only after two honest months."],
    days: [
      { cz: "A", en: "A", blocks: [
        B("bbsquat", 3, { targetRepsMin: 5, targetRepsMax: 8 }, 180, { rirEnabled: true }),
        B("machinechestpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("chestsupprow", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("seatedlegcurl", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 75),
        B("plank", 3, { targetDurationSec: 45 }, 45),
      ] },
      { cz: "B", en: "B", blocks: [
        B("trapbardl", 3, { targetRepsMin: 4, targetRepsMax: 6 }, 210, { rirEnabled: true }),
        B("machineshoulderpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("assistpullup", 3, { targetRepsMin: 5, targetRepsMax: 8, targetAssistance: 15 }, 120),
        B("legext", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 75),
        B("suitcase", 3, { targetWeight: 20, targetDurationSec: 40 }, 60),
      ] },
      { cz: "C", en: "C", blocks: [
        B("legpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 150),
        B("dbpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("tbarrow", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("lyinglegcurl", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 75),
        B("revpecdeck", 3, { targetRepsMin: 12, targetRepsMax: 15 }, 45),
      ] },
    ],
  },
  {
    id: "path_zaklady_fitka",
    cz: "Základy fitka", en: "Learning the gym",
    forWhom: ["Pro někoho, kdo do posilovny teprve chodí a chce vědět, co se kterým strojem dělá.", "For somebody new to a gym who wants to know what each machine is for."],
    builds: ["Orientaci v posilovně, techniku na strojích a první sílu.", "Confidence in the room, technique on the machines, and a first base of strength."],
    weeks: 6, daysPerWeek: 3, minutes: 45,
    equipment: ["stroj", "kladka", "zavazi", "telo"],
    progressionRule: "double",
    boundary: ["Stroje jsou na naučení tvaru. Až tvar sedí, má smysl jít k činkám.", "Machines are for learning the shape. Once the shape holds, free weights make sense."],
    days: [
      { cz: "A · stroje", en: "A · machines", blocks: [
        B("legpress", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 120),
        B("machinechestpress", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 90),
        B("chestsupprow", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 90),
        B("legext", 2, { targetRepsMin: 12, targetRepsMax: 15 }, 60),
        B("seatedlegcurl", 2, { targetRepsMin: 12, targetRepsMax: 15 }, 60),
      ] },
      { cz: "B · kladky", en: "B · cables", blocks: [
        B("latpull", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 90),
        B("machineshoulderpress", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 90),
        B("cablerow", 3, { targetRepsMin: 10, targetRepsMax: 15 }, 90),
        B("cablelatraise", 2, { targetRepsMin: 12, targetRepsMax: 15 }, 45),
        B("standingcalfmachine", 2, { targetRepsMin: 12, targetRepsMax: 15 }, 60),
      ] },
      { cz: "C · činky", en: "C · free weights", blocks: [
        B("goblet", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 120),
        B("dbpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("dbrow", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("dbcurl", 2, { targetRepsMin: 10, targetRepsMax: 15 }, 60),
        B("plank", 2, { targetDurationSec: 40 }, 45),
      ] },
    ],
  },
  {
    id: "path_doma_vlastni_vaha",
    cz: "Domácí trénink s vlastní vahou", en: "Bodyweight at home",
    forWhom: ["Pro někoho, kdo trénuje doma a má k dispozici jen podlahu, stůl a kus gumy.", "For somebody training at home with a floor, a table and a band."],
    builds: ["Sílu bez vybavení a schopnost postoupit na těžší variantu.", "Strength without equipment and the ability to climb to a harder variant."],
    weeks: 8, daysPerWeek: 3, minutes: 35,
    equipment: ["telo", "guma"],
    progressionRule: "variant",
    boundary: ["Bez hrazdy nebo gumy chybí poctivý tah. Sežeň aspoň gumu.", "Without a bar or a band there is no honest pull. Get at least a band."],
    days: [
      { cz: "A · tlak", en: "A · push", blocks: [
        B("scap", 2, { targetReps: 10 }, 20),
        B("pushup", 4, { targetRepsMin: 5, targetRepsMax: 12 }, 90, { rirEnabled: true }),
        B("drep", 4, { targetRepsMin: 10, targetRepsMax: 20 }, 90),
        B("hollow", 3, { targetDurationSec: 25 }, 45),
        B("glutebridge", 3, { targetRepsMin: 12, targetRepsMax: 20 }, 45),
      ] },
      { cz: "B · tah", en: "B · pull", blocks: [
        B("bandpull", 2, { targetReps: 15 }, 20),
        B("bodyrow", 4, { targetRepsMin: 5, targetRepsMax: 12 }, 90, { rirEnabled: true }),
        B("lunge", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("sideplank", 3, { targetDurationSec: 25 }, 45),
        B("calfraise", 3, { targetRepsMin: 12, targetRepsMax: 20 }, 45),
      ] },
      { cz: "C · smíšený", en: "C · mixed", blocks: [
        B("inclpush", 3, { targetRepsMin: 8, targetRepsMax: 15 }, 60),
        B("bodyrow", 3, { targetRepsMin: 8, targetRepsMax: 15 }, 60),
        B("bulgsplit", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 60),
        B("deadbug", 3, { targetReps: 10 }, 30),
        B("act_walk", 1, { targetDurationSec: 1200 }, 0),
      ] },
    ],
  },
  {
    id: "path_kruhy",
    cz: "Kruhy a vlastní váha", en: "Rings and bodyweight",
    forWhom: ["Pro někoho, kdo má kruhy nebo hrazdu a chce se učit tvar, ne jen počty.", "For somebody with rings or a bar who wants to learn shape, not just numbers."],
    builds: ["Sílu v tahu, stabilitu ramene a kontrolu v podporu.", "Pulling strength, shoulder stability, and control in a support."],
    weeks: 10, daysPerWeek: 3, minutes: 50,
    equipment: ["telo", "kruhy", "hrazda"],
    progressionRule: "variant",
    boundary: ["Kruhy jsou k ramenům upřímné. Objem přidávej pomalu, lokty to poznají první.", "Rings are honest with a shoulder. Add volume slowly; the elbows notice first."],
    days: [
      { cz: "A · tah", en: "A · pull", blocks: [
        B("scap", 3, { targetReps: 8 }, 30),
        B("pullup", 4, { targetRepsMin: 3, targetRepsMax: 8 }, 150, { rirEnabled: true }),
        B("ringrow", 4, { targetRepsMin: 6, targetRepsMax: 12 }, 90),
        B("hang", 3, { targetDurationSec: 30 }, 60),
        B("hollow", 3, { targetDurationSec: 25 }, 45),
      ] },
      { cz: "B · tlak", en: "B · push", blocks: [
        B("ringsupport", 3, { targetDurationSec: 20 }, 90),
        B("dips", 4, { targetRepsMin: 3, targetRepsMax: 8 }, 150, { rirEnabled: true }),
        B("pushup", 3, { targetRepsMin: 8, targetRepsMax: 15 }, 90),
        B("pike", 3, { targetRepsMin: 5, targetRepsMax: 10 }, 90),
        B("plank", 3, { targetDurationSec: 45 }, 45),
      ] },
      { cz: "C · nohy a kontrola", en: "C · legs and control", blocks: [
        B("drep", 4, { targetRepsMin: 10, targetRepsMax: 20 }, 90),
        B("bulgsplit", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("nordic", 3, { targetRepsMin: 3, targetRepsMax: 6 }, 120),
        B("lsit", 3, { targetDurationSec: 15 }, 90),
        B("sideplank", 3, { targetDurationSec: 30 }, 45),
      ] },
    ],
  },
  {
    id: "path_mobilita_sila",
    cz: "Mobilita a síla", en: "Mobility and strength",
    forWhom: ["Pro někoho, kdo sedí a chce se hýbat líp, ne jen unést víc.", "For somebody who sits and wants to move better, not only carry more."],
    builds: ["Rozsah, kontrolu v tom rozsahu a sílu, která ho udrží.", "Range, control inside that range, and the strength to keep it."],
    weeks: 8, daysPerWeek: 3, minutes: 40,
    equipment: ["telo", "guma", "zavazi"],
    progressionRule: "range",
    boundary: ["Rozsah se přidává tolerancí a kontrolou, nikdy překonanou bolestí.", "Range grows through tolerance and control, never through pain pushed past."],
    days: [
      { cz: "A · kyčle", en: "A · hips", blocks: [
        B("couch", 2, { targetDurationSec: 60 }, 20),
        B("cossack", 3, { targetRepsMin: 6, targetRepsMax: 10 }, 60),
        B("goblet", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("glutebridge", 3, { targetRepsMin: 12, targetRepsMax: 20 }, 45),
        B("deadbug", 3, { targetReps: 10 }, 30),
      ] },
      { cz: "B · ramena a hrudní páteř", en: "B · shoulders and thoracic spine", blocks: [
        B("thoracicext", 2, { targetReps: 8 }, 20),
        B("disloc", 2, { targetReps: 10 }, 20),
        B("bandpull", 3, { targetRepsMin: 12, targetRepsMax: 20 }, 45),
        B("dbpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("sideplank", 3, { targetDurationSec: 30 }, 45),
      ] },
      { cz: "C · kotníky a nohy", en: "C · ankles and legs", blocks: [
        B("tibraise", 2, { targetReps: 15 }, 20),
        B("calfraise", 3, { targetRepsMin: 12, targetRepsMax: 20 }, 45),
        B("stepup", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 60),
        B("slrdl", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 60),
        B("act_walk", 1, { targetDurationSec: 1200 }, 0),
      ] },
    ],
  },
  {
    id: "path_stoj_na_rukou",
    cz: "Základy stoje na rukou", en: "First steps to a handstand",
    forWhom: ["Pro někoho, kdo se chce naučit stoj a má trpělivost na frekvenci místo výkonu.", "For somebody learning the handstand who has patience for frequency instead of performance."],
    builds: ["Rovnováhu, sílu ramene v obrácené poloze a klid při pádu.", "Balance, overhead strength upside down, and calm when it falls."],
    weeks: 12, daysPerWeek: 3, minutes: 30,
    equipment: ["telo", "zed"],
    progressionRule: "skill",
    boundary: ["Dovednost se trénuje odpočatá a krátce. Delší nerovná se lepší.", "A skill is practised fresh and briefly. Longer is not better."],
    days: [
      { cz: "A · zeď", en: "A · wall", blocks: [
        B("scap", 2, { targetReps: 10 }, 30),
        B("wallhs", 4, { targetDurationSec: 30 }, 90, { rirEnabled: false }),
        B("hollow", 3, { targetDurationSec: 30 }, 60),
        B("pike", 3, { targetRepsMin: 5, targetRepsMax: 10 }, 90),
      ] },
      { cz: "B · rovnováha", en: "B · balance", blocks: [
        B("wallwalk", 3, { targetReps: 3 }, 90),
        B("handstand", 5, { targetDurationSec: 15 }, 90),
        B("plank", 3, { targetDurationSec: 45 }, 45),
        B("bodyrow", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 60),
      ] },
      { cz: "C · síla nad hlavu", en: "C · overhead strength", blocks: [
        B("pike", 4, { targetRepsMin: 5, targetRepsMax: 10 }, 120),
        B("dbpress", 3, { targetRepsMin: 8, targetRepsMax: 12 }, 90),
        B("hang", 3, { targetDurationSec: 30 }, 60),
        B("hollow", 3, { targetDurationSec: 30 }, 45),
      ] },
    ],
  },
  {
    id: "path_kondice",
    cz: "Kondice bez zbytečného hluku", en: "Conditioning without the noise",
    forWhom: ["Pro někoho, kdo chce zlepšit dech a vytrvalost, aniž by z toho udělal závod.", "For somebody who wants better breath and endurance without turning it into a race."],
    builds: ["Základní vytrvalost, tempo, které se dá udržet, a schopnost zrychlit.", "A base of endurance, a pace you can hold, and the ability to lift it."],
    weeks: 8, daysPerWeek: 3, minutes: 40,
    equipment: ["prostor", "stroj"],
    progressionRule: "distance",
    boundary: ["Většina práce má být v tempu, u kterého se dá mluvit. Tvrdé dny jsou dva do týdne, ne pět.", "Most of it should be at a pace where you can talk. Hard days are two a week, not five."],
    days: [
      { cz: "A · klidné tempo", en: "A · easy pace", blocks: [
        B("act_walk", 1, { targetDurationSec: 600 }, 0),
        B("act_run", 1, { targetDistanceM: 4000, targetDurationSec: 1800 }, 0),
      ] },
      { cz: "B · intervaly", en: "B · intervals", blocks: [
        B("act_run", 1, { targetDistanceM: 1000, targetDurationSec: 420 }, 180),
        B("act_rowerg", 6, { targetDistanceM: 250, targetDurationSec: 60 }, 90),
        B("act_walk", 1, { targetDurationSec: 600 }, 0),
      ] },
      { cz: "C · delší a klidné", en: "C · long and calm", blocks: [
        B("act_bike", 1, { targetDistanceM: 20000, targetDurationSec: 3600 }, 0),
      ] },
    ],
  },
];

// The one row the path list needed and the library did not have under a
// name a path could reference. Written here as a substitution rather than
// as a new exercise, because inventing a card to make a path compile is
// exactly the kind of catalogue growth this rebuild is against.
const SUBSTITUTE = { catcow_or_thoracic: "cat" };

// Build real templates and a plan from a path. `resolve(exId)` returns the
// effective exercise record, so the template carries the exercise's own
// name, measurement type and rest rather than a guess.
export function buildPath(path, resolve, opts) {
  const o = opts || {};
  const templates = [];
  for (const day of path.days) {
    const blocks = [];
    for (const b of day.blocks) {
      const exId = SUBSTITUTE[b.exId] || b.exId;
      const rec = resolve ? resolve(exId) : null;
      if (!rec) continue;
      const restSec = b.restSec == null ? rec.defaultRestSec : b.restSec;
      const sets = [];
      for (let i = 0; i < (b.sets || 1); i++) {
        sets.push(makeSet(rec.measurementType, { type: "work", planned: b.planned, restSec: null }));
      }
      blocks.push(makeBlock({
        exId,
        name: [rec.displayCz, rec.displayEn],
        measurementType: rec.measurementType,
        restSec,
        rirEnabled: !!b.rirEnabled,
        focus: rec.focus,
        sets,
      }));
    }
    templates.push(makeTemplate({
      cz: path.cz + " · " + day.cz,
      en: path.en + " · " + day.en,
      shelf: path.id,
      aims: [],
      blocks,
    }));
  }

  const sessions = [];
  const weeks = o.weeks || path.weeks;
  for (let w = 1; w <= weeks; w++) {
    templates.forEach((t) => {
      sessions.push(makePlanSession({ w, templateId: t.id, date: "", effortTarget: 85 }));
    });
  }

  const plan = makePlan({
    cz: path.cz,
    en: path.en,
    intro: path.builds,
    goals: [],
    weeks,
    pathId: path.id,
    progressionRule: path.progressionRule,
    client: o.client || "",
    clientName: o.clientName || "",
    why: {
      aim: path.builds,
      who: path.forWhom,
      boundary: path.boundary,
      freq: [`${path.daysPerWeek}× týdně, ${weeks} týdnů.`, `${path.daysPerWeek} days a week for ${weeks} weeks.`],
      equip: [path.equipment.join(", "), path.equipment.join(", ")],
    },
    sessions,
  });

  return { plan, templates };
}

export const pathById = (id) => STARTER_PATHS.find((p) => p.id === id) || null;
export { nextId };
