# Quick Start — 5 Minute Overview

## What You Need

1. **Node.js** — [nodejs.org](https://nodejs.org) (LTS version)
2. **Gemini API Key** — [aistudio.google.com](https://aistudio.google.com) (free, no credit card)
3. **GitHub account** — [github.com](https://github.com) (free)
4. **Railway account** — [railway.app](https://railway.app) (free tier)
5. **Vercel account** — [vercel.com](https://vercel.com) (free tier)

---

## Local Development (30 min)

### Terminal 1: Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add GEMINI_API_KEY and JWT_SECRET
npm run dev
# Should say: "Server running on port 5000"
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
# Should say: "Local: http://localhost:3000/"
```

**Test:** Open http://localhost:3000 in browser ✅

---

## Deploy to Internet (15 min)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/learning-recommender.git
git push -u origin main
```

### 2. Deploy Backend (Railway)
- Go to [railway.app](https://railway.app)
- Click "Start a New Project" → "Deploy from GitHub"
- Select your repo
- Add env vars: `GEMINI_API_KEY`, `JWT_SECRET`
- Get the public URL (e.g., `https://learning-recommender-prod.up.railway.app`)

### 3. Deploy Frontend (Vercel)
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Select your repo
- Set Root Directory: `frontend`
- Add env var: `VITE_API_URL` = Railway URL from step 2
- Get the production URL (e.g., `https://learning-recommender.vercel.app`)

### 4. Update Backend
- Go back to Railway
- Update `CLIENT_URL` = Vercel URL from step 3
- Save — auto-redeploys

**Done!** Your app is live 🚀

---

## File Structure

```
learning-recommender/
├── backend/
│   ├── db/database.js          ← SQLite setup
│   ├── routes/                 ← API endpoints
│   ├── services/               ← Gemini AI, resume parser, resources
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         ← 6-step wizard UI
│   │   ├── context/            ← Auth state
│   │   └── api.js              ← API client
│   └── package.json
├── SETUP_GUIDE.md              ← Detailed guide
└── README.md                   ← Project overview
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_api_key_here
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

## Common Commands

```bash
# Backend
npm run dev          # Start dev server
npm run start        # Start production server

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "Cannot find module" | `npm install` in that folder |
| Port 5000 in use | `PORT=5001 npm run dev` |
| API key error | Check key is correct, no extra spaces |
| Frontend can't reach backend | Verify `VITE_API_URL` env var |
| Database error | Delete `backend/data/app.db`, restart |

---

## Next: Read SETUP_GUIDE.md for detailed steps

See `SETUP_GUIDE.md` for complete walkthrough with screenshots and troubleshooting.
