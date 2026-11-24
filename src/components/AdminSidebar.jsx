import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  Store, 
  LogOut, 
  Footprints
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({ stats }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 1.25rem',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div>
        {/* Logo and Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}>
            <Footprints size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
              XTREME<span style={{ color: 'var(--primary)' }}>ADMIN</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Management Console
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '0 0.5rem 0.65rem' }}>
            Catalog Management
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '0.5rem',
                color: location.pathname === '/admin' ? '#0f172a' : '#64748b',
                backgroundColor: location.pathname === '/admin' ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                borderLeft: location.pathname === '/admin' ? '3px solid var(--primary)' : '3px solid transparent',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Package size={18} color={location.pathname === '/admin' ? 'var(--primary)' : 'currentColor'} />
              <span>Product Listings</span>
              {stats?.total_products !== undefined && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.55rem',
                  borderRadius: '1rem',
                  background: '#f1f5f9',
                  color: '#334155'
                }}>
                  {stats.total_products}
                </span>
              )}
            </Link>

            <a
              href="#categories"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '0.5rem',
                color: '#64748b',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Layers size={18} />
              <span>Categories</span>
              {stats?.total_categories !== undefined && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.55rem',
                  borderRadius: '1rem',
                  background: '#f1f5f9',
                  color: '#334155'
                }}>
                  {stats.total_categories}
                </span>
              )}
            </a>
          </nav>
        </div>
      </div>

      {/* Footer / Profile & Store View */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: 'var(--primary)'
          }}>
            {user?.username ? user.username[0].toUpperCase() : 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
              {user?.username || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Admin Staff</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            to="/"
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem', backgroundColor: '#f8fafc', color: '#0f172a', borderColor: '#e2e8f0' }}
            title="Go to customer view"
          >
            <Store size={14} />
            Store View
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
