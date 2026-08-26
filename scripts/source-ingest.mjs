import { readFile, mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  mergeSourceRegistries,
  parseSourceBuffer,
  redactCanonicalDocument,
  validateSourceManifest,
} from "./source-ingestion-core.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRegistryPath = join(repositoryRoot, "src/data/ingested-sources.json");
const editionRegistryPath = join(repositoryRoot, "src/data/source-editions.json");

function usage() {
  console.error(
    "Usage: npm run sources:ingest -- manifest.json --source text.epub [--dry-run|--commit] [--redact-text]",
  );
}

function parseArguments(argv) {
  const options = {
    manifestPath: "",
    sourcePath: "",
    commit: false,
    redactText: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--source") {
      options.sourcePath = argv[index + 1] ?? "";
      index += 1;
    } else if (argument === "--commit") {
      options.commit = true;
    } else if (argument === "--dry-run") {
      options.commit = false;
    } else if (argument === "--redact-text") {
      options.redactText = true;
    } else if (!argument.startsWith("-") && !options.manifestPath) {
      options.manifestPath = argument;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!options.manifestPath || !options.sourcePath) {
    usage();
    process.exit(1);
  }
  return options;
}

function absoluteFromCwd(path) {
  return isAbsolute(path) ? path : resolve(process.cwd(), path);
}

async function replaceAtomically(path, temporaryPath, text) {
  await writeFile(temporaryPath, text, { encoding: "utf8", flag: "wx" });
  await rename(temporaryPath, path);
}

async function commitRegistries(manifest) {
  const originalSources = await readFile(sourceRegistryPath, "utf8");
  const originalEditions = await readFile(editionRegistryPath, "utf8");
  const merged = mergeSourceRegistries({
    existingSources: JSON.parse(originalSources),
    existingEditions: JSON.parse(originalEditions),
    manifest,
  });
  const nextSources = `${JSON.stringify(merged.sources, null, 2)}\n`;
  const nextEditions = `${JSON.stringify(merged.editions, null, 2)}\n`;
  const temporaryPaths = {
    sourceCandidate: `${sourceRegistryPath}.${process.pid}.candidate`,
    editionCandidate: `${editionRegistryPath}.${process.pid}.candidate`,
    sourceRollback: `${sourceRegistryPath}.${process.pid}.rollback`,
    editionRollback: `${editionRegistryPath}.${process.pid}.rollback`,
  };
  let registriesMutated = false;

  try {
    await replaceAtomically(
      sourceRegistryPath,
      temporaryPaths.sourceCandidate,
      nextSources,
    );
    registriesMutated = true;
    await replaceAtomically(
      editionRegistryPath,
      temporaryPaths.editionCandidate,
      nextEditions,
    );
    const gate = spawnSync(
      process.execPath,
      [
        "node_modules/vitest/vitest.mjs",
        "run",
        "src/lib/__tests__/schemas.test.ts",
        "src/lib/__tests__/source-ingestion.test.ts",
        "src/lib/__tests__/source-foundation.test.ts",
        "src/lib/__tests__/editorial-workspace.test.ts",
      ],
      { cwd: repositoryRoot, stdio: "inherit" },
    );
    if (gate.error || gate.status !== 0) {
      if (gate.error) console.error(gate.error.message);
      throw new Error("Source content gate failed; both registries were restored.");
    }
  } catch (error) {
    if (registriesMutated) {
      try {
        await replaceAtomically(
          sourceRegistryPath,
          temporaryPaths.sourceRollback,
          originalSources,
        );
        await replaceAtomically(
          editionRegistryPath,
          temporaryPaths.editionRollback,
          originalEditions,
        );
      } catch (rollbackError) {
        throw new AggregateError(
          [error, rollbackError],
          "Source ingestion failed and the registry rollback also failed; inspect both JSON registries before continuing.",
        );
      }
    }
    await Promise.all(
      Object.values(temporaryPaths).map((path) =>
        unlink(path).catch(() => undefined),
      ),
    );
    throw error;
  }
}

const options = parseArguments(process.argv.slice(2));
const manifestPath = absoluteFromCwd(options.manifestPath);
const sourcePath = absoluteFromCwd(options.sourcePath);
const manifest = validateSourceManifest(
  JSON.parse(await readFile(manifestPath, "utf8")),
);
const sourceBuffer = await readFile(sourcePath);
const document = parseSourceBuffer(sourceBuffer, manifest, sourcePath);
const outputDocument = options.redactText
  ? redactCanonicalDocument(document)
  : document;
const workbenchDirectory = join(
  repositoryRoot,
  ".source-workbench",
  manifest.id,
);
const outputPath = join(workbenchDirectory, "canonical-document.json");
const outputCandidate = `${outputPath}.${process.pid}.candidate`;
await mkdir(workbenchDirectory, { recursive: true });
await writeFile(outputCandidate, `${JSON.stringify(outputDocument, null, 2)}\n`, {
  encoding: "utf8",
  flag: "wx",
});
await rename(outputCandidate, outputPath);

if (options.commit) {
  await commitRegistries(manifest);
}

const kindCounts = Object.fromEntries(
  [...new Set(document.nodes.map((node) => node.kind))]
    .sort()
    .map((kind) => [
      kind,
      document.nodes.filter((node) => node.kind === kind).length,
    ]),
);
console.log(`${options.commit ? "Committed" : "Prepared"} source ${manifest.id}.`);
console.log(`Input SHA-256: ${document.inputSha256}`);
console.log(`Canonical nodes: ${document.nodes.length} ${JSON.stringify(kindCounts)}`);
console.log(`Private workbench: ${outputPath}`);
for (const warning of document.warnings) console.warn(`Warning: ${warning}`);
if (!options.commit) {
  console.log(
    "No app registry was changed. Review the workbench, then rerun with --commit for a new source and edition.",
  );
}
