const mongoose = require('mongoose');
const User = require('./server/models/User');
require('dotenv').config();

const email = "user@ecommerce.com";

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }
    
    console.log(`Found user: ${user.email} (${user.name})`);
    console.log(`Current role: ${user.role}`);
    
    user.role = "superadmin";
    await user.save();
    
    console.log(`✅ User ${email} promoted to superadmin!`);
    
    // Also check if there are any other superadmins
    const allSuperadmins = await User.find({ role: "superadmin" });
    console.log(`\n📋 All superadmins:`);
    allSuperadmins.forEach(u => console.log(`- ${u.email} (${u.name})`));
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  }); 