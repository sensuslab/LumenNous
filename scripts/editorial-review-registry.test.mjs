import assert from "node:assert/strict";
import test from "node:test";
import {
  mergeReviewRecords,
  validatePublishedReview,
} from "./editorial-review-registry.mjs";

function review(overrides = {}) {
  return {
    id: "rev-con-inner-knowing",
    subjectId: "con-inner-knowing",
    status: "published",
    completedStages: ["source", "safety", "copy"],
    reviewer: "Accountable editor",
    reviewedAt: "2026-08-26",
    notes: "Source, safety and copy checked.",
    ...overrides,
  };
}

test("validates a complete publication review", () => {
  assert.deepEqual(validatePublishedReview(review()), review());
});

test("rejects incomplete stages, attribution and impossible dates", () => {
  assert.throws(
    () => validatePublishedReview(review({ completedStages: ["source", "copy"] })),
    /each required stage exactly once/,
  );
  assert.throws(() => validatePublishedReview(review({ reviewer: "" })), /reviewer/);
  assert.throws(
    () => validatePublishedReview(review({ reviewedAt: "2026-02-30" })),
    /valid YYYY-MM-DD/,
  );
});

test("refuses review id and subject collisions", () => {
  const existing = [review()];
  assert.throws(() => mergeReviewRecords(existing, [review()]), /id collision/);
  assert.throws(
    () =>
      mergeReviewRecords(existing, [
        review({ id: "rev-con-inner-knowing-second" }),
      ]),
    /subject collision/,
  );
  assert.throws(
    () =>
      mergeReviewRecords(existing, [
        review({
          id: "rev-con-other",
          subjectId: "con-inner-knowing",
        }),
      ]),
    /subject collision/,
  );
});

test("merges without mutating caller-owned records", () => {
  const existing = [review()];
  const incoming = [
    review({ id: "rev-con-silence", subjectId: "con-silence" }),
  ];
  const snapshot = structuredClone({ existing, incoming });
  const merged = mergeReviewRecords(existing, incoming);
  assert.equal(merged.length, 2);
  assert.deepEqual({ existing, incoming }, snapshot);
  assert.notStrictEqual(merged[0], existing[0]);
});
