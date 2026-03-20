"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const navLinks = [
  { href: "/admin/dashboard", label: "Overview", icon: "📊" },
  { href: "/admin/dashboard/projects", label: "Projects", icon: "🗂️" },
  { href: "/admin/dashboard/about", label: "About Me", icon: "👤" },
  { href: "/admin/dashboard/techstack", label: "Tech Stack", icon: "⚙️" },
  { href: "/admin/dashboard/contacts", label: "Kontak", icon: "📬" },
  { href: "/admin/dashboard/messages", label: "Pesan Masuk", icon: "✉️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
      } else {
        setUserEmail(session.user.email ?? "");
      }
    }
    checkAuth();
  }, [router]);

  // Tutup sidebar saat navigasi di mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  const currentPage = navLinks.find((l) => l.pathname === pathname) ?? navLinks.find((l) => pathname.startsWith(l.href));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">

      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-60 shrink-0 border-r border-white/10 flex flex-col
        bg-[#0a0a0f] transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F1FF5E]/10 border border-[#F1FF5E]/20 flex items-center justify-center text-lg shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm">Admin Panel</p>
              <p className="text-white/30 text-xs truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#F1FF5E] text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0f] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}