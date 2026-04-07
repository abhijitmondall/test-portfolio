"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { projectsApi } from "@/lib/api";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Star,
  StarOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  longDesc: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  techStack: z.string(),
  tags: z.string(),
  category: z.string().optional(),
  order: z.coerce.number().default(0),
});
type FormData = z.infer<typeof schema>;

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDesc?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  published: boolean;
  techStack: string[];
  tags: string[];
  category?: string;
  order: number;
};

export default function AdminProjectsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectsApi.getAll({ published: "all" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    reset({
      title: "",
      description: "",
      techStack: "",
      tags: "",
      featured: false,
      published: true,
      order: 0,
    });
    setEditing(null);
    setModal("create");
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    reset({
      title: p.title,
      description: p.description,
      longDesc: p.longDesc || "",
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      featured: p.featured,
      published: p.published,
      techStack: p.techStack.join(", "),
      tags: p.tags.join(", "),
      category: p.category || "",
      order: p.order,
    });
    setModal("edit");
  };

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      projectsApi.create({
        ...data,
        techStack: data.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: data.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project created!");
      setModal(null);
    },
    onError: () => toast.error("Failed to create project."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) =>
      projectsApi.update(editing!.id, {
        ...data,
        techStack: data.techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: data.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project updated!");
      setModal(null);
    },
    onError: () => toast.error("Failed to update project."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success("Project deleted.");
    },
    onError: () => toast.error("Failed to delete."),
  });

  const toggleFeature = (p: Project) =>
    updateMutation.mutate({
      ...p,
      techStack: p.techStack.join(", "),
      tags: p.tags.join(", "),
      featured: !p.featured,
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
            Projects
          </h1>
          <p className="text-sm text-white/40 font-mono">
            {projects.length} projects total
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glass p-5 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  "Title",
                  "Category",
                  "Tech Stack",
                  "Status",
                  "Featured",
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
              {(projects as Project[]).map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-sm text-white">
                      {p.title}
                    </div>
                    <div className="text-xs text-white/30 font-mono mt-0.5">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="tag-pill">{p.category || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-xs font-mono text-white/30 bg-white/[0.04] px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                      {p.techStack.length > 3 && (
                        <span className="text-xs font-mono text-white/20">
                          +{p.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-xs font-mono px-2.5 py-1 rounded-full",
                        p.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/5 text-white/30",
                      )}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeature(p)}
                      className="text-white/30 hover:text-brand-yellow transition-colors"
                    >
                      {p.featured ? (
                        <Star
                          size={16}
                          className="text-brand-yellow fill-brand-yellow"
                        />
                      ) : (
                        <StarOff size={16} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-white/30 hover:text-white transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-white/30 hover:text-white transition-colors"
                        >
                          <Github size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-white/30 hover:text-brand-yellow transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?"))
                            deleteMutation.mutate(p.id);
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
          {projects.length === 0 && (
            <div className="text-center py-16 text-white/30 font-mono text-sm">
              No projects yet. Create one!
            </div>
          )}
        </div>
      )}

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
              className="relative w-full max-w-2xl card-glass p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {modal === "edit" ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="admin-label">Title *</label>
                    <input
                      {...register("title")}
                      className="admin-input"
                      placeholder="Project name"
                    />
                    {errors.title && (
                      <p className="admin-error">{errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="admin-label">Category</label>
                    <select {...register("category")} className="admin-input">
                      <option value="">Select...</option>
                      {[
                        "Full-Stack",
                        "Frontend",
                        "Backend",
                        "Mobile",
                        "Other",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Order</label>
                    <input
                      {...register("order")}
                      type="number"
                      className="admin-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">Short Description *</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="admin-input resize-none"
                    />
                    {errors.description && (
                      <p className="admin-error">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">Long Description</label>
                    <textarea
                      {...register("longDesc")}
                      rows={4}
                      className="admin-input resize-none"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Live URL</label>
                    <input
                      {...register("liveUrl")}
                      className="admin-input"
                      placeholder="https://"
                    />
                  </div>
                  <div>
                    <label className="admin-label">GitHub URL</label>
                    <input
                      {...register("githubUrl")}
                      className="admin-input"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      {...register("techStack")}
                      className="admin-input"
                      placeholder="React, Node.js, PostgreSQL"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="admin-label">
                      Tags (comma separated)
                    </label>
                    <input
                      {...register("tags")}
                      className="admin-input"
                      placeholder="Full-Stack, SaaS"
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
                    {modal === "edit" ? "Update" : "Create"}
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
