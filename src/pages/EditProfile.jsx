import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import { CameraIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile, uploadAvatar } from '../api/users';
import { useToast } from '../components/Toast';

export default function EditProfile() {
  const { user, updateLocalUser } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const fileRef = useRef();
  const [form, setForm] = useState({
    full_name: user?.full_name || '', bio: user?.bio || '', location: user?.location || '',
    whatsapp: user?.whatsapp || '', shop_name: user?.shop_name || '', shop_description: user?.shop_description || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onAvatarPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const updated = await uploadAvatar(file);
      updateLocalUser(updated);
      showToast('Profile photo updated');
    } catch (err) {
      showToast(err.message || 'Could not upload photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await updateMyProfile(form);
      updateLocalUser(updated);
      showToast('Profile updated');
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell nav={false}>
      <Header title="Edit Profile" />
      <div className="shx-container shx-mt-16">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, position: 'relative', width: 'fit-content', margin: '0 auto 24px' }}>
          <Avatar src={user?.avatar_url} name={user?.full_name} size={88} />
          <button type="button" onClick={() => fileRef.current.click()} disabled={avatarUploading}
            style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderRadius: '50%', background: 'var(--shx-green-500)', color: '#fff', border: '2px solid #fff', display: 'grid', placeItems: 'center' }}>
            <CameraIcon width={15} height={15} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarPick} />
        </div>

        <form onSubmit={submit}>
          <div className="shx-field">
            <label className="shx-label">Full name</label>
            <input className="shx-input" value={form.full_name} onChange={set('full_name')} />
          </div>
          <div className="shx-field">
            <label className="shx-label">Location</label>
            <input className="shx-input" value={form.location} onChange={set('location')} placeholder="Lagos, Nigeria" />
          </div>
          <div className="shx-field">
            <label className="shx-label">Bio</label>
            <textarea className="shx-textarea" value={form.bio} onChange={set('bio')} placeholder="Tell buyers a bit about yourself" />
          </div>

          {user?.is_seller && (
            <>
              <div className="shx-field">
                <label className="shx-label">WhatsApp number</label>
                <input className="shx-input" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+2348012345678" />
              </div>
              <div className="shx-field">
                <label className="shx-label">Shop name</label>
                <input className="shx-input" value={form.shop_name} onChange={set('shop_name')} />
              </div>
              <div className="shx-field">
                <label className="shx-label">Shop description</label>
                <textarea className="shx-textarea" value={form.shop_description} onChange={set('shop_description')} />
              </div>
            </>
          )}

          {error && <p className="shx-error-text shx-mb-16">{error}</p>}
          <button className="shx-btn shx-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>
      </div>
    </AppShell>
  );
}
