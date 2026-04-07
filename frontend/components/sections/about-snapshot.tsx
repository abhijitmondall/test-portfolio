"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Briefcase,
  GraduationCap,
  MapPin,
} from "lucide-react";

const STATS = [
  { label: "Years Experience", value: "5+" },
  { label: "Projects Delivered", value: "30+" },
  { label: "Happy Clients", value: "20+" },
  { label: "GitHub Repos", value: "18" },
];

export function AboutSnapshot() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding border-t border-white/[0.04]" ref={ref}>
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-brand-yellow" />
                <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
                  About Me
                </span>
              </div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white leading-tight mb-6">
                Where life is all about
                <span className="text-brand-yellow"> critical thinking</span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-6">
                I&apos;m a Full-Stack Engineer from Bangladesh with 5+ years of
                crafting scalable, production-grade web applications. I
                specialize in the MERN stack, Next.js, and TypeScript.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                From freelancing on Upwork and Fiverr to leading front-end
                architecture at Agency Handy, I&apos;ve honed my skills in
                building fast, accessible, and beautiful digital experiences.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <MapPin size={14} className="text-brand-yellow" />
                  Dhaka, Bangladesh
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Briefcase size={14} className="text-brand-yellow" />
                  Open to Freelance & Full-time
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <GraduationCap size={14} className="text-brand-yellow" />
                  BSc CSE, National University
                </div>
              </div>

              <Link href="/about" className="btn-outline inline-flex">
                More About Me
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Right - Stats grid */}
          <div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="card-glass card-hover p-8"
                >
                  <div className="font-display font-extrabold text-4xl text-brand-yellow mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech marquee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 card-glass p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={14} className="text-brand-yellow" />
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                  Primary Stack
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "Next.js",
                  "Node.js",
                  "TypeScript",
                  "PostgreSQL",
                  "Prisma",
                  "MongoDB",
                ].map((tech) => (
                  <span key={tech} className="tag-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
