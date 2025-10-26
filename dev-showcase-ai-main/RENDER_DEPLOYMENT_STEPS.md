# 🚀 Render Deployment Steps

## Quick Production Deployment Guide

### Step 1: Create Render Account
1. Go to https://dashboard.render.com
2. Sign up with GitHub
3. Connect your repository

### Step 2: Create Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: showwork-backend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.production
   Plan: Free
   ```

### Step 3: Create Frontend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: showwork-frontend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.frontend.production
   Plan: Free
   ```

### Step 4: Set Environment Variables

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=5001
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/showwork
REDIS_URL=redis://username:password@redis-host:6379
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
CORS_ORIGIN=https://showwork-frontend.onrender.com
```

#### Frontend Environment Variables:
```
NODE_ENV=production
VITE_API_URL=https://showwork-backend.onrender.com
FRONTEND_URL=https://showwork-frontend.onrender.com
```

### Step 5: Create Database
1. Click "New +" → "Database"
2. Choose MongoDB
3. Plan: Free
4. Copy connection string to DATABASE_URL

### Step 6: Create Redis
1. Click "New +" → "Redis"
2. Plan: Free
3. Copy connection string to REDIS_URL

### Step 7: Deploy Workers
1. Create Worker Service for publish-worker
2. Create Worker Service for analytics-worker
3. Use same environment variables as backend

### Step 8: Test Deployment
After deployment, your URLs will be:
- Frontend: https://showwork-frontend.onrender.com
- Backend: https://showwork-backend.onrender.com

Test with:
```bash
curl https://showwork-backend.onrender.com/api/health
```

## 🔧 Troubleshooting

### Common Issues:
1. **Build Failures**: Check Dockerfile paths
2. **Environment Variables**: Ensure all required vars are set
3. **Database Connection**: Verify MongoDB connection string
4. **Redis Connection**: Verify Redis connection string

### Debug Commands:
```bash
# Check service logs in Render dashboard
# Monitor resource usage
# Check environment variables
```

## 🎯 Success Criteria:
- ✅ Backend health check returns 200
- ✅ Frontend loads without errors
- ✅ OAuth authentication works
- ✅ Database connections successful
- ✅ Redis queues processing jobs
