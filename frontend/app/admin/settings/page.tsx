"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { profileApi, socialApi, authApi } from "@/lib/api";
import { Save, Plus, Trash2, Lock } from "lucide-react";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
};

export default function AdminSettingsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"profile" | "social" | "password">("profile");

  // Profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });
  const profileForm = useForm<Record<string, unknown>>();

  useEffect(() => {
    if (profile) profileForm.reset(profile);
  }, [profile]);

  const profileMutation = useMutation({
    mutationFn: (data: unknown) => profileApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  // Social links
  const { data: socials = [] } = useQuery({
    queryKey: ["social"],
    queryFn: socialApi.getAll,
  });
  const [newSocial, setNewSocial] = useState({
    platform: "",
    url: "",
    icon: "",
    order: 0,
  });

  const socialMutations = {
    create: useMutation({
      mutationFn: socialApi.create,
      onSuccess: () => qc.invalidateQueries({ queryKey: ["social"] }),
    }),
    delete: useMutation({
      mutationFn: (id: string) => socialApi.delete(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["social"] });
        toast.success("Deleted.");
      },
    }),
  };

  // Password
  const pwForm = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();
  const pwMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed!");
      pwForm.reset();
    },
    onError: () => toast.error("Failed. Check current password."),
  });

  const onPwSubmit = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    pwMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "social", label: "Social Links" },
    { id: "password", label: "Password" },
  ] as const;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl text-white mb-1">
          Settings
        </h1>
        <p className="text-sm text-white/40 font-mono">
          Manage your personal brand content
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-white/[0.06] pb-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 text-sm font-mono transition-all relative ${tab === t.id ? "text-brand-yellow" : "text-white/40 hover:text-white/70"}`}
          >
            {t.label}
            {tab === t.id && (
              <motion.div
                layoutId="settings-tab"
                className="absolute bottom-0 left-0 right-0 h-px bg-brand-yellow"
              />
            )}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-8 max-w-2xl"
        >
          <h2 className="font-display font-bold text-xl text-white mb-6">
            Public Profile
          </h2>
          <form
            onSubmit={profileForm.handleSubmit((d) =>
              profileMutation.mutate(d),
            )}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="admin-label">Full Name</label>
                <input
                  {...profileForm.register("name")}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Title</label>
                <input
                  {...profileForm.register("title")}
                  className="admin-input"
                />
              </div>
              <div className="col-span-2">
                <label className="admin-label">Tagline</label>
                <input
                  {...profileForm.register("tagline")}
                  className="admin-input"
                />
              </div>
              <div className="col-span-2">
                <label className="admin-label">Bio</label>
                <textarea
                  {...profileForm.register("bio")}
                  rows={5}
                  className="admin-input resize-none"
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input
                  {...profileForm.register("email")}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Phone</label>
                <input
                  {...profileForm.register("phone")}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Location</label>
                <input
                  {...profileForm.register("location")}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Resume URL</label>
                <input
                  {...profileForm.register("resumeUrl")}
                  className="admin-input"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...profileForm.register("available")}
                    className="admin-checkbox"
                  />
                  <span className="text-sm text-white/60">
                    Available for work
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="btn-primary disabled:opacity-60"
            >
              <Save size={14} />{" "}
              {profileMutation.isPending ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </motion.div>
      )}

      {tab === "social" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl space-y-4"
        >
          <div className="card-glass p-6">
            <h2 className="font-display font-bold text-lg text-white mb-5">
              Add Social Link
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="admin-label">Platform</label>
                <input
                  value={newSocial.platform}
                  onChange={(e) =>
                    setNewSocial((p) => ({ ...p, platform: e.target.value }))
                  }
                  className="admin-input"
                  placeholder="GitHub"
                />
              </div>
              <div>
                <label className="admin-label">Icon key</label>
                <input
                  value={newSocial.icon}
                  onChange={(e) =>
                    setNewSocial((p) => ({ ...p, icon: e.target.value }))
                  }
                  className="admin-input"
                  placeholder="github"
                />
              </div>
              <div className="col-span-2">
                <label className="admin-label">URL</label>
                <input
                  value={newSocial.url}
                  onChange={(e) =>
                    setNewSocial((p) => ({ ...p, url: e.target.value }))
                  }
                  className="admin-input"
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              onClick={() => {
                socialMutations.create.mutate(newSocial);
                setNewSocial({ platform: "", url: "", icon: "", order: 0 });
                toast.success("Added!");
              }}
              className="btn-primary text-sm py-2"
            >
              <Plus size={14} /> Add Link
            </button>
          </div>

          <div className="card-glass p-6">
            <h2 className="font-display font-bold text-lg text-white mb-5">
              Current Links
            </h2>
            <div className="space-y-3">
              {(socials as SocialLink[]).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]"
                >
                  <div>
                    <span className="font-semibold text-sm text-white">
                      {s.platform}
                    </span>
                    <span className="text-xs text-white/30 font-mono ml-3">
                      {s.url}
                    </span>
                  </div>
                  <button
                    onClick={() => socialMutations.delete.mutate(s.id)}
                    className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {socials.length === 0 && (
                <p className="text-sm text-white/30 font-mono text-center py-4">
                  No social links yet.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {tab === "password" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-8 max-w-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock size={18} className="text-brand-yellow" />
            <h2 className="font-display font-bold text-xl text-white">
              Change Password
            </h2>
          </div>
          <form
            onSubmit={pwForm.handleSubmit(onPwSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="admin-label">Current Password</label>
              <input
                {...pwForm.register("currentPassword")}
                type="password"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">New Password</label>
              <input
                {...pwForm.register("newPassword")}
                type="password"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Confirm New Password</label>
              <input
                {...pwForm.register("confirmPassword")}
                type="password"
                className="admin-input"
              />
            </div>
            <button
              type="submit"
              disabled={pwMutation.isPending}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {pwMutation.isPending ? "Changing..." : "Change Password"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
