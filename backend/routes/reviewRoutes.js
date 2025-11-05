const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Company = require('../models/Company');

// Get all reviews for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sort = { createdAt: -1 }; // Default: newest first

    if (sortBy === 'rating') sort = { rating: -1 };
    if (sortBy === 'oldest') sort = { createdAt: 1 };

    const reviews = await Review.find({ companyId: req.params.companyId }).sort(sort);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Create new review
router.post('/', async (req, res) => {
  try {
    const { companyId, fullName, subject, reviewText, rating } = req.body;

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const review = new Review({
      companyId,
      fullName,
      subject,
      reviewText,
      rating,
    });

    const savedReview = await review.save();

    // Update company's average rating and total reviews
    await updateCompanyRating(companyId);

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
});

// Like a review
router.patch('/:id/like', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.likes += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error liking review', error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const companyId = review.companyId;
    await Review.findByIdAndDelete(req.params.id);

    // Update company's average rating and total reviews
    await updateCompanyRating(companyId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

// Helper function to update company rating
async function updateCompanyRating(companyId) {
  const reviews = await Review.find({ companyId });
  const totalReviews = reviews.length;
  
  let averageRating = 0;
  if (totalReviews > 0) {
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = sumRatings / totalReviews;
  }

  await Company.findByIdAndUpdate(companyId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
  });
}

module.exports = router;