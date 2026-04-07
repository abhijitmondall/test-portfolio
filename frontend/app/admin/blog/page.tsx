"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { blogApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X } from "lucide-react";
import { formatDateLong, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  tags: z.string(),
  thumbnail: z.string().optional(),
  readingTime: z.coerce.number().default(5),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});
type FormData = z.infer<typeof schema>;

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  thumbnail?: string;
  readingTime: number;
  published: boolean;
  featured: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
};

export default function AdminBlogPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: blogApi.getAllAdmin,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const openCreate = () => {
    reset({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      readingTime: 5,
      published: false,
      featured: false,
    });
    setEditing(null);
    setModal("create");
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    reset({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags.join(", "),
      thumbnail: p.thumbnail || "",
      readingTime: p.readingTime,
      published: p.published,
      featured: p.featured,
    });
    setModal("edit");
  };

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      blogApi.create({
        ...data,
        tags: data.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Post created!");
      setModal(null);
    },
    onError: () => toast.error("Failed to create post."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      blogApi.update(editing!.id, {
        ...data,
        tags: data.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Post updated!");
      setModal(null);
    },
    onError: () => toast.error("Failed to update post."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Deleted.");
    },
  });

  const togglePublish = (p: Post) =>
    updateMutation.mutate({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      tags: p.tags.join(", "),
      readingTime: p.readingTime,
      published: !p.published,
      featured: p.featured,
    } as FormData);

  const onSubmit = (data: FormData) =>
    modal === "edit"
      ? updateMutation.mutate(data)
      : createMutation.mutate(data);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white mb-1">
            Blog
          </h1>
          <p className="text-sm text-white/40 font-mono">
            {posts.length} posts
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="card-glass overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-white/[0.03] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  "Title",
                  "Tags",
                  "Views",
                  "Reading Time",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-mono text-white/30 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(posts as Post[]).map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-white max-w-xs truncate">
                      {post.title}
                    </div>
                    <div className="text-xs text-white/30 font-mono mt-0.5">
                      /{post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t) => (
                        <span key={t} className="tag-pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40 font-mono">
                    {post.views}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/40 font-mono">
                    {post.readingTime} min
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(post)}
                      className={cn(
                        "text-xs font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors",
                        post.published
                          ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
                          : "bg-white/5 text-white/40 hover:bg-green-500/10 hover:text-green-400",
                      )}
                    >
                      {post.published ? (
                        <>
                          <Eye size={10} /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={10} /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-white/30">
                    {timeAgo(post.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 text-white/30 hover:text-brand-yellow transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this post?"))
                            deleteMutation.mutate(post.id);
                        }}
                        className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {posts.length === 0 && !isLoading && (
          <div className="text-center py-16 text-white/30 font-mono text-sm">
            No posts yet. Write your first one!
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl card-glass p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {modal === "edit" ? "Edit Post" : "New Post"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="admin-label">Title *</label>
                  <input
                    {...register("title")}
                    className="admin-input"
                    placeholder="Post title"
                  />
                  {errors.title && (
                    <p className="admin-error">{errors.title.message}</p>
                  )}
                </div>
                <div>
                  <label className="admin-label">Excerpt *</label>
                  <textarea
                    {...register("excerpt")}
                    rows={3}
                    className="admin-input resize-none"
                    placeholder="Brief summary..."
                  />
                  {errors.excerpt && (
                    <p className="admin-error">{errors.excerpt.message}</p>
                  )}
                </div>
                <div>
                  <label className="admin-label">Content (Markdown) *</label>
                  <textarea
                    {...register("content")}
                    rows={12}
                    className="admin-input resize-none font-mono text-xs"
                    placeholder="# Your content here..."
                  />
                  {errors.content && (
                    <p className="admin-error">{errors.content.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="admin-label">
                      Tags (comma separated)
                    </label>
                    <input
                      {...register("tags")}
                      className="admin-input"
                      placeholder="React, Next.js"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Reading Time (min)</label>
                    <input
                      {...register("readingTime")}
                      type="number"
                      className="admin-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Thumbnail URL</label>
                  <input
                    {...register("thumbnail")}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("published")}
                      className="admin-checkbox"
                    />
                    <span className="text-sm text-white/60">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="admin-checkbox"
                    />
                    <span className="text-sm text-white/60">Featured</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="btn-outline flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="btn-primary flex-1 justify-center disabled:opacity-60"
                  >
                    {modal === "edit" ? "Update" : "Publish"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
