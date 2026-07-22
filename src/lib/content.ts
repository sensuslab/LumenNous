/**
 * Content access layer — pure, synchronous read functions over the seed
 * modules in `src/data/`.
 *
 * ARCHITECTURE NOTE (brief: CONTENT LIBRARY): this layer is the ONLY place
 * the rest of the app reads content from. It is deliberately shaped like a
 * repository interface so the backing store can later be swapped for JSON
 * imports, Markdown/MDX, a headless CMS, a database or a research-generated
 * knowledge library WITHOUT touching routes or components. When that day
 * comes, keep these function signatures and re-implement the internals
 * (some may become async — plan call sites accordingly).
 *
 * All functions are side-effect free and return undefined (never throw)
 * for missing lookups, so UI code can fall back gracefully.
 */

import {
  affirmations,
  audioItemById,
  audioItems,
  categories,
  categoryById,
  categoryBySlug,
  playlistBySlug,
  playlists,
  practices,
  prayerById,
  prayers,
  reflectionPromptById,
  reflectionPrompts,
  sourceById,
  sources,
  teachingBySlug,
  teachings,
  validateContent,
} from "../data";
import type {
  Affirmation,
  AudioItem,
  Category,
  Playlist,
  Practice,
  Prayer,
  ReflectionPrompt,
  Source,
  Teaching,
} from "./schemas";

export { validateContent };

const LEGACY_CATEGORY_IDS: Record<string, string> = {
  "protection-and-boundaries": "protection-and-boundaries",
  "cleansing-and-release": "cleansing-and-release",
  "root-work-and-restoration": "root-work-and-restoration",
  "healing-and-renewal": "healing-and-renewal",
  forgiveness: "forgiveness",
  creativity: "creativity",
  "gratitude-and-provision": "gratitude-and-provision",
  "chakra-contemplation": "chakra-contemplation",
  "cosmic-and-planetary-reflection": "cosmic-and-planetary-reflection",
  "anxiety-and-overwhelm": "grounding-and-stillness",
};

const CONTENT_ALIASES: Record<string, string[]> = {
  "grounding-and-stillness": ["anxiety-and-overwhelm"],
};

function contentCategoryIds(category: Category): string[] {
  return [category.id, ...(CONTENT_ALIASES[category.id] ?? [])];
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export function listActiveCategories(): Category[] {
  return categories.filter((category) => category.isActive);
}

export function listAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const direct = categoryBySlug.get(slug);
  if (direct?.isActive) return direct;
  const legacyId = LEGACY_CATEGORY_IDS[slug];
  return legacyId ? categoryById.get(legacyId) : direct;
}

export function getCategoryById(id: string): Category | undefined {
  const legacyId = LEGACY_CATEGORY_IDS[id];
  return categoryById.get(legacyId ?? id);
}

/** Resolve a category by slug OR id (callers should not need to care which). */
export function resolveCategory(slugOrId: string): Category | undefined {
  return getCategoryBySlug(slugOrId) ?? getCategoryById(slugOrId);
}

/* ------------------------------------------------------------------ */
/* Prayers                                                             */
/* ------------------------------------------------------------------ */

export function getPrayerById(id: string): Prayer | undefined {
  return prayerById.get(id);
}

export function getPrayersByCategory(categorySlugOrId: string): Prayer[] {
  const category = resolveCategory(categorySlugOrId);
  if (!category) return [];
  const categoryIds = contentCategoryIds(category);
  return prayers.filter((prayer) =>
    prayer.categoryIds.some((id) => categoryIds.includes(id)),
  );
}

export function listPrayers(): Prayer[] {
  return prayers;
}

/* ------------------------------------------------------------------ */
/* Affirmations                                                        */
/* ------------------------------------------------------------------ */

export function getAffirmationsByCategory(categorySlugOrId: string): Affirmation[] {
  const category = resolveCategory(categorySlugOrId);
  if (!category) return [];
  const categoryIds = contentCategoryIds(category);
  return affirmations.filter((affirmation) =>
    affirmation.categoryIds.some((id) => categoryIds.includes(id)),
  );
}

export function listAffirmations(): Affirmation[] {
  return affirmations;
}

/* ------------------------------------------------------------------ */
/* Practices                                                           */
/* ------------------------------------------------------------------ */

export function getPracticeBySlug(slug: string): Practice | undefined {
  return practices.find((practice) => practice.slug === slug);
}

export function getPracticesByCategory(categorySlugOrId: string): Practice[] {
  const category = resolveCategory(categorySlugOrId);
  if (!category) return [];
  const categoryIds = contentCategoryIds(category);
  return practices.filter((practice) =>
    practice.categoryIds.some((id) => categoryIds.includes(id)),
  );
}

export function listPractices(): Practice[] {
  return practices;
}

