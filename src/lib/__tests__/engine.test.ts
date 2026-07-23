import { describe, expect, it } from "vitest";
import {
  affirmations,
  categories,
  practices,
  prayers,
  reflectionPrompts,
} from "../../data";
import { getCoherenceSessionForCategory } from "@/data/session-templates";
import { GROUNDING_REGULATION_INSTRUCTION } from "@/lib/coherence";
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
    expect(combined.prayer).toBe("");
    expect(combined.affirmation).toBe("");
    expect(combined.practiceSteps).toHaveLength(5);
    expect(combined.practiceDuration).toBe(3);
  });

  it("preserves prayer boundaries and prayer-native steps", () => {
    const prayerOnly = composeWithEngine(baseRequest, library, {
      history: createMemoryEngineHistory(),
      random: () => 0.5,
    });
    const selectedPrayer = prayers.find(
      (prayer) => prayer.id === prayerOnly.recipe.prayerId,
    );
    expect(selectedPrayer).toBeDefined();
    expect(prayerOnly.opening).toBe(selectedPrayer?.opening);
    expect(prayerOnly.closing).toBe(selectedPrayer?.closing);
    expect(prayerOnly.practiceSteps).toEqual(selectedPrayer?.practiceSteps);

    const combined = composeWithEngine(
      { ...baseRequest, outputType: "combined-practice" },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );
    const selectedSession = getCoherenceSessionForCategory(
      combined.categoryId,
    );
    expect(combined.recipe.prayerId).toBeUndefined();
    expect(combined.opening).toBe(selectedSession.opening);
    expect(combined.closing).toBe(selectedSession.closing);
    expect(combined.recipe.practiceId).toMatch(/^session-/);
    expect(combined.practiceSteps).toEqual(
      selectedSession.stages.map((stage) => stage.instruction),
    );
    expect(selectedSession.stages[3]?.repetitions).toBe(3);
    expect(combined.safetyNote).toBe(selectedSession.safetyNotes);
    expect(combined.audioRecommendationIds).toEqual(
      expect.arrayContaining(selectedSession.audioTrackIds),
    );
  });

  it("routes sleep to Before Sleep instead of the earlier evening match", () => {
    const result = composeWithEngine(
      {
        ...baseRequest,
        categoryId: "sleep-and-rest",
        outputType: "combined-practice",
      },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );

    expect(result.recipe.practiceId).toBe("session-before-sleep");
    expect(getCoherenceSessionForCategory("sleep-and-rest").slug).toBe(
      "before-sleep",
    );
  });

  it("replaces breath focus with grounded orientation when requested", () => {
    const result = composeWithEngine(
      {
        ...baseRequest,
        outputType: "combined-practice",
        avoidances: ["breath"],
      },
      library,
      { history: createMemoryEngineHistory(), random: () => 0.5 },
    );

    expect(result.practiceSteps[0]).toBe(
      GROUNDING_REGULATION_INSTRUCTION,
    );
    expect(result.practiceSteps.join(" ")).not.toMatch(/\bbreath/i);
    expect(result.safetyNote).toMatch(/visual and contact-point grounding/i);
  });

  it("fails closed when fixed coherence wording conflicts with another avoidance", () => {
    expect(() =>
      composeWithEngine(
        {
          ...baseRequest,
          categoryId: "morning-orientation",
          outputType: "combined-practice",
          avoidances: ["Creator"],
        },
        library,
        { history: createMemoryEngineHistory(), random: () => 0.5 },
      ),
    ).toThrow(/reviewed coherence wording conflicts/i);
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
