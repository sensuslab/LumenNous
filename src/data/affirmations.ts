/**
 * Seed affirmations — at least four per category.
 *
 * Editorial rules (brief): affirmations never promise guaranteed healing,
 * wealth, protection, manifestation or transformation, and never imply that
 * suffering results from insufficient belief. They are written as honest
 * orientations — capacity, permission, commitment — not as cosmic orders.
 */

import { AffirmationSchema, type Affirmation, type AffirmationType } from "../lib/schemas";
import {
  corpusSeedAffirmations,
  expandCorpusCategoryIds,
} from "./corpus";

interface AffDef {
  text: string;
  type: AffirmationType;
  tags: string[];
}

/** categoryId -> four affirmations (ids generated deterministically). */
const DEFS: Record<string, AffDef[]> = {
  "grounding-and-stillness": [
    { text: "I am here, in this moment, and this moment is enough to begin from.", type: "grounding", tags: ["presence"] },
    { text: "The ground beneath me is allowed to hold some of what I carry.", type: "grounding", tags: ["support"] },
    { text: "I can be still without being stuck, and quiet without being empty.", type: "contemplative", tags: ["stillness"] },
    { text: "One breath at a time is a complete way to live this minute.", type: "grounding", tags: ["breath"] },
  ],
  "connection-to-source": [
    { text: "I am connected to the Source of all being, even when I cannot feel it.", type: "devotional", tags: ["connection"] },
    { text: "I am known more deeply than I know myself, and held more steadily than I hold on.", type: "devotional", tags: ["being-known"] },
    { text: "The light that made the world is not far from me; I can turn toward it today.", type: "devotional", tags: ["light"] },
    { text: "My longing for the Divine is itself a form of its presence in me.", type: "contemplative", tags: ["longing"] },
  ],
  "gnosis-and-inner-knowing": [
    { text: "Beneath the noise of borrowed opinions, a quiet knowing in me remains.", type: "contemplative", tags: ["inner-knowing"] },
    { text: "I can trust the still, small voice more than the loud, frightened one.", type: "grounding", tags: ["trust"] },
    { text: "I am allowed to seek in my own way and arrive in my own time.", type: "contemplative", tags: ["seeking"] },
    { text: "What is true in me recognises what is true around me.", type: "contemplative", tags: ["truth"] },
  ],
  "clarity-and-discernment": [
    { text: "I can see my situation honestly without seeing it hopelessly.", type: "grounding", tags: ["honesty"] },
    { text: "I do not need the whole map to take one faithful step.", type: "resilience", tags: ["steps"] },
    { text: "I am allowed to change my mind when truth changes my view.", type: "contemplative", tags: ["humility"] },
    { text: "The quieter counsel is usually the truer one; I can wait for it.", type: "contemplative", tags: ["patience"] },
  ],
  "protection-and-boundaries": [
    { text: "I am allowed to protect my peace without apologising for the boundary.", type: "resilience", tags: ["boundaries"] },
    { text: "My 'no' is a complete sentence and a sacred one.", type: "resilience", tags: ["no"] },
    { text: "I can be open-hearted and well-defended at the same time.", type: "grounding", tags: ["balance"] },
    { text: "Asking for help is one of the strongest things I do.", type: "resilience", tags: ["help"] },
  ],
  "cleansing-and-release": [
    { text: "I can honour what happened without carrying it forever.", type: "releasing", tags: ["letting-go"] },
    { text: "What is finished is allowed to be finished.", type: "releasing", tags: ["endings"] },
    { text: "I release what was never mine, with blessing and without drama.", type: "releasing", tags: ["release"] },
    { text: "Every out-breath is practice in letting go.", type: "grounding", tags: ["breath"] },
  ],
  "root-work-and-restoration": [
    { text: "Slow repair is still repair; I honour the pace of my mending.", type: "resilience", tags: ["patience"] },
    { text: "Resting is not failing; it is how strength returns.", type: "grounding", tags: ["rest"] },
    { text: "Small faithful care of myself is sacred work.", type: "gratitude", tags: ["self-care"] },
    { text: "I do not have to earn the right to begin again.", type: "resilience", tags: ["beginning"] },
  ],
  "courage-and-resilience": [
    { text: "Courage is fear that comes along; I can go accompanied.", type: "resilience", tags: ["courage"] },
    { text: "I have survived every hard day so far; that record means something.", type: "resilience", tags: ["track-record"] },
    { text: "I can do the next hard thing without being unafraid of it.", type: "grounding", tags: ["action"] },
    { text: "Returning after being knocked down is my resilience, and it counts.", type: "resilience", tags: ["returning"] },
  ],
  "healing-and-renewal": [
    { text: "I deserve care, and I am allowed to receive it.", type: "grounding", tags: ["care"] },
    { text: "My worth is not measured by my health, my output or my speed.", type: "contemplative", tags: ["worth"] },
    { text: "I can hope for renewal without pretending away what hurts.", type: "resilience", tags: ["hope"] },
    { text: "My body is doing its best; I can meet it with kindness.", type: "gratitude", tags: ["body"] },
  ],
  "grief-and-lament": [
    { text: "My grief is love with nowhere to go, and it is welcome here.", type: "contemplative", tags: ["grief"] },
    { text: "I do not have to be over it; I only have to be accompanied through it.", type: "grounding", tags: ["accompaniment"] },
    { text: "Tears are a form of prayer when words run out.", type: "devotional", tags: ["tears"] },
    { text: "I can mourn honestly and still trust that morning will come.", type: "resilience", tags: ["hope"] },
  ],
  "forgiveness": [
    { text: "I can set the debt down without denying that it was owed.", type: "releasing", tags: ["release"] },
    { text: "Forgiveness is a practice before it is a feeling; I can practise.", type: "contemplative", tags: ["practice"] },
    { text: "I am allowed to forgive myself and still make amends.", type: "grounding", tags: ["self-forgiveness"] },
    { text: "My apology can be a door, not a demand.", type: "grounding", tags: ["apology"] },
  ],
  "love-and-relationships": [
    { text: "I am worthy of love that does not have to be earned back daily.", type: "grounding", tags: ["worth"] },
    { text: "I can love with open hands — holding, not grasping.", type: "contemplative", tags: ["freedom"] },
    { text: "The love I have received can flow through me to others.", type: "gratitude", tags: ["generosity"] },
    { text: "Honesty and kindness can live in the same sentence; I can speak both.", type: "grounding", tags: ["honesty"] },
  ],
  "purpose-and-calling": [
    { text: "My purpose grows where my gifts meet the world's need.", type: "contemplative", tags: ["calling"] },
    { text: "Ordinary faithfulness is a worthy life, and I can live it well.", type: "grounding", tags: ["faithfulness"] },
    { text: "I am trusted to choose; I can walk my road wholeheartedly.", type: "resilience", tags: ["choosing"] },
    { text: "The next small faithful step is enough for today.", type: "grounding", tags: ["steps"] },
  ],
  "creativity": [
    { text: "I am allowed to make imperfect things; beginning is the brave part.", type: "resilience", tags: ["beginning"] },
    { text: "My creativity does not have to pay rent to deserve a place in my life.", type: "grounding", tags: ["permission"] },
    { text: "A block is weather, not a verdict; I can wait it out kindly.", type: "contemplative", tags: ["block"] },
    { text: "Making things is part of how I was made; I honour it by practising.", type: "devotional", tags: ["making"] },
  ],
  "gratitude-and-provision": [
    { text: "I live on gifts I did not earn, and noticing them is my prayer.", type: "gratitude", tags: ["gift"] },
    { text: "I can ask for what I need without shame and receive it with thanks.", type: "grounding", tags: ["asking"] },
    { text: "Enough is a real place, and I am allowed to recognise it.", type: "gratitude", tags: ["enough"] },
    { text: "What I have can be shared; what I need can be asked for.", type: "gratitude", tags: ["generosity"] },
  ],
  "change-and-transition": [
    { text: "I can mark an ending honestly before I race to a beginning.", type: "grounding", tags: ["endings"] },
    { text: "The in-between is not empty; it is where I travel lightest.", type: "contemplative", tags: ["liminal"] },
    { text: "Beginnings are allowed to feel strange; I give this one a season.", type: "resilience", tags: ["beginnings"] },
    { text: "I have crossed thresholds before; something in me knows the way.", type: "resilience", tags: ["thresholds"] },
  ],
  "justice-and-ethical-action": [
    { text: "I can see clearly, act honestly, and stay kind.", type: "grounding", tags: ["integrity"] },
    { text: "My small faithful actions are part of a long river of repair.", type: "resilience", tags: ["faithfulness"] },
    { text: "I refuse both despair that does nothing and righteousness that loves itself.", type: "contemplative", tags: ["balance"] },
    { text: "Rest is part of the work of justice, not a betrayal of it.", type: "grounding", tags: ["rest"] },
  ],
  "sleep-and-rest": [
    { text: "Rest is given, not earned; I can lay the unfinished down.", type: "releasing", tags: ["rest"] },
    { text: "I am loved at rest exactly as much as I am loved at work.", type: "devotional", tags: ["worth"] },
    { text: "The night can hold what I cannot; I can stand down.", type: "grounding", tags: ["night"] },
    { text: "Tomorrow's strength is being made in tonight's rest.", type: "contemplative", tags: ["renewal"] },
  ],
  "morning-orientation": [
    { text: "I set my direction before the world sets it for me.", type: "grounding", tags: ["intention"] },
    { text: "I begin this day blessed, not behind.", type: "gratitude", tags: ["gift"] },
    { text: "Today asks for my presence, not my perfection.", type: "grounding", tags: ["presence"] },
    { text: "The light returning is older than my worries; I can borrow its patience.", type: "devotional", tags: ["light"] },
  ],
  "anxiety-and-overwhelm": [
    { text: "This moment I can meet; the next one will introduce itself in time.", type: "grounding", tags: ["presence"] },
    { text: "I was never asked to carry everything; two true things are enough for today.", type: "grounding", tags: ["enough"] },
    { text: "My body can lead my mind back to calm, one slow breath at a time.", type: "grounding", tags: ["breath"] },
    { text: "Asking for help with anxiety is strength, and I am allowed to be strong.", type: "resilience", tags: ["help"] },
  ],
  "chakra-contemplation": [
    { text: "I can inhabit my whole self, from ground to sky.", type: "contemplative", tags: ["wholeness"] },
    { text: "I reach upward only as far as I am rooted downward.", type: "grounding", tags: ["rooted"] },
    { text: "My heart can soften safely, a little at a time.", type: "contemplative", tags: ["heart"] },
    { text: "Attention itself is a form of care; I offer it to every part of me.", type: "contemplative", tags: ["attention"] },
  ],
  "cosmic-and-planetary-reflection": [
    { text: "I am small, brief, and astonished — and that is a form of belonging.", type: "contemplative", tags: ["awe"] },
    { text: "The same Source holds the galaxies and my one small life.", type: "devotional", tags: ["scale"] },
    { text: "I belong to a living world, and my care is part of its healing.", type: "grounding", tags: ["earth"] },
    { text: "Winter clarifies; I can navigate by fewer, truer lights.", type: "resilience", tags: ["seasons"] },
  ],
};

const raw: Affirmation[] = [
  ...Object.entries(DEFS).flatMap(([categoryId, defs]) =>
    defs.map((def, index) => ({
    id: `aff-${categoryId}-${String(index + 1).padStart(2, "0")}`,
    text: def.text,
    categoryIds: expandCorpusCategoryIds([categoryId]),
    affirmationType: def.type,
    sourceIds: [],
    tags: def.tags,
    editorialStatus: "draft" as const,
    })),
  ),
  ...corpusSeedAffirmations.map((affirmation) => ({
    ...affirmation,
    categoryIds: expandCorpusCategoryIds(affirmation.categoryIds),
  })),
];

// Validated at module load.
export const affirmations: Affirmation[] = AffirmationSchema.array().parse(raw);

export const affirmationById = new Map(
  affirmations.map((affirmation) => [affirmation.id, affirmation]),
);
