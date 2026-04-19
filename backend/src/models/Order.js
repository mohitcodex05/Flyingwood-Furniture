const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  productImage: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  customization: {
    color: String,
    finish: String,
    notes: String
  }
});

const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerEmail: String,
  customerPhone: String,
  
  // Order Items
  items: [orderItemSchema],
  
  // Pricing Summary
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Shipping Information
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Shipping Method
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'white_glove', 'installation'],
    default: 'standard'
  },
  trackingNumber: String,
  carrier: String,
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'paypal', 'stripe', 'apple_pay', 'google_pay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  
  // Order Status Timeline
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 'ready_for_shipment',
      'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Delivery Information (White Glove Service - Unique to Flyingwood)
  delivery: {
    isWhiteGlove: {
      type: Boolean,
      default: false
    },
    installationRequired: Boolean,
    deliveryDate: Date,
    timeSlot: String,
    deliveryNotes: String,
    driverInfo: {
      name: String,
      phone: String,
      vehicle: String
    }
  },
  
  // Customer Communication
  notes: {
    customer: String,
    internal: String
  },
  
  // Loyalty Points
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.orderNumber = `FLY-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${timestamp}-${random}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((total, item) => total + item.subtotal, 0);
  
  // Calculate total
  this.total = this.subtotal + this.shippingFee + this.taxAmount - this.discountAmount;
  
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    note,
    updatedBy
  });
};

// Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Index for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);