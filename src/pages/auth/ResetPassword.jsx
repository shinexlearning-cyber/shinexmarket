import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not reset your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shx-app" style={{ minHeight: '100vh' }}>
      <div className="shx-container" style={{ paddingTop: 48 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Reset password</h1>
        <p className="shx-muted shx-text-sm shx-mb-16">Choose a new password for your account.</p>
        {!token && <p className="shx-error-text shx-mb-16">This reset link is missing its token. Please use the link from your email.</p>}
        <form onSubmit={submit}>
          <div className="shx-field">
            <label className="shx-label" htmlFor="password">New password</label>
            <input id="password" type="password" className="shx-input" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="shx-field">
            <label className="shx-label" htmlFor="confirm">Confirm new password</label>
            <input id="confirm" type="password" className="shx-input" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="shx-error-text shx-mb-16">{error}</p>}
          <button className="shx-btn shx-btn--primary" disabled={loading || !token}>{loading ? 'Resetting…' : 'Reset password'}</button>
        </form>
      </div>
    </div>
  );
}
