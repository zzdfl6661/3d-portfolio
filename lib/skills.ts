import {
  siCss,
  siDocker,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMarkdown,
  siNextdotjs,
  siNodedotjs,
  siPnpm,
  siReact,
  siSqlite,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
} from "simple-icons";

export type SkillIcon = {
  title: string;
  slug: string;
  path: string;
  hex: string;
};

// 3×5 grid — consumed by the 3D keyboard (one icon per keycap) and, on mobile,
// by the flat list below for the static skills grid that replaces the
// hover-driven keyboard interaction. Taglines live in the i18n dictionary
// under `keyboard.taglines.<slug>`.
export const SKILLS_GRID: readonly (readonly SkillIcon[])[] = [
  [siNextdotjs, siReact, siTypescript, siThreedotjs, siTailwindcss],
  [siSqlite, siNodedotjs, siGithub, siDocker, siJavascript],
  [siHtml5, siCss, siGit, siPnpm, siMarkdown],
] as const;

export const SKILLS_FLAT: readonly SkillIcon[] = SKILLS_GRID.flat();
