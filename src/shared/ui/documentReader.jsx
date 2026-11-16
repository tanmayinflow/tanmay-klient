import React from 'react';
import { createPortal } from 'react-dom';
import { documentKind, readDocumentContent, DOCUMENT_MAX_BYTES } from '../product/documentContent.js';
import { collectPdfText } from '../product/documentText.js';
import { useVrstva } from './overlay.jsx';
import { TmIcon } from './icons.jsx';

const readerCss = `
.tm-document-sheet{position:fixed;top:var(--tm-overlay-top,0px);left:var(--tm-overlay-left,0px);width:var(--tm-overlay-width,100vw);height:var(--tm-overlay-height,100dvh);z-index:230;overflow:hidden;color:var(--tm-doc-ink);background:var(--tm-doc-bg);font-family:var(--tm-font-body)}
.tm-document-scroll{height:100%;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y pinch-zoom}
.tm-document-content{min-height:100%;padding:calc(env(safe-area-inset-top,0px) + 52px) max(20px,env(safe-area-inset-right,0px)) calc(72px + env(safe-area-inset-bottom,0px)) max(20px,env(safe-area-inset-left,0px));box-sizing:border-box}
.tm-document-pdf .tm-document-content{padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
.tm-document-close,.tm-document-menu-toggle{position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;min-width:44px;width:44px;height:44px;padding:0;border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important;color:var(--tm-doc-ink);cursor:pointer;-webkit-user-select:none;user-select:none}
.tm-document-close{top:calc(env(safe-area-inset-top,0px) + 4px);right:max(4px,env(safe-area-inset-right,0px))}
.tm-document-pdf .tm-document-close{color:#262626;filter:drop-shadow(0 0 2px #fff)}
.tm-document-menu-toggle{bottom:calc(env(safe-area-inset-bottom,0px) + 4px);right:max(4px,env(safe-area-inset-right,0px));font:24px/1 var(--tm-font-body);text-shadow:0 0 4px var(--tm-doc-bg),0 0 8px var(--tm-doc-bg)}
.tm-document-sheet button:focus-visible,.tm-document-sheet a:focus-visible{outline:2px solid var(--tm-doc-accent);outline-offset:2px}
.tm-document-menu{position:absolute;z-index:4;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 50px);width:min(330px,calc(100% - 24px));max-height:calc(100% - 120px - env(safe-area-inset-top,0px));overflow:auto;box-sizing:border-box;padding:12px;border:1px solid var(--tm-doc-border);border-radius:12px;background:var(--tm-doc-bg);box-shadow:0 8px 28px #0002}
.tm-document-menu-title{font-size:12px;overflow-wrap:anywhere;margin:2px 6px 8px;opacity:.8;line-height:1.4}
.tm-document-tools{display:flex;align-items:center;flex-wrap:wrap;gap:4px}
.tm-document-tools button,.tm-document-tools a,.tm-document-copy-tools button{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 10px;color:var(--tm-doc-accent);background:transparent;border:0;border-radius:6px;font:14px var(--tm-font-body);cursor:pointer;text-decoration:none}
.tm-document-tools button:disabled{opacity:.4;cursor:default}.tm-document-tools .tm-document-command{justify-content:flex-start;flex:1 1 100%}
.tm-document-tools select{min-height:44px;min-width:0;max-width:100%;flex:1;color:inherit;background:transparent;border:1px solid var(--tm-doc-border);border-radius:6px;font:14px var(--tm-font-body);padding:6px}
.tm-document-tools input{width:4em;min-height:40px;text-align:center;border:1px solid var(--tm-doc-border);border-radius:6px;background:transparent;color:inherit;font:16px var(--tm-font-body);padding:4px}
.tm-document-prose{max-width:68ch;margin:0 auto;line-height:1.75;font-size:17px;overflow-wrap:anywhere;-webkit-user-select:text;user-select:text}.tm-document-prose+.tm-document-prose{padding-top:2.5em}
.tm-document-prose :is(h1,h2,h3,h4,h5,h6){font-family:var(--tm-font-display);line-height:1.2;font-weight:400;margin:1.4em 0 .6em}
.tm-document-prose h1{font-size:2em}.tm-document-prose h2{font-size:1.6em}.tm-document-prose h3{font-size:1.35em}
.tm-document-prose p{margin:0 0 1.1em}.tm-document-prose img{display:block;max-width:100%;height:auto;max-height:80vh;object-fit:contain;margin:1.2em auto}
.tm-document-prose a{color:var(--tm-doc-accent);text-underline-offset:.18em}.tm-document-prose table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;margin:1em 0}
.tm-document-prose td,.tm-document-prose th{padding:8px;border:1px solid var(--tm-doc-border);min-width:5em}.tm-document-prose :is(pre,code){white-space:pre-wrap;overflow-wrap:anywhere}
.tm-document-prose blockquote{margin:1em 0;padding:0 1em;font-style:italic}.tm-document-text{white-space:pre-wrap}
.tm-document-page{position:relative;margin:0 auto 8px;overflow:visible;width:max-content;min-width:100%}.tm-document-paper{position:relative;margin:0 auto;width:max-content;background:white;color:#171717}.tm-document-paper canvas{display:block}
.tm-document-page-status{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:20px;line-height:1.6;max-width:60ch;text-align:center}
.tm-document-message{padding:64px 20px 20px;line-height:1.6;max-width:60ch;margin:auto}.tm-document-caption{font-size:12px;opacity:.8;margin:4px 0 16px;text-align:center}
.tm-document-copy-tools{position:absolute;z-index:3;bottom:calc(env(safe-area-inset-bottom,0px) + 6px);left:50%;transform:translateX(-50%);max-width:calc(100% - 100px);display:flex;align-items:center;flex-wrap:wrap;justify-content:center;background:var(--tm-doc-bg);border:1px solid var(--tm-doc-border);border-radius:8px;box-shadow:0 3px 14px #0001}
/* Selectable glyphs follow the original PDF page, including rotation. */
.tm-document-text-layer{position:absolute;inset:0;overflow:clip;text-align:initial;line-height:1;letter-spacing:normal;word-spacing:normal;-webkit-text-size-adjust:none;text-size-adjust:none;forced-color-adjust:none;transform-origin:0 0;--min-font-size:1;--text-scale-factor:calc(var(--total-scale-factor) * var(--min-font-size));--min-font-size-inv:calc(1 / var(--min-font-size));--scale-round-x:1px;--scale-round-y:1px}
.tm-document-text-layer :is(span,br){color:transparent;position:absolute;white-space:pre;cursor:text;transform-origin:0% 0%;-webkit-user-select:text;user-select:text}
.tm-document-text-layer>:not(.markedContent),.tm-document-text-layer .markedContent span:not(.markedContent){z-index:1;--font-height:0;font-size:calc(var(--text-scale-factor)*var(--font-height));--scale-x:1;--rotate:0deg;transform:rotate(var(--rotate)) scaleX(var(--scale-x)) scale(var(--min-font-size-inv))}
.tm-document-text-layer .markedContent{display:contents}.tm-document-text-layer ::selection{background:rgba(71,115,175,.3)}
@media(max-width:600px){.tm-document-prose{font-size:16px}.tm-document-caption{text-align:left}}
`;

