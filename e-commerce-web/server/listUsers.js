const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const users = await User.find({}, { email: 1, name: 1, role: 1 });
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach(u => console.log(`${u.email} (${u.name}) - role: ${u.role}`));
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  }); 