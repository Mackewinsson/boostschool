import Link from "next/link";
import { getLandingContent } from "@/lib/landing-content";
import type { BlogPostMeta } from "@/lib/blog/types";
import type { Locale } from "@/lib/locale";
import { Navbar } from "@/components/landing/navbar";
import { BlogCard } from "./blog-card";

type BlogIndexViewProps = {
  locale: Locale;
  posts: BlogPostMeta[];
};

export function BlogIndexView({ locale, posts }: BlogIndexViewProps) {
  const { blogPage, brand, nav, ui } = getLandingContent(locale);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Navbar locale={locale} brand={brand} nav={nav} ui={ui} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition hover:text-accent"
        >
          <span aria-hidden="true">←</span>
          {blogPage.backLabel}
        </Link>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">
          {blogPage.label}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          {blogPage.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-fg-muted">{blogPage.subtitle}</p>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-sm text-fg-muted">{blogPage.emptyLabel}</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                readMoreLabel={blogPage.readMoreLabel}
                readingTimeLabel={blogPage.readingTimeLabel}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
