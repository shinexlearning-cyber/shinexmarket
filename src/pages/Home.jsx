import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton, EmptyState, ErrorState } from '../components/States';
import { SearchIcon, BellIcon } from '../components/Icons';
import { listProducts, getCategories } from '../api/products';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    listProducts({ category: activeCategory, page, limit: 12, sort: 'newest' })
      .then((res) => {
        if (cancelled) return;
        setProducts((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
        setPagination(res.pagination);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => { cancelled = true; };
  }, [activeCategory, page]);

  const selectCategory = (id) => {
    setActiveCategory(id);
    setPage(1);
  };

  return (
    <AppShell>
      <div className="shx-header" style={{ height: 'auto', paddingTop: 12, paddingBottom: 12, flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
        <div className="shx-flex-between">
          <div className="shx-flex shx-gap-8">
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--shx-green-700)' }}>SHINEX</div>
          </div>
          <div className="shx-flex shx-gap-8">
            <button className="shx-header__icon-btn" onClick={() => navigate('/activity')} aria-label="Notifications">
              <BellIcon width={19} height={19} />
            </button>
            <button onClick={() => navigate('/profile')} aria-label="Profile" style={{ border: 'none', background: 'none', padding: 0 }}>
              <Avatar src={user?.avatar_url} name={user?.full_name} size={32} />
            </button>
          </div>
        </div>
        <button className="shx-input shx-flex shx-gap-8" style={{ color: 'var(--shx-slate-500)', textAlign: 'left' }} onClick={() => navigate('/search')}>
          <SearchIcon width={18} height={18} />
          Search for products, shops or sellers…
        </button>
      </div>

      <div className="shx-container shx-mt-16">
        <div className="shx-chiprow shx-mb-16">
          <button className={`shx-chip${activeCategory === null ? ' is-active' : ''}`} onClick={() => selectCategory(null)}>All</button>
          {categories.map((c) => (
            <button key={c.id} className={`shx-chip${activeCategory === c.id ? ' is-active' : ''}`} onClick={() => selectCategory(c.id)}>
              {c.icon ? `${c.icon} ` : ''}{c.name}
            </button>
          ))}
        </div>

        <div className="shx-flex-between shx-mb-16">
          <h2 className="shx-section-title" style={{ marginBottom: 0 }}>Newest listings</h2>
        </div>

        {status === 'loading' && page === 1 && <ProductGridSkeleton />}
        {status === 'error' && <ErrorState onRetry={() => setPage(1)} />}
        {status !== 'loading' && products.length === 0 && (
          <EmptyState title="No products found" description="No listings match right now — check back soon or try another category." />
        )}
        {products.length > 0 && (
          <>
            <div className="shx-product-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {pagination && page < pagination.totalPages && (
              <button className="shx-btn shx-btn--outline shx-mt-16" onClick={() => setPage((p) => p + 1)} disabled={status === 'loading'}>
                {status === 'loading' ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
