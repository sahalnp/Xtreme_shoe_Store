import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, product = null, categories = [] }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    color: 'Black / White',
    size: 'UK 7, UK 8, UK 9, UK 10, UK 11',
    stock: 20,
    description: '',
    is_active: true,
  });

  const [images, setImages] = useState({
    image: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [previews, setPreviews] = useState({
    image: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || (categories[0]?.id || categories[0]?._id || ''),
        price: product.price ? Math.round(parseFloat(product.price) * 83) : '',
        color: product.color || 'Black',
        size: product.size || 'UK 7, UK 8, UK 9, UK 10',
        stock: product.stock !== undefined ? product.stock : 15,
        description: product.description || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
      setPreviews({
        image: product.image_url || product.image || null,
        image2: product.image2_url || product.image2 || null,
        image3: product.image3_url || product.image3 || null,
        image4: product.image4_url || product.image4 || null,
      });
      setImages({ image: null, image2: null, image3: null, image4: null });
    } else {
      setFormData({
        name: '',
        category: categories[0]?.id || categories[0]?._id || '',
        price: '',
        color: 'Core Black / White',
        size: 'UK 7, UK 8, UK 9, UK 10, UK 11',
        stock: 20,
        description: '',
        is_active: true,
      });
      setPreviews({ image: null, image2: null, image3: null, image4: null });
      setImages({ image: null, image2: null, image3: null, image4: null });
    }
    setError('');
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (field, file) => {
    if (file) {
      setImages((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please provide a valid price in INR (₹)');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category);
      // Convert INR back to standard price or store directly
      const usdEquivalent = (parseFloat(formData.price) / 83).toFixed(2);
      data.append('price', usdEquivalent);
      data.append('color', formData.color.trim());
      data.append('size', formData.size.trim());
      data.append('stock', formData.stock);
      data.append('description', formData.description.trim());
      data.append('is_active', formData.is_active ? 'true' : 'false');

      ['image', 'image2', 'image3', 'image4'].forEach((k) => {
        if (images[k]) {
          data.append(k, images[k]);
        }
      });

      await onSave(data, product?.id || product?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong while saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{
          maxWidth: '840px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
              {isEditing ? 'Edit Sneaker' : 'Add New Sneaker'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Upload up to 4 shoe angles, set sizes, colors, and pricing in ₹ (INR).
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.4rem' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Product Name */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Shoe / Model Name *</label>
            <input
              type="text"
              className="form-input"
              style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              placeholder="e.g. Air Jordan Retro 1 High"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Category & Price (in INR ₹) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Category *</label>
              <select
                className="form-select"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Price (₹ INR) *</label>
              <input
                type="number"
                step="1"
                min="0"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontWeight: 700 }}
                placeholder="12999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Colorway & Available Sizes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Colorway *</label>
              <input
                type="text"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                placeholder="e.g. Chicago Red / White / Black"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Available Sizes (UK) *</label>
              <input
                type="text"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                placeholder="UK 7, UK 8, UK 9, UK 10, UK 11"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 700 }}>Product Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              placeholder="Highlight sole cushioning, upper materials, and traction profile..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* 4 Product Images Upload Grid */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 800, marginBottom: '0.75rem' }}>
              Product Multi-Angle Photos (Main Image + 3 Additional Angles)
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { field: 'image', label: 'Main Image (Angle 1)' },
                { field: 'image2', label: 'Image 2 (Top View)' },
                { field: 'image3', label: 'Image 3 (Heel / Back)' },
                { field: 'image4', label: 'Image 4 (Sole / Profile)' }
              ].map(({ field, label }) => (
                <div key={field} style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: '0.75rem',
                  padding: '0.85rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    height: '110px',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.65rem'
                  }}>
                    {previews[field] ? (
                      <img src={previews[field]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <ImageIcon size={28} color="#94a3b8" />
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    id={`upload-${field}`}
                    onChange={(e) => handleImageFileChange(field, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor={`upload-${field}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.4rem',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#0f172a'
                    }}
                  >
                    {previews[field] ? 'Change' : '+ Upload'}
                  </label>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.35rem' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: '1rem 0 1.5rem' }}>
            <input
              type="checkbox"
              id="modal_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="modal_is_active" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              Publish item immediately in customer store
            </label>
          </div>

          {/* Modal Buttons: Orange Create/Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#f97316',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '0.5rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
              }}
              disabled={isSubmitting}
            >
              <Check size={16} />
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Sneaker')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
