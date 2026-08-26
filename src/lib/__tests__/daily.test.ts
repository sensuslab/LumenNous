/**
 * Daily selection tests (brief TESTING: daily content selection,
 * non-repetition during randomisation, category filtering).
 */

import { describe, expect, it } from "vitest";

import {
  getAnotherItem,
  getDailyAffirmation,
  getDailyConceptFrame,
  getDailyItem,
  hashString,
  isSuitableForWindow,
  localISODate,
  windowForDate,
} from "../daily";
import { getPrayersByCategory } from "../content";
import { conceptEngineFrames } from "../../data";

const MORNING = new Date("2026-07-18T09:00:00");
const EVENING = new Date("2026-07-18T21:00:00");

describe("hashString / localISODate / windowForDate", () => {
  it("hashString is deterministic and unsigned", () => {
    expect(hashString("lumennous")).toBe(hashString("lumennous"));
    expect(hashString("lumennous")).toBeGreaterThanOrEqual(0);
    expect(hashString("a")).not.toBe(hashString("b"));
  });

  it("localISODate formats the local calendar date", () => {
    expect(localISODate(new Date("2026-07-18T09:00:00"))).toBe("2026-07-18");
    expect(localISODate(new Date("2026-07-18T23:59:00"))).toBe("2026-07-18");
  });

  it("windowForDate splits morning / day / evening", () => {
    expect(windowForDate(new Date("2026-07-18T06:30:00"))).toBe("morning");
    expect(windowForDate(new Date("2026-07-18T11:59:00"))).toBe("morning");
    expect(windowForDate(new Date("2026-07-18T12:00:00"))).toBe("day");
    expect(windowForDate(new Date("2026-07-18T17:59:00"))).toBe("day");
    expect(windowForDate(new Date("2026-07-18T18:00:00"))).toBe("evening");
    expect(windowForDate(new Date("2026-07-18T23:00:00"))).toBe("evening");
  });
});

describe("getDailyItem", () => {
  it("is deterministic for the same instant", () => {
    const first = getDailyItem(MORNING);
    const second = getDailyItem(MORNING);
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(first?.id).toBe(second?.id);
  });

  it("is stable within a day window (morning hours agree, evening hours agree)", () => {
    const morningIds = [6, 8, 9, 10, 11].map(
      (hour) => getDailyItem(new Date(`2026-07-18T${String(hour).padStart(2, "0")}:15:00`))?.id,
    );
    expect(new Set(morningIds).size).toBe(1);

    const eveningIds = [18, 19, 21, 23].map(
      (hour) => getDailyItem(new Date(`2026-07-18T${String(hour).padStart(2, "0")}:15:00`))?.id,
    );
    expect(new Set(eveningIds).size).toBe(1);
  });

  it("is stable for different instants within the same window", () => {
    const atNine = getDailyItem(new Date("2026-07-18T09:00:00"));
    const atNineThirty = getDailyItem(new Date("2026-07-18T09:30:00"));
    expect(atNine?.id).toBe(atNineThirty?.id);
  });

  it("filters by category slug", () => {
    const item = getDailyItem(MORNING, "sleep-and-rest");
    expect(item).toBeDefined();
    expect(item?.categoryIds).toContain("sleep-and-rest");

    const validIds = new Set(getPrayersByCategory("sleep-and-rest").map((p) => p.id));
    expect(validIds.has(item!.id)).toBe(true);
  });

  it("returns undefined for an unknown category", () => {
    expect(getDailyItem(MORNING, "no-such-category")).toBeUndefined();
  });

  it("prefers suitable items: never an evening-only prayer at 9am when alternatives exist", () => {
    const item = getDailyItem(MORNING, "grounding-and-stillness");
    expect(item).toBeDefined();
    expect(item?.timeOfDay).not.toBe("evening");
  });

  it("respects seasonal windows by month", () => {
    // Cosmic category: one "any", one "evening", one "evening"+seasonal.
    // July 9am leaves exactly one suitable prayer (the "any" one).
    const july = getDailyItem(new Date("2026-07-18T09:00:00"), "cosmic-and-planetary-reflection");
    expect(july?.id).toBe("pry-cosmic-and-planetary-reflection-02");

    // December 9am: the seasonal prayer is in season but is evening-only,
    // so the "any" prayer is still the only morning-suitable option.
    const december = getDailyItem(new Date("2026-12-18T09:00:00"), "cosmic-and-planetary-reflection");
    expect(december?.id).toBe("pry-cosmic-and-planetary-reflection-02");

    // Gratitude category: three "any" prayers plus one seasonal-aware
    // (harvest, months 9–11). The harvest prayer is excluded in July…
    const julyHarvest = getDailyItem(new Date("2026-07-18T09:00:00"), "gratitude-and-provision");
    expect(julyHarvest?.id).not.toBe("pry-gratitude-and-provision-03");

    // …and eligible again in October (result is one of the four).
    const october = getDailyItem(new Date("2026-10-18T09:00:00"), "gratitude-and-provision");
    expect(october).toBeDefined();
    expect(october?.categoryIds).toContain("gratitude-and-provision");
  });

  it("isSuitableForWindow handles seasonal-aware and seasonal months on any timeOfDay", () => {
    const harvest = getPrayersByCategory("gratitude-and-provision").find(
      (p) => p.timeOfDay === "seasonal-aware",
    );
    expect(harvest).toBeDefined();
    // seasonal-aware has no window constraint — only the season.
    expect(isSuitableForWindow(harvest!, "morning", 10)).toBe(true);
    expect(isSuitableForWindow(harvest!, "evening", 9)).toBe(true);
    expect(isSuitableForWindow(harvest!, "morning", 7)).toBe(false);

    // A prayer that is BOTH evening-only and seasonal must satisfy both.
    const winter = getPrayersByCategory("cosmic-and-planetary-reflection").find(
      (p) => p.seasonalMonths !== undefined,
    );
    expect(winter).toBeDefined();
    expect(isSuitableForWindow(winter!, "evening", 12)).toBe(true);
    expect(isSuitableForWindow(winter!, "evening", 7)).toBe(false);
    expect(isSuitableForWindow(winter!, "morning", 12)).toBe(false);
  });
});

