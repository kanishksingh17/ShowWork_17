# 🚀 ShowWork Production Deployment Guide

## Phase 6: Production Deployment, Monitoring & Hardening

This guide will take you from local Docker development to a fully production-ready ShowWork application deployed on Render.

## 📋 Prerequisites

- [ ] Docker installed and running
- [ ] Render account (free tier available)
- [ ] OAuth credentials (Google & GitHub)
- [ ] OpenAI API key
- [ ] MongoDB Atlas account (or Render managed database)
- [ ] Redis instance (Render managed or external)

## 🚀 Deployment Options

### Option A: Render (Recommended)
- **Pros**: Free tier, managed databases, easy setup
- **Cons**: Limited resources on free tier
- **Best for**: MVP, small to medium applications

### Option B: Railway
- **Pros**: Simple deployment, good free tier
- **Cons**: Less control over infrastructure
- **Best for**: Quick deployment, development teams

### Option C: Fly.io
- **Pros**: Global edge deployment, good performance
- **Cons**: More complex setup
- **Best for**: Global applications, performance-critical apps

## 🛠️ Step-by-Step Deployment

### Step 1: Prepare Production Environment

1. **Set up OAuth Applications**:
   - Google Cloud Console: Create OAuth 2.0 credentials
   - GitHub: Create OAuth App
   - Update redirect URIs to production domains

2. **Get API Keys**:
   - OpenAI API key for AI content generation
   - MongoDB Atlas connection string
   - Redis connection string

3. **Configure Environment Variables**:
   ```bash
   # Copy production environment template
   cp .env.production.example .env.production
   
   # Fill in your production values
   nano .env.production
   ```

### Step 2: Deploy to Render

#### Method A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Sign up/Login with GitHub

2. **Create Services**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository with ShowWork

3. **Configure Backend Service**:
   ```
   Name: showwork-backend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.production
   Plan: Free
   ```

4. **Configure Frontend Service**:
   ```
   Name: showwork-frontend
   Environment: Docker
   Dockerfile Path: ./Dockerfile.frontend.production
   Plan: Free
   ```

5. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   CORS_ORIGIN=https://showwork-frontend.onrender.com
   ```

#### Method B: Using Render CLI

1. **Install Render CLI**:
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**:
   ```bash
   render login
   ```

3. **Deploy using render.yaml**:
   ```bash
   render deploy
   ```

### Step 3: Set Up Databases

#### MongoDB Setup

1. **Option A: Render Managed Database**:
   - Go to Render Dashboard
   - Create new MongoDB database
   - Copy connection string

2. **Option B: MongoDB Atlas**:
   - Create cluster on MongoDB Atlas
   - Whitelist Render IP addresses
   - Copy connection string

#### Redis Setup

1. **Option A: Render Redis**:
   - Create Redis instance in Render
   - Copy connection string

2. **Option B: External Redis**:
   - Use Redis Cloud or similar
   - Copy connection string

### Step 4: Configure Workers

1. **Create Worker Services**:
   - Publish Worker: `node src/lib/workers/publish-worker.js`
   - Analytics Worker: `node src/lib/workers/analytics-worker.js`

2. **Set Worker Environment Variables**:
   ```
   NODE_ENV=production
   REDIS_URL=your_redis_connection_string
   DATABASE_URL=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

### Step 5: Domain Configuration

1. **Custom Domain (Optional)**:
   - Add custom domain in Render
   - Update OAuth redirect URIs
   - Update CORS_ORIGIN environment variable

2. **SSL Certificates**:
   - Render provides free SSL certificates
   - Automatically configured for custom domains

## 🔍 Post-Deployment Validation

### Step 1: Run Production Validation

```bash
# Set production URLs
export FRONTEND_URL=https://your-frontend-url.onrender.com
export BACKEND_URL=https://your-backend-url.onrender.com

# Run validation script
node scripts/validate-production.mjs
```

### Step 2: Manual Testing

1. **Health Checks**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

2. **Frontend Access**:
   - Visit your frontend URL
   - Test OAuth login
   - Create a test project

