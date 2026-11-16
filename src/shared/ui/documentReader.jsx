import React from 'react';
import { documentKind, readDocumentContent, DOCUMENT_MAX_BYTES } from '../product/documentContent.js';
import { TmIcon } from './icons.jsx';

const readerCss = `
.tm-document-sheet{display:flex!important;flex-direction:column;height:min(calc(88 * var(--tm-vh)),980px);overflow:hidden!important;padding-bottom:0!important}
.tm-document-sheet>.tm-cs-head{flex-shrink:0}.tm-document-sheet>.tm-cs-head button{min-height:44px}.tm-document-sheet>.tm-cs-head button:last-child{min-width:44px}
.tm-document-sheet .tm-cs-body{flex:1;min-height:0;padding:0;display:flex;flex-direction:column;overflow:hidden}
.tm-document-reader{display:flex;flex-direction:column;flex:1;min-height:0;font-family:var(--tm-font-body);color:var(--tm-doc-ink)}
.tm-document-tools{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;padding:8px 16px;border-bottom:1px solid var(--tm-doc-border);flex-shrink:0}
.tm-document-tools button,.tm-document-tools a{min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 10px;color:var(--tm-doc-accent);background:none;border:0;border-radius:8px;font:inherit;font-size:14px;cursor:pointer;text-decoration:none}
.tm-document-tools button:disabled{opacity:.4;cursor:default}
.tm-document-tools select{min-height:44px;min-width:0;max-width:100%;color:inherit;background:transparent;border:1px solid var(--tm-doc-border);border-radius:8px;font:inherit;padding:6px 10px}
.tm-document-tools input{width:4.3em;min-height:40px;text-align:center;border:1px solid var(--tm-doc-border);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:16px;padding:4px}
.tm-document-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:20px 22px max(28px,env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}
.tm-document-prose{max-width:68ch;margin:auto;line-height:1.75;font-size:17px;overflow-wrap:anywhere}
.tm-document-prose :is(h1,h2,h3,h4,h5,h6){font-family:var(--tm-font-display);line-height:1.2;font-weight:400;margin:1.4em 0 .6em}
.tm-document-prose h1{font-size:2em}.tm-document-prose h2{font-size:1.6em}.tm-document-prose h3{font-size:1.35em}
.tm-document-prose p{margin:0 0 1.1em}.tm-document-prose img{display:block;max-width:100%;height:auto;max-height:80vh;object-fit:contain;margin:1.2em auto}
.tm-document-prose a{color:var(--tm-doc-accent);text-underline-offset:.18em}.tm-document-prose table{display:block;max-width:100%;overflow:auto;border-collapse:collapse;margin:1em 0}
.tm-document-prose td,.tm-document-prose th{padding:8px;border:1px solid var(--tm-doc-border);min-width:5em}.tm-document-prose :is(pre,code){white-space:pre-wrap;overflow-wrap:anywhere}
.tm-document-prose blockquote{margin:1em 0;padding:0 1em;font-style:italic}.tm-document-text{white-space:pre-wrap}
.tm-document-paper{margin:0 auto;width:max-content;max-width:none;box-shadow:0 4px 20px #0002;background:white}
.tm-document-paper canvas{display:block}.tm-document-message{padding:20px;line-height:1.6;max-width:60ch;margin:auto}
.tm-document-caption{font-size:12px;opacity:.8;margin:4px 0 16px;text-align:center}
@media(max-width:600px){.tm-document-scroll{padding:16px 12px max(24px,env(safe-area-inset-bottom))}.tm-document-prose{font-size:16px}.tm-document-tools{padding:4px 10px}.tm-document-caption{text-align:left}}
`;

