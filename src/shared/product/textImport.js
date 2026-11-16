// ————————————————————————————————————————————————————————————
// PŘEVOD CIZÍHO TEXTU NA POZNÁMKU
// Všechno, co do poznámky přichází zvenku, projde tudy a vyjde jako
// markdown poznámky (# ## ### · - · 1. · - [ ] · > · --- · ** * ~~ ==):
//
//   schránka s formátem (web, Word, Dokumenty Google, jiná poznámka)
//                                    → tmHtmlToMd
//   holý text a cizí markdown        → tmTextToMd
//   soubor .docx                     → tmDocxToMd
//   soubor .pdf                      → tmPdfPagesToMd (stránky čte pdfText.js)
//   jakýkoli podporovaný soubor      → tmFileToMd
//
// Nic neodchází ven: čte se v prohlížeči, na tomhle zařízení.
// Čisté funkce (text, PDF) se zkouší v Node, zbytek v prohlížeči.
// ————————————————————————————————————————————————————————————
import { tmSazec } from "./typesetter.js";
import { readDocumentArchive } from "./documentArchive.js";

// Jedna poznámka nesmí přerůst úložiště · celý dokument aplikace má strop.
export const TM_IMPORT_MAX_CHARS = 80000;
export const TM_IMPORT_MAX_BYTES = 40 * 1024 * 1024;
export const TM_IMPORT_ACCEPT = ".pdf,.docx,.txt,.md,.markdown,.html,.htm,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/html";

export class TmImportError extends Error {
  constructor(kod, info) { super(kod); this.name = "TmImportError"; this.kod = kod; this.info = info || null; }
}