3. **API Testing**:
   ```bash
   # Test AI generation
   curl -X POST https://your-backend-url.onrender.com/api/ai/generate \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","description":"Test project","platforms":["twitter"]}'
   ```

### Step 3: Monitor System Health

1. **Check Render Dashboard**:
   - Monitor service status
   - Check logs for errors
   - Monitor resource usage

2. **Set Up Alerts**:
   - Configure uptime monitoring
   - Set up error tracking (Sentry)
   - Monitor performance metrics

## 🔐 Security Hardening

### Step 1: Environment Security

1. **Use Strong Secrets**:
   ```bash
   # Generate secure secrets
   openssl rand -base64 32  # For JWT_SECRET
   openssl rand -base64 32  # For SESSION_SECRET
   ```

2. **Rotate API Keys**:
   - Regularly rotate OAuth credentials
   - Update API keys in production
   - Use different keys for different environments

### Step 2: Application Security

1. **Enable Security Headers**:
   - Already configured in nginx.production.conf
   - CSP, HSTS, XSS protection enabled

2. **Rate Limiting**:
   - Implement rate limiting on API endpoints
   - Monitor for suspicious activity

3. **Input Validation**:
   - Validate all user inputs
   - Sanitize data before processing

### Step 3: Infrastructure Security

1. **Container Security**:
   - Use non-root users in containers
   - Regular security updates
   - Scan for vulnerabilities

2. **Network Security**:
   - Use HTTPS everywhere
   - Restrict database access
   - Monitor network traffic

## 📊 Monitoring & Logging

### Step 1: Application Monitoring

1. **Health Checks**:
   - Automated health monitoring
   - Uptime monitoring
   - Performance metrics

2. **Error Tracking**:
   - Set up Sentry for error tracking
   - Monitor application logs
   - Alert on critical errors

### Step 2: Business Metrics

1. **User Analytics**:
   - Track user registrations
   - Monitor user engagement
   - Analyze user behavior

2. **System Metrics**:
   - API response times
   - Database performance
   - Queue processing times

## 🚨 Troubleshooting

### Common Issues

1. **Service Won't Start**:
   - Check environment variables
   - Verify Docker configuration
   - Check service logs

2. **Database Connection Issues**:
   - Verify connection string
   - Check network access
   - Ensure database is running

3. **OAuth Issues**:
   - Verify redirect URIs
   - Check OAuth credentials
   - Test OAuth flow manually

### Debug Commands

```bash
# Check service status
render services list

# View logs
render logs showwork-backend

# Check environment variables
render env list showwork-backend

# Restart service
render services restart showwork-backend
```

## 📈 Scaling Considerations

### Performance Optimization

1. **Database Optimization**:
   - Add database indexes
   - Optimize queries
   - Use connection pooling

2. **Caching Strategy**:
   - Implement Redis caching
   - Cache API responses
   - Use CDN for static assets

3. **Load Balancing**:
   - Use multiple instances
   - Implement health checks
   - Monitor resource usage

### Cost Optimization

1. **Resource Management**:
   - Monitor resource usage
   - Optimize container sizes
   - Use appropriate plans

2. **Database Optimization**:
   - Optimize queries
   - Use appropriate indexes
   - Monitor database performance

## 🎯 Success Metrics

### Technical Metrics
- [ ] All services running (frontend, backend, workers)
- [ ] Database connectivity working
- [ ] Redis queues processing jobs
- [ ] OAuth authentication working
- [ ] AI content generation working
- [ ] Analytics tracking functional

### Business Metrics
- [ ] Users can register and login
- [ ] Users can create projects
- [ ] AI content generation works
- [ ] Social media publishing works
- [ ] Analytics dashboard shows data

## 🚀 Next Steps

After successful deployment:

1. **User Testing**:
   - Invite beta users
   - Gather feedback
   - Iterate on features

2. **Marketing**:
   - Create landing page
   - Set up social media
   - Launch marketing campaigns

3. **Scaling**:
   - Monitor performance
   - Scale resources as needed
   - Plan for growth

---

**Congratulations!** 🎉 Your ShowWork application is now live and ready for users!

For support and updates, check the project documentation and community forums.