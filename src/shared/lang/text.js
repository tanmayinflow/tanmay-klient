// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/lang/text.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// Text bez značek. Náhled v seznamu má být věta, ne „# " a „- [ ] ".
// náhled v seznamu · ze značek má zbýt čistá věta, ne „# " a „- [ ] "
export function tmPlain(s) {
  return String(s || "")
    .replace(/^\{\^[crj]\}/gm, "")
    .replace(/^!img\([^)]*\)$/gm, "")
    .replace(/^!gd\([^)]*\)$/gm, "")
    .replace(/^-{3,}$/gm, "")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^-\s\[[ xX]\]\s?/gm, "")
    .replace(/^\d{1,3}\.\s/gm, "")
    .replace(/^[-•]\s/gm, "")
    .replace(/\{c\|(?:copper|sage|sand)\}([\s\S]*?)\{\/c\}/g, "$1")
    .replace(/\[\[([^\]\[\n]+)\]\]/g, "$1")
    .replace(/\*\*((?:[^*\n]|\*(?!\*))+?)\*\*/g, "$1")
    .replace(/~~([^~\n]+)~~/g, "$1")
    .replace(/==([^=\n]+)==/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1");
}
