"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { experienceApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Briefcase } from "lucide-react";

export function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: experiences = [] } = useQuery({
    queryKey: ["experiences"],
    queryFn: experienceApi.getAll,
  });

  return (
    <section
      className="section-padding border-t border-white/[0.04] bg-[#0A0A14]"
      ref={ref}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-yellow" />
            <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
              Experience
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Work History
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-6 top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-12 pl-8 md:pl-20">
            {(
              experiences as Array<{
                id: string;
                company: string;
                role: string;
                type: string;
                locationType: string;
                startDate: string;
                endDate?: string;
                current: boolean;
                description: string[];
                companyUrl?: string;
              }>
            ).map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-8 md:-left-20 top-1 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-brand-yellow bg-[#08080F]" />
                </div>

                <div className="card-glass card-hover p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-xl text-white">
                          {exp.role}
                        </h3>
                        <span className="tag-pill">{exp.type}</span>
                        <span className="tag-pill">{exp.locationType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={12} className="text-brand-yellow" />
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-yellow font-body text-sm hover:underline"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span className="text-brand-yellow font-body text-sm">
                            {exp.company}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-white/30 shrink-0">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? formatDate(exp.endDate)
                          : ""}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {exp.description.map((point, pi) => (
                      <li
                        key={pi}
                        className="flex items-start gap-3 text-sm text-white/50"
                      >
                        <span className="text-brand-yellow mt-1 shrink-0">
                          ▸
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
