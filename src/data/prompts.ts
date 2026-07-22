/**
 * Seed reflection prompts — open-ended invitations, at least four per
 * category. Prompts never demand disclosure: they may be held silently,
 * journaled privately, or simply sat with.
 */

import { ReflectionPromptSchema, type ReflectionPrompt } from "../lib/schemas";
import {
  corpusReflectionPrompts,
  expandCorpusCategoryIds,
} from "./corpus";

/** categoryId -> prompt texts (ids generated deterministically). */
const DEFS: Record<string, string[]> = {
  "grounding-and-stillness": [
    "Where in your body do you feel most present right now, and where do you feel absent?",
    "What would it be like to do nothing at all for the next three minutes?",
    "Name five things you can sense from where you are. Which one had you not noticed?",
    "What are you carrying into this moment that could be set down, just for now?",
  ],
  "connection-to-source": [
    "What name or image for the Divine feels most honest to you today — and what happens when you let go of all of them?",
    "When have you felt most deeply accompanied? What were the conditions?",
    "If the Source of all being were listening right now, what would you want it to know first?",
    "What separates you from a felt sense of connection — and is that separation as solid as it seems?",
  ],
  "gnosis-and-inner-knowing": [
    "What do you know, deep down, that you have been pretending not to know?",
    "Recall a time when quiet intuition proved wiser than loud opinion. What did that knowing feel like?",
    "What noise — inner or outer — most often drowns out your deeper knowing?",
    "If you trusted the still, small voice for one hour today, what might it say?",
  ],
  "clarity-and-discernment": [
    "What decision are you circling, and what would you advise a dear friend in the same position?",
    "Which of your motives in this situation are you proudest of — and which do you least want to examine?",
    "What would become clear if you removed urgency from the question?",
    "What is the kindest true thing you can say about this situation?",
  ],
  "protection-and-boundaries": [
    "Where does your 'yes' currently mean something you do not intend?",
    "What boundary, once set, gave you back a piece of yourself?",
    "What are you absorbing that was never yours to carry?",
    "Who are the trusted people you could reach for if you stopped carrying this alone?",
  ],
  "cleansing-and-release": [
    "What are you rehearsing in your mind that is ready to have its final performance?",
    "If you could return one burden to its rightful owner, what would it be?",
    "What did today bring that does not need to come with you into tomorrow?",
    "What might forgiveness — of yourself or another — make room for?",
  ],
  "root-work-and-restoration": [
    "Which basic need — sleep, food, movement, company — have you been treating as optional?",
    "What does 'enough' look like in this season of your life?",
    "What small, unglamorous habit has quietly kept you standing?",
    "What would restoration look like if it were allowed to take as long as it takes?",
  ],
  "courage-and-resilience": [
    "What are you afraid of — and what is on the other side of that fear?",
    "Recall a time you did the hard thing anyway. What carried you through?",
    "Where in your life is quiet endurance already at work, unacknowledged?",
    "What would you attempt this week if you trusted you could survive failing?",
  ],
  "healing-and-renewal": [
    "What part of you is asking for kindness rather than improvement?",
    "How has your body been speaking to you lately, and have you been listening?",
    "What does healing mean to you when cure is not promised?",
    "Who or what accompanies you in recovery — and could you let them in further?",
  ],
  "grief-and-lament": [
    "What have you lost that the world has not yet given you permission to mourn?",
    "If your grief could speak without being corrected, what would it say?",
    "What do you want to remember about who or what is gone?",
    "What small ritual could honour this loss today?",
  ],
  "forgiveness": [
    "What debt are you still collecting on — and what is the collecting costing you?",
    "Is there a difference, for you, between forgiving and excusing? What is it?",
    "What do you need to forgive yourself for, and who could help you do it?",
    "What would safety need to look like before reconciliation could even be considered?",
  ],
  "love-and-relationships": [
    "Who in your life feels like shelter — and when did you last tell them?",
    "Where are you loving with clenched hands, and what would open hands change?",
    "What kind of love are you quietly hungry for right now?",
    "Which relationship in your life is asking for honesty more than harmony?",
  ],
  "purpose-and-calling": [
    "What work makes you lose track of time, and what might that be telling you?",
    "Whose need keeps crossing your path — as if it were assigned to you?",
    "If your gifts wrote a job description for you, what would it say?",
    "What is the next small, faithful step — not the whole staircase?",
  ],
  "creativity": [
    "What would you make if no one — including you — were grading it?",
    "Where is perfectionism standing between you and a beginning?",
    "What unfinished thing is still quietly calling to you?",
    "What did you love making as a child, before you knew whether you were good at it?",
  ],
  "gratitude-and-provision": [
    "List three things that sustained you today that you did not earn.",
    "What do you actually need right now — beneath what you want?",
    "When have you been provided for in a way you did not see coming?",
    "What would change if you trusted tomorrow to hold what tomorrow needs?",
  ],
  "change-and-transition": [
    "What is ending in your life, and have you let yourself mark it?",
    "What are you in-between right now — and what does this threshold ask of you?",
    "What are you most afraid the change will take, and what might it make possible?",
    "Who has crossed a similar threshold, and what can you borrow from their story?",
  ],
  "justice-and-ethical-action": [
    "Where have you been a bystander when you wished to be a neighbour?",
    "What injustice can you no longer unsee — and what is one honest response to it?",
    "Where might you be benefitting from arrangements you would not defend aloud?",
    "What would integrity cost you this week, and are you willing to pay it?",
  ],
  "sleep-and-rest": [
    "What are you still holding that belongs to today, not tonight?",
    "What would you say to the day if you were thanking it and dismissing it?",
    "Where does rest feel like guilt, and whose voice taught you that?",
    "What can be entrusted to the night — to be picked up again, or not, in the morning?",
  ],
  "morning-orientation": [
    "What is one word you want to carry through this day?",
    "What are you already bracing for — and can it be met rather than braced against?",
    "What are you grateful for before anything has happened yet?",
    "Who might need your patience today, and can you offer it in advance?",
  ],
  "anxiety-and-overwhelm": [
    "What is the one thing — not the ten things — that actually needs your attention next?",
    "Where is your breath right now: high and shallow, or low and slow?",
    "What are you predicting, and what would you say to a friend predicting the same?",
    "What has carried you through anxious seasons before?",
  ],
  "chakra-contemplation": [
    "Moving attention slowly from root to crown, where does your attention want to linger?",
    "Which centre feels nourished right now, and which feels neglected?",
    "What does 'balance' mean as a felt experience rather than an idea?",
    "If each centre had a single word for you today, what might they say in sequence?",
  ],
  "cosmic-and-planetary-reflection": [
    "When did the night sky last stop you in your tracks? What shifted in you?",
    "What does your smallest worry look like from the height of the stars?",
    "What do you owe the Earth that holds you — and what might paying it look like?",
    "Where do you feel most belonging: soil, sea, sky, or human company? Why?",
  ],
};

const raw: ReflectionPrompt[] = [
  ...Object.entries(DEFS).flatMap(([categoryId, texts]) =>
    texts.map((text, index) => ({
    id: `prm-${categoryId}-${String(index + 1).padStart(2, "0")}`,
    text,
    categoryIds: expandCorpusCategoryIds([categoryId]),
    tags: ["reflection"],
    editorialStatus: "draft" as const,
    })),
  ),
  ...corpusReflectionPrompts.map((prompt) => ({
    ...prompt,
    categoryIds: expandCorpusCategoryIds(prompt.categoryIds),
  })),
];

// Validated at module load.
export const reflectionPrompts: ReflectionPrompt[] =
  ReflectionPromptSchema.array().parse(raw);

export const reflectionPromptById = new Map(
  reflectionPrompts.map((prompt) => [prompt.id, prompt]),
);
