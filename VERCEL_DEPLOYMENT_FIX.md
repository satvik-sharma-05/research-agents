# Vercel Deployment Fix

## 🚨 Problem
```
Environment Variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```

## ✅ Solution

### Step 1: Get Your Backend URL
First, you need your Render backend URL. Check your Render dashboard for the backend service URL.

**Format**: `https://your-service-name.onrender.com`

### Step 2: Update Frontend Environment File

I've created `frontend/.env.production` with a placeholder. **Update it with your actual backend URL:**

```bash
# In frontend/.env.production
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

**Important**: Replace `YOUR-ACTUAL-BACKEND-URL` with your real Render service URL.

### Step 3: Redeploy to Vercel

After updating the environment file:

```bash
git add frontend/.env.production
git commit -m "Add production environment variable for Vercel"
git push origin main
```

Then in Vercel:
1. Go to your project dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment

### Alternative: Set in Vercel Dashboard

If you prefer not to commit the URL to git:

1. **Go to Vercel Project Settings**
2. **Environment Variables** section
3. **Add new variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api`
   - Environment: Production
4. **Save and Redeploy**

## 🔍 How to Find Your Backend URL

### Method 1: Render Dashboard
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Copy the URL from the service page (top of the page)
4. Add `/api` to the end

### Method 2: Test Backend Health
Once your backend is deployed, test it:
```bash
curl https://YOUR-SERVICE.onrender.com/health
```

If this returns a JSON response with `"status": "healthy"`, your backend is working!

## 📝 Example URLs

### If your Render service is named `multi-agent-research-backend`:
- **Backend URL**: `https://multi-agent-research-backend.onrender.com`
- **API URL for frontend**: `https://multi-agent-research-backend.onrender.com/api`

### Environment file should contain:
```
VITE_API_URL=https://multi-agent-research-backend.onrender.com/api
```

## 🔄 Complete Deployment Flow

1. **Backend First** (Render)
   - Should auto-deploy from GitHub pushes
   - Check logs for successful deployment
   - Test health endpoint

2. **Get Backend URL**
   - Copy from Render dashboard
   - Verify it works with `/health`

3. **Update Frontend Environment**
   - Edit `frontend/.env.production`
   - Use correct backend URL + `/api`

4. **Deploy Frontend** (Vercel)
   - Commit environment file
   - Push to GitHub
   - Vercel auto-deploys
   - Or manually redeploy in dashboard

5. **Update CORS** (if needed)
   - Add Vercel URL to backend CORS
   - Commit and push backend changes

## ✅ Success Check

Once deployed correctly:
1. **Frontend loads** without errors
2. **Can navigate** between pages
3. **Can start research** (form appears)
4. **Backend connection** works

## 🆘 If Still Having Issues

### Check these common problems:
1. **Backend URL format** - Should end with `/api`
2. **CORS settings** - Backend must allow frontend domain
3. **Environment variable name** - Must be exactly `VITE_API_URL`
4. **Vercel deployment** - Check deployment logs for errors

### Debug steps:
1. **Test backend directly** in browser: `https://your-backend.onrender.com/health`
2. **Check browser console** for frontend errors
3. **Verify environment variable** in Vercel settings
4. **Check network tab** for failed API calls