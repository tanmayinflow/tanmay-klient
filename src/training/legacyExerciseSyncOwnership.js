// Refusal-only ownership lookup. This never grants audit, policy or artwork trust.
import {MOVEMENT_AUDIT_ENTRIES} from './catalogMovementAuditData.js';
import {TRUNK_AUDIT_ENTRIES} from './catalogTrunkAuditData.js';
import {BALANCE_AUDIT_ENTRIES} from './catalogBalanceAuditData.js';
import {HIP_AUDIT_ENTRIES} from './catalogHipAuditData.js';
import {proposal as verticalPullAudit} from './catalogVerticalPullAuditData.js';
import {proposal as verticalPushAudit} from './catalogVerticalPushAuditData.js';

const owners = [MOVEMENT_AUDIT_ENTRIES, TRUNK_AUDIT_ENTRIES, BALANCE_AUDIT_ENTRIES,
  HIP_AUDIT_ENTRIES, verticalPullAudit.corrections, verticalPushAudit.corrections];

export function priorAuditOwnsExercise(id) {
  return typeof id === 'string' && owners.some(entries => Object.prototype.hasOwnProperty.call(entries || {}, id));
}
