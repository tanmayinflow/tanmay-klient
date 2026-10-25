// Reviewed object illustrations. Keep their original files and alpha intact.
export const TRAINING_YOGA_ART = 'training-rings-v2.webp';

export const ROOM_ART = Object.freeze({
  praxe: 'practice-illustration-v1.png',
  'praxe-client': 'practice-fire-v4.webp',
  trenink: TRAINING_YOGA_ART,
  denik: 'journal-illustration-v3.png',
  kompas: 'compass-illustration-v1.png',
  zapisnik: 'reference-pine.webp',
  prameny: 'sources-pine-cone-v2.png',
  klienti: 'clients-hand-v2.png',
  socsite: 'content-illustration-v1.png',
  kos: 'basket-illustration-v2.png',
  terminy: 'empty-trenink-v2.webp',
});

export function roomArtCss() {
  const s = 'html:not([data-appearance^="landscape-"])';
  const rooms = Object.keys(ROOM_ART).map(room => `[data-art-room="${room}"]`).join(',');
  const paths = Object.entries(ROOM_ART).map(([room, file]) =>
    `.tm-page-title[data-art-room="${room}"] { --room-art: url('/media/icons/${file}'); }`).join('\n');
  return `${paths}
html[data-frame-grammar] .tm-page-title[data-art-room="trenink"] { --room-art: url('/media/icons/${TRAINING_YOGA_ART}'); --land-art: url('/media/icons/${TRAINING_YOGA_ART}'); }
${s} .tm-page-title:is(${rooms}) { position: relative; isolation: isolate; min-height: 112px; }
${s} .tm-page-title:is(${rooms})::before { content: ''; position: absolute; right: 48px; top: -4px; width: 140px; height: 106px; z-index: -1; pointer-events: none; background: currentColor; mask: var(--room-art) center/contain no-repeat; -webkit-mask: var(--room-art) center/contain no-repeat; opacity: .28; }
${s} .tm-page-title[data-art-room="zapisnik"]::before { width: 92px; height: 130px; }
${s} .tm-page-title[data-art-room="trenink"]::before { right: 0; width: 190px; height: 120px; }
@media (max-width: 410px) { ${s} .tm-page-title:is(${rooms})::before { width: 100px; height: 86px; } }
@media (max-width: 370px) { ${s} .tm-page-title:is(${rooms})::before { width: 82px; height: 76px; right: 44px; } }
html[data-frame-grammar] .tm-page-title[data-art-room="trenink"] { min-height: 144px; }
html[data-frame-grammar] .tm-page-title[data-art-room="trenink"]::before { inset: -6px 0 auto auto; width: 136px; height: 136px; }
@media (max-width: 370px) { html[data-frame-grammar] .tm-page-title[data-art-room="trenink"]::before { width: 116px; height: 116px; } }
html[data-frame-grammar] .tm-page-title[data-art-room="hospodareni"] { min-height: 0; }
html[data-frame-grammar] .tm-page-title[data-art-room="hospodareni"]::before { content: none; }
@media print { ${s} .tm-page-title:is(${rooms})::before { content: none; } }
`;
}
