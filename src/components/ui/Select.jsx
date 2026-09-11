import React from "react";
import { ChevronDown } from "lucide-react";

export function Select({ label, error, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border px-3.5 py-2.5 text-[15px] outline-none transition focus:ring-2 bg-white ${
            error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-[#14532D]/20 focus:border-[#14532D]"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