function PdfPage({ pdf, number, zoom, L }) {
  const host = React.useRef(null), canvas = React.useRef(null);
  const [width, setWidth] = React.useState(320), [error, setError] = React.useState(''), [text, setText] = React.useState(''), [busy, setBusy] = React.useState(true);
  React.useLayoutEffect(() => {
    const parent = host.current?.parentElement; if (!parent) return;
    const measure = () => setWidth(Math.max(200, parent.clientWidth - 28)); measure();
    const observer = new ResizeObserver(measure); observer.observe(parent); return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    let gone = false, task, page;
    setBusy(true); setError(''); setText('');
    (async () => {
      try {
        page = await pdf.getPage(number); if (gone) return;
        const natural = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(1.8, width / natural.width) * zoom });
        const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(6000000 / (viewport.width * viewport.height)));
        const target = document.createElement('canvas');
        target.width = Math.ceil(viewport.width * ratio); target.height = Math.ceil(viewport.height * ratio);
        task = page.render({ canvas: target, canvasContext: target.getContext('2d'), viewport, transform: [ratio, 0, 0, ratio, 0, 0] });
        await task.promise; if (gone) return;
        const visible = canvas.current; visible.width = target.width; visible.height = target.height;
        visible.style.width = `${viewport.width}px`; visible.style.height = `${viewport.height}px`;
        visible.getContext('2d').drawImage(target, 0, 0); target.width = target.height = 0;
        const content = await page.getTextContent();
        if (!gone) setText(content.items.map(item => (item.str || '') + (item.hasEOL ? '\n' : ' ')).join(''));
      } catch (e) { if (!gone && e.name !== 'RenderingCancelledException') setError(L('Stránku se nepodařilo zobrazit. Můžeš stáhnout původní soubor.', 'This page could not be displayed. You can download the original file.')); }
      finally { if (!gone) setBusy(false); if (gone) page?.cleanup(); }
    })();
    return () => {
      gone = true; task?.cancel();
      if (task) void task.promise.catch(() => {}).finally(() => page?.cleanup());
      else page?.cleanup();
    };
  }, [pdf, number, width, zoom, L]);
  return <div ref={host}>
    {busy && <p role="status">{L('Načítám stránku…', 'Loading page…')}</p>}
    {error && <p role="alert">{error}</p>}
    <div className="tm-document-paper" style={{ visibility: busy || error ? 'hidden' : 'visible' }}><canvas ref={canvas} role="img" aria-label={L(`Strana ${number}`, `Page ${number}`)} /></div>
    {!busy && text.trim() && <details style={{ maxWidth: '68ch', margin: '20px auto 0' }}><summary style={{ cursor: 'pointer', minHeight: 44 }}>{L('Text stránky', 'Page text')}</summary><div className="tm-document-prose tm-document-text">{text}</div></details>}
  </div>;
}

