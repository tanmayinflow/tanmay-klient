// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/ui/icons.jsx
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// ----------------------------------------------------------------------
// IKONY MÍSTNOSTÍ, KTERÉ PŘIBYLY · tenká linka, ne emoji
// ----------------------------------------------------------------------
// Boční panel obou domů kreslí místnosti tenkou linkou ve stejné mřížce
// 48 × 48 a s týmž tahem 1,6. Emoji mezi nimi působí jako cizí těleso, a
// hlavně vypadá na každém systému jinak. Termíny a Memento mori tu chyběly.
import React from "react";

export function TmIcTerminy({ size = 17 }) { // práh dne · slunce nad linií a hodina v ní
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <circle cx="24" cy="24" r="15.2" />
      <path d="M24 14.6 V24 L30.4 27.8" />
      <path d="M8.8 24 H12.2" opacity=".55" />
      <path d="M35.8 24 H39.2" opacity=".55" />
    </svg>
  );
}

export function TmIcMemento({ size = 17 }) { // přesýpací hodiny · čas, který se nedá zastavit
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M14.5 8.5 H33.5" />
      <path d="M14.5 39.5 H33.5" />
      <path d="M16.6 8.5 C16.6 17.4 24 21.4 24 24 C24 26.6 16.6 30.6 16.6 39.5" />
      <path d="M31.4 8.5 C31.4 17.4 24 21.4 24 24 C24 26.6 31.4 30.6 31.4 39.5" />
      <path d="M19.4 35.6 C21.4 34.4 26.6 34.4 28.6 35.6" opacity=".55" />
    </svg>
  );
}

export function TmIcNastaveniRoom({ size = 17 }) { // klidné kolečko · nastavení domu
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <circle cx="24" cy="24" r="6.4" />
      <path d="M24 6.8 V12 M24 36 V41.2 M6.8 24 H12 M36 24 H41.2" />
      <path d="M11.6 11.6 L15.3 15.3 M32.7 32.7 L36.4 36.4 M36.4 11.6 L32.7 15.3 M15.3 32.7 L11.6 36.4" opacity=".55" />
    </svg>
  );
}
