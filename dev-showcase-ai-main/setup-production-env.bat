@echo off
echo 🚀 ShowWork Production Environment Setup
echo ========================================
echo.

echo Creating production .env file...
echo.

REM Create production .env file
(
echo # ShowWork Production Environment Configuration
echo # =============================================
echo.
echo # --- DATABASES ---
echo DATABASE_URL="mongodb+srv://showwork_admin:^<password^>@cluster0.xxxxx.mongodb.net/showwork?retryWrites=true^&w=majority"
echo REDIS_URL="rediss://default:^<your-upstash-password^>@us1-upstash.io:^<port^>"
echo.
echo # --- OAUTH - GitHub ---
echo GITHUB_CLIENT_ID=^<your-github-client-id^>
echo GITHUB_CLIENT_SECRET=^<your-github-client-secret^>
echo.
echo # --- OAUTH - Google ---
echo GOOGLE_CLIENT_ID=^<your-google-client-id^>
echo GOOGLE_CLIENT_SECRET=^<your-google-client-secret^>
echo.
echo # --- SERVER CONFIG ---
echo PORT=5001
echo NODE_ENV=production
echo JWT_SECRET=^<generate-random-secret^>
echo SESSION_SECRET=^<generate-random-secret^>
echo FRONTEND_URL=https://showwork-frontend.onrender.com
echo BACKEND_URL=https://showwork-backend.onrender.com
echo.
echo # --- AI CONFIGURATION ---
echo OPENAI_API_KEY=^<your-openai-api-key^>
echo.
echo # --- CORS CONFIG ---
echo CORS_ORIGIN=https://showwork-frontend.onrender.com
echo.
echo # --- PRODUCTION SETTINGS ---
echo DEBUG=false
echo LOG_LEVEL=info
) > .env.production

echo ✅ Production .env template created!
echo.
echo 🔧 Next steps:
echo 1. Fill in your actual credentials in .env.production
echo 2. Test your connections locally
echo 3. Deploy to Render
echo.
pause
