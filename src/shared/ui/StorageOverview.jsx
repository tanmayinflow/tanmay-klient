import React, { useEffect, useRef, useState } from 'react';
import { ServerStorageLimits } from './ServerStorageLimits.jsx';
import { inspectStorage, readStoragePreferences, writeStoragePreferences, recordingEstimate } from '../product/storageOverview.js';

export function StorageOverview({ t, lang = 'cs', namespace, getContext, active = true, localDocument = 'indexeddb' }) {
  const L = (cs, en) => lang === 'en' ? en : cs;
  const [data, setData] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [preferences, setPreferences] = useState(() => readStoragePreferences(namespace));
  const [notice, setNotice] = useState('');
  const contextRef = useRef(getContext); contextRef.current = getContext;
  const running = useRef(null), mounted = useRef(false);
  const bytes = value => value == null ? L('Nezjištěno', 'Unknown') : value < 1024 ? `${value} B` : value < 1048576 ? `${(value / 1024).toFixed(1)} KiB` : value < 1073741824 ? `${(value / 1048576).toFixed(1)} MiB` : `${(value / 1073741824).toFixed(2)} GiB`;
  const refresh = async () => {
    if (running.current || !active) return;
    const controller = new AbortController(); running.current = controller;
    const timer = setTimeout(() => controller.abort(), 20000);
    setBusy(true); setError('');
    try {
      const result = await inspectStorage({ ...contextRef.current(), signal: controller.signal });
      if (mounted.current && !controller.signal.aborted) setData(result);
    } catch { if (mounted.current && running.current === controller) setError(L('Přehled se nepodařilo načíst. Zkontroluj připojení a přihlášení a obnov ho.', 'Could not load storage. Check your connection and sign-in, then refresh.')); }
    finally { clearTimeout(timer); if (running.current === controller) { running.current = null; if (mounted.current) setBusy(false); } }
  };
  useEffect(() => { mounted.current = true; void refresh(); return () => { mounted.current = false; running.current?.abort(); running.current = null; }; }, []);
  const save = patch => {
    try { if (!contextRef.current().current()) return; setPreferences(writeStoragePreferences(namespace, { ...preferences, ...patch })); setNotice(L('Nastavení je uložené pro tento účet v tomto zařízení.', 'Settings are saved for this account on this device.')); }
    catch { setNotice(L('Nastavení se nepodařilo uložit. Zkontroluj volné místo v zařízení.', 'Settings could not be saved. Check the available space on your device.')); }
  };
  const persist = async () => {
    const context = contextRef.current();
    try {
      const granted = await navigator.storage?.persist?.();
      if (!mounted.current || !context.current()) return;
      setNotice(granted ? L('Prohlížeč povolil ochranu místních dat před automatickým uvolněním místa.', 'The browser granted protection against automatic storage eviction.') : L('Prohlížeč ochranu nepovolil nebo ji nepodporuje. Serverové soubory ani zálohy se tím nemění.', 'The browser did not grant protection or does not support it. Server files and backups are unchanged.'));
      void refresh();
    } catch { if (mounted.current && context.current()) setNotice(L('Ochranu se nepodařilo ověřit.', 'Storage protection could not be verified.')); }
  };
  const control = { minHeight: 44, padding: '8px 12px', border: `1px solid ${t.border}`, borderRadius: 8, background: t.card || t.bg, color: t.text, font: 'inherit', maxWidth: '100%', cursor: 'pointer' };
  const row = (label, value) => <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '7px 0', borderBottom: `1px solid ${t.borderSoft || t.border}` }}><span>{label}</span><strong style={{ fontWeight: 500, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{value}</strong></div>;
  const choice = (label, value, key, options) => <label style={{ display: 'grid', gap: 7, margin: '18px 0' }}>{label}<select aria-label={label} value={value} onChange={event => save({ [key]: Number(event.target.value) })} style={control}>{options.map(([v, label]) => <option value={v} key={v}>{label}</option>)}</select></label>;
  const estimate = recordingEstimate(preferences.audioKbps);
  return <div data-testid="storage-overview" style={{ padding: '12px 8px 20px', fontFamily: 'var(--tm-font-body)', fontSize: 14, lineHeight: 1.6, color: t.text, minWidth: 0 }}>
    <h3 style={{ fontSize: 19, fontWeight: 500, margin: '0 0 12px' }}>{L('Úložiště a limity', 'Storage and limits')}</h3>
    <p>{L('Poznámky, praxe a tréninky se ukládají do zařízení a po připojení synchronizují s účtem. Nové nahrávky a souborové přílohy se odesílají na server. Když odeslání selže, uložená místní kopie čeká na další pokus.', 'Notes, practice and training save on your device and sync with your account when connected. New recordings and file attachments upload to the server. If uploading fails, a saved local copy waits for another attempt.')}</p>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}><button type="button" onClick={refresh} disabled={busy} style={control}>{busy ? L('Načítám…', 'Loading…') : L('Obnovit přehled', 'Refresh usage')}</button><span style={{ color: t.textSec }}>{L('Pouze tvůj účet', 'Only your account')}</span></div>
    {error && <p role="alert">{error}</p>}
    <ServerStorageLimits key={namespace} t={t} lang={lang} namespace={namespace} getContext={getContext} active={active}/>
    {data && <>
      <h4 style={{ margin: '24px 0 8px', fontSize: 15 }}>{L('Na serveru', 'On the server')}</h4>
      {row(L('Osobní textová data', 'Personal text data'), data.state ? `${bytes(data.state.bytes)} / 10 MB` : L('Nezjištěno', 'Unknown'))}
      {data.state && <progress aria-label={L('Využití textových dat', 'Text data usage')} max={data.state.limit} value={data.state.bytes} style={{ width: '100%', accentColor: t.accent }}/>}
      {row(L('Nahrávky a přílohy', 'Recordings and attachments'), data.cloud ? `${data.cloud.count} · ${bytes(data.cloud.bytes)}` : L('Nezjištěno', 'Unknown'))}
      {data.cloud && <p style={{ color: t.textSec, fontSize: 13 }}>{L('Zvuk', 'Audio')} {bytes(data.cloud.audio)} · {L('Obrázky', 'Images')} {bytes(data.cloud.images)} · {L('Ostatní', 'Other')} {bytes(data.cloud.other)}</p>}
      {data.cloud?.bytes >= 3 * 1073741824 && <p role="status">{L('Média se blíží kapacitě jedné úplné zálohy. Jeden ZIP má limit pod 4 GiB včetně dalších dat. Zálohuj průběžně, u velké zálohy použij počítač.', 'Media is approaching the capacity of a complete backup. One ZIP must stay below 4 GiB including other data. Back up regularly and use a computer for large backups.')}</p>}
      {(!data.cloud || !data.state) && <p role="status">{L('Část serverového přehledu není dostupná. Chybějící údaj neznamená prázdné úložiště.', 'Part of the server overview is unavailable. A missing value does not mean empty storage.')}</p>}
      {data.state?.bytes >= data.state?.limit * .8 && <p role="status">{L('Textová data se blíží limitu. Připrav si úplnou zálohu a zkontroluj velké vložené obrázky nebo staré záznamy.', 'Text data is approaching its limit. Prepare a complete backup and review large embedded images or old records.')}</p>}
      <h4 style={{ margin: '24px 0 8px', fontSize: 15 }}>{L('V tomto zařízení', 'On this device')}</h4>
      {row(L('Místní kopie příloh', 'Local attachment copies'), data.local ? `${data.local.count} · ${bytes(data.local.bytes)}` : L('Nezjištěno', 'Unknown'))}
      {row(L('Čeká na odeslání', 'Waiting to upload'), `${data.pending.count} · ${bytes(data.pending.bytes)}`)}
      {row(L('Rozpracované nahrávky', 'Recording recovery copies'), data.drafts ? `${data.drafts.count} · ${bytes(data.drafts.bytes)}` : L('Nezjištěno', 'Unknown'))}
      {row(L('Odhad místa pro tuto aplikaci', 'Estimated app storage'), data.device ? `${bytes(data.device.usage)} / ${bytes(data.device.quota)}` : L('Prohlížeč neuvádí', 'Not reported'))}
      <p style={{ color: t.textSec, fontSize: 13 }}>{L('Odhad prohlížeče zahrnuje také mezipaměť a další účty používané na této adrese. Místní a serverové kopie se překrývají. Jejich velikosti nesčítej. Dostupné místo určuje prohlížeč a může se měnit.', 'The browser estimate includes cache and other accounts used at this address. Local and server copies overlap. Do not add their sizes together. Available space is controlled by the browser and may change.')}</p>
      <p>{data.persistent === true ? L('Ochrana před automatickým uvolněním místa je povolená.', 'Protection against automatic storage eviction is enabled.') : L('Místní data zatím nemají potvrzenou ochranu před automatickým uvolněním místa.', 'Local data does not have confirmed protection against automatic storage eviction.')}</p>
      {data.persistent !== true && <button type="button" onClick={persist} style={control}>{L('Požádat o ochranu místních dat', 'Request storage protection')}</button>}
      <p style={{ color: t.textSec, fontSize: 13 }}>{L('Ochrana nezabrání ručnímu vymazání dat. Úplnou zálohu ukládej i mimo tuto aplikaci. Položky označené „Uložit offline“ mají vlastní kopii pro čtení bez připojení.', 'Protection does not prevent manual deletion. Keep a complete backup outside this app too. Items marked “Save offline” have their own copy for reading without a connection.')}</p>
    </>}
    <h4 style={{ margin: '24px 0 8px', fontSize: 15 }}>{L('Jak využít místo', 'Making room')}</h4>
    {choice(L('Kvalita nových nahrávek', 'New recording quality'), preferences.audioKbps, 'audioKbps', [[32,L('Úsporná řeč · 32 kb/s','Compact speech · 32 kb/s')],[64,L('Běžná řeč · 64 kb/s','Standard speech · 64 kb/s')],[128,L('Vyšší kvalita · 128 kb/s','Higher quality · 128 kb/s')]])}
    <p style={{ color: t.textSec, fontSize: 13 }}>{L(`Hodina má přibližně ${bytes(estimate.hourBytes)}. Do limitu jednoho souboru vychází asi ${estimate.maxMinutes} minut. Skutečná velikost závisí na prohlížeči a formátu. Dlouhé nahrávky rozděl.`, `One hour is approximately ${bytes(estimate.hourBytes)}. About ${estimate.maxMinutes} minutes fit in one file. Actual size depends on the browser and format. Split long recordings.`)}</p>
    {choice(L('Nové fotopřílohy JPEG', 'New JPEG photo attachments'), preferences.photoSide, 'photoSide', [[0,L('Původní soubor','Original file')],[1600,L('Úsporné · delší strana 1600 px','Compact · longest side 1600 px')],[2560,L('Detailní · delší strana 2560 px','Detailed · longest side 2560 px')]])}
    <p style={{ color: t.textSec, fontSize: 13 }}>{L('Zmenšují se pouze nové fotky JPEG. Ostatní formáty a již uložené soubory zůstávají původní. Nastavení kvality platí pro tento účet v tomto zařízení.', 'Only new JPEG photos are resized. Other formats and existing files keep their originals. Quality settings apply to this account on this device.')}</p>
    {notice && <p role="status" aria-live="polite">{notice}</p>}
    <details style={{ marginTop: 24 }}><summary style={{ minHeight: 44, cursor: 'pointer' }}>{L('Přesné limity a co se kam ukládá', 'Exact limits and where data lives')}</summary>
      <ul style={{ paddingLeft: 20 }}>
        <li>{L('Jeden soubor: nejvýše 95 MiB (99 614 720 bajtů).', 'One file: up to 95 MiB (99,614,720 bytes).')}</li>
        <li>{L('Osobní textový dokument účtu: nejvýše 10 MB (10 000 000 bajtů v UTF-8). Zahrnuje texty, záznamy a odkazy na přílohy. Soubory na serveru jsou zvlášť.', 'Personal account document: up to 10 MB (10,000,000 UTF-8 bytes). Includes text, records and attachment references. Server files are separate.')}</li>
        <li>{localDocument === 'localstorage' ? L('Klientské texty v zařízení používají malé úložiště prohlížeče (localStorage), obvykle kolem 5 MiB pro tuto adresu. Místní limit může přijít dříve než serverový. Velká kapacita uvedená v odhadu prohlížeče tento limit nezvyšuje.', 'Client text on the device uses small browser storage (localStorage), usually around 5 MiB for this address. Its limit may be reached before the server limit. A large browser storage estimate does not increase this limit.') : L('Osobní texty v zařízení používají rozšířené úložiště prohlížeče (IndexedDB). Jeho kapacitu určuje prohlížeč společně s dalšími místními daty.', 'Personal text on the device uses expanded browser storage (IndexedDB). The browser determines its capacity together with other local data.')}</li>
        <li>{L('Kapacitu souborů řídí společný serverový strop, příděl účtu a případně tvůj nižší limit. Platí nejnižší dostupná hranice. Limity neodstraňují dříve uložené soubory.', 'File capacity follows the shared server cap, account allowance and your optional lower limit. The lowest available limit applies. Limits do not remove existing files.')}</li>
        <li>{L('Úplná záloha: jeden ZIP musí být menší než 4 GiB a mít méně než 65 535 položek. Příprava potřebuje také volnou paměť zařízení, proto může na telefonu narazit na limit dřív.', 'Complete backup: one ZIP must be smaller than 4 GiB and contain fewer than 65,535 entries. Preparation also needs available device memory, so a phone can reach its limit earlier.')}</li>
        <li>{L('Nastavení vzhledu, kvality, rozpracované nahrávky, místní obnovovací kopie a uložené soubory pro offline čtení zůstávají v zařízení. Dokončené zápisy a potvrzené přílohy se synchronizují s účtem. Sdílení s trenérem nebo druhým člověkem se řídí zvlášť nastavenými souhlasy.', 'Appearance and quality settings, unfinished recordings, local recovery copies and offline files stay on the device. Completed records and acknowledged attachments sync with the account. Sharing with a trainer or another person follows separate consent settings.')}</li>
      </ul>
    </details>
  </div>;
}
