// ————————————————————————————————————————————————————————————
// PDF · čtení stránek. Tenhle soubor se stahuje, až když někdo opravdu
// převádí PDF — knihovna pdf.js váží přes megabajt a do běžného psaní
// nepatří. Čte se v prohlížeči, ve vedlejším vlákně; soubor nikam neodchází.
// Vrací stránky pro tmPdfPagesToMd (src/textImport.js).
// ————————————————————————————————————————————————————————————
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import PdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker";
import { TmImportError } from "./textImport.js";

export const TM_PDF_MAX_PAGES = 400;

export async function tmPdfPages(buffer, onProgress) {
  const port = new PdfWorker();
  const worker = new pdfjs.PDFWorker({ port });
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), worker, useSystemFonts: false, disableFontFace: true, fontExtraProperties: true, useWasm: false, useWorkerFetch: false, verbosity: 0 });
  try {
    const doc = await task.promise;
    if (doc.numPages > TM_PDF_MAX_PAGES) throw new TmImportError("dlouhy", { stran: doc.numPages, maxStran: TM_PDF_MAX_PAGES });
    const pisma = {};      // id písma → { bold, italic }
    const strany = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const vp = page.getViewport({ scale: 1 });
      const tc = await page.getTextContent();
      // řez písma (tučné, kurzíva) je znát jen ze jména písma · to stránka
      // vydá až po rozboru kresby, takže se o něj žádá jen u nových písem
      const nezname = tc.items.some((it) => it.fontName && !pisma[it.fontName]);
      if (nezname) {
        try { await page.getOperatorList(); } catch { /* bez řezů písma se čte dál */ }
        tc.items.forEach((it) => {
          if (!it.fontName || pisma[it.fontName]) return;
          let jmeno = "";
          try { if (page.commonObjs.has(it.fontName)) { const f = page.commonObjs.get(it.fontName); jmeno = String((f && f.name) || ""); } } catch { jmeno = ""; }
          pisma[it.fontName] = { bold: /bold|black|heavy|semibold|demi/i.test(jmeno), italic: /italic|oblique/i.test(jmeno) };
        });
      }
      const items = [];
      tc.items.forEach((it) => {
        if (typeof it.str !== "string" || it.str === "") return;
        const tr = it.transform || [1, 0, 0, 1, 0, 0];
        const size = Math.hypot(tr[2], tr[3]) || it.height || 0;
        if (Math.abs(tr[1]) > Math.abs(tr[0])) return;        // text psaný na výšku (popisky na okraji)
        const p = pisma[it.fontName] || {};
        items.push({ s: it.str, x: tr[4], y: tr[5], w: it.width || 0, size, bold: !!p.bold, italic: !!p.italic });
      });
      strany.push({ w: vp.width, h: vp.height, items });
      page.cleanup();
      if (onProgress) { try { onProgress(n, doc.numPages); } catch { /* hlášení průběhu nesmí převod shodit */ } }
    }
    return strany;
  } finally {
    try { await task.destroy(); } catch { /* už zavřeno */ }
    try { worker.destroy(); } catch { /* už zavřeno */ }
    try { port.terminate(); } catch { /* už zavřeno */ }
  }
}
