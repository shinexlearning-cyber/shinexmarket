import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not create your account. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="font-display text-2xl font-bold text-ink-900">Join SHINEX</h1>
      <p className="mt-1 text-sm text-ink-500">One account to browse and sell — no separate seller signup.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700">Full name</label>
          <input
            required
            value={form.name}
            onChange={update('name')}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

        {error && <p className="rounded-control bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-control bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-500">
        Already on SHINEX?{' '}
        <Link to="/login" className="font-medium text-brand-600">
          Log in
        </Link>
      </p>
    </div>
  )
}
