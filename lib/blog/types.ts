export type BlogPostFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  draft?: boolean;
  image?: string;
};

export type BlogPostMeta = BlogPostFrontmatter & {
  slug: string;
  readingTimeMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};
