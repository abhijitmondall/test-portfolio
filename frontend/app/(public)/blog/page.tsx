"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { blogApi } from "@/lib/api";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { formatDateLong } from "@/lib/utils";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail?: string;
  tags: string[];
  views: number;
  readingTime: number;
  publishedAt?: string;
  createdAt: string;
};

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: () => blogApi.getAll(),
  });

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
              Blog
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6">
            Thoughts<span className="text-brand-yellow">.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Articles on web development, engineering practices, and tech
            insights.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-glass h-56 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 font-mono text-sm">
              No posts published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(posts as Post[]).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group card-glass card-hover p-8 flex flex-col"
              >
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="font-display font-bold text-xl text-white group-hover:text-brand-yellow transition-colors mb-3 flex-1">
                  {post.title}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-mono text-white/30">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {post.views}
                    </span>
                    <span>
                      {post.publishedAt ? formatDateLong(post.publishedAt) : ""}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-1 text-xs font-mono text-brand-yellow hover:gap-2 transition-all"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
