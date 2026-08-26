/**
 * Original editorial composition fragments used when a person explicitly
 * selects a source-grounded conceptual lens in Create.
 */

import {
  ConceptEngineFrameSchema,
  type ConceptEngineFrame,
} from "../lib/schemas";

const raw: ConceptEngineFrame[] = [
  {
    id: "frm-oneness-fullness",
    conceptId: "con-oneness-fullness",
    title: "Oneness and fullness",
    description:
      "Belonging to a whole that exceeds the isolated self, offered as contemplative and symbolic language rather than a claim that the universe sends messages or arranges outcomes.",
    compatibleWorldviews: ["open-universal", "gnostic", "neutral"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-gospel-of-truth", "src-gospel-of-thomas"],
    sourceUses: [
      { anchorId: "anc-truth-belonging-rest", relation: "inspired-by" },
      { anchorId: "anc-thomas-two-one", relation: "comparative-context" },
    ],
    prayerLine:
      "Let me remember that I am neither the whole nor separate from it. Return me to belonging that makes room for difference, limits and the lives around me.",
    affirmation:
      "I belong within a larger life without losing my boundaries or becoming the whole.",
    practiceStep:
      "Notice three forms of support connecting you to a larger life—one bodily, one relational and one ecological—without looking for a sign or message.",
    reflectionPrompt:
      "Where does belonging make you more responsible to difference rather than less aware of it?",
    safetyNote:
      "Oneness is symbolic language here; it does not establish universal consciousness, telepathy, manifestation or loss of personal boundaries.",
    editorialStatus: "draft",
  },
  {
    id: "frm-inner-outer",
    conceptId: "con-inner-outer",
    title: "Within and outside",
    description:
      "Interior experience and observable life are held together so that neither private certainty nor external pressure becomes absolute.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian", "neutral"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-gospel-of-thomas"],
    sourceUses: [
      { anchorId: "anc-thomas-inner-outer", relation: "paraphrase" },
    ],
    prayerLine:
      "Keep my inward experience in honest conversation with the world outside me. Let feeling disclose what matters and let fact, relationship and consequence correct what feeling cannot know alone.",
    affirmation:
      "I can honour what I feel and still check what is true around me.",
    practiceStep:
      "Name one inward impression and one observable fact; notice where they agree and where more information is needed.",
    reflectionPrompt:
      "What does the outer world add to your inward understanding of this moment?",
    safetyNote:
      "An inward impression is reflection material, not an instruction or substitute for evidence and qualified help.",
    editorialStatus: "draft",
  },
  {
    id: "frm-inner-light",
    conceptId: "con-inner-light",
    title: "Inner light and Epinoia",
    description:
      "Source-specific images of awakening intelligence translated into humility, ethical visibility and ordinary conduct rather than special power.",
    compatibleWorldviews: ["open-universal", "gnostic", "neutral"],
    classification: "symbolic",
    traditionLabels: ["original-composition", "historical-teaching", "symbolic-language"],
    sourceIds: ["src-gospel-of-thomas", "src-apocryphon-of-john"],
    sourceUses: [
      { anchorId: "anc-thomas-inner-light", relation: "inspired-by" },
      { anchorId: "anc-john-epinoia", relation: "comparative-context" },
    ],
    prayerLine:
      "Let light become visible as honesty, patience and care. Keep me from confusing a beautiful image with special status, and bring whatever awakens in me into accountable action.",
    affirmation:
      "The light I value becomes credible through humble and observable care.",
    practiceStep:
      "Choose one grounded quality for the image of light, then name one visible action that would express it today.",
    reflectionPrompt:
      "How could inner light become conduct rather than identity or status?",
    safetyNote:
      "No vision, hidden helper or unusual sensation is expected; images remain imagination and symbolic reflection material.",
    editorialStatus: "draft",
  },
  {
    id: "frm-descent-return",
    conceptId: "con-descent-return",
    title: "Descent and return",
    description:
      "An arc of scattering, recognition, repair and return shared comparatively across ancient Gnostic and later esoteric sources.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-gospel-of-truth", "src-apocryphon-of-john", "src-grumbine-melchizedek"],
    sourceUses: [
      { anchorId: "anc-truth-belonging-rest", relation: "comparative-context" },
      { anchorId: "anc-john-epinoia", relation: "comparative-context" },
      { anchorId: "anc-grumbine-descent-return", relation: "comparative-context" },
    ],
    prayerLine:
      "Meet me in the places where attention has scattered. Help me recognise one grounded way back—not an escape from embodiment, but a return to presence, relationship and the work before me.",
    affirmation:
      "Return can be one grounded movement toward presence, repair and belonging.",
    practiceStep:
      "Trace one arc from disconnection to return: what scattered you, what helped you notice, and what small repair is possible now?",
    reflectionPrompt:
      "What would return mean if it brought you more fully into embodied life?",
    safetyNote:
      "Descent and return are symbolic maps, not scientific cosmology, proof of a pre-birth existence or a reason to reject the body.",
    editorialStatus: "draft",
  },
  {
    id: "frm-sophia-correction",
    conceptId: "con-sophia-correction",
    title: "Wisdom, error and correction",
    description:
      "Sophia's source-specific myth becomes a bounded reflection on imbalance, consequence and reintegration without demonising error.",
    compatibleWorldviews: ["open-universal", "gnostic"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-apocryphon-of-john"],
    sourceUses: [
      { anchorId: "anc-john-sophia-correction", relation: "inspired-by" },
    ],
    prayerLine:
      "Wisdom that can survive correction, help me face consequence without collapsing into shame. Show me the missing relationship, limit or perspective that can help this choice become more whole.",
    affirmation:
      "Error can become correction when I face consequence and welcome missing perspective.",
    practiceStep:
      "Name one decision that became unbalanced, then identify a limit, relationship or fact that was missing and one repair you can attempt.",
    reflectionPrompt:
      "What form of correction restores relationship without erasing responsibility?",
    safetyNote:
      "Sophia's myth is not evidence that cosmic rulers caused a personal problem, and correction must not become shame or self-punishment.",
    editorialStatus: "draft",
  },
  {
    id: "frm-union-integration",
    conceptId: "con-union-integration",
    title: "Union and integration",
    description:
      "Images of making two one and bridal union are adapted as integration that preserves consent, identity and necessary difference.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian", "neutral"],
    classification: "symbolic",
    traditionLabels: ["original-composition", "historical-teaching", "symbolic-language"],
    sourceIds: ["src-gospel-of-thomas", "src-gospel-of-philip"],
    sourceUses: [
      { anchorId: "anc-thomas-two-one", relation: "inspired-by" },
      { anchorId: "anc-philip-union", relation: "comparative-context" },
    ],
    prayerLine:
      "Let divided truths meet without forcing either to disappear. Teach me an integration spacious enough for consent, difference, grief and every boundary that protects life.",
    affirmation:
      "Integration lets different truths enter relationship without demanding sameness.",
    practiceStep:
      "Name two genuine needs in tension and choose one small action that respects both without crossing a boundary.",
    reflectionPrompt:
      "Which difference needs relationship, and which boundary needs to remain?",
    safetyNote:
      "Union language never requires reconciliation with harm, sexual or gender conformity, or surrender of consent and boundaries.",
    editorialStatus: "draft",
  },
  {
    id: "frm-word-medicine",
    conceptId: "con-word-medicine",
    title: "Word as medicine for sight",
    description:
      "Careful language can change perception and reveal assumptions; the ancient medical image is retained as metaphor only.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian", "neutral"],
    classification: "symbolic",
    traditionLabels: ["original-composition", "historical-teaching", "symbolic-language"],
    sourceIds: ["src-authoritative-teaching", "src-prayer-thanksgiving"],
    sourceUses: [
      { anchorId: "anc-authoritative-word-medicine", relation: "inspired-by" },
      { anchorId: "anc-thanksgiving-knowledge", relation: "comparative-context" },
    ],
    prayerLine:
      "Give me words precise enough to clear rather than conceal. Where fear says always or never, return me to what I can observe, ask, revise and speak with care.",
    affirmation:
      "I can choose language that leaves room for truth, evidence and revision.",
    practiceStep:
      "Replace one absolute statement with I notice, I fear, I hope or one possibility is, then add a fact that complicates it.",
    reflectionPrompt:
      "Which word changed your ability to see the situation more honestly?",
    safetyNote:
      "Word-medicine is a literary metaphor and does not imply medical treatment, diagnosis or guaranteed psychological change.",
    editorialStatus: "draft",
  },
  {
    id: "frm-silence-self-possession",
    conceptId: "con-silence-self-possession",
    title: "Silence and self-possession",
    description:
      "Chosen silence gathers attention while keeping stopping power, sensory alternatives and conscious agency intact.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian", "neutral"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-discourse-eighth-ninth", "src-grumbine-melchizedek"],
    sourceUses: [
      { anchorId: "anc-eighth-ninth-silence", relation: "comparative-context" },
      { anchorId: "anc-grumbine-self-possession", relation: "paraphrase" },
    ],
    prayerLine:
      "Let silence return me to choice. Keep every thought, image and sensation within the freedom to observe, question and release; let no inner event claim authority over conscience or reality.",
    affirmation:
      "Silence is mine to enter, shape and leave; no inner event commands me.",
    practiceStep:
      "Choose eyes-open, eyes-lowered or movement-based quiet for one minute, then reorient by naming where you are and what you will do next.",
    reflectionPrompt:
      "What makes silence feel chosen, bounded and connected to ordinary life?",
    safetyNote:
      "Stop and reorient if silence increases distress, disorientation, a sense of control or pressure to obey voices, signs or entities.",
    editorialStatus: "draft",
  },
  {
    id: "frm-fourfold-reading",
    conceptId: "con-fourfold-reading",
    title: "Fourfold symbolic reading",
    description:
      "Grumbine's historical, occult, law/cosmos and mystical lenses become a transparent interpretation exercise, not standard biblical scholarship.",
    compatibleWorldviews: ["open-universal", "esoteric-christian"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "modern-interpretation"],
    sourceIds: ["src-grumbine-melchizedek"],
    sourceUses: [
      { anchorId: "anc-grumbine-four-strata", relation: "paraphrase" },
    ],
    prayerLine:
      "Teach me to hold story, symbol, pattern and mystical meaning as lenses rather than secret facts. Keep interpretation curious, accountable and willing to say: this is one reading.",
    affirmation:
      "A symbolic reading can be meaningful without becoming hidden fact or final authority.",
    practiceStep:
      "Choose one image and name a plain, symbolic, pattern-based and mystical reading; label every layer as interpretation.",
    reflectionPrompt:
      "Which interpretive lens opened meaning, and which one tempted you to overclaim?",
    safetyNote:
      "Fourfold reading is Grumbine's esoteric method, not scholarly consensus or privileged access to historical intention and cosmic law.",
    editorialStatus: "draft",
  },
  {
    id: "frm-purpose-service",
    conceptId: "con-purpose-service",
    title: "Purpose as service",
    description:
      "Purpose emerges where present capacity, chosen values, consent and observed need meet—not as rank, ordination or a cosmic assignment.",
    compatibleWorldviews: ["open-universal", "gnostic", "esoteric-christian", "neutral"],
    classification: "modern-interpretation",
    traditionLabels: ["original-composition", "historical-teaching", "modern-interpretation"],
    sourceIds: ["src-nag-hammadi-melchizedek", "src-teachings-silvanus", "src-grumbine-melchizedek"],
    sourceUses: [
      { anchorId: "anc-nag-melchizedek-distinction", relation: "comparative-context" },
      { anchorId: "anc-silvanus-discipline", relation: "comparative-context" },
      { anchorId: "anc-grumbine-self-possession", relation: "comparative-context" },
    ],
    prayerLine:
      "Keep purpose close to the ground: capacity beside value, consent beside need. Let service make others freer, and free me from needing a title, hidden lineage or cosmic assignment.",
    affirmation:
      "Purpose can be a revisable act of service rather than a rank or destiny.",
    practiceStep:
      "Name one present capacity, one chosen value and one observed need; form a small, consensual service experiment where they overlap.",
    reflectionPrompt:
      "What form of service creates practical benefit without making you indispensable?",
    safetyNote:
      "This lens confers no title, ordination, lineage or authority and never asks obedience to a leader, voice, entity or sign.",
    editorialStatus: "draft",
  },
];

export const conceptEngineFrames = ConceptEngineFrameSchema.array().parse(raw);
export const conceptEngineFrameByConceptId = new Map(
  conceptEngineFrames.map((frame) => [frame.conceptId, frame]),
);
