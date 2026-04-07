"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { messagesApi } from "@/lib/api";
import { Mail, Trash2, CheckCheck, Archive, X, Clock } from "lucide-react";
import { formatDateLong, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  UNREAD: "bg-brand-yellow/10 text-brand-yellow",
  READ: "bg-white/5 text-white/40",
  REPLIED: "bg-green-500/10 text-green-400",
  ARCHIVED: "bg-white/5 text-white/20",
};

export default function AdminMessagesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Message | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => messagesApi.getAll(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      messagesApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => messagesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Message deleted.");
      setSelected(null);
    },
  });

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (msg.status === "UNREAD")
      updateStatus.mutate({ id: msg.id, status: "READ" });
  };

  const filtered =
    filter === "ALL"
      ? messages
      : (messages as Message[]).filter((m) => m.status === filter);
  const unreadCount = (messages as Message[]).filter(
    (m) => m.status === "UNREAD",
  ).length;

  const FILTERS = [
    { label: "All", value: "ALL" },
    { label: `Unread (${unreadCount})`, value: "UNREAD" },
    { label: "Read", value: "READ" },
    { label: "Replied", value: "REPLIED" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl text-white mb-1">
          Messages
        </h1>
        <p className="text-sm text-white/40 font-mono">
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-mono transition-all",
              filter === f.value
                ? "bg-brand-yellow text-[#08080F] font-semibold"
                : "border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          {(filtered as Message[]).map((msg, i) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={cn(
                "flex items-start gap-4 px-6 py-5 cursor-pointer transition-colors border-b border-white/[0.04] last:border-0",
                "hover:bg-white/[0.02]",
                msg.status === "UNREAD" && "bg-brand-yellow/[0.02]",
              )}
            >
              <div className="w-9 h-9 rounded-full bg-brand-yellow/10 flex items-center justify-center text-xs font-display font-bold text-brand-yellow shrink-0">
                {msg.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "font-semibold text-sm",
                      msg.status === "UNREAD" ? "text-white" : "text-white/60",
                    )}
                  >
                    {msg.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-mono",
                      STATUS_COLORS[msg.status],
                    )}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-sm text-white/50 truncate font-semibold">
                  {msg.subject}
                </p>
                <p className="text-xs text-white/30 truncate mt-0.5">
                  {msg.body}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-white/25 shrink-0">
                <Clock size={10} />
                {timeAgo(msg.createdAt)}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/30 font-mono text-sm">
              <Mail size={32} className="mx-auto mb-3 opacity-30" />
              No messages here.
            </div>
          )}
        </div>
      )}

      {/* Message detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl card-glass p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-white mb-1">
                    {selected.subject}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <span className="font-semibold text-white/60">
                      {selected.name}
                    </span>
                    <a
                      href={`mailto:${selected.email}`}
                      className="hover:text-brand-yellow transition-colors"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <div className="text-xs font-mono text-white/25 mt-1">
                    {formatDateLong(selected.createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-white/[0.02] rounded-lg p-5 mb-6">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.body}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: selected.id, status: "REPLIED" })
                  }
                  className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <CheckCheck size={12} /> Mark Replied
                </button>
                <button
                  onClick={() =>
                    updateStatus.mutate({ id: selected.id, status: "ARCHIVED" })
                  }
                  className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Archive size={12} /> Archive
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) deleteMutation.mutate(selected.id);
                  }}
                  className="px-4 py-2 text-xs rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
