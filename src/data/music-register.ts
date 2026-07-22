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
  duration: z.string().min(1),
  published: z.string().min(1),
  viewsChecked: z.number().int().nonnegative(),
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
  frequenciesHz: z.array(z.number().int().positive()),
});

const MusicRegisterSnapshotSchema = z.object({
  source: z.string().min(1),
  total: z.number().int().positive(),
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
export const musicRegisterFamilies = MusicFamilySchema.options;
export const musicRegisterFrequencies = [
  ...new Set(musicRegister.flatMap((item) => item.frequenciesHz)),
].sort((a, b) => a - b);
