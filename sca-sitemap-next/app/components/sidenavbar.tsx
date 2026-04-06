import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  Package2,
} from "lucide-react";

export default function SideNavBar() {
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
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 font-medium transition-all"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
            >
              <Package className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              Screens
              <span className="ml-auto bg-slate-800 text-slate-300 py-0.5 px-2 rounded-full text-xs font-medium">
                124
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
            >
              <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              Add Product
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all group"
            >
              <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              Reports
            </a>
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
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all group text-slate-400"
          >
            <LogOut className="w-5 h-5 group-hover:text-rose-400" />
            Sign Out
          </a>
        </nav>
      </div>
    </aside>
  );
}
