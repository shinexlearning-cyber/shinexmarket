import { useParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';

const TITLES = {
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
  'seller-agreement': 'Seller Agreement',
  'refund-policy': 'Refund & Cancellation Policy',
  'prohibited-items': 'Prohibited Items Policy',
  'community-guidelines': 'Community Guidelines'
};

// The backend has no CMS/content table for legal pages, so this renders
// a clean shell rather than invented legal text — SHINEX's legal/policy
// team should supply the real copy for each slug below before launch.
export default function LegalPage() {
  const { slug } = useParams();
  const title = TITLES[slug] || 'Policy';

  return (
    <AppShell>
      <Header title={title} />
      <div className="shx-container shx-mt-16">
        <div className="shx-card" style={{ padding: 16 }}>
          <p className="shx-muted shx-text-sm" style={{ lineHeight: 1.6 }}>
            This page is a placeholder. Add SHINEX's official "{title}" text here — the backend
            doesn't currently store editable policy content, so this copy should come directly
            from your legal team rather than being generated.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
