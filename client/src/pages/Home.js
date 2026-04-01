import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { productAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import ProductCard from '../components/shared/ProductCard';

// Unified ProductCard is used instead of local version

/* ─── Feature Block - Modern Luxury ─── */
const FeatureBlock = ({ number, title, description, delay }) => {
  return (
    <div className={`slide-up delay-${delay}`} style={{
      animationFillMode: 'forwards',
      padding: '0 24px',
      borderLeft: '1px solid var(--lx-border-light)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <span style={{
        fontFamily: '"Outfit", sans-serif',
        fontSize: '0.8rem',
        color: 'var(--lx-beige)',
        marginBottom: 24,
        letterSpacing: '0.1em'
      }}>
        {number}
      </span>
      <h3 style={{
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 500,
        fontSize: '1.25rem',
        color: 'var(--lx-text-primary)',
        margin: '0 0 16px',
        letterSpacing: '-0.01em'
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.9rem',
        color: 'var(--lx-text-secondary)',
        lineHeight: 1.7,
        margin: 0
      }}>
        {description}
      </p>
    </div>
  );
};

/* ─── Home Page ─── */
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackProducts = [
    {
      _id: '1',
      name: 'Levitas Cloud Sofa',
      price: 1299.99,
      comparePrice: 1599.99,
      images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format', alt: 'Cloud sofa' }],
      shortDescription: 'Uncompromising comfort wrapped in organic cashmere. A sculptural masterpiece for the modern living space.',
      sustainability: { ecoScore: 4.8 },
      isFeatured: true,
      rating: 4.9,
      reviewCount: 342,
    },
    {
      _id: '2',
      name: 'Obsidian Lounge Chair',
      price: 799.99,
      comparePrice: 999.99,
      images: [{ url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop&auto=format', alt: 'Luxury chair' }],
      shortDescription: 'Hand-carved black oak profile uniting mid-century principles with contemporary aerodynamics.',
      sustainability: { ecoScore: 4.2 },
      isFeatured: true,
      rating: 4.7,
      reviewCount: 128,
    },
    {
      _id: '3',
      name: 'Nebula Coffee Table',
      price: 449.99,
      images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format', alt: 'Glass table' }],
      shortDescription: 'Extruded brass legs supporting an expanse of highly polished smoked glass over an open structure.',
      sustainability: { ecoScore: 4.5 },
      isFeatured: false,
      rating: 4.8,
      reviewCount: 87,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        const list = data.products || (Array.isArray(data) ? data : []);
        if (list.length > 0) {
          const featured = list.filter((p) => p.isFeatured).slice(0, 3);
          setFeaturedProducts(featured.length > 0 ? featured : list.slice(0, 3));
        } else {
          setFeaturedProducts(fallbackProducts);
        }
      } catch {
        // Fallback silently
        setFeaturedProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // eslint-disable-line

  const handleBuyNow = async (productId) => {
    try {
      await cartAPI.add({ productId, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const features = [
    {
      number: '01',
      title: 'Heritage Craftsmanship',
      description: 'Objects created without compromise, fusing timeless woodworking techniques with modern engineering.',
      delay: 1,
    },
    {
      number: '02',
      title: 'Architectural Details',
      description: 'Every curve and joint is intentional, serving both an aesthetic and structural purpose, offering quiet sophistication.',
      delay: 2,
    },
    {
      number: '03',
      title: 'Sustainable Provenance',
      description: 'Traceable materials from sustainable forestry. Luxury redefined not by excess, but by responsibility.',
      delay: 3,
    },
    {
      number: '04',
      title: 'Curated Acquisition',
      description: 'A seamless, white-glove process spanning from digital selection to exact in-home curation and placement.',
      delay: 4,
    },
  ];

  return (
    <div style={{ background: 'var(--lx-black)', width: '100%', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════
          HERO SECTION (Editorial Layout)
      ══════════════════════════════════════════════ */}
      <section style={{ 
        padding: '60px 40px', 
        maxWidth: 1600, 
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr',
          gap: 64,
          alignItems: 'center',
          minHeight: '80vh',
        }}>
          {/* Left: Typography */}
          <div className="fade-in" style={{ paddingRight: 40 }}>
            <span style={{
              display: 'block',
              fontFamily: '"Outfit", sans-serif',
              fontSize: '0.85rem',
              color: 'var(--lx-beige)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 32
            }}>
              Curated Living
            </span>
            <h1 style={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 500,
              fontSize: 'clamp(3rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--lx-text-primary)',
              margin: '0 0 32px'
            }}>
              Quiet luxury<br />for the modern<br />sanctuary.
            </h1>
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '1.05rem',
              color: 'var(--lx-text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 48px',
              maxWidth: 420
            }}>
              Discover a collection defined by architectural lines, exceptional materials, and enduring refinement.
            </p>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
               <Link to="/products" className="btn-primary">
                 Explore Collection
               </Link>
               {!user && (
                 <Link to="/register" style={{
                   fontFamily: '"Outfit", sans-serif',
                   fontSize: '0.85rem',
                   color: 'var(--lx-text-primary)',
                   textTransform: 'uppercase',
                   letterSpacing: '0.05em',
                   textDecoration: 'none',
                   borderBottom: '1px solid var(--lx-text-tertiary)',
                   paddingBottom: 4,
                   transition: 'var(--lx-transition)'
                 }}
                 onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lx-beige)'; e.currentTarget.style.borderColor = 'var(--lx-beige)'; }}
                 onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lx-text-primary)'; e.currentTarget.style.borderColor = 'var(--lx-text-tertiary)'; }}
                 >
                   Join FlyingWood
                 </Link>
               )}
            </div>
          </div>

          {/* Right: Editorial Image */}
          <div className="slide-up delay-1" style={{ position: 'relative', height: '100%', minHeight: 600 }}>
             <div style={{ 
               position: 'absolute', 
               inset: 0, 
               background: 'var(--lx-charcoal)',
               borderRadius: 'var(--lx-radius)',
               overflow: 'hidden'
             }}>
               <img 
                 src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop" 
                 alt="Luxurious minimalist interior"
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   filter: 'brightness(0.85) contrast(1.1)',
                 }}
               />
             </div>
             {/* Small info block overlapping image */}
             <div style={{
               position: 'absolute',
               bottom: 40,
               left: -40,
               background: 'var(--lx-black)',
               border: '1px solid var(--lx-border)',
               padding: '32px 40px',
               borderRadius: 'var(--lx-radius)',
               boxShadow: 'var(--lx-shadow-lg)'
             }}>
                <span style={{
                  display: 'block',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  color: 'var(--lx-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8
                }}>Featured Collection</span>
                <span style={{
                   display: 'block',
                   fontFamily: '"Outfit", sans-serif',
                   fontSize: '1.25rem',
                   color: 'var(--lx-beige)',
                   fontWeight: 500
                }}>The Autumn Series</span>
             </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════ */}
      <section style={{ 
        padding: '120px 40px', 
        maxWidth: 1600, 
        margin: '0 auto' 
      }}>
        <div style={{
           display: 'grid',
           gridTemplateColumns: 'minmax(250px, 1fr) 2fr',
           gap: 80,
        }}>
           <div>
             <h2 className="fade-in" style={{
               fontSize: 'clamp(2rem, 3vw, 2.5rem)',
               fontFamily: '"Outfit", sans-serif',
               fontWeight: 500,
               color: 'var(--lx-text-primary)',
               letterSpacing: '-0.02em',
               lineHeight: 1.2,
               margin: '0 0 24px'
             }}>
               The pursuit of absolute quality.
             </h2>
             <p className="fade-in delay-1" style={{
               fontFamily: '"Inter", sans-serif',
               fontSize: '1rem',
               color: 'var(--lx-text-secondary)',
               lineHeight: 1.6,
               margin: 0
             }}>
               There is no substitute for exceptional materials honed by seasoned artisans. We are committed to a manufacturing ethos that prioritizes longevity over speed.
             </p>
           </div>

           <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
           }}>
             {features.map((f) => (
                <FeatureBlock key={f.number} {...f} />
             ))}
           </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURED PRODUCTS
      ══════════════════════════════════════════════ */}
      <section style={{ 
        padding: '120px 40px', 
        background: 'var(--lx-surface)',
        borderTop: '1px solid var(--lx-border-light)',
        borderBottom: '1px solid var(--lx-border-light)'
      }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: 64 
          }}>
            <div>
              <span style={{
                display: 'block',
                fontFamily: '"Outfit", sans-serif',
                fontSize: '0.85rem',
                color: 'var(--lx-beige)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 16
              }}>
                Curated Selection
              </span>
              <h2 style={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '2.5rem',
                letterSpacing: '-0.02em',
                color: 'var(--lx-text-primary)',
                margin: 0
              }}>
                Latest Acquisitions
              </h2>
            </div>
            <Link to="/products" className="btn-secondary">
               View Entire Catalog
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: 'var(--lx-text-tertiary)' }}>Loading gallery...</span>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 32,
            }}>
              {featuredProducts.map((product, i) => (
                <div key={product._id || product.id} className={`slide-up delay-${i + 1}`}>
                  <ProductCard 
                    product={product} 
                    onBuyNow={handleBuyNow}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONSULTANCY BANNER
      ══════════════════════════════════════════════ */}
      <section style={{ padding: '160px 40px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
         <span style={{
            display: 'block',
            fontFamily: '"Outfit", sans-serif',
            fontSize: '0.85rem',
            color: 'var(--lx-text-tertiary)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 24
          }}>
            Concierge Services
          </span>
          <h2 style={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            letterSpacing: '-0.02em',
            color: 'var(--lx-text-primary)',
            margin: '0 0 32px'
          }}>
            Dedicated <span className="text-beige">Space Architecture</span>
          </h2>
          <p style={{
             fontFamily: '"Inter", sans-serif',
             fontSize: '1.05rem',
             color: 'var(--lx-text-secondary)',
             lineHeight: 1.7,
             maxWidth: 600,
             margin: '0 auto 48px'
          }}>
             Unsure of spatial requirements or material synergies? Engage with our AI design consultant, Flynn, for sophisticated advice tailored precisely to your environment.
          </p>
          <button 
             className="btn-primary"
             onClick={() => {
                const event = new CustomEvent('openFlynn');
                window.dispatchEvent(event);
             }}
          >
             Initiate Consultation
          </button>
      </section>
    </div>
  );
};

export default Home;