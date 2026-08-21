// ======================================================================
// PLATE CALCULATOR · small, and out of the way
// ----------------------------------------------------------------------
// Barbell exercises only. It opens from the weight field, it does not
// live in the session screen, and it answers two questions: what goes on
// one side, and what is the nearest weight you can actually build.
// ======================================================================

export const DEFAULT_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];

// Greedy is correct here because gym plates are a canonical system: the
// largest plate that fits is always part of the shortest loading.
export function platesFor(target, barWeight, available, collarWeight) {
  const bar = Number(barWeight) || 20;
  const collars = Number(collarWeight) || 0;
  const plates = (available && available.length ? available : DEFAULT_PLATES).slice().sort((a, b) => b - a);
  const perSide = (Number(target) - bar - collars * 2) / 2;
  if (!isFinite(perSide) || perSide < 0) {
    return { ok: false, perSide: [], total: bar + collars * 2, exact: Number(target) === bar + collars * 2, remainder: 0 };
  }
  const out = [];
  let left = perSide;
  for (const p of plates) {
    while (left >= p - 0.0001) { out.push(p); left = Math.round((left - p) * 1000) / 1000; }
  }
  const loaded = out.reduce((a, b) => a + b, 0);
  const total = bar + collars * 2 + loaded * 2;
  return {
    ok: true,
    perSide: out,
    total: Math.round(total * 100) / 100,
    exact: Math.abs(total - Number(target)) < 0.0001,
    remainder: Math.round(left * 1000) / 1000,
  };
}

// The nearest weight this bar and these plates can actually make. Asking
// for 63 kg on 2.5 kg plates is asking for a number the room cannot build.
export function roundToPlates(target, barWeight, available, collarWeight) {
  const bar = Number(barWeight) || 20;
  const collars = Number(collarWeight) || 0;
  const plates = (available && available.length ? available : DEFAULT_PLATES).slice().sort((a, b) => a - b);
  const smallest = plates[0] || 1.25;
  const step = smallest * 2;
  const base = bar + collars * 2;
  const t = Number(target) || 0;
  if (t <= base) return { weight: base, exact: Math.abs(t - base) < 0.0001 };
  const steps = Math.round((t - base) / step);
  const weight = Math.round((base + steps * step) * 100) / 100;
  return { weight, exact: Math.abs(weight - t) < 0.0001 };
}

// Human-readable: "20 + 10 + 2,5" per side.
export function fmtPerSide(perSide, cz) {
  if (!perSide || !perSide.length) return cz ? "prázdná osa" : "empty bar";
  return perSide.map((p) => (cz ? String(p).replace(".", ",") : String(p))).join(" + ");
}
