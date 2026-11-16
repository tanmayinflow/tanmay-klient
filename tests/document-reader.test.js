import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { readDocumentArchive, archivePath, ARCHIVE_LIMITS } from '../src/shared/product/documentArchive.js';
import { documentKind, documentMarkdownHtml } from '../src/shared/product/documentContent.js';
import { collectPdfText, pdfPageText } from '../src/shared/product/documentText.js';

function zip(entries) {
  const local = [], central = []; let offset = 0;
  for (const item of entries) {
    const name = Buffer.from(item.name), body = Buffer.from(item.body || ''), method = item.method || 0;
    const compressed = method === 8 ? deflateRawSync(body) : body;
    const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(method, 8); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(body.length, 22); header.writeUInt16LE(name.length, 26);
    const record = Buffer.alloc(46); record.writeUInt32LE(0x02014b50); record.writeUInt16LE(item.flags || 0, 8); record.writeUInt16LE(method, 10); record.writeUInt32LE(compressed.length, 20); record.writeUInt32LE(item.declared ?? body.length, 24); record.writeUInt16LE(name.length, 28); record.writeUInt32LE(offset, 42);
    local.push(header, name, compressed); central.push(record, name); offset += 30 + name.length + compressed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

test('document types include EPUB, DOCX, PDF and readable text without guessing binary types', () => {
  assert.equal(documentKind({ name: 'Book.EPUB' }), 'epub');
  assert.equal(documentKind({ type: 'application/pdf' }), 'pdf');
  assert.equal(documentKind({ mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), 'docx');
  assert.equal(documentKind({ name: 'table.csv' }), 'txt');
  assert.equal(documentKind({ name: 'report.exe' }), null);
});
test('Markdown files cannot load private app images, remote embeds, or executable HTML', () => {
  const html = documentMarkdownHtml('# Title\n\n!img(private-file|320)\n!gd(https://drive.google.com/file/d/id/view|340)\n<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n\n**bold**');
  assert.match(html, /<h1>Title<\/h1>/); assert.match(html, /<strong>bold<\/strong>/);
  assert.doesNotMatch(html, /<(img|iframe|script)\b/); assert.match(html, /&lt;script&gt;/);
});
test('archive references stay in the archive and reject external URLs and traversal', () => {
  assert.equal(archivePath('OPS/book.opf', '../images/cover.png'), 'images/cover.png');
  assert.equal(archivePath('OPS/chapter.xhtml', 'picture%20one.png#id'), 'OPS/picture one.png');
  for (const path of ['../../outside.png', '//example.com/a.png', 'https://example.com/a.png', 'data:image/png;base64,x', 'file:///x', '..\\outside.png', '%00x']) assert.equal(archivePath('OPS/book.opf', path), null, path);
});
test('stored and compressed entries are read selectively and independently', async () => {
  const result = await readDocumentArchive(zip([{ name: 'content.xhtml', body: '<p>Hello</p>', method: 8 }, { name: 'ignore', body: 'other' }]), n => n.endsWith('.xhtml'));
  assert.deepEqual(Object.keys(result), ['content.xhtml']);
  assert.equal(new TextDecoder().decode(result['content.xhtml']), '<p>Hello</p>');
});
test('oversized archive declarations are rejected before decompression', async () => {
  await assert.rejects(readDocumentArchive(zip([{ name: 'bomb', body: 'x', method: 8, declared: ARCHIVE_LIMITS.entryBytes + 1 }])), /archive-limit/);
});
test('decompression cannot exceed even a forged small declared size', async () => {
  await assert.rejects(readDocumentArchive(zip([{ name: 'bomb', body: 'x'.repeat(200000), method: 8, declared: 1 }])), /archive-limit/);
});
test('truncated and duplicate entries fail without partial success', async () => {
  const good = zip([{ name: 'a', body: 'ok' }]);
  await assert.rejects(readDocumentArchive(good.subarray(0, good.length - 3)), /archive-/);
  await assert.rejects(readDocumentArchive(zip([{ name: 'a', body: 'x' }, { name: 'a', body: 'y' }])), /archive-invalid/);
});
test('encrypted ZIPs and cancelled loads do not render', async () => {
  await assert.rejects(readDocumentArchive(zip([{ name: 'a', body: 'x', flags: 1 }])), /archive-encrypted/);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(readDocumentArchive(zip([{ name: 'a', body: 'x' }]), () => true, controller.signal), { name: 'AbortError' });
});

test('whole-document PDF selection preserves page order, line breaks and excludes marked-content tokens', async () => {
  const requested = [];
  const pdf = { numPages: 2, async getPage(number) { requested.push(number); return { async getTextContent() { return { items: number === 1 ? [{ type: 'beginMarkedContent' }, { str: 'First line', hasEOL: true }, { str: 'Second line', hasEOL: true }] : [{ str: 'Last page' }] }; } }; } };
  assert.equal(await collectPdfText(pdf), 'First line\nSecond line\n\nLast page');
  assert.deepEqual(requested, [1, 2]);
  assert.equal(pdfPageText({ items: [{ str: '' }, { type: 'endMarkedContent' }] }), '');
});
test('whole-document PDF selection rejects oversized or incomplete text instead of returning a partial selection', async () => {
  const requested = [];
  const pdf = { numPages: 3, async getPage(number) { requested.push(number); return { async getTextContent() { return { items: [{ str: 'long page text' }] }; } }; } };
  await assert.rejects(collectPdfText(pdf, { limit: 20 }), /document-text-limit/);
  assert.deepEqual(requested, [1, 2]);
  const broken = { numPages: 2, async getPage(number) { if (number === 2) throw new Error('unreadable-page'); return { async getTextContent() { return { items: [{ str: 'Valid first page' }] }; } }; } };
  await assert.rejects(collectPdfText(broken), /unreadable-page/);
});
test('whole-document PDF selection stops after cancellation and never requests the next page', async () => {
  const controller = new AbortController(), requested = [];
  const pdf = { numPages: 3, async getPage(number) { requested.push(number); return { async getTextContent() { controller.abort(); return { items: [{ str: 'Page' }] }; } }; } };
  await assert.rejects(collectPdfText(pdf, { signal: controller.signal }), { name: 'AbortError' });
  assert.deepEqual(requested, [1]);
});
