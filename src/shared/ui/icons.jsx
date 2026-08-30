// ----------------------------------------------------------------------
// IKONOVÝ SYSTÉM TANMAY PRACTICE · jeden jazyk, jedna mřížka, jeden zdroj
// ----------------------------------------------------------------------
// Do 2026-08 žily ikony na čtyřech mřížkách (12/16/24/48), v sedmi tazích
// (0,8 až 1,7), dvakrát v každém domě, a mezi nimi emoji a textové znaky,
// které se na každém systému kreslí jinak. Tohle je kanonická náprava:
//
//   · mřížka 24 × 24, tah 1.8, kulaté konce i spoje, currentColor
//   · <TmIcon id="…" /> — jediné primitivum; význam nese sémantické id
//   · TM_ICONS — registr kreseb; TM_USER_ICONS — kurátorovaná řada,
//     ze které si klient vybírá ikonu pro vlastní návyky, krajiny a cíle
//   · neznámé id nikdy nespadne — kreslí se bindu (kroužek s tečkou)
//   · žádná pevná barva, žádný gradient, žádný stín; barvu dává okolí
//
// Vizuální řeč zůstává řečí domu: klidná linka, druhotný tah přes
// opacity, tu a tam plná tečka (bindu). Optická velikost má přednost
// před matematickou — kruh, šipka i postava mají působit stejně silně.
//
// Aktivní stav nekreslí jinou ikonu: stejná geometrie, silnější popředí
// nebo zvolené pozadí od komponenty okolo. Dekorativní ikona je pro
// čtečku neviditelná (aria-hidden); samostatné ikonové tlačítko musí
// dostat jméno od svého <button aria-label|title>, ne od ikony.
import React, { useState } from "react";

/** Kanonický kontrakt. Render: 16 mikro · 20 kompakt · 24 výchozí · 32 výběr. */
export const TM_ICON_CONTRACT = Object.freeze({
  viewBox: 24, stroke: 1.8,
  sizes: Object.freeze({ micro: 16, compact: 20, default: 24, prominent: 32 }),
});

