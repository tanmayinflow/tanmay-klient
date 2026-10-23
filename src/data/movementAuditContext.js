// Role-local guard evidence. Never share Main data with Client.
export const MOVEMENT_AUDIT_CONTEXT={
  "version": 1,
  "role": "client",
  "entries": {},
  "metadataGuards": {
    "crunch": {
      "t": "core",
      "g": "generic",
      "r": "strength",
      "b": "strength",
      "tr": 1
    },
    "situp": {
      "t": "core",
      "g": "generic",
      "r": "strength",
      "b": "strength",
      "tr": 1
    },
    "bicycle": {
      "t": "core",
      "g": "generic",
      "r": "strength",
      "b": "strength",
      "tr": 2
    },
    "ex26_reverse_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "ex26_oblique_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 1,
      "f": "core_flexion"
    },
    "ex26_toe_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "ig27_seated_kneetuck": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "accessory",
      "tr": 2,
      "f": "core_seated_flexion"
    },
    "ex26_cable_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "ex26_decline_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "ex26_ball_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "ex26_machine_crunch": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_flexion"
    },
    "russtwist": {
      "t": "core",
      "g": "generic",
      "r": "strength",
      "b": "strength",
      "tr": 2
    },
    "woodchop": {
      "t": "extended",
      "g": "goal_eq",
      "r": "strength",
      "b": "strength",
      "tr": 2
    },
    "wipers": {
      "t": "extended",
      "g": "goal_eq",
      "r": "strength",
      "b": "strength",
      "tr": 2
    },
    "ex26_halfkneel_lift": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ex26_cable_rotation": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ex26_standing_lift": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ex26_singleleg_rotation": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ex26_rotational_cable_press": {
      "t": "specialist",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ig28_dumbbell_side_bend": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_lateral_flexion"
    },
    "cat": {
      "t": "core",
      "g": "generic",
      "r": "mobility",
      "b": "prep",
      "tr": 1,
      "pj": [
        "pat"
      ]
    },
    "jefferson": {
      "t": "specialist",
      "g": "explicit",
      "r": "mobility",
      "b": "mobility",
      "tr": 1,
      "f": "curl_biceps",
      "pc": [
        "spine"
      ]
    },
    "superman": {
      "t": "core",
      "g": "generic",
      "r": "strength",
      "b": "strength",
      "tr": 1
    },
    "ex26_pelvic_tilt": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_prone_opposite": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_plank_rotation": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 2,
      "f": "core_rotation"
    },
    "ex26_mob_lumbar_locked": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "mobility",
      "b": "prep",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_mob_side_windmill": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "mobility",
      "b": "prep",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_mob_seated_rotation": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "mobility",
      "b": "prep",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_mob_chair_extension": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "mobility",
      "b": "prep",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_knees_sideplank": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 1,
      "f": "core_lateral"
    },
    "ex26_hss_wall_sideplank": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 1,
      "f": "core_lateral"
    },
    "ex26_hss_sideplank_leg": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "core_lateral"
    },
    "ex26_hss_sideplank_march": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 3,
      "f": "core_lateral"
    },
    "ex26_heel_slide": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_reverse_march": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "strength",
      "b": "strength",
      "tr": 1,
      "f": "spinal_control"
    },
    "ex26_dns_side_reach": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 1,
      "f": "core_lateral"
    },
    "ex26_dns_side_band": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "core_lateral"
    },
    "ex26_dns_side_roll": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 1,
      "f": "core_rotation"
    },
    "ex26_dns_oblique_forearm": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "core_lateral"
    },
    "ex26_dns_oblique_hand": {
      "t": "extended",
      "s": "active",
      "g": "explicit",
      "r": "coordination_skill",
      "b": "coordination_skill",
      "tr": 2,
      "f": "core_lateral"
    }
  }
};
