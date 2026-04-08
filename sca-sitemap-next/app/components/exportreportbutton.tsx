"use client";

import { Download } from "lucide-react";
import { Screen } from "../context/database";

export default function ExportReportButton({ data }: { data: Screen[] }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "ID",
      "Alpha",
      "Screen Type",
      "Screen Number",
      "Screen Description",
      "File Label",
      "Screen Label",
      "Notes",
      "Status",
      "Sitemap"
    ];

    const rows = data.map((item) => [
      item.id,
      item.alpha,
      item.Screen_type,
      item.screen_number,
      item.screen_description,
      item.file_label,
      item.screen_label,
      item.notes,
      item.status,
      item.sitemap
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Screen_Report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
    >
      <Download className="w-4 h-4" />
      Export Report
    </button>
  );
}
