"use client";
import { ArchiveIcon } from "lucide-react";
export default function ArchiveBtn() {
  return (
    <button className="flex items-center gap-2 bg-green-600 text-white font-medium shadow-md shadow-green-500/20 rounded-lg px-4 py-2.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all cursor-pointer">
      <ArchiveIcon className="w-5 h-5" />
      Archive Void/Resolved
    </button>
  );
}
