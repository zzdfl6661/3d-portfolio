// Minimal i18n layer: a single dictionary keyed by dot-path, with each leaf
// carrying both the Chinese and English copy. Consumers read via `useLanguage().t()`
// which resolves the path for the active language. Keeping it flat and
// co-located (rather than adding a dependency like next-intl) keeps the
// project tiny and makes the strings easy to audit.
export type Lang = "es" | "en";

export const LANGUAGES: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "es";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).es === "string";
}

export const DICT = {
  picker: {
    season: { es: "主题", en: "Season" },
    language: { es: "语言", en: "Language" },
  },
  seasons: {
    spring: { es: "春", en: "Spring" },
    summer: { es: "夏", en: "Summer" },
    autumn: { es: "秋", en: "Autumn" },
    winter: { es: "冬", en: "Winter" },
  },
  nav: {
    aria: { es: "页面导航", en: "Sections" },
    home: { es: "首页", en: "Home" },
    stack: { es: "技术栈", en: "Stack" },
    experience: { es: "经历", en: "Experience" },
    project: { es: "项目", en: "Project" },
    projects: { es: "项目", en: "Projects" },
    contact: { es: "联系", en: "Contact" },
  },
  header: {
    availability: { es: "Independent builder", en: "Independent builder" },
  },
  hero: {
    greeting: { es: "MY DIGITAL SPACE", en: "MY DIGITAL SPACE" },
    roleLine: {
      es: "Builder, writer & lifelong learner.",
      en: "Builder, writer & lifelong learner.",
    },
    tagline: {
      es: "A quiet archive of ideas, experiments, and the work between them.",
      en: "A quiet archive of ideas, experiments, and the work between them.",
    },
    cv: { es: "查看项目", en: "Explore projects" },
    hire: { es: "和我聊聊", en: "Start a conversation" },
    notes: { es: "阅读文章", en: "Read notes" },
    scroll: { es: "向下探索", en: "Scroll to explore" },
    keysHint: {
      es: "· 悬停探索技术栈",
      en: "· hover over the keys",
    },
  },
  stack: {
    title: { es: "我用什么构建", en: "Tech Stack" },
    hint: {
      es: "（提示：将鼠标移到键帽上）",
      en: "(hint: hover over a key)",
    },
    hintMobile: {
      es: "我用来构建产品与表达想法的工具。",
      en: "The tools I build with.",
    },
  },
  experience: {
    title: { es: "一路走来", en: "Experience" },
    subtitle: {
      es: "项目、工作与持续积累的轨迹。",
      en: "My professional journey.",
    },
  },
  projects: {
    kicker: { es: "项目", en: "project" },
    viewMore: { es: "查看详情", en: "View more" },
    openSite: { es: "打开项目", en: "Visit site" },
    viewCode: { es: "查看代码", en: "View code" },
    close: { es: "关闭", en: "Close" },
    stackLabel: { es: "技术栈", en: "Stack" },
    overview: { es: "项目概览", en: "Overview" },
  },
  contact: {
    kicker: { es: "联系", en: "contact" },
    title: { es: "一起做点有用的事。", en: "Let's make something useful." },
    body: {
      es: "无论是合作、交流，还是一个有趣的问题，都欢迎写信给我。",
      en: "For collaboration, a good conversation, or an interesting problem — my inbox is open.",
    },
    copyEmail: { es: "复制邮箱", en: "Copy email" },
    openMail: { es: "发送邮件", en: "Open mailto" },
    github: { es: "GitHub", en: "GitHub" },
    emailToast: { es: "Email copiado", en: "Email copied" },
    footer: {
      es: "© 2026 朱兴福。保持好奇，持续构建。",
      en: "© 2026 朱兴福。保持好奇，持续构建。",
    },
  },
  keyboard: {
    taglines: {
      javascript: {
        es: "Donde empezó todo. Sigue aquí, sigue mandando.",
        en: "Where it all started. Still here, still in charge.",
      },
      typescript: {
        es: "Mismo JS, con cinturón de seguridad.",
        en: "Same JS, with a seatbelt.",
      },
      html5: {
        es: "Los huesos de cualquier página.",
        en: "The bones of any page.",
      },
      css: {
        es: "El detalle que separa lo bueno de lo bonito.",
        en: "What separates good from beautiful.",
      },
      tailwindcss: {
        es: "Utility-first. Diseño en el HTML.",
        en: "Utility-first. Design inside the HTML.",
      },
      python: {
        es: "Se lee como inglés, escala como cohete.",
        en: "Reads like English, scales like a rocket.",
      },
      react: {
        es: "Componentes, componentes, componentes.",
        en: "Components, components, components.",
      },
      nextdotjs: {
        es: "React adulto: routing, SSR, edge.",
        en: "React all grown up: routing, SSR, edge.",
      },
      threedotjs: {
        es: "让界面拥有空间感与运动感。",
        en: "A little depth, motion, and spatial character.",
      },
      vuedotjs: {
        es: "El frontend más relajado.",
        en: "The most relaxed frontend.",
      },
      nodedotjs: {
        es: "JavaScript en el servidor.",
        en: "JavaScript on the server.",
      },
      sqlite: {
        es: "Una base de datos pequeña y muy capaz.",
        en: "Small, local, and capable enough for a personal studio.",
      },
      github: {
        es: "代码、协作，以及公开构建的轨迹。",
        en: "Code, collaboration, and a public trail of building.",
      },
      php: {
        es: "Mueve más web de la que crees.",
        en: "Runs more of the web than you think.",
      },
      odoo: {
        es: "ERP que no hace llorar.",
        en: "ERP that doesn't make you cry.",
      },
      postgresql: {
        es: "La base de datos aburrida que siempre funciona.",
        en: "The boring database that always works.",
      },
      docker: {
        es: "Igual en mi máquina, igual en producción.",
        en: "Same on my machine, same in production.",
      },
      git: {
        es: "Historia y máquina del tiempo del código.",
        en: "History and a time machine for your code.",
      },
      pnpm: {
        es: "快速、克制、适合长期维护。",
        en: "Fast, focused, and kind to long-lived projects.",
      },
      markdown: {
        es: "让想法保持可读、可迁移。",
        en: "Keep ideas readable, portable, and close to the source.",
      },
    },
  },
} as const satisfies Record<string, Node>;

// Resolve a dotted path in the dictionary for a given language.
export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.es ?? path;
  return path;
}
