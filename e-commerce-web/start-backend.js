const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting E-commerce Backend Server...\n');

// Check if .env file exists in server directory
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found in server directory');
  console.log('📝 Creating basic .env file...');
  
  const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Backend URL (for file uploads)
BACKEND_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-change-this-in-production
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
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
}

// Check if node_modules exists in server directory
const nodeModulesPath = path.join(__dirname, 'server', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing server dependencies...');
  const install = spawn('npm', ['install'], { 
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit'
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Dependencies installed');
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting server...');
  console.log('📊 Server will be available at: http://localhost:5000');
  console.log('🔍 Health check: http://localhost:5000/api/health');
  console.log('📁 Uploads: http://localhost:5000/uploads\n');
  
  const server = spawn('npm', ['start'], { 
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit'
  });
  
  server.on('close', (code) => {
    console.log(`\n❌ Server stopped with code ${code}`);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGTERM');
    process.exit(0);
  });
} 