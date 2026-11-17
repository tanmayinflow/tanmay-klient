// Only coach-owned roster metadata changes. Account membership and private client
// documents are outside this migration.
export function hideBodybodyClients(coll) {
  if (!coll || coll.klBodybodyHidden1) return coll;
  return { ...coll, klBodybodyHidden1: true, klProfiles: (coll.klProfiles || []).map(profile =>
    String(profile.source || '').trim().toLowerCase() === 'bodybody' ||
    (profile.tags || []).some(tag => String(tag).toLowerCase() === 'bodybody')
      ? { ...profile, hidden: true } : profile) };
}

export function clientAccountSummary(accounts, now = Date.now()) {
  return { total: accounts.length, recent: accounts.filter(row => Number(row.last_active) > now - 30 * 86400000).length };
}
