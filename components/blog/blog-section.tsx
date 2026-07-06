import Link from "next/link";
import { getLandingContent } from "@/lib/landing-content";
import { getLatestPosts } from "@/lib/blog/posts";
import type { Locale } from "@/lib/locale";
import { siteLinks } from "@/lib/site-links";
import { BlogCard } from "./blog-card";

type BlogSectionProps = {
  locale: Locale;
};

export async function BlogSection({ locale }: BlogSectionProps) {
  const { blogSection } = getLandingContent(locale);
  const posts = await getLatestPosts(locale, 3);

  return (
    <section
      id="blog"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {blogSection.label}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
            {blogSection.title}
          </h2>
        </div>
        <Link
          href={siteLinks.blog}
          className="inline-flex shrink-0 items-center text-sm font-semibold text-accent transition hover:text-accent-alt"
        >
          {blogSection.viewAllLabel}
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-center text-sm text-fg-muted">{blogSection.emptyLabel}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              readMoreLabel={blogSection.readMoreLabel}
              readingTimeLabel={blogSection.readingTimeLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
