import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3,
  Eye,
  CheckCircle2, 
  XCircle,
  Package,
  AlertOctagon,
  User,
  LogOut,
  Store,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import DeleteModal from '../components/DeleteModal';
import ProductModal from '../components/ProductModal';
import ViewProductModal from '../components/ViewProductModal';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchBrands,
  fetchStoreStats, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../api/client';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View Product Modal state
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleOpenView = (product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  // Active Tab for Admin View ('products' or 'account')
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const loadData = async (query = searchTerm) => {
    try {
      setLoading(true);
      const [prodsData, catsData, brandsData, statsData] = await Promise.all([
        fetchProducts({ 
          admin: true, 
          deleted: false, 
          category: selectedCategory, 
          search: query 
        }),
        fetchCategories(),
        fetchBrands().catch(() => []),
        fetchStoreStats(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setBrands(brandsData);
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

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
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
        
        {/* VIEW 1: PRODUCTS INVENTORY TAB */}
        {activeTab === 'products' && (
          <>
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
                {/* Create Product Button: VIBRANT ORANGE COLOR with SINGLE plus icon (Desktop) */}
                <button
                  className="btn-add-desktop"
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
                  Add Product
                </button>
              </div>
            </div>

        {/* Filters and Search Bar (Responsive flex wrap) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '1rem 1.25rem',
          borderRadius: '0.75rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          {/* Search Input: Press Enter to Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search shoe by name or brand..."
              className="form-input"
              style={{ paddingLeft: '2.4rem', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          {/* Category & Brand Dropdowns from DB */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '150px', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
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
                  <th style={{ padding: '0.85rem 1rem' }}>Shoe / Model</th>
                  <th className="col-hide-mobile" style={{ padding: '0.85rem 0.65rem' }}>Brand</th>
                  <th className="col-hide-mobile" style={{ padding: '0.85rem 0.65rem' }}>Category</th>
                  <th className="col-hide-mobile" style={{ padding: '0.85rem 0.65rem' }}>Colorway</th>
                  <th className="col-hide-mobile" style={{ padding: '0.85rem 0.65rem' }}>Sizes Available</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Price Range</th>
                  <th className="col-hide-mobile" style={{ padding: '0.85rem 0.65rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                      Loading sneaker inventory...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
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
                  products
                    .filter((p) => {
                      if (!selectedBrand) return true;
                      const bObj = brands.find(b => (b.id || b._id) === selectedBrand);
                      const bName = bObj ? bObj.name.toLowerCase() : '';
                      const prodBrand = (p.brand || '').toString();
                      const prodBrandName = (p.brand_name || '').toLowerCase();
                      return prodBrand === selectedBrand || prodBrandName === bName;
                    })
                    .map((prod) => {
                    const prodId = prod.id || prod._id;
                    const inrVal = Math.round(parseFloat(prod.price || prod.min_price || 0) * 83);
                    const minInr = prod.min_price ? Math.round(parseFloat(prod.min_price) * 83) : Math.round(inrVal * 0.9);
                    const maxInr = prod.max_price ? Math.round(parseFloat(prod.max_price) * 83) : Math.round(inrVal * 1.2);
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
                        {/* Thumbnail & Name (Clickable to View) */}
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                            onClick={() => handleOpenView(prod)}
                            title="Click to view sneaker details"
                          >
                            <div style={{
                              width: '46px',
                              height: '46px',
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
                                <img src={prodImg} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                              ) : (
                                <Package size={20} color="#94a3b8" />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{prod.name}</div>
                              <div style={{ marginTop: '0.2rem' }}>
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  color: '#ea580c',
                                  backgroundColor: '#fff7ed',
                                  border: '1px solid #ffedd5',
                                  padding: '0.12rem 0.45rem',
                                  borderRadius: '4px'
                                }}>
                                  {prod.brand_name || prod.brand?.name || 'Nike'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Brand (Desktop only) */}
                        <td className="col-hide-mobile" style={{ padding: '0.75rem 0.65rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            backgroundColor: '#fff7ed',
                            color: '#ea580c',
                            border: '1px solid #ffedd5',
                            borderRadius: '0.4rem',
                            fontSize: '0.78rem',
                            fontWeight: 800
                          }}>
                            {prod.brand_name || prod.brand?.name || 'Nike'}
                          </span>
                        </td>

                        {/* Category (Desktop only) */}
                        <td className="col-hide-mobile" style={{ padding: '0.75rem 0.65rem' }}>
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

                        {/* Colorway (Desktop only) */}
                        <td className="col-hide-mobile" style={{ padding: '0.75rem 0.65rem', color: '#475569', fontSize: '0.82rem' }}>
                          {prod.color || 'Standard'}
                        </td>

                        {/* Available Sizes (Desktop only) */}
                        <td className="col-hide-mobile" style={{ padding: '0.75rem 0.65rem' }}>
                          <div style={{ maxWidth: '160px', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                            {prod.size || 'UK 7-11'}
                          </div>
                        </td>

                        {/* Price Range in INR (₹) */}
                        <td style={{ padding: '0.75rem 0.75rem', fontWeight: 800, color: '#000000', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                          ₹{minInr.toLocaleString('en-IN')} – ₹{maxInr.toLocaleString('en-IN')}
                        </td>

                        {/* Status (Desktop only) */}
                        <td className="col-hide-mobile" style={{ padding: '0.75rem 0.65rem' }}>
                          {prod.is_deleted ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <AlertOctagon size={12} /> Deleted
                            </span>
                          ) : prod.is_active ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <CheckCircle2 size={12} /> Active
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#f1f5f9',
                              color: '#64748b',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              textTransform: 'uppercase'
                            }}>
                              <XCircle size={12} /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Action: View, Edit and Delete */}
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center' }}>
                            <button
                              onClick={() => handleOpenView(prod)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                border: '1px solid #cbd5e1',
                                color: '#475569',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                              title="View sneaker details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: '#fff',
                                border: '1px solid #cbd5e1',
                                color: '#0284c7',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                              title="Edit sneaker"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(prod)}
                              style={{
                                width: '32px',
                                height: '32px',
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
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}

    {/* VIEW 2: FULL-PAGE ACCOUNT & SETTINGS TAB */}
    {activeTab === 'account' && (
      <div style={{ maxWidth: '640px', margin: '0 auto', animation: 'fadeIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
            Admin Account & Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Administrator profile, store overview metrics, and quick session actions.
          </p>
        </div>

        {/* Profile Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '1.5rem',
            boxShadow: '0 6px 16px rgba(249, 115, 22, 0.35)',
            flexShrink: 0
          }}>
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {user?.username || 'admin'}
              </h3>
              <span style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                Active
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Administrator • Master Staff Access
            </div>
          </div>
        </div>

        {/* Quick Inventory Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.85rem',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f97316' }}>
              {products.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.15rem' }}>
              Shoes
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.85rem',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
              {categories.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.15rem' }}>
              Categories
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.85rem',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
              {brands.length}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '0.15rem' }}>
              Brands
            </div>
          </div>
        </div>

        {/* Quick Navigation and Logout Actions */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid #f1f5f9',
              textDecoration: 'none',
              color: '#0f172a',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a'
            }}>
              <Store size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Customer Store View</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Switch to public sneaker storefront</div>
            </div>
            <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 800 }}>→</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.15rem 1.25rem',
              backgroundColor: '#ffffff',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <LogOut size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Log Out of Admin</div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>Securely end your administrative session</div>
            </div>
            <span style={{ fontSize: '0.88rem', color: '#dc2626', fontWeight: 800 }}>→</span>
          </button>
        </div>
      </div>
    )}

  </main>

  {/* View Product Details Modal */}
  <ViewProductModal
    isOpen={isViewModalOpen}
    onClose={() => {
      setIsViewModalOpen(false);
      setViewingProduct(null);
    }}
    product={viewingProduct}
    onEdit={handleOpenEdit}
  />

  {/* Add Product Modal */}
  <ProductModal
    isOpen={isProductModalOpen}
    onClose={() => setIsProductModalOpen(false)}
    onSave={handleSaveProduct}
    product={editingProduct}
    categories={categories}
    brands={brands}
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

  {/* Mobile Floating Action Button (+ Add Product, visible only on Products tab) */}
  {activeTab === 'products' && (
    <button
      className="admin-fab-add"
      onClick={handleOpenAdd}
      title="Add Product"
      style={{
        position: 'fixed',
        bottom: '5.2rem',
        right: '1.25rem',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#f97316',
        color: '#ffffff',
        border: 'none',
        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.45)',
        cursor: 'pointer',
        zIndex: 95,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Plus size={28} color="#ffffff" strokeWidth={2.5} />
    </button>
  )}

  {/* Mobile Bottom Tab Bar: Products & Account */}
  <nav 
    className="admin-bottom-nav" 
    style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '62px',
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
      zIndex: 90,
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 1rem'
    }}
  >
    {/* Products Tab */}
    <button
      onClick={() => setActiveTab('products')}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.2rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: activeTab === 'products' ? '#f97316' : '#64748b',
        fontWeight: activeTab === 'products' ? 800 : 600,
        fontSize: '0.75rem',
        padding: '0.45rem 0'
      }}
    >
      <Package size={22} color={activeTab === 'products' ? '#f97316' : '#64748b'} />
      <span>Products</span>
    </button>

    {/* Account Tab */}
    <button
      onClick={() => setActiveTab('account')}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.2rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: activeTab === 'account' ? '#f97316' : '#64748b',
        fontWeight: activeTab === 'account' ? 800 : 600,
        fontSize: '0.75rem',
        padding: '0.45rem 0'
      }}
    >
      <User size={22} color={activeTab === 'account' ? '#f97316' : '#64748b'} />
      <span>Account</span>
    </button>
  </nav>
</div>
);
}
