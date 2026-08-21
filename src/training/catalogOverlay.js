// ======================================================================
// CATALOG OVERLAY · only what cannot honestly be derived
// ----------------------------------------------------------------------
// The resolver derives almost everything from what the library already
// records. This table is for the exceptions, and it is deliberately
// short: every row here is a row somebody has to keep true.
//
// Keys:
//   m     measurement type, when the derivation would get it wrong
//   rest  default rest in seconds, when the role-based default is wrong
//   f     family, when the audit table has it wrong or has none
//   vk    variant key inside the family
//   side  "perSide" | "alternating"
//   load  overrides the derived load mode
//   aka   extra search words · what people actually type
//   legacy older names that must keep finding the row
//   warmup "ramp" | "light" | "specific" | "none"
//   b     session block override
//   programs which source programmes reference it (provenance, not role)
//   variants environment variants that are NOT separate cards
// ======================================================================

// The original Movement Atlas master list is 485 identities. This number
// is asserted by the Atlas guard and is not a thing this task may change.
export const ORIGINAL_MASTER_COUNT = 485;

// The extension rows carry their own overlay next to their own copy, so
// an addition is one readable unit and not an edit in four places. They
// are merged in here because there is still only ONE overlay to read.
import { TRAINING_V2_OVERLAY } from "./catalogV2.js";

const BASE = {
  // ---- corrections to the audited table ------------------------------
  // A knee-flexion machine was filed under the biceps-curl family, which
  // is a word collision, not a shared stimulus. Left alone, a generated
  // plan would refuse a leg curl because it already gave you a dumbbell
  // curl.
  legcurl: { f: "knee_flexion_machine", vk: "machine", aka: ["zákop", "zakop", "hamstring curl"] },

  // Five more rows whose family names a movement they are not. Each one
  // costs something real: the generator refuses a second row out of a
  // family it has already used, so a cable fly filed under vertical pull
  // makes a plan drop the pull-up, and a Pallof press filed under
  // horizontal press makes it drop the bench.
  cablefly: { f: "chest_fly", vk: "cable" },
  revnordic: { f: "knee_extension_bw", vk: "reverse_nordic" },
  compression: { f: "core_compression", vk: "seated" },
  pallof: { f: "core_antirotation", vk: "cable" },
  presshs: { f: "handstand_press", vk: "straddle" },

  // ---- measurement exceptions ----------------------------------------
  boxjump: { m: "HEIGHT_REPS", rest: 90, f: "jump_vertical", vk: "box" },
  an_highjump: { m: "HEIGHT_REPS", f: "jump_vertical", vk: "standing" },
  an_vertjump: { m: "HEIGHT_REPS", f: "jump_vertical", vk: "repeat" },
  sprint: { m: "DISTANCE_DURATION", f: "run", vk: "sprint" },
  sled: { m: "WEIGHT_DURATION", f: "sled", vk: "backward_walk" },
  // A weighted push-up is measured by the plate on the back. Without it
  // the exercise is a different exercise, which is why it gets its own
  // type and not a kilogram column bolted onto bodyweight reps.
  an_wpushup: { m: "ADDED_WEIGHT_REPS", f: "press_horizontal", vk: "weighted_pushup" },

  // ---- families the audit left empty ---------------------------------
  lateralraise: { f: "lateral_raise", vk: "dumbbell" },
  an_frontraise: { f: "front_raise", vk: "dumbbell" },
  an_dbshrug: { f: "shrug", vk: "standing" },
  an_seatedshrug: { f: "shrug", vk: "seated" },
  an_inclfly: { f: "chest_fly", vk: "incline" },
  an_dbpullover: { f: "pullover", vk: "dumbbell" },
  an_heeltouch: { f: "core_rotation", vk: "heel_touch" },
  an_scissors: { f: "core_leg_lower", vk: "scissors" },

  // ---- variants of one movement, not separate stimuli ----------------
  an_dbbench: { f: "press_horizontal", vk: "dumbbell_flat", aka: ["db bench"] },
  an_inclbench: { f: "press_horizontal", vk: "barbell_incline" },
  an_incldbpress: { f: "press_horizontal", vk: "dumbbell_incline" },
  an_oadbbench: { f: "press_horizontal", vk: "dumbbell_one_arm", side: "perSide" },
  an_cgbench: { f: "press_horizontal", vk: "barbell_close_grip" },
  an_floorpress: { f: "press_horizontal", vk: "floor" },
  an_narrowdbpress: { f: "press_horizontal", vk: "dumbbell_narrow" },
  an_seateddbpress: { f: "press_vertical", vk: "dumbbell_seated", b: "strength" },
  an_hammer: { f: "curl_biceps", vk: "neutral_grip_dumbbell", aka: ["kladivo", "hammer"] },
  an_inclcurl: { f: "curl_biceps", vk: "incline_bench" },
  an_bbcurl: { f: "curl_biceps", vk: "barbell" },
  an_revcurl: { f: "curl_biceps", vk: "barbell_reverse" },
  an_cablecurl: { f: "curl_biceps", vk: "cable" },
  an_benchdbrow: { f: "pull_horizontal", vk: "bench_supported", side: "perSide" },
  an_revlunge: { f: "squat_unilateral", vk: "reverse", side: "alternating" },
  an_walklunge: { f: "squat_unilateral", vk: "walking", side: "alternating" },
  an_splitsquat: { f: "squat_unilateral", vk: "static_split", side: "perSide" },
  an_sumodeadlift: { f: "hinge", vk: "sumo_barbell" },
  an_dbdeadlift: { f: "hinge", vk: "dumbbell" },
  an_boxdeadlift: { f: "hinge", vk: "blocks" },
  an_defdeadlift: { f: "hinge", vk: "deficit" },
  an_pausesquat: { f: "squat_bilateral", vk: "barbell_paused" },
  an_dbfrontsquat: { f: "squat_bilateral", vk: "dumbbell_front" },
  an_chainbench: { f: "press_horizontal", vk: "barbell_chains" },
  an_svend: { f: "press_horizontal", vk: "svend" },
  an_hyperext: { f: "hip_extension", vk: "weighted_back_extension" },
  an_scaphang: { f: "hang", vk: "scapular" },
  an_armswing: { f: "mobility_shoulder", vk: "arm_swing", b: "prep" },
  an_inclfrench: { f: "triceps_ext", vk: "incline_dumbbell" },
  an_frenchpress: { f: "triceps_ext", vk: "lying_dumbbell" },
  an_ohcabletri: { f: "triceps_ext", vk: "overhead_cable" },

  // ---- rest that the role default gets wrong -------------------------
  deadlift: { rest: 240 },
  bench: { rest: 210 },
  bbsquat: { rest: 210 },
  powerclean: { rest: 180 },
};

