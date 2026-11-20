// A compact plan without discarding varied sets, time or distance prescriptions.
export function templateBlockSummary(block, lang = 'cs') {
  const cs = lang === 'cs';
  const sets = block.sets || [];
  const values = sets.map(({ planned: p = {} }) => {
    const parts = [];
    if (p.targetReps != null) parts.push(`${p.targetReps} ${cs ? 'opak.' : 'reps'}`);
    else if (p.targetRepsMin != null && p.targetRepsMin === p.targetRepsMax) parts.push(`${p.targetRepsMin} ${cs ? 'opak.' : 'reps'}`);
    else if (p.targetRepsMin != null || p.targetRepsMax != null) parts.push(`${p.targetRepsMin ?? '?'}–${p.targetRepsMax ?? '?'} ${cs ? 'opak.' : 'reps'}`);
    if (p.targetDurationSec != null) parts.push(`${p.targetDurationSec} s`);
    if (p.targetDistanceM != null) parts.push(`${p.targetDistanceM} m`);
    if (p.targetWeight != null) parts.push(`${p.targetWeight} kg`);
    if (p.targetRounds != null) parts.push(`${p.targetRounds} ${cs ? 'kol' : 'rounds'}`);
    return parts.join(' · ') || (cs ? 'dle potřeby' : 'as needed');
  });
  const unique = [...new Set(values)];
  // 1 série, 2–4 série, 5 a víc sérií · „7 série" čeština nezná.
  const word = cs ? (sets.length >= 5 || sets.length === 0 ? 'sérií' : 'série') : (sets.length === 1 ? 'set' : 'sets');
  return `${sets.length} ${word} · ${unique.join(' / ')} · ${cs ? 'pauza' : 'rest'} ${block.restSec ?? 0} s`;
}
