import {
  getPassageAnchorsByIds,
  getSourcesByIds,
  listAffirmations,
  listConceptEngineFrames,
  listContemplativeConcepts,
  listContemplativePathways,
  listEditorialReviews,
  listPractices,
  listPrayers,
  listReflectionPrompts,
  listSourceEditions,
  listSourceReviewPolicies,
  listTeachings,
} from "./content";
import type {
  PassageAnchor,
  Source,
  SourceEdition,
} from "./schemas";
import type {
  EditorialAnchorRelation,
  EditorialChecklistItem,
  EditorialReviewPacket,
} from "./editorial-review";

export type {
  EditorialAnchorRelation,
  EditorialChecklistItem,
  EditorialReviewDraft,
  EditorialReviewPacket,
  EditorialSubjectKind,
} from "./editorial-review";

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function makeChecklist(input: {
  anchors: readonly PassageAnchor[];
  sources: readonly Source[];
  editions: readonly SourceEdition[];
  safetySummary: string;
}): EditorialChecklistItem[] {
  const hasMappedExtraction = input.anchors.some(
    (anchor) => anchor.verification === "mapped-from-extraction",
  );
  const hasOcrCaution = input.editions.some(
    (edition) => edition.ocrQuality === "variable" || edition.ocrQuality === "low",
  );
  const hasRestrictedRights = input.editions.some(
    (edition) =>
      edition.rightsStatus === "permission-required" ||
      edition.rightsStatus === "reference-only" ||
      edition.rightsStatus === "unknown",
  );
  const hasSourceRightsNote = input.sources.some(
    (source) => source.copyrightNotes.trim().length > 0,
  );
  const hasStructuredPassageMap = input.anchors.length > 0;
  const sourceIds = new Set(input.sources.map((source) => source.id));
  const editionIds = new Set(input.editions.map((edition) => edition.id));
  const activatedPolicies = listSourceReviewPolicies().filter((policy) => {
    const matches = [
      ...policy.sourceIds.map((id) => sourceIds.has(id)),
      ...policy.editionIds.map((id) => editionIds.has(id)),
    ];
    return policy.activation === "all"
      ? matches.length > 0 && matches.every(Boolean)
      : matches.some(Boolean);
  });

  const checklist: EditorialChecklistItem[] = [
    {
      id: "source-locators",
      stage: "source",
      label: hasStructuredPassageMap
        ? "Passage locators verified"
        : "Source citations verified",
      detail: hasStructuredPassageMap
        ? hasMappedExtraction
          ? "Check every extraction map against the named edition and update anchor verification in code when evidence supports it."
          : "Confirm each work, section and locator still matches the named edition."
        : "Confirm every cited work supports the subject's background or further-reading context and is not being presented as a passage-level source.",
    },
    ...(!hasStructuredPassageMap
      ? [{
          id: "source-structured-map",
          stage: "source" as const,
          label: "Passage-level use is declared or ruled out",
          detail:
            "Add sourceUses with a verified passage anchor when wording or a claim draws on a passage; otherwise confirm the citation is background or further reading only.",
        }]
      : []),
    {
      id: "source-relations",
      stage: "source",
      label: "Interpretive relationships are accurate",
      detail:
        "Confirm paraphrase, inspired-by and comparative-context labels do not imply quotation or historical identity.",
    },
    {
      id: "source-rights",
      stage: "source",
      label: "Rights and wording checked",
      detail: hasRestrictedRights
        ? "At least one edition is restricted or unresolved. Confirm the product contains only permitted metadata and original editorial language."
        : hasSourceRightsNote
          ? "Read each source copyright note and confirm quotation, paraphrase and metadata usage are permitted."
          : "Confirm quotation and paraphrase usage fits the recorded rights status.",
    },
    {
      id: "safety-agency",
      stage: "safety",
      label: "Agency and reality-testing preserved",
      detail:
        "No inner impression, random selection, voice, image or felt certainty becomes a command, prediction or privileged fact.",
    },
    {
      id: "safety-power",
      stage: "safety",
      label: "No power, rank or supernormal promise",
      detail:
        "No psychic training, guaranteed attainment, clerical authority, cosmic assignment or special status is offered.",
    },
    {
      id: "safety-grounding",
      stage: "safety",
      label: "Grounding and stopping conditions are adequate",
      detail:
        "The practice keeps choice, consent, bodily orientation and an ordinary return path available. Review the subject-specific care note too.",
    },
    {
      id: "copy-classification",
      stage: "copy",
      label: "Historical and editorial voices stay distinct",
      detail:
        "Classification and tradition labels match the prose; modern synthesis is never presented as the ancient text itself.",
    },
    {
      id: "copy-accessibility",
      stage: "copy",
      label: "Copy is clear, inclusive and non-coercive",
      detail:
        "A reader can decline the worldview, stop the practice and understand symbolic terms without church membership or specialist knowledge.",
    },
    {
      id: "copy-originality",
      stage: "copy",
      label: "Wording is original or explicitly cleared",
      detail:
        "Check that no memorable translation phrasing has entered product copy without a quotation-level source and rights review.",
    },
  ];

  if (hasOcrCaution) {
    checklist.splice(2, 0, {
      id: "source-ocr",
      stage: "source",
      label: "OCR uncertainty resolved",
      detail:
        "Variable or low OCR is present. Verify names, numbering, locators and any wording against a scan or reliable edition.",
    });
  }
  checklist.push(
    ...activatedPolicies.map((policy) => ({
      id: policy.id,
      stage: policy.stage,
      label: policy.label,
      detail: policy.detail,
    })),
  );
  if (/psychic|supernormal|voices|signs|oracular/i.test(input.safetySummary)) {
    checklist.splice(6, 0, {
      id: "safety-explicit-supernormal",
      stage: "safety",
      label: "Supernormal language receives an explicit boundary",
      detail:
        "Historical psychic or visionary vocabulary is context only; the activity neither trains it nor validates unusual experiences.",
    });
  }
  return checklist;
}

