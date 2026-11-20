// The 90/90 switch uses one clock. Thread the needle counts both arms together.
export const STRETCH_SIDES = {
  lizard: { side: "perSide" },
  pigeon: { side: "perSide", meaning: ["Přední noha", "Front leg"] },
  threadneedle: { side: "alternating" },
  wgs: { side: "perSide" },
  hip9090: { side: "alternating" }
};

// Keep the signed shape and recording meaning of previously delivered cards.
// New deliveries match a second exact profile, with the current side convention.
export function updateStretchSidePolicy(entry) {
  const { side, meaning } = STRETCH_SIDES[entry.id];
  const previousPolicy = entry.policy;
  entry.policy = { ...previousPolicy, sideMode: side, ...(meaning && { sideMeaning: meaning }) };
  for (const [id, profile] of Object.entries(entry.deliveryProfiles)) {
    entry.deliveryProfiles[id] = { ...profile, policy: previousPolicy };
    entry.deliveryProfiles[id + "-" + side] = {
      ...profile, fields: { ...profile.fields, unilateral: true, sideMode: side }
    };
  }
}
