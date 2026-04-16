# Deployment Checklist

Use this to track your progress through Plan A.

---

## ✅ Phase 1: Local Development

- [ ] **Install Node.js**
  - [ ] Download from [nodejs.org](https://nodejs.org)
  - [ ] Run installer
  - [ ] Verify: `node --version` and `npm --version`

- [ ] **Get Gemini API Key**
  - [ ] Go to [aistudio.google.com](https://aistudio.google.com)
  - [ ] Click "Get API Key"
  - [ ] Copy key (save somewhere safe)

- [ ] **Backend Setup**
  - [ ] `cd backend`
  - [ ] `npm install`
  - [ ] `cp .env.example .env`
  - [ ] Edit `.env` with your editor
    - [ ] Add `GEMINI_API_KEY=<your_key>`
    - [ ] Add `JWT_SECRET=my_secret_123`
  - [ ] `npm run dev`
  - [ ] Verify: "Server running on port 5000"

- [ ] **Frontend Setup**
  - [ ] Open new terminal
  - [ ] `cd frontend`
  - [ ] `npm install`
  - [ ] `npm run dev`
  - [ ] Verify: "Local: http://localhost:3000/"

- [ ] **Test Locally**
  - [ ] Open http://localhost:3000 in browser
  - [ ] Upload a test resume (PDF or TEX)
  - [ ] Go through full flow
  - [ ] Verify resources load

---

## ✅ Phase 2: GitHub Setup

- [ ] **Create GitHub Account**
  - [ ] Go to [github.com](https://github.com)
  - [ ] Sign up (free)

- [ ] **Create Repository**
  - [ ] Click "New repository"
  - [ ] Name: `learning-recommender`
  - [ ] Public or Private (your choice)
  - [ ] Click "Create repository"

- [ ] **Push Code to GitHub**
  - [ ] From project root (where `backend/` and `frontend/` are):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/learning-recommender.git
    git push -u origin main
    ```
  - [ ] Verify code appears on GitHub

---

## ✅ Phase 3: Deploy Backend (Railway)

- [ ] **Create Railway Account**
  - [ ] Go to [railway.app](https://railway.app)
  - [ ] Sign up with GitHub (easiest)

- [ ] **Create Project**
  - [ ] Click "Start a New Project"
  - [ ] Select "Deploy from GitHub repo"
  - [ ] Authorize Railway
  - [ ] Select `learning-recommender` repo
  - [ ] Click "Deploy"
  - [ ] Wait 2-3 minutes

- [ ] **Set Environment Variables**
  - [ ] In Railway dashboard, click your project
  - [ ] Go to "Variables" tab
  - [ ] Add `GEMINI_API_KEY` = your API key
  - [ ] Add `JWT_SECRET` = same as local
  - [ ] Click "Save"
  - [ ] Wait for auto-redeploy

- [ ] **Get Backend URL**
  - [ ] Go to "Deployments" tab
  - [ ] Click active deployment
  - [ ] Copy "Public URL" (e.g., `https://learning-recommender-prod.up.railway.app`)
  - [ ] Save this URL — you'll need it next

---

## ✅ Phase 4: Deploy Frontend (Vercel)

- [ ] **Create Vercel Account**
  - [ ] Go to [vercel.com](https://vercel.com)
  - [ ] Sign up with GitHub (easiest)

- [ ] **Create Project**
  - [ ] Click "Add New..." → "Project"
  - [ ] Select `learning-recommender` repo
  - [ ] Set "Root Directory" to `frontend`
  - [ ] Click "Deploy"
  - [ ] Wait 1-2 minutes

- [ ] **Set Environment Variables**
  - [ ] In Vercel dashboard, go to "Settings" → "Environment Variables"
  - [ ] Add `VITE_API_URL` = Railway URL from Phase 3
  - [ ] Click "Save"
  - [ ] Go to "Deployments" → click latest → "Redeploy"
  - [ ] Wait for redeploy

- [ ] **Get Frontend URL**
  - [ ] Go to "Deployments" tab
  - [ ] Click active deployment
  - [ ] Copy "Production URL" (e.g., `https://learning-recommender.vercel.app`)
  - [ ] Save this URL

---

## ✅ Phase 5: Final Configuration

- [ ] **Update Backend's CLIENT_URL**
  - [ ] Go back to Railway dashboard
  - [ ] Go to "Variables"
  - [ ] Update `CLIENT_URL` = Vercel URL from Phase 4
  - [ ] Click "Save"
  - [ ] Wait for auto-redeploy

- [ ] **Test Live App**
  - [ ] Open Vercel frontend URL in browser
  - [ ] Upload a resume
  - [ ] Go through full flow
  - [ ] Verify everything works

---

## ✅ Optional: Custom Domain

- [ ] **Add Domain to Vercel** (optional)
  - [ ] In Vercel, go to "Settings" → "Domains"
  - [ ] Add your domain
  - [ ] Follow DNS setup instructions

- [ ] **Add Domain to Railway** (optional)
  - [ ] In Railway, go to "Settings" → "Custom Domain"
  - [ ] Add your domain
  - [ ] Follow DNS setup instructions

---

## ✅ Troubleshooting Checklist

If something doesn't work:

- [ ] **Backend won't start locally**
  - [ ] Check Node.js is installed: `node --version`
  - [ ] Check port 5000 is free: `lsof -i :5000` (Mac/Linux)
  - [ ] Try different port: `PORT=5001 npm run dev`

- [ ] **"Cannot find module" error**
  - [ ] Run `npm install` in that folder
  - [ ] Delete `node_modules` and `package-lock.json`, reinstall

- [ ] **Gemini API errors**
  - [ ] Verify API key is correct (no extra spaces)
  - [ ] Check quota at [aistudio.google.com](https://aistudio.google.com)

- [ ] **Frontend can't reach backend**
  - [ ] Verify `VITE_API_URL` is set in Vercel
  - [ ] Check backend is running (visit Railway URL directly)
  - [ ] Check CORS is enabled (it is by default)

- [ ] **Database errors**
  - [ ] Delete `backend/data/app.db`
  - [ ] Restart backend — it will recreate

- [ ] **Railway deployment fails**
  - [ ] Check Railway logs: Dashboard → "Logs" tab
  - [ ] Verify env vars are set
  - [ ] Try redeploying

- [ ] **Vercel deployment fails**
  - [ ] Check Vercel logs: Deployments → click → "Logs"
  - [ ] Verify `VITE_API_URL` is set
  - [ ] Try redeploying

---

## 🎉 Success!

When all checkboxes are done:
- ✅ Local app running at http://localhost:3000
- ✅ Backend live on Railway
- ✅ Frontend live on Vercel
- ✅ Full app working end-to-end

**Estimated time: 50 minutes**

---

## Next Steps

1. **Share your app** — send Vercel URL to friends
2. **Monitor logs** — Railway and Vercel dashboards show real-time logs
3. **Auto-deploy** — push to GitHub, both platforms auto-redeploy
4. **Custom domain** — add your own domain (optional)

Enjoy! 🚀
