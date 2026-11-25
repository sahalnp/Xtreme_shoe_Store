import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Image as ImageIcon, Plus } from 'lucide-react';
import { createCategory as apiCreateCategory, createBrand as apiCreateBrand } from '../api/client';

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null, 
  categories: initialCategories = [], 
  brands: initialBrands = [] 
}) {
  const isEditing = !!product;

  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [brandsList, setBrandsList] = useState(initialBrands);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [color, setColor] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stock, setStock] = useState(20);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Inline Category / Brand Creation State
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  // Images & Previews
  const [images, setImages] = useState({ image: null, image2: null, image3: null, image4: null });
  const [previews, setPreviews] = useState({ image: null, image2: null, image3: null, image4: null });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const AVAILABLE_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12'];

  useEffect(() => {
    setCategoriesList(initialCategories);
  }, [initialCategories]);

  useEffect(() => {
    setBrandsList(initialBrands);
  }, [initialBrands]);

  // Helper to parse size string into array of numbers/strings
  const parseSizeList = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map(s => s.toString().replace(/^UK\s*/i, '').trim());
    return raw
      .split(',')
      .map(s => s.replace(/^UK\s*/i, '').trim())
      .filter(Boolean);
  };

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || (categoriesList[0]?.id || categoriesList[0]?._id || ''));
      setBrand(product.brand || (brandsList[0]?.id || brandsList[0]?._id || ''));
      
      const parsedMin = product.min_price 
        ? Math.round(parseFloat(product.min_price) * 83) 
        : (product.price ? Math.round(parseFloat(product.price) * 83 * 0.9) : '');
      const parsedMax = product.max_price 
        ? Math.round(parseFloat(product.max_price) * 83) 
        : (product.price ? Math.round(parseFloat(product.price) * 83 * 1.2) : '');
      
      setMinPrice(parsedMin.toString());
      setMaxPrice(parsedMax.toString());
      setColor(product.color || 'Core Black / White');
      setSelectedSizes(parseSizeList(product.size));
      setStock(product.stock !== undefined ? product.stock : 20);
      setDescription(product.description || '');
      setIsActive(product.is_active !== undefined ? product.is_active : true);

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

      setPreviews({
        image: resolveImageUrl(product.image, product.image_url),
        image2: resolveImageUrl(product.image2, product.image2_url),
        image3: resolveImageUrl(product.image3, product.image3_url),
        image4: resolveImageUrl(product.image4, product.image4_url),
      });
      setImages({ image: null, image2: null, image3: null, image4: null });
    } else {
      setName('');
      setCategory(categoriesList[0]?.id || categoriesList[0]?._id || '');
      setBrand(brandsList[0]?.id || brandsList[0]?._id || '');
      setMinPrice('');
      setMaxPrice('');
      setColor('');
      setSelectedSizes([]);
      setStock(20);
      setDescription('');
      setIsActive(true);
      setPreviews({ image: null, image2: null, image3: null, image4: null });
      setImages({ image: null, image2: null, image3: null, image4: null });
    }
    setIsAddingCat(false);
    setIsAddingBrand(false);
    setNewCatName('');
    setNewBrandName('');
    setError('');
  }, [product, categoriesList, brandsList, isOpen]);

  if (!isOpen) return null;

  // Toggle size pill
  const handleToggleSize = (sz) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sz)) {
        if (prev.length === 1) return prev; // keep at least 1 size
        return prev.filter(s => s !== sz);
      } else {
        return [...prev, sz].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      }
    });
  };

  // Inline Category Creation
  const handleCreateNewCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const created = await apiCreateCategory({ name: newCatName.trim() });
      const createdId = created.id || created._id;
      setCategoriesList((prev) => [...prev, created]);
      setCategory(createdId);
      setNewCatName('');
      setIsAddingCat(false);
    } catch (err) {
      alert('Failed to add category: ' + err.message);
    }
  };

  // Inline Brand Creation
  const handleCreateNewBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    try {
      const created = await apiCreateBrand({ name: newBrandName.trim() });
      const createdId = created.id || created._id;
      setBrandsList((prev) => [...prev, created]);
      setBrand(createdId);
      setNewBrandName('');
      setIsAddingBrand(false);
    } catch (err) {
      alert('Failed to add brand: ' + err.message);
    }
  };

  const handleImageFileChange = (field, file) => {
    if (file) {
      setImages((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a shoe / model name');
      return;
    }
    if (!minPrice || parseFloat(minPrice) <= 0) {
      setError('Please enter a valid Min Price in ₹');
      return;
    }
    if (!maxPrice || parseFloat(maxPrice) <= 0) {
      setError('Please enter a valid Max Price in ₹');
      return;
    }
    if (parseFloat(minPrice) > parseFloat(maxPrice)) {
      setError('Min Price cannot be greater than Max Price');
      return;
    }
    if (!category) {
      setError('Please select or create a category');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('name', name.trim());
      data.append('category', category);
      if (brand) data.append('brand', brand);

      // Convert INR ₹ to USD equivalent for standard internal backend storage
      const usdMin = (parseFloat(minPrice) / 83).toFixed(2);
      const usdMax = (parseFloat(maxPrice) / 83).toFixed(2);
      data.append('min_price', usdMin);
      data.append('max_price', usdMax);
      data.append('price', usdMin);

      data.append('color', color.trim());
      const formattedSizes = selectedSizes.map(s => `UK ${s}`).join(', ');
      data.append('size', formattedSizes);
      data.append('stock', stock);
      data.append('description', description.trim());
      data.append('is_active', isActive ? 'true' : 'false');

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
          maxWidth: '860px',
          maxHeight: '94vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '1.25rem',
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
              Configure model, category, brand, price range in ₹ (INR), size options, and photos.
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

          {/* Shoe / Model Name */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 800 }}>Shoe / Model Name *</label>
            <input
              type="text"
              className="form-input"
              style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              placeholder="e.g. Air Jordan Retro 1 High"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category & Brand (with inline '+ New' buttons) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            
            {/* Category Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ color: '#334155', fontWeight: 800, margin: 0 }}>Category *</label>
                <button
                  type="button"
                  onClick={() => setIsAddingCat(!isAddingCat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f97316',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <Plus size={13} /> {isAddingCat ? 'Cancel' : 'Add Category'}
                </button>
              </div>

              {isAddingCat ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New category name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewCategory}
                    style={{
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 0.85rem',
                      borderRadius: '0.375rem',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <select
                  className="form-select"
                  style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Brand Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ color: '#334155', fontWeight: 800, margin: 0 }}>Brand *</label>
                <button
                  type="button"
                  onClick={() => setIsAddingBrand(!isAddingBrand)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f97316',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <Plus size={13} /> {isAddingBrand ? 'Cancel' : 'Add Brand'}
                </button>
              </div>

              {isAddingBrand ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="New brand name"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewBrand}
                    style={{
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 0.85rem',
                      borderRadius: '0.375rem',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <select
                  className="form-select"
                  style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {brandsList.map((b) => (
                    <option key={b.id || b._id} value={b.id || b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Price Range: Min Price (INR ₹) & Max Price (INR ₹) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 800 }}>Min Price (₹ INR) *</label>
              <input
                type="text"
                min="0"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontWeight: 700 }}
                placeholder="e.g. 9999"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 800 }}>Max Price (₹ INR) *</label>
              <input
                type="text"
                min="0"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', fontWeight: 700 }}
                placeholder="e.g. 14999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Colorway & Interactive Size Multi-Select Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155', fontWeight: 800 }}>Colorway *</label>
              <input
                type="text"
                className="form-input"
                style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                placeholder="e.g. Chicago Red / White / Black"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>

            {/* Size Multi-Select Clickable Pills */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label className="form-label" style={{ color: '#334155', fontWeight: 800, margin: 0 }}>
                  Available Sizes (UK) *
                </label>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {selectedSizes.length} selected
                </span>
              </div>

              {/* Clickable Size Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {AVAILABLE_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleToggleSize(sz)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '0.5rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        border: isSelected ? '1.5px solid #000000' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? '#000000' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#475569',
                        boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 800 }}>Product Description</label>
            <textarea
              rows="3"
              className="form-textarea"
              style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
              placeholder="Highlight sole cushioning, upper materials, and traction profile..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 4 Product Images Upload Grid: 2x2 Layout */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ color: '#334155', fontWeight: 800, marginBottom: '0.75rem' }}>
              Product Multi-Angle Photos (Main Image + 3 Additional Angles)
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {[
                { field: 'image', label: 'Main (Angle 1)' },
                { field: 'image2', label: 'Angle 2 (Top)' },
                { field: 'image3', label: 'Angle 3 (Heel)' },
                { field: 'image4', label: 'Angle 4 (Sole)' }
              ].map(({ field, label }) => (
                <div key={field} style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: '0.75rem',
                  padding: '0.85rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    height: '135px',
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
                      <ImageIcon size={32} color="#94a3b8" />
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

          {/* Modal Buttons */}
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
