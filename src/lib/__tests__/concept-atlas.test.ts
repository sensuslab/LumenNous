import { describe, expect, it } from "vitest";
import {
  contemplativeConcepts,
  contemplativePathways,
  passageAnchors,
  sources,
} from "../../data";
import {
  getContemplativeConceptBySlug,
  getPassageAnchorsByIds,
} from "../content";

describe("concept atlas", () => {
  it("provides a stable, unique route for every editorial concept", () => {
    expect(contemplativeConcepts).toHaveLength(13);
    expect(new Set(contemplativeConcepts.map((concept) => concept.slug)).size).toBe(
      contemplativeConcepts.length,
    );

    for (const concept of contemplativeConcepts) {
      expect(getContemplativeConceptBySlug(concept.slug)?.id).toBe(concept.id);
    }
  });

  it("resolves every concept to known passage and source strands", () => {
    const anchorIds = new Set(passageAnchors.map((anchor) => anchor.id));
    const sourceIds = new Set(sources.map((source) => source.id));

    for (const concept of contemplativeConcepts) {
      expect(concept.sourceAnchorIds.every((id) => anchorIds.has(id))).toBe(true);
      const resolved = getPassageAnchorsByIds(concept.sourceAnchorIds);
      expect(resolved).toHaveLength(concept.sourceAnchorIds.length);
      expect(resolved.every((anchor) => sourceIds.has(anchor.sourceId))).toBe(true);
    }
  });

  it("keeps oneness contemplative rather than evidential or oracular", () => {
    const oneness = getContemplativeConceptBySlug("oneness-and-fullness");
    expect(oneness?.summary).toMatch(/not proof that the universe is conscious/i);
    expect(oneness?.safetyTags).toContain("non-oracular");
    expect(oneness?.safetyTags).toContain("source-specific");
  });

  it("keeps purpose linked to two distinct Melchizedek settings", () => {
    const purpose = getContemplativeConceptBySlug("purpose-as-service");
    const anchors = getPassageAnchorsByIds(purpose?.sourceAnchorIds ?? []);
    const purposeSourceIds = new Set(anchors.map((anchor) => anchor.sourceId));

    expect(purposeSourceIds).toContain("src-nag-hammadi-melchizedek");
    expect(purposeSourceIds).toContain("src-grumbine-melchizedek");
    expect(purpose?.safetyTags).toEqual(
      expect.arrayContaining(["non-clerical", "non-oracular", "source-specific"]),
    );
  });

  it("connects concepts back to the pathways that apply them", () => {
    const relatedConceptIds = new Set(
      contemplativePathways.flatMap((pathway) => pathway.conceptIds),
    );
    expect(relatedConceptIds.size).toBeGreaterThanOrEqual(10);
    expect(relatedConceptIds).toContain("con-oneness-fullness");
    expect(relatedConceptIds).toContain("con-discernment");
    expect(relatedConceptIds).toContain("con-purpose-service");
  });
});
