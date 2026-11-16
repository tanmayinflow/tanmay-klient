import React from 'react';
import { createPortal } from 'react-dom';
import { documentKind, readDocumentContent, DOCUMENT_MAX_BYTES } from '../product/documentContent.js';
import { collectPdfText } from '../product/documentText.js';
import { prepareDocumentChapters, readPdfOutline } from '../product/documentOutline.js';
import { useVrstva } from './overlay.jsx';
import { TmIcon } from './icons.jsx';
import { DocumentBookText, useDocumentBookGestures } from './documentBook.jsx';
import { readDocumentReading, writeDocumentReading, documentReadingPalette, readDocumentPosition, writeDocumentPosition, DOCUMENT_READING_DEFAULTS } from './documentReading.js';

const readerCss = `
.tm-document-sheet{position:fixed;top:var(--tm-overlay-top,0px);left:var(--tm-overlay-left,0px);width:var(--tm-overlay-width,100vw);height:var(--tm-overlay-height,100dvh);z-index:230;overflow:hidden;color:var(--tm-doc-ink);background:var(--land-nav-bg,#242321);background-image:var(--land-nav-material,none);background-size:768px auto;font-family:var(--tm-font-body)}
.tm-document-scroll{height:100%;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y pinch-zoom}
.tm-document-content{min-height:100%;max-width:840px;margin-inline:auto;background:var(--tm-doc-bg);padding:calc(env(safe-area-inset-top,0px) + 52px) max(20px,env(safe-area-inset-right,0px)) calc(72px + env(safe-area-inset-bottom,0px)) max(20px,env(safe-area-inset-left,0px));box-sizing:border-box}
.tm-document-pdf .tm-document-content{max-width:none;background:transparent;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
.tm-document-close,.tm-document-menu-toggle{position:absolute;z-index:3;display:flex;align-items:center;justify-content:center;min-width:44px;width:44px;height:44px;padding:0;border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important;color:var(--tm-doc-ink);cursor:pointer;-webkit-user-select:none;user-select:none}
.tm-document-close{top:calc(env(safe-area-inset-top,0px) + 4px);right:max(4px,env(safe-area-inset-right,0px))}
.tm-document-close{color:var(--tm-nav-text,#eee6d7);filter:drop-shadow(0 0 2px #242321)}
.tm-document-pdf .tm-document-close{color:var(--tm-nav-text,#eee6d7);filter:drop-shadow(0 0 2px #242321)}
.tm-document-sheet[data-reading-background="night"] .tm-document-close{color:var(--tm-doc-ink);filter:none}
.tm-document-menu-toggle{bottom:calc(env(safe-area-inset-bottom,0px) + 4px);right:max(4px,env(safe-area-inset-right,0px));font:24px/1 var(--tm-font-body);color:var(--tm-nav-text,#eee6d7);text-shadow:0 0 4px #242321}
.tm-document-sheet button:focus-visible,.tm-document-sheet a:focus-visible{outline:2px solid var(--tm-doc-accent);outline-offset:2px}
.tm-document-menu{position:absolute;z-index:4;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 50px);width:min(350px,calc(100% - 24px));max-height:calc(100% - 120px - env(safe-area-inset-top,0px));overflow:auto;box-sizing:border-box;padding:12px;border:1px solid var(--tm-doc-border);border-radius:12px;background:var(--tm-doc-bg);background-image:var(--land-panel-material,none);background-size:768px auto;color:var(--tm-doc-ink);box-shadow:0 8px 28px #0002}
.tm-document-menu-title{font-size:12px;overflow-wrap:anywhere;margin:2px 6px 8px;opacity:.8;line-height:1.4}
.tm-document-tools{display:flex;align-items:center;flex-wrap:wrap;gap:4px}
.tm-document-tools button,.tm-document-tools a,.tm-document-copy-tools button{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 10px;color:var(--tm-doc-accent);background:transparent;border:0;border-radius:6px;font:14px var(--tm-font-body);cursor:pointer;text-decoration:none}
.tm-document-tools button:disabled{opacity:.4;cursor:default}.tm-document-tools .tm-document-command{justify-content:flex-start;flex:1 1 100%}
.tm-document-tools select{min-height:44px;min-width:0;max-width:100%;flex:1;color:inherit;background:transparent;border:1px solid var(--tm-doc-border);border-radius:6px;font:14px var(--tm-font-body);padding:6px}
.tm-document-tools input{width:4em;min-height:40px;text-align:center;border:1px solid var(--tm-doc-border);border-radius:6px;background:transparent;color:inherit;font:16px var(--tm-font-body);padding:4px}
.tm-document-prose{max-width:68ch;margin:0 auto;line-height:1.75;font-size:calc(17px * var(--tm-doc-text-scale,1));overflow-wrap:anywhere;-webkit-user-select:text;user-select:text}.tm-document-prose+.tm-document-prose{padding-top:2.5em}
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
.tm-document-reading-surface{position:relative;height:100%;filter:brightness(var(--tm-doc-brightness,1)) sepia(var(--tm-doc-warmth,0))}
.tm-document-paper canvas{filter:var(--tm-doc-pdf-filter,none)}
.tm-document-book-pdf .tm-document-scroll{touch-action:pan-y pinch-zoom}.tm-document-book-pdf[data-zoomed="true"] .tm-document-scroll{touch-action:pan-x pan-y pinch-zoom}
.tm-document-book-pdf .tm-document-content{min-height:100%;padding:calc(52px + env(safe-area-inset-top,0px)) 0 calc(52px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;justify-content:center}.tm-document-book-pdf .tm-document-page{flex-shrink:0;margin-bottom:0}
.tm-document-book-text{position:absolute;inset:0;width:100%;max-width:840px;margin-inline:auto;background:var(--tm-doc-bg);box-sizing:border-box;padding:calc(52px + env(safe-area-inset-top,0px)) 20px calc(64px + env(safe-area-inset-bottom,0px));overflow:hidden;overscroll-behavior:contain;touch-action:pan-y pinch-zoom}
.tm-document-book-columns{height:100%;column-width:var(--tm-book-column,350px);column-gap:40px;column-fill:auto}
.tm-document-book-columns .tm-document-prose{max-width:none;margin:0}.tm-document-book-columns :is(h1,h2,h3,h4){break-after:avoid}.tm-document-book-columns img{max-height:calc(var(--tm-overlay-height,100dvh) - 160px);break-inside:avoid}
.tm-document-pagination{position:absolute;bottom:calc(4px + env(safe-area-inset-bottom,0px));left:max(16px,env(safe-area-inset-left,0px));right:56px;display:flex;align-items:center;justify-content:center;gap:10px;font:12px var(--tm-font-body);color:var(--tm-doc-ink);z-index:2}
.tm-document-pagination button{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:var(--tm-doc-accent);cursor:pointer}.tm-document-pagination button:disabled{opacity:.3;cursor:default}.tm-document-pagination span{font-variant-numeric:tabular-nums;min-width:64px;text-align:center}
.tm-document-mode{display:flex;width:100%;gap:4px;border-bottom:1px solid var(--tm-doc-border);padding-bottom:8px;margin-bottom:4px}.tm-document-mode button{flex:1;border:1px solid transparent}.tm-document-mode button[aria-pressed="true"]{border-color:var(--tm-doc-border);background:color-mix(in srgb,var(--tm-doc-accent) 9%,transparent)}
.tm-document-reading-settings{width:100%;border-top:1px solid var(--tm-doc-border);margin-top:8px;padding-top:8px}.tm-document-reading-settings summary{padding:10px 6px;min-height:44px;box-sizing:border-box;cursor:pointer;font-size:14px;color:var(--tm-doc-accent)}
.tm-document-reading-setting{display:grid;grid-template-columns:1fr auto;align-items:center;gap:6px;font-size:13px;margin:8px 6px 12px}.tm-document-reading-setting input[type="range"]{grid-column:1/-1;width:100%;min-height:32px;padding:0;border:0;accent-color:var(--tm-doc-accent)}.tm-document-reading-setting select{grid-column:1/-1;width:100%}
.tm-document-page-tools{display:flex;align-items:center;flex-wrap:nowrap;width:100%;gap:0;font-size:12px;font-variant-numeric:tabular-nums}.tm-document-page-tools button{flex:0 0 44px;padding:6px}.tm-document-page-tools label{display:flex;align-items:center;justify-content:center;gap:3px;flex:1;min-width:0;white-space:nowrap}.tm-document-page-tools input{box-sizing:border-box;width:38px;min-width:0;font-size:14px;padding:3px;appearance:textfield}.tm-document-page-tools input::-webkit-inner-spin-button{appearance:none}.tm-document-page-tools output{min-width:36px;text-align:center;font-size:12px}.tm-document-toc{width:100%;margin:4px 0;border-top:1px solid var(--tm-doc-border)}.tm-document-toc summary{padding:12px 6px;cursor:pointer;min-height:44px;box-sizing:border-box;color:var(--tm-doc-accent)}.tm-document-toc nav{display:flex;flex-direction:column;max-height:250px;overflow:auto}.tm-document-toc button{justify-content:flex-start;text-align:left;line-height:1.4;flex-shrink:0}.tm-document-pdf .tm-document-pagination{color:var(--tm-nav-text,#eee6d7)}.tm-document-pdf .tm-document-pagination button{color:var(--tm-nav-text,#eee6d7)}
@media(max-width:600px){.tm-document-prose{font-size:calc(16px * var(--tm-doc-text-scale,1))}.tm-document-caption{text-align:left}}
`;

