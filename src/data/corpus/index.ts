import taxonomyJson from "./app_taxonomy.json";
import affirmationFormsJson from "./affirmation_forms.json";
import promptsJson from "./reflection_prompts.json";
import seedJson from "./seed_content.json";
import type {
  Affirmation,
  AffirmationType,
  Practice,
  Prayer,
  ReflectionPrompt,
  TraditionLabel,
} from "@/lib/schemas";

export const CORPUS_VERSION = taxonomyJson.version;

export const CORPUS_CATEGORY_TO_APP_ID = {
  C01: "grounding-and-stillness",
  C02: "connection-to-source",
  C03: "gnosis-and-inner-knowing",
  C04: "clarity-and-discernment",
  C05: "protection-and-boundaries",
  C06: "cleansing-and-release",
  C07: "root-work-and-restoration",
  C08: "courage-and-resilience",
  C09: "healing-and-renewal",
  C10: "grief-and-lament",
  C11: "forgiveness",
  C12: "love-and-relationships",
  C13: "community-and-intercession",
  C14: "purpose-and-calling",
  C15: "creativity",
  C16: "gratitude-and-provision",
  C17: "confidence-and-self-worth",
  C18: "change-and-transition",
  C19: "justice-and-ethical-action",
  C20: "sleep-and-rest",
  C21: "morning-orientation",
  C23: "shadow-reflection",
  C24: "chakra-contemplation",
  C25: "cosmic-and-planetary-reflection",
  C26: "ancestral-remembrance",
  C27: "celebration-and-thanksgiving",
} as const;

type CorpusCategoryId = keyof typeof CORPUS_CATEGORY_TO_APP_ID;

interface CorpusTaxonomyCategory {
  id: CorpusCategoryId;
  name: string;
  aliases: string[];
  user_need: string;
  spiritual_objective: string;
  gnostic_frame: string;
  safety: string[];
  labels: string[];
}

export interface CorpusCategoryProfile extends CorpusTaxonomyCategory {
  appCategoryId: string;
}

export const corpusCategoryProfiles: CorpusCategoryProfile[] = (
  taxonomyJson.categories as CorpusTaxonomyCategory[]
).map((category) => ({
  ...category,
  appCategoryId: CORPUS_CATEGORY_TO_APP_ID[category.id],
}));

export const corpusAffirmationForms = affirmationFormsJson.forms;
export const corpusAffirmationHardBlocks = affirmationFormsJson.hard_blocks;

const promptGroups = promptsJson.prompts_by_category as Record<CorpusCategoryId, string[]>;

export const corpusReflectionPrompts: ReflectionPrompt[] = Object.entries(
  promptGroups,
).flatMap(([corpusId, prompts]) => {
  const categoryId = CORPUS_CATEGORY_TO_APP_ID[corpusId as CorpusCategoryId];
  if (!categoryId) return [];
  return prompts.map((text, index) => ({
    id: `corpus-prm-${corpusId.toLowerCase()}-${String(index + 1).padStart(2, "0")}`,
    text,
    categoryIds: [categoryId],
    tags: ["reflection", "corpus", CORPUS_VERSION],
    editorialStatus: "draft" as const,
  }));
});

const TRADITION_LABEL_MAP: Record<string, TraditionLabel> = {
  PRIMARY_TEXT: "historical-teaching",
  TRADITIONAL_PRACTICE: "shared-tradition",
  THEOLOGICAL_INTERPRETATION: "modern-interpretation",
  CREATOR_FRAMEWORK: "original-composition",
};

function traditionLabels(labels: string[]): TraditionLabel[] {
  const mapped = labels
    .map((label) => TRADITION_LABEL_MAP[label])
    .filter((label): label is TraditionLabel => label !== undefined);
  return mapped.length > 0 ? [...new Set(mapped)] : ["original-composition"];
}

function categoryId(corpusId: string): string {
  return CORPUS_CATEGORY_TO_APP_ID[corpusId as CorpusCategoryId] ?? "grounding-and-stillness";
}

interface CorpusSeedPrayer {
  id: string;
  category: string;
  title: string;
  length: string;
  text: string;
  labels: string[];
  safety: string[];
}

