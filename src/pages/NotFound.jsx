import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="shx-app" style={{ minHeight: '100vh' }}>
      <div className="shx-state" style={{ paddingTop: 100 }}>
        <p className="shx-state__title">Page not found</p>
        <Link to="/home" className="shx-btn shx-btn--primary" style={{ marginTop: 12, width: 'auto', padding: '10px 20px' }}>Go home</Link>
      </div>
    </div>
  );
}
