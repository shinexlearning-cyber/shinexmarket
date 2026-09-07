import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../api/users';
import { useToast } from '../../components/Toast';

export default function AccountSettings() {
  const { user, updateLocalUser } = useAuth();
  const showToast = useToast();
  const [saving, setSaving] = useState(false);

  const toggleSelling = async () => {
    setSaving(true);
    try {
      const updated = await updateMyProfile({ is_seller: !user.is_seller });
      updateLocalUser(updated);
      showToast(updated.is_seller ? 'Selling turned on' : 'Selling turned off');
    } catch (err) {
      showToast(err.message || 'Could not update this setting');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <Header title="Account" />
      <div className="shx-container shx-mt-16">
        <div className="shx-card" style={{ padding: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 14 }}>Personal information</p>
          <p className="shx-muted shx-text-sm shx-mt-8">Name, bio, location, WhatsApp and shop details.</p>
          <Link to="/profile/edit" className="shx-link shx-text-sm shx-mt-8" style={{ display: 'inline-block' }}>Edit profile →</Link>
        </div>

        <div className="shx-card shx-mt-16" style={{ padding: 14 }}>
          <div className="shx-flex-between">
            <div>
              <p style={{ fontWeight: 700, fontSize: 14 }}>Buying &amp; selling</p>
              <p className="shx-muted shx-text-sm shx-mt-8" style={{ maxWidth: 220 }}>
                {user?.is_seller ? 'Selling is on — your shop and listings are enabled.' : 'You can only buy right now. Turn this on to open your shop.'}
              </p>
            </div>
            <button className={`shx-btn shx-btn--sm ${user?.is_seller ? 'shx-btn--outline' : 'shx-btn--primary'}`} disabled={saving} onClick={toggleSelling}>
              {user?.is_seller ? 'Turn off' : 'Turn on'}
            </button>
          </div>
        </div>

        <div className="shx-card shx-mt-16" style={{ padding: 14 }}>
          <p style={{ fontWeight: 700, fontSize: 14 }}>Email</p>
          <p className="shx-muted shx-text-sm shx-mt-8">{user?.email}</p>
        </div>
      </div>
    </AppShell>
  );
}
