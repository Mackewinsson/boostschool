import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-fg first:mt-0 sm:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-2xl font-bold text-fg sm:text-3xl">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-xl font-semibold text-fg">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-base leading-relaxed text-fg-muted">{children}</p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-alt"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href ?? "#"}
        className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-accent-alt"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-fg-muted">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-fg-muted">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-brand-from/40 pl-4 text-fg italic">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-card px-1.5 py-0.5 text-sm text-accent">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card p-4 text-sm text-fg">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-fg">{children}</strong>
  ),
  hr: () => <hr className="my-10 border-border" />,
};
