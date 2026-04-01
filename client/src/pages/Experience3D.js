import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Fade,
  Chip,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import ProductCard from '../components/shared/ProductCard';

const Experience3D = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch3DProducts();
  }, []);

  const fetch3DProducts = async () => {
    try {
      setLoading(true);
      setError('');
      // In a real app, you might have a specific endpoint for 3D products
      const response = await productAPI.getAll({ limit: 100 });
      const allProducts = response.products || (Array.isArray(response) ? response : []);
      // Filter for products that have 3D models enabled and a model URL
      const filtered = allProducts.filter(p => p.has3D && p.model3D);
      setProducts(filtered);
    } catch (err) {
      console.error('Error fetching 3D products:', err);
      setError('Failed to load 3D products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      await cartAPI.add({ productId, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <Box sx={{ bgcolor: 'var(--lx-black)', minHeight: '100vh', pt: 12, pb: 8, color: 'var(--lx-text-primary)' }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Fade in timeout={1000}>
            <Box>
              <Chip 
                label="Virtual Showroom" 
                sx={{ 
                  borderColor: 'var(--lx-border)', 
                  color: 'var(--lx-gold-soft)', 
                  mb: 2,
                  fontFamily: '"Outfit", sans-serif',
                  letterSpacing: '0.1em'
                }} 
                variant="outlined"
              />
              <Typography variant="h2" component="h1" gutterBottom 
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  letterSpacing: '-0.02em'
                }}>
                Experience Our Heritage
              </Typography>
              <Typography variant="h6" sx={{ color: 'var(--lx-text-secondary)', maxWidth: '700px', mx: 'auto', fontWeight: 400 }}>
                Interact with our pieces directly. Rotate, zoom, and explore every detail 
                of our premium furniture in real-time from your sanctuary.
              </Typography>
            </Box>
          </Fade>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, bgcolor: 'var(--lx-charcoal)', color: 'var(--lx-text-primary)' }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
            <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" sx={{ color: 'var(--lx-text-tertiary)' }}>
              No 3D models available at the moment. 
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ width: '100%', m: 0 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
                <ProductCard 
                  product={product} 
                  onBuyNow={handleBuyNow}
                  show3D={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Experience3D;
