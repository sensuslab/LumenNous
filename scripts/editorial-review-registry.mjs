const REVIEW_STAGES = ["source", "safety", "copy"];
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object`);
  }
}

function assertString(value, label, { min = 0, max } = {}) {
  if (typeof value !== "string" || value.length < min || value.length > max) {
    throw new Error(`${label} must be a string between ${min} and ${max} characters`);
  }
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function validatePublishedReview(value) {
  assertObject(value, "review");
  const allowedKeys = new Set([
    "id",
    "subjectId",
    "status",
    "completedStages",
    "reviewer",
    "reviewedAt",
    "notes",
  ]);
  const unknownKeys = Object.keys(value).filter((key) => !allowedKeys.has(key));
  if (unknownKeys.length > 0) {
    throw new Error(`review has unknown fields: ${unknownKeys.join(", ")}`);
  }

  assertString(value.id, "review.id", { min: 1, max: 120 });
  assertString(value.subjectId, "review.subjectId", { min: 1, max: 120 });
  if (!ID_PATTERN.test(value.id) || !ID_PATTERN.test(value.subjectId)) {
    throw new Error("review.id and review.subjectId must be kebab-case identifiers");
  }
  if (value.status !== "published") {
    throw new Error('review.status must be "published" before ingestion');
  }
  if (!Array.isArray(value.completedStages)) {
    throw new Error("review.completedStages must be an array");
  }
  const uniqueStages = new Set(value.completedStages);
  if (
    value.completedStages.length !== REVIEW_STAGES.length ||
    uniqueStages.size !== REVIEW_STAGES.length ||
    REVIEW_STAGES.some((stage) => !uniqueStages.has(stage))
  ) {
    throw new Error(
      `review.completedStages must contain each required stage exactly once: ${REVIEW_STAGES.join(", ")}`,
    );
  }
  assertString(value.reviewer, "review.reviewer", { min: 1, max: 200 });
  if (value.reviewer.trim() !== value.reviewer) {
    throw new Error("review.reviewer must not have leading or trailing whitespace");
  }
  assertString(value.reviewedAt, "review.reviewedAt", { min: 10, max: 10 });
  if (!isValidIsoDate(value.reviewedAt)) {
    throw new Error("review.reviewedAt must be a valid YYYY-MM-DD calendar date");
  }
  assertString(value.notes, "review.notes", { min: 0, max: 2000 });

  return structuredClone(value);
}

export function mergeReviewRecords(existing, incoming) {
  if (!Array.isArray(existing)) throw new Error("review registry must be a JSON array");
  if (!Array.isArray(incoming)) throw new Error("incoming reviews must be a JSON object or array");

  const validatedExisting = existing.map(validatePublishedReview);
  const validatedIncoming = incoming.map(validatePublishedReview);
  const ids = new Set();
  const subjectIds = new Set();

  for (const review of [...validatedExisting, ...validatedIncoming]) {
    if (ids.has(review.id)) {
      throw new Error(`review id collision: ${review.id}`);
    }
    if (subjectIds.has(review.subjectId)) {
      throw new Error(`review subject collision: ${review.subjectId}`);
    }
    ids.add(review.id);
    subjectIds.add(review.subjectId);
  }

  return [...validatedExisting, ...validatedIncoming];
}
