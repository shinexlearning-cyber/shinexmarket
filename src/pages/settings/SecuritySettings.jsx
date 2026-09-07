import { useState } from 'react';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { forgotPassword } from '../../api/auth';
import { useToast } from '../../components/Toast';

export default function SecuritySettings() {
  const { user } = useAuth();
  const showToast = useToast();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const sendReset = async () => {
    setSending(true);
    try {
      await forgotPassword(user.email);
      setSent(true);
    } catch (err) {
      showToast(err.message || 'Could not send reset email');
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <Header title="Security" />
      <div className="shx-container shx-mt-16">
        <div className="shx-card" style={{ padding: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 14 }}>Change your password</p>
          <p className="shx-muted shx-text-sm shx-mt-8">
            We'll send password reset instructions to {user?.email}.
          </p>
          <button className="shx-btn shx-btn--outline shx-btn--sm shx-mt-16" disabled={sending || sent} onClick={sendReset}>
            {sent ? 'Email sent' : sending ? 'Sending…' : 'Send reset email'}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
