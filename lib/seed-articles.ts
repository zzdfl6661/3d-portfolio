export type SeedArticle = {
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  body: string;
  date: string;
  read: string;
  tags: string[];
};

// Starter notes are inserted into SQLite on first boot. They are intentionally
// ordinary editable records, so the owner can rewrite or remove them in /admin.
export const SEED_ARTICLES: readonly SeedArticle[] = [
  {
    slug: "digital-garden",
    title: "A digital garden for unfinished ideas",
    eyebrow: "ESSAY",
    excerpt: "Why a personal site should feel less like a résumé and more like a place ideas can keep becoming.",
    body: "# A digital garden for unfinished ideas\n\nA personal site does not need to pretend that every thought has already become a conclusion. It can hold rough edges, questions, and small experiments while they are still becoming useful.\n\nThis is the kind of space I want to keep: calm enough to revisit, structured enough to search, and open enough to change.",
    date: "2026.08.21",
    read: "6 min read",
    tags: ["Writing", "Systems"],
  },
  {
    slug: "quiet-interface",
    title: "Designing interfaces that know when to be quiet",
    eyebrow: "DESIGN NOTE",
    excerpt: "On contrast, pacing, and the small details that make a screen feel intentional instead of loud.",
    body: "# Designing interfaces that know when to be quiet\n\nA strong interface does not need to announce every interaction. Contrast, spacing, and a little patience often create more confidence than another animation.\n\nThe best details are the ones that make the next action feel obvious.",
    date: "2026.08.18",
    read: "4 min read",
    tags: ["Design", "Product"],
  },
  {
    slug: "shipping-small",
    title: "The discipline of shipping the smallest useful thing",
    eyebrow: "FIELD NOTE",
    excerpt: "A practical framework for turning a broad idea into something real, testable, and worth returning to.",
    body: "# The discipline of shipping the smallest useful thing\n\nWhen an idea is broad, the first useful move is not to add more scope. It is to find the smallest version that can teach you something.\n\nA small release creates evidence. Evidence makes the next decision less romantic and more precise.",
    date: "2026.08.12",
    read: "8 min read",
    tags: ["Building", "Process"],
  },
  {
    slug: "sqlite-for-writing",
    title: "Why SQLite is enough for a personal publishing studio",
    eyebrow: "ENGINEERING",
    excerpt: "A small database, a private editor, and a writing workflow that stays close to the server.",
    body: "# Why SQLite is enough for a personal publishing studio\n\nFor a personal writing system, the useful property is often proximity: the content, the editor, and the server can stay in one small deployable unit.\n\nSQLite gives this site durable text storage without making the publishing workflow feel like operating a platform.",
    date: "2026.08.06",
    read: "5 min read",
    tags: ["SQLite", "Web"],
  },
  {
    slug: "learning-in-public",
    title: "Learning in public without performing certainty",
    eyebrow: "REFLECTION",
    excerpt: "Notes on sharing the work in progress while leaving room for doubt, revision, and better questions.",
    body: "# Learning in public without performing certainty\n\nSharing work in progress does not mean turning every uncertainty into a performance. It can simply mean leaving a trail that makes revision visible.\n\nThe goal is not to sound finished. The goal is to stay honest enough to keep learning.",
    date: "2026.07.29",
    read: "7 min read",
    tags: ["Learning", "Writing"],
  },
  {
    slug: "server-as-material",
    title: "A website is also a small piece of infrastructure",
    eyebrow: "LOGBOOK",
    excerpt: "The invisible choices behind a calm, reliable personal site — and why they are part of the work.",
    body: "# A website is also a small piece of infrastructure\n\nA personal site is not only its visible interface. Backups, deployment, authentication, and the choice of database shape how comfortably the site can keep evolving.\n\nThe quiet parts are still part of the craft.",
    date: "2026.07.20",
    read: "5 min read",
    tags: ["Infrastructure", "Notes"],
  },
];
