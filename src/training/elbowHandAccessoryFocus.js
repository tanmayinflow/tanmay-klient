// REVIEW ONLY. Not imported by either product. The supplied policy reader must
// be the real whole-profile/role/metadata reader; a row marker is not authority.
export const FOUNDATION_FOCUS = Object.freeze({
  dbcurl: { muscles: ['bic'], joints: [] },
  ex26_band_hammer_curl: { muscles: ['bic'], joints: [] },
  pushdown: { muscles: ['tri'], joints: [] },
  dbtriext: { muscles: ['tri'], joints: [] },
  ex26_wrist_pronation: { muscles: ['fore'], joints: [] },
  wristcars: { muscles: [], joints: ['zap'] },
  elbowcars: { muscles: [], joints: ['lok'] },
});
const list = x => Array.isArray(x) ? x : [];
const intersects = (a, b) => list(a).some(x => list(b).includes(x));
export const hasElbowHandAccessoryFocus = o =>
  intersects(o?.prefMus, ['bic', 'tri', 'fore']) || intersects(o?.prefJ, ['zap', 'lok']);

export function createAccessoryFocus({ policyFor, metaOf, roleOf, prepJointsOf }) {
  const requested = o => o?.elbowHandAccessoryFocus === true && !o.target
    && o.block === 'accessory' && hasElbowHandAccessoryFocus(o);
  function policy(row, o) {
    if (!requested(o)) return null;
    const rule = FOUNDATION_FOCUS[row?.id];
    if (!rule || !intersects(o.prefMus, rule.muscles) && !intersects(o.prefJ, rule.joints)) return null;
    const p = policyFor(row);
    return p && !p.viewOnly && !p.unknown && p.explicitTarget === true ? p : null;
  }
  function matches(row, o, focused) {
    if (!requested(o)) return true;
    // Exact audited14 cards have only the seven explicit permissions above.
    // Broader/mixed cards and specialists do not borrow another card's target.
    if (policyFor(row)) return !!focused;
    // Existing outside14 candidates may remain, but must actually match.
    // A joint merely being loaded in row.J is not a requested mobility task.
    return intersects(row?.mp, o.prefMus)
      || roleOf(row) === 'mobility' && intersects(prepJointsOf(row, metaOf(row)), o.prefJ);
  }
  return { requested, policy, matches };
}
