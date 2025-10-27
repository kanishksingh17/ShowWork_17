# ShowWork Startup Guide

## 🚀 Quick Start Checklist

### Prerequisites Verification

- [ ] Node.js v18+ installed (`node --version`)
- [ ] MongoDB running (`mongod --version`)
- [ ] Git installed (`git --version`)
- [ ] OAuth credentials obtained

### 1. Project Setup

```bash
# Clone repository
git clone <repository-url>
cd dev-showcase-ai-main

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.development .env

# Edit .env file with your credentials
# Required variables:
# - MONGO_URI
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET
# - SESSION_SECRET
```

### 3. Database Setup

```bash
# Start MongoDB (if not running)
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod

# Verify connection
mongosh --eval "db.runCommand('ping')"
```

### 4. OAuth Setup

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5001/api/auth/google/callback`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:5001/api/auth/github/callback`

### 5. Start Development Servers

#### Option A: Automated Start (Recommended)

```bash
# Windows - Double-click or run:
start-all.bat

# PowerShell - Run:
.\start-servers.ps1
```

#### Option B: Manual Start

```bash
# Terminal 1 - Backend Server
cd server
node server.js

# Terminal 2 - Frontend Server
npm run dev
```

### 6. Verification Steps

#### Check Backend Server

```bash
# Test backend health
curl http://localhost:5001/api/portfolio/profile
# Expected: 401 Unauthorized (normal for unauthenticated request)
```

#### Check Frontend Server

```bash
# Open browser to:
http://localhost:3000
# Expected: Landing page loads
```

#### Test OAuth Flow

1. Go to http://localhost:3000/login
2. Click "Google" button
3. Should redirect to Google OAuth
4. Select account
5. Should redirect back to profile setup

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :5001

# Kill processes if needed
taskkill /PID <process_id> /F
```

#### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Start MongoDB service
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

#### OAuth Errors

- Verify callback URLs match exactly
- Check client ID and secret are correct
- Ensure OAuth apps are properly configured
- Check network connectivity

#### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or on Windows:
rmdir /s node_modules
del package-lock.json
npm install
```

### Debug Commands

#### Check Server Status

```bash
# Backend health check
curl -v http://localhost:5001/api/portfolio/profile

# Frontend accessibility
curl -v http://localhost:3000
```

#### Database Connection Test

```bash
# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/showwork')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
"
```

#### Environment Variables Check

```bash
# Check if environment variables are loaded
node -e "console.log('MONGO_URI:', process.env.MONGO_URI)"
```

## 📊 Performance Monitoring

### Server Metrics

- **Backend Response Time:** < 200ms average
- **Frontend Load Time:** < 2s initial load
- **Database Queries:** < 100ms average
- **Memory Usage:** Monitor with `htop` or Task Manager

### Optimization Tips

- Use `npm run build` for production builds
- Enable gzip compression on web server
- Use MongoDB Atlas for production database
- Implement Redis for session storage in production

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Environment variables configured for production
- [ ] OAuth callback URLs updated for production domain
- [ ] Database connection string updated
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] CDN setup (optional)

### Deployment Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to hosting platform
# (Follow platform-specific instructions)
```

## 📝 Development Workflow

### Daily Development

1. Start MongoDB
2. Run `start-all.bat` or `.\start-servers.ps1`
3. Open http://localhost:3000
4. Make changes and test
5. Use browser dev tools for debugging

### Code Changes

- Frontend changes: Hot reload automatically
- Backend changes: Restart server manually
- Database changes: Restart server to apply schema changes

### Testing Flow

1. **New User Flow:**
   - Landing → Login → OAuth → Profile Setup → Dashboard
2. **Existing User Flow:**
   - Landing → Login → OAuth → Dashboard (skip profile setup)
3. **Error Scenarios:**
   - Network failures, OAuth errors, validation errors

## 🛠️ Development Tools

### Recommended Extensions (VS Code)

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- REST Client

### Browser Extensions

- React Developer Tools
- Redux DevTools
- Network monitoring tools

## 📚 Additional Resources

### Documentation

- [FLOW_DOCUMENTATION.md](./FLOW_DOCUMENTATION.md) - Complete user flow
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Backend API reference

### Support

- Check console logs for errors
- Use browser dev tools for frontend debugging
- Monitor network requests in browser
- Check server logs in terminal

### Performance Tips

- Use React DevTools Profiler
- Monitor bundle size with `npm run build`
- Check database query performance
- Optimize images and assets

## ✅ Success Indicators

### Everything Working Correctly

- [ ] Both servers start without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5001
- [ ] OAuth flows work for Google and GitHub
- [ ] Profile setup appears for new users
- [ ] Dashboard loads for existing users
- [ ] Database operations work correctly
- [ ] No console errors in browser
- [ ] No errors in server terminal

### Ready for Production

- [ ] All environment variables configured
- [ ] OAuth credentials for production domain
- [ ] Database connection to production database
- [ ] SSL certificates configured
- [ ] Domain DNS properly configured
- [ ] Performance optimizations applied
- [ ] Security measures implemented


