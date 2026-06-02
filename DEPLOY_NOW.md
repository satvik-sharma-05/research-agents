# 🚀 DEPLOY NOW - Quick Action Guide

## ✅ **Everything is Ready! Follow These Steps:**

---

## 📋 **STEP 1: Get Your Backend URL (2 minutes)**

1. **Open Render Dashboard**: https://dashboard.render.com
2. **Find your backend service** (should be named something like `multi-agent-research-backend`)
3. **Copy the URL** from the top of the service page
4. **Format**: `https://something.onrender.com`

**Example**: `https://multi-agent-research-backend.onrender.com`

---

## 📋 **STEP 2: Update Frontend Configuration (1 minute)**

**Open file**: `frontend/render.yaml`

**Find this line** (around line 7):
```yaml
value: https://multi-agent-research-backend.onrender.com/api
```

**Replace with YOUR actual backend URL** + `/api`

**Example**:
```yaml
value: https://YOUR-ACTUAL-BACKEND.onrender.com/api
```

**Save the file!**

---

## 📋 **STEP 3: Commit and Push (1 minute)**

```bash
git add frontend/render.yaml
git commit -m "Update backend URL for frontend deployment"
git push origin main
```

---

## 📋 **STEP 4: Deploy Frontend on Render (5 minutes)**

### **Go to Render Dashboard:**

1. **Click "New +" → "Static Site"**

2. **Connect your GitHub repository**:
   - Repository: `satvik-sharma-05/research-agents`
   - Branch: `main`

3. **Configure the deployment**:
   ```
   Name: research-agents-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://YOUR-BACKEND.onrender.com/api`
   
5. **Click "Create Static Site"**

6. **Wait for deployment** (~5 minutes)

---

## 📋 **STEP 5: Update Backend CORS (2 minutes)**

Once your frontend is deployed, you'll have a URL like:
`https://research-agents-frontend.onrender.com`

**Update backend to allow this URL:**

### **Edit `backend/app/main.py`:**

Find the CORS middleware section and add your frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://research-agents-frontend.onrender.com"  # ← Add this!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Commit and push:**

```bash
git add backend/app/main.py
git commit -m "Add frontend URL to CORS allowed origins"
git push origin main
```

Render will automatically redeploy the backend.

---

## 📋 **STEP 6: Test Everything! (5 minutes)**

### **1. Test Backend Health:**
```bash
curl https://YOUR-BACKEND.onrender.com/health
```

Should return JSON with `"status": "healthy"`

### **2. Test Frontend:**
- Visit: `https://YOUR-FRONTEND.onrender.com`
- Check: Beautiful home page loads
- Check: Navigation works (Home → New Research → How It Works)
- Check: No errors in browser console (F12)

### **3. Test Full Workflow:**
- Click "Start Research Now" or go to "New Research"
- Enter a topic (e.g., "Artificial Intelligence in Healthcare 2024")
- Click "Start Research"
- Watch agents work in real-time
- Review the draft when it appears
- Click "Approve"
- See final report
- Try exporting as PDF

---

## 🎯 **Expected Timeline**

- ⏱️ Step 1 (Get backend URL): **2 minutes**
- ⏱️ Step 2 (Update config): **1 minute**
- ⏱️ Step 3 (Commit/push): **1 minute**
- ⏱️ Step 4 (Deploy frontend): **5-10 minutes**
- ⏱️ Step 5 (Update CORS): **2 minutes**
- ⏱️ Step 6 (Test): **5 minutes**

**Total: ~15-20 minutes to full deployment!**

---

## ✅ **Success Checklist**

After completing all steps:

- [ ] Backend is deployed and healthy
- [ ] Frontend is deployed on Render
- [ ] Backend CORS includes frontend URL
- [ ] Frontend loads beautiful home page
- [ ] Navigation works between pages
- [ ] Can start a research session
- [ ] Agent status updates appear
- [ ] Human feedback workflow works
- [ ] Final report generates
- [ ] PDF export works

---

## 🎉 **When Complete, You'll Have:**

1. ✅ **Backend**: `https://YOUR-BACKEND.onrender.com`
2. ✅ **Frontend**: `https://YOUR-FRONTEND.onrender.com`
3. ✅ **Full-stack AI application** deployed on production infrastructure
4. ✅ **Beautiful modern UI** with navigation
5. ✅ **6 coordinated AI agents** generating research papers
6. ✅ **Resume-worthy project** ready to showcase!

---

## 🆘 **If You Get Stuck**

### **Backend not responding:**
- Check Render dashboard logs
- Verify all environment variables are set
- Test `/health` endpoint

### **Frontend not loading:**
- Check Render static site logs
- Verify build completed successfully
- Check `VITE_API_URL` environment variable

### **Can't connect to backend:**
- Verify CORS settings in `backend/app/main.py`
- Check browser console for CORS errors
- Test backend URL directly

---

## 💡 **Pro Tips**

1. **Bookmark your URLs** once deployed
2. **Test on mobile** - the UI is responsive!
3. **Share with others** - get feedback
4. **Add to resume/portfolio** - this is impressive work!
5. **Take screenshots** - for documentation
6. **Record a demo video** - for job applications

---

## 🚀 **Ready? Let's Deploy!**

**Start with Step 1** - Get your backend URL from Render dashboard!

Once you have it, come back and follow Steps 2-6.

**You're minutes away from having a fully deployed AI application!** 🎉

---

## 📱 **Quick Reference**

### **Render Dashboard:**
https://dashboard.render.com

### **Your Repository:**
https://github.com/satvik-sharma-05/research-agents

### **Documentation Files:**
- `RENDER_FRONTEND_DEPLOYMENT.md` - Detailed frontend deployment
- `DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_COMPLETE.md` - Project summary

---

**🎯 GOAL: Get both services deployed and talking to each other!**

**Let me know your backend URL and I can help with the exact configuration!**
