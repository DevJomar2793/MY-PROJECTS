const TerminalIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-400 mb-2"
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);
const CpuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400 mb-2"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);
const CloudIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-violet-400 mb-2"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
  </svg>
);
const GitIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400 mb-2"
  >
    <circle cx="12" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <circle cx="18" cy="9" r="3"></circle>
    <line x1="6" y1="9" x2="6" y2="21"></line>
    <line x1="6" y1="21" x2="12" y2="18"></line>
    <line x1="18" y1="12" x2="18" y2="21"></line>
    <line x1="18" y1="21" x2="12" y2="18"></line>
  </svg>
);

export default function Tools() {
  return (
    <section id="tools" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-12 tracking-tight">
          Tools & Technologies
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* IDE Tools */}
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-colors group">
            <TerminalIcon />
            <h4 className="text-xl font-semibold mb-3 text-white">IDE & Dev</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-light">
              <li className="flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>{" "}
                AntiGravity for IDE
              </li>
              <li className="flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>{" "}
                Postman for API Testing
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
            <CpuIcon />
            <h4 className="text-xl font-semibold mb-3 text-white">AI Tools</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-light">
              {["Claude", "ChatGPT", "GitHub Copilot", "Gemini"].map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-2 group-hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Deployment */}
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-colors group">
            <CloudIcon />
            <h4 className="text-xl font-semibold mb-3 text-white">
              Deployment
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm font-light">
              <li className="flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>{" "}
                Vercel (Frontend)
              </li>
              <li className="flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>{" "}
                Render (Backend)
              </li>
            </ul>
          </div>

          {/* Version Control */}
          <div className="glass p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
            <GitIcon />
            <h4 className="text-xl font-semibold mb-3 text-white">Control</h4>
            <ul className="space-y-2 text-gray-400 text-sm font-light">
              <li className="flex items-center gap-2 group-hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                GitHub
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
