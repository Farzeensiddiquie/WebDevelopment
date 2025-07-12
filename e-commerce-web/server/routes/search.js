const express = require('express');
const { query, validationResult } = require('express-validator');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/search
// @desc    Search products with filters
// @access  Public
router.get('/', [
  query('q', 'Search query is required').not().isEmpty().trim(),
  query('category').optional().isIn(['men', 'women', 'accessories', 'shoes', 'bags', 'jewelry']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['relevance', 'price_asc', 'price_desc', 'rating', 'newest', 'name']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      q: searchQuery,
      category,
      minPrice,
      maxPrice,
      sort = 'relevance',
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Text search
    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'name':
        sortObj = { name: 1 };
        break;
      default:
        // For relevance, we'll use text score if available, otherwise newest
        if (searchQuery) {
          sortObj = { score: { $meta: 'textScore' } };
        } else {
          sortObj = { createdAt: -1 };
        }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    let products;
    if (searchQuery && sort === 'relevance') {
      // Use text search with score
      products = await Product.find(filter, { score: { $meta: 'textScore' } })
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));
    } else {
      products = await Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit));
    }

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        query: searchQuery,
        category,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        sort
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/suggestions', [
  query('q', 'Search query is required').not().isEmpty().trim(),
  query('limit').optional().isInt({ min: 1, max: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q: searchQuery, limit = 5 } = req.query;

    // Get product names and brands that match the search query
    const suggestions = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { brand: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .select('name brand category')
    .limit(parseInt(limit))
    .lean();

    // Format suggestions
    const formattedSuggestions = suggestions.map(item => ({
      text: item.name,
      type: 'product',
      category: item.category
    }));

    // Add brand suggestions
    const brandSuggestions = [...new Set(suggestions.map(item => item.brand))]
      .slice(0, 3)
      .map(brand => ({
        text: brand,
        type: 'brand'
      }));

    res.json({
      success: true,
      data: [...formattedSuggestions, ...brandSuggestions]
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 