"use client";

import Link from "next/link";
import { Github, Linkedin, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const SOCIALS = [
  { href: "https://github.com/abhijitmondall", icon: Github, label: "GitHub" },
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
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#08080F]">
      {/* Ticker */}
      <div className="border-b border-white/[0.05] py-4 overflow-hidden">
        <div className="ticker-inner">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-8 px-8 text-xs font-mono text-white/20 uppercase tracking-widest"
            >
              <span>Full-Stack Engineer</span>
              <span className="text-brand-yellow">✦</span>
              <span>React · Next.js · Node.js</span>
              <span className="text-brand-yellow">✦</span>
              <span>Open to Opportunities</span>
              <span className="text-brand-yellow">✦</span>
              <span>Based in Bangladesh</span>
              <span className="text-brand-yellow">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center">
                <span className="font-display font-extrabold text-sm text-[#08080F]">
                  AM
                </span>
              </div>
              <span className="font-display font-bold text-white">
                Abhijit Mondal
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Full-Stack Engineer building scalable web applications with clean
              code and critical thinking.
            </p>
            <div className="mt-6 flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-mono">
                Available for work
              </span>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-brand-yellow transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-widest">
              Connect
            </h4>
            <ul className="space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-yellow transition-colors group"
                  >
                    {s.icon ? <s.icon size={14} /> : <ExternalLink size={14} />}
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © {new Date().getFullYear()} Abhijit Mondal. All rights reserved.
          </p>
          <p className="text-xs text-white/25 font-mono">
            Built with Next.js · Express · PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
