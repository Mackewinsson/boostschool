import type { ReactNode } from "react";
import { externalLinkProps } from "@/lib/site-links";

const URL_PATTERN = /https?:\/\/[^\s<>"'`]+/gi;

function splitUrl(raw: string): { href: string; trailing: string } {
  const trailingMatch = /[),.;:!?]+$/.exec(raw);
  if (!trailingMatch) {
    return { href: raw, trailing: "" };
  }
  return {
    href: raw.slice(0, raw.length - trailingMatch[0].length),
    trailing: trailingMatch[0],
  };
}

type HomeworkTextProps = {
  text: string;
  testId?: string;
  className?: string;
};

export function HomeworkText({
  text,
  testId,
  className = "whitespace-pre-wrap text-sm leading-relaxed text-fg-muted",
}: HomeworkTextProps) {
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(URL_PATTERN.source, "gi");
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);
  let key = 0;

  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const { href, trailing } = splitUrl(match[0]);
    if (href) {
      nodes.push(
        <a
          key={`hw-link-${key}`}
          href={href}
          className="break-all font-medium text-accent underline-offset-2 hover:underline"
          {...externalLinkProps(href)}
        >
          {href}
        </a>,
      );
      key += 1;
    }
    if (trailing) {
      nodes.push(trailing);
    }
    lastIndex = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return (
    <p data-testid={testId} className={className}>
      {nodes}
    </p>
  );
}
