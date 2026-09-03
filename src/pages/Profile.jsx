import { Settings as SettingsIcon, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-sm py-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-brand-100">
          {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">{user?.name || user?.username}</p>
          <p className="text-sm text-ink-500">{user?.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <Link to="/my-shop" className="block rounded-control px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-muted">
          My Shop
        </Link>
        <Link to="/settings" className="flex items-center gap-2 rounded-control px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-muted">
          <SettingsIcon size={16} />
          Settings
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-control px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-muted"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  )
}
