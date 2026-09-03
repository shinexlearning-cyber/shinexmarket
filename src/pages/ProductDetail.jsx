import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, MessageCircle, Flag } from 'lucide-react'
import { fetchProduct } from '../services/products'
import EmptyState from '../components/EmptyState'

function formatPrice(amount, currency = 'NGN') {
  if (amount == null) return null
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `₦${amount}`
  }
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setStatus('loading')
    fetchProduct(id)
      .then((data) => {
        setProduct(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [id])

  if (status === 'loading') {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-card bg-surface-line" />
        <div className="space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-surface-line" />
          <div className="h-5 w-1/3 animate-pulse rounded bg-surface-line" />
          <div className="h-24 animate-pulse rounded bg-surface-line" />
        </div>
      </div>
    )
  }

  if (status === 'error' || !product) {
    return (
      <EmptyState
        title="Product not found"
        description="It may have been removed or the link is incorrect."
        action={
          <Link to="/" className="rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Back to Home
          </Link>
        }
      />
    )
  }

  const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : []

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <div className="aspect-square overflow-hidden rounded-card bg-surface-muted">
          {images[activeImage] ? (
            <img src={images[activeImage]} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-300">No image</div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-control border-2 ${
                  i === activeImage ? 'border-brand-600' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink-900">{product.title}</h1>
          {product.price != null && (
            <p className="mt-1 text-xl font-semibold text-confirm-600">{formatPrice(product.price, product.currency)}</p>
          )}
          {product.location && <p className="mt-1 text-sm text-ink-500">{product.location}</p>}
        </div>

        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-control bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <MessageCircle size={16} />
            Contact seller
          </button>
          <button aria-label="Favorite" className="flex h-10 w-10 items-center justify-center rounded-control border border-surface-line hover:bg-surface-muted">
            <Heart size={18} />
          </button>
          <button aria-label="Share" className="flex h-10 w-10 items-center justify-center rounded-control border border-surface-line hover:bg-surface-muted">
            <Share2 size={18} />
          </button>
        </div>

        {product.description && (
          <div>
            <h2 className="text-sm font-semibold text-ink-900">Description</h2>
            <p className="mt-1 whitespace-pre-line text-sm text-ink-700">{product.description}</p>
          </div>
        )}

        {product.shopName && (
          <Link
            to={`/shop/${product.shopUsername}`}
            className="flex items-center gap-3 rounded-card border border-surface-line p-3 hover:bg-surface-muted"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-brand-100">
              {product.shopAvatarUrl && <img src={product.shopAvatarUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{product.shopName}</p>
              <p className="text-xs text-ink-500">View shop</p>
            </div>
          </Link>
        )}

        <button className="flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-700">
          <Flag size={13} />
          Report this product
        </button>
      </div>
    </div>
  )
}
