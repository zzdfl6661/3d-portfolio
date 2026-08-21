import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { listMessages } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "未授权" }, { status: 401 });
  return NextResponse.json({ messages: listMessages() });
}
