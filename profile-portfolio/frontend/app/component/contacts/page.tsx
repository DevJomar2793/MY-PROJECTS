"use client";

import { useState } from "react";

const MailIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

export default function Contacts() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    // Using a mailto link is the simplest way to send an email without a backend.
    // Replace the email address with your actual email if needed.
    const mailtoLink = `mailto:jomarcerrado2793@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(
      formData.email,
    )}&body=${encodeURIComponent(
      formData.message + "\n\nFrom: " + formData.email,
    )}`;
    window.location.href = mailtoLink;
  };
  return (
    <section
      id="contact"
      className="py-16 md:py-24 relative z-10 bg-[#0a0c13] border-t border-white/5 font-sans"
    >
      <div className="max-w-xl mx-auto px-6 relative">
        {/* Glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 glass rounded-2xl text-violet-400 mb-6 border border-white/10">
            <MailIcon />
          </div>
          <h3 className="text-4xl font-bold tracking-tight text-white mb-4">
            Get in Touch
          </h3>
          <p className="text-gray-400 text-lg font-light">
            I&apos;m currently open for new opportunities. Let&apos;s work
            together!
          </p>
        </div>

        <form
          className="glass cursor-pointer p-6 md:p-8 rounded-4xl border border-white/10 shadow-2xl space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-light"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1">
              Message
            </label>
            <textarea
              placeholder="Tell me about your project..."
              rows={4}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-light resize-none"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>

          <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98] focus:outline-none flex justify-center items-center gap-2 mt-2">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
