import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShinexLogo from '../../components/ShinexLogo';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState('buy'); // 'buy' | 'sell'
  const [form, setForm] = useState({
    full_name: '', username: '', email: '', phone: '', password: '',
    whatsapp: '', shop_name: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, account_type: accountType });
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shx-app" style={{ minHeight: '100vh' }}>
      <div className="shx-container" style={{ paddingTop: 40, paddingBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <ShinexLogo size={64} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center' }}>Create your account</h1>
        <p className="shx-muted shx-text-sm" style={{ textAlign: 'center', marginBottom: 22 }}>
          Join SHINEX and start exploring amazing products and services.
        </p>

        <div className="shx-field">
          <label className="shx-label">I want to</label>
          <div className="shx-flex shx-gap-8">
            <button type="button" className={`shx-chip${accountType === 'buy' ? ' is-active' : ''}`} onClick={() => setAccountType('buy')} style={{ flex: 1, textAlign: 'center' }}>
              Only buy
            </button>
            <button type="button" className={`shx-chip${accountType === 'sell' ? ' is-active' : ''}`} onClick={() => setAccountType('sell')} style={{ flex: 1, textAlign: 'center' }}>
              Buy & sell
            </button>
          </div>
          <p className="shx-hint">One SHINEX account either way — you can turn on selling later from Settings.</p>
        </div>

        <form onSubmit={submit}>
          <div className="shx-field">
            <label className="shx-label" htmlFor="full_name">Full name</label>
            <input id="full_name" className="shx-input" required value={form.full_name} onChange={set('full_name')} placeholder="John Doe" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="username">Username</label>
            <input id="username" className="shx-input" required value={form.username} onChange={set('username')} placeholder="johndoe" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="email">Email address</label>
            <input id="email" type="email" className="shx-input" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="phone">Phone number</label>
            <input id="phone" className="shx-input" required value={form.phone} onChange={set('phone')} placeholder="08012345678" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="shx-input" required minLength={6} value={form.password} onChange={set('password')} placeholder="••••••••" />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="location">Location</label>
            <input id="location" className="shx-input" value={form.location} onChange={set('location')} placeholder="Lagos, Nigeria" />
          </div>

          {accountType === 'sell' && (
            <>
              <div className="shx-field">
                <label className="shx-label" htmlFor="shop_name">Shop name</label>
                <input id="shop_name" className="shx-input" value={form.shop_name} onChange={set('shop_name')} placeholder="JD Tech Store" />
              </div>
              <div className="shx-field">
                <label className="shx-label" htmlFor="whatsapp">WhatsApp number</label>
                <input id="whatsapp" className="shx-input" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+2348012345678" />
                <p className="shx-hint">Include your country code — buyers will use this to reach you.</p>
              </div>
            </>
          )}

          {error && <p className="shx-error-text" style={{ marginBottom: 12 }}>{error}</p>}
          <button className="shx-btn shx-btn--primary" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>

        <p className="shx-text-sm shx-muted" style={{ textAlign: 'center', marginTop: 22 }}>
          Already have an account? <Link to="/login" className="shx-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
