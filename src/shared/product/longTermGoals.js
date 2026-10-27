// Personal Compass direction. Records live with their landscape metadata;
// links live with personal goal metadata, never in coach-authored assignments.
const record = value => value && typeof value === "object" && !Array.isArray(value) ? value : {};
const text = (value, limit) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const timestamp = value => Number.isFinite(value) && value > 0 ? value : 0;
const date = value => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const parsed = new Date(value + "T12:00:00Z");
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value ? value : "";
};

export function normalizeLongTermGoals(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.flatMap(raw => {
    const item = record(raw), id = text(item.id, 200), name = text(item.name, 240);
    if (!id || !name || seen.has(id)) return [];
    seen.add(id);
    return [{ id, name, note: text(item.note, 4000), target: date(item.target),
      completed: item.completed === true, archivedAt: timestamp(item.archivedAt),
      createdAt: timestamp(item.createdAt), updatedAt: timestamp(item.updatedAt) }];
  });
}

export function landscapeLongTermGoals(coll, area, { includeArchived = false } = {}) {
  const goals = normalizeLongTermGoals(record(record(coll?.areaMeta)[area]).longTermGoals);
  return includeArchived ? goals : goals.filter(goal => !goal.archivedAt);
}

export function saveLongTermGoal(coll, area, input, now = Date.now()) {
  const id = text(input?.id, 200), name = text(input?.name, 240);
  if (!text(area, 240) || !id || !name || !timestamp(now)) return coll;
  const areaMeta = record(coll?.areaMeta), meta = record(areaMeta[area]);
  const raw = Array.isArray(meta.longTermGoals) ? meta.longTermGoals : [];
  const previous = raw.find(item => record(item).id === id);
  const normalized = normalizeLongTermGoals([{ ...record(previous), ...record(input), id, name,
    createdAt: timestamp(previous?.createdAt) || now, updatedAt: now }])[0];
  // Preserve unknown fields and unrelated old records. Reading invalid data is
  // not permission to erase it during an otherwise unrelated edit.
  const saved = { ...record(previous), ...normalized };
  const longTermGoals = previous ? raw.map(item => item === previous ? saved : item) : [...raw, saved];
  return { ...coll, areaMeta: { ...areaMeta, [area]: { ...meta, longTermGoals } } };
}

export function archiveLongTermGoal(coll, area, id, archived, now = Date.now()) {
  const goal = landscapeLongTermGoals(coll, area, { includeArchived: true }).find(item => item.id === id);
  if (!goal || !timestamp(now)) return coll;
  return saveLongTermGoal(coll, area, { ...goal, archivedAt: archived ? now : 0 }, now);
}

export function goalLandscape(goal) {
  return text(goal?.area, 240) || (Array.isArray(goal?.areas) ? text(goal.areas[0], 240) : "");
}

export function goalLongTermGoal(coll, goal, areas) {
  const area = goalLandscape(goal);
  if (!area || (Array.isArray(areas) && !areas.some(item => (typeof item === "string" ? item : item?.name) === area))) return null;
  const id = record(record(coll?.goalMeta)[goal?.name]).longTermGoalId;
  return landscapeLongTermGoals(coll, area, { includeArchived: true }).find(item => item.id === id) || null;
}

export function linkGoalToLongTerm(coll, goal, id, areas) {
  if (!goal?.name) return coll;
  const area = goalLandscape(goal), requested = text(id, 200);
  if (requested && (!area || (Array.isArray(areas) && !areas.some(item => (typeof item === "string" ? item : item?.name) === area)) ||
    !landscapeLongTermGoals(coll, area).some(item => item.id === requested))) return coll;
  const goalMeta = record(coll?.goalMeta), meta = record(goalMeta[goal.name]);
  return { ...coll, goalMeta: { ...goalMeta, [goal.name]: { ...meta, longTermGoalId: requested } } };
}

// Called after an ordinary goal edit or board move. An old link cannot silently
// return if the goal is moved away and later back to its previous landscape.
// Renaming a landscape is different: the existing metadata moves with its name.
export function reconcileGoalLongTermLink(coll, name, patch) {
  if (!patch || (!Object.hasOwn(patch, "area") && !Object.hasOwn(patch, "areas"))) return coll;
  const goalMeta = record(coll?.goalMeta), meta = record(goalMeta[name]);
  if (!meta.longTermGoalId) return coll;
  const area = Object.hasOwn(patch, "area") ? text(patch.area, 240) : goalLandscape(patch);
  if (landscapeLongTermGoals(coll, area, { includeArchived: true }).some(item => item.id === meta.longTermGoalId)) return coll;
  return { ...coll, goalMeta: { ...goalMeta, [name]: { ...meta, longTermGoalId: "" } } };
}

export function renamedGoalLandscapeEdits(coll, goals, oldName, newName) {
  const edits = { ...record(coll?.goalEdits) };
  for (const goal of goals || []) {
    if (goal.owner === "coach" || (goal.area !== oldName && !goal.areas?.includes(oldName))) continue;
    edits[goal.name] = { ...record(edits[goal.name]), area: goal.area === oldName ? newName : goal.area,
      areas: (goal.areas || []).map(area => area === oldName ? newName : area) };
  }
  return edits;
}
