export default function Progress() {
  return (
    <>
      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <button className="text-indigo-500 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Website Redesign</h4>
                  <p className="text-sm text-slate-500">
                    UI/UX overhaul for landing pages
                  </p>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                  In Progress
                </span>
              </div>
              <div className="mt-4 h-2 bg-slate-100 rounded-full">
                <div className="h-2 w-3/4 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            <div className="border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">Mobile App MVP</h4>
                  <p className="text-sm text-slate-500">
                    Core features and testing sprint
                  </p>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  On Track
                </span>
              </div>
              <div className="mt-4 h-2 bg-slate-100 rounded-full">
                <div className="h-2 w-1/2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
