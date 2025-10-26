# 🔧 Environment Variables Setup Guide

## ✅ Your .env file has been created!

Now you need to fill in the actual values. Here's what each variable does and where to get the values:

### **📝 Step-by-Step Value Replacement:**

#### **1. Database Configuration**
```bash
# Replace with your MongoDB Atlas connection string
DATABASE_URL=mongodb+srv://showwork_admin:StrongPassword123!@cluster0.xxxxx.mongodb.net/showwork?retryWrites=true&w=majority

# Replace with your Upstash Redis connection string  
REDIS_URL=rediss://default:<YOUR_PASSWORD>@apn1-upstash.io:12345
```

#### **2. OAuth Credentials**
```bash
# Replace with your GitHub OAuth credentials
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Replace with your Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

#### **3. AI Configuration**
```bash
# Replace with your OpenAI API key
OPENAI_API_KEY=your-openai-api-key-here
```

### **🎯 Where to Get Each Value:**

#### **DATABASE_URL** (MongoDB Atlas)
- Go to your MongoDB Atlas cluster
- Click "Connect" → "Drivers" → "Node.js"
- Copy the connection string
- Replace `<password>` with your actual password

#### **REDIS_URL** (Upstash Redis)
- Go to your Upstash Redis dashboard
- Click "Details" → "Connection"
- Copy the connection URL
- It should look like: `rediss://default:<password>@apn1-upstash.io:12345`

#### **GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET**
- Go to https://github.com/settings/developers
- Click on your OAuth app
- Copy the Client ID and Client Secret

#### **GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET**
- Go to https://console.cloud.google.com/apis/credentials
- Click on your OAuth client
- Copy the Client ID and Client Secret

#### **OPENAI_API_KEY**
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Copy the key (starts with `sk-`)

### **🔧 Quick Setup Commands:**

Once you have all your credentials, you can use these commands to update your .env file:

```bash
# Test MongoDB connection
node test-mongodb-connection.mjs "your-mongodb-connection-string"

# Test Redis connection  
node test-redis-connection.mjs "your-redis-connection-string"

# Test OAuth credentials
node test-oauth-credentials.mjs "google-client-id" "google-client-secret" "github-client-id" "github-client-secret"
```

### **✅ Final Checklist:**
- [ ] DATABASE_URL updated with MongoDB Atlas connection string
- [ ] REDIS_URL updated with Upstash Redis connection string
- [ ] GITHUB_CLIENT_ID updated with GitHub OAuth client ID
- [ ] GITHUB_CLIENT_SECRET updated with GitHub OAuth client secret
- [ ] GOOGLE_CLIENT_ID updated with Google OAuth client ID
- [ ] GOOGLE_CLIENT_SECRET updated with Google OAuth client secret
- [ ] OPENAI_API_KEY updated with OpenAI API key
- [ ] All placeholder values replaced with real credentials

### **🚀 Next Steps:**
1. **Edit your .env file** with the actual values
2. **Test your connections** using the test scripts
3. **Start your application** locally or deploy to production
4. **Verify everything works** by testing the endpoints

### **🔐 Security Notes:**
- Never commit your .env file to version control
- Keep your credentials secure
- Use different credentials for development and production
- Rotate your secrets regularly
