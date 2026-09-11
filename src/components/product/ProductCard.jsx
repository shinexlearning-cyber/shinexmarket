import React from "react";
import { Heart, MapPin, ShoppingBag } from "lucide-react";
import { COLORS, money } from "../../services/api";

/* ------------------------------------------------------------
   PRODUCT CARD
   Product shape (list): id, name, price, primary_image, location,
   seller { username, full_name, shop_name, avatar_url, whatsapp }
   ------------------------------------------------------------ */
export function ProductCard({ product, go, favoriteProductIds, toggleFavorite }) {
  const id = product.id;
  const isFav = favoriteProductIds.has(id);
  const image = product.primary_image || (product.images && product.images[0]?.image_url);
  return (
    <div className="group rounded-xl bg-white border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
      <button onClick={() => go("product", { id })} className="block w-full text-left relative">
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingBag size={32} />
            </div>
          )}
          {product.is_sold && (
            <span className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-md bg-gray-800/80">Sold</span>
          )}
        </div>
        <span
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleFavorite(id, "product"); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart size={15} color={isFav ? "#EF4444" : "#9CA3AF"} fill={isFav ? "#EF4444" : "none"} />
        </span>
      </button>
      <div className="p-2.5">
        <button onClick={() => go("product", { id })} className="block text-left w-full">
          <h3 className="font-semibold text-[13px] text-gray-800 truncate leading-tight">{product.name}</h3>
          <p className="font-bold text-sm mt-1" style={{ color: COLORS.secondary }}>{money(product.price)}</p>
        </button>
        {product.location ? (
          <p className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 truncate">
            <MapPin size={11} className="shrink-0" /> {product.location}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-gray-400 truncate">{product.seller?.shop_name || product.seller?.username}</p>
        )}
      </div>
    </div>
  );
}
