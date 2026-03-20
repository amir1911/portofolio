"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Comment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#F1FF5E]/60 focus:bg-white/[0.08] transition-all duration-300";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ name }: { name: string }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-pink-500", "bg-indigo-500"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "bg-purple-500";
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
      {initial}
    </div>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => { fetchComments(); }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("messages")
      .select("id, name, message, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    if (data) setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    const { error } = await supabase.from("messages").insert([form]);
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    }
    setLoading(false);
    setTimeout(() => setStatus("idle"), 5000);
  }

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Form kirim pesan ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {status === "success" && (
          <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
            <span>✅</span> Pesan terkirim! Akan ditampilkan setelah disetujui.
          </div>
        )}
        {status === "error" && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span>❌</span> Gagal mengirim pesan. Coba lagi ya.
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-medium">Nama</label>
          <input
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-medium">Email</label>
          <input
            type="email"
            placeholder="email@kamu.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-medium">Pesan</label>
          <textarea
            rows={4}
            placeholder="Tulis pesanmu di sini..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className={`${inputClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full py-3 px-6 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm sm:text-base hover:shadow-[0_0_30px_#F1FF5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </span>
          ) : "Kirim Pesan →"}
        </button>
      </form>

      {/* ── Komentar publik ── */}
      {comments.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-white/60 text-sm font-semibold uppercase tracking-widest">
              Komentar
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/40 text-xs">
              {comments.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {visibleComments.map((c) => (
              <div key={c.id} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Avatar name={c.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-white">{c.name}</p>
                    <span className="text-white/20 text-xs">{timeAgo(c.created_at)}</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{c.message}</p>
                </div>
              </div>
            ))}
          </div>

          {comments.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm hover:bg-white/10 hover:text-white transition-all"
            >
              {showAll ? "Tampilkan lebih sedikit ↑" : `Lihat ${comments.length - 3} komentar lainnya ↓`}
            </button>
          )}
        </div>
      )}

    </div>
  );
}