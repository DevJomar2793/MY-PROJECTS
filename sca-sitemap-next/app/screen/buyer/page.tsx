"use client";

import { useState, useEffect, useCallback } from "react";
import Table from "@/app/components/table";
import {
  Screen,
  fetchAllScreens,
  updateScreen,
  deleteScreen,
} from "@/app/services/api";

export default function BuyerPage() {
  const [allData, setAllData] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScreens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const screens = await fetchAllScreens();
      setAllData(screens);
    } catch (err: any) {
      setError(err.message ?? "Failed to load buyer screens.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  const handleEdit = useCallback(
    async (id: number, payload: any) => {
      await updateScreen(id, {
        alpha: payload.alpha,
        Screen_type: payload.screenType,
        screen_number: Number(payload.screenNumber),
        screen_description: payload.screenDescription,
        file_label: payload.fileLabel,
        screen_label: payload.screenLabel,
        notes: payload.notes,
        status: payload.status,
        sitemap: payload.sitemap,
      });
      await loadScreens();
    },
    [loadScreens]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteScreen(id);
      await loadScreens();
    },
    [loadScreens]
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = allData.filter((s) => s.alpha === "B");

  return (
    <>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer border-2 border-white">
              JC
            </div>
          </div>
        </header>
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
              {error}
            </div>
          )}
          <div className="mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Buyer Page</h2>
            </div>
            <Table data={filtered} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </>
  );
}
