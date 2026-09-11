import React from "react";
import { ChevronRight as ChevronRightIcon } from "lucide-react";
import { COLORS } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: SETTINGS
   Only wires up controls backed by a real endpoint (profile edit,
   password reset email). Anything without backend support today
   is shown but disabled and clearly marked "Coming soon" rather
   than faked.
   ------------------------------------------------------------ */
export function SettingsRow({ icon: Icon, label, subtitle, onClick, trailing }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 disabled:hover:bg-transparent"
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
        <Icon size={16} style={{ color: COLORS.primary }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {trailing || (onClick && <ChevronRightIcon size={16} className="text-gray-300 shrink-0" />)}
    </button>
  );
}
