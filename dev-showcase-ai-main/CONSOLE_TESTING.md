# JavaScript Console Testing Guide

## Quick Console Commands

### 1. **Check Backend Status**
```javascript
// Check if backend is running and healthy
fetch('/api/auth/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend:', data))
  .catch(err => console.error('❌ Backend error:', err));
```

### 2. **Check OAuth Configuration**
```javascript
// Verify OAuth setup
fetch('/api/debug/oauth-status')
  .then(res => res.json())
  .then(data => console.log('🔧 OAuth Config:', data))
  .catch(err => console.error('❌ Config error:', err));
```

### 3. **Test Google OAuth Redirect**
```javascript
// Start Google OAuth flow
console.log('🚀 Starting Google OAuth...');
window.location.href = '/api/auth/google';
```

### 4. **Check Current Session**
```javascript
// Check if user is logged in
fetch('/api/debug/session', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log('👤 Session:', data))
  .catch(err => console.error('❌ Session error:', err));
```

### 5. **Test Mock OAuth Success**
```javascript
// Simulate successful OAuth (for testing without Google)
fetch('/api/test/oauth-success', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log('🎭 Mock OAuth:', data))
  .catch(err => console.error('❌ Mock error:', err));
```

### 6. **Test Logout**
```javascript
// Logout user
fetch('/api/auth/logout', { credentials: 'include' })
  .then(() => {
    console.log('👋 Logged out');
    window.location.href = '/';
  })
  .catch(err => console.error('❌ Logout error:', err));
```

## Advanced Testing

### **Complete OAuth Flow Test**
```javascript
// Run this to test the entire flow
async function testOAuthFlow() {
  console.log('🧪 Starting OAuth Flow Test...');
  
  // Step 1: Check backend
  try {
    const health = await fetch('/api/auth/health').then(r => r.json());
    console.log('✅ Backend health:', health);
  } catch (err) {
    console.error('❌ Backend not running');
    return;
  }
  
  // Step 2: Check OAuth config
  try {
    const config = await fetch('/api/debug/oauth-status').then(r => r.json());
    console.log('🔧 OAuth config:', config);
    
    if (config.googleClientId === 'Not set') {
      console.error('❌ Google Client ID not configured');
      return;
    }
  } catch (err) {
    console.error('❌ Config check failed:', err);
    return;
  }
  
  // Step 3: Start OAuth
  console.log('🚀 Redirecting to Google OAuth...');
  window.location.href = '/api/auth/google';
}

// Run the test
testOAuthFlow();
```

### **Environment Check**
```javascript
// Check if all required environment variables are set
fetch('/api/debug/oauth-status')
  .then(res => res.json())
  .then(config => {
    const issues = [];
    
    if (config.googleClientId === 'Not set') issues.push('GOOGLE_CLIENT_ID');
    if (config.googleClientSecret === 'Not set') issues.push('GOOGLE_CLIENT_SECRET');
    if (config.mongoUri === 'Not set') issues.push('MONGO_URI');
    
    if (issues.length > 0) {
      console.error('❌ Missing environment variables:', issues);
      console.log('💡 Create a .env file with these variables');
    } else {
      console.log('✅ All environment variables are set');
    }
  });
```

## Troubleshooting Commands

### **Check Network Requests**
```javascript
// Monitor all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 Fetch request:', args[0]);
  return originalFetch.apply(this, args).then(response => {
    console.log('📡 Response status:', response.status, 'for', args[0]);
    return response;
  });
};
```

### **Test Proxy Configuration**
```javascript
// Test if proxy is working
fetch('/api/auth/health')
  .then(res => {
    console.log('Proxy test - Status:', res.status);
    console.log('Proxy test - URL:', res.url);
    return res.json();
  })
  .then(data => console.log('Proxy test - Data:', data))
  .catch(err => console.error('Proxy test - Error:', err));
```

### **Check CORS Issues**
```javascript
// Test CORS configuration
fetch('http://localhost:5000/api/auth/health', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('✅ Direct backend access:', data))
.catch(err => console.error('❌ CORS issue:', err));
```

## Common Error Solutions

### **ECONNREFUSED Error**
```javascript
// Check if backend is running
fetch('/api/auth/health')
  .then(res => console.log('✅ Backend is running'))
  .catch(err => {
    console.error('❌ Backend not running');
    console.log('💡 Run: npm run server');
  });
```

### **404 Not Found**
```javascript
// Check if routes exist
['/api/auth/health', '/api/auth/google', '/api/debug/oauth-status'].forEach(route => {
  fetch(route)
    .then(res => console.log(`✅ ${route}: ${res.status}`))
    .catch(err => console.error(`❌ ${route}: ${err.message}`));
});
```

### **redirect_uri_mismatch**
```javascript
// Check current callback URL
fetch('/api/debug/oauth-status')
  .then(res => res.json())
  .then(config => {
    console.log('🔗 Current callback URL:', config.callbackUrl);
    console.log('💡 Make sure this matches Google Cloud Console');
  });
```

## Quick Setup Verification

```javascript
// One command to verify everything is set up correctly
(async () => {
  console.log('🔍 Verifying OAuth setup...');
  
  const checks = [
    { name: 'Backend Health', url: '/api/auth/health' },
    { name: 'OAuth Config', url: '/api/debug/oauth-status' },
    { name: 'Session Debug', url: '/api/debug/session' }
  ];
  
  for (const check of checks) {
    try {
      const response = await fetch(check.url);
      const data = await response.json();
      console.log(`✅ ${check.name}:`, data);
    } catch (err) {
      console.error(`❌ ${check.name}:`, err.message);
    }
  }
  
  console.log('🎯 Setup verification complete!');
})();
```

## Usage Instructions

1. **Open Browser Console**: Press F12 → Console tab
2. **Copy and paste** any command above
3. **Press Enter** to execute
4. **Check the output** for success/error messages

## Expected Results

- ✅ **Success**: Green checkmarks and successful responses
- ❌ **Errors**: Red X marks with error details
- 💡 **Tips**: Blue lightbulb with helpful suggestions
