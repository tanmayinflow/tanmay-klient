import React from 'react';
import { createPortal } from 'react-dom';

// One normal-flow stack: translated messages and large fonts cannot overlap the
// next warning. Portalling also avoids transformed app/overlay containing blocks.
export function AppNotices({ children }) {
  return createPortal(<div className="tm-app-notices" data-tm-no-swipe>
    <style>{`
      .tm-app-notices { position: fixed; top: calc(var(--tm-overlay-top, 0px) + env(safe-area-inset-top, 0px) + 10px); left: max(12px, env(safe-area-inset-left, 0px)); right: max(12px, env(safe-area-inset-right, 0px)); z-index: 9800; display: flex; flex-direction: column; gap: 10px; margin-inline: auto; max-width: 760px; max-height: calc(var(--tm-overlay-height, 100dvh) - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px); overflow-y: auto; overscroll-behavior: contain; pointer-events: none; scrollbar-width: thin; }
      .tm-app-notices > [role="status"] { position: relative !important; inset: auto !important; flex: none; width: auto; min-width: 0; border-radius: 12px; pointer-events: auto; overflow-wrap: anywhere; }
      .tm-app-notices > [role="status"] button, .tm-app-notices > [role="status"] a { min-height: 44px; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; }
    `}</style>
    {children}
  </div>, document.body);
}
