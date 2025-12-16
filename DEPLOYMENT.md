# Complete Deployment Guide for Africa Waste Solutions

## 🏗️ Architecture Overview

Your application consists of:
- **Flask Frontend** → Vercel (already configured)
- **Go Backend API** → Railway
- **Python AI Service** → Railway  
- **PostgreSQL Database** → Railway
- **MinIO Storage** → Railway (or external S3)

---

## 🚀 Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy deployments)
3. You get $5 free credit monthly

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your `africa-waste-solutions` repository (push to GitHub first if not there)

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will provision the database and provide connection details

### Step 4: Deploy Go Backend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repo
3. Railway will auto-detect the Dockerfile
4. Configure the service:
   - **Name**: `backend-api`
   - **Root Directory**: Select `backend`
   - **Port**: 8080

### Step 5: Configure Backend Environment Variables

In the backend service settings, add these environment variables:

```bash
# Database (copy from Railway PostgreSQL service)
POSTGRES_DSN=postgresql://postgres:password@hostname:5432/railway?sslmode=require

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-super-secret-jwt-key-here

# CORS (replace with your actual Vercel domain after frontend deployment)
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173

# Optional: MinIO (or use external S3)
MINIO_ENDPOINT=s3.amazonaws.com
MINIO_ACCESS_KEY=your-key
MINIO_SECRET_KEY=your-secret
MINIO_BUCKET=kyc-docs
MINIO_USE_SSL=true

# Environment
ENVIRONMENT=production
PORT=8080
```

> **💡 Tip**: To get PostgreSQL connection string:
> 1. Click on the PostgreSQL service
> 2. Go to "Variables" tab
> 3. Copy  the `DATABASE_URL` value
> 4. Use it for `POSTGRES_DSN`

### Step 6: Deploy AI Service

1. Click **"+ New"** → **"GitHub Repo"**  
2. Select your repo again
3. Configure the service:
   - **Name**: `ai-service`
   - **Root Directory**: Select `ai-service`
   - **Port**: 5000

### Step 7: Configure AI Service Environment Variables

```bash
# CORS (use your backend Railway URL + Vercel frontend)
CORS_ORIGINS=https://backend-api-production.railway.app,https://your-app.vercel.app

# Optional: AI API Keys
# OPENAI_API_KEY=sk-...
# GEMINI_API_KEY=...

PORT=5000
```

### Step 8: Note Your Service URLs

After deployment, Railway provides URLs for each service:
- Backend: `https://backend-api-production.railway.app`
- AI Service: `https://ai-service-production.railway.app`

**Copy these URLs** - you'll need them for the frontend!

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Configure Environment Variables

In your local `flask-frontend` directory (or Vercel dashboard), set:

```bash
# Flask Secret
SECRET_KEY=your-flask-secret-key

# Backend URL (use your Railway backend URL)
BACKEND_API_URL=https://backend-api-production.railway.app/api
```

### Step 2: Deploy to Vercel

```powershell
cd d:\Green\flask-frontend
vercel login
vercel
```

Follow the prompts and deploy!

Or use Vercel Dashboard:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. Set root directory to `flask-frontend`
4. Add environment variables
5. Deploy!

### Step 3: Update CORS Settings

After getting your Vercel URL (e.g., `https://your-app.vercel.app`):

1. Go back to Railway backend service
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
   ```
3. Railway will auto-redeploy

---

## ✅ Part 3: Verification

### Test Backend API

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Should return: {"status": "ok"}
```

### Test AI Service

```bash
curl https://your-ai-service.railway.app/

# Should return: {"status": "healthy", "service": "ai-service"}
```

### Test Full Application

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try to login (if you have test credentials)
3. Check browser console for any errors
4. Verify dashboard loads

---

## 🔧 Troubleshooting

### Backend won't start

Check Railway logs:
1. Click on backend service
2. Go to "Deployments" tab
3. Click latest deployment
4. View logs for errors

Common issues:
- Database connection string incorrect
- Missing environment variables
- Go build errors

### CORS Errors

If you see CORS errors in browser console:

1. Verify `CORS_ORIGINS` in Railway backend includes your Vercel URL
2. Make sure CORS_ORIGINS format is: `https://domain1.com,https://domain2.com` (no spaces)
3. Redeploy backend after changing

### Database Connection Issues

1. Ensure `POSTGRES_DSN` format is correct:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```
2. Copy directly from Railway PostgreSQL service variables
3. Use `sslmode=require` for Railway PostgreSQL

### Frontend Can't Reach Backend

1. Check `BACKEND_API_URL` in Vercel environment variables
2. Should be: `https://your-backend.railway.app/api` (note the `/api` suffix)
3. Verify backend is actually running in Railway

---

## 💰 Cost Estimates

**Railway** (Backend + Database + AI):
- Free $5/month credit
- Should cover small demo/client presentation
- Estimated: $0-5/month for light usage

**Vercel** (Frontend):
- Free tier: 100GB bandwidth
- Perfect for demos and small apps
- Cost: $0

**Total**: $0-5/month for demo purposes ✅

---

## 📋 Post-Deployment Checklist

- [ ] Backend API deployed and accessible
- [ ] AI service deployed and accessible  
- [ ] PostgreSQL database created
- [ ] All environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] CORS properly configured
- [ ] Can access login page
- [ ] Can login (if test user exists)
- [ ] Dashboard loads successfully
- [ ] Test creating a transaction
- [ ] Test report generation

---

## 🔐 Security Notes

> **⚠️ IMPORTANT**: Before showing to client:

1. **Change all default secrets**:
   - Generate new `JWT_SECRET`
   - Generate new `SECRET_KEY`
   - Don't use default passwords

2. **Create demo data**:
   - Create test manufacturer, distributor, household accounts
   - Add some sample transactions
   - Makes the demo more impressive!

3. **SSL/HTTPS**:
   - Both Railway and Vercel provide HTTPS automatically ✅

---

## 🎯 Quick Commands Reference

### Deploy Frontend
```powershell
cd d:\Green\flask-frontend
vercel --prod
```

### View Railway Logs
```bash
# Install Railway CLI (optional)
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Generate Secrets
```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Flask Secret  
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🆘 Need Help?

Common commands:
- **Redeploy**: Railway auto-deploys on git push
- **Environment vars**: Change in Railway/Vercel dashboard → auto-redeploys
- **Logs**: View in Railway dashboard under "Deployments"

---

**🎉 You're all set! Share your Vercel URL with your client.**
