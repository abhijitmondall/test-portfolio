"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowDown, Github, Linkedin, ExternalLink } from "lucide-react";

const ROLES = [
  "Full-Stack Engineer",
  "React Developer",
  "Next.js Expert",
  "Node.js Developer",
  "Freelancer",
];

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const role = ROLES[roleIndex];
    if (typing) {
      if (displayed.length < role.length) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(role.slice(0, displayed.length + 1)),
          80,
        );
      } else {
        timeoutRef.current = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          40,
        );
      } else {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, typing, roleIndex]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,255,0,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Noise */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(232,255,0,0.04) 0%, transparent 70%)",
        }}
        animate={{ y: [0, 20, 0], scale: [1, 0.95, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="section-container relative z-10 pt-32 pb-20">
        <div className="max-w-5xl">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-green-400">
              Available for new projects
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-6xl md:text-8xl lg:text-[110px] leading-none tracking-tight mb-6"
          >
            <span className="text-white">Abhijit</span>
            <br />
            <span className="text-white">Mondal</span>
            <span className="text-brand-yellow">.</span>
          </motion.h1>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="text-white/30 font-mono text-sm">→</span>
            <span className="font-mono text-xl md:text-2xl text-brand-yellow">
              {displayed}
              <span className="animate-cursor-blink">|</span>
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white/50 text-lg md:text-xl max-w-xl leading-relaxed mb-12"
          >
            Building scalable, production-grade web applications with clean code
            and critical thinking. Based in{" "}
            <span className="text-white/70">Dhaka, Bangladesh</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap items-center gap-4 mb-16"
          >
            <Link href="/projects" className="btn-primary">
              View My Work
              <ArrowDown size={14} className="-rotate-90" />
            </Link>
            <Link href="/contact" className="btn-outline">
              Let&apos;s Talk
            </Link>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex items-center gap-6"
          >
            {[
              {
                href: "https://github.com/abhijitmondall",
                icon: Github,
                label: "GitHub",
              },
              {
                href: "https://www.linkedin.com/in/abhijitmondall/",
                icon: Linkedin,
                label: "LinkedIn",
              },
              { href: "https://www.fiverr.com/developer_avi", label: "Fiverr" },
              {
                href: "https://www.upwork.com/freelancers/~01532b67b472bb704f",
                label: "Upwork",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-brand-yellow transition-colors group"
              >
                {social.icon ? (
                  <social.icon size={14} />
                ) : (
                  <ExternalLink size={12} />
                )}
                <span>{social.label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 right-8 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-white/20 uppercase tracking-widest rotate-90 mb-4">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-12 bg-gradient-to-b from-brand-yellow/50 to-transparent"
          />
        </motion.div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-32 right-8 md:right-16 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-48 h-48"
        >
          <div className="absolute inset-0 rounded-2xl border border-brand-yellow/10" />
          <div className="absolute inset-4 rounded-xl border border-brand-yellow/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display font-extrabold text-5xl text-brand-yellow">
                5+
              </div>
              <div className="text-xs font-mono text-white/30 mt-1">
                Years of
              </div>
              <div className="text-xs font-mono text-white/30">Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
