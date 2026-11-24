import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles,
  Share2
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
  const [slideFade, setSlideFade] = useState(false);

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

  // Multi-angle slideshow perspectives for the current active shoe
  const galleryAngles = [
    mainImage,
    currentShoe.image2 || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    currentShoe.image3 || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    currentShoe.image4 || 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  ];

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
  const inrPrice = Math.round(parseFloat(currentShoe.price || 150) * 83);
  const brandName = (currentShoe.category_name || 'SNEAKERS').toUpperCase();

  // Smooth slide transition
  const triggerSlideTransition = (newIndex) => {
    setSlideFade(true);
    setTimeout(() => {
      setCurrentProductIndex(newIndex);
      setSelectedAngleIndex(0);
      const nextShoe = productsList[newIndex];
      if (nextShoe) {
        window.history.replaceState(null, '', `/product/${nextShoe.id || nextShoe._id}`);
      }
      setSlideFade(false);
    }, 180);
  };

  // Slide to next shoe (syncs image, name, price, color, sizes on the right side)
  const handleNextSlide = () => {
    if (productsList.length > 0) {
      const nextIndex = (currentProductIndex + 1) % productsList.length;
      triggerSlideTransition(nextIndex);
    }
  };

  // Slide to previous shoe
  const handlePrevSlide = () => {
    if (productsList.length > 0) {
      const prevIndex = (currentProductIndex - 1 + productsList.length) % productsList.length;
      triggerSlideTransition(prevIndex);
    }
  };

  // Auto-play slideshow timer (advances every 3 seconds)
  useEffect(() => {
    if (!isAutoPlay || isHovered || productsList.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentProductIndex + 1) % productsList.length;
      triggerSlideTransition(nextIndex);
    }, 3000); // 3 seconds wait

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, currentProductIndex, productsList.length]);

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

  // WhatsApp Order / Message Generator
  const handleSendMessageWhatsApp = () => {
    const textMessage = 
`Hello Xtreme Superkicks! 👟
I want to order this sneaker:

*Model:* ${currentShoe.name}
*Color:* ${currentShoe.color || 'Standard'}
*Size:* UK ${selectedSize}
*Price:* ₹${inrPrice.toLocaleString('en-IN')}

Please share payment & delivery details!`;

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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'var(--font-main)' }}>
      {/* Top Navbar */}
      <Navbar cartCount={cartCount} />

      {/* Main Slideshow & Details Layout (Wide container with large image section) */}
      <main style={{
        maxWidth: '1680px',
        margin: '1.75rem auto 5rem',
        padding: '0 3rem',
        display: 'grid',
        gridTemplateColumns: '96px 1fr 460px',
        gap: '3rem',
        alignItems: 'start'
      }}>
        
        {/* Left Thumbnails Strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {galleryAngles.map((img, idx) => (
            <div
              key={idx}
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

        {/* Center: Large Image Slideshow Container with Auto-Play & Controls */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: '#ffffff',
            minHeight: '680px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '2.5rem 1.5rem',
            borderRadius: '16px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          {/* Previous Slide Arrow */}
          <button
            onClick={handlePrevSlide}
            style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#000000'; 
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = '#ffffff'; 
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Previous Shoe"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Large Main Displayed Sneaker Image */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflow: 'hidden'
          }}>
            <img
              src={galleryAngles[selectedAngleIndex] || mainImage}
              alt={currentShoe.name}
              style={{
                width: '100%',
                maxHeight: '620px',
                objectFit: 'contain',
                opacity: slideFade ? 0.25 : 1,
                transform: slideFade ? 'scale(0.95)' : isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.12))'
              }}
            />
          </div>

          {/* Next Slide Arrow */}
          <button
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              right: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#000000'; 
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = '#ffffff'; 
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Next Shoe"
          >
            <ChevronRight size={24} />
          </button>

          {/* Interactive Navigation Dots directly on the Image */}
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            zIndex: 15
          }}>
            {productsList.map((p, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerSlideTransition(idx);
                }}
                style={{
                  width: currentProductIndex === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: currentProductIndex === idx ? '#000000' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0
                }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Right Details Panel: Synchronized with Slideshow (NO Love Icon) */}
        <div>
          {/* Brand Name */}
          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            {brandName}
          </div>

          {/* Sneaker Title (Updates with slideshow) */}
          <h1 style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '1.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: '0 0 0.35rem',
            lineHeight: 1.25,
            color: '#000000'
          }}>
            {currentShoe.name}
          </h1>

          {/* Colorway (Updates with slideshow) */}
          <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1.25rem' }}>
            {currentShoe.color || 'Standard Edition'}
          </div>

          {/* Price (Updates with slideshow) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#000000' }}>
              ₹{inrPrice.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
              MRP (inclusive of all taxes)
            </div>
          </div>

          {/* Size Info Header (No Size Chart button) */}
          <div style={{ marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SHOE SIZE (UK)
            </span>
          </div>

          {/* Size Grid [7] [8] [9] [10] [11] */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                style={{
                  height: '44px',
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

          {/* Action Button: ADD (Click directly opens WhatsApp with pre-filled sneaker details) */}
          <button
            onClick={handleSendMessageWhatsApp}
            style={{
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              padding: '1.15rem',
              fontWeight: 900,
              fontSize: '0.95rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
              transition: 'background-color 0.2s, transform 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#222222'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            ADD
          </button>

          {/* Section-Wise Product Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.25rem' }}>
            {/* Section 1: About Product */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.65rem'
              }}>
                About Product
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0 }}>
                {currentShoe.description || 'Iconic collector silhouette engineered with genuine leather and court-ready Nike Air cushioning.'}
              </p>
            </div>

            {/* Section 2: Product Details */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.65rem'
              }}>
                Product Details
              </h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                <li>Genuine premium leather upper with padded collar for ankle support</li>
                <li>Point-loaded responsive cushioning unit engineered for maximum energy return</li>
                <li>Durable solid traction rubber outsole for superior court and street grip</li>
                <li>Original brand signature branding and authentic serial tag</li>
              </ul>
            </div>

            {/* Section 3: Brand Info */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
              <h3 style={{
                fontSize: '0.82rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#000000',
                marginBottom: '0.65rem'
              }}>
                Brand Info
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: '#475569', margin: 0 }}>
                Crafted for athletes and sneakerheads worldwide, bringing together high-performance engineering and iconic streetwear silhouettes. Every pair is 100% verified authentic by Xtreme Superkicks specialists.
              </p>
            </div>
          </div>

        </div>

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
