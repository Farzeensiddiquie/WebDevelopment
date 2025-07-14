const express = require('express');
const { body, validationResult, query } = require('express-validator');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a specific product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'rating_high':
        sortObj = { rating: -1, createdAt: -1 };
        break;
      case 'rating_low':
        sortObj = { rating: 1, createdAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 }; // newest
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reviews
    const reviews = await Review.find({ 
      productId: mongoose.Types.ObjectId(productId), 
      isActive: true 
    })
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

    // Get total count
    const total = await Review.countDocuments({ 
      productId: mongoose.Types.ObjectId(productId), 
      isActive: true 
    });

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId), isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    const totalReviews = avgRatingResult.length > 0 ? avgRatingResult[0].totalReviews : 0;

    // Update product rating
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: totalReviews
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      stats: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', [
  auth.auth,
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('text').isLength({ min: 10, max: 1000 }).withMessage('Review text must be between 10 and 1000 characters'),
  body('title').optional().isLength({ max: 100 }).withMessage('Review title cannot be more than 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, rating, text, title } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ 
      productId: mongoose.Types.ObjectId(productId), 
      userId: mongoose.Types.ObjectId(userId) 
    });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create new review
    const review = new Review({
      productId: mongoose.Types.ObjectId(productId),
      userId: mongoose.Types.ObjectId(userId),
      userName: req.user.name,
      userEmail: req.user.email,
      rating,
      text,
      title
    });

    await review.save();

    // Update product rating
    const avgRatingResult = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId), isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    const totalReviews = avgRatingResult.length > 0 ? avgRatingResult[0].totalReviews : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: totalReviews
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
      stats: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews
      }
    });

  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:reviewId/admin
// @desc    Delete a review (admin only)
// @access  Private (Admin)
router.delete('/:reviewId/admin', auth.auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Soft delete (set isActive to false)
    await Review.findByIdAndUpdate(reviewId, { isActive: false });

    // Update product rating
    const avgRatingResult = await Review.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(review.productId), isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    const totalReviews = avgRatingResult.length > 0 ? avgRatingResult[0].totalReviews : 0;

    await Product.findByIdAndUpdate(review.productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: totalReviews
    });

    res.json({
      success: true,
      message: 'Review deleted successfully by admin',
      stats: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews
      }
    });

  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 