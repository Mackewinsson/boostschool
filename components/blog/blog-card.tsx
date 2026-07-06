import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/types";

type BlogCardProps = {
  post: BlogPostMeta;
  readMoreLabel: string;
  readingTimeLabel: string;
};

export function BlogCard({ post, readMoreLabel, readingTimeLabel }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <article className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-from/25 hover:bg-card-hover">
      <time
        dateTime={post.publishedAt}
        className="text-xs font-medium uppercase tracking-wider text-fg-faint"
      >
        {formattedDate}
      </time>
      <h3 className="mt-3 text-lg font-semibold text-fg transition group-hover:text-accent">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">
        {post.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-fg-faint">
        <span>
          {readingTimeLabel.replace("{minutes}", String(post.readingTimeMinutes))}
        </span>
        <span className="font-medium text-accent">{readMoreLabel}</span>
      </div>
    </article>
  );
}
