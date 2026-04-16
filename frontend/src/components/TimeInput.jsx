import { useState } from 'react'
import './TimeInput.css'

const PRESETS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
  { label: '1.5 hr', value: 90 },
  { label: '2 hr', value: 120 }
]

export default function TimeInput({ careerPath, onSubmit, onBack }) {
  const [unit, setUnit] = useState('min')
  const [amount, setAmount] = useState('')
  const [sourceType, setSourceType] = useState('both')
  const [error, setError] = useState('')

  const getMinutes = () => {
    const n = parseFloat(amount)
    return unit === 'hr' ? Math.round(n * 60) : Math.round(n)
  }

  const handlePreset = (mins) => {
    if (mins < 60) { setUnit('min'); setAmount(String(mins)) }
    else { setUnit('hr'); setAmount(String(mins / 60)) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const mins = getMinutes()
    if (!amount || isNaN(mins) || mins < 5) {
      setError('Please enter at least 5 minutes.')
      return
    }
    onSubmit({ minutes: mins, sourceType })
  }

  return (
    <div className="time-page fade-up">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>

      <div className="card">
        <h2>How much time do you have?</h2>
        <p className="time-sub">Learning path: <strong>{careerPath}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="time-presets">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`preset-btn ${getMinutes() === p.value ? 'active' : ''}`}
                onClick={() => handlePreset(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="time-custom">
            <label className="label">Or enter a custom amount</label>
            <div className="time-input-row">
              <input
                type="number"
                min="1"
                step="0.5"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError('') }}
                placeholder="e.g. 45"
              />
              <div className="unit-toggle">
                <button
                  type="button"
                  className={unit === 'min' ? 'active' : ''}
                  onClick={() => setUnit('min')}
                >
                  min
                </button>
                <button
                  type="button"
                  className={unit === 'hr' ? 'active' : ''}
                  onClick={() => setUnit('hr')}
                >
                  hr
                </button>
              </div>
            </div>
          </div>

          <div className="source-type">
            <label className="label">Preferred resource type</label>
            <div className="source-options">
              {[
                { value: 'video', label: '🎬 Videos' },
                { value: 'text', label: '📖 Text / Articles' },
                { value: 'both', label: '🔀 Both' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`source-btn ${sourceType === opt.value ? 'active' : ''}`}
                  onClick={() => setSourceType(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
            Get Recommendations →
          </button>
        </form>
      </div>
    </div>
  )
}
