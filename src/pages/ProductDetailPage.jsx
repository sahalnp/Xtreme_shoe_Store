import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles,
  Share2,
  MessageCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchProducts } from '../api/client';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productsList, setProductsList] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('10');
  const [selectedAngleIndex, setSelectedAngleIndex] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  // Slideshow States
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (data && data.length > 0) {
          setProductsList(data);
          const initialIndex = data.findIndex((p) => p.id === id || p._id === id);
          if (initialIndex !== -1) {
            setCurrentProductIndex(initialIndex);
          } else {
            setCurrentProductIndex(0);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllProducts();
  }, [id]);

  const currentShoe = productsList[currentProductIndex] || {
    name: 'Air Jordan Retro 1 High',
    category_name: 'BASKETBALL',
    color: 'Chicago Red / White / Black',
    price: 199.99,
    description: 'Iconic collector silhouette engineered with genuine leather and court-ready Nike Air cushioning.',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85',
  };

  const mainImage = currentShoe.image_url || currentShoe.image || 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=85';

  // Multi-angle perspectives of ONLY the current active shoe (filters out empty/null values)
  const shoeImages = [
    currentShoe.image_url || currentShoe.image,
    currentShoe.image2_url || currentShoe.image2,
    currentShoe.image3_url || currentShoe.image3,
    currentShoe.image4_url || currentShoe.image4,
  ].filter(Boolean);

  const galleryAngles = shoeImages.length > 0 ? shoeImages : [mainImage];

  // Parse size from string (e.g. "UK 7, UK 8, UK 9, UK 10, UK 11", "7, 8, 9, 10", "UK 7-11") into array
  const parseSizes = (rawSize) => {
    if (!rawSize) return ['7', '8', '9', '10', '11'];
    if (Array.isArray(rawSize)) return rawSize.map(s => s.toString().replace(/^UK\s*/i, '').trim());
    if (typeof rawSize === 'string') {
      if (rawSize.includes(',')) {
        return rawSize.split(',').map(s => s.replace(/^UK\s*/i, '').trim()).filter(Boolean);
      }
      const rangeMatch = rawSize.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = parseInt(rangeMatch[2], 10);
        const list = [];
        for (let i = start; i <= end; i++) list.push(i.toString());
        return list;
      }
      const tokens = rawSize.replace(/UK/gi, '').trim().split(/\s+/).filter(Boolean);
      if (tokens.length > 0) return tokens;
    }
    return ['7', '8', '9', '10', '11'];
  };

  const sizes = parseSizes(currentShoe.size);
  const baseInr = Math.round(parseFloat(currentShoe.price || 150) * 83);
  const minInr = currentShoe.min_price 
    ? Math.round(parseFloat(currentShoe.min_price) * 83)
    : Math.round(baseInr * 0.9);
  const maxInr = currentShoe.max_price 
    ? Math.round(parseFloat(currentShoe.max_price) * 83)
    : Math.round(baseInr * 1.2);
  const brandName = (currentShoe.brand_name || currentShoe.category_name || 'SNEAKERS').toUpperCase();

  // Reset angle index when switching shoe
  useEffect(() => {
    setSelectedAngleIndex(0);
  }, [currentProductIndex]);

  // Slide to next angle/image of the current shoe
  const handleNextSlide = () => {
    if (galleryAngles.length > 1) {
      setSelectedAngleIndex((prev) => (prev + 1) % galleryAngles.length);
    }
  };

  // Slide to previous angle/image of the current shoe
  const handlePrevSlide = () => {
    if (galleryAngles.length > 1) {
      setSelectedAngleIndex((prev) => (prev - 1 + galleryAngles.length) % galleryAngles.length);
    }
  };

  // Auto-play slideshow timer (advances current shoe's angle every 2 seconds smoothly)
  useEffect(() => {
    if (!isAutoPlay || galleryAngles.length <= 1) return;

    const timer = setInterval(() => {
      setSelectedAngleIndex((prev) => (prev + 1) % galleryAngles.length);
    }, 2000); // 2 seconds auto-advance

    return () => clearInterval(timer);
  }, [isAutoPlay, selectedAngleIndex, galleryAngles.length]);

  // Sync selected size if out of range
  useEffect(() => {
    if (sizes.length > 0 && !sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0]);
    }
  }, [currentProductIndex, currentShoe.size]);

  // Keyboard navigation (Left / Right Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNextSlide();
      if (e.key === 'ArrowLeft') handlePrevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProductIndex, productsList.length]);

  // WhatsApp Seller Price & Product Inquiry Generator
  const handleSendMessageWhatsApp = () => {
    const textMessage = 
`Hello Xtreme Superkicks! 👟
I am inquiring about this sneaker:

*Model:* ${currentShoe.name}
*Brand:* ${currentShoe.brand_name || currentShoe.category_name || 'Xtreme Superkicks'}
*Colorway:* ${currentShoe.color || 'Standard'}
*Size Selected:* UK ${selectedSize}
*Estimated Price Range:* ₹${minInr.toLocaleString('en-IN')} – ₹${maxInr.toLocaleString('en-IN')}

Could you please share the exact price, available stock, and purchase details for this pair? Thank you!`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000' }}>
        <Navbar cartCount={cartCount} />
        <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748b' }}>
          Loading sneaker details...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'var(--font-main)', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} />

      {/* Main Slideshow & Details Layout (Generous top/bottom margin and gap between image and text) */}
      <main className="pdp-main" style={{
        maxWidth: '1680px',
        margin: '3.75rem auto 7rem',
        padding: '0 3.5rem',
        display: 'grid',
        gridTemplateColumns: '96px 1fr 460px',
        gap: '4.75rem',
        alignItems: 'start'
      }}>
        
        {/* Left Thumbnails Strip */}
        <div className="pdp-thumbs" style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {galleryAngles.map((img, idx) => (
            <div
              key={idx}
              className="pdp-thumb-item"
              onClick={() => setSelectedAngleIndex(idx)}
              style={{
                width: '84px',
                height: '84px',
                border: selectedAngleIndex === idx ? '2.5px solid #000000' : '1px solid #e2e8f0',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: selectedAngleIndex === idx ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedAngleIndex !== idx) e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                if (selectedAngleIndex !== idx) e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <img
                src={img}
                alt="thumb"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>

        {/* Center: Large Image Slideshow Container (Full Size, Zero Gap) */}
        <div 
          className="pdp-image-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: '#ffffff',
            minHeight: '620px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 0,
            borderRadius: '20px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          {/* Previous Slide Arrow */}
          {galleryAngles.length > 1 && (
            <button
              onClick={handlePrevSlide}
              style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = '#000000'; 
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)'; 
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
              title="Previous Angle"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Large Main Displayed Sneaker Image: Smooth Horizontal Tracking Slideshow */}
          <div className="pdp-image-box" style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '620px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            overflow: 'hidden',
            borderRadius: '20px',
            backgroundColor: '#ffffff'
          }}>
            {galleryAngles.map((imgSrc, idx) => {
              const isActive = idx === selectedAngleIndex;
              const isPast = idx < selectedAngleIndex;
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
                    pointerEvents: isActive ? 'auto' : 'none',
                    transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease',
                    willChange: 'transform, opacity',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <img
                    className="pdp-image"
                    src={imgSrc}
                    alt={`${currentShoe.name} view ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: '620px',
                      objectFit: 'contain',
                      display: 'block',
                      transition: 'transform 0.4s ease',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Next Slide Arrow */}
          {galleryAngles.length > 1 && (
            <button
              onClick={handleNextSlide}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = '#000000'; 
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)'; 
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
              title="Next Angle"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Right Details Panel: Synchronized with Slideshow with Clear Spacing */}
        <div className="pdp-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Brand Name */}
          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {brandName}
          </div>

          {/* Sneaker Title (Updates with slideshow) */}
          <h1 style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '1.65rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 0.45rem',
            lineHeight: 1.25,
            color: '#000000'
          }}>
            {currentShoe.name}
          </h1>

          {/* Colorway (Updates with slideshow) */}
          <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.5rem' }}>
            {currentShoe.color || 'Standard Edition'}
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              Price Range
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#000000' }}>
              ₹{minInr.toLocaleString('en-IN')} – ₹{maxInr.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
              MRP Estimated Range (inclusive of all taxes)
            </div>
          </div>

          {/* Size Info Header (No Size Chart button) */}
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SHOE SIZE (UK)
            </span>
          </div>

          {/* Size Grid [7] [8] [9] [10] [11] */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.55rem', marginBottom: '1.75rem' }}>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                style={{
                  height: '46px',
                  background: selectedSize === s ? '#000000' : '#ffffff',
                  color: selectedSize === s ? '#ffffff' : '#000000',
                  border: '1px solid #000000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Action Button: Inquire Price & Details with Seller on WhatsApp */}
          <button
            onClick={handleSendMessageWhatsApp}
            style={{
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              padding: '1.15rem',
              fontWeight: 900,
              fontSize: '0.92rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'background-color 0.2s, transform 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <MessageCircle size={19} color="#22c55e" />
            ASK SELLER FOR PRICE & DETAILS
          </button>

          {/* Section-Wise Product Information (with generous gaps) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginTop: '0.75rem' }}>
            {/* Section 1: About Product */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.75rem'
              }}>
                About Product
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: '#475569', margin: 0 }}>
                {currentShoe.description || 'Iconic collector silhouette engineered with genuine leather and court-ready Nike Air cushioning.'}
              </p>
            </div>

            {/* Section 2: Product Details */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.75rem'
              }}>
                Product Details
              </h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                <li>Genuine premium leather upper with padded collar for ankle support</li>
                <li>Point-loaded responsive cushioning unit engineered for maximum energy return</li>
                <li>Durable solid traction rubber outsole for superior court and street grip</li>
                <li>Original brand signature branding and authentic serial tag</li>
              </ul>
            </div>

            {/* Section 3: Brand Info */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.75rem'
              }}>
                Brand Info
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: '#475569', margin: 0 }}>
                Crafted for athletes and sneakerheads worldwide, bringing together high-performance engineering and iconic streetwear silhouettes. Every pair is 100% verified authentic by Xtreme Superkicks specialists.
              </p>
            </div>
          </div>

        </div>

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
