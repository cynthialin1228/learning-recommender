import { useState, useEffect } from 'react'
import api from '../api'
import './ResourceView.css'

const PLATFORM_ICONS = {
  YouTube: '▶️',
  'MIT OCW': '🎓',
  'Khan Academy': '📐',
  freeCodeCamp: '💻',
  default: '🔗'
}

export default function ResourceView({ topic, sourceType, onFeedback, onBack }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReasoning, setShowReasoning] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/api/resources/search', {
          params: { query: topic.searchQuery || topic.title, sourceType }
        })
        setResources(res.data.resources)
      } catch (err) {
        setError('Failed to load resources.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="resources-loading fade-up">
      <div className="spinner" />
      <p>Finding the best free resources...</p>
    </div>
  )

  return (
    <div className="resources-page fade-up">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>

      <div className="resource-header card">
        <h2>{topic.title}</h2>
        <div className="topic-meta">
          <span className="meta-tag">⏱ ~{topic.estimatedMinutes} min</span>
          <span className="meta-tag">{topic.difficulty}</span>
        </div>
        {topic.reasoning && (
          <div className="reasoning-section">
            <button
              className="reasoning-toggle"
              onClick={() => setShowReasoning(!showReasoning)}
            >
              {showReasoning ? '▲ Hide reasoning' : '▼ Why this topic?'}
            </button>
            {showReasoning && <p className="reasoning-text">{topic.reasoning}</p>}
          </div>
        )}
      </div>

      <h3 className="resources-title">Free Resources</h3>

      {error && <p className="error">{error}</p>}

      <div className="resources-list">
        {resources.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-card card"
          >
            <div className="resource-icon">
              {PLATFORM_ICONS[r.platform] || PLATFORM_ICONS.default}
            </div>
            <div className="resource-body">
              <div className="resource-platform">{r.platform}</div>
              <h4 className="resource-title">{r.title}</h4>
              {r.description && (
                <p className="resource-desc">{r.description.slice(0, 100)}...</p>
              )}
            </div>
            <span className="resource-type-badge">{r.sourceType}</span>
          </a>
        ))}
      </div>

      <button className="btn-primary" onClick={onFeedback} style={{ marginTop: '8px' }}>
        Rate These Resources →
      </button>
    </div>
  )
}
