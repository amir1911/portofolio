"use client";

import { useEffect, useState } from "react";
import Lanyard from "@/components/Lanyard";
import SplitText from "@/components/SplitText";
import AnimatedContent from "@/components/AnimatedContent";
import ShapeGrid from "@/components/ShapeGrid";
import ProfileCard from "@/components/ProfileCard";
import DarkVeil from "@/components/DarkVeil";
import BorderGlow from "@/components/BorderGlow";
import Navbar from "@/components/Navbar";
import LogoLoop from "@/components/LogoLoop";
import { supabase } from "@/lib/supabase";
import ContactForm from "@/components/ContactForm";
import {
  SiTailwindcss, SiReact, SiHtml5, SiLaravel, SiMysql, SiPhp,
  SiFlutter, SiGithub, SiCanva,
} from "react-icons/si";
import { FaCss3Alt, FaFigma } from "react-icons/fa";

// ─── Types ────────────────────────────────────────────────────────────────────
type Project = {
  id: string;
  title: string;
  description: string;
  img: string;
  url_website?: string;
  url_github?: string;
  tools?: string[];   // ← ditambahkan
};

type Contact = {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
};

type About = {
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
};

// ─── Static data ──────────────────────────────────────────────────────────────
const techLogos = [
  { img: <SiTailwindcss size={40} />, alt: "Tailwind CSS" },
  { img: <SiGithub size={40} />, alt: "GitHub" },
  { img: <SiReact size={40} />, alt: "React" },
  { img: <SiHtml5 size={40} />, alt: "HTML5" },
  { img: <FaCss3Alt size={40} />, alt: "CSS3" },
  { img: <SiLaravel size={40} />, alt: "Laravel" },
  { img: <SiMysql size={40} />, alt: "MySQL" },
  { img: <SiPhp size={40} />, alt: "PHP" },
  { img: <SiFlutter size={40} />, alt: "Flutter" },
  { img: <SiCanva size={40} />, alt: "Canva" },
  { img: <FaFigma size={40} />, alt: "Figma" },
];

const fallbackProjects: Project[] = [
  { id: "1", img: "/assets/profile/amir1.jpeg", title: "Website Organization", description: "Dashboard admin & manajemen anggota", tools: ["React", "Laravel", "MySQL"] },
  { id: "2", img: "/assets/project/project2.png", title: "To-Do App", description: "Aplikasi tugas dengan drag & drop", tools: ["Next.js", "Tailwind CSS"] },
  { id: "3", img: "/assets/project/project3.png", title: "Music App", description: "Aplikasi pencarian lagu & lirik", tools: ["React", "PHP"] },
];

const fallbackContacts: Contact[] = [
  { id: "1", icon: "✉️", label: "Email", value: "amirullah@email.com", href: "mailto:amirullah@email.com" },
  { id: "2", icon: "💼", label: "LinkedIn", value: "linkedin.com/in/amirullah", href: "https://linkedin.com/in/amirullah" },
  { id: "3", icon: "🐙", label: "GitHub", value: "github.com/amirullah", href: "https://github.com/amirullah" },
  { id: "4", icon: "📱", label: "WhatsApp", value: "+62 812-xxxx-xxxx", href: "https://wa.me/62812xxxxxxxx" },
];