// ----------------------------------------------------------------------
// REGISTR KRESEB · sémantické id → geometrie na mřížce 24
// ----------------------------------------------------------------------
// Tah, barva a zarovnání přicházejí z <TmIcon>; tady je jen geometrie.
// Drobné plné tečky (bindu) jsou fill="currentColor" stroke="none".
export const TM_ICONS = {
  // ---- akce -----------------------------------------------------------
  add: <path d="M12 5.2v13.6M5.2 12h13.6" />,
  close: <path d="m6.2 6.2 11.6 11.6M17.8 6.2 6.2 17.8" />,
  edit: <><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></>,
  trash: <><path d="M4.5 7h15" /><path d="M9 7V4.8h6V7" /><path d="M6.7 7l.8 12.2h9L17.3 7" /><path d="M10 10.5v6M14 10.5v6" opacity=".6" /></>,
  remove: <path d="M5.6 12h12.8" />,
  undo: <><path d="M9 5 4 10l5 5" /><path d="M4 10h9a5 5 0 0 1 0 10h-2" opacity=".75" /></>,
  redo: <><path d="M15 5l5 5-5 5" /><path d="M20 10h-9a5 5 0 0 0 0 10h2" opacity=".75" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="m15.2 15.2 4.8 4.8" /></>,
  filter: <><path d="M4 6.5h16" /><path d="M7 12h10" opacity=".85" /><path d="M10 17.5h4" opacity=".7" /></>,
  settings: <><path d="M4 8h4.3M12.7 8H20" /><circle cx="10.5" cy="8" r="2.2" /><path d="M4 16h7.3M15.7 16H20" /><circle cx="13.5" cy="16" r="2.2" /></>,
  share: <><circle cx="18" cy="5" r="2.6" /><circle cx="6" cy="12" r="2.6" /><circle cx="18" cy="19" r="2.6" /><path d="M8.3 10.8 15.7 6.4M8.3 13.2l7.4 4.4" /></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="2.4" /><path d="M15.5 5.5H5.9A2.4 2.4 0 0 0 3.5 7.9v9.6" /></>,
  attach: <path d="M21.4 11.05 12.2 20.25a6 6 0 0 1-8.49-8.49l9.2-9.19a4 4 0 1 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
  "arrow-out": <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
  "arrow-in": <><path d="M17 7 7 17" /><path d="M15 17H7V9" /></>,
  mic: <><rect x="9" y="2.6" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M12 17.6V21" /><path d="M8.6 21h6.8" /></>,
  drag: <><circle cx="9" cy="6" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.1" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.1" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.1" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.1" fill="currentColor" stroke="none" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  more: <><circle cx="5.5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="18.5" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
  expand: <path d="m6 9 6 6 6-6" />,
  collapse: <path d="m6 15 6-6 6 6" />,
  back: <path d="m14.5 5-7 7 7 7" />,
  forward: <path d="m9.5 5 7 7-7 7" />,
  check: <path d="m5 12.5 4.4 4.5L19 7" />,
  folder: <path d="M3.5 6.5h6l1.5 2h9.5v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />,
  "folder-sub": <path d="M4 8h4.5l1.2 1.6H20v7.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17Z" />,
  guide: <><path d="M8.8 8.6a3.2 3.2 0 1 1 5 2.7c-1.1.8-1.8 1.4-1.8 2.7v.6" /><circle cx="12" cy="19" r="0.5" fill="currentColor" stroke="none" /></>,
  trend: <><path d="M4 17 10 11l3.4 3.4L20 8" /><path d="M15.5 8H20v4.5" /></>,
  sprout: <><path d="M12 20v-7" /><path d="M12 13C12 9.7 9.6 7.2 6.2 7c.2 3.4 2.6 6 5.8 6z" /><path d="M12 13c0-3.3 2.4-5.8 5.8-6-.2 3.4-2.6 6-5.8 6z" /></>,
  spark: <><path d="M12 3.6 13.7 8.9 19 10.6 13.7 12.3 12 17.6 10.3 12.3 5 10.6 10.3 8.9z" /><path d="M18.2 16.6l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" opacity=".7" /></>,

  // ---- místnosti a domény ---------------------------------------------
  // Motivy zůstávají (vadžra, hora, pero, růžice, šitá vazba, kapka,
  // dvě postavy, sklenice, koš, vlnky) — překreslené na mřížku 24 tak,
  // aby přežily 19 px v doku telefonu.
  practice: <><circle cx="12" cy="12" r="1.9" /><path d="M11.4 9.9C11.4 8 11.5 5.9 12 4M12.6 9.9C12.6 8 12.5 5.9 12 4" /><path d="M10.4 9.6C8.9 8.5 8.2 6.8 8.6 5.1c.3-1 1.4-1.5 2.9-1.4" opacity=".7" /><path d="M13.6 9.6c1.5-1.1 2.2-2.8 1.8-4.5-.3-1-1.4-1.5-2.9-1.4" opacity=".7" /><path d="M11.4 14.1c0 1.9.1 4 .6 5.9M12.6 14.1c0 1.9-.1 4-.6 5.9" /><path d="M10.4 14.4c-1.5 1.1-2.2 2.8-1.8 4.5.3 1 1.4 1.5 2.9 1.4" opacity=".7" /><path d="M13.6 14.4c1.5 1.1 2.2 2.8 1.8 4.5-.3 1-1.4 1.5-2.9 1.4" opacity=".7" /></>,
  training: <><path d="M3.6 18.8 10.4 7l3.5 6.2 2.5-4.2 4 9.8" /><path d="M3.6 18.8h16.8" opacity=".6" /><path d="M8.9 9.6c.6.5 1.2.6 1.8.2.4.5 1 .7 1.5.3" opacity=".6" /></>,
  journal: <><path d="M18.6 3.4 9.4 12.6l-1.7 3.7 3.7-1.7 9.2-9.2z" /><path d="M4.2 18.5c2.5-.5 5-.1 7.5-.5 2.5-.4 5 .2 8.1-.2" opacity=".7" /><path d="M4.2 21c2-.4 4 .2 6.6-.2" opacity=".55" /></>,
  compass: <><circle cx="12" cy="12" r="8.4" /><path d="M12 4.4 13.5 10.5 12 12 10.5 10.5Z" /><path d="M12 19.6 10.5 13.5 12 12l1.5 1.5Z" opacity=".55" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  notebook: <><rect x="5.8" y="3.4" width="12.6" height="17.2" rx="1.6" /><path d="M8.6 3.4V20.6" opacity=".8" /><path d="M7.2 6.6h1.4M7.2 10.4h1.4M7.2 14.2h1.4M7.2 18h1.4" opacity=".6" /><path d="M11.5 8h4.5M11.5 11.5h4.5M11.5 15h2.8" opacity=".5" /></>,
  sources: <path fillRule="evenodd" fill="currentColor" stroke="none" d="M12 3.1C9.7 6.7 7.5 10.1 7.5 13.9c0 3.6 2 6.1 4.5 6.1s4.5-2.5 4.5-6.1c0-3.8-2.2-7.2-4.5-10.8Zm0 1.9c1.8 3 3.7 6.1 3.7 9.5 0 3-1.6 4.6-3.7 4.6s-3.7-1.6-3.7-4.6c0-3.4 1.9-6.5 3.7-9.5Z" />,
  clients: <><circle cx="8.7" cy="7.6" r="2.4" /><circle cx="15.3" cy="7.6" r="2.4" /><path d="M4.6 16.4c.3-3.4 2-5.6 4.1-5.6 1.6 0 2.9 1.2 3.6 3.2" /><path d="M11.7 14c.7-2 2-3.2 3.6-3.2 2.1 0 3.8 2.2 4.1 5.6" /><path d="M4 19.2h16" opacity=".6" /></>,
  stewardship: <><path d="M8.3 4.2h7.4" /><path d="M8.7 4.2v1.9M15.3 4.2v1.9" /><path d="M8.7 6.1C7 7.3 6.2 9 6.2 11.1v6.2c0 2 1.5 3.2 3.4 3.2h4.8c1.9 0 3.4-1.2 3.4-3.2v-6.2c0-2.1-.8-3.8-2.5-5" /><path d="M6.2 12.8c1.9.6 3.9-.2 5.8.2 1.9.4 3.9-.3 5.8.2" opacity=".8" /><circle cx="10" cy="16" r=".8" fill="currentColor" stroke="none" /><circle cx="13.6" cy="17.4" r=".8" fill="currentColor" stroke="none" /></>,
  basket: <><path d="M4.7 7.6c3.7-1.3 10.9-1.3 14.6 0" /><path d="M5.2 7.9 6.8 19.6c1.6 1.3 8.8 1.3 10.4 0L18.8 7.9" /><path d="M5.7 11.5c3.4 1.1 9.2 1.1 12.6 0" opacity=".6" /><path d="M6.3 15.4c3 1 8.4 1 11.4 0" opacity=".6" /><path d="M9.2 4.9c.3-1.4 1.5-2.1 2.8-1.9 1.3-.2 2.5.5 2.8 1.9" opacity=".8" /></>,
  voice: <><circle cx="8.2" cy="12" r="1.2" fill="currentColor" stroke="none" /><path d="M11.6 8.9a5 5 0 0 1 0 6.2" /><path d="M14.6 6.4a8.9 8.9 0 0 1 0 11.2" /><path d="M5.4 9.9a3.9 3.9 0 0 0 0 4.2" opacity=".55" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3.3 2" /></>,
  hourglass: <><path d="M7 3.8h10" /><path d="M7 20.2h10" /><path d="M8 3.8c0 4.4 4 6.3 4 7.7 0 1.4-4 3.3-4 7.7" /><path d="M16 3.8c0 4.4-4 6.3-4 7.7 0 1.4 4 3.3 4 7.7" /><path d="M9.5 18c1-.6 4-.6 5 0" opacity=".55" /></>,
  areas: <><rect x="4" y="4" width="7" height="7" rx="1.4" /><rect x="13" y="4" width="7" height="7" rx="1.4" opacity=".8" /><rect x="4" y="13" width="7" height="7" rx="1.4" opacity=".8" /><rect x="13" y="13" width="7" height="7" rx="1.4" opacity=".55" /></>,
  target: <><circle cx="12" cy="12" r="8.2" /><circle cx="12" cy="12" r="4.6" opacity=".6" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M4 10h16" opacity=".8" /><path d="M8.5 3.5v3.4M15.5 3.5v3.4" /><circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" opacity=".8" /></>,
  timer: <><circle cx="12" cy="13" r="7.2" /><path d="M12 9.4V13l2.6 1.6" /><path d="M10 3.6h4" /><path d="M12 3.6v2.2" opacity=".7" /></>,
  progress: <><path d="M4 20V9.5" opacity=".55" /><path d="M10 20v-7" opacity=".75" /><path d="M16 20V8" /><path d="M4 20h16" opacity=".6" /><circle cx="16" cy="5.6" r="1" fill="currentColor" stroke="none" /></>,
  plan: <><rect x="5" y="3.8" width="14" height="16.4" rx="1.8" /><path d="M8.6 8.6h6.8M8.6 12h6.8M8.6 15.4h4" opacity=".7" /><circle cx="12" cy="3.8" r="1" fill="currentColor" stroke="none" /></>,

  // ---- prameny · typy -------------------------------------------------
  book: <><path d="M2.8 4.4h5.7a3.5 3.5 0 0 1 3.5 3.5v12.3a2.8 2.8 0 0 0-2.8-2.8H2.8Z" /><path d="M21.2 4.4h-5.7a3.5 3.5 0 0 0-3.5 3.5v12.3a2.8 2.8 0 0 1 2.8-2.8h6.4Z" /></>,
  film: <><rect x="4.4" y="5.4" width="15.2" height="13.2" rx="1.6" /><path d="M8.6 5.4V18.6M15.4 5.4V18.6" opacity=".55" /><path d="M4.4 12H8.6M15.4 12h4.2" opacity=".4" /></>,
  listen: <><path d="M5 14.6V12a7 7 0 0 1 14 0v2.6" /><rect x="4.2" y="13.6" width="3" height="5" rx="1.4" /><rect x="16.8" y="13.6" width="3" height="5" rx="1.4" /></>,
  article: <><path d="M6.6 3.8h7.2l3.8 3.8v12.6H6.6Z" /><path d="M13.8 3.8v3.8h3.8" opacity=".55" /><path d="M9 11h6.2M9 13.7h6.2M9 16.4h3.4" opacity=".8" /></>,
  stream: <><path d="M4.6 8c3.6-1.7 11.2-1.7 14.8 0" /><path d="M4.6 12c3.6-1.7 11.2-1.7 14.8 0" opacity=".8" /><path d="M4.6 16c3.6-1.7 11.2-1.7 14.8 0" opacity=".6" /></>,

  // ---- světlo a tma ---------------------------------------------------
  sun: <><circle cx="12" cy="12" r="4.1" /><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6" /></>,
  moon: <path d="M20 14.6A8.6 8.6 0 0 1 9.4 4a8.6 8.6 0 1 0 10.6 10.6Z" />,

  // ---- kurátorovaná řada · POHYB / TĚLO -------------------------------
  strength: <><path d="M7.8 12h8.4" /><path d="M5.4 8.6v6.8M18.6 8.6v6.8" /><path d="M3 10.2v3.6M21 10.2v3.6" opacity=".7" /></>,
  mobility: <><path d="M5 18.5C5 11.5 11 5.5 19 5.5" /><path d="M5 12.7c0-2.6 1.2-5 3.2-6.6" opacity=".55" /><circle cx="19" cy="5.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="5" cy="18.5" r="1.2" fill="currentColor" stroke="none" /></>,
  balance: <><path d="M7.4 20h9.2" /><ellipse cx="12" cy="16.4" rx="4.6" ry="1.9" /><ellipse cx="12" cy="11.4" rx="3.4" ry="1.6" opacity=".8" /><ellipse cx="12" cy="7.2" rx="2.2" ry="1.3" opacity=".65" /></>,
  endurance: <><path d="M3.5 15.5c2.4-6 5-6 7.4 0s5 6 7.4 0" /><path d="M18.3 12.2h2.9v2.9" opacity=".7" /></>,
  body: <><circle cx="12" cy="5.4" r="2.2" /><path d="M12 7.6v6" /><path d="M6.8 10.4c3.2 1.6 7.2 1.6 10.4 0" /><path d="m12 13.6-3.2 6.6M12 13.6l3.2 6.6" /></>,
  movement: <><path d="M4 17.5C7.5 17.5 8 7 12 7s4.5 10.5 8 10.5" /><circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" opacity=".8" /></>,
  recovery: <path d="M12 20a8 8 0 1 1 8-8c0 2.9-1.8 4.7-4 4.7s-4-1.8-4-4.2a2.6 2.6 0 0 1 2.6-2.6" />,
  stretch: <><path d="m4.5 12 4-4M4.5 12l4 4M4.5 12H10" /><path d="m19.5 12-4-4M19.5 12l-4 4M19.5 12H14" /></>,
  posture: <><path d="M12 3.6v16.8" /><path d="M12 6.4c2.4 0 4.4 1 5.6 2.8" opacity=".7" /><path d="M12 6.4c-2.4 0-4.4 1-5.6 2.8" opacity=".7" /><circle cx="12" cy="20.4" r=".9" fill="currentColor" stroke="none" /></>,

  // ---- kurátorovaná řada · PRAXE / RYTMUS -----------------------------
  cycle: <><path d="M5.2 12a6.8 6.8 0 0 1 11.9-4.5" /><path d="M18.8 12a6.8 6.8 0 0 1-11.9 4.5" /><path d="M17.5 3.8v3.9h-3.9" opacity=".8" /><path d="M6.5 20.2v-3.9h3.9" opacity=".8" /></>,
  repetition: <><circle cx="9.4" cy="12" r="5.8" /><circle cx="14.6" cy="12" r="5.8" opacity=".62" /></>,
  consistency: <><path d="M4 16.5h16" opacity=".55" /><circle cx="6.5" cy="10" r="1.1" fill="currentColor" stroke="none" /><circle cx="12" cy="10" r="1.1" fill="currentColor" stroke="none" /><circle cx="17.5" cy="10" r="1.1" fill="currentColor" stroke="none" opacity=".55" /></>,
  morning: <><path d="M12 11.2a4.4 4.4 0 0 1 4.4 4.4H7.6A4.4 4.4 0 0 1 12 11.2Z" /><path d="M4 15.6h16" opacity=".7" /><path d="M12 4.6v2.6M6.2 7l1.7 1.7M17.8 7l-1.7 1.7" opacity=".8" /></>,
  evening: <><path d="M17.6 13.4A6.6 6.6 0 0 1 9.5 5.3a6.6 6.6 0 1 0 8.1 8.1Z" /><circle cx="17" cy="6" r=".9" fill="currentColor" stroke="none" opacity=".7" /></>,

  // ---- kurátorovaná řada · POZORNOST / VNITŘNÍ PRAXE ------------------
  breath: <><path d="M5 8.6c2.8-1.4 5.6.6 8.4 0" /><path d="M5 12.6c3.6-1.7 8.2 1.2 12.6-.4" opacity=".8" /><path d="M5 16.6c2.8-1.4 5.6.6 8.4 0" opacity=".6" /></>,
  focus: <><path d="M4.5 8.5V6.3a1.8 1.8 0 0 1 1.8-1.8h2.2M15.5 4.5h2.2a1.8 1.8 0 0 1 1.8 1.8v2.2M19.5 15.5v2.2a1.8 1.8 0 0 1-1.8 1.8h-2.2M8.5 19.5H6.3a1.8 1.8 0 0 1-1.8-1.8v-2.2" /><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" /></>,
  meditation: <><circle cx="12" cy="6.6" r="2.1" /><path d="M12 8.7c-1.5 2.4-4.3 3.5-5.9 6.4-.8 1.5 0 2.9 1.7 2.9h8.4c1.7 0 2.5-1.4 1.7-2.9-1.6-2.9-4.4-4-5.9-6.4Z" /><path d="M5.2 19.8h13.6" opacity=".6" /></>,
  reflection: <><circle cx="12" cy="12" r="7.8" /><path d="M12 4.2v15.6" opacity=".55" /><path d="M12 8.2c2.6 0 4.6 1.7 4.6 3.8s-2 3.8-4.6 3.8" opacity=".8" /></>,
  calm: <><path d="M4.5 14.5c3.7-1.6 11.3-1.6 15 0" /><circle cx="12" cy="8.6" r="1.3" fill="currentColor" stroke="none" /><path d="M7.5 18.2c2.8-1.1 6.2-1.1 9 0" opacity=".55" /></>,

  // ---- kurátorovaná řada · PŘÍRODA ------------------------------------
  tree: <><path d="M12 21v-6.4" /><path d="M12 15.2c-3.7 0-6.4-2.4-6.4-5.8C5.6 6.2 8.4 3.6 12 3.6s6.4 2.6 6.4 5.8c0 3.4-2.7 5.8-6.4 5.8Z" /><path d="M12 14.6 9.6 11.4M12 12.4l2-2.4" opacity=".55" /></>,
  leaf: <><path d="M18.8 5.2C11 5.2 5.8 9.4 5.8 15.6c0 1.2.2 2.3.6 3.2C13 18.8 18.8 13.4 18.8 5.2Z" /><path d="M6.8 18.4C9.6 14.2 13.6 10 18 7" opacity=".6" /></>,
  mountain: <><path d="M3.6 18.8 10.4 7l3.5 6.2 2.5-4.2 4 9.8" /><path d="M3.6 18.8h16.8" opacity=".6" /></>,
  path: <><path d="M6 20.4c8.4 0 2.4-7.2 8.4-8.6 4-1 4.4-4.6 2-8.2" /><circle cx="16.4" cy="3.6" r=".9" fill="currentColor" stroke="none" opacity=".8" /></>,
  water: <><path d="M4.6 9.5c3.6-1.7 11.2-1.7 14.8 0" /><path d="M4.6 13.5c3.6-1.7 11.2-1.7 14.8 0" opacity=".8" /><path d="M4.6 17.5c3.6-1.7 11.2-1.7 14.8 0" opacity=".6" /></>,
  fire: <><path d="M12 3.6c.6 3-1.8 4.6-3.4 6.6-1.5 1.9-2 4.4-.8 6.7 1.1 2.2 3.3 3.5 5.7 3.5" /><path d="M12 3.6c3.4 2.6 5.9 5.8 5.9 9.3 0 4.2-2.6 7.5-5.9 7.5" /><path d="M12 20.4c-1.7 0-2.9-1.3-2.9-3 0-1.9 1.6-2.9 2.9-4.6 1.3 1.7 2.9 2.7 2.9 4.6 0 1.7-1.2 3-2.9 3Z" opacity=".6" /></>,
  drop: <path d="M12 3.8c-2.9 4.5-5.6 8-5.6 11.5 0 3.2 2.4 5.5 5.6 5.5s5.6-2.3 5.6-5.5c0-3.5-2.7-7-5.6-11.5Z" />,

  // ---- kurátorovaná řada · ŽIVOT --------------------------------------
  work: <><rect x="4" y="8" width="16" height="11.4" rx="1.8" /><path d="M9.2 8V6.2a1.6 1.6 0 0 1 1.6-1.6h2.4a1.6 1.6 0 0 1 1.6 1.6V8" /><path d="M4 12.6h16" opacity=".55" /></>,
  learning: <><path d="m12 5 9 3.6-9 3.6L3 8.6Z" /><path d="M6.6 10v4.8c0 1.4 2.4 2.6 5.4 2.6s5.4-1.2 5.4-2.6V10" opacity=".8" /><path d="M21 8.6v4.8" opacity=".55" /></>,
  home: <><path d="m4 11 8-6.6L20 11" /><path d="M6.2 9.8v9.4h11.6V9.8" /><path d="M10.2 19.2v-5h3.6v5" opacity=".7" /></>,
  people: <><circle cx="8.7" cy="7.6" r="2.4" /><circle cx="15.3" cy="7.6" r="2.4" /><path d="M4.6 16.4c.3-3.4 2-5.6 4.1-5.6 1.6 0 2.9 1.2 3.6 3.2" /><path d="M11.7 14c.7-2 2-3.2 3.6-3.2 2.1 0 3.8 2.2 4.1 5.6" /></>,
  creativity: <path d="M12 3.6 13.9 9.5 19.8 11.4 13.9 13.3 12 19.2 10.1 13.3 4.2 11.4 10.1 9.5z" />,
  travel: <><circle cx="12" cy="12" r="8.2" /><path d="M3.8 12h16.4" opacity=".6" /><path d="M12 3.8c2.5 2.3 3.8 5.1 3.8 8.2s-1.3 5.9-3.8 8.2c-2.5-2.3-3.8-5.1-3.8-8.2s1.3-5.9 3.8-8.2Z" opacity=".8" /></>,
  food: <><path d="M4.4 10.6c0 4.6 3.2 7.6 7.6 7.6s7.6-3 7.6-7.6" /><path d="M3.6 10.6h16.8" opacity=".7" /><path d="M9 18.9h6" opacity=".55" /></>,
  sleep: <><path d="M18.6 14.2A7.6 7.6 0 0 1 9.2 4.8a7.6 7.6 0 1 0 9.4 9.4Z" /><path d="M14.5 5.5h3.4l-3.4 3.6h3.4" opacity=".7" /></>,
  energy: <path d="M13.2 3.4 5.8 13.4h4.6l-1 7.2 7.8-10.4h-4.8Z" />,

  // ---- kurátorovaná řada · OBECNÉ SYMBOLY -----------------------------
  flag: <><path d="M6.4 21V4" /><path d="M6.4 5h10.8l-2.6 3.4 2.6 3.4H6.4" /></>,
  star: <path d="m12 4 2.1 5 5.4.4-4.1 3.5 1.3 5.3L12 15.3l-4.7 2.9 1.3-5.3L4.5 9.4l5.4-.4Z" />,
  step: <><path d="M4 19h4v-4h4v-4h4V7h4" /><circle cx="20" cy="4.6" r=".9" fill="currentColor" stroke="none" opacity=".8" /></>,
  bindu: <><circle cx="12" cy="12" r="7.6" /><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" /></>,
};

