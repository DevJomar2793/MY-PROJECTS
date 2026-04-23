"use client";

type SearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function Search({ search, onSearchChange }: SearchProps) {
  return (
    <>
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search tickets..."
        className="pl-10 pr-4 py-2 w-80 bg-slate-100 dark:bg-slate-600 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </>
  );
}
