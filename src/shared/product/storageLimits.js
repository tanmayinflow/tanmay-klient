const nonnegative = value => Number.isSafeInteger(value) && value >= 0;
export function validateStorageLimits(data) {
  if (data?.ok !== true || !['main', 'client'].includes(data.role) || typeof data.ready !== 'boolean') throw new Error('storage-invalid');
  for (const key of ['globalBytes', 'freeBytes', 'dailyA', 'dailyB', 'defaultClientBytes']) if (!nonnegative(data.limits?.[key])) throw new Error('storage-invalid');
  if (!data.limits.globalBytes || data.limits.globalBytes > data.limits.freeBytes) throw new Error('storage-invalid');
  for (const key of ['usedBytes', 'reservedBytes']) if (!nonnegative(data.pool?.[key])) throw new Error('storage-invalid');
  const account = row => {
    if (typeof row?.userId !== 'string' || !row.userId) throw new Error('storage-invalid');
    for (const key of ['usedBytes', 'reservedBytes', 'limitBytes', 'effectiveLimitBytes']) if (!nonnegative(row[key])) throw new Error('storage-invalid');
    if (row.personalLimitBytes !== null && !nonnegative(row.personalLimitBytes)) throw new Error('storage-invalid');
    if (row.effectiveLimitBytes !== Math.min(row.limitBytes, row.personalLimitBytes ?? row.limitBytes)) throw new Error('storage-invalid');
  };
  account(data.own);
  if (!nonnegative(data.operations?.a) || !nonnegative(data.operations?.b) || typeof data.operations?.day !== 'string') throw new Error('storage-invalid');
  if (data.role === 'main') {
    if (!Array.isArray(data.accounts)) throw new Error('storage-invalid');
    data.accounts.forEach(account);
  }
  return data;
}
export function limitFromMegabytes(value, maximum) {
  const text = String(value).trim().replace(',', '.');
  if (!/^\d+(?:\.\d{1,6})?$/.test(text)) throw new Error('storage-limit-invalid');
  const bytes = Math.round(Number(text) * 1000000);
  if (!nonnegative(bytes) || bytes > maximum) throw new Error('storage-limit-invalid');
  return bytes;
}
export async function storageLimitsRequest({ fetcher = fetch, current = () => true, signal }, patch) {
  const guard = () => { if (signal?.aborted || !current()) throw new Error('account-changed'); };
  guard();
  const response = await fetcher('/api/storage', {
    method: patch ? 'PUT' : 'GET', cache: 'no-store', redirect: 'manual', signal,
    ...(patch ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) } : {}),
  });
  guard();
  if (response.redirected || response.type === 'opaqueredirect' || !/application\/json/i.test(response.headers.get('content-type') || '')) throw new Error('storage-unavailable');
  const data = await response.json(); guard();
  if (!response.ok) throw new Error(data?.error || data?.code || 'storage-unavailable');
  return validateStorageLimits(data);
}