// ----------------------------------------------------------------------
// PRIMITIVUM
// ----------------------------------------------------------------------
/**
 * <TmIcon id size strokeWidth label className style />
 * · `id`     sémantické id z TM_ICONS; neznámé id kreslí bindu, nikdy nespadne
 * · `size`   16 · 20 · 24 · 32 (výchozí 24); glyf nemusí plnit dotykový cíl
 * · `label`  jen pro samostatnou významovou ikonu; jinak je dekorativní
 *            (aria-hidden) a jméno nese okolní ovládací prvek
 * Tah se nepřepočítává podle velikosti — 1.8 na mřížce 24 drží optickou
 * váhu domu na všech velikostech; slabší tah smí jen dekorativní plocha.
 */
export function TmIcon({ id, size = 24, strokeWidth = TM_ICON_CONTRACT.stroke, label, className, style, ...rest }) {
  const body = TM_ICONS[id] || TM_ICONS.bindu;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}
      focusable="false" className={className} style={{ display: "block", flexShrink: 0, ...style }} {...rest}>
      {body}
    </svg>
  );
}

/** Platné id, nebo null. Pro čtení uložených dat. */
export const tmIconId = (id) => (id && TM_ICONS[id] ? id : null);

// ----------------------------------------------------------------------
// KURÁTOROVANÁ ŘADA · ikony, ze kterých si člověk vybírá
// ----------------------------------------------------------------------
// Pro vlastní návyky, krajiny a cíle. Kreslí se stejnou řečí jako celý
// dům — žádný klipart, žádné barvy, žádná ikona za každou cenu.
// Popisky jsou lidské (CZ/EN); id je stabilní a ukládá se do dat.
export const TM_USER_ICON_GROUPS = [
  { key: "pohyb", cz: "Pohyb", en: "Movement", ids: [
    "strength", "mobility", "balance", "endurance", "body", "movement", "recovery", "stretch", "posture",
  ] },
  { key: "praxe", cz: "Praxe", en: "Practice", ids: [
    "practice", "cycle", "repetition", "consistency", "clock", "calendar", "morning", "evening",
  ] },
  { key: "pozornost", cz: "Pozornost", en: "Attention", ids: [
    "breath", "focus", "meditation", "reflection", "journal", "calm",
  ] },
  { key: "priroda", cz: "Příroda", en: "Nature", ids: [
    "tree", "leaf", "mountain", "path", "sun", "moon", "water", "fire", "drop",
  ] },
  { key: "zivot", cz: "Život", en: "Life", ids: [
    "work", "learning", "home", "people", "creativity", "travel", "food", "sleep", "energy",
  ] },
  { key: "obecne", cz: "Obecné", en: "General", ids: [
    "target", "flag", "compass", "star", "step", "check", "bindu",
  ] },
];

