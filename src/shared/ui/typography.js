import {STACK_DISPLAY_CS, STACK_DISPLAY_EN, STACK_BODY, STACK_TAG} from './type.js';

const BOOK_SERIF="'Tanmay Book Serif', Georgia, serif";
const BOOK_SANS="'Tanmay Book Sans', 'DM Sans', system-ui, sans-serif";
const CLEAR_SANS="'Tanmay Clear Sans', 'DM Sans', system-ui, sans-serif";
const CLEAR_SERIF="'Tanmay Clear Serif', Georgia, serif";

export const TYPOGRAPHY_PRESETS=Object.freeze([
  Object.freeze({id:'original',labelCs:'Původní',labelEn:'Original',descriptionCs:'Jemné nadpisy a lehké, známé rozhraní.',descriptionEn:'Delicate headings and a light, familiar interface.',creditCs:'Garamond · DM Sans · Barlow',creditEn:'Garamond · DM Sans · Barlow'}),
  Object.freeze({id:'book',labelCs:'Knižní',labelEn:'Book',descriptionCs:'Výraznější knižní písmo pro nadpisy i delší čtení.',descriptionEn:'A fuller book face for headings and longer reading.',creditCs:'Source Serif 4 · Source Sans 3',creditEn:'Source Serif 4 · Source Sans 3',display:BOOK_SERIF,body:BOOK_SANS,tag:BOOK_SANS,reading:BOOK_SERIF}),
  Object.freeze({id:'clear',labelCs:'Čistá',labelEn:'Clear',descriptionCs:'Otevřené bezpatkové nadpisy, klidná sazba poznámek.',descriptionEn:'Open sans-serif headings, calm serif notes.',creditCs:'IBM Plex Sans · IBM Plex Serif',creditEn:'IBM Plex Sans · IBM Plex Serif',display:CLEAR_SANS,body:CLEAR_SANS,tag:CLEAR_SANS,reading:CLEAR_SERIF}),
]);
export const normalizeTypography=value=>TYPOGRAPHY_PRESETS.some(p=>p.id===value)?value:'original';
export function typographyPreset(value,lang='cs'){
  const p=TYPOGRAPHY_PRESETS.find(p=>p.id===normalizeTypography(value));
  return {...p,display:p.display||(lang==='en'?STACK_DISPLAY_EN:STACK_DISPLAY_CS),body:p.body||STACK_BODY,tag:p.tag||STACK_TAG,reading:p.reading||STACK_BODY};
}

export function typographyCss(value){
  if(normalizeTypography(value)==='original')return '';
  return `
/* Long writing is separate from controls; typography never changes saved markup. */
.tm-rich.tm-rich { font-family:var(--tm-font-reading); font-optical-sizing:auto; --tm-fs:calc(16px * var(--tm-read, 1)); --tm-lh:1.7; }
.tm-rich.tm-rich :is(p,[data-p],[data-qt],[data-ol],[data-ul]) { font-family:var(--tm-font-reading); }
.tm-rich.tm-rich :is(h1,h2) { font-family:var(--tm-font-display); font-optical-sizing:auto; }
.tm-type-preview { font-optical-sizing:auto; }
`;
}
