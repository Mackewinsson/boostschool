import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center text-fg">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-2 text-fg-muted">This post is not available in your language yet.</p>
      <Link href="/blog" className="mt-6 text-sm font-semibold text-accent hover:text-accent-alt">
        Back to blog
      </Link>
    </div>
  );
}
