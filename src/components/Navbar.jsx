import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function Navbar({ cartCount = 0, onSearch, searchTerm }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#000000',
      color: '#ffffff',
      borderBottom: '1px solid #1f242d',
      width: '100%'
    }}>
      <div className="navbar-inner">
        
        {/* Left Side: Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center' }}>
          <span className="brand-text">
            XTREME <span style={{ color: 'var(--primary)' }}>SUPERKICKS</span>
          </span>
        </Link>

        {/* Right Side: Search Icon (Toggles Search Input) Only */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Search on Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {isSearchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', background: '#141822', border: '1px solid #334155', borderRadius: '9999px', padding: '0.35rem 0.75rem', animation: 'fadeIn 0.2s ease' }}>
                <Search size={15} color="#94a3b8" style={{ marginRight: '0.5rem' }} />
                <input
                  type="text"
                  placeholder="Search kicks..."
                  value={searchTerm || ''}
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                  autoFocus
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '180px'
                  }}
                />
                <button
                  onClick={() => { setIsSearchOpen(false); onSearch && onSearch(''); }}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s'
                }}
                title="Search"
              >
                <Search size={21} />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
