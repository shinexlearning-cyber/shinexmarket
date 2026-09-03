import { useEffect, useState } from 'react'
import { PackageSearch, RefreshCw, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/products'
import ProductCard from '../components/ProductCard'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const [products, setProducts] = useState(null) // null = not loaded yet
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  const load = async () => {
    setStatus('loading')
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetchProducts(activeCategory ? { category: activeCategory } : {}),
        categories.length ? Promise.resolve(categories) : fetchCategories().catch(() => [])
      ])
      setProducts(Array.isArray(productsRes) ? productsRes : productsRes?.items || [])
      if (!categories.length) setCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.items || [])
      setStatus('ready')
    } catch (err) {
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory])

  return (
    <div className="space-y-5">
      {categories.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-control border px-3 py-1.5 text-sm font-medium ${
              activeCategory === null
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-surface-line bg-white text-ink-700'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id || cat}
              onClick={() => setActiveCategory(cat.id || cat)}
              className={`shrink-0 rounded-control border px-3 py-1.5 text-sm font-medium ${
                activeCategory === (cat.id || cat)
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-surface-line bg-white text-ink-700'
              }`}
            >
              {cat.name || cat}
            </button>
          ))}
        </div>
      )}

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <EmptyState
          icon={RefreshCw}
          title="Couldn't load SHINEX right now"
          description="The marketplace might be waking up or your connection dropped. Give it another try."
          action={
            <button
              onClick={load}
              className="rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Try again
            </button>
          }
        />
      )}

      {status === 'ready' && products?.length === 0 && (
        <EmptyState
          icon={PackageSearch}
          title="Nothing here yet"
          description="Be the first to list something on SHINEX."
          action={
            <Link
              to="/sell"
              className="flex items-center gap-1.5 rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <PlusCircle size={16} />
              Sell something
            </Link>
          }
        />
      )}

      {status === 'ready' && products?.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
