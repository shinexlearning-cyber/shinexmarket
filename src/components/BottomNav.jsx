import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, GridIcon, PlusCircleIcon, BellIcon, UserIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const goSell = () => {
    if (!isAuthenticated) return navigate('/login?next=/sell');
    navigate('/sell');
  };

  return (
    <nav className="shx-bottomnav" aria-label="Primary">
      <NavLink to="/home" className={({ isActive }) => `shx-navitem${isActive ? ' is-active' : ''}`}>
        <HomeIcon width={22} height={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/categories" className={({ isActive }) => `shx-navitem${isActive ? ' is-active' : ''}`}>
        <GridIcon width={22} height={22} />
        <span>Categories</span>
      </NavLink>
      <button className="shx-navitem shx-navitem--sell" onClick={goSell} aria-label="Sell a product">
        <span className="shx-navitem__sellicon"><PlusCircleIcon width={22} height={22} /></span>
        <span style={{ color: 'var(--shx-slate-500)', marginTop: 2 }}>Sell</span>
      </button>
      <NavLink to="/activity" className={({ isActive }) => `shx-navitem${isActive ? ' is-active' : ''}`}>
        <BellIcon width={22} height={22} />
        <span>Activity</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `shx-navitem${isActive ? ' is-active' : ''}`}>
        <UserIcon width={22} height={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
