"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { projectsApi } from "@/lib/api";

export function FeaturedProjects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: projects = [] } = useQuery({
    queryKey: ["projects", "featured"],
    queryFn: () => projectsApi.getAll({ featured: "true" }),
  });

  return (
    <section
      className="section-padding border-t border-white/[0.04] bg-[#0A0A14]"
      ref={ref}
    >
      <div className="section-container">
        <div className="flex items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-brand-yellow" />
              <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
                Featured Work
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white">
              Selected Projects
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-2 text-sm font-mono text-white/40 hover:text-brand-yellow transition-colors"
            >
              All Projects <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="space-y-6">
          {projects.length === 0
            ? // Skeleton fallback
              [1, 2].map((i) => (
                <div key={i} className="card-glass p-8 animate-pulse">
                  <div className="h-6 bg-white/5 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                </div>
              ))
            : projects.map((project: Record<string, unknown>, i: number) => (
                <motion.div
                  key={project.id as string}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group card-glass card-hover p-8 md:p-10"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-xs font-mono text-white/20 pt-1">
                          0{i + 1}
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-2xl text-white group-hover:text-brand-yellow transition-colors mb-2">
                            {project.title as string}
                          </h3>
                          <p className="text-white/50 text-sm leading-relaxed max-w-xl">
                            {project.description as string}
                          </p>
                        </div>
                      </div>
                      <div className="ml-8 flex flex-wrap gap-2 mt-4">
                        {((project.techStack as string[]) || []).map(
                          (tech: string) => (
                            <span key={tech} className="tag-pill">
                              {tech}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {Boolean(project.githubUrl) && (
                        <a
                          href={project.githubUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {Boolean(project.liveUrl) && (
                        <a
                          href={project.liveUrl as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg border border-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/10 transition-all"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug as string}`}
                        className="p-3 rounded-lg bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 transition-all"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center md:hidden"
        >
          <Link href="/projects" className="btn-outline">
            All Projects <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
