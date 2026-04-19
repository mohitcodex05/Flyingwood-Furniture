const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Categorization
  category: {
    type: String,
    required: true,
    enum: [
      'sofas', 'chairs', 'tables', 'beds', 'storage', 
      'lighting', 'decor', 'office', 'outdoor', 'dining'
    ]
  },
  subcategory: String,
  tags: [String],
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  
  // Inventory
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  trackQuantity: {
    type: Boolean,
    default: true
  },
  allowBackorder: {
    type: Boolean,
    default: false
  },
  
  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videoUrl: String,
  
  // Dimensions & Specifications
  dimensions: {
    length: Number, // in cm
    width: Number,  // in cm
    height: Number, // in cm
    weight: Number, // in kg
  },
  materials: [String],
  colors: [String],
  features: [String],
  
  // Sustainability Features (Unique to Flyingwood)
  sustainability: {
    ecoScore: {
      type: Number,
      min: 1,
      max: 5
    },
    materials: [{
      name: String,
      percentage: Number,
      isSustainable: Boolean,
      origin: String
    }],
    carbonFootprint: Number, // kg CO2
    isRecyclable: Boolean,
    isBiodegradable: Boolean,
    certifications: [String] // ['FSC', 'GREENGUARD', etc.]
  },
  
  // AR/3D Features (Unique to Flyingwood)
  arData: {
    model3dUrl: String,
    isArEnabled: {
      type: Boolean,
      default: false
    },
    roomPlacementTags: [String] // ['living-room', 'bedroom', etc.]
  },
  
  // Vendor Information
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorName: String,
  
  // Reviews & Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Sales & Popularity
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'draft', 'archived', 'out_of_stock'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  has3D: {
    type: Boolean,
    default: false
  },
  model3D: {
    type: String,
    default: null
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  }

}, {
  timestamps: true
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'sustainability.ecoScore': -1 });
productSchema.index({ vendor: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.trackQuantity ? this.stock > 0 : true;
};

module.exports = mongoose.model('Product', productSchema);