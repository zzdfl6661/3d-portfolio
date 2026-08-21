import Link from "next/link";
import { findPublishedPost } from "@/lib/db";
import { SEED_ARTICLES } from "@/lib/seed-articles";

export const dynamic = "force-dynamic";

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = findPublishedPost(slug);
  const seed = SEED_ARTICLES.find((article) => article.slug === slug);
  if (!post && !seed) {
    return (
      <main className="relative z-10 min-h-screen bg-background px-6 py-10 text-ice-50 sm:px-10 md:px-16">
        <article className="mx-auto max-w-3xl pt-24">
          <Link href="/notes" className="text-xs uppercase tracking-[0.25em] text-ice-400 hover:text-ice-100">← 所有文章</Link>
          <p className="mt-24 font-mono text-xs tracking-[0.25em] text-ice-400">COMING SOON</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] capitalize sm:text-7xl">{slug.replaceAll("-", " ")}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ice-300">这篇文章正在写作中。它已经进入知识库，内容会在完成后公开。</p>
        </article>
      </main>
    );
  }

  const title = post?.title ?? seed!.title;
  const excerpt = post?.excerpt ?? seed!.excerpt;
  const body = post?.body ?? seed!.body;
  const date = post?.created_at.slice(0, 10) ?? seed!.date.replaceAll(".", "-");

  return (
    <main className="relative z-10 min-h-screen bg-background px-6 py-10 text-ice-50 sm:px-10 md:px-16">
      <article className="mx-auto max-w-3xl">
        <Link href="/notes" className="text-xs uppercase tracking-[0.25em] text-ice-400 hover:text-ice-100">← 所有文章</Link>
        <header className="mt-24">
          <time className="font-mono text-xs text-ice-400">{date}</time>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">{title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-ice-300">{excerpt}</p>
        </header>
        <div className="mt-16 whitespace-pre-wrap text-[1.05rem] leading-[1.9] text-ice-200">{body}</div>
      </article>
    </main>
  );
}
