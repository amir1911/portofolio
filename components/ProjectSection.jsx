"use client";
import { useState } from "react";
import AnimatedContent from "@/components/AnimatedContent";
import BorderGlow from "@/components/BorderGlow";

const projectData = [
  {
    id: 1,
    category: "Project",
    title: "Website Organization",
    desc: "Dashboard admin & manajemen anggota",
    image: "/assets/project/project1.png",
    tech: ["Next.js", "Tailwind"],
  },
  {
    id: 2,
    category: "Project",
    title: "To-Do App",
    desc: "Drag & drop + reminder system",
    image: "/assets/project/project2.png",
    tech: ["Flutter", "Firebase"],
  },
  {
    id: 3,
    category: "Design",
    title: "Coffee App UI",
    desc: "UI modern untuk coffee shop",
    image: "/assets/project/project3.png",
    tech: ["Figma"],
  },
];

export default function ProjectSection() {
  const [active, setActive] = useState("Project");
  const filtered = projectData.filter((p) => p.category === active);

  return (
    <section id="project" className="py-24 bg-black">

      <AnimatedContent>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
          My <span className="text-[#F1FF5E]">Projects</span>
        </h2>
      </AnimatedContent>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/10 p-1 rounded-full flex gap-2">
          {["Project", "Design", "Editing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-6 py-2 rounded-full ${
                active === tab
                  ? "bg-[#F1FF5E] text-black"
                  : "text-white/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div className="flex gap-6 overflow-x-auto px-6 pb-4">
        {filtered.map((item) => (
          <div key={item.id} className="min-w-[300px]">
            <BorderGlow borderRadius={20}>
              <div className="bg-[#060010] rounded-xl overflow-hidden">

                <img
                  src={item.image}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-[#F1FF5E] font-bold">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    {item.desc}
                  </p>
                </div>

              </div>
            </BorderGlow>
          </div>
        ))}
      </div>

    </section>
  );
}