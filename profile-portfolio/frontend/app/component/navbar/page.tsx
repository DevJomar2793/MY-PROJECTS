export default function Navbar() {
  return (
    <>
      <header className="fixed w-full bg-gray-900/80 backdrop-blur z-50">
        <nav className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">MyPortfolio</h1>
          <ul className="flex gap-6 text-sm">
            <li>
              <a href="#about" className="hover:text-blue-400">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="hover:text-blue-400">
                Projects
              </a>
            </li>
            <li>
              <a href="#skills" className="hover:text-blue-400">
                Skills
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
