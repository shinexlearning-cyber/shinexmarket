import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

export function LegalPage({ title, sections, slug }) {
  const [remote, setRemote] = useState(null);
  useEffect(() => { if (slug) api(`/content/${slug}`, { auth: false }).then(r => setRemote(r.data)).catch(() => {}); }, [slug]);
  const displaySections = remote?.content ? [{ heading: "", text: remote.content }] : sections;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-400 mt-2">Last updated: {remote?.updated_at ? new Date(remote.updated_at).toLocaleDateString() : "January 2026"}</p>
      <div className="mt-6 space-y-6">
        {displaySections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-semibold text-gray-800 mb-2">{s.heading}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
