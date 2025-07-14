const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/addresses
// @desc    Get user's addresses
// @access  Private
router.get('/', [
  auth.auth,
  query('type').optional().isIn(['shipping', 'billing', 'both'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter addresses by type if specified
    let addresses = user.addresses || [];
    if (type) {
      addresses = addresses.filter(addr => addr.type === type || addr.type === 'both');
    }

    // Sort by default first, then by creation date
    addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/addresses
// @desc    Add a new address for the user
// @access  Private
router.post('/', [
  auth.auth,
  body('type', 'Address type is required').isIn(['shipping', 'billing', 'both']),
  body('firstName', 'First name is required').not().isEmpty().trim(),
  body('lastName', 'Last name is required').not().isEmpty().trim(),
  body('email', 'Email is required').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('address', 'Address is required').not().isEmpty().trim(),
  body('city', 'City is required').not().isEmpty().trim(),
  body('state', 'State is required').not().isEmpty().trim(),
  body('zipCode', 'Zip code is required').not().isEmpty().trim(),
  body('country').optional().trim(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country = 'United States',
      isDefault = false
    } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If this is a default address, unset other defaults of the same type
    if (isDefault) {
      user.addresses.forEach(addr => {
        if (addr.type === type || addr.type === 'both') {
          addr.isDefault = false;
        }
      });
    }

    // Create new address
    const newAddress = {
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      firstName,
      lastName,
      email,
      phone: phone || null,
      address,
      city,
      state,
      zipCode,
      country,
      isDefault,
      createdAt: new Date()
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress
    });

  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id
// @desc    Update an address
// @access  Private
router.put('/:id', [
  auth.auth,
  body('type').optional().isIn(['shipping', 'billing', 'both']),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('state').optional().trim(),
  body('zipCode').optional().trim(),
  body('country').optional().trim(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);
    
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const address = user.addresses[addressIndex];
    const { isDefault } = req.body;

    // If setting as default, unset other defaults of the same type
    if (isDefault && !address.isDefault) {
      user.addresses.forEach(addr => {
        if (addr.id !== req.params.id && (addr.type === address.type || addr.type === 'both')) {
          addr.isDefault = false;
        }
      });
    }

    // Update address fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        address[key] = req.body[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });

  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/addresses/:id
// @desc    Delete an address
// @access  Private
router.delete('/:id', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);
    
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/addresses/:id/default
// @desc    Set an address as default
// @access  Private
router.put('/:id/default', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = user.addresses.find(addr => addr.id === req.params.id);
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Unset other defaults of the same type
    user.addresses.forEach(addr => {
      if (addr.id !== req.params.id && (addr.type === address.type || addr.type === 'both')) {
        addr.isDefault = false;
      }
    });

    // Set this address as default
    address.isDefault = true;
    await user.save();

    res.json({
      success: true,
      message: 'Address set as default',
      data: address
    });

  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/addresses/default
// @desc    Get user's default addresses
// @access  Private
router.get('/default', [
  auth.auth,
  query('type').optional().isIn(['shipping', 'billing', 'both'])
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get default addresses
    let defaultAddresses = user.addresses.filter(addr => addr.isDefault);
    
    // Filter by type if specified
    if (type) {
      defaultAddresses = defaultAddresses.filter(addr => 
        addr.type === type || addr.type === 'both'
      );
    }

    res.json({
      success: true,
      data: defaultAddresses
    });

  } catch (error) {
    console.error('Get default addresses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 