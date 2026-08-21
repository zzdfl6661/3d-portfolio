import Link from "next/link";
import { listPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  const posts = listPosts();

  return (
    <main className="relative z-10 min-h-screen bg-background px-6 py-10 text-ice-50 sm:px-10 md:px-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-xs uppercase tracking-[0.25em] text-ice-400 hover:text-ice-100">
          ← 返回首页
        </Link>
        <header className="mt-24 max-w-2xl">
          <p className="font-mono text-sm text-ice-400">NOTES / JOURNAL</p>
          <h1 className="mt-4 text-6xl font-semibold tracking-[-0.04em] sm:text-8xl">思考与体会</h1>
          <p className="mt-6 text-lg leading-relaxed text-ice-300">
            记录项目之外的东西：正在学习的技术、做过的选择，以及值得留下来的问题。
          </p>
        </header>

        <section className="mt-20 space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-ink-3 bg-ink-1/60 p-8 text-ice-300">
              第一篇文章正在路上。登录后台后，用 Markdown 写下你的第一篇心得。
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-ink-3 bg-ink-1/60 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs text-ice-400">
                  <time dateTime={post.created_at}>{post.created_at.slice(0, 10)}</time>
                  {post.tags.map((tag) => <span key={tag} className="rounded-full border border-ink-3 px-2 py-1">#{tag}</span>)}
                </div>
                <h2 className="mt-4 text-2xl font-semibold sm:text-3xl"><Link href={`/notes/${post.slug}`} className="hover:text-ice-300">{post.title}</Link></h2>
                <p className="mt-3 leading-relaxed text-ice-300">{post.excerpt}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
