// Audited original-card progression corrections. Stable ids and user history stay intact.
// References and rationale: Reviews/instagram-integration-2026-10-15/baseline-audit-b.json.
import { applyCatalogCorrections } from './catalogCorrections.js';

export const PRACTICAL_CORRECTIONS = {
  "presshs": {
    "ez": {
      "before": "handstand",
      "after": null
    },
    "pos": {
      "before": [
        "Předklon, dlaně na zem, váha v ramenou, boky vysoko.",
        "A fold, palms down, weight in the shoulders, hips high."
      ],
      "after": [
        "Z předklonu v roznožení polož dlaně na zem přibližně na šířku ramen. Boky jsou vysoko a lokty zůstávají natažené.",
        "From a straddle forward fold, place the palms about shoulder-width apart. Keep the hips high and elbows straight."
      ]
    },
    "exe": {
      "before": [
        "Náklon vpřed, nohy odlehčí a stoupají ve straddle vzhůru do stoje. Stejnou cestou zpět.",
        "Lean forward, the legs lighten and rise in a straddle up to the stand. Return the same way."
      ],
      "after": [
        "Plynule přenášej váhu nad dlaně a odlehči chodidla bez odrazu. S nataženými lokty zvedej pánev a roznožené nohy do stoje na rukou. Stejnou cestou kontrolovaně sestup.",
        "Gradually shift weight over the palms and unweight the feet without jumping. With straight elbows, lift the pelvis and straddled legs into a handstand. Lower under control along the same path."
      ]
    },
    "wat": {
      "before": [
        "Potřebuje ohebné zadní stehno a silná ramena zároveň. Zácvik: nohy na bloku.",
        "Needs folded hamstrings and strong shoulders at once. Drill it with the feet on a block."
      ],
      "after": [
        "Po celou dobu aktivně tlač do země. Pokrčení loktů mění variantu cviku. Než zkoušíš celý press, potřebuješ jistou oporu na rukou a nacvičený bezpečný sestup.",
        "Keep actively pressing into the floor. Bending the elbows changes the exercise variation. Establish stable hand support and a practiced safe exit before attempting a full press."
      ]
    },
    "pro": {
      "before": [
        "Press snožmo, pak straight-arm bez zastavení.",
        "Legs-together press, then straight-arm, unbroken."
      ],
      "after": [
        "Lehčí: vyvýšený začátek s chodidly na pevném nízkém boxu a jen ovládaný úsek pohybu. Těžší: press z podlahy v roznožení, potom pomalejší sestup a press snožmo. Lokty jsou natažené v každé variantě.",
        "Easier: begin with feet on a stable low box and practice only the range you control. Harder: straddle press from the floor, then slower lowering and a legs-together pike press. Keep the elbows straight in every variation."
      ]
    }
  },
  "copenhagen": {
    "ez": {
      "before": "sideplank",
      "after": "ex26_copenhagen_short"
    },
    "foc": {
      "before": [
        "Drží tě vnitřní stehno horní nohy. Vzácně trénované, často zraněné.",
        "The top leg's inner thigh holds you. Rarely trained, often injured."
      ],
      "after": [
        "Horní noha drží pánev v boční opoře.",
        "The upper leg supports the pelvis in side support."
      ]
    },
    "pro": {
      "before": [
        "Prodlužuj páku: opora dál od kolene, pak celá noha.",
        "Lengthen the lever: support further from the knee, then the whole leg."
      ],
      "after": [
        "Lehčí: kratší páka s oporou horního kolena a části stehna; podle potřeby pomáhá spodní chodidlo na zemi. Tato varianta s oporou kotníku už používá dlouhou páku. Těžší: prodluž krátkou výdrž bez poklesu pánve, potom přidej pomalé kontrolované zvedání a spouštění boků.",
        "Easier: shorten the lever by supporting the upper knee and part of the thigh; the lower foot may assist from the floor. This ankle-supported version already uses a long lever. Harder: extend a brief hold without letting the pelvis sag, then add slow controlled hip lifts and lowers."
      ]
    }
  },
  "hsshift": {
    "eq": {
      "before": [
        "telo",
        "bradla"
      ],
      "after": [
        "telo"
      ]
    },
    "hd": {
      "before": "fingerhs",
      "after": "onearmhs"
    },
    "pos": {
      "before": [
        "Stabilní stoj na rukou, ideálně na parallettes, ramena zabalená.",
        "A steady handstand, ideally on parallettes, shoulders packed."
      ],
      "after": [
        "Začni ve stabilním stoji na obou dlaních na pevné podlaze. Nohy můžeš roznožit. Aktivně se odtlačuj od země a lokty drž natažené.",
        "Begin in a stable handstand on both palms on a firm floor. You may straddle the legs. Actively push away from the floor with straight elbows."
      ]
    },
    "exe": {
      "before": [
        "Pomalu přesuň těžiště nad jednu ruku, až se druhá skoro nedotýká. Nevytrhávej ji.",
        "Slowly move the center of mass over one hand until the other barely touches. Don't yank it off."
      ],
      "after": [
        "Pomalu přenes více váhy nad jednu dlaň a druhou nech lehce přispívat k rovnováze. Potom se vrať do rovnoměrné opory a vystřídej strany.",
        "Gradually shift more weight over one palm while the other continues to assist lightly with balance. Return to even support and change sides."
      ]
    },
    "wat": {
      "before": [
        "Ruka se zvedá jako důsledek přenosu, ne silou. Zápěstí pracuje.",
        "The hand lifts as a consequence of the shift, not by force. The wrist works."
      ],
      "after": [
        "Nosná dlaň zůstává celou plochou na zemi. Odlehčovanou ruku nevytrhávej a nepropadej v nosném rameni. Přenos zakonči dřív, než ztratíš kontrolovaný návrat.",
        "Keep the whole supporting palm grounded. Do not jerk the assisting hand away or collapse into the loaded shoulder. End the shift before losing a controlled return."
      ]
    },
    "pro": {
      "before": [
        "Zůstaň déle na špičkách prstů. Pak fingertip stoj.",
        "Stay longer on the fingertips. Then the fingertip handstand."
      ],
      "after": [
        "Lehčí: menší přenos s oběma dlaněmi opřenými, případně s lehkou oporou chodidel o zeď. Těžší: postupně odlehčuj jen pomocnou ruku až k lehkému kontaktu jejích prstů a krátkému oddálení. Nosná ruka stále stojí na celé dlani.",
        "Easier: smaller shifts with both palms grounded, optionally with light foot support against a wall. Harder: gradually unload only the assisting hand toward light fingertip contact and a brief lift. The supporting hand remains on its whole palm."
      ]
    }
  },
  "fingerhs": {
    "ez": {
      "before": "hsshift",
      "after": null
    },
    "hd": {
      "before": "onearmhs",
      "after": null
    },
    "foc": {
      "before": [
        "Balancuj na špičkách prstů. Brána k jednoruké.",
        "Balance on the fingertips. The gateway to the one-arm."
      ],
      "after": [
        "Samostatná specializovaná opora na prstech, odlišná od odlehčení pomocné ruky ve stoji na jedné dlani.",
        "A separate specialized fingertip support, distinct from unloading the assisting hand while standing on one palm."
      ]
    },
    "pro": {
      "before": [
        "Najdi malý kruh a pusť ruku. Pak jednoruká.",
        "Find the small circle and release the arm. Then the one-arm."
      ],
      "after": [
        "Nácvik se řídí předchozí připraveností prstů a individuální dopomocí trenéra. Není to povinný krok ke stoji na jedné ruce. Bez zvládnuté opory a kontroly prstů nepřidávej čas ani další odlehčení.",
        "Practice depends on prior finger-loading preparation and individual coaching assistance. It is not a required step toward a one-arm handstand. Do not add hold time or further unloading without established finger support and control."
      ]
    }
  }
};

/** Apply exact baseline matches once, independently for CZ/EN. Never restore a deleted card. */
export function applyPracticalCorrections(collection) {
  return applyCatalogCorrections(collection, PRACTICAL_CORRECTIONS, 'practicalExerciseAudit20261015');
}
