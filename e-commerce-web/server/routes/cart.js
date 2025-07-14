const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate totals for each item
    const cartItems = user.cart.map(item => {
      const product = item.productId;
      if (!product) return null;
      
      return {
        id: item._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        subtotal: product.price * item.quantity
      };
    }).filter(item => item !== null);

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      success: true,
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', [
  auth,
  body('productId', 'Product ID is required').not().isEmpty(),
  body('quantity', 'Quantity must be a positive number').isInt({ min: 1 }),
  body('size').optional().trim(),
  body('color').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity, size, color } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(400).json({ error: 'Product is not available' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if item already exists in cart
    const existingItem = user.cart.find(item => 
      item.productId.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({
        productId,
        quantity,
        size: size || null,
        color: color || null
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', [
  auth,
  body('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    const user = await User.findById(req.user.id);
    
    // Find the cart item
    const cartItem = user.cart.find(item => item._id.toString() === itemId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Check stock
    const product = await Product.findById(cartItem.productId);
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('Attempting to delete cart item:', itemId);

    const user = await User.findById(req.user.id);
    console.log('User found:', user ? 'yes' : 'no');
    console.log('User cart items:', user.cart.length);
    
    // Find the cart item index
    const cartItemIndex = user.cart.findIndex(item => item._id.toString() === itemId);
    console.log('Cart item index found:', cartItemIndex);
    
    if (cartItemIndex === -1) {
      console.log('Cart item not found for ID:', itemId);
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Remove the item from the cart array
    user.cart.splice(cartItemIndex, 1);
    await user.save();
    console.log('Cart item deleted successfully');

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 