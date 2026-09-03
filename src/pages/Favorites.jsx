import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/apiClient'
import { ENDPOINTS } from '../services/endpoints'
import { useAuth } from '../hooks/useAuth'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import EmptyState from '../components/EmptyState'

export default function Favorites() {
  const { status: authStatus } = useAuth()
  const [products, setProducts] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (authStatus !== 'authenticated') return
    setStatus('loading')
    apiRequest(ENDPOINTS.favorites.listProducts.path)
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data?.items || [])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [authStatus])

  if (authStatus === 'guest') {
    return (
      <EmptyState
        icon={Heart}
        title="Log in to see your favorites"
        description="Save products you love and find them here anytime."
        action={
          <Link to="/login" className="rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            Log in
          </Link>
        }
      />
    )
  }

  if (status === 'loading' || authStatus === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return <EmptyState title="Couldn't load favorites" description="Try refreshing the page." />
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={Heart}
        title="No favorites yet"
        description="Tap the heart on any product to save it here."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
