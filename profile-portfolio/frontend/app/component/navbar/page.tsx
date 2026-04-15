"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["About", "Projects", "Tools", "Skills", "Contact"];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 glass border-b border-white/5">
      <nav className="max-w-6xl mx-auto flex justify-between items-center p-5 px-6">
        <a
          href="#"
          className="text-2xl font-bold tracking-tighter text-white hover:text-violet-400 transition-colors z-50 relative"
        >
          Jomar<span className="text-violet-500">.</span>
        </a>
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map((item) => (
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
        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors z-50 relative"
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform transition-transform duration-300 rotate-90"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform transition-transform duration-300 hover:scale-110"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass-card border-t border-white/5 transition-all duration-500 ease-in-out overflow-hidden shadow-2xl ${
          isOpen ? "max-h-[400px] opacity-100 py-8" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {navItems.map((item, idx) => (
            <li
              key={item}
              className={`transform transition-all duration-500 delay-${idx * 100} ${
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: `${isOpen ? idx * 75 : 0}ms` }}
            >
              <a
                href={`#${item.toLowerCase()}`}
                className="text-2xl font-medium text-gray-300 hover:text-white hover:tracking-widest transition-all duration-300 hover:text-gradient"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
