import React, { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { api } from "../services/api";
import { Button } from "./ui/Button";
import { EmptyState } from "./ui/EmptyState";

export function NotificationPanel({ onBack }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = () => {
    setStatus("loading");
    api("/notifications")
      .then((r) => {
        setItems(r.data || []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    load();
  }, []);

  const read = async (id) => {
    try {
      await api(`/notifications/${id}/read`, { method: "PATCH" });
      setItems((x) => x.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    } catch (e) {
      // non-critical — leave it unread rather than blocking the UI
    }
  };

  const readAll = async () => {
    try {
      await api("/notifications/read-all", { method: "PATCH" });
      setItems((x) => x.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    } catch (e) {
      // non-critical
    }
  };

  const hasUnread = items.some((n) => !n.read_at);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-gray-500 mb-5">
        ← Back
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {hasUnread && (
          <Button variant="outline" className="!py-1.5 !px-3 text-xs flex items-center gap-1.5" onClick={readAll}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        )}
      </div>

      {status === "loading" && <div className="text-sm text-gray-400">Loading…</div>}

      {status === "ready" && !items.length && (
        <EmptyState icon={Bell} title="No notifications yet" subtitle="We'll let you know when something needs your attention." />
      )}

      {status === "ready" && !!items.length && (
        <div className="space-y-2">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.read_at && read(n.id)}
              className={`w-full text-left rounded-2xl border p-4 ${n.read_at ? "bg-white border-gray-100" : "bg-green-50 border-green-100"}`}
            >
              <p className="font-semibold text-gray-900">{n.title}</p>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
