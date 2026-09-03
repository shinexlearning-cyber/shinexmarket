import { NavLink } from 'react-router-dom'
import { X, Settings, HelpCircle, LogOut, Store } from 'lucide-react'
import { PRIMARY_NAV, SECONDARY_NAV } from './navConfig'
import { useAuth } from '../hooks/useAuth'

export default function DesktopDrawer({ open, onClose }) {
  const { user, status, logout } = useAuth()

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink-900/30 hidden md:block"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-full w-72 flex-col border-r border-surface-line
          bg-white transition-transform duration-200 md:flex
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-display text-lg font-bold text-brand-700">SHINEX</span>
          <button onClick={onClose} aria-label="Close menu" className="rounded-control p-1.5 hover:bg-surface-muted">
            <X size={18} />
          </button>
        </div>

        {status === 'authenticated' && user && (
          <div className="mx-4 mb-2 flex items-center gap-3 rounded-card bg-surface-muted p-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-brand-100">
              {user.avatarUrl && <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">{user.name || user.username}</p>
              <p className="truncate text-xs text-ink-500">View profile</p>
            </div>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {PRIMARY_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-muted'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {status === 'authenticated' && (
            <NavLink
              to="/my-shop"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-muted'
                }`
              }
            >
              <Store size={18} />
              My Shop
            </NavLink>
          )}

          <div className="my-2 border-t border-surface-line" />

          {SECONDARY_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-muted'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium ${
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-surface-muted'
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
          <a
            href="/help"
            className="flex items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-muted"
          >
            <HelpCircle size={18} />
            Help
          </a>
        </nav>

        {status === 'authenticated' && (
          <div className="border-t border-surface-line p-3">
            <button
              onClick={() => {
                logout()
                onClose()
              }}
              className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-surface-muted"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
