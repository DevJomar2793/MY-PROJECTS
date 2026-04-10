export default function Skills() {
  return (
    <>
      <section id="skills" className="bg-gray-800 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-10">Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-900 p-4 rounded-xl text-center">HTML</div>
            <div className="bg-gray-900 p-4 rounded-xl text-center">
              CSS: Tailwind CSS/Bootstrap
            </div>
            <div className="bg-gray-900 p-4 rounded-xl text-center">
              JavaScript
            </div>

            <div className="bg-gray-900 p-4 rounded-xl text-center">
              Next.js/Vue.JS
            </div>
            <div className="bg-gray-900 p-4 rounded-xl text-center">
              FastAPI
            </div>
            <div className="bg-gray-900 p-4 rounded-xl text-center">
              MySQL/SQLite
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
