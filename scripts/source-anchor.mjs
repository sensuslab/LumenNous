import { readFile, mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPassageAnchor,
  mergePassageAnchors,
} from "./source-ingestion-core.mjs";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = join(
  repositoryRoot,
  "src/data/ingested-passage-anchors.json",
);

function absoluteFromCwd(path) {
  return isAbsolute(path) ? path : resolve(process.cwd(), path);
}

function parseArguments(argv) {
  const options = { requestPath: "", documentPath: "", commit: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--document") {
      options.documentPath = argv[index + 1] ?? "";
      index += 1;
    } else if (argument === "--commit") {
      options.commit = true;
    } else if (argument === "--dry-run") {
      options.commit = false;
    } else if (!argument.startsWith("-") && !options.requestPath) {
      options.requestPath = argument;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  if (!options.requestPath || !options.documentPath) {
    console.error(
      "Usage: npm run sources:anchor -- anchor-request.json --document canonical-document.json [--dry-run|--commit]",
    );
    process.exit(1);
  }
  return options;
}

async function replaceAtomically(path, temporaryPath, text) {
  await writeFile(temporaryPath, text, { encoding: "utf8", flag: "wx" });
  await rename(temporaryPath, path);
}

async function commitAnchor(anchor) {
  const originalText = await readFile(registryPath, "utf8");
  const merged = mergePassageAnchors(JSON.parse(originalText), [anchor]);
  const candidatePath = `${registryPath}.${process.pid}.candidate`;
  const rollbackPath = `${registryPath}.${process.pid}.rollback`;
  let registryMutated = false;
  try {
    await replaceAtomically(
      registryPath,
      candidatePath,
      `${JSON.stringify(merged, null, 2)}\n`,
    );
    registryMutated = true;
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
      throw new Error("Passage-anchor content gate failed; the registry was restored.");
    }
  } catch (error) {
    if (registryMutated) {
      await replaceAtomically(registryPath, rollbackPath, originalText);
    }
    await unlink(candidatePath).catch(() => undefined);
    await unlink(rollbackPath).catch(() => undefined);
    throw error;
  }
}

const options = parseArguments(process.argv.slice(2));
const request = JSON.parse(
  await readFile(absoluteFromCwd(options.requestPath), "utf8"),
);
const document = JSON.parse(
  await readFile(absoluteFromCwd(options.documentPath), "utf8"),
);
const anchor = buildPassageAnchor(document, request);
const outputDirectory = join(
  repositoryRoot,
  ".source-workbench",
  document.manifestId,
  "anchors",
);
const outputPath = join(outputDirectory, `${anchor.id}.json`);
const candidatePath = `${outputPath}.${process.pid}.candidate`;
await mkdir(outputDirectory, { recursive: true });
await writeFile(candidatePath, `${JSON.stringify(anchor, null, 2)}\n`, {
  encoding: "utf8",
  flag: "wx",
});
await rename(candidatePath, outputPath);
if (options.commit) await commitAnchor(anchor);
console.log(`${options.commit ? "Committed" : "Prepared"} passage anchor ${anchor.id}.`);
console.log(`Canonical range: ${anchor.structuredLocator.start}${anchor.structuredLocator.end ? ` – ${anchor.structuredLocator.end}` : ""}`);
console.log(`Candidate: ${outputPath}`);
if (!options.commit) {
  console.log(
    "No app registry was changed. Complete source and semantic review before rerunning with --commit.",
  );
}
