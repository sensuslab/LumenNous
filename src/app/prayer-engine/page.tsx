import Link from "next/link";
import type { JSX, ReactNode } from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Divider } from "@/components/ui/Divider";
import { GlassCard } from "@/components/ui/GlassCard";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { OrbitMark } from "@/components/celestial/OrbitMark";
import {
  listActiveCategories,
  listAffirmations,
  listPractices,
  listPrayers,
  listReflectionPrompts,
  listSessionTemplates,
} from "@/lib/content";

/**
 * PrayerEngine — `/prayer-engine`.
 *
 * A single-scroll explainer for the composition engine behind Create
 * (`src/lib/engine.ts`, formerly the "PrayerEngine" working name that still
 * survives in the legacy `pe-*` storage keys). Mobile-first: one column
 * throughout, widening to two or three only from `sm`/`md`.
 *
 * Every count on this page is read from the content layer at build time, so
 * the page cannot drift from the library it describes.
 */

export const metadata: Metadata = {
  title: "PrayerEngine",
  description:
    "PrayerEngine is the on-device composition engine behind LumenNous Create: it classifies a stated need, applies safety routing, filters human-authored editorial material and assembles a structured practice — with no account, no server and no request text stored.",
};

function ProseH2({ id, children }: { id?: string; children: ReactNode }): JSX.Element {
  return (
    <h2 id={id} className="t-h2 border-b border-line-subtle pb-3 text-ink-strong">
      {children}
    </h2>
  );
}

const PIPELINE: ReadonlyArray<{ n: string; title: string; body: string }> = [
  {
    n: "01",
    title: "Validate",
    body: "The request is parsed against a strict schema before anything else happens: need text, intention, output form, duration, tone, language and any avoidances. Malformed input fails here, not halfway through composition.",
  },
  {
    n: "02",
    title: "Route for safety",
    body: "A conservative classifier scans the words for crisis, acute-distress and metaphysical-escalation signals. Anything it flags stops normal composition and returns fixed, human-written support language instead.",
  },
  {
    n: "03",
    title: "Classify the need",
    body: "An explicit intention is always honoured. If you choose “not sure”, the need is scored against the research taxonomy — names, aliases, intentions and descriptions — and the closest active category wins.",
  },
  {
    n: "04",
    title: "Filter the library",
    body: "Candidates are narrowed by output form and duration, ranked for tone and language preference, and anything matching an avoidance you named is removed outright rather than down-weighted.",
  },
  {
    n: "05",
    title: "Apply an optional concept lens",
    body: "If you choose one, the Engine adds a bounded editorial fragment with declared worldview compatibility, passage anchors and its own safety note. A lens outside the chosen worldview or in conflict with an avoidance fails closed.",
  },
  {
    n: "06",
    title: "Draw without repeating",
    body: "Each context keeps its own shuffle bag. Every compatible item is used once before the bag refills, and a refill can never open with the item you just received.",
  },
  {
    n: "07",
    title: "Assemble and re-validate",
    body: "Prayer, affirmation, practice steps and a reflection prompt are composed into one recipe, which is validated again before it reaches the screen. Coherence output keeps its reviewed five-stage order and fixed three-minute core.",
  },
  {
    n: "08",
    title: "Remember almost nothing",
    body: "Only content IDs, cycle counters and short result fingerprints are written to this browser. The words you typed are never stored, never sent anywhere by the local engine, and never used to build a profile.",
  },
];

const CONTROLS: ReadonlyArray<{ label: string; options: string[] }> = [
  {
    label: "Form",
    options: ["Prayer", "Affirmation", "Meditation", "Coherence practice"],
  },
  {
    label: "Length",
    options: ["Brief · 2 min", "5 min", "10 min", "Extended · 15 min"],
  },
  {
    label: "Tone",
    options: ["Gentle", "Direct", "Contemplative", "Devotional", "Grounding"],
  },
  {
    label: "Language",
    options: ["Creator", "Source", "Divine", "Gnostic terms", "Neutral"],
  },
  {
    label: "Worldview profile",
    options: ["Open / universal", "Gnostic", "Esoteric Christian", "Neutral"],
  },
  {
    label: "Concept lens",
    options: ["Open", "Fullness", "Inner light", "Integration", "Purpose", "More"],
  },
];

