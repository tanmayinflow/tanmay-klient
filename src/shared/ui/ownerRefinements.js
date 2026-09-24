// Explicit owner refinements, 2026-09-21. Original artwork remains unchanged.
export function ownerRefinementsCss() {
  return `
:root { --tm-earth: #754437; --tm-on-earth: #F4F0EB; --tm-earth-nav-ink: #D69E87; }
.tm-sidebar { isolation: isolate; overflow-x: hidden !important; scrollbar-width: none; scrollbar-gutter: auto !important; }
.tm-sidebar .tm-gear { position: relative; left: var(--tm-gear-shift, -32px); transform: none !important; z-index: 2; }
.tm-sidebar .tm-sidebar-search { width: var(--tm-search-width, calc(100% - 48px)); box-sizing: border-box; }
.tm-sidebar .tm-sbdno { border-top: 0 !important; }
.tm-sidebar .tm-history { position: relative; }
.tm-sidebar .tm-history > span:first-child { max-width: calc(var(--tm-undo-left, 160px) - 6px); }
.tm-sidebar .tm-history :is(.tm-undo,.tm-redo) { position: absolute; top: 50%; transform: translateY(-50%) !important; }
.tm-sidebar .tm-history .tm-undo { left: var(--tm-undo-left, 60%); }
.tm-sidebar .tm-history .tm-redo { left: var(--tm-redo-left, 78%); }
html[data-appearance] .tm-sidebar .tm-nav-item { transition: color .18s ease !important; }
@media (hover: hover) { html[data-appearance] .tm-sidebar .tm-nav-item:hover { background: transparent !important; box-shadow: none !important; color: var(--tm-earth-nav-ink) !important; transform: none !important; } html[data-appearance] .tm-sidebar .tm-nav-item:hover > span:first-child { color: var(--tm-earth-nav-ink) !important; } html[data-appearance] .tm-sidebar .tm-history :is(.tm-undo,.tm-redo):hover { transform: translateY(-50%) !important; } }
.tm-sidebar::-webkit-scrollbar { display: none; width: 0; }
.tm-sidebar-lines { position: absolute; inset: 0 0 auto; pointer-events: none; z-index: -1; overflow: hidden; }
.tm-sidebar-lines > span { position: absolute; top: 50%; left: calc(100% - 45px); transform: translate(-50%, -50%) rotate(90deg); background: #C5B49A; opacity: .36; mask: url('/media/landscape/sidebar-line.png') center/100% 100% no-repeat; -webkit-mask: url('/media/landscape/sidebar-line.png') center/100% 100% no-repeat; }
html[data-appearance] .tm-sidebar .tm-nav-active { background: transparent !important; color: var(--tm-earth-nav-ink) !important; box-shadow: none !important; border-left-color: transparent !important; }
html[data-appearance] .tm-sidebar .tm-nav-active > span:first-child { color: var(--tm-earth-nav-ink) !important; }
html[data-appearance] .tm-tabbar button[aria-current="page"] { color: var(--tm-earth-nav-ink) !important; background: transparent !important; box-shadow: none !important; border-color: transparent !important; }
html[data-appearance] .tm-tabbar button[aria-current="page"] > span:first-child { color: var(--tm-earth-nav-ink) !important; transform: none !important; }
.tm-aspect-hero { background: var(--tm-earth) !important; color: var(--tm-on-earth); }
.tm-aspect-hero * { color: var(--tm-on-earth) !important; }
.tm-aspect-hero > div:first-child { background: none !important; }
.tm-aspect-hero > div:nth-child(2) { background: var(--tm-on-earth) !important; }
.tm-page-icon { display: inline-flex; flex: 0 0 auto; align-items: center; }
.tm-page-icon [data-tm-icon] { width: calc(48px * var(--tm-read, 1)) !important; height: calc(48px * var(--tm-read, 1)) !important; }
.tm-page-icon svg[data-tm-icon] { stroke-width: .5; }
html[data-appearance] .tm-page-title[data-art-room="prameny"]::before { top: 18px; }
@media (max-width: 370px) { .tm-page-title h1 { gap: 10px !important; } }
@media print { .tm-sidebar-lines { display: none; } }
.tm-morning-spells { margin: 36px auto 20px; max-width: 620px; color: var(--tm-heading); }
.tm-morning-spells h2 { margin: 0 0 16px; text-align: center; font: 400 calc(20px * var(--tm-read, 1))/1.2 var(--tm-font-display); }
.tm-spell-composition { display: grid; grid-template-columns: 76px minmax(0, 1fr); align-items: start; gap: 14px; }
.tm-spell-sword { display: block; width: 100%; height: 220px; background: currentColor; opacity: .52; mask: url('/media/icons/manjushri-sword.png') center/auto 100% no-repeat; -webkit-mask: url('/media/icons/manjushri-sword.png') center/auto 100% no-repeat; }
.tm-spell-reading { min-width: 0; text-align: center; }
.tm-spell-reading p { margin: 0; min-height: 0; font: italic 400 calc(17px * var(--tm-read, 1))/1.4 var(--tm-font-display); text-wrap: pretty; }
.tm-spell-controls { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 18px; }
.tm-spell-controls button { display: grid; place-items: center; width: 44px; min-height: 44px; padding: 0; border: 0; background: transparent; color: var(--tm-link); cursor: pointer; }
.tm-spell-controls span { font: 400 12px/1.3 var(--tm-font-tag); letter-spacing: .12em; }
@media (max-width: 370px) { .tm-spell-composition { grid-template-columns: 56px minmax(0, 1fr); gap: 10px; } .tm-spell-reading p { font-size: calc(17px * var(--tm-read, 1)); } }

`;
}
