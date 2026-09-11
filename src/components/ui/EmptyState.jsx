import React from "react";
import { Package } from "lucide-react";
import { COLORS } from "../../services/api";

export function EmptyState({ icon: Icon = Package, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${COLORS.primary}14` }}>
        <Icon size={28} style={{ color: COLORS.primary }} />
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
