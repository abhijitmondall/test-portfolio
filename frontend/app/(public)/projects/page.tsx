"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { projectsApi } from "@/lib/api";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Full-Stack", "Frontend", "Backend", "Mobile"];

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.getAll(),
  });

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p: Record<string, unknown>) => p.category === active);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-yellow" />
            <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
              Portfolio
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6">
            All Projects<span className="text-brand-yellow">.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            A collection of projects I&apos;ve built — from full-stack
            applications to frontend experiences.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-mono transition-all duration-200",
                active === cat
                  ? "bg-brand-yellow text-[#08080F] font-semibold"
                  : "border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {isLoading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="card-glass p-8 animate-pulse h-56" />
                ))
              : filtered.map((project: Record<string, unknown>, i: number) => (
                  <motion.div
                    key={project.id as string}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group card-glass card-hover p-8 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="tag-pill mb-3 inline-block">
                          {project.category as string}
                        </span>
                        <h2 className="font-display font-bold text-xl text-white group-hover:text-brand-yellow transition-colors">
                          {project.title as string}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {Boolean(project.githubUrl) && (
                          <a
                            href={project.githubUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {Boolean(project.liveUrl) && (
                          <a
                            href={project.liveUrl as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg border border-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/10 transition-all"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-white/50 leading-relaxed flex-1 mb-6">
                      {project.description as string}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {((project.techStack as string[]) || [])
                        .slice(0, 4)
                        .map((t: string) => (
                          <span key={t} className="tag-pill">
                            {t}
                          </span>
                        ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug as string}`}
                      className="flex items-center gap-2 text-xs font-mono text-white/30 hover:text-brand-yellow transition-colors mt-auto"
                    >
                      View Details <ArrowRight size={12} />
                    </Link>
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-24 text-white/30 font-mono">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
