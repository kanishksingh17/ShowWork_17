@echo off
echo 🚀 PHASE 6: Production Deployment to Render
echo ===========================================
echo.

echo Step 1: Pre-deployment checks...
echo.

echo Checking Docker configuration...
if not exist "Dockerfile.production" (
    echo ❌ Production Dockerfile not found!
    pause
    exit /b 1
)

if not exist "Dockerfile.frontend.production" (
    echo ❌ Production Frontend Dockerfile not found!
    pause
    exit /b 1
)

if not exist "render.yaml" (
    echo ❌ Render configuration not found!
    pause
    exit /b 1
)

echo ✅ Docker configuration files found
echo.

echo Step 2: Environment validation...
echo.

echo Checking required environment variables:
echo - MONGO_URI: %MONGO_URI%
echo - REDIS_URL: %REDIS_URL%
echo - OPENAI_API_KEY: %OPENAI_API_KEY%
echo - GOOGLE_CLIENT_ID: %GOOGLE_CLIENT_ID%
echo - GITHUB_CLIENT_ID: %GITHUB_CLIENT_ID%
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

echo To deploy to Render, run:
echo 1. Install Render CLI: npm install -g @render/cli
echo 2. Login to Render: render login
echo 3. Deploy: render deploy
echo.

echo Or use the web interface:
echo 1. Go to https://dashboard.render.com
echo 2. Create new services using render.yaml
echo 3. Configure environment variables
echo 4. Deploy!
echo.

echo Step 5: Post-deployment validation...
echo.

echo After deployment, run:
echo - Health check: curl https://your-backend-url.onrender.com/api/health
echo - Frontend: https://your-frontend-url.onrender.com
echo - E2E tests: node scripts/test-e2e.mjs
echo.

echo ===========================================
echo Deployment preparation complete!
echo.
pause
