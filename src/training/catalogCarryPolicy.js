// Pure derived policy, deliberately scoped to the exact reviewed rope climb.
// No storage, migration, history writes, broad equipment resolution or clinical rule.
export const ROPE_CLIMB_SELECTION_POLICY='reviewed-ropeclimb-v1';
export const ROPE_CLIMB_EQUIPMENT=Object.freeze(['climbing_rope_station','protective_landing_mat']);
export const ROPE_CLIMB_SOURCE_SIGNATURE={
  "id": {
    "present": true,
    "value": "ropeclimb"
  },
  "cz": {
    "present": true,
    "value": "Šplh na laně s pomocí nohou"
  },
  "en": {
    "present": true,
    "value": "Rope Climb with Foot Lock"
  },
  "pat": {
    "present": true,
    "value": "tah"
  },
  "eq": {
    "present": true,
    "value": [
      "hrazda"
    ]
  },
  "mode": {
    "present": true,
    "value": "reps"
  },
  "seed": {
    "present": true,
    "value": "TEX_SEED_9"
  },
  "pos": {
    "present": true,
    "value": [
      "Stůj pod šplhacím lanem na připraveném stanovišti s vhodným zavěšením, volným okolím a ochrannou žíněnkou. Před použitím zkontroluj lano i uchycení podle pokynů výrobce. S trenérem si nejprve u země nacvič sevření lana chodidly i návrat dolů; pak uchop lano oběma rukama nad hlavou.",
      "Stand below a climbing rope at a prepared station with suitable anchoring, clear surroundings and protective matting. Inspect the rope and attachment before use according to the manufacturer's instructions. First practise the foot lock and return to the floor close to the ground with a coach, then grip the rope overhead with both hands."
    ]
  },
  "exe": {
    "present": true,
    "value": [
      "Přisuň kolena, vytvoř nacvičené sevření lana chodidly a ověř, že neprokluzuje. Opři se do něj a napřímením nohou zvedni tělo, rukama postupně přehmátni výš. Cyklus opakuj jen do předem zvolené zvládnutelné výšky. Dolů sestupuj malými kontrolovanými přehmaty s oporou nohou až na zem.",
      "Bring the knees up, establish the foot lock you have practised and check that it does not slip. Press into that support and extend the legs to raise the body, moving the hands higher in turn. Repeat the cycle only to a manageable height chosen beforehand. Descend with small, controlled hand placements and foot support all the way to the floor."
    ]
  },
  "foc": {
    "present": true,
    "value": [
      "Úchop, opora chodidel a přehmaty spolupracují; podíl práce nohou není pevně dané procento. Karta zapisuje opakování. Před sérií uveď, zda počítáš celé výstupy, nebo jednotlivé výstupní cykly, a zapiš výšku i způsob opory nohou. Staré počty nepřeváděj na metry ani na jiný význam opakování.",
      "Grip, foot support and hand placements work together; the legs' contribution is not a fixed percentage. This card records repetitions. Before the set, state whether you count complete ascents or individual climbing cycles, and record the height and foot-lock method. Do not convert old counts into metres or a different meaning of repetition."
    ]
  },
  "family": {
    "present": false
  },
  "variantKey": {
    "present": false
  },
  "tier": {
    "present": false
  },
  "sessionRole": {
    "present": false
  },
  "goalRole": {
    "present": false
  },
  "genRule": {
    "present": false
  },
  "measurementType": {
    "present": false
  },
  "sideMode": {
    "present": false
  },
  "load": {
    "present": false
  },
  "loadMode": {
    "present": false
  },
  "status": {
    "present": false
  },
  "aliasOf": {
    "present": false
  },
  "source": {
    "present": false
  },
  "selectionPolicy": {
    "present": false
  }
};
export const ROPE_CLIMB_META_SIGNATURES=[
  {
    "role": "main",
    "fields": {
      "t": {
        "present": true,
        "value": "extended"
      },
      "f": {
        "present": true,
        "value": "grip_carry"
      },
      "g": {
        "present": true,
        "value": "goal_eq"
      },
      "r": {
        "present": true,
        "value": "strength"
      },
      "b": {
        "present": true,
        "value": "strength"
      },
      "src": {
        "present": true,
        "value": "tanmay"
      }
    }
  },
  {
    "role": "client",
    "fields": {
      "t": {
        "present": true,
        "value": "extended"
      },
      "f": {
        "present": true,
        "value": "grip_carry"
      },
      "g": {
        "present": true,
        "value": "goal_eq"
      },
      "r": {
        "present": true,
        "value": "strength"
      },
      "b": {
        "present": true,
        "value": "strength"
      },
      "src": {
        "present": false
      }
    }
  }
];
export const ROPE_CLIMB_TAXONOMY_SIGNATURE={
  "movements": [
    "pull_vertical",
    "locomotion"
  ],
  "positions": [
    "standing"
  ],
  "supports": [
    "suspension"
  ],
  "equipmentRequirements": [
    [
      "climbing_rope_station"
    ],
    [
      "protective_landing_mat"
    ]
  ],
  "priority": 2,
  "focus": [
    "strength",
    "coordination"
  ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function isReviewedRopeClimb(row,meta={}) {
 meta=meta||{};
 if(!row || row.id!=='ropeclimb')return false;
 if(!Object.entries(ROPE_CLIMB_SOURCE_SIGNATURE).every(([key,s])=>Object.hasOwn(row,key)===s.present&&(!s.present||same(row[key],s.value))))return false;
 if(!ROPE_CLIMB_META_SIGNATURES.some(signature=>Object.entries(signature.fields).every(([key,s])=>Object.hasOwn(meta,key)===s.present&&(!s.present||same(meta[key],s.value)))))return false;
 // Equipment is the relevant contract. Personal navigation/priority labels do
 // not change the required physical station or get rewritten by this policy.
 if(!row.taxonomy || !same(row.taxonomy.equipmentRequirements,ROPE_CLIMB_TAXONOMY_SIGNATURE.equipmentRequirements))return false;
 // An unsupported personally supplied coach flag is not evidence of the default card.
 if(Object.hasOwn(row,'requiresCoach')&&typeof row.requiresCoach!=='boolean')return false;
 if(Object.hasOwn(meta,'co')&&typeof meta.co!=='boolean')return false;
 return true;
}
export function reviewedRopeClimbPolicy(row,meta={}) {
 meta=meta||{};
 if(!isReviewedRopeClimb(row,meta))return null;
 const requiresCoach=typeof row.requiresCoach==='boolean'?row.requiresCoach:typeof meta.co==='boolean'?meta.co:true;
 return {
  equipment:[...ROPE_CLIMB_EQUIPMENT],
  generatorEligible:false,
  requiresCoach,
  requiresEquipmentCheck:true,
  selectionPolicy:ROPE_CLIMB_SELECTION_POLICY
 };
}
// A narrow precheck inside selectableFor; null defers to every existing gate.
export function reviewedRopeClimbRefusal(rec,ctx={}) {
 if(!rec || rec.selectionPolicy!==ROPE_CLIMB_SELECTION_POLICY)return null;
 if(rec.id!=='ropeclimb'||!same(rec.equipment,ROPE_CLIMB_EQUIPMENT))return {ok:false,why:'reviewed-rope-policy-mismatch'};
 if(!ctx.explicitTarget)return {ok:false,why:'reviewed-rope-needs-target'};
 if(!Array.isArray(ctx.equipment))return {ok:false,why:'reviewed-rope-equipment-unconfirmed'};
 return null;
}
