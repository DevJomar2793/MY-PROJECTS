import { Search } from "lucide-react";

export default function SearchFilter({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <div className="relative relative-group hidden md:block">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search products..."
        className="pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-full border-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all w-64"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
