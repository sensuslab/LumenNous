import { corpusCategoryProfiles } from "@/data/corpus";
import { getCoherenceSessionForCategory } from "@/data/session-templates";
import {
  GROUNDING_REGULATION_INSTRUCTION,
  avoidsBreathFocus,
  isBreathFocusAvoidance,
} from "@/lib/coherence";
import {
  EngineRequestSchema,
  EngineResultSchema,
  type Affirmation,
  type Category,
  type EngineRequest,
  type EngineResult,
  type Practice,
  type Prayer,
  type ReflectionPrompt,
} from "@/lib/schemas";
import {
  classifySafety,
  safetyResponseFor,
  type SafetyClassification,
} from "@/lib/safety";

export interface EngineLibrary {
  categories: readonly Category[];
  prayers: readonly Prayer[];
  affirmations: readonly Affirmation[];
  practices: readonly Practice[];
  prompts: readonly ReflectionPrompt[];
}

export interface EngineHistory {
  version: 2;
  bags: Record<string, string[]>;
  lastBySlot: Record<string, string>;
  cycleBySlot: Record<string, number>;
  recentFingerprints: string[];
}

export interface EngineHistoryStore {
  read: () => EngineHistory;
  write: (history: EngineHistory) => void;
  clear: () => void;
}

export interface EngineOptions {
  history?: EngineHistoryStore;
  now?: () => Date;
  random?: () => number;
}

const STORAGE_KEY = "lumennous-engine-history-v2";
const HISTORY_VERSION = 2;
const RECENT_FINGERPRINT_LIMIT = 12;
const DEFAULT_CATEGORY_ID = "grounding-and-stillness";
const CLASSIFIER_STOP_WORDS = new Set([
  "feel",
  "feels",
  "feeling",
  "hard",
  "name",
  "need",
  "something",
  "thing",
  "today",
  "want",
]);
const TOKEN_ALIASES: Record<string, string> = {
  anxious: "anxiety",
  afraid: "fear",
  scared: "fear",
  overwhelmed: "overwhelm",
  grieving: "grief",
  grateful: "gratitude",
  lonely: "loneliness",
  tired: "exhaustion",
};

const DURATION_MINUTES: Record<EngineRequest["duration"], number> = {
  brief: 2,
  "five-minutes": 5,
  "ten-minutes": 10,
  extended: 15,
};

const TONE_TERMS: Record<EngineRequest["tone"], string[]> = {
  gentle: ["gentle", "kind", "soft", "rest", "care", "mercy", "comfort"],
  direct: ["act", "choose", "step", "courage", "honest", "boundary", "clear"],
  contemplative: ["quiet", "silence", "attention", "wonder", "listen", "still"],
  devotional: ["creator", "source", "divine", "prayer", "trust", "praise"],
  grounding: ["ground", "body", "breath", "present", "feet", "settle", "here"],
};

const LANGUAGE_TERMS: Record<EngineRequest["languagePreference"], string[]> = {
  creator: ["creator", "made", "maker"],
  source: ["source", "ground of being", "origin"],
  divine: ["divine", "god", "holy", "sacred"],
  "gnostic-terminology": ["gnosis", "pleroma", "aeon", "sophia", "spark", "monad"],
  neutral: ["quiet", "attention", "body", "earth", "moment", "life"],
};

function emptyHistory(): EngineHistory {
  return {
    version: HISTORY_VERSION,
    bags: {},
    lastBySlot: {},
    cycleBySlot: {},
    recentFingerprints: [],
  };
}

let fallbackHistory = emptyHistory();

function isEngineHistory(value: unknown): value is EngineHistory {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<EngineHistory>;
  return (
    candidate.version === HISTORY_VERSION &&
    typeof candidate.bags === "object" &&
    candidate.bags !== null &&
    typeof candidate.lastBySlot === "object" &&
    candidate.lastBySlot !== null &&
    typeof candidate.cycleBySlot === "object" &&
    candidate.cycleBySlot !== null &&
    Array.isArray(candidate.recentFingerprints)
  );
}

