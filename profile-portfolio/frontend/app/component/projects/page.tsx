const ExternalLinkIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;

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
      title: "Capture Image App",
      tech: ["Vue.js", "FastAPI"],
      desc: "Interactive Photo Booth",
      link: "https://my-photobooth-v1.vercel.app/",
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
    }
  ];

  return (
    <section id="projects" className="max-w-6xl mx-auto py-24 px-6 relative z-10">
      <div className="mb-16">
        <h3 className="text-4xl font-bold tracking-tight mb-4 text-white">Featured Projects</h3>
        <p className="text-gray-400 max-w-2xl text-lg font-light">A selection of my recent work showcasing frontend and fullstack capabilities.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => (
          <div key={idx} className="glass-card rounded-4xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(124,58,237,0.15)] hover:border-violet-500/30">
            {/* Image Placeholder Overlay with Gradient */}
            <div className={`h-48 w-full bg-gradient-to-br ${proj.color} relative overflow-hidden flex items-center justify-center`}>
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
               <span className="text-white/30 font-bold tracking-widest text-2xl uppercase mix-blend-overlay group-hover:scale-110 transition-transform duration-700">Project Demo</span>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">{proj.title}</h4>
                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full cursor-pointer z-20 hover:scale-110 hover:bg-violet-600 shadow-sm" aria-label="View Project">
                  <ExternalLinkIcon />
                </a>
              </div>
              <p className="text-gray-300 font-light mb-6">{proj.desc}</p>
              
              <div className="flex flex-wrap gap-2">
                {proj.tech.map(t => (
                  <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300 border border-white/5 shadow-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
