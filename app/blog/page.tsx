import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/blog-index-view";
import { defaultBlogMetadata } from "@/lib/blog/seo";
import { getAllPosts } from "@/lib/blog/posts";
import { getLandingContent } from "@/lib/landing-content";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteUrl } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const { blogPage } = getLandingContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    ...defaultBlogMetadata(blogPage.metadata.title, blogPage.metadata.description),
  };
}

export default async function BlogPage() {
  const locale = await getLocaleFromCookies();
  const posts = await getAllPosts(locale);

  return <BlogIndexView locale={locale} posts={posts} />;
}
