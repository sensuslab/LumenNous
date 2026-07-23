import { z } from "zod";
import registerSnapshot from "@/data/corpus/youtube_audio_register.json";

export const MusicFamilySchema = z.enum([
  "CHANT",
  "AMBIENT",
  "NATURE",
  "HZ",
  "BINAURAL",
  "SINGING",
  "CHAKRA",
  "DNA",
  "SOLFEGGIO",
  "GUIDED",
]);

export const MusicRegisterItemSchema = z.object({
  id: z.string().min(1),
  family: MusicFamilySchema,
  title: z.string().min(1),
  channel: z.string().min(1),
  channelType: z.string().min(1),
  url: z.url(),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  durationSeconds: z.number().int().nonnegative().nullable(),
  published: z.string().min(1),
  viewsChecked: z.number().int().nonnegative().nullable(),
  descriptionSummary: z.string().min(1),
  language: z.string().min(1),
  traditionGenre: z.string().min(1),
  intendedCategories: z.array(z.string().min(1)),
  playlistFit: z.string().min(1),
  evidenceLabel: z.enum([
    "TRADITIONAL_PRACTICE",
    "EXPERIENTIAL_CLAIM",
    "SCIENTIFIC_EVIDENCE",
    "PRELIMINARY_EVIDENCE",
    "COMMERCIALLY_POPULAR_BUT_UNSUBSTANTIATED",
    "CONTRADICTED_OR_MISLEADING",
  ]),
  claimRisk: z.enum(["low", "medium", "high", "blocked"]),
  rightsStatus: z.string().min(1),
  playbackMode: z.enum(["embed", "link"]),
  lastChecked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readinessState: z.enum([
    "ready_for_editorial_review",
    "needs_rights_review",
    "needs_theological_or_cultural_review",
    "needs_claim_review",
    "blocked",
    "format_reference_only",
  ]),
  notes: z.string().min(1),
  frequenciesHz: z.array(z.number().positive()),
});

const DuplicateUrlSchema = z.object({
  url: z.url(),
  ids: z.array(z.string().min(1)).min(2),
});

const MusicRegisterSnapshotSchema = z.object({
  source: z.string().min(1),
  total: z.number().int().positive(),
  duplicateUrls: z.array(DuplicateUrlSchema),
  items: z.array(MusicRegisterItemSchema),
});

const parsed = MusicRegisterSnapshotSchema.parse(registerSnapshot);

if (parsed.total !== parsed.items.length) {
  throw new Error("Music register total does not match its item count.");
}

export type MusicFamily = z.infer<typeof MusicFamilySchema>;
export type MusicRegisterItem = z.infer<typeof MusicRegisterItemSchema>;

export const musicRegister = parsed.items;
export const musicRegisterSource = parsed.source;
export const musicRegisterDuplicateUrls = parsed.duplicateUrls;
export const musicRegisterById = new Map(
  musicRegister.map((item) => [item.id, item]),
);
export const musicRegisterFamilies = MusicFamilySchema.options;
export const musicRegisterFrequencies = [
  ...new Set(musicRegister.flatMap((item) => item.frequenciesHz)),
].sort((a, b) => a - b);

const CONSERVATIVE_PUBLIC_FAMILIES = new Set<MusicFamily>([
  "CHANT",
  "AMBIENT",
  "NATURE",
  "SINGING",
]);
const CONSERVATIVE_EVIDENCE_LABELS = new Set<MusicRegisterItem["evidenceLabel"]>([
  "TRADITIONAL_PRACTICE",
  "EXPERIENTIAL_CLAIM",
  "SCIENTIFIC_EVIDENCE",
  "PRELIMINARY_EVIDENCE",
]);
const CONSERVATIVE_RIGHTS_STATES = new Set([
  "official_institution",
  "institution",
  "likely_official",
]);

/**
 * Baseline eligibility for public editorial selection. Passing this predicate
 * does not publish an item: it must also appear in the explicit allowlist in
 * `music-selections.ts`.
 */
export function isConservativePublicMusicItem(
  item: MusicRegisterItem,
): boolean {
  return (
    CONSERVATIVE_PUBLIC_FAMILIES.has(item.family) &&
    item.playbackMode === "embed" &&
    item.readinessState === "ready_for_editorial_review" &&
    item.claimRisk === "low" &&
    CONSERVATIVE_EVIDENCE_LABELS.has(item.evidenceLabel) &&
    CONSERVATIVE_RIGHTS_STATES.has(item.rightsStatus)
  );
}

export function formatMusicDuration(seconds: number | null): string {
  if (seconds === null) return "Length unavailable";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function musicFrequenciesFor(
  items: readonly MusicRegisterItem[],
): number[] {
  return [...new Set(items.flatMap((item) => item.frequenciesHz))].sort(
    (left, right) => left - right,
  );
}
