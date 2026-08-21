"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string[];
  published: number;
  created_at: string;
  updated_at: string;
};

type GuestMessage = {
  id: number;
  name: string;
  email: string;
  content: string;
  is_read: number;
  created_at: string;
};

type FormState = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string;
  published: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  tags: "",
  published: false,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [notice, setNotice] = useState("");

  async function loadData() {
    const [postsResponse, messagesResponse] = await Promise.all([
      fetch("/api/admin/posts"),
      fetch("/api/admin/messages"),
    ]);
    if (!postsResponse.ok) {
      setLoggedIn(false);
      return;
    }
    const postData = (await postsResponse.json()) as { posts: Post[] };
    setPosts(postData.posts);
    if (messagesResponse.ok) {
      const messageData = (await messagesResponse.json()) as { messages: GuestMessage[] };
      setMessages(messageData.messages);
    }
    setLoggedIn(true);
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setNotice("密码不正确");
      return;
    }
    setPassword("");
    setNotice("");
    await loadData();
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const isEditing = Boolean(form.id);
    const response = await fetch(
      isEditing ? `/api/admin/posts/${form.id}` : "/api/admin/posts",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      }
    );
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setNotice(data?.error ?? "保存失败");
      return;
    }
    setForm(emptyForm());
    setNotice(isEditing ? "文章已更新并同步到文章区" : "文章已创建并保存");
    await loadData();
  }

  function editPost(post: Post) {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      tags: post.tags.join(", "),
      published: Boolean(post.published),
    });
    setNotice(`正在编辑：${post.title}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePost(id: number) {
    if (!window.confirm("确定删除这篇文章吗？")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (form.id === id) setForm(emptyForm());
    setNotice("文章已删除");
    await loadData();
  }

  async function importMarkdown(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = await file.text();
    const heading = body.match(/^#\s+(.+)$/m)?.[1] ?? file.name.replace(/\.(md|markdown|txt)$/i, "");
    setForm((current) => ({
      ...current,
      title: heading,
      slug: current.slug || slugify(heading),
      body,
    }));
    setNotice("已导入内容，可以继续编辑后保存");
    event.target.value = "";
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
    setPosts([]);
    setMessages([]);
  }

  async function markMessage(message: GuestMessage, read: boolean) {
    await fetch(`/api/admin/messages/${message.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ read }),
    });
    await loadData();
  }

  async function deleteMessage(id: number) {
    if (!window.confirm("确定删除这条留言吗？")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setNotice("留言已删除");
    await loadData();
  }

  if (!loggedIn) {
    return (
      <main className="relative z-10 min-h-screen bg-background px-6 py-10 text-ice-50 sm:px-10 md:px-16">
        <div className="mx-auto mt-28 max-w-md rounded-2xl border border-ink-3 bg-ink-1/70 p-8 backdrop-blur-md">
          <p className="font-mono text-xs tracking-[0.25em] text-ice-400">PRIVATE STUDIO</p>
          <h1 className="mt-4 text-4xl font-semibold">文章与留言后台</h1>
          <p className="mt-3 text-sm leading-relaxed text-ice-300">文章、草稿和访客留言都只在这里可见。</p>
          <form onSubmit={login} className="mt-8 space-y-4">
            <input
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="管理员密码"
              className="w-full rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 text-ice-50 outline-none focus:border-ice-500"
            />
            <button className="w-full rounded-xl bg-ice-100 px-4 py-3 font-semibold text-background">进入后台</button>
          </form>
          {notice && <p className="mt-4 text-sm text-red-300">{notice}</p>}
        </div>
      </main>
    );
  }

  const unreadCount = messages.filter((message) => !message.is_read).length;

  return (
    <main className="relative z-10 min-h-screen bg-background px-6 py-10 text-ice-50 sm:px-10 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-ice-400">PRIVATE STUDIO</p>
            <h1 className="mt-3 text-4xl font-semibold">文章与留言后台</h1>
          </div>
          <div className="flex gap-3">
            <a href="/notes" className="rounded-full border border-ink-3 px-4 py-2 text-sm text-ice-300 hover:text-ice-50">查看公开文章</a>
            <button onClick={logout} className="rounded-full border border-ink-3 px-4 py-2 text-sm text-ice-300 hover:text-ice-50">退出</button>
          </div>
        </div>

        <form onSubmit={save} className="mt-10 grid gap-4 rounded-2xl border border-ink-3 bg-ink-1/70 p-6 backdrop-blur-md sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{form.id ? "编辑文章" : "创建文章"}</h2>
            {form.id && <button type="button" onClick={() => setForm(emptyForm())} className="text-sm text-ice-400 hover:text-ice-50">取消编辑</button>}
          </div>
          <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="标题" className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 text-xl text-ice-50 outline-none focus:border-ice-500" />
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ice-700 px-4 py-3 text-sm text-ice-300 hover:border-ice-400 hover:text-ice-50"><span>导入 Markdown / TXT</span><input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" onChange={importMarkdown} className="hidden" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="slug，例如 first-note" className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 text-ice-50 outline-none focus:border-ice-500" /><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="标签，用逗号分隔" className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 text-ice-50 outline-none focus:border-ice-500" /></div>
          <input value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} placeholder="摘要（会显示在首页文章卡片）" className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 text-ice-50 outline-none focus:border-ice-500" />
          <textarea required value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} placeholder="正文（支持 Markdown 文本）" rows={16} className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-3 font-mono text-sm leading-relaxed text-ice-50 outline-none focus:border-ice-500" />
          <label className="flex items-center gap-3 text-sm text-ice-300"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />保存后立即公开到首页和文章页</label>
          <div className="flex flex-wrap items-center gap-4"><button className="w-fit rounded-xl bg-ice-100 px-5 py-3 font-semibold text-background">{form.id ? "更新文章" : "创建文章"}</button>{notice && <p className="text-sm text-ice-300">{notice}</p>}</div>
        </form>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-xl font-semibold">文章（{posts.length}）</h2><p className="text-sm text-ice-400">编辑后，公开文章区会自动读取最新内容</p></div>
          <div className="mt-4 space-y-3">
            {posts.length === 0 ? <p className="rounded-xl border border-ink-3 bg-ink-1/50 p-5 text-sm text-ice-400">还没有文章，先写下第一篇吧。</p> : posts.map((post) => <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-3 bg-ink-1/50 px-4 py-3"><div><p className="font-medium">{post.title}</p><p className="mt-1 text-xs text-ice-500">/notes/{post.slug}</p></div><div className="flex items-center gap-3"><span className="text-xs text-ice-400">{post.published ? "已公开" : "草稿"}</span><button onClick={() => editPost(post)} className="text-sm text-ice-200 hover:text-ice-50">编辑</button><button onClick={() => deletePost(post.id)} className="text-sm text-red-300 hover:text-red-200">删除</button></div></div>)}
          </div>
        </section>

        <section className="mt-16 pb-16">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold">访客留言（{messages.length}）</h2><p className="mt-1 text-sm text-ice-400">{unreadCount ? `${unreadCount} 条未读` : "目前没有未读留言"} · 公开页面不会展示留言内容</p></div></div>
          <div className="mt-4 space-y-3">
            {messages.length === 0 ? <p className="rounded-xl border border-ink-3 bg-ink-1/50 p-5 text-sm text-ice-400">还没有访客留言。</p> : messages.map((message) => <article key={message.id} className={`rounded-xl border p-5 ${message.is_read ? "border-ink-3 bg-ink-1/40" : "border-ice-700/70 bg-ice-900/20"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium text-ice-50">{message.name}</p><p className="mt-1 text-xs text-ice-400">{message.email || "未留下邮箱"} · {message.created_at}</p></div><div className="flex gap-3 text-sm"><button onClick={() => markMessage(message, !message.is_read)} className="text-ice-300 hover:text-ice-50">{message.is_read ? "标为未读" : "标为已读"}</button><button onClick={() => deleteMessage(message.id)} className="text-red-300 hover:text-red-200">删除</button></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ice-200">{message.content}</p></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
