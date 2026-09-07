import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton, EmptyState, ErrorState } from '../components/States';
import { FilterIcon, SearchIcon, XIcon } from '../components/Icons';
import { listProducts, getCategories } from '../api/products';

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' }
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('search') || '');
  const [sort, setSort] = useState(params.get('sort') || 'newest');
  const [category, setCategory] = useState(params.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const runSearch = (p = 1) => {
    setStatus('loading');
    listProducts({ search: term, category: category || undefined, sort, min_price: minPrice || undefined, max_price: maxPrice || undefined, page: p, limit: 12 })
      .then((res) => {
        setProducts((prev) => (p === 1 ? res.data : [...(prev || []), ...res.data]));
        setPagination(res.pagination);
        setPage(p);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => { runSearch(1); }, []); // eslint-disable-line

  const activeCategoryName = params.get('name');

  const onSubmit = (e) => {
    e?.preventDefault();
    setParams(term ? { search: term } : {});
    runSearch(1);
  };

  return (
    <AppShell>
      <Header title="Search" />
      <div className="shx-container shx-mt-16">
        <form onSubmit={onSubmit} className="shx-input-group shx-mb-16">
          <input className="shx-input" style={{ paddingLeft: 40 }} value={term} onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products, shops, sellers…" />
          <SearchIcon width={18} height={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--shx-slate-500)' }} />
          {term && (
            <button type="button" className="shx-input-group__action" onClick={() => { setTerm(''); setParams({}); }}>
              <XIcon width={16} height={16} />
            </button>
          )}
        </form>

        <div className="shx-flex-between shx-mb-16">
          <button className="shx-chip shx-flex shx-gap-8" onClick={() => setShowFilters((s) => !s)}>
            <FilterIcon width={15} height={15} /> Filters & sort
          </button>
          {activeCategoryName && <span className="shx-badge shx-badge--approved">{activeCategoryName}</span>}
        </div>

        {showFilters && (
          <div className="shx-card" style={{ padding: 16, marginBottom: 16 }}>
            <div className="shx-field">
              <label className="shx-label">Category</label>
              <select className="shx-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="shx-flex shx-gap-12 shx-field">
              <div style={{ flex: 1 }}>
                <label className="shx-label">Min price</label>
                <input className="shx-input" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="₦0" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="shx-label">Max price</label>
                <input className="shx-input" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" />
              </div>
            </div>
            <div className="shx-field">
              <label className="shx-label">Sort by</label>
              <select className="shx-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <button className="shx-btn shx-btn--dark" onClick={() => { setShowFilters(false); runSearch(1); }}>Apply filters</button>
          </div>
        )}

        {status === 'loading' && page === 1 && <ProductGridSkeleton />}
        {status === 'error' && <ErrorState onRetry={() => runSearch(1)} />}
        {status === 'ready' && products && products.length === 0 && (
          <EmptyState title="No results found" description="Try a different search term or clear your filters." />
        )}
        {products && products.length > 0 && (
          <>
            <div className="shx-product-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {pagination && page < pagination.totalPages && (
              <button className="shx-btn shx-btn--outline shx-mt-16" onClick={() => runSearch(page + 1)} disabled={status === 'loading'}>
                {status === 'loading' ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
