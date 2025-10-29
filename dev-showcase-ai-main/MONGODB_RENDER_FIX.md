# 🔧 MongoDB Connection Fix for Render Deployment

## ❌ Current Issue
Render logs show: `MongooseServerSelectionError: Could not connect to any servers`

## ✅ Root Cause
The MongoDB connection in `server.js` was missing proper TLS configuration for MongoDB Atlas.

## 🛠️ Fix Applied
Updated `server/server.js` to include proper MongoDB Atlas connection options:

```javascript
mongoose.connect(MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  serverSelectionTimeoutMS: 5000,
})
```

## 📋 Step-by-Step Render Deployment Fix

### Step 1: Verify Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
2. Click **Database** → **Connect** → **Connect your application**
3. Select **Node.js** driver
4. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/showwork?retryWrites=true&w=majority
   ```

### Step 2: Update Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your **showwork-backend** service
3. Go to **Environment** tab
4. Update the `MONGO_URI` variable:

   ```
   MONGO_URI=mongodb+srv://kanishk7427_db_user:YOUR_ACTUAL_PASSWORD@cluster0.a54zqyl.mongodb.net/showwork?retryWrites=true&w=majority
   ```

   ⚠️ **Important**: Replace `YOUR_ACTUAL_PASSWORD` with your actual database user password

### Step 3: Verify Other Required Environment Variables

Make sure these are set in Render:

```bash
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

### Step 4: Redeploy Your Service

1. In Render Dashboard → **showwork-backend**
2. Click **Manual Deploy** → **Clear Build Cache & Deploy**
3. Wait for deployment to complete

### Step 5: Verify Success

After deployment, check the logs. You should see:

```
✅ MongoDB Atlas detected - using TLS (MongoDB Driver v6+)
✅ Connected to MongoDB
🚀 Server running on port 10000
🌐 Environment: production
```

### Step 6: Test the Health Endpoint

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

## 🔍 Troubleshooting

### If Still Getting Connection Errors:

1. **Check MongoDB Atlas IP Whitelist**:
   - Go to Atlas → Network Access
   - Add `0.0.0.0/0` (allow all IPs) for testing
   - Or add Render's IP ranges

2. **Verify Database User Permissions**:
   - Go to Atlas → Database Access
   - Ensure user has "Read and write to any database" role

3. **Check Connection String Format**:
   - Must use `mongodb+srv://` format
   - No spaces or extra characters
   - Password must be URL-encoded if it contains special characters

4. **Test Connection String Locally**:
   ```bash
   node test-mongodb-connection.mjs
   ```

## 🚀 Next Steps After Fix

Once MongoDB is connected:

1. **Deploy Frontend**: Deploy your frontend to Render
2. **Test OAuth**: Verify Google/GitHub OAuth works
3. **Test APIs**: Test all API endpoints
4. **Monitor Logs**: Watch for any other issues

## 📞 Need Help?

If you're still having issues, share:
1. Your masked `MONGO_URI` (hide password)
2. Render deployment logs
3. Any error messages

The fix has been applied to your codebase and pushed to GitHub! 🎉
