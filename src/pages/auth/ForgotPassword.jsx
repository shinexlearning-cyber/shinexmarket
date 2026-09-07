import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shx-app" style={{ minHeight: '100vh' }}>
      <div className="shx-container" style={{ paddingTop: 48 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Forgot password?</h1>
        <p className="shx-muted shx-text-sm shx-mb-16">Enter your email and we'll send you reset instructions.</p>

        {sent ? (
          <div className="shx-state" style={{ padding: '32px 0' }}>
            <p className="shx-state__title">Check your email</p>
            <p className="shx-state__desc">If an account exists for {email}, you'll receive password reset instructions shortly.</p>
            <Link to="/login" className="shx-btn shx-btn--primary" style={{ marginTop: 12 }}>Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="shx-field">
              <label className="shx-label" htmlFor="email">Email address</label>
              <input id="email" type="email" className="shx-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            {error && <p className="shx-error-text shx-mb-16">{error}</p>}
            <button className="shx-btn shx-btn--primary" disabled={loading}>{loading ? 'Sending…' : 'Send reset instructions'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
