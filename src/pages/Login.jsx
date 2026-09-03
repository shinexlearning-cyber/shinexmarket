import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-500">Log in to buy, sell and manage your shop.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

        {error && <p className="rounded-control bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-control bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-ink-500">
        New to SHINEX?{' '}
        <Link to="/register" className="font-medium text-brand-600">
          Create an account
        </Link>
      </p>
    </div>
  )
}
