import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  IconButton,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import ProductCard from '../components/shared/ProductCard';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = [
    'All Categories',
    'Chairs',
    'Tables',
    'Sofas',
    'Beds',
    'Storage',
    'Lighting',
    'Decor'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await productAPI.getAll({
          search: searchTerm,
          category: category && category !== 'All Categories' ? category : undefined,
          sort: sortBy,
          page: currentPage,
          limit: 12
        });
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products.filter(p => !p.has3D));
          setTotalPages(data.pagination?.pages || 1);
        } else if (Array.isArray(data)) {
          setProducts(data.filter(p => !p.has3D));
          setTotalPages(1);
        }
      } catch (err) {
        setError(`Failed to load products: ${err.message}`);
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, category, sortBy, currentPage]);

  const getFallbackProducts = () => {
    return [
      {
        _id: '1',
        name: "Levitas Cloud Sofa",
        price: 1299.99,
        category: "sofas",
        images: [{ url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop", alt: "Sofa" }],
        shortDescription: "Uncompromising comfort wrapped in organic cashmere.",
        isFeatured: true,
        rating: 4.8,
        reviewCount: 124,
      },
      {
        _id: '2',
        name: "Obsidian Lounge Chair",
        price: 799.99,
        category: "chairs",
        images: [{ url: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop", alt: "Chair" }],
        shortDescription: "Hand-carved black oak profile uniting mid-century principles.",
        isFeatured: true,
        rating: 4.7,
        reviewCount: 89,
      },
      {
        _id: '3',
        name: "Nebula Coffee Table",
        price: 449.99,
        category: "tables",
        images: [{ url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop", alt: "Table" }],
        shortDescription: "Extruded brass legs supporting smoked glass.",
        isFeatured: false,
        rating: 4.8,
        reviewCount: 67,
      }
    ];
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
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
    <Box sx={{ minHeight: '100vh', pt: 4, pb: 12, background: 'var(--lx-black)' }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8, mt: 4 }}>
          <span className="badge-lx" style={{ marginBottom: 16 }}>Complete Collection</span>
          <Typography variant="h2" component="h1" gutterBottom 
            sx={{ color: 'var(--lx-text-primary)' }}>
            Curated Acquisitions
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--lx-text-secondary)', maxWidth: 600, mx: 'auto' }}>
            Explore our definitive catalog of expertly crafted pieces.
          </Typography>
        </Box>

        {/* Filters Section */}
        <Box sx={{ 
          mb: 6, 
          p: 3, 
          background: 'var(--lx-charcoal)',
          borderRadius: 2,
          border: '1px solid var(--lx-border-light)'
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
               <TextField
                fullWidth
                placeholder="Search collection..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'var(--lx-text-tertiary)', mr: 1 }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: 'var(--lx-text-secondary)' }}>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat === 'All Categories' ? '' : cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
               <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: 'var(--lx-text-secondary)' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  label="Sort By"
                >
                  <MenuItem value="newest">Latest Arrivals</MenuItem>
                  <MenuItem value="priceLow">Price: Ascending</MenuItem>
                  <MenuItem value="priceHigh">Price: Descending</MenuItem>
                  <MenuItem value="name">Alphabetical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} sx={{ color: 'var(--lx-text-secondary)' }}>
                  {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
                </IconButton>
                <Button variant="outlined" color="primary" sx={{ flexGrow: 1 }} onClick={() => { setSearchTerm(''); setCategory(''); setSortBy('newest'); setCurrentPage(1); }}>
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, background: 'var(--lx-charcoal)', color: 'var(--lx-text-primary)' }}>{error}</Alert>
        )}

        {/* Products */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <CircularProgress sx={{ color: 'var(--lx-beige)' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={4} sx={{ width: '100%', m: 0, justifyContent: 'center' }}>
              {products.map((product) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={viewMode === 'grid' ? 6 : 12} 
                  md={viewMode === 'grid' ? 4 : 12} 
                  lg={viewMode === 'grid' ? 3 : 12} 
                  key={product._id || product.id}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                      isInWishlist={wishlist.includes(product._id || product.id)}
                      onWishlistToggle={toggleWishlist}
                      onBuyNow={handleBuyNow}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" sx={{ mt: 8 }}>
                 <Pagination count={totalPages} page={currentPage} onChange={(e, v) => { setCurrentPage(v); window.scrollTo(0, 0); }} 
                    sx={{
                      '& .MuiPaginationItem-root': { color: 'var(--lx-text-secondary)' },
                      '& .Mui-selected': { bgcolor: 'var(--lx-surface-elevated) !important', color: 'var(--lx-beige)' }
                    }} 
                 />
              </Box>
            )}
            
            {products.length === 0 && (
               <Box textAlign="center" py={12}>
                 <Typography variant="h5" color="text.secondary" gutterBottom>No pieces found matching your criteria.</Typography>
                 <Button onClick={() => { setSearchTerm(''); setCategory(''); }} sx={{ mt: 2, color: 'var(--lx-beige)' }}>Clear Filters</Button>
               </Box>
            )}
          </>
        )}
      </Container>
      
      {isMobile && (
        <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, bgcolor: 'var(--lx-beige)', color: 'var(--lx-black)' }}>
          <FilterList />
        </Fab>
      )}
    </Box>
  );
};

export default Products;