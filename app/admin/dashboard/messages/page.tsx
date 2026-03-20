"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  is_approved: boolean;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "approved" | "pending">("all");
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  }

  async function markRead(id: string) {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    fetchMessages();
  }

  async function toggleApprove(id: string, current: boolean) {
    await supabase.from("messages").update({ is_approved: !current }).eq("id", id);
    fetchMessages();
    setSelected((prev) => prev?.id === id ? { ...prev, is_approved: !current } : prev);
  }

  async function remove(id: string) {
    if (!confirm("Hapus pesan ini?")) return;
    await supabase.from("messages").delete().eq("id", id);
    if (selected?.id === id) setSelected(null);
    fetchMessages();
  }

  async function markAllRead() {
    await supabase.from("messages").update({ is_read: true }).eq("is_read", false);
    fetchMessages();
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "approved") return m.is_approved;
    if (filter === "pending") return !m.is_approved;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const pendingCount = messages.filter((m) => !m.is_approved).length;

  function formatDate(str: string) {
    return new Date(str).toLocaleString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 flex-wrap">
            Pesan Masuk
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#F1FF5E] text-black text-xs font-bold">
                {unreadCount} baru
              </span>
            )}
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-400 text-black text-xs font-bold">
                {pendingCount} menunggu
              </span>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-1">Setujui pesan agar tampil di portofolio</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: "all", label: "Semua" },
          { key: "unread", label: "Belum dibaca" },
          { key: "pending", label: "Menunggu persetujuan" },
          { key: "approved", label: "Ditampilkan" },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-[#F1FF5E] text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

        {/* List pesan */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-white/30 text-sm">Tidak ada pesan.</div>
          )}
          {filtered.map((m) => (
            <div
              key={m.id}
              onClick={async () => {
                setSelected(m);
                if (!m.is_read) await markRead(m.id);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selected?.id === m.id
                  ? "bg-white/10 border-[#F1FF5E]/40"
                  : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  {!m.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[#F1FF5E] shrink-0" />
                  )}
                  <p className={`font-semibold text-sm truncate ${!m.is_read ? "text-white" : "text-white/70"}`}>
                    {m.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {m.is_approved ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-xs border border-green-500/20">
                      Tampil
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs border border-orange-500/20">
                      Pending
                    </span>
                  )}
                  <p className="text-white/30 text-xs">{formatDate(m.created_at)}</p>
                </div>
              </div>
              <p className="text-white/40 text-xs truncate">{m.email}</p>
              <p className="text-white/50 text-sm mt-1 line-clamp-2">{m.message}</p>
            </div>
          ))}
        </div>

        {/* Detail pesan */}
        {selected ? (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 sticky top-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="font-bold text-lg">{selected.name}</p>
                <a
                  href={`mailto:${selected.email}`}
                  className="text-[#F1FF5E] text-sm hover:underline"
                >
                  {selected.email}
                </a>
              </div>
              <p className="text-white/30 text-xs text-right shrink-0">
                {formatDate(selected.created_at)}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>

            {/* Status badge */}
            <div className="mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-sm">
              <span>Status komentar:</span>
              {selected.is_approved ? (
                <span className="text-green-400 font-semibold">✅ Ditampilkan di portofolio</span>
              ) : (
                <span className="text-orange-400 font-semibold">⏳ Belum ditampilkan</span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => toggleApprove(selected.id, selected.is_approved)}
                className={`px-4 py-2 font-bold rounded-xl text-sm transition-all ${
                  selected.is_approved
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                }`}
              >
                {selected.is_approved ? "❌ Sembunyikan" : "✅ Tampilkan di portofolio"}
              </button>
              <a
                href={`mailto:${selected.email}?subject=Re: Pesan dari ${selected.name}`}
                className="px-4 py-2 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_15px_#F1FF5E40] transition-all"
              >
                ✉️ Balas
              </a>
              <button
                onClick={() => remove(selected.id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center h-48 rounded-2xl bg-white/5 border border-white/10 border-dashed">
            <p className="text-white/20 text-sm">Pilih pesan untuk melihat detail</p>
          </div>
        )}

      </div>
    </div>
  );
}