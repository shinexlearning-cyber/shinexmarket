import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShinexLogo from '../components/ShinexLogo';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const seenOnboarding = localStorage.getItem('shinex_onboarded');
    const t = setTimeout(() => {
      if (isAuthenticated) navigate('/home', { replace: true });
      else if (seenOnboarding) navigate('/login', { replace: true });
      else navigate('/onboarding', { replace: true });
    }, 1100);
    return () => clearTimeout(t);
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="shx-app" style={{ background: 'linear-gradient(180deg, #06210F, #0B3D24 60%, #06210F)', minHeight: '100vh', color: '#fff' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <ShinexLogo size={104} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 0.2 }}>SHINEX</div>
          <div style={{ fontSize: 12.5, letterSpacing: 3, color: '#9FD8B4', marginTop: 2 }}>MARKETPLACE</div>
        </div>
        <p style={{ color: '#BFE3CC', fontSize: 13.5, marginTop: 4 }}>Shop · Sell · Connect</p>
      </div>
      <div style={{ padding: '0 40px 48px', textAlign: 'center' }}>
        <p style={{ color: '#BFE3CC', fontSize: 13 }}>Everything You Need, in One Place.</p>
      </div>
    </div>
  );
}
