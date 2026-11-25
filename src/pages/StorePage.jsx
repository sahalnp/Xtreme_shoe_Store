import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Flame, Footprints, Plus, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchProducts, fetchCategories } from '../api/client';

// Product card with automatic multi-angle slideshow on hover
function CatalogProductCard({ shoe, onCardClick }) {
  const shoeImages = [
    shoe.image_url || shoe.image,
    shoe.image2_url || shoe.image2,
    shoe.image3_url || shoe.image3,
    shoe.image4_url || shoe.image4,
  ].filter(Boolean);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isHovered && shoeImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % shoeImages.length);
      }, 2000); // changes image every 2 seconds on hover
    } else {
      clearInterval(intervalRef.current);
      setCurrentImgIndex(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered, shoeImages.length]);

  const activeImage = shoeImages[currentImgIndex] || shoe.image_url || shoe.image;

  return (
    <div
      onClick={() => onCardClick(shoe)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="catalog-card"
    >
      {/* Card Image Area with Edge-to-Edge Sneaker Photos & Clean Horizontal Slide */}
      <div 
        className="catalog-card-img-box" 
        style={{ 
          overflow: 'hidden', 
          position: 'relative',
          borderRadius: '1rem',
          backgroundColor: '#f8fafc'
        }}
      >
        {shoeImages.length > 0 ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {shoeImages.map((imgSrc, idx) => {
              const isActive = idx === currentImgIndex;
              const isPast = idx < currentImgIndex;
              const translateX = isActive ? '0%' : isPast ? '-100%' : '100%';

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    transform: `translateX(${translateX})`,
                    opacity: isActive ? 1 : 0,
                    pointerEvents: 'none',
                    transition: isHovered 
                      ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease' 
                      : 'none',
                    willChange: 'transform, opacity',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`${shoe.name} - View ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                    }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Footprints size={48} color="#cbd5e1" />
        )}
      </div>

      {/* Card Details */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="catalog-card-sub">
          {shoe.color || 'Standard Edition'}
        </div>

        <h3 className="catalog-card-title">
          {shoe.name}
        </h3>

        <div className="catalog-card-size">
          Available in: <strong style={{ color: '#0f172a' }}>{shoe.size || 'UK 7-11'}</strong>
        </div>

        {/* Brand Badge */}
        <div className="catalog-card-brand-box" style={{
          marginTop: 'auto',
          paddingTop: '0.65rem',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div className="catalog-card-brand-lbl" style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Brand</div>
            <div className="catalog-card-brand-val" style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '0.92rem',
              fontWeight: 900,
              color: '#f97316',
              textTransform: 'uppercase'
            }}>
              {shoe.brand_name || shoe.brand?.name || 'Nike'}
            </div>
          </div>
          <span className="catalog-card-explore-btn" style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#475569',
            backgroundColor: '#f1f5f9',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px'
          }}>
            Explore →
          </span>
        </div>

      </div>
    </div>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState({});
  const [featuredHeroShoe, setFeaturedHeroShoe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStore = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          fetchProducts({ admin: false, category: selectedCategory, search: searchTerm }),
          fetchCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
        if (prods && prods.length > 0) {
          const randomIndex = Math.floor(Math.random() * prods.length);
          setFeaturedHeroShoe(prods[randomIndex]);
        }
      } catch (err) {
        console.error('Failed to load store products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStore();
  }, [selectedCategory, searchTerm]);

  const handleCardClick = (product) => {
    const prodId = product.id || product._id;
    navigate(`/product/${prodId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const prodId = product.id || product._id;
    setCartCount((prev) => prev + 1);
    setAddedItems((prev) => ({ ...prev, [prodId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [prodId]: false }));
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      {/* Top Navigation (No Submenu, Search on Right, No Heart Icon) */}
      <Navbar 
        cartCount={cartCount} 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
      />

      {/* Dribbble Style Modern Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        padding: '3.5rem 2.5rem 4.5rem',
        backgroundColor: '#fafbfc',
        borderBottom: '1px solid #edf2f7',
        overflow: 'hidden'
      }}>
        <div className="hero-grid" style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div className="hero-left-col">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0f172a',
              marginBottom: '1.5rem'
            }}>
              <Flame size={16} color="var(--primary)" />
              <span>TRENDING DROP 2026 // SOLESTRIDE EDITION</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(2.6rem, 5.2vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              color: '#000000'
            }}>
              Step Into <br />
              <span style={{ color: 'var(--primary)' }}>Extraordinary</span> Style
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#64748b',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginBottom: '2.25rem'
            }}>
              Engineered with point-loaded rebound cushioning and ultra-breathable upper knit. Discover footwear designed to elevate every single stride.
            </p>

            {/* Hero CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="#catalog"
                className="btn btn-primary"
                style={{
                  borderRadius: '9999px',
                  padding: '0.9rem 2.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                Explore Drops <ArrowRight size={16} />
              </a>

              {featuredHeroShoe && (
                <button
                  onClick={() => handleCardClick(featuredHeroShoe)}
                  className="btn btn-secondary"
                  style={{
                    borderRadius: '9999px',
                    padding: '0.9rem 1.85rem',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                >
                  View Featured Drop
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div className="hero-stats-row" style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.85rem', fontWeight: 900, color: '#000000' }}>50K+</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Pairs Delivered</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.85rem', fontWeight: 900, color: '#000000' }}>200+</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Limited Editions</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.85rem', fontWeight: 900, color: '#000000' }}>4.9★</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Verified Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual (Responsive shoe image and badges) */}
          <div className="hero-visual" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}>
            <div style={{
              position: 'absolute',
              width: '460px',
              height: '460px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0
            }} />

            <img
              className="hero-visual-img"
              src={featuredHeroShoe?.image_url || featuredHeroShoe?.image || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85"}
              alt={featuredHeroShoe?.name || "Air Jordan 1"}
              style={{
                width: '100%',
                maxWidth: '560px',
                height: '360px',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
                transform: 'rotate(-12deg) scale(1.05)',
                filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.18))',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'rotate(-8deg) scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'rotate(-12deg) scale(1.05)'}
              onClick={() => featuredHeroShoe && handleCardClick(featuredHeroShoe)}
            />

            <div className="hero-stat-pill-top" style={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              background: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1px solid #f1f5f9',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#000000' }}>4.9 / 5.0</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Over 2.4k Reviews</div>
              </div>
            </div>

            <div 
              className="hero-stat-pill-bottom"
              style={{
                position: 'absolute',
                bottom: '12%',
                left: '5%',
                background: '#000000',
                color: '#ffffff',
                padding: '0.85rem 1.35rem',
                borderRadius: '1rem',
                boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                zIndex: 2,
                cursor: 'pointer'
              }}
              onClick={() => featuredHeroShoe && handleCardClick(featuredHeroShoe)}
            >
              <div style={{ fontSize: '0.68rem', color: '#f97316', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>Brand</div>
              <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>
                {featuredHeroShoe?.brand_name || featuredHeroShoe?.brand?.name || 'VANS'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main id="catalog" className="catalog-section" style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '3.5rem 2.5rem 5rem' }}>
        
        {/* Header and Category Pills */}
        <div className="catalog-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              // OUR CURATED CATALOG
            </span>
            <h2 className="catalog-header-title" style={{ fontFamily: 'var(--font-brand)', fontSize: '2.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '0.25rem', color: '#000000' }}>
              Explore Popular Footwear
            </h2>
          </div>

          <div className="category-pill-row">
            <button
              className={`category-pill ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All Shoes ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id || cat._id}
                className={`category-pill ${selectedCategory === (cat.id || cat._id).toString() ? 'active' : ''}`}
                onClick={() => setSelectedCategory((cat.id || cat._id).toString())}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards: Small 2-column on mobile, expansive grid on laptop */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748b' }}>
            Loading shoe collection...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', background: '#f8fafc', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
            <Footprints size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No shoes found</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Try clearing filters or search queries.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {products.map((shoe) => (
              <CatalogProductCard
                key={shoe.id || shoe._id}
                shoe={shoe}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}

      </main>

      {/* Clean Modern Footer */}
      <footer className="store-footer" style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '4rem 2.5rem 2.5rem',
        color: '#000000',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '3rem', marginBottom: '3.5rem' }}>
            
            {/* Brand Intro */}
            <div>
              <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '0.05em' }}>
                XTREME <span style={{ color: 'var(--primary)' }}>SUPERKICKS</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '340px' }}>
                Superkicks is India's premium sneaker and contemporary streetwear destination, stocking limited-edition footwear from globally revered brands.
              </p>
            </div>

            {/* Featured Brands */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                Featured Brands
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#475569' }}>
                <li>Nike & Jordan</li>
                <li>Adidas Originals</li>
                <li>New Balance</li>
                <li>Asics SportStyle</li>
                <li>Salomon Advanced</li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                Customer Care
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#475569' }}>
                <li>Track Order</li>
                <li>Authenticity Guarantee</li>
                <li>Shipping & Delivery</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            {/* Never Miss a Drop */}
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                Never Miss a Drop
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Subscribe for early access to limited raffle releases and shock drops.
              </p>
              <div className="footer-newsletter-wrap" style={{ display: 'flex', width: '100%' }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.65rem 0.85rem',
                    color: '#000000',
                    fontSize: '0.85rem',
                    flex: 1,
                    minWidth: 0,
                    outline: 'none'
                  }}
                />
                <button style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}>
                  Join
                </button>
              </div>
            </div>

          </div>

          <div className="footer-bottom" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
            <div>© 2026 XTREME SUPERKICKS. All rights reserved.</div>
            <div>Official Sneaker and Streetwear Portal.</div>
          </div>

        </div>
      </footer>
    </div>
  );
}
