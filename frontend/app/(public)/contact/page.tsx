"use client";

import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { messagesApi } from "@/lib/api";
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Send,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  body: z.string().min(20, "Message must be at least 20 characters"),
});
type FormData = z.infer<typeof schema>;

const SOCIALS = [
  {
    href: "https://github.com/abhijitmondall",
    icon: Github,
    label: "GitHub",
    handle: "@abhijitmondall",
  },
  {
    href: "https://www.linkedin.com/in/abhijitmondall/",
    icon: Linkedin,
    label: "LinkedIn",
    handle: "abhijitmondall",
  },
  {
    href: "https://www.fiverr.com/developer_avi",
    icon: ExternalLink,
    label: "Fiverr",
    handle: "developer_avi",
  },
  {
    href: "https://www.upwork.com/freelancers/~01532b67b472bb704f",
    icon: ExternalLink,
    label: "Upwork",
    handle: "Abhijit Mondal",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => messagesApi.send(data),
    onSuccess: () => {
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    },
    onError: () => toast.error("Failed to send. Please try emailing directly."),
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-brand-yellow" />
            <span className="text-xs font-mono text-brand-yellow uppercase tracking-widest">
              Contact
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6">
            Let&apos;s Work
            <br />
            <span className="text-brand-yellow">Together.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Have a project, job opportunity, or just want to say hello? My inbox
            is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit((d) => mutation.mutate(d))}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-brand-yellow/50 transition-colors"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-brand-yellow/50 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Subject */}
              <div>
                <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  {...register("subject")}
                  placeholder="Project inquiry, collaboration, etc."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-brand-yellow/50 transition-colors"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              {/* Message */}
              <div>
                <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  {...register("body")}
                  rows={6}
                  placeholder="Tell me about your project or idea..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-brand-yellow/50 transition-colors resize-none"
                />
                {errors.body && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.body.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Sending..." : "Send Message"}
                <Send size={15} />
              </button>
            </form>
          </motion.div>

          {/* Info sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card-glass p-8">
              <h3 className="font-display font-bold text-white mb-6">
                Contact Info
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-brand-yellow" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/30 mb-1">
                      Email
                    </div>
                    <a
                      href="mailto:abhijeetmondal5@gmail.com"
                      className="text-sm text-white hover:text-brand-yellow transition-colors"
                    >
                      abhijeetmondal5@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-brand-yellow" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/30 mb-1">
                      Location
                    </div>
                    <span className="text-sm text-white">
                      Dhaka, Bangladesh
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass p-8">
              <h3 className="font-display font-bold text-white mb-6">
                Find Me Online
              </h3>
              <div className="space-y-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <s.icon
                        size={15}
                        className="text-white/40 group-hover:text-brand-yellow transition-colors"
                      />
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        {s.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-white/30">
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card-glass p-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-mono text-green-400">
                  Currently Available
                </span>
              </div>
              <p className="text-sm text-white/40">
                Open to freelance projects and full-time opportunities. Typical
                response time: 24 hours.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
