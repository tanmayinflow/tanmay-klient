import { ROOM_ART } from "./roomArt.js";

// Material palette derived from the owner's current website, September 2026.
// Separate presets: existing Signature and saved choices remain intact.
export function landscapeDefinition(night = false) {
  const linen = "#F4F0EB", ink = "#1C1C1A", earth = "#754437";
  // Website anchors plus owner-requested night material levels (24 September 2026).
  const sand = "#E5D8C4", paper = sand, muted = ink;
  const coal = "#2E2D2B", raised = "#373530", pale = "#C5B49A", copper = "#B87333";
  const bg = night ? ink : paper, surface = night ? coal : paper;
  const text = night ? linen : ink, secondary = night ? pale : muted;
  // Current website accent on Linen; the Earth material keeps its own anchor.
  const redEarth = "#743627", action = night ? pale : redEarth;
  return {
    id: night ? "landscape-night" : "landscape-day",
    labelCs: night ? "Signature · Noc" : "Signature · Den",
    labelEn: night ? "Signature · Night" : "Signature · Day",
    polarity: night ? "dark" : "light", statusMode: night ? "dark" : "light",
    material: "landscape",
    anchors: { Linen: linen, Ink: ink, Earth: earth, Paper: paper, Sand: sand,
      Muted: muted, Coal: coal, Raised: raised, Pale: pale, Copper: copper, RedEarth: redEarth },
    background: bg, navigation: night ? linen : ink, surface, card: surface,
    documentSurface: night ? raised : surface, elevatedSurface: night ? raised : paper,
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
    atlasBorder: ink, shadowInk: ink, dockBg: night ? linen : ink,
    nav: night
      ? { text: ink, textSec: ink, kicker: ink, icon: ink, muted: ink,
          accent: redEarth, activeBg: linen, hairline: pale, border: ink }
      : { text: linen, textSec: pale, kicker: pale, icon: pale, muted: pale,
          accent: linen, activeBg: ink, hairline: ink, border: pale },
    frame: { outer: night ? muted : pale, inner: surface, rail: action, highlight: action },
    themeColor: bg,
    chrome: { frameGrammar: night ? "landscape-ash" : "landscape-paper", radius: 8,
      density: "restrained", frameTargets: ["sheet", "panel", "dock"] },
  };
}

// Owner-requested nearby directional tints for the personal mandala, not status colors.
export const LANDSCAPE_DIRECTION_INKS = Object.freeze({
  light: Object.freeze({ sage: "#394338", sand: "#68502D", accent: "#743627", textMuted: "#4B3D4E" }),
  dark: Object.freeze({ sage: "#A9B49C", sand: "#C5B49A", accent: "#BC9281", textMuted: "#AEA0B5" }),
});

// Asset names are public artwork only. Private content never enters the core.
export const LANDSCAPE_ART = Object.freeze({
  ...Object.fromEntries(Object.entries(ROOM_ART).map(([room, image]) => [room, { image: '../icons/' + image, shape: 'object' }])),
  oblasti: { image: "strata.svg", shape: "horizon" },
  cile: { image: "strata.svg", shape: "horizon" },
  atomic: { image: "pine-rings.webp", shape: "branch" },
});
