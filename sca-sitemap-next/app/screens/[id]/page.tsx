"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  FileText,
  Activity,
  Hash,
  Tag,
  AlignLeft,
  ShieldAlert,
} from "lucide-react";
import { useDatabase } from "../../context/database";

export default function ScreenDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const id = Number(unwrappedParams.id);

  const { data, isMounted } = useDatabase();

  const screenData = data?.find((s) => s.id === id) || null;

  if (!isMounted) return null; // Avoid hydration mismatch

  if (!screenData) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">
            Screen Not Found
          </h2>
          <p className="text-slate-500">
            The screen you are looking for does not exist or has been deleted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm border border-blue-700"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50">
      <header className="h-16 px-8 flex items-center bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10 shadow-xs">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium border border-slate-200 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </header>

      <main className="p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Screen Details:{" "}
            <span className="text-indigo-600">{screenData.screen_label}</span>
          </h1>
          <p className="text-slate-500">
            Viewing comprehensive information for screen ID #{screenData.id}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-slate-200/60 overflow-hidden relative isolate">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -z-10 transform translate-x-12 -translate-y-8">
            <Monitor className="w-96 h-96 text-slate-900" />
          </div>

          <div className="p-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Status & Identification */}
              <div className="space-y-6">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4">
                    <Activity className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {screenData.status}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm
                    ${
                      screenData.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : screenData.status === "PENDING"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                    }
                  `}
                  >
                    {screenData.status}
                  </span>
                </div>

                <div className="space-y-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <InfoItem
                    icon={<Hash className="w-5 h-5 text-indigo-500" />}
                    label="Alpha"
                    value={screenData.alpha}
                  />
                  <InfoItem
                    icon={<Monitor className="w-5 h-5 text-indigo-500" />}
                    label="Screen Type"
                    value={String(screenData.Screen_type)}
                  />
                  <InfoItem
                    icon={<Hash className="w-5 h-5 text-indigo-500" />}
                    label="Screen Number"
                    value={String(screenData.screen_number)}
                  />
                </div>
              </div>

              {/* Descriptions & Labels */}
              <div className="space-y-2 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 h-fit">
                <InfoItem
                  icon={<Tag className="w-5 h-5 text-purple-500" />}
                  label="Screen Label"
                  value={screenData.screen_label}
                />
                <InfoItem
                  icon={<FileText className="w-5 h-5 text-purple-500" />}
                  label="File Label"
                  value={screenData.file_label}
                />
                <InfoItem
                  icon={<AlignLeft className="w-5 h-5 text-purple-500" />}
                  label="Description"
                  value={screenData.screen_description}
                />
                <InfoItem
                  icon={<Monitor className="w-5 h-5 text-purple-500" />}
                  label="Sitemap"
                  value={screenData.sitemap}
                />
              </div>
            </div>

            {/* Notes Section spanning full width */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2.5 bg-rose-50 text-rose-500 rounded-xl border border-rose-100/50 shadow-sm">
                  <AlignLeft className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Additional Notes
                  </h3>
                  <div className="bg-slate-50 min-h-[100px] p-5 rounded-2xl border border-slate-200/60 text-slate-700 whitespace-pre-wrap shadow-inner leading-relaxed">
                    {screenData.notes || (
                      <span className="text-slate-400 italic">
                        No additional notes provided.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-white rounded-xl transition-colors hover:shadow-sm">
      <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm border border-slate-200/60 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
          {label}
        </p>
        <p className="text-[15px] font-medium text-slate-800 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
