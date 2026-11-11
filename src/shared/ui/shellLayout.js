import { GUIDE_MATERIAL_SHADOW } from './guideMaterial.js';

export function shellLayoutCss() {
  return `
/* The room fills the available canvas; only a small reading inset remains. */
:root body .tm-page { width: 100%; max-width: none !important; margin-inline: 0 !important; box-sizing: border-box; }
@media (min-width: 821px) {
  :root body .tm-cs-veil {
    padding: calc(var(--tm-sheet-room-top, 0px) + 24px) 16px 24px calc(var(--tm-sheet-room-left, 0px) + 16px) !important;
  }
  :root body .tm-cs-veil > .tm-cs {
    max-width: 100% !important; min-width: 0;
    max-height: min(980px, calc(var(--tm-overlay-height, 100dvh) - var(--tm-sheet-room-top, 0px) - 48px)) !important;
  }
  :root body .tm-page { padding-inline: 24px !important; --land-bleed: 24px; }
  :root body .tm-sidebar {
    position: fixed !important; top: 12px !important; left: 12px;
    margin: 0 !important; width: 268px !important; height: calc(100dvh - 24px) !important;
    max-height: calc(100dvh - 24px); box-sizing: border-box;
    display: flex; flex-direction: column;
    padding: 6px 14px 8px !important; z-index: 45 !important;
    overflow-y: auto; overscroll-behavior: contain;
  }
  :root body .tm-sidebar > * { flex-shrink: 0; }
  :root body .tm-sidebar.collapsed { transform: translateX(calc(-100% - 24px)); }
  :root body .tm-sidebar ~ main { margin-left: 280px; }
  :root body .tm-sidebar.collapsed ~ main { margin-left: 0; }
  :root body .tm-sidebar .tm-sbmotto, :root body .tm-sidebar .tm-mhide { display: none !important; }
  :root body .tm-sidebar .tm-logo { min-height: 44px; padding: 0 8px !important; }
  :root body .tm-sidebar .tm-gear { display: inline-flex !important; width: 44px !important; height: 44px !important; margin-top: 0 !important; }
  :root body .tm-sidebar :is(.tm-undo,.tm-redo) { width: 44px !important; height: 44px !important; }
  :root body .tm-sidebar .tm-nav-item { min-height: 40px; margin-bottom: 0 !important; padding: 8px 10px !important; font-size: 15px !important; }
  :root body .tm-sidebar .tm-sidebar-search { margin-bottom: 4px !important; }
  :root body .tm-sidebar .tm-sidebar-group { margin-bottom: 2px !important; }
  :root body .tm-sidebar .tm-sidebar-group > div:first-child { padding-bottom: 0 !important; line-height: 1.2; }
  :root body .tm-sidebar .tm-sbdno { margin-top: auto !important; padding-top: 12px !important; }
}
/* Compact laptop heights preserve all destinations. Exceptionally short
   viewports or enlarged text can still scroll rather than lose an action. */
@media (min-width: 821px) and (max-height: 740px) {
  :root body .tm-sidebar .tm-nav-item { min-height: 36px; padding-block: 6px !important; }
  :root body .tm-sidebar .tm-sidebar-group { margin-bottom: 0 !important; }
  :root body .tm-sidebar .tm-sbdno { padding-top: 6px !important; }
}
/* Match the website's translucent sandstone navigation surface. */
html[data-frame-grammar] body .tm-topbar {
  background-color: rgba(229,216,196,.76) !important;
  background-image: none !important;
  border-bottom: 1px solid rgba(28,28,26,.055) !important;
  box-shadow: none !important;
  backdrop-filter: blur(15px) saturate(.9) !important;
  -webkit-backdrop-filter: blur(15px) saturate(.9) !important;
  color: #1c1c1a;
}
html[data-frame-grammar] body .tm-topbar::before {
  content: none;
}
html[data-frame-grammar] body .tm-topbar :is(button,span,div,[role="button"]) { color: #1c1c1a !important; }
html[data-frame-grammar] body .tm-topbar button { border-color: rgba(28,28,26,.14) !important; }
:root body .tm-sidebar, :root body .tm-sidebar.open, :root body .tm-tabbar {
  box-shadow: none !important; filter: ${GUIDE_MATERIAL_SHADOW};
}
`;
}
