import React, { useEffect, useRef, useState } from 'react';
import { limitFromMegabytes, storageLimitsRequest } from '../product/storageLimits.js';

function LimitEditor({ label, value, maximum, busy, save, control, L, inherited = false }) {
  const [draft, setDraft] = useState(value == null ? '' : String(value / 1000000));
  const [error, setError] = useState('');
  useEffect(() => { setDraft(value == null ? '' : String(value / 1000000)); setError(''); }, [value]);
  const submit = event => {
    event.preventDefault();
    try { const bytes = limitFromMegabytes(draft, maximum); setError(''); void save(bytes); }
    catch { setError(L(`Zadej číslo od 0 do ${maximum / 1000000} MB.`, `Enter a number from 0 to ${maximum / 1000000} MB.`)); }
  };
  return <form onSubmit={submit} style={{ margin: '12px 0 20px' }}>
    <label style={{ display: 'grid', gap: 6 }}>{label}<span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input aria-label={label} inputMode="decimal" value={draft} onChange={event => { setDraft(event.target.value); setError(''); }} disabled={busy} placeholder={inherited ? L('Podle přídělu', 'Use allowance') : '0'} style={{ ...control, fontSize: 16, width: 160, minWidth: 0, cursor: 'text' }}/><span>MB</span>
    </span></label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}><button type="submit" style={control} disabled={busy || !draft.trim()}>{L('Uložit limit', 'Save limit')}</button>
      {inherited && <button type="button" style={control} disabled={busy || value == null} onClick={() => save(null)}>{L('Použít celý příděl', 'Use full allowance')}</button>}
    </div>
    {error && <p role="alert">{error}</p>}
  </form>;
}

