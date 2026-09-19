import { LANDSCAPE_ART } from "./landscape.js";

// Paint only. The original app owns all flow, dimensions, type and controls.
// Decorative pseudo-elements never reserve space or receive pointer events.
export function landscapeCss() {
  const s = 'html:is([data-appearance="landscape-day"],[data-appearance="landscape-night"])';
  const rooms = Object.entries(LANDSCAPE_ART).map(([room, art]) =>
    `${s} .tm-page-title[data-art-room="${room}"] { --land-art: url('/media/landscape/${art.image}'); }`).join('\n');
  return `
${s} { --land-paper: url('/media/landscape/linen.webp'); --land-ash: url('/media/landscape/ashes.webp'); --land-earth: url('/media/landscape/earth.webp'); --land-field: var(--land-paper); }
${s} ::selection { background: var(--tm-selection) !important; color: var(--tm-selection-text) !important; }
html[data-appearance="landscape-night"] { --land-field: var(--land-ash); }
${s} body, ${s} .tm-ground { background-image: var(--land-field) !important; background-size: 768px auto !important; }
${s} .tm-ground::after { content: ''; position: absolute; inset: auto 0 0; height: clamp(110px, 25vh, 240px); background: var(--tm-link); mask: url('/media/landscape/copper-line.png') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/copper-line.png') center/100% 100% no-repeat; opacity: .12; pointer-events: none; }
${s} :is(.tm-sidebar,.tm-tabbar) { background-image: var(--land-ash) !important; background-size: 768px auto !important; }
${s} .tm-sidebar .tm-logo > span { color: var(--tm-nav-text) !important; }
${s} .tm-sidebar .tm-nav-active { background: transparent !important; border-left-color: transparent !important; box-shadow: none !important; color: var(--tm-nav-text-sec) !important; }
${s} .tm-sidebar .tm-nav-active > span:first-child { color: var(--tm-nav-accent) !important; }
${s} .tm-sidebar .tm-nav-active > img:first-child { filter: brightness(1.3); }
${s} .tm-tabbar button[aria-current="page"] { background: transparent !important; color: var(--tm-nav-muted) !important; }
${s} .tm-tabbar button[aria-current="page"] > span:first-child { color: var(--tm-nav-accent) !important; }
${s} :is(.tm-sidebar,.tm-tabbar) button:focus-visible { outline-color: var(--tm-nav-accent) !important; }
/* The alpha strips trim only a few pixels of paint, inside the existing padding.
   The solid middle preserves every control and the original scrolling box. */
${s} .tm-sidebar { mask-image: url('/media/landscape/edge-top.png'), url('/media/landscape/edge-wide.png'), linear-gradient(#000, #000); mask-size: 100% 24px, 100% 24px, 100% calc(100% - 24px); mask-position: top, bottom, center; mask-repeat: no-repeat; mask-mode: alpha; mask-composite: add; -webkit-mask-image: url('/media/landscape/edge-top.png'), url('/media/landscape/edge-wide.png'), linear-gradient(#000, #000); -webkit-mask-size: 100% 24px, 100% 24px, 100% calc(100% - 24px); -webkit-mask-position: top, bottom, center; -webkit-mask-repeat: no-repeat; -webkit-mask-composite: source-over; }
${s} .tm-tabbar { mask-image: url('/media/landscape/edge-top.png'), linear-gradient(#000, #000); mask-size: 100% 24px, 100% calc(100% - 12px); mask-position: top, bottom; mask-repeat: no-repeat; mask-mode: alpha; mask-composite: add; -webkit-mask-image: url('/media/landscape/edge-top.png'), linear-gradient(#000, #000); -webkit-mask-size: 100% 24px, 100% calc(100% - 12px); -webkit-mask-position: top, bottom; -webkit-mask-repeat: no-repeat; -webkit-mask-composite: source-over; }
${s} :is(.tm-cs,.tm-drawer,.tm-calcard,.tm-card,.tm-topbar) { background-image: var(--land-field) !important; background-size: 768px auto !important; }
/* Category strips sit directly on the field, including their fixed controls. */
${s} :is(.tm-tabsrow,.tm-typerow,.tm-tabsctrl), ${s} .tm-tabsctrl::before, ${s} .tm-tabsctrl > button { background: transparent !important; }
${s} .tm-page-title { position: relative; isolation: isolate; --land-art: url('/media/landscape/strata.svg'); }
${s} .tm-page-title::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--land-art) right center/auto 100% no-repeat; opacity: .38; pointer-events: none; }
html[data-appearance="landscape-night"] .tm-page-title::before { filter: invert(1); opacity: .3; }
${s} .tm-page-title::after { content: ''; position: absolute; left: 0; right: 0; bottom: -10px; height: 20px; z-index: -1; background: var(--tm-link); mask: url('/media/landscape/double-line-mask.svg') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/double-line-mask.svg') center/100% 100% no-repeat; opacity: .45; pointer-events: none; }
${rooms}
${s} .tm-page[data-room="klienti"] .tm-page-title { --land-art: url('/media/landscape/equipment.webp'); }
${s} .tm-page[data-room="kos"] .tm-page-title { --land-art: url('/media/landscape/terrain.svg'); }
html[data-appearance="landscape-night"] .tm-page-title:is([data-art-room="denik"],[data-art-room="kompas"],[data-art-room="hospodareni"],[data-art-room="socsite"])::before { filter: brightness(1.6); }
@media print { ${s} .tm-page-title::before, ${s} .tm-page-title::after, ${s} .tm-ground::after { content: none; } }
`;
}
