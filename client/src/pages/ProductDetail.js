import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Typography, Box, CardMedia, Button,
  CircularProgress, Tabs, Tab, IconButton, Breadcrumbs
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder, LocalShipping, Spa, Security, Replay, Star, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { productAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const toggleFavorite = () => setIsFavorite((prev) => !prev);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await productAPI.getById(id);
        setProduct(data);
      } catch (err) {
        setProduct(getFallbackProduct());
      } finally {
        setLoading(false);
        setImageLoading(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getFallbackProduct = () => ({
    _id: id,
    name: "Levitas Cloud Sofa",
    price: 1299.99,
    comparePrice: 1599.99,
    category: "Sofas",
    images: [
      { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop", alt: "Sofa 1" },
      { url: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=600&fit=crop", alt: "Sofa 2" }
    ],
    description: "Experience unparalleled comfort with our Levitas Cloud Sofa. Crafted from sustainable materials and designed for both architectural style and environmental consciousness.",
    shortDescription: "Uncompromising comfort wrapped in organic cashmere. A sculptural masterpiece.",
    sustainability: { ecoScore: 4.8 },
    stock: 5,
    features: ["100% Organic Materials", "Stain Resistant", "10-Year Warranty"],
    tags: ["Eco-Friendly", "Premium"],
    ratings: { average: 4.8, count: 124 },
    deliveryTime: "2-4 weeks",
  });

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setAddingToCart(true);
      await cartAPI.add({ productId: product._id, quantity: 1 });
      alert('Product added to cart component!');
    } catch (err) {
      setError('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const nextImage = () => setSelectedImage(p => p === product.images.length - 1 ? 0 : p + 1);
  const prevImage = () => setSelectedImage(p => p === 0 ? product.images.length - 1 : p - 1);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--lx-black)' }}>
        <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
      </Box>
    );
  }

  if (error && !product) return null;

  return (
    <Box sx={{ background: 'var(--lx-black)', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        <Breadcrumbs sx={{ mb: 6, color: 'var(--lx-text-secondary)', fontFamily: '"Outfit", sans-serif' }}>
          <Box component="span" onClick={() => navigate('/')} sx={{ cursor: 'pointer', '&:hover': { color: 'var(--lx-beige)' } }}>Home</Box>
          <Box component="span" onClick={() => navigate('/products')} sx={{ cursor: 'pointer', '&:hover': { color: 'var(--lx-beige)' } }}>Products</Box>
          <Typography color="var(--lx-text-primary)">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={8}>
          <Grid item xs={12} lg={6}>
            <Box sx={{ position: 'relative', borderRadius: 'var(--lx-radius-lg)', overflow: 'hidden', border: '1px solid var(--lx-border)' }}>
              {imageLoading && <Box sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--lx-charcoal)' }}><CircularProgress sx={{ color: 'var(--lx-beige)' }}/></Box>}
              <CardMedia
                component="img"
                height="600"
                image={product.images?.[selectedImage]?.url || '/api/placeholder/800/600'}
                alt={product.name}
                sx={{ objectFit: 'cover', display: imageLoading ? 'none' : 'block' }}
                onLoad={() => setImageLoading(false)}
              />
              {product.images && product.images.length > 1 && (
                <>
                  <IconButton onClick={prevImage} sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'var(--lx-surface-elevated)', color: 'var(--lx-text-primary)', '&:hover': { bgcolor: 'var(--lx-surface)' } }}><ChevronLeft /></IconButton>
                  <IconButton onClick={nextImage} sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'var(--lx-surface-elevated)', color: 'var(--lx-text-primary)', '&:hover': { bgcolor: 'var(--lx-surface)' } }}><ChevronRight /></IconButton>
                </>
              )}
            </Box>
            
            {product.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 3, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
                {product.images.map((img, i) => (
                  <Box key={i} onClick={() => setSelectedImage(i)} sx={{ width: 100, height: 100, cursor: 'pointer', borderRadius: 'var(--lx-radius)', overflow: 'hidden', border: selectedImage === i ? '2px solid var(--lx-beige)' : '2px solid transparent', opacity: selectedImage === i ? 1 : 0.6, transition: 'var(--lx-transition)', '&:hover': { opacity: 1 } }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box sx={{ position: 'sticky', top: 120 }}>
              <Typography variant="caption" sx={{ color: 'var(--lx-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 2, display: 'block' }}>
                {product.category || 'Furniture'}
              </Typography>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 500, color: 'var(--lx-text-primary)', letterSpacing: '-0.02em', mb: 3 }}>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'var(--lx-text-primary)', fontWeight: 400 }}>{formatPrice(product.price)}</Typography>
                {product.comparePrice && product.comparePrice > product.price && (
                  <Typography variant="h6" sx={{ color: 'var(--lx-text-tertiary)', textDecoration: 'line-through', ml: 3 }}>{formatPrice(product.comparePrice)}</Typography>
                )}
              </Box>

              <Typography variant="body1" sx={{ color: 'var(--lx-text-secondary)', mb: 4, lineHeight: 1.7, fontSize: '1.05rem' }}>
                {product.shortDescription || product.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, p: 2, border: '1px solid var(--lx-border-light)', borderRadius: 'var(--lx-radius)' }}>
                <Typography variant="body2" sx={{ color: product.stock > 0 ? 'var(--lx-beige)' : 'var(--lx-text-tertiary)', fontWeight: 500, flexGrow: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.stock > 0 ? 'Available for Acquisition' : 'Currently Unavailable'}
                </Typography>
                {product.deliveryTime && <Typography variant="body2" sx={{ color: 'var(--lx-text-secondary)' }}>Delivers in {product.deliveryTime}</Typography>}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 6 }}>
                <Button variant="contained" disabled={product.stock === 0 || addingToCart} onClick={handleAddToCart} sx={{ flex: 1, height: 56, fontSize: '0.95rem', bgcolor: 'var(--lx-beige)', color: 'var(--lx-black)', '&:hover': { bgcolor: 'var(--lx-text-primary)' } }}>
                  {addingToCart ? 'Processing...' : 'Add to Cart'}
                </Button>
                <IconButton onClick={toggleFavorite} sx={{ width: 56, height: 56, border: '1px solid var(--lx-border)', borderRadius: '4px', color: isFavorite ? 'var(--lx-beige)' : 'var(--lx-text-primary)' }}>
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Grid container spacing={3} sx={{ borderTop: '1px solid var(--lx-border-light)', pt: 4 }}>
                <Grid item xs={6}><Box display="flex" alignItems="center" gap={1.5} color="var(--lx-text-secondary)"><LocalShipping fontSize="small"/><Typography variant="body2">White Glove Delivery</Typography></Box></Grid>
                <Grid item xs={6}><Box display="flex" alignItems="center" gap={1.5} color="var(--lx-text-secondary)"><Security fontSize="small"/><Typography variant="body2">Secure Transaction</Typography></Box></Grid>
                <Grid item xs={6}><Box display="flex" alignItems="center" gap={1.5} color="var(--lx-text-secondary)"><Replay fontSize="small"/><Typography variant="body2">Complimentary Returns</Typography></Box></Grid>
                <Grid item xs={6}><Box display="flex" alignItems="center" gap={1.5} color="var(--lx-text-secondary)"><Star fontSize="small"/><Typography variant="body2">{product.warranty?.duration || 5}-Year Guarantee</Typography></Box></Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 12, borderTop: '1px solid var(--lx-border)', pt: 8 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ '& .MuiTab-root': { color: 'var(--lx-text-secondary)', fontFamily: '"Outfit", sans-serif', fontSize: '1.1rem', mr: 4 }, '& .Mui-selected': { color: 'var(--lx-text-primary) !important' }, '& .MuiTabs-indicator': { bgcolor: 'var(--lx-beige)' } }}>
            <Tab label="Details" />
            <Tab label="Sustainability" />
          </Tabs>
          <Box sx={{ py: 6 }}>
            {tabValue === 0 && (
              <Grid container spacing={8}>
                 <Grid item xs={12} md={7}>
                    <Typography variant="body1" sx={{ color: 'var(--lx-text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>{product.description}</Typography>
                 </Grid>
                 <Grid item xs={12} md={5}>
                    <Typography sx={{ color: 'var(--lx-beige)', mb: 3, fontFamily: '"Outfit", sans-serif', fontSize: '1.2rem' }}>Specifications</Typography>
                    <Box component="ul" sx={{ color: 'var(--lx-text-secondary)', pl: 2, lineHeight: 2 }}>
                       {product.features?.map((f, i) => <li key={i}>{f}</li>)}
                    </Box>
                 </Grid>
              </Grid>
            )}
            {tabValue === 1 && (
              <Box>
                 <Typography sx={{ color: 'var(--lx-text-secondary)', mb: 3 }}>Our commitment to responsible manufacturing ensures this piece minimizes environmental impact.</Typography>
                 {product.sustainability?.ecoScore && (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2, p: 3, border: '1px solid var(--lx-border)', borderRadius: 'var(--lx-radius)' }}>
                       <Spa sx={{ color: 'var(--lx-beige)', fontSize: 32 }} />
                       <Box>
                          <Typography sx={{ color: 'var(--lx-text-primary)', fontWeight: 500, fontFamily: '"Outfit", sans-serif' }}>Eco Rating {product.sustainability.ecoScore}/5</Typography>
                          <Typography variant="body2" sx={{ color: 'var(--lx-text-tertiary)' }}>Certified sustainable materials</Typography>
                       </Box>
                    </Box>
                 )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default ProductDetail;