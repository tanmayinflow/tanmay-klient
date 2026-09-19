// Material palette derived from the owner's current website, September 2026.
// Separate presets: existing Signature and saved choices remain intact.
export function landscapeDefinition(night = false) {
  const linen = "#F4F0EB", ink = "#1C1C1A", earth = "#754437";
  const paper = "#FAF6EF", sand = "#E8DDC9", muted = "#62594D";
  const coal = "#282723", raised = "#34312B", pale = "#D4C7B2", copper = "#E3A17A";
  const bg = night ? ink : linen, surface = night ? coal : paper;
  const text = night ? linen : ink, secondary = night ? pale : muted;
  const action = night ? copper : earth;
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
    border: night ? "#62594D" : "#D4C7B2", borderStrong: secondary,
    borderSoft: night ? "#34312B" : "#E8DDC9",
    interactive: action, interactiveText: night ? ink : linen,
    focus: action, link: action, selectionSurface: night ? raised : sand, selectionText: text,
    quietInk: secondary, cardHover: night ? raised : sand,
    sheetHover: night ? raised : sand, callout: night ? raised : sand,
    tableHead: night ? raised : sand, activeNav: night ? raised : sand,
    hero: night ? coal : sand, heroInk: text, overlay: "rgba(28,28,26,0.65)",
    chart: night ? [linen, copper, pale, linen, copper, pale] : [ink, earth, ink, muted, ink, earth],
    chartSurface: surface, grid: night ? raised : sand, axis: secondary,
    atlasBorder: ink, shadowInk: ink, dockBg: ink,
    nav: { text: linen, textSec: pale, kicker: pale, icon: pale, muted: pale,
      accent: linen, activeBg: earth, hairline: raised, border: muted },
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
