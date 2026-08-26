import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeReviewRecords } from "./editorial-review-registry.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(repositoryRoot, "src/data/editorial-reviews.json");
const inputArgument = process.argv[2];

if (!inputArgument || process.argv.length !== 3) {
  console.error("Usage: npm run editorial:ingest -- path/to/review.json");
  process.exit(1);
}

const inputPath = isAbsolute(inputArgument)
  ? inputArgument
  : resolve(process.cwd(), inputArgument);
const originalText = await readFile(registryPath, "utf8");
const existing = JSON.parse(originalText);
const importedValue = JSON.parse(await readFile(inputPath, "utf8"));
const incoming = Array.isArray(importedValue) ? importedValue : [importedValue];
const merged = mergeReviewRecords(existing, incoming);
const candidateText = `${JSON.stringify(merged, null, 2)}\n`;
const candidatePath = `${registryPath}.${process.pid}.candidate`;
const rollbackPath = `${registryPath}.${process.pid}.rollback`;

async function replaceAtomically(path, temporaryPath, text) {
  await writeFile(temporaryPath, text, { encoding: "utf8", flag: "wx" });
  await rename(temporaryPath, path);
}

try {
  await replaceAtomically(registryPath, candidatePath, candidateText);
  const gate = spawnSync(
    process.execPath,
    [
      "node_modules/vitest/vitest.mjs",
      "run",
      "src/lib/__tests__/schemas.test.ts",
      "src/lib/__tests__/editorial-workspace.test.ts",
    ],
    { cwd: repositoryRoot, stdio: "inherit" },
  );
  if (gate.error || gate.status !== 0) {
    await replaceAtomically(registryPath, rollbackPath, originalText);
    if (gate.error) console.error(gate.error.message);
    throw new Error("Editorial content gate failed; the review registry was restored.");
  }
} catch (error) {
  await unlink(candidatePath).catch(() => undefined);
  await unlink(rollbackPath).catch(() => undefined);
  throw error;
}

console.log(`Ingested ${incoming.length} editorial review record(s).`);
console.log(
  "Next: change each matching subject editorialStatus in the same reviewed branch or pull request, then run npm run check.",
);