export const corpusSeedPrayers: Prayer[] = (seedJson.prayers as CorpusSeedPrayer[]).map(
  (item) => {
    const lines = item.text.split("\n").filter(Boolean);
    const opening = lines[0] ?? item.title;
    const closing = lines.at(-1) ?? "Amen.";
    const body = lines.slice(1, -1).join(" ");
    const mappedCategoryId = categoryId(item.category);
    return {
      id: item.id.toLowerCase(),
      title: item.title,
      categoryIds: [mappedCategoryId],
      traditionLabels: traditionLabels(item.labels),
      content: [opening, body, closing].join("\n\n"),
      opening,
      body,
      closing,
      affirmation: "I can meet this moment with honesty and one steady next step.",
      practiceDuration: item.length === "brief" ? 3 : item.length === "night" ? 5 : 7,
      practiceSteps: [
        "Choose a comfortable posture and notice one point of contact with the ground.",
        "Read the words slowly, leaving a little silence between each part.",
        "Close by naming one small action or form of support available now.",
      ],
      reflectionPromptIds: [
        `corpus-prm-${item.category.toLowerCase()}-01`,
        `corpus-prm-${item.category.toLowerCase()}-02`,
      ],
      sourceIds: [],
      audioIds: [],
      tags: ["corpus", CORPUS_VERSION, item.length],
      timeOfDay: item.length === "night" ? "evening" : "any",
      editorialStatus: "draft",
      safetyNotes: item.safety.join("; "),
    };
  },
);

const AFFIRMATION_TYPE_BY_FORM: Record<string, AffirmationType> = {
  F1: "resilience",
  F2: "grounding",
  F3: "grounding",
  F4: "contemplative",
  F5: "grounding",
  F6: "resilience",
  F7: "devotional",
  F8: "resilience",
  F9: "devotional",
  F10: "releasing",
};

interface CorpusSeedAffirmation {
  id: string;
  category: string;
  form: string;
  text: string;
}

export const corpusSeedAffirmations: Affirmation[] = (
  seedJson.affirmations as CorpusSeedAffirmation[]
).map((item) => {
  const formId = item.form.split("_")[0] ?? "F5";
  return {
    id: item.id.toLowerCase(),
    text: item.text,
    categoryIds: [categoryId(item.category)],
    affirmationType: AFFIRMATION_TYPE_BY_FORM[formId] ?? "grounding",
    sourceIds: [],
    tags: ["corpus", CORPUS_VERSION, item.form],
    editorialStatus: "draft",
  };
});

interface CorpusSeedPractice {
  id: string;
  name: string;
  categories: string[];
  duration_min: number;
  steps: string[];
  labels: string[];
  safety: string[];
}

export const corpusSeedPractices: Practice[] = (
  seedJson.practices as CorpusSeedPractice[]
).map((item) => ({
  id: item.id.toLowerCase(),
  slug: item.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  title: item.name,
  practiceType: "meditation",
  categoryIds: item.categories.map(categoryId),
  durationOptions: [item.duration_min],
  preparation: "Choose a position that feels supported. Eyes may remain open, and breath focus is always optional.",
  steps: item.steps.map((instruction, index) => ({
    title: `Step ${index + 1}`,
    instruction,
    seconds: Math.max(15, Math.floor((item.duration_min * 60) / item.steps.length)),
  })),
  closing: "Notice the room again and return at your own pace.",
  accessibilityNotes: "Use sound, touch or a visible object instead of breath. Pause or stop at any time.",
  safetyNotes: item.safety.join("; "),
  sourceIds: [],
  audioIds: [],
  editorialStatus: "draft",
}));

const CATEGORY_EXPANSIONS: Record<string, string[]> = {
  "love-and-relationships": ["community-and-intercession", "ancestral-remembrance"],
  "justice-and-ethical-action": ["community-and-intercession"],
  "connection-to-source": ["community-and-intercession", "celebration-and-thanksgiving"],
  "courage-and-resilience": ["confidence-and-self-worth"],
  "healing-and-renewal": ["confidence-and-self-worth"],
  "gnosis-and-inner-knowing": ["shadow-reflection"],
  forgiveness: ["shadow-reflection"],
  "grief-and-lament": ["ancestral-remembrance"],
  "gratitude-and-provision": ["ancestral-remembrance", "celebration-and-thanksgiving"],
  "morning-orientation": ["celebration-and-thanksgiving"],
};

/**
 * During the taxonomy migration, carefully related existing material can
 * support a new Corpus category. The original category IDs remain attached,
 * so provenance and editorial ownership are never obscured.
 */
export function expandCorpusCategoryIds(ids: string[]): string[] {
  const expanded = new Set(ids);
  for (const id of ids) {
    for (const relatedId of CATEGORY_EXPANSIONS[id] ?? []) expanded.add(relatedId);
  }
  return [...expanded];
}
