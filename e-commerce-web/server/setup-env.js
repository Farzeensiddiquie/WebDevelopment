const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for MongoDB Atlas...\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Backing up to .env.backup');
  fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
}

// Create basic .env template
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Backend URL (for file uploads)
BACKEND_URL=http://localhost:5000

# Database Configuration - MongoDB Atlas
# Replace the placeholder with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-in-production
JWT_REFRESH_EXPIRE=30d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Replace the MONGODB_URI placeholder with your actual MongoDB Atlas connection string');
  console.log('2. Update the username and password in the connection string');
  console.log('3. Change the JWT_SECRET and JWT_REFRESH_SECRET to secure random strings');
  console.log('\n🔗 Your MongoDB Atlas connection string should look like:');
  console.log('mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority');
  console.log('\n🚀 After updating the .env file, run: npm start');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 