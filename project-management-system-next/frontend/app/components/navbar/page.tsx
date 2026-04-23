import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-6 sticky top-0 z-20">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SCA</h1>
            <p className="text-slate-400 text-xs">Project Management System</p>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-indigo-500 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/ticket"
              className="px-4 py-2 rounded-xl hover:bg-slate-800"
            >
              Tickets
            </Link>
            <Link href="#" className="px-4 py-2 rounded-xl hover:bg-slate-800">
              CO
            </Link>
            {/* <a href="#" className="px-4 py-2 rounded-xl hover:bg-slate-800">
              Team
            </a>
            <a href="#" className="px-4 py-2 rounded-xl hover:bg-slate-800">
              Reports
            </a> */}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            id="themeToggle"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
          >
            🌙
          </button> */}
          <div className="hidden lg:block min-w-[280px]">
            <div className="p-3 rounded-2xl bg-slate-800 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">Logged in as</p>
                <p className="text-sm font-semibold">admin@flowdesk.com</p>
              </div>
              <button className="px-3 py-2 text-sm rounded-xl bg-indigo-500 hover:bg-indigo-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
