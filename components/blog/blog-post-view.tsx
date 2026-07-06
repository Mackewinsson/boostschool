import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getLandingContent } from "@/lib/landing-content";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "@/lib/blog/seo";
import type { BlogPost } from "@/lib/blog/types";
import type { Locale } from "@/lib/locale";
import { externalLinkProps, siteLinks } from "@/lib/site-links";
import { Navbar } from "@/components/landing/navbar";
import { mdxComponents } from "./mdx-components";

type BlogPostViewProps = {
  locale: Locale;
  post: BlogPost;
};

export function BlogPostView({ locale, post }: BlogPostViewProps) {
  const { blogPage, brand, nav, ui } = getLandingContent(locale);
  const bookingLinkProps = externalLinkProps(siteLinks.booking);

  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  const readingTimeLabel = blogPage.readingTimeLabel.replace(
    "{minutes}",
    String(post.readingTimeMinutes),
  );

  const blogPostingLd = blogPostingJsonLd(post);
  const breadcrumbLd = breadcrumbJsonLd(post);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <li>
              <Link href="/" className="transition hover:text-accent">
                {brand.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={siteLinks.blog} className="transition hover:text-accent">
                {blogPage.label}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-fg">{post.title}</li>
          </ol>
        </nav>

        <article>
          <header className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              {blogPage.label}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-base text-fg-muted">{post.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-faint">
              <time dateTime={post.publishedAt}>{formattedDate}</time>
              <span aria-hidden="true">·</span>
              <span>{readingTimeLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{post.author}</span>
            </div>

            {post.tags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-fg-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className="mt-10 border-t border-border pt-10">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>
        </article>

        <div className="mt-12 rounded-2xl border border-brand-from/30 bg-card p-6 text-center">
          <p className="text-base font-semibold text-fg">{blogPage.ctaTitle}</p>
          <p className="mt-2 text-sm text-fg-muted">{blogPage.ctaSubtitle}</p>
          <a
            href={siteLinks.booking}
            className="btn-glow mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-from to-brand-to px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
            {...bookingLinkProps}
          >
            {blogPage.ctaLabel}
          </a>
        </div>

        <Link
          href={siteLinks.blog}
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {blogPage.backToBlogLabel}
        </Link>
      </main>
    </div>
  );
}
