# LearnPath — Setup Guide (No Local npm Required)

Everything runs in the cloud. You only need Git and a browser.

---

## What You Need

| Tool | Purpose | Install |
|---|---|---|
| **Git** | Push code to GitHub | [git-scm.com](https://git-scm.com) |
| **GitHub account** | Host your code | [github.com](https://github.com) (free) |
| **Railway account** | Run the backend | [railway.app](https://railway.app) (free) |
| **Vercel account** | Host the frontend | [vercel.com](https://vercel.com) (free) |
| **Gemini API key** | AI analysis | [aistudio.google.com](https://aistudio.google.com) (free) |

No Node.js, no npm, no local installs needed.

---

## Step 1: Get Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Click **"Get API Key"** → **"Create API key in new project"**
4. Copy the key — looks like `AIzaSy...`
5. Save it somewhere (Notepad, Notes app, etc.)

---

## Step 2: Install Git (if not already)

Check if you have it:
```bash
git --version
```

If not installed:
- **Windows:** Download from [git-scm.com](https://git-scm.com) → run installer → all defaults are fine
- **Mac:** Run `xcode-select --install` in Terminal
- **Linux:** `sudo apt install git`

---

## Step 3: Push Code to GitHub

### 3a. Create GitHub Account
1. Go to [github.com](https://github.com)
2. Sign up (free)

### 3b. Create a Repository
1. Click the **"+"** icon → **"New repository"**
2. Name: `learning-recommender`
3. Keep it **Public**
4. Do NOT check "Add README"
5. Click **"Create repository"**
6. Copy the HTTPS URL shown (e.g., `https://github.com/YOUR_USERNAME/learning-recommender.git`)

### 3c. Push Your Code
Open a terminal in your project root (where `backend/` and `frontend/` folders are):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learning-recommender.git
git push -u origin main
```

---

## Step 4: Deploy Backend on Railway

### 4a. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**

### 4b. Create New Project
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `learning-recommender`
3. When asked for root directory, set it to **`backend`**
4. Click **"Deploy Now"** — wait 2-3 min

### 4c. Set Environment Variables
Go to your project → **"Variables"** tab → add:

| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | Your key from Step 1 |
| `JWT_SECRET` | Any random string e.g. `learnpath_secret_2024` |
| `PORT` | `5000` |
| `CLIENT_URL` | Leave blank for now |

### 4d. Generate a Public URL
1. Go to **"Settings"** → **"Networking"** → **"Generate Domain"**
2. Copy the URL — e.g. `https://learning-recommender-production.up.railway.app`
3. **Save this — it's your backend URL**

✅ Backend is live!

---

## Step 5: Deploy Frontend on Vercel

### 5a. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 5b. Import Project
1. Click **"Add New..."** → **"Project"**
2. Select `learning-recommender` → **"Import"**
3. Under **"Root Directory"** → click **"Edit"** → select `frontend`
4. Under **"Environment Variables"** add:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Railway URL from Step 4d — **no trailing slash, no /api suffix** |
   | | Example: `https://learning-recommender-production.up.railway.app` |

5. Click **"Deploy"** — wait 1-2 min
6. Copy your Vercel URL — e.g. `https://learning-recommender.vercel.app`

✅ Frontend is live!

---

## Step 6: Final Configuration

1. Go back to Railway → **"Variables"**
2. Set `CLIENT_URL` = your Vercel URL (e.g. `https://learning-recommender.vercel.app`)
3. Click **"Save"** — auto-redeploys

---

## Step 7: Test

Open your Vercel URL → upload a resume → go through the full flow.

---

## ⚠️ Most Common Mistake

**`VITE_API_URL` must be ONLY the Railway domain — no `/api` at the end.**

✅ Correct: `https://learning-recommender-production.up.railway.app`
❌ Wrong:   `https://learning-recommender-production.up.railway.app/api`

If you set it wrong, go to Vercel → Settings → Environment Variables → fix it → Redeploy.

---

## Troubleshooting

### Upload fails — error shows "API: not set"
- `VITE_API_URL` is not set in Vercel
- Go to Vercel → Settings → Environment Variables → add it → Redeploy

### Upload fails — error shows "API: https://..."
- Backend is unreachable or crashing
- Check Railway logs: Dashboard → Logs tab
- Verify all env vars are set in Railway

### CORS error in browser console
- `CLIENT_URL` in Railway doesn't match your Vercel URL
- Fix it in Railway → Variables → Save

### Railway deployment fails
- Check Railway logs for the error
- Make sure root directory is set to `backend`
- Verify `backend/Procfile` exists with `web: node server.js`
