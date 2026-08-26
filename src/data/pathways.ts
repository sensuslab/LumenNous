/**
 * Source-grounded pathways turn the contemplative concept graph into a
 * sequence of small, optional activities. Wording is original editorial
 * composition; passage locators remain available through each source use.
 */

import {
  ContemplativePathwaySchema,
  type ContemplativePathway,
} from "../lib/schemas";

const raw: ContemplativePathway[] = [
  {
    id: "pth-returning-to-fullness",
    slug: "returning-to-fullness",
    title: "Returning to Fullness",
    subtitle: "A five-part cosmic prayer pathway from embodied presence to ordinary service",
    summary:
      "Explore oneness as belonging rather than self-erasure. This pathway moves between inner attention and the shared world, gathers divided parts without denying difference, and ends with one freely chosen act of care.",
    estimatedMinutes: 45,
    conceptIds: [
      "con-oneness-fullness",
      "con-inner-outer",
      "con-discernment",
      "con-union-integration",
      "con-descent-return",
      "con-silence-self-possession",
      "con-purpose-service",
    ],
    sourceIds: [
      "src-gospel-of-truth",
      "src-gospel-of-thomas",
      "src-teachings-silvanus",
      "src-grumbine-melchizedek",
    ],
    classification: "modern-interpretation",
    traditionLabels: [
      "original-composition",
      "historical-teaching",
      "modern-interpretation",
    ],
    worldviewProfiles: ["open-universal", "gnostic", "neutral"],
    stages: [
      {
        id: "pth-fullness-arrive",
        title: "Arrive in the life you already inhabit",
        orientation:
          "Cosmic scale begins here, not somewhere beyond the body. The Gospel of Truth links rest with belonging and recognition. LumenNous adapts that movement as an invitation to stop performing transcendence and notice the life that is presently carrying you.",
        conceptIds: ["con-oneness-fullness"],
        activity: {
          id: "act-fullness-arrive",
          title: "Three circles of belonging",
          activityType: "orient",
          minutes: 6,
          purpose: "Locate belonging in the body, the room and the wider living world.",
          instructions: [
            "With eyes open or lowered, notice three points where your body is supported.",
            "Name three things in the room that share this moment with you.",
            "Name one larger system sustaining the moment: water, soil, weather, labour, relationship or community.",
            "Say quietly: I do not have to leave the world to belong to something larger.",
          ],
          reflectionPrompt:
            "Which form of support became easier to notice when you stopped looking for a dramatic feeling?",
          sourceUses: [
            { anchorId: "anc-truth-belonging-rest", relation: "inspired-by" },
          ],
          safetyNotes:
            "No altered state is expected. If cosmic scale feels ungrounding, stay only with contact points and visible objects.",
        },
        relatedPracticeSlug: "feet-on-the-ground",
      },
      {
        id: "pth-fullness-within-outside",
        title: "Hold within and outside together",
        orientation:
          "The Gospel of Thomas places the kingdom within and outside. Here, inward experience and observable reality correct and enrich each other. Neither private feeling nor public pressure gets the final word by itself.",
        conceptIds: ["con-inner-outer", "con-discernment"],
        activity: {
          id: "act-fullness-within-outside",
          title: "Two-column seeing",
          activityType: "reflect",
          minutes: 8,
          purpose: "Bring felt experience and observable facts into one field of attention.",
          instructions: [
            "Choose one question that matters but does not require an immediate decision.",
            "On one side of a page, write what you feel, fear, hope or intuit.",
            "On the other, write what you can presently observe, verify or ask someone about.",
            "Circle one point where the columns agree and one place where more information is needed.",
          ],
          reflectionPrompt:
            "What changed when your interior experience was honoured without being made infallible?",
          sourceUses: [
            { anchorId: "anc-thomas-inner-outer", relation: "paraphrase" },
          ],
          safetyNotes:
            "Use a low-stakes question. For medical, legal, financial or safety decisions, seek qualified external help.",
        },
        relatedPracticeSlug: "the-quiet-question",
      },
      {
        id: "pth-fullness-two-one",
        title: "Integrate without erasing difference",
        orientation:
          "Thomas uses the image of making the two one. LumenNous reads this as integration: allowing apparent opposites to enter honest relationship. Oneness is not sameness, forced reconciliation or surrender of a necessary boundary.",
        conceptIds: ["con-union-integration", "con-oneness-fullness"],
        activity: {
          id: "act-fullness-two-one",
          title: "Both truths, one next step",
          activityType: "integrate",
          minutes: 8,
          purpose: "Let two genuine needs inform a choice without pretending they are identical.",
          instructions: [
            "Name two truths that seem to pull against each other, such as I need rest and I value reliability.",
            "Give each truth one full sentence without arguing against it.",
            "Ask what small action could respect both truths, even imperfectly.",
            "Check that the action preserves consent, dignity and any boundary needed for safety.",
          ],
          reflectionPrompt:
            "Where did integration become more honest when difference was allowed to remain?",
          sourceUses: [
            { anchorId: "anc-thomas-two-one", relation: "inspired-by" },
          ],
          safetyNotes:
            "Do not use nonduality to minimise harm, reconcile with an unsafe person or dissolve a boundary.",
        },
        relatedPracticeSlug: "both-sides-honestly",
      },
      {
        id: "pth-fullness-rest",
        title: "Let rest mean homecoming",
        orientation:
          "In Gnostic literature, rest can name arrival in one's true place after wandering and forgetfulness. This activity offers rest as a temporary release from self-improvement—not a spiritual achievement or escape from responsibility.",
        conceptIds: ["con-oneness-fullness", "con-descent-return"],
        activity: {
          id: "act-fullness-rest",
          title: "A prayer with no request",
          activityType: "contemplate",
          minutes: 7,
          purpose: "Experience prayer as presence rather than transaction.",
          instructions: [
            "Choose a comfortable position and let your gaze rest on one ordinary object.",
            "For several minutes, make no request and seek no answer. Return gently to the object whenever thought wanders.",
            "Offer one sentence of thanks for something that already exists.",
            "Finish by naming the next ordinary task that will bring you back into the day.",
          ],
          reflectionPrompt:
            "What remains when prayer is not required to produce a result?",
          sourceUses: [
            { anchorId: "anc-truth-belonging-rest", relation: "inspired-by" },
          ],
          safetyNotes:
            "Keep eyes open if silence or inward focus feels destabilising. Stopping early is a complete practice.",
        },
      },
      {
        id: "pth-fullness-service",
        title: "Return as service",
        orientation:
          "The Teachings of Silvanus emphasises disciplined character. Grumbine later frames self-possession and realization as service rather than dependency or display. LumenNous brings those distinct sources into a modern conclusion: belonging becomes credible through freely chosen care.",
        conceptIds: ["con-purpose-service", "con-silence-self-possession"],
        activity: {
          id: "act-fullness-service",
          title: "One unannounced act",
          activityType: "serve",
          minutes: 16,
          purpose: "Translate contemplative belonging into a bounded act that benefits real life.",
          instructions: [
            "Notice one need you can responsibly meet without taking over someone else's agency.",
            "Choose an act that fits your actual capacity: repair, reply, share, clean, accompany or ask what would help.",
            "Do the act without treating it as proof of spiritual status.",
            "Afterward, ask whether the action increased dignity, clarity or practical support.",
          ],
          reflectionPrompt:
            "What kind of service leaves both you and the other person more free?",
          sourceUses: [
            { anchorId: "anc-silvanus-discipline", relation: "comparative-context" },
            { anchorId: "anc-grumbine-self-possession", relation: "comparative-context" },
          ],
          safetyNotes:
            "Service is not self-erasure. Choose something consensual, sustainable and within your role.",
        },
      },
    ],
    accessibilityNotes:
      "Every activity can be completed seated, standing or lying down. Visualisation is optional; writing may be replaced with silent naming or an audio note stored outside LumenNous.",
    safetyNotes:
      "This pathway offers symbolic and contemplative practices, not evidence that the universe is conscious, sending messages or arranging outcomes. Pause whenever attention becomes disorienting.",
    editorialStatus: "draft",
  },
  {
    id: "pth-inner-light-discernment",
    slug: "inner-light-grounded-discernment",
    title: "Inner Light, Grounded Discernment",
    subtitle: "Four practices for inward attention without surrendering reality-testing",
    summary:
      "Approach inner light and Epinoia as historical images of awakening intelligence. Notice what emerges in quiet, improve the language used to describe it, and test every possible insight through evidence, relationship and ordinary consequences.",
    estimatedMinutes: 34,
    conceptIds: [
      "con-inner-light",
      "con-inner-outer",
      "con-discernment",
      "con-word-medicine",
      "con-silence-self-possession",
    ],
    sourceIds: [
      "src-gospel-of-thomas",
      "src-apocryphon-of-john",
      "src-authoritative-teaching",
      "src-grumbine-melchizedek",
    ],
    classification: "modern-interpretation",
    traditionLabels: [
      "original-composition",
      "historical-teaching",
      "modern-interpretation",
      "symbolic-language",
    ],
    worldviewProfiles: ["open-universal", "gnostic", "neutral"],
    stages: [
      {
        id: "pth-light-agency",
        title: "Begin with self-possession",
        orientation:
          "Grumbine's later esoteric framework is especially useful here as a caution: inward practice should strengthen conscious agency, not dependence on voices, signs, controls or claimed powers.",
        conceptIds: ["con-silence-self-possession", "con-discernment"],
        activity: {
          id: "act-light-agency",
          title: "Set the terms of the practice",
          activityType: "orient",
          minutes: 5,
          purpose: "Establish choice, stopping conditions and a return to ordinary activity before going inward.",
          instructions: [
            "Name where you are, the current time and what you will do after the practice.",
            "Choose whether eyes-open, eyes-lowered or movement-based attention feels most steady.",
            "Say: thoughts and images may be meaningful, but they are not commands.",
            "Choose a stop signal such as standing, switching on a light or contacting someone you trust.",
          ],
          reflectionPrompt:
            "What conditions help inward attention remain a choice rather than an obligation?",
          sourceUses: [
            { anchorId: "anc-grumbine-self-possession", relation: "paraphrase" },
          ],
          safetyNotes:
            "Do not continue if you feel watched, controlled, commanded or unable to stop. Reorient to the room and seek human support.",
        },
      },
      {
        id: "pth-light-symbol",
        title: "Meet light as a symbol",
        orientation:
          "Thomas and the Apocryphon of John use different images of light and awakening thought. They are preserved here as source-specific symbols, not claims of a hidden substance, superior identity or external messenger.",
        conceptIds: ["con-inner-light"],
        activity: {
          id: "act-light-symbol",
          title: "Lamp and landscape",
          activityType: "contemplate",
          minutes: 9,
          purpose: "Use light imagery to notice qualities you want to make visible in conduct.",
          instructions: [
            "Look at a real light source or imagine a small lamp; either option is complete.",
            "Choose one quality the light represents today: honesty, patience, courage, warmth or another grounded value.",
            "Picture that quality illuminating one ordinary situation—not predicting it, simply helping you see it.",
            "Name one observable behaviour that would express the quality.",
          ],
          reflectionPrompt:
            "How does the image become useful when it leads to visible conduct rather than special status?",
          sourceUses: [
            { anchorId: "anc-thomas-inner-light", relation: "inspired-by" },
            { anchorId: "anc-john-epinoia", relation: "comparative-context" },
          ],
          safetyNotes:
            "No vision or unusual sensation is expected. Treat any image as imagination and reflection material.",
        },
        relatedPracticeSlug: "inner-lamp-meditation",
      },
      {
        id: "pth-light-language",
        title: "Let words clarify sight",
        orientation:
          "Authoritative Teaching compares the word's effect on perception to medicine for the eyes. LumenNous uses that as a language practice only: careful wording can reveal assumptions, but it does not diagnose or cure.",
        conceptIds: ["con-word-medicine", "con-discernment"],
        activity: {
          id: "act-light-language",
          title: "Rewrite the claim",
          activityType: "reflect",
          minutes: 8,
          purpose: "Turn an absolute inner claim into language that can be examined.",
          instructions: [
            "Write one conclusion your mind is repeating, such as I know this will fail.",
            "Replace I know with I notice, I fear, I hope or one possibility is.",
            "Add one fact that supports the thought and one fact that complicates it.",
            "Rewrite the sentence so it leaves room for evidence and revision.",
          ],
          reflectionPrompt:
            "Which change in wording gave you more freedom to see clearly?",
          sourceUses: [
            { anchorId: "anc-authoritative-word-medicine", relation: "inspired-by" },
          ],
          safetyNotes:
            "This is reflective language work, not therapy or medical treatment. Seek appropriate help for persistent distress.",
        },
      },
      {
        id: "pth-light-test",
        title: "Test insight in ordinary life",
        orientation:
          "Within and outside belong together. An inward possibility becomes trustworthy slowly, through consequences, evidence, ethical care and conversation—not because it arrived quietly or felt luminous.",
        conceptIds: ["con-inner-outer", "con-discernment"],
        activity: {
          id: "act-light-test",
          title: "The smallest honest experiment",
          activityType: "integrate",
          minutes: 12,
          purpose: "Translate one low-stakes possibility into a reversible, observable test.",
          instructions: [
            "Choose one possibility from the earlier activities and state it without certainty.",
            "Design the smallest reversible action that could give you information.",
            "Ask what outcome would support, complicate or disconfirm the possibility.",
            "If another person is affected, seek consent or a trusted perspective before acting.",
            "Record what actually happened rather than what you hoped would happen.",
          ],
          reflectionPrompt:
            "What did reality add that inward reflection could not provide alone?",
          sourceUses: [
            { anchorId: "anc-thomas-inner-outer", relation: "inspired-by" },
            { anchorId: "anc-grumbine-self-possession", relation: "comparative-context" },
          ],
          safetyNotes:
            "Keep experiments low-risk and reversible. Do not test health, safety, legal or financial intuitions without qualified guidance.",
        },
        relatedPracticeSlug: "settling-the-water",
      },
    ],
    accessibilityNotes:
      "All visual imagery can be replaced by naming a value or noticing warmth, contrast and orientation. Writing can be spoken privately or held as one short sentence.",
    safetyNotes:
      "This pathway does not train clairvoyance, clairaudience or other supernormal faculties. It does not validate voices, signs, hidden commands or certainty based on private experience.",
    editorialStatus: "draft",
  },
  {
    id: "pth-purpose-service",
    slug: "purpose-without-rank",
    title: "Purpose Without Rank",
    subtitle: "A comparative Melchizedek pathway from source literacy to grounded service",
    summary:
      "Keep the ancient Nag Hammadi fragment and Grumbine's modern esoteric book separate, practise layered symbolic reading, and translate priestly imagery into responsibility without hierarchy, cosmic assignment or institutional authority.",
    estimatedMinutes: 38,
    conceptIds: [
      "con-purpose-service",
      "con-fourfold-reading",
      "con-discernment",
      "con-silence-self-possession",
    ],
    sourceIds: [
      "src-nag-hammadi-melchizedek",
      "src-grumbine-melchizedek",
      "src-teachings-silvanus",
    ],
    classification: "modern-interpretation",
    traditionLabels: [
      "original-composition",
      "historical-teaching",
      "modern-interpretation",
    ],
    worldviewProfiles: [
      "open-universal",
      "gnostic",
      "esoteric-christian",
      "neutral",
    ],
    stages: [
      {
        id: "pth-purpose-distinguish",
        title: "Distinguish before comparing",
        orientation:
          "The Nag Hammadi Melchizedek is ancient and fragmentary. Grumbine's Melchizedek is a 1919 esoteric interpretation. Shared names do not make them one doctrine, and missing ancient text cannot responsibly be completed with modern speculation.",
        conceptIds: ["con-purpose-service", "con-discernment"],
        activity: {
          id: "act-purpose-distinguish",
          title: "Two-source ledger",
          activityType: "orient",
          minutes: 8,
          purpose: "Practise source literacy before drawing spiritual meaning.",
          instructions: [
            "Make two headings: ancient fragment and 1919 interpretation.",
            "Under the first, write: incomplete priestly/revelatory tractate; meaning limited by damaged text.",
            "Under the second, write: modern esoteric system; OCR variable; not standard biblical scholarship.",
            "Write the comparative question between them rather than underneath either: how might purpose become service without rank?",
          ],
          reflectionPrompt:
            "How does clear separation make comparison more trustworthy rather than less meaningful?",
          sourceUses: [
            { anchorId: "anc-nag-melchizedek-distinction", relation: "comparative-context" },
            { anchorId: "anc-grumbine-four-strata", relation: "comparative-context" },
          ],
          safetyNotes:
            "Do not infer a hidden lineage, office or personal initiation from either source.",
        },
      },
      {
        id: "pth-purpose-layers",
        title: "Read a symbol through four lenses",
        orientation:
          "Grumbine proposes historical, occult, astro-theological/law and mystical strata. This is his esoteric method, not scholarly consensus. LumenNous turns it into a transparent perspective exercise rather than a machine for discovering secret facts.",
        conceptIds: ["con-fourfold-reading", "con-discernment"],
        activity: {
          id: "act-purpose-layers",
          title: "Bread and wine, four readings",
          activityType: "reflect",
          minutes: 10,
          purpose: "Explore how one image changes across explicitly labelled interpretive lenses.",
          instructions: [
            "Historical: describe the Genesis scene plainly, without adding a hidden meaning.",
            "Symbolic: ask what nourishment, blessing or exchange might represent.",
            "Law/cosmos: ask what patterns of reciprocity, timing or order Grumbine might see.",
            "Mystical: ask how receiving and offering could describe inward transformation.",
            "End by marking every answer interpretation, not recovered fact.",
          ],
          reflectionPrompt:
            "Which lens disclosed something useful, and which tempted you to overclaim?",
          sourceUses: [
            { anchorId: "anc-grumbine-four-strata", relation: "paraphrase" },
          ],
          safetyNotes:
            "Layered reading creates interpretations, not privileged access to historical intention or cosmic law.",
        },
      },
      {
        id: "pth-purpose-gifts-needs",
        title: "Place gifts beside real needs",
        orientation:
          "LumenNous treats priesthood as a non-clerical metaphor for responsibility. Purpose is not a title bestowed by the universe; it emerges provisionally where capacity, value, consent and actual need meet.",
        conceptIds: ["con-purpose-service"],
        activity: {
          id: "act-purpose-gifts-needs",
          title: "Capacity, value, need",
          activityType: "integrate",
          minutes: 9,
          purpose: "Form a grounded hypothesis about purpose without claiming a fixed destiny.",
          instructions: [
            "List three capacities you can presently offer—not ideal future gifts.",
            "List three values you want your actions to embody.",
            "List three needs you have directly observed or been invited to help with.",
            "Find one modest overlap and phrase it as a possibility: I could explore serving by…",
          ],
          reflectionPrompt:
            "What becomes possible when purpose is a revisable relationship rather than a cosmic assignment?",
          sourceUses: [
            { anchorId: "anc-nag-melchizedek-distinction", relation: "inspired-by" },
            { anchorId: "anc-silvanus-discipline", relation: "comparative-context" },
          ],
          safetyNotes:
            "Purpose language must not pressure you into unpaid labour, unsafe roles, grandiosity or ignoring material limits.",
        },
      },
      {
        id: "pth-purpose-serve",
        title: "Run a service experiment",
        orientation:
          "Grumbine's emphasis on self-possession offers a useful boundary: mature service increases conscious responsibility and freedom. It does not require obedience to a leader, entity, sign or inner command.",
        conceptIds: ["con-purpose-service", "con-silence-self-possession"],
        activity: {
          id: "act-purpose-serve",
          title: "A seven-day, low-stakes experiment",
          activityType: "serve",
          minutes: 11,
          purpose: "Test one purpose hypothesis through consent, feedback and observable benefit.",
          instructions: [
            "Choose one small act related to the overlap you identified.",
            "Ask the affected person or community what help would actually be useful.",
            "Set a clear limit on time, money and responsibility.",
            "After acting, ask what helped, what burdened and what should change.",
            "Keep, revise or release the hypothesis based on what you learn.",
          ],
          reflectionPrompt:
            "Did the experiment create practical benefit and greater freedom, or mainly reinforce an identity you wanted to hold?",
          sourceUses: [
            { anchorId: "anc-grumbine-self-possession", relation: "paraphrase" },
            { anchorId: "anc-silvanus-discipline", relation: "comparative-context" },
          ],
          safetyNotes:
            "No leader, group or inner impression should override consent, law, safety or your capacity to stop.",
        },
      },
    ],
    accessibilityNotes:
      "The pathway is text-first. Lists can be spoken or dictated. Complete one stage at a time and spread the service experiment across several days.",
    safetyNotes:
      "This pathway confers no spiritual title, ordination, lineage or authority. It deliberately excludes psychic training, power-seeking and obedience to voices, entities or signs.",
    editorialStatus: "draft",
  },
];

export const contemplativePathways = ContemplativePathwaySchema.array().parse(raw);
export const contemplativePathwayById = new Map(
  contemplativePathways.map((pathway) => [pathway.id, pathway]),
);
export const contemplativePathwayBySlug = new Map(
  contemplativePathways.map((pathway) => [pathway.slug, pathway]),
);
