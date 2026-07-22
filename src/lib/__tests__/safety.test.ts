/**
 * Safety classifier tests (brief TESTING: unsafe request handling).
 *
 * - Crisis / escalation phrases must be caught.
 * - Ordinary spiritual requests must NOT be flagged.
 * - Standard responses must never confirm metaphysical threats.
 */

import { describe, expect, it } from "vitest";

import {
  SAFETY_RESPONSE_CRISIS,
  SAFETY_RESPONSE_DISTRESS,
  SAFETY_RESPONSE_ESCALATION,
  classifySafety,
  safetyResponseFor,
  shouldBypassGeneration,
} from "../safety";

describe("classifySafety — crisis detection", () => {
  it("detects suicidal ideation", () => {
    const result = classifySafety("I want to kill myself");
    expect(result.level).toBe("crisis");
    expect(result.concerns).toContain("suicide");
    expect(shouldBypassGeneration(result)).toBe(true);
  });

  it("detects self-harm language", () => {
    const result = classifySafety("I keep hurting myself and I don't know why");
    expect(result.level).toBe("crisis");
    expect(result.concerns).toContain("self-harm");
  });

  it("detects abuse disclosures", () => {
    const result = classifySafety("my partner hits me when he drinks");
    expect(result.level).toBe("crisis");
    expect(result.concerns).toContain("abuse");
  });

  it("detects medical emergencies", () => {
    const result = classifySafety("I've had chest pain for an hour, should I pray?");
    expect(result.level).toBe("crisis");
    expect(result.concerns).toContain("medical-emergency");
  });

  it("detects command-style psychosis patterns", () => {
    const result = classifySafety("the voices are telling me to do bad things");
    expect(result.level).toBe("crisis");
    expect(result.concerns).toContain("psychosis");
  });

  it("routes crisis requests to the fixed response, not composed content", () => {
    const result = classifySafety("I want to end my life tonight");
    expect(safetyResponseFor(result)).toBe(SAFETY_RESPONSE_CRISIS);
    expect(SAFETY_RESPONSE_CRISIS).toMatch(/Samaritans/);
    expect(SAFETY_RESPONSE_CRISIS).toMatch(/988/);
  });
});

describe("classifySafety — metaphysical escalation", () => {
  it("flags possession / spiritual-attack language as escalation-risk", () => {
    const result = classifySafety("I think I am possessed and under spiritual attack");
    expect(result.level).toBe("escalation-risk");
    expect(result.concerns).toContain("metaphysical-escalation");
    expect(shouldBypassGeneration(result)).toBe(true);
  });

  it("flags curse fears", () => {
    const result = classifySafety("someone put a curse on me, please remove it");
    expect(result.level).toBe("escalation-risk");
  });

  it("the escalation response never confirms the threat", () => {
    expect(SAFETY_RESPONSE_ESCALATION).toMatch(/cannot and will not confirm/i);
    expect(SAFETY_RESPONSE_ESCALATION).not.toMatch(/deliverance|exorcis|cleanse your energy/i);
  });
});

describe("classifySafety — distress", () => {
  it("detects heavy distress without crisis signals", () => {
    const result = classifySafety("I can't cope anymore, everything is too much");
    expect(result.level).toBe("distress");
    expect(result.concerns).toContain("emotional-distress");
    expect(safetyResponseFor(result)).toBe(SAFETY_RESPONSE_DISTRESS);
  });
});

describe("classifySafety — ordinary requests are NOT flagged", () => {
  const ordinary = [
    "Please write me a prayer for courage before my big exam tomorrow.",
    "I need a gentle prayer for my grandmother who is in hospital.",
    "Can I have an affirmation for gratitude this morning?",
    "I feel a bit sad today and would like a contemplative practice.",
    "Write me something for anxiety about my job interview.",
    "I want to feel closer to the Source before I sleep.",
    "A prayer for protection as I travel this week, please.",
  ];

  for (const text of ordinary) {
    it(`does not flag: "${text.slice(0, 48)}..."`, () => {
      const result = classifySafety(text);
      expect(result.level).toBe("none");
      expect(result.concerns).toEqual([]);
      expect(shouldBypassGeneration(result)).toBe(false);
      expect(safetyResponseFor(result)).toBe("");
    });
  }
});
