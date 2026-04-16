const express = require('express')
const jwt     = require('jsonwebtoken')
const db      = require('../db/database')
const { generateLearningTopics } = require('../services/gemini')

const router = express.Router()

function optionalUserId(req) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token) return jwt.verify(token, process.env.JWT_SECRET).id
  } catch {}
  return null
}

// POST /api/learning/generate
// Body: { resumeId, selectedPathRank, availableMinutes, sourceType }
router.post('/generate', async (req, res) => {
  const { resumeId, selectedPathRank, availableMinutes, sourceType } = req.body
  if (!resumeId || !selectedPathRank || !availableMinutes)
    return res.status(400).json({ error: 'resumeId, selectedPathRank, and availableMinutes are required' })

  try {
    const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(resumeId)
    if (!row) return res.status(404).json({ error: 'Resume not found' })

    const data = JSON.parse(row.extracted_data)
    const targetRole = data.targetRoles.find((r) => r.rank === selectedPathRank)
    if (!targetRole) return res.status(400).json({ error: 'Invalid path rank' })

    const result = await generateLearningTopics({
      careerPath:      targetRole.title,
      skills:          data.skills,
      gaps:            data.identifiedGaps,
      experienceLevel: data.experienceLevel,
      availableMinutes,
      sourceType:      sourceType || 'both'
    })

    const userId = optionalUserId(req)
    const inserted = db.prepare(
      'INSERT INTO learning_paths (user_id, resume_id, career_path, path_rank, topics) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, resumeId, targetRole.title, selectedPathRank, JSON.stringify(result.topics))

    res.json({
      learningPathId: inserted.lastInsertRowid,
      careerPath:     targetRole.title,
      topics:         result.topics
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/learning/history  (logged-in users)
router.get('/history', (req, res) => {
  const userId = optionalUserId(req)
  if (!userId) return res.status(401).json({ error: 'Login required' })
  try {
    const rows = db.prepare(
      'SELECT * FROM learning_paths WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
    ).all(userId)
    rows.forEach((r) => { r.topics = JSON.parse(r.topics) })
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
