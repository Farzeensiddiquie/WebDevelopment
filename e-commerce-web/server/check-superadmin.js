const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkSuperadmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with their roles
    const users = await User.find({}).select('name email role createdAt');
    
    console.log('\n=== All Users ===');
    users.forEach(user => {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Created: ${user.createdAt}`);
      console.log('---');
    });

    // Find superadmin specifically
    const superadmin = await User.findOne({ role: 'superadmin' });
    
    if (superadmin) {
      console.log('\n=== Current Superadmin ===');
      console.log(`Name: ${superadmin.name}`);
      console.log(`Email: ${superadmin.email}`);
      console.log(`Role: ${superadmin.role}`);
    } else {
      console.log('\n❌ No superadmin found in the database');
    }

    // Count users by role
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const superadminCount = await User.countDocuments({ role: 'superadmin' });

    console.log('\n=== User Counts ===');
    console.log(`Users: ${userCount}`);
    console.log(`Admins: ${adminCount}`);
    console.log(`Superadmins: ${superadminCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkSuperadmin(); 