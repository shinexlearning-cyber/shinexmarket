export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-surface-line bg-white px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon size={22} />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-ink-900">{title}</p>
        {description && <p className="max-w-xs text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}
