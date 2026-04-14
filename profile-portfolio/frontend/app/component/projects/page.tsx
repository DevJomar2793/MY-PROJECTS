export default function Projects() {
  return (
    <>
      <section id="projects" className="max-w-6xl mx-auto py-20 px-6">
        <h3 className="text-3xl font-bold mb-10">Projects</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">SupahBowl Project</h4>
            <p className="text-gray-400">Built with Vue.js</p>
            <p className="text-gray-400 mb-2">Food Website</p>
            <a
              href="https://supahbowl-project.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              View More →
            </a>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">Capture Image App</h4>
            <p className="text-gray-400">Built with Vue.js and FastAPI</p>
            <p className="text-gray-400 mb-2">Capture Image</p>
            <a
              href="https://my-photobooth-v1.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              View More →
            </a>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">SCA Sitemap</h4>
            <p className="text-gray-400">Built with Vue.js and FastAPI</p>
            <p className="text-gray-400 mb-2">Sitemap</p>
            <a
              href="https://sca-sitemap-vue.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              View More →
            </a>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-2">
              SCA Hardware Inventory
            </h4>
            <p className="text-gray-400">Built with Vue.js and FastAPI</p>
            <p className="text-gray-400 mb-2">Hardware Inventory</p>
            <a
              href="https://sca-hardware-inventory-vue.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400"
            >
              View More →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
