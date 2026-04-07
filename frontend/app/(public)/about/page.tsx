"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { profileApi, experienceApi, educationApi, skillsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Download,
} from "lucide-react";

export default function AboutPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });
  const { data: experiences = [] } = useQuery({
    queryKey: ["experiences"],
    queryFn: experienceApi.getAll,
  });
  const { data: education = [] } = useQuery({
    queryKey: ["education"],
    queryFn: educationApi.getAll,
  });
  const { data: skillCats = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  return (
    <div className="min-h-screen pt-32 pb-20" ref={ref}>
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-yellow" />
            <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
              About
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3">
              <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6">
                {profile?.name || "Abhijit Mondal"}
                <span className="text-brand-yellow">.</span>
              </h1>
              <p className="text-white/40 text-lg font-mono mb-6">
                {profile?.title || "Full-Stack Engineer"}
              </p>
              <p className="text-white/60 leading-relaxed text-lg mb-6">
                {profile?.bio ||
                  "I'm a Full-Stack Engineer from Bangladesh with 5+ years of experience crafting scalable, production-grade web applications."}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {profile?.location && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <MapPin size={14} className="text-brand-yellow" />
                    {profile.location}
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Mail size={14} className="text-brand-yellow" />
                    {profile.email}
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <Phone size={14} className="text-brand-yellow" />
                    {profile.phone}
                  </div>
                )}
              </div>
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex"
                >
                  <Download size={14} /> Download Resume
                </a>
              )}
            </div>
            <div className="lg:col-span-2">
              <div className="card-glass p-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-green-400">
                    {profile?.available
                      ? "Available for work"
                      : "Currently busy"}
                  </span>
                </div>
                <p className="text-xs text-white/30 mt-1">
                  Open to freelance & full-time opportunities
                </p>
                <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-3">
                  {[
                    { label: "Experience", value: "5+ Years" },
                    { label: "Projects", value: "30+ Delivered" },
                    { label: "Location", value: "Bangladesh 🇧🇩" },
                    { label: "Languages", value: "Bengali, English" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs font-mono text-white/30 uppercase tracking-wider">
                        {label}
                      </span>
                      <span className="text-sm text-white/70">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="font-display font-bold text-3xl text-white mb-8">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {(
              skillCats as Array<{
                id: string;
                name: string;
                skills: Array<{ id: string; name: string; level: number }>;
              }>
            ).map((cat) => (
              <div key={cat.id} className="card-glass p-6">
                <h3 className="font-display font-bold text-sm text-white/60 uppercase tracking-widest mb-4">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span key={skill.id} className="tag-pill">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience + Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase size={18} className="text-brand-yellow" />
              <h2 className="font-display font-bold text-2xl text-white">
                Work Experience
              </h2>
            </div>
            <div className="space-y-6">
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
                  transition={{ delay: i * 0.1 }}
                  className="card-glass p-6 relative pl-8 before:absolute before:left-4 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-brand-yellow/50"
                >
                  <div className="font-display font-bold text-white mb-1">
                    {exp.role}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-brand-yellow text-sm">
                      {exp.company}
                    </span>
                    <span className="tag-pill">{exp.locationType}</span>
                    <span className="text-xs font-mono text-white/30">
                      {formatDate(exp.startDate)} —{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                          ? formatDate(exp.endDate)
                          : ""}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {exp.description.slice(0, 2).map((pt, pi) => (
                      <li
                        key={pi}
                        className="text-xs text-white/40 flex items-start gap-2"
                      >
                        <span className="text-brand-yellow mt-0.5 shrink-0">
                          ▸
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap size={18} className="text-brand-yellow" />
              <h2 className="font-display font-bold text-2xl text-white">
                Education
              </h2>
            </div>
            <div className="space-y-6">
              {(
                education as Array<{
                  id: string;
                  institution: string;
                  degree: string;
                  field: string;
                  startDate: string;
                  endDate?: string;
                  current: boolean;
                }>
              ).map((edu) => (
                <div key={edu.id} className="card-glass p-6">
                  <div className="font-display font-bold text-white mb-1">
                    {edu.degree}
                  </div>
                  <div className="text-brand-yellow text-sm mb-1">
                    {edu.field}
                  </div>
                  <div className="text-sm text-white/50 mb-2">
                    {edu.institution}
                  </div>
                  <div className="text-xs font-mono text-white/30">
                    {formatDate(edu.startDate)} —{" "}
                    {edu.current
                      ? "Present"
                      : edu.endDate
                        ? formatDate(edu.endDate)
                        : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
