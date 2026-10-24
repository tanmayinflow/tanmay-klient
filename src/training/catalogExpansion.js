import {applyPositionHoldAudit} from './catalogPositionHoldAudit.js';
import {applyElbowHandAudit} from './catalogElbowHandAudit.js';
import {applyShoulderAudit} from './catalogShoulderAudit.js';
import {applyHipAudit} from './catalogHipAudit.js';
import {applyLowerLegAudit,seedLowerLegFoundation} from './catalogLowerLegAudit.js';
import {applyLocomotionAudit} from './catalogLocomotionAudit.js';
import {applyBalanceAudit} from './catalogBalanceAudit.js';
import {applyMovementAudit} from './catalogMovementAudit.js';
import {applyTrunkAudit} from './catalogTrunkAudit.js';
import {applyCarryAudit} from './catalogCarryAudit.js';
import {applyVerticalPushAudit,seedVerticalPushFoundations} from './catalogVerticalPushAudit.js';
import {applyVerticalPullAudit,seedVerticalPullFoundations} from './catalogVerticalPullAudit.js';
import {applyAuditEquipmentFixes} from './catalogAuditEquipmentFix.js';
import {applyBridgeAudit,seedBridgeFoundations} from './catalogBridgeAudit.js';
import {applyHorizontalPressAudit,seedHorizontalPressFoundations} from './catalogHorizontalPressAudit.js';
import {applyHorizontalPullAudit,seedHorizontalPullFoundations} from './catalogHorizontalPullAudit.js';
// Library expansion 2026-10-11. Independent coaching copy; references establish technique, not universal endorsement.
import { applyExerciseCorrections } from './catalogCorrections.js';
import { KETTLEBELL_EXERCISES, seedKettlebellExpansion } from './catalogKettlebell.js';
import { INSTAGRAM_EXERCISES, seedInstagramExpansion } from './catalogInstagram.js';
import { INSTAGRAM_CONTINUATION_EXERCISES, seedInstagramContinuation } from './catalogInstagramContinuation.js';
import { INSTAGRAM_CLIENT_NEXT_EXERCISES, seedInstagramClientNext } from './catalogInstagramClientNext.js';
import { INSTAGRAM_DEEP_REVIEW_EXERCISES, seedInstagramDeepReview } from './catalogInstagramDeepReview.js';
import { applySquatAudit } from './catalogSquatAudit.js';
import { applyLungeAudit } from './catalogLungeAudit.js';
import { applyStepAudit } from './catalogStepAudit.js';
import { seedStepVariants } from './catalogStepVariants.js';
import { applyHingeAudit } from './catalogHingeAudit.js';
import { applyPracticalCorrections } from './catalogPracticalCorrections.js';
export const EXPANSION_EXERCISES = [
  {
    "id": "ex26_mb_chestpass",
    "cz": "Hod medicinbalem od hrudníku",
    "en": "Medicine-Ball Chest Pass",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "throw_chest",
    "pos": [
      "Stůj v mírném rozkroku a drž lehký medicinbal u hrudníku. Před sebou měj volný prostor určený pro hody.",
      "Stand with feet apart holding a light medicine ball at chest height. Use a clear designated throwing area."
    ],
    "exe": [
      "Rychle propni paže a odhoď míč vpřed. Udrž rovnováhu a každé opakování začni znovu v klidu.",
      "Extend the arms quickly and throw forward. Keep balance and reset for each repetition."
    ],
    "wat": [
      "Míč musí být určený k házení. Nestůj v dráze odrazu; chytání vracejícího se míče je další dovednost.",
      "Use a ball rated for throwing. Stay clear of rebounds; catching a returning ball is a separate skill."
    ],
    "pro": [
      "Lehčí: lehčí míč a kratší hod. Těžší: rychlejší odhod se stejným míčem, potom krok do hodu. Ukonči sérii při ztrátě rychlosti.",
      "Easier: a lighter ball and shorter pass. Harder: faster release with the same ball, then a step into the throw. Stop when speed declines."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_mb_chestpass",
    "ez": null,
    "hd": null,
    "foc": [
      "Rychlý odhod vpřed a vyvážené dokončení.",
      "Release forward quickly and finish balanced."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Medicine-Ball Chest Pass",
      "url": "https://www.nsca.com/education/articles/nsca-coach/from-basic-to-dynamic-medicine-ball-training-for-the-multi-sport-high-school-athlete/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_mb_scoop",
    "cz": "Rotační hod medicinbalem od boku",
    "en": "Rotational Medicine-Ball Scoop Throw",
    "pat": "stred",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "obl",
      "glu"
    ],
    "ms": [
      "sho",
      "qua"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "throw_rotation",
    "pos": [
      "Stůj bokem k volné dopadové ploše, medicinbal drž oběma rukama u vzdálenějšího boku.",
      "Stand side-on to a clear landing area with the ball held in both hands near the far hip."
    ],
    "exe": [
      "Otoč chodidla, kyčle a trup do směru hodu a odhoď míč spodním obloukem. Dokonči pohyb vyváženě.",
      "Turn feet, hips and torso toward the target and release the ball in an underhand arc. Finish balanced."
    ],
    "wat": [
      "Nekruť kolena proti chodidlům přilepeným k zemi. Nikdo nesmí stát v dopadové ploše.",
      "Do not twist the knees against planted feet. Keep people out of the landing area."
    ],
    "pro": [
      "Lehčí: pomalé otáčení s lehkým míčem bez odhodu. Těžší: rychlejší hod, potom malý přípravný krok; obě strany zvlášť.",
      "Easier: slow turns with a light ball without release. Harder: a faster throw, then a small preparatory step; train both sides separately."
    ],
    "J": {
      "kyc": 2,
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_mb_scoop",
    "ez": null,
    "hd": null,
    "foc": [
      "Otáčej chodidla i kyčle, nezůstávej stát proti rotaci.",
      "Turn feet and hips together rather than twisting over fixed feet."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Rotational Medicine-Ball Scoop Throw",
      "url": "https://www.nsca.com/education/articles/nsca-coach/from-basic-to-dynamic-medicine-ball-training-for-the-multi-sport-high-school-athlete/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_mb_backward",
    "cz": "Hod medicinbalem vzad přes hlavu",
    "en": "Backward Overhead Medicine-Ball Throw",
    "pat": "ohyb",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "ham",
      "cal",
      "sho"
    ],
    "S": 3,
    "C": 3,
    "family": "throw_overhead",
    "tier": "specialist",
    "pos": [
      "Stůj zády k předem zkontrolované prázdné dopadové ploše. Drž lehký míč oběma rukama před stehny.",
      "Stand with your back to a checked empty landing area. Hold a light ball in both hands in front of the thighs."
    ],
    "exe": [
      "Z mírného podřepu a ohybu kyčlí se rychle narovnej a odhoď míč vzhůru a za sebe. Udrž kontrolu nad došlapem.",
      "Extend rapidly from a shallow squat and hip hinge, sending the ball upward and behind you. Control your landing or recovery step."
    ],
    "wat": [
      "Prostor za tebou musí hlídat další osoba. Neprováděj v běžné posilovně mezi lidmi a nevyháněj hod záklonem beder.",
      "Have another person monitor the area behind you. Do not throw among gym users or create the throw by overarching the lower back."
    ],
    "pro": [
      "Lehčí: nácvik vzpřímení s lehkým míčem bez odhodu. Těžší: vyšší rychlost stejného míče; hmotnost přidávej až při čisté souhře.",
      "Easier: practise extension with a light ball without release. Harder: greater speed with the same ball; add weight only with consistent coordination."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_mb_backward",
    "ez": null,
    "hd": null,
    "foc": [
      "Sílu vytváří napnutí nohou a kyčlí.",
      "Generate force by extending the legs and hips."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Backward Overhead Medicine-Ball Throw",
      "url": "https://www.nsca.com/education/articles/nsca-coach/from-basic-to-dynamic-medicine-ball-training-for-the-multi-sport-high-school-athlete/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_single_reach",
    "cz": "Dosah volnou nohou ve stoji jednonož",
    "en": "Single-Leg Balance Reach",
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "balance_reach",
    "load": "none",
    "pos": [
      "Stůj na jedné noze vedle stabilní opory. Druhou nohu lehce odlehči, pánev drž nad stojnou nohou.",
      "Stand on one leg beside a stable support. Unweight the other leg and keep the pelvis over the supporting foot."
    ],
    "exe": [
      "Mírně pokrč stojnou nohu a volnou špičkou dosáhni do strany. Lehce se dotkni země a vrať se, bez přenesení váhy na volnou nohu.",
      "Bend the supporting leg slightly and reach the free toe sideways. Touch lightly and return without shifting weight onto the reaching foot."
    ],
    "wat": [
      "Koleno stojné nohy sleduje chodidlo. Délka dosahu nesmí vynutit pád pánve nebo ztrátu rovnováhy.",
      "Keep the supporting knee aligned with the foot. Do not reach so far that the pelvis drops or balance is lost."
    ],
    "pro": [
      "Lehčí: opora prsty ruky a krátký dosah. Těžší: bez opory, delší dosah a další směry po jednom.",
      "Easier: fingertip support and a short reach. Harder: no hand support, a longer reach and additional directions one at a time."
    ],
    "J": {
      "kyc": 1,
      "kol": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_single_reach",
    "ez": null,
    "hd": null,
    "foc": [
      "Mírně pokrč stojnou nohu a volnou špičkou dosáhni do strany.",
      "Bend the supporting leg slightly and reach the free toe sideways."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Single-Leg Balance Reach Frontal Plane",
      "url": "https://www.nasm.org/resource-center/exercise-library/single-leg-balance-reach-frontal-plane"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hip_airplane",
    "cz": "Rotace pánve ve stoji jednonož s oporou",
    "en": "Supported Hip Airplane",
    "pat": "mobilita",
    "eq": [
      "telo",
      "zed"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "hip_rotation_control",
    "load": "none",
    "pos": [
      "Opři prsty rukou o pevnou oporu. Předkloň se na jedné noze z kyčle, druhou nohu natáhni dozadu; koleno stojné nohy mírně pokrč.",
      "Use fingertip support. Hinge over one leg with the other leg extended behind and a soft supporting knee."
    ],
    "exe": [
      "Pomalu otevírej a zavírej pánev kolem kyčle stojné nohy. Trup a volná noha se otáčejí společně v malém rozsahu.",
      "Slowly open and close the pelvis around the supporting hip. Move torso and free leg together through a small range."
    ],
    "wat": [
      "Nesnaž se získat rozsah kroucením kolena nebo prohnutím beder. Opora je součást nácviku.",
      "Do not create range by twisting the knee or arching the lower back. Support is part of the drill."
    ],
    "pro": [
      "Lehčí: menší předklon a menší rotace s pevnější oporou. Těžší: méně opory a pomalejší návrat; bez opory až při jisté kontrole.",
      "Easier: a shallower hinge and smaller rotation with more support. Harder: less support and a slower return; go unsupported only with reliable control."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hip_airplane",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu otevírej a zavírej pánev kolem kyčle stojné nohy.",
      "Slowly open and close the pelvis around the supporting hip."
    ],
    "source": {
      "author": "Greg Lehman",
      "document": "Hip Airplane Exercise Pictures — Greg Lehman",
      "url": "https://www.greglehman.ca/blog/2011/01/22/hip-airplane-exercise-pictures"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_bentknee_calf",
    "cz": "Výpon s pokrčenými koleny s oporou",
    "en": "Supported Bent-Knee Calf Raise",
    "pat": "drep",
    "eq": [
      "telo",
      "zed"
    ],
    "mp": [
      "cal"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "calf_bentknee",
    "load": "none",
    "ez": "calfraise",
    "hd": "seatedcalf",
    "pos": [
      "Opři ruce o zeď, chodidla pod boky a kolena mírně pokrčená. Patu nech na zemi.",
      "Place hands on a wall with feet under the hips and knees slightly bent. Begin with heels down."
    ],
    "exe": [
      "Při stejném pokrčení kolen zvedni paty, krátce zastav a pomalu je spusť. Tlak rozlož přes přední část chodidel.",
      "Keep the knee bend while lifting the heels, pause and lower slowly. Distribute pressure across the forefoot."
    ],
    "wat": [
      "Nepropínej kolena při výponu a nepřeklápěj kotníky ven. Rozsah má zůstat bez bolesti.",
      "Do not straighten the knees as you rise or roll the ankles outward. Stay within a pain-free range."
    ],
    "pro": [
      "Lehčí: menší zdvih na obou nohách. Těžší: delší pauza nahoře, potom jedna noha s oporou nebo zatížený výpon vsedě.",
      "Easier: a smaller two-leg lift. Harder: a longer top pause, then one leg with support or a loaded seated calf raise."
    ],
    "J": {
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_bentknee_calf",
    "foc": [
      "Při stejném pokrčení kolen zvedni paty, krátce zastav a pomalu je spusť.",
      "Keep the knee bend while lifting the heels, pause and lower slowly."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Foot and Ankle Conditioning Program - OrthoInfo - AAOS",
      "url": "https://www.orthoinfo.org/recovery/foot-and-ankle-conditioning-program"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_adduction",
    "cz": "Přinožování na spodní kladce",
    "en": "Standing Cable Hip Adduction",
    "pat": "drep",
    "eq": [
      "kladka"
    ],
    "mp": [
      "add"
    ],
    "ms": [
      "glu"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_adduction",
    "ez": "hipadduction",
    "pos": [
      "Připni manžetu na nohu blíže spodní kladce. Postav se bokem ke stroji a drž pevné madlo.",
      "Attach an ankle cuff to the leg nearest the low pulley. Stand side-on and hold a stable handle."
    ],
    "exe": [
      "Táhni připnutou nohu směrem ke stojné noze a jen mírně přes střed. Pomalu se vrať bez pohybu pánve.",
      "Draw the working leg toward and slightly across the supporting leg. Return slowly without moving the pelvis."
    ],
    "wat": [
      "Manžeta musí držet. Lanko se nesmí zachytávat o stojnou nohu; nepohybuj se švihem.",
      "Secure the cuff. Keep the cable clear of the supporting leg and avoid swinging."
    ],
    "pro": [
      "Lehčí: lehčí kladka a kratší rozsah nebo stroj vsedě. Těžší: více kontrolovaných opakování a malý přírůstek zátěže.",
      "Easier: lighter load and shorter range or a seated machine. Harder: more controlled repetitions and a small load increase."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_adduction",
    "hd": null,
    "foc": [
      "Táhni připnutou nohu směrem ke stojné noze a jen mírně přes střed.",
      "Draw the working leg toward and slightly across the supporting leg."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Hip Adduction",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/104/standing-hip-adduction/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_abduction",
    "cz": "Unožování na spodní kladce",
    "en": "Standing Cable Hip Abduction",
    "pat": "drep",
    "eq": [
      "kladka"
    ],
    "mp": [
      "glu"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_abduction",
    "ez": "hipabduction",
    "pos": [
      "Připni manžetu na vzdálenější nohu od spodní kladky. Stůj bokem s rukou na pevném madle.",
      "Attach a cuff to the leg farther from the low pulley. Stand side-on with one hand on a stable handle."
    ],
    "exe": [
      "Veď připnutou nohu do strany v malém rozsahu, špička přibližně vpřed. Pomalu ji vrať.",
      "Move the working leg sideways through a small range with the toes roughly forward. Return slowly."
    ],
    "wat": [
      "Neukláněj trup a nevytahuj bok vzhůru. Kabel veď bezpečně před stojnou nohou.",
      "Do not lean the torso or hike the hip. Keep the cable safely in front of the supporting leg."
    ],
    "pro": [
      "Lehčí: menší odpor nebo unožení bez zátěže s oporou. Těžší: krátká pauza v krajní poloze, pak malý přírůstek odporu.",
      "Easier: less resistance or an unloaded supported leg raise. Harder: pause at the end of the range, then add a little resistance."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_abduction",
    "hd": null,
    "foc": [
      "Veď připnutou nohu do strany v malém rozsahu, špička přibližně vpřed.",
      "Move the working leg sideways through a small range with the toes roughly forward."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Hip Abduction",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/155/standing-hip-abduction/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_kickback",
    "cz": "Zanožování na spodní kladce",
    "en": "Standing Cable Hip Extension",
    "pat": "ohyb",
    "eq": [
      "kladka"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "ham"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_extension_isolation",
    "ez": "glutebridge",
    "pos": [
      "Stůj čelem ke spodní kladce, manžetu upevni nad kotník. Drž oporu a mírně se předkloň z kyčlí.",
      "Face the low pulley with a cuff secured above the ankle. Hold a support and hinge slightly."
    ],
    "exe": [
      "Veď nohu krátce dozadu z kyčle. Pánev zůstává čelem ke stroji a bedra nemění tvar. Vrať se pomalu.",
      "Move the leg a short distance backward from the hip. Keep the pelvis square and the lower back steady. Return slowly."
    ],
    "wat": [
      "Výška nohy není cíl. Jakmile se prohýbají bedra nebo otáčí pánev, zkrať rozsah.",
      "Leg height is not the goal. Reduce range when the back arches or pelvis rotates."
    ],
    "pro": [
      "Lehčí: menší odpor a rozsah. Těžší: pauza v zanožení, více čistých opakování a potom malý přírůstek odporu.",
      "Easier: less resistance and range. Harder: pause in extension, add controlled repetitions and then a little resistance."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_kickback",
    "hd": null,
    "foc": [
      "Veď nohu krátce dozadu z kyčle.",
      "Move the leg a short distance backward from the hip."
    ],
    "source": {
      "author": "ExRx.net",
      "document": "Cable Standing Hip Extension",
      "url": "https://exrx.net/WeightExercises/GluteusMaximus/CBStandingHipExtension"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_smith_squat",
    "cz": "Dřep ve Smithově stroji",
    "en": "Smith Machine Squat",
    "pat": "drep",
    "eq": [
      "stroj"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 2,
    "family": "squat_machine",
    "ez": "goblet",
    "pos": [
      "Nastav osu na horní část zad a dorazy těsně pod plánovanou hloubku. Postoj vyzkoušej s prázdnou osou podle sklonu vedení stroje.",
      "Set the bar across the upper back and stops just below the planned depth. Test foot position with the empty bar for this machine’s rail angle."
    ],
    "exe": [
      "Odhákni osu, dřepni s celými chodidly na zemi a vrať se tlakem nohama. Po sérii bezpečně zahákni oba konce.",
      "Unrack, squat while keeping the feet planted and drive up through the legs. Secure both hooks after the set."
    ],
    "wat": [
      "Vedená dráha nenahrazuje dorazy. Nenutíš tělo do postoje, který tlačí v kloubech.",
      "A guided path does not replace safety stops. Do not force a foot position that causes joint discomfort."
    ],
    "pro": [
      "Lehčí: menší zátěž a kontrolovaný rozsah. Těžší: postupně přidej rozsah nebo zátěž; záznam drž odděleně od volné osy.",
      "Easier: less load and a controlled range. Harder: gradually add range or load; track this separately from free-bar squats."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_smith_squat",
    "hd": null,
    "foc": [
      "Odhákni osu, dřepni s celými chodidly na zemi a vrať se tlakem nohama.",
      "Unrack, squat while keeping the feet planted and drive up through the legs."
    ],
    "source": {
      "author": "Life Fitness",
      "document": "Life Fitness Smith Machine | Life Fitness",
      "url": "https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-smith-machine"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_smith_bench",
    "cz": "Tlak na rovné lavici ve Smithově stroji",
    "en": "Smith Machine Bench Press",
    "pat": "tlak",
    "eq": [
      "stroj",
      "lavice"
    ],
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 1,
    "family": "push_horizontal",
    "ez": "machinechestpress",
    "pos": [
      "Pevnou lavici postav tak, aby osa klesala k dolní části hrudníku. Nastav dorazy nad úroveň, kde by tě osa přimáčkla.",
      "Position a stable bench so the bar descends toward the lower chest. Set stops above the point where the bar could trap you."
    ],
    "exe": [
      "S chodidly na zemi odhákni osu, pomalu ji spusť do pohodlného rozsahu a vytlač vzhůru.",
      "With feet grounded, unrack, lower slowly to a comfortable range and press upward."
    ],
    "wat": [
      "Před zátěží ověř zaháknutí a polohu lavice. Lokty nemusí být rozevřené kolmo k trupu.",
      "Test the hooks and bench position before adding load. The elbows need not flare perpendicular to the torso."
    ],
    "pro": [
      "Lehčí: prázdná osa nebo lehčí stroj. Těžší: více čistých opakování a potom menší přírůstek zátěže.",
      "Easier: the empty bar or a lighter machine. Harder: more controlled repetitions followed by a small load increase."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_smith_bench",
    "hd": null,
    "foc": [
      "S chodidly na zemi odhákni osu, pomalu ji spusť do pohodlného rozsahu a vytlač vzhůru.",
      "With feet grounded, unrack, lower slowly to a comfortable range and press upward."
    ],
    "source": {
      "author": "Life Fitness",
      "document": "Life Fitness Smith Machine | Life Fitness",
      "url": "https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-smith-machine"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_smith_incline",
    "cz": "Tlak na šikmé lavici ve Smithově stroji",
    "en": "Smith Machine Incline Bench Press",
    "pat": "tlak",
    "eq": [
      "stroj",
      "lavice"
    ],
    "mp": [
      "che",
      "sho"
    ],
    "ms": [
      "tri"
    ],
    "S": 2,
    "C": 2,
    "family": "push_incline",
    "ez": "ex26_smith_bench",
    "pos": [
      "Nastav lavici přibližně na 30° a vyzkoušej její polohu pod osou. Osa směřuje k horní části hrudníku; nastav ochranné dorazy.",
      "Set a bench around 30° and test its position under the bar. The bar approaches the upper chest; set safety stops."
    ],
    "exe": [
      "Spouštěj osu pomalu s předloktími pod ní. Vytlač ji vzhůru bez odlepení pánve od lavice.",
      "Lower slowly with forearms beneath the bar. Press up without lifting the pelvis from the bench."
    ],
    "wat": [
      "Netlač osu ke krku. Pokud vedená dráha nevyhovuje ramenům, uprav polohu nebo zvol jednoručky.",
      "Do not lower toward the neck. Adjust position or use dumbbells if the fixed path does not suit the shoulders."
    ],
    "pro": [
      "Lehčí: menší zátěž a mírnější sklon. Těžší: více čistých opakování, potom malý přírůstek zátěže při stejném sklonu.",
      "Easier: lighter load and a gentler incline. Harder: more controlled repetitions, then a small load increase at the same incline."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_smith_incline",
    "hd": null,
    "foc": [
      "Spouštěj osu pomalu s předloktími pod ní.",
      "Lower slowly with forearms beneath the bar."
    ],
    "source": {
      "author": "Life Fitness",
      "document": "Life Fitness Smith Machine | Life Fitness",
      "url": "https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-smith-machine"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_smith_rdl",
    "cz": "Rumunský mrtvý tah ve Smithově stroji",
    "en": "Smith Machine Romanian Deadlift",
    "pat": "ohyb",
    "eq": [
      "stroj"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "low",
      "fore"
    ],
    "S": 3,
    "C": 2,
    "family": "hinge_rdl",
    "ez": null,
    "pos": [
      "Stůj u osy s chodidly pod boky. Vyzkoušej polohu vzhledem k vedení, odhákni osu u stehen a kolena mírně povol.",
      "Stand at the bar with feet under the hips. Test position relative to the rails, unrack at thigh height and soften the knees."
    ],
    "exe": [
      "Posouvej boky dozadu a nech osu klesat blízko nohou. Zastav před ztrátou polohy zad a narovnej se z kyčlí.",
      "Push the hips backward as the bar descends close to the legs. Stop before losing back position and extend the hips to stand."
    ],
    "wat": [
      "Nesnaž se dosáhnout na zem za každou cenu. Vedení stroje musí dovolit udržet rovnováhu nad chodidly.",
      "Do not chase the floor. The rail path must let you balance over the feet."
    ],
    "pro": [
      "Lehčí: prázdná osa a kratší rozsah. Těžší: plnější kontrolovaný rozsah a pak zátěž; stroj má vlastní záznam výkonu.",
      "Easier: the empty bar and a shorter range. Harder: a fuller controlled range and then load; track the machine separately."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_smith_rdl",
    "hd": null,
    "foc": [
      "Posouvej boky dozadu a nech osu klesat blízko nohou.",
      "Push the hips backward as the bar descends close to the legs."
    ],
    "source": {
      "author": "Life Fitness",
      "document": "Life Fitness Smith Machine | Life Fitness",
      "url": "https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-smith-machine"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_sumo_squat",
    "cz": "Široký dřep s velkou činkou",
    "en": "Wide-Stance Barbell Squat",
    "pat": "drep",
    "eq": [
      "cinka"
    ],
    "mp": [
      "qua",
      "glu",
      "add"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "squat_wide",
    "ez": "goblet",
    "pos": [
      "Osa leží na horní části zad. Zaujmi pohodlný širší postoj s vytočenými špičkami, v kleci s nastavenými dorazy.",
      "Rest the bar across the upper back. Take a comfortable wide stance with toes turned out in a rack with safety stops."
    ],
    "exe": [
      "Dřepuj mezi kyčle s koleny ve směru chodidel. Vrať se vzhůru tlakem celých chodidel do země.",
      "Squat between the hips with knees following the feet. Rise by pressing the whole feet into the floor."
    ],
    "wat": [
      "Extrémní šířka není cíl. Hloubku i postoj přizpůsob kyčlím bez ostrého tahu v tříslech.",
      "Extreme width is not the goal. Match depth and stance to your hips without sharp groin tension."
    ],
    "pro": [
      "Lehčí: široký goblet dřep s lehkou činkou. Těžší: stejná technika s více opakováními nebo malým přírůstkem zátěže.",
      "Easier: a light wide-stance goblet squat. Harder: keep the technique and add repetitions or a small load increase."
    ],
    "J": {
      "kyc": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_sumo_squat",
    "hd": null,
    "foc": [
      "Dřepuj mezi kyčle s koleny ve směru chodidel.",
      "Squat between the hips with knees following the feet."
    ],
    "source": {
      "author": "Hevy",
      "document": "Barbell Sumo Squat: How-to, Variations, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/sumo-squat-barbell/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_db_snatch",
    "cz": "Trh jednoručkou z visu",
    "en": "Hang Dumbbell Snatch",
    "pat": "ohyb",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "glu",
      "sho"
    ],
    "ms": [
      "ham",
      "qua",
      "tra",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "sideMode": "perSide",
    "family": "snatch_db",
    "tier": "specialist",
    "pos": [
      "Drž lehkou jednoručku mezi stehny, chodidla pod boky a volný prostor nad hlavou. Nejprve zvládni stabilní držení činky nad hlavou.",
      "Hold a light dumbbell between the thighs with feet under the hips and clear overhead space. First master a stable overhead hold."
    ],
    "exe": [
      "Z krátkého předklonu rychle napni kyčle a veď činku blízko těla vzhůru. Podtoč ruku a zachyť činku na natažené paži, pak ji kontrolovaně vrať.",
      "Extend the hips rapidly from a short hinge and guide the dumbbell close to the body. Turn the hand under it and receive on a straight arm, then lower with control."
    ],
    "wat": [
      "Nejde o pomalý zdvih ramenem. Nepokračuj při nejistém zachycení nebo bolesti; techniku nacvič s trenérem.",
      "This is not a slow shoulder raise. Stop with unstable catches or pain; learn the technique with a coach."
    ],
    "pro": [
      "Lehčí: lehčí činka a samostatný nácvik tahu a držení nad hlavou. Těžší: plynulá jednotlivá opakování, potom mírně vyšší zátěž.",
      "Easier: lighter load and separate pull and overhead-hold practice. Harder: consistent single repetitions, then a modest load increase."
    ],
    "J": {
      "ram": 2,
      "kyc": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_db_snatch",
    "ez": null,
    "hd": null,
    "foc": [
      "Z krátkého předklonu rychle napni kyčle a veď činku blízko těla vzhůru.",
      "Extend the hips rapidly from a short hinge and guide the dumbbell close to the body."
    ],
    "source": {
      "author": "CrossFit",
      "document": "CrossFit | The Dumbbell Squat Snatch",
      "url": "https://www.crossfit.com/essentials/the-dumbbell-snatch"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_db_thruster",
    "cz": "Dřep s výtlakem jednoruček",
    "en": "Dumbbell Thruster",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "qua",
      "glu",
      "sho"
    ],
    "ms": [
      "tri",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "squat_press",
    "ez": "goblet",
    "pos": [
      "Drž dvě lehké jednoručky u ramen, lokty pod nimi a chodidla v pohodlném dřepovém postoji.",
      "Hold two light dumbbells at the shoulders with elbows beneath them and a comfortable squat stance."
    ],
    "exe": [
      "Dřepni pod kontrolou. Při vstávání využij tlak nohou k navazujícímu výtlaku činek nad hlavu. Vrať je k ramenům před dalším dřepem.",
      "Squat with control. Use the leg drive while standing to continue into an overhead press. Return the dumbbells to the shoulders before the next squat."
    ],
    "wat": [
      "Nedoháněj zátěž prohnutím beder. Při ztrátě koordinace sérii přeruš, i když časový interval ještě neskončil.",
      "Do not compensate by arching the lower back. Stop when coordination deteriorates even if the interval is unfinished."
    ],
    "pro": [
      "Lehčí: dřep a tlak nacvič zvlášť s menší zátěží. Těžší: spoj je plynule a přidej kvalitní opakování; až potom zátěž.",
      "Easier: practise the squat and press separately with less load. Harder: link them smoothly and add quality repetitions before increasing load."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "conditioning",
    "goalRole": "conditioning",
    "genRule": "explicit",
    "variantKey": "ex26_db_thruster",
    "hd": null,
    "foc": [
      "Dřepni pod kontrolou.",
      "Squat with control."
    ],
    "source": {
      "author": "CrossFit",
      "document": "CrossFit | The Dumbbell Thruster",
      "url": "https://www.crossfit.com/essentials/the-dumbbell-thruster"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_db_supported_row",
    "cz": "Přítahy jednoruček s oporou hrudníku",
    "en": "Chest-Supported Dumbbell Row",
    "pat": "tah",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "lat",
      "upb"
    ],
    "ms": [
      "bic",
      "sho"
    ],
    "S": 2,
    "C": 1,
    "family": "pull_horizontal",
    "ez": "chestsupprow",
    "pos": [
      "Nastav pevnou lavici přibližně na 30 až 45°. Opři hrudník, chodidla polož na zem a nech činky viset pod rameny.",
      "Set a stable bench around 30–45°. Support the chest, place feet on the floor and let the dumbbells hang below the shoulders."
    ],
    "exe": [
      "Přitáhni lokty k trupu a činky k dolním žebrům. Hrudník zůstává na lavici. Krátce zastav a spouštěj, dokud se paže pohodlně nenatáhnou.",
      "Row the elbows toward the torso and dumbbells toward the lower ribs. Keep the chest on the bench. Pause briefly and lower until the arms comfortably straighten."
    ],
    "wat": [
      "Nezvedej hrudník ani ramena k uším. Lavice se nesmí posouvat. Činky po sérii bezpečně odlož.",
      "Do not lift the chest or shrug. The bench must not slide. Set the dumbbells down safely after the set."
    ],
    "pro": [
      "Lehčí: menší činky nebo přítahy na stroji s oporou. Těžší: nejprve více čistých opakování, potom malý přírůstek zátěže; zachovej stejnou oporu.",
      "Easier: lighter dumbbells or a supported machine row. Harder: add controlled repetitions, then a small load increase while retaining support."
    ],
    "J": {
      "ram": 1,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_db_supported_row",
    "hd": null,
    "foc": [
      "Hrudník zůstává na lavici, lokty táhnou k bokům.",
      "Keep the chest supported and pull elbows toward the hips."
    ],
    "source": {
      "author": "Hevy",
      "document": "Chest-Supported Dumbbell Row: How-to, Tips & Mistakes",
      "url": "https://www.hevyapp.com/exercises/chest-supported-incline-row-dumbbell/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_pendlay_row",
    "cz": "Přítah velké činky ze země",
    "en": "Pendlay Row",
    "pat": "tah",
    "eq": [
      "cinka"
    ],
    "mp": [
      "lat",
      "upb"
    ],
    "ms": [
      "bic",
      "low",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "pull_horizontal",
    "ez": "ex26_db_supported_row",
    "pos": [
      "Postav se k ose nad středem chodidel. Předkloň se z kyčlí, pokrč kolena a drž pevný trup téměř vodorovně.",
      "Stand with the bar over midfoot. Hinge, bend the knees and brace a nearly horizontal torso."
    ],
    "exe": [
      "Z klidné osy přitáhni činku k dolní části hrudníku. Kontrolovaně ji vrať na zem a před dalším opakováním znovu nastav trup.",
      "Row the stationary bar toward the lower chest. Lower it to the floor under control and reset the torso before each repetition."
    ],
    "wat": [
      "Nezvedej trup švihem a neodrážej kotouče. Pokud nedosáhneš na zem s udržitelnou polohou zad, zvedni osu na nízké bloky.",
      "Do not heave the torso or bounce the plates. Raise the bar on low blocks if you cannot reach it with a controllable back position."
    ],
    "pro": [
      "Lehčí: přítahy s oporou hrudníku nebo nižší zátěž. Těžší: přidávej zátěž pouze při stejné poloze trupu a úplném zastavení každého opakování.",
      "Easier: chest-supported rows or less load. Harder: increase load only while preserving torso position and a complete stop between repetitions."
    ],
    "J": {
      "ram": 1,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_pendlay_row",
    "hd": null,
    "foc": [
      "Z klidné osy přitáhni činku k dolní části hrudníku.",
      "Row the stationary bar toward the lower chest."
    ],
    "source": {
      "author": "Hevy",
      "document": "Pendlay Row: How-to, Benefits, Variations, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/pendlay-row/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_onearm_pulldown",
    "cz": "Stahování horní kladky jednoruč",
    "en": "Single-Arm Lat Pulldown",
    "pat": "tah",
    "eq": [
      "kladka",
      "lavice"
    ],
    "mp": [
      "lat"
    ],
    "ms": [
      "bic",
      "upb"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "pull_vertical",
    "ez": "latpull",
    "pos": [
      "Sedni si pod horní kladku, zajisti stehna a uchop jedno madlo. Začni paží nad hlavou v pohodlném dosahu.",
      "Sit under a high pulley, secure the thighs and hold one handle. Start with the arm overhead in a comfortable reach."
    ],
    "exe": [
      "Veď loket dolů k boku. Hrudník a pánev zůstávají klidné. Pomalu vrať paži vzhůru a dovol lopatce přirozený pohyb.",
      "Bring the elbow down toward your side. Keep chest and pelvis steady. Slowly reach overhead again, allowing natural scapular movement."
    ],
    "wat": [
      "Netahej madlo za hlavu ani se výrazně nezakláněj. Rozsah nesmí vyvolávat tlak v rameni.",
      "Do not pull behind the head or lean far backward. Avoid a range that pinches the shoulder."
    ],
    "pro": [
      "Lehčí: nižší odpor nebo obouruční kladka. Těžší: více opakování a následně vyšší odpor bez rotace trupu. Každou stranu zapisuj zvlášť.",
      "Easier: lower resistance or bilateral pulldowns. Harder: add repetitions, then resistance without trunk rotation. Record each side separately."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_onearm_pulldown",
    "hd": null,
    "foc": [
      "Veď loket dolů k boku.",
      "Bring the elbow down toward your side."
    ],
    "source": {
      "author": "Hevy",
      "document": "Single Arm Lat Pulldown: How-to, Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/how-to-single-arm-lat-pulldown/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_machine_pulldown",
    "cz": "Stahování ramen stroje k tělu",
    "en": "Lever Lat Pulldown Machine",
    "pat": "tah",
    "eq": [
      "stroj"
    ],
    "mp": [
      "lat"
    ],
    "ms": [
      "bic",
      "upb"
    ],
    "S": 2,
    "C": 1,
    "family": "pull_vertical",
    "pos": [
      "Nastav sed a stehenní opěru tak, aby madla byla dosažitelná bez vyvěšení trupu. Uchop obě páky stroje.",
      "Adjust the seat and thigh pad so the handles are reachable without hanging the torso. Hold both machine handles."
    ],
    "exe": [
      "Stahuj lokty k bokům, s krátkou pauzou dole. Vrať páky pomalu a nech ramena přirozeně stoupat s pažemi.",
      "Pull the elbows toward the sides and pause briefly. Return the levers slowly, letting the shoulders move naturally with the arms."
    ],
    "wat": [
      "Neodrážej závaží ani se neodlep od sedu. Různé stroje mají různé dráhy; nastavení přizpůsob vlastnímu dosahu.",
      "Do not bounce the load or lift off the seat. Machines have different paths; adapt the setup to your reach."
    ],
    "pro": [
      "Lehčí: menší zátěž a pohodlnější rozsah. Těžší: postupně více opakování nebo zátěže. Přechod na shyb není povinný ani přímo srovnatelný v kilogramech.",
      "Easier: less load and comfortable range. Harder: gradually add repetitions or load. Moving to pull-ups is optional and kilograms are not directly comparable."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_machine_pulldown",
    "ez": null,
    "hd": null,
    "foc": [
      "Stahuj lokty k bokům, s krátkou pauzou dole.",
      "Pull the elbows toward the sides and pause briefly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Lat Pulldown (Machine): How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-lat-pulldown-machine/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_band_pulldown",
    "cz": "Stahování gumy shora v kleku",
    "en": "Kneeling Band Lat Pulldown",
    "pat": "tah",
    "eq": [
      "guma"
    ],
    "mp": [
      "lat"
    ],
    "ms": [
      "bic",
      "upb"
    ],
    "S": 1,
    "C": 1,
    "family": "pull_vertical",
    "hd": null,
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Gumu upevni do spolehlivé vysoké kotvy. Klekni si před ni, podlož kolena a uchop oba konce nad hlavou.",
      "Secure a band to a reliable high anchor. Kneel in front, pad the knees and hold both ends overhead."
    ],
    "exe": [
      "Stahuj lokty dolů vedle žeber a kontrolovaně vracej paže nahoru. Drž žebra nad pánví.",
      "Pull the elbows down beside the ribs and return the arms overhead under control. Keep ribs over pelvis."
    ],
    "wat": [
      "Předem ověř kotvu a nepoškozenou gumu. Nezakláněj trup proti odporu.",
      "Check the anchor and band for damage first. Do not lean backward against the resistance."
    ],
    "pro": [
      "Lehčí: slabší guma nebo menší předpětí. Těžší: silnější guma se stejnou kotvou; kladka umožní jemnější dávkování odporu.",
      "Easier: a lighter band or less pretension. Harder: a stronger band with the same anchor; a cable allows finer resistance changes."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_band_pulldown",
    "ez": null,
    "foc": [
      "Stahuj lokty dolů vedle žeber a kontrolovaně vracej paže nahoru.",
      "Pull the elbows down beside the ribs and return the arms overhead under control."
    ],
    "source": {
      "author": "Hevy",
      "document": "Band Lat Pulldown: How-to, PT Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/lat-pulldown-band/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cable_facepull",
    "cz": "Přítah lana na kladce k obličeji",
    "en": "Cable Rope Face Pull",
    "pat": "tah",
    "eq": [
      "kladka"
    ],
    "mp": [
      "sho",
      "upb"
    ],
    "ms": [
      "rcuff"
    ],
    "S": 1,
    "C": 2,
    "family": "face_pull",
    "ez": "facepull",
    "pos": [
      "Lano nastav zhruba do výšky obličeje. Postav se stabilně, paže směřují ke kladce a žebra jsou nad pánví.",
      "Set the rope around face height. Stand securely with arms reaching toward the pulley and ribs over the pelvis."
    ],
    "exe": [
      "Přitahuj lano k čelu a jeho konce od sebe. Lokty veď pohodlně do stran. Vracej pomalu bez pohybu trupu.",
      "Pull the rope toward the forehead while separating its ends. Let the elbows travel comfortably outward. Return slowly without moving the torso."
    ],
    "wat": [
      "Nekrč ramena k uším a nelámej zápěstí. Rozsah zevní rotace přizpůsob rameni, ne představě o správném úhlu.",
      "Do not shrug or bend the wrists sharply. Match external-rotation range to the shoulder rather than forcing a prescribed angle."
    ],
    "pro": [
      "Lehčí: lehčí odpor či guma. Těžší: delší kontrolovaná pauza a teprve potom vyšší odpor bez zaklánění.",
      "Easier: less resistance or a band. Harder: a longer controlled pause, then more resistance without leaning back."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_facepull",
    "hd": null,
    "foc": [
      "Přitahuj lano k čelu a jeho konce od sebe.",
      "Pull the rope toward the forehead while separating its ends."
    ],
    "source": {
      "author": "Hevy",
      "document": "Face Pulls: How-to, Tips, Variations, Alternatives, Mistakes",
      "url": "https://www.hevyapp.com/exercises/face-pull/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bb_shrug",
    "cz": "Krčení ramen s velkou činkou",
    "en": "Barbell Shrug",
    "pat": "tah",
    "eq": [
      "cinka"
    ],
    "mp": [
      "tra"
    ],
    "ms": [
      "fore"
    ],
    "S": 2,
    "C": 1,
    "family": "shrug",
    "ez": "an_dbshrug",
    "pos": [
      "Ve stoji drž osu před stehny nadhmatem. Paže jsou natažené, kolena měkká a hlava nad trupem.",
      "Stand holding a bar in front of the thighs with an overhand grip. Keep arms straight, knees soft and head aligned."
    ],
    "exe": [
      "Zvedni ramena směrem vzhůru, krátce zastav a pomalu je spusť. Lokty po celou dobu zůstávají natažené.",
      "Raise the shoulders upward, pause briefly and lower slowly. Keep the elbows straight throughout."
    ],
    "wat": [
      "Nekruž rameny, nevysunuj hlavu a nepomáhej si podřepem. Zátěž nesmí vytrhávat úchop.",
      "Do not roll the shoulders, jut the head or bounce with the legs. Use a load you can grip securely."
    ],
    "pro": [
      "Lehčí: lehčí osa nebo jednoručky. Těžší: více opakování a poté váha při zachování plného kontrolovaného zdvihu.",
      "Easier: a lighter bar or dumbbells. Harder: more repetitions, then load while preserving a controlled shoulder lift."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_bb_shrug",
    "hd": null,
    "foc": [
      "Zvedni ramena směrem vzhůru, krátce zastav a pomalu je spusť.",
      "Raise the shoulders upward, pause briefly and lower slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Barbell Shrug: How-to, Common Mistakes & Variations",
      "url": "https://www.hevyapp.com/exercises/shrug-barbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_db_decline_press",
    "cz": "Tlak jednoruček na lavici hlavou dolů",
    "en": "Decline Dumbbell Bench Press",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "che"
    ],
    "ms": [
      "tri",
      "sho"
    ],
    "S": 3,
    "C": 2,
    "family": "press_horizontal",
    "ez": "an_dbbench",
    "pos": [
      "Použij mírně sklopenou lavici s pevnou oporou nohou. S dopomocí bezpečně zaujmi leh a drž činky nad hrudníkem.",
      "Use a mildly declined bench with secure leg support. Enter the position safely with assistance and hold the dumbbells over the chest."
    ],
    "exe": [
      "Spouštěj činky k boční části hrudníku, předloktí přibližně svisle. Vytlač je nahoru bez srážení činek.",
      "Lower the dumbbells beside the chest with forearms roughly vertical. Press upward without banging the dumbbells together."
    ],
    "wat": [
      "Předem si zajisti bezpečné podání a odložení. Nezvyšuj sklon kvůli většímu rozsahu. Při závrati cvik ukonči.",
      "Arrange safe handoff and unloading first. Do not increase the decline to chase range. Stop if dizzy."
    ],
    "pro": [
      "Lehčí: rovná lavice nebo menší činky. Těžší: přidej zátěž až po zvládnutí kontrolovaného rozsahu a bezpečného nástupu i odložení.",
      "Easier: a flat bench or lighter dumbbells. Harder: add load only after mastering the range and safe setup and unloading."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_db_decline_press",
    "hd": null,
    "foc": [
      "Spouštěj činky k boční části hrudníku, předloktí přibližně svisle.",
      "Lower the dumbbells beside the chest with forearms roughly vertical."
    ],
    "source": {
      "author": "Hevy",
      "document": "Decline Dumbbell Bench Press: How-to, Tips & More",
      "url": "https://www.hevyapp.com/exercises/how-to-decline-bench-press-dumbbell/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_db_flat_fly",
    "cz": "Rozpažování s jednoručkami na rovné lavici",
    "en": "Flat Dumbbell Fly",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "che"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "family": "chest_fly",
    "pos": [
      "Lehni si na rovnou lavici s chodidly na zemi. Drž lehké činky nad hrudníkem, dlaně proti sobě a lokty mírně pokrčené.",
      "Lie on a flat bench with feet grounded. Hold light dumbbells above the chest, palms facing and elbows slightly bent."
    ],
    "exe": [
      "Otevírej paže do stran v oblouku. Zastav v pohodlném rozsahu, zpravidla kolem úrovně trupu, a stejným obloukem je vrať.",
      "Open the arms sideways in an arc. Stop in a comfortable range, usually around torso level, then reverse the arc."
    ],
    "wat": [
      "Nespouštěj lokty hluboko za tělo a neměň cvik v tlak opakovaným ohýbáním loktů.",
      "Do not lower the elbows far behind the torso or turn the movement into a press by repeatedly bending the elbows."
    ],
    "pro": [
      "Lehčí: menší činky, kratší oblouk nebo pec deck. Těžší: přidej opakování a teprve pak malou zátěž; větší hloubka není nutný postup.",
      "Easier: lighter dumbbells, a shorter arc or pec deck. Harder: add repetitions before small load increments; extra depth is not a required progression."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_db_flat_fly",
    "ez": null,
    "hd": null,
    "foc": [
      "Otevírej paže do stran v oblouku.",
      "Open the arms sideways in an arc."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lying Chest Fly",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_pecdeck",
    "cz": "Rozpažování na prsním stroji",
    "en": "Pec Deck Chest Fly",
    "pat": "tlak",
    "eq": [
      "stroj"
    ],
    "mp": [
      "che"
    ],
    "ms": [
      "sho"
    ],
    "S": 1,
    "C": 1,
    "family": "chest_fly",
    "hd": "ex26_db_flat_fly",
    "pos": [
      "Nastav sed tak, aby madla nebo opěrky byly přibližně ve výšce hrudníku. Záda opři a zvol pohodlnou výchozí šířku.",
      "Adjust the seat so handles or pads sit around chest height. Support the back and choose a comfortable starting width."
    ],
    "exe": [
      "Přibližuj paže před hrudníkem a pomalu je rozevírej. Udržuj trup v kontaktu s opěrou.",
      "Bring the arms together in front of the chest, then open slowly. Keep the torso against the back pad."
    ],
    "wat": [
      "Nepouštěj paže za rozsah, který ovládáš, a nenech závaží dopadat. Vstup do stroje nesmí vyžadovat bolestivé vytočení ramene.",
      "Stay within controlled range and do not drop the stack. Getting into the machine must not require painful shoulder rotation."
    ],
    "pro": [
      "Lehčí: menší odpor a užší výchozí rozevření. Těžší: nejprve plynulý plný tolerovaný rozsah, potom více opakování nebo váhy.",
      "Easier: less resistance and a narrower starting width. Harder: first own your tolerated range, then add repetitions or load."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_pecdeck",
    "ez": null,
    "foc": [
      "Přibližuj paže před hrudníkem a pomalu je rozevírej.",
      "Bring the arms together in front of the chest, then open slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Be a Chest Day Champion — pec deck",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/8972/be-a-chest-day-champion-an-evidence-based-approach-to-training-the-chest/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_seated_bb_press",
    "cz": "Tlak velké činky nad hlavu vsedě",
    "en": "Seated Barbell Overhead Press",
    "pat": "tlak",
    "eq": [
      "cinka",
      "lavice"
    ],
    "mp": [
      "sho"
    ],
    "ms": [
      "tri",
      "tra"
    ],
    "S": 3,
    "C": 2,
    "family": "press_vertical",
    "ez": "an_seateddbpress",
    "pos": [
      "Sedni si do stojanu na lavici s téměř svislou opěrou. Chodidla drž na zemi a osu před horním hrudníkem. Nastav zarážky.",
      "Sit inside a rack on a bench with a nearly upright backrest. Keep feet grounded and the bar at upper-chest level. Set the safeties."
    ],
    "exe": [
      "Vytlač osu před obličejem a pak nad ramena. Hlava se může mírně uhnout dráze. Kontrolovaně vrať osu před hrudník.",
      "Press the bar past the face and over the shoulders. Move the head slightly out of its path. Lower under control in front of the chest."
    ],
    "wat": [
      "Netlač za hlavou a nevytvářej velký bederní záklon. Zarážky a stojan musí umožnit bezpečné ukončení.",
      "Do not press behind the neck or exaggerate lumbar extension. The rack and safeties must allow a safe finish."
    ],
    "pro": [
      "Lehčí: jednoručky vsedě nebo menší zátěž. Těžší: vyšší zátěž při nezměněném opření a dráze. Tlak ve stoji je jiný nárok na stabilitu.",
      "Easier: seated dumbbells or less load. Harder: add load while preserving support and bar path. Standing presses introduce a different stability demand."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_seated_bb_press",
    "hd": null,
    "foc": [
      "Vytlač osu před obličejem a pak nad ramena.",
      "Press the bar past the face and over the shoulders."
    ],
    "source": {
      "author": "Hevy",
      "document": "Seated Overhead Barbell Press: How-to, Tips & More",
      "url": "https://www.hevyapp.com/exercises/seated-overhead-barbell-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_weighted_dip",
    "cz": "Klik na bradlech se zátěží",
    "en": "Weighted Parallel-Bar Dip",
    "pat": "tlak",
    "eq": [
      "bradla",
      "zavazi"
    ],
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho"
    ],
    "S": 4,
    "C": 3,
    "family": "dip",
    "ez": "dips",
    "load": "add",
    "measurementType": "ADDED_WEIGHT_REPS",
    "pos": [
      "Na pevných bradlech zaujmi vzpor. Zátěž bezpečně připevni na opasek tak, aby nenarážela do konstrukce nebo země.",
      "Take a support position on fixed parallel bars. Secure the load on a belt with clearance from the frame and floor."
    ],
    "exe": [
      "Pokrč lokty a spusť se do rozsahu, který ramena snášejí. Plynule vytlač tělo zpět, bez rozhoupání závaží.",
      "Bend the elbows and lower through a shoulder-tolerated range. Press smoothly back up without swinging the load."
    ],
    "wat": [
      "Přidávej váhu až po spolehlivých dipech s vlastní vahou. Neodrážej se ze spodní polohy a počítej s bezpečným nástupem.",
      "Add load only after reliable bodyweight dips. Do not bounce from the bottom and plan safe mounting and dismounting."
    ],
    "pro": [
      "Lehčí: dip bez zátěže nebo s oporou nohou. Těžší: malý přírůstek přidané váhy, až když dokončíš cílové série bez změny hloubky a techniky.",
      "Easier: bodyweight or foot-assisted dips. Harder: add a small amount of external load after completing target sets without changing depth or technique."
    ],
    "J": {
      "ram": 2,
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_weighted_dip",
    "hd": null,
    "foc": [
      "Pokrč lokty a spusť se do rozsahu, který ramena snášejí.",
      "Bend the elbows and lower through a shoulder-tolerated range."
    ],
    "source": {
      "author": "Hevy",
      "document": "Weighted Dip: How-to, Tips, Variations, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/chest-dip-weighted/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_concentration_curl",
    "cz": "Soustředěný bicepsový zdvih v sedu",
    "en": "Concentration Curl",
    "pat": "tah",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "bic"
    ],
    "ms": [
      "fore"
    ],
    "S": 1,
    "C": 1,
    "sideMode": "perSide",
    "family": "elbow_flexion",
    "ez": "dbcurl",
    "pos": [
      "Sedni si s chodidly od sebe. Zadní část nadloktí opři o vnitřní stehno a nech jednoručku pod kolenem.",
      "Sit with feet apart. Brace the back of the upper arm against the inner thigh, dumbbell below the knee."
    ],
    "exe": [
      "Ohnutím lokte zvedni činku k rameni a pomalu spusť. Nadloktí zůstává opřené a zápěstí přibližně rovné.",
      "Curl the dumbbell toward the shoulder and lower slowly. Keep the upper arm supported and wrist roughly straight."
    ],
    "wat": [
      "Netlač samotný hrot lokte do stehna a nezvedej činku pohybem ramene.",
      "Do not press the elbow tip into the thigh or lift by moving the shoulder."
    ],
    "pro": [
      "Lehčí: menší činka. Těžší: více opakování nebo malý přírůstek zátěže bez odlepení paže. Začni slabší stranou.",
      "Easier: a lighter dumbbell. Harder: more repetitions or a small load increase without lifting the upper arm. Start on the weaker side."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_concentration_curl",
    "hd": null,
    "foc": [
      "Ohnutím lokte zvedni činku k rameni a pomalu spusť.",
      "Curl the dumbbell toward the shoulder and lower slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Concentration Curl: How-To, Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/concentration-curl/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_preacher_curl",
    "cz": "Bicepsový zdvih s oporou paží",
    "en": "EZ-Bar Preacher Curl",
    "pat": "tah",
    "eq": [
      "cinka",
      "lavice"
    ],
    "mp": [
      "bic"
    ],
    "ms": [
      "fore"
    ],
    "S": 2,
    "C": 1,
    "family": "elbow_flexion",
    "ez": "dbcurl",
    "pos": [
      "Nastav opěrku pod celá nadloktí, podpaží zůstává pohodlně nad její hranou. Uchop lehkou EZ osu a drž chodidla na zemi.",
      "Set the pad under the upper arms with armpits comfortably above its edge. Hold a light EZ bar and ground the feet."
    ],
    "exe": [
      "Zvedni osu ohnutím loktů a pomalu ji spusť téměř do natažení. Nadloktí drž v kontaktu s opěrkou.",
      "Curl the bar, then lower slowly toward comfortable elbow extension. Keep the upper arms on the pad."
    ],
    "wat": [
      "Nenech váhu prudce napnout lokty dole. Neskláněj a nezvedej celý trup pro překonání zátěže.",
      "Do not let the load snap the elbows straight at the bottom. Avoid rocking the whole torso to lift."
    ],
    "pro": [
      "Lehčí: malá zátěž a kratší spodní rozsah. Těžší: nejprve ovládané natažení, potom opakování a váha.",
      "Easier: less load and a shorter bottom range. Harder: first control extension, then add repetitions and load."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_preacher_curl",
    "hd": null,
    "foc": [
      "Zvedni osu ohnutím loktů a pomalu ji spusť téměř do natažení.",
      "Curl the bar, then lower slowly toward comfortable elbow extension."
    ],
    "source": {
      "author": "Nunes et al., 2020",
      "document": "Cable vs. Barbell Preacher Curl Training — exercise protocol",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_spider_curl",
    "cz": "Bicepsový zdvih vleže hrudníkem na lavici",
    "en": "Spider Curl",
    "pat": "tah",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "bic"
    ],
    "ms": [
      "fore"
    ],
    "S": 2,
    "C": 2,
    "family": "elbow_flexion",
    "ez": "ex26_concentration_curl",
    "pos": [
      "Opři hrudník o šikmou lavici, chodidla o zem. Paže s jednoručkami nech viset svisle před horním okrajem lavice.",
      "Support the chest on an incline bench and feet on the floor. Let arms and dumbbells hang vertically beyond its upper edge."
    ],
    "exe": [
      "Ohnutím loktů přitáhni činky k ramenům. Nadloktí drž přibližně na místě, poté pomalu spouštěj.",
      "Curl the dumbbells toward the shoulders. Keep the upper arms roughly stationary, then lower slowly."
    ],
    "wat": [
      "Hrudník neodlep a činkami nenarážej do konstrukce. Lavice musí mít dostatek prostoru pro paže.",
      "Keep the chest supported and do not hit the frame. The bench must leave enough space for the arms."
    ],
    "pro": [
      "Lehčí: lehké činky nebo soustředěný zdvih vsedě. Těžší: malý přírůstek váhy při stejném postavení nadloktí.",
      "Easier: light dumbbells or seated concentration curls. Harder: a small load increase with unchanged upper-arm position."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_spider_curl",
    "hd": null,
    "foc": [
      "Ohnutím loktů přitáhni činky k ramenům.",
      "Curl the dumbbells toward the shoulders."
    ],
    "source": {
      "author": "Renaissance Periodization",
      "document": "Dumbbell Spider Curl — exercise demonstration",
      "url": "https://www.youtube.com/watch?v=ke2shAeQ0O8"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_zottman_curl",
    "cz": "Zottmanův bicepsový zdvih",
    "en": "Zottman Curl",
    "pat": "tah",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "bic",
      "fore"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "family": "elbow_flexion",
    "ez": "dbcurl",
    "pos": [
      "Ve stoji drž lehké jednoručky vedle těla, dlaně dopředu. Lokty jsou u boků.",
      "Stand with light dumbbells at the sides, palms forward and elbows near the ribs."
    ],
    "exe": [
      "Zvedni činky podhmatem. Nahoře otoč předloktí dlaněmi dolů a pomalu spusť nadhmatem. Dole otoč dlaně zpět.",
      "Curl with palms up. At the top rotate the forearms palms down and lower slowly. Rotate back at the bottom."
    ],
    "wat": [
      "Otáčej předloktím, ne zalomením zápěstí. Použij menší váhu než pro běžný bicepsový zdvih.",
      "Rotate through the forearms rather than bending the wrists. Use less load than for a regular curl."
    ],
    "pro": [
      "Lehčí: běžný zdvih nebo střídání paží. Těžší: prodluž spouštění, poté mírně přidej váhu bez ztráty polohy zápěstí.",
      "Easier: regular curls or alternate arms. Harder: lengthen the lowering phase, then add a little load without losing wrist alignment."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_zottman_curl",
    "hd": null,
    "foc": [
      "Zvedni činky podhmatem.",
      "Curl with palms up."
    ],
    "source": {
      "author": "Hevy",
      "document": "Zottman Curl (Dumbbell): How-to, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-zottman-curl-dumbbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_plate_curl",
    "cz": "Bicepsový zdvih s kotoučem",
    "en": "Weight-Plate Curl",
    "pat": "tah",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "bic"
    ],
    "ms": [
      "fore"
    ],
    "S": 1,
    "C": 1,
    "family": "elbow_flexion",
    "ez": "dbcurl",
    "pos": [
      "Drž kotouč s vhodnými madly oběma rukama před stehny. Lokty nech u těla a zápěstí v pohodlné poloze.",
      "Hold a plate with suitable handles in both hands in front of the thighs. Keep elbows near the torso and wrists comfortable."
    ],
    "exe": [
      "Pokrč lokty a přitáhni kotouč před hrudník. Kontrolovaně vrať, aniž bys houpal trupem.",
      "Bend the elbows to bring the plate in front of the chest. Lower under control without rocking the torso."
    ],
    "wat": [
      "Kotouč drž celou dlaní v bezpečných madlech. Nepoužívej velký kotouč, který nutí zápěstí do nepohodlného úhlu.",
      "Use secure full-hand grips. Avoid a large plate that forces uncomfortable wrist angles."
    ],
    "pro": [
      "Lehčí: lehčí kotouč nebo jednoručky. Těžší: více opakování; přechod mezi kotouči může být příliš velký, proto zátěž nenavyšuj skokově.",
      "Easier: a lighter plate or dumbbells. Harder: add repetitions; plate increments may be large, so avoid abrupt load jumps."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_plate_curl",
    "hd": null,
    "foc": [
      "Pokrč lokty a přitáhni kotouč před hrudník.",
      "Bend the elbows to bring the plate in front of the chest."
    ],
    "source": {
      "author": "Hevy",
      "document": "Plate Curls: How-to, Tips, Variations, Alternatives, Mistakes",
      "url": "https://www.hevyapp.com/exercises/plate-curls/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_hammer_curl",
    "cz": "Kladivový zdvih lana na kladce",
    "en": "Cable Rope Hammer Curl",
    "pat": "tah",
    "eq": [
      "kladka"
    ],
    "mp": [
      "bic",
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "elbow_flexion",
    "ez": null,
    "pos": [
      "Připevni lano ke spodní kladce. Postav se čelem, drž konce dlaněmi proti sobě a lokty u boků.",
      "Attach a rope to a low pulley. Face it, hold the ends with palms facing and elbows near the sides."
    ],
    "exe": [
      "Ohnutím loktů zvedni lano před hrudník a pomalu vrať. Trup zůstává vzpřímený.",
      "Curl the rope toward the chest and return slowly. Keep the torso upright."
    ],
    "wat": [
      "Nepřitahuj rameny ani nevystrkuj lokty dopředu. Vyber odpor, který tě nenutí k záklonu.",
      "Do not shrug or drive the elbows forward. Choose resistance that does not require leaning backward."
    ],
    "pro": [
      "Lehčí: menší odpor. Těžší: přidej opakování nebo jeden malý stupeň závaží při stejném postavení těla.",
      "Easier: less resistance. Harder: add repetitions or one small stack increment while keeping the same body position."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_hammer_curl",
    "hd": null,
    "foc": [
      "Ohnutím loktů zvedni lano před hrudník a pomalu vrať.",
      "Curl the rope toward the chest and return slowly."
    ],
    "source": {
      "author": "Muscle & Strength",
      "document": "Cable Curl (Rope Extension)",
      "url": "https://www.muscleandstrength.com/exercises/rope-cable-curl.html"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_band_hammer_curl",
    "cz": "Kladivový zdvih s gumou",
    "en": "Band Hammer Curl",
    "pat": "tah",
    "eq": [
      "guma"
    ],
    "mp": [
      "bic",
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "elbow_flexion",
    "hd": null,
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Postav se doprostřed gumy a drž oba konce dlaněmi proti sobě. Ověř, že guma neklouže pod chodidly.",
      "Stand on the middle of a band and hold its ends with palms facing. Check that it cannot slip beneath the feet."
    ],
    "exe": [
      "Pokrč lokty proti odporu a pomalu je natáhni. Nadloktí zůstávají u těla.",
      "Bend the elbows against resistance and straighten slowly. Keep upper arms near the torso."
    ],
    "wat": [
      "Gumu neomotávej těsně kolem prstů. Nezakláněj trup, když odpor nahoře zesílí.",
      "Do not wrap the band tightly around fingers. Avoid leaning backward as resistance increases at the top."
    ],
    "pro": [
      "Lehčí: slabší guma nebo delší volná část. Těžší: silnější guma při stejném rozsahu; zaznamenej typ gumy a délku úchopu.",
      "Easier: a lighter band or more free length. Harder: a stronger band at the same range; record band type and grip length."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_band_hammer_curl",
    "ez": null,
    "foc": [
      "Pokrč lokty proti odporu a pomalu je natáhni.",
      "Bend the elbows against resistance and straighten slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Hammer Curl (Resistance Band): How-to, Tips & More",
      "url": "https://www.hevyapp.com/exercises/hammer-curl-resistance-band/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_bb_skullcrusher",
    "cz": "Francouzský tlak s EZ osou vleže",
    "en": "Lying EZ-Bar Triceps Extension",
    "pat": "tlak",
    "eq": [
      "cinka",
      "lavice"
    ],
    "mp": [
      "tri"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "family": "elbow_extension",
    "ez": "pushdown",
    "pos": [
      "Lehni si na rovnou lavici s chodidly na zemi. Drž lehkou EZ osu nad hrudníkem a nadloktí mírně nakloň za svislici.",
      "Lie on a flat bench with feet grounded. Hold a light EZ bar above the chest, upper arms slightly tilted behind vertical."
    ],
    "exe": [
      "Pokrč lokty a veď osu kontrolovaně směrem za čelo. Propnutím loktů ji vrať, nadloktí drž téměř na místě.",
      "Bend the elbows to lower the bar under control toward a point behind the forehead. Extend the elbows, keeping upper arms nearly still."
    ],
    "wat": [
      "Osa nesmí padat směrem k obličeji. Začni lehce a při nepohodlí loktů zvol kladku.",
      "Never let the bar drop toward the face. Start light and use a cable alternative if the elbows are uncomfortable."
    ],
    "pro": [
      "Lehčí: tricepsová kladka nebo lehčí osa. Těžší: postupně více opakování a malé přírůstky váhy; neprodlužuj rozsah násilím.",
      "Easier: triceps pushdowns or a lighter bar. Harder: gradually add repetitions and small load increments without forcing range."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_bb_skullcrusher",
    "hd": null,
    "foc": [
      "Pokrč lokty a veď osu kontrolovaně směrem za čelo.",
      "Bend the elbows to lower the bar under control toward a point behind the forehead."
    ],
    "source": {
      "author": "Hevy",
      "document": "Barbell Skullcrusher: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/skullcrusher-barbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_onearm_triceps",
    "cz": "Tricepsová extenze jednoruč nad hlavou",
    "en": "Single-Arm Dumbbell Overhead Triceps Extension",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "tri"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "elbow_extension",
    "ez": "pushdown",
    "pos": [
      "Sedni si na pevnou lavici s chodidly na zemi, případně stůj stabilně. Zvedni lehkou jednoručku nad rameno; druhou rukou můžeš jemně podepřít nadloktí.",
      "Sit on a stable bench with feet grounded, or stand securely. Lift a light dumbbell above the shoulder; the other hand may gently support the upper arm."
    ],
    "exe": [
      "Pokrč loket a spusť činku za hlavu, pak loket narovnej. Žebra zůstávají nad pánví a nadloktí v pohodlném úhlu.",
      "Bend the elbow to lower the dumbbell behind the head, then straighten it. Keep ribs over pelvis and the upper arm at a comfortable angle."
    ],
    "wat": [
      "Nenuť loket těsně k hlavě. Pokud musíš výrazně prohnout bedra nebo rameno tlačí, použij kladku u těla.",
      "Do not force the elbow against the head. Use pushdowns if you need excessive lumbar arching or the shoulder pinches."
    ],
    "pro": [
      "Lehčí: lehčí činka nebo obouruční držení. Těžší: více opakování a následně malý přírůstek váhy, každá strana zvlášť.",
      "Easier: a lighter dumbbell or two-hand support. Harder: more repetitions followed by a small load increase, recording each side separately."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_onearm_triceps",
    "hd": null,
    "foc": [
      "Pokrč loket a spusť činku za hlavu, pak loket narovnej.",
      "Bend the elbow to lower the dumbbell behind the head, then straighten it."
    ],
    "source": {
      "author": "Hevy",
      "document": "One-Arm Dumbbell Tricep Extension: How-to, Tips & Mistakes",
      "url": "https://www.hevyapp.com/exercises/one-arm-tricep-extension-dumbbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_triceps_kickback",
    "cz": "Tricepsový kickback s jednoručkou",
    "en": "Dumbbell Triceps Kickback",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "tri"
    ],
    "ms": [
      "sho"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "elbow_extension",
    "ez": "pushdown",
    "pos": [
      "Předkloň se z kyčlí a druhou ruku opři o lavici. Nadloktí pracovní paže dej podél trupu, loket pokrč přibližně do pravého úhlu.",
      "Hinge forward and support the free hand on a bench. Place the working upper arm alongside the torso with the elbow bent about 90°."
    ],
    "exe": [
      "Narovnej loket dozadu bez pohybu nadloktí. Krátce zastav a činku pomalu vrať.",
      "Straighten the elbow backward without moving the upper arm. Pause briefly and return slowly."
    ],
    "wat": [
      "Nepoužívej švih ramene a neotáčej trupem. Malá činka zde může být dostatečně náročná.",
      "Do not swing the shoulder or rotate the torso. A small dumbbell can be sufficiently challenging here."
    ],
    "pro": [
      "Lehčí: menší činka nebo kladka ve stoji. Těžší: delší kontrolovaná výdrž v natažení a teprve pak mírně vyšší zátěž.",
      "Easier: a lighter dumbbell or standing pushdowns. Harder: a longer controlled pause in extension before a modest load increase."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_triceps_kickback",
    "hd": null,
    "foc": [
      "Narovnej loket dozadu bez pohybu nadloktí.",
      "Straighten the elbow backward without moving the upper arm."
    ],
    "source": {
      "author": "Hevy",
      "document": "Triceps Kickback: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-triceps-kickback/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_ring_triceps",
    "cz": "Tricepsová extenze na závěsných madlech",
    "en": "Suspension Triceps Extension",
    "pat": "tlak",
    "eq": [
      "kruhy"
    ],
    "mp": [
      "tri"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 2,
    "C": 2,
    "family": "elbow_extension",
    "ez": "pushdown",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Ověř kotvu a délku popruhů. Čelem od kotvy drž madla před sebou, tělo mírně nakloněné a zpevněné.",
      "Check the anchor and strap length. Facing away from it, hold handles ahead with the body slightly inclined and braced."
    ],
    "exe": [
      "Pokrč lokty a přibliž čelo k madlům. Propnutím loktů se vrať, aniž by se změnil tvar trupu.",
      "Bend the elbows to bring the forehead toward the handles. Extend the elbows to return without changing torso shape."
    ],
    "wat": [
      "Začni téměř vzpřímeně. Neprohýbej bedra a nenech madla uniknout do stran.",
      "Start nearly upright. Do not sag at the lower back or let the handles drift apart."
    ],
    "pro": [
      "Lehčí: vzpřímenější tělo a vyšší madla. Těžší: větší náklon po malých krocích při stejné poloze loktů.",
      "Easier: a more upright body and higher handles. Harder: increase the lean in small steps with unchanged elbow position."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_ring_triceps",
    "hd": null,
    "foc": [
      "Pokrč lokty a přibliž čelo k madlům.",
      "Bend the elbows to bring the forehead toward the handles."
    ],
    "source": {
      "author": "Hevy",
      "document": "Suspension Tricep Extension: How-to, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/tricep-extension-suspension/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_wrist_pronation",
    "cz": "Otáčení předloktí s lehkou jednoručkou",
    "en": "Supported Forearm Pronation and Supination",
    "pat": "tah",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "forearm_rotation",
    "pos": [
      "Sedni si a opři předloktí o stehno nebo lavičku, loket přibližně 90°. Drž velmi lehkou krátkou činku, zápěstí volně za hranou.",
      "Sit with the forearm supported on a thigh or bench, elbow around 90°. Hold a very light short dumbbell with the wrist beyond the edge."
    ],
    "exe": [
      "Pomalu otáčej předloktí dlaní vzhůru a dolů v pohodlném rozsahu. Loket zůstává opřený a zápěstí rovné.",
      "Slowly rotate the forearm palm up and down through a comfortable range. Keep the elbow supported and wrist straight."
    ],
    "wat": [
      "Začni bez zátěže, pokud pohyb neovládáš. Netlač do krajní rotace a nepoužívej dlouhou těžkou páku.",
      "Start unloaded if control is limited. Do not force end-range rotation or use a long heavy lever."
    ],
    "pro": [
      "Lehčí: otáčení prázdné ruky. Těžší: drobná zátěž či delší výdrž při stejné délce páky, bez bolesti a švihu.",
      "Easier: rotate the empty hand. Harder: a small load or longer pause with unchanged lever length, without pain or momentum."
    ],
    "J": {
      "lok": 1,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_wrist_pronation",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu otáčej předloktí dlaní vzhůru a dolů v pohodlném rozsahu.",
      "Slowly rotate the forearm palm up and down through a comfortable range."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Wrist Supination & Pronation Exercises",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/31/wrist-supination-and-pronation/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_bb_rdl",
    "cz": "Rumunský mrtvý tah s velkou činkou",
    "en": "Barbell Romanian Deadlift",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "low",
      "fore"
    ],
    "S": 3,
    "C": 2,
    "family": "hinge",
    "ez": "dbrdl",
    "pos": [
      "Začni ve stoji s osou před stehny. Chodidla na šířku boků, kolena mírně pokrčená.",
      "Start standing with the bar at the thighs, feet hip-width and knees slightly bent."
    ],
    "exe": [
      "Posílej boky dozadu a veď osu těsně podél nohou. Zastav, než ztratíš polohu trupu, a vrať se pohybem kyčlí. Osa nemusí na zem.",
      "Push the hips back, keeping the bar close to the legs. Stop before losing torso position and return by extending the hips. The bar need not reach the floor."
    ],
    "wat": [
      "Nezamkni kolena a nepřidávej hloubku zakulacením zad. Nahoře se nezakláněj.",
      "Do not lock the knees or gain depth by rounding the back. Avoid leaning back at the top."
    ],
    "pro": [
      "Lehčí: jednoručky a kratší rozsah. Těžší: více opakování nebo váha při stejné hloubce, teprve poté rozsah podle kontroly.",
      "Easier: dumbbells and shorter range. Harder: add repetitions or load at the same depth; expand range only as control permits."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_bb_rdl",
    "hd": null,
    "foc": [
      "Posílej boky dozadu a veď osu těsně podél nohou.",
      "Push the hips back, keeping the bar close to the legs."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Romanian Deadlift",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_stiff_deadlift",
    "cz": "Mrtvý tah s téměř nataženými koleny",
    "en": "Stiff-Leg Deadlift",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "low",
      "fore"
    ],
    "S": 3,
    "C": 3,
    "family": "hinge",
    "ez": "ex26_bb_rdl",
    "tier": "specialist",
    "pos": [
      "Připrav lehkou osu na zemi nebo blocích. Kyčle jsou výš než u běžného tahu, kolena mírně pokrčená, ne zamknutá.",
      "Set a light bar on the floor or blocks. Hips start higher than in a conventional deadlift, knees slightly bent rather than locked."
    ],
    "exe": [
      "Z klidné osy se narovnej převážně přes kyčle. Veď osu u nohou a kontrolovaně ji vrať na oporu.",
      "Lift from a dead stop mainly through hip extension. Keep the bar close and lower it back to its support under control."
    ],
    "wat": [
      "Výšku podložení přizpůsob rozsahu. Nedosahuj na zem za cenu ztráty kontroly zad; tento cvik nevyžaduje dokonale rovná kolena.",
      "Match block height to your range. Do not reach the floor at the expense of back control; perfectly straight knees are not required."
    ],
    "pro": [
      "Lehčí: rumunský tah shora nebo vyšší bloky. Těžší: nižší opora při stejné váze, případně postupná zátěž při zachované technice. Neměň obojí najednou.",
      "Easier: top-down Romanian deadlifts or higher blocks. Harder: lower the support at the same load, or gradually load the established range. Do not change both at once."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_stiff_deadlift",
    "hd": null,
    "foc": [
      "Z klidné osy se narovnej převážně přes kyčle.",
      "Lift from a dead stop mainly through hip extension."
    ],
    "source": {
      "author": "Hevy",
      "document": "Stiff Leg Deadlift: How-to, Tips, Common Mistakes",
      "url": "https://www.hevyapp.com/exercises/stiff-straight-leg-deadlift/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_rack_pull",
    "cz": "Mrtvý tah ze zarážek stojanu",
    "en": "Rack Pull",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "low",
      "tra",
      "fore"
    ],
    "S": 3,
    "C": 2,
    "family": "hinge",
    "ez": "an_boxdeadlift",
    "hd": "deadlift",
    "pos": [
      "Nastav stejně vysoké bezpečnostní zarážky pod koleny. Osa leží vodorovně blízko holení. Uchop ji s pevným trupem.",
      "Set level rack safeties below the knees. Position the bar close to the shins and grip it with a braced torso."
    ],
    "exe": [
      "Tlač chodidly do země a narovnej kyčle a kolena. Vrať osu na obě zarážky současně, zastav a znovu nastav.",
      "Push through the feet and extend hips and knees. Return the bar to both safeties together, pause and reset."
    ],
    "wat": [
      "Použij stojan i osu vhodné pro tento kontakt. Neodrážej činku a neber automaticky mnohem vyšší váhu než ze země.",
      "Use a rack and bar suitable for this contact. Do not bounce or automatically use far more weight than from the floor."
    ],
    "pro": [
      "Lehčí: menší váha či vyšší opora. Těžší: snižuj oporu po malých krocích nebo přidávej váhu při stejné výšce. Výšku vždy zapisuj.",
      "Easier: less load or higher support. Harder: lower the support gradually or add load at the same height. Always record the height."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_rack_pull",
    "foc": [
      "Tlač chodidly do země a narovnej kyčle a kolena.",
      "Push through the feet and extend hips and knees."
    ],
    "source": {
      "author": "Hevy",
      "document": "Rack Pull: How-to, Tips, Mistakes, Variations & Alternatives",
      "url": "https://www.hevyapp.com/exercises/how-to-rack-pull/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_band_deadlift",
    "cz": "Mrtvý tah s odporovou gumou",
    "en": "Resistance-Band Deadlift",
    "pat": "ohyb",
    "eq": [
      "guma"
    ],
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "qua",
      "low"
    ],
    "S": 1,
    "C": 1,
    "family": "hinge",
    "ez": "hinge",
    "hd": "an_dbdeadlift",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Stoupni oběma chodidly na střed nepoškozené gumy. Uchop konce, pokrč kyčle a kolena, záda drž v kontrolované poloze.",
      "Stand with both feet on the middle of an intact band. Hold its ends, bend hips and knees and maintain a controlled back position."
    ],
    "exe": [
      "Tlakem do chodidel se narovnej. Paže drží gumu, nepřitahují ji. Pomalu vrať kyčle dozadu a kolena pokrč.",
      "Push through the feet to stand. Arms hold rather than pull the band. Slowly send hips back and bend the knees."
    ],
    "wat": [
      "Ověř, že guma nemůže sklouznout. Nahoře se nezakláněj a nepřitahuj ramena k uším.",
      "Ensure the band cannot slip. Do not lean back or shrug at the top."
    ],
    "pro": [
      "Lehčí: slabší guma nebo nácvik s tyčí. Těžší: silnější guma; pro přesnější přidávání zátěže přejdi na činky.",
      "Easier: a lighter band or dowel practice. Harder: a stronger band; use weights for more precise load increments."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_band_deadlift",
    "foc": [
      "Tlakem do chodidel se narovnej.",
      "Push through the feet to stand."
    ],
    "source": {
      "author": "Hevy",
      "document": "Resistance Band Deadlift: How-to, Tips, Variations & Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-deadlift-band/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kickstand_rdl",
    "cz": "Rumunský tah s oporou zadní špičky",
    "en": "Kickstand Romanian Deadlift",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "low"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "hinge_unilateral",
    "ez": "dbrdl",
    "hd": "slrdl",
    "pos": [
      "Drž dvě lehké činky. Jedno chodidlo je celé na zemi, druhá špička půl kroku vzadu slouží jako lehká opora.",
      "Hold two light dumbbells. Ground the front foot and place the other toes half a step behind as light support."
    ],
    "exe": [
      "Zatěžuj hlavně přední nohu, posílej boky dozadu a drž pánev rovně. Vrať se tlakem předního chodidla do země.",
      "Load mainly the front leg, hinge back and keep the pelvis square. Return by driving the front foot into the ground."
    ],
    "wat": [
      "Zadní noha nemá přebírat hlavní práci. Neotáčej pánví a nenatahuj přední koleno do zámku.",
      "The rear leg should not take over. Avoid pelvic rotation and locking the front knee."
    ],
    "pro": [
      "Lehčí: obounožní tah nebo opora ruky. Těžší: méně zatěžuj zadní špičku, potom zkus tah jednonož. Váhu zvyšuj až při stabilním rozložení.",
      "Easier: bilateral hinges or hand support. Harder: reduce rear-foot assistance, then try a single-leg hinge. Add load after stabilizing the weight distribution."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kickstand_rdl",
    "foc": [
      "Zatěžuj hlavně přední nohu, posílej boky dozadu a drž pánev rovně.",
      "Load mainly the front leg, hinge back and keep the pelvis square."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Get Stronger with Odd-load Kettlebell Training — kickstand deadlift",
      "url": "https://www.strongfirst.com/get-stronger-with-odd-load-kettlebell-training/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_zercher_squat",
    "cz": "Zercherův dřep",
    "en": "Zercher Squat",
    "pat": "drep",
    "eq": [
      "cinka"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "abs",
      "upb"
    ],
    "S": 3,
    "C": 3,
    "family": "squat_bilateral",
    "ez": "goblet",
    "tier": "specialist",
    "pos": [
      "Ve stojanu nastav lehkou osu zhruba do výše břicha. Podepři ji v ohybech loktů, ruce spoj a zvedni ze stojanu.",
      "Rack a light bar around abdominal height. Cradle it in the elbow creases, bring hands together and unrack."
    ],
    "exe": [
      "S osou u těla pokrč kyčle a kolena. Klesej do ovládané hloubky a tlakem celých chodidel se postav.",
      "Keep the bar close, bend hips and knees and descend through controlled depth. Stand by driving through the whole feet."
    ],
    "wat": [
      "Začni velmi lehce. Ostrý tlak do loktů nebo brnění není běžná součást cviku; použij jiný dřep. Nastav bezpečnostní zarážky.",
      "Start very light. Sharp elbow pressure or tingling is not part of the exercise; choose another squat. Set safety bars."
    ],
    "pro": [
      "Lehčí: goblet dřep. Těžší: přidávej malé váhy po zvládnutí držení a bezpečného vrácení osy; hlubší dřep není povinný.",
      "Easier: goblet squats. Harder: add small loads after mastering the hold and reracking; greater depth is optional."
    ],
    "J": {
      "kol": 2,
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_zercher_squat",
    "hd": null,
    "foc": [
      "S osou u těla pokrč kyčle a kolena.",
      "Keep the bar close, bend hips and knees and descend through controlled depth."
    ],
    "source": {
      "author": "Hevy",
      "document": "Zercher Squat: How-to, Tips, Variations, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/how-to-zercher-squat/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bb_lunge",
    "cz": "Výpad vpřed s velkou činkou",
    "en": "Barbell Forward Lunge",
    "pat": "drep",
    "eq": [
      "cinka",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "add",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "sideMode": "perSide",
    "family": "lunge",
    "ez": "lunge",
    "pos": [
      "Odeber lehkou osu ze stojanu na horní záda, nikoli na krk. Uvolni si prostor a stůj na šířku boků.",
      "Unrack a light bar onto the upper back, not the neck. Clear the area and stand hip-width."
    ],
    "exe": [
      "Vykroč vpřed, měkce došlápni a pokrč obě kolena. Odtlač se přední nohou zpět do stoje a opakuj na určené straně.",
      "Step forward, land softly and bend both knees. Push through the front leg to return to standing and repeat on the prescribed side."
    ],
    "wat": [
      "Nechoď po jedné úzké linii. Zadním kolenem nenarážej do země a neztrácej kontrolu při kroku zpět.",
      "Do not walk a tightrope. Avoid striking the rear knee on the floor or losing control during the return."
    ],
    "pro": [
      "Lehčí: výpad bez osy nebo s jednoručkami. Těžší: zvyšuj váhu až při jistém došlapu a návratu. Zapisuj opakování na každou nohu.",
      "Easier: unloaded or dumbbell lunges. Harder: add load only with a reliable landing and return. Record repetitions per leg."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_bb_lunge",
    "hd": null,
    "foc": [
      "Vykroč vpřed, měkce došlápni a pokrč obě kolena.",
      "Step forward, land softly and bend both knees."
    ],
    "source": {
      "author": "Hevy",
      "document": "Barbell Lunge: Benefits, How-to, Tips & Mistakes to Avoid",
      "url": "https://www.hevyapp.com/exercises/barbell-lunges/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_lateral_stepup",
    "cz": "Výstup na bednu bokem",
    "en": "Lateral Step-Up",
    "pat": "drep",
    "eq": [
      "lavice"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "add"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "step_up",
    "ez": null,
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Stoupni si bokem k nízké pevné bedně. Bližší chodidlo celé polož na její vršek a pánev drž přibližně vodorovně.",
      "Stand beside a low stable box. Place the nearer foot fully on top and keep the pelvis roughly level."
    ],
    "exe": [
      "Tlakem horní nohy vystup na bednu. Druhou nohu přilož bez odrazu a potom pomalu sestup stejnou cestou.",
      "Drive through the elevated leg to step up. Bring the other foot alongside without jumping, then lower along the same path."
    ],
    "wat": [
      "Neodrážej se spodní nohou a nenech koleno prudce propadnout dovnitř. Výšku sniž, když se pánev vytáčí.",
      "Do not push off the lower leg or let the knee collapse inward. Reduce height if the pelvis twists."
    ],
    "pro": [
      "Lehčí: nižší bedna a opora ruky. Těžší: pomalejší sestup, mírně vyšší bedna nebo lehké činky, vždy jedna změna.",
      "Easier: a lower box and hand support. Harder: slower lowering, a slightly higher box or light weights, changing one variable at a time."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_stepup",
    "hd": null,
    "foc": [
      "Tlakem horní nohy vystup na bednu.",
      "Drive through the elevated leg to step up."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Step-up — movement family; lateral approach adaptation",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/28/step-up/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_stepdown",
    "cz": "Kontrolovaný sestup z nízké bedny",
    "en": "Forward Step-Down",
    "pat": "drep",
    "eq": [
      "lavice"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "squat_unilateral",
    "ez": null,
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Postav se jednou nohou na nízkou pevnou bednu. Druhou nohu vysuň před okraj a podle potřeby se lehce přidrž.",
      "Stand on one leg on a low stable step. Reach the other leg beyond the front edge and use light hand support if needed."
    ],
    "exe": [
      "Pokrč stojné koleno a kyčel, až se volná pata jemně dotkne země. Bez odrazu se vrať nahoru.",
      "Bend the supporting knee and hip until the free heel lightly touches the floor. Return without pushing off that heel."
    ],
    "wat": [
      "Udrž celé stojné chodidlo opřené. Pokud musíš dopadnout nebo otočit pánev, sniž výšku.",
      "Keep the supporting foot fully grounded. Reduce height if you must drop down or twist the pelvis."
    ],
    "pro": [
      "Lehčí: menší výška a pevná opora ruky. Těžší: méně opory, pomalejší sestup, potom malá zátěž.",
      "Easier: a lower step and firm hand support. Harder: less assistance, slower lowering, then a small load."
    ],
    "J": {
      "kol": 2,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_stepdown",
    "hd": null,
    "foc": [
      "Pokrč stojné koleno a kyčel, až se volná pata jemně dotkne země.",
      "Bend the supporting knee and hip until the free heel lightly touches the floor."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Effective Exercises to Target the Glutes — Eccentric Step Down",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/5901/effective-exercises-to-target-the-glutes/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_single_hipthrust",
    "cz": "Hip thrust na jedné noze",
    "en": "Single-Leg Hip Thrust",
    "pat": "ohyb",
    "eq": [
      "lavice"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_extension",
    "ez": "slbridge",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Horní záda opři o pevnou lavici. Jedno chodidlo je na zemi, druhou nohu zvedni s pokrčeným kolenem.",
      "Support the upper back on a fixed bench. Ground one foot and lift the other leg with its knee bent."
    ],
    "exe": [
      "Zvedni pánev přes stojnou kyčel, až trup a stehno vytvoří přibližně přímku. Pomalu spusť, pánev drž rovně.",
      "Extend the supporting hip until torso and thigh roughly align. Lower slowly, keeping the pelvis level."
    ],
    "wat": [
      "Nezakláněj hlavu ani bedra. Lavice se nesmí posouvat a volná noha nepomáhá švihem.",
      "Do not throw the head back or arch the lower back. The bench must not slide and the free leg must not swing for assistance."
    ],
    "pro": [
      "Lehčí: most jednonož na zemi nebo obounožní hip thrust. Těžší: pauza nahoře, potom lehká bezpečně přidržená zátěž přes pánev.",
      "Easier: a floor single-leg bridge or bilateral hip thrust. Harder: pause at the top, then add a light securely held load across the pelvis."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_single_hipthrust",
    "hd": null,
    "foc": [
      "Zvedni pánev přes stojnou kyčel, až trup a stehno vytvoří přibližně přímku.",
      "Extend the supporting hip until torso and thigh roughly align."
    ],
    "source": {
      "author": "Hevy",
      "document": "Single-Leg Hip Thrust: How-to, Tips, Safety & Variations",
      "url": "https://www.hevyapp.com/exercises/single-leg-hip-thrust/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_standing_legcurl",
    "cz": "Zakopávání jednonož ve stoji na stroji",
    "en": "Standing Single-Leg Curl Machine",
    "pat": "ohyb",
    "eq": [
      "stroj"
    ],
    "mp": [
      "ham"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 1,
    "sideMode": "perSide",
    "family": "knee_flexion_machine",
    "ez": null,
    "pos": [
      "Nastav váleček nad patu a osu kolena do osy stroje. Opři trup a chyť madla; druhá noha stojí pevně.",
      "Set the roller above the heel and align the knee with the machine pivot. Support the torso and grip the handles, other foot grounded."
    ],
    "exe": [
      "Pokrč pracovní koleno a přibliž patu k hýždi. Stehno zůstává na místě. Pomalu vrať do pohodlného natažení.",
      "Bend the working knee to bring the heel toward the buttock. Keep the thigh still and return slowly to comfortable extension."
    ],
    "wat": [
      "Nezvedej pánev a nezakopávej celou nohou z kyčle. Závaží nesmí dopadat.",
      "Do not lift the pelvis or swing the whole leg from the hip. Do not drop the stack."
    ],
    "pro": [
      "Lehčí: menší odpor. Těžší: více opakování nebo malý přírůstek váhy při stejném rozsahu. Výsledky obou stran zapisuj odděleně.",
      "Easier: less resistance. Harder: more repetitions or a small load increase at the same range. Track sides separately."
    ],
    "J": {
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_standing_legcurl",
    "hd": null,
    "foc": [
      "Pokrč pracovní koleno a přibliž patu k hýždi.",
      "Bend the working knee to bring the heel toward the buttock."
    ],
    "source": {
      "author": "Hevy",
      "document": "Standing Leg Curls: How-to, Tips, Alternatives & More",
      "url": "https://www.hevyapp.com/exercises/how-to-standing-leg-curls/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_calf_legpress",
    "cz": "Výpony na leg pressu",
    "en": "Leg-Press Calf Raise",
    "pat": "drep",
    "eq": [
      "stroj"
    ],
    "mp": [
      "cal"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "family": "calf",
    "ez": "calfraise",
    "pos": [
      "Použij leg press vhodný pro výpony se zarážkami. Přední části chodidel pevně na plošině, paty mají volný prostor, kolena téměř natažená.",
      "Use a leg press suitable for calf raises with safeties. Secure the forefeet on the platform, heels free and knees nearly straight."
    ],
    "exe": [
      "Pohybem kotníků odtlač plošinu a pak pomalu spusť paty do pohodlného protažení. Úhel kolen udržuj.",
      "Press the platform through ankle extension, then lower the heels slowly into a comfortable stretch. Maintain knee angle."
    ],
    "wat": [
      "Nezamykat kolena násilím, neodrážet se a nenechat chodidla sklouznout. Pokud stroj neumožní bezpečné jištění, zvol jiný výpon.",
      "Do not force knee lockout, bounce or let feet slip. Choose another calf raise if the machine cannot be secured safely."
    ],
    "pro": [
      "Lehčí: výpony ve stoji nebo menší váha. Těžší: pauza nahoře i dole a pak vyšší váha při stejném rozsahu kotníků.",
      "Easier: standing calf raises or less load. Harder: pause at both ends, then add load at the same ankle range."
    ],
    "J": {
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_calf_legpress",
    "hd": null,
    "foc": [
      "Pohybem kotníků odtlač plošinu a pak pomalu spusť paty do pohodlného protažení.",
      "Press the platform through ankle extension, then lower the heels slowly into a comfortable stretch."
    ],
    "source": {
      "author": "Hevy",
      "document": "Calf Press (Machine): How-to, Tips, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/how-to-calf-press-machine/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_single_db_calf",
    "cz": "Výpon jednonož s jednoručkou",
    "en": "Single-Leg Dumbbell Calf Raise",
    "pat": "drep",
    "eq": [
      "zavazi",
      "zed"
    ],
    "mp": [
      "cal"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "calf",
    "ez": "calfraise",
    "pos": [
      "Stůj jednou nohou na podlaze, druhou zvedni. Jednou rukou se přidrž pevné opory, v druhé drž lehkou činku.",
      "Stand on one foot on the floor and lift the other. Use one hand for stable support and hold a light dumbbell in the other."
    ],
    "exe": [
      "Zvedej patu s tlakem přes přední část chodidla a pomalu ji polož. Koleno drž téměř natažené.",
      "Raise the heel through the forefoot and lower slowly. Keep the knee nearly straight."
    ],
    "wat": [
      "Kotník nevyvracej ven ani dovnitř. Opora slouží rovnováze, ne vytahování těla rukou.",
      "Do not roll the ankle inward or outward. Use the support for balance rather than pulling yourself upward."
    ],
    "pro": [
      "Lehčí: bez činky nebo obounožní výpon. Těžší: vyšší zátěž; schůdek přidej až po ovládnutí rozsahu na zemi.",
      "Easier: no dumbbell or bilateral calf raises. Harder: more load; introduce a step only after controlling the floor range."
    ],
    "J": {
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_single_db_calf",
    "hd": null,
    "foc": [
      "Zvedej patu s tlakem přes přední část chodidla a pomalu ji polož.",
      "Raise the heel through the forefoot and lower slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Single Leg Standing Calf Raise (Dumbbell): How-to & Tips",
      "url": "https://www.hevyapp.com/exercises/how-to-single-leg-standing-calf-raise-dumbbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_firehydrant",
    "cz": "Unožování pokrčené nohy na čtyřech",
    "en": "Quadruped Fire Hydrant",
    "pat": "ohyb",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 1,
    "C": 1,
    "sideMode": "perSide",
    "family": "hip_abduction",
    "ez": "clamshell",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Na čtyřech dej ruce pod ramena a kolena pod kyčle. Záda drž v pohodlné neutrální poloze.",
      "On all fours, place hands below shoulders and knees below hips. Keep a comfortable neutral back."
    ],
    "exe": [
      "Zvedni pokrčené koleno do strany, aniž by se výrazně otočila pánev. Pomalu ho vrať pod kyčel.",
      "Lift one bent knee sideways without substantially rotating the pelvis. Lower it slowly beneath the hip."
    ],
    "wat": [
      "Výška není cíl. Zastav dříve, než musíš vytočit celý trup nebo se prohnout.",
      "Height is not the goal. Stop before turning the whole torso or arching the back."
    ],
    "pro": [
      "Lehčí: menší rozsah nebo škeble vleže. Těžší: pauza v horní poloze, následně lehká guma nad koleny.",
      "Easier: a smaller range or side-lying clamshells. Harder: pause at the top, then add a light band above the knees."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_firehydrant",
    "hd": null,
    "foc": [
      "Zvedni pokrčené koleno do strany, aniž by se výrazně otočila pánev.",
      "Lift one bent knee sideways without substantially rotating the pelvis."
    ],
    "source": {
      "author": "Hevy",
      "document": "Fire Hydrants: How-to, Tips, Variations, Alternatives & Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-fire-hydrants/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_lateral_bandwalk",
    "cz": "Boční chůze s gumou",
    "en": "Lateral Band Walk",
    "pat": "prenos",
    "eq": [
      "guma",
      "prostor"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "qua"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_abduction",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Dej lehkou smyčku nad kolena. Mírně pokrč kyčle a kolena, chodidla přibližně rovnoběžně.",
      "Place a light loop above the knees. Slightly bend hips and knees with feet roughly parallel."
    ],
    "exe": [
      "Dělej malé boční kroky. Druhou nohu přibližuj kontrolovaně a zachovej mírný tah gumy. Vystřídej směry.",
      "Take small lateral steps. Bring the trailing foot in under control, retaining light band tension. Work both directions."
    ],
    "wat": [
      "Nekolébej trupem a netáhni kolena do přehnaného roztažení. Zapisuj kroky v každém směru.",
      "Do not sway the torso or force the knees excessively outward. Record steps in each direction."
    ],
    "pro": [
      "Lehčí: slabší guma a vyšší postoj. Těžší: více kvalitních kroků nebo guma u kotníků s nižším odporem; neposouvej ji níže a zároveň neposiluj.",
      "Easier: a lighter band and taller stance. Harder: more controlled steps or a lighter band at the ankles; do not lower placement and increase resistance together."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_bandwalk",
    "ez": null,
    "hd": null,
    "foc": [
      "Dělej malé boční kroky.",
      "Take small lateral steps."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "How to Self-Care for the IT Band — Lateral Band Walks",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/5043/how-to-self-care-for-the-it-band/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_hamstring_slider",
    "cz": "Zakopávání s patami na kluzácích",
    "en": "Sliding Hamstring Curl",
    "pat": "ohyb",
    "eq": [
      "telo"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 3,
    "C": 2,
    "family": "knee_flexion_bw",
    "ez": "eccham",
    "hd": null,
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Lehni si na záda, paty dej na kluzáky nebo ručníky na hladké pevné podlaze. Zvedni pánev do mostu.",
      "Lie supine with heels on sliders or towels on a smooth firm floor. Lift the pelvis into a bridge."
    ],
    "exe": [
      "Vysouvej obě paty od hýždí a pak je přitáhni zpět. Pánev udrž zvednutou jen v rozsahu, který zvládáš.",
      "Slide both heels away from the buttocks and curl them back. Keep the pelvis elevated only through a range you control."
    ],
    "wat": [
      "Neprohýbej bedra, abys udržel zdánlivě vysoký most. Plocha musí umožnit plynulé klouzání bez náhlého zaseknutí.",
      "Do not arch the lower back to fake bridge height. The surface must allow smooth sliding without catching."
    ],
    "pro": [
      "Lehčí: krátký posun nebo pouze pomalé vysouvání s položením pánve při návratu. Těžší: delší dráha, potom jedna noha s asistovaným návratem.",
      "Easier: short slides or eccentric-only slides with hips down for the return. Harder: longer range, then one leg with an assisted return."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_hamstring_slider",
    "foc": [
      "Vysouvej obě paty od hýždí a pak je přitáhni zpět.",
      "Slide both heels away from the buttocks and curl them back."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Progressive Hamstrings Strengthening with Sliders — bridge and curl progression",
      "url": "https://theprehabguys.com/vimeo-video/progressive-hamstring-strengthening-using-sliders/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_lying_kneetuck",
    "cz": "Přitahování kolen vleže",
    "en": "Lying Knee Tuck",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "hipflex",
      "abs"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "core_leg_raise",
    "ez": "deadbug",
    "hd": "legraise",
    "load": "none",
    "pos": [
      "Lehni si na záda, ruce polož vedle těla a zvedni pokrčené nohy. Hlavu nech opřenou.",
      "Lie supine with hands beside the body and lift the bent legs. Keep the head supported."
    ],
    "exe": [
      "Přibliž kolena k trupu a potom nohy kontrolovaně vysouvej. Zastav, než ztratíš kontrolu nad polohou pánve a beder.",
      "Bring the knees toward the torso, then extend the legs away under control. Stop before losing control of pelvis and lower back."
    ],
    "wat": [
      "Nepřitahuj nohy švihem a netlač rukama do krku. Menší rozsah je vhodnější než nekontrolované prohnutí.",
      "Do not swing the legs or press on the neck. Prefer a smaller range to uncontrolled arching."
    ],
    "pro": [
      "Lehčí: vracej paty na zem a nech kolena více pokrčená. Těžší: pomalejší návrat nebo postupně delší nohy.",
      "Easier: return the heels to the floor and bend the knees more. Harder: slow the return or progressively lengthen the legs."
    ],
    "J": {
      "kyc": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_lying_kneetuck",
    "foc": [
      "Přibliž kolena k trupu a potom nohy kontrolovaně vysouvej.",
      "Bring the knees toward the torso, then extend the legs away under control."
    ],
    "source": {
      "author": "Hevy",
      "document": "Lying Knee Raises: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/lying-knee-raises/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_reverse_crunch",
    "cz": "Obrácená zkracovačka",
    "en": "Reverse Crunch",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 2,
    "C": 2,
    "family": "core_flexion",
    "ez": "ex26_pelvic_tilt",
    "load": "none",
    "pos": [
      "V lehu na zádech zvedni stehna nad kyčle, kolena pokrčená. Ruce polož na zem vedle těla.",
      "Lie supine with thighs above hips and knees bent. Rest the hands beside the body."
    ],
    "exe": [
      "S výdechem jemně stoč pánev směrem k žebrům a zvedni kříž jen několik centimetrů. Pomalu vrať.",
      "Exhale and gently curl the pelvis toward the ribs, lifting the sacrum only a few centimetres. Return slowly."
    ],
    "wat": [
      "Nejde o švih koleny za hlavu. Krk a horní záda zůstávají opřené.",
      "Do not swing the knees over the head. Keep neck and upper back supported."
    ],
    "pro": [
      "Lehčí: samotné podsazení pánve bez zvednutí. Těžší: pomalejší spouštění a méně opory rukou, nikoli větší švih.",
      "Easier: a pelvic tilt without lifting. Harder: slower lowering and less hand support rather than a larger swing."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_reverse_crunch",
    "hd": null,
    "foc": [
      "S výdechem jemně stoč pánev směrem k žebrům a zvedni kříž jen několik centimetrů.",
      "Exhale and gently curl the pelvis toward the ribs, lifting the sacrum only a few centimetres."
    ],
    "source": {
      "author": "Catalyst Athletics",
      "document": "Reverse Crunch",
      "url": "https://www.catalystathletics.com/exercise/320/Reverse-Crunch/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_captain_knee",
    "cz": "Zvedání kolen v oporách předloktí",
    "en": "Captain’s Chair Knee Raise",
    "pat": "stred",
    "eq": [
      "stroj"
    ],
    "mp": [
      "hipflex",
      "abs"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "family": "core_leg_raise",
    "ez": "ex26_lying_kneetuck",
    "hd": "hlr",
    "load": "none",
    "pos": [
      "Vystup na stroj, opři předloktí o podložky a záda o opěru. Uchop madla a přenes váhu z nášlapů do opor.",
      "Step onto the station, support forearms on the pads and back on the backrest. Grip the handles and transfer weight off the steps."
    ],
    "exe": [
      "Zvedej pokrčená kolena přibližně k úrovni kyčlí a na konci jemně stoč pánev. Pomalu spusť bez houpání.",
      "Raise bent knees toward hip height, adding a gentle pelvic curl at the top. Lower slowly without swinging."
    ],
    "wat": [
      "Nepropadej mezi rameny. Použij nášlapy pro bezpečný nástup a ukončení.",
      "Do not sink between the shoulders. Use the steps to mount and dismount safely."
    ],
    "pro": [
      "Lehčí: menší rozsah nebo přitahování kolen vleže. Těžší: postupně narovnávej kolena; vis na hrazdě navíc vyžaduje úchop.",
      "Easier: less range or supine knee tucks. Harder: progressively straighten the knees; hanging from a bar also adds grip demand."
    ],
    "J": {
      "kyc": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_captain_knee",
    "foc": [
      "Zvedej pokrčená kolena přibližně k úrovni kyčlí a na konci jemně stoč pánev.",
      "Raise bent knees toward hip height, adding a gentle pelvic curl at the top."
    ],
    "source": {
      "author": "Hevy",
      "document": "Vertical Knee Raise: How-to, Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/vertical-knee-raise/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cable_crunch",
    "cz": "Zkracovačka v kleku na kladce",
    "en": "Kneeling Cable Crunch",
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "obl"
    ],
    "S": 2,
    "C": 2,
    "family": "core_flexion",
    "ez": "crunch",
    "pos": [
      "Klekni si před horní kladku, kolena podlož. Konce lana drž u spánků bez tlaku na krk, kyčle nad koleny.",
      "Kneel before a high pulley with padded knees. Hold rope ends by the temples without neck pressure, hips over knees."
    ],
    "exe": [
      "S výdechem přibliž žebra k pánvi kontrolovaným zakulacením trupu. Pomalu se vrať do výchozí polohy.",
      "Exhale and bring ribs toward the pelvis through controlled trunk flexion. Return slowly to the starting position."
    ],
    "wat": [
      "Nesedej pouze na paty a netahej rukama. Vol rozsah, který záda snášejí, a neprohýbej se proti tahu kladky.",
      "Do not simply sit toward the heels or pull with the arms. Use a back-tolerated range without arching against the cable."
    ],
    "pro": [
      "Lehčí: zkracovačka na zemi nebo menší odpor. Těžší: přidej váhu, až když se pohyb odehrává v trupu bez švihu kyčlí.",
      "Easier: floor crunches or less resistance. Harder: add load after achieving trunk movement without hip momentum."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_crunch",
    "hd": null,
    "foc": [
      "S výdechem přibliž žebra k pánvi kontrolovaným zakulacením trupu.",
      "Exhale and bring ribs toward the pelvis through controlled trunk flexion."
    ],
    "source": {
      "author": "Hevy",
      "document": "Cable Crunch: How-to, Benefits, Tips, Mistakes & Variations",
      "url": "https://www.hevyapp.com/exercises/how-to-cable-crunch/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_decline_crunch",
    "cz": "Zkracovačka na šikmé lavici",
    "en": "Decline Crunch",
    "pat": "stred",
    "eq": [
      "lavice"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "obl"
    ],
    "S": 2,
    "C": 2,
    "family": "core_flexion",
    "ez": "crunch",
    "load": "none",
    "pos": [
      "Zajisti nohy na mírně sklopené lavici. Lehni si a ruce polož přes hrudník.",
      "Secure the legs on a mildly declined bench. Lie back and cross the arms over the chest."
    ],
    "exe": [
      "Zvedni lopatky a přibliž žebra k pánvi. Vrať se pomalu; krátká zkracovačka nemusí přejít do celého sedu.",
      "Lift the shoulder blades and bring ribs toward pelvis. Lower slowly; a short crunch need not become a full sit-up."
    ],
    "wat": [
      "Netahej za hlavu a nezačínej velkým sklonem. Závratě nebo bolest zad jsou důvodem zvolit jinou variantu.",
      "Do not pull the head or begin with a steep decline. Choose an alternative if dizzy or if the back hurts."
    ],
    "pro": [
      "Lehčí: rovná podložka. Těžší: více kontrolovaných opakování, potom malá změna sklonu při stejném pohybu.",
      "Easier: a flat surface. Harder: more controlled repetitions, then a small incline change without altering the movement."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_decline_crunch",
    "hd": null,
    "foc": [
      "Zvedni lopatky a přibliž žebra k pánvi.",
      "Lift the shoulder blades and bring ribs toward pelvis."
    ],
    "source": {
      "author": "Hevy",
      "document": "Decline Crunch: How-to, Tips, Variations & Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-decline-crunch/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_oblique_crunch",
    "cz": "Šikmá zkracovačka",
    "en": "Oblique Crunch",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "core_flexion",
    "ez": "crunch",
    "load": "none",
    "pos": [
      "Lehni si na záda s pokrčenými koleny a chodidly na zemi. Prsty polož lehce u spánků.",
      "Lie supine with knees bent and feet grounded. Rest fingers lightly beside the temples."
    ],
    "exe": [
      "Zvedni lopatku a natoč hrudník směrem k protilehlému kolenu. Pomalu vrať a vystřídej strany, pánev zůstává klidná.",
      "Lift a shoulder blade and turn the chest toward the opposite knee. Lower slowly and alternate sides, keeping the pelvis still."
    ],
    "wat": [
      "Loket se nemusí dotknout kolena. Netahej za hlavu a rotaci nevynucuj švihem.",
      "The elbow need not touch the knee. Do not pull the head or force rotation with momentum."
    ],
    "pro": [
      "Lehčí: kratší zdvih nebo přímá zkracovačka. Těžší: krátká pauza nahoře a pomalejší návrat při stejném rozsahu.",
      "Easier: a smaller lift or straight crunches. Harder: pause briefly at the top and lower more slowly within the same range."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_oblique_crunch",
    "hd": null,
    "foc": [
      "Zvedni lopatku a natoč hrudník směrem k protilehlému kolenu.",
      "Lift a shoulder blade and turn the chest toward the opposite knee."
    ],
    "source": {
      "author": "Hevy",
      "document": "Oblique Crunch: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/oblique-crunches/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_hollow_rock",
    "cz": "Kolébání v hollow poloze",
    "en": "Hollow Body Rock",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 3,
    "C": 3,
    "family": "core_antiextension",
    "ez": "hollow",
    "load": "none",
    "pos": [
      "Lehni si na záda, zvedni lopatky a nohy. Paže natáhni nad hlavu nebo k bokům, bedra jemně přitiskni k podložce.",
      "Lie supine and lift shoulder blades and legs. Reach arms overhead or beside the hips, gently flattening the lower back."
    ],
    "exe": [
      "Malým impulzem se kolébej vpřed a vzad jako jeden pevný celek. Tvar těla se během pohybu nemění.",
      "Use a small impulse to rock as one firm unit. Maintain the same body shape throughout."
    ],
    "wat": [
      "Nekopej nohama pro další zhoupnutí. Pokud bedra narážejí nebo ztrácíš tvar, vrať se k výdrži.",
      "Do not kick the legs to keep rocking. Return to a hold if the back thumps or the shape breaks."
    ],
    "pro": [
      "Lehčí: skrčená kolena nebo statický hollow. Těžší: delší páka paží a nohou a potom více malých kolébek.",
      "Easier: bent knees or a static hollow. Harder: lengthen the arm and leg levers, then add small rocks."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_hollow_rock",
    "hd": null,
    "foc": [
      "Malým impulzem se kolébej vpřed a vzad jako jeden pevný celek.",
      "Use a small impulse to rock as one firm unit."
    ],
    "source": {
      "author": "Hevy",
      "document": "Hollow Rock Hold: How-to, Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/hollow-rock-hold/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_spider_plank",
    "cz": "Přitahování kolena k lokti v prkně",
    "en": "Spiderman Forearm Plank",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "hipflex",
      "sho"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "core_antiextension",
    "ez": "plank",
    "load": "none",
    "pos": [
      "Zaujmi prkno na předloktích, lokty pod rameny, chodidla trochu od sebe.",
      "Take a forearm plank with elbows below shoulders and feet slightly apart."
    ],
    "exe": [
      "Veď jedno koleno ze strany k lokti na stejné straně. Pomalu vrať a vystřídej nohy, pánev zůstává co nejklidnější.",
      "Bring one knee outward toward the same-side elbow. Return slowly and alternate legs, keeping the pelvis as steady as possible."
    ],
    "wat": [
      "Koleno se nemusí lokte dotknout. Nezvedej boky ani se nepropadej v bedrech.",
      "The knee need not touch the elbow. Avoid lifting the hips or sagging at the lower back."
    ],
    "pro": [
      "Lehčí: kratší pohyb kolena nebo statické prkno. Těžší: pomalejší přitažení a krátká pauza bez rotace pánve.",
      "Easier: a shorter knee motion or static plank. Harder: slower movement and a brief pause without pelvic rotation."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_spider_plank",
    "hd": null,
    "foc": [
      "Veď jedno koleno ze strany k lokti na stejné straně.",
      "Bring one knee outward toward the same-side elbow."
    ],
    "source": {
      "author": "Hevy",
      "document": "Spiderman Plank: How-to, Tips, Variations & Mistakes",
      "url": "https://www.hevyapp.com/exercises/spiderman-plank/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_knees_sideplank",
    "cz": "Boční prkno s oporou kolen",
    "en": "Bent-Knee Side Plank",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "obl"
    ],
    "ms": [
      "glu",
      "sho"
    ],
    "S": 1,
    "C": 1,
    "sideMode": "perSide",
    "family": "core_lateral",
    "hd": "sideplank",
    "load": "none",
    "measurementType": "DURATION",
    "pos": [
      "Lehni si na bok, kolena pokrč a loket dej pod rameno. Kolena zůstávají na sobě, hlava v prodloužení trupu.",
      "Lie on your side with knees bent and elbow below shoulder. Stack the knees and align the head with the torso."
    ],
    "exe": [
      "Zvedni pánev tak, aby rameno, kyčel a koleno tvořily přímku. Volně dýchej a kontrolovaně polož.",
      "Lift the pelvis until shoulder, hip and knee align. Breathe freely and lower under control."
    ],
    "wat": [
      "Nepropadej do ramene a netoč hrudník k podlaze. Pokud rameno vadí, zkus kratší výdrž nebo jinou oporu.",
      "Do not sink into the shoulder or rotate the chest down. Shorten the hold or change support if the shoulder is uncomfortable."
    ],
    "pro": [
      "Lehčí: zvedej pánev jen krátce. Těžší: delší kvalitní výdrž, pak natáhni horní nohu a nakonec obě nohy.",
      "Easier: lift for brief holds. Harder: extend controlled hold time, then straighten the upper leg and eventually both legs."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_knees_sideplank",
    "ez": null,
    "foc": [
      "Zvedni pánev tak, aby rameno, kyčel a koleno tvořily přímku.",
      "Lift the pelvis until shoulder, hip and knee align."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "4 Core Movements for Beginners",
      "url": "https://www.acefitness.org/resources/everyone/blog/5250/4-core-movements-for-beginners/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bear_hold",
    "cz": "Výdrž na čtyřech se zvednutými koleny",
    "en": "Bear Hover Hold",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "qua",
      "serr",
      "sho"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antiextension",
    "ez": null,
    "hd": "bearcrawl",
    "load": "none",
    "measurementType": "DURATION",
    "pos": [
      "Na čtyřech dej dlaně pod ramena a kolena pod kyčle. Špičky zapři do země.",
      "Place hands below shoulders and knees below hips on all fours. Tuck the toes."
    ],
    "exe": [
      "Zvedni obě kolena pár centimetrů nad zem a vydrž s klidným dechem. Záda a pánev udržuj v původní poloze.",
      "Hover both knees a few centimetres above the floor while breathing calmly. Preserve the original back and pelvic position."
    ],
    "wat": [
      "Kolena nezvedej vysoko a nehrb ramena k uším. Při únavě je polož, místo propadnutí v bedrech.",
      "Do not lift the knees high or shrug. Set the knees down when tired instead of sagging."
    ],
    "pro": [
      "Lehčí: krátké zvednutí nebo menší zatížení rukou na vyvýšení. Těžší: delší výdrž, pak pomalé malé kroky medvědí chůze.",
      "Easier: brief hovers or elevated hands. Harder: a longer hold followed by slow small bear-crawl steps."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_bear_hold",
    "foc": [
      "Zvedni obě kolena pár centimetrů nad zem a vydrž s klidným dechem.",
      "Hover both knees a few centimetres above the floor while breathing calmly."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "The Core Exercise You Should Be Doing — bear plank",
      "url": "https://library.theprehabguys.com/the-core-exercise-you-should-be-doing/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_plank_shoulder_tap",
    "cz": "Dotyky ramen ve vzporu",
    "en": "Plank Shoulder Tap",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "serr",
      "sho"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "core_antirotation",
    "ez": "plank",
    "load": "none",
    "pos": [
      "Zaujmi horní polohu kliku, ruce pod rameny a chodidla široce od sebe.",
      "Take a high plank with hands below shoulders and feet wide apart."
    ],
    "exe": [
      "Jednou rukou se pomalu dotkni protilehlého ramene a vrať ji na zem. Střídej strany s minimálním pohybem pánve.",
      "Slowly touch the opposite shoulder with one hand and return it. Alternate sides with minimal pelvic motion."
    ],
    "wat": [
      "Nespěchej a nezadržuj dech. Pokud se trup prudce kýve, zvětši oporu nebo zvedni ruce na lavici.",
      "Do not rush or hold your breath. Widen the base or elevate hands if the torso sways substantially."
    ],
    "pro": [
      "Lehčí: ruce na lavici nebo kolena na zemi. Těžší: užší postavení chodidel a delší pauza na jedné ruce.",
      "Easier: hands elevated or knees down. Harder: narrow the foot stance and pause longer on one hand."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_plank_shoulder_tap",
    "hd": null,
    "foc": [
      "Jednou rukou se pomalu dotkni protilehlého ramene a vrať ji na zem.",
      "Slowly touch the opposite shoulder with one hand and return it."
    ],
    "source": {
      "author": "Sweat",
      "document": "Shoulder Tap — exercise instructions",
      "url": "https://sweat.com/exercises/shoulder-tap"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_halfkneel_pallof",
    "cz": "Pallofův tlak v polokleku",
    "en": "Half-Kneeling Pallof Press",
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "glu"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "core_antirotation",
    "ez": "pallof",
    "pos": [
      "Klekni si bokem ke kladce ve výši hrudníku, jedno chodidlo vpředu. Drž madlo oběma rukama u hrudníku.",
      "Half-kneel side-on to a chest-height pulley with one foot forward. Hold the handle at the chest in both hands."
    ],
    "exe": [
      "Pomalu propni paže před sebe, aniž bys otočil hrudník. Krátce zastav a vrať. Potom změň stranu i opěrnou nohu podle plánu.",
      "Slowly extend the arms without rotating the chest. Pause and return. Change cable side and supporting leg as prescribed."
    ],
    "wat": [
      "Pánev se neposouvá ke kladce. Koleno podlož a zvol širší postoj, pokud je rovnováha největší překážkou.",
      "Do not let the pelvis drift toward the pulley. Pad the knee and widen the stance if balance limits the exercise."
    ],
    "pro": [
      "Lehčí: slabší odpor a širší opora. Těžší: delší pauza s nataženými pažemi, potom malý přírůstek odporu.",
      "Easier: less resistance and a wider base. Harder: a longer arms-extended pause, then a small resistance increase."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_halfkneel_pallof",
    "hd": null,
    "foc": [
      "Pomalu propni paže před sebe, aniž bys otočil hrudník.",
      "Slowly extend the arms without rotating the chest."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Half Kneeling Pallof Press — cable adaptation of band resistance",
      "url": "https://library.theprehabguys.com/vimeo-video/half-kneeling-pallof-press-band/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_body_saw",
    "cz": "Posuny těla v prkně na kluzácích",
    "en": "Body Saw",
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "core_antiextension",
    "ez": "plank",
    "load": "none",
    "pos": [
      "Zaujmi prkno na předloktích, špičky na kluzácích nebo ručníku na hladké podlaze.",
      "Take a forearm plank with toes on sliders or a towel on a smooth floor."
    ],
    "exe": [
      "Posuň celé pevné tělo několik centimetrů dozadu a vrať se dopředu. Lokty zůstávají na místě.",
      "Slide the rigid body a few centimetres backward, then forward. Keep the elbows fixed."
    ],
    "wat": [
      "Zastav, než se prohnou bedra nebo rameno tlačí. Dlouhá dráha není podmínkou účinného provedení.",
      "Stop before the lower back sags or the shoulder pinches. A long excursion is not required."
    ],
    "pro": [
      "Lehčí: statické prkno nebo nepatrný posun. Těžší: postupně delší dráha při stejné kontrole, nikoli současně více opakování.",
      "Easier: a static plank or tiny slide. Harder: gradually extend travel with the same control, without simultaneously adding repetitions."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_body_saw",
    "hd": null,
    "foc": [
      "Posuň celé pevné tělo několik centimetrů dozadu a vrať se dopředu.",
      "Slide the rigid body a few centimetres backward, then forward."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Plank Body Saw — slider adaptation",
      "url": "https://library.theprehabguys.com/vimeo-video/plank-body-saw-2/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_copenhagen_short",
    "cz": "Kodaňské prkno s oporou kolena",
    "en": "Short-Lever Copenhagen Plank",
    "pat": "stred",
    "eq": [
      "lavice"
    ],
    "mp": [
      "add",
      "obl"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "hip_adduction",
    "hd": "copenhagen",
    "load": "none",
    "measurementType": "DURATION",
    "pos": [
      "Lehni si bokem k nízké lavici. Horní pokrčené koleno a část stehna opři o polstrovaný vršek, předloktí o zem.",
      "Lie beside a low bench. Support the upper bent knee and part of the thigh on its padded top, forearm on the floor."
    ],
    "exe": [
      "Zvedni pánev a přibliž spodní nohu k horní. Drž trup rovně a klidně dýchej, potom pomalu polož.",
      "Lift the pelvis and bring the lower leg toward the upper. Keep the torso aligned, breathe calmly and lower slowly."
    ],
    "wat": [
      "Opora nesmí tlačit přímo do vnitřní strany kolenního kloubu. Začni krátkými výdržemi bez bolesti třísla.",
      "Avoid pressure directly into the inner knee joint. Begin with short holds without groin pain."
    ],
    "pro": [
      "Lehčí: spodní chodidlo nech pomáhat ze země. Těžší: méně dopomoci a delší výdrž, potom opora horního kotníku s delší pákou.",
      "Easier: let the lower foot assist from the floor. Harder: reduce assistance and lengthen holds, then support the upper ankle for a longer lever."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_copenhagen_short",
    "ez": null,
    "foc": [
      "Zvedni pánev a přibliž spodní nohu k horní.",
      "Lift the pelvis and bring the lower leg toward the upper."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Copenhagen Plank — On Knees",
      "url": "https://library.theprehabguys.com/vimeo-video/copenhagen-plank-on-knee/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_around_world",
    "cz": "Oblouky s jednoručkami vleže",
    "en": "Dumbbell Around the World",
    "pat": "tlak",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "mp": [
      "che",
      "sho"
    ],
    "ms": [],
    "S": 2,
    "C": 3,
    "family": "shoulder_arc",
    "tier": "specialist",
    "ez": "ex26_db_flat_fly",
    "pos": [
      "Lehni si na rovnou lavici a drž velmi lehké činky u boků, dlaně vzhůru. Lokty jsou mírně pokrčené.",
      "Lie on a flat bench with very light dumbbells beside the hips, palms upward and elbows slightly bent."
    ],
    "exe": [
      "Veď paže širokým obloukem do stran a směrem nad hlavu pouze v pohodlném rozsahu. Stejnou cestou vrať k bokům.",
      "Sweep the arms in a wide arc sideways and toward overhead only within a comfortable range. Reverse the arc toward the hips."
    ],
    "wat": [
      "Nepropadej pažemi pod úroveň trupu ani nezvedej žebra. Cvik vyžaduje volný pohyb ramen; není nutný pro základní trénink prsou.",
      "Do not drop arms below torso level or flare the ribs. This requires comfortable shoulder motion and is optional for basic chest training."
    ],
    "pro": [
      "Lehčí: oblouk bez činek nebo kratší dráha. Těžší: nejprve plynulý rozsah, potom velmi malý přírůstek váhy.",
      "Easier: unloaded arcs or shorter travel. Harder: first control the arc, then use very small load increments."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_around_world",
    "hd": null,
    "foc": [
      "Veď paže širokým obloukem do stran a směrem nad hlavu pouze v pohodlném rozsahu.",
      "Sweep the arms in a wide arc sideways and toward overhead only within a comfortable range."
    ],
    "source": {
      "author": "Hevy",
      "document": "Around The Worlds: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/around-the-worlds/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bb_overhead_tri",
    "cz": "Tricepsová extenze s EZ osou nad hlavou",
    "en": "Seated EZ-Bar Overhead Triceps Extension",
    "pat": "tlak",
    "eq": [
      "cinka",
      "lavice"
    ],
    "mp": [
      "tri"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "family": "elbow_extension",
    "ez": "dbtriext",
    "pos": [
      "Sedni si s chodidly na zemi. Bezpečně zvedni lehkou EZ osu nad hlavu a drž žebra nad pánví.",
      "Sit with feet grounded. Safely raise a light EZ bar overhead and keep ribs over pelvis."
    ],
    "exe": [
      "Pokrč lokty a spusť osu za hlavu, potom lokty narovnej. Nadloktí zůstávají v pohodlné poloze.",
      "Bend the elbows to lower the bar behind the head, then extend them. Keep upper arms at a comfortable angle."
    ],
    "wat": [
      "Nenuť lokty k sobě a nezakláněj bedra. Použij dopomoc pro podání, pokud není nástup zcela bezpečný.",
      "Do not force elbows together or arch the lower back. Use a handoff if setup is not fully secure."
    ],
    "pro": [
      "Lehčí: menší váha nebo jednoručka držená oběma rukama. Těžší: více opakování, pak malá zátěž při stejné poloze ramen.",
      "Easier: less load or one dumbbell held with both hands. Harder: more repetitions, then small load increments at the same shoulder position."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_bb_overhead_tri",
    "hd": null,
    "foc": [
      "Pokrč lokty a spusť osu za hlavu, potom lokty narovnej.",
      "Bend the elbows to lower the bar behind the head, then extend them."
    ],
    "source": {
      "author": "Hevy",
      "document": "Barbell Triceps Extension: How-to, Tips, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/triceps-extension-barbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_plate_front",
    "cz": "Předpažování s kotoučem",
    "en": "Plate Front Raise",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "sho"
    ],
    "ms": [
      "serr"
    ],
    "S": 1,
    "C": 1,
    "family": "front_raise",
    "ez": "an_frontraise",
    "pos": [
      "Ve stoji drž lehký kotouč oběma rukama v bezpečných madlech před stehny. Lokty měkce pokrčené.",
      "Stand holding a light plate securely in both hands in front of the thighs, elbows softly bent."
    ],
    "exe": [
      "Zvedni kotouč před sebe přibližně do výše ramen a pomalu spusť. Trup zůstává klidný.",
      "Raise the plate in front to about shoulder height and lower slowly. Keep the torso still."
    ],
    "wat": [
      "Nezakláněj se a netlač ramena k uším. Pokud tvar kotouče neumožní bezpečný úchop, použij jednoručky.",
      "Do not lean back or shrug. Use dumbbells if the plate shape prevents a secure grip."
    ],
    "pro": [
      "Lehčí: menší kotouč nebo kratší dráha. Těžší: přidej opakování před přechodem na těžší kotouč.",
      "Easier: a lighter plate or shorter range. Harder: add repetitions before moving to a heavier plate."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_plate_front",
    "hd": null,
    "foc": [
      "Zvedni kotouč před sebe přibližně do výše ramen a pomalu spusť.",
      "Raise the plate in front to about shoulder height and lower slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Plate Front Raise: How-to, Tips, Variations & More",
      "url": "https://www.hevyapp.com/exercises/how-to-plate-front-raise/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_behind_wrist",
    "cz": "Zápěstní zdvih s osou za tělem",
    "en": "Behind-the-Back Barbell Wrist Curl",
    "pat": "tah",
    "eq": [
      "cinka"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "wrist_flexion",
    "ez": "wristcurl",
    "pos": [
      "Ve stojanu uchop lehkou osu za stehny, dlaně směřují dozadu. Paže nech natažené, trup vzpřímený.",
      "Take a light bar from a rack behind the thighs, palms facing backward. Keep arms straight and torso upright."
    ],
    "exe": [
      "Ohnutím zápěstí zvedni osu malým pohybem a pomalu vrať. Lokty se neohýbají.",
      "Flex the wrists to raise the bar through a small movement, then lower slowly. Do not bend the elbows."
    ],
    "wat": [
      "Drž osu bezpečně, nerozvírej prsty pod těžkou váhou. Při nepohodlí ramen zvol opřenou variantu před tělem.",
      "Maintain a secure grip rather than opening fingers under heavy load. Use a supported front-body variation if shoulders are uncomfortable."
    ],
    "pro": [
      "Lehčí: opřený zápěstní zdvih s lehkou jednoručkou. Těžší: malé přírůstky váhy a pomalé spouštění bez ztráty úchopu.",
      "Easier: supported wrist curls with a light dumbbell. Harder: small load increments and slow lowering without losing the grip."
    ],
    "J": {
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_behind_wrist",
    "hd": null,
    "foc": [
      "Ohnutím zápěstí zvedni osu malým pohybem a pomalu vrať.",
      "Flex the wrists to raise the bar through a small movement, then lower slowly."
    ],
    "source": {
      "author": "Hevy",
      "document": "Behind the Back Wrist Curl (Barbell): How-to & Tips",
      "url": "https://www.hevyapp.com/exercises/behind-the-back-bicep-wrist-curl-barbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_upright_row",
    "cz": "Přítah osy podél trupu ve stoji",
    "en": "Barbell Upright Row",
    "pat": "tah",
    "eq": [
      "cinka"
    ],
    "mp": [
      "sho",
      "tra"
    ],
    "ms": [
      "bic"
    ],
    "S": 2,
    "C": 2,
    "family": "upright_row",
    "ez": "lateralraise",
    "pos": [
      "Stůj s lehkou osou před stehny. Zvol širší pohodlný nadhmat a volná kolena.",
      "Stand with a light bar before the thighs. Choose a comfortable moderately wide overhand grip and soft knees."
    ],
    "exe": [
      "Veď lokty do stran a osu vzhůru blízko těla. Konči nejvýše s lokty kolem úrovně ramen, případně níže, a pomalu spusť.",
      "Lead elbows outward and lift the bar close to the body. Stop with elbows at shoulder level or lower, then lower slowly."
    ],
    "wat": [
      "Netlač do sevření ramene ani nevytahuj osu povinně pod bradu. Při nepohodlí zvol upažování.",
      "Do not force shoulder pinching or insist on reaching the chin. Choose lateral raises if uncomfortable."
    ],
    "pro": [
      "Lehčí: kratší dráha a nižší váha. Těžší: více opakování, potom malý přírůstek zátěže bez vyššího zvedání loktů.",
      "Easier: shorter travel and less load. Harder: more repetitions, then a small load increase without raising elbows higher."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_upright_row",
    "hd": null,
    "foc": [
      "Veď lokty do stran a osu vzhůru blízko těla.",
      "Lead elbows outward and lift the bar close to the body."
    ],
    "source": {
      "author": "Hevy",
      "document": "Upright Barbell Row: How-to, Tips, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/how-to-upright-row-barbell/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_sternum_pullup",
    "cz": "Shyb hrudní kostí k hrazdě",
    "en": "Sternum Pull-Up",
    "pat": "tah",
    "eq": [
      "hrazda"
    ],
    "mp": [
      "lat",
      "upb"
    ],
    "ms": [
      "bic",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "pull_vertical",
    "ez": "pullup",
    "tier": "specialist",
    "load": "none",
    "pos": [
      "Uchop pevnou hrazdu nadhmatem. Začni kontrolovaným visem, chodidla mimo zem a dost prostoru před tělem.",
      "Grip a fixed bar overhand. Begin in a controlled hang with feet clear and enough space in front."
    ],
    "exe": [
      "Přitahuj se a postupně nakláněj hrudník vzhůru k hrazdě. Cíl je spodní hrudní kost blízko hrazdy; pomalu vrať do visu.",
      "Pull up while progressively angling the chest toward the bar. Bring the lower sternum near the bar and lower slowly to a hang."
    ],
    "wat": [
      "Nesnaž se dotknout za cenu prudkého bederního záklonu. Nejde o švihový shyb; nejprve ovládej běžné shyby.",
      "Do not force contact through abrupt lumbar arching. This is not a swinging pull-up; master strict pull-ups first."
    ],
    "pro": [
      "Lehčí: běžný shyb nebo přítah s oporou nohou směrem k hrudníku. Těžší: delší pauza nahoře a přesnější kontrolovaný návrat.",
      "Easier: strict pull-ups or foot-assisted chest-directed pulls. Harder: a longer top pause and more precise controlled lowering."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_sternum_pullup",
    "hd": null,
    "foc": [
      "Přitahuj se a postupně nakláněj hrudník vzhůru k hrazdě.",
      "Pull up while progressively angling the chest toward the bar."
    ],
    "source": {
      "author": "Hevy",
      "document": "Gironda Pull Up: How-to, Tips, Mistakes & Variations",
      "url": "https://www.hevyapp.com/exercises/sternum-pull-up-gironda/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kipping_pullup",
    "cz": "Shyb s řízeným švihem",
    "en": "Kipping Pull-Up",
    "pat": "tah",
    "eq": [
      "hrazda"
    ],
    "mp": [
      "lat",
      "bic"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 3,
    "C": 4,
    "family": "kipping_pull",
    "ez": null,
    "tier": "specialist",
    "load": "none",
    "pos": [
      "Na pevné vysoké hrazdě zaujmi jistý nadhmat. Pod sebou i před sebou měj volný prostor a zvládnutý aktivní vis.",
      "Take a secure overhand grip on a fixed high bar. Clear the area below and ahead; first master an active hang."
    ],
    "exe": [
      "Malým řízeným přechodem mezi hollow a protaženou polohou vytvoř švih. Načasuj tah tak, aby brada přešla přes hrazdu, a návrat aktivně kontroluj.",
      "Create a small controlled hollow-to-arch swing. Time the pull to bring the chin over the bar and actively control the return."
    ],
    "wat": [
      "Jde o specifickou dovednost, nikoli náhradu silového shybu. Uč se s trenérem, ne do selhání, a nepadat do pasivního ramene.",
      "This is a specific skill, not a replacement for strict strength work. Learn with a coach, avoid failure and do not drop into passive shoulders."
    ],
    "pro": [
      "Lehčí: malé řízené švihy a samostatný striktní shyb. Těžší: jednotlivá opakování spoj až po ovládnutí zpomalení a jistém úchopu.",
      "Easier: small controlled swings and separate strict pull-ups. Harder: link repetitions only after controlling deceleration with a secure grip."
    ],
    "J": {
      "ram": 3,
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_kipping_pullup",
    "hd": null,
    "foc": [
      "Malým řízeným přechodem mezi hollow a protaženou polohou vytvoř švih.",
      "Create a small controlled hollow-to-arch swing."
    ],
    "source": {
      "author": "Hevy",
      "document": "Kipping Pull Up: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/kipping-pull-up/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_kb_thruster",
    "cz": "Dřep a tlak s kettlebellem jednoruč",
    "en": "Single-Arm Kettlebell Thruster",
    "pat": "drep",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "qua",
      "glu",
      "sho"
    ],
    "ms": [
      "tri",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "sideMode": "perSide",
    "family": "squat_to_press",
    "ez": "goblet",
    "pos": [
      "Drž kettlebell v přední pozici u jednoho ramene. Chodidla nastav pro pohodlný dřep, zápěstí drž rovně.",
      "Hold a kettlebell in the rack at one shoulder. Set feet for a comfortable squat and keep the wrist straight."
    ],
    "exe": [
      "Udělej kontrolovaný dřep. Při vstávání přenes sílu nohou do tlaku činky nad hlavu. Nejprve vrať činku k rameni, pak opakuj.",
      "Squat under control, then transfer leg drive into an overhead press as you stand. Return the bell to the shoulder before repeating."
    ],
    "wat": [
      "Neukončuj tlak prohnutím beder a nenech činku udeřit do předloktí. Každou stranu trénuj zvlášť.",
      "Do not finish by arching the lower back or bang the bell onto the forearm. Train each side separately."
    ],
    "pro": [
      "Lehčí: zvlášť dřep a lehký tlak. Těžší: plynulejší spojení, potom malý přírůstek váhy. Rychlost nesmí předběhnout kontrolu.",
      "Easier: separate squats and light presses. Harder: improve the transition, then add a small load. Speed must not exceed control."
    ],
    "J": {
      "kyc": 1,
      "kol": 2,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_thruster",
    "hd": null,
    "foc": [
      "Udělej kontrolovaný dřep.",
      "Squat under control, then transfer leg drive into an overhead press as you stand."
    ],
    "source": {
      "author": "Hevy",
      "document": "Kettlebell Thruster: How-to, Tips, Mistakes, Variations",
      "url": "https://www.hevyapp.com/exercises/kettlebell-thruster/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_overhead_squat",
    "cz": "Dřep s osou nad hlavou",
    "en": "Overhead Squat",
    "pat": "drep",
    "eq": [
      "cinka"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "sho",
      "tra",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "squat_overhead",
    "ez": null,
    "tier": "specialist",
    "pos": [
      "S trenérem nastav bezpečný nástup a odložení. Drž lehkou technickou osu širokým úchopem nad hlavou, paže aktivně natažené.",
      "With a coach establish safe setup and unloading. Hold a light technique bar overhead with a wide grip and active straight arms."
    ],
    "exe": [
      "Klesej do dřepu a udržuj osu přibližně nad středem chodidel. Z pohodlné hloubky se plynule postav.",
      "Squat while keeping the bar roughly above midfoot. Stand smoothly from a comfortable depth."
    ],
    "wat": [
      "Hloubku nevyvažuj prohnutím beder. Nezačínej těžkou osou a nesnaž se zachraňovat ztracenou činku za hlavou.",
      "Do not compensate for depth with lumbar arching. Avoid heavy starts and do not try to rescue a lost bar behind the head."
    ],
    "pro": [
      "Lehčí: tyč, kratší dřep nebo oddělený nácvik opory nad hlavou. Těžší: nejprve stabilní hloubka, potom malé přidání váhy.",
      "Easier: a dowel, partial squat or separate overhead-support practice. Harder: establish stable depth before small load increases."
    ],
    "J": {
      "ram": 2,
      "kyc": 2,
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_overhead_squat",
    "hd": null,
    "foc": [
      "Klesej do dřepu a udržuj osu přibližně nad středem chodidel.",
      "Squat while keeping the bar roughly above midfoot."
    ],
    "source": {
      "author": "Hevy",
      "document": "Overhead Squat: How-to, Tips, Variations, Mistakes",
      "url": "https://www.hevyapp.com/exercises/overhead-squat/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_clean_pull",
    "cz": "Výtah na přemístění",
    "en": "Clean Pull",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "glu",
      "qua",
      "ham"
    ],
    "ms": [
      "tra",
      "low",
      "cal"
    ],
    "S": 3,
    "C": 4,
    "family": "olympic_pull",
    "ez": "deadlift",
    "hd": "powerclean",
    "tier": "specialist",
    "pos": [
      "Nastav osu nad středem chodidel a úchop těsně vně nohou. Zaujmi start pro přemístění s pevným trupem.",
      "Set the bar over midfoot with grip just outside the legs. Take a clean starting position with a braced torso."
    ],
    "exe": [
      "Zvedni osu tlakem nohou, udrž ji blízko těla a po průchodu kolem kolen zrychli propnutím kyčlí a kolen. Paže vedou, nepřebírají tah brzy.",
      "Lift through leg drive, keep the bar close and accelerate through hip and knee extension after passing the knees. Do not bend the arms early."
    ],
    "wat": [
      "Neházej boky do osy dopředu. Výtah bez zachycení uč s trenérem a ukonči při ztrátě rychlosti či dráhy.",
      "Do not thrust the hips forward into the bar. Learn this non-catching pull with a coach and stop when speed or path deteriorates."
    ],
    "pro": [
      "Lehčí: lehká osa z visu a nácvik pozic. Těžší: větší zátěž při zachované rychlosti, případně následný nácvik přemístění.",
      "Easier: a light bar from the hang and position drills. Harder: increase load while preserving speed, or separately learn the clean catch."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_clean_pull",
    "foc": [
      "Zvedni osu tlakem nohou, udrž ji blízko těla a po průchodu kolem kolen zrychli propnutím kyčlí a kolen.",
      "Lift through leg drive, keep the bar close and accelerate through hip and knee extension after passing the knees."
    ],
    "source": {
      "author": "Hevy",
      "document": "Clean Pull: How-to, Tips, Variations, Alternatives, and Mistakes",
      "url": "https://www.hevyapp.com/exercises/clean-pull/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_hang_snatch",
    "cz": "Trh z visu",
    "en": "Hang Snatch",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "ham",
      "sho",
      "tra",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "olympic_snatch",
    "ez": "ex26_overhead_squat",
    "tier": "specialist",
    "pos": [
      "Drž technickou osu širokým úchopem ve stoji. Z mírného podřepu a předklonu spusť osu do visu nad koleny.",
      "Hold a technique bar with a wide grip while standing. Bend slightly at hips and knees into a hang above the knees."
    ],
    "exe": [
      "Zrychli osu natažením nohou a kyčlí, potom se aktivně přesuň pod ni. Zachyť ji na natažených pažích v dřepu a stabilně se postav.",
      "Accelerate the bar through leg and hip extension, then actively move under it. Receive it on straight arms in a squat and stand securely."
    ],
    "wat": [
      "Nutný je nácvik s trenérem, vhodná osa, kotouče a prostor pro bezpečné odložení. Neuč se trh z těžké zátěže ani při únavě.",
      "Learn with a coach using suitable equipment and a safe unloading area. Do not learn with heavy loads or while fatigued."
    ],
    "pro": [
      "Lehčí: technická tyč, vysoký vis a zachycení výše. Těžší: nižší vis či plnější zachycení, poté zátěž. Každou změnu uč samostatně.",
      "Easier: a technique dowel, high hang and higher catch. Harder: lower the hang or receive deeper, then add load. Learn each change separately."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 3,
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hang_snatch",
    "hd": null,
    "foc": [
      "Zrychli osu natažením nohou a kyčlí, potom se aktivně přesuň pod ni.",
      "Accelerate the bar through leg and hip extension, then actively move under it."
    ],
    "source": {
      "author": "Hevy",
      "document": "Hang Snatch: How-to, Variations, Modifications & More",
      "url": "https://www.hevyapp.com/exercises/hang-snatch/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_clean_jerk",
    "cz": "Nadhoz",
    "en": "Clean and Jerk",
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "mp": [
      "qua",
      "glu",
      "sho"
    ],
    "ms": [
      "ham",
      "tri",
      "tra",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "olympic_clean_jerk",
    "ez": "powerclean",
    "tier": "specialist",
    "pos": [
      "Připrav lehkou technickou osu a volnou vzpěračskou plochu. Nastav start přemístění s rukama vně nohou.",
      "Prepare a light technique bar and a clear lifting platform. Set up for a clean with hands outside the legs."
    ],
    "exe": [
      "Přemísti osu na přední ramena a postav se. Znovu se zpevni, proveď krátký svislý podřep a výraz. Zachyť osu na natažených pažích ve výpadu s přední holení přibližně svisle, zadním kolenem mírně pokrčeným a zadní patou zvednutou. Stabilizuj, posuň přední nohu část cesty zpět a pak srovnej zadní nohu.",
      "Clean the bar to the front shoulders and stand. Rebrace, dip vertically and drive. Receive on straight arms in a split with the front shin roughly vertical, rear knee slightly bent and rear heel raised. Stabilize, recover the front foot partway back, then bring in the rear foot."
    ],
    "wat": [
      "Obě části se nejprve uč odděleně s trenérem. Zvládni úchop, přední držení, práci nohou a bezpečné puštění činky před přidáváním váhy.",
      "Learn both parts separately with a coach. Master grip, front rack, footwork and safe bar release before adding load."
    ],
    "pro": [
      "Lehčí: samostatné přemístění a výraz s technickou osou. Těžší: spojení do jednoho opakování, potom postupná váha bez ztráty jistoty v zachycení.",
      "Easier: separate clean and jerk drills with a technique bar. Harder: combine them into one repetition, then add load without losing catch security."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 3,
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_clean_jerk",
    "hd": null,
    "foc": [
      "Přemísti osu na přední ramena a postav se.",
      "Clean the bar to the front shoulders and stand."
    ],
    "source": {
      "author": "Hevy",
      "document": "Clean and Jerk: How-to, Tips, Variations & Mistakes",
      "url": "https://www.hevyapp.com/exercises/clean-and-jerk/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_frog_jump",
    "cz": "Žabí výskok",
    "en": "Frog Jump",
    "pat": "drep",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 2,
    "C": 3,
    "family": "jump_vertical",
    "ez": "jumpsquat",
    "load": "none",
    "pos": [
      "Stůj o něco šířeji než na šířku boků. Přejdi do pohodlného hlubšího dřepu, ruce nízko před tělem.",
      "Stand slightly wider than hip-width and lower into a comfortable deeper squat, hands low in front."
    ],
    "exe": [
      "Vyskoč svisle vzhůru. Dopadni měkce přes přední část chodidel na celá chodidla a pokrč kyčle i kolena. Před dalším výskokem se ustal.",
      "Jump vertically. Land softly through forefeet to whole feet, bending hips and knees. Stabilize before the next jump."
    ],
    "wat": [
      "Ruce nemusí dosáhnout na zem. Neskákej z hloubky, kterou neovládáš, a sérii ukonči při tvrdých dopadech.",
      "Hands need not reach the floor. Do not jump from an uncontrolled depth and stop when landings become heavy."
    ],
    "pro": [
      "Lehčí: mělký dřep s malým výskokem. Těžší: plynulé opakování až po jistých jednotlivých dopadech; nejde o vyčerpávací sérii.",
      "Easier: shallow small jumps. Harder: link jumps only after stable individual landings; avoid exhaustive sets."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_frog_jump",
    "hd": null,
    "foc": [
      "Vyskoč svisle vzhůru.",
      "Jump vertically."
    ],
    "source": {
      "author": "Hevy",
      "document": "Frog Jumps: How-to, Tips, Variations, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/frog-jumps/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_burpee_bar",
    "cz": "Burpee s bočním přeskokem osy",
    "en": "Lateral Burpee Over Bar",
    "pat": "prenos",
    "eq": [
      "telo",
      "cinka",
      "prostor"
    ],
    "mp": [
      "qua",
      "che",
      "glu"
    ],
    "ms": [
      "tri",
      "abs",
      "cal"
    ],
    "S": 3,
    "C": 3,
    "family": "burpee",
    "ez": "burpee",
    "load": "none",
    "pos": [
      "Polož stabilní osu před sebe s volným místem po obou stranách. Stoupni bokem k ní tak, aby ruce při burpee měly vlastní prostor.",
      "Place a stable bar with clear space on both sides. Stand alongside it with enough room for the burpee."
    ],
    "exe": [
      "Polož ruce, přejdi do vzporu a udělej kontrolovaný klik. Vrať nohy pod tělo, postav se a přeskoč osu bokem. Stabilizuj dopad.",
      "Place hands down, move into a plank and perform a controlled push-up. Bring feet underneath, stand and jump sideways over the bar. Stabilize the landing."
    ],
    "wat": [
      "Zajisti osu proti kutálení a nekříž nohy nad překážkou. Při únavě přejdi na překročení; rychlost nesmí vést k zakopnutí.",
      "Secure the bar against rolling and do not cross the feet over it. Step over when tired; speed must not create a trip hazard."
    ],
    "pro": [
      "Lehčí: burpee s kroky a překročení nízké značky. Těžší: plynulejší návaznost při stále přesném dopadu, nikoli vyšší překážka.",
      "Easier: step-back burpees and step over a low marker. Harder: smoother transitions with precise landings rather than a higher obstacle."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "conditioning",
    "goalRole": "conditioning",
    "genRule": "explicit",
    "variantKey": "ex26_burpee_bar",
    "hd": null,
    "foc": [
      "Polož ruce, přejdi do vzporu a udělej kontrolovaný klik.",
      "Place hands down, move into a plank and perform a controlled push-up."
    ],
    "source": {
      "author": "Hevy",
      "document": "Burpee Over the Bar: How-to, Tips, Mistakes & More",
      "url": "https://www.hevyapp.com/exercises/how-to-burpee-over-the-bar/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_one_swing",
    "cz": "Švih s kettlebellem jednoruč",
    "en": "One-Arm Kettlebell Swing",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "abs",
      "fore",
      "lat"
    ],
    "S": 3,
    "C": 3,
    "sideMode": "perSide",
    "family": "kettlebell_swing",
    "ez": "swing",
    "pos": [
      "Postav kettlebell před sebe, uchop jednou rukou a připrav pevný předklon z kyčlí. Volná ruka má prostor.",
      "Place a kettlebell ahead, grip with one hand and set a braced hip hinge. Leave space for the free arm."
    ],
    "exe": [
      "Zatáhni činku mezi stehna a prudkým natažením kyčlí ji nech vystoupat přibližně k hrudníku. Ruka nepředpažuje silou. Vrať činku do kyčelního ohybu.",
      "Hike the bell between the thighs and drive the hips to float it around chest height. Do not lift it with the arm. Receive it in a hip hinge."
    ],
    "wat": [
      "Neotáčej pánví za činkou a nedělej hluboký dřep. Předem nacvič bezpečné odložení před tělo.",
      "Do not twist the pelvis with the bell or use a deep squat. Rehearse parking the bell in front."
    ],
    "pro": [
      "Lehčí: obouruční švih. Těžší: více čistých jednotlivých švihů na stranu, potom váha; výměnu rukou uč zvlášť.",
      "Easier: two-hand swings. Harder: more crisp swings per side, then load; learn hand changes separately."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_one_swing",
    "hd": null,
    "foc": [
      "Zatáhni činku mezi stehna a prudkým natažením kyčlí ji nech vystoupat přibližně k hrudníku.",
      "Hike the bell between the thighs and drive the hips to float it around chest height."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "One-Arm Kettlebell Swing",
      "url": "https://www.strongfirst.com/simple-sinister-progressing-from-two-to-one-handed-swings/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_kb_double_squat",
    "cz": "Dřep se dvěma kettlebelly vpředu",
    "en": "Double-Kettlebell Front Squat",
    "pat": "drep",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "abs",
      "upb"
    ],
    "S": 3,
    "C": 3,
    "family": "squat_bilateral",
    "ez": "goblet",
    "pos": [
      "Bezpečně dostaň dva kettlebelly do předního držení u ramen. Lokty opři k trupu a stůj tak široce, jak potřebuješ pro dřep.",
      "Safely rack two kettlebells at the shoulders. Keep elbows near the torso and choose a comfortable squat stance."
    ],
    "exe": [
      "Pokrč kyčle a kolena, udrž činky blízko těla a klesej do ovládané hloubky. Tlakem chodidel se postav.",
      "Bend hips and knees, keep the bells close and descend to a controlled depth. Stand through the feet."
    ],
    "wat": [
      "Nepřenášej váhu na zakloněná zápěstí. Nástup se dvěma činkami musíš zvládat samostatně před těžkým dřepem.",
      "Do not load sharply bent wrists. Master getting two bells into position before heavy squats."
    ],
    "pro": [
      "Lehčí: jeden kettlebell v goblet držení. Těžší: opakování, potom mírně těžší pár při stejné hloubce a jistém nástupu.",
      "Easier: one bell in a goblet hold. Harder: repetitions, then a slightly heavier pair with unchanged depth and secure setup."
    ],
    "J": {
      "kol": 2,
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kb_double_squat",
    "hd": null,
    "foc": [
      "Pokrč kyčle a kolena, udrž činky blízko těla a klesej do ovládané hloubky.",
      "Bend hips and knees, keep the bells close and descend to a controlled depth."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Double-Kettlebell Front Squat",
      "url": "https://www.strongfirst.com/build-base-strength-5rm-kettlebell-front-squat-program/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_double_clean",
    "cz": "Přemístění dvou kettlebellů",
    "en": "Double-Kettlebell Clean",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "fore",
      "upb",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "kettlebell_clean",
    "ez": "kbclean",
    "tier": "specialist",
    "pos": [
      "Postav dva lehké kettlebelly před sebe. Zvol dostatečně široký postoj pro jejich průchod mezi stehny a pevný úchop.",
      "Place two light bells ahead. Choose a stance allowing both to pass between the thighs and take a secure grip."
    ],
    "exe": [
      "Zatáhni obě činky mezi nohy a kyčlemi je přiveď do předního držení. Ruce vlož do madel tak, aby činky měkce dosedly na předloktí.",
      "Hike both bells and drive them into the rack with the hips. Insert the hands through the handles so the bells settle softly on the forearms."
    ],
    "wat": [
      "Činky nesmí narážet do kolen ani do zápěstí. Uč se s lehkým párem a jednotlivými opakováními.",
      "Bells must not strike knees or wrists. Learn with a light pair and single repetitions."
    ],
    "pro": [
      "Lehčí: přemístění jedné činky. Těžší: propojená opakování se stejným měkkým zachycením, potom vyšší zátěž.",
      "Easier: a single-bell clean. Harder: linked repetitions with equally soft catches, then more load."
    ],
    "J": {
      "kyc": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_double_clean",
    "hd": null,
    "foc": [
      "Zatáhni obě činky mezi nohy a kyčlemi je přiveď do předního držení.",
      "Hike both bells and drive them into the rack with the hips."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Double-Kettlebell Clean",
      "url": "https://www.strongfirst.com/the-kur-for-your-kettlebell-swing-and-clean/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_kb_double_press",
    "cz": "Tlak dvou kettlebellů nad hlavu",
    "en": "Double-Kettlebell Strict Press",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "sho",
      "tri"
    ],
    "ms": [
      "abs",
      "tra"
    ],
    "S": 3,
    "C": 3,
    "family": "press_vertical",
    "ez": "kbpress",
    "pos": [
      "Drž dvě lehké činky v přední pozici u ramen. Chodidla pevně na zemi, žebra nad pánví.",
      "Rack two light bells at the shoulders. Ground the feet and stack ribs over pelvis."
    ],
    "exe": [
      "Vytlač obě činky nad hlavu bez pomoci nohou. Kontrolovaně vrať do předního držení.",
      "Press both bells overhead without leg drive. Lower under control to the rack."
    ],
    "wat": [
      "Nezakláněj bedra a nevybočuj hlavou dopředu pod činky. Pokud jedna strana ztrácí kontrolu, sniž zátěž obou.",
      "Do not arch the lower back or thrust the head forward. Reduce both loads if one side loses control."
    ],
    "pro": [
      "Lehčí: jednotlivé tlaky jednou činkou. Těžší: více čistých opakování, potom vyšší pár; podřep by změnil cvik na push press.",
      "Easier: single-bell presses. Harder: more strict repetitions, then a heavier pair; a knee dip changes this to a push press."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kb_double_press",
    "hd": null,
    "foc": [
      "Vytlač obě činky nad hlavu bez pomoci nohou.",
      "Press both bells overhead without leg drive."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Double-Kettlebell Strict Press",
      "url": "https://www.strongfirst.com/kettlebell-complexes-for-technical-perfection/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_windmill",
    "cz": "Větrný mlýn s kettlebellem",
    "en": "Kettlebell Windmill",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "glu",
      "ham",
      "obl"
    ],
    "ms": [
      "sho",
      "rcuff"
    ],
    "S": 2,
    "C": 4,
    "sideMode": "perSide",
    "family": "loaded_windmill",
    "tier": "specialist",
    "pos": [
      "Drž lehký kettlebell nad ramenem na natažené paži. Chodidla mírně natoč od zatížené strany, větší část váhy nes zadní nohou.",
      "Hold a light bell overhead on a straight arm. Turn feet slightly away from the loaded side and load the rear leg more."
    ],
    "exe": [
      "Posuň zatíženou kyčel dozadu a nech trup naklonit do strany. Spodní ruka klouže po vnitřní noze. Činka zůstává nad oporou ramene, pak se vrať.",
      "Shift the loaded-side hip back and tilt the torso. Slide the lower hand along the inner leg, keeping the bell stacked over the shoulder, then return."
    ],
    "wat": [
      "Nedotýkej se země za každou cenu. Pokud ztrácíš svislou oporu paže nebo klidnou páteř, zkrať rozsah.",
      "Do not force a floor touch. Shorten range if the arm loses its vertical support or the spine loses control."
    ],
    "pro": [
      "Lehčí: bez činky s rukou vzhůru, případně spodní činka. Těžší: kontrolovaný rozsah a teprve poté lehká zátěž nad hlavou.",
      "Easier: an unloaded overhead arm or a lower-hand bell. Harder: establish range before adding a light overhead load."
    ],
    "J": {
      "kyc": 2,
      "ram": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kb_windmill",
    "ez": null,
    "hd": null,
    "foc": [
      "Posuň zatíženou kyčel dozadu a nech trup naklonit do strany.",
      "Shift the loaded-side hip back and tilt the torso."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Kettlebell Windmill",
      "url": "https://www.strongfirst.com/kettlebell-windmill-101/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_halo",
    "cz": "Kroužení kettlebellem kolem hlavy",
    "en": "Kettlebell Halo",
    "pat": "mobilita",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "sho"
    ],
    "ms": [
      "rcuff",
      "abs"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "shoulder_circle_loaded",
    "pos": [
      "Drž lehký kettlebell oběma rukama za rohy před hrudníkem. Stůj pevně a zachovej klidná žebra.",
      "Hold a light kettlebell by the horns before the chest. Stand securely with quiet ribs."
    ],
    "exe": [
      "Veď činku pomalým kruhem kolem hlavy a vrať ji před hrudník. Hlava zůstává na místě. Střídej směr.",
      "Move the bell slowly around the head and back to the chest. Keep the head still and alternate direction."
    ],
    "wat": [
      "Činkou nenarážej do hlavy a nevytvářej prostor záklonem beder. Zvol lehkou zátěž.",
      "Do not hit the head or create room by arching the lower back. Keep the load light."
    ],
    "pro": [
      "Lehčí: kruh s prázdnýma rukama nebo malým kotoučem. Těžší: plynulejší kruh a pauzy v kontrolovaných místech, ne co nejtěžší činka.",
      "Easier: empty hands or a small plate. Harder: smoother circles and controlled pauses rather than maximal weight."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_kb_halo",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď činku pomalým kruhem kolem hlavy a vrať ji před hrudník.",
      "Move the bell slowly around the head and back to the chest."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Kettlebell Halo",
      "url": "https://www.strongfirst.com/proper-swing-grip-kettlebell-halo/"
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_half_getup",
    "cz": "Poloviční turecký vstávák do sedu",
    "en": "Turkish Half Get-Up to Tall Sit",
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "sho",
      "tri"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "get_up",
    "ez": null,
    "hd": "tgu",
    "pos": [
      "Lehni si s jednou paží svisle vzhůru a stejnou nohou pokrčenou, chodidlo na zemi. Druhá paže a noha leží šikmo od těla.",
      "Lie with one arm vertical and the same-side knee bent, foot grounded. Place the other arm and leg diagonally away."
    ],
    "exe": [
      "Přes chodidlo a protilehlé předloktí se přetoč do opory o loket, potom o dlaň do vysokého sedu. Stejnou cestou pomalu zpět.",
      "Roll onto the opposite elbow using the planted foot, then press onto the palm into a tall sit. Reverse slowly along the same path."
    ],
    "wat": [
      "Začni bez zátěže. Horní paži drž nad ramenem, ne před obličejem, a nenech loket podklesnout.",
      "Start unloaded. Keep the upper arm stacked over the shoulder rather than the face and do not let the supporting elbow collapse."
    ],
    "pro": [
      "Lehčí: pouze přetočení na loket. Těžší: nejprve celý návrat s lehkou činkou, potom samostatně naučený plný vstávák.",
      "Easier: roll only to the elbow. Harder: control the full return with a light bell, then separately learn the complete get-up."
    ],
    "J": {
      "ram": 2,
      "pat": 1,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_half_getup",
    "foc": [
      "Přes chodidlo a protilehlé předloktí se přetoč do opory o loket, potom o dlaň do vysokého sedu.",
      "Roll onto the opposite elbow using the planted foot, then press onto the palm into a tall sit."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Turkish Half Get-Up to Tall Sit",
      "url": "https://contentcdn.eacefitness.com/cp/pdfs/FitnessMatters/Jan10.pdf"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bottomup_press",
    "cz": "Tlak kettlebellu dnem vzhůru",
    "en": "Bottoms-Up Kettlebell Press",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "sho",
      "tri"
    ],
    "ms": [
      "fore",
      "rcuff",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "sideMode": "perSide",
    "family": "press_vertical",
    "ez": "kbpress",
    "tier": "specialist",
    "pos": [
      "S velmi lehkou činkou nastav držení dnem vzhůru u ramene. Madlo pevně sevři, předloktí drž přibližně svisle.",
      "With a very light bell establish an inverted bottoms-up rack. Grip the handle firmly with forearm roughly vertical."
    ],
    "exe": [
      "Pomalu vytlač činku nad rameno a kontrolovaně vrať. Rovnováha činky má přednost před výškou a váhou.",
      "Slowly press the bell above the shoulder and return under control. Bell balance takes priority over height and load."
    ],
    "wat": [
      "Volnou rukou buď připraven bezpečně pomoci. Necvič do selhání a nestůj pod padající činkou; zajisti volný prostor.",
      "Keep the free hand ready to assist safely. Avoid failure and clear the area rather than standing under a falling bell."
    ],
    "pro": [
      "Lehčí: krátká výdrž dnem vzhůru u ramene. Těžší: delší kontrolovaná dráha, potom velmi malý přírůstek zátěže.",
      "Easier: a brief bottoms-up rack hold. Harder: a longer controlled press range, then very small load increments."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_bottomup_press",
    "hd": null,
    "foc": [
      "Pomalu vytlač činku nad rameno a kontrolovaně vrať.",
      "Slowly press the bell above the shoulder and return under control."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Bottoms-Up Kettlebell Press",
      "url": "https://www.strongfirst.com/the-bottoms-up-experiment/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_waiter_carry",
    "cz": "Chůze s činkou nad hlavou jednoruč",
    "en": "Waiter Carry",
    "pat": "prenos",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "sho",
      "obl"
    ],
    "ms": [
      "rcuff",
      "tra",
      "fore"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "loaded_carry",
    "ez": null,
    "measurementType": "WEIGHT_DURATION",
    "pos": [
      "Bezpečně vytlač lehkou činku nad jedno rameno. Paže je natažená, zápěstí nad loktem a žebra nad pánví.",
      "Safely press a light bell over one shoulder. Stack wrist over elbow on a straight arm, ribs over pelvis."
    ],
    "exe": [
      "Jdi krátkými klidnými kroky a drž zátěž nad oporou těla. Otoč se široce nebo činku před změnou směru odlož.",
      "Walk with short calm steps, keeping the load stacked. Turn broadly or unload before changing direction."
    ],
    "wat": [
      "Neuhýbej trupem do strany a neprohýbej bedra. Trasa musí být bez překážek a nízkých stropů.",
      "Do not lean sideways or arch the lower back. Clear obstacles and overhead obstructions."
    ],
    "pro": [
      "Lehčí: krátká výdrž na místě nebo přední držení. Těžší: delší chůze, potom váha, při stále klidné paži.",
      "Easier: a brief stationary hold or front-rack carry. Harder: walk longer, then increase load while the arm remains stable."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "load": "ext",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_waiter_carry",
    "hd": null,
    "foc": [
      "Jdi krátkými klidnými kroky a drž zátěž nad oporou těla.",
      "Walk with short calm steps, keeping the load stacked."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Waiter Carry",
      "url": "https://www.strongfirst.com/consider-adding-kettlebell-carries-training/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cross_carry",
    "cz": "Chůze se zátěží nad hlavou a u boku",
    "en": "Cross-Body Mixed Carry",
    "pat": "prenos",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "obl",
      "sho"
    ],
    "ms": [
      "fore",
      "tra"
    ],
    "S": 3,
    "C": 3,
    "sideMode": "perSide",
    "family": "loaded_carry",
    "ez": "ex26_waiter_carry",
    "tier": "specialist",
    "measurementType": "WEIGHT_DURATION",
    "pos": [
      "Jednu lehkou činku drž nad ramenem a druhou u protilehlého boku. Nastav vzpřímený trup a volnou trasu.",
      "Hold one light bell overhead and another beside the opposite hip. Stand upright on a clear route."
    ],
    "exe": [
      "Jdi pomalu bez uklánění. Po odložení činek vystřídej horní a spodní stranu.",
      "Walk slowly without leaning. Unload before switching which arm is overhead."
    ],
    "wat": [
      "Nezvyšuj spodní zátěž na úkor polohy horní paže. Zapisuj obě hmotnosti, protože jejich součet nevystihuje rozložení.",
      "Do not increase the lower load at the expense of the overhead arm. Record both loads; their sum does not capture distribution."
    ],
    "pro": [
      "Lehčí: samostatně kufrová a číšnická chůze. Těžší: delší trasa při stejné dvojici zátěží, potom malá změna jedné z nich.",
      "Easier: separate suitcase and waiter carries. Harder: extend distance with the same pair, then make a small change to one load."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "load": "ext",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cross_carry",
    "hd": null,
    "foc": [
      "Jdi pomalu bez uklánění.",
      "Walk slowly without leaning."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Cross-Body Mixed Carry",
      "url": "https://www.strongfirst.com/consider-adding-kettlebell-carries-training/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_suitcase_deadlift",
    "cz": "Mrtvý tah se zátěží u jednoho boku",
    "en": "Suitcase Deadlift",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "obl",
      "fore",
      "qua"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "hinge_asymmetric",
    "ez": "an_dbdeadlift",
    "pos": [
      "Postav kettlebell nebo jednoručku vedle jednoho chodidla. Předkloň se z kyčlí a pokrč kolena, ramena drž v přibližně stejné výši.",
      "Place a kettlebell or dumbbell beside one foot. Hinge and bend the knees while keeping shoulders roughly level."
    ],
    "exe": [
      "Uchop zátěž a postav se bez úklonu. Kontrolovaně ji vrať na zem stejnou dráhou.",
      "Grip the load and stand without leaning sideways. Return it to the floor along the same path under control."
    ],
    "wat": [
      "Pokud nedosáhneš bez úklonu, zvedni činku na stabilní blok. Druhou rukou se neopírej o stehno pro překonání těžké váhy.",
      "Raise the weight on a stable block if reaching requires leaning. Do not push the free hand on the thigh to overcome excess load."
    ],
    "pro": [
      "Lehčí: vyšší opora a menší váha. Těžší: nižší opora nebo vyšší zátěž, vždy s klidnou pánví a rameny.",
      "Easier: higher support and less load. Harder: lower support or more load while keeping pelvis and shoulders steady."
    ],
    "J": {
      "kyc": 2,
      "pat": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_suitcase_deadlift",
    "hd": null,
    "foc": [
      "Uchop zátěž a postav se bez úklonu.",
      "Grip the load and stand without leaning sideways."
    ],
    "source": {
      "author": "StrongFirst",
      "document": "Suitcase Deadlift",
      "url": "https://www.strongfirst.com/3-month-plan-for-beginner-group-lessons/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_bearhug_carry",
    "cz": "Chůze s vakem v objetí",
    "en": "Sandbag Bear-Hug Carry",
    "pat": "prenos",
    "eq": [
      "zavazi",
      "prostor"
    ],
    "mp": [
      "glu",
      "abs",
      "upb"
    ],
    "ms": [
      "fore",
      "qua"
    ],
    "S": 2,
    "C": 2,
    "family": "loaded_carry",
    "ez": null,
    "measurementType": "WEIGHT_DURATION",
    "pos": [
      "Zvedni přiměřeně lehký tréninkový vak bezpečně z vyvýšené opory a obejmi ho před trupem. Nezakrývej si výhled.",
      "Lift a manageable training sandbag from a raised support and hug it before the torso without obstructing vision."
    ],
    "exe": [
      "Jdi krátkými kroky s vakem blízko těla. Dýchej průběžně a po úseku vrať vak na oporu.",
      "Walk with short steps and the bag close. Keep breathing and return it to the support after the interval."
    ],
    "wat": [
      "Nezakláněj se pod vahou a nepokračuj, když vak sjíždí. Použij uzavřený vak určený pro trénink.",
      "Do not lean back or continue as the bag slips. Use a securely closed training sandbag."
    ],
    "pro": [
      "Lehčí: menší vak a kratší úsek. Těžší: delší chůze nebo vyšší váha při zachovaném výhledu a dechu.",
      "Easier: a smaller bag and shorter interval. Harder: walk longer or carry more while retaining vision and breathing."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "load": "ext",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_bearhug_carry",
    "hd": null,
    "foc": [
      "Jdi krátkými kroky s vakem blízko těla.",
      "Walk with short steps and the bag close."
    ],
    "source": {
      "author": "Jarlo Ilano, GMB Fitness",
      "document": "Loaded Carries — sandbag bear hug",
      "url": "https://gmb.io/loaded-carries/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_snapdown",
    "cz": "Rychlé snížení do dopadové polohy",
    "en": "Snap-Down to Athletic Stance",
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 2,
    "family": "landing",
    "hd": "ex26_drop_landing",
    "load": "none",
    "pos": [
      "Stůj vzpřímeně, chodidla přibližně na šířku boků a paže vzhůru. Připrav volný neklouzavý povrch.",
      "Stand tall with feet around hip-width and arms overhead on a clear nonslip surface."
    ],
    "exe": [
      "Rychle stáhni paže a sniž se do mírného podřepu, jako bys tlumil dopad. Zastav s chodidly na zemi a vydrž dvě sekundy.",
      "Quickly pull the arms down and lower into a shallow athletic squat as if absorbing a landing. Stabilize with feet grounded for two seconds."
    ],
    "wat": [
      "Není potřeba vyskočit. Kolena směřují přibližně s chodidly a trup se nehroutí.",
      "No jump is required. Keep knees roughly aligned with feet and avoid collapsing the torso."
    ],
    "pro": [
      "Lehčí: pomalý přechod do podřepu. Těžší: rychlejší snížení při stejném tichém zastavení, potom nízký seskok.",
      "Easier: lower slowly. Harder: speed up the descent with equally quiet control, then introduce a low drop."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_snapdown",
    "ez": null,
    "foc": [
      "Rychle stáhni paže a sniž se do mírného podřepu, jako bys tlumil dopad.",
      "Quickly pull the arms down and lower into a shallow athletic squat as if absorbing a landing."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Snap-Down to Athletic Stance",
      "url": "https://www.nsca.com/education/videos/plyometric-implementation-setup-and-execution-of-jump-landing-positions-to-decrease-likelihood-of-injuries/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_drop_landing",
    "cz": "Seskok z nízké bedny se zastavením",
    "en": "Low Box Drop Landing",
    "pat": "drep",
    "eq": [
      "lavice",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 2,
    "C": 3,
    "family": "landing",
    "ez": "ex26_snapdown",
    "load": "none",
    "pos": [
      "Stoupni na nízkou pevnou bednu, pro začátek zhruba 10 až 20 cm. Před ní musí být volná neklouzavá plocha.",
      "Stand on a low stable box, initially around 10–20 cm. Clear a nonslip landing area in front."
    ],
    "exe": [
      "Udělej krok z hrany bez výskoku vzhůru. Dopadni na obě nohy, pokrč kyčle a kolena a zastav na dvě sekundy.",
      "Step off without jumping upward. Land on both feet, bend hips and knees and stabilize for two seconds."
    ],
    "wat": [
      "Výšku určuje kvalita dopadu, nikoli odvaha. Tvrdý dopad, dodatečný krok nebo bolest znamenají snížit nárok.",
      "Choose height by landing quality. Heavy impact, an extra recovery step or pain means reducing demand."
    ],
    "pro": [
      "Lehčí: snížení do dopadové polohy bez bedny. Těžší: malý přírůstek výšky po jistých dopadech; odraz po dopadu je samostatná dovednost.",
      "Easier: snap-downs without a box. Harder: add a little height after reliable landings; rebounding is a separate skill."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_drop_landing",
    "hd": null,
    "foc": [
      "Udělej krok z hrany bez výskoku vzhůru.",
      "Step off without jumping upward."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Low Box Drop Landing",
      "url": "https://www.nsca.com/education/videos/plyometric-implementation-setup-and-execution-of-jump-landing-positions-to-decrease-likelihood-of-injuries/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_pogo",
    "cz": "Nízké pružné odrazy z kotníků",
    "en": "Low Bilateral Pogo Hops",
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "cal"
    ],
    "ms": [
      "qua"
    ],
    "S": 2,
    "C": 2,
    "family": "ankle_hop",
    "ez": "calfraise",
    "hd": "ex26_single_pogo",
    "load": "none",
    "pos": [
      "Stůj na rovném pružném neklouzavém povrchu, chodidla pod boky. Kolena nech měkká a trup vzpřímený.",
      "Stand on a level resilient nonslip surface with feet under hips, soft knees and an upright torso."
    ],
    "exe": [
      "Dělej malé rytmické odrazy oběma nohama. Od země se zvedej jen málo a kontakt udržuj krátký a klidný.",
      "Make small rhythmic two-foot hops. Stay close to the floor with brief quiet contacts."
    ],
    "wat": [
      "Kolena nezamykej. Při bolesti Achillovy šlachy, chodidla nebo ztrátě rytmu sérii ukonči.",
      "Do not lock the knees. Stop with Achilles or foot pain or loss of rhythm."
    ],
    "pro": [
      "Lehčí: jednotlivý malý poskok s pauzou. Těžší: delší krátká série, potom odrazy na jedné noze; přidávej kontakty postupně.",
      "Easier: individual small hops with pauses. Harder: slightly longer short sets, then single-leg hops; increase contacts gradually."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_pogo",
    "foc": [
      "Dělej malé rytmické odrazy oběma nohama.",
      "Make small rhythmic two-foot hops."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Low Bilateral Pogo Hops",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/plyometric-exercises/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_single_pogo",
    "cz": "Nízké pružné odrazy jednonož",
    "en": "Single-Leg Low Pogo Hops",
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "cal"
    ],
    "ms": [
      "glu",
      "qua"
    ],
    "S": 3,
    "C": 3,
    "sideMode": "perSide",
    "family": "ankle_hop",
    "ez": "ex26_pogo",
    "load": "none",
    "pos": [
      "Stůj na jedné noze na rovném neklouzavém povrchu. Volnou nohu lehce pokrč a pánev drž klidnou.",
      "Balance on one leg on a level nonslip surface. Bend the free leg slightly and steady the pelvis."
    ],
    "exe": [
      "Dělej malé pružné odrazy na místě s měkkým kolenem. Udrž chodidlo pod tělem a nízkou výšku.",
      "Make small springy hops in place with a soft knee. Keep the foot under the body and height low."
    ],
    "wat": [
      "Nezačínej dlouhými sériemi. Pokud se vychyluješ do stran nebo kotník bolí, vrať se k obounožní variantě.",
      "Avoid long initial sets. Return to two feet if you drift sideways or the ankle hurts."
    ],
    "pro": [
      "Lehčí: obounožní pogo. Těžší: více kvalitních kontaktů, pak malé posuny vpřed; objem a vzdálenost nezvyšuj současně.",
      "Easier: bilateral pogos. Harder: more quality contacts, then small forward travel; do not increase volume and distance together."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_single_pogo",
    "hd": null,
    "foc": [
      "Dělej malé pružné odrazy na místě s měkkým kolenem.",
      "Make small springy hops in place with a soft knee."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Single-Leg Low Pogo Hops",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/plyometric-exercises/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_lateral_linehop",
    "cz": "Boční přeskoky čáry obounož",
    "en": "Bilateral Lateral Line Hops",
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "cal",
      "qua"
    ],
    "ms": [
      "glu"
    ],
    "S": 2,
    "C": 3,
    "family": "jump_lateral",
    "ez": "ex26_pogo",
    "load": "none",
    "pos": [
      "Stoupni bokem k čáře na zemi, chodidla blízko sebe a kolena mírně měkká.",
      "Stand beside a floor line with feet close together and knees soft."
    ],
    "exe": [
      "Malými odrazy přeskakuj čáru ze strany na stranu. Dopadej oběma nohama současně bez velkého vychylování trupu.",
      "Hop across the line side to side with small jumps. Land on both feet together without large torso sway."
    ],
    "wat": [
      "Použij čáru, ne vysokou překážku. Při ztrátě rytmu nebo přesnosti zastav.",
      "Use a line rather than a raised obstacle. Stop when rhythm or accuracy fades."
    ],
    "pro": [
      "Lehčí: boční kroky přes čáru nebo jednotlivé skoky s pauzou. Těžší: rychlejší rytmus při stejné malé vzdálenosti.",
      "Easier: lateral steps or individual paused hops. Harder: a quicker rhythm across the same small distance."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_linehop",
    "hd": null,
    "foc": [
      "Malými odrazy přeskakuj čáru ze strany na stranu.",
      "Hop across the line side to side with small jumps."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Bilateral Lateral Line Hops",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/plyometric-exercises/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_single_broad_stick",
    "cz": "Skok vpřed jednonož se zastavením",
    "en": "Single-Leg Forward Hop and Stick",
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "ham",
      "cal"
    ],
    "S": 3,
    "C": 4,
    "sideMode": "perSide",
    "family": "jump_horizontal",
    "ez": "broadjump",
    "load": "none",
    "pos": [
      "Stůj na jedné noze, kyčel a koleno mírně pokrčené. Před sebou měj volnou plochu.",
      "Stand on one leg with hip and knee slightly bent and a clear landing area ahead."
    ],
    "exe": [
      "Odraz se jen krátce vpřed a dopadni na stejnou nohu. Ztlum pohyb v kyčli a koleni a vydrž dvě sekundy.",
      "Hop a short distance forward onto the same foot. Absorb through hip and knee and stabilize for two seconds."
    ],
    "wat": [
      "Délka je podřízená kontrole. Pokud musíš doskočit druhou nohou, zkrať skok nebo použij obě nohy.",
      "Distance is secondary to control. Shorten the hop or use two feet if the other foot must catch you."
    ],
    "pro": [
      "Lehčí: obounožní skok se zastavením. Těžší: mírně delší skok se stejnou stabilizací, pak teprve návazná opakování.",
      "Easier: a two-foot jump and stick. Harder: a slightly longer stable hop before linking repetitions."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_single_broad_stick",
    "hd": null,
    "foc": [
      "Odraz se jen krátce vpřed a dopadni na stejnou nohu.",
      "Hop a short distance forward onto the same foot."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Single-Leg Forward Hop and Stick",
      "url": "https://dxpprod.nsca.com/contentassets/d19cbe3d9dba4135ac14396f8efc8e7e/nsca-coach-8.2.1-mens-lacrosse-performance-enhancement-and-injury-prevention.pdf"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_rotational_jump",
    "cz": "Malý výskok s otočením o čtvrt otáčky",
    "en": "Quarter-Turn Jump and Stick",
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal",
      "obl"
    ],
    "S": 2,
    "C": 3,
    "sideMode": "perSide",
    "family": "jump_rotation",
    "ez": "jumpsquat",
    "load": "none",
    "pos": [
      "Stůj na dvou nohách s volným prostorem kolem. Vyber směr otočení a místo dopadu.",
      "Stand on two feet with clear surrounding space. Choose the turn direction and landing spot."
    ],
    "exe": [
      "Z malého podřepu vyskoč a ve vzduchu otoč celé tělo asi o 90°. Dopadni na obě nohy a zastav.",
      "Jump from a small dip and turn the whole body about 90° in the air. Land on both feet and stabilize."
    ],
    "wat": [
      "Neotáčej kolena proti chodidlům, která ještě stojí na zemi. Začni i menším úhlem, pokud je dopad nejistý.",
      "Do not twist knees against planted feet. Start with a smaller angle if the landing is uncertain."
    ],
    "pro": [
      "Lehčí: krok s otočením nebo menší úhel. Těžší: přesnější rychlejší provedení na obě strany; větší otočka není nutná.",
      "Easier: a turning step or smaller angle. Harder: improve precision and speed in both directions; a larger turn is optional."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_rotational_jump",
    "hd": null,
    "foc": [
      "Z malého podřepu vyskoč a ve vzduchu otoč celé tělo asi o 90°.",
      "Jump from a small dip and turn the whole body about 90° in the air."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Quarter-Turn Jump and Stick",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/plyometric-exercises/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_a_march",
    "cz": "Běžecký pochod s vysokým kolenem",
    "en": "A-March",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "hipflex"
    ],
    "ms": [
      "glu",
      "cal"
    ],
    "S": 1,
    "C": 2,
    "family": "run_drill",
    "hd": "ex26_a_skip",
    "load": "none",
    "measurementType": "DISTANCE",
    "pos": [
      "Stůj vzpřímeně, lokty pokrčené a před sebou volnou rovnou dráhu.",
      "Stand tall with bent elbows and a clear level lane ahead."
    ],
    "exe": [
      "Pochoduj s aktivním zvedáním kolena a protilehlé paže. Chodidlo vracej pod tělo, střídej nohy v klidném rytmu.",
      "March with an active knee lift and opposite arm action. Return the foot under the body and alternate in a calm rhythm."
    ],
    "wat": [
      "Nezakláněj se kvůli výšce kolena a nedělej dlouhé kroky před sebe.",
      "Do not lean backward to lift the knee higher or overstride."
    ],
    "pro": [
      "Lehčí: pochod na místě s menším zdvihem. Těžší: plynulá chůze vpřed, potom A-skip.",
      "Easier: march in place with a smaller lift. Harder: smooth forward travel, then A-skips."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_a_march",
    "ez": null,
    "foc": [
      "Pochoduj s aktivním zvedáním kolena a protilehlé paže.",
      "March with an active knee lift and opposite arm action."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "A-March",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/high-knee-drills/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_a_skip",
    "cz": "Běžecký skipink A",
    "en": "A-Skip",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "cal",
      "hipflex"
    ],
    "ms": [
      "glu",
      "qua"
    ],
    "S": 2,
    "C": 3,
    "family": "run_drill",
    "ez": "ex26_a_march",
    "load": "none",
    "measurementType": "DISTANCE",
    "pos": [
      "Na rovné dráze začni vzpřímeným postojem a volnými rameny.",
      "Start tall on a level lane with relaxed shoulders."
    ],
    "exe": [
      "Spoj zvednutí kolena s malým poskokem na stojné noze. Střídej pravou a levou v pravidelném rytmu s protilehlými pažemi.",
      "Combine each knee lift with a small skip from the supporting foot. Alternate legs rhythmically with opposite arm action."
    ],
    "wat": [
      "Neskákej co nejvýše. Chodidla vracej pod tělo, trup se nekolébá dozadu.",
      "Do not chase maximum height. Return feet under the body without rocking backward."
    ],
    "pro": [
      "Lehčí: A-pochod. Těžší: plynulejší rytmus a krátká vyšší kadence při zachované koordinaci.",
      "Easier: A-marching. Harder: smoother rhythm and brief faster cadence while preserving coordination."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_a_skip",
    "hd": null,
    "foc": [
      "Spoj zvednutí kolena s malým poskokem na stojné noze.",
      "Combine each knee lift with a small skip from the supporting foot."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "A-Skip",
      "url": "https://dxpprod.nsca.com/education/articles/kinetic-select/high-knee-drills/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_wall_march",
    "cz": "Běžecké střídání kolen s oporou o zeď",
    "en": "Wall Acceleration March",
    "pat": "prenos",
    "eq": [
      "zed"
    ],
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "cal",
      "abs"
    ],
    "S": 1,
    "C": 2,
    "sideMode": "perSide",
    "family": "run_drill",
    "ez": "ex26_a_march",
    "load": "none",
    "pos": [
      "Opři dlaně o pevnou zeď a odstup do mírného náklonu celého těla. Stojná noha, kyčel a trup jsou v jedné linii.",
      "Place palms on a solid wall and step back into a whole-body lean. Align supporting leg, hip and torso."
    ],
    "exe": [
      "Zvedni jedno koleno dopředu a pak chodidlo vrať na původní místo opory za svislicí kyčle. Střídej nohy pomalu a zachovej stejný náklon celého těla.",
      "Lift one knee forward, then return the foot to its original support point behind the vertical line of the hip. Alternate slowly while preserving the same whole-body lean."
    ],
    "wat": [
      "Neohýbej se jen v pase a neprohýbej bedra. Podlaha musí bezpečně držet opěrné chodidlo.",
      "Do not bend only at the waist or arch the lower back. The floor must securely grip the supporting foot."
    ],
    "pro": [
      "Lehčí: menší náklon a jednotlivé zdvihy. Těžší: přesnější rychlá výměna nohou po zvládnutí pomalé varianty.",
      "Easier: less lean and individual lifts. Harder: crisp faster leg exchanges after mastering slow marching."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_wall_march",
    "hd": null,
    "foc": [
      "Zvedni jedno koleno dopředu a pak chodidlo vrať na původní místo opory za svislicí kyčle.",
      "Lift one knee forward, then return the foot to its original support point behind the vertical line of the hip."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "Wall Acceleration March",
      "url": "https://www.nsca.com/contentassets/53f36e5db26a4729b251fb794c166af1/tsac-module-4.0--4.5.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_lateral_shuffle",
    "cz": "Boční posun v atletickém postoji",
    "en": "Lateral Shuffle",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "glu",
      "qua",
      "add"
    ],
    "ms": [
      "cal"
    ],
    "S": 2,
    "C": 2,
    "sideMode": "perSide",
    "family": "change_direction",
    "load": "none",
    "measurementType": "DISTANCE_DURATION",
    "pos": [
      "Zaujmi mírný podřep s chodidly od sebe. Předem zkontroluj volnou boční dráhu.",
      "Take a shallow athletic stance with feet apart. Check a clear lateral lane."
    ],
    "exe": [
      "Odtlač se vzdálenější nohou a posouvej se do strany krátkými kroky bez křížení chodidel. Zpomal před koncem dráhy.",
      "Push through the trailing leg and move sideways with short steps without crossing the feet. Decelerate before the end."
    ],
    "wat": [
      "Chodidla nesrážej k sobě a nezůstávej příliš vysoko. Nejprve zvládni zastavení, potom rychlost.",
      "Do not click the feet together or stand too tall. Master stopping before increasing speed."
    ],
    "pro": [
      "Lehčí: boční chůze. Těžší: rychlejší přesun, potom předem určená změna směru s dostatkem místa.",
      "Easier: lateral walking. Harder: faster shuffling, then planned direction changes with adequate space."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_shuffle",
    "ez": null,
    "hd": null,
    "foc": [
      "Odtlač se vzdálenější nohou a posouvej se do strany krátkými kroky bez křížení chodidel.",
      "Push through the trailing leg and move sideways with short steps without crossing the feet."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "ACE - Certified&trade;: July 2020 - Multisport Agility: An ACE Integrated Fitness Training® Model Workout",
      "url": "https://www.acefitness.org/continuing-education/certified/july-2020/7585/multisport-agility-an-ace-integrated-fitness-training-model-workout/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_carioca",
    "cz": "Běžecké překračování bokem",
    "en": "Carioca Crossover Step",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "glu",
      "add",
      "hipflex"
    ],
    "ms": [
      "cal",
      "obl"
    ],
    "S": 1,
    "C": 3,
    "sideMode": "perSide",
    "family": "run_drill",
    "ez": "ex26_lateral_shuffle",
    "load": "none",
    "measurementType": "DISTANCE",
    "pos": [
      "Stůj bokem ke směru pohybu na rovné dráze. Paže nech uvolněné pro rovnováhu.",
      "Stand side-on to a clear level lane with arms relaxed for balance."
    ],
    "exe": [
      "Při pohybu do strany střídej překřížení zadní nohy před a za tělem. Pánev přirozeně rotuje, chodidla se nezachytávají.",
      "Travel laterally, alternating the trailing leg in front of and behind the body. Let the pelvis rotate naturally without catching the feet."
    ],
    "wat": [
      "Začni pomalu a nekruť kolenem na pevně zapřeném chodidle. Dráhu nekombinuj s překážkami.",
      "Begin slowly and avoid twisting a knee over a fixed foot. Keep the lane free of obstacles."
    ],
    "pro": [
      "Lehčí: jednotlivé křížné kroky s pauzou. Těžší: plynulý rytmus, potom vyšší rychlost na obě strany.",
      "Easier: individual crossover steps with pauses. Harder: continuous rhythm, then higher speed in both directions."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_carioca",
    "hd": null,
    "foc": [
      "Při pohybu do strany střídej překřížení zadní nohy před a za tělem.",
      "Travel laterally, alternating the trailing leg in front of and behind the body."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "ACE - Certified&trade;: July 2020 - Multisport Agility: An ACE Integrated Fitness Training® Model Workout",
      "url": "https://www.acefitness.org/continuing-education/certified/july-2020/7585/multisport-agility-an-ace-integrated-fitness-training-model-workout/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_deceleration",
    "cz": "Běh a kontrolované zabrzdění",
    "en": "Run-to-Controlled-Stop Drill",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "ham",
      "cal"
    ],
    "S": 2,
    "C": 3,
    "family": "deceleration",
    "ez": "ex26_snapdown",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Vyznač krátký rovný úsek a za ním dostatečně dlouhou zónu brzdění. Začni lehkým klusem.",
      "Mark a short straight approach and a generous stopping zone. Begin at an easy jog."
    ],
    "exe": [
      "Před zónou postupně zkrať kroky a sniž těžiště. Zastav pod kontrolou na obou nohách a na chvíli se ustal.",
      "Shorten the steps and lower the centre of mass as you enter the zone. Stop under control on both feet and stabilize briefly."
    ],
    "wat": [
      "Nezastavuj jedním tvrdým krokem s nataženým kolenem. Povrch a obuv musí odpovídat rychlosti.",
      "Do not stop with one hard straight-knee step. Match the surface and footwear to the speed."
    ],
    "pro": [
      "Lehčí: svižná chůze a dlouhá brzdná dráha. Těžší: o něco rychlejší náběh při stejné zóně, poté kratší dráha.",
      "Easier: brisk walking and a long stopping zone. Harder: a slightly faster approach in the same zone before shortening the zone."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_deceleration",
    "hd": null,
    "foc": [
      "Před zónou postupně zkrať kroky a sniž těžiště.",
      "Shorten the steps and lower the centre of mass as you enter the zone."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "ACE - Certified&trade;: July 2020 - Multisport Agility: An ACE Integrated Fitness Training® Model Workout",
      "url": "https://www.acefitness.org/continuing-education/certified/july-2020/7585/multisport-agility-an-ace-integrated-fitness-training-model-workout/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_backpedal",
    "cz": "Kontrolovaný běh pozadu",
    "en": "Controlled Backpedal",
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "mp": [
      "qua",
      "cal"
    ],
    "ms": [
      "glu",
      "hipflex"
    ],
    "S": 1,
    "C": 2,
    "family": "run_drill",
    "load": "none",
    "measurementType": "DISTANCE_DURATION",
    "pos": [
      "Ověř rovnou volnou dráhu za sebou a začni v mírném atletickém postoji.",
      "Check a level clear lane behind and begin in a slight athletic stance."
    ],
    "exe": [
      "Ustupuj krátkými rychlými kroky, chodidla pokládej pod tělo a drž hrudník vzpřímeně. Před koncem včas zpomal.",
      "Move backward with short quick steps, landing feet under the body and keeping the chest upright. Decelerate early."
    ],
    "wat": [
      "Nedělej dlouhé slepé kroky a nezakláněj se. Nový směr nejprve nacvič chůzí.",
      "Avoid long blind steps and leaning backward. Learn the direction by walking first."
    ],
    "pro": [
      "Lehčí: chůze pozadu. Těžší: vyšší kadence na stejné bezpečné dráze, potom předem určený přechod do běhu vpřed.",
      "Easier: backward walking. Harder: faster cadence on the same safe lane, then a planned transition to forward running."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_backpedal",
    "ez": null,
    "hd": null,
    "foc": [
      "Ustupuj krátkými rychlými kroky, chodidla pokládej pod tělo a drž hrudník vzpřímeně.",
      "Move backward with short quick steps, landing feet under the body and keeping the chest upright."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "ACE - Certified&trade;: July 2020 - Multisport Agility: An ACE Integrated Fitness Training® Model Workout",
      "url": "https://www.acefitness.org/continuing-education/certified/july-2020/7585/multisport-agility-an-ace-integrated-fitness-training-model-workout/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_pelvic_tilt",
    "cz": "Podsazení a uvolnění pánve vleže",
    "en": "Supine Pelvic Tilt",
    "mp": [
      "abs"
    ],
    "ms": [
      "low"
    ],
    "S": 1,
    "C": 1,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "family": "spinal_control",
    "pos": [
      "Lehni na záda, pokrč kolena a polož chodidla na zem. Pánev nech na podložce.",
      "Lie on your back with knees bent and feet grounded. Keep the pelvis on the mat."
    ],
    "exe": [
      "S výdechem jemně přibliž bedra k podložce. S nádechem vrať pánev do přirozené polohy; pohyb je malý.",
      "Exhale and gently bring the lower back toward the mat. Inhale back to a natural position using a small pelvic movement."
    ],
    "wat": [
      "Nezvedej pánev do mostu a netlač silou. Dýchej i během krátké výdrže.",
      "Do not lift into a bridge or force pressure. Keep breathing during a brief pause."
    ],
    "pro": [
      "Lehčí: menší pohyb s rukou pod bedry pro zpětnou vazbu. Těžší: stejnou kontrolu udrž při posunu jedné paty.",
      "Easier: reduce the motion and use a hand under the back for feedback. Harder: maintain control while sliding one heel."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_pelvic_tilt",
    "ez": null,
    "hd": null,
    "foc": [
      "S výdechem jemně přibliž bedra k podložce.",
      "Exhale and gently bring the lower back toward the mat."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Pelvic Tilts",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/7/supine-pelvic-tilts/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_side_adduction",
    "cz": "Přitahování spodní nohy vleže na boku",
    "en": "Side-Lying Hip Adduction",
    "mp": [
      "add"
    ],
    "ms": [
      "obl"
    ],
    "S": 1,
    "C": 1,
    "pat": "ohyb",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "hip_adduction",
    "hd": "ex26_cable_adduction",
    "pos": [
      "Lehni na bok a podepři hlavu. Spodní nohu natáhni, horní koleno pokrč a horní chodidlo polož na zem před spodní koleno. Pánev drž bez přetáčení.",
      "Lie on your side with the head supported. Straighten the lower leg, bend the upper knee and place its foot on the floor in front of the lower knee. Keep the pelvis from rolling."
    ],
    "exe": [
      "Zvedni spodní nohu několik centimetrů, krátce zastav a pomalu ji polož.",
      "Lift the lower leg a few centimetres, pause briefly and lower slowly."
    ],
    "wat": [
      "Neotáčej pánev dozadu a nezvedej nohu za cenu úklonu trupu.",
      "Do not roll the pelvis backward or lift by side-bending the trunk."
    ],
    "pro": [
      "Lehčí: kratší zdvih. Těžší: delší výdrž nahoře, později lehké kotníkové závaží.",
      "Easier: a smaller lift. Harder: pause longer at the top, then use a light ankle weight."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_side_adduction",
    "ez": null,
    "foc": [
      "Zvedni spodní nohu několik centimetrů, krátce zastav a pomalu ji polož.",
      "Lift the lower leg a few centimetres, pause briefly and lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Side Lying Hip Adduction",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/39/side-lying-hip-adduction/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_singleleg_pushup",
    "cz": "Klik se zvednutím jedné nohy",
    "en": "Push-Up with Single-Leg Raise",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "glu"
    ],
    "S": 3,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "push_horizontal",
    "ez": "pushup",
    "pos": [
      "Zaujmi vzpor na dlaních a špičkách, trup drž v jedné linii.",
      "Start in a straight high plank on palms and toes."
    ],
    "exe": [
      "Proveď klik. Při vytlačení vzhůru zvedni jednu nataženou nohu jen mírně nad zem, vrať ji a vystřídej strany.",
      "Perform a push-up. During the press, lift one straight leg slightly, lower it and alternate sides."
    ],
    "wat": [
      "Pánev neotáčej a nezvedej nohu záklonem beder.",
      "Do not rotate the pelvis or lift the leg by arching the lower back."
    ],
    "pro": [
      "Lehčí: běžný klik nebo dlaně na lavici. Těžší: krátká výdrž s jednou nohou nahoře při zachování rovného trupu.",
      "Easier: an ordinary or incline push-up. Harder: briefly hold the raised leg while keeping the trunk straight."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_singleleg_pushup",
    "hd": null,
    "foc": [
      "Proveď klik.",
      "Perform a push-up."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Push-up with Single-leg Raise",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/42/push-up-with-single-leg-raise/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_seated_curl",
    "cz": "Bicepsový zdvih vsedě s oporou zad",
    "en": "Seated Dumbbell Biceps Curl",
    "mp": [
      "bic"
    ],
    "ms": [
      "fore"
    ],
    "S": 1,
    "C": 1,
    "pat": "tah",
    "eq": [
      "zavazi",
      "lavice"
    ],
    "family": "elbow_flexion",
    "ez": null,
    "pos": [
      "Sedni na lavici s téměř svislou opěrkou, chodidla polož na zem. Jednoručky drž podhmatem vedle těla.",
      "Sit against an almost upright backrest with feet grounded. Hold dumbbells at your sides with palms forward."
    ],
    "exe": [
      "Ohnutím loktů zvedni činky a pomalu je spusť. Nadloktí zůstávají u trupu.",
      "Curl the weights by bending the elbows, then lower slowly. Keep upper arms beside the torso."
    ],
    "wat": [
      "Neodlepuj záda a neohýbej zápěstí, abys dokončil opakování.",
      "Do not lift the back from the pad or bend the wrists to finish a repetition."
    ],
    "pro": [
      "Lehčí: lehčí činky nebo střídání rukou. Těžší: pomalejší spouštění a malé zvýšení zátěže.",
      "Easier: lighter weights or alternate arms. Harder: slower lowering and a small load increase."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_seated_curl",
    "hd": null,
    "foc": [
      "Ohnutím loktů zvedni činky a pomalu je spusť.",
      "Curl the weights by bending the elbows, then lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated Biceps Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/44/seated-biceps-curl/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_prone_opposite",
    "cz": "Zvedání protilehlé ruky a nohy na břiše",
    "en": "Prone Contralateral Limb Raise",
    "mp": [
      "low",
      "glu"
    ],
    "ms": [
      "sho"
    ],
    "S": 1,
    "C": 2,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "spinal_control",
    "ez": null,
    "pos": [
      "Lehni na břicho, paže natáhni před sebe a čelo nech těsně nad podložkou nebo na tenkém ručníku.",
      "Lie prone with arms overhead and forehead just above the mat or resting on a thin towel."
    ],
    "exe": [
      "Zvedni jednu ruku a opačnou nohu jen několik centimetrů. Pomalu polož a vystřídej dvojici.",
      "Raise one arm and the opposite leg only a few centimetres. Lower slowly and switch sides."
    ],
    "wat": [
      "Nezakláněj hlavu a nesnaž se o co nejvyšší zdvih. Pánev zůstává klidná.",
      "Do not lift the head or chase height. Keep the pelvis still."
    ],
    "pro": [
      "Lehčí: zvedej jen jednu končetinu. Těžší: prodluž krátkou výdrž bez zvětšení bederního prohnutí.",
      "Easier: lift one limb at a time. Harder: lengthen the brief hold without increasing lumbar extension."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_prone_opposite",
    "hd": null,
    "foc": [
      "Zvedni jednu ruku a opačnou nohu jen několik centimetrů.",
      "Raise one arm and the opposite leg only a few centimetres."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Contralateral Limb Raises",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/53/contralateral-limb-raises/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_hamcurl",
    "cz": "Zakopávání na gymnastickém míči",
    "en": "Stability-Ball Hamstring Curl",
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 2,
    "C": 2,
    "pat": "ohyb",
    "eq": [
      "fitball"
    ],
    "family": "knee_flexion_bw",
    "ez": "glutebridge",
    "hd": "ex26_ball_singlecurl",
    "pos": [
      "Lehni na záda, paty a spodní lýtka polož na pevně nafouknutý míč. Dlaně opři vedle těla.",
      "Lie supine with heels and lower calves on a properly inflated ball, palms on the floor."
    ],
    "exe": [
      "Zvedni pánev a přitáhni míč patami k sobě ohnutím kolen. Nohy pomalu natáhni, aniž pánev klesne.",
      "Lift the hips and pull the ball toward you by bending the knees. Extend slowly while keeping hips raised."
    ],
    "wat": [
      "Míč nesmí klouzat. Nezvedej pánev prohnutím beder.",
      "Use a surface where the ball will not slip. Avoid lifting by overarching the lower back."
    ],
    "pro": [
      "Lehčí: most s lýtky na míči bez přitahování. Těžší: ruce blíž k tělu, potom varianta jednou nohou.",
      "Easier: hold a bridge with calves on the ball. Harder: narrow arm support, then use one leg."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_hamcurl",
    "foc": [
      "Zvedni pánev a přitáhni míč patami k sobě ohnutím kolen.",
      "Lift the hips and pull the ball toward you by bending the knees."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Hamstring Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/59/stability-ball-hamstring-curl/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_kneetuck",
    "cz": "Přitahování kolen na gymnastickém míči",
    "en": "Stability-Ball Knee Tuck",
    "mp": [
      "abs",
      "hipflex"
    ],
    "ms": [
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "ez": "ex26_ball_walkout",
    "pos": [
      "Zaujmi vzpor s dlaněmi pod rameny a holeněmi na míči. Okolí musí být volné.",
      "Start in a high plank with hands under shoulders and shins on the ball, with clear space around you."
    ],
    "exe": [
      "Přitáhni kolena pod kyčle a nech míč odvalit vpřed. Kontrolovaně se vrať do rovného vzporu.",
      "Draw knees under the hips, rolling the ball forward. Return to a straight plank with control."
    ],
    "wat": [
      "Nenech bedra propadnout a nezrychluj, když míč ujíždí stranou.",
      "Do not let the lower back sag or speed up when the ball drifts sideways."
    ],
    "pro": [
      "Lehčí: míč pod koleny a krátký posun. Těžší: delší páka s míčem blíž ke kotníkům.",
      "Easier: support the knees on the ball and shorten the tuck. Harder: lengthen the lever by moving support toward the ankles."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_kneetuck",
    "hd": null,
    "foc": [
      "Přitáhni kolena pod kyčle a nech míč odvalit vpřed.",
      "Draw knees under the hips, rolling the ball forward."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Knee Tucks",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/60/stability-ball-knee-tucks/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_pike",
    "cz": "Zvedání pánve do střechy na míči",
    "en": "Stability-Ball Pike",
    "mp": [
      "abs",
      "sho"
    ],
    "ms": [
      "serr",
      "hipflex"
    ],
    "S": 4,
    "C": 4,
    "pat": "obrat",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "tier": "specialist",
    "ez": "ex26_ball_kneetuck",
    "pos": [
      "Ze stabilního vzporu polož nárty nebo špičky na míč a dlaně pod ramena.",
      "From a stable high plank, support the feet or toes on the ball and place hands under shoulders."
    ],
    "exe": [
      "S téměř nataženými koleny zvedni pánev vzhůru a přitáhni míč chodidly. Pomalu se vrať, než ztratíš kontrolu.",
      "Keeping knees nearly straight, lift the hips and draw the ball inward with the feet. Return slowly before losing control."
    ],
    "wat": [
      "Nepřeklop se přes ramena. Začni malým rozsahem a měj volnou únikovou plochu.",
      "Do not tip forward over the shoulders. Start with a small range and clear surrounding space."
    ],
    "pro": [
      "Lehčí: přitahování pokrčených kolen. Těžší: vyšší kontrolovaný zdvih pánve bez skoku.",
      "Easier: tuck bent knees. Harder: lift the hips higher with control and without jumping."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_pike",
    "hd": null,
    "foc": [
      "S téměř nataženými koleny zvedni pánev vzhůru a přitáhni míč chodidly.",
      "Keeping knees nearly straight, lift the hips and draw the ball inward with the feet."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Pikes",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/61/stability-ball-pikes/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_walkout",
    "cz": "Výkrok rukama do vzporu přes míč",
    "en": "Stability-Ball Prone Walkout",
    "mp": [
      "abs"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "ez": "plank",
    "hd": "ex26_ball_kneetuck",
    "pos": [
      "Polož břicho na míč, dlaně i špičky na zem.",
      "Rest the abdomen on a ball with hands and toes on the floor."
    ],
    "exe": [
      "Malými kroky rukou postupuj vpřed, až míč podpírá stehna nebo kolena. Zastav a stejnou cestou se vrať.",
      "Walk the hands forward in small steps until the ball supports the thighs or knees. Pause and reverse the steps."
    ],
    "wat": [
      "Trup neprohýbej a nechoď dál, než dokážeš bezpečně vrátit míč.",
      "Do not sag through the trunk or walk beyond a position you can reverse safely."
    ],
    "pro": [
      "Lehčí: kratší výkrok s míčem pod boky. Těžší: postupně posuň oporu směrem k holením.",
      "Easier: a short walkout with the ball under the hips. Harder: gradually move support toward the shins."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_walkout",
    "foc": [
      "Malými kroky rukou postupuj vpřed, až míč podpírá stehna nebo kolena.",
      "Walk the hands forward in small steps until the ball supports the thighs or knees."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Prone Walkout",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/62/stability-ball-prone-walkout/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_pushup",
    "cz": "Klik s dlaněmi na gymnastickém míči",
    "en": "Hands-on-Ball Push-Up",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "fitball"
    ],
    "family": "push_horizontal",
    "ez": "inclpush",
    "pos": [
      "Opři dlaně o horní strany míče a špičky o neklouzavou zem. Chodidla nech mírně od sebe.",
      "Place palms on the upper sides of a ball and toes on non-slip ground, feet slightly apart."
    ],
    "exe": [
      "S pevným trupem pomalu pokrč lokty a přibliž hrudník k míči. Vytlač se zpět.",
      "Keep the trunk steady, bend elbows to bring the chest toward the ball, then press back up."
    ],
    "wat": [
      "Míč lehce svírej mezi dlaněmi. Neprováděj na kluzké podlaze a při ujíždění přejdi na kolena.",
      "Gently squeeze the ball between the palms. Avoid slippery flooring and lower the knees if control is lost."
    ],
    "pro": [
      "Lehčí: kolena na zemi nebo klik o pevnou lavici. Těžší: chodidla blíž k sobě při stejné kontrole.",
      "Easier: knees grounded or a fixed incline support. Harder: bring the feet closer while retaining control."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_pushup",
    "hd": null,
    "foc": [
      "S pevným trupem pomalu pokrč lokty a přibliž hrudník k míči.",
      "Keep the trunk steady, bend elbows to bring the chest toward the ball, then press back up."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Push-Up",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/63/stability-ball-push-up/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_reverseext",
    "cz": "Zanožení obou nohou s pánví na míči",
    "en": "Stability-Ball Reverse Extension",
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "low"
    ],
    "S": 2,
    "C": 3,
    "pat": "ohyb",
    "eq": [
      "fitball"
    ],
    "family": "hip_extension",
    "ez": "donkeykick",
    "pos": [
      "Lehni břichem na míč, pánev dej nad jeho vrchol a dlaně pevně na zem.",
      "Lie prone over a ball with the pelvis above its top and palms firmly grounded."
    ],
    "exe": [
      "Zvedni obě nohy do prodloužení trupu a pomalu je spusť.",
      "Lift both legs until they align with the trunk, then lower slowly."
    ],
    "wat": [
      "Nohy nezvedej nad linii trupu a nehoupej míčem.",
      "Do not lift above trunk level or rock the ball for momentum."
    ],
    "pro": [
      "Lehčí: zvedej jednu nohu nebo pokrč kolena. Těžší: krátká výdrž s nataženými nohami.",
      "Easier: lift one leg or bend the knees. Harder: briefly hold both straight legs."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_reverseext",
    "hd": null,
    "foc": [
      "Zvedni obě nohy do prodloužení trupu a pomalu je spusť.",
      "Lift both legs until they align with the trunk, then lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Reverse Extensions",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/64/stability-ball-reverse-extensions/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_crunch",
    "cz": "Zkracovačka na gymnastickém míči",
    "en": "Stability-Ball Crunch",
    "mp": [
      "abs"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_flexion",
    "ez": "crunch",
    "pos": [
      "Opři bedra a střed zad o míč, chodidla polož stabilně na zem a ruce překřiž na hrudníku. Pánev drž klidně před míčem.",
      "Support the lower and mid-back on the ball, plant the feet firmly and cross the hands over the chest. Keep the pelvis steady in front of the ball."
    ],
    "exe": [
      "Přibliž žebra k pánvi krátkým zakulacením trupu. Pomalu se vrať do opory.",
      "Bring the ribs toward the pelvis with a short trunk curl. Lower slowly onto the ball."
    ],
    "wat": [
      "Udrž chodidla i míč stabilní a pánev bez houpání. Nezakláněj hlavu a nepřecházej do prudkého sedu.",
      "Keep the feet and ball stable without rocking the pelvis. Do not throw the head back or sit up abruptly."
    ],
    "pro": [
      "Lehčí: širší postavení chodidel a kratší zdvih. Těžší: ruce lehce u spánků nebo pomalejší spouštění.",
      "Easier: widen the feet and shorten the curl. Harder: hold hands lightly at the temples or lower more slowly."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_crunch",
    "hd": null,
    "foc": [
      "Přibliž žebra k pánvi krátkým zakulacením trupu.",
      "Bring the ribs toward the pelvis with a short trunk curl."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Sit-ups / Crunches",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_wallsquat",
    "cz": "Dřep s míčem mezi zády a zdí",
    "en": "Stability-Ball Wall Squat",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "pat": "drep",
    "eq": [
      "fitball",
      "zed"
    ],
    "family": "squat_bilateral",
    "ez": null,
    "pos": [
      "Vlož míč mezi bedra a pevnou zeď. Chodidla postav mírně před tělo a na šířku pánve.",
      "Place a ball between the lower back and a fixed wall. Set feet slightly forward and hip-width apart."
    ],
    "exe": [
      "Pokrč kolena a nech míč odvalovat po zdi dolů. Zatlač celými chodidly a narovnej se.",
      "Bend knees while the ball rolls down the wall. Push through whole feet to stand."
    ],
    "wat": [
      "Chodidla neposouvej během opakování. Klesej jen tak hluboko, abys udržel kontakt a kontrolu.",
      "Keep feet in place. Descend only while maintaining contact and control."
    ],
    "pro": [
      "Lehčí: mělký dřep. Těžší: větší rozsah nebo krátká výdrž dole; zátěž přidávej až při jisté stabilitě.",
      "Easier: a shallow squat. Harder: increase depth or pause at the bottom; add load only with reliable stability."
    ],
    "J": {
      "kol": 2,
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_wallsquat",
    "hd": null,
    "foc": [
      "Pokrč kolena a nech míč odvalovat po zdi dolů.",
      "Bend knees while the ball rolls down the wall."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Stability Ball Wall Squats",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/69/stability-ball-wall-squats/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_singlecurl",
    "cz": "Zakopávání jednou nohou na míči",
    "en": "Single-Leg Stability-Ball Curl",
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 4,
    "C": 4,
    "pat": "ohyb",
    "eq": [
      "fitball"
    ],
    "sideMode": "perSide",
    "family": "knee_flexion_bw",
    "ez": "ex26_ball_hamcurl",
    "pos": [
      "Zvedni pánev s jednou patou na míči. Druhou nohu drž odlehčenou a ruce opři o podložku.",
      "Lift the hips with one heel on the ball. Keep the other leg raised and arms supported on the floor."
    ],
    "exe": [
      "Pracující patou přitáhni míč a pomalu nohu natáhni. Pánev udrž vodorovně.",
      "Curl the ball inward with the working heel and slowly extend the leg. Keep the pelvis level."
    ],
    "wat": [
      "Při křeči nebo poklesu pánve sérii ukonči. Nepomáhej si švihem volné nohy.",
      "Stop if cramping or pelvic collapse occurs. Do not swing the free leg for assistance."
    ],
    "pro": [
      "Lehčí: přitáhni oběma nohama a jednou jen pomalu spouštěj. Těžší: delší kontrolované spouštění jednou nohou.",
      "Easier: curl with both legs and lower with one. Harder: lengthen the controlled single-leg lowering phase."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_singlecurl",
    "hd": null,
    "foc": [
      "Pracující patou přitáhni míč a pomalu nohu natáhni.",
      "Curl the ball inward with the working heel and slowly extend the leg."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single Leg Hamstring Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/301/single-leg-hamstring-curl/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_barbell_rollout",
    "cz": "Rolování velké činky z kleku",
    "en": "Kneeling Barbell Rollout",
    "mp": [
      "abs"
    ],
    "ms": [
      "lat",
      "sho"
    ],
    "S": 4,
    "C": 3,
    "pat": "stred",
    "eq": [
      "cinka"
    ],
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Klekni na měkkou podložku a uchop osu s dvěma stejně velkými kotouči zajištěnými objímkami.",
      "Kneel on padding and grip a bar with two equal-sized plates secured by collars."
    ],
    "exe": [
      "Odvaluj činku pomalu vpřed, drž žebra nad pánví. Zastav před prohnutím beder a přitáhni osu zpět.",
      "Roll the bar forward slowly with ribs controlled over the pelvis. Stop before the lower back arches and draw it back."
    ],
    "wat": [
      "Kotouče se musí otáčet plynule. Nezačínej velkým rozsahem a nespoléhej na náraz do překážky.",
      "The plates must roll smoothly. Start short and do not rely on crashing into an obstacle."
    ],
    "pro": [
      "Lehčí: kratší dráha nebo výkroky rukou z kleku. Těžší: postupně delší dráha při stejné kontrole.",
      "Easier: shorten the rollout or walk the hands out from kneeling. Harder: gradually extend the range with the same control."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_barbell_rollout",
    "hd": null,
    "foc": [
      "Odvaluj činku pomalu vpřed, drž žebra nad pánví.",
      "Roll the bar forward slowly with ribs controlled over the pelvis."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Roll Out",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/309/roll-out/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_atomic",
    "cz": "Klik se střechou v závěsu",
    "en": "Suspended Push-Up to Pike",
    "mp": [
      "che",
      "tri",
      "abs"
    ],
    "ms": [
      "sho"
    ],
    "S": 4,
    "C": 4,
    "pat": "tlak",
    "eq": [
      "zaves"
    ],
    "family": "push_horizontal",
    "tier": "specialist",
    "ez": "ex26_trx_feet_pushup",
    "pos": [
      "Zajisti nárty v nízkých smyčkách a opři dlaně pod ramena. Nejprve zvládni samostatný klik i střechu.",
      "Secure the feet in low cradles and place hands under shoulders. First master the separate push-up and pike."
    ],
    "exe": [
      "Proveď klik, poté s nataženými pažemi a téměř rovnými koleny zvedni pánev do střechy. Vrať se do vzporu.",
      "Perform a push-up, then lift the hips into a pike with straight arms and nearly straight knees. Return to plank."
    ],
    "wat": [
      "Nepřeklápěj těžiště před dlaně. Smyčky se nesmějí rozkývat.",
      "Do not tip the centre of mass beyond the hands. Keep the straps from swinging."
    ],
    "pro": [
      "Lehčí: nacvič obě části odděleně. Těžší: plynulé spojení s pomalým návratem; výška pánve zůstává kontrolovaná.",
      "Easier: practise the two parts separately. Harder: connect them smoothly with a slow return and controlled hip height."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_atomic",
    "hd": null,
    "foc": [
      "Proveď klik, poté s nataženými pažemi a téměř rovnými koleny zvedni pánev do střechy.",
      "Perform a push-up, then lift the hips into a pike with straight arms and nearly straight knees."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Atomic Push-up",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/77/trx-reg-atomic-push-up/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_rollout",
    "cz": "Předklon z kleku s oporou v závěsu",
    "en": "Kneeling Suspension Front Rollout",
    "mp": [
      "abs"
    ],
    "ms": [
      "lat",
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "zaves"
    ],
    "family": "core_antiextension",
    "ez": "plank",
    "pos": [
      "Klekni čelem ke kotvení a drž rukojeti u obličeje s pokrčenými lokty. Žebra jemně přibliž k pánvi.",
      "Kneel facing the anchor, holding handles near the face with elbows bent. Gently bring ribs toward the pelvis."
    ],
    "exe": [
      "Z kolen se malým pohybem nakloň vpřed pod kotvení, bez prohnutí zad. S kontrolou se vrať.",
      "Lean forward a short distance from the knees beneath the anchor without arching the back. Return with control."
    ],
    "wat": [
      "Lokty ani tvar trupu během pohybu neměň. Začni velmi krátkým náklonem.",
      "Keep elbow angle and trunk shape stable. Start with a very small lean."
    ],
    "pro": [
      "Lehčí: kratší náklon. Těžší: pozvolna zvětšuj dráhu bez ztráty kontroly žeber a pánve.",
      "Easier: shorten the lean. Harder: gradually increase travel while retaining rib and pelvic control."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_rollout",
    "hd": null,
    "foc": [
      "Z kolen se malým pohybem nakloň vpřed pod kotvení, bez prohnutí zad.",
      "Lean forward a short distance from the knees beneath the anchor without arching the back."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Front Rollout",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/79/trx-reg-front-rollout/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_hamcurl",
    "cz": "Zakopávání s patami v závěsu",
    "en": "Suspension Hamstring Curl",
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 3,
    "C": 3,
    "pat": "ohyb",
    "eq": [
      "zaves"
    ],
    "family": "knee_flexion_bw",
    "ez": null,
    "pos": [
      "Lehni na záda a zajisti obě paty ve stejně vysokých smyčkách. Dlaně opři vedle těla.",
      "Lie supine with both heels secured in evenly adjusted cradles and palms grounded."
    ],
    "exe": [
      "Zvedni pánev a ohnutím kolen přitáhni paty k sobě. Pomalu vrať nohy do natažení.",
      "Lift the hips and bend the knees to draw heels toward you. Extend the legs slowly."
    ],
    "wat": [
      "Netlač hlavou do země a nepoužívej rozkývání popruhů.",
      "Do not press through the head or use strap momentum."
    ],
    "pro": [
      "Lehčí: kratší dráha, případně mezikrok s pánví na podložce. Těžší: pomalejší natahování nohou při zvednuté pánvi.",
      "Easier: shorten the curl or briefly rest the hips between repetitions. Harder: slow the extension with hips raised."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_hamcurl",
    "hd": null,
    "foc": [
      "Zvedni pánev a ohnutím kolen přitáhni paty k sobě.",
      "Lift the hips and bend the knees to draw heels toward you."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Hamstrings Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/86/trx-reg-hamstrings-curl/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_kneetuck",
    "cz": "Přitahování kolen s chodidly v závěsu",
    "en": "Suspended Knee Tuck",
    "mp": [
      "abs",
      "hipflex"
    ],
    "ms": [
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "zaves"
    ],
    "family": "core_antiextension",
    "ez": "ex26_bear_hold",
    "hd": "ex26_trx_pike",
    "pos": [
      "Zaujmi vzpor, nárty zajisti v nízkých smyčkách přímo pod kotvením.",
      "Start in a high plank with feet secured in low cradles beneath the anchor."
    ],
    "exe": [
      "Přitáhni pokrčená kolena pod kyčle, krátce zastav a vrať nohy do vzporu.",
      "Draw bent knees under the hips, pause and extend back to plank."
    ],
    "wat": [
      "Návrat nekonči propadnutím beder. Obě nohy se pohybují současně.",
      "Do not finish by letting the lower back sag. Move both legs together."
    ],
    "pro": [
      "Lehčí: kratší přitažení a vyšší opora rukou. Těžší: pomalejší návrat nebo následná střecha s rovnými koleny.",
      "Easier: shorten the tuck and elevate the hands on stable support. Harder: slow the return or progress to a straight-knee pike."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_kneetuck",
    "foc": [
      "Přitáhni pokrčená kolena pod kyčle, krátce zastav a vrať nohy do vzporu.",
      "Draw bent knees under the hips, pause and extend back to plank."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Suspended Knee Tucks",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/87/trx-reg-suspended-knee-tucks/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_pike",
    "cz": "Střecha s chodidly v závěsu",
    "en": "Suspended Pike",
    "mp": [
      "abs",
      "sho"
    ],
    "ms": [
      "serr"
    ],
    "S": 4,
    "C": 4,
    "pat": "obrat",
    "eq": [
      "zaves"
    ],
    "family": "core_antiextension",
    "tier": "specialist",
    "ez": "ex26_trx_kneetuck",
    "pos": [
      "Ve vzporu zajisti nárty v nízkých smyčkách, dlaně dej pod ramena.",
      "Secure the feet in low cradles in a high plank with hands under shoulders."
    ],
    "exe": [
      "S téměř rovnými koleny přitáhni chodidla a zvedni pánev. Pomalu se vrať do dlouhého vzporu.",
      "Draw the feet inward with nearly straight knees and lift the hips. Slowly return to a long plank."
    ],
    "wat": [
      "Pánev nezvedej skokem a neztrácej tlak do dlaní.",
      "Do not jump the hips upward or lose pressure through the palms."
    ],
    "pro": [
      "Lehčí: menší zdvih nebo přitahování kolen. Těžší: krátká výdrž nahoře bez překlopení přes ruce.",
      "Easier: reduce hip height or tuck the knees. Harder: pause at the top without tipping beyond the hands."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_pike",
    "hd": null,
    "foc": [
      "S téměř rovnými koleny přitáhni chodidla a zvedni pánev.",
      "Draw the feet inward with nearly straight knees and lift the hips."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Suspended Pike",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/88/trx-reg-suspended-pike/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_feet_pushup",
    "cz": "Klik s chodidly v závěsu",
    "en": "Feet-Suspended Push-Up",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "zaves"
    ],
    "family": "push_horizontal",
    "ez": "pushup",
    "hd": "ex26_trx_atomic",
    "pos": [
      "Zajisti chodidla ve smyčkách těsně nad zemí a dlaně polož pod ramena.",
      "Secure the feet in cradles just above the floor and place palms under shoulders."
    ],
    "exe": [
      "Spusť hrudník mezi dlaně a vytlač se zpět. Trup a nohy se pohybují jako jeden celek.",
      "Lower the chest between the hands and press back up, moving trunk and legs together."
    ],
    "wat": [
      "Popruhy nerozkmitávej a neprohýbej se v bedrech.",
      "Avoid strap swinging and lumbar sagging."
    ],
    "pro": [
      "Lehčí: běžný klik nebo dlaně na pevné vyšší opoře. Těžší: pauza těsně nad zemí, později spojení se střechou.",
      "Easier: an ordinary push-up or a fixed elevated hand support. Harder: pause near the floor, then link to a pike."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_feet_pushup",
    "foc": [
      "Spusť hrudník mezi dlaně a vytlač se zpět.",
      "Lower the chest between the hands and press back up, moving trunk and legs together."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Suspended Push-up",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/89/trx-reg-suspended-push-up/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_hippress",
    "cz": "Most s pokrčenými nohami v závěsu",
    "en": "Suspension Hip Press",
    "mp": [
      "glu",
      "ham"
    ],
    "ms": [
      "abs"
    ],
    "S": 2,
    "C": 3,
    "pat": "ohyb",
    "eq": [
      "zaves"
    ],
    "family": "hip_extension",
    "ez": "glutebridge",
    "pos": [
      "Lehni na záda, paty vlož do smyček a pokrč kolena přibližně do pravého úhlu.",
      "Lie supine with heels in the cradles and knees bent roughly to a right angle."
    ],
    "exe": [
      "S neměnným úhlem kolen zvedni pánev do linie s trupem a stehny. Pomalu ji spusť.",
      "Keeping knee angle stable, raise the hips to align trunk and thighs, then lower slowly."
    ],
    "wat": [
      "Zvedej se z kyčlí, ne záklonem beder. Ramena a hlava zůstávají na podložce.",
      "Extend through the hips without overarching. Keep shoulders and head on the mat."
    ],
    "pro": [
      "Lehčí: most s chodidly na zemi. Těžší: výdrž nahoře nebo delší páka mírným oddálením pat.",
      "Easier: bridge with feet grounded. Harder: pause at the top or move heels slightly farther away."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_hippress",
    "hd": null,
    "foc": [
      "S neměnným úhlem kolen zvedni pánev do linie s trupem a stehny.",
      "Keeping knee angle stable, raise the hips to align trunk and thighs, then lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Hip Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/90/trx-reg-hip-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_lunge",
    "cz": "Výpad s jednou nohou v závěsu",
    "en": "Suspended Rear-Foot Lunge",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "drep",
    "eq": [
      "zaves"
    ],
    "sideMode": "perSide",
    "family": "lunge",
    "ez": "bulgsplit",
    "pos": [
      "Stůj zády ke kotvení, jednu nohu zajisti v nízké smyčce za sebou. Při vstupu použij pevnou oporu.",
      "Face away from the anchor with one foot secured in a low cradle behind you. Use stable support to enter."
    ],
    "exe": [
      "Pokrč stojnou nohu a posuň zavěšenou nohu dozadu. Zatlačením do celého stojného chodidla se vrať.",
      "Bend the supporting leg while moving the suspended leg backward. Drive through the whole supporting foot to return."
    ],
    "wat": [
      "Koleno sleduje směr chodidla. Sérii ukonči, pokud popruh tahá pánev do rotace.",
      "Keep knee aligned with the foot. Stop if the strap pulls the pelvis into rotation."
    ],
    "pro": [
      "Lehčí: výpad s nohou na zemi nebo zadní chodidlo na pevné lavici. Těžší: větší kontrolovaný rozsah, potom lehké jednoručky.",
      "Easier: keep both feet grounded or use a fixed rear-foot bench. Harder: increase controlled depth, then add light dumbbells."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_lunge",
    "hd": null,
    "foc": [
      "Pokrč stojnou nohu a posuň zavěšenou nohu dozadu.",
      "Bend the supporting leg while moving the suspended leg backward."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Suspended Lunge",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/93/trx-reg-suspended-lunge/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_trx_onearm_press",
    "cz": "Tlak jednou rukou v závěsném systému",
    "en": "Single-Arm Suspension Chest Press",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "obl"
    ],
    "S": 3,
    "C": 4,
    "pat": "tlak",
    "eq": [
      "zaves"
    ],
    "sideMode": "perSide",
    "family": "push_horizontal",
    "ez": "inclpush",
    "pos": [
      "Rukojeť nastav pro jednoruční použití podle výrobce. Stůj zády ke kotvení, opačnou nohu dej vpřed a drž ruku před hrudníkem.",
      "Configure a single handle according to the manufacturer. Face away from the anchor, opposite foot forward, hand in front of the chest."
    ],
    "exe": [
      "Nakloň pevný trup k ruce pokrčením lokte, potom se od rukojeti odtlač.",
      "Bend the elbow to lean the braced body toward the hand, then press away."
    ],
    "wat": [
      "Hrudník a pánev se nesmějí stáčet stranou. Zvol nejprve téměř vzpřímenou polohu.",
      "Keep chest and pelvis from rotating. Begin almost upright."
    ],
    "pro": [
      "Lehčí: tlak oběma rukama nebo menší náklon. Těžší: pozvolna větší náklon při stejné stabilitě.",
      "Easier: use both hands or reduce the lean. Harder: gradually increase the lean with unchanged stability."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_trx_onearm_press",
    "hd": null,
    "foc": [
      "Nakloň pevný trup k ruce pokrčením lokte, potom se od rukojeti odtlač.",
      "Bend the elbow to lean the braced body toward the hand, then press away."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "TRX &reg; Single-arm Chest Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/91/trx-reg-single-arm-chest-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_halfkneel_lift",
    "cz": "Diagonální zdvih medicinbalu v polokleku",
    "en": "Half-Kneeling Medicine-Ball Lift",
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "medicinbal"
    ],
    "sideMode": "perSide",
    "family": "core_rotation",
    "pos": [
      "Klekni na jedno koleno a druhé chodidlo polož vpřed. Lehký míč drž oběma rukama u boku klečící nohy.",
      "Half-kneel with one foot forward. Hold a light ball beside the hip of the kneeling leg."
    ],
    "exe": [
      "Veď míč šikmo před tělem nad opačné rameno a pomalu zpět. Hrudník se mírně otáčí s pažemi.",
      "Lift the ball diagonally across the body toward the opposite shoulder and lower slowly, allowing a small thoracic turn."
    ],
    "wat": [
      "Pánev neposouvej do strany a koncový zdvih nevytvářej záklonem.",
      "Do not shift the pelvis sideways or finish by leaning backward."
    ],
    "pro": [
      "Lehčí: prázdné ruce a kratší oblouk. Těžší: delší páka nebo mírně těžší míč.",
      "Easier: use empty hands and a shorter arc. Harder: lengthen the lever or use a slightly heavier ball."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_halfkneel_lift",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď míč šikmo před tělem nad opačné rameno a pomalu zpět.",
      "Lift the ball diagonally across the body toward the opposite shoulder and lower slowly, allowing a small thoracic turn."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Half-kneeling Hay Baler",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/97/half-kneeling-hay-baler/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cable_rotation",
    "cz": "Rotace trupu na kladce ve stoji",
    "en": "Standing Cable Trunk Rotation",
    "mp": [
      "obl"
    ],
    "ms": [
      "abs",
      "glu"
    ],
    "S": 2,
    "C": 3,
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "sideMode": "perSide",
    "family": "core_rotation",
    "ez": null,
    "pos": [
      "Stůj bokem ke kladce ve výši hrudníku a drž rukojeť oběma rukama před tělem. Chodidla rozkroč.",
      "Stand side-on to a chest-height cable and hold the handle with both hands in front, feet apart."
    ],
    "exe": [
      "Otáčej hrudník i pánev od kladky a přenes váhu mezi nohama. Chodidlu dovol otočení, potom se pomalu vrať.",
      "Rotate chest and pelvis away from the pulley, shifting weight between legs and allowing a foot pivot. Return slowly."
    ],
    "wat": [
      "Nekruť kolena proti pevně přilepeným chodidlům. Pohyb nezačínej trhnutím rukou.",
      "Do not twist knees against fixed feet or initiate with an arm jerk."
    ],
    "pro": [
      "Lehčí: slabší odpor a kratší oblouk. Těžší: větší plynulý rozsah, potom malé zvýšení odporu.",
      "Easier: lighter resistance and a shorter arc. Harder: increase smooth range, then resistance slightly."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_rotation",
    "hd": null,
    "foc": [
      "Otáčej hrudník i pánev od kladky a přenes váhu mezi nohama.",
      "Rotate chest and pelvis away from the pulley, shifting weight between legs and allowing a foot pivot."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Trunk Rotation",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/102/standing-trunk-rotation/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_standing_lift",
    "cz": "Diagonální zdvih medicinbalu v rozkročném postoji",
    "en": "Split-Stance Medicine-Ball Lift",
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "sho",
      "glu"
    ],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "medicinbal"
    ],
    "sideMode": "perSide",
    "family": "core_rotation",
    "ez": "ex26_halfkneel_lift",
    "pos": [
      "Postav jednu nohu vpřed, zadní patu odlehči. Lehký míč drž u zadního boku.",
      "Take a split stance with the rear heel light and hold a light ball beside the rear hip."
    ],
    "exe": [
      "Zvedni míč diagonálně k opačnému rameni. Trup a pánev se plynule otáčejí, potom se vrať.",
      "Raise the ball diagonally toward the opposite shoulder while trunk and pelvis turn smoothly, then reverse."
    ],
    "wat": [
      "Pohyb není hod. Udrž kontrolu míče i zadního kolene.",
      "This is a controlled lift, not a throw. Keep the ball and rear knee controlled."
    ],
    "pro": [
      "Lehčí: menší oblouk v polokleku. Těžší: o něco delší páka nebo těžší míč bez zrychlování.",
      "Easier: shorten the arc in half-kneeling. Harder: use a longer lever or slightly heavier ball without speeding up."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_standing_lift",
    "hd": null,
    "foc": [
      "Zvedni míč diagonálně k opačnému rameni.",
      "Raise the ball diagonally toward the opposite shoulder while trunk and pelvis turn smoothly, then reverse."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Hay Baler",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/105/standing-hay-baler/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_singleleg_rotation",
    "cz": "Malá rotace na kladce ve stoji jednonož",
    "en": "Single-Leg Cable Rotation",
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "glu"
    ],
    "S": 3,
    "C": 4,
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "sideMode": "perSide",
    "family": "core_rotation",
    "ez": "ex26_cable_rotation",
    "pos": [
      "Stůj bokem k lehké kladce, rukojeť drž u středu hrudníku s pokrčenými lokty. Odlehči nohu bližší kladce.",
      "Stand side-on to a light cable with elbows bent and handle at the chest. Lift the foot nearer the pulley."
    ],
    "exe": [
      "Proveď malou pomalou rotaci hrudníku od kladky a zpět. Stojné koleno udrž nad chodidlem.",
      "Rotate the chest a small distance away and back, keeping the supporting knee aligned with the foot."
    ],
    "wat": [
      "Při vychylování kolene nebo pánve postav druhou nohu. Nepoužívej velkou zátěž.",
      "Ground the other foot if knee or pelvis shifts. Avoid heavy resistance."
    ],
    "pro": [
      "Lehčí: obě chodidla na zemi. Těžší: mírně oddal ruce od hrudníku, aniž zvětšíš rotaci v koleni.",
      "Easier: keep both feet grounded. Harder: move hands slightly farther from the chest without twisting the knee."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_singleleg_rotation",
    "hd": null,
    "foc": [
      "Proveď malou pomalou rotaci hrudníku od kladky a zpět.",
      "Rotate the chest a small distance away and back, keeping the supporting knee aligned with the foot."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Single-leg Cable Rotation",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/107/standing-single-leg-cable-rotation/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_plank_hiprotation",
    "cz": "Kroužení pokrčeným kolenem ve vzporu",
    "en": "High-Plank Hip Rotation",
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 2,
    "C": 3,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "hip_rotation_control",
    "ez": "ex26_firehydrant",
    "pos": [
      "Začni ve vzporu s dlaněmi pod rameny a nohama nataženýma.",
      "Begin in a high plank with palms under shoulders and legs straight."
    ],
    "exe": [
      "Přitáhni jedno koleno pod trup a pomalu ho veď dovnitř a ven z kyčle. Vrať nohu a vystřídej strany.",
      "Draw one knee under the torso and slowly rotate it inward and outward at the hip. Return and switch sides."
    ],
    "wat": [
      "Ramena zůstávají nad dlaněmi. Neotáčej celý trup za kolenem.",
      "Keep shoulders above palms. Do not turn the entire trunk with the knee."
    ],
    "pro": [
      "Lehčí: stejný pohyb na čtyřech nebo dlaně na lavici. Těžší: o něco větší kontrolovaný oblouk.",
      "Easier: work on all fours or elevate the hands. Harder: slightly increase the controlled arc."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_plank_hiprotation",
    "hd": null,
    "foc": [
      "Přitáhni jedno koleno pod trup a pomalu ho veď dovnitř a ven z kyčle.",
      "Draw one knee under the torso and slowly rotate it inward and outward at the hip."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Hip Rotations (Push-up Position)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/110/hip-rotations-push-up-position/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_heel_slide",
    "cz": "Posun paty vleže s klidnou pánví",
    "en": "Supine Heel Slide",
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 1,
    "C": 1,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "spinal_control",
    "ez": "ex26_pelvic_tilt",
    "hd": "deadbug",
    "pos": [
      "Lehni na záda s pokrčenými koleny a chodidly na zemi. Najdi pohodlnou klidnou polohu beder.",
      "Lie supine with knees bent and feet grounded. Find a comfortable stable lower-back position."
    ],
    "exe": [
      "Pomalu posuň jednu patu od těla a vrať ji. Při pohybu normálně dýchej a neměň polohu pánve.",
      "Slowly slide one heel away and back while breathing normally and keeping the pelvis still."
    ],
    "wat": [
      "Dráhu zkrať, jakmile se bedra výrazně prohnou. Netlač břicho silou dovnitř.",
      "Shorten the slide if the lower back starts arching. Avoid forcefully drawing the abdomen inward."
    ],
    "pro": [
      "Lehčí: několikacentimetrový posun. Těžší: delší posun, později krátké odlehčení paty.",
      "Easier: slide only a few centimetres. Harder: lengthen the slide, then briefly unweight the heel."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_heel_slide",
    "foc": [
      "Pomalu posuň jednu patu od těla a vrať ji.",
      "Slowly slide one heel away and back while breathing normally and keeping the pelvis still."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Hollowing with Lower Extremity Movements",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/121/supine-hollowing-with-lower-extremity-movements/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_supine_armraise",
    "cz": "Vzpažení vleže s kontrolou žeber",
    "en": "Supine Shoulder Flexion",
    "mp": [
      "sho"
    ],
    "ms": [
      "lat",
      "abs"
    ],
    "S": 1,
    "C": 1,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "family": "shoulder_mobility",
    "pos": [
      "Lehni na záda, pokrč kolena, paže polož vedle těla s dlaněmi dovnitř.",
      "Lie supine with knees bent and arms beside the body, palms inward."
    ],
    "exe": [
      "Pomalu přenes natažené paže nad hlavu a zpět. Zastav tam, kde ještě udržíš žebra a pánev klidné.",
      "Slowly raise straight arms overhead and back. Stop while ribs and pelvis remain still."
    ],
    "wat": [
      "Kontakt rukou se zemí není podmínkou. Nezískávej rozsah prohnutím beder.",
      "Touching the floor overhead is optional. Do not gain range by arching the lower back."
    ],
    "pro": [
      "Lehčí: jedna paže nebo pokrčené lokty. Těžší: postupně větší aktivní rozsah bez pohybu žeber.",
      "Easier: move one arm or bend the elbows. Harder: gradually increase active range without rib movement."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_supine_armraise",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu přenes natažené paže nad hlavu a zpět.",
      "Slowly raise straight arms overhead and back."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Shoulder Flexion",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/123/supine-shoulder-flexion/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_snow_angel",
    "cz": "Anděl s pažemi vleže na zádech",
    "en": "Supine Snow Angel",
    "mp": [
      "sho",
      "rcuff"
    ],
    "ms": [
      "che",
      "lat"
    ],
    "S": 1,
    "C": 1,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "family": "shoulder_mobility",
    "pos": [
      "Lehni na záda s pokrčenými koleny. Paže dej mírně od těla a lokty pohodlně pokrč.",
      "Lie supine with knees bent, arms slightly away from the body and elbows comfortably bent."
    ],
    "exe": [
      "Posouvej paže obloukem podél podložky nad hlavu a zpět, jako při kreslení anděla.",
      "Sweep the arms along an arc toward overhead and back, as if making a snow angel."
    ],
    "wat": [
      "Netlač zápěstí ani lokty silou k zemi. Žebra se nezvedají.",
      "Do not force wrists or elbows to the floor. Keep the ribs settled."
    ],
    "pro": [
      "Lehčí: kratší oblouk. Těžší: plynule delší oblouk a menší pokrčení loktů.",
      "Easier: shorten the arc. Harder: gradually lengthen it and reduce elbow bend."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_snow_angel",
    "ez": null,
    "hd": null,
    "foc": [
      "Posouvej paže obloukem podél podložky nad hlavu a zpět, jako při kreslení anděla.",
      "Sweep the arms along an arc toward overhead and back, as if making a snow angel."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Snow Angel (Wipers) Exercise",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/124/supine-snow-angel-wipers-exercise/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_kneel_reversefly",
    "cz": "Rozpažování šikmo dolů v kleku na kladce",
    "en": "Kneeling Cable Reverse Fly",
    "mp": [
      "upb",
      "sho"
    ],
    "ms": [
      "rcuff"
    ],
    "S": 2,
    "C": 2,
    "pat": "tah",
    "eq": [
      "kladka"
    ],
    "family": "face_pull",
    "ez": null,
    "pos": [
      "Klekni čelem ke dvěma kladkám ve výši ramen. Rukojeti drž před sebou, lokty nech mírně povolené.",
      "Kneel facing two shoulder-height pulleys, handles in front with elbows softly extended."
    ],
    "exe": [
      "Veď paže širokým obloukem dozadu a dolů k bokům. Pomalu vrať rukojeti před sebe.",
      "Sweep arms in a wide arc backward and downward toward the hips, then return slowly."
    ],
    "wat": [
      "Nepřecházej do záklonu a nepřitahuj rukojeti ohýbáním loktů.",
      "Do not lean backward or turn the motion into an elbow-driven row."
    ],
    "pro": [
      "Lehčí: menší odpor a kratší oblouk. Těžší: krátká pauza u boků nebo mírně vyšší odpor.",
      "Easier: reduce resistance and arc length. Harder: pause beside the hips or slightly increase resistance."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kneel_reversefly",
    "hd": null,
    "foc": [
      "Veď paže širokým obloukem dozadu a dolů k bokům.",
      "Sweep arms in a wide arc backward and downward toward the hips, then return slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Kneeling Reverse Fly",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/128/kneeling-reverse-fly/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_sumo_rotation",
    "cz": "Široký dřep s otočením přes krok",
    "en": "Wide Squat with Pivot Step",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "add",
      "cal"
    ],
    "S": 2,
    "C": 3,
    "pat": "drep",
    "eq": [
      "telo",
      "prostor"
    ],
    "family": "squat_bilateral",
    "ez": "sumo",
    "pos": [
      "Postav se do širokého pohodlného dřepového postoje a nech kolem sebe volný prostor.",
      "Take a comfortable wide squat stance with clear space around you."
    ],
    "exe": [
      "Proveď dřep, při vzpřímení se otoč na jednom chodidle a druhou nohou překroč do nového širokého postoje. Znovu kontrolovaně dřepni.",
      "Squat, then stand and pivot on one foot while stepping the other into a new wide stance. Squat again with control."
    ],
    "wat": [
      "Neotáčej tělo proti nepohyblivému koleni. Nejprve nacvič malý úhel otočení.",
      "Do not turn against a fixed knee. Practise a small pivot angle first."
    ],
    "pro": [
      "Lehčí: mělký dřep a čtvrtobrátka. Těžší: plynulá půlobrátka oběma směry.",
      "Easier: shallow squat with a quarter turn. Harder: a smooth half turn in each direction."
    ],
    "J": {
      "kol": 2,
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_sumo_rotation",
    "hd": null,
    "foc": [
      "Proveď dřep, při vzpřímení se otoč na jednom chodidle a druhou nohou překroč do nového širokého postoje.",
      "Squat, then stand and pivot on one foot while stepping the other into a new wide stance."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Sumo Rotational Squats",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/129/sumo-rotational-squats/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_band_lyingcurl",
    "cz": "Zakopávání vleže s gumou",
    "en": "Prone Band Hamstring Curl",
    "mp": [
      "ham"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 1,
    "pat": "ohyb",
    "eq": [
      "guma"
    ],
    "sideMode": "perSide",
    "family": "knee_flexion_bw",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Lehni na břicho, gumu upevni za chodidly a její manžetu nad kotníkem jedné nohy.",
      "Lie prone with a band anchored beyond the feet and cuff secured above one ankle."
    ],
    "exe": [
      "Pokrč koleno a přibliž patu k hýždi. Stehno nech na podložce a pomalu vrať nohu.",
      "Bend the knee to bring the heel toward the buttock, keeping the thigh grounded. Return slowly."
    ],
    "wat": [
      "Kotvení musí držet a guma nesmí být poškozená. Nezvedej kyčel.",
      "Use a secure anchor and intact band. Do not lift the hip."
    ],
    "pro": [
      "Lehčí: slabší guma nebo menší ohnutí. Těžší: silnější guma při stejné poloze stehna.",
      "Easier: a lighter band or shorter curl. Harder: more resistance without moving the thigh."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_band_lyingcurl",
    "ez": null,
    "hd": null,
    "foc": [
      "Pokrč koleno a přibliž patu k hýždi.",
      "Bend the knee to bring the heel toward the buttock, keeping the thigh grounded."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Prone (Lying) Hamstrings Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_band_standingcurl",
    "cz": "Zakopávání ve stoji s gumou",
    "en": "Standing Band Hamstring Curl",
    "mp": [
      "ham"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 2,
    "pat": "ohyb",
    "eq": [
      "guma"
    ],
    "sideMode": "perSide",
    "family": "knee_flexion_bw",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Stůj čelem k nízkému kotvení gumy s manžetou nad kotníkem. Jednou rukou se lehce přidrž pevné opory.",
      "Face a low band anchor with cuff above the working ankle and one hand on stable support."
    ],
    "exe": [
      "Bez pohybu stehna pokrč koleno a zvedni patu dozadu. Pomalu vrať nohu.",
      "Keep the thigh still, bend the knee to lift the heel behind you, then lower slowly."
    ],
    "wat": [
      "Nezakláněj trup a nezanožuj celé stehno.",
      "Do not lean backward or swing the entire thigh behind you."
    ],
    "pro": [
      "Lehčí: menší odpor a kratší zdvih. Těžší: pauza v ohnutí a silnější guma.",
      "Easier: reduce resistance and range. Harder: pause in flexion and use a stronger band."
    ],
    "J": {
      "kol": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_band_standingcurl",
    "ez": null,
    "hd": null,
    "foc": [
      "Bez pohybu stehna pokrč koleno a zvedni patu dozadu.",
      "Keep the thigh still, bend the knee to lift the heel behind you, then lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Hamstrings Curl",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/132/standing-hamstrings-curl/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_band_legext",
    "cz": "Předkopávání ve stoji s gumou",
    "en": "Standing Band Knee Extension",
    "mp": [
      "qua"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 1,
    "C": 2,
    "pat": "drep",
    "eq": [
      "guma"
    ],
    "sideMode": "perSide",
    "family": "knee_extension",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Stůj zády k nízkému kotvení gumy s manžetou nad kotníkem. Přidrž se a odlehči pracující nohu s mírně pokrčeným kolenem.",
      "Face away from a low band anchor with cuff above the ankle. Use support and unweight the working leg with knee slightly bent."
    ],
    "exe": [
      "Natáhni koleno proti odporu bez švihu stehna. Pomalu ho znovu pokrč.",
      "Extend the knee against resistance without swinging the thigh, then bend it slowly."
    ],
    "wat": [
      "Koleno nedorážej prudce. Pánev a trup drž klidně.",
      "Avoid snapping into knee lockout. Keep pelvis and trunk still."
    ],
    "pro": [
      "Lehčí: bez gumy s oporou. Těžší: mírně silnější guma a krátké zastavení v natažení.",
      "Easier: use support without a band. Harder: slightly increase resistance and pause near extension."
    ],
    "J": {
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_band_legext",
    "ez": null,
    "hd": null,
    "foc": [
      "Natáhni koleno proti odporu bez švihu stehna.",
      "Extend the knee against resistance without swinging the thigh, then bend it slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Leg Extension",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/133/standing-leg-extension/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_gate_opener",
    "cz": "Otevírání kyčle ve stoji",
    "en": "Standing Hip Gate Opener",
    "mp": [
      "glu",
      "hipflex"
    ],
    "ms": [
      "add"
    ],
    "S": 1,
    "C": 2,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "hip_rotation_control",
    "ez": null,
    "pos": [
      "Stůj vzpřímeně vedle opory. Zvedni jedno pokrčené koleno před sebe.",
      "Stand tall beside support and lift one bent knee in front."
    ],
    "exe": [
      "Veď koleno v malém oblouku dovnitř a potom do strany. Polož nohu a opakuj druhou stranou.",
      "Move the knee through a small inward then outward arc. Lower and repeat on the other side."
    ],
    "wat": [
      "Pánev neotáčej místo kyčle. Výšku kolena přizpůsob stabilitě.",
      "Do not substitute pelvic rotation. Choose knee height according to balance."
    ],
    "pro": [
      "Lehčí: opora rukou, nižší koleno a kratší oblouk. Těžší: bez opory a pomalá změna směru; celý kontrolovaný kruh kyčlí nacvič samostatně.",
      "Easier: use hand support, lift the knee lower and shorten the arc. Harder: remove support and reverse slowly; learn a full controlled hip circle separately."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_gate_opener",
    "hd": "hipcars",
    "foc": [
      "Veď koleno v malém oblouku dovnitř a potom do strany.",
      "Move the knee through a small inward then outward arc."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Gate Openers (Frankensteins)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/201/standing-gate-openers-frankensteins/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_lateral_overunder",
    "cz": "Boční překročení a podkročení",
    "en": "Lateral Over-Under Drill",
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "add",
      "hipflex"
    ],
    "S": 2,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "change_direction",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Postav se bokem k řadě nízkých bezpečných překážek. Podkročení můžeš nejprve pouze naznačit bez tyče.",
      "Stand beside low safe obstacles. Initially mime the duck-under without a bar."
    ],
    "exe": [
      "Překroč stranou jednou a potom druhou nohou. Následuje mělký boční dřep s přesunem těla pod pomyslnou překážku.",
      "Step sideways over with both feet in sequence, then use a lateral squat to move under an imaginary obstacle."
    ],
    "wat": [
      "Překážky musí při kontaktu povolit. Nespěchej a nenarážej hlavou do pevné tyče.",
      "Use obstacles that yield on contact. Move slowly and avoid rigid head-height bars."
    ],
    "pro": [
      "Lehčí: bez překážek a mělké podkročení. Těžší: vyšší překročení či nižší podkročení, vždy jednotlivě.",
      "Easier: mime the drill with a shallow squat. Harder: raise the step-over or lower the duck-under one at a time."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_overunder",
    "ez": null,
    "hd": null,
    "foc": [
      "Překroč stranou jednou a potom druhou nohou.",
      "Step sideways over with both feet in sequence, then use a lateral squat to move under an imaginary obstacle."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Over Unders",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/206/lateral-over-unders/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_side_armroll",
    "cz": "Přetočení na bok s činkou nad ramenem",
    "en": "Side Roll with Vertical Dumbbell",
    "mp": [
      "rcuff",
      "sho"
    ],
    "ms": [
      "abs",
      "obl"
    ],
    "S": 2,
    "C": 3,
    "pat": "mobilita",
    "eq": [
      "zavazi"
    ],
    "sideMode": "perSide",
    "family": "shoulder_mobility",
    "tier": "specialist",
    "pos": [
      "Lehni na záda s pokrčenými koleny a jednu velmi lehkou činku drž na natažené paži nad ramenem.",
      "Lie supine with knees bent, holding a very light dumbbell vertically above one shoulder."
    ],
    "exe": [
      "Pomalu přetoč trup na opačný bok, zatímco zatížená paže zůstává svisle. Vrať se před ztrátou kontroly ramene.",
      "Slowly roll toward the opposite side while keeping the loaded arm vertical. Return before shoulder control is lost."
    ],
    "wat": [
      "Nejde o pasivní protahování pod těžkou činkou. Bez jisté kontroly pracuj s prázdnou rukou.",
      "This is not a passive stretch under heavy load. Use an empty hand until control is reliable."
    ],
    "pro": [
      "Lehčí: bez zátěže a jen částečné otočení. Těžší: větší plynulá rotace s lehkou činkou.",
      "Easier: no weight and a partial roll. Harder: a larger smooth rotation with a light dumbbell."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_side_armroll",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu přetoč trup na opačný bok, zatímco zatížená paže zůstává svisle.",
      "Slowly roll toward the opposite side while keeping the loaded arm vertical."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Side-lying Arm Rolls",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/223/side-lying-arm-rolls/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_reverse_march",
    "cz": "Střídavé zvedání pokrčených nohou vleže",
    "en": "Supine Reverse March",
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 1,
    "C": 1,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "sideMode": "perSide",
    "family": "spinal_control",
    "ez": "ex26_heel_slide",
    "hd": "deadbug",
    "pos": [
      "Lehni na záda s koleny pokrčenými a chodidly na podložce. Ruce nech vedle těla.",
      "Lie supine with knees bent, feet grounded and arms beside the body."
    ],
    "exe": [
      "Zvedni jednu nohu s neměnným pokrčením kolena, až stehno míří přibližně vzhůru. Polož a vystřídej.",
      "Lift one leg without changing knee bend until the thigh is approximately upright. Lower and alternate."
    ],
    "wat": [
      "Pánev se nesmí kývat ze strany na stranu a dech zůstává volný.",
      "Keep the pelvis from rocking side to side and breathe freely."
    ],
    "pro": [
      "Lehčí: zvedni chodidlo jen několik centimetrů. Těžší: krátce podrž nohu nahoře nebo přidej protilehlou paži.",
      "Easier: lift the foot only a few centimetres. Harder: pause at the top or add opposite-arm movement."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_reverse_march",
    "foc": [
      "Zvedni jednu nohu s neměnným pokrčením kolena, až stehno míří přibližně vzhůru.",
      "Lift one leg without changing knee bend until the thigh is approximately upright."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Reverse Marches",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/238/supine-reverse-marches/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_toe_crunch",
    "cz": "Zkracovačka s dosahem k chodidlům",
    "en": "Vertical Toe-Reach Crunch",
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex"
    ],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "family": "core_flexion",
    "ez": "crunch",
    "pos": [
      "Lehni na záda a zvedni nohy nad pánev. Kolena mohou být lehce pokrčená.",
      "Lie supine and raise the legs above the pelvis, allowing a soft knee bend."
    ],
    "exe": [
      "Krátce zakulať horní část trupu a sáhni rukama směrem ke kotníkům. Pomalu polož lopatky.",
      "Curl the upper trunk and reach hands toward the ankles, then lower the shoulder blades slowly."
    ],
    "wat": [
      "Nohy neházej za hlavu. Dotknout se prstů není nutné.",
      "Do not throw legs behind the head. Touching the toes is unnecessary."
    ],
    "pro": [
      "Lehčí: pokrčená kolena nebo běžná zkracovačka. Těžší: krátká pauza ve zdvihu.",
      "Easier: bend knees more or use a basic crunch. Harder: pause briefly in the curl."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_toe_crunch",
    "hd": null,
    "foc": [
      "Krátce zakulať horní část trupu a sáhni rukama směrem ke kotníkům.",
      "Curl the upper trunk and reach hands toward the ankles, then lower the shoulder blades slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Vertical Toe Touches",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/243/vertical-toe-touches/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_spider_walk",
    "cz": "Pavoučí chůze",
    "en": "Spider Walk",
    "mp": [
      "abs",
      "sho"
    ],
    "ms": [
      "glu",
      "hipflex"
    ],
    "S": 3,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "family": "crawl",
    "measurementType": "DISTANCE",
    "load": "none",
    "ez": "ex26_spider_plank",
    "pos": [
      "Začni ve vzporu v prázdném neklouzavém prostoru.",
      "Begin in a high plank on clear non-slip ground."
    ],
    "exe": [
      "Přenes koleno k vnější straně stejného lokte a posuň protilehlou ruku vpřed. Střídej strany a postupuj malými kroky.",
      "Bring a knee outside the same-side elbow while advancing the opposite hand. Alternate in small forward steps."
    ],
    "wat": [
      "Nespouštěj hrudník mezi ramena a netlač kyčel do bolestivé polohy. Krok podle potřeby zkrať.",
      "Do not collapse between the shoulders or force a painful hip position. Shorten the step as needed."
    ],
    "pro": [
      "Lehčí: přitahování kolen na místě nebo dlaně na vyšší opoře. Těžší: delší úsek se stejným rytmem.",
      "Easier: tuck knees in place or elevate the hands. Harder: travel farther while keeping the same rhythm."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_spider_walk",
    "hd": null,
    "foc": [
      "Přenes koleno k vnější straně stejného lokte a posuň protilehlou ruku vpřed.",
      "Bring a knee outside the same-side elbow while advancing the opposite hand."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Spider Walks",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/247/spider-walks/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_cone_stepover",
    "cz": "Překračování kuželů vpřed",
    "en": "Forward Cone Step-over",
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 1,
    "C": 2,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "run_drill",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Rozestav nízké měkké kužely za sebe na neklouzavém povrchu.",
      "Arrange low yielding cones in a line on non-slip ground."
    ],
    "exe": [
      "Zvedni koleno, přenes chodidlo nad kuželem a došlápni za něj. Překroč i zadní nohou a pokračuj.",
      "Lift a knee, clear the cone and step beyond it. Bring the trailing foot over and continue."
    ],
    "wat": [
      "Nevyrovnávej výšku překážky úklonem trupu. Každý krok nejprve ustabilizuj.",
      "Do not lean sideways to clear the obstacle. Stabilise each step first."
    ],
    "pro": [
      "Lehčí: čáry na zemi nebo opora. Těžší: krátká výdrž na jedné noze před došlapem.",
      "Easier: floor lines or hand support. Harder: pause on one leg before stepping."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_cone_stepover",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedni koleno, přenes chodidlo nad kuželem a došlápni za něj.",
      "Lift a knee, clear the cone and step beyond it."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Forward Stepping over Cones",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/111/forward-stepping-over-cones/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_cone_jump",
    "cz": "Snožné přeskoky kuželů vpřed",
    "en": "Forward Cone Jumps",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 3,
    "C": 3,
    "pat": "drep",
    "eq": [
      "prostor"
    ],
    "family": "jump_horizontal",
    "load": "none",
    "ez": null,
    "pos": [
      "Připrav několik nízkých měkkých kuželů s dostatkem místa pro dopad.",
      "Set several low yielding cones with ample landing space."
    ],
    "exe": [
      "Z mělkého podřepu přeskoč kužel snožmo. Dopad ztlum pokrčením kyčlí a kolen; potom pokračuj.",
      "Jump forward over a cone from a shallow squat. Absorb landing through hips and knees, then continue."
    ],
    "wat": [
      "Kolena směřují s chodidly. Ukonči sérii, jakmile se dopady stávají hlučné či nejisté.",
      "Keep knees tracking with feet. End the set when landings become noisy or unstable."
    ],
    "pro": [
      "Lehčí: jednotlivé skoky přes čáru s pauzou. Těžší: plynulé nízké přeskoky bez ztráty kontroly.",
      "Easier: single jumps over a line with pauses. Harder: linked low jumps with controlled landings."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_cone_jump",
    "hd": null,
    "foc": [
      "Z mělkého podřepu přeskoč kužel snožmo.",
      "Jump forward over a cone from a shallow squat."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Forward Cone Jumps",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_lateral_cone_jump",
    "cz": "Boční přeskoky kuželů snožmo",
    "en": "Lateral Cone Jumps",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal",
      "add"
    ],
    "S": 3,
    "C": 3,
    "pat": "drep",
    "eq": [
      "prostor"
    ],
    "family": "jump_lateral",
    "load": "none",
    "ez": "ex26_lateral_linehop",
    "pos": [
      "Stůj bokem k řadě nízkých měkkých kuželů, chodidla přibližně na šířku pánve.",
      "Stand sideways beside low yielding cones, feet about hip-width apart."
    ],
    "exe": [
      "Odraz se oběma nohama do strany. Dopadni za kužel do měkkého podřepu a pokračuj stejným směrem.",
      "Push off both feet sideways, land beyond the cone in a soft squat and continue."
    ],
    "wat": [
      "Trup se neotáčí proti směru chodidel. Procvič oba směry.",
      "Keep trunk and feet facing consistently. Practise both directions."
    ],
    "pro": [
      "Lehčí: boční skok přes čáru se zastavením. Těžší: několik plynulých přeskoků stejné výšky.",
      "Easier: lateral line jump and hold. Harder: link several jumps at the same height."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_cone_jump",
    "hd": null,
    "foc": [
      "Odraz se oběma nohama do strany.",
      "Push off both feet sideways, land beyond the cone in a soft squat and continue."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Cone Jumps",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_ladder_lateral",
    "cz": "Boční kroky v koordinačním žebříku",
    "en": "Lateral Ladder Shuffle",
    "mp": [
      "glu",
      "cal"
    ],
    "ms": [
      "qua"
    ],
    "S": 2,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "change_direction",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Polož plochý koordinační žebřík a postav se bokem do krajního pole.",
      "Lay a flat agility ladder and stand sideways in its end square."
    ],
    "exe": [
      "V mírném podřepu vstup vedoucí nohou do dalšího pole a přisuň druhou. Pokračuj bez křížení nohou.",
      "In a shallow athletic stance, step into the next square and bring the trailing foot alongside without crossing."
    ],
    "wat": [
      "Nášlap patří do pole, ne na příčku. Žebřík slouží rytmu kroků, sám nezaručuje sportovní obratnost.",
      "Step inside squares, not on rungs. The ladder trains step rhythm, not every aspect of sport agility."
    ],
    "pro": [
      "Lehčí: pomalé kroky. Těžší: rychlejší rytmus při stejném přesném došlapu.",
      "Easier: slow steps. Harder: increase rhythm while preserving accurate placement."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_ladder_lateral",
    "ez": null,
    "hd": null,
    "foc": [
      "V mírném podřepu vstup vedoucí nohou do dalšího pole a přisuň druhou.",
      "In a shallow athletic stance, step into the next square and bring the trailing foot alongside without crossing."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Agility Ladder: Lateral Shuffle",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/170/agility-ladder-lateral-shuffle/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_t_drill",
    "cz": "Běžecký T-drill",
    "en": "T Drill",
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "cal",
      "add"
    ],
    "S": 3,
    "C": 4,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "change_direction",
    "measurementType": "DISTANCE",
    "load": "none",
    "tier": "specialist",
    "pos": [
      "Čtyři kužely tvoří T: start, střed před ním a dva boční body. Začni s krátkými vzdálenostmi.",
      "Set four cones in a T: start, forward centre and two lateral ends. Begin with short distances."
    ],
    "exe": [
      "Běž ke středu, zbrzdi, přesuň se bočně doleva, doprava přes střed a zpět do středu. Nakonec ustup vzad ke startu.",
      "Run to centre, brake, shuffle left, across to the right end and back to centre, then backpedal to start."
    ],
    "wat": [
      "Před změnou směru sniž rychlost. Při bočním přesunu nekřiž nohy a kontroluj volný prostor za sebou.",
      "Reduce speed before turning. Avoid crossing feet during shuffles and keep the backward path clear."
    ],
    "pro": [
      "Lehčí: projdi trasu krokem. Těžší: vyšší rychlost nebo reakce na pokyn trenéra.",
      "Easier: walk the route. Harder: increase speed or respond to a coach cue."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_t_drill",
    "ez": null,
    "hd": null,
    "foc": [
      "Běž ke středu, zbrzdi, přesuň se bočně doleva, doprava přes střed a zpět do středu.",
      "Run to centre, brake, shuffle left, across to the right end and back to centre, then backpedal to start."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "T Drill",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/171/t-drill/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_ladder_multidir",
    "cz": "Žebřík: dovnitř–dovnitř–ven",
    "en": "In-In-Out Ladder Drill",
    "mp": [
      "glu",
      "cal"
    ],
    "ms": [
      "qua"
    ],
    "S": 2,
    "C": 4,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "change_direction",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Stůj vedle začátku plochého koordinačního žebříku.",
      "Stand beside the start of a flat agility ladder."
    ],
    "exe": [
      "Vstup postupně oběma nohama do pole, vykroč jednou ven na druhou stranu a přejdi do dalšího pole. Střídej strany v rytmu dovnitř–dovnitř–ven.",
      "Step both feet successively into a square, one foot outside the opposite side, then enter the next square. Alternate sides in an in-in-out rhythm."
    ],
    "wat": [
      "Rychlost přidej až po zvládnutí pořadí. Nešlapej na příčky.",
      "Add speed only after learning the sequence. Avoid stepping on rungs."
    ],
    "pro": [
      "Lehčí: pomalý nácvik po jednom poli. Těžší: plynulý průchod se zrakem vpřed.",
      "Easier: rehearse one square slowly. Harder: continuous movement while looking ahead."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_ladder_multidir",
    "ez": null,
    "hd": null,
    "foc": [
      "Vstup postupně oběma nohama do pole, vykroč jednou ven na druhou stranu a přejdi do dalšího pole.",
      "Step both feet successively into a square, one foot outside the opposite side, then enter the next square."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Multidirectional Ladder Drill",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/172/multidirectional-ladder-drill/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_ladder_forward",
    "cz": "Běh vpřed koordinačním žebříkem",
    "en": "Forward Ladder Run",
    "mp": [
      "hipflex",
      "cal"
    ],
    "ms": [
      "glu",
      "qua"
    ],
    "S": 2,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "run_drill",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Stůj čelem k začátku plochého žebříku.",
      "Face the start of a flat agility ladder."
    ],
    "exe": [
      "Postupuj vpřed s jedním došlapem do každého pole. Střídej nohy a přirozený protilehlý pohyb paží.",
      "Run forward with one foot contact per square, alternating legs with opposite-arm action."
    ],
    "wat": [
      "Netahej krok násilně do délky pole. Použij rozteč odpovídající své postavě a rytmu.",
      "Do not force stride length to fit the ladder. Use spacing suited to your size and rhythm."
    ],
    "pro": [
      "Lehčí: chůze s přesnými došlapy. Těžší: postupně rychlejší rytmus při stejném jednom došlapu do pole. Dva došlapy do pole jsou jiná rytmická varianta.",
      "Easier: walk with accurate placement. Harder: gradually increase rhythm with the same one contact per square. Two contacts per square are a different rhythm variation."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_ladder_forward",
    "ez": null,
    "hd": null,
    "foc": [
      "Postupuj vpřed s jedním došlapem do každého pole.",
      "Run forward with one foot contact per square, alternating legs with opposite-arm action."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Forward Linear Ladder Drill",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/175/forward-linear-ladder-drill/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hexagon_lunge",
    "cz": "Výpady do šesti směrů",
    "en": "Hexagon Lunge Drill",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "add"
    ],
    "S": 2,
    "C": 4,
    "pat": "drep",
    "eq": [
      "prostor"
    ],
    "family": "lunge",
    "load": "none",
    "sideMode": "perSide",
    "pos": [
      "Rozestav šest kuželů kolem sebe na vzdálenost pohodlného výpadu.",
      "Place six cones around you within a comfortable lunge distance."
    ],
    "exe": [
      "Vykroč k jednomu kuželu a vrať se do středu. Před dalším směrem otoč chodidla i pánev; obejdi všechny body a vystřídej nohu.",
      "Lunge toward one cone and return to centre. Turn feet and pelvis toward the next direction, visit every cone and change the lead leg."
    ],
    "wat": [
      "Neotáčej zatížené koleno nad pevně přilepeným chodidlem. Dosah ke kuželu je volitelný.",
      "Do not twist a loaded knee over a fixed foot. Reaching toward the cone is optional."
    ],
    "pro": [
      "Lehčí: krátké kroky bez hlubokého výpadu. Těžší: větší řízený rozsah nebo rychlejší návrat.",
      "Easier: short steps without deep lunges. Harder: larger controlled range or a quicker return."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hexagon_lunge",
    "ez": null,
    "hd": null,
    "foc": [
      "Vykroč k jednomu kuželu a vrať se do středu.",
      "Lunge toward one cone and return to centre."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Hexagon Drill",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/207/hexagon-drill/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hurdle_run",
    "cz": "Běh vpřed přes nízké překážky",
    "en": "Forward Low-Hurdle Run",
    "mp": [
      "hipflex",
      "cal"
    ],
    "ms": [
      "glu",
      "qua"
    ],
    "S": 2,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "run_drill",
    "measurementType": "DISTANCE",
    "load": "none",
    "ez": "ex26_cone_stepover",
    "pos": [
      "Nízké překážky, které při kontaktu povolí, postav do pravidelné řady.",
      "Arrange low yielding hurdles at regular intervals."
    ],
    "exe": [
      "Běž vpřed s jedním došlapem mezi překážkami. Zvedej kolena tak, aby chodidla bezpečně prošla nad příčkou.",
      "Run forward with one contact between hurdles, lifting knees enough to clear each bar safely."
    ],
    "wat": [
      "Nevol vyšší překážku za cenu zaklánění nebo vybočování nohy.",
      "Do not increase hurdle height at the cost of leaning back or swinging the leg sideways."
    ],
    "pro": [
      "Lehčí: překračování krokem. Těžší: postupně rychlejší rytmus při stejné nízké výšce a jistých došlapech. Dva došlapy mezi překážkami jsou jiná rytmická varianta.",
      "Easier: walk over the hurdles. Harder: gradually increase rhythm at the same low height with accurate contacts. Two contacts between hurdles are a different rhythm variation."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hurdle_run",
    "hd": null,
    "foc": [
      "Běž vpřed s jedním došlapem mezi překážkami.",
      "Run forward with one contact between hurdles, lifting knees enough to clear each bar safely."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Forward Hurdle Run",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/221/forward-hurdle-run/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hurdle_lateral",
    "cz": "Boční běh přes nízké překážky",
    "en": "Lateral Low-Hurdle Run",
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "cal",
      "add"
    ],
    "S": 2,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "prostor"
    ],
    "family": "change_direction",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Stůj bokem k řadě nízkých bezpečných překážek.",
      "Stand sideways beside a row of low yielding hurdles."
    ],
    "exe": [
      "Přenes vedoucí a potom druhou nohu nad překážkou. Obě chodidla krátce došlápnou mezi příčkami, než pokračuješ do strany.",
      "Clear the hurdle with the leading then trailing foot. Both feet contact between bars before continuing sideways."
    ],
    "wat": [
      "Nekřiž nohy a zachovej směr trupu. Proveď i opačnou stranu.",
      "Avoid crossing feet and keep the same facing direction. Repeat the other way."
    ],
    "pro": [
      "Lehčí: pomalé boční překračování. Těžší: kratší kontakty při stejné přesnosti.",
      "Easier: slow lateral step-overs. Harder: shorten contacts while retaining accuracy."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hurdle_lateral",
    "ez": null,
    "hd": null,
    "foc": [
      "Přenes vedoucí a potom druhou nohu nad překážkou.",
      "Clear the hurdle with the leading then trailing foot."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Hurdle Run",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/226/lateral-hurdle-run/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_single_box_pushoff",
    "cz": "Odraz s jednou nohou na stupínku",
    "en": "Single-Leg Box Push-off",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 3,
    "C": 3,
    "pat": "drep",
    "eq": [
      "lavice"
    ],
    "family": "jump_vertical",
    "load": "none",
    "sideMode": "perSide",
    "ez": "stepup",
    "pos": [
      "Jedno celé chodidlo polož na nízký stabilní stupínek, druhé zůstává na zemi.",
      "Place one whole foot on a low stable step, with the other on the floor."
    ],
    "exe": [
      "Odraz se vzhůru hlavně nohou na stupínku a pomoz si pažemi. Dopadni měkce zpět do stejného rozkročného postavení a znovu se srovnej.",
      "Drive upward primarily through the elevated leg with arm assistance. Land softly back in the same split-level stance and reset."
    ],
    "wat": [
      "Stupínek se nesmí posunout. Výška má dovolovat kontrolovaný odraz i návrat.",
      "The step must not slide. Choose a height allowing controlled take-off and return."
    ],
    "pro": [
      "Lehčí: výstup bez odrazu. Těžší: vyšší odraz při stejné nízké opoře.",
      "Easier: step up without jumping. Harder: jump higher from the same low step."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_single_box_pushoff",
    "hd": null,
    "foc": [
      "Odraz se vzhůru hlavně nohou na stupínku a pomoz si pažemi.",
      "Drive upward primarily through the elevated leg with arm assistance."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single Leg Push-off",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_alternate_box_pushoff",
    "cz": "Střídavé odrazy ze stupínku",
    "en": "Alternating Box Push-off",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal"
    ],
    "S": 4,
    "C": 4,
    "pat": "drep",
    "eq": [
      "lavice"
    ],
    "family": "jump_vertical",
    "load": "none",
    "tier": "specialist",
    "ez": "ex26_single_box_pushoff",
    "pos": [
      "Začni s jedním chodidlem na nízkém stabilním stupínku a druhým na podlaze.",
      "Start with one foot on a low stable step and the other on the floor."
    ],
    "exe": [
      "Odraz se vzhůru, ve vzduchu vystřídej nohy a dopadni opačným chodidlem na stupínek. Mezi odrazy se nejprve zastav.",
      "Jump upward, switch legs in the air and land with the opposite foot on the step. Initially pause between jumps."
    ],
    "wat": [
      "Celé horní chodidlo musí trefit oporu. Při nejistotě vrať variantu bez střídání.",
      "Land the whole elevated foot on the support. Return to the non-switching version if placement is uncertain."
    ],
    "pro": [
      "Lehčí: střídavé výstupy bez skoku. Těžší: navazuj krátké série se stále měkkým dopadem.",
      "Easier: alternate step-ups without jumping. Harder: link short sets with soft landings."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_alternate_box_pushoff",
    "hd": null,
    "foc": [
      "Odraz se vzhůru, ve vzduchu vystřídej nohy a dopadni opačným chodidlem na stupínek.",
      "Jump upward, switch legs in the air and land with the opposite foot on the step."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Alternate Leg Push-off",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_lateral_zigzag",
    "cz": "Snožné skoky cikcak",
    "en": "Diagonal Zigzag Jumps",
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "cal",
      "add"
    ],
    "S": 3,
    "C": 4,
    "pat": "drep",
    "eq": [
      "prostor"
    ],
    "family": "jump_lateral",
    "load": "none",
    "ez": "ex26_lateral_cone_jump",
    "pos": [
      "Vyznač krátkou klikatou trasu nízkými kužely s dostatkem místa pro dopady.",
      "Mark a short zigzag route with low cones and clear landing areas."
    ],
    "exe": [
      "Skákej snožmo šikmo vpřed střídavě vlevo a vpravo. Při každém dopadu pokrč kyčle i kolena.",
      "Jump diagonally forward on both feet, alternating left and right, absorbing each landing through hips and knees."
    ],
    "wat": [
      "Chodidla a kolena zachovávají souhlasný směr. Série má být krátká a výbušná.",
      "Keep feet and knees aligned. Use short explosive sets."
    ],
    "pro": [
      "Lehčí: jednotlivé šikmé skoky s pauzou. Těžší: plynulé navázání bez prodlužování série do únavy.",
      "Easier: isolated diagonal jumps with pauses. Harder: link them without extending the set into fatigue."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_zigzag",
    "hd": null,
    "foc": [
      "Skákej snožmo šikmo vpřed střídavě vlevo a vpravo.",
      "Jump diagonally forward on both feet, alternating left and right, absorbing each landing through hips and knees."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Zig Zags",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/272/lateral-zig-zags/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_mb_lunge_pass",
    "cz": "Výpad s odhodem medicinbalu od hrudi",
    "en": "Medicine-Ball Lunge Chest Pass",
    "mp": [
      "che",
      "tri",
      "qua"
    ],
    "ms": [
      "glu",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "tlak",
    "eq": [
      "medicinbal",
      "prostor"
    ],
    "family": "throw_chest",
    "sideMode": "perSide",
    "load": "ext",
    "pos": [
      "Drž lehký medicinbal u hrudi čelem k připravenému partnerovi nebo vhodné odrazové stěně.",
      "Hold a light medicine ball at the chest facing a ready partner or suitable rebound wall."
    ],
    "exe": [
      "Vykroč do kontrolovaného výpadu a současně odhoď míč oběma rukama vpřed. Před dalším opakováním obnov stabilní postoj.",
      "Step into a controlled lunge while passing the ball forward with both hands. Regain a stable stance before repeating."
    ],
    "wat": [
      "Partner musí znát hmotnost míče a být připraven jej chytit. Neházej do běžné sádrokartonové stěny.",
      "The partner must know the ball weight and be ready. Do not throw at ordinary plasterboard walls."
    ],
    "pro": [
      "Lehčí: hod ze stoje. Těžší: rychlejší spojení výpadu a odhodu při stejné lehké zátěži.",
      "Easier: standing chest pass. Harder: connect lunge and release more quickly with the same light ball."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_mb_lunge_pass",
    "ez": null,
    "hd": null,
    "foc": [
      "Vykroč do kontrolovaného výpadu a současně odhoď míč oběma rukama vpřed.",
      "Step into a controlled lunge while passing the ball forward with both hands."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Medicine Ball Lunge to Chest Pass",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_mb_rot_slam",
    "cz": "Rotační hod medicinbalem o zem",
    "en": "Rotational Medicine-Ball Slam",
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "lat",
      "glu"
    ],
    "S": 3,
    "C": 4,
    "pat": "stred",
    "eq": [
      "medicinbal",
      "prostor"
    ],
    "family": "throw_rotation",
    "load": "ext",
    "tier": "specialist",
    "pos": [
      "Stůj v dostatečném prostoru s míčem vhodným pro hody o zem. Znáš-li jeho odskok, zvedni jej nad hlavu.",
      "Stand in clear space with a ball rated for slams. Know its rebound before raising it overhead."
    ],
    "exe": [
      "S mírným podřepem otoč kyčle i chodidla a hoď míč k zemi vedle těla. Znovu jej bezpečně zvedni a vystřídej stranu.",
      "Squat slightly, turn hips and feet and slam beside the body. Retrieve safely and alternate sides."
    ],
    "wat": [
      "Neotáčej pouze bedra nad fixovanými chodidly. Nekontrolovaný odskok nechytej před obličejem.",
      "Do not rotate only the lumbar spine over fixed feet. Avoid catching an unpredictable rebound near the face."
    ],
    "pro": [
      "Lehčí: pomalý pohyb bez odhodu nebo přímý slam. Těžší: rychlejší koordinovaný odhod lehkého míče.",
      "Easier: rehearse without release or use a straight slam. Harder: accelerate the coordinated throw of a light ball."
    ],
    "J": {
      "kyc": 2,
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_mb_rot_slam",
    "ez": null,
    "hd": null,
    "foc": [
      "S mírným podřepem otoč kyčle i chodidla a hoď míč k zemi vedle těla.",
      "Squat slightly, turn hips and feet and slam beside the body."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Rotational Slam",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/287/rotational-slam/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_cable_decline_fly",
    "cz": "Rozpažování na kladkách shora dolů",
    "en": "High-to-Low Cable Fly",
    "mp": [
      "che"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "kladka"
    ],
    "family": "chest_fly",
    "pos": [
      "Kladky nastav přibližně k hlavě. Uchop madla a vykroč do stabilního rozkročného postoje.",
      "Set pulleys around head height, take the handles and adopt a stable split stance."
    ],
    "exe": [
      "S lehce pokrčenými lokty spoj ruce obloukem před spodní částí hrudníku. Pomalu otevři paže do pohodlného rozsahu.",
      "With softly bent elbows, sweep hands together in front of the lower chest. Reopen slowly within a comfortable range."
    ],
    "wat": [
      "Neměň cvik v tlak ohýbáním loktů a nezískávej rozsah záklonem.",
      "Do not turn the fly into a press by bending elbows or gain range by arching back."
    ],
    "pro": [
      "Lehčí: menší odpor a kratší oblouk. Těžší: postupně přidej odpor při zachování dráhy.",
      "Easier: lighter resistance and a smaller arc. Harder: add resistance while preserving the path."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_decline_fly",
    "ez": null,
    "hd": null,
    "foc": [
      "S lehce pokrčenými lokty spoj ruce obloukem před spodní částí hrudníku.",
      "With softly bent elbows, sweep hands together in front of the lower chest."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Decline Cable Flyes",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/161/standing-decline-cable-flyes/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_incline_fly",
    "cz": "Rozpažování na kladkách zdola nahoru",
    "en": "Low-to-High Cable Fly",
    "mp": [
      "che"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "kladka"
    ],
    "family": "chest_fly",
    "pos": [
      "Madla nízkých kladek drž vedle boků. Stůj stabilně s jednou nohou vpředu.",
      "Hold low-pulley handles beside the hips in a stable split stance."
    ],
    "exe": [
      "Veď téměř natažené paže obloukem vpřed a vzhůru k úrovni horní části hrudníku až obličeje. Plynule vrať.",
      "Sweep softly extended arms forward and upward toward upper-chest to face height, then return smoothly."
    ],
    "wat": [
      "Konečnou výšku určuje pohodlí ramen. Nevytlačuj žebra vpřed.",
      "Let shoulder comfort determine finish height. Avoid flaring the ribs."
    ],
    "pro": [
      "Lehčí: lehčí zátěž a nižší konec pohybu. Těžší: delší kontrolovaný návrat nebo malý nárůst odporu.",
      "Easier: lighter weight and a lower finish. Harder: slower lowering or a small resistance increase."
    ],
    "J": {
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_cable_incline_fly",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď téměř natažené paže obloukem vpřed a vzhůru k úrovni horní části hrudníku až obličeje.",
      "Sweep softly extended arms forward and upward toward upper-chest to face height, then return smoothly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Standing Incline Cable Flyes",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/163/standing-incline-cable-flyes/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_cable_seated_press",
    "cz": "Tlak na kladkách vsedě",
    "en": "Seated Cable Chest Press",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "kladka",
      "lavice"
    ],
    "family": "push_horizontal",
    "pos": [
      "Sedni zády k oběma kladkám na stabilní lavici s opěrkou. Madla jsou u hrudníku a chodidla na zemi.",
      "Sit facing away from both pulleys on a stable backed bench, handles beside the chest and feet grounded."
    ],
    "exe": [
      "Vytlač obě madla vpřed ve výšce hrudníku. S kontrolou pokrč lokty a vrať ruce.",
      "Press both handles forward at chest height, then bend elbows under control to return."
    ],
    "wat": [
      "Opěrka i lavice musí odolat tahu kladek. Zápěstí drž v prodloužení předloktí.",
      "Bench and backrest must withstand cable pull. Keep wrists aligned with forearms."
    ],
    "pro": [
      "Lehčí: menší odpor. Těžší: postupně vyšší odpor při stejné opoře trupu.",
      "Easier: reduce resistance. Harder: gradually increase it with the same trunk support."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_seated_press",
    "ez": null,
    "hd": null,
    "foc": [
      "Vytlač obě madla vpřed ve výšce hrudníku.",
      "Press both handles forward at chest height, then bend elbows under control to return."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated Cable Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cable_decline_press",
    "cz": "Tlak na kladkách vsedě šikmo dolů",
    "en": "Seated Downward Cable Press",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "kladka",
      "lavice"
    ],
    "family": "push_horizontal",
    "pos": [
      "Sedni na stabilní lavici s opěrkou zády ke kladkám nastaveným nad výši ramen. Madla drž u dolní části hrudníku a chodidla opři o zem.",
      "Sit on a stable backed bench facing away from pulleys set above shoulder height. Hold the handles beside the lower chest with feet grounded."
    ],
    "exe": [
      "Z dolní části hrudníku tlač madla šikmo vpřed a dolů před stehna. Vracej po stejné dráze.",
      "Press handles diagonally forward and down from the lower chest toward the space in front of the thighs. Return along the same path."
    ],
    "wat": [
      "Neohýbej trup za madly. Lokty nenapínej prudkým nárazem.",
      "Do not fold the trunk after the handles or snap the elbows straight."
    ],
    "pro": [
      "Lehčí: kratší rozsah s malou zátěží. Těžší: vyšší odpor bez odlepení zad.",
      "Easier: shorter range and light load. Harder: more resistance while keeping back support."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_decline_press",
    "ez": null,
    "hd": null,
    "foc": [
      "Z dolní části hrudníku tlač madla šikmo vpřed a dolů před stehna.",
      "Press handles diagonally forward and down from the lower chest toward the space in front of the thighs."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated Decline Cable Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/166/seated-decline-cable-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_cable_incline_press",
    "cz": "Tlak na kladkách vsedě šikmo vzhůru",
    "en": "Seated Upward Cable Press",
    "mp": [
      "che",
      "sho"
    ],
    "ms": [
      "tri"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "kladka",
      "lavice"
    ],
    "family": "push_incline",
    "pos": [
      "Na stabilní lavici s opěrkou drž madla u horní části hrudníku. Kladky jsou za tebou níže než ruce, chodidla na zemi.",
      "Sit on a stable backed bench holding handles beside the upper chest. Set the pulleys behind you below hand level and keep the feet grounded."
    ],
    "exe": [
      "Vytlač madla vpřed a vzhůru přibližně k výšce čela. Kontrolovaně se vrať k hrudníku.",
      "Press forward and upward toward forehead height, then return under control to the chest."
    ],
    "wat": [
      "Udrž žebra nad pánví. Pokud ramena nutí k záklonu, zmenši úhel nebo odpor.",
      "Keep ribs stacked over pelvis. Reduce angle or load if shoulders force back arching."
    ],
    "pro": [
      "Lehčí: nižší směr tlaku a menší odpor. Těžší: přidávej zátěž při stálé dráze.",
      "Easier: lower pressing angle and lighter resistance. Harder: add load with a consistent path."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_cable_incline_press",
    "ez": null,
    "hd": null,
    "foc": [
      "Vytlač madla vpřed a vzhůru přibližně k výšce čela.",
      "Press forward and upward toward forehead height, then return under control to the chest."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated Incline Cable Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/167/seated-incline-cable-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_machine_highrow",
    "cz": "Vysoké přítahy na stroji s oporou hrudníku",
    "en": "Chest-Supported High Row Machine",
    "mp": [
      "upb",
      "sho"
    ],
    "ms": [
      "bic",
      "tra"
    ],
    "S": 2,
    "C": 2,
    "pat": "tah",
    "eq": [
      "stroj"
    ],
    "family": "pull_horizontal",
    "pos": [
      "Nastav sed a hrudní oporu tak, aby madla byla přibližně proti ramenům.",
      "Adjust seat and chest support so handles sit approximately at shoulder height."
    ],
    "exe": [
      "Táhni lokty ven a dozadu, dokud jsou přibližně v rovině trupu. Plynule natáhni ruce vpřed.",
      "Pull elbows outward and backward to around trunk level, then extend the arms forward smoothly."
    ],
    "wat": [
      "Hrudník neopouští oporu. Netlač lokty výš, než ramena pohodlně dovolí.",
      "Keep chest supported. Do not raise elbows beyond a comfortable shoulder range."
    ],
    "pro": [
      "Lehčí: menší odpor a o něco nižší lokty. Těžší: krátká pauza v přítahu nebo vyšší odpor.",
      "Easier: lighter resistance and slightly lower elbows. Harder: pause in the pull or increase resistance."
    ],
    "J": {
      "ram": 1,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_machine_highrow",
    "ez": null,
    "hd": null,
    "foc": [
      "Táhni lokty ven a dozadu, dokud jsou přibližně v rovině trupu.",
      "Pull elbows outward and backward to around trunk level, then extend the arms forward smoothly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated High Back Rows",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/169/seated-high-back-rows/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_machine_crunch",
    "cz": "Zkracovačka na stroji",
    "en": "Seated Abdominal Crunch Machine",
    "mp": [
      "abs"
    ],
    "ms": [],
    "S": 2,
    "C": 1,
    "pat": "stred",
    "eq": [
      "stroj"
    ],
    "family": "core_flexion",
    "pos": [
      "Nastav sed, opory nohou a madla podle stroje. Pánev zůstává usazená.",
      "Adjust seat, leg supports and handles for the machine, keeping the pelvis seated."
    ],
    "exe": [
      "Přibliž hrudník k pánvi krátkým zakulacením trupu. Pomalu se vrať bez pádu závaží.",
      "Curl the rib cage toward the pelvis through a short trunk movement. Return slowly without dropping the stack."
    ],
    "wat": [
      "Netáhni pouze pažemi ani neškubej hlavou. Použij rozsah, který kontroluje břicho.",
      "Avoid pulling only with the arms or jerking the head. Use a range controlled by the abdominals."
    ],
    "pro": [
      "Lehčí: minimální odpor nebo zkracovačka na zemi. Těžší: postupný nárůst odporu.",
      "Easier: minimal resistance or a floor crunch. Harder: gradually increase resistance."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_machine_crunch",
    "ez": null,
    "hd": null,
    "foc": [
      "Přibliž hrudník k pánvi krátkým zakulacením trupu.",
      "Curl the rib cage toward the pelvis through a short trunk movement."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Seated Crunch",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_machine_triceps",
    "cz": "Tricepsová extenze na stroji",
    "en": "Triceps Extension Machine",
    "mp": [
      "tri"
    ],
    "ms": [],
    "S": 2,
    "C": 1,
    "pat": "tlak",
    "eq": [
      "stroj"
    ],
    "family": "elbow_extension",
    "pos": [
      "Nastav sed tak, aby nadloktí spočívala na podložce a lokty odpovídaly ose páky.",
      "Adjust the seat so upper arms rest on the pad and elbows align with the lever axis."
    ],
    "exe": [
      "Tlač madla dolů propnutím loktů, zatímco nadloktí zůstávají opřená. Pomalým pokrčením se vrať.",
      "Press handles down by extending elbows while upper arms remain supported, then bend slowly to return."
    ],
    "wat": [
      "Nadzvedávání ramen a švih trupu značí příliš vysoký odpor.",
      "Shoulder lifting and trunk swinging indicate excessive resistance."
    ],
    "pro": [
      "Lehčí: menší odpor a bezbolestný rozsah. Těžší: vyšší odpor bez ztráty opory.",
      "Easier: less resistance and a comfortable range. Harder: more resistance without losing support."
    ],
    "J": {
      "lok": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_machine_triceps",
    "ez": null,
    "hd": null,
    "foc": [
      "Tlač madla dolů propnutím loktů, zatímco nadloktí zůstávají opřená.",
      "Press handles down by extending elbows while upper arms remain supported, then bend slowly to return."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Tricep Extension",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/292/tricep-extension/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_machine_glute",
    "cz": "Zanožování na klečícím stroji",
    "en": "Kneeling Glute Press Machine",
    "mp": [
      "glu"
    ],
    "ms": [
      "ham"
    ],
    "S": 2,
    "C": 2,
    "pat": "ohyb",
    "eq": [
      "stroj"
    ],
    "family": "hip_extension_isolation",
    "sideMode": "perSide",
    "pos": [
      "Na stroji opři předloktí nebo ruce a jedno koleno. Chodidlo druhé nohy polož na tlačnou desku.",
      "Support forearms or hands and one knee on the machine, placing the other foot on its press plate."
    ],
    "exe": [
      "Tlač chodidlo dozadu a prodlužuj kyčel i koleno podle dráhy stroje. Vrať se bez pohybu pánve.",
      "Press the foot backward, extending hip and knee along the machine path. Return without pelvic movement."
    ],
    "wat": [
      "Rozsah končí před záklonem v bedrech. Desku stále kontroluj chodidlem.",
      "Stop before lumbar arching. Keep the foot controlling the plate."
    ],
    "pro": [
      "Lehčí: menší odpor a rozsah. Těžší: krátká pauza v zanožení nebo vyšší odpor.",
      "Easier: less resistance and range. Harder: pause in hip extension or increase resistance."
    ],
    "J": {
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_machine_glute",
    "ez": null,
    "hd": null,
    "foc": [
      "Tlač chodidlo dozadu a prodlužuj kyčel i koleno podle dráhy stroje.",
      "Press the foot backward, extending hip and knee along the machine path."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Glute Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/293/glute-press/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_machine_lateral",
    "cz": "Upažování na stroji",
    "en": "Lateral Raise Machine",
    "mp": [
      "sho"
    ],
    "ms": [
      "tra"
    ],
    "S": 2,
    "C": 1,
    "pat": "tlak",
    "eq": [
      "stroj"
    ],
    "family": "front_raise",
    "pos": [
      "Sedni do stroje a umísti opěrky na nadloktí těsně nad lokty. Chodidla stojí na zemi.",
      "Sit with pads on upper arms just above the elbows and feet grounded."
    ],
    "exe": [
      "Zvedej lokty do stran přibližně do výšky ramen. Spouštěj je pomalu bez nárazu závaží.",
      "Lift elbows sideways toward shoulder height and lower slowly without stack impact."
    ],
    "wat": [
      "Pokrčení loktů zůstává stejné. Nezískávej výšku úklonem nebo prudkým pokrčením ramen.",
      "Maintain elbow bend. Avoid trunk leaning or abrupt shrugging to gain height."
    ],
    "pro": [
      "Lehčí: menší odpor a nižší zdvih. Těžší: pomalý návrat nebo malé zvýšení odporu.",
      "Easier: lighter resistance and lower lift. Harder: slower lowering or a small load increase."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_machine_lateral",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedej lokty do stran přibližně do výšky ramen.",
      "Lift elbows sideways toward shoulder height and lower slowly without stack impact."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Shoulder Raise",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/295/lateral-shoulder-raise/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_ball_suitcasepass",
    "cz": "Předávání fitballu mezi rukama a nohama",
    "en": "Stability-Ball Hand-to-Foot Pass",
    "mp": [
      "abs"
    ],
    "ms": [
      "hipflex",
      "add"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "load": "none",
    "pos": [
      "Lehni na záda a drž fitball nad hrudníkem. Nohy jsou zvednuté s mírně pokrčenými koleny.",
      "Lie supine holding a stability ball over the chest, legs raised with softly bent knees."
    ],
    "exe": [
      "Předej míč mezi chodidla a pomalu od sebe vzdal paže a nohy jen do kontrolovaného rozsahu. Vrať a předej míč do rukou.",
      "Pass the ball between the feet, then separate arms and legs only as far as controlled. Return and pass it to the hands."
    ],
    "wat": [
      "Jakmile se bedra nekontrolovaně prohýbají, zkrať páku. Míč nesmí spadnout na obličej.",
      "Shorten the lever if lumbar control is lost. Keep the ball clear of the face."
    ],
    "pro": [
      "Lehčí: předání nad tělem bez spouštění. Těžší: postupně delší páka při stejném postavení pánve.",
      "Easier: transfer above the body without lowering. Harder: gradually lengthen the lever with stable pelvic position."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_suitcasepass",
    "ez": null,
    "hd": null,
    "foc": [
      "Předej míč mezi chodidla a pomalu od sebe vzdal paže a nohy jen do kontrolovaného rozsahu.",
      "Pass the ball between the feet, then separate arms and legs only as far as controlled."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Supine Suitcase Pass",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/297/supine-suitcase-pass/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_runner",
    "cz": "Střídavé přítahy kolen s nohama na fitballu",
    "en": "Stability-Ball Prone Runner",
    "mp": [
      "abs"
    ],
    "ms": [
      "sho",
      "hipflex"
    ],
    "S": 4,
    "C": 4,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "load": "none",
    "tier": "specialist",
    "ez": "ex26_ball_kneetuck",
    "pos": [
      "Ve vzporu opři holeně o fitball a dlaně polož pod ramena. Okolí musí být volné.",
      "In a high plank, rest shins on a stability ball with hands beneath shoulders and clear space around you."
    ],
    "exe": [
      "Přitáhni jedno koleno pod hrudník, druhá noha drží míč. Nohy kontrolovaně vystřídej bez houpání trupu.",
      "Bring one knee beneath the chest while the other leg controls the ball. Exchange legs without rocking the trunk."
    ],
    "wat": [
      "Při sklouzávání nebo ztrátě opory se vrať ke dvěma nohám na míči.",
      "Return to two-leg support if slipping or losing ball control."
    ],
    "pro": [
      "Lehčí: obounohý přítah kolen. Těžší: plynulejší střídání při stejné stabilitě.",
      "Easier: double-knee tuck. Harder: smoother alternating steps with equal stability."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_runner",
    "hd": null,
    "foc": [
      "Přitáhni jedno koleno pod hrudník, druhá noha drží míč.",
      "Bring one knee beneath the chest while the other leg controls the ball."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Prone Runner",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/298/prone-runner/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_kneel_circles",
    "cz": "Malé obrazce předloktími na fitballu v kleku",
    "en": "Kneeling Stability-Ball Tracing",
    "mp": [
      "abs"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 2,
    "C": 2,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "DURATION",
    "pos": [
      "Klekni a opři předloktí o fitball. Trup a stehna tvoří přibližně jednu šikmou linii.",
      "Kneel with forearms on a stability ball, trunk and thighs forming a roughly straight inclined line."
    ],
    "exe": [
      "Předloktími posouvej míč v malých kruzích nebo jednoduchých obrazcích. Trup zůstává klidný.",
      "Move the ball with forearms in small circles or simple shapes while keeping the trunk quiet."
    ],
    "wat": [
      "Nesedej na paty a nepropadej mezi ramena. Rozměr obrazce řídí kontrola břicha.",
      "Avoid sitting onto heels or sinking between shoulders. Let abdominal control limit the shape size."
    ],
    "pro": [
      "Lehčí: statická opora nebo menší kruh. Těžší: o něco větší obrazec či přechod na špičky.",
      "Easier: static support or smaller circles. Harder: slightly larger shapes or toe-supported progression."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_kneel_circles",
    "ez": null,
    "hd": null,
    "foc": [
      "Předloktími posouvej míč v malých kruzích nebo jednoduchých obrazcích.",
      "Move the ball with forearms in small circles or simple shapes while keeping the trunk quiet."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Kneeling ABC's",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/299/kneeling-abc-s/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_ball_plank_circles",
    "cz": "Malé obrazce na fitballu ve vzporu",
    "en": "Stability-Ball Plank Tracing",
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "DURATION",
    "ez": "ex26_ball_kneel_circles",
    "pos": [
      "Opři předloktí o fitball a špičky o zem. Tělo drž v dlouhé linii bez prohnutí.",
      "Rest forearms on the stability ball and toes on the floor, keeping a long body line."
    ],
    "exe": [
      "Opisuj předloktími drobné kruhy nebo obrazce. Pohybuj míčem, nikoli pánví ze strany na stranu.",
      "Trace small circles or shapes with forearms, moving the ball rather than rocking the pelvis."
    ],
    "wat": [
      "Při zadržování dechu nebo propadu beder zmenši rozsah či polož kolena.",
      "Reduce range or lower the knees if breath holding or lumbar sagging occurs."
    ],
    "pro": [
      "Lehčí: opora kolen nebo výdrž bez pohybu. Těžší: větší obrazec při stejné poloze trupu.",
      "Easier: kneeling support or a static hold. Harder: larger shapes with unchanged trunk alignment."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_ball_plank_circles",
    "hd": null,
    "foc": [
      "Opisuj předloktími drobné kruhy nebo obrazce.",
      "Trace small circles or shapes with forearms, moving the ball rather than rocking the pelvis."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Prone ABC's",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/300/prone-abc-s/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_hang_clean",
    "cz": "Přemístění z visu",
    "en": "Hang Clean",
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "ham",
      "tra",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "family": "olympic_pull",
    "tier": "specialist",
    "ez": "ex26_clean_pull",
    "pos": [
      "Drž osu nadhmatem před stehny, chodidla přibližně pod kyčlemi. Pohyb nejprve nacvič s lehkou osou pod vedením trenéra.",
      "Hold the bar overhand at the thighs, feet about hip-width. Learn with a light bar and qualified coaching."
    ],
    "exe": [
      "Předkloň se v kyčlích s osou nad koleny. Prudce napni nohy a kyčle, přesuň se pod osu a zachyť ji na předních ramenou s lokty vpřed. Vstaň.",
      "Hinge with the bar above knees, extend legs and hips explosively, move under it and receive on the front shoulders with elbows forward. Stand up."
    ],
    "wat": [
      "Osa dopadá na ramena, ne do rukou. Hloubku zachycení určuje kontrola předního dřepu.",
      "Receive the bar on shoulders rather than hands. Catch depth depends on front-squat control."
    ],
    "pro": [
      "Lehčí: výtah nebo nácvik přetočení loktů lehkou osou. Těžší: hlubší jisté zachycení a poté postupná zátěž.",
      "Easier: clean pull or light turnover practice. Harder: a deeper secure catch, then gradual loading."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_hang_clean",
    "hd": null,
    "foc": [
      "Předkloň se v kyčlích s osou nad koleny.",
      "Hinge with the bar above knees, extend legs and hips explosively, move under it and receive on the front shoulders with elbows forward."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Hang Clean",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/312/hang-clean/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_split_jerk",
    "cz": "Výraz do střihu ze stojanu",
    "en": "Split Jerk from Rack",
    "mp": [
      "qua",
      "sho",
      "tri"
    ],
    "ms": [
      "glu",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "pat": "tlak",
    "eq": [
      "cinka"
    ],
    "family": "olympic_clean_jerk",
    "tier": "specialist",
    "pos": [
      "Odeber osu ze stojanu na přední ramena. Připrav volnou vzpěračskou platformu a lehkou výukovou zátěž.",
      "Take the bar from a rack onto front shoulders with a clear weightlifting platform and light practice load."
    ],
    "exe": [
      "Krátce svisle podřepni, vytlač osu nohama vzhůru a rychle se pod ni přesuň do střihu. Zajisti lokty a potom srovnej nohy pod tělo.",
      "Dip vertically, drive the bar upward with the legs and move underneath into a split. Secure elbows, then recover feet beneath the body."
    ],
    "wat": [
      "Přední chodidlo je celé na zemi, zadní pata zvednutá a zadní koleno měkké. Nejprve se nauč bezpečně opustit nezdařený pokus.",
      "Ground the front sole, raise the rear heel and keep rear knee soft. Learn safe failed-lift procedures first."
    ],
    "pro": [
      "Lehčí: práce nohou bez osy a tlak s dopomocí nohou. Těžší: postupné zatížení jistého střihu.",
      "Easier: unloaded split footwork and push press. Harder: progressively load a secure split."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 3,
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_split_jerk",
    "ez": null,
    "hd": null,
    "foc": [
      "Krátce svisle podřepni, vytlač osu nohama vzhůru a rychle se pod ni přesuň do střihu.",
      "Dip vertically, drive the bar upward with the legs and move underneath into a split."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Push Jerk",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/313/push-jerk/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_barbell_snatch",
    "cz": "Trh velké činky ze země",
    "en": "Barbell Snatch from Floor",
    "mp": [
      "glu",
      "qua",
      "sho"
    ],
    "ms": [
      "ham",
      "tra",
      "abs"
    ],
    "S": 5,
    "C": 5,
    "pat": "ohyb",
    "eq": [
      "cinka"
    ],
    "family": "olympic_snatch",
    "tier": "specialist",
    "ez": "ex26_hang_snatch",
    "pos": [
      "Nastav široký úchop, osu nad středem chodidel a stabilní startovní předklon. Použij vzpěračský prostor a vedení trenéra.",
      "Set a wide grip, bar over midfoot and a braced start position in a weightlifting area with coaching."
    ],
    "exe": [
      "Zvedej osu blízko nohou, po průchodu koleny zrychli napnutím kyčlí a nohou. Přesuň se pod osu do dřepu s pevnými pažemi nad hlavou a vstaň.",
      "Lift close to the legs, accelerate after passing knees through hip and leg extension, receive overhead in a squat and stand."
    ],
    "wat": [
      "Nevytahuj osu daleko od těla. Bez jistého dřepu nad hlavou a bezpečného odhození zůstaň u průpravy.",
      "Avoid looping the bar away. Use preparatory drills until overhead squat and safe release skills are reliable."
    ],
    "pro": [
      "Lehčí: trh z visu s lehkou osou nebo tahová průprava. Těžší: postupně vyšší zátěž při stejné dráze.",
      "Easier: light hang snatch or pulling drills. Harder: gradual loading with the same bar path."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 3,
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_barbell_snatch",
    "hd": null,
    "foc": [
      "Zvedej osu blízko nohou, po průchodu koleny zrychli napnutím kyčlí a nohou.",
      "Lift close to the legs, accelerate after passing knees through hip and leg extension, receive overhead in a squat and stand."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Snatch",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/314/snatch/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_barbell_thruster",
    "cz": "Přední dřep s tlakem velké činky",
    "en": "Barbell Thruster",
    "mp": [
      "qua",
      "glu",
      "sho"
    ],
    "ms": [
      "tri",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "drep",
    "eq": [
      "cinka"
    ],
    "family": "squat_to_press",
    "tier": "specialist",
    "ez": null,
    "pos": [
      "Drž osu na předních ramenou v pohodlném předním postoji.",
      "Hold the bar on front shoulders in a comfortable front-rack stance."
    ],
    "exe": [
      "Proveď přední dřep a sílu vzestupu plynule přenes do tlaku nad hlavu. Vrať osu na ramena před dalším dřepem.",
      "Front squat, then smoothly transfer the upward leg drive into an overhead press. Return to the shoulders before squatting again."
    ],
    "wat": [
      "Nevyvažuj tlak záklonem. Vol zátěž podle slabší části kombinace.",
      "Avoid leaning back to finish. Choose load according to the weaker part of the combination."
    ],
    "pro": [
      "Lehčí: samostatný přední dřep a tlak s lehkou osou. Těžší: plynulejší spojení a teprve potom vyšší zátěž.",
      "Easier: separate front squat and light press. Harder: smoother connection before increasing load."
    ],
    "J": {
      "kyc": 1,
      "kol": 2,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_barbell_thruster",
    "hd": null,
    "foc": [
      "Proveď přední dřep a sílu vzestupu plynule přenes do tlaku nad hlavu.",
      "Front squat, then smoothly transfer the upward leg drive into an overhead press."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Front Squat to Overhead Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/315/front-squat-to-overhead-press/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_plank_updown",
    "cz": "Přechody mezi dlaněmi a předloktími",
    "en": "Plank Up-down",
    "mp": [
      "abs",
      "tri"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "family": "core_antirotation",
    "load": "none",
    "pos": [
      "Začni ve vzporu na dlaních s chodidly o něco širšími než pánev.",
      "Begin in a high plank with feet slightly wider than hips."
    ],
    "exe": [
      "Polož jedno a potom druhé předloktí. Znovu se postupně vytlač na dlaně a střídej vedoucí ruku.",
      "Lower one forearm then the other, press back onto hands one at a time and alternate the leading arm."
    ],
    "wat": [
      "Pánev se má otáčet co nejméně. Lokty a dlaně pokládej kontrolovaně.",
      "Minimise pelvic rotation and place elbows and hands gently."
    ],
    "pro": [
      "Lehčí: kolena na zemi. Těžší: užší chodidla nebo pomalejší přesuny.",
      "Easier: knees grounded. Harder: narrow feet or slow the transitions."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_plank_updown",
    "ez": null,
    "hd": null,
    "foc": [
      "Polož jedno a potom druhé předloktí.",
      "Lower one forearm then the other, press back onto hands one at a time and alternate the leading arm."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Plank-ups",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/320/plank-ups/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_singlearm_plank",
    "cz": "Vzpor na jedné ruce",
    "en": "Single-Arm High Plank",
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "ez": "ex26_plank_shoulder_tap",
    "pos": [
      "Ve vzporu rozkroč chodidla a přenes váhu nad jednu dlaň.",
      "In a high plank, widen the feet and shift weight over one palm."
    ],
    "exe": [
      "Zvedni druhou ruku k boku a krátce vydrž s pánví čelem k podlaze. Ruku polož a vystřídej.",
      "Lift the free hand toward the hip and hold briefly with pelvis facing the floor, then replace and switch."
    ],
    "wat": [
      "Rameno opory se nepropadá. Výdrž ukonči před rotací nebo zadržováním dechu.",
      "Avoid sinking into the supporting shoulder. End before rotation or breath holding."
    ],
    "pro": [
      "Lehčí: dlaň na vyšší opoře nebo širší chodidla. Těžší: užší postoj při stejné kvalitě výdrže.",
      "Easier: elevated hand support or wider feet. Harder: narrower stance with equal control."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_singlearm_plank",
    "hd": null,
    "foc": [
      "Zvedni druhou ruku k boku a krátce vydrž s pánví čelem k podlaze.",
      "Lift the free hand toward the hip and hold briefly with pelvis facing the floor, then replace and switch."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single Arm Plank",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/321/single-arm-plank/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_diagonal_plank",
    "cz": "Vzpor s protilehlou rukou a nohou ve vzduchu",
    "en": "Opposite-Arm-and-Leg High Plank",
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "sho",
      "glu"
    ],
    "S": 4,
    "C": 4,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "tier": "specialist",
    "ez": "ex26_singlearm_plank",
    "pos": [
      "Začni v pevném vzporu na dlaních a špičkách.",
      "Begin in a stable palm-and-toe high plank."
    ],
    "exe": [
      "Odlehči jednu ruku a protilehlou nohu, pomalu je prodluž od těla a krátce podrž. Vrať obě opory před změnou strany.",
      "Unweight one hand and the opposite foot, extend them slowly and hold briefly. Restore both supports before switching."
    ],
    "wat": [
      "Zdvih končetin je malý; nesmí jej nahrazovat rotace pánve nebo prohnutí beder.",
      "Use a small limb lift without substituting pelvic rotation or lumbar extension."
    ],
    "pro": [
      "Lehčí: zvedej jen jednu končetinu nebo cvič z kleku. Těžší: krátce prodluž výdrž se stálým dechem.",
      "Easier: lift only one limb or work from quadruped. Harder: slightly extend the hold while breathing freely."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_diagonal_plank",
    "hd": null,
    "foc": [
      "Odlehči jednu ruku a protilehlou nohu, pomalu je prodluž od těla a krátce podrž.",
      "Unweight one hand and the opposite foot, extend them slowly and hold briefly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single Arm, Single Leg Plank",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/325/single-arm-single-leg-plank/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_stagger_pushup",
    "cz": "Klik s posunutými dlaněmi",
    "en": "Staggered-Hand Push-up",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "sho"
    ],
    "S": 3,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "telo"
    ],
    "family": "push_horizontal",
    "load": "none",
    "sideMode": "perSide",
    "pos": [
      "Zaujmi klik a jednu dlaň posuň mírně vpřed, druhou nech blíž trupu.",
      "Set a push-up with one palm slightly forward and the other closer to the trunk."
    ],
    "exe": [
      "Spusť hrudník mezi ruce a vytlač tělo zpět jako jeden celek. Po sérii vyměň postavení rukou.",
      "Lower the chest between hands and press the body up as one unit. Exchange hand positions after the set."
    ],
    "wat": [
      "Posun dlaní má být malý a ramena bez bolesti. Neotáčej hrudník k jedné ruce.",
      "Keep the stagger modest and shoulders comfortable. Avoid rotating the chest toward one hand."
    ],
    "pro": [
      "Lehčí: dlaně na lavici nebo menší posun. Těžší: pomalejší klesání bez zvětšování asymetrie.",
      "Easier: hands on a bench or a smaller stagger. Harder: slower lowering without increasing asymmetry."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_stagger_pushup",
    "ez": null,
    "hd": null,
    "foc": [
      "Spusť hrudník mezi ruce a vytlač tělo zpět jako jeden celek.",
      "Lower the chest between hands and press the body up as one unit."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Push-up with Staggered Hands",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/327/push-up-with-staggered-hands/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_lateral_crawl",
    "cz": "Boční chůze ve vzporu",
    "en": "Lateral High-Plank Crawl",
    "mp": [
      "abs",
      "sho"
    ],
    "ms": [
      "che",
      "glu"
    ],
    "S": 3,
    "C": 3,
    "pat": "prenos",
    "eq": [
      "telo",
      "prostor"
    ],
    "family": "crawl",
    "measurementType": "DISTANCE",
    "load": "none",
    "pos": [
      "Začni ve vzporu v prostoru dovolujícím několik kroků do strany.",
      "Start in a high plank with room for several sideways steps."
    ],
    "exe": [
      "Posuň ruku a nohu na vedoucí straně do boku a přisuň druhou dvojici. Udrž přiměřenou šířku opor.",
      "Move the leading hand and foot sideways, then bring the trailing pair across while keeping a useful support width."
    ],
    "wat": [
      "Nekřiž ruce ani nohy. Pánev nemá skákat nahoru a dolů.",
      "Avoid crossing hands or feet and bouncing the pelvis."
    ],
    "pro": [
      "Lehčí: jednotlivé pomalé kroky. Těžší: delší úsek s plynulým rytmem na obě strany.",
      "Easier: isolated slow steps. Harder: longer smooth travel in both directions."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_lateral_crawl",
    "ez": null,
    "hd": null,
    "foc": [
      "Posuň ruku a nohu na vedoucí straně do boku a přisuň druhou dvojici.",
      "Move the leading hand and foot sideways, then bring the trailing pair across while keeping a useful support width."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Crawls",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/328/lateral-crawls/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_plank_rotation",
    "cz": "Otevření trupu z vysokého vzporu",
    "en": "High-Plank Rotation",
    "mp": [
      "obl",
      "abs"
    ],
    "ms": [
      "sho",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "family": "core_rotation",
    "load": "none",
    "sideMode": "perSide",
    "pos": [
      "Začni ve vzporu na dlaních, chodidla o něco širší než pánev.",
      "Begin in a high plank with feet slightly wider than hips."
    ],
    "exe": [
      "Přenes váhu na jednu ruku, otoč hrudník i pánev do boku a zvedni volnou paži vzhůru. Kontrolovaně vrať dlaň.",
      "Shift onto one hand, rotate chest and pelvis sideways and raise the free arm. Return the palm under control."
    ],
    "wat": [
      "Otočení dovol i chodidlům. Nesnaž se rotovat jen v bedrech nad fixovanou pánví.",
      "Allow the feet to turn too. Avoid twisting only the lower back over a fixed pelvis."
    ],
    "pro": [
      "Lehčí: dlaň na vyšší opoře nebo menší otočení. Těžší: krátká výdrž v otevření.",
      "Easier: elevated hand support or less rotation. Harder: pause briefly in the open position."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_plank_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Přenes váhu na jednu ruku, otoč hrudník i pánev do boku a zvedni volnou paži vzhůru.",
      "Shift onto one hand, rotate chest and pelvis sideways and raise the free arm."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "High Plank T-spine Rotation",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/330/high-plank-t-spine-rotation/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_single_cable_press",
    "cz": "Jednoruční tlak kladky ve stoji",
    "en": "Standing Single-Arm Cable Press",
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "abs",
      "obl"
    ],
    "S": 2,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "kladka"
    ],
    "family": "push_horizontal",
    "sideMode": "perSide",
    "pos": [
      "Stůj zády ke kladce ve výšce ramene, madlo u hrudníku a chodidla stabilně na zemi.",
      "Stand facing away from a shoulder-height pulley with the handle by the chest and feet firmly grounded."
    ],
    "exe": [
      "Vytlač jednu ruku vpřed, aniž se hrudník otočí. Pomalu vrať madlo k tělu.",
      "Press one arm forward without turning the chest, then return the handle slowly."
    ],
    "wat": [
      "Odpor musí dovolovat klidný trup. Volná ruka nepřitahuje konstrukci.",
      "Use resistance that allows a quiet trunk. Do not pull on the frame with the free hand."
    ],
    "pro": [
      "Lehčí: širší rozkročný postoj a menší odpor. Těžší: vyšší odpor při stejné stabilitě.",
      "Easier: a wider split stance and lighter resistance. Harder: increase resistance with equal stability."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_single_cable_press",
    "ez": null,
    "hd": null,
    "foc": [
      "Vytlač jednu ruku vpřed, aniž se hrudník otočí.",
      "Press one arm forward without turning the chest, then return the handle slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single-arm Chest Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_rotational_cable_press",
    "cz": "Jednoruční tlak kladky s otočením",
    "en": "Rotational Single-Arm Cable Press",
    "mp": [
      "che",
      "tri",
      "obl"
    ],
    "ms": [
      "glu"
    ],
    "S": 3,
    "C": 4,
    "pat": "tlak",
    "eq": [
      "kladka"
    ],
    "family": "core_rotation",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Postav se do rozkročného postoje, kladka je za zadním ramenem a madlo u hrudi.",
      "Adopt a split stance with the pulley behind the rear shoulder and handle at the chest."
    ],
    "exe": [
      "Otoč zadní chodidlo a kyčel vpřed a navazuj tlakem paže. Vrať se řízenou opačnou rotací.",
      "Pivot the rear foot and hip forward while pressing the arm, then reverse the rotation under control."
    ],
    "wat": [
      "Rotace se rozděluje mezi chodidla, kyčle a hrudník. Nepřetáčej zatížené koleno.",
      "Share rotation through feet, hips and chest. Avoid twisting the loaded knee."
    ],
    "pro": [
      "Lehčí: tlak bez rotace. Těžší: svižnější koordinace s lehkým odporem.",
      "Easier: press without rotation. Harder: quicker coordinated movement with light resistance."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_rotational_cable_press",
    "ez": null,
    "hd": null,
    "foc": [
      "Otoč zadní chodidlo a kyčel vpřed a navazuj tlakem paže.",
      "Pivot the rear foot and hip forward while pressing the arm, then reverse the rotation under control."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single-arm Rotational Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/339/single-arm-rotational-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kneeling_chop",
    "cz": "Diagonální stahování kladky v polokleku",
    "en": "Half-Kneeling Cable Chop",
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "lat",
      "sho"
    ],
    "S": 2,
    "C": 3,
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "family": "core_antirotation",
    "sideMode": "perSide",
    "pos": [
      "Klekni na koleno vzdálenější od vysoké kladky; bližší chodidlo je vpředu. Oběma rukama drž konce lana.",
      "Half-kneel with the knee farther from the high pulley down and nearer foot forward. Hold both rope ends."
    ],
    "exe": [
      "Veď lano přes hrudník šikmo k opačnému boku. Pánev i hrudník zachovávají směr vpřed.",
      "Draw the rope diagonally across the chest toward the opposite hip while keeping pelvis and chest facing forward."
    ],
    "wat": [
      "Neotáčej trup za lanem a neuhýbej do úklonu.",
      "Avoid following the rope with trunk rotation or side bending."
    ],
    "pro": [
      "Lehčí: lehčí odpor a kratší dráha. Těžší: pomalejší návrat či mírně vyšší odpor.",
      "Easier: lighter resistance and a shorter path. Harder: slower return or slightly more resistance."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kneeling_chop",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď lano přes hrudník šikmo k opačnému boku.",
      "Draw the rope diagonally across the chest toward the opposite hip while keeping pelvis and chest facing forward."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Kneeling Wood Chop",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/340/kneeling-wood-chop/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_sideplank_row",
    "cz": "Přítah kladky v bočním prkně",
    "en": "Side-Plank Cable Row",
    "mp": [
      "obl",
      "upb"
    ],
    "ms": [
      "lat",
      "sho"
    ],
    "S": 4,
    "C": 4,
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "family": "core_lateral",
    "sideMode": "perSide",
    "tier": "specialist",
    "ez": "ex26_knees_sideplank",
    "pos": [
      "Opři spodní předloktí o zem a v bočním prkně se natoč čelem k nízké kladce. Horní ruka drží madlo.",
      "Set a forearm side plank facing a low pulley, holding the handle in the upper hand."
    ],
    "exe": [
      "Udrž vyvýšenou pánev a přitáhni horní loket k žebrům. Pomalu natáhni ruku bez přetočení trupu.",
      "Keep hips raised while rowing the upper elbow toward the ribs, then extend slowly without rolling the trunk."
    ],
    "wat": [
      "Zátěž nesmí převážit tělo dopředu. Rameno spodní opory zůstává aktivní.",
      "The load must not pull the body forward. Keep the lower shoulder actively supported."
    ],
    "pro": [
      "Lehčí: spodní koleno na zemi a menší odpor. Těžší: opora chodidel a kontrolovaně vyšší odpor.",
      "Easier: lower knee grounded and less resistance. Harder: feet-supported plank with controlled loading."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_sideplank_row",
    "hd": null,
    "foc": [
      "Udrž vyvýšenou pánev a přitáhni horní loket k žebrům.",
      "Keep hips raised while rowing the upper elbow toward the ribs, then extend slowly without rolling the trunk."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Side Plank Row",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/343/side-plank-row/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_squat_row",
    "cz": "Dřep s přítahy kladky",
    "en": "Cable Squat to Row",
    "mp": [
      "qua",
      "glu",
      "upb"
    ],
    "ms": [
      "lat",
      "bic"
    ],
    "S": 2,
    "C": 3,
    "pat": "drep",
    "eq": [
      "kladka"
    ],
    "family": "squat_bilateral",
    "pos": [
      "Stůj čelem ke kladce ve výšce pasu a drž dvojité madlo oběma rukama.",
      "Face a waist-height pulley and hold a double handle with both hands."
    ],
    "exe": [
      "S nataženými pažemi klesni do dřepu. Při vstávání přitáhni lokty k bokům; při dalším dřepu paže opět prodluž.",
      "Squat with long arms. Row elbows toward the ribs while standing, then extend arms on the next descent."
    ],
    "wat": [
      "Kladka nesmí nahrazovat oporu nohou. Nezakláněj se při přítahu.",
      "Do not hang bodyweight from the cable or lean back to finish the row."
    ],
    "pro": [
      "Lehčí: mělký dřep a menší odpor. Těžší: větší kontrolovaný rozsah a následně zátěž.",
      "Easier: shallow squat and less resistance. Harder: larger controlled range, then load."
    ],
    "J": {
      "kol": 2,
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_squat_row",
    "ez": null,
    "hd": null,
    "foc": [
      "S nataženými pažemi klesni do dřepu.",
      "Squat with long arms."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Squat to Row",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/344/squat-to-row/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_lunge_row",
    "cz": "Výpad vzad s přítahy a zdvihem kolena",
    "en": "Reverse Lunge to Single-Arm Row",
    "mp": [
      "qua",
      "glu",
      "lat"
    ],
    "ms": [
      "upb",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "drep",
    "eq": [
      "kladka"
    ],
    "family": "lunge",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Stůj čelem ke kladce nastavené přibližně do výšky hrudníku, madlo v pravé ruce. Levá noha zůstává hlavní oporou. Po sérii vystřídej ruku i nohu.",
      "Face a pulley set approximately at chest height with the handle in the right hand and left leg as the main support. Change both arm and leg after the set."
    ],
    "exe": [
      "Pravou nohou vykroč vzad do výpadu a prodluž pravou paži. Při návratu přitáhni madlo a pravé koleno zvedni před sebe.",
      "Step the right leg back into a lunge while extending the right arm. Rise, row the handle and bring the right knee forward."
    ],
    "wat": [
      "Nejdřív zvládni návrat do stoje bez kolenního zdvihu. Trup neškube proti odporu.",
      "Master return to standing before adding the knee drive. Avoid jerking against resistance."
    ],
    "pro": [
      "Lehčí: po výpadu polož obě chodidla. Těžší: krátce ustabilizuj jednonožný konec.",
      "Easier: place both feet down after the lunge. Harder: briefly stabilise the single-leg finish."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_lunge_row",
    "ez": null,
    "hd": null,
    "foc": [
      "Pravou nohou vykroč vzad do výpadu a prodluž pravou paži.",
      "Step the right leg back into a lunge while extending the right arm."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lunge to Single Arm Row",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/345/lunge-to-single-arm-row/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_antirotation_lunge",
    "cz": "Výpad vzad proti bočnímu tahu kladky",
    "en": "Antirotation Reverse Lunge",
    "mp": [
      "qua",
      "glu",
      "obl"
    ],
    "ms": [
      "abs"
    ],
    "S": 3,
    "C": 3,
    "pat": "drep",
    "eq": [
      "kladka"
    ],
    "family": "core_antirotation",
    "sideMode": "perSide",
    "pos": [
      "Stůj bokem ke kladce ve výšce hrudníku. Madlo drž oběma rukama před sebou.",
      "Stand sideways to a chest-height pulley, holding the handle with both hands in front."
    ],
    "exe": [
      "Prodluž paže a jednou nohou vykroč vzad do výpadu. Vrať se vpřed bez otočení trupu ke kladce.",
      "Extend arms and step one leg back into a lunge. Return without turning the trunk toward the pulley."
    ],
    "wat": [
      "Odpor nesmí narušit směr kolena nebo stabilitu. Procvič oba směry bočního tahu.",
      "The resistance must not disrupt knee alignment or balance. Train both directions of lateral pull."
    ],
    "pro": [
      "Lehčí: drž madlo u hrudníku a zkrať výpad. Těžší: delší páka paží nebo mírně vyšší odpor.",
      "Easier: keep handle near chest and shorten the lunge. Harder: extend the arm lever or add modest resistance."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_antirotation_lunge",
    "ez": null,
    "hd": null,
    "foc": [
      "Prodluž paže a jednou nohou vykroč vzad do výpadu.",
      "Extend arms and step one leg back into a lunge."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Anti-rotation Reverse Lunge",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/348/anti-rotation-reverse-lunge/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_transverse_lunge",
    "cz": "Výpad šikmo vzad s jednoručkami",
    "en": "Transverse Dumbbell Lunge",
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "add"
    ],
    "S": 3,
    "C": 4,
    "pat": "drep",
    "eq": [
      "zavazi"
    ],
    "family": "lunge",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Stůj s lehkou jednoručkou v každé ruce. Připrav volný prostor šikmo za sebou.",
      "Stand holding light dumbbells with clear space diagonally behind you."
    ],
    "exe": [
      "Vykroč jednou nohou šikmo vzad a ven, chodidlo otoč do směru kroku a posaď se do této kyčle. Odrazem se vrať.",
      "Step diagonally backward and outward, turn the stepping foot toward travel and sit into that hip. Push back to standing."
    ],
    "wat": [
      "Vol úhel, který dovolí kolenu sledovat chodidlo bez kroucení. Činky nemusí dosáhnout země.",
      "Choose an angle allowing the knee to follow the foot without twisting. Dumbbells need not reach the floor."
    ],
    "pro": [
      "Lehčí: bez činek a menší úhel. Těžší: hlubší kontrolovaný výpad a poté lehká zátěž.",
      "Easier: no dumbbells and a smaller angle. Harder: deeper controlled lunge, then light loading."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_transverse_lunge",
    "ez": null,
    "hd": null,
    "foc": [
      "Vykroč jednou nohou šikmo vzad a ven, chodidlo otoč do směru kroku a posaď se do této kyčle.",
      "Step diagonally backward and outward, turn the stepping foot toward travel and sit into that hip."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Transverse Lunge",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/365/transverse-lunge/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_eight",
    "cz": "Osmička s kettlebellem mezi nohama",
    "en": "Kettlebell Figure Eight",
    "mp": [
      "glu",
      "qua"
    ],
    "ms": [
      "fore",
      "abs"
    ],
    "S": 2,
    "C": 4,
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "family": "hinge",
    "pos": [
      "Stůj široce s měkkými koleny a lehkým kettlebellem v jedné ruce.",
      "Stand wide with soft knees and a light kettlebell in one hand."
    ],
    "exe": [
      "V mírném předklonu předávej kettlebell pod jedním stehnem do druhé ruky a obtáčej jej kolem druhé nohy do osmičky.",
      "In a modest hinge, pass the bell beneath one thigh to the other hand and circle the opposite leg to form a figure eight."
    ],
    "wat": [
      "Předání je pomalé a jisté, mimo chodidla. Neotáčej bedra za zátěží.",
      "Keep hand-offs slow, secure and clear of feet. Avoid twisting the lower back after the weight."
    ],
    "pro": [
      "Lehčí: nácvik bez zátěže nebo předání na místě. Těžší: plynulá osmička při stejné lehké zátěži.",
      "Easier: unloaded rehearsal or stationary hand-offs. Harder: smooth continuous figure eights with the same light bell."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_kb_eight",
    "ez": null,
    "hd": null,
    "foc": [
      "V mírném předklonu předávej kettlebell pod jedním stehnem do druhé ruky a obtáčej jej kolem druhé nohy do osmičky.",
      "In a modest hinge, pass the bell beneath one thigh to the other hand and circle the opposite leg to form a figure eight."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Figure Eight",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_kb_cleanpress",
    "cz": "Přemístění kettlebellu s tlakem pomocí nohou",
    "en": "Kettlebell Clean and Push Press",
    "mp": [
      "glu",
      "sho",
      "tri"
    ],
    "ms": [
      "qua",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "family": "kettlebell_clean",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Připrav jeden kettlebell a pevný postoj. Ovládej přemístění do předního držení.",
      "Prepare one kettlebell and a stable stance, with a reliable clean to rack."
    ],
    "exe": [
      "Přemísti kettlebell z kyčelního švihu k rameni. Z krátkého podřepu využij nohy k tlaku nad hlavu a řízeně vrať do předního držení.",
      "Clean the bell from a hip-driven swing to the shoulder. Use a short dip and leg drive to press overhead, then lower to rack."
    ],
    "wat": [
      "Koule nenaráží do předloktí. Tlak dokonči bez záklonu a bez druhého podřepu.",
      "Avoid banging the forearm. Finish without back arching or a second dip."
    ],
    "pro": [
      "Lehčí: přemístění a tlak trénuj odděleně. Těžší: jejich plynulé spojení a postupný odpor.",
      "Easier: train clean and press separately. Harder: connect them smoothly, then add load."
    ],
    "J": {
      "kyc": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_cleanpress",
    "ez": null,
    "hd": null,
    "foc": [
      "Přemísti kettlebell z kyčelního švihu k rameni.",
      "Clean the bell from a hip-driven swing to the shoulder."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Clean and Press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/383/clean-and-press/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_kb_double_pushpress",
    "cz": "Tlak dvou kettlebellů s pomocí nohou",
    "en": "Double-Kettlebell Push Press",
    "mp": [
      "sho",
      "tri",
      "qua"
    ],
    "ms": [
      "glu",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "family": "press_vertical",
    "tier": "specialist",
    "ez": null,
    "pos": [
      "Drž dva kettlebells v předním držení s lokty blízko žeber.",
      "Hold two kettlebells in rack with elbows near the ribs."
    ],
    "exe": [
      "Krátce podřepni a napnutím nohou pomoz vytlačit obě závaží nad hlavu. Vrať je kontrolovaně k ramenům.",
      "Dip briefly and drive through the legs to press both bells overhead, then lower under control."
    ],
    "wat": [
      "Po odrazu znovu nepodřepávej; tím by vznikl výraz. Zpevnění nesmí nahrazovat záklon.",
      "Do not dip again after driving; that would become a jerk. Avoid using a back arch as bracing."
    ],
    "pro": [
      "Lehčí: lehčí pár a oddělený nácvik podřepu. Těžší: vyšší odpor se stejným souběhem paží.",
      "Easier: lighter bells and separate dip practice. Harder: add resistance with synchronous arms."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_double_pushpress",
    "hd": null,
    "foc": [
      "Krátce podřepni a napnutím nohou pomoz vytlačit obě závaží nad hlavu.",
      "Dip briefly and drive through the legs to press both bells overhead, then lower under control."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Double Push-press",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/384/double-push-press/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_kb_split_jerk",
    "cz": "Výraz dvou kettlebellů do střihu",
    "en": "Double-Kettlebell Split Jerk",
    "mp": [
      "qua",
      "sho",
      "tri"
    ],
    "ms": [
      "glu",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "family": "olympic_clean_jerk",
    "tier": "specialist",
    "ez": "ex26_kb_double_pushpress",
    "pos": [
      "Začni se dvěma lehkými kettlebells v předním držení a volným prostorem kolem.",
      "Begin with two light kettlebells in rack and clear surrounding space."
    ],
    "exe": [
      "Po krátkém podřepu vyraž závaží vzhůru a přesuň nohy do střihu pod pevné paže. Srovnej nohy a vrať závaží k ramenům.",
      "Dip, drive bells upward and split the feet beneath firm overhead arms. Recover the feet before lowering to rack."
    ],
    "wat": [
      "Obě zápěstí a lokty musí závaží bezpečně zajistit. Zadní koleno nezamykej.",
      "Secure both loads through wrists and elbows. Do not lock the rear knee."
    ],
    "pro": [
      "Lehčí: práce nohou bez zátěže nebo push press. Těžší: jistější příjem a postupně vyšší odpor.",
      "Easier: unloaded footwork or push press. Harder: a more secure catch, then gradual loading."
    ],
    "J": {
      "kyc": 2,
      "kol": 2,
      "ram": 3,
      "zap": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_kb_split_jerk",
    "hd": null,
    "foc": [
      "Po krátkém podřepu vyraž závaží vzhůru a přesuň nohy do střihu pod pevné paže.",
      "Dip, drive bells upward and split the feet beneath firm overhead arms."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Push-jerk",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_kb_lowwindmill",
    "cz": "Větrný mlýn s kettlebellem v dolní ruce",
    "en": "Low Kettlebell Windmill",
    "mp": [
      "glu",
      "ham",
      "obl"
    ],
    "ms": [
      "sho"
    ],
    "S": 2,
    "C": 4,
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "family": "loaded_windmill",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Stůj široce, lehký kettlebell drž v dolní ruce před stehnem a druhou paži zvedni.",
      "Stand wide, holding a light bell in the lower hand beside the thigh and raising the other arm."
    ],
    "exe": [
      "Posuň kyčle do strany a veď kettlebell podél vnitřní strany bližší nohy. Hrudník mírně otevři vzhůru a kontrolovaně se narovnej.",
      "Shift hips sideways, lower the bell along the inner leg, open the chest slightly upward and rise under control."
    ],
    "wat": [
      "Zátěž nenutí k hlubšímu úklonu. Hlava může zůstat neutrálně, pokud pohled vzhůru vadí.",
      "Do not let the load force depth. Keep the head neutral if looking up is uncomfortable."
    ],
    "pro": [
      "Lehčí: bez kettlebellu a krátký pohyb. Těžší: větší kontrolovaný rozsah nebo malý nárůst zátěže.",
      "Easier: no bell and a short movement. Harder: larger controlled range or a small load increase."
    ],
    "J": {
      "kyc": 2,
      "ram": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kb_lowwindmill",
    "ez": null,
    "hd": null,
    "foc": [
      "Posuň kyčle do strany a veď kettlebell podél vnitřní strany bližší nohy.",
      "Shift hips sideways, lower the bell along the inner leg, open the chest slightly upward and rise under control."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Low Windmill",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/387/low-windmill/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_kb_stagger_overhead_squat",
    "cz": "Dřep s kettlebellem nad hlavou v posunutém postoji",
    "en": "Staggered Single-Arm Overhead Squat",
    "mp": [
      "qua",
      "glu",
      "sho"
    ],
    "ms": [
      "obl",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "pat": "drep",
    "eq": [
      "zavazi"
    ],
    "family": "squat_overhead",
    "sideMode": "perSide",
    "tier": "specialist",
    "pos": [
      "Drž lehký kettlebell nad jedním ramenem. Stejnostranné chodidlo posuň mírně vpřed, obě opory zůstávají široké.",
      "Hold a light kettlebell overhead and stagger the same-side foot slightly forward with a broad support base."
    ],
    "exe": [
      "Klesej do pohodlného dřepu, horní paži drž svisle a volnou rukou dosahuj k zemi. Hrudník se může mírně otevřít k zatížené straně.",
      "Squat comfortably with the loaded arm vertical and free hand reaching down. Allow a small chest opening toward the loaded side."
    ],
    "wat": [
      "Jde o specializovanou variantu. Hloubka nesmí vynutit ztrátu osy ramene či kolene.",
      "This is a specialist variation. Depth must not force loss of shoulder or knee alignment."
    ],
    "pro": [
      "Lehčí: stejný pohyb s prázdnou rukou a mělkým dřepem. Těžší: postupně rozsah, teprve potom malá zátěž.",
      "Easier: empty hand and shallow squat. Harder: build range before modest loading."
    ],
    "J": {
      "ram": 2,
      "kyc": 2,
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_kb_stagger_overhead_squat",
    "ez": null,
    "hd": null,
    "foc": [
      "Klesej do pohodlného dřepu, horní paži drž svisle a volnou rukou dosahuj k zemi.",
      "Squat comfortably with the loaded arm vertical and free hand reaching down."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Single Arm Overhead Squat",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/393/single-arm-overhead-squat/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_v_raise",
    "cz": "Zdvihy jednoruček do V",
    "en": "Dumbbell V-Raise",
    "mp": [
      "sho"
    ],
    "ms": [
      "tra"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "family": "front_raise",
    "pos": [
      "Stůj vzpřímeně s lehkými jednoručkami před stehny, dlaně pootočené vzhůru.",
      "Stand tall holding light dumbbells in front of thighs with palms angled upward."
    ],
    "exe": [
      "Zvedej paže šikmo vpřed a do stran do tvaru V přibližně do výšky ramen. Pomalu spusť.",
      "Raise arms diagonally forward and outward into a V toward shoulder height, then lower slowly."
    ],
    "wat": [
      "Paže drž mírně pokrčené a nešvihej trupem.",
      "Keep elbows soft and avoid swinging the trunk."
    ],
    "pro": [
      "Lehčí: menší zátěž a nižší zdvih. Těžší: pomalý návrat nebo malé přidání odporu.",
      "Easier: lighter load and lower lift. Harder: slower lowering or a small load increase."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_v_raise",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedej paže šikmo vpřed a do stran do tvaru V přibližně do výšky ramen.",
      "Raise arms diagonally forward and outward into a V toward shoulder height, then lower slowly."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "V-raise",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/370/v-raise/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_diagonal_raise",
    "cz": "Diagonální zdvih jednoručky přes tělo",
    "en": "Single-Arm Diagonal Raise",
    "mp": [
      "sho"
    ],
    "ms": [
      "tra"
    ],
    "S": 2,
    "C": 2,
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "family": "front_raise",
    "sideMode": "perSide",
    "pos": [
      "Drž lehkou jednoručku před opačným stehnem, loket mírně pokrčený.",
      "Hold a light dumbbell in front of the opposite thigh with a soft elbow."
    ],
    "exe": [
      "Veď paži šikmo přes tělo ven a vzhůru přibližně do výšky ramene. Vracej po stejné dráze.",
      "Sweep diagonally across and outward toward shoulder height, then return along the same path."
    ],
    "wat": [
      "Trup se neotáčí za činkou. Pohyb nesmí rameno skřípat.",
      "Do not rotate the trunk after the dumbbell or force a pinching shoulder range."
    ],
    "pro": [
      "Lehčí: krátká diagonála bez zátěže. Těžší: větší pohodlná dráha a poté malý odpor.",
      "Easier: a short unloaded diagonal. Harder: larger comfortable range, then modest load."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_diagonal_raise",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď paži šikmo přes tělo ven a vzhůru přibližně do výšky ramene.",
      "Sweep diagonally across and outward toward shoulder height, then return along the same path."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Diagonal Raise",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/371/diagonal-raise/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_rope_lunge",
    "cz": "Vlny lanem s výpady vzad",
    "en": "Battle-Rope Waves with Reverse Lunges",
    "mp": [
      "sho",
      "qua",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 3,
    "C": 4,
    "pat": "prenos",
    "eq": [
      "lano",
      "prostor"
    ],
    "family": "rope_wave",
    "measurementType": "DURATION",
    "load": "none",
    "tier": "specialist",
    "pos": [
      "Drž oba konce bezpečně ukotveného bojového lana v mírném podřepu.",
      "Hold both ends of a securely anchored battle rope in a shallow stance."
    ],
    "exe": [
      "Vytvářej souběžné vlny oběma pažemi a současně střídej výpady vzad. Mezi výpady obnov stabilní postoj.",
      "Create simultaneous arm waves while alternating reverse lunges, restoring a stable stance between steps."
    ],
    "wat": [
      "Lano neomotávej kolem rukou. Rytmus má dovolovat jistý došlap.",
      "Do not wrap rope around the hands. Keep a rhythm allowing secure foot placement."
    ],
    "pro": [
      "Lehčí: vlny a výpady odděleně. Těžší: plynulejší spojení v krátkém úseku.",
      "Easier: practise waves and lunges separately. Harder: connect them smoothly in a short interval."
    ],
    "J": {
      "ram": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "sessionRole": "conditioning",
    "goalRole": "conditioning",
    "genRule": "explicit",
    "variantKey": "ex26_rope_lunge",
    "ez": null,
    "hd": null,
    "foc": [
      "Vytvářej souběžné vlny oběma pažemi a současně střídej výpady vzad.",
      "Create simultaneous arm waves while alternating reverse lunges, restoring a stable stance between steps."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Simultaneous Wave with Reverse Lunges",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/375/simultaneous-wave-with-reverse-lunges/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_rope_lateral",
    "cz": "Boční vlny bojovým lanem",
    "en": "Lateral Battle-Rope Waves",
    "mp": [
      "sho",
      "obl"
    ],
    "ms": [
      "abs",
      "glu"
    ],
    "S": 2,
    "C": 3,
    "pat": "stred",
    "eq": [
      "lano",
      "prostor"
    ],
    "family": "rope_wave",
    "measurementType": "DURATION",
    "load": "none",
    "pos": [
      "Stůj široce s pokrčenými kyčlemi a koleny, v každé ruce konec ukotveného lana.",
      "Stand wide with bent hips and knees, holding each end of an anchored rope."
    ],
    "exe": [
      "Pohybuj oběma konci ze strany na stranu, aby vlny běžely po zemi směrem ke kotvě.",
      "Sweep both ends side to side, sending horizontal waves along the floor toward the anchor."
    ],
    "wat": [
      "Pohyb sdílejí paže, hrudník a kyčle. Nešvihej pouze bedry.",
      "Share movement through arms, chest and hips rather than whipping only the lower back."
    ],
    "pro": [
      "Lehčí: pomalejší menší vlny. Těžší: souvislejší rytmus nebo krátce větší amplituda.",
      "Easier: smaller slower waves. Harder: more continuous rhythm or briefly larger amplitude."
    ],
    "J": {
      "ram": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "conditioning",
    "goalRole": "conditioning",
    "genRule": "explicit",
    "variantKey": "ex26_rope_lateral",
    "ez": null,
    "hd": null,
    "foc": [
      "Pohybuj oběma konci ze strany na stranu, aby vlny běžely po zemi směrem ke kotvě.",
      "Sweep both ends side to side, sending horizontal waves along the floor toward the anchor."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Lateral Waves",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/377/lateral-waves/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_rope_rotation",
    "cz": "Kruhové vlny bojovým lanem",
    "en": "Outward Circular Battle-Rope Waves",
    "mp": [
      "sho"
    ],
    "ms": [
      "abs",
      "fore"
    ],
    "S": 2,
    "C": 3,
    "pat": "tlak",
    "eq": [
      "lano",
      "prostor"
    ],
    "family": "rope_wave",
    "measurementType": "DURATION",
    "load": "none",
    "pos": [
      "Uchop konce ukotveného lana v mírném podřepu, lokty měkce pokrčené.",
      "Hold anchored rope ends in a shallow stance with softly bent elbows."
    ],
    "exe": [
      "Oběma rukama opisuj malé kruhy ven, pravou a levou v opačném směru. Udrž vlny až ke kotvě.",
      "Draw small outward circles with both hands in opposite directions, keeping waves travelling toward the anchor."
    ],
    "wat": [
      "Kruhy nevytvářej záklonem nebo zvedáním celého trupu.",
      "Avoid using back extension or whole-body heaving to create circles."
    ],
    "pro": [
      "Lehčí: menší kruhy a kratší úsek. Těžší: plynulý rytmus nebo o něco větší kruh.",
      "Easier: smaller circles and shorter intervals. Harder: continuous rhythm or a slightly larger circle."
    ],
    "J": {
      "ram": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "conditioning",
    "goalRole": "conditioning",
    "genRule": "explicit",
    "variantKey": "ex26_rope_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Oběma rukama opisuj malé kruhy ven, pravou a levou v opačném směru.",
      "Draw small outward circles with both hands in opposite directions, keeping waves travelling toward the anchor."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Double Rotation Waves",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/378/double-rotation-waves/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_chin_tuck",
    "cz": "Zasunutí brady vsedě",
    "en": "Seated Chin Retraction",
    "mp": [
      "neck"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "pat": "krk",
    "eq": [
      "telo"
    ],
    "family": "neck_control",
    "load": "none",
    "pos": [
      "Sedni vzpřímeně, oči vodorovně a čelist uvolněná.",
      "Sit upright with eyes level and jaw relaxed."
    ],
    "exe": [
      "Posuň bradu jemně dozadu, jako by se hlava zasouvala po vodorovné kolejnici. Krátce podrž a povol.",
      "Slide the chin gently backward along a horizontal line, pause briefly and release."
    ],
    "wat": [
      "Neskláněj bradu k hrudníku ani netlač silou. Při závrati pohyb přeruš.",
      "Do not tip the chin toward the chest or force pressure. Stop if dizziness occurs."
    ],
    "pro": [
      "Lehčí: menší posun s opřenými zády. Těžší: krátká klidná výdrž bez napínání čelisti.",
      "Easier: smaller motion with supported back. Harder: a brief quiet hold without jaw tension."
    ],
    "J": {
      "krk": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_chin_tuck",
    "ez": null,
    "hd": null,
    "foc": [
      "Posuň bradu jemně dozadu, jako by se hlava zasouvala po vodorovné kolejnici.",
      "Slide the chin gently backward along a horizontal line, pause briefly and release."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Neck exercises and advice — Chin retraction",
      "url": "https://www.cuh.nhs.uk/patient-information/neck-exercises-and-advice/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_paced_breath",
    "cz": "Klidný dech s plynulým počítáním",
    "en": "Comfortable Paced Breathing",
    "mp": [
      "abs"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "pat": "dech",
    "eq": [
      "telo"
    ],
    "family": "breathing",
    "load": "none",
    "measurementType": "DURATION",
    "pos": [
      "Sedni s opřenými zády a chodidly na zemi. Uvolni oděv, který omezuje dech.",
      "Sit with back supported and feet grounded, loosening restrictive clothing."
    ],
    "exe": [
      "Nadechuj se jemně nosem a plynule vydechuj. Pokud je to příjemné, počítej při nádechu i výdechu stejně, například do čtyř.",
      "Inhale gently through the nose and exhale smoothly. If comfortable, use equal counts, such as four in and four out."
    ],
    "wat": [
      "Dech neprohlubuj násilně a nevkládej zádrže. Při motání hlavy vrať přirozený rytmus.",
      "Do not force depth or add breath holds. Return to natural breathing if light-headed."
    ],
    "pro": [
      "Lehčí: bez počítání. Těžší: delší klidná praxe, nikoli delší nádech za cenu nepohody.",
      "Easier: omit counting. Harder: extend comfortable practice rather than forcing longer breaths."
    ],
    "J": {},
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_paced_breath",
    "ez": null,
    "hd": null,
    "foc": [
      "Nadechuj se jemně nosem a plynule vydechuj.",
      "Inhale gently through the nose and exhale smoothly."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Breathing exercises for stress",
      "url": "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_heel_pull",
    "cz": "Odlepení pat od zdi ve stojce",
    "en": "Back-to-Wall Handstand Heel Pull",
    "mp": [
      "sho",
      "fore"
    ],
    "ms": [
      "abs",
      "serr"
    ],
    "S": 3,
    "C": 4,
    "pat": "obrat",
    "eq": [
      "zed"
    ],
    "family": "handstand_balance",
    "load": "none",
    "tier": "specialist",
    "ez": "wallhs",
    "hd": "handstand",
    "pos": [
      "Zaujmi stojku zády ke zdi s lehkým dotykem pat. Předem ovládej bezpečný sestup.",
      "Enter a back-to-wall handstand with light heel contact and a reliable safe exit."
    ],
    "exe": [
      "Zatlač prsty do podlahy, až se paty jemně odlepí. Krátce hledej rovnováhu a řízeně vrať kontakt nebo sestup.",
      "Press fingertips into the floor until heels float away. Balance briefly, then restore contact gently or exit."
    ],
    "wat": [
      "Neodrážej se patami a neohýbej lokty. Zpočátku pracuj s trenérem nebo jistícím partnerem.",
      "Do not push off with heels or bend elbows. Initially use a coach or competent spotter."
    ],
    "pro": [
      "Lehčí: jen postupně odlehčuj paty. Těžší: delší klidné vyvážení a kontrolovaný návrat ke zdi.",
      "Easier: gradually reduce heel pressure. Harder: longer quiet balance and controlled wall return."
    ],
    "J": {
      "zap": 2,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_heel_pull",
    "foc": [
      "Zatlač prsty do podlahy, až se paty jemně odlepí.",
      "Press fingertips into the floor until heels float away."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "The Hand that Balances — Heel Pull Corrections",
      "url": "https://handstandfactory.com/articles/hand/"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_toe_pull",
    "cz": "Odlepení špiček od zdi ve stojce",
    "en": "Chest-to-Wall Handstand Toe Pull",
    "mp": [
      "sho",
      "fore"
    ],
    "ms": [
      "abs",
      "serr"
    ],
    "S": 3,
    "C": 4,
    "pat": "obrat",
    "eq": [
      "zed"
    ],
    "family": "handstand_balance",
    "load": "none",
    "tier": "specialist",
    "ez": "ctwhs",
    "hd": "handstand",
    "pos": [
      "Ve stojce čelem ke zdi nech špičky jen lehce opřené. Použij vzdálenost dovolující bezpečný výstup do strany.",
      "In a chest-to-wall handstand, keep only light toe contact and enough space for a safe side exit."
    ],
    "exe": [
      "Drobným řízeným přesunem ramen odlehči špičky, potom srovnej tělo nad dlaně a na okamžik vyvaž. Vrať jemný kontakt.",
      "Use a small controlled shoulder shift to unweight toes, then align the body over the palms and balance briefly before restoring light contact."
    ],
    "wat": [
      "Neskákej od zdi a nezalamuj bedra. Bez zvládnutého sestupu zůstaň u opory.",
      "Do not kick away or hinge through the lower back. Keep wall support until the exit is reliable."
    ],
    "pro": [
      "Lehčí: odlehči jednu špičku při druhé opřené. Těžší: krátce odlep obě a kontrolovaně se vrať.",
      "Easier: unweight one toe while the other remains supported. Harder: briefly float both and return under control."
    ],
    "J": {
      "zap": 2,
      "ram": 2
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_toe_pull",
    "foc": [
      "Drobným řízeným přesunem ramen odlehči špičky, potom srovnej tělo nad dlaně a na okamžik vyvaž.",
      "Use a small controlled shoulder shift to unweight toes, then align the body over the palms and balance briefly before restoring light contact."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Emmet Louis — How to Balance a Handstand: Toe pulls",
      "url": "https://www.youtube.com/watch?v=J9-7QXCsPL0"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_towel_curl",
    "cz": "Shrnování ručníku prsty nohy",
    "en": "Toe Towel Curl",
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "family": "foot_control",
    "sideMode": "perSide",
    "load": "none",
    "pos": [
      "Sedni na židli, patu polož na zem a přední část chodidla na malý ručník.",
      "Sit with heel grounded and forefoot on a small towel."
    ],
    "exe": [
      "Pokrčením prstů přitahuj látku pod chodidlo a znovu prsty uvolni.",
      "Curl toes to gather the fabric beneath the foot, then release them."
    ],
    "wat": [
      "Pata zůstává na místě. Při křeči povol a zmenši úsilí.",
      "Keep the heel still. Release and reduce effort if cramping occurs."
    ],
    "pro": [
      "Lehčí: menší kus látky bez odporu. Těžší: delší shrnutí při stejném klidném kotníku.",
      "Easier: a smaller loose towel. Harder: gather farther while keeping the ankle quiet."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_towel_curl",
    "ez": null,
    "hd": null,
    "foc": [
      "Pokrčením prstů přitahuj látku pod chodidlo a znovu prsty uvolni.",
      "Curl toes to gather the fabric beneath the foot, then release them."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Foot and Ankle Conditioning Program",
      "url": "https://orthoinfo.aaos.org/globalassets/pdfs/2022-rehab_foot-and-ankle_final.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_marble_pickup",
    "cz": "Sbírání předmětů prsty nohy",
    "en": "Toe Object Pickup",
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "family": "foot_control",
    "sideMode": "perSide",
    "load": "none",
    "pos": [
      "Vsedě polož před chodidlo několik vatových kuliček a misku.",
      "While seated, place a few cotton balls and a bowl near the foot."
    ],
    "exe": [
      "Uchop jeden předmět prsty nohy, lehce jej zvedni a pusť do misky.",
      "Grasp one object with the toes, lift slightly and release into the bowl."
    ],
    "wat": [
      "Nedosahuj daleko a nepřetáčej kotník násilím. Malé předměty udrž mimo dosah dětí.",
      "Avoid reaching far or forcing ankle rotation. Keep small objects away from children."
    ],
    "pro": [
      "Lehčí: větší měkký předmět. Těžší: menší předměty s přesným uvolněním.",
      "Easier: larger soft objects. Harder: smaller objects with precise release."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_marble_pickup",
    "ez": null,
    "hd": null,
    "foc": [
      "Uchop jeden předmět prsty nohy, lehce jej zvedni a pusť do misky.",
      "Grasp one object with the toes, lift slightly and release into the bowl."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Foot and Ankle Conditioning Program",
      "url": "https://orthoinfo.aaos.org/globalassets/pdfs/2022-rehab_foot-and-ankle_final.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_band_inversion",
    "cz": "Přitažení chodidla dovnitř proti gumě",
    "en": "Resisted Ankle Inversion",
    "mp": [
      "tibpost"
    ],
    "ms": [
      "foot"
    ],
    "S": 1,
    "C": 2,
    "pat": "mobilita",
    "eq": [
      "guma"
    ],
    "family": "ankle_control",
    "sideMode": "perSide",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Vsedě podepři bérec a obepni přední část chodidla gumou, která táhne z vnější strany.",
      "Sit with the lower leg supported and a band around the forefoot pulling from the outer side."
    ],
    "exe": [
      "Otoč plosku mírně dovnitř proti odporu a pomalu vrať. Koleno zůstává klidné.",
      "Turn the sole gently inward against resistance and return slowly, keeping the knee still."
    ],
    "wat": [
      "Pohyb vychází z kotníku, ne z celé kyčle. Nepřetahuj bolestivou krajní polohu.",
      "Move at the ankle rather than the whole hip. Avoid a painful end range."
    ],
    "pro": [
      "Lehčí: bez gumy. Těžší: mírně pevnější guma při stejném kontrolovaném rozsahu.",
      "Easier: no band. Harder: a slightly stronger band through the same controlled range."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_band_inversion",
    "ez": null,
    "hd": null,
    "foc": [
      "Otoč plosku mírně dovnitř proti odporu a pomalu vrať.",
      "Turn the sole gently inward against resistance and return slowly, keeping the knee still."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Ankle Exercise Programme — resisted ankle movements",
      "url": "https://www.uhd.nhs.uk/uploads/about/docs/our_publications/patient_information_leaflets/Childrens_therapy/Childrens_physiotherapy/Ankle_basic_strengthening_programme_updated_2019.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_band_eversion",
    "cz": "Vytočení chodidla ven proti gumě",
    "en": "Resisted Ankle Eversion",
    "mp": [
      "fib"
    ],
    "ms": [
      "foot"
    ],
    "S": 1,
    "C": 2,
    "pat": "mobilita",
    "eq": [
      "guma"
    ],
    "family": "ankle_control",
    "sideMode": "perSide",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Podepři bérec v sedu a gumu obepni kolem přední části chodidla s tahem z vnitřní strany.",
      "Support the lower leg while seated and loop a band around the forefoot pulling from the inner side."
    ],
    "exe": [
      "Vytoč přední část chodidla ven proti gumě a plynule vrať.",
      "Turn the forefoot outward against the band and return smoothly."
    ],
    "wat": [
      "Koleno a stehno se neotáčejí. Drž malý rozsah bez škubnutí.",
      "Keep knee and thigh from rotating. Use a small range without jerking."
    ],
    "pro": [
      "Lehčí: volnější guma nebo bez odporu. Těžší: pomalejší návrat či o něco větší odpor.",
      "Easier: looser band or no resistance. Harder: slower return or slightly more resistance."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_band_eversion",
    "ez": null,
    "hd": null,
    "foc": [
      "Vytoč přední část chodidla ven proti gumě a plynule vrať.",
      "Turn the forefoot outward against the band and return smoothly."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Ankle Exercise Programme — resisted ankle movements",
      "url": "https://www.uhd.nhs.uk/uploads/about/docs/our_publications/patient_information_leaflets/Childrens_therapy/Childrens_physiotherapy/Ankle_basic_strengthening_programme_updated_2019.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_band_dorsiflex",
    "cz": "Přitažení špičky proti gumě",
    "en": "Resisted Ankle Dorsiflexion",
    "mp": [
      "tib"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "pat": "mobilita",
    "eq": [
      "guma"
    ],
    "family": "ankle_control",
    "sideMode": "perSide",
    "load": "none",
    "measurementType": "REPS_ONLY",
    "pos": [
      "Vsedě podepři patu. Guma přes nárt vede k pevnému kotvení před chodidlem.",
      "Sit with heel supported and a band over the forefoot anchored securely in front."
    ],
    "exe": [
      "Přitáhni nárt a špičku k bérci proti odporu. Vrať se pomalu, bez povolení celé nohy.",
      "Draw the forefoot toward the shin against resistance, then return slowly without moving the whole leg."
    ],
    "wat": [
      "Guma nesmí sklouznout k obličeji. Prsty drž uvolněné a soustřeď pohyb do kotníku.",
      "Keep the band secure against slipping toward the face. Relax toes and move through the ankle."
    ],
    "pro": [
      "Lehčí: menší odpor. Těžší: pomalý návrat a mírně pevnější guma.",
      "Easier: less resistance. Harder: slow lowering and a modestly stronger band."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_band_dorsiflex",
    "ez": null,
    "hd": null,
    "foc": [
      "Přitáhni nárt a špičku k bérci proti odporu.",
      "Draw the forefoot toward the shin against resistance, then return slowly without moving the whole leg."
    ],
    "source": {
      "author": "Exercise technique reference",
      "document": "Ankle Exercise Programme — resisted ankle movements",
      "url": "https://www.uhd.nhs.uk/uploads/about/docs/our_publications/patient_information_leaflets/Childrens_therapy/Childrens_physiotherapy/Ankle_basic_strengthening_programme_updated_2019.pdf"
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_py_pogo_forward",
    "cz": "Nízké pružné odrazy snožmo vpřed",
    "en": "Forward Traveling Pogos",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "ankle_hop",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_pogo",
    "pos": [
      "Postav se na začátek volné rovné dráhy, chodidla pod boky.",
      "Stand at the start of a clear level lane, feet under hips."
    ],
    "exe": [
      "Nízkými odrazy snožmo postupuj vpřed. Kotníky pruží, kolena zůstávají měkká a trup vzpřímený.",
      "Travel forward using low two-foot rebounds. Let ankles spring, knees stay soft and trunk upright."
    ],
    "wat": [
      "Začni několika kontakty; ukonči sérii, když dopady ztěžknou. Neskákej na tvrdém betonu.",
      "Begin with a few contacts and stop when landings become heavy. Avoid hard concrete."
    ],
    "pro": [
      "Lehčí: odrazy na místě. Těžší: plynulý posun jednou nohou až po zvládnutí oboustranné verze.",
      "Easier: rebound in place. Harder: travel on one leg after mastering the bilateral version."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_pogo_forward",
    "hd": null,
    "foc": [
      "Nízkými odrazy snožmo postupuj vpřed.",
      "Travel forward using low two-foot rebounds."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_pogo_backward",
    "cz": "Nízké pružné odrazy snožmo vzad",
    "en": "Backward Traveling Pogos",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "ankle_hop",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_pogo_forward",
    "pos": [
      "Zkontroluj prostor za sebou a postav se zády ke krátké volné dráze.",
      "Check behind you and stand with your back toward a short clear lane."
    ],
    "exe": [
      "Malými odrazy snožmo se posouvej vzad, chodidla při každém kontaktu vracej pod tělo.",
      "Travel backward with small two-foot rebounds, returning feet under the body at each contact."
    ],
    "wat": [
      "Nezakláněj se a nesnaž se dosáhnout chodidly daleko za sebe.",
      "Do not lean backward or reach the feet far behind you."
    ],
    "pro": [
      "Lehčí: jeden odraz vzad se zastavením. Těžší: spoj krátkou sérii bez ztráty rytmu.",
      "Easier: one backward hop and stop. Harder: link a short series without losing rhythm."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_pogo_backward",
    "hd": null,
    "foc": [
      "Malými odrazy snožmo se posouvej vzad, chodidla při každém kontaktu vracej pod tělo.",
      "Travel backward with small two-foot rebounds, returning feet under the body at each contact."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_pogo_lateral",
    "cz": "Pružné odrazy snožmo s bočním posunem",
    "en": "Lateral Traveling Pogos",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_lateral_linehop",
    "pos": [
      "Postav se bokem k volné dráze, chodidla pod boky.",
      "Stand sideways to a clear lane, feet under hips."
    ],
    "exe": [
      "Nízkými odrazy snožmo postupuj stále stejným směrem do strany. Po sérii odpočiň a vrať se opačně.",
      "Use low two-foot rebounds to travel continuously sideways. Rest before returning in the other direction."
    ],
    "wat": [
      "Chodidla nekřiž a nedopadej na vnější hrany.",
      "Do not cross the feet or land on their outer edges."
    ],
    "pro": [
      "Lehčí: boční krok s výponem. Těžší: o něco rychlejší kontakty při stejné nízké výšce.",
      "Easier: side-step and calf raise. Harder: slightly quicker contacts at the same low height."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_pogo_lateral",
    "hd": null,
    "foc": [
      "Nízkými odrazy snožmo postupuj stále stejným směrem do strany.",
      "Use low two-foot rebounds to travel continuously sideways."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_single_pogo_forward",
    "cz": "Pružné poskoky jednou nohou vpřed",
    "en": "Single-Leg Forward Pogos",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "ankle_hop",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_single_pogo",
    "pos": [
      "Stůj na jedné noze, druhou lehce pokrč a drž volně.",
      "Stand on one leg with the other lightly bent and relaxed."
    ],
    "exe": [
      "Proveď několik nízkých pružných poskoků vpřed na stejné noze. Paže pomáhají udržet rytmus.",
      "Perform a few low springy hops forward on the same leg, using arms for rhythm."
    ],
    "wat": [
      "Pánev nesmí při dopadu výrazně padat do strany; při ztrátě kontroly došlápni druhou nohou.",
      "Avoid a pronounced pelvic drop; put the other foot down if control is lost."
    ],
    "pro": [
      "Lehčí: poskok na místě nebo snožmo. Těžší: navazuj více kvalitních kontaktů, teprve pak prodlužuj posun.",
      "Easier: hop in place or use both legs. Harder: link more controlled contacts before increasing travel."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_single_pogo_forward",
    "hd": null,
    "foc": [
      "Proveď několik nízkých pružných poskoků vpřed na stejné noze.",
      "Perform a few low springy hops forward on the same leg, using arms for rhythm."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_single_pogo_backward",
    "cz": "Pružné poskoky jednou nohou vzad",
    "en": "Single-Leg Backward Pogos",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "ankle_hop",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_py_single_pogo_forward",
    "pos": [
      "Stůj na jedné noze před předem zkontrolovanou volnou plochou za sebou.",
      "Balance on one leg with a checked clear area behind you."
    ],
    "exe": [
      "Posuň se krátkými nízkými odrazy vzad na stejné noze. Udržuj trup nad místem opory.",
      "Move backward with short low hops on the same foot, keeping the trunk over support."
    ],
    "wat": [
      "Neotáčej hlavu během odrazu a neprodlužuj skok na úkor rovnováhy.",
      "Do not turn the head during takeoff or lengthen hops at the expense of balance."
    ],
    "pro": [
      "Lehčí: jednotlivý odraz a stabilizace. Těžší: plynulá krátká série při stejném směru chodidla.",
      "Easier: one hop and stabilize. Harder: a short continuous series with consistent foot orientation."
    ],
    "J": {
      "kot": 2,
      "kol": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_single_pogo_backward",
    "hd": null,
    "foc": [
      "Posuň se krátkými nízkými odrazy vzad na stejné noze.",
      "Move backward with short low hops on the same foot, keeping the trunk over support."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hop_lateral_out",
    "cz": "Boční poskoky na vnější stranu stojné nohy",
    "en": "Single-Leg Lateral Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_single_pogo",
    "pos": [
      "Stůj na pravé noze pro pohyb doprava nebo na levé pro pohyb doleva.",
      "Stand on the right foot to travel right, or left foot to travel left."
    ],
    "exe": [
      "Několika krátkými odrazy se posouvej ven od osy těla. Dopadej stále na stejnou nohu.",
      "Use a few short hops to travel outward from the body midline, landing on the same foot."
    ],
    "wat": [
      "Koleno veď ve směru chodidla a vyhni se dopadu na hranu boty.",
      "Track the knee with the foot and avoid landing on the shoe edge."
    ],
    "pro": [
      "Lehčí: odraz do strany se zastavením a přiložením druhé nohy. Těžší: spoj kontakty při stejné malé vzdálenosti.",
      "Easier: hop sideways, stop and add the other foot. Harder: connect contacts over the same small distance."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hop_lateral_out",
    "hd": null,
    "foc": [
      "Několika krátkými odrazy se posouvej ven od osy těla.",
      "Use a few short hops to travel outward from the body midline, landing on the same foot."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hop_medial_in",
    "cz": "Poskoky dovnitř na jedné noze",
    "en": "Single-Leg Medial Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_single_pogo",
    "pos": [
      "Stůj na pravé noze pro pohyb doleva; volnou nohu drž mimo dráhu dopadu.",
      "Stand on the right foot to move left; keep the free leg clear of the landing path."
    ],
    "exe": [
      "Odrážej se krátce směrem přes osu těla a dopadej na stejnou nohu. Trup se přesouvá spolu s pánví.",
      "Hop a short distance toward the body midline and land on the same foot, moving trunk and pelvis together."
    ],
    "wat": [
      "Nenech koleno propadnout dovnitř vůči chodidlu. Pohyb dovnitř neznamená vbočení kolena.",
      "Do not let the knee collapse inward relative to the foot. Medial travel does not mean knee valgus."
    ],
    "pro": [
      "Lehčí: jediný malý poskok a výdrž. Těžší: dva až tři navázané odrazy bez ztráty osy.",
      "Easier: one small hop and hold. Harder: two or three connected hops without losing alignment."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hop_medial_in",
    "hd": null,
    "foc": [
      "Odrážej se krátce směrem přes osu těla a dopadej na stejnou nohu.",
      "Hop a short distance toward the body midline and land on the same foot, moving trunk and pelvis together."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_ankling",
    "cz": "Kotníkové odrazy ve střídavém běžeckém rytmu",
    "en": "Traveling Ankling",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "run_drill",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_a_march",
    "pos": [
      "Postav se vzpřímeně na začátek krátké dráhy.",
      "Stand tall at the beginning of a short lane."
    ],
    "exe": [
      "Střídej malé pružné kontakty chodidel pod tělem a postupuj vpřed. Kolena zvedej jen nízko, kotník před kontaktem aktivně připrav.",
      "Alternate small springy foot contacts beneath the body while moving forward. Keep knee lift low and prepare the ankle before contact."
    ],
    "wat": [
      "Nedělej dlouhé kroky před těžiště a nezatínej ramena.",
      "Avoid long reaching steps ahead of your centre of mass and tense shoulders."
    ],
    "pro": [
      "Lehčí: pomalá kotníková chůze. Těžší: plynulejší rytmus a následný přechod do lehkého běhu.",
      "Easier: slow ankle-focused walking. Harder: smoother rhythm followed by an easy run."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_ankling",
    "hd": null,
    "foc": [
      "Střídej malé pružné kontakty chodidel pod tělem a postupuj vpřed.",
      "Alternate small springy foot contacts beneath the body while moving forward."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_skip_distance",
    "cz": "Odrazový skipping do dálky",
    "en": "Power Skip for Distance",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "run_drill",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_a_skip",
    "pos": [
      "Začni lehkým krokem, paže připrav jako při běhu.",
      "Begin with an easy step and running arm action."
    ],
    "exe": [
      "Proveď krok a výraznější odraz na stejné noze, dopadni na ni a přejdi na druhou. Posouvej se vpřed v rytmu krok–poskok.",
      "Step and drive into a stronger hop on that foot, land on it and switch. Travel in a step-hop rhythm."
    ],
    "wat": [
      "Délku vytvářej odrazem, ne natažením nohy daleko před tělo.",
      "Create distance through push-off rather than reaching the foot far ahead."
    ],
    "pro": [
      "Lehčí: běžný A-skip. Těžší: delší let při zachování pružného kontaktu a stejného rytmu.",
      "Easier: ordinary A-skip. Harder: longer flight while preserving springy contacts and rhythm."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_skip_distance",
    "hd": null,
    "foc": [
      "Proveď krok a výraznější odraz na stejné noze, dopadni na ni a přejdi na druhou.",
      "Step and drive into a stronger hop on that foot, land on it and switch."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_skip_height",
    "cz": "Odrazový skipping do výšky s postupem vpřed",
    "en": "Power Skip for Height",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "run_drill",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_a_skip",
    "pos": [
      "Na volné dráze začni pravidelným skippingem.",
      "Start with rhythmic skipping along a clear lane."
    ],
    "exe": [
      "Po každém kroku se odraz výrazněji vzhůru, volné koleno zvedni před sebe. Dopadni na odrazovou nohu a vystřídej strany.",
      "After each step, drive upward and lift the free knee. Land on the takeoff foot, then change sides."
    ],
    "wat": [
      "Zůstaň vysoký přes trup; koleno netahej k hrudi zakulacením zad.",
      "Keep the trunk tall rather than rounding the back to pull the knee upward."
    ],
    "pro": [
      "Lehčí: nízký skipping. Těžší: vyšší odraz při stejném krátkém posunu vpřed.",
      "Easier: low skipping. Harder: more height while keeping forward travel modest."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_skip_height",
    "hd": null,
    "foc": [
      "Po každém kroku se odraz výrazněji vzhůru, volné koleno zvedni před sebe.",
      "After each step, drive upward and lift the free knee."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_skip_backward",
    "cz": "Skipping s posunem vzad",
    "en": "Backward Skip",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "run_drill",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_a_skip",
    "pos": [
      "Předem zkontroluj dráhu za sebou a začni malými kroky vzad.",
      "Check the lane behind you and begin with small backward steps."
    ],
    "exe": [
      "Přidej nízký poskok na každé stojné noze a střídavě postupuj vzad v rytmu krok–poskok.",
      "Add a low hop on each supporting leg and alternate backward in a step-hop rhythm."
    ],
    "wat": [
      "Neskláněj hlavu k chodidlům a drž kroky krátké.",
      "Do not look down at the feet; keep steps short."
    ],
    "pro": [
      "Lehčí: chůze vzad s výponem. Těžší: plynulý rytmus bez přestávek mezi stranami.",
      "Easier: backward walking with a calf raise. Harder: continuous rhythm between sides."
    ],
    "J": {
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_skip_backward",
    "hd": null,
    "foc": [
      "Přidej nízký poskok na každé stojné noze a střídavě postupuj vzad v rytmu krok–poskok.",
      "Add a low hop on each supporting leg and alternate backward in a step-hop rhythm."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_skip_lateral",
    "cz": "Skipping bokem bez křížení nohou",
    "en": "Lateral Skip",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_lateral_shuffle",
    "pos": [
      "Postav se bokem ke směru pohybu, kolena mírně pokrč.",
      "Stand sideways to the travel direction with soft knees."
    ],
    "exe": [
      "Udělej boční krok a nízký odraz, druhou nohu přisuň bez křížení. Pokračuj ve stejném směru a pak vystřídej strany.",
      "Take a side step and low hop, bringing the trailing foot closer without crossing. Continue and then switch directions."
    ],
    "wat": [
      "Pánev i hrudník míří stále vpřed; neotáčej z drilu boční běh.",
      "Keep hips and chest facing forward rather than turning into a sideways run."
    ],
    "pro": [
      "Lehčí: boční přísuny bez letu. Těžší: plynulejší odrazový rytmus se stejnou orientací trupu.",
      "Easier: side steps without flight. Harder: a smoother rebound rhythm with the same trunk orientation."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_skip_lateral",
    "hd": null,
    "foc": [
      "Udělej boční krok a nízký odraz, druhou nohu přisuň bez křížení.",
      "Take a side step and low hop, bringing the trailing foot closer without crossing."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_straight_bound",
    "cz": "Odrazy vpřed s téměř nataženými koleny",
    "en": "Straight-Leg Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_ankling",
    "pos": [
      "Stůj vzpřímeně a začni několika lehkými kroky.",
      "Stand tall and begin with a few easy steps."
    ],
    "exe": [
      "Střídej pružné odrazy vpřed s malým ohnutím kolen. Nohu veď z kyčle a kontakt směřuj pod tělo.",
      "Alternate springy forward bounds with only a small knee bend. Move from the hip and aim contact beneath the body."
    ],
    "wat": [
      "Kolena nezamykej a nepřeháněj předkopnutí.",
      "Do not lock the knees or exaggerate the forward kick."
    ],
    "pro": [
      "Lehčí: kotníkové odrazy s krátkým krokem. Těžší: o něco delší pružný odraz při stejné kontrole trupu.",
      "Easier: short-step ankling. Harder: a slightly longer springy bound with the same trunk control."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_straight_bound",
    "hd": null,
    "foc": [
      "Střídej pružné odrazy vpřed s malým ohnutím kolen.",
      "Alternate springy forward bounds with only a small knee bend."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_alternate_bound",
    "cz": "Střídavé odrazy z nohy na nohu vpřed",
    "en": "Alternating Forward Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_skip_distance",
    "pos": [
      "Začni mírným rozběhem nebo krátkým krokem vpřed.",
      "Begin with an easy approach or a short forward step."
    ],
    "exe": [
      "Odrazem jedné nohy přeleť na druhou a hned navazuj dalším odrazem. Paže a koleno volné nohy pracují jako při běhu.",
      "Bound from one leg onto the other and link the next takeoff. Use running arm action and free-knee drive."
    ],
    "wat": [
      "Dopad neumisťuj daleko před pánev. Sérii ukonči ještě před ztrátou pružnosti.",
      "Do not place the landing far ahead of the pelvis. End before springiness fades."
    ],
    "pro": [
      "Lehčí: skipping do dálky. Těžší: navázané odrazy s větší rychlostí přiblížení pod dohledem trenéra.",
      "Easier: distance skipping. Harder: connected bounds from a faster approach under coaching."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_alternate_bound",
    "hd": null,
    "foc": [
      "Odrazem jedné nohy přeleť na druhou a hned navazuj dalším odrazem.",
      "Bound from one leg onto the other and link the next takeoff."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_sameleg_bound",
    "cz": "Navazované skoky vpřed na stejné noze",
    "en": "Repeated Single-Leg Forward Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_single_broad_stick",
    "pos": [
      "Stůj na jedné noze a připrav krátkou rovnou dráhu.",
      "Stand on one leg with a short straight lane prepared."
    ],
    "exe": [
      "Spoj několik odrazů vpřed na stejné noze. Mezi kontakty nohu přirozeně vrať pod pánev, poslední dopad zastav.",
      "Link a few forward hops on the same leg. Recover the foot beneath the pelvis between contacts and stick the last landing."
    ],
    "wat": [
      "Nezačínej maximální vzdáleností. Při propadu pánve nebo zhoršení dopadu sérii přeruš.",
      "Do not start at maximal distance. Stop if pelvic or landing control deteriorates."
    ],
    "pro": [
      "Lehčí: jednotlivý skok s výdrží. Těžší: delší odrazy až při zachování stejné kvality kontaktů.",
      "Easier: isolated hop-and-hold. Harder: longer hops only while preserving contact quality."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_sameleg_bound",
    "hd": null,
    "foc": [
      "Spoj několik odrazů vpřed na stejné noze.",
      "Link a few forward hops on the same leg."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_double_contacts",
    "cz": "Víceskoky v rytmu pravá–pravá–levá–levá",
    "en": "Double-Contact Alternating Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Začni na pravé noze a předem si projdi rytmus bez skoku.",
      "Start on the right leg and rehearse the rhythm without jumping."
    ],
    "exe": [
      "Při posunu vpřed dopadni dvakrát po sobě na pravou a dvakrát na levou. Opakuj krátkou sekvenci, paže pomáhají rytmu.",
      "Travel forward with two successive right-foot contacts, then two left-foot contacts. Repeat a short sequence using arms for rhythm."
    ],
    "wat": [
      "Při změně strany nedělej přídavný mezikrok. Důležitější je rytmus než délka.",
      "Avoid an extra step when changing sides. Rhythm matters more than distance."
    ],
    "pro": [
      "Lehčí: rytmus krokem a nízkými poskoky. Těžší: plynulejší přenos mezi dvojicemi odrazů.",
      "Easier: rehearse with steps and low hops. Harder: smoother transfer between pairs of contacts."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_double_contacts",
    "hd": null,
    "foc": [
      "Při posunu vpřed dopadni dvakrát po sobě na pravou a dvakrát na levou.",
      "Travel forward with two successive right-foot contacts, then two left-foot contacts."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hop_step_jump",
    "cz": "Trojskok z místa: poskok, krok, skok",
    "en": "Standing Hop-Step-Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Stůj s jednou nohou mírně vpředu na pružném neklouzavém povrchu.",
      "Stand with one foot slightly forward on a resilient non-slip surface."
    ],
    "exe": [
      "Odraz se a dopadni na stejnou nohu, dalším odrazem přejdi na opačnou a posledním skoč na obě. Mezi částmi nezastavuj.",
      "Take off and land on the same foot, bound onto the opposite foot, then jump to a two-foot landing without pausing between phases."
    ],
    "wat": [
      "Začni submaximálně; poslední dopad tlum oběma nohama a nepředkopávej násilně paty.",
      "Start below maximum effort; absorb the final landing with both legs and avoid forceful heel reaching."
    ],
    "pro": [
      "Lehčí: projdi pořadí krokem. Těžší: krátký rozběh až po zvládnutí návaznosti z místa.",
      "Easier: walk through the sequence. Harder: add a short approach after mastering the standing sequence."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hop_step_jump",
    "hd": null,
    "foc": [
      "Odraz se a dopadni na stejnou nohu, dalším odrazem přejdi na opačnou a posledním skoč na obě.",
      "Take off and land on the same foot, bound onto the opposite foot, then jump to a two-foot landing without pausing between phases."
    ],
    "source": {
      "author": "UK Athletics",
      "document": "Jumps Training Guidance for Coaches",
      "url": "https://www.uka.org.uk/wp-content/uploads/2022/09/Jumps-Training-Guidance-for-Coaches-FINAL-Sep-22-v8.01.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_five_bound",
    "cz": "Pětiskok: poskok, krok, poskok, krok, skok",
    "en": "Five-Step Bound",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_hop_step_jump",
    "pos": [
      "Připrav rovnou dráhu a koncovou plochu pro bezpečný dopad na obě nohy.",
      "Prepare a straight lane and a safe two-foot landing area."
    ],
    "exe": [
      "Začni odrazem z pravé nohy. Následují dopady pravá, levá, levá, pravá a nakonec obě nohy. Poté nacvič zrcadlové pořadí z levé. Začni malými odrazy a uč se rytmus s trenérem.",
      "Start by taking off from the right foot. Land right, left, left, right, then on both feet. Practise the mirrored sequence starting on the left. Begin with small jumps and learn the rhythm with a coach."
    ],
    "wat": [
      "Nezaměňuj nácvik pořadí za maximální test vzdálenosti.",
      "Do not turn sequence practice into a maximal distance test."
    ],
    "pro": [
      "Lehčí: trojskoková sekvence nebo chůze po značkách. Těžší: plynulé spojení bez přidaných kroků.",
      "Easier: a triple-jump sequence or marked walking pattern. Harder: a continuous sequence without added steps."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_five_bound",
    "hd": null,
    "foc": [
      "Začni odrazem z pravé nohy.",
      "Start by taking off from the right foot."
    ],
    "source": {
      "author": "World Athletics",
      "document": "5 Step Bound",
      "url": "https://worldathletics.org/kids-athletics/teaching-athletics/5-step-bound",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_diagonal_bound",
    "cz": "Střídavé šikmé odrazy vpřed",
    "en": "Alternating Diagonal Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Rozmísti ploché značky střídavě šikmo vpravo a vlevo před sebe.",
      "Place flat markers alternately diagonally right and left ahead."
    ],
    "exe": [
      "Odrážej se z jedné nohy na druhou směrem k další značce. Pánev postupuje vpřed a současně do strany.",
      "Bound from one foot to the other toward each next marker, moving the pelvis forward and sideways."
    ],
    "wat": [
      "Koleno při bočním zatížení sleduje chodidlo; značky nastav blízko.",
      "Track the knee with the foot under lateral load and start with close markers."
    ],
    "pro": [
      "Lehčí: jednotlivé diagonální skoky se zastavením. Těžší: navazované kontakty při stejné šířce dráhy.",
      "Easier: isolated diagonal leaps and holds. Harder: continuous contacts along the same-width lane."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_diagonal_bound",
    "hd": null,
    "foc": [
      "Odrážej se z jedné nohy na druhou směrem k další značce.",
      "Bound from one foot to the other toward each next marker, moving the pelvis forward and sideways."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_crossover_hop",
    "cz": "Křížné poskoky vpřed na jedné noze",
    "en": "Single-Leg Crossover Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_sameleg_bound",
    "pos": [
      "Stůj na jedné noze vedle rovné čáry.",
      "Stand on one foot beside a straight line."
    ],
    "exe": [
      "Poskakuj vpřed na stejné noze střídavě přes čáru na obě strany. Volná noha zůstává mimo dopadovou dráhu.",
      "Hop forward on the same foot, crossing the line to alternating sides. Keep the free leg clear of the landing path."
    ],
    "wat": [
      "Při překřížení netoč kolenem nad přilepeným chodidlem; změna směru probíhá za letu.",
      "Do not twist the knee over a planted foot; change direction during flight."
    ],
    "pro": [
      "Lehčí: malé skoky přes čáru se zastavením. Těžší: plynulá krátká série s kontrolovaným přenosem do stran.",
      "Easier: small hop-and-holds across the line. Harder: a short continuous series with controlled lateral transfer."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_crossover_hop",
    "hd": null,
    "foc": [
      "Poskakuj vpřed na stejné noze střídavě přes čáru na obě strany.",
      "Hop forward on the same foot, crossing the line to alternating sides."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_lateral_bound_hop",
    "cz": "Boční přeskok s navazujícím odrazem vzhůru",
    "en": "Lateral Bound to Vertical Hop",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "skater",
    "pos": [
      "Stůj na jedné noze s prostorem do strany.",
      "Stand on one leg with space to the side."
    ],
    "exe": [
      "Přeskoč do strany na druhou nohu a bez mezikroku se z ní odraz vzhůru. Dopadni na stejnou nohu a zastav.",
      "Bound sideways onto the other leg and rebound upward without an extra step. Land on that leg and stop."
    ],
    "wat": [
      "První kontakt musí unést boční rychlost; výšku druhého skoku zmenši, pokud koleno uhýbá.",
      "The first contact must control lateral speed; reduce the second jump if the knee drifts."
    ],
    "pro": [
      "Lehčí: boční přeskok a výdrž. Těžší: spoj protisměrné dvojice s odpočinkem mezi krátkými sériemi.",
      "Easier: lateral bound and hold. Harder: link opposite-direction pairs with rest between short sets."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_lateral_bound_hop",
    "hd": null,
    "foc": [
      "Přeskoč do strany na druhou nohu a bez mezikroku se z ní odraz vzhůru.",
      "Bound sideways onto the other leg and rebound upward without an extra step."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_forward_bound_hop",
    "cz": "Přeskok vpřed s navazujícím odrazem vzhůru",
    "en": "Forward Bound to Vertical Hop",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Připrav se k přeskoku z jedné nohy na druhou vpřed.",
      "Prepare to leap forward from one foot to the other."
    ],
    "exe": [
      "Po dopadu na opačnou nohu přesměruj další odraz vzhůru. Dopadni na ni a stabilizuj se.",
      "After landing on the opposite foot, direct the next takeoff upward. Land on that foot and stabilize."
    ],
    "wat": [
      "Nebrzdi dopad propnutým kolenem daleko před tělem. Přijmi jej pružně s pokrčením kyčle a kolena.",
      "Avoid braking on a straight knee far ahead of the body. Absorb through a controlled bend of the hip and knee."
    ],
    "pro": [
      "Lehčí: přeskok vpřed se zastavením. Těžší: plynulejší přechod z vodorovného do svislého odrazu.",
      "Easier: forward leap and hold. Harder: a smoother horizontal-to-vertical transition."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_forward_bound_hop",
    "hd": null,
    "foc": [
      "Po dopadu na opačnou nohu přesměruj další odraz vzhůru.",
      "After landing on the opposite foot, direct the next takeoff upward."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_broad_rebound",
    "cz": "Navazované skoky snožmo do dálky",
    "en": "Repeated Broad Jumps",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "broadjump",
    "pos": [
      "Stůj na obou nohách před krátkou volnou dráhou.",
      "Stand on both feet before a short clear lane."
    ],
    "exe": [
      "Spoj několik skoků snožmo vpřed. Každý dopad plynule převeď do dalšího odrazu a poslední zastav.",
      "Link a few forward two-foot jumps. Turn each landing smoothly into the next takeoff and stop the final landing."
    ],
    "wat": [
      "Nespěchej do dalšího skoku při ztrátě rovnováhy. Paty mohou při tlumení přirozeně dosednout.",
      "Do not rush the next jump if balance is lost. Let heels settle naturally when absorbing the landing."
    ],
    "pro": [
      "Lehčí: samostatné skoky s výdrží. Těžší: delší odrazy při zachování plynulého tlumení.",
      "Easier: isolated jump-and-holds. Harder: longer jumps with smooth absorption."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_broad_rebound",
    "hd": null,
    "foc": [
      "Spoj několik skoků snožmo vpřed.",
      "Link a few forward two-foot jumps."
    ],
    "source": {
      "author": "UK Strength and Conditioning Association",
      "document": "How to monitor net plyometric training stress, PSC issue 47",
      "url": "https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/PSCJ47-Full-December-2017.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_broad_backward",
    "cz": "Skok snožmo vzad se stabilizací",
    "en": "Backward Broad Jump to Stick",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_pogo_backward",
    "pos": [
      "Ověř volný prostor za sebou a postav se chodidly na šířku boků.",
      "Check the space behind you and stand hip-width apart."
    ],
    "exe": [
      "Z malého podřepu se odraz oběma nohama krátce vzad. Dopad tlum v kyčlích a kolenou a zastav.",
      "From a shallow dip, jump a short distance backward with both feet. Absorb through hips and knees and stop."
    ],
    "wat": [
      "Nenakláněj se do záklonu a začni výrazně kratší vzdáleností než u skoku vpřed.",
      "Avoid leaning backward and start much shorter than your forward jump."
    ],
    "pro": [
      "Lehčí: nízký poskok vzad. Těžší: malé zvětšení vzdálenosti při jistém dopadu.",
      "Easier: a low backward hop. Harder: slightly more distance with a secure landing."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_broad_backward",
    "hd": null,
    "foc": [
      "Z malého podřepu se odraz oběma nohama krátce vzad.",
      "From a shallow dip, jump a short distance backward with both feet."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_lateral_stick",
    "cz": "Skok snožmo do strany se zastavením",
    "en": "Lateral Two-Foot Jump to Stick",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_snapdown",
    "pos": [
      "Stůj vedle ploché značky s chodidly na šířku boků.",
      "Stand beside a flat marker with feet hip-width apart."
    ],
    "exe": [
      "Z podřepu přeskoč snožmo do strany a dopad na obě nohy úplně zastav. Vrať se chůzí.",
      "Jump sideways from a shallow squat and stop fully on both feet. Walk back."
    ],
    "wat": [
      "Obě nohy dopadají současně a kolena sledují směr špiček.",
      "Land with both feet together and knees tracking the toes."
    ],
    "pro": [
      "Lehčí: nácvik dopadové polohy bez letu, potom velmi krátký boční skok s výdrží. Těžší: mírně větší boční vzdálenost při stejném jistém zastavení bez dalšího kroku.",
      "Easier: rehearse the landing stance without flight, then use a very short lateral jump and hold. Harder: slightly more lateral distance while retaining the same secure stop without another step."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_lateral_stick",
    "hd": null,
    "foc": [
      "Z podřepu přeskoč snožmo do strany a dopad na obě nohy úplně zastav.",
      "Jump sideways from a shallow squat and stop fully on both feet."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_quarter_broad",
    "cz": "Skok vpřed s otočením o čtvrt otáčky",
    "en": "Forward Jump with Quarter Turn",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_rotational_jump",
    "pos": [
      "Před sebe polož značku a vyber směr otočení.",
      "Place a marker ahead and choose the turning direction."
    ],
    "exe": [
      "Skoč snožmo vpřed a za letu otoč celé tělo o čtvrt otáčky. Dopadni čelem do nového směru a zastav.",
      "Jump forward from both feet, turn the whole body a quarter turn in flight, land facing the new direction and stop."
    ],
    "wat": [
      "Otáčení dokonči před kontaktem se zemí; nekroutíš koleny po dopadu.",
      "Complete the turn before ground contact rather than twisting the knees afterward."
    ],
    "pro": [
      "Lehčí: menší otočení na místě. Těžší: delší posun při stejné přesnosti otočení.",
      "Easier: a smaller turn in place. Harder: more travel with the same turning accuracy."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_quarter_broad",
    "hd": null,
    "foc": [
      "Skoč snožmo vpřed a za letu otoč celé tělo o čtvrt otáčky.",
      "Jump forward from both feet, turn the whole body a quarter turn in flight, land facing the new direction and stop."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_halfturn_travel",
    "cz": "Navazované půlobraty snožmo s posunem",
    "en": "Traveling Half-Turn Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_quarter_broad",
    "pos": [
      "Stůj na čáře a připrav si krátkou dráhu do strany.",
      "Stand on a line with a short sideways travel path."
    ],
    "exe": [
      "Odrazem snožmo se posuň po čáře a otoč se za letu o půl otáčky. Další odraz pokračuje po stejné dráze.",
      "Hop along the line on both feet while making a half turn in flight. Continue along the same path on the next hop."
    ],
    "wat": [
      "Nezvyšuj rychlost, dokud obě chodidla bezpečně netrefují čáru.",
      "Do not increase speed until both feet reliably reach the line."
    ],
    "pro": [
      "Lehčí: jeden půlobrat a výdrž. Těžší: krátká navázaná série se střídáním směru rotace.",
      "Easier: one half turn and hold. Harder: a short linked series alternating rotation direction."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_halfturn_travel",
    "hd": null,
    "foc": [
      "Odrazem snožmo se posuň po čáře a otoč se za letu o půl otáčky.",
      "Hop along the line on both feet while making a half turn in flight."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_single_halfturn",
    "cz": "Půlobraty na jedné noze s posunem",
    "en": "Single-Leg Traveling Half-Turn Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "jump_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_halfturn_travel",
    "pos": [
      "Stůj na jedné noze na čáře; tento dril zařaď až po jistých otočkách snožmo.",
      "Stand on one foot on a line after mastering two-foot turns."
    ],
    "exe": [
      "Poskoč podél čáry a otoč celé tělo o půl otáčky. Dopadni na stejnou nohu a nejprve každý pokus zastav.",
      "Hop along the line with a whole-body half turn. Land on the same foot, initially stopping each attempt."
    ],
    "wat": [
      "Při kontaktu už musí být chodidlo i koleno v novém směru.",
      "The foot and knee must already face the new direction at contact."
    ],
    "pro": [
      "Lehčí: čtvrtotočka nebo obě nohy. Těžší: dva navázané kontakty pod dohledem trenéra.",
      "Easier: a quarter turn or two feet. Harder: two connected contacts under coaching."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_single_halfturn",
    "hd": null,
    "foc": [
      "Poskoč podél čáry a otoč celé tělo o půl otáčky.",
      "Hop along the line with a whole-body half turn."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_scissors_travel",
    "cz": "Nůžkové přeskoky s bočním posunem",
    "en": "Traveling Scissor Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_skip_lateral",
    "pos": [
      "Rozkroč se přes čáru jednou nohou vpředu a druhou vzadu.",
      "Take a split stance straddling a line, one foot forward and one back."
    ],
    "exe": [
      "Nízkými odrazy prohazuj nohy vpřed a vzad a současně postupuj podél čáry do strany.",
      "Switch the feet forward and backward with low hops while traveling sideways along the line."
    ],
    "wat": [
      "Jde o krátké pružné přeskoky, ne hluboké výpady.",
      "Use short springy switches rather than deep lunges."
    ],
    "pro": [
      "Lehčí: prohazování krokem. Těžší: souvislý posun oběma směry bez překřížení chodidel.",
      "Easier: switch using steps. Harder: continuous travel both ways without crossing feet."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_scissors_travel",
    "hd": null,
    "foc": [
      "Nízkými odrazy prohazuj nohy vpřed a vzad a současně postupuj podél čáry do strany.",
      "Switch the feet forward and backward with low hops while traveling sideways along the line."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_foreaft_lateral",
    "cz": "Přeskoky vpřed a vzad s postupem do strany",
    "en": "Forward-Backward Hops Traveling Sideways",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_pogo_lateral",
    "pos": [
      "Stůj snožmo před dlouhou čárou, ramena jsou s ní rovnoběžně.",
      "Stand with feet together in front of a long line, shoulders parallel to it."
    ],
    "exe": [
      "Přeskakuj oběma nohama vpřed a vzad přes čáru a každým odrazem se současně posuň trochu do strany.",
      "Hop forward and backward across the line with both feet, adding a small sideways shift each time."
    ],
    "wat": [
      "Udrž malou výšku i délku, aby se neztratil směr a rytmus.",
      "Keep height and distance modest to preserve direction and rhythm."
    ],
    "pro": [
      "Lehčí: přeskoky vpřed a vzad bez posunu. Těžší: plynulejší postup podél čáry.",
      "Easier: forward-backward hops without travel. Harder: smoother progress along the line."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_foreaft_lateral",
    "hd": null,
    "foc": [
      "Přeskakuj oběma nohama vpřed a vzad přes čáru a každým odrazem se současně posuň trochu do strany.",
      "Hop forward and backward across the line with both feet, adding a small sideways shift each time."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_zigzag_backward",
    "cz": "Boční přeskoky snožmo s postupem vzad",
    "en": "Backward Traveling Lateral Line Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_lateral_zigzag",
    "pos": [
      "Stůj oběma nohama vedle čáry a zkontroluj její volný úsek za sebou.",
      "Stand with both feet beside a line and check the clear section behind you."
    ],
    "exe": [
      "Přeskakuj z jedné strany čáry na druhou a současně se malými kroky letu posouvej vzad.",
      "Hop from side to side across the line while adding small backward travel in flight."
    ],
    "wat": [
      "Chodidla drž spolu; neotáčej trup za směrem pohybu.",
      "Keep feet together and avoid turning the trunk toward the travel direction."
    ],
    "pro": [
      "Lehčí: stejný dril vpřed. Těžší: střídavě krátká série vpřed a vzad; mezi směry vždy úplně zastav a znovu se připrav.",
      "Easier: the forward version. Harder: alternate short forward and backward sets, always stopping fully and resetting between directions."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_zigzag_backward",
    "hd": null,
    "foc": [
      "Přeskakuj z jedné strany čáry na druhou a současně se malými kroky letu posouvej vzad.",
      "Hop from side to side across the line while adding small backward travel in flight."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_single_quarter",
    "cz": "Čtvrtobrat na jedné noze s posunem",
    "en": "Single-Leg Quarter-Turn Hop to Stick",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_py_quarter_broad",
    "pos": [
      "Stůj na jedné noze před blízkou plochou značkou.",
      "Stand on one foot before a nearby flat marker."
    ],
    "exe": [
      "Malým skokem se posuň ke značce a otoč o čtvrt otáčky. Dopadni na stejnou nohu a udrž rovnováhu.",
      "Hop toward the marker with a quarter turn. Land on the same foot and hold balance."
    ],
    "wat": [
      "Otoč současně pánev, koleno i chodidlo; nepřidávej rotaci až na zemi.",
      "Turn pelvis, knee and foot together rather than adding rotation on the ground."
    ],
    "pro": [
      "Lehčí: otočení s dopadem na obě. Těžší: větší posun při stejném jistém zastavení.",
      "Easier: turn to a two-foot landing. Harder: more travel with the same secure stop."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_single_quarter",
    "hd": null,
    "foc": [
      "Malým skokem se posuň ke značce a otoč o čtvrt otáčky.",
      "Hop toward the marker with a quarter turn."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_single_zigzag_back",
    "cz": "Křížné poskoky vzad na jedné noze",
    "en": "Single-Leg Backward Crossover Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_crossover_hop",
    "pos": [
      "Na jedné noze se postav vedle čáry a ověř volnou dráhu vzad.",
      "Stand on one foot beside a line and check the backward path."
    ],
    "exe": [
      "Malými poskoky na stejné noze postupuj vzad střídavě přes čáru. Začni jen několika kontakty.",
      "Travel backward on the same foot, crossing the line with small alternating sideways hops. Begin with only a few contacts."
    ],
    "wat": [
      "Neotáčej hlavu za letu; při nejistém dopadu přilož druhou nohu a skonči.",
      "Do not turn the head in flight; add the other foot and stop if a landing is uncertain."
    ],
    "pro": [
      "Lehčí: stejný vzorec vpřed. Těžší: souvislá krátká sekvence při stejné šířce přeskoku.",
      "Easier: the same pattern forward. Harder: a short continuous sequence over the same width."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_single_zigzag_back",
    "hd": null,
    "foc": [
      "Malými poskoky na stejné noze postupuj vzad střídavě přes čáru.",
      "Travel backward on the same foot, crossing the line with small alternating sideways hops."
    ],
    "source": {
      "author": "National Strength and Conditioning Association",
      "document": "7 Line Drills to Improve Agility",
      "url": "https://www.nsca.com/education/articles/kinetic-select/7-line-drills-to-improve-agility/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_square_double",
    "cz": "Přeskoky snožmo po rozích čtverce",
    "en": "Two-Foot Square Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_lateral_stick",
    "pos": [
      "Vyznač malý čtverec čtyřmi plochými značkami.",
      "Mark a small square with four flat markers."
    ],
    "exe": [
      "Snožmo přeskakuj postupně vpřed, do strany, vzad a zpět do strany. Trup směřuje stále stejně.",
      "Hop with both feet forward, sideways, backward and sideways to close the square, keeping the same body orientation."
    ],
    "wat": [
      "Začni se zastavením v každém rohu. Necouvej do nezkontrolovaného prostoru.",
      "Start with a pause at each corner and check the backward landing area."
    ],
    "pro": [
      "Lehčí: čtverec projdi krokem. Těžší: spoj čtyři kontakty a pak odpočiň.",
      "Easier: step around the square. Harder: link four contacts, then rest."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_square_double",
    "hd": null,
    "foc": [
      "Snožmo přeskakuj postupně vpřed, do strany, vzad a zpět do strany.",
      "Hop with both feet forward, sideways, backward and sideways to close the square, keeping the same body orientation."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_square_single",
    "cz": "Poskoky na jedné noze po rozích čtverce",
    "en": "Single-Leg Square Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_square_double",
    "pos": [
      "Stůj na jedné noze v rohu malého vyznačeného čtverce.",
      "Stand on one foot at a corner of a small marked square."
    ],
    "exe": [
      "Na stejné noze postupuj po všech čtyřech rozích bez otáčení trupu. Po okruhu zastav a vystřídej směr i nohu.",
      "Hop on the same foot through all four corners without turning the trunk. Stop after a circuit and change direction and leg."
    ],
    "wat": [
      "V bočních i zpětných dopadech drž koleno nad chodidlem.",
      "Keep the knee aligned with the foot during sideways and backward landings."
    ],
    "pro": [
      "Lehčí: snožmo nebo s výdrží v rozích. Těžší: spoj celý okruh při zachování malé velikosti čtverce.",
      "Easier: two feet or pauses at corners. Harder: link a full circuit while keeping the square small."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_square_single",
    "hd": null,
    "foc": [
      "Na stejné noze postupuj po všech čtyřech rozích bez otáčení trupu.",
      "Hop on the same foot through all four corners without turning the trunk."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_triangle_single",
    "cz": "Trojúhelníkové poskoky na jedné noze",
    "en": "Single-Leg Triangle Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_single_broad_stick",
    "pos": [
      "Vyznač malý trojúhelník a postav se na jednu nohu v jeho rohu.",
      "Mark a small triangle and balance on one foot at a corner."
    ],
    "exe": [
      "Spoj tři poskoky mezi vrcholy: šikmo vpřed, do strany a šikmo zpět. Hrudník drž ve stejném směru.",
      "Link three hops between vertices: diagonally forward, sideways and diagonally back, keeping the chest orientation unchanged."
    ],
    "wat": [
      "Změna úhlu dopadu nesmí vychýlit koleno dovnitř.",
      "Changing the landing angle must not collapse the knee inward."
    ],
    "pro": [
      "Lehčí: jednotlivé malé skoky jednonož s výdrží, nejprve jen vpřed. Těžší: spoj tři malé kontakty bez pauzy, ale se stejnou kontrolou. Oba směry a obě nohy procvičuj jako rovnocenné varianty.",
      "Easier: individual small single-leg hops and holds, initially only forward. Harder: link three small contacts without pauses while preserving control. Practise both directions and both legs as equivalent variations."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_triangle_single",
    "hd": null,
    "foc": [
      "Spoj tři poskoky mezi vrcholy: šikmo vpřed, do strany a šikmo zpět.",
      "Link three hops between vertices: diagonally forward, sideways and diagonally back, keeping the chest orientation unchanged."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hexagon_rebound",
    "cz": "Přeskoky přes strany šestiúhelníku",
    "en": "Hexagon Rebound Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_py_square_double",
    "pos": [
      "Vyznač malý šestiúhelník a stůj snožmo uprostřed.",
      "Mark a small hexagon and stand on both feet in its centre."
    ],
    "exe": [
      "Přeskoč jednu stranu ven a hned zpět do středu. Pokračuj přes sousední stranu, až oběhneš celý obvod; trup se neotáčí.",
      "Hop over one edge and back to the centre. Continue over the next edge around the shape without turning the trunk."
    ],
    "wat": [
      "Velikost přizpůsob nejistějšímu směru. Při ztrátě rytmu zastav.",
      "Size the shape for your least controlled direction and stop if rhythm breaks."
    ],
    "pro": [
      "Lehčí: jen přední a boční strany se zastavením. Těžší: celý okruh navázaně, poté opačný směr.",
      "Easier: front and side edges with pauses. Harder: a continuous circuit, then reverse direction."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hexagon_rebound",
    "hd": null,
    "foc": [
      "Přeskoč jednu stranu ven a hned zpět do středu.",
      "Hop over one edge and back to the centre."
    ],
    "source": {
      "author": "UK Athletics",
      "document": "Jumps Training Guidance for Coaches",
      "url": "https://www.uka.org.uk/wp-content/uploads/2022/09/Jumps-Training-Guidance-for-Coaches-FINAL-Sep-22-v8.01.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_single_forward",
    "cz": "Poskoky vpřed přes nízké překážky na jedné noze",
    "en": "Single-Leg Forward Hurdle Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_sameleg_bound",
    "pos": [
      "Postav několik nízkých měkkých překážek do krátké řady s pohodlným rozestupem.",
      "Arrange a few low soft hurdles in a short row with comfortable spacing."
    ],
    "exe": [
      "Přeskakuj je vpřed na stejné noze. Začni jednotlivými přeskoky, pak spoj krátkou řadu.",
      "Hop forward over them on the same foot. Begin with individual hops before linking a short row."
    ],
    "wat": [
      "Výška nesmí nutit k přitahování kolena k hrudi nebo tvrdému dopadu.",
      "Height must not force knee tucking or heavy landings."
    ],
    "pro": [
      "Lehčí: ploché čáry místo překážek. Těžší: navázané kontakty při stejné nízké výšce.",
      "Easier: flat lines instead of hurdles. Harder: connected contacts at the same low height."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_single_forward",
    "hd": null,
    "foc": [
      "Přeskakuj je vpřed na stejné noze.",
      "Hop forward over them on the same foot."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_single_lateral",
    "cz": "Boční poskoky přes nízké překážky na jedné noze",
    "en": "Single-Leg Lateral Hurdle Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_hop_lateral_out",
    "pos": [
      "Postav se bokem k řadě nízkých měkkých překážek.",
      "Stand sideways to a row of low soft hurdles."
    ],
    "exe": [
      "Na stejné noze postupuj do strany přes překážky. První pokusy mezi překážkami stabilizuj.",
      "Travel sideways over the hurdles on the same foot, initially stabilizing between obstacles."
    ],
    "wat": [
      "Nedopadej na vnější hranu chodidla a neotáčej tělo čelem k dráze.",
      "Avoid landing on the outer foot edge or turning to face the lane."
    ],
    "pro": [
      "Lehčí: ploché značky. Těžší: plynulá krátká řada s kvalitními bočními kontakty.",
      "Easier: flat markers. Harder: a short continuous row with controlled lateral contacts."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_single_lateral",
    "hd": null,
    "foc": [
      "Na stejné noze postupuj do strany přes překážky.",
      "Travel sideways over the hurdles on the same foot, initially stabilizing between obstacles."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_corner",
    "cz": "Překážkové odrazy se změnou dráhy do pravého úhlu",
    "en": "L-Shaped Hurdle Rebounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_cone_jump",
    "pos": [
      "Dvě nízké měkké překážky umísti tak, aby první skok vedl vpřed a druhý do strany.",
      "Place two low soft hurdles so the first jump goes forward and the second sideways."
    ],
    "exe": [
      "Přeskoč snožmo první překážku a z dopadu se odraz do strany přes druhou. Orientace trupu zůstává stejná.",
      "Jump over the first hurdle on both feet and rebound sideways over the second, keeping the trunk orientation unchanged."
    ],
    "wat": [
      "Mezi překážkami nech dost místa pro dopad; neotáčej kolena na zemi.",
      "Leave enough landing space between hurdles and avoid twisting knees on the ground."
    ],
    "pro": [
      "Lehčí: oba skoky odděl výdrží. Těžší: plynulé přesměrování bez přídavného kroku.",
      "Easier: separate jumps with a hold. Harder: smooth redirection without an extra step."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_corner",
    "hd": null,
    "foc": [
      "Přeskoč snožmo první překážku a z dopadu se odraz do strany přes druhou.",
      "Jump over the first hurdle on both feet and rebound sideways over the second, keeping the trunk orientation unchanged."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_vertical",
    "cz": "Přeskok překážky s navazujícím výskokem",
    "en": "Hurdle Jump to Vertical Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_cone_jump",
    "pos": [
      "Před nízkou měkkou překážkou nech dost místa pro odraz i dopad za ní.",
      "Leave enough takeoff and landing space around a low soft hurdle."
    ],
    "exe": [
      "Přeskoč ji snožmo a z dopadu se hned odraz vzhůru. Druhý dopad klidně zastav.",
      "Jump over it on both feet and immediately rebound vertically. Settle the second landing."
    ],
    "wat": [
      "Druhý odraz směřuje vzhůru, ne pod překážku; při ztrátě kontroly návaznost vynech.",
      "Direct the second takeoff upward, away from the hurdle; omit it if control is lost."
    ],
    "pro": [
      "Lehčí: mezi skoky zastav. Těžší: plynulejší přenos při stejné nízké překážce.",
      "Easier: pause between jumps. Harder: smoother transfer over the same low hurdle."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_vertical",
    "hd": null,
    "foc": [
      "Přeskoč ji snožmo a z dopadu se hned odraz vzhůru.",
      "Jump over it on both feet and immediately rebound vertically."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_broad",
    "cz": "Přeskok překážky s navazujícím skokem do dálky",
    "en": "Hurdle Jump to Broad Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_py_broad_rebound",
    "pos": [
      "Připrav nízkou měkkou překážku a delší volný prostor za ní.",
      "Prepare a low soft hurdle and a longer clear landing area beyond it."
    ],
    "exe": [
      "Přeskoč překážku snožmo, z prvního dopadu pokračuj dalším skokem vpřed a konec zastav na obou nohách.",
      "Jump over the hurdle on both feet, rebound forward from the first landing and finish on both feet."
    ],
    "wat": [
      "Při přesměrování nepadni hrudníkem dolů. Překážku udrž nízkou.",
      "Do not collapse the chest when redirecting force. Keep the hurdle low."
    ],
    "pro": [
      "Lehčí: samostatný přeskok a samostatný skok do dálky. Těžší: spoj oba odrazy bez mezikroku.",
      "Easier: separate hurdle and broad jumps. Harder: link both takeoffs without an extra step."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_broad",
    "hd": null,
    "foc": [
      "Přeskoč překážku snožmo, z prvního dopadu pokračuj dalším skokem vpřed a konec zastav na obou nohách.",
      "Jump over the hurdle on both feet, rebound forward from the first landing and finish on both feet."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_bounds",
    "cz": "Přeskok překážky do střídavých odrazů",
    "en": "Hurdle Jump to Alternating Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Postav nízkou měkkou překážku před krátkou volnou dráhu.",
      "Place a low soft hurdle before a short clear lane."
    ],
    "exe": [
      "Po přeskoku snožmo přejdi z dopadu do odrazu na jednu nohu a pokračuj několika střídavými odrazy vpřed.",
      "After a two-foot hurdle jump, drive from the landing onto one foot and continue with a few alternating forward bounds."
    ],
    "wat": [
      "Přechod nejprve nacvič pomalu; nevynucuj okamžitou rychlost při nejisté jednostranné opoře.",
      "Rehearse the transition slowly; avoid forcing speed with uncertain single-leg support."
    ],
    "pro": [
      "Lehčí: překážka, zastavení, poté odrazy. Těžší: plynulá návaznost při stejném počtu kontaktů.",
      "Easier: hurdle jump, stop, then bound. Harder: continuous linkage with the same contact count."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_bounds",
    "hd": null,
    "foc": [
      "Po přeskoku snožmo přejdi z dopadu do odrazu na jednu nohu a pokračuj několika střídavými odrazy vpřed.",
      "After a two-foot hurdle jump, drive from the landing onto one foot and continue with a few alternating forward bounds."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_hurdle_sprint",
    "cz": "Přeskok překážky s krátkou akcelerací",
    "en": "Hurdle Jump to Acceleration",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prekazka",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_cone_jump",
    "pos": [
      "Za nízkou překážkou vymez volný úsek pro rozběh i postupné zabrzdění.",
      "Leave a clear acceleration and gradual braking zone beyond a low hurdle."
    ],
    "exe": [
      "Přeskoč snožmo, z dopadu přejdi do běžeckých kroků a krátce zrychli vpřed.",
      "Jump over on both feet, transition from landing into running steps and accelerate briefly."
    ],
    "wat": [
      "Nebrzdi prvním krokem daleko před pánví. Zrychluj krátkými kroky a na konci zpomal postupně.",
      "Avoid braking with the first step far ahead of the pelvis. Accelerate with short steps and slow down gradually at the end."
    ],
    "pro": [
      "Lehčí: po dopadu zastav a vyběhni. Těžší: plynulejší první kroky bez zvýšení překážky.",
      "Easier: stop after landing before running. Harder: smoother first steps without raising the hurdle."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_hurdle_sprint",
    "hd": null,
    "foc": [
      "Přeskoč snožmo, z dopadu přejdi do běžeckých kroků a krátce zrychli vpřed.",
      "Jump over on both feet, transition from landing into running steps and accelerate briefly."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_drop_broad",
    "cz": "Nízký seskok do skoku vpřed",
    "en": "Low Drop to Broad Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_drop_landing",
    "pos": [
      "Stůj na velmi nízké pevné bedně, před ní nech volnou dopadovou dráhu.",
      "Stand on a very low stable box with a clear landing lane ahead."
    ],
    "exe": [
      "Sestup jednou nohou z hrany bez výskoku vzhůru. Po dopadu na obě nohy navazuj skokem vpřed a zastav.",
      "Step off without jumping upward. Land on both feet, rebound forward and settle the final landing."
    ],
    "wat": [
      "Výšku vol podle zvládnutí dopadu, ne podle odvahy. Při tvrdém kontaktu vrať nácvik na zem.",
      "Choose height by landing control, not confidence. Return to floor practice if contact becomes heavy."
    ],
    "pro": [
      "Lehčí: seskok se zastavením. Těžší: rychlejší návaznost při stejné nízké výšce.",
      "Easier: drop and hold. Harder: quicker linkage at the same low height."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_drop_broad",
    "hd": null,
    "foc": [
      "Sestup jednou nohou z hrany bez výskoku vzhůru.",
      "Step off without jumping upward."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_drop_bounds",
    "cz": "Nízký seskok do střídavých odrazů",
    "en": "Low Drop to Alternating Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 5,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_drop_landing",
    "pos": [
      "Připrav velmi nízkou pevnou bednu a krátkou odrazovou dráhu.",
      "Prepare a very low stable box and a short bounding lane."
    ],
    "exe": [
      "Sestup z bedny na obě nohy a z dopadu přejdi do několika střídavých odrazů vpřed. Poslední dopad stabilizuj.",
      "Step down to both feet and transition into a few alternating forward bounds. Stabilize the last landing."
    ],
    "wat": [
      "Nespojuj seskok s odrazy, dokud zvlášť bezpečně nezvládáš obě části.",
      "Do not combine the drop and bounds until both are controlled separately."
    ],
    "pro": [
      "Lehčí: seskok se zastavením a odděleně malé střídavé odrazy ze země. Těžší: plynulé propojení až po zvládnutí obou částí, bez zvýšení bedny.",
      "Easier: a drop-and-hold, with small alternating floor bounds practised separately. Harder: link them only after controlling both parts, without raising the box."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_drop_bounds",
    "hd": null,
    "foc": [
      "Sestup z bedny na obě nohy a z dopadu přejdi do několika střídavých odrazů vpřed.",
      "Step down to both feet and transition into a few alternating forward bounds."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_drop_sprint",
    "cz": "Nízký seskok s přechodem do akcelerace",
    "en": "Low Drop to Acceleration",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_drop_landing",
    "pos": [
      "Z nízké pevné bedny musí vést volná dráha s dostatkem místa pro doběh.",
      "A low stable box must face a clear lane with enough runoff space."
    ],
    "exe": [
      "Sestup bez výskoku, přijmi dopad na obě nohy a plynule přejdi do několika zrychlujících běžeckých kroků.",
      "Step off without jumping, receive a two-foot landing and smoothly enter a few accelerating running steps."
    ],
    "wat": [
      "První krok směřuj pod tělo; při nestabilním dopadu nejprve zastav.",
      "Place the first step beneath the body; stop first if the landing is unstable."
    ],
    "pro": [
      "Lehčí: rozběh ze země nebo seskok s výdrží. Těžší: plynulejší přechod při stejné nízké výšce.",
      "Easier: accelerate from the floor or drop-and-hold. Harder: a smoother transition from the same low height."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_drop_sprint",
    "hd": null,
    "foc": [
      "Sestup bez výskoku, přijmi dopad na obě nohy a plynule přejdi do několika zrychlujících běžeckých kroků.",
      "Step off without jumping, receive a two-foot landing and smoothly enter a few accelerating running steps."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_lateral",
    "cz": "Výskok snožmo na bednu z boku",
    "en": "Lateral Box Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "boxjump",
    "pos": [
      "Postav se bokem k nízké široké pevné bedně.",
      "Stand sideways beside a low wide stable box."
    ],
    "exe": [
      "Z podřepu vyskoč oběma nohama do strany na střed bedny. Dopad zastav a dolů sestup.",
      "Jump sideways from a shallow squat onto the centre of the box with both feet. Hold the landing and step down."
    ],
    "wat": [
      "Celá chodidla musí mít místo na horní ploše; nedopadej na hranu.",
      "Leave room for both full feet on top; do not land on the edge."
    ],
    "pro": [
      "Lehčí: boční skok na zemi. Těžší: větší boční vzdálenost při stejné bezpečné výšce.",
      "Easier: a lateral floor jump. Harder: more sideways distance at the same safe height."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_lateral",
    "hd": null,
    "foc": [
      "Z podřepu vyskoč oběma nohama do strany na střed bedny.",
      "Jump sideways from a shallow squat onto the centre of the box with both feet."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_turn",
    "cz": "Výskok na bednu s otočením o čtvrt otáčky",
    "en": "Quarter-Turn Box Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_quarter_broad",
    "pos": [
      "Stůj před nízkou širokou bednou a předem si urč finální orientaci chodidel.",
      "Stand before a low wide box and choose the final foot orientation."
    ],
    "exe": [
      "Vyskoč snožmo, za letu se otoč o čtvrt otáčky a dopadni oběma chodidly doprostřed bedny. Sestup krokem.",
      "Jump with both feet, turn a quarter turn in flight and land centred on the box. Step down."
    ],
    "wat": [
      "Otáčení nesmí pokračovat na zatížených chodidlech po dopadu.",
      "Do not continue twisting over loaded feet after landing."
    ],
    "pro": [
      "Lehčí: otočka na zemi nebo přímý výskok na nízkou bednu. Těžší: po opakovaně jistých dopadech mírně zvětši vzdálenost od bedny při stejné nízké výšce. Každý pokus zastav a dolů sestup.",
      "Easier: a floor turn or straight jump onto a low box. Harder: after consistently secure landings, slightly increase takeoff distance at the same low height. Stop each attempt and step down."
    ],
    "J": {
      "kol": 2,
      "kot": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_turn",
    "hd": null,
    "foc": [
      "Vyskoč snožmo, za letu se otoč o čtvrt otáčky a dopadni oběma chodidly doprostřed bedny.",
      "Jump with both feet, turn a quarter turn in flight and land centred on the box."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Plyometric Training Concepts for Performance Enhancement, chapter 8",
      "url": "https://downloads.lww.com/wolterskluwer_vitalstream_com/sample-content/9780781768030_NASM/samples/Chapter08.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_single",
    "cz": "Výskok jednou nohou na nízkou bednu",
    "en": "Single-Leg Box Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_single_broad_stick",
    "pos": [
      "Stůj na jedné noze před nízkou širokou pevnou bednou.",
      "Stand on one leg before a low wide stable box."
    ],
    "exe": [
      "Odraz se z jedné nohy a na stejnou nohu dopadni na střed bedny. Zastav, přilož druhou a sestup.",
      "Take off from one foot and land on that foot in the box centre. Stabilize, add the other foot and step down."
    ],
    "wat": [
      "Volné koleno neslouží k zakrytí příliš vysoké bedny. Výšku drž nízkou.",
      "Do not use an exaggerated knee tuck to compensate for excessive box height. Keep it low."
    ],
    "pro": [
      "Lehčí: krátký skok na stejné noze na zemi s výdrží, případně odraz jednou a dopad oběma na nízkou bednu. Těžší: až při jistém dopadu mírně zvětši vzdálenost od stejné nízké bedny. Výšku současně nezvyšuj.",
      "Easier: a short same-leg floor hop and hold, or one-foot takeoff to a two-foot landing on a low box. Harder: only after secure landings, slightly increase distance to the same low box. Do not raise height at the same time."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_single",
    "hd": null,
    "foc": [
      "Odraz se z jedné nohy a na stejnou nohu dopadni na střed bedny.",
      "Take off from one foot and land on that foot in the box centre."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_lateral_leap",
    "cz": "Boční přeskok z nohy na nohu na bednu",
    "en": "Lateral Leap to Box",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "skater",
    "pos": [
      "Stůj na noze vzdálenější od nízké bedny umístěné vedle tebe.",
      "Stand on the foot farther from a low box beside you."
    ],
    "exe": [
      "Přeskoč do strany na opačnou nohu a dopadni s ní doprostřed bedny. Stabilizuj se a sestup.",
      "Leap sideways onto the opposite foot in the box centre. Stabilize and step down."
    ],
    "wat": [
      "Bedna musí být dost široká pro celý došlap; nevynucuj dlouhý let.",
      "The box must be wide enough for full-foot support; avoid forcing distance."
    ],
    "pro": [
      "Lehčí: boční přeskok na zem. Těžší: větší boční přenos při stejné nízké bedně.",
      "Easier: lateral leap on the floor. Harder: more lateral travel to the same low box."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_lateral_leap",
    "hd": null,
    "foc": [
      "Přeskoč do strany na opačnou nohu a dopadni s ní doprostřed bedny.",
      "Leap sideways onto the opposite foot in the box centre."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_skip",
    "cz": "Odrazový skipping přes nízké bedny",
    "en": "Low-Box Skipping",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 5,
    "C": 5,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_py_skip_height",
    "pos": [
      "Pod dohledem trenéra připrav několik velmi nízkých pevných širokých beden s místem pro mezikrok.",
      "Under coaching, arrange a few very low wide stable boxes with room for a connecting step."
    ],
    "exe": [
      "Ve skippingovém rytmu došlápni jednou nohou na bednu, odraz se vzhůru a vpřed a dopadni na stejnou nohu na zem. Krokem přejdi na další stranu.",
      "In a skipping rhythm, step one foot onto the box, drive upward and forward, land on that foot on the floor, then step to change sides."
    ],
    "wat": [
      "Jde o pokročilou sérii s dopady z výšky. Bedny nepřeskakuj naslepo a nedopadej na hrany.",
      "This advanced series includes elevated landings. Keep boxes visible and avoid edge contacts."
    ],
    "pro": [
      "Lehčí: skipping na zemi nebo jediný nízký schod. Těžší: plynulé spojení dvou beden bez zvyšování výšky.",
      "Easier: floor skipping or one low step. Harder: link two boxes without raising them."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_skip",
    "hd": null,
    "foc": [
      "Ve skippingovém rytmu došlápni jednou nohou na bednu, odraz se vzhůru a vpřed a dopadni na stejnou nohu na zem.",
      "In a skipping rhythm, step one foot onto the box, drive upward and forward, land on that foot on the floor, then step to change sides."
    ],
    "source": {
      "author": "James Radcliffe / Human Kinetics",
      "document": "Plyometric Bounds and Skips",
      "url": "https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_box_bound",
    "cz": "Střídavé odrazy přes nízké bedny",
    "en": "Low-Box Alternating Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 5,
    "C": 5,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "ez": "ex26_py_alternate_bound",
    "pos": [
      "Tento náročný dril připrav s trenérem na velmi nízkých pevných bednách a volné dopadové ploše.",
      "Set up this demanding drill with a coach using very low stable boxes and a clear landing area."
    ],
    "exe": [
      "Střídej odrazy z jedné nohy na druhou, přičemž každý druhý kontakt je na bedně. Po odrazu z bedny dopadni na opačnou nohu na zem.",
      "Alternate bounds between legs, with every second contact on a box. Bound from the box onto the opposite foot on the floor."
    ],
    "wat": [
      "Nepřetahuj krok k bedně a netlač přes hranu. Výšku nezvyšuj při zhoršení kontaktu.",
      "Do not overstride toward the box or push off its edge. Do not raise height when contacts deteriorate."
    ],
    "pro": [
      "Lehčí: střídavé odrazy po zemi. Těžší: plynulejší návaznost dvou nízkých beden se stejnou kontrolou.",
      "Easier: floor bounds. Harder: smoother linkage over two low boxes with the same control."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_box_bound",
    "hd": null,
    "foc": [
      "Střídej odrazy z jedné nohy na druhou, přičemž každý druhý kontakt je na bedně.",
      "Alternate bounds between legs, with every second contact on a box."
    ],
    "source": {
      "author": "James Radcliffe / Human Kinetics",
      "document": "Plyometric Bounds and Skips",
      "url": "https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_stairs_double",
    "cz": "Skoky snožmo po širokých nízkých schodech",
    "en": "Two-Foot Stair Bounds",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "schody"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "boxjump",
    "pos": [
      "Vyber nízké široké neklouzavé schody, na každém musí být místo pro celé chodidlo.",
      "Choose low wide non-slip stairs with room for full-foot landings."
    ],
    "exe": [
      "Skoč snožmo na další schod, přijmi dopad a pokračuj vzhůru. Dolů vždy sejdi.",
      "Jump onto the next step with both feet, absorb and continue upward. Always walk down."
    ],
    "wat": [
      "Neskákej přes více schodů, pokud tím ztrácíš jisté místo dopadu.",
      "Do not skip steps if doing so compromises landing space."
    ],
    "pro": [
      "Lehčí: jednotlivý nízký schod s výdrží. Těžší: spoj několik schodů v plynulém rytmu.",
      "Easier: one low step and hold. Harder: link a few steps rhythmically."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_stairs_double",
    "hd": null,
    "foc": [
      "Skoč snožmo na další schod, přijmi dopad a pokračuj vzhůru.",
      "Jump onto the next step with both feet, absorb and continue upward."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_stairs_single",
    "cz": "Poskoky jednou nohou po nízkých schodech",
    "en": "Single-Leg Stair Hops",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "schody"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 4,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_box_single",
    "pos": [
      "Stůj na jedné noze před nízkými širokými schody.",
      "Stand on one foot before low wide steps."
    ],
    "exe": [
      "Poskakuj na stejné noze postupně vzhůru a každý kontakt nejprve stabilizuj. Dolů sejdi oběma nohama.",
      "Hop upward on the same foot, initially stabilizing each contact. Walk down using both feet."
    ],
    "wat": [
      "Ukonči sérii při ztrátě osy kolena nebo nejistém dopadu na hranu.",
      "Stop if knee alignment deteriorates or landing approaches an edge."
    ],
    "pro": [
      "Lehčí: odraz jednou a dopad oběma. Těžší: plynulé spojení krátké řady nízkých schodů.",
      "Easier: one-foot takeoff to two-foot landing. Harder: smoothly link a short flight of low steps."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_stairs_single",
    "hd": null,
    "foc": [
      "Poskakuj na stejné noze postupně vzhůru a každý kontakt nejprve stabilizuj.",
      "Hop upward on the same foot, initially stabilizing each contact."
    ],
    "source": {
      "author": "Hurdles First",
      "document": "Plyometrics for Hurdlers",
      "url": "https://hurdlesfirstbeta.com/free-articles/training-tips/plyometrics-for-hurdlers/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_approach_single",
    "cz": "Skok do dálky z krátkého rozběhu",
    "en": "Short-Approach Single-Leg Long Jump",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "broadjump",
    "pos": [
      "Vymez krátký rozběh a bezpečnou měkkou dopadovou plochu, ideálně doskočiště.",
      "Mark a short approach and a safe soft landing area, preferably a sand pit."
    ],
    "exe": [
      "Po několika plynulých krocích se odraz jednou nohou vpřed a vzhůru. Dopadni na obě nohy s měkkým pokrčením.",
      "After a few smooth steps, take off from one leg forward and upward. Land on both feet with soft flexion."
    ],
    "wat": [
      "Nebrzdí odrazový krok nataženou nohou; rozběh nepřeháněj.",
      "Avoid braking on a straight takeoff leg; keep the approach modest."
    ],
    "pro": [
      "Lehčí: krátký skok z místa s odrazem i dopadem oběma, potom jeden krok a malý odraz jednou nohou do dopadu oběma. Těžší: pravidelnější krátký rozběh pod vedením trenéra, při stejné jistotě dopadu.",
      "Easier: a short standing two-foot jump and landing, then one step into a small one-foot takeoff with a two-foot landing. Harder: a more consistent short approach under coaching while preserving landing control."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_approach_single",
    "hd": null,
    "foc": [
      "Po několika plynulých krocích se odraz jednou nohou vpřed a vzhůru.",
      "After a few smooth steps, take off from one leg forward and upward."
    ],
    "source": {
      "author": "UK Athletics",
      "document": "Jumps Training Guidance for Coaches",
      "url": "https://www.uka.org.uk/wp-content/uploads/2022/09/Jumps-Training-Guidance-for-Coaches-FINAL-Sep-22-v8.01.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_approach_double",
    "cz": "Výskok z krátkého náběhu a odrazu oběma",
    "en": "Approach Jump from Two Feet",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "prostor"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 3,
    "C": 4,
    "family": "jump_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "jumpsquat",
    "pos": [
      "Připrav krátkou rovnou dráhu a volný prostor pro dopad.",
      "Prepare a short straight approach and a clear landing area."
    ],
    "exe": [
      "Po dvou až třech krocích přejdi do krátkého předskoku, postav obě nohy a odraz se vzhůru s mírným posunem vpřed. Dopadni na obě nohy, ztlum pohyb v kyčlích a kolenou a zastav. Před dalším pokusem se znovu připrav.",
      "After two or three steps, use a short gather, plant both feet and jump upward with slight forward travel. Land on both feet, absorb through hips and knees, and stop. Reset before the next attempt."
    ],
    "wat": [
      "Náběh musíš umět bezpečně přesměrovat; nezačínej sprintem.",
      "You must be able to redirect approach speed safely; do not start with a sprint."
    ],
    "pro": [
      "Lehčí: odraz snožmo z místa. Těžší: plynulejší předskok bez delšího podřepu.",
      "Easier: a standing two-foot jump. Harder: a smoother gather without a prolonged squat."
    ],
    "J": {
      "kol": 2,
      "kot": 2,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_approach_double",
    "hd": null,
    "foc": [
      "Po dvou až třech krocích přejdi do krátkého předskoku, postav obě nohy a odraz se vzhůru s mírným posunem vpřed.",
      "After two or three steps, use a short gather, plant both feet and jump upward with slight forward travel."
    ],
    "source": {
      "author": "UK Athletics",
      "document": "Jumps Training Guidance for Coaches",
      "url": "https://www.uka.org.uk/wp-content/uploads/2022/09/Jumps-Training-Guidance-for-Coaches-FINAL-Sep-22-v8.01.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_knee_lateral_push",
    "cz": "Plyometrický klik na kolenou s bočním přesunem rukou",
    "en": "Kneeling Lateral Plyometric Push-Up",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "tlak",
    "eq": [
      "telo"
    ],
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "push_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "kneepush",
    "pos": [
      "Opři kolena o podložku a dlaně pod ramena, trup drž dlouhý.",
      "Support knees on a mat and hands under shoulders, keeping the trunk long."
    ],
    "exe": [
      "Klesni do kliku a rychlým tlakem krátce odlep obě dlaně. Přesuň je o malý kus do strany, kolena zůstávají osou otočení.",
      "Lower into a push-up and press fast enough to briefly lift both hands. Shift them slightly sideways while pivoting around the knees."
    ],
    "wat": [
      "Dopad tlum lokty a rameny; nepadni na zamčené paže ani prohnutá bedra.",
      "Absorb through elbows and shoulders; avoid locked-arm landings or a sagging back."
    ],
    "pro": [
      "Lehčí: běžný klik na kolenou bez letu, potom přesun rukou do strany krokem. Těžší: dva malé navázané odrazy do strany se stejnou oporou kolen a kontrolovaným dopadem.",
      "Easier: a regular knee push-up without flight, then step the hands sideways. Harder: link two small sideways rebounds with the same knee support and controlled landings."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_knee_lateral_push",
    "hd": null,
    "foc": [
      "Klesni do kliku a rychlým tlakem krátce odlep obě dlaně.",
      "Lower into a push-up and press fast enough to briefly lift both hands."
    ],
    "source": {
      "author": "Hawkes Physiotherapy",
      "document": "Lateral knee plyometric press up",
      "url": "https://hawkesphysiotherapy.co.uk/exercise/lateral-knee-plyometric-press-up/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_lateral_push",
    "cz": "Plyometrické kliky s posunem do strany",
    "en": "Lateral Traveling Plyometric Push-Ups",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "tlak",
    "eq": [
      "telo"
    ],
    "mp": [
      "che",
      "tri"
    ],
    "ms": [
      "sho",
      "abs"
    ],
    "S": 5,
    "C": 4,
    "family": "push_horizontal",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "ex26_py_knee_lateral_push",
    "pos": [
      "Zaujmi pevný vzpor na dlaních a špičkách vedle plochých značek.",
      "Take a firm high plank on hands and toes beside flat markers."
    ],
    "exe": [
      "Z kliku se výbušně odtlač, krátce odlep dlaně a přesuň trup i oporu chodidel kousek do strany. Dopad tlum a pokračuj jen při jistotě.",
      "Press explosively from a push-up, briefly lifting the palms and shifting the trunk and foot support slightly sideways. Absorb and continue only with control."
    ],
    "wat": [
      "Jde o náročnou variantu pro připravená zápěstí a ramena. Nesnaž se překonat velkou vzdálenost.",
      "This demanding variation requires prepared wrists and shoulders. Avoid chasing distance."
    ],
    "pro": [
      "Lehčí: boční klik krokem nebo verze na kolenou. Těžší: dva až tři plynulé malé přesuny.",
      "Easier: step sideways between push-ups or use knees. Harder: two or three smooth small shifts."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_lateral_push",
    "hd": null,
    "foc": [
      "Z kliku se výbušně odtlač, krátce odlep dlaně a přesuň trup i oporu chodidel kousek do strany.",
      "Press explosively from a push-up, briefly lifting the palms and shifting the trunk and foot support slightly sideways."
    ],
    "source": {
      "author": "Live Lean TV",
      "document": "3 Push Up Variations With The Agility Ladder",
      "url": "https://www.liveleantv.com/3-push-up-variations-with-the-agility-ladder/",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_py_drop_lateral_bound",
    "cz": "Nízký boční seskok do opačného přeskoku",
    "en": "Low Lateral Drop to Opposite Bound",
    "collection": "plyometrics-space",
    "tags": [
      "plyometrie",
      "plyometrics",
      "pohyb v prostoru"
    ],
    "pat": "drep",
    "eq": [
      "telo",
      "lavice"
    ],
    "mp": [
      "qua",
      "glu",
      "cal"
    ],
    "ms": [
      "ham",
      "abs"
    ],
    "S": 5,
    "C": 5,
    "family": "jump_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "tier": "specialist",
    "sideMode": "perSide",
    "ez": "skater",
    "pos": [
      "S trenérem připrav velmi nízkou pevnou bednu a dvě dopadové značky před ní. Stůj u předního rohu bedny tak, aby první nízký seskok vedl šikmo vpřed a do strany a další přeskok zpět do strany už proběhl zcela před bednou.",
      "With a coach, prepare a very low stable box and two landing marks in front of it. Start near the front corner so the first low drop travels diagonally forward and sideways, leaving the return lateral bound entirely in front of the box."
    ],
    "exe": [
      "Sestup šikmo vpřed a do strany na vnější nohu bez výskoku vzhůru. Z kontrolovaného kontaktu se odraz na druhou nohu opačným bočním směrem mezi připravenými značkami před bednou. Konečný dopad zastav.",
      "Step diagonally forward and sideways onto the outer foot without jumping upward. From a controlled contact, bound onto the other foot in the opposite lateral direction between the prepared marks in front of the box. Hold the final landing."
    ],
    "wat": [
      "Dráhu veď šikmo před bednou, aby opačný odraz nemířil do její hrany.",
      "Route the rebound diagonally in front of the box so it cannot strike the edge."
    ],
    "pro": [
      "Lehčí: boční přeskoky po zemi. Těžší: plynulejší přesměrování při stejné minimální výšce.",
      "Easier: lateral floor bounds. Harder: smoother redirection at the same minimal height."
    ],
    "J": {
      "kot": 2,
      "kol": 2
    },
    "pop": 1,
    "mode": "reps",
    "sessionRole": "strength",
    "goalRole": "power",
    "genRule": "explicit",
    "variantKey": "ex26_py_drop_lateral_bound",
    "hd": null,
    "foc": [
      "Sestup šikmo vpřed a do strany na vnější nohu bez výskoku vzhůru.",
      "Step diagonally forward and sideways onto the outer foot without jumping upward."
    ],
    "source": {
      "author": "Strength & Conditioning Education",
      "document": "Coaching Practice Manual, plyometric progressions",
      "url": "https://strengthandconditioningeducation.com/wp-content/uploads/2020/09/Coaching-Practice-ManualV4.pdf",
      "scope": "movement-family; independently coached spatial variant"
    },
    "defaultRestSec": 150
  },
  {
    "id": "ex26_mob_pendulum",
    "cz": "Uvolněné kyvadlo paže s oporou",
    "en": "Supported Shoulder Pendulum",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "sho"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Jednou rukou se opři o pevný stůl, mírně pokrč kolena a předkloň se z kyčlí. Druhou paži nech volně viset.",
      "Support one hand on a firm table, soften the knees and hinge forward, letting the other arm hang loosely."
    ],
    "exe": [
      "Malým přenášením váhy rozkývej uvolněnou paži vpřed, vzad a do malých kruhů.",
      "Use small body-weight shifts to swing the relaxed arm forward, backward and in small circles."
    ],
    "wat": [
      "Paží aktivně nemáchej a kruh nezvětšuj přes bolest.",
      "Do not actively fling the arm or enlarge the circle into pain."
    ],
    "pro": [
      "Lehčí: nepatrný pohyb s oporou. Dále: postupně zvětši pohodlný oblouk při stále uvolněné paži, bez přidané zátěže.",
      "Easier: use tiny movements with support. Progress by gradually increasing the comfortable arc while the arm stays relaxed, without adding weight."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_pendulum",
    "ez": null,
    "hd": null,
    "foc": [
      "Malým přenášením váhy rozkývej uvolněnou paži vpřed, vzad a do malých kruhů.",
      "Use small body-weight shifts to swing the relaxed arm forward, backward and in small circles."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Shoulder Surgery Exercise Guide — movement demonstrations",
      "url": "https://www.orthoinfo.org/recovery/shoulder-surgery-exercise-guide/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_table_slide",
    "cz": "Posun paží po stole do vzpažení",
    "en": "Seated Shoulder Table Slide",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "sho",
      "lat"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Sedni si ke stolu a polož dlaně na ručník. Lokty jsou pohodlně natažené.",
      "Sit at a table with palms on a towel and elbows comfortably extended."
    ],
    "exe": [
      "Posouvej ruce vpřed a současně předkloň trup z kyčlí. Vrať se bez prudkého přitažení ramen.",
      "Slide hands forward while hinging the trunk from the hips, then return without jerking the shoulders."
    ],
    "wat": [
      "Nehrň ramena k uším a nenech pohyb přejít do ostrého tlaku vpředu v rameni.",
      "Avoid shrugging or moving into sharp pressure at the front of the shoulder."
    ],
    "pro": [
      "Lehčí: kratší posun a větší opora paží o stůl. Těžší: větší pohodlný rozsah bez prohnutí zad; později aktivní vzpažení bez opory.",
      "Easier: use a shorter slide with more arm support from the table. Harder: increase comfortable range without arching the back; later progress to active arm elevation without support."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_table_slide",
    "ez": null,
    "hd": null,
    "foc": [
      "Posouvej ruce vpřed a současně předkloň trup z kyčlí.",
      "Slide hands forward while hinging the trunk from the hips, then return without jerking the shoulders."
    ],
    "source": {
      "author": "Wrightington, Wigan and Leigh NHS Foundation Trust",
      "document": "Shoulder Exercises — table slide",
      "url": "https://www.wwl.nhs.uk/media/.leaflets/6578363e5f48d4.87711085.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_supine_assisted_raise",
    "cz": "Asistované vzpažení vleže se spojenými dlaněmi",
    "en": "Supine Clasped-Hand Shoulder Elevation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "sho",
      "lat"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_mob_table_slide",
    "pos": [
      "Lehni na záda s pokrčenými koleny. Spoj dlaně před hrudníkem.",
      "Lie supine with knees bent and clasp hands above the chest."
    ],
    "exe": [
      "Pomalu veď spojené ruce za hlavu do pohodlného rozsahu a vrať. Silnější paže může jemně pomáhat druhé.",
      "Slowly move the joined hands overhead through a comfortable range and return. The stronger arm may gently assist the other."
    ],
    "wat": [
      "Neprohýbej záda, abys dosáhl rukama na podlahu. Dotyk země není nutný.",
      "Do not arch the back to reach the floor. Floor contact is unnecessary."
    ],
    "pro": [
      "Lehčí: více pokrč lokty. Těžší: méně pomoci a pomalejší návrat.",
      "Easier: bend elbows more. Harder: use less assistance and a slower return."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_supine_assisted_raise",
    "hd": null,
    "foc": [
      "Pomalu veď spojené ruce za hlavu do pohodlného rozsahu a vrať.",
      "Slowly move the joined hands overhead through a comfortable range and return."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Shoulder Surgery Exercise Guide — movement demonstrations",
      "url": "https://www.orthoinfo.org/recovery/shoulder-surgery-exercise-guide/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_dowel_er",
    "cz": "Zevní rotace ramene s dopomocí tyče",
    "en": "Dowel-Assisted Shoulder External Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "tyc"
    ],
    "mp": [
      "rcuff"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Ve stoji drž lehkou tyč vodorovně před pasem. Loket procvičované paže opři k boku a ohni do pravého úhlu.",
      "Stand holding a light dowel horizontally in front of the waist. Keep the working elbow by the side, bent to a right angle."
    ],
    "exe": [
      "Druhou rukou jemně posouvej tyč a otáčej předloktí pracující paže ven. Vrať bez odskoku.",
      "Use the other hand to gently move the dowel and rotate the working forearm outward, then return without bouncing."
    ],
    "wat": [
      "Loket neodtahuj od trupu. Tyč slouží jako jemná dopomoc, nikoli páka k násilnému protažení.",
      "Keep the elbow beside the trunk. The dowel provides gentle assistance, not forceful leverage."
    ],
    "pro": [
      "Lehčí: menší úhel. Těžší: stejný rozsah zkus aktivně bez pomoci tyče.",
      "Easier: reduce the angle. Harder: try the same range actively without dowel assistance."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_dowel_er",
    "ez": null,
    "hd": null,
    "foc": [
      "Druhou rukou jemně posouvej tyč a otáčej předloktí pracující paže ven.",
      "Use the other hand to gently move the dowel and rotate the working forearm outward, then return without bouncing."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Rotator Cuff and Shoulder Conditioning Program",
      "url": "https://www.orthoinfo.org/recovery/rotator-cuff-and-shoulder-conditioning-program/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_finger_wallclimb",
    "cz": "Postupné vyšlapávání prsty po zdi",
    "en": "Finger Wall Climb",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "sho"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_mob_table_slide",
    "pos": [
      "Stůj čelem ke zdi, prsty jedné ruky o ni lehce opři před ramenem.",
      "Face a wall with fingertips of one hand lightly touching it in front of the shoulder."
    ],
    "exe": [
      "Postupně posouvej prsty vzhůru. Přibliž tělo ke zdi podle potřeby a potom stejným způsobem sestup.",
      "Walk the fingers upward, moving the body nearer the wall as needed, then walk them back down."
    ],
    "wat": [
      "Nezadržuj dech a nesnaž se dosáhnout výš záklonem.",
      "Keep breathing and avoid gaining height by leaning backward."
    ],
    "pro": [
      "Lehčí: kratší dráha. Těžší: na vrcholu ruku na okamžik lehce odlehči od zdi.",
      "Easier: shorten the travel. Harder: briefly unload the hand from the wall at the top."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_finger_wallclimb",
    "hd": null,
    "foc": [
      "Postupně posouvej prsty vzhůru.",
      "Walk the fingers upward, moving the body nearer the wall as needed, then walk them back down."
    ],
    "source": {
      "author": "American Academy of Orthopaedic Surgeons",
      "document": "Shoulder Surgery Exercise Guide — movement demonstrations",
      "url": "https://www.orthoinfo.org/recovery/shoulder-surgery-exercise-guide/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_prone_swimmer",
    "cz": "Pomalé plavecké oblouky pažemi na břiše",
    "en": "Prone Shoulder Swimmer",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "sho",
      "rcuff"
    ],
    "ms": [
      "upb"
    ],
    "S": 2,
    "C": 3,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Lehni na břicho, čelo podlož malým ručníkem a paže natáhni před sebe.",
      "Lie prone, support the forehead on a small towel and extend arms in front."
    ],
    "exe": [
      "Paže mírně odlehči. Pomalu je veď obloukem do stran a k bokům, otáčej dlaně a pokrč lokty pro dosah za záda. Vrať stejnou cestou.",
      "Float the arms slightly. Slowly sweep them sideways toward the hips, rotating palms and bending elbows to reach behind the back. Reverse the path."
    ],
    "wat": [
      "Hrudník a nohy zůstávají na zemi. Výšku zdvihu nepřidávej záklonem krku.",
      "Keep chest and legs grounded. Do not gain arm height by extending the neck."
    ],
    "pro": [
      "Lehčí: ruce kloužou po podložce a oblouk je kratší. Těžší: plynulý oblouk bez dotyku země.",
      "Easier: slide hands on the mat through a shorter arc. Harder: maintain a continuous hover throughout the arc."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_prone_swimmer",
    "ez": null,
    "hd": null,
    "foc": [
      "Paže mírně odlehči.",
      "Float the arms slightly."
    ],
    "source": {
      "author": "Evolution Physical Therapy",
      "document": "Upper Body Mobility Exercises for Swimmers",
      "url": "https://www.evolutionphysicaltherapy.com/post/upper-body-mobility-exercises-swimming/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_prone_overhead_lift",
    "cz": "Aktivní odlehčení tyče ve vzpažení na břiše",
    "en": "Prone Overhead Dowel Lift-Off",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "tyc"
    ],
    "mp": [
      "sho",
      "tra"
    ],
    "ms": [
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_supine_armraise",
    "pos": [
      "Lehni na břicho, čelo nech podepřené a lehkou tyč drž ve vzpažení širším úchopem.",
      "Lie prone with forehead supported and hold a light dowel overhead using a moderately wide grip."
    ],
    "exe": [
      "Zvedni tyč jen pár centimetrů nad podložku a pomalu polož. Lokty nech natažené.",
      "Lift the dowel just a few centimetres off the mat and lower slowly with elbows extended."
    ],
    "wat": [
      "Nezvedej hrudník ani nepřetlačuj bedra do záklonu.",
      "Do not lift the chest or force a lumbar arch."
    ],
    "pro": [
      "Lehčí: širší pohodlný úchop nebo nejprve posun tyče po podložce bez zvedání. Těžší: užší pohodlný úchop a krátká výdrž.",
      "Easier: use a wider comfortable grip or first slide the dowel along the mat without lifting. Harder: use a narrower comfortable grip and a brief hold."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_prone_overhead_lift",
    "hd": null,
    "foc": [
      "Zvedni tyč jen pár centimetrů nad podložku a pomalu polož.",
      "Lift the dowel just a few centimetres off the mat and lower slowly with elbows extended."
    ],
    "source": {
      "author": "Ryan Nosak / The Prehab Guys",
      "document": "Must-Do Exercises to Master Overhead Lifting",
      "url": "https://theprehabguys.com/blog/must-do-exercises-to-master-overhead-lifting/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_behindback_lift",
    "cz": "Aktivní odlehčení rukou za zády",
    "en": "Behind-Back Hand Lift-Off",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "sho",
      "rcuff"
    ],
    "ms": [],
    "S": 2,
    "C": 3,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Stůj vzpřímeně a spoj ruce za pánví, lokty měj téměř natažené.",
      "Stand tall and join hands behind the pelvis with elbows nearly straight."
    ],
    "exe": [
      "Bez předklonu odtáhni spojené ruce kousek od těla a pomalu je vrať.",
      "Without leaning forward, move the joined hands a short distance away from the body and return slowly."
    ],
    "wat": [
      "Nevysouvej hlavu a nedoháněj rozsah prohnutím zad.",
      "Avoid jutting the head forward or arching the back to gain range."
    ],
    "pro": [
      "Lehčí: ruce drž odděleně nebo použij širší úchop tyče. Těžší: krátká výdrž v dosaženém rozsahu.",
      "Easier: separate the hands or use a wide dowel grip. Harder: pause briefly at your active end range."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_behindback_lift",
    "ez": null,
    "hd": null,
    "foc": [
      "Bez předklonu odtáhni spojené ruce kousek od těla a pomalu je vrať.",
      "Without leaning forward, move the joined hands a short distance away from the body and return slowly."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Shoulder Mobility",
      "url": "https://gmb.io/shoulder-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_scap_circles",
    "cz": "Kroužení lopatkami v opoře na čtyřech",
    "en": "Quadruped Scapular Circles",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "serr",
      "tra"
    ],
    "ms": [
      "sho"
    ],
    "S": 1,
    "C": 3,
    "family": "crawl",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "gm_scap_retract_quad",
    "pos": [
      "Zaujmi oporu na dlaních a kolenou, lokty nech natažené bez násilného propnutí.",
      "Set up on palms and knees with elbows extended without forceful locking."
    ],
    "exe": [
      "Malým pohybem hrudníku spoj přiblížení a oddálení lopatek s posunem ramen k uším a od nich do plynulého kruhu. Vystřídej směr.",
      "Use small chest movements to combine shoulder-blade retraction and protraction with shoulder elevation and depression into a smooth circle. Reverse direction."
    ],
    "wat": [
      "Lokty neohýbej a nekruž celou pánví. Pohyb má zůstat malý a řízený.",
      "Do not bend elbows or circle the whole pelvis. Keep the movement small and controlled."
    ],
    "pro": [
      "Lehčí: každý směr procvič odděleně. Těžší: spoj kruh plynule bez změny polohy loktů.",
      "Easier: practise each direction separately. Harder: link the circle smoothly without changing elbow position."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_scap_circles",
    "hd": null,
    "foc": [
      "Malým pohybem hrudníku spoj přiblížení a oddálení lopatek s posunem ramen k uším a od nich do plynulého kruhu.",
      "Use small chest movements to combine shoulder-blade retraction and protraction with shoulder elevation and depression into a smooth circle."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Shoulder Mobility",
      "url": "https://gmb.io/shoulder-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_wall_liftoff",
    "cz": "Vzpažení u zdi s aktivním odlehčením rukou",
    "en": "Wall Slide with Lift-Off",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "sho",
      "serr"
    ],
    "ms": [
      "tra"
    ],
    "S": 2,
    "C": 3,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "wallext",
    "pos": [
      "Stůj čelem ke zdi s předloktími opřenými před tělem. Žebra udrž nad pánví.",
      "Face a wall with forearms resting in front of you and ribs stacked over the pelvis."
    ],
    "exe": [
      "Posuň předloktí vzhůru. V nejvyšší pohodlné poloze ruce lehce oddal od zdi, vrať a sjeď dolů.",
      "Slide forearms upward. At the highest comfortable point, gently lift hands away from the wall, replace them and slide down."
    ],
    "wat": [
      "Ruce odlehčuj rameny, nikoli záklonem. Výška nemusí být maximální.",
      "Lift through the shoulders rather than arching the back. Maximum height is unnecessary."
    ],
    "pro": [
      "Lehčí: jen posun po zdi. Těžší: výdrž mimo zeď prodluž o několik sekund při klidných bedrech a plynulém dechu.",
      "Easier: slide only. Harder: extend the hold away from the wall by a few seconds while keeping the lower back steady and breathing freely."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_wall_liftoff",
    "hd": null,
    "foc": [
      "Posuň předloktí vzhůru.",
      "Slide forearms upward."
    ],
    "source": {
      "author": "Ryan Nosak / The Prehab Guys",
      "document": "Must-Do Exercises to Master Overhead Lifting",
      "url": "https://theprehabguys.com/blog/must-do-exercises-to-master-overhead-lifting/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_lumbar_locked",
    "cz": "Rotace hrudníku s pánví u pat",
    "en": "Lumbar-Locked Thoracic Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "upb",
      "obl"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "spinal_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "openbook",
    "pos": [
      "Z kleku posaď pánev k patám a opři předloktí. Jednu dlaň polož na zátylek.",
      "From kneeling, sit the hips toward the heels and support the forearms. Place one hand behind the head."
    ],
    "exe": [
      "Otáčej horní část hrudníku a volný loket ke stropu. Pomalu se vrať dolů.",
      "Rotate the upper chest and free elbow toward the ceiling, then return slowly."
    ],
    "wat": [
      "Pánev zůstává u pat. Netlač rukou do hlavy a pohyb nedoháněj úklonem.",
      "Keep the pelvis near the heels. Do not push on the head or substitute side-bending."
    ],
    "pro": [
      "Lehčí: menší rotace a ruka na hrudníku. Těžší: krátká aktivní výdrž v horní poloze.",
      "Easier: reduce rotation and keep the hand on the chest. Harder: briefly hold the upper position actively."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_lumbar_locked",
    "hd": null,
    "foc": [
      "Otáčej horní část hrudníku a volný loket ke stropu.",
      "Rotate the upper chest and free elbow toward the ceiling, then return slowly."
    ],
    "source": {
      "author": "Functional Movement Systems",
      "document": "Quadruped T-Spine Rotation Lumbar Locked",
      "url": "https://www.functionalmovement.com/exercises/491/quadruped_t-spine_rotation_lumbar_locked",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_side_windmill",
    "cz": "Kruh paží vleže na boku s rotací hrudníku",
    "en": "Side-Lying Windmill",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "upb",
      "sho"
    ],
    "ms": [
      "obl"
    ],
    "S": 1,
    "C": 2,
    "family": "spinal_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "openbook",
    "pos": [
      "Lehni na bok, horní koleno polož pokrčené před tělo na podložku. Hlavu pohodlně podepři spodní paží nebo polštářkem.",
      "Lie on your side with the bent top knee supported in front. Support the head comfortably with the lower arm or a small pillow."
    ],
    "exe": [
      "Horní rukou opiš široký pomalý kruh nad hlavou a za tělem. Hrudník se smí otáčet, koleno zůstává podepřené.",
      "Trace a broad slow circle with the top hand overhead and behind the body. Let the chest rotate while the knee stays supported."
    ],
    "wat": [
      "Ruku netlač násilím na zem. Zkrať kruh při nepříjemném tahu v rameni.",
      "Do not force the hand to the floor. Shorten the circle if the shoulder feels uncomfortable."
    ],
    "pro": [
      "Lehčí: menší oblouk. Těžší: plynulý celý kruh při klidné pánvi.",
      "Easier: use a smaller arc. Harder: complete a smooth full circle with a steady pelvis."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_side_windmill",
    "hd": null,
    "foc": [
      "Horní rukou opiš široký pomalý kruh nad hlavou a za tělem.",
      "Trace a broad slow circle with the top hand overhead and behind the body."
    ],
    "source": {
      "author": "Runna",
      "document": "Dynamic Side Lying Windmills Exercise Tutorial",
      "url": "https://support.runna.com/en/articles/8791632-dynamic-side-lying-windmills-exercise-tutorial",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_seated_rotation",
    "cz": "Aktivní rotace hrudníku v sedu",
    "en": "Seated Thoracic Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "upb",
      "obl"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "spinal_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "pos": [
      "Sedni na pevnou židli s chodidly na zemi. Paže překřiž na hrudníku.",
      "Sit on a firm chair with feet grounded and arms crossed over the chest."
    ],
    "exe": [
      "Otoč hrudník pomalu na jednu stranu, vrať doprostřed a vystřídej. Pánev ponech v kontaktu se sedákem.",
      "Slowly turn the chest to one side, return to centre and alternate, keeping the pelvis in contact with the seat."
    ],
    "wat": [
      "Neodrážej se rukama od opěradla a nepřeklápěj se do strany.",
      "Do not pull against the backrest or tilt sideways."
    ],
    "pro": [
      "Lehčí: menší otočení. Těžší: krátká výdrž v aktivním rozsahu s pažemi před hrudníkem.",
      "Easier: turn less. Harder: pause in the active range with arms held in front of the chest."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_seated_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Otoč hrudník pomalu na jednu stranu, vrať doprostřed a vystřídej.",
      "Slowly turn the chest to one side, return to centre and alternate, keeping the pelvis in contact with the seat."
    ],
    "source": {
      "author": "Dynamic Health NHS",
      "document": "Mid-back pain — movement exercises",
      "url": "https://dynamichealth.nhs.uk/help-and-advice/mid-back-pain/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_chair_extension",
    "cz": "Napřímení hrudníku přes opěradlo židle",
    "en": "Thoracic Extension over Chair",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "upb"
    ],
    "ms": [
      "abs"
    ],
    "S": 1,
    "C": 1,
    "family": "spinal_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Sedni na stabilní židli s opěradlem pod lopatkami. Dlaně polož za hlavu nebo překřiž na hrudníku.",
      "Sit on a stable chair with the backrest below the shoulder blades. Place hands behind the head or across the chest."
    ],
    "exe": [
      "Jemně se přes opěradlo napřim do záklonu v horní části zad. Vrať se do vzpřímeného sedu.",
      "Gently extend the upper back over the backrest, then return to upright sitting."
    ],
    "wat": [
      "Opěradlo nesmí tlačit ostrou hranou. Nedoháněj rozsah prudkým záklonem krku ani beder.",
      "Avoid a sharp backrest edge. Do not gain range by abruptly extending the neck or lower back."
    ],
    "pro": [
      "Lehčí: malý pohyb s pažemi na hrudníku. Těžší: plynulý návrat s rukama za hlavou.",
      "Easier: use a small movement with arms crossed. Harder: return smoothly with hands behind the head."
    ],
    "J": {
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_chair_extension",
    "hd": null,
    "foc": [
      "Jemně se přes opěradlo napřim do záklonu v horní části zad.",
      "Gently extend the upper back over the backrest, then return to upright sitting."
    ],
    "source": {
      "author": "NHS OPAL",
      "document": "Seated thoracic extension",
      "url": "https://www.opalreturntowork.nhs.uk/exercises/seated-thoracic-extension/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_roller_angels",
    "cz": "Oblouky pažemi na podélném válci",
    "en": "Longitudinal Foam-Roller Arm Angels",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "valec"
    ],
    "mp": [
      "sho",
      "che"
    ],
    "ms": [
      "upb"
    ],
    "S": 1,
    "C": 2,
    "family": "shoulder_mobility",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_snow_angel",
    "pos": [
      "Lehni podélně na dlouhý válec tak, aby podpíral pánev, záda i hlavu. Chodidla dej široce na zem.",
      "Lie lengthwise on a long foam roller supporting pelvis, back and head. Plant feet wide on the floor."
    ],
    "exe": [
      "S dlaněmi vzhůru veď paže pomalým obloukem od boků nad hlavu a zpět.",
      "With palms facing up, sweep arms slowly from the sides toward overhead and back."
    ],
    "wat": [
      "Válec nesmí končit pod krkem bez opory hlavy. Ruce nemusejí dosáhnout až na zem.",
      "The roller must not end beneath an unsupported neck. Hands need not reach the floor."
    ],
    "pro": [
      "Lehčí: stejný pohyb přímo na zemi. Těžší: kratší aktivní výdrž v nejvyšším pohodlném vzpažení.",
      "Easier: perform on the floor. Harder: briefly hold the highest comfortable arm position actively."
    ],
    "J": {
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_roller_angels",
    "hd": null,
    "foc": [
      "S dlaněmi vzhůru veď paže pomalým obloukem od boků nad hlavu a zpět.",
      "With palms facing up, sweep arms slowly from the sides toward overhead and back."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "How to Increase Upper-body Stability and Mobility",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/5412/how-to-increase-upper-body-stability-and-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_adductor_rock",
    "cz": "Přenášení pánve vzad s nohou do strany",
    "en": "Adductor Rock-Back",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "add"
    ],
    "ms": [
      "ham"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Na čtyřech natáhni jednu nohu do strany a polož chodidlo na zem. Druhé koleno zůstává pod bokem.",
      "From all fours, extend one leg sideways with foot grounded. Keep the other knee beneath the hip."
    ],
    "exe": [
      "Posouvej pánev pomalu směrem k patě pokrčené nohy a zpět. V natažené noze vnímej mírný tah na vnitřní straně stehna.",
      "Slowly shift hips toward the bent-leg heel and return, feeling a mild inner-thigh stretch in the straight leg."
    ],
    "wat": [
      "Neotáčej pánev za nataženou nohou. Při tlaku v třísle zkrať rozsah.",
      "Do not turn the pelvis toward the straight leg. Reduce range if the groin feels pinched."
    ],
    "pro": [
      "Lehčí: menší rozkročení. Těžší: větší řízený posun pánve bez kulacení beder.",
      "Easier: narrow the stance. Harder: increase controlled hip travel without rounding the lower back."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_adductor_rock",
    "ez": null,
    "hd": null,
    "foc": [
      "Posouvej pánev pomalu směrem k patě pokrčené nohy a zpět.",
      "Slowly shift hips toward the bent-leg heel and return, feeling a mild inner-thigh stretch in the straight leg."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Adductor Rock Back with Hamstring Bias and Open Book",
      "url": "https://theprehabguys.com/vimeo-video/adductor-rock-backs/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_hip_ir_liftoff",
    "cz": "Aktivní zdvih zadního chodidla v sedu 90/90",
    "en": "90/90 Rear-Foot Internal-Rotation Lift-Off",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "hip9090",
    "pos": [
      "Sedni do pohodlné polohy 90/90 a opři se rukama. Zadní koleno ponech na zemi.",
      "Sit in a comfortable 90/90 position with hand support. Keep the rear knee grounded."
    ],
    "exe": [
      "Aktivně zvedni chodidlo zadní nohy několik centimetrů, aniž zvedneš její koleno. Pomalu polož.",
      "Actively lift the rear foot a few centimetres without lifting its knee, then lower slowly."
    ],
    "wat": [
      "Neotáčej celou pánev a nenuť koleno do nepříjemného tlaku.",
      "Do not turn the whole pelvis or force uncomfortable pressure through the knee."
    ],
    "pro": [
      "Lehčí: trup nakloň dál od zadní nohy a použij ruce. Těžší: menší pomoc rukou a krátká výdrž.",
      "Easier: lean farther away from the rear leg and use the hands. Harder: reduce hand support and pause briefly."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_hip_ir_liftoff",
    "hd": null,
    "foc": [
      "Aktivně zvedni chodidlo zadní nohy několik centimetrů, aniž zvedneš její koleno.",
      "Actively lift the rear foot a few centimetres without lifting its knee, then lower slowly."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "FRC Principle: Passive end range holds, lift offs, and hovers",
      "url": "https://library.theprehabguys.com/vimeo-video/frc-principle-passive-end-range-holds-lift-offs-and-hovers/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_hip_er_liftoff",
    "cz": "Aktivní zdvih předního chodidla v sedu 90/90",
    "en": "90/90 Front-Foot External-Rotation Lift-Off",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 2,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "hip9090",
    "pos": [
      "V sedu 90/90 se opři rukama vedle přední nohy. Přední koleno zůstává v kontaktu se zemí.",
      "In 90/90 sitting, support hands beside the front leg. Keep the front knee in contact with the floor."
    ],
    "exe": [
      "Odlehči a zvedni přední chodidlo, koleno přitom nech na místě. Pomalu vrať.",
      "Unload and lift the front foot while keeping its knee in place, then lower slowly."
    ],
    "wat": [
      "Stačí malý zdvih. Nevytáčej kotník místo pohybu v kyčli.",
      "A small lift is enough. Do not twist the ankle instead of moving at the hip."
    ],
    "pro": [
      "Lehčí: větší opora rukou a jen odlehčení. Těžší: vzpřímenější trup a krátké zastavení nahoře.",
      "Easier: use more hand support and only unload the foot. Harder: sit more upright and pause at the top."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_hip_er_liftoff",
    "hd": null,
    "foc": [
      "Odlehči a zvedni přední chodidlo, koleno přitom nech na místě.",
      "Unload and lift the front foot while keeping its knee in place, then lower slowly."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "FRC Principle: Passive end range holds, lift offs, and hovers",
      "url": "https://library.theprehabguys.com/vimeo-video/frc-principle-passive-end-range-holds-lift-offs-and-hovers/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_shinbox_rise",
    "cz": "Vztyk z polohy 90/90 do kleku",
    "en": "Shinbox Hip Rise",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "abs",
      "qua"
    ],
    "S": 2,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "hip9090",
    "pos": [
      "Sedni do polohy 90/90 s pohodlně pokrčenými koleny. Dlaně můžeš položit vedle těla.",
      "Sit in a comfortable 90/90 position. Hands may rest beside the body."
    ],
    "exe": [
      "Přenes váhu přes kolena a zvedni pánev do vyššího kleku. Pomalu se vrať do stejného sedu.",
      "Shift weight over the knees and raise the pelvis into a higher kneeling position, then lower into the same sit."
    ],
    "wat": [
      "Nenuť chodidla ani kolena do krajní rotace. Zdvih má vycházet z kyčlí.",
      "Do not force feet or knees into extreme rotation. Lift through the hips."
    ],
    "pro": [
      "Lehčí: pomáhej si dlaněmi. Těžší: zvedej se bez rukou a zpomal návrat.",
      "Easier: assist with the palms. Harder: rise without the hands and slow the return."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_shinbox_rise",
    "hd": null,
    "foc": [
      "Přenes váhu přes kolena a zvedni pánev do vyššího kleku.",
      "Shift weight over the knees and raise the pelvis into a higher kneeling position, then lower into the same sit."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Hip Mobility Exercises",
      "url": "https://gmb.io/hip-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_prone_hip_rotation",
    "cz": "Aktivní rotace kyčle vleže na břiše",
    "en": "Prone Active Hip Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "add"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Lehni na břicho a jedno koleno pokrč do pravého úhlu. Stehno i pánev nech na zemi.",
      "Lie prone and bend one knee to a right angle, keeping the thigh and pelvis grounded."
    ],
    "exe": [
      "Pomalu veď chodidlo do strany a zpět přes svislou polohu mírně dovnitř. Pohyb vzniká otáčením stehna v kyčli.",
      "Slowly move the foot outward and back through vertical slightly inward, rotating the thigh at the hip."
    ],
    "wat": [
      "Koleno neposouvej do strany a nehýbej celou pánví. Chodidlo ven znamená vnitřní rotaci kyčle.",
      "Do not shift the knee sideways or move the whole pelvis. Moving the foot outward produces hip internal rotation."
    ],
    "pro": [
      "Lehčí: malý oblouk. Těžší: krátká aktivní pauza na obou koncích rozsahu.",
      "Easier: shorten the arc. Harder: pause actively at both ends."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_prone_hip_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu veď chodidlo do strany a zpět přes svislou polohu mírně dovnitř.",
      "Slowly move the foot outward and back through vertical slightly inward, rotating the thigh at the hip."
    ],
    "source": {
      "author": "Sports Injury Bulletin",
      "document": "Masterclass: Femoro-acetabular impingement, part II — active hip rotation",
      "url": "https://www.sportsinjurybulletin.com/anatomy/masterclass-femoro-acetabular-impingement-fai-part-ii",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_seated_hip_rotation",
    "cz": "Aktivní vnitřní a zevní rotace kyčle v sedu",
    "en": "Seated Active Hip Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "glu"
    ],
    "ms": [
      "add"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni na vyšší lavičku, stehno opři a koleno ohni do pravého úhlu. Chodidlo pracující nohy může volně viset.",
      "Sit on a higher bench with the thigh supported and knee bent to a right angle. Let the working foot hang freely."
    ],
    "exe": [
      "Drž stehno na místě a pohybuj chodidlem pomalu ven a dovnitř.",
      "Keep the thigh still while slowly moving the foot outward and inward."
    ],
    "wat": [
      "Neposouvej celé koleno do stran. Pohyb nemá vznikat jen kroucením kotníku.",
      "Do not move the entire knee sideways. The movement should not come only from twisting the ankle."
    ],
    "pro": [
      "Lehčí: menší rozsah s rukama kontrolujícíma stehno. Těžší: krátká výdrž na konci každého směru.",
      "Easier: use a smaller range with hands monitoring the thigh. Harder: briefly hold each end position."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_seated_hip_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Drž stehno na místě a pohybuj chodidlem pomalu ven a dovnitř.",
      "Keep the thigh still while slowly moving the foot outward and inward."
    ],
    "source": {
      "author": "Sports Injury Bulletin",
      "document": "Masterclass: Femoro-acetabular impingement, part II — active hip rotation",
      "url": "https://www.sportsinjurybulletin.com/anatomy/masterclass-femoro-acetabular-impingement-fai-part-ii",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_leg_swing_sagittal",
    "cz": "Kontrolované kývání nohou vpřed a vzad",
    "en": "Supported Front-to-Back Leg Swing",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "ham"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Postav se bokem k pevné opoře a lehce se přidrž. Volnou nohu nech uvolněnou.",
      "Stand sideways beside a firm support and hold lightly, keeping the free leg relaxed."
    ],
    "exe": [
      "Veď nohu plynule vpřed a vzad v malém oblouku. Rozsah zvětšuj postupně bez švihu trupu.",
      "Move the leg smoothly forward and backward through a small arc, increasing range gradually without swinging the trunk."
    ],
    "wat": [
      "Neprohýbej bedra při zanožení a nepropínej stojné koleno silou.",
      "Avoid lumbar arching as the leg moves backward and do not force the standing knee locked."
    ],
    "pro": [
      "Lehčí: menší a pomalejší oblouk. Těžší: větší kontrolovaný rozsah při stále klidné pánvi.",
      "Easier: use a smaller, slower arc. Harder: increase controlled range while keeping the pelvis steady."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_leg_swing_sagittal",
    "ez": null,
    "hd": null,
    "foc": [
      "Veď nohu plynule vpřed a vzad v malém oblouku.",
      "Move the leg smoothly forward and backward through a small arc, increasing range gradually without swinging the trunk."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Hip Mobility Exercises",
      "url": "https://gmb.io/hip-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_leg_swing_lateral",
    "cz": "Kontrolované kývání nohou do stran",
    "en": "Supported Side-to-Side Leg Swing",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "add",
      "glu"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Stůj čelem k pevné opoře, přidrž se oběma rukama a odlehči jednu nohu.",
      "Face a firm support, hold it with both hands and unload one leg."
    ],
    "exe": [
      "Pohybuj volnou nohou do strany a poté mírně před stojnou nohu. Pánev nech přibližně čelem k opoře.",
      "Swing the free leg sideways and then slightly across in front of the standing leg, keeping the pelvis approximately facing the support."
    ],
    "wat": [
      "Nesnaž se dosáhnout velké výšky úklonem. Stojné chodidlo nepřekrucuj.",
      "Do not gain height by side-bending or twisting the standing foot."
    ],
    "pro": [
      "Lehčí: malý pomalý pohyb. Těžší: plynulý širší oblouk s kontrolovaným zastavením.",
      "Easier: use a small slow movement. Harder: widen the smooth arc with a controlled stop."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_leg_swing_lateral",
    "ez": null,
    "hd": null,
    "foc": [
      "Pohybuj volnou nohou do strany a poté mírně před stojnou nohu.",
      "Swing the free leg sideways and then slightly across in front of the standing leg, keeping the pelvis approximately facing the support."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Hip Mobility Exercises",
      "url": "https://gmb.io/hip-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_travel_butterfly",
    "cz": "Přechody mezi dlouhým sedem a motýlkem",
    "en": "Traveling Butterfly",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "add",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "butterfly",
    "pos": [
      "Sedni s nohama nataženýma před sebe a dlaněmi na zemi vedle boků.",
      "Sit with legs extended in front and palms beside the hips."
    ],
    "exe": [
      "Pokrč nohy, spoj chodidla a s pomocí dlaní posuň pánev k patám do motýlku. Potom se vrať do dlouhého sedu.",
      "Bend the legs, bring soles together and use palms to shift the pelvis toward the heels into butterfly, then return to long sitting."
    ],
    "wat": [
      "Kolena netlač rukama dolů a neseskakuj pánví na zem.",
      "Do not push the knees down with the hands or drop the pelvis abruptly."
    ],
    "pro": [
      "Lehčí: kratší posun a vyšší sed. Těžší: plynulá změna polohy s menší pomocí paží.",
      "Easier: shorten the shift and elevate the seat. Harder: transition smoothly with less arm assistance."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_travel_butterfly",
    "hd": null,
    "foc": [
      "Pokrč nohy, spoj chodidla a s pomocí dlaní posuň pánev k patám do motýlku.",
      "Bend the legs, bring soles together and use palms to shift the pelvis toward the heels into butterfly, then return to long sitting."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Hip Mobility Exercises",
      "url": "https://gmb.io/hip-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_squat_hip_ir",
    "cz": "Řízené sklopení kolena v podřepu",
    "en": "Supported Squat Hip Internal Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "glu",
      "add"
    ],
    "ms": [],
    "S": 1,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Sedni na nízkou pevnou stoličku do pohodlného podřepu. Chodidla dej širší než boky.",
      "Sit on a low firm stool in a comfortable squat position with feet wider than hips."
    ],
    "exe": [
      "Bez přenesení plné váhy pomalu sklop jedno koleno dovnitř a dovol chodidlu otáčet se s ním. Vrať a vystřídej.",
      "Without loading the leg fully, slowly rotate one knee inward, allowing the foot to turn with it. Return and alternate."
    ],
    "wat": [
      "Jde o odlehčenou rotaci kyčle, ne o vbočení zatíženého kolena při dřepu. Pohyb nesmí bolet v koleni.",
      "This is an unloaded hip rotation, not a loaded knee collapse during a squat. It must not hurt the knee."
    ],
    "pro": [
      "Lehčí: vyšší sed a menší úhel. Těžší: nižší opora při zachování odlehčené rotace.",
      "Easier: use a higher seat and smaller angle. Harder: lower the support while retaining an unloaded rotation."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_squat_hip_ir",
    "hd": null,
    "foc": [
      "Bez přenesení plné váhy pomalu sklop jedno koleno dovnitř a dovol chodidlu otáčet se s ním.",
      "Without loading the leg fully, slowly rotate one knee inward, allowing the foot to turn with it."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "Hip Mobility Exercises",
      "url": "https://gmb.io/hip-mobility/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_supine_hip_circle",
    "cz": "Kroužení nataženou nohou vleže",
    "en": "Supine Leg Circle",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "hipflex",
      "glu"
    ],
    "ms": [
      "abs"
    ],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Lehni na záda, jednu nohu pokrč a opři chodidlo. Druhou zvedni s pohodlně nataženým kolenem.",
      "Lie supine with one foot planted and knee bent. Raise the other leg with the knee comfortably straight."
    ],
    "exe": [
      "Zvednutou nohou opiš malý kruh v kyčli. Po několika opakováních změň směr.",
      "Draw a small circle from the raised hip, then change direction after a few repetitions."
    ],
    "wat": [
      "Pánev nepřeklápěj ze strany na stranu. Kruh zmenši dříve, než ztratíš oporu zad.",
      "Do not roll the pelvis side to side. Reduce the circle before losing back support."
    ],
    "pro": [
      "Lehčí: pokrčenější koleno a malý kruh. Těžší: pomalu zvětšuj kruh při klidné pánvi.",
      "Easier: bend the knee more and use a small circle. Harder: slowly enlarge the circle with a steady pelvis."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_supine_hip_circle",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvednutou nohou opiš malý kruh v kyčli.",
      "Draw a small circle from the raised hip, then change direction after a few repetitions."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Supine Leg Circle",
      "url": "https://library.theprehabguys.com/vimeo-video/supine-leg-circle/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_pike_compression",
    "cz": "Aktivní zdvih natažené nohy v sedu",
    "en": "Seated Single-Leg Compression Lift",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "hipflex",
      "qua"
    ],
    "ms": [
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni na zem, jednu nohu natáhni a druhé koleno přitáhni pažemi k trupu.",
      "Sit on the floor with one leg straight, hugging the opposite bent knee toward the trunk."
    ],
    "exe": [
      "Zvedni patu natažené nohy několik centimetrů a pomalu ji polož. Pánev zůstává na zemi.",
      "Lift the straight-leg heel a few centimetres and lower slowly, keeping the pelvis grounded."
    ],
    "wat": [
      "Nezakláněj trup a nepokrčuj koleno jen kvůli větší výšce.",
      "Do not lean backward or bend the knee just to gain height."
    ],
    "pro": [
      "Lehčí: lehce pokrč pracující koleno. Těžší: krátce podrž patu ve vzduchu bez zaklonění.",
      "Easier: soften the working knee. Harder: briefly hold the heel airborne without leaning back."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_pike_compression",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedni patu natažené nohy několik centimetrů a pomalu ji polož.",
      "Lift the straight-leg heel a few centimetres and lower slowly, keeping the pelvis grounded."
    ],
    "source": {
      "author": "Ryan Hurst / GMB Fitness",
      "document": "L-Sit Progression — seated leg raises",
      "url": "https://gmb.io/l-sit/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_straddle_compression",
    "cz": "Zdvih nohy v širokém sedu",
    "en": "Unilateral Straddle Compression",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "hipflex",
      "qua"
    ],
    "ms": [
      "abs",
      "add"
    ],
    "S": 2,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni s nohama pohodlně od sebe. Dlaně opři po stranách jednoho stehna.",
      "Sit with legs comfortably apart. Plant palms on either side of one thigh."
    ],
    "exe": [
      "Bez záklonu zvedni nataženou nohu kousek od země. Vrať a po sérii vyměň stranu.",
      "Lift the straight leg slightly without leaning back, then lower and switch sides after the set."
    ],
    "wat": [
      "Šířka sedu nesmí nutit pánev do nepříjemného tahu. Pata může stoupat jen nepatrně.",
      "Do not force an uncomfortable straddle width. A tiny heel lift is sufficient."
    ],
    "pro": [
      "Lehčí: zúžení sedu a mírné pokrčení kolena. Těžší: posuň dlaně dále vpřed při zachování opory pánve.",
      "Easier: narrow the straddle and soften the knee. Harder: move palms farther forward while keeping the pelvis grounded."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_straddle_compression",
    "ez": null,
    "hd": null,
    "foc": [
      "Bez záklonu zvedni nataženou nohu kousek od země.",
      "Lift the straight leg slightly without leaning back, then lower and switch sides after the set."
    ],
    "source": {
      "author": "Move More",
      "document": "Unilateral straddle compression",
      "url": "https://www.movemorevrl.com/videos/unilateral-straddle-compression",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_knee_hug_release",
    "cz": "Aktivní udržení vysokého kolena po dopomoci",
    "en": "Standing Hip-Flexion End-Range Hold",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "hipflex"
    ],
    "ms": [
      "abs",
      "glu"
    ],
    "S": 2,
    "C": 3,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Ve stoji přitáhni jedno koleno rukama do pohodlné výšky. Zůstaň vzpřímeně nad stojnou nohou.",
      "Standing tall, assist one knee to a comfortable height with the hands. Stay balanced over the supporting leg."
    ],
    "exe": [
      "Povol dopomoc rukou a pokus se nohu krátce udržet vlastní silou. Kontrolovaně ji spusť.",
      "Release hand assistance and briefly maintain the leg height actively, then lower under control."
    ],
    "wat": [
      "Nevyvažuj polohu záklonem. Při ztrátě rovnováhy se přidrž opory nebo cvič vsedě.",
      "Avoid leaning back. Use a support or sit if balance is limiting."
    ],
    "pro": [
      "Lehčí: nižší koleno a jedna ruka u opory. Těžší: delší klidná výdrž bez pomoci.",
      "Easier: lower the knee and use one hand for support. Harder: hold steadily for longer without assistance."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_knee_hug_release",
    "ez": null,
    "hd": null,
    "foc": [
      "Povol dopomoc rukou a pokus se nohu krátce udržet vlastní silou.",
      "Release hand assistance and briefly maintain the leg height actively, then lower under control."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "FRC Principle: Passive end range holds, lift offs, and hovers",
      "url": "https://library.theprehabguys.com/vimeo-video/frc-principle-passive-end-range-holds-lift-offs-and-hovers/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_halfkneel_groin",
    "cz": "Boční posun v polokleku pro kyčle",
    "en": "Half-Kneeling Groin Opener",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "add",
      "glu"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Klekni na jedno koleno. Druhé chodidlo polož šikmo před sebe do strany, koleno sleduje směr prstů.",
      "Kneel on one knee and place the other foot diagonally forward and outward, knee following the toes."
    ],
    "exe": [
      "Pomalu přenes pánev směrem k opřenému chodidlu a vrať se. Rozsah udrž v pohodlném tahu v tříslech.",
      "Slowly shift the pelvis toward the planted foot and return, staying within a comfortable groin stretch."
    ],
    "wat": [
      "Neotáčej trup místo pohybu kyčle a nepropadej kolenem dovnitř.",
      "Avoid substituting trunk rotation or collapsing the knee inward."
    ],
    "pro": [
      "Lehčí: užší postavení s oporou rukou. Těžší: větší řízený posun bez pomoci paží.",
      "Easier: narrow the position and use hand support. Harder: increase controlled travel without arm assistance."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_halfkneel_groin",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu přenes pánev směrem k opřenému chodidlu a vrať se.",
      "Slowly shift the pelvis toward the planted foot and return, staying within a comfortable groin stretch."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Half Kneeling Groin Opener",
      "url": "https://library.theprehabguys.com/vimeo-video/half-kneeling-groin-opener/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_supine_active_kneeext",
    "cz": "Aktivní napínání kolena s podepřeným stehnem",
    "en": "Supine Active Hamstring Mobilization",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "ham",
      "qua"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "hip_rotation_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Lehni na záda a rukama podepři jedno stehno přibližně svisle. Druhé chodidlo může zůstat na zemi.",
      "Lie supine and support one thigh near vertical with the hands. The other foot may remain planted."
    ],
    "exe": [
      "Pomalu napni zvednuté koleno do mírného tahu a znovu ho pokrč. Stehno drž na místě.",
      "Slowly straighten the raised knee until a mild stretch, then bend again while keeping the thigh still."
    ],
    "wat": [
      "Koleno nedopínej švihem. Chodidlo nech uvolněné a při brnění zmenši rozsah.",
      "Do not snap the knee straight. Keep the foot relaxed and reduce range if tingling occurs."
    ],
    "pro": [
      "Lehčí: stehno dál od hrudníku. Těžší: aktivní krátká výdrž v pohodlném napnutí kolena.",
      "Easier: move the thigh farther from the chest. Harder: briefly hold a comfortable straightened-knee position actively."
    ],
    "J": {
      "kyc": 2
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_supine_active_kneeext",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu napni zvednuté koleno do mírného tahu a znovu ho pokrč.",
      "Slowly straighten the raised knee until a mild stretch, then bend again while keeping the thigh still."
    ],
    "source": {
      "author": "Humber Teaching NHS Foundation Trust",
      "document": "iBeST patient workbook — hamstring movement, page 12",
      "url": "https://www.humber.nhs.uk/media/1flpvsw5/patient-workbook.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_toe_yoga",
    "cz": "Oddělený zdvih palce a ostatních prstů",
    "en": "Toe Yoga",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 3,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni bosky s celým chodidlem na zemi. Patu a přednoží nech v kontaktu s podlahou.",
      "Sit barefoot with the whole foot grounded, retaining heel and forefoot contact."
    ],
    "exe": [
      "Zvedni palec a ostatní prsty ponech dole. Potom palec polož a zvedni zbývající čtyři prsty.",
      "Raise the big toe while keeping the other toes down, then lower it and lift the other four toes."
    ],
    "wat": [
      "Neotáčej celé chodidlo na hranu a nezadržuj dech při soustředění.",
      "Do not roll the whole foot onto its edge or hold the breath while concentrating."
    ],
    "pro": [
      "Lehčí: nepohybující prsty jemně přidrž rukou. Těžší: proveď ve stoji bez pomoci.",
      "Easier: gently hold the stationary toes with a hand. Harder: perform standing without assistance."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_toe_yoga",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedni palec a ostatní prsty ponech dole.",
      "Raise the big toe while keeping the other toes down, then lower it and lift the other four toes."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Foot and Ankle Strength",
      "url": "https://e3rehab.com/foot-ankle-strength/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_toe_spreadout",
    "cz": "Rozevření prstů s postupným položením",
    "en": "Toe Spread-Out",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 3,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "V sedu opři patu i přednoží bosé nohy. Prsty nejprve uvolni.",
      "Seated barefoot, ground the heel and forefoot and relax the toes."
    ],
    "exe": [
      "Zvedni a rozevři prsty. Pokládej je postupně od malíku k palci a snaž se zachovat šířku.",
      "Lift and spread the toes, then lower them from little toe toward big toe while retaining width."
    ],
    "wat": [
      "Nesvírej prsty do drápů a neodvaluj chodidlo ven.",
      "Do not claw the toes or roll the foot outward."
    ],
    "pro": [
      "Lehčí: roztažení s jemnou pomocí ruky. Těžší: stejná kontrola ve stoji.",
      "Easier: assist the spreading gently by hand. Harder: maintain the same control standing."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_toe_spreadout",
    "ez": null,
    "hd": null,
    "foc": [
      "Zvedni a rozevři prsty.",
      "Lift and spread the toes, then lower them from little toe toward big toe while retaining width."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Foot and Ankle Strength",
      "url": "https://e3rehab.com/foot-ankle-strength/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_shortfoot",
    "cz": "Aktivní zkrácení chodidla bez krčení prstů",
    "en": "Short-Foot Exercise",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 3,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni a opři patu, kořen palce i malíku. Prsty nech dlouhé na podlaze.",
      "Sit with heel and bases of the big and little toes supported, keeping toes long on the floor."
    ],
    "exe": [
      "Jemně přitáhni přednoží směrem k patě, jako bys chodidlo zkracoval. Klenba se mírně zvedne, pak povol.",
      "Gently draw the forefoot toward the heel as if shortening the foot. Let the arch rise slightly, then relax."
    ],
    "wat": [
      "Nezvedej kořen palce a nezakrucuj prsty. Malý pohyb je dostačující.",
      "Do not lift the big-toe base or curl the toes. A small movement is sufficient."
    ],
    "pro": [
      "Lehčí: jen lehké napětí v sedu. Těžší: přejdi do stoje a později na jednu nohu.",
      "Easier: use gentle seated tension. Harder: progress to standing, then single-leg standing."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_shortfoot",
    "ez": null,
    "hd": null,
    "foc": [
      "Jemně přitáhni přednoží směrem k patě, jako bys chodidlo zkracoval.",
      "Gently draw the forefoot toward the heel as if shortening the foot."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Foot and Ankle Strength",
      "url": "https://e3rehab.com/foot-ankle-strength/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_anklecircle_toesflexed",
    "cz": "Kroužení kotníku se skrčenými prsty",
    "en": "Ankle Circles with Toes Flexed",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot",
      "cal"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "V sedu polož kotník přes druhé koleno nebo podepři lýtko. Prsty jemně skrč.",
      "Seated, cross the ankle over the other knee or support the calf. Curl the toes gently."
    ],
    "exe": [
      "Kotníkem opisuj pomalé malé kruhy oběma směry a snaž se udržet prsty lehce skrčené.",
      "Trace slow small ankle circles both ways while keeping the toes lightly curled."
    ],
    "wat": [
      "Netlač do křeče. Pohyb nevytvářej otáčením celého kolena.",
      "Do not push into cramping or generate movement by turning the entire knee."
    ],
    "pro": [
      "Lehčí: uvolni prsty a zmenši kruh. Těžší: plynulejší větší kruh při klidné holeni.",
      "Easier: relax the toes and reduce the circle. Harder: make a larger smooth circle with the shin still."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_anklecircle_toesflexed",
    "ez": null,
    "hd": null,
    "foc": [
      "Kotníkem opisuj pomalé malé kruhy oběma směry a snaž se udržet prsty lehce skrčené.",
      "Trace slow small ankle circles both ways while keeping the toes lightly curled."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "4 Exercises to Fix Stiff Ankles",
      "url": "https://gmb.io/stiff-ankles/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_toe_ankle_coordination",
    "cz": "Koordinace kotníku a prstů opačným směrem",
    "en": "Toe–Ankle Coordination",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot",
      "tib",
      "cal"
    ],
    "ms": [],
    "S": 1,
    "C": 3,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni a podepři lýtko tak, aby se kotník mohl volně hýbat.",
      "Sit with the calf supported and the ankle free to move."
    ],
    "exe": [
      "Při přitažení chodidla k holeni prsty jemně skrč. Potom propni kotník od sebe a prsty natáhni vzhůru.",
      "Curl the toes as the ankle moves toward the shin, then point the ankle away while extending the toes upward."
    ],
    "wat": [
      "Odděluj pohyb kotníku od prstů. Nepřidávej sílu, když se objeví křeč.",
      "Separate ankle and toe movement. Do not add force if cramping starts."
    ],
    "pro": [
      "Lehčí: nacvič každou složku zvlášť. Těžší: plynule střídej oba vzory bez pomoci ruky.",
      "Easier: practise each component separately. Harder: alternate both patterns smoothly without hand assistance."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_toe_ankle_coordination",
    "ez": null,
    "hd": null,
    "foc": [
      "Při přitažení chodidla k holeni prsty jemně skrč.",
      "Curl the toes as the ankle moves toward the shin, then point the ankle away while extending the toes upward."
    ],
    "source": {
      "author": "Jarlo Ilano / GMB Fitness",
      "document": "4 Exercises to Fix Stiff Ankles",
      "url": "https://gmb.io/stiff-ankles/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_heel_circles",
    "cz": "Kroužení kotníku s oporou o patu",
    "en": "Heel-Supported Ankle Circles",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "tib",
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Ve stoji se přidrž a postav jednu patu lehce před tělo. Většinu váhy nech na druhé noze.",
      "Stand holding a support and place one heel slightly ahead, keeping most weight on the other leg."
    ],
    "exe": [
      "S patou na místě opisuj přednožím malé kruhy nad zemí. Směr pravidelně vystřídej.",
      "Keeping the heel in place, draw small circles with the forefoot above the floor, then reverse direction."
    ],
    "wat": [
      "Nezatěžuj pohybující se nohu plnou vahou a neotáčej kolenem místo kotníku.",
      "Avoid loading the moving leg fully or turning the knee instead of moving at the ankle."
    ],
    "pro": [
      "Lehčí: cvič vsedě. Těžší: plynulejší kruh s menší oporou ruky.",
      "Easier: perform seated. Harder: make smoother circles with less hand support."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_heel_circles",
    "ez": null,
    "hd": null,
    "foc": [
      "S patou na místě opisuj přednožím malé kruhy nad zemí.",
      "Keeping the heel in place, draw small circles with the forefoot above the floor, then reverse direction."
    ],
    "source": {
      "author": "GMB Fitness",
      "document": "Body Maintenance Guide, 2023",
      "url": "https://gmb.io/wp-content/uploads/2023/06/Body-Maintenance-Guide-2023.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_forefoot_circles",
    "cz": "Kroužení kotníku s oporou o přednoží",
    "en": "Forefoot-Supported Ankle Circles",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "foot",
      "cal"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Přidrž se opory a odlehčenou nohu postav na přednoží vedle stojné nohy.",
      "Hold a support and rest the unloaded foot on its forefoot beside the supporting leg."
    ],
    "exe": [
      "Přednoží ponech v kontaktu a patou opiš malé kruhy. Koleno se může přirozeně přizpůsobit.",
      "Keep forefoot contact and trace small circles with the heel, allowing the knee to adjust naturally."
    ],
    "wat": [
      "Neklesej plnou vahou na vytočený kotník a nepřetáčej prsty.",
      "Do not load a rolled ankle fully or twist the toes."
    ],
    "pro": [
      "Lehčí: lehký kontakt přednoží v sedu. Těžší: větší plynulost při stále odlehčené noze.",
      "Easier: use light forefoot contact seated. Harder: improve smoothness while keeping the leg unloaded."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_forefoot_circles",
    "ez": null,
    "hd": null,
    "foc": [
      "Přednoží ponech v kontaktu a patou opiš malé kruhy.",
      "Keep forefoot contact and trace small circles with the heel, allowing the knee to adjust naturally."
    ],
    "source": {
      "author": "GMB Fitness",
      "document": "Body Maintenance Guide, 2023",
      "url": "https://gmb.io/wp-content/uploads/2023/06/Body-Maintenance-Guide-2023.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_splitstance_toerock",
    "cz": "Přenášení váhy přes palec v rozkroku",
    "en": "Split-Stance Great-Toe Rock",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "zed"
    ],
    "mp": [
      "foot",
      "cal"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Ve stoji se přidrž a dej jednu nohu za tělo. Zadní pata je nad zemí, prsty směřují dopředu.",
      "Hold a support in a split stance with the rear heel raised and toes facing forward."
    ],
    "exe": [
      "Jemným posunem trupu vpřed zatěžuj zadní přednoží a nech palec postupně přecházet do záklonu. Potom odlehči.",
      "Shift gently forward to load the rear forefoot and extend the big toe gradually, then unload."
    ],
    "wat": [
      "Zadní chodidlo nenech utéct na malíkovou hranu. Netlač do ostré bolesti v kloubu palce.",
      "Do not roll the rear foot onto its outer border or push into sharp big-toe joint pain."
    ],
    "pro": [
      "Lehčí: kratší postoj a méně váhy vzadu. Těžší: pomalý větší rozsah se stejnou oporou.",
      "Easier: shorten the stance and unload the rear foot. Harder: slowly increase range with the same support."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_splitstance_toerock",
    "ez": null,
    "hd": null,
    "foc": [
      "Jemným posunem trupu vpřed zatěžuj zadní přednoží a nech palec postupně přecházet do záklonu.",
      "Shift gently forward to load the rear forefoot and extend the big toe gradually, then unload."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Turf Toe — range of motion exercises",
      "url": "https://e3rehab.com/turf-toe/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_kneeling_toerock",
    "cz": "Odlehčené rozhoupání v kleku na prstech",
    "en": "Kneeling Toe-Extension Rock",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "none",
    "pos": [
      "Klekni na čtyři a podviň prsty nohou. Dlaně i kolena nesou většinu váhy.",
      "Begin on hands and knees with toes tucked under, carrying most weight through palms and knees."
    ],
    "exe": [
      "Pomalu posuň pánev nepatrně k patám a vrať. Sleduj mírný tah pod prsty, ne tlak do bolesti.",
      "Shift the pelvis slightly toward the heels and return, seeking mild tension under the toes without painful pressure."
    ],
    "wat": [
      "Na paty nemusíš dosednout. Přes ostrý tlak v palci nepokračuj.",
      "There is no need to sit onto the heels. Do not continue through sharp big-toe pressure."
    ],
    "pro": [
      "Lehčí: ponech pánev nad koleny a jen mírně přenes váhu vzad s oporou dlaní. Těžší: trochu větší posun při stále podepřeném trupu.",
      "Easier: keep the hips above the knees and make only a small backward shift with palm support. Harder: shift slightly farther while retaining upper-body support."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_kneeling_toerock",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu posuň pánev nepatrně k patám a vrať.",
      "Shift the pelvis slightly toward the heels and return, seeking mild tension under the toes without painful pressure."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Turf Toe — range of motion exercises",
      "url": "https://e3rehab.com/turf-toe/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_bigtoe_manual",
    "cz": "Jemné rozhýbání palce rukou a aktivní návrat",
    "en": "Assisted Great-Toe Range of Motion",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "foot"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "ankle_foot_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "V sedu opři kotník o druhé stehno. Jednou rukou podepři přednoží, druhou uchop palec u jeho kořene.",
      "Seated, rest the ankle on the opposite thigh. Support the forefoot with one hand and hold the big toe near its base with the other."
    ],
    "exe": [
      "Jemně veď palec nahoru a dolů v základním kloubu. Poté ruku povol a stejný směr zkus aktivně.",
      "Guide the big toe gently up and down at its base joint, then release assistance and try the same direction actively."
    ],
    "wat": [
      "Netahej za nehet ani neotáčej celý prst do strany.",
      "Do not pull at the nail or twist the toe sideways."
    ],
    "pro": [
      "Lehčí: menší pohyb s dopomocí. Těžší: větší podíl aktivního pohybu bez ruky.",
      "Easier: use a smaller assisted movement. Harder: perform more of the range actively without the hand."
    ],
    "J": {
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_bigtoe_manual",
    "ez": null,
    "hd": null,
    "foc": [
      "Jemně veď palec nahoru a dolů v základním kloubu.",
      "Guide the big toe gently up and down at its base joint, then release assistance and try the same direction actively."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Turf Toe — range of motion exercises",
      "url": "https://e3rehab.com/turf-toe/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_tendon_glides",
    "cz": "Klouzání šlach prstů v pěti polohách",
    "en": "Finger Tendon-Glide Sequence",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Sedni ke stolu, opři loket a drž zápěstí pohodlně rovně. Začni s nataženými prsty.",
      "Sit at a table with the elbow supported, wrist comfortably straight and fingers extended."
    ],
    "exe": [
      "Postupně vystřídej rovné prsty, háček, plnou pěst, přímou pěst a stříšku v základních kloubech. Mezi polohami ruku otevři.",
      "Cycle through straight fingers, hook, full fist, straight fist and tabletop knuckle bend, opening the hand between shapes."
    ],
    "wat": [
      "Nesvírej pěst maximální silou. Pohyb prstů nenahrazuj ohýbáním zápěstí.",
      "Avoid squeezing maximally or replacing finger movement with wrist bending."
    ],
    "pro": [
      "Lehčí: menší ohnutí a jednotlivé polohy. Těžší: plynulá přesná sekvence bez pomoci.",
      "Easier: use smaller bends and individual shapes. Harder: perform a smooth precise sequence unaided."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_tendon_glides",
    "ez": null,
    "hd": null,
    "foc": [
      "Postupně vystřídej rovné prsty, háček, plnou pěst, přímou pěst a stříšku v základních kloubech.",
      "Cycle through straight fingers, hook, full fist, straight fist and tabletop knuckle bend, opening the hand between shapes."
    ],
    "source": {
      "author": "Gateshead Health NHS Foundation Trust",
      "document": "Hand & Finger Function Exercises",
      "url": "https://www.gatesheadhealth.nhs.uk/resources/hand-finger-function-exercises/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_thumb_opposition",
    "cz": "Spojování palce s jednotlivými prsty",
    "en": "Thumb Opposition",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Opři předloktí a otoč dlaň k sobě. Prsty lehce rozevři.",
      "Support the forearm with the palm facing you and fingers slightly open."
    ],
    "exe": [
      "Bříškem palce se postupně dotýkej bříšek ostatních prstů. Vždy zkus vytvořit oblý kroužek a potom ruku otevři.",
      "Touch the thumb pad to each fingertip in turn, forming a rounded ring before reopening the hand."
    ],
    "wat": [
      "Dotyk má být lehký. Neohýbej celou ruku místo pohybu palce.",
      "Use a light touch without bending the whole hand instead of moving the thumb."
    ],
    "pro": [
      "Lehčí: začni ukazovákem a prostředníkem. Těžší: přesně se dotkni malíku a posuň palec k jeho kořeni.",
      "Easier: begin with index and middle fingers. Harder: accurately reach the little finger and slide toward its base."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_thumb_opposition",
    "ez": null,
    "hd": null,
    "foc": [
      "Bříškem palce se postupně dotýkej bříšek ostatních prstů.",
      "Touch the thumb pad to each fingertip in turn, forming a rounded ring before reopening the hand."
    ],
    "source": {
      "author": "Cambridge University Hospitals NHS Foundation Trust",
      "document": "Hand therapy active thumb exercises",
      "url": "https://www.cuh.nhs.uk/patient-information/hand-therapy-active-thumb-exercises/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_thumb_abduction",
    "cz": "Rozevření palce ve dvou směrech",
    "en": "Thumb Radial and Palmar Abduction",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Podepři předloktí a drž prsty u sebe. Palec začíná vedle ukazováku.",
      "Support the forearm with fingers together and thumb beside the index finger."
    ],
    "exe": [
      "Nejprve rozevři palec do strany v rovině dlaně. Vrať ho a potom jej odtáhni kolmo před dlaň.",
      "First move the thumb sideways in the palm plane. Return it, then move it outward perpendicular to the palm."
    ],
    "wat": [
      "Rozlišuj oba směry a nepomáhej si otáčením předloktí.",
      "Distinguish the two directions without rotating the forearm to compensate."
    ],
    "pro": [
      "Lehčí: menší rozsah po jednom směru. Těžší: plynulé střídání s krátkým aktivním zastavením.",
      "Easier: use a smaller range in one direction at a time. Harder: alternate smoothly with a brief active pause."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_thumb_abduction",
    "ez": null,
    "hd": null,
    "foc": [
      "Nejprve rozevři palec do strany v rovině dlaně.",
      "First move the thumb sideways in the palm plane."
    ],
    "source": {
      "author": "Cambridge University Hospitals NHS Foundation Trust",
      "document": "Hand therapy active thumb exercises",
      "url": "https://www.cuh.nhs.uk/patient-information/hand-therapy-active-thumb-exercises/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_finger_spread",
    "cz": "Aktivní roztažení a spojení prstů ruky",
    "en": "Finger Abduction and Adduction",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Polož dlaň na hladký stůl, prsty natáhni bez násilí.",
      "Rest the palm on a smooth table with fingers comfortably straight."
    ],
    "exe": [
      "Rozevři prsty od sebe a pomalu je spoj. Dlaň zůstává lehce opřená.",
      "Spread the fingers and slowly bring them together while the palm rests lightly."
    ],
    "wat": [
      "Prsty nepropínej přes nepříjemný tlak a rameno nezvedej.",
      "Avoid forcing finger extension or raising the shoulder."
    ],
    "pro": [
      "Lehčí: menší rozevření. Těžší: stejný pohyb s rukou volně ve vzduchu.",
      "Easier: spread less. Harder: repeat with the hand unsupported in the air."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_finger_spread",
    "ez": null,
    "hd": null,
    "foc": [
      "Rozevři prsty od sebe a pomalu je spoj.",
      "Spread the fingers and slowly bring them together while the palm rests lightly."
    ],
    "source": {
      "author": "Royal Berkshire NHS Foundation Trust",
      "document": "Finger exercises, March 2026",
      "url": "https://www.royalberkshire.nhs.uk/media/r3umes1s/finger-exercises_mar26.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_finger_extension",
    "cz": "Aktivní napřímení prstů dlaní vzhůru",
    "en": "Palm-Up Finger Extension",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Polož předloktí a hřbet ruky na stůl dlaní vzhůru. Prsty nech volné.",
      "Rest the forearm and back of the hand on a table, palm upward and fingers relaxed."
    ],
    "exe": [
      "Pomalu narovnej prsty směrem ke stolu a potom uvolni.",
      "Slowly straighten the fingers toward the table, then relax."
    ],
    "wat": [
      "Druhou rukou prsty netlač do záklonu. Zápěstí ponech klidné.",
      "Do not push the fingers backward with the other hand. Keep the wrist still."
    ],
    "pro": [
      "Lehčí: kratší rozsah. Těžší: krátká aktivní výdrž s postupným zapojením všech prstů.",
      "Easier: shorten the range. Harder: briefly hold active extension while involving every finger."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_finger_extension",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu narovnej prsty směrem ke stolu a potom uvolni.",
      "Slowly straighten the fingers toward the table, then relax."
    ],
    "source": {
      "author": "Royal Berkshire NHS Foundation Trust",
      "document": "Finger exercises, March 2026",
      "url": "https://www.royalberkshire.nhs.uk/media/r3umes1s/finger-exercises_mar26.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_wrist_dartthrower",
    "cz": "Šikmý pohyb zápěstí jako při hodu šipkou",
    "en": "Wrist Dart-Thrower Motion",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "lavice"
    ],
    "mp": [
      "fore"
    ],
    "ms": [],
    "S": 1,
    "C": 2,
    "family": "hand_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "pos": [
      "Opři loket o stůl, předloktí zvedni šikmo a ruku volně sevři, jako by držela tužku.",
      "Support the elbow, incline the forearm upward and loosely shape the hand as if holding a pencil."
    ],
    "exe": [
      "Zápěstí veď nejprve dozadu k palci, potom šikmo dopředu k malíku. Nic skutečně neodhazuj.",
      "Move the wrist backward toward the thumb, then diagonally forward toward the little finger without actually throwing anything."
    ],
    "wat": [
      "Pohyb patří zápěstí; loket ani rameno jím nenahrazují švih.",
      "Move at the wrist without substituting an elbow or shoulder swing."
    ],
    "pro": [
      "Lehčí: malá pomalá diagonála. Těžší: plynulý větší rozsah bez zátěže.",
      "Easier: use a small slow diagonal. Harder: increase smooth range without added load."
    ],
    "J": {
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_wrist_dartthrower",
    "ez": null,
    "hd": null,
    "foc": [
      "Zápěstí veď nejprve dozadu k palci, potom šikmo dopředu k malíku.",
      "Move the wrist backward toward the thumb, then diagonally forward toward the little finger without actually throwing anything."
    ],
    "source": {
      "author": "NHS Fife",
      "document": "Distal radius fracture — wrist rehabilitation exercises",
      "url": "https://www.nhsfife.org/services/all-services/patient-advice/distal-radius-fracture/",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_supine_chin_nod",
    "cz": "Jemné přikývnutí vleže s opřenou hlavou",
    "en": "Supine Chin Nod",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "neck"
    ],
    "ms": [],
    "S": 1,
    "C": 1,
    "family": "neck_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "pos": [
      "Lehni na záda a pokrč kolena. Hlavu podepři jen tolik, aby krk spočíval pohodlně.",
      "Lie supine with knees bent, using only enough head support for a comfortable neck position."
    ],
    "exe": [
      "Proveď drobné přikývnutí jako tiché ano. Zadní část hlavy zůstává opřená, potom povol.",
      "Make a tiny nod as if quietly saying yes. Keep the back of the head supported, then relax."
    ],
    "wat": [
      "Nezvedej hlavu ze země a netlač bradu silou k hrudníku.",
      "Do not lift the head or force the chin toward the chest."
    ],
    "pro": [
      "Lehčí: nepatrný pohyb bez výdrže. Těžší: krátce podrž přikývnutí s volným dechem.",
      "Easier: use a tiny movement without a hold. Harder: briefly hold the nod while breathing freely."
    ],
    "J": {
      "krk": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_supine_chin_nod",
    "ez": null,
    "hd": null,
    "foc": [
      "Proveď drobné přikývnutí jako tiché ano.",
      "Make a tiny nod as if quietly saying yes."
    ],
    "source": {
      "author": "University of Queensland / TIMS NHS",
      "document": "Whiplash Injury Recovery — neck movement and control exercises",
      "url": "https://www.tims.nhs.uk/wp-content/uploads/2020/09/Whiplash-Injury-Recovery-booklet-2019.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_quadruped_head_rotation",
    "cz": "Otáčení hlavy v opoře na čtyřech",
    "en": "Quadruped Cervical Rotation",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "neck"
    ],
    "ms": [
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "neck_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "pos": [
      "Na čtyřech polož dlaně pod ramena a kolena pod kyčle. Krk navazuje na trup.",
      "Set hands beneath shoulders and knees beneath hips, with the neck continuing the trunk line."
    ],
    "exe": [
      "Pomalu otoč hlavu k jednomu rameni a zpět. Střídej strany bez otáčení hrudníku.",
      "Slowly turn the head toward one shoulder and return, alternating without rotating the chest."
    ],
    "wat": [
      "Nenech hlavu viset a neopírej ji o zem. Při závrati pohyb ukonči.",
      "Do not let the head hang or rest it on the floor. Stop the movement if dizzy."
    ],
    "pro": [
      "Lehčí: menší rotace s předloktími opřenými o vysoký stůl. Těžší: plynulý pohodlný rozsah při klidném trupu.",
      "Easier: use less rotation with forearms supported on a high table. Harder: move smoothly through comfortable range with a quiet trunk."
    ],
    "J": {
      "krk": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_quadruped_head_rotation",
    "ez": null,
    "hd": null,
    "foc": [
      "Pomalu otoč hlavu k jednomu rameni a zpět.",
      "Slowly turn the head toward one shoulder and return, alternating without rotating the chest."
    ],
    "source": {
      "author": "University of Queensland / TIMS NHS",
      "document": "Whiplash Injury Recovery — neck movement and control exercises",
      "url": "https://www.tims.nhs.uk/wp-content/uploads/2020/09/Whiplash-Injury-Recovery-booklet-2019.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_mob_quadruped_neck_control",
    "cz": "Řízené napřímení krku na čtyřech",
    "en": "Quadruped Neck Extension with Chin Control",
    "collection": "mobility",
    "tags": [
      "mobilita",
      "aktivní rozsah",
      "mobility"
    ],
    "pat": "mobilita",
    "eq": [
      "telo"
    ],
    "mp": [
      "neck"
    ],
    "ms": [
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "neck_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_mob_supine_chin_nod",
    "pos": [
      "Začni na čtyřech, dlaně pod rameny a hlava v prodloužení zad. Dívej se mezi ruce.",
      "Begin on all fours with palms beneath shoulders and head aligned with the back, looking between the hands."
    ],
    "exe": [
      "Hlavu lehce spusť a potom pomalu vrať do linie trupu. Při návratu ponech bradu mírně zasunutou.",
      "Lower the head slightly, then slowly restore trunk alignment while keeping the chin gently tucked."
    ],
    "wat": [
      "Nevystrkuj bradu a nezvedej hlavu do výrazného záklonu.",
      "Avoid jutting the chin or lifting into marked neck extension."
    ],
    "pro": [
      "Lehčí: malý pohyb s předloktími na stole. Těžší: krátká výdrž v napřímení bez napětí čelisti.",
      "Easier: use a small movement with forearms on a table. Harder: briefly hold alignment without jaw tension."
    ],
    "J": {
      "krk": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "prep",
    "goalRole": "mobility",
    "genRule": "explicit",
    "variantKey": "ex26_mob_quadruped_neck_control",
    "hd": null,
    "foc": [
      "Hlavu lehce spusť a potom pomalu vrať do linie trupu.",
      "Lower the head slightly, then slowly restore trunk alignment while keeping the chin gently tucked."
    ],
    "source": {
      "author": "University of Queensland / TIMS NHS",
      "document": "Whiplash Injury Recovery — neck movement and control exercises",
      "url": "https://www.tims.nhs.uk/wp-content/uploads/2020/09/Whiplash-Injury-Recovery-booklet-2019.pdf",
      "scope": "Movement technique or movement-family reference; independent coaching and progression."
    },
    "defaultRestSec": 15
  },
  {
    "id": "ex26_dns_supine_band",
    "cz": "DNS · poloha na zádech s rozevíráním gumy",
    "en": "DNS Supine Position with Band External Rotation",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 2,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Lehni na záda, kyčle a kolena pokrč přibližně do pravého úhlu. Mezi dlaněmi drž lehkou gumu, lokty opři vedle trupu.",
      "Lie supine with hips and knees near right angles. Hold a light band between hands, elbows supported beside the trunk."
    ],
    "exe": [
      "Rozevři předloktí proti gumě a vrať je. Nohy udrž nad podložkou, dýchej plynule a nech pánev klidnou.",
      "Rotate forearms outward against the band and return. Keep legs elevated, breathe continuously and maintain a steady pelvis."
    ],
    "wat": [
      "Guma nemá vynutit zvednutí žeber ani propnutí beder. V případě potřeby podlož lýtka.",
      "Band tension must not force rib flare or lumbar arching. Support the calves when necessary."
    ],
    "pro": [
      "Lehčí: lýtka na lavici. Těžší: malý střídavý pohyb jedné nohy při stejné kontrole.",
      "Easier: calves on a bench. Harder: add a small alternating leg movement with the same control."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_supine_band",
    "hd": null,
    "foc": [
      "Rozevři předloktí proti gumě a vrať je.",
      "Rotate forearms outward against the band and return."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_prone_turn",
    "cz": "DNS · opora o lokty s otáčením hlavy",
    "en": "DNS Prone Elbow Support with Head Rotation",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "neck",
      "serr"
    ],
    "ms": [
      "abs",
      "low"
    ],
    "S": 1,
    "C": 2,
    "family": "neck_control",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Lehni na břicho, lokty polož šířeji pod ramena, předloktí opři a pánev ponech na podložce.",
      "Lie prone with elbows set wide beneath the shoulders, forearms supported and pelvis resting on the mat."
    ],
    "exe": [
      "Lehce se odtlač od předloktí, prodluž krk a pomalu otoč hlavu na jednu a druhou stranu.",
      "Press gently through forearms, lengthen the neck and slowly turn the head to either side."
    ],
    "wat": [
      "Nezakláněj hlavu a nedrž se v poloze sevřením hýždí. Otáčej pouze v pohodlném rozsahu.",
      "Avoid throwing the head backward or maintaining the position by clenching the glutes. Turn within a comfortable range."
    ],
    "pro": [
      "Lehčí: menší otočení s nižším hrudníkem. Těžší: delší plynulá kontrola při volném dýchání.",
      "Easier: smaller turns with the chest lower. Harder: sustain smooth control while breathing freely."
    ],
    "J": {
      "krk": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_prone_turn",
    "hd": null,
    "foc": [
      "Lehce se odtlač od předloktí, prodluž krk a pomalu otoč hlavu na jednu a druhou stranu.",
      "Press gently through forearms, lengthen the neck and slowly turn the head to either side."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_prone_reach",
    "cz": "DNS · opora na břiše s dosahem paže",
    "en": "DNS Prone Support with Arm Reach",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Z nízké opory o obě předloktí na břiše rozlož váhu mezi lokty a pánev.",
      "From low prone forearm support, distribute weight between elbows and pelvis."
    ],
    "exe": [
      "Přenes část váhy na jeden loket. Druhou ruku pomalu vysuň vpřed po podložce a vrať.",
      "Shift some weight onto one elbow. Slowly slide the other hand forward along the mat and return."
    ],
    "wat": [
      "Neotáčej celý trup za rukou a nepropadej se v opěrném rameni.",
      "Do not rotate the entire trunk after the hand or collapse into the supporting shoulder."
    ],
    "pro": [
      "Lehčí: krátký posun bez odlehčení lokte. Těžší: na okamžik odlehči nataženou ruku.",
      "Easier: a short slide without unloading the elbow. Harder: briefly float the reaching hand."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_prone_reach",
    "hd": null,
    "foc": [
      "Přenes část váhy na jeden loket.",
      "Shift some weight onto one elbow."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_prone_band",
    "cz": "DNS · opora na předloktích s lehkou gumou",
    "en": "DNS Prone Forearm Support with Band Tension",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "serr",
      "rcuff"
    ],
    "ms": [
      "abs",
      "low"
    ],
    "S": 2,
    "C": 2,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Vleže na břiše se opři o předloktí. Lehkou smyčku gumy umísti kolem zápěstí.",
      "Lie prone supported on forearms, with a light resistance loop around the wrists."
    ],
    "exe": [
      "Udržuj jemný tah zápěstí od sebe a současně oporu předloktí. Několikrát volně nadechni a vydechni.",
      "Maintain gentle outward wrist tension and forearm support while taking several relaxed breaths."
    ],
    "wat": [
      "Jde o odporovou variantu základní polohy, nikoli maximální tah. Nezvedej ramena k uším.",
      "This is a resisted adaptation of the base position, not a maximal pull. Keep shoulders away from the ears."
    ],
    "pro": [
      "Lehčí: bez gumy. Těžší: trochu delší výdrž, pouze pokud neztrácíš oporu a dech.",
      "Easier: omit the band. Harder: hold slightly longer only while support and breathing remain steady."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_prone_band",
    "hd": null,
    "foc": [
      "Udržuj jemný tah zápěstí od sebe a současně oporu předloktí.",
      "Maintain gentle outward wrist tension and forearm support while taking several relaxed breaths."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_lowkneel",
    "cz": "DNS · nízký klek s oporou předloktí",
    "en": "DNS Low Kneeling with Forearm Support",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Klekni si, sedni částečně k patám a předloktí polož před sebe. Kolena roztáhni jen pohodlně.",
      "Kneel, sit partly toward the heels and place forearms in front, knees comfortably apart."
    ],
    "exe": [
      "Odtlač předloktí do podložky a prodluž trup od pánve k temeni. V poloze klidně dýchej.",
      "Press the forearms into the mat and lengthen the trunk from pelvis to crown while breathing calmly."
    ],
    "wat": [
      "Neskládej hrudník pasivně na stehna a nezvedej hlavu záklonem krku.",
      "Avoid resting the chest passively on the thighs or lifting the head by arching the neck."
    ],
    "pro": [
      "Lehčí: předloktí výše na pevném polštáři. Těžší: malý posun těla vpřed a zpět.",
      "Easier: elevate forearms on a firm cushion. Harder: shift the body slightly forward and back."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_lowkneel",
    "hd": null,
    "foc": [
      "Odtlač předloktí do podložky a prodluž trup od pánve k temeni.",
      "Press the forearms into the mat and lengthen the trunk from pelvis to crown while breathing calmly."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_side_reach",
    "cz": "DNS · dosah v poloze na boku",
    "en": "DNS Side-Lying Reach",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Lehni na bok, pokrč spodní nohu a spodní paži polož před hrudník s pokrčeným loktem. Hlavu podle potřeby podlož.",
      "Lie on your side, bend the lower leg and place the lower arm forward with elbow bent. Support the head if needed."
    ],
    "exe": [
      "Jemně zatlač spodním předloktím a nohou do podložky. Horní rukou dosáhni před sebe a vrať.",
      "Gently press the lower forearm and leg into the mat. Reach forward with the top hand and return."
    ],
    "wat": [
      "Horní bok nevytahuj k žebrům. Hrudník a pánev se nesmějí při dosahu nekontrolovaně rozjet.",
      "Do not hike the upper hip toward the ribs or let chest and pelvis drift apart uncontrollably."
    ],
    "pro": [
      "Lehčí: pouze najdi oporu bez dosahu. Těžší: zvětši dosah nebo přidej velmi lehký odpor.",
      "Easier: establish support without reaching. Harder: lengthen the reach or add very light resistance."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_side_reach",
    "hd": null,
    "foc": [
      "Jemně zatlač spodním předloktím a nohou do podložky.",
      "Gently press the lower forearm and leg into the mat."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_side_band",
    "cz": "DNS · dosah na boku proti gumě",
    "en": "DNS Side-Lying Resisted Reach",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_dns_side_reach",
    "pos": [
      "Zaujmi oporu na boku. Gumu bezpečně upevni za sebou v úrovni hrudníku a konec drž horní rukou.",
      "Establish side-lying support. Secure a band behind you at chest height and hold it in the top hand."
    ],
    "exe": [
      "Pomalu tlač horní ruku vpřed proti lehkému odporu. Spodní předloktí a noha zůstávají oporou.",
      "Slowly reach the top hand forward against light resistance, keeping the lower forearm and leg as supports."
    ],
    "wat": [
      "Odpor nemá stáčet pánev dozadu ani stahovat opěrné rameno. Předem zkontroluj kotvení.",
      "Resistance must not roll the pelvis backward or pull the supporting shoulder out of position. Check the anchor first."
    ],
    "pro": [
      "Lehčí: dosah bez gumy. Těžší: krátká výdrž s paží před tělem.",
      "Easier: reach without a band. Harder: pause briefly with the arm extended."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_side_band",
    "hd": null,
    "foc": [
      "Pomalu tlač horní ruku vpřed proti lehkému odporu.",
      "Slowly reach the top hand forward against light resistance, keeping the lower forearm and leg as supports."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_side_roll",
    "cz": "DNS · řízené přenášení váhy na boku",
    "en": "DNS Controlled Side-Lying Weight Shift",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 3,
    "family": "core_rotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Lehni na bok s pokrčenou spodní nohou a spodním předloktím před tělem.",
      "Lie on your side with the lower leg bent and lower forearm in front."
    ],
    "exe": [
      "Přenášej váhu malým pohybem trupu a pánve vpřed a zpět kolem opěrné paže a nohy.",
      "Shift weight through a small forward and backward movement of trunk and pelvis around the supporting arm and leg."
    ],
    "wat": [
      "Pohyb neprováděj švihem. Zůstaň dlouhý v trupu a nezadržuj dech.",
      "Avoid momentum. Maintain trunk length and keep breathing."
    ],
    "pro": [
      "Lehčí: minimální přenos váhy. Těžší: spoj přenos s dosahem horní ruky.",
      "Easier: minimal weight transfer. Harder: combine the shift with a top-arm reach."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_side_roll",
    "hd": null,
    "foc": [
      "Přenášej váhu malým pohybem trupu a pánve vpřed a zpět kolem opěrné paže a nohy.",
      "Shift weight through a small forward and backward movement of trunk and pelvis around the supporting arm and leg."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_oblique_forearm",
    "cz": "DNS · šikmý sed s oporou o předloktí",
    "en": "DNS Oblique Sitting on Forearm",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 2,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "ez": "ex26_dns_side_reach",
    "pos": [
      "Ze sedu na boku opři spodní předloktí a dlaň. Váhu nesou také boční část stehna a pokrčené nohy.",
      "From side sitting, support yourself on the lower forearm and palm, with the lateral thigh and bent legs also bearing weight."
    ],
    "exe": [
      "Aktivně se odtlač od předloktí, vytáhni temeno a udrž hrudník nad pánví bez zhroucení do boku.",
      "Push actively through the forearm, lengthen through the crown and organize chest over pelvis without collapsing sideways."
    ],
    "wat": [
      "Rameno nesmí viset u ucha. Nezvedej celé tělo do bočního prkna.",
      "Do not let the shoulder hang toward the ear. This is not a full side-plank lift."
    ],
    "pro": [
      "Lehčí: menší vzpřímení a druhá dlaň na zemi. Těžší: dosah volnou paží.",
      "Easier: lower the torso slightly and add the other palm to the floor. Harder: reach with the free arm."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_oblique_forearm",
    "hd": null,
    "foc": [
      "Aktivně se odtlač od předloktí, vytáhni temeno a udrž hrudník nad pánví bez zhroucení do boku.",
      "Push actively through the forearm, lengthen through the crown and organize chest over pelvis without collapsing sideways."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_oblique_reach",
    "cz": "DNS · šikmý sed s dosahem volné paže",
    "en": "DNS Oblique Forearm Sitting with Reach",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_dns_oblique_forearm",
    "pos": [
      "Zaujmi šikmý sed s oporou spodního předloktí a boční části stehna.",
      "Set up in oblique sitting supported by the lower forearm and lateral thigh."
    ],
    "exe": [
      "Volnou paži pomalu natáhni šikmo vpřed do výšky ramene a vrať. Pánev zůstává stabilní.",
      "Slowly reach the free arm diagonally forward to shoulder height, then return with the pelvis steady."
    ],
    "wat": [
      "Nedoháněj dosah rotací pánve ani poklesem opěrného ramene.",
      "Do not gain reach by twisting the pelvis or sinking into the supporting shoulder."
    ],
    "pro": [
      "Lehčí: kratší dosah. Těžší: lehká guma působící proti dosahu.",
      "Easier: shorten the reach. Harder: add a light band opposing the reach."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_oblique_reach",
    "hd": null,
    "foc": [
      "Volnou paži pomalu natáhni šikmo vpřed do výšky ramene a vrať.",
      "Slowly reach the free arm diagonally forward to shoulder height, then return with the pelvis steady."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_oblique_hand",
    "cz": "DNS · šikmý sed s oporou o dlaň",
    "en": "DNS Oblique Sitting on Hand",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "ez": "ex26_dns_oblique_forearm",
    "pos": [
      "Sedni si na bok s pokrčenými nohami. Dlaň opěrné ruky polož stranou od kyčle, prsty pohodlně rozevři.",
      "Sit on one side with knees bent. Place the supporting palm beside the hip and spread fingers comfortably."
    ],
    "exe": [
      "S téměř nataženým loktem se odtlač od dlaně. Vytáhni trup a ponech část váhy na boční straně stehna.",
      "Press through the palm with the elbow nearly straight. Lengthen the trunk while keeping some weight on the lateral thigh."
    ],
    "wat": [
      "Nepřetlačuj loket do propnutí a nehrb se přes opěrné rameno.",
      "Do not force elbow hyperextension or round over the supporting shoulder."
    ],
    "pro": [
      "Lehčí: opora o předloktí. Těžší: malý přenos váhy k dlani a zpět.",
      "Easier: use forearm support. Harder: shift a little weight toward the palm and back."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_oblique_hand",
    "hd": null,
    "foc": [
      "S téměř nataženým loktem se odtlač od dlaně.",
      "Press through the palm with the elbow nearly straight."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Trainer Practical Certification Test — developmental positions",
      "url": "https://www.rehabps.com/sportcourse_test.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_oblique_row",
    "cz": "DNS · přítah kladky v šikmém sedu",
    "en": "DNS Oblique-Sitting Cable Row",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "kladka"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "core_antirotation",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_dns_oblique_hand",
    "pos": [
      "V šikmém sedu se opři o jednu dlaň. Druhou rukou drž madlo kladky před sebou přibližně ve výšce spodních žeber.",
      "In oblique sitting, support yourself on one palm and hold a cable handle in the other hand in front at lower-rib height."
    ],
    "exe": [
      "Přitáhni loket volné paže k boku a pomalu jej vrať. Udrž oporu ruky a stehna i klidnou pánev.",
      "Row the free elbow toward the side and return slowly, maintaining hand and thigh support with a steady pelvis."
    ],
    "wat": [
      "Začni velmi lehkým odporem. Tah nesmí převrátit trup ani vytáhnout opěrné rameno.",
      "Start with very light resistance. The cable must not tip the trunk or pull up the supporting shoulder."
    ],
    "pro": [
      "Lehčí: šikmý sed bez zátěže. Těžší: pozvolné přidání odporu při stejné poloze.",
      "Easier: unloaded oblique sitting. Harder: gradually add resistance while maintaining position."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_oblique_row",
    "hd": null,
    "foc": [
      "Přitáhni loket volné paže k boku a pomalu jej vrať.",
      "Row the free elbow toward the side and return slowly, maintaining hand and thigh support with a steady pelvis."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Strength Training course curriculum",
      "url": "https://www.rehabps.com/strength-training.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_quad_forward",
    "cz": "DNS · přenos váhy vpřed na čtyřech",
    "en": "DNS Quadruped Forward Rock",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "crawl",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": null,
    "pos": [
      "Dlaně polož pod ramena, kolena pod kyčle. Nárty i holeně nech na podložce.",
      "Place palms under shoulders and knees under hips, with shins and tops of feet on the mat."
    ],
    "exe": [
      "Posuň celé tělo několik centimetrů vpřed nad dlaně a vrať. Dlaně, kolena a nárty zůstávají na místě.",
      "Move the whole body a few centimetres forward over the hands and return, keeping palms, knees and feet in place."
    ],
    "wat": [
      "Nepropadej mezi lopatkami a nepřidávej pohyb prohnutím beder.",
      "Do not sink between the shoulder blades or gain movement by arching the lower back."
    ],
    "pro": [
      "Lehčí: nepatrný přenos váhy. Těžší: pomalejší návrat bez ztráty opory celé dlaně.",
      "Easier: a very small weight shift. Harder: return more slowly while maintaining full palm support."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_quad_forward",
    "hd": null,
    "foc": [
      "Posuň celé tělo několik centimetrů vpřed nad dlaně a vrať.",
      "Move the whole body a few centimetres forward over the hands and return, keeping palms, knees and feet in place."
    ],
    "source": {
      "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
      "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
      "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_quad_feedback",
    "cz": "DNS · dech na čtyřech se zpětnou vazbou gumy",
    "en": "DNS Quadruped Breathing with Band Feedback",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "dech",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "breathing",
    "load": "none",
    "measurementType": "DURATION",
    "ez": null,
    "pos": [
      "V opoře na dlaních a kolenou volně obtoč měkkou gumu kolem pasu. Guma se jen dotýká trupu.",
      "On hands and knees, loosely wrap a soft band around the waist so it merely contacts the trunk."
    ],
    "exe": [
      "Při klidném nádechu vnímej rozšíření dolních žeber a břišní stěny proti lehkému dotyku. Plynule vydechni.",
      "During an easy inhale, feel the lower ribs and abdominal wall expand against the light contact, then exhale smoothly."
    ],
    "wat": [
      "Guma nesmí omezovat nádech ani tlačit do břicha. Nevytvářej maximální tlak.",
      "The band must not restrict inhalation or dig into the abdomen. Do not generate maximal pressure."
    ],
    "pro": [
      "Lehčí: bez gumy s dotykem vlastní ruky vsedě. Těžší: udrž dech při malém přenosu váhy.",
      "Easier: omit the band and use hand contact while seated. Harder: maintain breathing during a small weight shift."
    ],
    "J": {},
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_quad_feedback",
    "hd": null,
    "foc": [
      "Při klidném nádechu vnímej rozšíření dolních žeber a břišní stěny proti lehkému dotyku.",
      "During an easy inhale, feel the lower ribs and abdominal wall expand against the light contact, then exhale smoothly."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "Breathing pattern disorders — exercise examples",
      "url": "https://www.rehabps.com/download/breathing_disorders.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_quad_legslide",
    "cz": "DNS · posun nohy z opory na čtyřech",
    "en": "DNS Quadruped Leg Slide",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "crawl",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_dns_quad_forward",
    "hd": "birddog",
    "pos": [
      "Zaujmi oporu na dlaních a kolenou a rozlož váhu rovnoměrně.",
      "Start on hands and knees with weight distributed evenly."
    ],
    "exe": [
      "Jednu nohu pomalu posouvej vzad po špičce až k natažení kolena. Vrať ji bez pohybu pánve do strany.",
      "Slowly slide one foot backward along the toes until the knee extends. Return without shifting the pelvis sideways."
    ],
    "wat": [
      "Špička zůstává na zemi; nezvedej nohu prohnutím zad.",
      "Keep the toes on the ground; do not lift the leg by arching the back."
    ],
    "pro": [
      "Lehčí: kratší posun. Těžší: na konci na okamžik odlehči špičku, poté přejdi k bird dogu.",
      "Easier: shorten the slide. Harder: briefly unload the toes at the end, then progress toward a bird dog."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_quad_legslide",
    "foc": [
      "Jednu nohu pomalu posouvej vzad po špičce až k natažení kolena.",
      "Slowly slide one foot backward along the toes until the knee extends."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Trainer Practical Certification Test — developmental positions",
      "url": "https://www.rehabps.com/sportcourse_test.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_threepoint",
    "cz": "DNS · tříbodová opora s rukou na trupu",
    "en": "DNS Three-Point Support with Trunk Feedback",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "ez": "ex26_dns_quad_legslide",
    "pos": [
      "Na čtyřech posuň levou nohu vzad na špičku. Opři levou dlaň a pravé koleno; pravou ruku polož na bok.",
      "From all fours, extend the left leg backward onto the toes. Keep the left palm and right knee supported; place the right hand on the waist."
    ],
    "exe": [
      "Udrž tři opěrné body a klidně dýchej. Poté strany vystřídej.",
      "Maintain the three support points and breathe calmly, then switch sides."
    ],
    "wat": [
      "Jde o variantu tříbodové opory, ne o běžný bird dog. Ramena ani pánev neotáčej.",
      "This is a three-point support variation, not a standard bird dog. Avoid rotating shoulders or pelvis."
    ],
    "pro": [
      "Lehčí: vrať obě dlaně na zem. Těžší: menší dotyk zadní špičky bez změny polohy.",
      "Easier: return both palms to the floor. Harder: reduce pressure through the rear toes without changing position."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_threepoint",
    "hd": null,
    "foc": [
      "Udrž tři opěrné body a klidně dýchej.",
      "Maintain the three support points and breathe calmly, then switch sides."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "Breathing pattern disorders — exercise examples",
      "url": "https://www.rehabps.com/download/breathing_disorders.pdf",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_highkneel",
    "cz": "DNS · vzpřímený klek s kontrolou dechu",
    "en": "DNS Tall Kneeling with Breathing Control",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "dech",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "breathing",
    "load": "none",
    "measurementType": "DURATION",
    "ez": null,
    "pos": [
      "Klekni si na měkkou podložku, kolena pod boky. Narovnej kyčle, dlaně přilož na dolní žebra.",
      "Kneel on padding with knees under hips. Extend the hips and place hands on the lower ribs."
    ],
    "exe": [
      "Udrž hrudník přibližně nad pánví a volně dýchej do prostoru pod dlaněmi.",
      "Keep the chest approximately over the pelvis and breathe freely into the area beneath the hands."
    ],
    "wat": [
      "Nevysouvej pánev dopředu a nesnaž se břicho maximálně vtáhnout.",
      "Do not thrust the pelvis forward or maximally draw the abdomen inward."
    ],
    "pro": [
      "Lehčí: ruce lehce opři o lavičku. Těžší: zvedni jednu paži bez změny postavení trupu.",
      "Easier: rest hands lightly on a bench. Harder: raise one arm without changing trunk position."
    ],
    "J": {},
    "pop": 1,
    "mode": "sec",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_highkneel",
    "hd": null,
    "foc": [
      "Udrž hrudník přibližně nad pánví a volně dýchej do prostoru pod dlaněmi.",
      "Keep the chest approximately over the pelvis and breathe freely into the area beneath the hands."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Trainer Practical Certification Test — developmental positions",
      "url": "https://www.rehabps.com/sportcourse_test.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_bear_transition",
    "cz": "DNS · přechod z opory na čtyřech do medvěda",
    "en": "DNS Quadruped-to-Bear Transition",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "crawl",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_dns_quad_forward",
    "pos": [
      "Na čtyřech opři celé dlaně a podviň prsty nohou. Kolena nech pod boky.",
      "On all fours, support the full palms and tuck the toes, knees under hips."
    ],
    "exe": [
      "Zvedni kolena několik centimetrů a potom posuň pánev mírně vzhůru a vzad. Kontrolovaně se vrať na kolena.",
      "Lift the knees a few centimetres, then move the pelvis slightly upward and backward. Return to the knees under control."
    ],
    "wat": [
      "Nesnaž se propnout nohy za každou cenu. Hlavní je plynulá změna opory bez zadržení dechu.",
      "Do not force the legs straight. Prioritize a smooth support transition while breathing."
    ],
    "pro": [
      "Lehčí: jen odlehči kolena. Těžší: delší plynulý přechod se stejnou kontrolou ramen a pánve.",
      "Easier: merely unload the knees. Harder: lengthen the smooth transition while retaining shoulder and pelvic control."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_bear_transition",
    "hd": null,
    "foc": [
      "Zvedni kolena několik centimetrů a potom posuň pánev mírně vzhůru a vzad.",
      "Lift the knees a few centimetres, then move the pelvis slightly upward and backward."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Strength Training course curriculum",
      "url": "https://www.rehabps.com/strength-training.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_halfkneel_stand",
    "cz": "DNS · řízené vstávání z polokleku",
    "en": "DNS Controlled Half-Kneeling to Standing",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "drep",
    "eq": [
      "telo"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "abs",
      "obl"
    ],
    "S": 2,
    "C": 3,
    "family": "lunge",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Začni v polokleku s předním chodidlem celou plochou na zemi a zadním kolenem pod kyčlí. Podle potřeby se lehce přidrž pevné opory vedle sebe.",
      "Begin in half kneeling with the front foot flat and the rear knee beneath the hip. If needed, lightly hold a stable support beside you."
    ],
    "exe": [
      "Přenes váhu nad přední chodidlo a plynule vstaň. Zadní nohu přisuň a stejnou cestou se vrať.",
      "Shift weight over the front foot and stand smoothly. Bring the rear foot forward and return along the same path."
    ],
    "wat": [
      "Neodrážej se rukama od stehna a nenech koleno padat dovnitř. Opora ruky je vhodná lehčí varianta.",
      "Avoid pushing off the thigh or letting the knee collapse inward. Hand support is a useful easier variation."
    ],
    "pro": [
      "Lehčí: přidržení pevné opory. Těžší: lehká jednostranná zátěž a pomalejší návrat.",
      "Easier: hold a fixed support. Harder: use a light unilateral load and slower descent."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_halfkneel_stand",
    "hd": null,
    "foc": [
      "Přenes váhu nad přední chodidlo a plynule vstaň.",
      "Shift weight over the front foot and stand smoothly."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Strength Training course curriculum",
      "url": "https://www.rehabps.com/strength-training.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_dns_bear_row",
    "cz": "DNS · přítah jednoručky v medvědovi",
    "en": "DNS Bear-Position Dumbbell Row",
    "collection": "dns-hss",
    "tags": [
      "DNS",
      "HSS",
      "vývojové pozice"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 4,
    "C": 4,
    "family": "core_antirotation",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_bear_hold",
    "pos": [
      "Z nízkého medvěda rozšiř chodidla pro stabilní oporu. Jedna dlaň je na zemi, druhá drží lehkou jednoručku.",
      "From a low bear position, widen the feet for stability. One palm is on the floor and the other holds a light dumbbell."
    ],
    "exe": [
      "S koleny těsně nad zemí přitáhni jednoručku k boku a polož ji. Hrudník drž čelem k podložce.",
      "With knees just above the floor, row the dumbbell toward the side and lower it, keeping the chest facing the mat."
    ],
    "wat": [
      "Neotáčej pánev za zátěží. Zvol lehkou činku a sérii ukonči před ztrátou opory.",
      "Do not turn the pelvis with the weight. Use a light dumbbell and stop before support deteriorates."
    ],
    "pro": [
      "Lehčí: kolena na zemi nebo samotný medvěd. Těžší: pomalejší spuštění, poté malý přírůstek zátěže.",
      "Easier: keep knees grounded or hold an unloaded bear. Harder: lower more slowly, then add a small load increment."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_dns_bear_row",
    "hd": null,
    "foc": [
      "S koleny těsně nad zemí přitáhni jednoručku k boku a polož ji.",
      "With knees just above the floor, row the dumbbell toward the side and lower it, keeping the chest facing the mat."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Strength Training course curriculum",
      "url": "https://www.rehabps.com/strength-training.html",
      "scope": "Documented DNS position; original coaching cues and explicitly adapted loading."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_knee_fallout",
    "cz": "HSS · otevírání jednoho kolena vleže",
    "en": "Core Bent-Knee Fall-Out",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Lehni na záda, chodidla dej na zem a dlaně na přední část pánve.",
      "Lie supine with feet planted and hands on the front of the pelvis."
    ],
    "exe": [
      "Jedno koleno pomalu otevři do strany, aniž se pánev přetočí. Vrať a vystřídej nohy.",
      "Slowly open one knee sideways without rolling the pelvis, then return and switch legs."
    ],
    "wat": [
      "Pohyb končí před ztrátou klidné pánve; nesnaž se dostat koleno na zem.",
      "Stop before the pelvis moves; do not aim to force the knee to the floor."
    ],
    "pro": [
      "Lehčí: malý rozsah. Těžší: pomalejší návrat a ruce bez dotyku pánve.",
      "Easier: reduce the range. Harder: return more slowly without using hand feedback."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_knee_fallout",
    "hd": null,
    "foc": [
      "Jedno koleno pomalu otevři do strany, aniž se pánev přetočí.",
      "Slowly open one knee sideways without rolling the pelvis, then return and switch legs."
    ],
    "source": {
      "author": "Hall and Brody / Lippincott Williams & Wilkins",
      "document": "Therapeutic Exercise: Moving Toward Function — Bent-Knee Fall-out",
      "url": "https://download.lww.com/downloads/thePoint/9780781741354_Hall/Image_Bank/pdf/0350_ch_18-box7.pdf",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_hand_knee",
    "cz": "HSS · tlak dlaně proti opačnému kolenu",
    "en": "Core Contralateral Hand-to-Knee Press",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Lehni na záda, jednu nohu zvedni pokrčenou nad kyčel a opačnou dlaň polož na stehno těsně nad kolenem. Druhé chodidlo zůstává na zemi.",
      "Lie supine, lift one bent leg over the hip and place the opposite palm on the thigh just above its knee. Keep the other foot grounded."
    ],
    "exe": [
      "Jemně tlač dlaní a stehnem proti sobě bez viditelného pohybu. Během krátké výdrže dýchej.",
      "Gently press palm and thigh against each other without visible movement, breathing throughout the brief hold."
    ],
    "wat": [
      "Netlač do čéšky a nezvedej hlavu. Síla nesmí nutit k zadržení dechu.",
      "Do not press on the kneecap or lift the head. Effort must allow continuous breathing."
    ],
    "pro": [
      "Lehčí: menší tlak. Těžší: odlehči druhé chodidlo při zachování klidného trupu.",
      "Easier: use less pressure. Harder: unload the other foot while keeping the trunk steady."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_hand_knee",
    "hd": null,
    "foc": [
      "Jemně tlač dlaní a stehnem proti sobě bez viditelného pohybu.",
      "Gently press palm and thigh against each other without visible movement, breathing throughout the brief hold."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Dead Bug — Unilateral Isometric Hold; foot-supported regression",
      "url": "https://library.theprehabguys.com/vimeo-video/dead-bug-unilateral-isometric-hold/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_deadbug_wall",
    "cz": "HSS · dead bug s tlakem dlaní do zdi",
    "en": "Wall-Press Dead Bug",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zed"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Lehni hlavou blízko zdi. Dlaně opři o zeď za hlavou, nohy zvedni do pravých úhlů.",
      "Lie with the head near a wall. Press palms against the wall behind the head and raise the legs into right angles."
    ],
    "exe": [
      "Lehce tlač do zdi a střídavě spouštěj jednu patu směrem k zemi. Vrať ji dříve, než změníš polohu zad.",
      "Maintain light wall pressure while alternately lowering one heel toward the floor. Return before back position changes."
    ],
    "wat": [
      "Nezakláněj hlavu kvůli kontaktu se zdí. Podle potřeby se posuň o něco dál.",
      "Do not extend the neck to reach the wall. Adjust your distance as needed."
    ],
    "pro": [
      "Lehčí: menší pokles paty. Těžší: při spouštění postupně více natahuj koleno.",
      "Easier: lower the heel less. Harder: gradually straighten the knee farther during lowering."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_deadbug_wall",
    "hd": null,
    "foc": [
      "Lehce tlač do zdi a střídavě spouštěj jednu patu směrem k zemi.",
      "Maintain light wall pressure while alternately lowering one heel toward the floor."
    ],
    "source": {
      "author": "Max Aita / Juggernaut Training Systems",
      "document": "Jerk Manual — wall-press dead bug",
      "url": "https://cdn.jtsstrength.com/wp-content/uploads/2021/09/17061826/JTS_Jerk-Manual-1-uhfzip.pdf",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_deadbug_ball",
    "cz": "HSS · diagonální dead bug s míčem",
    "en": "Contralateral Stability-Ball Dead Bug",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "fitball"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": "ex26_hss_hand_knee",
    "pos": [
      "Vleže na zádech drž velký míč mezi dlaněmi a stehny, kyčle i kolena pokrčené. Hlavu nech na zemi.",
      "Lie supine with a stability ball between palms and thighs, hips and knees bent, head grounded."
    ],
    "exe": [
      "Ponech lehký tlak pravé dlaně a levého stehna do míče. Levou paži a pravou nohu vzdaluj od míče, vrať a vystřídej diagonálu.",
      "Keep light pressure from the right palm and left thigh into the ball. Move the left arm and right leg away, return and switch diagonals."
    ],
    "wat": [
      "Míč nesvírej maximální silou. Rozsah zkrať, pokud se prohnou bedra.",
      "Do not squeeze maximally. Shorten the movement if the lower back arches."
    ],
    "pro": [
      "Lehčí: všechny končetiny drží míč. Těžší: delší natažení volné nohy a paže.",
      "Easier: all limbs support the ball. Harder: extend the free leg and arm farther."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_deadbug_ball",
    "hd": null,
    "foc": [
      "Ponech lehký tlak pravé dlaně a levého stehna do míče.",
      "Keep light pressure from the right palm and left thigh into the ball."
    ],
    "source": {
      "author": "USA Gymnastics / The Prehab Guys",
      "document": "USAG Acro: Back Strengthening",
      "url": "https://static.usagym.org/PDFs/Acro/medical/back_strengthening.pdf",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_deadbug_band",
    "cz": "HSS · dead bug s tahem gumy za hlavou",
    "en": "Band-Pulldown Dead Bug",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antiextension",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Vleže na zádech drž oběma rukama gumu bezpečně ukotvenou nízko za hlavou. Paže směřují ke stropu a nohy jsou pokrčené nad kyčlemi.",
      "Lie supine holding a band securely anchored low behind the head. Arms point upward and bent legs are above the hips."
    ],
    "exe": [
      "Stáhni paže mírně směrem ke stehnům a jejich polohu drž. Střídavě natahuj jednu nohu vpřed a vrať.",
      "Pull arms slightly toward the thighs and hold their position. Alternately extend one leg forward and return."
    ],
    "wat": [
      "Guma nesmí stáhnout ruce za hlavu. Vol odpor, se kterým udržíš plynulý dech a klidnou pánev.",
      "Do not let the band pull the arms behind the head. Choose tension that allows continuous breathing and a steady pelvis."
    ],
    "pro": [
      "Lehčí: pouze spouštěj patu s pokrčeným kolenem. Těžší: delší páka nohy při stejném odporu.",
      "Easier: lower only the heel with the knee bent. Harder: lengthen the leg lever at the same band tension."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_deadbug_band",
    "hd": null,
    "foc": [
      "Stáhni paže mírně směrem ke stehnům a jejich polohu drž.",
      "Pull arms slightly toward the thighs and hold their position."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Crunch Time: An Evidence-based Approach to Training the Abs",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/8989/crunch-time-an-evidence-based-approach-to-training-the-abs/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_deadbug_weight",
    "cz": "HSS · dead bug s výdrží jednoručky",
    "en": "Dumbbell-Hold Dead Bug",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "core_antiextension",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Lehni na záda a lehkou jednoručku drž oběma rukama bezpečně nad hrudníkem. Nohy zvedni pokrčené.",
      "Lie supine and securely hold a light dumbbell with both hands above the chest. Lift the bent legs."
    ],
    "exe": [
      "Zátěž udrž nehybně a střídavě natahuj jednu nohu směrem od těla. Vrať před ztrátou polohy zad.",
      "Keep the weight still and alternately extend one leg away, returning before back position changes."
    ],
    "wat": [
      "Použij zátěž, kterou spolehlivě udržíš. Neveď ji nad obličej a nezaměňuj cvik za pullover.",
      "Use a load you can hold reliably. Keep it away from the face and do not turn the drill into a pullover."
    ],
    "pro": [
      "Lehčí: bez činky. Těžší: nižší natažení nohy, později malý přírůstek zátěže.",
      "Easier: omit the dumbbell. Harder: extend the leg lower, then add a small load increment."
    ],
    "J": {
      "pat": 1,
      "ram": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_deadbug_weight",
    "hd": null,
    "foc": [
      "Zátěž udrž nehybně a střídavě natahuj jednu nohu směrem od těla.",
      "Keep the weight still and alternately extend one leg away, returning before back position changes."
    ],
    "source": {
      "author": "American Council on Exercise",
      "document": "Crunch Time: An Evidence-based Approach to Training the Abs",
      "url": "https://www.acefitness.org/resources/pros/expert-articles/8989/crunch-time-an-evidence-based-approach-to-training-the-abs/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_seated_march",
    "cz": "HSS · střídavé zvedání nohou v sedu",
    "en": "Seated Core-Control March",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "lavice"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": null,
    "pos": [
      "Sedni na pevnou lavičku, obě chodidla na zemi a trup vzpřímený. Dlaně polož na boky.",
      "Sit upright on a firm bench with both feet grounded and hands on the waist."
    ],
    "exe": [
      "Zvedni jedno chodidlo několik centimetrů bez záklonu nebo úklonu. Polož je tiše zpět a vystřídej.",
      "Lift one foot a few centimetres without leaning back or sideways. Replace it quietly and alternate."
    ],
    "wat": [
      "Nezvedej koleno tahem celého trupu. Výška chodidla není cílem.",
      "Do not lift the knee by moving the whole trunk. Foot height is not the goal."
    ],
    "pro": [
      "Lehčí: prsty rukou na lavičce. Těžší: krátká výdrž s volnými pažemi před tělem.",
      "Easier: rest fingertips on the bench. Harder: briefly hold with arms reaching in front."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_seated_march",
    "hd": null,
    "foc": [
      "Zvedni jedno chodidlo několik centimetrů bez záklonu nebo úklonu.",
      "Lift one foot a few centimetres without leaning back or sideways."
    ],
    "source": {
      "author": "Royal Free London NHS Foundation Trust",
      "document": "Seated marching — movement demonstration",
      "url": "https://www.royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/physiotherapy-advice-and-exercises-after-abdominal-surgery",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_tall_pallof",
    "cz": "HSS · Pallofův tlak ve vysokém kleku",
    "en": "Tall-Kneeling Pallof Press",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Klekni bokem k bezpečně ukotvené gumě ve výšce hrudníku. Kolena nech na šířku boků, ruce před hrudníkem.",
      "Kneel sideways to a secure chest-height band anchor. Keep knees hip-width apart and hands at the chest."
    ],
    "exe": [
      "Vytlač obě ruce přímo před sebe a vrať. Odolávej otočení trupu směrem ke kotvení.",
      "Press both hands straight forward and return, resisting trunk rotation toward the anchor."
    ],
    "wat": [
      "Pánev neotáčej a neuhýbej boky od gumy. Odpor musí dovolit volný dech.",
      "Do not rotate or shift the pelvis away from the band. Resistance must permit free breathing."
    ],
    "pro": [
      "Lehčí: kratší vysunutí rukou. Těžší: krátká pauza s pažemi nataženými.",
      "Easier: shorten the press. Harder: pause briefly with arms extended."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_tall_pallof",
    "hd": null,
    "foc": [
      "Vytlač obě ruce přímo před sebe a vrať.",
      "Press both hands straight forward and return, resisting trunk rotation toward the anchor."
    ],
    "source": {
      "author": "Boxing Science",
      "document": "Rotational Strength and Power for Boxing: The Pallof Press",
      "url": "https://boxingscience.co.uk/rotational-strength-and-power-for-boxing-the-pallof-press/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_pallof_stepout",
    "cz": "HSS · boční kroky s výdrží proti rotaci",
    "en": "Pallof Step-Out Hold",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "guma"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "pallof",
    "pos": [
      "Stůj bokem ke gumě ukotvené ve výšce hrudníku. Ruce drž před tělem, kolena měkká.",
      "Stand sideways to a chest-height band anchor, holding hands in front with soft knees."
    ],
    "exe": [
      "Udrž paže před sebou a udělej malý krok od kotvení, přisuň druhou nohu. Po krátké pauze se vrať.",
      "Keep arms in front, take a small step away from the anchor and bring the other foot along. Pause briefly and return."
    ],
    "wat": [
      "Nekřiž chodidla a neotáčej se za tahem. Každý krok mění odpor, proto začni blízko kotvení.",
      "Do not cross the feet or turn with the pull. Each step changes resistance, so start near the anchor."
    ],
    "pro": [
      "Lehčí: statická výdrž blíže ke kotvení. Těžší: pomalejší kroky při stejném napětí.",
      "Easier: hold still nearer the anchor. Harder: take slower steps at the same tension."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_pallof_stepout",
    "hd": null,
    "foc": [
      "Udrž paže před sebou a udělej malý krok od kotvení, přisuň druhou nohu.",
      "Keep arms in front, take a small step away from the anchor and bring the other foot along."
    ],
    "source": {
      "author": "Boxing Science",
      "document": "Rotational Strength and Power for Boxing: The Pallof Press",
      "url": "https://boxingscience.co.uk/rotational-strength-and-power-for-boxing-the-pallof-press/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_quad_handhover",
    "cz": "HSS · odlehčení dlaně na čtyřech",
    "en": "Quadruped Hand Hover",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 2,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": "ex26_dns_quad_forward",
    "pos": [
      "Začni na dlaních a kolenou. Kolena nech pod kyčlemi a pohled mezi dlaněmi.",
      "Begin on palms and knees, knees beneath hips and gaze between the hands."
    ],
    "exe": [
      "Odlehči jednu dlaň jen centimetr nad zem, chvíli udrž klidný trup a polož ji. Střídej ruce.",
      "Hover one palm just a centimetre above the floor, briefly keep the trunk steady and lower it. Alternate hands."
    ],
    "wat": [
      "Pánev neodsunuj stranou a opěrný loket neprolamuj.",
      "Do not shift the pelvis sideways or hyperextend the supporting elbow."
    ],
    "pro": [
      "Lehčí: dlaň pouze postupně odlehčuj. Těžší: pomalu natáhni volnou paži vpřed.",
      "Easier: gradually reduce pressure without lifting. Harder: slowly reach the free arm forward."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_quad_handhover",
    "hd": null,
    "foc": [
      "Odlehči jednu dlaň jen centimetr nad zem, chvíli udrž klidný trup a polož ji.",
      "Hover one palm just a centimetre above the floor, briefly keep the trunk steady and lower it."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Shoulder Dislocation & Instability Rehab — weight-bearing progressions",
      "url": "https://e3rehab.com/shoulder-instability/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_quad_drag",
    "cz": "HSS · přetahování zátěže na čtyřech",
    "en": "Quadruped Weight Drag",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "alternating",
    "ez": "ex26_hss_quad_handhover",
    "pos": [
      "Na čtyřech polož lehkou činku na ručník vedle jedné dlaně. Zvol hladký povrch, který nepoškodíš.",
      "On hands and knees, place a light dumbbell on a towel beside one palm. Use a smooth surface that will not be damaged."
    ],
    "exe": [
      "Opačnou rukou přetáhni činku pod hrudníkem na druhou stranu. Polož dlaň a vystřídej ruce.",
      "With the opposite hand, slide the dumbbell beneath the chest to the other side. Replace the palm and alternate."
    ],
    "wat": [
      "Kolena zůstávají na zemi. Zátěž táhni pomalu, aby její tření nevyvolalo prudkou rotaci.",
      "Keep knees grounded. Drag slowly so friction does not cause a sudden twist."
    ],
    "pro": [
      "Lehčí: lehčí předmět a širší kolena. Těžší: přejdi do vzporu na špičkách s menší zátěží.",
      "Easier: use a lighter object and wider knees. Harder: progress to a toe-supported plank with less weight."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_quad_drag",
    "hd": null,
    "foc": [
      "Opačnou rukou přetáhni činku pod hrudníkem na druhou stranu.",
      "With the opposite hand, slide the dumbbell beneath the chest to the other side."
    ],
    "source": {
      "author": "USA Gymnastics / The Prehab Guys",
      "document": "USAG Acro: Back Strengthening",
      "url": "https://static.usagym.org/PDFs/Acro/medical/back_strengthening.pdf",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_birddog_elbow",
    "cz": "HSS · bird dog s návratem lokte ke kolenu",
    "en": "Bird Dog with Elbow-to-Knee Return",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "birddog",
    "pos": [
      "Na čtyřech natáhni pravou paži a levou nohu do délky, nejvýše do linie trupu.",
      "From all fours, extend the right arm and left leg long, no higher than the trunk."
    ],
    "exe": [
      "Pomalu přibliž pravý loket a levé koleno pod tělem a znovu je natáhni. Oporu tvoří levá dlaň a pravé koleno.",
      "Slowly bring the right elbow and left knee toward each other beneath the body, then extend again. Support rests on the left palm and right knee."
    ],
    "wat": [
      "Dotyk lokte a kolena není nutný. Nenech se převalit na bok ani švihat nohou.",
      "Elbow-to-knee contact is optional. Do not roll sideways or swing the leg."
    ],
    "pro": [
      "Lehčí: mezi opakováními polož všechny končetiny. Těžší: plynulé návraty s krátkou pauzou v natažení.",
      "Easier: reset all limbs between repetitions. Harder: connect returns with a brief pause in extension."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_birddog_elbow",
    "hd": null,
    "foc": [
      "Pomalu přibliž pravý loket a levé koleno pod tělem a znovu je natáhni.",
      "Slowly bring the right elbow and left knee toward each other beneath the body, then extend again."
    ],
    "source": {
      "author": "National Academy of Sports Medicine",
      "document": "Bird Dog — exercise technique",
      "url": "https://www.nasm.org/resource-center/exercise-library/bird-dog",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_bear_tap",
    "cz": "HSS · dotek ramene v nízkém medvědovi",
    "en": "Low-Bear Shoulder Tap",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 3,
    "C": 4,
    "family": "core_antirotation",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "alternating",
    "ez": "ex26_bear_hold",
    "pos": [
      "Zaujmi nízkého medvěda s koleny několik centimetrů nad zemí. Chodidla rozšiř pro stabilitu.",
      "Set a low bear with knees a few centimetres above the floor. Widen the feet for stability."
    ],
    "exe": [
      "Jednou rukou se pomalu dotkni opačného ramene a vrať dlaň. Střídej ruce bez otáčení pánve.",
      "Slowly touch the opposite shoulder with one hand and replace the palm. Alternate without turning the pelvis."
    ],
    "wat": [
      "Nezrychluj, abys zakryl ztrátu rovnováhy. Při houpání polož kolena.",
      "Do not rush to hide loss of balance. Ground the knees if the body sways."
    ],
    "pro": [
      "Lehčí: kolena na zemi. Těžší: delší pauza s rukou na rameni.",
      "Easier: keep knees grounded. Harder: pause longer with the hand on the shoulder."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_bear_tap",
    "hd": null,
    "foc": [
      "Jednou rukou se pomalu dotkni opačného ramene a vrať dlaň.",
      "Slowly touch the opposite shoulder with one hand and replace the palm."
    ],
    "source": {
      "author": "The Prehab Guys",
      "document": "Bear Position Shoulder Tap",
      "url": "https://library.theprehabguys.com/vimeo-video/bear-position-shoulder-tap/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_bear_shift",
    "cz": "HSS · pomalé přenosy váhy v medvědovi",
    "en": "Low-Bear Weight Shifts",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 2,
    "C": 3,
    "family": "crawl",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "ez": "ex26_bear_hold",
    "pos": [
      "V nízkém medvědovi nech dlaně pod rameny a kolena pod kyčlemi těsně nad podložkou.",
      "In a low bear, keep hands under shoulders and knees under hips just above the mat."
    ],
    "exe": [
      "Posuň tělo několik centimetrů vpřed, zpět a do stran. Všechny čtyři opěrné body zůstávají na místě.",
      "Move the body a few centimetres forward, back and sideways, keeping all four support points fixed."
    ],
    "wat": [
      "Nepropadej v bedrech a nezvedej pánev vysoko. Rozsah je záměrně malý.",
      "Avoid lumbar sagging or lifting the pelvis high. The range is deliberately small."
    ],
    "pro": [
      "Lehčí: přenosy s koleny na zemi. Těžší: chodidla o něco blíže k sobě při stejně malém rozsahu pohybu.",
      "Easier: shift with knees grounded. Harder: bring the feet slightly closer together while retaining the same small range."
    ],
    "J": {
      "zap": 2,
      "ram": 1,
      "kyc": 1
    },
    "pop": 1,
    "mode": "reps",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_bear_shift",
    "hd": null,
    "foc": [
      "Posuň tělo několik centimetrů vpřed, zpět a do stran.",
      "Move the body a few centimetres forward, back and sideways, keeping all four support points fixed."
    ],
    "source": {
      "author": "Prague School of Rehabilitation",
      "document": "DNS Strength Training course curriculum",
      "url": "https://www.rehabps.com/strength-training.html",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_wall_sideplank",
    "cz": "HSS · boční opora o zeď",
    "en": "Standing Wall Side Plank",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zed"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 1,
    "C": 1,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "DURATION",
    "sideMode": "perSide",
    "hd": "sideplank",
    "pos": [
      "Stůj bokem ke zdi a opři předloktí ve výšce ramene. Chodidla posuň kousek od zdi.",
      "Stand sideways to a wall and place the forearm at shoulder height. Step the feet a short distance away."
    ],
    "exe": [
      "Nakloň celé tělo ke zdi a odtlač se z předloktí do pevné šikmé linie. Krátce drž s volným dechem.",
      "Lean the whole body toward the wall and press through the forearm into a firm diagonal line. Hold briefly while breathing."
    ],
    "wat": [
      "Nenech bok vybočit směrem ke zdi a nezvedej opěrné rameno k uchu.",
      "Do not let the hip sag toward the wall or shrug the supporting shoulder."
    ],
    "pro": [
      "Lehčí: chodidla blíže ke zdi. Těžší: o něco větší odstup, později opora o vyšší lavičku.",
      "Easier: move feet nearer the wall. Harder: step slightly farther away, then use a high bench."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_wall_sideplank",
    "ez": null,
    "foc": [
      "Nakloň celé tělo ke zdi a odtlač se z předloktí do pevné šikmé linie.",
      "Lean the whole body toward the wall and press through the forearm into a firm diagonal line."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Shoulder Dislocation & Instability Rehab — weight-bearing progressions",
      "url": "https://e3rehab.com/shoulder-instability/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_sideplank_leg",
    "cz": "HSS · boční opora na koleni se zvednutím nohy",
    "en": "Knee-Supported Side Plank with Hip Abduction",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "obl",
      "glu"
    ],
    "ms": [
      "abs",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "ex26_hss_wall_sideplank",
    "pos": [
      "Lehni na bok, opři předloktí pod ramenem a pokrč spodní koleno. Horní nohu natáhni v linii trupu.",
      "Lie on your side with forearm under shoulder and lower knee bent. Extend the top leg in line with the trunk."
    ],
    "exe": [
      "Zvedni pánev do opory na předloktí a spodním koleni. Horní nohu pomalu zvedni, spusť a opakuj.",
      "Lift the pelvis onto the forearm and lower knee. Slowly raise and lower the top leg."
    ],
    "wat": [
      "Netahej horní špičku ke stropu a neotáčej pánev dozadu.",
      "Do not point the top toes toward the ceiling or roll the pelvis backward."
    ],
    "pro": [
      "Lehčí: horní nohu nech opřenou. Těžší: krátká výdrž nahoře, později lehká guma.",
      "Easier: keep the top leg supported. Harder: pause at the top, then add a light band."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_sideplank_leg",
    "hd": null,
    "foc": [
      "Zvedni pánev do opory na předloktí a spodním koleni.",
      "Lift the pelvis onto the forearm and lower knee."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Shoulder Dislocation & Instability Rehab — weight-bearing progressions",
      "url": "https://e3rehab.com/shoulder-instability/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_sideplank_march",
    "cz": "HSS · přitažení kolena v bočním prkně",
    "en": "Side-Plank Knee Drive",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "telo"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 4,
    "C": 4,
    "family": "core_lateral",
    "load": "none",
    "measurementType": "BODYWEIGHT_REPS",
    "sideMode": "perSide",
    "ez": "sideplank",
    "pos": [
      "Zaujmi boční prkno na předloktí a spodním chodidle. Horní paži dej na bok.",
      "Set a side plank on the forearm and lower foot, with the top hand on the hip."
    ],
    "exe": [
      "Horní koleno přibliž před tělo a potom nohu znovu natáhni v linii trupu. Pánev drž nahoře.",
      "Bring the top knee forward, then re-extend the leg in line with the trunk while keeping the pelvis lifted."
    ],
    "wat": [
      "Nehoupej pánví dopředu a dozadu. Koleno přitáhni jen tolik, kolik dovolí stabilní opora.",
      "Do not rock the pelvis forward and back. Drive the knee only as far as stable support allows."
    ],
    "pro": [
      "Lehčí: opora o spodní koleno. Těžší: pomalejší pohyb s pauzou v obou polohách.",
      "Easier: support on the lower knee. Harder: move more slowly with pauses at both ends."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_sideplank_march",
    "hd": null,
    "foc": [
      "Horní koleno přibliž před tělo a potom nohu znovu natáhni v linii trupu.",
      "Bring the top knee forward, then re-extend the leg in line with the trunk while keeping the pelvis lifted."
    ],
    "source": {
      "author": "E3 Rehab",
      "document": "Shoulder Dislocation & Instability Rehab — weight-bearing progressions",
      "url": "https://e3rehab.com/shoulder-instability/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_bottomsup_hold",
    "cz": "HSS · poloklek s kettlebellem dnem vzhůru",
    "en": "Half-Kneeling Bottoms-Up Kettlebell Hold",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl",
      "rcuff"
    ],
    "ms": [
      "fore",
      "serr"
    ],
    "S": 3,
    "C": 4,
    "family": "core_antirotation",
    "load": "ext",
    "measurementType": "WEIGHT_DURATION",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Z polokleku zvedni oběma rukama velmi lehký kettlebell do jedné ruky dnem vzhůru. Loket drž pod zápěstím a před hrudníkem.",
      "From half kneeling, use both hands to place a very light kettlebell upside down in one hand. Keep the elbow beneath the wrist in front of the chest."
    ],
    "exe": [
      "Krátce drž zvon svisle a trup klidný. Volnou ruku ponech poblíž pro bezpečné převzetí činky.",
      "Briefly hold the bell upright with a steady trunk. Keep the free hand nearby to take the weight safely."
    ],
    "wat": [
      "Činku nedrž nad obličejem. Při ztrátě rovnováhy ji vezmi oběma rukama, nesnaž se pád zachytit zápěstím.",
      "Do not hold the bell over the face. If balance is lost, take it with both hands rather than catching it with the wrist."
    ],
    "pro": [
      "Lehčí: běžné držení kettlebellu u ramene. Těžší: delší klidná výdrž před přidáním hmotnosti.",
      "Easier: use a normal rack hold. Harder: sustain a steadier hold before adding weight."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_bottomsup_hold",
    "hd": null,
    "foc": [
      "Krátce drž zvon svisle a trup klidný.",
      "Briefly hold the bell upright with a steady trunk."
    ],
    "source": {
      "author": "Rehab-U",
      "document": "The Shoulder Fix — half-kneeling bottoms-up holds",
      "url": "https://rehab-u.com/wp-content/uploads/2019/02/rehab-u-shoulderfix.pdf",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_rack_march",
    "cz": "HSS · pochod s jednostrannou zátěží u ramene",
    "en": "Single-Arm Front-Rack March",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "loaded_carry",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Stůj vzpřímeně a kettlebell drž u jednoho ramene v pohodlné rackové poloze.",
      "Stand tall holding a kettlebell at one shoulder in a comfortable front-rack position."
    ],
    "exe": [
      "Na místě pomalu střídej zvedání kolen. Každé chodidlo vrať kontrolovaně, trup nech bez úklonu.",
      "Slowly march in place, alternating knee lifts and lowering each foot under control without side-bending."
    ],
    "wat": [
      "Koleno nezvedej výš za cenu záklonu. Závaží netlač do krku a dýchej pravidelně.",
      "Do not lift the knee higher by leaning back. Keep the weight off the neck and breathe regularly."
    ],
    "pro": [
      "Lehčí: statické držení nebo nižší zvedání chodidel. Těžší: krátká pauza na jedné noze.",
      "Easier: hold still or lift feet less. Harder: pause briefly on one leg."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_rack_march",
    "hd": null,
    "foc": [
      "Na místě pomalu střídej zvedání kolen.",
      "Slowly march in place, alternating knee lifts and lowering each foot under control without side-bending."
    ],
    "source": {
      "author": "GMB Fitness",
      "document": "Loaded Carries",
      "url": "https://gmb.io/loaded-carries/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_hss_suitcase_balance",
    "cz": "HSS · stoj na jedné noze se zátěží v ruce",
    "en": "Single-Leg Suitcase Hold",
    "collection": "dns-hss",
    "tags": [
      "HSS",
      "stabilizace trupu"
    ],
    "pat": "stred",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "abs",
      "obl"
    ],
    "ms": [
      "low",
      "serr"
    ],
    "S": 3,
    "C": 3,
    "family": "loaded_carry",
    "load": "ext",
    "measurementType": "WEIGHT_DURATION",
    "sideMode": "perSide",
    "ez": null,
    "pos": [
      "Drž lehkou činku podél pravého boku. Přenes váhu na levou nohu a pravé chodidlo odlehči.",
      "Hold a light dumbbell beside the right hip. Shift weight onto the left leg and unload the right foot."
    ],
    "exe": [
      "Krátce stůj na jedné noze s pánví přibližně vodorovně a volným dechem. Poté vyměň stranu.",
      "Briefly balance on one leg with the pelvis approximately level and breathing freely, then switch sides."
    ],
    "wat": [
      "Nevis v boku a nenech činku opřenou o stehno. Prostor kolem sebe nech volný.",
      "Do not hang into the hip or rest the weight against the thigh. Keep the surrounding space clear."
    ],
    "pro": [
      "Lehčí: volná špička na zemi. Těžší: delší klidná výdrž, pak o málo vyšší zátěž.",
      "Easier: keep the free toes grounded. Harder: hold steadily longer, then add a small load increment."
    ],
    "J": {
      "ram": 1,
      "pat": 1
    },
    "pop": 1,
    "mode": "sec",
    "tier": "extended",
    "sessionRole": "coordination_skill",
    "goalRole": "coordination_skill",
    "genRule": "explicit",
    "variantKey": "ex26_hss_suitcase_balance",
    "hd": null,
    "foc": [
      "Krátce stůj na jedné noze s pánví přibližně vodorovně a volným dechem.",
      "Briefly balance on one leg with the pelvis approximately level and breathing freely, then switch sides."
    ],
    "source": {
      "author": "GMB Fitness",
      "document": "Loaded Carries",
      "url": "https://gmb.io/loaded-carries/",
      "scope": "General trunk-stability progression; not an official DNS exercise."
    },
    "defaultRestSec": 90
  },
  {
    "id": "ex26_pinwheel_curl",
    "cz": "Křížový kladivový zdvih",
    "en": "Dumbbell Pinwheel Curl",
    "pat": "tah",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "bic",
      "fore"
    ],
    "ms": [],
    "S": 2,
    "C": 2,
    "family": "elbow_flexion",
    "sideMode": "alternating",
    "ez": "an_hammer",
    "pos": [
      "Stůj vzpřímeně, jednoručky drž vedle stehen neutrálním úchopem. Zápěstí nech rovná.",
      "Stand tall holding dumbbells beside the thighs with a neutral grip and straight wrists."
    ],
    "exe": [
      "Jednu činku veď šikmo před tělem k protilehlé straně hrudníku. Pomalu spusť a vystřídej ruce.",
      "Curl one dumbbell diagonally across the front of the body toward the opposite side of the chest. Lower slowly and alternate arms."
    ],
    "wat": [
      "Nepomáhej si záklonem ani otočením trupu. Nadloktí se pohybuje jen tolik, kolik vyžaduje šikmá dráha.",
      "Avoid leaning backward or rotating the trunk. Let the upper arm move only as needed for the diagonal path."
    ],
    "pro": [
      "Lehčí: lehčí činka a kratší rozsah. Těžší: pomalejší spouštění nebo mírně vyšší zátěž bez švihu.",
      "Easier: lighter dumbbell and shorter range. Harder: slower lowering or a modest load increase without swinging."
    ],
    "J": {
      "lok": 2,
      "zap": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "accessory",
    "goalRole": "hypertrophy",
    "genRule": "explicit",
    "variantKey": "ex26_pinwheel_curl",
    "hd": null,
    "foc": [
      "Jednu činku veď šikmo před tělem k protilehlé straně hrudníku.",
      "Curl one dumbbell diagonally across the front of the body toward the opposite side of the chest."
    ],
    "source": {
      "author": "Guillem Ros / Hevy",
      "document": "Pinwheel Curl (Dumbbell)",
      "url": "https://www.hevyapp.com/exercises/how-to-pinwheel-curl-dumbbell/"
    },
    "defaultRestSec": 60
  },
  {
    "id": "ex26_wide_bench",
    "cz": "Bench press se širším úchopem",
    "en": "Wide-Grip Barbell Bench Press",
    "pat": "tlak",
    "eq": [
      "cinka",
      "lavice"
    ],
    "mp": [
      "che"
    ],
    "ms": [
      "tri",
      "sho"
    ],
    "S": 3,
    "C": 2,
    "family": "push_horizontal",
    "ez": "bench",
    "pos": [
      "Lehni na rovnou lavici ve stojanu s dorazy. Chodidla opři o zem a osu uchop obepnutým úchopem o něco šířeji než při svém běžném bench pressu.",
      "Lie on a flat bench inside a rack with safeties. Plant the feet and take a closed grip slightly wider than your usual bench grip."
    ],
    "exe": [
      "Kontrolovaně spouštěj osu k hrudníku v pohodlném rozsahu. Zápěstí drž nad lokty a plynule vytlač zpět.",
      "Lower the bar toward the chest through a comfortable range. Keep wrists over elbows and press smoothly back up."
    ],
    "wat": [
      "Šířku neurčuj maximem osy. Při nepohodlí v rameni úchop zúži nebo zkrať rozsah. Pro těžší série použij dorazy či dopomoc.",
      "Do not use the widest possible grip. Narrow the grip or shorten the range if the shoulder is uncomfortable. Use safeties or a spotter for heavier sets."
    ],
    "pro": [
      "Lehčí: běžná šířka úchopu a lehká osa. Těžší: krátká pauza nad hrudníkem, potom malý přírůstek zátěže.",
      "Easier: usual grip width with a light bar. Harder: a brief pause above the chest, then a small load increase."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_wide_bench",
    "hd": null,
    "foc": [
      "Kontrolovaně spouštěj osu k hrudníku v pohodlném rozsahu.",
      "Lower the bar toward the chest through a comfortable range."
    ],
    "source": {
      "author": "Hevy",
      "document": "Wide-Grip Bench Press",
      "url": "https://www.hevyapp.com/exercises/wide-grip-bench-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_plate_press",
    "cz": "Tlak kotouče před hrudníkem",
    "en": "Standing Plate Press",
    "pat": "tlak",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "sho",
      "che"
    ],
    "ms": [
      "tri",
      "abs"
    ],
    "S": 2,
    "C": 2,
    "family": "push_horizontal",
    "ez": null,
    "pos": [
      "Stůj s chodidly pod boky a drž lehký kotouč pevně za protilehlé okraje před hrudníkem.",
      "Stand with feet under hips and securely grip opposite edges of a light plate in front of the chest."
    ],
    "exe": [
      "Vytlač kotouč dopředu přibližně do výše hrudníku a pomalu jej přitáhni zpět. Trup ponech vzpřímený.",
      "Press the plate forward around chest height and slowly bring it back. Keep the torso upright."
    ],
    "wat": [
      "Nezakláněj se a nevysouvej žebra. Použij kotouč, který bezpečně uchopíš; dlaně drží okraje, nejde o pouhé sevření ploch mezi dlaněmi.",
      "Avoid leaning backward or flaring the ribs. Use a plate you can grip securely at the edges rather than merely squeezing its faces between the palms."
    ],
    "pro": [
      "Lehčí: menší kotouč nebo kratší vysunutí. Těžší: krátká výdrž vpředu při zachování stabilního trupu.",
      "Easier: smaller plate or shorter reach. Harder: a brief hold forward while maintaining a steady trunk."
    ],
    "J": {
      "ram": 2,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "sideMode": "none",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_plate_press",
    "hd": null,
    "foc": [
      "Vytlač kotouč dopředu přibližně do výše hrudníku a pomalu jej přitáhni zpět.",
      "Press the plate forward around chest height and slowly bring it back."
    ],
    "source": {
      "author": "Philip Stefanov / Hevy",
      "document": "Plate Press",
      "url": "https://www.hevyapp.com/exercises/plate-press/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_db_single_rdl",
    "cz": "Rumunský mrtvý tah na jedné noze s jednoručkami",
    "en": "Dumbbell Single-Leg Romanian Deadlift",
    "pat": "ohyb",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "ham",
      "glu"
    ],
    "ms": [
      "low",
      "abs",
      "fore"
    ],
    "S": 3,
    "C": 3,
    "family": "hinge_unilateral",
    "sideMode": "perSide",
    "ez": "ex26_kickstand_rdl",
    "pos": [
      "Stůj na jedné noze s měkkým kolenem, jednoručky drž vedle stehen. Volná noha se může lehce dotknout země před začátkem.",
      "Stand on one leg with a soft knee and dumbbells beside the thighs. The free foot may lightly touch down before starting."
    ],
    "exe": [
      "Posuň pánev vzad, trup nakláněj a volnou nohu prodlužuj dozadu. Činky visí pod rameny; vrať se přes stojnou nohu.",
      "Move the hips backward, tip the trunk and extend the free leg behind you. Let the dumbbells hang below the shoulders and return through the standing leg."
    ],
    "wat": [
      "Pánev neotvírej do strany a nesahej činkami za každou cenu na zem. Rozsah končí tam, kde udržíš kontrolu páteře a rovnováhu.",
      "Avoid opening the pelvis sideways or forcing the dumbbells to the floor. Stop the range where spinal control or balance would be lost."
    ],
    "pro": [
      "Lehčí: zadní špička jako opora při kickstand variantě. Těžší: krátká pauza v předklonu nebo malé zvýšení zátěže.",
      "Easier: support the rear toes in a kickstand variation. Harder: pause briefly in the hinge or increase the load modestly."
    ],
    "J": {
      "kyc": 2,
      "pat": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_db_single_rdl",
    "hd": null,
    "foc": [
      "Posuň pánev vzad, trup nakláněj a volnou nohu prodlužuj dozadu.",
      "Move the hips backward, tip the trunk and extend the free leg behind you."
    ],
    "source": {
      "author": "Hevy",
      "document": "Single Leg Romanian Deadlift (Dumbbell)",
      "url": "https://www.hevyapp.com/exercises/how-to-single-leg-romanian-deadlift-dumbbell/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_meadows_row",
    "cz": "Meadowsův přítah",
    "en": "Meadows Row",
    "pat": "tah",
    "eq": [
      "cinka"
    ],
    "mp": [
      "lat",
      "upb"
    ],
    "ms": [
      "bic",
      "fore",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "pull_horizontal",
    "sideMode": "perSide",
    "ez": "ex26_db_supported_row",
    "pos": [
      "Jeden konec osy zajisti v landmine kloubu. Postav se bokem k zatíženému konci, chodidla mírně rozkroč a předkloň se z kyčlí. Volné předloktí opři o stehno, druhou rukou pevně uchop návlek osy.",
      "Secure one end of a bar in a landmine pivot. Stand side-on to the loaded end in a staggered stance and hinge at the hips. Support the free forearm on the thigh and grip the bar sleeve securely."
    ],
    "exe": [
      "Přitáhni zatížený konec osy k boku, loket veď dozadu a mírně ven. Plynule spouštěj do natažení paže při stabilním trupu.",
      "Row the loaded end toward your side, guiding the elbow backward and slightly outward. Lower smoothly to arm extension while keeping the trunk stable."
    ],
    "wat": [
      "Neotáčej celý trup za zátěží a netrhej osou. Použij malé kotouče, které neomezí dráhu, a zátěž odpovídající jistému úchopu.",
      "Avoid twisting the whole trunk or jerking the bar. Use small plates that leave room for the movement and a load you can grip securely."
    ],
    "pro": [
      "Lehčí: přítah jednoručky s oporou hrudníku. Těžší: krátká pauza nahoře nebo malé zvýšení zátěže při stejné kontrole.",
      "Easier: chest-supported dumbbell row. Harder: a brief pause at the top or a small load increase with the same control."
    ],
    "J": {
      "ram": 1,
      "lok": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_meadows_row",
    "hd": null,
    "foc": [
      "Přitáhni zatížený konec osy k boku, loket veď dozadu a mírně ven.",
      "Row the loaded end toward your side, guiding the elbow backward and slightly outward."
    ],
    "source": {
      "author": "Philip Stefanov / Hevy",
      "document": "Meadows Row: How-to, Tips, Variations & Mistakes",
      "url": "https://www.hevyapp.com/exercises/meadows-row/"
    },
    "defaultRestSec": 120
  },
  {
    "id": "ex26_db_forward_lunge",
    "cz": "Výpad vpřed s jednoručkami",
    "en": "Dumbbell Forward Lunge",
    "pat": "drep",
    "eq": [
      "zavazi"
    ],
    "mp": [
      "qua",
      "glu"
    ],
    "ms": [
      "ham",
      "add",
      "abs"
    ],
    "S": 3,
    "C": 3,
    "family": "lunge",
    "sideMode": "alternating",
    "ez": "lunge",
    "pos": [
      "Stůj na šířku boků, jednoručky drž vedle stehen. Před sebou nech volný prostor pro jeden krok.",
      "Stand with feet hip-width apart and dumbbells beside the thighs. Leave clear space for one forward step."
    ],
    "exe": [
      "Vykroč jednou nohou vpřed a pokrč obě kolena do kontrolované hloubky. Odrazem přes celé přední chodidlo se vrať zpět do výchozího stoje a vystřídej nohy.",
      "Step one foot forward and bend both knees to a controlled depth. Push through the whole front foot to return backward to the starting stance, then alternate legs."
    ],
    "wat": [
      "Koleno veď přibližně se směrem prstů. Nepadej na zadní koleno, neodrážej se švihem trupu a neztrácej rovnováhu kvůli příliš úzkému kroku.",
      "Guide the knee approximately with the toes. Avoid dropping onto the rear knee, swinging the trunk or narrowing the step until balance is lost."
    ],
    "pro": [
      "Lehčí: výpad bez zátěže nebo dělený dřep na místě. Těžší: krátká pauza dole, potom malé zvýšení zátěže při jistém návratu.",
      "Easier: bodyweight lunge or stationary split squat. Harder: a brief bottom pause, then a small load increase while maintaining a controlled return."
    ],
    "J": {
      "kol": 2,
      "kyc": 1,
      "kot": 1
    },
    "pop": 1,
    "mode": "reps",
    "load": "ext",
    "measurementType": "WEIGHT_REPS",
    "tier": "extended",
    "sessionRole": "strength",
    "goalRole": "strength",
    "genRule": "explicit",
    "variantKey": "ex26_db_forward_lunge",
    "hd": null,
    "foc": [
      "Vykroč jednou nohou vpřed a pokrč obě kolena do kontrolované hloubky.",
      "Step one foot forward and bend both knees to a controlled depth."
    ],
    "source": {
      "author": "Guillem Ros / Hevy",
      "document": "Dumbbell Lunge: How-to, Tips, Modifications, Mistakes",
      "url": "https://www.hevyapp.com/exercises/how-to-lunge-dumbbell/"
    },
    "defaultRestSec": 120
  }
];

export const EXPANSION_META ={
  "ex26_mb_chestpass": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "throw_chest",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mb_scoop": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "throw_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mb_backward": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "throw_overhead",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_reach": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "balance_reach",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hip_airplane": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bentknee_calf": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "calf_bentknee",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_adduction": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_adduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_abduction": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_abduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_kickback": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_extension_isolation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_smith_squat": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_machine",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_smith_bench": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_smith_incline": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_incline",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_smith_rdl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge_rdl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_sumo_squat": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_wide",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_snatch": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "snatch_db",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_thruster": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "conditioning",
    "b": "conditioning",
    "tr": 2,
    "f": "squat_press",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_supported_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_pendlay_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_onearm_pulldown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_pulldown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_pulldown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "pull_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_facepull": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "face_pull",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bb_shrug": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "shrug",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_decline_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "press_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_flat_fly": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "chest_fly",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_pecdeck": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "chest_fly",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_seated_bb_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "press_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_weighted_dip": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "dip",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_concentration_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_preacher_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_spider_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_zottman_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plate_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_hammer_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_hammer_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bb_skullcrusher": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_onearm_triceps": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_triceps_kickback": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ring_triceps": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_wrist_pronation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "forearm_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bb_rdl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_stiff_deadlift": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rack_pull": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_deadlift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "hinge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kickstand_rdl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge_unilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_zercher_squat": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_bilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bb_lunge": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_stepup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "step_up",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_stepdown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_unilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_hipthrust": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hip_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_standing_legcurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "knee_flexion_machine",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_calf_legpress": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "calf",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_db_calf": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "calf",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_firehydrant": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_abduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_bandwalk": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_abduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hamstring_slider": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lying_kneetuck": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "core_leg_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_reverse_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_captain_knee": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_leg_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_decline_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_oblique_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hollow_rock": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_spider_plank": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_knees_sideplank": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bear_hold": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plank_shoulder_tap": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_halfkneel_pallof": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_body_saw": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_copenhagen_short": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "hip_adduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_around_world": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "shoulder_arc",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bb_overhead_tri": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plate_front": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "front_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_behind_wrist": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "wrist_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_upright_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "upright_row",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_sternum_pullup": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "pull_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kipping_pullup": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "kipping_pull",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_thruster": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "squat_to_press",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_overhead_squat": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_overhead",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_clean_pull": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "olympic_pull",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hang_snatch": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 3,
    "f": "olympic_snatch",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_clean_jerk": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 3,
    "f": "olympic_clean_jerk",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_frog_jump": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_burpee_bar": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "conditioning",
    "b": "conditioning",
    "tr": 2,
    "f": "burpee",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_one_swing": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "kettlebell_swing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_double_squat": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_bilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_double_clean": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "kettlebell_clean",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_double_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "press_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_windmill": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "loaded_windmill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_halo": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_circle_loaded",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_half_getup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "get_up",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bottomup_press": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "press_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_waiter_carry": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "loaded_carry",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cross_carry": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "loaded_carry",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_suitcase_deadlift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge_asymmetric",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_bearhug_carry": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "loaded_carry",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_snapdown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "landing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_drop_landing": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "landing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_pogo": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_pogo": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_linehop": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_broad_stick": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rotational_jump": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_a_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_a_skip": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_wall_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_shuffle": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_carioca": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_deceleration": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "deceleration",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_backpedal": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_pelvic_tilt": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_side_adduction": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "hip_adduction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_singleleg_pushup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_seated_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 1,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_prone_opposite": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_hamcurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_kneetuck": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_pike": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_walkout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_pushup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_reverseext": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hip_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_wallsquat": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "squat_bilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_singlecurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_barbell_rollout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_atomic": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_rollout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_hamcurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_kneetuck": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_pike": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_feet_pushup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_hippress": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hip_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_lunge": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_trx_onearm_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_halfkneel_lift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_standing_lift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_singleleg_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plank_hiprotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_heel_slide": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_supine_armraise": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_snow_angel": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kneel_reversefly": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "face_pull",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_sumo_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "squat_bilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_lyingcurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_standingcurl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "knee_flexion_bw",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_legext": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "knee_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_gate_opener": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_overunder": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_side_armroll": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_reverse_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_toe_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_spider_walk": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cone_stepover": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cone_jump": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_cone_jump": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ladder_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_t_drill": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ladder_multidir": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ladder_forward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hexagon_lunge": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hurdle_run": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hurdle_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "change_direction",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_box_pushoff": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_alternate_box_pushoff": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_zigzag": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mb_lunge_pass": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "throw_chest",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mb_rot_slam": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "throw_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_decline_fly": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "chest_fly",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_incline_fly": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "chest_fly",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_seated_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_decline_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_cable_incline_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_incline",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_highrow": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_crunch": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_triceps": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_extension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_glute": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "hip_extension_isolation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_machine_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "front_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_suitcasepass": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_runner": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_kneel_circles": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_ball_plank_circles": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hang_clean": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "olympic_pull",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_split_jerk": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "olympic_clean_jerk",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_barbell_snatch": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "olympic_snatch",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_barbell_thruster": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "squat_to_press",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plank_updown": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_singlearm_plank": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_diagonal_plank": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_stagger_pushup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lateral_crawl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plank_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_single_cable_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rotational_cable_press": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kneeling_chop": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_sideplank_row": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_squat_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "squat_bilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_lunge_row": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_antirotation_lunge": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_transverse_lunge": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_eight": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "hinge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_cleanpress": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "kettlebell_clean",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_double_pushpress": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "press_vertical",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_split_jerk": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "olympic_clean_jerk",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_lowwindmill": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "loaded_windmill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_kb_stagger_overhead_squat": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 3,
    "f": "squat_overhead",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_v_raise": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "front_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_diagonal_raise": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "front_raise",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rope_lunge": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "conditioning",
    "b": "conditioning",
    "tr": 2,
    "f": "rope_wave",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rope_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "conditioning",
    "b": "conditioning",
    "tr": 2,
    "f": "rope_wave",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_rope_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "conditioning",
    "b": "conditioning",
    "tr": 2,
    "f": "rope_wave",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_chin_tuck": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "neck_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_paced_breath": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "breathing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_heel_pull": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "handstand_balance",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_toe_pull": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "handstand_balance",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_towel_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_marble_pickup": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_inversion": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "ankle_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_eversion": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "ankle_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_band_dorsiflex": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "ankle_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_pogo_forward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_pogo_backward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_pogo_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_single_pogo_forward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_single_pogo_backward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "ankle_hop",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hop_lateral_out": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hop_medial_in": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_ankling": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_skip_distance": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_skip_height": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_skip_backward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "run_drill",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_skip_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_straight_bound": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_alternate_bound": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_sameleg_bound": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_double_contacts": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hop_step_jump": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_five_bound": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_diagonal_bound": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_crossover_hop": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_lateral_bound_hop": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_forward_bound_hop": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_broad_rebound": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_broad_backward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_lateral_stick": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_quarter_broad": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_halfturn_travel": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_single_halfturn": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_scissors_travel": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_foreaft_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_zigzag_backward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_single_quarter": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_single_zigzag_back": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_square_double": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_square_single": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_triangle_single": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hexagon_rebound": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_single_forward": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_single_lateral": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_corner": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_vertical": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_broad": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_bounds": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_hurdle_sprint": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_drop_broad": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_drop_bounds": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_drop_sprint": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_turn": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_single": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_lateral_leap": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_skip": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_box_bound": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_stairs_double": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_stairs_single": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_approach_single": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_approach_double": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "jump_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_knee_lateral_push": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_lateral_push": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_py_drop_lateral_bound": {
    "t": "specialist",
    "s": "active",
    "g": "explicit",
    "r": "power",
    "b": "strength",
    "tr": 3,
    "f": "jump_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_pendulum": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_table_slide": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_supine_assisted_raise": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_dowel_er": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_finger_wallclimb": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_prone_swimmer": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_prone_overhead_lift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_behindback_lift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_scap_circles": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_wall_liftoff": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_lumbar_locked": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_side_windmill": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_seated_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_chair_extension": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "spinal_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_roller_angels": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "shoulder_mobility",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_adductor_rock": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_hip_ir_liftoff": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_hip_er_liftoff": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_shinbox_rise": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_prone_hip_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_seated_hip_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_leg_swing_sagittal": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_leg_swing_lateral": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_travel_butterfly": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_squat_hip_ir": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_supine_hip_circle": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_pike_compression": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_straddle_compression": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_knee_hug_release": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 2,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_halfkneel_groin": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_supine_active_kneeext": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hip_rotation_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_toe_yoga": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_toe_spreadout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_shortfoot": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_anklecircle_toesflexed": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_toe_ankle_coordination": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_heel_circles": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_forefoot_circles": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_splitstance_toerock": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_kneeling_toerock": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_bigtoe_manual": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "ankle_foot_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_tendon_glides": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_thumb_opposition": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_thumb_abduction": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_finger_spread": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_finger_extension": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_wrist_dartthrower": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "hand_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_supine_chin_nod": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "neck_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_quadruped_head_rotation": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "neck_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_mob_quadruped_neck_control": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "mobility",
    "b": "prep",
    "tr": 1,
    "f": "neck_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_supine_band": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_prone_turn": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "neck_control",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_prone_reach": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_prone_band": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_lowkneel": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_side_reach": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_side_band": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_side_roll": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_rotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_oblique_forearm": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_oblique_reach": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_oblique_hand": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_oblique_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_quad_forward": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_quad_feedback": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "breathing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_quad_legslide": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_threepoint": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_highkneel": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "breathing",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_bear_transition": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_halfkneel_stand": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_dns_bear_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 3,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_knee_fallout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_hand_knee": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_deadbug_wall": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_deadbug_ball": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_deadbug_band": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_deadbug_weight": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antiextension",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_seated_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_tall_pallof": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_pallof_stepout": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_quad_handhover": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_quad_drag": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_birddog_elbow": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_bear_tap": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_bear_shift": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "crawl",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_wall_sideplank": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 1,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_sideplank_leg": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_sideplank_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 3,
    "f": "core_lateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_bottomsup_hold": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "core_antirotation",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_rack_march": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "loaded_carry",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_hss_suitcase_balance": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "coordination_skill",
    "b": "coordination_skill",
    "tr": 2,
    "f": "loaded_carry",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_pinwheel_curl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "hypertrophy",
    "b": "accessory",
    "tr": 2,
    "f": "elbow_flexion",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_wide_bench": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_plate_press": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "push_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_single_rdl": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "hinge_unilateral",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_meadows_row": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "pull_horizontal",
    "src": "tanmay",
    "ev": "medium"
  },
  "ex26_db_forward_lunge": {
    "t": "extended",
    "s": "active",
    "g": "explicit",
    "r": "strength",
    "b": "strength",
    "tr": 2,
    "f": "lunge",
    "src": "tanmay",
    "ev": "medium"
  }
};

/** Add only missing cards once. Preserve user rows, programmes and logs by reference. */
export function seedExerciseExpansion(collection, seedRows = EXPANSION_EXERCISES, options = {}) {
  const withOriginal = seedOriginalExpansion(collection, seedRows);
  const withKettlebells = seedKettlebellExpansion(withOriginal, seedRows === EXPANSION_EXERCISES ? KETTLEBELL_EXERCISES : seedRows);
  const withInstagram = seedInstagramExpansion(withKettlebells, seedRows === EXPANSION_EXERCISES ? INSTAGRAM_EXERCISES : seedRows);
  const withContinuation = seedInstagramContinuation(withInstagram, seedRows === EXPANSION_EXERCISES ? INSTAGRAM_CONTINUATION_EXERCISES : seedRows);
  const withClientNext = seedInstagramClientNext(withContinuation, seedRows === EXPANSION_EXERCISES ? INSTAGRAM_CLIENT_NEXT_EXERCISES : seedRows);
  const withDeepReview = seedInstagramDeepReview(withClientNext, seedRows === EXPANSION_EXERCISES ? INSTAGRAM_DEEP_REVIEW_EXERCISES : seedRows);
  const audited = applyHingeAudit(seedStepVariants(applyStepAudit(applyLungeAudit(applySquatAudit(applyPracticalCorrections(withDeepReview)), options))));
  const horizontal = applyAuditEquipmentFixes(seedHorizontalPullFoundations(applyHorizontalPullAudit(seedHorizontalPressFoundations(applyHorizontalPressAudit(seedBridgeFoundations(applyBridgeAudit(audited)))))));
  const lowerBase = applyLocomotionAudit(applyBalanceAudit(applyMovementAudit(applyTrunkAudit(applyCarryAudit(seedVerticalPullFoundations(applyVerticalPullAudit(seedVerticalPushFoundations(applyVerticalPushAudit(horizontal),options)),options)),options),options),options),options);
  const lowerAudited=applyLowerLegAudit(lowerBase,options);
  return applyPositionHoldAudit(applyElbowHandAudit(applyShoulderAudit(applyHipAudit(options.lowerLegAuditContext ? seedLowerLegFoundation(lowerAudited) : lowerAudited,options),options),options),options);
}

function seedOriginalExpansion(collection, seedRows) {
  if (!collection) return collection;
  if (collection.exerciseExpansion20261011) return applyExerciseCorrections(collection);
  const previous = collection.tEx || [];
  const have = new Set(previous.map(x => x.id));
  const additions = seedRows.filter(x => x.id.startsWith('ex26_') && !have.has(x.id));
  return applyExerciseCorrections({ ...collection, exerciseExpansion20261011: true, tEx: additions.length ? [...previous, ...additions] : previous });
}
