// SDÍLENÉ JÁDRO · žádný volný identifikátor.
//
// `createStates` používal FONT_BODY, který si nikdy neimportoval. Sestavení
// prošlo, testy prošly, lint mlčel — a prázdný stav Kompasu spadl v prohlížeči
// na ReferenceError. Tenhle test se dívá do zdroje sdíleného jádra a ptá se,
// jestli každý identifikátor, který v něm stojí, opravdu odněkud pochází.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = fileURLToPath(new URL("../src/shared/", import.meta.url));

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(n)) out.push(p);
  }
  return out;
}

// Jména, která v modulu smí stát jen tehdy, když si je modul přinesl sám.
// Jsou to přesně ta, která v aplikacích existují jako globální konstanty a
// při přesunu kódu do jádra se snadno „zapomenou".
const HLIDANE = [
  "FONT_BODY", "FONT_TAG", "FONT_LOGO", "FONT_DISPLAY",
  "AREAS", "AREA_ICON", "AREA_COLOR", "GOALS", "PRIOS", "PRIO_COLOR",
  "GSTATUS_COLOR", "ROM", "ACHIEVES", "ACH_SHORT",
  "hexA", "uid", "todayISO", "fmtCZ", "areaLabel", "areaClean",
];

// Resource copy can contain ordinary words such as AREAS. Parse identifiers
// rather than scanning prose; template expressions still remain real code.
function identifiers(src, filename = 'shared.jsx') {
  const tree=ts.createSourceFile(filename,src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const names=new Set();
  const visit=node=>{if(ts.isIdentifier(node))names.add(node.text);ts.forEachChild(node,visit);};
  visit(tree);
  return names;
}

test('identifier audit excludes literal copy but checks template expressions',()=>{
  assert.equal(identifiers('const text = `YOUR MAIN AREAS`; // GOALS').has('AREAS'),false);
  assert.equal(identifiers('const text = "GOALS";').has('GOALS'),false);
  assert.equal(identifiers('const text = `Count: ${AREAS.length}`;').has('AREAS'),true);
  assert.equal(identifiers('const value = GOALS;').has('GOALS'),true);
});

test("sdílené jádro nesahá po ničem, co si nepřineslo", () => {
  const spatne = [];
  for (const f of walk(ROOT)) {
    const src = readFileSync(f, "utf8");
    const rel = f.slice(ROOT.length);
    const used=identifiers(src,f);
    for (const jmeno of HLIDANE) {
      if (!used.has(jmeno)) continue;
      // odkud smí pocházet: import, deklarace, destrukturalizace parametru
      const zdroj = new RegExp(
        "(?:^|\\n)\\s*(?:import[^\\n]*\\b" + jmeno + "\\b" +
        "|export\\s+(?:const|function|let)\\s+" + jmeno + "\\b" +
        "|const\\s+" + jmeno + "\\b" +
        "|function\\s+" + jmeno + "\\b)",
      );
      // destrukturalizace z deps · `const { …, FONT_BODY, … } = deps;`
      const zDeps = new RegExp("\\{[^{}]*\\b" + jmeno + "\\b[^{}]*\\}\\s*=\\s*(?:deps|props)\\b", "s");
      // parametr továrny · `export function createX({ …, hexA, … })`
      const zParam = new RegExp("(?:function\\s+create[A-Za-z]*\\s*\\(|=>\\s*)\\{[^)]*\\b" + jmeno + "\\b", "s");
      if (!zdroj.test(src) && !zDeps.test(src) && !zParam.test(src)) {
        spatne.push(rel + " · " + jmeno);
      }
    }
  }
  assert.deepEqual(spatne, [], "volné identifikátory ve sdíleném jádru");
});
