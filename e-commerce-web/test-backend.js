const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('Testing backend connection...');
  
  try {
    // Test products endpoint
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products endpoint:', productsData);
    
    // Test auth endpoint
    const authResponse = await fetch(`${API_BASE_URL}/auth/profile`);
    console.log('✅ Auth endpoint status:', authResponse.status);
    
  } catch (error) {
    console.error('❌ Backend test failed:', error);
  }
}

testBackend(); 