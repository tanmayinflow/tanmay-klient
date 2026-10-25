// Recovery snapshots have their own IndexedDB allocation. Active documents
// remain ordinary localStorage JSON, including for older open application tabs.
export function createIndexedRecoveryStore({ indexedDB = globalThis.indexedDB, database = "tanmay_recovery_v1", key = "tanmay_zaloha_v1" } = {}) {
  let opening;
  const open = () => {
    if (!opening) opening = new Promise((resolve, reject) => {
      if (!indexedDB) { reject(new Error("RecoveryStorageUnavailable")); return; }
      const request = indexedDB.open(database, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("archives");
      request.onerror = () => reject(request.error || new Error("RecoveryStorageOpenFailed"));
      request.onblocked = () => reject(new Error("RecoveryStorageBlocked"));
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); opening = null; };
        resolve(db);
      };
    }).catch(error => { opening = null; throw error; });
    return opening;
  };
  async function transact(expected, value, writing) {
    const db = await open();
    return new Promise((resolve, reject) => {
      let tx;
      // Strict durability where supported; older Safari accepts two arguments.
      try { tx = db.transaction("archives", writing ? "readwrite" : "readonly", { durability: "strict" }); }
      catch (error) { if (error?.name !== "TypeError") { reject(error); return; } tx = db.transaction("archives", writing ? "readwrite" : "readonly"); }
      let result = writing ? false : null;
      const store = tx.objectStore("archives"), request = store.get(key);
      request.onsuccess = () => {
        const current = request.result ?? null;
        if (!writing) result = current;
        else if (current === expected) { store.put(value, key); result = true; }
      };
      tx.oncomplete = () => resolve(result); // request success alone is not a committed write
      tx.onabort = () => reject(tx.error || new Error("RecoveryStorageAborted"));
      tx.onerror = () => {}; // onabort owns the failure; never acknowledge a partial transaction
    });
  }
  return { read: () => transact(null, null, false), compareAndSwap: (expected, value) => transact(expected, value, true) };
}
