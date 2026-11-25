import { isMeasurement, measurementOf } from './measurements.js';
import { SET_TYPES } from './types.js';
import { publicLandingExecution, publicLandingRecording } from './landingRecordingContract.js';

const list = value => Array.isArray(value) ? value : [];
const identifier = value => typeof value === 'string' && /^[A-Za-z0-9_.:-]{1,160}$/.test(value);
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
const number = value => Number.isFinite(value) ? value : null;
const fields = (values, keys) => Object.fromEntries(keys.filter(key => Number.isFinite(values?.[key])).map(key => [key, values[key]]));

function sharedBlock(block, prescribed) {
  const type = prescribed.measurementType;
  const measure = measurementOf(type);
  const actualFields = measure.secondary ? [...measure.fields, measure.secondary] : measure.fields;
  return {
    id: identifier(block.id) ? block.id : null, exId: prescribed.exId, measurementType: type,
    ...publicLandingRecording(prescribed),
    ...(prescribed.variant != null ? { variant: prescribed.variant } : {}),
    techniqueFlagged: block.techniqueFlagged === true,
    sets: list(block.sets).filter(set => set && typeof set === 'object').map(set => ({
      id: identifier(set.id) ? set.id : null, type: SET_TYPES.includes(set.type) ? set.type : 'work',
      planned: fields(set.planned, measure.planned), actual: fields(set.actual, actualFields),
      completed: set.completed === true, completedAt: number(set.completedAt), rir: number(set.rir),
      side: ['L', 'R'].includes(set.side) ? set.side : null, ...publicLandingExecution(prescribed, set),
    })),
  };
}

// The Worker supplies its own delivery row. A private client document can never
// authorize an assignment, even if its plan ID or template is also in a library.
function indexDelivery(delivery) {
  const templates = new Map(list(delivery?.templates).filter(t => t && identifier(t.id)).map(t => [t.id, t]));
  const plans = new Map();
  for (const plan of list(delivery?.plans)) {
    if (!plan || !identifier(plan.id)) continue;
    const sessions = new Map();
    for (const slot of list(plan.sessions)) {
      if (!slot || !identifier(slot.id) || !templates.has(slot.templateId)) continue;
      sessions.set(slot.id, templates.get(slot.templateId));
    }
    plans.set(plan.id, sessions);
  }
  return plans;
}

function matchingTemplate(session, plans) {
  const template = plans.get(session?.planId)?.get(session?.planSessionId);
  return template && identifier(session.id) && (session.templateId == null || session.templateId === template.id) ? template : null;
}

export function isCoachAssignedSession(session, delivery) {
  return !!matchingTemplate(session, indexDelivery(delivery));
}

export function assignedTrainingShare(training, delivery) {
  const plans = indexDelivery(delivery);
  const sessions = [];
  for (const s of list(training?.sessions)) {
    const template = matchingTemplate(s, plans);
    if (!template) continue;
    const blocks = [];
    for (const block of list(s.blocks)) {
      if (!block) continue;
      const prescribed = list(template.blocks).find(b => b && b.exId === block.exId && isMeasurement(b.measurementType) && (!block.measurementType || b.measurementType === block.measurementType));
      if (prescribed) blocks.push(sharedBlock(block, prescribed));
    }
    sessions.push({
      id: s.id, date: date(s.date) ? s.date : '', planId: s.planId, planSessionId: s.planSessionId,
      templateId: template.id, startedAt: number(s.startedAt), endedAt: number(s.endedAt),
      effort: number(s.effort), blocks,
      ...(typeof s.coachMessage === 'string' && s.coachMessage ? { coachMessage: s.coachMessage } : {}),
    });
  }
  const sched = [];
  for (const [planId, slots] of plans) {
    const overrides = training?.sched?.[planId];
    const assigned = [...slots.keys()].filter(key => overrides?.[key] === '' || date(overrides?.[key])).map(key => [key, overrides[key]]);
    if (assigned.length) sched.push([planId, Object.fromEntries(assigned)]);
  }
  return { v: 2, at: number(training?.at), sessions, sched: Object.fromEntries(sched) };
}
