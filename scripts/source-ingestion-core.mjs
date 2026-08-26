import { createHash } from "node:crypto";
import { posix } from "node:path";
import { spawnSync } from "node:child_process";

const FORMATS = new Set([
  "epub",
  "pdf",
  "plain-text",
  "markdown",
  "html",
  "osis",
  "usfm",
  "json-tree",
]);
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA_PATTERN = /^[a-f0-9]{64}$/;

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function assertId(value, label) {
  if (typeof value !== "string" || !ID_PATTERN.test(value) || value.length > 120) {
    throw new Error(`${label} must be a kebab-case identifier`);
  }
}

function assertText(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

export function validateSourceManifest(value) {
  assertObject(value, "manifest");
  if (value.schemaVersion !== "1.0") {
    throw new Error('manifest.schemaVersion must be "1.0"');
  }
  assertId(value.id, "manifest.id");
  assertId(value.sourceId, "manifest.sourceId");
  assertObject(value.input, "manifest.input");
  if (!FORMATS.has(value.input.format)) {
    throw new Error(`unsupported manifest.input.format: ${value.input.format}`);
  }
  assertText(value.input.fileNameHint, "manifest.input.fileNameHint");
  if (
    value.input.expectedSha256 !== null &&
    !SHA_PATTERN.test(value.input.expectedSha256)
  ) {
    throw new Error("manifest.input.expectedSha256 must be null or a SHA-256");
  }
  if (!Array.isArray(value.sourceRecords)) {
    throw new Error("manifest.sourceRecords must be an array");
  }
  for (const [index, source] of value.sourceRecords.entries()) {
    assertObject(source, `manifest.sourceRecords[${index}]`);
    assertId(source.id, `manifest.sourceRecords[${index}].id`);
  }
  assertObject(value.edition, "manifest.edition");
  assertId(value.edition.id, "manifest.edition.id");
  assertId(value.edition.sourceId, "manifest.edition.sourceId");
  if (value.edition.sourceId !== value.sourceId) {
    throw new Error("manifest sourceId must match edition.sourceId");
  }
  if (value.edition.contentFormat !== value.input.format) {
    throw new Error("manifest input format must match edition.contentFormat");
  }
  if (
    value.edition.contentSha256 !== null &&
    !SHA_PATTERN.test(value.edition.contentSha256)
  ) {
    throw new Error("manifest.edition.contentSha256 must be null or a SHA-256");
  }
  if (value.workMappings !== undefined) {
    if (!Array.isArray(value.workMappings)) {
      throw new Error("manifest.workMappings must be an array");
    }
    for (const [index, mapping] of value.workMappings.entries()) {
      assertObject(mapping, `manifest.workMappings[${index}]`);
      assertId(mapping.sourceId, `manifest.workMappings[${index}].sourceId`);
      assertText(mapping.label, `manifest.workMappings[${index}].label`);
      if (
        !Array.isArray(mapping.pathIncludes) ||
        mapping.pathIncludes.some((part) => typeof part !== "string" || !part)
      ) {
        throw new Error(
          `manifest.workMappings[${index}].pathIncludes must contain strings`,
        );
      }
    }
  }
  return structuredClone(value);
}

function decodeEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function stripMarkup(value) {
  return decodeEntities(
    value
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function nodeId(editionId, nativeLocator, ordinal) {
  return `node-${sha256(`${editionId}\0${nativeLocator}\0${ordinal}`).slice(0, 24)}`;
}

function createNode({ editionId, parentId, kind, ordinal, label, nativeLocator, text }) {
  const normalizedText = text.trim();
  return {
    id: nodeId(editionId, nativeLocator, ordinal),
    parentId,
    kind,
    ordinal,
    label: label.trim().slice(0, 500),
    nativeLocator,
    textSha256: sha256(normalizedText),
    text: normalizedText,
  };
}

function rootNode(manifest) {
  return createNode({
    editionId: manifest.edition.id,
    parentId: null,
    kind: manifest.workMappings?.length ? "collection" : "work",
    ordinal: 0,
    label: manifest.edition.label,
    nativeLocator: "/",
    text: "",
  });
}

function blocksFromHtml(html) {
  const blocks = [];
  const cleaned = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "");
  const pattern = /<(h[1-6]|p|li|blockquote|pre)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of cleaned.matchAll(pattern)) {
    const text = stripMarkup(match[2]);
    if (text) blocks.push({ heading: match[1].startsWith("h"), text });
  }
  if (blocks.length === 0) {
    const text = stripMarkup(cleaned);
    if (text) blocks.push({ heading: false, text });
  }
  return blocks;
}

function parseHtmlDocument(text, manifest, nativePath = manifest.input.fileNameHint) {
  const root = rootNode(manifest);
  const nodes = [root];
  let parentId = root.id;
  let ordinal = 1;
  for (const [index, block] of blocksFromHtml(text).entries()) {
    const nativeLocator = `${nativePath}#block-${index + 1}`;
    const node = createNode({
      editionId: manifest.edition.id,
      parentId: block.heading ? root.id : parentId,
      kind: block.heading ? "section" : "paragraph",
      ordinal: ordinal++,
      label: block.heading ? block.text : "",
      nativeLocator,
      text: block.text,
    });
    nodes.push(node);
    if (block.heading) parentId = node.id;
  }
  return { nodes, warnings: [] };
}

function parseMarkdownDocument(text, manifest) {
  const root = rootNode(manifest);
  const nodes = [root];
  let parentId = root.id;
  let ordinal = 1;
  const paragraphs = text.split(/\n\s*\n/);
  for (const [index, paragraph] of paragraphs.entries()) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    const headingMatch = trimmed.match(/^#{1,6}\s+(.+)$/s);
    const content = (headingMatch?.[1] ?? trimmed).replace(/\s+/g, " ").trim();
    const node = createNode({
      editionId: manifest.edition.id,
      parentId: headingMatch ? root.id : parentId,
      kind: headingMatch ? "section" : "paragraph",
      ordinal: ordinal++,
      label: headingMatch ? content : "",
      nativeLocator: `${manifest.input.fileNameHint}#block-${index + 1}`,
      text: content,
    });
    nodes.push(node);
    if (headingMatch) parentId = node.id;
  }
  return { nodes, warnings: [] };
}

function parsePlainTextDocument(text, manifest) {
  const root = rootNode(manifest);
  const paragraphs = text.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  return {
    nodes: [
      root,
      ...paragraphs.map((paragraph, index) =>
        createNode({
          editionId: manifest.edition.id,
          parentId: root.id,
          kind: "paragraph",
          ordinal: index + 1,
          label: "",
          nativeLocator: `${manifest.input.fileNameHint}#paragraph-${index + 1}`,
          text: paragraph.replace(/\s+/g, " "),
        }),
      ),
    ],
    warnings: [],
  };
}

function parseUsfmDocument(text, manifest) {
  const root = rootNode(manifest);
  const nodes = [root];
  let bookId = root.id;
  let bookCode = "unknown";
  let chapterId = root.id;
  let chapter = "0";
  let ordinal = 1;
  for (const line of text.split(/\r?\n/)) {
    const bookMatch = line.match(/^\\id\s+(\S+)(?:\s+(.+))?/);
    if (bookMatch) {
      bookCode = bookMatch[1];
      const node = createNode({
        editionId: manifest.edition.id,
        parentId: root.id,
        kind: "book",
        ordinal: ordinal++,
        label: bookMatch[2] || bookCode,
        nativeLocator: bookCode,
        text: "",
      });
      nodes.push(node);
      bookId = node.id;
      chapterId = bookId;
      continue;
    }
    const chapterMatch = line.match(/^\\c\s+(\S+)/);
    if (chapterMatch) {
      chapter = chapterMatch[1];
      const node = createNode({
        editionId: manifest.edition.id,
        parentId: bookId,
        kind: "chapter",
        ordinal: ordinal++,
        label: `Chapter ${chapter}`,
        nativeLocator: `${bookCode}.${chapter}`,
        text: "",
      });
      nodes.push(node);
      chapterId = node.id;
      continue;
    }
    const verseMatch = line.match(/^\\v\s+(\S+)\s*(.*)/);
    if (verseMatch) {
      const verse = verseMatch[1];
      nodes.push(
        createNode({
          editionId: manifest.edition.id,
          parentId: chapterId,
          kind: "verse",
          ordinal: ordinal++,
          label: `${bookCode} ${chapter}:${verse}`,
          nativeLocator: `${bookCode}.${chapter}.${verse}`,
          text: verseMatch[2].replace(/\\\w+\*?/g, " ").replace(/\s+/g, " "),
        }),
      );
    }
  }
  return {
    nodes,
    warnings: nodes.some((node) => node.kind === "verse")
      ? []
      : ["No USFM verse markers were detected."],
  };
}

function parseOsisDocument(text, manifest) {
  const root = rootNode(manifest);
  const nodes = [root];
  const books = new Map();
  const chapters = new Map();
  let ordinal = 1;
  const versePattern = /<verse\b[^>]*osisID=["']([^"']+)["'][^>]*>([\s\S]*?)<\/verse>/gi;
  for (const match of text.matchAll(versePattern)) {
    const reference = match[1];
    const [book = "unknown", chapter = "0", verse = "0"] = reference.split(".");
    if (!books.has(book)) {
      const node = createNode({
        editionId: manifest.edition.id,
        parentId: root.id,
        kind: "book",
        ordinal: ordinal++,
        label: book,
        nativeLocator: book,
        text: "",
      });
      books.set(book, node.id);
      nodes.push(node);
    }
    const chapterReference = `${book}.${chapter}`;
    if (!chapters.has(chapterReference)) {
      const node = createNode({
        editionId: manifest.edition.id,
        parentId: books.get(book),
        kind: "chapter",
        ordinal: ordinal++,
        label: `Chapter ${chapter}`,
        nativeLocator: chapterReference,
        text: "",
      });
      chapters.set(chapterReference, node.id);
      nodes.push(node);
    }
    nodes.push(
      createNode({
        editionId: manifest.edition.id,
        parentId: chapters.get(chapterReference),
        kind: "verse",
        ordinal: ordinal++,
        label: `${book} ${chapter}:${verse}`,
        nativeLocator: reference,
        text: stripMarkup(match[2]),
      }),
    );
  }
  return {
    nodes,
    warnings: nodes.some((node) => node.kind === "verse")
      ? []
      : ["No OSIS verse elements were detected."],
  };
}

function unzip(sourcePath, args, maxBuffer = 64 * 1024 * 1024) {
  const result = spawnSync("/usr/bin/unzip", [...args, sourcePath], {
    encoding: "utf8",
    maxBuffer,
  });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || "Unable to read EPUB archive");
  }
  return result.stdout;
}

