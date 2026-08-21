"use client";

const projects = [
  {
    index: "01",
    name: "Career-Agent",
    title: "求职智能体",
    description:
      "把求职材料、岗位信息与准备过程整理成一个更清晰、更可执行的工作流。",
    href: "https://github.com/zzdfl6661/Career-Agent",
    accent: "CAREER / AGENT",
  },
  {
    index: "02",
    name: "business-agent",
    title: "业务智能体",
    description:
      "面向真实业务场景的智能体实验，探索如何把复杂任务拆成可复用的协作步骤。",
    href: "https://github.com/zzdfl6661/business-agent",
    accent: "BUSINESS / AGENT",
  },
  {
    index: "03",
    name: "Computer-screen-monitoring",
    title: "屏幕监控工具",
    description:
      "一个贴近实际使用的桌面观察工具，把屏幕活动转化为可理解、可追踪的信号。",
    href: "https://github.com/zzdfl6661/Computer-screen-monitoring",
    accent: "DESKTOP / MONITORING",
  },
] as const;

export default function ProjectShowcase() {
  return (
    <section
      id="projects"
      data-kb-section="projects"
      className="relative px-6 py-28 sm:px-10 md:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.32em] text-ice-400">
              SELECTED WORK / PROJECTS
            </p>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-ice-50 sm:text-7xl">
              Built to be useful.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ice-300">
              三个正在持续打磨的项目：从求职、业务到桌面工具，把想法变成可以运行的东西。
            </p>
          </div>
          <a
            href="https://github.com/zzdfl6661"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="pointer-events-auto frost-btn"
          >
            全部 GitHub <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group flex min-h-[330px] flex-col rounded-2xl border border-ink-3 bg-ink-1/65 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ice-700 hover:bg-ink-1/90 sm:p-7"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.22em] text-ice-500">
                <span>{project.index}</span>
                <span>{project.accent}</span>
              </div>
              <div className="mt-12">
                <p className="text-sm font-medium tracking-[0.14em] text-ice-400">
                  {project.title}
                </p>
                <h3 className="mt-3 break-words text-2xl font-semibold leading-tight tracking-tight text-ice-50 sm:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-ice-300">
                  {project.description}
                </p>
              </div>
              <div className="mt-auto pt-10">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="pointer-events-auto inline-flex items-center gap-2 text-sm font-medium text-ice-100 transition-colors group-hover:text-ice-300"
                >
                  查看 GitHub <span className="transition-transform group-hover:translate-x-1" aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
