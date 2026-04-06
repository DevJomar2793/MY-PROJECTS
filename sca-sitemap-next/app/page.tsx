"use client";

import Table from "./components/table";
import BellNotif from "./components/bellnotif";
import SearchFilter from "./components/search";
import AddButton from "./components/addbutton";

import { useState } from "react";

export type Screen = {
  id: number;
  alpha: string;
  Screen_type: number;
  screen_number: number;
  screen_description: string;
  file_label: string;
  screen_label: string;
  notes: string;
  status: string;
  sitemap: string;
};

const allData: Screen[] = [
  {
    id: 1,
    alpha: "A",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "A-01-LOGIN",
    screen_label: "A-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 2,
    alpha: "B",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "B-01-LOGIN",
    screen_label: "B-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 3,
    alpha: "S",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "S-01-LOGIN",
    screen_label: "S-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 4,
    alpha: "AB",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Screen 1",
    file_label: "AB-01-LOGIN",
    screen_label: "AB-01",
    notes: "Notes 1",
    status: "ACTIVE",
    sitemap: "Sitemap 1",
  },
  {
    id: 5,
    alpha: "W ",
    Screen_type: 1,
    screen_number: 1,
    screen_description: "Dashboard",
    file_label: "W-01-DASHBOARD",
    screen_label: "W-01",
    notes: "Notes 1",
    status: "PENDING",
    sitemap: "Sitemap 1",
  },
];

export default function Dashboard() {
  const [data, setData] = useState<Screen[]>(allData);
  const [query, setQuery] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.screen_label.toLowerCase().includes(query.toLowerCase()) ||
      item.screen_description.toLowerCase().includes(query.toLowerCase()) ||
      item.status.toLowerCase().includes(query.toLowerCase()),
  );

  //Add Data tp allData
  const handleAdd = (newData: any) => {
    const formattedData: Screen = {
      id: data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1,
      alpha: newData.alpha,
      Screen_type: newData.screenType,
      screen_number: Number(newData.screenNumber),
      screen_description: newData.screenDescription,
      file_label: newData.fileLabel,
      screen_label: newData.screenLabel,
      notes: newData.notes,
      status: newData.status,
      sitemap: newData.sitemap,
    };
    setData([...data, formattedData]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="h-16 px-8 flex items-center justify-between bg-white/50 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>

        <div className="flex items-center gap-6">
          <SearchFilter query={query} setQuery={setQuery} />
          <BellNotif />
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md cursor-pointer border-2 border-white">
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
              Recent Inventory Updates
            </h2>
            {/* <button className="text-sm font-medium bg-blue-500 text-white px-4 py-2 rounded-xl transition-colors">
              + Add Button
            </button> */}
            <AddButton onAdd={handleAdd} />
          </div>
          <Table data={filteredData} />
        </div>
      </div>
    </div>
  );
}
