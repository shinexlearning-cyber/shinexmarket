import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopHeader from './TopHeader'
import DesktopDrawer from './DesktopDrawer'
import BottomNav from './BottomNav'

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-muted">
      <TopHeader onOpenDrawer={() => setDrawerOpen(true)} />
      <DesktopDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Main content: bottom padding on mobile clears the fixed bottom nav */}
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-4 md:pb-10">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
