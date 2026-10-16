import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {MOVEMENT_ATLAS} from '../src/generated/movementAtlasManifest.ts';
import {SUPPLEMENT_ART} from '../src/library/supplement-art.js';
import {CREATOR_ART} from '../src/library/creator-art.js';
import {MOBILITY_ART} from '../src/library/mobility-art.js';
import {EXPANSION_ART} from '../src/training/expansionArt.js';
import {EXPANSION_EXERCISES} from '../src/training/catalogExpansion.js';
import {KETTLEBELL_EXERCISES} from '../src/training/catalogKettlebell.js';
import {INSTAGRAM_EXERCISES} from '../src/training/catalogInstagram.js';
import {INSTAGRAM_CONTINUATION_EXERCISES} from '../src/training/catalogInstagramContinuation.js';
import {INSTAGRAM_CLIENT_NEXT_EXERCISES} from '../src/training/catalogInstagramClientNext.js';
test('client carries every static library illustration used by assigned workouts',()=>{
 const all={...MOVEMENT_ATLAS,...MOBILITY_ART,...CREATOR_ART,...SUPPLEMENT_ART,...EXPANSION_ART};
 assert.equal(EXPANSION_EXERCISES.length,376);
 assert.equal(Object.keys(all).length,660+EXPANSION_EXERCISES.length+KETTLEBELL_EXERCISES.length+INSTAGRAM_EXERCISES.length+INSTAGRAM_CONTINUATION_EXERCISES.length+INSTAGRAM_CLIENT_NEXT_EXERCISES.length);
 for(const [id,item] of Object.entries(all))for(const kind of ['thumb','detail'])assert.ok(existsSync(new URL('../public'+item.primary[kind],import.meta.url)),id+' '+kind);
});
test('every new client exercise has all six local illustration derivatives',()=>{
 assert.deepEqual(new Set(Object.keys(EXPANSION_ART)),new Set([...EXPANSION_EXERCISES,...KETTLEBELL_EXERCISES,...INSTAGRAM_EXERCISES,...INSTAGRAM_CONTINUATION_EXERCISES,...INSTAGRAM_CLIENT_NEXT_EXERCISES].map(x=>x.id)));
 for(const [id,item] of Object.entries(EXPANSION_ART))for(const kind of ['thumb','detail','inkThumb','inkDetail','fillThumb','fillDetail'])assert.ok(existsSync(new URL('../public'+item.primary[kind],import.meta.url)),id+' '+kind);
});
