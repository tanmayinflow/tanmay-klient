import { LANDSCAPE_ART } from "./landscape.js";

// Paint only. The original app owns all flow, dimensions, type and controls.
// Decorative pseudo-elements never reserve space or receive pointer events.
export function landscapeCss() {
  const s = 'html:is([data-appearance="landscape-day"],[data-appearance="landscape-night"])';
  const rooms = Object.entries(LANDSCAPE_ART).filter(([room, art]) => room !== 'praxe' && art.shape !== 'horizon').map(([room, art]) =>
    `${s} .tm-page-title[data-art-room="${room}"] { --land-art: url('/media/landscape/${art.image}'); }`).join('\n');
  return `
${s} { --land-paper: url('/media/landscape/linen.webp'); --land-ash: url('/media/landscape/ashes.webp'); --land-earth: url('/media/landscape/earth.webp'); --land-field: var(--land-paper); }
${s} ::selection { background: var(--tm-selection) !important; color: var(--tm-selection-text) !important; }
html[data-appearance="landscape-night"] { --land-field: var(--land-ash); }
${s} body, ${s} .tm-ground { background-image: var(--land-field) !important; background-size: 768px auto !important; }
/* The terrain field now belongs only to Practice. Its fixed box clips the rotated art. */
${s} .tm-ground { overflow: hidden; }
${s}:has(.tm-page[data-room="praxe"]) .tm-ground::after { content: ''; position: absolute; inset: auto -5% 0; height: clamp(110px, 25vh, 240px); background: var(--tm-link); mask: url('/media/landscape/copper-line.png') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/copper-line.png') center/100% 100% no-repeat; opacity: .12; transform: rotate(9deg); pointer-events: none; }
${s} :is(.tm-sidebar,.tm-tabbar) { background-image: var(--land-ash) !important; background-size: 768px auto !important; }
${s} .tm-sidebar .tm-logo > span { color: var(--tm-nav-text) !important; }
${s} .tm-sidebar .tm-nav-active { background: transparent !important; border-left-color: transparent !important; box-shadow: none !important; color: var(--tm-nav-text-sec) !important; }
${s} .tm-sidebar .tm-nav-active > span:first-child { color: var(--tm-nav-accent) !important; }
${s} .tm-sidebar .tm-nav-active > img:first-child { filter: brightness(1.3); }
${s} .tm-tabbar button[aria-current="page"] { background: transparent !important; color: var(--tm-nav-muted) !important; }
${s} .tm-tabbar button[aria-current="page"] > span:first-child { color: var(--tm-nav-accent) !important; }
${s} :is(.tm-sidebar,.tm-tabbar) button:focus-visible { outline-color: var(--tm-nav-accent) !important; }
${s} :is(.tm-drawer,.tm-calcard,.tm-card,.tm-topbar) { background-image: var(--land-field) !important; background-size: 768px auto !important; }
${s} :is(.tm-cs,.tm-nahled,.tm-zen) { background: var(--tm-document) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
/* Earth headers carry the website's actual outgoing contour; controls stay outside the mask. */
${s} :is(.tm-cs-head,.tm-nahled-head) { isolation: isolate; background: #754437 var(--land-earth) center top/768px auto !important; color: #F4F0EB !important; border-bottom-color: transparent !important; }
${s} :is(.tm-cs-head,.tm-nahled-head)::after { content: ''; position: absolute; left: 0; right: 0; bottom: -23px; height: 24px; z-index: -1; background: #754437 var(--land-earth) center bottom/768px auto; mask: url('/media/landscape/edge-wide.png') center 76%/160% 130px no-repeat; -webkit-mask: url('/media/landscape/edge-wide.png') center 76%/160% 130px no-repeat; pointer-events: none; }
${s} :is(.tm-cs-head,.tm-nahled-head) :is(button,span,svg) { color: #F4F0EB !important; }
${s} :is(.tm-cs-head,.tm-nahled-head) button { background: transparent !important; border-color: rgba(244,240,235,.45) !important; }
${s} :is(.tm-cs-head,.tm-nahled-head) button:focus-visible { outline-color: #F4F0EB !important; }
${s} .tm-cs-body { padding-top: 28px !important; }
${s} .tm-nahled-head { top: 0 !important; left: 0 !important; right: 0 !important; padding: calc(13px + env(safe-area-inset-top)) 18px 10px; }
${s} .tm-nahled-telo { top: calc(86px + env(safe-area-inset-top)) !important; }
${s} .tm-pomo-backdrop { background: #1C1C1A var(--land-ash) center/768px auto !important; }
${s} .tm-wb-dot[aria-pressed="true"] { background: var(--tm-accent) !important; border-color: var(--tm-accent) !important; }
/* Category strips sit directly on the field, including their fixed controls. */
${s} :is(.tm-tabsrow,.tm-typerow,.tm-tabsctrl), ${s} .tm-tabsctrl::before, ${s} .tm-tabsctrl > button { background: transparent !important; }
${s} .tm-page-title { position: relative; isolation: isolate; --land-art: none; }
${s} .tm-page-title::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--land-art) right center/auto 100% no-repeat; opacity: .38; pointer-events: none; }
html[data-appearance="landscape-night"] .tm-page-title::before { filter: invert(1); opacity: .3; }
${s} .tm-page-title::after { content: ''; position: absolute; left: 0; right: 0; bottom: -10px; height: 20px; z-index: -1; background: var(--tm-link); mask: url('/media/landscape/double-line-mask.svg') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/double-line-mask.svg') center/100% 100% no-repeat; opacity: .45; pointer-events: none; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="kompas"],[data-art-room="denik"],[data-art-room="hospodareni"])::after { content: none; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose, ${s} .tm-compass-divider { position: relative; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose { margin-bottom: 28px !important; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose::after, ${s} .tm-compass-divider::after { content: ''; position: absolute; left: 0; right: 0; bottom: -21px; height: 25px; background: var(--tm-link); mask: url('/media/landscape/line-l02-mask.svg') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/line-l02-mask.svg') center/100% 100% no-repeat; pointer-events: none; }
${s} .tm-compass-divider { background: transparent !important; }
${s} .tm-compass-divider::after { bottom: -12px; }
${s} .tm-compass-daytasks { border-top-color: transparent !important; }
${rooms}
${s} .tm-page[data-room="klienti"] .tm-page-title { --land-art: url('/media/landscape/equipment.webp'); }
${s} .tm-page-title[data-art-room="trenink"] { min-height: 164px; }
${s} .tm-page-title[data-art-room="trenink"]::before { top: 45px; bottom: -8px; background-size: auto 120px; opacity: .75; }
@media print { ${s} .tm-page-title::before, ${s} .tm-page-title::after, ${s} .tm-ground::after, ${s} .tm-prose::after, ${s} .tm-compass-divider::after, ${s} .tm-cs-head::after { content: none; } }
`;
}
