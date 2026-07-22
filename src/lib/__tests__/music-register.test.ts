import { describe, expect, it } from "vitest";
import {
  musicRegister,
  musicRegisterFamilies,
  musicRegisterFrequencies,
} from "@/data/music-register";

describe("music register", () => {
  it("imports every source record", () => {
    expect(musicRegister).toHaveLength(88);
    expect(new Set(musicRegister.map((item) => item.id)).size).toBe(88);
    expect(new Set(musicRegister.map((item) => item.family)).size).toBe(
      musicRegisterFamilies.length,
    );
  });

  it("preserves the source playback decisions", () => {
    expect(musicRegister.filter((item) => item.playbackMode === "embed")).toHaveLength(54);
    expect(musicRegister.filter((item) => item.playbackMode === "link")).toHaveLength(34);
    expect(
      musicRegister
        .filter((item) => item.readinessState === "blocked")
        .every((item) => item.playbackMode === "link"),
    ).toBe(true);
  });

  it("extracts valid YouTube IDs and explicit pitch labels", () => {
    expect(musicRegister.every((item) => /^[A-Za-z0-9_-]{11}$/.test(item.youtubeId))).toBe(true);
    expect(musicRegisterFrequencies).toEqual([111, 396, 417, 432, 444, 528, 741]);
  });
});
