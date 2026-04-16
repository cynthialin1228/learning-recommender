# LearnPath — AI-Powered Learning Recommender

Upload your resume → get personalized learning topics → find free resources → give feedback.

## 🚀 Quick Start

**New here?** Start with one of these:
- **[QUICK_START.md](QUICK_START.md)** — 5-minute overview
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** — Complete step-by-step guide (local + cloud)

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend | React + Vite | Free |
| Backend | Node.js + Express | Free |
| Database | SQLite (file-based) | Free, zero setup |
| AI | Google Gemini 1.5 Flash | Free tier (60 req/min) |
| Resources | Curated database + search links | Free, no API key |

## Project Structure

```
├── backend/
│   ├── db/
│   │   └── database.js       SQLite setup + schema
│   ├── routes/               auth, resume, learning, resources, feedback
│   ├── services/
│   │   ├── gemini.js         Resume analysis + topic generation
│   │   ├── resumeParser.js   PDF + TEX text extraction
│   │   └── resources.js      Curated free resource database
│   └── server.js
└── frontend/
    └── src/
        ├── components/       6-step wizard UI
        ├── context/          Auth state
        └── api.js            Axios instance
```

## App Flow

1. **Upload Resume** — PDF or TEX, parsed locally then analyzed by Gemini
2. **Choose Career Path** — 3 AI-inferred paths ranked by fit (EE / CE / CS)
3. **Set Time** — enter minutes or hours + resource type (video / text / both)
4. **Pick a Topic** — AI-generated topics matching your skill gaps and available time
5. **View Resources** — 2-3 curated free links (MIT OCW, freeCodeCamp, Khan Academy, YouTube)
6. **Give Feedback** — rate quality, add notes; stored if logged in

## Resource Strategy

No YouTube API or paid service needed. Resources come from:
- **Curated database** — pre-vetted free links for common EE/CE/CS topics
- **Fallback search links** — direct search URLs to MIT OCW, freeCodeCamp, Khan Academy, edX, YouTube

## Deployment (Free)

- **Backend** → [Railway](https://railway.app) (free tier)
- **Frontend** → [Vercel](https://vercel.com) (free tier)
- **Database** → SQLite file ships with the backend (no external DB service needed)

See **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for complete deployment instructions.
