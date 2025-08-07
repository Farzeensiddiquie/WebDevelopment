const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import products from the frontend JSON file
const productsData = require('../../src/data/products.json');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });
    await adminUser.save();
    console.log('👤 Admin user created');

    // Import products
    const products = productsData.map(product => ({
      ...product,
      stock: product.stock || 50, // Add default stock if not present
      isActive: true,
      isFeatured: Math.random() > 0.7, // Randomly feature some products
      isOnSale: product.oldPrice ? true : false,
      salePercentage: product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0,
      sizes: ['S', 'M', 'L', 'XL'], // Add default sizes
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#0000FF' }
      ],
      tags: [product.category, product.brand.toLowerCase()],
      sku: `SKU-${product.id.padStart(3, '0')}`,
      weight: Math.floor(Math.random() * 500) + 100, // Random weight between 100-600g
      dimensions: {
        length: Math.floor(Math.random() * 20) + 10,
        width: Math.floor(Math.random() * 15) + 8,
        height: Math.floor(Math.random() * 10) + 5
      }
    }));

    await Product.insertMany(products);
    console.log(`✅ Imported ${products.length} products`);

    // Get some stats
    const totalProducts = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');

    console.log('\n📊 Database Stats:');
    console.log(`- Total Products: ${totalProducts}`);
    console.log(`- Categories: ${categories.join(', ')}`);
    console.log(`- Brands: ${brands.length} unique brands`);
    console.log('\n🔑 Admin Credentials:');
    console.log('Email: admin@ecommerce.com');
    console.log('Password: admin123');

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;