function evidenceFor(
  anchorRelations: readonly EditorialAnchorRelation[],
  explicitSourceIds: readonly string[],
): {
  anchors: PassageAnchor[];
  sources: Source[];
  editions: SourceEdition[];
} {
  const anchors = getPassageAnchorsByIds(
    unique(anchorRelations.map((relation) => relation.anchorId)),
  );
  const sourceIds = unique([
    ...explicitSourceIds,
    ...anchors.map((anchor) => anchor.sourceId),
  ]);
  const editionIds = new Set(anchors.map((anchor) => anchor.editionId));
  return {
    anchors,
    sources: getSourcesByIds(sourceIds),
    editions: listSourceEditions().filter((edition) => editionIds.has(edition.id)),
  };
}

function packet(input: Omit<EditorialReviewPacket, "anchors" | "sources" | "editions" | "checklist" | "existingReview"> & {
  explicitSourceIds: readonly string[];
}): EditorialReviewPacket {
  const evidence = evidenceFor(input.anchorRelations, input.explicitSourceIds);
  const existingReview =
    listEditorialReviews().find((review) => review.subjectId === input.id) ?? null;
  return {
    id: input.id,
    kind: input.kind,
    title: input.title,
    slug: input.slug,
    previewHref: input.previewHref,
    summary: input.summary,
    copyText: input.copyText,
    status: input.status,
    classification: input.classification,
    traditionLabels: input.traditionLabels,
    safetySummary: input.safetySummary,
    anchorRelations: input.anchorRelations,
    ...evidence,
    checklist: makeChecklist({ ...evidence, safetySummary: input.safetySummary }),
    existingReview,
  };
}

