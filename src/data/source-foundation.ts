/**
 * Source-aware foundation for the LumenNous contemplative corpus.
 *
 * These records deliberately contain locators and original summaries, not
 * copied publication text. The private EPUBs are editorial inputs only and
 * are never bundled into the application.
 */

import {
  ContemplativeConceptSchema,
  EditorialReviewSchema,
  PassageAnchorSchema,
  SourceEditionSchema,
  SourceReviewPolicySchema,
  type ContemplativeConcept,
  type EditorialReview,
  type PassageAnchor,
  type SourceEdition,
} from "../lib/schemas";
import editorialReviewRecords from "./editorial-reviews.json";
import ingestedPassageAnchorRecords from "./ingested-passage-anchors.json";
import sourceEditionRecords from "./source-editions.json";
import sourceReviewPolicyRecords from "./source-review-policies.json";

const rawEditions = sourceEditionRecords as SourceEdition[];

const rawAnchors: Array<Omit<PassageAnchor, "structuredLocator">> = [
  {
    id: "anc-thomas-inner-outer",
    sourceId: "src-gospel-of-thomas",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Gospel of Thomas",
    sectionTitle: "The kingdom within and outside",
    locator: "EPUB/text_009.xhtml and text_010.xhtml; saying 3",
    conceptIds: ["con-inner-outer", "con-oneness-fullness"],
    verification: "mapped-from-extraction",
    notes:
      "Use for interior and exterior attention together. It must not be adapted as a claim that private intuition overrides observable reality.",
  },
  {
    id: "anc-thomas-two-one",
    sourceId: "src-gospel-of-thomas",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Gospel of Thomas",
    sectionTitle: "Making the two one",
    locator: "EPUB/text_009.xhtml and text_010.xhtml; sayings 22 and 106",
    conceptIds: ["con-union-integration", "con-oneness-fullness"],
    verification: "mapped-from-extraction",
    notes:
      "A source for integration practices. Preserve difference and consent; do not use nonduality to erase conflict, identity or boundaries.",
  },
  {
    id: "anc-thomas-inner-light",
    sourceId: "src-gospel-of-thomas",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Gospel of Thomas",
    sectionTitle: "Light within a person of light",
    locator: "EPUB/text_009.xhtml and text_010.xhtml; saying 24",
    conceptIds: ["con-inner-light", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "Use inner light as awakened identity and ethical visibility, not as proof of special status, infallibility or supernatural power.",
  },
  {
    id: "anc-truth-belonging-rest",
    sourceId: "src-gospel-of-truth",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Gospel of Truth",
    sectionTitle: "Knowledge, belonging and rest",
    locator: "EPUB/text_004.xhtml and text_005.xhtml; knowledge/rest sequence",
    conceptIds: ["con-oneness-fullness", "con-descent-return"],
    verification: "mapped-from-extraction",
    notes:
      "Supports rest as homecoming and recognition rather than passivity or a guaranteed spiritual state.",
  },
  {
    id: "anc-john-epinoia",
    sourceId: "src-apocryphon-of-john",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Apocryphon of John",
    sectionTitle: "Luminous Epinoia and awakening",
    locator: "EPUB/text_008.xhtml; Adam, Epinoia and awakening sequence",
    conceptIds: ["con-inner-light", "con-descent-return"],
    verification: "mapped-from-extraction",
    notes:
      "Treat Epinoia as source-specific symbolic language for awakening intelligence, never as an external voice or hidden command.",
  },
  {
    id: "anc-john-sophia-correction",
    sourceId: "src-apocryphon-of-john",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Apocryphon of John",
    sectionTitle: "Sophia, deficiency and correction",
    locator: "EPUB/text_008.xhtml; Sophia/Yaltabaoth and correction sequence",
    conceptIds: ["con-sophia-correction", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "Use as a myth of imbalance, consequence and reintegration. Do not present the demiurge or archons as beings targeting the user.",
  },
  {
    id: "anc-philip-union",
    sourceId: "src-gospel-of-philip",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Gospel of Philip",
    sectionTitle: "Images, reality and the bridal chamber",
    locator: "EPUB/text_012.xhtml; union and bridal-chamber sayings",
    conceptIds: ["con-union-integration"],
    verification: "mapped-from-extraction",
    notes:
      "Use as optional symbolic language for integration. Avoid gender prescription, sexual pressure or claims that relationship completes an incomplete person.",
  },
  {
    id: "anc-authoritative-word-medicine",
    sourceId: "src-authoritative-teaching",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "Authoritative Teaching",
    sectionTitle: "The word applied as medicine for sight",
    locator: "EPUB/text_031.xhtml; opening soul/word/vision sequence",
    conceptIds: ["con-word-medicine", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "Supports language as a tool for changing perception. It does not support medical or curative claims.",
  },
  {
    id: "anc-eighth-ninth-silence",
    sourceId: "src-discourse-eighth-ninth",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Discourse on the Eighth and Ninth",
    sectionTitle: "Prayer, silent hymn and ascent",
    locator: "EPUB/text_034.xhtml; ascent prayer and hymn sequence",
    conceptIds: ["con-silence-self-possession", "con-mystical-realization"],
    verification: "mapped-from-extraction",
    notes:
      "Adapt silence as chosen contemplative attention with eyes-open and stop options. Do not present visionary language as an expected result.",
  },
  {
    id: "anc-thanksgiving-knowledge",
    sourceId: "src-prayer-thanksgiving",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Prayer of Thanksgiving",
    sectionTitle: "Mind, speech, knowledge and preservation",
    locator: "EPUB/text_035.xhtml; complete short prayer",
    conceptIds: ["con-word-medicine", "con-mystical-realization"],
    verification: "mapped-from-extraction",
    notes:
      "Use the devotional movement as a structure for original thanksgiving; do not reproduce the copyrighted translation.",
  },
  {
    id: "anc-thunder-paradox",
    sourceId: "src-thunder-perfect-mind",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Thunder, Perfect Mind",
    sectionTitle: "Paradoxical self-disclosure",
    locator: "EPUB/text_029.xhtml and text_030.xhtml; paradox hymn",
    conceptIds: ["con-union-integration", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "Use paradox to widen reflection, not as an oracle voice speaking an identity or destiny over the user.",
  },
  {
    id: "anc-silvanus-discipline",
    sourceId: "src-teachings-silvanus",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "The Teachings of Silvanus",
    sectionTitle: "Mind, reason and disciplined self-knowledge",
    locator: "EPUB/text_039.xhtml; mind/reason and self-knowledge sequences",
    conceptIds: ["con-silence-self-possession", "con-purpose-service"],
    verification: "mapped-from-extraction",
    notes:
      "Translate ascetic language into agency, reflection and ethical conduct without shame, coercion or contempt for the body.",
  },
  {
    id: "anc-nag-melchizedek-distinction",
    sourceId: "src-nag-hammadi-melchizedek",
    editionId: "ed-nag-hammadi-working-epub",
    workTitle: "Melchizedek",
    sectionTitle: "Fragmentary priestly revelation",
    locator: "EPUB/text_043.xhtml; surviving priestly and revelatory fragments",
    conceptIds: ["con-purpose-service"],
    verification: "mapped-from-extraction",
    notes:
      "Keep this fragmentary Nag Hammadi tractate distinct from Grumbine's 1919 symbolic doctrine and from later institutional priesthood claims.",
  },
  {
    id: "anc-grumbine-four-strata",
    sourceId: "src-grumbine-melchizedek",
    editionId: "ed-grumbine-1919-ocr",
    workTitle: "Melchizedek; or, The Secret Doctrine of the Bible",
    sectionTitle: "Four strata of symbolic reading",
    locator: "Introduction; EPUB pages 13 onward",
    conceptIds: ["con-fourfold-reading", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "Label the fourfold method as Grumbine's esoteric interpretation, not standard Biblical scholarship.",
  },
  {
    id: "anc-grumbine-descent-return",
    sourceId: "src-grumbine-melchizedek",
    editionId: "ed-grumbine-1919-ocr",
    workTitle: "Melchizedek; or, The Secret Doctrine of the Bible",
    sectionTitle: "Involution, evolution and return",
    locator: "Lecture II; Secret Doctrines of the Order",
    conceptIds: ["con-descent-return", "con-mystical-realization"],
    verification: "mapped-from-extraction",
    notes:
      "Use as a modern esoteric descent/return framework. Do not present its cosmology as scientific fact.",
  },
  {
    id: "anc-grumbine-four-planes",
    sourceId: "src-grumbine-melchizedek",
    editionId: "ed-grumbine-1919-ocr",
    workTitle: "Melchizedek; or, The Secret Doctrine of the Bible",
    sectionTitle: "Four planes of expression and manifestation",
    locator: "Lecture III; Four Planes",
    conceptIds: ["con-four-planes", "con-discernment"],
    verification: "mapped-from-extraction",
    notes:
      "For product use, describe physical, mental, imaginal/interpretive and spiritual perspectives. Do not train or promise psychic faculties.",
  },
  {
    id: "anc-grumbine-self-possession",
    sourceId: "src-grumbine-melchizedek",
    editionId: "ed-grumbine-1919-ocr",
    workTitle: "Melchizedek; or, The Secret Doctrine of the Bible",
    sectionTitle: "Self-possession and divine realization",
    locator: "Lecture V; The Key Applied",
    conceptIds: ["con-silence-self-possession", "con-mystical-realization"],
    verification: "mapped-from-extraction",
    notes:
      "Retain Grumbine's caution against dependency, voices and power-seeking. Adapt the end-state as contemplative realization and ethical service.",
  },
];

const rawConcepts: ContemplativeConcept[] = [
  {
    id: "con-oneness-fullness",
    slug: "oneness-and-fullness",
    name: "Oneness and fullness",
    summary:
      "A contemplative orientation toward belonging to a whole that exceeds the isolated self. LumenNous offers this as historical and symbolic language, not proof that the universe is conscious or communicating privately.",
    sourceAnchorIds: ["anc-thomas-inner-outer", "anc-thomas-two-one", "anc-truth-belonging-rest"],
    classification: "symbolic",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["open-universal", "gnostic", "neutral"],
    safetyTags: ["non-oracular", "source-specific"],
    applications: ["learn", "prayer", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-inner-outer",
    slug: "within-and-outside",
    name: "Within and outside",
    summary:
      "Interior attention and observable life are held together. Inner experience can disclose meaning, while outer reality, relationship and evidence keep discernment grounded.",
    sourceAnchorIds: ["anc-thomas-inner-outer"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["open-universal", "gnostic", "neutral"],
    safetyTags: ["reality-test-inner-knowing", "non-oracular"],
    applications: ["learn", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-inner-light",
    slug: "inner-light-and-epinoia",
    name: "Inner light and Epinoia",
    summary:
      "A source-specific image of awakening intelligence and remembered belonging, translated into attention, humility and ethical visibility rather than special power.",
    sourceAnchorIds: ["anc-thomas-inner-light", "anc-john-epinoia"],
    classification: "symbolic",
    traditionLabels: ["historical-teaching", "symbolic-language"],
    worldviewProfiles: ["gnostic", "open-universal"],
    safetyTags: ["non-oracular", "no-supernormal-practice", "source-specific"],
    applications: ["learn", "prayer", "practice", "reflection"],
    editorialStatus: "draft",
  },
  {
    id: "con-descent-return",
    slug: "descent-and-return",
    name: "Descent and return",
    summary:
      "A shared arc of origin, embodiment or scattering, forgetfulness, awakening, repair and return. It becomes a practical map for noticing disconnection and choosing a grounded way back.",
    sourceAnchorIds: ["anc-truth-belonging-rest", "anc-john-epinoia", "anc-grumbine-descent-return"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "esoteric-christian", "open-universal"],
    safetyTags: ["ground-after-practice", "source-specific"],
    applications: ["learn", "prayer", "practice", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-sophia-correction",
    slug: "wisdom-error-and-correction",
    name: "Wisdom, error and correction",
    summary:
      "Sophia's myth is used as a source-specific pattern of imbalance, consequence and reintegration: error can be faced without shame and answered through repair.",
    sourceAnchorIds: ["anc-john-sophia-correction"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "open-universal"],
    safetyTags: ["metaphor-only", "source-specific", "ground-after-practice"],
    applications: ["learn", "prayer", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-union-integration",
    slug: "union-without-erasure",
    name: "Union without erasure",
    summary:
      "Nondual and bridal-chamber images become practices of integration that preserve difference, agency, identity and boundaries rather than dissolving them.",
    sourceAnchorIds: ["anc-thomas-two-one", "anc-philip-union", "anc-thunder-paradox"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "open-universal", "neutral"],
    safetyTags: ["metaphor-only", "non-oracular", "source-specific"],
    applications: ["learn", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-word-medicine",
    slug: "word-as-medicine-for-perception",
    name: "Word as medicine for perception",
    summary:
      "Language can act as mirror, key and corrective for perception. The application is reflective and ethical; it makes no medical or curative claim.",
    sourceAnchorIds: ["anc-authoritative-word-medicine", "anc-thanksgiving-knowledge"],
    classification: "symbolic",
    traditionLabels: ["historical-teaching", "symbolic-language"],
    worldviewProfiles: ["gnostic", "open-universal", "neutral"],
    safetyTags: ["metaphor-only", "source-specific"],
    applications: ["learn", "prayer", "practice", "reflection"],
    editorialStatus: "draft",
  },
  {
    id: "con-silence-self-possession",
    slug: "silence-and-self-possession",
    name: "Silence and self-possession",
    summary:
      "Chosen silence gathers attention while preserving agency. It includes sensory alternatives and never asks a person to surrender control to voices, signs or external entities.",
    sourceAnchorIds: ["anc-eighth-ninth-silence", "anc-silvanus-discipline", "anc-grumbine-self-possession"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "esoteric-christian", "open-universal", "neutral"],
    safetyTags: ["no-supernormal-practice", "ground-after-practice", "non-oracular"],
    applications: ["learn", "prayer", "practice", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-discernment",
    slug: "discernment-and-false-authority",
    name: "Discernment and false authority",
    summary:
      "Archonic and esoteric language is translated into a critique of ignorance, domination and certainty that cannot be corrected. Discernment remains accountable to facts, care, consent and other people.",
    sourceAnchorIds: ["anc-john-sophia-correction", "anc-thunder-paradox", "anc-grumbine-four-strata", "anc-grumbine-four-planes"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "esoteric-christian", "open-universal", "neutral"],
    safetyTags: ["reality-test-inner-knowing", "metaphor-only", "non-oracular"],
    applications: ["learn", "prayer", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-fourfold-reading",
    slug: "fourfold-symbolic-reading",
    name: "Fourfold symbolic reading",
    summary:
      "Grumbine's historical, occult, cosmic-law and mystical strata become an explicitly labelled reading exercise rather than a claim to recover one secret authoritative meaning.",
    sourceAnchorIds: ["anc-grumbine-four-strata"],
    classification: "modern-interpretation",
    traditionLabels: ["modern-interpretation"],
    worldviewProfiles: ["esoteric-christian", "open-universal"],
    safetyTags: ["source-specific", "non-oracular", "non-clerical"],
    applications: ["learn", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-four-planes",
    slug: "four-planes-of-experience",
    name: "Four planes of experience",
    summary:
      "Grumbine's physical, mental, psychic and spiritual planes are adapted as body, thought, imaginal interpretation and spiritual meaning, with no training or promise of paranormal faculties.",
    sourceAnchorIds: ["anc-grumbine-four-planes"],
    classification: "modern-interpretation",
    traditionLabels: ["modern-interpretation"],
    worldviewProfiles: ["esoteric-christian", "open-universal"],
    safetyTags: ["no-supernormal-practice", "source-specific", "ground-after-practice"],
    applications: ["learn", "practice", "reflection"],
    editorialStatus: "draft",
  },
  {
    id: "con-purpose-service",
    slug: "purpose-as-service",
    name: "Purpose as service",
    summary:
      "Priesthood becomes a non-clerical symbol of responsibility: bring values, capacities and real human need together in one freely chosen act of service, without claiming a cosmic assignment.",
    sourceAnchorIds: ["anc-silvanus-discipline", "anc-nag-melchizedek-distinction", "anc-grumbine-self-possession"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["esoteric-christian", "gnostic", "open-universal", "neutral"],
    safetyTags: ["non-clerical", "non-oracular", "source-specific"],
    applications: ["learn", "prayer", "practice", "reflection", "pathway"],
    editorialStatus: "draft",
  },
  {
    id: "con-mystical-realization",
    slug: "mystical-realization",
    name: "Mystical realization",
    summary:
      "Direct contemplative recognition is oriented toward humility, integration and service. It is distinct from psychic phenomena, guaranteed attainment and spiritual rank.",
    sourceAnchorIds: ["anc-eighth-ninth-silence", "anc-grumbine-descent-return", "anc-grumbine-self-possession"],
    classification: "modern-interpretation",
    traditionLabels: ["historical-teaching", "modern-interpretation"],
    worldviewProfiles: ["gnostic", "esoteric-christian", "open-universal"],
    safetyTags: ["no-supernormal-practice", "non-oracular", "non-clerical"],
    applications: ["learn", "prayer", "practice", "pathway"],
    editorialStatus: "draft",
  },
];

const rawReviews = editorialReviewRecords as EditorialReview[];

export const sourceEditions = SourceEditionSchema.array().parse(rawEditions);
export const sourceReviewPolicies = SourceReviewPolicySchema.array().parse(
  sourceReviewPolicyRecords,
);
export const passageAnchors = PassageAnchorSchema.array().parse(
  [
    ...rawAnchors.map((anchor) => ({
      ...anchor,
      structuredLocator: {
        scheme: anchor.locator.startsWith("EPUB/") ? "epub-path" : "custom",
        start: anchor.locator,
        display: anchor.locator,
      },
    })),
    ...ingestedPassageAnchorRecords,
  ],
);
export const contemplativeConcepts = ContemplativeConceptSchema.array().parse(rawConcepts);
export const editorialReviews = EditorialReviewSchema.array().parse(rawReviews);

export const sourceEditionById = new Map(
  sourceEditions.map((edition) => [edition.id, edition]),
);
export const sourceReviewPolicyById = new Map(
  sourceReviewPolicies.map((policy) => [policy.id, policy]),
);
export const passageAnchorById = new Map(
  passageAnchors.map((anchor) => [anchor.id, anchor]),
);
export const contemplativeConceptById = new Map(
  contemplativeConcepts.map((concept) => [concept.id, concept]),
);
export const contemplativeConceptBySlug = new Map(
  contemplativeConcepts.map((concept) => [concept.slug, concept]),
);
