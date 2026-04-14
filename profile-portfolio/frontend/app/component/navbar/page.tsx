export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 glass border-b border-white/5">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-5 px-6">
        <a href="#" className="text-2xl font-bold tracking-tighter text-white hover:text-violet-400 transition-colors">
          Jomar<span className="text-violet-500">.</span>
        </a>
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {['About', 'Projects', 'Skills', 'Contact'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                className="relative text-gray-300 hover:text-white transition-colors group py-2"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-violet-500 transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            </li>
          ))}
        </ul>
        {/* Mobile Menu Button Wrapper */}
        <button className="md:hidden text-gray-300 hover:text-white" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </nav>
    </header>
  );
}
