// Shared public templates and delivery projections. No role metadata or private records.
export const LOCOMOTION_AUDIT_ENTRIES={
  "act_walk": {
    "profiles": {
      "2ae3f4aa094c2406": {
        "id": "act_walk",
        "cz": "Chůze",
        "en": "Walking",
        "pat": "prenos",
        "S": 1,
        "C": 1,
        "J": {},
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "cal"
        ],
        "ms": [
          "glu",
          "ham"
        ],
        "dot": [
          30,
          100
        ],
        "ez": null,
        "hd": "act_hike",
        "foc": [
          "Nejlevnější a nejspolehlivější věc, kterou pro sebe můžeš udělat.",
          "The cheapest and most reliable thing you can do for yourself."
        ],
        "pos": [
          "Vzpřímený trup, uvolněná ramena, pohled vpřed.",
          "Tall torso, easy shoulders, eyes forward."
        ],
        "exe": [
          "Jdi tempem, u kterého se dá mluvit v celých větách.",
          "Walk at a pace where you can speak in full sentences."
        ],
        "wat": [
          "Délku i tempo si volíš. Nemusí z toho být trénink.",
          "You choose the distance and the pace. It does not have to become a workout."
        ]
      }
    },
    "edits": {
      "pos": [
        "Vyber přehlednou trasu a obuv vhodnou pro povrch. Začni pohodlnou chůzí; paže a ramena nech volné.",
        "Choose a clear route and footwear suited to the surface. Start at a comfortable walking pace with relaxed arms and shoulders."
      ],
      "exe": [
        "Jdi tempem odpovídajícím dnešnímu záměru. Svižná chůze může zrychlit dech, ale stále při ní zvládneš mluvit. Délku i přestávky přizpůsob tomu, co dnes zvládáš.",
        "Walk at a pace that suits today’s aim. Brisk walking may make you breathe faster while still allowing you to talk. Adapt the distance and breaks to what you can manage today."
      ],
      "wat": [
        "Sleduj cestu, provoz a změny povrchu. Potřebná opora nebo pomůcka pro chůzi není chyba; používej ji tak, jak jsi zvyklý.",
        "Watch the route, traffic and changes in the surface. Using needed support or a walking aid is not a fault; use it as you normally do."
      ],
      "foc": [
        "Zapisuj čas a případně vzdálenost. Při porovnávání přihlédni k trase, tempu a přestávkám.",
        "Record time and distance when available. Consider the route, pace and breaks when comparing sessions."
      ],
      "pro": [
        "Lehčí: kratší známá trasa a více přestávek. Náročnější: podle potřeby trochu delší nebo svižnější chůze. Běh, kopce ani přidaná zátěž nejsou povinným pokračováním.",
        "Easier: a shorter familiar route and more breaks. Harder: a little longer or brisker walking when appropriate. Running, hills and added load are not required next steps."
      ],
      "hd": null,
      "source": {
        "author": "NHS; CDC",
        "document": "Walking for health; How to Measure Physical Activity Intensity",
        "url": "https://www.nhs.uk/live-well/exercise/walking-for-health/",
        "scope": "Practical local walking instructions. NHS supports gradual adjustment for less active people who can walk; CDC supports relative intensity and an approximate talk test. The card includes ordinary walking, not only a brisk exercise target. No universal speed, step count, disease treatment, superiority claim or mandatory barefoot technique is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 0
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "A",
    "art": {
      "appId": "act_walk",
      "atlasId": "act_walk",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "73303813acc8c6708ca98efcce26354242247d1f82148123c6138c8baab9f1e3",
        "thumb": "/unified-atlas/act_walk-3c479f3832bed93d-thumb.webp",
        "detail": "/unified-atlas/act_walk-c0534a2134429255-detail.webp",
        "inkThumb": "/unified-atlas/act_walk-7ccf1128c0545a3e-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_walk-ba683ca1c54ac0c7-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_walk-178da71c8509e13e-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_walk-25bb2a3d0026a8ea-fillDetail.webp"
      },
      "sourceSha256": "73303813acc8c6708ca98efcce26354242247d1f82148123c6138c8baab9f1e3",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_walk",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "2ae3f4aa094c2406": {
        "before": {
          "cz": "Chůze",
          "en": "Walking",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Chůze",
          "en": "Walking",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_run": {
    "profiles": {
      "3dab78650d74d2d6": {
        "id": "act_run",
        "cz": "Běh",
        "en": "Running",
        "pat": "prenos",
        "S": 2,
        "C": 2,
        "J": {
          "kot": 2,
          "kol": 2
        },
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "cal",
          "ham"
        ],
        "ms": [
          "glu",
          "abs"
        ],
        "dot": [
          34,
          102
        ],
        "ez": "act_walk",
        "hd": "act_sprint",
        "foc": [
          "Kadence spíš vyšší, kroky spíš kratší.",
          "Cadence a little higher, steps a little shorter."
        ],
        "pos": [
          "Vzpřímený trup, mírný náklon z kotníků, uvolněné paže.",
          "Tall torso, a small lean from the ankles, relaxed arms."
        ],
        "exe": [
          "Drž tempo, které udržíš celý úsek. Dech je měřidlo.",
          "Hold a pace you can keep for the whole distance. The breath is the gauge."
        ],
        "wat": [
          "Objem přidávej po malých krocích. Kotníky a lýtka to poznají první.",
          "Add volume in small steps. The ankles and calves notice first."
        ]
      }
    },
    "edits": {
      "pos": [
        "Vyber přehlednou trasu s místem pro zpomalení a obuv, ve které se ti dobře běží. Začni chůzí a pozvolným rozběhem.",
        "Choose a clear route with room to slow down and footwear that feels comfortable for running. Begin with walking and ease into the run."
      ],
      "exe": [
        "Běž tempem odpovídajícím plánu a své současné možnosti. Podle potřeby střídej běh s chůzí; běžecké úseky nemusí být souvislé. Na konci postupně zpomal do chůze.",
        "Run at a pace that matches the plan and your current capacity. Alternate running with walking when needed; the running does not have to be continuous. Gradually slow to a walk at the end."
      ],
      "wat": [
        "Sleduj povrch a okolí. Pokud se mění krok kvůli bolesti nebo únavě, zpomal, přejdi do chůze nebo úsek ukonči. Univerzální kadenci ani jediný způsob došlapu tato karta nepředepisuje.",
        "Watch the surface and surroundings. If pain or fatigue changes your stride, slow down, walk or end the bout. This entry does not prescribe a universal cadence or one foot-strike pattern."
      ],
      "foc": [
        "Zapisuj čas a vzdálenost. U střídání běhu a chůze poznamenej poměr úseků a zda záznam zahrnuje obě části.",
        "Record time and distance. For run–walk sessions, note the interval pattern and whether the record includes both parts."
      ],
      "pro": [
        "Lehčí: kratší běžecké úseky a více chůze. Náročnější: postupná změna délky nebo tempa podle zotavení a plánu. Sprint není povinná další úroveň.",
        "Easier: shorter running bouts and more walking. Harder: gradually adjust duration or pace according to recovery and the plan. Sprinting is not a required next level."
      ],
      "hd": null,
      "source": {
        "author": "NHS",
        "document": "Get running with Couch to 5K",
        "url": "https://www.nhs.uk/better-health/get-active/get-running-with-couch-to-5k/",
        "scope": "Uses the general principles of run–walk alternation, gradual individual progression and route awareness. Does not reproduce the nine-week programme, its fixed intervals or marketing guarantees. Existing Running identity and distance/time recording remain; walking breaks do not create another exercise or reinterpret prior sessions."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "A",
    "art": {
      "appId": "act_run",
      "atlasId": "act_run",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "99a66b65b64d94c33f1bafa7e9e18f72630ca8a4700924cf54cbefc7c2f8ff0f",
        "thumb": "/unified-atlas/act_run-a3240ba94747c951-thumb.webp",
        "detail": "/unified-atlas/act_run-5cda947210ac83da-detail.webp",
        "inkThumb": "/unified-atlas/act_run-1f9a50b84dfffab1-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_run-fe2af8063985b25b-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_run-282fe7a4750e3cfb-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_run-0c14b2d3a9b2a6e1-fillDetail.webp"
      },
      "sourceSha256": "99a66b65b64d94c33f1bafa7e9e18f72630ca8a4700924cf54cbefc7c2f8ff0f",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_run",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "3dab78650d74d2d6": {
        "before": {
          "cz": "Běh",
          "en": "Running",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běh",
          "en": "Running",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_hike": {
    "profiles": {
      "2d637ccf6818afde": {
        "id": "act_hike",
        "cz": "Turistika",
        "en": "Hiking",
        "pat": "prenos",
        "S": 2,
        "C": 2,
        "J": {
          "kot": 1,
          "kol": 1
        },
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu",
          "cal"
        ],
        "ms": [
          "ham",
          "abs",
          "low"
        ],
        "dot": [
          32,
          104
        ],
        "ez": "act_walk",
        "hd": null,
        "foc": [
          "Sestup zatěžuje víc než výstup. Podle něj plánuj den.",
          "The descent costs more than the climb. Plan the day around it."
        ],
        "pos": [
          "Batoh usazený na bocích, kroky kratší do kopce i z kopce.",
          "Pack seated on the hips, shorter steps up and down."
        ],
        "exe": [
          "Tempo drž tak, aby se dalo jít i po hodinách.",
          "Hold a pace you could still keep after hours."
        ],
        "wat": [
          "Hole šetří kolena při sestupu. Nejsou to berle.",
          "Poles save the knees on the way down. They are not crutches."
        ]
      }
    },
    "edits": {
      "pos": [
        "Vyber trasu podle terénu, počasí a svých zkušeností. Připrav obuv, oblečení, vodu a další vybavení podle délky a místa výletu; počítej i s návratem.",
        "Choose a route suited to the terrain, weather and your experience. Prepare footwear, clothing, water and other supplies for the location and duration, including the return trip."
      ],
      "exe": [
        "Jdi tempem, které zvládáš i v měnícím se terénu. Při sestupu a na nejistém povrchu zpomal a vybírej oporu pro další krok. Přestávky a případný návrat přizpůsob podmínkám.",
        "Walk at a pace you can manage as the terrain changes. Slow down on descents and uncertain ground and choose the next foothold. Adjust breaks and the decision to turn back to the conditions."
      ],
      "wat": [
        "Délka, převýšení, povrch i batoh mění náročnost. Hole jsou volitelná pomůcka, ne záruka ochrany kolen. Snadnější trasa nebo dřívější návrat jsou běžné možnosti.",
        "Distance, elevation, surface and pack weight change the demands. Poles are optional assistance, not a guarantee of knee protection. An easier route or an earlier return are ordinary options."
      ],
      "foc": [
        "Zapisuj čas a vzdálenost; převýšení, povrch a případný batoh si poznamenej. Čas zahrnuje i cestu zpět podle toho, jak záznam vymezuješ.",
        "Record time and distance; note elevation, surface and any pack. Include the return journey according to how you define the recorded outing."
      ],
      "pro": [
        "Lehčí: kratší známá trasa s menším převýšením. Náročnější: měň délku nebo terén podle zkušeností a možností. Větší batoh ani strmější sestup nejsou povinným cílem.",
        "Easier: a shorter familiar route with less elevation change. Harder: adjust the distance or terrain to your experience and capacity. A heavier pack or steeper descent is not a required goal."
      ],
      "source": {
        "author": "U.S. National Park Service",
        "document": "Hike Smart",
        "url": "https://www.nps.gov/articles/hiking-safety.htm",
        "scope": "Uses route selection, changing conditions, appropriate trip supplies and planning the return. The source is outdoor safety guidance, not a clinical intervention. No universal comparison that descent costs more than ascent, and no knee-protection guarantee from poles, is imported. Optional poles and pack in the illustration are not mandatory equipment for every walk."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "A",
    "art": {
      "appId": "act_hike",
      "atlasId": "act_hike",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "9a55e51951d75f1fd9d3edbcecf7ce8729123ab46863db6bd08d6bbee47d1460",
        "thumb": "/unified-atlas/act_hike-593ba0785fd15b6d-thumb.webp",
        "detail": "/unified-atlas/act_hike-51a36a0f877e3270-detail.webp",
        "inkThumb": "/unified-atlas/act_hike-52fc5c7f0e748bd1-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_hike-77f95547ef134fdc-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_hike-2e7d8553e8fd09cc-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_hike-ed0a478792e6e0b6-fillDetail.webp"
      },
      "sourceSha256": "9a55e51951d75f1fd9d3edbcecf7ce8729123ab46863db6bd08d6bbee47d1460",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_hike",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "2d637ccf6818afde": {
        "before": {
          "cz": "Turistika",
          "en": "Hiking",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Turistika",
          "en": "Hiking",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "zone2": {
    "profiles": {
      "dcfcfd5bde14ebea": {
        "id": "zone2",
        "cz": "Klidná vytrvalost",
        "en": "Easy Endurance",
        "pat": "prenos",
        "S": 1,
        "C": 1,
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [],
        "ms": [
          "qua",
          "cal",
          "ham"
        ],
        "dot": [
          50,
          100
        ],
        "ez": null,
        "hd": "sprint",
        "cat": "kond",
        "rec": 1,
        "foc": [
          "Tempo, ve kterém ještě udržíš větu. Když ne, jdeš moc rychle.",
          "The pace at which you can still hold a sentence. If you cannot, you are going too fast."
        ],
        "pos": [
          "Chůze, klus, kolo, plavání. Na tom nezáleží.",
          "Walking, jogging, cycling, swimming. It does not matter which."
        ],
        "exe": [
          "30–60 minut souvisle. Nos dýchá, hlava je v klidu.",
          "Thirty to sixty minutes, unbroken. The nose breathes, the head is quiet."
        ],
        "wat": [
          "Není to trénink, který má bolet. Nudná monotónnost je ten správný pocit.",
          "It is not meant to hurt. Dull and steady is the correct sensation."
        ],
        "pro": [
          "Aerobní základna, na které stojí regenerace ze všeho ostatního.",
          "The aerobic base that recovery from everything else rests on."
        ]
      }
    },
    "edits": {
      "pos": [
        "Zvol známou aktivitu, kterou můžeš provádět s mírným úsilím, například chůzi, klidný klus, kolo nebo plavání. Připrav odpovídající prostor a vybavení; samotný název karty je neurčuje.",
        "Choose a familiar activity you can perform at an easy effort, such as walking, gentle jogging, cycling or swimming. Prepare the appropriate space and equipment; this entry’s name does not specify them."
      ],
      "exe": [
        "Udržuj zvládnutelné tempo po dobu stanovenou v plánu nebo podle dnešní možnosti. Dech a možnost mluvit mohou orientačně pomoci upravit intenzitu. Zpomal nebo zařaď přestávku, pokud úsilí přestává být klidné.",
        "Maintain a manageable pace for the planned duration or what you can manage today. Breathing and the ability to talk can help you judge the effort approximately. Slow down or take a break if it no longer feels easy."
      ],
      "wat": [
        "Klidné úsilí není stejná rychlost pro každého. Dýchání pouze nosem ani nepřerušených 30–60 minut nejsou podmínkou. Test řeči sám neurčí přesnou tepovou nebo laktátovou zónu.",
        "Easy effort is not the same speed for everyone. Nasal-only breathing and an uninterrupted 30–60 minutes are not requirements. The talk test alone does not determine an exact heart-rate or lactate zone."
      ],
      "foc": [
        "Zapisuj čas a do poznámky konkrétní aktivitu a podmínky. Pro podrobnější záznam vzdálenosti použij odpovídající kartu chůze, běhu nebo jiné aktivity.",
        "Record duration and note the activity and conditions. Use the corresponding walking, running or other activity entry when you want to record distance in more detail."
      ],
      "pro": [
        "Lehčí: kratší úsek, přestávky nebo méně náročná známá aktivita. Náročnější: podle potřeby prodluž celkový čas při podobném zvládnutelném úsilí. Rychlostní intervaly jsou jiný úkol.",
        "Easier: a shorter bout, breaks or a less demanding familiar activity. Harder: extend total time when appropriate while keeping a similarly manageable effort. Speed intervals are a different task."
      ],
      "hd": null,
      "source": {
        "author": "CDC",
        "document": "How to Measure Physical Activity Intensity",
        "url": "https://www.cdc.gov/physical-activity-basics/measuring/index.html",
        "scope": "Supports the distinction between relative and absolute intensity and the approximate talk test. The existing umbrella entry is retained without converting its duration history into one activity or a measured physiological zone. No fixed nasal-breathing requirement, minimum continuous duration, recovery guarantee or clinical effect is asserted."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [],
      "supports": [],
      "equipmentRequirements": [
        [
          "unknown_equipment"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "A",
    "art": {
      "appId": "zone2",
      "atlasId": "zone2",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ff56b148f3eb523c6e5559c5b2c3d140082ff4acafbb00da6cddf57b9506c3e1",
        "thumb": "/unified-atlas/zone2-f388b0f421d8e6d3-thumb.webp",
        "detail": "/unified-atlas/zone2-16608bc3c4a22b56-detail.webp",
        "inkThumb": "/unified-atlas/zone2-60d9ff811c4b0b25-inkThumb.webp",
        "inkDetail": "/unified-atlas/zone2-73240638f51b4019-inkDetail.webp",
        "fillThumb": "/unified-atlas/zone2-fcd352b24813a98a-fillThumb.webp",
        "fillDetail": "/unified-atlas/zone2-e9eff413b226e080-fillDetail.webp"
      },
      "sourceSha256": "ff56b148f3eb523c6e5559c5b2c3d140082ff4acafbb00da6cddf57b9506c3e1",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "zone2",
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "unknown_equipment"
        ]
      ],
      "unknown": true,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "dcfcfd5bde14ebea": {
        "before": {
          "cz": "Klidná vytrvalost",
          "en": "Easy Endurance",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Klidná vytrvalost",
          "en": "Easy Endurance",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "sprint": {
    "profiles": {
      "b1d99e66bf64c9d6": {
        "id": "sprint",
        "cz": "Sprint",
        "en": "Sprint",
        "pat": "prenos",
        "S": 2,
        "C": 2,
        "J": {
          "kol": 2,
          "kot": 2
        },
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "reps",
        "mp": [
          "qua",
          "ham",
          "glu",
          "cal"
        ],
        "ms": [
          "abs"
        ],
        "dot": [
          26,
          92
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Chodidlo dopadá pod tělo, ne před něj.",
          "The foot lands under the body, not in front of it."
        ],
        "pos": [
          "Rozběhová pozice: mírný náklon vpřed, pohled do dálky.",
          "Ready position: slight forward lean, eyes down the track."
        ],
        "exe": [
          "Prvních pár kroků tlačíš zem dozadu. Pak dlouhý, lehký krok, paže vedou rytmus. Každý úsek celý.",
          "The first strides push the ground back. Then a long, light stride, the arms setting the rhythm. Every rep run whole."
        ],
        "wat": [
          "Rychlost se nedá předstírat. Ramena uvolněná, pěsti měkké. Bez rozehřátí se nesprintuje.",
          "Speed can't be faked. Shoulders loose, fists soft. No sprinting on a cold body."
        ],
        "pro": [
          "Delší úseky, kratší pauzy — nebo do kopce.",
          "Longer reps, shorter rest — or uphill."
        ]
      }
    },
    "edits": {
      "cz": "Sprint ze startu",
      "en": "Sprint from a start",
      "pos": [
        "Před rychlými úseky se postupně rozehřej chůzí nebo lehkým během a několika plynulými zrychleními. Vyber rovnou, neklouzavou dráhu bez provozu s dostatkem místa pro doběh. Obuv zvol podle povrchu. Začni z pohodlného stoje s jednou nohou mírně vpředu; startovní bloky nejsou potřeba.",
        "Before fast bouts, warm up gradually with walking or easy running and several progressive accelerations. Choose a level, non-slip route away from traffic with enough room to slow down. Use footwear suited to the surface. Begin in a comfortable standing stance with one foot slightly forward; starting blocks are not required."
      ],
      "exe": [
        "Ze startu plynule zrychluj po vymezeném úseku. S rostoucí rychlostí nech trup postupně napřímit a paže přirozeně střídat proti nohám. Po konci úseku postupně zpomal; další opakování začni až po dostatečném zotavení.",
        "Accelerate smoothly from the start through the defined distance. Allow the torso to become more upright as speed increases and the arms to alternate naturally opposite the legs. Gradually slow down beyond the finish; repeat only after enough recovery."
      ],
      "wat": [
        "Při bolesti, ztrátě kontroly nebo poklesu rychlosti úsek ukonči. Pauzu prodluž podle zotavení; odpočet v aplikaci není pokyn znovu vyběhnout. Zkracování pauz ani běh do vyčerpání nejsou cílem rychlostního úkolu.",
        "End the bout if you have pain, lose control or cannot maintain speed. Extend rest according to recovery; the app timer is not an instruction to start again. Shorter rests and running to exhaustion are not the aim of this speed task."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas stejně vymezeného úseku. Poznamenej způsob startu, intenzitu a pauzu; neporovnávej automaticky čas ze startu s časem po rozběhu. Staré záznamy nepřepočítávej.",
        "Record the distance and time over the same defined section. Note the start, intensity and rest; do not automatically compare a time from a start with a time after a run-up. Do not convert earlier records."
      ],
      "pro": [
        "Lehčí: kratší úseky a nižší rychlost s dostatečným zotavením. Náročnější: podle plánu postupně měň rychlost nebo délku při zachované kontrole. Nejdřív si osvoj rychlejší běh; běh do kopce je odlišná podmínka, ne povinná další úroveň.",
        "Easier: shorter bouts at lower speed with enough recovery. Harder: gradually adjust speed or distance as planned while maintaining control. First become comfortable with faster running; uphill running is a different condition, not a required next level."
      ],
      "source": {
        "author": "NSCA; Human Kinetics",
        "document": "Sprinting Mechanics and Technique; Designing Speed Training Sessions",
        "url": "https://www.nsca.com/education/articles/kinetic-select/sprinting-mechanics-and-technique/",
        "scope": "Local practical adaptation of publicly available NSCA book excerpts on starting, acceleration, deceleration and quality with adequate recovery. Not an official NSCA lesson or copied programme. No universal angles, foot-strike rule, weekly volume, rest duration, injury guarantee or superiority claim. Stable identity and existing recording retained."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "B",
    "art": {
      "appId": "sprint",
      "atlasId": "sprint",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "0ac0f0f7f0d8329267b7bbdf763ed1c00695a451abc8f547db3e567aca9b9167",
        "thumb": "/unified-atlas/sprint-b23a47d8f7e3b108-thumb.webp",
        "detail": "/unified-atlas/sprint-9a6760fe45ad5aa8-detail.webp",
        "inkThumb": "/unified-atlas/sprint-c5d19e735f2be770-inkThumb.webp",
        "inkDetail": "/unified-atlas/sprint-562cb161114249a1-inkDetail.webp",
        "fillThumb": "/unified-atlas/sprint-e0f2c6e39604478a-fillThumb.webp",
        "fillDetail": "/unified-atlas/sprint-a755e33b5c158747-fillDetail.webp"
      },
      "sourceSha256": "0ac0f0f7f0d8329267b7bbdf763ed1c00695a451abc8f547db3e567aca9b9167",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "sprint",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false,
      "defaultRestSec": 180
    },
    "publicDefaults": {
      "b1d99e66bf64c9d6": {
        "before": {
          "cz": "Sprint",
          "en": "Sprint",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Sprint ze startu",
          "en": "Sprint from a start",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_sprint": {
    "profiles": {
      "c5273da3c34a9798": {
        "id": "act_sprint",
        "cz": "Sprint",
        "en": "Sprinting",
        "pat": "prenos",
        "S": 4,
        "C": 3,
        "J": {
          "kot": 2,
          "kol": 2,
          "kyc": 2
        },
        "pop": 2,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "ham",
          "glu",
          "qua"
        ],
        "ms": [
          "cal",
          "abs"
        ],
        "dot": [
          38,
          104
        ],
        "ez": "act_run",
        "hd": null,
        "foc": [
          "Krátce, naplno, s plnou pauzou mezi úseky.",
          "Short, full effort, full rest between."
        ],
        "pos": [
          "Rozběhni se, plnou rychlost drž jen v označeném úseku.",
          "Build up. Hold full speed only inside the marked stretch."
        ],
        "exe": [
          "Úsek naplno, pak úplné zklidnění, teprve pak další.",
          "One stretch at full effort, then calm all the way down before the next."
        ],
        "wat": [
          "Nikdy bez rozehřátí. Hamstringy to promíjejí nejmíň ze všeho.",
          "Never without a warm-up. The hamstrings forgive this least of all."
        ]
      }
    },
    "edits": {
      "cz": "Sprint s rozběhem",
      "en": "Sprint with a run-up",
      "pos": [
        "Před rychlými úseky se postupně rozehřej chůzí nebo lehkým během a několika plynulými zrychleními. Vyber rovnou, neklouzavou dráhu bez provozu s dostatkem místa pro doběh. Obuv zvol podle povrchu. Předem si urč začátek a konec rychlého úseku, oddělený prostor na rozběh i doběh. Stačí jasné orientační body mimo dráhu.",
        "Before fast bouts, warm up gradually with walking or easy running and several progressive accelerations. Choose a level, non-slip route away from traffic with enough room to slow down. Use footwear suited to the surface. Identify the beginning and end of the fast section, with separate room for the run-up and slowing down. Clear landmarks outside the running path are enough."
      ],
      "exe": [
        "Plynule se rozběhni a zvolenou vysokou rychlost drž v určeném úseku. Za jeho koncem postupně zpomal do chůze. Před dalším úsekem si odpočiň tak, abys znovu zvládl rychlost a kontrolu; maximální úsilí za každou cenu není podmínkou.",
        "Build speed smoothly and maintain the chosen high speed through the defined section. Gradually slow to a walk beyond its end. Rest until you can repeat the speed with control; all-out effort at any cost is not required."
      ],
      "wat": [
        "Při bolesti, ztrátě kontroly nebo poklesu rychlosti úsek ukonči. Pauzu prodluž podle zotavení; odpočet v aplikaci není pokyn znovu vyběhnout. Zkracování pauz ani běh do vyčerpání nejsou cílem rychlostního úkolu.",
        "End the bout if you have pain, lose control or cannot maintain speed. Extend rest according to recovery; the app timer is not an instruction to start again. Shorter rests and running to exhaustion are not the aim of this speed task."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas rychlého úseku a poznamenej délku rozběhu. Pokud do záznamu zahrnuješ rozběh nebo pauzy, výslovně to uveď a při porovnávání používej stejný způsob. Starší záznamy mohou mít jiné vymezení.",
        "Record the distance and time of the fast section and note the run-up distance. If your record includes the run-up or rests, state that explicitly and use the same definition for comparisons. Earlier records may use a different definition."
      ],
      "pro": [
        "Lehčí: kratší úseky a nižší rychlost s dostatečným zotavením. Náročnější: podle plánu postupně měň rychlost nebo délku při zachované kontrole. Nejdřív si osvoj rychlejší běh; běh do kopce je odlišná podmínka, ne povinná další úroveň.",
        "Easier: shorter bouts at lower speed with enough recovery. Harder: gradually adjust speed or distance as planned while maintaining control. First become comfortable with faster running; uphill running is a different condition, not a required next level."
      ],
      "source": {
        "author": "NSCA; Human Kinetics",
        "document": "Sprinting Mechanics and Technique; Designing Speed Training Sessions",
        "url": "https://www.nsca.com/education/articles/kinetic-select/sprinting-mechanics-and-technique/",
        "scope": "Local practical adaptation of publicly available NSCA book excerpts on starting, acceleration, deceleration and quality with adequate recovery. Not an official NSCA lesson or copied programme. No universal angles, foot-strike rule, weekly volume, rest duration, injury guarantee or superiority claim. Stable identity and existing recording retained."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "B",
    "art": {
      "appId": "act_sprint",
      "atlasId": "act_sprint",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "1adf59dfe45afecc701be682844fff4795cc17ca5e5ef0aedf67b5f892f3dbb7",
        "thumb": "/unified-atlas/act_sprint-42aae0dab0036157-thumb.webp",
        "detail": "/unified-atlas/act_sprint-69ac329c18928fff-detail.webp",
        "inkThumb": "/unified-atlas/act_sprint-ca0d7e84d3b6bb40-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_sprint-21581a2a8d33409d-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_sprint-fb78d1f7946b1b69-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_sprint-eaa9d7115402cbe4-fillDetail.webp"
      },
      "sourceSha256": "1adf59dfe45afecc701be682844fff4795cc17ca5e5ef0aedf67b5f892f3dbb7",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_sprint",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false,
      "defaultRestSec": 180
    },
    "publicDefaults": {
      "c5273da3c34a9798": {
        "before": {
          "cz": "Sprint",
          "en": "Sprinting",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Sprint s rozběhem",
          "en": "Sprint with a run-up",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_bike": {
    "profiles": {
      "37475aa758ffc0b0": {
        "id": "act_bike",
        "cz": "Kolo",
        "en": "Cycling",
        "pat": "prenos",
        "S": 2,
        "C": 1,
        "J": {
          "kol": 1
        },
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu"
        ],
        "ms": [
          "ham",
          "cal"
        ],
        "dot": [
          28,
          106
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Kolena mají jít nahoru a dolů, ne do stran.",
          "The knees travel up and down, not side to side."
        ],
        "pos": [
          "Sedlo ve výšce, kde koleno dole zůstává lehce pokrčené.",
          "Saddle at a height where the knee stays slightly bent at the bottom."
        ],
        "exe": [
          "Drž kadenci, u které nohy nezatuhnou. Kopce jsou intenzita.",
          "Hold a cadence where the legs do not seize. Hills are the intensity."
        ],
        "wat": [
          "Dlouhý sed potřebuje protaženou kyčel po cestě domů.",
          "A long ride wants the hips opened up afterwards."
        ]
      }
    },
    "edits": {
      "pos": [
        "Zkontroluj jízdní kolo a vyber trasu odpovídající zkušenostem. Sedlo a dosah k řídítkům nastav tak, abys pohodlně šlapal a ovládal brzdy. Použij vhodnou obuv a cyklistickou přilbu.",
        "Check the bicycle and choose a route suited to your experience. Adjust the saddle and reach so you can pedal comfortably and operate the brakes. Use suitable footwear and a cycling helmet."
      ],
      "exe": [
        "Začni lehce a řaď podle terénu. Šlapej plynule tempem, které zvládáš udržet; při zatáčení, brzdění a v provozu má přednost kontrola kola. Kopce nejsou podmínkou tréninku.",
        "Start easily and choose gears for the terrain. Pedal smoothly at a manageable effort; control of the bicycle comes first when turning, braking and riding in traffic. Hills are not a training requirement."
      ],
      "wat": [
        "Nenuť kolena ani chodidla do jediné předepsané polohy. Při bolesti, brnění nebo nepohodlném sedu uprav nastavení či udělej přestávku. Po každé jízdě není povinné konkrétní protažení.",
        "Do not force your knees or feet into one prescribed alignment. Adjust the setup or take a break for pain, tingling or saddle discomfort. No particular stretch is required after every ride."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas; do poznámky můžeš uvést trasu, převýšení a typ kola. Záznam z případného trenažéru označ zvlášť, protože nemusí být s jízdou venku srovnatelný.",
        "Record distance and time; you can note the route, elevation and bicycle type. Label any trainer-based session separately, since its figures may not be comparable with an outdoor ride."
      ],
      "pro": [
        "Lehčí: kratší známá rovná trasa a lehčí převod. Náročnější: postupně uprav dobu, terén nebo tempo podle cíle. Bezpečné ovládání kola má přednost před intenzitou.",
        "Easier: a shorter familiar flat route and an easier gear. Harder: gradually adjust duration, terrain or pace to the goal. Control of the bicycle takes priority over intensity."
      ],
      "source": {
        "author": "British Cycling",
        "document": "DIY road and mountain bike fit",
        "url": "https://cloud.britishcycling.org.uk/knowledge/article/izn20131217-DIY-Road-and-Mountain-Bike-Fit-0",
        "scope": "Contact-point setup for a bicycle; starting point rather than a universal exact knee angle or forced cadence. Does not support mandatory hip stretching after every ride."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "bicycle"
        ],
        [
          "cycling_route"
        ]
      ],
      "priority": 0
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "C",
    "art": {
      "appId": "act_bike",
      "atlasId": "act_bike",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "f10c9ad2f223a51afb52d74a97453d80a852fc71b7a11bd495dce94c2bda6ef5",
        "thumb": "/unified-atlas/act_bike-ee82f8f9b4eca112-thumb.webp",
        "detail": "/unified-atlas/act_bike-fd55c3048cc7b39e-detail.webp",
        "inkThumb": "/unified-atlas/act_bike-8c0832aa07876b11-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_bike-9b83beb674a936c6-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_bike-b3c3567ae1e8ca2e-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_bike-78aed88bdf3e3fc8-fillDetail.webp"
      },
      "sourceSha256": "f10c9ad2f223a51afb52d74a97453d80a852fc71b7a11bd495dce94c2bda6ef5",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_bike",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "bicycle"
        ],
        [
          "cycling_route"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "37475aa758ffc0b0": {
        "before": {
          "cz": "Kolo",
          "en": "Cycling",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Kolo",
          "en": "Cycling",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_airbike": {
    "profiles": {
      "e4f9dc577ecfc24e": {
        "id": "act_airbike",
        "cz": "Air bike",
        "en": "Air Bike",
        "pat": "prenos",
        "S": 3,
        "C": 1,
        "J": {
          "kol": 1
        },
        "pop": 2,
        "eq": [
          "stroj"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu",
          "sho"
        ],
        "ms": [
          "upb",
          "ham",
          "abs"
        ],
        "dot": [
          30,
          108
        ],
        "ez": "act_bike",
        "hd": null,
        "foc": [
          "Ruce a nohy dělají práci současně. Proto to bolí dřív.",
          "Arms and legs work at once. That is why it bites sooner."
        ],
        "pos": [
          "Sedlo nastavené jako na kole, madla v rukou.",
          "Saddle set as on a bike, handles in the hands."
        ],
        "exe": [
          "Drž stálé tempo po celý úsek, ne první čtvrtinu naplno.",
          "Hold a steady pace for the whole interval, not full effort for the first quarter."
        ],
        "wat": [
          "Krátké úseky s poctivou pauzou dají víc než jeden dlouhý.",
          "Short intervals with an honest rest give more than one long grind."
        ]
      }
    },
    "edits": {
      "pos": [
        "Použij air bike s ventilátorem a pohyblivými madly. Podle návodu zajisti nastavení sedla; vsedě musíš dosáhnout na pedály i madla. Obuj se a nech volný prostor kolem pohyblivých částí.",
        "Use a fan-resistance air bike with moving handles. Secure the saddle adjustment according to its manual; you must reach both pedals and handles while seated. Wear shoes and keep clear of moving parts."
      ],
      "exe": [
        "Vsedě souvisle šlapej a střídavě tlač a přitahuj madla. Začni zvolna, potom přizpůsob úsilí danému úseku. Před sesednutím nech pedály i madla zastavit.",
        "While seated, pedal continuously and alternate pushing and pulling the handles. Begin gently, then match the effort to the planned bout. Let the pedals and handles stop before dismounting."
      ],
      "wat": [
        "Dlouhá klidná jízda i intervaly mohou mít své místo; kratší úseky nejsou automaticky lepší. Neměň nastavení za pohybu a u jiného modelu se řiď jeho návodem.",
        "Easy continuous work and intervals can both have a purpose; shorter bouts are not automatically better. Do not adjust the machine while moving, and follow the manual for the model you use."
      ],
      "foc": [
        "Tato karta zapisuje čas. Tempo, odporový charakter konkrétního stroje a strukturu přestávek si poznamenej podle potřeby; displej různých modelů nemusí ukazovat srovnatelné hodnoty.",
        "This entry records duration. Note the pace, machine characteristics and rest structure when useful; displays on different models may not provide comparable figures."
      ],
      "pro": [
        "Lehčí: menší úsilí a kratší úsek na stejném stroji. Náročnější: podle plánu uprav dobu nebo intenzitu. Jízda na kole je alternativa, ne povinný předstupeň.",
        "Easier: a gentler effort and shorter bout on the same machine. Harder: adjust duration or intensity to the plan. Cycling is an alternative, not a required preceding level."
      ],
      "ez": null,
      "source": {
        "author": "Assault Fitness",
        "document": "ASSAULTBIKE PRO — Technical Specifications & Use Guidelines, 23-AS-937, 02 June 2021",
        "url": "https://perform-better.de/media/26/59/1d/1630669215/Assault%20Bike%20Pro%20Tech%20Spec%20and%20Use%20Guide.pdf",
        "scope": "Manufacturer primary document hosted by a retailer. Supports seated use, secured seat adjustment, moving pedals/handles, shoes and stopping before dismount. Model-specific details are not claimed universal for every air bike; no interval superiority or clinical claim is imported."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "machine"
      ],
      "equipmentRequirements": [
        [
          "air_bike"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "segment": "C",
    "art": {
      "appId": "act_airbike",
      "atlasId": "act_airbike",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "069a182a41444fe464e72bd40f45a68a176c93ca4da5304084eb1eef3c8a10a1",
        "thumb": "/unified-atlas/act_airbike-ef43a98890e1388b-thumb.webp",
        "detail": "/unified-atlas/act_airbike-7454abf6bdb37f2a-detail.webp",
        "inkThumb": "/unified-atlas/act_airbike-3cf9446a2d9ccff7-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_airbike-861390d10010f096-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_airbike-1ee6d9c4aff61274-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_airbike-9c33af00cb5c3d79-fillDetail.webp"
      },
      "sourceSha256": "069a182a41444fe464e72bd40f45a68a176c93ca4da5304084eb1eef3c8a10a1",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_airbike",
      "measurementType": "DURATION",
      "loadMode": "ext",
      "sideMode": "none",
      "requirements": [
        [
          "air_bike"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "e4f9dc577ecfc24e": {
        "before": {
          "cz": "Air bike",
          "en": "Air Bike",
          "measurementType": "DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Air bike",
          "en": "Air Bike",
          "measurementType": "DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_swim": {
    "profiles": {
      "17af596174153758": {
        "id": "act_swim",
        "cz": "Plavání",
        "en": "Swimming",
        "pat": "prenos",
        "S": 2,
        "C": 3,
        "J": {
          "ram": 1
        },
        "pop": 3,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "upb",
          "sho"
        ],
        "ms": [
          "abs",
          "glu",
          "qua"
        ],
        "dot": [
          46,
          98
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Dech je součást techniky, ne přerušení.",
          "The breath is part of the technique, not an interruption."
        ],
        "pos": [
          "Tělo vodorovně u hladiny, hlava v prodloužení páteře.",
          "Body level at the surface, head in line with the spine."
        ],
        "exe": [
          "Plav úseky se stejným počtem záběrů. Tam je pokrok vidět.",
          "Swim lengths with a steady stroke count. That is where progress shows."
        ],
        "wat": [
          "Rameno se přetěžuje tichem. Bolest v rameni je stop, ne výzva.",
          "The shoulder overloads quietly. Shoulder pain is a stop, not a challenge."
        ]
      }
    },
    "edits": {
      "pos": [
        "Vyber místo určené k plavání a styl, který ovládáš. Respektuj hloubku, podmínky a pravidla; neplav sám. Pro začátky je vhodná výuka v bazénu s dohledem.",
        "Choose a swimming venue and a stroke you can perform. Respect the depth, conditions and local rules; do not swim alone. Supervised pool instruction is a suitable starting point."
      ],
      "exe": [
        "Plav zvládnutelné úseky s dechem odpovídajícím zvolenému stylu. Přestávky zařaď podle potřeby. Poloha těla a práce paží i nohou se mezi kraulem, znakem, prsy a motýlkem liší.",
        "Swim manageable bouts with breathing suited to the chosen stroke. Rest when needed. Body position and arm and leg actions differ between front crawl, backstroke, breaststroke and butterfly."
      ],
      "wat": [
        "Stejný počet záběrů není povinným měřítkem pokroku. Při potížích zastav a bezpečně opusť vodu. Volná voda vyžaduje samostatné posouzení podmínek a odpovídající vybavení; není zaměnitelná s bazénem.",
        "A fixed stroke count is not a required measure of progress. Stop and leave the water safely if you have difficulty. Open water requires a separate assessment of conditions and appropriate equipment; it is not interchangeable with a pool."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas; do poznámky přidej styl a prostředí. Obrázek ukazuje příklad kraulu, nikoli závaznou techniku všech plaveckých stylů.",
        "Record distance and time; note the stroke and setting. The illustration shows a front-crawl example, not a technique prescribed for every swimming stroke."
      ],
      "pro": [
        "Lehčí: kratší úsek známým stylem, přestávky nebo výuka potřebné dovednosti. Náročnější: postupně uprav celkový objem či tempo při zachované kontrole. Jiný styl ani přechod do volné vody nejsou povinnou progresí.",
        "Easier: shorter bouts using a familiar stroke, rests or instruction in the skill you need. Harder: gradually adjust total volume or pace while maintaining control. A different stroke or moving to open water is not a required progression."
      ],
      "source": {
        "author": "Swim England",
        "document": "Tips for learning the four swimming strokes; Water Safety Code",
        "url": "https://www.swimming.org/learntoswim/learning-the-four-swimming-strokes/",
        "scope": "Swimming covers distinct strokes with different mechanics; a front-crawl drawing does not redefine this general activity. Water-safety context separately checked at https://www.swimming.org/learntoswim/water-safety-code/ . No fixed stroke-count target, shoulder-overload diagnosis or universal stroke-specific muscle ranking is asserted."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [],
      "supports": [],
      "equipmentRequirements": [
        [
          "swimming_venue"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "C",
    "art": {
      "appId": "act_swim",
      "atlasId": "act_swim",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "c6cd4f1d12cffb9ec5e78b9e2169ff3d0447c7d042f8ee9fc8a9dfd4ccff5abd",
        "thumb": "/unified-atlas/act_swim-746b8e06d6c5aee0-thumb.webp",
        "detail": "/unified-atlas/act_swim-3a44507322a5083e-detail.webp",
        "inkThumb": "/unified-atlas/act_swim-88c194e3c83c2ea3-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_swim-071541efe9118e24-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_swim-5b635ac047861695-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_swim-545f7698226e2437-fillDetail.webp"
      },
      "sourceSha256": "c6cd4f1d12cffb9ec5e78b9e2169ff3d0447c7d042f8ee9fc8a9dfd4ccff5abd",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_swim",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "swimming_venue"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "17af596174153758": {
        "before": {
          "cz": "Plavání",
          "en": "Swimming",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Plavání",
          "en": "Swimming",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_climb": {
    "profiles": {
      "922e08096bb19852": {
        "id": "act_climb",
        "cz": "Lezení",
        "en": "Climbing",
        "pat": "tah",
        "S": 3,
        "C": 4,
        "J": {
          "lok": 2,
          "ram": 2,
          "zap": 2
        },
        "pop": 2,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "upb",
          "fore",
          "bic"
        ],
        "ms": [
          "abs",
          "sho",
          "qua"
        ],
        "dot": [
          90,
          114
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Nohy nesou váhu. Ruce jen drží směr.",
          "The feet carry the weight. The hands only hold the line."
        ],
        "pos": [
          "Boky blízko stěny, paže spíš napnuté než skrčené.",
          "Hips close to the wall, arms straight rather than bent."
        ],
        "exe": [
          "Lez v blocích s pauzou. Prsty potřebují pauzu dřív než ty.",
          "Climb in blocks with rest. The fingers need rest before you do."
        ],
        "wat": [
          "Prsty a lokty se budují roky. Objem přidávej opatrně.",
          "Fingers and elbows are built over years. Add volume carefully."
        ]
      }
    },
    "edits": {
      "pos": [
        "Nejdřív určete disciplínu a prostředí: bouldering, lezení s lanem nebo jiné lezení. Vybavení, jištění, dopadovou plochu a potřebné dovednosti ověř podle daného pracoviště či kurzu. Samotná tato karta je neurčuje.",
        "First identify the discipline and setting: bouldering, roped climbing or another form of climbing. Check the equipment, protection, landing area and skills with the venue or course. This general entry does not specify them."
      ],
      "exe": [
        "Vyber obtížnost odpovídající zkušenostem a používej naučenou techniku. Mezi pokusy odpočívej. Práce nohou, úchop, poloha boků i ohnutí paží se mění podle konkrétního kroku a sklonu.",
        "Choose a difficulty suited to your experience and use the technique you have learned. Rest between attempts. Footwork, grip, hip position and arm bend vary with the move and wall angle."
      ],
      "wat": [
        "Návod nenahrazuje výuku jištění ani dopadů. Před každým pokusem dodrž kontroly dané disciplíny; při únavě či bolesti obtížnost sniž nebo skonči. Matrace ani pouhá přítomnost lana nezaručují bezpečí.",
        "These notes do not replace instruction in belaying or landings. Follow the checks for the discipline before each attempt; reduce difficulty or stop with fatigue or pain. Mats or the mere presence of a rope do not guarantee safety."
      ],
      "foc": [
        "Zapisuj čas ve stejném rozsahu jako dosud. Do poznámky uveď disciplínu, obtížnost a zda čas zahrnuje přestávky. Obrázek je boulderingový příklad; neukazuje úplnou výbavu pro všechny druhy lezení.",
        "Keep the same duration-recording convention as before. Note the discipline, difficulty and whether rests are included. The illustration is a bouldering example; it does not show the complete equipment for every form of climbing."
      ],
      "pro": [
        "Lehčí: snazší kroky v rámci naučené disciplíny a více odpočinku. Náročnější: postupně uprav obtížnost nebo objem podle zkušeností. Přechod na lano, venkovní skálu či jiný způsob jištění potřebuje samostatné dovednosti.",
        "Easier: easier moves within a discipline you have learned and more rest. Harder: gradually adjust difficulty or volume to your experience. Moving to ropes, outdoor rock or another protection system requires separate skills."
      ],
      "source": {
        "author": "British Mountaineering Council",
        "document": "Climbing Wall Safety Resources; Five steps to start climbing",
        "url": "https://www.thebmc.co.uk/en/climbing-wall-safety-resources",
        "scope": "Bouldering, roped climbing and auto-belay use have different safety requirements. General activity is retained; a bouldering illustration is not evidence of the logged discipline or a complete safety system. Introductory instruction separately checked at https://thebmc.co.uk/en/five-steps-to-start-climbing-indoor-outdoor-beginner ."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [],
      "supports": [],
      "equipmentRequirements": [
        [
          "climbing_venue"
        ],
        [
          "unknown_equipment"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "C",
    "art": {
      "appId": "act_climb",
      "atlasId": "act_climb",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ed657c7d865f6cc03feda5f96a1f7b3ccf834ceba085d14772ffc88433dfdef7",
        "thumb": "/unified-atlas/act_climb-5c1ce7e0287d61e6-thumb.webp",
        "detail": "/unified-atlas/act_climb-bf848b39300218ff-detail.webp",
        "inkThumb": "/unified-atlas/act_climb-9d30fa2fea24c091-inkThumb.webp",
        "inkDetail": "/unified-atlas/act_climb-5839e2990c1822e9-inkDetail.webp",
        "fillThumb": "/unified-atlas/act_climb-2f0767476ab1794c-fillThumb.webp",
        "fillDetail": "/unified-atlas/act_climb-9e533a8f35ae381f-fillDetail.webp"
      },
      "sourceSha256": "ed657c7d865f6cc03feda5f96a1f7b3ccf834ceba085d14772ffc88433dfdef7",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "act_climb",
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "climbing_venue"
        ],
        [
          "unknown_equipment"
        ]
      ],
      "unknown": true,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "922e08096bb19852": {
        "before": {
          "cz": "Lezení",
          "en": "Climbing",
          "measurementType": "DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Lezení",
          "en": "Climbing",
          "measurementType": "DURATION",
          "defaultRestSec": 180,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "act_elliptical": {
    "profiles": {
      "8c656f85fd23ad90": {
        "id": "act_elliptical",
        "cz": "Eliptický trenažér",
        "en": "Elliptical",
        "pat": "prenos",
        "S": 1,
        "C": 1,
        "J": {},
        "pop": 2,
        "eq": [
          "stroj"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu"
        ],
        "ms": [
          "ham",
          "cal",
          "upb"
        ],
        "dot": [
          26,
          104
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Bez dopadů. Proto se hodí, když kotníky nebo kolena potřebují klid.",
          "No impact. That is why it fits when the ankles or knees want quiet."
        ],
        "pos": [
          "Vzpřímený trup, celá chodidla na plošinách.",
          "Tall torso, whole feet on the pedals."
        ],
        "exe": [
          "Odpor nastav tak, aby nohy tlačily, ne jen doprovázely.",
          "Set the resistance so the legs push rather than follow."
        ],
        "wat": [
          "Nedrž se madel křečovitě. Ruce mají pracovat, nebo být volně.",
          "Do not grip the handles hard. The arms either work or hang free."
        ]
      }
    },
    "edits": {
      "en": "Elliptical trainer",
      "pos": [
        "Použij eliptický trenažér a obuv podle jeho návodu. Při nastupování drž pevná madla, pokud jsou k dispozici, a postupuj podle pokynů stroje. Chodidla polož na pedály a začni zvolna.",
        "Use an elliptical trainer and the footwear specified in its manual. Hold stationary handles when available while mounting and follow the machine instructions. Place your feet on the pedals and start gently."
      ],
      "exe": [
        "Plynule pohybuj pedály ve vedené dráze. Pohyblivá madla zapoj, pokud je daný model má a zvládáš je ovládat. Odpor a tempo přizpůsob cíli; před sesednutím zcela zastav.",
        "Move the pedals smoothly along their guided path. Use the moving handles if the model has them and you can control them. Match resistance and pace to your goal; come to a full stop before dismounting."
      ],
      "wat": [
        "Pevná madla můžeš používat pro stabilitu. Chodidla zůstávají na pedálech, ale to samo nezaručuje vhodnost při bolesti kolen nebo kotníků. Při nepohodlí uprav nastavení či skonči.",
        "You may use the stationary handles for stability. Your feet remain on the pedals, but that alone does not establish suitability for painful knees or ankles. Adjust the setup or stop if it is uncomfortable."
      ],
      "foc": [
        "Zapisuj čas a případnou vzdálenost podle dosavadního záznamu. Poznamenej model a nastavení; údaj vzdálenosti na stroji není přímo zaměnitelný s chůzí, během ani jiným trenažérem.",
        "Record duration and any distance using your existing convention. Note the model and settings; machine distance is not directly interchangeable with walking, running or another trainer."
      ],
      "pro": [
        "Lehčí: pomalejší tempo, nižší odpor nebo kratší úsek s pevnou oporou rukou. Náročnější: postupně uprav dobu či odpor při plynulém pohybu. Puštění madel není povinným cílem.",
        "Easier: a slower pace, less resistance or a shorter bout with stationary hand support. Harder: gradually adjust duration or resistance while moving smoothly. Letting go of the handles is not a required goal."
      ],
      "source": {
        "author": "Life Fitness",
        "document": "How to Mount and Dismount Your Atmos Elliptical Safely",
        "url": "https://support.lifefitness.com/hc/en-us/articles/42861901438359-How-to-Mount-and-Dismount-Your-Atmos-Elliptical-Safely",
        "scope": "Manufacturer guidance for a named cross-trainer: stable hand support for entry/exit, controlled stop and footwear. Apply the actual machine manual; specific clearance or brake features are not generalized. No guarantee for painful knees/ankles or comparison of machine distance with outdoor distance."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "machine"
      ],
      "equipmentRequirements": [
        [
          "elliptical_trainer"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "segment": "C",
    "art": {
      "appId": "act_elliptical",
      "atlasId": "act_elliptical",
      "unified": true,
      "contourOnly": true,
      "darkOutline": true,
      "sourceSha256": "f4d03e8b24166737eacfffa4baff6e7442d2c8db2ce75042b2f343dbe2b13ad3",
      "primary": {
        "width": 960,
        "height": 960,
        "thumb": "/movement-audit/locomotion-elliptical-v1-f4d03e8b2416-256.webp",
        "inkThumb": "/movement-audit/locomotion-elliptical-v1-f4d03e8b2416-256.webp",
        "detail": "/movement-audit/locomotion-elliptical-v1-f4d03e8b2416-960.webp",
        "inkDetail": "/movement-audit/locomotion-elliptical-v1-f4d03e8b2416-960.webp",
        "sourceSha256": "f4d03e8b24166737eacfffa4baff6e7442d2c8db2ce75042b2f343dbe2b13ad3"
      }
    },
    "policy": {
      "id": "act_elliptical",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "ext",
      "sideMode": "none",
      "requirements": [
        [
          "elliptical_trainer"
        ]
      ],
      "unknown": false,
      "explicitTarget": false,
      "manualProgression": false,
      "manualWarmup": false,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "8c656f85fd23ad90": {
        "before": {
          "cz": "Eliptický trenažér",
          "en": "Elliptical",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Eliptický trenažér",
          "en": "Elliptical trainer",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 0,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "sled": {
    "profiles": {
      "dceea56666b10cc3": {
        "id": "sled",
        "cz": "Chůze pozadu / sáně",
        "en": "Backward Walk / Sled",
        "pat": "prenos",
        "S": 2,
        "C": 1,
        "J": {
          "kot": 1
        },
        "pop": 2,
        "eq": [
          "prostor"
        ],
        "mode": "sec",
        "mp": [
          "qua"
        ],
        "ms": [
          "cal",
          "glu"
        ],
        "dot": [
          40,
          100
        ],
        "ez": null,
        "hd": "sprint",
        "cat": "kond",
        "rec": 1,
        "foc": [
          "Malá excentrická složka, a proto obvykle malá bolavost. Snese se častěji než klasický dřep.",
          "A small eccentric component, so usually little soreness. It tolerates more frequency than an ordinary squat."
        ],
        "pos": [
          "Sáně se zátěží, nebo pás pozadu, nebo prostě chůze pozadu do kopce.",
          "A loaded sled, a treadmill in reverse, or simply walking backwards uphill."
        ],
        "exe": [
          "Jdi pozadu krátkými kroky, koleno se ohýbá. 3–5 minut.",
          "Walk backwards in short steps, letting the knee bend. Three to five minutes."
        ],
        "wat": [
          "Koleno drž ve směru špičky a dávku uprav podle tolerance. Bolest není signál k přetlačení.",
          "Keep the knee tracking the toes and set the dose by tolerance. Pain is not a signal to push through."
        ],
        "pro": [
          "Přidávej vzdálenost nebo odpor. Chůze pozadu a sáně jsou jedna z možností zatížení nohou s malou excentrickou složkou.",
          "Add distance or resistance. Backwards walking and the sled are one way to load the legs with little eccentric work."
        ]
      }
    },
    "edits": {
      "pos": [
        "Tato společná karta zahrnuje chůzi pozadu bez zátěže, tažení saní pozadu i dříve používanou variantu na pásu nebo do kopce. Nejdřív si v plánu urč konkrétní variantu a poznamenej ji. Pro chůzi zvol volnou, neklouzavou trasu a podle potřeby pevnou oporu. Pro sáně potřebuješ vhodnou dráhu, tažný úchyt a správně připojený popruh s madly nebo tažný pás či úvaz. Varianta na pásu vyžaduje zařízení, které ji dovoluje, a znalost jeho ovládání; tyto varianty nejsou vzájemně zaměnitelné.",
        "This shared card covers unloaded backward walking, backward sled dragging and previously used treadmill or uphill variants. First specify the exact variant in your plan and note it. For walking, use a clear, non-slip route and a stable support if needed. Sled work requires a suitable lane, tow attachment and correctly connected strap with handles or purpose-made towing belt or harness. A treadmill variant requires a machine that permits it and familiarity with its controls; these variants are not interchangeable."
      ],
      "exe": [
        "Pohybuj se pozadu krátkými, kontrolovanými kroky. U saní stůj čelem k nim, nejdřív plynule napni popruh a pak ustupuj; netahej škubnutím. Dodrž vybraný čas nebo vzdálenost podle plánu. Před otočením zastav a zkontroluj další směr; při ztrátě kontroly úsek ukonči.",
        "Move backward with short, controlled steps. With a sled, face it, take up the slack smoothly and then step backward; do not jerk the strap. Follow the time or distance chosen in the plan. Stop and check the next direction before turning; end the bout if control is lost."
      ],
      "wat": [
        "Předem ověř prostor za sebou. Pokud pro chůzi potřebuješ oporu, udrž ji na dosah; odpor ani náročný povrch nenahrazují jistotu kroku. Při bolesti nebo nejistotě zastav a uprav úkol. Sáně, pás a chůze bez zátěže mají jiné podmínky; tato karta sama neurčuje vhodnost každé z nich.",
        "Check the route behind you first. If you need support for walking, keep it within reach; resistance or a difficult surface does not replace secure footing. Stop and adjust the task if there is pain or instability. Sleds, treadmills and unloaded walking have different conditions; this card alone does not establish suitability for each."
      ],
      "foc": [
        "Zapisuj čas úseku v sekundách; variantu, délku trasy a podmínky připiš do poznámky. U saní uveď použitý model a zda kilogramy znamenají jen přidané kotouče, nebo sáně i kotouče. U chůze bez zátěže nevymýšlej hodnotu kilogramů. Zachovej svůj dosavadní způsob zápisu a nejasné staré záznamy nepřepočítávej. Porovnávej stejné podmínky; delší čas na stejné vzdálenosti sám není zlepšení. Kroky střídají nohy, tato karta však nemá oddělené série pro pravou a levou stranu.",
        "Record the bout time in seconds; note the variant, route distance and conditions. With a sled, specify the model and whether kilograms mean added plates only or the sled plus plates. For unloaded walking, do not invent a kilogram value. Keep your existing convention and do not convert unclear earlier records. Compare consistent conditions; more time over the same distance is not an improvement by itself. Steps alternate legs, but this card does not use separate right and left sets."
      ],
      "pro": [
        "Lehčí: pomalejší nebo kratší chůze po rovné trase, případně s vhodnou oporou. Další úpravu zvol pro konkrétní variantu a cíl. Přechod k saním, kopci či pásu není povinná progrese a sprint není automatický další krok.",
        "Easier: slower or shorter walking on a level route, with suitable support if needed. Choose further changes for the specific variant and goal. Moving to a sled, hill or treadmill is not a required progression, and sprinting is not an automatic next step."
      ],
      "hd": null,
      "source": {
        "author": "NSCA; South Tees Hospitals NHS; equipment manufacturers; Linthorne & Cooper",
        "document": "Local practical adaptation: sled setup, controlled travel and comparable recording",
        "url": "https://www.nsca.com/contentassets/b882050c0aa44223b738f4e43e692297/coach1.4-enhancing_motor_learning_with_sled_training.pdf",
        "scope": "Tanmay synthesis, not an official NSCA lesson or copied programme. Sources substantiate equipment, task distinctions and surface-dependent resistance. No universal load/dose, injury prevention, knee treatment, low-soreness or superiority claim. Original identities and recording retained. Broad historical identity retained; NHS walking example is not approval of loaded sled or treadmill variants."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [],
      "equipmentRequirements": [
        [
          "unknown_equipment"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "D",
    "art": {
      "appId": "sled",
      "atlasId": "sled",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "bc6edb9469cee7bbeb41369c5c4a455025ed0f9645feff160ab9c5a31d54db50",
        "thumb": "/unified-atlas/sled-655899a6a5ca4a46-thumb.webp",
        "detail": "/unified-atlas/sled-ccdaa8905afefee2-detail.webp",
        "inkThumb": "/unified-atlas/sled-87c6418adfd52f95-inkThumb.webp",
        "inkDetail": "/unified-atlas/sled-2b93b8c7edfb7c8d-inkDetail.webp",
        "fillThumb": "/unified-atlas/sled-707a2c5e396f3ce2-fillThumb.webp",
        "fillDetail": "/unified-atlas/sled-895d12e85a0197db-fillDetail.webp"
      },
      "sourceSha256": "bc6edb9469cee7bbeb41369c5c4a455025ed0f9645feff160ab9c5a31d54db50",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "sled",
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "unknown_equipment"
        ]
      ],
      "unknown": true,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "dceea56666b10cc3": {
        "before": {
          "cz": "Chůze pozadu / sáně",
          "en": "Backward Walk / Sled",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Chůze pozadu / sáně",
          "en": "Backward Walk / Sled",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "sledpush": {
    "profiles": {
      "6c334f21000ee7dc": {
        "id": "sledpush",
        "cz": "Tlačení saní",
        "en": "Sled Push",
        "pat": "prenos",
        "S": 3,
        "C": 1,
        "J": {
          "kot": 1
        },
        "pop": 2,
        "eq": [
          "prostor",
          "stroj"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu"
        ],
        "ms": [
          "cal",
          "abs"
        ],
        "dot": [
          44,
          104
        ],
        "ez": "sled",
        "hd": null,
        "foc": [
          "Nízký trup, krátké kroky, stálý tlak.",
          "Low torso, short steps, steady pressure."
        ],
        "pos": [
          "Ruce na madlech, paže napnuté, tělo v šikmé linii.",
          "Hands on the handles, arms straight, body in one diagonal line."
        ],
        "exe": [
          "Tlač krátkými kroky. Sáně se nesmí zastavit.",
          "Push with short steps. The sled does not stop."
        ],
        "wat": [
          "Krk zůstává v prodloužení páteře. Dýchej.",
          "The neck stays in line with the spine. Keep breathing."
        ]
      }
    },
    "edits": {
      "pos": [
        "Použij sáně s pevnými tlačnými madly na vhodné, volné dráze. Ověř povrch a uchycení případných kotoučů podle zařízení; i prázdné sáně kladou odpor. Uchop obě madla, paže nech pevné a trup nakloň ve směru tlaku tak, abys udržel stabilní krok. Před pracovním úsekem vyzkoušej krátký lehčí průchod.",
        "Use a sled with fixed push handles on a suitable, clear lane. Check the surface and secure any plates as the equipment requires; an unloaded sled also provides resistance. Hold both handles, keep the arms firm and lean into the push enough to maintain stable steps. Before the working bout, try a short, easier pass."
      ],
      "exe": [
        "Tlač sáně vpřed střídavými krátkými kroky a plynulým tlakem do obou madel. Výšku úchopu a sklon trupu přizpůsob saním a odporu. Na konci vymezeného úseku kontrolovaně zastav. Pokud se sáně zastavují nebo se rozpadá krok, můžeš přerušit úsek a snížit odpor.",
        "Push the sled forward with alternating short steps and steady pressure through both handles. Adjust handle height and torso lean to the sled and resistance. Stop under control at the end of the defined bout. If the sled stalls or the steps lose control, pause the bout and reduce resistance."
      ],
      "wat": [
        "Udrž prostor před saněmi volný a dýchej průběžně. Nesnaž se pokračovat za každou cenu při bolesti, podkluzování nebo ztrátě opory. Před změnou směru zastav; nedávej ruce ani chodidla pod pohybující se sáně.",
        "Keep the path in front of the sled clear and breathe throughout. Do not force the bout through pain, slipping or loss of support. Stop before changing direction; keep hands and feet away from beneath the moving sled."
      ],
      "foc": [
        "Zapisuj čas úseku v sekundách. Délku trasy, směr, povrch a použité sáně připiš do poznámky; pro porovnání je drž stejné. U kilogramů vždy uveď, zda jde jen o přidané kotouče, nebo o sáně i kotouče. Dosavadní způsob zápisu zachovej; nejasné staré záznamy zpětně nepřepočítávej. Delší čas na stejné vzdálenosti sám o sobě není zlepšení. Obě ruce tlačí současně, kroky se střídají; nepočítej pravou a levou jako dvě série.",
        "Record the bout time in seconds. Note the route distance, direction, surface and sled, and keep them consistent for comparisons. For kilograms, state whether you record added plates only or the sled plus plates. Keep your existing convention; do not convert unclear earlier records. More time over the same distance is not an improvement by itself. Both hands push together while steps alternate; do not count right and left as two sets."
      ],
      "pro": [
        "Lehčí: nižší odpor nebo kratší úsek se stejnou kontrolou. Náročnější: podle cíle uprav jednu věc, například odpor nebo délku úseku. Změna povrchu či způsobu tahu mění podmínky; nepovažuj stejné kilogramy automaticky za stejnou náročnost.",
        "Easier: less resistance or a shorter bout with the same control. Harder: adjust one variable to suit the goal, such as resistance or bout length. A different surface or towing setup changes the task; equal kilograms do not automatically mean equal difficulty."
      ],
      "ez": null,
      "source": {
        "author": "NSCA; NCSF; equipment manufacturers; Linthorne & Cooper",
        "document": "Local practical adaptation: sled setup, controlled travel and comparable recording",
        "url": "https://www.nsca.com/contentassets/b882050c0aa44223b738f4e43e692297/coach1.4-enhancing_motor_learning_with_sled_training.pdf",
        "scope": "Tanmay synthesis, not an official NSCA lesson or copied programme. Sources substantiate equipment, task distinctions and surface-dependent resistance. No universal load/dose, injury prevention, knee treatment, low-soreness or superiority claim. Original identities and recording retained."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "training_sled_push"
        ],
        [
          "sled_lane"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "segment": "D",
    "art": {
      "appId": "sledpush",
      "atlasId": "sledpush",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "763c502e3fc9859ba5da53081a6a72302c50c2fdd8ac15f67f270ad752c4c706",
        "thumb": "/unified-atlas/sledpush-e74a0bd5027f9475-thumb.webp",
        "detail": "/unified-atlas/sledpush-3fb1e90088e9b802-detail.webp",
        "inkThumb": "/unified-atlas/sledpush-c2d9b26c707c362c-inkThumb.webp",
        "inkDetail": "/unified-atlas/sledpush-f2664960f70119af-inkDetail.webp",
        "fillThumb": "/unified-atlas/sledpush-e18c8f54bb1c2909-fillThumb.webp",
        "fillDetail": "/unified-atlas/sledpush-a50201fd9add5f54-fillDetail.webp"
      },
      "sourceSha256": "763c502e3fc9859ba5da53081a6a72302c50c2fdd8ac15f67f270ad752c4c706",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "sledpush",
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "ext",
      "sideMode": "none",
      "requirements": [
        [
          "training_sled_push"
        ],
        [
          "sled_lane"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "6c334f21000ee7dc": {
        "before": {
          "cz": "Tlačení saní",
          "en": "Sled Push",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Tlačení saní",
          "en": "Sled Push",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "sleddrag": {
    "profiles": {
      "7e1e23f3b1e25214": {
        "id": "sleddrag",
        "cz": "Tažení saní",
        "en": "Sled Drag",
        "pat": "prenos",
        "S": 3,
        "C": 1,
        "J": {
          "kot": 1
        },
        "pop": 2,
        "eq": [
          "prostor",
          "stroj"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "glu"
        ],
        "ms": [
          "ham",
          "upb",
          "fore"
        ],
        "dot": [
          40,
          106
        ],
        "ez": "sled",
        "hd": null,
        "foc": [
          "Táhni z nohou, ruce jen drží popruh.",
          "Pull with the legs. The hands only hold the strap."
        ],
        "pos": [
          "Popruh v rukou nebo přes pás, mírný záklon proti odporu.",
          "Strap in the hands or over a belt, a slight lean against the resistance."
        ],
        "exe": [
          "Jdi vpřed nebo pozadu stálým tempem.",
          "Walk forward or backward at a steady pace."
        ],
        "wat": [
          "Pozadu jdi kratšími kroky a dívej se přes rameno.",
          "Going backward, take shorter steps and look over the shoulder."
        ]
      }
    },
    "edits": {
      "pos": [
        "Použij sáně s tažným úchytem a vhodnou volnou dráhu. Zvol buď kompletní popruh s madly pro držení v rukou, nebo tažný pás či úvaz s popruhem; potřebuješ i spojky určené pro dané zatížení. Běžný opasek není automaticky tažný pás. Předem urč směr: při chůzi vpřed jsou sáně za tebou, při chůzi pozadu stojíš čelem k nim. Vyzkoušej krátký lehčí průchod.",
        "Use a sled with a tow attachment and a suitable clear lane. Choose either a complete strap with hand grips or a purpose-made towing belt or harness with a tow line; compatible load-rated connectors are also needed. An ordinary belt is not automatically a towing belt. Choose the direction first: the sled is behind you when walking forward, and you face it when walking backward. Try a short, easier pass."
      ],
      "exe": [
        "Nejdřív plynule napni popruh, potom táhni sáně kontrolovanými kroky zvoleným směrem. U ručního úchopu drž madla pevně; pohyb vytváří chůze, ne opakované přitahování pažemi. Při chůzi pozadu používej kratší kroky. Na konci úseku zastav, ověř prostor a teprve pak změň směr.",
        "Take up the slack smoothly, then drag the sled with controlled steps in the chosen direction. With a hand grip, hold the handles steadily; walking moves the sled rather than repeated arm pulls. Use shorter steps when walking backward. Stop at the end of the bout, check the route and only then change direction."
      ],
      "wat": [
        "Popruh nesmí škubat ani se plést pod nohy. Neomotávej ho kolem zápěstí nebo krku; používej určená madla či tělový úvaz. Před cestou pozadu zkontroluj prostor za sebou. Při bolesti, podkluzování nebo ztrátě kontroly zastav a uprav odpor či délku úseku.",
        "Keep the line from jerking or getting under your feet. Do not wrap it around the wrists or neck; use the intended handles or body harness. Check the route behind you before moving backward. Stop and adjust resistance or bout length if there is pain, slipping or loss of control."
      ],
      "foc": [
        "Zapisuj čas úseku v sekundách. Délku trasy, směr, povrch a použité sáně připiš do poznámky; pro porovnání je drž stejné. U kilogramů vždy uveď, zda jde jen o přidané kotouče, nebo o sáně i kotouče. Dosavadní způsob zápisu zachovej; nejasné staré záznamy zpětně nepřepočítávej. Delší čas na stejné vzdálenosti sám o sobě není zlepšení. Poznamenej také ruční úchop nebo tělový úvaz. Směr vpřed a pozadu nejsou pravá a levá strana; tato karta je neeviduje jako oddělené strany.",
        "Record the bout time in seconds. Note the route distance, direction, surface and sled, and keep them consistent for comparisons. For kilograms, state whether you record added plates only or the sled plus plates. Keep your existing convention; do not convert unclear earlier records. More time over the same distance is not an improvement by itself. Also note the hand grip or body harness. Forward and backward are not right and left sides; this card does not record them as separate sides."
      ],
      "pro": [
        "Lehčí: nižší odpor nebo kratší úsek se stejnou kontrolou. Náročnější: podle cíle uprav jednu věc, například odpor nebo délku úseku. Změna povrchu či způsobu tahu mění podmínky; nepovažuj stejné kilogramy automaticky za stejnou náročnost.",
        "Easier: less resistance or a shorter bout with the same control. Harder: adjust one variable to suit the goal, such as resistance or bout length. A different surface or towing setup changes the task; equal kilograms do not automatically mean equal difficulty."
      ],
      "ez": null,
      "source": {
        "author": "NSCA; NCSF; equipment manufacturers; Linthorne & Cooper",
        "document": "Local practical adaptation: sled setup, controlled travel and comparable recording",
        "url": "https://www.nsca.com/contentassets/b882050c0aa44223b738f4e43e692297/coach1.4-enhancing_motor_learning_with_sled_training.pdf",
        "scope": "Tanmay synthesis, not an official NSCA lesson or copied programme. Sources substantiate equipment, task distinctions and surface-dependent resistance. No universal load/dose, injury prevention, knee treatment, low-soreness or superiority claim. Original identities and recording retained."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "conditioning"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "training_sled_pull"
        ],
        [
          "sled_hand_tow_set",
          "sled_body_tow_set"
        ],
        [
          "sled_lane"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "ext",
      "sideMode": "none"
    },
    "segment": "D",
    "art": {
      "appId": "sleddrag",
      "atlasId": "sleddrag",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "d5d47da0cc2c7671663b7a2773679dc4053c7cf2e41ccd731813b3bf97b41e6c",
        "thumb": "/unified-atlas/sleddrag-4ea5a66885c33593-thumb.webp",
        "detail": "/unified-atlas/sleddrag-791a6eb214d3bff1-detail.webp",
        "inkThumb": "/unified-atlas/sleddrag-71353c70ccb7ae80-inkThumb.webp",
        "inkDetail": "/unified-atlas/sleddrag-379c4f2f5c950a73-inkDetail.webp",
        "fillThumb": "/unified-atlas/sleddrag-cb927ec7875a517a-fillThumb.webp",
        "fillDetail": "/unified-atlas/sleddrag-a35c8be2c0fcf86f-fillDetail.webp"
      },
      "sourceSha256": "d5d47da0cc2c7671663b7a2773679dc4053c7cf2e41ccd731813b3bf97b41e6c",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "sleddrag",
      "measurementType": "WEIGHT_DURATION",
      "loadMode": "ext",
      "sideMode": "none",
      "requirements": [
        [
          "training_sled_pull"
        ],
        [
          "sled_hand_tow_set",
          "sled_body_tow_set"
        ],
        [
          "sled_lane"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "7e1e23f3b1e25214": {
        "before": {
          "cz": "Tažení saní",
          "en": "Sled Drag",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Tažení saní",
          "en": "Sled Drag",
          "measurementType": "WEIGHT_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "bearcrawl": {
    "profiles": {
      "370736626797530a": {
        "id": "bearcrawl",
        "cz": "Medvědí chůze",
        "en": "Bear Crawl",
        "pat": "prenos",
        "S": 1,
        "C": 1,
        "J": {
          "kot": 1
        },
        "pop": 2,
        "eq": [
          "telo"
        ],
        "mode": "sec",
        "mp": [
          "sho",
          "abs"
        ],
        "ms": [
          "qua",
          "fore"
        ],
        "dot": [
          82,
          84
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Kolena nízko nad zemí. Boky se nehoupou.",
          "Knees just off the ground. The hips don't sway."
        ],
        "pos": [
          "Na čtyřech: dlaně pod rameny, kolena pod boky, zvednutá kousek nad zem.",
          "All fours: hands under shoulders, knees under hips, lifted just off the ground."
        ],
        "exe": [
          "Protilehlá dlaň a chodidlo se posouvají spolu. Malé kroky, rovná záda.",
          "Opposite hand and foot travel together. Small steps, flat back."
        ],
        "wat": [
          "Pomalu znamená poctivě. Hlava v prodloužení páteře.",
          "Slow means honest. Head in line with the spine."
        ],
        "pro": [
          "Pozpátku, do strany, pod překážkou.",
          "Backwards, sideways, under obstacles."
        ]
      }
    },
    "edits": {
      "family": "crawl",
      "J": {
        "zap": 1,
        "ram": 1,
        "kot": 1
      },
      "pos": [
        "Na pevném neklouzavém podkladu opři dlaně pod rameny a podviň prsty nohou. Kolena pod kyčlemi zvedni kousek nad zem. Před sebou nech volný prostor pro krátké kroky.",
        "On a firm, non-slip surface, place palms beneath shoulders and tuck the toes. Lift the knees just clear of the floor beneath the hips. Leave clear space ahead for short steps."
      ],
      "exe": [
        "Posuň vpřed levou ruku a pravou nohu, potom pravou ruku a levou nohu. Dělej malé klidné kroky s koleny nízko nad podlahou; tělo se posouvá celé, ne pouze ruce.",
        "Advance the left hand and right foot, then the right hand and left foot. Take short, controlled steps with knees low above the floor; move the whole body rather than reaching with the hands alone."
      ],
      "wat": [
        "Dýchej a udržuj snesitelný tlak do dlaní. Když se pánev výrazně houpe nebo kolena nedokážeš udržet nízko, zkrať úsek a odpočiň si. Při bolesti v zápěstí či rameni úkol ukonči.",
        "Breathe and keep hand pressure comfortable. Shorten the bout and rest if the pelvis sways markedly or the knees cannot stay low. Stop if the wrist or shoulder becomes painful."
      ],
      "foc": [
        "Pohyb vpřed s diagonálním střídáním opor a koleny nad zemí. Zapisuj dobu skutečného lezení v sekundách, bez odpočinku; strany se nesčítají zvlášť.",
        "Travel forward with alternating diagonal supports and hovering knees. Record actual crawling time in seconds, excluding rest; do not record the two sides separately."
      ],
      "pro": [
        "Začni krátkým přenosem váhy nebo několika kroky a mezi pokusy polož kolena. Postupně můžeš prodloužit úsek. Cesta pozpátku je volitelný jiný úkol; rychlost ani překážky nejsou podmínkou pokroku.",
        "Start with a small weight shift or a few steps, lowering the knees between attempts. Gradually extend the bout if useful. Backward travel is an optional different task; speed and obstacles are not requirements for progress."
      ],
      "source": {
        "author": "U.S. Marine Corps Training and Education Command / Capt. Matthew Holfinger",
        "document": "Bear Crawl, public preparation and execution description (2017)",
        "url": "https://www.dvidshub.net/video/551361/bear-crawl",
        "scope": "The public written preparation and execution directly support the knees-under-hips low bear and alternating opposite hand/foot pattern. ACE independently corroborates diagonal travel. The linked military video was not played, and no military dose or programme is adopted. Time recording, regressions and stop cues are independent catalogue guidance; no clinical or superiority claim is made."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "strength",
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "E",
    "art": {
      "appId": "bearcrawl",
      "atlasId": "bearcrawl",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "06929789b1b9a3bfc79d287abf602c7d7f07059dd8b6176e6da08fbc5439e237",
        "thumb": "/unified-atlas/bearcrawl-e9bb0f2d9edee154-thumb.webp",
        "detail": "/unified-atlas/bearcrawl-5085f52b03e67a87-detail.webp",
        "inkThumb": "/unified-atlas/bearcrawl-6a883e2b2f50bca0-inkThumb.webp",
        "inkDetail": "/unified-atlas/bearcrawl-da5b84f1f1e46c6a-inkDetail.webp",
        "fillThumb": "/unified-atlas/bearcrawl-aad38f4c631ee7a1-fillThumb.webp",
        "fillDetail": "/unified-atlas/bearcrawl-b6fa94172812eacd-fillDetail.webp"
      },
      "sourceSha256": "06929789b1b9a3bfc79d287abf602c7d7f07059dd8b6176e6da08fbc5439e237",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "bearcrawl",
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "370736626797530a": {
        "before": {
          "cz": "Medvědí chůze",
          "en": "Bear Crawl",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Medvědí chůze",
          "en": "Bear Crawl",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_spider_walk": {
    "profiles": {
      "671edee30edff24f": {
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
      }
    },
    "edits": {
      "pos": [
        "Ve vzporu na dlaních nech nohy natažené vzad, chodidla přibližně na šířku boků a hlavu v prodloužení trupu. Vyber pevný neklouzavý povrch a volnou trasu před sebou.",
        "Start in a high plank with legs extended behind, feet roughly hip-width apart and the head aligned with the trunk. Choose firm, non-slip ground and a clear route ahead."
      ],
      "exe": [
        "Vykroč pravou nohou vně pravé ruky, koleno směřuje k vnější straně lokte; levou nohu nech vzadu. S postupem těla vpřed posuň protilehlou ruku. Pak strany vystřídej malými kroky a drž trup nízko podle své pohodlné opory.",
        "Step the right foot outside the right hand, bringing the knee toward the outside of that elbow while the left leg stays behind. Advance the opposite hand as the body moves forward. Alternate with short steps, keeping the trunk low within comfortable support."
      ],
      "wat": [
        "Nenuť koleno až k lokti ani neprohlubuj krok přes nepříjemný tlak v kyčli. Nepropadej se mezi rameny. Při bolesti zápěstí, ramene nebo kyčle zastav a zvol jednodušší úkol.",
        "Do not force the knee to reach the elbow or deepen the step through uncomfortable hip pressure. Avoid sinking between the shoulders. Stop for wrist, shoulder or hip pain and choose a simpler task."
      ],
      "foc": [
        "Dopředné lezení s krokem vně paže, odlišné od medvěda i přitahování kolen na místě. Zapisuj skutečně uraženou vzdálenost v metrech; jednotlivé kroky nejsou opakování pro levou a pravou stranu.",
        "Forward crawling with the step outside the arm, distinct from a bear crawl or stationary knee tucks. Record the distance travelled in metres; individual steps are not separate left/right repetitions."
      ],
      "pro": [
        "Začni krátkým krokem a návratem, potom spoj několik kroků. Přitahování kolena v prkně na předloktích je příbuzný úkol s jinou oporou, ne povinný předstupeň. Delší úsek přidej jen s jistými oporami; hlubší poloha není cílem.",
        "Start with a short step out and back, then connect a few steps. The forearm-plank knee tuck is a related task with different support, not a mandatory prerequisite. Extend the route only with secure support; greater depth is not the aim."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Spider Walks",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/247/spider-walks/",
        "scope": "The public exercise description directly supports a high-plank start, same-side knee outside elbow, alternating opposite hand advance and distance-based travel. Foot-placement and comfort cues clarify the existing depicted catalogue variant; no exact ACE lesson video, fixed dose or therapeutic effect is claimed."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "high_plank"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination",
        "strength"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "E",
    "art": {
      "appId": "ex26_spider_walk",
      "atlasId": "ex26_spider_walk",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "1b3808cb706d7e8770ae509a9f0637561908859a781af3dd1e20d77547bfc688",
        "thumb": "/expansion-atlas/ex26_spider_walk-original-256.webp",
        "detail": "/expansion-atlas/ex26_spider_walk-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_spider_walk-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_spider_walk-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_spider_walk-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_spider_walk-fill-960.webp"
      },
      "sourceSha256": "1b3808cb706d7e8770ae509a9f0637561908859a781af3dd1e20d77547bfc688",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_spider_walk",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "671edee30edff24f": {
        "before": {
          "cz": "Pavoučí chůze",
          "en": "Spider Walk",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Pavoučí chůze",
          "en": "Spider Walk",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_lateral_crawl": {
    "profiles": {
      "0ed41722ce483d84": {
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
      }
    },
    "edits": {
      "pos": [
        "Ve vzporu na dlaních opři ruce přibližně pod rameny a špičky nohou na šířku boků. Kolena jsou natažená. Na pevném neklouzavém podkladu nech volný prostor do obou stran.",
        "In a high plank, place hands roughly beneath shoulders and toes hip-width apart, with knees extended. Use firm, non-slip ground and leave clear space on both sides."
      ],
      "exe": [
        "Při cestě doprava posuň pravou ruku a pravou nohu o malý krok do strany. Až se znovu opřou, přisuň levou ruku a nohu bez překřížení. Pro cestu doleva postup obrať; kolena zůstávají natažená.",
        "For rightward travel, move the right hand and right foot a short step sideways. Once they are planted, bring the left hand and foot toward them without crossing. Reverse the sequence to travel left, keeping the knees extended."
      ],
      "wat": [
        "Nespěchej a neseskakuj rukama či nohama k sobě. Nech si dost širokou oporu a zabraň výraznému propadnutí beder. Při bolesti v zápěstí nebo rameni zastav.",
        "Do not rush or hop the hands or feet together. Retain enough support width and avoid marked sagging through the lower back. Stop for wrist or shoulder pain."
      ],
      "foc": [
        "Boční přesun v nataženém vzporu. Zapisuj celkovou uraženou vzdálenost v metrech, včetně cesty zpět; rozdělení doprava a doleva si poznamenej. Strany se nezapisují jako dvě sady opakování.",
        "Sideways travel in a straight-leg plank. Record total distance in metres, including the return journey, and note the split between rightward and leftward travel. Do not record the directions as two sets of repetitions."
      ],
      "pro": [
        "Začni jedním krátkým krokem a pauzou ve stabilní opoře. Pro snazší koordinaci můžeš přesun ruky a nohy rozdělit. Pak spoj několik kroků na každou stranu; délku přidávej podle kontroly, ne na úkor opory.",
        "Start with one short step and pause in stable support. Move the hand and foot separately if that makes coordination easier. Then connect a few steps each way, adding distance only while support stays controlled."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Lateral Crawls",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/328/lateral-crawls/",
        "scope": "The public exercise description explicitly starts in a straight-leg push-up position, travels with the leading same-side hand and foot, then follows with the trailing pair. This directly matches the existing high-plank illustration. Sequential practice, both-direction notation and comfort cues are independent catalogue guidance, not a claim about a certified lesson or treatment."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "high_plank"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination",
        "strength"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "E",
    "art": {
      "appId": "ex26_lateral_crawl",
      "atlasId": "ex26_lateral_crawl",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "b11a4c92ef1ea05dc85662cbe3f55a58ec36234b8f8e9d1344546e006dfb35a8",
        "thumb": "/expansion-atlas/ex26_lateral_crawl-original-256.webp",
        "detail": "/expansion-atlas/ex26_lateral_crawl-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_lateral_crawl-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_lateral_crawl-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_lateral_crawl-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_lateral_crawl-fill-960.webp"
      },
      "sourceSha256": "b11a4c92ef1ea05dc85662cbe3f55a58ec36234b8f8e9d1344546e006dfb35a8",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_lateral_crawl",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "0ed41722ce483d84": {
        "before": {
          "cz": "Boční chůze ve vzporu",
          "en": "Lateral High-Plank Crawl",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Boční chůze ve vzporu",
          "en": "Lateral High-Plank Crawl",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "highknees": {
    "profiles": {
      "b75b61b0ebb05117": {
        "id": "highknees",
        "cz": "Vysoká kolena",
        "en": "High Knees",
        "pat": "prenos",
        "S": 1,
        "C": 1,
        "J": {
          "kot": 1
        },
        "pop": 2,
        "eq": [
          "telo"
        ],
        "mode": "sec",
        "mp": [
          "qua",
          "cal"
        ],
        "ms": [
          "abs"
        ],
        "dot": [
          126,
          116
        ],
        "ez": null,
        "hd": "sprint",
        "foc": [
          "Kolena zvedej střídavě před tělo. Trup drž vzpřímený a pánev stabilní.",
          "Lift the knees alternately in front of you. Keep the torso tall and the pelvis steady."
        ],
        "pos": [
          "Stoj, běžecký postoj, pohled vpřed.",
          "Standing tall, runner's posture, eyes ahead."
        ],
        "exe": [
          "Běh na místě, kolena k výšce boků, paže v běžeckém rytmu.",
          "Run on the spot, knees to hip height, arms in running rhythm."
        ],
        "wat": [
          "Žádné zaklánění. Došlap na přední část chodidla.",
          "No leaning back. Land on the forefoot."
        ],
        "pro": [
          "Rychleji, pak sprint.",
          "Faster, then the sprint."
        ]
      }
    },
    "edits": {
      "hd": null,
      "pos": [
        "Postav se vzpřímeně na pevný neklouzavý povrch a nech kolem sebe místo pro pohyb paží. Začni klidným střídáním nohou, pohled směřuje před sebe.",
        "Stand upright on a firm, non-slip surface with room for arm movement. Begin with easy alternating steps and look ahead."
      ],
      "exe": [
        "Běž na místě a střídavě zvedej kolena vpřed. Paže se pohybují proti nohám. Výšku kolena i rytmus přizpůsob tomu, co zvládáš bez zaklánění; nemusíš dosáhnout výšky kyčlí.",
        "Run in place, lifting the knees alternately in front. Swing the arms opposite to the legs. Choose knee height and rhythm that allow you to stay upright; reaching hip height is not required."
      ],
      "wat": [
        "Drž se na místě a došlapuj řízeně bez tvrdého dupání. Nevynucuj běh pouze po špičkách. Při nepříjemných dopadech přejdi na pochod bez odrazu; při bolesti zastav.",
        "Stay in place and make controlled contacts without heavy stamping. Do not force yourself to run only on the toes. If the impacts feel uncomfortable, switch to marching without a hop; stop for pain."
      ],
      "foc": [
        "Kondiční běh na místě se střídáním kolen a paží. Zapisuj skutečný čas pohybu v sekundách, bez odpočinku; nejde o počet zdvihů každé nohy.",
        "Conditioning through running in place with alternating knees and arms. Record actual movement time in seconds, excluding rest, rather than counting lifts separately for each leg."
      ],
      "pro": [
        "Lehčí možnost je pochod na místě s menším zdvihem kolen. Podle kontroly můžeš upravit délku úseku nebo rytmus. Sprint je samostatný úkol s jinými nároky, ne povinný další stupeň.",
        "Marching in place with a lower knee lift is an easier option. Adjust bout length or rhythm according to control. Sprinting is a separate task with different demands, not a required next level."
      ],
      "source": {
        "author": "The Prehab Guys",
        "document": "High Knees – In Place",
        "url": "https://theprehabguys.com/vimeo-video/high-knees-in-place-2/",
        "scope": "The public exercise notes directly verify stationary alternating high-knee running with an individually tolerable knee lift. The demonstration video was not played. Time recording, optional marching, controlled-contact wording and absence of a forced sprint progression are independent catalogue guidance; no clinical benefit or universally required foot strike is claimed."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "focus": [
        "conditioning",
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J",
      "ez",
      "hd",
      "precautions"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "F",
    "art": {
      "appId": "highknees",
      "atlasId": "highknees",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "4a5d2a4804438537a2f65d10471417ed38e263fedd68b4a41f14529e33e8de7d",
        "thumb": "/unified-atlas/highknees-920b8433db7e023c-thumb.webp",
        "detail": "/unified-atlas/highknees-daf77fb8e84f3ea0-detail.webp",
        "inkThumb": "/unified-atlas/highknees-ee3617e072564f79-inkThumb.webp",
        "inkDetail": "/unified-atlas/highknees-4abc0287718cb663-inkDetail.webp",
        "fillThumb": "/unified-atlas/highknees-660c0ba261608adf-fillThumb.webp",
        "fillDetail": "/unified-atlas/highknees-18f2239a40ed9e89-fillDetail.webp"
      },
      "sourceSha256": "4a5d2a4804438537a2f65d10471417ed38e263fedd68b4a41f14529e33e8de7d",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "highknees",
      "measurementType": "DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "b75b61b0ebb05117": {
        "before": {
          "cz": "Vysoká kolena",
          "en": "High Knees",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Vysoká kolena",
          "en": "High Knees",
          "measurementType": "DURATION",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_a_march": {
    "profiles": {
      "b90dbfbee956fb12": {
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
      }
    },
    "edits": {
      "pos": [
        "Stůj vzpřímeně, ramena volná a lokty pohodlně pokrčené. Před sebou nech rovný neklouzavý úsek, po kterém můžeš několikrát vykročit.",
        "Stand tall with relaxed shoulders and comfortably bent elbows. Leave a clear, level, non-slip lane for several forward steps."
      ],
      "exe": [
        "Pochoduj vpřed malými kroky. Zvedni jedno koleno před tělo a současně přesuň protilehlou paži vpřed, potom nohy vystřídej. Vždy nech jednu nohu na zemi; nepřidávej poskok.",
        "March forward with small steps. Lift one knee in front while bringing the opposite arm forward, then alternate legs. Keep one foot on the ground throughout, without adding a hop."
      ],
      "wat": [
        "Zvol takový zdvih kolena, při kterém se nemusíš zaklánět. Došlapuj blízko pod tělem, bez natahování dlouhého kroku vpřed. Zvednuté chodidlo drž přirozeně, bez násilného přitahování špičky.",
        "Choose a knee lift that does not require leaning back. Step down near the body rather than reaching far ahead. Hold the lifted foot comfortably, without forcing the toes upward."
      ],
      "foc": [
        "Pomalý dopředný nácvik střídání nohou a protilehlých paží bez letové fáze. Zapisuj uraženou vzdálenost v metrech; pochod na místě do této vzdálenosti nezapočítávej.",
        "Slow forward practice of opposite arm and leg coordination without a flight phase. Record distance travelled in metres; marching in place does not add to that distance."
      ],
      "pro": [
        "Pro nácvik můžeš pochodovat na místě s menším zdvihem. Potom spoj několik pohodlných kroků vpřed. A-skip přidává odraz a dopad; je volitelnou odlišnou variantou, nikoli nutnou cestou ke zdravému běhu.",
        "Practise in place with a smaller knee lift if useful, then link a few comfortable forward steps. A-skips add take-off and landing; they are an optional different variation, not a required route to healthy running."
      ],
      "source": {
        "author": "National Strength and Conditioning Association / Human Kinetics",
        "document": "High Knee Drills — Marching As, Developing Speed excerpt (2017)",
        "url": "https://www.nsca.com/education/articles/kinetic-select/high-knee-drills/",
        "scope": "The public book excerpt explicitly distinguishes slow marching As from skipping with flight. World Rugby corroborates forward travel with opposite arm/leg action. Catalogue wording adapts knee height, arm range, foot comfort and distance recording to individual control rather than imposing the source athletic-performance targets on all clients. No drill video or full book was viewed."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J",
      "ez",
      "hd",
      "precautions"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "F",
    "art": {
      "appId": "ex26_a_march",
      "atlasId": "ex26_a_march",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "cc3a3ce3c6e30a4f474045d909dddab2e750535809d3f0793ead7cd8a82479b1",
        "thumb": "/expansion-atlas/ex26_a_march-original-256.webp",
        "detail": "/expansion-atlas/ex26_a_march-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_a_march-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_a_march-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_a_march-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_a_march-fill-960.webp"
      },
      "sourceSha256": "cc3a3ce3c6e30a4f474045d909dddab2e750535809d3f0793ead7cd8a82479b1",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_a_march",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "b90dbfbee956fb12": {
        "before": {
          "cz": "Běžecký pochod s vysokým kolenem",
          "en": "A-March",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běžecký pochod s vysokým kolenem",
          "en": "A-March",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_a_skip": {
    "profiles": {
      "223df505429bc4d2": {
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
      }
    },
    "edits": {
      "precautions": [
        "impact"
      ],
      "pos": [
        "Připrav si rovný neklouzavý úsek s místem pro několik kroků a malé odrazy. Stůj vzpřímeně s volnými rameny; povrch a obuv zvol tak, aby opora spolehlivě držela.",
        "Use a level, non-slip lane with space for a few steps and small hops. Stand upright with relaxed shoulders and choose a surface and footwear that provide secure contact."
      ],
      "exe": [
        "Při zvednutí kolena proveď malý poskok na opěrné noze, vrať se na ni a s dalším krokem vystřídej strany. Postupuj krátce vpřed v rytmu krok–poskok; paže pracují proti nohám.",
        "As one knee lifts, make a small hop on the supporting leg, land back on it, then change sides with the next step. Travel forward with a short step-and-hop rhythm and opposite arm action."
      ],
      "wat": [
        "Odraz i dopad drž nízký a řízený; nejde o skok co nejvýše ani běh co nejrychleji. Nedupni před tělo a nenuť patu zůstávat vysoko. Při ztrátě rytmu přeruš úsek; při bolesti zastav.",
        "Keep take-offs and landings low and controlled; this is not a maximal-height jump or maximal-speed run. Avoid stamping far ahead or forcing the heel to stay raised. Pause if rhythm breaks down and stop for pain."
      ],
      "foc": [
        "Běžecká průprava s krátkou letovou fází a dopady, odlišná od pochodu. Zapisuj vzdálenost v metrech; počty poskoků nebo stran nejsou hlavní jednotkou této karty.",
        "A running drill with a brief flight phase and repeated landings, distinct from marching. Record distance in metres; hop counts or separate sides are not this card’s main unit."
      ],
      "pro": [
        "Vrať se k A-pochodu, když chceš nácvik bez odrazu. Začni několika nízkými poskoky; delší úsek či plynulejší rytmus přidej jen při klidných dopadech. Vyšší skok ani sprint nejsou povinné pokračování.",
        "Return to A-marching for practice without hopping. Begin with a few low skips, adding distance or smoother rhythm only while contacts remain controlled. Higher jumps and sprinting are not required next steps."
      ],
      "source": {
        "author": "National Strength and Conditioning Association / Human Kinetics",
        "document": "High Knee Drills — A Skips, Developing Speed excerpt (2017)",
        "url": "https://www.nsca.com/education/articles/kinetic-select/high-knee-drills/",
        "scope": "The public NSCA/Human Kinetics excerpt explicitly adds a skip off the stance leg and a flight phase to marching As. The impact tag describes that existing task; it is not a newly inferred treatment restriction. Low amplitude, individual foot-contact comfort and metres recording are independent coaching adaptations. No exact lesson video was viewed."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J",
      "ez",
      "hd",
      "precautions"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "F",
    "art": {
      "appId": "ex26_a_skip",
      "atlasId": "ex26_a_skip",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "57240d04bd20007972a1f072cdaf52de3623f06998d0eb53e4a992ff84dde4e6",
        "thumb": "/expansion-atlas/ex26_a_skip-original-256.webp",
        "detail": "/expansion-atlas/ex26_a_skip-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_a_skip-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_a_skip-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_a_skip-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_a_skip-fill-960.webp"
      },
      "sourceSha256": "57240d04bd20007972a1f072cdaf52de3623f06998d0eb53e4a992ff84dde4e6",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_a_skip",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "223df505429bc4d2": {
        "before": {
          "cz": "Běžecký skipink A",
          "en": "A-Skip",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běžecký skipink A",
          "en": "A-Skip",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_wall_march": {
    "profiles": {
      "28372277a2373793": {
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
      }
    },
    "edits": {
      "J": {
        "kyc": 1,
        "kot": 1,
        "zap": 1,
        "ram": 1
      },
      "pos": [
        "Postav se čelem k pevné zdi a opři obě dlaně přibližně ve výšce ramen. Odstup do pohodlného náklonu celého těla, paže nech natažené bez násilného zamykání loktů. Chodidla musí bezpečně držet na podlaze.",
        "Face a solid wall and place both palms at roughly shoulder height. Step back into a comfortable whole-body lean, keeping the arms extended without forcing the elbows locked. The feet must grip the floor securely."
      ],
      "exe": [
        "Zvedni jedno koleno vpřed, přitom obě ruce zůstávají opřené a druhá noha nese váhu. Vrať chodidlo do původní opory za svislicí kyčle a teprve potom zvedni druhou nohu. Střídej pomalu bez poskoku a bez změny náklonu.",
        "Lift one knee forward while both hands remain planted and the other leg supports you. Return the foot to its original contact point behind the vertical line of the hip before lifting the other leg. Alternate slowly without hopping or changing the lean."
      ],
      "wat": [
        "Neprohýbej bedra ani se nelámej v pase. Zvedej koleno jen do rozsahu, ve kterém udržíš oporu. Když klouže chodidlo či dlaň nebo je tlak do zápěstí nepříjemný, přibliž se ke zdi nebo úkol ukonči.",
        "Avoid arching the lower back or folding at the waist. Lift the knee only as far as support stays secure. If a foot or palm slips or wrist pressure is uncomfortable, move closer to the wall or stop."
      ],
      "foc": [
        "Kontrola náklonu a střídání nohou s trvalou oporou rukou o zeď. Počítej opakování na každou nohu: jeden zdvih kolena a návrat je jedno opakování. Počet není součet obou stran ani uražené metry.",
        "Control the lean and alternate legs while keeping both hands on the wall. Count repetitions for each leg: one knee lift and return is one repetition. The count is not the sum of both sides or distance travelled."
      ],
      "pro": [
        "Zmenši náklon, zdvih nebo počet opakování. Náročnost můžeš měnit klidnou pauzou se zvednutou nohou. Rychlé výměny a sprint jsou jiné úkoly; nejsou nutným pokračováním této pomalé varianty.",
        "Reduce the lean, knee lift or number of repetitions. A controlled pause with one leg lifted is an optional variation. Fast exchanges and sprinting are different tasks, not required progressions from this slow march."
      ],
      "source": {
        "author": "Born to Run CA Track Club",
        "document": "Wall March — public written instructions",
        "url": "https://vimeo.com/1075115163",
        "scope": "The club’s public written description directly documents both hands on a wall, a whole-body lean, returning one leg before lifting the other, and repetitions. The video itself was not played. This replaces an unrelated general NSCA TSAC programme-design citation that did not verify the exact drill. World Rugby wall drive is a faster related task, not evidence that this march must become rapid."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "wall",
        "hand_support"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "zed"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source",
      "J",
      "ez",
      "hd",
      "precautions"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "segment": "F",
    "art": {
      "appId": "ex26_wall_march",
      "atlasId": "ex26_wall_march",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "981d6edaa9f275e5a6e5208810d0e82074531722f10545d8907dfb8498a62588",
        "thumb": "/expansion-atlas/ex26_wall_march-original-256.webp",
        "detail": "/expansion-atlas/ex26_wall_march-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_wall_march-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_wall_march-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_wall_march-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_wall_march-fill-960.webp"
      },
      "sourceSha256": "981d6edaa9f275e5a6e5208810d0e82074531722f10545d8907dfb8498a62588",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_wall_march",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide",
      "requirements": [
        [
          "telo"
        ],
        [
          "zed"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "28372277a2373793": {
        "before": {
          "cz": "Běžecké střídání kolen s oporou o zeď",
          "en": "Wall Acceleration March",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Běžecké střídání kolen s oporou o zeď",
          "en": "Wall Acceleration March",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_lateral_shuffle": {
    "profiles": {
      "635007632f90ff8e": {
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
      }
    },
    "edits": {
      "pos": [
        "Stůj bokem k rovné volné dráze, mírně pokrč kyčle i kolena a nech chodidla od sebe. Za oběma konci ponech místo pro dobrzdění.",
        "Stand side-on to a clear level lane, soften your hips and knees and keep your feet apart. Leave room to decelerate beyond both ends."
      ],
      "exe": [
        "Při přesunu doprava vykroč pravou nohou a odtlač se levou; levá pak následuje bez křížení. Doleva postup zrcadlově obrať. Trup zůstává čelem stejným směrem. Před koncem včas zpomal.",
        "Moving right, lead with the right foot and push from the left; the left then follows without crossing. Reverse the sequence to move left. Keep facing the same direction and slow down before the end."
      ],
      "wat": [
        "Nesrážej chodidla k sobě a neutíkej čelem do strany. Hloubku postoje přizpůsob kontrole. Nejprve zvládni zastavení; místo pro dobrzdění není překážková dráha.",
        "Do not bring the feet into contact or turn to run forwards along the lane. Choose a stance depth you can control. Learn to stop first and keep the deceleration area clear."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas pro oba směry podle dosavadních polí pro strany. Pravá a levá zde označují směr přesunu, nikoli izolovaně pracující nohu.",
        "Record distance and time for both directions using the existing side fields. Right and left refer to travel direction, not one leg working in isolation."
      ],
      "pro": [
        "Lehčí: pomalé kroky stranou bez křížení. Náročnější: vyšší rychlost při stejné kontrole zastavení; změnu směru nejdřív naplánuj předem.",
        "Easier: slow sideways steps without crossing. Harder: more speed with the same control when stopping; plan direction changes before practising them."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Agility Ladder: Lateral Shuffle",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/170/agility-ladder-lateral-shuffle/",
        "scope": "Supports lateral lead/follow footwork and both travel directions. This card retains its existing open-lane version; the ladder, prescribed arm angle and exact foot-contact pattern are not made mandatory. Stopping-space and gradual-speed cues are conservative coaching adaptations."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "segment": "G",
    "art": {
      "appId": "ex26_lateral_shuffle",
      "atlasId": "ex26_lateral_shuffle",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "0934cfb83588c776a7fe1881cf7e3f87998c6a23e9355eadb17fd22f7f054c55",
        "thumb": "/expansion-atlas/ex26_lateral_shuffle-original-256.webp",
        "detail": "/expansion-atlas/ex26_lateral_shuffle-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_lateral_shuffle-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_lateral_shuffle-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_lateral_shuffle-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_lateral_shuffle-fill-960.webp"
      },
      "sourceSha256": "0934cfb83588c776a7fe1881cf7e3f87998c6a23e9355eadb17fd22f7f054c55",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_lateral_shuffle",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "perSide",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "635007632f90ff8e": {
        "before": {
          "cz": "Boční posun v atletickém postoji",
          "en": "Lateral Shuffle",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Boční posun v atletickém postoji",
          "en": "Lateral Shuffle",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_carioca": {
    "profiles": {
      "b8d73a0cb36d1a10": {
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
      }
    },
    "edits": {
      "cz": "Křížné kroky bokem (carioca)",
      "pos": [
        "Stůj bokem k rovné volné dráze s lehce pokrčenými koleny. Za konci dráhy nech místo pro zastavení. Paže mohou přirozeně vyvažovat pohyb.",
        "Stand side-on to a clear level lane with soft knees. Leave stopping room beyond its ends. Let your arms help balance the movement."
      ],
      "exe": [
        "Doprava: vykroč pravou, levou překřiž před pravou, pravou znovu vykroč a levou překřiž za pravou. Plynule opakuj; doleva postup obrať. Nepřetáčej celý trup do běhu vpřed.",
        "To the right: step right, cross the left in front, step right again, then cross the left behind. Repeat smoothly and reverse the sequence to travel left. Do not turn the whole torso into a forward run."
      ],
      "wat": [
        "Začni v pomalém rytmu a před koncem zpomal. Nekruť kolenem proti pevně zapřenému chodidlu; pokud se nohy zachytávají, zmenši kroky a přidej pauzy.",
        "Start slowly and decelerate before the end. Do not twist a knee against a fixed foot; if your feet catch each other, shorten the steps and add pauses."
      ],
      "foc": [
        "Zapisuj vzdálenost na pravou a levou stranu jako směr přesunu. Udržuj stejný způsob měření; křížení vpředu i vzadu patří do jednoho úseku.",
        "Record distance for right and left travel directions. Keep the same measurement convention; front and back crossovers belong to the same bout."
      ],
      "pro": [
        "Lehčí: jednotlivé křížné kroky s pauzou; boční posun bez křížení je jednodušší alternativa. Náročnější: plynulý rytmus a teprve potom rychlost oběma směry.",
        "Easier: individual crossovers with pauses; a side shuffle without crossing is a simpler alternative. Harder: continuous rhythm, then speed in both directions."
      ],
      "source": {
        "author": "University of Calgary, Sport Injury Prevention Research Centre",
        "document": "SHRED injuries — Carioca/Crossovers",
        "url": "https://www.ucalgary.ca/shred-injuries/all-sports/volleyball/cariocacrossovers",
        "scope": "Supports alternating front/behind crossover footwork with a lateral travel direction. Card retains its existing alternating version. This is not an injury-prevention guarantee for the individual exercise or a requirement to immobilize the pelvis."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "segment": "G",
    "art": {
      "appId": "ex26_carioca",
      "atlasId": "ex26_carioca",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ae6dfe718e0b71c4526aebb1839206cefb57ebf15104c5e1bb906cf2c927351d",
        "thumb": "/expansion-atlas/ex26_carioca-original-256.webp",
        "detail": "/expansion-atlas/ex26_carioca-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_carioca-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_carioca-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_carioca-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_carioca-fill-960.webp"
      },
      "sourceSha256": "ae6dfe718e0b71c4526aebb1839206cefb57ebf15104c5e1bb906cf2c927351d",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_carioca",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "perSide",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "b8d73a0cb36d1a10": {
        "before": {
          "cz": "Běžecké překračování bokem",
          "en": "Carioca Crossover Step",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Křížné kroky bokem (carioca)",
          "en": "Carioca Crossover Step",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_backpedal": {
    "profiles": {
      "9f435d3bed4fae64": {
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
      }
    },
    "edits": {
      "pos": [
        "Zkontroluj rovnou volnou dráhu za sebou i prostor pro zastavení. Začni v mírném atletickém postoji; nejdřív si vyzkoušej několik pomalých kroků pozadu.",
        "Check a clear level lane behind you and enough room to stop. Begin in a slight athletic stance and first try a few slow backward steps."
      ],
      "exe": [
        "Pohybuj se pozadu krátkými kroky, bez záklonu a s přirozenou prací paží. Tempo zvyšuj jen při jistém došlapu. Před koncem dráhy zpomal do zastavení.",
        "Travel backwards with short steps, without leaning back, and let your arms move naturally. Increase the pace only with controlled foot placement. Slow to a stop before the end of the lane."
      ],
      "wat": [
        "Nekombinuj rychlý běh s otáčením hlavy za překážkami. Když potřebuješ dráhu znovu ověřit, zastav. Při nejistotě zůstaň u pomalé chůze; oporu používej při chůzi, nikoli při běhu.",
        "Do not combine fast backward running with turning your head to look for obstacles. Stop to recheck the lane. If unsteady, keep to slow walking; use support for walking, not for running."
      ],
      "foc": [
        "Zapisuj vzdálenost a čas bez rozdělení na strany. Do poznámky uveď, jestli šlo o běh nebo pomalou chůzi pozadu; jejich výsledky nepovažuj za stejnou intenzitu.",
        "Record distance and time without splitting sides. Note whether the bout was backward running or slow backward walking; do not treat them as the same intensity."
      ],
      "pro": [
        "Lehčí: pomalá skutečná chůze pozadu bez zátěže, podle potřeby podél pevné opory ruky. Náročnější: plynulejší rychlejší kroky na stejné dráze; přechod do běhu vpřed nacvič předem.",
        "Easier: slow unloaded backward walking, beside a secure hand support when needed. Harder: smoother, faster steps in the same lane; practise any transition to forward running beforehand."
      ],
      "source": {
        "author": "National Strength and Conditioning Association",
        "document": "5 Reaction Drills to Build Quickness — Reactive Sprint and Backpedal Drill",
        "url": "https://www.nsca.com/education/articles/kinetic-select/5-reaction-drills-to-build-quickness/",
        "scope": "Direct backpedal and deceleration context. The general card does not import the Level 3 reactive drill, cone spacing or time prescription. Slow backward walking is an optional coaching regression, separately supported by South Tees NHS; it is not a mandatory treatment or newly named historical identity."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "G",
    "art": {
      "appId": "ex26_backpedal",
      "atlasId": "ex26_backpedal",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "733a32d411d675426d71ac1a765e9d95de9709c0d085ceb2fe1a5ecb48ab611d",
        "thumb": "/expansion-atlas/ex26_backpedal-original-256.webp",
        "detail": "/expansion-atlas/ex26_backpedal-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_backpedal-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_backpedal-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_backpedal-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_backpedal-fill-960.webp"
      },
      "sourceSha256": "733a32d411d675426d71ac1a765e9d95de9709c0d085ceb2fe1a5ecb48ab611d",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_backpedal",
      "measurementType": "DISTANCE_DURATION",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "9f435d3bed4fae64": {
        "before": {
          "cz": "Kontrolovaný běh pozadu",
          "en": "Controlled Backpedal",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Kontrolovaný běh pozadu",
          "en": "Controlled Backpedal",
          "measurementType": "DISTANCE_DURATION",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_sumo_rotation": {
    "profiles": {
      "711bfba89ba78924": {
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
        "defaultRestSec": 90,
        "taxonomy": {
          "positions": [
            "standing"
          ],
          "supports": [
            "unsupported"
          ],
          "priority": 1,
          "movements": [
            "squat",
            "locomotion"
          ],
          "focus": [
            "coordination"
          ]
        }
      }
    },
    "edits": {},
    "taxonomy": {
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "priority": 1,
      "movements": [
        "squat",
        "locomotion"
      ],
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
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "G",
    "art": {
      "appId": "ex26_sumo_rotation",
      "atlasId": "ex26_sumo_rotation",
      "unified": true,
      "contourOnly": true,
      "darkOutline": true,
      "sourceSha256": "d67718f1d3073e187317615628015c3dce8fb34631c7389dd689839155941f96",
      "primary": {
        "width": 960,
        "height": 960,
        "thumb": "/movement-audit/locomotion-sumo-v1-d67718f1d307-256.webp",
        "inkThumb": "/movement-audit/locomotion-sumo-v1-d67718f1d307-256.webp",
        "detail": "/movement-audit/locomotion-sumo-v1-d67718f1d307-960.webp",
        "inkDetail": "/movement-audit/locomotion-sumo-v1-d67718f1d307-960.webp",
        "sourceSha256": "d67718f1d3073e187317615628015c3dce8fb34631c7389dd689839155941f96"
      }
    },
    "policy": {
      "id": "ex26_sumo_rotation",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "711bfba89ba78924": {
        "before": {
          "cz": "Široký dřep s otočením přes krok",
          "en": "Wide Squat with Pivot Step",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Široký dřep s otočením přes krok",
          "en": "Wide Squat with Pivot Step",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_lateral_overunder": {
    "profiles": {
      "a926cac088fbbf57": {
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
      }
    },
    "edits": {
      "pos": [
        "Stůj bokem k nízkým lehkým překážkám, které při kontaktu povolí. Mezi nimi nech místo na boční výpad a za dráhou na zastavení. Pro podkročení nepoužívej pevnou horní tyč.",
        "Stand side-on to low lightweight obstacles that yield on contact. Leave room for a lateral lunge between them and space to stop after the lane. Do not use a rigid overhead bar for the under phase."
      ],
      "exe": [
        "Překroč bokem první a potom druhou nohou, obě chodidla polož za překážku. Mezi překážkami udělej kontrolovaný boční výpad a přenes tělo níž jako pod pomyslnou tyčí. Znovu se vzpřim. Zpět postupuj druhou vedoucí nohou.",
        "Step sideways over with one foot, then the other, placing both feet beyond the obstacle. Between obstacles, use a controlled lateral lunge to lower and shift your body as if under an imaginary bar. Stand again. Return with the other foot leading."
      ],
      "wat": [
        "Překážky nepřeskakuj a nepoužívej jako překážku pevné těžké bradlo. Výšku překročení i hloubku výpadu přizpůsob kontrole; nemusíš do nejhlubší polohy.",
        "Step over rather than jump, and do not use a heavy fixed parallette as a hurdle. Match obstacle height and lunge depth to your control; the deepest position is not required."
      ],
      "foc": [
        "Zapisuj vzdálenost stejným způsobem jako dosud. Do poznámky uveď výšku překážek nebo provedení bez nich. V rámci série vystřídej oba směry; karta nepřidává samostatná pole pro strany.",
        "Keep recording distance in the same way. Note obstacle height or that no obstacles were used. Practise both directions within the series; this card does not add separate side fields."
      ],
      "pro": [
        "Lehčí: celé překročení i podkročení pouze naznač bez překážek. Náročnější: nejprve přidej nízké překážky, pak uprav vždy jen výšku nebo hloubku při zachované plynulosti.",
        "Easier: mime both the step-over and under phases without obstacles. Harder: add low obstacles first, then change only height or depth at a time while keeping control."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Lateral Over Unders",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/206/lateral-over-unders/",
        "scope": "Supports two feet sequentially crossing a low obstacle, then a lateral lunge between obstacles, and returning with the other leg leading. The lower/deeper range and no-obstacle regression are existing coaching adaptations. No rigid overhead bar or guaranteed-safe obstacle is prescribed."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "prostor"
        ],
        [
          "prekazka"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "G",
    "art": {
      "appId": "ex26_lateral_overunder",
      "atlasId": "ex26_lateral_overunder",
      "unified": true,
      "contourOnly": true,
      "darkOutline": true,
      "sourceSha256": "6d6269bfdd2625b80660e9f482f5bb3a6cbce4c6526671b8cfb5e95568937492",
      "primary": {
        "width": 960,
        "height": 960,
        "thumb": "/movement-audit/locomotion-overunder-v1-6d6269bfdd26-256.webp",
        "inkThumb": "/movement-audit/locomotion-overunder-v1-6d6269bfdd26-256.webp",
        "detail": "/movement-audit/locomotion-overunder-v1-6d6269bfdd26-960.webp",
        "inkDetail": "/movement-audit/locomotion-overunder-v1-6d6269bfdd26-960.webp",
        "sourceSha256": "6d6269bfdd2625b80660e9f482f5bb3a6cbce4c6526671b8cfb5e95568937492"
      }
    },
    "policy": {
      "id": "ex26_lateral_overunder",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "prostor"
        ],
        [
          "prekazka"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "a926cac088fbbf57": {
        "before": {
          "cz": "Boční překročení a podkročení",
          "en": "Lateral Over-Under Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Boční překročení a podkročení",
          "en": "Lateral Over-Under Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_cone_stepover": {
    "profiles": {
      "40ec9e2efe6f8d9a": {
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
      }
    },
    "edits": {
      "pos": [
        "Nízké měkké kužely rozestav do řady na neklouzavém povrchu s volným místem pro dokončení kroku. Rozteč zvol tak, abys nepřeskakoval ani nepřekračoval příliš daleko. Začni před prvním kuželem.",
        "Arrange low, yielding cones in a line on a non-slip surface with room to finish each step. Choose spacing that avoids jumping or overreaching. Start before the first cone."
      ],
      "exe": [
        "Přenášej jednu a potom druhou nohu nad kuželem. Před dalším krokem získej jistou oporu a pokračuj vpřed řadou. Při dalším průchodu můžeš začít druhou nohou; zpět se vrať mimo kužely.",
        "Clear each cone with one foot and then the other. Establish stable support before continuing forward along the line. You may lead with the other leg on the next pass; return outside the cones."
      ],
      "wat": [
        "Výšku nepřekonávej prudkým úklonem trupu. Pokud potřebuješ oporu, použij pevné madlo po celé trase nebo nacvičuj kratší úsek. Kužel není opora.",
        "Do not use a sudden sideways trunk lean to clear the height. If support is needed, use a fixed rail along the route or practise a shorter section. A cone is not a support."
      ],
      "pro": [
        "Lehčí: nižší překážka nebo nácvik nad čárou. Náročnější: krátké kontrolované zastavení před došlapem. Rychlost ani vyšší kužel nejsou povinnou progresí.",
        "Easier: a lower obstacle or rehearsal over a line. Harder: a short controlled pause before landing. More speed or a higher cone is not a required progression."
      ],
      "foc": [
        "Zapisuj metry vymezeného průchodu od začátku ke konci, ne počet polí nebo kroků. Délku, počet průchodů a způsob návratu poznamenej; klidný návrat mimo dráhu do pracovních metrů nezahrnuj. Dosavadní konvenci zachovej a starší záznamy nepřepočítávej. Obě nohy překračují; záznam nemá oddělenou pravou a levou stranu.",
        "Record metres along the defined pass from start to finish, not the number of squares or steps. Note the length, number of passes and return method; exclude an easy return outside the course from working metres. Keep your existing convention and do not convert earlier records. Both legs step over; the record has no separate right and left sides."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Forward Stepping over Cones",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/111/forward-stepping-over-cones/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "low_soft_cones"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_cone_stepover",
      "atlasId": "ex26_cone_stepover",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "3528d0c2ae7493326e2303a84eac18166975614b995b59b6c7cec20e523af6c2",
        "thumb": "/expansion-atlas/ex26_cone_stepover-original-256.webp",
        "detail": "/expansion-atlas/ex26_cone_stepover-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_cone_stepover-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_cone_stepover-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_cone_stepover-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_cone_stepover-fill-960.webp"
      },
      "sourceSha256": "3528d0c2ae7493326e2303a84eac18166975614b995b59b6c7cec20e523af6c2",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_cone_stepover",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "low_soft_cones"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "40ec9e2efe6f8d9a": {
        "before": {
          "cz": "Překračování kuželů vpřed",
          "en": "Forward Cone Step-over",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Překračování kuželů vpřed",
          "en": "Forward Cone Step-over",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_ladder_lateral": {
    "profiles": {
      "6d3302f580a5b186": {
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
      }
    },
    "edits": {
      "pos": [
        "Plochý koordinační žebřík polož rovně na neklouzavý povrch; příčky a okraje nesmějí odstávat. Nech volné místo na obou koncích i po stranách. Stůj oběma chodidly v krajním poli, bokem ke směru průchodu.",
        "Lay a flat agility ladder on a non-slip surface, with no raised rungs or edges. Leave clear space at both ends and alongside it. Place both feet in the end square, sideways to the direction of travel."
      ],
      "exe": [
        "Jdi bokem: do dalšího pole vstoupí vedoucí noha a za ní druhá. Nekřiž je a zachovej směr hrudníku. Po dokončení se nejdřív zastav; dalším průchodem procvič i opačný směr.",
        "Travel sideways: the leading foot enters the next square, followed by the other foot. Do not cross the feet; keep facing the same way. Stop after finishing, then practise the opposite direction on another pass."
      ],
      "wat": [
        "Našlapuj do polí, ne na příčky. Tempo přidej až při jistém pořadí a přesném došlapu; při zakopávání nebo bolesti zastav.",
        "Place feet inside the squares, not on rungs. Increase tempo only with a secure sequence and accurate contacts; stop if you trip or have pain."
      ],
      "pro": [
        "Lehčí: pomalé přesné kroky. Náročnější: plynulejší rytmus při stejných dvou došlapech v každém poli. Žebřík procvičuje tento vzor kroků; sám nedokládá reakční obratnost ve sportu.",
        "Easier: slow, accurate steps. Harder: a smoother rhythm with the same two contacts in each square. The ladder rehearses this footwork pattern; it does not by itself establish reactive sport agility."
      ],
      "foc": [
        "Zapisuj metry vymezeného průchodu od začátku ke konci, ne počet polí nebo kroků. Délku, počet průchodů a způsob návratu poznamenej; klidný návrat mimo dráhu do pracovních metrů nezahrnuj. Dosavadní konvenci zachovej a starší záznamy nepřepočítávej. Poznamenej oba směry. Dva průchody po 4 m jsou 8 m práce, nikoli dvě pravolevé série.",
        "Record metres along the defined pass from start to finish, not the number of squares or steps. Note the length, number of passes and return method; exclude an easy return outside the course from working metres. Keep your existing convention and do not convert earlier records. Note both directions. Two passes of 4 m give 8 m of work, not separate right/left sets."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Agility Ladder: Lateral Shuffle",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/170/agility-ladder-lateral-shuffle/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_ladder_lateral",
      "atlasId": "ex26_ladder_lateral",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "4c7af2887db7aedeb994f026ef5f80dc9b48ab03c3fc2dc05b920ca7ffd2f09b",
        "thumb": "/expansion-atlas/ex26_ladder_lateral-original-256.webp",
        "detail": "/expansion-atlas/ex26_ladder_lateral-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_ladder_lateral-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_ladder_lateral-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_ladder_lateral-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_ladder_lateral-fill-960.webp"
      },
      "sourceSha256": "4c7af2887db7aedeb994f026ef5f80dc9b48ab03c3fc2dc05b920ca7ffd2f09b",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_ladder_lateral",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "6d3302f580a5b186": {
        "before": {
          "cz": "Boční kroky v koordinačním žebříku",
          "en": "Lateral Ladder Shuffle",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Boční kroky v koordinačním žebříku",
          "en": "Lateral Ladder Shuffle",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_t_drill": {
    "profiles": {
      "cd9e8489b623bfb7": {
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
      }
    },
    "edits": {
      "pos": [
        "Čtyři kužely postav do T: A je start, B před ním, C vlevo a D vpravo od B. Předem změř úseky a projdi volnou neklouzavou trasu. Začni v pohodlném stoji u A.",
        "Set four cones in a T: A is the start, B is ahead, C is left and D is right of B. Measure the sections and walk through the clear, non-slip course first. Begin in a comfortable stance at A."
      ],
      "exe": [
        "Běž A–B a zbrzdi. Bokem bez křížení nohou přejdi B–C, potom C–D přes B a zpět D–B. Nakonec ustup pozadu B–A a kontrolovaně zastav. Zrcadlený průchod začíná boční částí k D.",
        "Run A–B and brake. Shuffle without crossing the feet from B–C, then C–D through B, and D–B. Backpedal B–A and stop under control. A mirrored pass starts its lateral section toward D."
      ],
      "wat": [
        "Před změnou směru zvol rychlost, při které udržíš kontrolu. Ověř prostor pro ústup pozadu a zastavení; kužely neobíhej těsně ani na ně nestoupej. Pevná trasa není reakční test.",
        "Choose a controllable speed before changing direction. Check the room for backpedaling and stopping; do not crowd or step on cones. A fixed course is not a reaction test."
      ],
      "pro": [
        "Lehčí: celá trasa krokem nebo kratší úseky. Náročnější: postupně rychlejší stejná trasa. Reakce na pokyn trenéra mění úkol; pokud ji použiješ, poznamenej odlišné zadání.",
        "Easier: walk the whole course or shorten its sections. Harder: gradually increase speed on the same course. Responding to a coach cue changes the task; note the different instructions if used."
      ],
      "foc": [
        "Zapisuj celou skutečně absolvovanou trasu v metrech: A–B–C–D–B–A. Její délka je 2×AB + 2×BC + 2×BD; samotná délka kmene T nestačí. Poznamenej rozměry, počet průchodů a první boční směr. Nejde o standardizovaný test ani časovou normu; původní záznamy nepřepočítávej.",
        "Record the whole completed route in metres: A–B–C–D–B–A. Its length is 2×AB + 2×BC + 2×BD; the stem of the T alone is not the total. Note the dimensions, number of passes and first lateral direction. This is not a standardized test or time norm; do not convert earlier records."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "T Drill",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/171/t-drill/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "four_training_cones"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_t_drill",
      "atlasId": "ex26_t_drill",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "2835e2e8869731cb6a1085a093a4ce8ea0ea1ac09b30cfb157155b9d574193de",
        "thumb": "/expansion-atlas/ex26_t_drill-original-256.webp",
        "detail": "/expansion-atlas/ex26_t_drill-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_t_drill-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_t_drill-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_t_drill-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_t_drill-fill-960.webp"
      },
      "sourceSha256": "2835e2e8869731cb6a1085a093a4ce8ea0ea1ac09b30cfb157155b9d574193de",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_t_drill",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "four_training_cones"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "cd9e8489b623bfb7": {
        "before": {
          "cz": "Běžecký T-drill",
          "en": "T Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běžecký T-drill",
          "en": "T Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_ladder_multidir": {
    "profiles": {
      "c5e4e97104c1a6f2": {
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
      }
    },
    "edits": {
      "pos": [
        "Plochý koordinační žebřík polož rovně na neklouzavý povrch; příčky a okraje nesmějí odstávat. Nech volné místo na obou koncích i po stranách. Stůj vlevo vedle prvního pole a dívej se podél žebříku.",
        "Lay a flat agility ladder on a non-slip surface, with no raised rungs or edges. Leave clear space at both ends and alongside it. Stand to the left of the first square, facing along the ladder."
      ],
      "exe": [
        "Pravá do prvního pole, levá do stejného pole, pravá ven vpravo a mírně vpřed. Potom levá do druhého pole, pravá k ní, levá ven vlevo a mírně vpřed. Takto pokračuj cikcak: dvě nohy postupně dovnitř, jedna ven. Z opačné výchozí strany pořadí zrcadli.",
        "Right into the first square, left into the same square, right outside to the right and slightly forward. Then left into the second square, right alongside it, left outside to the left and slightly forward. Continue the zigzag: two feet successively in, one out. Mirror the order when starting on the opposite side."
      ],
      "wat": [
        "Našlapuj do polí, ne na příčky. Tempo přidej až při jistém pořadí a přesném došlapu; při zakopávání nebo bolesti zastav.",
        "Place feet inside the squares, not on rungs. Increase tempo only with a secure sequence and accurate contacts; stop if you trip or have pain."
      ],
      "pro": [
        "Lehčí: pomalý nácvik dvou navazujících polí. Náročnější: plynulý průchod bez ztráty pořadí. Dvě nohy ven z pole jsou jiný rytmus; nezaměňuj ho s touto tříkrokovou variantou.",
        "Easier: slowly rehearse two linked squares. Harder: complete a fluent pass without losing the order. Taking both feet outside is a different rhythm; do not confuse it with this three-contact pattern."
      ],
      "foc": [
        "Pro nový předpis určuj metry podél délky žebříku od prvního do posledního vymezeného bodu; boční odchylky k délce nepřičítej. Je to délka průchodu, ne dráha každého chodidla. Zapiš počet průchodů a výchozí stranu. Dosavadní způsob měření zachovej a nejasnou historii nepřepočítávej.",
        "For a new prescription, define metres along the ladder from the first to the last marked point, without adding lateral excursions. This is the pass length, not each foot’s travel. Note the number of passes and starting side. Keep the existing measurement convention and do not convert unclear history."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Multidirectional Ladder Drill",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/172/multidirectional-ladder-drill/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_ladder_multidir",
      "atlasId": "ex26_ladder_multidir",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "1bc1a2b9874efe339318631a41b093e47bbcf75cce05b9f05977c841c2a8109a",
        "thumb": "/expansion-atlas/ex26_ladder_multidir-original-256.webp",
        "detail": "/expansion-atlas/ex26_ladder_multidir-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_ladder_multidir-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_ladder_multidir-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_ladder_multidir-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_ladder_multidir-fill-960.webp"
      },
      "sourceSha256": "1bc1a2b9874efe339318631a41b093e47bbcf75cce05b9f05977c841c2a8109a",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_ladder_multidir",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "c5e4e97104c1a6f2": {
        "before": {
          "cz": "Žebřík: dovnitř–dovnitř–ven",
          "en": "In-In-Out Ladder Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Žebřík: dovnitř–dovnitř–ven",
          "en": "In-In-Out Ladder Drill",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_ladder_forward": {
    "profiles": {
      "5260c522f09db17d": {
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
      }
    },
    "edits": {
      "pos": [
        "Plochý koordinační žebřík polož rovně na neklouzavý povrch; příčky a okraje nesmějí odstávat. Nech volné místo na obou koncích i po stranách. Postav se čelem k prvnímu poli. Rozteč nastav podle přirozené délky kroku.",
        "Lay a flat agility ladder on a non-slip surface, with no raised rungs or edges. Leave clear space at both ends and alongside it. Face the first square. Set spacing to suit your natural step length."
      ],
      "exe": [
        "Postupuj vpřed s jedním došlapem do každého dalšího pole a střídej nohy. Paže se pohybují přirozeně proti nohám. Za posledním polem plynule zpomal a vrať se mimo žebřík.",
        "Move forward with one foot contact in each successive square, alternating legs. Let the arms alternate naturally opposite the legs. Slow down beyond the last square and return outside the ladder."
      ],
      "wat": [
        "Nenuť délku kroku do nevhodné rozteče a nešlapej na příčky. Při ztrátě rytmu zpomal nebo přeruš průchod.",
        "Do not force the stride to fit unsuitable spacing or step on rungs. Slow down or pause if the rhythm breaks."
      ],
      "pro": [
        "Lehčí: přesná chůze. Náročnější: rychlejší stejný rytmus. Dva došlapy v poli jsou jiná varianta, ne povinná další úroveň.",
        "Easier: accurate walking. Harder: a faster version of the same rhythm. Two contacts per square are a different variation, not a required next level."
      ],
      "foc": [
        "Zapisuj metry vymezeného průchodu od začátku ke konci, ne počet polí nebo kroků. Délku, počet průchodů a způsob návratu poznamenej; klidný návrat mimo dráhu do pracovních metrů nezahrnuj. Dosavadní konvenci zachovej a starší záznamy nepřepočítávej. Střídej také první nohu mezi průchody; metrika nemá strany ani opakování.",
        "Record metres along the defined pass from start to finish, not the number of squares or steps. Note the length, number of passes and return method; exclude an easy return outside the course from working metres. Keep your existing convention and do not convert earlier records. Alternate the starting foot between passes as well; the metric has no sides or repetitions."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Forward Linear Ladder Drill",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/175/forward-linear-ladder-drill/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_ladder_forward",
      "atlasId": "ex26_ladder_forward",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "2b1df74c79a0ba6b44d52efa610f74647e73dd1eec843b21b53606b12e72b8cb",
        "thumb": "/expansion-atlas/ex26_ladder_forward-original-256.webp",
        "detail": "/expansion-atlas/ex26_ladder_forward-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_ladder_forward-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_ladder_forward-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_ladder_forward-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_ladder_forward-fill-960.webp"
      },
      "sourceSha256": "2b1df74c79a0ba6b44d52efa610f74647e73dd1eec843b21b53606b12e72b8cb",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_ladder_forward",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "agility_ladder"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "5260c522f09db17d": {
        "before": {
          "cz": "Běh vpřed koordinačním žebříkem",
          "en": "Forward Ladder Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běh vpřed koordinačním žebříkem",
          "en": "Forward Ladder Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_hurdle_run": {
    "profiles": {
      "e43c9ef20d138274": {
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
      }
    },
    "edits": {
      "pos": [
        "Nízké překážky, které při nárazu povolí, rozestav rovnoměrně na neklouzavé dráze. Výšku a rozteč přizpůsob kontrolovanému kroku; nech volný prostor za poslední překážkou.",
        "Space low, yielding hurdles evenly on a non-slip course. Match height and spacing to controlled steps, leaving clear space beyond the final hurdle."
      ],
      "exe": [
        "Běž vpřed a střídej nohy: jedna překročí příčku a došlápne mezi překážkami, druhá překročí následující. Zachovej jeden došlap mezi sousedními překážkami. Za poslední zpomal; vrať se mimo dráhu.",
        "Run forward, alternating legs: one clears a bar and lands between hurdles, then the other clears the next. Keep one contact between adjacent hurdles. Slow down beyond the last hurdle and return outside the course."
      ],
      "wat": [
        "Nepřidávej výšku za cenu zaklánění, podkluzování nebo vybočení nohy. Pokud nestačíš bezpečně překročit, zpomal a sniž překážku nebo uprav rozteč.",
        "Do not add height at the cost of leaning back, slipping or swinging the leg sideways. If clearance is insecure, slow down, lower the hurdle or adjust spacing."
      ],
      "pro": [
        "Lehčí: překračování chůzí. Náročnější: plynulejší rychlost při stejné nízké výšce. Dva kontakty mezi překážkami mění rytmus; nejsou povinnou progresí.",
        "Easier: walking step-overs. Harder: smoother speed at the same low height. Two contacts between hurdles change the rhythm; they are not a required progression."
      ],
      "foc": [
        "Zapisuj metry vymezeného průchodu od začátku ke konci, ne počet polí nebo kroků. Délku, počet průchodů a způsob návratu poznamenej; klidný návrat mimo dráhu do pracovních metrů nezahrnuj. Dosavadní konvenci zachovej a starší záznamy nepřepočítávej. Poznamenej výšku, rozteč a první nohu; záznam nepočítá překážky jako opakování.",
        "Record metres along the defined pass from start to finish, not the number of squares or steps. Note the length, number of passes and return method; exclude an easy return outside the course from working metres. Keep your existing convention and do not convert earlier records. Note the height, spacing and starting foot; the record does not count hurdles as repetitions."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Forward Hurdle Run",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/221/forward-hurdle-run/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "low_yielding_hurdles"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_hurdle_run",
      "atlasId": "ex26_hurdle_run",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "e4b788e109c30bafec98aba45e0d1e8b763237b01496758853fd41f6d21a7897",
        "thumb": "/expansion-atlas/ex26_hurdle_run-original-256.webp",
        "detail": "/expansion-atlas/ex26_hurdle_run-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hurdle_run-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hurdle_run-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hurdle_run-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hurdle_run-fill-960.webp"
      },
      "sourceSha256": "e4b788e109c30bafec98aba45e0d1e8b763237b01496758853fd41f6d21a7897",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_hurdle_run",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "low_yielding_hurdles"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "e43c9ef20d138274": {
        "before": {
          "cz": "Běh vpřed přes nízké překážky",
          "en": "Forward Low-Hurdle Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Běh vpřed přes nízké překážky",
          "en": "Forward Low-Hurdle Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_hurdle_lateral": {
    "profiles": {
      "ecc0002b09c28b94": {
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
      }
    },
    "edits": {
      "pos": [
        "Nízké překážky, které při nárazu povolí, postav do řady na neklouzavém povrchu s dostatkem místa mezi nimi i za konci. Stůj bokem ke směru průchodu.",
        "Place low, yielding hurdles in a line on a non-slip surface with space between them and beyond both ends. Stand sideways to the direction of travel."
      ],
      "exe": [
        "Vedoucí noha překročí příčku, druhá ji následuje do stejné mezery. Pokračuj do strany bez křížení nohou a se stejným směrem hrudníku. Po dokončení zastav a procvič opačný směr.",
        "The leading foot clears the bar and the other follows into the same gap. Continue sideways without crossing the feet, keeping the same facing direction. Stop after finishing and practise the opposite direction."
      ],
      "wat": [
        "Obě chodidla postupně došlapují mezi příčkami. Nepřeskakuj snožmo a nezvedej překážku na úkor jistoty kroku. Při zakopávání nebo bolesti zastav.",
        "Both feet contact the space between bars in succession. Do not jump with both feet together or increase height at the cost of secure steps. Stop if you trip or have pain."
      ],
      "pro": [
        "Lehčí: pomalé boční překračování a nižší příčky. Náročnější: plynulejší rytmus při stejných dvou došlapech mezi překážkami.",
        "Easier: slow lateral step-overs and lower bars. Harder: a smoother rhythm with the same two contacts between hurdles."
      ],
      "foc": [
        "Zapisuj metry vymezeného průchodu od začátku ke konci, ne počet polí nebo kroků. Délku, počet průchodů a způsob návratu poznamenej; klidný návrat mimo dráhu do pracovních metrů nezahrnuj. Dosavadní konvenci zachovej a starší záznamy nepřepočítávej. Uveď oba směry, výšku a rozteč. Součet metrů obou směrů zapiš jednou; nejsou to samostatné pravolevé série.",
        "Record metres along the defined pass from start to finish, not the number of squares or steps. Note the length, number of passes and return method; exclude an easy return outside the course from working metres. Keep your existing convention and do not convert earlier records. Note both directions, height and spacing. Record the sum of metres in both directions once; these are not separate right/left sets."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "Lateral Hurdle Run",
        "url": "https://www.acefitness.org/resources/everyone/exercise-library/226/lateral-hurdle-run/",
        "scope": "Local Tanmay adaptation of the verified ACE exercise sequence; not a verbatim official lesson, standardized test, universal programme or clinical claim. Route metres and historical recording conventions are local clarifications. Static artwork cannot establish the whole sequence."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "low_yielding_hurdles"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 1
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "H",
    "art": {
      "appId": "ex26_hurdle_lateral",
      "atlasId": "ex26_hurdle_lateral",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "bf574e449578e577a19f9447a9a9a153179deb44151ef448bc8b8251e3161890",
        "thumb": "/expansion-atlas/ex26_hurdle_lateral-original-256.webp",
        "detail": "/expansion-atlas/ex26_hurdle_lateral-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hurdle_lateral-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hurdle_lateral-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hurdle_lateral-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hurdle_lateral-fill-960.webp"
      },
      "sourceSha256": "bf574e449578e577a19f9447a9a9a153179deb44151ef448bc8b8251e3161890",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_hurdle_lateral",
      "measurementType": "DISTANCE",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "low_yielding_hurdles"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false
    },
    "publicDefaults": {
      "ecc0002b09c28b94": {
        "before": {
          "cz": "Boční běh přes nízké překážky",
          "en": "Lateral Low-Hurdle Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Boční běh přes nízké překážky",
          "en": "Lateral Low-Hurdle Run",
          "measurementType": "DISTANCE",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_py_ankling": {
    "profiles": {
      "928c705819099f12": {
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
      }
    },
    "edits": {
      "pos": [
        "Zvol rovnou neklouzavou dráhu s pružným, stabilním povrchem a místem pro zastavení. Začni vzpřímeně; nepotřebuješ švihadlo, překážky ani kužely.",
        "Choose a level, non-slip lane with a resilient, stable surface and room to stop. Start upright; no rope, hurdles or cones are required."
      ],
      "exe": [
        "Postupuj vpřed krátkými střídavými kroky a nízkými pružnými kontakty pod tělem. Každé chodidlo přenes jen nad úroveň protějšího kotníku; kolena zůstávají nízko. Paže se pohybují přirozeně proti nohám.",
        "Move forward with short alternating steps and low, springy contacts beneath the body. Lift each foot only just above the opposite ankle; keep the knees low. Let the arms alternate naturally opposite the legs."
      ],
      "wat": [
        "Nesahej chodidlem daleko před tělo a neodrážej se snožmo. Udrž lehký rytmus bez zatínání ramen; při bolesti, zakopávání nebo ztrátě kontroly zastav.",
        "Do not reach the foot far ahead of the body or hop with both feet together. Keep an easy rhythm without tensing the shoulders; stop if pain, tripping or loss of control occurs."
      ],
      "pro": [
        "Lehčí: stejný krátký přenos chodidel pomalou chůzí bez poskoků. Náročnější: plynulejší rytmus při stejné nízké výšce. Přechod do běhu je další úkol, ne povinné prodloužení každé série. Mezi sériemi obnov klidný, kontrolovaný pohyb.",
        "Easier: use the same short foot action in slow walking without hops. Harder: a smoother rhythm at the same low height. Transitioning into a run is another task, not a required extension of every set. Recover calm, controlled movement between sets."
      ],
      "foc": [
        "Pro nový předpis počítej každý střídavý kontakt chodidla jako jedno opakování: pravá + levá = dvě celkem. Nejde o počet dvojic ani pravolevé série. Délku dráhy a rytmus lze poznamenat; staré záznamy nepřepočítávej.",
        "For a new prescription, count each alternating foot contact as one repetition: right + left = two in total. Do not count pairs or separate right/left sets. Lane length and rhythm may be noted; do not convert old records."
      ],
      "source": {
        "author": "Athletics Ireland",
        "document": "AAi Coach E-coaching Manual: Sprints, Ankling, p. 16",
        "url": "https://www.athleticsireland.ie/wp-content/uploads/2024/10/AAI-Coach_Sprints_Manual.pdf",
        "scope": "Verified forward ankle step-over cue; local springy-contact adaptation and recording convention. Not a verbatim official lesson, sprint-performance guarantee or universal dose."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power",
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "I",
    "art": {
      "appId": "ex26_py_ankling",
      "atlasId": "ex26_py_ankling",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "57c35a8aa24b9f53d661adb0ea2acd73948daf3dcda30825448d91bef6379979",
        "thumb": "/expansion-atlas/ex26_py_ankling-original-256.webp",
        "detail": "/expansion-atlas/ex26_py_ankling-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_py_ankling-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_py_ankling-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_py_ankling-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_py_ankling-fill-960.webp"
      },
      "sourceSha256": "57c35a8aa24b9f53d661adb0ea2acd73948daf3dcda30825448d91bef6379979",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_py_ankling",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "928c705819099f12": {
        "before": {
          "cz": "Kotníkové odrazy ve střídavém běžeckém rytmu",
          "en": "Traveling Ankling",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Kotníkové odrazy ve střídavém běžeckém rytmu",
          "en": "Traveling Ankling",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_py_skip_distance": {
    "profiles": {
      "b41b1eab95a54b57": {
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
      }
    },
    "edits": {
      "pos": [
        "Zvol rovnou neklouzavou dráhu s pružným, stabilním povrchem a místem pro zastavení. Začni vzpřímeně; nepotřebuješ švihadlo, překážky ani kužely. Nejprve si ověř lehký rytmus krok–poskok.",
        "Choose a level, non-slip lane with a resilient, stable surface and room to stop. Start upright; no rope, hurdles or cones are required. First rehearse an easy step–hop rhythm."
      ],
      "exe": [
        "Vykroč na jednu nohu a z ní se odraz vpřed s volným kolenem před tělem. Dopadni na tutéž odrazovou nohu, potom vykroč druhou a zopakuj. Paže pracují proti nohám; drž návaznost krok–poskok, nikoli skok přímo z jedné nohy na druhou.",
        "Step onto one foot and push forward from it, bringing the free knee ahead. Land on the same take-off foot, then step onto the other foot and repeat. Move the arms opposite the legs; keep a step–hop sequence, rather than bounding directly from one leg to the other."
      ],
      "wat": [
        "Začni nízkými odrazy. Když ztrácíš rytmus, jistotu dopadu nebo se objeví bolest, sérii ukonči. Před další počkej na obnovení kontroly; pevný čas pauzy sám neurčuje připravenost. Vzdálenost vytvářej odrazem, ne natahováním chodidla daleko před tělo.",
        "Begin with low hops. End the set if rhythm or landing control deteriorates, or if pain appears. Recover control before the next set; a fixed rest time alone does not establish readiness. Create distance through push-off, not by reaching the foot far ahead."
      ],
      "pro": [
        "Lehčí: nízký krátký skipping nebo nejprve chůze s přenášením váhy. Náročnější: postupně větší posun při jistém dopadu a stejném rytmu. Delší dráha, větší odraz i více opakování zvyšují nároky; nepřidávej je všechny současně.",
        "Easier: low, short skipping, or first walk while transferring weight. Harder: gradually travel farther per hop while keeping secure landings and the same rhythm. A longer lane, a bigger hop and more repetitions all increase demand; do not increase all of them together."
      ],
      "foc": [
        "Pro nový předpis počítej jeden dokončený poskok s dopadem na odrazovou nohu jako jedno opakování; přestupový krok zvlášť nepočítej. Jeden poskok vpravo a jeden vlevo jsou dvě opakování celkem, bez samostatných stran. Dřívější způsob počítání neměň. Metry nejsou zde hlavní metrika; zvolenou délku a úsilí poznamenej.",
        "For a new prescription, count one completed hop landing on its take-off foot as one repetition; do not count the transfer step separately. One right and one left hop are two total repetitions, without separate sides. Keep earlier counting conventions unchanged. Metres are not the primary metric here; note the chosen distance and effort."
      ],
      "source": {
        "author": "John Garrish / TeamBuildr",
        "document": "Designing and Implementing an Effective Sprint Session, Summer of Speed, pp. 21–26",
        "url": "https://www.teambuildr.com/hubfs/Speed%20eBook%20-%20Summer%20of%20Speed-1.pdf",
        "scope": "Verified named power-skip-for-distance progression, pp. 23–25; locally written step–hop technique and counting convention. Not a reproduced official lesson or universal programme. Same-foot landing corroborated by the indexed NSCA Basics manual p. 69; live PDF was unavailable during review."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power",
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "I",
    "art": {
      "appId": "ex26_py_skip_distance",
      "atlasId": "ex26_py_skip_distance",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "5ea956d94326aa72db66578648a9dee4cfd36269031a892ae8d654350529258e",
        "thumb": "/expansion-atlas/ex26_py_skip_distance-original-256.webp",
        "detail": "/expansion-atlas/ex26_py_skip_distance-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_py_skip_distance-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_py_skip_distance-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_py_skip_distance-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_py_skip_distance-fill-960.webp"
      },
      "sourceSha256": "5ea956d94326aa72db66578648a9dee4cfd36269031a892ae8d654350529258e",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_py_skip_distance",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "b41b1eab95a54b57": {
        "before": {
          "cz": "Odrazový skipping do dálky",
          "en": "Power Skip for Distance",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Odrazový skipping do dálky",
          "en": "Power Skip for Distance",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_py_skip_height": {
    "profiles": {
      "02720863fbecfa61": {
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
      }
    },
    "edits": {
      "pos": [
        "Zvol rovnou neklouzavou dráhu s pružným, stabilním povrchem a místem pro zastavení. Začni vzpřímeně; nepotřebuješ švihadlo, překážky ani kužely. Začni několika nízkými poskoky v rytmu krok–poskok.",
        "Choose a level, non-slip lane with a resilient, stable surface and room to stop. Start upright; no rope, hurdles or cones are required. Begin with low hops in a step–hop rhythm."
      ],
      "exe": [
        "Po kroku se z opěrné nohy odraz převážně vzhůru a volné koleno přenes před sebe. Dopadni na stejnou odrazovou nohu, potom vykroč druhou a zopakuj. Postup vpřed je krátký; paže se střídají proti nohám.",
        "After stepping, push mainly upward from the supporting foot and bring the free knee forward. Land on that same take-off foot, then step onto the other foot and repeat. Keep forward travel short and alternate the arms opposite the legs."
      ],
      "wat": [
        "Začni nízkými odrazy. Když ztrácíš rytmus, jistotu dopadu nebo se objeví bolest, sérii ukonči. Před další počkej na obnovení kontroly; pevný čas pauzy sám neurčuje připravenost. Trup drž přirozeně vzpřímený; výšku nenahrazuj zakláněním ani přitahováním kolena přes zakulacená záda.",
        "Begin with low hops. End the set if rhythm or landing control deteriorates, or if pain appears. Recover control before the next set; a fixed rest time alone does not establish readiness. Keep the trunk naturally upright; do not substitute leaning back or rounding the back to pull the knee up for actual height."
      ],
      "pro": [
        "Lehčí: nízký skipping, případně nejprve krok a klidný přenos váhy bez odrazu. Náročnější: postupně vyšší odraz se stejným krátkým postupem. Zachovej kontrolu dopadu; větší výška není povinná ani vhodná v únavě.",
        "Easier: low skipping, or first step and transfer weight calmly without a hop. Harder: gradually increase hop height while keeping forward travel short. Keep landings controlled; more height is neither compulsory nor appropriate when fatigue disrupts control."
      ],
      "foc": [
        "Pro nový předpis počítej jeden dokončený poskok s dopadem na odrazovou nohu jako jedno opakování; přestupový krok zvlášť nepočítej. Jeden poskok vpravo a jeden vlevo jsou dvě opakování celkem, bez samostatných stran. Dřívější způsob počítání neměň. Výšku ani metry aplikace v této kartě neměří; rozdílné zadání poznamenej.",
        "For a new prescription, count one completed hop landing on its take-off foot as one repetition; do not count the transfer step separately. One right and one left hop are two total repetitions, without separate sides. Keep earlier counting conventions unchanged. This card does not measure height or metres; note any change in the task."
      ],
      "source": {
        "author": "John Garrish / TeamBuildr",
        "document": "Designing and Implementing an Effective Sprint Session, Summer of Speed, pp. 21–26",
        "url": "https://www.teambuildr.com/hubfs/Speed%20eBook%20-%20Summer%20of%20Speed-1.pdf",
        "scope": "Verified named power-skip-for-height progression, pp. 23–25; locally written step–hop technique and counting convention. Not a reproduced official lesson or universal programme. Same-foot landing corroborated by the indexed NSCA Basics manual p. 69; live PDF was unavailable during review."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power",
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "I",
    "art": {
      "appId": "ex26_py_skip_height",
      "atlasId": "ex26_py_skip_height",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "10ad46a7ac704d23fd853f8c5da1923a4922b9168cff69552619cb88f9312f1a",
        "thumb": "/expansion-atlas/ex26_py_skip_height-original-256.webp",
        "detail": "/expansion-atlas/ex26_py_skip_height-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_py_skip_height-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_py_skip_height-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_py_skip_height-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_py_skip_height-fill-960.webp"
      },
      "sourceSha256": "10ad46a7ac704d23fd853f8c5da1923a4922b9168cff69552619cb88f9312f1a",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_py_skip_height",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "02720863fbecfa61": {
        "before": {
          "cz": "Odrazový skipping do výšky s postupem vpřed",
          "en": "Power Skip for Height",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Odrazový skipping do výšky s postupem vpřed",
          "en": "Power Skip for Height",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_py_skip_backward": {
    "profiles": {
      "a61cfae51b53062c": {
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
      }
    },
    "edits": {
      "pos": [
        "Zvol rovnou neklouzavou dráhu s pružným, stabilním povrchem a místem pro zastavení. Začni vzpřímeně; nepotřebuješ švihadlo, překážky ani kužely. Předem projdi prostor za sebou a ověř, že do dráhy nikdo nevstupuje.",
        "Choose a level, non-slip lane with a resilient, stable surface and room to stop. Start upright; no rope, hurdles or cones are required. Walk through the space behind you first and check that nobody is entering the lane."
      ],
      "exe": [
        "Udělej krátký krok vzad na jednu nohu, na ní nízce poskoč a dopadni opět na ni. Potom přestup vzad na druhou a zopakuj. Trup zůstává čelem k původnímu směru; celé tělo se přesouvá vzad v rytmu krok–poskok.",
        "Take a short backward step onto one foot, make a low hop on it and land on it again. Then step backward onto the other foot and repeat. Keep facing the original direction while the body travels backward in a step–hop rhythm."
      ],
      "wat": [
        "Začni nízkými odrazy. Když ztrácíš rytmus, jistotu dopadu nebo se objeví bolest, sérii ukonči. Před další počkej na obnovení kontroly; pevný čas pauzy sám neurčuje připravenost. Kroky drž krátké. Potřebuješ-li znovu zkontrolovat dráhu, zastav a rozhlédni se; necouvej naslepo ani v otočení.",
        "Keep the steps short. If you need to check the lane again, stop and look; do not continue backward blindly or while twisting. Begin with low hops. End the set if rhythm or landing control deteriorates, or if pain appears. Recover control before the next set; a fixed rest time alone does not establish readiness."
      ],
      "pro": [
        "Lehčí: krátká pomalá chůze vzad bez poskoků; při nejistotě nejprve nácvik s trenérem. Náročnější: plynulejší stejný nízký rytmus. Rychlost ani výška nejsou cílem této základní varianty.",
        "Easier: short, slow backward steps without hops; if unsure, first rehearse with a coach. Harder: make the same low rhythm more continuous. Speed and height are not the goal of this basic variation."
      ],
      "foc": [
        "Pro nový předpis počítej jeden dokončený poskok s dopadem na odrazovou nohu jako jedno opakování; přestupový krok zvlášť nepočítej. Jeden poskok vpravo a jeden vlevo jsou dvě opakování celkem, bez samostatných stran. Dřívější způsob počítání neměň. Zapiš směr vzad a případnou změnu dráhy; chůzi jako lehčí úpravu výslovně poznamenej.",
        "For a new prescription, count one completed hop landing on its take-off foot as one repetition; do not count the transfer step separately. One right and one left hop are two total repetitions, without separate sides. Keep earlier counting conventions unchanged. Note backward travel and any course change; explicitly note walking when used as an easier modification."
      ],
      "source": {
        "author": "John Garrish / TeamBuildr",
        "document": "Designing and Implementing an Effective Sprint Session, Summer of Speed, pp. 21–26",
        "url": "https://www.teambuildr.com/hubfs/Speed%20eBook%20-%20Summer%20of%20Speed-1.pdf",
        "scope": "Verified inclusion of Simple Skips Backward in the author’s sprint preparation example, p. 24. The detailed backward step–hop sequence is an independent local clarification, not a verified frame-by-frame official demonstration. No rope skipping or backward line hops implied."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "power",
        "coordination"
      ],
      "positions": [
        "standing"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "I",
    "art": {
      "appId": "ex26_py_skip_backward",
      "atlasId": "ex26_py_skip_backward",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "fd4834a2cb5efc47ebf0e97763accdfe1c3526243fac1c562ae518a70eabc381",
        "thumb": "/expansion-atlas/ex26_py_skip_backward-original-256.webp",
        "detail": "/expansion-atlas/ex26_py_skip_backward-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_py_skip_backward-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_py_skip_backward-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_py_skip_backward-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_py_skip_backward-fill-960.webp"
      },
      "sourceSha256": "fd4834a2cb5efc47ebf0e97763accdfe1c3526243fac1c562ae518a70eabc381",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_py_skip_backward",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "a61cfae51b53062c": {
        "before": {
          "cz": "Skipping s posunem vzad",
          "en": "Backward Skip",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Skipping s posunem vzad",
          "en": "Backward Skip",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 150,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "tgu": {
    "profiles": {
      "9a05988f967786ef": {
        "id": "tgu",
        "cz": "Tureckej vstávák",
        "en": "Turkish Get-Up",
        "pat": "prenos",
        "S": 3,
        "C": 4,
        "J": {
          "ram": 2,
          "pat": 1
        },
        "pop": 2,
        "eq": [
          "zavazi"
        ],
        "mode": "reps",
        "mp": [
          "sho",
          "abs"
        ],
        "ms": [
          "obl",
          "glu",
          "qua",
          "tra"
        ],
        "dot": [
          60,
          90
        ],
        "ez": null,
        "hd": null,
        "foc": [
          "Oko drží závaží celou cestu nahoru.",
          "The eye stays on the weight the whole way up."
        ],
        "pos": [
          "Leh na zádech, závaží v napnuté paži nad ramenem, stejnostranné koleno pokrčené.",
          "Lie on the back, weight in a straight arm above the shoulder, same-side knee bent."
        ],
        "exe": [
          "Přes loket do sedu, do mostu, koleno pod sebe, vstaň. Stejnou cestou zpět.",
          "Roll to the elbow, to the hand, bridge, sweep the knee under, stand. Reverse the same way."
        ],
        "wat": [
          "Paže zůstává svislá. Když se ohne, končíš sérii.",
          "The arm stays vertical. When it bends, the set is over."
        ],
        "pro": [
          "Nauč se to nejdřív s botou nebo prázdnou rukou. Váha přijde až po tvaru.",
          "Learn it with a shoe or an empty hand first. Load comes after shape."
        ]
      }
    },
    "edits": {
      "pos": [
        "Připrav volný prostor na pevné neklouzavé ploše. Pro zatížený nácvik použij jeden kettlebell nebo jednu jednoručku. Začni na boku u závaží, oběma rukama je přiveď k hrudníku, přetoč se na záda a pomoz si do svislé paže. Příklad vpravo: pravé koleno pokrčené, chodidlo na zemi; levá paže a noha šikmo od těla.",
        "Prepare clear space on a firm, non-slip surface. For loaded practice, use one kettlebell or one dumbbell. Start on your side beside the weight, bring it to the chest with both hands, roll onto the back and assist it into a vertical arm. Right-side example: bend the right knee with the foot planted; place the left arm and leg diagonally away."
      ],
      "exe": [
        "Se závažím v pravé ruce přejdi přes levou oporu o loket na dlaň do sedu. Přes pravé chodidlo a levou dlaň zvedni pánev, levou nohu protáhni pod tělem a polož levé koleno. Srovnej levou holeň pro poloklek, odlep levou dlaň a narovnej trup. Přes pravé chodidlo vstaň a levou nohou přikroč. Zpět vykroč levou nohou do kleku, polož levou dlaň stranou od levého kolena, protáhni levou nohu vpřed, polož pánev a přes levý loket se vrať na záda. Teprve vleže stáhni závaží s pomocí druhé ruky k hrudníku a odlož je otočením na bok. Vlevo vše zrcadlově.",
        "With the weight in the right hand, roll onto the left elbow, then press onto the palm into sitting. Lift the hips through the right foot and left palm, sweep the left leg underneath and place the left knee down. Align the left shin for half-kneeling, lift the left palm and bring the trunk upright. Rise through the right foot and step the left foot forward. Reverse by stepping the left leg back to kneeling, placing the left palm to the side of the left knee, sweeping the left leg forward and lowering the hips; return through the left elbow onto the back. Only when lying down, assist the weight to the chest with the other hand and roll onto your side to set it down. Mirror everything on the left."
      ],
      "wat": [
        "Držené závaží udrž nad opěrnou linií ramene a ruky; při přechodech u země je sleduj. Neotáčej zatížené koleno silou. Při ztrátě kontroly, podklesnutí paže nebo bolesti další opakování nezačínej; zátěž odlož zvládnutou cestou. O celý pohyb se nepokoušej s váhou, kterou neumíš bezpečně dostat do výchozí polohy a zpět.",
        "Keep the held weight stacked over the shoulder and hand; watch it during the transitions near the floor. Do not force a twist through a loaded knee. Do not begin another repetition if control deteriorates, the arm gives way or pain occurs; set the weight down through a controlled route. Do not attempt the full movement with a weight you cannot confidently bring into and out of the starting position."
      ],
      "pro": [
        "Nejprve nacvič jednotlivé přechody bez závaží, případně s botou vyváženou na pěsti. Teprve po jistém pohybu tam i zpět přidej lehkou zátěž. Zátěž ani počet opakování nenavyšuj na úkor opor a klidného návratu; mezi pokusy obnov kontrolu. Samotný uplynulý čas pauzy není důvod přidat váhu.",
        "First rehearse the individual transitions unloaded, optionally balancing a shoe on the fist. Add a light load only after the outward and return movements are controlled. Do not increase load or repetitions at the expense of stable supports and a calm return; recover control between attempts. Elapsed rest time alone is not a reason to add weight."
      ],
      "foc": [
        "Pro nový předpis: jeden přechod ze zad až do stoje a zpět na záda je jedno opakování na straně držící paže. Zapisuj hmotnost jednoho drženého závaží, nikoli součet obou stran ani tělesnou hmotnost. Pravou a levou stranu odděl; typ náčiní a nácvik bez zátěže (0 kg) poznamenej. Dřívější záznamy nepřepočítávej.",
        "For a new prescription, one transition from the back to standing and back to supine is one repetition on the side of the holding arm. Record the mass of the single held weight, not the sum of both sides or body weight. Keep right and left separate; note the equipment type and unloaded practice (0 kg). Do not convert earlier records."
      ],
      "source": {
        "author": "Pete McCall / American Council on Exercise",
        "document": "The ACE Do It Better Series: The Turkish Get-Up, March 2025",
        "url": "https://www.acefitness.org/continuing-education/certified/march-2025/8824/the-ace-do-it-better-series-the-turkish-get-up/",
        "scope": "Primary sequence supports roll-to-elbow, hand support, bridge and opposite-leg sweep, half-kneeling, standing and reverse. Local bilingual cues and a new-prescription counting convention, not a verbatim lesson. No injury-prevention, pain-treatment, calorie or performance promise. A specified new setup with one kettlebell or dumbbell does not identify the equipment in historic generic-load records."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination",
        "strength"
      ],
      "positions": [
        "supine",
        "seated",
        "kneeling",
        "standing"
      ],
      "supports": [
        "forearm_support",
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "kettlebell",
          "dumbbell"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc",
      "equipmentDetail"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment",
      "allowEstimatedMax"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "segment": "J",
    "art": {
      "appId": "tgu",
      "atlasId": "tgu",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ce058c1ef22a2445e1950affb1e814ca92c28e62448f0682814e088c179bb2d1",
        "thumb": "/unified-atlas/tgu-852419a89eb869bb-thumb.webp",
        "detail": "/unified-atlas/tgu-12a3cb1829cf8548-detail.webp",
        "inkThumb": "/unified-atlas/tgu-3ec92361d48e5a40-inkThumb.webp",
        "inkDetail": "/unified-atlas/tgu-bcf2eb0b72843726-inkDetail.webp",
        "fillThumb": "/unified-atlas/tgu-30c2312a1cd38740-fillThumb.webp",
        "fillDetail": "/unified-atlas/tgu-d78a0af5fdfb7018-fillDetail.webp"
      },
      "sourceSha256": "ce058c1ef22a2445e1950affb1e814ca92c28e62448f0682814e088c179bb2d1",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "tgu",
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide",
      "requirements": [
        [
          "kettlebell",
          "dumbbell"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false,
      "allowEstimatedMax": false
    },
    "publicDefaults": {
      "9a05988f967786ef": {
        "before": {
          "cz": "Tureckej vstávák",
          "en": "Turkish Get-Up",
          "measurementType": "WEIGHT_REPS",
          "defaultRestSec": 120,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Tureckej vstávák",
          "en": "Turkish Get-Up",
          "measurementType": "WEIGHT_REPS",
          "defaultRestSec": 120,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_half_getup": {
    "profiles": {
      "b036d5d2135b5bb6": {
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
      }
    },
    "edits": {
      "pos": [
        "Připrav pevnou neklouzavou plochu a volný prostor. Začni bez zátěže; později použij jeden lehký kettlebell nebo jednu jednoručku. Příklad vpravo: lehni na záda, pravou paži drž svisle, pravé koleno pokrč a chodidlo opři. Levá paže a noha leží šikmo od těla. Závaží přiveď do polohy i odlož s pomocí obou rukou přes leh na boku.",
        "Prepare a firm, non-slip surface and clear space. Begin unloaded; later use one light kettlebell or one dumbbell. Right-side example: lie on the back with the right arm vertical, the right knee bent and foot planted. Place the left arm and leg diagonally away. Use both hands and a side-lying transition to bring the weight into position and set it down."
      ],
      "exe": [
        "Přes pravé chodidlo a levou oporu o předloktí se přetoč na levý loket. Potom přejdi na levou dlaň do vysokého sedu; pánev zůstává na zemi. Přes levé předloktí se pomalu vrať na záda. Následuje druhá strana. Tato varianta končí v sedu: nepřidávej most, podsunutí kolena ani stoj.",
        "Roll onto the left elbow using the right foot and left forearm support. Then press onto the left palm into a tall sit, keeping the pelvis on the floor. Return slowly through the left forearm onto the back. Repeat on the other side. This variation ends in sitting: do not add a bridge, knee sweep or standing."
      ],
      "wat": [
        "Horní paže a závaží zůstávají nad ramenem; při přechodu je sleduj. Nepropadej se v opěrném rameni a nepřetáčej zatížené zápěstí. Při bolesti, ztrátě opory nebo kontroly zátěže další opakování nezačínej.",
        "Keep the upper arm and weight stacked over the shoulder and watch them during the transition. Do not collapse into the supporting shoulder or twist the loaded wrist. Do not begin another repetition if pain appears or support or load control deteriorates."
      ],
      "pro": [
        "Lehčí: bez zátěže jen přetočení na loket a zpět; zkrácený rozsah poznamenej. Náročnější: nejprve jistý sed i návrat s lehkým závažím, později jiná dostupná hmotnost. Plný turecký vstávák se učí zvlášť. Pauza má obnovit kontrolu, nikoli splnit univerzální počet minut.",
        "Easier: roll only to the elbow and back without a load; note the shortened range. Harder: first control the tall sit and return with a light weight, then consider another available load. Learn the full Turkish get-up separately. Rest to recover control, rather than to meet a universal number of minutes."
      ],
      "foc": [
        "Pro nový předpis: ze zad do vysokého sedu a zpět je jedno opakování na straně zvednuté paže. Zapisuj hmotnost jednoho drženého závaží; bez závaží 0 kg. Pravou a levou stranu odděl a poznamenej typ náčiní i zkrácený rozsah. Staré počty ani hmotnosti neměň.",
        "For a new prescription, moving from supine to tall sitting and back is one repetition on the side of the raised arm. Record the mass of the single held weight; use 0 kg when unloaded. Keep right and left separate and note equipment type and any shortened range. Do not change earlier counts or loads."
      ],
      "source": {
        "author": "American Council on Exercise",
        "document": "FitnessMatters, January/February 2010, Turkish Half Get-up, printed page 9",
        "url": "https://contentcdn.eacefitness.com/cp/pdfs/FitnessMatters/Jan10.pdf",
        "scope": "Primary half-get-up to upright sitting; local tall-sit endpoint and explicit elbow-to-palm transition clarified with ACE full-get-up sequence. The PDF contains a conflicting right-support-arm bullet while the right arm holds the bell; opposite-arm support is retained from its subsequent cue and corroborating ACE sequence. The earlier snatch study does not establish benefits or dose for this half-get-up. New-prescription count and one-object load convention only; no historic conversion."
      }
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "strength",
        "coordination"
      ],
      "positions": [
        "supine",
        "seated"
      ],
      "supports": [
        "forearm_support",
        "hand_support"
      ],
      "equipmentRequirements": [
        [
          "kettlebell",
          "dumbbell"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc",
      "equipmentDetail"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment",
      "allowEstimatedMax"
    ],
    "recording": {
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide"
    },
    "segment": "J",
    "art": {
      "appId": "ex26_half_getup",
      "atlasId": "ex26_half_getup",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "3e6e71e3d6167d028030e6f09cb70a5a6cbb6a4785a925449054d1014759109c",
        "thumb": "/expansion-atlas/ex26_half_getup-original-256.webp",
        "detail": "/expansion-atlas/ex26_half_getup-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_half_getup-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_half_getup-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_half_getup-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_half_getup-fill-960.webp"
      },
      "sourceSha256": "3e6e71e3d6167d028030e6f09cb70a5a6cbb6a4785a925449054d1014759109c",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_half_getup",
      "measurementType": "WEIGHT_REPS",
      "loadMode": "ext",
      "sideMode": "perSide",
      "requirements": [
        [
          "kettlebell",
          "dumbbell"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": false,
      "allowEstimatedMax": false
    },
    "publicDefaults": {
      "b036d5d2135b5bb6": {
        "before": {
          "cz": "Poloviční turecký vstávák do sedu",
          "en": "Turkish Half Get-Up to Tall Sit",
          "measurementType": "WEIGHT_REPS",
          "defaultRestSec": 120,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Poloviční turecký vstávák do sedu",
          "en": "Turkish Half Get-Up to Tall Sit",
          "measurementType": "WEIGHT_REPS",
          "defaultRestSec": 120,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ig29_buttock_walk": {
    "profiles": {
      "857b04e88533b3e5": {
        "id": "ig29_buttock_walk",
        "cz": "Chůze po hýždích",
        "en": "Buttock Walk",
        "pat": "prenos",
        "eq": [
          "telo"
        ],
        "mp": [
          "obl",
          "abs"
        ],
        "ms": [
          "hipflex",
          "glu"
        ],
        "S": 1,
        "C": 2,
        "J": {
          "kyc": 1,
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
        "family": "seated_locomotion",
        "variantKey": "ig29_buttock_walk",
        "ez": null,
        "hd": null,
        "defaultRestSec": 60,
        "collection": "instagram_practical",
        "aliases": [
          "buttock walking",
          "seated butt walk",
          "chůze po zadku"
        ],
        "searchAliases": [
          "buttock walking",
          "seated butt walk",
          "chůze po zadku"
        ],
        "pos": [
          "Sedni na podložku, nohy vpřed, kolena mírně povolená. Ruce drž volně před tělem.",
          "Sit on a mat with legs forward and knees soft. Keep hands free in front."
        ],
        "exe": [
          "Střídavě nadlehči a o kousek posuň pravou a levou sedací stranu vpřed. Nohy následují pánev. Jeden posun jedné strany počítej jako opakování.",
          "Alternately unweight and advance each sitting side a little. Let the legs follow. Count each single-side step as one repetition."
        ],
        "wat": [
          "Neodrážej se rukama ani patami. Dělej malé plynulé kroky, bez prudkého kývání.",
          "Do not propel yourself with hands or heels. Take small smooth steps without violent rocking."
        ],
        "pro": [
          "Lehčí: přenášej váhu na místě. Těžší: více klidných kroků, potom krátký návrat pozpátku.",
          "Easier: shift weight in place. Harder: more controlled steps, then a short backward return."
        ],
        "foc": [
          "Střídej sedací strany, ruce zůstávají volné.",
          "Alternate sitting sides with hands free."
        ],
        "source": {
          "author": "UISP / Erasmus+ PACE project",
          "document": "Training Manual, Adapted Physical Activity — Mat: Exercise 2, printed page 35",
          "url": "https://www.uisp.it/settimocirie/files/principale/AFA%20in%20RSA/Pace%20-Training%20Manual-.pdf",
          "scope": "Omit the light ball, use short controlled steps on a comfortable mat and allow soft knees. No pelvic-floor, spinal or pain-treatment claims; not labelled DNS.",
          "instagram": "https://www.instagram.com/romavelych/reel/Dd1lVLTo9xK/",
          "instagramUrls": [
            "https://www.instagram.com/romavelych/reel/Dd1lVLTo9xK/"
          ]
        }
      }
    },
    "edits": {
      "equipmentDetail": [
        "Neklouzavá cvičební podložka a volný prostor pro krátký posun vpřed i návrat. Ruce nepoužívej jako oporu.",
        "A non-slip exercise mat and clear space for short forward travel and return. Do not use the hands for support."
      ]
    },
    "taxonomy": {
      "movements": [
        "locomotion"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "seated"
      ],
      "supports": [
        "unsupported"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "exercise_mat"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc",
      "equipmentDetail"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment",
      "allowEstimatedMax"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "J",
    "art": {
      "appId": "ig29_buttock_walk",
      "atlasId": "ig29_buttock_walk",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "10dd691d7d809bce63470c6167958c09c5f2e99509b795bb58fd86a7ad3f0e3c",
        "thumb": "/expansion-atlas/ig29_buttock_walk-original-256.webp",
        "detail": "/expansion-atlas/ig29_buttock_walk-original-960.webp",
        "inkThumb": "/expansion-atlas/ig29_buttock_walk-ink-256.webp",
        "inkDetail": "/expansion-atlas/ig29_buttock_walk-ink-960.webp",
        "fillThumb": "/expansion-atlas/ig29_buttock_walk-fill-256.webp",
        "fillDetail": "/expansion-atlas/ig29_buttock_walk-fill-960.webp"
      },
      "sourceSha256": "10dd691d7d809bce63470c6167958c09c5f2e99509b795bb58fd86a7ad3f0e3c",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ig29_buttock_walk",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ],
        [
          "exercise_mat"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "857b04e88533b3e5": {
        "before": {
          "cz": "Chůze po hýždích",
          "en": "Buttock Walk",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Chůze po hýždích",
          "en": "Buttock Walk",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 60,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ig29_cross_squat_getup": {
    "profiles": {
      "2239d9d5d34abfa7": {
        "id": "ig29_cross_squat_getup",
        "cz": "Vztyk ze zkříženého sedu",
        "en": "Cross Squat Get-Up",
        "pat": "prenos",
        "eq": [
          "telo"
        ],
        "mp": [
          "qua",
          "glu"
        ],
        "ms": [
          "abs",
          "foot"
        ],
        "S": 2,
        "C": 3,
        "J": {
          "kol": 2,
          "kyc": 2,
          "kot": 2
        },
        "pop": 1,
        "mode": "reps",
        "load": "none",
        "measurementType": "BODYWEIGHT_REPS",
        "sideMode": "perSide",
        "tier": "extended",
        "sessionRole": "coordination_skill",
        "goalRole": "coordination_skill",
        "genRule": "explicit",
        "family": "floor_transfer_cross_sit",
        "variantKey": "ig29_cross_squat_getup",
        "ez": null,
        "hd": null,
        "defaultRestSec": 60,
        "collection": "instagram_practical",
        "aliases": [
          "cross sit get up",
          "cross squat get up",
          "vztyk ze sedu se zkříženýma nohama"
        ],
        "searchAliases": [
          "cross sit get up",
          "cross squat get up",
          "vztyk ze sedu se zkříženýma nohama"
        ],
        "equipmentDetail": [
          "Volitelně nízká pevná podložka pod pánev a stabilní opora ruky.",
          "Optional low firm seat support and stable hand support."
        ],
        "pos": [
          "Sedni se zkříženými kotníky blízko pánve, kolena nech pohodlně rozevřená. Paže natáhni vpřed; podle potřeby použij vyšší pevný sed nebo oporu rukou.",
          "Sit with crossed ankles near the pelvis and knees comfortably open. Reach the arms forward; use a raised firm seat or hand support if needed."
        ],
        "exe": [
          "Přenes trup vpřed nad chodidla a zvedni pánev. Jednu plosku opři naplocho, druhá noha lehce pomáhá. Natáhni kolena a kyčle; až nahoře nohu odlehči a odkroč ze zkřížení. Jeden vztyk je opakování. Před návratem do sedu překřiž kotníky odlehčeným krokem, podle potřeby s oporou rukou, a pomalu dosedni. Vystřídej přední kotník.",
          "Shift forward over the feet and lift the hips. Ground one sole flat while the other foot assists lightly. Extend knees and hips; once upright, unweight a foot and step out of the crossing. Count each rise. Before returning to sitting, cross the ankles with an unloaded step, using hand support as needed, then sit down slowly. Switch the front ankle."
        ],
        "wat": [
          "Neotáčej tělo přes zatížené zkřížené nohy. Kotník nevyvracej silou; při tlaku v koleni nebo kotníku použij vyšší sed a pomoc rukou.",
          "Do not turn over loaded crossed legs. Do not force the ankle sideways; use a higher seat and hand assistance if the knee or ankle feels pressured."
        ],
        "pro": [
          "Lehčí: jen přenos váhy z vyššího sedu s rukama. Těžší: nižší sed, méně pomoci a pomalejší návrat. Měň vždy jednu podmínku.",
          "Easier: weight shifts from a raised seat with hand assistance. Harder: lower the seat, reduce assistance and slow the return, one change at a time."
        ],
        "foc": [
          "Nejdřív přenes váhu, potom se zvedni.",
          "Transfer weight first, then rise."
        ],
        "source": {
          "author": "Alex Schenker / MovNat",
          "document": "How to Perform the Cross Squat Get Up",
          "url": "https://movnat.com/cross-squat-get-up/",
          "scope": "Retain the source's floor-to-standing transfer but omit its 360-degree turn. Begin from sitting rather than a supine rocking entry. Use the primary tutorial's one-flat-foot assisted loading option, optional hand assistance and a raised starting seat; do not demand equal full-body load on both outer foot edges. Uncross by an unloaded step only after rising. No longevity score, diagnostic test, injury-prevention or treatment claim. This is an explicit coordination skill, not an unqualified beginner drill.",
          "instagram": "https://www.instagram.com/strongandmobile/p/DS5mKU_EgQ5/",
          "instagramUrls": [
            "https://www.instagram.com/strongandmobile/p/DS5mKU_EgQ5/"
          ]
        }
      }
    },
    "edits": {},
    "taxonomy": {
      "movements": [
        "locomotion",
        "squat"
      ],
      "focus": [
        "coordination"
      ],
      "positions": [
        "seated",
        "standing"
      ],
      "supports": [
        "unsupported",
        "hand_support",
        "chair_bench"
      ],
      "equipmentRequirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "priority": 2
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "source",
      "foc",
      "equipmentDetail"
    ],
    "identityFields": [
      "id",
      "pat",
      "cat",
      "rec",
      "family",
      "variantKey",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "collection",
      "mp",
      "ms",
      "J",
      "S",
      "C",
      "pop",
      "armMode",
      "tags",
      "sourcePrograms",
      "defaultRestSec",
      "warmupPolicy",
      "generatorEligible",
      "selectionPolicy",
      "equipmentRequirements",
      "status",
      "aliasOf",
      "requiresCoach",
      "requiresEquipmentCheck",
      "equipment",
      "allowEstimatedMax"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "segment": "J",
    "art": {
      "appId": "ig29_cross_squat_getup",
      "atlasId": "ig29_cross_squat_getup",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "92cce44bd0c95f61562d50e7cec7ae205c10e22810f7aeeb0fffc5c204ba10cd",
        "thumb": "/expansion-atlas/ig29_cross_squat_getup-original-256.webp",
        "detail": "/expansion-atlas/ig29_cross_squat_getup-original-960.webp",
        "inkThumb": "/expansion-atlas/ig29_cross_squat_getup-ink-256.webp",
        "inkDetail": "/expansion-atlas/ig29_cross_squat_getup-ink-960.webp",
        "fillThumb": "/expansion-atlas/ig29_cross_squat_getup-fill-256.webp",
        "fillDetail": "/expansion-atlas/ig29_cross_squat_getup-fill-960.webp"
      },
      "sourceSha256": "92cce44bd0c95f61562d50e7cec7ae205c10e22810f7aeeb0fffc5c204ba10cd",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ig29_cross_squat_getup",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide",
      "requirements": [
        [
          "telo"
        ],
        [
          "prostor"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "2239d9d5d34abfa7": {
        "before": {
          "cz": "Vztyk ze zkříženého sedu",
          "en": "Cross Squat Get-Up",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 60,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Vztyk ze zkříženého sedu",
          "en": "Cross Squat Get-Up",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 60,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_mob_scap_circles": {
    "profiles": {
      "cc17100d9fa902a9": {
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
      "9a64b4032ae8ddc0": {
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
        "ez": null,
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
      }
    },
    "edits": {
      "family": "scapular_control",
      "foc": [
        "Řízený pohyb lopatek při opřených rukou. Jeden celý kruh je jedno opakování; změnu směru uveď v poznámce, ne jako pravou a levou stranu.",
        "Controlled shoulder-blade movement with the hands planted. Count a complete circle as one repetition; note the direction rather than recording left and right sides."
      ],
      "source": {
        "author": "Jarlo Ilano / GMB Fitness",
        "document": "Shoulder Mobility: Quadruped Shoulder Circles",
        "url": "https://gmb.io/shoulder-mobility/",
        "scope": "The public Quadruped Shoulder Circles section directly supports the task and starting support. Small controlled circles, rep counting and optional regressions here are independent catalogue coaching. The source uses timed practice; no original dose, diagnostic interpretation, treatment promise or superiority claim is adopted."
      }
    },
    "taxonomy": {
      "movements": [
        "joint"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "mobility"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "J",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "K",
    "art": {
      "appId": "ex26_mob_scap_circles",
      "atlasId": "ex26_mob_scap_circles",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "a5d4272af7b6a4b3c91e51a36438bc0c38de3ad6d6298c079288fa48dd898fae",
        "thumb": "/expansion-atlas/ex26_mob_scap_circles-original-256.webp",
        "detail": "/expansion-atlas/ex26_mob_scap_circles-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_mob_scap_circles-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_mob_scap_circles-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_mob_scap_circles-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_mob_scap_circles-fill-960.webp"
      },
      "sourceSha256": "a5d4272af7b6a4b3c91e51a36438bc0c38de3ad6d6298c079288fa48dd898fae",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_mob_scap_circles",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "cc17100d9fa902a9": {
        "before": {
          "cz": "Kroužení lopatkami v opoře na čtyřech",
          "en": "Quadruped Scapular Circles",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 15,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Kroužení lopatkami v opoře na čtyřech",
          "en": "Quadruped Scapular Circles",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 15,
          "unilateral": false,
          "sideMode": "none"
        }
      },
      "9a64b4032ae8ddc0": {
        "before": {
          "cz": "Kroužení lopatkami v opoře na čtyřech",
          "en": "Quadruped Scapular Circles",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 15,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Kroužení lopatkami v opoře na čtyřech",
          "en": "Quadruped Scapular Circles",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 15,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_dns_quad_forward": {
    "profiles": {
      "85957f845483130c": {
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
      }
    },
    "edits": {
      "family": "core_antiextension",
      "pos": [
        "Na čtyřech dej dlaně přibližně pod ramena a kolena pod kyčle. Holeně a nárty nech opřené. Zvol pohodlný tlak do celé dlaně a dívej se k podlaze.",
        "On all fours, place palms roughly beneath shoulders and knees beneath hips. Keep shins and the tops of the feet supported. Spread pressure comfortably through the palms and look toward the floor."
      ],
      "exe": [
        "Plynule přenes hrudník a pánev kousek vpřed a vrať se do výchozí polohy. Ruce, kolena i chodidla zůstávají na místě. Dýchej a zvol rozsah, ve kterém udržíš oporu.",
        "Smoothly shift the chest and pelvis slightly forward, then return to the starting position. Keep the hands, knees and feet in place. Breathe and choose a range in which support remains controlled."
      ],
      "wat": [
        "Nepřidávej rozsah záklonem hlavy nebo propadnutím beder. Při nepříjemném tlaku v zápěstí přenos zmenši nebo úkol ukonči.",
        "Do not gain range by tipping the head back or sagging through the lower back. Reduce the shift or stop if pressure at the wrist becomes uncomfortable."
      ],
      "foc": [
        "Nácvik opory rukou a kontroly trupu při malém přenosu váhy. Cesta vpřed a zpět je jedno opakování. Nejde o chůzi po čtyřech ani o diagnostický test.",
        "Practise hand support and trunk control during a small weight shift. Forward and back counts as one repetition. This is not crawling or a diagnostic test."
      ],
      "source": {
        "author": "Alena Kobesova, Ida Nørgaard, Pavel Kolar",
        "document": "Dynamic Neuromuscular Stabilization, all fours position, pp. 17–18",
        "url": "https://rehabps.com/DATA/DNS_Neurorehab_Chapter.pdf",
        "scope": "The all-fours section and Figure 15 directly describe a forward rock and return with fixed supports. This is a short independent coaching adaptation, not a clinical assessment or a claim that the exercise treats a condition. The research chapter does not establish a universal dose or ranking for this catalogue."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "J",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "K",
    "art": {
      "appId": "ex26_dns_quad_forward",
      "atlasId": "ex26_dns_quad_forward",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "78af7fc1706c309b3051b3d949e06f2e2f4e8a1245a07b6731ef76ff5f42792f",
        "thumb": "/expansion-atlas/ex26_dns_quad_forward-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_quad_forward-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_quad_forward-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_quad_forward-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_quad_forward-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_quad_forward-fill-960.webp"
      },
      "sourceSha256": "78af7fc1706c309b3051b3d949e06f2e2f4e8a1245a07b6731ef76ff5f42792f",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_dns_quad_forward",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "85957f845483130c": {
        "before": {
          "cz": "DNS · přenos váhy vpřed na čtyřech",
          "en": "DNS Quadruped Forward Rock",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "DNS · přenos váhy vpřed na čtyřech",
          "en": "DNS Quadruped Forward Rock",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_dns_quad_legslide": {
    "profiles": {
      "2b9a1059a996bd47": {
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
      }
    },
    "edits": {
      "family": "core_antiextension",
      "cz": "Posun nohy vzad z opory na čtyřech",
      "en": "Quadruped Leg Slide",
      "pos": [
        "Na čtyřech opři dlaně pod rameny a kolena pod kyčlemi. Špičku posouvané nohy podviň a zvol povrch, po kterém ji zvládneš posunout bez drhnutí a bez klouzání rukou.",
        "On all fours, place palms beneath shoulders and knees beneath hips. Tuck the toes of the moving foot. Choose a surface that lets them slide comfortably while the hands stay secure."
      ],
      "exe": [
        "Posuň jednu nohu po špičce vzad do pohodlného natažení a vrať koleno pod kyčel. Obě dlaně a druhé koleno zůstávají opřené; posouvaná špička nepřestává být v kontaktu s podlahou.",
        "Slide one foot backward on its toes toward a comfortable straight-leg position, then return the knee beneath the hip. Keep both palms and the opposite knee supported, with the moving toes touching the floor throughout."
      ],
      "wat": [
        "Nedoháněj posun prohnutím zad ani otočením pánve. Pokud špička drhne, zkrať pohyb nebo uprav povrch; netahej ji silou.",
        "Do not gain distance by arching the back or turning the pelvis. If the toes drag uncomfortably, shorten the movement or adjust the surface rather than forcing the slide."
      ],
      "foc": [
        "Kontrola trupu při pohybu jedné nohy s ponechaným kontaktem špičky. Posun vzad a návrat je jedno opakování, zapisované zvlášť pro každou nohu.",
        "Trunk control while one leg moves with toe contact retained. The slide out and return is one repetition, recorded separately for each leg."
      ],
      "pro": [
        "Zkrať posun podle své kontroly. Pro další náročnost můžeš návrat zpomalit. Bird dog je jiný úkol s odlehčenou nohou a protilehlou rukou, nikoli povinné pokračování.",
        "Shorten the slide to suit your control. A slower return is an optional next challenge. Bird dog is a different task with the leg and opposite hand lifted, not a mandatory next step."
      ],
      "source": {
        "author": "Prague School of Rehabilitation",
        "document": "DNS Trainer Practical Certification Test, quadruped modifications",
        "url": "https://www.rehabps.com/sportcourse_test.html",
        "scope": "The public certification list verifies quadruped lower-limb modifications only; it does not document this exact toe-slide lesson. This catalogue retains its existing no-apparatus floor-contact variation with independent cues. The Prehab Guys slider variant was cross-checked for the slide-and-return mechanics but its separate slider and programme are not silently attributed to DNS or required here."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "aliases": [
        "DNS · posun nohy z opory na čtyřech",
        "DNS Quadruped Leg Slide"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "J",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide"
    },
    "segment": "K",
    "art": {
      "appId": "ex26_dns_quad_legslide",
      "atlasId": "ex26_dns_quad_legslide",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "ba3d79f2cd5351a1273d449b501758e789159217c968bc8d5eb91f808ff5d07c",
        "thumb": "/expansion-atlas/ex26_dns_quad_legslide-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_quad_legslide-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_quad_legslide-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_quad_legslide-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_quad_legslide-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_quad_legslide-fill-960.webp"
      },
      "sourceSha256": "ba3d79f2cd5351a1273d449b501758e789159217c968bc8d5eb91f808ff5d07c",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_dns_quad_legslide",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "perSide",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "2b9a1059a996bd47": {
        "before": {
          "cz": "DNS · posun nohy z opory na čtyřech",
          "en": "DNS Quadruped Leg Slide",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        },
        "after": {
          "cz": "Posun nohy vzad z opory na čtyřech",
          "en": "Quadruped Leg Slide",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": true,
          "sideMode": "perSide"
        }
      }
    }
  },
  "ex26_dns_bear_transition": {
    "profiles": {
      "e6373bd5c82c483d": {
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
      }
    },
    "edits": {
      "family": "core_antiextension",
      "cz": "Přechod z opory na čtyřech do medvěda",
      "en": "Quadruped-to-Bear Transition",
      "pos": [
        "Na čtyřech opři celé dlaně a podviň prsty nohou. Kolena nech přibližně pod kyčlemi. Připrav si pevný neklouzavý podklad.",
        "On all fours, plant the full palms and tuck the toes, with knees roughly beneath the hips. Use a firm, non-slip surface."
      ],
      "exe": [
        "Zvedni kolena kousek nad zem a posuň pánev mírně vzhůru a vzad. Ruce a špičky zůstávají na místě. Vrať pánev a polož kolena řízeně na podklad.",
        "Lift the knees a little, then move the pelvis slightly up and back. Keep the hands and toes in place. Bring the pelvis back and lower the knees under control."
      ],
      "foc": [
        "Plynulá změna z opory o kolena na oporu o špičky a zpět. Celý přechod s návratem je jedno opakování. Ilustrace zachycuje fázi se zvednutými koleny.",
        "A controlled change from knee support to toe support and back. The complete transition and return counts as one repetition. The illustration shows the knees lifted."
      ],
      "source": {
        "author": "Prague School of Rehabilitation",
        "document": "DNS Movement Flow: public chapter index",
        "url": "https://www.rehabps.cz/v/show_tree_sample.php?c_id=32&lang=EN&ren=",
        "scope": "The official public chapter index lists Quadruped–bear–rocking separately from Bear crawl, confirming the movement-family distinction only. The registered lesson video was not viewed. Exact range, count and cues here clarify the pre-existing catalogue task; they are not an official DNS lesson or treatment prescription."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "aliases": [
        "DNS · přechod z opory na čtyřech do medvěda",
        "DNS Quadruped-to-Bear Transition"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "J",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "K",
    "art": {
      "appId": "ex26_dns_bear_transition",
      "atlasId": "ex26_dns_bear_transition",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "6606944e0b254cd864204ab9f92218ead802c2787b5fc8a89ea009b7d5cfd7f3",
        "thumb": "/expansion-atlas/ex26_dns_bear_transition-original-256.webp",
        "detail": "/expansion-atlas/ex26_dns_bear_transition-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_dns_bear_transition-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_dns_bear_transition-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_dns_bear_transition-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_dns_bear_transition-fill-960.webp"
      },
      "sourceSha256": "6606944e0b254cd864204ab9f92218ead802c2787b5fc8a89ea009b7d5cfd7f3",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_dns_bear_transition",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "e6373bd5c82c483d": {
        "before": {
          "cz": "DNS · přechod z opory na čtyřech do medvěda",
          "en": "DNS Quadruped-to-Bear Transition",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Přechod z opory na čtyřech do medvěda",
          "en": "Quadruped-to-Bear Transition",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  },
  "ex26_hss_bear_shift": {
    "profiles": {
      "b54315cdf33e33f3": {
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
      }
    },
    "edits": {
      "family": "core_antiextension",
      "cz": "Pomalé přenosy váhy v nízkém medvědovi",
      "pos": [
        "Na čtyřech opři dlaně pod rameny, podviň prsty nohou a zvedni kolena těsně nad zem. Kolena zůstávají pod kyčlemi; hlavu drž v prodloužení trupu.",
        "On all fours, place palms beneath shoulders, tuck the toes and lift the knees just clear of the floor. Keep the knees beneath the hips and the head in line with the trunk."
      ],
      "exe": [
        "Přenes váhu o kousek vpřed, vrať se do středu a stejným způsobem zkus směr vzad nebo do strany. Dlaně a špičky zůstávají na místě, kolena nad zemí.",
        "Shift a little forward, return to centre, and similarly explore backward or sideways shifts. Keep palms and toes in place and the knees off the floor."
      ],
      "foc": [
        "Kontrola trupu s koleny nad zemí při změně rozložení váhy. Jeden přenos ze středu a návrat počítej jako opakování. Směry a jejich počet si poznamenej; zápis nerozlišuje strany.",
        "Trunk control with the knees hovering as weight distribution changes. Count one shift from centre and back as a repetition. Note the directions and their counts; recording does not separate sides."
      ],
      "pro": [
        "Lehčí je menší přenos nebo stejný pohyb s koleny na zemi. Náročnost zvyšuj jen při klidném dechu a jisté opoře; delší výdrž ani užší postoj nejsou povinným cílem.",
        "Use a smaller shift or keep the knees on the floor to simplify the task. Add challenge only while breathing comfortably and maintaining support; longer holds or a narrower stance are optional."
      ],
      "source": {
        "author": "Prague School of Rehabilitation",
        "document": "DNS Strength Training course curriculum",
        "url": "https://www.rehabps.com/strength-training.html",
        "scope": "The course curriculum lists quadruped rocking and a bear position, not this precise low-bear multidirectional drill. This is a generic independent trunk-control variation retained from the catalogue. HSS is a historical collection/search label, not evidence of a certified lesson or a clinical effect."
      }
    },
    "taxonomy": {
      "movements": [
        "trunk_stability"
      ],
      "positions": [
        "quadruped"
      ],
      "supports": [
        "hand_support"
      ],
      "focus": [
        "coordination"
      ],
      "priority": 1,
      "equipmentRequirements": [
        [
          "telo"
        ]
      ],
      "aliases": [
        "HSS · pomalé přenosy váhy v medvědovi",
        "Low-Bear Weight Shifts"
      ]
    },
    "setupFields": [
      "cz",
      "en",
      "pos",
      "exe",
      "eq",
      "foc",
      "family",
      "source"
    ],
    "identityFields": [
      "id",
      "pat",
      "variantKey",
      "mp",
      "ms",
      "tier",
      "sessionRole",
      "goalRole",
      "genRule",
      "sourcePrograms",
      "collection",
      "tags",
      "S",
      "C",
      "J",
      "pop",
      "dot",
      "armMode"
    ],
    "recording": {
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none"
    },
    "segment": "K",
    "art": {
      "appId": "ex26_hss_bear_shift",
      "atlasId": "ex26_hss_bear_shift",
      "unified": true,
      "primary": {
        "width": 960,
        "height": 960,
        "sourceSha256": "58c60c813cd0e1bf3398b1e1ecc032ffd302cf1fd5ac328d49b291df0e6a4171",
        "thumb": "/expansion-atlas/ex26_hss_bear_shift-original-256.webp",
        "detail": "/expansion-atlas/ex26_hss_bear_shift-original-960.webp",
        "inkThumb": "/expansion-atlas/ex26_hss_bear_shift-ink-256.webp",
        "inkDetail": "/expansion-atlas/ex26_hss_bear_shift-ink-960.webp",
        "fillThumb": "/expansion-atlas/ex26_hss_bear_shift-fill-256.webp",
        "fillDetail": "/expansion-atlas/ex26_hss_bear_shift-fill-960.webp"
      },
      "sourceSha256": "58c60c813cd0e1bf3398b1e1ecc032ffd302cf1fd5ac328d49b291df0e6a4171",
      "contourOnly": true,
      "darkOutline": true
    },
    "policy": {
      "id": "ex26_hss_bear_shift",
      "measurementType": "BODYWEIGHT_REPS",
      "loadMode": "none",
      "sideMode": "none",
      "requirements": [
        [
          "telo"
        ]
      ],
      "unknown": false,
      "explicitTarget": true,
      "manualProgression": true,
      "manualWarmup": true,
      "noAddedWeight": true
    },
    "publicDefaults": {
      "b54315cdf33e33f3": {
        "before": {
          "cz": "HSS · pomalé přenosy váhy v medvědovi",
          "en": "Low-Bear Weight Shifts",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        },
        "after": {
          "cz": "Pomalé přenosy váhy v nízkém medvědovi",
          "en": "Low-Bear Weight Shifts",
          "measurementType": "BODYWEIGHT_REPS",
          "defaultRestSec": 90,
          "unilateral": false,
          "sideMode": "none"
        }
      }
    }
  }
};
