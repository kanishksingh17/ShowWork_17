# 🗄️ MongoDB Atlas Setup Checklist

## ✅ Step-by-Step MongoDB Setup

### **Account & Project Setup**
- [ ] Visit https://cloud.mongodb.com
- [ ] Sign in or create free account
- [ ] Create new project named "ShowWork"
- [ ] Choose free tier (M0 Sandbox)

### **Cluster Setup**
- [ ] Click "Build a Database"
- [ ] Choose "FREE" tier (M0 Sandbox)
- [ ] Provider: AWS
- [ ] Region: Mumbai (ap-south-1) or closest to you
- [ ] Cluster Name: `showwork-cluster`
- [ ] Click "Create Cluster"
- [ ] Wait ~1 minute for deployment

### **Database Access**
- [ ] Click "Database Access" in left sidebar
- [ ] Click "Add New Database User"
- [ ] Authentication Method: Password
- [ ] Username: `showwork_admin`
- [ ] Password: `StrongPassword123!` (or secure password)
- [ ] Database User Privileges: "Read and write to any database"
- [ ] Click "Add User"

### **Network Access**
- [ ] Click "Network Access" in left sidebar
- [ ] Click "Add IP Address"
- [ ] Choose "Allow access from anywhere" (0.0.0.0/0)
- [ ] Click "Confirm"

### **Connection String**
- [ ] Go back to "Clusters"
- [ ] Click "Connect" on your cluster
- [ ] Choose "Drivers"
- [ ] Select "Node.js"
- [ ] Copy connection string
- [ ] Format: `mongodb+srv://showwork_admin:StrongPassword123!@cluster0.xxxxx.mongodb.net/showwork?retryWrites=true&w=majority`

### **Testing**
- [ ] Run connection test: `node test-mongodb-connection.mjs "your-connection-string"`
- [ ] Verify successful connection
- [ ] Verify read/write operations work
- [ ] Save connection string for Render deployment

## 🎯 **Expected Results:**
- ✅ MongoDB Atlas cluster running
- ✅ Database user created with read/write access
- ✅ Network access configured (0.0.0.0/0)
- ✅ Connection string ready for production
- ✅ Test script passes successfully

## 🔧 **Troubleshooting:**
- **Authentication failed**: Check username/password
- **Network timeout**: Check IP whitelist (0.0.0.0/0)
- **Connection refused**: Verify cluster is running
- **Permission denied**: Check user privileges

## 📝 **Save This Information:**
- **Connection String**: `mongodb+srv://showwork_admin:StrongPassword123!@cluster0.xxxxx.mongodb.net/showwork?retryWrites=true&w=majority`
- **Database Name**: `showwork`
- **Username**: `showwork_admin`
- **Password**: `StrongPassword123!`

This will be your `DATABASE_URL` for Render deployment!
