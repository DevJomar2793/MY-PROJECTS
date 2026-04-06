import { MoreHorizontal, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import type { Screen } from "../page";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import Link from "next/link";

export default function Table({ data, onEdit, onDelete }: { data: Screen[]; onEdit: (id: number, updatedItem: any) => void; onDelete: (id: number) => void }) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Screen;
    direction: "asc" | "desc";
  } | null>(null);

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
      return <ArrowUpDown className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-slate-700" />
    ) : (
      <ChevronDown className="w-4 h-4 text-slate-700" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center gap-2">
                  # {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort('screen_label')}
              >
                <div className="flex items-center gap-2">
                  Screen Label {getSortIcon('screen_label')}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group"
                onClick={() => requestSort('file_label')}
              >
                <div className="flex items-center gap-2">
                  File Label {getSortIcon('file_label')}
                </div>
              </th>
              <th 
                className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group text-right"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center justify-end gap-2">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.map((item) => (
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
    </div>
  );
}
