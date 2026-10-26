// One shallow material hierarchy. Original intentionally matches no rule here.
// Components opt in by semantic role; selection, drag and editors keep their
// own state styling. Artwork and text remain crisp on the material carrying them.
export function surfaceCss() {
  const root = 'html:is([data-surface-style="veil"],[data-surface-style="shadow"],[data-surface-style="clear"])';
  const idle = ':not([data-tm-surface-active="true"]):not([data-tm-surface-editor="true"]):not([aria-invalid="true"]):not([aria-disabled="true"]):not(:disabled)';
  return `
${root} {
  --tm-depth-i5: color-mix(in srgb, var(--tm-depth-ink) 5%, transparent);
  --tm-depth-i8: color-mix(in srgb, var(--tm-depth-ink) 8%, transparent);
  --tm-depth-i14: color-mix(in srgb, var(--tm-depth-ink) 14%, transparent);
  --tm-depth-hair: color-mix(in srgb, var(--tm-border-soft) 65%, transparent);
  --tm-depth-edge: color-mix(in srgb, var(--tm-card) 28%, transparent);
  --tm-depth-panel-shadow: 0 2px 6px -2px var(--tm-depth-i8), 0 10px 24px -12px var(--tm-depth-i14);
}
html[data-color-mode="dark"]:is([data-surface-style="veil"],[data-surface-style="shadow"],[data-surface-style="clear"]) {
  --tm-depth-i5: color-mix(in srgb, var(--tm-depth-ink) 20%, transparent);
  --tm-depth-i8: color-mix(in srgb, var(--tm-depth-ink) 28%, transparent);
  --tm-depth-i14: color-mix(in srgb, var(--tm-depth-ink) 42%, transparent);
  --tm-depth-hair: color-mix(in srgb, var(--tm-text) 11%, transparent);
  --tm-depth-edge: color-mix(in srgb, var(--tm-text) 5%, transparent);
}
html[data-surface-style="veil"] {
  --tm-depth-card-fill: color-mix(in srgb, var(--tm-card) 42%, transparent);
  --tm-depth-row-fill: color-mix(in srgb, var(--tm-card) 30%, transparent);
  --tm-depth-chip-fill: color-mix(in srgb, var(--tm-card) 24%, transparent);
  --tm-depth-card-shadow: inset 0 1px var(--tm-depth-edge), 0 1px 2px var(--tm-depth-i5), 0 4px 10px -5px var(--tm-depth-i8);
  --tm-depth-row-shadow: inset 0 1px var(--tm-depth-edge), 0 1px 4px -2px var(--tm-depth-i8);
  --tm-depth-chip-shadow: 0 1px 2px var(--tm-depth-i5);
}
html[data-surface-style="shadow"] {
  --tm-depth-card-fill: color-mix(in srgb, var(--tm-card) 38%, transparent);
  --tm-depth-row-fill: color-mix(in srgb, var(--tm-card) 28%, transparent);
  --tm-depth-chip-fill: color-mix(in srgb, var(--tm-card) 22%, transparent);
  --tm-depth-card-shadow: inset 0 1px var(--tm-depth-edge), 0 1px 3px var(--tm-depth-i8), 0 5px 12px -4px var(--tm-depth-i14);
  --tm-depth-row-shadow: inset 0 1px var(--tm-depth-edge), 0 2px 6px -2px var(--tm-depth-i14);
  --tm-depth-chip-shadow: 0 1px 2px var(--tm-depth-i5), 0 2px 5px -2px var(--tm-depth-i8);
}
html[data-surface-style="clear"] {
  --tm-depth-card-fill: transparent;
  --tm-depth-row-fill: transparent;
  --tm-depth-chip-fill: transparent;
  --tm-depth-card-shadow: none;
  --tm-depth-row-shadow: none;
  --tm-depth-chip-shadow: none;
  --tm-depth-hair: color-mix(in srgb, var(--tm-border-soft) 55%, transparent);
}
html[data-color-mode="dark"]:is([data-surface-style="veil"],[data-surface-style="shadow"]) {
  --tm-depth-card-fill: color-mix(in srgb, var(--tm-card) 68%, transparent);
  --tm-depth-row-fill: color-mix(in srgb, var(--tm-card) 52%, transparent);
  --tm-depth-chip-fill: color-mix(in srgb, var(--tm-card) 40%, transparent);
}
html[data-color-mode="dark"][data-surface-style="clear"] {
  --tm-depth-hair: color-mix(in srgb, var(--tm-text) 12%, transparent);
}
${root} [data-tm-surface="card"]${idle} {
  background-color: var(--tm-depth-card-fill) !important;
  background-image: none !important;
  border-color: var(--tm-depth-hair) !important;
  box-shadow: var(--tm-depth-card-shadow) !important;
}
${root} [data-tm-surface="row"]${idle} {
  background-color: var(--tm-depth-row-fill) !important;
  background-image: none !important;
  border-color: var(--tm-depth-hair) !important;
  box-shadow: var(--tm-depth-row-shadow) !important;
}
${root} [data-tm-surface="chip"]${idle} {
  background-color: var(--tm-depth-chip-fill) !important;
  border-color: var(--tm-depth-hair) !important;
  box-shadow: var(--tm-depth-chip-shadow) !important;
}
/* Functional field edges retain their contrast; only the interior is lighter. */
${root} [data-tm-surface="control"]${idle}:not(:focus-within):not(:disabled) {
  background-color: var(--tm-depth-chip-fill) !important;
  box-shadow: var(--tm-depth-chip-shadow) !important;
}
/* A picture/text face belongs to its card, not to a second beige slab. */
${root} [data-tm-surface="inset"]${idle} {
  background-color: transparent !important;
  box-shadow: none !important;
}
${root} [data-tm-surface="fade"] { background: none !important; }
${root} [data-tm-surface="card"] [data-tm-surface]:not([data-tm-surface="control"])${idle} {
  background-color: transparent !important;
  box-shadow: none !important;
}
/* Open exercise rows stay open. Only the existing circular portrait carrier
   participates; no filtering of illustrations, personal images or video. */
${root} .tm-exercise-list [data-exercise-round-image] {
  background-color: var(--tm-depth-chip-fill) !important;
  box-shadow: var(--tm-depth-chip-shadow);
}
/* Floating interfaces remain fully opaque, including in Clear. No blur pass. */
${root} :is(.tm-select-menu,.tm-calcard) { box-shadow: var(--tm-depth-panel-shadow) !important; }
@media (min-width: 821px) {
  ${root} .tm-drawer { box-shadow: var(--tm-shadow-sheet) !important; }
}
@media (prefers-contrast: more), (forced-colors: active) {
  ${root} [data-tm-surface]${idle} { box-shadow: none !important; border-color: var(--tm-border-strong) !important; }
}
@media print {
  ${root} [data-tm-surface] { background-color: transparent !important; box-shadow: none !important; }
}
`;
}
