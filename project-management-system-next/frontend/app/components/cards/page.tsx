export default function Cards() {
  return (
    <>
      <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <p className="text-sm text-slate-500">
            Track progress across all active projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600">
            + New Project
          </button>
        </div>
      </div>

      <section className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Total Projects</p>
            <h3 className="text-3xl font-bold mt-2">18</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Completed</p>
            <h3 className="text-3xl font-bold mt-2">9</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Pending Tasks</p>
            <h3 className="text-3xl font-bold mt-2">47</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-sm">Team Members</p>
            <h3 className="text-3xl font-bold mt-2">12</h3>
          </div>
        </div>
      </section>
    </>
  );
}
