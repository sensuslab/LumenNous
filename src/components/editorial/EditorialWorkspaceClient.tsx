"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  useSyncExternalStore,
  type JSX,
} from "react";
import type {
  EditorialReviewStage,
  EditorialStatus,
} from "@/lib/schemas";
import {
  buildEditorialReviewRecord,
  completedReviewStages,
  type EditorialReviewDraft,
  type EditorialReviewPacket,
  type EditorialSubjectKind,
} from "@/lib/editorial-review";
import { classificationChip } from "@/components/prayer/SourceBadge";
import { SourceDrawer } from "@/components/prayer/SourceDrawer";
import { TraditionLabelGroup } from "@/components/prayer/TraditionLabel";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

const STORAGE_KEY = "lumennous-editorial-workspace-v1";
const STORAGE_EVENT = "lumennous-editorial-workspace";
const EMPTY_STORE = "{}";

const STAGES: ReadonlyArray<{
  id: EditorialReviewStage;
  label: string;
  description: string;
}> = [
  {
    id: "source",
    label: "Source review",
    description: "Identity, locator, relation, edition quality and rights.",
  },
  {
    id: "safety",
    label: "Safety review",
    description: "Agency, reality-testing, grounding and power boundaries.",
  },
  {
    id: "copy",
    label: "Copy review",
    description: "Classification, clarity, accessibility and originality.",
  },
];

const KIND_LABELS: Record<EditorialSubjectKind, string> = {
  concept: "Concept",
  "create-frame": "Create frame",
  pathway: "Pathway",
  prayer: "Prayer",
  affirmation: "Affirmation",
  practice: "Practice",
  "reflection-prompt": "Reflection prompt",
  teaching: "Teaching",
};

type DraftStore = Record<string, EditorialReviewDraft>;
type KindFilter = "all" | EditorialSubjectKind;
type StatusFilter = "all" | EditorialStatus;

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT, onStoreChange);
  };
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? EMPTY_STORE;
  } catch {
    return EMPTY_STORE;
  }
}

function parseDrafts(raw: string): DraftStore {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const drafts: DraftStore = {};
    for (const [subjectId, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const candidate = value as Record<string, unknown>;
      drafts[subjectId] = {
        completedItemIds: Array.isArray(candidate.completedItemIds)
          ? candidate.completedItemIds.filter(
              (item): item is string => typeof item === "string",
            )
          : [],
        reviewer:
          typeof candidate.reviewer === "string" ? candidate.reviewer : "",
        reviewedAt:
          typeof candidate.reviewedAt === "string" ? candidate.reviewedAt : "",
        notes: typeof candidate.notes === "string" ? candidate.notes : "",
      };
    }
    return drafts;
  } catch {
    return {};
  }
}

function emptyDraft(packet: EditorialReviewPacket): EditorialReviewDraft {
  if (!packet.existingReview) {
    return { completedItemIds: [], reviewer: "", reviewedAt: "", notes: "" };
  }
  return {
    completedItemIds: packet.checklist
      .filter((item) => packet.existingReview?.completedStages.includes(item.stage))
      .map((item) => item.id),
    reviewer: packet.existingReview.reviewer,
    reviewedAt: packet.existingReview.reviewedAt ?? "",
    notes: packet.existingReview.notes,
  };
}

