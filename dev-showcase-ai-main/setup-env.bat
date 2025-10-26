@echo off
echo Setting up ShowWork Environment Variables...
echo ==========================================

echo.
echo This script will help you set up the required OAuth credentials.
echo.

echo Step 1: Google OAuth Setup
echo --------------------------
echo 1. Go to: https://console.cloud.google.com/apis/credentials
echo 2. Create a new OAuth 2.0 Client ID
echo 3. Set Authorized redirect URIs to: http://localhost:5001/api/auth/google/callback
echo 4. Copy the Client ID and Client Secret
echo.

set /p GOOGLE_CLIENT_ID="Enter your Google Client ID: "
set /p GOOGLE_CLIENT_SECRET="Enter your Google Client Secret: "

echo.
echo Step 2: GitHub OAuth Setup
echo --------------------------
echo 1. Go to: https://github.com/settings/developers
echo 2. Create a new OAuth App
echo 3. Set Authorization callback URL to: http://localhost:5001/api/auth/github/callback
echo 4. Copy the Client ID and Client Secret
echo.

set /p GITHUB_CLIENT_ID="Enter your GitHub Client ID: "
set /p GITHUB_CLIENT_SECRET="Enter your GitHub Client Secret: "

echo.
echo Creating environment file...
echo.

REM Create .env file with the provided credentials
(
echo # ShowWork Environment Configuration
echo # ==================================
echo.
echo # General Configuration
echo NODE_ENV=development
echo PORT=5001
echo SESSION_SECRET=showwork_super_secret_session_key_2024_change_this_in_production
echo JWT_SECRET=showwork_jwt_secret_key_2024_change_this_in_production
echo.
echo # Database Configuration
echo MONGO_URI=mongodb://admin:password123@mongodb:27017/showwork?authSource=admin
echo MONGO_URL=mongodb://admin:password123@mongodb:27017/showwork?authSource=admin
echo.
echo # OAuth Credentials
echo GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%
echo GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%
echo GITHUB_CLIENT_ID=%GITHUB_CLIENT_ID%
echo GITHUB_CLIENT_SECRET=%GITHUB_CLIENT_SECRET%
echo.
echo # Application URLs
echo FRONTEND_URL=http://localhost:3000
echo BACKEND_URL=http://localhost:5001
echo VITE_API_URL=http://localhost:5001
echo CORS_ORIGIN=http://localhost:3000
echo.
echo # Development Settings
echo DEBUG=true
echo LOG_LEVEL=debug
) > .env

echo.
echo Environment file created successfully!
echo.
echo Next steps:
echo 1. Make sure Docker Desktop is running
echo 2. Run: docker-compose up --build -d
echo 3. Check logs: docker-compose logs -f
echo.
pause