export const TM_USER_ICON_LABELS = {
  strength: ["Síla", "Strength"], mobility: ["Pohyblivost", "Mobility"], balance: ["Rovnováha", "Balance"],
  endurance: ["Výdrž", "Endurance"], body: ["Tělo", "Body"], movement: ["Pohyb", "Movement"],
  recovery: ["Zotavení", "Recovery"], stretch: ["Protažení", "Stretch"], posture: ["Držení těla", "Posture"],
  practice: ["Praxe", "Practice"], cycle: ["Rytmus", "Rhythm"], repetition: ["Opakování", "Repetition"],
  consistency: ["Stálost", "Consistency"], clock: ["Čas", "Time"], calendar: ["Kalendář", "Calendar"],
  morning: ["Ráno", "Morning"], evening: ["Večer", "Evening"],
  breath: ["Dech", "Breath"], focus: ["Soustředění", "Focus"], meditation: ["Meditace", "Meditation"],
  reflection: ["Reflexe", "Reflection"], journal: ["Zápis", "Journal"], calm: ["Klid", "Calm"],
  tree: ["Strom", "Tree"], leaf: ["List", "Leaf"], mountain: ["Hora", "Mountain"], path: ["Cesta", "Path"],
  sun: ["Slunce", "Sun"], moon: ["Měsíc", "Moon"], water: ["Voda", "Water"], fire: ["Oheň", "Fire"],
  drop: ["Kapka", "Drop"],
  work: ["Práce", "Work"], learning: ["Učení", "Learning"], home: ["Domov", "Home"], people: ["Lidé", "People"],
  creativity: ["Tvořivost", "Creativity"], travel: ["Cesty", "Travel"], food: ["Jídlo", "Food"],
  sleep: ["Spánek", "Sleep"], energy: ["Energie", "Energy"],
  target: ["Cíl", "Target"], flag: ["Vlajka", "Flag"], compass: ["Kompas", "Compass"], star: ["Hvězda", "Star"],
  step: ["Krok", "Step"], check: ["Hotovo", "Done"], bindu: ["Bindu", "Bindu"],
};

