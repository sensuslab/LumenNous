import { describe, expect, it } from "vitest";
import {
  affirmations,
  reflectionPrompts,
  teachings,
} from "@/data";
import {
  containsPhysicalGuidance,
  getDailyRuleOfLife,
} from "@/lib/rule-of-life";

const library = { affirmations, prompts: reflectionPrompts, teachings };
const date = new Date(2026, 7, 19, 9, 0, 0);

describe("getDailyRuleOfLife", () => {
  it("is deterministic for the local day and category", () => {
    const first = getDailyRuleOfLife(
      date,
      ["grounding-and-stillness"],
      library,
    );
    const second = getDailyRuleOfLife(
      date,
      ["grounding-and-stillness"],
      library,
    );
    expect(first.affirmation?.id).toBe(second.affirmation?.id);
    expect(first.prompt?.id).toBe(second.prompt?.id);
    expect(first.teaching?.id).toBe(second.teaching?.id);
    expect(first.closePrompt).toBe(second.closePrompt);
  });

  it("keeps the Today enrichment free of physical guidance", () => {
    const rule = getDailyRuleOfLife(
      date,
      ["grounding-and-stillness"],
      library,
    );
    const copy = [
      rule.affirmation?.text ?? "",
      rule.affirmation?.backingActHint ?? "",
      rule.prompt?.text ?? "",
      rule.teaching?.title ?? "",
      rule.teaching?.summary ?? "",
      rule.closePrompt,
    ].join(" ");
    expect(containsPhysicalGuidance(copy)).toBe(false);
  });

  it("makes every door optional and never creates completion state", () => {
    const rule = getDailyRuleOfLife(date, [], library);
    expect(rule.affirmation).toBeUndefined();
    expect(rule.prompt).toBeUndefined();
    expect(rule.teaching).toBeUndefined();
    expect(rule.closePrompt.length).toBeGreaterThan(0);
    expect(rule).not.toHaveProperty("completed");
  });
});
