const express = require('express')
const { searchResources } = require('../services/resources')

const router = express.Router()

// GET /api/resources/search?query=X&sourceType=video|text|both
router.get('/search', async (req, res) => {
  const { query, sourceType } = req.query
  if (!query) return res.status(400).json({ error: 'query is required' })

  try {
    const resources = await searchResources(query, sourceType || 'both')
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
