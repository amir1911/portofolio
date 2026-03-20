"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Tech = {
  id: string;
  name: string;
  icon: string;
};

const emptyForm = { name: "", icon: "" };

const iconSuggestions = [
  { name: "React", icon: "SiReact" },
  { name: "Next.js", icon: "SiNextdotjs" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "Laravel", icon: "SiLaravel" },
  { name: "PHP", icon: "SiPhp" },
  { name: "MySQL", icon: "SiMysql" },
  { name: "HTML5", icon: "SiHtml5" },
  { name: "CSS3", icon: "FaCss3Alt" },
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "Git", icon: "SiGit" },
  { name: "Docker", icon: "SiDocker" },
  { name: "PostgreSQL", icon: "SiPostgresql" },
];

export default function AdminTechStack() {
  const [techs, setTechs] = useState<Tech[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchTechs(); }, []);

  async function fetchTechs() {
    const { data } = await supabase.from("tech_stack").select("*").order("name");
    if (data) setTechs(data);
  }

  async function add() {
    if (!form.name || !form.icon) return setMsg("Nama dan icon wajib diisi!");
    setLoading(true);
    await supabase.from("tech_stack").insert([form]);
    setForm(emptyForm);
    fetchTechs();
    setMsg("Tech stack berhasil ditambahkan!");
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function remove(id: string) {
    if (!confirm("Hapus tech ini?")) return;
    await supabase.from("tech_stack").delete().eq("id", id);
    fetchTechs();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tech Stack</h1>
        <p className="text-white/40 text-sm mt-1">Kelola teknologi yang ditampilkan di portofolio</p>
      </div>

      {/* Form */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <h2 className="font-semibold mb-4 text-sm text-white/60 uppercase tracking-widest">Tambah Teknologi</h2>

        {msg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Nama Teknologi</label>
            <input
              placeholder="React"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Nama Icon (react-icons)</label>
            <input
              placeholder="SiReact"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="mb-4">
          <p className="text-white/30 text-xs mb-2">Pilih cepat:</p>
          <div className="flex flex-wrap gap-2">
            {iconSuggestions.map((s) => (
              <button
                key={s.icon}
                onClick={() => setForm({ name: s.name, icon: s.icon })}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 hover:text-white transition-all"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={add}
          disabled={loading}
          className="px-6 py-2.5 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_20px_#F1FF5E40] hover:scale-[1.02] transition-all disabled:opacity-50"
        >
          {loading ? "Menambahkan..." : "Tambah Teknologi"}
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {techs.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/30 text-sm">Belum ada tech stack.</div>
        )}
        {techs.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
            <div>
              <p className="font-medium text-sm">{t.name}</p>
              <p className="text-white/30 text-xs">{t.icon}</p>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-red-400/50 hover:text-red-400 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}