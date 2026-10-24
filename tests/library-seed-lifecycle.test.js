import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {POSITION_HOLD_AUDIT_CONTEXT} from '../src/data/positionHoldAuditContext.js';

test('actual application seed callback preserves audited rows and personal changes across reloads',()=>{
 const output=execFileSync(process.execPath,[fileURLToPath(new URL('../scripts/check-library-seed-lifecycle.mjs',import.meta.url)),`--role=${POSITION_HOLD_AUDIT_CONTEXT.role}`],{encoding:'utf8',timeout:60000});
 const result=JSON.parse(output.trim());
 assert.equal(result.summary.fail,0,output);
 assert.ok(result.summary.pass>=52,output);
});
