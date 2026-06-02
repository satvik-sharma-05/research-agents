# Deployment Guide - Multi-Agent Research System

## Architecture
- **Backend**: FastAPI (Python) → Deploy on Render
- **Frontend**: React + Vite → Deploy on Vercel  
- **Database**: PostgreSQL → Render Postgres

## Prerequisites
1. GitHub account (code repository)
2. Render account (https://render.com)
3. Vercel account (https://vercel.com)
4. OpenRouter API key (https://openrouter.ai)
5. Tavily API key (https://tavily.com)

---

## Part 1: Deploy Backend on Render

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create PostgreSQL Database on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. **Configuration:**
   - Name: `multi-agent-research-db`
   - Region: Oregon (US West)
   - Plan: Free
4. Click "Create Database"
5. **Copy the Internal Database URL** (starts with `postgres://`)

### Step 3: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. **Configuration:**
   - Name: `multi-agent-research-backend`
   - Region: Oregon (US West)
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free

4. **Environment Variables** (click "Advanced"):
   ```
   OPENROUTER_API_KEY = your_openrouter_key_here
   TAVILY_API_KEY = your_tavily_key_here
   DATABASE_URL = [paste the database URL from Step 2]
   PYTHON_VERSION = 3.12.0
   ```

5. Click "Create Web Service"
6. **Wait 5-10 minutes** for deployment
7. **Copy your backend URL**: `https://YOUR-SERVICE.onrender.com`

### Step 4: Test Backend
Visit: `https://YOUR-SERVICE.onrender.com/health`

Should return:
```json
{"status": "healthy", "timestamp": "..."}
```

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Create Environment Variable File
In your `frontend` folder, create `.env.production`:
```bash
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
```

Replace `YOUR-BACKEND-URL` with your actual Render backend URL.

### Step 2: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Configuration:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com/api`

6. Click "Deploy"
7. **Wait 2-3 minutes** for deployment
8. **Your frontend URL**: `https://YOUR-PROJECT.vercel.app`

### Step 3: Update Backend CORS
After frontend is deployed, update backend CORS to allow your Vercel domain:

1. Go to Render Dashboard → Your Backend Service
2. Environment → Edit
3. Find `ALLOWED_ORIGINS` or update `app/main.py`:

```python
# In backend/app/main.py, update CORS origins:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://YOUR-PROJECT.vercel.app"  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. Commit and push changes to trigger redeployment

---

## Part 3: Verification

### Test Complete Flow:
1. Visit your Vercel URL: `https://YOUR-PROJECT.vercel.app`
2. Enter research topic (e.g., "Quantum Computing 2026")
3. System should:
   - ✅ Connect to backend
   - ✅ Show 6 agents working
   - ✅ Display draft for review
   - ✅ Allow approve/reject
   - ✅ Generate final academic paper
   - ✅ Offer PDF export

---

## Environment Variables Summary

### Backend (Render):
```
OPENROUTER_API_KEY = [your OpenRouter API key]
TAVILY_API_KEY = [your Tavily API key]
DATABASE_URL = [Render PostgreSQL internal URL]
PYTHON_VERSION = 3.12.0
```

### Frontend (Vercel):
```
VITE_API_URL = https://YOUR-BACKEND.onrender.com/api
```

---

## Troubleshooting

### Backend Issues:

**Build fails:**
```bash
# Check requirements.txt has all dependencies
pip freeze > requirements.txt
```

**Health check fails:**
- Check logs in Render Dashboard
- Verify DATABASE_URL is correct
- Ensure API keys are valid

**CORS errors:**
- Add Vercel URL to CORS allowed_origins
- Restart backend service after changes

### Frontend Issues:

**Can't connect to backend:**
- Verify VITE_API_URL environment variable
- Check browser console for errors
- Ensure backend is running (visit /health)

**White screen:**
- Check Vercel deployment logs
- Verify build completed successfully
- Clear browser cache

---

## Free Tier Limitations

### Render Free Tier:
- ⚠️ **Sleeps after 15 minutes of inactivity**
- ⚠️ **First request after sleep takes 50+ seconds**
- ✅ 750 hours/month free
- ✅ 512 MB RAM
- ✅ 0.1 CPU

**Solution**: Keep service awake with cron-job.org pinging `/health` every 10 minutes

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Fast global CDN
- ✅ Automatic HTTPS

---

## Production Optimizations

### Performance:
1. **Enable caching** for API responses
2. **Compress responses** with gzip
3. **Use CDN** for static assets (Vercel does this automatically)

### Security:
1. **Never commit `.env` files** to git
2. **Rotate API keys** regularly
3. **Use HTTPS only** (Render & Vercel enforce this)
4. **Implement rate limiting** on backend

### Monitoring:
1. **Use Render logs** for backend debugging
2. **Use Vercel Analytics** for frontend metrics
3. **Set up Sentry** for error tracking (optional)

---

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS CNAME record

---

## Cost Estimate

**FREE (with limitations):**
- Render: Free tier
- Vercel: Free tier  
- Database: Render PostgreSQL free tier (1 GB)

**PAID (for production):**
- Render Starter: $7/month (no sleep, 512 MB RAM)
- Vercel Pro: $20/month (better analytics, no bandwidth limits)
- Database: Render PostgreSQL Starter $7/month (10 GB)

**Total Production Cost: ~$34/month**

---

## Support

### Getting Help:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Issues: Create GitHub issue in your repository

### Quick Links:
- OpenRouter API: https://openrouter.ai/docs
- Tavily API: https://docs.tavily.com
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Share your live URL
3. ✅ Add to your resume/portfolio
4. ✅ Create demo video
5. ✅ Write blog post about the project

**Congratulations! Your Multi-Agent Research System is now live! 🎉**
