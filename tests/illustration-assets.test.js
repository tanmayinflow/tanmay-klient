import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {MOVEMENT_ATLAS} from '../src/generated/movementAtlasManifest.ts';
import {SUPPLEMENT_ART} from '../src/library/supplement-art.js';
import {CREATOR_ART} from '../src/library/creator-art.js';
import {MOBILITY_ART} from '../src/library/mobility-art.js';
test('client carries every static library illustration used by assigned workouts',()=>{
 const all={...MOVEMENT_ATLAS,...MOBILITY_ART,...CREATOR_ART,...SUPPLEMENT_ART};
 assert.equal(Object.keys(all).length,660);
 for(const [id,item] of Object.entries(all))for(const kind of ['thumb','detail'])assert.ok(existsSync(new URL('../public'+item.primary[kind],import.meta.url)),id+' '+kind);
});
