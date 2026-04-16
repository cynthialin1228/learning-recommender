import { useState } from 'react'
import api from '../api'
import './FeedbackForm.css'

export default function FeedbackForm({ topic, onComplete, onBack }) {
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/feedback', {
        topic: topic.title,
        rating,
        notes,
        sourceType: topic.sourceType || 'both',
        timeSpentMinutes: topic.estimatedMinutes
      })
      setDone(true)
    } catch {
      // Feedback is optional — don't block user on error
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="feedback-done fade-up card">
      <span className="done-icon">🎉</span>
      <h2>Great session!</h2>
      <p>Your feedback helps improve future recommendations.</p>
      <button className="btn-primary" onClick={onComplete}>
        Start a New Session →
      </button>
    </div>
  )

  return (
    <div className="feedback-page fade-up">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>

      <div className="card">
        <h2>How were the resources?</h2>
        <p className="feedback-sub">Topic: <strong>{topic.title}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <label className="label">Resource quality</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`star ${rating >= s ? 'active' : ''}`}
                  onClick={() => setRating(s)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label className="label">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Was it helpful? Too easy? Too hard? Any suggestions?"
              rows={4}
            />
          </div>

          <div className="feedback-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Submit Feedback'}
            </button>
            <button type="button" className="btn-ghost" onClick={onComplete}>
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
