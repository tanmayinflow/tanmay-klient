// Reuse the approved, full-resolution website materials. Constant-color veils
// keep each palette's hue and reduce texture contrast without modifying assets.
import { hexA } from "./color.js";

export const MATERIAL_RECIPES = Object.freeze({
  "landscape-day": { field: "linen", fieldVeil: 0, navVeil: 0, header: "#754437", headerInk: "#F4F0EB", headerVeil: .65, art: "#1C1C1A", active: "#D69E87" },
  "landscape-night": { field: "ashes", fieldVeil: 0, navVeil: 0, header: "#754437", headerInk: "#F4F0EB", headerVeil: .65, art: "#E5D8C4", active: "#743627" },
  "monument-clay": { field: "linen", fieldVeil: .91, navVeil: .78, header: "#26303B", headerInk: "#EBEBDD", headerVeil: .88, art: "#26303B" },
  "sand-burnt-earth": { field: "linen", fieldVeil: .9, navVeil: .8, header: "#754437", headerInk: "#D3C7AD", headerVeil: .98, art: "#28374A" },
  "garnet-slate": { field: "linen", fieldVeil: .92, navVeil: .82, header: "#6E2C29", headerInk: "#F7DEC1", headerVeil: .92, art: "#6E2C29" },
  "nagtang-black": { field: "ashes", fieldVeil: .76, navVeil: .72, header: "#141311", headerInk: "#D4A54A", headerVeil: .94, art: "#D4A54A", active: "#141311" },
  "mineral-pigments": { field: "linen", fieldVeil: .92, navVeil: .88, header: "#1E3F73", headerInk: "#FBF7EE", headerVeil: .94, art: "#1E3F73" },
  "signature-day": { field: "linen", fieldVeil: .94, navVeil: .65, header: "#2E3D35", headerInk: "#F4F0EB", headerVeil: .92, art: "#2E3D35" },
});

export function materialLayer(color, material, veil) {
  const image = `url('/media/landscape/${material}.webp')`;
  return veil ? `linear-gradient(${hexA(color, veil)},${hexA(color, veil)}), ${image}` : image;
}

export function themeMaterialVars(id, p) {
  const r = MATERIAL_RECIPES[id] || MATERIAL_RECIPES['landscape-day'];
  const lightNav = p.polarity === 'dark';
  const nav = materialLayer(p.navigation, lightNav ? 'linen' : 'ashes', r.navVeil);
  const header = materialLayer(r.header, 'earth', r.headerVeil);
  return {
    '--land-field': materialLayer(p.background, r.field, r.fieldVeil),
    '--land-card-material': materialLayer(p.card, r.field, .95),
    '--land-panel-material': materialLayer(p.documentSurface, r.field, .96),
    '--land-nav-material': nav, '--land-nav-bg': p.navigation,
    '--land-header-material': header, '--land-header-bg': r.header,
    '--land-header-ink': r.headerInk, '--land-art-ink': r.art,
    '--land-art-opacity': p.polarity === 'dark' ? '.9' : '.78',
    '--tm-earth-nav-ink': r.active || p.navText,
    '--tm-action-material': materialLayer(p.interactiveAccent, 'earth', .95),
    '--tm-earth': r.header, '--tm-on-earth': r.headerInk,
  };
}