function selectContents(element) {
  if (!element) return;
  const selection = window.getSelection(), range = document.createRange();
  range.selectNodeContents(element); selection.removeAllRanges(); selection.addRange(range);
}

function PdfPage({ model, number, zoom, scroll, onGeometry, fitPage = false, L }) {
  const host = React.useRef(null), canvas = React.useRef(null), layer = React.useRef(null);
  const [width, setWidth] = React.useState(320), [shape, setShape] = React.useState(() => model.pageRatios.get(number) || model.pageRatios.get(1) || .707), [active, setActive] = React.useState(number === 1);
  const [error, setError] = React.useState(''), [busy, setBusy] = React.useState(true);
  React.useLayoutEffect(() => {
    const parent = scroll.current; if (!parent) return;
    const measure = () => { const css = getComputedStyle(parent.firstElementChild); const space = parent.clientHeight - parseFloat(css.paddingTop || 0) - parseFloat(css.paddingBottom || 0); setWidth(Math.max(120, Math.min(1200, parent.clientWidth, fitPage ? Math.max(120, space) * shape : Infinity))); }; measure();
    const observer = new ResizeObserver(measure); observer.observe(parent); return () => observer.disconnect();
  }, [scroll, fitPage, shape]);
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
    const [reading, setReading] = React.useState(readDocumentReading), [bookState, setBookState] = React.useState({ index: 0, count: 1 });
    const [toc, setToc] = React.useState([]);
    const book = React.useRef(null), readingLocation = React.useRef({ section: 0, fraction: 0 });
    const savedPosition = React.useRef(null), saveTimer = React.useRef(null);
    const remember = value => { savedPosition.current = value; clearTimeout(saveTimer.current); saveTimer.current = setTimeout(() => writeDocumentPosition(attachment, value), 350); };
    const changeReading = patch => setReading(current => writeDocumentReading({ ...current, ...patch }));
    const palette = documentReadingPalette(reading, t), bookMode = reading.mode === 'book' && copyText == null;
    const root = React.useRef(null), scroll = React.useRef(null), content = React.useRef(null), menu = React.useRef(null), textCopy = React.useRef(null), copyController = React.useRef(null), viewAnchor = React.useRef(null);
    const restoreAnchor = React.useCallback(() => {
      const anchor = viewAnchor.current, viewport = scroll.current;
      if (!anchor || !viewport) return;
      if (viewport.scrollHeight <= viewport.clientHeight + 1) { viewport.scrollTop = 0; return; }
      const page = viewport.querySelector(`[data-document-part="${anchor.index}"]`);
      if (page) { const rect = page.getBoundingClientRect(), delta = rect.top - viewport.getBoundingClientRect().top + rect.height * anchor.fraction; if (Math.abs(delta) > .5) viewport.scrollTop += delta; }
    }, []);
    const kind = documentKind(attachment), isPdf = kind === 'pdf' && copyText == null;
    useVrstva({ close: onClose, ref: root });
    React.useEffect(() => {
      const flush = () => { clearTimeout(saveTimer.current); if (savedPosition.current) writeDocumentPosition(attachment, savedPosition.current); };
      window.addEventListener('pagehide', flush); const hidden = () => { if (document.hidden) flush(); }; document.addEventListener('visibilitychange', hidden);
      return () => { flush(); window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', hidden); };
    }, [attachment.id]);
    React.useEffect(() => {
      const controller = new AbortController(); let loaded, url;
      viewAnchor.current = null;
      const saved = readDocumentPosition(attachment) || { section: 0, fraction: 0, zoom: 1 }; savedPosition.current = saved; readingLocation.current = saved;
      setFailure(''); setModel(null); setToc([]); setIndex(saved.section); setDownload(''); setCopyText(null); setZoom(saved.zoom); setCopyBusy(false); setNotice(''); setMenuOpen(false);
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
          } else { loaded = await readDocumentContent(file, controller.signal); Object.assign(loaded, prepareDocumentChapters(loaded.sections, loaded.navigation)); }
          const max = (loaded.doc?.numPages || loaded.sections.length) - 1, section = Math.min(max, saved.section);
          readingLocation.current = { ...saved, section }; viewAnchor.current = { index: section, fraction: saved.fraction }; setIndex(section);
          controller.signal.throwIfAborted(); setModel(loaded);
          if (loaded.doc) { try { const outline = await readPdfOutline(loaded.doc, controller.signal); if (!controller.signal.aborted) setToc(outline); } catch { /* PDF pages remain readable without a valid outline. */ } }
          else setToc(loaded.toc || []);
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
    React.useLayoutEffect(() => { if (model && !bookMode) restoreAnchor(); }, [model, restoreAnchor]);
    const count = bookMode && model?.sections ? bookState.count : model?.doc?.numPages || model?.sections?.length || 0;
    const shownIndex = bookMode && model?.sections ? bookState.index : index;
    const go = n => {
      if (!Number.isFinite(n) || !count) return;
      const next = Math.min(count - 1, Math.max(0, Math.trunc(n)));
      if (bookMode && model?.sections) { book.current?.go(next); return; }
      viewAnchor.current = { index: next, fraction: 0 };
      remember({ section: next, fraction: 0, zoom });
      setIndex(next); restoreAnchor();
    };
    useDocumentBookGestures(scroll, bookMode && !!model?.doc && zoom === 1 && !menuOpen, direction => go(index + direction));
    const changeMode = mode => {
      if (mode === reading.mode) return;
      if (model?.sections) {
        if (bookMode) { readingLocation.current = book.current?.location() || { section: 0, fraction: 0 }; setIndex(readingLocation.current.section); }
        else { const viewport = scroll.current, part = viewport?.querySelector(`[data-document-part="${index}"]`), rect = part?.getBoundingClientRect(); readingLocation.current = { section: index, fraction: rect ? Math.max(0, Math.min(.999, (viewport.getBoundingClientRect().top - rect.top) / Math.max(1, rect.height))) : 0 }; }
      }
      changeReading({ mode });
    };
    React.useLayoutEffect(() => {
      if (!model || copyText != null) return;
      if (model.doc) { viewAnchor.current = { index, fraction: 0 }; restoreAnchor(); }
      else if (!bookMode) { const saved = readingLocation.current; viewAnchor.current = { index: saved.section, fraction: saved.fraction }; restoreAnchor(); }
    }, [reading.mode]);
    const changeZoom = delta => {
      const viewport = scroll.current, page = viewport?.querySelector(`[data-document-part="${index}"]`);
      if (page) { const rect = page.getBoundingClientRect(); viewAnchor.current = { index, fraction: Math.max(0, (viewport.getBoundingClientRect().top - rect.top) / rect.height) }; }
      const next = Math.min(2.5, Math.max(1, zoom + delta)); setZoom(next); remember({ section: index, fraction: viewAnchor.current?.fraction || 0, zoom: next });
    };
    const trackPage = () => {
      if (copyText != null || !scroll.current || (bookMode && model?.sections)) return;
      if (viewAnchor.current) { const anchor = viewAnchor.current; setIndex(anchor.index); remember({ section: anchor.index, fraction: anchor.fraction, zoom }); return; }
      const top = scroll.current.getBoundingClientRect().top + 80;
      const parts = content.current?.querySelectorAll('[data-document-part]') || [];
      let low = 0, high = parts.length - 1;
      while (low < high) { const middle = (low + high) >> 1; if (parts[middle].getBoundingClientRect().bottom > top) high = middle; else low = middle + 1; }
      if (parts[low]) { const part = parts[low], section = +part.dataset.documentPart, rect = part.getBoundingClientRect(); setIndex(section); remember({ section, fraction: Math.max(0, Math.min(.999999, (scroll.current.getBoundingClientRect().top - rect.top) / Math.max(1, rect.height))), zoom }); }
    };
    const goChapter = chapter => {
      setMenuOpen(false);
      if (bookMode && model?.sections) { book.current?.goLocation(chapter); return; }
      go(chapter.section);
      if (chapter.anchor) { const node = content.current?.querySelector(`[data-document-anchor="${chapter.anchor}"]`), part = content.current?.querySelector(`[data-document-part="${chapter.section}"]`); if (node && part) { viewAnchor.current = { index: chapter.section, fraction: Math.max(0, (node.getBoundingClientRect().top - part.getBoundingClientRect().top) / part.getBoundingClientRect().height) }; remember({ section: chapter.section, fraction: viewAnchor.current.fraction, zoom }); restoreAnchor(); } }
    };
    const resetView = () => { changeMode(DOCUMENT_READING_DEFAULTS.mode); changeReading(DOCUMENT_READING_DEFAULTS); setZoom(1); remember({ ...(savedPosition.current || { section: index, fraction: 0 }), zoom: 1 }); };
    const selectAll = async () => {
      setMenuOpen(false); setNotice('');
      if (!model?.doc) { selectContents(bookMode ? book.current?.viewport()?.firstElementChild : content.current); return; }
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
    return createPortal(<div ref={root} role="dialog" aria-modal="true" aria-label={attachment.name || L('Dokument', 'Document')} className={`tm-document-sheet${isPdf ? ' tm-document-pdf' : ''}${bookMode && model?.doc ? ' tm-document-book-pdf' : ''}`} data-tm-reading="document" data-reading-mode={reading.mode} data-reading-background={reading.background} data-zoomed={zoom > 1} onKeyDownCapture={e => { if (e.key === 'Escape' && menuOpen) { e.preventDefault(); e.stopPropagation(); setMenuOpen(false); } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { e.preventDefault(); e.stopPropagation(); void selectAll(); } }} style={{ '--tm-doc-ink': palette.ink, '--tm-doc-accent': palette.accent, '--tm-doc-border': palette.border, '--tm-doc-bg': palette.background, '--tm-doc-pdf-filter': palette.pdf, '--tm-doc-brightness': reading.brightness / 100, '--tm-doc-warmth': reading.warmth / 100 * .55, '--tm-doc-text-scale': reading.textSize / 100 }}>
      <style>{readerCss}</style>
      <div className="tm-document-reading-surface">
      {bookMode && model?.sections ? <DocumentBookText ref={book} sections={model.sections} initialLocation={readingLocation.current} textSize={reading.textSize} navigationEnabled={!menuOpen} onProgress={next => { const location = book.current?.location() || readingLocation.current; readingLocation.current = location; remember({ ...location, zoom: 1 }); setBookState(current => current.index === next.index && current.count === next.count ? current : next); }} L={L}/> :
      <div className="tm-document-scroll tm-scroll" ref={scroll} onScroll={trackPage} onPointerDownCapture={() => { viewAnchor.current = null; }} onWheel={() => { viewAnchor.current = null; }} onKeyDown={e => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key)) viewAnchor.current = null; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { e.preventDefault(); void selectAll(); } }} tabIndex={0} aria-label={L('Obsah dokumentu', 'Document content')}>
        <div className="tm-document-content" ref={content}>
          {!model && !failure && <p role="status" className="tm-document-message">{L('Otevírám dokument…', 'Opening document…')}</p>}
          {failure && <div className="tm-document-message" role="alert"><p>{failure}</p><button type="button" onClick={() => setRetry(n => n + 1)}>{L('Zkusit znovu', 'Try again')}</button></div>}
          {copyText != null ? <article ref={textCopy} className="tm-document-prose tm-document-text" aria-label={L('Text celého dokumentu', 'Complete document text')}>{copyText}</article> : model?.doc ? (bookMode ? [index] : Array.from({ length: count }, (_, i) => i)).map(i => <PdfPage key={i} model={model} number={i + 1} zoom={zoom} scroll={scroll} onGeometry={restoreAnchor} fitPage={bookMode} L={L}/>) : model?.sections?.map((section, i) => section.html != null ? <article key={i} data-document-part={i} className="tm-document-prose" dangerouslySetInnerHTML={{ __html: section.html }}/> : <article key={i} data-document-part={i} className="tm-document-prose tm-document-text">{section.text}</article>)}
        </div>
      </div>}
      </div>
      {bookMode && model && count > 0 && <nav className="tm-document-pagination" aria-label={L('Listování knihou', 'Book navigation')}><button type="button" onClick={() => go(shownIndex - 1)} disabled={shownIndex === 0} aria-label={L('Předchozí stránka', 'Previous page')}><TmIcon id="prev" size={18}/></button><span aria-live="polite" aria-atomic="true">{shownIndex + 1} / {count}</span><button type="button" onClick={() => go(shownIndex + 1)} disabled={shownIndex >= count - 1} aria-label={L('Další stránka', 'Next page')}><TmIcon id="next" size={18}/></button></nav>}
      <button type="button" className="tm-document-close" onClick={onClose} title={L('Zavřít dokument', 'Close document')} aria-label={L('Zavřít dokument', 'Close document')}><TmIcon id="close" size={19}/></button>
      <button type="button" className="tm-document-menu-toggle" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label={L('Nástroje dokumentu', 'Document tools')}>⋯</button>
      {menuOpen && <div className="tm-document-menu" ref={menu} role="group" aria-label={L('Nástroje dokumentu', 'Document tools')} style={{ '--tm-doc-bg': t.documentSurface || t.bg, '--tm-doc-ink': t.text, '--tm-doc-accent': t.accentInk || t.accent, '--tm-doc-border': t.borderSoft }}><div className="tm-document-menu-title">{attachment.name}</div><div className="tm-document-tools">
        {model && copyText == null && <div className="tm-document-mode"><button type="button" aria-pressed={reading.mode === 'flow'} onClick={() => changeMode('flow')}>{L('Plynule', 'Continuous')}</button><button type="button" aria-pressed={reading.mode === 'book'} onClick={() => changeMode('book')}>{L('Jako kniha', 'Book')}</button></div>}
        {model && copyText == null && (isPdf || bookMode || count > 1) && <div className="tm-document-page-tools"><button type="button" onClick={() => go(shownIndex - 1)} disabled={shownIndex === 0} aria-label={L('Předchozí stránka', 'Previous page')}><TmIcon id="prev" size={18}/></button>
          <label><input aria-label={isPdf || bookMode ? L('Strana', 'Page') : L('Část', 'Part')} type="number" min="1" max={count} value={shownIndex + 1} onChange={e => { if (e.target.value) go(Number(e.target.value) - 1); }}/><span>/ {count}</span></label>
          <button type="button" onClick={() => go(shownIndex + 1)} disabled={shownIndex >= count - 1} aria-label={L('Další stránka', 'Next page')}><TmIcon id="next" size={18}/></button>
          {isPdf && <><button type="button" onClick={() => changeZoom(-.25)} disabled={zoom === 1} aria-label={L('Zmenšit', 'Zoom out')}><TmIcon id="remove" size={17}/></button><output>{Math.round(zoom * 100)}%</output><button type="button" onClick={() => changeZoom(.25)} disabled={zoom === 2.5} aria-label={L('Zvětšit', 'Zoom in')}><TmIcon id="add" size={17}/></button></>}
        </div>}
        {!!toc.length && copyText == null && <details className="tm-document-toc"><summary>{L('Obsah', 'Contents')}</summary><nav aria-label={L('Kapitoly dokumentu', 'Document chapters')}>{toc.map((chapter, i) => <button key={i} type="button" style={{ paddingLeft: 10 + Math.min(chapter.level || 0, 4) * 10 }} onClick={() => goChapter(chapter)}>{chapter.title || L(`Část ${chapter.section + 1}`, `Part ${chapter.section + 1}`)}</button>)}</nav></details>}
        {model && <button type="button" className="tm-document-command" disabled={copyBusy} onClick={selectAll}>{L('Vybrat vše', 'Select all')}</button>}
        {(download || fallbackUrl) && <a className="tm-document-command" href={download || fallbackUrl} download={attachment.name}><TmIcon id="download" size={17}/>{L('Stáhnout původní soubor', 'Download original file')}</a>}
        <details className="tm-document-reading-settings"><summary>{L('Pohodlí při čtení', 'Reading comfort')}</summary>
          <label className="tm-document-reading-setting">{L('Podklad', 'Background')}<select aria-label={L('Podklad', 'Background')} value={reading.background} onChange={e => changeReading({ background: e.target.value })}><option value="original">{L('Původní', 'Original')}</option><option value="paper">{L('Papír', 'Paper')}</option><option value="night">{L('Noc', 'Night')}</option></select></label>
          <label className="tm-document-reading-setting">{L('Teplota', 'Warmth')}<output>{reading.warmth}%</output><input type="range" aria-label={L('Teplota čtení', 'Reading warmth')} min="0" max="100" step="5" value={reading.warmth} onChange={e => changeReading({ warmth: +e.target.value })}/></label>
          <label className="tm-document-reading-setting">{L('Jas čtečky', 'Reader brightness')}<output>{reading.brightness}%</output><input type="range" aria-label={L('Jas čtečky', 'Reader brightness')} min="55" max="100" step="5" value={reading.brightness} onChange={e => changeReading({ brightness: +e.target.value })}/></label>
          {(!isPdf || copyText != null) && <label className="tm-document-reading-setting">{L('Velikost textu', 'Text size')}<output>{reading.textSize}%</output><input type="range" aria-label={L('Velikost textu', 'Text size')} min="85" max="150" step="5" value={reading.textSize} onChange={e => changeReading({ textSize: +e.target.value })}/></label>}
          <p className="tm-document-caption">{L('Pouze tato čtečka. Jas zařízení se nemění.', 'Only this reader. Device brightness stays unchanged.')}</p>
        </details>
        <button type="button" className="tm-document-command" onClick={resetView}>{L('Obnovit původní zobrazení', 'Reset reading view')}</button>
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
