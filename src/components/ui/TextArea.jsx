import React from "react";

export function TextArea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <textarea
        className={`w-full rounded-xl border px-3.5 py-2.5 text-[15px] outline-none transition focus:ring-2 resize-none ${
          error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-[#14532D]/20 focus:border-[#14532D]"
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
