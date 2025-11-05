const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  likes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for sorting
reviewSchema.index({ companyId: 1, createdAt: -1 });
reviewSchema.index({ companyId: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);