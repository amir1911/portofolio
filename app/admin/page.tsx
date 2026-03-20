"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function login() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push("/admin/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      
      {/* Container */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F1FF5E]/10 border border-[#F1FF5E]/20 mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">⚡</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Admin Panel
          </h1>

          <p className="text-white/40 text-xs sm:text-sm mt-1">
            Masuk untuk kelola portofolio
          </p>
        </div>

        {/* Card */}
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-white/40 text-[10px] sm:text-xs uppercase tracking-widest font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F1FF5E]/50 transition-all"
            />
          </div>

          {/* Button */}
          <button
            onClick={login}
            disabled={loading}
            className="mt-2 py-3 text-sm sm:text-base bg-[#F1FF5E] text-black font-bold rounded-xl hover:shadow-[0_0_25px_#F1FF5E60] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Masuk..." : "Masuk →"}
          </button>
        </div>

      </div>
    </div>
  );
}