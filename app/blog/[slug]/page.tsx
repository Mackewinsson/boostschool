import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/blog-post-view";
import { buildPostMetadata } from "@/lib/blog/seo";
import { getAllPostParams, getPostBySlug } from "@/lib/blog/posts";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { siteUrl } from "@/lib/site-config";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const allParams = await getAllPostParams();
  return allParams.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocaleFromCookies();
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return {
      metadataBase: new URL(siteUrl),
      title: "Post not found",
    };
  }

  return {
    metadataBase: new URL(siteUrl),
    ...buildPostMetadata(post),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = await getLocaleFromCookies();
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  return <BlogPostView locale={locale} post={post} />;
}
