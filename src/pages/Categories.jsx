import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import { getCategories } from '../api/products';
import { ListSkeleton, ErrorState, EmptyState } from '../components/States';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setCategories(null);
    getCategories().then(setCategories).catch(() => setError(true));
  };
  useEffect(load, []);

  return (
    <AppShell>
      <Header title="Categories" onBack={null} />
      <div className="shx-container shx-mt-16">
        {!categories && !error && <ListSkeleton count={8} height={64} />}
        {error && <ErrorState onRetry={load} />}
        {categories && categories.length === 0 && <EmptyState title="No categories yet" />}
        {categories && categories.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {categories.map((c) => (
              <button key={c.id} className="shx-card" style={{ padding: 16, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                onClick={() => navigate(`/search?category=${c.id}&name=${encodeURIComponent(c.name)}`)}>
                <span style={{ fontSize: 22 }}>{c.icon || '🏷️'}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
