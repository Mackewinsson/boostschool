import type { LinkedLine } from "@/lib/landing-content/types";
import { externalLinkProps, resolveHrefKey } from "@/lib/site-links";

type LinkedLineProps = {
  line: LinkedLine;
  className?: string;
  linkClassName?: string;
};

export function LinkedLineText({
  line,
  className,
  linkClassName = "font-medium text-accent transition hover:text-accent-alt",
}: LinkedLineProps) {
  if (line.plain) {
    return <span className={className}>{line.plain}</span>;
  }

  const href = line.link ? resolveHrefKey(line.link.hrefKey) : "#";

  return (
    <span className={className}>
      {line.before}
      {line.link && (
        <a href={href} className={linkClassName} {...externalLinkProps(href)}>
          {line.link.label}
        </a>
      )}
      {line.after}
    </span>
  );
}

export function linkedLineKey(line: LinkedLine, index: number): string {
  return line.plain ?? `${line.before ?? ""}-${line.link?.label ?? ""}-${index}`;
}
