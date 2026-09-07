import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { CameraIcon } from '../../components/Icons';
import { getAdPricing, createAdvertisement, payForAdvertisement } from '../../api/advertisements';
import { formatNaira } from '../../utils/format';
import { LoadingState } from '../../components/States';
import { useToast } from '../../components/Toast';

export default function CreateAd() {
  const navigate = useNavigate();
  const showToast = useToast();
  const fileRef = useRef();
  const [step, setStep] = useState(0); // 0 details, 1 review, 2 paying
  const [durations, setDurations] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', duration_id: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { getAdPricing().then(setDurations).catch(() => setDurations([])); }, []);

  if (!durations) return <AppShell nav={false}><LoadingState label="Loading pricing…" /></AppShell>;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const selected = durations.find((d) => d.id === form.duration_id);
  const previewUrl = image ? URL.createObjectURL(image) : null;

  const goReview = () => {
    if (!form.title || !form.duration_id || !image) return setError('Please fill in the title, choose a duration, and upload a banner image.');
    setError('');
    setStep(1);
  };

  const submitAndPay = async () => {
    setBusy(true);
    setError('');
    try {
      const ad = await createAdvertisement(form, image);
      const { authorization_url } = await payForAdvertisement(ad.id);
      window.location.href = authorization_url;
    } catch (err) {
      setError(err.message || 'Could not create advertisement');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell nav={false}>
      <Header title="Advertise" onBack={() => (step === 0 ? navigate(-1) : setStep(0))} />
      <div className="shx-container shx-mt-16">
        {step === 0 && (
          <>
            <div className="shx-field">
              <label className="shx-label">Ad title</label>
              <input className="shx-input" value={form.title} onChange={set('title')} placeholder="e.g. Big discount on phones this week" />
            </div>
            <div className="shx-field">
              <label className="shx-label">Description (optional)</label>
              <textarea className="shx-textarea" value={form.description} onChange={set('description')} />
            </div>
            <div className="shx-field">
              <label className="shx-label">Duration</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {durations.map((d) => (
                  <button key={d.id} type="button" className={`shx-chip${form.duration_id === d.id ? ' is-active' : ''}`}
                    onClick={() => setForm({ ...form, duration_id: d.id })} style={{ textAlign: 'center' }}>
                    {d.duration_days} days — {formatNaira(d.price)}
                  </button>
                ))}
              </div>
            </div>
            <div className="shx-field">
              <label className="shx-label">Banner image</label>
              {previewUrl ? (
                <img src={previewUrl} alt="" style={{ width: '100%', borderRadius: 12, aspectRatio: '16/9', objectFit: 'cover' }} onClick={() => fileRef.current.click()} />
              ) : (
                <button onClick={() => fileRef.current.click()} style={{ width: '100%', aspectRatio: '16/9', border: '1.5px dashed var(--shx-border)', borderRadius: 12, background: 'var(--shx-surface)', display: 'grid', placeItems: 'center', color: 'var(--shx-slate-500)' }}>
                  <CameraIcon width={24} height={24} />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </div>
            {error && <p className="shx-error-text shx-mb-16">{error}</p>}
            <button className="shx-btn shx-btn--primary" onClick={goReview}>Review</button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="shx-card" style={{ overflow: 'hidden', marginBottom: 16 }}>
              {previewUrl && <img src={previewUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />}
              <div style={{ padding: 14 }}>
                <p style={{ fontWeight: 700 }}>{form.title}</p>
                {form.description && <p className="shx-muted shx-text-sm shx-mt-8">{form.description}</p>}
              </div>
            </div>
            <div className="shx-card" style={{ padding: 14, marginBottom: 16 }}>
              <div className="shx-flex-between"><span className="shx-muted shx-text-sm">Duration</span><span style={{ fontWeight: 700 }}>{selected?.duration_days} days</span></div>
              <div className="shx-flex-between shx-mt-8"><span className="shx-muted shx-text-sm">Amount</span><span style={{ fontWeight: 700 }}>{formatNaira(selected?.price)}</span></div>
            </div>
            <p className="shx-hint shx-mb-16">After payment, your ad awaits admin approval before it goes live.</p>
            {error && <p className="shx-error-text shx-mb-16">{error}</p>}
            <button className="shx-btn shx-btn--primary" disabled={busy} onClick={submitAndPay}>
              {busy ? 'Redirecting to payment…' : `Pay ${formatNaira(selected?.price)}`}
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
