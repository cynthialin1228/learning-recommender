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
3. Keep it **Public** (required for free Railway/Vercel)
4. Do NOT check "Add README" (you already have one)
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

When prompted, enter your GitHub username and password.

> **Note:** GitHub may ask for a Personal Access Token instead of password.
> If so: GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token → check "repo" scope → use that as your password.

✅ **Code is on GitHub!** Verify by visiting your repo URL.

---

## Step 4: Deploy Backend on Railway

Railway will automatically run `npm install` and start the server for you.

### 4a. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### 4b. Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"** → authorize Railway to access your repos
4. Select `learning-recommender`
5. Railway will ask which folder — select **`backend`** as the root
6. Click **"Deploy Now"**
7. Wait 2-3 minutes — Railway installs dependencies and starts the server

### 4c. Set Environment Variables
1. In Railway dashboard, click your project
2. Click the **"Variables"** tab
3. Click **"New Variable"** and add each one:

   | Variable | Value |
   |---|---|
   | `GEMINI_API_KEY` | Your key from Step 1 |
   | `JWT_SECRET` | Any random string, e.g. `learnpath_secret_2024` |
   | `PORT` | `5000` |
   | `CLIENT_URL` | Leave blank for now — update after Step 5 |

4. Click **"Save"** — Railway auto-redeploys

### 4d. Get Your Backend URL
1. In Railway, click **"Deployments"** tab
2. Click the active (green) deployment
3. Click **"View Logs"** — you should see `Server running on port 5000`
4. Go back, click **"Settings"** → **"Networking"** → **"Generate Domain"**
5. Copy the URL — looks like `https://learning-recommender-production.up.railway.app`
6. **Save this URL** — you need it in Step 5

✅ **Backend is live!**

---

## Step 5: Deploy Frontend on Vercel

Vercel will automatically run `npm install` and build the React app for you.

### 5a. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel

### 5b. Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `learning-recommender` → click **"Import"**
3. Under **"Root Directory"** click **"Edit"** → select `frontend` → click **"Continue"**
4. Under **"Environment Variables"** add:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Railway URL from Step 4d |

5. Click **"Deploy"**
6. Wait 1-2 minutes

### 5c. Get Your Frontend URL
1. After deploy, Vercel shows a success screen
2. Copy the URL — looks like `https://learning-recommender.vercel.app`
3. **Save this URL** — this is your live app!

✅ **Frontend is live!**

---

## Step 6: Final Configuration

### Update Backend's CLIENT_URL
1. Go back to Railway dashboard
2. Click **"Variables"** tab
3. Update `CLIENT_URL` = your Vercel URL from Step 5c
   - Example: `https://learning-recommender.vercel.app`
4. Click **"Save"** — Railway auto-redeploys (takes ~1 min)

---

## Step 7: Test Your Live App

1. Open your Vercel URL in browser
2. Try uploading a resume (PDF or TEX)
3. Go through the full flow:
   - See 3 career paths
   - Select time + resource type
   - Pick a topic
   - View resources
   - Rate resources

✅ **App is fully live!**

---

## Troubleshooting

### Railway deployment fails
1. Click **"Deployments"** → click the failed deployment → **"View Logs"**
2. Common causes:
   - Missing env var → go to Variables tab, add it, redeploy
   - Wrong start command → check `backend/Procfile` says `web: node server.js`

### Vercel deployment fails
1. Click **"Deployments"** → click failed → **"View Build Logs"**
2. Common causes:
   - Wrong root directory → should be `frontend`
   - Missing `VITE_API_URL` → add it in Settings → Environment Variables → redeploy

### App loads but resume upload fails
1. Check `GEMINI_API_KEY` is set correctly in Railway
2. Check `VITE_API_URL` points to Railway URL (not localhost)
3. Check `CLIENT_URL` in Railway matches your Vercel URL

### "CORS error" in browser console
1. Go to Railway → Variables
2. Make sure `CLIENT_URL` = your exact Vercel URL (no trailing slash)
3. Save and wait for redeploy

### GitHub push asks for password
- Use a Personal Access Token instead:
  1. GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
  2. Click "Generate new token (classic)"
  3. Check the `repo` scope
  4. Copy the token — use it as your password when pushing

---

## Auto-Deploy on Future Changes

Both Railway and Vercel watch your GitHub repo. When you push new code:
```bash
git add .
git commit -m "Update something"
git push
```
Both platforms automatically redeploy. No manual steps needed.

---

## Summary

| Step | Platform | Time | What it does |
|---|---|---|---|
| 1 | Google AI Studio | 2 min | Get Gemini API key |
| 2 | Your machine | 5 min | Install Git |
| 3 | GitHub | 5 min | Push code |
| 4 | Railway | 10 min | Deploy backend (auto npm install) |
| 5 | Vercel | 5 min | Deploy frontend (auto npm install + build) |
| 6 | Railway | 2 min | Update CLIENT_URL |
| 7 | Browser | 5 min | Test live app |

**Total: ~35 minutes. No local npm needed.**
