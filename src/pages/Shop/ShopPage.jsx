import React, { useState, useEffect, useCallback } from "react";
import { Heart, Plus, User, MapPin, Phone, Store, Trash2, Edit2, Eye, ShoppingBag, Share2 } from "lucide-react";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { PageSpinner } from "../../components/ui/PageSpinner";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api, money } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: SHOP — GET /users/:username + GET /users/:username/shop
   ------------------------------------------------------------ */
export function ShopPage({ params, go, favoriteSellerIds, toggleFavorite }) {
  const { user } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [profileRes, shopRes] = await Promise.all([
        api(`/users/${params.username}`, { auth: false }),
        api(`/users/${params.username}/shop`),
      ]);
      setProfile(profileRes.data.user);
      setShop(shopRes.data.shop);
      setProducts(shopRes.data.products || []);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  }, [params.username]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <PageSpinner />;
  if (status === "error" || !profile) return <ErrorState message="This shop could not be found." onRetry={load} />;

  const isOwner = !!shop?.is_owner;
  const whatsappNumber = (shop?.whatsapp || profile.whatsapp || "").replace(/[^0-9]/g, "");
  const isFavShop = favoriteSellerIds.has(profile.id);

  const shareShop = async () => {
    const shareText = `${shop?.shop_name || profile.username}'s shop on SHINEX`;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: window.location.href });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} — ${window.location.href}`);
        toast.push("Link copied to clipboard", "success");
      } catch (e) {
        toast.push("Couldn't copy link", "error");
      }
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      toast.push("Listing deleted", "success");
      setProducts((ps) => ps.filter((p) => p.id !== id));
    } catch (e) {
      toast.push(e.message, "error");
    }
  };

  const STATUS_STYLE = {
    approved: { label: "Approved", bg: "#D1FAE5", fg: "#059669" },
    pending: { label: "Pending review", bg: "#FEF3C7", fg: "#B45309" },
    rejected: { label: "Rejected", bg: "#FEE2E2", fg: "#DC2626" },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-5 items-start">
        <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
          {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" /> : <User size={32} className="text-gray-400" />}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{shop?.shop_name || profile.username}</h1>
              <p className="text-sm text-gray-400">@{profile.username}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={shareShop} className="p-2 rounded-full border border-gray-100 hover:bg-gray-50" title="Share shop">
                <Share2 size={16} className="text-gray-500" />
              </button>
              {isOwner ? (
                <Button variant="outline" className="!bg-white !py-2" onClick={() => go("profile")}>
                  <Edit2 size={14} /> Edit shop
                </Button>
              ) : user && (
                <button onClick={() => toggleFavorite(profile.id, "seller")} className="p-2 rounded-full border border-gray-100 hover:bg-gray-50">
                  <Heart size={18} fill={isFavShop ? "#EF4444" : "none"} color={isFavShop ? "#EF4444" : "#9CA3AF"} />
                </button>
              )}
            </div>
          </div>
          {(shop?.shop_description || profile.bio) && <p className="text-sm text-gray-600 mt-2 max-w-xl">{shop?.shop_description || profile.bio}</p>}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
            {profile.location && <span className="flex items-center gap-1"><MapPin size={14} /> {profile.location}</span>}
            {!isOwner && whatsappNumber && (
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium" style={{ color: COLORS.secondary }}>
                <Phone size={14} /> WhatsApp seller
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="font-bold text-lg text-gray-800">{isOwner ? "My listings" : "Listings from this shop"}</h2>
        {isOwner && (
          <Button onClick={() => go("sell")} className="!py-2">
            <Plus size={15} /> Add listing
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Store}
          title={isOwner ? "You haven't listed anything yet" : "No products listed yet"}
          subtitle={isOwner ? "Add your first listing to start selling on SHINEX." : "This seller hasn't listed anything yet — check back soon."}
          action={isOwner ? <Button onClick={() => go("sell")}>List a product</Button> : undefined}
        />
      ) : isOwner ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => {
            const st = STATUS_STYLE[p.status] || STATUS_STYLE.pending;
            const image = p.primary_image || p.images?.[0]?.image_url;
            return (
              <div key={p.id} className="flex gap-3 bg-white rounded-2xl border border-gray-100 p-3">
                <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0">
                  {image ? <img src={image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={20} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-800 truncate">{p.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: st.bg, color: st.fg }}>{st.label}</span>
                  </div>
                  <p className="font-bold text-sm mt-0.5" style={{ color: COLORS.secondary }}>{money(p.price)}</p>
                  {p.status === "rejected" && p.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1 truncate">Reason: {p.rejection_reason}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <button onClick={() => go("sell", { editId: p.id })} className="text-xs font-semibold flex items-center gap-1" style={{ color: COLORS.primary }}>
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => deleteListing(p.id)} className="text-xs font-semibold flex items-center gap-1 text-red-500">
                      <Trash2 size={12} /> Delete
                    </button>
                    {p.status === "approved" && (
                      <button onClick={() => go("product", { id: p.id })} className="text-xs font-semibold flex items-center gap-1 text-gray-400">
                        <Eye size={12} /> View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, seller: { username: profile.username, shop_name: shop?.shop_name } }}
              go={go}
              favoriteProductIds={new Set()}
              toggleFavorite={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
