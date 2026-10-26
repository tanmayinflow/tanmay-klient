import { EXERCISE_REGION_BY_MUSCLE } from './exerciseTaxonomy.js';

// Figure, area chips and muscle names edit one additive body selection.
const members = region => Object.keys(EXERCISE_REGION_BY_MUSCLE).filter(key => region === 'whole_body' || EXERCISE_REGION_BY_MUSCLE[key] === region);
export function highlightedBodyMuscles(filters) {
  const areas = filters.regions || [];
  return [...new Set([...(filters.muscles || []), ...Object.keys(EXERCISE_REGION_BY_MUSCLE).filter(key => areas.includes('whole_body') || areas.includes(EXERCISE_REGION_BY_MUSCLE[key]))])];
}
export function selectBodyRegions(filters, regions) {
  const removed = (filters.regions || []).filter(region => !regions.includes(region));
  return { ...filters, regions, muscles: (filters.muscles || []).filter(key => !removed.some(region => members(region).includes(key))) };
}
export function selectBodyMuscles(filters, muscles) {
  // A partially deselected broad area becomes its remaining precise muscles;
  // unrelated broad areas, including knees/feet with no muscle map, survive.
  const regions = (filters.regions || []).filter(region => members(region).every(key => muscles.includes(key)));
  return { ...filters, regions, muscles: muscles.filter(key => !regions.some(region => members(region).includes(key))) };
}
export function toggleBodyMuscle(filters, key) {
  if (!Object.hasOwn(EXERCISE_REGION_BY_MUSCLE, key)) return filters;
  const muscles = highlightedBodyMuscles(filters);
  return selectBodyMuscles(filters, muscles.includes(key) ? muscles.filter(item => item !== key) : [...muscles, key]);
}
