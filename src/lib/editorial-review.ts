import { EditorialReviewSchema } from "./schemas";
import type {
  ClaimClassification,
  EditorialReview,
  EditorialReviewStage,
  EditorialStatus,
  PassageAnchor,
  Source,
  SourceEdition,
  SourceRelation,
  TraditionLabel,
} from "./schemas";

export type EditorialSubjectKind =
  | "concept"
  | "create-frame"
  | "pathway"
  | "prayer"
  | "affirmation"
  | "practice"
  | "reflection-prompt"
  | "teaching";

export interface EditorialChecklistItem {
  id: string;
  stage: EditorialReviewStage;
  label: string;
  detail: string;
}

export interface EditorialAnchorRelation {
  anchorId: string;
  relation: SourceRelation | "concept-anchor";
}

export interface EditorialReviewPacket {
  id: string;
  kind: EditorialSubjectKind;
  title: string;
  slug: string | null;
  previewHref: string | null;
  summary: string;
  copyText: string;
  status: EditorialStatus;
  classification: ClaimClassification;
  traditionLabels: TraditionLabel[];
  safetySummary: string;
  anchors: PassageAnchor[];
  sources: Source[];
  editions: SourceEdition[];
  anchorRelations: EditorialAnchorRelation[];
  checklist: EditorialChecklistItem[];
  existingReview: EditorialReview | null;
}

export interface EditorialReviewDraft {
  completedItemIds: string[];
  reviewer: string;
  reviewedAt: string;
  notes: string;
}

const STAGE_ORDER: EditorialReviewStage[] = ["source", "safety", "copy"];

export function completedReviewStages(
  packet: EditorialReviewPacket,
  completedItemIds: readonly string[],
): EditorialReviewStage[] {
  const completed = new Set(completedItemIds);
  return STAGE_ORDER.filter((stage) => {
    const stageItems = packet.checklist.filter((item) => item.stage === stage);
    return stageItems.length > 0 && stageItems.every((item) => completed.has(item.id));
  });
}

export function buildEditorialReviewRecord(
  packet: EditorialReviewPacket,
  draft: EditorialReviewDraft,
): EditorialReview {
  const completedStages = completedReviewStages(
    packet,
    draft.completedItemIds,
  );
  const attributable = Boolean(draft.reviewer.trim() && draft.reviewedAt);
  const status: EditorialStatus =
    completedStages.length === STAGE_ORDER.length && attributable
      ? "published"
      : completedStages.length > 0 || draft.completedItemIds.length > 0
        ? "review"
        : "draft";
  return EditorialReviewSchema.parse({
    id: `rev-${packet.id}`,
    subjectId: packet.id,
    status,
    completedStages,
    reviewer: draft.reviewer.trim(),
    reviewedAt: draft.reviewedAt || null,
    notes: draft.notes.trim(),
  });
}
