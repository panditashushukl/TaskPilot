// Simple test script to verify authentication endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:8000/api/v1';

async function testAuth() {
  try {
    console.log('Testing authentication endpoints...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test registration
    const registerData = {
      fullName: 'Test User',
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123!',
      role: 'user'
    };
    
    console.log('\nTesting registration...');
    const registerResponse = await axios.post(`${API_BASE}/users/register`, registerData);
    console.log('✅ Registration successful:', registerResponse.data);
    
    // Test login
    const loginData = {
      email: 'test@example.com',
      password: 'TestPass123!'
    };
    
    console.log('\nTesting login...');
    const loginResponse = await axios.post(`${API_BASE}/users/login`, loginData, {
      withCredentials: true
    });
    console.log('✅ Login successful:', loginResponse.data);
    
    // Test get current user
    const token = loginResponse.data.data.accessToken;
    console.log('\nTesting get current user...');
    const userResponse = await axios.get(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    console.log('✅ Get current user successful:', userResponse.data);
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth(); 