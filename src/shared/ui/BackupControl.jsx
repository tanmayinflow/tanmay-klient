import React, { useEffect, useRef, useState } from 'react';

export function BackupControl({ prepare, textBackup, t, lang = 'cs', disabled = false, filename = 'tanmay-zaloha.zip' }) {
  const L = (cs, en) => lang === 'en' ? en : cs;
  const [progress, setProgress] = useState(null), [error, setError] = useState(''), [ready, setReady] = useState(null);
  const running = useRef(null), link = useRef(null), mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; running.current?.abort(); if (link.current) URL.revokeObjectURL(link.current); }; }, []);
  const start = async () => {
    if (running.current || disabled) return;
    const controller = new AbortController(); running.current = controller;
    setError(''); setReady(null); setProgress({ phase: 'data' });
    if (link.current) URL.revokeObjectURL(link.current);
    try {
      const result = await prepare({ signal: controller.signal, onProgress: value => { if (mounted.current) setProgress(value); } });
      if (!mounted.current || controller.signal.aborted) return;
      link.current = URL.createObjectURL(result.blob);
      setReady({ url: link.current, bytes: result.blob.size, media: result.mediaCount, recordings: result.recordingCount });
    } catch (cause) {
      if (mounted.current && !controller.signal.aborted) setError(cause.code === 'backup-zip-limit'
        ? L('Záloha přesahuje kapacitu jednoho ZIP archivu. Nic se nestáhlo ani nezměnilo. Stáhni textovou zálohu a soubory zatím uchovej v aplikaci.', 'The backup exceeds the capacity of one ZIP archive. Nothing was downloaded or changed. Save a text backup and keep your files in the app for now.')
        : L('Úplnou zálohu se nepodařilo dokončit. Zkontroluj připojení a přihlášení a zkus to znovu. Texty můžeš stáhnout i bez internetu.', 'The complete backup could not be finished. Check your connection and sign-in, then retry. You can save the texts even without internet.'));
    } finally { if (running.current === controller) running.current = null; if (mounted.current) setProgress(null); }
  };
  const button = { minHeight: 44, padding: '9px 14px', borderRadius: 8, border: `1px solid ${t.border}`, background: 'transparent', color: t.text, font: 'inherit', cursor: 'pointer' };
  const status = progress?.phase === 'files' ? L(`Přílohy ${progress.completed} z ${progress.total}`, `Files ${progress.completed} of ${progress.total}`)
    : progress?.phase === 'verify' ? L('Ověřuji soubory a připravuji ZIP…', 'Verifying files and preparing the ZIP…') : L('Připravuji data účtu…', 'Preparing account data…');
  return <div data-testid="complete-backup" style={{ color: t.text, fontFamily: 'var(--ff-body,sans-serif)', fontSize: 14, lineHeight: 1.55, padding: '12px 8px', minWidth: 0 }}>
    <p style={{ margin: '0 0 12px' }}>{L('Úplná záloha obsahuje texty, tréninky, nahrávky, obrázky, přílohy a další data tvého účtu. Příprava potřebuje připojení k internetu.', 'A complete backup includes texts, training, recordings, images, attachments and your other account data. Preparation needs an internet connection.')}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      {!ready && <button type="button" disabled={disabled || !!progress} onClick={start} style={{ ...button, background: t.accent, color: t.onAccent, opacity: disabled || progress ? 0.6 : 1 }}>{progress ? L('Připravuji…', 'Preparing…') : L('Připravit úplnou zálohu', 'Prepare complete backup')}</button>}
      {progress && <button type="button" onClick={() => running.current?.abort()} style={button}>{L('Zrušit přípravu', 'Cancel preparation')}</button>}
      {ready && <a href={ready.url} download={filename} style={{ ...button, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', background: t.accent, color: t.onAccent }}>{L('Stáhnout ZIP', 'Download ZIP')} ({ready.bytes < 1048576 ? Math.max(1, Math.ceil(ready.bytes / 1024)) + ' kB' : (ready.bytes / 1048576).toFixed(1) + ' MB'})</a>}
      {ready && <button type="button" onClick={start} disabled={disabled} style={button}>{L('Připravit znovu', 'Prepare again')}</button>}
    </div>
    {progress && <p role="status" aria-live="polite" style={{ margin: '10px 0', overflowWrap: 'anywhere' }}>{status}{progress.name && <><br/>{progress.name}</>}</p>}
    {ready && <p role="status" style={{ margin: '10px 0' }}>{L('Záloha je úplná a připravená. Tlačítkem ji ulož do Souborů nebo svého počítače.', 'The complete backup is ready. Use the button to save it to Files or your computer.')}</p>}
    {error && <p role="alert" style={{ margin: '10px 0' }}>{error}</p>}
    <button type="button" disabled={disabled || !!progress} onClick={textBackup} style={{ ...button, marginTop: 12 }}>{L('Stáhnout pouze texty a data', 'Download texts and data only')}</button>
    <p style={{ margin: '4px 0 0', color: t.textSec }}>{L('Rychlá textová záloha neobsahuje soubory. Přihlašovací údaje a cizí soukromé záznamy se do záloh nepřidávají.', 'The quick text backup does not include files. Sign-in credentials and other people’s private records are not included in backups.')}</p>
  </div>;
}
