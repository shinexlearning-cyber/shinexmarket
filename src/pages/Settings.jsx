const SECTIONS = [
  { title: 'Account', items: ['Edit profile', 'Change password'] },
  { title: 'Notifications', items: ['Push notifications (coming soon)'] },
  { title: 'Privacy & Security', items: ['Blocked users', 'Data & privacy'] },
  { title: 'Preferences', items: ['Language', 'Theme (coming soon)'] }
]

export default function Settings() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <h1 className="font-display text-xl font-bold text-ink-900">Settings</h1>
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-300">{section.title}</p>
          <div className="divide-y divide-surface-line rounded-card border border-surface-line bg-white">
            {section.items.map((item) => (
              <button key={item} className="block w-full px-4 py-3 text-left text-sm text-ink-700 hover:bg-surface-muted">
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
