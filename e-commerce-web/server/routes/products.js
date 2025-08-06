const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { uploadSingle, uploadMultiple, getFileUrl, deleteFile } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['men', 'women', 'accessories', 'shoes', 'bags', 'jewelry']),
  query('brand').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest', 'name']),
  query('search').optional().trim(),
  query('isOnSale').optional().isBoolean(),
  query('isFeatured').optional().isBoolean()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'newest',
      search,
      isOnSale,
      isFeatured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (isOnSale !== undefined) filter.isOnSale = isOnSale === 'true';
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    // Text search
    if (search) {
      filter.$text = { $search: search };
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
      case 'name':
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { createdAt: -1 }; // newest
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

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
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ error: 'Product not available' });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product with image upload
// @access  Private (Admin only)
router.post('/', [
  auth.auth,
  auth.admin,
  uploadMultiple, // allow multiple images
  body('name', 'Product name is required').not().isEmpty().trim().escape(),
  body('description', 'Product description is required').not().isEmpty().trim(),
  body('price', 'Price is required and must be positive').isFloat({ min: 0 }),
  body('brand', 'Brand is required').not().isEmpty().trim(),
  body('category', 'Category is required').isIn(['men', 'women', 'accessories', 'shoes', 'bags', 'jewelry']),
  body('stock', 'Stock quantity is required').isInt({ min: 0 })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Handle multiple image uploads (max 4)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.slice(0, 4).map(file => getFileUrl(file.filename, req));
    } else if (req.body.images) {
      // If images are sent as URLs (e.g., from form), parse them
      images = Array.isArray(req.body.images) ? req.body.images.slice(0, 4) : [req.body.images];
    }

    // For backward compatibility, set main image as first image or fallback
    let imageUrl = images[0] || null;
    if (!imageUrl && req.body.image) {
      imageUrl = req.body.image;
      images = [imageUrl];
    }

    const productData = {
      ...req.body,
      image: imageUrl, // main image
      images, // array of images
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      oldPrice: req.body.oldPrice ? parseFloat(req.body.oldPrice) : null
    };

    const product = new Product(productData);
    await product.save();
    console.log('Product saved:', product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product with optional image upload
// @access  Private (Admin only)
router.put('/:id', [
  auth.auth,
  auth.admin,
  uploadMultiple, // allow multiple images
  body('name').optional().trim().escape(),
  body('description').optional().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('brand').optional().trim(),
  body('category').optional().isIn(['men', 'women', 'accessories', 'shoes', 'bags', 'jewelry']),
  body('stock').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get existing product to handle image deletion
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Handle multiple image uploads (max 4)
    let images = existingProduct.images || [];
    if (req.files && req.files.length > 0) {
      // Optionally delete old images if needed
      images = req.files.slice(0, 4).map(file => getFileUrl(file.filename, req));
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images.slice(0, 4) : [req.body.images];
    }

    // For backward compatibility, set main image as first image or fallback
    let imageUrl = images[0] || existingProduct.image;
    if (req.body.image) {
      imageUrl = req.body.image;
      if (!images.includes(imageUrl)) images.unshift(imageUrl);
      images = images.slice(0, 4);
    }

    const updateData = {
      ...req.body,
      image: imageUrl,
      images,
    };

    // Convert numeric fields
    if (req.body.price) updateData.price = parseFloat(req.body.price);
    if (req.body.stock) updateData.stock = parseInt(req.body.stock);
    if (req.body.oldPrice) updateData.oldPrice = parseFloat(req.body.oldPrice);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product and its image
// @access  Private (Admin only)
router.delete('/:id', [auth.auth, auth.admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete associated image file
    if (product.image && !product.image.startsWith('http')) {
      deleteFile(product.image.split('/').pop());
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/products/:id/images
// @desc    Upload additional images for a product
// @access  Private (Admin only)
router.post('/:id/images', [
  auth.auth,
  auth.admin,
  uploadMultiple
], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Get URLs for uploaded images
    const imageUrls = req.files.map(file => getFileUrl(file.filename, req));
    
    // Add new images to existing images array
    const updatedImages = [...(product.images || []), ...imageUrls];
    
    product.images = updatedImages;
    await product.save();

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: updatedImages
      }
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/products/:id/images/:imageIndex
// @desc    Delete a specific image from a product
// @access  Private (Admin only)
router.delete('/:id/images/:imageIndex', [auth.auth, auth.admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    
    if (imageIndex < 0 || imageIndex >= (product.images || []).length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }

    const imageToDelete = product.images[imageIndex];
    
    // Delete file if it's not a URL
    if (imageToDelete && !imageToDelete.startsWith('http')) {
      deleteFile(imageToDelete.split('/').pop());
    }

    // Remove image from array
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        images: product.images
      }
    });

  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/products/brands
// @desc    Get all brands
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { isActive: true });
    
    res.json({
      success: true,
      data: brands
    });

  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 