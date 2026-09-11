import React from "react";
import { Heart, Plus, User, LogOut, X, Home, Store, Megaphone, Info, Bell, Settings, HelpCircle, Lock, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../services/api";

/* Navigation lives ONLY in this drawer (opened from the ☰ button) — there
   is no bottom nav. Flat list, matching order: Home, Activity, Favorites,
   Sell something, Advertise, My shop, Profile, Settings, Help & support,
   About SHINEX, Terms, Privacy, Logout. */
export function NavDrawer({ open, onClose, go, nav }) {
  const { user, logout } = useAuth();

  const item = (key, label, Icon, opts = {}) => {
    const active = nav.page === key;
    return (
      <button
        key={key}
        onClick={() => { onClose(); go(opts.requiresAuth && !user ? "login" : key, opts.params); }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        style={active ? { backgroundColor: `${COLORS.primary}12`, color: COLORS.primary } : { color: "#374151" }}
      >
        <Icon size={18} /> {label}
      </button>
    );
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-[90]" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-72 max-w-[85vw] bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
          <Logo size={24} />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50"><X size={18} /></button>
        </div>

        {user && (
          <button onClick={() => { onClose(); go("profile"); }} className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 text-left hover:bg-gray-50 shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
              {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : (
                <span className="text-sm font-bold" style={{ color: COLORS.primary }}>{(user.full_name || user.username || "U").slice(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{user.full_name}</p>
              <p className="text-xs text-gray-400 truncate">@{user.username}</p>
            </div>
          </button>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-0.5">
          {item("home", "Home", Home)}
          {item("activity", "Activity", Bell)}
          {item("favorites", "Favorites", Heart)}
          {item("sell", "Sell something", Plus, { requiresAuth: true })}
          {item("advertise", "Advertise", Megaphone)}
          {user && item("shop", "My shop", Store, { params: { username: user.username } })}
          {user && item("profile", "Profile", User)}
          {item("settings", "Settings", Settings)}
          {item("contact", "Help & support", HelpCircle)}
          {item("about", "About SHINEX", Info)}
          {item("terms", "Terms", ShieldCheck)}
          {item("privacy", "Privacy", Lock)}
        </nav>

        <div className="p-3 border-t border-gray-100 shrink-0">
          {user ? (
            <button
              onClick={() => { onClose(); logout(); go("home"); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 !bg-white" onClick={() => { onClose(); go("login"); }}>Log in</Button>
              <Button className="flex-1" onClick={() => { onClose(); go("register"); }}>Register</Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
