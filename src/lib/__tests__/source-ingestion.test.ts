import { describe, expect, it } from "vitest";
import {
  SourceIngestionManifestSchema,
  SourceReviewPolicySchema,
} from "../schemas";
import {
  listPassageAnchors,
  listSourceEditions,
  listSourceReviewPolicies,
} from "../content";
import nagHammadiManifest from "../../../source-manifests/nag-hammadi-library.json";
import grumbineManifest from "../../../source-manifests/grumbine-melchizedek.json";
import scriptureManifest from "../../../source-manifests/scripture-usfm-template.json";

describe("text-agnostic source ingestion foundation", () => {
  it("validates collection, single-work and scripture manifests identically", () => {
    for (const manifest of [
      nagHammadiManifest,
      grumbineManifest,
      scriptureManifest,
    ]) {
      expect(() => SourceIngestionManifestSchema.parse(manifest)).not.toThrow();
    }
    expect(nagHammadiManifest.workMappings.length).toBeGreaterThan(0);
    expect(scriptureManifest.input.format).toBe("usfm");
  });

  it("binds each edition to a format, fingerprint policy and locator strategy", () => {
    for (const edition of listSourceEditions()) {
      expect(edition.contentFormat).toBeTruthy();
      expect(edition.contentSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(edition.locatorStrategy.length).toBeGreaterThan(20);
    }
  });

  it("gives every semantic anchor a structured, edition-specific locator", () => {
    for (const anchor of listPassageAnchors()) {
      expect(anchor.structuredLocator.start).toBeTruthy();
      expect(anchor.structuredLocator.display).toBe(anchor.locator);
    }
  });

  it("expresses special review handling as validated policy data", () => {
    const policies = listSourceReviewPolicies();
    expect(() => SourceReviewPolicySchema.array().parse(policies)).not.toThrow();
    expect(
      policies.find((policy) => policy.id === "source-two-melchizedeks"),
    ).toMatchObject({ activation: "all", stage: "source" });
  });
});