const uhlad = (md) => String(md || "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+|\n+$/g, "");

// ————————————————————————————————————————————————————————————
// HOLÝ TEXT A CIZÍ MARKDOWN
// ————————————————————————————————————————————————————————————
function mdRadek(l) {
  return l
    .replace(/!\[([^\]\n]*)\]\([^)\n]*\)/g, "$1")
    .replace(/\[([^\]\n]+)\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g, (m, txt, url) => (txt === url ? url : txt + " (" + url + ")"))
    .replace(/\*\*\*([^*\n]+)\*\*\*/g, "**$1**")
    .replace(/(^|[\s(„"])__([^_\n]+)__(?=$|[\s).,;:!?“"])/g, "$1**$2**")
    .replace(/(^|[\s(„"])_([^_\n]+)_(?=$|[\s).,;:!?“"])/g, "$1*$2*")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/\\([*_#\-.()[\]>`~+!|])/g, "$1");
}
export function tmMdNormalize(text) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ").split("\n");
  const out = []; let plot = false;
  lines.forEach((puv) => {
    if (/^\s*(```|~~~)/.test(puv)) { plot = !plot; return; }
    if (plot) { out.push(puv); return; }
    if (/^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(puv)) return;      // dělicí řádek tabulky
    let l = puv;
    const mh = l.match(/^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (mh) { out.push("#".repeat(Math.min(3, mh[1].length)) + " " + mdRadek(mh[2])); return; }
    if (/^\s*([-*_]\s*){3,}$/.test(l)) { out.push("---"); return; }
    l = l.replace(/^\s*(>\s*)+/, "> ")
      .replace(/^\s*[*+]\s+(?=\S)/, "- ")
      .replace(/^\s+-\s+(?=\S)/, "- ")
      .replace(/^\s*(\d{1,3})[.)]\s+(?=\S)/, "$1. ")
      .replace(/^- \[(?:x|X)\]\s*/, "- [x] ");
    if (/^\s*\|.*\|\s*$/.test(l)) l = l.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim()).join(" | ");
    out.push(mdRadek(l));
  });
  return out.join("\n");
}
// cast: true → vložený kus (bez titulku) · jinak celý dokument
export function tmTextToMd(text, opts) {
  const o = opts || {};
  const hruby = tmMdNormalize(text);
  const maNadpisy = /^#{1,3} /m.test(hruby);
  return tmSazec(hruby, o.cast ? { cast: true } : { odstavce: false, titulek: !maNadpisy, nadpisy: !maNadpisy });
}

// ————————————————————————————————————————————————————————————
// ŘEZY S FORMÁTEM → MARKDOWN ŘÁDKU
// Řez je { t, b, i, s, m }. Sousední řezy se stejným formátem se slijí,
// mezery se vystrčí ven ze značek („**slovo** “, ne „**slovo **“).
// Tučná kurzíva se v poznámce zapsat nedá · zůstane tučné.
// ————————————————————————————————————————————————————————————
export function tmSegsToMd(segs, bezFormatu) {
  const sl = [];
  (segs || []).forEach((s) => {
    if (!s || !s.t) return;
    const p = sl[sl.length - 1];
    const stejny = p && !!p.b === !!s.b && !!p.i === !!s.i && !!p.s === !!s.s && !!p.m === !!s.m;
    // mezera mezi dvěma tučnými kusy patří k nim · jinak vznikne „**a** **b**“
    if (stejny) p.t += s.t;
    else if (p && /^\s+$/.test(s.t)) p.t += s.t;
    else sl.push({ t: s.t, b: !!s.b, i: !!s.i, s: !!s.s, m: !!s.m });
  });
  let out = "";
  sl.forEach((s) => {
    const m = s.t.match(/^(\s*)([\s\S]*?)(\s*)$/);
    let j = m[2];
    if (j && !bezFormatu) {
      if (s.b) j = "**" + j.replace(/\*/g, "") + "**";
      else if (s.i) j = "*" + j.replace(/\*/g, "") + "*";
      if (s.s) j = "~~" + j + "~~";
      if (s.m) j = "==" + j + "==";
    }
    out += m[1] + j + m[3];
  });
  return out.replace(/[ \t\u00a0]+/g, " ").trim();
}
const segsText = (segs) => (segs || []).map((s) => s.t).join("").replace(/\s+/g, " ").trim();
const segsVseTucne = (segs) => { let a = 0, b = 0; (segs || []).forEach((s) => { const n = s.t.replace(/\s/g, "").length; a += n; if (s.b) b += n; }); return a > 0 && b === a; };

// ————————————————————————————————————————————————————————————
// SCHRÁNKA S FORMÁTEM · HTML → markdown poznámky
// Dokument z DOMParseru je netečný: skripty se nespustí, obrázky se nestahují.
// ————————————————————————————————————————————————————————————
const HTML_PRYC = new Set(["SCRIPT", "STYLE", "HEAD", "TITLE", "META", "LINK", "NOSCRIPT", "TEMPLATE", "SVG", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "IFRAME", "CANVAS", "VIDEO", "AUDIO", "OBJECT", "EMBED", "IMG", "PICTURE"]);
const HTML_BLOK = new Set(["P", "DIV", "SECTION", "ARTICLE", "MAIN", "HEADER", "FOOTER", "ASIDE", "NAV", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE", "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TD", "TH", "HR", "FIGURE", "FIGCAPTION", "DL", "DT", "DD", "DETAILS", "SUMMARY", "ADDRESS", "FORM", "FIELDSET", "CENTER", "CAPTION"]);
const velikostPt = (st) => {
  const m = /font-size:\s*([\d.]+)\s*(pt|px)/i.exec(st || "");
  if (!m) return 0;
  return m[2].toLowerCase() === "px" ? parseFloat(m[1]) * 0.75 : parseFloat(m[1]);
};

export function tmHtmlToMd(html, parserCtor) {
  const P = parserCtor || (typeof DOMParser !== "undefined" ? DOMParser : null);
  if (!P) return "";
  let doc;
  try { doc = new P().parseFromString(String(html || ""), "text/html"); } catch { return ""; }
  const body = doc && doc.body;
  if (!body) return "";

  const out = [];        // { text, kind, tucne, pt, znaku }
  let segs = [];
  const posledni = () => (out.length ? out[out.length - 1] : null);
  const mezera = () => { const p = posledni(); if (p && p.text !== "") out.push({ text: "", kind: "gap" }); };
  const radek = (text, kind, extra) => out.push(Object.assign({ text, kind: kind || "p" }, extra || {}));
  // vyprázdní rozepsaný řádek · prefix = značka bloku
  const vylij = (prefix, kind, bezFormatu) => {
    const s = segs; segs = [];
    const holy = segsText(s);
    if (holy === "") return false;
    let pt = 0, vaha = 0;
    s.forEach((x) => { if (x.pt && x.t.trim().length > vaha) { vaha = x.t.trim().length; pt = x.pt; } });
    radek((prefix || "") + tmSegsToMd(s, bezFormatu), kind, { tucne: segsVseTucne(s), holy, pt });
    return true;
  };

  const formatZ = (el, f) => {
    const tag = el.tagName;
    const st = (el.getAttribute && el.getAttribute("style")) || "";
    const n = { b: f.b, i: f.i, s: f.s, m: f.m, pre: f.pre, pt: f.pt };
    if (tag === "B" || tag === "STRONG") n.b = true;
    if (tag === "I" || tag === "EM") n.i = true;
    if (tag === "S" || tag === "STRIKE" || tag === "DEL") n.s = true;
    if (tag === "MARK") n.m = true;
    if (tag === "PRE") n.pre = true;
    const w = /font-weight:\s*([a-z0-9]+)/i.exec(st);
    if (w) { const v = w[1].toLowerCase(); n.b = v === "bold" || v === "bolder" || (/^\d+$/.test(v) && +v >= 600); }
    const fs = /font-style:\s*([a-z]+)/i.exec(st);
    if (fs) n.i = /italic|oblique/i.test(fs[1]);
    if (/text-decoration[^;]*line-through/i.test(st)) n.s = true;
    if (/mso-highlight|background(-color)?:\s*(yellow|#ff0|#ffff00|rgb\(255,\s*255,\s*0\))/i.test(st)) n.m = true;
    if (/white-space:\s*pre/i.test(st)) n.pre = true;
    const pt = velikostPt(st); if (pt) n.pt = pt;
    return n;
  };
  const skryty = (el) => /display:\s*none|visibility:\s*hidden/i.test((el.getAttribute && el.getAttribute("style")) || "");
  const maBlok = (el) => { for (let c = el.firstElementChild; c; c = c.nextElementSibling) { if (HTML_BLOK.has(c.tagName) || maBlok(c)) return true; } return false; };
  const ctx0 = { b: false, i: false, s: false, m: false, pre: false, pt: 0 };

  // řádkový obsah → řezy
  const tok = (node, f) => {
    for (let n = node.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) {
        const v = n.nodeValue || "";
        if (f.pre) {
          v.split("\n").forEach((kus, i) => { if (i > 0) { if (!vylij("", "p")) radek("", "gap"); } if (kus) segs.push({ t: kus.replace(/\t/g, "  "), b: f.b, i: f.i, s: f.s, m: f.m, pt: f.pt }); });
        } else if (v) segs.push({ t: v.replace(/[\s\u00a0]+/g, " "), b: f.b, i: f.i, s: f.s, m: f.m, pt: f.pt });
        continue;
      }
      if (n.nodeType !== 1) continue;
      const tag = n.tagName;
      if (HTML_PRYC.has(tag) || HTML_PRYC.has(String(tag).toUpperCase()) || skryty(n)) continue;
      const cls = (n.getAttribute("class") || "");
      if (/\btm-(mk|chk|hr|fig-tools)\b/.test(cls)) continue;                      // značky vlastní poznámky
      if (tag === "BR") { if (!vylij("", "p")) radek("", "gap"); continue; }
      if (HTML_BLOK.has(tag) || n.getAttribute("data-ul") != null || n.getAttribute("data-ol") != null || n.getAttribute("data-chk") != null || n.getAttribute("data-qt") != null || n.getAttribute("data-hr") != null) { vylij("", "p"); blok(n, f); continue; }
      if (tag === "A") {
        const pred = segs.length;
        tok(n, formatZ(n, f));
        if (segs.length === pred) { const h = n.getAttribute("href") || ""; if (/^https?:/i.test(h)) segs.push({ t: h, b: f.b, i: f.i, s: f.s, m: f.m, pt: f.pt }); }
        continue;
      }
      tok(n, formatZ(n, f));
    }
  };

  const seznam = (el, f, razeny) => {
    let c = parseInt(el.getAttribute("start") || "1", 10); if (!(c >= 0)) c = 1;
    for (let li = el.firstElementChild; li; li = li.nextElementSibling) {
      if (li.tagName !== "LI") { if (li.tagName === "UL" || li.tagName === "OL") seznam(li, f, li.tagName === "OL"); continue; }
      const box = li.getAttribute("role") === "checkbox" ? li : li.querySelector('input[type="checkbox"], [role="checkbox"]');
      let prefix = razeny ? (c++) + ". " : "- ";
      if (box && (box === li || !box.closest("ul,ol") || box.closest("ul,ol") === el)) {
        const on = box.hasAttribute("checked") || box.getAttribute("aria-checked") === "true";
        prefix = "- [" + (on ? "x" : " ") + "] ";
      }
      // text položky, pak teprve vnořené seznamy · poznámka má jednu úroveň
      const vnorene = [];
      const projdi = (node, ff) => {
        for (let n = node.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 1 && (n.tagName === "UL" || n.tagName === "OL")) { vnorene.push(n); continue; }
          if (n.nodeType === 1 && HTML_BLOK.has(n.tagName)) { if (segsText(segs) !== "") segs.push({ t: " " }); projdi(n, formatZ(n, ff)); continue; }
          tokJeden(n, ff);
        }
      };
      projdi(li, formatZ(li, f));
      vylij(prefix, "li");          // prázdná položka se nepíše
      vnorene.forEach((v) => seznam(v, f, v.tagName === "OL"));
    }
  };
  // jeden uzel (text nebo prvek) jako řádkový obsah
  const tokJeden = (n, f) => {
    if (n.nodeType === 3) { const v = n.nodeValue || ""; if (v) segs.push({ t: v.replace(/[\s\u00a0]+/g, " "), b: f.b, i: f.i, s: f.s, m: f.m, pt: f.pt }); return; }
    if (n.nodeType !== 1) return;
    if (HTML_PRYC.has(n.tagName) || skryty(n)) return;
    if (n.tagName === "BR") { segs.push({ t: " " }); return; }
    if (/\btm-(mk|chk|hr|fig-tools)\b/.test(n.getAttribute("class") || "")) return;
    const ff = formatZ(n, f);
    for (let c = n.firstChild; c; c = c.nextSibling) tokJeden(c, ff);
  };

  const blok = (el, f0) => {
    const tag = el.tagName;
    if (HTML_PRYC.has(tag) || skryty(el)) return;
    const f = formatZ(el, f0);
    const at = (k) => el.getAttribute(k);
    // ——— bloky vlastní poznámky · kopie mezi poznámkami drží tvar ———
    if (at("data-hr") != null) { radek("---", "hr"); return; }
    if (tag === "FIGURE" && at("data-img")) { radek("!img(" + at("data-img") + "|" + (at("data-w") || "320") + ")", "img"); return; }
    if (tag === "FIGURE" && at("data-gd")) { radek("!gd(" + at("data-gd") + "|" + (at("data-h") || "340") + ")", "img"); return; }
    if (at("data-chk") != null) { tokJeden(el, f0); vylij("- [" + (at("data-chk") === "1" ? "x" : " ") + "] ", "li"); return; }
    if (at("data-ol") != null) { tokJeden(el, f0); vylij((at("data-ol") || "1") + ". ", "li"); return; }
    if (at("data-ul") != null) { tokJeden(el, f0); vylij("- ", "li"); return; }
    if (at("data-qt") != null) { tokJeden(el, f0); vylij("> ", "qt"); return; }
    // ——— obecné HTML ———
    if (tag === "HR") { mezera(); radek("---", "hr"); mezera(); return; }
    const h = /^H([1-6])$/.exec(tag);
    if (h) { tokJeden(el, ctx0); mezera(); vylij("#".repeat(Math.min(3, +h[1])) + " ", "h", true); return; }
    if (tag === "UL" || tag === "OL") { seznam(el, f, tag === "OL"); mezera(); return; }
    if (tag === "LI") { tokJeden(el, f); vylij("- ", "li"); return; }
    if (tag === "BLOCKQUOTE") {
      const od = out.length;
      mezera(); tok(el, f); vylij("", "p");
      for (let i = od; i < out.length; i++) { const r = out[i]; if (r.kind === "gap" || r.text === "") continue; r.text = "> " + r.text.replace(/^(> |#{1,3} |- |\d+\. )/, ""); r.kind = "qt"; }
      mezera(); return;
    }
    if (tag === "PRE") { mezera(); tok(el, Object.assign({}, f, { pre: true })); vylij("", "p"); mezera(); return; }
    if (tag === "TABLE") {
      mezera();
      el.querySelectorAll("tr").forEach((tr) => {
        if (tr.closest("table") !== el) return;
        const bunky = [];
        for (let c = tr.firstElementChild; c; c = c.nextElementSibling) {
          if (c.tagName !== "TD" && c.tagName !== "TH") continue;
          tokJeden(c, f); const s = segs; segs = [];
          bunky.push(tmSegsToMd(s));
        }
        const t = bunky.filter((x) => x !== "").join(" | ");
        if (t) radek(t, "tr");
      });
      mezera(); return;
    }
    if (tag === "P") {
      const cls = at("class") || "";
      const wSeznam = /MsoList/i.test(cls) || /mso-list:/i.test(at("style") || "");
      const pred = posledni();
      if (pred && pred.text !== "" && !(wSeznam && pred.kind === "li")) mezera();
      tok(el, f);
      if (/MsoTitle/i.test(cls)) { const s = segs; segs = []; const t = segsText(s); if (t) { mezera(); radek("# " + t, "h"); } mezera(); return; }
      // odstavec seznamu z Wordu · značka je první znak textu
      if (wSeznam) {
        const s = segs; segs = [];
        const t = tmSegsToMd(s).replace(/^\*\*([^*]+)\*\*/, "$1");
        const mo = t.match(/^\(?(\d{1,3})[.)]\s+(.*)$/);
        const mu = t.match(/^[·o§▪•◦\-–\uf0b7\uf0a7\uf0d8]\s+(.*)$/);
        if (mo) radek(mo[1] + ". " + mo[2], "li"); else if (mu) radek("- " + mu[1], "li"); else if (t) radek("- " + t, "li");
        return;
      }
      if (segsText(segs) === "") { segs = []; mezera(); return; }       // prázdný odstavec = mezera
      vylij("", "pp"); mezera();
      return;
    }
    // DIV a příbuzní · řádek, když drží jen text, jinak jen obal
    if (!maBlok(el)) {
      tok(el, f);
      vylij("", "p");
      return;
    }
    tok(el, f); vylij("", "p");
  };

  tok(body, ctx0); vylij("", "p");

  // ——— nadpisy psané jen velikostí písma nebo tučně (Word a Dokumenty bez stylů) ———
  const vahy = {};
  out.forEach((r) => { if (r.pt && (r.kind === "pp" || r.kind === "p")) vahy[r.pt] = (vahy[r.pt] || 0) + r.holy.length; });
  let telo = 0, nej = 0;
  Object.keys(vahy).forEach((k) => { if (vahy[k] > nej) { nej = vahy[k]; telo = +k; } });
  for (let i = 0; i < out.length; i++) {
    const r = out[i];
    if (r.kind !== "pp" && r.kind !== "p") continue;
    if (!r.holy || r.holy.length > 120 || /[.;,]$/.test(r.holy)) continue;
    let dalsi = null; for (let j = i + 1; j < out.length; j++) if (out[j].text !== "") { dalsi = out[j]; break; }
    if (!dalsi) continue;
    const pomer = telo && r.pt ? r.pt / telo : 0;
    if (pomer >= 1.7) r.text = "# " + r.holy;
    else if (pomer >= 1.3) r.text = "## " + r.holy;
    else if (pomer >= 1.15) r.text = "### " + r.holy;
    else if (r.tucne && r.holy.length <= 90 && !dalsi.tucne && !/[!?:]$/.test(r.holy)) r.text = "### " + r.holy;
    else continue;
    r.kind = "h";
    if (i > 0 && out[i - 1].text !== "") { out.splice(i, 0, { text: "", kind: "gap" }); i++; }
  }
  return uhlad(out.map((r) => r.text).join("\n"));
}

// ————————————————————————————————————————————————————————————
// ZIP · jen čtení, jen to, co potřebuje .docx (bez ZIP64 a šifrování)
// ————————————————————————————————————————————————————————————
export async function tmUnzip(buffer, chci) {
  try { return await readDocumentArchive(buffer, chci); }
  catch (error) { throw new TmImportError(error.message === "archive-unsupported" ? "prohlizec" : error.message === "archive-limit" ? "velky" : "poskozeny"); }
}

// ————————————————————————————————————————————————————————————
// WORD · .docx → markdown poznámky
// Styly Nadpis 1–9 a Název, seznamy, citace, tučné, kurzíva, přeškrtnutí,
// zvýraznění, zarovnání na střed a vpravo, tabulky po řádcích.
// ————————————————————————————————————————————————————————————
const WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const wDeti = (el, jmeno) => { const o = []; if (!el) return o; for (let c = el.firstElementChild; c; c = c.nextElementSibling) if (c.namespaceURI === WNS && c.localName === jmeno) o.push(c); return o; };
const wDite = (el, jmeno) => wDeti(el, jmeno)[0] || null;
const wVal = (el) => (el ? (el.getAttributeNS(WNS, "val") != null ? el.getAttributeNS(WNS, "val") : el.getAttribute("w:val")) : null);
const wZap = (el) => { if (!el) return null; const v = wVal(el); return !(v === "0" || v === "false" || v === "none"); };

export async function tmDocxToMd(buffer, parserCtor) {
  const P = parserCtor || (typeof DOMParser !== "undefined" ? DOMParser : null);
  if (!P) throw new TmImportError("prohlizec");
  let soubory;
  try { soubory = await tmUnzip(buffer, (j) => j === "word/document.xml" || j === "word/styles.xml" || j === "word/numbering.xml"); }
  catch (e) { throw e instanceof TmImportError ? e : new TmImportError("poskozeny"); }
  if (!soubory["word/document.xml"]) throw new TmImportError("poskozeny");
  const dek = new TextDecoder("utf-8");
  const xml = (j) => {
    if (!soubory[j]) return null;
    const text = dek.decode(soubory[j]);
    if (text.length > 6000000 || /<!ENTITY\s/i.test(text)) throw new TmImportError("velky");
    const doc = new P().parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) throw new TmImportError("poskozeny");
    return doc;
  };
  const dDoc = xml("word/document.xml"), dSt = xml("word/styles.xml"), dNum = xml("word/numbering.xml");

  // styly · id → { jmeno, zaklad, b, i, sz, uroven, num }
  const styly = {}; let vychoziSz = 22;
  if (dSt) {
    const root = dSt.documentElement;
    const dd = wDite(wDite(wDite(root, "docDefaults"), "rPrDefault"), "rPr");
    const dsz = wVal(wDite(dd, "sz")); if (dsz) vychoziSz = +dsz || 22;
    wDeti(root, "style").forEach((s) => {
      const id = s.getAttributeNS(WNS, "styleId") || s.getAttribute("w:styleId");
      const rPr = wDite(s, "rPr"), pPr = wDite(s, "pPr");
      const ol = wVal(wDite(pPr, "outlineLvl"));
      styly[id] = {
        jmeno: String(wVal(wDite(s, "name")) || "").toLowerCase(), zaklad: wVal(wDite(s, "basedOn")),
        b: wZap(wDite(rPr, "b")), i: wZap(wDite(rPr, "i")), sz: +(wVal(wDite(rPr, "sz")) || 0) || 0,
        uroven: ol != null && +ol < 9 ? +ol + 1 : 0, num: wDite(pPr, "numPr"),
        vychozi: (s.getAttributeNS(WNS, "default") || s.getAttribute("w:default")) === "1" && (s.getAttributeNS(WNS, "type") || s.getAttribute("w:type")) === "paragraph",
      };
    });
    Object.keys(styly).forEach((id) => { if (styly[id].vychozi && styly[id].sz) vychoziSz = styly[id].sz; });
  }
  const retez = (id) => { const o = []; let s = styly[id], n = 0; while (s && n++ < 12) { o.push(s); s = styly[s.zaklad]; } return o; };
  const zeStylu = (id, klic) => { const r = retez(id); for (let i = 0; i < r.length; i++) if (r[i][klic] != null && r[i][klic] !== 0) return r[i][klic]; return null; };
  const urovenStylu = (id) => {
    const r = retez(id);
    for (let i = 0; i < r.length; i++) {
      const j = r[i].jmeno;
      if (j === "title") return 0.5;
      const m = /^heading (\d)$/.exec(j); if (m) return +m[1];
      if (r[i].uroven) return r[i].uroven;
    }
    return null;
  };
  // číslování · numId → úroveň → formát
  const cisl = {};
  if (dNum) {
    const root = dNum.documentElement; const abs = {};
    wDeti(root, "abstractNum").forEach((a) => {
      const id = a.getAttributeNS(WNS, "abstractNumId") || a.getAttribute("w:abstractNumId"); abs[id] = {};
      wDeti(a, "lvl").forEach((l) => { abs[id][l.getAttributeNS(WNS, "ilvl") || l.getAttribute("w:ilvl")] = wVal(wDite(l, "numFmt")) || "decimal"; });
    });
    wDeti(root, "num").forEach((n) => { cisl[n.getAttributeNS(WNS, "numId") || n.getAttribute("w:numId")] = abs[wVal(wDite(n, "abstractNumId"))] || {}; });
  }

  const bloky = [];      // { segs, uroven, seznam, citace, zarov, sz, text }
  const pocitadla = {};
  const beh = (r, psId, segs) => {
    const rPr = wDite(r, "rPr");
    const rs = wVal(wDite(rPr, "rStyle"));
    const vl = (k) => { const v = wZap(wDite(rPr, k)); if (v != null) return v; const a = rs ? zeStylu(rs, k) : null; if (a != null) return a; const b = zeStylu(psId, k); return b != null ? b : false; };
    const f = { b: !!vl("b"), i: !!vl("i"), s: wZap(wDite(rPr, "strike")) === true, m: (() => { const h = wVal(wDite(rPr, "highlight")); return !!h && h !== "none"; })() };
    const sz = +(wVal(wDite(rPr, "sz")) || 0) || (rs && zeStylu(rs, "sz")) || zeStylu(psId, "sz") || vychoziSz;
    for (let c = r.firstElementChild; c; c = c.nextElementSibling) {
      if (c.namespaceURI !== WNS) continue;
      const n = c.localName;
      if (n === "t") segs.push(Object.assign({ t: c.textContent || "", sz }, f));
      else if (n === "tab") segs.push(Object.assign({ t: " ", sz }, f));
      else if (n === "br" || n === "cr") { if ((c.getAttributeNS(WNS, "type") || c.getAttribute("w:type")) !== "page") segs.push({ t: "\n", sz }); }
      else if (n === "noBreakHyphen") segs.push(Object.assign({ t: "-", sz }, f));
    }
  };
  const behy = (el, psId, segs) => {
    for (let c = el.firstElementChild; c; c = c.nextElementSibling) {
      if (c.namespaceURI !== WNS) continue;
      const n = c.localName;
      if (n === "r") beh(c, psId, segs);
      else if (n === "hyperlink" || n === "ins" || n === "smartTag" || n === "fldSimple" || n === "sdtContent" || n === "sdt") behy(c, psId, segs);
    }
  };
  const odstavec = (p) => {
    const pPr = wDite(p, "pPr");
    const psId = wVal(wDite(pPr, "pStyle")) || Object.keys(styly).find((id) => styly[id].vychozi) || "";
    const segs = []; behy(p, psId, segs);
    const text = segs.map((s) => s.t).join("");
    const b = { segs, text, uroven: null, seznam: null, citace: false, zarov: "", sz: 0 };
    const jmeno = (retez(psId)[0] || {}).jmeno || "";
    b.uroven = urovenStylu(psId);
    const ol = wVal(wDite(pPr, "outlineLvl")); if (b.uroven == null && ol != null && +ol < 9) b.uroven = +ol + 1;
    b.citace = /quote/.test(jmeno);
    const jc = wVal(wDite(pPr, "jc")); b.zarov = jc === "center" ? "{^c}" : (jc === "right" || jc === "end") ? "{^r}" : "";
    const numPr = wDite(pPr, "numPr") || (b.uroven == null ? zeStylu(psId, "num") : null);
    if (numPr && b.uroven == null) {
      const id = wVal(wDite(numPr, "numId")), lvl = wVal(wDite(numPr, "ilvl")) || "0";
      if (id && id !== "0") {
        const fmt = (cisl[id] && cisl[id][lvl]) || (/bullet/.test(jmeno) ? "bullet" : "decimal");
        if (fmt === "bullet" || fmt === "none") b.seznam = "- ";
        else {
          const klic = id + "/" + lvl; pocitadla[klic] = (pocitadla[klic] || 0) + 1;
          Object.keys(pocitadla).forEach((x) => { if (x.indexOf(id + "/") === 0 && +x.split("/")[1] > +lvl) delete pocitadla[x]; });
          b.seznam = pocitadla[klic] + ". ";
        }
      }
    } else if (/^list bullet/.test(jmeno)) b.seznam = "- ";
    let vaha = 0; const szV = {};
    segs.forEach((s) => { const n = s.t.trim().length; if (n) { szV[s.sz] = (szV[s.sz] || 0) + n; if (szV[s.sz] > vaha) { vaha = szV[s.sz]; b.sz = s.sz; } } });
    bloky.push(b);
  };
  const projdi = (el) => {
    for (let c = el.firstElementChild; c; c = c.nextElementSibling) {
      if (c.namespaceURI !== WNS) continue;
      const n = c.localName;
      if (n === "p") odstavec(c);
      else if (n === "tbl") {
        bloky.push({ gap: true });
        wDeti(c, "tr").forEach((tr) => {
          const bunky = wDeti(tr, "tc").map((tc) => { const s = []; wDeti(tc, "p").forEach((p, i) => { if (i) s.push({ t: " " }); behy(p, "", s); }); return tmSegsToMd(s.map((x) => (x.t === "\n" ? { t: " " } : x))); });
          const t = bunky.filter((x) => x !== "").join(" | ");
          if (t) bloky.push({ hotovy: t });
        });
        bloky.push({ gap: true });
      } else if (n === "sdt" || n === "sdtContent" || n === "body") projdi(c);
    }
  };
  const body = wDite(dDoc.documentElement, "body");
  if (!body) throw new TmImportError("poskozeny");
  projdi(body);

  // úrovně nadpisů · Název a Nadpis 1 → #, Nadpis 2 → ##, hlubší → ###.
  // Je-li v dokumentu Název i Nadpis 1, posune se všechno pod Název o stupeň.
  const maNazev = bloky.some((b) => b.uroven === 0.5 && b.text && b.text.trim());
  const maH1 = bloky.some((b) => b.uroven === 1 && b.text && b.text.trim());
  const krize = (u) => { if (u === 0.5) return "# "; const v = maNazev && maH1 ? u + 1 : u; return v <= 1 ? "# " : v === 2 ? "## " : "### "; };
  const telo = (() => { const v = {}; let nej = 0, kt = vychoziSz; bloky.forEach((b) => { if (b.segs && b.uroven == null && b.sz) { v[b.sz] = (v[b.sz] || 0) + b.text.length; if (v[b.sz] > nej) { nej = v[b.sz]; kt = b.sz; } } }); return kt; })();

  const out = [];
  const mezera = () => { if (out.length && out[out.length - 1] !== "") out.push(""); };
  bloky.forEach((b, i) => {
    if (b.gap) { mezera(); return; }
    if (b.hotovy) { out.push(b.hotovy); return; }
    const holy = b.text.replace(/\s+/g, " ").trim();
    if (holy === "") { mezera(); return; }
    // měkké zalomení řádku uvnitř odstavce = nový řádek poznámky
    const radky = []; let cur = [];
    b.segs.forEach((s) => { if (s.t === "\n") { radky.push(cur); cur = []; } else cur.push(s); });
    radky.push(cur);
    const dalsi = (() => { for (let j = i + 1; j < bloky.length; j++) { const x = bloky[j]; if (x.segs && x.text.trim()) return x; } return null; })();
    let uroven = b.uroven;
    if (uroven == null && !b.seznam && holy.length <= 120 && !/[.;,]$/.test(holy) && dalsi) {
      const pomer = b.sz / telo;
      if (pomer >= 1.7) uroven = 1; else if (pomer >= 1.3) uroven = 2; else if (pomer >= 1.15) uroven = 3;
      else if (segsVseTucne(b.segs) && holy.length <= 90 && !/[!?:]$/.test(holy) && !segsVseTucne(dalsi.segs) && dalsi.uroven == null) uroven = 3;
      if (uroven != null) { mezera(); out.push(b.zarov + (uroven === 1 ? "# " : uroven === 2 ? "## " : "### ") + holy); return; }
    }
    if (uroven != null) { mezera(); out.push(b.zarov + krize(uroven) + holy); if (krize(uroven) === "# ") out.push(""); return; }
    const pred = out.length ? out[out.length - 1] : "";
    radky.forEach((r, ri) => {
      const t = tmSegsToMd(r);
      if (t === "") return;
      if (b.seznam) { out.push((ri === 0 ? b.seznam : "") + t); return; }
      if (b.citace) { if (ri === 0) mezera(); out.push("> " + t); return; }
      if (ri === 0 && pred !== "") mezera();
      out.push(b.zarov + t);
    });
    if (b.citace) mezera();
  });
  return uhlad(out.join("\n"));
}

// ————————————————————————————————————————————————————————————
// PDF · stránky s kousky textu → markdown poznámky
// Vstup: [{ w, h, items: [{ s, x, y, w, size, bold, italic }] }], y roste
// vzhůru (souřadnice PDF). Nadpis se pozná podle velikosti a řezu písma,
// odstavec podle mezery, odsazení a krátkého posledního řádku. Záhlaví,
// zápatí a čísla stránek se zahodí. Dva sloupce se čtou jeden po druhém.
// ————————————————————————————————————————————————————————————
const RE_PDF_ODRAZKA = /^([•●○◦▪■‣⁃∙·\-–—*\uf0b7\uf0a7\uf0d8]|\uf0fc)\s+(?=\S)/;
const RE_PDF_CISLO = /^\(?(\d{1,3})[.)]\s+(?=\S)/;
const RE_PDF_STRANA = /^[-–—\s]*(strana|str\.|page|p\.)?\s*\d{1,4}(\s*(z|ze|of|\/)\s*\d{1,4})?[-–—\s]*$/i;
const median = (a) => { if (!a.length) return 0; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

function pdfRadky(strana, pi) {
  const items = (strana.items || []).filter((it) => it && typeof it.s === "string" && it.s !== "" && it.size > 0)
    .map((it) => ({ s: it.s, x: it.x, yt: strana.h - it.y, w: it.w || 0, size: it.size, b: !!it.bold, i: !!it.italic }));
  items.sort((a, b) => (Math.abs(a.yt - b.yt) > 0.1 ? a.yt - b.yt : a.x - b.x));
  const rady = [];
  items.forEach((it) => {
    const r = rady[rady.length - 1];
    if (r && Math.abs(it.yt - r.yt) <= 0.45 * Math.max(it.size, r.size)) { r.items.push(it); if (it.s.trim().length > r.nej) { r.nej = it.s.trim().length; r.size = it.size; r.yt = it.yt; } }
    else rady.push({ yt: it.yt, size: it.size, nej: it.s.trim().length, items: [it] });
  });
  rady.forEach((r) => r.items.sort((a, b) => a.x - b.x));

  // dva sloupce · svislý pruh uprostřed stránky, který skoro žádný řádek nepřekročí
  let rez = 0;
  const texty = rady.filter((r) => r.items.some((it) => it.s.trim() !== ""));
  if (texty.length >= 12) {
    let nejSkore = 0;
    for (let x = strana.w * 0.38; x <= strana.w * 0.62; x += strana.w * 0.01) {
      let oba = 0, pres = 0;
      texty.forEach((r) => {
        let vlevo = false, vpravo = false, kriz = false;
        r.items.forEach((it) => { if (it.s.trim() === "") return; const x1 = it.x + it.w; if (x1 <= x) vlevo = true; else if (it.x >= x) vpravo = true; else kriz = true; });
        if (kriz) pres++; else if (vlevo && vpravo) oba++;
      });
      if (pres <= texty.length * 0.15 && oba >= texty.length * 0.5 && oba > nejSkore) { nejSkore = oba; rez = x; }
    }
  }
  const radekZ = (its, col) => {
    const segs = []; let pred = null;
    its.forEach((it) => {
      if (pred) {
        const mez = it.x - (pred.x + pred.w);
        // široká mezera na řádku = sloupce tabulky
        if (mez > 3 * it.size && pred.s.trim() !== "" && it.s.trim() !== "") segs.push({ t: " | " });
        else if (mez > 0.18 * it.size && !/\s$/.test(pred.s) && !/^\s/.test(it.s)) segs.push({ t: " ", b: pred.b && it.b, i: pred.i && it.i });
      }
      segs.push({ t: it.s, b: it.b, i: it.i }); pred = it;
    });
    const text = segs.map((s) => s.t).join("").replace(/\s+/g, " ").trim();
    if (text === "") return null;
    const prvni = its.find((it) => it.s.trim() !== "") || its[0];
    const posl = its.slice().reverse().find((it) => it.s.trim() !== "") || its[its.length - 1];
    let nej = 0, size = its[0].size;
    const vahy = {};
    its.forEach((it) => { const n = it.s.trim().length; const k = Math.round(it.size * 2) / 2; vahy[k] = (vahy[k] || 0) + n; if (vahy[k] > nej) { nej = vahy[k]; size = k; } });
    return { text, segs, x0: prvni.x, x1: posl.x + posl.w, yt: prvni.yt, size, tucny: segsVseTucne(segs), page: pi, col, ph: strana.h, pw: strana.w };
  };
  const out = [];
  if (!rez) { rady.forEach((r) => { const l = radekZ(r.items, 0); if (l) out.push(l); }); return out; }
  // řádky přes celou šířku (titulek) drží své místo · sloupce se čtou po úsecích mezi nimi
  let levy = [], pravy = [];
  const vylij = () => { levy.forEach((l) => out.push(l)); pravy.forEach((l) => out.push(l)); levy = []; pravy = []; };
  rady.forEach((r) => {
    const kriz = r.items.some((it) => it.s.trim() !== "" && it.x < rez && it.x + it.w > rez);
    if (kriz) { vylij(); const l = radekZ(r.items, 0); if (l) out.push(l); return; }
    const a = radekZ(r.items.filter((it) => it.x + it.w <= rez), 1); if (a) levy.push(a);
    const b = radekZ(r.items.filter((it) => it.x >= rez), 2); if (b) pravy.push(b);
  });
  vylij();
  return out;
}

// Model dokumentu · řádky bez záhlaví a zápatí + míry, podle kterých se čte
// stavba (velikost písma těla, okraje sloupců, proklad, úrovně nadpisů).
// Staví se jednou; z něj se píše celý dokument i libovolný výřez.
export function tmPdfModel(pages, jmeno) {
  const strany = pages || [];
  let radky = [];
  strany.forEach((s, pi) => { radky = radky.concat(pdfRadky(s, pi)); });
  const znaku = radky.reduce((a, l) => a + l.text.length, 0);
  if (znaku < 20) throw new TmImportError("sken", { stran: strany.length });

  // ——— záhlaví, zápatí, čísla stránek ———
  const vOkraji = (l) => l.yt < l.ph * 0.09 || l.yt > l.ph * 0.91;
  const klic = (l) => l.text.replace(/\d+/g, "#").toLowerCase() + "@" + Math.round(l.yt / 6);
  const cetnost = {};
  radky.forEach((l) => { if (vOkraji(l)) { const k = klic(l); cetnost[k] = cetnost[k] || new Set(); cetnost[k].add(l.page); } });
  const prah = Math.max(3, Math.ceil(strany.length * 0.5));
  radky = radky.filter((l) => {
    if (!vOkraji(l)) return true;
    if (RE_PDF_STRANA.test(l.text) && l.text.length <= 24) return false;
    return !(strany.length >= 3 && cetnost[klic(l)] && cetnost[klic(l)].size >= prah);
  });

  // ——— velikost písma těla textu ———
  const vahy = {}; let telo = 0, nej = 0;
  radky.forEach((l) => { vahy[l.size] = (vahy[l.size] || 0) + l.text.length; if (vahy[l.size] > nej) { nej = vahy[l.size]; telo = l.size; } });
  const vetsi = (l) => l.size >= telo * 1.15 && l.text.length <= 200;

  // ——— okraje sloupců a obvyklý proklad ———
  const sloupec = {};
  radky.forEach((l) => { const k = l.page + "/" + l.col; (sloupec[k] = sloupec[k] || []).push(l); });
  const okraj = {};
  Object.keys(sloupec).forEach((k) => {
    const t = sloupec[k].filter((l) => !vetsi(l));
    const zdroj = t.length ? t : sloupec[k];
    const x0 = zdroj.map((l) => l.x0).sort((a, b) => a - b), x1 = zdroj.map((l) => l.x1).sort((a, b) => a - b);
    okraj[k] = { levy: x0[Math.floor(x0.length * 0.1)], pravy: x1[Math.min(x1.length - 1, Math.floor(x1.length * 0.95))] };
  });
  const skoky = [];
  for (let i = 1; i < radky.length; i++) {
    const a = radky[i - 1], b = radky[i];
    if (a.page !== b.page || a.col !== b.col || vetsi(a) || vetsi(b)) continue;
    const d = b.yt - a.yt; if (d > 0.8 * telo && d < 2.2 * telo) skoky.push(d);
  }
  const proklad = median(skoky) || telo * 1.3;

  const m = { jmeno: String(jmeno || ""), radky, telo, okraj, proklad, vetsi };
  m.bloky = pdfBloky(m, radky);
  const bloky = m.bloky;
  // ——— úrovně nadpisů ———
  const velikosti = Array.from(new Set(bloky.filter((b) => b.druh === "h").map((b) => Math.round(b.size * 2) / 2))).sort((x, y) => y - x);
  const pocetNej = bloky.filter((b) => b.druh === "h" && Math.round(b.size * 2) / 2 === velikosti[0]).length;
  const jeTitul = velikosti.length > 0 && pocetNej === 1 && bloky.find((b) => b.druh === "h" && Math.round(b.size * 2) / 2 === velikosti[0]).page === 0;
  const urovenVel = (sz) => { const i = velikosti.indexOf(Math.round(sz * 2) / 2); const u = (jeTitul ? 1 : 2) + i; return Math.min(3, u); };
  const nejhlubsi = velikosti.length ? Math.min(3, (jeTitul ? 1 : 2) + velikosti.length - 1) : 1;
  const urovenTucny = Math.min(3, nejhlubsi + 1);

  m.urovenVel = urovenVel; m.urovenTucny = urovenTucny;
  m.maNadpisy = bloky.some((b) => b.druh === "h");
  return m;
}

function pdfBloky(m, radky) {
  const { okraj, proklad, vetsi } = m;
  // ——— bloky ———
  const bloky = [];      // { druh: h|p|li, segs, size, tucny, cislo, radky }
  let cur = null;
  const pridej = (l) => {
    const p = cur.segs.length ? cur.segs[cur.segs.length - 1] : null;
    const posl = cur.posledniText || "";
    const dalsi = l.text;
    if (p && /[a-záčďéěíňóřšťúůýž]-$/.test(posl) && /^[a-záčďéěíňóřšťúůýž]/.test(dalsi)) { p.t = p.t.replace(/-\s*$/, ""); }
    else if (p) cur.segs.push({ t: " ", b: p.b && l.segs[0].b, i: p.i && l.segs[0].i });
    l.segs.forEach((s) => cur.segs.push({ t: s.t, b: s.b, i: s.i }));
    cur.posledniText = l.text; cur.posledni = l; cur.radku++;
    if (!l.tucny) cur.tucny = false;
  };
  const novy = (druh, l, extra) => { cur = Object.assign({ druh, segs: [], size: l.size, tucny: l.tucny, radku: 0, prvni: l, page: l.page }, extra || {}); bloky.push(cur); pridej(l); };
  radky.forEach((l) => {
    const a = cur ? cur.posledni : null;
    const stejnyTok = a && a.page === l.page && a.col === l.col;
    const d = stejnyTok ? l.yt - a.yt : 0;
    const o = okraj[l.page + "/" + l.col];
    const sirka = Math.max(1, o.pravy - o.levy);
    if (vetsi(l)) {
      // nadpis zalomený na dva řádky zůstává jedním nadpisem
      if (cur && cur.druh === "h" && stejnyTok && Math.abs(cur.size - l.size) <= 0.5 && d <= 1.7 * l.size) { pridej(l); return; }
      novy("h", l); return;
    }
    const mo = l.text.match(RE_PDF_ODRAZKA), mc = l.text.match(RE_PDF_CISLO);
    if (mo || mc) {
      const kopie = Object.assign({}, l, { segs: l.segs.map((s) => Object.assign({}, s)) });
      let zbyva = (mo || mc)[0].length;           // značku ukroj z řezů
      kopie.segs.forEach((s) => { if (zbyva <= 0) return; const n = Math.min(zbyva, s.t.length); s.t = s.t.slice(n); zbyva -= n; });
      kopie.segs = kopie.segs.filter((s) => s.t !== ""); if (!kopie.segs.length) kopie.segs = [{ t: "" }];
      kopie.text = l.text.slice((mo || mc)[0].length);
      novy("li", kopie, { prefix: mo ? "- " : mc[1] + ". ", odsazeni: l.x0 }); cur.posledni = l; return;
    }
    if (cur && cur.druh === "li" && stejnyTok && d <= proklad * 1.35 && l.x0 > cur.odsazeni + 0.4 * l.size) { pridej(l); return; }
    let novyOdstavec = !cur || cur.druh !== "p";
    if (!novyOdstavec) {
      const kratky = a.x1 < o.pravy - 0.25 * sirka;
      const konec = /[.!?…:]["“”’)\]]*$/.test(a.text);
      if (!stejnyTok) novyOdstavec = konec || kratky || Math.abs(a.size - l.size) > 0.6;
      else if (d > proklad * 1.35 || d < 0) novyOdstavec = true;
      else if (Math.abs(a.size - l.size) > 0.6) novyOdstavec = true;
      else if (kratky && (konec || a.x1 < o.pravy - 0.5 * sirka)) novyOdstavec = true;
      else if (l.x0 > o.levy + 0.8 * l.size && a.x0 <= o.levy + 0.3 * l.size && cur.radku >= 1 && konec) novyOdstavec = true;   // odsazený první řádek
      else if (a.tucny && !l.tucny && cur.radku === 1 && a.text.length <= 100 && !/[.,;]$/.test(a.text)) novyOdstavec = true;   // tučný řádek nad textem
      else if (l.tucny && !a.tucny && konec) novyOdstavec = true;
    }
    if (novyOdstavec) novy("p", l); else pridej(l);
  });

  return bloky;
}

function pdfVypis(m, bloky) {
  const { okraj, urovenVel, urovenTucny } = m;
  const out = [];
  const mezera = () => { if (out.length && out[out.length - 1] !== "") out.push(""); };
  bloky.forEach((b, i) => {
    const holy = segsText(b.segs);
    if (holy === "") return;
    if (b.druh === "h") { const u = urovenVel(b.size); mezera(); out.push("#".repeat(u) + " " + holy); if (u === 1) out.push(""); return; }
    if (b.druh === "li") { out.push(b.prefix + tmSegsToMd(b.segs)); return; }
    const dalsi = bloky[i + 1];
    if (b.tucny && b.radku === 1 && holy.length <= 100 && !/[.,;]$/.test(holy) && dalsi && !(dalsi.druh === "p" && dalsi.tucny)) {
      mezera(); out.push("#".repeat(urovenTucny) + " " + holy); return;
    }
    // jediný řádek stojící uprostřed sloupce = zarovnání na střed
    const o = okraj[b.prvni.page + "/" + b.prvni.col], sirka = Math.max(1, o.pravy - o.levy);
    const vlevo = b.prvni.x0 - o.levy, vpravo = o.pravy - b.prvni.x1;
    const stred = b.radku === 1 && vlevo > 0.12 * sirka && Math.abs(vlevo - vpravo) < 0.04 * sirka;
    if (!(out.length && /^#{1,3} /.test(out[out.length - 1]))) mezera();
    out.push((stred ? "{^c}" : "") + tmSegsToMd(b.segs)); out.push("");
  });
  return uhlad(out.join("\n"));
}

export function tmPdfModelToMd(m) {
  const md = pdfVypis(m, m.bloky);
  const maNadpisy = /^#{1,3} /m.test(md);
  return tmSazec(md, { odstavce: false, titulek: !maNadpisy, nadpisy: !maNadpisy });
}
export function tmPdfPagesToMd(pages) { return tmPdfModelToMd(tmPdfModel(pages)); }

// ————————————————————————————————————————————————————————————
// VÝŘEZ Z PDF PODLE VLOŽENÉHO TEXTU
// Schránka z prohlížeče PDF nese jen holý text: velikost písma, tučné ani
// odstavce v ní nejsou a žádná webová aplikace je odtud nevyčte. Formát ale
// leží v souboru. Když aplikace to PDF zná, najde v něm vložený text a vezme
// si stavbu odtamtud. Hledá se bez mezer a bez ohledu na velikost písmen,
// takže jiné zalomení řádků ani ligatury nevadí.
// ————————————————————————————————————————————————————————————
const pdfNorm = (s) => String(s || "").normalize("NFKC").toLowerCase().replace(/[\s\u00ad\u200b]+/g, "");
function pdfRejstrik(m) {
  if (m.S != null) return;
  let S = ""; m.starty = [];
  m.radky.forEach((l) => { m.starty.push(S.length); S += pdfNorm(l.text); });
  m.S = S;
}
// → { zac, kon } v rejstříku m.S, nebo null
export function tmPdfFind(m, text) {
  pdfRejstrik(m);
  const P = pdfNorm(text);
  if (P.length < 24) return null;
  const k = Math.min(40, Math.floor(P.length / 2));
  // sondy na začátku a na konci · posun pro případ, že výběr začal v čísle stránky nebo záhlaví
  for (const posun of [0, 8, 20, 40]) {
    if (posun + k > P.length) break;
    const sonda = P.slice(posun, posun + k);
    for (let i = m.S.indexOf(sonda); i >= 0; i = m.S.indexOf(sonda, i + 1)) {
      const zac = Math.max(0, i - posun);
      for (const odKonce of [0, 8, 20, 40]) {
        if (odKonce + k > P.length) break;
        const konSonda = P.slice(P.length - odKonce - k, P.length - odKonce);
        const lo = Math.max(i, zac + Math.floor(P.length * 0.7) - k - odKonce - 40);
        const hi = zac + Math.ceil(P.length * 1.3) + 40;
        const j = m.S.indexOf(konSonda, lo);
        if (j >= 0 && j + k <= hi) return { zac, kon: Math.min(m.S.length, j + k + odKonce) };
      }
    }
  }
  return null;
}
// řádek oříznutý na znaky rejstříku [od, po)
function pdfOrez(l, od, po) {
  let n = 0; const segs = [];
  l.segs.forEach((s) => {
    let t = "";
    for (const ch of s.t) { const d = pdfNorm(ch).length; if (d === 0) { if (n > od && n < po) t += ch; continue; } if (n >= od && n < po) t += ch; n += d; }
    if (t !== "") segs.push({ t, b: s.b, i: s.i });
  });
  const text = segs.map((s) => s.t).join("").replace(/\s+/g, " ").trim();
  return Object.assign({}, l, { segs: segs.length ? segs : [{ t: "" }], text, tucny: segsVseTucne(segs) });
}
// vložený text → tentýž kus dokumentu se stavbou a formátem, nebo null
export function tmPdfFragmentToMd(m, text) {
  const nalez = tmPdfFind(m, text);
  if (!nalez) return null;
  let od = 0, po = m.radky.length - 1;
  for (let i = 0; i < m.starty.length; i++) { if (m.starty[i] <= nalez.zac) od = i; if (m.starty[i] < nalez.kon) po = i; }
  const vyrez = [];
  for (let i = od; i <= po; i++) {
    const zacR = m.starty[i], konR = i + 1 < m.starty.length ? m.starty[i + 1] : m.S.length;
    const l = (i === od || i === po) ? pdfOrez(m.radky[i], Math.max(0, nalez.zac - zacR), Math.min(konR, nalez.kon) - zacR) : m.radky[i];
    if (l.text !== "") vyrez.push(l);
  }
  if (!vyrez.length) return null;
  const md = pdfVypis(m, pdfBloky(m, vyrez));
  if (md === "") return null;
  return tmSazec(md, { cast: true, nadpisy: !m.maNadpisy });
}
// Paměť na naposledy čtená PDF · jen v běžící aplikaci, nikam se neukládá.
// Jednou vybrané PDF tak doplní formát i dalším kouskům, které z něj vložíš.
const PDF_PAMET = [];
export function tmPdfRemember(m) {
  if (!m || !m.radky || !m.radky.length) return;
  for (let i = PDF_PAMET.length - 1; i >= 0; i--) if (PDF_PAMET[i].jmeno === m.jmeno && PDF_PAMET[i].radky.length === m.radky.length) PDF_PAMET.splice(i, 1);
  PDF_PAMET.unshift(m);
  if (PDF_PAMET.length > 3) PDF_PAMET.length = 3;
}
export function tmPdfForget() { PDF_PAMET.length = 0; }
export function tmPdfFromMemory(text) {
  for (let i = 0; i < PDF_PAMET.length; i++) {
    const md = tmPdfFragmentToMd(PDF_PAMET[i], text);
    if (md) return { md, jmeno: PDF_PAMET[i].jmeno };
  }
  return null;
}

// ————————————————————————————————————————————————————————————
// SOUBOR → markdown poznámky
// ————————————————————————————————————————————————————————————
export function tmImportKind(file) {
  const jm = String((file && file.name) || "").toLowerCase();
  const typ = String((file && file.type) || "").toLowerCase();
  if (/\.pdf$/.test(jm) || typ === "application/pdf") return "pdf";
  if (/\.docx$/.test(jm) || typ === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (/\.(html?|xhtml)$/.test(jm) || typ === "text/html") return "html";
  if (/\.(md|markdown|txt|text)$/.test(jm) || typ === "text/plain" || typ === "text/markdown") return "text";
  if (/\.(doc|rtf|odt|pages|epub)$/.test(jm)) return "nepodporovany";
  return null;
}
function dekoduj(buffer) {
  const u8 = new Uint8Array(buffer);
  try { return new TextDecoder("utf-8", { fatal: true }).decode(u8); }
  catch { try { return new TextDecoder("windows-1250").decode(u8); } catch { return new TextDecoder("utf-8").decode(u8); } }
}
async function pdfModelZeSouboru(file, buffer, d) {
  if (!d.pdfPages) throw new TmImportError("prohlizec");
  let strany;
  try { strany = await d.pdfPages(buffer, d.onProgress); }
  catch (e) { if (e instanceof TmImportError) throw e; throw new TmImportError(e && e.name === "PasswordException" ? "heslo" : "poskozeny"); }
  const m = tmPdfModel(strany, file && file.name);
  tmPdfRemember(m);
  return m;
}
// PDF → model dokumentu, uložený do paměti pro doplnění formátu vloženého textu
export async function tmPdfFileModel(file, deps) {
  const d = deps || {};
  if (tmImportKind(file) !== "pdf") throw new TmImportError("format", { jmeno: file && file.name });
  if (file.size > TM_IMPORT_MAX_BYTES) throw new TmImportError("velky");
  return pdfModelZeSouboru(file, await file.arrayBuffer(), d);
}
// deps.pdfPages(buffer, onProgress) → stránky pro tmPdfModel (v aplikaci pdfText.js)
export async function tmFileToMd(file, deps) {
  const d = deps || {};
  const druh = tmImportKind(file);
  if (!druh || druh === "nepodporovany") throw new TmImportError("format", { jmeno: file && file.name });
  if (file.size > TM_IMPORT_MAX_BYTES) throw new TmImportError("velky");
  const buffer = await file.arrayBuffer();
  let md = "";
  if (druh === "pdf") {
    const m = await pdfModelZeSouboru(file, buffer, d);
    md = tmPdfModelToMd(m);
  } else {
    const hruby = druh === "docx" ? await tmDocxToMd(buffer) : druh === "html" ? tmHtmlToMd(dekoduj(buffer)) : tmMdNormalize(dekoduj(buffer));
    // stavbu zná zdroj · Sazeč jen dorovná, titulek hledá jen tam, kde žádný nadpis není
    const maNadpisy = /^#{1,3} /m.test(hruby);
    md = tmSazec(hruby, { odstavce: false, titulek: !maNadpisy, nadpisy: !maNadpisy });
  }
  md = uhlad(md);
  if (md === "") throw new TmImportError("prazdny");
  if (md.length > TM_IMPORT_MAX_CHARS) throw new TmImportError("dlouhy", { znaku: md.length, max: TM_IMPORT_MAX_CHARS });
  return { md, druh };
}
