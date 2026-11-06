// Durable chunks live in the captured account's namespace, never a later login.
export function createRecordingDraftStore({ namespace, database = globalThis.indexedDB, current = () => true }) {
  if (!namespace) throw new Error('recording-account');
  let opening;
  const guard = () => { if (!current()) throw new Error('account-changed'); };
  const open = () => {
    guard();
    if (!opening) opening = new Promise((resolve, reject) => {
      if (!database) { reject(new Error('recording-storage')); return; }
      const request = database.open('tanmay_recording_drafts_v1_' + namespace, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('drafts', { keyPath: 'id' });
        request.result.createObjectStore('chunks', { keyPath: ['draftId', 'sequence'] }).createIndex('draft', 'draftId');
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('recording-storage-blocked'));
      request.onsuccess = () => { const db = request.result; db.onversionchange = () => { db.close(); opening = null; }; resolve(db); };
    }).catch(error => { opening = null; throw error; });
    return opening;
  };
  const transaction = async (write, work) => {
    guard(); const db = await open(); guard();
    return new Promise((resolve, reject) => {
      let tx;
      try { tx = db.transaction(['drafts', 'chunks'], write ? 'readwrite' : 'readonly', { durability: 'strict' }); }
      catch (error) { if (error?.name !== 'TypeError') { reject(error); return; } tx = db.transaction(['drafts', 'chunks'], write ? 'readwrite' : 'readonly'); }
      let result;
      tx.oncomplete = () => { try { guard(); resolve(result); } catch (error) { reject(error); } };
      tx.onabort = () => reject(tx.error || new Error('recording-storage-aborted'));
      tx.onerror = () => {};
      try { work(tx.objectStore('drafts'), tx.objectStore('chunks'), value => { result = value; }, tx); }
      catch (error) { tx.abort(); reject(error); }
    });
  };
  return {
    create: metadata => transaction(true, (drafts, _chunks, done) => {
      const draft = { ...metadata, createdAt: Date.now(), bytes: 0, segments: 0 };
      drafts.add(draft); done(draft);
    }),
    append: (id, sequence, blob) => transaction(true, (drafts, chunks, _done, tx) => {
      const request = drafts.get(id);
      request.onsuccess = () => {
        const row = request.result;
        if (!row) return; // Explicitly cancelled drafts must never reappear.
        if (sequence !== row.segments) { tx.abort(); return; }
        chunks.add({ draftId: id, sequence, blob });
        drafts.put({ ...row, bytes: row.bytes + blob.size, segments: row.segments + 1, type: row.type || blob.type });
      };
    }),
    list: () => transaction(false, (drafts, _chunks, done) => { drafts.getAll().onsuccess = event => done(event.target.result); }),
    read: id => transaction(false, (drafts, chunks, done, tx) => {
      const request = drafts.get(id);
      request.onsuccess = () => {
        const metadata = request.result;
        if (!metadata) { done(null); return; }
        chunks.index('draft').getAll(id).onsuccess = event => {
          const rows = event.target.result.sort((a, b) => a.sequence - b.sequence);
          if (rows.length !== metadata.segments || rows.some((row, index) => row.sequence !== index)) { tx.abort(); return; }
          const blob = new Blob(rows.map(row => row.blob), { type: metadata.type || 'audio/webm' });
          if (blob.size !== metadata.bytes) { tx.abort(); return; }
          done({ ...metadata, blob });
        };
      };
    }),
    remove: id => transaction(true, (drafts, chunks) => {
      drafts.delete(id);
      chunks.index('draft').openKeyCursor(id).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) { chunks.delete(cursor.primaryKey); cursor.continue(); }
      };
    }),
  };
}
