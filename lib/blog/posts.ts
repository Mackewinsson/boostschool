import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/lib/locale";
import { isLocale } from "@/lib/locale";
import type { BlogPost, BlogPostFrontmatter, BlogPostMeta } from "./types";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function getLocaleDir(locale: Locale): string {
  return path.join(BLOG_CONTENT_DIR, locale);
}

function parseFrontmatter(slug: string, raw: string): BlogPost | null {
  const { data, content } = matter(raw);
  const frontmatter = data as Partial<BlogPostFrontmatter> & {
    meta_description?: string;
    target_keywords?: string[];
  };

  const description = frontmatter.description || frontmatter.meta_description;
  const tags = frontmatter.tags || frontmatter.target_keywords || [];

  if (!frontmatter.title || !description || !frontmatter.publishedAt) {
    return null;
  }

  if (frontmatter.draft) {
    return null;
  }

  const stats = readingTime(content);

  return {
    slug,
    title: frontmatter.title,
    description,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    author: frontmatter.author ?? "Paulina Poloca",
    tags,
    draft: frontmatter.draft,
    image: frontmatter.image,
    readingTimeMinutes: Math.max(1, Math.ceil(stats.minutes)),
    content,
  };
}

async function readPostFile(locale: Locale, filename: string): Promise<BlogPost | null> {
  const slug = filename.replace(/\.mdx$/, "");
  const filePath = path.join(getLocaleDir(locale), filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return parseFrontmatter(slug, raw);
}

export async function getAllPosts(locale: Locale): Promise<BlogPostMeta[]> {
  const dir = getLocaleDir(locale);

  let filenames: string[];
  try {
    filenames = await fs.readdir(dir);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    filenames
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => readPostFile(locale, name)),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .map((post) => {
      const { content, ...meta } = post;
      void content;
      return meta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export async function getLatestPosts(
  locale: Locale,
  limit: number,
): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.slice(0, limit);
}

export async function getPostBySlug(
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const filePath = path.join(getLocaleDir(locale), `${slug}.mdx`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseFrontmatter(slug, raw);
  } catch {
    return null;
  }
}

export async function getAllPostParams(): Promise<{ locale: Locale; slug: string }[]> {
  const locales: Locale[] = ["es", "en", "pl"];
  const params: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export function isValidLocale(value: string): value is Locale {
  return isLocale(value);
}
