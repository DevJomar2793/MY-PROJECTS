export default function Task() {
  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-5">Today's Tasks</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <input type="checkbox" className="task-check h-4 w-4" />
            <span>Review sprint backlog</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <input type="checkbox" className="task-check h-4 w-4" />
            <span>Client feedback meeting</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <input type="checkbox" className="task-check h-4 w-4" />
            <span>Deploy staging build</span>
          </label>
        </div>
      </div>
    </>
  );
}