export function createBrowserEngineHistory(): EngineHistoryStore {
  return {
    read: () => {
      if (typeof window === "undefined") return fallbackHistory;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return fallbackHistory;
        const parsed: unknown = JSON.parse(raw);
        if (isEngineHistory(parsed)) {
          fallbackHistory = parsed;
          return parsed;
        }
      } catch {
        // Memory history remains available when browser storage is blocked.
      }
      return fallbackHistory;
    },
    write: (history) => {
      fallbackHistory = history;
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch {
        // The current session still benefits from the in-memory copy.
      }
    },
    clear: () => {
      fallbackHistory = emptyHistory();
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing else to clear when storage is unavailable.
      }
    },
  };
}

export function createMemoryEngineHistory(): EngineHistoryStore {
  let history = emptyHistory();
  return {
    read: () => history,
    write: (next) => {
      history = next;
    },
    clear: () => {
      history = emptyHistory();
    },
  };
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[\s-]+/)
    .map((token) => TOKEN_ALIASES[token] ?? token)
    .filter((token) => token.length > 2 && !CLASSIFIER_STOP_WORDS.has(token));
}

export function classifyCategoryId(
  userNeed: string,
  categories: readonly Category[],
): string {
  const input = normalize(userNeed);
  const inputTokens = new Set(tokens(input));
  if (!input || inputTokens.size === 0) return DEFAULT_CATEGORY_ID;

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  let best = { id: DEFAULT_CATEGORY_ID, score: 0 };

  for (const profile of corpusCategoryProfiles) {
    const category = categoryById.get(profile.appCategoryId);
    if (!category?.isActive) continue;
    const phrases = [profile.name, ...profile.aliases, ...category.intentions];
    const descriptive = [profile.user_need, profile.spiritual_objective, category.shortDescription];
    let score = 0;

    for (const phrase of phrases) {
      const normalizedPhrase = normalize(phrase);
      if (normalizedPhrase && input.includes(normalizedPhrase)) score += 12;
      for (const token of tokens(phrase)) {
        if (inputTokens.has(token)) score += 4;
      }
    }
    for (const phrase of descriptive) {
      for (const token of tokens(phrase)) {
        if (inputTokens.has(token)) score += 2;
      }
    }

    if (score > best.score) best = { id: profile.appCategoryId, score };
  }

  return best.id;
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex] as T, result[index] as T];
  }
  return result;
}

function takeFromBag<T extends { id: string }>(
  slot: string,
  candidates: readonly T[],
  history: EngineHistory,
  random: () => number,
): { item: T | undefined; cycle: number } {
  if (candidates.length === 0) return { item: undefined, cycle: 1 };
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const storedBag = history.bags[slot];
  let bag = Array.isArray(storedBag)
    ? storedBag.filter((id) => typeof id === "string" && byId.has(id))
    : [];
  const storedCycle = history.cycleBySlot[slot];
  let cycle = Number.isInteger(storedCycle) && storedCycle > 0 ? storedCycle : 0;

  if (bag.length === 0) {
    bag = shuffle([...byId.keys()], random);
    cycle += 1;
    const previous = history.lastBySlot[slot];
    const nextIndex = bag.length - 1;
    if (bag.length > 1 && bag[nextIndex] === previous) {
      [bag[0], bag[nextIndex]] = [bag[nextIndex] as string, bag[0] as string];
    }
  }

  const id = bag.pop();
  history.bags[slot] = bag;
  history.cycleBySlot[slot] = Math.max(1, cycle);
  if (id) history.lastBySlot[slot] = id;
  return { item: id ? byId.get(id) : undefined, cycle: Math.max(1, cycle) };
}

function containsAvoidance(text: string, avoidances: readonly string[]): boolean {
  const normalizedText = normalize(text);
  return avoidances.some((avoidance) => {
    const normalizedAvoidance = normalize(avoidance);
    return normalizedAvoidance.length > 1 && normalizedText.includes(normalizedAvoidance);
  });
}

function scoreText(text: string, terms: readonly string[]): number {
  const normalizedText = normalize(text);
  return terms.reduce(
    (score, term) => score + (normalizedText.includes(normalize(term)) ? 1 : 0),
    0,
  );
}

