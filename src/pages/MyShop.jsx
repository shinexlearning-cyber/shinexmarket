import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { LoadingState, ErrorState } from '../components/States';
import { StoreIcon, PlusCircleIcon, EditIcon, CrownIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { getMyListings } from '../api/products';

export default function MyShop() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    getMyListings({ limit: 1 }).then((res) => {
      // fetch counts per status with lightweight calls
      Promise.all([
        getMyListings({ status: 'pending', limit: 1 }),
        getMyListings({ status: 'approved', limit: 1 }),
        getMyListings({ status: 'rejected', limit: 1 })
      ]).then(([pending, approved, rejected]) => {
        setSummary({
          plan: res.plan,
          total: res.pagination.total,
          pending: pending.pagination.total,
          approved: approved.pagination.total,
          rejected: rejected.pagination.total
        });
        setStatus('ready');
      });
    }).catch(() => setStatus('error'));
  };
  useEffect(load, []); // eslint-disable-line

  if (!user?.is_seller) {
    return (
      <AppShell>
        <Header title="My Shop" onBack={null} />
        <div className="shx-state">
          <div className="shx-state__icon"><StoreIcon width={24} height={24} /></div>
          <p className="shx-state__title">Selling isn't turned on yet</p>
          <p className="shx-state__desc">Turn on selling from your profile settings to open your shop and start listing products.</p>
          <Link className="shx-btn shx-btn--primary" to="/settings/account">Turn on selling</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Header title="My Shop" onBack={null} right={
        <Link to="/profile/edit" className="shx-header__icon-btn"><EditIcon width={17} height={17} /></Link>
      } />
      <div className="shx-container shx-mt-16">
        <div className="shx-card" style={{ padding: 16 }}>
          <div className="shx-flex shx-gap-12">
            <Avatar src={user.avatar_url} name={user.full_name} size={56} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 800, fontSize: 16 }}>{user.shop_name || `${user.username}'s shop`}</p>
              <p className="shx-muted shx-text-sm">@{user.username} · {user.location || 'Location not set'}</p>
            </div>
          </div>
          {user.shop_description && <p className="shx-text-sm shx-mt-16">{user.shop_description}</p>}
          <Link to={`/shop/${user.username}`} className="shx-link shx-text-sm shx-mt-8" style={{ display: 'inline-block' }}>View public shop page →</Link>
        </div>

        {status === 'loading' && <LoadingState label="Loading your shop stats…" />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {summary && (
          <>
            <div className="shx-mt-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <StatBox label="Listings" value={summary.total} />
              <StatBox label="Pending" value={summary.pending} />
              <StatBox label="Approved" value={summary.approved} />
            </div>

            <div className="shx-card shx-mt-16" style={{ padding: 14 }}>
              <div className="shx-flex-between">
                <div className="shx-flex shx-gap-8"><CrownIcon width={17} height={17} color="var(--shx-purple-500)" /><span style={{ fontWeight: 700, fontSize: 13.5 }}>{summary.plan?.name?.toUpperCase() || 'STARTER'} plan</span></div>
                <Link to="/subscriptions" className="shx-link shx-text-sm">Upgrade</Link>
              </div>
              <p className="shx-muted shx-text-sm shx-mt-8">
                {summary.plan?.active_listing_limit ? `Up to ${summary.plan.active_listing_limit} active listings` : 'Unlimited active listings'}
              </p>
            </div>
          </>
        )}

        <div className="shx-mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link to="/sell" className="shx-btn shx-btn--primary"><PlusCircleIcon width={18} height={18} /> Add a new product</Link>
          <Link to="/my-listings" className="shx-btn shx-btn--outline">Manage my listings</Link>
        </div>
      </div>
    </AppShell>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="shx-card" style={{ padding: 14, textAlign: 'center' }}>
      <p style={{ fontWeight: 800, fontSize: 18 }}>{value}</p>
      <p className="shx-muted" style={{ fontSize: 11.5 }}>{label}</p>
    </div>
  );
}
