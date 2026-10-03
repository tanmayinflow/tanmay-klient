import { measurementOf } from './measurements.js';
import { setActual, findBlock, findSet } from './sessionEngine.js';

export function guideSteps(session) {
  const blocks = session && session.blocks ? session.blocks : [];
  const steps = [];
  const seen = new Set();
  blocks.forEach((b) => {
    if (b.groupId) {
      if (seen.has(b.groupId)) return;
      seen.add(b.groupId);
      const group = blocks.filter((x) => x.groupId === b.groupId).sort((x, y) => (x.groupOrder || 0) - (y.groupOrder || 0));
      const rounds = Math.max(0, ...group.map((x) => (x.sets || []).length));
      for (let r = 0; r < rounds; r++) {
        for (const g of group) { const set = (g.sets || [])[r]; if (set) steps.push({ block: g, set, setIndex: r }); }
      }
    } else {
      (b.sets || []).forEach((set, i) => steps.push({ block: b, set, setIndex: i }));
    }
  });
  return steps;
}

export function setSeconds(block, set) {
  const m = measurementOf(block.measurementType);
  if (!m.fields.includes("durationSec")) return 0;
  const n = set && set.planned ? Number(set.planned.targetDurationSec) : 0;
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}


// Confirmation fills only missing actual values. Prescribed values and another
// person's plan are never changed. A repetition range confirms its lower bound,
// matching sessionEngine.plannedToActual rather than inventing the upper bound.
export function completeGuidedSet(session, blockId, setId, { previousActual = {}, extra = {}, now = Date.now() } = {}) {
  const block = findBlock(session, blockId), set = findSet(session, blockId, setId);
  if (!block || !set || set.completed) return session;
  const measurement = measurementOf(block.measurementType);
  const fields = measurement.fields.concat(measurement.secondary ? [measurement.secondary] : []);
  const p = set.planned || {}, fill = {};
  const plannedFields = { reps: p.targetReps != null ? 'targetReps' : p.targetRepsMin != null ? 'targetRepsMin' : 'targetRepsMax', weight: 'targetWeight', durationSec: 'targetDurationSec', distanceM: 'targetDistanceM', assistance: 'targetAssistance', height: 'targetHeight', rounds: 'targetRounds' };
  for (const field of fields) {
    if (set.actual?.[field] != null) continue;
    const key = plannedFields[field];
    if (key && p[key] != null) fill[field] = p[key];
    else if (previousActual?.[field] != null) fill[field] = previousActual[field];
  }
  for (const field of fields) if (extra?.[field] != null) fill[field] = extra[field];
  const next = setActual(session, blockId, setId, fill);
  // Zero is an explicit result, including a timer stopped immediately. The
  // generic list confirmation falls back to its plan for a non-positive result;
  // this guide has already filled missing fields and must keep that actual.
  return { ...next, blocks: next.blocks.map(b => b.id !== blockId ? b : {
    ...b, sets: b.sets.map(s => s.id !== setId ? s : { ...s, completed: true, completedAt: now }),
  }) };
}
