import { LANDSCAPE_ART } from "./landscape.js";

// The original app owns its structure. Only the owner's named header refinements
// adjust local spacing; artwork never receives pointer input.
export function landscapeCss() {
  const s = 'html:is([data-appearance="landscape-day"],[data-appearance="landscape-night"])';
  const rooms = Object.entries(LANDSCAPE_ART).filter(([, art]) => art.shape !== 'horizon').map(([room, art]) =>
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
${s} .tm-sidebar-search { border-color: #754437 !important; }
/* Scroll remains native; it no longer reserves a pale gutter beside the material. */
${s}, ${s} body, ${s} .tm-scroll { scrollbar-width: none !important; scrollbar-gutter: auto !important; }
${s}::-webkit-scrollbar, ${s} body::-webkit-scrollbar, ${s} .tm-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
${s} .tm-tabbar { left: 0 !important; right: 0 !important; border: 0 !important; border-radius: 0 !important; overflow: visible !important; isolation: isolate; }
${s} .tm-tabbar::before { content: ''; position: absolute; left: 0; right: 0; top: -23px; height: 24px; z-index: -1; background: #1C1C1A var(--land-ash) center top/768px auto; mask: url('/media/landscape/edge-wide.png') center 76%/160% 130px no-repeat; -webkit-mask: url('/media/landscape/edge-wide.png') center 76%/160% 130px no-repeat; transform: scaleY(-1); pointer-events: none; }
@media (max-width: 820px) { ${s} .tm-tabbar { padding-left: max(6px, env(safe-area-inset-left)) !important; padding-right: max(6px, env(safe-area-inset-right)) !important; } }
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
${s} .tm-cs { --land-sheet-pad: clamp(18px, calc(3 * var(--tm-vw)), 34px); padding: 0 !important; }
${s} .tm-cs-head { top: 0 !important; margin: 0 !important; padding: 18px var(--land-sheet-pad) 12px !important; }
${s} .tm-cs-body { padding: 28px var(--land-sheet-pad) 34px !important; }
@media (max-width: 820px) {
  ${s} .tm-cs { --land-sheet-pad: 16px; }
  ${s} .tm-cs-head { padding: calc(env(safe-area-inset-top) + 11px) 16px 9px !important; }
  ${s} .tm-cs-body { padding-bottom: var(--tm-kraj) !important; }
}
${s} .tm-nahled-head { z-index: 2; top: 0 !important; left: 0 !important; right: 0 !important; padding: calc(13px + env(safe-area-inset-top)) 18px 10px; }
/* The scroll viewport reaches behind the fixed header; padding sets only its initial position. */
${s} .tm-nahled-telo { top: 0 !important; padding-top: calc(86px + env(safe-area-inset-top)) !important; }
${s} .tm-pomo-backdrop { background: #1C1C1A var(--land-ash) center/768px auto !important; }
${s} .tm-wb-dot[aria-pressed="true"] { background: var(--tm-accent) !important; border-color: var(--tm-accent) !important; }
/* Category strips sit directly on the field, including their fixed controls. */
${s} :is(.tm-tabsrow,.tm-typerow,.tm-tabsctrl), ${s} .tm-tabsctrl::before, ${s} .tm-tabsctrl > button { background: transparent !important; }
${s} :is(.tm-tabsrow,.tm-tab-rail,[role="tablist"]) { border-bottom-color: transparent !important; }
${s} .tm-page { --land-bleed: clamp(28px, calc(4 * var(--tm-vw)), 72px); --land-line-height: clamp(40px, calc(15.63 * var(--tm-vw)), 70px); }
@media (max-width: 820px) { ${s} .tm-page { --land-bleed: 14px; } }
${s} .tm-page-title { position: relative; isolation: isolate; --land-art: none; margin-bottom: calc(var(--land-line-height) + 8px); }
${s} .tm-page-title::before { content: ''; position: absolute; inset: 0; z-index: -1; background: currentColor; mask: var(--land-art) right center/contain no-repeat; -webkit-mask: var(--land-art) right center/contain no-repeat; opacity: .38; pointer-events: none; }
html[data-appearance="landscape-night"] .tm-page-title::before { opacity: .3; }
/* Original three-contour source; its SVG alpha stroke stays legible at phone width. */
${s} .tm-page-title::after, ${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose::after, ${s} .tm-compass-divider::after { content: ''; display: block; height: var(--land-line-height); background: var(--tm-link); mask: url('/media/landscape/terrain-divider.svg') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/terrain-divider.svg') center/100% 100% no-repeat; pointer-events: none; }
${s} .tm-page-title::after { position: absolute; left: calc(-1 * var(--land-bleed)); right: calc(-1 * var(--land-bleed)); top: calc(100% + 4px); z-index: -1; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="kompas"],[data-art-room="denik"],[data-art-room="hospodareni"],[data-art-room="zapisnik"],[data-art-room="prameny"]) { margin-bottom: 0; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="kompas"],[data-art-room="denik"],[data-art-room="hospodareni"],[data-art-room="zapisnik"],[data-art-room="prameny"])::after { content: none; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose { margin-bottom: 4px !important; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose::after { margin: 4px calc(-1 * var(--land-bleed)) 0; }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="denik"]) + .tm-prose + * { margin-top: 6px !important; }
${s} .tm-page-title[data-art-room="praxe"] + .tm-prose + div { height: 0 !important; margin-top: 0 !important; }
${s} .tm-page-title[data-art-room="praxe"] + .tm-prose + div + div > [role="tablist"] { margin-top: 4px !important; }
${s} .tm-page-title[data-art-room="kompas"] + .tm-prose { margin-bottom: 0 !important; }
${s} .tm-compass-divider { background: transparent !important; height: var(--land-line-height) !important; margin: 4px 0 !important; }
${s} .tm-compass-divider::after { margin-inline: calc(-1 * var(--land-bleed)); }
${s} .tm-compass-daytasks { border-top-color: transparent !important; }
${rooms}
${s} .tm-page[data-room="klienti"] .tm-page-title { --land-art: url('/media/icons/clients-hand-v2.png'); }
${s} .tm-page-title[data-art-room="zapisnik"] { min-height: 118px; }
${s} .tm-page-title[data-art-room="zapisnik"]::before { inset: 0 54px auto auto; width: 100px; height: 144px; background-size: contain; background-position: right top; opacity: .5; }
${s} .tm-page-title:is([data-art-room="prameny"],[data-art-room="denik"]) { min-height: 116px; }
${s} .tm-page-title:is([data-art-room="prameny"],[data-art-room="denik"])::before { inset: -4px 52px auto auto; width: 152px; height: 106px; background-size: contain; background-position: right top; opacity: .5; }
${s} .tm-page-title[data-art-room="prameny"]::before { top: -8px; width: 126px; height: 88px; transform: rotate(9deg); }
${s} .tm-page-title:is([data-art-room="praxe"],[data-art-room="kompas"],[data-art-room="hospodareni"],[data-art-room="socsite"],[data-art-room="kos"]) { min-height: 104px; }
${s} .tm-page-title:is([data-art-room="kompas"],[data-art-room="hospodareni"],[data-art-room="socsite"],[data-art-room="kos"])::before { inset: 0 8px auto auto; width: 128px; height: 100px; opacity: .32; }
${s} .tm-page-title[data-art-room="praxe"]::before { inset: 0 8px auto auto; width: 142px; height: 100px; background-size: contain; background-position: right top; opacity: .28; }
${s} .tm-page-title[data-art-room="trenink"] { min-height: 144px; }
${s} .tm-page-title[data-art-room="trenink"]::before { inset: 0 0 auto auto; width: 194px; height: 124px; background-size: contain; background-position: right top; opacity: .65; }
${s} .tm-page[data-room="klienti"] .tm-page-title { min-height: 140px; }
${s} .tm-page[data-room="klienti"] .tm-page-title::before { inset: 0 0 auto auto; width: 218px; height: 140px; background-size: contain; background-position: right top; opacity: .55; }
@media (min-width: 371px) and (max-width: 410px) {
  ${s} .tm-page-title[data-art-room="prameny"]::before { right: 48px; width: 94px; height: 68px; }
  ${s} .tm-page-title[data-art-room="trenink"]::before { width: 164px; height: 108px; }
  ${s} .tm-page[data-room="klienti"] .tm-page-title::before { width: 184px; height: 122px; }
}
@media (max-width: 370px) {
  ${s} .tm-page-title[data-art-room="zapisnik"]::before { right: 44px; width: 60px; height: 90px; }
  ${s} .tm-page-title[data-art-room="denik"]::before { right: 44px; width: 88px; height: 66px; }
  ${s} .tm-page-title[data-art-room="prameny"]::before { top: 0; right: 48px; width: 84px; height: 60px; }
  ${s} .tm-page-title[data-art-room="prameny"] h1 { padding-top: 30px; }
  ${s} .tm-page-title[data-art-room="praxe"]::before { width: 128px; }
  ${s} .tm-page-title[data-art-room="trenink"]::before { width: 165px; }
  ${s} .tm-page[data-room="klienti"] .tm-page-title::before { width: 186px; }
  ${s} .tm-page-title[data-art-room="trenink"] h1, ${s} .tm-page[data-room="klienti"] .tm-page-title h1 { padding-top: 96px; }
}
@media print { ${s} .tm-page-title::before, ${s} .tm-page-title::after, ${s} .tm-ground::after, ${s} .tm-prose::after, ${s} .tm-compass-divider::after, ${s} .tm-cs-head::after, ${s} .tm-tabbar::before { content: none; } }
`;
}
