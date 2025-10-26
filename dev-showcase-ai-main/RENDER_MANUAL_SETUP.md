# 🚀 Render Manual Setup Guide

## Step-by-Step Render Deployment

### 1. Create Render Account
- Go to https://dashboard.render.com
- Sign up with GitHub
- Connect your repository

### 2. Create Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: showwork-backend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.production
   Plan: Free
   ```

### 3. Create Frontend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   ```
   Name: showwork-frontend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.frontend.production
   Plan: Free
   ```

### 4. Set Environment Variables

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=5001
DATABASE_URL=mongodb+srv://<user>:<password>@cluster0.abcd.mongodb.net/showwork?retryWrites=true&w=majority
REDIS_URL=rediss://default:<password>@apn1-upstash.io:12345
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
JWT_SECRET=your-jwt-secret-here
SESSION_SECRET=your-session-secret-here
CORS_ORIGIN=https://showwork-frontend.onrender.com
```

#### Frontend Environment Variables:
```
NODE_ENV=production
VITE_API_URL=https://showwork-backend.onrender.com
FRONTEND_URL=https://showwork-frontend.onrender.com
```

### 5. Create Workers
1. Create Worker Service for publish-worker
2. Create Worker Service for analytics-worker
3. Use same environment variables as backend

### 6. Deploy and Test
After deployment:
- Frontend: https://showwork-frontend.onrender.com
- Backend: https://showwork-backend.onrender.com

Test with:
```bash
curl https://showwork-backend.onrender.com/api/health
```

## 🎯 Expected Results:
- ✅ Backend health check returns 200
- ✅ Frontend loads without errors
- ✅ OAuth authentication works
- ✅ Database connections successful
- ✅ Redis queues processing jobs
