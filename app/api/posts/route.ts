import { NextResponse } from "next/server";
import { listPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ posts: listPosts() });
}
