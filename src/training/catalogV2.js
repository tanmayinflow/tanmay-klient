// ======================================================================
// TRAINING V2 · the practical additions
// ----------------------------------------------------------------------
// Exercises the library was missing for ordinary work with people in an
// ordinary gym, plus the activity family. They are NOT part of the
// Movement Atlas master list: they carry new stable ids, they are
// appended after the original 485, and nothing here renumbers or renames
// anything that came before.
//
// Every row was checked against the live library first — by id, by name
// in both languages and by meaning. Where a general card already existed
// it got a family and an alias instead of a duplicate. Where the general
// card was hidden behind somebody's programme it was promoted, not
// copied.
//
// The rule for earning a card of its own: a different way of measuring,
// a different piece of equipment, a different technique, a different
// range, a different stimulus, a different safety profile, a separate
// performance history, a separate progression, or a different coaching
// instruction. A grip change on its own is a variant, not a card.
// ======================================================================

// ---- LOWER BODY · GYM ------------------------------------------------
const LOWER = [
  { id: "trapbardl", cz: "Mrtvý tah s trap tyčí", en: "Trap-Bar Deadlift", pat: "ohyb", S: 4, C: 2, J: { kyc: 2, pat: 2 }, pop: 3, eq: ["cinka"], mode: "reps", mp: ["glu", "qua", "ham"], ms: ["low", "upb", "fore"], dot: [96, 124], ez: "an_dbdeadlift", hd: "deadlift",
    foc: ["Tlač nohama do země, ruce jen drží.", "Drive through the floor. The hands only hold."],
    pos: ["Stoj uvnitř tyče, chodidla na šířku boků. Úchop uprostřed madel.", "Stand inside the bar, feet hip-width. Grip the handles at their middle."],
    exe: ["Boky dolů, hrudník vztyčený. Vstávej tlakem do podlahy. Nahoře stůj, nezaklánej se.", "Hips down, chest tall. Stand up by pushing the floor away. Stand at the top, do not lean back."],
    wat: ["Tyč se drží u těla sama. Záda drží tvar celou dobu.", "The bar stays close on its own. The back keeps its shape the whole way."],
    pro: ["Rovnější dráha a méně nároku na bedra než u přímé osy. Odtud se dá přejít na klasický mrtvý tah.", "A straighter path and less demand on the low back than a straight bar. From here the classic deadlift is the next step."] },

  { id: "legext", cz: "Předkopávání na stroji", en: "Leg Extension Machine", pat: "drep", S: 2, C: 1, J: { kol: 2 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["qua"], ms: [], dot: [120, 118], ez: null, hd: null,
    foc: ["Poslední kus nahoře je celý cvik.", "The last stretch at the top is the whole exercise."],
    pos: ["Sed opřený, osa kolena v ose stroje, váleček nad kotníkem.", "Sit back, knee axis on the machine's axis, pad above the ankle."],
    exe: ["Propni kolena, nahoře krátce zadrž. Zpět pomalu, bez dopadu závaží.", "Extend the knees, hold briefly at the top. Return slowly, without dropping the stack."],
    wat: ["Neškubej zády. Kolena nemusí do úplného zámku, když to tlačí.", "Do not jerk with the back. The knees need not lock if that pinches."] },

  { id: "seatedlegcurl", cz: "Zakopávání vsedě", en: "Seated Leg Curl", pat: "ohyb", S: 2, C: 1, J: { kol: 2 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["ham"], ms: ["cal"], dot: [126, 140], ez: null, hd: null,
    foc: ["Kyčel zůstává ohnutá. Tam hamstring pracuje jinak než vleže.", "The hip stays flexed. That is where the hamstring works differently from lying."],
    pos: ["Sed s opřenými zády, váleček nad patami, boky zajištěné.", "Sit with the back supported, pad above the heels, hips secured."],
    exe: ["Zakop pod sebe, dole krátce zadrž. Zpět pomalu do napnutí.", "Curl underneath you, pause briefly. Return slowly into the stretch."],
    wat: ["Boky se nezvedají. Krk uvolněný.", "The hips stay down. The neck stays soft."],
    pro: ["Vsedě a vleže mají vlastní historii. Sleduj je zvlášť.", "Seated and lying keep separate histories. Track them apart."] },

  { id: "lyinglegcurl", cz: "Zakopávání vleže", en: "Lying Leg Curl", pat: "ohyb", S: 2, C: 1, J: { kol: 2 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["ham"], ms: ["cal"], dot: [128, 146], ez: null, hd: "nordic",
    foc: ["Boky zůstávají na opoře celou sérii.", "The hips stay on the pad for the whole set."],
    pos: ["Leh na břiše, váleček nad patami, madla v rukou.", "Lie face down, pad above the heels, handles in the hands."],
    exe: ["Zakop k hýždím, nahoře krátce zadrž. Zpět pomalu.", "Curl toward the glutes, pause briefly at the top. Return slowly."],
    wat: ["Pánev se nezvedá. Když se zvedá, ubrat váhu.", "The pelvis does not lift. If it lifts, take weight off."] },

  { id: "hacksquat", cz: "Hack dřep na stroji", en: "Hack Squat Machine", pat: "drep", S: 3, C: 1, J: { kol: 2, kot: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["qua", "glu"], ms: ["ham", "cal"], dot: [114, 116], ez: "legpress", hd: "bbsquat",
    foc: ["Záda po celou dobu na opoře.", "The back stays on the pad throughout."],
    pos: ["Chodidla na šířku boků uprostřed plošiny, ramena pod polstry.", "Feet hip-width in the middle of the platform, shoulders under the pads."],
    exe: ["Dolů do rozsahu, který drží záda na opoře. Nahoru tlakem přes celé chodidlo.", "Down as far as the back stays on the pad. Up by pushing through the whole foot."],
    wat: ["Kolena sledují špičky. Nezamykej je nahoře natvrdo.", "Knees track the toes. Do not slam them into lockout."] },

  { id: "beltsquat", cz: "Dřep s pásem", en: "Belt Squat", pat: "drep", S: 3, C: 1, J: { kol: 2 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["qua", "glu"], ms: ["ham"], dot: [112, 114], ez: "legpress", hd: null,
    foc: ["Zátěž visí na bocích, ne na ramenou.", "The load hangs from the hips, not from the shoulders."],
    pos: ["Stoj na plošinách, pás kolem boků, ruce na madlech.", "Stand on the platforms, belt around the hips, hands on the handles."],
    exe: ["Dřep do svého rozsahu, nahoru přes chodidla.", "Squat to your range, stand up through the feet."],
    wat: ["Trup zůstává vzpřímený. Rozsah volí kyčel, ne váha.", "The torso stays upright. The hip chooses the range, not the load."] },

  { id: "pendulumsquat", cz: "Kyvadlový dřep", en: "Pendulum Squat", pat: "drep", S: 3, C: 1, J: { kol: 2, kot: 1 }, pop: 1, eq: ["stroj"], mode: "reps", mp: ["qua", "glu"], ms: ["ham"], dot: [110, 118], ez: "legpress", hd: null,
    foc: ["Dráha je daná. Ty řídíš jen tempo.", "The path is given. You only control the tempo."],
    pos: ["Chodidla na plošině, záda na opoře, ramena pod polstry.", "Feet on the platform, back on the pad, shoulders under the pads."],
    exe: ["Dolů pomalu do plného rozsahu, nahoru bez trhnutí.", "Down slowly into full range, up without a jerk."],
    wat: ["Pata drží plošinu. Když se zvedá, posuň chodidla výš.", "The heel keeps the platform. If it lifts, move the feet higher."] },

  { id: "hipabduction", cz: "Abdukce kyčlí na stroji", en: "Hip Abduction Machine", pat: "drep", S: 1, C: 1, J: { kyc: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["glu"], ms: [], dot: [122, 130], ez: null, hd: null,
    foc: ["Roztlač kolena od sebe, trup zůstane klidný.", "Push the knees apart. The torso stays still."],
    pos: ["Sed, opřená záda, polstry na vnější straně kolen.", "Sit with the back supported, pads on the outside of the knees."],
    exe: ["Roztlač do rozsahu, krátce zadrž, pomalu zpět.", "Push out to range, hold briefly, return slowly."],
    wat: ["Neodrážej se zády. Rozsah je malý, a to je v pořádku.", "Do not bounce off the backrest. The range is small, and that is fine."] },

  { id: "hipadduction", cz: "Addukce kyčlí na stroji", en: "Hip Adduction Machine", pat: "drep", S: 1, C: 1, J: { kyc: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["add"], ms: [], dot: [118, 134], ez: null, hd: null,
    foc: ["Stahuj kolena k sobě, ne dechem, ale nohama.", "Draw the knees together with the legs, not with the breath."],
    pos: ["Sed, opřená záda, polstry na vnitřní straně kolen.", "Sit with the back supported, pads on the inside of the knees."],
    exe: ["Stáhni k sobě, krátce zadrž, pomalu zpět do napnutí.", "Squeeze together, hold briefly, return slowly into the stretch."],
    wat: ["Rozsah zpět jen tam, kde třísla nezačnou tahat ostře.", "Only open as far as the groin stays free of a sharp pull."] },

  { id: "seatedcalf", cz: "Výpon vsedě", en: "Seated Calf Raise", pat: "drep", S: 1, C: 1, J: { kot: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["cal"], ms: [], dot: [130, 156], ez: null, hd: null,
    foc: ["S pokrčeným kolenem pracuje jiná část lýtka než ve stoje.", "With the knee bent a different part of the calf works than standing."],
    pos: ["Sed, polstry na stehnech, špičky na hraně, paty volné.", "Sit with pads on the thighs, toes on the edge, heels free."],
    exe: ["Nahoru na plnou špičku, krátce zadrž. Dolů pomalu do protažení.", "Up onto the toes, hold briefly. Down slowly into the stretch."],
    wat: ["Nehoupej se. Nahoře i dole krátká pauza.", "Do not bounce. A brief pause at the top and at the bottom."] },

  { id: "standingcalfmachine", cz: "Výpon ve stroji", en: "Standing Calf Raise Machine", pat: "drep", S: 2, C: 1, J: { kot: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["cal"], ms: [], dot: [128, 152], ez: "calfraise", hd: null,
    foc: ["Koleno zůstává napnuté, práce jde přes kotník.", "The knee stays straight. The work goes through the ankle."],
    pos: ["Ramena pod polstry, špičky na hraně, paty volné.", "Shoulders under the pads, toes on the edge, heels free."],
    exe: ["Nahoru na špičku, dole pomalu do protažení.", "Up onto the toes, down slowly into the stretch."],
    wat: ["Kolena zůstávají napnutá, ale ne zamčená natvrdo.", "The knees stay straight, but not locked hard."] },

  { id: "sllegpress", cz: "Leg press jednonož", en: "Single-Leg Leg Press", pat: "drep", S: 2, C: 2, J: { kol: 2, kyc: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["qua", "glu"], ms: ["ham", "cal"], dot: [116, 120], ez: "legpress", hd: "bulgsplit",
    foc: ["Jedna noha si nemá kde vypomoct. To je smysl.", "One leg has nothing to borrow from. That is the point."],
    pos: ["Jedno chodidlo uprostřed plošiny, druhá noha volně dolů.", "One foot in the middle of the platform, the other leg hanging free."],
    exe: ["Dolů do rozsahu, který drží pánev na sedačce. Nahoru přes celé chodidlo.", "Down as far as the pelvis stays on the seat. Up through the whole foot."],
    wat: ["Koleno nepadá dovnitř. Slabší strana určuje počet.", "The knee does not fall inward. The weaker side sets the number."] },

  { id: "ghr", cz: "Glute-ham raise", en: "Glute-Ham Raise", pat: "ohyb", S: 4, C: 2, J: { kol: 2, kyc: 1 }, pop: 2, eq: ["stroj"], mode: "reps", mp: ["ham", "glu"], ms: ["low", "cal"], dot: [124, 138], ez: "lyinglegcurl", hd: "nordic",
    foc: ["Trup a stehna drží jednu linii celou dobu.", "The torso and thighs hold one line the whole way."],
    pos: ["Kotníky pod polstry, kolena za podložkou, tělo napnuté.", "Ankles under the pads, knees behind the pad, body braced."],
    exe: ["Spouštěj se pomalu vpřed, nahoru zakopnutím a stažením hýždí.", "Lower forward slowly, come up by curling the knees and squeezing the glutes."],
    wat: ["Beder se nesmí prohnout do oblouku. Radši kratší rozsah.", "The low back must not fall into an arch. Shorter range is the better answer."],
    pro: ["Když nejde nahoru, dělej jen pomalé spouštění a nahoru se vytáhni rukama.", "If the way up is not there yet, do the slow lowering only and come up with the hands."] },

  { id: "sledpush", cz: "Tlačení saní", en: "Sled Push", pat: "prenos", S: 3, C: 1, J: { kot: 1 }, pop: 2, eq: ["prostor", "stroj"], mode: "sec", mp: ["qua", "glu"], ms: ["cal", "abs"], dot: [44, 104], ez: "sled", hd: null,
    foc: ["Nízký trup, krátké kroky, stálý tlak.", "Low torso, short steps, steady pressure."],
    pos: ["Ruce na madlech, paže napnuté, tělo v šikmé linii.", "Hands on the handles, arms straight, body in one diagonal line."],
    exe: ["Tlač krátkými kroky. Sáně se nesmí zastavit.", "Push with short steps. The sled does not stop."],
    wat: ["Krk zůstává v prodloužení páteře. Dýchej.", "The neck stays in line with the spine. Keep breathing."] },

  { id: "sleddrag", cz: "Tažení saní", en: "Sled Drag", pat: "prenos", S: 3, C: 1, J: { kot: 1 }, pop: 2, eq: ["prostor", "stroj"], mode: "sec", mp: ["qua", "glu"], ms: ["ham", "upb", "fore"], dot: [40, 106], ez: "sled", hd: null,
    foc: ["Táhni z nohou, ruce jen drží popruh.", "Pull with the legs. The hands only hold the strap."],
    pos: ["Popruh v rukou nebo přes pás, mírný záklon proti odporu.", "Strap in the hands or over a belt, a slight lean against the resistance."],
    exe: ["Jdi vpřed nebo pozadu stálým tempem.", "Walk forward or backward at a steady pace."],
    wat: ["Pozadu jdi kratšími kroky a dívej se přes rameno.", "Going backward, take shorter steps and look over the shoulder."] },
];

// ---- UPPER BODY · GYM ------------------------------------------------
const UPPER = [
  { id: "tbarrow", cz: "Přítah na T-tyči", en: "T-Bar Row", pat: "tah", S: 3, C: 2, J: { pat: 2, ram: 1 }, pop: 3, eq: ["cinka"], mode: "reps", mp: ["upb", "bic"], ms: ["low", "ham", "fore"], dot: [106, 130], ez: "dbrow", hd: "bbrow",
    foc: ["Lokty jdou dozadu podél těla, ne do stran.", "The elbows travel back along the body, not out to the sides."],
    pos: ["Stoj nad tyčí, kolena mírně pokrčená, záda rovná, hrudník dolů.", "Stand over the bar, knees soft, back flat, chest down."],
    exe: ["Přitáhni k pupku, nahoře krátce zadrž, pomalu dolů.", "Pull to the navel, hold briefly, lower slowly."],
    wat: ["Trup se nehoupe. Když se houpe, je to moc.", "The torso does not swing. If it swings, it is too much."] },

  { id: "landminerow", cz: "Přítah na landmine jednoruč", en: "Landmine Row", pat: "tah", S: 3, C: 2, J: { pat: 2, ram: 1 }, pop: 2, eq: ["cinka"], mode: "reps", mp: ["upb", "bic"], ms: ["low", "fore", "obl"], dot: [104, 134], ez: "dbrow", hd: "bbrow",
    foc: ["Jedna strana, dlouhá dráha, tah přes celé záda.", "One side, a long path, the pull comes from the whole back."],
    pos: ["Konec osy v rukou, druhý konec v zemi. Předklon, opora o volnou ruku nebo koleno.", "The bar's end in the hand, the other end on the floor. Hinge forward, brace on the free hand or knee."],
    exe: ["Přitáhni k boku, dole pusť lopatku do protažení.", "Pull to the hip, let the shoulder blade travel at the bottom."],
    wat: ["Trup se nekroutí za rukou.", "The torso does not rotate to follow the arm."] },

  { id: "chestsupprow", cz: "Přítah v opoře o hrudník", en: "Chest-Supported Machine Row", pat: "tah", S: 2, C: 1, J: { ram: 1 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["upb", "bic"], ms: ["fore"], dot: [100, 128], ez: null, hd: "bbrow",
    foc: ["Opora vezme bedra z rovnice. Zbyde jen tah.", "The pad takes the low back out of it. Only the pull is left."],
    pos: ["Hrudník na opoře, chodidla pevně, madla v natažených pažích.", "Chest on the pad, feet planted, handles at arm's length."],
    exe: ["Přitáhni lokty za tělo, nahoře krátce zadrž, pomalu zpět.", "Draw the elbows past the body, hold briefly, return slowly."],
    wat: ["Hrudník neopouští opěrku.", "The chest does not leave the pad."] },

  { id: "oacablerow", cz: "Přítah kladky jednoruč", en: "One-Arm Cable Row", pat: "tah", S: 2, C: 2, J: { ram: 1 }, pop: 2, eq: ["kladka"], mode: "reps", mp: ["upb", "bic"], ms: ["obl", "fore"], dot: [98, 132], ez: "cablerow", hd: null,
    foc: ["Dole nech lopatku odjet dopředu. Nahoře ji stáhni.", "At the front let the shoulder blade travel. At the back draw it in."],
    pos: ["Sed nebo polovysoký postoj, jedna ruka na madle, druhá volná.", "Seated or in a half-stance, one hand on the handle, the other free."],
    exe: ["Přitáhni k boku, trup drží. Zpět pomalu do plného natažení.", "Pull to the hip while the torso holds. Return slowly to full length."],
    wat: ["Rotace trupu je vedlejší efekt, ne pohon.", "Torso rotation is a side effect, not the engine."] },

  { id: "straightarmpd", cz: "Stahování kladky s napnutými pažemi", en: "Straight-Arm Pulldown", pat: "tah", S: 2, C: 1, J: { ram: 1, lok: 1 }, pop: 2, eq: ["kladka"], mode: "reps", mp: ["upb"], ms: ["abs", "tri"], dot: [94, 118], ez: null, hd: null,
    foc: ["Lokty zůstávají napnuté. Pohyb dělá rameno.", "The elbows stay straight. The shoulder does the work."],
    pos: ["Stoj v mírném předklonu, madlo v napnutých pažích nad hlavou.", "Stand in a slight hinge, handle overhead at arm's length."],
    exe: ["Táhni obloukem ke stehnům, dole krátce zadrž. Zpět kontrolovaně.", "Sweep down to the thighs in an arc, hold briefly. Return under control."],
    wat: ["Nezaměňuj to za triceps. Lokty se neohýbají.", "This is not a triceps exercise. The elbows do not bend."] },

  { id: "landminepress", cz: "Tlak na landmine jednoruč", en: "Single-Arm Landmine Press", pat: "tlak", S: 3, C: 2, J: { ram: 1, lok: 1 }, pop: 2, eq: ["cinka"], mode: "reps", mp: ["sho", "che"], ms: ["tri", "abs", "serr"], dot: [102, 108], ez: "dbpress", hd: "ohp",
    foc: ["Šikmá dráha je přátelštější k rameni než tlak přímo nad hlavu.", "The diagonal path is kinder to the shoulder than pressing straight overhead."],
    pos: ["Stoj nebo klek, konec osy u ramene, druhá ruka volná.", "Standing or half-kneeling, the bar's end at the shoulder, the other hand free."],
    exe: ["Tlač vpřed a vzhůru, nahoře nech lopatku odjet. Zpět pomalu.", "Press forward and up, let the shoulder blade travel at the top. Return slowly."],
    wat: ["Žebra dole, beder se neprohýbá.", "Ribs down, the low back does not arch."] },

  { id: "pushpress", cz: "Tlak s výrazem", en: "Push Press", pat: "tlak", S: 4, C: 3, J: { ram: 2, lok: 1, pat: 2 }, pop: 2, eq: ["cinka"], mode: "reps", mp: ["sho", "tri"], ms: ["qua", "glu", "abs"], dot: [100, 100], ez: "ohp", hd: null,
    foc: ["Krátký pokrčený dřep dá činku přes nejtěžší místo. Pak už tlačí ruce.", "A short dip carries the bar past the hardest place. Then the arms take over."],
    pos: ["Činka na přední straně ramen, lokty vpřed, chodidla na šířku boků.", "Bar on the front of the shoulders, elbows forward, feet hip-width."],
    exe: ["Krátce se pokrč, vystřel nohama, tlak dokonči pažemi. Nahoře stůj.", "Dip short, drive with the legs, finish with the arms. Stand at the top."],
    wat: ["Pokrčení je krátké a svislé. Ne dřep.", "The dip is short and vertical. It is not a squat."] },

  { id: "arnoldpress", cz: "Arnold tlak", en: "Arnold Press", pat: "tlak", S: 3, C: 2, J: { ram: 2, lok: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["sho"], ms: ["tri", "tra"], dot: [102, 104], ez: "dbpress", hd: null,
    foc: ["Rotace patří na začátek pohybu, ne nahoru.", "The rotation belongs at the start of the movement, not at the top."],
    pos: ["Sed nebo stoj, činky u ramen dlaněmi k sobě.", "Seated or standing, dumbbells at the shoulders, palms facing you."],
    exe: ["Tlač vzhůru a při tom otoč dlaně dopředu. Zpět stejnou cestou.", "Press up while turning the palms forward. Return the same way."],
    wat: ["Když rameno v rotaci škrábe, zůstaň u obyčejného tlaku.", "If the rotation grinds in the shoulder, stay with the plain press."] },

  { id: "cablelatraise", cz: "Upažování na kladce", en: "Cable Lateral Raise", pat: "tlak", S: 2, C: 1, J: { ram: 1 }, pop: 2, eq: ["kladka"], mode: "reps", mp: ["sho"], ms: ["tra"], dot: [98, 96], ez: "lateralraise", hd: null,
    foc: ["Kladka drží odpor i dole. Tam činka nic nedělá.", "The cable keeps tension at the bottom, where a dumbbell does nothing."],
    pos: ["Stoj bokem ke kladce, madlo ve vzdálenější ruce, paže volně dolů.", "Stand side-on to the cable, handle in the far hand, arm hanging."],
    exe: ["Upaž do výšky ramene, nahoře krátce zadrž. Dolů pomalu.", "Raise to shoulder height, hold briefly. Lower slowly."],
    wat: ["Palec nemíří dolů. Rameno nešplhá k uchu.", "The thumb does not point down. The shoulder does not climb to the ear."] },

  { id: "revpecdeck", cz: "Rozpažování na stroji", en: "Reverse Pec Deck", pat: "tah", S: 2, C: 1, J: { ram: 1 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["upb", "sho"], ms: ["rcuff", "tra"], dot: [96, 122], ez: null, hd: null,
    foc: ["Zadní část ramene, ne trapéz. Lokty vedou.", "The rear shoulder, not the traps. The elbows lead."],
    pos: ["Hrudník na opoře, paže vpřed v mírném pokrčení.", "Chest on the pad, arms forward with a soft bend."],
    exe: ["Rozpaž do strany, vzadu krátce zadrž. Pomalu zpět.", "Open out to the sides, hold briefly at the back. Return slowly."],
    wat: ["Ramena zůstávají dole. Krk klidný.", "The shoulders stay down. The neck stays quiet."] },

  { id: "machinechestpress", cz: "Tlak na prsa na stroji", en: "Machine Chest Press", pat: "tlak", S: 2, C: 1, J: { ram: 1, lok: 1 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["che", "tri"], ms: ["sho"], dot: [88, 110], ez: null, hd: "bench",
    foc: ["Dráha je daná, tak se dá jít blízko k selhání bezpečně.", "The path is fixed, so you can work close to failure safely."],
    pos: ["Sed, madla ve výšce středu hrudníku, chodidla na zemi.", "Sit with the handles at mid-chest height, feet on the floor."],
    exe: ["Tlač vpřed do napnutí, zpět pomalu do protažení.", "Press forward to length, return slowly into the stretch."],
    wat: ["Ramena zůstávají na opoře. Nezvedej je k uším.", "The shoulders stay on the pad. Do not shrug them up."] },

  { id: "machineshoulderpress", cz: "Tlak nad hlavu na stroji", en: "Machine Shoulder Press", pat: "tlak", S: 2, C: 1, J: { ram: 2, lok: 1 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["sho", "tri"], ms: ["tra"], dot: [100, 102], ez: null, hd: "ohp",
    foc: ["Bez balancování s činkou. Zbyde jen tlak.", "No balancing a dumbbell. Only the press is left."],
    pos: ["Sed s opřenými zády, madla ve výšce ramen.", "Sit with the back supported, handles at shoulder height."],
    exe: ["Tlač vzhůru, nahoře nezamykej natvrdo. Zpět pomalu.", "Press up without slamming into lockout. Return slowly."],
    wat: ["Beder zůstává na opoře. Když se prohýbá, ubrat.", "The low back stays on the pad. If it arches, take weight off."] },

  { id: "assistpullup", cz: "Shyb s dopomocí stroje", en: "Assisted Pull-Up Machine", pat: "tah", S: 2, C: 2, J: { ram: 1, lok: 1 }, pop: 3, eq: ["stroj"], mode: "reps", mp: ["upb", "bic"], ms: ["fore", "abs"], dot: [92, 116], ez: null, hd: "pullup",
    foc: ["Menší dopomoc je lepší výkon. Číslo jde dolů, ne nahoru.", "Less assistance is the better result. The number goes down, not up."],
    pos: ["Kolena nebo chodidla na plošině, úchop na šířku ramen.", "Knees or feet on the platform, grip about shoulder-width."],
    exe: ["Táhni se k hrazdě, dole nech tělo do plného natažení.", "Pull up to the bar, let the body reach full length at the bottom."],
    wat: ["Nepouštěj se dolů volným pádem. Ramena aktivní i dole.", "Do not drop back down. The shoulders stay active at the bottom too."],
    pro: ["Ubírej dopomoc po nejmenším kroku, který stroj dovolí. Cíl je shyb bez ní.", "Take the assistance down by the smallest step the machine allows. The goal is a pull-up without it."] },

  { id: "cableyraise", cz: "Zdvih do Y na kladce", en: "Cable Y Raise", pat: "tah", S: 1, C: 2, J: { ram: 1 }, pop: 1, eq: ["kladka"], mode: "reps", mp: ["upb", "sho"], ms: ["tra", "serr"], dot: [94, 110], ez: null, hd: null,
    foc: ["Ruce jdou nahoru do písmene Y, palce vzhůru.", "The arms travel up into a Y, thumbs leading."],
    pos: ["Stoj čelem ke kladce, madla v napnutých pažích dole.", "Stand facing the cable, handles at arm's length low in front."],
    exe: ["Táhni nahoru a od sebe do Y, nahoře krátce zadrž.", "Pull up and apart into a Y, hold briefly at the top."],
    wat: ["Váha je malá. Když se zvedají ramena, je moc velká.", "The load is light. If the shoulders climb, it is too heavy."] },
];

// ---- CARRIES AND CONDITIONING ----------------------------------------
const CARRY = [
  { id: "frontrackcarry", cz: "Chůze s činkami v předním držení", en: "Front-Rack Carry", pat: "stred", S: 3, C: 2, J: { pat: 1, ram: 1 }, pop: 2, eq: ["zavazi"], mode: "sec", mp: ["abs", "upb"], ms: ["sho", "obl", "qua"], dot: [56, 66], ez: "suitcase", hd: null,
    foc: ["Žebra dole, hrudník vzhůru, dech pokračuje.", "Ribs down, chest tall, the breath keeps going."],
    pos: ["Činky na přední straně ramen, lokty vpřed, trup vzpřímený.", "Weights on the front of the shoulders, elbows forward, torso tall."],
    exe: ["Jdi klidným tempem, krátké kroky.", "Walk at a calm pace with short steps."],
    wat: ["Beder se neprohýbá. Když se prohýbá, ubrat váhu.", "The low back does not arch. If it does, take weight off."] },

  { id: "battlerope", cz: "Bojové lano", en: "Battle Ropes", pat: "prenos", S: 2, C: 2, J: { ram: 1 }, pop: 2, eq: ["prostor"], mode: "sec", mp: ["sho", "upb"], ms: ["abs", "fore"], dot: [50, 96], ez: null, hd: null,
    foc: ["Vlna vychází z boků, ne z ramen.", "The wave comes from the hips, not from the shoulders."],
    pos: ["Mírný podřep, konce lana v rukou, trup vzpřímený.", "A shallow squat, the rope's ends in the hands, torso tall."],
    exe: ["Střídavé nebo současné vlny stálým tempem po celý úsek.", "Alternating or simultaneous waves at a steady pace for the whole interval."],
    wat: ["Ramena zůstávají dole. Když šplhají k uším, zkrať úsek.", "The shoulders stay down. If they climb to the ears, shorten the interval."] },

  { id: "mbslam", cz: "Úder medicinbalem", en: "Medicine-Ball Slam", pat: "ohyb", S: 3, C: 2, J: { pat: 2, ram: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["abs", "upb"], ms: ["sho", "glu", "tri"], dot: [98, 120], ez: null, hd: null,
    foc: ["Celý pohyb je jedno vydechnutí.", "The whole movement is one exhale."],
    pos: ["Míč nad hlavou, tělo napnuté, chodidla na šířku boků.", "Ball overhead, body braced, feet hip-width."],
    exe: ["Udeř míčem do země přes ohnutí v bocích. Zvedni a opakuj.", "Slam the ball down by folding at the hips. Pick it up and repeat."],
    wat: ["Záda se nekulatí trhnutím. Míč, který se odráží, není na tohle.", "The back does not round with a jerk. A ball that bounces is the wrong ball."] },

  { id: "wallball", cz: "Hod na cíl", en: "Wall Ball", pat: "drep", S: 3, C: 2, J: { kol: 2, ram: 1 }, pop: 2, eq: ["zavazi", "zed"], mode: "reps", mp: ["qua", "glu", "sho"], ms: ["abs", "tri", "cal"], dot: [110, 118], ez: null, hd: null,
    foc: ["Dřep a hod jsou jeden pohyb, ne dva.", "The squat and the throw are one movement, not two."],
    pos: ["Míč u hrudi, stoj čelem ke stěně na délku paže.", "Ball at the chest, standing an arm's length from the wall."],
    exe: ["Dřep, z nohou vystřel míč na cíl, chyť ho a plynule dolů.", "Squat, drive the ball to the target from the legs, catch it and flow back down."],
    wat: ["Chytej s pokrčenými pažemi. Cíl si drž očima.", "Catch with bent arms. Keep the target in your eyes."] },
];

// ---- KETTLEBELL ------------------------------------------------------
const KB = [
  { id: "tgu", cz: "Tureckej vstávák", en: "Turkish Get-Up", pat: "prenos", S: 3, C: 4, J: { ram: 2, pat: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["sho", "abs"], ms: ["obl", "glu", "qua", "tra"], dot: [60, 90], ez: null, hd: null,
    foc: ["Oko drží závaží celou cestu nahoru.", "The eye stays on the weight the whole way up."],
    pos: ["Leh na zádech, závaží v napnuté paži nad ramenem, stejnostranné koleno pokrčené.", "Lie on the back, weight in a straight arm above the shoulder, same-side knee bent."],
    exe: ["Přes loket do sedu, do mostu, koleno pod sebe, vstaň. Stejnou cestou zpět.", "Roll to the elbow, to the hand, bridge, sweep the knee under, stand. Reverse the same way."],
    wat: ["Paže zůstává svislá. Když se ohne, končíš sérii.", "The arm stays vertical. When it bends, the set is over."],
    pro: ["Nauč se to nejdřív s botou nebo prázdnou rukou. Váha přijde až po tvaru.", "Learn it with a shoe or an empty hand first. Load comes after shape."] },

  { id: "kbclean", cz: "Přemístění kettlebellu", en: "Kettlebell Clean", pat: "ohyb", S: 3, C: 3, J: { kyc: 1, ram: 1, zap: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["glu", "ham"], ms: ["upb", "sho", "fore"], dot: [100, 128], ez: "swing", hd: null,
    foc: ["Kettlebell má dosednout, ne dopadnout.", "The bell should settle, not land."],
    pos: ["Kettlebell mezi chodidly, ohyb v bocích, záda rovná.", "Bell between the feet, hinge at the hips, back flat."],
    exe: ["Švihem z boků nahoru, po cestě protoč ruku a nech ho dosednout k předloktí.", "Drive from the hips, turn the hand on the way and let the bell settle onto the forearm."],
    wat: ["Když plácá do zápěstí, drž ho blíž tělu a protoč dřív.", "If it bangs the wrist, keep it closer and turn the hand earlier."] },

  { id: "kbsnatch", cz: "Trh kettlebellem", en: "Kettlebell Snatch", pat: "ohyb", S: 4, C: 4, J: { kyc: 1, ram: 2, zap: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["glu", "ham", "sho"], ms: ["upb", "fore", "abs"], dot: [98, 124], ez: "kbclean", hd: null,
    foc: ["Jeden pohyb ze země nad hlavu. Nahoře uzamčené rameno.", "One movement from the floor to overhead. A locked shoulder at the top."],
    pos: ["Kettlebell před chodidly, ohyb v bocích, záda rovná.", "Bell in front of the feet, hinge at the hips, back flat."],
    exe: ["Švihem z boků vzhůru, protoč ruku a zastav v napnuté paži nad hlavou.", "Drive from the hips, turn the hand and finish with a straight arm overhead."],
    wat: ["Tohle se učí až po zvládnutém švihu a přemístění.", "This is learned after the swing and the clean, not before."] },

  { id: "kbpress", cz: "Tlak kettlebellem nad hlavu", en: "Kettlebell Strict Press", pat: "tlak", S: 3, C: 2, J: { ram: 2, lok: 1 }, pop: 2, eq: ["zavazi"], mode: "reps", mp: ["sho", "tri"], ms: ["abs", "obl", "tra"], dot: [102, 100], ez: "dbpress", hd: null,
    foc: ["Napni celé tělo, teprve pak tlač.", "Brace the whole body first, then press."],
    pos: ["Kettlebell v předním držení u ramene, loket u těla.", "Bell racked at the shoulder, elbow close to the body."],
    exe: ["Tlač svisle vzhůru bez pomoci nohou. Zpět pomalu do držení.", "Press straight up with no help from the legs. Return slowly to the rack."],
    wat: ["Beder se neprohýbá dozadu. Žebra dole.", "The low back does not arch. Ribs down."] },

  { id: "kbhighpull", cz: "Tah kettlebellu k ramenům", en: "Kettlebell High Pull", pat: "ohyb", S: 3, C: 3, J: { kyc: 1, ram: 1 }, pop: 1, eq: ["zavazi"], mode: "reps", mp: ["glu", "ham", "upb"], ms: ["sho", "tra", "fore"], dot: [100, 126], ez: "swing", hd: "kbsnatch",
    foc: ["Boky dělají práci, loket jen dojde vysoko.", "The hips do the work. The elbow simply arrives high."],
    pos: ["Kettlebell mezi chodidly, ohyb v bocích, záda rovná.", "Bell between the feet, hinge at the hips, back flat."],
    exe: ["Švih vpřed, na vrcholu přitáhni loket vysoko a ven, pak nech ruku znovu natáhnout.", "Swing forward, at the top draw the elbow high and out, then let the arm lengthen again."],
    wat: ["Rameno nešplhá k uchu. Krok mezi švihem a trhem.", "The shoulder does not climb to the ear. This is the step between the swing and the snatch."] },
];

// ---- ACTIVITIES ------------------------------------------------------
// An activity is not a strength row with a different name. It sits on the
// same session and set substrate, but it is measured in distance and time,
// it earns no estimated one-rep max, and it never appears in a strength
// block. There is no GPS here and no calorie estimate presented as fact.
const ACT = [
  { id: "act_walk", cz: "Chůze", en: "Walking", pat: "prenos", S: 1, C: 1, J: {}, pop: 3, eq: ["prostor"], mode: "sec", mp: ["qua", "cal"], ms: ["glu", "ham"], dot: [30, 100], ez: null, hd: "act_hike",
    foc: ["Nejlevnější a nejspolehlivější věc, kterou pro sebe můžeš udělat.", "The cheapest and most reliable thing you can do for yourself."],
    pos: ["Vzpřímený trup, uvolněná ramena, pohled vpřed.", "Tall torso, easy shoulders, eyes forward."],
    exe: ["Jdi tempem, u kterého se dá mluvit v celých větách.", "Walk at a pace where you can speak in full sentences."],
    wat: ["Délku i tempo si volíš. Nemusí z toho být trénink.", "You choose the distance and the pace. It does not have to become a workout."] },

  { id: "act_run", cz: "Běh", en: "Running", pat: "prenos", S: 2, C: 2, J: { kot: 2, kol: 2 }, pop: 3, eq: ["prostor"], mode: "sec", mp: ["qua", "cal", "ham"], ms: ["glu", "abs"], dot: [34, 102], ez: "act_walk", hd: "act_sprint",
    foc: ["Kadence spíš vyšší, kroky spíš kratší.", "Cadence a little higher, steps a little shorter."],
    pos: ["Vzpřímený trup, mírný náklon z kotníků, uvolněné paže.", "Tall torso, a small lean from the ankles, relaxed arms."],
    exe: ["Drž tempo, které udržíš celý úsek. Dech je měřidlo.", "Hold a pace you can keep for the whole distance. The breath is the gauge."],
    wat: ["Objem přidávej po malých krocích. Kotníky a lýtka to poznají první.", "Add volume in small steps. The ankles and calves notice first."] },

  { id: "act_sprint", cz: "Sprint", en: "Sprinting", pat: "prenos", S: 4, C: 3, J: { kot: 2, kol: 2, kyc: 2 }, pop: 2, eq: ["prostor"], mode: "sec", mp: ["ham", "glu", "qua"], ms: ["cal", "abs"], dot: [38, 104], ez: "act_run", hd: null,
    foc: ["Krátce, naplno, s plnou pauzou mezi úseky.", "Short, full effort, full rest between."],
    pos: ["Rozběhni se, plnou rychlost drž jen v označeném úseku.", "Build up. Hold full speed only inside the marked stretch."],
    exe: ["Úsek naplno, pak úplné zklidnění, teprve pak další.", "One stretch at full effort, then calm all the way down before the next."],
    wat: ["Nikdy bez rozehřátí. Hamstringy to promíjejí nejmíň ze všeho.", "Never without a warm-up. The hamstrings forgive this least of all."] },

  { id: "act_bike", cz: "Kolo", en: "Cycling", pat: "prenos", S: 2, C: 1, J: { kol: 1 }, pop: 3, eq: ["prostor"], mode: "sec", mp: ["qua", "glu"], ms: ["ham", "cal"], dot: [28, 106], ez: null, hd: null,
    foc: ["Kolena mají jít nahoru a dolů, ne do stran.", "The knees travel up and down, not side to side."],
    pos: ["Sedlo ve výšce, kde koleno dole zůstává lehce pokrčené.", "Saddle at a height where the knee stays slightly bent at the bottom."],
    exe: ["Drž kadenci, u které nohy nezatuhnou. Kopce jsou intenzita.", "Hold a cadence where the legs do not seize. Hills are the intensity."],
    wat: ["Dlouhý sed potřebuje protaženou kyčel po cestě domů.", "A long ride wants the hips opened up afterwards."] },

  { id: "act_rowerg", cz: "Veslařský trenažér", en: "Rowing Ergometer", pat: "tah", S: 3, C: 2, J: { pat: 1, kol: 1 }, pop: 2, eq: ["stroj"], mode: "sec", mp: ["upb", "qua", "glu"], ms: ["ham", "bic", "low"], dot: [96, 130], ez: null, hd: null,
    foc: ["Nohy, trup, ruce. Zpátky ruce, trup, nohy.", "Legs, body, arms. Back it is arms, body, legs."],
    pos: ["Sed s rovnými zády, řetěz vodorovně, ramena před boky.", "Sit tall, chain level, shoulders ahead of the hips."],
    exe: ["Tlač nohama, pak otevři trup, nakonec přitáhni k žebrům.", "Push with the legs, then open the torso, finally draw to the ribs."],
    wat: ["Záda se nekulatí. Když se kulatí, ubrat odpor nebo tempo.", "The back does not round. If it rounds, ease the damper or the pace."] },

  { id: "act_airbike", cz: "Air bike", en: "Air Bike", pat: "prenos", S: 3, C: 1, J: { kol: 1 }, pop: 2, eq: ["stroj"], mode: "sec", mp: ["qua", "glu", "sho"], ms: ["upb", "ham", "abs"], dot: [30, 108], ez: "act_bike", hd: null,
    foc: ["Ruce a nohy dělají práci současně. Proto to bolí dřív.", "Arms and legs work at once. That is why it bites sooner."],
    pos: ["Sedlo nastavené jako na kole, madla v rukou.", "Saddle set as on a bike, handles in the hands."],
    exe: ["Drž stálé tempo po celý úsek, ne první čtvrtinu naplno.", "Hold a steady pace for the whole interval, not full effort for the first quarter."],
    wat: ["Krátké úseky s poctivou pauzou dají víc než jeden dlouhý.", "Short intervals with an honest rest give more than one long grind."] },

  { id: "act_swim", cz: "Plavání", en: "Swimming", pat: "prenos", S: 2, C: 3, J: { ram: 1 }, pop: 3, eq: ["prostor"], mode: "sec", mp: ["upb", "sho"], ms: ["abs", "glu", "qua"], dot: [46, 98], ez: null, hd: null,
    foc: ["Dech je součást techniky, ne přerušení.", "The breath is part of the technique, not an interruption."],
    pos: ["Tělo vodorovně u hladiny, hlava v prodloužení páteře.", "Body level at the surface, head in line with the spine."],
    exe: ["Plav úseky se stejným počtem záběrů. Tam je pokrok vidět.", "Swim lengths with a steady stroke count. That is where progress shows."],
    wat: ["Rameno se přetěžuje tichem. Bolest v rameni je stop, ne výzva.", "The shoulder overloads quietly. Shoulder pain is a stop, not a challenge."] },

  { id: "act_hike", cz: "Turistika", en: "Hiking", pat: "prenos", S: 2, C: 2, J: { kot: 1, kol: 1 }, pop: 3, eq: ["prostor"], mode: "sec", mp: ["qua", "glu", "cal"], ms: ["ham", "abs", "low"], dot: [32, 104], ez: "act_walk", hd: null,
    foc: ["Sestup zatěžuje víc než výstup. Podle něj plánuj den.", "The descent costs more than the climb. Plan the day around it."],
    pos: ["Batoh usazený na bocích, kroky kratší do kopce i z kopce.", "Pack seated on the hips, shorter steps up and down."],
    exe: ["Tempo drž tak, aby se dalo jít i po hodinách.", "Hold a pace you could still keep after hours."],
    wat: ["Hole šetří kolena při sestupu. Nejsou to berle.", "Poles save the knees on the way down. They are not crutches."] },

  { id: "act_climb", cz: "Lezení", en: "Climbing", pat: "tah", S: 3, C: 4, J: { lok: 2, ram: 2, zap: 2 }, pop: 2, eq: ["prostor"], mode: "sec", mp: ["upb", "fore", "bic"], ms: ["abs", "sho", "qua"], dot: [90, 114], ez: null, hd: null,
    foc: ["Nohy nesou váhu. Ruce jen drží směr.", "The feet carry the weight. The hands only hold the line."],
    pos: ["Boky blízko stěny, paže spíš napnuté než skrčené.", "Hips close to the wall, arms straight rather than bent."],
    exe: ["Lez v blocích s pauzou. Prsty potřebují pauzu dřív než ty.", "Climb in blocks with rest. The fingers need rest before you do."],
    wat: ["Prsty a lokty se budují roky. Objem přidávej opatrně.", "Fingers and elbows are built over years. Add volume carefully."] },

  { id: "act_stairs", cz: "Schodový trenažér", en: "Stair Machine", pat: "prenos", S: 2, C: 1, J: { kol: 1, kot: 1 }, pop: 2, eq: ["stroj"], mode: "sec", mp: ["glu", "qua"], ms: ["cal", "ham"], dot: [36, 108], ez: null, hd: null,
    foc: ["Stůj vzpřímeně a nevis na madlech.", "Stand tall and do not hang on the handrails."],
    pos: ["Trup vzpřímený, celé chodidlo na schodu, ruce jen pro rovnováhu.", "Torso tall, the whole foot on the step, hands only for balance."],
    exe: ["Drž stálé tempo. Delší krok znamená víc práce než rychlejší krok.", "Hold a steady rate. A longer step is more work than a faster one."],
    wat: ["Když se opíráš do madel, sniž rychlost.", "If you are leaning on the rails, lower the speed."] },

  { id: "act_elliptical", cz: "Eliptický trenažér", en: "Elliptical", pat: "prenos", S: 1, C: 1, J: {}, pop: 2, eq: ["stroj"], mode: "sec", mp: ["qua", "glu"], ms: ["ham", "cal", "upb"], dot: [26, 104], ez: null, hd: null,
    foc: ["Bez dopadů. Proto se hodí, když kotníky nebo kolena potřebují klid.", "No impact. That is why it fits when the ankles or knees want quiet."],
    pos: ["Vzpřímený trup, celá chodidla na plošinách.", "Tall torso, whole feet on the pedals."],
    exe: ["Odpor nastav tak, aby nohy tlačily, ne jen doprovázely.", "Set the resistance so the legs push rather than follow."],
    wat: ["Nedrž se madel křečovitě. Ruce mají pracovat, nebo být volně.", "Do not grip the handles hard. The arms either work or hang free."] },
];

export const TRAINING_V2_EXERCISES = [...LOWER, ...UPPER, ...CARRY, ...KB, ...ACT];

// The audit record for each new row, in the same short-key vocabulary the
// 485-row table uses. `src: "tanmay"` is provenance and says nothing about
// quality; `ev` says what the claim rests on.
export const TRAINING_V2_META = {
  // lower
  trapbardl: { t: "core", g: "generic", r: "strength", b: "strength", tr: 3, f: "hinge", src: "tanmay", ev: "high" },
  legext: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 2, f: "knee_extension_machine", src: "tanmay", ev: "high" },
  seatedlegcurl: { t: "core", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 2, f: "knee_flexion_machine", src: "tanmay", ev: "high" },
  lyinglegcurl: { t: "core", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 2, f: "knee_flexion_machine", src: "tanmay", ev: "high" },
  hacksquat: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "squat_machine", src: "tanmay", ev: "medium" },
  beltsquat: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "squat_machine", src: "tanmay", ev: "medium" },
  pendulumsquat: { t: "specialist", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "squat_machine", src: "tanmay", ev: "low" },
  hipabduction: { t: "extended", g: "goal_eq", r: "support", b: "accessory", tr: 1, f: "hip_abduction", src: "tanmay", ev: "medium" },
  hipadduction: { t: "extended", g: "goal_eq", r: "support", b: "accessory", tr: 1, f: "hip_adduction", src: "tanmay", ev: "medium" },
  seatedcalf: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 1, f: "calf", src: "tanmay", ev: "high" },
  standingcalfmachine: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 1, f: "calf", src: "tanmay", ev: "high" },
  sllegpress: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "leg_press", src: "tanmay", ev: "medium" },
  ghr: { t: "specialist", g: "goal_eq", r: "strength", b: "strength", tr: 3, f: "knee_flexion_bw", src: "tanmay", ev: "medium" },
  sledpush: { t: "extended", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "sled", src: "tanmay", ev: "high" },
  sleddrag: { t: "extended", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "sled", src: "tanmay", ev: "high" },
  // upper
  tbarrow: { t: "core", g: "generic", r: "strength", b: "strength", tr: 2, f: "landmine_row", src: "tanmay", ev: "high" },
  landminerow: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "landmine_row", src: "tanmay", ev: "medium" },
  chestsupprow: { t: "core", g: "goal_eq", r: "hypertrophy", b: "strength", tr: 2, f: "pull_horizontal", src: "tanmay", ev: "high" },
  oacablerow: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 2, f: "pull_horizontal", src: "tanmay", ev: "medium" },
  straightarmpd: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 2, am: "straight", tl: 2, f: "pull_straightarm", src: "tanmay", ev: "medium" },
  landminepress: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "press_vertical", src: "tanmay", ev: "medium" },
  pushpress: { t: "specialist", g: "explicit", r: "power", b: "strength", tr: 3, f: "press_vertical", pc: ["barbell"], src: "tanmay", ev: "medium" },
  arnoldpress: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "strength", tr: 2, f: "press_vertical", src: "tanmay", ev: "medium" },
  cablelatraise: { t: "extended", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 1, f: "lateral_raise", src: "tanmay", ev: "medium" },
  revpecdeck: { t: "core", g: "goal_eq", r: "hypertrophy", b: "accessory", tr: 1, f: "rear_delt", src: "tanmay", ev: "high" },
  machinechestpress: { t: "core", g: "goal_eq", r: "hypertrophy", b: "strength", tr: 2, f: "press_horizontal", src: "tanmay", ev: "high" },
  machineshoulderpress: { t: "core", g: "goal_eq", r: "hypertrophy", b: "strength", tr: 2, f: "press_vertical", src: "tanmay", ev: "high" },
  assistpullup: { t: "core", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "pull_vertical", src: "tanmay", ev: "high" },
  cableyraise: { t: "extended", g: "goal_eq", r: "support", b: "prep", tr: 1, f: "scap_raise", src: "tanmay", ev: "low", pj: ["ram"] },
  // carries and conditioning
  frontrackcarry: { t: "extended", g: "goal_eq", r: "strength", b: "accessory", tr: 2, f: "grip_carry", src: "tanmay", ev: "medium" },
  battlerope: { t: "extended", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "conditioning_upper", src: "tanmay", ev: "medium" },
  mbslam: { t: "extended", g: "cond", r: "power", b: "conditioning", tr: 2, f: "throw", src: "tanmay", ev: "medium" },
  wallball: { t: "extended", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "throw", src: "tanmay", ev: "medium" },
  // kettlebell
  tgu: { t: "specialist", g: "explicit", r: "coordination_skill", b: "coordination_skill", sk: "coordination", tr: 2, sf: 2, f: "kb_getup", src: "tanmay", ev: "medium" },
  kbclean: { t: "specialist", g: "explicit", r: "power", b: "strength", tr: 2, f: "kb_clean", src: "tanmay", ev: "medium" },
  kbsnatch: { t: "specialist", g: "explicit", r: "power", b: "strength", tr: 3, co: true, f: "kb_snatch", src: "tanmay", ev: "medium" },
  kbpress: { t: "extended", g: "goal_eq", r: "strength", b: "strength", tr: 2, f: "press_vertical", src: "tanmay", ev: "medium" },
  kbhighpull: { t: "specialist", g: "explicit", r: "power", b: "strength", tr: 2, f: "kb_pull", src: "tanmay", ev: "low" },
  // activities · a tier of their own, so nothing generic ever picks one by accident
  act_walk: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "walk", src: "tanmay", ev: "high" },
  act_run: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "run", pc: ["impact"], src: "tanmay", ev: "high" },
  act_sprint: { t: "activity", g: "cond", r: "power", b: "conditioning", tr: 3, f: "run", pc: ["impact"], src: "tanmay", ev: "high" },
  act_bike: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "cycle", src: "tanmay", ev: "high" },
  act_rowerg: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "row_erg", src: "tanmay", ev: "high" },
  act_airbike: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "cycle", src: "tanmay", ev: "medium" },
  act_swim: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "swim", src: "tanmay", ev: "high" },
  act_hike: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 2, f: "walk", src: "tanmay", ev: "high" },
  act_climb: { t: "activity", g: "explicit", r: "coordination_skill", b: "coordination_skill", sk: "coordination", tr: 2, sf: 2, f: "climb", src: "tanmay", ev: "medium" },
  act_stairs: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "stairs", src: "tanmay", ev: "medium" },
  act_elliptical: { t: "activity", g: "cond", r: "conditioning", b: "conditioning", tr: 1, f: "elliptical", src: "tanmay", ev: "medium" },
};

