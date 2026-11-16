// Lazy-loaded with the document reader, shared with the local PDF importer.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import PdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker';

export async function openDocumentPdf(buffer, signal) {
  signal?.throwIfAborted();
  const port = new PdfWorker(), worker = new pdfjs.PDFWorker({ port });
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer), worker, isEvalSupported: false, useSystemFonts: true, useWasm: false, useWorkerFetch: false, verbosity: 0 });
  let disposed = false;
  const dispose = () => {
    if (disposed) return; disposed = true;
    signal?.removeEventListener('abort', dispose);
    void task.destroy().catch(() => {}).finally(() => { worker.destroy(); port.terminate(); });
  };
  signal?.addEventListener('abort', dispose, { once: true });
  try {
    const doc = await task.promise;
    signal?.throwIfAborted();
    if (doc.numPages > 2000) throw new Error('document-limit');
    return { doc, dispose, TextLayer: pdfjs.TextLayer, pageRatios: new Map() };
  } catch (error) { dispose(); throw error; }
}
