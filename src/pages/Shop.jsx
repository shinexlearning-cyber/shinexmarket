import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Share2, Heart } from 'lucide-react'
import { apiRequest } from '../services/apiClient'
import { ENDPOINTS } from '../services/endpoints'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import EmptyState from '../components/EmptyState'

export default function Shop() {
  const { username } = useParams()
  const [shop, setShop] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    apiRequest(ENDPOINTS.shops.detail.path.replace(':username', username))
      .then((data) => {
        setShop(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [username])

  if (status === 'loading') {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-card bg-surface-line" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (status === 'error' || !shop) {
    return <EmptyState title="Shop not found" description="This shop may not exist or the link is incorrect." />
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-card border border-surface-line bg-white p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-100">
          {shop.avatarUrl && <img src={shop.avatarUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-semibold text-ink-900">{shop.name}</p>
          <p className="text-sm text-ink-500">@{shop.username}</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-control border border-surface-line px-3 py-1.5 text-sm font-medium hover:bg-surface-muted">
          <Heart size={14} />
          Follow
        </button>
        <button aria-label="Share" className="rounded-control border border-surface-line p-2 hover:bg-surface-muted">
          <Share2 size={16} />
        </button>
      </div>

      {shop.products?.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shop.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products listed yet" />
      )}
    </div>
  )
}
