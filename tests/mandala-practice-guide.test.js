import assert from "node:assert/strict";
import test from "node:test";
import { CENTER_STUDY } from "../src/shared/ui/mandalaCenterStudy.js";
import { NORTH_EAST_STUDY } from "../src/shared/ui/mandalaNorthEast.js";
import { SOUTH_WEST_STUDY } from "../src/shared/ui/mandalaSouthWest.js";

const studies = { ...NORTH_EAST_STUDY, ...SOUTH_WEST_STUDY, center: CENTER_STUDY };
const bookLocator = /https?:\/\/|\b(?:str\.|pp?\.|pages?|chapter)\s*\d|\d+\.\s*kapitol|kapitol\w*\s+\d/iu;

for (const [aspect, study] of Object.entries(studies)) {
  test(`${aspect} practice cards all have a visible group, an identifiable source and both languages`, () => {
    const groups = aspect === "center" ? ["method", "application"] : ["facet", "protector", "application"];
    assert.deepEqual(new Set(study.practices.map(card => card.group)), new Set(groups));
    assert.equal(new Set(study.practices.map(card => card.id)).size, study.practices.length);
    const sources = new Map(study.sources.map(source => [source.id, source]));
    for (const card of study.practices) {
      const source = sources.get(card.source);
      assert.ok(source?.title && source.url?.startsWith("https://"), card.id);
      assert.ok(["method", "adaptation"].includes(card.kind), card.id);
      for (const copy of [card.cz, card.en]) {
        assert.ok(copy.title && copy.when && copy.reflect && copy.steps.length, card.id);
      }
    }
  });

  test(`${aspect} keeps URLs and book locations out of the practice instructions`, () => {
    for (const language of ["cz", "en"]) {
      assert.doesNotMatch(study.reading[language], bookLocator);
      for (const card of study.practices) {
        const { title, when, steps, reflect } = card[language];
        assert.doesNotMatch([title, when, ...steps, reflect].join("\n"), bookLocator, card.id);
      }
    }
  });
}
