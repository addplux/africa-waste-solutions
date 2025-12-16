# Quick Start - Railway + Vercel Deployment

## ⚡ 5-Minute Setup

### Backend (Railway)

1. **Sign up**: [railway.app](https://railway.app) with GitHub
2. **Create project** → Deploy from GitHub → Select your repo
3. **Add PostgreSQL**: Click "+ New" → Database → PostgreSQL
4. **Deploy services**:
   - Backend: Root directory = `backend`
   - AI Service: Root directory = `ai-service`
5. **Set environment variables** (copy from `.env.example` files):
   - Backend: `POSTGRES_DSN`, `JWT_SECRET`, `CORS_ORIGINS`
   - AI Service: `CORS_ORIGINS`

### Frontend (Vercel)

```powershell
cd d:\Green\flask-frontend
vercel --prod
```

Set environment variables when prompted:
- `SECRET_KEY`
- `BACKEND_API_URL` (your Railway backend URL + `/api`)

### Update CORS

After getting Vercel URL, update `CORS_ORIGINS` in Railway backend:
```
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

## 📝 URLs You'll Get

- Backend: `https://backend-production-xxx.railway.app`
- AI Service: `https://ai-service-production-xxx.railway.app`
- Frontend: `https://your-app.vercel.app`

**Share the Vercel URL with your client!** 🎉

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔑 Generate Secrets

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Flask Secret
python -c "import secrets; print(secrets.token_hex(32))"
```

## ✅ Verification

Test backend: `curl https://your-backend.railway.app/api/health`

Test AI service: `curl https://your-ai-service.railway.app/`

## 💰 Cost

- Railway: $5/month free credit (enough for demo)
- Vercel: Free tier
- **Total: $0** for demo/testing

## 📋 Checklist

- [ ] Railway account created
- [ ] PostgreSQL database added
- [ ] Backend deployed to Railway
- [ ] AI service deployed to Railway
- [ ] Environment variables set
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with Vercel URL
- [ ] Tested login and basic features
- [ ] **Shared URL with client**
