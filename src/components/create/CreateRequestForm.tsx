"use client";

import { useState, type FormEvent, type JSX } from "react";
import Link from "next/link";
import type { Category, EngineRequest } from "@/lib/schemas";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

const OUTPUT_TYPES: Array<{
  id: EngineRequest["outputType"];
  label: string;
  hint: string;
  icon: "book-open" | "spark" | "breath" | "infinity";
}> = [
  { id: "prayer", label: "Prayer", hint: "Words to receive", icon: "book-open" },
  { id: "affirmation", label: "Affirmation", hint: "One line to carry", icon: "spark" },
  { id: "meditation", label: "Meditation", hint: "Quiet steps", icon: "breath" },
  { id: "combined-practice", label: "Combined", hint: "Prayer and practice", icon: "infinity" },
];

const DURATIONS: Array<{ id: EngineRequest["duration"]; label: string }> = [
  { id: "brief", label: "Brief" },
  { id: "five-minutes", label: "5 min" },
  { id: "ten-minutes", label: "10 min" },
  { id: "extended", label: "Extended" },
];

const TONES: Array<{ id: EngineRequest["tone"]; label: string }> = [
  { id: "gentle", label: "Gentle" },
  { id: "direct", label: "Direct" },
  { id: "contemplative", label: "Contemplative" },
  { id: "devotional", label: "Devotional" },
  { id: "grounding", label: "Grounding" },
];

const LANGUAGES: Array<{ id: EngineRequest["languagePreference"]; label: string }> = [
  { id: "source", label: "Source" },
  { id: "creator", label: "Creator" },
  { id: "divine", label: "Divine" },
  { id: "gnostic-terminology", label: "Gnostic terms" },
  { id: "neutral", label: "Neutral spiritual" },
];

const COMMON_AVOIDANCES = [
  { value: "breath", label: "Breath focus" },
  { value: "gnosis", label: "Gnostic terms" },
  { value: "God", label: "The word God" },
] as const;

const MAX_NEED = 600;

