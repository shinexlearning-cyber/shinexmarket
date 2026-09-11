import React, { useState, useEffect, useCallback } from "react";
import { Heart, User, Store } from "lucide-react";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { COLORS, api } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: FAVORITES — GET /favorites/products, GET /favorites/sellers
   ------------------------------------------------------------ */
export function FavoritesPage({ go, favoriteProductIds, favoriteSellerIds, toggleFavorite }) {
  const { user } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    if (!user) return;
    setStatus("loading");
    try {
      const [prodRes, sellerRes] = await Promise.all([api("/favorites/products"), api("/favorites/sellers")]);
      setProducts((prodRes.data || []).map((f) => f.product).filter(Boolean));
      setSellers((sellerRes.data || []).map((f) => f.seller).filter(Boolean));
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user) {
    return <EmptyState icon={Heart} title="Log in to see your favorites" subtitle="Save products and shops you love — they'll show up here." action={<Button onClick={() => go("login")}>Log in</Button>} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-5">Favorites</h1>
      <div className="flex gap-1 bg-white rounded-lg border border-gray-100 p-1 w-fit mb-6">
        {[{ k: "products", l: "Products" }, { k: "shops", l: "Shops" }].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            style={tab === t.k ? { backgroundColor: COLORS.primary, color: "white" } : { color: "#6B7280" }}
          >
            {t.l}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      )}
      {status === "error" && <ErrorState message="Couldn't load your favorites." onRetry={load} />}

      {status === "ready" && tab === "products" && (
        products.length === 0 ? (
          <EmptyState icon={Heart} title="No favorite products yet" subtitle="Tap the heart on any listing to save it here." action={<Button onClick={() => go("home")}>Browse products</Button>} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} go={go} favoriteProductIds={favoriteProductIds} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        )
      )}

      {status === "ready" && tab === "shops" && (
        sellers.length === 0 ? (
          <EmptyState icon={Store} title="No favorite shops yet" subtitle="Follow shops you trust to find them quickly next time." action={<Button onClick={() => go("home")}>Explore shops</Button>} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sellers.map((s) => (
              <button key={s.id} onClick={() => go("shop", { username: s.username })} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 text-left hover:shadow-md">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  {s.avatar_url ? <img src={s.avatar_url} className="w-full h-full object-cover" alt="" /> : <User size={20} className="text-gray-400" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{s.shop_name || s.username}</p>
                  <p className="text-xs text-gray-400">@{s.username}</p>
                </div>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
