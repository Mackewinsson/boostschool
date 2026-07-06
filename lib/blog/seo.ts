import type { Metadata } from "next";
import { siteAuthor, siteName, siteUrl } from "@/lib/site-config";
import type { BlogPostMeta } from "./types";

export function buildPostMetadata(post: BlogPostMeta): Metadata {
  const canonicalPath = `/blog/${post.slug}`;
  const title = `${post.title} | ${siteName}`;

  return {
    title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: canonicalPath,
      siteName,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.image ? { images: [{ url: post.image, alt: post.title }] } : {}),
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(post.image ? { images: [post.image] } : {}),
    },
  };
}

export function blogPostingJsonLd(post: BlogPostMeta) {
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.tags.join(", "),
    ...(post.image ? { image: post.image } : {}),
  };
}

export function breadcrumbJsonLd(post: BlogPostMeta) {
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteName,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };
}

export function defaultBlogMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ${siteName}`,
    description,
    alternates: {
      canonical: "/blog",
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: "/blog",
      siteName,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export { siteAuthor, siteName, siteUrl };
