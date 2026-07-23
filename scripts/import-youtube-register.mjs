import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultSourcePath = path.resolve(
  root,
  "Music/Research/corpus/media_research/youtube_audio_register_expanded.csv",
);
const sourcePath = path.resolve(process.argv[2] ?? defaultSourcePath);
const outputPath = path.resolve(root, "src/data/corpus/youtube_audio_register.json");

const EXPECTED_HEADERS = [
  "id",
  "title",
  "channel",
  "channel_type",
  "url",
  "duration",
  "published",
  "views_checked",
  "description_summary",
  "language",
  "tradition_genre",
  "intended_categories",
  "playlist_fit",
  "evidence_label",
  "claim_risk",
  "rights_status",
  "embed_or_link",
  "last_checked",
  "readiness_state",
  "notes",
];

const source = await readFile(sourcePath, "utf8");
const rows = parse(source, {
  bom: true,
  skip_empty_lines: true,
  trim: true,
});

if (rows.length < 2) {
  throw new Error("The music register must contain a header and at least one record.");
}

const [headers, ...records] = rows;
if (
  headers.length !== EXPECTED_HEADERS.length ||
  headers.some((header, index) => header !== EXPECTED_HEADERS[index])
) {
  throw new Error(
    `Expected the exact 20-column music register header:\n${EXPECTED_HEADERS.join(",")}`,
  );
}

function splitList(value) {
  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function youtubeId(url) {
  const parsed = new URL(url);
  if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(parsed.hostname)) {
    throw new Error(`Unsupported YouTube host: ${url}`);
  }

  const candidates =
    parsed.hostname === "youtu.be"
      ? [parsed.pathname.split("/").filter(Boolean)[0]]
      : [
          parsed.searchParams.get("v"),
          parsed.pathname.match(/^\/(?:live|embed|shorts)\/([A-Za-z0-9_-]{11})(?:\/|$)/)?.[1],
        ];
  const id = candidates.find(
    (candidate) => typeof candidate === "string" && /^[A-Za-z0-9_-]{11}$/.test(candidate),
  );
  if (!id) throw new Error(`Invalid YouTube URL: ${url}`);
  return id;
}

function parseNullableInteger(value, label, id) {
  if (value === "" || value.toLowerCase() === "unknown") return null;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${id}: ${label} must be a non-negative integer or "unknown".`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${id}: ${label} exceeds the supported integer range.`);
  }
  return parsed;
}

function parseDurationSeconds(value, id) {
  if (value === "" || ["unknown", "live"].includes(value.toLowerCase())) return null;
  const parts = value.split(":");
  if (
    (parts.length !== 2 && parts.length !== 3) ||
    parts.some((part) => !/^\d+$/.test(part))
  ) {
    throw new Error(`${id}: duration must be MM:SS, HH:MM:SS, "live" or "unknown".`);
  }

  const numbers = parts.map(Number);
  const [hours, minutes, seconds] =
    numbers.length === 3 ? numbers : [0, numbers[0], numbers[1]];
  if (minutes >= 60 || seconds >= 60) {
    throw new Error(`${id}: duration contains an invalid minute or second value.`);
  }
  return hours * 3600 + minutes * 60 + seconds;
}

function frequencyLabels(...values) {
  const labels = new Set();
  for (const value of values) {
    for (const match of value.matchAll(/\b(\d+(?:\.\d+)?)\s*hz\b/gi)) {
      labels.add(Number(match[1]));
    }
  }
  return [...labels].sort((left, right) => left - right);
}

const seenIds = new Set();
const items = records.map((row, index) => {
  if (row.length !== EXPECTED_HEADERS.length) {
    throw new Error(
      `Row ${index + 2} (${row[0] ?? "unknown"}) has ${row.length} columns; expected 20.`,
    );
  }

  const record = Object.fromEntries(headers.map((header, column) => [header, row[column]]));
  if (seenIds.has(record.id)) throw new Error(`Duplicate music register id: ${record.id}`);
  seenIds.add(record.id);

  return {
    id: record.id,
    family: record.id.split("-")[0],
    title: record.title,
    channel: record.channel,
    channelType: record.channel_type,
    url: record.url,
    youtubeId: youtubeId(record.url),
    durationSeconds: parseDurationSeconds(record.duration, record.id),
    published: record.published,
    viewsChecked: parseNullableInteger(record.views_checked, "views_checked", record.id),
    descriptionSummary: record.description_summary,
    language: record.language,
    traditionGenre: record.tradition_genre,
    intendedCategories: splitList(record.intended_categories),
    playlistFit: record.playlist_fit,
    evidenceLabel: record.evidence_label,
    claimRisk: record.claim_risk,
    rightsStatus: record.rights_status,
    playbackMode: record.embed_or_link,
    lastChecked: record.last_checked,
    readinessState: record.readiness_state,
    notes: record.notes,
    frequenciesHz: frequencyLabels(
      record.title,
      record.tradition_genre,
      record.description_summary,
    ),
  };
});

items.sort((left, right) => left.id.localeCompare(right.id));

const idsByUrl = new Map();
for (const item of items) {
  const ids = idsByUrl.get(item.url) ?? [];
  ids.push(item.id);
  idsByUrl.set(item.url, ids);
}
const duplicateUrls = [...idsByUrl.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([url, ids]) => ({ url, ids: [...ids].sort() }))
  .sort((left, right) => left.url.localeCompare(right.url));

const snapshot = {
  source: path.relative(root, sourcePath).split(path.sep).join("/"),
  total: items.length,
  duplicateUrls,
  items,
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(
  `Imported ${items.length} music records with ${duplicateUrls.length} duplicate URL group(s) to ${path.relative(root, outputPath)}.`,
);
