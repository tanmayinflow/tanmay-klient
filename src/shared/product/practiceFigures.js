export const FIGURE_NOTES = ["symbolism", "feltQuality", "principles", "gift"];

export function figureHasCounter(figure) {
  // Every legacy row was a counter, including rows that still read zero.
  return figure.counterEnabled !== false;
}

// Enrich the existing role-local mala records in place, keeping IDs, counts,
// unknown fields from backups and any concurrent edits outside the patch.
export function savePracticeFigure(coll, roleDefaults, id, changes, create = false) {
  const figures = coll.mala ?? roleDefaults;
  const current = figures.find(figure => figure.id === id);
  if (!id || (create ? current : !current)) return coll;
  const next = current ? { ...current } : { id, count: 0, counterEnabled: false };
  for (const field of ["name", ...FIGURE_NOTES]) {
    if (typeof changes[field] === "string") next[field] = changes[field].trim();
  }
  if (!next.name) return coll;
  if (typeof changes.counterEnabled === "boolean") next.counterEnabled = changes.counterEnabled;
  const mala = create ? [...figures, next] : figures.map(figure => figure.id === id ? next : figure);
  return { ...coll, mala };
}
