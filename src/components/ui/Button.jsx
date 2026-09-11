import React from "react";
import { COLORS } from "../../services/api";

export function Button({ children, variant = "primary", className = "", as: As = "button", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm px-4 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const styles = {
    primary: "text-white shadow-sm hover:shadow-md",
    secondary: "text-white shadow-sm hover:shadow-md",
    outline: "border-2 bg-white",
    ghost: "hover:bg-black/5",
  };
  const inline =
    variant === "primary"
      ? { backgroundColor: COLORS.primary }
      : variant === "secondary"
      ? { backgroundColor: COLORS.secondary }
      : variant === "outline"
      ? { borderColor: COLORS.primary, color: COLORS.primary }
      : {};
  return (
    <As className={`${base} ${styles[variant]} ${className}`} style={inline} {...props}>
      {children}
    </As>
  );
}
