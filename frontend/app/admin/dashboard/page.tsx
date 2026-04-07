"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { messagesApi, projectsApi, blogApi, skillsApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import {
  FolderKanban,
  MessageSquare,
  BookOpen,
  Wrench,
  ArrowRight,
  TrendingUp,
  Eye,
  Clock,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: messages = [] } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => messagesApi.getAll(),
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectsApi.getAll({ published: "all" }),
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: blogApi.getAllAdmin,
  });
  const { data: skillCats = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  const unread = (messages as Array<{ status: string }>).filter(
    (m) => m.status === "UNREAD",
  ).length;
  const publishedPosts = (posts as Array<{ published: boolean }>).filter(
    (p) => p.published,
  ).length;
  const totalSkills = (skillCats as Array<{ skills: unknown[] }>).reduce(
    (acc, c) => acc + c.skills.length,
    0,
  );

  const STATS = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Blog Posts",
      value: publishedPosts,
      icon: BookOpen,
      href: "/admin/blog",
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Skills",
      value: totalSkills,
      icon: Wrench,
      href: "/admin/skills",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Unread Messages",
      value: unread,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-brand-yellow",
      bg: "bg-brand-yellow/10",
      highlight: unread > 0,
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display font-extrabold text-4xl text-white mb-2">
          Good morning,{" "}
          <span className="text-brand-yellow">{user?.name?.split(" ")[0]}</span>{" "}
          👋
        </h1>
        <p className="text-white/40 text-sm font-mono">
          Here&apos;s an overview of your personal brand.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={stat.href}
              className={cn(
                "card-glass card-hover p-6 flex items-start justify-between group block",
                stat.highlight && "border-brand-yellow/20",
              )}
            >
              <div>
                <div className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
                  {stat.label}
                </div>
                <div className="font-display font-extrabold text-4xl text-white">
                  {stat.value}
                </div>
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  stat.bg,
                )}
              >
                <stat.icon size={18} className={stat.color} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 card-glass p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-white">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1 text-xs font-mono text-white/30 hover:text-brand-yellow transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {(
              messages as Array<{
                id: string;
                name: string;
                email: string;
                subject: string;
                status: string;
                createdAt: string;
              }>
            )
              .slice(0, 5)
              .map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-yellow/10 flex items-center justify-center text-xs font-display font-bold text-brand-yellow shrink-0">
                    {msg.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-white truncate">
                        {msg.name}
                      </span>
                      {msg.status === "UNREAD" && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-brand-yellow" />
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">
                      {msg.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-white/25 shrink-0">
                    <Clock size={10} />
                    {timeAgo(msg.createdAt)}
                  </div>
                </div>
              ))}
            {messages.length === 0 && (
              <p className="text-center py-8 text-sm text-white/30 font-mono">
                No messages yet.
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-glass p-6"
        >
          <h2 className="font-display font-bold text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Add New Project",
                href: "/admin/projects?new=1",
                icon: FolderKanban,
              },
              {
                label: "Write Blog Post",
                href: "/admin/blog?new=1",
                icon: BookOpen,
              },
              { label: "Update Skills", href: "/admin/skills", icon: Wrench },
              {
                label: "View Messages",
                href: "/admin/messages",
                icon: MessageSquare,
              },
              {
                label: "Site Settings",
                href: "/admin/settings",
                icon: TrendingUp,
              },
              { label: "Visit Site", href: "/", icon: Eye },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 p-3 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.03] transition-all group"
              >
                <Icon size={14} className="text-brand-yellow" />
                {label}
                <ArrowRight
                  size={12}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
