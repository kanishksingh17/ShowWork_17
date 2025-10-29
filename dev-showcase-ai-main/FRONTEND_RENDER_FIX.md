# 🎨 Frontend Deployment Fix for Render

## ❌ Current Issue
Render logs show: `serve: not found` or similar errors when trying to start the frontend.

## ✅ Root Cause
The `serve` package was in `devDependencies` but needed to be in `dependencies` for production deployment.

## 🛠️ Fix Applied

### 1. Moved `serve` to Dependencies
- ✅ Moved `serve` from `devDependencies` to `dependencies` in `package.json`
- ✅ Updated `render.yaml` to use Node.js instead of Docker for frontend

### 2. Updated Render Configuration
- ✅ Changed frontend service to use `env: node`
- ✅ Set `buildCommand: npm install && npm run build`
- ✅ Set `startCommand: npm run start:prod`

## 🚀 Deployment Options

### Option 1: Node.js with serve (Current - Recommended)
```yaml
# render.yaml
- type: web
  name: showwork-frontend
  env: node
  buildCommand: npm install && npm run build
  startCommand: npm run start:prod
```

**Pros:**
- ✅ Simple and reliable
- ✅ Uses `serve` package for static file serving
- ✅ Easy to debug and monitor

### Option 2: Docker with Nginx (Alternative)
```yaml
# render.yaml (commented out)
- type: web
  name: showwork-frontend-docker
  env: docker
  dockerfilePath: ./Dockerfile.frontend.production
```

**Pros:**
- ✅ More production-ready
- ✅ Better performance with Nginx
- ✅ More control over server configuration

## 📋 Step-by-Step Deployment

### Step 1: Verify Package.json
Your `package.json` should now have:
```json
{
  "dependencies": {
    "serve": "^14.2.5"
  },
  "scripts": {
    "build": "vite build",
    "start:prod": "serve -s dist -l 3000"
  }
}
```

### Step 2: Deploy to Render
1. **Push changes to GitHub:**
   ```bash
   git add package.json render.yaml
   git commit -m "Fix frontend deployment - move serve to dependencies"
   git push origin main
   ```

2. **Render will auto-deploy** (if auto-deploy is enabled)

3. **Or manually deploy:**
   - Go to Render Dashboard → showwork-frontend
   - Click "Manual Deploy" → "Clear Build Cache & Deploy"

### Step 3: Verify Success
After deployment, check logs for:
```
> serve -s dist -l 3000
Serving!
- Local: http://localhost:3000
- On Your Network: http://0.0.0.0:3000
```

### Step 4: Test Frontend
Visit: `https://showwork-frontend.onrender.com`

Expected result:
- ✅ Frontend loads successfully
- ✅ No console errors
- ✅ API calls work (if backend is deployed)

## 🔍 Troubleshooting

### If Still Getting "serve: not found":
1. **Check package.json:**
   - Ensure `serve` is in `dependencies`, not `devDependencies`
   - Verify version is `^14.2.5` or similar

2. **Check render.yaml:**
   - Ensure `env: node` (not `docker`)
   - Verify `startCommand: npm run start:prod`

3. **Clear Render cache:**
   - Manual Deploy → Clear Build Cache & Deploy

### If Build Fails:
1. **Check Vite build locally:**
   ```bash
   npm run build
   ```
   - Should create `dist/` folder
   - No build errors

2. **Check Node.js version:**
   - Render uses Node 18+ by default
   - Your `package.json` specifies `"node": ">=18.0.0"`

### If Frontend Loads but API Calls Fail:
1. **Check CORS configuration** in backend
2. **Verify API_BASE_URL** environment variable
3. **Check backend deployment** status

## 🎯 Expected Final Result

After successful deployment:
- ✅ Frontend: `https://showwork-frontend.onrender.com`
- ✅ Backend: `https://showwork-backend.onrender.com`
- ✅ Health check: `https://showwork-backend.onrender.com/api/health`

## 📞 Need Help?

If you're still having issues:
1. Share your Render deployment logs
2. Check if `dist/` folder exists after build
3. Verify all environment variables are set

The fix has been applied and pushed to GitHub! 🎉
