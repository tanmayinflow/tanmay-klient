// Exact role-local guard evidence. Never transplant Main metadata.
export const BALANCE_AUDIT_CONTEXT={
  "version": 1,
  "role": "client",
  "entries": {},
  "metadataGuards": {
    "slbalance": {
      "t": "extended",
      "g": "goal_eq",
      "r": "support",
      "b": "accessory",
      "sk": "coordination",
      "tr": 1,
      "sf": 1,
      "f": "inversion_balance"
    },
    "ex26_single_reach": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 1,
      "f": "balance_reach"
    },
    "wallhs": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "ctwhs": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "wallwalk": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "mixed",
      "tr": 2,
      "sf": 2,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "ex26_heel_pull": {
      "t": "specialist",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "handstand_balance"
    },
    "ex26_toe_pull": {
      "t": "specialist",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "handstand_balance"
    },
    "handstand": {
      "t": "specialist",
      "g": "canon_target",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "bail": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 1,
      "sf": 1,
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "hsshift": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "handstandwalk": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "crow": {
      "t": "specialist",
      "g": "canon_target",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "onearmhs": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "mixed",
      "tr": 3,
      "sf": 2,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "bentarmhs": {
      "t": "specialist",
      "g": "explicit",
      "r": "strength_skill",
      "b": "strength",
      "tr": 2,
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "fingerhs": {
      "t": "specialist",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "sk": "coordination",
      "tr": 2,
      "sf": 1,
      "am": "straight",
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "headdown",
        "fall"
      ]
    },
    "bosuoahs": {
      "t": "archived",
      "s": "blocked",
      "g": "never",
      "r": "strength_skill",
      "b": "strength",
      "sk": "strength_skill",
      "tr": 3,
      "sf": 3,
      "f": "inversion_balance",
      "ctx": "inversion",
      "pc": [
        "blocked"
      ]
    }
  }
};
