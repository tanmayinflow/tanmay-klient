// Reviewed public-library corrections, 2026-10-02.
// Exact old values protect custom edits. This module is pure: it never persists
// data, adds exercises or touches logs, plans, history or collection flags.
// Sources: Reviews/muscle-map-2026-10-02/library-{text,links}-*.json.

function freezeData(value) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freezeData(child);
    Object.freeze(value);
  }
  return value;
}

// Coupled corrections keep all related before/after fields in one rule.
// Independent fields remain separate so a customized note does not block an
// unrelated exact correction to equipment or a progression link.
export const LIBRARY_REVIEW_CORRECTIONS = freezeData([
  {
    "id": "slrdl",
    "before": {
      "exe": [
        "Boky vzad, trup a zadní noha klesají v jedné linii. Do protažení hamstringu, pak boky vpřed a nahoru.",
        "Hips back, torso and rear leg lower in one line. Into the hamstring stretch, then hips forward and up."
      ]
    },
    "after": {
      "exe": [
        "Boky vzad, trup klesá vpřed a zadní noha se zvedá za tělem. Trup a zadní noha zůstávají v jedné linii. Do protažení hamstringu, pak zpět do stoje.",
        "Hinge the hips back as the torso lowers forward and the rear leg rises behind you. Keep the torso and rear leg in one line. Reach the hamstring stretch, then return to standing."
      ]
    }
  },
  {
    "id": "eccham",
    "before": {
      "exe": [
        "Pomalu vysunuj paty od sebe a drž boky nahoře co nejdéle. Když už most neudržíš, polož se a paty přitáhni zpět bez odporu.",
        "Slide the heels away slowly, holding the hips up as long as you can. When the bridge fails, set down and draw the heels back without resistance."
      ]
    },
    "after": {
      "exe": [
        "Pomalu vysunuj obě paty dopředu od hýždí a drž boky nahoře co nejdéle. Když už most neudržíš, polož se a paty přitáhni zpět bez odporu.",
        "Slide both heels forward away from the hips slowly, holding the hips up as long as you can. When the bridge fails, set down and draw the heels back without resistance."
      ]
    }
  },
  {
    "id": "jg_dandasana",
    "before": {
      "exe": [
        "Tlač paty od sebe, stehna dolů, temeno vzhůru.",
        "Press the heels away, thighs down, crown up."
      ]
    },
    "after": {
      "exe": [
        "Tlač paty dopředu, stehna dolů, temeno vzhůru.",
        "Press the heels forward, thighs down, crown up."
      ]
    }
  },
  {
    "id": "kr_mob_028",
    "before": {
      "pos": [
        "Opři dlaň o zeď ve výši ramene, paži nech nataženou. Pomalu otoč trup od paže, loket nezamykáním nepřetlačuj.",
        "Place the palm on a wall at shoulder height with the arm straight. Turn away gently without forcing the elbow into lockout."
      ]
    },
    "after": {
      "pos": [
        "Opři dlaň o zeď ve výši ramene, paži nech nataženou. Pomalu otoč trup od paže, loket nepropínej násilím.",
        "Place the palm on a wall at shoulder height with the arm straight. Turn away gently without forcing the elbow into lockout."
      ]
    }
  },
  {
    "id": "kr_mob_028",
    "before": {
      "exe": [
        "Opři dlaň o zeď ve výši ramene, paži nech nataženou. Pomalu otoč trup od paže, loket nezamykáním nepřetlačuj.",
        "Place the palm on a wall at shoulder height with the arm straight. Turn away gently without forcing the elbow into lockout."
      ]
    },
    "after": {
      "exe": [
        "Opři dlaň o zeď ve výši ramene, paži nech nataženou. Pomalu otoč trup od paže, loket nepropínej násilím.",
        "Place the palm on a wall at shoulder height with the arm straight. Turn away gently without forcing the elbow into lockout."
      ]
    }
  },
  {
    "id": "kr_mob_045",
    "before": {
      "cz": "Zápěstí v kleku s prsty k sobě"
    },
    "after": {
      "cz": "Zápěstí v kleku s prsty ke kolenům"
    }
  },
  {
    "id": "kr_mob_045",
    "before": {
      "foc": [
        "Zápěstí v kleku s prsty k sobě. Klidný dech, pohodlný rozsah.",
        "Backward-Facing Wrist Stretch. Easy breathing, comfortable range."
      ]
    },
    "after": {
      "foc": [
        "Zápěstí v kleku s prsty ke kolenům. Klidný dech, pohodlný rozsah.",
        "Backward-Facing Wrist Stretch. Easy breathing, comfortable range."
      ]
    }
  },
  {
    "id": "bbsquat",
    "before": {
      "wat": [
        "Kolena za špičkami, trup zpevněný proti čince. Technika před zátěží — pokaždé.",
        "Knees track the toes, torso braced against the bar. Technique before load — every time."
      ]
    },
    "after": {
      "wat": [
        "Kolena sledují směr špiček, trup zpevněný proti čince. Technika před zátěží, pokaždé.",
        "Knees track the toes, torso braced against the bar. Technique before load, every time."
      ]
    }
  },
  {
    "id": "vi_biceps",
    "before": {
      "wat": [
        "Programová šablona, ne jeden cvik. Trupem neškubej a zátěž volí tak, aby loket i zápěstí zůstaly bez bolesti.",
        "A programme template, not a single exercise. Do not jerk with the trunk, and choose a load that leaves elbow and wrist pain-free."
      ]
    },
    "after": {
      "wat": [
        "Programová šablona, ne jeden cvik. Trupem neškubej a zátěž vol tak, aby loket i zápěstí zůstaly bez bolesti.",
        "A programme template, not a single exercise. Do not jerk with the trunk, and choose a load that leaves elbow and wrist pain-free."
      ]
    }
  },
  {
    "id": "an_oadbbench",
    "before": {
      "wat": [
        "Bok se nezvedá z lavice. Když se zvedne, ubyla váha, ne série.",
        "The hip does not lift off the bench. If it does, the weight comes down, not the set."
      ]
    },
    "after": {
      "wat": [
        "Bok se nezvedá z lavice. Pokud se zvedá, uber zátěž.",
        "Keep the hip on the bench. If it lifts, reduce the load."
      ]
    }
  },
  {
    "id": "an_chainbench",
    "before": {
      "wat": [
        "Řetězy se nesmí rozhoupat. Když se houpou, ovládá cvik ona, ne ty.",
        "The chains must not swing. If they do, the lift is running you."
      ]
    },
    "after": {
      "wat": [
        "Řetězy drž klidné. Celý tlak veď kontrolovaně.",
        "Keep the chains steady and control the whole press."
      ]
    }
  },
  {
    "id": "extrot",
    "before": {
      "wat": [
        "Lehká guma. Tohle není silový cvik.",
        "A light band. This is not a strength exercise."
      ]
    },
    "after": {
      "wat": [
        "Použij lehkou gumu a drž pohyb pomalý a kontrolovaný.",
        "Use a light band and keep the movement slow and controlled."
      ]
    }
  },
  {
    "id": "highknees",
    "before": {
      "foc": [
        "Kolena zvedá střed těla, trup zůstává vysoký.",
        "The core lifts the knees; the torso stays tall."
      ]
    },
    "after": {
      "foc": [
        "Kolena zvedej střídavě před tělo. Trup drž vzpřímený a pánev stabilní.",
        "Lift the knees alternately in front of you. Keep the torso tall and the pelvis steady."
      ]
    }
  },
  {
    "id": "flraise",
    "before": {
      "foc": [
        "Propnuté tělo stoupá z visu do leveru silou lopatek.",
        "The straight body rises from the hang to the lever on shoulder-blade strength."
      ]
    },
    "after": {
      "foc": [
        "Tahem propnutých paží zvedej zpevněné tělo z visu do leveru.",
        "Pull through straight arms to raise the braced body from the hang into the lever."
      ]
    }
  },
  {
    "id": "headstand",
    "before": {
      "exe": [
        "Kolena na lokty, najdi rovnováhu, pak pomalu natáhni nohy vzhůru.",
        "Knees onto the elbows, find balance, then extend the legs slowly upward."
      ]
    },
    "after": {
      "exe": [
        "Zvedni boky, přejdi po špičkách blíž a pomalu zvedni nohy. Tlač předloktími do země.",
        "Lift the hips, walk the feet closer and slowly raise the legs. Press the forearms into the floor."
      ]
    }
  },
  {
    "id": "headstand",
    "before": {
      "wat": [
        "Krk se nehýbe — když cítíš tlak v krku, dolů. Pád řeš kotoulem.",
        "The neck never moves — pressure in the neck means come down. A fall becomes a roll."
      ]
    },
    "after": {
      "wat": [
        "Krkem během výdrže nehýbej. Při nepříjemném tlaku v krku se kontrolovaně vrať dolů. Vstup i výstup nacvič s učitelem.",
        "Keep the neck still during the hold. If you feel uncomfortable neck pressure, lower with control. Practise entering and leaving the pose with a teacher."
      ]
    }
  },
  {
    "id": "wallpush",
    "before": {
      "wat": [
        "Boky se nelámou, paty mohou ze země. První cvik po zranění i první cvik vůbec.",
        "Hips never fold; heels may lift. The first exercise after injury — and often the first ever."
      ]
    },
    "after": {
      "wat": [
        "Boky se nelámou, paty mohou ze země. Vzdálenost od zdi uprav tak, abys pohyb ovládal.",
        "Keep the hips in line; heels may lift. Adjust your distance from the wall so you can control the movement."
      ]
    }
  },
  {
    "id": "facepull",
    "before": {
      "wat": [
        "Ramena nelezou k uším. Malá váha, čistý pohyb — tohle je zdraví ramen.",
        "Shoulders stay away from the ears. Light load, clean movement — this is shoulder health."
      ]
    },
    "after": {
      "wat": [
        "Ramena nelezou k uším. Použij lehký odpor a kontrolovaný pohyb.",
        "Keep the shoulders away from the ears. Use light resistance and controlled movement."
      ]
    }
  },
  {
    "id": "scapush",
    "before": {
      "wat": [
        "Zdraví ramen pro každý tlak i stoj na rukou. Boky se nehýbou.",
        "Shoulder health for every press and handstand. The hips never move."
      ]
    },
    "after": {
      "wat": [
        "Lokty drž propnuté a boky nehybné. Pohyb je malý a kontrolovaný.",
        "Keep the elbows straight and the hips still. Use a small, controlled movement."
      ]
    }
  },
  {
    "id": "clamshell",
    "before": {
      "wat": [
        "Základ zdravých kyčlí a kolen — fyzioterapeutická klasika. Pomalu a přesně.",
        "The floor of healthy hips and knees — a physiotherapy classic. Slow and precise."
      ]
    },
    "after": {
      "wat": [
        "Pohyb veď pomalu. Paty drž u sebe a trup neotáčej dozadu.",
        "Move slowly. Keep the heels together and avoid rolling the torso backward."
      ]
    }
  },
  {
    "id": "kneecars",
    "before": {
      "wat": [
        "Kyčel klidná, pohyb jen v koleni. Chrání koleno pro dřepy a skoky.",
        "The hip is quiet, the movement only at the knee. It protects the knee for squats and jumps."
      ]
    },
    "after": {
      "wat": [
        "Kyčel drž klidnou. Pohyb veď pomalu a bez násilí do krajní polohy.",
        "Keep the hip quiet. Move slowly without forcing the end range."
      ]
    }
  },
  {
    "id": "atgsplit",
    "before": {
      "wat": [
        "Pata nesmí letět nahoru — radši menší hloubka. Zdraví kolen se staví tady.",
        "The heel must not lift — take less depth instead. Knee health is built here."
      ]
    },
    "after": {
      "wat": [
        "Přední patu drž opřenou. Pokud se zvedá, zmenši hloubku.",
        "Keep the front heel supported. Reduce the depth if it lifts."
      ]
    }
  },
  {
    "id": "banddip",
    "before": {
      "ez": "benchdips"
    },
    "after": {
      "ez": null
    }
  },
  {
    "id": "an_boxdeadlift",
    "before": {
      "ez": "deadlift",
      "hd": null
    },
    "after": {
      "ez": null,
      "hd": "deadlift"
    },
    "group": "coupled"
  },
  {
    "id": "an_sumodeadlift",
    "before": {
      "ez": "deadlift"
    },
    "after": {
      "ez": null
    }
  },
  {
    "id": "bridge",
    "before": {
      "S": 1,
      "C": 1,
      "ez": "glutebridge"
    },
    "after": {
      "S": 4,
      "C": 2,
      "ez": null
    },
    "group": "coupled"
  },
  {
    "id": "kr_mob_018",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  },
  {
    "id": "kr_mob_020",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  },
  {
    "id": "kr_mob_024",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  },
  {
    "id": "kr_mob_028",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  },
  {
    "id": "kr_mob_092",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  },
  {
    "id": "kr_mob_096",
    "before": {
      "eq": [
        "telo",
        "lavice"
      ]
    },
    "after": {
      "eq": [
        "telo",
        "zed"
      ]
    }
  }
]);