function prayerCandidates(
  request: EngineRequest,
  category: Category,
  library: EngineLibrary,
): Prayer[] {
  const direct = library.prayers.filter((prayer) =>
    prayer.categoryIds.includes(category.id),
  );
  const related = library.prayers.filter((prayer) =>
    prayer.categoryIds.some((id) => category.relatedCategoryIds.includes(id)),
  );
  const initial = direct.length > 0 ? direct : related;
  const withoutAvoidances = initial.filter(
    (prayer) =>
      !containsAvoidance(
        `${prayer.opening} ${prayer.body} ${prayer.closing} ${prayer.tags.join(" ")}`,
        request.avoidances,
      ),
  );
  const pool = request.avoidances.length > 0 ? withoutAvoidances : initial;
  const target = DURATION_MINUTES[request.duration];
  const ranked = [...pool].sort((left, right) => {
    const preferenceScore = (prayer: Prayer): number =>
      scoreText(
        `${prayer.opening} ${prayer.body} ${prayer.tags.join(" ")}`,
        TONE_TERMS[request.tone],
      ) * 3 +
      scoreText(
        `${prayer.opening} ${prayer.body} ${prayer.tags.join(" ")}`,
        LANGUAGE_TERMS[request.languagePreference],
      ) * 2 -
      Math.abs(prayer.practiceDuration - target) * 0.25;
    return preferenceScore(right) - preferenceScore(left);
  });
  return ranked.slice(0, Math.max(2, Math.ceil(ranked.length * 0.7)));
}

function affirmationCandidates(
  request: EngineRequest,
  category: Category,
  library: EngineLibrary,
): Affirmation[] {
  const direct = library.affirmations.filter((item) =>
    item.categoryIds.includes(category.id),
  );
  const filtered = direct.filter(
    (item) => !containsAvoidance(`${item.text} ${item.tags.join(" ")}`, request.avoidances),
  );
  return request.avoidances.length > 0 ? filtered : direct;
}

function practiceCandidates(
  request: EngineRequest,
  category: Category,
  library: EngineLibrary,
): Practice[] {
  const direct = library.practices.filter((item) =>
    item.categoryIds.includes(category.id),
  );
  const filtered = direct.filter(
    (item) =>
      !containsAvoidance(
        `${item.title} ${item.preparation} ${item.steps.map((step) => step.instruction).join(" ")}`,
        request.avoidances,
      ),
  );
  const target = DURATION_MINUTES[request.duration];
  const pool = request.avoidances.length > 0 ? filtered : direct;
  if (pool.length === 0) return [];
  const distanceFromTarget = (practice: Practice): number =>
    Math.min(...practice.durationOptions.map((value) => Math.abs(value - target)));
  const closestDistance = Math.min(...pool.map(distanceFromTarget));
  return pool.filter((practice) => distanceFromTarget(practice) === closestDistance);
}

function promptCandidates(
  request: EngineRequest,
  category: Category,
  library: EngineLibrary,
): ReflectionPrompt[] {
  const direct = library.prompts.filter((item) => item.categoryIds.includes(category.id));
  const filtered = direct.filter(
    (item) => !containsAvoidance(`${item.text} ${item.tags.join(" ")}`, request.avoidances),
  );
  return request.avoidances.length > 0 ? filtered : direct;
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return `ln-${(result >>> 0).toString(36)}`;
}

function safetyResult(
  request: EngineRequest,
  classification: SafetyClassification,
  category: Category,
  now: () => Date,
): EngineResult {
  const response = safetyResponseFor(classification);
  const paragraphs = response.split(/\n{2,}/);
  const opening = paragraphs.shift() ?? "Your wellbeing comes first.";
  const closing = paragraphs.pop() ?? "Please reach for human support now.";
  const fingerprint = hash(`safety:${classification.level}:${category.id}`);
  return EngineResultSchema.parse({
    title: classification.level === "crisis" ? "Please reach someone now" : "A grounded pause",
    categoryId: category.id,
    category: category.name,
    outputType: request.outputType,
    opening,
    prayer: paragraphs.join("\n\n"),
    affirmation: "",
    practiceDuration: 1,
    practiceSteps: [],
    reflectionPrompts: [],
    closing,
    sourceIds: [],
    traditionLabels: [],
    audioRecommendationIds: [],
    safetyNote: "This fixed response is written and reviewed by people. It is not assembled by the Engine.",
    safetyLevel: classification.level,
    assembledAt: now().toISOString(),
    fingerprint,
    recipe: { promptIds: [], cycle: 1 },
  });
}

