import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "personal_site_admin";
const SESSION_TTL = 60 * 60 * 24 * 7;

function secret(): string {
  const value = process.env.ADMIN_SECRET;
  if (!value) {
    throw new Error("ADMIN_SECRET must be configured.");
  }
  return value;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function passwordIsValid(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  // Fail closed when the password was not configured. Public deployments
  // must never inherit a known default administrator password.
  if (!expected) return false;
  const actual = Buffer.from(password);
  const target = Buffer.from(expected);
  return actual.length === target.length && timingSafeEqual(actual, target);
}

export function createSession(): string {
  const value = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
  return `${value}.${sign(value)}`;
}

export function sessionIsValid(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [timestamp, nonce, signature] = parts;
  const valueToSign = `${timestamp}.${nonce}`;
  if (Date.now() - Number(timestamp) > SESSION_TTL * 1000) return false;
  const expected = sign(valueToSign);
  const actual = Buffer.from(signature);
  const target = Buffer.from(expected);
  return actual.length === target.length && timingSafeEqual(actual, target);
}

export async function isAdmin(): Promise<boolean> {
  return sessionIsValid((await cookies()).get(COOKIE_NAME)?.value);
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL,
};
