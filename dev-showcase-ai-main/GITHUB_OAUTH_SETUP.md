# 🐙 GitHub OAuth Setup Guide

## Step-by-Step GitHub OAuth Configuration

### **1. Create GitHub OAuth App**
- [ ] Go to https://github.com/settings/developers
- [ ] Click "New OAuth App"
- [ ] Fill in the form:
  - **Application Name**: `ShowWork`
  - **Homepage URL**: `https://showwork-frontend.onrender.com`
  - **Application Description**: `AI-powered portfolio showcase platform`
  - **Authorization callback URL**: 
    - `https://showwork-backend.onrender.com/api/auth/github/callback`
    - `http://localhost:5001/api/auth/github/callback`
- [ ] Click "Register application"

### **2. Save Your Credentials**
- [ ] Copy the **Client ID** (visible immediately)
- [ ] Click "Generate a new client secret"
- [ ] Copy the **Client Secret** (only shown once!)
- [ ] Save them securely

### **3. Configure OAuth App Settings**
- [ ] Go to your OAuth app settings
- [ ] Update the description if needed
- [ ] Verify the callback URLs are correct
- [ ] Note the App ID for reference

## 🎯 **Expected Results:**
- ✅ GitHub OAuth app created
- ✅ Client ID and Client Secret generated
- ✅ Callback URLs configured for production and local development
- ✅ OAuth app ready for authentication

## 📝 **Save This Information:**
```
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

## 🔧 **Troubleshooting:**
- **App not found**: Check you're in the correct GitHub account
- **Callback URL errors**: Ensure URLs match exactly (including http/https)
- **Authentication failed**: Verify client secret is correct
- **Permission denied**: Check OAuth app permissions

## 🚀 **Next Steps:**
After completing GitHub OAuth setup, you'll have all credentials needed for Render deployment.

## 🔐 **Security Notes:**
- Keep your client secrets secure
- Never commit OAuth credentials to version control
- Use environment variables in production
- Rotate secrets regularly for security
