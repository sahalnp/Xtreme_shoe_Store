import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Package,
  AlertOctagon
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import DeleteModal from '../components/DeleteModal';
import ProductModal from '../components/ProductModal';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchStoreStats, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../api/client';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async (query = searchTerm) => {
    try {
      setLoading(true);
      const [prodsData, catsData, statsData] = await Promise.all([
        fetchProducts({ 
          admin: true, 
          deleted: false, 
          category: selectedCategory, 
          search: query 
        }),
        fetchCategories(),
        fetchStoreStats(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadData(searchTerm);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (formData, id) => {
    if (id) {
      await updateProduct(id, formData);
    } else {
      await createProduct(formData);
    }
    await loadData();
  };

  const handleOpenDelete = (prod) => {
    setProductToDelete(prod);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true);
      await deleteProduct(id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await loadData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="admin-layout" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar with Navigation */}
      <AdminSidebar stats={stats} />

      {/* Main Content Area */}
      <main className="admin-main" style={{ padding: '2.5rem', backgroundColor: '#f8fafc' }}>
        
        {/* Top Header with ORANGE + Add Product Button (NO Reload Button) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.95rem', fontWeight: 900, color: '#0f172a' }}>
              Product Inventory & Listings
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>
              Manage shoe models, update prices, sizes, colors and availability.
            </p>
          </div>

          <div>
            {/* Create Product Button: VIBRANT ORANGE COLOR as requested */}
            <button
              onClick={handleOpenAdd}
              style={{
                backgroundColor: '#f97316',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.45rem',
                borderRadius: '0.625rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)',
                transition: 'background-color 0.15s ease, transform 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ea580c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f97316'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Plus size={18} />
              + Add Product
            </button>
          </div>
        </div>

        {/* Filters and Search Bar (NO Separate Search Button, NO Include Deleted Checkbox) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          marginBottom: '1.75rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          {/* Search Input: Press Enter to Search */}
          <div style={{ position: 'relative', flex: '1', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search shoe by name or brand (Press Enter)..."
              className="form-input"
              style={{ paddingLeft: '2.4rem', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clean Modern Products Table (NO Grey Header, Pure White/Clean Light Theme) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Shoe / Model</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Colorway</th>
                  <th style={{ padding: '1rem' }}>Sizes Available</th>
                  <th style={{ padding: '1rem' }}>Price (INR)</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      Loading sneaker inventory...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p style={{ fontWeight: 700 }}>No shoes found in this filter</p>
                      <button
                        onClick={handleOpenAdd}
                        style={{
                          marginTop: '1rem',
                          backgroundColor: '#f97316',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '0.5rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        + Create Your First Sneaker
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const prodId = prod.id || prod._id;
                    const inrVal = Math.round(parseFloat(prod.price) * 83);
                    const prodImg = prod.image_url || prod.image;

                    return (
                      <tr
                        key={prodId}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                          opacity: prod.is_deleted ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fcfdfe'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Thumbnail & Name */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '8px',
                              backgroundColor: '#f8fafc',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '1px solid #e2e8f0',
                              flexShrink: 0
                            }}>
                              {prodImg ? (
                                <img src={prodImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              ) : (
                                <Package size={22} color="#94a3b8" />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>{prod.name}</div>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: #{prodId.slice(-6)}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            borderRadius: '0.4rem',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            {prod.category_name || 'Sneakers'}
                          </span>
                        </td>

                        {/* Colorway */}
                        <td style={{ padding: '1rem', color: '#475569' }}>
                          {prod.color || 'Standard'}
                        </td>

                        {/* Available Sizes */}
                        <td style={{ padding: '1rem' }}>
                          <div style={{ maxWidth: '180px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                            {prod.size || 'UK 7-11'}
                          </div>
                        </td>

                        {/* Price in INR (₹) */}
                        <td style={{ padding: '1rem', fontWeight: 800, color: '#000000', fontSize: '0.95rem' }}>
                          ₹{inrVal.toLocaleString('en-IN')}
                        </td>

                        {/* Status (Shows Active or Deleted Badge) */}
                        <td style={{ padding: '1rem' }}>
                          {prod.is_deleted ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <AlertOctagon size={12} /> Deleted
                            </span>
                          ) : prod.is_active ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <CheckCircle2 size={12} /> Active
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <XCircle size={12} /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Action: Delete Icon Only (NO Edit Pencil Icon) */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleOpenDelete(prod)}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '6px',
                              backgroundColor: '#fff',
                              border: '1px solid #fecaca',
                              color: '#dc2626',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                            title="Delete sneaker"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add Product Modal (Increased Size, 4-Image Support, INR Currency) */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
