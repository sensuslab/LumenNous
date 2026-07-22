import { Fragment, type JSX, type ReactNode } from "react";

/**
 * Minimal, dependency-free markdown renderer for teaching guides.
 * Supports: ## / ### headings, paragraphs, **bold**, *italic*, - lists,
 * and [label](url) links. Input is our own editorial content (never raw
 * user input), so this stays deliberately small.
 */

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Split on links first, then emphasis inside the fragments.
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const pushEmphasis = (fragment: string): void => {
    const parts = fragment.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**")) {
        nodes.push(
          <strong key={key++} className="font-semibold text-ink-strong">
            {part.slice(2, -2)}
          </strong>,
        );
      } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        nodes.push(<em key={key++}>{part.slice(1, -1)}</em>);
      } else if (part) {
        nodes.push(<Fragment key={key++}>{part}</Fragment>);
      }
    }
  };

  while ((match = linkPattern.exec(text)) !== null) {
    pushEmphasis(text.slice(lastIndex, match.index));
    const label = match[1] ?? "";
    const url = match[2] ?? "";
    const external = /^https?:\/\//.test(url);
    nodes.push(
      <a
        key={key++}
        href={url}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-violet underline-offset-4 hover:underline"
      >
        {label}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  pushEmphasis(text.slice(lastIndex));
  return nodes;
}

export function Markdown({ body, className = "" }: { body: string; className?: string }): JSX.Element {
  const blocks = body.split(/\n{2,}/);
  return (
    <div className={`space-y-4 ${className}`}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="t-h3 mt-6 text-ink-strong">
              {renderInline(trimmed.slice(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="t-h2 mt-8 text-ink-strong">
              {renderInline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").filter((line) => line.trim().startsWith("- "));
          return (
            <ul key={index} className="t-body list-disc space-y-1.5 pl-5 text-ink-muted">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item.trim().slice(2))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="t-body text-ink-muted">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
