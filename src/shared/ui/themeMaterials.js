// Reuse the approved, full-resolution website materials. These are already
// quiet photographs, so a near-opaque veil would erase their natural grain.
// Palette anchors stay unchanged; three measured tint adjustments protect
// small text against the actual darkest/brightest pixels of the photographs.
import { hexA } from "./color.js";

export const MATERIAL_RECIPES = Object.freeze({
  "landscape-day": { field: "linen", fieldVeil: 0, navVeil: 0, header: "#754437", headerInk: "#F4F0EB", headerVeil: .65, art: "#1C1C1A", active: "#D69E87" },
  "landscape-night": { field: "ashes", fieldVeil: 0, navVeil: 0, header: "#754437", headerInk: "#F4F0EB", headerVeil: .65, art: "#E5D8C4", active: "#743627" },
  "monument-clay": { field: "linen", fieldVeil: .36, navVeil: .32, header: "#26303B", headerInk: "#EBEBDD", headerVeil: .65, art: "#26303B" },
  "sand-burnt-earth": { field: "linen", fieldVeil: .32, navVeil: .34, header: "#754437", headerInk: "#D3C7AD", headerTint: "#643A2F", headerVeil: .85, art: "#28374A" },
  "garnet-slate": { field: "linen", fieldTint: "#F8E1C7", fieldVeil: .4, navVeil: .34, header: "#6E2C29", headerInk: "#F7DEC1", headerVeil: .65, art: "#6E2C29" },
  "nagtang-black": { field: "ashes", fieldVeil: .14, navVeil: .52, header: "#141311", headerMaterial: "ashes", headerInk: "#D4A54A", headerVeil: .3, art: "#D4A54A", active: "#141311" },
  "mineral-pigments": { field: "linen", fieldVeil: .4, navVeil: .36, header: "#1E3F73", headerInk: "#FBF7EE", headerVeil: .65, art: "#1E3F73" },
  "signature-day": { field: "linen", fieldTint: "#F9F7F4", fieldVeil: .64, cardVeil: .64, navVeil: .32, header: "#2E3D35", headerInk: "#F4F0EB", headerVeil: .65, art: "#2E3D35" },
});

export function materialLayer(color, material, veil) {
  const image = `url('/media/landscape/${material}.webp')`;
  return veil ? `linear-gradient(${hexA(color, veil)},${hexA(color, veil)}), ${image}` : image;
}

export function themeMaterialVars(id, p) {
  const r = MATERIAL_RECIPES[id] || MATERIAL_RECIPES['landscape-day'];
  const lightNav = p.polarity === 'dark';
  const nav = materialLayer(p.navigation, lightNav ? 'linen' : 'ashes', r.navVeil);
  const header = materialLayer(r.headerTint || r.header, r.headerMaterial || 'earth', r.headerVeil);
  return {
    '--land-field': materialLayer(r.fieldTint || p.background, r.field, r.fieldVeil),
    '--land-card-material': materialLayer(p.card, r.field, r.cardVeil ?? .58),
    '--land-panel-material': materialLayer(p.documentSurface, r.field, r.cardVeil ?? .58),
    '--land-nav-material': nav, '--land-nav-bg': p.navigation,
    '--land-header-material': header, '--land-header-bg': r.header,
    '--land-header-ink': r.headerInk, '--land-art-ink': r.art,
    '--land-art-opacity': p.polarity === 'dark' ? '.9' : '.78',
    '--tm-earth-nav-ink': r.active || p.navText,
    '--tm-action-material': materialLayer(p.interactiveAccent, 'earth', .95),
    '--tm-earth': r.header, '--tm-on-earth': r.headerInk,
  };
}
