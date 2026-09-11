import React from "react";
import { Search, User, Menu, Home } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../services/api";

/* ------------------------------------------------------------
   APP SHELL: TOP BAR / DRAWER / BOTTOM NAV
   No footer anywhere — SHINEX is an app, not a website. Navigation
   lives in a hamburger drawer on desktop and a fixed bottom bar
   on mobile (Home / Activity / Favorites / Sell / Advertise / Profile).
   ------------------------------------------------------------ */
export function AppTopBar({ nav, go, query, setQuery, onSearchSubmit, onOpenDrawer }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center gap-2 sm:gap-4">
        <button onClick={onOpenDrawer} className="p-2 -ml-1.5 rounded-lg hover:bg-gray-50 text-gray-700 shrink-0" aria-label="Open menu">
          <Menu size={21} />
        </button>

        <button onClick={() => go("home")} className="shrink-0 hidden xs:block">
          <Logo size={26} />
        </button>
        <button onClick={() => go("home")} className="shrink-0 xs:hidden">
          <div
            className="rounded-lg flex items-center justify-center font-bold text-white w-7 h-7 text-sm"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` }}
          >
            S
          </div>
        </button>

        <form
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          className="flex-1 relative"
        >
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, shops or services"
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#14532D]/15 focus:border-[#14532D] bg-gray-50 focus:bg-white"
          />
        </form>

        <button
          onClick={() => go(user ? "profile" : "login")}
          className="w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100 shrink-0"
          style={{ borderColor: user ? COLORS.primary : "#E5E7EB" }}
          aria-label="Profile"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : user ? (
            <span className="text-[11px] font-bold" style={{ color: COLORS.primary }}>
              {(user.full_name || user.username || "U").slice(0, 1).toUpperCase()}
            </span>
          ) : (
            <User size={15} className="text-gray-400" />
          )}
        </button>
      </div>
    </header>
  );
}
