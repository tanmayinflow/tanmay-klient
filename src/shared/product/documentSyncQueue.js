// A document has one commit stream. Read the current draft inside the queued
// job, so a delayed request can never borrow a newer job's server revision.
export function createDocumentSyncQueue() {
  let tail = Promise.resolve();
  return job => {
    const result = tail.then(job, job);
    tail = result.catch(() => {});
    return result;
  };
}
