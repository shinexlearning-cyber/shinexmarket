import React, { useState, useEffect } from "react";
import { Heart, User, LogOut, MapPin, Phone, Store, Edit2, Bell, Settings, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: PROFILE — GET/PUT /users/me
   Stats derived from GET /users/:username/shop (product_count)
   and GET /favorites/products (pagination.total) — there is no
   dedicated "my stats" endpoint.
   ------------------------------------------------------------ */
export function ProfilePage({ go }) {
  const { user, logout, refresh } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        bio: user.bio || "",
        location: user.location || "",
        whatsapp: user.whatsapp || "",
        shop_name: user.shop_name || "",
      });
      Promise.all([
        api(`/users/${user.username}/shop?limit=1`, { auth: false }).catch(() => null),
        api(`/favorites/products?limit=1`).catch(() => null),
      ]).then(([shopRes, favRes]) => {
        setStats({
          listings: shopRes?.data?.shop?.product_count ?? shopRes?.data?.pagination?.total ?? null,
          favorites: favRes?.data ? favRes.pagination?.total ?? favRes.data.length : null,
        });
      });
    }
  }, [user]);

  if (!user) {
    return <EmptyState icon={User} title="Log in to view your profile" action={<Button onClick={() => go("login")}>Log in</Button>} />;
  }

  const save = async () => {
    setSaving(true);
    try {
      await api("/users/me", { method: "PUT", body: form });
      await refresh();
      toast.push("Profile updated", "success");
      setEditing(false);
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" /> : <User size={30} className="text-gray-400" />}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{user.full_name}</h1>
            <p className="text-sm text-gray-400">@{user.username}</p>
          </div>
          {!editing && (
            <Button variant="outline" className="!bg-white !py-2" onClick={() => setEditing(true)}>
              <Edit2 size={14} /> Edit
            </Button>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[{ l: "Listings", v: stats.listings }, { l: "Favorites", v: stats.favorites }].map((s) => (
              <div key={s.l} className="text-center bg-gray-50 rounded-xl py-3">
                <p className="font-bold text-lg" style={{ color: COLORS.primary }}>{s.v ?? "—"}</p>
                <p className="text-xs text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        {editing ? (
          <div className="mt-6 space-y-4">
            <Input label="Full name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
            <Input label="Shop name" value={form.shop_name} onChange={(e) => setForm((f) => ({ ...f, shop_name: e.target.value }))} />
            <TextArea label="Bio" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="WhatsApp number" value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 !bg-white" onClick={() => setEditing(false)}>Cancel</Button>
              <Button className="flex-1" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-3 text-sm">
            {user.bio && <p className="text-gray-600">{user.bio}</p>}
            <div className="flex flex-wrap gap-4 text-gray-500">
              {user.location && <span className="flex items-center gap-1"><MapPin size={14} /> {user.location}</span>}
              {user.whatsapp && <span className="flex items-center gap-1"><Phone size={14} /> {user.whatsapp}</span>}
              {user.shop_name && <span className="flex items-center gap-1"><Store size={14} /> {user.shop_name}</span>}
            </div>
            <div className="flex gap-3 pt-3">
              <Button variant="outline" className="!bg-white" onClick={() => go("shop", { username: user.username })}>View my shop</Button>
              <button onClick={() => { logout(); go("home"); }} className="inline-flex items-center gap-2 text-red-500 font-semibold text-sm px-4">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 mt-4 divide-y divide-gray-50 overflow-hidden">
        {[
          { label: "My shop", icon: Store, onClick: () => go("shop", { username: user.username }) },
          { label: "Favorites", icon: Heart, onClick: () => go("favorites") },
          { label: "Activity", icon: Bell, onClick: () => go("activity") },
          { label: "Settings", icon: Settings, onClick: () => go("settings") },
        ].map((row) => (
          <button key={row.label} onClick={row.onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${COLORS.primary}10` }}>
              <row.icon size={16} style={{ color: COLORS.primary }} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-800">{row.label}</span>
            <ChevronRightIcon size={16} className="text-gray-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
