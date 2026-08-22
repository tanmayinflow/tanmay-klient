// GENERATED · SHARED PRODUCT CORE — do not edit inside an application repository.
// Canonical source: Work/web-application/Shared/product-core/repo-tests/theme-hardcoded.test.js
// Change it there, then run `npm run shared:sync` in the outer workspace.
// `npm run shared:check` fails the build when a mirror drifts from its hash.

// NÁHODNÝ HEX V ROZHRANÍ.
//
// Zakázat všechny hexy globálně by bylo nesmyslné: Movement Atlas, ilustrace,
// tisk a značkové body je používají oprávněně. Tenhle test proto vede
// INVENTÁŘ. Každý hex, který v App.tsx zůstal, je tu vypsaný i s tím, čím je
// — a nový, nezařazený, shodí build. Rozhraní se barví tokenem, ne hexem.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(join(root, "src/App.tsx"), "utf8");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

// hex → [kolikrát, čím to je]
const INVENTORY = {
  "tanmay-web": {
    // tisková a exportní šablona · kanonický Linen dokument, ne motiv (§18)
    "#1C1C1A": [1, "EXPORT · barva písma tiskové šablony"],
    "#2E3D35": [1, "EXPORT · nadpis tiskové šablony"],
    "#454842": [2, "EXPORT · podnadpis a citace"],
    "#4F646B": [2, "EXPORT · odkaz v tisku"],
    "#57684A": [1, "EXPORT · ink-sage v tisku"],
    "#5C5F58": [3, "EXPORT · metadata a značky odrážek"],
    "#6B5840": [1, "EXPORT · ink-sand v tisku"],
    "#7C8C6E": [1, "EXPORT · svislice citace"],
    "#8F5320": [1, "EXPORT · ink-copper v tisku"],
    "#CFC7BB": [2, "EXPORT · linka hlavičky a oddělovník"],
    "#D7D0C6": [1, "EXPORT · linka patičky"],
    "#EBE3D8": [1, "EXPORT · zvýraznění v tisku"],
    "#F4F0EB": [2, "vložené HTML tlačítko v generovaném náhledu · Linen"],
    // ilustrace · siluetu nekreslí motiv
    "#3A423A": [2, "ILUSTRACE · silueta postavy v noci"],
    "#D7D2C8": [2, "ILUSTRACE · silueta postavy ve dne"],
  },
  "tanmay-klient": {
    "#F4F0EB": [1, "vložené HTML tlačítko v generovaném náhledu · Linen"],
    "#3B3B37": [2, "ILUSTRACE · silueta postavy v noci"],
    "#D9D0BE": [2, "ILUSTRACE · silueta postavy ve dne"],
    "#A0522D": [1, "ILUSTRACE · cihla v nákresu"],
    "#C1744B": [1, "ILUSTRACE · cihla v nákresu, noc"],
  },
};

test("v rozhraní nepřibyl náhodný hex", () => {
  const inv = INVENTORY[pkg.name];
  assert.ok(inv, "neznámý repozitář: " + pkg.name);
  // Náhrada v `var(--tm-token, #HEX)` je token se záložní hodnotou, ne hex.
  const stripped = app.replace(/var\(--tm-[a-z0-9-]+,\s*#[0-9A-Fa-f]{6}\)/g, "var(--tm-x)");
  const found = {};
  for (const h of stripped.match(/#[0-9A-Fa-f]{6}\b/g) || []) {
    const k = h.toUpperCase();
    found[k] = (found[k] || 0) + 1;
  }
  const problems = [];
  for (const k of Object.keys(found)) {
    if (!inv[k]) { problems.push(`nový hex ${k} (${found[k]}×) · zařaď ho, nebo použij token`); continue; }
    if (found[k] !== inv[k][0]) problems.push(`${k}: ${found[k]}× místo ${inv[k][0]}× (${inv[k][1]})`);
  }
  for (const k of Object.keys(inv)) if (!found[k]) problems.push(`${k} z inventáře zmizel · smaž řádek`);
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("značkové body se jmenují, ne píší", () => {
  assert.match(app, /from "\.\/shared\/ui\/themeRegistry\.js"/);
  assert.match(app, /BRAND\.(linen|forest|copper)/);
});

test("Movement Atlas se v žádném motivu nepřebarvuje", () => {
  const start = app.indexOf("function TmAtlasArt");
  if (start < 0) {
    // Klientská aplikace pláty Atlasu nevykresluje vůbec — kreslí procedurální
    // postavu ze sdíleného jádra. Není co tónovat a nesmí to přibýt.
    assert.equal(app.includes("/movement-atlas/"), false, "klientský balík nesmí sáhnout po plátech Atlasu");
    return;
  }
  const atlas = app.slice(start, app.indexOf("function TExArt", start));
  assert.ok(atlas.length > 200, "TmAtlasArt se nenašel celý");
  for (const bad of ["filter:", "mixBlendMode", "invert(", "hue-rotate", "sepia(", "saturate("]) {
    assert.equal(atlas.includes(bad), false, `plát Atlasu se nesmí tónovat (${bad})`);
  }
  assert.match(atlas, /background: t\.atlasFrame/, "plát leží na lněném poli");
  assert.match(atlas, /objectFit: "contain"/, "poměr stran plátu se nemění");
});
