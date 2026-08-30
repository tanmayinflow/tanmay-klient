#!/usr/bin/env node
// ---------------------------------------------------------------------------
// KATALOG IKON · vývojářský kontaktní arch, nikdy součást produkce
// ---------------------------------------------------------------------------
// Vykreslí celý ikonový registr v 16 / 20 / 24 / 32 px, ve světle i ve tmě,
// do jednoho HTML souboru pro vizuální kontrolu. Nový soubor vzniká mimo
// `src/` a nikam se nenasazuje.
//
//   node scripts/icon-catalog.mjs [výstup.html]     výchozí: /tmp/icon-catalog.html
//
// Skript si ikony přeloží esbuildem (JSX) a vykreslí přes react-dom/server.
import { writeFileSync, mkdtempSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const out = process.argv[2] || join(tmpdir(), "icon-catalog.html");

const tmp = mkdtempSync(join(tmpdir(), "tm-icons-"));
const bundle = join(tmp, "icons.bundle.mjs");
execFileSync("npx", ["esbuild", join(repo, "src/shared/ui/icons.jsx"),
  "--bundle", "--format=esm", "--jsx=automatic", "--outfile=" + bundle,
], { cwd: repo, stdio: "inherit" });

const ReactMod = await import(pathToFileURL(join(repo, "node_modules/react/index.js")));
const React = ReactMod.default || ReactMod;
const ServerMod = await import(pathToFileURL(join(repo, "node_modules/react-dom/server.node.js")));
const renderToStaticMarkup = ServerMod.renderToStaticMarkup || ServerMod.default.renderToStaticMarkup;
const icons = await import(pathToFileURL(bundle));
const { TmIcon, TM_ICONS, TM_USER_ICON_GROUPS, TM_USER_ICON_LABELS } = icons;

const SIZES = [16, 20, 24, 32];
const ids = Object.keys(TM_ICONS).sort();
const userIds = new Set(TM_USER_ICON_GROUPS.flatMap((g) => g.ids));

const cell = (id) => {
  const glyphs = SIZES.map((s) => `<span class="g" title="${s}px">` + renderToStaticMarkup(React.createElement(TmIcon, { id, size: s })) + `</span>`).join("");
  const lbl = TM_USER_ICON_LABELS[id] ? ` · ${TM_USER_ICON_LABELS[id][0]}/${TM_USER_ICON_LABELS[id][1]}` : "";
  const user = userIds.has(id) ? ` <em>výběr</em>` : "";
  return `<div class="c"><div class="row">${glyphs}</div><div class="n">${id}${lbl}${user}</div></div>`;
};

const grid = ids.map(cell).join("\n");
const html = `<!doctype html>
<meta charset="utf-8">
<title>Tanmay Practice · katalog ikon (${ids.length})</title>
<style>
  body { margin: 0; font: 13px/1.4 system-ui, sans-serif; display: flex; min-height: 100vh; }
  .half { flex: 1; padding: 26px 22px; }
  .light { background: #F2EADB; color: #2A2620; }
  .dark  { background: #141612; color: #E8E2D4; }
  h1 { font-size: 15px; font-weight: 600; margin: 0 0 16px; }
  .wrap { display: flex; flex-wrap: wrap; gap: 10px; }
  .c { width: 168px; padding: 8px; border-radius: 8px; border: 1px solid rgba(128,120,100,.25); }
  .row { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 6px; }
  .g { display: inline-flex; }
  .n { font-size: 11px; opacity: .75; word-break: break-all; }
  em { color: #B87333; font-style: normal; }
</style>
<div class="half light"><h1>Světlo · ${ids.length} ikon · 16/20/24/32</h1><div class="wrap">${grid}</div></div>
<div class="half dark"><h1>Tma</h1><div class="wrap">${grid}</div></div>
`;
writeFileSync(out, html);
console.log(`katalog ikon: ${ids.length} ikon → ${out}`);
