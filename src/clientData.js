const isRecord = value => !!value && typeof value === 'object' && !Array.isArray(value);
const OWNER_KEY = 'tm_owner_v1';
const COLL_KEY = 'tanmay_coll_v1';
const EDITS_KEY = 'tanmay_edits_v1';
const recoveryKey = owner => 'tanmay_practice_recovery_v1__owner_' + owner;

export function clientDataAccess({ owner, storedOwner, current, hydrated, member, conflict, pending, error, status }) {
  const canExport = !!owner && owner === storedOwner && current && hydrated && member === true && !conflict;
  return { canExport, canReset: canExport && !pending && !error && status === 'ready' };
}

export function clientSyncStatus({ status, hydrated, conflict, pending, error, busy }) {
  if (status === 'changed') return 'changed';
  if (conflict) return 'conflict';
  if (status === 'sign-in') return 'sign-in';
  if (status === 'offline') return 'offline';
  if (error) return 'error';
  if (busy) return 'sending';
  if (!hydrated) return 'loading';
  if (pending) return 'pending';
  return 'saved';
}

export function buildClientBackup(coll, edits, { date, lang = 'cs', safeName, bodyOut, recovery = [] }) {
  if (!isRecord(coll) || !isRecord(edits)) throw new Error('invalid-document');
  // A complete raw document is mandatory. Do not silently export only the readable subset.
  const files = [
    { path: '_data/coll.json', text: JSON.stringify(coll, null, 2) },
    { path: '_data/edits.json', text: JSON.stringify(edits, null, 2) },
    { path: '_data/practice-recovery.json', text: JSON.stringify(recovery, null, 2) },
  ];
  const used = new Set(files.map(file => file.path));
  const name = value => { const result = safeName(value); return /^\.+$/.test(result) ? 'bez-nazvu' : result; };
  const add = (path, title, text, entry) => {
    let unique = path, suffix = 2;
    while (used.has(unique)) unique = path.replace(/\.md$/, '') + ` (${suffix++}).md`;
    used.add(unique);
    const tags = Array.isArray(entry.tags) ? entry.tags : entry.tag ? [entry.tag] : [];
    files.push({ path: unique, text: `---\ntitle: ${JSON.stringify(String(title || ''))}\ndate: ${JSON.stringify(String(entry.date || ''))}\ntags: ${JSON.stringify(tags)}\n---\n\n${bodyOut(text)}` });
  };
  for (const entry of Array.isArray(coll.notebook) ? coll.notebook : []) {
    const folder = entry.folder ? String(entry.folder).split('/').filter(Boolean).map(name).join('/') + '/' : '';
    add('Zapisnik/' + folder + name(entry.title || entry.date || 'poznamka') + '.md', entry.title, entry.text, entry);
  }
  for (const entry of Array.isArray(coll.journal) ? coll.journal : []) {
    add('Denik/' + name([entry.date, entry.title].filter(Boolean).join(' ') || 'zapis') + '.md', entry.title || entry.date, entry.text, entry);
  }
  for (const entry of Array.isArray(coll.content) ? coll.content : []) {
    add('Prameny/' + name(entry.title || 'titul') + '.md', entry.title, entry.note || entry.text, entry);
  }
  files.push({ path: 'README.md', text: lang === 'cs'
    ? `# tanmay · klientská záloha\n\nStaženo ${date}.\n\nTexty jsou ve složkách Zapisnik, Denik a Prameny. Úplný osobní dokument této aplikace je v _data/coll.json a _data/edits.json. Neodeslané změny jsou zahrnuté.\n\nPřílohy a obrázky nejsou součástí archivu. Samostatná data Spolu, profil účtu a rezervace se spravují mimo tento dokument a v této záloze nejsou. Soubor nenahrazuje zálohu celého účtu.\n`
    : `# tanmay · client backup\n\nDownloaded ${date}.\n\nReadable text is in Zapisnik, Denik and Prameny. The complete personal document held by this app is in _data/coll.json and _data/edits.json. Unsent changes are included.\n\nAttachments and images are not included. Separate Together data, account profile and bookings are stored outside this document and are not included. This is not a backup of the entire account.\n` });
  return files;
}

export function readPracticeRecovery(storage, owner) {
  if (!owner || storage.getItem(OWNER_KEY) !== owner) return [];
  const value = JSON.parse(storage.getItem(recoveryKey(owner)) || '[]');
  if (!Array.isArray(value) || value.some(item => !isRecord(item) || !isRecord(item.edits) || item.owner !== owner)) throw new Error('invalid-recovery');
  return value;
}

// Local reset is allowed only after a current account and document were checked.
// Snapshot first, then write. A quota failure leaves the existing document intact.
export function changeClientPractice({ storage, owner, isCurrent, coll, edits, date, restore = false, now = Date.now() }) {
  if (!owner || !isCurrent(owner) || storage.getItem(OWNER_KEY) !== owner) throw new Error('account-changed');
  if (!isRecord(coll) || !isRecord(edits)) throw new Error('invalid-document');
  const beforeColl = storage.getItem(COLL_KEY), beforeEdits = storage.getItem(EDITS_KEY);
  if (JSON.stringify(JSON.parse(beforeColl || '{}')) !== JSON.stringify(coll) || JSON.stringify(JSON.parse(beforeEdits || '{}')) !== JSON.stringify(edits)) throw new Error('document-changed');
  const history = readPracticeRecovery(storage, owner);
  let nextColl, nextEdits;
  if (restore) {
    const index = history.findLastIndex(item => !item.restoredAt);
    if (index < 0) throw new Error('no-recovery');
    const previous = history[index];
    // Days written after reset win; recovering history never overwrites a new day.
    nextEdits = { ...previous.edits, ...edits };
    nextColl = { ...coll };
    if (previous.praxeStart === undefined) delete nextColl.praxeStart;
    else nextColl.praxeStart = previous.praxeStart;
    history[index] = { ...previous, restoredAt: now };
  } else {
    history.push({ owner, createdAt: now, date, praxeStart: coll.praxeStart, edits });
    nextColl = { ...coll, praxeStart: date };
    nextEdits = {};
  }
  const previousHistory = storage.getItem(recoveryKey(owner));
  storage.setItem(recoveryKey(owner), JSON.stringify(history));
  try {
    if (!isCurrent(owner) || storage.getItem(OWNER_KEY) !== owner) throw new Error('account-changed');
    storage.setItem(COLL_KEY, JSON.stringify(nextColl));
    storage.setItem(EDITS_KEY, JSON.stringify(nextEdits));
  } catch (error) {
    // Only undo writes while these active slots still belong to the same person.
    if (isCurrent(owner) && storage.getItem(OWNER_KEY) === owner) {
      try { if (beforeColl === null) storage.removeItem(COLL_KEY); else storage.setItem(COLL_KEY, beforeColl); } catch { /* recovery remains readable */ }
      try { if (beforeEdits === null) storage.removeItem(EDITS_KEY); else storage.setItem(EDITS_KEY, beforeEdits); } catch { /* recovery remains readable */ }
      if (restore) { try { if (previousHistory === null) storage.removeItem(recoveryKey(owner)); else storage.setItem(recoveryKey(owner), previousHistory); } catch { /* originals remain in recovery */ } }
    }
    throw error;
  }
  return { coll: nextColl, edits: nextEdits, recovery: history };
}
