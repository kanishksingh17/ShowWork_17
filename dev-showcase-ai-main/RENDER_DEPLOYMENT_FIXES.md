# 🚀 Complete Render Deployment Fix Guide

## ❌ Common Issues Fixed

### 1️⃣ 502 "Bad Gateway" Error
**Root Cause:** Frontend trying to reach backend via localhost/relative URLs

### 2️⃣ Hero Section / Login Page Missing
**Root Cause:** Frontend routing issues and missing API configuration

### 3️⃣ GitHub / Google Login Failing
**Root Cause:** OAuth redirect URLs not configured for production domains

## ✅ Fixes Applied

### 🔧 1. Created Centralized API Client
- ✅ Created `src/lib/apiClient.ts` for centralized API calls
- ✅ Handles environment-specific URLs automatically
- ✅ Supports both Vite and Next.js environment variables
- ✅ Includes proper error handling and logging

### 🔧 2. Updated Environment Variables
- ✅ Added `VITE_API_BASE_URL` for Vite-based frontend
- ✅ Added `NEXT_PUBLIC_API_URL` for Next.js compatibility
- ✅ Added `VITE_APP_URL` for frontend URL configuration
- ✅ Updated `render.yaml` with correct environment variables

### 🔧 3. Fixed OAuth Configuration
- ✅ Updated OAuth redirect URIs for production
- ✅ Configured CORS for frontend-backend communication

## 📋 Step-by-Step Deployment Fix

### Step 1: Update Frontend Code to Use API Client

Replace all direct API calls with the centralized client:

**Before:**
```typescript
fetch('/api/portfolio/check-username/' + username)
```

**After:**
```typescript
import { apiJson } from '../lib/apiClient';
apiJson(`/api/portfolio/check-username/${username}`)
```

### Step 2: Set Environment Variables in Render

#### Frontend Service (showwork-frontend):
```
NODE_ENV=production
VITE_API_BASE_URL=https://showwork-backend.onrender.com
NEXT_PUBLIC_API_URL=https://showwork-backend.onrender.com
VITE_APP_URL=https://showwork-frontend.onrender.com
```

#### Backend Service (showwork-backend):
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://kanishk7427_db_user:YOUR_PASSWORD@cluster0.a54zqyl.mongodb.net/showwork?retryWrites=true&w=majority
REDIS_URL=your-upstash-redis-url
SESSION_SECRET=your-secure-session-secret
JWT_SECRET=your-secure-jwt-secret
CORS_ORIGIN=https://showwork-frontend.onrender.com
FRONTEND_URL=https://showwork-frontend.onrender.com
BACKEND_URL=https://showwork-backend.onrender.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Step 3: Configure OAuth Providers

#### Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   ```
   https://showwork-backend.onrender.com/api/auth/google/callback
   ```
5. Add authorized JavaScript origins:
   ```
   https://showwork-frontend.onrender.com
   ```

#### GitHub Developer Settings:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Set Authorization callback URL:
   ```
   https://showwork-backend.onrender.com/api/auth/github/callback
   ```
4. Set Homepage URL:
   ```
   https://showwork-frontend.onrender.com
   ```

### Step 4: Deploy Services

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Render deployment - add API client and environment variables"
   git push origin main
   ```

2. **Render will auto-deploy** both services

3. **Or manually deploy:**
   - Backend: Render Dashboard → showwork-backend → Manual Deploy
   - Frontend: Render Dashboard → showwork-frontend → Manual Deploy

### Step 5: Verify Deployment

#### Check Backend Health:
```bash
curl https://showwork-backend.onrender.com/api/health
```
Expected response:
```json
{
  "status": "ok",
  "environment": "production",
  "database": "connected"
}
```

#### Check Frontend:
1. Visit: `https://showwork-frontend.onrender.com`
2. Should see hero section with login options
3. No 502 errors in browser console

#### Test OAuth:
1. Click "Get Started" or "Login"
2. Try Google/GitHub login
3. Should redirect to backend and back to frontend

## 🔍 Troubleshooting

### If Still Getting 502 Errors:
1. **Check API calls in browser console:**
   - Look for requests to `localhost:5001` or relative URLs
   - Should see requests to `https://showwork-backend.onrender.com`

2. **Verify environment variables:**
   - Check Render Dashboard → Environment tab
   - Ensure `VITE_API_BASE_URL` is set correctly

3. **Check backend logs:**
   - Look for CORS errors
   - Verify backend is running on correct port

### If Hero/Login Page Missing:
1. **Check frontend routing:**
   - Ensure `/` route exists and renders hero section
   - Check for early redirects based on auth state

2. **Check build process:**
   - Verify `npm run build` completes successfully
   - Check for TypeScript/compilation errors

### If OAuth Fails:
1. **Check redirect URIs:**
   - Must match exactly in Google/GitHub settings
   - Include `https://` and correct domain

2. **Check backend OAuth routes:**
   - Verify `/api/auth/google/callback` exists
   - Check for CORS configuration

## 🎯 Expected Final Result

After successful deployment:
- ✅ **Frontend:** `https://showwork-frontend.onrender.com` (hero page loads)
- ✅ **Backend:** `https://showwork-backend.onrender.com` (health check passes)
- ✅ **OAuth:** Google/GitHub login works
- ✅ **API:** Frontend can communicate with backend
- ✅ **Dashboard:** Protected routes work after authentication

## 📞 Need Help?

If you're still having issues:
1. Share your Render deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test API endpoints individually

The fixes have been applied and pushed to GitHub! 🎉
