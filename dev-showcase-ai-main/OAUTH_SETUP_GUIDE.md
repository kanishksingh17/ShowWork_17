# OAuth Setup Guide - Fix Google 404 Error

## 🚨 Current Issue

Google OAuth is showing 404 error because OAuth credentials are not configured.

## 🔧 Quick Fix Steps

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Name it "ShowWork Development"

#### Step 2: Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click "Enable"

#### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "ShowWork Development"
5. Authorized redirect URIs:
   ```
   http://localhost:5001/api/auth/google/callback
   ```
6. Click "Create"
7. Copy the Client ID and Client Secret

### 2. GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Application name: "ShowWork Development"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:5001/api/auth/github/callback`
6. Click "Register application"
7. Copy the Client ID and Client Secret

### 3. Environment Configuration

Create a `.env` file in your project root with these variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/showwork

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret

# Session & Security
SESSION_SECRET=your_super_secret_session_key_change_this
JWT_SECRET=your_jwt_secret_key_change_this

# Server Configuration
PORT=5001
NODE_ENV=development
```

### 4. Restart Servers

After updating the `.env` file:

```bash
# Stop current servers (Ctrl+C in both terminals)
# Then restart:

# Option 1: Use batch file
.\start-all.bat

# Option 2: Manual start
# Terminal 1: Backend
cd server && node server.js
# Terminal 2: Frontend
npm run dev
```

## ✅ Verification Steps

### 1. Check Environment Variables

The server should show:

```
✅ Present variables: [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'SESSION_SECRET',
  'MONGO_URI',
  'PORT',
  'JWT_SECRET'
]
```

### 2. Test OAuth URLs

- **Google OAuth:** http://localhost:5001/api/auth/google
- **GitHub OAuth:** http://localhost:5001/api/auth/github

### 3. Test Complete Flow

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign In"
3. Click "Google" button → Should redirect to Google OAuth (not 404)
4. Select Google account → Should redirect back to profile setup
5. Complete profile setup → Should redirect to dashboard

## 🚨 Common Issues & Solutions

### Issue 1: Still Getting 404

**Solution:**

- Double-check the Client ID and Secret
- Ensure redirect URI is exactly: `http://localhost:5001/api/auth/google/callback`
- Make sure Google+ API is enabled

### Issue 2: "Invalid Client" Error

**Solution:**

- Check that Client ID and Secret are correct
- Ensure the OAuth app is published (not in draft mode)

### Issue 3: "Redirect URI Mismatch"

**Solution:**

- Add the exact redirect URI in Google Cloud Console
- URI must be: `http://localhost:5001/api/auth/google/callback`

### Issue 4: Environment Variables Not Loading

**Solution:**

- Make sure `.env` file is in the project root (not in server folder)
- Restart the server after updating `.env`
- Check that there are no spaces around the `=` sign

## 📋 Quick Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI added: `http://localhost:5001/api/auth/google/callback`
- [ ] GitHub OAuth app created
- [ ] Redirect URI added: `http://localhost:5001/api/auth/github/callback`
- [ ] `.env` file created with correct credentials
- [ ] Servers restarted
- [ ] OAuth URLs tested (no 404 errors)
- [ ] Complete flow tested

## 🎯 Expected Result

After proper configuration:

1. **Google OAuth:** Should redirect to Google account selection (not 404)
2. **GitHub OAuth:** Should redirect to GitHub authorization (not 404)
3. **Profile Setup:** Should appear for new users
4. **Dashboard:** Should load for existing users

## 📞 Need Help?

If you're still getting errors:

1. Check the server console for error messages
2. Verify all environment variables are set correctly
3. Test the OAuth URLs directly in browser
4. Check Google Cloud Console for any restrictions
5. Ensure MongoDB is running



