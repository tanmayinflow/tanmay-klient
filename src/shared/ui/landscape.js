// Material palette derived from the owner's current website, September 2026.
// Separate presets: existing Signature and saved choices remain intact.
export function landscapeDefinition(night = false) {
  const linen = "#F4F0EB", ink = "#1C1C1A", earth = "#754437";
  // Exact website anchors only; no additional beige/copper/charcoal palette.
  const paper = linen, sand = "#E5D8C4", muted = ink;
  const coal = ink, raised = ink, pale = "#C5B49A", copper = "#B87333";
  const bg = night ? ink : linen, surface = night ? coal : paper;
  const text = night ? linen : ink, secondary = night ? pale : muted;
  const action = night ? pale : earth;
  return {
    id: night ? "landscape-night" : "landscape-day",
    labelCs: night ? "Krajina · Noc" : "Krajina · Den",
    labelEn: night ? "Landscape · Night" : "Landscape · Day",
    polarity: night ? "dark" : "light", statusMode: night ? "dark" : "light",
    material: "landscape",
    anchors: { Linen: linen, Ink: ink, Earth: earth, Paper: paper, Sand: sand,
      Muted: muted, Coal: coal, Raised: raised, Pale: pale, Copper: copper },
    background: bg, navigation: ink, surface, card: surface,
    documentSurface: surface, elevatedSurface: night ? raised : paper,
    text, heading: text, textSecondary: secondary, textMuted: secondary,
    textDisabled: secondary, placeholder: secondary,
    border: pale, borderStrong: secondary,
    borderSoft: night ? "rgba(244,240,235,0.18)" : "rgba(28,28,26,0.15)",
    interactive: action, interactiveText: night ? ink : linen,
    focus: action, link: action, selectionSurface: night ? pale : sand, selectionText: night ? ink : text,
    quietInk: secondary, cardHover: night ? raised : sand,
    sheetHover: night ? raised : sand, callout: night ? raised : sand,
    tableHead: night ? raised : sand, activeNav: night ? raised : sand,
    hero: night ? coal : sand, heroInk: text, overlay: "rgba(28,28,26,0.65)",
    chart: night ? [linen, pale, linen, pale, linen, pale] : [ink, earth, ink, muted, ink, earth],
    chartSurface: surface, grid: night ? raised : sand, axis: secondary,
    atlasBorder: ink, shadowInk: ink, dockBg: ink,
    nav: { text: linen, textSec: pale, kicker: pale, icon: pale, muted: pale,
      accent: linen, activeBg: earth, hairline: raised, border: pale },
    frame: { outer: night ? muted : pale, inner: surface, rail: action, highlight: action },
    themeColor: bg,
    chrome: { frameGrammar: night ? "landscape-ash" : "landscape-paper", radius: 8,
      density: "restrained", frameTargets: ["sheet", "selected"] },
  };
}

// Asset names are public artwork only. Private content never enters the core.
export const LANDSCAPE_ART = Object.freeze({
  praxe: { image: "pine-rings.webp", shape: "branch" },
  trenink: { image: "equipment.webp", shape: "equipment" },
  denik: { image: "terrain.svg", shape: "horizon" },
  kompas: { image: "strata.svg", shape: "horizon" },
  oblasti: { image: "strata.svg", shape: "horizon" },
  cile: { image: "strata.svg", shape: "horizon" },
  zapisnik: { image: "pine.webp", shape: "pine" },
  prameny: { image: "pine.webp", shape: "pine" },
  klienti: { image: "equipment.webp", shape: "equipment" },
  hospodareni: { image: "strata.svg", shape: "horizon" },
  socsite: { image: "terrain.svg", shape: "horizon" },
  kos: { image: "terrain.svg", shape: "horizon" },
  atomic: { image: "pine-rings.webp", shape: "branch" },
});
