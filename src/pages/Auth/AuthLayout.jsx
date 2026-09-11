import React from "react";
import { Logo } from "../../components/ui/Logo";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { COLORS } from "../../services/api";

export function AuthLayout({ title, subtitle, children, go, switchLabel, switchCta, switchTo }) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo size={40} /></div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h1 className="text-xl font-bold text-gray-900 text-center">{title}</h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">{subtitle}</p>
          {children}
          <GoogleSignInButton go={go} />
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          {switchLabel}{" "}
          <button onClick={() => go(switchTo)} className="font-semibold" style={{ color: COLORS.primary }}>
            {switchCta}
          </button>
        </p>
      </div>
    </div>
  );
}