const byId = new Map();
for (const correction of LIBRARY_REVIEW_CORRECTIONS) {
  const existing = byId.get(correction.id) || [];
  existing.push(correction);
  byId.set(correction.id, existing);
}

function sameValue(a, b) {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length
      && a.every((value, index) => sameValue(value, b[index]));
  }
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length
    && keys.every(key => Object.prototype.hasOwnProperty.call(b, key) && sameValue(a[key], b[key]));
}

function copyValue(value) {
  if (Array.isArray(value)) return value.map(copyValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, copyValue(child)]));
  return value;
}

export function applyLibraryReview(ex) {
  if (!ex || typeof ex !== "object" || Array.isArray(ex)) return ex;
  const corrections = byId.get(ex.id);
  if (!corrections) return ex;
  let reviewed = ex;
  for (const { before, after } of corrections) {
    if (!Object.entries(before).every(([field, value]) => sameValue(reviewed[field], value))) continue;
    if (Object.entries(after).every(([field, value]) => sameValue(reviewed[field], value))) continue;
    if (reviewed === ex) reviewed = { ...ex };
    for (const [field, value] of Object.entries(after)) reviewed[field] = copyValue(value);
  }
  return reviewed;
}

export function reviewLibraryCollection(coll) {
  if (!coll || typeof coll !== "object" || Array.isArray(coll) || !Array.isArray(coll.tEx)) return coll;
  let changed = false;
  const exercises = coll.tEx.map(ex => {
    const reviewed = applyLibraryReview(ex);
    if (reviewed !== ex) changed = true;
    return reviewed;
  });
  return changed ? { ...coll, tEx: exercises } : coll;
}

// The archived plates show a different pose: one-leg pigeon instead of the
// kneeling backbend, and a seated legs-behind-head pose instead of the supine one.
export function isUnverifiedIllustration(ex) {
  return ex?.id === "jg_kapotasana" || ex?.id === "jg_yoganidrasana";
}
