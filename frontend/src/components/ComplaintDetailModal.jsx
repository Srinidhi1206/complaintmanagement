import { X, ArrowUp, Clock, MapPin, User, Tag } from 'lucide-react';
import { upvoteComplaint } from '../api';

const categoryEmoji = {
  POTHOLE: '🕳️',
  DRAINAGE: '💧',
  STREETLIGHT: '💡',
  GARBAGE: '🗑️',
  WATER_ISSUE: '🚰',
  OTHERS: '📋',
};

function formatDate(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function ComplaintDetailModal({ complaint, onClose, onUpvote }) {
  if (!complaint) return null;
  const { id, title, description, category, status, upvotes, createdAt, user, imageBase64 } = complaint;

  const handleUpvote = async () => {
    try {
      await upvoteComplaint(id);
      onUpvote && onUpvote(id);
    } catch (e) { /* ignore */ }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{title}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <span className={`badge badge-${status?.toLowerCase()}`}>{status?.replace('_', ' ')}</span>
              <span className="badge">
                {categoryEmoji[category]} {category?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={15} /></button>
        </div>

        {imageBase64 && (
          <img
            src={imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`}
            alt="Complaint"
            className="detail-img"
          />
        )}

        <div className="section-label">Description</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
          {description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {user && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <User size={14} /> {user.name} · {user.area}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Clock size={14} /> Filed on {formatDate(createdAt)}
          </div>
        </div>

        <button className="upvote-btn" onClick={handleUpvote} style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
          <ArrowUp size={16} /> Upvote ({upvotes})
        </button>
      </div>
    </div>
  );
}
