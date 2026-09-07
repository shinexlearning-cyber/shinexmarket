export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="shx-state" role="status" aria-live="polite">
      <div className="shx-skel" style={{ width: 56, height: 56, borderRadius: '50%' }} />
      <p className="shx-state__desc">{label}</p>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="shx-product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shx-card shx-product-card">
          <div className="shx-skel" style={{ aspectRatio: '1/1', width: '100%' }} />
          <div className="shx-product-card__body">
            <div className="shx-skel" style={{ height: 14, width: '60%', marginBottom: 8 }} />
            <div className="shx-skel" style={{ height: 11, width: '90%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 4, height = 72 }) {
  return (
    <div className="shx-flex" style={{ flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shx-skel" style={{ height, width: '100%' }} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="shx-state">
      {icon && <div className="shx-state__icon">{icon}</div>}
      <p className="shx-state__title">{title}</p>
      {description && <p className="shx-state__desc">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something didn't load", description, onRetry }) {
  return (
    <div className="shx-state">
      <div className="shx-state__icon" style={{ color: 'var(--shx-red-600)' }}>!</div>
      <p className="shx-state__title">{title}</p>
      {description && <p className="shx-state__desc">{description}</p>}
      {onRetry && <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}
