const ExternalLinkIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default function Projects() {
  const projects = [
    {
      title: "SupahBowl Project",
      tech: ["Vue.js"],
      desc: "Food Website",
      link: "https://supahbowl-project.vercel.app/",
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "Photobooth System",
      tech: ["Vue.js", "FastAPI"],
      desc: "Interactive Photo Booth",
      link: "https://photobooth-system-ten.vercel.app/",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "SCA Sitemap",
      tech: ["Vue.js", "FastAPI"],
      desc: "Dynamic Sitemap Generator",
      link: "https://sca-sitemap-vue.vercel.app/",
      color: "from-violet-500/20 to-fuchsia-500/20",
    },
    {
      title: "SCA Hardware Inventory",
      tech: ["Vue.js", "FastAPI"],
      desc: "Comprehensive Inventory Management",
      link: "https://sca-hardware-inventory-vue.vercel.app/",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Project Management System",
      tech: ["Next.js", "FastAPI", "PostgreSQL"],
      desc: "Project Is Under Development",
      // link: "https://project-management-system-next-six.vercel.app/",
      color: "from-purple-500/20 to-violet-500/20",
    },
  ];

  return (
    <section
      id="projects"
      className="max-w-6xl mx-auto py-16 md:py-24 px-4 md:px-6 relative z-10"
    >
      <div className="mb-16">
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
          Featured Projects
        </h3>
        <p className="text-gray-400 max-w-2xl text-lg font-light">
          A selection of my recent work showcasing frontend and fullstack
          capabilities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="glass-card rounded-4xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(124,58,237,0.15)] hover:border-violet-500/30"
          >
            {/* Image Placeholder Overlay with Gradient */}
            <div
              className={`h-40 md:h-48 w-full bg-linear-to-br ${proj.color} relative overflow-hidden flex items-center justify-center`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              <span className="text-white/30 font-bold tracking-widest text-2xl uppercase mix-blend-overlay group-hover:scale-110 transition-transform duration-700">
                Project Demo
              </span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
                  {proj.title}
                </h4>
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full cursor-pointer z-20 hover:scale-110 hover:bg-violet-600 shadow-sm"
                  aria-label="View Project"
                >
                  <ExternalLinkIcon />
                </a>
              </div>
              <p className="text-gray-300 font-light mb-6">{proj.desc}</p>

              <div className="flex flex-wrap gap-2">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300 border border-white/5 shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Game CTA */}
      <div className="glass-card rounded-4xl p-8 md:p-12 relative overflow-hidden group border border-violet-500/20 bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 mt-12 hover:shadow-[0_10px_40px_rgba(124,58,237,0.15)] transition-all duration-500">
        <div className="absolute inset-0 bg-violet-500/5 group-hover:bg-violet-500/10 transition-colors duration-500"></div>
        <div className="relative z-10 max-w-2xl">
          <h4 className="text-3xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">
            Want to take a break?
          </h4>
          <p className="text-gray-300 font-light text-lg">
            Check out my interactive Quiz Game application! Test your knowledge
            and have some fun.
          </p>
          <p className="text-gray-300 font-light text-lg">
            This Project built using{" "}
            <span className="text-violet-400 font-medium">Next.js</span> and{" "}
            <span className="text-violet-400 font-medium">Tailwind CSS</span>.
          </p>
        </div>
        <a
          href="https://quiz-game-project-six.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 shrink-0 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center gap-3"
          aria-label="Play Quiz Game"
        >
          Play Quiz Game
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </section>
  );
}
