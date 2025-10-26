# 🔐 OAuth Credentials Setup Checklist

## ✅ Complete OAuth Setup Checklist

### **Google OAuth Setup**
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create new project named "ShowWork"
- [ ] Enable OAuth consent screen (External)
- [ ] Configure OAuth consent screen:
  - App Name: ShowWork
  - User Support Email: Your email
  - Authorized Domain: onrender.com
- [ ] Create OAuth client ID:
  - Application type: Web Application
  - Name: ShowWork Web
  - Authorized redirect URIs:
    - `https://showwork-backend.onrender.com/api/auth/google/callback`
    - `http://localhost:5001/api/auth/google/callback`
- [ ] Copy Client ID and Client Secret

### **GitHub OAuth Setup**
- [ ] Go to https://github.com/settings/developers
- [ ] Click "New OAuth App"
- [ ] Configure OAuth app:
  - Application Name: ShowWork
  - Homepage URL: https://showwork-frontend.onrender.com
  - Authorization callback URL:
    - `https://showwork-backend.onrender.com/api/auth/github/callback`
    - `http://localhost:5001/api/auth/github/callback`
- [ ] Copy Client ID and Client Secret

### **Testing**
- [ ] Run OAuth test: `node test-oauth-credentials.mjs <google-client-id> <google-client-secret> <github-client-id> <github-client-secret>`
- [ ] Verify Google OAuth endpoint accessible
- [ ] Verify GitHub OAuth endpoint accessible
- [ ] Verify callback URLs configured correctly

## 🎯 **Expected Results:**
- ✅ Google OAuth app created and configured
- ✅ GitHub OAuth app created and configured
- ✅ All callback URLs properly set
- ✅ OAuth credentials ready for production

## 📝 **Save This Information:**
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

## 🔧 **Troubleshooting:**
- **Google OAuth issues**: Check OAuth consent screen configuration
- **GitHub OAuth issues**: Verify callback URLs match exactly
- **Authentication failed**: Double-check client secrets
- **Redirect URI errors**: Ensure URLs are exactly as specified

## 🚀 **What OAuth Powers in ShowWork:**
- **User Authentication**: Secure login with Google and GitHub
- **Profile Integration**: Access user profile information
- **Social Features**: Connect with social media platforms
- **AI Personalization**: Personalized AI content based on user profile

## 🔐 **Security Best Practices:**
- Keep OAuth credentials secure
- Use environment variables in production
- Never commit credentials to version control
- Rotate secrets regularly
- Monitor OAuth usage and access
