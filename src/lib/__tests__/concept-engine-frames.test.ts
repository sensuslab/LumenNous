import { describe, expect, it } from "vitest";
import {
  conceptEngineFrames,
  contemplativeConcepts,
  passageAnchors,
} from "../../data";

describe("concept Engine frames", () => {
  it("maps one transparent composition frame to each selected concept", () => {
    expect(conceptEngineFrames).toHaveLength(10);
    expect(new Set(conceptEngineFrames.map((frame) => frame.conceptId)).size).toBe(
      conceptEngineFrames.length,
    );
    expect(conceptEngineFrames.every((frame) => frame.editorialStatus === "draft")).toBe(true);
  });

  it("uses known concepts and passage anchors", () => {
    const conceptIds = new Set(contemplativeConcepts.map((concept) => concept.id));
    const anchorIds = new Set(passageAnchors.map((anchor) => anchor.id));
    for (const frame of conceptEngineFrames) {
      expect(conceptIds.has(frame.conceptId)).toBe(true);
      expect(frame.sourceUses.every((use) => anchorIds.has(use.anchorId))).toBe(true);
      expect(frame.compatibleWorldviews.length).toBeGreaterThan(0);
    }
  });

  it("encodes non-oracular and non-clerical boundaries", () => {
    const inner = conceptEngineFrames.find(
      (frame) => frame.conceptId === "con-inner-light",
    );
    const purpose = conceptEngineFrames.find(
      (frame) => frame.conceptId === "con-purpose-service",
    );
    const oneness = conceptEngineFrames.find(
      (frame) => frame.conceptId === "con-oneness-fullness",
    );

    expect(inner?.safetyNote).toMatch(/no vision|not expected/i);
    expect(purpose?.safetyNote).toMatch(/no title, ordination, lineage or authority/i);
    expect(oneness?.safetyNote).toMatch(/does not establish universal consciousness/i);
  });
});
