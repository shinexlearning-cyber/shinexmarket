import { useState } from 'react';
import { createReport } from '../api/reports';
import { useToast } from './Toast';
import { XIcon } from './Icons';

const REASONS = ['Spam or scam', 'Counterfeit item', 'Inappropriate content', 'Misleading listing', 'Harassment', 'Other'];

export default function ReportModal({ target, onClose }) {
  // target: { target_product_id } | { target_user_id } | { target_advertisement_id }
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const submit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await createReport({ ...target, reason, description });
      showToast('Report submitted. Our team will review it.');
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div className="shx-flex-between shx-mb-16">
          <h2 style={{ fontSize: 16, fontWeight: 800 }}>Report this</h2>
          <button className="shx-header__icon-btn" onClick={onClose}><XIcon width={18} height={18} /></button>
        </div>
        <div className="shx-field">
          <label className="shx-label">Reason</label>
          {REASONS.map((r) => (
            <label key={r} className="shx-flex shx-gap-8" style={{ padding: '10px 0', borderBottom: '1px solid var(--shx-border)' }}>
              <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
              {r}
            </label>
          ))}
        </div>
        <div className="shx-field">
          <label className="shx-label">Additional details (optional)</label>
          <textarea className="shx-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us more…" />
        </div>
        <button className="shx-btn shx-btn--primary" disabled={!reason || submitting} onClick={submit}>
          {submitting ? 'Submitting…' : 'Submit report'}
        </button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(14,21,18,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' };
const sheetStyle = { background: 'var(--shx-white)', width: '100%', maxWidth: 'var(--shx-max-width)', borderRadius: '20px 20px 0 0', padding: 20, maxHeight: '80vh', overflowY: 'auto' };
