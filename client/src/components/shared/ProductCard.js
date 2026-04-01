import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  ViewInAr,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  ErrorOutline,
  Visibility,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/currency';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const ProductCard = ({ 
  product, 
  viewMode = 'grid', 
  onBuyNow, 
  onWishlistToggle, 
  isInWishlist = false,
  show3D = false
}) => {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const modelViewerRef = useRef(null);

  const modelUrl = product.model3D 
    ? (product.model3D.startsWith('http') ? product.model3D : `${API_URL}${product.model3D}`) 
    : '';
  
  const posterUrl = product.images?.[0]?.url 
    ? (product.images[0].url.startsWith('http') ? product.images[0].url : `${API_URL}${product.images[0].url}`) 
    : 'https://via.placeholder.com/400x400?text=FlyingWood+Furniture';

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

  const handleCardClick = () => {
    navigate(`/products/${product._id || product.id}`);
  };

  const isList = viewMode === 'list';

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: isList ? 'row' : 'column',
        bgcolor: 'var(--lx-charcoal)',
        border: '1px solid var(--lx-border-light)',
        transition: 'var(--lx-transition)',
        '&:hover': {
          borderColor: 'var(--lx-border)',
          transform: 'translateY(-4px)',
          boxShadow: 'var(--lx-shadow-md)'
        }
      }}
    >
      {/* Media Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: isList ? '35%' : '100%', 
          height: isList ? 'auto' : 320,
          minHeight: isList ? 240 : 'auto',
          bgcolor: '#000',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
        onClick={handleCardClick}
      >
        {product.has3D && !hasError && show3D ? (
          <Box 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
            sx={{ width: '100%', height: '100%' }}
          >
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
              {!isLoaded && <CircularProgress size={24} sx={{ color: 'var(--lx-beige)' }} />}
            </Box>
            <Box slot="progress-bar" sx={{ display: 'none' }} />
            </model-viewer>
          </Box>
        ) : (
          <Box 
            component="img"
            src={posterUrl}
            alt={product.name}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              '.lx-card:hover &': { transform: 'scale(1.05)' }
            }}
          />
        )}

        {/* Overlay Badges */}
        {product.has3D && (
          <Chip 
            label="Live 3D" 
            size="small"
            icon={<ViewInAr sx={{ fontSize: '14px !important' }} />}
            sx={{ 
              position: 'absolute', 
              top: 12, 
              left: 12, 
              bgcolor: 'rgba(12, 12, 12, 0.7)',
              backdropFilter: 'blur(8px)',
              color: 'var(--lx-text-primary)',
              fontSize: '10px',
              fontWeight: 600,
              border: '1px solid var(--lx-border)',
              zIndex: 2,
              pointerEvents: 'none'
            }} 
          />
        )}

        <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
          <IconButton
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12, 
              bgcolor: 'rgba(12, 12, 12, 0.5)', 
              backdropFilter: 'blur(8px)',
              color: isInWishlist ? 'var(--lx-gold-soft)' : 'var(--lx-text-secondary)',
              '&:hover': { bgcolor: 'rgba(12, 12, 12, 0.8)' },
              zIndex: 2
            }}
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle && onWishlistToggle(product._id || product.id);
            }}
          >
            {isInWishlist ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        width: isList ? '65%' : '100%' 
      }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" sx={{ color: 'var(--lx-gold-soft)', letterSpacing: '0.1em', fontWeight: 600 }}>
            {product.category || 'Collection'}
          </Typography>
          <Typography 
            variant={isList ? "h4" : "h6"} 
            component="h2" 
            sx={{ 
              color: 'var(--lx-text-primary)', 
              mb: 1, 
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { color: 'var(--lx-beige)' }
            }}
            onClick={handleCardClick}
          >
            {product.name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--lx-text-secondary)', 
              mb: 2, 
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: isList ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.shortDescription || product.description}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          pt: 2, 
          borderTop: '1px solid var(--lx-border-light)',
          mt: 'auto'
        }}>
          <Typography variant="h6" sx={{ color: 'var(--lx-text-primary)', fontWeight: 600 }}>
            {formatPrice(product.price)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Quick View">
              <IconButton 
                component={Link} 
                to={`/products/${product._id || product.id}`}
                sx={{ color: 'var(--lx-text-secondary)', border: '1px solid var(--lx-border-light)' }}
              >
                <Visibility sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<ShoppingCart />}
              onClick={() => onBuyNow && onBuyNow(product._id || product.id)}
              size={isList ? "medium" : "small"}
              sx={{ px: 2, bgcolor: 'var(--lx-beige)', color: 'var(--lx-black)', '&:hover': { bgcolor: 'var(--lx-text-primary)' } }}
            >
              Buy
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
