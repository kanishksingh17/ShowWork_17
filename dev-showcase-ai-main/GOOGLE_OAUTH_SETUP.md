# Google OAuth Setup Guide

## Prerequisites
- Google Cloud Console account
- MongoDB running locally or MongoDB Atlas connection
- Node.js and npm installed

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Copy the Client ID and Client Secret

## Step 2: Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this

# Database
MONGO_URI=mongodb://localhost:27017/showwork

# JWT Secret
JWT_SECRET=your-jwt-secret-key-change-this

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start the Application

### Terminal 1 - Start Backend Server:
```bash
npm run server
```
You should see: "Server running on http://localhost:5000"

### Terminal 2 - Start Frontend:
```bash
npm run dev
```
You should see: "Local: http://localhost:3000/"

## Step 5: Test the Setup

1. Open http://localhost:3000 in your browser
2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected to the dashboard

## Troubleshooting

### ECONNREFUSED Error
- **Backend not running**: Make sure to run `npm run server`
- **Wrong port**: Check that backend is on port 5000 and frontend on port 3000
- **MongoDB not running**: Start MongoDB or check your connection string

### redirect_uri_mismatch Error
- Ensure the redirect URI in Google Cloud Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- Check for extra spaces or typos

### 404 Not Found
- Verify the route exists in `server.js`
- Check that the proxy configuration in `vite.config.ts` is correct

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGO_URI` in the `.env` file
- For local MongoDB: `mongodb://localhost:27017/showwork`
- For MongoDB Atlas: Use your connection string

## File Structure

```
dev-showcase-ai-main/
├── server/
│   ├── server.js          # Main server with OAuth routes
│   ├── models/
│   │   └── User.js        # User model with Google OAuth fields
│   └── routes/
│       └── auth.js        # Additional auth routes
├── src/
│   └── pages/
│       └── Login.tsx      # Login page with Google OAuth button
├── vite.config.ts         # Vite config with proxy
└── package.json           # Dependencies and scripts
```

## Security Notes

- Change all default secrets in production
- Use HTTPS in production
- Set `secure: true` for session cookies in production
- Use environment variables for all sensitive data
- Regularly rotate your Google OAuth credentials
