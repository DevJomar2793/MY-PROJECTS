export default function Hero() {
  return (
    <>
      <section className="h-screen flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-40 h-40 rounded-full mb-6 border-4 border-blue-500 shadow-lg"
          />

          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Hi, I'm Jomar 👋
          </h2>
          <p className="text-gray-400 mb-6">
            QA Tester | Aspiring Full Stack Developer
          </p>
          <a
            href="#projects"
            className="bg-blue-500 px-6 py-3 rounded-xl hover:bg-blue-600"
          >
            View Projects
          </a>
        </div>
      </section>
    </>
  );
}
