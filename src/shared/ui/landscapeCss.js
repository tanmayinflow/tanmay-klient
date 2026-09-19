// A complete material surface, intentionally scoped to the new website-derived
// presets. Unlike a frame grammar, this opt-in design may change composition.
export function landscapeCss() {
  const s = 'html:is([data-appearance="landscape-day"],[data-appearance="landscape-night"])';
  return `
${s} { --land-paper: url('/media/landscape/linen.webp'); --land-ash: url('/media/landscape/ashes.webp'); --land-edge: url('/media/landscape/edge.png'); --land-earth: url('/media/landscape/earth.webp'); --land-gutter: 28px; }
${s} body { background-image: var(--land-paper) !important; background-size: 768px auto !important; }
html[data-appearance="landscape-night"] body { background-image: var(--land-ash) !important; }
${s} .tm-ground { background-image: var(--land-paper) !important; background-size: 768px auto !important; }
html[data-appearance="landscape-night"] .tm-ground { background-image: var(--land-ash) !important; }
${s} .tm-page { padding-top: 28px !important; animation: none; }
${s} .tm-page h1 { font-weight: 400 !important; letter-spacing: -.025em; text-wrap: balance; }
${s} .tm-page :is(h2,h3) { text-wrap: balance; }
${s} :is(input,textarea,[contenteditable]) { caret-color: var(--tm-accent); }
${s} :is(button,input,textarea,select,[contenteditable]):focus-visible { outline: 2px solid var(--tm-focus) !important; outline-offset: 4px; }
${s} :is(.tm-row,.tm-cellpop,.tm-nav-item) { transition: background-color 160ms ease,color 160ms ease; }
${s} :is(.tm-page,.tm-cs,.tm-drawer) a { text-underline-offset: .22em; }
${s} .tm-sidebar { background-image: var(--land-ash) !important; background-size: 768px auto !important; border-radius: 3px 18px 18px 3px !important; border-color: var(--tm-nav-border) !important; box-shadow: 0 12px 34px -24px var(--tm-text) !important; }
${s} .tm-sidebar .tm-nav-active { box-shadow: none !important; background-image: var(--land-earth) !important; background-size: cover !important; }
${s} .tm-sidebar .tm-nav-item { border-radius: 5px !important; }
${s} .tm-sidebar .tm-logo { min-height: 68px; }
${s} .tm-sidebar .tm-logo > span { color: var(--tm-nav-text) !important; }
${s} .tm-material-logo { width: 140px; height: auto; display: block; }
${s} .tm-sbmotto { color: var(--tm-nav-text-sec); }
${s} .tm-topbar { border-bottom-color: var(--tm-border) !important; }
${s} .tm-tabbar { background-image: var(--land-ash) !important; background-size: 768px auto !important; background-color: var(--tm-dock-bg) !important; border: 1px solid var(--tm-nav-border) !important; border-radius: 12px !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
${s} .tm-tabbar button[aria-current="page"] { color: var(--tm-nav-accent) !important; background: var(--tm-nav-active) !important; border-radius: 7px; }
${s} :is(.tm-cs,.tm-drawer) { background-color: var(--tm-sheet) !important; background-image: var(--land-paper) !important; background-size: 768px auto !important; border-radius: 12px !important; }
html[data-appearance="landscape-night"] :is(.tm-cs,.tm-drawer) { background-image: var(--land-ash) !important; }
${s} .tm-cs :is(input,textarea), ${s} .tm-drawer :is(input,textarea) { border-radius: 4px; }
${s} .tm-material-title { position: relative; isolation: isolate; min-height: 182px; display: flex; align-items: center; margin: 0 0 24px; padding: 18px 0 34px; }
${s} .tm-material-title::after { content: ''; position: absolute; left: calc(-1 * var(--land-gutter)); right: calc(-1 * var(--land-gutter)); bottom: -5px; height: 18px; background: var(--tm-accent) var(--land-earth) center/768px auto; mask: var(--land-edge) center calc(100% + 12px)/100% 100px no-repeat; -webkit-mask: var(--land-edge) center calc(100% + 12px)/100% 100px no-repeat; pointer-events: none; opacity: .8; }
${s} .tm-material-title__copy { position: relative; z-index: 1; width: 70%; min-width: 0; }
${s} .tm-material-title h1 { display: block !important; font-size: 64px !important; line-height: 1.05 !important; margin: 0 0 15px !important; overflow-wrap: anywhere; }
${s} .tm-material-title__subtitle { font-family: var(--tm-font-body); font-size: 14px; line-height: 1.65; color: var(--tm-text-sec); margin: 0; max-width: 40ch; }
${s} .tm-material-title__subtitle button { color: inherit; font: inherit; border: 0; background: transparent; padding: 0; text-align: left; cursor: pointer; text-decoration: underline; text-underline-offset: 4px; }
${s} .tm-material-title__tools { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
${s} .tm-material-art { position: absolute; z-index: 0; right: 0; top: 0; width: 29%; height: 190px; object-fit: contain; object-position: right center; opacity: .88; pointer-events: none; }
${s} .tm-material-art--branch { height: 210px; width: 30%; object-position: right top; }
${s} .tm-material-art--horizon { top: 20px; width: 38%; height: 150px; opacity: .95; filter: brightness(.65); }
html[data-appearance="landscape-night"] .tm-material-art { filter: invert(1); opacity: .68; }
html[data-appearance="landscape-night"] .tm-material-art--horizon { filter: brightness(1.7); opacity: .9; }
${s} .tm-material-title[data-room="kos"] { min-height: 110px; }
${s} .tm-material-title[data-room="kos"] .tm-material-art { opacity: .25; }
${s} .tm-material-title[data-room="hospodareni"] h1 { font-size: 52px !important; }
${s} .tm-material-title[data-room="socsite"] h1 { font-size: 52px !important; max-width: 9ch; }
${s} .tm-material-title[data-room="prameny"] .tm-material-art { transform: scaleX(-1); }
${s} .tm-material-title[data-room="klienti"] .tm-material-art { width: 34%; }
${s} .tm-material-title[data-room="denik"] { min-height: 155px; }
${s} .tm-material-title + .tm-prose { margin-top: -15px !important; max-width: 52ch; font-size: 14px; }
${s} .tm-page > .tm-mhide:first-child:has(+ .tm-material-title) { margin-bottom: 0 !important; padding-bottom: 0 !important; }
${s} .tm-habitgrid { gap: 0 !important; background: var(--tm-card); border: 1px solid var(--tm-border); border-radius: 7px; overflow: hidden; }
${s} .tm-habitgrid .tm-hbtn { min-height: 52px; border: 0 !important; border-bottom: 1px solid var(--tm-border-soft) !important; border-radius: 0 !important; padding: 13px 16px !important; box-shadow: none !important; background: transparent !important; }
${s} .tm-habitgrid .tm-hbtn:hover { background: var(--tm-callout) !important; }
${s} .tm-habitgrid .tm-hbtn:focus-visible { outline-offset: -4px; }
${s} [data-pv="prsten"] { margin-top: 18px !important; }
${s} [data-pv="dayview"] { margin-top: 12px; }
${s} .tm-page .tm-row { border-bottom-color: var(--tm-border) !important; min-height: 48px; }
${s} :is(.tm-lift,.tm-calcard,.tm-card) { border-radius: 7px !important; box-shadow: none !important; }
${s} .tm-page :is(.tm-input,.tm-select) { border-radius: 4px !important; }
${s} .tm-page .tm-prose { line-height: 1.75; }
${s} .tm-page table { font-variant-numeric: tabular-nums; }
${s} .tm-material-focus { padding: 20px; background: var(--tm-card); border: 1px solid var(--tm-border); border-radius: 7px; }
${s} .tm-material-focus button { min-height: 44px; }
${s} .tm-material-focus__time { font-size: 76px !important; font-variant-numeric: tabular-nums; }
${s} .tm-page[data-room="denik"] .tm-prose { max-width: 66ch; }
${s} .tm-page[data-room="zapisnik"] .tm-rich { background: var(--tm-card); padding: 22px; border-radius: 5px; }
${s} .tm-page[data-room="prameny"] .tm-prose { max-width: 66ch; }
${s} .tm-page[data-room="mandala"] .tm-view { padding-top: 20px; }
${s} .tm-page[data-room="kos"] .tm-row { background: var(--tm-card); padding-left: 12px !important; padding-right: 12px !important; }
${s} .tm-material-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 40px 0 0; padding: 16px 0; border-top: 1px solid var(--tm-border); color: var(--tm-text-muted); font: 12px var(--tm-font-tag); letter-spacing: .12em; text-transform: uppercase; }
${s} .tm-material-caption img { width: 76px; height: auto; opacity: .65; }
html[data-appearance="landscape-night"] .tm-material-caption img { filter: invert(1); }
${s} .tm-material-mobilebar { display: none; }
${s} .tm-material-choice { display: flex; gap: 14px; align-items: center; margin: 0 0 20px; padding: 16px; border: 1px solid var(--tm-border); background-image: var(--land-paper); background-size: 768px auto; color: var(--tm-brand-forest); border-radius: 7px; }
${s} .tm-material-choice img { width: 52px; height: 70px; object-fit: contain; }
@media (min-width: 1100px) {
  ${s} .tm-page { max-width: 1110px !important; padding-left: 60px !important; padding-right: 60px !important; }
  ${s} .tm-material-title { min-height: 204px; }
}
@media (max-width: 820px) {
  ${s} { --land-gutter: 20px; }
  ${s} .tm-page { padding: 0 var(--land-gutter) var(--tm-dok-misto) !important; }
  ${s} .tm-material-mobilebar { position: relative; display: flex; align-items: center; justify-content: space-between; min-height: 64px; padding: max(8px,env(safe-area-inset-top)) 20px 8px; border-bottom: 1px solid var(--tm-border); gap: 12px; }
  ${s} .tm-material-mobilebar img { width: 100px; height: auto; }
  ${s} .tm-material-mobilebar button { min-width: 44px; min-height: 44px; border: 0; background: transparent; color: var(--tm-text); display: inline-flex; justify-content: center; align-items: center; cursor: pointer; }
  ${s} .tm-material-mobilebar > div { display: flex; gap: 4px; }
  ${s} .tm-material-title { min-height: 157px; padding: 24px 0 28px; margin-bottom: 20px; }
  ${s} .tm-material-title__copy { width: 73%; }
  ${s} .tm-material-title h1 { font-size: 46px !important; margin-bottom: 10px !important; }
  ${s} .tm-material-title__subtitle { font-size: 12px; line-height: 1.6; max-width: 27ch; }
  ${s} .tm-material-art { top: 20px; height: 138px; width: 29%; }
  ${s} .tm-material-art--branch { top: 12px; height: 175px; width: 28%; }
  ${s} .tm-material-art--horizon { top: 54px; height: 102px; width: 35%; }
  ${s} .tm-material-title[data-room="hospodareni"] h1 { font-size: 35px !important; }
  ${s} .tm-material-title[data-room="socsite"] h1 { font-size: 40px !important; }
  ${s} .tm-material-title[data-room="kos"] { min-height: 95px; }
  ${s} .tm-material-title__tools { margin-top: 10px; }
  ${s} .tm-material-title__tools button { min-width: 44px; min-height: 44px; }
  ${s} .tm-material-focus { padding: 14px; }
  ${s} .tm-page input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), ${s} .tm-page textarea, ${s} .tm-cs input, ${s} .tm-cs textarea, ${s} .tm-drawer input, ${s} .tm-drawer textarea { font-size: 16px !important; }
  ${s} .tm-habitgrid { grid-template-columns: 1fr !important; }
  ${s} .tm-habitgrid .tm-hbtn { min-height: 50px; font-size: 14px !important; }
  ${s} :is(.tm-tab,.tm-chip,.tm-tap-c) { min-height: 44px; }
  ${s} .tm-sidebar { border-radius: 0 18px 18px 0 !important; }
  ${s} .tm-material-caption { margin-top: 30px; }
}
@media (max-width: 360px) {
  ${s} { --land-gutter: 16px; }
  ${s} .tm-material-title h1 { font-size: 40px !important; }
  ${s} .tm-material-title[data-room="hospodareni"] h1 { font-size: 30px !important; }
  ${s} .tm-material-title__subtitle { max-width: 24ch; }
}
@media (prefers-reduced-motion: reduce) { ${s} * { scroll-behavior: auto !important; } }
@media print {
  ${s} :is(.tm-material-mobilebar,.tm-material-art,.tm-material-caption) { display: none !important; }
  ${s} .tm-material-title { min-height: 0; }
}
`;
}
