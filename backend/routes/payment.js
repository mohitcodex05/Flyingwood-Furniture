const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('../services/emailService');

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Calculate total amount in cents
    const totalAmount = Math.round(order.totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: { 
        orderId: orderId.toString(),
        userId: req.user.id
      }
    });

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      totalAmount: order.totalAmount
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Confirm payment and update order
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;
    
    const order = await Order.findById(orderId).populate('user');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.paymentId = paymentId;
    order.paidAt = new Date();
    
    await order.save();

    // Send confirmation email
    try {
      await emailService.sendOrderConfirmation(order.user, order);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ 
      message: 'Payment confirmed successfully', 
      order 
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment methods
router.get('/methods', auth, async (req, res) => {
  try {
    // In a real app, you might store payment methods for users
    // For now, we'll just return supported methods
    res.json({
      methods: [
        {
          id: 'card',
          name: 'Credit/Debit Card',
          description: 'Pay with Visa, Mastercard, or American Express',
          icon: '💳'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhooks (for future use)
router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;