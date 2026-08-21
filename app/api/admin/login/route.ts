import { NextResponse } from "next/server";
import { adminCookie, createSession, passwordIsValid } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !passwordIsValid(body.password)) {
    return NextResponse.json({ error: "密码不正确" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps = forwardedProto
    ? forwardedProto === "https"
    : new URL(request.url).protocol === "https:";
  response.cookies.set(adminCookie.name, createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: adminCookie.maxAge,
  });
  return response;
}