export function CreateRequestForm({
  categories,
  onSubmit,
  initialRequest,
}: {
  categories: readonly Category[];
  onSubmit: (request: EngineRequest) => void;
  initialRequest?: EngineRequest;
}): JSX.Element {
  const commonAvoidanceValues = new Set<string>(
    COMMON_AVOIDANCES.map((item) => item.value),
  );
  const [need, setNeed] = useState(initialRequest?.userNeed ?? "");
  const [categoryId, setCategoryId] = useState(initialRequest?.categoryId ?? "not-sure");
  const [outputType, setOutputType] = useState<EngineRequest["outputType"]>(
    initialRequest?.outputType ?? "prayer",
  );
  const [duration, setDuration] = useState<EngineRequest["duration"]>(
    initialRequest?.duration ?? "five-minutes",
  );
  const [tone, setTone] = useState<EngineRequest["tone"]>(
    initialRequest?.tone ?? "gentle",
  );
  const [languagePreference, setLanguagePreference] =
    useState<EngineRequest["languagePreference"]>(
      initialRequest?.languagePreference ?? "source",
    );
  const [avoidances, setAvoidances] = useState<string[]>(
    initialRequest?.avoidances.filter((item) => commonAvoidanceValues.has(item)) ?? [],
  );
  const [customAvoidances, setCustomAvoidances] = useState(
    initialRequest?.avoidances
      .filter((item) => !commonAvoidanceValues.has(item))
      .join(", ") ?? "",
  );
  const [error, setError] = useState("");

  function toggleAvoidance(value: string): void {
    setAvoidances((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (categoryId === "not-sure" && need.trim().length === 0) {
      setError("Add a sentence about what you need, or choose an intention.");
      return;
    }
    setError("");
    const custom = customAvoidances
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onSubmit({
      userNeed: need.trim(),
      categoryId,
      outputType,
      duration,
      tone,
      languagePreference,
      avoidances: [...new Set([...avoidances, ...custom])].slice(0, 20),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" data-accent="violet">
      <ol aria-label="Create flow" className="grid grid-cols-3 border-y border-line py-4">
        {[
          ["1", "Your need"],
          ["2", "Shape it"],
          ["3", "Receive"],
        ].map(([number, label], index) => (
          <li key={number} className={`flex min-w-0 items-center gap-2 ${index > 0 ? "border-l border-line pl-3 sm:pl-5" : ""}`}>
            <span className={`t-meta flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${index === 2 ? "border-[rgba(217,186,133,0.4)] text-gold" : "border-[rgba(167,155,232,0.45)] text-violet"}`}>
              {number}
            </span>
            <span className="truncate font-sans text-xs font-medium text-ink-muted sm:text-sm">{label}</span>
          </li>
        ))}
      </ol>

      <section className="content-surface rounded-md p-5 md:p-6" aria-labelledby="create-need-heading">
        <header className="flex items-start gap-3 border-b border-line pb-4">
          <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.45)] text-violet">1</span>
          <div>
            <p className="t-eyebrow text-violet">Begin here</p>
            <h2 id="create-need-heading" className="t-h3 mt-1 text-ink-strong">Name what you need</h2>
          </div>
        </header>
        <label htmlFor="create-need" className="t-label mt-3 block font-sans text-ink-strong">
          What would you like support with?
        </label>
        <textarea
          id="create-need"
          rows={3}
          maxLength={MAX_NEED}
          value={need}
          onChange={(event) => setNeed(event.target.value)}
          placeholder="I need steadiness before a difficult conversation..."
          className="field-surface mt-3 w-full resize-y rounded-sm p-3 font-sans text-[0.9375rem] text-ink placeholder:text-ink-ghost focus-visible:outline-none"
        />
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="t-body-sm text-ink-faint">A sentence is enough. Names and identifying details are not needed.</p>
          <p className="t-meta shrink-0 text-ink-faint" aria-label={`${need.length} of ${MAX_NEED} characters`}>
            {need.length}/{MAX_NEED}
          </p>
        </div>

        <label htmlFor="create-category" className="t-label mt-5 block font-sans text-ink-strong">Intention</label>
        <div className="relative mt-2">
          <select
            id="create-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="field-surface min-h-12 w-full appearance-none rounded-sm px-3 pr-11 font-sans text-[0.9375rem] text-ink-strong focus-visible:outline-none"
          >
            <option value="not-sure">Choose for me from what I wrote</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        </div>
      </section>

      <section className="content-surface rounded-md p-5 md:p-6" aria-labelledby="shape-practice-heading">
        <header className="flex items-start gap-3 border-b border-line pb-4">
          <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(167,155,232,0.45)] text-violet">2</span>
          <div>
            <p className="t-eyebrow text-violet">Make it yours</p>
            <h2 id="shape-practice-heading" className="t-h3 mt-1 text-ink-strong">Shape the practice</h2>
          </div>
        </header>

        <fieldset className="mt-5">
          <legend className="t-label mb-3 font-sans text-ink-strong">Form</legend>
          <div role="radiogroup" aria-label="Choose a form" className="grid grid-cols-2 gap-2">
            {OUTPUT_TYPES.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={outputType === option.id}
                onClick={() => setOutputType(option.id)}
                className={`field-surface h-[120px] rounded-sm p-3 text-left transition-[border-color,background-color] duration-200 ease-std ${outputType === option.id ? "border-[rgba(167,155,232,0.62)] bg-[rgba(167,155,232,0.12)]" : ""}`}
              >
                <Icon name={option.icon} className={`h-5 w-5 ${outputType === option.id ? "text-violet" : "text-ink-muted"}`} aria-hidden="true" />
                <span className="t-label mt-2 block font-sans text-ink-strong">{option.label}</span>
                <span className="t-body-sm block text-ink-muted">{option.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6 border-t border-line pt-5">
          <legend className="t-label mb-3 font-sans text-ink-strong">Length</legend>
          <div role="radiogroup" aria-label="Choose a length" className="flex flex-wrap gap-2">
            {DURATIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={duration === option.id}
                onClick={() => setDuration(option.id)}
                className="inline-flex min-h-11 items-center rounded-pill focus-visible:outline-none"
              >
                <Chip kind="filter" tone="violet" selected={duration === option.id}>{option.label}</Chip>
              </button>
            ))}
          </div>
        </fieldset>

        <details className="mt-5 border-t border-line pt-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-sans text-[0.9375rem] font-medium text-ink-strong">
            Tone and preferences
            <Icon name="chevron-down" className="h-4 w-4 text-ink-muted" aria-hidden="true" />
          </summary>
          <div className="mt-4 space-y-5 border-t border-line pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="t-label font-sans text-ink-strong">
              Tone
              <select value={tone} onChange={(event) => setTone(event.target.value as EngineRequest["tone"])} className="field-surface mt-2 min-h-12 w-full rounded-sm px-3 font-sans text-[0.9375rem] text-ink focus-visible:outline-none">
                {TONES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
            <label className="t-label font-sans text-ink-strong">
              Sacred language
              <select value={languagePreference} onChange={(event) => setLanguagePreference(event.target.value as EngineRequest["languagePreference"])} className="field-surface mt-2 min-h-12 w-full rounded-sm px-3 font-sans text-[0.9375rem] text-ink focus-visible:outline-none">
                {LANGUAGES.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <fieldset>
            <legend className="t-label font-sans text-ink-strong">Leave out</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {COMMON_AVOIDANCES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={avoidances.includes(option.value)}
                  onClick={() => toggleAvoidance(option.value)}
                  className="inline-flex min-h-11 items-center rounded-pill focus-visible:outline-none"
                >
                  <Chip kind="filter" tone="violet" selected={avoidances.includes(option.value)}>{option.label}</Chip>
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="create-avoidances" className="t-label block font-sans text-ink-strong">
            Other words or themes
            <input id="create-avoidances" type="text" maxLength={200} value={customAvoidances} onChange={(event) => setCustomAvoidances(event.target.value)} placeholder="Separated by commas" className="field-surface mt-2 min-h-12 w-full rounded-sm px-3 font-sans text-[0.9375rem] text-ink placeholder:text-ink-ghost focus-visible:outline-none" />
          </label>
          </div>
        </details>
      </section>

      <section className="content-surface rounded-md border-[rgba(217,186,133,0.28)] p-5 md:p-6" aria-labelledby="receive-practice-heading">
        <header className="flex items-start gap-3">
          <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(217,186,133,0.45)] text-gold">3</span>
          <div>
            <p className="t-eyebrow text-gold">Ready when you are</p>
            <h2 id="receive-practice-heading" className="t-h3 mt-1 text-ink-strong">Receive your practice</h2>
            <p className="t-body-sm mt-2 text-ink-muted">Your choices will be assembled from the reviewed LumenNous library.</p>
          </div>
        </header>

        <aside className="mt-5 border-t border-line pt-5">
          <div className="flex items-start gap-3">
            <Icon name="shield-quiet" className="mt-0.5 h-5 w-5 shrink-0 text-violet" aria-hidden="true" />
            <div>
              <p className="t-label font-sans text-ink-strong">Private by design</p>
              <p className="t-body-sm mt-1 text-ink-muted">
                Your words stay on this device and are discarded after this composition. LumenNous keeps only content IDs and cycle counts to reduce repetition.
              </p>
              <Link href="/privacy#local-engine" className="t-body-sm mt-2 inline-flex min-h-11 items-center text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline">Read the privacy details</Link>
            </div>
          </div>
        </aside>

        <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-pearl-fill px-6 font-sans text-[0.9375rem] font-semibold text-bg-1 transition-[transform,background-color] duration-200 ease-std hover:bg-pearl-fill-hover active:scale-[0.98]">
          Assemble my {outputType === "combined-practice" ? "practice" : outputType}
        </button>
        {error ? <p role="alert" className="t-body-sm mt-3 text-warn">{error}</p> : null}
      </section>
    </form>
  );
}
