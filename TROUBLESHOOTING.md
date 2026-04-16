# Troubleshooting Guide

Common issues and solutions.

---

## Local Development Issues

### "npm: command not found"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Download Node.js from [nodejs.org](https://nodejs.org)
2. Run the installer
3. Restart your terminal
4. Verify: `node --version`

---

### "Cannot find module 'express'" or similar

**Problem:** Dependencies not installed

**Solution:**
```bash
cd backend  # or frontend
npm install
```

If that doesn't work:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### "Port 5000 already in use"

**Problem:** Another app is using port 5000

**Solution:**

**Option 1: Use different port**
```bash
PORT=5001 npm run dev
```

**Option 2: Kill the process using port 5000**

Mac/Linux:
```bash
lsof -i :5000
kill -9 <PID>
```

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### Backend starts but frontend can't connect

**Problem:** CORS or API URL issue

**Solution:**

1. Check backend is actually running:
   - Visit http://localhost:5000/api/health
   - Should see: `{"status":"ok"}`

2. Check frontend env var:
   - `frontend/.env` should have: `VITE_API_URL=http://localhost:5000`
   - Restart frontend: `npm run dev`

3. Check CORS is enabled:
   - Backend has CORS enabled by default
   - If still failing, check browser console (F12) for error details

---

### "GEMINI_API_KEY is not set"

**Problem:** API key not in .env file

