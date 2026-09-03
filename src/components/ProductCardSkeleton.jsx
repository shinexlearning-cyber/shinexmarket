export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-surface-line bg-white">
      <div className="aspect-square w-full animate-pulse bg-surface-line" />
      <div className="space-y-2 p-2.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-surface-line" />
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-surface-line" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-surface-line" />
      </div>
    </div>
  )
}
