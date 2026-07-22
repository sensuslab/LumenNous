import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.resolve(
  root,
  "../Music/Research/corpus/media_research/youtube_audio_register.csv",
);
const outputPath = path.resolve(root, "src/data/corpus/youtube_audio_register.json");

const source = await readFile(sourcePath, "utf8");
const rows = parse(source, {
  skip_empty_lines: true,
  // The research register uses quote marks as prose punctuation rather than
  // RFC 4180 field delimiters. Treating them as text preserves every row.
  quote: false,
  relax_column_count: true,
}).map((row) => row.map((cell) => cell.trim()));

const [headers, ...records] = rows;
if (headers.length !== 20) {
  throw new Error(`Expected 20 register columns, found ${headers.length}.`);
}

function splitList(value) {
  return value
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function youtubeId(url) {
  const parsed = new URL(url);
  const id = parsed.searchParams.get("v");
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) {
    throw new Error(`Invalid YouTube URL: ${url}`);
  }
  return id;
}

function frequencyLabels(...values) {
  const labels = new Set();
  for (const value of values) {
    for (const match of value.matchAll(/\b(\d{2,4})(?:\.\d+)?\s*hz\b/gi)) {
      labels.add(Number.parseInt(match[1], 10));
    }
  }
  return [...labels].sort((a, b) => a - b);
}

const items = records.map((rawRow, index) => {
  const row = [...rawRow];
  // The ten guided-prayer rows omit intended_categories in the source file.
  if (row.length === 19 && String(row[0]).startsWith("GUIDED-")) row.splice(11, 0, "");
  if (row.length !== headers.length) {
    throw new Error(`Row ${index + 2} (${row[0] ?? "unknown"}) has ${row.length} columns.`);
  }

  const record = Object.fromEntries(headers.map((header, column) => [header, row[column]]));
  const family = record.id.split("-")[0];

  return {
    id: record.id,
    family,
    title: record.title,
    channel: record.channel,
    channelType: record.channel_type,
    url: record.url,
    youtubeId: youtubeId(record.url),
    duration: record.duration,
    published: record.published,
    viewsChecked: Number.parseInt(record.views_checked, 10),
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

const snapshot = {
  source: "Music/Research/corpus/media_research/youtube_audio_register.csv",
  total: items.length,
  items,
};

await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Imported ${items.length} music records to ${path.relative(root, outputPath)}.`);
