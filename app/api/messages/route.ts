import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    content?: string;
  } | null;
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const content = String(body?.content ?? "").trim();

  if (!name || !content) {
    return NextResponse.json({ error: "请填写称呼和留言内容" }, { status: 400 });
  }
  if (name.length > 80 || email.length > 160 || content.length > 2000) {
    return NextResponse.json({ error: "留言内容过长，请精简后再发送" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
  }

  saveMessage({ name, email, content });
  return NextResponse.json({ ok: true });
}
