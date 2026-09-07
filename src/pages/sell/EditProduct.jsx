import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { getProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/products';
import { LoadingState } from '../../components/States';
import { useToast } from '../../components/Toast';

const CONDITIONS = [{ v: 'new', l: 'New' }, { v: 'used', l: 'Used' }, { v: 'refurbished', l: 'Refurbished' }];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getProduct(id).then((p) => setForm({
      name: p.name, price: p.price, category_id: p.category_id || p.category?.id || '',
      condition: p.condition, location: p.location || '', description: p.description || ''
    })).catch(() => setError('Could not load this product'));
  }, [id]);

  if (!form) return <AppShell nav={false}><LoadingState label="Loading listing…" /></AppShell>;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProduct(id, form, []);
      showToast('Listing updated — it will be re-reviewed before going live');
      navigate('/my-listings');
    } catch (err) {
      setError(err.message || 'Could not update listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell nav={false}>
      <Header title="Edit listing" />
      <div className="shx-container shx-mt-16">
        <form onSubmit={submit}>
          <div className="shx-field">
            <label className="shx-label">Product title</label>
            <input className="shx-input" value={form.name} onChange={set('name')} />
          </div>
          <div className="shx-field">
            <label className="shx-label">Category</label>
            <select className="shx-select" value={form.category_id} onChange={set('category_id')}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="shx-field">
            <label className="shx-label">Condition</label>
            <div className="shx-flex shx-gap-8">
              {CONDITIONS.map((c) => (
                <button key={c.v} type="button" className={`shx-chip${form.condition === c.v ? ' is-active' : ''}`} onClick={() => setForm({ ...form, condition: c.v })} style={{ flex: 1, textAlign: 'center' }}>{c.l}</button>
              ))}
            </div>
          </div>
          <div className="shx-field">
            <label className="shx-label">Price (NGN)</label>
            <input className="shx-input" type="number" value={form.price} onChange={set('price')} />
          </div>
          <div className="shx-field">
            <label className="shx-label">Location</label>
            <input className="shx-input" value={form.location} onChange={set('location')} />
          </div>
          <div className="shx-field">
            <label className="shx-label">Description</label>
            <textarea className="shx-textarea" value={form.description} onChange={set('description')} />
          </div>
          <p className="shx-hint shx-mb-16">Saving changes sends this listing back for admin review before it's public again.</p>
          {error && <p className="shx-error-text shx-mb-16">{error}</p>}
          <button className="shx-btn shx-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </AppShell>
  );
}