/** Výchozí ikona typu objektu, když si člověk žádnou nevybral. */
export const TM_ICON_DEFAULTS = Object.freeze({ goal: "target", habit: "cycle", area: "compass" });

// Známé staré znaky a emoji → sémantické id. Jen jistoty; co nezná,
// nechá být — starý znak se dál vykreslí, nikdy se tiše nepřepíše.
export const TM_LEGACY_ICON = {
  "🔥": "fire", "🌊": "water", "▲": "mountain", "✎": "journal", "📓": "notebook",
  "▤": "sources", "🤝": "clients", "🫙": "stewardship", "🗑": "basket", "🎲": "compass",
  "📣": "voice", "▦": "areas", "◎": "target", "○": "bindu", "●": "bindu",
  "☀": "sun", "☾": "moon", "🌙": "moon", "⭐": "star", "★": "star", "🌿": "leaf", "🍃": "leaf",
  "🌳": "tree", "🌲": "tree", "⛰": "mountain", "🏔": "mountain", "💧": "drop", "🕯": "calm",
  "🧘": "meditation", "💪": "strength", "🏃": "endurance", "📖": "book", "📚": "learning",
  "🏠": "home", "🍎": "food", "🥗": "food", "😴": "sleep", "⚡": "energy", "✨": "creativity",
  "🎯": "target", "🚩": "flag", "🧭": "compass", "⏰": "clock", "🕐": "clock", "📅": "calendar",
};
export const tmIconFromLegacy = (ch) => TM_LEGACY_ICON[String(ch || "").trim()] || null;

