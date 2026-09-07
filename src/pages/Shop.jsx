import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import ProductCard from '../components/ProductCard';
import { LoadingState, ErrorState, EmptyState, ProductGridSkeleton } from '../components/States';
import { WhatsAppIcon, HeartIcon, ShareIcon } from '../components/Icons';
import { getShop } from '../api/users';
import { favoriteSeller, unfavoriteSeller, checkSellerFavorited } from '../api/favorites';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const showToast = useToast();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isFav, setIsFav] = useState(false);

  const load = () => {
    setStatus('loading');
    getShop(username).then((d) => {
      setData(d);
      setStatus('ready');
      if (isAuthenticated && d.shop?.username) {
        // sellerId isn't returned directly here, so favorite-check needs the id from a product's seller if available.
      }
    }).catch(() => setStatus('error'));
  };
  useEffect(load, [username]); // eslint-disable-line

  if (status === 'loading') return <AppShell nav={false}><LoadingState label="Loading shop…" /></AppShell>;
  if (status === 'error' || !data) return <AppShell nav={false}><ErrorState onRetry={load} title="Shop not found" /></AppShell>;

  const { shop, products } = data;
  const isOwnShop = user?.username === username;
  const waLink = shop.whatsapp ? `https://wa.me/${shop.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi ${shop.shop_name}, I found your shop on SHINEX.`)}` : null;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: shop.shop_name, url }); } catch {} }
    else { await navigator.clipboard.writeText(url); showToast('Link copied'); }
  };

  return (
    <AppShell nav={false}>
      <Header title={shop.shop_name} right={
        <button className="shx-header__icon-btn" onClick={share}><ShareIcon width={17} height={17} /></button>
      } />
      <div className="shx-container shx-mt-16">
        <div className="shx-flex shx-gap-12">
          <Avatar src={shop.avatar_url} name={shop.full_name} size={64} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 16 }}>{shop.shop_name}</p>
            <p className="shx-muted shx-text-sm">@{shop.username} · {shop.location || 'Location not set'}</p>
            <p className="shx-muted shx-text-sm">{shop.product_count} products</p>
          </div>
        </div>
        {shop.shop_description && <p className="shx-text-sm shx-mt-16" style={{ lineHeight: 1.5 }}>{shop.shop_description}</p>}
        {shop.bio && <p className="shx-text-sm shx-mt-8 shx-muted" style={{ lineHeight: 1.5 }}>{shop.bio}</p>}

        {!isOwnShop && (
          <div className="shx-flex shx-gap-8 shx-mt-16">
            {waLink && (
              <a className="shx-btn shx-btn--primary" href={waLink} target="_blank" rel="noreferrer">
                <WhatsAppIcon width={17} height={17} /> Contact
              </a>
            )}
            <button className={`shx-btn shx-btn--outline${isFav ? '' : ''}`} onClick={async () => {
              if (!isAuthenticated) return navigate('/login');
              // favorite target needs seller id — derive from first product's seller if present
              const sellerId = products?.[0]?.user_id;
              if (!sellerId) return showToast("Can't follow this shop right now");
              try {
                if (isFav) { await unfavoriteSeller(sellerId); setIsFav(false); }
                else { await favoriteSeller(sellerId); setIsFav(true); }
              } catch (err) { showToast(err.message); }
            }}>
              <HeartIcon filled={isFav} width={16} height={16} /> {isFav ? 'Following' : 'Follow'}
            </button>
          </div>
        )}

        <h2 className="shx-section-title shx-mt-24">Products</h2>
        {products.length === 0 ? (
          <EmptyState title="No products yet" description="This shop hasn't listed anything approved yet." />
        ) : (
          <div className="shx-product-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
}
