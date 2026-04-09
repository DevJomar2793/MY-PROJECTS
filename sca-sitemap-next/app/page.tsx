"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import Table from "./components/table";
import BellNotif from "./components/bellnotif";
import SearchFilter from "./components/search";
import AddButton from "./components/addbutton";
import {
  Screen,
  fetchAllScreens,
  createScreen,
  updateScreen,
  deleteScreen,
} from "./services/api";

export type { Screen } from "./services/api";

export default function Dashboard() {
  const [data, setData] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // ── Fetch all screens ─────────────────────────────────────────────────────
  const loadScreens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const screens = await fetchAllScreens();
      setData(screens);
    } catch (err: any) {
      setError(err.message ?? "Failed to load screens.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleAdd = useCallback(async (payload: any) => {
    await createScreen({
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
  }, [loadScreens]);

  const handleEdit = useCallback(async (id: number, payload: any) => {
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
  }, [loadScreens]);

  const handleDelete = useCallback(async (id: number) => {
    await deleteScreen(id);
    await loadScreens();
  }, [loadScreens]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">
            Connecting to API…
          </p>
        </div>
      </div>
    );
  }

  // ── Search ────────────────────────────────────────────────────────────────
  const filteredData = data.filter(
    (item) =>
      item.screen_label.toLowerCase().includes(query.toLowerCase()) ||
      item.screen_description.toLowerCase().includes(query.toLowerCase()) ||
      item.status.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>

        <div className="flex items-center gap-6">
          <SearchFilter query={query} setQuery={setQuery} />
          <BellNotif />
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer border-2 border-white">
            JC
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* API Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Data Table Section */}
        <div className="mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Recent Inventory Updates
            </h2>
            <AddButton onAdd={handleAdd} />
          </div>
          <Table
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
