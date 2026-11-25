import { assignedTrainingShare } from '../../training/coachShare.js';
import { validateShareSnapshot } from './visibility.js';

export function coachShareSnapshot(snapshot, delivery) {
  if (!snapshot || !validateShareSnapshot(snapshot).ok) return null;
  const out = {};
  if (snapshot.habits) {
    const { days, window, rows } = snapshot.habits;
    out.habits = { days, window, rows: rows.map(({ name, done }) => ({ name, done })) };
  }
  if (snapshot.goals) out.goals = snapshot.goals.map(({ name, status }) => ({ name, status }));
  if (snapshot.training) out.training = assignedTrainingShare(snapshot.training, delivery);
  return Object.keys(out).length ? out : null;
}

export function storedCoachShare(raw, delivery) {
  if (!raw) return null;
  try { return coachShareSnapshot(JSON.parse(raw), delivery ? JSON.parse(delivery) : null); }
  catch { return null; }
}
