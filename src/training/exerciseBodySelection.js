import { EXERCISE_REGION_BY_MUSCLE } from './exerciseTaxonomy.js';

// The body disclosure offers broad areas OR precise muscles. Choosing a precise
// muscle replaces a broad-area selection, so the two cannot silently conflict.
export function highlightedBodyMuscles(filters) {
  const areas = filters.regions || [];
  return [...new Set([...(filters.muscles || []), ...Object.keys(EXERCISE_REGION_BY_MUSCLE).filter(key => areas.includes('whole_body') || areas.includes(EXERCISE_REGION_BY_MUSCLE[key]))])];
}
export function selectBodyRegions(filters, regions) {
  return { ...filters, regions, muscles: [] };
}
export function selectBodyMuscles(filters, muscles) {
  return { ...filters, regions: [], muscles };
}
export function toggleBodyMuscle(filters, key) {
  if (!Object.hasOwn(EXERCISE_REGION_BY_MUSCLE, key)) return filters;
  const muscles = filters.muscles || [];
  return selectBodyMuscles(filters, muscles.includes(key) ? muscles.filter(item => item !== key) : [...muscles, key]);
}
