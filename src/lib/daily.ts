/**
 * Daily selection logic (brief: DAILY SELECTION LOGIC).
 *
 * - Deterministic: the daily item is derived from a hash of the local ISO
 *   calendar date (YYYY-MM-DD) plus the category slug, so the same day and
 *   category always yield the same item — stable within the day, and across
 *   reloads, devices and sessions for that date.
 * - Time-of-day suitability: items marked "morning" are preferred before
 *   noon local time, "evening" items after 6pm, and "seasonal-aware" items
 *   only inside their seasonalMonths. If no suitable item exists, the
 *   library falls back gracefully rather than showing nothing.
 *   NOTE on stability: suitability windows mean the daily item can change
 *   at the noon / 6pm boundaries when the base pick is unsuitable for the
 *   new window (e.g. an evening prayer is replaced by a morning-suitable
 *   one at 9am). Within each window the pick is fully stable. This is the
 *   intended trade-off between "stable throughout the day" and
 *   "time-sensitive content", and it is documented for editors.
 * - "Generate Another" (getAnotherItem) picks uniformly at random via an
 *   injectable RNG. IMPORTANT: random selection is a UX convenience for
 *   browsing the library — it is NOT divination, not a sign, and not a
 *   supernatural message. Never present it as one.
 */

import { affirmations, categoryById, categoryBySlug, prayers } from "../data";
import type { Affirmation, Prayer } from "./schemas";

/* ------------------------------------------------------------------ */
/* Hashing                                                             */
/* ------------------------------------------------------------------ */

/** FNV-1a 32-bit — small, fast, deterministic across platforms. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Local calendar date as YYYY-MM-DD (local on purpose: the user's "today"). */
export function localISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ------------------------------------------------------------------ */
/* Time-of-day suitability                                             */
/* ------------------------------------------------------------------ */

export type DayWindow = "morning" | "day" | "evening";

/** morning = before 12:00 local; evening = 18:00 or later; day = between. */
export function windowForDate(date: Date): DayWindow {
  const hour = date.getHours();
  if (hour < 12) return "morning";
  if (hour >= 18) return "evening";
  return "day";
}

/**
 * Is this prayer a preferred fit for the given window and calendar month?
 * seasonalMonths is an additional constraint for EVERY timeOfDay value: an
 * item tagged [3,4,5] is in season only in March–May, whatever its window.
 */
export function isSuitableForWindow(
  prayer: Prayer,
  window: DayWindow,
  month: number,
): boolean {
  if (
    prayer.seasonalMonths !== undefined &&
    !prayer.seasonalMonths.includes(month)
  ) {
    return false;
  }
  switch (prayer.timeOfDay) {
    case "any":
    case "seasonal-aware":
      // "seasonal-aware" items have no window constraint — only the season.
      return true;
    case "morning":
      return window === "morning";
    case "evening":
      return window === "evening";
  }
}

/* ------------------------------------------------------------------ */
/* Daily item                                                          */
/* ------------------------------------------------------------------ */

function eligiblePrayers(categorySlug?: string): Prayer[] {
  if (categorySlug === undefined) return prayers;
  const category = categoryBySlug.get(categorySlug) ?? categoryById.get(categorySlug);
  if (!category) return [];
  return prayers.filter((prayer) => prayer.categoryIds.includes(category.id));
}

/**
 * The deterministic daily prayer.
 *
 * Base pick: hash(localDate | category) into the eligible pool. If the base
 * pick is not suitable for the current window/month, walk forward through
 * the (stable) pool order to the first suitable item; if none is suitable,
 * keep the base pick so the app always has something to show.
 */
export function getDailyItem(date: Date, categorySlug?: string): Prayer | undefined {
  const pool = eligiblePrayers(categorySlug);
  if (pool.length === 0) return undefined;

  const key = `${localISODate(date)}|${categorySlug ?? "all"}`;
  const baseIndex = hashString(key) % pool.length;

  const month = date.getMonth() + 1;
  const window = windowForDate(date);

  const base = pool[baseIndex];
  if (base === undefined) return undefined;
  if (isSuitableForWindow(base, window, month)) {
    return base;
  }
  for (let offset = 1; offset < pool.length; offset += 1) {
    const candidate = pool[(baseIndex + offset) % pool.length];
    if (candidate === undefined) break;
    if (isSuitableForWindow(candidate, window, month)) {
      return candidate;
    }
  }
  return base;
}

/**
 * The deterministic daily affirmation (affirmations carry no timeOfDay
 * suitability, so this is a pure date+category hash).
 */
export function getDailyAffirmation(
  date: Date,
  categorySlug?: string,
): Affirmation | undefined {
  let pool = affirmations;
  if (categorySlug !== undefined) {
    const category = categoryBySlug.get(categorySlug) ?? categoryById.get(categorySlug);
    if (!category) return undefined;
    pool = affirmations.filter((affirmation) =>
      affirmation.categoryIds.includes(category.id),
    );
  }
  if (pool.length === 0) return undefined;
  const key = `${localISODate(date)}|${categorySlug ?? "all"}|affirmation`;
  return pool[hashString(key) % pool.length];
}

/* ------------------------------------------------------------------ */
/* "Generate Another" — random, never immediately repeating            */
/* ------------------------------------------------------------------ */

/** Injectable randomness for testability. Must return [0, 1). */
export type Rng = () => number;

/**
 * Pick a random prayer different from `excludeId`.
 *
 * This is a plain random browse of the library — NOT divination, NOT a
 * sign, NOT a message. (See brief: "Do not imply that the random choice
 * is divination or a supernatural message.")
 *
 * - Pool = prayers in the category (or the whole library) minus excludeId.
 * - With a pool of two total, this always returns the other prayer.
 * - Returns null only when every available prayer is the excluded one
 *   (i.e. the pool had a single member) — callers should keep showing the
 *   current item in that edge case.
 */
export function getAnotherItem(
  excludeId: string,
  categorySlug?: string,
  rng: Rng = Math.random,
): Prayer | null {
  const pool = eligiblePrayers(categorySlug).filter(
    (prayer) => prayer.id !== excludeId,
  );
  if (pool.length === 0) return null;
  const roll = Math.min(Math.max(rng(), 0), 0.999999999);
  const index = Math.floor(roll * pool.length);
  return pool[index] ?? null;
}