export function composeWithEngine(
  rawRequest: EngineRequest,
  library: EngineLibrary,
  options: EngineOptions = {},
): EngineResult {
  const request = EngineRequestSchema.parse(rawRequest);
  const now = options.now ?? (() => new Date());
  const random = options.random ?? Math.random;
  const historyStore = options.history ?? createBrowserEngineHistory();
  const safety = classifySafety(request.userNeed);
  const explicitCategory =
    request.categoryId === "not-sure"
      ? undefined
      : library.categories.find(
          (category) => category.id === request.categoryId && category.isActive,
        );
  const inferredCategoryId = classifyCategoryId(request.userNeed, library.categories);
  const category =
    explicitCategory ??
    library.categories.find(
      (candidate) => candidate.id === inferredCategoryId && candidate.isActive,
    ) ??
    library.categories.find((candidate) => candidate.id === DEFAULT_CATEGORY_ID) ??
    library.categories.find((candidate) => candidate.isActive);

  if (!category) throw new Error("The Engine needs at least one active category.");
  if (safety.level !== "none") return safetyResult(request, safety, category, now);

  const history = historyStore.read();
  const key = `${category.id}:${request.outputType}:${request.duration}:${request.tone}:${request.languagePreference}`;
  const coherenceSession =
    request.outputType === "combined-practice"
      ? getCoherenceSessionForCategory(category.id)
      : undefined;
  const breathFreeCoherence =
    coherenceSession !== undefined && avoidsBreathFocus(request.avoidances);
  const otherCoherenceAvoidances = request.avoidances.filter(
    (avoidance) => !isBreathFocusAvoidance(avoidance),
  );
  if (
    coherenceSession &&
    containsAvoidance(
      [
        coherenceSession.opening,
        ...coherenceSession.stages.flatMap((stage) => [
          stage.instruction,
          stage.prompt,
        ]),
        coherenceSession.closing,
      ].join(" "),
      otherCoherenceAvoidances,
    )
  ) {
    throw new Error(
      `The reviewed coherence wording conflicts with a requested avoidance for ${category.name}.`,
    );
  }
  const needsPrayer = request.outputType === "prayer";
  const needsAffirmation = request.outputType === "affirmation";
  const needsPractice = request.outputType === "meditation";
  const needsPrompt =
    request.duration !== "brief" &&
    category.id !== "sleep-and-rest" &&
    request.outputType !== "affirmation" &&
    request.outputType !== "combined-practice";

  const prayerPick = needsPrayer
    ? takeFromBag(`${key}:prayer`, prayerCandidates(request, category, library), history, random)
    : { item: undefined, cycle: 1 };
  const affirmationPick = needsAffirmation
    ? takeFromBag(
        `${key}:affirmation`,
        affirmationCandidates(request, category, library),
        history,
        random,
      )
    : { item: undefined, cycle: 1 };
  const practicePick = needsPractice
    ? takeFromBag(
        `${key}:practice`,
        practiceCandidates(request, category, library),
        history,
        random,
      )
    : { item: undefined, cycle: 1 };
  const prayer = prayerPick.item;
  const affirmation = affirmationPick.item;
  const practice = practicePick.item;
  const prayerPromptCandidates = prayer
    ? prayer.reflectionPromptIds
        .map((id) => library.prompts.find((candidate) => candidate.id === id))
        .filter((candidate): candidate is ReflectionPrompt => candidate !== undefined)
    : [];
  const promptPick = needsPrompt
    ? takeFromBag(
        `${key}:prompt`,
        prayerPromptCandidates.length > 0
          ? prayerPromptCandidates
          : promptCandidates(request, category, library),
        history,
        random,
      )
    : { item: undefined, cycle: 1 };
  const prompt = promptPick.item;
  if (needsPrayer && !prayer) {
    throw new Error(`No compatible prayer is available for ${category.name}.`);
  }
  if (needsAffirmation && !affirmation) {
    throw new Error(`No compatible affirmation is available for ${category.name}.`);
  }
  if (needsPractice && !practice) {
    throw new Error(`No compatible practice is available for ${category.name}.`);
  }
  const recipeIds = [
    prayer?.id,
    affirmation?.id,
    practice?.id,
    prompt?.id,
    coherenceSession?.id,
  ].filter((id): id is string => id !== undefined);
  if (recipeIds.length === 0) {
    throw new Error(`No compatible library material is available for ${category.name}.`);
  }

  const fingerprint = hash(`${key}:${recipeIds.join(":")}`);
  history.recentFingerprints = [
    fingerprint,
    ...history.recentFingerprints.filter((value) => value !== fingerprint),
  ].slice(0, RECENT_FINGERPRINT_LIMIT);
  historyStore.write(history);

  const targetMinutes = DURATION_MINUTES[request.duration];
  const practiceDuration = coherenceSession
    ? Math.ceil(
        coherenceSession.stages.reduce(
          (total, stage) => total + stage.seconds,
          0,
        ) / 60,
      )
    : practice
      ? practice.durationOptions.reduce((closest, option) =>
          Math.abs(option - targetMinutes) < Math.abs(closest - targetMinutes)
            ? option
            : closest,
        )
      : prayer?.practiceDuration ?? 0;
  const sourceIds = [
    ...new Set([
      ...(prayer?.sourceIds ?? []),
      ...(affirmation?.sourceIds ?? []),
      ...(practice?.sourceIds ?? []),
      ...(coherenceSession?.sourceIds ?? []),
    ]),
  ];
  const cycle = Math.max(
    prayerPick.cycle,
    affirmationPick.cycle,
    practicePick.cycle,
  );
  const title =
    request.outputType === "affirmation"
      ? `A line for ${category.name}`
      : coherenceSession
        ? `Coherence prayer for ${category.name}`
        : practice?.title ?? prayer?.title ?? category.name;
  const practiceSafetyNote = practice?.safetyNotes.trim() ?? "";
  const coherenceSafetyNote = coherenceSession
    ? breathFreeCoherence
      ? [
          "Use visual and contact-point grounding instead of breath counting. Stop if orienting makes you more distressed or disoriented.",
          "This practice does not replace medical or mental-health care and does not guarantee healing or any external outcome.",
          coherenceSession.variant === "challenge-reset"
            ? "If you may be in danger, prioritise leaving, contacting a trusted person or emergency support over completing the timer."
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      : coherenceSession.safetyNotes.trim()
    : "";
  const userFacingSafetyNote = [practiceSafetyNote, coherenceSafetyNote]
    .filter((note) => /[.!?]$/.test(note))
    .join(" ");

  return EngineResultSchema.parse({
    title,
    categoryId: category.id,
    category: category.name,
    outputType: request.outputType,
    opening:
      coherenceSession
        ? coherenceSession.opening
        : request.outputType === "meditation"
        ? practice?.preparation ?? "Arrive as you are."
        : prayer?.opening ?? "A line to carry into this moment.",
    prayer: prayer?.body ?? "",
    affirmation: affirmation?.text ?? "",
    practiceDuration,
    practiceSteps: coherenceSession
      ? coherenceSession.stages.map((stage) =>
          stage.id === "regulate" && breathFreeCoherence
            ? GROUNDING_REGULATION_INSTRUCTION
            : stage.instruction,
        )
      : practice?.steps.map((step) => step.instruction) ??
        (request.outputType === "prayer" ? prayer?.practiceSteps ?? [] : []),
    reflectionPrompts: prompt ? [prompt.text] : [],
    closing:
      coherenceSession
        ? coherenceSession.closing
        : request.outputType === "meditation"
        ? practice?.closing ?? "Return gently."
        : prayer?.closing ??
          "Read it slowly, and keep only what feels honest.",
    sourceIds,
    traditionLabels: prayer?.traditionLabels ?? [],
    audioRecommendationIds: [
      ...new Set([
        ...(prayer?.audioIds ?? []),
        ...(practice?.audioIds ?? []),
        ...(coherenceSession?.audioTrackIds ?? []),
      ]),
    ],
    safetyNote: userFacingSafetyNote,
    safetyLevel: "none",
    assembledAt: now().toISOString(),
    fingerprint,
    recipe: {
      prayerId: prayer?.id,
      affirmationId: affirmation?.id,
      practiceId: practice?.id ?? coherenceSession?.id,
      promptIds: prompt ? [prompt.id] : [],
      cycle,
    },
  });
}
