"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import AnimatedContent from "@/components/AnimatedContent";

const data = {
  "1": {
    title: "Website Organization",
    desc: "Sistem organisasi dengan dashboard admin, manajemen anggota, dan fitur laporan yang lengkap. Dibangun menggunakan teknologi modern untuk memastikan performa dan user experience yang optimal.",
    image: "/assets/profile/amir1.jpeg",
    tech: ["Next.js", "Tailwind", "MySQL"],
    live: "#",
    github: "#",
  },
  "2": {
    title: "To-Do App",
    desc: "Aplikasi tugas modern dengan fitur drag & drop, reminder, dan sinkronisasi real-time untuk meningkatkan produktivitas pengguna.",
    image: "/assets/project/project2.png",
    tech: ["Flutter", "Firebase"],
    live: "#",
    github: "#",
  },
  "3": {
    title: "Music App",
    desc: "Aplikasi pencarian lagu dan lirik dengan fitur favorit, integrasi API, serta tampilan UI yang modern dan user-friendly.",
    image: "/assets/project/project3.png",
    tech: ["Flutter", "API"],
    live: "#",
    github: "#",
  },
};

export default function DetailProject() {
  const { id } = useParams();
  const project = data[id];

  if (!project)
    return <div className="text-white p-10">Project tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACK */}
      <div className="p-6">
        <Link href="/" className="text-white/60 hover:text-white">
          ← Kembali
        </Link>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT (TEXT) */}
          <AnimatedContent>
            <div>

              <h1 className="text-3xl md:text-5xl font-bold text-[#F1FF5E] mb-6">
                {project.title}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8">
                {project.desc}
              </p>

              {/* TECH */}
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-white/10 rounded-lg text-sm 
                    hover:bg-[#F1FF5E] hover:text-black transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* BUTTON */}
              <div className="flex gap-4">
                <a
                  href={project.live}
                  target="_blank"
                  className="px-6 py-2 bg-[#F1FF5E] text-black font-semibold rounded-lg 
                  hover:shadow-[0_0_20px_#F1FF5E] transition"
                >
                  🚀 Live Demo
                </a>

                <a
                  href={project.github}
                  target="_blank"
                  className="px-6 py-2 border border-white text-white rounded-lg 
                  hover:bg-white hover:text-black transition"
                >
                  💻 GitHub
                </a>
              </div>

            </div>
          </AnimatedContent>

          {/* RIGHT (IMAGE) */}
          <AnimatedContent>
            <div className="relative group">

              <img
                src={project.image}
                className="w-full h-[300px] md:h-[400px] object-cover rounded-xl 
                transition duration-500 group-hover:scale-105"
              />

              {/* glow effect */}
              <div className="absolute inset-0 rounded-xl 
                shadow-[0_0_40px_rgba(241,255,94,0.2)] opacity-0 
                group-hover:opacity-100 transition duration-500" />

            </div>
          </AnimatedContent>

        </div>

      </div>

    </div>
  );
}