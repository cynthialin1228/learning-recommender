# Plan A: Complete Summary

Your step-by-step guide to build and deploy LearnPath.

---

## 📋 What You're Building

**LearnPath** — An AI-powered learning recommender that:
1. Analyzes your resume (PDF or TEX)
2. Infers 3 career paths (ranked by fit)
3. Generates personalized learning topics
4. Finds free resources (MIT OCW, freeCodeCamp, Khan Academy, YouTube)
5. Collects feedback to improve recommendations

**Tech Stack:**
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite (file-based, zero setup)
- AI: Google Gemini (free tier)
- Hosting: Railway (backend) + Vercel (frontend)

**Cost: $0/month** ✅

---

## 🎯 Plan A: Local + Cloud (Recommended)

### Phase 1: Local Development (30 min)
- Install Node.js
- Get Gemini API key
- Setup backend locally
- Setup frontend locally
- Test at http://localhost:3000

### Phase 2: GitHub (5 min)
- Create GitHub repo
- Push code

### Phase 3: Deploy Backend (10 min)
- Deploy to Railway
- Set env vars
- Get live URL

### Phase 4: Deploy Frontend (5 min)
- Deploy to Vercel
- Set env vars
- Get live URL

### Phase 5: Final Config (5 min)
- Update backend's CLIENT_URL
- Test live app

**Total: ~55 minutes**

---

## 📚 Documentation Files

| File | Purpose | Read When |
|---|---|---|
| **QUICK_START.md** | 5-min overview | Starting out |
| **SETUP_GUIDE.md** | Detailed walkthrough | Following along |
| **DEPLOYMENT_CHECKLIST.md** | Track progress | Doing the setup |
| **TROUBLESHOOTING.md** | Fix problems | Something breaks |
| **ARCHITECTURE.md** | System design | Understanding how it works |
| **README.md** | Project overview | General info |

---

## 🚀 Quick Reference

