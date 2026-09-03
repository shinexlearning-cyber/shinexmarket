import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV } from './navConfig'

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 flex items-stretch justify-around
                 border-t border-surface-line bg-white/95 backdrop-blur
                 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Primary"
    >
      {PRIMARY_NAV.map(({ to, label, icon: Icon, end, emphasize }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium"
        >
          {({ isActive }) =>
            emphasize ? (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full
                    ${isActive ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600'}`}
                >
                  <Icon size={20} strokeWidth={2.25} />
                </span>
                <span className={isActive ? 'text-brand-600' : 'text-ink-500'}>{label}</span>
              </>
            ) : (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} className={isActive ? 'text-brand-600' : 'text-ink-500'} />
                <span className={isActive ? 'text-brand-600' : 'text-ink-500'}>{label}</span>
              </>
            )
          }
        </NavLink>
      ))}
    </nav>
  )
}
