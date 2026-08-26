import { describe, expect, it } from "vitest";
import {
  contemplativeConcepts,
  contemplativePathways,
  passageAnchors,
  practices,
} from "../../data";

describe("contemplative pathways", () => {
  it("provide three complete, draft journeys with honest timing", () => {
    expect(contemplativePathways).toHaveLength(3);
    for (const pathway of contemplativePathways) {
      expect(pathway.editorialStatus).toBe("draft");
      expect(pathway.stages.length).toBeGreaterThanOrEqual(3);
      expect(
        pathway.stages.reduce(
          (total, stage) => total + stage.activity.minutes,
          0,
        ),
      ).toBe(pathway.estimatedMinutes);
      expect(
        pathway.stages.every(
          (stage) => stage.activity.instructions.length >= 2,
        ),
      ).toBe(true);
    }
  });

  it("links every activity to known concepts, anchors and companion practices", () => {
    const conceptIds = new Set(contemplativeConcepts.map((concept) => concept.id));
    const anchorIds = new Set(passageAnchors.map((anchor) => anchor.id));
    const practiceSlugs = new Set(practices.map((practice) => practice.slug));

    for (const pathway of contemplativePathways) {
      for (const stage of pathway.stages) {
        expect(stage.conceptIds.every((id) => conceptIds.has(id))).toBe(true);
        expect(
          stage.conceptIds.every((id) => pathway.conceptIds.includes(id)),
        ).toBe(true);
        expect(
          stage.activity.sourceUses.every((use) => anchorIds.has(use.anchorId)),
        ).toBe(true);
        if (stage.relatedPracticeSlug) {
          expect(practiceSlugs.has(stage.relatedPracticeSlug)).toBe(true);
        }
      }
    }
  });

  it("keeps purpose comparative and refuses spiritual rank", () => {
    const pathway = contemplativePathways.find(
      (item) => item.slug === "purpose-without-rank",
    );
    expect(pathway).toBeDefined();
    expect(pathway?.sourceIds).toContain("src-nag-hammadi-melchizedek");
    expect(pathway?.sourceIds).toContain("src-grumbine-melchizedek");
    expect(pathway?.classification).toBe("modern-interpretation");
    expect(pathway?.safetyNotes).toMatch(/no spiritual title, ordination, lineage or authority/i);
  });

  it("defines cosmic consciousness without manifestation or oracular claims", () => {
    const pathway = contemplativePathways.find(
      (item) => item.slug === "returning-to-fullness",
    );
    const text = JSON.stringify(pathway);
    expect(pathway?.safetyNotes).toMatch(/not evidence that the universe is conscious/i);
    expect(text).not.toMatch(/guaranteed outcome/i);
    expect(text).not.toMatch(/manifest your/i);
    expect(text).not.toMatch(/cosmic assignment/i);
  });
});
