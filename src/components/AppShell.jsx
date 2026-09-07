import BottomNav from './BottomNav';

export default function AppShell({ children, nav = true }) {
  return (
    <div className="shx-app">
      <div className={`shx-screen${nav ? '' : ' shx-screen--no-nav'}`}>{children}</div>
      {nav && <BottomNav />}
    </div>
  );
}
