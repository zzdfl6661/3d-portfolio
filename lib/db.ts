import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { SEED_ARTICLES } from "@/lib/seed-articles";

export type Post = {
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

export type GuestMessage = {
  id: number;
  name: string;
  email: string;
  content: string;
  is_read: number;
  created_at: string;
};

const dataDir = path.dirname(
  process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "site.db")
);
const databasePath =
  process.env.SQLITE_PATH ?? path.join(process.cwd(), "data", "site.db");

fs.mkdirSync(dataDir, { recursive: true });

const globalDb = globalThis as typeof globalThis & {
  __personalSiteDb?: Database.Database;
};

export const db =
  globalDb.__personalSiteDb ??
  new Database(databasePath, { timeout: 10000 });

// The default journal mode keeps first-time Next.js builds deterministic when
// several workers import this module at once. SQLite still handles long text
// safely; WAL can be enabled later once the app is running as a single server.
db.pragma("busy_timeout = 10000");
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Keep the homepage starter cards as real published records. This makes every
// visible article readable immediately and editable from the private studio.
const seedPost = db.prepare(
  `INSERT OR IGNORE INTO posts
   (title, slug, excerpt, body, tags, published, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, 1, ?, ?)`
);
for (const article of SEED_ARTICLES) {
  const timestamp = `${article.date.replaceAll(".", "-")} 00:00:00`;
  seedPost.run(
    article.title,
    article.slug,
    article.excerpt,
    article.body,
    JSON.stringify(article.tags),
    timestamp,
    timestamp
  );
}

if (process.env.NODE_ENV !== "production") {
  globalDb.__personalSiteDb = db;
}

function decodePost(row: Record<string, unknown>): Post {
  return {
    ...(row as Omit<Post, "tags">),
    tags: JSON.parse(String(row.tags || "[]")),
  };
}

export function listPosts(includeDrafts = false): Post[] {
  const rows = db
    .prepare(
      includeDrafts
        ? "SELECT * FROM posts ORDER BY updated_at DESC"
        : "SELECT * FROM posts WHERE published = 1 ORDER BY updated_at DESC"
    )
    .all() as Record<string, unknown>[];
  return rows.map(decodePost);
}

export function findPost(id: number): Post | null {
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  return row ? decodePost(row) : null;
}

export function findPublishedPost(slug: string): Post | null {
  const row = db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? decodePost(row) : null;
}

export function savePost(input: {
  id?: number;
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  tags?: string[];
  published?: boolean;
}): Post {
  const values = [
    input.title.trim(),
    input.slug.trim(),
    input.excerpt?.trim() ?? "",
    input.body,
    JSON.stringify(input.tags ?? []),
    input.published ? 1 : 0,
  ];

  if (input.id) {
    db.prepare(
      `UPDATE posts
       SET title = ?, slug = ?, excerpt = ?, body = ?, tags = ?, published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(...values, input.id);
    return findPost(input.id)!;
  }

  const result = db
    .prepare(
      `INSERT INTO posts (title, slug, excerpt, body, tags, published)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(...values);
  return findPost(Number(result.lastInsertRowid))!;
}

export function removePost(id: number): void {
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
}

export function listMessages(): GuestMessage[] {
  return db
    .prepare("SELECT * FROM messages ORDER BY is_read ASC, created_at DESC")
    .all() as GuestMessage[];
}

export function saveMessage(input: {
  name: string;
  email?: string;
  content: string;
}): GuestMessage {
  const result = db
    .prepare("INSERT INTO messages (name, email, content) VALUES (?, ?, ?)")
    .run(input.name.trim(), input.email?.trim() ?? "", input.content.trim());
  return db
    .prepare("SELECT * FROM messages WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as GuestMessage;
}

export function updateMessageRead(id: number, isRead: boolean): void {
  db.prepare("UPDATE messages SET is_read = ? WHERE id = ?").run(
    isRead ? 1 : 0,
    id
  );
}

export function removeMessage(id: number): void {
  db.prepare("DELETE FROM messages WHERE id = ?").run(id);
}
