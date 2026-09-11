import React from "react";

export function AboutPage() {
  const values = [
    { title: "Trust first", text: "Every seller and listing is held to clear community standards, so buyers can shop with confidence." },
    { title: "Local by design", text: "SHINEX connects people in the same neighbourhoods, keeping deals fast and face-to-face." },
    { title: "Fair pricing", text: "Straightforward advertising and no hidden fees for sellers just starting out." },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">About SHINEX Marketplace</h1>
      <p className="text-gray-600 mt-4 leading-relaxed max-w-2xl">
        SHINEX Marketplace exists to make buying and selling within your community simple, safe, and human. We started with a
        simple belief: the best marketplaces are the ones where neighbours can find what they need from people they can trust.
      </p>
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-800">Our mission</h2>
        <p className="text-gray-600 mt-2 leading-relaxed">
          To give every seller — from a first-time student vendor to an established shop owner — a simple, fair place to reach
          buyers nearby, without complicated fees or confusing tools.
        </p>
      </div>
      <h2 className="font-bold text-lg text-gray-800 mt-8 mb-4">What we value</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {values.map((v) => (
          <div key={v.title} className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800">{v.title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
