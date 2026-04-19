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
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  LocalShipping, 
  Assignment, 
  CheckCircle
} from '@mui/icons-material';
import { cartAPI, orderAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, EXPERIMENTAL_EXCHANGE_RATE } from '../utils/currency';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [error, setError] = useState('');
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const steps = ['Shipping', 'Payment', 'Review', 'Confirmation'];

  const shippingMethods = [
    {
      value: 'standard',
      label: 'Standard Shipping',
      cost: 0,
      duration: '5-7 business days'
    },
    {
      value: 'express',
      label: 'Express Shipping',
      cost: 29.99,
      duration: '2-3 business days'
    },
    {
      value: 'white_glove',
      label: 'White Glove Delivery',
      cost: 99.99,
      duration: 'Scheduled delivery & setup'
    }
  ];

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
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const calculateSubtotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const method = shippingMethods.find(m => m.value === shippingMethod);
    return method ? method.cost : 0;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.id = 'razorpay-script';
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeOrderPlacement = async () => {
    try {
      const orderData = {
        shippingAddress,
        shippingMethod,
        payment: {
          method: paymentMethod
        },
        items: cart.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await orderAPI.create(orderData);
      setActiveStep(3);
      await cartAPI.clear();
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    } finally {
      setProcessing(false);
      setProcessingMessage('');
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError('');

    if (paymentMethod === 'razorpay') {
      setProcessingMessage('Processing Payment...');
      
      // Artificial delay for DEMO animation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load Razorpay SDK. Check your internet connection.');
        setProcessing(false);
        setProcessingMessage('');
        return;
      }

      try {
        // Convert USD total → INR → Paise (smallest unit Razorpay accepts)
        const amountInPaise = Math.round(calculateTotal() * EXPERIMENTAL_EXCHANGE_RATE * 100);
        const { data } = await paymentAPI.createOrder({ amount: amountInPaise, currency: 'INR' });
        const { order, keyId } = data;

        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Flyingwood Furniture",
          description: "Demo Order Payment",
          order_id: order.id,
          handler: async function (response) {
             // Show 5-second success animation THEN place order
             setShowSuccessAnim(true);
             await new Promise((resolve) => setTimeout(resolve, 5000));
             setShowSuccessAnim(false);
             setProcessingMessage('Finalizing Order...');
             await executeOrderPlacement();
          },
          prefill: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            email: user?.email || '',
          },
          theme: {
            color: "#1976d2"
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on('payment.failed', function (response) {
          setError("Payment Failed: " + response.error.description);
          setProcessing(false);
          setProcessingMessage('');
        });

        // Reset if user closes modal without paying
        paymentObject.on('modal.closed', function() {
           setProcessing(false);
           setProcessingMessage('');
        });

      } catch (err) {
        setError('Error initializing Razorpay checkout.');
        console.error(err);
        setProcessing(false);
        setProcessingMessage('');
      }
    } else {
      await executeOrderPlacement();
    }
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading checkout...
        </Typography>
      </Container>
    );
  }

  if (cart.items.length === 0 && activeStep !== 3) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Your cart is empty. Add some items before checkout.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Checkout
      </Typography>

      {/* Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {/* Step 1: Shipping */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <LocalShipping sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Shipping Information
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="First Name"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleAddressChange('firstName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Last Name"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleAddressChange('lastName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required
                      fullWidth
                      label="ZIP Code"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={shippingAddress.country}
                        label="Country"
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                      >
                        <MenuItem value="United States">United States</MenuItem>
                        <MenuItem value="Canada">Canada</MenuItem>
                        <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                        <MenuItem value="India">India</MenuItem>
                        
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Shipping Method */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Shipping Method
                </Typography>
                <RadioGroup
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                >
                  {shippingMethods.map((method) => (
                    <Card key={method.value} sx={{ mb: 1 }}>
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                        <FormControlLabel
                          value={method.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1" fontWeight="medium">
                                {method.label}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {method.duration}
                                {method.cost > 0 && ` - ${formatPrice(method.cost)}`}
                              </Typography>
                            </Box>
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>
              </Box>
            )}

            {/* Step 2: Payment */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Payment Method
                </Typography>

                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ mt: 2 }}
                >
                  <FormControlLabel 
                    value="credit_card" 
                    control={<Radio />} 
                    label="Credit Card" 
                  />
                  <FormControlLabel 
                    value="paypal" 
                    control={<Radio />} 
                    label="PayPal" 
                  />
                  <FormControlLabel 
                    value="stripe" 
                    control={<Radio />} 
                    label="Stripe" 
                  />
                  <FormControlLabel 
                    value="apple_pay" 
                    control={<Radio />} 
                    label="Apple Pay" 
                  />
                  <FormControlLabel 
                    value="razorpay" 
                    control={<Radio />} 
                    label={<b>Pay with Razorpay</b>} 
                  />
                </RadioGroup>

                {paymentMethod === 'credit_card' && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          required
                          fullWidth
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          required
                          fullWidth
                          label="Cardholder Name"
                          placeholder="John Doe"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          required
                          fullWidth
                          label="Expiry"
                          placeholder="MM/YY"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          required
                          fullWidth
                          label="CVV"
                          placeholder="123"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <FormControlLabel
                  control={
                    <Radio
                      checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    />
                  }
                  label="Billing address same as shipping address"
                  sx={{ mt: 3 }}
                />
              </Box>
            )}

            {/* Step 3: Review */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Review Your Order
                </Typography>

                {/* Order Items */}
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Order Items
                </Typography>
                <List>
                  {cart.items.map((item) => (
                    <ListItem key={item._id} divider>
                      <ListItemIcon>
                        <Box
                          component="img"
                          src={item.product?.images?.[0]?.url || '/api/placeholder/60/60'}
                          alt={item.product?.name}
                          sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.product?.name}
                        secondary={`Quantity: ${item.quantity}`}
                      />
                      <Typography variant="body1" fontWeight="medium">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>

                {/* Shipping Address */}
                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  Shipping Address
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </Typography>
                  <Typography>
                    {shippingAddress.street}
                  </Typography>
                  <Typography>
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </Typography>
                  <Typography>
                    {shippingAddress.country}
                  </Typography>
                </Card>

                {/* Shipping Method */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Shipping Method
                </Typography>
                <Typography>
                  {shippingMethods.find(m => m.value === shippingMethod)?.label}
                </Typography>
              </Box>
            )}

            {/* Payment Success Animation Overlay */}
            {showSuccessAnim && (
              <Box sx={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                '@keyframes popIn': {
                  '0%': { transform: 'scale(0)', opacity: 0 },
                  '60%': { transform: 'scale(1.2)', opacity: 1 },
                  '100%': { transform: 'scale(1)', opacity: 1 },
                },
                '@keyframes fadeSlide': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '@keyframes ring': {
                  '0%': { transform: 'scale(1)', opacity: 0.8 },
                  '100%': { transform: 'scale(2.5)', opacity: 0 },
                },
              }}>
                {/* Ripple rings */}
                <Box sx={{
                  position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 160, height: 160, mb: 3,
                }}>
                  {[0, 0.4, 0.8].map((delay, i) => (
                    <Box key={i} sx={{
                      position: 'absolute', width: 120, height: 120, borderRadius: '50%',
                      border: '3px solid #4caf50', animation: 'ring 1.5s ease-out infinite',
                      animationDelay: `${delay}s`,
                    }} />
                  ))}
                  <CheckCircle sx={{
                    fontSize: 100, color: '#4caf50',
                    animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                    filter: 'drop-shadow(0 0 20px rgba(76,175,80,0.8))',
                  }} />
                </Box>

                <Typography variant="h3" sx={{
                  color: '#ffffff', fontWeight: 800, mb: 1,
                  animation: 'fadeSlide 0.5s ease 0.3s both',
                }}>
                  Payment Successful! 🎉
                </Typography>
                <Typography variant="h6" sx={{
                  color: 'rgba(255,255,255,0.8)',
                  animation: 'fadeSlide 0.5s ease 0.5s both',
                }}>
                  Your order has been placed
                </Typography>
                <Typography variant="body2" sx={{
                  color: 'rgba(255,255,255,0.5)', mt: 3,
                  animation: 'fadeSlide 0.5s ease 0.7s both',
                }}>
                  Saving your order details...
                </Typography>
              </Box>
            )}

            {/* Step 4: Confirmation */}
            {activeStep === 3 && (
              <Box textAlign="center" sx={{ py: 4 }}>
                <CheckCircle sx={{
                  fontSize: 80, color: 'success.main', mb: 2,
                  '@keyframes pulse': { '0%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' }, '100%': { transform: 'scale(1)' } },
                  animation: 'pulse 1.2s ease-in-out infinite',
                }} />
                <Typography variant="h4" gutterBottom color="success.main">
                  {paymentMethod === 'razorpay' ? 'Payment Successful 🎉' : 'Order Confirmed!'}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Thank you for your purchase
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  Your order has been successfully placed. You will receive a confirmation email shortly.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{ mr: 2 }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/profile')}
                >
                  View Orders
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>

            {activeStep < 3 && (
              <>
                {/* Order Items */}
                <Box sx={{ mb: 2 }}>
                  {cart.items.map((item) => (
                    <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {item.product?.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        {formatPrice(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Pricing Breakdown */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatPrice(calculateSubtotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping:</Typography>
                    <Typography>{formatPrice(calculateShipping())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax:</Typography>
                    <Typography>{formatPrice(calculateTax())}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">{formatPrice(calculateTotal())}</Typography>
                  </Box>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  {activeStep > 0 && activeStep < 3 && (
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      fullWidth
                    >
                      Back
                    </Button>
                  )}
                  
                  {activeStep < 2 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      fullWidth
                    >
                      Continue
                    </Button>
                  )}
                  
                  {activeStep === 2 && (
                    <Box sx={{ width: '100%' }}>
                      <Button
                        variant="contained"
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        fullWidth
                        size="large"
                      >
                        {processing ? <CircularProgress size={24} /> : (paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order')}
                      </Button>
                      {processing && processingMessage && (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                          {processingMessage}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;