// Measurement, rest and side for the new rows. Kept here rather than in
// the general overlay so the extension stays one readable unit.
export const TRAINING_V2_OVERLAY = {
  trapbardl: { vk: "trap_bar", rest: 180, warmup: "ramp" },
  legext: { vk: "machine", rest: 75 },
  seatedlegcurl: { vk: "seated", rest: 75 },
  lyinglegcurl: { vk: "lying", rest: 75 },
  hacksquat: { vk: "hack", rest: 150 },
  beltsquat: { vk: "belt", rest: 150 },
  pendulumsquat: { vk: "pendulum", rest: 150 },
  hipabduction: { vk: "machine", rest: 45 },
  hipadduction: { vk: "machine", rest: 45 },
  seatedcalf: { vk: "seated_machine", rest: 60 },
  standingcalfmachine: { vk: "standing_machine", rest: 60 },
  sllegpress: { vk: "single_leg", side: "perSide", rest: 90 },
  ghr: { vk: "glute_ham", rest: 120 },
  sledpush: { m: "WEIGHT_DURATION", vk: "push", rest: 90 },
  sleddrag: { m: "WEIGHT_DURATION", vk: "drag", rest: 90 },
  tbarrow: { vk: "bilateral", rest: 120 },
  landminerow: { vk: "unilateral", side: "perSide", rest: 90, aka: ["meadows", "meadows row"] },
  chestsupprow: { vk: "machine_supported", rest: 90 },
  oacablerow: { vk: "cable_unilateral", side: "perSide", rest: 75 },
  straightarmpd: { vk: "cable", rest: 60 },
  landminepress: { vk: "landmine_unilateral", side: "perSide", rest: 90 },
  pushpress: { vk: "push_press", rest: 180, warmup: "ramp" },
  arnoldpress: { vk: "arnold", rest: 90 },
  cablelatraise: { vk: "cable", rest: 45, side: "perSide" },
  revpecdeck: { vk: "machine", rest: 45 },
  machinechestpress: { vk: "machine", rest: 90 },
  machineshoulderpress: { vk: "machine", rest: 90 },
  assistpullup: { m: "ASSISTED_REPS", vk: "machine_assisted", rest: 120, aka: ["gravitron", "dopomoc"] },
  cableyraise: { vk: "cable", rest: 45 },
  frontrackcarry: { m: "WEIGHT_DURATION", vk: "front_rack", rest: 90 },
  battlerope: { m: "DURATION", vk: "waves", rest: 60 },
  mbslam: { vk: "slam", rest: 60 },
  wallball: { vk: "wall_ball", rest: 90 },
  tgu: { vk: "kettlebell", side: "perSide", rest: 120, aka: ["get up", "getup"] },
  kbclean: { vk: "kettlebell", side: "alternating", rest: 90 },
  kbsnatch: { vk: "kettlebell", side: "alternating", rest: 120 },
  kbpress: { vk: "kettlebell", side: "perSide", rest: 120 },
  kbhighpull: { vk: "kettlebell", rest: 90 },
  act_walk: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
  act_run: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
  act_sprint: { m: "DISTANCE_DURATION", rest: 180, warmup: "specific" },
  act_bike: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
  act_rowerg: { m: "DISTANCE_DURATION", rest: 90, warmup: "none" },
  act_airbike: { m: "DURATION", rest: 90, warmup: "none" },
  act_swim: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
  act_hike: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
  act_climb: { m: "DURATION", rest: 180, warmup: "specific" },
  act_stairs: { m: "DURATION", rest: 0, warmup: "none" },
  act_elliptical: { m: "DISTANCE_DURATION", rest: 0, warmup: "none" },
};

export const TRAINING_V2_IDS = TRAINING_V2_EXERCISES.map((x) => x.id);

// A progression link may point at a row this particular app does not ship: the
// coach's library holds every identity, a client's holds a subset. A link that
// cannot resolve is worse than no link — it renders as a dead end and a check
// that follows the chain fails on it — so it is dropped where it cannot land.
export function extensionFor(availableIds) {
  const have = new Set(availableIds || []);
  for (const id of TRAINING_V2_IDS) have.add(id);
  return TRAINING_V2_EXERCISES.map((x) => ({
    ...x,
    ez: x.ez && have.has(x.ez) ? x.ez : null,
    hd: x.hd && have.has(x.hd) ? x.hd : null,
  }));
}
export const ACTIVITY_IDS = ACT.map((x) => x.id);
