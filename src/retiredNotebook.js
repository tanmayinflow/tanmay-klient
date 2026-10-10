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
