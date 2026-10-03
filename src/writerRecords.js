// Local records only. These transforms never read a coach feed or seed content.
const pathOf = value => String(value || "").split("/").map(x => x.trim()).filter(Boolean).join("/");
const inside = (folder, path) => folder === path || String(folder || "").startsWith(path + "/");
const sorted = values => [...new Set(values)].sort((a, b) => a.localeCompare(b, "cs"));
export const writerFolders = records => sorted([...(records.nbFolders || []), ...(records.notebook || []).map(e => e.folder).filter(Boolean)]);
export function addWriterFolder(records, value) {
  const path = pathOf(value);
  if (!path || writerFolders(records).includes(path)) return records;
  const parts = path.split("/");
  return { ...records, nbFolders: sorted([...writerFolders(records), ...parts.map((_, i) => parts.slice(0, i + 1).join("/"))]) };
}
export function moveWriterFolder(records, path, destination) {
  const target = pathOf(destination);
  if (!path || !target || target === path || inside(target, path) || writerFolders(records).includes(target)) return records;
  const move = folder => inside(folder, path) ? target + folder.slice(path.length) : folder;
  const parents = target.split("/").map((_, i, a) => a.slice(0, i + 1).join("/"));
  return { ...records, nbFolders: sorted([...writerFolders(records).map(move), ...parents]), notebook: (records.notebook || []).map(e => inside(e.folder, path) ? { ...e, folder: move(e.folder) } : e) };
}
export function removeWriterFolder(records, path) {
  if (!path) return records;
  const parent = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
  return { ...records, nbFolders: writerFolders(records).filter(f => !inside(f, path)), notebook: (records.notebook || []).map(e => inside(e.folder, path) ? { ...e, folder: parent } : e) };
}
export function restoreWriterEntries(records, kind, ids, restoreCascade = value => value) {
  if (kind !== "notebook" && kind !== "journal") return records;
  const wanted = new Set(ids);
  const restoring = (records.trash || []).filter(x => x.kind === "entry" && x.entryKind === kind && wanted.has(x.data?.id)).sort((a, b) => (a.index || 0) - (b.index || 0));
  if (!restoring.length) return records;
  const trashIds = new Set(restoring.map(x => x.tid));
  let next = { ...records, [kind]: [...(records[kind] || [])], trash: (records.trash || []).filter(x => !trashIds.has(x.tid)) };
  for (const item of restoring) {
    if (!next[kind].some(e => e.id === item.data.id)) {
      next[kind].splice(Math.max(0, Math.min(item.index || 0, next[kind].length)), 0, item.data);
      next = restoreCascade(next, item.cx);
    }
  }
  return next;
}
