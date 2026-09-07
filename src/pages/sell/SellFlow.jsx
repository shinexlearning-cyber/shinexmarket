import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { CameraIcon, CheckIcon, XIcon } from '../../components/Icons';
import { createProduct, getCategories } from '../../api/products';
import { formatNaira } from '../../utils/format';
import { useToast } from '../../components/Toast';

const STEPS = ['Details', 'Images', 'Preview', 'Submitted'];
const CONDITIONS = [{ v: 'new', l: 'New' }, { v: 'used', l: 'Used' }, { v: 'refurbished', l: 'Refurbished' }];

export default function SellFlow() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category_id: '', condition: 'used', location: '', description: '' });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validateDetails = () => {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.price || Number(form.price) < 0) return 'Enter a valid price';
    if (!form.category_id) return 'Please select a category';
    return '';
  };

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };
  const removeImage = (i) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const goNext = () => {
    setError('');
    if (step === 0) {
      const v = validateDetails();
      if (v) return setError(v);
    }
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await createProduct(form, images);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Could not submit your listing');
      if (err.status === 403) showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const previewUrls = images.map((f) => URL.createObjectURL(f));

  if (step === 3) {
    return (
      <AppShell nav={false}>
        <Header title="" onBack={null} />
        <div className="shx-state" style={{ paddingTop: 60 }}>
          <div className="shx-state__icon" style={{ background: 'var(--shx-green-100)', color: 'var(--shx-green-700)' }}>
            <CheckIcon width={26} height={26} />
          </div>
          <p className="shx-state__title">Submitted for review</p>
          <p className="shx-state__desc">Your listing "{form.name}" is pending admin review. We'll notify you once it's approved and live on SHINEX.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button className="shx-btn shx-btn--outline shx-btn--sm" onClick={() => navigate('/my-listings')}>View my listings</button>
            <button className="shx-btn shx-btn--primary shx-btn--sm" onClick={() => navigate('/home')}>Back to home</button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={false}>
      <Header title="Sell a product" onBack={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))} />
      <div className="shx-container shx-mt-16">
        <div className="shx-flex shx-gap-8 shx-mb-24">
          {STEPS.slice(0, 3).map((s, i) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--shx-green-500)' : 'var(--shx-border)' }} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="shx-section-title">1. Product details</h2>
            <div className="shx-field">
              <label className="shx-label">Product title</label>
              <input className="shx-input" value={form.name} onChange={set('name')} placeholder="e.g. iPhone 15 Pro Max" />
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
                  <button key={c.v} type="button" className={`shx-chip${form.condition === c.v ? ' is-active' : ''}`} onClick={() => setForm({ ...form, condition: c.v })} style={{ flex: 1, textAlign: 'center' }}>
                    {c.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="shx-field">
              <label className="shx-label">Price (NGN)</label>
              <input className="shx-input" type="number" value={form.price} onChange={set('price')} placeholder="0.00" />
            </div>
            <div className="shx-field">
              <label className="shx-label">Location</label>
              <input className="shx-input" value={form.location} onChange={set('location')} placeholder="e.g. Lagos, Nigeria" />
            </div>
            <div className="shx-field">
              <label className="shx-label">Description</label>
              <textarea className="shx-textarea" value={form.description} onChange={set('description')} placeholder="Describe your product…" />
            </div>
            {error && <p className="shx-error-text shx-mb-16">{error}</p>}
            <button className="shx-btn shx-btn--primary" onClick={goNext}>Next</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="shx-section-title">2. Upload images</h2>
            <p className="shx-muted shx-text-sm shx-mb-16">Add up to 5 photos. The first photo will be the cover image.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {previewUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '1/1' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  <button className="shx-fav-btn" onClick={() => removeImage(i)}><XIcon width={14} height={14} /></button>
                </div>
              ))}
              {images.length < 5 && (
                <button onClick={() => fileRef.current.click()} style={{ aspectRatio: '1/1', border: '1.5px dashed var(--shx-border)', borderRadius: 10, background: 'var(--shx-surface)', display: 'grid', placeItems: 'center', color: 'var(--shx-slate-500)' }}>
                  <CameraIcon width={22} height={22} />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPickImages} />
            <button className="shx-btn shx-btn--primary shx-mt-24" onClick={goNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="shx-section-title">3. Preview</h2>
            <div className="shx-card" style={{ overflow: 'hidden' }}>
              {previewUrls[0] ? <img src={previewUrls[0]} alt="" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} /> : <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--shx-slate-100)' }} />}
              <div style={{ padding: 14 }}>
                <p style={{ fontWeight: 800, fontSize: 17 }}>{formatNaira(form.price || 0)}</p>
                <p style={{ fontWeight: 600, marginTop: 4 }}>{form.name}</p>
                <p className="shx-muted shx-text-sm shx-mt-8">{form.location} · {form.condition}</p>
                {form.description && <p className="shx-text-sm shx-mt-16">{form.description}</p>}
              </div>
            </div>
            {error && <p className="shx-error-text shx-mt-16">{error}</p>}
            <button className="shx-btn shx-btn--primary shx-mt-24" disabled={submitting} onClick={submit}>
              {submitting ? 'Submitting…' : 'Submit for review'}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
