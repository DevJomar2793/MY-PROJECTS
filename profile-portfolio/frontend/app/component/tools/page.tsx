export default function Tools() {
  return (
    <>
      <section id="tools" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-10">Tools & Technologies</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* <!-- IDE Tools --> */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">IDE & Development</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• AntiGravity for IDE</li>
              </ul>
            </div>

            {/* <!-- AI Tools --> */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">AI Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Claude</li>
                <li>• ChatGPT</li>
                <li>• GitHub Copilot</li>
                <li>• Gemini</li>
              </ul>
            </div>

            {/* <!-- Deployment --> */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">Deployment</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Netlify</li>
                <li>• Render</li>
              </ul>
            </div>

            {/* <!-- Version Control --> */}
            <div className="bg-gray-800 p-6 rounded-2xl">
              <h4 className="text-xl font-semibold mb-4">Version Control</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• GitHub</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