function unzipEntry(sourcePath, entry) {
  const result = spawnSync("/usr/bin/unzip", ["-p", sourcePath, entry], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || `Unable to read ${entry}`);
  }
  return result.stdout;
}

function epubSpineEntries(sourcePath) {
  const entries = unzip(sourcePath, ["-Z1"])
    .split(/\r?\n/)
    .filter(Boolean);
  let opfPath = "";
  if (entries.includes("META-INF/container.xml")) {
    const container = unzipEntry(sourcePath, "META-INF/container.xml");
    opfPath = container.match(/full-path=["']([^"']+)["']/i)?.[1] ?? "";
  }
  if (opfPath && entries.includes(opfPath)) {
    const opf = unzipEntry(sourcePath, opfPath);
    const manifestItems = new Map();
    for (const match of opf.matchAll(/<item\b([^>]+)>/gi)) {
      const attributes = match[1];
      const id = attributes.match(/\bid=["']([^"']+)["']/i)?.[1];
      const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1];
      const mediaType = attributes.match(/\bmedia-type=["']([^"']+)["']/i)?.[1];
      if (id && href && /xhtml|html/i.test(mediaType ?? href)) {
        manifestItems.set(id, posix.normalize(posix.join(posix.dirname(opfPath), decodeURIComponent(href))));
      }
    }
    const spine = [...opf.matchAll(/<itemref\b[^>]*idref=["']([^"']+)["'][^>]*>/gi)]
      .map((match) => manifestItems.get(match[1]))
      .filter((entry) => entry && entries.includes(entry));
    if (spine.length > 0) return spine;
  }
  return entries.filter((entry) => /\.(xhtml?|html?)$/i.test(entry));
}

