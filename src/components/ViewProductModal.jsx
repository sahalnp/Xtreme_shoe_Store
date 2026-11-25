import React, { useState } from 'react';
import { X, Edit3, CheckCircle2, XCircle, Tag, Package, Layers } from 'lucide-react';

export default function ViewProductModal({ isOpen, onClose, product, onEdit }) {
  if (!isOpen || !product) return null;

  const resolveImageUrl = (img, imgUrl) => {
    if (imgUrl && typeof imgUrl === 'string' && (imgUrl.startsWith('http') || imgUrl.startsWith('data:'))) {
      return imgUrl;
    }
    if (img && typeof img === 'string') {
      if (img.startsWith('http') || img.startsWith('data:')) return img;
      const backendHost = window.location.hostname.includes('vercel.app')
        ? 'https://xtreme-backend-gamma.vercel.app'
        : 'http://localhost:8000';
      return `${backendHost}/uploads/${img}`;
    }
    return null;
  };

  const images = [
    { label: 'Angle 1 (Main)', url: resolveImageUrl(product.image, product.image_url) },
    { label: 'Angle 2 (Top)', url: resolveImageUrl(product.image2, product.image2_url) },
    { label: 'Angle 3 (Heel)', url: resolveImageUrl(product.image3, product.image3_url) },
    { label: 'Angle 4 (Sole)', url: resolveImageUrl(product.image4, product.image4_url) },
  ].filter(item => Boolean(item.url));

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Formatted INR Prices
  const baseInr = Math.round(parseFloat(product.price || 150) * 83);
  const minInr = product.min_price 
    ? Math.round(parseFloat(product.min_price) * 83)
    : Math.round(baseInr * 0.9);
  const maxInr = product.max_price 
    ? Math.round(parseFloat(product.max_price) * 83)
    : Math.round(baseInr * 1.2);

  // Parse sizes into array
  const parseSizes = (rawSize) => {
    if (!rawSize) return ['7', '8', '9', '10', '11'];
    if (Array.isArray(rawSize)) return rawSize.map(s => s.toString().replace(/^UK\s*/i, '').trim());
    if (typeof rawSize === 'string') {
      return rawSize.split(',').map(s => s.replace(/^UK\s*/i, '').trim()).filter(Boolean);
    }
    return ['7', '8', '9', '10', '11'];
  };

  const sizes = parseSizes(product.size);
  const activeImg = images[activeImageIndex]?.url || images[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          padding: 0
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '1.25rem',
          borderTopRightRadius: '1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              color: '#0f172a'
            }}>
              <Package size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Sneaker Details
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                ID: {product.id || product._id}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                onClose();
                if (onEdit) onEdit(product);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.45rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
            >
              <Edit3 size={14} /> Edit Sneaker
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.4rem' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '2rem' }}>
          
          {/* Left Column: Images Showcase */}
          <div>
            {/* Main Featured Photo Box */}
            <div style={{
              width: '100%',
              height: '320px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '1rem',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={activeImg} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Thumbnails of available angles */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '0.6rem',
                      border: activeImageIndex === idx ? '2px solid #000000' : '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt={img.label}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'center' }}>
              Showing {images.length > 0 ? `${activeImageIndex + 1} of ${images.length} angle photos` : 'Default view'}
            </div>
          </div>

          {/* Right Column: Sneaker Info & Specs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Brand & Category badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#fff7ed',
                color: '#c2410c',
                border: '1px solid #fed7aa',
                borderRadius: '9999px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {product.brand_name || 'NIKE'}
              </span>
              <span style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderRadius: '9999px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {product.category_name || 'Sneakers'}
              </span>
              {product.is_active ? (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <CheckCircle2 size={12} /> Active
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '9999px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  <XCircle size={12} /> Inactive
                </span>
              )}
            </div>

            {/* Model Title */}
            <h2 style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '1.45rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: '#0f172a',
              margin: '0.25rem 0 0',
              lineHeight: 1.25
            }}>
              {product.name}
            </h2>

            {/* Colorway */}
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              Colorway: <strong style={{ color: '#0f172a' }}>{product.color || 'Standard Edition'}</strong>
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '0.85rem 1.15rem'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Estimated Price Range
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                ₹{minInr.toLocaleString('en-IN')} – ₹{maxInr.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Available Sizes */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
                Available Sizes (UK)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {sizes.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#0f172a'
                    }}
                  >
                    UK {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Stock Count */}
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Inventory Stock: <strong style={{ color: '#0f172a' }}>{product.stock !== undefined ? product.stock : 20} pairs</strong>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Product Description
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {product.description || 'No custom description provided for this pair.'}
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#f8fafc',
          borderBottomLeftRadius: '1.25rem',
          borderBottomRightRadius: '1.25rem'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
