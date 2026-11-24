import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, product, onConfirm, onCancel, isDeleting }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--danger)'
          }}>
            <AlertTriangle size={22} />
          </div>
          <button 
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Delete Product
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>"{product.name}"</strong>? 
          This will soft-delete the shoe from active store listings and move it to archived items.
        </p>

        <div style={{
          backgroundColor: 'var(--bg-input)',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>Category:</span>
            <span style={{ color: '#fff', fontWeight: 500 }}>{product.category_name || 'Sneakers'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-dim)' }}>Price:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>${parseFloat(product.price).toFixed(2)}</span>
          </div>
        </div>

        {/* Modal Buttons: Delete and Cancel */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
            style={{ padding: '0.65rem 1.25rem' }}
          >
            Cancel
          </button>
          
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product.id)}
            disabled={isDeleting}
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

