import React, { useEffect, useState } from 'react';
export function RecordingRecovery({ store, entryId, onRecover, onDownload, t, lang = 'cs', refresh = 0 }) {
  const L = (cs, en) => lang === 'en' ? en : cs;
  const [items, setItems] = useState([]), [busy, setBusy] = useState(''), [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    store.list().then(rows => { if (alive) setItems(rows.filter(row => row.bytes > 0 && (!entryId || row.entryId === entryId))); }).catch(() => { if (alive) setError(L('Záchranné nahrávky se nepodařilo načíst.', 'Recovery recordings could not be read.')); });
    return () => { alive = false; };
  }, [store, entryId, refresh]);
  const act = async (item, recover) => {
    if (busy) return; setBusy(item.id); setError('');
    try {
      const row = await store.read(item.id); if (!row?.blob?.size) throw new Error('missing');
      if (recover) { await onRecover(row.blob, row); await store.remove(row.id); setItems(rows => rows.filter(value => value.id !== row.id)); }
      else onDownload(row.blob, row);
    } catch { setError(L('Nahrávka zůstává v záchranné kopii. Zkus to znovu nebo ji stáhni.', 'The recovery copy is preserved. Try again or download it.')); }
    finally { setBusy(''); }
  };
  if (!items.length && !error) return null;
  const button = { minHeight: 44, padding: '8px 12px', border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, background: 'transparent', font: 'inherit', cursor: 'pointer' };
  return <div data-testid="recording-recovery" style={{ fontFamily: 'var(--ff-body,sans-serif)', fontSize: 14, lineHeight: 1.5, marginBlock: 12, color: t.text }}>
    {!!items.length && <p style={{ margin: '0 0 8px' }}>{L('Zachované nahrávky', 'Recovered recordings')}</p>}
    {items.map(item => <div key={item.id} style={{ paddingBlock: 8, borderBottom: `1px solid ${t.border}`, overflowWrap: 'anywhere' }}>
      <div>{new Date(item.createdAt).toLocaleString(lang === 'en' ? 'en-GB' : 'cs-CZ')} · {item.bytes < 1048576 ? Math.max(1, Math.ceil(item.bytes / 1024)) + ' kB' : (item.bytes / 1048576).toFixed(1) + ' MB'}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
        {onRecover && <button type="button" disabled={!!busy} onClick={() => act(item, true)} style={button}>{L('Vložit do poznámky', 'Insert into note')}</button>}
        <button type="button" disabled={!!busy} onClick={() => act(item, false)} style={button}>{L('Stáhnout nahrávku', 'Download recording')}</button>
      </div>
    </div>)}
    {error && <p role="alert">{error}</p>}
  </div>;
}