export const OVERLAY = { ...BASE, ...TRAINING_V2_OVERLAY };

// One side at a time. The session shows a per-side row, the statistics
// count one working set, and a plan that says "8 each side" is not
// silently read as sixteen.
export const UNILATERAL = [
  "bulgsplit", "pistol", "boxpistol", "shrimp", "slbridge", "slrdl", "stepup", "sideplank",
  "dbrow", "suitcase", "archrow", "typewriter", "cossack",
  "an_oadbbench", "an_benchdbrow", "an_splitsquat",
];

// Left, right, left — one set, both sides, alternating inside it.
export const ALTERNATING = [
  "lunge", "latlunge", "jumplunge", "an_revlunge", "an_walklunge", "mtclimb", "bicycle", "an_heeltouch",
];

// Environment is a parameter, not a card. A treadmill run and an outdoor
// run share a history; what differs is worth recording, not worth
// splitting a card over.
export const ENVIRONMENTS = {
  act_run: [["venku", "outdoor"], ["pás", "treadmill"], ["trail", "trail"]],
  act_walk: [["venku", "outdoor"], ["pás", "treadmill"]],
  act_bike: [["venku", "outdoor"], ["trenažér", "stationary"], ["spinning", "spinning"]],
  act_swim: [["bazén", "pool"], ["otevřená voda", "open water"]],
  act_hike: [["trail", "trail"], ["hory", "mountain"]],
};
