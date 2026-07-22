import type { JSX } from "react";
import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Divider } from "@/components/ui/Divider";
import { HorizonGlow } from "@/components/celestial/HorizonGlow";

/**
 * Privacy — `/privacy` (privacy.md). Plain language: the app is built so we
 * couldn't know much about you even if we wanted to.
 */

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy in plain language: no account, local-only saved items, on-device composition, and no analytics in this build.",
};

const SECTIONS: { id: string; title: string; body: string }[] = [
  {
    id: "not-collected",
    title: "What we don't collect",
    body: "No accounts, no names, no emails, no location lookups, no contacts, no precise device identifiers. The app genuinely cannot greet you by name — by design.",
  },
  {
    id: "local-storage",
    title: "Local storage — your device, your rules",
    body: "Saved items and display preferences live in your browser's local storage, only after you've been told and can decline. They are not synced, not backed up by us and not visible to us. Clearing browser data removes them. Export is available as JSON from Saved.",
  },
  {
    id: "local-engine",
    title: "The on-device Engine",
    body: "When you create a prayer or meditation, your request is classified and matched entirely in your browser. It is not sent to our server or to an AI provider, and the words are discarded after the composition. Local history contains only content IDs, shuffle bags and cycle counters so the next result is less repetitive.",
  },
  {
    id: "analytics",
    title: "Analytics — off by default",
    body: "This build has no analytics. There are no cross-site trackers, advertising SDKs or fingerprinting scripts. Any future aggregate measurement must remain separate from prayer text, saved content and Create inputs.",
  },
  {
    id: "embeds",
    title: "Third-party embeds",
    body: "Spotify, YouTube and Apple Music players load only when you tap them — before that, those companies receive nothing from you on our pages. Once loaded, their own policies apply; a plain external link is always offered instead.",
  },
  {
    id: "cookies",
    title: "Cookies",
    body: "None for tracking. Strictly necessary storage only: preferences and the offline cache.",
  },
  {
    id: "security",
    title: "Security",
    body: "There are no AI keys or composition credentials because Create does not call an external service. Normal secure hosting protections still apply when the app shell or third-party media links are loaded.",
  },
  {
    id: "sensitive",
    title: "Children & sensitive moments",
    body: "The app asks for nothing personal from anyone, including children. Spiritual distress is treated as sacred privacy: crisis-shaped requests are answered with care and are never stored as data.",
  },
];

export default function PrivacyPage(): JSX.Element {
  return (
    <>
      <HorizonGlow tone="blue" />
      <div className="relative mx-auto w-full max-w-[720px]">
        <header className="mt-6">
          <p className="t-eyebrow text-blue">Privacy, in plain language</p>
          <h1 className="t-h1 mt-2 text-ink-strong">Your business is yours.</h1>
          <p className="t-body mt-3 max-w-[52ch] text-ink-muted">
            LumenNous is built so we couldn&apos;t know much about you even
            if we wanted to. This page explains exactly what happens to your
            words, your saved items and your visit.
          </p>
        </header>

        <GlassCard hero className="mt-8">
          <p className="t-eyebrow text-blue">In short</p>
          <ul className="t-body mt-4 space-y-3 text-ink">
            <li>No account. No name, email or location asked for, ever.</li>
            <li>Saved items live only in your browser. We never see them.</li>
            <li>Create runs on your device. Your request is not sent anywhere.</li>
            <li>This build contains no analytics or advertising trackers.</li>
            <li>Delete local data any time from Saved. It was only ever on your device.</li>
          </ul>
        </GlassCard>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`privacy-${section.id}`}>
              <div className="flex gap-5">
                <span aria-hidden="true" className="font-mono text-4xl leading-none text-ink-ghost">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 id={`privacy-${section.id}`} className="t-h2 text-ink-strong">
                    {section.title}
                  </h2>
                  <p className="t-body mt-3 max-w-[62ch] text-ink-muted">{section.body}</p>
                </div>
              </div>
              {index < SECTIONS.length - 1 ? <Divider className="mt-10 w-3/5" /> : null}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
