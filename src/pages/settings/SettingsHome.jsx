import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { ChevronRightIcon, UserIcon, ShieldIcon, MailIcon, StoreIcon } from '../../components/Icons';

// Scoped deliberately to what the SHINEX backend actually supports today —
// no fake 2FA, notification-preference, or account-deletion toggles.
export default function SettingsHome() {
  const SECTIONS = [
    { icon: <UserIcon width={19} height={19} />, label: 'Account', desc: 'Name, bio, location, shop info', to: '/settings/account' },
    { icon: <ShieldIcon width={19} height={19} />, label: 'Security', desc: 'Reset your password', to: '/settings/security' },
    { icon: <MailIcon width={19} height={19} />, label: 'Support', desc: 'Help center & contact us', to: '/support' },
    { icon: <StoreIcon width={19} height={19} />, label: 'Legal', desc: 'Terms, privacy & policies', to: '/legal' }
  ];
  return (
    <AppShell>
      <Header title="Settings" onBack={null} />
      <div className="shx-container shx-mt-16">
        {SECTIONS.map((s) => (
          <Link key={s.label} to={s.to} className="shx-flex-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--shx-border)' }}>
            <span className="shx-flex shx-gap-12">
              <span style={{ color: 'var(--shx-green-700)' }}>{s.icon}</span>
              <span>
                <p style={{ fontWeight: 600, fontSize: 14.5 }}>{s.label}</p>
                <p className="shx-muted shx-text-sm">{s.desc}</p>
              </span>
            </span>
            <ChevronRightIcon width={18} height={18} color="var(--shx-slate-300)" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
