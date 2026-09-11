import React, { useState, useEffect, useCallback } from "react";
import { Package, ShoppingBag } from "lucide-react";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import { useCategories } from "../../context/CategoriesContext";
import { COLORS, api } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: HOME
   ------------------------------------------------------------ */
const CATEGORY_TILE_COLORS = [
  { bg: "#FCE7F3", fg: "#DB2777" }, // pink
  { bg: "#DBEAFE", fg: "#2563EB" }, // blue
  { bg: "#CFFAFE", fg: "#0891B2" }, // cyan
  { bg: "#FEE2E2", fg: "#DC2626" }, // red
  { bg: "#FEF3C7", fg: "#D97706" }, // amber
  { bg: "#CCFBF1", fg: "#0D9488" }, // teal
  { bg: "#D1FAE5", fg: "#059669" }, // green
  { bg: "#EDE9FE", fg: "#7C3AED" }, // violet
];

const CATEGORY_IMAGES = {
  Books:
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=300&q=85",

  Electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=300&q=85",

  Fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=300&q=85",

  "Food and Dining":
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=85",

  "Health and Beauty":
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=300&q=85",

  "Home and Garden":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=85",

  Other:
    "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=300&q=85",

  Services:
    "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=300&q=85",

  Sports:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=85",

  Vehicles:
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=300&q=85",
};

export function HomePage({ go, search, favoriteProductIds, toggleFavorite }) {
  const { categories } = useCategories();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState("all");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (activeCategory !== "all") q.set("category", activeCategory);
      const { data } = await api(`/products?${q.toString()}`, { auth: false });
      setProducts(data || []);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  }, [search, activeCategory]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCategoryName = activeCategory !== "all" ? categories.find((c) => c.id === activeCategory)?.name : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-gray-900">Categories</h2>
            {activeCategory !== "all" && (
              <button onClick={() => setActiveCategory("all")} className="text-xs font-semibold" style={{ color: COLORS.primary }}>
                See all
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {categories.slice(0, 8).map((c, i) => {
              const palette = CATEGORY_TILE_COLORS[i % CATEGORY_TILE_COLORS.length];
              const active = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(active ? "all" : c.id)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                 <div
  className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center transition-transform group-active:scale-95"
  style={{
    backgroundColor: palette.bg,
    boxShadow: active ? `0 0 0 2px ${COLORS.primary}` : "none",
  }}
>
  {CATEGORY_IMAGES[c.name] ? (
    <img
      src={CATEGORY_IMAGES[c.name]}
      alt={c.name}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  ) : (
    <span
      className="text-lg font-bold"
      style={{ color: palette.fg }}
    >
      {c.name.slice(0, 1)}
    </span>
  )}
</div>
                  <span className="text-[11px] font-medium text-gray-600 text-center leading-tight truncate w-full">{c.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Promo banner */}
      <div
        className="mt-6 rounded-2xl p-5 flex items-center justify-between overflow-hidden relative"
        style={{ background: `linear-gradient(120deg, ${COLORS.primary}, ${COLORS.secondary})` }}
      >
        <div>
          <p className="text-white font-bold text-lg leading-tight">Buy. Sell. Discover.</p>
          <p className="text-white/80 text-xs mt-1 max-w-[220px]">Everything you need in one place.</p>
          <button
            type="button"
            onClick={() => {
              go("home");
              document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-block mt-3 bg-white text-sm font-semibold px-4 py-1.5 rounded-lg"
            style={{ color: COLORS.primary }}
          >
            Shop now
          </button>
        </div>
        <ShoppingBag size={64} className="text-white/15 shrink-0" />
      </div>

      {/* Product Grid */}
      <section id="product-grid" className="mt-7 scroll-mt-16">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base text-gray-900">
            {search ? `Results for "${search}"` : activeCategoryName || "Featured Products"}
          </h2>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {status === "error" && <ErrorState message="We couldn't load listings from the server." onRetry={load} />}

        {status === "ready" && products.length === 0 && (
          <EmptyState
            icon={Package}
            title={search ? `No results found for "${search}"` : "No listings yet"}
            subtitle={search ? "Try a different search term or browse all categories." : "Be the first to list something in this category."}
            action={!search ? <Button onClick={() => go("sell")}>List a product</Button> : undefined}
          />
        )}

        {status === "ready" && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} go={go} favoriteProductIds={favoriteProductIds} toggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
