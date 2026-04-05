import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { usePayment } from '../../context/PaymentContext';
import { useSnackbar } from 'notistack';

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '10px 12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true
};

const StripePayment = ({ order, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, confirmPayment, loading, error } = usePayment();
  const { enqueueSnackbar } = useSnackbar();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  useEffect(() => {
    if (order && order._id) {
      initializePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const initializePayment = async () => {
    try {
      const { clientSecret } = await createPaymentIntent(order._id);
      setClientSecret(clientSecret);
    } catch (err) {
      enqueueSnackbar('Failed to initialize payment', { variant: 'error' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setPaymentProcessing(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: order.shippingAddress.fullName,
              email: order.user.email,
              address: {
                line1: order.shippingAddress.address,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                postal_code: order.shippingAddress.postalCode,
                country: 'US',
              },
            },
          },
        }
      );

      if (stripeError) {
        enqueueSnackbar(stripeError.message, { variant: 'error' });
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with our backend
        await confirmPayment(order._id, paymentIntent.id);
        
        enqueueSnackbar('Payment successful! Order confirmed.', { variant: 'success' });
        onSuccess();
      }
    } catch (err) {
      enqueueSnackbar('Payment failed. Please try again.', { variant: 'error' });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Payment Information
      </Typography>
      
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Credit/Debit Card
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Card Details
          </Typography>
          <Box 
            sx={{ 
              border: 1, 
              borderColor: 'grey.300', 
              borderRadius: 1, 
              p: 2,
              bgcolor: 'background.paper'
            }}
          >
            <CardElement 
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Order Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">${order.subtotal?.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Shipping:</Typography>
            <Typography variant="body2">${order.shippingPrice?.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Tax:</Typography>
            <Typography variant="body2">${order.taxPrice?.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              ${order.totalAmount?.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={onBack}
            disabled={paymentProcessing}
            fullWidth
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!stripe || !cardComplete || paymentProcessing || loading}
            fullWidth
            size="large"
          >
            {paymentProcessing ? (
              <CircularProgress size={24} />
            ) : (
              `Pay $${order.totalAmount?.toFixed(2)}`
            )}
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Your payment is secure and encrypted. We never store your card details.
        </Typography>
      </Card>
    </Box>
  );
};

export default StripePayment;