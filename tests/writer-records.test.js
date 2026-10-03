import { test } from "node:test";
import assert from "node:assert/strict";
import { addWriterFolder, moveWriterFolder, removeWriterFolder, restoreWriterEntries } from "../src/writerRecords.js";

test("nested folders move together with notes without changing their content or coach data", () => {
  const coachSources = { sources: [{ id: "shared", name: "From coach" }] };
  const original = { coachSources, notebook: [{ id: "a", folder: "Practice/Morning", text: "My words", att: [{ id: "voice" }] }, { id: "b", folder: "Other", text: "Keep" }], nbFolders: ["Practice", "Practice/Morning", "Other"] };
  const renamed = moveWriterFolder(original, "Practice", "Personal/Practice");
  assert.equal(renamed.notebook[0].folder, "Personal/Practice/Morning");
  assert.equal(renamed.notebook[0].text, "My words");
  assert.deepEqual(renamed.notebook[0].att, [{ id: "voice" }]);
  assert.equal(renamed.coachSources, coachSources);
  assert.equal(renamed.notebook[1], original.notebook[1]);
  assert.equal(original.notebook[0].folder, "Practice/Morning");
  assert.ok(renamed.nbFolders.includes("Personal"));
});

test("folder collisions and recursive moves preserve every record", () => {
  const records = { notebook: [{ id: "a", folder: "A" }], nbFolders: ["A", "A/Child", "B"] };
  assert.equal(moveWriterFolder(records, "A", "A/Child/New"), records);
  assert.equal(moveWriterFolder(records, "A", "B"), records);
  const added = addWriterFolder(records, "/New / Deep / Folder/");
  assert.deepEqual(added.nbFolders.filter(x => x.startsWith("New")), ["New", "New/Deep", "New/Deep/Folder"]);
});

test("removing a folder keeps its notes and attachments one level above", () => {
  const records = { notebook: [{ id: "a", folder: "Work/Old/Deep", text: "Keep", att: [{ id: "v" }] }], nbFolders: ["Work", "Work/Old", "Work/Old/Deep"] };
  const next = removeWriterFolder(records, "Work/Old");
  assert.deepEqual(next.nbFolders, ["Work"]);
  assert.deepEqual(next.notebook, [{ id: "a", folder: "Work", text: "Keep", att: [{ id: "v" }] }]);
});

test("bulk undo restores all selected entries atomically, retains concurrent notes and leaves unrelated trash", () => {
  const records = { notebook: [{ id: "new", text: "Written after delete" }], journal: [{ id: "j" }], trash: [
    { tid: "t2", kind: "entry", entryKind: "notebook", index: 1, data: { id: "b", att: [{ id: "voice", name: "audio.webm" }] } },
    { tid: "tj", kind: "entry", entryKind: "journal", index: 0, data: { id: "b" } },
    { tid: "t1", kind: "entry", entryKind: "notebook", index: 0, data: { id: "a", text: "Private" } },
  ] };
  const restored = restoreWriterEntries(records, "notebook", ["a", "b"]);
  assert.deepEqual(restored.notebook.map(e => e.id), ["a", "b", "new"]);
  assert.equal(restored.notebook[1].att[0].id, "voice");
  assert.deepEqual(restored.trash.map(e => e.tid), ["tj"]);
  assert.equal(restored.journal, records.journal);
  assert.equal(restoreWriterEntries(restored, "notebook", ["a", "b"]), restored);
  assert.equal(restoreWriterEntries(records, "coachSources", ["a"]), records);
});
