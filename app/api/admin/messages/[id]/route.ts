import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { removeMessage, updateMessageRead } from "@/lib/db";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { read?: boolean } | null;
  updateMessageRead(Number(id), body?.read === true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  removeMessage(Number((await context.params).id));
  return NextResponse.json({ ok: true });
}
