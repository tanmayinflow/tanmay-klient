// Weekly landscape reflections. Existing undated and monthly ratings are left
// untouched: only an explicit save creates a dated weekly review.
const DAY = 86400000;
const validScore = value => Number.isInteger(value) && value >= 1 && value <= 5;

function dateValue(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const value = Date.parse(iso + "T12:00:00Z");
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === iso ? value : null;
}

// Dates are local calendar dates supplied by the app. Arithmetic uses UTC noon
// so DST and timezone offsets cannot move the Monday into a different day.
export function areaReviewWeek(iso) {
  const value = dateValue(iso);
  if (value === null) return null;
  const day = new Date(value).getUTCDay();
  return new Date(value - ((day + 6) % 7) * DAY).toISOString().slice(0, 10);
}

export function shiftAreaReviewWeek(week, count) {
  const value = dateValue(week);
  if (value === null || !Number.isInteger(count)) return null;
  return new Date(value + count * 7 * DAY).toISOString().slice(0, 10);
}

export function areaReviewWeekEnd(week) {
  const value = dateValue(week);
  return value === null ? null : new Date(value + 6 * DAY).toISOString().slice(0, 10);
}

export function areaReviewFor(value, date) {
  const week = areaReviewWeek(date);
  const review = week && value?.weeks?.[week];
  if (!review || !validScore(review.dulezitost) || !validScore(review.zit)
    || !Number.isFinite(review.reviewedAt) || review.reviewedAt <= 0) return null;
  return review;
}

export function areaReviewWeeks(value, date) {
  const current = areaReviewWeek(date);
  return Object.keys(value?.weeks || {}).filter(week => week <= current
    && areaReviewWeek(week) === week && areaReviewFor(value, week))
    .sort((a, b) => b.localeCompare(a));
}

export function areaReviewDraft(value, date) {
  const saved = areaReviewFor(value, date);
  if (saved) return { dulezitost: saved.dulezitost, zit: saved.zit, nextStep: typeof saved.nextStep === "string" ? saved.nextStep : "" };
  const latest = areaReviewFor(value, areaReviewWeeks(value, date)[0]);
  return {
    dulezitost: latest?.dulezitost || (validScore(value?.dulezitost) ? value.dulezitost : 0),
    zit: 0,
    nextStep: "",
  };
}

export function canSaveAreaReview(value) {
  return validScore(value?.dulezitost) && validScore(value?.zit);
}

// Apply inside persistColl's functional updater, preserving the latest state
// rather than overwriting another week with the editor's earlier snapshot.
export function saveAreaReview(coll, name, date, values, reviewedAt) {
  const week = areaReviewWeek(date);
  if (!week || typeof name !== "string" || !name.trim() || !canSaveAreaReview(values)
    || !Number.isFinite(reviewedAt) || reviewedAt <= 0) return coll;
  const previous = coll?.areaVlq?.[name] || {};
  return {
    ...coll,
    areaVlq: {
      ...coll?.areaVlq,
      [name]: {
        ...previous,
        weeks: {
          ...previous.weeks,
          [week]: {
            dulezitost: values.dulezitost,
            zit: values.zit,
            nextStep: typeof values.nextStep === "string" ? values.nextStep.trim().slice(0, 600) : "",
            reviewedAt,
          },
        },
      },
    },
  };
}
