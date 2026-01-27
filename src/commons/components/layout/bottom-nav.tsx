import { cn } from "@/commons/libs/cn";
import { Book, Home, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
        {/* Home */}
        <Link
          href="/"
          className={cn(
            "p-3 rounded-full transition-all duration-300",
            isActive("/")
              ? "bg-white text-black shadow-lg shadow-white/20"
              : "text-white/60 hover:text-white hover:bg-white/5",
          )}
        >
          <Home className="w-6 h-6" />
        </Link>

        {/* New Entry (Central Action) */}
        <Link
          href="/journal"
          className={cn(
            "p-4 rounded-full transition-all duration-300 mx-2",
            isActive("/journal")
              ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110"
              : "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg hover:scale-105",
          )}
        >
          <Plus className="w-6 h-6" />
        </Link>

        {/* History */}
        <Link
          href="/journal/history"
          className={cn(
            "p-3 rounded-full transition-all duration-300",
            isActive("/journal/history")
              ? "bg-white text-black shadow-lg shadow-white/20"
              : "text-white/60 hover:text-white hover:bg-white/5",
          )}
        >
          <Book className="w-6 h-6" />
        </Link>
      </nav>
    </div>
  );
}
