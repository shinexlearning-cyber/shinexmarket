import React from "react";
import { User, LogOut, Package, Mail, Info, Bell, Settings, HelpCircle, Globe, Lock, ShieldCheck } from "lucide-react";
import { SettingsRow } from "../../components/settings/SettingsRow";
import { ToggleStub } from "../../components/settings/ToggleStub";
import { useAuth } from "../../context/AuthContext";

export function SettingsPage({ go, darkMode, setDarkMode }) {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Account</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {user ? (
              <>
                <SettingsRow icon={User} label="Edit profile" subtitle="Name, bio, location, WhatsApp, shop details" onClick={() => go("profile")} />
                <SettingsRow icon={Lock} label="Reset password" subtitle="We'll email you a reset link" onClick={() => go("forgot")} />
              </>
            ) : (
              <SettingsRow icon={User} label="Log in to manage your account" onClick={() => go("login")} />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Notifications</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <SettingsRow icon={Bell} label="Notifications" subtitle="View marketplace alerts" onClick={() => go("notifications")} />
            <SettingsRow icon={Package} label="Seller subscription" subtitle="Plan, listing limit and expiry" onClick={() => go("subscription")} />
            <SettingsRow icon={Bell} label="Push notifications" subtitle="Coming soon" trailing={<ToggleStub checked={false} />} />
            <SettingsRow icon={Mail} label="Email updates" subtitle="Coming soon" trailing={<ToggleStub checked={false} />} />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Privacy & Security</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <SettingsRow icon={ShieldCheck} label="Privacy Policy" onClick={() => go("privacy")} />
            <SettingsRow icon={ShieldCheck} label="Terms of Service" onClick={() => go("terms")} />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">App preferences</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <SettingsRow icon={Globe} label="Dark mode" subtitle="Comfortable viewing in low light" trailing={<ToggleStub checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} />
            <SettingsRow icon={Globe} label="Language" subtitle="English — more languages coming soon" trailing={<span className="text-xs text-gray-400">EN</span>} />
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">Help</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
            <SettingsRow icon={HelpCircle} label="Contact support" onClick={() => go("contact")} />
            <SettingsRow icon={Info} label="About SHINEX" onClick={() => go("about")} />
          </div>
        </div>

        {user && (
          <button onClick={() => { logout(); go("home"); }} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-500 py-3">
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
