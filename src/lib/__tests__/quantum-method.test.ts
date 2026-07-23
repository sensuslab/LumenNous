import { describe, expect, it } from "vitest";
import {
  QUANTUM_PRAYER_CORE_SECONDS,
  quantumPrayerMethod,
} from "@/data/quantum-prayer-method";
import { sessionTemplates } from "@/data/session-templates";
import {
  publicMusicRegisterIds,
  sessionMusicSelections,
} from "@/data/music-selections";

const STAGE_IDS = [
  "regulate",
  "embody",
  "evoke",
  "articulate",
  "release",
] as const;

describe("reviewed Quantum Prayer method", () => {
  it("keeps the source protocol's exact order and three-minute timing", () => {
    expect(quantumPrayerMethod.stages.map((stage) => stage.id)).toEqual(
      STAGE_IDS,
    );
    expect(quantumPrayerMethod.stages.map((stage) => stage.seconds)).toEqual([
      60, 30, 30, 30, 30,
    ]);
    expect(QUANTUM_PRAYER_CORE_SECONDS).toBe(180);
  });

  it("keeps 4–2–6 optional, repeats the intention three times, and permits emotional opt-out", () => {
    expect(quantumPrayerMethod.stages[0]?.breathPattern).toEqual({
      inhaleCounts: 4,
      holdCounts: 2,
      exhaleCounts: 6,
    });
    expect(quantumPrayerMethod.stages[2]?.optional).toBe(true);
    expect(quantumPrayerMethod.stages[3]?.repetitions).toBe(3);
  });

  it("validates every daily variant against the same core", () => {
    expect(sessionTemplates).toHaveLength(5);
    expect(new Set(sessionTemplates.map((session) => session.variant))).toHaveLength(
      5,
    );
    for (const session of sessionTemplates) {
      expect(session.methodologyId).toBe("quantum-prayer-v1");
      expect(session.stages.map((stage) => stage.id)).toEqual(STAGE_IDS);
      expect(
        session.stages.reduce((total, stage) => total + stage.seconds, 0),
      ).toBe(180);
      expect(session.stages[2]?.skippable).toBe(true);
      expect(session.stages[3]?.repetitions).toBe(3);
    }
  });

  it("states the quantum evidence boundary and rejects guaranteed outcomes", () => {
    expect(quantumPrayerMethod.evidenceBoundary).toMatch(
      /not established scientific mechanisms/i,
    );
    const copy = JSON.stringify(sessionTemplates).toLowerCase();
    expect(copy).not.toMatch(
      /guaranteed healing|collapse reality|change probability|repair dna|manifest miracles/,
    );
    expect(copy).toMatch(/does not guarantee|no promise|without promising/);
  });

  it("keeps inter-personal agency and practical help intact", () => {
    const challenge = sessionTemplates.find(
      (session) => session.variant === "challenge-reset",
    );
    expect(challenge?.stages[4]?.instruction).toMatch(/safe action/i);
    expect(challenge?.safetyNotes).toMatch(/danger|trusted person|emergency/i);
  });

  it("uses only the explicit public music selections for each variant", () => {
    const publicIds = new Set<string>(publicMusicRegisterIds);
    for (const session of sessionTemplates) {
      const selected = sessionMusicSelections[session.variant].registerIds;
      expect(new Set(session.audioTrackIds)).toEqual(new Set(selected));
      expect(session.audioTrackIds.every((id) => publicIds.has(id))).toBe(true);
    }
  });
});