**Solution:**
1. Get key from [aistudio.google.com](https://aistudio.google.com)
2. Edit `backend/.env`
3. Add: `GEMINI_API_KEY=AIzaSy...` (paste your actual key)
4. Restart backend: `npm run dev`

---

### "Invalid API key" error when uploading resume

**Problem:** API key is wrong or expired

**Solution:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Check your API key is still valid
3. If expired, create a new one
4. Update `backend/.env`
5. Restart backend

---

### Database error: "SQLITE_CANTOPEN"

**Problem:** SQLite can't create database file

**Solution:**
1. Check `backend/data/` folder exists
2. If not, create it: `mkdir -p backend/data`
3. Restart backend

---

### "Cannot read property 'targetRoles' of undefined"

**Problem:** Resume analysis failed or returned invalid data

**Solution:**
1. Check Gemini API key is correct
2. Try uploading a different resume
3. Check backend logs for error details
4. Verify resume is valid PDF or TEX

---

### Frontend shows blank page

**Problem:** Build or compilation error

**Solution:**
1. Check browser console (F12) for errors
2. Check terminal where `npm run dev` runs
3. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
4. Clear browser cache and restart

---

## Deployment Issues

### Railway deployment fails

**Problem:** Build or runtime error

**Solution:**
1. Check Railway logs: Dashboard → Logs tab
2. Common causes:
   - Missing env var (GEMINI_API_KEY, JWT_SECRET)
   - Node version mismatch
   - Dependency installation failed

**Fix:**
1. Go to Railway dashboard
2. Go to "Variables" tab
3. Verify all env vars are set
4. Click "Redeploy"

---

### "Cannot find module" error on Railway

**Problem:** Dependencies not installed during build

**Solution:**
1. Check `backend/package.json` has all dependencies
2. Verify `package-lock.json` is committed to Git
3. Try redeploying: Railway → Deployments → Redeploy

---

### Vercel deployment fails

**Problem:** Build error or missing env var

**Solution:**
1. Check Vercel logs: Deployments → click → Logs
2. Common causes:
   - Missing `VITE_API_URL` env var
   - Wrong root directory (should be `frontend`)
   - Build script error

**Fix:**
1. Go to Vercel dashboard
2. Go to "Settings" → "Environment Variables"
3. Verify `VITE_API_URL` is set to Railway backend URL
4. Click "Redeploy"

---

### Frontend can't reach backend after deployment

**Problem:** `VITE_API_URL` not set or wrong

**Solution:**
1. In Vercel, go to "Settings" → "Environment Variables"
2. Check `VITE_API_URL` = your Railway backend URL
3. Example: `https://learning-recommender-prod.up.railway.app`
4. Redeploy: Deployments → Redeploy

---

### "CORS error" in production

**Problem:** Frontend and backend domains don't match

**Solution:**
1. Go to Railway dashboard
2. Go to "Variables"
3. Update `CLIENT_URL` = your Vercel frontend URL
4. Example: `https://learning-recommender.vercel.app`
5. Save and redeploy

---

### Database file not persisting on Railway

**Problem:** SQLite file lost after redeploy

**Solution:**
- This is expected with Railway's free tier (ephemeral storage)
- For persistent storage, upgrade to paid tier or use PostgreSQL
- For now, data resets on redeploy (acceptable for testing)

---

## API Issues

### "Invalid token" error

**Problem:** JWT token expired or invalid

**Solution:**
1. Log out and log back in
2. Token expires after 7 days
3. New login generates new token

---

### Resume upload fails with "File too large"

**Problem:** Resume file > 5MB

**Solution:**
- Compress the PDF or TEX file
- Max size is 5MB

---

### "No resources found" for a topic

**Problem:** Topic not in curated database

**Solution:**
- This is normal for very specific topics
- Fallback search URLs are provided
- User can search manually on those sites

---

### Gemini API quota exceeded

**Problem:** Hit 60 requests/minute limit

**Solution:**
- Wait a minute, then try again
- Free tier has 60 req/min limit
- For production, upgrade to paid tier

---

## Browser Issues

### "Localhost refused to connect"

**Problem:** Backend not running

**Solution:**
1. Check terminal where backend runs
2. Should see: "Server running on port 5000"
3. If not, start it: `npm run dev` in `backend/` folder

---

### "Cannot POST /api/resumes/upload"

**Problem:** Backend not running or wrong URL

**Solution:**
1. Verify backend is running
2. Check `VITE_API_URL` in frontend `.env`
3. Should be: `http://localhost:5000`

---

### Resume upload hangs

**Problem:** Gemini API taking too long or failing

**Solution:**
1. Wait 30 seconds
2. If still hanging, check backend logs
3. Try uploading a smaller resume
4. Verify API key is correct

---

## Git/GitHub Issues

### "fatal: not a git repository"

**Problem:** Not in project root

**Solution:**
```bash
cd /path/to/learning-recommender
git status
```

---

### "Permission denied (publickey)"

**Problem:** SSH key not set up

**Solution:**
1. Use HTTPS instead of SSH:
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/learning-recommender.git
   ```
2. Or set up SSH key: [github.com/settings/keys](https://github.com/settings/keys)

---

### "fatal: 'origin' does not appear to be a 'git' repository"

**Problem:** Remote not set up

**Solution:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/learning-recommender.git
git push -u origin main
```

---

## Performance Issues

### App is slow

**Problem:** Could be many things

**Solution:**
1. Check network tab (F12 → Network)
2. Check if Gemini API is slow
3. Check if backend is running on Railway (not local)
4. Try clearing browser cache

---

### Resume analysis takes too long

**Problem:** Gemini API is slow or resume is large

**Solution:**
1. Try a smaller resume
2. Wait up to 30 seconds
3. Check Gemini API status: [status.cloud.google.com](https://status.cloud.google.com)

---

## Getting Help

If you're stuck:

1. **Check the logs**
   - Local: Terminal output
   - Railway: Dashboard → Logs
   - Vercel: Deployments → Logs
   - Browser: F12 → Console

2. **Check the error message carefully**
   - It usually tells you what's wrong

3. **Try restarting**
   - Stop and restart the server
   - Refresh the browser
   - Redeploy on cloud

4. **Check the docs**
   - [SETUP_GUIDE.md](SETUP_GUIDE.md) — detailed walkthrough
   - [ARCHITECTURE.md](ARCHITECTURE.md) — system design
   - [README.md](README.md) — overview

5. **Check the code**
   - Error messages usually point to the file and line number
   - Read the code around that line

---

## Still Stuck?

If none of these work:

1. **Verify all prerequisites:**
   - Node.js installed? `node --version`
   - Gemini API key valid? Test at [aistudio.google.com](https://aistudio.google.com)
   - GitHub account created? [github.com](https://github.com)
   - Railway account created? [railway.app](https://railway.app)
   - Vercel account created? [vercel.com](https://vercel.com)

2. **Start from scratch:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Restart servers

3. **Check system requirements:**
   - Node.js v16+ (check: `node --version`)
   - npm v7+ (check: `npm --version`)
   - 500MB free disk space
   - Internet connection

---

## Common Error Messages

| Error | Cause | Fix |
|---|---|---|
| `EADDRINUSE` | Port in use | Use different port: `PORT=5001 npm run dev` |
| `ENOENT` | File not found | Check file path, create if needed |
| `EACCES` | Permission denied | Check file permissions, use `sudo` if needed |
| `ETIMEDOUT` | Connection timeout | Check internet, try again |
| `ENOTFOUND` | DNS error | Check internet, check domain name |
| `401 Unauthorized` | Invalid token | Log out and log back in |
| `403 Forbidden` | Access denied | Check permissions, check CORS |
| `404 Not Found` | Endpoint doesn't exist | Check API URL, check route |
| `500 Internal Server Error` | Server error | Check backend logs |
| `CORS error` | Domain mismatch | Check `CLIENT_URL` and `VITE_API_URL` |

---

Good luck! 🚀