function saveJson(filename: string, value: unknown): void {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function EditorialWorkspaceClient({
  packets,
}: {
  packets: readonly EditorialReviewPacket[];
}): JSX.Element {
  const storedRaw = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STORE);
  const drafts = useMemo(() => parseDrafts(storedRaw), [storedRaw]);
  const [selectedId, setSelectedId] = useState(packets[0]?.id ?? "");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return packets.filter(
      (packet) =>
        (kindFilter === "all" || packet.kind === kindFilter) &&
        (statusFilter === "all" || packet.status === statusFilter) &&
        (!query ||
          packet.title.toLowerCase().includes(query) ||
          packet.id.toLowerCase().includes(query)),
    );
  }, [kindFilter, packets, search, statusFilter]);

  const selected =
    packets.find((packet) => packet.id === selectedId) ?? packets[0];
  if (!selected) {
    return <p className="t-body text-ink-muted">No reviewable subjects found.</p>;
  }
  const draft = drafts[selected.id] ?? emptyDraft(selected);
  const completedStages = completedReviewStages(
    selected,
    draft.completedItemIds,
  );
  const record = buildEditorialReviewRecord(selected, draft);
  const publicationReady = record.status === "published";

  function persist(next: DraftStore): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    } catch {
      // The console remains readable when local storage is unavailable.
    }
  }

  function updateDraft(patch: Partial<EditorialReviewDraft>): void {
    persist({ ...drafts, [selected.id]: { ...draft, ...patch } });
  }

  function toggleChecklist(itemId: string): void {
    const completed = new Set(draft.completedItemIds);
    if (completed.has(itemId)) completed.delete(itemId);
    else completed.add(itemId);
    updateDraft({ completedItemIds: [...completed] });
  }

  function clearDraft(): void {
    if (!window.confirm(`Clear the local review draft for “${selected.title}”?`)) {
      return;
    }
    const next = { ...drafts };
    delete next[selected.id];
    persist(next);
  }

  async function copyRecord(): Promise<void> {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const readyCount = packets.filter((packet) => {
    const packetDraft = drafts[packet.id] ?? emptyDraft(packet);
    return buildEditorialReviewRecord(packet, packetDraft).status === "published";
  }).length;

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside aria-label="Review queue" className="lg:sticky lg:top-20 lg:self-start">
        <GlassCard>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="t-meta text-ink-faint">Review queue</p>
              <p className="t-h2 mt-1 text-ink-strong">{packets.length}</p>
            </div>
            <div>
              <p className="t-meta text-ink-faint">Records ready</p>
              <p className="t-h2 mt-1 text-ok">{readyCount}</p>
            </div>
          </div>

          <label className="t-label mt-5 block font-sans text-ink-strong">
            Search subjects
            <span className="relative mt-2 block">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="field-surface min-h-11 w-full rounded-sm py-2 pl-10 pr-3 font-sans text-sm text-ink focus-visible:outline-none"
                placeholder="Title or ID"
              />
            </span>
          </label>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <label className="t-meta text-ink-faint">
              Kind
              <select
                value={kindFilter}
                onChange={(event) => setKindFilter(event.target.value as KindFilter)}
                className="field-surface mt-1 min-h-11 w-full rounded-sm px-2 font-sans text-xs text-ink"
              >
                <option value="all">All</option>
                <option value="concept">Concepts</option>
                <option value="create-frame">Frames</option>
                <option value="pathway">Pathways</option>
                <option value="prayer">Prayers</option>
                <option value="affirmation">Affirmations</option>
                <option value="practice">Practices</option>
                <option value="reflection-prompt">Prompts</option>
                <option value="teaching">Teachings</option>
              </select>
            </label>
            <label className="t-meta text-ink-faint">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="field-surface mt-1 min-h-11 w-full rounded-sm px-2 font-sans text-xs text-ink"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="published">Published</option>
              </select>
            </label>
          </div>
        </GlassCard>

        <p className="t-meta mt-4 text-ink-faint">
          Showing {filtered.length} subjects
        </p>
        <div className="mt-2 max-h-[56vh] space-y-2 overflow-y-auto pr-1">
          {filtered.map((packet) => {
            const packetDraft = drafts[packet.id] ?? emptyDraft(packet);
            const stages = completedReviewStages(
              packet,
              packetDraft.completedItemIds,
            );
            return (
              <button
                key={packet.id}
                type="button"
                onClick={() => {
                  setSelectedId(packet.id);
                  setCopied(false);
                }}
                className={[
                  "w-full rounded-sm border p-3 text-left transition-colors",
                  selected.id === packet.id
                    ? "border-[rgba(167,155,232,0.55)] bg-[rgba(167,155,232,0.08)]"
                    : "border-line-subtle hover:border-line",
                ].join(" ")}
              >
                <span className="t-meta block text-ink-faint">
                  {KIND_LABELS[packet.kind]} · {stages.length}/3 gates
                </span>
                <span className="t-label mt-1 block font-sans text-ink-strong">
                  {packet.title}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section aria-label="Selected review subject" className="min-w-0">
        <GlassCard hero>
          <div className="flex flex-wrap items-center gap-2">
            <Chip kind="source" classification="EDIT">{KIND_LABELS[selected.kind]}</Chip>
            <Chip kind="source" classification="EDIT">{selected.status}</Chip>
            <Chip
              kind="source"
              classification={classificationChip(selected.classification).classification}
            >
              {classificationChip(selected.classification).text}
            </Chip>
          </div>
          <h2 className="t-h1 mt-4 text-ink-strong">{selected.title}</h2>
          <p className="t-meta mt-2 text-ink-faint">{selected.id}</p>
          <p className="t-body mt-4 text-ink-muted">{selected.summary}</p>
          <div className="mt-4">
            <TraditionLabelGroup labels={selected.traditionLabels} />
          </div>
          {selected.previewHref ? (
            <Link
              href={selected.previewHref}
              className="t-body-sm mt-4 inline-flex min-h-11 items-center gap-1 font-sans font-medium text-ink-muted underline-offset-4 hover:text-violet hover:underline"
            >
              Open public preview
              <Icon name="arrow-up-right" className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </GlassCard>

        <section aria-labelledby="evidence-heading" className="mt-8">
          <h3 id="evidence-heading" className="t-h2 text-ink-strong">Evidence packet</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selected.editions.map((edition) => (
              <div key={edition.id} className="rounded-sm border border-line-subtle p-4">
                <p className="t-label font-sans text-ink-strong">{edition.label}</p>
                <p className="t-meta mt-2 text-ink-faint">
                  Rights · {edition.rightsStatus.replaceAll("-", " ")}
                </p>
                <p className="t-meta mt-1 text-ink-faint">
                  OCR · {edition.ocrQuality.replaceAll("-", " ")}
                </p>
                <p className="t-body-sm mt-2 text-ink-muted">{edition.notes}</p>
              </div>
            ))}
          </div>
          <SourceDrawer
            sources={selected.sources}
            anchors={selected.anchors}
            heading="Open citations and passage map"
            className="mt-4"
          />
          <div className="mt-4 rounded-sm border border-line-subtle p-4">
            <p className="t-label font-sans text-ink-strong">Declared relationships</p>
            <ul className="t-meta mt-2 space-y-1 text-ink-faint">
              {selected.anchorRelations.length > 0 ? (
                selected.anchorRelations.map((relation, index) => (
                  <li key={`${relation.anchorId}-${relation.relation}-${index}`}>
                    {relation.anchorId} · {relation.relation.replaceAll("-", " ")}
                  </li>
                ))
              ) : (
                <li>No passage-level relationship declared; source citations require background/further-reading confirmation.</li>
              )}
            </ul>
          </div>
        </section>

        <section aria-labelledby="copy-heading" className="mt-8">
          <h3 id="copy-heading" className="t-h2 text-ink-strong">Copy under review</h3>
          <pre className="t-body-sm mt-4 max-h-96 whitespace-pre-wrap overflow-y-auto rounded-md border border-line-subtle bg-[rgba(255,255,255,0.018)] p-5 font-sans text-ink-muted">
            {selected.copyText}
          </pre>
          <aside className="mt-4 rounded-sm border border-[rgba(232,180,160,0.28)] bg-[rgba(232,180,160,0.045)] p-4">
            <p className="t-label font-sans text-ink-strong">Subject safety frame</p>
            <p className="t-body-sm mt-2 whitespace-pre-line text-ink-muted">
              {selected.safetySummary}
            </p>
          </aside>
        </section>

        <section aria-labelledby="review-heading" className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="t-eyebrow text-violet">Three-stage gate</p>
              <h3 id="review-heading" className="t-h2 mt-1 text-ink-strong">
                {completedStages.length} of 3 stages complete
              </h3>
            </div>
            <p className="t-meta text-ink-faint">Draft saved only in this browser</p>
          </div>

          <div className="mt-5 space-y-5">
            {STAGES.map((stage) => {
              const items = selected.checklist.filter(
                (item) => item.stage === stage.id,
              );
              const stageComplete = completedStages.includes(stage.id);
              return (
                <GlassCard
                  key={stage.id}
                  as="fieldset"
                  className={stageComplete ? "border-[rgba(111,196,160,0.34)]" : ""}
                >
                  <legend className="px-2">
                    <span className="t-label inline-flex items-center gap-2 font-sans text-ink-strong">
                      <Icon name={stageComplete ? "check" : "shield"} className={stageComplete ? "h-4 w-4 text-ok" : "h-4 w-4 text-violet"} />
                      {stage.label}
                    </span>
                  </legend>
                  <p className="t-body-sm text-ink-muted">{stage.description}</p>
                  <div className="mt-4 space-y-3">
                    {items.map((item) => {
                      const checked = draft.completedItemIds.includes(item.id);
                      return (
                        <label key={item.id} className="flex cursor-pointer gap-3 rounded-sm border border-line-subtle p-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleChecklist(item.id)}
                            className="mt-1 h-4 w-4 shrink-0 accent-[var(--violet)]"
                          />
                          <span>
                            <span className="t-label block font-sans text-ink-strong">{item.label}</span>
                            <span className="t-body-sm mt-1 block text-ink-muted">{item.detail}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="attestation-heading" className="mt-8">
          <h3 id="attestation-heading" className="t-h2 text-ink-strong">Reviewer attestation</h3>
          <p className="t-body-sm mt-2 text-ink-muted">
            A publication-ready review requires all checks, a reviewer and a date.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="t-label font-sans text-ink-strong">
              Reviewer
              <input
                type="text"
                maxLength={200}
                value={draft.reviewer}
                onChange={(event) => updateDraft({ reviewer: event.target.value })}
                className="field-surface mt-2 min-h-12 w-full rounded-sm px-3 font-sans text-sm text-ink"
                placeholder="Full name or accountable role"
              />
            </label>
            <label className="t-label font-sans text-ink-strong">
              Review date
              <input
                type="date"
                value={draft.reviewedAt}
                onChange={(event) => updateDraft({ reviewedAt: event.target.value })}
                className="field-surface mt-2 min-h-12 w-full rounded-sm px-3 font-sans text-sm text-ink"
              />
            </label>
          </div>
          <label className="t-label mt-4 block font-sans text-ink-strong">
            Review notes
            <textarea
              rows={5}
              maxLength={2000}
              value={draft.notes}
              onChange={(event) => updateDraft({ notes: event.target.value })}
              className="field-surface mt-2 w-full rounded-sm p-3 font-sans text-sm text-ink"
              placeholder="Record edition checks, changes requested, remaining uncertainty and decision rationale."
            />
          </label>
        </section>

        <GlassCard className={`mt-8 ${publicationReady ? "border-[rgba(111,196,160,0.34)]" : "border-[rgba(167,155,232,0.28)]"}`}>
          <p className={`t-eyebrow ${publicationReady ? "text-ok" : "text-violet"}`}>
            {publicationReady ? "Review record ready" : "Publication remains blocked"}
          </p>
          <h3 className="t-h2 mt-2 text-ink-strong">
            {publicationReady
              ? "Export the attributable review record"
              : "Complete every gate and attestation field"}
          </h3>
          <p className="t-body-sm mt-2 text-ink-muted">
            Exporting does not publish content. Add the record to the source-controlled registry and change the subject status in the same reviewed code change; the validator will reject an incomplete pairing.
          </p>
          <p className="t-meta mt-3 text-ink-faint">
            Ingest after download: <code className="font-mono">npm run editorial:ingest -- path/to/{record.id}.json</code>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => saveJson(`${record.id}.json`, record)}
            >
              <Icon name="download" className="h-4 w-4" />
              Download record
            </Button>
            <Button variant="ghost" onClick={() => void copyRecord()}>
              <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
              {copied ? "Copied" : "Copy JSON"}
            </Button>
            {drafts[selected.id] ? (
              <Button variant="destructive-quiet" onClick={clearDraft}>
                <Icon name="trash" className="h-4 w-4" />
                Clear local draft
              </Button>
            ) : null}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
