import test from "node:test";
import assert from "node:assert/strict";
import { movedAspectImageOrder, orderedAspectImages } from "../src/shared/ui/aspectImageOrder.js";

const board = ["board-north-001", "board-north-002", "board-north-003"].map(id => ({ id, full: id + ".webp" }));
const uploads = [{ id: "personal-a", r2id: "a" }, { id: "personal-b", r2id: "b" }];
const ids = images => images.map(image => image.id);

test("older accounts keep original order, and personalized order interleaves uploads and curated images", () => {
  const data = { imgs: uploads, note: "keep" };
  const original = orderedAspectImages(data, board);
  assert.deepEqual(ids(original), [...ids(uploads), ...ids(board)]);
  const imageOrder = movedAspectImageOrder(undefined, original, board[2].id, uploads[0].id);
  const saved = { ...data, imageOrder };
  assert.deepEqual(ids(orderedAspectImages(JSON.parse(JSON.stringify(saved)), board)), [board[2].id, ...ids(uploads), board[0].id, board[1].id]);
  assert.deepEqual(ids(orderedAspectImages(data, board)), ids(original));
});

test("hiding and deleting, duplicate saved IDs and new images do not break a saved layout", () => {
  const data = {
    hiddenBoardImages: [board[1].id],
    imgs: uploads,
    imageOrder: [board[2].id, "deleted", board[1].id, uploads[0].id, board[2].id],
  };
  assert.deepEqual(ids(orderedAspectImages(data, board)), [board[2].id, uploads[0].id, uploads[1].id, board[0].id]);
});

test("reordering personal images while the board is unavailable retains its saved positions", () => {
  const saved = [board[0].id, uploads[0].id, board[1].id, uploads[1].id, board[2].id];
  const order = movedAspectImageOrder(saved, uploads, uploads[1].id, uploads[0].id);
  assert.deepEqual(order, [board[0].id, uploads[1].id, uploads[0].id, board[1].id, board[2].id]);
  assert.equal(movedAspectImageOrder(saved, uploads, uploads[0].id, "deleted"), null);
  assert.equal(movedAspectImageOrder(saved, uploads, uploads[0].id, uploads[0].id), null);
});
