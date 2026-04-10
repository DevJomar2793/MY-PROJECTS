export default function Contacts() {
  return (
    <>
      <section id="contact" className="bg-gray-800 py-20">
        <div className="max-w-xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold mb-6">Contact Me</h3>
          <p className="text-gray-400 mb-6">Let's work together!</p>
          <input
            type="text"
            placeholder="Your Email"
            className="w-full p-3 rounded-lg mb-4 bg-gray-900 border border-gray-700"
          />
          <textarea
            placeholder="Your Message"
            className="w-full p-3 rounded-lg mb-4 bg-gray-900 border border-gray-700"
          ></textarea>
          <button className="bg-blue-500 px-6 py-3 rounded-xl hover:bg-blue-600">
            Send Message
          </button>
        </div>
      </section>
    </>
  );
}
