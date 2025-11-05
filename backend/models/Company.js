const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  foundedOn: {
    type: Date,
    required: [true, 'Founded date is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for search functionality
companySchema.index({ name: 'text', city: 'text', location: 'text' });

module.exports = mongoose.model('Company', companySchema);