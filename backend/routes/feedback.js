const express = require('express')
const jwt     = require('jsonwebtoken')
const db      = require('../db/database')

const router = express.Router()

function optionalUserId(req) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (token) return jwt.verify(token, process.env.JWT_SECRET).id
  } catch {}
  return null
}

// POST /api/feedback
router.post('/', (req, res) => {
  const userId = optionalUserId(req)
  const { topic, resourceUrl, resourceTitle, sourceType, rating, notes, timeSpentMinutes } = req.body
  try {
    const result = db.prepare(
      `INSERT INTO feedback (user_id, topic, resource_url, resource_title, source_type, rating, notes, time_spent_minutes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(userId, topic, resourceUrl, resourceTitle, sourceType, rating, notes, timeSpentMinutes)

    res.status(201).json({ id: result.lastInsertRowid })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/feedback/history  (logged-in users)
router.get('/history', (req, res) => {
  const userId = optionalUserId(req)
  if (!userId) return res.status(401).json({ error: 'Login required' })
  try {
    const rows = db.prepare(
      'SELECT * FROM feedback WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(userId)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
