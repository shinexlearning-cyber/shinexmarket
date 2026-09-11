import React, { useEffect, useState } from "react";
import { api, money } from "../services/api";

export function SubscriptionPanel({ onBack }) {
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api("/subscriptions/plans", { auth: false }), api("/subscriptions/me")])
      .then(([a, b]) => {
        setPlans(a.data || []);
        setCurrent(b.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  const checkout = async (code) => {
    setBusy(code);
    setError("");
    try {
      const r = await api("/subscriptions/checkout", { method: "POST", body: { plan_code: code } });
      window.location.href = r.data.authorization_url;
    } catch (e) {
      setError(e.message);
      setBusy("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-gray-500 mb-5">
        ← Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Seller subscription</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Your plan controls the number of active public listings you can keep.</p>

      {current && (
        <div className="rounded-2xl border border-green-100 bg-green-50 p-4 mb-6">
          <div className="flex justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-green-700">Current plan</p>
              <p className="text-lg font-bold text-gray-900">{current.subscription?.plan?.name || "Free"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">
                {current.listing_count}/{current.listing_limit}
              </p>
              <p className="text-xs text-gray-500">active listings</p>
            </div>
          </div>
          {current.subscription?.expires_at && (
            <p className="text-xs text-gray-600 mt-3">Expires {new Date(current.subscription.expires_at).toLocaleDateString()}</p>
          )}
        </div>
      )}

      {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.code} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="font-bold text-gray-900">{p.name}</p>
            <p className="text-2xl font-extrabold mt-2">{money(p.price)}</p>
            <p className="text-xs text-gray-400">per month</p>
            <p className="text-sm mt-4 text-gray-600">
              Up to <b>{p.listing_limit}</b> active listings
            </p>
            {p.code !== "FREE" && (
              <button
                onClick={() => checkout(p.code)}
                disabled={!!busy}
                className="w-full mt-5 rounded-xl py-2.5 bg-green-700 text-white font-semibold disabled:opacity-50"
              >
                {busy === p.code ? "Opening payment…" : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
