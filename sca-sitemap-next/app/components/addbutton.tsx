"use client";

import { useState } from "react";

export default function AddButton({ onAdd }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [alpha, setAlpha] = useState("");
  const [screenType, setScreenType] = useState("");
  const [screenNumber, setScreenNumber] = useState(0);
  const [screenDescription, setScreenDescription] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [screenLabel, setScreenLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [sitemap, setSitemap] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      alpha,
      screenType,
      screenNumber,
      screenDescription,
      fileLabel,
      screenLabel,
      notes,
      status,
      sitemap,
    });

    setIsOpen(false);

    // Reset Form
    setAlpha("");
    setScreenType("");
    setScreenNumber(0);
    setScreenDescription("");
    setFileLabel("");
    setScreenLabel("");
    setNotes("");
    setStatus("");
    setSitemap("");
  };

  console.log();

  return (
    <>
      {/* Open Modal */}
      <button
        className="text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors"
        onClick={() => setIsOpen(true)}
      >
        + Add Button
      </button>
      {/* Modal Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Modal Content */}
        <div
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 transition-all duration-300 transform ${
            isOpen
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Add Product
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Alpha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Alpha
                </label>
                <input
                  type="text"
                  placeholder="e.g. A"
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Screen Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Screen Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1"
                  value={screenType}
                  onChange={(e) => setScreenType(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Screen Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Screen Number
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={screenNumber}
                  onChange={(e) => setScreenNumber(Number(e.target.value))}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Screen Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Screen Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dashboard View"
                  value={screenDescription}
                  onChange={(e) => setScreenDescription(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* File Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  File Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. dashboard.tsx"
                  value={fileLabel}
                  onChange={(e) => setFileLabel(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Screen Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Screen Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Dashboard"
                  value={screenLabel}
                  onChange={(e) => setScreenLabel(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Status
                </label>
                <input
                  type="text"
                  placeholder="e.g. In Progress"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Sitemap */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Sitemap
                </label>
                <input
                  type="text"
                  placeholder="e.g. /dashboard"
                  value={sitemap}
                  onChange={(e) => setSitemap(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-200 outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/30 transition-all focus:ring-2 focus:ring-blue-500/50 outline-none flex items-center gap-2"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
