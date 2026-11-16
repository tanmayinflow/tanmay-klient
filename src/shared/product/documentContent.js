import { readDocumentArchive, archivePath } from './documentArchive.js';

export const DOCUMENT_MAX_BYTES = 40 * 1024 * 1024;
const MAX_TEXT = 6000000;
const enc = new TextDecoder('utf-8');
const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const types = { pdf: 'application/pdf', epub: 'application/epub+zip', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', html: 'text/html', txt: 'text/plain', md: 'text/markdown' };
export function documentKind(file) {
  const name = String(file?.name || '').toLowerCase(), mime = String(file?.type || file?.mime || '').toLowerCase().split(';')[0];
  for (const [kind, type] of Object.entries(types)) if (name.endsWith('.' + kind) || mime === type) return kind;
  if (/\.(htm|xhtml)$/.test(name)) return 'html';
  if (/\.(text|csv|log|json|xml)$/.test(name)) return 'txt';
  if (/\.markdown$/.test(name)) return 'md';
  return null;
}
function xml(text) {
  if (text.length > MAX_TEXT || /<!ENTITY\s/i.test(text)) throw new Error('document-limit');
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('document-invalid');
  return doc;
}
const nodes = (root, name) => [...root.getElementsByTagNameNS('*', name)];
const child = (root, name) => [...(root?.children || [])].find(n => n.localName === name);
const attr = (node, name) => node?.getAttribute(name) || [...(node?.attributes || [])].find(a => a.localName === name)?.value || '';
const imageMimes = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif' };

export function documentMarkdownHtml(text) {
  const inline = value => esc(value).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>').replace(/`([^`\n]+)`/g, '<code>$1</code>');
  const output = []; let paragraph = [], code = null;
  const flush = () => { if (paragraph.length) output.push('<p>' + inline(paragraph.join('\n')) + '</p>'); paragraph = []; };
  for (const line of String(text).replace(/\r\n?/g, '\n').split('\n')) {
    if (/^\s*```/.test(line)) { flush(); if (code) { output.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>'); code = null; } else code = []; continue; }
    if (code) { code.push(line); continue; }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) { flush(); output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); }
    else if (/^\s*$/.test(line)) flush();
    else if (/^>\s?/.test(line)) { flush(); output.push('<blockquote>' + inline(line.replace(/^>\s?/, '')) + '</blockquote>'); }
    else paragraph.push(line);
  }
  flush(); if (code) output.push('<pre><code>' + esc(code.join('\n')) + '</code></pre>');
  return output.join('\n');
}

function assets(files) {
  const urls = new Map();
  return {
    image(base, target) {
      const path = archivePath(base, target), bytes = path && files[path];
      const mime = path && imageMimes[path.split('.').pop().toLowerCase()];
      if (!bytes || !mime) return '';
      if (!urls.has(path)) urls.set(path, URL.createObjectURL(new Blob([bytes], { type: mime })));
      return urls.get(path);
    },
    dispose() { for (const url of urls.values()) URL.revokeObjectURL(url); urls.clear(); },
  };
}

// Rebuild an allowlisted tree. Document styles, scripts, forms, embeds, remote
// images and event handlers never enter the application's DOM.
export function documentHtml(root, { image = () => '', base = '' } = {}) {
  let count = 0;
  const allowed = new Set('p div section article h1 h2 h3 h4 h5 h6 ul ol li dl dt dd blockquote pre code strong b em i u s sub sup small table thead tbody tfoot tr td th caption br hr figure figcaption span'.split(' '));
  const dropped = new Set('script style link meta base iframe object embed form input button textarea select audio video source'.split(' '));
  function walk(node, depth = 0) {
    if (++count > 150000 || depth > 100) throw new Error('document-limit');
    if (node.nodeType === 3) return esc(node.nodeValue);
    if (node.nodeType !== 1 && node.nodeType !== 11 && node.nodeType !== 9) return '';
    const tag = String(node.localName || '').toLowerCase();
    if (dropped.has(tag)) return '';
    if (tag === 'img' || tag === 'image') {
      const src = image(base, attr(node, 'src') || attr(node, 'href'));
      return src ? `<img src="${esc(src)}" alt="${esc(attr(node, 'alt'))}" loading="lazy" decoding="async">` : '';
    }
    const inner = [...node.childNodes].map(c => walk(c, depth + 1)).join('');
    const sourceId = node.nodeType === 1 ? attr(node, 'id') || (tag === 'a' ? attr(node, 'name') : '') : '';
    const sourceAnchor = sourceId && sourceId.length <= 240 ? ` data-document-source-id="${esc(sourceId)}"` : '';
    if (tag === 'a') {
      const href = attr(node, 'href');
      return /^https?:\/\//i.test(href) ? `<a${sourceAnchor} href="${esc(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>` : sourceAnchor ? `<span${sourceAnchor}>${inner}</span>` : inner;
    }
    if (!allowed.has(tag)) return inner;
    let extra = sourceAnchor;
    for (const name of ['colspan', 'rowspan', 'start']) {
      const value = attr(node, name);
      if (/^\d{1,3}$/.test(value) && +value > 0) extra += ` ${name}="${value}"`;
    }
    return `<${tag}${extra}>${inner}${tag === 'br' || tag === 'hr' ? '' : `</${tag}>`}`;
  }
  return walk(root);
}

async function epub(buffer, signal) {
  const files = await readDocumentArchive(buffer, () => true, signal), media = assets(files);
  try {
    const container = files['META-INF/container.xml']; if (!container) throw new Error('document-invalid');
    const root = nodes(xml(enc.decode(container)), 'rootfile')[0];
    const opfPath = archivePath('', attr(root, 'full-path'));
    if (!opfPath || !files[opfPath]) throw new Error('document-invalid');
    if (files['META-INF/encryption.xml']) {
      // Standard EPUB font obfuscation is not DRM. This reader uses the app's
      // fonts, so those font entries do not need to be decoded or loaded.
      const encryption = xml(enc.decode(files['META-INF/encryption.xml']));
      for (const encrypted of nodes(encryption, 'EncryptedData')) {
        const algorithm = attr(nodes(encrypted, 'EncryptionMethod')[0], 'Algorithm');
        const target = attr(nodes(encrypted, 'CipherReference')[0], 'URI');
        if (!['http://www.idpf.org/2008/embedding', 'http://ns.adobe.com/pdf/enc#RC'].includes(algorithm) || !/\.(otf|ttf|woff2?)(?:$|[?#])/i.test(target)) throw new Error('document-encrypted');
      }
    }
    const opf = xml(enc.decode(files[opfPath]));
    const manifest = new Map(nodes(opf, 'item').map(n => [attr(n, 'id'), { path: archivePath(opfPath, attr(n, 'href')), type: attr(n, 'media-type'), properties: attr(n, 'properties') }]));
    const sections = []; let total = 0;
    for (const reference of nodes(opf, 'itemref')) {
      signal?.throwIfAborted();
      const item = manifest.get(attr(reference, 'idref'));
      if (!item || !files[item.path] || !/^(application\/xhtml\+xml|text\/html)$/.test(item.type)) continue;
      const text = enc.decode(files[item.path]); total += text.length;
      if (total > MAX_TEXT) throw new Error('document-limit');
      let doc, body;
      if (item.type === 'text/html') {
        const template = document.createElement('template'); template.innerHTML = text;
        doc = template.content; body = doc;
      } else { doc = xml(text); body = nodes(doc, 'body')[0] || doc.documentElement; }
      const html = documentHtml(body, { image: media.image, base: item.path });
      if (html.trim()) sections.push({ title: (body.querySelector('h1,h2') || doc.querySelector('title'))?.textContent?.trim() || '', path: item.path, html });
    }
    if (!sections.length) throw new Error('document-empty');
    const navigation = [];
    const nav = [...manifest.values()].find(item => /(?:^|\s)nav(?:\s|$)/.test(item.properties));
    const ncx = [...manifest.values()].find(item => item.type === 'application/x-dtbncx+xml');
    const pushEntry = (base, href, title, level) => {
      const path = archivePath(base, href); if (!path || navigation.length >= 500) return;
      let fragment = href.includes('#') ? href.slice(href.indexOf('#') + 1) : ''; try { fragment = decodeURIComponent(fragment); } catch { /* keep literal */ }
      navigation.push({ path, fragment, title: String(title || '').trim().slice(0, 240), level });
    };
    try {
      if (nav && files[nav.path]) {
        const navDoc = xml(enc.decode(files[nav.path])), toc = nodes(navDoc, 'nav').find(node => /(?:^|\s)toc(?:\s|$)/.test(attr(node, 'type'))) || nodes(navDoc, 'nav')[0];
        for (const link of nodes(toc || navDoc, 'a').slice(0, 500)) { let level = -1; for (let p = link.parentElement; p && p !== toc; p = p.parentElement) if (p.localName === 'ol') level++; pushEntry(nav.path, attr(link, 'href'), link.textContent, Math.max(0, level)); }
      } else if (ncx && files[ncx.path]) {
        const navDoc = xml(enc.decode(files[ncx.path]));
        for (const point of nodes(navDoc, 'navPoint').slice(0, 500)) { let level = 0; for (let p = point.parentElement; p; p = p.parentElement) if (p.localName === 'navPoint') level++; pushEntry(ncx.path, attr(child(point, 'content'), 'src'), child(point, 'navLabel')?.textContent, level); }
      }
    } catch { /* Malformed optional navigation cannot prevent reading the book. */ }
    return { sections, navigation, dispose: media.dispose };
  } catch (error) { media.dispose(); throw error; }
}

async function docx(buffer, signal) {
  const files = await readDocumentArchive(buffer, n => /^word\/(document\.xml|styles\.xml|numbering\.xml|_rels\/document\.xml\.rels|media\/)/.test(n), signal);
  if (!files['word/document.xml']) throw new Error('document-invalid');
  const media = assets(files);
  try {
    const source = enc.decode(files['word/document.xml']); if (source.length > MAX_TEXT) throw new Error('document-limit');
    const doc = xml(source), styleDoc = files['word/styles.xml'] ? xml(enc.decode(files['word/styles.xml'])) : null;
    const styles = new Map(styleDoc ? nodes(styleDoc, 'style').map(n => [attr(n, 'styleId'), attr(child(n, 'name'), 'val')]) : []);
    const relations = new Map(files['word/_rels/document.xml.rels'] ? nodes(xml(enc.decode(files['word/_rels/document.xml.rels'])), 'Relationship').filter(n => attr(n, 'TargetMode') !== 'External').map(n => [attr(n, 'Id'), attr(n, 'Target')]) : []);
    const numberDoc = files['word/numbering.xml'] ? xml(enc.decode(files['word/numbering.xml'])) : null;
    const abstracts = new Map(numberDoc ? nodes(numberDoc, 'abstractNum').map(n => [attr(n, 'abstractNumId'), attr(nodes(n, 'numFmt')[0], 'val')]) : []);
    const nums = new Map(numberDoc ? nodes(numberDoc, 'num').map(n => [attr(n, 'numId'), abstracts.get(attr(child(n, 'abstractNumId'), 'val'))]) : []);
    const counters = new Map(); let count = 0;
    function walk(node, depth = 0) {
      if (++count > 150000 || depth > 100) throw new Error('document-limit');
      const name = node.localName;
      if (name === 't') return esc(node.textContent);
      if (name === 'tab') return ' ';
      if (name === 'br' || name === 'cr') return '<br>';
      if (name === 'del' || name === 'instrText' || name === 'pPr' || name === 'rPr') return '';
      if (name === 'blip' || name === 'imagedata') {
        const target = relations.get(attr(node, name === 'blip' ? 'embed' : 'id'));
        const src = target && media.image('word/document.xml', target);
        return src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : '';
      }
      let inner = [...node.children].map(n => walk(n, depth + 1)).join('');
      if (name === 'r') {
        const props = child(node, 'rPr');
        for (const [key, tag] of [['b', 'strong'], ['i', 'em'], ['strike', 's'], ['u', 'u']]) {
          const setting = child(props, key);
          if (setting && !/^(0|false|none)$/.test(attr(setting, 'val'))) inner = `<${tag}>${inner}</${tag}>`;
        }
      }
      if (name === 'p') {
        const props = child(node, 'pPr'), style = styles.get(attr(child(props, 'pStyle'), 'val')) || '';
        const level = /heading\s*(\d)/i.exec(style), outline = child(props, 'outlineLvl');
        const tag = /^title$/i.test(style) ? 'h1' : level ? `h${Math.min(6, +level[1])}` : outline ? `h${Math.min(6, +attr(outline, 'val') + 1)}` : 'p';
        const num = child(props, 'numPr'), numId = attr(child(num, 'numId'), 'val');
        if (numId && numId !== '0') {
          const key = numId + ':' + attr(child(num, 'ilvl'), 'val'), next = (counters.get(key) || 0) + 1; counters.set(key, next);
          inner = `<span aria-hidden="true">${nums.get(numId) === 'bullet' ? '•' : next + '.'} </span>` + inner;
        }
        return `<${tag}>${inner || '<br>'}</${tag}>`;
      }
      const tag = ({ tbl: 'table', tr: 'tr', tc: 'td' })[name];
      return tag ? `<${tag}>${inner}</${tag}>` : inner;
    }
    const html = walk(nodes(doc, 'body')[0] || doc.documentElement);
    if (!html.trim()) throw new Error('document-empty');
    return { sections: [{ title: '', html }], dispose: media.dispose };
  } catch (error) { media.dispose(); throw error; }
}

export async function readDocumentContent(file, signal) {
  if (file.size > DOCUMENT_MAX_BYTES) throw new Error('document-limit');
  signal?.throwIfAborted();
  const kind = documentKind(file), buffer = await file.arrayBuffer();
  signal?.throwIfAborted();
  if (kind === 'epub') return epub(buffer, signal);
  if (kind === 'docx') return docx(buffer, signal);
  let text = enc.decode(buffer); if (text.length > MAX_TEXT) throw new Error('document-limit');
  if (kind === 'html') {
    const template = document.createElement('template'); template.innerHTML = text;
    return { sections: [{ title: '', html: documentHtml(template.content) }], dispose() {} };
  }
  if (kind === 'md') return { sections: [{ title: '', html: documentMarkdownHtml(text) }], dispose() {} };
  if (kind === 'txt') return { sections: [{ title: '', text }], dispose() {} };
  throw new Error('document-unsupported');
}
