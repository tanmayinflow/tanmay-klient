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

const ROOT = new URL("../src/shared/", import.meta.url).pathname;

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

test("sdílené jádro nesahá po ničem, co si nepřineslo", () => {
  const spatne = [];
  for (const f of walk(ROOT)) {
    const src = readFileSync(f, "utf8");
    const rel = f.slice(ROOT.length);
    for (const jmeno of HLIDANE) {
      const re = new RegExp("\\b" + jmeno + "\\b", "g");
      if (!re.test(src)) continue;
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
