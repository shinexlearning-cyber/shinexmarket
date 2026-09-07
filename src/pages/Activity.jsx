import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import { BellIcon } from '../components/Icons';
import { getActivity } from '../api/activity';
import { ListSkeleton, EmptyState, ErrorState } from '../components/States';
import { timeAgo } from '../utils/format';

const ROUTE_BY_TYPE = (metadata) => {
  if (metadata?.product_id) return `/product/${metadata.product_id}`;
  if (metadata?.advertisement_id) return '/advertise';
  if (metadata?.seller_id || metadata?.follower_id) return null;
  return null;
};

export default function Activity() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = () => {
    setStatus('loading');
    getActivity().then((res) => { setItems(res.data); setStatus('ready'); }).catch(() => setStatus('error'));
  };
  useEffect(load, []);

  return (
    <AppShell>
      <Header title="Activity" onBack={null} />
      <div className="shx-container shx-mt-16">
        {status === 'loading' && <ListSkeleton count={6} height={56} />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'ready' && items.length === 0 && (
          <EmptyState icon={<BellIcon width={22} height={22} />} title="No activity yet" description="Updates about your listings, favorites and ads will show up here." />
        )}
        {items?.map((item) => {
          const route = ROUTE_BY_TYPE(item.metadata);
          return (
            <div key={item.id} className="shx-flex shx-gap-12" style={{ padding: '14px 0', borderBottom: '1px solid var(--shx-border)', cursor: route ? 'pointer' : 'default', opacity: item.is_read ? 0.7 : 1 }}
              onClick={() => route && navigate(route)}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--shx-green-100)', color: 'var(--shx-green-700)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <BellIcon width={16} height={16} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, lineHeight: 1.4 }}>{item.message}</p>
                <p className="shx-muted shx-text-sm shx-mt-8">{timeAgo(item.created_at)}</p>
              </div>
              {!item.is_read && <span className="shx-navitem__dot" style={{ position: 'static', width: 8, height: 8 }} />}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
