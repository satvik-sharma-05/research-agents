# Deploy Frontend on Render - Complete Guide

## 🎯 **Why Deploy on Render Instead of Vercel?**

- ✅ **Simpler environment variable handling**
- ✅ **Same platform as backend** (easier management)
- ✅ **No secret reference issues**
- ✅ **Free tier available**
- ✅ **Automatic deployments from GitHub**

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Get Your Backend URL**

First, find your backend URL from Render dashboard:
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Copy the URL (e.g., `https://multi-agent-research-backend.onrender.com`)

### **Step 2: Update Frontend Configuration**

I've created `frontend/render.yaml` - **update the backend URL in this file:**

```yaml
# In frontend/render.yaml - UPDATE THIS URL
envVars:
  - key: VITE_API_URL
    value: https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

### **Step 3: Create Static Site on Render**

1. **Go to https://dashboard.render.com**
2. **Click "New +" → "Static Site"**
3. **Connect GitHub repository**: `satvik-sharma-05/research-agents`
4. **Configure settings:**

```
Name: research-agents-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: frontend/dist
```

### **Step 4: Set Environment Variables**

In the Render Static Site settings:
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com/api`

### **Step 5: Deploy**

Click **"Create Static Site"** and wait for deployment!

---

## 📁 **Files I Created for You**

### **1. `frontend/render.yaml`**
- Deployment configuration for Render
- **UPDATE the backend URL in this file!**

### **2. `frontend/_redirects`**
- Handles React Router navigation
- Ensures all routes work properly

---

## ⚙️ **Manual Setup (Alternative)**

If you prefer manual setup instead of using `render.yaml`:

### **Create Static Site Manually:**

1. **Service Type**: Static Site
2. **Repository**: `satvik-sharma-05/research-agents`
3. **Branch**: `main`
4. **Root Directory**: `frontend`
5. **Build Command**: `npm install && npm run build`
6. **Publish Directory**: `dist`

### **Environment Variables:**
- **VITE_API_URL**: `https://your-backend.onrender.com/api`

---

## 🔧 **Update Backend CORS**

Once your frontend is deployed on Render, you'll need to update your backend CORS:

### **Edit `backend/app/main.py`:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://research-agents-frontend.onrender.com"  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Then commit and push:**
```bash
git add backend/app/main.py
git commit -m "Add Render frontend URL to CORS"
git push origin main
```

---

## ✅ **Deployment Checklist**

### **Before Deploying:**
- [ ] Backend is deployed and healthy (`/health` endpoint works)
- [ ] You have the correct backend URL
- [ ] Updated `frontend/render.yaml` with correct backend URL

### **During Deployment:**
- [ ] Static Site created on Render
- [ ] Correct repository and branch selected
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable `VITE_API_URL` set

### **After Deployment:**
- [ ] Frontend loads without errors
- [ ] Navigation works (Home → New Research → How It Works)
- [ ] Can start research (form appears)
- [ ] Backend CORS updated with frontend URL

---

## 🎯 **Expected URLs**

### **If your services are named:**
- **Backend**: `multi-agent-research-backend.onrender.com`
- **Frontend**: `research-agents-frontend.onrender.com`

### **Full URLs:**
- **Backend API**: `https://multi-agent-research-backend.onrender.com/api`
- **Frontend**: `https://research-agents-frontend.onrender.com`
- **Health Check**: `https://multi-agent-research-backend.onrender.com/health`

---

## 🔍 **Testing After Deployment**

### **1. Test Frontend Loads**
Visit your frontend URL and check:
- ✅ Beautiful home page loads
- ✅ Navigation works between pages
- ✅ No console errors in browser

### **2. Test Backend Connection**
Try starting a research session:
- ✅ Research form appears
- ✅ Can enter topic and click start
- ✅ Agent status updates appear (WebSocket working)

### **3. Full End-to-End Test**
- ✅ Complete a full research workflow
- ✅ Human feedback works
- ✅ Final report generates
- ✅ Export options work

---

## 🆘 **Troubleshooting**

### **If Frontend Doesn't Load:**
1. Check Render deployment logs
2. Verify build command completed successfully
3. Check that `dist` folder was created

### **If Can't Connect to Backend:**
1. Verify `VITE_API_URL` environment variable
2. Check browser console for CORS errors
3. Test backend health endpoint directly
4. Verify backend CORS includes frontend URL

### **If Navigation Doesn't Work:**
1. Check that `_redirects` file is in the build
2. Verify React Router setup
3. Check browser console for routing errors

---

## 💡 **Advantages of Render for Frontend**

### **vs Vercel:**
- ✅ **Simpler env vars** - No secret reference issues
- ✅ **Same platform** - Backend and frontend in one place
- ✅ **Consistent deployment** - Same workflow for both services

### **Free Tier Features:**
- ✅ **100GB bandwidth/month**
- ✅ **Global CDN**
- ✅ **Automatic HTTPS**
- ✅ **Custom domains**
- ✅ **GitHub integration**

---

## 🚀 **Quick Start Commands**

```bash
# 1. Update frontend/render.yaml with your backend URL
# 2. Commit the changes
git add frontend/
git commit -m "Add Render frontend deployment configuration"
git push origin main

# 3. Create Static Site on Render dashboard
# 4. Wait for deployment
# 5. Update backend CORS with frontend URL
# 6. Test complete workflow!
```

---

**This approach will be much simpler than dealing with Vercel's environment variable issues!** 🎉