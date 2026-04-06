import { PackageOpen, AlertCircle, DollarSign, TrendingUp } from "lucide-react";

export default function Cards() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 text-slate-800 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Products
              </p>
              <h3 className="text-3xl font-bold text-slate-900">1,248</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <PackageOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1" /> +12%
            </span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Low Stock Alerts
              </p>
              <h3 className="text-3xl font-bold text-slate-900">24</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-rose-500 flex items-center font-medium">
              <TrendingUp className="w-4 h-4mr-1" /> +3
            </span>
            <span className="text-slate-400 ml-2">requires attention</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                Total Value
              </p>
              <h3 className="text-3xl font-bold text-slate-900">$45.2k</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 flex items-center font-medium">
              <TrendingUp className="w-4 h-4 mr-1" /> +8.1%
            </span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-2xl border border-indigo-500 shadow-md shadow-indigo-500/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-0 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100 mb-1">
                Active Orders
              </p>
              <h3 className="text-3xl font-bold">156</h3>
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-sm text-indigo-100">
            <span className="bg-white/20 px-2 py-0.5 rounded-full mr-2">
              New
            </span>
            32 pending dispatch
          </div>
        </div>
      </div>
    </>
  );
}
