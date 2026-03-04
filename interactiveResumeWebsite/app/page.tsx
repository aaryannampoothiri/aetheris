"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Skill = {
  name: string;
  level: number;
};

type Project = {
  title: string;
  summary: string;
  impact: string;
  stack: string[];
  demoUrl?: string;
  repoUrl?: string;
};

const skillMap: Record<string, Skill[]> = {
  Languages: [
    { name: "Java", level: 80 },
    { name: "Python", level: 60 },
  ],
};

const projects: Project[] = [
  {
    title: "A Novel Framework for IoMT Security in Pandemic Situations",
    summary:
      "Proposed a security-focused framework to strengthen connected medical device ecosystems in high-risk pandemic scenarios.",
    impact:
      "Addressed threat vectors in remote healthcare delivery with a resilient architecture model.",
    stack: ["Cybersecurity", "IoMT", "Network Security", "Research"],
  },
  {
    title: "Image Steganography",
    summary:
      "Built a project to hide and extract sensitive information inside digital images using steganographic methods.",
    impact:
      "Demonstrated practical secure data concealment techniques for privacy-focused communication.",
    stack: ["Python", "Image Processing", "Security", "Algorithms"],
  },
];

const experience = [
  {
    role: "B.Tech Student",
    company: "Vellore Institute of Technology",
    period: "Current",
    points: [
      "Pursuing Computer Science and Engineering with specialization in Cybersecurity.",
      "Building academic and practical projects in secure systems and software development.",
      "Focused on strengthening core programming skills across Java and Python.",
    ],
  },
];

const knownLanguages = ["Java", "Python", "C++"];

const spokenLanguages = ["English", "Malayalam", "Hindi", "Tamil"];

export default function Home() {
  const categories = Object.keys(skillMap);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [photoError, setPhotoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const selectedSkills = useMemo(
    () => skillMap[activeCategory],
    [activeCategory],
  );

  const selectedProject = projects[selectedProjectIndex];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-sm font-semibold tracking-wide text-zinc-300">
            Aaryan Nampoothiri A
          </p>
          <div className="hidden items-center gap-5 text-sm text-zinc-300 md:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#languages" className="transition hover:text-white">
              Languages
            </a>
            <a href="#skills" className="transition hover:text-white">
              Skills
            </a>
            <a href="#projects" className="transition hover:text-white">
              Projects
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-12 md:py-16">
        <section id="about" className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 h-48 md:h-56">
              {!bannerError ? (
                <Image
                  src="/banner.png"
                  alt="Aaryan banner"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 250px), calc(100vw - 350px)"
                  onError={() => setBannerError(true)}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-sm font-medium uppercase tracking-wide text-zinc-400">
                  Add banner.png
                </div>
              )}
            </div>

            <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 md:h-56 md:w-56 flex-shrink-0">
              {!photoError ? (
                <Image
                  src="/profile.jpg"
                  alt="Aaryan Nampoothiri A"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 224px, 192px"
                  onError={() => setPhotoError(true)}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Add profile.jpg
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
              Student · CSE (Cybersecurity)
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Aaryan Nampoothiri A
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
              Aspiring cybersecurity-focused engineer with a passion for secure
              and practical software systems.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                Explore Projects
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                View CV
              </a>
              <a
                href="#contact"
                className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                Let&apos;s Connect
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
            {[
              { label: "Status", value: "UG Student" },
              { label: "Projects", value: "2" },
              { label: "Focus", value: "Cybersecurity" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-zinc-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
            </div>
        </section>

        <section id="languages" className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">Languages I Know</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-3 text-sm font-medium text-zinc-400">Programming</p>
              <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                {knownLanguages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-zinc-400">Spoken</p>
              <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                {spokenLanguages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-zinc-900"
                        : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 md:grid-cols-2">
            {selectedSkills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-200">{skill.name}</span>
                  <span className="text-zinc-400">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-zinc-100 transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">Featured Projects</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
            <div className="space-y-2">
              {projects.map((project, index) => {
                const isActive = index === selectedProjectIndex;
                return (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => setSelectedProjectIndex(index)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isActive
                        ? "border-zinc-500 bg-zinc-800 text-white"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{project.stack[0]}</p>
                  </button>
                );
              })}
            </div>

            <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedProject.title}
              </h3>
              <p className="mt-3 text-zinc-300">{selectedProject.summary}</p>
              <p className="mt-2 text-sm font-medium text-zinc-200">
                {selectedProject.impact}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {(selectedProject.demoUrl || selectedProject.repoUrl) && (
                <div className="mt-6 flex gap-3 text-sm">
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-200"
                    >
                      Live Demo
                    </a>
                  )}
                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500"
                    >
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </article>
          </div>
        </section>

        <section id="experience" className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">Education</h2>
          <div className="grid gap-4">
            {experience.map((item) => (
              <article
                key={`${item.role}-${item.company}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {item.role} · {item.company}
                  </h3>
                  <p className="text-sm text-zinc-400">{item.period}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-300">
                  {item.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
        >
          <h2 className="text-2xl font-semibold text-white">Contact</h2>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Open to internships, collaborative research, and software projects
            in cybersecurity and development.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <a
              href="tel:8078404468"
              className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              8078404468
            </a>
            <a
              href="mailto:aaryannamboothiri@gmail.com"
              className="rounded-full bg-white px-4 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-200"
            >
              aaryannamboothiri@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/aaryannampoothiri"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/aaryannampoothiri"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              GitHub
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              Download CV
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
