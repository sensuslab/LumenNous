import { describe, expect, it } from "vitest";
import {
  isConservativePublicMusicItem,
  musicRegister,
  musicRegisterDuplicateUrls,
  musicRegisterFamilies,
  musicRegisterFrequencies,
  musicRegisterSource,
} from "@/data/music-register";
import {
  publicMusicRegister,
  publicMusicRegisterIds,
  sessionMusicSelections,
  sessionMusicVariantIds,
} from "@/data/music-selections";

describe("music register audit snapshot", () => {
  it("imports all 153 source records in deterministic id order", () => {
    const ids = musicRegister.map((item) => item.id);

    expect(musicRegisterSource).toBe(
      "Music/Research/corpus/media_research/youtube_audio_register_expanded.csv",
    );
    expect(musicRegister).toHaveLength(153);
    expect(new Set(ids).size).toBe(153);
    expect(ids).toEqual([...ids].sort());
    expect(new Set(musicRegister.map((item) => item.family)).size).toBe(
      musicRegisterFamilies.length,
    );
  });

  it("preserves RFC-quoted fields and nullable unknown audit values", () => {
    const quoted = musicRegister.find((item) => item.id === "CHANT-001");
    const unknown = musicRegister.find((item) => item.id === "CHANT-016");

    expect(quoted?.title).toBe(
      "Syriac Orthodox Prayer \"Abun D'Bashmayo\" (The Lord's Prayer)",
    );
    expect(unknown?.durationSeconds).toBeNull();
    expect(unknown?.viewsChecked).toBeNull();
  });

  it("supports YouTube live links and extracts every explicit pitch label", () => {
    const live = musicRegister.find((item) => item.id === "CHANT-033");

    expect(live).toMatchObject({
      url: "https://www.youtube.com/live/4tyO7P_nLVk",
      youtubeId: "4tyO7P_nLVk",
      durationSeconds: null,
      viewsChecked: null,
    });
    expect(
      musicRegister.every((item) => /^[A-Za-z0-9_-]{11}$/.test(item.youtubeId)),
    ).toBe(true);
    expect(musicRegisterFrequencies).toEqual([
      3.2,
      10.5,
      14.1,
      108,
      111,
      216,
      396,
      417,
      432,
      444,
      528,
      741,
      963,
      10000,
    ]);
  });

  it("reports duplicate source URLs without dropping either audit record", () => {
    expect(musicRegisterDuplicateUrls).toEqual([
      {
        url: "https://www.youtube.com/watch?v=3dhShorDjOg",
        ids: ["AMBIENT-008", "HZ-001"],
      },
      {
        url: "https://www.youtube.com/watch?v=YW5m4loqqm0",
        ids: ["AMBIENT-005", "HZ-002"],
      },
    ]);
  });
});

describe("reviewed public listening", () => {
  it("resolves only the explicit eight-item conservative allowlist", () => {
    expect(publicMusicRegisterIds).toEqual([
      "NATURE-017",
      "AMBIENT-006",
      "AMBIENT-001",
      "SINGING-007",
      "NATURE-011",
      "NATURE-014",
      "NATURE-015",
      "CHANT-016",
    ]);
    expect(publicMusicRegister.map((item) => item.id)).toEqual(
      publicMusicRegisterIds,
    );
    expect(publicMusicRegister.every(isConservativePublicMusicItem)).toBe(true);
    expect(
      publicMusicRegister.some((item) =>
        ["HZ", "BINAURAL", "DNA", "CHAKRA"].includes(item.family),
      ),
    ).toBe(false);
  });

  it("maps each supported session variant to one or two public selections", () => {
    expect(Object.keys(sessionMusicSelections).sort()).toEqual(
      [...sessionMusicVariantIds].sort(),
    );
    expect(
      Object.fromEntries(
        Object.entries(sessionMusicSelections).map(([variant, selection]) => [
          variant,
          selection.registerIds,
        ]),
      ),
    ).toEqual({
      "morning-setting": ["NATURE-015", "CHANT-016"],
      "midday-recenter": ["NATURE-017", "AMBIENT-006"],
      "evening-integration": ["NATURE-014", "SINGING-007"],
      "challenge-reset": ["NATURE-017", "AMBIENT-006"],
      "before-sleep": ["NATURE-011", "NATURE-014"],
    });

    const publicIds = new Set<string>(publicMusicRegisterIds);
    for (const selection of Object.values(sessionMusicSelections)) {
      expect(selection.registerIds.length).toBeGreaterThanOrEqual(1);
      expect(selection.registerIds.length).toBeLessThanOrEqual(2);
      expect(new Set(selection.registerIds).size).toBe(
        selection.registerIds.length,
      );
      expect(selection.registerIds.every((id) => publicIds.has(id))).toBe(true);
      expect(selection.rationale.length).toBeGreaterThan(20);
      expect(selection.setup.length).toBeGreaterThan(20);
    }
  });
});
