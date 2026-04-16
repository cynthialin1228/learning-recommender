import './CareerPaths.css'

const FIELD_ICONS = {
  'Electrical Engineering': '⚡',
  'Computer Engineering': '🖥️',
  'Computer Science': '💻'
}

export default function CareerPaths({ paths, background, onSelect, onBack }) {
  return (
    <div className="paths-page fade-up">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back</button>

      <div className="paths-header card">
        <h2>Your Profile</h2>
        <p className="background-text">{background}</p>
      </div>

      <h3 className="section-title">Choose a Career Path</h3>
      <p className="section-sub">AI inferred these 3 paths from your resume, ranked by fit.</p>

      <div className="paths-list">
        {paths.map((path) => (
          <div
            key={path.rank}
            className="path-card card"
            onClick={() => onSelect(path)}
          >
            <div className="path-rank">#{path.rank}</div>
            <div className="path-body">
              <div className="path-title-row">
                <span className="path-icon">{FIELD_ICONS[path.field] || '🎯'}</span>
                <h3>{path.title}</h3>
              </div>
              <p className="path-field">{path.field}</p>
              <p className="path-reasoning">{path.reasoning}</p>
            </div>
            <div className="path-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}
