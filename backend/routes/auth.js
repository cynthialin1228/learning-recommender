const express = require('express')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const db      = require('../db/database')

const router = express.Router()

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post(
  '/register',
  [body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(req.body.email)
      if (existing) return res.status(400).json({ error: 'Email already registered' })

      const hashed = await bcrypt.hash(req.body.password, 10)
      const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(req.body.email, hashed)
      const user   = { id: result.lastInsertRowid, email: req.body.email }

      res.status(201).json({ token: signToken(user), email: user.email })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email)
      if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        return res.status(401).json({ error: 'Invalid credentials' })

      res.json({ token: signToken(user), email: user.email })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

module.exports = router
