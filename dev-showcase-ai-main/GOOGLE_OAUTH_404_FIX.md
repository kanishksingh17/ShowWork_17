# 🔧 Google OAuth 404 Error - Complete Fix

## 🎯 **The Problem**

You're getting a 404 error when Google tries to redirect back to your app. This means Google is redirecting to a URL that doesn't exist on your server.

## 🔍 **Root Cause Analysis**

The 404 error happens because:

1. **Google Cloud Console has wrong redirect URI**
2. **Your backend callback route doesn't exist**
3. **Port mismatch between what Google expects vs what your server runs on**

## ✅ **Step-by-Step Fix**

### 1. **Check Your Google Cloud Console**

Go to: https://console.cloud.google.com/apis/credentials

**Make sure you have EXACTLY this URL:**

```
http://localhost:5000/api/auth/google/callback
```

**Remove any of these WRONG URLs:**

- ❌ `http://localhost:3000/api/auth/google/callback`
- ❌ `http://localhost:5001/api/auth/google/callback`
- ❌ `http://localhost:5000/auth/google/callback` (missing /api)

### 2. **Verify Your Backend Route Exists**

Your backend should have this route:

```javascript
app.get('/api/auth/google/callback', ...)
```

### 3. **Test the Callback URL Directly**

Open this URL in your browser:

```
http://localhost:5000/api/auth/google/callback
```

**Expected Results:**

- ✅ Should redirect to Google OAuth (if no auth code)
- ❌ 404 error = route doesn't exist

### 4. **Check Your Server Logs**

When you click the Google login button, check your terminal where the server is running. You should see:

```
Google OAuth initiated
Client ID: Set
```

If you don't see these logs, the OAuth initiation isn't working.

## 🚀 **Quick Test Commands**

### Test 1: Check if callback route exists

```bash
curl http://localhost:5000/api/auth/google/callback
```

### Test 2: Check OAuth initiation

```bash
curl http://localhost:5000/api/auth/google
```

### Test 3: Check server health

```bash
curl http://localhost:5000/api/health
```

## 🔧 **Common Fixes**

### Fix 1: Update Google Cloud Console

1. Go to Google Cloud Console
2. Edit your OAuth 2.0 Client ID
3. Set "Authorized redirect URIs" to:
   ```
   http://localhost:5000/api/auth/google/callback
   ```
4. Save changes

### Fix 2: Restart Your Servers

```powershell
# Stop current servers (Ctrl+C in terminal)
# Then restart:
npm run dev:smart
```

### Fix 3: Check Your Backend Code

Make sure your `server/server.js` has:

```javascript
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    failureMessage: true,
  }),
  async (req, res) => {
    // Handle successful OAuth
    res.redirect("http://localhost:3000/dashboard");
  },
);
```

## 🧪 **Debug Steps**

### 1. Test the OAuth Flow Manually

1. Go to `http://localhost:3000`
2. Click "Login" → Google button
3. Check browser developer tools (F12) → Network tab
4. Look for the redirect to Google
5. After Google login, check what URL it redirects back to

### 2. Check Server Logs

Look at your terminal where the server is running. You should see:

```
Google OAuth initiated
Google OAuth callback received
```

### 3. Test Individual Components

- ✅ Backend health: `http://localhost:5000/api/health`
- ✅ OAuth start: `http://localhost:5000/api/auth/google`
- ❌ Callback: `http://localhost:5000/api/auth/google/callback` (should redirect to Google)

## 🎯 **Expected Working Flow**

1. **User clicks Google login** → Frontend redirects to `http://localhost:5000/api/auth/google`
2. **Backend redirects to Google** → User sees Google OAuth page
3. **User authorizes** → Google redirects to `http://localhost:5000/api/auth/google/callback`
4. **Backend processes callback** → Redirects user to `http://localhost:3000/dashboard`

## 🚨 **If Still Getting 404**

The issue is most likely in your **Google Cloud Console configuration**. Double-check that you have the exact URL:

```
http://localhost:5000/api/auth/google/callback
```

**No extra spaces, no typos, exact match!**
