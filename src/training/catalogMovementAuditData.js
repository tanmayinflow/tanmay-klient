// Shared reviewed exercise templates only. No private role metadata or Main-only cards.
export const MOVEMENT_AUDIT_ENTRIES={
  "crunch": {
    "before": {
      "id": "crunch",
      "cz": "Zkracovačka",
      "en": "Crunch",
      "pat": "stred",
      "S": 1,
      "C": 1,
      "J": {
        "pat": 1
      },
      "pop": 3,
      "eq": [
        "telo"
      ],
      "mode": "reps",
      "mp": [
        "abs"
      ],
      "ms": [],
      "dot": [
        96,
        162
      ],
      "ez": null,
      "hd": "situp",
      "foc": [
        "Bedra zůstávají na zemi. Zvedá se jen hrudník.",
        "The lower back stays on the ground. Only the chest curls up."
      ],
      "pos": [
        "Leh, kolena pokrčená, chodidla na zemi, dlaně k spánkům.",
        "On your back, knees bent, feet planted, fingertips to the temples."
      ],
      "exe": [
        "S výdechem stáhni hrudník ke kolenům o pár centimetrů. Pomalu zpět.",
        "Exhale and curl the chest a few centimetres toward the knees. Return slowly."
      ],
      "wat": [
        "Brada netlačí na hrudník, ruce netahají hlavu.",
        "The chin never jams the chest; the hands never pull the head."
      ],
      "pro": [
        "Pomaleji, s výdrží nahoře. Pak sed-leh.",
        "Slower, with a hold at the top. Then the sit-up."
      ],
      "seed": "TEX_SEED_5B"
    },
    "edits": {
      "hd": null,
      "exe": [
        "S výdechem krátce přibliž hrudník k pánvi a zvedni lopatky. Pánev zůstává na zemi; nejde o celý přechod do sedu. Pomalu se vrať.",
        "Exhale, briefly curl the chest toward the pelvis and lift the shoulder blades. Keep the pelvis grounded; this is not a full sit-up. Return slowly."
      ],
      "foc": [
        "Jeden krátký zdvih trupu a návrat tvoří opakování. Hlava následuje hrudník, ruce ji nevytahují.",
        "One short trunk curl and return form a repetition. The head follows the chest; the hands do not pull it up."
      ],
      "pro": [
        "Lehčí možnost je menší zdvih nebo ruce blíže k trupu. Volitelně zpomal návrat či přidej krátkou pauzu. Sed-leh zapojuje větší pohyb v kyčlích a není povinný další stupeň.",
        "Easier options are a smaller curl or hands closer to the torso. Optionally slow the return or pause briefly. A sit-up involves more hip movement and is not a required next level."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Crunch",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/",
        "scope": "Unanchored bent-knee upper-trunk curl. The existing fingertips-at-temples setup is retained as a hands-position option. Original coaching and repetition wording; no universal superiority, back-treatment or mandatory sit-up progression claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_5B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "crunch",
      "atlasId": "crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "253a3ccb1475304ff67cb2e3b8525a34e11469cd16d80dc1ced8db2a0fe9cf75",
        "thumb": "/unified-atlas/crunch-5527c66d0745382d-thumb.webp",
        "detail": "/unified-atlas/crunch-d420465e89d0183e-detail.webp",
        "inkThumb": "/unified-atlas/crunch-86ef6ce16f2d194c-inkThumb.webp",
        "inkDetail": "/unified-atlas/crunch-ce6657a39e7f2078-inkDetail.webp",
        "fillThumb": "/unified-atlas/crunch-da879acbe5fc006b-fillThumb.webp",
        "fillDetail": "/unified-atlas/crunch-015ead3cccba2cde-fillDetail.webp"
      },
      "sourceSha256": "253a3ccb1475304ff67cb2e3b8525a34e11469cd16d80dc1ced8db2a0fe9cf75",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "situp": {
    "before": {
      "id": "situp",
      "cz": "Sed-leh",
      "en": "Sit-Up",
      "pat": "stred",
      "S": 1,
      "C": 1,
      "J": {
        "pat": 2
      },
      "pop": 3,
      "eq": [
        "telo"
      ],
      "mode": "reps",
      "mp": [
        "abs"
      ],
      "ms": [
        "obl"
      ],
      "dot": [
        98,
        142
      ],
      "ez": "crunch",
      "hd": "vup",
      "foc": [
        "Nahoru se kulatíš obratel po obratli, ne švihem.",
        "You curl up vertebra by vertebra, never by momentum."
      ],
      "pos": [
        "Leh, kolena pokrčená, paže zkřížené na hrudi nebo natažené vpřed.",
        "On your back, knees bent, arms crossed on the chest or reaching forward."
      ],
      "exe": [
        "Plynule do sedu, hrudník ke kolenům. Stejně plynule zpět.",
        "Smoothly up to sitting, chest toward the knees. Just as smoothly back down."
      ],
      "wat": [
        "Chodidla drží zem bez zaklesnutí. Když to nejde bez švihu, zůstaň u zkracovačky.",
        "Feet stay down without anchoring. If it needs a swing, stay with the crunch."
      ],
      "pro": [
        "Paže dál od těla, pomalejší tempo, pak véčka.",
        "Arms further overhead, slower tempo, then the V-up."
      ],
      "seed": "TEX_SEED_5B"
    },
    "edits": {
      "hd": null,
      "exe": [
        "Plynule zvedni trup do sedu v ovládaném rozsahu, bez rozmachu paží. Potom se kontrolovaně vrať na záda. Chodidla zůstávají opřená o zem.",
        "Raise the torso smoothly toward sitting through a controlled range without swinging the arms. Then lower onto the back under control. Keep the feet on the floor."
      ],
      "wat": [
        "Tato varianta má chodidla bez ukotvení. Pokud se zvedají nebo potřebuješ prudký švih, zkrať rozsah či zvol zkracovačku. Netlač hlavou vpřed.",
        "This variant uses unanchored feet. If they lift or you need a sudden swing, shorten the range or choose a crunch. Do not thrust the head forward."
      ],
      "foc": [
        "Jeden přechod z lehu do sedu a kontrolovaný návrat tvoří opakování. Pohybuje se trup i kyčle; nejde jen o delší zkracovačku.",
        "One rise from lying toward sitting and a controlled return form a repetition. Both the trunk and hips move; this is more than a longer crunch."
      ],
      "pro": [
        "Uprav nejdříve rozsah a tempo podle kontroly neukotvených chodidel. Poloha paží může změnit nárok. Véčka jsou jiný cvik se zvedáním nohou, nikoli povinné pokračování.",
        "First adjust range and tempo to maintain control with unanchored feet. Arm position can change the demand. V-ups add a leg lift and are a different exercise, not a required progression."
      ],
      "source": {
        "author": "Catalyst Athletics",
        "document": "Sit-Up",
        "url": "https://www.catalystathletics.com/exercise/432/Sit-Up/",
        "scope": "Bent-knee sit-up. The source allows anchored or unanchored feet; this existing entry deliberately retains unanchored feet and its crossed-arm or forward-reaching option instead of the source hands-at-head setup. No butterfly/AbMat variant, universal dose or vertebra-by-vertebra guarantee is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_5B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "situp",
      "atlasId": "situp",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "9c7c3291db0be9034aac01ff40cd7b2101dac521333b5f0f08425465411689b6",
        "thumb": "/unified-atlas/situp-6d1707bdb6c80b61-thumb.webp",
        "detail": "/unified-atlas/situp-5e7185eaad6e8d91-detail.webp",
        "inkThumb": "/unified-atlas/situp-e4bc58c879ff8b19-inkThumb.webp",
        "inkDetail": "/unified-atlas/situp-cdcd7abd3c55ed5b-inkDetail.webp",
        "fillThumb": "/unified-atlas/situp-00a33e815074947b-fillThumb.webp",
        "fillDetail": "/unified-atlas/situp-c70c580ea4ac9886-fillDetail.webp"
      },
      "sourceSha256": "9c7c3291db0be9034aac01ff40cd7b2101dac521333b5f0f08425465411689b6",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "bicycle": {
    "before": {
      "id": "bicycle",
      "cz": "Kolo vleže",
      "en": "Bicycle Crunch",
      "pat": "stred",
      "S": 2,
      "C": 2,
      "J": {
        "pat": 1
      },
      "pop": 3,
      "eq": [
        "telo"
      ],
      "mode": "reps",
      "mp": [
        "abs",
        "obl"
      ],
      "ms": [],
      "dot": [
        98,
        152
      ],
      "ez": "crunch",
      "hd": null,
      "foc": [
        "Rameno jde ke koleni, ne loket. Rotuje hrudník.",
        "The shoulder travels to the knee, not the elbow. The chest rotates."
      ],
      "pos": [
        "Leh, ramena nad zemí, dlaně k spánkům, nohy ve vzduchu.",
        "On your back, shoulders off the ground, fingertips to the temples, legs raised."
      ],
      "exe": [
        "Střídavě koleno k hrudi a protilehlé rameno k němu, druhá noha se propíná.",
        "Alternate one knee in as the opposite shoulder rotates toward it, the other leg extending."
      ],
      "wat": [
        "Bedra tisknou zem, pomalu a s kontrolou — rychlost ničí rotaci.",
        "The lower back presses down; slow and controlled — speed kills the rotation."
      ],
      "pro": [
        "Pomaleji, natažená noha níž.",
        "Slower, the extended leg lower."
      ],
      "seed": "TEX_SEED_5B"
    },
    "edits": {
      "exe": [
        "Přitáhni jedno koleno k trupu a natoč k němu protilehlé rameno; druhou nohu vysuň do pohodlného dosahu. Kontrolovaně vystřídej strany, bez tahání za hlavu.",
        "Draw one knee toward the torso and turn the opposite shoulder toward it while extending the other leg to a comfortable reach. Switch sides under control without pulling on the head."
      ],
      "wat": [
        "Délku a výšku vysunuté nohy zvol tak, aby se bedra výrazně neprohýbala a pánev nehoupala. Nemusíš nohu úplně propnout ani spouštět těsně k zemi. Plynule dýchej.",
        "Choose the extended leg’s reach and height to avoid marked lower-back arching or pelvic rocking. You do not need to straighten it fully or lower it close to the floor. Keep breathing."
      ],
      "foc": [
        "Střídá se koleno s protilehlým ramenem; dotyk lokte není nutný. Počet jednotlivých stran nebo dvojic se řídí plánem, při srovnávání používej stejné počítání.",
        "Alternate a knee with the opposite shoulder; elbow contact is unnecessary. Count individual sides or pairs as prescribed, using the same convention for comparisons."
      ],
      "pro": [
        "Lehčí možnost: menší rotace a kratší dosah druhé nohy. Delší dosah či pomalejší střídání přidávej jen při zachování kontroly; nižší noha není cílem sama o sobě.",
        "Easier options are less rotation and a shorter reach of the other leg. Increase reach or slow the alternation only while maintaining control; a lower leg position is not a goal in itself."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Supine Bicycle Crunches",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/241/supine-bicycle-crunches/",
        "scope": "Alternating opposite-shoulder/knee trunk rotation with the other leg extending. Comfortable reach and counting conventions are original coaching, not a universal source protocol. No EMG ranking, spot-reduction or forced maximal lumbar flattening claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "alternating"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_5B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "bicycle",
      "atlasId": "bicycle",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "9d9e0c0532bf6831a72d71154bc0a23c21c7045ae0edaebf89a40923c547bc45",
        "thumb": "/unified-atlas/bicycle-93c752acc24198db-thumb.webp",
        "detail": "/unified-atlas/bicycle-71675995384c08d1-detail.webp",
        "inkThumb": "/unified-atlas/bicycle-47d9b4baa157deb7-inkThumb.webp",
        "inkDetail": "/unified-atlas/bicycle-d95465fdd668b9ef-inkDetail.webp",
        "fillThumb": "/unified-atlas/bicycle-d8c592f509932b8f-fillThumb.webp",
        "fillDetail": "/unified-atlas/bicycle-b04f679a8fa12c8a-fillDetail.webp"
      },
      "sourceSha256": "9d9e0c0532bf6831a72d71154bc0a23c21c7045ae0edaebf89a40923c547bc45",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_reverse_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jedno malé stočení pánve vzhůru a kontrolovaný návrat je opakování. Kolena se vracejí nad kyčle; nejde o spouštění natažených nohou.",
        "One small upward pelvic curl and controlled return form a repetition. The knees return above the hips; this is not a straight-leg lowering exercise."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Reverse Ab Crunch",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/",
        "scope": "Bent-knee pelvic curl with palms supporting on the floor and return to thighs above hips. This entry retains a small controlled lift and arms beside the trunk, rather than requiring the source’s maximum roll-up range or wider arm placement. Replaces a mismatched Catalyst variant that holds a fixed support behind the head and lowers the legs farther."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_reverse_crunch",
      "atlasId": "ex26_reverse_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "8ebb900d4028c98a8f51741f26c479328c33f32e77fe0e3d4f187f6737cd30df",
        "thumb": "/expansion-atlas/ex26_reverse_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_reverse_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_reverse_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_reverse_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_reverse_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_reverse_crunch-fill-960.webp"
      },
      "sourceSha256": "8ebb900d4028c98a8f51741f26c479328c33f32e77fe0e3d4f187f6737cd30df",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_oblique_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "exe": [
        "Zvedni lopatku a natoč hrudník směrem k protilehlému kolenu. Pomalu se vrať, pánev a obě chodidla drž na místě. Strany vystřídej průběžně nebo po sérii podle plánu.",
        "Lift a shoulder blade and turn the chest toward the opposite knee. Return slowly with the pelvis and both feet staying in place. Alternate sides each repetition or after a set as prescribed."
      ],
      "foc": [
        "Jeden zdvih s otočením a návrat tvoří opakování na danou stranu. Zapisuj počet na každou stranu; stranu označuje směr otočení hrudníku.",
        "One rotating curl and return form a repetition for that side. Record repetitions for each side; the side is identified by the direction the chest turns."
      ],
      "source": {
        "author": "Hevy",
        "document": "Oblique Crunch: How-to, Tips, Variations, Mistakes",
        "url": "https://www.hevyapp.com/exercises/oblique-crunches/",
        "scope": "The existing Hevy-authored instruction matches both feet grounded, fingertips near the head and opposite-shoulder trunk rotation. This entry permits alternating or separate per-side sets according to the plan while preserving perSide recording. No knee-crossed, knees-dropped-sideways or full cross-body sit-up variant is substituted."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_oblique_crunch",
      "atlasId": "ex26_oblique_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "0e884c4fd8c25fab7f5507baf12fd02783f24bac6745ec79872b918f469bb36a",
        "thumb": "/expansion-atlas/ex26_oblique_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_oblique_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_oblique_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_oblique_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_oblique_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_oblique_crunch-fill-960.webp"
      },
      "sourceSha256": "0e884c4fd8c25fab7f5507baf12fd02783f24bac6745ec79872b918f469bb36a",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_toe_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jeden krátký zdvih lopatek a návrat tvoří opakování. Nohy zůstávají nad pánví; dosah rukou není švih ani podmínka dotknout se prstů.",
        "One short shoulder-blade lift and return form a repetition. Keep the legs above the pelvis; the arm reach is neither a swing nor a requirement to touch the toes."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Vertical Toe Touches",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/243/vertical-toe-touches/",
        "scope": "Vertical-leg upper-trunk curl with hands reaching toward the feet. This existing entry allows a soft knee bend and does not require literal toe contact. Repetition wording is original coaching; not a V-up with simultaneous lowering and lifting of the legs."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_toe_crunch",
      "atlasId": "ex26_toe_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "518844b698b0e74d71c9f0d707cb363d43a1fdc2b03aa54b7c83258942e13309",
        "thumb": "/expansion-atlas/ex26_toe_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_toe_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_toe_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_toe_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_toe_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_toe_crunch-fill-960.webp"
      },
      "sourceSha256": "518844b698b0e74d71c9f0d707cb363d43a1fdc2b03aa54b7c83258942e13309",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ig27_seated_kneetuck": {
    "before": {
      "id": "ig27_seated_kneetuck",
      "cz": "Přitahování kolen v sedu s oporou rukou",
      "en": "Seated Hand-Supported Knee Tuck",
      "pat": "stred",
      "eq": [
        "telo"
      ],
      "mp": [
        "abs",
        "hipflex"
      ],
      "ms": [
        "qua"
      ],
      "S": 2,
      "C": 2,
      "sideMode": "none",
      "family": "core_seated_flexion",
      "J": {
        "kyc": 1,
        "pat": 1,
        "zap": 1
      },
      "pop": 1,
      "mode": "reps",
      "load": "none",
      "measurementType": "BODYWEIGHT_REPS",
      "tier": "extended",
      "sessionRole": "accessory",
      "goalRole": "strength",
      "genRule": "explicit",
      "variantKey": "ig27_seated_kneetuck",
      "ez": null,
      "hd": null,
      "defaultRestSec": 60,
      "collection": "instagram_practical",
      "aliases": [
        "seated knee tuck",
        "in and outs seated"
      ],
      "searchAliases": [
        "seated knee tuck",
        "in and outs seated"
      ],
      "source": {
        "author": "West End Physio",
        "document": "Seated Knee Tuck",
        "url": "https://westendphysio.com/weekly-exercises/seated-knee-tuck/",
        "scope": "Original controlled seated knee-tuck card with hands supporting behind hips. No fat-loss claim, prescribed high volume or claim of isolating the lower abdomen.",
        "instagram": "https://www.instagram.com/tiboinshape/reel/DLmvonVM0kQ/",
        "instagramUrls": [
          "https://www.instagram.com/tiboinshape/reel/DLmvonVM0kQ/"
        ]
      },
      "pos": [
        "Sedni si a polož dlaně za boky. Mírně se zakloň, lokty nech lehce pokrčené a zvedni obě chodidla. Pánev zůstává opřená o zem.",
        "Sit and place the palms behind the hips. Lean back slightly, soften the elbows and lift both feet. Keep the pelvis supported on the floor."
      ],
      "exe": [
        "Přitáhni kolena směrem k trupu a potom nohy pomalu vysuň vpřed. Chodidla nech nad zemí, ale natahuj je jen tak daleko, abys udržel řízený pohyb trupu.",
        "Draw the knees toward the torso, then slowly extend the legs forward. Keep the feet above the floor, extending only as far as you can control the trunk."
      ],
      "wat": [
        "Neodrážej se rukama a nehoupej se do krajního záklonu. Ramena nedrž u uší. Rozsah zkrať, pokud pohyb začne tahat v bedrech nebo se ztratí kontrola pánve.",
        "Do not bounce off the hands or rock into an excessive backward lean. Keep the shoulders away from the ears. Shorten the range if the lower back feels strained or pelvic control is lost."
      ],
      "pro": [
        "Lehčí: kratší vysunutí nohou nebo krátké položení pat mezi opakováními. Těžší: pomalejší vysunutí a krátká pauza s nohama dál od těla, bez změny opory rukou.",
        "Easier: extend the legs less or briefly rest the heels between repetitions. Harder: extend more slowly and pause briefly with the feet farther away, keeping the same hand support."
      ],
      "foc": [
        "Pánev zůstává na zemi, kolena se přibližují a vzdalují.",
        "Keep the pelvis grounded as the knees move in and out."
      ],
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "wat": [
        "Neodrážej se rukama a nehoupej se do krajního záklonu. Zkrať dosah, pokud ztrácíš klidnou polohu trupu nebo pohodlnou oporu dlaní. Dýchej průběžně.",
        "Do not bounce off the hands or rock into an excessive backward lean. Shorten the reach if you lose trunk control or comfortable palm support. Keep breathing."
      ],
      "foc": [
        "Jedno současné přitažení obou kolen a vysunutí nohou tvoří opakování. Pánev zůstává na zemi, dlaně drží oporu a trup udržuje mírný záklon.",
        "One simultaneous tuck of both knees and extension of the legs form a repetition. Keep the pelvis grounded, the palms supporting and the trunk in a slight backward lean."
      ],
      "source": {
        "author": "West End Physio",
        "document": "Seated Knee Tuck",
        "url": "https://westendphysio.com/weekly-exercises/seated-knee-tuck/",
        "scope": "The source describes a floor-seated, hands-behind-hips knee tuck with a slight backward lean and both legs extending without touching down. The taxonomy interprets hip/knee movement with trunk control; it is not the source’s literal classification. No lower-abdominal isolation, fat-loss claim or prescribed volume is imported. Existing Instagram provenance is retained, not newly verified or attributed as the clinical source.",
        "instagram": "https://www.instagram.com/tiboinshape/reel/DLmvonVM0kQ/",
        "instagramUrls": [
          "https://www.instagram.com/tiboinshape/reel/DLmvonVM0kQ/"
        ]
      }
    },
    "taxonomy": {
      "movements": [
        "joint",
        "trunk_stability"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ig27_seated_kneetuck",
      "atlasId": "ig27_seated_kneetuck",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "1884352930c00e8fdc8048500303ec13b0614ab8251b4893501e6fd88891045a",
        "thumb": "/expansion-atlas/ig27_seated_kneetuck-original-256.webp",
        "detail": "/expansion-atlas/ig27_seated_kneetuck-original-960.webp",
        "inkThumb": "/expansion-atlas/ig27_seated_kneetuck-ink-256.webp",
        "inkDetail": "/expansion-atlas/ig27_seated_kneetuck-ink-960.webp",
        "fillThumb": "/expansion-atlas/ig27_seated_kneetuck-fill-256.webp",
        "fillDetail": "/expansion-atlas/ig27_seated_kneetuck-fill-960.webp"
      },
      "sourceSha256": "1884352930c00e8fdc8048500303ec13b0614ab8251b4893501e6fd88891045a",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_cable_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Před horní kladkou ověř volné místo pro klek a bezpečné spojení lanového adaptéru. Klekni si s boky přibližně nad koleny; podle potřeby je podlož. Oba konce lana drž vedle hlavy, bez tlaku lana na krk.",
        "Check for clear kneeling space in front of a high pulley and secure the rope attachment. Kneel with hips roughly over the knees, padding them if needed. Hold both rope ends beside the head without pressing the rope into the neck."
      ],
      "foc": [
        "Jedno kontrolované zakulacení trupu a návrat tvoří opakování. Zapisuj zvolenou zátěž dané kladky a pro srovnání poznamenej stanoviště; její číslo nemusí odpovídat odporu jiné kladky.",
        "One controlled trunk curl and return form a repetition. Record the selected load on that cable station and note the station for comparison; its displayed number need not equal another pulley’s resistance."
      ],
      "pro": [
        "Vol menší odpor nebo kratší ovládaný rozsah, pokud tah mění polohu rukou či těla. Odpor zvyšuj volitelně až při stejném provedení. Zkracovačka na zemi je jiná varianta bez kladky.",
        "Use less resistance or a shorter controlled range if the pull changes hand or body position. Optionally increase resistance while retaining the same technique. A floor crunch is a different variation without a cable."
      ],
      "source": {
        "author": "Hevy",
        "document": "Cable Crunch: How-to, Benefits, Tips, Mistakes & Variations",
        "url": "https://www.hevyapp.com/exercises/how-to-cable-crunch/",
        "scope": "The Hevy-authored kneeling high-pulley rope instruction supports trunk flexion rather than sitting back through the hips. This existing entry keeps hands beside the head and exhaling during the curl as original coaching; it does not reproduce the article’s rope-behind-head placement or reversed breathing wording. No universal dose, spinal-treatment or maximum-strength claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "kneeling"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "high_cable",
          "adjustable_cable"
        ],
        [
          "cable_rope"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ex26_cable_crunch",
      "atlasId": "ex26_cable_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "a8676704cacb501aeb01d8b3a823cd7f49b60412f0d33ab4820659029f7c0176",
        "thumb": "/expansion-atlas/ex26_cable_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_cable_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_cable_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_cable_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_cable_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_cable_crunch-fill-960.webp"
      },
      "sourceSha256": "a8676704cacb501aeb01d8b3a823cd7f49b60412f0d33ab4820659029f7c0176",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_decline_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "cz": "Zkracovačka na lavici hlavou dolů",
      "pos": [
        "Nastav malý záporný sklon lavice určené pro tento cvik a zajisti nastavení. Nohy upevni v jejích oporách podle návodu, abys nesklouzával. Lehni si s hlavou níž než nohy a paže překřiž na hrudi.",
        "Set and lock a shallow decline on a bench designed for this exercise. Secure the legs in its supports as instructed so that you do not slide down. Lie with the head lower than the feet and cross the arms over the chest."
      ],
      "exe": [
        "Krátce přibliž hrudník k pánvi a nadzvedni lopatky, zatímco pánev zůstává na lavici. Pomalu se vrať do opory; nepřecházej do celého sedu.",
        "Briefly curl the chest toward the pelvis and lift the shoulder blades while the pelvis stays on the bench. Return slowly to support without rising into a full sit-up."
      ],
      "foc": [
        "Jeden krátký zdvih trupu a návrat tvoří opakování. Pro srovnání zachovej sklon lavice a polohu paží; tato karta zapisuje opakování bez přidané zátěže.",
        "One short trunk curl and return form a repetition. Keep bench angle and arm position consistent for comparison; this entry records repetitions without added weight."
      ],
      "pro": [
        "Lehčí možnost je menší záporný sklon nebo zkracovačka na zemi. Podle plánu lze upravit tempo či malou změnu sklonu, pokud se nemění krátký pohyb trupu. Strmější lavice ani vyšší počet nejsou povinný cíl.",
        "Easier options are a shallower decline or a floor crunch. Adjust tempo or make a small angle change as prescribed while retaining the short trunk curl. A steeper bench or more repetitions is not a required goal."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Crunch Time: An Evidence-based Approach to Training the Abs — decline bench curl-up description",
        "url": "https://www.acefitness.org/resources/pros/expert-articles/8989/crunch-time-an-evidence-based-approach-to-training-the-abs/",
        "scope": "Only the decline-bench curl-up definition with legs/feet secured by rollers is used, together with the linked traditional crunch. This entry retains crossed arms and a small controlled curl. The article’s EMG-based efficacy ranking, aesthetics and training volume are not imported. Replaces a Hevy guide whose steps describe a larger rise than its own crunch-versus-sit-up distinction."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [
        "chair_bench"
      ],
      "equipmentRequirements": [
        [
          "decline_bench_leg_support"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ],
      "aliases": [
        "Zkracovačka na šikmé lavici"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_decline_crunch",
      "atlasId": "ex26_decline_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "5f11cb80d47b1499f72964013c6fd930642a824187ce13cd8fed45eea32f0e7c",
        "thumb": "/expansion-atlas/ex26_decline_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_decline_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_decline_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_decline_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_decline_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_decline_crunch-fill-960.webp"
      },
      "sourceSha256": "5f11cb80d47b1499f72964013c6fd930642a824187ce13cd8fed45eea32f0e7c",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_ball_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Použij nepoškozený gymnastický míč vhodné velikosti a nosnosti na neklouzavém místě. Opři o něj záda i spodní část pánve, chodidla polož stabilně na zem a paže překřiž na hrudi. Kolena zůstávají pohodlně pokrčená.",
        "Use an intact exercise ball of suitable size and load rating on a non-slip surface. Support the back and lower pelvis on it, plant the feet firmly and cross the arms over the chest. Keep the knees comfortably bent."
      ],
      "exe": [
        "Krátkým zakulacením přibliž hrudník k pánvi a zvedni horní část zad z míče. Bedra a spodní část pánve zůstávají v kontaktu s míčem. Pomalu se vrať bez odrazu.",
        "Curl the chest briefly toward the pelvis and lift the upper back off the ball. Keep the lower back and lower pelvis in contact with the ball. Return slowly without bouncing."
      ],
      "wat": [
        "Drž chodidla stabilně a nesjížděj pánví z míče do volného mostu. Neházej hlavou ani se neodrážej. Pokud oporu neudržíš, zkrať zdvih nebo zvol zkracovačku na zemi.",
        "Keep the feet stable and do not slide the pelvis off the ball into an unsupported bridge. Do not throw the head or bounce. If support is lost, shorten the curl or choose a floor crunch."
      ],
      "foc": [
        "Jeden krátký zdvih horního trupu a návrat tvoří opakování. Pánev a bedra zůstávají podepřené; větší nestabilita není cílem.",
        "One short upper-trunk curl and return form a repetition. Keep the pelvis and lower back supported; greater instability is not the goal."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Stability Ball Sit-ups / Crunches",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/",
        "scope": "The ACE ball-crunch instruction keeps the low back and tailbone supported on the ball while the feet remain grounded. This entry retains crossed arms as its existing adaptation and a controlled small curl. It does not claim superiority from instability, require a fixed ball diameter for everyone or import dosage."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "fitball"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_ball_crunch",
      "atlasId": "ex26_ball_crunch",
      "unified": true,
      "contourOnly": true,
      "darkOutline": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e73a72503359a04c3101258df1cdcd0dd25191b8c7d825791c17412994a56a43",
        "thumb": "/movement-audit/ball-crunch-v2-e73a72503359-256.webp",
        "inkThumb": "/movement-audit/ball-crunch-v2-e73a72503359-256.webp",
        "detail": "/movement-audit/ball-crunch-v2-e73a72503359-960.webp",
        "inkDetail": "/movement-audit/ball-crunch-v2-e73a72503359-960.webp"
      },
      "sourceSha256": "e73a72503359a04c3101258df1cdcd0dd25191b8c7d825791c17412994a56a43"
    }
  },
  "ex26_machine_crunch": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Na stroji určeném pro zkracovačky vsedě nastav sed, polstrovanou oporu holení a madla podle jeho návodu. Ověř zajištění zvolené zátěže. Pánev usaď v sedadle, chodidla opři o určenou plochu a madla drž oběma rukama.",
        "On a seated abdominal-crunch machine, adjust the seat, padded shin support and handles according to its instructions. Check that the selected load is secured. Settle the pelvis in the seat, place the feet on the intended support and hold both handles."
      ],
      "foc": [
        "Jedno kontrolované stočení trupu a návrat tvoří opakování. Zapisuj zvolenou zátěž tohoto stroje; pro srovnání zachovej jeho nastavení a poznamenej typ stanoviště. Čísla různých strojů nejsou přímo zaměnitelná.",
        "One controlled trunk curl and return form a repetition. Record the selected load on this machine; keep its settings consistent and note the station type for comparison. Numbers from different machines are not directly interchangeable."
      ],
      "pro": [
        "Použij zvládnutelný odpor a rozsah podle konstrukce stroje. Volitelně přidávej malé kroky odporu při stejném provedení. Minimální nastavení nemusí vyhovovat každému; zkracovačka na zemi je samostatná možnost.",
        "Choose manageable resistance and range appropriate to the machine. Optionally increase resistance in small steps while retaining the same execution. Its minimum setting may not suit everyone; a floor crunch is a separate option."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Seated Crunch",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/",
        "scope": "Selectorized seated abdominal-crunch station with adjustable seat, bilateral handles and padded shin support. Actual pad/foot placement follows the machine manufacturer rather than universal angles. The entry is not a generic machine, kneeling slider, torso-rotation station or combined hip-lifting crunch. Selected stack labels remain device-specific; no conversion to cable or free-weight resistance."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "machine"
      ],
      "equipmentRequirements": [
        [
          "abdominal_crunch_machine"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ex26_machine_crunch",
      "atlasId": "ex26_machine_crunch",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "d0723c140d2d5fd2e5f8a2b99e937113bd684684b8bb0957281e823f2843a1a3",
        "thumb": "/expansion-atlas/ex26_machine_crunch-original-256.webp",
        "detail": "/expansion-atlas/ex26_machine_crunch-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_machine_crunch-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_machine_crunch-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_machine_crunch-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_machine_crunch-fill-960.webp"
      },
      "sourceSha256": "d0723c140d2d5fd2e5f8a2b99e937113bd684684b8bb0957281e823f2843a1a3",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "russtwist": {
    "before": {
      "id": "russtwist",
      "cz": "Ruské otočky",
      "en": "Russian Twist",
      "pat": "stred",
      "S": 2,
      "C": 2,
      "J": {
        "pat": 2
      },
      "pop": 3,
      "eq": [
        "telo",
        "zavazi"
      ],
      "mode": "reps",
      "mp": [
        "obl"
      ],
      "ms": [
        "abs"
      ],
      "dot": [
        94,
        138
      ],
      "ez": "crunch",
      "hd": null,
      "foc": [
        "Otáčí se hrudník, boky zůstávají klidné.",
        "The chest rotates; the hips stay quiet."
      ],
      "pos": [
        "Sed v mírném záklonu, záda rovná, nohy pokrčené nebo nad zemí.",
        "Seated, leaning back slightly with a flat spine, feet bent or lifted."
      ],
      "exe": [
        "Rotuj hrudníkem ze strany na stranu, ruce následují.",
        "Rotate the chest side to side, the hands following."
      ],
      "wat": [
        "Záklon drží rovná záda, ne kulatá. Pomalu na obě strany stejně.",
        "The lean-back keeps a flat spine, never rounded. Slow and equal both ways."
      ],
      "pro": [
        "Nohy nad zem, závaží do rukou.",
        "Feet off the ground, a weight in the hands."
      ],
      "seed": "TEX_SEED_5B"
    },
    "edits": {
      "pos": [
        "Sedni si s pokrčenými koleny a mírným záklonem, chodidla nech na zemi nebo je podle plánu zvedni. Ruce drž spolu před trupem; míra záklonu má dovolit plynulé dýchání a kontrolu.",
        "Sit with bent knees and a slight backward lean, keeping the feet grounded or lifted as prescribed. Hold the hands together in front of the torso; choose a lean that allows breathing and control."
      ],
      "wat": [
        "Otáčej se pomalu v pohodlném rozsahu bez prudkého houpání pánve. Nenahrazuj otočení hrudníku pouhým přenášením rukou a nevynucuj dotyk země. Pokud ztrácíš kontrolu, opři chodidla nebo zmenši záklon.",
        "Turn slowly through a comfortable range without abruptly rocking the pelvis. Do not replace chest rotation with moving only the hands or force a floor touch. Ground the feet or reduce the lean if control is lost."
      ],
      "foc": [
        "Střídej otočení hrudníku na obě strany. Jednotlivá otočení nebo celé dvojice počítej podle plánu a při srovnání stejně; starší počty se nepřepočítávají.",
        "Alternate chest turns to each side. Count individual turns or complete pairs as prescribed and use the same convention for comparisons; earlier counts are not converted."
      ],
      "pro": [
        "Lehčí možnost je menší záklon, kratší otočení a chodidla na zemi. Volitelně lze zvednout chodidla nebo držet jeden lehký medicinbal. Neměň vše současně; přidaná zátěž ani zvednuté nohy nejsou povinný cíl.",
        "Easier options are a smaller lean, a shorter turn and grounded feet. Optionally lift the feet or hold one light medicine ball. Do not change everything at once; added weight and lifted feet are not required goals."
      ],
      "source": {
        "author": "National Academy of Sports Medicine",
        "document": "Russian Twist",
        "url": "https://www.nasm.org/resource-center/exercise-library/russian-twist",
        "scope": "Floor-seated alternating trunk turns, bent knees and grounded or lifted feet. The source permits bodyweight practice and holding a medicine ball; the existing unweighted illustration remains the default. Comfortable lean and consistent plan-specific counting are original coaching, not a universal dose or promise of back safety. Historical optional load is not retrospectively identified as a medicine ball. This is not ACE's separate exercise-ball-supported Russian twist."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "seated"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo",
          "medicinbal"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "add",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_5B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "russtwist",
      "atlasId": "russtwist",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "19bef2f46b75a609ebf5a229da9c3c4e818f0338c0d47be9a0d5588eeca607e8",
        "thumb": "/unified-atlas/russtwist-9b9b77fd6133589d-thumb.webp",
        "detail": "/unified-atlas/russtwist-30b09e8e282d44cd-detail.webp",
        "inkThumb": "/unified-atlas/russtwist-b636ba75aa8a8747-inkThumb.webp",
        "inkDetail": "/unified-atlas/russtwist-fde09cadf84524af-inkDetail.webp",
        "fillThumb": "/unified-atlas/russtwist-fc4fe8b93dee7811-fillThumb.webp",
        "fillDetail": "/unified-atlas/russtwist-4684a1ee9c2414dc-fillDetail.webp"
      },
      "sourceSha256": "19bef2f46b75a609ebf5a229da9c3c4e818f0338c0d47be9a0d5588eeca607e8",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "woodchop": {
    "before": {
      "id": "woodchop",
      "cz": "Dřevorubec",
      "en": "Cable Woodchop",
      "pat": "stred",
      "S": 3,
      "C": 2,
      "J": {
        "pat": 1
      },
      "pop": 2,
      "eq": [
        "kladka"
      ],
      "mode": "reps",
      "mp": [
        "obl",
        "abs"
      ],
      "ms": [
        "sho",
        "glu"
      ],
      "dot": [
        94,
        116
      ],
      "ez": "pallof",
      "hd": null,
      "foc": [
        "Rotuje hrudník přes pevné boky. Paže jen drží.",
        "The chest rotates over stable hips. The arms just hold on."
      ],
      "pos": [
        "Bok ke kladce, široký stoj, madlo obouruč u horní kladky.",
        "Side-on to the stack, wide stance, both hands on the high handle."
      ],
      "exe": [
        "Táhni diagonálně dolů přes tělo ke vzdálenému koleni. Pomalu zpět.",
        "Pull diagonally down across the body toward the far knee. Return slowly."
      ],
      "wat": [
        "Rotace jde z trupu, ne z paží. Kolena pruží s pohybem.",
        "Rotation comes from the trunk, not the arms. The knees spring with the movement."
      ],
      "pro": [
        "Zdola nahoru, v kleku, pomaleji.",
        "Low to high, kneeling, slower."
      ],
      "seed": "TEX_SEED_6"
    },
    "edits": {
      "cz": "Diagonální tah kladky shora dolů",
      "en": "Standing High-to-Low Cable Woodchop",
      "pos": [
        "Nastav kladku vysoko, zajisti jedno madlo vhodné k obouručnímu úchopu a ověř volný prostor. Stůj bokem ke kladce s chodidly od sebe, koleny mírně pokrčenými a madlem oběma rukama u její strany.",
        "Set the pulley high, secure one handle suitable for both hands and check the surrounding space. Stand side-on with feet apart, knees softly bent and both hands on the handle toward the pulley."
      ],
      "exe": [
        "Veď madlo šikmo dolů přes tělo k protějšímu boku či kolenu. Trup se otáčí spolu s plynulým přenosem váhy; chodidlům dovol potřebné pootočení. Vrať se kontrolovaně stejnou drahou.",
        "Guide the handle diagonally down across the body toward the opposite hip or knee. Rotate the torso with a smooth weight shift, allowing the feet to pivot as needed. Return under control along the same path."
      ],
      "wat": [
        "Netrhej madlem ani nezamykej boky proti otáčejícímu se hrudníku. Rozsah přizpůsob tak, aby se kolena nekroutila proti pevným chodidlům. Paže vedou madlo společně s trupem.",
        "Do not jerk the handle or lock the hips against a turning chest. Choose a range that avoids twisting the knees against fixed feet. The arms guide the handle together with the torso."
      ],
      "foc": [
        "Jeden diagonální tah a návrat tvoří opakování. Oba směry odcvič podle plánu; jeho dosavadní počítání stran zachovej. Zapisuj zvolenou zátěž daného stanoviště, ne součet za obě ruce.",
        "One diagonal pull and return form a repetition. Train both directions as prescribed, retaining the plan’s existing side-count convention. Record the selected station load, not a sum for both hands."
      ],
      "pro": [
        "Volitelně uprav odpor, rozsah či tempo při stejné dráze. Tah zdola nahoru mění směr a poloklek bez otáčení trupu mění úkol; nejsou povinným dalším stupněm této varianty.",
        "Optionally adjust resistance, range or tempo while retaining the same path. A low-to-high lift changes direction, and a half-kneeling chop without trunk rotation changes the task; neither is a required next level."
      ],
      "ez": null,
      "source": {
        "author": "BODYCRAFT",
        "document": "Functional Trainer Extras — Wood Chop High to Low, printed p. 71 / PDF page 16",
        "url": "https://www.bodycraft.com/pdfs/exercise/Functional-Trainer-Extras.pdf#page=16",
        "scope": "High cable, one handle held in both hands, standing side-on and moving diagonally down across the body with trunk rotation. Comfortable weight transfer and optional foot pivot are original coaching adaptations informed by ACE Standing Wood Chop stage 3, which itself uses a medicine ball; they are not a verbatim manufacturer protocol. No mandatory maximal turn, rigidly fixed hips, long bar or low-to-high variant is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "high_cable",
          "adjustable_cable"
        ],
        [
          "cable_handle"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ],
      "aliases": [
        "Dřevorubec",
        "Cable Woodchop"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_6"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "woodchop",
      "atlasId": "woodchop",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e6c425c626b457281b467e99b9793be295c97423100f3fb900b84870e4680ea2",
        "thumb": "/unified-atlas/woodchop-1a7e37ebdfc2a2e6-thumb.webp",
        "detail": "/unified-atlas/woodchop-a6f55c36e6706139-detail.webp",
        "inkThumb": "/unified-atlas/woodchop-720bb0b2f816a398-inkThumb.webp",
        "inkDetail": "/unified-atlas/woodchop-e4c95c6a619f8fe0-inkDetail.webp",
        "fillThumb": "/unified-atlas/woodchop-32a1aa93e8d61f00-fillThumb.webp",
        "fillDetail": "/unified-atlas/woodchop-80fbb76cfa68e830-fillDetail.webp"
      },
      "sourceSha256": "e6c425c626b457281b467e99b9793be295c97423100f3fb900b84870e4680ea2",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "wipers": {
    "before": {
      "id": "wipers",
      "cz": "Windshield wipers",
      "en": "Windshield Wipers",
      "pat": "stred",
      "S": 3,
      "C": 3,
      "J": {
        "ram": 2,
        "pat": 2
      },
      "pop": 2,
      "eq": [
        "hrazda"
      ],
      "mode": "reps",
      "mp": [
        "obl",
        "abs"
      ],
      "ms": [
        "fore",
        "upb"
      ],
      "dot": [
        100,
        74
      ],
      "ez": "t2b",
      "hd": null,
      "foc": [
        "Nohy stírají ze strany na stranu, ramena stojí.",
        "The legs wipe side to side; the shoulders stand still."
      ],
      "pos": [
        "Vis, nohy zvednuté ke hrazdě, tělo zpevněné.",
        "Hanging, legs raised to the bar, body braced."
      ],
      "exe": [
        "Veď propnuté nohy obloukem doleva a doprava. Pomalu, s kontrolou v krajích.",
        "Sweep the straight legs left and right. Slow, with control at the edges."
      ],
      "wat": [
        "Rozsah jen tam, kde udržíš ramena klidná. Pokrčené nohy jsou poctivý začátek.",
        "Range only where the shoulders stay quiet. Bent legs are the honest start."
      ],
      "pro": [
        "Propnuté nohy, širší oblouk, pomaleji.",
        "Straight legs, a wider arc, slower."
      ],
      "seed": "TEX_SEED_8C"
    },
    "edits": {
      "cz": "Stěrače ve visu",
      "en": "Hanging Windshield Wipers",
      "pos": [
        "Na pevné hrazdě s dostatkem místa pro nohy se zavěs oběma rukama a kontrolovaně zvedni nohy před tělo. Zvol propnutá nebo pokrčená kolena podle plánu a udržitelné polohy visu.",
        "Hang with both hands from a secure pull-up bar with enough leg clearance and raise the legs in front under control. Choose straight or bent knees according to the plan and the hanging position you can maintain."
      ],
      "exe": [
        "Veď nohy obloukem doleva a doprava při zvoleném pokrčení kolen. V krajích pohyb kontroluj a vracej se bez rozkývání těla.",
        "Sweep the legs left and right with the chosen knee bend. Control the ends of the arc and return without swinging the body."
      ],
      "wat": [
        "Oblouk zmenši dřív, než se vis změní v nekontrolovaný švih nebo ztratíš úchop. Ramena nesmějí prudce škubat; není nutné vynucovat jejich úplnou nehybnost. Pokrčená kolena zkracují páku.",
        "Reduce the arc before the hang becomes an uncontrolled swing or the grip fails. Avoid sudden shoulder jerks without forcing complete shoulder immobility. Bent knees shorten the lever."
      ],
      "foc": [
        "Střídej oblouk nohou doleva a doprava při udrženém visu. Jednotlivé strany nebo dvojice počítej podle plánu a stejně jako při předchozím srovnatelném zápisu.",
        "Alternate leg sweeps left and right while maintaining the hang. Count individual sides or pairs as prescribed and consistently with earlier comparable records."
      ],
      "pro": [
        "Začni jen s takovou pákou a šířkou oblouku, které ovládáš. Volitelně měň jednu z nich nebo tempo. Dotyk špiček hrazdy ani širší oblouk nejsou povinný cíl.",
        "Use only the lever length and sweep width you can control. Optionally change one of these or the tempo. Toe contact with the bar and a wider arc are not required goals."
      ],
      "ez": null,
      "source": {
        "author": "Catalyst Athletics",
        "document": "Windshield Wiper — hanging variations",
        "url": "https://www.catalystathletics.com/exercise/44/Windshield-Wiper/",
        "scope": "Hanging rotational leg sweeps with controlled tempo and a bent-knee option. The source distinguishes the horizontal-torso version from an arc starting in a straighter hang; this existing card retains its broader hanging identity without imposing a horizontal torso or exact elbow angle from the main demonstration. It is not the floor version. No universal side-versus-pair count, required toe contact, range or source training volume is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "hanging"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "hrazda"
        ]
      ],
      "priority": 2,
      "focus": [
        "strength"
      ],
      "aliases": [
        "Windshield wipers",
        "Windshield Wipers"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_8C"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "wipers",
      "atlasId": "wipers",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ccfe9aa9bbc4126a7a7d5b3dff5c1e55ac40a4db2250bc79098ae5fed20d6c0c",
        "thumb": "/unified-atlas/wipers-1949e8188c9e8b25-thumb.webp",
        "detail": "/unified-atlas/wipers-21be198a18bf85d0-detail.webp",
        "inkThumb": "/unified-atlas/wipers-64da670606f3c128-inkThumb.webp",
        "inkDetail": "/unified-atlas/wipers-e8453d38cd90aee3-inkDetail.webp",
        "fillThumb": "/unified-atlas/wipers-4a158e2ba3d27903-fillThumb.webp",
        "fillDetail": "/unified-atlas/wipers-2b58bf5bc13e15ce-fillDetail.webp"
      },
      "sourceSha256": "ccfe9aa9bbc4126a7a7d5b3dff5c1e55ac40a4db2250bc79098ae5fed20d6c0c",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_halfkneel_lift": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jeden diagonální zdvih míče a kontrolovaný návrat je opakování na danou stranu. Po sérii vyměň přední nohu i směr zdvihu. Tato karta zapisuje počet, nikoli kg; použitý míč si poznamenej pro srovnání.",
        "One diagonal ball lift and controlled return form a repetition for that side. After the set, switch the forward foot and lifting direction. This entry records repetitions rather than kilograms; note the ball used for comparison."
      ],
      "pro": [
        "Zkrať oblouk či páku nebo použij lehčí míč; pohyb lze nejprve nacvičit bez něj. Nárok zvyšuj volitelně při stejném provedení. Natažené paže ani těžší míč nejsou podmínkou úspěchu.",
        "Shorten the arc or lever, or use a lighter ball; first rehearse without it if useful. Increase the demand optionally while retaining the technique. Straight arms and a heavier ball are not requirements for success."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Half-kneeling Hay Baler",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/97/half-kneeling-hay-baler/",
        "scope": "Half-kneeling two-hand medicine-ball lift from the rear-leg hip across toward the opposite shoulder, changing sides after the set. The existing small torso turn and optional shorter lever are retained coaching adaptations; the source uses straight arms. No required clinical effect, maximal range, load or dosage is imported. Existing repetitions-only recording is not evidence that the ball has no mass."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "kneeling"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "medicinbal"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_halfkneel_lift",
      "atlasId": "ex26_halfkneel_lift",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "0f86967d6ebb63debb9d9e22c713f5e6c3a8a0763572e37490946fdd7291fbc2",
        "thumb": "/expansion-atlas/ex26_halfkneel_lift-original-256.webp",
        "detail": "/expansion-atlas/ex26_halfkneel_lift-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_halfkneel_lift-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_halfkneel_lift-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_halfkneel_lift-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_halfkneel_lift-fill-960.webp"
      },
      "sourceSha256": "0f86967d6ebb63debb9d9e22c713f5e6c3a8a0763572e37490946fdd7291fbc2",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_cable_rotation": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Nastavitelnou kladku zajisti přibližně ve výši hrudníku a připoj jedno madlo vhodné pro obě ruce. Stůj bokem s chodidly od sebe a drž madlo před tělem; paže tvoří pohodlnou páku.",
        "Secure an adjustable pulley around chest height and attach one handle suitable for both hands. Stand side-on with feet apart and hold the handle in front, choosing a comfortable arm lever."
      ],
      "foc": [
        "Jedno otočení od kladky a návrat tvoří opakování na danou stranu. Potom vyměň bok ke kladce. Zapisuj zvolenou zátěž stejného stanoviště; jde o rotaci, nikoli o Pallofův tlak proti rotaci.",
        "One turn away from the pulley and return form a repetition for that side. Then switch the side facing the pulley. Record the selected load on the same station; this is rotation, not an antirotation Pallof press."
      ],
      "pro": [
        "Uprav odpor, délku páky nebo rozsah podle kontroly. Případné zvýšení dělej po malých krocích; větší otočení není povinnost. Pro srovnání zachovej stejnou polohu paží i stanoviště.",
        "Adjust resistance, lever length or range to maintain control. Make any increase in small steps; a larger turn is not required. Keep arm position and station consistent for comparisons."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Standing Trunk Rotation",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/102/standing-trunk-rotation/",
        "scope": "Standing chest-height single-handle cable rotation with two-hand grip and coordinated weight transfer. The card retains a controlled self-selected range and permits foot pivot instead of importing the source maximum-rotation cue. This is not a fixed-pelvis isolation or antirotation press; no cable-ratio conversion is claimed."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "adjustable_cable"
        ],
        [
          "cable_handle"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ex26_cable_rotation",
      "atlasId": "ex26_cable_rotation",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "1afe1f94ad69b35c87d81d70a965ec0d2964e0c8bbf8293c848737da516baa50",
        "thumb": "/expansion-atlas/ex26_cable_rotation-original-256.webp",
        "detail": "/expansion-atlas/ex26_cable_rotation-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_cable_rotation-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_cable_rotation-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_cable_rotation-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_cable_rotation-fill-960.webp"
      },
      "sourceSha256": "1afe1f94ad69b35c87d81d70a965ec0d2964e0c8bbf8293c848737da516baa50",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_standing_lift": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "cz": "Diagonální zdvih medicinbalu v děleném postoji",
      "foc": [
        "Jeden diagonální zdvih a kontrolovaný návrat je opakování na danou stranu. Potom vyměň přední nohu a směr zdvihu. Zapisuje se počet bez kg; druh míče a délku páky si poznamenej pro srovnání.",
        "One diagonal lift and controlled return form a repetition for that side. Then switch the forward foot and lifting direction. Recording uses repetitions without kilograms; note the ball and lever length for comparison."
      ],
      "pro": [
        "Lehčí možnost je lehčí míč, kratší páka nebo menší oblouk ve stejném postoji. Poloklek nabízí jinou oporu a nemusí být pro každého snazší. Zátěž či páku měň volitelně, bez nutnosti zrychlovat.",
        "Easier options are a lighter ball, a shorter lever or a smaller arc in the same stance. Half-kneeling offers a different support base and is not easier for everyone. Optionally change load or lever without needing to speed up."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Standing Hay Baler",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/105/standing-hay-baler/",
        "scope": "Split stance with forward foot grounded, rear heel lifted, and a two-hand medicine-ball lift from the rear hip across toward the opposite shoulder. This existing card permits a comfortable rather than forced straight-arm lever and controlled coordinated torso/pelvic turn; it is not a throw. The source difficulty label is not a universal ranking. Historical repetitions-only recording is retained."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "medicinbal"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ],
      "aliases": [
        "Diagonální zdvih medicinbalu v rozkročném postoji"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_standing_lift",
      "atlasId": "ex26_standing_lift",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "77a4a0ac5c77ecf7216a7c89152f5cbae3a9a7914756d841146ef1740ef460ff",
        "thumb": "/expansion-atlas/ex26_standing_lift-original-256.webp",
        "detail": "/expansion-atlas/ex26_standing_lift-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_standing_lift-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_standing_lift-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_standing_lift-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_standing_lift-fill-960.webp"
      },
      "sourceSha256": "77a4a0ac5c77ecf7216a7c89152f5cbae3a9a7914756d841146ef1740ef460ff",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_singleleg_rotation": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Nastavitelnou kladku zajisti u výšky hrudníku a připoj jedno madlo. Stůj bokem, drž ho oběma rukama blízko středu hrudníku s pokrčenými lokty a pomalu odlehči nohu bližší kladce.",
        "Secure an adjustable pulley near chest height and attach one handle. Stand side-on, hold it with both hands near the centre of the chest with bent elbows, and slowly lift the foot nearer the pulley."
      ],
      "foc": [
        "Jedno malé otočení od kladky a návrat je opakování na stojné noze. Na druhou stranu otoč postoj ke kladce a vyměň stojnou nohu. Pro srovnání zachovej zátěž stanoviště, délku páky a rozsah.",
        "One small turn away from the pulley and return form a repetition on the supporting leg. Reverse your stance relative to the pulley and change the supporting leg for the other side. Keep station load, lever length and range consistent for comparison."
      ],
      "pro": [
        "Obě chodidla na zemi zvětší základnu opory. Při stabilním jednonožném postoji lze ruce volitelně mírně oddálit; obrázek ukazuje delší páku. Ta není povinná ani automaticky vhodnější než ruce u hrudi.",
        "Grounding both feet widens the support base. With a steady single-leg stance, optionally move the hands slightly farther out; the illustration shows a longer lever. It is neither required nor automatically preferable to hands near the chest."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Standing Single-leg Cable Rotation",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/107/standing-single-leg-cable-rotation/",
        "scope": "ACE steps 1–3 support a close-hand, bent-elbow cable rotation standing on the outside leg. Step 4 explicitly offers an extended-arm variation, as shown in the existing illustration and already allowed by the old progression. This card retains cable-only historical identity, a small comfortable turn and no forced scapular packing, injury-prevention claim or mandatory long lever."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement",
        "balance"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "adjustable_cable"
        ],
        [
          "cable_handle"
        ]
      ],
      "priority": 2,
      "focus": [
        "strength",
        "balance"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ex26_singleleg_rotation",
      "atlasId": "ex26_singleleg_rotation",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e351fb0ffe651cbcdcf77df21ea20e12e4fcfcc8eee8ebdbb26ae7f54c31cf06",
        "thumb": "/expansion-atlas/ex26_singleleg_rotation-original-256.webp",
        "detail": "/expansion-atlas/ex26_singleleg_rotation-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_singleleg_rotation-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_singleleg_rotation-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_singleleg_rotation-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_singleleg_rotation-fill-960.webp"
      },
      "sourceSha256": "e351fb0ffe651cbcdcf77df21ea20e12e4fcfcc8eee8ebdbb26ae7f54c31cf06",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_rotational_cable_press": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Zajisti nastavitelnou kladku přibližně ve výši ramene a jedno madlo. Stůj v děleném postoji, kladka je za ramenem zadní nohy. Madlo drž jednou rukou u hrudi na této straně, druhou ruku nech volně.",
        "Secure an adjustable pulley around shoulder height with one handle. Take a split stance with the pulley behind the shoulder on the rear-leg side. Hold the handle at the chest with that hand and leave the other arm free."
      ],
      "foc": [
        "Jeden jednoruční tlak s otočením a kontrolovaný návrat tvoří opakování. Pro druhou stranu vyměň tlačící ruku i postoj. Zapisuj zvolenou zátěž dané kladky a srovnávej stejné provedení.",
        "One single-arm press with rotation and a controlled return form a repetition. Change the pressing hand and stance for the other side. Record the selected cable-station load and compare the same execution."
      ],
      "pro": [
        "Nejprve zvládni lehký odpor a souhru tlaku s otočením. Tlak bez rotace je samostatná jednodušší koordinační možnost. Rychlost zvyšuj jen pokud ji požaduje plán a zachováš kontrolu; není povinným cílem.",
        "First control light resistance and coordinate the press with the turn. Pressing without rotation is a separate, simpler coordination option. Increase speed only if the plan calls for it and control is retained; it is not a required goal."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Single-arm Rotational Press",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/339/single-arm-rotational-press/",
        "scope": "Shoulder-height single-handle press from a split stance, pressing with the rear-leg-side hand while the rear foot and hip turn. Retains the existing controlled return; the source fixed pause and difficulty label are not universal prescriptions. Classification includes horizontal pressing as well as trunk rotation, without reclassifying raw historical family or metrics."
      }
    },
    "taxonomy": {
      "movements": [
        "push_horizontal",
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "adjustable_cable"
        ],
        [
          "cable_handle"
        ]
      ],
      "priority": 2,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ex26_rotational_cable_press",
      "atlasId": "ex26_rotational_cable_press",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "fdae69c687f04414520c3467dcb04a8c6384b85f3e5337f738dcb5ecc9bfcb84",
        "thumb": "/expansion-atlas/ex26_rotational_cable_press-original-256.webp",
        "detail": "/expansion-atlas/ex26_rotational_cable_press-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_rotational_cable_press-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_rotational_cable_press-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_rotational_cable_press-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_rotational_cable_press-fill-960.webp"
      },
      "sourceSha256": "fdae69c687f04414520c3467dcb04a8c6384b85f3e5337f738dcb5ecc9bfcb84",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ig28_dumbbell_side_bend": {
    "before": {
      "id": "ig28_dumbbell_side_bend",
      "cz": "Úklon s jednoručkou",
      "en": "Dumbbell Side Bend",
      "pat": "stred",
      "eq": [
        "zavazi"
      ],
      "mp": [
        "obl"
      ],
      "ms": [
        "low",
        "fore"
      ],
      "S": 2,
      "C": 2,
      "mode": "reps",
      "sideMode": "perSide",
      "family": "core_lateral_flexion",
      "J": {
        "pat": 1
      },
      "pop": 1,
      "load": "ext",
      "measurementType": "WEIGHT_REPS",
      "tier": "extended",
      "sessionRole": "strength",
      "goalRole": "strength",
      "genRule": "explicit",
      "variantKey": "ig28_dumbbell_side_bend",
      "ez": null,
      "hd": null,
      "defaultRestSec": 45,
      "collection": "instagram_practical",
      "aliases": [
        "weighted side bend",
        "silový úklon trupu"
      ],
      "source": {
        "author": "Physitrack",
        "document": "Dumbbell Side Bend",
        "url": "https://ca.physitrack.com/home-exercise-video/dumbbell-side-bend",
        "scope": "Standing one-dumbbell lateral flexion toward the loaded side followed by return to upright, matching the saved demonstration. Original conservative range and loading progression.",
        "instagram": "https://www.instagram.com/reillyherbststrength/reel/DYap_sdxBez/",
        "instagramUrls": [
          "https://www.instagram.com/reillyherbststrength/reel/DYap_sdxBez/"
        ]
      },
      "pos": [
        "Postav se na šířku boků a drž jednu lehkou jednoručku podél boku na natažené paži. Druhou ruku nech volně nebo ji polož na bok.",
        "Stand hip-width apart with one light dumbbell beside the hip on a straight arm. Leave the other hand relaxed or rest it on the waist."
      ],
      "exe": [
        "Pomalu ukloň trup k čince v malém pohodlném rozsahu a vrať se do vzpřímeného stoje. Pánev drž přibližně na místě. Dokonči sérii a vyměň ruku.",
        "Slowly bend toward the dumbbell through a small comfortable range and return upright. Keep the pelvis roughly in place. Complete the set and switch hands."
      ],
      "wat": [
        "Neotáčej hrudník, nepředkláněj se a nehoupej činkou. Nezvedej činku pokrčením lokte. Není nutné sahat co nejníž ani pokračovat do úklonu na druhou stranu.",
        "Do not rotate the chest, fold forward or swing the weight. Avoid lifting the dumbbell by bending the elbow. You need not reach as low as possible or continue past upright into the opposite side bend."
      ],
      "pro": [
        "Lehčí: bez činky nebo menší rozsah. Těžší: pomalejší návrat a potom malé zvýšení zátěže při stejném rozsahu. Přidej nejdříve kontrolu, ne hlubší úklon.",
        "Easier: no weight or less range. Harder: a slower return, then a small load increase through the same range. Improve control before seeking a deeper bend."
      ],
      "foc": [
        "Klidný úklon k čince a návrat do středu.",
        "Controlled bend toward the weight and return to upright."
      ],
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jeden malý úklon k čince a návrat do vzpřímení tvoří opakování. Stranu označuje ruka držící jednoručku; pro druhou stranu ji vyměň. Zapisuj hmotnost jediného kusu, ne součet za obě strany.",
        "One small bend toward the dumbbell and return upright form a repetition. Identify the side by the hand holding the dumbbell and switch hands for the other side. Record the weight of the single dumbbell, not a sum for both sides."
      ]
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "dumbbell"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": true,
    "display": null,
    "art": {
      "appId": "ig28_dumbbell_side_bend",
      "atlasId": "ig28_dumbbell_side_bend",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "5f45961cbda83f5e8b5f62902373c31966856b37f3d8fe10289a789088a668e5",
        "thumb": "/expansion-atlas/ig28_dumbbell_side_bend-original-256.webp",
        "detail": "/expansion-atlas/ig28_dumbbell_side_bend-original-960.webp",
        "inkThumb": "/expansion-atlas/ig28_dumbbell_side_bend-ink-256.webp",
        "inkDetail": "/expansion-atlas/ig28_dumbbell_side_bend-ink-960.webp",
        "fillThumb": "/expansion-atlas/ig28_dumbbell_side_bend-fill-256.webp",
        "fillDetail": "/expansion-atlas/ig28_dumbbell_side_bend-fill-960.webp"
      },
      "sourceSha256": "5f45961cbda83f5e8b5f62902373c31966856b37f3d8fe10289a789088a668e5",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "cat": {
    "before": {
      "id": "cat",
      "cz": "Kočka",
      "en": "Cat-Camel",
      "pat": "mobilita",
      "S": 1,
      "C": 1,
      "pop": 3,
      "eq": [
        "telo"
      ],
      "mode": "reps",
      "mp": [
        "low"
      ],
      "ms": [
        "abs"
      ],
      "dot": [
        100,
        128
      ],
      "ez": null,
      "hd": null,
      "foc": [
        "Páteř se vlní celá, ne jen v bedrech.",
        "The whole spine waves, not just the lower back."
      ],
      "pos": [
        "Vzpor klečmo, dlaně pod rameny, kolena pod boky.",
        "All fours, hands under shoulders, knees under hips."
      ],
      "exe": [
        "S výdechem kulatit záda vzhůru, s nádechem prohnout a otevřít hrudník. Pomalu, celou páteří.",
        "Exhale rounding the spine up, inhale arching and opening the chest. Slowly, through every segment."
      ],
      "wat": [
        "Lokty propnuté, pohyb vede páteř — ne hlava.",
        "Elbows straight; the spine leads, not the head."
      ],
      "pro": [
        "Jemnější vlny článek po článku, zavři oči a poslouchej.",
        "Finer waves, segment by segment. Close the eyes and listen."
      ],
      "seed": "TEX_SEED_4B"
    },
    "edits": {
      "exe": [
        "S výdechem pomalu zakulať záda. S nádechem se plynule vrať a záda mírně prohni. Hlava pohyb klidně následuje; rozsah zůstává pohodlný.",
        "Exhale and slowly round the back. Inhale, return smoothly and gently arch the back. Let the head follow comfortably without forcing the range."
      ],
      "wat": [
        "Dlaně a kolena zůstávají na místě, lokty natažené bez násilného zamykání. Nespěchej do krajní polohy ani nezvedej prudce bradu.",
        "Keep hands and knees planted, with arms straight without forcing the elbows into a lock. Do not rush into end range or throw the chin upward."
      ],
      "foc": [
        "Plynule střídej zakulacení a mírné prohnutí zad. Při počítání v této kartě ber celý tento cyklus jako jedno opakování a drž stejný způsob záznamu.",
        "Smoothly alternate rounding and gently arching the back. For this entry, count the full cycle as one repetition and keep that recording convention consistent."
      ],
      "pro": [
        "Zvol menší rozsah nebo pomalejší tempo podle toho, co dokážeš vést plynule. Větší prohnutí ani izolování každého obratle nejsou povinným cílem.",
        "Choose a smaller range or slower pace that you can control smoothly. A deeper arch or isolating each vertebra is not a required goal."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "A Workout to Counteract the Effects of Prolonged Sitting — Cat-Camel section",
        "url": "https://www.acefitness.org/continuing-education/prosource/january-2016/5756/a-workout-to-counteract-the-effects-of-prolonged-sitting/",
        "scope": "Uses the quadruped Cat-Camel as a gentle motion exercise rather than an end-range stretch. The full-cycle recording cue is a prospective local convention, not an assertion about historical logs. No clinical, sitting-harm or prescribed-dose claims are imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "REPS_ONLY",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_4B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "cat",
      "atlasId": "cat",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "968f52f7e19ad3ef6c2b502787b1a7c1cf12b5ddf09b2c01b51210f7bf5dc582",
        "thumb": "/unified-atlas/cat-19c7308a7b71a770-thumb.webp",
        "detail": "/unified-atlas/cat-97d7e03450b16bfd-detail.webp",
        "inkThumb": "/unified-atlas/cat-33794dcd729bbddb-inkThumb.webp",
        "inkDetail": "/unified-atlas/cat-f3f92c9d9cd94e12-inkDetail.webp",
        "fillThumb": "/unified-atlas/cat-690203693c6ab1d7-fillThumb.webp",
        "fillDetail": "/unified-atlas/cat-756c422f3be228a9-fillDetail.webp"
      },
      "sourceSha256": "968f52f7e19ad3ef6c2b502787b1a7c1cf12b5ddf09b2c01b51210f7bf5dc582",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "jefferson": {
    "before": {
      "id": "jefferson",
      "cz": "Jefferson curl",
      "en": "Jefferson Curl",
      "pat": "mobilita",
      "S": 1,
      "C": 1,
      "J": {
        "pat": 3
      },
      "pop": 1,
      "eq": [
        "telo",
        "zavazi"
      ],
      "mode": "reps",
      "mp": [
        "ham",
        "low"
      ],
      "ms": [
        "glu"
      ],
      "dot": [
        102,
        110
      ],
      "ez": "pikefold",
      "hd": null,
      "foc": [
        "Obratel po obratli. Rychlost tady nemá co dělat.",
        "Vertebra by vertebra. Speed has no business here."
      ],
      "pos": [
        "Stoj, nohy propnuté, brada k hrudi. Klidně na hraně schodu.",
        "Standing, legs straight, chin to chest. A step's edge works well."
      ],
      "exe": [
        "Kulať se dolů odshora, ruce sjíždějí k zemi. Dole visíš, pak se stejně pomalu skládej zpět.",
        "Round down from the top, hands sliding toward the ground. Hang at the bottom, then stack back up just as slowly."
      ],
      "wat": [
        "Začni bez zátěže, přidávej po týdnech, ne po sériích. Nohy propnuté.",
        "Start unloaded, add weight over weeks, not sets. Legs stay straight."
      ],
      "pro": [
        "Lehká zátěž v rukou, hlubší rozsah ze schodu.",
        "Light weight in the hands, deeper range off a step."
      ],
      "seed": "TEX_SEED_4B"
    },
    "edits": {
      "pos": [
        "Postav se na pevnou rovnou podlahu, chodidla přibližně na šířku boků a kolena natažená bez násilného zamykání. Začni bez zátěže, ruce volně před tělem.",
        "Stand on firm level ground with feet roughly hip-width apart and knees straight without forcing them into a lock. Start unloaded with the arms relaxed in front of the body."
      ],
      "exe": [
        "Jemně skloň hlavu a pomalu zakulacuj záda shora dolů. Ruce klesají k zemi jen do ovládaného rozsahu. Bez odrazu se stejně pomalu vrať do stoje.",
        "Gently lower the head and slowly round the back from the top down. Let the hands descend only as far as you can control. Return slowly to standing without bouncing."
      ],
      "wat": [
        "Netlač do bolesti a neusiluj o dotek země za každou cenu. Nepřidávej současně rozsah, zátěž i rychlost; toto pomalé zakulacování není předklon s pevnými zády.",
        "Do not push into pain or force floor contact. Do not increase range, load and speed together; this slow spinal roll-down differs from a hip hinge with a fixed back position."
      ],
      "foc": [
        "Jedno pomalé zakulacení a návrat do stoje tvoří opakování. Základní provedení je bez zátěže. Pokud máš přidanou zátěž v plánu, poznamenej náčiní a zachovej svůj dosavadní způsob zápisu.",
        "One slow roll-down and return to standing form a repetition. The basic version is unloaded. If added load is prescribed, note the implement and retain your existing recording convention."
      ],
      "pro": [
        "Základ může zůstat bez zátěže na podlaze. Lehká jednoručka nebo velká činka držená před tělem jsou volitelné varianty podle plánu. Vyvýšení má smysl jen pro ovládaný rozsah přes úroveň chodidel; použij pevnou dostatečně širokou plošinu s celými chodidly v opoře. Ani zátěž, ani vyvýšení nejsou povinnou návazností.",
        "The basic version can remain unloaded on the floor. A light dumbbell or barbell held in front of the body are optional variations when prescribed. Elevation is useful only for a controlled range below foot level; use a firm platform wide enough to support the entire feet. Neither load nor elevation is a mandatory progression."
      ],
      "ez": null,
      "source": {
        "author": "GymnasticBodies",
        "document": "Jefferson Curl",
        "url": "https://www.gymnasticbodies.com/exercises/jefferson-curl",
        "scope": "Supports a slow top-down spinal curl and reverse with straight legs and very light or no load. The present basic floor version follows the existing unloaded image; elevation and a dumbbell/barbell remain optional setups, not mandatory equipment. No universal beginner suitability, 50%-bodyweight goal, automatic loading schedule, rehabilitation or lower-back-health claim is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 2,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "add",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_4B"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "jefferson",
      "atlasId": "jefferson",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "76493680ee9d68f058291f127905690778f4af71ca9e42d07a419daab60cbea7",
        "thumb": "/unified-atlas/jefferson-92c3392ce1fe716a-thumb.webp",
        "detail": "/unified-atlas/jefferson-7ca0b201ffc9ead1-detail.webp",
        "inkThumb": "/unified-atlas/jefferson-b58d639d75910df4-inkThumb.webp",
        "inkDetail": "/unified-atlas/jefferson-95b3dea3ca25aa97-inkDetail.webp",
        "fillThumb": "/unified-atlas/jefferson-9b7dd08d96a2a3ed-fillThumb.webp",
        "fillDetail": "/unified-atlas/jefferson-1f1e047f905a6ff4-fillDetail.webp"
      },
      "sourceSha256": "76493680ee9d68f058291f127905690778f4af71ca9e42d07a419daab60cbea7",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "superman": {
    "before": {
      "id": "superman",
      "cz": "Záklon vleže",
      "en": "Back Extension",
      "pat": "ohyb",
      "S": 1,
      "C": 1,
      "J": {
        "kyc": 1
      },
      "pop": 3,
      "eq": [
        "telo"
      ],
      "mode": "reps",
      "mp": [
        "low"
      ],
      "ms": [
        "glu",
        "upb"
      ],
      "dot": [
        58,
        70
      ],
      "ez": null,
      "hd": null,
      "foc": [
        "Zvedá tě délka, ne švih.",
        "Length lifts you, not momentum."
      ],
      "pos": [
        "Leh na břiše, paže natažené vpřed, pohled do země.",
        "Lie face down, arms extended forward, eyes to the ground."
      ],
      "exe": [
        "Hrudník a nohy pár centimetrů nad zem. Krátce drž, pomalu dolů.",
        "Chest and legs a few centimetres off the ground. Hold briefly, lower slowly."
      ],
      "wat": [
        "Krk v prodloužení páteře. Malý rozsah, plné zpevnění.",
        "Neck in line with the spine. Small range, full tension."
      ],
      "pro": [
        "Prodlužuj výdrž nahoře.",
        "Lengthen the hold at the top."
      ],
      "seed": "TEX_SEED"
    },
    "edits": {
      "cz": "Zdvih hrudníku a nohou vleže (superman)",
      "en": "Prone Chest and Leg Raise (Superman)",
      "wat": [
        "Zvedej jen do malého pohodlného rozsahu, bez švihu a bez záklonu hlavy. Břicho a pánev zůstávají v opoře; nezadržuj kvůli výšce dech.",
        "Lift only through a small comfortable range, without momentum or throwing the head back. Keep the abdomen and pelvis supported; do not hold your breath to lift higher."
      ],
      "foc": [
        "Jeden společný zdvih hrudníku a obou nohou a návrat tvoří opakování. Krátká pauza nahoře patří k tempu; tato karta dál zapisuje opakování.",
        "One simultaneous lift of the chest and both legs followed by a return forms a repetition. A brief pause at the top is part of the tempo; this entry continues to record repetitions."
      ],
      "pro": [
        "Nejprve zvol menší ovládaný zdvih. Podle plánu lze přidat krátkou pauzu nebo pomalejší návrat, bez povinného zvyšování výšky či délky výdrže. Zdvih jedné protilehlé dvojice je samostatná varianta.",
        "Choose a smaller controlled lift first. If prescribed, add a brief pause or slower lowering without a required increase in height or hold length. Raising one opposite arm-leg pair is a separate variation."
      ],
      "source": {
        "author": "Philip Stefanov / Hevy",
        "document": "Superman Exercise: Proper Form, Benefits and More",
        "url": "https://www.hevyapp.com/exercises/how-to-superman/",
        "scope": "Uses the author’s simultaneous upper-body and leg lift with return. This preserves the existing card and illustration’s small chest lift, unlike ACE exercise 9 which cues a fixed torso while limbs rise. No maximum-height instruction, compulsory pause, posture cure or comparative efficacy claim is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "prone"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength"
      ],
      "aliases": [
        "Záklon vleže",
        "Back Extension"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "superman",
      "atlasId": "superman",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "181a4d7e21a023d9621226fd056b9f0187f90115d8f0fcc358ed3e6bf5507da8",
        "thumb": "/unified-atlas/superman-08a95cfd2276cc09-thumb.webp",
        "detail": "/unified-atlas/superman-68de06f4f526cfd1-detail.webp",
        "inkThumb": "/unified-atlas/superman-e97affbe5b698b8a-inkThumb.webp",
        "inkDetail": "/unified-atlas/superman-7a741046c39e1bb5-inkDetail.webp",
        "fillThumb": "/unified-atlas/superman-dda0cb10023cf833-fillThumb.webp",
        "fillDetail": "/unified-atlas/superman-ba9707ab7cd66ad6-fillDetail.webp"
      },
      "sourceSha256": "181a4d7e21a023d9621226fd056b9f0187f90115d8f0fcc358ed3e6bf5507da8",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_pelvic_tilt": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jedno jemné podsazení a návrat do přirozené polohy tvoří opakování. Pánev zůstává na podložce; nejde o zdvih do mostu.",
        "One gentle posterior tilt and return to a natural position form a repetition. Keep the pelvis on the mat; this is not a bridge lift."
      ],
      "pro": [
        "Uprav velikost pohybu a klidně použij ruku pod bedry pro zpětnou vazbu. Posun paty při stabilní pánvi je jiný úkol, který lze cvičit samostatně; není povinným pokračováním této karty.",
        "Adjust the movement size and use a hand under the lower back for feedback if helpful. Sliding a heel while keeping the pelvis stable is a different task that can be practised separately, not a required next step for this entry."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Supine Pelvic Tilts",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/7/supine-pelvic-tilts/",
        "scope": "Adapted from the ACE posterior pelvic tilt with pelvis kept on the floor. This existing card returns to a natural position rather than requiring the source’s active anterior arch; arm placement at the sides follows its illustration. No treatment, correction of a supposedly faulty posture or forced flattening claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "mobility",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_pelvic_tilt",
      "atlasId": "ex26_pelvic_tilt",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "eae2d7f26d54266a71a0787efccda7d8621a74dddb12cf2fc1d8c7839673dfc8",
        "thumb": "/expansion-atlas/ex26_pelvic_tilt-original-256.webp",
        "detail": "/expansion-atlas/ex26_pelvic_tilt-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_pelvic_tilt-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_pelvic_tilt-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_pelvic_tilt-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_pelvic_tilt-fill-960.webp"
      },
      "sourceSha256": "eae2d7f26d54266a71a0787efccda7d8621a74dddb12cf2fc1d8c7839673dfc8",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_prone_opposite": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jeden zdvih a položení protilehlé ruky a nohy tvoří opakování dané dvojice. Zaznamenej obě strany zvlášť podle stejného označení stran v plánu. Trup a pánev drž klidné.",
        "One lift and lowering of an opposite arm-leg pair form one repetition for that pair. Record each side separately using the same side labels as the plan. Keep the trunk and pelvis steady."
      ],
      "pro": [
        "Zmenši zdvih nebo procvič jen jednu končetinu, pokud se s pohybem přetáčí pánev. Krátká pauza je volitelná úprava tempa, ne změna této karty na časovou výdrž.",
        "Reduce the lift or practise one limb if the pelvis turns with the movement. A brief pause is an optional tempo change, not a conversion of this entry into a timed hold."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Contralateral Limb Raises",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/53/contralateral-limb-raises/",
        "scope": "Specifically ACE exercise 53 variation two: opposite arm and leg lift together while the trunk remains stabilized. This is limb movement with trunk control, not deliberate repeated spinal extension. The existing perSide recording is retained; no retrospective arm-versus-leg relabeling or conversion of pauses to seconds."
      }
    },
    "taxonomy": {
      "movements": [
        "joint",
        "trunk_stability"
      ],
      "positions": [
        "prone"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_prone_opposite",
      "atlasId": "ex26_prone_opposite",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "0c2f3164139517df40e298a00043337100fae5a244d839ee314517a5175db0fe",
        "thumb": "/expansion-atlas/ex26_prone_opposite-original-256.webp",
        "detail": "/expansion-atlas/ex26_prone_opposite-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_prone_opposite-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_prone_opposite-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_prone_opposite-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_prone_opposite-fill-960.webp"
      },
      "sourceSha256": "0c2f3164139517df40e298a00043337100fae5a244d839ee314517a5175db0fe",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_plank_rotation": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Začni ve vysokém vzporu na dlaních pod rameny, chodidla o něco širší než pánev. Najdi pevnou oporu rukou a chodidel.",
        "Begin in a high plank with palms under the shoulders and feet slightly wider than the hips. Establish firm hand and foot support."
      ],
      "foc": [
        "Jedno otevření a návrat do vysokého vzporu tvoří opakování na danou stranu. Zapisuj strany zvlášť; klik mezi otočeními není součástí této karty.",
        "One opening and return to high plank form one repetition on that side. Record the sides separately; a push-up between turns is not part of this entry."
      ],
      "pro": [
        "Zvol menší otočení nebo začni oběma dlaněmi na stejné pevné vyvýšené ploše, která dovolí bezpečný přenos váhy. Volitelná krátká pauza v otevření mění tempo, ne záznam opakování.",
        "Choose a smaller turn or start with both palms on the same stable raised surface that permits a controlled weight shift. An optional brief pause in the open position changes tempo, not repetition recording."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "High Plank T-spine Rotation",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/330/high-plank-t-spine-rotation/",
        "scope": "Supports high-plank starting support, unilateral hand loading and turning hips and shoulders together. The existing slightly wider feet and permission for feet to pivot are local setup cues. This is not an isolated thoracic twist over an immobile pelvis and does not include a push-up."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "high_plank"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_plank_rotation",
      "atlasId": "ex26_plank_rotation",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "c511056bf47a3cb64282115826aec4cda6352fd4f883b29819642ddf11ed23be",
        "thumb": "/expansion-atlas/ex26_plank_rotation-original-256.webp",
        "detail": "/expansion-atlas/ex26_plank_rotation-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_plank_rotation-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_plank_rotation-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_plank_rotation-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_plank_rotation-fill-960.webp"
      },
      "sourceSha256": "c511056bf47a3cb64282115826aec4cda6352fd4f883b29819642ddf11ed23be",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_mob_lumbar_locked": {
    "before": {
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
      "defaultRestSec": 15,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Z kleku posuň pánev k patám a jedno předloktí opři pevně o zem. Druhou dlaň polož lehce za hlavu. Zvol pohodlné pokrčení kolen.",
        "From kneeling, bring the pelvis toward the heels and support one forearm firmly on the floor. Rest the other hand lightly behind the head. Choose comfortable knee flexion."
      ],
      "exe": [
        "Pomalu otoč hrudník a volný loket vzhůru, pak se vrať. Pánev ponech přibližně u pat a opěrné předloktí na místě.",
        "Slowly turn the chest and free elbow upward, then return. Keep the pelvis roughly near the heels and the supporting forearm in place."
      ],
      "wat": [
        "Netlač rukou do hlavy ani nevynucuj kontakt pánve s patami. Pohyb nemá být jen mávnutí loktem. Pokud je klek nepohodlný, zvol rotaci vsedě nebo vleže.",
        "Do not push on the head or force the pelvis onto the heels. Avoid moving only the elbow. If kneeling is uncomfortable, choose a seated or side-lying rotation."
      ],
      "foc": [
        "Otočení a návrat tvoří jedno opakování na danou stranu. Zaměření na hrudník neznamená úplné znehybnění bederní páteře.",
        "A turn and return form one repetition on the working side. A thoracic focus does not mean complete immobilization of the lumbar spine."
      ],
      "pro": [
        "Uprav rozsah a podle potřeby polož volnou ruku na hrudník. Krátká klidná pauza je volitelná; větší otočení není povinný cíl.",
        "Adjust the range and place the free hand on the chest if helpful. A brief controlled pause is optional; a larger turn is not a required goal."
      ],
      "source": {
        "author": "Functional Movement Systems",
        "document": "Quadruped T-Spine Rotation Lumbar Locked",
        "url": "https://www.functionalmovement.com/exercises/491/quadruped_t-spine_rotation_lumbar_locked",
        "scope": "FMS describes forearm-supported kneeling with hips toward heels and both hand-on-low-back and hand-behind-head variants. This entry uses the latter. Comfortable range, optional hand-on-chest and alternative positions are coaching adaptations, not the entire FMS sequence, a test score or a claim of isolated lumbar immobilization."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "kneeling"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_mob_lumbar_locked",
      "atlasId": "ex26_mob_lumbar_locked",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "536120b276759e5d6109f2c8b4e5e2f1131488702fa5c9581d935899e9bf0622",
        "thumb": "/expansion-atlas/ex26_mob_lumbar_locked-original-256.webp",
        "detail": "/expansion-atlas/ex26_mob_lumbar_locked-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_mob_lumbar_locked-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_mob_lumbar_locked-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_mob_lumbar_locked-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_mob_lumbar_locked-fill-960.webp"
      },
      "sourceSha256": "536120b276759e5d6109f2c8b4e5e2f1131488702fa5c9581d935899e9bf0622",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_mob_side_windmill": {
    "before": {
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
      "defaultRestSec": 15,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Lehni na bok. Spodní nohu nech nataženou a horní koleno pokrč před tělem; podepři je kostkou nebo pevným polštářem vhodné výšky. Spodní paží pohodlně podepři hlavu, horní paži natáhni před sebe.",
        "Lie on the side with the lower leg extended. Bend the top knee in front and support it on a block or firm cushion of suitable height. Support the head comfortably with the lower arm and reach the top arm forward."
      ],
      "exe": [
        "Horní paží veď pomalý oblouk nad hlavou a za tělo a vrať ji dopředu. Hrudník se otáčí s paží, horní koleno zůstává na opoře. Rozsah zvol podle ramene a trupu.",
        "Move the top arm slowly in an arc overhead and behind the body, then return it forward. Let the chest turn with the arm while the top knee stays supported. Choose a range suited to the shoulder and trunk."
      ],
      "wat": [
        "Nenuť ruku k podlaze a neprotáčej pánev za paží. Zkrať oblouk, pokud ztrácíš oporu kolena nebo se objeví nepříjemný tlak v rameni.",
        "Do not force the hand to the floor or roll the pelvis after the arm. Shorten the arc if knee support is lost or the shoulder feels uncomfortable pressure."
      ],
      "foc": [
        "Jeden oblouk a návrat paže dopředu tvoří opakování na danou stranu. U starších zápisů zachovej svůj způsob počítání a případnou změnu poznamenej.",
        "One arc and return of the arm forward form a repetition on the working side. Keep the counting convention used in older records and note any change."
      ],
      "pro": [
        "Začni menším obloukem a uprav výšku opory kolena. Rozsah lze postupně rozšířit, pokud pohyb zůstává pohodlný; úplný kruh není nutný.",
        "Start with a smaller arc and adjust knee-support height. Gradually expand the range if comfortable; a complete circle is not necessary."
      ],
      "source": {
        "author": "Runna",
        "document": "Dynamic Side Lying Windmills Exercise Tutorial",
        "url": "https://support.runna.com/en/articles/8791632-dynamic-side-lying-windmills-exercise-tutorial",
        "scope": "Runna describes side lying with the lower leg extended, the top hip/knee bent and an overhead semicircle followed by return. The existing illustrated entry adapts this with head support by the lower arm and a block/cushion under the top knee. Floor contact, a full circle, fixed right angles and the source dosage are not required. No clinical efficacy claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement",
        "joint"
      ],
      "positions": [
        "side_lying"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "yoga_block",
          "support_cushion"
        ]
      ],
      "priority": 1,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_mob_side_windmill",
      "atlasId": "ex26_mob_side_windmill",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "03b9ea4063cb6972754b42e1808d09274aadfd648bc0f172e542d22b536e96a0",
        "thumb": "/expansion-atlas/ex26_mob_side_windmill-original-256.webp",
        "detail": "/expansion-atlas/ex26_mob_side_windmill-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_mob_side_windmill-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_mob_side_windmill-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_mob_side_windmill-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_mob_side_windmill-fill-960.webp"
      },
      "sourceSha256": "03b9ea4063cb6972754b42e1808d09274aadfd648bc0f172e542d22b536e96a0",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_mob_seated_rotation": {
    "before": {
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
      "defaultRestSec": 15,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Sedni na pevnou židli bez koleček tak, aby chodidla dosáhla na zem a paže měly volný prostor. Paže překřiž na hrudníku a pánev nech spočívat na sedadle.",
        "Sit on a stable chair without wheels, with the feet reaching the floor and room for the arms. Cross the arms over the chest and keep the pelvis resting on the seat."
      ],
      "foc": [
        "Střídej otočení vlevo a vpravo přes návrat doprostřed. Zápisy zůstávají ve střídavém režimu; u starších sérií zachovej, zda počítáš jednotlivá otočení, nebo páry.",
        "Alternate left and right turns, returning through centre. Records remain in alternating mode; retain whether older sets count individual turns or pairs."
      ],
      "pro": [
        "Rozsah může být malý. Volitelně se na okamžik zastav v pohodlném otočení; poloha paží před tělem je další možnost, nikoli povinný postup.",
        "The range may be small. Optionally pause briefly in a comfortable turn; holding the arms forward is another option, not a required progression."
      ],
      "source": {
        "author": "South Tees Hospitals NHS Foundation Trust",
        "document": "Seated rotations",
        "url": "https://www.southtees.nhs.uk/resources/seated-rotations/",
        "scope": "Supports seated rotation with feet on the floor, crossed arms, pelvis on the seat and controlled return. The entry retains alternating repetitions and a chair instead of the source alternative bed edge. Optional arm-position changes and practical setup are coaching adaptations. No rehabilitation eligibility, fixed dose or promise of pain relief is inferred."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "chair_bench"
      ],
      "equipmentRequirements": [
        [
          "chair"
        ]
      ],
      "priority": 0,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "alternating"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_mob_seated_rotation",
      "atlasId": "ex26_mob_seated_rotation",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "c5bfba0d462b2eb94a1b90c88a89ea612e1f34ec022a7945e2dd469043fb7247",
        "thumb": "/expansion-atlas/ex26_mob_seated_rotation-original-256.webp",
        "detail": "/expansion-atlas/ex26_mob_seated_rotation-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_mob_seated_rotation-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_mob_seated_rotation-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_mob_seated_rotation-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_mob_seated_rotation-fill-960.webp"
      },
      "sourceSha256": "c5bfba0d462b2eb94a1b90c88a89ea612e1f34ec022a7945e2dd469043fb7247",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_mob_chair_extension": {
    "before": {
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
      "defaultRestSec": 15,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Použij stabilní židli bez koleček s opěradlem, jehož horní okraj ti poskytne pohodlnou oporu pod lopatkami. Chodidla opři o zem. Dlaně polož za hlavu bez tahání za krk, nebo paže překřiž na hrudníku.",
        "Use a stable chair without wheels whose backrest edge provides comfortable support below the shoulder blades. Plant the feet on the floor. Rest the hands behind the head without pulling the neck, or cross the arms over the chest."
      ],
      "wat": [
        "Ostrý, příliš vysoký nebo nevhodně umístěný okraj není vhodná opora. Zvol menší rozsah místo prudkého záklonu krku nebo prohnutí v bedrech; židle musí zůstat stabilní.",
        "A sharp, overly high or poorly positioned edge is unsuitable support. Choose a smaller range rather than abruptly tipping the neck or arching the lower back; keep the chair stable."
      ],
      "foc": [
        "Jemné napřímení přes opěradlo a návrat do sedu tvoří opakování. Opěradlo má vést rozsah pohodlně, ne působit jako tvrdý bod pro násilné prohnutí.",
        "A gentle extension over the backrest and return to sitting form a repetition. The backrest should guide a comfortable range, not act as a hard point for forcing an arch."
      ],
      "pro": [
        "Uprav velikost pohybu a vyber pohodlnější polohu paží. Krátká pauza je volitelná; větší záklon ani ruce za hlavou nejsou povinný cíl.",
        "Adjust movement size and choose the more comfortable arm position. A brief pause is optional; a larger backbend or hands behind the head are not required goals."
      ],
      "source": {
        "author": "NHS OPAL",
        "document": "Seated thoracic extension",
        "url": "https://www.opalreturntowork.nhs.uk/exercises/seated-thoracic-extension/",
        "scope": "OPAL demonstrates seated extension over a sturdy chair back with crossed arms. The existing entry also allows hands behind the head. Comfortable backrest height, modest range and avoiding forced neck motion are coaching adaptations; the source neck-extension cue and fixed dose are not imposed. This is a general mobility option, not a postoperative or pain-treatment protocol."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "chair_bench"
      ],
      "equipmentRequirements": [
        [
          "thoracic_extension_chair"
        ]
      ],
      "priority": 1,
      "focus": [
        "mobility"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_mob_chair_extension",
      "atlasId": "ex26_mob_chair_extension",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ff3837e934556e47010795e9c3902f3cebf08c521d3b7d192e519e51926e93fb",
        "thumb": "/expansion-atlas/ex26_mob_chair_extension-original-256.webp",
        "detail": "/expansion-atlas/ex26_mob_chair_extension-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_mob_chair_extension-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_mob_chair_extension-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_mob_chair_extension-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_mob_chair_extension-fill-960.webp"
      },
      "sourceSha256": "ff3837e934556e47010795e9c3902f3cebf08c521d3b7d192e519e51926e93fb",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_knees_sideplank": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "exe": [
        "Zvedni pánev do boční opory na předloktí a spodním koleni, kolena zůstávají na sobě. Drž přibližnou linii rameno–kyčel–koleno a průběžně dýchej. Po výdrži pánev kontrolovaně polož.",
        "Lift into a side support on the forearm and lower knee, keeping the knees stacked. Hold an approximate shoulder–hip–knee line while breathing. Lower the pelvis under control after the hold."
      ],
      "foc": [
        "Zapisuj sekundy udržené opory na každé straně podle plánu. Zvednutí a položení pánve jsou nástup a ukončení výdrže, ne počítaná opakování.",
        "Record seconds of the maintained support on each side as prescribed. Raising and lowering the pelvis enter and end the hold; they are not counted repetitions."
      ],
      "pro": [
        "Volitelně zkrať nebo prodluž výdrž při stejné opoře. Narovnání nohou mění páku a je jiná možnost, nikoli povinný další stupeň. Vyber oporu, ve které zvládáš dýchat a držet polohu.",
        "Optionally shorten or extend the hold with the same support. Straightening the legs changes the lever and is another option, not a required next level. Choose support that lets you breathe and maintain the position."
      ],
      "source": {
        "author": "ACE · Sarah Shore-Beck",
        "document": "4 Core Movements for Beginners",
        "url": "https://www.acefitness.org/resources/everyone/blog/5250/4-core-movements-for-beginners/",
        "scope": "Modified Side Plank section only: forearm and bent-knee side support. Existing duration recording is retained. The article’s next advanced ball exercise is not this identity or a compulsory progression; no universal dosage or therapeutic effect is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "side_support"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "strength"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_knees_sideplank",
      "atlasId": "ex26_knees_sideplank",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e3dfe10bed789e11aaae57786f2018d9c71815039781ac0680ef1bdaa3a316b4",
        "thumb": "/expansion-atlas/ex26_knees_sideplank-original-256.webp",
        "detail": "/expansion-atlas/ex26_knees_sideplank-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_knees_sideplank-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_knees_sideplank-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_knees_sideplank-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_knees_sideplank-fill-960.webp"
      },
      "sourceSha256": "e3dfe10bed789e11aaae57786f2018d9c71815039781ac0680ef1bdaa3a316b4",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_hss_wall_sideplank": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Stůj bokem k pevné zdi, opři o ni předloktí přibližně ve výšce ramene a chodidla posuň mírně od zdi. Obě chodidla mají pevnou neklouzavou oporu; zvol pohodlný rozestup.",
        "Stand side-on to a solid wall, place the forearm against it around shoulder height and move the feet slightly away. Keep both feet securely supported on a nonslip surface with a comfortable stance."
      ],
      "exe": [
        "Opři se předloktím a udrž tělo v mírně šikmé linii bez propadnutí boku ke zdi. Zůstaň v poloze a volně dýchej; po výdrži se vrať do vzpřímeného stoje.",
        "Press into the forearm and maintain a slight diagonal body line without letting the hip sag toward the wall. Hold and breathe freely, then return to upright standing."
      ],
      "foc": [
        "Zapisuj sekundy výdrže zvlášť pro každou stranu podle plánu. Jde o stálou boční oporu, ne opakované odtlačování od zdi.",
        "Record hold seconds separately for each side as prescribed. This is a steady side support, not repeated pushes away from the wall."
      ],
      "pro": [
        "Chodidla blíž ke zdi obvykle zmenší nárok opory; větší odstup ho může zvýšit. Měň vzdálenost či dobu jen při jisté opoře. Přechod na lavici nebo podlahu je volba jiného nastavení, ne povinnost.",
        "Feet nearer the wall usually reduce support demand; a greater distance can increase it. Change distance or duration only with secure support. Moving to a bench or floor is a different setup option, not an obligation."
      ],
      "source": {
        "author": "PROHAB · Nigel Nairn (Physiotec exercise handout)",
        "document": "Spinal Stability Week 4 — Side plank on the wall, item 3",
        "url": "https://prohab.co.nz/wp-content/uploads/2022/07/Spinal-Stability-Week-4.pdf",
        "scope": "Forearm-on-wall standing side hold. The handout uses tandem feet; this existing card and illustration retain a comfortable stable stance instead of imposing tandem. Nigel Nairn is identified as handout preparer, not author of the entire Physiotec library. The handout dosage is not a universal prescription. HSS collection is local organization, not proof of official DNS teaching or a rehabilitation indication."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "wall",
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "zed"
        ]
      ],
      "priority": 0,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_hss_wall_sideplank",
      "atlasId": "ex26_hss_wall_sideplank",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "2a99267b77ba94052c321b0fadf51a9525fd3f0e6e59f5cb72483076aa77fe02",
        "thumb": "/expansion-atlas/ex26_hss_wall_sideplank-original-256.webp",
        "detail": "/expansion-atlas/ex26_hss_wall_sideplank-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hss_wall_sideplank-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hss_wall_sideplank-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hss_wall_sideplank-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hss_wall_sideplank-fill-960.webp"
      },
      "sourceSha256": "2a99267b77ba94052c321b0fadf51a9525fd3f0e6e59f5cb72483076aa77fe02",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_hss_sideplank_leg": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "exe": [
        "Zvedni pánev do opory na předloktí a spodním koleni. Při udržené opoře pomalu unož nataženou horní nohu a vrať ji do linie trupu. Pánev během opakování nepokládej.",
        "Lift the pelvis onto the forearm and lower knee. Maintain the support while slowly raising the straight top leg sideways and returning it in line with the trunk. Keep the pelvis lifted during repetitions."
      ],
      "wat": [
        "Výšku zvednutí přizpůsob tak, aby se pánev neotáčela dozadu a opěrné rameno nepropadalo. Nezvětšuj rozsah vytočením špičky ke stropu.",
        "Choose a lift height that avoids rolling the pelvis backward or sinking through the supporting shoulder. Do not gain range by turning the toes toward the ceiling."
      ],
      "foc": [
        "Jedno unožení horní nohy a návrat tvoří opakování; zvednutí pánve do opory se nepočítá. Obě strany zapisuj podle plánu a označuj stejně jako dříve. Hýbe se noha opačná k opěrnému předloktí.",
        "One top-leg raise and return form a repetition; entering the pelvic support does not count. Record both sides as prescribed using the same side labels as before. The moving leg is opposite the supporting forearm."
      ],
      "pro": [
        "Volitelně zmenši zvednutí, zpomal pohyb nebo krátce zastav nahoře. Opření horní nohy mění úkol na výdrž bez unožování; nenahrazuje počítané zdvihy. Přidání gumy není povinný krok.",
        "Optionally reduce the lift, slow the movement or briefly pause at the top. Resting the top leg changes the task to a hold without leg raises; it does not replace counted raises. Adding a band is not a required step."
      ],
      "ez": "ex26_knees_sideplank",
      "source": {
        "author": "[P]rehab",
        "document": "Side Plank - On Knees, Hip Abduction",
        "url": "https://theprehabguys.com/vimeo-video/side-plank-on-knees-hip-abduction/",
        "scope": "Forearm and bent lower-knee support with the top knee straight and repeated hip abduction. No fixed 45-degree knee angle, maximal hip height, medical claim or dose is imposed. Existing local HSS collection does not establish an official DNS method. A static bent-knee side plank is an optional simpler related task, not an interchangeable repetition record."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability",
        "joint"
      ],
      "positions": [
        "side_support"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_hss_sideplank_leg",
      "atlasId": "ex26_hss_sideplank_leg",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "d7952b4318d0fa1ce4401c62a7500dbfb5d573cc31a5e7247b7d324c42438cd1",
        "thumb": "/expansion-atlas/ex26_hss_sideplank_leg-original-256.webp",
        "detail": "/expansion-atlas/ex26_hss_sideplank_leg-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hss_sideplank_leg-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hss_sideplank_leg-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hss_sideplank_leg-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hss_sideplank_leg-fill-960.webp"
      },
      "sourceSha256": "d7952b4318d0fa1ce4401c62a7500dbfb5d573cc31a5e7247b7d324c42438cd1",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_hss_sideplank_march": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "foc": [
        "Jedno přitažení horního kolena a návrat do natažení tvoří opakování při udržené boční opoře. Obě strany zapisuj podle plánu a označuj stejně jako dříve; pohybuje se noha opačná k opěrnému předloktí.",
        "One top-knee drive and return to extension form a repetition while maintaining side support. Record both sides as prescribed using the same side labels as before; the moving leg is opposite the supporting forearm."
      ],
      "pro": [
        "Volitelně zkrať dráhu kolena nebo opři spodní koleno. Pomalejší pohyb či pauza mění nárok; nejsou povinnost. Statické boční prkno bez pohybu nohy je příbuzná výdrž, ne stejný počet opakování.",
        "Optionally shorten the knee path or support on the lower knee. Slower movement or a pause changes the demand; neither is required. A static side plank without leg movement is a related hold, not the same repetition count."
      ],
      "source": {
        "author": "MOTIVNY · JP",
        "document": "Coach’s Corner: Core Drills to Help You Move a Little Better — Variation 3: Side Plank w/Knee Drive",
        "url": "https://www.motivny.com/journal/coachs-corner-core-drills",
        "scope": "Forearm side support with repeated top-leg hip flexion and controlled return. The existing card keeps the top hand on the hip, whereas the source reaches that arm forward and brings knee toward elbow. This is an explicit local adaptation, with no required knee-elbow contact or imported set/tempo prescription. HSS collection is not a claim of official DNS provenance."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability",
        "joint"
      ],
      "positions": [
        "side_support"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 2,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": {
      "primary": [
        "abs",
        "obl"
      ],
      "secondary": [
        "low",
        "serr",
        "hipflex"
      ]
    },
    "art": {
      "appId": "ex26_hss_sideplank_march",
      "atlasId": "ex26_hss_sideplank_march",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "b3d6fb2c066ca11c6f50174dad72acf58232a1e0847bc90bcd6e17f206e55d36",
        "thumb": "/expansion-atlas/ex26_hss_sideplank_march-original-256.webp",
        "detail": "/expansion-atlas/ex26_hss_sideplank_march-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hss_sideplank_march-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hss_sideplank_march-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hss_sideplank_march-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hss_sideplank_march-fill-960.webp"
      },
      "sourceSha256": "b3d6fb2c066ca11c6f50174dad72acf58232a1e0847bc90bcd6e17f206e55d36",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_heel_slide": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Lehni na záda s pokrčenými koleny a chodidly na zemi, paže nech podél těla. Najdi pohodlnou klidnou polohu beder. Podklad musí dovolit plynulý posun paty.",
        "Lie on your back with knees bent, feet grounded and arms beside the body. Find a comfortable stable lower-back position. Use a surface that permits the heel to slide smoothly."
      ],
      "exe": [
        "Pomalu posuň jednu patu od těla a vrať ji, stále v kontaktu s podkladem. Druhé chodidlo zůstává opřené. Plynule dýchej a udržuj klidnou pánev; nohu nemusíš zcela natáhnout.",
        "Slowly slide one heel away and back, keeping it in contact with the surface. Keep the other foot grounded. Breathe normally and keep the pelvis steady; the leg need not straighten fully."
      ],
      "foc": [
        "Jeden posun paty od těla a návrat tvoří opakování dané nohy. Zapisuj pravou a levou stranu zvlášť. Pohyb vede noha, poloha trupu se přitom drží klidná.",
        "One heel slide away and back forms one repetition for that leg. Record right and left sides separately. The leg moves while the trunk position remains steady."
      ],
      "pro": [
        "Zkrať posun, pokud se s ním mění poloha pánve nebo musíš zadržovat dech. Delší dráha je volitelná při stejné kontrole. Zvedání paty nad podklad, pohyb pánve a dead bug jsou jiné úkoly, nikoli povinné stupně této karty.",
        "Shorten the slide if it changes pelvic position or makes you hold your breath. A longer path is optional with the same control. Lifting the heel off the surface, moving the pelvis and a dead bug are different tasks, not mandatory stages of this entry."
      ],
      "ez": null,
      "hd": null,
      "source": {
        "author": "American Council on Exercise",
        "document": "Supine Hollowing with Lower Extremity Movements",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/121/supine-hollowing-with-lower-extremity-movements/",
        "scope": "Adapted from ACE exercise 121, step 4 heel-slide option: heel stays in contact as the leg moves and the trunk remains steady. This existing entry uses arms at the sides and relaxed breathing. It does not prescribe the source’s pelvic-floor/hollowing sequence, rigid scapular positioning, fixed distance, isolation of deep muscles or injury-prevention claim. No full leg extension is required."
      }
    },
    "taxonomy": {
      "movements": [
        "joint",
        "trunk_stability"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_heel_slide",
      "atlasId": "ex26_heel_slide",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "4d2dfe7d95d4e999affbdffbff3262747d2e147b8ea8c96feb997290f5904131",
        "thumb": "/expansion-atlas/ex26_heel_slide-original-256.webp",
        "detail": "/expansion-atlas/ex26_heel_slide-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_heel_slide-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_heel_slide-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_heel_slide-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_heel_slide-fill-960.webp"
      },
      "sourceSha256": "4d2dfe7d95d4e999affbdffbff3262747d2e147b8ea8c96feb997290f5904131",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_reverse_march": {
    "before": {
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
      "defaultRestSec": 120,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "exe": [
        "Pomalu zvedni jednu nohu při zachování pokrčení kolena. Zastav nejpozději přibližně se stehnem nad kyčlí, nebo dřív, pokud se mění poloha pánve. Vrať chodidlo na zem a teprve potom zvedni druhou nohu.",
        "Slowly lift one leg while retaining the knee bend. Stop around the point where the thigh is above the hip, or sooner if pelvic position changes. Return the foot to the floor before lifting the other leg."
      ],
      "wat": [
        "Vol výšku zdvihu, při které se pánev nepřeklápí ani neotáčí a můžeš klidně dýchat. Nepřitahuj koleno silou k hrudníku a nenechávej obě nohy současně ve vzduchu.",
        "Choose a lift height that keeps the pelvis steady without tipping or turning and allows relaxed breathing. Do not force the knee toward the chest or keep both feet off the floor together."
      ],
      "foc": [
        "Jeden zdvih a položení chodidla tvoří opakování dané nohy. Nohy můžeš střídat, ale zapisuj pravou a levou stranu zvlášť. Krátká pauza nahoře zůstává součástí opakování.",
        "One lift and return of the foot form one repetition for that leg. The legs may alternate, but record right and left sides separately. A brief pause at the top remains part of the repetition."
      ],
      "pro": [
        "Zvedni chodidlo jen nízko, pokud vyšší poloha mění oporu trupu. Volitelně zpomal návrat nebo krátce zastav. Pohyb protilehlé paže či dead bug mění koordinaci a jsou samostatnou možností, nikoli povinnou návazností.",
        "Lift the foot only a little if a higher position changes trunk support. Optionally slow the return or pause briefly. Opposite-arm movement or a dead bug changes the coordination task and is a separate option, not a required next step."
      ],
      "ez": null,
      "hd": null,
      "source": {
        "author": "American Council on Exercise",
        "document": "Supine Reverse Marches",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/238/supine-reverse-marches/",
        "scope": "Uses the ACE bent-knee leg lift from a feet-grounded supine start and its dynamic variation, with the thigh approaching vertical while lumbar/pelvic position stays steady. Arms alongside the body and alternating legs are existing local adaptations. This entry keeps perSide repetitions, not the source’s longer hold dosage, and does not silently convert to tabletop heel taps or a bilateral unsupported dead-bug start. No injury-prevention or superior core-activation claim is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "joint",
        "trunk_stability"
      ],
      "positions": [
        "supine"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 0,
      "focus": [
        "strength",
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_reverse_march",
      "atlasId": "ex26_reverse_march",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e5164e73071ce8f9cba6282d73bc98aa9f00ebfe4ca76048790baa82fe94753e",
        "thumb": "/expansion-atlas/ex26_reverse_march-original-256.webp",
        "detail": "/expansion-atlas/ex26_reverse_march-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_reverse_march-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_reverse_march-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_reverse_march-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_reverse_march-fill-960.webp"
      },
      "sourceSha256": "e5164e73071ce8f9cba6282d73bc98aa9f00ebfe4ca76048790baa82fe94753e",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_dns_side_reach": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Lehni si na bok, spodní nohu pohodlně pokrč a spodní paži polož před hrudník. Loket je přibližně v pravém úhlu a předloktí spočívá na podložce. Hlavu drž v prodloužení trupu; podle potřeby ji podlož.",
        "Lie on your side with the lower leg comfortably bent and the lower arm in front of the chest. Bend the elbow roughly to a right angle with the forearm resting on the mat. Keep the head in line with the trunk and support it if needed."
      ],
      "exe": [
        "Jemně se opři o spodní předloktí a nohu. Horní rukou pomalu dosáhni před sebe a vrať ji, zatímco trup a pánev udržují ovládanou polohu.",
        "Gently bear weight through the lower forearm and leg. Slowly reach the top hand forward and return it while keeping the trunk and pelvis controlled."
      ],
      "wat": [
        "Při dosahu se nepropadej do opěrného ramene ani nepřitahuj horní bok k žebrům. Dosah zkrať, pokud tě přetáčí dopředu nebo dozadu; dýchej plynule.",
        "Avoid sinking into the supporting shoulder or hiking the upper hip toward the ribs. Shorten the reach if it rolls you forward or backward; keep breathing comfortably."
      ],
      "foc": [
        "Jeden dosah horní ruky a návrat tvoří opakování na jedné straně. Poté se otoč a zapisuj druhou stranu zvlášť. Cílem je opora a kontrolovaný dosah, ne co největší vzdálenost.",
        "One top-arm reach and return form a repetition on one side. Then turn over and record the other side separately. The task is supported, controlled reaching, not the longest possible reach."
      ],
      "pro": [
        "Dosah lze zkrátit nebo nejprve jen najít pohodlnou oporu. Delší dosah přidávej jen podle plánu při zachování kontroly. Varianta proti gumě má samostatnou kartu a vyžaduje bezpečné kotvení.",
        "Shorten the reach or first establish comfortable support. Increase reach only as prescribed while retaining control. The band variation has its own entry and requires secure anchoring."
      ],
      "source": {
        "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
        "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
        "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
        "scope": "DNS chapter, Figure 13 and side-lying section, pp. 15–16: supported reaching. The counting convention, comfort cues and individual range here are original coaching adaptations, not a clinical protocol or certification claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "side_lying"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_dns_side_reach",
      "atlasId": "ex26_dns_side_reach",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "5093d82604241b520152235be7ebae234c3bf34e073d6522c3c971e2ce073edc",
        "thumb": "/expansion-atlas/ex26_dns_side_reach-audit20261013-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_side_reach-audit20261013-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_side_reach-audit20261013-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_side_reach-audit20261013-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_side_reach-audit20261013-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_side_reach-audit20261013-fill-960.webp"
      },
      "sourceSha256": "5093d82604241b520152235be7ebae234c3bf34e073d6522c3c971e2ce073edc",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_dns_side_band": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Lehni si na bok s pokrčenou spodní nohou a oporou o spodní předloktí. Nepoškozenou gumu upevni do pevné kotvy za sebou přibližně ve výšce hrudníku v této poloze a spojení vyzkoušej malým tahem. Konec drž horní rukou.",
        "Lie on your side with the lower leg bent and the lower forearm supported. Secure an intact band to a fixed anchor behind you around chest height in this position, and test the connection with a light pull. Hold the free end in the top hand."
      ],
      "exe": [
        "Horní rukou pomalu dosáhni vpřed proti lehkému odporu a kontrolovaně se vrať. Spodní předloktí a noha zůstávají oporou, trup ani pánev se tahem nepřetáčejí.",
        "Slowly reach the top hand forward against light resistance and return under control. Keep the lower forearm and leg supported without allowing the pull to roll the trunk or pelvis."
      ],
      "wat": [
        "Před sérií zkontroluj gumu i kotvu a drž tah mimo obličej. Zvol odpor, při kterém nekloužeš, nepropadáš se do ramene a dokážeš plynule dýchat. Gumu nepouštěj pod napětím.",
        "Check the band and anchor before the set, and keep the line of pull away from the face. Use resistance that allows stable support and comfortable breathing without sliding or sinking into the shoulder. Do not release a stretched band."
      ],
      "foc": [
        "Jeden dosah a kontrolovaný návrat tvoří opakování. Zapisuj každou stranu zvlášť; typ gumy a vzdálenost od kotvy poznamenej pro srovnání. Historický záznam této karty počítá opakování, ne kilogramy odporu gumy.",
        "One reach and controlled return form a repetition. Record each side separately; note the band and distance from the anchor for comparison. This entry historically records repetitions, not kilograms of band resistance."
      ],
      "pro": [
        "Pro menší nárok zvol slabší gumu, kratší dosah nebo samostatnou variantu bez gumy. Volitelně přidej krátké zastavení, pokud udržíš stejné opory; silnější odpor není nutný cíl.",
        "For less demand, use a lighter band, shorter reach or the separate unresisted variation. Optionally add a brief pause while retaining the same support; heavier resistance is not a required goal."
      ],
      "source": {
        "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
        "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
        "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
        "scope": "DNS chapter, Figure 13F–H, pp. 15–16: resistance-band variation in side lying. Fixed rear anchoring, checking instructions and rep logging here are original adaptations; the source does not prescribe this exact anchor setup or dose."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "side_lying"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "guma"
        ],
        [
          "fixed_anchor"
        ]
      ],
      "priority": 1,
      "focus": [
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_dns_side_band",
      "atlasId": "ex26_dns_side_band",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "8ec73242679920fd8a960a7584755f852ca354a65dab3bc6bcdee1b7f0528cd1",
        "thumb": "/expansion-atlas/ex26_dns_side_band-audit20261013-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_side_band-audit20261013-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_side_band-audit20261013-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_side_band-audit20261013-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_side_band-audit20261013-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_side_band-audit20261013-fill-960.webp"
      },
      "sourceSha256": "8ec73242679920fd8a960a7584755f852ca354a65dab3bc6bcdee1b7f0528cd1",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_dns_side_roll": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Lehni si na bok s pohodlně pokrčenou spodní nohou. Spodní předloktí opři před tělem a hlavu drž v prodloužení trupu. Najdi stabilní kontakt spodní paže a nohy s podložkou.",
        "Lie on your side with the lower leg comfortably bent. Support the lower forearm in front of the body and keep the head in line with the trunk. Establish steady contact through the lower arm and leg."
      ],
      "exe": [
        "Malým pohybem přenes trup a pánev společně mírně vpřed a zpět kolem opěrné paže a nohy. Opory zůstávají na místě; nepřetáčej se úplně na záda ani na břicho.",
        "Move the trunk and pelvis together slightly forward and back around the supporting arm and leg. Keep the supports in place without rolling fully onto the back or stomach."
      ],
      "foc": [
        "Jeden malý přenos vpřed a zpět tvoří opakování na jedné straně. Druhou stranu zapisuj zvlášť. Jde o řízený přenos váhy v boční opoře, nikoli celé přetočení těla.",
        "One small forward-and-back weight shift forms a repetition on one side. Record the other side separately. This is a controlled weight transfer in side support, not a full-body roll."
      ],
      "pro": [
        "Zmenši přenos, pokud ztrácíš oporu nebo zadržuješ dech. Dosah horní ruky přidávej jen volitelně podle plánu; samotná výdrž i dosah jsou odlišné úkoly.",
        "Reduce the shift if support is lost or breathing is held. Add a top-arm reach only as an optional prescribed variation; a static hold and a reach are different tasks."
      ],
      "source": {
        "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
        "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
        "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
        "scope": "DNS chapter, side-lying section, p. 15: small back-and-forth torso and pelvis movement around supporting limbs. This is an original rep-based weight-shift adaptation, not full rolling or a rehabilitation outcome claim."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_movement",
        "trunk_stability"
      ],
      "positions": [
        "side_lying"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_dns_side_roll",
      "atlasId": "ex26_dns_side_roll",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "4bc4946a1cd90eb76442bf249880c55178ae5382ea19dcbcc8dfffa96c736708",
        "thumb": "/expansion-atlas/ex26_dns_side_roll-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_side_roll-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_side_roll-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_side_roll-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_side_roll-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_side_roll-fill-960.webp"
      },
      "sourceSha256": "4bc4946a1cd90eb76442bf249880c55178ae5382ea19dcbcc8dfffa96c736708",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_dns_oblique_forearm": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "pos": [
        "Posaď se šikmo na bok s pokrčenými nohami a opři spodní předloktí i dlaň o podložku. Boční část stehna a nohy zůstávají v kontaktu se zemí. Loket umísti tak, aby opora ramene byla pohodlná.",
        "Sit obliquely on one side with the legs bent, and support the lower forearm and palm on the mat. Keep the lateral thigh and legs in contact with the floor. Position the elbow for comfortable shoulder support."
      ],
      "exe": [
        "Jemně se odtlač od předloktí a udrž šikmý sed bez propadání do ramene nebo boku. Hlavu nech v prodloužení trupu a po dobu výdrže plynule dýchej.",
        "Gently press through the forearm and maintain the oblique sitting position without sinking into the shoulder or side. Keep the head in line with the trunk and breathe comfortably throughout the hold."
      ],
      "wat": [
        "Ponech stehno a nohy podepřené; nezvedej pánev do bočního prkna. Netlač rameno silou dolů ani nevystrkuj bradu. Pokud oporu neudržíš pohodlně, výdrž ukonči.",
        "Keep the thigh and legs supported rather than lifting the pelvis into a side plank. Do not force the shoulder downward or jut the chin forward. End the hold if comfortable support cannot be maintained."
      ],
      "foc": [
        "Zapisuj dobu plynulé výdrže v sekundách pro každou stranu zvlášť. Tato karta sleduje držení šikmého sedu, nikoli počet zdvihů pánve nebo dosahů.",
        "Record uninterrupted hold time in seconds for each side separately. This entry tracks holding oblique sitting, not repetitions of hip lifts or reaches."
      ],
      "pro": [
        "Pro menší nárok zkrať výdrž nebo přidej oporu volné dlaně. Delší výdrž či samostatná varianta s dosahem jsou volitelné změny podle plánu; nejde o povinný postup.",
        "For less demand, shorten the hold or add support from the free palm. Longer holds or a separate reaching variation are optional planned changes, not a compulsory progression."
      ],
      "source": {
        "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
        "document": "Dynamic Neuromuscular Stabilization, developmental exercise positions",
        "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
        "scope": "DNS chapter, Figure 14, pp. 16–17: forearm-supported oblique sitting. This entry selects the supported hold and its own timing convention; it does not reproduce therapist-led assessment, manual correction or prescribed clinical treatment."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability",
        "position"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "forearm_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_dns_oblique_forearm",
      "atlasId": "ex26_dns_oblique_forearm",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "84b3b12c1bb41dfb4a1a4f80fabbdd647ed049ff5a229dc2e6f05425eca69d30",
        "thumb": "/expansion-atlas/ex26_dns_oblique_forearm-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_oblique_forearm-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_oblique_forearm-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_oblique_forearm-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_oblique_forearm-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_oblique_forearm-fill-960.webp"
      },
      "sourceSha256": "84b3b12c1bb41dfb4a1a4f80fabbdd647ed049ff5a229dc2e6f05425eca69d30",
      "contourOnly": true,
      "darkOutline": true
    }
  },
  "ex26_dns_oblique_hand": {
    "before": {
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
      "defaultRestSec": 90,
      "seed": "TEX_SEED_V2"
    },
    "edits": {
      "exe": [
        "S loktem téměř nataženým se jemně odtlač od dlaně a udrž šikmý sed. Boční část stehna i nohy zůstávají opřené o zem. Hlavu drž v prodloužení trupu a během výdrže plynule dýchej.",
        "With the elbow nearly straight, gently press through the palm and maintain oblique sitting. Keep the lateral thigh and legs supported on the floor. Keep the head in line with the trunk and breathe comfortably during the hold."
      ],
      "wat": [
        "Nepřetlačuj loket do propnutí a nepropadej se do opěrného ramene. Nezvedej pánev do bočního prkna. Při nepohodlí v zápěstí změň oporu nebo výdrž ukonči.",
        "Do not force elbow hyperextension or sink into the supporting shoulder. Do not lift the pelvis into a side plank. Change the support or end the hold if the wrist is uncomfortable."
      ],
      "foc": [
        "Zapisuj dobu plynulé výdrže v sekundách pro každou stranu zvlášť. Přenos váhy není nutný k dokončení této výdrže.",
        "Record uninterrupted hold time in seconds for each side separately. Weight shifting is not required to complete this hold."
      ],
      "pro": [
        "Zkrať výdrž nebo zvol samostatnou kartu s oporou o předloktí, pokud lépe vyhovuje ruce. Délku výdrže měň podle plánu při zachování pohodlné opory.",
        "Shorten the hold or choose the separate forearm-supported entry if it suits the arm better. Adjust hold duration as prescribed while retaining comfortable support."
      ],
      "source": {
        "author": "Prague School of Rehabilitation",
        "document": "DNS Trainer Practical Certification Test — developmental positions",
        "url": "https://www.rehabps.com/sportcourse_test.html",
        "scope": "The Prague School trainer-test page identifies oblique sitting with hand support as a developmental exercise position. It is a position list, not a full technique prescription. These setup, comfort and timed-hold instructions are original coaching adaptations, not certification or clinical-treatment claims."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability",
        "position"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "priority": 1,
      "focus": [
        "coordination"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc"
    ],
    "identityFields": [
      "pat",
      "family",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "seedProfiles": [
      {
        "present": true,
        "value": "TEX_SEED_V2"
      },
      {
        "present": false
      }
    ],
    "noEstimate": false,
    "display": null,
    "art": {
      "appId": "ex26_dns_oblique_hand",
      "atlasId": "ex26_dns_oblique_hand",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "9dc9722a4482577525c382ae46e4fa2e765d22e05c23d0c8f9c14f4258506c53",
        "thumb": "/expansion-atlas/ex26_dns_oblique_hand-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_oblique_hand-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_oblique_hand-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_oblique_hand-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_oblique_hand-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_oblique_hand-fill-960.webp"
      },
      "sourceSha256": "9dc9722a4482577525c382ae46e4fa2e765d22e05c23d0c8f9c14f4258506c53",
      "contourOnly": true,
      "darkOutline": true
    }
  }
};
