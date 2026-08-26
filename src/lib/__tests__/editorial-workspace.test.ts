import { describe, expect, it } from "vitest";
import { EditorialReviewSchema } from "../schemas";
import { listEditorialReviewPackets } from "../editorial";
import {
  listAffirmations,
  listConceptEngineFrames,
  listContemplativeConcepts,
  listContemplativePathways,
  listPractices,
  listPrayers,
  listReflectionPrompts,
  listTeachings,
} from "../content";
import {
  buildEditorialReviewRecord,
  completedReviewStages,
} from "../editorial-review";

describe("editorial review workspace", () => {
  const packets = listEditorialReviewPackets();

  it("builds packets for the core graph and every source-aware content record", () => {
    const expectedByKind = {
      concept: listContemplativeConcepts().length,
      "create-frame": listConceptEngineFrames().length,
      pathway: listContemplativePathways().length,
      prayer: listPrayers().filter(
        (item) => item.sourceIds.length > 0 || (item.sourceUses?.length ?? 0) > 0,
      ).length,
      affirmation: listAffirmations().filter(
        (item) => item.sourceIds.length > 0 || (item.sourceUses?.length ?? 0) > 0,
      ).length,
      practice: listPractices().filter(
        (item) => item.sourceIds.length > 0 || (item.sourceUses?.length ?? 0) > 0,
      ).length,
      "reflection-prompt": listReflectionPrompts().filter(
        (item) => (item.sourceUses?.length ?? 0) > 0,
      ).length,
      teaching: listTeachings().filter(
        (item) => item.sourceIds.length > 0 || (item.sourceUses?.length ?? 0) > 0,
      ).length,
    };

    expect(packets).toHaveLength(
      Object.values(expectedByKind).reduce((total, count) => total + count, 0),
    );
    for (const [kind, count] of Object.entries(expectedByKind)) {
      expect(packets.filter((packet) => packet.kind === kind)).toHaveLength(count);
    }

    for (const packet of packets) {
      expect(packet.sources.length).toBeGreaterThan(0);
      if (packet.anchors.length > 0) {
        expect(packet.editions.length).toBeGreaterThan(0);
      } else {
        expect(packet.checklist.map((item) => item.id)).toContain(
          "source-structured-map",
        );
      }
      expect(new Set(packet.checklist.map((item) => item.stage))).toEqual(
        new Set(["source", "safety", "copy"]),
      );
    }
  });

  it("includes every source-aware record exactly once", () => {
    const expectedIds = [
      ...listPrayers(),
      ...listAffirmations(),
      ...listPractices(),
      ...listTeachings(),
    ]
      .filter(
        (item) => item.sourceIds.length > 0 || (item.sourceUses?.length ?? 0) > 0,
      )
      .map((item) => item.id);
    expectedIds.push(
      ...listReflectionPrompts()
        .filter((item) => (item.sourceUses?.length ?? 0) > 0)
        .map((item) => item.id),
    );
    const packetIds = packets.map((packet) => packet.id);
    for (const id of expectedIds) {
      expect(packetIds.filter((packetId) => packetId === id)).toHaveLength(1);
    }
  });

  it("adds evidence-specific OCR and historical-distinction checks", () => {
    const purpose = packets.find((packet) => packet.id === "con-purpose-service");
    const fourPlanes = packets.find((packet) => packet.id === "con-four-planes");

    expect(purpose?.checklist.map((item) => item.id)).toContain(
      "source-two-melchizedeks",
    );
    expect(fourPlanes?.checklist.map((item) => item.id)).toContain("source-ocr");
    expect(
      fourPlanes?.editions.some((edition) => edition.ocrQuality === "low"),
    ).toBe(true);
  });

  it("completes a stage only when every subject-specific check is complete", () => {
    const packet = packets.find((item) => item.id === "con-purpose-service")!;
    const allItemIds = packet.checklist.map((item) => item.id);
    expect(completedReviewStages(packet, allItemIds)).toEqual([
      "source",
      "safety",
      "copy",
    ]);

    const missingDistinction = allItemIds.filter(
      (id) => id !== "source-two-melchizedeks",
    );
    expect(completedReviewStages(packet, missingDistinction)).not.toContain(
      "source",
    );
  });

  it("exports a publication-ready record only with all gates and attribution", () => {
    const packet = packets[0]!;
    const completedItemIds = packet.checklist.map((item) => item.id);
    const ready = buildEditorialReviewRecord(packet, {
      completedItemIds,
      reviewer: "Accountable editor",
      reviewedAt: "2026-08-26",
      notes: "Edition, safety and copy reviewed.",
    });
    expect(ready.status).toBe("published");
    expect(() => EditorialReviewSchema.parse(ready)).not.toThrow();

    const unattributed = buildEditorialReviewRecord(packet, {
      completedItemIds,
      reviewer: "",
      reviewedAt: "",
      notes: "Checks are not enough without attribution.",
    });
    expect(unattributed.status).toBe("review");
  });
});
