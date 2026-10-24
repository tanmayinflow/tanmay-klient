// ======================================================================
// TRAINING SYSTEM V2 · the one door into the domain
// ----------------------------------------------------------------------
// The application imports this namespace and nothing deeper, so the app
// has one import to keep true and the modules can be rearranged without
// touching the render. Tests import the individual modules directly.
// ======================================================================

export * from "./types.js";
export * from "./measurements.js";
export * from "./catalog.js";
export * from "./catalogOverlay.js";
export * from "./catalogV2.js";
export * from "./catalogExpansion.js";
export * from "./expansionArt.js";
export * from "./sessionModel.js";
export * from "./sessionEngine.js";
export * from "./progress.js";
export * from "./statistics.js";
export * from "./progression.js";
export * from "./warmup.js";
export * from "./plates.js";
export * from "./templates.js";
export * from "./generator.js";
export * from "./storage.js";
export * from "./atlasResolver.js";
export * from "./adapters.js";
export * from "./workingLibrary.js";
export * from "./delivery.js";
export * from "./separateWarmups.js";

export { lungeArtworkFor } from "./lungeArtwork.js";
export { stepArtworkFor } from "./stepArtwork.js";
export { stepEquipmentLabels } from "./catalogStepVariants.js";
export { hingeEquipmentLabels } from "./catalogHingeAudit.js";

export {auditBatchArtworkFor,auditBatchEquipmentLabels} from "./catalogAuditBatch.js";

export {verticalAuditArtworkFor,verticalAuditEquipmentLabels} from "./catalogVerticalAudit.js";

export {carryEquipmentLabels,carryArtworkFor} from "./catalogCarryAuditView.js";

export {trunkEquipmentLabels,trunkArtworkFor,auditedAllowsEstimatedMax} from "./catalogTrunkAuditView.js";

export {movementEquipmentLabels,movementArtworkFor,libraryAuditedAllowsEstimatedMax} from "./catalogMovementAuditView.js";

export {balanceArtworkFor,balanceEquipmentLabels} from "./catalogBalanceAuditView.js";

export {locomotionArtworkFor,locomotionDeliveredArtworkFor,locomotionEquipmentLabels} from "./catalogLocomotionAuditView.js";

export * from "./catalogLocomotionAuditPolicy.js";

export * from "./catalogLowerLegAudit.js";
export {LOWER_LEG_AUDIT_ENTRIES} from "./catalogLowerLegAuditData.js";

export * from "./catalogHipAudit.js";
export {HIP_AUDIT_ENTRIES} from "./catalogHipAuditData.js";

export * from "./catalogShoulderAudit.js";
export {SHOULDER_AUDIT_ENTRIES} from "./catalogShoulderAuditData.js";

export * from "./catalogElbowHandAudit.js";
export {ELBOW_HAND_AUDIT_ENTRIES} from "./catalogElbowHandAuditData.js";

export * from "./catalogPositionHoldAudit.js";
export {POSITION_HOLD_AUDIT_ENTRIES} from "./catalogPositionHoldAuditData.js";

export * from './catalogBreathingAudit.js';
export {BREATHING_AUDIT_ENTRIES} from './catalogBreathingAuditData.js';

export * from './catalogThrowAudit.js';
export {THROW_AUDIT_ENTRIES} from './catalogThrowAuditData.js';

export * from './catalogComplexTaskAudit.js';
export {COMPLEX_TASK_AUDIT_ENTRIES} from './catalogComplexTaskAuditData.js';

export * from './catalogLandingAudit.js';
export {LANDING_AUDIT_ENTRIES,LANDING_BLOCK_POLICY_FIELDS} from './catalogLandingAuditData.js';
export * from './landingRecordingContract.js';
