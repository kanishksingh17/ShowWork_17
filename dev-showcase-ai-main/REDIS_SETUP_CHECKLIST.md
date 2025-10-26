# 🔴 Upstash Redis Setup Checklist

## ✅ Step-by-Step Redis Setup

### **Account Setup**
- [ ] Visit https://upstash.com
- [ ] Sign in with GitHub or Google
- [ ] Choose free tier

### **Database Creation**
- [ ] Click "Create Database"
- [ ] Type: Redis
- [ ] Region: Asia (Mumbai) or nearest to your location
- [ ] Name: `showwork-queue`
- [ ] Click "Create"
- [ ] Wait for database to be ready

### **Connection String**
- [ ] Go to "Database" → "Details" → "Connection"
- [ ] Copy the Connection URL
- [ ] Format: `rediss://default:<YOUR_PASSWORD>@apn1-upstash.io:12345`

### **Testing**
- [ ] Run connection test: `node test-redis-connection.mjs "your-redis-url"`
- [ ] Verify successful connection
- [ ] Verify job creation and processing
- [ ] Save connection string for Render deployment

## 🎯 **Expected Results:**
- ✅ Upstash Redis database created
- ✅ Connection string ready for production
- ✅ Queue operations working
- ✅ Test script passes successfully

## 🔧 **Troubleshooting:**
- **Authentication failed**: Check password in connection string
- **Network timeout**: Check region selection
- **Connection refused**: Verify database is running
- **SSL errors**: Ensure using `rediss://` (secure) not `redis://`

## 📝 **Save This Information:**
- **Connection String**: `rediss://default:<YOUR_PASSWORD>@apn1-upstash.io:12345`
- **Database Name**: `showwork-queue`
- **Region**: Asia (Mumbai) or your selected region

This will be your `REDIS_URL` for Render deployment!

## 🚀 **What Redis Powers in ShowWork:**
- **Scheduled Publishing**: Queue social media posts
- **Analytics Processing**: Background analytics jobs
- **AI Content Generation**: Queue AI post generation
- **Background Workers**: Process jobs asynchronously
