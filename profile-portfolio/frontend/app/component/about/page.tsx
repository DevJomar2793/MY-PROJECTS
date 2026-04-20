export default function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto py-16 md:py-24 px-4 sm:px-6 relative z-10">
      <div className="glass-card rounded-4xl p-6 md:p-14 relative overflow-hidden group">
        {/* Decorative flares */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-110"></div>

        <div className="relative z-10 md:w-3/4">
          <div className="inline-block px-3 py-1 mb-6 rounded-full glass border border-white/10 text-violet-300 text-sm font-medium tracking-wide">
            Introduction
          </div>
          <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            About Me
          </h3>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
            I am a self-taught developer and build modern projects on my own.{" "}
            <span className="text-white font-medium">5+ years</span> of
            experience in IT support and{" "}
            <span className="text-white font-medium">1 year</span> as a QA
            Tester. I am excited to learn more about web development and
            passionate about creating scalable, secure, and beautiful web
            applications using modern technologies like{" "}
            <span className="text-violet-400 font-medium">Next.js</span> and{" "}
            <span className="text-blue-400 font-medium">FastAPI</span>.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <div className="glass px-6 py-4 rounded-xl border border-white/5 text-center flex-1 min-w-[140px] hover:bg-white/5 transition">
              <span className="block text-3xl font-bold text-gradient">5+</span>
              <span className="text-sm text-gray-400 font-medium tracking-wider mt-1 block">
                Years IT Support
              </span>
            </div>
            <div className="glass px-6 py-4 rounded-xl border border-white/5 text-center flex-1 min-w-[140px] hover:bg-white/5 transition">
              <span className="block text-3xl font-bold text-gradient">1</span>
              <span className="text-sm text-gray-400 font-medium tracking-wider mt-1 block">
                Year QA Testing
              </span>
            </div>
            <div className="glass px-6 py-4 rounded-xl border border-white/5 text-center flex-1 min-w-[140px] hover:bg-white/5 transition">
              <span className="block text-3xl font-bold text-gradient">∞</span>
              <span className="text-sm text-gray-400 font-medium tracking-wider mt-1 block">
                Passion to Code
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
