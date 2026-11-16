import test from 'node:test';
import assert from 'node:assert/strict';
import { readDocumentReading, writeDocumentReading, DOCUMENT_READING_DEFAULTS, DOCUMENT_POSITIONS_KEY, readDocumentPosition, writeDocumentPosition } from '../src/shared/ui/documentReading.js';
import { readPdfOutline } from '../src/shared/product/documentOutline.js';

function store() { const data = new Map(); return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }; }
test('reading location stays separate for each attachment and owner while comfort is global', () => {
  const storage = store(), first = { id: 'one', owner: 'a', size: 100 }, second = { id: 'two', owner: 'a', size: 200 };
  writeDocumentPosition(first, { section: 12, fraction: .35, zoom: 1.75, text: 'Never persist me' }, storage);
  writeDocumentPosition(second, { section: 2, fraction: .6, zoom: 1 }, storage);
  writeDocumentReading({ mode: 'book', warmth: 65, brightness: 80 }, storage);
  assert.deepEqual(readDocumentPosition(first, storage), { section: 12, fraction: .35, zoom: 1.75 });
  assert.equal(readDocumentPosition({ ...first, owner: 'b' }, storage), null);
  assert.equal(readDocumentPosition({ ...first, size: 101 }, storage), null);
  assert.equal(readDocumentPosition(second, storage).section, 2);
  assert.equal(readDocumentReading(storage).brightness, 80);
  assert.doesNotMatch(storage.getItem(DOCUMENT_POSITIONS_KEY), /Never persist me|text/);
  writeDocumentReading(DOCUMENT_READING_DEFAULTS, storage);
  assert.equal(readDocumentPosition(first, storage).section, 12);
});
test('reading positions reject malformed values, are bounded, and do not persist unnamed attachments', () => {
  const storage = store(); storage.setItem(DOCUMENT_POSITIONS_KEY, '{bad');
  assert.equal(readDocumentPosition({ id: 'a' }, storage), null);
  writeDocumentPosition({ name: 'private title.pdf' }, { section: 1 }, storage);
  assert.equal(storage.getItem(DOCUMENT_POSITIONS_KEY), '{bad');
  for (let i = 0; i < 205; i++) writeDocumentPosition({ id: String(i) }, { section: -5, fraction: Infinity, zoom: 80 }, storage);
  assert.equal(JSON.parse(storage.getItem(DOCUMENT_POSITIONS_KEY)).length, 200);
  assert.equal(readDocumentPosition({ id: '0' }, storage), null);
  assert.deepEqual(readDocumentPosition({ id: '204' }, storage), { section: 0, fraction: 0, zoom: 2.5 });
  const unavailable = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  assert.doesNotThrow(() => writeDocumentPosition({ id: 'a' }, { section: 2 }, unavailable));
});
test('PDF chapters resolve named and page-reference destinations while ignoring remote and broken links', async () => {
  const requests = [], doc = { numPages: 20, async getOutline() { return [{ title: 'Opening', dest: [0] }, { title: 'Middle', dest: 'named', items: [{ title: 'Detail', dest: [{ num: 8, gen: 0 }] }] }, { title: 'Remote', url: 'https://example.com' }, { title: 'Broken', dest: 'broken' }, { title: 'Invalid page', dest: [999] }]; }, async getDestination(id) { requests.push(id); if (id === 'broken') throw Error('missing'); return [11]; }, async getPageIndex(ref) { return ref.num; } };
  assert.deepEqual(await readPdfOutline(doc), [{ title: 'Opening', section: 0, level: 0 }, { title: 'Middle', section: 11, level: 0 }, { title: 'Detail', section: 8, level: 1 }]);
  assert.deepEqual(requests, ['named', 'broken']);
});
test('PDF chapter lookup is bounded and respects cancellation', async () => {
  const doc = { numPages: 2000, async getOutline() { return Array.from({ length: 2000 }, (_, i) => ({ title: String(i), dest: [i] })); } };
  assert.equal((await readPdfOutline(doc)).length, 500);
  const abort = new AbortController(); abort.abort();
  await assert.rejects(readPdfOutline(doc, abort.signal), { name: 'AbortError' });
});
