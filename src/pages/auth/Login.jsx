import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShinexLogo from '../../components/ShinexLogo';
import { EyeIcon, EyeOffIcon } from '../../components/Icons';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(params.get('next') || '/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shx-app" style={{ minHeight: '100vh' }}>
      <div className="shx-container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <ShinexLogo size={72} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center' }}>Welcome back!</h1>
        <p className="shx-muted shx-text-sm" style={{ textAlign: 'center', marginBottom: 28 }}>Sign in to continue</p>

        <form onSubmit={submit}>
          <div className="shx-field">
            <label className="shx-label" htmlFor="email">Email or username</label>
            <input id="email" className="shx-input" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="password">Password</label>
            <div className="shx-input-group">
              <input id="password" type={showPw ? 'text' : 'password'} className="shx-input" required
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              <button type="button" className="shx-input-group__action" onClick={() => setShowPw((s) => !s)} aria-label="Toggle password visibility">
                {showPw ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Link to="/forgot-password" className="shx-link shx-text-sm">Forgot password?</Link>
            </div>
          </div>
          {error && <p className="shx-error-text" style={{ marginBottom: 12 }}>{error}</p>}
          <button className="shx-btn shx-btn--primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>

        <p className="shx-text-sm shx-muted" style={{ textAlign: 'center', marginTop: 22 }}>
          Don't have an account? <Link to="/register" className="shx-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