function selectContents(element) {
  if (!element) return;
  const selection = window.getSelection(), range = document.createRange();
  range.selectNodeContents(element); selection.removeAllRanges(); selection.addRange(range);
}

function PdfPage({ model, number, zoom, scroll, onGeometry, L }) {
  const host = React.useRef(null), canvas = React.useRef(null), layer = React.useRef(null);
  const [width, setWidth] = React.useState(320), [shape, setShape] = React.useState(() => model.pageRatios.get(number) || model.pageRatios.get(1) || .707), [active, setActive] = React.useState(number === 1);
  const [error, setError] = React.useState(''), [busy, setBusy] = React.useState(true);
  React.useLayoutEffect(() => {
    const parent = scroll.current; if (!parent) return;
    const measure = () => setWidth(Math.max(200, Math.min(1200, parent.clientWidth))); measure();
    const observer = new ResizeObserver(measure); observer.observe(parent); return () => observer.disconnect();
  }, [scroll]);
  React.useLayoutEffect(() => { onGeometry(); }, [width, shape, zoom, onGeometry]);
  React.useEffect(() => {
    if (!window.IntersectionObserver) { setActive(true); return; }
    const observer = new IntersectionObserver(entries => setActive(entries[0].isIntersecting), { root: scroll.current, rootMargin: '900px 0px' });
    observer.observe(host.current); return () => observer.disconnect();
  }, [scroll]);
  React.useEffect(() => {
    if (!active) return;
    let gone = false, task, textLayer;
    const visible = canvas.current, textHost = layer.current;
    setBusy(true); setError(''); textHost.replaceChildren();
    (async () => {
      try {
        const page = await model.doc.getPage(number); if (gone) return;
        const natural = page.getViewport({ scale: 1 }), ratioOfSides = natural.width / natural.height;
        model.pageRatios.set(number, ratioOfSides); setShape(ratioOfSides);
        const viewport = page.getViewport({ scale: width / natural.width * zoom });
        const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(6000000 / (viewport.width * viewport.height)));
        const target = document.createElement('canvas');
        target.width = Math.ceil(viewport.width * ratio); target.height = Math.ceil(viewport.height * ratio);
        task = page.render({ canvas: target, canvasContext: target.getContext('2d'), viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
        await task.promise; if (gone) { target.width = target.height = 0; return; }
        visible.width = target.width; visible.height = target.height;
        visible.style.width = `${viewport.width}px`; visible.style.height = `${viewport.height}px`;
        visible.getContext('2d').drawImage(target, 0, 0); target.width = target.height = 0;
        const content = await page.getTextContent(); if (gone) return;
        textHost.style.setProperty('--total-scale-factor', String(viewport.scale));
        textLayer = new model.TextLayer({ textContentSource: content, container: textHost, viewport });
        await textLayer.render();
      } catch (e) {
        if (!gone && e.name !== 'RenderingCancelledException' && e.name !== 'AbortException') setError(L('Stránku se nepodařilo zobrazit. Původní soubor najdeš v nabídce dole.', 'This page could not be displayed. The original file is in the menu below.'));
      } finally { if (!gone) setBusy(false); }
    })();
    return () => {
      gone = true; task?.cancel(); textLayer?.cancel(); textHost.replaceChildren();
      visible.width = visible.height = 0;
      // The worker owns shared page resources; document disposal releases them
      // after visible-page rendering and whole-document extraction finish.
    };
  }, [model, number, width, zoom, active, L]);
  return <section ref={host} data-document-part={number - 1} className="tm-document-page" aria-label={L(`Strana ${number}`, `Page ${number}`)} style={{ height: width * zoom / shape }}>
    {active && busy && <p role="status" className="tm-document-page-status">{L('Načítám stránku…', 'Loading page…')}</p>}
    {error && <p role="alert" className="tm-document-page-status">{error}</p>}
    <div className="tm-document-paper" style={{ visibility: busy || error || !active ? 'hidden' : 'visible' }}><canvas ref={canvas} width={0} height={0} aria-hidden="true"/><div ref={layer} className="tm-document-text-layer"/></div>
  </section>;
}

export function createDocumentReader({ useT, L, getBlob }) {
  return function DocumentReader({ attachment, fallbackUrl, onClose }) {
    const { t } = useT();
    const [model, setModel] = React.useState(null), [failure, setFailure] = React.useState(''), [download, setDownload] = React.useState('');
    const [index, setIndex] = React.useState(0), [zoom, setZoom] = React.useState(1), [menuOpen, setMenuOpen] = React.useState(false);
    const [retry, setRetry] = React.useState(0), [copyText, setCopyText] = React.useState(null), [copyBusy, setCopyBusy] = React.useState(false), [notice, setNotice] = React.useState('');
    const root = React.useRef(null), scroll = React.useRef(null), content = React.useRef(null), menu = React.useRef(null), textCopy = React.useRef(null), copyController = React.useRef(null), viewAnchor = React.useRef(null);
    const restoreAnchor = React.useCallback(() => {
      const anchor = viewAnchor.current, viewport = scroll.current;
      if (!anchor || !viewport) return;
      const page = viewport.querySelector(`[data-document-part="${anchor.index}"]`);
      if (page) { const rect = page.getBoundingClientRect(), delta = rect.top - viewport.getBoundingClientRect().top + rect.height * anchor.fraction; if (Math.abs(delta) > .5) viewport.scrollTop += delta; }
    }, []);
    const kind = documentKind(attachment), isPdf = kind === 'pdf' && copyText == null;
    useVrstva({ close: onClose, ref: root });
    React.useEffect(() => {
      const controller = new AbortController(); let loaded, url;
      viewAnchor.current = null;
      setFailure(''); setModel(null); setIndex(0); setDownload(''); setCopyText(null); setZoom(1); setCopyBusy(false); setNotice(''); setMenuOpen(false);
      (async () => {
        try {
          if (attachment.size > DOCUMENT_MAX_BYTES) throw new Error('document-limit');
          const blob = await getBlob(attachment, controller.signal); controller.signal.throwIfAborted();
          if (!blob || blob.size > DOCUMENT_MAX_BYTES) throw new Error('document-limit');
          url = URL.createObjectURL(blob); setDownload(url);
          const file = new File([blob], attachment.name || 'document', { type: attachment.type || blob.type });
          if (kind === 'pdf') {
            const { openDocumentPdf } = await import('../product/documentPdf.js'); controller.signal.throwIfAborted();
            loaded = await openDocumentPdf(await file.arrayBuffer(), controller.signal);
          } else loaded = await readDocumentContent(file, controller.signal);
          controller.signal.throwIfAborted(); setModel(loaded);
        } catch (error) {
          if (controller.signal.aborted) { loaded?.dispose(); return; }
          const code = error.kod || error.message;
          setFailure(error.name === 'PasswordException' || /encrypted/.test(code) ? L('Dokument je chráněný heslem nebo DRM. Stáhni ho a otevři ve své čtečce.', 'This document has password or DRM protection. Download it and open it in your reader.') : /limit/.test(code) ? L('Dokument je pro tuto čtečku příliš velký. Stáhni původní soubor.', 'This document is too large for this reader. Download the original file.') : L('Dokument se nepodařilo otevřít. Zkus to znovu online, nebo stáhni původní soubor.', 'The document could not be opened. Try again online or download the original file.'));
        }
      })();
      return () => { controller.abort(); copyController.current?.abort(); loaded?.dispose(); if (url) URL.revokeObjectURL(url); };
    }, [attachment.id, retry]);
    React.useEffect(() => {
      if (!menuOpen) return;
      const outside = e => { if (!menu.current?.contains(e.target) && !e.target.closest?.('.tm-document-menu-toggle')) setMenuOpen(false); };
      document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
    }, [menuOpen]);
    React.useLayoutEffect(() => { if (copyText != null) { scroll.current.scrollTop = 0; selectContents(textCopy.current); } }, [copyText]);
    React.useLayoutEffect(() => { restoreAnchor(); }, [zoom, restoreAnchor]);
    const count = model?.doc?.numPages || model?.sections?.length || 0;
    const go = n => {
      if (!Number.isFinite(n) || !count) return;
      const next = Math.min(count - 1, Math.max(0, Math.trunc(n)));
      viewAnchor.current = { index: next, fraction: 0 };
      setIndex(next); restoreAnchor();
    };
    const changeZoom = delta => {
      const viewport = scroll.current, page = viewport?.querySelector(`[data-document-part="${index}"]`);
      if (page) { const rect = page.getBoundingClientRect(); viewAnchor.current = { index, fraction: Math.max(0, (viewport.getBoundingClientRect().top - rect.top) / rect.height) }; }
      setZoom(z => Math.min(2.5, Math.max(1, z + delta)));
    };
    const trackPage = () => {
      if (copyText != null || !scroll.current) return;
      const top = scroll.current.getBoundingClientRect().top + 80;
      const parts = content.current?.querySelectorAll('[data-document-part]') || [];
      let low = 0, high = parts.length - 1;
      while (low < high) { const middle = (low + high) >> 1; if (parts[middle].getBoundingClientRect().bottom > top) high = middle; else low = middle + 1; }
      if (parts[low]) setIndex(+parts[low].dataset.documentPart);
    };
    const selectAll = async () => {
      setMenuOpen(false); setNotice('');
      if (!model?.doc) { selectContents(content.current); return; }
      if (copyText != null) { selectContents(textCopy.current); return; }
      const controller = new AbortController(); copyController.current?.abort(); copyController.current = controller; setCopyBusy(true);
      try {
        const text = await collectPdfText(model.doc, { signal: controller.signal });
        if (text.trim()) setCopyText(text);
        else setNotice(L('Tento PDF soubor obsahuje obrázky bez textové vrstvy.', 'This PDF contains images without a text layer.'));
      } catch (error) {
        if (!controller.signal.aborted) setNotice(/limit/.test(error.message) ? L('Celý text je příliš dlouhý. Vyber část přímo na stránce.', 'The complete text is too long. Select a section directly on the page.') : L('Text se nepodařilo načíst. Zkus vybrat část přímo na stránce.', 'The text could not be read. Try selecting a section directly on the page.'));
      } finally { if (!controller.signal.aborted) setCopyBusy(false); }
    };
    const copyAll = async () => {
      try { await navigator.clipboard.writeText(copyText); setNotice(L('Zkopírováno.', 'Copied.')); }
      catch { selectContents(textCopy.current); setNotice(L('Text je vybraný. Použij nabídku Kopírovat.', 'The text is selected. Use the Copy command.')); }
    };
    const returnToPages = () => { window.getSelection()?.removeAllRanges(); setCopyText(null); setNotice(''); requestAnimationFrame(() => go(index)); };
    return createPortal(<div ref={root} role="dialog" aria-modal="true" aria-label={attachment.name || L('Dokument', 'Document')} className={`tm-document-sheet${isPdf ? ' tm-document-pdf' : ''}`} data-tm-reading="document" onKeyDownCapture={e => { if (e.key === 'Escape' && menuOpen) { e.preventDefault(); e.stopPropagation(); setMenuOpen(false); } }} style={{ '--tm-doc-ink': t.text, '--tm-doc-accent': t.accentInk || t.accent, '--tm-doc-border': t.borderSoft, '--tm-doc-bg': t.bg }}>
      <style>{readerCss}</style>
      <div className="tm-document-scroll tm-scroll" ref={scroll} onScroll={trackPage} onPointerDownCapture={() => { viewAnchor.current = null; }} onWheel={() => { viewAnchor.current = null; }} onKeyDown={e => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) viewAnchor.current = null; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { e.preventDefault(); void selectAll(); } }} tabIndex={0} aria-label={L('Obsah dokumentu', 'Document content')}>
        <div className="tm-document-content" ref={content}>
          {!model && !failure && <p role="status" className="tm-document-message">{L('Otevírám dokument…', 'Opening document…')}</p>}
          {failure && <div className="tm-document-message" role="alert"><p>{failure}</p><button type="button" onClick={() => setRetry(n => n + 1)}>{L('Zkusit znovu', 'Try again')}</button></div>}
          {copyText != null ? <article ref={textCopy} className="tm-document-prose tm-document-text" aria-label={L('Text celého dokumentu', 'Complete document text')}>{copyText}</article> : model?.doc ? Array.from({ length: count }, (_, i) => <PdfPage key={i} model={model} number={i + 1} zoom={zoom} scroll={scroll} onGeometry={restoreAnchor} L={L}/>) : model?.sections?.map((section, i) => section.html != null ? <article key={i} data-document-part={i} className="tm-document-prose" dangerouslySetInnerHTML={{ __html: section.html }}/> : <article key={i} data-document-part={i} className="tm-document-prose tm-document-text">{section.text}</article>)}
        </div>
      </div>
      <button type="button" className="tm-document-close" onClick={onClose} title={L('Zavřít dokument', 'Close document')} aria-label={L('Zavřít dokument', 'Close document')}><TmIcon id="close" size={19}/></button>
      <button type="button" className="tm-document-menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={L('Nástroje dokumentu', 'Document tools')}>⋯</button>
      {menuOpen && <div className="tm-document-menu" ref={menu} role="group" aria-label={L('Nástroje dokumentu', 'Document tools')}><div className="tm-document-menu-title">{attachment.name}</div><div className="tm-document-tools">
        {count > 1 && copyText == null && <><button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label={L('Předchozí stránka', 'Previous page')}><TmIcon id="prev" size={18}/></button>
          {kind === 'pdf' ? <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><input aria-label={L('Strana', 'Page')} type="number" min="1" max={count} value={index + 1} onChange={e => { if (e.target.value) go(Number(e.target.value) - 1); }}/><span>/ {count}</span></label> : <select aria-label={L('Kapitola', 'Chapter')} value={index} onChange={e => go(+e.target.value)}>{model.sections.map((section, i) => <option key={i} value={i}>{section.title || L(`Část ${i + 1}`, `Part ${i + 1}`)}</option>)}</select>}
          <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label={L('Další stránka', 'Next page')}><TmIcon id="next" size={18}/></button></>}
        {isPdf && model && <><button type="button" onClick={() => changeZoom(-.25)} disabled={zoom === 1} aria-label={L('Zmenšit', 'Zoom out')}><TmIcon id="remove" size={17}/></button><span>{Math.round(zoom * 100)}%</span><button type="button" onClick={() => changeZoom(.25)} disabled={zoom === 2.5} aria-label={L('Zvětšit', 'Zoom in')}><TmIcon id="add" size={17}/></button></>}
        {model && <button type="button" className="tm-document-command" disabled={copyBusy} onClick={selectAll}>{L('Vybrat vše', 'Select all')}</button>}
        {(download || fallbackUrl) && <a className="tm-document-command" href={download || fallbackUrl} download={attachment.name}><TmIcon id="download" size={17}/>{L('Stáhnout původní soubor', 'Download original file')}</a>}
        {kind === 'docx' && <p className="tm-document-caption">{L('Zobrazení pro čtení. Přesnou sazbu zachovává původní soubor.', 'Reading view. The original file preserves the exact layout.')}</p>}
      </div></div>}
      {(copyText != null || copyBusy || notice) && <div className="tm-document-copy-tools">
        {copyBusy ? <><span role="status" style={{ fontSize: 12, padding: 8 }}>{L('Načítám celý text…', 'Reading all text…')}</span><button type="button" onClick={() => { copyController.current?.abort(); setCopyBusy(false); }}>{L('Zrušit', 'Cancel')}</button></> : <>
          {copyText != null && <><button type="button" onPointerDown={e => e.preventDefault()} onClick={copyAll}>{L('Kopírovat vše', 'Copy all')}</button><button type="button" onClick={returnToPages}>{L('Zpět k dokumentu', 'Back to document')}</button></>}
          {notice && <span role="status" style={{ fontSize: 12, padding: 8 }}>{notice}</span>}
        </>}
      </div>}
    </div>, document.body);
  };
}
