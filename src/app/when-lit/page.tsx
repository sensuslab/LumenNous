import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "When lit",
  description:
    "A fixed, non-clinical companion path for moments when everything feels amplified.",
};

const STEPS = [
  {
    title: "Name only what is certain",
    body: "Complete one sentence: “What I know for certain right now is …” Leave interpretations and predictions outside it.",
  },
  {
    title: "Reduce the demand",
    body: "If it is safe to wait, postpone life-changing decisions. Choose only the next decision that protects the coming hour.",
  },
  {
    title: "Choose company",
    body: "Contact one trusted person or qualified service. A plain message is enough: “Things feel amplified and I need company deciding the next safe step.”",
  },
] as const;

export default function WhenLitPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="violet" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <header className="mt-6">
          <p className="t-eyebrow text-safety">Fixed companion path</p>
          <h1 className="t-h1 mt-2 text-ink-strong">When the system is lit</h1>
          <p className="t-body mt-3 max-w-[58ch] text-ink-muted">
            This is companionship, not treatment or diagnosis. You do not need to finish a practice, find a spiritual explanation or force calm.
          </p>
        </header>

        <GlassCard hero className="mt-8 border-[rgba(232,180,160,0.32)]">
          <p className="t-eyebrow text-safety">For the next hour</p>
          <ol className="mt-5 space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span aria-hidden="true" className="t-meta flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(232,180,160,0.38)] text-safety">
                  {index + 1}
                </span>
                <div>
                  <h2 className="t-h3 text-ink-strong">{step.title}</h2>
                  <p className="t-body-sm mt-2 text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </GlassCard>

        <section aria-labelledby="urgent-help" className="mt-8 rounded-md border border-[rgba(232,180,160,0.4)] bg-[rgba(232,180,160,0.055)] p-6">
          <h2 id="urgent-help" className="t-h2 text-ink-strong">If safety cannot wait</h2>
          <p className="t-body-sm mt-3 text-ink-muted">
            If you may hurt yourself or someone else, are in immediate danger, or have a medical emergency, contact local emergency services now. If possible, tell a trusted person and ask them to stay in contact with you.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a href="tel:116123" className="inline-flex min-h-14 flex-col items-center justify-center rounded-sm bg-pearl-fill px-4 py-2 text-center font-sans font-semibold text-bg-1 hover:bg-pearl-fill-hover">
              <span>Call Samaritans</span>
              <span className="text-xs font-medium">UK &amp; Ireland · 116 123</span>
            </a>
            <a href="tel:988" className="glass inline-flex min-h-14 flex-col items-center justify-center rounded-sm px-4 py-2 text-center font-sans font-semibold text-ink-strong hover:border-line-strong">
              <span>Call or text 988</span>
              <span className="text-xs font-medium text-ink-muted">United States &amp; territories</span>
            </a>
          </div>
          <p className="t-meta mt-4 text-ink-faint">
            Outside these regions, use your local emergency number or crisis service.
          </p>
        </section>

        <Link href="/" className="t-body-sm mt-6 inline-flex min-h-11 items-center text-ink-muted underline-offset-4 hover:text-ink-strong hover:underline">
          Return to Today
        </Link>
      </div>
    </>
  );
}
