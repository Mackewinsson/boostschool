import type { LinkedLine } from "@/lib/landing-content/types";
import { externalLinkProps, resolveHrefKey } from "@/lib/site-links";

type LinkedLineProps = {
  line: LinkedLine;
  className?: string;
  linkClassName?: string;
};

function LineLink({
  link,
  className,
}: {
  link: NonNullable<LinkedLine["link"]>;
  className: string;
}) {
  const href = resolveHrefKey(link.hrefKey);
  return (
    <a href={href} className={className} {...externalLinkProps(href)}>
      {link.label}
    </a>
  );
}

export function LinkedLineText({
  line,
  className,
  linkClassName = "font-medium text-accent transition hover:text-accent-alt",
}: LinkedLineProps) {
  if (line.plain) {
    return <span className={className}>{line.plain}</span>;
  }

  return (
    <span className={className}>
      {line.before}
      {line.link ? <LineLink link={line.link} className={linkClassName} /> : null}
      {line.mid}
      {line.link2 ? (
        <LineLink link={line.link2} className={linkClassName} />
      ) : null}
      {line.after}
    </span>
  );
}

export function linkedLineKey(line: LinkedLine, index: number): string {
  return (
    line.plain ??
    `${line.before ?? ""}-${line.link?.label ?? ""}-${line.link2?.label ?? ""}-${index}`
  );
}
