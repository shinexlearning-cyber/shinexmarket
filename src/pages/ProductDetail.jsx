import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import { ChevronLeftIcon, HeartIcon, ShareIcon, WhatsAppIcon, FlagIcon } from '../components/Icons';
import { LoadingState, ErrorState } from '../components/States';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import ReportModal from '../components/ReportModal';
import { getProduct } from '../api/products';
import { checkProductFavorited, favoriteProduct, unfavoriteProduct } from '../api/favorites';
import { formatNaira, timeAgo } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const showToast = useToast();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [isFav, setIsFav] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const load = () => {
    setStatus('loading');
    getProduct(id).then((p) => {
      setProduct(p);
      setStatus('ready');
      if (isAuthenticated) checkProductFavorited(id).then(setIsFav).catch(() => {});
    }).catch(() => setStatus('error'));
  };
  useEffect(load, [id]); // eslint-disable-line

  const isOwner = user && product && product.seller?.id === user.id;

  const toggleFav = async () => {
    if (!isAuthenticated) return navigate(`/login?next=/product/${id}`);
    try {
      if (isFav) { await unfavoriteProduct(id); setIsFav(false); }
      else { await favoriteProduct(id); setIsFav(true); }
    } catch (err) { showToast(err.message); }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard');
    }
  };

  if (status === 'loading') return <AppShell nav={false}><LoadingState label="Loading product…" /></AppShell>;
  if (status === 'error' || !product) return <AppShell nav={false}><ErrorState onRetry={load} title="Product not found" description="This listing may have been removed or isn't approved yet." /></AppShell>;

  const images = product.images?.length ? product.images : (product.primary_image ? [{ image_url: product.primary_image }] : []);
  const whatsappNumber = product.seller?.whatsapp;
  const waLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(`Hi, is "${product.name}" still available on SHINEX?`)}` : null;

  return (
    <AppShell nav={false}>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
          {images.length > 0 ? images.map((img, i) => (
            <img key={i} src={img.image_url} alt={product.name} style={{ width: '100%', flexShrink: 0, aspectRatio: '1/1', objectFit: 'cover', scrollSnapAlign: 'start' }} />
          )) : <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--shx-slate-100)' }} />}
        </div>
        <button className="shx-header__icon-btn" style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.9)' }} onClick={() => navigate(-1)}>
          <ChevronLeftIcon width={20} height={20} />
        </button>
        <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
          <button className="shx-header__icon-btn" style={{ background: 'rgba(255,255,255,0.9)' }} onClick={share}><ShareIcon width={18} height={18} /></button>
          <button className="shx-header__icon-btn" style={{ background: 'rgba(255,255,255,0.9)', color: isFav ? 'var(--shx-red-600)' : 'inherit' }} onClick={toggleFav}>
            <HeartIcon filled={isFav} width={18} height={18} />
          </button>
        </div>
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
            {images.map((_, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.9)' }} />)}
          </div>
        )}
      </div>

      <div className="shx-container shx-mt-16">
        {product.is_sold && <div className="shx-mb-16"><StatusBadge status="sold" /></div>}
        <div className="shx-flex-between">
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>{formatNaira(product.price)}</h1>
        </div>
        <p style={{ fontSize: 15.5, fontWeight: 600, marginTop: 4 }}>{product.name}</p>
        <p className="shx-muted shx-text-sm shx-mt-8">
          {product.location || 'Location not specified'} · {product.condition} · {timeAgo(product.created_at)} · {product.views_count || 0} views
        </p>

        <div className="shx-card shx-mt-16" style={{ padding: 14 }}>
          <p className="shx-label" style={{ marginBottom: 0 }}>Description</p>
          <p style={{ fontSize: 14, lineHeight: 1.55, marginTop: 8, whiteSpace: 'pre-wrap' }}>{product.description || 'No description provided.'}</p>
        </div>

        {product.seller && (
          <Link to={`/shop/${product.seller.username}`} className="shx-card shx-mt-16" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar src={product.seller.avatar_url} name={product.seller.full_name} size={44} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14 }}>{product.seller.shop_name || product.seller.full_name}</p>
              <p className="shx-muted shx-text-sm">@{product.seller.username} · {product.seller.location || ''}</p>
            </div>
            <span className="shx-link shx-text-sm">Visit shop</span>
          </Link>
        )}

        {!isOwner && (
          <button className="shx-btn shx-btn--ghost shx-mt-16" style={{ color: 'var(--shx-slate-500)' }} onClick={() => setShowReport(true)}>
            <FlagIcon width={16} height={16} /> Report this listing
          </button>
        )}
      </div>

      {!isOwner && (
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--shx-white)', borderTop: '1px solid var(--shx-border)', padding: 14 }}>
          {waLink ? (
            <a className="shx-btn shx-btn--primary" href={waLink} target="_blank" rel="noreferrer">
              <WhatsAppIcon width={18} height={18} /> Contact seller on WhatsApp
            </a>
          ) : (
            <Link className="shx-btn shx-btn--primary" to={`/shop/${product.seller?.username}`}>View seller's shop</Link>
          )}
        </div>
      )}
      {isOwner && (
        <div style={{ position: 'sticky', bottom: 0, background: 'var(--shx-white)', borderTop: '1px solid var(--shx-border)', padding: 14 }}>
          <Link className="shx-btn shx-btn--dark" to="/my-listings">Manage this listing</Link>
        </div>
      )}

      {showReport && <ReportModal target={{ target_product_id: product.id }} onClose={() => setShowReport(false)} />}
    </AppShell>
  );
}
