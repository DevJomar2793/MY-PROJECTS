"use client";

import Table from "@/app/components/table";
import { useDatabase } from "@/app/context/database";

export default function RMPage() {
  const { data, handleEdit, handleDelete, isMounted } = useDatabase();

  if (!isMounted) {
    return null;
  }

  const filtered = data.filter((s) => s.alpha === "RM");

  return (
    <>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>

          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer border-2 border-white">
              JC
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Data Table Section */}
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Read Module Page
              </h2>
              {/* <button className="text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors">
                  + Add Button
                </button> */}
            </div>
            <Table
              data={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
}