function parseEpubDocument(sourcePath, manifest) {
  const root = rootNode(manifest);
  const nodes = [root];
  const workNodes = new Map();
  let ordinal = 1;
  const warnings = [];
  for (const entry of epubSpineEntries(sourcePath)) {
    const mapping = manifest.workMappings?.find((candidate) =>
      candidate.pathIncludes.some((part) => entry.includes(part)),
    );
    let workParentId = root.id;
    if (mapping) {
      if (!workNodes.has(mapping.sourceId)) {
        const workNode = createNode({
          editionId: manifest.edition.id,
          parentId: root.id,
          kind: "work",
          ordinal: ordinal++,
          label: mapping.label,
          nativeLocator: `source:${mapping.sourceId}`,
          text: "",
        });
        nodes.push(workNode);
        workNodes.set(mapping.sourceId, workNode.id);
      }
      workParentId = workNodes.get(mapping.sourceId);
    }
    let sectionParentId = workParentId;
    const html = unzipEntry(sourcePath, entry);
    const pageMatch = entry.match(/(?:^|\/)page[_-]?(\d+)\.x?html?$/i);
    if (pageMatch) {
      const pageNode = createNode({
        editionId: manifest.edition.id,
        parentId: workParentId,
        kind: "page",
        ordinal: ordinal++,
        label: `Page ${pageMatch[1]}`,
        nativeLocator: entry,
        text: "",
      });
      nodes.push(pageNode);
      sectionParentId = pageNode.id;
      workParentId = pageNode.id;
    }
    for (const [blockIndex, block] of blocksFromHtml(html).entries()) {
      const node = createNode({
        editionId: manifest.edition.id,
        parentId: block.heading ? workParentId : sectionParentId,
        kind: block.heading ? "section" : "paragraph",
        ordinal: ordinal++,
        label: block.heading ? block.text : "",
        nativeLocator: `${entry}#block-${blockIndex + 1}`,
        text: block.text,
      });
      nodes.push(node);
      if (block.heading) sectionParentId = node.id;
    }
  }
  if (nodes.length === 1) warnings.push("No readable EPUB spine content was detected.");
  if (manifest.workMappings?.length && workNodes.size < manifest.workMappings.length) {
    warnings.push(
      `${manifest.workMappings.length - workNodes.size} declared work mapping(s) did not match an EPUB path.`,
    );
  }
  return { nodes, warnings };
}

