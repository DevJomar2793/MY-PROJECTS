export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center text-center pt-20 px-4">
      <div className="flex flex-col items-center z-10">
        <div className="relative group mb-8">
          {/* Glowing Aura Effect */}
          <div className="absolute -inset-2 bg-linear-to-r from-violet-600 to-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github.com/DevJomar2793.png"
            alt="Jomar's Profile"
            className="relative w-70 h-70 rounded-full border-2 border-white/10 shadow-2xl object-cover transform transition duration-500 hover:scale-105 hover:rotate-3"
          />
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Hi, I&apos;m <span className="text-gradient">Jomar</span> 👋
        </h2>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl font-light leading-relaxed">
          QA Tester &amp;{" "}
          <span className="text-white font-medium">
            Aspiring Full Stack Developer
          </span>
          . I build dynamic web applications with modern tech.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 bg-violet-600 border border-transparent rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:bg-violet-500 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 focus:ring-offset-gray-900 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black"></span>
            <span className="relative">View Projects</span>
            <svg
              className="relative w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-200 glass rounded-full hover:bg-white/10 focus:outline-none"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
