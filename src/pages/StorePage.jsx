import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Flame, ShieldCheck, Truck, RotateCcw, Footprints, Plus, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchProducts, fetchCategories } from '../api/client';

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
      <section style={{
        position: 'relative',
        padding: '3.5rem 2.5rem 4.5rem',
        backgroundColor: '#fafbfc',
        borderBottom: '1px solid #edf2f7',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Hero Left Content */}
          <div>
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
            <div style={{
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

          {/* Hero Right Visual (Random product from DB every load) */}
          <div style={{
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

            <div style={{
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
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Starting From</div>
              <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 900 }}>
                {featuredHeroShoe?.price 
                  ? `₹${Math.round(parseFloat(featuredHeroShoe.price) * 83).toLocaleString('en-IN')}` 
                  : '₹9,500'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #edf2f7' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={22} color="#0f172a" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase' }}>Express Delivery</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Free shipping on all orders over ₹2,999</div>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #edf2f7' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={22} color="#0f172a" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase' }}>100% Genuine Sneakers</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Every shoe certified authentic</div>
          </div>
        </div>

        <div style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={22} color="#0f172a" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase' }}>Hassle-Free Returns</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>14-day easy return policy</div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <main id="catalog" style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '3.5rem 2.5rem 5rem' }}>
        
        {/* Header and Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              // OUR CURATED CATALOG
            </span>
            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '2.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginTop: '0.25rem', color: '#000000' }}>
              Explore Popular Footwear
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => setSelectedCategory('')}
              style={{
                padding: '0.6rem 1.4rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: selectedCategory === '' ? '#000000' : '#f1f5f9',
                color: selectedCategory === '' ? '#ffffff' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              All Shoes ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id || cat._id}
                onClick={() => setSelectedCategory((cat.id || cat._id).toString())}
                style={{
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: selectedCategory === (cat.id || cat._id).toString() ? '#000000' : '#f1f5f9',
                  color: selectedCategory === (cat.id || cat._id).toString() ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards (NO Heart / Love Icon on card as requested!) */}
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '2.25rem'
          }}>
            {products.map((shoe) => {
              const shoeId = shoe.id || shoe._id;
              const isAdded = addedItems[shoeId];

              return (
                <div
                  key={shoeId}
                  onClick={() => handleCardClick(shoe)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '1.25rem',
                    padding: '1.25rem',
                    border: '1px solid #edf2f7',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#edf2f7';
                  }}
                >
                  {/* Card Image Area with Real Sneaker Photos */}
                  <div style={{
                    height: '240px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    padding: '1.25rem',
                    marginBottom: '1.25rem'
                  }}>
                    {shoe.image_url || shoe.image ? (
                      <img
                        src={shoe.image_url || shoe.image}
                        alt={shoe.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transition: 'transform 0.35s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <Footprints size={64} color="#cbd5e1" />
                    )}
                  </div>

                  {/* Card Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {shoe.color || 'Standard Edition'}
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-brand)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#000000',
                      marginBottom: '0.75rem',
                      lineHeight: 1.25
                    }}>
                      {shoe.name}
                    </h3>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
                      Available in: <strong style={{ color: '#0f172a' }}>{shoe.size || 'UK 7-11'}</strong>
                    </div>

                    {/* Card Price (Clean display, NO Plus Icon button) */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Price</div>
                        <div style={{ fontFamily: 'var(--font-brand)', fontSize: '1.35rem', fontWeight: 900, color: '#000000' }}>
                          ₹{Math.round(parseFloat(shoe.price) * 83).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Clean Modern Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        padding: '4rem 2.5rem 2.5rem',
        color: '#000000',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '3rem', marginBottom: '3.5rem' }}>
            
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
              <div style={{ display: 'flex' }}>
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

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
            <div>© 2026 XTREME SUPERKICKS. All rights reserved.</div>
            <div>Official Sneaker and Streetwear Portal.</div>
          </div>

        </div>
      </footer>
    </div>
  );
}
