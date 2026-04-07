"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { skillsApi } from "@/lib/api";

export function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: categories = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  return (
    <section className="section-padding border-t border-white/[0.04]" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-yellow" />
            <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
              Skills
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Technical Expertise
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(
            categories as Array<{
              id: string;
              name: string;
              skills: Array<{ id: string; name: string; level: number }>;
            }>
          ).map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: ci * 0.15 }}
              className="card-glass p-8"
            >
              <h3 className="font-display font-bold text-lg text-white mb-6">
                {cat.name}
              </h3>
              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <div key={skill.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-body text-white/70">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-white/30">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-px bg-white/[0.06] relative overflow-hidden rounded-full">
                      <motion.div
                        className="skill-bar-fill absolute top-0 left-0"
                        initial={{ width: 0 }}
                        animate={
                          inView ? { width: `${skill.level}%` } : { width: 0 }
                        }
                        transition={{
                          duration: 1.2,
                          delay: ci * 0.15 + si * 0.07,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
