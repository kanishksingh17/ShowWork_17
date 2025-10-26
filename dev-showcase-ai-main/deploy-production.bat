@echo off
echo 🚀 ShowWork Production Deployment
echo ==================================
echo.

echo Step 1: Checking prerequisites...
echo.

REM Check if render CLI is installed
render --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Render CLI not found. Installing...
    npm install -g render-cli
)

echo ✅ Render CLI ready
echo.

echo Step 2: Preparing production environment...
echo.

REM Check if .env.production exists
if not exist ".env.production" (
    echo ⚠️ .env.production not found. Creating from template...
    copy .env.production.example .env.production
    echo.
    echo 🔧 Please edit .env.production with your production values:
    echo - OAuth credentials (Google & GitHub)
    echo - Database connection strings
    echo - API keys
    echo.
    pause
)

echo ✅ Environment configuration ready
echo.

echo Step 3: Building production images...
echo.

echo Building backend image...
docker build -f Dockerfile.production -t showwork-backend:production .

echo Building frontend image...
docker build -f Dockerfile.frontend.production -t showwork-frontend:production .

echo.
echo ✅ Production images built successfully
echo.

echo Step 4: Deploying to Render...
echo.

echo To deploy to Render, you have two options:
echo.
echo Option A: Use Render Dashboard (Recommended)
echo 1. Go to https://dashboard.render.com
echo 2. Create new services using render.yaml
echo 3. Configure environment variables
echo 4. Deploy!
echo.

echo Option B: Use Render CLI
echo 1. Login: render login
echo 2. Deploy: render deploy
echo.

echo Step 5: Post-deployment validation...
echo.

echo After deployment, run:
echo node test-production-health.mjs
echo.

echo ==================================
echo Deployment preparation complete!
echo.
pause
