import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import {
  StoreIcon, HeartIcon, MegaphoneIcon, CrownIcon, BellIcon,
  ShieldIcon, LogoutIcon, ChevronRightIcon, EditIcon
} from '../components/Icons';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const rows = [
    { icon: <StoreIcon width={19} height={19} />, label: 'My Shop', to: '/my-shop' },
    { icon: <StoreIcon width={19} height={19} />, label: 'My Listings', to: '/my-listings' },
    { icon: <HeartIcon width={19} height={19} />, label: 'Favorites', to: '/favorites' },
    { icon: <CrownIcon width={19} height={19} />, label: 'Subscription', to: '/subscriptions' },
    { icon: <MegaphoneIcon width={19} height={19} />, label: 'Advertisements', to: '/advertise' },
    { icon: <BellIcon width={19} height={19} />, label: 'Activity', to: '/activity' },
    { icon: <ShieldIcon width={19} height={19} />, label: 'Settings', to: '/settings' }
  ];

  return (
    <AppShell>
      <div className="shx-header" style={{ height: 'auto', paddingTop: 16, paddingBottom: 16 }}>
        <h1 className="shx-header__title">My Profile</h1>
        <Link to="/profile/edit" className="shx-header__icon-btn"><EditIcon width={17} height={17} /></Link>
      </div>
      <div className="shx-container shx-mt-16">
        <div className="shx-flex shx-gap-12">
          <Avatar src={user?.avatar_url} name={user?.full_name} size={64} />
          <div>
            <p style={{ fontWeight: 800, fontSize: 17 }}>{user?.full_name}</p>
            <p className="shx-muted shx-text-sm">@{user?.username}</p>
          </div>
        </div>

        <div className="shx-mt-24" style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((r) => (
            <Link key={r.label} to={r.to} className="shx-flex-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--shx-border)' }}>
              <span className="shx-flex shx-gap-12" style={{ color: 'var(--shx-ink)' }}>
                <span style={{ color: 'var(--shx-green-700)' }}>{r.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 14.5 }}>{r.label}</span>
              </span>
              <ChevronRightIcon width={18} height={18} color="var(--shx-slate-300)" />
            </Link>
          ))}
          <button className="shx-flex shx-gap-12" style={{ padding: '14px 0', color: 'var(--shx-red-600)', background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, fontSize: 14.5 }} onClick={doLogout}>
            <LogoutIcon width={19} height={19} /> Log out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
