"use client";

import SubmitTicketButton from "../submitticketbtn/page";
import ArchiveBtn from "../archivebtn/page";
import Search from "../search/page";

import { useState, useMemo } from "react";
import { ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

type TicketData = {
  id: string;
  ticketNumber: string;
  type: string;
  title: string;
  priority: string;
  status: string;
  submittedBy: string;
  createdAt: string;
};

const initialData: TicketData[] = [
  {
    id: "1",
    ticketNumber: "1231231231",
    type: "BUG",
    title: "Sales Report Discrepancy",
    priority: "Critical",
    status: "In Progress",
    submittedBy: "Alexes Arcena",
    createdAt: "3 Months Ago",
  },
  {
    id: "2",
    ticketNumber: "1231231232",
    type: "REQUEST",
    title: "Mobile Worker App Syncing Issue",
    priority: "ASAP",
    status: "For Observation",
    submittedBy: "Joanna Marie Tulfo",
    createdAt: "3 Months Ago",
  },
  {
    id: "3",
    ticketNumber: "1231231233",
    type: "BUG",
    title: "LOT Sales Report AB 34G Loading Issue",
    priority: "ASAP",
    status: "Pending",
    submittedBy: "Jonard Manaloto",
    createdAt: "3 Months Ago",
  },
];

export default function TableAdmin() {
  const [data, setData] = useState<TicketData[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TicketData;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof TicketData) => {
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

  const sortedData = useMemo(() => {
    let sortableItems = [...data];

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      sortableItems = sortableItems.filter((item) => {
        return (
          item.ticketNumber.toLowerCase().includes(lowerQuery) ||
          item.type.toLowerCase().includes(lowerQuery) ||
          item.title.toLowerCase().includes(lowerQuery) ||
          item.priority.toLowerCase().includes(lowerQuery) ||
          item.status.toLowerCase().includes(lowerQuery) ||
          item.submittedBy.toLowerCase().includes(lowerQuery)
        );
      });
    }

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
  }, [data, sortConfig, searchQuery]);

  const renderSortIcon = (key: keyof TicketData) => {
    if (sortConfig?.key !== key) {
      return (
        <ArrowUpDown className="w-3 h-3 ml-1 inline-block opacity-40 hover:opacity-100 transition-opacity" />
      );
    }
    if (sortConfig.direction === "asc") {
      return (
        <ChevronUp className="w-3 h-3 ml-1 inline-block text-blue-600 dark:text-blue-400" />
      );
    }
    return (
      <ChevronDown className="w-3 h-3 ml-1 inline-block text-blue-600 dark:text-blue-400" />
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <Search search={searchQuery} onSearchChange={setSearchQuery} />
          </div>
          <div className="flex gap-3">
            <ArchiveBtn />
            <SubmitTicketButton />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("ticketNumber")}
                >
                  <div className="flex items-center">
                    Ticket # {renderSortIcon("ticketNumber")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type {renderSortIcon("type")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center">
                    Priority {renderSortIcon("priority")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status {renderSortIcon("status")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("submittedBy")}
                >
                  <div className="flex items-center">
                    Submitted {renderSortIcon("submittedBy")}
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors select-none group"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created {renderSortIcon("createdAt")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{item.ticketNumber}</td>
                  <td className="py-3 px-4">{item.type}</td>
                  <td className="py-3 px-4">{item.title}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === "Critical"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : item.priority === "ASAP"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : item.status === "For Observation"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.submittedBy}</td>
                  <td className="py-3 px-4 text-slate-500">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
