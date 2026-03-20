"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Contact = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: string;
};

const emptyForm = { label: "", value: "", href: "", icon: "" };

const iconOptions = ["✉️", "💼", "🐙", "📱", "🌐", "🐦", "📸", "💬"];

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchContacts(); }, []);

  async function fetchContacts() {
    const { data } = await supabase.from("contacts").select("*");
    if (data) setContacts(data);
  }

  async function save() {
    if (!form.label || !form.value) return setMsg("Label dan value wajib diisi!");
    setLoading(true);
    if (editId) {
      await supabase.from("contacts").update(form).eq("id", editId);
      setMsg("Kontak berhasil diupdate!");
    } else {
      await supabase.from("contacts").insert([form]);
      setMsg("Kontak berhasil ditambahkan!");
    }
    setForm(emptyForm);
    setEditId(null);
    fetchContacts();
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function remove(id: string) {
    if (!confirm("Hapus kontak ini?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    fetchContacts();
  }

  function startEdit(c: Contact) {
    setForm({ label: c.label, value: c.value, href: c.href, icon: c.icon });
    setEditId(c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Kontak</h1>
        <p className="text-white/40 text-sm mt-1">Kelola info kontak yang ditampilkan di portofolio</p>
      </div>

      {/* Form */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <h2 className="font-semibold mb-4 text-sm text-white/60 uppercase tracking-widest">
          {editId ? "Edit Kontak" : "Tambah Kontak"}
        </h2>

        {msg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {msg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Label</label>
            <input
              placeholder="Email / LinkedIn / GitHub"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-10 h-10 rounded-xl text-lg transition-all ${
                    form.icon === ic
                      ? "bg-[#F1FF5E]/20 border-2 border-[#F1FF5E]"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Value (yang ditampilkan)</label>
            <input
              placeholder="amirullah@email.com"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-xs uppercase tracking-widest">Link / Href</label>
            <input
              placeholder="mailto:email@kamu.com"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={save}
            disabled={loading}
            className="px-6 py-2.5 bg-[#F1FF5E] text-black font-bold rounded-xl text-sm hover:shadow-[0_0_20px_#F1FF5E40] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : editId ? "Update Kontak" : "Tambah Kontak"}
          </button>
          {editId && (
            <button
              onClick={() => { setForm(emptyForm); setEditId(null); }}
              className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-xl text-sm hover:bg-white/15 transition-all"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {contacts.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">Belum ada kontak.</div>
        )}
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
            <span className="text-2xl">{c.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{c.label}</p>
              <p className="text-white/40 text-xs truncate">{c.value}</p>
              <p className="text-white/20 text-xs truncate">{c.href}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(c)}
                className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs hover:bg-blue-500/20 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => remove(c.id)}
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