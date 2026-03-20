"use client";

import { useState, useEffect } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
}

export default function Navbar({ items }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setOpen(false);
  };

  return (
    <>
      {/* ===================== DESKTOP NAVBAR ===================== */}
      <div
        className={`
          hidden md:flex
          fixed top-5 left-1/2 -translate-x-1/2 z-50
          items-center gap-1 px-2 py-2 rounded-full border
          transition-all duration-300
          ${scrolled
            ? "bg-black/70 backdrop-blur-xl border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-[#1C0770]/60 backdrop-blur-md border-white/10"
          }
        `}
      >
        {items.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => handleClick(index)}
            className={`
              relative px-5 py-2 rounded-full text-sm font-semibold
              transition-all duration-300
              ${activeIndex === index
                ? "bg-white text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {item.label}
            {activeIndex === index && (
              <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F1FF5E]" />
            )}
          </a>
        ))}
      </div>

      {/* ===================== MOBILE TOP BAR ===================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14
        bg-[#0e0433]/80 backdrop-blur-md border-b border-white/10"
      >
        {/* Hamburger — pojok KIRI atas */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg
            border border-white/15 bg-white/5 hover:border-[#F1FF5E]/50 transition-all duration-300"
        >
          <span className={`block w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300
            ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300
            ${open ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300
            ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>

        {/* Brand — kanan */}
        <span className="text-white font-bold text-base tracking-wider">
          Amirullah
        </span>
      </div>

      {/* ===================== BACKDROP ===================== */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* ===================== DRAWER — SLIDE DARI KIRI ===================== */}
      <div
        className={`
          md:hidden fixed top-0 left-0 z-[70]
          h-full w-[72vw] max-w-[260px]
          bg-[#0a0228]/95 backdrop-blur-2xl
          border-r border-white/10
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 shrink-0">
          <span className="text-[#F1FF5E] font-bold text-sm tracking-widest uppercase">
            Navigasi
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup"
            className="text-white/40 hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 px-3 pt-5">
          {items.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => handleClick(index)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-semibold tracking-wide
                transition-all duration-200
                ${activeIndex === index
                  ? "bg-[#F1FF5E] text-black"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <span className={`font-mono text-xs w-4 shrink-0
                ${activeIndex === index ? "text-black/40" : "text-white/25"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
              <span className={`ml-auto text-xs transition-all duration-200
                ${activeIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`}>
                →
              </span>
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-5 py-5 border-t border-white/10">
          <p className="text-white/25 text-[11px] font-mono">© 2024 Amirullah</p>
          <p className="text-white/15 text-[10px] font-mono mt-0.5">Junior Web Developer</p>
        </div>
      </div>
    </>
  );
}