/* ------------------------------------------------------------------ */
/* Reflection prompts                                                  */
/* ------------------------------------------------------------------ */

export function getReflectionPromptById(id: string): ReflectionPrompt | undefined {
  return reflectionPromptById.get(id);
}

export function getPromptsByCategory(categorySlugOrId: string): ReflectionPrompt[] {
  const category = resolveCategory(categorySlugOrId);
  if (!category) return [];
  const categoryIds = contentCategoryIds(category);
  return reflectionPrompts.filter((prompt) =>
    prompt.categoryIds.some((id) => categoryIds.includes(id)),
  );
}

export function listReflectionPrompts(): ReflectionPrompt[] {
  return reflectionPrompts;
}

/* ------------------------------------------------------------------ */
/* Sources, audio, playlists, teachings                                */
/* ------------------------------------------------------------------ */

export function getSourceById(id: string): Source | undefined {
  return sourceById.get(id);
}

export function getSourcesByIds(ids: string[]): Source[] {
  return ids
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => source !== undefined);
}

export function listSources(): Source[] {
  return sources;
}

export function getAudioById(id: string): AudioItem | undefined {
  return audioItemById.get(id);
}

export function listAudioItems(): AudioItem[] {
  return audioItems;
}

export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return playlistBySlug.get(slug);
}

export function listPlaylists(): Playlist[] {
  return playlists;
}

/** Playlist with its audio items resolved, ready for display. */
export function getPlaylistWithItems(
  slug: string,
): { playlist: Playlist; items: AudioItem[] } | undefined {
  const playlist = playlistBySlug.get(slug);
  if (!playlist) return undefined;
  const items = playlist.itemIds
    .map((id) => audioItemById.get(id))
    .filter((item): item is AudioItem => item !== undefined);
  return { playlist, items };
}

export function getTeachingBySlug(slug: string): Teaching | undefined {
  return teachingBySlug.get(slug);
}

export function listTeachings(): Teaching[] {
  return teachings;
}

/* ------------------------------------------------------------------ */
/* Related content                                                     */
/* ------------------------------------------------------------------ */

export interface RelatedContent {
  prayers: Prayer[];
  affirmations: Affirmation[];
  practices: Practice[];
  prompts: ReflectionPrompt[];
  teachings: Teaching[];
  playlists: Playlist[];
}

/**
 * Content related to a category: everything tagged with the category plus
 * teachings that reference it and playlists whose intended use matches one
 * of the category's listening groupings (by slug/name convention).
 */
export function getRelatedContent(categorySlugOrId: string): RelatedContent {
  const category = resolveCategory(categorySlugOrId);
  if (!category) {
    return { prayers: [], affirmations: [], practices: [], prompts: [], teachings: [], playlists: [] };
  }
  const teachingsForCategory = teachings.filter((teaching) =>
    teaching.relatedCategoryIds.includes(category.id),
  );
  const playlistsForCategory = playlists.filter(
    (playlist) =>
      playlist.slug === category.slug ||
      playlist.title.toLowerCase() === category.name.toLowerCase(),
  );
  return {
    prayers: getPrayersByCategory(category.id),
    affirmations: getAffirmationsByCategory(category.id),
    practices: getPracticesByCategory(category.id),
    prompts: getPromptsByCategory(category.id),
    teachings: teachingsForCategory,
    playlists: playlistsForCategory,
  };
}

/**
 * Content related to a single prayer: its sources, prompts, and sibling
 * prayers/practices in the same categories (excluding the prayer itself).
 * Used by "Why this practice?" and "read the teaching behind it" surfaces.
 */
export function getRelatedForPrayer(prayerId: string): {
  prayer: Prayer;
  sources: Source[];
  prompts: ReflectionPrompt[];
  siblingPrayers: Prayer[];
  practices: Practice[];
  teachings: Teaching[];
} | undefined {
  const prayer = prayerById.get(prayerId);
  if (!prayer) return undefined;
  const prompts = prayer.reflectionPromptIds
    .map((id) => reflectionPromptById.get(id))
    .filter((prompt): prompt is ReflectionPrompt => prompt !== undefined);
  const siblingPrayers = prayers.filter(
    (candidate) =>
      candidate.id !== prayer.id &&
      candidate.categoryIds.some((id) => prayer.categoryIds.includes(id)),
  );
  const practicesForPrayer = practices.filter((practice) =>
    practice.categoryIds.some((id) => prayer.categoryIds.includes(id)),
  );
  const teachingsForPrayer = teachings.filter((teaching) =>
    teaching.relatedCategoryIds.some((id) => prayer.categoryIds.includes(id)),
  );
  return {
    prayer,
    sources: getSourcesByIds(prayer.sourceIds),
    prompts,
    siblingPrayers,
    practices: practicesForPrayer,
    teachings: teachingsForPrayer,
  };
}
