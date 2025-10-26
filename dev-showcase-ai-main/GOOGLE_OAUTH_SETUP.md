# 🔐 Google OAuth Setup Guide

## Step-by-Step Google OAuth Configuration

### **1. Create Google Cloud Project**
- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Click "Select a project" → "New Project"
- [ ] Project Name: `ShowWork`
- [ ] Click "Create"
- [ ] Wait for project to be created

### **2. Enable OAuth Consent Screen**
- [ ] In the left sidebar, click "OAuth consent screen"
- [ ] Choose "External" user type
- [ ] Click "Create"
- [ ] Fill in the form:
  - **App Name**: `ShowWork`
  - **User Support Email**: Your email address
  - **Developer Contact Information**: Your email address
- [ ] Click "Save and Continue"
- [ ] Skip "Scopes" for now (click "Save and Continue")
- [ ] Skip "Test users" for now (click "Save and Continue")
- [ ] Review and click "Back to Dashboard"

### **3. Create OAuth Credentials**
- [ ] In the left sidebar, click "Credentials"
- [ ] Click "Create Credentials" → "OAuth client ID"
- [ ] Application type: "Web application"
- [ ] Name: `ShowWork Web`
- [ ] Authorized redirect URIs:
  - `https://showwork-backend.onrender.com/api/auth/google/callback`
  - `http://localhost:5001/api/auth/google/callback`
- [ ] Click "Create"

### **4. Save Your Credentials**
- [ ] Copy the **Client ID**
- [ ] Copy the **Client Secret**
- [ ] Save them securely

## 🎯 **Expected Results:**
- ✅ Google Cloud project created
- ✅ OAuth consent screen configured
- ✅ OAuth client credentials generated
- ✅ Redirect URIs configured for production and local development

## 📝 **Save This Information:**
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## 🔧 **Troubleshooting:**
- **Project not found**: Ensure you're in the correct Google Cloud project
- **OAuth consent screen issues**: Make sure to fill in all required fields
- **Redirect URI errors**: Double-check the URLs are exactly as specified
- **Credentials not working**: Ensure the OAuth consent screen is published

## 🚀 **Next Steps:**
After completing Google OAuth setup, proceed to GitHub OAuth configuration.