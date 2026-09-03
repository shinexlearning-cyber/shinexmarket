import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-3xl font-bold text-ink-900">404</p>
      <p className="text-sm text-ink-500">This page doesn't exist on SHINEX.</p>
      <Link to="/" className="rounded-control bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
        Back to Home
      </Link>
    </div>
  )
}
