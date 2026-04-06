import { Bell } from "lucide-react";

export default function BellNotif() {
  return (
    <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
    </button>
  );
}
