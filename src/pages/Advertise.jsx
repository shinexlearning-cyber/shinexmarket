import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { apiRequest } from '../services/apiClient'
import { ENDPOINTS } from '../services/endpoints'
import EmptyState from '../components/EmptyState'

export default function Advertise() {
  const [plans, setPlans] = useState(null)
  const [status, setStatus] = useState('loading')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    apiRequest(ENDPOINTS.ads.plans.path)
      .then((data) => {
        setPlans(Array.isArray(data) ? data : data?.items || [])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="mx-auto max-w-lg py-6">
      <div className="flex items-center gap-2">
        <Megaphone className="text-brand-600" size={20} />
        <h1 className="font-display text-xl font-bold text-ink-900">Advertise on SHINEX</h1>
      </div>
      <p className="mt-1 text-sm text-ink-500">
        Promote a product, business or service. Payment is handled securely through Paystack.
      </p>

      {status === 'loading' && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-card bg-surface-line" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6">
          <EmptyState
            title="Couldn't load advertising plans"
            description="Pricing comes from SHINEX directly, so it can't be shown offline. Try again shortly."
          />
        </div>
      )}

      {status === 'ready' && plans?.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id || plan.durationDays}
              onClick={() => setSelected(plan)}
              className={`rounded-card border p-3 text-left ${
                selected === plan ? 'border-brand-600 bg-brand-50' : 'border-surface-line bg-white hover:bg-surface-muted'
              }`}
            >
              <p className="text-sm font-semibold text-ink-900">{plan.label || `${plan.durationDays} days`}</p>
              <p className="mt-1 text-sm font-semibold text-confirm-600">
                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(plan.price)}
              </p>
            </button>
          ))}
        </div>
      )}

      {status === 'ready' && plans?.length === 0 && (
        <div className="mt-6">
          <EmptyState title="No advertising plans available right now" />
        </div>
      )}

      <button
        disabled={!selected}
        className="mt-6 w-full rounded-control bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  )
}
