import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeLongTermGoals, landscapeLongTermGoals, saveLongTermGoal, archiveLongTermGoal, goalLongTermGoal, linkGoalToLongTerm, reconcileGoalLongTermLink, renamedGoalLandscapeEdits } from "../src/shared/product/longTermGoals.js";

const areas = [{ name: "Body" }, { name: "Art" }];
const goal = { id: "ordinary-1", name: "Practice a little", area: "Body", areas: ["Body"] };
const withDirection = () => saveLongTermGoal({}, "Body", { id: "direction-1", name: "Move with confidence" }, 10);

test("old accounts have no invented long-term goals; malformed imported records are read safely", () => {
  assert.deepEqual(landscapeLongTermGoals({}, "Body"), []);
  assert.deepEqual(normalizeLongTermGoals({ name: "not an array" }), []);
  const records = normalizeLongTermGoals([null, "bad", {}, { id: "a", name: "  A goal  ", target: "2026-02-30", completed: "yes" }, { id: "a", name: "Duplicate" }, { id: "b", name: "Other", target: "2028-02-29" }]);
  assert.deepEqual(records.map(item => item.name), ["A goal", "Other"]);
  assert.equal(records[0].target, "");
  assert.equal(records[0].completed, false);
  assert.equal(records[1].target, "2028-02-29");
});

test("creating and editing directions preserves landscape notes, unknown fields and unrelated private records", () => {
  const source = { areaMeta: { Body: { text: "Private landscape writing", files: [{ id: "f" }], longTermGoals: [null] }, Art: { text: "Other writing" } }, journal: [{ id: "private" }] };
  const created = saveLongTermGoal(source, "Body", { id: "a", name: "  Walk freely  ", note: "My reason", target: "2027-05-01" }, 10);
  assert.equal(source.areaMeta.Body.longTermGoals.length, 1);
  assert.strictEqual(created.areaMeta.Art, source.areaMeta.Art);
  assert.strictEqual(created.journal, source.journal);
  assert.strictEqual(created.areaMeta.Body.files, source.areaMeta.Body.files);
  assert.equal(created.areaMeta.Body.text, "Private landscape writing");
  assert.equal(created.areaMeta.Body.longTermGoals[0], null);
  const edited = saveLongTermGoal(created, "Body", { id: "a", name: "Walk outside", completed: true }, 20);
  const result = landscapeLongTermGoals(edited, "Body")[0];
  assert.equal(result.name, "Walk outside");
  assert.equal(result.note, "My reason");
  assert.equal(result.target, "2027-05-01");
  assert.equal(result.createdAt, 10);
  assert.equal(result.updatedAt, 20);
  assert.equal(result.completed, true);
  assert.strictEqual(saveLongTermGoal(source, "Body", { id: "a", name: "  " }, 10), source);
  assert.strictEqual(saveLongTermGoal(source, "", { id: "a", name: "No landscape" }, 10), source);
});

test("ordinary and coach-assigned goals may have a private link only within their own landscape", () => {
  const coll = saveLongTermGoal(withDirection(), "Art", { id: "art-1", name: "Make a book" }, 20);
  const linked = linkGoalToLongTerm(coll, goal, "direction-1", areas);
  assert.equal(goalLongTermGoal(linked, goal, areas).name, "Move with confidence");
  assert.strictEqual(linkGoalToLongTerm(coll, goal, "art-1", areas), coll);
  assert.strictEqual(linkGoalToLongTerm(coll, { ...goal, area: "" , areas: [] }, "direction-1", areas), coll);
  assert.strictEqual(linkGoalToLongTerm(coll, goal, "direction-1", [{ name: "Art" }]), coll);
  const coachGoal = { ...goal, owner: "coach", locked: true };
  const coachLinked = linkGoalToLongTerm(coll, coachGoal, "direction-1", areas);
  assert.equal(coachLinked.goalMeta[goal.name].longTermGoalId, "direction-1");
  assert.equal(coachLinked.coachGoals, undefined);
  assert.equal(coachLinked.goalProgress, undefined);
  assert.deepEqual(coachGoal, { ...goal, owner: "coach", locked: true });
});