describe("getDailyAffirmation", () => {
  it("is deterministic and category-aware", () => {
    const first = getDailyAffirmation(MORNING, "courage-and-resilience");
    const second = getDailyAffirmation(MORNING, "courage-and-resilience");
    expect(first?.id).toBe(second?.id);
    expect(first?.categoryIds).toContain("courage-and-resilience");
  });
});

describe("getDailyConceptFrame", () => {
  it("is stable for a local date and explicit worldview", () => {
    const first = getDailyConceptFrame(
      "2026-08-26",
      "open-universal",
      conceptEngineFrames,
    );
    const second = getDailyConceptFrame(
      "2026-08-26",
      "open-universal",
      conceptEngineFrames,
    );
    expect(first?.id).toBe(second?.id);
  });

  it("never returns an incompatible frame", () => {
    for (const worldview of [
      "open-universal",
      "gnostic",
      "esoteric-christian",
      "neutral",
    ] as const) {
      for (let day = 1; day <= 28; day += 1) {
        const frame = getDailyConceptFrame(
          `2026-09-${String(day).padStart(2, "0")}`,
          worldview,
          conceptEngineFrames,
        );
        expect(frame?.compatibleWorldviews).toContain(worldview);
      }
    }
  });

  it("returns undefined when the supplied shelf has no compatible frame", () => {
    expect(
      getDailyConceptFrame("2026-08-26", "neutral", []),
    ).toBeUndefined();
  });
});

describe("getAnotherItem", () => {
  it("never returns the excluded id (200 random rolls)", () => {
    const daily = getDailyItem(MORNING, "courage-and-resilience");
    expect(daily).toBeDefined();
    for (let roll = 0; roll < 200; roll += 1) {
      const another = getAnotherItem(daily!.id, "courage-and-resilience");
      expect(another).not.toBeNull();
      expect(another?.id).not.toBe(daily!.id);
    }
  });

  it("with a pool of two (category of three minus the excluded), it always returns one of the other two", () => {
    const categoryPrayers = getPrayersByCategory("courage-and-resilience");
    expect(categoryPrayers).toHaveLength(3);
    const excluded = categoryPrayers[0]!;
    const others = new Set(
      categoryPrayers.filter((p) => p.id !== excluded.id).map((p) => p.id),
    );

    // Extreme RNG values exercise both ends of the remaining pool.
    for (const roll of [0, 0.25, 0.5, 0.75, 0.999999]) {
      const another = getAnotherItem(excluded.id, "courage-and-resilience", () => roll);
      expect(another).not.toBeNull();
      expect(others.has(another!.id)).toBe(true);
      expect(another!.id).not.toBe(excluded.id);
    }
  });

  it("deterministic rng yields deterministic picks", () => {
    const daily = getDailyItem(EVENING, "grief-and-lament");
    const first = getAnotherItem(daily!.id, "grief-and-lament", () => 0.42);
    const second = getAnotherItem(daily!.id, "grief-and-lament", () => 0.42);
    expect(first?.id).toBe(second?.id);
  });

  it("clamps an out-of-range rng instead of crashing", () => {
    const daily = getDailyItem(MORNING);
    const another = getAnotherItem(daily!.id, undefined, () => 1);
    expect(another).not.toBeNull();
    expect(another?.id).not.toBe(daily!.id);
  });

  it("returns null when there is nothing else to offer", () => {
    expect(getAnotherItem("any-id", "no-such-category", () => 0)).toBeNull();
  });
});