export function parseTextByFormat(text, manifestValue) {
  const manifest = validateSourceManifest(manifestValue);
  switch (manifest.input.format) {
    case "plain-text":
      return parsePlainTextDocument(text, manifest);
    case "markdown":
      return parseMarkdownDocument(text, manifest);
    case "html":
      return parseHtmlDocument(text, manifest);
    case "osis":
      return parseOsisDocument(text, manifest);
    case "usfm":
      return parseUsfmDocument(text, manifest);
    case "json-tree": {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.nodes)) throw new Error("JSON tree requires a nodes array");
      return { nodes: structuredClone(parsed.nodes), warnings: parsed.warnings ?? [] };
    }
    default:
      throw new Error(`${manifest.input.format} requires its file adapter`);
  }
}

export function parseSourceBuffer(buffer, manifestValue, sourcePath) {
  const manifest = validateSourceManifest(manifestValue);
  const inputSha256 = sha256(buffer);
  for (const [label, expected] of [
    ["manifest input", manifest.input.expectedSha256],
    ["edition content", manifest.edition.contentSha256],
  ]) {
    if (expected && expected !== inputSha256) {
      throw new Error(`${label} SHA-256 mismatch: expected ${expected}, received ${inputSha256}`);
    }
  }
  let parsed;
  if (manifest.input.format === "epub") {
    parsed = parseEpubDocument(sourcePath, manifest);
  } else if (manifest.input.format === "pdf") {
    const result = spawnSync("pdftotext", ["-layout", sourcePath, "-"], {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
    });
    if (result.error?.code === "ENOENT") {
      throw new Error(
        "PDF ingestion requires the pdftotext executable; install Poppler or convert the file to plain text first.",
      );
    }
    if (result.status !== 0) throw new Error(result.stderr || "pdftotext failed");
    parsed = parsePlainTextDocument(result.stdout, manifest);
  } else {
    parsed = parseTextByFormat(buffer.toString(manifest.input.encoding || "utf8"), manifest);
  }
  return {
    schemaVersion: "1.0",
    manifestId: manifest.id,
    sourceId: manifest.sourceId,
    editionId: manifest.edition.id,
    format: manifest.input.format,
    inputSha256,
    nodes: parsed.nodes,
    warnings: parsed.warnings,
  };
}

export function redactCanonicalDocument(document) {
  return {
    ...structuredClone(document),
    nodes: document.nodes.map(({ text: _text, ...node }) => node),
  };
}

