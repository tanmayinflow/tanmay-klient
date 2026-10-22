// Guarded clarification of an existing Smith-machine card; no new identity or recording change.
const correction = {
  "id": "ex26_smith_squat",
  "guard": {
    "cz": {
      "present": true,
      "value": "Dřep ve Smithově stroji"
    },
    "en": {
      "present": true,
      "value": "Smith Machine Squat"
    },
    "pat": {
      "present": true,
      "value": "drep"
    },
    "eq": {
      "present": true,
      "value": [
        "stroj"
      ]
    },
    "pos": {
      "present": true,
      "value": [
        "Nastav osu na horní část zad a dorazy těsně pod plánovanou hloubku. Postoj vyzkoušej s prázdnou osou podle sklonu vedení stroje.",
        "Set the bar across the upper back and stops just below the planned depth. Test foot position with the empty bar for this machine’s rail angle."
      ]
    },
    "exe": {
      "present": true,
      "value": [
        "Odhákni osu, dřepni s celými chodidly na zemi a vrať se tlakem nohama. Po sérii bezpečně zahákni oba konce.",
        "Unrack, squat while keeping the feet planted and drive up through the legs. Secure both hooks after the set."
      ]
    },
    "mode": {
      "present": true,
      "value": "reps"
    },
    "measurementType": {
      "present": true,
      "value": "WEIGHT_REPS"
    },
    "sideMode": {
      "present": true,
      "value": "none"
    },
    "load": {
      "present": true,
      "value": "ext"
    },
    "family": {
      "present": true,
      "value": "squat_machine"
    },
    "variantKey": {
      "present": true,
      "value": "ex26_smith_squat"
    }
  },
  "taxonomyGuard": {
    "equipmentRequirements": {
      "present": false
    },
    "positions": [
      "standing"
    ],
    "supports": [
      "machine"
    ]
  },
  "requirements": [
    [
      "smith_machine"
    ]
  ]
};
export function applyAuditEquipmentFixes(collection){
 if(!Array.isArray(collection?.tEx))return collection;
 let changed=false;
 const tEx=collection.tEx.map(row=>{
  if(row?.id!==correction.id||Object.hasOwn(row.taxonomy||{},'equipmentRequirements'))return row;
  for(const [key,guard] of Object.entries(correction.guard))if(Object.hasOwn(row,key)!==guard.present||JSON.stringify(row[key])!==JSON.stringify(guard.value))return row;
  for(const key of ['positions','supports'])if(JSON.stringify(row.taxonomy?.[key])!==JSON.stringify(correction.taxonomyGuard[key]))return row;
  changed=true;return {...row,taxonomy:{...row.taxonomy,equipmentRequirements:correction.requirements.map(group=>[...group])}};
 });
 return changed?{...collection,tEx}:collection;
}
