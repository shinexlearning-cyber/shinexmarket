import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { apiRequest } from '../services/apiClient'
import { ENDPOINTS } from '../services/endpoints'
import { useAuth } from '../hooks/useAuth'
import EmptyState from '../components/EmptyState'

// NOTE: ENDPOINTS.activity.list is marked 'missing' in the registry — there's
// no confirmed backend route for this yet. This page is wired to call it the
// moment one exists; until then it renders the "not available yet" state
// below instead of pretending to have data.
const ACTIVITY_ENDPOINT_READY = ENDPOINTS.activity.list.status !== 'missing'

export default function Activity() {
  const { status: authStatus } = useAuth()
  const [items, setItems] = useState(null)
  const [status, setStatus] = useState(ACTIVITY_ENDPOINT_READY ? 'loading' : 'unavailable')

  useEffect(() => {
    if (!ACTIVITY_ENDPOINT_READY || authStatus !== 'authenticated') return
    apiRequest(ENDPOINTS.activity.list.path)
      .then((data) => {
        setItems(Array.isArray(data) ? data : data?.items || [])
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [authStatus])

  if (status === 'unavailable') {
    return (
      <EmptyState
        icon={Bell}
        title="Activity is on the way"
        description="This section is built and ready — it just needs an activity endpoint on the backend to start showing real updates."
      />
    )
  }

  if (authStatus === 'guest') {
    return <EmptyState icon={Bell} title="Log in to see your activity" />
  }

  if (status === 'loading') {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-card bg-surface-line" />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return <EmptyState title="Couldn't load activity" description="Try refreshing the page." />
  }

  if (!items?.length) {
    return <EmptyState icon={Bell} title="No activity yet" description="Updates about your products and shop will show up here." />
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="rounded-card border border-surface-line bg-white p-3 text-sm">
          <p className="text-ink-900">{item.message}</p>
          {item.createdAt && <p className="mt-0.5 text-xs text-ink-500">{new Date(item.createdAt).toLocaleString()}</p>}
        </div>
      ))}
    </div>
  )
}
