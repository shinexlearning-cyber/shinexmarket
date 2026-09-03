import { Home, Bell, Heart, PlusCircle, Megaphone, User } from 'lucide-react'

// Primary nav — shown in mobile bottom bar (all 6) and at the top of the
// desktop drawer. Keep this list short; it's the app's main skeleton.
export const PRIMARY_NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/activity', label: 'Activity', icon: Bell },
  { to: '/sell', label: 'Sell', icon: PlusCircle, emphasize: true },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User }
]

// Secondary nav — desktop drawer only, below the primary section.
export const SECONDARY_NAV = [
  { to: '/advertise', label: 'Advertise', icon: Megaphone }
]
