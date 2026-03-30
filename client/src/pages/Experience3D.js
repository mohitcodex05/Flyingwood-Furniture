import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Fade,
  Chip
} from '@mui/material';
import { 
  ViewInAr, 
  ShoppingCart,
  ErrorOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { formatPrice } from '../utils/currency';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Product3DCard = ({ product, onBuyNow }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const modelViewerRef = React.useRef(null);

  const modelUrl = product.model3D 
    ? (product.model3D.startsWith('http') ? product.model3D : `${API_URL}${product.model3D}`) 
    : '';
  
  const posterUrl = product.images?.[0]?.url 
    ? (product.images[0].url.startsWith('http') ? product.images[0].url : `${API_URL}${product.images[0].url}`) 
    : 'https://via.placeholder.com/400x400?text=Flywood+Furniture';

  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return;

    const handleError = (error) => {
      console.error('Model Viewer Error:', error);
      setHasError(true);
    };

    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    viewer.addEventListener('error', handleError);
    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('error', handleError);
      viewer.removeEventListener('load', handleLoad);
    };
  }, [modelUrl]);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#161616',
        border: '1px solid rgba(229, 223, 212, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#e5dfd4',
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 320, width: '100%', bgcolor: '#000' }}>
        {!hasError ? (
          <model-viewer 
            ref={modelViewerRef}
            src={modelUrl}
            poster={posterUrl}
            alt={product.name}
            auto-rotate
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1"
            loading="lazy"
            reveal="auto"
            style={{ width: '100%', height: '100%', outline: 'none' }}
          >
            <Box 
              slot="poster" 
              sx={{ 
                width: '100%', 
                height: '100%', 
                backgroundImage: `url(${posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!isLoaded && <CircularProgress size={24} sx={{ color: '#bfa780' }} />}
            </Box>

            <Box 
              slot="progress-bar" 
              sx={{ display: 'none' }} 
            />
          </model-viewer>
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#1a1a1a',
              color: '#d4c9b9',
              p: 3,
              textAlign: 'center',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <ErrorOutline sx={{ fontSize: 48, mb: 2, color: '#bfa780' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Incomplete 3D File Detected
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              This .gltf is missing its geometry data (.bin). <br/>
              <strong>Please upload a .glb file instead.</strong>
            </Typography>
          </Box>
        )}
        
        <Chip 
          label="Live 3D" 
          size="small"
          icon={<ViewInAr sx={{ fontSize: '14px !important' }} />}
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            bgcolor: 'rgba(12, 12, 12, 0.8)',
            backdropFilter: 'blur(4px)',
            color: '#f8f6f0',
            fontSize: '11px',
            fontWeight: 600,
            border: '1px solid rgba(229, 223, 212, 0.2)',
            zIndex: 2
          }} 
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="overline" sx={{ color: '#bfa780', letterSpacing: '0.1em' }}>
          {product.category}
        </Typography>
        <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 1 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(248, 246, 240, 0.65)', mb: 2, height: 40, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.shortDescription}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: '#f8f6f0' }}>
            {formatPrice(product.price)}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ShoppingCart />}
            onClick={() => onBuyNow(product._id)}
            size="small"
            sx={{ px: 2 }}
          >
            Buy
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Experience3D = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch3DProducts();
  }, []);

  const fetch3DProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 100 });
      const allProducts = response.products || response.data?.products || [];
      // Filter for 3D enabled products
      setProducts(allProducts.filter(p => p.has3D));
    } catch (error) {
      console.error('Error fetching 3D products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (productId) => {
    try {
      await cartAPI.add({ productId, quantity: 1 });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', bgcolor: '#0c0c0c' }}>
        <CircularProgress sx={{ color: '#bfa780' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#0c0c0c', minHeight: '100vh', pt: 12, pb: 8, color: '#f8f6f0' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Fade in timeout={1000}>
            <Box>
              <Chip 
                label="Interactive Boutique" 
                variant="outlined" 
                sx={{ borderColor: 'rgba(229, 223, 212, 0.3)', color: '#bfa780', mb: 2 }} 
              />
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
                Experience Our Heritage
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(248, 246, 240, 0.65)', maxWidth: '600px', mx: 'auto', fontWeight: 400 }}>
                Interact with our pieces directly. Rotate, zoom, and explore every detail 
                of our premium furniture in real-time.
              </Typography>
            </Box>
          </Fade>
        </Box>

        {products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" color="textSecondary">
              No 3D models available yet. Check back soon.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Product3DCard product={product} onBuyNow={handleBuyNow} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Experience3D;
