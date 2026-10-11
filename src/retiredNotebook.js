// Fingerprints only: never bundle retired personal source text in Client.
const RETIRED = new Set([
  "a529d3a6506daf03f3408cf5333d91681e94dbece3aa00079d7b98c51824f6d4",
  "40bcb5415ed15eef5aefd9d57641371f91a8789a904eb16ec2cfa9aed7705ea1",
  "6cc7685f918fe00d7172fba86a61a8f9fee492844359a5f3e30e8386706292ad",
  "5a2ecfa5b5cf89867cbccdf3fd8e7e729292ce6af1f72707f3388c3f97502ff8",
  "37dbb6781c0b46f307b27bc14e431d991bd9212c6e3c05d6e542f16cb09b20a0",
  "9bc10e9199b00034c155d96cedef49b5aa9abce40470d582908bdfeb96c512e8"
]);
const signature = e => JSON.stringify([e.title || '', e.text || '']);
const eligible = e => e && !e.star && !e.pinned && !(e.att?.length) && !(e.attachments?.length) && !e.date;
export async function retiredPracticeCandidates(entries, approved = RETIRED) {
  const matches = await Promise.all((entries || []).map(async entry => {
    if (!eligible(entry)) return null;
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(signature(entry)));
    const digest = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2,'0')).join('');
    return approved.has(digest) ? {id:entry.id,signature:signature(entry)} : null;
  }));
  return matches.filter(Boolean);
}
export function archiveRetiredPracticeNotes(coll, candidates, now = Date.now()) {
  const matches = new Map(candidates.map(e => [e.id,e.signature]));
  const kept=[], archived=[];
  (coll.notebook || []).forEach((entry,index) => {
    if (eligible(entry) && matches.get(entry.id) === signature(entry)) archived.push({tid:'retired-practice-'+entry.id,kind:'entry',entryKind:'notebook',index,data:entry,label:entry.title,trashedAt:now});
    else kept.push(entry);
  });
  return {...coll,retiredPracticeNotesV1:true,notebook:kept,trash:[...archived,...(coll.trash || [])]};
}

// V2 repairs prematurely completed V1 runs. It recognizes the same six bodies,
// but only in their original import shape or documented system normalization.
// A custom folder, category, attachment, flag or additional field is preserved.
const PRACTICE_TAGS = new Set(['Praxe','Practices']);
const ORIGINAL_FIELDS = new Set(['id','title','text','date','tag','tags','folder','star','pinned','att','attachments']);
const originalPractice = entry => eligible(entry)
  && typeof entry.id === 'string' && !!entry.id
  && Object.keys(entry).every(key => ORIGINAL_FIELDS.has(key))
  && PRACTICE_TAGS.has(entry.tag)
  && (entry.tags === undefined || (Array.isArray(entry.tags) && entry.tags.length === 1 && PRACTICE_TAGS.has(entry.tags[0])))
  && (entry.folder === undefined || entry.folder === '' || entry.folder === 'Praxe');
const notebookSignature = notebook => JSON.stringify(notebook || []);

export async function prepareRetiredPracticeNotesV2(coll, {approved = RETIRED, now = Date.now()} = {}) {
  if (coll.retiredPracticeNotesV2) return current => current;
  const before = notebookSignature(coll.notebook);
  const candidates = await retiredPracticeCandidates((coll.notebook || []).filter(originalPractice), approved);
  const matches = new Map(candidates.map(entry => [entry.id, entry.signature]));
  return current => {
    // A newer document/edit must be inspected on its own, not sealed by a hash
    // prepared for older records. The account effect retries when data changes.
    if (current.retiredPracticeNotesV2 || notebookSignature(current.notebook) !== before) return current;
    const notebook = [], trash = [...(current.trash || [])];
    (current.notebook || []).forEach((entry,index) => {
      if (!originalPractice(entry) || matches.get(entry.id) !== signature(entry)) { notebook.push(entry); return; }
      const tid = 'retired-practice-v2-' + entry.id;
      if (!trash.some(item => item.tid === tid && item.entryKind === 'notebook' && notebookSignature(item.data) === notebookSignature(entry))) {
        trash.unshift({tid,kind:'entry',entryKind:'notebook',index,data:entry,label:entry.title,trashedAt:now});
      }
    });
    return {...current,retiredPracticeNotesV2:true,notebook,trash};
  };
}
