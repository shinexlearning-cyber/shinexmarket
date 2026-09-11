import React from "react";

export function ToggleStub({ checked, onChange }) {
  return (
    <button type="button" onClick={onChange} aria-pressed={checked} className={`w-9 h-5 rounded-full flex items-center px-0.5 shrink-0 ${checked ? "justify-end bg-green-600" : "justify-start bg-gray-200"}`}><span className="w-4 h-4 rounded-full bg-white shadow" /></button>
  );
}
