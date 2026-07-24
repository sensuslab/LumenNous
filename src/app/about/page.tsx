import Link from "next/link";
import type { JSX } from "react";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Divider } from "@/components/ui/Divider";
import { OrbitMark } from "@/components/celestial/OrbitMark";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { ReplayIntroductionButton } from "@/components/chrome/ReplayIntroductionButton";

/**
 * About — `/about` (about.md). The spiritual framework, methodology and
 * boundaries, in plain language.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "The LumenNous framework, methodology and boundaries: a modern synthesis, honestly labelled.",
};

function ProseH2({ id, children }: { id?: string; children: React.ReactNode }): JSX.Element {
  return (
    <h2 id={id} className="t-h2 border-b border-line-subtle pb-3 text-ink-strong">
      {children}
    </h2>
  );
}

export default function AboutPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="gold" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <header className="mt-8 text-center">
          <OrbitMark size={200} className="mx-auto opacity-50" />
          <p className="t-eyebrow mt-8 text-gold">A quiet engine for an old practice</p>
          <h1 className="t-display mt-3 text-ink-strong">LumenNous</h1>
          <p className="t-prayer-sm mx-auto mt-5 max-w-[44ch] italic text-ink">
            LumenNous exists to make one thing easy: sitting down, right
            now, with words worth praying — no account, no feed, no streak.
            Just the practice.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          <GlassCard>
            <p className="t-eyebrow text-gold">It is</p>
            <ul className="t-body-sm mt-4 space-y-3 text-ink-muted">
              <li>A free library of prayers, affirmations, practices and listening.</li>
              <li>A Create flow that uses the configured AI service inside clear safety boundaries.</li>
              <li>A quiet room that works in seconds, offline-friendly, account-free.</li>
            </ul>
          </GlassCard>
          <GlassCard>
            <p className="t-eyebrow text-ink-faint">It is not</p>
            <ul className="t-body-sm mt-4 space-y-3 text-ink-muted">
              <li>Not a church, teacher or authority — and not a replacement for one.</li>
              <li>Not medical, psychological or crisis care.</li>
              <li>Not a tracker: no streaks, scores, profiles or feeds.</li>
            </ul>
          </GlassCard>
        </div>

        <section aria-labelledby="framework" className="mt-14 space-y-10">
          <div>
            <ProseH2 id="framework">Where we draw from</ProseH2>
            <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
              The library names its debts specifically: Gnostic ideas — the
              Source or Monad, the aeons, gnosis as inner knowing — alongside
              contemplative prayer traditions, psalmody, breath practice and
              sacred music. These are deep wells, and we draw carefully.
            </p>
          </div>
          <div>
            <ProseH2>Many traditions, no single throne</ProseH2>
            <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
              Early Gnostic traditions differed from one another, sometimes
              profoundly. What this app offers is <em className="text-ink">a</em> modern
              synthesis, clearly labelled as such — never presented as the
              uncontested teaching of history. Historical texts, modern
              interpretations and symbolic language are distinguished on every
              item.
            </p>
          </div>
          <div>
            <ProseH2>Experience over explanation</ProseH2>
            <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
              The product centres practice, not doctrine. Reflection prompts
              never demand written answers; there is no journal, no streak,
              nothing to perform. You sit, you receive, you continue your own
              exploration.
            </p>
          </div>
          <div>
            <ProseH2>Who tends the library</ProseH2>
            <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
              Content is researched, drafted and reviewed by editors. Seed
              material is marked &ldquo;draft editorial content under
              review&rdquo; until its final pass. Sources are real and cited;
              nothing is invented.
            </p>
          </div>
        </section>

        <section aria-labelledby="methodology" className="mt-14">
          <ProseH2 id="methodology">How content is made</ProseH2>
          <ol className="mt-6 space-y-8">
            {[
              {
                n: "01",
                title: "Curate",
                body: "Sources are gathered, classified (historical / modern / research) and quoted only with real citations.",
              },
              {
                n: "02",
                title: "Compose",
                body: "Editors write the library and safety boundaries. In this test build, Create sends your request to the configured AI service and asks for a bounded original composition. Fixed safety responses still bypass generation.",
              },
              {
                n: "03",
                title: "Check",
                body: "Every item carries labels; frequency claims carry evidence wording; unsafe requests receive care, not content.",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-5">
                <span aria-hidden="true" className="font-mono text-4xl leading-none text-ink-ghost">
                  {step.n}
                </span>
                <div>
                  <h3 className="t-h3 text-ink-strong">{step.title}</h3>
                  <p className="t-body-sm mt-2 max-w-[52ch] text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="coherence-method" className="mt-14">
          <ProseH2 id="coherence-method">
            The embodied coherence method
          </ProseH2>
          <p className="t-body mt-4 max-w-[62ch] text-ink-muted">
            Our Quantum Prayer sessions preserve a reviewed five-stage
            sequence from the supplied methodology while making its safety and
            evidence boundaries explicit.
          </p>
          <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {[
              ["Regulate", "60s", "Easy 4–2–6 counts or natural breath"],
              ["Embody", "30s", "Support, posture, shoulders and jaw"],
              ["Evoke", "30s", "A believable quality; always optional"],
              ["Articulate", "30s", "One intention, spoken three times"],
              ["Release", "30s", "Gratitude without gripping the result"],
            ].map(([title, time, body], index) => (
              <li
                key={title}
                className="rounded-sm border border-line-subtle p-3"
              >
                <p className="t-meta text-violet">
                  {index + 1} · {time}
                </p>
                <h3 className="t-label mt-1 font-sans text-ink-strong">
                  {title}
                </h3>
                <p className="t-meta mt-2 text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="t-body-sm mt-5 max-w-[62ch] text-ink-muted">
            Here, coherence means aligning breath, body, attention, words and
            action. “Quantum” is contemplative metaphor—not evidence that
            thought collapses reality, changes probability or controls another
            person. Emotional evocation may be skipped, the breath count may be
            dropped, and no session guarantees an external outcome.
          </p>
          <Link
            href="/sessions"
            className="t-body-sm mt-3 inline-flex min-h-11 items-center font-sans font-medium text-violet underline-offset-4 hover:underline"
          >
            Review and begin the five session variants
          </Link>
        </section>

        <section aria-labelledby="boundaries" className="mt-14">
          <ProseH2 id="boundaries">Boundaries &amp; quiet commitments</ProseH2>
          <ul className="t-body mt-4 max-w-[62ch] space-y-3 text-ink-muted">
            <li>No prayer, practice or piece of music here replaces professional medical or psychological care.</li>
            <li>Reviewed listening is optional music-supported prayer, not professional music therapy; silence is always a complete choice.</li>
            <li>Nothing promises guaranteed healing, wealth, protection or manifestation — and suffering is never blamed on insufficient belief.</li>
            <li>We never diagnose spiritual attack, possession or contamination, and random library picks are never presented as messages from beyond.</li>
            <li>If you arrive in distress, you will be met with grounding and encouragement toward trusted, human support — not with metaphysical escalation.</li>
            <li>No fear is used to keep you here. You can leave any time, and you are free to take only what serves you.</li>
          </ul>
        </section>

        <div className="mt-12 flex justify-center">
          <ReplayIntroductionButton />
        </div>

        <Divider className="my-12" />

        <p className="t-body-sm text-center text-ink-muted">
          Questions about data? Read{" "}
          <Link href="/privacy" className="text-violet underline-offset-4 hover:underline">
            Privacy, in plain language
          </Link>
          .
        </p>
      </div>
    </>
  );
}
