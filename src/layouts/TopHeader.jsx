import { Menu, Search, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function TopHeader({ onOpenDrawer }) {
  const { user, status } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-surface-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <button
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="hidden rounded-control p-2 hover:bg-surface-muted md:flex"
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="font-display text-lg font-bold text-brand-700 md:mr-2">
          SHINEX
        </Link>

        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="search"
            placeholder="Search products, shops, categories"
            className="h-9 w-full rounded-control border border-surface-line bg-surface-muted pl-9 pr-3 text-sm
                       outline-none placeholder:text-ink-300 focus:border-brand-400 focus:bg-white"
          />
        </div>

        <Link
          to="/activity"
          aria-label="Activity"
          className="rounded-control p-2 text-ink-700 hover:bg-surface-muted"
        >
          <Bell size={20} />
        </Link>

        {status === 'authenticated' ? (
          <Link to="/profile" aria-label="Profile" className="h-8 w-8 overflow-hidden rounded-full bg-brand-100">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />}
          </Link>
        ) : (
          <Link
            to="/login"
            className="hidden shrink-0 rounded-control bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 md:block"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}
