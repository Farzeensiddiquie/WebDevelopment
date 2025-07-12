const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.productId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlistItems = user.wishlist.map(item => {
      const product = item.productId;
      if (!product) return null;
      
      return {
        id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        addedAt: item.addedAt
      };
    }).filter(item => item !== null);

    res.json({
      success: true,
      items: wishlistItems,
      itemCount: wishlistItems.length
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', [
  auth.auth,
  body('productId', 'Product ID is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if product already exists in wishlist
    const existingItem = user.wishlist.find(item => 
      item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push({
      productId,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist successfully'
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', auth.auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    const wishlistItem = user.wishlist.find(item => 
      item.productId.toString() === productId
    );

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(item => 
      item.productId.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 