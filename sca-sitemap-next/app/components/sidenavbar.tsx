"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Package2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";

const subMenuItem = [
  {
    id: 1,
    name: "Buyer",
    icon: LayoutDashboard,
    href: "/screen/buyer",
  },
  {
    id: 2,
    name: "Seller",
    icon: BarChart3,
    href: "/screen/seller",
  },
  {
    id: 3,
    name: "Admin",
    icon: Settings,
    href: "/screen/admin",
  },
  {
    id: 4,
    name: "MWA",
    icon: Settings,
    href: "/screen/mwa",
  },
  {
    id: 5,
    name: "RM",
    icon: Settings,
    href: "/screen/rm",
  },
  {
    id: 6,
    name: "CM",
    icon: Settings,
    href: "/screen/cm",
  },
  {
    id: 7,
    name: "Marketplace",
    icon: Settings,
    href: "/screen/marketplace",
  },
];

export default function SideNavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="w-72 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/60 font-bold text-xl text-white tracking-wide">
        <div className="bg-indigo-600 p-1.5 rounded-lg mr-3 shadow-lg shadow-indigo-500/30">
          <Package2 className="w-5 h-5 text-white" />
        </div>
        SCA<span className="text-indigo-400 font-light">Sitemap</span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 font-medium transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span>Screens</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isDropdownOpen
                    ? "max-h-96 mt-1 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-1 pl-11 pr-3 py-1">
                  {subMenuItem.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{item.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link
              href="/reports"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
            >
              <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              Reports
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
            Settings
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all group text-slate-400"
          >
            <LogOut className="w-5 h-5 group-hover:text-rose-400" />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
}
