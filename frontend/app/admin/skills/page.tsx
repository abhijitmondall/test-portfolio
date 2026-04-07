"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { skillsApi } from "@/lib/api";
import { Plus, Pencil, Trash2, X, FolderPlus } from "lucide-react";

type Skill = { id: string; name: string; level: number; order: number };
type Category = {
  id: string;
  name: string;
  icon?: string;
  order: number;
  skills: Skill[];
};

export default function AdminSkillsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"cat" | "skill" | null>(null);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [activeCatId, setActiveCatId] = useState<string>("");

  const { data: categories = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: skillsApi.getAll,
  });

  const {
    register: regCat,
    handleSubmit: hsCat,
    reset: resetCat,
  } = useForm<{ name: string; icon: string; order: number }>();
  const {
    register: regSkill,
    handleSubmit: hsSkill,
    reset: resetSkill,
  } = useForm<{ name: string; level: number; order: number }>();

  const catMutations = {
    create: useMutation({
      mutationFn: skillsApi.createCategory,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Category created!");
        setModal(null);
      },
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: unknown }) =>
        skillsApi.updateCategory(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Updated!");
        setModal(null);
      },
    }),
    delete: useMutation({
      mutationFn: skillsApi.deleteCategory,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Deleted.");
      },
    }),
  };

  const skillMutations = {
    create: useMutation({
      mutationFn: skillsApi.create,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Skill added!");
        setModal(null);
      },
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: unknown }) =>
        skillsApi.update(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Updated!");
        setModal(null);
      },
    }),
    delete: useMutation({
      mutationFn: skillsApi.delete,
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["skills"] });
        toast.success("Deleted.");
      },
    }),
  };

  const openCatModal = (cat?: Category) => {
    setEditCat(cat || null);
    resetCat(
      cat
        ? { name: cat.name, icon: cat.icon || "", order: cat.order }
        : { name: "", icon: "", order: 0 },
    );
    setModal("cat");
  };

  const openSkillModal = (catId: string, skill?: Skill) => {
    setActiveCatId(catId);
    setEditSkill(skill || null);
    resetSkill(
      skill
        ? { name: skill.name, level: skill.level, order: skill.order }
        : { name: "", level: 80, order: 0 },
    );
    setModal("skill");
  };

  const onCatSubmit = (data: { name: string; icon: string; order: number }) =>
    editCat
      ? catMutations.update.mutate({ id: editCat.id, data })
      : catMutations.create.mutate(data);

  const onSkillSubmit = (data: {
    name: string;
    level: number;
    order: number;
  }) =>
    editSkill
      ? skillMutations.update.mutate({ id: editSkill.id, data })
      : skillMutations.create.mutate({ ...data, categoryId: activeCatId });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white mb-1">
            Skills
          </h1>
          <p className="text-sm text-white/40 font-mono">
            {(categories as Category[]).length} categories
          </p>
        </div>
        <button onClick={() => openCatModal()} className="btn-primary">
          <FolderPlus size={15} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(categories as Category[]).map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-white">
                {cat.name}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openSkillModal(cat.id)}
                  className="flex items-center gap-1.5 text-xs font-mono text-brand-yellow hover:bg-brand-yellow/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={12} /> Add Skill
                </button>
                <button
                  onClick={() => openCatModal(cat)}
                  className="p-1.5 text-white/30 hover:text-brand-yellow transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete category and all its skills?"))
                      catMutations.delete.mutate(cat.id);
                  }}
                  className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {cat.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4 group">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/70">
                        {skill.name}
                      </span>
                      <span className="text-xs font-mono text-white/30">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-px bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openSkillModal(cat.id, skill)}
                      className="p-1 text-white/30 hover:text-brand-yellow transition-colors"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete skill?"))
                          skillMutations.delete.mutate(skill.id);
                      }}
                      className="p-1 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
              {cat.skills.length === 0 && (
                <p className="text-xs text-white/20 font-mono text-center py-4">
                  No skills yet.
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {modal === "cat" && (
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md card-glass p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {editCat ? "Edit Category" : "New Category"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={hsCat(onCatSubmit)} className="space-y-4">
                <div>
                  <label className="admin-label">Name *</label>
                  <input
                    {...regCat("name")}
                    className="admin-input"
                    placeholder="e.g. Frontend"
                  />
                </div>
                <div>
                  <label className="admin-label">Icon</label>
                  <input
                    {...regCat("icon")}
                    className="admin-input"
                    placeholder="e.g. monitor"
                  />
                </div>
                <div>
                  <label className="admin-label">Order</label>
                  <input
                    {...regCat("order")}
                    type="number"
                    className="admin-input"
                  />
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
                    className="btn-primary flex-1 justify-center"
                  >
                    {editCat ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {modal === "skill" && (
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md card-glass p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-white">
                  {editSkill ? "Edit Skill" : "Add Skill"}
                </h2>
                <button
                  onClick={() => setModal(null)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={hsSkill(onSkillSubmit)} className="space-y-4">
                <div>
                  <label className="admin-label">Skill Name *</label>
                  <input
                    {...regSkill("name")}
                    className="admin-input"
                    placeholder="e.g. React.js"
                  />
                </div>
                <div>
                  <label className="admin-label">
                    Proficiency Level ({"%"})
                  </label>
                  <input
                    {...regSkill("level")}
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    className="w-full accent-brand-yellow"
                  />
                </div>
                <div>
                  <label className="admin-label">Order</label>
                  <input
                    {...regSkill("order")}
                    type="number"
                    className="admin-input"
                  />
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
                    className="btn-primary flex-1 justify-center"
                  >
                    {editSkill ? "Update" : "Add"}
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
