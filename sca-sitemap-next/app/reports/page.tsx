"use client";

import { useState, useEffect, useCallback } from "react";
import ExportButton from "../components/exportreportbutton";
import { Screen, fetchAllScreens } from "../services/api";
import { BarChart3, CheckCircle2, Clock, Layers } from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<Screen[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadScreens = useCallback(async () => {
    try {
      const screens = await fetchAllScreens();
      setData(screens);
    } catch {
      // silently handle — data stays empty
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalScreens = data.length;
  // Account for case-sensitive mismatch by standardizing to uppercase
  const activeScreens = data.filter(
    (s) => s.status.toUpperCase() === "ACTIVE",
  ).length;
  const pendingScreens = data.filter(
    (s) => s.status.toUpperCase() === "PENDING",
  ).length;

  const completionPercentage =
    totalScreens > 0 ? Math.round((activeScreens / totalScreens) * 100) : 0;

  // Group by Alpha
  const alphaMap = data.reduce(
    (acc, curr) => {
      const alpha = (curr.alpha || "").trim().toUpperCase() || "UNASSIGNED";
      acc[alpha] = (acc[alpha] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const alphaData = Object.entries(alphaMap)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .map(([alpha, count]) => ({
      alpha,
      count,
      percentage: Math.round((count / totalScreens) * 100),
    }));

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
      <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          Analytics & Reports
        </h1>

        <div className="flex items-center gap-6">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer border-2 border-white">
            JC
          </div>
        </div>
      </header>

      <div className="flex justify-end px-8 pt-8 max-w-7xl mx-auto w-full">
        <ExportButton data={data} />
      </div>
      <div className="p-2 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Screens Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <Layers className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full">
                Total Inventory
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Screens
              </p>
              <h3 className="text-4xl font-bold text-slate-800">
                {totalScreens}
              </h3>
            </div>
          </div>

          {/* Active Screens Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full">
                {completionPercentage}% Target
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Active</p>
              <h3 className="text-4xl font-bold text-slate-800">
                {activeScreens}
              </h3>
            </div>
          </div>

          {/* Pending Screens Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-50 rounded-2xl">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full">
                In Progress
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending</p>
              <h3 className="text-4xl font-bold text-slate-800">
                {pendingScreens}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Overview Section */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Overall Progress
              </h2>
              <p className="text-slate-500 text-sm">
                Ratio of Active screens vs Total screens
              </p>
            </div>

            {/* Custom Circular Progress */}
            <div className="relative w-64 h-64 mb-6">
              <svg
                className="w-full h-full transform -rotate-90 drop-shadow-sm"
                viewBox="0 0 100 100"
              >
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100"
                />
                {/* Progress Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                {/* Define SVG Gradient so it maps tailwind colors properly */}
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6366f1" /> {/* indigo-500 */}
                    <stop offset="100%" stopColor="#a855f7" />{" "}
                    {/* purple-500 */}
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-slate-800 tracking-tight">
                  {completionPercentage}%
                </span>
                <span className="text-sm font-medium text-slate-400 mt-1">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Alpha Breakdown Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  Alpha Distribution
                </h2>
                <p className="text-slate-500 text-sm">
                  Screens categorized by module
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {alphaData.map((item, i) => (
                <div key={i} className="space-y-2 group">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {item.alpha}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {item.count}{" "}
                      <span className="text-slate-300 mx-1">/</span>{" "}
                      {item.percentage}%
                    </span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative shadow-inner group-hover:brightness-110"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {alphaData.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No alpha data available yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