const fallbackAbout: About = {
  name: "Amirullah",
  title: "Junior Web Developer",
  bio: "Halo! Saya Amirullah, seorang Junior Web Developer yang fokus pada pengembangan web modern.",
  avatar_url: "/assets/profile/amir1.jpeg",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [contacts, setContacts] = useState<Contact[]>(fallbackContacts);
  const [about, setAbout] = useState<About>(fallbackAbout);

  useEffect(() => {
    async function fetchData() {
      const [{ data: projectsData }, { data: contactsData }, { data: aboutData }] =
        await Promise.all([
          supabase.from("projects").select("*").order("created_at", { ascending: false }),
          supabase.from("contacts").select("*"),
          supabase.from("about").select("*").limit(1).single(),
        ]);
      if (projectsData && projectsData.length > 0) setProjects(projectsData);
      if (contactsData && contactsData.length > 0) setContacts(contactsData);
      if (aboutData) setAbout(aboutData);
    }
    fetchData();
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Project", href: "#project" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="bg-[#1C0770] text-white">

      {/* ═══════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════ */}
      <Navbar items={navItems} />

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section id="home" className="relative overflow-x-hidden bg-[#1C0770]">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ShapeGrid speed={0.5} direction="diagonal" borderColor="#271E37" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* ── MOBILE  (<768px) ── */}
        <div className="md:hidden relative z-10 flex flex-col min-h-screen">
          <div
            className="w-full flex-shrink-0 overflow-hidden pt-16"
            style={{ height: "90vh", touchAction: "none" }}
          >
            <Lanyard position={[0, 0, 22]} gravity={[0, -40, 0]} />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5 pb-10 relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">Halo</h1>
              <span className="px-3 py-1 bg-[#F1FF5E] text-black rounded-lg text-2xl font-bold">
                Welcome
              </span>
            </div>
            <div className="flex flex-col items-center">
              <SplitText text="Portofolio Amirullah" className="text-3xl font-bold text-white leading-tight" />
              <SplitText text="Junior Web Developer" className="text-lg font-semibold text-[#F1FF5E] mt-2" />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <a href="/cv-amirullah.pdf" download className="px-5 py-2 bg-[#F1FF5E] text-black font-semibold rounded-lg text-sm hover:shadow-[0_0_25px_#F1FF5E] hover:scale-105 transition-all duration-300">
                Download CV
              </a>
              <a href="#contact" className="px-5 py-2 border border-white text-white font-semibold rounded-lg text-sm hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
                Hubungi Saya
              </a>
            </div>
          </div>
        </div>

        {/* ── TABLET  (768px – 1023px) ── */}
        <div className="hidden md:flex lg:hidden relative z-10 flex-col min-h-screen">
          <div
            className="w-full flex-shrink-0 overflow-hidden pt-20"
            style={{ height: "55vh", touchAction: "none" }}
          >
            <Lanyard position={[0, 0, 18]} gravity={[0, -40, 0]} />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 px-8 pb-12 relative z-10">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Halo</h1>
              <span className="px-4 py-1 bg-[#F1FF5E] text-black rounded-lg text-3xl font-bold">Welcome</span>
            </div>
            <div className="flex flex-col items-center">
              <SplitText text="Portofolio Amirullah" className="text-4xl font-bold text-white" />
              <SplitText text="Junior Web Developer" className="text-xl font-semibold text-[#F1FF5E] mt-2" />
            </div>
            <div className="flex gap-4">
              <a href="/cv-amirullah.pdf" download className="px-6 py-2 bg-[#F1FF5E] text-black font-semibold rounded-lg hover:shadow-[0_0_25px_#F1FF5E] hover:scale-105 transition-all duration-300">
                Download CV
              </a>
              <a href="#contact" className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
                Hubungi Saya
              </a>
            </div>
          </div>
        </div>

        {/* ── DESKTOP  (≥1024px) ── */}
        <div className="hidden lg:grid grid-cols-12 relative z-10 min-h-screen px-10 items-center">
          <AnimatedContent className="col-span-6 flex items-center justify-start">
            <div className="flex flex-col gap-6 items-start">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">Halo</h1>
                <span className="px-4 py-1 bg-[#F1FF5E] text-black rounded-lg text-4xl font-bold hover:scale-110 hover:rotate-1 transition-all duration-300 cursor-default">
                  Welcome
                </span>
              </div>
              <div className="flex flex-col items-start">
                <SplitText text="Portofolio Amirullah" className="text-5xl xl:text-6xl font-bold text-white" />
                <SplitText text="Junior Web Developer" className="text-2xl xl:text-3xl font-semibold text-[#F1FF5E] mt-2" />
              </div>
              <div className="flex gap-4 mt-2">
                <a href="/cv-amirullah.pdf" download className="px-6 py-2 bg-[#F1FF5E] text-black font-semibold rounded-lg hover:shadow-[0_0_25px_#F1FF5E] hover:scale-105 transition-all duration-300">
                  Download CV
                </a>
                <a href="#contact" className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
                  Hubungi Saya
                </a>
              </div>
            </div>
          </AnimatedContent>

          <div
            className="col-span-6 flex items-center justify-center"
            style={{ height: "100vh", touchAction: "none" }}
          >
            <Lanyard position={[0, 0, 15]} gravity={[0, -40, 0]} />
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT + TECH + PROJECT + CONTACT + FOOTER
      ═══════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-black">

        <div className="absolute inset-0 z-0">
          <DarkVeil speed={0.1} warpAmount={5} />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* ─── ABOUT ─── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <AnimatedContent>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-14 md:mb-16">
              About <span className="text-[#F1FF5E]">Me</span>
            </h2>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-14 items-center mb-12 sm:mb-16">
            <AnimatedContent className="flex justify-center">
              <div className="hover:scale-105 transition duration-500 scale-90 sm:scale-100 origin-top">
                <ProfileCard
                  name={about.name}
                  title={about.title}
                  handle="amirrrrrr_1"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl={about.avatar_url}
                  miniAvatarUrl="/assets/profile/amir2.jpeg"
                  showUserInfo
                  enableTilt
                  enableMobileTilt
                  iconUrl="/assets/demo/iconpattern.png"
                  behindGlowEnabled
                  behindGlowColor="hsla(219, 100%, 70%, 0.6)"
                  innerGradient="linear-gradient(145deg,hsla(219, 40%, 45%, 0.55) 0%,hsla(165, 60%, 70%, 0.27) 100%)"
                />
              </div>
            </AnimatedContent>

            <AnimatedContent className="text-center md:text-left px-2 sm:px-0">
              <p className="text-white/80 text-base sm:text-lg mb-3 sm:mb-4 text-justify">
                Halo! Saya{" "}
                <span className="text-[#F1FF5E] font-semibold">{about.name}</span>,
                seorang {about.title} yang fokus pada pengembangan web dan mobile.
              </p>
              <p className="text-white/80 text-base sm:text-lg mb-3 sm:mb-4 text-justify">{about.bio}</p>
            </AnimatedContent>
          </div>
        </div>

        {/* ─── TECH STACK ─── */}
        <div className="relative z-10 w-full mb-20 sm:mb-24 md:mb-28">
          <AnimatedContent>
            <h3 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-8">
              Tools and technologies I use
            </h3>
          </AnimatedContent>
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            <LogoLoop
              logos={techLogos as any[]}
              speed={80}
              direction="left"
              logoHeight={72}
              gap={24}
              width="100%"
              hoverSpeed={20}
              scaleOnHover
              ariaLabel="Technology stack"
              renderItem={(item: any, key) => (
                <div
                  key={key}
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-purple-500/40 shadow-[0_0_12px_2px_rgba(139,92,246,0.25)] text-white/80 hover:border-purple-400 hover:bg-white/10 hover:shadow-[0_0_20px_4px_rgba(139,92,246,0.5)] transition-all duration-300"
                >
                  {item.img}
                </div>
              )}
            />
          </div>
        </div>

        {/* ─── PROJECT + CONTACT + FOOTER ─── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">

          {/* PROJECT */}
          <div id="project" className="mb-20 sm:mb-24 md:mb-28">
            <AnimatedContent>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-14 md:mb-16">
                My <span className="text-[#F1FF5E]">Projects</span>
              </h2>
            </AnimatedContent>
            <AnimatedContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                {projects.map((item) => (
                  <BorderGlow key={item.id} borderRadius={20}>
                    <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-4 sm:p-5">

                        {/* Judul */}
                        <h3 className="text-base sm:text-lg font-bold text-[#F1FF5E] translate-y-6 group-hover:translate-y-0 transition">
                          {item.title}
                        </h3>

                        {/* Deskripsi */}
                        <p className="text-xs sm:text-sm text-white/80 mt-2 translate-y-6 group-hover:translate-y-0 transition delay-100">
                          {item.description}
                        </p>

                        {/* Tools badges — pakai ternary agar tidak render "0" */}
                        {Array.isArray(item.tools) && item.tools.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2 translate-y-6 group-hover:translate-y-0 transition delay-150">
                            {item.tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white/70 text-[10px] font-medium"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Links */}
                        <div className="flex gap-3 mt-3 sm:mt-4 translate-y-6 group-hover:translate-y-0 transition delay-200">
                          {item.url_website && (
                            <a
                              href={item.url_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-[#F1FF5E] text-black text-xs font-bold hover:shadow-[0_0_12px_#F1FF5E] transition-all"
                            >
                              🌐 Website
                            </a>
                          )}
                          {item.url_github && (
                            <a
                              href={item.url_github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
                            >
                              🐙 GitHub
                            </a>
                          )}
                        </div>

                      </div>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </AnimatedContent>
          </div>

          {/* CONTACT */}
          <div id="contact">
            <AnimatedContent>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
                Get In <span className="text-[#F1FF5E]">Touch</span>
              </h2>
              <p className="text-white/50 text-center text-sm sm:text-base mb-10 sm:mb-14">
                Punya project atau pertanyaan? Jangan ragu untuk menghubungi saya.
              </p>
            </AnimatedContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
              <AnimatedContent className="flex flex-col gap-4">
                {contacts.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#F1FF5E]/40 hover:translate-x-1 transition-all duration-300 group"
                  >
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-white text-sm sm:text-base font-semibold truncate group-hover:text-[#F1FF5E] transition-colors duration-300">
                        {item.value}
                      </p>
                    </div>
                    <span className="ml-auto text-white/20 group-hover:text-[#F1FF5E] group-hover:translate-x-1 transition-all duration-300 shrink-0">
                      →
                    </span>
                  </a>
                ))}
              </AnimatedContent>
              <AnimatedContent>
                <ContactForm />
              </AnimatedContent>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-20 sm:mt-24 border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-xs sm:text-sm font-mono">
              © 2024 <span className="text-[#F1FF5E]">Amirullah</span> — Junior Web Developer
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}