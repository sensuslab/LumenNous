import { describe, expect, it } from "vitest";
import {
  affirmations,
  categories,
  practices,
  prayers,
  reflectionPrompts,
} from "../../data";
import {
  classifyCategoryId,
  composeWithEngine,
  createMemoryEngineHistory,
  type EngineLibrary,
} from "../engine";
import type { EngineRequest } from "../schemas";

const library: EngineLibrary = {
  categories,
  prayers,
  affirmations,
  practices,
  prompts: reflectionPrompts,
};

const baseRequest: EngineRequest = {
  userNeed: "I feel scattered and need to settle.",
  categoryId: "grounding-and-stillness",
  outputType: "prayer",
  duration: "five-minutes",
  tone: "gentle",
  languagePreference: "source",
  avoidances: [],
};

describe("classifyCategoryId", () => {
  it("maps need language through the Corpus taxonomy", () => {
    expect(classifyCategoryId("I feel anxious and scattered", categories)).toBe(
      "grounding-and-stillness",
    );
    expect(classifyCategoryId("I cannot sleep tonight", categories)).toBe(
      "sleep-and-rest",
    );
    expect(classifyCategoryId("I am grieving a loss", categories)).toBe(
      "grief-and-lament",
    );
  });

  it("falls back to grounding for an unmatched need", () => {
    expect(classifyCategoryId("something hard to name", categories)).toBe(
      "grounding-and-stillness",
    );
  });
});

describe("composeWithEngine", () => {
  it("uses every prayer in a shuffle bag before repeating", () => {
    const history = createMemoryEngineHistory();
    const picks = Array.from({ length: 4 }, () =>
      composeWithEngine(baseRequest, library, {
        history,
        random: () => 0.25,
      }),
    );
    const prayerIds = picks.map((result) => result.recipe.prayerId);
    expect(new Set(prayerIds.slice(0, 3))).toHaveLength(3);
    expect(prayerIds[3]).not.toBe(prayerIds[2]);
    expect(picks[3]?.recipe.cycle).toBe(2);
  });

  it("assembles each output form from compatible library records", () => {
    const history = createMemoryEngineHistory();
    const affirmation = composeWithEngine(
      { ...baseRequest, outputType: "affirmation" },
      library,
      { history, random: () => 0.5 },
    );
    expect(affirmation.affirmation.length).toBeGreaterThan(0);
    expect(affirmation.prayer).toBe("");

    const meditation = composeWithEngine(
      { ...baseRequest, outputType: "meditation" },
      library,
      { history, random: () => 0.5 },
    );
    expect(meditation.practiceSteps.length).toBeGreaterThan(1);
    expect(meditation.recipe.practiceId).toBeTruthy();

    const combined = composeWithEngine(
      { ...baseRequest, outputType: "combined-practice" },
      library,
      { history, random: () => 0.5 },
    );
    expect(combined.prayer.length).toBeGreaterThan(0);
    expect(combined.affirmation.length).toBeGreaterThan(0);
    expect(combined.practiceSteps.length).toBeGreaterThan(1);
  });

  it("uses an exact practice duration when the category provides one", () => {
    const result = composeWithEngine(
      {
        ...baseRequest,
        outputType: "meditation",
        duration: "ten-minutes",
      },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );

    expect(result.practiceDuration).toBe(10);
  });

  it("lets an explicit category override text classification", () => {
    const result = composeWithEngine(
      {
        ...baseRequest,
        userNeed: "I cannot sleep tonight",
        categoryId: "courage-and-resilience",
      },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );
    expect(result.categoryId).toBe("courage-and-resilience");
  });

  it("fails closed when an avoidance removes every required candidate", () => {
    const blockedLibrary: EngineLibrary = {
      ...library,
      affirmations: library.affirmations.map((item) =>
        item.categoryIds.includes(baseRequest.categoryId)
          ? { ...item, text: `blocked ${item.text}` }
          : item,
      ),
    };

    expect(() =>
      composeWithEngine(
        {
          ...baseRequest,
          outputType: "affirmation",
          avoidances: ["blocked"],
        },
        blockedLibrary,
        { history: createMemoryEngineHistory(), random: () => 0.5 },
      ),
    ).toThrow("No compatible affirmation");
  });

  it("bypasses composition with fixed safety language", () => {
    const result = composeWithEngine(
      { ...baseRequest, userNeed: "I want to kill myself" },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );
    expect(result.safetyLevel).toBe("crisis");
    expect(result.safetyNote).toContain("fixed response");
    expect(result.recipe.prayerId).toBeUndefined();
  });

  it("never stores request text in non-repetition history", () => {
    const history = createMemoryEngineHistory();
    const privateWords = "a private phrase that must not persist";
    composeWithEngine(
      { ...baseRequest, userNeed: privateWords },
      library,
      { history, random: () => 0.5 },
    );
    expect(JSON.stringify(history.read())).not.toContain(privateWords);
  });
});
