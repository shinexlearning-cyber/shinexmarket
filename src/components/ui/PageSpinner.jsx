import React from "react";
import { Loader2 } from "lucide-react";
import { COLORS } from "../../services/api";

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin" size={28} style={{ color: COLORS.primary }} />
    </div>
  );
}
