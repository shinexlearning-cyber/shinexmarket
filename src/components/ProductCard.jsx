import { Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function formatPrice(amount, currency = 'NGN') {
  if (amount == null) return null
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `₦${amount}`
  }
}

export default function ProductCard({ product, onToggleFavorite }) {
  const [imgError, setImgError] = useState(false)
  const image = !imgError && (product.images?.[0] || product.imageUrl)

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-card border border-surface-line bg-white transition-shadow hover:shadow-raised"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-muted">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink-300">No image</div>
        )}

        {product.isPromoted && (
          <span className="absolute left-2 top-2 rounded-control bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            Promoted
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleFavorite?.(product)
          }}
          aria-label="Favorite"
          aria-pressed={!!product.isFavorited}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur"
        >
          <Heart
            size={16}
            className={product.isFavorited ? 'fill-brand-600 text-brand-600' : 'text-ink-500'}
          />
        </button>
      </div>

      <div className="space-y-1 p-2.5">
        <p className="truncate text-sm font-medium text-ink-900">{product.title}</p>
        {product.price != null && (
          <p className="text-sm font-semibold text-confirm-600">{formatPrice(product.price, product.currency)}</p>
        )}
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span className="truncate">{product.shopName}</span>
          {product.location && (
            <span className="flex shrink-0 items-center gap-0.5">
              <MapPin size={11} />
              {product.location}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
