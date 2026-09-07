import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import { MailIcon, WhatsAppIcon, CheckIcon } from '../components/Icons';
import { sendContactMessage, getContactInfo } from '../api/contact';
import { useAuth } from '../context/AuthContext';

const FAQS = [
  { q: 'How does listing approval work?', a: 'Every new or edited listing is reviewed by a SHINEX admin before it appears publicly. You\'ll see its status under My Listings.' },
  { q: 'How do I reach a seller?', a: 'Open a product and use the "Contact seller on WhatsApp" button, or visit their shop page.' },
  { q: 'How do subscriptions work?', a: 'Pro and Enterprise plans raise your active-listing limit and are paid securely via Paystack.' },
  { q: 'How do advertisements get approved?', a: 'After payment is confirmed, your ad is reviewed by an admin before going live.' }
];

export default function Support() {
  const { user } = useAuth();
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ name: user?.full_name || '', email: user?.email || '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getContactInfo().then(setInfo).catch(() => {}); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await sendContactMessage(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send your message');
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <Header title="Help & Support" />
      <div className="shx-container shx-mt-16">
        <h2 className="shx-section-title">Frequently asked questions</h2>
        {FAQS.map((f) => (
          <details key={f.q} className="shx-card shx-mb-8" style={{ padding: 12 }}>
            <summary style={{ fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{f.q}</summary>
            <p className="shx-muted shx-text-sm shx-mt-8">{f.a}</p>
          </details>
        ))}

        {info && (
          <div className="shx-card shx-mt-24" style={{ padding: 14 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Contact information</p>
            <p className="shx-flex shx-gap-8 shx-mt-8 shx-text-sm"><MailIcon width={15} height={15} /> {info.email}</p>
            {info.whatsapp && <p className="shx-flex shx-gap-8 shx-mt-8 shx-text-sm"><WhatsAppIcon width={15} height={15} /> {info.whatsapp}</p>}
          </div>
        )}

        <h2 className="shx-section-title shx-mt-24">Send us a message</h2>
        {sent ? (
          <div className="shx-state" style={{ padding: '24px 0' }}>
            <div className="shx-state__icon" style={{ color: 'var(--shx-green-700)', background: 'var(--shx-green-100)' }}><CheckIcon width={22} height={22} /></div>
            <p className="shx-state__title">Message sent</p>
            <p className="shx-state__desc">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="shx-field"><label className="shx-label">Name</label><input className="shx-input" required value={form.name} onChange={set('name')} /></div>
            <div className="shx-field"><label className="shx-label">Email</label><input type="email" className="shx-input" required value={form.email} onChange={set('email')} /></div>
            <div className="shx-field"><label className="shx-label">Phone (optional)</label><input className="shx-input" value={form.phone} onChange={set('phone')} /></div>
            <div className="shx-field"><label className="shx-label">Subject</label><input className="shx-input" required value={form.subject} onChange={set('subject')} /></div>
            <div className="shx-field"><label className="shx-label">Message</label><textarea className="shx-textarea" required value={form.message} onChange={set('message')} /></div>
            {error && <p className="shx-error-text shx-mb-16">{error}</p>}
            <button className="shx-btn shx-btn--primary" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
