"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  description: string;
  img: string;
  url_website: string;
  url_github: string;
  tools: string[];
  created_at: string;
};

const emptyForm = {
  title: "",
  description: "",
  img: "",
  url_website: "",
  url_github: "",
  tools: [] as string[],
};

// Warna badge otomatis berdasarkan hash nama tool
function toolColor(tool: string) {
  const colors = [
    "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "bg-red-500/20 text-red-300 border-red-500/30",
    "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    "bg-teal-500/20 text-teal-300 border-teal-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < tool.length; i++) hash = tool.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [msg, setMsg] = useState({ text: "", type: "success" });
  // State untuk input tools (string mentah, pisah koma)
  const [toolsInput, setToolsInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  }

  function showMsg(text: string, type: "success" | "error" = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  }

  // Parse tools dari string "React, Next.js, Tailwind" → ["React", "Next.js", "Tailwind"]
  function parseTools(raw: string): string[] {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showMsg("Ukuran file maksimal 5MB!", "error");
    if (!file.type.startsWith("image/")) return showMsg("File harus berupa gambar!", "error");

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const { error } = await supabase.storage
      .from("projects")
      .upload(fileName, file, { upsert: true });

    if (error) {
      setUploading(false);
      return showMsg("Upload gagal: " + error.message, "error");
    }

    const { data: urlData } = supabase.storage.from("projects").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, img: urlData.publicUrl }));
    setUploading(false);
    showMsg("Gambar berhasil diupload!");
  }

  async function save() {
    if (!form.title) return showMsg("Judul wajib diisi!", "error");
    setLoading(true);

    const payload = {
      ...form,
      tools: parseTools(toolsInput),
    };

    if (editId) {
      await supabase.from("projects").update(payload).eq("id", editId);
      showMsg("Project berhasil diupdate!");
    } else {
      await supabase.from("projects").insert([payload]);
      showMsg("Project berhasil ditambahkan!");
    }

    setForm(emptyForm);
    setToolsInput("");
    setPreview("");
    setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
    fetchProjects();
    setLoading(false);
  }

  async function remove(id: string, imgUrl: string) {
    if (!confirm("Hapus project ini?")) return;
    if (imgUrl?.includes("supabase")) {
      const fileName = imgUrl.split("/").pop();
      if (fileName) await supabase.storage.from("projects").remove([fileName]);
    }
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  function startEdit(p: Project) {
    setForm({
      title: p.title,
      description: p.description,
      img: p.img,
      url_website: p.url_website ?? "",
      url_github: p.url_github ?? "",
      tools: Array.isArray(p.tools) ? p.tools : [],
    });
    setToolsInput(Array.isArray(p.tools) ? p.tools.join(", ") : "");
    setPreview(p.img);
    setEditId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setToolsInput("");
    setPreview("");
    setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // Preview tools yang akan disimpan (real-time dari input)
  const previewTools = parseTools(toolsInput);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-white/40 text-sm mt-1">
          Kelola project yang ditampilkan di portofolio
        </p>
      </div>

      {/* ── Form ── */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <h2 className="font-semibold mb-4 text-sm text-white/60 uppercase tracking-widest">
          {editId ? "Edit Project" : "Tambah Project Baru"}
        </h2>

        {msg.text && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
              msg.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Judul */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Judul</label>
            <input
              placeholder="Nama project"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* Upload Gambar */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Gambar Project</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-[#F1FF5E]/50 transition-all cursor-pointer group"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">Gambar dipilih</p>
                    <p className="text-white/30 text-xs">Klik untuk ganti</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">
                    🖼️
                  </div>
                  <div>
                    <p className="text-white/60 text-sm group-hover:text-white transition-colors">
                      {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
                    </p>
                    <p className="text-white/20 text-xs">PNG, JPG, WEBP — maks 5MB</p>
                  </div>
                </>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-[#F1FF5E] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* URL manual */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">
              Atau URL Gambar Manual
            </label>
            <input
              placeholder="/assets/project/foto.png"
              value={form.img}
              onChange={(e) => {
                setForm({ ...form, img: e.target.value });
                setPreview(e.target.value);
              }}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-white/40 text-xs uppercase tracking-widest">Deskripsi</label>
            <textarea
              rows={3}
              placeholder="Deskripsi singkat project"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all resize-none"
            />
          </div>

          {/* URL Website */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
              🌐 Link Website
              <span className="text-white/20 normal-case tracking-normal">(opsional)</span>
            </label>
            <input
              placeholder="https://namaproject.com"
              value={form.url_website}
              onChange={(e) => setForm({ ...form, url_website: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* URL GitHub */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
              🐙 Link GitHub
              <span className="text-white/20 normal-case tracking-normal">(opsional)</span>
            </label>
            <input
              placeholder="https://github.com/username/repo"
              value={form.url_github}
              onChange={(e) => setForm({ ...form, url_github: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* ════════════════════════════════════════
              TOOLS YANG DIGUNAKAN — ketik manual
          ════════════════════════════════════════ */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-white/40 text-xs uppercase tracking-widest flex items-center gap-2">
              🔧 Tools yang Digunakan
              <span className="text-white/20 normal-case tracking-normal">(opsional)</span>
            </label>

            <input
              placeholder="Contoh: React, Next.js, Tailwind CSS, MySQL"
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />

            <p className="text-white/25 text-xs">
              Pisahkan setiap tool dengan tanda koma &nbsp;
              <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/40">
                ,
              </span>
            </p>

            {/* Preview badge real-time */}
            {previewTools.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1 p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-white/25 text-xs w-full mb-1">Preview:</span>
                {previewTools.map((t) => (
                  <span
                    key={t}
                    className={`px-3 py-1 rounded-lg border text-xs font-medium ${toolColor(t)}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* ════════════════════════════════════════ */}

        </div>

        {/* Preview gambar */}
        {preview && (
          <div className="mt-4">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Preview Gambar</p>
            <img
              src={preview}
              alt="preview"
              className="w-full max-w-sm h-40 object-cover rounded-xl border border-white/10"
            />
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={save}
            disabled={loading || uploading}
            className="px-6 py-2.5 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_20px_#F1FF5E40] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : editId ? "Update Project" : "Tambah Project"}
          </button>
          {editId && (
            <button
              onClick={cancelEdit}
              className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-xl text-sm hover:bg-white/15 transition-all"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* ── List Projects ── */}
      <div className="flex flex-col gap-3">
        {projects.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">
            Belum ada project. Tambahkan sekarang!
          </div>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            {p.img ? (
              <img
                src={p.img}
                alt={p.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                🖼️
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.title}</p>
              <p className="text-white/40 text-sm truncate mt-0.5">{p.description}</p>

              {/* Tools badges */}
              {Array.isArray(p.tools) && p.tools.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.tools.map((t) => (
                    <span
                      key={t}
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-medium ${toolColor(t)}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="flex gap-3 mt-2">
                {p.url_website && (
                  <a
                    href={p.url_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-400 text-xs hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
                {p.url_github && (
                  <a
                    href={p.url_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-purple-400 text-xs hover:underline"
                  >
                    🐙 GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0 mt-0.5">
              <button
                onClick={() => startEdit(p)}
                className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs hover:bg-blue-500/20 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => remove(p.id, p.img)}
                className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}