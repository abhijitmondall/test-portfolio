"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-[#08080F]">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center">
              <span className="font-display font-extrabold text-sm text-[#08080F]">
                AM
              </span>
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">
                Admin Panel
              </div>
              <div className="text-xs font-mono text-white/30">
                Personal Brand
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all duration-150",
                  active
                    ? "admin-nav-active font-semibold"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]",
                )}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-yellow/20 flex items-center justify-center">
              <User size={14} className="text-brand-yellow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user?.name}
              </div>
              <div className="text-xs font-mono text-white/30 truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
