const fetch = require('node-fetch');

async function checkServer() {
  try {
    console.log('🔍 Checking if backend server is running...');
    console.log('📍 Checking: http://localhost:5000/api/health');
    
    const response = await fetch('http://localhost:5000/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Server is running!');
      console.log('📊 Status:', data.status);
      console.log('💬 Message:', data.message);
      console.log('⏰ Timestamp:', data.timestamp);
    } else {
      console.log('❌ Server responded with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('💡 Error:', error.message);
    console.log('');
    console.log('🚀 To start the server:');
    console.log('   1. Navigate to the server directory: cd server');
    console.log('   2. Install dependencies: npm install');
    console.log('   3. Create .env file from env.example');
    console.log('   4. Start the server: npm start');
    console.log('');
    console.log('📁 Server directory: server/');
    console.log('🔧 Default port: 5000');
  }
}

checkServer(); 