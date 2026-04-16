const express = require('express')
const multer  = require('multer')
const jwt     = require('jsonwebtoken')
const db      = require('../db/database')
const { parseResume }   = require('../services/resumeParser')
const { analyzeResume } = require('../services/gemini')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase()
    ext === 'pdf' || ext === 'tex' ? cb(null, true) : cb(new Error('Only PDF and TEX files are allowed'))
  }
})

// Optionally extract userId from token (guests allowed)
function optionalUserId(req) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token) return jwt.verify(token, process.env.JWT_SECRET).id
  } catch {}
  return null
}

// POST /api/resumes/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  const userId = optionalUserId(req)
  try {
    const { text, type } = await parseResume(req.file)
    const analysis = await analyzeResume(text)

    const extracted = JSON.stringify({
      skills:          analysis.skills,
      experienceLevel: analysis.experienceLevel,
      background:      analysis.background,
      education:       analysis.education,
      targetRoles:     analysis.targetRoles,
      identifiedGaps:  analysis.identifiedGaps
    })

    const result = db.prepare(
      'INSERT INTO resumes (user_id, file_name, file_type, extracted_data) VALUES (?, ?, ?, ?)'
    ).run(userId, req.file.originalname, type, extracted)

    res.status(201).json({
      resumeId: result.lastInsertRowid,
      analysis: JSON.parse(extracted)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/resumes/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id)
    if (!row) return res.status(404).json({ error: 'Resume not found' })
    row.extracted_data = JSON.parse(row.extracted_data)
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/resumes  (logged-in users — their history)
router.get('/', (req, res) => {
  const userId = optionalUserId(req)
  if (!userId) return res.status(401).json({ error: 'Login required' })
  try {
    const rows = db.prepare('SELECT * FROM resumes WHERE user_id = ? ORDER BY uploaded_at DESC').all(userId)
    rows.forEach((r) => { r.extracted_data = JSON.parse(r.extracted_data) })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
