import React from 'react';
import { createPortal } from 'react-dom';
import { selectedTextScope, selectScopeText } from './textSelection.js';

export function TextSelectionActions({ t, L }) {
  const [scope, setScope] = React.useState(null);
  const [top, setTop] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const timer = React.useRef(null);
  React.useEffect(() => {
    const selection = () => { setScope(selectedTextScope(document.getSelection())); setFeedback(''); };
    const position = () => {
      const v = window.visualViewport;
      setTop(Math.max((v?.offsetTop || 0) + 8, (v?.offsetTop || 0) + (v?.height || window.innerHeight) - 136));
    };
    position(); document.addEventListener('selectionchange', selection);
    window.addEventListener('resize', position);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('selectionchange', selection);
      window.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('scroll', position);
    };
  }, []);
  if (!scope) return null;
  const copy = async () => {
    const selection = document.getSelection();
    if (selectedTextScope(selection) !== scope) return;
    const text = selection.toString();
    try {
      // The native copy path retains rich formatting; clipboard fallback is text.
      if (!document.execCommand('copy')) await navigator.clipboard.writeText(text);
      setFeedback(L('Zkopírováno', 'Copied'));
    } catch { setFeedback(L('Použij Kopírovat v nabídce výběru.', 'Use Copy in the selection menu.')); }
    clearTimeout(timer.current); timer.current = setTimeout(() => setFeedback(''), 2500);
  };
  const button = { minHeight: 44, padding: '8px 12px', background: 'transparent', border: 0, color: t.accentInk || t.accent, fontFamily: 'var(--tm-font-body)', fontSize: 13, cursor: 'pointer' };
  return createPortal(<div className="tm-text-selection-actions" data-tm-no-swipe role="toolbar" aria-label={L('Výběr textu', 'Text selection')}
    onPointerDown={e => e.preventDefault()} onMouseDown={e => e.preventDefault()}
    style={{ position: 'fixed', zIndex: 9700, top, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', maxWidth: 'calc(100vw - 24px)', border: `1px solid ${t.borderSoft}`, borderRadius: 12, background: t.card, boxShadow: t.shadowLift }}>
    <button type="button" style={button} onClick={() => selectScopeText(scope)}>{L('Vybrat vše', 'Select all')}</button>
    <button type="button" style={button} onClick={copy}>{L('Kopírovat', 'Copy')}</button>
    {feedback && <span role="status" style={{ position: 'absolute', bottom: '100%', right: 0, padding: '6px 10px', borderRadius: 8, background: t.card, color: t.text, fontSize: 12, whiteSpace: 'nowrap' }}>{feedback}</span>}
  </div>, document.body);
}
