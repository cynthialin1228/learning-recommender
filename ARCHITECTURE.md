# LearnPath Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React App (Vite)                                        │   │
│  │  - Resume Upload                                         │   │
│  │  - Career Path Selection                                 │   │
│  │  - Time Input                                            │   │
│  │  - Topic List                                            │   │
│  │  - Resource View                                         │   │
│  │  - Feedback Form                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕ HTTP/REST                            │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Node.js)                     │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes                                              │   │
│  │  - POST /api/auth/register, /login                       │   │
│  │  - POST /api/resumes/upload                              │   │
│  │  - POST /api/learning/generate                           │   │
│  │  - GET  /api/resources/search                            │   │
│  │  - POST /api/feedback                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services                                                │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Gemini AI Service                                  │  │   │
│  │  │ - Resume analysis (extract skills, gaps, roles)   │  │   │
│  │  │ - Topic generation (personalized learning paths)  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Resume Parser                                      │  │   │
│  │  │ - PDF text extraction                              │  │   │
│  │  │ - TEX text extraction                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ Resource Search                                    │  │   │
│  │  │ - Curated database (35+ free resources)            │  │   │
│  │  │ - Keyword matching                                 │  │   │
│  │  │ - Fallback search URLs                             │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↕                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SQLite Database (better-sqlite3)                        │   │
│  │  - users (email, password)                               │   │
│  │  - resumes (file, extracted data)                         │   │
│  │  - learning_paths (topics, career path)                  │   │
│  │  - feedback (ratings, notes)                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Google Gemini API (Free Tier)                           │   │
│  │  - Resume analysis                                       │   │
│  │  - Topic generation                                      │   │
│  │  - 60 requests/min free quota                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Free Resource Links (No API)                            │   │
│  │  - MIT OpenCourseWare                                    │   │
│  │  - freeCodeCamp                                          │   │
│  │  - Khan Academy                                          │   │
│  │  - YouTube (direct links)                                │   │
│  │  - edX                                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Resume Upload & Analysis

```
User uploads PDF/TEX
        ↓
Backend receives file
        ↓
Resume Parser extracts text
        ↓
Gemini API analyzes text
        ↓
Extract: skills, experience level, gaps, 3 career paths
        ↓
Store in SQLite
        ↓
Return to frontend
```

### 2. Learning Path Generation

```
User selects career path + time available
        ↓
Backend receives request
        ↓
Gemini API generates topics
        ↓
Topics match: gaps, time, difficulty
        ↓
Store in SQLite
        ↓
Return to frontend
```

### 3. Resource Search

```
User selects topic
        ↓
Backend searches curated database
        ↓
Keyword matching scores resources
        ↓
Return top 3 matches
        ↓
If no match, return fallback search URLs
        ↓
Frontend displays links
```

### 4. Feedback Collection

```
User rates resources + adds notes
        ↓
Backend stores feedback
        ↓
Save to SQLite (if logged in)
        ↓
Improve future recommendations
```

---

## Deployment Architecture

### Local Development

```
Your Machine
├── Backend (localhost:5000)
│   └── SQLite (backend/data/app.db)
└── Frontend (localhost:3000)
```

### Production (Cloud)

```
GitHub Repository
├── Push code
├── Railway (Backend)
│   ├── Node.js server
│   ├── SQLite database
│   └── Environment variables
└── Vercel (Frontend)
    ├── React app
    └── Environment variables
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id        INTEGER PRIMARY KEY,
  email     TEXT UNIQUE,
  password  TEXT (hashed),
  created_at TEXT
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id             INTEGER PRIMARY KEY,
  user_id        INTEGER (nullable — guests allowed),
  file_name      TEXT,
  file_type      TEXT (pdf | tex),
  extracted_data TEXT (JSON),
  uploaded_at    TEXT
);
```

### Learning Paths Table
```sql
CREATE TABLE learning_paths (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER (nullable),
  resume_id   INTEGER,
  career_path TEXT,
  path_rank   INTEGER (1-3),
  topics      TEXT (JSON array),
  created_at  TEXT
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id                  INTEGER PRIMARY KEY,
  user_id             INTEGER (nullable),
  topic               TEXT,
  resource_url        TEXT,
  resource_title      TEXT,
  source_type         TEXT (video | text),
  rating              INTEGER (1-5),
  notes               TEXT,
  time_spent_minutes  INTEGER,
  created_at          TEXT
);
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login

### Resumes
- `POST /api/resumes/upload` — Upload & analyze resume
- `GET /api/resumes/:id` — Get resume details
- `GET /api/resumes` — Get user's resume history (auth required)

### Learning
- `POST /api/learning/generate` — Generate topics for career path
- `GET /api/learning/history` — Get user's learning history (auth required)

### Resources
- `GET /api/resources/search?query=X&sourceType=video|text|both` — Search resources

### Feedback
- `POST /api/feedback` — Submit feedback
- `GET /api/feedback/history` — Get user's feedback history (auth required)

---

## Technology Choices

| Component | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast, modern, great DX |
| Backend | Express | Lightweight, easy to deploy |
| Database | SQLite | Zero setup, file-based, perfect for small apps |
| AI | Gemini | Free tier, no credit card, good quality |
| Resources | Curated DB | No API quota limits, always available |
| Auth | JWT | Stateless, works everywhere |
| Hosting | Railway + Vercel | Free tier, auto-deploy from GitHub |

---

## Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for auth (7-day expiry)
- ✅ CORS enabled for frontend domain
- ✅ No sensitive data in logs
- ✅ SQLite file not exposed to web
- ✅ Resume text not stored (only analysis)

---

## Scalability Notes

Current setup handles:
- ~1000 concurrent users (SQLite limitation)
- ~10,000 resumes analyzed/month (Gemini free quota)
- ~100GB storage (SQLite file size)

To scale beyond:
- Replace SQLite with PostgreSQL
- Add caching layer (Redis)
- Implement rate limiting
- Use job queue for async processing

---

## Monitoring & Logs

### Local Development
- Backend logs: Terminal where `npm run dev` runs
- Frontend logs: Browser console (F12)

### Production
- Railway: Dashboard → Logs tab (real-time)
- Vercel: Deployments → click → Logs tab
- Database: SQLite file at `backend/data/app.db`

---

## Backup & Recovery

### Local
- Commit `backend/data/app.db` to Git (optional)
- Or regenerate from feedback data

### Production
- Railway auto-backs up SQLite file
- Vercel has deployment history
- GitHub has code history

---

## Cost Breakdown

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

## Future Enhancements

- [ ] User dashboard with learning history
- [ ] Recommendation algorithm improvements
- [ ] Integration with Coursera/Udemy APIs
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Social sharing
- [ ] Admin panel for resource curation
- [ ] Analytics dashboard
