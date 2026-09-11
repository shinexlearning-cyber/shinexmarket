import React from "react";
import { AlertCircle } from "lucide-react";
import { COLORS } from "../../services/api";

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-red-50">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">Something went wrong</h3>
      <p className="text-gray-500 text-sm mt-1 max-w-xs">{message || "We couldn't load this right now."}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-5 text-sm font-semibold" style={{ color: COLORS.primary }}>
          Try again
        </button>
      )}
    </div>
  );
}