export function mergeSourceRegistries({ existingSources, existingEditions, manifest }) {
  if (!Array.isArray(existingSources) || !Array.isArray(existingEditions)) {
    throw new Error("source registries must be arrays");
  }
  const incomingSources = manifest.sourceRecords;
  const sourceIds = new Set(existingSources.map((source) => source.id));
  const incomingIds = new Set();
  for (const source of incomingSources) {
    if (sourceIds.has(source.id) || incomingIds.has(source.id)) {
      throw new Error(`source id collision: ${source.id}`);
    }
    incomingIds.add(source.id);
  }
  if (existingEditions.some((edition) => edition.id === manifest.edition.id)) {
    throw new Error(`source edition id collision: ${manifest.edition.id}`);
  }
  const availableSourceIds = new Set([...sourceIds, ...incomingIds]);
  for (const sourceId of [
    manifest.edition.sourceId,
    ...(manifest.edition.includedSourceIds ?? []),
  ]) {
    if (!availableSourceIds.has(sourceId)) {
      throw new Error(`edition references an unregistered source: ${sourceId}`);
    }
  }
  return {
    sources: [...structuredClone(existingSources), ...structuredClone(incomingSources)],
    editions: [...structuredClone(existingEditions), structuredClone(manifest.edition)],
  };
}

export function buildPassageAnchor(document, request) {
  assertObject(document, "canonical document");
  if (document.schemaVersion !== "1.0" || !Array.isArray(document.nodes)) {
    throw new Error("canonical document must use schemaVersion 1.0 and contain nodes");
  }
  assertObject(request, "anchor request");
  assertId(request.id, "anchor request.id");
  assertId(request.sourceId, "anchor request.sourceId");
  assertText(request.workTitle, "anchor request.workTitle");
  assertText(request.sectionTitle, "anchor request.sectionTitle");
  assertText(request.notes, "anchor request.notes");
  if (!Array.isArray(request.conceptIds) || request.conceptIds.length === 0) {
    throw new Error("anchor request.conceptIds must contain at least one concept id");
  }
  for (const conceptId of request.conceptIds) assertId(conceptId, "anchor concept id");
  const byId = new Map(document.nodes.map((node) => [node.id, node]));
  const start = byId.get(request.startNodeId);
  const end = request.endNodeId ? byId.get(request.endNodeId) : start;
  if (!start) throw new Error(`unknown startNodeId: ${request.startNodeId}`);
  if (!end) throw new Error(`unknown endNodeId: ${request.endNodeId}`);
  if (start.ordinal > end.ordinal) {
    throw new Error("anchor range must follow canonical document order");
  }

  function scopedSourceId(node) {
    let current = node;
    const visited = new Set();
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      if (current.nativeLocator?.startsWith("source:")) {
        return current.nativeLocator.slice("source:".length);
      }
      current = current.parentId ? byId.get(current.parentId) : undefined;
    }
    return document.sourceId;
  }

  const startSourceId = scopedSourceId(start);
  const endSourceId = scopedSourceId(end);
  if (startSourceId !== request.sourceId || endSourceId !== request.sourceId) {
    throw new Error(
      `anchor sourceId ${request.sourceId} does not match canonical range scope ${startSourceId}/${endSourceId}`,
    );
  }
  const display =
    request.displayLocator ||
    (start.id === end.id
      ? start.nativeLocator
      : `${start.nativeLocator} – ${end.nativeLocator}`);
  return {
    id: request.id,
    sourceId: request.sourceId,
    editionId: document.editionId,
    workTitle: request.workTitle,
    sectionTitle: request.sectionTitle,
    locator: display,
    structuredLocator: {
      scheme: "canonical-node",
      start: start.id,
      ...(start.id === end.id ? {} : { end: end.id }),
      display,
    },
    conceptIds: [...new Set(request.conceptIds)],
    verification: request.verification ?? "mapped-from-extraction",
    notes: request.notes,
  };
}

export function mergePassageAnchors(existing, incoming) {
  if (!Array.isArray(existing) || !Array.isArray(incoming)) {
    throw new Error("passage anchor registries must be arrays");
  }
  const ids = new Set(existing.map((anchor) => anchor.id));
  for (const anchor of incoming) {
    if (ids.has(anchor.id)) throw new Error(`passage anchor id collision: ${anchor.id}`);
    ids.add(anchor.id);
  }
  return [...structuredClone(existing), ...structuredClone(incoming)];
}