### Prerequisites
- [ ] Node.js installed ([nodejs.org](https://nodejs.org))
- [ ] Gemini API key ([aistudio.google.com](https://aistudio.google.com))
- [ ] GitHub account ([github.com](https://github.com))
- [ ] Railway account ([railway.app](https://railway.app))
- [ ] Vercel account ([vercel.com](https://vercel.com))

### Local Commands
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev

# Test
Open http://localhost:3000
```

### Deployment Commands
```bash
# Push to GitHub
git init && git add . && git commit -m "Initial" && git push -u origin main

# Then:
# 1. Connect Railway to GitHub repo
# 2. Connect Vercel to GitHub repo
# 3. Set env vars in both
# 4. Done!
```

---

## 📁 Project Structure

```
learning-recommender/
├── backend/
│   ├── db/
│   │   └── database.js          ← SQLite setup
│   ├── routes/
│   │   ├── auth.js              ← Login/register
│   │   ├── resume.js            ← Upload & analyze
│   │   ├── learning.js          ← Generate topics
│   │   ├── resources.js         ← Search resources
│   │   └── feedback.js          ← Collect feedback
│   ├── services/
│   │   ├── gemini.js            ← AI analysis
│   │   ├── resumeParser.js      ← PDF/TEX parsing
│   │   └── resources.js         ← Resource database
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/          ← 6-step wizard
│   │   ├── context/             ← Auth state
│   │   ├── api.js               ← API client
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── SETUP_GUIDE.md               ← Read this first!
├── QUICK_START.md
├── DEPLOYMENT_CHECKLIST.md
├── TROUBLESHOOTING.md
├── ARCHITECTURE.md
└── README.md
```

---

## 🔑 Environment Variables

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

## 🎬 App Flow

```
1. User uploads resume (PDF/TEX)
   ↓
2. Backend parses & analyzes with Gemini
   ↓
3. Frontend shows 3 career paths
   ↓
4. User picks path + available time
   ↓
5. Backend generates personalized topics
   ↓
6. Frontend shows topics
   ↓
7. User picks topic
   ↓
8. Backend searches curated resource database
   ↓
9. Frontend shows 2-3 free resources
   ↓
10. User rates resources & gives feedback
   ↓
11. Feedback stored (if logged in)
```

---

## 🌐 Deployment Architecture

### Local
```
Your Machine
├── Backend (localhost:5000)
│   └── SQLite (backend/data/app.db)
└── Frontend (localhost:3000)
```

### Production
```
GitHub
├── Railway (Backend)
│   ├── Node.js server
│   ├── SQLite database
│   └── Env vars
└── Vercel (Frontend)
    ├── React app
    └── Env vars
```

---

## 📊 Resource Database

The app includes a curated database of ~35 free resources:

**Text Resources:**
- MIT OpenCourseWare
- freeCodeCamp
- Khan Academy
- edX
- Stanford Online

**Video Resources:**
- YouTube (direct links)
- freeCodeCamp (YouTube)
- Nandland
- Sentdex
- Brian Douglas

**Topics Covered:**
- Algorithms & Data Structures
- Machine Learning & Deep Learning
- Web Development
- Operating Systems
- Computer Architecture
- Embedded Systems
- FPGA & Digital Logic
- Circuit Analysis
- Signal Processing
- Control Systems
- And more...

---

## ✅ Success Criteria

You'll know it's working when:

- ✅ Local app runs at http://localhost:3000
- ✅ Can upload a resume
- ✅ See 3 career paths
- ✅ Can select time and topic
- ✅ See 2-3 resource links
- ✅ Can rate resources
- ✅ Backend live on Railway
- ✅ Frontend live on Vercel
- ✅ Full app works end-to-end

---

## 🔒 Security

- ✅ Passwords hashed (bcryptjs)
- ✅ JWT tokens (7-day expiry)
- ✅ CORS enabled
- ✅ No sensitive data in logs
- ✅ SQLite file not exposed

---

## 💰 Cost Breakdown

| Service | Cost | Notes |
|---|---|---|
| Node.js | Free | Open source |
| React | Free | Open source |
| SQLite | Free | Open source |
| Gemini API | Free | 60 req/min tier |
| Railway | Free | 500 hours/month |
| Vercel | Free | Unlimited deployments |
| GitHub | Free | Public repo |
| **Total** | **$0/month** | ✅ Completely free |

---

## 🚨 Common Pitfalls

1. **Forget to set env vars** → App won't work
   - Solution: Double-check all env vars are set

2. **Use wrong API URL** → Frontend can't reach backend
   - Solution: Verify `VITE_API_URL` matches Railway URL

3. **Forget to push to GitHub** → Can't deploy
   - Solution: `git push -u origin main`

4. **Forget to redeploy after env var change** → Old config still running
   - Solution: Manually redeploy in Railway/Vercel

5. **SQLite database lost after redeploy** → Data gone
   - Solution: Expected with free tier; upgrade for persistence

---

## 📞 Getting Help

1. **Check TROUBLESHOOTING.md** — Most issues covered
2. **Check logs** — Terminal, Railway, or Vercel
3. **Read error message carefully** — Usually tells you what's wrong
4. **Try restarting** — Stop and restart servers
5. **Check prerequisites** — Node.js, API key, accounts

---

## 🎓 Learning Resources

After you deploy:

- **Learn React:** [react.dev](https://react.dev)
- **Learn Node.js:** [nodejs.org/docs](https://nodejs.org/docs)
- **Learn SQLite:** [sqlite.org](https://sqlite.org)
- **Learn Gemini API:** [ai.google.dev](https://ai.google.dev)

---

## 🎉 Next Steps

1. **Read SETUP_GUIDE.md** — Detailed walkthrough
2. **Follow the steps** — Phase 1 → Phase 5
3. **Use DEPLOYMENT_CHECKLIST.md** — Track progress
4. **If stuck, check TROUBLESHOOTING.md** — Fix issues
5. **Deploy and share!** — Send your Vercel URL to friends

---

## 📝 Notes

- This is a **free, open-source project**
- You can modify and extend it
- No credit card needed anywhere
- Everything runs on free tiers
- Perfect for learning full-stack development

---

## 🚀 Ready?

Start with **SETUP_GUIDE.md** → Follow the steps → Deploy → Done!

Good luck! 💪
