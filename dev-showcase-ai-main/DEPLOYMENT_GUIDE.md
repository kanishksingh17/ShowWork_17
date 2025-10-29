# 🚀 ShowWork Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Step 1: Generate Secure Secrets

**Windows (PowerShell):**
```powershell
.\scripts\generate-secrets.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh
```

**Or manually:**
```bash
openssl rand -base64 32  # For SESSION_SECRET
openssl rand -base64 32  # For JWT_SECRET
```

### ✅ Step 2: Set Up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Choose region: `us-west-2` (Oregon) or closest to your users
4. Copy the connection URL format:
   ```
   rediss://default:<PASSWORD>@<INSTANCE>.upstash.io:6379
   ```
5. Add to Render environment variables as `REDIS_URL`

### ✅ Step 3: Configure MongoDB Atlas

1. Ensure your MongoDB Atlas cluster is running
2. Whitelist Render IPs: `0.0.0.0/0` (or specific Render IPs)
3. Copy your connection string:
   ```
   mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.a54zqyl.mongodb.net/showwork?retryWrites=true&w=majority
   ```
4. URL-encode password if it contains special characters
5. Add to Render environment variables as `MONGO_URI`

### ✅ Step 4: Configure OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Authorized redirect URIs:
   ```
   https://showwork-backend.onrender.com/api/auth/google/callback
   ```
4. Copy `Client ID` and `Client Secret`
5. Add to Render environment variables

#### GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Authorization callback URL:
   ```
   https://showwork-backend.onrender.com/api/auth/github/callback
   ```
4. Copy `Client ID` and `Client Secret`
5. Add to Render environment variables

### ✅ Step 5: Prepare Environment Variables

Create your `.env.production` file (DO NOT COMMIT IT):

```bash
cp env.production.template .env.production
# Edit .env.production with your actual values
```

**Required Environment Variables for Render:**

| Variable | Source | Description |
|----------|--------|-------------|
| `NODE_ENV` | Set to `production` | Environment mode |
| `PORT` | Set to `10000` | Server port |
| `MONGO_URI` | MongoDB Atlas | Database connection |
| `REDIS_URL` | Upstash | Redis connection |
| `SESSION_SECRET` | Generated | Session encryption |
| `JWT_SECRET` | Generated | JWT token signing |
| `CORS_ORIGIN` | Set to frontend URL | Allowed origins |
| `GOOGLE_CLIENT_ID` | Google Cloud | OAuth provider |
| `GOOGLE_CLIENT_SECRET` | Google Cloud | OAuth provider |
| `GITHUB_CLIENT_ID` | GitHub | OAuth provider |
| `GITHUB_CLIENT_SECRET` | GitHub | OAuth provider |
| `OPENAI_API_KEY` | OpenAI | AI service (optional) |

## Deployment Steps

### Step 1: Commit Your Changes

```bash
git add .
git commit -m "🔒 Production-hardened ShowWork backend ready for deployment"
git push origin main
```

### Step 2: Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Blueprint**: Click "New" → "Blueprint"
3. **Connect Repository**: Link your GitHub repository
4. **Render will detect `render.yaml`** and create all services automatically

### Step 3: Configure Environment Variables

For each service (backend, workers), add environment variables:

1. Go to your service → Environment
2. Add each variable from the table above
3. **Important**: Use `sync: false` variables from Render dashboard (not from render.yaml)

### Step 4: Verify Deployment

**Backend Health Check:**
```bash
curl https://showwork-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

**Test Authentication:**
```bash
curl https://showwork-backend.onrender.com/api/auth/google
# Should redirect to Google OAuth
```

### Step 5: Monitor Logs

1. Go to Render Dashboard → Your Service → Logs
2. Check for:
   - ✅ MongoDB connection success
   - ✅ Redis connection success
   - ✅ Server running on port 10000
   - ✅ Workers processing jobs

## Post-Deployment Verification

### ✅ Backend Service
- [ ] Health endpoint responds: `/api/health`
- [ ] Authentication endpoints work: `/api/auth/google`, `/api/auth/github`
- [ ] Protected routes require auth: `/api/portfolio/*`
- [ ] Rate limiting is active
- [ ] Security headers present (check with browser dev tools)

### ✅ Workers
- [ ] Publish worker connects to MongoDB
- [ ] Publish worker connects to Redis
- [ ] Analytics worker connects to MongoDB
- [ ] Analytics worker connects to Redis
- [ ] Workers can process jobs from queues

### ✅ Security
- [ ] HTTPS is enabled (should be automatic on Render)
- [ ] Cookies are secure (check `secure` flag)
- [ ] CORS is configured correctly
- [ ] Rate limiting is working
- [ ] No sensitive data in logs

## Troubleshooting

### Issue: Workers not connecting to Redis
**Solution**: Check `REDIS_URL` format - must use `rediss://` for Upstash TLS

### Issue: MongoDB connection fails
**Solution**: 
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string format
3. Check password URL encoding

### Issue: OAuth redirects not working
**Solution**: 
1. Update callback URLs in OAuth provider settings
2. Match exactly: `https://showwork-backend.onrender.com/api/auth/{provider}/callback`

### Issue: Rate limiting too strict
**Solution**: Adjust `RATE_LIMIT_MAX_REQUESTS` in environment variables

## Production URLs

After deployment, your services will be available at:

- **Backend**: `https://showwork-backend.onrender.com`
- **Frontend**: `https://showwork-frontend.onrender.com`
- **Health Check**: `https://showwork-backend.onrender.com/api/health`

## Support

If you encounter issues:
1. Check Render logs
2. Verify all environment variables are set
3. Test locally with production environment variables
4. Check MongoDB Atlas and Upstash dashboards for connection issues