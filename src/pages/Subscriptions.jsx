import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import { CrownIcon, CheckIcon } from '../components/Icons';
import { getPlans, getMyPlan, startSubscription } from '../api/subscriptions';
import { formatNaira } from '../utils/format';
import { LoadingState, ErrorState } from '../components/States';
import { useToast } from '../components/Toast';

export default function Subscriptions() {
  const [plans, setPlans] = useState(null);
  const [myPlan, setMyPlan] = useState(null);
  const [status, setStatus] = useState('loading');
  const [starting, setStarting] = useState('');
  const showToast = useToast();

  const load = () => {
    setStatus('loading');
    Promise.all([getPlans(), getMyPlan()]).then(([p, mp]) => {
      setPlans(p); setMyPlan(mp); setStatus('ready');
    }).catch(() => setStatus('error'));
  };
  useEffect(load, []);

  const subscribe = async (planKey) => {
    setStarting(planKey);
    try {
      const { authorization_url } = await startSubscription(planKey);
      window.location.href = authorization_url;
    } catch (err) {
      showToast(err.message || 'Could not start checkout');
    } finally {
      setStarting('');
    }
  };

  if (status === 'loading') return <AppShell><LoadingState label="Loading plans…" /></AppShell>;
  if (status === 'error' || !plans) return <AppShell><ErrorState onRetry={load} /></AppShell>;

  const order = ['starter', 'pro', 'enterprise'];

  return (
    <AppShell>
      <Header title="Subscription" onBack={null} />
      <div className="shx-container shx-mt-16">
        <div className="shx-card shx-mb-24" style={{ padding: 14, background: 'var(--shx-purple-100)', border: 'none' }}>
          <p className="shx-flex shx-gap-8" style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--shx-purple-500)' }}>
            <CrownIcon width={16} height={16} /> Current plan: {(myPlan?.plan || 'starter').toUpperCase()}
          </p>
          {myPlan?.plan_expires_at && <p className="shx-muted shx-text-sm shx-mt-8">Renews/expires {new Date(myPlan.plan_expires_at).toLocaleDateString()}</p>}
        </div>

        {order.map((key) => {
          const plan = plans[key];
          if (!plan) return null;
          const isCurrent = (myPlan?.plan || 'starter') === key;
          return (
            <div key={key} className="shx-card shx-mb-16" style={{ padding: 18 }}>
              <div className="shx-flex-between">
                <p style={{ fontWeight: 800, fontSize: 16 }}>{plan.label}</p>
                <p style={{ fontWeight: 800, fontSize: 16 }}>{plan.amount ? formatNaira(plan.amount) : 'Free'}</p>
              </div>
              <p className="shx-muted shx-text-sm shx-mt-8">
                {plan.listing_limit ? `Up to ${plan.listing_limit} active listings` : 'Unlimited active listings'}
              </p>
              {isCurrent ? (
                <div className="shx-flex shx-gap-8 shx-mt-16" style={{ color: 'var(--shx-green-700)', fontWeight: 700, fontSize: 13.5 }}>
                  <CheckIcon width={16} height={16} /> Your current plan
                </div>
              ) : key !== 'starter' ? (
                <button className="shx-btn shx-btn--dark shx-mt-16" disabled={starting === key} onClick={() => subscribe(key)}>
                  {starting === key ? 'Redirecting to payment…' : `Subscribe to ${plan.label}`}
                </button>
              ) : null}
            </div>
          );
        })}
        <p className="shx-hint">Payments are processed securely by Paystack. Your plan activates automatically once payment is verified.</p>
      </div>
    </AppShell>
  );
}
