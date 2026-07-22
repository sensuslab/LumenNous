import type { JSX } from "react";
import type { SafetyFlag } from "@/lib/schemas";
import { Icon } from "@/components/ui/Icon";

/**
 * SafetyNotice (design.md §6.15) — proportionate, calm care notes. Warm
 * terracotta accent, never alarm-red; no fear, no metaphysical escalation.
 */

const FLAG_COPY: Partial<Record<SafetyFlag, string>> = {
  "grief-sensitive":
    "Grief is not a problem to solve. Nothing here asks you to feel differently than you do.",
  "mental-health-adjacent":
    "Prayer and meditation can accompany professional care, but never replace it. If things feel heavy, reaching out to someone you trust is a strong step.",
  "medical-adjacent":
    "Nothing here is medical advice. Please keep following the guidance of your care professionals.",
  "financial-adjacent":
    "This practice offers perspective, not financial promises or advice.",
  "relationship-adjacent":
    "Your safety matters more than any relationship. If you are being hurt, support from people you trust — or specialist services — is encouraged.",
  "abuse-adjacent":
    "If you are experiencing harm, this space supports you — and so do people and services trained for exactly this. Reaching out is encouraged.",
};

export function SafetyNotice({
  flags,
  note,
  className = "",
}: {
  flags: readonly SafetyFlag[];
  /** Optional free-text note from content (prayer/practice safetyNotes). */
  note?: string;
  className?: string;
}): JSX.Element | null {
  const messages = flags
    .filter((flag) => flag !== "none")
    .map((flag) => FLAG_COPY[flag])
    .filter((copy): copy is string => typeof copy === "string");

  if (note && note.trim().length > 0) messages.push(note);
  if (messages.length === 0) return null;

  return (
    <aside
      aria-label="A gentle note before you begin"
      className={`rounded-md border border-[rgba(232,180,160,0.3)] bg-[rgba(232,180,160,0.05)] p-4 ${className}`}
    >
      <p className="flex items-center gap-2 font-sans text-sm font-semibold text-safety">
        <Icon name="info" className="h-4 w-4" aria-hidden="true" />
        A gentle note
      </p>
      <ul className="t-body-sm mt-2 space-y-1.5 text-ink-muted">
        {messages.map((message) => (
          <li key={message.slice(0, 40)}>{message}</li>
        ))}
      </ul>
    </aside>
  );
}
