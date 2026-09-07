import { Link } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { ChevronRightIcon } from '../../components/Icons';

const PAGES = [
  { slug: 'terms', title: 'Terms & Conditions' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'seller-agreement', title: 'Seller Agreement' },
  { slug: 'refund-policy', title: 'Refund & Cancellation Policy' },
  { slug: 'prohibited-items', title: 'Prohibited Items Policy' },
  { slug: 'community-guidelines', title: 'Community Guidelines' }
];

export default function LegalIndex() {
  return (
    <AppShell>
      <Header title="Legal & Policies" />
      <div className="shx-container shx-mt-16">
        {PAGES.map((p) => (
          <Link key={p.slug} to={`/legal/${p.slug}`} className="shx-flex-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--shx-border)' }}>
            <span style={{ fontWeight: 600, fontSize: 14.5 }}>{p.title}</span>
            <ChevronRightIcon width={18} height={18} color="var(--shx-slate-300)" />
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
