# 🔧 Google OAuth 404 Error - Complete Fix Guide

## 🎯 **The Problem**

You're getting a 404 error when Google tries to redirect back to your app after login. This happens when the callback URL in your Google Cloud Console doesn't exactly match what your code is using.

## ✅ **Your Current Configuration (CORRECT)**

### Backend Code (server/server.js):

```javascript
callbackURL: "http://localhost:5000/api/auth/google/callback";
```

### Frontend Code (src/pages/Login.tsx):

```javascript
window.location.href = "http://localhost:5000/api/auth/google";
```

## 🔧 **Google Cloud Console Setup (FIX THIS)**

### 1. Go to Google Cloud Console

- Visit: https://console.cloud.google.com/
- Select your project
- Go to "APIs & Services" > "Credentials"

### 2. Edit Your OAuth 2.0 Client ID

- Click on your OAuth 2.0 Client ID
- In "Authorized redirect URIs", add EXACTLY:
  ```
  http://localhost:5000/api/auth/google/callback
  ```

### 3. Remove Wrong URLs

- Remove any URLs like:
  - `http://localhost:3000/api/auth/google/callback` ❌
  - `http://localhost:3000/auth/google/callback` ❌
  - `http://localhost:5001/api/auth/google/callback` ❌

### 4. Keep Only These URLs:

```
http://localhost:5000/api/auth/google/callback
```

## 🧪 **Test Your Setup**

### 1. Start Your Servers

```powershell
cd D:\download\dev-showcase-ai-main\dev-showcase-ai-main
npm run dev:smart
```

### 2. Test the Flow

1. Go to `http://localhost:3000`
2. Click "Login"
3. Click the Google button
4. You should be redirected to Google
5. After Google login, you should be redirected back to your app

### 3. Debug Steps

If it still doesn't work:

#### Check the exact URL Google is trying to redirect to:

1. Open browser developer tools (F12)
2. Go to Network tab
3. Click Google login button
4. Look for the Google OAuth URL
5. Check the `redirect_uri` parameter in the URL

#### Verify your backend is running:

- Test: `http://localhost:5000/api/health`
- Should return: `{"status":"OK","message":"ShowWork Server is running!"}`

#### Check your backend logs:

- Look at the terminal where you ran `npm run dev:smart`
- You should see logs when the callback is hit

## 🎯 **Common Mistakes to Avoid**

### ❌ Wrong URLs in Google Console:

- `http://localhost:3000/api/auth/google/callback` (frontend port)
- `http://localhost:5001/api/auth/google/callback` (wrong port)
- `http://localhost:5000/auth/google/callback` (missing /api)

### ✅ Correct URL:

- `http://localhost:5000/api/auth/google/callback` (backend port + /api)

## 🔍 **Quick Verification**

### Your setup should look like this:

**Google Cloud Console:**

```
Authorized JavaScript origins: http://localhost:3000
Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
```

**Your Code:**

```javascript
// Frontend redirects to:
window.location.href = "http://localhost:5000/api/auth/google";

// Backend callback URL:
callbackURL: "http://localhost:5000/api/auth/google/callback";
```

## 🚀 **Final Test**

1. Update Google Cloud Console with the correct URL
2. Restart your servers: `npm run dev:smart`
3. Test the login flow
4. You should see successful redirects and no 404 errors

---

**If you're still getting 404 errors after this fix, share:**

1. The exact URL from Google Cloud Console
2. The error message you see
3. Your backend terminal logs when you try to login
