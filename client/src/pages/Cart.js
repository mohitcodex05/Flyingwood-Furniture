import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Add, Remove, Delete } from '@mui/icons-material';
import { cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data.cart);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await cartAPI.update(itemId, newQuantity);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Error updating cart:', err);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(true);
      await cartAPI.remove(itemId);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      setError('Failed to remove item');
      console.error('Error removing item:', err);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      setUpdating(true);
      await cartAPI.clear();
      setCart({ items: [] });
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setUpdating(false);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to view your cart.
        </Alert>
        <Button 
          variant="contained" 
          component={Link} 
          to="/login"
        >
          Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading cart...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cart.items.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add some sustainable furniture to get started!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/products"
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Cart Items ({cart.items.length})
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={clearCart}
                  disabled={updating}
                >
                  Clear Cart
                </Button>
              </Box>

              {cart.items.map((item) => (
                <Card key={item._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3} sm={2}>
                        <CardMedia
                          component="img"
                          height="80"
                          image={item.product?.images?.[0]?.url || '/api/placeholder/100/80'}
                          alt={item.product?.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      </Grid>
                      
                      <Grid item xs={9} sm={4}>
                        <Typography variant="h6" gutterBottom>
                          {item.product?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(item.price)} each
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updating || item.quantity <= 1}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                          
                          <TextField
                            value={item.quantity}
                            size="small"
                            sx={{ 
                              width: 60, 
                              mx: 1,
                              '& .MuiInputBase-input': { textAlign: 'center' }
                            }}
                            inputProps={{ min: 1 }}
                            disabled
                          />
                          
                          <IconButton 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updating}
                            size="small"
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>

                      <Grid item xs={4} sm={2}>
                        <Typography variant="h6" align="center">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Grid>

                      <Grid item xs={2} sm={1}>
                        <IconButton 
                          onClick={() => removeItem(item._id)}
                          disabled={updating}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>{formatPrice(calculateTotal())}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>{formatPrice(0)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>{formatPrice(calculateTotal() * 0.1)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">
                    {formatPrice(calculateTotal() * 1.1)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/products"
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Cart;