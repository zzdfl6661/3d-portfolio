"use client";

import { useState } from "react";

const initialForm = { name: "", email: "", content: "" };

export default function GuestbookForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    if (!response.ok) {
      setStatus("error");
      setMessage(data?.error ?? "发送失败，请稍后再试");
      return;
    }
    setForm(initialForm);
    setStatus("sent");
    setMessage("留言已送达，我会在后台看到它。");
  }

  return (
    <form
      onSubmit={submit}
      className="pointer-events-auto rounded-2xl border border-ice-700/60 bg-ink-1/70 p-6 backdrop-blur-md sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.25em] text-ice-400">PRIVATE MESSAGE</p>
          <h3 className="mt-3 text-2xl font-semibold text-ice-50">留一句话给我</h3>
        </div>
        <span className="rounded-full border border-ice-700/70 px-3 py-1 text-[10px] text-ice-300">仅我可见</span>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          required
          maxLength={80}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="你的称呼"
          className="rounded-xl border border-ink-3 bg-ink-2/80 px-4 py-3 text-sm text-ice-50 outline-none placeholder:text-ice-500 focus:border-ice-500"
        />
        <input
          type="email"
          maxLength={160}
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="邮箱（可选）"
          className="rounded-xl border border-ink-3 bg-ink-2/80 px-4 py-3 text-sm text-ice-50 outline-none placeholder:text-ice-500 focus:border-ice-500"
        />
      </div>
      <textarea
        required
        maxLength={2000}
        rows={5}
        value={form.content}
        onChange={(event) => setForm({ ...form, content: event.target.value })}
        placeholder="想聊什么？项目、合作，或者一个正在思考的问题……"
        className="mt-3 w-full resize-y rounded-xl border border-ink-3 bg-ink-2/80 px-4 py-3 text-sm leading-relaxed text-ice-50 outline-none placeholder:text-ice-500 focus:border-ice-500"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className={`text-xs ${status === "error" ? "text-red-300" : "text-ice-400"}`} aria-live="polite">
          {message || "不会公开展示，也不会出现在文章区。"}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="frost-btn frost-btn--primary disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "发送中…" : status === "sent" ? "已发送" : "发送留言"}
        </button>
      </div>
    </form>
  );
}