export function createDocumentReader({ useT, L, CenterSheet, getBlob }) {
  return function DocumentReader({ attachment, fallbackUrl, onClose }) {
    const { t } = useT();
    const [model, setModel] = React.useState(null), [failure, setFailure] = React.useState(''), [download, setDownload] = React.useState('');
    const [index, setIndex] = React.useState(0), [zoom, setZoom] = React.useState(1);
    const [retry, setRetry] = React.useState(0), scroll = React.useRef(null);
    const kind = documentKind(attachment);
    React.useEffect(() => {
      const controller = new AbortController(); let document, url;
      setFailure(''); setModel(null); setIndex(0); setDownload('');
      (async () => {
        try {
          if (attachment.size > DOCUMENT_MAX_BYTES) throw new Error('document-limit');
          const blob = await getBlob(attachment, controller.signal); controller.signal.throwIfAborted();
          if (!blob || blob.size > DOCUMENT_MAX_BYTES) throw new Error('document-limit');
          url = URL.createObjectURL(blob); setDownload(url);
          const file = new File([blob], attachment.name || 'document', { type: attachment.type || blob.type });
          if (kind === 'pdf') {
            const { openDocumentPdf } = await import('../product/documentPdf.js'); controller.signal.throwIfAborted();
            document = await openDocumentPdf(await file.arrayBuffer(), controller.signal);
          } else document = await readDocumentContent(file, controller.signal);
          controller.signal.throwIfAborted(); setModel(document);
        } catch (error) {
          if (controller.signal.aborted) { document?.dispose(); return; }
          const code = error.kod || error.message;
          setFailure(error.name === 'PasswordException' || /encrypted/.test(code) ? L('Dokument je chráněný heslem nebo DRM. Stáhni ho a otevři ve své čtečce.', 'This document has password or DRM protection. Download it and open it in your reader.') : /limit/.test(code) ? L('Dokument je pro tuto čtečku příliš velký. Stáhni původní soubor.', 'This document is too large for this reader. Download the original file.') : L('Dokument se nepodařilo otevřít. Zkus to znovu online, nebo stáhni původní soubor.', 'The document could not be opened. Try again online or download the original file.'));
        }
      })();
      return () => { controller.abort(); document?.dispose(); if (url) URL.revokeObjectURL(url); };
    }, [attachment.id, retry]);
    React.useEffect(() => { if (scroll.current) scroll.current.scrollTop = 0; }, [index]);
    const count = model?.doc?.numPages || model?.sections?.length || 0;
    const go = n => { if (Number.isFinite(n) && count > 0) setIndex(Math.min(count - 1, Math.max(0, Math.trunc(n)))); };
    return <CenterSheet title={attachment.name || L('Dokument', 'Document')} onClose={onClose} className="tm-document-sheet" vrstva={230}>
      <style>{readerCss}</style>
      <div className="tm-document-reader" data-tm-reading="document" style={{ '--tm-doc-ink': t.text, '--tm-doc-accent': t.accentInk || t.accent, '--tm-doc-border': t.borderSoft }}>
        <div className="tm-document-tools">
          {count > 1 && <><button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label={L('Předchozí stránka', 'Previous page')}><TmIcon id="prev" size={18}/></button>
            {kind === 'pdf' ? <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><input aria-label={L('Strana', 'Page')} type="number" min="1" max={count} value={index + 1} onChange={e => { if (e.target.value) go(Number(e.target.value) - 1); }}/><span>/ {count}</span></label> : <select aria-label={L('Kapitola', 'Chapter')} value={index} onChange={e => go(+e.target.value)} style={{ flex: '1 1 120px' }}>{model.sections.map((section, i) => <option key={i} value={i}>{section.title || L(`Část ${i + 1}`, `Part ${i + 1}`)}</option>)}</select>}
            <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label={L('Další stránka', 'Next page')}><TmIcon id="next" size={18}/></button></>}
          {kind === 'pdf' && model && <><button type="button" onClick={() => setZoom(z => Math.max(1, z - .25))} disabled={zoom === 1} aria-label={L('Zmenšit', 'Zoom out')}><TmIcon id="remove" size={17}/></button><button type="button" onClick={() => setZoom(z => Math.min(2.5, z + .25))} disabled={zoom === 2.5} aria-label={L('Zvětšit', 'Zoom in')}><TmIcon id="add" size={17}/></button></>}
          {(download || fallbackUrl) && <a href={download || fallbackUrl} download={attachment.name} style={{ marginLeft: 'auto' }} aria-label={L('Stáhnout původní soubor', 'Download original file')}><TmIcon id="download" size={17}/><span>{L('Stáhnout', 'Download')}</span></a>}
        </div>
        <div className="tm-document-scroll tm-scroll" ref={scroll}>
          {!model && !failure && <p role="status" className="tm-document-message">{L('Otevírám dokument…', 'Opening document…')}</p>}
          {failure && <div className="tm-document-message" role="alert"><p>{failure}</p><button type="button" onClick={() => setRetry(n => n + 1)}>{L('Zkusit znovu', 'Try again')}</button></div>}
          {model?.doc && <PdfPage pdf={model.doc} number={index + 1} zoom={zoom} L={L}/>}
          {model?.sections && <>{kind === 'docx' && <p className="tm-document-caption">{L('Zobrazení pro čtení. Přesnou sazbu zachovává původní soubor.', 'Reading view. The original file preserves the exact layout.')}</p>}
            {model.sections[index]?.html != null ? <article className="tm-document-prose" dangerouslySetInnerHTML={{ __html: model.sections[index].html }}/> : <article className="tm-document-prose tm-document-text">{model.sections[index]?.text}</article>}</>}
        </div>
      </div>
    </CenterSheet>;
  };
}
