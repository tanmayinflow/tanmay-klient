export const DOCUMENT_TEXT_LIMIT = 6000000;

export function pdfPageText(content) {
  return content.items.map(item => typeof item.str === 'string' ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim();
}

// Reading a whole PDF is explicit and cancellable; never silently copy only a
// prefix when the user asked for the entire document.
export async function collectPdfText(pdf, { signal, limit = DOCUMENT_TEXT_LIMIT, onProgress } = {}) {
  const parts = []; let size = 0;
  for (let number = 1; number <= pdf.numPages; number++) {
    signal?.throwIfAborted();
    const page = await pdf.getPage(number);
    signal?.throwIfAborted();
    const content = await page.getTextContent();
    signal?.throwIfAborted();
    const text = pdfPageText(content);
    size += text.length + (number > 1 ? 2 : 0);
    if (size > limit) throw new Error('document-text-limit');
    parts.push(text);
    onProgress?.(number, pdf.numPages);
  }
  return parts.join('\n\n');
}
