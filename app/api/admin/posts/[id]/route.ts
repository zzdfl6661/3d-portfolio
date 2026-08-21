import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { removePost, savePost } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await context.params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return NextResponse.json({ error: "文章编号无效" }, { status: 400 });
  }
  const body = await request.json();
  if (!body.title || !body.slug || !body.body) {
    return NextResponse.json({ error: "标题、slug 和正文不能为空" }, { status: 400 });
  }
  try {
    const post = savePost({ ...body, id: numericId });
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  removePost(Number((await context.params).id));
  return NextResponse.json({ ok: true });
}