export default function PrayerEnginePage(): JSX.Element {
  const categoryCount = listActiveCategories().length;
  const prayerCount = listPrayers().length;
  const affirmationCount = listAffirmations().length;
  const practiceCount = listPractices().length;
  const promptCount = listReflectionPrompts().length;
  const sessionCount = listSessionTemplates().length;

  const stats: ReadonlyArray<{ value: string; label: string }> = [
    { value: String(categoryCount), label: "active intentions" },
    { value: String(prayerCount), label: "editorial prayers" },
    { value: String(affirmationCount), label: "affirmations" },
    { value: String(practiceCount), label: "guided practices" },
    { value: String(promptCount), label: "reflection prompts" },
    { value: String(sessionCount), label: "coherence sessions" },
  ];

  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        {/* ---------------------------------------------------------------
            Hero
            --------------------------------------------------------------- */}
        <header className="mt-6 text-center">
          <OrbitMark size={180} className="mx-auto opacity-45" />
          <p className="t-eyebrow mt-8 text-violet">The engine behind Create</p>
          <h1 className="t-display mt-3 text-ink-strong">PrayerEngine</h1>
          <p className="t-prayer-sm mx-auto mt-5 max-w-[42ch] italic text-ink">
            Name what is present, receive a fitting practice, and keep agency
            over what you use.
          </p>
          <p className="t-body mx-auto mt-6 max-w-[54ch] text-ink-muted">
            PrayerEngine is the composition layer inside LumenNous. It turns a
            plainly stated need into a small, structured practice — assembled
            from human-authored material, on your device, in the time it takes to
            press a button.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Button href="/create">Try it in Create</Button>
            <Button href="#how-it-works" variant="secondary">
              See how it works
            </Button>
          </div>
        </header>

        {/* ---------------------------------------------------------------
            Purpose
            --------------------------------------------------------------- */}
        <section aria-labelledby="purpose" className="mt-16">
          <ProseH2 id="purpose">Why it exists</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            A blank page is a poor companion when you are anxious, grieving or
            simply tired. PrayerEngine removes the open-ended task: you say
            what is present, and it returns language, attention and structure
            you can use immediately — without asking you to register, subscribe
            or explain yourself twice.
          </p>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            It is deliberately not an oracle. Selection is bounded and
            explainable, results are never framed as messages meant for you,
            and nothing here claims spiritual authority or a guaranteed
            outcome.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <GlassCard>
              <p className="t-eyebrow text-gold">It does</p>
              <ul className="t-body-sm mt-4 space-y-3 text-ink-muted">
                <li>Classify a need against a researched taxonomy of intentions.</li>
                <li>Assemble human-authored prayers, affirmations, practices and prompts whose draft or review state remains visible.</li>
                <li>Add an optional source-grounded concept lens with explicit worldview and safety boundaries.</li>
                <li>Respect tone, language, length and the things you asked it to avoid.</li>
                <li>Run locally, offline, in under a second.</li>
              </ul>
            </GlassCard>
            <GlassCard>
              <p className="t-eyebrow text-ink-faint">It does not</p>
              <ul className="t-body-sm mt-4 space-y-3 text-ink-muted">
                <li>Diagnose you, or read a random draw as a sign.</li>
                <li>Promise healing, protection, wealth or any external result.</li>
                <li>Replace medical, psychological or crisis care.</li>
                <li>Keep your words, build a profile or track a streak.</li>
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Pipeline
            --------------------------------------------------------------- */}
        <section aria-labelledby="how-it-works" className="mt-16 scroll-mt-24">
          <ProseH2 id="how-it-works">How a request becomes a practice</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Eight steps, all of them synchronous and all of them in your
            browser.
          </p>
          <ol className="mt-8 space-y-8">
            {PIPELINE.map((step) => (
              <li key={step.n} className="flex gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="font-mono text-3xl leading-none text-ink-ghost sm:text-4xl"
                >
                  {step.n}
                </span>
                <div>
                  <h3 className="t-h3 text-ink-strong">{step.title}</h3>
                  <p className="t-body-sm mt-2 max-w-[52ch] text-ink-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------------------------------------------------------
            Controls
            --------------------------------------------------------------- */}
        <section aria-labelledby="controls" className="mt-16">
          <ProseH2 id="controls">What you can steer</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Every control is optional, and every one of them changes what the
            engine is allowed to select. Avoidances are exact: name an image or
            a word you do not want, and matching material is dropped from the
            pool entirely.
          </p>
          <dl className="mt-8 space-y-6">
            {CONTROLS.map((control) => (
              <div key={control.label}>
                <dt className="t-eyebrow text-violet">{control.label}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {control.options.map((option) => (
                    <Chip key={option}>{option}</Chip>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------------------------------------------------------------
            Non-repetition
            --------------------------------------------------------------- */}
        <section aria-labelledby="variety" className="mt-16">
          <ProseH2 id="variety">Variety without randomness theatre</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Familiar structures help; identical results do not. Each
            combination of intention, form, length, tone and language keeps its
            own bag of compatible items. The engine draws from that bag until
            it is empty, then reshuffles — and never opens a new cycle with the
            item you saw last.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Once each", "Every compatible item is offered before any repeats."],
              ["No seam repeat", "A refilled bag cannot begin with the previous draw."],
              ["Bounded", "Cycling is a variety mechanism, never a message or a sign."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-sm border border-line-subtle p-4">
                <h3 className="t-label font-sans text-ink-strong">{title}</h3>
                <p className="t-body-sm mt-2 text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------
            Safety
            --------------------------------------------------------------- */}
        <section aria-labelledby="safety" className="mt-16">
          <ProseH2 id="safety">Safety comes before composition</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            The classifier runs before any content is drawn, and it is
            deliberately conservative: a prayer for courage before an exam is
            not a crisis. When it does flag something, the engine stops and
            hands over to fixed wording written and reviewed by people.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              {
                level: "Crisis",
                body: "Self-harm, suicide, abuse, medical emergency or acute psychosis signals return immediate encouragement toward trusted people and professional help. No assembled content is shown.",
              },
              {
                level: "Escalation risk",
                body: "Language about attack, possession or contamination is met with calm grounding and an explicit refusal to confirm supernatural harm — never with deliverance framing.",
              },
              {
                level: "Distress",
                body: "Heavier emotional wording receives a grounded pause and a gentle pointer toward support, rather than a longer practice.",
              },
            ].map((item) => (
              <li
                key={item.level}
                className="rounded-sm border border-line-subtle p-4 sm:p-5"
              >
                <p className="t-eyebrow text-safety">{item.level}</p>
                <p className="t-body-sm mt-2 max-w-[58ch] text-ink-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="t-body-sm mt-6 max-w-[62ch] text-ink-muted">
            Matched phrases are used in-process only. They are never logged,
            never persisted and never sent anywhere.
          </p>
        </section>

        {/* ---------------------------------------------------------------
            Library
            --------------------------------------------------------------- */}
        <section aria-labelledby="library" className="mt-16">
          <ProseH2 id="library">What it draws from</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Nothing is invented at request time. The engine only arranges
            material that already exists in the editorial library, where every
            item carries its classification — historical text, modern
            interpretation, practitioner tradition, research or LumenNous
            editorial — and its sources.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-sm border border-line-subtle p-4 text-center"
              >
                <dt className="vh">{stat.label}</dt>
                <dd>
                  <span className="block font-serif text-3xl leading-none text-gold tabular-nums lining-nums">
                    {stat.value}
                  </span>
                  <span aria-hidden="true" className="t-meta mt-2 block text-ink-muted">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="t-body-sm mt-6 max-w-[62ch] text-ink-muted">
            Content validation runs at import time. Duplicate IDs, broken
            references, missing category coverage and unsupported evidence
            labels fail the build rather than reaching a screen.
          </p>
        </section>

        {/* ---------------------------------------------------------------
            Privacy
            --------------------------------------------------------------- */}
        <section aria-labelledby="privacy-model" className="mt-16">
          <ProseH2 id="privacy-model">Where your words go</ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Nowhere, for the local engine. Composition happens in the page you
            already loaded — there is no account, no database and no analytics
            behind it.
          </p>
          <ul className="t-body mt-6 max-w-[62ch] space-y-3 text-ink-muted">
            <li>Request text is never written to storage.</li>
            <li>History holds content IDs, cycle counters and short fingerprints only, in this browser.</li>
            <li>You can clear that history at any time from Saved.</li>
            <li>Third-party audio loads only after you explicitly ask for it.</li>
          </ul>
          <GlassCard className="mt-8">
            <p className="t-eyebrow text-gold">The one exception</p>
            <p className="t-body-sm mt-4 max-w-[58ch] text-ink-muted">
              In this test build, choosing to describe a need in your own words
              — rather than picking a specific intention — sends that request
              through a server-side AI boundary for a bounded original
              composition. The key stays on the server, the route is disabled
              unless it is explicitly enabled, and fixed safety responses always
              bypass it. Choose an intention and the flow stays entirely local.
            </p>
          </GlassCard>
        </section>

        {/* ---------------------------------------------------------------
            Status
            --------------------------------------------------------------- */}
        <section aria-labelledby="status" className="mt-16">
          <ProseH2 id="status">Where the development stands</ProseH2>
          <ul className="t-body mt-4 max-w-[62ch] space-y-3 text-ink-muted">
            <li>Classification, filtering, cycling, safety routing and assembly are implemented and unit-tested.</li>
            <li>The three-minute embodied coherence method is versioned, with five daily session variants.</li>
            <li>Generated sessions can be copied or shared, but are not yet saved as complete custom recipes.</li>
            <li>Research snapshots are promoted manually; some seed material is still marked as draft pending final editorial review.</li>
          </ul>
        </section>

        <Divider className="my-14" />

        {/* ---------------------------------------------------------------
            Close
            --------------------------------------------------------------- */}
        <section aria-labelledby="begin" className="text-center">
          <h2 id="begin" className="t-h2 text-ink-strong">
            Start with what is actually present
          </h2>
          <p className="t-body mx-auto mt-4 max-w-[48ch] text-ink-muted">
            No account, no feed, no streak. Name the need and see what the
            engine returns.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            <Button href="/create">Open Create</Button>
            <Button href="/sessions" variant="secondary">
              Begin a coherence session
            </Button>
          </div>
          <p className="t-body-sm mt-8 text-ink-muted">
            More on the method in{" "}
            <Link href="/about" className="text-violet underline-offset-4 hover:underline">
              About
            </Link>{" "}
            and on data in{" "}
            <Link href="/privacy" className="text-violet underline-offset-4 hover:underline">
              Privacy
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
