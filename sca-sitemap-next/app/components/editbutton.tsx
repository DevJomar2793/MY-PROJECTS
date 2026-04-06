"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import Swal from "sweetalert2";
import type { Screen } from "../page";

const ALPHA_OPTIONS = ["A", "B", "S", "AB", "MWA", "M", "CM", "RM"];
const STATUS_OPTIONS = ["Active", "Inactive", "Pending"];

export default function EditButton({
  item,
  onEdit,
}: {
  item: Screen;
  onEdit: (id: number, data: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [alpha, setAlpha] = useState(item.alpha || "");
  const [screenType, setScreenType] = useState(
    item.Screen_type?.toString() || "",
  );
  const [screenNumber, setScreenNumber] = useState<number | "">(
    item.screen_number || "",
  );
  const [screenDescription, setScreenDescription] = useState(
    item.screen_description || "",
  );
  const fileLabel = [alpha, screenNumber, screenDescription]
    .filter(Boolean)
    .join("-");
  const screenLabel = [alpha, screenNumber].filter(Boolean).join("-");
  const [notes, setNotes] = useState(item.notes || "");
  const [status, setStatus] = useState(item.status || "");
  const [sitemap, setSitemap] = useState(item.sitemap || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(item.id, {
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

    Swal.fire({
      title: "Success!",
      text: "Screen has been updated successfully",
      icon: "success",
      confirmButtonColor: "#3b82f6",
      timer: 3000,
      timerProgressBar: true,
    }).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <>
      {/* Open Modal */}
      <button
        type="button"
        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit"
        onClick={() => setIsOpen(true)}
      >
        <Edit className="w-4 h-4" />
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
              Edit Product
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
                <select
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all text-slate-700 hover:border-slate-300 bg-white"
                >
                  <option value="" disabled>
                    Select Alpha
                  </option>
                  {ALPHA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
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
                  min={1}
                  value={screenNumber}
                  onChange={(e) =>
                    setScreenNumber(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
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
                  placeholder="e.g. A-100-Dashboard"
                  value={fileLabel}
                  className="w-full border border-slate-200 bg-slate-50 text-slate-500 outline-none p-3 rounded-xl cursor-not-allowed transition-all placeholder:text-slate-400"
                  readOnly
                />
              </div>

              {/* Screen Label */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Screen Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. A-100"
                  value={screenLabel}
                  className="w-full border border-slate-200 bg-slate-50 text-slate-500 outline-none p-3 rounded-xl cursor-not-allowed transition-all placeholder:text-slate-400"
                  readOnly
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
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300 bg-white"
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sitemap */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Sitemap
                </label>
                <textarea
                  placeholder="e.g. /dashboard"
                  rows={3}
                  value={sitemap}
                  onChange={(e) => setSitemap(e.target.value)}
                  className="w-full border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 p-3 rounded-xl transition-all placeholder:text-slate-400 hover:border-slate-300 resize-y"
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
