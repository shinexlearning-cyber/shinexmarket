import React from "react";
import { COLORS } from "../../services/api";

/* ------------------------------------------------------------
   SMALL SHARED UI PIECES
   ------------------------------------------------------------ */
export function Logo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="rounded-xl flex items-center justify-center font-bold text-white"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, fontSize: size * 0.5 }}
      >
        S
      </div>
      <span className="font-extrabold text-lg tracking-tight" style={{ color: COLORS.primary }}>
        SHINEX
      </span>
    </div>
  );
}
