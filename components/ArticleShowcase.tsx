"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEED_ARTICLES } from "@/lib/seed-articles";

type Article = {
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  date: string;
  read: string;
  tags: string[];
};

type PublishedPost = {
  slug: string;
  title: string;
  excerpt: string;
  created_at: string;
  tags: string[];
};

export default function ArticleShowcase() {
  const [published, setPublished] = useState<PublishedPost[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { posts?: PublishedPost[] } | null) => setPublished(data?.posts ?? []))
      .catch(() => undefined);
  }, []);

  const articles = useMemo<Article[]>(() => [
    ...published.map((post) => ({
      slug: post.slug,
      title: post.title,
      eyebrow: "FROM THE STUDIO",
      excerpt: post.excerpt || "A new note from the private writing studio.",
      date: post.created_at.slice(0, 10).replaceAll("-", "."),
      read: "New note",
      tags: post.tags,
    })),
    ...SEED_ARTICLES.filter((seed) => !published.some((post) => post.slug === seed.slug)).map((seed) => ({
      slug: seed.slug,
      title: seed.title,
      eyebrow: seed.eyebrow,
      excerpt: seed.excerpt,
      date: seed.date,
      read: seed.read,
      tags: seed.tags,
    })),
  ], [published]);

  const [featured, ...rest] = articles;

  return (
    <section id="articles" data-kb-section="articles" className="relative px-6 py-28 sm:px-10 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.32em] text-ice-400">WRITING / ARTICLES</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-ice-50 sm:text-7xl">Notes worth keeping.</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ice-300">一个不断生长的个人知识库：心得、项目复盘、阅读笔记，以及还没有被归类的好问题。</p>
          </div>
          <Link href="/admin" className="pointer-events-auto frost-btn">Private studio <span aria-hidden>↗</span></Link>
        </div>

        {featured && (
          <Link href={`/notes/${featured.slug}`} className="pointer-events-auto group mt-14 block overflow-hidden rounded-3xl border border-ice-700/60 bg-gradient-to-br from-ice-900/90 via-ink-1/80 to-ink-2/80 p-7 shadow-[0_24px_80px_-40px_rgba(119,174,231,0.9)] sm:p-10">
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-ice-400"><span>{featured.eyebrow}</span><span className="h-px w-8 bg-ice-700" /><span>{featured.date}</span><span>{featured.read}</span></div>
            <h3 className="mt-7 max-w-3xl text-3xl font-semibold tracking-tight text-ice-50 transition-colors group-hover:text-ice-300 sm:text-5xl">{featured.title}</h3>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ice-200 sm:text-lg">{featured.excerpt}</p>
            <div className="mt-8 flex flex-wrap gap-2">{featured.tags.map((tag) => <span key={tag} className="frost-chip">{tag}</span>)}</div>
          </Link>
        )}

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link key={article.slug} href={`/notes/${article.slug}`} className="pointer-events-auto group rounded-2xl border border-ink-3 bg-ink-1/60 p-6 transition-colors hover:border-ice-700 hover:bg-ink-1/90">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] text-ice-500"><span>{article.eyebrow}</span><span>{article.date}</span></div>
              <h3 className="mt-8 text-2xl font-semibold leading-tight text-ice-50 group-hover:text-ice-300">{article.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ice-300">{article.excerpt}</p>
              <div className="mt-7 flex items-center justify-between text-xs text-ice-500"><span>{article.read}</span><span className="text-ice-300 transition-transform group-hover:translate-x-1">Read →</span></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
