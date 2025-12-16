# 🚀 Quick Deployment Checklist

Follow this checklist to get your app live in ~15 minutes!

## ✅ Pre-deployment (5 min)

- [ ] Code is on GitHub
  ```powershell
  cd d:\Green
  git init
  git add .
  git commit -m "Deploy to production"
  # Create repo on github.com, then:
  git remote add origin https://github.com/YOUR_USERNAME/africa-waste-solutions.git
  git push -u origin main
  ```

- [ ] Node.js installed (check with `node --version`)
- [ ] Python installed (check with `python --version`)

## ✅ Backend Deployment - Railway (8 min)

- [ ] 1. Go to [railway.app](https://railway.app) → Sign in with GitHub
- [ ] 2. Click "Deploy from GitHub repo" → Select your repo
- [ ] 3. Click "+ New" → Database → PostgreSQL
- [ ] 4. Copy `DATABASE_URL` from PostgreSQL Variables tab
- [ ] 5. Configure Backend service:
  - [ ] Add `POSTGRES_DSN` = (paste DATABASE_URL)
  - [ ] Add `JWT_SECRET` = (run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
  - [ ] Add `CORS_ORIGINS` = `http://localhost:5173`
  - [ ] Add `PORT` = `8080`
- [ ] 6. Click Deploy
- [ ] 7. Settings → Generate Domain → Copy URL (save it!)
- [ ] 8. Add AI Service: "+ New" → Set root directory to `ai-service`
- [ ] 9. Set AI Service vars: `CORS_ORIGINS=http://localhost:8080`, `PORT=5000`
- [ ] 10. Deploy & generate domain

**✍️ Backend URL**: _____________________________________

**✍️ AI Service URL**: _____________________________________

## ✅ Frontend Deployment - Vercel (5 min)

- [ ] 1. Install Vercel CLI:
  ```powershell
  npm install -g vercel
  ```

- [ ] 2. Deploy:
  ```powershell
  cd d:\Green\flask-frontend
  vercel login
  vercel
  ```

- [ ] 3. Set environment variables:
  ```powershell
  # Backend URL (use your Railway backend URL + /api)
  vercel env add BACKEND_API_URL production
  # Enter: https://your-backend-url.railway.app/api
  
  # Flask secret
  vercel env add SECRET_KEY production
  # Generate: python -c "import secrets; print(secrets.token_hex(32))"
  ```

- [ ] 4. Deploy to production:
  ```powershell
  vercel --prod
  ```

**✍️ Vercel URL**: _____________________________________

## ✅ Connect Services (2 min)

- [ ] Update Railway Backend CORS:
  - Go to Railway → Backend → Variables
  - Edit `CORS_ORIGINS` = `https://your-vercel-url.vercel.app,http://localhost:5173`
  - Auto-redeploys

- [ ] Update Railway AI Service CORS:
  - Go to Railway → AI Service → Variables  
  - Edit `CORS_ORIGINS` = `https://your-backend.railway.app,https://your-vercel-url.vercel.app`

## ✅ Test & Share! (2 min)

- [ ] Open your Vercel URL in browser
- [ ] Check browser console (F12) for errors
- [ ] Navigate to different pages
- [ ] Test login if you have credentials

## 🎉 **SHARE THIS URL WITH YOUR CLIENT:**

**Your Live App**: `https://your-app.vercel.app`

---

## 🆘 Quick Troubleshooting

**CORS errors?** → Update `CORS_ORIGINS` in Railway with exact Vercel URL

**Backend not working?** → Check Railway → Backend → Deployments → Logs

**Can't connect to backend?** → Verify `BACKEND_API_URL` in Vercel ends with `/api`

---

## 📋 Generate Secrets Commands

```powershell
# JWT Secret (for Railway backend)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Flask Secret (for Vercel frontend)
python -c "import secrets; print(secrets.token_hex(32))"
```

---

**Done? Share your Vercel URL and celebrate! 🎊**
