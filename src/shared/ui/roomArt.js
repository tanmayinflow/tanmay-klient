// Reviewed object illustrations. Keep their original files and alpha intact.
export const ROOM_ART = Object.freeze({
  praxe: 'practice-illustration-v1.png',
  trenink: 'training-reference-equipment.webp',
  denik: 'journal-illustration-v3.png',
  kompas: 'compass-illustration-v1.png',
  zapisnik: 'reference-pine.webp',
  prameny: 'sources-illustration-v1.png',
  klienti: 'clients-hand-v2.png',
  hospodareni: 'finance-illustration-v1.png',
  socsite: 'content-illustration-v1.png',
  kos: 'basket-illustration-v2.png',
});

export function roomArtCss() {
  const s = 'html:not([data-appearance^="landscape-"])';
  const rooms = Object.keys(ROOM_ART).map(room => `[data-art-room="${room}"]`).join(',');
  const paths = Object.entries(ROOM_ART).map(([room, file]) =>
    `.tm-page-title[data-art-room="${room}"] { --room-art: url('/media/icons/${file}'); }`).join('\n');
  return `${paths}
${s} .tm-page-title:is(${rooms}) { position: relative; isolation: isolate; min-height: 112px; }
${s} .tm-page-title:is(${rooms})::before { content: ''; position: absolute; right: 48px; top: -4px; width: 140px; height: 106px; z-index: -1; pointer-events: none; background: currentColor; mask: var(--room-art) center/contain no-repeat; -webkit-mask: var(--room-art) center/contain no-repeat; opacity: .28; }
${s} .tm-page-title[data-art-room="zapisnik"]::before { width: 92px; height: 130px; }
${s} .tm-page-title[data-art-room="trenink"]::before { right: 0; width: 190px; height: 120px; }
@media (max-width: 410px) { ${s} .tm-page-title:is(${rooms})::before { width: 100px; height: 86px; } }
@media (max-width: 370px) { ${s} .tm-page-title:is(${rooms})::before { width: 82px; height: 76px; right: 44px; } }
@media print { ${s} .tm-page-title:is(${rooms})::before { content: none; } }
`;
}