/**
 * Jedna cesta k ikoně uloženého objektu:
 * 1. platné `iconId` → ta ikona; 2. známý starý znak → jeho ikona;
 * 3. neznámý znak → vrací { char } a volající ho vykreslí jako text;
 * 4. nic → výchozí ikona typu. Nikdy rozbité SVG, nikdy surové id.
 */
export function tmResolveIcon(obj, kind) {
  const id = tmIconId(obj && obj.iconId);
  if (id) return { id };
  const raw = obj && typeof obj.icon === "string" ? obj.icon.trim() : "";
  if (raw) {
    const legacy = tmIconFromLegacy(raw);
    if (legacy) return { id: legacy };
    return { char: raw };
  }
  return { id: TM_ICON_DEFAULTS[kind] || "bindu" };
}

// ----------------------------------------------------------------------
// VÝBĚR IKONY · jedna mřížka pro celý produkt
// ----------------------------------------------------------------------
// Mobil na prvním místě: velké cíle (44 px), žádný dropdown, žádné
// hledání pro čtyřicet ikon. Vybraná ikona je vidět dřív, než se výběr
// otevře; zvolený stav nese rámeček a pozadí, ne jen barva.
export function createIconUI(deps) {
  const { useT, L } = deps;

  /** Aktuální ikona objektu · pro řádky a karty. */
  function TmObjIcon({ obj, kind, size = 20, strokeWidth, style }) {
    const r = tmResolveIcon(obj, kind);
    if (r.char) return <span aria-hidden="true" style={{ fontSize: Math.max(12, size - 4), lineHeight: 1, display: "inline-flex", ...style }}>{r.char}</span>;
    return <TmIcon id={r.id} size={size} strokeWidth={strokeWidth} style={style} />;
  }

  /**
   * <TmIconPicker value onPick kind allowClear />
   * Vložený blok (ne overlay) — rodič rozhoduje, kdy je vidět.
   * `onPick(id)` dostane id, `onPick(null)` znamená „bez vlastní ikony".
   */
  function TmIconPicker({ value, onPick, kind, allowClear = true }) {
    const { t } = useT();
    const sel = tmIconId(value);
    const cell = (active) => ({
      width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: active ? t.selBg || t.cardHover : "transparent",
      border: `1px solid ${active ? t.accent : "transparent"}`,
      borderRadius: 10, cursor: "pointer", color: active ? t.text : t.textMuted, padding: 0,
    });
    return (
      <div>
        {TM_USER_ICON_GROUPS.map((g) => (
          <div key={g.key} style={{ marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--tm-font-tag)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 12, color: t.textMuted, margin: "0 0 4px 2px" }}>{L(g.cz, g.en)}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {g.ids.map((id) => {
                const lbl = TM_USER_ICON_LABELS[id] || [id, id];
                const active = sel === id;
                return (
                  <button key={id} type="button" onClick={() => onPick(active && allowClear ? null : id)}
                    aria-label={L(lbl[0], lbl[1])} aria-pressed={active} title={L(lbl[0], lbl[1])} style={cell(active)}>
                    <TmIcon id={id} size={22} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /** Spouštěč výběru · ukazuje aktuální ikonu, otevírá mřížku pod sebou. */
  function TmIconPickerButton({ obj, kind, onPick, size = 20 }) {
    const { t } = useT();
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          aria-label={L("Vybrat ikonu", "Choose an icon")} title={L("Vybrat ikonu", "Choose an icon")}
          style={{ width: 38, height: 38, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", border: `1px solid ${open ? t.accent : t.border}`, borderRadius: 9, color: t.text, cursor: "pointer", padding: 0, flexShrink: 0 }}>
          <TmObjIcon obj={obj} kind={kind} size={size} />
        </button>
        {open && (
          <div style={{ flexBasis: "100%", width: "100%", padding: "8px 2px 2px" }}>
            <TmIconPicker value={obj && obj.iconId} kind={kind} onPick={(id) => { onPick(id); setOpen(false); }} />
          </div>
        )}
      </>
    );
  }

  return { TmObjIcon, TmIconPicker, TmIconPickerButton };
}

// ----------------------------------------------------------------------
// MÍSTNOSTI, KTERÉ SI DRŽÍ STARÉ JMÉNO · zpětně kompatibilní obálky
// ----------------------------------------------------------------------
// Boční panel a dok volají tyhle komponenty jménem. Kreslí už kanonickou
// mřížku 24; stará jemná kresba 48 žije v historii Gitu.
export function TmIcTerminy({ size = 17 }) { return <TmIcon id="clock" size={size} />; }
export function TmIcMemento({ size = 17 }) { return <TmIcon id="hourglass" size={size} />; }
export function TmIcNastaveniRoom({ size = 17 }) { return <TmIcon id="settings" size={size} />; }
