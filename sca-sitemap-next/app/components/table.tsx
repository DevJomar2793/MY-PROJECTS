import {
  MoreHorizontal,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { Screen } from "../page";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import Link from "next/link";

export default function Table({
  data,
  onEdit,
  onDelete,
}: {
  data: Screen[];
  onEdit: (id: number, updatedItem: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Screen;
    direction: "asc" | "desc";
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof Screen) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: keyof Screen) => {
    if (sortConfig?.key !== columnKey) {
      return (
        <ArrowUpDown className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-slate-700" />
    ) : (
      <ChevronDown className="w-4 h-4 text-slate-700" />
    );
  };

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  
  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, validCurrentPage]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
            <tr className="text-slate-500 font-medium text-xs uppercase tracking-wider">
              <th
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center gap-2">
                  # {getSortIcon("id")}
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort("screen_label")}
              >
                <div className="flex items-center gap-2">
                  Screen Label {getSortIcon("screen_label")}
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort("file_label")}
              >
                <div className="flex items-center gap-2">
                  File Label {getSortIcon("file_label")}
                </div>
              </th>
              <th
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group text-right"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center justify-end gap-2">
                  Status {getSortIcon("status")}
                </div>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4 text-slate-500">{item.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  <Link
                    href={`/screens/${item.id}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    {item.screen_label}
                  </Link>
                </td>
                <td className="px-6 py-4 text-slate-500">{item.file_label}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <EditButton item={item} onEdit={onEdit} />
                    <DeleteButton item={item} onDelete={onDelete} />
                    {/* <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" title="More">
                      <MoreHorizontal className="w-4 h-4" />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <div className="text-sm text-slate-500">
          Showing <span className="font-medium text-slate-900">{sortedData.length === 0 ? 0 : (validCurrentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
          <span className="font-medium text-slate-900">{Math.min(validCurrentPage * ITEMS_PER_PAGE, sortedData.length)}</span> of{" "}
          <span className="font-medium text-slate-900">{sortedData.length}</span> results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm font-medium text-slate-700 px-4">
            Page {validCurrentPage} of {totalPages === 0 ? 1 : totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
