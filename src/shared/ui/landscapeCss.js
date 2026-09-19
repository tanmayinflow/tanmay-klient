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
${s} :is(.tm-sidebar,.tm-tabbar) { background-image: var(--land-ash) !important; background-size: 768px auto !important; }
${s} .tm-sidebar .tm-logo > span { color: var(--tm-nav-text) !important; }
${s} .tm-sidebar .tm-nav-active { background-image: var(--land-earth) !important; background-size: cover !important; }
${s} .tm-tabbar button[aria-current="page"] { background-image: var(--land-earth) !important; background-size: cover !important; color: var(--tm-nav-accent) !important; }
${s} :is(.tm-cs,.tm-drawer,.tm-calcard,.tm-card,.tm-topbar) { background-image: var(--land-field) !important; background-size: 768px auto !important; }
${s} .tm-page-title { position: relative; isolation: isolate; --land-art: url('/media/landscape/strata.svg'); }
${s} .tm-page-title::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--land-art) right center/auto 100% no-repeat; opacity: .38; pointer-events: none; }
html[data-appearance="landscape-night"] .tm-page-title::before { filter: invert(1); opacity: .3; }
${s} .tm-page-title::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 8px; z-index: -1; background: var(--land-earth) center/768px auto; mask: url('/media/landscape/edge.png') center calc(100% + 17px)/100% 80px no-repeat; -webkit-mask: url('/media/landscape/edge.png') center calc(100% + 17px)/100% 80px no-repeat; opacity: .65; pointer-events: none; }
${rooms}
${s} .tm-page[data-room="klienti"] .tm-page-title { --land-art: url('/media/landscape/equipment.webp'); }
${s} .tm-page[data-room="kos"] .tm-page-title { --land-art: url('/media/landscape/terrain.svg'); }
html[data-appearance="landscape-night"] .tm-page-title:is([data-art-room="denik"],[data-art-room="kompas"],[data-art-room="hospodareni"],[data-art-room="socsite"])::before { filter: brightness(1.6); }
@media print { ${s} .tm-page-title::before, ${s} .tm-page-title::after { content: none; } }
`;
}
