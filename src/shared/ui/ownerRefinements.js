// Explicit owner refinements, 2026-09-21. Original artwork remains unchanged.
export function ownerRefinementsCss() {
  return `
:root { --tm-earth: #754437; --tm-on-earth: #F4F0EB; }
.tm-sidebar { isolation: isolate; overflow-x: hidden !important; }
.tm-sidebar::after { content: ''; position: absolute; pointer-events: none; z-index: -1; top: 50%; left: calc(100% - 26px); width: min(620px, 70vh); aspect-ratio: 3; transform: translate(-50%, -50%) rotate(90deg); background: #C5B49A; opacity: .36; mask: url('/media/landscape/sidebar-line.png') center/contain no-repeat; -webkit-mask: url('/media/landscape/sidebar-line.png') center/contain no-repeat; }
html[data-appearance] .tm-sidebar .tm-nav-active { background: var(--tm-earth) !important; color: var(--tm-on-earth) !important; box-shadow: none !important; border-left-color: transparent !important; }
html[data-appearance] .tm-sidebar .tm-nav-active > span:first-child { color: var(--tm-on-earth) !important; }
html[data-appearance] .tm-tabbar button[aria-current="page"] { color: var(--tm-on-earth) !important; background: var(--tm-earth) !important; }
html[data-appearance] .tm-tabbar button[aria-current="page"] > span:first-child { color: var(--tm-on-earth) !important; transform: none !important; }
.tm-aspect-hero { background: var(--tm-earth) !important; color: var(--tm-on-earth); }
.tm-aspect-hero * { color: var(--tm-on-earth) !important; }
.tm-aspect-hero > div:first-child { background: none !important; }
.tm-aspect-hero > div:nth-child(2) { background: var(--tm-on-earth) !important; }
.tm-page-icon { display: inline-flex; flex: 0 0 auto; align-items: center; }
.tm-page-icon [data-tm-icon] { width: calc(48px * var(--tm-read, 1)) !important; height: calc(48px * var(--tm-read, 1)) !important; }
.tm-page-icon svg[data-tm-icon] { stroke-width: .5; }
html[data-appearance] .tm-page-title[data-art-room="prameny"]::before { top: 18px; }
@media (max-width: 370px) { .tm-page-title h1 { gap: 10px !important; } }
@media print { .tm-sidebar::after { content: none; } }
`;
}
