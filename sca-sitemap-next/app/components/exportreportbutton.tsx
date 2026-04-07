"use client";

import { Download } from "lucide-react";

export default function ExportReportButton() {
  return (
    <button className="flex items-center gap-2 px-2 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
      <Download className="w-4 h-4" />
      Export Report
    </button>
  );
}
