const CodeIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400 mb-4"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const DatabaseIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mb-4"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const GlobeIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400 mb-4"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

export default function Skills() {
  const skills = [
    { name: "HTML5", icon: <GlobeIcon /> },
    { name: "CSS/Tailwind", icon: <CodeIcon /> },
    { name: "JavaScript", icon: <CodeIcon /> },
    { name: "TypeScript", icon: <CodeIcon /> },
    { name: "Next.js", icon: <GlobeIcon /> },
    { name: "Vue.js", icon: <GlobeIcon /> },
    { name: "FastAPI", icon: <CodeIcon /> },
    { name: "MySQL/SQLite", icon: <DatabaseIcon /> },
  ];

  return (
    <section id="skills" className="py-24 relative z-10 w-full bg-[#121420]/80 border-y border-white/5 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold tracking-tight mb-4 text-white">Technical Arsenal</h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">Technologies and tools I use to build robust and scalable applications</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill, idx) => (
            <div 
              key={idx} 
              className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(124,58,237,0.15)] hover:border-violet-500/30 group"
            >
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                {skill.icon}
              </div>
              <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
