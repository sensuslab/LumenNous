import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  listActiveCategories,
  listAffirmations,
  listPractices,
  listPrayers,
  listReflectionPrompts,
  listSessionTemplates,
} from "@/lib/content";

/**
 * Drift guard for the standalone promo landing.
 *
 * `public/welcome/index.html` is hand-written static HTML served outside the
 * App Router, so it cannot import the design tokens or the content layer. That
 * makes it the one place in the project where Nocturne values and library
 * counts are duplicated. These tests fail the build the moment the copy stops
 * matching its source, so the duplication stays honest.
 */

const ROOT = path.resolve(__dirname, "../../..");
const WELCOME_PATH = path.join(ROOT, "public/welcome/index.html");
const GLOBALS_PATH = path.join(ROOT, "src/app/globals.css");

const welcomeHtml = readFileSync(WELCOME_PATH, "utf8");
const globalsCss = readFileSync(GLOBALS_PATH, "utf8");

/** Read the first `:root { ... }` declaration block out of a stylesheet. */
function rootBlock(source: string): string {
  const start = source.indexOf(":root {");
  if (start === -1) throw new Error("No :root block found.");
  const end = source.indexOf("}", start);
  return source.slice(start, end);
}

/** Map every `--token: value;` pair in a declaration block. */
function customProperties(block: string): Map<string, string> {
  const properties = new Map<string, string>();
  for (const match of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    properties.set(match[1] as string, (match[2] as string).trim());
  }
  return properties;
}

const appTokens = customProperties(rootBlock(globalsCss));
const welcomeTokens = customProperties(rootBlock(welcomeHtml));

describe("welcome landing design tokens", () => {
  it("copies a meaningful slice of the Nocturne palette", () => {
    /* Guards the guard: if the parse silently returns nothing, the token
       comparison below would vacuously pass. */
    expect(appTokens.size).toBeGreaterThan(40);
    expect(welcomeTokens.size).toBeGreaterThan(25);
  });

  it("matches globals.css for every token it redeclares", () => {
    const drifted: string[] = [];

    for (const [token, value] of welcomeTokens) {
      const appValue = appTokens.get(token);
      /* Font stacks legitimately differ: the app resolves next/font CSS
         variables, the landing names the vendored families directly. */
      if (appValue === undefined || token.startsWith("--font-")) continue;
      if (appValue !== value) drifted.push(`${token}: ${value} (globals.css: ${appValue})`);
    }

    expect(drifted).toEqual([]);
  });

  it("redeclares the accent and surface tokens the landing actually paints with", () => {
    for (const token of [
      "--bg-1",
      "--ink-strong",
      "--ink-muted",
      "--gold",
      "--violet",
      "--safety",
      "--line-subtle",
      "--pearl-fill",
      "--surface-bg",
    ]) {
      expect(welcomeTokens.has(token)).toBe(true);
    }
  });
});

describe("welcome landing library counts", () => {
  /** Pull the numeral out of the stat panel labelled with `label`. */
  function statValue(label: string): number {
    const pattern = new RegExp(
      `<dt[^>]*>${label}</dt>\\s*<dd class="stat__value"[^>]*>(\\d+)</dd>`,
    );
    const match = welcomeHtml.match(pattern);
    if (!match) throw new Error(`No stat panel found for "${label}".`);
    return Number(match[1]);
  }

  it("quotes the same totals the content layer reports", () => {
    expect(statValue("active intentions")).toBe(listActiveCategories().length);
    expect(statValue("reviewed prayers")).toBe(listPrayers().length);
    expect(statValue("affirmations")).toBe(listAffirmations().length);
    expect(statValue("guided practices")).toBe(listPractices().length);
    expect(statValue("reflection prompts")).toBe(listReflectionPrompts().length);
    expect(statValue("coherence sessions")).toBe(listSessionTemplates().length);
  });

  it("quotes the active intention count in prose too", () => {
    expect(welcomeHtml).toContain(`${listActiveCategories().length} intentions`);
  });
});

describe("welcome landing assets and links", () => {
  it("references only vendored fonts that exist in public/", () => {
    const references = [...welcomeHtml.matchAll(/\/fonts\/([a-z0-9-]+\.woff2)/g)].map(
      (match) => match[1] as string,
    );

    expect(references.length).toBeGreaterThan(0);
    for (const file of new Set(references)) {
      expect(existsSync(path.join(ROOT, "public/fonts", file))).toBe(true);
    }
  });

  it("loads no scripts, so it paints before any application code", () => {
    expect(welcomeHtml).not.toMatch(/<script/i);
  });

  it("points into the app and its companion pages", () => {
    expect(welcomeHtml).toContain('href="/"');
    expect(welcomeHtml).toContain('href="/prayer-engine"');
    expect(welcomeHtml).toContain('href="/about"');
    expect(welcomeHtml).toContain('href="/privacy"');
  });
});
