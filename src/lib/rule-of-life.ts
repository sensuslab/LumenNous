import type {
  Affirmation,
  ReflectionPrompt,
  Teaching,
} from "@/lib/schemas";
import { hashString, localISODate } from "@/lib/daily";

export interface RuleOfLifeLibrary {
  affirmations: readonly Affirmation[];
  prompts: readonly ReflectionPrompt[];
  teachings: readonly Teaching[];
}

export interface DailyRuleOfLife {
  affirmation: Affirmation | undefined;
  prompt: ReflectionPrompt | undefined;
  teaching: Teaching | undefined;
  closePrompt: string;
}

const PHYSICAL_GUIDANCE_PATTERN =
  /\b(body|breath|breathe|feet|hands|jaw|move|posture|shoulders?|sit|stand|walk)\b/i;

const CLOSE_PROMPTS = [
  "Choose one tap to close today: gossip, performing for approval, compulsive checking, keeping a grudge warm — or none.",
  "Notice one story you do not need to repeat today. Let accuracy be enough — or choose none.",
  "Decline one needless argument, comparison or rehearsal. Nothing has to be selected.",
  "Protect one conversation from exaggeration. Say only what you know — or leave this door closed.",
] as const;

function belongsToAnyCategory(
  itemCategoryIds: readonly string[],
  categoryIds: readonly string[],
): boolean {
  return itemCategoryIds.some((id) => categoryIds.includes(id));
}

function pickDaily<T>(pool: readonly T[], key: string): T | undefined {
  if (pool.length === 0) return undefined;
  return pool[hashString(key) % pool.length];
}

/**
 * Assemble the optional, non-gamified doors shown beneath Today's one primary
 * prayer. The function intentionally excludes physical guidance: that material
 * remains outside this implementation until its own diagram and review pass.
 */
export function getDailyRuleOfLife(
  date: Date,
  categoryIds: readonly string[],
  library: RuleOfLifeLibrary,
): DailyRuleOfLife {
  const dayKey = localISODate(date);
  const categoryKey = [...categoryIds].sort().join("|") || "all";

  const affirmations = library.affirmations.filter(
    (item) =>
      belongsToAnyCategory(item.categoryIds, categoryIds) &&
      !PHYSICAL_GUIDANCE_PATTERN.test(`${item.text} ${item.backingActHint}`),
  );
  const prompts = library.prompts.filter(
    (item) =>
      belongsToAnyCategory(item.categoryIds, categoryIds) &&
      !PHYSICAL_GUIDANCE_PATTERN.test(item.text),
  );
  const teachings = library.teachings.filter(
    (item) =>
      belongsToAnyCategory(item.relatedCategoryIds, categoryIds) &&
      !PHYSICAL_GUIDANCE_PATTERN.test(`${item.title} ${item.summary}`),
  );

  return {
    affirmation: pickDaily(
      affirmations,
      `${dayKey}|${categoryKey}|word`,
    ),
    prompt: pickDaily(prompts, `${dayKey}|${categoryKey}|reflection`),
    teaching: pickDaily(teachings, `${dayKey}|${categoryKey}|reading`),
    closePrompt:
      pickDaily(CLOSE_PROMPTS, `${dayKey}|${categoryKey}|close`) ??
      CLOSE_PROMPTS[0],
  };
}

export function containsPhysicalGuidance(value: string): boolean {
  return PHYSICAL_GUIDANCE_PATTERN.test(value);
}
