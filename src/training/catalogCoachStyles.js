// Public cards used by the November training plans, in both application catalogues.
export const COACH_STYLE_EXERCISES = [
  {
    id: "ringfly", cz: "Rozpažování na kruzích", en: "Ring fly", pat: "tlak", eq: ["kruhy"],
    mp: ["che"], ms: ["sho", "abs"], S: 3, C: 3, J: { ram: 2 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "chest_fly", ez: "ringpush", hd: null,
    foc: ["Udrž stejný úhel v loktech.", "Keep the elbow angle steady."],
    pos: ["Ve šikmém vzporu drž kruhy pod rameny, lokty lehce pokrčené.", "Take an inclined plank with the rings under your shoulders and elbows soft."],
    exe: ["Rozveď kruhy do stran a přitáhni je k sobě před hrudníkem. Trup a nohy se pohybují společně.", "Open the rings to the sides and bring them together in front of your chest. Move your trunk and legs as one."],
    wat: ["Otevírej paže jen tak daleko, odkud je dokážeš plynule vrátit.", "Open only as far as you can return smoothly."],
    pro: ["Začni se vzpřímenějším tělem. Pro větší zatížení postupně sniž kruhy.", "Start more upright. Lower the rings gradually to increase the load."]
  },
  {
    id: "ringrtopush", cz: "Klik na kruzích s vytočením ven", en: "Rings-turned-out push-up", pat: "tlak", eq: ["kruhy"],
    mp: ["che", "tri"], ms: ["sho", "abs"], S: 3, C: 3, J: { ram: 2, lok: 1 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "push_horizontal", ez: "ringpush", hd: null,
    foc: ["Vytoč kruhy až nahoře.", "Turn the rings out at the top."],
    pos: ["Zaujmi vzpor s dlaněmi proti sobě a kruhy pod rameny.", "Start in a plank, palms facing each other and rings under the shoulders."],
    exe: ["Spusť hrudník mezi kruhy. Vytlač se nahoru, propni paže a otoč dlaně dopředu. Před dalším klikem vrať úchop.", "Lower your chest between the rings. Press up, straighten your arms and rotate your palms forward. Reset the grip for the next rep."],
    wat: ["Drž kruhy blízko těla a pánev v linii s trupem.", "Keep the rings close and your hips in line with your trunk."],
    pro: ["Začni klikem bez vytočení nebo dej kruhy výš. Ztížit ho můžeš krátkou výdrží nahoře.", "Start without the turnout or set the rings higher. Add a short pause in the turned-out position."]
  },
  {
    id: "ringrtosupport", cz: "Vzpor na kruzích s vytočením ven", en: "Rings-turned-out support hold", pat: "tlak", eq: ["kruhy"],
    mp: ["tri", "sho"], ms: ["che", "abs"], S: 3, C: 4, J: { ram: 2, lok: 2 }, mode: "sec", measurementType: "DURATION",
    family: "ring_support", ez: "ringsupport", hd: null,
    foc: ["Kruhy drž vedle boků.", "Keep the rings beside your hips."],
    pos: ["Nastav kruhy tak, aby ses mohl z opory nohou dostat do vzporu.", "Set the rings so you can enter support with help from your feet."],
    exe: ["Propni paže, oddal ramena od uší a vytoč dlaně dopředu. Zvedni chodidla a měř čas ve stabilní poloze.", "Straighten your arms, keep your shoulders away from your ears and turn your palms forward. Lift your feet and time the steady hold."],
    wat: ["Výdrž ukonči dřív, než se kruhy rozjedou do stran.", "End the hold before the rings drift apart."],
    pro: ["Začni ve vzporu s neutrálním úchopem. Ve vytočení nejdřív uber oporu chodidel, pak prodluž výdrž.", "Start in neutral ring support. With the rings turned out, reduce foot support first, then extend the hold."]
  },
  {
    id: "ringfacepull", cz: "Přítah k obličeji na kruzích", en: "Ring face pull", pat: "tah", eq: ["kruhy"],
    mp: ["sho", "rcuff"], ms: ["upb", "bic"], S: 2, C: 2, J: { ram: 2 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "face_pull", ez: "ringrow", hd: null,
    foc: ["Veď ruce po stranách čela.", "Pull your hands to either side of your forehead."],
    pos: ["Drž kruhy před sebou a zakloň celé tělo do šikmé linie.", "Hold the rings in front of you and lean back in a straight line."],
    exe: ["Táhni lokty vysoko do stran, ruce přitáhni k čelu a pomalu natáhni paže.", "Draw your elbows out and high, bring the rings towards your forehead, then slowly straighten your arms."],
    wat: ["Hlavu nech v prodloužení trupu.", "Keep your head in line with your torso."],
    pro: ["Vzpřímenější postoj ubere zátěž. Pro těžší přítah posuň chodidla blíž pod závěs.", "Stand more upright to reduce load. Walk your feet towards the anchor to make it harder."]
  },
  {
    id: "ringrevfly", cz: "Rozpažování vzad na kruzích", en: "Ring reverse fly", pat: "tah", eq: ["kruhy"],
    mp: ["sho", "upb"], ms: ["tra", "rcuff"], S: 2, C: 3, J: { ram: 2 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "reverse_fly", ez: "ringrow", hd: null,
    foc: ["Otevři paže do písmene T.", "Open your arms into a T."],
    pos: ["V mírném záklonu drž kruhy před rameny. Paže jsou téměř propnuté.", "Lean back slightly with the rings in front of your shoulders and arms nearly straight."],
    exe: ["Rozveď paže do stran a přitáhni tělo vpřed. Stejnou drahou se pomalu vrať.", "Spread your arms to draw your body forward. Return slowly along the same path."],
    wat: ["Udrž úhel v loktech a nezvedej ramena k uším.", "Keep your elbow angle steady and shoulders away from your ears."],
    pro: ["Začni téměř ve stoji. Čím níž tělo spustíš, tím větší zátěž poneseš.", "Begin nearly upright. A lower body angle increases the load."]
  },
  {
    id: "wchinup", cz: "Shyb podhmatem se zátěží", en: "Weighted chin-up", pat: "tah", eq: ["hrazda", "zavazi"],
    mp: ["lat", "bic"], ms: ["upb", "fore"], S: 4, C: 2, J: { ram: 2, lok: 2 }, mode: "reps", load: "add", measurementType: "ADDED_WEIGHT_REPS",
    family: "pull_vertical", ez: "chinup", hd: null,
    foc: ["Zapisuj jen přidanou hmotnost.", "Record the added weight only."],
    pos: ["Připevni zátěž na opasek. Uchop hrazdu podhmatem a nech závaží ustálit ve volném prostoru pod sebou.", "Secure the weight to a dip belt. Take an underhand grip and let the weight settle with clear space below."],
    exe: ["Z plného visu se přitáhni bradou nad hrazdu. Plynule se spusť do natažených paží.", "From a full hang, pull your chin above the bar. Lower under control to straight arms."],
    wat: ["Nešvihej nohama a nevytahuj bradu záklonem hlavy.", "Keep your legs still and your neck neutral."],
    pro: ["Začni shybem podhmatem bez zátěže. Přidávej po malých krocích při stejném rozsahu.", "Start with a bodyweight chin-up. Add small increments while keeping the same range."]
  },
  {
    id: "pikeelev", cz: "Pike klik s nohama na lavici", en: "Feet-elevated pike push-up", pat: "tlak", eq: ["lavice"],
    mp: ["sho", "tri"], ms: ["serr", "abs"], S: 3, C: 3, J: { ram: 2, zap: 2 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "push_vertical", ez: "pike", hd: "wallhspu",
    foc: ["Přenes boky nad ramena.", "Stack your hips over your shoulders."],
    pos: ["Polož chodidla na stabilní lavici a dlaně na podlahu. Zvedni boky.", "Place your feet on a stable bench and hands on the floor. Raise your hips."],
    exe: ["Pokrč lokty, veď hlavu mírně před dlaně a vytlač se zpět do propnutých paží.", "Bend your elbows, lower your head slightly ahead of your hands and press back to straight arms."],
    wat: ["Pohyb zastav dřív, než hlava ponese váhu.", "Reverse the movement before your head bears weight."],
    pro: ["Lehčí je pike klik s chodidly na zemi. Dalším stupněm je klik ve stoji na rukou u zdi.", "Start with a floor pike push-up. The next progression is a wall handstand push-up."]
  },
  {
    id: "bodyrowelev", cz: "Australské přítahy s nohama na lavici", en: "Feet-elevated body row", pat: "tah", eq: ["hrazda", "lavice"],
    mp: ["lat", "upb"], ms: ["bic", "sho", "abs"], S: 3, C: 2, J: { ram: 2, lok: 1 }, mode: "reps", measurementType: "BODYWEIGHT_REPS",
    family: "pull_horizontal", ez: "bodyrow", hd: "archrow",
    foc: ["Přitáhni spodní část hrudníku k hrazdě.", "Draw your lower chest towards the bar."],
    pos: ["Lehni si pod pevnou nízkou hrazdu, uchop ji a opři paty o lavici. Srovnej tělo do vodorovné linie.", "Lie under a fixed low bar, grip it and set your heels on a bench. Align your body horizontally."],
    exe: ["Přitáhni hrudník k hrazdě a pomalu se vrať do natažených paží.", "Pull your chest towards the bar and lower to straight arms under control."],
    wat: ["Boky cestují s hrudníkem. Lavice musí stát pevně.", "Move your hips with your chest. Keep the bench steady."],
    pro: ["Lehčí přítah má chodidla na zemi. Pro další stupeň přenášej víc práce na jednu paži při archer přítahu.", "Start with feet on the floor. Progress to archer rows to shift more work to one arm."]
  },
  {
    id: "pancakegm", cz: "Předklon v roznoženém sedu se zátěží", en: "Pancake good morning", pat: "ohyb", eq: ["telo", "zavazi"],
    mp: ["add", "ham"], ms: ["low", "glu"], S: 2, C: 2, J: { kyc: 2 }, mode: "reps", measurementType: "BODYWEIGHT_REPS", sideMode: "none",
    family: "straddle_hinge", ez: "pancake", hd: null,
    foc: ["Předkloň se pohybem v obou kyčlích.", "Hinge forward at both hips."],
    pos: ["Sedni do pohodlného roznožení a přidrž lehké závaží u hrudníku.", "Sit in a comfortable straddle with a light weight at your chest."],
    exe: ["S dlouhými zády nakloň pánev a trup vpřed. Zastav v ovládaném rozsahu a vrať se do sedu.", "Tilt the pelvis and torso forwards with a long spine. Pause within your controlled range and return upright."],
    wat: ["Zátěž tě nemá stáhnout hlouběji, než se dokážeš vlastní silou vrátit.", "Use a load and depth you can reverse under your own control."],
    pro: ["Začni bez zátěže nebo na složené podložce pod pánví. Postupně zvětši rozsah a teprve pak zátěž.", "Start unloaded or elevate your hips on a folded mat. Increase range before adding load."]
  },
  {
    id: "elevbridge", cz: "Most na rukou s nohama na lavici", en: "Feet-elevated bridge", pat: "mobilita", eq: ["lavice"],
    mp: ["sho", "glu", "low"], ms: ["tri", "qua"], S: 3, C: 3, J: { ram: 2, zap: 2, pat: 2 }, mode: "sec", measurementType: "DURATION",
    family: "gymnastic_bridge", ez: null, hd: "fullbridge",
    foc: ["Udrž oporu obou dlaní i chodidel.", "Keep both palms and both feet firmly supported."],
    pos: ["Lehni na záda s chodidly na zajištěné lavici a dlaněmi vedle uší, prsty směrem k ramenům.", "Lie on your back, feet on a secured bench and hands beside your ears, fingers towards your shoulders."],
    exe: ["Zatlač chodidly a dlaněmi, zvedni pánev a hrudník a propni paže v rozsahu, který ovládáš. Výdrž ukonči pomalým návratem.", "Press through your feet and palms, lift hips and chest and straighten your arms within your controlled range. Lower slowly after the hold."],
    wat: ["Lavice nesmí klouzat. Váhu nesou ruce a chodidla, hlava zůstává volná.", "Secure the bench against sliding. Let your hands and feet carry the load and keep your head clear."],
    pro: ["Začni kratší výdrží v menším rozsahu. Když oporu udržíš, postupně sniž podložení chodidel směrem k mostu ze země.", "Start with a shorter hold in a smaller range. Lower your foot support gradually towards a floor bridge."]
  },
  {
    id: "fullbridge", cz: "Most na rukou", en: "Full bridge", pat: "mobilita", eq: ["telo"],
    mp: ["sho", "glu", "low"], ms: ["tri", "qua"], S: 3, C: 3, J: { ram: 2, zap: 2, pat: 2 }, mode: "sec", measurementType: "DURATION",
    family: "gymnastic_bridge", ez: "elevbridge", hd: null,
    foc: ["Rozlož oporu mezi dlaně a chodidla.", "Distribute support between hands and feet."],
    pos: ["Lehni na záda, pokrč kolena a polož dlaně vedle uší prsty směrem k ramenům.", "Lie on your back with knees bent and place your palms beside your ears, fingers towards the shoulders."],
    exe: ["Tlakem do země zvedni pánev i hrudník a vytlač se na propnuté paže. Klidně dýchej, měř výdrž a potom se pomalu polož.", "Press the floor away, lift your hips and chest and straighten your arms. Breathe steadily, time the hold, then lower slowly."],
    wat: ["Hlava zůstává bez zatížení. Drž jen polohu, ze které se dokážeš vrátit plynule.", "Keep weight off your head. Hold only a position you can lower from smoothly."],
    pro: ["Začni s chodidly na lavici. Na zemi nejdřív ustal polohu a potom po malých krocích prodlužuj výdrž.", "Start with feet elevated on a bench. On the floor, establish a steady position before adding time."]
  }
];

// Correct only known catalogue defaults. Leave custom names, deleted cards and logs alone.
const dipNames = {
  dips: ["Kliky na bradlech", "Dipy"],
  ex26_weighted_dip: ["Klik na bradlech se zátěží", "Dipy se zátěží"],
  ringdips: ["Kliky na kruzích", "Dipy na kruzích"],
  faq_foot_dip: ["Klik na bradlech s oporou nohou", "Dip s oporou nohou"],
  faq_dip_negative: ["Pomalé spouštění na bradlech", "Dip · pomalé spouštění"],
  banddip: ["Klik na bradlech s dopomocí gumy", "Dip s dopomocí gumy"],
  benchdips: ["Kliky za tělem", "Dipy o lavici"]
};

export function reviewedDipName(id, name) {
  const rename = dipNames[id];
  return rename && name === rename[0] ? rename[1] : name;
}

export function seedCoachStyleExercises(collection, roleSeeds = COACH_STYLE_EXERCISES) {
  if (!collection || collection.coachStyleCatalog20261120) return collection;
  const rows = collection.tEx || [];
  const have = new Set(rows.map(row => row.id));
  const seeds = new Map(roleSeeds.map(row => [row.id, row]));
  const additions = COACH_STYLE_EXERCISES.filter(row => !have.has(row.id))
    .map(row => structuredClone(seeds.get(row.id) || row));
  const reviewed = rows.map(row => {
    if (row.custom) return row;
    const cz = reviewedDipName(row.id, row.cz);
    if (cz !== row.cz) return { ...row, cz };
    if (row.id === "activehang" && row.pat === "mobilita" && row.cz === "Aktivní vis") return { ...row, pat: "tah" };
    return row;
  });
  return { ...collection, tEx: [...reviewed, ...additions], coachStyleCatalog20261120: true };
}

export const COACH_STYLE_META = Object.fromEntries(COACH_STYLE_EXERCISES.map(row => {
  const role = row.pat === "mobilita" || row.id === "pancakegm" ? "mobility" : "strength";
  return [row.id, { t: "extended", s: "active", g: "explicit", r: role, b: role, f: row.family, src: "tanmay" }];
}));
