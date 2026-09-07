const LABELS = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', paid: 'Paid', failed: 'Failed', paused: 'Paused', active: 'Active', expired: 'Expired', sold: 'Sold' };

export default function StatusBadge({ status }) {
  const cls = { pending: 'pending', approved: 'approved', active: 'approved', paid: 'approved', rejected: 'rejected', failed: 'rejected', paused: 'sold', expired: 'sold', sold: 'sold' }[status] || 'pending';
  return <span className={`shx-badge shx-badge--${cls}`}>{LABELS[status] || status}</span>;
}
