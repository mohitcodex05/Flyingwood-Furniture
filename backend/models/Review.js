const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Update product rating when review is saved
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { product: this.product, status: 'approved' } },
    { $group: { 
        _id: '$product', 
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
    }}
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(this.product, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);