import { EXERCISE_MOVEMENTS } from './exerciseTaxonomy.js';
import { selectExerciseLibrary } from './exerciseLibrary.js';

// A decorative example from this user's current catalogue. It must retain the
// selected movement classification and an approved image; it never changes filters.
export function movementIllustrationExercise(index, movement, { artOf, isUnverified } = {}) {
  if (movement === 'other' || !EXERCISE_MOVEMENTS.some(item => item.id === movement) || typeof artOf !== 'function') return null;
  const { rows } = selectExerciseLibrary(Array.isArray(index) ? index : [], { movements: [movement] });
  return rows.find(row => {
    const art = artOf(row);
    if (!art || art.suppress || (isUnverified?.(row) && !art.verifiedReplacement)) return false;
    const image = art.primary;
    return !!(image && (art.contourOnly ? image.inkThumb || image.inkDetail : image.thumb || image.detail));
  }) || null;
}
