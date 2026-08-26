import { describe, expect, it } from "vitest";
import {
  affirmations,
  contemplativeConcepts,
  passageAnchors,
  practices,
  prayers,
  reflectionPrompts,
  sourceEditions,
  teachings,
} from "../../data";

describe("source-aware contemplative foundation", () => {
  it("keeps the two Melchizedek sources historically distinct", () => {
    const ancient = passageAnchors.find(
      (anchor) => anchor.id === "anc-nag-melchizedek-distinction",
    );
    const modern = passageAnchors.find(
      (anchor) => anchor.id === "anc-grumbine-self-possession",
    );
    const guide = teachings.find(
      (teaching) => teaching.id === "tch-two-melchizedeks",
    );

    expect(ancient?.sourceId).toBe("src-nag-hammadi-melchizedek");
    expect(modern?.sourceId).toBe("src-grumbine-melchizedek");
    expect(ancient?.sourceId).not.toBe(modern?.sourceId);
    expect(guide?.classification).toBe("modern-interpretation");
    expect(guide?.sourceUses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ relation: "comparative-context" }),
      ]),
    );
  });

  it("stores locators and editorial summaries without bundling source text", () => {
    expect(sourceEditions).toHaveLength(2);
    expect(passageAnchors.length).toBeGreaterThanOrEqual(17);
    expect(passageAnchors.every((anchor) => anchor.locator.length > 0)).toBe(true);
    expect(passageAnchors.every((anchor) => anchor.notes.length > 0)).toBe(true);
    expect(contemplativeConcepts.every((concept) => concept.editorialStatus === "draft")).toBe(true);
  });

  it("does not frame quiet impressions as commands or proof", () => {
    const text = [
      ...prayers.flatMap((prayer) => [prayer.body, ...prayer.practiceSteps]),
      ...practices.flatMap((practice) =>
        practice.steps.map((step) => step.instruction),
      ),
      ...affirmations.map((affirmation) => affirmation.text),
      ...reflectionPrompts.map((prompt) => prompt.text),
    ].join("\n");

    expect(text).not.toMatch(/first quiet answer/i);
    expect(text).not.toMatch(/trust the still, small voice/i);
    expect(text).not.toMatch(/whatever it gave/i);
    expect(text).toMatch(/test it against care, evidence and reality/i);
  });
});
