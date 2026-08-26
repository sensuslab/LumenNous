import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { join, resolve } from "node:path";
import {
  buildPassageAnchor,
  mergePassageAnchors,
  mergeSourceRegistries,
  parseSourceBuffer,
  parseTextByFormat,
  redactCanonicalDocument,
  validateSourceManifest,
} from "./source-ingestion-core.mjs";

function manifest(format = "markdown") {
  return {
    schemaVersion: "1.0",
    id: `ingest-test-${format}`,
    sourceId: "src-test-text",
    input: {
      format,
      fileNameHint: `test.${format}`,
      expectedSha256: null,
      encoding: "utf8",
    },
    sourceRecords: [],
    edition: {
      id: `ed-test-${format}`,
      sourceId: "src-test-text",
      includedSourceIds: [],
      label: "Test edition",
      contentFormat: format,
      contentSha256: null,
    },
  };
}

test("creates stable format-neutral nodes from Markdown", () => {
  const input = Buffer.from("# First section\n\nA first paragraph.\n\n## Second section\n\nAnother paragraph.");
  const first = parseSourceBuffer(input, manifest(), "/unused.md");
  const second = parseSourceBuffer(input, manifest(), "/unused.md");
  assert.deepEqual(first, second);
  assert.deepEqual(first.nodes.map((node) => node.kind), [
    "work",
    "section",
    "paragraph",
    "section",
    "paragraph",
  ]);
  assert.match(first.nodes[2].textSha256, /^[a-f0-9]{64}$/);
});

test("maps USFM and OSIS scripture to book, chapter and verse nodes", () => {
  const usfm = parseTextByFormat(
    "\\id GEN Genesis\n\\c 1\n\\v 1 In the beginning.\n\\v 2 The earth was formless.",
    manifest("usfm"),
  );
  assert.equal(usfm.nodes.filter((node) => node.kind === "book").length, 1);
  assert.equal(usfm.nodes.filter((node) => node.kind === "chapter").length, 1);
  assert.equal(usfm.nodes.filter((node) => node.kind === "verse").length, 2);
  assert.equal(usfm.nodes.at(-1).nativeLocator, "GEN.1.2");

  const osis = parseTextByFormat(
    '<osis><verse osisID="John.1.1">A first verse.</verse><verse osisID="John.1.2">A second verse.</verse></osis>',
    manifest("osis"),
  );
  assert.equal(osis.nodes.filter((node) => node.kind === "verse").length, 2);
  assert.equal(osis.nodes.at(-1).nativeLocator, "John.1.2");
});

test("redacts source wording while retaining hashes and locators", () => {
  const document = parseSourceBuffer(
    Buffer.from("A private paragraph."),
    manifest("plain-text"),
    "/unused.txt",
  );
  const redacted = redactCanonicalDocument(document);
  assert.ok(document.nodes.some((node) => "text" in node));
  assert.ok(redacted.nodes.every((node) => !("text" in node)));
  assert.deepEqual(
    redacted.nodes.map((node) => node.textSha256),
    document.nodes.map((node) => node.textSha256),
  );
});

test("builds a semantic anchor from a stable canonical node range", () => {
  const document = parseSourceBuffer(
    Buffer.from("First paragraph.\n\nSecond paragraph."),
    manifest("plain-text"),
    "/unused.txt",
  );
  const anchor = buildPassageAnchor(document, {
    id: "anc-test-range",
    sourceId: "src-test-text",
    workTitle: "Test text",
    sectionTitle: "A reviewed range",
    startNodeId: document.nodes[1].id,
    endNodeId: document.nodes[2].id,
    conceptIds: ["con-test"],
    notes: "A test-only semantic mapping.",
  });
  assert.equal(anchor.structuredLocator.scheme, "canonical-node");
  assert.equal(anchor.structuredLocator.start, document.nodes[1].id);
  assert.equal(anchor.structuredLocator.end, document.nodes[2].id);
  assert.equal(anchor.verification, "mapped-from-extraction");
  assert.deepEqual(mergePassageAnchors([], [anchor]), [anchor]);
  assert.throws(() => mergePassageAnchors([anchor], [anchor]), /collision/);
});

test("refuses source and edition collisions without mutating registries", () => {
  const candidate = manifest();
  candidate.sourceRecords = [{ id: "src-new-text" }];
  candidate.sourceId = "src-new-text";
  candidate.edition.sourceId = "src-new-text";
  const existingSources = [{ id: "src-existing" }];
  const existingEditions = [];
  const snapshot = structuredClone({ existingSources, existingEditions });
  const merged = mergeSourceRegistries({
    existingSources,
    existingEditions,
    manifest: validateSourceManifest(candidate),
  });
  assert.equal(merged.sources.length, 2);
  assert.deepEqual({ existingSources, existingEditions }, snapshot);
  assert.throws(
    () =>
      mergeSourceRegistries({
        existingSources: merged.sources,
        existingEditions: merged.editions,
        manifest: candidate,
      }),
    /source id collision/,
  );
});

test("validates the two publication fixtures and scripture template", async () => {
  const root = resolve(import.meta.dirname, "..");
  for (const filename of [
    "nag-hammadi-library.json",
    "grumbine-melchizedek.json",
    "scripture-usfm-template.json",
  ]) {
    const value = JSON.parse(
      await readFile(join(root, "source-manifests", filename), "utf8"),
    );
    assert.doesNotThrow(() => validateSourceManifest(value));
  }
});
