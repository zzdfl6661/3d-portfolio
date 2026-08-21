import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { listPosts, savePost } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  return NextResponse.json({ posts: listPosts(true) });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const body = await request.json();
  if (!body.title || !body.slug || !body.body) {
    return NextResponse.json({ error: "标题、slug 和正文不能为空" }, { status: 400 });
  }
  try {
    return NextResponse.json({ post: savePost(body) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
