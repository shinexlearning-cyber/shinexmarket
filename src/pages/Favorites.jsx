import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Avatar from '../components/Avatar';
import { EmptyState, ErrorState, ProductGridSkeleton, ListSkeleton } from '../components/States';
import { getFavoriteProducts, getFavoriteSellers, unfavoriteSeller } from '../api/favorites';
import { useToast } from '../components/Toast';

export default function Favorites() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState(null);
  const [sellers, setSellers] = useState(null);
  const [status, setStatus] = useState('loading');
  const showToast = useToast();

  const load = () => {
    setStatus('loading');
    const call = tab === 'products' ? getFavoriteProducts() : getFavoriteSellers();
    call.then((res) => {
      if (tab === 'products') setProducts(res.data); else setSellers(res.data);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  };
  useEffect(load, [tab]); // eslint-disable-line

  const unfollow = async (sellerId) => {
    try {
      await unfavoriteSeller(sellerId);
      setSellers((prev) => prev.filter((f) => f.seller?.id !== sellerId));
      showToast('Unfollowed');
    } catch (err) { showToast(err.message); }
  };

  return (
    <AppShell>
      <Header title="Favorites" onBack={null} />
      <div className="shx-tabs">
        <button className={`shx-tab${tab === 'products' ? ' is-active' : ''}`} onClick={() => setTab('products')}>Products</button>
        <button className={`shx-tab${tab === 'sellers' ? ' is-active' : ''}`} onClick={() => setTab('sellers')}>Shops</button>
      </div>
      <div className="shx-container shx-mt-16">
        {status === 'loading' && (tab === 'products' ? <ProductGridSkeleton /> : <ListSkeleton count={4} height={64} />)}
        {status === 'error' && <ErrorState onRetry={load} />}

        {status === 'ready' && tab === 'products' && (
          products.length === 0
            ? <EmptyState title="No favorite products yet" description="Tap the heart on any product to save it here." />
            : (
              <div className="shx-product-grid">
                {products.filter((f) => f.product).map((f) => <ProductCard key={f.id} product={f.product} favorited />)}
              </div>
            )
        )}

        {status === 'ready' && tab === 'sellers' && (
          sellers.length === 0
            ? <EmptyState title="No followed shops yet" description="Follow a shop from its page to keep up with new listings." />
            : sellers.filter((f) => f.seller).map((f) => (
              <Link key={f.id} to={`/shop/${f.seller.username}`} className="shx-card shx-mb-16" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar src={f.seller.avatar_url} name={f.seller.full_name} size={48} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{f.seller.shop_name || f.seller.full_name}</p>
                  <p className="shx-muted shx-text-sm">@{f.seller.username}</p>
                </div>
                <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={(e) => { e.preventDefault(); unfollow(f.seller.id); }}>Unfollow</button>
              </Link>
            ))
        )}
      </div>
    </AppShell>
  );
}
