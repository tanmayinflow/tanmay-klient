import { GUIDE_MATERIAL_BORDER, GUIDE_MATERIAL_SHADOW } from './guideMaterial.js';

export function shellLayoutCss() {
  return `
/* The room fills the available canvas; only a small reading inset remains. */
:root body .tm-page { width: 100%; max-width: none !important; margin-inline: 0 !important; box-sizing: border-box; }
@media (min-width: 821px) {
  :root body .tm-page { padding-inline: 24px !important; --land-bleed: 24px; }
  :root body .tm-sidebar {
    position: fixed !important; top: 12px !important; left: 12px;
    margin: 0 !important; width: 268px !important; height: auto !important;
    max-height: calc(100dvh - 24px); box-sizing: border-box;
    padding: 6px 14px 8px !important; z-index: 45 !important;
    overflow-y: auto; overscroll-behavior: contain;
  }
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
  :root body .tm-sidebar .tm-sbdno { margin-top: 12px !important; padding-top: 0 !important; }
}
/* Compact laptop heights preserve all destinations. Exceptionally short
   viewports or enlarged text can still scroll rather than lose an action. */
@media (min-width: 821px) and (max-height: 740px) {
  :root body .tm-sidebar .tm-nav-item { min-height: 36px; padding-block: 6px !important; }
  :root body .tm-sidebar .tm-sidebar-group { margin-bottom: 0 !important; }
  :root body .tm-sidebar .tm-sbdno { margin-top: 6px !important; }
}
/* Keep the texture behind the controls, never mask the controls themselves. */
html[data-frame-grammar] body .tm-topbar {
  isolation: isolate; background: none !important; border: 0 !important;
  backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
  color: #f4f0eb;
}
html[data-frame-grammar] body .tm-topbar::before {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  border-image: ${GUIDE_MATERIAL_BORDER}; opacity: .98;
  filter: ${GUIDE_MATERIAL_SHADOW};
}
html[data-frame-grammar] body .tm-topbar :is(button,span,div,[role="button"]) { color: #f4f0eb !important; }
html[data-frame-grammar] body .tm-topbar button { border-color: rgba(244,240,235,.38) !important; }
:root body .tm-sidebar, :root body .tm-sidebar.open, :root body .tm-tabbar {
  box-shadow: none !important; filter: ${GUIDE_MATERIAL_SHADOW};
}
`;
}
