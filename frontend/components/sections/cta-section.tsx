"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding border-t border-white/[0.04]" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl p-16 md:p-24 text-center"
          style={{
            background: "linear-gradient(135deg, #0F0F1A 0%, #141420 100%)",
            border: "1px solid rgba(232,255,0,0.08)",
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(232,255,0,0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-brand-yellow/20 bg-brand-yellow/5">
              <Mail size={12} className="text-brand-yellow" />
              <span className="text-xs font-mono text-brand-yellow">
                abhijeetmondal5@gmail.com
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-6xl text-white mb-6">
              Have a project in mind?
              <br />
              <span className="text-brand-yellow">Let&apos;s build it.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-lg mx-auto mb-10">
              I&apos;m currently available for freelance work and full-time
              opportunities. Let&apos;s create something remarkable together.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="btn-primary text-base px-8 py-4">
                Start a Conversation
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://www.fiverr.com/developer_avi"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base px-8 py-4"
              >
                Hire on Fiverr
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