export function listEditorialReviewPackets(): EditorialReviewPacket[] {
  const concepts = listContemplativeConcepts().map((concept) =>
    packet({
      id: concept.id,
      kind: "concept",
      title: concept.name,
      slug: concept.slug,
      previewHref: `/concepts/${concept.slug}`,
      summary: concept.summary,
      copyText: concept.summary,
      status: concept.editorialStatus,
      classification: concept.classification,
      traditionLabels: concept.traditionLabels,
      safetySummary: concept.safetyTags.join(", "),
      anchorRelations: concept.sourceAnchorIds.map((anchorId) => ({
        anchorId,
        relation: "concept-anchor" as const,
      })),
      explicitSourceIds: [],
    }),
  );
  const frames = listConceptEngineFrames().map((frame) =>
    packet({
      id: frame.id,
      kind: "create-frame",
      title: frame.title,
      slug: null,
      previewHref: null,
      summary: frame.description,
      copyText: [
        frame.prayerLine,
        frame.affirmation,
        frame.practiceStep,
        frame.reflectionPrompt,
      ].join("\n\n"),
      status: frame.editorialStatus,
      classification: frame.classification,
      traditionLabels: frame.traditionLabels,
      safetySummary: frame.safetyNote,
      anchorRelations: frame.sourceUses,
      explicitSourceIds: frame.sourceIds,
    }),
  );
  const pathways = listContemplativePathways().map((pathway) =>
    packet({
      id: pathway.id,
      kind: "pathway",
      title: pathway.title,
      slug: pathway.slug,
      previewHref: `/pathways/${pathway.slug}`,
      summary: pathway.summary,
      copyText: pathway.stages
        .flatMap((stage) => [
          stage.title,
          stage.orientation,
          ...stage.activity.instructions,
          stage.activity.reflectionPrompt,
        ])
        .join("\n\n"),
      status: pathway.editorialStatus,
      classification: pathway.classification,
      traditionLabels: pathway.traditionLabels,
      safetySummary: `${pathway.safetyNotes}\n${pathway.accessibilityNotes}`,
      anchorRelations: pathway.stages.flatMap((stage) =>
        stage.activity.sourceUses,
      ),
      explicitSourceIds: pathway.sourceIds,
    }),
  );
  const prayers = listPrayers()
    .filter(
      (prayer) =>
        prayer.sourceIds.length > 0 || (prayer.sourceUses?.length ?? 0) > 0,
    )
    .map((prayer) =>
      packet({
        id: prayer.id,
        kind: "prayer",
        title: prayer.title,
        slug: null,
        previewHref: null,
        summary: prayer.opening,
        copyText: [
          prayer.opening,
          prayer.body,
          prayer.closing,
          `Affirmation: ${prayer.affirmation}`,
          `Practice:\n${prayer.practiceSteps.join("\n")}`,
        ].join("\n\n"),
        status: prayer.editorialStatus,
        classification: "modern-interpretation",
        traditionLabels: prayer.traditionLabels,
        safetySummary:
          prayer.safetyNotes ||
          "Review for agency, non-coercion, ordinary reality-testing and the absence of promised outcomes.",
        anchorRelations: prayer.sourceUses ?? [],
        explicitSourceIds: prayer.sourceIds,
      }),
    );
  const affirmations = listAffirmations()
    .filter(
      (affirmation) =>
        affirmation.sourceIds.length > 0 ||
        (affirmation.sourceUses?.length ?? 0) > 0,
    )
    .map((affirmation) =>
      packet({
        id: affirmation.id,
        kind: "affirmation",
        title:
          affirmation.text.length > 72
            ? `${affirmation.text.slice(0, 69)}…`
            : affirmation.text,
        slug: null,
        previewHref: null,
        summary: affirmation.text,
        copyText: affirmation.text,
        status: affirmation.editorialStatus,
        classification: "modern-interpretation",
        traditionLabels: ["original-composition"],
        safetySummary:
          "Affirmation remains an optional contemplative statement, with no guaranteed manifestation, healing, protection or privileged knowledge.",
        anchorRelations: affirmation.sourceUses ?? [],
        explicitSourceIds: affirmation.sourceIds,
      }),
    );
  const practices = listPractices()
    .filter(
      (practice) =>
        practice.sourceIds.length > 0 || (practice.sourceUses?.length ?? 0) > 0,
    )
    .map((practice) =>
      packet({
        id: practice.id,
        kind: "practice",
        title: practice.title,
        slug: practice.slug,
        previewHref: `/practice/${practice.slug}`,
        summary: practice.preparation,
        copyText: [
          `Preparation: ${practice.preparation}`,
          ...practice.steps.map(
            (step) => `${step.title} (${step.seconds}s)\n${step.instruction}`,
          ),
          `Closing: ${practice.closing}`,
          `Accessibility: ${practice.accessibilityNotes}`,
        ].join("\n\n"),
        status: practice.editorialStatus,
        classification: "modern-interpretation",
        traditionLabels: ["original-composition", "modern-interpretation"],
        safetySummary: [practice.safetyNotes, practice.accessibilityNotes]
          .filter(Boolean)
          .join("\n"),
        anchorRelations: practice.sourceUses ?? [],
        explicitSourceIds: practice.sourceIds,
      }),
    );
  const prompts = listReflectionPrompts()
    .filter((prompt) => (prompt.sourceUses?.length ?? 0) > 0)
    .map((prompt) =>
      packet({
        id: prompt.id,
        kind: "reflection-prompt",
        title:
          prompt.text.length > 72
            ? `${prompt.text.slice(0, 69)}…`
            : prompt.text,
        slug: null,
        previewHref: null,
        summary: prompt.text,
        copyText: prompt.text,
        status: prompt.editorialStatus,
        classification: "modern-interpretation",
        traditionLabels: ["original-composition"],
        safetySummary:
          "Prompt remains optional, does not compel disclosure and does not turn inner impressions into commands, predictions or privileged facts.",
        anchorRelations: prompt.sourceUses ?? [],
        explicitSourceIds: [],
      }),
    );
  const teachings = listTeachings()
    .filter(
      (teaching) =>
        teaching.sourceIds.length > 0 || (teaching.sourceUses?.length ?? 0) > 0,
    )
    .map((teaching) =>
      packet({
        id: teaching.id,
        kind: "teaching",
        title: teaching.title,
        slug: teaching.slug,
        previewHref: `/learn/${teaching.slug}`,
        summary: teaching.summary,
        copyText: teaching.body,
        status: teaching.editorialStatus,
        classification: teaching.classification,
        traditionLabels: [
          teaching.classification === "historical-teaching"
            ? "historical-teaching"
            : teaching.classification === "symbolic" ||
                teaching.classification === "traditional-symbolic-use"
              ? "symbolic-language"
              : "modern-interpretation",
        ],
        safetySummary:
          "Preserve historical specificity, distinguish editorial synthesis from source claims, and keep contemplative interpretation non-oracular and reality-testable.",
        anchorRelations: teaching.sourceUses ?? [],
        explicitSourceIds: teaching.sourceIds,
      }),
    );
  return [
    ...concepts,
    ...frames,
    ...pathways,
    ...prayers,
    ...affirmations,
    ...practices,
    ...prompts,
    ...teachings,
  ];
}
