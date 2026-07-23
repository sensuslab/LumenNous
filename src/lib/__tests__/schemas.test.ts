import { describe, expect, it } from "vitest";
import {
  EngineRequestSchema,
  EngineResultSchema,
  PrayerSchema,
} from "../schemas";
import { categories, validateContent } from "../../data";

describe("validateContent()", () => {
  it("accepts the Corpus-aligned seed library", () => {
    const report = validateContent();
    expect(report.ok).toBe(true);
    expect(report.errors).toEqual([]);
    expect(report.counts.categories).toBe(27);
    expect(categories.filter((category) => category.isActive)).toHaveLength(26);
    expect(report.counts.prayers).toBeGreaterThanOrEqual(72);
    expect(report.counts.affirmations).toBeGreaterThanOrEqual(96);
    expect(report.counts.practices).toBeGreaterThanOrEqual(47);
    expect(report.counts.reflectionPrompts).toBeGreaterThanOrEqual(140);
    expect(report.counts.sources).toBeGreaterThanOrEqual(30);
    expect(report.counts.audioItems).toBeGreaterThanOrEqual(12);
    expect(report.counts.playlists).toBe(10);
    expect(report.counts.teachings).toBe(16);
    expect(report.counts.sessions).toBe(5);
  });
});

describe("PrayerSchema", () => {
  const validPrayer = {
    id: "pry-test-01",
    title: "A Test Prayer",
    categoryIds: ["grounding-and-stillness"],
    traditionLabels: ["original-composition"],
    content: "Opening.\n\nBody.\n\nClosing.",
    opening: "Opening.",
    body: "Body.",
    closing: "Closing.",
    affirmation: "I can be present.",
    practiceDuration: 3,
    practiceSteps: ["Breathe.", "Read.", "Rest."],
    reflectionPromptIds: [],
    sourceIds: [],
    audioIds: [],
    tags: ["test"],
    timeOfDay: "any",
    editorialStatus: "draft",
    safetyNotes: "",
  };

  it("accepts a well-formed prayer", () => {
    expect(() => PrayerSchema.parse(validPrayer)).not.toThrow();
  });

  it("rejects a malformed prayer", () => {
    const malformed: Partial<typeof validPrayer> = { ...validPrayer };
    delete malformed.title;
    expect(() => PrayerSchema.parse(malformed)).toThrow();
  });

  it("rejects fewer than three practice steps", () => {
    expect(() =>
      PrayerSchema.parse({ ...validPrayer, practiceSteps: ["Breathe.", "Read."] }),
    ).toThrow();
  });

  it("rejects invalid timing metadata", () => {
    expect(() =>
      PrayerSchema.parse({ ...validPrayer, timeOfDay: "midnight-ish" }),
    ).toThrow();
    expect(() =>
      PrayerSchema.parse({
        ...validPrayer,
        timeOfDay: "seasonal-aware",
        seasonalMonths: [0, 13],
      }),
    ).toThrow();
  });
});

describe("EngineRequestSchema", () => {
  const validRequest = {
    userNeed: "I need courage for a difficult conversation.",
    categoryId: "courage-and-resilience",
    outputType: "prayer",
    duration: "five-minutes",
    tone: "gentle",
    languagePreference: "source",
    avoidances: ["illness"],
  };

  it("accepts a local request and defaults avoidances", () => {
    const withoutAvoidances = { ...validRequest, avoidances: undefined };
    const parsed = EngineRequestSchema.parse(withoutAvoidances);
    expect(parsed.avoidances).toEqual([]);
  });

  it("allows an empty need when a category is chosen", () => {
    expect(() =>
      EngineRequestSchema.parse({ ...validRequest, userNeed: "" }),
    ).not.toThrow();
  });

  it("rejects over-long text and an unknown tone", () => {
    expect(() =>
      EngineRequestSchema.parse({ ...validRequest, userNeed: "x".repeat(601) }),
    ).toThrow();
    expect(() =>
      EngineRequestSchema.parse({ ...validRequest, tone: "angry" }),
    ).toThrow();
  });
});

describe("EngineResultSchema", () => {
  const validResult = {
    title: "A Prayer for Courage",
    categoryId: "courage-and-resilience",
    category: "Courage and Resilience",
    outputType: "prayer",
    opening: "Source of strength,",
    prayer: "Steady my heart for the conversation ahead.",
    affirmation: "",
    practiceDuration: 5,
    practiceSteps: [],
    reflectionPrompts: ["What is the next honest step?"],
    closing: "I go accompanied. Amen.",
    sourceIds: ["src-psalms-nrsv"],
    traditionLabels: ["original-composition", "modern-interpretation"],
    audioRecommendationIds: [],
    safetyNote: "",
    safetyLevel: "none",
    assembledAt: new Date().toISOString(),
    fingerprint: "ln-test",
    recipe: { prayerId: "pry-test", promptIds: ["prm-test"], cycle: 1 },
  };

  it("accepts a well-formed local result", () => {
    expect(() => EngineResultSchema.parse(validResult)).not.toThrow();
  });

  it("rejects missing fields, bad dates and unknown labels", () => {
    const malformed: Partial<typeof validResult> = { ...validResult };
    delete malformed.closing;
    expect(() => EngineResultSchema.parse(malformed)).toThrow();
    expect(() =>
      EngineResultSchema.parse({ ...validResult, assembledAt: "not-a-date" }),
    ).toThrow();
    expect(() =>
      EngineResultSchema.parse({ ...validResult, traditionLabels: ["invented"] }),
    ).toThrow();
  });
});
