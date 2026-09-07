import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { EditIcon, TrashIcon, PlusCircleIcon } from '../components/Icons';
import { ListSkeleton, EmptyState, ErrorState } from '../components/States';
import { getMyListings, deleteProduct, setSold } from '../api/products';
import { formatNaira, timeAgo } from '../utils/format';
import { useToast } from '../components/Toast';

const TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' }
];

export default function MyListings() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [tab, setTab] = useState('');
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('loading');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = (t = tab) => {
    setStatus('loading');
    getMyListings({ status: t || undefined }).then((res) => {
      setItems(res.data);
      setStatus('ready');
    }).catch(() => setStatus('error'));
  };
  useEffect(() => load(tab), [tab]); // eslint-disable-line

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      showToast('Listing deleted');
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      showToast(err.message || 'Could not delete listing');
    } finally {
      setConfirmDelete(null);
    }
  };

  const toggleSold = async (item) => {
    try {
      await setSold(item.id, !item.is_sold);
      setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, is_sold: !p.is_sold } : p)));
    } catch (err) { showToast(err.message); }
  };

  return (
    <AppShell>
      <Header title="My Listings" onBack={null} right={
        <Link to="/sell" className="shx-header__icon-btn"><PlusCircleIcon width={18} height={18} /></Link>
      } />
      <div className="shx-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`shx-tab${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      <div className="shx-container shx-mt-16">
        {status === 'loading' && <ListSkeleton count={4} height={92} />}
        {status === 'error' && <ErrorState onRetry={() => load()} />}
        {status === 'ready' && items?.length === 0 && (
          <EmptyState title="No listings here" description="Products you list will show up here once you submit them."
            action={<Link to="/sell" className="shx-btn shx-btn--primary shx-btn--sm">Sell a product</Link>} />
        )}
        {items?.map((item) => (
          <div key={item.id} className="shx-card shx-mb-16" style={{ padding: 12, display: 'flex', gap: 12 }}>
            <img src={item.primary_image || ''} alt={item.name} style={{ width: 68, height: 68, borderRadius: 10, objectFit: 'cover', background: 'var(--shx-slate-100)', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="shx-flex-between">
                <p style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <StatusBadge status={item.is_sold ? 'sold' : item.approval_status} />
              </div>
              <p style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{formatNaira(item.price)}</p>
              <p className="shx-muted shx-text-sm shx-mt-8">{timeAgo(item.created_at)}</p>
              {item.rejection_reason && item.approval_status === 'rejected' && (
                <p className="shx-error-text shx-mt-8">Reason: {item.rejection_reason}</p>
              )}
              <div className="shx-flex shx-gap-8 shx-mt-8">
                <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={() => navigate(`/product/${item.id}`)}>Preview</button>
                <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={() => navigate(`/sell/edit/${item.id}`)}><EditIcon width={14} height={14} /></button>
                {!item.is_sold && <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={() => toggleSold(item)}>Mark sold</button>}
                {item.is_sold && <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={() => toggleSold(item)}>Mark available</button>}
                <button className="shx-btn shx-btn--danger shx-btn--sm" onClick={() => setConfirmDelete(item.id)}><TrashIcon width={14} height={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14,21,18,0.5)', display: 'grid', placeItems: 'center', zIndex: 200 }} onClick={() => setConfirmDelete(null)}>
          <div className="shx-card" style={{ padding: 20, width: '85%', maxWidth: 320 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>Delete this listing?</p>
            <p className="shx-muted shx-text-sm shx-mb-16">This can't be undone.</p>
            <div className="shx-flex shx-gap-8">
              <button className="shx-btn shx-btn--outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="shx-btn shx-btn--danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
