"use client";

import { useId, useState, type JSX } from "react";
import type { PassageAnchor, Source } from "@/lib/schemas";
import { classificationChip } from "./SourceBadge";
import { Icon } from "@/components/ui/Icon";

/**
 * SourceDrawer (design.md §6.13) — a calm disclosure listing the sources
 * behind a prayer, practice or teaching, with citations and classifications.
 * Native <details>-free implementation for animation + aria control.
 */

export function SourceDrawer({
  sources,
  anchors = [],
  heading = "Sources and further reading",
  className = "",
}: {
  sources: readonly Source[];
  anchors?: readonly PassageAnchor[];
  heading?: string;
  className?: string;
}): JSX.Element | null {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (sources.length === 0) return null;

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 py-2 font-sans text-[0.9375rem] font-medium text-ink-muted transition-colors duration-200 ease-std hover:text-ink-strong"
      >
        <Icon name="book-open" className="h-4 w-4" aria-hidden="true" />
        {heading}
        <span className="t-meta text-ink-faint">{sources.length}</span>
        <Icon
          name="chevron-down"
          className={`h-4 w-4 transition-transform duration-200 ease-std ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul id={panelId} className="mt-2 space-y-3 border-l border-line-subtle pl-4">
          {sources.map((source) => {
            const chip = classificationChip(source.claimClassification);
            const sourceAnchors = anchors.filter(
              (anchor) => anchor.sourceId === source.id,
            );
            return (
              <li key={source.id} className="t-body-sm text-ink-muted">
                <span className="t-meta mr-2 inline-block rounded-xs border border-line-subtle px-1.5 py-0.5 uppercase text-ink-faint">
                  {chip.classification}
                </span>
                <span className="text-ink">{source.title}</span>
                {source.author ? <span> — {source.author}</span> : null}
                {source.year ? <span className="text-ink-faint"> ({source.year})</span> : null}
                <span className="block text-ink-faint">{chip.text}</span>
                {source.citation ? (
                  <span className="block text-ink-faint">{source.citation}</span>
                ) : null}
                {sourceAnchors.length > 0 ? (
                  <ul
                    aria-label={`Passage map for ${source.title}`}
                    className="mt-2 space-y-2 rounded-sm border border-line-subtle bg-[rgba(255,255,255,0.018)] p-3"
                  >
                    {sourceAnchors.map((anchor) => (
                      <li key={anchor.id}>
                        <span className="t-meta block uppercase tracking-wider text-violet">
                          Passage map · {anchor.verification.replaceAll("-", " ")}
                        </span>
                        <span className="mt-0.5 block text-ink">
                          {anchor.workTitle} — {anchor.sectionTitle}
                        </span>
                        <span className="block text-ink-faint">{anchor.locator}</span>
                        <span className="mt-1 block text-ink-muted">{anchor.notes}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-violet underline-offset-4 hover:underline"
                  >
                    View reference
                    <Icon name="arrow-up-right" className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
