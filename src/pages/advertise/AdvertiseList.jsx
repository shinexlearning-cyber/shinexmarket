import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import { PlusCircleIcon } from '../../components/Icons';
import { getMyAdvertisements } from '../../api/advertisements';
import { ListSkeleton, EmptyState, ErrorState } from '../../components/States';
import { formatNaira, timeAgo } from '../../utils/format';
import { useToast } from '../../components/Toast';

export default function AdvertiseList() {
  const [ads, setAds] = useState(null);
  const [status, setStatus] = useState('loading');
  const [params, setParams] = useSearchParams();
  const showToast = useToast();

  const load = () => {
    setStatus('loading');
    getMyAdvertisements().then((res) => { setAds(res.data); setStatus('ready'); }).catch(() => setStatus('error'));
  };
  useEffect(load, []);

  useEffect(() => {
    const payment = params.get('payment');
    if (payment === 'success') showToast('Payment confirmed — your ad now awaits admin approval');
    else if (payment === 'failed') showToast('Payment failed. You can retry from the ad below.');
    else if (payment === 'error') showToast('Something went wrong confirming your payment');
    if (payment) setParams({}, { replace: true });
  }, []); // eslint-disable-line

  return (
    <AppShell>
      <Header title="Advertisements" onBack={null} right={
        <Link to="/advertise/new" className="shx-header__icon-btn"><PlusCircleIcon width={18} height={18} /></Link>
      } />
      <div className="shx-container shx-mt-16">
        {status === 'loading' && <ListSkeleton count={3} height={100} />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'ready' && ads.length === 0 && (
          <EmptyState title="No advertisements yet" description="Promote your shop or products with a paid banner ad."
            action={<Link to="/advertise/new" className="shx-btn shx-btn--primary shx-btn--sm">Create an ad</Link>} />
        )}
        {ads?.map((ad) => (
          <div key={ad.id} className="shx-card shx-mb-16" style={{ overflow: 'hidden' }}>
            <img src={ad.image_url} alt={ad.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
            <div style={{ padding: 12 }}>
              <div className="shx-flex-between">
                <p style={{ fontWeight: 700, fontSize: 14 }}>{ad.title}</p>
                <StatusBadge status={ad.payment_status !== 'paid' ? ad.payment_status : ad.approval_status} />
              </div>
              <p className="shx-muted shx-text-sm shx-mt-8">{ad.duration_days} days · {formatNaira(ad.amount)} · {timeAgo(ad.created_at)}</p>
              {ad.payment_status !== 'paid' && (
                <Link to={`/advertise/${ad.id}/pay`} className="shx-link shx-text-sm shx-mt-8" style={{ display: 'inline-block' }}>Complete payment →</Link>
              )}
              {ad.approval_status === 'rejected' && ad.rejection_reason && (
                <p className="shx-error-text shx-mt-8">Reason: {ad.rejection_reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
