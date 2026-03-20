"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [counts, setCounts] = useState({
    projects: 0,
    techstack: 0,
    contacts: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      const [{ count: p }, { count: t }, { count: c }] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("tech_stack").select("*", { count: "exact", head: true }),
        supabase.from("contacts").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ projects: p ?? 0, techstack: t ?? 0, contacts: c ?? 0 });
    }
    fetchCounts();
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: counts.projects,
      icon: "🗂️",
      href: "/admin/dashboard/projects",
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      label: "Tech Stack",
      value: counts.techstack,
      icon: "⚙️",
      href: "/admin/dashboard/techstack",
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      label: "Kontak",
      value: counts.contacts,
      icon: "📬",
      href: "/admin/dashboard/contacts",
      color: "from-green-500/20 to-green-500/5",
    },
  ];

  const quickLinks = [
    { label: "Tambah Project Baru", href: "/admin/dashboard/projects", icon: "➕" },
    { label: "Edit Bio", href: "/admin/dashboard/about", icon: "✏️" },
    { label: "Kelola Tech Stack", href: "/admin/dashboard/techstack", icon: "⚙️" },
    { label: "Update Kontak", href: "/admin/dashboard/contacts", icon: "📬" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 sm:px-6 lg:px-10 py-6 sm:py-8">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          Overview
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">
          Selamat datang di dashboard portofolio kamu
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-br ${s.color} border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">{s.icon}</span>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {s.value}
              </span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm font-medium">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-[10px] sm:text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 sm:mb-4">
          Aksi Cepat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.label}
              href={q.href}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <span className="text-lg sm:text-xl">{q.icon}</span>

              <span className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                {q.label}
              </span>

              <span className="ml-auto text-white/20 group-hover:text-white/60 transition-colors">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}