"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminAbout() {
  const [form, setForm] = useState({ name: "", title: "", bio: "", avatar_url: "" });
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchAbout() {
      const { data } = await supabase.from("about").select("*").limit(1).single();
      if (data) {
        setForm({ name: data.name, title: data.title, bio: data.bio, avatar_url: data.avatar_url });
        setAboutId(data.id);
      }
    }
    fetchAbout();
  }, []);

  function showMsg(text: string, type: "success" | "error" = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return showMsg("Ukuran file maksimal 5MB!", "error");
    if (!file.type.startsWith("image/")) return showMsg("File harus berupa gambar!", "error");

    setUploading(true);

    const fileName = `avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true });

    if (error) {
      setUploading(false);
      return showMsg("Upload gagal: " + error.message, "error");
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, avatar_url: urlData.publicUrl }));
    setUploading(false);
    showMsg("Foto berhasil diupload!");
  }

  async function save() {
    setLoading(true);
    if (aboutId) {
      await supabase.from("about").update(form).eq("id", aboutId);
    } else {
      const { data } = await supabase.from("about").insert([form]).select().single();
      if (data) setAboutId(data.id);
    }
    showMsg("Bio berhasil disimpan!");
    setLoading(false);
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">About Me</h1>
        <p className="text-white/40 text-sm mt-1">Edit informasi tentang dirimu</p>
      </div>

      <div className="max-w-2xl p-6 rounded-2xl bg-white/5 border border-white/10">
        {msg.text && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
            msg.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}>
            {msg.text}
          </div>
        )}

        <div className="flex flex-col gap-4">

          {/* ── Upload Foto ── */}
          <div className="flex flex-col gap-2">
            <label className="text-white/40 text-xs uppercase tracking-widest">Foto Profil</label>
            <div className="flex items-center gap-4">

              {/* Preview avatar */}
              <div className="relative shrink-0">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center text-2xl">
                    👤
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-[#F1FF5E] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Tombol upload */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15 transition-all disabled:opacity-50"
                >
                  {uploading ? "Mengupload..." : "📷 Upload Foto"}
                </button>
                <p className="text-white/20 text-xs">PNG, JPG, WEBP — maks 5MB</p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Atau URL manual */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-white/30 text-xs">Atau masukkan URL manual</label>
              <input
                placeholder="/assets/profile/foto.jpg"
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
              />
            </div>
          </div>

          {/* ── Nama ── */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Nama</label>
            <input
              placeholder="Nama kamu"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* ── Title ── */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Title / Posisi</label>
            <input
              placeholder="Junior Web Developer"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* ── Bio ── */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Bio</label>
            <textarea
              rows={6}
              placeholder="Ceritakan tentang dirimu..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all resize-none"
            />
          </div>

          <button
            onClick={save}
            disabled={loading || uploading}
            className="py-3 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_20px_#F1FF5E40] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Bio"}
          </button>
        </div>
      </div>
    </div>
  );
}