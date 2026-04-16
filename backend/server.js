require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Initialize DB (runs CREATE TABLE IF NOT EXISTS on startup)
require('./db/database')

const authRoutes     = require('./routes/auth')
const resumeRoutes   = require('./routes/resume')
const learningRoutes = require('./routes/learning')
const resourceRoutes = require('./routes/resources')
const feedbackRoutes = require('./routes/feedback')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/resumes',   resumeRoutes)
app.use('/api/learning',  learningRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/feedback',  feedbackRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