test("unlinking keeps notes and directions; a missing/deleted direction never resolves", () => {
  const coll = { ...withDirection(), goalMeta: { [goal.name]: { text: "My note" } } };
  const linked = linkGoalToLongTerm(coll, goal, "direction-1", areas);
  const unlinked = linkGoalToLongTerm(linked, goal, "", areas);
  assert.equal(goalLongTermGoal(unlinked, goal, areas), null);
  assert.equal(unlinked.goalMeta[goal.name].text, "My note");
  assert.strictEqual(unlinked.areaMeta, linked.areaMeta);
  assert.equal(goalLongTermGoal({ ...linked, areaMeta: {} }, goal, areas), null);
  assert.equal(goalLongTermGoal(linked, goal, [{ name: "Art" }]), null);
});

test("archiving retains an understandable existing link but prevents new links and can be restored", () => {
  const linked = linkGoalToLongTerm(withDirection(), goal, "direction-1", areas);
  const archived = archiveLongTermGoal(linked, "Body", "direction-1", true, 25);
  assert.deepEqual(landscapeLongTermGoals(archived, "Body"), []);
  assert.equal(goalLongTermGoal(archived, goal, areas).archivedAt, 25);
  assert.strictEqual(linkGoalToLongTerm(archived, { ...goal, name: "A new goal" }, "direction-1", areas), archived);
  const restored = archiveLongTermGoal(archived, "Body", "direction-1", false, 30);
  assert.equal(landscapeLongTermGoals(restored, "Body").length, 1);
  assert.equal(goalLongTermGoal(restored, goal, areas).archivedAt, 0);
});

test("changing landscape clears its old link and returning later does not resurrect it", () => {
  const linked = linkGoalToLongTerm(withDirection(), goal, "direction-1", areas);
  assert.strictEqual(reconcileGoalLongTermLink(linked, goal.name, { status: "Completed" }), linked);
  assert.strictEqual(reconcileGoalLongTermLink(linked, goal.name, { area: "Body", areas: ["Body"] }), linked);
  const moved = reconcileGoalLongTermLink(linked, goal.name, { area: "Art", areas: ["Art"] });
  assert.equal(moved.goalMeta[goal.name].longTermGoalId, "");
  assert.equal(goalLongTermGoal(moved, goal, areas), null);
  assert.equal(goalLongTermGoal(linked, { ...goal, area: "Art" }, areas), null);
  assert.equal(reconcileGoalLongTermLink(linked, goal.name, { area: "", areas: [] }).goalMeta[goal.name].longTermGoalId, "");
});

test("landscape rename carries its metadata and keeps stable direction links", () => {
  const linked = linkGoalToLongTerm(withDirection(), goal, "direction-1", areas);
  const renamed = { ...linked, areaMeta: { Movement: linked.areaMeta.Body } };
  const renamedGoal = { ...goal, area: "Movement", areas: ["Movement"] };
  assert.equal(goalLongTermGoal(renamed, renamedGoal, [{ name: "Movement" }]).id, "direction-1");
  assert.equal(goalLongTermGoal(renamed, goal, areas), null);
  const hydrated = JSON.parse(JSON.stringify(renamed));
  assert.equal(goalLongTermGoal(hydrated, renamedGoal, [{ name: "Movement" }]).name, "Move with confidence");
});

test("renaming updates edited own goals as well as original goals without rewriting coach assignments", () => {
  const linked = linkGoalToLongTerm(withDirection(), goal, "direction-1", areas);
  const original = { ...linked, goalEdits: { [goal.name]: { area: "Body", areas: ["Body"], status: "In progress" }, Coach: { note: "Private note" } } };
  const edits = renamedGoalLandscapeEdits(original, [{ ...goal, user: true }, { ...goal, name: "Imported", user: false }, { ...goal, name: "Coach", owner: "coach", locked: true }], "Body", "Movement");
  assert.equal(edits[goal.name].area, "Movement");
  assert.equal(edits[goal.name].status, "In progress");
  assert.equal(edits.Imported.area, "Movement");
  assert.deepEqual(edits.Coach, { note: "Private note" });
  const renamed = { ...original, goalEdits: edits, areaMeta: { Movement: original.areaMeta.Body } };
  assert.equal(goalLongTermGoal(renamed, { ...goal, ...edits[goal.name] }, [{ name: "Movement" }]).id, "direction-1");
});
