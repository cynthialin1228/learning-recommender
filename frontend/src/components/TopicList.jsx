import { useState, useEffect } from 'react'
import api from '../api'
import './TopicList.css'

const DIFF_COLOR = { beginner: '#48bb78', intermediate: '#63b3ed', advanced: '#fc8181' }

export default function TopicList({ resumeId, selectedPathRank, timeData, onSelect, onBack }) {
  const [topics, setTopics] = useState([])
  const [learningPathId, setLearningPathId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.post('/api/learning/generate', {
          resumeId,
          selectedPathRank,
          availableMinutes: timeData.minutes,
          sourceType: timeData.sourceType
        })
        setTopics(res.data.topics)
        setLearningPathId(res.data.learningPathId)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to generate topics.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="topics-loading fade-up">
      <div className="spinner" />
      <p>Generating personalized topics...</p>
    </div>
  )

  if (error) return (
    <div className="topics-error fade-up card">
      <p className="error">{error}</p>
      <button className="btn-ghost" onClick={onBack}>← Go Back</button>
    </div>
  )

  return (
    <div className="topics-page fade-up">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>

      <h2>Pick a Topic to Study</h2>
      <p className="topics-sub">
        {timeData.minutes} min available · {topics.length} topics suggested
      </p>

      <div className="topics-list">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="topic-card card"
            onClick={() => onSelect(topic, learningPathId)}
          >
            <div className="topic-top">
              <h3>{topic.title}</h3>
              <span
                className="diff-badge"
                style={{ background: DIFF_COLOR[topic.difficulty] + '22', color: DIFF_COLOR[topic.difficulty] }}
              >
                {topic.difficulty}
              </span>
            </div>
            <p className="topic-time">⏱ ~{topic.estimatedMinutes} min</p>
            <div className="topic-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}
