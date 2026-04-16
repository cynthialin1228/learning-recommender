require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Initialize DB (runs CREATE TABLE IF NOT EXISTS on startup)
try {
  require('./db/database')
  console.log('✓ Database initialized')
} catch (err) {
  console.error('✗ Database initialization failed:', err.message)
  process.exit(1)
}

const authRoutes     = require('./routes/auth')
const resumeRoutes   = require('./routes/resume')
const learningRoutes = require('./routes/learning')
const resourceRoutes = require('./routes/resources')
const feedbackRoutes = require('./routes/feedback')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json())

// Health check endpoint (no auth needed)
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
app.post('/api/health', (_, res) => res.json({ status: 'ok', method: 'POST', timestamp: new Date().toISOString() }))

// API routes
app.use('/api/auth',      authRoutes)
app.use('/api/resumes',   resumeRoutes)
app.use('/api/learning',  learningRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/feedback',  feedbackRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
})