export function ServerStorageLimits({ t, lang = 'cs', namespace, getContext, active = true }) {
  const L = (cs, en) => lang === 'en' ? en : cs;
  const [data, setData] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const contextRef = useRef(getContext); contextRef.current = getContext;
  const operation = useRef(null), mounted = useRef(false), identity = useRef(namespace); identity.current = namespace;
  const run = async patch => {
    if (!active || operation.current) return;
    const controller = new AbortController(), owner = namespace, context = contextRef.current();
    operation.current = controller;
    const valid = () => mounted.current && identity.current === owner && !controller.signal.aborted && (context.current?.() ?? true);
    const timer = setTimeout(() => controller.abort(), 20000);
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await storageLimitsRequest({ ...context, current: valid, signal: controller.signal }, patch);
      if (valid()) { setData(result); if (patch) setNotice(L('Limit je uložený na serveru a platí ve všech zařízeních.', 'The limit is saved on the server and applies on every device.')); }
    } catch {
      if (mounted.current && identity.current === owner && (context.current?.() ?? true)) setError(patch
        ? L('Uložení limitu se nepodařilo potvrdit. Obnov přehled a zkontroluj platný limit.', 'Could not confirm the saved limit. Refresh usage to check the current limit.')
        : L('Serverové limity se nepodařilo načíst. Zkontroluj připojení a obnov přehled. Nedostupný údaj neznamená volné místo.', 'Could not load server limits. Check your connection and refresh. An unavailable value does not mean free space.'));
    } finally { clearTimeout(timer); if (operation.current === controller) { operation.current = null; if (mounted.current) setBusy(false); } }
  };
  useEffect(() => {
    mounted.current = true; setData(null); setError(''); setNotice(''); void run();
    return () => { mounted.current = false; operation.current?.abort(); operation.current = null; };
  }, [namespace, active]);
  const control = { minHeight: 44, padding: '8px 12px', border: `1px solid ${t.border}`, borderRadius: 8, background: t.card || t.bg, color: t.text, font: 'inherit', maxWidth: '100%', cursor: 'pointer' };
  const bytes = value => value < 1000000 ? `${Math.ceil(value / 1000)} kB` : value < 1000000000 ? `${(value / 1000000).toLocaleString(lang, { maximumFractionDigits: 1 })} MB` : `${(value / 1000000000).toLocaleString(lang, { maximumFractionDigits: 2 })} GB`;
  const row = (label, value) => <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4px 12px', padding: '7px 0', borderBottom: `1px solid ${t.borderSoft || t.border}` }}><span>{label}</span><strong style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{value}</strong></div>;
  const edit = props => <LimitEditor {...props} busy={busy || !data?.ready} control={control} L={L}/>;
  const meter = (label, value, limit) => <progress aria-label={label} max={limit || 1} value={Math.min(value, limit || 1)} style={{ width: '100%', accentColor: t.accent }}/>;
  return <section data-testid="server-storage-limits" aria-label={L('Serverové limity', 'Server limits')} style={{ padding: '16px 0', margin: '20px 0', borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
    <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>{L('Serverové limity', 'Server limits')}</h4>
    <p>{L('Při dosažení limitu server zastaví další nahrávání. Uložené soubory zůstanou zachované. Limit můžeš snížit i pod aktuální obsazení, nic se tím nesmaže.', 'The server stops further uploads when a limit is reached. Saved files remain available. Lowering a limit below current usage does not delete anything.')}</p>
    <button type="button" onClick={() => run()} disabled={busy} style={control}>{busy ? L('Načítám…', 'Loading…') : L('Obnovit serverové limity', 'Refresh server limits')}</button>
    {error && <p role="alert">{error}</p>}
    {data && <>
      {!data.ready && <p role="status">{L('Úložiště ještě nemá dokončenou kontrolu obou aplikací. Nové nahrávání zůstává zastavené. Po dokončení kontroly obnov přehled.', 'Both app inventories have not been verified yet. New uploads remain stopped. Refresh after verification is complete.')}</p>}
      <h5 style={{ fontSize: 14, margin: '24px 0 8px' }}>{L('Tvůj prostor pro soubory', 'Your file storage')}</h5>
      {row(L('Uloženo', 'Stored'), bytes(data.own.usedBytes))}
      {data.own.reservedBytes > 0 && row(L('Rezervováno pro odesílání', 'Reserved for uploads'), bytes(data.own.reservedBytes))}
      {row(L('Platný limit', 'Effective limit'), bytes(data.own.effectiveLimitBytes))}
      {meter(L('Využití tvého přídělu', 'Your allowance usage'), data.own.usedBytes + data.own.reservedBytes, data.own.effectiveLimitBytes)}
      {row(L('Maximální příděl', 'Maximum allowance'), bytes(data.own.limitBytes))}
      {data.own.usedBytes + data.own.reservedBytes >= data.own.effectiveLimitBytes && <p role="status">{L('Tvůj limit je vyčerpaný. Nové soubory se neodešlou, dokud se neuvolní místo nebo nezvýší příděl.', 'Your limit is reached. New files cannot upload until space is available or your allowance increases.')}</p>}
      {edit({ label: L('Můj vlastní nižší limit', 'My personal lower limit'), value: data.own.personalLimitBytes, maximum: data.own.limitBytes, inherited: true, save: personalLimitBytes => run({ personalLimitBytes }) })}
      <h5 style={{ fontSize: 14, margin: '24px 0 8px' }}>{L('Společná kapacita obou aplikací', 'Shared capacity of both apps')}</h5>
      {row(L('Uloženo celkem', 'Total stored'), `${bytes(data.pool.usedBytes)} / ${bytes(data.limits.globalBytes)}`)}
      {data.pool.reservedBytes > 0 && row(L('Probíhající odesílání', 'Uploads in progress'), bytes(data.pool.reservedBytes))}
      {meter(L('Využití společného prostoru', 'Shared storage usage'), data.pool.usedBytes + data.pool.reservedBytes, data.limits.globalBytes)}
      <p style={{ color: t.textSec }}>{L(`Bezplatná kapacita je společná, ne pro každého zvlášť. Ochranný strop ${bytes(data.limits.globalBytes)} ponechává rezervu do ${bytes(data.limits.freeBytes)}. Příděly místo nerezervují, vždy platí i společný strop.`, `Free capacity is shared, not separate for each person. The ${bytes(data.limits.globalBytes)} safety cap leaves a reserve below ${bytes(data.limits.freeBytes)}. Allowances do not reserve space; the shared cap always applies.`)}</p>
      {data.role === 'main' && <details style={{ marginTop: 20 }}><summary style={{ minHeight: 44, cursor: 'pointer' }}>{L('Moje příděly a jednotliví klienti', 'My allowance and individual clients')}</summary>
        {edit({ label: L('Výchozí příděl nového klienta', 'Default allowance for new clients'), value: data.limits.defaultClientBytes, maximum: data.limits.globalBytes, save: defaultClientBytes => run({ defaultClientBytes }) })}
        <p style={{ color: t.textSec }}>{L('Upravuješ pouze kapacitu. Soukromé texty ani soubory klientů se tu nezobrazují. Nula pozastaví nové nahrávání.', 'Only capacity is managed here. Client private writing and files are not shown. Zero stops new uploads.')}</p>
        {data.accounts.map(account => <div key={account.userId} style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, marginTop: 16, overflowWrap: 'anywhere' }}>
          <strong style={{ fontWeight: 500 }}>{account.userId === data.own.userId ? L('Moje aplikace', 'My app') : account.name || account.email || account.userId}</strong>
          {account.name && account.email && <div style={{ color: t.textSec }}>{account.email}</div>}
          {row(L('Uloženo', 'Stored'), bytes(account.usedBytes))}
          {row(L('Platný limit', 'Effective limit'), bytes(account.effectiveLimitBytes))}
          {edit({ label: L('Příděl souborů', 'File allowance'), value: account.limitBytes, maximum: data.limits.globalBytes, save: limitBytes => run({ userId: account.userId, limitBytes }) })}
        </div>)}
      </details>}
      <details style={{ marginTop: 20 }}><summary style={{ minHeight: 44, cursor: 'pointer' }}>{L('Provozní ochrana a její rozsah', 'Operational protection and its scope')}</summary>
        {row(L('Dnešní zápisy a seznamy', 'Writes and listings today'), `${data.operations.a.toLocaleString(lang)} / ${data.limits.dailyA.toLocaleString(lang)}`)}
        {row(L('Dnešní čtení souborů', 'File reads today'), `${data.operations.b.toLocaleString(lang)} / ${data.limits.dailyB.toLocaleString(lang)}`)}
        <p>{L(`Den podle UTC: ${data.operations.day}. Při dosažení denní hranice se příslušné operace zastaví do dalšího dne. Čtení může být dočasně nedostupné i u uložených souborů.`, `UTC day: ${data.operations.day}. At a daily limit, those operations stop until the next day. Reading saved files can also become temporarily unavailable.`)}</p>
        <p>{L('Ochrana se vztahuje na soubory obou aplikací. Není limitem plateb celého Cloudflare účtu. Přímé nahrávání mimo aplikace, další služby nebo změna tarifu se řídí zvlášť. Přehled neobsahuje fakturu poskytovatele.', 'Protection covers files handled by both apps. It is not an account-wide Cloudflare spending cap. Direct uploads outside the apps, other services or plan changes are separate. This overview is not the provider invoice.')}</p>
        <p>{L('Databáze má na bezplatném tarifu nejvýše 500 MB pro osobní aplikaci a 500 MB společně pro klienty. Textový dokument jednoho účtu má navíc limit 10 MB. Denní bezplatné limity serveru a databáze vynucuje poskytovatel.', 'On the free plan, the personal app database has up to 500 MB and all clients share another 500 MB. Each account text document also has a 10 MB limit. The provider enforces daily free server and database limits.')}</p>
      </details>
    </>}
    {notice && <p role="status" aria-live="polite">{notice}</p>}
  </section>;
}
