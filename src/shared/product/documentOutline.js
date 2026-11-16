// Work on the already-sanitized reading tree. Targets are generated locally;
// imported ids never become global DOM ids or executable links.
export function prepareDocumentChapters(sections, navigation = []) {
  const headings = [], targets = new Map();
  const prepared = sections.map((section, index) => {
    if (section.html == null) return section;
    const template = document.createElement('template'); template.innerHTML = section.html;
    let ordinal = 0;
    for (const node of template.content.querySelectorAll('[data-document-source-id],h1,h2,h3,h4,h5,h6')) {
      const anchor = `part-${index}-${ordinal++}`; node.setAttribute('data-document-anchor', anchor);
      const original = node.getAttribute('data-document-source-id');
      if (original) { targets.set(`${section.path || index}#${original}`, { section: index, anchor }); node.removeAttribute('data-document-source-id'); }
      if (/^H[1-6]$/.test(node.tagName) && node.textContent.trim()) headings.push({ title: node.textContent.trim().slice(0, 240), section: index, anchor, level: +node.tagName[1] - 1 });
    }
    return { ...section, html: template.innerHTML };
  });
  const toc = navigation.slice(0, 500).flatMap(entry => {
    const section = sections.findIndex(part => part.path === entry.path);
    if (section < 0 || !entry.title) return [];
    return [{ title: entry.title.slice(0, 240), ...(targets.get(`${entry.path}#${entry.fragment}`) || { section }), level: Math.min(6, entry.level || 0) }];
  });
  // EPUB nav/NCX is authoritative when present. Other formats use real headings.
  const fallback = sections.flatMap((section, index) => {
    const found = headings.filter(item => item.section === index);
    return found.length ? found : sections.length > 1 ? [{ title: section.title || '', section: index, level: 0 }] : [];
  });
  return { sections: prepared, toc: toc.length ? toc : fallback.slice(0, 500) };
}

// PDF.js resolves named and explicit destinations without opening outline URLs.
export async function readPdfOutline(doc, signal) {
  signal?.throwIfAborted();
  const nodes = await doc.getOutline(), result = []; let visited = 0;
  async function walk(items, level) {
    for (const item of items || []) {
      signal?.throwIfAborted(); if (++visited > 500 || level > 12) return;
      try {
        const dest = typeof item.dest === 'string' ? await doc.getDestination(item.dest) : item.dest;
        if (Array.isArray(dest) && dest.length) {
          const section = Number.isInteger(dest[0]) ? dest[0] : await doc.getPageIndex(dest[0]);
          if (section >= 0 && section < doc.numPages && item.title) result.push({ title: String(item.title).slice(0, 240), section, level: Math.min(6, level) });
        }
      } catch (error) { if (signal?.aborted) throw error; /* A broken bookmark must not hide valid chapters. */ }
      await walk(item.items, level + 1);
    }
  }
  await walk(nodes, 0); signal?.throwIfAborted(); return result;
}
